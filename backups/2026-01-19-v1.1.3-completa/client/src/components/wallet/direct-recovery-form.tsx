import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, KeyRound, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { APP_NAME } from "@/utils/app-config";

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
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

// Validation schema for direct recovery
const directRecoverySchema = z.object({
  email: z.string().email("Invalid email"),
  recoveryCode: z.string().min(6, "Code must be at least 6 characters"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must include at least one uppercase letter")
    .regex(/[a-z]/, "Must include at least one lowercase letter")
    .regex(/[0-9]/, "Must include at least one number"),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

type DirectRecoveryFormValues = z.infer<typeof directRecoverySchema>;

export function DirectRecoveryForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  // Setup form
  const form = useForm<DirectRecoveryFormValues>({
    resolver: zodResolver(directRecoverySchema),
    defaultValues: {
      email: "",
      recoveryCode: "",
      password: "",
      confirmPassword: ""
    }
  });

  // Handle form submission
  const onSubmit = async (values: DirectRecoveryFormValues) => {
    try {
      setIsLoading(true);
      
      const data = await apiRequest("POST", "/api/password-recovery/reset-direct", {
        email: values.email,
        recoveryCode: values.recoveryCode,
        newPassword: values.password
      });
      
      // apiRequest already handles JSON conversion and error checking
      if (data.success) {
        setIsSuccess(true);
        toast({
          title: "Password reset",
          description: "Your password has been updated successfully",
          variant: "default",
          className: "bg-green-600",
        });
      } else {
        toast({
          title: "Error resetting password",
          description: data.error || "Could not reset password",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Error resetting password:", error);
      toast({
        title: "Server error",
        description: error.message || "Request could not be processed",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-slate-800 bg-slate-950/90 backdrop-blur-md shadow-lg">
      <CardHeader className="p-4 sm:p-6">
        <div className="flex items-center gap-2 mb-2">
          <KeyRound className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500 flex-shrink-0" />
          <CardTitle className="text-slate-100 text-base sm:text-lg leading-tight">
            {isSuccess ? "Contraseña Restablecida / Password Reset" : `${APP_NAME} - Recuperación Directa / Direct Recovery`}
          </CardTitle>
        </div>
        <CardDescription className="text-slate-400 text-xs sm:text-sm">
          {isSuccess 
            ? "Tu contraseña ha sido actualizada exitosamente / Your password has been successfully updated" 
            : "Usa el código recibido por email para restablecer tu contraseña / Use the code from your email"}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-4 sm:p-6">
        {!isSuccess ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-300 text-xs sm:text-sm">Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="tu@email.com / your@email.com"
                        className="bg-slate-900 border-slate-700 text-slate-100 text-sm h-9 sm:h-10"
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="recoveryCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-300 text-xs sm:text-sm">Código de Recuperación / Recovery Code</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Código de 6 dígitos / 6-digit code"
                        className="bg-slate-900 border-slate-700 text-slate-100 font-mono text-sm h-9 sm:h-10"
                      />
                    </FormControl>
                    <p className="text-xs text-blue-400 mt-1 leading-tight">
                      Ingresa el código numérico de 6 dígitos que recibiste por email
                    </p>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
              
              <Separator className="my-3 bg-slate-800" />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-300 text-xs sm:text-sm">Nueva Contraseña / New Password</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        placeholder="********"
                        className="bg-slate-900 border-slate-700 text-slate-100 text-sm h-9 sm:h-10"
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-300 text-xs sm:text-sm">Confirmar Contraseña / Confirm Password</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        placeholder="********"
                        className="bg-slate-900 border-slate-700 text-slate-100 text-sm h-9 sm:h-10"
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
              
              <div className="bg-slate-900/60 rounded-md p-2 sm:p-3 mt-3">
                <h4 className="text-xs font-medium text-slate-300 mb-1 sm:mb-2">Requisitos de Seguridad:</h4>
                <ul className="text-xs text-slate-400 space-y-1">
                  <li className="flex items-start sm:items-center gap-1">
                    <Check className="h-3 w-3 text-green-500 mt-0.5 sm:mt-0 flex-shrink-0" />
                    <span>Al menos 8 caracteres / At least 8 characters</span>
                  </li>
                  <li className="flex items-start sm:items-center gap-1">
                    <Check className="h-3 w-3 text-green-500 mt-0.5 sm:mt-0 flex-shrink-0" />
                    <span>Al menos una letra mayúscula / One uppercase letter</span>
                  </li>
                  <li className="flex items-start sm:items-center gap-1">
                    <Check className="h-3 w-3 text-green-500 mt-0.5 sm:mt-0 flex-shrink-0" />
                    <span>Al menos una letra minúscula / One lowercase letter</span>
                  </li>
                  <li className="flex items-start sm:items-center gap-1">
                    <Check className="h-3 w-3 text-green-500 mt-0.5 sm:mt-0 flex-shrink-0" />
                    <span>Al menos un número / At least one number</span>
                  </li>
                </ul>
              </div>
              
              <Button 
                type="submit" 
                className="w-full mt-4 h-9 sm:h-10 text-xs sm:text-sm" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                    <span>Procesando... / Processing...</span>
                  </>
                ) : (
                  <span>Restablecer Contraseña / Reset Password</span>
                )}
              </Button>
            </form>
          </Form>
        ) : (
          <div className="py-4 sm:py-6 text-center">
            <div className="flex justify-center mb-3 sm:mb-4">
              <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-green-500/10 flex items-center justify-center">
                <Check className="h-5 w-5 sm:h-6 sm:w-6 text-green-500" />
              </div>
            </div>
            <h3 className="text-base sm:text-lg font-medium text-slate-200 mb-2">¡Contraseña Actualizada! / Password Updated!</h3>
            <p className="text-xs sm:text-sm text-slate-400 mb-4 sm:mb-6">Tu contraseña ha sido restablecida exitosamente. / Your password has been successfully reset.</p>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between p-4 pt-2 sm:p-6 sm:pt-2">
        <div className="w-full text-center text-[10px] sm:text-xs text-slate-400">
          {!isSuccess && (
            <p className="leading-tight">Este código ha sido enviado a tu email registrado. / This code has been sent to your registered email.</p>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}