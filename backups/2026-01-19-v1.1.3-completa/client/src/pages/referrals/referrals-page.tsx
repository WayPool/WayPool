import React, { useState, useEffect } from "react";
import { useReferralsTranslations } from "@/hooks/use-referrals-translations";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useWalletAddress } from "../../hooks/use-wallet-address";
import { useWallet } from "@/hooks/use-wallet";
import { useToast } from "@/hooks/use-toast";
import { login } from "@/lib/auth-service";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Clipboard, Copy, Share2, Users, Gift, Sparkles, ArrowRight, Wallet, Zap, BarChart3, Trophy, UserPlus, RefreshCw } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatExactCurrency } from "@/lib/utils";
import ConnectButton from "@/components/wallet/connect-button";
import ConnectModal from "@/components/wallet/connect-modal";

// Componentes personalizados para el programa de referidos
import ReferralCodeCard from "@/components/referrals/referral-code-card";
import RewardsCalculator from "@/components/referrals/rewards-calculator";
import SuccessStories from "@/components/referrals/success-stories";
import ReferralStats from "@/components/referrals/referral-stats";
import BenefitsShowcase from "@/components/referrals/benefits-showcase";
import ReferralRankSection from "@/components/referrals/referral-rank-section";
import RankBadge from "@/components/referrals/rank-badge";
import UseReferralCodeTab from "@/components/referrals/use-referral-code-tab";

// Tipos para los datos de referidos
interface Referral {
  id: number;
  referralCode: string;
  walletAddress: string;
  totalRewards: string;
  createdAt: string;
}

interface ReferredUser {
  id: number;
  referralId: number;
  referredWalletAddress: string;
  joinedAt: string;
  status: "active" | "inactive";
  earnedRewards: string;
  aprBoost: string;
}

interface ReferralStatus {
  isReferred: boolean;
  referredUser?: ReferredUser;
  referrerWalletAddress?: string;
}

// Función de ayuda para hacer click en elementos HTML de forma segura
const safeClickElement = (element: Element | null) => {
  if (element) {
    (element as HTMLButtonElement).click();
  }
};

