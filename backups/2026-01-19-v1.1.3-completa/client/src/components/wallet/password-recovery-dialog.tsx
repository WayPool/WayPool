import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, KeyRound, ArrowRight, ShieldCheck, KeyIcon, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { APP_NAME } from "@/utils/app-config";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DirectRecoveryForm } from "./direct-recovery-form";

// Esquema de validación para la recuperación de contraseña
const recoverySchema = z.object({
  email: z.string().email("Email inválido")
});

interface PasswordRecoveryDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PasswordRecoveryDialog({ isOpen, onClose }: PasswordRecoveryDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("email");
  const { toast } = useToast();

  const form = useForm<z.infer<typeof recoverySchema>>({
    resolver: zodResolver(recoverySchema),
    defaultValues: {
      email: "",
    },
  });

  const handleRecovery = async (values: z.infer<typeof recoverySchema>) => {
    setIsSubmitting(true);
    
    try {
      console.log("Enviando solicitud de recuperación...");
      
      // Llamar al endpoint para recuperar contraseña
      const response = await apiRequest("POST", "/api/password-recovery/recover", {
        email: values.email,
      });
      
      console.log("Respuesta recibida:", response);
      
      if (response && response.success) {
        // En lugar de mostrar el mensaje de éxito, vamos directamente a la pestaña de código
        setActiveTab("code");
        
        const emailValue = form.getValues().email;
        
        // Prefill the email field in the code form
        document.querySelectorAll('input[placeholder="tu@email.com"]').forEach(input => {
          (input as HTMLInputElement).value = emailValue;
        });
        
        toast({
          title: "Código enviado",
          description: "Hemos enviado un código de recuperación a tu email",
        });
      } else if (response && response.error) {
        throw new Error(response.error);
      } else {
        throw new Error("Error al procesar la solicitud");
      }
    } catch (error: any) {
      console.error("Error recuperando contraseña:", error);
      
      toast({
        title: "Error",
        description: error.message || "No se pudo procesar la solicitud. Intenta nuevamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md border-slate-800 bg-slate-950 text-slate-100 shadow-xl max-w-[95vw] p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-slate-100 text-base sm:text-lg">
            <KeyRound className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500 flex-shrink-0" />
            <span className="truncate">{APP_NAME} Access Recovery</span>
          </DialogTitle>
          <DialogDescription className="text-slate-400 text-xs sm:text-sm">
            Elige un método para recuperar tu acceso / Choose a recovery method
          </DialogDescription>
        </DialogHeader>
        
        {!isSuccess ? (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-slate-900">
              <TabsTrigger value="email" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-xs px-1 sm:text-sm sm:px-3">
                <Mail className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 flex-shrink-0" />
                <span className="truncate">Por Email / By Email</span>
              </TabsTrigger>
              <TabsTrigger id="code-tab-trigger" value="code" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-xs px-1 sm:text-sm sm:px-3">
                <KeyIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 flex-shrink-0" />
                <span className="truncate">Con Código / With Code</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="email" className="pt-4">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleRecovery)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-300">Email</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="your@email.com"
                            className="bg-slate-900 border-slate-700 text-slate-100"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="text-xs text-slate-400 mt-2 p-3 bg-slate-900/50 border border-slate-800 rounded-md">
                    Te enviaremos un email con un código de recuperación para restablecer tu contraseña. / We'll send you an email with a recovery code to reset your password.
                  </div>
                  
                  <DialogFooter className="mt-6">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={onClose}
                      className="border-slate-700 text-slate-300 hover:bg-slate-900"
                    >
                      Cancelar / Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      {isSubmitting ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <ArrowRight className="mr-2 h-4 w-4" />
                      )}
                      {isSubmitting ? 'Enviando... / Sending...' : 'Enviar Email / Send Email'}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </TabsContent>
            
            <TabsContent value="code" className="pt-4">
              <DirectRecoveryForm />
            </TabsContent>
          </Tabs>
        ) : (
          <div className="space-y-4 py-4">
            <div className="rounded-lg bg-blue-950/30 border border-blue-900/50 p-4 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-950 mb-3">
                <ShieldCheck className="h-6 w-6 text-blue-400" />
              </div>
              <h3 className="text-md font-medium text-blue-200 mb-2">Solicitud Procesada / Request Processed</h3>
              <p className="text-sm text-slate-300">
                Hemos enviado un email a <span className="font-medium text-blue-300">{form.getValues().email}</span> con un código de recuperación para restablecer tu contraseña. / We've sent an email with a recovery code.
              </p>
            </div>
            
            <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-800">
              <div className="flex items-start text-xs text-slate-400">
                <div className="mr-2 mt-0.5">
                  <svg className="h-4 w-4 text-slate-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.75.75 0 00.736-.574l.258-1.036a.75.75 0 00-.736-.926H9.25a.75.75 0 000 1.5h.253l-.086.342-.107.428H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <p>
                  Si no recibes el email en unos minutos, revisa tu carpeta de spam o verifica que la dirección sea correcta. También puedes usar el código de recuperación incluido en el email. / If you don't receive the email, check your spam folder or verify the email address.
                </p>
              </div>
            </div>
            
            <div className="flex flex-col mt-6 gap-3">
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => {
                  const currentEmail = form.getValues().email;
                  form.reset({ email: currentEmail });
                  setIsSuccess(false);
                  setTimeout(() => document.getElementById('code-tab-trigger')?.click(), 100);
                }}
              >
                Ingresar Código de Recuperación / Enter Recovery Code
              </Button>
              <Button 
                onClick={onClose} 
                className="w-full border border-slate-700 hover:bg-slate-800 text-slate-300 bg-transparent"
                variant="outline"
              >
                Entendido / Got it
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}