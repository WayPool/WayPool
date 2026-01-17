import { useEffect, useState, useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useWallet } from "@/hooks/use-wallet";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "@/hooks/use-translation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RefreshCw } from "lucide-react";
import CollapsiblePositionCard from "./collapsible-position-card";
import { apiRequest } from "@/lib/queryClient";
import { positionsTranslations } from "@/translations/positions";

// Tipo para las posiciones del usuario
interface UserPosition {
  id: number;
  walletAddress: string;
  poolAddress: string;
  poolName: string;
  token0: string;
  token1: string;
  token0Decimals: number;
  token1Decimals: number;
  token0Amount: string;
  token1Amount: string;
  depositedUSDC: number;
  timeframe: number;
  apr: number;
  status: "Active" | "Pending" | "Finalized";
  feesEarned: number;
  lowerPrice: number;
  upperPrice: number;
  inRange: boolean;
  timestamp: string;
}

const UserPositions = () => {
  const { address } = useWallet();
  const { toast } = useToast();
  const { t, language } = useTranslation();
  const [activeTab, setActiveTab] = useState<string>("all");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const queryClient = useQueryClient();
  
  // Función para cargar las posiciones - extraída para poder reutilizarla
  const loadPositions = useCallback(async (walletAddress: string) => {
    if (!walletAddress) return [];
    
    try {
      console.log(`Cargando posiciones para wallet ${walletAddress}...`);
      return await apiRequest("GET", `/api/position-history/${walletAddress}`);
    } catch (error) {
      console.error("Error al obtener posiciones del usuario:", error);
      return [];
    }
  }, []);
  
  // Configurar actualización automática de posiciones
  useEffect(() => {
    if (!address) return;
    
    console.log("Configurando actualización automática de posiciones para", address);
    
    // Actualizar cada 120 segundos (2 minutos) - optimizado para reducir costes
    const intervalId = setInterval(() => {
      console.log("Actualizando automáticamente posiciones para", address);
      queryClient.invalidateQueries({ queryKey: [`/api/position-history/${address}`] });
    }, 120000);
    
    // Limpiar intervalo al desmontar o cambiar de wallet
    return () => clearInterval(intervalId);
  }, [address, queryClient]);
  
  // Efecto para mostrar un mensaje cuando se conecta el wallet
  useEffect(() => {
    if (address) {
      console.log("Wallet conectado, cargando posiciones automáticamente para", address);
      
      // Invalidar la consulta para asegurar que se carguen los datos más recientes
      queryClient.invalidateQueries({ queryKey: [`/api/position-history/${address}`] });
      
      toast({
        title: t('positions.walletConnected', 'Wallet Connected'),
        description: t('positions.loadingPositionsAutomatically', 'Loading your positions automatically'),
      });
    }
  }, [address, queryClient, toast]);
  
  // Consulta para obtener las posiciones del usuario
  const {
    data: userPositions = [],
    isLoading,
    isError,
    refetch
  } = useQuery<UserPosition[]>({
    queryKey: [`/api/position-history/${address || "none"}`],
    queryFn: async () => {
      return loadPositions(address || "");
    },
    enabled: !!address,
    refetchInterval: 120000, // Recargar cada 120 segundos (2 minutos) - optimizado para reducir costes
  });
  
  // Función para actualizar manualmente las posiciones
  const handleRefresh = async () => {
    if (isRefreshing) return;
    
    try {
      setIsRefreshing(true);
      await refetch();
      toast({
        title: t('positions.positionsUpdated', 'Positions Updated'),
        description: t('positions.positionsUpdatedDescription', 'Your positions have been updated with the latest data'),
      });
    } catch (error) {
      console.error("Error al actualizar posiciones:", error);
      toast({
        title: t('error', 'Error'),
        description: t('positions.errorUpdatingPositions', 'Could not update positions. Please try again later.'),
        variant: "destructive",
      });
    } finally {
      setIsRefreshing(false);
    }
  };
  
  // Filtrar posiciones según la pestaña activa
  const filteredPositions = userPositions.filter(position => {
    if (activeTab === "all") return true;
    if (activeTab === "active") return position.status === "Active";
    if (activeTab === "pending") return position.status === "Pending";
    if (activeTab === "finalized") return position.status === "Finalized";
    return true;
  });
  
  // Si el usuario no está conectado
  if (!address) {
    return (
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <p className="text-slate-500 dark:text-slate-400 mb-4">
              {t('connectWalletMessage', positionsTranslations[language].connectWalletMessage)}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">{t('myPositions', positionsTranslations[language].myPositions)}</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={isRefreshing || isLoading}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
          {t('refresh', 'Refresh')}
        </Button>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="all">{language === 'en' ? 'All' : positionsTranslations[language].filterAll}</TabsTrigger>
          <TabsTrigger value="active">{language === 'en' ? 'Active' : positionsTranslations[language].filterActive}</TabsTrigger>
          <TabsTrigger value="pending">{language === 'en' ? 'Pending' : positionsTranslations[language].statusPending}</TabsTrigger>
          <TabsTrigger value="finalized">{language === 'en' ? 'Closed' : positionsTranslations[language].filterClosed}</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab}>
          {isLoading ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <p className="text-slate-500 dark:text-slate-400">{t('positions.loadingPositions', 'Loading positions...')}</p>
                </div>
              </CardContent>
            </Card>
          ) : isError ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <p className="text-red-500 mb-2">{t('positions.errorLoadingPositions', 'Error loading positions')}</p>
                  <p className="text-slate-500 dark:text-slate-400 mb-4">
                    {t('positions.errorDescription', 'Your positions could not be loaded. Please try again later.')}
                  </p>
                  <Button variant="outline" onClick={handleRefresh}>
                    {t('retry', 'Retry')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : filteredPositions.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <p className="text-slate-500 dark:text-slate-400 mb-4">
                    {t('positions.noPositionsOfType', 'No positions found')} {activeTab !== "all" && activeTab}
                  </p>
                  {activeTab !== "all" && (
                    <Button variant="outline" onClick={() => setActiveTab("all")}>
                      {t('positions.viewAllPositions', 'View all positions')}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <div>
              {filteredPositions.map((position) => (
                <CollapsiblePositionCard
                  key={position.id}
                  position={position}
                  onRefresh={refetch}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </>
  );
};

export default UserPositions;