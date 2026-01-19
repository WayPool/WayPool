import { useEffect, useState } from "react";
import { Link } from "wouter";
import { 
  CircleDollarSign, 
  TrendingUp, 
  BarChart,
  Layers,
  DollarSign,
  Activity,
  Percent,
  ExternalLink
} from "lucide-react";
import { formatCurrency, formatPercentage } from "@/utils/format";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useTranslation } from "@/hooks/use-translation";

interface PoolData {
  address: string;
  token0Symbol: string;
  token1Symbol: string;
  tvl: number;
  volume24h: number;
  apr: number;
  fee: string;
  real?: boolean;
  isRealData?: boolean;
  approximated?: boolean;
  isApproximated?: boolean;
}

interface PoolStatisticsProps {
  className?: string;
}

export default function PoolStatistics({ className }: PoolStatisticsProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [pools, setPools] = useState<any[]>([]);
  const [poolsData, setPoolsData] = useState<Map<string, PoolData>>(new Map());
  const { toast } = useToast();
  const { t } = useTranslation();

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        // Obtener la lista de pools activos
        const response = await fetch('/api/pools/custom');
        if (!response.ok) {
          throw new Error('Failed to fetch pools');
        }
        
        const poolsData = await response.json();
        // Filtrar solo los pools activos
        const activePools = poolsData.filter((pool: any) => pool.isActive === true);
        // Pools activos identificados
        
        if (activePools.length === 0) {
          // Si no hay pools marcados como activos, usar todos los pools disponibles
          console.warn("No se encontraron pools marcados como activos. Usando todos los pools disponibles.");
          setPools(poolsData);
        } else {
          setPools(activePools);
        }
        
        // Cargar los datos de cada pool
        const poolsToFetch = activePools.length > 0 ? activePools : poolsData;
        await fetchPoolsData(poolsToFetch);
      } catch (error) {
        console.error("Error loading pools:", error);
        toast({
          title: "Error",
          description: "No se pudieron cargar los datos de pools",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchData();
  }, [toast]);

  async function fetchPoolsData(pools: any[]) {
    if (!pools || pools.length === 0) {
      console.error("No hay pools activos para mostrar");
      return;
    }
    
    // Iniciando carga de datos para pools activos
    
    const newPoolsData = new Map<string, PoolData>();
    
    const promises = pools.map(async (pool) => {
      try {
        // Obteniendo datos de pool
        
        // Obtener datos de Uniswap para este pool (incluyendo network)
        const response = await fetch(`/api/blockchain/uniswap-pool?address=${pool.address}&network=${pool.network || 'ethereum'}`);
        if (!response.ok) {
          throw new Error(`Error fetching pool data for ${pool.address}`);
        }
        
        const data = await response.json();
        // Datos API recibidos correctamente
        
        // Obtener historial TVL (opcional, pero útil para asegurar que tenemos TVL actual)
        const tvlHistoryResponse = await fetch(`/api/blockchain/tvl-history?address=${pool.address}&network=${pool.network || 'ethereum'}`);
        const tvlHistory = await tvlHistoryResponse.json();
        
        // Obtener historial volumen para asegurar datos actuales
        const volumeHistoryResponse = await fetch(`/api/blockchain/trading-volume?address=${pool.address}&network=${pool.network || 'ethereum'}`);
        const volumeHistory = await volumeHistoryResponse.json();
        
        // Asegurarnos de que tenemos valores actuales
        const latestVolumeEntry = volumeHistory[volumeHistory.length - 1];
        const latestVolume = latestVolumeEntry?.volume || data.volume24h || 0;
        
        // Asignar TVL del último punto si no está disponible en los datos principales
        const tvl = data.tvl || (tvlHistory?.length > 0 ? tvlHistory[tvlHistory.length - 1].tvl : 0);
        
        // Datos del pool procesados exitosamente
        
        // Convertir el fee a un formato consistente si viene como decimal o string
        const formattedFee = data.fee 
          ? typeof data.fee === 'number' 
            ? `${data.fee}%` 
            : data.fee 
          : pool.fee;
          
        // Fee formateado correctamente
        
        newPoolsData.set(pool.address, {
          address: pool.address,
          token0Symbol: pool.token0Symbol,
          token1Symbol: pool.token1Symbol,
          tvl: tvl,
          volume24h: latestVolume,
          apr: data.apr || 0,
          fee: formattedFee,
          real: data.real || data.isRealData,
          isRealData: data.real || data.isRealData,
          approximated: data.approximated || data.isApproximated,
          isApproximated: data.approximated || data.isApproximated
        });
      } catch (error) {
        console.error(`Error fetching data for pool ${pool.address}:`, error);
      }
    });
    
    await Promise.all(promises);
    // Datos de pools cargados exitosamente
    setPoolsData(newPoolsData);
  }

  // Calcular estadísticas generales
  const totalTvl = Array.from(poolsData.values()).reduce((sum, pool) => sum + (pool?.tvl || 0), 0);
  const avgApr = Array.from(poolsData.values()).length > 0
    ? Array.from(poolsData.values()).reduce((sum, pool) => sum + (pool?.apr || 0), 0) / 
      Array.from(poolsData.values()).length
    : 0;
  const totalVolume24h = Array.from(poolsData.values()).reduce((sum, pool) => sum + (pool?.volume24h || 0), 0);
  const activePools = pools.length;
  
  // Calcular comisiones diarias
  // Preparando datos de pools para cálculo de comisiones
  
  const dailyFees = Array.from(poolsData.values()).reduce((sum, pool) => {
    const feePercentage = pool.fee && typeof pool.fee === 'string' 
      ? parseFloat(pool.fee.replace('%', '')) / 100 
      : 0;
    const feeAmount = (pool?.volume24h || 0) * feePercentage;
    
    // Cálculo de comisión para pool
    
    return sum + feeAmount;
  }, 0);
  
  // Total de comisiones diarias calculado
  
  // Encontrar pool con APR más alto
  const poolsArray = Array.from(poolsData.entries());
  const highestAprEntry = poolsArray.reduce(
    (max, current) => 
      (current[1]?.apr || 0) > (max[1]?.apr || 0) ? current : max, 
    ["", { apr: 0 } as any]
  );
  
  const highestApr = highestAprEntry[1]?.apr || 0;
  // APR más alto identificado
  
  const highestAprPool = highestAprEntry[0] 
    ? pools.find((p: any) => p.address === highestAprEntry[0])
    : null;
  
  // Calcular ratio Volumen/TVL
  const volumeTvlRatio = totalTvl > 0 ? (totalVolume24h / totalTvl) * 100 : 0;
  
  // Calcular promedio ponderado de comisiones
  const weightedFeeSum = Array.from(poolsData.entries()).reduce((sum, [address, pool]) => {
    const feePercentage = pool.fee && typeof pool.fee === 'string' 
      ? parseFloat(pool.fee.replace('%', '')) 
      : 0;
    
    const weightedFee = feePercentage * (pool?.volume24h || 0);
    // Cálculo ponderado de comisión
    
    return sum + weightedFee;
  }, 0);
  
  // Suma de comisiones ponderadas y volumen total calculados
  const weightedAvgFee = totalVolume24h > 0 ? (weightedFeeSum / totalVolume24h) : 0;
  // Comisión promedio ponderada calculada

  return (
    <div className={`w-full ${className}`}>
      <div className="flex flex-col space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl md:text-3xl font-bold">{t('liquidityPoolsTitle') || "Liquidity Pools"}</h2>
          <Button variant="outline" size="sm" asChild>
            <Link href="/pools" className="inline-flex items-center">
              <ExternalLink className="mr-2 h-4 w-4" />
              {t('viewAllPools')}
            </Link>
          </Button>
        </div>
        
        <div className="text-sm text-muted-foreground">
          <p>
            {t('liquidityPoolsDescription') || "Explore our Uniswap v4 liquidity pools with real-time data and comprehensive statistics on performance and returns"}
          </p>
        </div>

        {/* Primera fila de stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {/* Total TVL Card */}
          <Card className="dark:bg-gradient-to-br dark:from-blue-900/20 dark:to-blue-950/30 dark:border-blue-800/30 
                         bg-gradient-to-br from-blue-700 to-blue-600 border-blue-700 overflow-hidden backdrop-blur-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center dark:text-blue-100 text-white">
                <CircleDollarSign className="w-5 h-5 mr-2 dark:text-blue-400 text-blue-200" />
                {t('totalValueLocked')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold dark:text-blue-100 text-white">
                {isLoading ? t('loading') || "Cargando..." : formatCurrency(totalTvl)}
              </div>
              <p className="text-xs dark:text-blue-400 text-blue-100 mt-1">
                {t('totalValueLockedDesc') || "Total Value Locked Across All Pools"}
              </p>
            </CardContent>
          </Card>
          
          {/* Average APR Card */}
          <Card className="dark:bg-gradient-to-br dark:from-green-900/20 dark:to-green-950/30 dark:border-green-800/30 
                          bg-gradient-to-br from-green-700 to-green-600 border-green-700 overflow-hidden backdrop-blur-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center dark:text-green-100 text-white">
                <TrendingUp className="w-5 h-5 mr-2 dark:text-green-400 text-green-200" />
                {t('avgApr') || "Avg. APR"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold dark:text-green-100 text-white">
                {isLoading ? t('loading') || "Cargando..." : formatPercentage(avgApr)}
              </div>
              <p className="text-xs dark:text-green-400 text-green-100 mt-1">
                {t('avgAprDesc') || "Average Annual Percentage Rate"}
              </p>
            </CardContent>
          </Card>
          
          {/* 24h Volume Card */}
          <Card className="dark:bg-gradient-to-br dark:from-purple-900/20 dark:to-purple-950/30 dark:border-purple-800/30 
                          bg-gradient-to-br from-purple-700 to-purple-600 border-purple-700 overflow-hidden backdrop-blur-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center dark:text-purple-100 text-white">
                <BarChart className="w-5 h-5 mr-2 dark:text-purple-400 text-purple-200" />
                {t('24hVolume') || "24h Volume"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold dark:text-purple-100 text-white">
                {isLoading ? t('loading') || "Cargando..." : formatCurrency(totalVolume24h)}
              </div>
              <p className="text-xs dark:text-purple-400 text-purple-100 mt-1">
                {t('24hVolumeDesc') || "Total Trading Volume Last 24 Hours"}
              </p>
            </CardContent>
          </Card>
          
          {/* Active Pools Card */}
          <Card className="dark:bg-gradient-to-br dark:from-amber-900/20 dark:to-amber-950/30 dark:border-amber-800/30 
                          bg-gradient-to-br from-amber-700 to-amber-600 border-amber-700 overflow-hidden backdrop-blur-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center dark:text-amber-100 text-white">
                <Layers className="w-5 h-5 mr-2 dark:text-amber-400 text-amber-200" />
                {t('activePools') || "Active Pools"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold dark:text-amber-100 text-white">
                {isLoading ? t('loading') || "Cargando..." : activePools}
              </div>
              <p className="text-xs dark:text-amber-400 text-amber-100 mt-1">
                {t('activePoolsDesc') || "Total Number of Active Liquidity Pools"}
              </p>
            </CardContent>
          </Card>
        </div>
        
        {/* Segunda fila de stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {/* Daily Fees Card */}
          <Card className="dark:bg-gradient-to-br dark:from-emerald-900/20 dark:to-emerald-950/30 dark:border-emerald-800/30 
                          bg-gradient-to-br from-emerald-700 to-emerald-600 border-emerald-700 overflow-hidden backdrop-blur-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center dark:text-emerald-100 text-white">
                <DollarSign className="w-5 h-5 mr-2 dark:text-emerald-400 text-emerald-200" />
                {t('dailyFees') || "Daily Fees"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold dark:text-emerald-100 text-white">
                {isLoading ? t('loading') || "Cargando..." : formatCurrency(dailyFees)}
              </div>
              <p className="text-xs dark:text-emerald-400 text-emerald-100 mt-1">
                {t('dailyFeesDesc') || "Total Daily Trading Fees Generated"}
              </p>
            </CardContent>
          </Card>
          
          {/* Highest APR Card */}
          <Card className="dark:bg-gradient-to-br dark:from-rose-900/20 dark:to-rose-950/30 dark:border-rose-800/30 
                          bg-gradient-to-br from-rose-700 to-rose-600 border-rose-700 overflow-hidden backdrop-blur-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center dark:text-rose-100 text-white">
                <TrendingUp className="w-5 h-5 mr-2 dark:text-rose-400 text-rose-200" />
                {t('highestApr') || "Highest APR"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold dark:text-rose-100 text-white">
                {isLoading ? t('loading') || "Cargando..." : formatPercentage(highestApr)}
              </div>
              <p className="text-xs dark:text-rose-400 text-rose-100 mt-1 truncate">
                {isLoading
                  ? t('loading') || "Cargando..."
                  : highestAprPool
                    ? `${t('pool') || "Pool"}: ${highestAprPool.token0Symbol}/${highestAprPool.token1Symbol}`
                    : t('noPoolsAvailable') || "No pools available"}
              </p>
            </CardContent>
          </Card>
          
          {/* Volume/TVL Ratio Card */}
          <Card className="dark:bg-gradient-to-br dark:from-cyan-900/20 dark:to-cyan-950/30 dark:border-cyan-800/30 
                          bg-gradient-to-br from-cyan-700 to-cyan-600 border-cyan-700 overflow-hidden backdrop-blur-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center dark:text-cyan-100 text-white">
                <Activity className="w-5 h-5 mr-2 dark:text-cyan-400 text-cyan-200" />
                {t('volumeTvlRatio') || "Volume/TVL"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold dark:text-cyan-100 text-white">
                {isLoading ? t('loading') || "Cargando..." : `${volumeTvlRatio.toFixed(2)}%`}
              </div>
              <p className="text-xs dark:text-cyan-400 text-cyan-100 mt-1">
                {t('volumeTvlRatioDesc') || "24h Volume as % of Total TVL"}
              </p>
            </CardContent>
          </Card>
          
          {/* Weighted Average Fee Card */}
          <Card className="dark:bg-gradient-to-br dark:from-indigo-900/20 dark:to-indigo-950/30 dark:border-indigo-800/30 
                         bg-gradient-to-br from-indigo-100 to-indigo-200 border-indigo-300 overflow-hidden backdrop-blur-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center dark:text-indigo-100 text-indigo-900">
                <Percent className="w-5 h-5 mr-2 dark:text-indigo-400 text-indigo-600" />
                {t('weightedAvgFee') || "Weighted Avg. Fee"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold dark:text-indigo-100 text-indigo-800">
                {isLoading ? t('loading') || "Cargando..." : `${weightedAvgFee.toFixed(3)}%`}
              </div>
              <p className="text-xs dark:text-indigo-400 text-indigo-700 mt-1">
                {t('weightedAvgFeeDesc') || "Volume-Weighted Average Fee Tier"}
              </p>
            </CardContent>
          </Card>
        </div>
        
        {/* Botón de explorar todos los pools */}
        <div className="flex justify-center">
          <Button asChild size="lg" className="mt-4">
            <Link href="/pools" className="inline-flex items-center">
              {t('viewAllPools')}
              <ExternalLink className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}