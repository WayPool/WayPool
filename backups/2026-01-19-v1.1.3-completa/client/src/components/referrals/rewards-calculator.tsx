import React, { useState, useEffect } from "react";
import { useTranslation } from "@/hooks/use-translation";
import { useReferralsTranslations } from "@/hooks/use-referrals-translations";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { formatExactCurrency } from "@/lib/utils";
import { useAverageAPR } from "@/hooks/use-average-apr";
import { useAverageInvestment } from "@/hooks/use-average-investment";
import { getRankInfo, referralRankLevels } from "./referral-rank";
import { 
  Calculator, 
  DollarSign, 
  Users, 
  LineChart,
  TrendingUp,
  Clock,
  Sparkles,
  Info,
  RefreshCw
} from "lucide-react";

/**
 * Componente de calculadora de recompensas para el programa de referidos
 * Muestra proyecciones de ganancias basadas en diferentes escenarios
 */
const RewardsCalculator: React.FC = () => {
  const { t } = useTranslation();
  const rt = useReferralsTranslations();
  
  // Estados para los sliders
  const [numReferrals, setNumReferrals] = useState<number>(100);
  // Valor inicial que se actualizará dinámicamente con el valor real de la API
  const [avgInvestment, setAvgInvestment] = useState<number>(0);
  const [baseApr, setBaseApr] = useState<number>(61.64); // Valor por defecto más preciso
  const [timeHorizon, setTimeHorizon] = useState<number>(5); // años
  
  // Obtener el APR promedio y la inversión promedio desde la API
  const { averageAPR, isLoading: isLoadingAPR, refetch: refetchAPR } = useAverageAPR();
  const { averageInvestment, positionCount, totalPositions, isLoading: isLoadingInv, refetch: refetchInv } = useAverageInvestment();
  
  // Actualizar el APR base cuando se carga el APR promedio
  useEffect(() => {
    if (!isLoadingAPR && averageAPR) {
      // Usar el valor exacto sin redondear
      setBaseApr(averageAPR);
      console.log("Actualizando APR base a:", averageAPR);
    }
  }, [averageAPR, isLoadingAPR]);
  
  // Actualizar la inversión promedio cuando se carga
  useEffect(() => {
    if (!isLoadingInv && averageInvestment) {
      // Usar el valor exacto sin redondear
      setAvgInvestment(averageInvestment);
      console.log("Actualizando inversión promedio a:", averageInvestment);
    }
  }, [averageInvestment, isLoadingInv]);
  
  // Obtener el porcentaje de comisión según el número de referidos
  const getCommissionRate = (referrals: number) => {
    // Porcentaje base es 1%
    let rate = 0.01;
    
    // Por cada nivel completado, aumentamos un 0.5% adicional
    const currentRank = getRankInfo(referrals);
    const rankIndex = referralRankLevels.findIndex(rank => rank.name === currentRank.name);
    
    // Agregamos 0.5% por cada nivel alcanzado después del primero
    if (rankIndex > 0) {
      rate += (rankIndex * 0.005);
    }
    
    return rate;
  };
  
  // Calcular recompensas
  const calculateRewards = () => {
    // Obtenemos la tasa de comisión actual basada en el nivel de referidos
    const commissionRate = getCommissionRate(numReferrals);
    
    // Ganancia por referido = inversión promedio * APR base * tasa de comisión (que aumenta con los niveles)
    const perReferralAnnual = avgInvestment * (baseApr / 100) * commissionRate;
    
    // Total anual
    const annualRewards = perReferralAnnual * numReferrals;
    
    // Total acumulado según el horizonte temporal (sin compounding para simplicidad)
    const totalRewards = annualRewards * timeHorizon;
    
    // Retornar datos calculados
    return {
      perReferral: perReferralAnnual,
      annual: annualRewards,
      total: totalRewards,
      monthly: annualRewards / 12,
      commissionRate: commissionRate * 100 // Convertido a porcentaje para mostrar
    };
  };
  
  const rewards = calculateRewards();
  
  // Estado para controlar la actualización de datos
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  
  // Función para refrescar los datos de APR e inversión
  const refreshData = async () => {
    setIsRefreshing(true);
    
    try {
      // Primero actualizar APR
      if (refetchAPR) {
        await refetchAPR();
      }
      
      // Luego actualizar inversión promedio
      if (refetchInv) {
        await refetchInv();
      }
    } catch (error) {
      console.error("Error al refrescar datos:", error);
    } finally {
      setIsRefreshing(false);
    }
  };
  
  // Calcular las barras de comparación
  const getScenarioPercentage = (referrals: number) => {
    const maxReferrals = 1000; // Consideramos 1000 como máximo para dimensionar las barras
    return Math.min((referrals / maxReferrals) * 100, 100);
  };

  return (
    <Card className="shadow-lg border-primary/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5 text-primary" />
          {rt.rewardsCalculator}
        </CardTitle>
        <CardDescription>
          {rt.calculateEarnings}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <Tabs defaultValue="calculator" className="w-full">
          <TabsList className="grid grid-cols-2 mb-6">
            <TabsTrigger value="calculator" className="data-[state=active]:bg-primary/10">
              {rt.calculator}
            </TabsTrigger>
            <TabsTrigger value="scenarios" className="data-[state=active]:bg-primary/10">
              {rt.earningScenarios}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="calculator" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Columna de controles */}
              <div className="space-y-6">
                {/* Slider: Número de referidos */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="font-medium text-sm flex items-center gap-2">
                      <Users className="h-4 w-4 text-primary" />
                      {rt.numberOfReferrals}
                    </label>
                    <span className="bg-primary/10 px-2 py-1 rounded text-sm font-medium">
                      {numReferrals}
                    </span>
                  </div>
                  <Slider
                    value={[numReferrals]}
                    min={1}
                    max={1000}
                    step={10}
                    onValueChange={(value) => setNumReferrals(value[0])}
                    className="py-2"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>1</span>
                    <span>500</span>
                    <span>1000</span>
                  </div>
                </div>
                
                {/* Slider: Inversión promedio */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="font-medium text-sm flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-primary" />
                      {rt.averageInvestment}
                    </label>
                    <span className="bg-primary/10 px-2 py-1 rounded text-sm font-medium">
                      ${avgInvestment.toLocaleString()}
                    </span>
                  </div>
                  <Slider
                    value={[avgInvestment]}
                    min={100}
                    max={100000}
                    step={500}
                    onValueChange={(value) => setAvgInvestment(value[0])}
                    className="py-2"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>$100</span>
                    <span>$50,000</span>
                    <span>$100,000</span>
                  </div>
                  
                  {!isLoadingInv && averageInvestment && (
                    <div className="text-xs text-muted-foreground italic">
                      {rt.basedOnPlatformAverage} {formatExactCurrency(averageInvestment, "USD")}
                      {positionCount > 0 && (
                        <> {rt.calculatedFrom} {positionCount} {rt.activePositionsWithLiquidity}
                          {totalPositions > positionCount && (
                            <> {rt.outOf} {totalPositions} {rt.totalActivePositions}</>
                          )}
                        </>
                      )}
                    </div>
                  )}
                </div>
                
                {/* Slider: APR Base */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="font-medium text-sm flex items-center gap-2">
                      <LineChart className="h-4 w-4 text-primary" />
                      {rt.baseAPR}
                      {isLoadingAPR && (
                        <span className="text-xs text-muted-foreground ml-1 animate-pulse">
                          {"loading..."}
                        </span>
                      )}
                    </label>
                    <span className="bg-primary/10 px-2 py-1 rounded text-sm font-medium">
                      {baseApr.toFixed(2)}%
                    </span>
                  </div>
                  <Slider
                    value={[baseApr]}
                    min={1}
                    max={100}
                    step={1}
                    onValueChange={(value) => setBaseApr(value[0])}
                    className="py-2"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>1%</span>
                    <span>50%</span>
                    <span>100%</span>
                  </div>
                  
                  {!isLoadingAPR && averageAPR && (
                    <div className="text-xs text-muted-foreground italic">
                      {rt.calculatorUsesRealAPR} ({averageAPR.toFixed(2)}%) {rt.fromAllActivePositions}
                    </div>
                  )}
                </div>
                
                {/* Slider: Horizonte Temporal */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="font-medium text-sm flex items-center gap-2">
                      <Clock className="h-4 w-4 text-primary" />
                      {rt.timeHorizon}
                    </label>
                    <span className="bg-primary/10 px-2 py-1 rounded text-sm font-medium">
                      {timeHorizon} {timeHorizon === 1 ? rt.year : rt.years}
                    </span>
                  </div>
                  <Slider
                    value={[timeHorizon]}
                    min={1}
                    max={10}
                    step={1}
                    onValueChange={(value) => setTimeHorizon(value[0])}
                    className="py-2"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>1 {rt.year}</span>
                    <span>5 {rt.years}</span>
                    <span>10 {rt.years}</span>
                  </div>
                </div>
              </div>
              
              {/* Columna de resultados */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-lg flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    {rt.potentialEarnings}
                  </h3>
                  
                  <button 
                    onClick={refreshData}
                    disabled={isRefreshing || isLoadingAPR || isLoadingInv}
                    className="text-xs flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors px-2 py-1 rounded hover:bg-primary/5 disabled:opacity-50 disabled:pointer-events-none"
                  >
                    <RefreshCw className={`h-3 w-3 ${isRefreshing ? 'animate-spin' : ''}`} />
                    {isRefreshing ? rt.updating : rt.refetchData}
                  </button>
                </div>
                
                <div className="grid grid-cols-1 gap-4">
                  <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
                    <CardContent className="pt-6">
                      <div className="text-muted-foreground text-sm">{rt.totalOver} {timeHorizon} {timeHorizon === 1 ? rt.year : rt.years}</div>
                      <div className="text-3xl font-bold mt-1">
                        {formatExactCurrency(rewards.total, "USD")}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {rt.with} {numReferrals} {rt.referralsInvesting} {formatExactCurrency(avgInvestment, "USD")} {rt.each}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <Card className="border-primary/10">
                      <CardContent className="pt-6">
                        <div className="text-muted-foreground text-sm">{rt.annualEarnings}</div>
                        <div className="text-2xl font-bold mt-1">
                          {formatExactCurrency(rewards.annual, "USD")}
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="border-primary/10">
                      <CardContent className="pt-6">
                        <div className="text-muted-foreground text-sm">{rt.monthlyEarnings}</div>
                        <div className="text-2xl font-bold mt-1">
                          {formatExactCurrency(rewards.monthly, "USD")}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <Card className="border-primary/10">
                    <CardContent className="pt-6">
                      <div className="text-muted-foreground text-sm">{rt.perReferralAnnual}</div>
                      <div className="text-2xl font-bold mt-1">
                        {formatExactCurrency(rewards.perReferral, "USD")}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {rt.basedOn} {formatExactCurrency(avgInvestment, "USD")} {rt.at} {baseApr.toFixed(2)}% APR
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Alert className="bg-primary/5 border-primary/20">
                    <Sparkles className="h-4 w-4 text-primary" />
                    <AlertDescription className="flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{rt.yourCommissionRate}</h4>
                        <Badge variant="outline" className="bg-primary/10 hover:bg-primary/15">
                          {rewards.commissionRate.toFixed(1)}%
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {rt.rankGivesYou} {rewards.commissionRate.toFixed(1)}% {rt.commissionOnEarnings}
                      </p>
                    </AlertDescription>
                  </Alert>
                  
                  <div className="bg-primary/5 border border-primary/10 rounded-lg p-4 mt-2">
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <Info className="h-4 w-4 text-primary" />
                      {rt.calculator}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {rt.earningScenarios}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="scenarios" className="space-y-6">
            <h3 className="font-medium">{rt.potentialEarnings}</h3>
            <div className="space-y-4">
              {/* Escenario: 10 referidos */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary" />
                    <span>10 {rt.referrals}</span>
                  </span>
                  <span className="font-medium flex items-center gap-2">
                    {formatExactCurrency(10 * avgInvestment * (baseApr / 100) * getCommissionRate(10), "USD")}
                    <Badge variant="outline" className="text-xs bg-primary/5">
                      {(getCommissionRate(10) * 100).toFixed(1)}%
                    </Badge>
                  </span>
                </div>
                <div className="h-2 bg-primary/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary"
                    style={{ width: `${getScenarioPercentage(10)}%` }}
                  ></div>
                </div>
              </div>
              
              {/* Escenario: 50 referidos */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary" />
                    <span>50 {rt.referrals}</span>
                  </span>
                  <span className="font-medium flex items-center gap-2">
                    {formatExactCurrency(50 * avgInvestment * (baseApr / 100) * getCommissionRate(50), "USD")}
                    <Badge variant="outline" className="text-xs bg-primary/5">
                      {(getCommissionRate(50) * 100).toFixed(1)}%
                    </Badge>
                  </span>
                </div>
                <div className="h-2 bg-primary/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary"
                    style={{ width: `${getScenarioPercentage(50)}%` }}
                  ></div>
                </div>
              </div>
              
              {/* Escenario: 100 referidos */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary" />
                    <span>100 {rt.referrals}</span>
                  </span>
                  <span className="font-medium flex items-center gap-2">
                    {formatExactCurrency(100 * avgInvestment * (baseApr / 100) * getCommissionRate(100), "USD")}
                    <Badge variant="outline" className="text-xs bg-primary/5">
                      {(getCommissionRate(100) * 100).toFixed(1)}%
                    </Badge>
                  </span>
                </div>
                <div className="h-2 bg-primary/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary"
                    style={{ width: `${getScenarioPercentage(100)}%` }}
                  ></div>
                </div>
              </div>
              
              {/* Escenario: 500 referidos */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary" />
                    <span>500 {rt.referrals || "Referrals"}</span>
                  </span>
                  <span className="font-medium flex items-center gap-2">
                    {formatExactCurrency(500 * avgInvestment * (baseApr / 100) * getCommissionRate(500), "USD")}
                    <Badge variant="outline" className="text-xs bg-primary/5">
                      {(getCommissionRate(500) * 100).toFixed(1)}%
                    </Badge>
                  </span>
                </div>
                <div className="h-2 bg-primary/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary"
                    style={{ width: `${getScenarioPercentage(500)}%` }}
                  ></div>
                </div>
              </div>
              
              {/* Escenario: 1000 referidos */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary" />
                    <span>1000 {rt.referrals || "Referrals"}</span>
                  </span>
                  <span className="font-medium flex items-center gap-2">
                    {formatExactCurrency(1000 * avgInvestment * (baseApr / 100) * getCommissionRate(1000), "USD")}
                    <Badge variant="outline" className="text-xs bg-primary/5">
                      {(getCommissionRate(1000) * 100).toFixed(1)}%
                    </Badge>
                  </span>
                </div>
                <div className="h-2 bg-primary/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary"
                    style={{ width: `${getScenarioPercentage(1000)}%` }}
                  ></div>
                </div>
              </div>
            </div>
            
            <h3 className="font-medium mt-6">{rt.calculatorUsesRealAPR}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card className="border-primary/10">
                <CardContent className="pt-6">
                  <div className="text-muted-foreground text-sm">{rt.fiveReferrals}</div>
                  <div className="text-2xl font-bold mt-1">
                    {formatExactCurrency(numReferrals * 1000 * (baseApr / 100) * getCommissionRate(numReferrals), "USD")}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {numReferrals} {rt.referrals} - $1,000 {rt.each}
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-primary/10">
                <CardContent className="pt-6">
                  <div className="text-muted-foreground text-sm">{rt.twentyReferrals}</div>
                  <div className="text-2xl font-bold mt-1">
                    {formatExactCurrency(numReferrals * 5000 * (baseApr / 100) * getCommissionRate(numReferrals), "USD")}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {numReferrals} {rt.referrals} - $5,000 {rt.each}
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-primary/10">
                <CardContent className="pt-6">
                  <div className="text-muted-foreground text-sm">{rt.fiftyReferrals}</div>
                  <div className="text-2xl font-bold mt-1">
                    {formatExactCurrency(numReferrals * 20000 * (baseApr / 100) * getCommissionRate(numReferrals), "USD")}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {numReferrals} {rt.referrals} - $20,000 {rt.each}
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-primary/10">
                <CardContent className="pt-6">
                  <div className="text-muted-foreground text-sm">{rt.referralsAvgInvestment}</div>
                  <div className="text-2xl font-bold mt-1">
                    {formatExactCurrency(numReferrals * 50000 * (baseApr / 100) * getCommissionRate(numReferrals), "USD")}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {numReferrals} {rt.referrals} - $50,000 {rt.each}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="bg-primary/5 border border-primary/10 rounded-lg p-4 mt-2">
              <h4 className="font-medium mb-2">{rt.networkEffect}</h4>
              <p className="text-sm text-muted-foreground">
                {rt.earningsGrow}
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default RewardsCalculator;