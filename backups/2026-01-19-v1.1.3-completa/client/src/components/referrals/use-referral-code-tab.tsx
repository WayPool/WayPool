import React, { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useReferralsTranslations } from "@/hooks/use-referrals-translations";
import { useWallet } from "@/hooks/use-wallet";
import { useToast } from "@/hooks/use-toast";

// UI Components
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles } from "lucide-react";

interface UseReferralCodeTabProps {
  isLoading: boolean;
  isError: boolean;
  referralStatus: {
    isReferred: boolean;
    referredUser?: {
      aprBoost: string;
    };
    referrerWalletAddress?: string;
  } | null;
  walletAddress: string | null;
  initialReferralCode?: string;
  onNavigateToMyCode?: () => void;
}

interface ReferredUserResponse {
  id: number;
  referralId: number;
  referredWalletAddress: string;
  joinedAt: string;
  status: "active" | "inactive";
  earnedRewards: string;
  aprBoost: string;
}

const UseReferralCodeTab: React.FC<UseReferralCodeTabProps> = ({
  isLoading,
  isError,
  referralStatus,
  walletAddress,
  initialReferralCode = "",
  onNavigateToMyCode,
}) => {
  const rt = useReferralsTranslations();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [referralCode, setReferralCode] = useState(initialReferralCode);
  const { isLoggedIn: isAuthenticated } = useWallet();
  
  // Estado para controlar si se detectó un código en la URL
  const [detectedCodeFromUrl, setDetectedCodeFromUrl] = useState<string | null>(initialReferralCode || null);
  
  // Actualizar el código cuando cambie initialReferralCode
  useEffect(() => {
    // Proteger contra errores al intentar actualizar el estado
    try {
      if (initialReferralCode) {
        console.log("UseReferralCodeTab: Recibido código inicial:", initialReferralCode);
        setReferralCode(initialReferralCode);
        setDetectedCodeFromUrl(initialReferralCode);
      }
    } catch (error) {
      console.error("Error al actualizar código inicial:", error);
      // Continuar con la ejecución normal para no bloquear la UI
    }
  }, [initialReferralCode]);
  
  // Detectar código de referido desde la URL (compatibilidad con versión anterior)
  useEffect(() => {
    // Bandera para controlar si el componente está montado
    let isMounted = true;
    
    // Retrasar ligeramente la detección para no bloquear la UI
    const timerId = setTimeout(() => {
      try {
        // Verificar si window está disponible
        if (typeof window === 'undefined' || !window.location) {
          console.warn("window o window.location no disponible en UseReferralCodeTab");
          return;
        }
        
        // Obtener parámetros de la URL de forma segura
        const params = new URLSearchParams(window.location.search);
        const codeFromUrl = params.get('code');
        
        if (codeFromUrl && isAuthenticated && !detectedCodeFromUrl && isMounted) {
          // Si hay un código en la URL y el usuario está autenticado, establecer el código
          console.log("UseReferralCodeTab: Detectado código en URL:", codeFromUrl);
          
          setReferralCode(codeFromUrl);
          setDetectedCodeFromUrl(codeFromUrl);
        }
      } catch (error) {
        // Capturar cualquier error para que la aplicación siga funcionando
        console.error("Error al detectar código en URL:", error);
      }
    }, 300);
    
    // Limpiar recursos cuando el componente se desmonta
    return () => {
      isMounted = false;
      clearTimeout(timerId);
    };
  }, [isAuthenticated, detectedCodeFromUrl]);

  // Mutación para registrar un código de referido
  const useReferralCodeMutation = useMutation({
    mutationFn: (code: string) => apiRequest('POST', '/api/referrals/users/referred', { referralCode: code }),
    onSuccess: (data: ReferredUserResponse) => {
      toast({
        title: rt.success,
        description: rt.referralCodeSuccess,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/referrals/check-referred', walletAddress] });
      setReferralCode("");
    },
    onError: (error: any) => {
      // Si el error es porque ya es un referido, tratarlo como éxito
      if (error.response?.data?.referredUser) {
        toast({
          title: rt.success,
          description: rt.alreadyReferred,
        });
        queryClient.invalidateQueries({ queryKey: ['/api/referrals/check-referred', walletAddress] });
        setReferralCode("");
        return;
      }
      
      // Para otros errores, mostrar mensaje destructivo
      toast({
        title: rt.error,
        description: error.response?.data?.error || rt.referralCodeUseError,
        variant: "destructive",
      });
    },
  });

  // Función para extraer el código de referido de una URL o input directo
  const extractReferralCode = (input: string): string => {
    if (!input) return '';
    
    try {
      // Si parece ser directamente un código de referido (formato común: xxxx-xxxx-xxxxxxx)
      // lo devolvemos inmediatamente sin más procesamiento
      const isDirectCode = /^[a-zA-Z0-9]+-[a-zA-Z0-9]+-[a-zA-Z0-9]+$/.test(input.trim());
      if (isDirectCode) {
        console.log("Input detectado como código directo:", input.trim());
        return input.trim();
      }
      
      // Primero intentar extraer directamente con expresión regular para URLs
      // Este método es más confiable con URLs mal formadas o parciales
      const codeRegex = /[?&]code=([^&\s]+)/;
      const regexMatch = input.match(codeRegex);
      
      if (regexMatch && regexMatch[1]) {
        console.log("Código extraído con regex:", regexMatch[1]);
        return regexMatch[1];
      }
      
      // Si no encontramos nada con regex, intentar con el objeto URL
      if (input.includes('http')) {
        try {
          const urlObj = new URL(input);
          const params = new URLSearchParams(urlObj.search);
          const codeFromUrl = params.get('code');
          
          if (codeFromUrl) {
            console.log("Código extraído con URL API:", codeFromUrl);
            return codeFromUrl;
          }
        } catch (e) {
          console.log("Error al analizar URL:", e);
          // Error al parsear URL, continuamos con otros métodos
        }
      }
      
      // Si no es un código directo ni una URL con código, intentamos
      // ver si es un texto con formato aproximado a un código (más flexible)
      const codigoFlexible = /[a-zA-Z0-9]{5,7}-[a-zA-Z0-9]{4,5}-[a-zA-Z0-9]{5,10}/;
      const matchFlexible = input.match(codigoFlexible);
      if (matchFlexible && matchFlexible[0]) {
        console.log("Detectado posible código en texto:", matchFlexible[0]);
        return matchFlexible[0];
      }
      
      // Si no podemos extraer nada, devolver el texto original limpio
      return input.trim();
    } catch (error) {
      // Si hay un error al procesar, devolver el texto original
      console.log("Error al extraer código de URL:", error);
      return input.trim();
    }
  };

  // Función para manejar el uso de un código de referido
  const handleUseReferralCode = async () => {
    // Verificar primero si el usuario está autenticado
    if (!isAuthenticated) {
      toast({
        title: rt.error,
        description: rt.errorNotAuthenticated,
        variant: "destructive",
      });
      return;
    }
    
    // Extraer el código de referido (sea una URL o un código)
    const cleanCode = extractReferralCode(referralCode.trim());
    
    // Verificar que el código de referido sea válido
    if (cleanCode) {
      useReferralCodeMutation.mutate(cleanCode);
    } else {
      toast({
        title: rt.error,
        description: rt.errorMissingCode,
        variant: "destructive",
      });
    }
  };

  // Obtener el aumento de APR si el usuario es un referido
  const getAprBoost = () => {
    if (!referralStatus?.isReferred || !referralStatus.referredUser) return null;
    // Convertir el valor del boost (p.ej. 1.01) a porcentaje (p.ej. 1%)
    const boostValue = parseFloat(referralStatus.referredUser.aprBoost);
    return ((boostValue - 1) * 100).toFixed(1);
  };

  // Truncar la dirección del wallet para mostrarla de forma más legible
  const truncateAddress = (address: string) => {
    return address ? `${address.substring(0, 6)}...${address.substring(address.length - 4)}` : "";
  };
  
  // Render según el estado de carga y si el usuario ya es un referido
  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="h-32 flex items-center justify-center">
            <p className="text-muted-foreground">{rt.loadingReferredUsers}</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // No mostramos el error general, ya que puede confundir al usuario cuando 
  // la API devuelve un error 400 por ya estar referido, lo cual no es un error real
  // para la experiencia del usuario
  const hasError = false;
  
  if (referralStatus?.isReferred) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{rt.alreadyReferred}</CardTitle>
          <CardDescription>
            {rt.referredBy}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="bg-primary/10 border-primary/20">
            <Sparkles className="h-4 w-4" />
            <AlertTitle>{rt.success}</AlertTitle>
            <AlertDescription>
              {rt.referralAprBoostMessage || `${rt.aprBoost} ${getAprBoost()}% ${rt.aprBoostDescription}`}
              {referralStatus.referrerWalletAddress && (
                <p className="mt-2">
                  {rt.referredByComplete?.replace("{address}", truncateAddress(referralStatus.referrerWalletAddress)) || 
                   `${rt.referredBy}: ${truncateAddress(referralStatus.referrerWalletAddress)}`}
                </p>
              )}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{rt.useReferralCodeTitle}</CardTitle>
        <CardDescription>
          {rt.enterCode}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {hasError && (
          <Alert variant="destructive" className="mb-4">
            <AlertTitle>{rt.error}</AlertTitle>
            <AlertDescription>
              {rt.referralCodeUseError}
            </AlertDescription>
          </Alert>
        )}
        
        {detectedCodeFromUrl && (
          <Alert className="mb-4 bg-success/10 border-success/20">
            <Sparkles className="h-4 w-4" />
            <AlertTitle>{rt.referralCodeDetected}</AlertTitle>
            <AlertDescription className="flex flex-col gap-2">
              <p>{rt.referralCodeFound}</p>
              <div className="flex gap-2 mt-1">
                <span className="bg-muted p-1.5 px-2 rounded font-mono text-sm">
                  {detectedCodeFromUrl}
                </span>
                <Button 
                  variant="default" 
                  size="sm"
                  onClick={handleUseReferralCode}
                  disabled={useReferralCodeMutation.isPending}
                >
                  {useReferralCodeMutation.isPending ? rt.using : rt.useCode}
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <Label htmlFor="referralCode">{rt.enterCode}</Label>
          <div className="flex space-x-2">
            <Input
              id="referralCode"
              placeholder={rt.enterCode}
              value={referralCode}
              onChange={(e) => setReferralCode(e.target.value)}
            />
            <Button 
              onClick={handleUseReferralCode}
              disabled={useReferralCodeMutation.isPending || !referralCode.trim()}
            >
              {useReferralCodeMutation.isPending ? rt.submitting : rt.submitCode}
            </Button>
          </div>
        </div>

        <Alert className="bg-primary/10 border-primary/20">
          <Sparkles className="h-4 w-4" />
          <AlertTitle>{rt.aprBoost}</AlertTitle>
          <AlertDescription>
            {rt.aprBoostDescription}
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};

export default UseReferralCodeTab;