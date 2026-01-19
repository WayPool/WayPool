import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createSafeTranslationObject, defaultEnglishTranslations } from "@/utils/translation-safety";
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
import { HelpCircle } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { dashboardTranslations } from "@/translations/dashboard";
import { aprAdjustmentTranslations } from "@/translations/apr-adjustment-translations";
import { calculateCompleteRewards } from "@/lib/uniswap";
import { 
  formatCurrency, 
  formatAddress,
  DEPOSIT_WALLET_ADDRESS
} from "@/lib/ethereum";
import { APP_NAME } from "@/utils/app-config";
import { apiRequest } from "@/lib/queryClient";
import { useWallet } from "@/hooks/use-wallet";
import { TOKENS } from "@/lib/constants";
import { useToast } from "@/hooks/use-toast";
import { usePoolData } from "@/hooks/use-pool-data";
import { InsufficientBalanceDialog } from "@/components/wallet/insufficient-balance-dialog";
import { InsufficientBalanceAlert } from "@/components/dashboard/insufficient-balance-alert";
import { useTranslation } from "@/hooks/use-translation";
import { useLocation } from "wouter";

const RewardsSimulator: React.FC = () => {
  // USDT-ETH es el pool recomendado (primero en la lista de /api/pools/apr)
  const [pool, setPool] = useState<string>("USDT-ETH");
  const [amount, setAmount] = useState(25000);
  const [rangeWidth, setRangeWidth] = useState(3);
  const [timeframe, setTimeframe] = useState(90);
  const [isTransferring, setIsTransferring] = useState(false);
  const { address, signer, setIsModalOpen } = useWallet();
  const { toast } = useToast();
  const { poolSelectionOptions, availablePools } = usePoolData();
  const { t, language } = useTranslation();
  const [, setLocation] = useLocation();
  // Ya no necesitamos el sistema antiguo de traducciones con dashboardT
  // Estamos migrando hacia el enfoque de renderizado condicional basado en 'language'
  
  const [showInsufficientBalanceDialog, setShowInsufficientBalanceDialog] = useState(false);
  const [showInsufficientBalanceAlert, setShowInsufficientBalanceAlert] = useState(false);
  const [userBalance, setUserBalance] = useState("0");
  
  const [poolDetails, setPoolDetails] = useState<Record<string, any>>({});
  // Inicializar con valores predeterminados actualizados según el panel de admin (14/05/2025)
  // Estos valores solo se usan si la API falla, si la API responde se usarán los valores de la API
  const [timeframeAdjustments, setTimeframeAdjustments] = useState<Record<number, number>>({
    30: -64.56,   // Ajuste para 1 mes
    90: -57.37,   // Ajuste para 3 meses
    365: -34.52   // Ajuste para 1 año
  });
  

  useEffect(() => {
    const fetchPoolsDetails = async () => {
      try {
        // Usar el endpoint /api/pools/apr que devuelve APR real de Uniswap
        const response = await fetch('/api/pools/apr');
        if (!response.ok) {
          throw new Error('Error loading pools APR');
        }

        const poolsData = await response.json();

        const poolsMap: Record<string, any> = {};

        // El endpoint /api/pools/apr ya devuelve los APRs reales de DexScreener/GeckoTerminal
        // El backend ordena los pools con USDT-ETH primero (recomendado)

        // Procesamos todos los pools con sus APRs reales
        poolsData.forEach((poolItem: any) => {
          // El APR viene directamente de la API, ya es el valor real
          const aprValue = poolItem.apr || 10; // Fallback solo si no hay datos

          poolsMap[poolItem.name] = {
            apr: aprValue,
            feeTier: poolItem.feeTier,
            token0: poolItem.token0Symbol,
            token1: poolItem.token1Symbol,
            tvl: poolItem.tvl,
            volume24h: poolItem.volume24h,
            real: poolItem.real
          };

          console.log(`[Calculator] Pool ${poolItem.name}: APR real = ${aprValue}%`);
        });

        // Log para depuración
        console.log("Pools disponibles con APR real:", poolsData.map((p: any) => `${p.name}: ${p.apr}%`));

        setPoolDetails(poolsMap);
        
        // Tomar el primer pool como valor por defecto
        if (poolsData.length > 0 && !pool) {
          const firstPoolName = poolsData[0].name;
          console.log("⚠️ Seleccionando el primer pool por defecto:", firstPoolName);
          setPool(firstPoolName);
        }
        

        // El pool USDC / ETH ya está establecido por defecto en el state
        // No necesitamos hacer nada aquí, ya que el valor inicial es "USDC / ETH"
        // Solo registramos que opciones tenemos disponibles
        if (poolsData.length > 0) {
          console.log("Opciones de pool disponibles:", poolsData.map((p: {name: string, address: string}) => ({
            key: p.name,
            value: p.address,
            displayName: p.name
          })));
          
          // Logueamos el pool seleccionado para verificar
          console.log("Pool seleccionado actual:", pool || "USDC / ETH");
        }
      } catch (error) {
        console.error('Error loading pool data:', error);
      }
    };


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
        console.log('[Calculator] Usando valores predeterminados de timeframe:', timeframeAdjustments);
        // No actualizamos el estado, se usarán los valores predeterminados ya establecidos
      }
    };
    
    fetchPoolsDetails();
    fetchTimeframeAdjustments();
  }, []);
  
  // APR base obtenido del pool seleccionado (datos reales de Uniswap)
  const baseApr = poolDetails[pool]?.apr || 10; // Usar APR real del pool seleccionado
  
  // Usar la función centralizada de cálculo con los mismos parámetros que se usarán en móvil
  const results = calculateCompleteRewards(
    amount,          // Monto de inversión
    baseApr,         // APR base unificado (el mismo que en móvil)
    rangeWidth,      // Ancho de rango (1-5, equivalente con móvil)
    timeframe,       // Timeframe dinámico según selección del usuario
    timeframeAdjustments // Ajustes por timeframe, iguales a los usados en móvil
  );
  
  // Log detallado para depuración y transparencia
  console.log("[Escritorio] CALCULADORA CENTRALIZADA:", {
    pool,
    baseApr,
    input: {
      amount, 
      baseApr, 
      rangeWidth, 
      timeframe, 
      timeframeAdjustments
    },
    results
  });
  
  // Extraer resultados calculados dinámicamente
  const earnings = results.earnings;
  const feeIncome = earnings * 0.8;
  const priceImpact = earnings * 0.2;
  
  const impermanentLossRisk = () => {
    if (rangeWidth <= 2) {
      if (language === 'en') return 'High';
      if (language === 'es') return 'Alto';
      if (language === 'fr') return 'Élevé';
      if (language === 'de') return 'Hoch';
      if (language === 'pt') return 'Alto';
      if (language === 'it') return 'Alto';
      if (language === 'zh') return '高';
      if (language === 'hi') return 'उच्च';
      if (language === 'ar') return 'عالي';
      return 'High';
    }
    if (rangeWidth === 3) {
      if (language === 'en') return 'Medium';
      if (language === 'es') return 'Medio';
      if (language === 'fr') return 'Moyen';
      if (language === 'de') return 'Mittel';
      if (language === 'pt') return 'Médio';
      if (language === 'it') return 'Medio';
      if (language === 'zh') return '中等';
      if (language === 'hi') return 'मध्यम';
      if (language === 'ar') return 'متوسط';
      return 'Medium';
    }
    if (language === 'en') return 'Low';
    if (language === 'es') return 'Bajo';
    if (language === 'fr') return 'Faible';
    if (language === 'de') return 'Niedrig';
    if (language === 'pt') return 'Baixo';
    if (language === 'it') return 'Basso';
    if (language === 'zh') return '低';
    if (language === 'hi') return 'कम';
    if (language === 'ar') return 'منخفض';
    return 'Low';
  };
  
  const rangePercentMap = ["±10%", "±20%", "±30%", "±40%", "±50%"];
  

  const checkWalletConnection = () => {
    if (!address) {
      toast({
        title: "Error de conexión",
        description: "Conecta tu wallet primero para realizar esta operación",
        variant: "destructive",
      });
      return false;
    }
    
    return true;
  };


  const savePosition = async (txHash: string, status = "Active") => {
    if (!address || !pool || !poolDetails[pool]) return;
    
    try {

      const poolInfo = poolDetails[pool];
      

      // Buscar el pool seleccionado asegurando que tiene las propiedades necesarias
      const selectedPool = availablePools.find(p => {
        if (typeof p === 'object' && p !== null && 'key' in p) {
          return (p as any).key === pool;
        }
        return false;
      });
      
      // Extraer la dirección del pool con seguridad de tipos
      const selectedPoolAddress = selectedPool && typeof selectedPool === 'object' && 'value' in selectedPool ? (selectedPool as any).value : '';
      
      if (!selectedPoolAddress) {
        console.error("No se pudo encontrar la dirección del pool seleccionado");
        return;
      }
      

      const token0Decimals = poolInfo.token0Decimals || 18;
      const token1Decimals = poolInfo.token1Decimals || 18;
      
      // Datos del cálculo de precio actual y rango
      const priceImpact = 0.2;
      const currentPrice = 0.5;
      const lowerPrice = currentPrice * (1 - priceImpact * rangeWidth / 5);
      const upperPrice = currentPrice * (1 + priceImpact * rangeWidth / 5);
      
      // Obtener el APR usando la misma función central que se usa en toda la aplicación
      // Esto garantiza resultados idénticos en la calculadora de escritorio y la calculadora móvil
      const adjustedApr = results.timeframeAdjustedApr;
      
      // Dividir el monto depositado entre los dos tokens (50/50 como simplificación)
      // En la implementación real, esto dependería del precio actual y la estrategia de liquidez
      const token0Amount = (amount * 0.5).toString();
      const token1Amount = (amount * 0.5 / currentPrice).toString();
      
      // Crear el objeto para guardar en la base de datos
      const positionData = {
        walletAddress: address,
        poolAddress: selectedPoolAddress,
        poolName: pool,
        token0: poolInfo.token0Symbol,
        token1: poolInfo.token1Symbol,
        token0Decimals: token0Decimals,
        token1Decimals: token1Decimals,
        token0Amount: token0Amount,
        token1Amount: token1Amount,
        depositedUSDC: amount,
        timeframe: timeframe,
        apr: adjustedApr,
        status: status,
        lowerPrice: lowerPrice,
        upperPrice: upperPrice,
        inRange: true,
        action: "create",
        txHash: txHash
      };
      
      // Enviar a la API
      const response = await fetch('/api/position-history', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(positionData),
      });
      
      if (!response.ok) {
        throw new Error('Error al guardar la posición');
      }
      
      // Posición guardada correctamente en la base de datos
      
    } catch (error) {
      console.error("Error al guardar la posición:", error);
      toast({
        title: "Error",
        description: "No se pudo guardar la información de la posición",
        variant: "destructive",
      });
    }
  };

  const handleTransferUSDC = async () => {
    // Verificar el estado de la conexión
    if (!checkWalletConnection()) return;
    
    try {
      setIsTransferring(true);
      
      // Obtener la dirección del pool seleccionado
      const selectedPool = availablePools.find(p => {
        if (typeof p === 'object' && p !== null && 'key' in p) {
          return (p as any).key === pool;
        }
        return false;
      });
      
      const poolAddress = selectedPool && typeof selectedPool === 'object' && 'value' in selectedPool ? (selectedPool as any).value : '';
      
      // Crear la URL con todos los parámetros de la calculadora
      const params = new URLSearchParams({
        amount: amount.toString(),
        pool: pool,
        poolAddress: poolAddress,
        rangeWidth: rangeWidth.toString(),
        timeframe: timeframe.toString(),
        apr: results.timeframeAdjustedApr.toString(),
        baseApr: results.rangeAdjustedApr.toString(),
        fromCalculator: 'true'
      });
      
      // Redirigir a add-liquidity con todos los parámetros
      setLocation(`/add-liquidity?${params.toString()}`);
      
      toast({
        title: "Redirigiendo...",
        description: "Te llevamos a la página de añadir liquidez con tu configuración",
        variant: "default",
      });
      
    } catch (error: any) {
      console.error("Error al redirigir:", error);
      
      toast({
        title: "Error",
        description: "Error al procesar la redirección",
        variant: "destructive",
      });
    } finally {
      setIsTransferring(false);
    }
  };

  return (
    <>
      <h2 className="text-xl font-bold mt-8 mb-4">
        {language === 'en' && 'Rewards Simulator'}
        {language === 'es' && 'Simulador de Recompensas'}
        {language === 'fr' && 'Simulateur de Récompenses'}
        {language === 'de' && 'Belohnungssimulator'}
        {language === 'pt' && 'Simulador de Recompensas'}
        {language === 'it' && 'Simulatore di Ricompense'}
        {language === 'zh' && '奖励模拟器'}
        {language === 'hi' && 'पुरस्कार सिमुलेटर'}
        {language === 'ar' && 'محاكي المكافآت'}
      </h2>
      
      {/* Alerta de balance insuficiente (nuevo método) */}
      {showInsufficientBalanceAlert && (
        <InsufficientBalanceAlert
          amount={amount.toString()}
          tokenSymbol="USDC"
          onDismiss={() => setShowInsufficientBalanceAlert(false)}
        />
      )}
      
      {/* Diálogo de balance insuficiente (antiguo método, ahora respaldo) */}
      <InsufficientBalanceDialog
        open={showInsufficientBalanceDialog}
        onOpenChange={setShowInsufficientBalanceDialog}
        tokenSymbol="USDC"
        amount={amount.toString()}
        balance={userBalance}
      />
      
      <Card className="overflow-hidden mb-6">
        <CardHeader className="border-b border-slate-200 dark:border-slate-700 pb-5">
          <CardTitle>
            {language === 'en' && 'Rewards Simulator'}
            {language === 'es' && 'Simulador de Recompensas'}
            {language === 'fr' && 'Simulateur de Récompenses'}
            {language === 'de' && 'Belohnungssimulator'}
            {language === 'pt' && 'Simulador de Recompensas'}
            {language === 'it' && 'Simulatore di Ricompense'}
            {language === 'zh' && '奖励模拟器'}
            {language === 'hi' && 'पुरस्कार सिमुलेटर'}
            {language === 'ar' && 'محاكي المكافآت'}
          </CardTitle>
          <CardDescription>
            {language === 'en' && 'Calculate potential returns based on your investment parameters'}
            {language === 'es' && 'Calcule rendimientos potenciales según sus parámetros de inversión'}
            {language === 'fr' && 'Calculez les rendements potentiels selon vos paramètres d\'investissement'}
            {language === 'de' && 'Berechnen Sie potenzielle Renditen basierend auf Ihren Anlagekriterien'}
            {language === 'pt' && 'Calcule retornos potenciais com base nos seus parâmetros de investimento'}
            {language === 'it' && 'Calcola i potenziali rendimenti in base ai tuoi parametri di investimento'}
            {language === 'zh' && '根据您的投资参数计算潜在收益'}
            {language === 'hi' && 'अपने निवेश मापदंडों के आधार पर संभावित रिटर्न की गणना करें'}
            {language === 'ar' && 'احسب العوائد المحتملة بناءً على معايير استثمارك'}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="p-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  {language === 'en' && 'Select Pool'}
                  {language === 'es' && 'Seleccionar Pool'}
                  {language === 'fr' && 'Sélectionner Pool'}
                  {language === 'de' && 'Pool Auswählen'}
                  {language === 'pt' && 'Selecionar Pool'}
                  {language === 'it' && 'Seleziona Pool'}
                  {language === 'zh' && '选择池'}
                  {language === 'hi' && 'पूल चुनें'}
                  {language === 'ar' && 'اختر المجموعة'}
                </label>
                <Select 
                  value={pool}
                  onValueChange={(value) => setPool(value)}
                >
                  <SelectTrigger className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg">
                    <SelectValue 
                      placeholder={
                        language === 'en' ? 'Select Pool' : 
                        language === 'es' ? 'Seleccionar Pool' :
                        language === 'fr' ? 'Sélectionner Pool' :
                        language === 'de' ? 'Pool Auswählen' : 
                        language === 'pt' ? 'Selecionar Pool' :
                        language === 'it' ? 'Seleziona Pool' :
                        language === 'zh' ? '选择池' :
                        language === 'hi' ? 'पूल चुनें' :
                        language === 'ar' ? 'اختر المجموعة' :
                        'Select Pool'
                      } 
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {/* Sección 1: USDC/ETH siempre primero (pool ID 27) */}
                    {poolDetails["USDC / ETH"] && (
                      <SelectItem key="USDC / ETH" value="USDC / ETH" className="font-semibold">
                        USDC/ETH ({poolDetails["USDC / ETH"].feeTier/10000}% Fee) - {dashboardTranslations[language as keyof typeof dashboardTranslations]?.recommended || "Recommended"}
                      </SelectItem>
                    )}
                    
                    {/* Sección 2: Todos los demás pools */}
                    {Object.keys(poolDetails)
                      .filter(poolName => poolName !== "USDC / ETH") // Excluimos el que ya agregamos
                      .map((poolName) => (
                        <SelectItem key={poolName} value={poolName}>
                          {poolDetails[poolName].token0}/{poolDetails[poolName].token1} ({poolDetails[poolName].feeTier/10000}% Fee)
                        </SelectItem>
                      ))
                    }
                    
                    {/* Si no hay pools disponibles */}
                    {Object.keys(poolDetails).length === 0 && (
                      <SelectItem value="loading" disabled>Cargando pools...</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  {language === 'en' && 'Investment Amount (USDC)'}
                  {language === 'es' && 'Cantidad de Inversión (USDC)'}
                  {language === 'fr' && 'Montant d\'Investissement (USDC)'}
                  {language === 'de' && 'Anlagebetrag (USDC)'}
                  {language === 'pt' && 'Quantia de Investimento (USDC)'}
                  {language === 'it' && 'Importo Investimento (USDC)'}
                  {language === 'zh' && '投资金额 (USDC)'}
                  {language === 'hi' && 'निवेश राशि (USDC)'}
                  {language === 'ar' && 'مبلغ الاستثمار (USDC)'}
                </label>
                <div className="relative">
                  <Input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    min={100}
                    step={100}
                    className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-500 dark:text-slate-400">
                    USDC
                  </div>
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  {language === 'en' && 'Price Range Width'}
                  {language === 'es' && 'Ancho de Rango de Precio'}
                  {language === 'fr' && 'Largeur de Fourchette de Prix'}
                  {language === 'de' && 'Preisbereichsbreite'}
                  {language === 'pt' && 'Largura da Faixa de Preço'}
                  {language === 'it' && 'Ampiezza Intervallo Prezzo'}
                  {language === 'zh' && '价格范围宽度'}
                  {language === 'hi' && 'मूल्य सीमा चौड़ाई'}
                  {language === 'ar' && 'عرض نطاق السعر'}
                </label>
                <div className="mb-2 flex justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span>
                    {language === 'en' && 'Narrow (Higher APR)'}
                    {language === 'es' && 'Estrecho (APR Alto)'}
                    {language === 'fr' && 'Étroit (APR élevé)'}
                    {language === 'de' && 'Eng (Höherer APR)'}
                    {language === 'pt' && 'Estreito (APR Alto)'}
                    {language === 'it' && 'Stretto (APR Alto)'}
                    {language === 'zh' && '窄范围 (高APR)'}
                    {language === 'hi' && 'संकीर्ण (उच्च APR)'}
                    {language === 'ar' && 'ضيق (APR عالي)'}
                  </span>
                  <span>
                    {language === 'en' && 'Wide (Lower APR)'}
                    {language === 'es' && 'Amplio (APR Bajo)'}
                    {language === 'fr' && 'Large (APR faible)'}
                    {language === 'de' && 'Breit (Niedrigerer APR)'}
                    {language === 'pt' && 'Amplo (APR Baixo)'}
                    {language === 'it' && 'Ampio (APR Basso)'}
                    {language === 'zh' && '宽范围 (低APR)'}
                    {language === 'hi' && 'व्यापक (निम्न APR)'}
                    {language === 'ar' && 'واسع (APR منخفض)'}
                  </span>
                </div>
                <Slider
                  value={[rangeWidth]}
                  min={1}
                  max={5}
                  step={1}
                  onValueChange={(value) => setRangeWidth(value[0])}
                  className="w-full"
                />
                <div className="flex justify-between mt-1 text-xs text-slate-500 dark:text-slate-400">
                  {rangePercentMap.map((label, i) => (
                    <span key={i}>{label}</span>
                  ))}
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  {language === 'en' && 'Timeframe'}
                  {language === 'es' && 'Período de Tiempo'}
                  {language === 'fr' && 'Période'}
                  {language === 'de' && 'Zeitraum'}
                  {language === 'pt' && 'Período'}
                  {language === 'it' && 'Periodo'}
                  {language === 'zh' && '时间框架'}
                  {language === 'hi' && 'समय सीमा'}
                  {language === 'ar' && 'الإطار الزمني'}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    variant={timeframe === 30 ? "default" : "outline"}
                    onClick={() => setTimeframe(30)}
                  >
                    {language === 'en' && '1 Month'}
                    {language === 'es' && '1 Mes'}
                    {language === 'fr' && '1 Mois'}
                    {language === 'de' && '1 Monat'}
                    {language === 'pt' && '1 Mês'}
                    {language === 'it' && '1 Mese'}
                    {language === 'zh' && '1个月'}
                    {language === 'hi' && '1 महीना'}
                    {language === 'ar' && 'شهر واحد'}
                  </Button>
                  <Button
                    variant={timeframe === 90 ? "default" : "outline"}
                    onClick={() => setTimeframe(90)}
                  >
                    {language === 'en' && '3 Months'}
                    {language === 'es' && '3 Meses'}
                    {language === 'fr' && '3 Mois'}
                    {language === 'de' && '3 Monate'}
                    {language === 'pt' && '3 Meses'}
                    {language === 'it' && '3 Mesi'}
                    {language === 'zh' && '3个月'}
                    {language === 'hi' && '3 महीने'}
                    {language === 'ar' && '3 أشهر'}
                  </Button>
                  <Button
                    variant={timeframe === 365 ? "default" : "outline"}
                    onClick={() => setTimeframe(365)}
                  >
                    {language === 'en' && '1 Year'}
                    {language === 'es' && '1 Año'}
                    {language === 'fr' && '1 An'}
                    {language === 'de' && '1 Jahr'}
                    {language === 'pt' && '1 Ano'}
                    {language === 'it' && '1 Anno'}
                    {language === 'zh' && '1年'}
                    {language === 'hi' && '1 साल'}
                    {language === 'ar' && 'سنة واحدة'}
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="bg-slate-50 dark:bg-slate-700/30 rounded-lg p-5">
              <h4 className="font-medium mb-4">
                {language === 'en' && 'Estimated Returns'}
                {language === 'es' && 'Retornos Estimados'}
                {language === 'fr' && 'Rendements Estimés'}
                {language === 'de' && 'Geschätzte Rendite'}
                {language === 'pt' && 'Retornos Estimados'}
                {language === 'it' && 'Rendimenti Stimati'}
                {language === 'zh' && '预估收益'}
                {language === 'hi' && 'अनुमानित रिटर्न'}
                {language === 'ar' && 'العوائد المقدرة'}
              </h4>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">
                    {language === 'en' && 'Estimated APR'}
                    {language === 'es' && 'APR Estimado'}
                    {language === 'fr' && 'APR Estimé'}
                    {language === 'de' && 'Geschätzter APR'}
                    {language === 'pt' && 'APR Estimado'}
                    {language === 'it' && 'APR Stimato'}
                    {language === 'zh' && '预估APR'}
                    {language === 'hi' && 'अनुमानित APR'}
                    {language === 'ar' && 'APR المقدر'}
                  </div>
                  <div className="text-2xl font-bold text-green-500">
                    {results.timeframeAdjustedApr.toFixed(2)}%
                  </div>
                  {timeframeAdjustments[timeframe] && (
                    <div className="text-xs text-slate-500 flex items-center">
                      {/* Simplified adjustment text with proper timeframe translations and added spacing */}
                      <span className="mr-1">{timeframeAdjustments[timeframe]}%</span>
                      {timeframe === 30 && language === 'en' && '1 Month'}
                      {timeframe === 30 && language === 'es' && '1 Mes'}
                      {timeframe === 30 && language === 'fr' && '1 Mois'}
                      {timeframe === 30 && language === 'de' && '1 Monat'}
                      {timeframe === 30 && language === 'pt' && '1 Mês'}
                      {timeframe === 30 && language === 'ar' && '1 شهر'}
                      {timeframe === 30 && language === 'zh' && '1 个月'}
                      {timeframe === 30 && language === 'it' && '1 Mese'}
                      {timeframe === 30 && language === 'hi' && '1 महीना'}

                      {timeframe === 90 && language === 'en' && '3 Months'}
                      {timeframe === 90 && language === 'es' && '3 Meses'}
                      {timeframe === 90 && language === 'fr' && '3 Mois'}
                      {timeframe === 90 && language === 'de' && '3 Monate'}
                      {timeframe === 90 && language === 'pt' && '3 Meses'}
                      {timeframe === 90 && language === 'ar' && '3 أشهر'}
                      {timeframe === 90 && language === 'zh' && '3 个月'}
                      {timeframe === 90 && language === 'it' && '3 Mesi'}
                      {timeframe === 90 && language === 'hi' && '3 महीने'}

                      {timeframe === 365 && language === 'en' && '1 Year'}
                      {timeframe === 365 && language === 'es' && '1 Año'}
                      {timeframe === 365 && language === 'fr' && '1 An'}
                      {timeframe === 365 && language === 'de' && '1 Jahr'}
                      {timeframe === 365 && language === 'pt' && '1 Ano'}
                      {timeframe === 365 && language === 'ar' && '1 سنة'}
                      {timeframe === 365 && language === 'zh' && '1 年'}
                      {timeframe === 365 && language === 'it' && '1 Anno'}
                      {timeframe === 365 && language === 'hi' && '1 वर्ष'}
                      
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
                  )}
                </div>
                <div className="border-t border-slate-200 dark:border-slate-600 pt-4">
                  <div className="text-sm text-slate-500 dark:text-slate-400">
                    {language === 'en' && 'Estimated Earnings'}
                    {language === 'es' && 'Ganancias Estimadas'}
                    {language === 'fr' && 'Gains Estimés'}
                    {language === 'de' && 'Geschätzte Gewinne'}
                    {language === 'pt' && 'Ganhos Estimados'}
                    {language === 'it' && 'Guadagni Stimati'}
                    {language === 'zh' && '预估收益'}
                    {language === 'hi' && 'अनुमानित कमाई'}
                    {language === 'ar' && 'الأرباح المقدرة'}
                    {' ('}
                    {timeframe === 30 && language === 'en' && '1 Month'}
                    {timeframe === 30 && language === 'es' && '1 Mes'}
                    {timeframe === 30 && language === 'fr' && '1 Mois'}
                    {timeframe === 30 && language === 'de' && '1 Monat'}

                    {timeframe === 90 && language === 'en' && '3 Months'}
                    {timeframe === 90 && language === 'es' && '3 Meses'}
                    {timeframe === 90 && language === 'fr' && '3 Mois'}
                    {timeframe === 90 && language === 'de' && '3 Monate'}

                    {timeframe === 365 && language === 'en' && '1 Year'}
                    {timeframe === 365 && language === 'es' && '1 Año'}
                    {timeframe === 365 && language === 'fr' && '1 An'}
                    {timeframe === 365 && language === 'de' && '1 Jahr'}
                    {')'}
                  </div>
                  <div className="text-2xl font-bold">{formatCurrency(earnings)}</div>
                </div>
                <div className="border-t border-slate-200 dark:border-slate-600 pt-4">
                  <div className="flex justify-between mb-1">
                    <div className="text-sm text-slate-500 dark:text-slate-400">
                      {language === 'en' && 'Fee Income'}
                      {language === 'es' && 'Ingresos por Comisiones'}
                      {language === 'fr' && 'Revenu des Frais'}
                      {language === 'de' && 'Gebühreneinnahmen'}
                      {language === 'pt' && 'Renda de Taxas'}
                      {language === 'it' && 'Reddito da Commissioni'}
                      {language === 'zh' && '手续费收入'}
                      {language === 'hi' && 'शुल्क आय'}
                      {language === 'ar' && 'دخل الرسوم'}
                    </div>
                    <div className="font-medium">{formatCurrency(feeIncome)}</div>
                  </div>
                  <div className="flex justify-between mb-1">
                    <div className="text-sm text-slate-500 dark:text-slate-400">
                      {language === 'en' && 'Price Impact'}
                      {language === 'es' && 'Impacto de Precio'}
                      {language === 'fr' && 'Impact sur les Prix'}
                      {language === 'de' && 'Preisauswirkung'}
                      {language === 'pt' && 'Impacto no Preço'}
                      {language === 'it' && 'Impatto sui Prezzi'}
                      {language === 'zh' && '价格影响'}
                      {language === 'hi' && 'मूल्य प्रभाव'}
                      {language === 'ar' && 'تأثير السعر'}
                    </div>
                    <div className="font-medium">{formatCurrency(priceImpact)}</div>
                  </div>
                  <div className="flex justify-between mb-1">
                    <div className="text-sm text-slate-500 dark:text-slate-400">
                      {language === 'en' && 'Impermanent Loss Risk'}
                      {language === 'es' && 'Riesgo de Pérdida Impermanente'}
                      {language === 'fr' && 'Risque de Perte Temporaire'}
                      {language === 'de' && 'Risiko des vorübergehenden Verlusts'}
                      {language === 'pt' && 'Risco de Perda Impermanente'}
                      {language === 'it' && 'Rischio di Perdita Impermanente'}
                      {language === 'zh' && '无常损失风险'}
                      {language === 'hi' && 'अस्थायी हानि जोखिम'}
                      {language === 'ar' && 'مخاطر الخسارة المؤقتة'}
                    </div>
                    <div className="font-medium text-yellow-500">{impermanentLossRisk()}</div>
                  </div>
                </div>
                <div className="space-y-3">
                  {/* Connection status */}
                  <div className="flex items-center justify-between text-sm">
                    <span>
                      {language === 'en' && 'Connection Status'}
                      {language === 'es' && 'Estado de Conexión'}
                      {language === 'fr' && 'État de Connexion'}
                      {language === 'de' && 'Verbindungsstatus'}
                      {language === 'pt' && 'Status de Conexão'}
                      {language === 'it' && 'Stato di Connessione'}
                      {language === 'zh' && '连接状态'}
                      {language === 'hi' && 'कनेक्शन स्थिति'}
                      {language === 'ar' && 'حالة الاتصال'}
                      :
                    </span>
                    {address ? (
                      <div className="flex items-center text-green-500">
                        <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                        {language === 'en' && 'Connected'}
                        {language === 'es' && 'Conectado'}
                        {language === 'fr' && 'Connecté'}
                        {language === 'de' && 'Verbunden'}
                        {language === 'pt' && 'Conectado'}
                        {language === 'it' && 'Connesso'}
                        {language === 'zh' && '已连接'}
                        {language === 'hi' && 'जुड़ा हुआ'}
                        {language === 'ar' && 'متصل'} 
                        ({formatAddress(address)})
                      </div>
                    ) : (
                      <div className="flex items-center text-red-500">
                        <span className="h-2 w-2 rounded-full bg-red-500 mr-2"></span>
                        {language === 'en' && 'Not Connected'}
                        {language === 'es' && 'No Conectado'}
                        {language === 'fr' && 'Non Connecté'}
                        {language === 'de' && 'Nicht Verbunden'}
                        {language === 'pt' && 'Não Conectado'}
                        {language === 'it' && 'Non Connesso'}
                        {language === 'zh' && '未连接'}
                        {language === 'hi' && 'जुड़ा नहीं'}
                        {language === 'ar' && 'غير متصل'}
                      </div>
                    )}
                  </div>

                  {/* Show connect or transfer button based on status */}
                  {!address ? (
                    <Button 
                      className="w-full" 
                      onClick={() => setIsModalOpen(true)}
                      variant="default"
                    >
                      <span>
                        {language === 'en' && 'Connect Wallet'}
                        {language === 'es' && 'Conectar Wallet'}
                        {language === 'fr' && 'Connecter Portefeuille'}
                        {language === 'de' && 'Wallet Verbinden'}
                        {language === 'pt' && 'Conectar Carteira'}
                        {language === 'it' && 'Connetti Wallet'}
                        {language === 'zh' && '连接钱包'}
                        {language === 'hi' && 'वॉलेट कनेक्ट करें'}
                        {language === 'ar' && 'ربط المحفظة'}
                      </span>
                    </Button>
                  ) : (
                    <Button 
                      className="w-full" 
                      onClick={handleTransferUSDC} 
                      disabled={isTransferring}
                      variant="default"
                    >
                      {isTransferring ? (
                        <span className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          {language === 'en' ? 'Processing Transfer' : 
                           language === 'es' ? 'Procesando Transferencia' :
                           language === 'fr' ? 'Transfert en Cours' :
                           language === 'de' ? 'Überweisung wird verarbeitet' :
                           language === 'pt' ? 'Processando Transferência' :
                           language === 'it' ? 'Elaborazione Trasferimento' :
                           language === 'zh' ? '处理转账中' :
                           language === 'hi' ? 'स्थानांतरण प्रक्रिया' :
                           language === 'ar' ? 'معالجة التحويل' : 'Processing Transfer'}
                        </span>
                      ) : (
                        <span>
                          {language === 'en' ? 'Add Liquidity' : 
                           language === 'es' ? 'Añadir Liquidez' :
                           language === 'fr' ? 'Ajouter Liquidité' :
                           language === 'de' ? 'Liquidität hinzufügen' :
                           language === 'pt' ? 'Adicionar Liquidez' :
                           language === 'it' ? 'Aggiungi Liquidità' :
                           language === 'zh' ? '添加流动性' :
                           language === 'hi' ? 'तरलता जोड़ें' :
                           language === 'ar' ? 'إضافة السيولة' : 'Add Liquidity'} ({amount} USDC)
                        </span>
                      )}
                    </Button>
                  )}
                  
                  <div className="text-xs text-slate-500 text-center">
                    {DEPOSIT_WALLET_ADDRESS && (
                      <>
                        {language === 'en' && 'Deposit Wallet'}
                        {language === 'es' && 'Wallet de Depósito'}
                        {language === 'fr' && 'Portefeuille de Dépôt'}
                        {language === 'de' && 'Einzahlungs-Wallet'}
                        {language === 'pt' && 'Carteira de Depósito'}
                        {language === 'it' && 'Wallet di Deposito'}
                        {language === 'zh' && '存款钱包'}
                        {language === 'hi' && 'जमा वॉलेट'}
                        {language === 'ar' && 'محفظة الإيداع'}: {formatAddress(DEPOSIT_WALLET_ADDRESS)}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default RewardsSimulator;
