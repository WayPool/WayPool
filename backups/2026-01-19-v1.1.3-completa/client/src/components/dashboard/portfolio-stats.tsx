import React, { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  ArrowUpRight, 
  ArrowDownRight,
  CircleDollarSign, 
  Wallet, 
  Package, 
  PackageCheck,
  ChevronRight,
  Info,
  CalendarIcon,
  CreditCard,
  Plus,
  TrendingUp,
  GanttChart,
  BarChart3,
  Clock, 
  CircleOff,
  Layers,
  Activity,
  CheckCircle,
  LineChart,
  PieChart as PieChartIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { usePositions } from "@/hooks/use-positions";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { formatCurrency } from "@/lib/ethereum";
import PositionDistributionChart, { PositionDistributionItem } from "./position-distribution-chart";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "@/hooks/use-translation";
import { dashboardTranslations } from "@/translations/dashboard";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip as RechartTooltip } from 'recharts';
import ActivePositionsChart from "./active-positions-chart";
import ProjectedEarningsChart from "./projected-earnings-chart";
import CapitalVsBenefitsChart from "./capital-vs-benefits-chart";
import RoiTrendChart from "./roi-trend-chart";
import PerformanceComparisonChart from "./performance-comparison-chart";
import CumulativeEarningsChart from "./cumulative-earnings-chart";

// Componente adaptativo que ajusta el tamaño del texto para ocupar el espacio disponible
interface AdaptiveTextProps {
  value: string;
  className?: string;
  minFontSize?: number;
  maxFontSize?: number;
}