const ReferralsPage: React.FC = () => {
  const rt = useReferralsTranslations();
  const { walletAddress } = useWalletAddress();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [referralCode, setReferralCode] = useState("");
  const { setIsModalOpen } = useWallet();

  // Consulta para obtener los referrals del usuario actual
  const { 
    data: myReferrals,
    isLoading: isLoadingReferrals,
    isError: isErrorReferrals,
    refetch: refetchMyReferrals
  } = useQuery<Referral[]>({ 
    queryKey: ['/api/referrals', walletAddress],
    enabled: !!walletAddress,
  });

  // Consulta para obtener las estadísticas de referidos
  const {
    data: referralStats,
    isLoading: isLoadingReferralStats,
    isError: isErrorReferralStats,
    error: referralStatsError,
    refetch: refetchReferralStats
  } = useQuery<{
    totalReferred: number;
    activeUsers: number;
    totalRewards: string;
    completionRate: number;
  }>({
    queryKey: ['/api/referrals/stats', walletAddress],
    enabled: !!walletAddress,
    // Transformamos los datos para manejar posibles respuestas de error
    select: (data) => {
      // Si la respuesta contiene un error pero igualmente llega como código 200
      if (!data || (data as any).error || (data as any).success === false) {
        console.warn("Error en las estadísticas de referidos:", (data as any)?.error || "ID de referido inválido");
        // Devolver valores por defecto en caso de error
        return {
          totalReferred: 0,
          activeUsers: 0,
          totalRewards: "$0.00",
          completionRate: 0
        };
      }
      return data;
    }
  });

  // Consulta para obtener los usuarios referidos
  const { 
    data: referredUsers,
    isLoading: isLoadingReferredUsers,
    isError: isErrorReferredUsers,
    refetch: refetchReferredUsers
  } = useQuery<ReferredUser[]>({ 
    queryKey: ['/api/referrals/users/referred', walletAddress],
    enabled: !!walletAddress,
    // Transformar la respuesta para adaptarse al nuevo formato
    select: (data) => {
      // Si la respuesta tiene el nuevo formato con success y data
      if (data && (data as any).success !== undefined) {
        // Si success es true, devolver el array de data
        if ((data as any).success === true) {
          return (data as any).data || [];
        } 
        // Si success es false, mostrar error y devolver array vacío
        else {
          console.warn("Error al obtener usuarios referidos:", (data as any).error || "Error desconocido");
          return [];
        }
      }
      // Si la respuesta está en el formato antiguo (array directo)
      return data || [];
    }
  });
  
  // Consulta para verificar si el usuario actual es un referido
  const { 
    data: referralStatus,
    isLoading: isLoadingReferralStatus,
    isError: isErrorReferralStatus,
    refetch: refetchReferralStatus
  } = useQuery<ReferralStatus>({ 
    queryKey: ['/api/referrals/check-referred', walletAddress],
    enabled: !!walletAddress,
  });
  
  // Función para refrescar manualmente todos los datos de referidos
  const refetchReferralData = () => {
    console.log("Actualizando datos de referidos manualmente");
    if (walletAddress) {
      refetchMyReferrals();
      refetchReferralStats();
      refetchReferredUsers();
      refetchReferralStatus();
    }
  };



  // Mutación para crear un código de referido
  const createReferralMutation = useMutation({
    mutationFn: () => {
      // Asegurar que el wallet address está definido
      if (!walletAddress) {
        console.error("No se puede crear un código de referido sin dirección de wallet");
        throw new Error("No wallet address provided");
      }
      // Pasar explícitamente la dirección de wallet en el cuerpo de la solicitud
      return apiRequest('POST', '/api/referrals', { walletAddress });
    },
    onSuccess: (data: Referral) => {
      // Log para depuración
      console.log("Código de referido creado con éxito:", data);
      
      toast({
        title: rt.referralCodeCreated,
        description: rt.referralCodeSuccess,
      });
      
      // Invalidar todas las consultas relacionadas con referidos para asegurar que se actualiza la UI
      queryClient.invalidateQueries({ queryKey: ['/api/referrals'] });
      queryClient.invalidateQueries({ queryKey: ['/api/referrals', walletAddress] });
      queryClient.invalidateQueries({ queryKey: ['/api/referrals/check-referred'] });
      queryClient.invalidateQueries({ queryKey: ['/api/referrals/check-referred', walletAddress] });
      
      // Forzar recarga de datos
      setTimeout(() => {
        refetchReferralData();
      }, 500);
    },
    onError: (error) => {
      console.error("Error al crear código de referido:", error);
      toast({
        title: rt.error,
        description: rt.referralCodeError,
        variant: "destructive",
      });
    },
  });

  // Mutación para registrar un código de referido
  const useReferralCodeMutation = useMutation({
    mutationFn: (code: string) => {
      // Asegurar que el wallet address está definido
      if (!walletAddress) {
        console.error("No se puede usar un código de referido sin dirección de wallet");
        throw new Error("No wallet address provided");
      }
      // Pasar explícitamente la dirección de wallet en el cuerpo de la solicitud
      return apiRequest('POST', '/api/referrals/users/referred', { 
        referralCode: code,
        walletAddress 
      });
    },
    onSuccess: (data) => {
      toast({
        title: rt.success,
        description: rt.referralCodeUsed,
      });
      // Invalidar todas las consultas relacionadas
      queryClient.invalidateQueries({ queryKey: ['/api/referrals/check-referred', walletAddress] });
      queryClient.invalidateQueries({ queryKey: ['/api/referrals/check-referred'] });
      
      // Refrescar todos los datos de referidos
      setTimeout(() => {
        refetchReferralData();
      }, 500);
      
      setReferralCode("");
    },
    onError: (error: any) => {
      toast({
        title: rt.error,
        description: error.response?.data?.error || rt.referralCodeUseError,
        variant: "destructive",
      });
    },
  });

  // Función para manejar la copia del código de referido
  const handleCopyReferralCode = async () => {
    if (myReferrals && myReferrals.length > 0 && myReferrals[0]?.referralCode) {
      try {
        // Crear una URL completa para facilitar el uso del código
        const referralUrl = `${window.location.origin}/referrals?code=${myReferrals[0].referralCode}`;
        await navigator.clipboard.writeText(referralUrl);
        toast({
          title: rt.copied,
          description: rt.fullReferralCopied,
        });
      } catch (err) {
        toast({
          title: rt.error,
          description: rt.errorCopying,
          variant: "destructive",
        });
      }
    }
  };

  // Función para compartir el código de referido
  const handleShareReferralCode = async () => {
    if (myReferrals && myReferrals.length > 0 && myReferrals[0]?.referralCode) {
      try {
        // Crear una URL completa con el código de referido
        const referralUrl = `${window.location.origin}/referrals?code=${myReferrals[0].referralCode}`;
        
        const shareData = {
          title: 'Waybank Referral',
          text: rt.shareText,
          url: referralUrl,
        };
        
        if (navigator.share) {
          await navigator.share(shareData);
        } else {
          // Si la API Web Share no está disponible, copiar URL completa al portapapeles
          await navigator.clipboard.writeText(referralUrl);
          toast({
            title: rt.copied,
            description: rt.fullReferralCopied,
          });
        }
      } catch (err) {
        if (err instanceof Error && err.name !== 'AbortError') {
          toast({
            title: rt.error,
            description: rt.errorSharing,
            variant: "destructive",
          });
        }
      }
    }
  };

  // Función para manejar la creación de un código de referido
  const handleCreateReferralCode = async () => {
    // Verificar primero si el usuario está autenticado usando el estado local
    if (!isAuthenticated) {
      toast({
        title: rt.error,
        description: rt.errorNotAuthenticated,
        variant: "destructive",
      });
      return;
    }
    
    // Si está autenticado, crear el código
    createReferralMutation.mutate();
  };

  // Función para manejar el uso de un código de referido
  const handleUseReferralCode = async () => {
    // Verificar primero si el usuario está autenticado usando el estado local
    if (!isAuthenticated) {
      toast({
        title: rt.error,
        description: rt.errorNotAuthenticated,
        variant: "destructive",
      });
      return;
    }
    
    // Verificar que el código de referido sea válido
    if (referralCode.trim()) {
      useReferralCodeMutation.mutate(referralCode.trim());
    } else {
      toast({
        title: rt.error,
        description: rt.errorMissingCode,
        variant: "destructive",
      });
    }
  };

  // Truncar la dirección del wallet para mostrarla de forma más legible
  const truncateAddress = (address: string) => {
    return address ? `${address.substring(0, 6)}...${address.substring(address.length - 4)}` : "";
  };

  // Formatear la fecha en formato legible para el usuario
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(navigator.language, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  // Obtener la cantidad total de recompensas generadas por referidos
  const getTotalRewards = () => {
    // Si tenemos datos de la API de estadísticas, usarlos prioritariamente
    if (referralStats && referralStats.totalRewards) {
      return referralStats.totalRewards;
    }
    // Fallback al valor del referral
    if (!myReferrals || myReferrals.length === 0) return "0";
    return myReferrals[0]?.totalRewards || "0";
  };

  // Obtener el aumento de APR si el usuario es un referido
  const getAprBoost = () => {
    if (!referralStatus?.isReferred || !referralStatus.referredUser) return null;
    // Convertir el valor del boost (p.ej. 1.01) a porcentaje (p.ej. 1%)
    const boostValue = parseFloat(referralStatus.referredUser.aprBoost);
    return ((boostValue - 1) * 100).toFixed(1);
  };

  // Utilizamos el hook global de autenticación
  const { isLoggedIn: isAuthenticated, isLoading: checkingAuth, address } = useWallet();
  
  // Aseguramos que el usuario esté autenticado en el servidor cuando conecta su wallet
  useEffect(() => {
    const ensureServerAuthentication = async () => {
      if (address && isAuthenticated) {
        try {
          // Intentar iniciar sesión con la dirección actual
          const result = await login(address);
          if (!result.success) {
            console.error("Error al autenticar en el servidor:", result);
            toast({
              title: rt.error,
              description: rt.errorAuthentication,
              variant: "destructive",
            });
          } else {
            // Recargar los datos después de la autenticación exitosa
            queryClient.invalidateQueries({ queryKey: ['/api/referrals'] });
            queryClient.invalidateQueries({ queryKey: ['/api/referrals/users/referred'] });
            queryClient.invalidateQueries({ queryKey: ['/api/referrals/check-referred'] });
          }
        } catch (error) {
          console.error("Error al iniciar sesión:", error);
        }
      }
    };
    
    ensureServerAuthentication();
  }, [address, isAuthenticated, queryClient, toast, rt]);
  
  // Estado para controlar si se detectó un código en la URL
  const [detectedCodeFromUrl, setDetectedCodeFromUrl] = React.useState<string | null>(null);
  
  // Detectar y usar código de referido desde la URL - versión mejorada con tolerancia a fallos
  React.useEffect(() => {
    // Bandera para controlar si el componente está montado
    let isMounted = true;
    
    // Retrasar la detección del código para no bloquear el renderizado inicial
    const timerId = setTimeout(() => {
      try {
        // Verificar si window está disponible
        if (typeof window === 'undefined' || !window.location) {
          console.warn("window o window.location no disponible");
          return;
        }
        
        // Obtener parámetros de la URL de forma segura
        const params = new URLSearchParams(window.location.search);
        const codeFromUrl = params.get('code');
        
        if (codeFromUrl && isMounted) {
          console.log("Código de referido detectado en la URL:", codeFromUrl);
          setDetectedCodeFromUrl(codeFromUrl);
          
          // Si el usuario está autenticado, establecer el código para usarlo
          if (isAuthenticated) {
            console.log("Usuario autenticado, estableciendo código de referido");
            setReferralCode(codeFromUrl);
            
            // Intentar cambiar a la pestaña "Usar código de referido" después de un pequeño retraso
            // para asegurar que los componentes estén completamente renderizados
            const tabSwitchTimer = setTimeout(() => {
              if (!isMounted) return; // No continuar si el componente se desmontó
              
              try {
                console.log("Intentando navegar a la pestaña Use Referral Code");
                
                // Método 1: Buscar por data-value
                try {
                  const tabsElement = document.querySelector('[data-value="useCode"], [data-value="use-code"], [data-value="1"]') as HTMLButtonElement;
                  if (tabsElement) {
                    console.log("Pestaña encontrada por data-value, haciendo clic");
                    tabsElement.click();
                    return;
                  }
                } catch (error) {
                  console.warn("Error al buscar pestaña por data-value:", error);
                }
                
                // Método 2: Buscar por texto
                try {
                  const allTabs = Array.from(document.querySelectorAll('[role="tab"]'));
                  console.log("All tabs found:", allTabs.length);
                  
                  const tabByText = allTabs.find(tab => {
                    try {
                      const text = (tab as HTMLElement).innerText;
                      return text && (
                        text.includes("Use Referral Code") || 
                        text.includes("Usar Código")
                      );
                    } catch (error) {
                      console.warn("Error al leer texto de pestaña:", error);
                      return false;
                    }
                  });
                  
                  if (tabByText) {
                    console.log("Tab found by text, clicking it");
                    (tabByText as HTMLElement).click();
                    return;
                  }
                } catch (error) {
                  console.warn("Error al buscar pestaña por texto:", error);
                }
                
                // Método 3: Intentar hacer clic en la segunda pestaña (generalmente es "Usar código")
                try {
                  console.log("Fallback: intentando hacer clic en la segunda pestaña");
                  const allTabs = Array.from(document.querySelectorAll('[role="tab"]'));
                  if (allTabs.length > 1) {
                    (allTabs[1] as HTMLElement).click();
                  }
                } catch (error) {
                  console.warn("Error en método fallback:", error);
                }
              } catch (err) {
                console.error("Error al intentar navegar a la pestaña:", err);
                // El error no debe interrumpir la aplicación
              }
            }, 800); // Aumentamos el tiempo de espera a 800ms para dar más tiempo al renderizado
            
            // Limpiar el timer si el componente se desmonta
            return () => clearTimeout(tabSwitchTimer);
          } else {
            console.log("Usuario no autenticado, guardando código para cuando se autentique");
            // Guardamos el código para usarlo cuando el usuario se autentique
          }
        }
      } catch (error) {
        // Capturar cualquier error para no bloquear la aplicación
        console.error("Error al detectar/procesar código de referido en URL:", error);
      }
    }, 500);
    
    // Limpiar recursos cuando el componente se desmonta
    return () => {
      isMounted = false;
      clearTimeout(timerId);
    };
  }, [isAuthenticated]);
  
  // Verificar que referredUsers es un array
  const isValidReferredUsersArray = Array.isArray(referredUsers);
  
  // Usar estadísticas del nuevo endpoint o valores de respaldo
  const statsData = referralStats || {
    totalReferred: isValidReferredUsersArray ? referredUsers?.length || 0 : 0,
    activeUsers: isValidReferredUsersArray ? referredUsers?.filter(u => u.status === "active")?.length || 0 : 0,
    totalRewards: getTotalRewards(),
    completionRate: isValidReferredUsersArray && referredUsers.length > 0 
      ? (referredUsers.filter(u => u.status === "active").length / referredUsers.length) * 100 
      : 0
  };
  
  // Datos para el próximo nivel de recompensas
  const targetInfo = {
    currentLevel: isValidReferredUsersArray ? referredUsers.length : 0,
    nextLevel: isValidReferredUsersArray && referredUsers.length > 0 
      ? Math.ceil((referredUsers.length + 1) / 5) * 5 
      : 5, // Siguiente múltiplo de 5
    progress: isValidReferredUsersArray && referredUsers.length > 0 
      ? (referredUsers.length % 5) * 20 
      : 0,
    reward: formatExactCurrency(50, 2, "USD") // Recompensa ficticia por alcanzar el siguiente nivel
  };
  
  return (
    <div className="relative container mx-auto py-6 space-y-8 pointer-events-auto">
      {/* Header igual que en dashboard */}
      <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">{rt.referralProgram}</h1>
          <p className="text-slate-500 dark:text-slate-400">
            {rt.earnWhileFriendsEarn}
          </p>
        </div>
        <div className="w-full md:w-auto relative z-50 pointer-events-auto">
          <ConnectButton />
        </div>
      </div>
      
      {/* Header con fondo decorativo y efecto de gradiente */}
      <div className="relative bg-gradient-to-br from-primary/10 to-background rounded-lg p-6 mb-8 overflow-hidden shadow-sm">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary opacity-10 rounded-full filter blur-3xl -translate-y-1/2 translate-x-1/4"></div>
        
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3">
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
              {rt.growTogether}
            </h2>
            <p className="text-xl text-muted-foreground mt-2">
              {rt.joinOurProgram}
            </p>
            
            <div className="flex flex-wrap gap-4 mt-6">
              <div className="flex items-center gap-2 bg-primary/10 px-3 py-1.5 rounded-full">
                <Gift className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">{rt.commissionRewards}</span>
              </div>
              <div className="flex items-center gap-2 bg-primary/10 px-3 py-1.5 rounded-full">
                <Zap className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">{rt.aprBoost}</span>
              </div>
              <div className="flex items-center gap-2 bg-primary/10 px-3 py-1.5 rounded-full">
                <BarChart3 className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">{rt.referrals}</span>
              </div>
              <div className="flex items-center gap-2 bg-primary/10 px-3 py-1.5 rounded-full">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">{rt.rewardsCalculator}</span>
              </div>
            </div>
          </div>
          
          {/* Ranking badge prominente */}
          {!isLoadingReferrals && !isErrorReferrals && myReferrals && myReferrals.length > 0 && (
            <div className="lg:col-span-2 flex flex-col justify-center items-center bg-card/50 backdrop-blur-sm rounded-xl p-4 border border-primary/20 shadow-lg">
              <div className="text-center mb-2">
                <h3 className="text-xl font-semibold text-primary">{rt.yourRank}</h3>
              </div>
              <div className="scale-125 transform">
                <RankBadge 
                  referralCount={referredUsers?.length || 0} 
                  size="lg" 
                  showLabel 
                  className="px-4 py-2 text-base" 
                />
              </div>
              <p className="mt-4 text-center text-sm text-muted-foreground">
                {rt.inviteMoreFriends}
              </p>
              <div className="mt-3">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => document.getElementById('rank-section')?.scrollIntoView({behavior: 'smooth'})}
                  className="text-xs"
                >
                  <Trophy className="h-3 w-3 mr-1" />
                  {rt.seeAllRanks}
                </Button>
              </div>
            </div>
          )}
        </div>
        
        {/* Mostrar banner de conexión si no está autenticado */}
        {!checkingAuth && !isAuthenticated && (
          <div className="bg-[#0b101e] rounded-xl overflow-hidden mb-8 mt-6 max-w-6xl">
            {/* Sección principal conexión segura */}
            <div className="p-6 border-b border-[#1c2438]">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-[#1a1f35] flex items-center justify-center">
                  <svg className="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-xl font-semibold text-white">{rt.secureConnection}</h2>
                    <div className="flex items-center gap-2 bg-[#15212e] px-3 py-1 rounded-full">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <span className="text-xs text-green-400">{rt.encryptedConnections}</span>
                    </div>
                  </div>
                  <p className="text-[#8a9fc0] text-sm mb-4">
                    {rt.notAuthenticated}
                  </p>
                </div>
              </div>
            </div>

            {/* Wallet Connect Section - igual que dashboard */}
            <div className="p-6 border-b border-[#1c2438]">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-indigo-600/30 flex items-center justify-center">
                      <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-white">WalletConnect</h3>
                  </div>
                  <p className="text-[#8a9fc0] text-sm mb-4 ml-12">
                    {rt.connectWallet}
                  </p>

                  <div className="ml-12 space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-6 h-6 mt-0.5 text-green-500 flex items-center justify-center">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-white">{rt.militarySecurity}</h4>
                        <p className="text-xs text-[#8a9fc0]">{rt.e2eEncryption}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-6 h-6 mt-0.5 text-green-500 flex items-center justify-center">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-white">{rt.compatibleWallets}</h4>
                        <p className="text-xs text-[#8a9fc0]">{rt.walletCompatibilityDesc}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex-shrink-0 flex flex-col items-center justify-center bg-[#111827] rounded-xl p-6 min-w-[300px]">
                  <div className="w-16 h-16 mb-4 flex items-center justify-center rounded-full bg-indigo-600/20">
                    <svg className="w-10 h-10 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <h3 className="text-white text-lg font-medium mb-6">{rt.connectWalletTitle}</h3>
                  <Button 
                    size="lg" 
                    onClick={() => setIsModalOpen(true)}
                    className="w-full bg-indigo-600 hover:bg-indigo-500 text-white relative z-20 pointer-events-auto"
                  >
                    {rt.connect}
                  </Button>
                  <p className="text-[#8a9fc0] text-xs mt-4 text-center relative z-20 pointer-events-auto">
                    {rt.agreeToTerms} <a href="/terms-of-use" className="text-indigo-400 hover:underline relative z-30 pointer-events-auto">{rt.termsOfService}</a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <Tabs defaultValue="my-code" className="w-full">
        <TabsList className="mb-6 bg-card border border-border shadow-sm">
          <TabsTrigger value="my-code" className="data-[state=active]:bg-primary/10">
            {rt.myReferralCode}
          </TabsTrigger>
          <TabsTrigger value="use-code" className="data-[state=active]:bg-primary/10">
            {rt.useReferralCode}
          </TabsTrigger>
          <TabsTrigger value="referred-users" className="data-[state=active]:bg-primary/10">
            {rt.referredUsers}
          </TabsTrigger>
          <TabsTrigger value="benefits" className="data-[state=active]:bg-primary/10">
            {rt.benefits}
          </TabsTrigger>
        </TabsList>

        {/* Tab: Mi código de referido */}
        <TabsContent value="my-code" className="space-y-8 animate-in fade-in-50 duration-500">
          {isLoadingReferrals ? (
            <Card>
              <CardContent className="pt-6 min-h-40">
                <div className="h-32 flex items-center justify-center">
                  <div className="animate-pulse flex space-x-4">
                    <div className="flex-1 space-y-4 py-1">
                      <div className="h-4 bg-primary/20 rounded w-3/4"></div>
                      <div className="space-y-2">
                        <div className="h-4 bg-primary/10 rounded"></div>
                        <div className="h-4 bg-primary/10 rounded w-5/6"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : isErrorReferrals ? (
            <Alert variant="destructive">
              <AlertTitle>{rt.error}</AlertTitle>
              <AlertDescription>
                {rt.referralCodeError}
              </AlertDescription>
            </Alert>
          ) : myReferrals && myReferrals.length > 0 ? (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <ReferralCodeCard 
                    referralCode={myReferrals[0]?.referralCode || ""}
                    onCopy={handleCopyReferralCode}
                    onShare={handleShareReferralCode}
                    referralCount={referredUsers?.length || 0}
                  />
                </div>
                
                <div>
                  <ReferralStats 
                    stats={statsData}
                    targetInfo={targetInfo}
                  />
                </div>
              </div>
              
              <div className="pt-8">
                <RewardsCalculator />
              </div>
              
              <div className="pt-8">
                <SuccessStories />
              </div>
              
              {/* Sección de ranking completa */}
              <div className="pt-16" id="rank-section">
                <div className="mb-8 text-center">
                  <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
                    {rt.referralLevels}
                  </h2>
                  <p className="text-muted-foreground max-w-2xl mx-auto mt-3">
                    {rt.progressThroughRanks}
                  </p>
                </div>
                <ReferralRankSection referralCount={isValidReferredUsersArray ? referredUsers.length : 0} />
              </div>
            </>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <Card className="overflow-hidden border-primary/10 shadow-lg">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary opacity-10 rounded-full filter blur-3xl -translate-y-1/2 translate-x-1/4"></div>
                  <CardHeader>
                    <CardTitle className="text-2xl">{rt.referralCodeCreated}</CardTitle>
                    <CardDescription>
                      {rt.referralCodeSuccess}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4 relative z-10">
                    <div className="flex flex-col items-center space-y-6 max-w-md mx-auto">
                      <div className="bg-primary/10 rounded-full p-5">
                        <RefreshCw className="h-10 w-10 text-primary animate-spin" />
                      </div>
                      
                      <p className="text-center text-muted-foreground">
                        {rt.referralCodeSuccess}
                      </p>
                      
                      <div className="grid grid-cols-2 gap-8 w-full mt-6">
                        <div className="flex flex-col items-center text-center">
                          <div className="bg-emerald-500/10 rounded-full h-12 w-12 flex items-center justify-center mb-2">
                            <span className="text-emerald-500 font-bold">1%</span>
                          </div>
                          <p className="text-sm">{rt.commissionRewards}</p>
                        </div>
                        
                        <div className="flex flex-col items-center text-center">
                          <div className="bg-blue-500/10 rounded-full h-12 w-12 flex items-center justify-center mb-2">
                            <span className="text-blue-500 font-bold">∞</span>
                          </div>
                          <p className="text-sm">{rt.referrals}</p>
                        </div>
                      </div>
                      
                      <Button 
                        onClick={() => window.location.reload()}
                        className="w-full mt-6"
                        size="lg"
                      >
                        <RefreshCw className="mr-2 h-4 w-4" />
                        {rt.refresh}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="space-y-6 lg:col-span-1">
                <Card className="border-primary/10 bg-gradient-to-br from-background to-primary/5">
                  <CardHeader>
                    <CardTitle>{rt.howItWorks}</CardTitle>
                    <CardDescription>
                      {rt.stepsToEarn}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="bg-primary/10 rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="font-bold text-primary">1</span>
                      </div>
                      <div>
                        <h3 className="font-medium">{rt.getYourCode}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {rt.codeAutoGenerated}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="bg-primary/10 rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="font-bold text-primary">2</span>
                      </div>
                      <div>
                        <h3 className="font-medium">{rt.shareWithFriends}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {rt.sendReferralLink}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="bg-primary/10 rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="font-bold text-primary">3</span>
                      </div>
                      <div>
                        <h3 className="font-medium">{rt.earnRewards}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {rt.commissionOnEarnings}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border-primary/10 shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle>{rt.potentialEarnings}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>{rt.fiveReferrals}</span>
                          <span className="font-medium">$250/year</span>
                        </div>
                        <div className="h-2 bg-primary/10 rounded-full overflow-hidden">
                          <div className="h-full bg-primary w-1/4"></div>
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>{rt.twentyReferrals}</span>
                          <span className="font-medium">$1,000/year</span>
                        </div>
                        <div className="h-2 bg-primary/10 rounded-full overflow-hidden">
                          <div className="h-full bg-primary w-2/4"></div>
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>{rt.fiftyReferrals}</span>
                          <span className="font-medium">$2,500/year</span>
                        </div>
                        <div className="h-2 bg-primary/10 rounded-full overflow-hidden">
                          <div className="h-full bg-primary w-3/4"></div>
                        </div>
                      </div>
                      
                      <p className="text-xs text-muted-foreground pt-2">
                        {rt.referralsAvgInvestment}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </TabsContent>

        {/* Tab: Usar código de referido */}
        <TabsContent value="use-code" className="space-y-6 animate-in fade-in-50 duration-500">
          <UseReferralCodeTab 
            isLoading={isLoadingReferralStatus}
            isError={isErrorReferralStatus}
            referralStatus={referralStatus || null}
            walletAddress={walletAddress}
            initialReferralCode={detectedCodeFromUrl || ""}
            onNavigateToMyCode={() => {
              const myCodeTab = document.querySelector('[value="my-code"]') as HTMLButtonElement;
              if (myCodeTab) {
                myCodeTab.click();
              }
            }}
          />

          <Card>
            <CardHeader>
              <CardTitle>{rt.referralBenefits}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <h3 className="font-medium flex items-center gap-2">
                    <ArrowRight className="h-4 w-4 text-primary" />
                    {rt.whenYouUseCode}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {rt.aprBoostDescription1}
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-medium flex items-center gap-2">
                    <ArrowRight className="h-4 w-4 text-primary" />
                    {rt.whenOthersUseCode}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {rt.passiveIncomeStream}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Usuarios referidos */}
        <TabsContent value="referred-users" className="space-y-6 animate-in fade-in-50 duration-500">
          {isLoadingReferredUsers ? (
            <Card>
              <CardContent className="pt-6">
                <div className="h-32 flex items-center justify-center">
                  <p className="text-muted-foreground">{rt.loadingReferredUsers}</p>
                </div>
              </CardContent>
            </Card>
          ) : isErrorReferredUsers ? (
            <Alert variant="destructive">
              <AlertTitle>{rt.error}</AlertTitle>
              <AlertDescription>
                {rt.referralCodeUseError}
              </AlertDescription>
            </Alert>
          ) : !myReferrals || myReferrals.length === 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>{rt.referralCodeCreated}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-4">
                  <p className="text-muted-foreground">
                    {rt.referralCodeSuccess}
                  </p>
                  <Button onClick={() => { 
                    console.log("Trying to find my-code tab from Refresh Referral Code button");
                    
                    // Log all tab elements to help with debugging
                    const allTabs = document.querySelectorAll('button[role="tab"]');
                    console.log("All tabs found:", Array.from(allTabs).map(tab => ({ 
                      text: tab.textContent,
                      value: tab.getAttribute('value'), 
                      dataState: tab.getAttribute('data-state'),
                      dataValue: tab.getAttribute('data-value')
                    })));
                    
                    // Intenta encontrar por texto
                    const tabByText = Array.from(allTabs).find(tab => 
                      tab.textContent?.includes("My Referral Code") || 
                      tab.textContent?.includes("Mi Código de Referido")
                    );
                    
                    if (tabByText) {
                      safeClickElement(tabByText);
                      console.log("Tab found by text and clicked from Create Referral Code");
                      return;
                    }
                    
                    // Intenta todos los selectores posibles
                    const selectors = [
                      'button[role="tab"][value="my-code"]',
                      'button[role="tab"][data-value="my-code"]',
                      'button[value="my-code"]',
                      'button[data-value="my-code"]',
                      '.tabs-trigger[value="my-code"]'
                    ];
                    
                    for (const selector of selectors) {
                      const element = document.querySelector(selector) as HTMLButtonElement;
                      if (element) {
                        safeClickElement(element);
                        console.log(`Tab found with selector "${selector}" and clicked from Create Referral Code`);
                        return;
                      }
                    }
                    
                    console.error("No suitable tab element found for my-code from Create Referral Code");
                  }}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    {rt.refresh}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : !referredUsers || referredUsers.length === 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>{rt.noReferredUsers}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-4">
                  <p className="text-muted-foreground">
                    {rt.startReferred}
                  </p>
                  <Button onClick={() => { 
                    console.log("Trying to find my-code tab");
                    
                    // Log all tab elements to help with debugging
                    const allTabs = document.querySelectorAll('button[role="tab"]');
                    console.log("All tabs found:", Array.from(allTabs).map(tab => ({ 
                      text: tab.textContent,
                      value: tab.getAttribute('value'), 
                      dataState: tab.getAttribute('data-state'),
                      dataValue: tab.getAttribute('data-value')
                    })));
                    
                    // Intenta encontrar por texto
                    const tabByText = Array.from(allTabs).find(tab => 
                      tab.textContent?.includes("My Referral Code") || 
                      tab.textContent?.includes("Mi Código de Referido")
                    );
                    
                    if (tabByText) {
                      safeClickElement(tabByText);
                      console.log("Tab found by text and clicked");
                      return;
                    }
                    
                    // Intenta todos los selectores posibles
                    const selectors = [
                      'button[role="tab"][value="my-code"]',
                      'button[role="tab"][data-value="my-code"]',
                      'button[value="my-code"]',
                      'button[data-value="my-code"]',
                      '.tabs-trigger[value="my-code"]'
                    ];
                    
                    for (const selector of selectors) {
                      const element = document.querySelector(selector) as HTMLButtonElement;
                      if (element) {
                        safeClickElement(element);
                        console.log(`Tab found with selector "${selector}" and clicked`);
                        return;
                      }
                    }
                    
                    console.error("No suitable tab element found for my-code");
                  }}>
                    {rt.personalReferralCode}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Mostrar las mismas estadísticas que en "My Referral Code" para mantener consistencia */}
              <div className="mb-6">
                <ReferralStats 
                  stats={statsData}
                  targetInfo={targetInfo}
                />
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>{rt.referredUsersTitle}</CardTitle>
                  <CardDescription>
                    {rt.inviteFriends}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableCaption>{rt.referredUsers}</TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{rt.address}</TableHead>
                        <TableHead>{rt.joinDate}</TableHead>
                        <TableHead>{rt.status}</TableHead>
                        <TableHead className="text-right">{rt.rewards}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isValidReferredUsersArray && referredUsers.length > 0 ? (
                        referredUsers.map((user) => (
                          <TableRow key={user.id}>
                            <TableCell className="font-mono">
                              {truncateAddress(user.referredWalletAddress)}
                            </TableCell>
                            <TableCell>{formatDate(user.joinedAt)}</TableCell>
                            <TableCell>
                              <Badge variant={user.status === "active" ? "default" : "secondary"}>
                                {user.status === "active" ? rt.active : rt.inactive}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              {formatExactCurrency(user.earnedRewards, 2, "USD")}
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                            {rt.noReferredUsers}
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </>
          )}

          {/* Eliminamos la tarjeta de estadísticas duplicada */}
        </TabsContent>

        {/* Tab: Beneficios */}
        <TabsContent value="benefits" className="space-y-8 animate-in fade-in-50 duration-500">
          <BenefitsShowcase />
          
          <div className="pt-8">
            <RewardsCalculator />
          </div>
          
          <div className="pt-8">
            <SuccessStories />
          </div>

          {/* Sección de ranking completa */}
          <div className="pt-16" id="rank-section">
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
                {rt.referralLevels}
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto mt-3">
                {rt.progressThroughRanks}
              </p>
            </div>
            <ReferralRankSection referralCount={isValidReferredUsersArray ? referredUsers.length : 0} />
          </div>
        </TabsContent>
      </Tabs>

      {/* Footer decorativo */}
      <div className="relative mt-16 bg-gradient-to-br from-primary/5 to-background rounded-lg p-8 overflow-hidden shadow-sm border border-primary/10">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary opacity-10 rounded-full filter blur-3xl translate-y-1/2 -translate-x-1/4"></div>
        
        <div className="relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <h2 className="text-3xl font-bold">{rt.getStarted}</h2>
            <p className="text-xl text-muted-foreground">
              {rt.shareYourCode}
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <Button 
                size="lg" 
                className="px-8 gap-2"
                onClick={() => {
                  if (!myReferrals || myReferrals.length === 0) {
                    // Si no hay códigos de referido, simplemente refrescar la página
                    window.location.reload();
                  } else {
                    handleCopyReferralCode();
                  }
                }}
              >
                {!myReferrals || myReferrals.length === 0 ? (
                  <>
                    <RefreshCw size={16} />
                    {rt.refresh}
                  </>
                ) : (
                  <>
                    <Clipboard size={16} />
                    {rt.copyReferralLink}
                  </>
                )}
              </Button>
              
              {!referralStatus?.isReferred && (
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="px-8 gap-2"
                  onClick={() => { 
                    console.log("Trying to find use-code tab");
                    
                    // Log all tab elements to help with debugging
                    const allTabs = document.querySelectorAll('button[role="tab"]');
                    console.log("All tabs found:", Array.from(allTabs).map(tab => ({ 
                      text: tab.textContent,
                      value: tab.getAttribute('value'), 
                      dataState: tab.getAttribute('data-state'),
                      dataValue: tab.getAttribute('data-value')
                    })));
                    
                    // Intenta encontrar por texto
                    const tabByText = Array.from(allTabs).find(tab => 
                      tab.textContent?.includes("Use Referral Code") || 
                      tab.textContent?.includes("Usar Código de Referido")
                    );
                    
                    if (tabByText) {
                      safeClickElement(tabByText);
                      console.log("Use Code Tab found by text and clicked");
                      return;
                    }
                    
                    // Intenta todos los selectores posibles
                    const selectors = [
                      'button[role="tab"][value="use-code"]',
                      'button[role="tab"][data-value="use-code"]',
                      'button[value="use-code"]',
                      'button[data-value="use-code"]',
                      '.tabs-trigger[value="use-code"]'
                    ];
                    
                    for (const selector of selectors) {
                      const element = document.querySelector(selector) as HTMLButtonElement;
                      if (element) {
                        safeClickElement(element);
                        console.log(`Tab found with selector "${selector}" and clicked for use-code`);
                        return;
                      }
                    }
                    
                    console.error("No suitable tab element found for use-code");
                  }
                }>
                  <Sparkles size={16} />
                  {rt.useReferralCode}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Wallet connection modal */}
      <div className="relative z-50 pointer-events-auto">
        <ConnectModal />
      </div>
    </div>
  );
};

export default ReferralsPage;