import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ethers } from 'ethers';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { getUserBillingProfile, saveUserBillingProfile, verifyBillingProfile } from '@/lib/billing-profile-service';
import { insertBillingProfileSchema, BillingProfile } from '@shared/schema';
import { Badge } from '@/components/ui/badge';
import { useWallet } from '@/hooks/use-wallet';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTranslation } from '@/hooks/use-translation';

// Lista de países en orden alfabético
const COUNTRIES = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria", 
  "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", 
  "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia", 
  "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo", "Costa Rica", 
  "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt", 
  "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia", "Fiji", "Finland", "France", "Gabon", 
  "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", 
  "Haiti", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", 
  "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Korea, North", "Korea, South", "Kosovo", 
  "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", 
  "Luxembourg", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", 
  "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar", "Namibia", 
  "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Macedonia", "Norway", "Oman", 
  "Pakistan", "Palau", "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", 
  "Qatar", "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", 
  "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", 
  "South Africa", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria", "Taiwan", 
  "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", 
  "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City", 
  "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
];

// Billing profile verification statuses
type VerificationStatus = 'Pending' | 'Verified' | 'Rejected';

interface UserBillingProfileFormProps {
  onProfileSaved?: (profile: BillingProfile) => void;
  readOnly?: boolean;
  walletAddress?: string;
  profile?: BillingProfile | null;
}

