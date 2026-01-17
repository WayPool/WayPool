import React, { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { insertBillingProfileSchema } from '@shared/schema';
import { saveUserBillingProfile, getUserBillingProfile } from '@/lib/billing-profile-service';
import { useWallet } from '@/hooks/use-wallet';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/hooks/use-translation';
import { useAuth } from '@/context/auth-context'; // Importamos el contexto de autenticación

// Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Loader2, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

// Extender el esquema para validaciones adicionales
const billingProfileSchema = insertBillingProfileSchema.extend({
  fullName: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  taxId: z.string().min(5, 'El NIF/CIF debe tener al menos 5 caracteres'),
  address: z.string().min(5, 'La dirección debe tener al menos 5 caracteres'),
  city: z.string().min(2, 'La ciudad debe tener al menos 2 caracteres'),
  country: z.string().min(2, 'El país debe tener al menos 2 caracteres'),
});

export type BillingProfileFormValues = z.infer<typeof billingProfileSchema>;

export function BillingProfileForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const { account } = useWallet();
  const { user, isAuthenticated } = useAuth(); // Utilizamos el contexto de auth
  
  // Usar la dirección de wallet del contexto de auth primero, luego del hook de wallet
  const walletAddress = user?.walletAddress || account;
  
  const { toast } = useToast();
  const { t } = useTranslation();
  
  // Definir el formulario con react-hook-form
  const form = useForm<BillingProfileFormValues>({
    resolver: zodResolver(billingProfileSchema),
    defaultValues: {
      walletAddress: walletAddress || '',
      fullName: '',
      company: '',
      taxId: '',
      address: '',
      city: '',
      postalCode: '',
      country: '',
      phoneNumber: '',
      email: '',
      isDefault: true,
      notes: '',
    },
  });
  
  // Cargar el perfil existente
  useEffect(() => {
    const loadBillingProfile = async () => {
      if (!walletAddress || !isAuthenticated) return;
      
      setIsLoading(true);
      setFormError(null);
      
      try {
        const profile = await getUserBillingProfile(walletAddress);
        
        if (profile) {
          // Actualizar los valores del formulario con los datos del perfil existente
          form.reset({
            walletAddress: profile.walletAddress,
            fullName: profile.fullName,
            company: profile.company ?? '',
            taxId: profile.taxId,
            address: profile.address,
            city: profile.city,
            postalCode: profile.postalCode ?? '',
            country: profile.country,
            phoneNumber: profile.phoneNumber ?? '',
            email: profile.email ?? '',
            isDefault: profile.isDefault,
            notes: profile.notes ?? '',
          });
        }
      } catch (error: any) {
        console.error('Error al cargar el perfil de facturación:', error);
        // Solo mostrar error si no es un 404 (perfil no encontrado)
        if (!(error.message && error.message.startsWith('404:'))) {
          setFormError('Error al cargar el perfil de facturación. Por favor, inténtalo de nuevo.');
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    loadBillingProfile();
  }, [walletAddress, form, isAuthenticated]);
  
  // Manejar el envío del formulario
  const onSubmit = async (data: BillingProfileFormValues) => {
    if (!isAuthenticated) {
      toast({
        title: 'Error de autenticación',
        description: 'Debes iniciar sesión para guardar el perfil de facturación',
        variant: 'destructive',
      });
      return;
    }
    
    setIsLoading(true);
    setFormError(null);
    
    try {
      // Asegurarse de que la wallet address esté actualizada
      data.walletAddress = walletAddress || '';
      
      // Guardar el perfil
      const savedProfile = await saveUserBillingProfile(data);
      
      // Si llegamos aquí, todo ha ido bien
      toast({
        title: t('billing.profileSaved'),
        description: t('billing.profileSavedDesc'),
      });
    } catch (error: any) {
      console.error('Error al guardar el perfil de facturación:', error);
      
      setFormError(
        error.message || 
        'Error al guardar el perfil de facturación. Por favor, inténtalo de nuevo.'
      );
      
      // Mostrar mensaje de error
      toast({
        title: t('billing.errorSaving'),
        description: t('billing.errorSavingDesc'),
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Mostrar un mensaje si el usuario no está autenticado
  if (!isAuthenticated) {
    return (
      <Card className="w-full">
        <div className="p-6">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>No autenticado</AlertTitle>
            <AlertDescription>
              Debes iniciar sesión para gestionar tu perfil de facturación
            </AlertDescription>
          </Alert>
        </div>
      </Card>
    );
  }
  
  return (
    <Card className="w-full">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-6">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight">{t('billing.profileTitle')}</h2>
            <p className="text-muted-foreground">{t('billing.profileDesc')}</p>
          </div>
          
          {formError && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{formError}</AlertDescription>
            </Alert>
          )}
          
          {/* Nombre completo */}
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('billing.fullName')}</FormLabel>
                <FormControl>
                  <Input placeholder={t('billing.fullNamePlaceholder')} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Empresa (opcional) */}
          <FormField
            control={form.control}
            name="company"
            render={({ field: { value, onChange, ...rest } }) => (
              <FormItem>
                <FormLabel>{t('billing.company')} ({t('common.optional')})</FormLabel>
                <FormControl>
                  <Input 
                    placeholder={t('billing.companyPlaceholder')} 
                    {...rest} 
                    value={value || ''} 
                    onChange={onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* NIF/CIF */}
          <FormField
            control={form.control}
            name="taxId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('billing.taxId')}</FormLabel>
                <FormControl>
                  <Input placeholder={t('billing.taxIdPlaceholder')} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Dirección */}
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('billing.address')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('billing.addressPlaceholder')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Ciudad */}
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('billing.city')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('billing.cityPlaceholder')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Código postal (opcional) */}
            <FormField
              control={form.control}
              name="postalCode"
              render={({ field: { value, onChange, ...rest } }) => (
                <FormItem>
                  <FormLabel>{t('billing.postalCode')} ({t('common.optional')})</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder={t('billing.postalCodePlaceholder')} 
                      {...rest} 
                      value={value || ''} 
                      onChange={onChange}
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
                  <FormLabel>{t('billing.country')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('billing.countryPlaceholder')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Teléfono (opcional) */}
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field: { value, onChange, ...rest } }) => (
                <FormItem>
                  <FormLabel>{t('billing.phoneNumber')} ({t('common.optional')})</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder={t('billing.phoneNumberPlaceholder')} 
                      {...rest} 
                      value={value || ''} 
                      onChange={onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Email (opcional) */}
            <FormField
              control={form.control}
              name="email"
              render={({ field: { value, onChange, ...rest } }) => (
                <FormItem>
                  <FormLabel>{t('billing.email')} ({t('common.optional')})</FormLabel>
                  <FormControl>
                    <Input 
                      type="email" 
                      placeholder={t('billing.emailPlaceholder')} 
                      {...rest}
                      value={value || ''} 
                      onChange={onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          {/* Notas adicionales (opcional) */}
          <FormField
            control={form.control}
            name="notes"
            render={({ field: { value, onChange, ...rest } }) => (
              <FormItem>
                <FormLabel>{t('billing.notes')} ({t('common.optional')})</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder={t('billing.notesPlaceholder')}
                    className="min-h-[100px]"
                    {...rest}
                    value={value || ''} 
                    onChange={onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="flex justify-end">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('common.saving')}
                </>
              ) : t('common.save')}
            </Button>
          </div>
        </form>
      </Form>
    </Card>
  );
}