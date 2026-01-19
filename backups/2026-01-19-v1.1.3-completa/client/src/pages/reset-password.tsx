import { useState, useEffect } from "react";
import { useLocation, useParams } from "wouter";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { KeyRound, Check, AlertCircle, ArrowLeft } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import PublicPageWrapper from "@/components/layout/public-page-wrapper";

// Esquema de validación para el restablecimiento de contraseña
const resetPasswordSchema = z.object({
  password: z.string()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .regex(/[A-Z]/, "Debe incluir al menos una letra mayúscula")
    .regex(/[a-z]/, "Debe incluir al menos una letra minúscula")
    .regex(/[0-9]/, "Debe incluir al menos un número"),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"]
});

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

// Componente principal
export default function ResetPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [isTokenValid, setIsTokenValid] = useState<boolean | null>(null);
  const [tokenError, setTokenError] = useState<string | null>(null);
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const params = useParams();

  // Estado para almacenar información del email (si se obtiene del endpoint de verificación)
  const [email, setEmail] = useState<string | null>(null);

  // Extraer token de la URL en la carga inicial
  useEffect(() => {
    // Intentar obtener el token de los parámetros de ruta (/:token)
    const pathToken = params.token;
    
    // Si no hay token en la ruta, buscar en los query params (compatibilidad con versión anterior)
    if (!pathToken) {
      const queryParams = new URLSearchParams(window.location.search);
      const queryToken = queryParams.get("token");
      
      if (!queryToken) {
        setTokenError("Token de recuperación no encontrado en la URL");
        setIsTokenValid(false);
        return;
      }
      
      setToken(queryToken);
      verifyToken(queryToken);
    } else {
      // Usar el token de la ruta
      setToken(pathToken);
      verifyToken(pathToken);
    }
  }, [params]);
  
  // Función para verificar la validez del token
  const verifyToken = async (tokenToVerify: string) => {
    try {
      setIsLoading(true);
      console.log("Verificando token:", tokenToVerify);
      
      const data = await apiRequest(
        "GET", 
        `/api/custodial-wallet/recovery/verify/${tokenToVerify}`
      );
      
      // apiRequest ya maneja la conversión a JSON y verificación de errores
      if (data.success) {
        setIsTokenValid(true);
        setEmail(data.email || null);
      } else {
        setIsTokenValid(false);
        setTokenError(data.error || "Token inválido o expirado");
      }
    } catch (error: any) {
      console.error("Error verificando token:", error);
      setIsTokenValid(false);
      setTokenError(error.message || "Error al verificar el token de recuperación");
    } finally {
      setIsLoading(false);
    }
  };

  // Configurar formulario
  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: ""
    }
  });

  // Función para manejar el envío del formulario
  const onSubmit = async (values: ResetPasswordFormValues) => {
    if (!token) return;
    
    try {
      setIsLoading(true);
      
      const data = await apiRequest("POST", "/api/custodial-wallet/recovery/reset", {
        token,
        password: values.password
      });
      
      // apiRequest ya maneja la conversión a JSON y verificación de errores
      if (data.success) {
        setIsSuccess(true);
        toast({
          title: "Contraseña restablecida",
          description: "Tu contraseña ha sido actualizada correctamente",
          variant: "default",
          className: "bg-green-600",
        });
      } else {
        toast({
          title: "Error al restablecer contraseña",
          description: data.error || "No se pudo restablecer la contraseña",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Error reseteando contraseña:", error);
      toast({
        title: "Error en el servidor",
        description: error.message || "No se pudo procesar la solicitud",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Volver a la página principal
  const handleReturnHome = () => {
    navigate("/");
  };

  // Render según estado (cargando, token inválido, formulario, éxito)
  return (
    <PublicPageWrapper>
      <div className="container max-w-lg py-10">
        <Card className="border-slate-800 bg-slate-950/90 backdrop-blur-md shadow-2xl">
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <KeyRound className="h-5 w-5 text-blue-500" />
              <CardTitle className="text-slate-100">Restablecer Contraseña</CardTitle>
            </div>
            <CardDescription className="text-slate-400">
              {isSuccess ? "Tu contraseña ha sido actualizada" : "Crea una nueva contraseña segura para tu cuenta"}
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {isLoading && !isSuccess && (
              <div className="flex flex-col items-center justify-center py-8">
                <div className="h-8 w-8 mb-4 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
                <p className="text-slate-300">Verificando información...</p>
              </div>
            )}
            
            {!isLoading && isTokenValid === false && (
              <div className="py-6 text-center">
                <div className="flex justify-center mb-4">
                  <div className="h-12 w-12 rounded-full bg-red-500/10 flex items-center justify-center">
                    <AlertCircle className="h-6 w-6 text-red-500" />
                  </div>
                </div>
                <h3 className="text-lg font-medium text-slate-200 mb-2">Token inválido</h3>
                <p className="text-slate-400 mb-4">{tokenError || "El enlace de recuperación no es válido o ha expirado."}</p>
                
                <div className="bg-slate-900/60 rounded-md p-3 mb-4 text-center">
                  <p className="text-sm text-slate-300 mb-2">
                    ¿Has recibido un código de recuperación en tu email?
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      // Mostrar enlace de recuperación al inicio
                      navigate("/");
                      // Añadir parámetro a URL para indicar recuperación directa
                      window.location.search = "?recovery=direct";
                    }}
                    className="border-blue-700 text-blue-400 hover:bg-blue-900/20"
                  >
                    <KeyRound className="h-4 w-4 mr-2" />
                    Usar código de recuperación
                  </Button>
                </div>
                
                <Button onClick={handleReturnHome}>Volver al inicio</Button>
              </div>
            )}
            
            {!isLoading && isTokenValid && !isSuccess && (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  {email && (
                    <div className="bg-slate-900/60 rounded-md p-3 mb-4">
                      <p className="text-sm text-slate-300">
                        Restableciendo contraseña para: <span className="font-medium text-blue-400">{email}</span>
                      </p>
                    </div>
                  )}
                  
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-300">Nueva contraseña</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="password"
                            placeholder="********"
                            className="bg-slate-900 border-slate-700 text-slate-100"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-300">Confirmar contraseña</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="password"
                            placeholder="********"
                            className="bg-slate-900 border-slate-700 text-slate-100"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="bg-slate-900/60 rounded-md p-3 mt-4">
                    <h4 className="text-sm font-medium text-slate-300 mb-2">Requerimientos de seguridad:</h4>
                    <ul className="text-xs text-slate-400 space-y-1">
                      <li className="flex items-center gap-1">
                        <Check className="h-3 w-3 text-green-500" />
                        Al menos 8 caracteres
                      </li>
                      <li className="flex items-center gap-1">
                        <Check className="h-3 w-3 text-green-500" />
                        Al menos una letra mayúscula
                      </li>
                      <li className="flex items-center gap-1">
                        <Check className="h-3 w-3 text-green-500" />
                        Al menos una letra minúscula
                      </li>
                      <li className="flex items-center gap-1">
                        <Check className="h-3 w-3 text-green-500" />
                        Al menos un número
                      </li>
                    </ul>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full mt-6" 
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-slate-200 border-t-transparent"></div>
                        Procesando...
                      </>
                    ) : (
                      "Restablecer Contraseña"
                    )}
                  </Button>
                </form>
              </Form>
            )}
            
            {!isLoading && isSuccess && (
              <div className="py-6 text-center">
                <div className="flex justify-center mb-4">
                  <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center">
                    <Check className="h-6 w-6 text-green-500" />
                  </div>
                </div>
                <h3 className="text-lg font-medium text-slate-200 mb-2">¡Contraseña actualizada!</h3>
                <p className="text-slate-400 mb-6">Tu contraseña ha sido restablecida correctamente.</p>
                <Button onClick={handleReturnHome}>Volver al inicio</Button>
              </div>
            )}
          </CardContent>
          
          <Separator className="my-1 bg-slate-800" />
          
          <CardFooter className="flex justify-between pt-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleReturnHome}
              className="text-slate-400 hover:text-slate-300"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al inicio
            </Button>
          </CardFooter>
        </Card>
      </div>
    </PublicPageWrapper>
  );
}