export function UserBillingProfileForm({ onProfileSaved, readOnly = false, walletAddress: propWalletAddress, profile: propProfile }: UserBillingProfileFormProps) {
  const { toast } = useToast();
  const { t } = useTranslation();
  const { account, provider } = useWallet();
  
  // Extend the base schema to add form-specific validations
  const formSchema = insertBillingProfileSchema
    .extend({
      fullName: z.string().min(3, t('Full name must be at least 3 characters')),
      email: z.string().email(t('Enter a valid email')).optional().or(z.literal('')),
      taxId: z.string().optional().or(z.literal('')),
    })
    .omit({ id: true, walletAddress: true, verificationHash: true, verificationStatus: true, verificationTimestamp: true, verificationTxHash: true, createdAt: true, updatedAt: true });

  type BillingProfileFormValues = z.infer<typeof formSchema>;
  const walletAddress = propWalletAddress || account;
  const isConnected = !!walletAddress;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [profile, setProfile] = useState<BillingProfile | null>(null);
  
  // Set up form with default values
  const form = useForm<BillingProfileFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: '',
      companyName: '', // Named companyName in code but corresponds to 'company' in database
      taxId: '',
      address: '',
      city: '',
      postalCode: '',
      country: 'Spain', // Default value for Spain
      phoneNumber: '',
      email: '',
      notes: '',
    },
    mode: 'onChange',
  });
  
  // Load user profile on initialization or use the provided profile
  useEffect(() => {
    async function loadProfile() {
      // If a profile was provided through props, use it directly
      if (propProfile) {
        setProfile(propProfile);
        
        // Reset the form with the values from the provided profile
        form.reset({
          fullName: propProfile.fullName || '',
          companyName: propProfile.companyName || '',
          taxId: propProfile.taxId || '',
          address: propProfile.address || '',
          city: propProfile.city || '',
          postalCode: propProfile.postalCode || '',
          country: propProfile.country || 'Spain',
          phoneNumber: propProfile.phoneNumber || '',
          email: propProfile.email || '',
          notes: propProfile.notes || '',
        });
        
        setLoading(false);
        return;
      }

      // If no profile is provided, load from the service
      if (!isConnected || !walletAddress) {
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const userProfile = await getUserBillingProfile(walletAddress);
        
        if (userProfile) {
          // Update profile state
          setProfile(userProfile);
          
          // Reset form with loaded values
          form.reset({
            fullName: userProfile.fullName || '',
            companyName: userProfile.companyName || '',
            taxId: userProfile.taxId || '',
            address: userProfile.address || '',
            city: userProfile.city || '',
            postalCode: userProfile.postalCode || '',
            // Asegurarse de que el país esté en inglés
            country: userProfile.country === 'España' ? 'Spain' : (userProfile.country || 'Spain'),
            phoneNumber: userProfile.phoneNumber || '',
            email: userProfile.email || '',
            notes: userProfile.notes || '',
          });
        }
      } catch (error) {
        console.error('Error al cargar el perfil de facturación:', error);
        toast({
          title: 'Error',
          description: 'No se pudo cargar el perfil de facturación',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    }
    
    loadProfile();
  }, [walletAddress, isConnected, form, toast, propProfile]);
  
  // Process form submission
  async function onSubmit(values: BillingProfileFormValues) {
    if (!isConnected || !walletAddress) {
      toast({
        title: 'Error',
        description: 'Debe conectar su wallet para guardar el perfil',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      setSaving(true);
      
      // Ensure country is Spain (English) not España (Spanish)
      const formData = {
        ...values,
        country: values.country === "España" ? "Spain" : values.country,
        // Add wallet address from the connected account - required by server validation
        walletAddress
      };
      
      console.log("Enviando datos del perfil:", formData);
      
      // Create or update profile
      const savedProfile = await saveUserBillingProfile(formData);
      
      setProfile(savedProfile);
      
      toast({
        title: t('Profile saved'),
        description: t('Your billing profile has been saved successfully'),
      });
      
      // Notify parent component if needed
      if (onProfileSaved) {
        onProfileSaved(savedProfile);
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      
      toast({
        title: t('Error'),
        description: t('Could not save the billing profile'),
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  }
  
  // Verify profile with blockchain signature
  async function verifyProfile() {
    if (!isConnected || !walletAddress || !profile) {
      toast({
        title: t('Error'),
        description: t('Wallet connection is required to verify the profile'),
        variant: 'destructive',
      });
      return;
    }
    
    try {
      setVerifying(true);
      
      // Create the message with the profile data exactly as the server does
      const dataToVerify = `${walletAddress}:${profile.fullName}:${profile.email || ''}:${profile.taxId || ''}`;
      console.log('Data to verify:', dataToVerify);
      
      // Check if we have a web3 provider available
      if (!window.ethereum) {
        throw new Error(t('No Ethereum provider found in the browser'));
      }
      
      // Create a web3 provider and request signature
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      
      // Sign the original message, not the hash - to ensure compatibility with the server
      const signature = await signer.signMessage(dataToVerify);
      console.log('Generated signature:', signature);
      
      // Verify the signature on the server
      const verifiedProfile = await verifyBillingProfile(signature);
      
      // Update the profile with the verified status
      setProfile(verifiedProfile);
      
      toast({
        title: t('Profile verified'),
        description: t('Your profile has been successfully verified using blockchain'),
      });
    } catch (error) {
      console.error('Error verifying profile:', error);
      
      if ((error as Error).message.includes('User denied')) {
        toast({
          title: t('Verification canceled'),
          description: t('User denied the signature request'),
          variant: 'destructive',
        });
      } else {
        toast({
          title: t('Error'),
          description: t('Could not verify the profile'),
          variant: 'destructive',
        });
      }
    } finally {
      setVerifying(false);
    }
  }
  
  // Render an alert based on the verification status
  function renderVerificationStatus() {
    if (!profile) return null;
    
    switch (profile.verificationStatus as VerificationStatus) {
      case 'Verified':
        return (
          <Alert className="mt-4 bg-green-50">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-700">{t('Profile verified')}</AlertTitle>
            <AlertDescription className="text-green-600">
              {t('This profile has been verified through blockchain on')}{' '}
              {profile.verificationTimestamp 
                ? new Date(profile.verificationTimestamp).toLocaleString() 
                : t('fecha desconocida')}
            </AlertDescription>
          </Alert>
        );
      
      case 'Rejected':
        return (
          <Alert className="mt-4 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertTitle className="text-red-700">{t('Verification rejected')}</AlertTitle>
            <AlertDescription className="text-red-600">
              {t('The verification of this profile has been rejected. Please contact support.')}
            </AlertDescription>
          </Alert>
        );
      
      default:
        return (
          <Alert className="mt-4 bg-amber-50">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            <AlertTitle className="text-amber-700">{t('Profile pending verification')}</AlertTitle>
            <AlertDescription className="text-amber-600">
              {t('For added security, verify your profile by signing a message with your wallet')}
            </AlertDescription>
          </Alert>
        );
    }
  }
  
  if (!isConnected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t('Billing Profile')}</CardTitle>
          <CardDescription>{t('Connect your wallet to access your billing profile')}</CardDescription>
        </CardHeader>
      </Card>
    );
  }
  
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>{t('Billing Profile')}</CardTitle>
            <CardDescription>
              {t('Information for issuing invoices associated with your account')}
            </CardDescription>
          </div>
          {profile?.verificationStatus && (
            <Badge variant={profile.verificationStatus === 'Verified' ? 'default' : 'outline'}>
              {profile.verificationStatus === 'Verified' 
                ? t('Verified') 
                : profile.verificationStatus === 'Rejected' 
                  ? t('Rejected') 
                  : t('Pending')}
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">{t('Loading profile...')}</span>
          </div>
        ) : (
          <>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Nombre completo */}
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('Full Name')}</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder={t('First and last name')} 
                            {...field} 
                            disabled={readOnly || saving}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Nombre de empresa (opcional) */}
                  <FormField
                    control={form.control}
                    name="companyName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('Company (optional)')}</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder={t('Company name')}
                            {...field} 
                            disabled={readOnly || saving}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* NIF/CIF/VAT */}
                  <FormField
                    control={form.control}
                    name="taxId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('NIF/CIF/VAT (optional)')}</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder={t('Tax identification')} 
                            {...field} 
                            disabled={readOnly || saving}
                          />
                        </FormControl>
                        <FormDescription>
                          {t('Tax identification number for the invoice')}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Email */}
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('Email (optional)')}</FormLabel>
                        <FormControl>
                          <Input 
                            type="email" 
                            placeholder={t('email@example.com')} 
                            {...field} 
                            disabled={readOnly || saving}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                {/* Dirección */}
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('Address (optional)')}</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Complete address" 
                          {...field} 
                          disabled={readOnly || saving}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Ciudad */}
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('City (optional)')}</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="City" 
                            {...field} 
                            disabled={readOnly || saving}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Código postal */}
                  <FormField
                    control={form.control}
                    name="postalCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('Postal code (optional)')}</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder={t('Postal code')} 
                            {...field} 
                            disabled={readOnly || saving}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* País */}
                  <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('Country')}</FormLabel>
                        <FormControl>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                            disabled={readOnly || saving}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder={t('Select a country')} />
                            </SelectTrigger>
                            <SelectContent className="max-h-[300px]">
                              {COUNTRIES.map(country => (
                                <SelectItem key={country} value={country}>
                                  {country}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                {/* Teléfono */}
                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('Phone (optional)')}</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder={t('Phone number')} 
                          {...field} 
                          disabled={readOnly || saving}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Notas adicionales */}
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('Additional notes (optional)')}</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder={t('Special instructions or additional information')} 
                          className="min-h-[100px]" 
                          {...field} 
                          disabled={readOnly || saving}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {!readOnly && (
                  <div className="flex justify-end">
                    <Button 
                      type="submit" 
                      disabled={saving || !form.formState.isDirty}
                    >
                      {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      {t('Save profile')}
                    </Button>
                  </div>
                )}
              </form>
            </Form>
            
            {renderVerificationStatus()}
          </>
        )}
      </CardContent>
      
      {profile && profile.verificationStatus !== 'Verified' && !readOnly && (
        <CardFooter className="flex justify-end">
          <Button 
            variant="outline" 
            onClick={verifyProfile}
            disabled={verifying || !profile.fullName}
          >
            {verifying && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t('Verify with Blockchain')}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}