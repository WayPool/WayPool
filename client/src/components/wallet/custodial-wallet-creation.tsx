import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "@/hooks/use-translation";
import { apiRequest } from "@/lib/queryClient";
import { Loader2, Shield, Key, CheckCircle, UserPlus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import { PasswordRecoveryDialog } from "./password-recovery-dialog";
import RecoveryDialog from "@/components/auth/recovery-dialog";
import { APP_NAME } from "@/utils/app-config";
import { walletLoginTranslations } from "@/translations/wallet-login-translations";

// Esquema de validación para el registro
const registrationSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z
    .string()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .regex(/[A-Z]/, "Debe contener al menos una mayúscula")
    .regex(/[a-z]/, "Debe contener al menos una minúscula")
    .regex(/[0-9]/, "Debe contener al menos un número")
    .regex(/[^A-Za-z0-9]/, "Debe contener al menos un carácter especial")
    .refine(
      (password) => {
        // Verificar que no tenga secuencias obvias
        const commonSequences = ['123456', 'abcdef', 'qwerty'];
        return !commonSequences.some(seq => password.toLowerCase().includes(seq));
      },
      { message: "No debe contener secuencias obvias (123456, abcdef, qwerty)" }
    ),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

// Esquema de validación para el inicio de sesión
const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(1, "Contraseña requerida"),
});

// Función para evaluar la fortaleza de la contraseña
const evaluatePasswordStrength = (password: string): { 
  score: number;
  color: string;
  label: string;
} => {
  if (!password) return { score: 0, color: 'bg-slate-600', label: 'No password' };
  
  let score = 0;
  
  // Longitud: 0-3 puntos
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (password.length >= 16) score += 1;
  
  // Complejidad: 0-4 puntos
  if (/[A-Z]/.test(password)) score += 1; // Mayúsculas
  if (/[a-z]/.test(password)) score += 1; // Minúsculas
  if (/[0-9]/.test(password)) score += 1; // Números
  if (/[^A-Za-z0-9]/.test(password)) score += 1; // Caracteres especiales
  
  // Patrones a evitar
  const commonSequences = ['123', 'abc', 'qwerty', 'password', 'admin'];
  if (commonSequences.some(seq => password.toLowerCase().includes(seq))) score = Math.max(0, score - 2);
  
  // Repeticiones
  if (/(.)\1{2,}/.test(password)) score = Math.max(0, score - 1); // Penalizar por repeticiones (ej: 'aaa')
  
  // Score final (0-7)
  switch (true) {
    case (score <= 1):
      return { score, color: 'bg-red-500', label: 'Muy débil' };
    case (score <= 3):
      return { score, color: 'bg-orange-500', label: 'Débil' };
    case (score <= 5):
      return { score, color: 'bg-yellow-500', label: 'Moderada' };
    case (score <= 6):
      return { score, color: 'bg-blue-500', label: 'Fuerte' };
    default:
      return { score, color: 'bg-green-500', label: 'Muy fuerte' };
  }
};

