import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { HelpCircle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { calculateCompleteRewards } from "@/lib/uniswap";
import { formatNumber } from "@/lib/utils";
import { apiRequest } from "@/lib/queryClient";
import { useTranslation } from "@/hooks/use-translation";
import { aprAdjustmentTranslations } from "@/translations/apr-adjustment-translations";

const LandingRewardsSimulator: React.FC = () => {
  // Obtener el traductor
  const { t, language } = useTranslation();
  
  // Estados del simulador
  const [amount, setAmount] = useState(25000);
  const [rangeWidth, setRangeWidth] = useState(3);
  const [timeframe, setTimeframe] = useState(90); // 3 meses por defecto
  const [pool, setPool] = useState("ETH-DAI");
  
  // Datos del pool seleccionado y ajustes de timeframe
  const [poolDetails, setPoolDetails] = useState<Record<string, any>>({});
  // Inicializar vacío y esperar los valores de la base de datos
  const [timeframeAdjustments, setTimeframeAdjustments] = useState<Record<number, number>>({});
  const [availablePools, setAvailablePools] = useState<any[]>([]);
  
  // Cargar pools disponibles y sus detalles
  useEffect(() => {
    const fetchPoolsDetails = async () => {
      try {
        // Usar el endpoint /api/pools/apr que devuelve APR real de Uniswap
        const response = await fetch('/api/pools/apr');
        if (!response.ok) {
          throw new Error(t('Error loading pools'));
        }

        const poolsData = await response.json();

        // Crear opciones de selección para el dropdown
        const poolOptions = poolsData.map((pool: any) => ({
          key: pool.name,
          value: pool.address,
          displayName: pool.name
        }));

        setAvailablePools(poolOptions);

        // Crear un objeto con los APRs de cada pool usando el nombre como clave
        const poolsMap: Record<string, any> = {};
        poolsData.forEach((poolItem: any) => {
          // El APR viene directamente de la API, ya es el valor real
          const aprValue = poolItem.apr || 10; // Fallback solo si no hay datos

          poolsMap[poolItem.name] = {
            apr: aprValue,
            feeTier: poolItem.feeTier,
            token0: poolItem.token0Symbol,
            token1: poolItem.token1Symbol
          };

          console.log(`[Landing Calculator] Pool ${poolItem.name}: APR real = ${aprValue}%`);
        });
        
        setPoolDetails(poolsMap);
        
        // Establecer el primer pool como seleccionado si no hay ninguno seleccionado
        if (poolsData.length > 0 && !pool) {
          setPool(poolsData[0].name);
        }
      } catch (error) {
        console.error(t('Error loading pool data:'), error);
      }
    };
    
    // Cargar ajustes de timeframe desde la API
    const fetchTimeframeAdjustments = async () => {
      try {
        console.log("[Calculator] Solicitando ajustes de timeframe desde API");
        const adjustmentsData = await apiRequest('GET', '/api/timeframe-adjustments');
        
        if (adjustmentsData && typeof adjustmentsData === 'object') {
          const adjustmentsMap: Record<number, number> = {};
          
          // El endpoint siempre devuelve un objeto como {30: -24.56, 90: -17.37, 365: -4.52}
          Object.keys(adjustmentsData).forEach(key => {
            adjustmentsMap[parseInt(key)] = parseFloat(adjustmentsData[key]);
          });
          
          // Actualizar el estado con los valores de la API
          setTimeframeAdjustments(adjustmentsMap);
          console.log("[Calculator] Timeframe adjustments actualizados desde API:", adjustmentsMap);
        }
      } catch (error) {
        console.error('[Calculator] Error al cargar ajustes de timeframe:', error);
      }
    };
    
    fetchPoolsDetails();
    fetchTimeframeAdjustments();
  }, []);
  
  // APR del pool seleccionado
  const selectedApr = pool && poolDetails[pool] ? poolDetails[pool].apr : 46.87; // Base APR
  
  // Esta función ya no es necesaria - usamos directamente calculateCompleteRewards
  
  // Calcular resultados utilizando la función unificada
  const results = calculateCompleteRewards(
    amount,
    selectedApr,
    rangeWidth,
    timeframe,
    timeframeAdjustments
  );
  
  // Imprimir logs detallados para depuración
  console.log("[Móvil] CALCULADORA CENTRALIZADA:", {
    pool,
    baseApr: selectedApr,
    input: {amount, selectedApr, rangeWidth, timeframe, timeframeAdjustments},
    results
  });
  
  // Extraer resultados
  const earnings = results.earnings;
  
  // Desglose de ganancias
  const feeIncome = earnings * 0.8;
  const priceImpact = earnings * 0.2;
  
  // Determinar el riesgo de pérdida impermanente basado en el ancho del rango
  const impermanentLossRisk = () => {
    if (rangeWidth <= 2) return "High";
    if (rangeWidth === 3) return "Medium";
    return "Low";
  };
  
  // Mapeo de rangos a porcentajes para mostrar
  const rangePercentMap = ["±10%", "±20%", "±30%", "±40%", "±50%"];
  
  return (
    <Card className="overflow-hidden max-w-5xl mx-auto border-blue-500/20 shadow-md">
      <CardHeader className="border-b border-slate-200 dark:border-slate-700 pb-5 bg-slate-50 dark:bg-slate-900/40">
        <CardTitle>{t('Estimate Your Potential Earnings')}</CardTitle>
        <CardDescription>
          {t('Adjust parameters to simulate your potential returns with liquidity provision')}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-6 pt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">{t('Liquidity Pool')}</label>
              <Select 
                value={pool}
                onValueChange={(value) => setPool(value)}
              >
                <SelectTrigger className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg">
                  <SelectValue placeholder={t('Select a pool')} />
                </SelectTrigger>
                <SelectContent>
                  {availablePools.map((poolOption) => (
                    <SelectItem key={poolOption.key} value={poolOption.key}>
                      {poolOption.displayName}
                    </SelectItem>
                  ))}
                  {availablePools.length === 0 && (
                    <SelectItem value="loading" disabled>{t('Loading pools...')}</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">{t('Investment Amount (USDC)')}</label>
              <div className="relative">
                <Input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  min={100}
                  step={100}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg pr-16"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <span className="text-muted-foreground">USDC</span>
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">{t('Price Range Width')}</label>
              <div className="mb-2 flex justify-between text-xs text-muted-foreground">
                <span>{t('Narrow (Higher APR, requires frequent readjustments)')}</span>
                <span>{t('Wide (Lower APR, fewer readjustments)')}</span>
              </div>
              <Slider
                value={[rangeWidth]}
                min={1}
                max={5}
                step={1}
                onValueChange={(values) => setRangeWidth(values[0])}
                className="mb-2"
              />
              <div className="flex justify-between">
                {rangePercentMap.map((range, i) => (
                  <div
                    key={i}
                    className={`text-xs ${rangeWidth === i + 1 ? "text-primary font-bold" : "text-muted-foreground"}`}
                  >
                    {range}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">{t('Time Period')}</label>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant={timeframe === 30 ? "default" : "outline"}
                  onClick={() => setTimeframe(30)}
                  className="w-full"
                >
                  {t('1 Month')}
                </Button>
                <Button
                  variant={timeframe === 90 ? "default" : "outline"}
                  onClick={() => setTimeframe(90)}
                  className="w-full"
                >
                  {t('3 Months')}
                </Button>
                <Button
                  variant={timeframe === 365 ? "default" : "outline"}
                  onClick={() => setTimeframe(365)}
                  className="w-full"
                >
                  {t('1 Year')}
                </Button>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-lg border border-slate-200 dark:border-slate-700">
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-2">{t('Estimated Returns')}</h3>
              
              {poolDetails[pool] && (
                <div className="inline-flex items-center gap-2 mb-3 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-full text-sm">
                  <span className="font-medium">
                    {poolDetails[pool].token0}/{poolDetails[pool].token1}
                  </span>
                </div>
              )}
              
              <div className="flex items-baseline mb-1">
                <div className="text-3xl font-bold text-primary">
                  {(selectedApr * (1 + (5 - rangeWidth) * 0.1) * (1 + (timeframeAdjustments[timeframe] || 0) / 100)).toFixed(2)}%
                </div>
                <div className="ml-2 text-sm text-muted-foreground">
                  {t('estimated APR')}
                </div>
              </div>
              
              <div className="text-sm text-muted-foreground mb-6 flex items-center">
                {t('With adjustment of')} {timeframeAdjustments[timeframe] ? `${timeframeAdjustments[timeframe].toFixed(2)}%` : '0%'} {t('for')} {timeframe} {t('days')}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="ml-1 cursor-help">
                        <HelpCircle className="h-3.5 w-3.5 text-slate-400" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs text-xs p-3">
                      {aprAdjustmentTranslations[language]?.tooltip || aprAdjustmentTranslations.en.tooltip}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              
              <div className="flex items-baseline justify-between mb-2">
                <div className="text-lg font-medium">{t('Estimated earnings')} ({timeframe} {t('days')})</div>
                <div className="text-2xl font-bold">${formatNumber(earnings, 2)}</div>
              </div>
              
              <div className="space-y-3 mt-6">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{t('Fee income')}</span>
                  <span className="font-medium">${formatNumber(feeIncome, 2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{t('Price impact')}</span>
                  <span className="font-medium">${formatNumber(priceImpact, 2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{t('Impermanent loss risk')}</span>
                  <Badge 
                    className={impermanentLossRisk() === "Low" ? "bg-green-500 hover:bg-green-600" : ""}
                    variant={
                      impermanentLossRisk() === "High" ? "destructive" : 
                      impermanentLossRisk() === "Medium" ? "default" : "outline"
                    }
                  >
                    {t(impermanentLossRisk())}
                  </Badge>
                </div>
              </div>
            </div>
            
            <Button 
              className="w-full" 
              size="lg"
              asChild
            >
              <a href="/add-liquidity">
                {t('Start investing')}
              </a>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LandingRewardsSimulator;