const AdaptiveText: React.FC<AdaptiveTextProps> = ({ 
  value, 
  className = "font-bold", 
  minFontSize = 1.5, 
  maxFontSize = 3 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);
  const [fontSize, setFontSize] = useState(2); // Tamaño inicial en rem
  
  useEffect(() => {
    const calculateIdealFontSize = () => {
      if (!containerRef.current || !textRef.current) return;
      
      const containerWidth = containerRef.current.clientWidth;
      const textLength = value.length;
      
      // Ajuste basado en la longitud del texto y el ancho del contenedor
      // Más caracteres = menor tamaño, contenedor más grande = mayor tamaño
      let idealSize = containerWidth / (textLength * 10);
      
      // Ajuste adicional para mantener dentro de los límites
      idealSize = Math.min(Math.max(idealSize, minFontSize), maxFontSize);
      
      setFontSize(idealSize);
    };
    
    calculateIdealFontSize();
    
    // Recalcular cuando cambie el tamaño de la ventana
    const handleResize = () => {
      calculateIdealFontSize();
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [value, minFontSize, maxFontSize]);
  
  return (
    <div ref={containerRef} className="w-full overflow-hidden">
      <h3 
        ref={textRef}
        className={`${className} transition-all duration-300`}
        style={{ fontSize: `${fontSize}rem` }}
      >
        {value}
      </h3>
    </div>
  );
};

// Usamos el componente importado CapitalVsBenefitsChart para esta funcionalidad

const PortfolioStats: React.FC = () => {
  const { t, language } = useTranslation();
  const { 
    totalLiquidityValue, 
    totalFeesEarned, 
    totalFeesEarnedRaw,
    currentAvailableFeesEarned,
    totalCollectedFeesEarned,
    totalCollectedFeesEarnedRaw, // Añadimos la variable raw
    activePositionsCount,
    isLoadingPositions,
    dbPositions,
    monthlyComparisonData
  } = usePositions();
  
  // Datos para mostrar cambio mensual y ganancias del mes actual
  const monthlyPercentageChange = monthlyComparisonData?.percentageChange || 0;
  const currentMonthFees = monthlyComparisonData?.currentMonth || 0;
  
  // Calcular valores para el gráfico de Capital vs Beneficios
  const totalCapital = React.useMemo(() => {
    if (!dbPositions) return 0;
    return dbPositions.reduce((sum: number, pos: any) => sum + parseFloat(pos.depositedUSDC || '0'), 0);
  }, [dbPositions]);
  
  const totalBenefits = React.useMemo(() => {
    // Usamos solo totalFeesEarnedRaw que ya incluye tanto los fees actuales como los recolectados
    // Evitamos la duplicación al no sumar totalCollectedFeesEarnedRaw que ya está incluido en totalFeesEarnedRaw
    const benefitsValue = totalFeesEarnedRaw || 0;
    console.log(`[Debug Chart] totalCapital: ${totalCapital}, totalBenefits: ${benefitsValue}, ratio: ${(benefitsValue / (totalCapital + benefitsValue) * 100).toFixed(2)}%`);
    return benefitsValue;
  }, [totalFeesEarnedRaw, totalCapital]);
  
  // Función de utilidad para calcular ganancias totales basadas en tiempo real
  const calculateTotalEarnings = React.useCallback((positions: any[]) => {
    // Usando la fecha real del sistema en tiempo real
    const now = new Date();
    
    // Ya NO filtramos solo posiciones activas para mantener el historial completo
    // Calcular ganancias totales para TODAS las posiciones, independientemente de su estado
    
    // Calcular ganancias totales usando fórmula: Monto * APR / 365 * días transcurridos
    const totalEarnings = positions.reduce((sum: number, pos: any) => {
      // Asegurar que siempre tengamos una fecha de inicio válida
      const startDate = pos.startDate ? new Date(pos.startDate) : new Date(pos.timestamp);
      
      // Calcular minutos exactos transcurridos para mayor precisión
      const minutesElapsed = Math.max(1, Math.floor((now.getTime() - startDate.getTime()) / (1000 * 60)));
      const daysElapsed = minutesElapsed / (24 * 60);
      
      // Calcular las ganancias diarias basadas en APR
      const aprPercentage = parseFloat(String(pos.apr)) / 100;
      const dailyEarnings = (parseFloat(String(pos.depositedUSDC)) * aprPercentage) / 365;
      
      // Calcular ganancias totales basadas en días transcurridos
      const positionEarnings = dailyEarnings * daysElapsed;
      
      console.log(`Posición ${pos.id}: ${pos.depositedUSDC} USDC × ${pos.apr}% APR ÷ 365 × ${daysElapsed.toFixed(2)} días = ${positionEarnings.toFixed(2)} USDC`);
      
      return sum + positionEarnings;
    }, 0);
    
    return totalEarnings;
  }, []);
  
  // Datos de crecimiento para comparación de ventanas móviles de 30 días
  const monthlyFeesData = React.useMemo(() => {
    // Usando la fecha real del sistema en tiempo real
    const now = new Date();
    
    // Definimos ventanas móviles de 30 días 
    // Ventana actual: desde hace 30 días hasta hoy
    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(now.getDate() - 30);
    
    // Ventana anterior: desde hace 60 días hasta hace 30 días
    const sixtyDaysAgo = new Date(now);
    sixtyDaysAgo.setDate(now.getDate() - 60);
    
    console.log(`[Comparación Rendimientos] Ventana actual: ${thirtyDaysAgo.toISOString()} - ${now.toISOString()}`);
    console.log(`[Comparación Rendimientos] Ventana anterior: ${sixtyDaysAgo.toISOString()} - ${thirtyDaysAgo.toISOString()}`);
    
    // Ya NO filtramos solo posiciones activas para el cálculo de rendimientos
    // Incluir todas las posiciones en el cálculo para la ventana actual
    
    // Calcular fees de la ventana de 30 días actual (últimos 30 días)
    const currentMonthFees = dbPositions.reduce((sum: number, pos: any) => {
      const startDate = pos.startDate ? new Date(pos.startDate) : new Date(pos.timestamp);
      
      // Determinar la fecha de inicio para el cálculo (la más reciente entre la fecha de inicio de la posición y hace 30 días)
      const calculationStartDate = startDate > thirtyDaysAgo ? startDate : thirtyDaysAgo;
      
      // Solo calculamos si la posición existía dentro de la ventana actual
      if (startDate <= now) {
        // Calculamos minutos activos durante la ventana actual
        const minutesActive = Math.floor((now.getTime() - calculationStartDate.getTime()) / (1000 * 60));
        
        // Calculamos fees por minuto
        const dailyFees = (parseFloat(pos.depositedUSDC) * (parseFloat(pos.apr) / 100)) / 365;
        const minutelyFees = dailyFees / (24 * 60);
        
        return sum + (minutelyFees * minutesActive);
      }
      
      return sum;
    }, 0);
    
    // Calcular fees de la ventana de 30 días anterior (de hace 60 días a hace 30 días)
    // Usando todas las posiciones para mantener coherencia con el cálculo actual
    const previousMonthFees = dbPositions.reduce((sum: number, pos: any) => {
      const startDate = pos.startDate ? new Date(pos.startDate) : new Date(pos.timestamp);
      
      // Solo consideramos posiciones que existían dentro de la ventana anterior
      if (startDate <= thirtyDaysAgo) {
        // Determinar la fecha de inicio para el cálculo (la más reciente entre la fecha de inicio de la posición y hace 60 días)
        const calculationStartDate = startDate > sixtyDaysAgo ? startDate : sixtyDaysAgo;
        
        // Calculamos minutos activos durante la ventana anterior
        const minutesActive = Math.floor((thirtyDaysAgo.getTime() - calculationStartDate.getTime()) / (1000 * 60));
        
        // Calculamos fees por minuto
        const dailyFees = (parseFloat(pos.depositedUSDC) * (parseFloat(pos.apr) / 100)) / 365;
        const minutelyFees = dailyFees / (24 * 60);
        
        return sum + (minutelyFees * minutesActive);
      }
      
      return sum;
    }, 0);
    
    // Calcular tasa de crecimiento entre las dos ventanas
    let feesGrowthRate = 0;
    // Solo calculamos el crecimiento cuando tenemos datos de la ventana anterior
    if (previousMonthFees > 0) {
      feesGrowthRate = ((currentMonthFees - previousMonthFees) / previousMonthFees) * 100;
    }
    
    console.log(`[Comparación Rendimientos] Ventana actual: $${currentMonthFees.toFixed(2)}, Ventana anterior: $${previousMonthFees.toFixed(2)}, Cambio: ${feesGrowthRate.toFixed(2)}%`);
    
    return {
      currentMonthFees,
      previousMonthFees,
      feesGrowthRate
    };
  }, [dbPositions]);
  
  // Calcular ganancias totales basadas en la fórmula (Monto * APR / 365 * días transcurridos)
  const calculatedTotalEarnings = React.useMemo(() => {
    return calculateTotalEarnings(dbPositions);
  }, [calculateTotalEarnings, dbPositions]);
  
  // Preparamos los datos para el gráfico de distribución por pools
  const positionDistributionData = React.useMemo(() => {
    if (!dbPositions || dbPositions.length === 0) return [];
    
    // Contador para pools
    const poolCounter: Record<string, number> = {};
    
    // Recorrer las posiciones activas y contar por pool
    dbPositions
      .filter((pos: any) => pos.status === "Active")
      .forEach((pos: any) => {
        const poolName = pos.poolName || `${pos.token0Symbol}-${pos.token1Symbol}`;
        poolCounter[poolName] = (poolCounter[poolName] || 0) + 1;
      });
    
    // Colores para los diferentes pools (degradado de púrpuras y azules)
    const colors = [
      "#8b5cf6", // Purple
      "#3b82f6", // Blue
      "#6366f1", // Indigo
      "#ec4899", // Pink
      "#06b6d4", // Cyan
      "#10b981", // Emerald
      "#a855f7", // Fuchsia
    ];
    
    // Convertir a array para el gráfico
    return Object.entries(poolCounter).map(([poolName, count], index) => ({
      name: poolName,
      value: count,
      color: colors[index % colors.length]
    }));
  }, [dbPositions]);

  // Calculamos las ganancias proyectadas basadas en la APR actual
  const projectedEarnings = React.useMemo(() => {
    if (!dbPositions || dbPositions.length === 0) {
      return {
        daily: 0,
        weekly: 0,
        monthly: 0,
        yearly: 0
      };
    }

    // Sumar el capital y APR de todas las posiciones activas
    const activePositions = dbPositions.filter((pos: any) => pos.status === "Active");
    const totalValue = activePositions.reduce((sum: number, pos: any) => sum + parseFloat(pos.depositedUSDC || '0'), 0);
    
    // Calcular promedio ponderado de APR
    const weightedAprSum = activePositions.reduce((sum: number, pos: any) => {
      const value = parseFloat(pos.depositedUSDC || '0');
      const apr = parseFloat(pos.apr || '0');
      return sum + (value * apr);
    }, 0);
    
    const averageApr = totalValue > 0 ? weightedAprSum / totalValue : 0;
    
    // Calcular ganancias proyectadas
    const yearlyEarnings = (totalValue * averageApr) / 100;
    const monthlyEarnings = yearlyEarnings / 12;
    const weeklyEarnings = yearlyEarnings / 52;
    const dailyEarnings = yearlyEarnings / 365;

    return {
      daily: dailyEarnings,
      weekly: weeklyEarnings,
      monthly: monthlyEarnings,
      yearly: yearlyEarnings
    };
  }, [dbPositions]);

  // Obtenemos datos de posiciones y pools para el gráfico
  const positionStats = React.useMemo(() => {
    if (!dbPositions) return { activeCount: 0, poolsCount: 0 };
    
    const activePositions = dbPositions.filter((pos: any) => pos.status === "Active");
    const uniquePools = new Set(activePositions.map((pos: any) => pos.poolAddress));
    
    return {
      activeCount: activePositions.length,
      poolsCount: uniquePools.size
    };
  }, [dbPositions]);
  
  // Datos para el gráfico de ROI (Tendencia de rendimiento)
  const roiTrendData = React.useMemo(() => {
    if (!dbPositions || dbPositions.length === 0) {
      return Array(6).fill(0).map((_, i) => ({
        date: new Date(Date.now() - (5 - i) * 30 * 24 * 60 * 60 * 1000).toLocaleDateString('es-ES', { month: 'short', year: '2-digit' }),
        roi: 0
      }));
    }
    
    // Generamos datos de ROI para los últimos 6 meses
    // En un caso real, estos datos vendrían de la API/Base de datos
    const currentDate = new Date();
    
    // Extraemos APR promedio para usar en la simulación
    const activePositions = dbPositions.filter((pos: any) => pos.status === "Active");
    let avgApr = 0;
    if (activePositions.length > 0) {
      const aprSum = activePositions.reduce((sum: number, pos: any) => sum + parseFloat(pos.apr || '0'), 0);
      avgApr = aprSum / activePositions.length;
    }
    
    // Simulamos un crecimiento del ROI basado en el APR con pequeñas variaciones
    const baseMonthlyROI = avgApr / 12; // APR dividido por 12 meses
    
    return Array(6).fill(0).map((_, i) => {
      const monthsAgo = 5 - i;
      const date = new Date(currentDate);
      date.setMonth(date.getMonth() - monthsAgo);
      
      // Pequeña variación aleatoria para que el gráfico sea más natural
      const variation = (Math.random() * 0.5 - 0.25) * baseMonthlyROI;
      const roi = Math.max(0, baseMonthlyROI * (i + 1) + variation);
      
      return {
        date: date.toLocaleDateString('es-ES', { month: 'short', year: '2-digit' }),
        roi: Number(roi.toFixed(2))
      };
    });
  }, [dbPositions]);
  
  // Datos de comparación de rendimiento entre pools
  const performanceComparisonData = React.useMemo(() => {
    if (!dbPositions || dbPositions.length === 0) {
      return [
        { name: 'No hay datos', apr: 0, color: '#d1d5db' }
      ];
    }
    
    // Agrupamos por pools para mostrar comparativa de APR
    const poolsMap: Record<string, { apr: number, count: number, name: string }> = {};
    
    dbPositions.forEach((pos: any) => {
      if (pos.status !== "Active") return;
      
      const poolName = pos.poolName || `${pos.token0Symbol}-${pos.token1Symbol}`;
      const apr = parseFloat(pos.apr || '0');
      
      if (!poolsMap[poolName]) {
        poolsMap[poolName] = {
          apr,
          count: 1,
          name: poolName
        };
      } else {
        poolsMap[poolName].apr += apr;
        poolsMap[poolName].count += 1;
      }
    });
    
    // Calcular promedio de APR por pool
    const pools = Object.entries(poolsMap).map(([name, data]) => ({
      name,
      apr: data.count > 0 ? data.apr / data.count : 0,
      color: ''
    }));
    
    // Asignar colores
    const colors = ['#8b5cf6', '#3b82f6', '#10b981', '#6366f1', '#ec4899', '#f97316'];
    
    return pools.map((pool, index) => ({
      ...pool,
      color: colors[index % colors.length]
    }));
  }, [dbPositions]);
  
  // Datos para el gráfico de ganancias acumuladas
  const cumulativeEarningsData = React.useMemo(() => {
    if (!dbPositions || dbPositions.length === 0) {
      return Array(6).fill(0).map((_, i) => ({
        date: new Date(Date.now() - (5 - i) * 30 * 24 * 60 * 60 * 1000).toLocaleDateString('es-ES', { month: 'short', year: '2-digit' }),
        value: 0
      }));
    }
    
    // Para casos reales, estos datos deberían venir de la API y tener el historial real
    // Usamos el total de fees recolectados como base para simular la distribución
    // Aseguramos usar el valor correcto de fees recolectados sin duplicar
    const totalCollectedFees = totalCollectedFeesEarnedRaw || 0;
    
    // Generamos una distribución histórica simulada basada en el total actual
    // En un caso real, estos datos vendrían de la API/Base de datos
    const currentDate = new Date();
    let runningTotal = 0;
    
    return Array(6).fill(0).map((_, i) => {
      const monthsAgo = 5 - i;
      const date = new Date(currentDate);
      date.setMonth(date.getMonth() - monthsAgo);
      
      // Distribuimos los fees de forma progresiva (crecimiento exponencial suave)
      const monthProgress = (i + 1) / 6;
      const monthContribution = totalCollectedFees * (Math.pow(monthProgress, 1.5) - Math.pow((i) / 6, 1.5));
      runningTotal += monthContribution;
      
      return {
        date: date.toLocaleDateString('es-ES', { month: 'short', year: '2-digit' }),
        value: Number(runningTotal.toFixed(2))
      };
    });
  }, [dbPositions, totalCollectedFeesEarned]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {/* Primera Card: Valor Total + Capital vs Beneficios */}
      <Card className="flex flex-col h-full bg-gradient-to-b from-blue-950/90 to-indigo-950 dark:from-blue-950 dark:to-indigo-950 overflow-hidden border-0 shadow-lg">
        <CardContent className="p-6 flex flex-col h-full">
          {/* Cabecera con Valor Total */}
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-400"></div>
                <p className="text-slate-300 text-sm font-medium">
                  {dashboardTranslations[language].totalValueFees}
                </p>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-3.5 w-3.5 text-slate-400 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs w-64">
                        {dashboardTranslations[language].totalValueFeesTooltip}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              {isLoadingPositions ? (
                <div className="h-14 w-full bg-indigo-800/50 animate-pulse rounded mt-1"></div>
              ) : (
                <div className="text-4xl font-bold text-white leading-tight">
                  {totalLiquidityValue}
                </div>
              )}
            </div>
            <div className="bg-indigo-800/60 rounded-full p-2.5 shadow-md">
              <Wallet className="h-5 w-5 text-indigo-200" />
            </div>
          </div>
          
          {/* Gráfico Capital vs Beneficios - Title hardcoded to ensure it appears correctly */}
          <div className="mt-1 mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-300">
                {/* Título basado en idioma actual */}
                {dashboardTranslations[language].capitalVsBenefits}
              </span>
            </div>
            <div className="h-44">
              <CapitalVsBenefitsChart 
                capital={totalCapital} 
                benefits={totalBenefits}
              />
            </div>
          </div>
          
          {/* Botón de Add Liquidity */}
          <div className="mt-auto">
            <Link href="/add-liquidity">
              <Button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white border-0 flex items-center justify-center gap-1.5 font-medium py-5 rounded-md">
                <Plus className="h-4 w-4" />
                {dashboardTranslations[language]?.addLiquidity || "Agregar Liquidez"}
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Segunda Card: Total Earnings */}
      <Card className="flex flex-col h-full bg-gradient-to-b from-slate-950/90 to-blue-950 dark:from-slate-950 dark:to-blue-950 overflow-hidden border-0 shadow-lg">
        <CardContent className="p-6 flex flex-col h-full">
          {/* Cabecera con Total Earnings */}
          <div className="flex justify-between items-start mb-3">
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                <p className="text-slate-300 text-sm font-medium">
                  {dashboardTranslations[language].totalEarnings}
                </p>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-3.5 w-3.5 text-slate-400 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs w-64">
                        {dashboardTranslations[language].totalEarningsTooltip}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              {isLoadingPositions ? (
                <div className="h-14 w-full bg-blue-800/30 animate-pulse rounded mt-1"></div>
              ) : (
                <div className="text-4xl font-bold text-white leading-tight">
                  {totalFeesEarned}
                </div>
              )}
            </div>
            <div className="bg-blue-800/30 rounded-full p-2.5 shadow-md">
              <CircleDollarSign className="h-5 w-5 text-blue-200" />
            </div>
          </div>
          
          {/* Earnings Metrics */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="p-3 bg-blue-900/30 rounded-lg">
              <div className="flex items-center gap-1.5 mb-1">
                <CircleDollarSign className="h-3.5 w-3.5 text-blue-400" />
                <span className="text-xs font-medium text-slate-300">
                  {dashboardTranslations[language].availableNow}
                </span>
              </div>
              {isLoadingPositions ? (
                <div className="h-6 w-full bg-blue-800/30 animate-pulse rounded"></div>
              ) : (
                <div className="text-lg font-bold text-white">
                  {currentAvailableFeesEarned}
                </div>
              )}
            </div>
            
            <div className="p-3 bg-green-900/30 rounded-lg">
              <div className="flex items-center gap-1.5 mb-1">
                <CheckCircle className="h-3.5 w-3.5 text-green-400" />
                <span className="text-xs font-medium text-slate-300">
                  {dashboardTranslations[language].alreadyCollected}
                </span>
              </div>
              {isLoadingPositions ? (
                <div className="h-6 w-full bg-green-800/30 animate-pulse rounded"></div>
              ) : (
                <div className="text-lg font-bold text-white">
                  {totalCollectedFeesEarned}
                </div>
              )}
            </div>
          </div>
          
          {/* Últimos 30 días */}
          <div className="p-3 bg-slate-800/40 rounded-lg mb-4">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-slate-400" />
                <span className="text-xs font-medium text-slate-300">
                  {dashboardTranslations[language].last30Days}
                </span>
              </div>
              {monthlyPercentageChange !== 0 && (
                <Badge 
                  variant={monthlyPercentageChange > 0 ? "success" : "destructive"} 
                  className="px-1.5 py-0.5 h-auto text-xs bg-opacity-20"
                >
                  <span className="flex items-center gap-0.5">
                    {monthlyPercentageChange > 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                    {Math.abs(monthlyPercentageChange).toFixed(2)}%
                  </span>
                </Badge>
              )}
            </div>
            {isLoadingPositions ? (
              <div className="h-6 w-full bg-slate-700/40 animate-pulse rounded"></div>
            ) : (
              <div className="text-xl font-bold text-white">
                {formatCurrency(Number(currentMonthFees))}
              </div>
            )}
          </div>
          
          {/* Gráfico de rendimiento acumulado */}
          <div className="mt-auto">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-medium text-slate-300">
                {dashboardTranslations[language]?.cumulativeEarnings || "Ganancias Acumuladas"}
              </span>
            </div>
            <div className="h-28">
              <CumulativeEarningsChart data={cumulativeEarningsData} isLoading={isLoadingPositions} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tercera Card: Analítica de Pool */}
      <Card className="flex flex-col h-full bg-gradient-to-b from-slate-950/90 to-purple-950 dark:from-slate-950 dark:to-purple-950 overflow-hidden border-0 shadow-lg">
        <CardContent className="p-6 flex flex-col h-full">
          {/* Cabecera con Active Positions */}
          <div className="flex justify-between items-start mb-3">
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <div className="w-1.5 h-1.5 rounded-full bg-purple-400"></div>
                <p className="text-slate-300 text-sm font-medium">
                  {dashboardTranslations[language].activePositions}
                </p>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-3.5 w-3.5 text-slate-400 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs w-64">
                        {dashboardTranslations[language].activePositionsTooltip}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-4xl font-bold text-white leading-tight">
                  {activePositionsCount}
                </div>
                <span className="text-xs py-0.5 px-2 bg-purple-800/40 text-purple-300 rounded-md whitespace-nowrap">
                  {positionStats.poolsCount} {dashboardTranslations[language].pools}
                </span>
              </div>
            </div>
            <div className="bg-purple-800/30 rounded-full p-2.5 shadow-md">
              <Layers className="h-5 w-5 text-purple-200" />
            </div>
          </div>
          
          {/* Gráficos de análisis */}
          <div className="space-y-5 flex-grow">
            {/* ROI Trend */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-slate-300">
                  {dashboardTranslations[language].roiTrend}
                </span>
                <Badge variant="secondary" className="px-1.5 py-0 h-auto text-xs rounded-sm bg-purple-900/40 text-purple-300 border-0">
                  {roiTrendData[roiTrendData.length - 1]?.roi.toFixed(2)}% 
                  {dashboardTranslations[language].current}
                </Badge>
              </div>
              <div className="h-28">
                <RoiTrendChart data={roiTrendData} isLoading={isLoadingPositions} />
              </div>
            </div>

            {/* Pool Performance */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-slate-300">
                  {dashboardTranslations[language].poolPerformance}
                </span>
                <Badge variant="secondary" className="px-1.5 py-0 h-auto text-xs rounded-sm bg-purple-900/40 text-purple-300 border-0">
                  {positionStats.poolsCount} {dashboardTranslations[language].pools}
                </Badge>
              </div>
              <div className="h-28">
                <PerformanceComparisonChart data={performanceComparisonData} isLoading={isLoadingPositions} />
              </div>
            </div>
          </div>
          
          {/* Manage Positions Button */}
          <div className="mt-auto pt-6">
            <Link href="/positions">
              <Button className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white border-0 flex items-center justify-center gap-1.5 font-medium py-5 rounded-md">
                {dashboardTranslations[language]?.managePositions || "Gestionar Posiciones"}
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PortfolioStats;