export const CustodialWalletCreation = ({ 
  isOpen,
  onClose,
  onSuccess,
}: { 
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (walletAddress: string, sessionToken: string) => void;
}) => {
  const [activeTab, setActiveTab] = useState<string>("login");
  const [isCreating, setIsCreating] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [step, setStep] = useState(1);
  const [isRecoveryDialogOpen, setIsRecoveryDialogOpen] = useState(false);
  const [isSeedPhraseRecoveryOpen, setIsSeedPhraseRecoveryOpen] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, color: 'bg-slate-600', label: 'No password' });
  const { toast } = useToast();
  const { language } = useTranslation();
  
  // Obtener traducciones para el idioma actual
  const t = walletLoginTranslations[language] || walletLoginTranslations.es;

  // Form para crear billetera
  const createForm = useForm<z.infer<typeof registrationSchema>>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Form para iniciar sesión
  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Function to create wallet
  const handleCreateWallet = async (values: z.infer<typeof registrationSchema>) => {
    setIsCreating(true);
    
    try {
      console.log("Sending wallet creation request...");
      
      // Call endpoint to create custodial wallet
      const response = await apiRequest("POST", "/api/custodial-wallet/register", {
        email: values.email,
        password: values.password,
      });
      
      console.log("Response received:", response);
      
      // Verify if the response contains necessary data
      if (response && response.success && response.walletAddress) {
        // If sessionToken is not present, we use an empty string (although this shouldn't happen)
        const sessionToken = response.sessionToken || "";
        
        console.log("Wallet created successfully:", {
          walletAddress: response.walletAddress,
          hasToken: !!sessionToken
        });
        
        toast({
          title: "Wallet creada con éxito / Wallet created successfully",
          description: `Tu billetera ${APP_NAME} está lista para usar.
          
Your ${APP_NAME} wallet is ready to use.`,
        });
        
        // Pass control to the app with the wallet address and session token
        onSuccess(response.walletAddress, sessionToken);
      } else if (response && response.error) {
        // Specific error returned by the server
        throw new Error(response.error);
      } else {
        // Unexpected response
        console.error("Unexpected server response:", response);
        throw new Error("Invalid response format from server");
      }
    } catch (error: any) {
      console.error("Error creating wallet:", error);
      
      // Mostrar mensajes específicos según el tipo de error
      if (error.message && error.message.includes("email ya está registrado")) {
        toast({
          title: "Email ya registrado / Email already registered",
          description: `Este email ya está asociado a una billetera. Por favor, usa otro email o inicia sesión.
          
This email is already associated with a wallet. Please use another email or log in.`,
          variant: "destructive",
        });
      } else if (error.message && error.message.includes("409")) {
        toast({
          title: "Email ya registrado / Email already registered",
          description: `Este email ya está asociado a una billetera. Por favor, usa otro email o inicia sesión.
          
This email is already associated with a wallet. Please use another email or log in.`,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error / Error",
          description: error.message || `No se pudo crear la billetera. Por favor, intenta de nuevo.
          
Could not create the wallet. Please try again.`,
          variant: "destructive",
        });
      }
    } finally {
      setIsCreating(false);
    }
  };

  // Function to log in
  const handleLogin = async (values: z.infer<typeof loginSchema>) => {
    setIsLoggingIn(true);
    
    try {
      console.log("Sending login request...");
      
      // Call endpoint to login
      const response = await apiRequest("POST", "/api/custodial-wallet/login", {
        email: values.email,
        password: values.password,
      });
      
      console.log("Response received:", response);
      
      // Verify if the response contains necessary data
      if (response && response.success && response.walletAddress) {
        // The backend should always return a valid sessionToken
        const sessionToken = response.sessionToken || "";
        
        console.log("Login successful:", {
          walletAddress: response.walletAddress,
          hasToken: !!sessionToken
        });
        
        toast({
          title: "Inicio de sesión exitoso / Login successful",
          description: `Bienvenido a tu billetera ${APP_NAME}.
          
Welcome to your ${APP_NAME} wallet.`,
        });
        
        // Pass control to the app with the wallet address and session token
        onSuccess(response.walletAddress, sessionToken);
      } else if (response && response.error) {
        // Specific error returned by the server
        throw new Error(response.error);
      } else {
        // Unexpected response
        console.error("Unexpected server response:", response);
        throw new Error("Invalid response format from server");
      }
    } catch (error: any) {
      console.error("Error logging in:", error);
      
      toast({
        title: "Error de acceso / Access Error",
        description: error.message || `Credenciales incorrectas. Verifica tu email y contraseña.
        
Incorrect credentials. Verify your email and password.`,
        variant: "destructive",
      });
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Render the component based on the current step (for creation)
  const renderStep = () => {
    switch (step) {
      case 1:
        // Step 1: Basic information and password creation
        return (
          <div className="space-y-3 sm:space-y-4">
            <FormField
              control={createForm.control}
              name="email"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="text-xs sm:text-sm">Email</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" placeholder="your@email.com" className="h-8 sm:h-10 text-sm" autoComplete="off" />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
            <FormField
              control={createForm.control}
              name="password"
              render={({ field }) => {
                return (
                  <FormItem className="space-y-1.5">
                    <FormLabel className="text-xs sm:text-sm">Password</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        placeholder="********"
                        className="h-8 sm:h-10 text-sm"
                        autoComplete="new-password"
                        onChange={e => {
                          field.onChange(e);
                          setPasswordStrength(evaluatePasswordStrength(e.target.value));
                        }}
                      />
                    </FormControl>
                    
                    {/* Indicador de seguridad de contraseña */}
                    {field.value && (
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center text-xs">
                          <span>Seguridad / Security:</span>
                          <span className={`font-medium ${
                            passwordStrength.color.includes('red') ? 'text-red-500' : 
                            passwordStrength.color.includes('orange') ? 'text-orange-500' :
                            passwordStrength.color.includes('yellow') ? 'text-yellow-500' :
                            passwordStrength.color.includes('blue') ? 'text-blue-500' :
                            'text-green-500'
                          }`}>{passwordStrength.label}</span>
                        </div>
                        <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${passwordStrength.color} transition-all duration-300 ease-in-out`}
                            style={{ width: `${(passwordStrength.score / 7) * 100}%` }}
                          />
                        </div>
                        <ul className="space-y-1 text-xs text-slate-400">
                          <li className={`flex items-center ${/[A-Z]/.test(field.value) ? 'text-green-500' : 'text-slate-500'}`}>
                            <div className={`w-1 h-1 rounded-full mr-1.5 ${/[A-Z]/.test(field.value) ? 'bg-green-500' : 'bg-slate-500'}`} />
                            Mayúsculas (A-Z)
                          </li>
                          <li className={`flex items-center ${/[a-z]/.test(field.value) ? 'text-green-500' : 'text-slate-500'}`}>
                            <div className={`w-1 h-1 rounded-full mr-1.5 ${/[a-z]/.test(field.value) ? 'bg-green-500' : 'bg-slate-500'}`} />
                            Minúsculas (a-z)
                          </li>
                          <li className={`flex items-center ${/[0-9]/.test(field.value) ? 'text-green-500' : 'text-slate-500'}`}>
                            <div className={`w-1 h-1 rounded-full mr-1.5 ${/[0-9]/.test(field.value) ? 'bg-green-500' : 'bg-slate-500'}`} />
                            Números (0-9)
                          </li>
                          <li className={`flex items-center ${/[^A-Za-z0-9]/.test(field.value) ? 'text-green-500' : 'text-slate-500'}`}>
                            <div className={`w-1 h-1 rounded-full mr-1.5 ${/[^A-Za-z0-9]/.test(field.value) ? 'bg-green-500' : 'bg-slate-500'}`} />
                            Caracteres especiales (!@#$)
                          </li>
                          <li className={`flex items-center ${field.value.length >= 8 ? 'text-green-500' : 'text-slate-500'}`}>
                            <div className={`w-1 h-1 rounded-full mr-1.5 ${field.value.length >= 8 ? 'bg-green-500' : 'bg-slate-500'}`} />
                            Mínimo 8 caracteres
                          </li>
                        </ul>
                      </div>
                    )}
                    
                    <FormMessage className="text-xs" />
                  </FormItem>
                );
              }}
            />
            <FormField
              control={createForm.control}
              name="confirmPassword"
              render={({ field }) => {
                const passwordValue = createForm.getValues().password;
                const isMatching = passwordValue === field.value;
                const showMatchIndicator = field.value && passwordValue;
                
                return (
                  <FormItem className="space-y-1.5">
                    <FormLabel className="text-xs sm:text-sm">Confirmar Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          type="password"
                          placeholder="********"
                          autoComplete="new-password"
                          className={`h-8 sm:h-10 text-sm pr-8 ${showMatchIndicator ? (isMatching ? 'border-green-500 focus-visible:ring-green-500' : 'border-red-500 focus-visible:ring-red-500') : ''}`}
                        />
                        {showMatchIndicator && (
                          <div className="absolute right-2 top-1/2 -translate-y-1/2">
                            {isMatching ? (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            ) : (
                              <X className="h-4 w-4 text-red-500" />
                            )}
                          </div>
                        )}
                      </div>
                    </FormControl>
                    {showMatchIndicator && !isMatching && (
                      <p className="text-xs text-red-500">Las contraseñas no coinciden</p>
                    )}
                    <FormMessage className="text-xs" />
                  </FormItem>
                );
              }}
            />
            
            {/* Validar el formulario según criterios específicos */}
            {createForm.getValues().password && (
              <div className="mt-2 rounded-md bg-blue-950/30 border border-blue-900 p-2 text-xs text-blue-300">
                <div className="flex items-start">
                  <div className="mr-1.5 mt-0.5">
                    <Shield className="h-3 w-3 text-blue-400" />
                  </div>
                  <p>Las contraseñas en {APP_NAME} utilizan estándares de seguridad blockchain para proteger sus activos digitales.</p>
                </div>
              </div>
            )}
            
            <Button 
              type="button" 
              className="w-full mt-3 sm:mt-4 h-8 sm:h-10 text-xs sm:text-sm bg-blue-600 hover:bg-blue-700"
              onClick={() => {
                const values = createForm.getValues();
                const isPasswordMatch = values.password === values.confirmPassword;
                
                // Validate manually
                if (!values.email) {
                  createForm.setError("email", { message: "Email es requerido" });
                  return;
                }
                if (!values.password) {
                  createForm.setError("password", { message: "Password es requerido" });
                  return;
                }
                if (!values.confirmPassword) {
                  createForm.setError("confirmPassword", { message: "Confirma tu password" });
                  return;
                }
                if (!isPasswordMatch) {
                  createForm.setError("confirmPassword", { message: "Las contraseñas no coinciden" });
                  return;
                }
                
                // Comprobar fortaleza de contraseña
                if (passwordStrength.score < 4) {
                  createForm.setError("password", { message: "La contraseña no es suficientemente segura" });
                  return;
                }

                // All validated, proceed to next step
                setStep(2);
                
                // Clear errors
                createForm.clearErrors();
              }}
              disabled={!createForm.getValues().email || !createForm.getValues().password || !createForm.getValues().confirmPassword || passwordStrength.score < 4}
            >
              Continuar
            </Button>
          </div>
        );
      
      case 2:
        // Step 2: Confirmation and creation
        return (
          <div className="space-y-3 sm:space-y-4">
            {/* Encabezado con ícono de seguridad */}
            <div className="flex flex-col items-center justify-center text-center mb-2">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mb-2">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-base font-medium">Crear Wallet {APP_NAME}</h3>
              <p className="text-xs text-slate-400 mt-1">Confirmación de detalles</p>
            </div>
            
            {/* Detalles del Wallet */}
            <div className="rounded-lg bg-gradient-to-br from-slate-900 to-blue-950 p-3 sm:p-4 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h3 className="font-semibold text-xs sm:text-sm text-blue-100">Detalles del Wallet</h3>
                <div className="px-1.5 py-0.5 bg-blue-600/20 rounded text-[10px] text-blue-400 font-medium">Seguro</div>
              </div>
              
              <div className="py-1">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <span className="text-slate-400">Email:</span>
                  <span className="font-medium truncate">{createForm.getValues().email}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs mt-1.5">
                  <span className="text-slate-400">Contraseña:</span>
                  <span className="font-medium">•••••••••••••</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs mt-1.5">
                  <span className="text-slate-400">Seguridad / Security:</span>
                  <span className="font-medium text-green-500">
                    <span className={`inline-block w-2 h-2 rounded-full ${passwordStrength.color} mr-1`}></span>
                    {passwordStrength.label}
                  </span>
                </div>
              </div>
              
              <div className="mt-2 pt-2 border-t border-slate-800">
                <div className="flex items-center text-blue-400 text-xs">
                  <Shield className="mr-1.5 h-3 w-3 flex-shrink-0" />
                  <span>Cartera custodiada con seguridad avanzada</span>
                </div>
              </div>
            </div>
            
            {/* Características */}
            <div className="space-y-2 bg-slate-900/50 p-3 rounded-lg border border-slate-800">
              <h3 className="font-medium text-xs">Tu {APP_NAME} wallet incluye:</h3>
              <div className="space-y-2">
                <div className="flex items-center text-xs">
                  <CheckCircle className="mr-1.5 h-3 w-3 text-green-500 flex-shrink-0" />
                  <span>Acceso a la plataforma {APP_NAME} / Access to {APP_NAME} platform</span>
                </div>
                <div className="flex items-center text-xs">
                  <CheckCircle className="mr-1.5 h-3 w-3 text-green-500 flex-shrink-0" />
                  <span>Recuperación de acceso por email / Email recovery access</span>
                </div>
                <div className="flex items-center text-xs">
                  <CheckCircle className="mr-1.5 h-3 w-3 text-green-500 flex-shrink-0" />
                  <span>Seguridad nivel bancario / Bank-level security</span>
                </div>
                <div className="flex items-center text-xs">
                  <CheckCircle className="mr-1.5 h-3 w-3 text-green-500 flex-shrink-0" />
                  <span>Custodia de activos digitales / Digital asset custody</span>
                </div>
              </div>
            </div>
            
            {/* Nota legal */}
            <div className="text-[10px] text-slate-500 italic text-center px-2">
              Al crear un wallet, aceptas los{' '}
              <a 
                href="/terms-of-use" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-400 underline"
              >
                términos y condiciones
              </a>{' '}
              de {APP_NAME} y confirmas que has leído nuestra{' '}
              <a 
                href="/privacy-policy" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-400 underline"
              >
                política de privacidad
              </a>. / By creating a wallet, you accept the{' '}
              <a 
                href="/terms-of-use" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-400 underline"
              >
                terms and conditions
              </a>{' '}
              of {APP_NAME} and confirm that you have read our{' '}
              <a 
                href="/privacy-policy" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-400 underline"
              >
                privacy policy
              </a>.
            </div>
            
            {/* Botones de acción */}
            <div className="flex space-x-2 mt-2">
              <Button 
                type="button" 
                variant="outline" 
                className="flex-1 h-8 sm:h-10 text-xs"
                onClick={() => setStep(1)}
              >
                Atrás / Back
              </Button>
              <Button
                type="button"
                className="flex-1 h-8 sm:h-10 text-xs bg-blue-600 hover:bg-blue-700"
                disabled={isCreating}
                onClick={() => {
                  console.log("Create Wallet button clicked");
                  console.log("Form values:", createForm.getValues());
                  console.log("Form errors:", createForm.formState.errors);
                  createForm.handleSubmit(
                    handleCreateWallet,
                    (errors) => {
                      console.error("Form validation errors:", errors);
                    }
                  )();
                }}
              >
                {isCreating ? (
                  <>
                    <Loader2 className="mr-1.5 h-3 w-3 animate-spin flex-shrink-0" />
                    Creando... / Creating...
                  </>
                ) : (
                  'Crear Wallet / Create Wallet'
                )}
              </Button>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-[95vw] max-w-md bg-[#0f1729] border-slate-800 p-4 md:p-6 rounded-lg overflow-y-auto max-h-[90vh]">
        <DialogHeader className="pb-0 space-y-1">
          <DialogTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Shield className="h-5 w-5 text-blue-500 flex-shrink-0" />
            <span className="text-slate-100">{t.title}</span>
          </DialogTitle>
          <DialogDescription className="text-slate-400 text-sm">
            {t.subtitle}
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-2">
          <Tabs 
            defaultValue="login" 
            value={activeTab} 
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 mb-3 bg-[#1c2438] rounded-md h-auto">
              <TabsTrigger value="login" className="flex items-center justify-center data-[state=active]:bg-blue-600 px-2 py-1.5 text-xs sm:text-sm">
                <Key className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                <span className="truncate">Iniciar Sesión / Login</span>
              </TabsTrigger>
              <TabsTrigger value="create" className="flex items-center justify-center data-[state=active]:bg-blue-600 px-2 py-1.5 text-xs sm:text-sm">
                <UserPlus className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                <span className="truncate">Crear Wallet / Create</span>
              </TabsTrigger>
            </TabsList>
            
            {/* Content for creating a new wallet */}
            <TabsContent value="create">
              <div className="space-y-3 sm:space-y-4">
                <Form {...createForm}>
                  <form onSubmit={(e) => e.preventDefault()} className="space-y-3 sm:space-y-4">
                    {renderStep()}
                  </form>
                </Form>
              </div>
            </TabsContent>
            
            {/* Content for logging in with an existing wallet */}
            <TabsContent value="login">
              <div className="space-y-3 sm:space-y-4">
                <Form {...loginForm}>
                  <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-3 sm:space-y-4">
                    <FormField
                      control={loginForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem className="space-y-1.5">
                          <FormLabel className="text-xs sm:text-sm">Email / Correo</FormLabel>
                          <FormControl>
                            <Input {...field} type="email" placeholder="your@email.com" className="h-8 sm:h-10 text-sm" autoComplete="off" />
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={loginForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem className="space-y-1.5">
                          <FormLabel className="text-xs sm:text-sm">Contraseña / Password</FormLabel>
                          <FormControl>
                            <Input {...field} type="password" placeholder="********" className="h-8 sm:h-10 text-sm" />
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />
                    <Button 
                      type="submit" 
                      className="w-full mt-3 sm:mt-4 h-8 sm:h-10 text-xs sm:text-sm"
                      disabled={isLoggingIn}
                    >
                      {isLoggingIn && <Loader2 className="mr-1.5 h-3 w-3 sm:h-4 sm:w-4 animate-spin" />}
                      {isLoggingIn ? 'Iniciando sesión... / Logging in...' : 'Iniciar Sesión / Login'}
                    </Button>
                  </form>
                </Form>
                
                <div className="mt-3 pt-3 border-t border-slate-700">
                  <div className="flex flex-col gap-2">
                    <p className="text-xs text-slate-400">¿Problemas para acceder? / Access problems?</p>
                    <div className="grid grid-cols-1 gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="h-8 text-xs justify-start"
                        onClick={() => setIsRecoveryDialogOpen(true)}
                      >
                        <span className="mr-2">🔑</span>
                        ¿Olvidaste tu contraseña? / Forgot password?
                      </Button>

                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="flex justify-center mt-3 sm:mt-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-300 h-7 sm:h-8 text-xs"
          >
            <X className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
            Volver / Back
          </Button>
        </div>
        
        {/* Password recovery dialog */}
        <PasswordRecoveryDialog 
          isOpen={isRecoveryDialogOpen} 
          onClose={() => setIsRecoveryDialogOpen(false)} 
        />
        
        {/* Seed phrase recovery dialog */}
        <RecoveryDialog 
          open={isSeedPhraseRecoveryOpen} 
          onOpenChange={setIsSeedPhraseRecoveryOpen} 
        />
      </DialogContent>
    </Dialog>
  );
};