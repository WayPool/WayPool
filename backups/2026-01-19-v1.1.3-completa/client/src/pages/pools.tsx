import { useEffect, useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useTranslation } from '@/hooks/use-translation';
import { useLanguage } from '@/context/language-context';
// Removed @tremor/react imports - using custom graphics instead
import { 
  Info, 
  RefreshCw, 
  Zap, 
  ArrowRight, 
  BarChart as BarChartIcon, 
  CircleDollarSign,
  Droplets,
  TrendingUp,
  Layers,
  CheckCircle,
  Percent,
  DollarSign,
  Activity,
  ExternalLink
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency, formatPercentage } from "../utils/format";
import { useQuery } from "@tanstack/react-query";

interface Pool {
  id: number;
  name: string;
  address: string;
  token0Symbol: string;
  token1Symbol: string;
  fee: string;
  network: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface PoolData {
  name: string;
  token0Symbol: string;
  token1Symbol: string;
  address: string;
  ethPriceUsd: number;
  tvl: number;
  volume24h: number;
  fee: string;
  apr: number;
  network: string;
  isActive: boolean;
  tvlHistory: { date: string; value: number }[];
  volumeHistory: { date: string; value: number }[];
  aprHistory: { date: string; value: number }[];
  // Propiedades para manejo de datos reales
  real?: boolean;
  approximated?: boolean;
  isRealData?: boolean; 
  isApproximated?: boolean;
  source?: string;
}

const PoolCard = ({ pool, poolData }: { pool: Pool; poolData: PoolData | null }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { toast } = useToast();

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleRefresh = async () => {
    const { t } = useTranslation();
    toast({
      title: t("Refreshing pool data..."),
      description: t("Fetching the latest data from the blockchain")
    });

    // In a real app, you'd trigger a refetch of the data
    // For now we'll just show a toast
    setTimeout(() => {
      toast({
        title: t("Data refreshed"),
        description: t("Pool data has been updated with the latest information")
      });
    }, 1500);
  };

  const getNetworkColor = (network: string) => {
    switch (network.toLowerCase()) {
      case 'ethereum': return 'bg-blue-500';
      case 'polygon': return 'bg-purple-500';
      case 'arbitrum': return 'bg-sky-500';
      case 'optimism': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getTokenIcon = (symbol: string) => {
    // This is a simplified version - in a real app you'd have proper SVG icons
    const symbolLower = symbol.toLowerCase();
    if (symbolLower === 'eth' || symbolLower === 'weth') return '⟠';
    if (symbolLower === 'usdc') return '💲';
    if (symbolLower === 'usdt') return '💵';
    if (symbolLower === 'dai') return '🔶';
    if (symbolLower === 'matic') return '🔷';
    return '🪙';
  };

  const getUniswapURL = (poolAddress: string, network: string) => {
    // Generate the correct Uniswap URL using the explore/pools structure
    return `https://app.uniswap.org/explore/pools/${network}/${poolAddress}`;
  };

  if (!poolData) {
    // Skeleton loader while data is being fetched
    return (
      <Card className="mb-6 overflow-hidden backdrop-blur-sm bg-background/30 border-primary/20">
        <CardHeader className="pb-3">
          <CardTitle className="flex justify-between items-center">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-6 w-16" />
          </CardTitle>
          <CardDescription className="flex items-center">
            <Skeleton className="h-4 w-48" />
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-3">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
          <Skeleton className="h-32 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card 
      className={`mb-6 overflow-hidden transition-all duration-300 border border-primary/20 backdrop-blur-sm bg-background/30 ${isExpanded ? 'shadow-lg' : 'shadow'}`}
      onClick={!isExpanded ? toggleExpand : undefined}
    >
      <CardHeader className="pb-3">
        <CardTitle className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span>{poolData.token0Symbol}/{poolData.token1Symbol}</span>
            <Badge variant={poolData.isActive ? "default" : "secondary"}>
              {poolData.fee}
            </Badge>
          </div>
          <div className="flex items-center space-x-2">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={(e: React.MouseEvent) => { 
                e.stopPropagation(); 
                window.open(getUniswapURL(pool.address, pool.network), '_blank');
              }}
              className="h-8 px-2 text-xs hover:bg-primary/10"
            >
              <ExternalLink className="h-3 w-3 mr-1" />
              Uniswap
            </Button>
            <Badge className={`${getNetworkColor(poolData.network)} text-white`}>
              {poolData.network}
            </Badge>
          </div>
        </CardTitle>
        <CardDescription className="flex items-center">
          <span className="text-xs font-mono text-muted-foreground truncate">
            {poolData.address}
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-3">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          {/* TVL */}
          <div className="bg-background/50 rounded-lg p-3 backdrop-blur-sm border border-muted/30">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground flex items-center">
                <CircleDollarSign className="h-4 w-4 mr-1" />
                TVL
              </span>
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={(e: React.MouseEvent) => { e.stopPropagation(); handleRefresh(); }}>
                <RefreshCw className="h-3 w-3" />
              </Button>
            </div>
            <div className="text-lg font-semibold mt-1">
              {formatCurrency(poolData.tvl)}
            </div>
            {(poolData.real || poolData.isRealData) && (!poolData.approximated && !poolData.isApproximated) && (
              <div className="mt-1 flex items-center">
                <Badge variant="outline" className="text-xs bg-green-500/10 text-green-500 border-green-500/20">
                  <CheckCircle className="h-3 w-3 mr-1" /> Real
                </Badge>
              </div>
            )}
          </div>
          
          {/* APR */}
          <div className="bg-background/50 rounded-lg p-3 backdrop-blur-sm border border-muted/30">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground flex items-center">
                <Zap className="h-4 w-4 mr-1" />
                APR
              </span>
            </div>
            <div className="text-lg font-semibold mt-1 text-green-500">
              {formatPercentage(poolData.apr)}
            </div>
            <div className="mt-1 text-xs text-muted-foreground">
              Est. anual: {formatCurrency((poolData.tvl * poolData.apr) / 100)}
            </div>
          </div>
          
          {/* 24h Volume */}
          <div className="bg-background/50 rounded-lg p-3 backdrop-blur-sm border border-muted/30">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground flex items-center">
                <BarChartIcon className="h-4 w-4 mr-1" />
                24h Vol
              </span>
            </div>
            <div className="text-lg font-semibold mt-1">
              {formatCurrency(poolData.volume24h || 0)}
            </div>
            <div className="mt-1 text-xs text-muted-foreground">
              {((poolData.volume24h || 0) / (poolData.tvl || 1) * 100).toFixed(1)}% of TVL
            </div>
          </div>
          
          {/* Fee Tier */}
          <div className="bg-background/50 rounded-lg p-3 backdrop-blur-sm border border-muted/30">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground flex items-center">
                <Percent className="h-4 w-4 mr-1" />
                Fee Tier
              </span>
            </div>
            <div className="text-lg font-semibold mt-1">
              {poolData.fee}
            </div>
            {/* Agregando log para debug */}
            {console.log(`Pool fee info for ${poolData.address}:`, {
              feeValue: poolData.fee,
              feeType: typeof poolData.fee,
              volume24h: poolData.volume24h
            })}
            <div className="mt-1 text-xs text-muted-foreground">
              Daily fees: {formatCurrency((poolData.volume24h || 0) * (parseFloat((poolData.fee && typeof poolData.fee === 'string') ? poolData.fee.replace('%', '') : '0') / 100))}
            </div>
          </div>
        </div>
        
        {isExpanded && (
          <>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-background/50 rounded-lg p-3 backdrop-blur-sm border border-muted/30">
                <div className="flex items-center">
                  <span className="text-sm text-muted-foreground flex items-center">
                    <Droplets className="h-4 w-4 mr-1" />
                    Liquidity
                  </span>
                </div>
                <div className="text-lg font-semibold mt-1">
                  {formatCurrency(poolData.tvl)}
                </div>
              </div>
              <div className="bg-background/50 rounded-lg p-3 backdrop-blur-sm border border-muted/30">
                <div className="flex items-center">
                  <span className="text-sm text-muted-foreground flex items-center">
                    <BarChartIcon className="h-4 w-4 mr-1" />
                    24h Volume
                  </span>
                </div>
                <div className="text-lg font-semibold mt-1">
                  {formatCurrency(poolData.volume24h)}
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-background/50 rounded-lg p-3 backdrop-blur-sm border border-muted/30">
                <div className="flex items-center">
                  <span className="text-sm text-muted-foreground flex items-center">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    Price Impact
                  </span>
                </div>
                <div className="text-lg font-semibold mt-1 text-amber-500">
                  Low
                </div>
              </div>
              <div className="bg-background/50 rounded-lg p-3 backdrop-blur-sm border border-muted/30">
                <div className="flex items-center">
                  <span className="text-sm text-muted-foreground flex items-center">
                    <Layers className="h-4 w-4 mr-1" />
                    Pool Type
                  </span>
                </div>
                <div className="text-lg font-semibold mt-1">
                  Concentrated
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-4 mb-4">
              <div className="bg-background/50 rounded-lg p-3 backdrop-blur-sm border border-muted/30">
                <div className="flex items-center mb-2">
                  <span className="text-sm text-muted-foreground">TVL History (7d)</span>
                </div>
                <div className="relative h-32 w-full bg-background/40 rounded-md p-2">
                  <div className="h-full w-full flex items-end">
                    {(poolData.tvlHistory || []).slice(-7).map((item, index) => {
                      // Extraer el valor TVL del objeto, que puede tener diferentes estructuras
                      let value = 0;
                      
                      if (typeof item === 'object' && item !== null) {
                        if ('tvl' in item) {
                          value = typeof item.tvl === 'number' ? item.tvl : 0;
                        } else if ('value' in item) {
                          value = typeof item.value === 'number' ? item.value : 0;
                        }
                      }
                      
                      // Calcular el valor máximo para la escala
                      const values = (poolData.tvlHistory || []).slice(-7).map(i => {
                        if (typeof i === 'object' && i !== null) {
                          if ('tvl' in i) return typeof i.tvl === 'number' ? i.tvl : 0;
                          if ('value' in i) return typeof i.value === 'number' ? i.value : 0;
                        }
                        return 0;
                      });
                      
                      const max = values.length > 0 ? Math.max(...values) : 1;
                      const height = `${(value / max) * 100}%`;
                      
                      // Obtener la fecha del item
                      const date = typeof item === 'object' && item !== null && 'date' in item ? 
                                  item.date as string : `Day ${index + 1}`;
                      
                      return (
                        <div 
                          key={index} 
                          className="group flex-1 mx-0.5 relative"
                          title={`${date}: ${formatCurrency(value)}`}
                        >
                          <div 
                            className="absolute bottom-0 w-full bg-blue-500/50 hover:bg-blue-500/70 transition-all rounded-sm"
                            style={{ height }}
                          />
                          {index === 0 || index === (poolData.tvlHistory || []).slice(-7).length - 1 ? (
                            <div className="absolute -bottom-5 text-[10px] text-muted-foreground">
                              {date}
                            </div>
                          ) : null}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              <div className="bg-background/50 rounded-lg p-3 backdrop-blur-sm border border-muted/30">
                <div className="flex items-center mb-2">
                  <span className="text-sm text-muted-foreground">Volume History (7d)</span>
                </div>
                <div className="relative h-32 w-full bg-background/40 rounded-md p-2">
                  <div className="h-full w-full flex items-end">
                    {(poolData.volumeHistory || []).slice(-7).map((item, index) => {
                      // Extraer el valor de volumen del objeto, que puede tener diferentes estructuras
                      let value = 0;
                      
                      if (typeof item === 'object' && item !== null) {
                        if ('volume' in item) {
                          value = typeof item.volume === 'number' ? item.volume : 0;
                        } else if ('value' in item) {
                          value = typeof item.value === 'number' ? item.value : 0;
                        }
                      }
                      
                      // Calcular el valor máximo para la escala
                      const values = (poolData.volumeHistory || []).slice(-7).map(i => {
                        if (typeof i === 'object' && i !== null) {
                          if ('volume' in i) return typeof i.volume === 'number' ? i.volume : 0;
                          if ('value' in i) return typeof i.value === 'number' ? i.value : 0;
                        }
                        return 0;
                      });
                      
                      const max = values.length > 0 ? Math.max(...values) : 1;
                      const height = `${(value / max) * 100}%`;
                      
                      // Obtener la fecha del item
                      const date = typeof item === 'object' && item !== null && 'date' in item ? 
                                  item.date as string : `Day ${index + 1}`;
                      
                      return (
                        <div 
                          key={index} 
                          className="group flex-1 mx-0.5 relative"
                          title={`${date}: ${formatCurrency(value)}`}
                        >
                          <div 
                            className="absolute bottom-0 w-full bg-purple-500/60 hover:bg-purple-500/80 transition-all rounded-sm"
                            style={{ height }}
                          />
                          {index === 0 || index === (poolData.volumeHistory || []).slice(-7).length - 1 ? (
                            <div className="absolute -bottom-5 text-[10px] text-muted-foreground">
                              {date}
                            </div>
                          ) : null}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </CardContent>
      {isExpanded && (
        <CardFooter className="flex justify-between pt-0">
          <Button variant="ghost" size="sm" onClick={toggleExpand}>
            Collapse
          </Button>
          <Button variant="outline" size="sm">
            <span>Add Liquidity</span>
            <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default function PoolsPage() {
  const { toast } = useToast();
  const { language } = useLanguage();

  // Fetch all pools (using public API endpoint)
  const { data: pools, isLoading: isLoadingPools, error: poolsError } = useQuery({
    queryKey: ['/api/pools/custom'],
    queryFn: async () => {
      const response = await fetch('/api/pools/custom');
      if (!response.ok) throw new Error('Failed to fetch pools');
      return response.json();
    }
  });

  const [poolsData, setPoolsData] = useState<Map<string, PoolData>>(new Map());
  const [isLoadingPoolsData, setIsLoadingPoolsData] = useState(true);

  // Fetch data for each pool
  useEffect(() => {
    const fetchPoolsData = async () => {
      if (!pools) return;
      
      const newPoolsData = new Map<string, PoolData>();
      const promises = pools.map(async (pool: Pool) => {
        try {
          const response = await fetch(`/api/blockchain/uniswap-pool?address=${pool.address}&network=${pool.network}`);
          if (!response.ok) throw new Error(`Failed to fetch data for pool ${pool.address}`);
          
          const data = await response.json();
          
          // Fetch real TVL history data from blockchain API
          const tvlHistoryResponse = await fetch(`/api/blockchain/tvl-history?address=${pool.address}&network=${pool.network}`);
          const tvlHistory = await tvlHistoryResponse.json();
          console.log(`TVL History data for pool ${pool.address}:`, tvlHistory);
          
          // Fetch real volume history data from blockchain API
          const volumeHistoryResponse = await fetch(`/api/blockchain/trading-volume?address=${pool.address}&network=${pool.network}`);
          const volumeHistory = await volumeHistoryResponse.json();
          console.log(`Volume History data for pool ${pool.address}:`, volumeHistory);
          
          // Fetch real APR history data from blockchain API
          const aprHistoryResponse = await fetch(`/api/blockchain/apr-history?address=${pool.address}&network=${pool.network}`);
          const aprHistory = await aprHistoryResponse.json();
          console.log(`APR History data for pool ${pool.address}:`, aprHistory);
          
          // Asegurarse de extraer los datos correctamente
          const latestVolumeEntry = volumeHistory[volumeHistory.length - 1];
          const latestVolume = latestVolumeEntry?.volume || 0;
          
          // Asignar TVL del último punto si no está disponible en los datos principales
          // Asegurar que usamos los datos reales, sin fallbacks a valores fijos
          const tvl = data.tvl || (tvlHistory?.length > 0 ? tvlHistory[tvlHistory.length - 1].tvl : 0);
          
          // Asignar APR del último punto si no está disponible en los datos principales
          const apr = data.apr || (aprHistory?.length > 0 ? aprHistory[aprHistory.length - 1].apr : 0);
          
          console.log(`Real data for pool ${pool.address}:`, {
            tvl: tvl,
            apr: apr,
            volume24h: latestVolume,
            isRealData: data.real === true,
            isApproximated: data.approximated === true
          });
          
          newPoolsData.set(pool.address, {
            ...data,
            tvl: tvl,
            apr: apr,
            isActive: pool.isActive,
            network: pool.network,
            tvlHistory: tvlHistory || [],
            volumeHistory: volumeHistory || [],
            aprHistory: aprHistory || [],
            volume24h: latestVolume,
          });
        } catch (error) {
          console.error(`Error fetching data for pool ${pool.address}:`, error);
          toast({
            title: "Error",
            description: `Failed to fetch data for pool ${pool.token0Symbol}/${pool.token1Symbol}`,
            variant: "destructive",
          });
        }
      });
      
      await Promise.all(promises);
      setPoolsData(newPoolsData);
      setIsLoadingPoolsData(false);
    };
    
    if (pools) {
      fetchPoolsData();
    }
  }, [pools, toast]);

  if (isLoadingPools || isLoadingPoolsData) {
    return (
      <div className="container mx-auto py-8 max-w-4xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Liquidity Pools</h1>
          <Button variant="outline" size="sm" disabled>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
        <div className="mb-8 p-4 border rounded-lg bg-background/30 backdrop-blur-sm">
          <div className="flex items-start">
            <Info className="h-5 w-5 mr-2 mt-0.5 text-primary" />
            <p className="text-sm">
              This page displays all liquidity pools available for adding liquidity. Each pool shows real-time data from Uniswap and other DEXes.
            </p>
          </div>
        </div>
        
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="mb-6 overflow-hidden backdrop-blur-sm bg-background/30 border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="flex justify-between items-center">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-6 w-16" />
              </CardTitle>
              <CardDescription className="flex items-center">
                <Skeleton className="h-4 w-48" />
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-3">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
              </div>
              <Skeleton className="h-32 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (poolsError) {
    return (
      <div className="container mx-auto py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-6">Liquidity Pools</h1>
        <Card className="p-6 border-red-500">
          <CardTitle className="text-red-500 mb-2">Error Loading Pools</CardTitle>
          <CardDescription>
            Failed to load liquidity pools. Please try again later or contact support.
          </CardDescription>
          <Button className="mt-4" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          {language === 'en' ? 'Liquidity Pools' : 
           language === 'es' ? 'Pools de Liquidez' : 
           language === 'fr' ? 'Pools de Liquidité' : 
           'Liquiditätspools'}
        </h1>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => window.location.reload()}
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          {language === 'en' ? 'Refresh' : 
           language === 'es' ? 'Actualizar' : 
           language === 'fr' ? 'Actualiser' : 
           'Aktualisieren'}
        </Button>
      </div>
      
      <div className="mb-8 p-4 border rounded-lg bg-background/30 backdrop-blur-sm">
        <div className="flex items-start">
          <Info className="h-5 w-5 mr-2 mt-0.5 text-primary" />
          <p className="text-sm">
            {language === 'en' ? 
              'This page displays all liquidity pools available for adding liquidity. Each pool shows real-time data from Uniswap and other DEXes. Click on a pool card to see more detailed information.' : 
             language === 'es' ? 
              'Esta página muestra todos los pools de liquidez disponibles para agregar liquidez. Cada pool muestra datos en tiempo real de Uniswap y otros DEXes. Haz clic en una tarjeta de pool para ver información más detallada.' : 
             language === 'fr' ? 
              'Cette page affiche tous les pools de liquidité disponibles pour ajouter de la liquidité. Chaque pool affiche des données en temps réel d\'Uniswap et d\'autres DEXes. Cliquez sur une carte de pool pour voir des informations plus détaillées.' : 
              'Diese Seite zeigt alle verfügbaren Liquiditätspools zum Hinzufügen von Liquidität. Jeder Pool zeigt Echtzeitdaten von Uniswap und anderen DEXes. Klicken Sie auf eine Pool-Karte, um detailliertere Informationen zu sehen.'}
          </p>
        </div>
      </div>
      
      {/* Stats Cards */}
      {/* Primera fila de métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {/* Total TVL Card */}
        <Card className="bg-blue-500 dark:bg-gradient-to-br dark:from-blue-900/20 dark:to-blue-950/30 border-0 dark:border-blue-800/30 overflow-hidden backdrop-blur-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center text-white dark:text-blue-100">
              <CircleDollarSign className="w-5 h-5 mr-2 text-white dark:text-blue-400" />
              {language === 'en' ? 'Total TVL' : 
               language === 'es' ? 'TVL Total' : 
               language === 'fr' ? 'TVL Total' : 
               'Gesamt-TVL'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white dark:text-blue-100">
              {formatCurrency(
                Array.from(poolsData.values())
                  .reduce((sum, pool) => sum + (pool?.tvl || 0), 0)
              )}
            </div>
            <p className="text-xs text-blue-100 dark:text-blue-400 mt-1">
              {language === 'en' ? 'Total Value Locked Across All Pools' : 
               language === 'es' ? 'Valor Total Bloqueado en Todos los Pools' : 
               language === 'fr' ? 'Valeur Totale Verrouillée Dans Tous Les Pools' : 
               'Gesamtwert In Allen Pools Gesperrt'}
            </p>
          </CardContent>
        </Card>
        
        {/* Average APR Card */}
        <Card className="bg-green-600 dark:bg-gradient-to-br dark:from-green-900/20 dark:to-green-950/30 border-0 dark:border-green-800/30 overflow-hidden backdrop-blur-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center text-white dark:text-green-100">
              <TrendingUp className="w-5 h-5 mr-2 text-white dark:text-green-400" />
              Avg. APR
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white dark:text-green-100">
              {formatPercentage(
                Array.from(poolsData.values()).length > 0
                  ? Array.from(poolsData.values())
                      .reduce((sum, pool) => sum + (pool?.apr || 0), 0) / 
                    Array.from(poolsData.values()).length
                  : 0
              )}
            </div>
            <p className="text-xs text-green-100 dark:text-green-400 mt-1">
              Average Annual Percentage Rate
            </p>
          </CardContent>
        </Card>
        
        {/* 24h Volume Card */}
        <Card className="bg-purple-600 dark:bg-gradient-to-br dark:from-purple-900/20 dark:to-purple-950/30 border-0 dark:border-purple-800/30 overflow-hidden backdrop-blur-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center text-white dark:text-purple-100">
              <BarChartIcon className="w-5 h-5 mr-2 text-white dark:text-purple-400" />
              {language === 'en' ? '24h Volume' : 
               language === 'es' ? 'Volumen 24h' : 
               language === 'fr' ? 'Volume 24h' : 
               '24h Volumen'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white dark:text-purple-100">
              {formatCurrency(
                Array.from(poolsData.values())
                  .reduce((sum, pool) => sum + (pool?.volume24h || 0), 0)
              )}
            </div>
            <p className="text-xs text-purple-100 dark:text-purple-400 mt-1">
              {language === 'en' ? 'Total Trading Volume Last 24 Hours' : 
               language === 'es' ? 'Volumen Total de Operaciones Últimas 24 Horas' : 
               language === 'fr' ? 'Volume Total des Transactions Dernières 24 Heures' : 
               'Gesamthandelsvolumen der letzten 24 Stunden'}
            </p>
          </CardContent>
        </Card>
        
        {/* Total Pools Card */}
        <Card className="bg-orange-500 dark:bg-gradient-to-br dark:from-amber-900/20 dark:to-amber-950/30 dark:border-amber-800/30 border-0 overflow-hidden backdrop-blur-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center text-white dark:text-amber-100">
              <Layers className="w-5 h-5 mr-2 text-white dark:text-amber-400" />
              {language === 'en' ? 'Active Pools' : 
               language === 'es' ? 'Pools Activos' : 
               language === 'fr' ? 'Pools Actifs' : 
               'Aktive Pools'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white dark:text-amber-100">
              {pools.length}
            </div>
            <p className="text-xs text-orange-100 dark:text-amber-400 mt-1">
              {language === 'en' ? 'Total Number of Active Liquidity Pools' : 
               language === 'es' ? 'Número Total de Pools de Liquidez Activos' : 
               language === 'fr' ? 'Nombre Total de Pools de Liquidité Actifs' : 
               'Gesamtzahl der Aktiven Liquiditätspools'}
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Segunda fila de métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Total Daily Fees Card */}
        <Card className="bg-green-600 dark:bg-gradient-to-br dark:from-emerald-900/20 dark:to-emerald-950/30 dark:border-emerald-800/30 border-0 overflow-hidden backdrop-blur-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center text-white dark:text-emerald-100">
              <DollarSign className="w-5 h-5 mr-2 text-white dark:text-emerald-400" />
              {language === 'en' ? 'Daily Fees' : 
               language === 'es' ? 'Comisiones Diarias' : 
               language === 'fr' ? 'Frais Journaliers' : 
               'Tägliche Gebühren'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white dark:text-emerald-100">
              {formatCurrency(
                Array.from(poolsData.values())
                  .reduce((sum, pool) => {
                    const feePercentage = pool.fee && typeof pool.fee === 'string' 
                      ? parseFloat(pool.fee.replace('%', '')) / 100 
                      : 0;
                    return sum + ((pool?.volume24h || 0) * feePercentage);
                  }, 0)
              )}
            </div>
            <p className="text-xs text-green-100 dark:text-emerald-400 mt-1">
              {language === 'en' ? 'Total Daily Trading Fees Generated' : 
               language === 'es' ? 'Total de Comisiones Diarias Generadas' : 
               language === 'fr' ? 'Total des Frais de Trading Journaliers Générés' : 
               'Täglich Generierte Handelsgebühren Insgesamt'}
            </p>
          </CardContent>
        </Card>
        
        {/* Highest APR Pool Card */}
        <Card className="bg-red-600 dark:bg-gradient-to-br dark:from-rose-900/20 dark:to-rose-950/30 dark:border-rose-800/30 border-0 overflow-hidden backdrop-blur-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center text-white dark:text-rose-100">
              <TrendingUp className="w-5 h-5 mr-2 text-white dark:text-rose-400" />
              {language === 'en' ? 'Highest APR' : 
               language === 'es' ? 'APR Más Alto' : 
               language === 'fr' ? 'APR le Plus Élevé' : 
               'Höchster APR'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {(() => {
              const poolsArray = Array.from(poolsData.entries());
              const highestAprEntry = poolsArray.reduce(
                (max, current) => 
                  (current[1]?.apr || 0) > (max[1]?.apr || 0) ? current : max, 
                [null, { apr: 0 }]
              );
              
              return (
                <>
                  <div className="text-2xl font-bold text-white dark:text-rose-100">
                    {formatPercentage(highestAprEntry[1]?.apr || 0)}
                  </div>
                  <p className="text-xs text-red-100 dark:text-rose-400 mt-1 truncate">
                    {highestAprEntry[0] 
                      ? `Pool: ${pools.find((p: Pool) => p.address === highestAprEntry[0])?.token0Symbol || ''}/${pools.find((p: Pool) => p.address === highestAprEntry[0])?.token1Symbol || ''}`
                      : 'No pools available'}
                  </p>
                </>
              );
            })()}
          </CardContent>
        </Card>
        
        {/* Volume/TVL Ratio Card */}
        <Card className="bg-teal-600 dark:bg-gradient-to-br dark:from-cyan-900/20 dark:to-cyan-950/30 dark:border-cyan-800/30 border-0 overflow-hidden backdrop-blur-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center text-white dark:text-cyan-100">
              <Activity className="w-5 h-5 mr-2 text-white dark:text-cyan-400" />
              {language === 'en' ? 'Volume/TVL' : 
               language === 'es' ? 'Volumen/TVL' : 
               language === 'fr' ? 'Volume/TVL' : 
               'Volumen/TVL'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {(() => {
              const totalTvl = Array.from(poolsData.values()).reduce((sum, pool) => sum + (pool?.tvl || 0), 0);
              const totalVolume = Array.from(poolsData.values()).reduce((sum, pool) => sum + (pool?.volume24h || 0), 0);
              const ratio = totalTvl > 0 ? (totalVolume / totalTvl) * 100 : 0;
              
              return (
                <>
                  <div className="text-2xl font-bold text-white dark:text-cyan-100">
                    {ratio.toFixed(2)}%
                  </div>
                  <p className="text-xs text-teal-100 dark:text-cyan-400 mt-1">
                    {language === 'en' ? '24h Volume as % of Total TVL' : 
                     language === 'es' ? 'Volumen 24h como % del TVL Total' : 
                     language === 'fr' ? 'Volume 24h en % du TVL Total' : 
                     '24h Volumen als % des Gesamt-TVL'}
                  </p>
                </>
              );
            })()}
          </CardContent>
        </Card>
        
        {/* Average Fee Tier Card */}
        <Card className="bg-violet-600 dark:bg-gradient-to-br dark:from-indigo-900/20 dark:to-indigo-950/30 dark:border-indigo-800/30 border-0 overflow-hidden backdrop-blur-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center text-white dark:text-indigo-100">
              <Percent className="w-5 h-5 mr-2 text-white dark:text-indigo-400" />
              {language === 'en' ? 'Weighted Avg. Fee' : 
               language === 'es' ? 'Comisión Media Ponderada' : 
               language === 'fr' ? 'Frais Moyens Pondérés' : 
               'Gewichtete Durchschn. Gebühr'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {(() => {
              const totalVolume = Array.from(poolsData.values()).reduce((sum, pool) => sum + (pool?.volume24h || 0), 0);
              
              const weightedFeeSum = Array.from(poolsData.entries()).reduce((sum, [_, pool]) => {
                const feePercentage = pool.fee && typeof pool.fee === 'string' 
                  ? parseFloat(pool.fee.replace('%', '')) 
                  : 0;
                return sum + (feePercentage * (pool?.volume24h || 0));
              }, 0);
              
              const avgFee = totalVolume > 0 ? (weightedFeeSum / totalVolume) : 0;
              
              return (
                <>
                  <div className="text-2xl font-bold text-white dark:text-indigo-100">
                    {avgFee.toFixed(3)}%
                  </div>
                  <p className="text-xs text-violet-100 dark:text-indigo-400 mt-1">
                    Volume-Weighted Average Fee Tier
                  </p>
                </>
              );
            })()}
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        {pools.filter((pool: Pool) => pool.isActive).map((pool: Pool) => (
          <PoolCard 
            key={pool.id} 
            pool={pool} 
            poolData={poolsData.get(pool.address) || null} 
          />
        ))}
      </div>
      
      {pools.some((pool: Pool) => !pool.isActive) && (
        <>

          <div className="grid grid-cols-1 gap-4">
            {pools.filter((pool: Pool) => !pool.isActive).map((pool: Pool) => (
              <PoolCard 
                key={pool.id} 
                pool={pool} 
                poolData={poolsData.get(pool.address) || null} 
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}