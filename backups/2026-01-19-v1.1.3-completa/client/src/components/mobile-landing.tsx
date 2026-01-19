import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { useTranslation } from '@/hooks/use-translation';
import { apiRequest } from '@/lib/queryClient';
import { calculatePotentialRewards, calculateCompleteRewards } from '@/lib/uniswap';
import { riskCalculatorTranslations } from '@/translations/risk-calculator';
import { dashboardTranslations } from '@/translations/dashboard';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { cn } from '@/lib/utils';
import {
  ArrowRight,
  Award,
  BarChart2,
  ChevronDown,
  DollarSign,
  Lock,
  TrendingUp,
  Wallet,
  AlertTriangle,
  ArrowUpCircle,
  ArrowDownCircle,
  InfoIcon,
  Shield,
  Activity,
  Flame,
} from 'lucide-react';

/**
 * Landing page optimizada para móviles con foco en la calculadora de beneficios
 */
const MobileLanding: React.FC = () => {
  const [_, navigate] = useLocation();
  const { t } = useTranslation();
  
  // Estados para la calculadora
  const [investmentAmount, setInvestmentAmount] = useState<number>(25000);
  const [priceRange, setPriceRange] = useState<number>(50);
  const [timeframe, setTimeframe] = useState<string>("3");
  // Aseguramos que USDC/ETH esté seleccionado por defecto (usando exactamente el mismo formato que se muestra)
  // Volvemos a hacer el selector interactivo, pero con USDC/ETH por defecto
  const [selectedPool, setSelectedPool] = useState<string>("usdc-eth-0.05");
  // Estado para la nueva calculadora de perfiles de riesgo
  const [selectedRiskProfile, setSelectedRiskProfile] = useState<string>("moderate");
  const [showRiskCalculator, setShowRiskCalculator] = useState<boolean>(false);
  const { language } = useTranslation();
  
  // Aseguramos que al iniciar el componente, siempre se establezca USDC/ETH por defecto
  useEffect(() => {
    // Establecemos el valor correcto para asegurar USDC/ETH como valor inicial
    setSelectedPool("usdc-eth-0.05");
    console.log("[Mobile Calculator] Estableciendo USDC/ETH como pool inicial recomendado");
  }, []);
  // Valores de ajuste predeterminados en caso de que la API no responda
  // Actualizados según los valores del panel de admin (14/05/2025)
  const [timeframeAdjustments, setTimeframeAdjustments] = useState<Record<string, number>>({
    "1": -64.56,  // Ajuste para 30 días (1 mes)
    "3": -57.37,  // Ajuste para 90 días (3 meses)
    "12": -34.52  // Ajuste para 365 días (1 año)
  });
  
  // Datos de pools para la calculadora - se actualizarán desde la API con APR real
  const [poolOptions, setPoolOptions] = useState([
    { id: "usdt-eth-0.3", name: "USDT-ETH", apr: 10, address: "0x4e68ccd3e89f51c3074ca5072bbac773960dfa36" },
    { id: "usdc-eth-0.05", name: "USDC / ETH 0.05%", apr: 10, address: "0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640" },
    { id: "wbtc-usdc-0.01", name: "WBTC / USDC 0.01%", apr: 10, address: "0x99ac8ca7087fa4a2a1fb6357269965a2014abc35" }
  ]);

  // Estado para el APR real cargado desde la API
  const [realBaseApr, setRealBaseApr] = useState<number>(10);
  const [aprLoaded, setAprLoaded] = useState<boolean>(false);
  // Mapa de APRs por pool para usar el correcto según selección
  const [poolAprMap, setPoolAprMap] = useState<Record<string, number>>({});

  // Obtener datos de la API: solo ajustes de timeframe, mantenemos APRs fijos para consistencia
  useEffect(() => {
    // Obtener ajustes de timeframe para cálculos
    const fetchTimeframeAdjustments = async () => {
      try {
        console.log("[Mobile Calculator] Solicitando ajustes de timeframe desde API");
        const adjustmentsData = await apiRequest('GET', '/api/timeframe-adjustments');
        
        if (adjustmentsData && typeof adjustmentsData === 'object') {
          // Convertir los valores de días en meses para nuestro componente
          const adjustmentsMap: Record<string, number> = {};
          
          if (Array.isArray(adjustmentsData)) {
            console.log("[Mobile Calculator] Datos de ajustes recibidos como array:", adjustmentsData);
            // Si es un array, procesarlo (formato: [{timeframe: 30, adjustmentPercentage: '-24.56'}, ...])
            adjustmentsData.forEach((adjustment: any) => {
              // Convertir días a meses para nuestro selector: 30->1, 90->3, 365->12
              let monthValue = "";
              if (adjustment.timeframe === 30) monthValue = "1";
              else if (adjustment.timeframe === 90) monthValue = "3";
              else if (adjustment.timeframe === 365) monthValue = "12";
              else monthValue = Math.round(adjustment.timeframe / 30).toString();
              
              // Asegurarse de que el valor es un número y no una cadena
              const adjustmentValue = typeof adjustment.adjustmentPercentage === 'string' 
                ? parseFloat(adjustment.adjustmentPercentage)
                : adjustment.adjustmentPercentage;
                
              adjustmentsMap[monthValue] = adjustmentValue;
            });
          } else {
            console.log("[Mobile Calculator] Datos de ajustes recibidos como objeto:", adjustmentsData);
            // Si es un objeto, convertir días a meses: 30->1, 90->3, 365->12
            if (adjustmentsData["30"]) adjustmentsMap["1"] = parseFloat(adjustmentsData["30"]);
            if (adjustmentsData["90"]) adjustmentsMap["3"] = parseFloat(adjustmentsData["90"]);
            if (adjustmentsData["365"]) adjustmentsMap["12"] = parseFloat(adjustmentsData["365"]);
          }
          
          // Verificar que tenemos datos para todas las opciones de timeframe principales
          if (adjustmentsMap["1"] !== undefined && 
              adjustmentsMap["3"] !== undefined && 
              adjustmentsMap["12"] !== undefined) {
            
            setTimeframeAdjustments(adjustmentsMap);
            console.log("[Mobile Calculator] Timeframe adjustments actualizados desde API:", adjustmentsMap);
          } else {
            console.log("[Mobile Calculator] Datos incompletos de API, faltan timeframes:", adjustmentsMap);
            // No actualizamos si faltan valores importantes
          }
        }
      } catch (error) {
        console.log("[Mobile Calculator] Usando valores predeterminados debido a error en API:", error);
      }
    };
    
    // Obtener APR real desde la API
    const fetchRealApr = async () => {
      try {
        console.log("[Mobile Calculator] Solicitando APR real desde API");
        const response = await fetch('/api/pools/apr');
        if (response.ok) {
          const pools = await response.json();
          console.log("[Mobile Calculator] Pools recibidos de API:", pools);

          // Crear mapa de APRs por ID de pool
          const aprMap: Record<string, number> = {};

          pools.forEach((p: any) => {
            // Mapear nombres de API a IDs de componente
            // Nombres de API: "USDT-ETH", "USDC / ETH", "ETH-DAI", "WBTC/USDC"
            const nameLower = p.name.toLowerCase();
            if (nameLower === "usdt-eth" || nameLower.includes("usdt") && nameLower.includes("eth")) {
              aprMap["usdt-eth-0.3"] = p.apr || 10;
            }
            if (nameLower === "usdc / eth" || nameLower === "usdc/eth" || (nameLower.includes("usdc") && nameLower.includes("eth") && !nameLower.includes("usdt"))) {
              aprMap["usdc-eth-0.05"] = p.apr || 10;
            }
            if (nameLower === "eth-dai" || (nameLower.includes("eth") && nameLower.includes("dai"))) {
              aprMap["eth-dai-0.3"] = p.apr || 10;
            }
            if (nameLower === "wbtc/usdc" || nameLower === "wbtc-usdc" || (nameLower.includes("wbtc") && nameLower.includes("usdc"))) {
              aprMap["wbtc-usdc-0.01"] = p.apr || 10;
            }
          });

          console.log("[Mobile Calculator] Mapa de APRs creado:", aprMap);
          setPoolAprMap(aprMap);

          // Establecer APR por defecto del pool seleccionado (USDC/ETH)
          const defaultApr = aprMap["usdc-eth-0.05"] || aprMap["usdt-eth-0.3"] || 10;
          setRealBaseApr(defaultApr);
          setAprLoaded(true);

          console.log("[Mobile Calculator] APR real cargado desde API:", defaultApr, "% para pool inicial");

          // NO actualizamos poolOptions para evitar conflictos con los IDs hardcodeados
          // Los APRs se muestran usando poolAprMap que ya tiene los IDs correctos
        }
      } catch (error) {
        console.error("[Mobile Calculator] Error cargando APR real:", error);
        setAprLoaded(true); // Marcar como cargado para usar valor por defecto
      }
    };

    fetchTimeframeAdjustments();
    fetchRealApr();
  }, []);
  
  // Calcular los retornos usando EXACTAMENTE la misma lógica que la calculadora desktop
  const calculateReturns = () => {
    // Usar el APR real del pool SELECCIONADO desde el mapa de APRs
    // IMPORTANTE: Usar 24.5 (USDC/ETH real) como fallback si el mapa está vacío
    const baseApr = Object.keys(poolAprMap).length > 0
      ? (poolAprMap[selectedPool] || 24.5)
      : 24.5;  // APR de USDC/ETH como default mientras carga

    // Debug minimal
    console.log("[Mobile] APR:", baseApr, "pool:", selectedPool);
    
    // IMPORTANTE: Convertir los rangos de la UI móvil a escala equivalente en desktop
    // Móvil: 10-90% -> Desktop: 1-5 (±10%-±50%)
    
    // Mapear el rango del deslizador móvil (10-90) a la escala de escritorio (1-5)
    // donde 10% = 1 (±10%) y 90% = 5 (±50%)
    const desktopRangeEquivalent = 1 + ((priceRange - 10) / 80) * 4;
    
    // Convertir timeframe string ("1", "3", "12") a número para la función centralizada
    const timeframeNumber = parseInt(timeframe);
    
    // IMPORTANTE: Convertir los ajustes del formato móvil al formato que espera la función centralizada
    // Móvil usa {"1": -24.56, "3": -17.37, "12": -4.52} pero la función espera {30: -24.56, 90: -17.37, 365: -4.52}
    const convertedAdjustments: Record<number, number> = {
      30: timeframeAdjustments["1"] || 0,  // 1 mes = 30 días
      90: timeframeAdjustments["3"] || 0,  // 3 meses = 90 días
      365: timeframeAdjustments["12"] || 0 // 12 meses = 365 días
    };
    
    // Convertir de meses a días para pasar a la función centralizada
    const timeframeDays = timeframeNumber === 1 ? 30 : (timeframeNumber === 3 ? 90 : 365);
    
    // Usar EXACTAMENTE la misma función centralizada que usa la calculadora de escritorio
    const result = calculateCompleteRewards(
      investmentAmount,     // Monto de inversión
      baseApr,              // APR base unificado (igual que desktop)
      desktopRangeEquivalent, // Rango convertido a escala desktop
      timeframeDays,        // CORREGIDO: Convertir 1->30, 3->90, 12->365 días
      convertedAdjustments  // CORREGIDO: Ajustes en formato días
    );
    
    // Obtenemos el nombre del pool seleccionado para mostrar en los resultados
    const selectedPoolName = poolOptions.find(p => p.id === selectedPool)?.name || "USDC / ETH 0.05%";
    
    // Log mínimo para debug (evitar loops)
    // console.log("[Móvil] APR:", baseApr, "resultado:", result.timeframeAdjustedApr);
    
    // Devolver los resultados en el formato esperado por la UI móvil
    return {
      apr: result.timeframeAdjustedApr.toFixed(2),
      earnings: result.earnings.toFixed(2),
      total: (investmentAmount + result.earnings).toFixed(2),
      timeframeAdjustment: result.timeframeAdjustment.toFixed(2)
    };
  };
  
  const returns = calculateReturns();
  
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-slate-950 to-indigo-950 text-white overflow-x-hidden">
      {/* Header móvil */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-transparent border-b border-slate-800">
        <div className="mobile-header-container">
          <div className="flex items-center bg-transparent">
            <span className="text-2xl font-bold bg-transparent" style={{ textShadow: 'none', border: 'none', outline: 'none', background: 'transparent' }}>
              <span className="text-white bg-transparent" style={{ textShadow: 'none', border: 'none', outline: 'none', background: 'transparent' }}>Way</span>
              <span className="text-primary bg-transparent" style={{ textShadow: 'none', border: 'none', outline: 'none', background: 'transparent' }}>Pool</span>
            </span>
          </div>
          <Button 
            size="sm" 
            className="bg-green-600 border-0 text-white hover:bg-green-700"
            onClick={() => navigate('/dashboard')}
          >
            {t('landing.accessDashboard', 'Dashboard')}
          </Button>
        </div>
      </header>
      
      <main className="flex-grow mobile-content-container" style={{ marginTop: '50px' }}>
        {/* Hero Section */}
        <section className="pt-10 pb-20 px-4 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            {/* Fondo con patrón de blockchain */}
            <div className="w-full h-full bg-[url('/blockchain-pattern.svg')] bg-repeat opacity-5"></div>
          </div>
          
          <div className="relative z-10 hero-text-container">
            <h1 className="text-3xl sm:text-4xl font-bold mb-4 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-indigo-400 to-blue-400">
              {t('landing.heroTitle', 'Intelligent Liquidity Management')}
            </h1>
            <p className="text-slate-300 mb-8 max-w-sm mx-auto transparent-bg" style={{background: 'none'}}>
              {t('landing.heroSubtitle', 'Maximize DeFi yields with smart position management and risk reduction')}
            </p>
            <div className="flex flex-col gap-3 max-w-xs mx-auto">
              <Button 
                className="w-full py-6 text-lg font-medium bg-gradient-to-r from-purple-600 to-indigo-600 border-0 text-white hover:from-purple-700 hover:to-indigo-700"
                onClick={() => navigate('/dashboard')}
              >
                {t('landing.getStarted', 'Get Started')} <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </section>
        
        {/* Calculadora de Beneficios - SECCIÓN CLAVE */}
        <section className="py-12 px-4 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 mb-4">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-2 text-white">
                {t('landing.rewardsSimulatorTitle', 'Calculate Your Earnings')}
              </h2>
              <p className="text-slate-300 text-sm">
                {t('landing.rewardsSimulatorDescription', 'Estimate your potential returns with our yield simulator')}
              </p>
            </div>
            
            <div className="bg-slate-900/70 rounded-lg backdrop-blur-sm shadow-xl mobile-calculator">
              <div className="p-6">
                {/* Selector de Pool */}
                <div className="mb-6">
                  <Select 
                    value={selectedPool} 
                    onValueChange={setSelectedPool}
                    defaultValue="usdc-eth-0.05"
                  >
                    <SelectTrigger className="w-full bg-slate-800/50 border-0 text-white shadow-lg">
                      <SelectValue placeholder="Select a pool" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-0 text-white shadow-xl">
                      {/* Primer elemento explícitamente USDC/ETH con un indicador de recomendado */}
                      <SelectItem
                        key="usdc-eth-0.05"
                        value="usdc-eth-0.05"
                        className="text-white font-semibold border-b border-slate-700 pb-3 mb-1 hover:bg-slate-700"
                      >
                        USDC / ETH 0.05% <span className="text-green-400 ml-2">{poolAprMap["usdc-eth-0.05"]?.toFixed(1) || "..."} % APR</span>
                        <span className="text-xs text-blue-400 ml-2 font-normal">{dashboardTranslations[language]?.recommended || "Recommended"}</span>
                      </SelectItem>
                      
                      {/* Resto de los pools, filtrando el de USDC/ETH que ya colocamos arriba */}
                      {poolOptions
                        .filter(pool => pool.id !== "usdc-eth-0.05")
                        .map(pool => (
                          <SelectItem key={pool.id} value={pool.id} className="text-white hover:bg-slate-700">
                            {pool.name} <span className="text-green-400 ml-2">{(poolAprMap[pool.id] || pool.apr || 10).toFixed(1)}% APR</span>
                          </SelectItem>
                        ))
                      }
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Monto de Inversión */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    {t('landing.investmentAmount', 'Investment Amount (USDC)')}
                  </label>
                  <div className="flex items-center">
                    <Input 
                      type="number"
                      value={investmentAmount}
                      onChange={(e) => setInvestmentAmount(Number(e.target.value))}
                      className="bg-slate-800/50 border-0 text-white shadow-lg text-3xl h-20 px-4"
                      style={{ fontSize: '2rem', height: '80px' }}
                      min={100}
                      max={1000000}
                    />
                    <Button
                      variant="ghost"
                      className="ml-2 text-green-400 font-bold border-0 text-2xl h-16"
                      style={{ fontSize: '1.5rem', height: '64px' }}
                      onClick={() => setInvestmentAmount(investmentAmount * 2)}
                    >
                      2x
                    </Button>
                  </div>
                  {/* Botones de cantidad predefinida eliminados a pedido del usuario */}
                </div>
                
                {/* Ancho del Rango de Precios */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-slate-300">
                      {t('landing.priceRangeWidth', 'Price Range Width')}
                    </label>
                    <span className="text-xs font-medium px-3 py-1.5 rounded-full bg-gradient-to-r from-purple-600/20 to-purple-800/20 text-purple-400 shadow-sm">
                      {priceRange}%
                    </span>
                  </div>
                  <Slider 
                    value={[priceRange]} 
                    min={10} 
                    max={90} 
                    step={5}
                    onValueChange={(values) => setPriceRange(values[0])}
                    className="mb-2 [&>span]:bg-gradient-to-r [&>span]:from-purple-600 [&>span]:to-purple-800 [&>span]:border-0"
                  />
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>{t('landing.narrowRange', 'Narrow')}</span>
                    <span>{t('landing.wideRange', 'Wide')}</span>
                  </div>
                </div>
                
                {/* Sección de timeframe sin título (solo botones) */}
                <div className="mb-8">
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { value: "1", label: t('landing.oneMonth', '1 Month') },
                      { value: "3", label: t('landing.threeMonths', '3 Months') },
                      { value: "12", label: t('landing.oneYear', '1 Year') },
                    ].map((option) => (
                      <Button
                        key={option.value}
                        variant={timeframe === option.value ? "default" : "ghost"}
                        className={timeframe === option.value 
                          ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 border-0 shadow-lg" 
                          : "bg-slate-800/30 border-0 text-white hover:bg-slate-800/50 hover:text-green-400"}
                        onClick={() => setTimeframe(option.value)}
                      >
                        {option.label}
                      </Button>
                    ))}
                  </div>
                </div>
                
                {/* Resultados Simplificados y Sin Bordes */}
                <div className="py-2 px-1 mb-6 border-0">
                  <h3 className="text-xl font-medium text-white mb-3 text-center">
                    {t('landing.estimatedReturns', 'Estimated Returns')}
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-1 mb-7">
                    <div className="text-center px-1">
                      <div className="text-xs text-slate-300 mb-0">
                        {t('landing.estimatedApr', 'Estimated APR')}
                      </div>
                      <div className="text-4xl sm:text-5xl font-bold text-green-400 leading-none tracking-tight pt-1">
                        {returns.apr}%
                      </div>
                    </div>
                    
                    <div className="text-center px-1">
                      <div className="text-xs text-slate-300 mb-0">
                        {t('landing.estimatedEarnings', 'Estimated Earnings')}
                      </div>
                      <div className="text-4xl sm:text-5xl font-bold text-purple-400 leading-none tracking-tight pt-1">
                        ${Number(returns.earnings).toLocaleString('en-US', {
                          maximumFractionDigits: 0
                        })}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-5 pt-3 border-t border-slate-800">
                    <div className="flex flex-col text-center">
                      <span className="text-xs text-slate-300 mb-0">Total Value:</span>
                      <span className="text-5xl sm:text-6xl font-bold text-white leading-none tracking-tight pt-1">
                        ${Number(returns.total).toLocaleString('en-US', {
                          maximumFractionDigits: 0
                        })}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* CTA */}
                <Button
                  className="w-full py-6 text-lg font-medium bg-gradient-to-r from-green-500 to-emerald-600 border-0 text-white hover:from-green-600 hover:to-emerald-700"
                  onClick={() => {
                    // Convertir el pool seleccionado a formato estándar
                    const poolMap: Record<string, string> = {
                      "usdc-eth-0.05": "USDC / ETH",
                      "usdt-eth-0.3": "USDT-ETH", 
                      "eth-dai-0.3": "ETH-DAI",
                      "plume-usdc-0.3": "PLUME/USDC",
                      "wbtc-usdc-0.01": "WBTC/USDC"
                    };
                    
                    const standardPool = poolMap[selectedPool] || "USDC / ETH";
                    
                    // Crear parámetros URL con todos los valores de la calculadora móvil
                    const params = new URLSearchParams({
                      amount: investmentAmount.toString(),
                      pool: standardPool,
                      rangeWidth: Math.ceil(priceRange / 10).toString(), // Convertir porcentaje a escala 1-5
                      timeframe: timeframe === "1" ? "30" : timeframe === "3" ? "90" : "365",
                      fromCalculator: 'true',
                      source: 'mobile'
                    });
                    
                    navigate(`/add-liquidity?${params.toString()}`);
                  }}
                >
                  {t('landing.startInvesting', 'Start Investing')} <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </section>
        
        {/* Características Clave */}
        <section className="py-12 px-4">
          <h2 className="text-2xl font-bold mb-8 text-center text-white">
            {t('landing.features', 'Key Features')}
          </h2>
          
          <div className="space-y-6 max-w-md mx-auto">
            <FeatureCard 
              icon={<Lock className="h-5 w-5 text-purple-400" />}
              title={t('landing.minimizeRisks', 'Minimize Risks')}
              description={t('landing.minimizeRisksDesc', 'Smart algorithm keeps your positions optimized to reduce impermanent loss')}
            />
            
            <FeatureCard 
              icon={<BarChart2 className="h-5 w-5 text-blue-400" />}
              title={t('landing.maximizeYields', 'Maximize Yields')}
              description={t('landing.maximizeYieldsDesc', 'Earn more with automated position management and fee optimization')}
            />
            
            <FeatureCard 
              icon={<Wallet className="h-5 w-5 text-green-400" />}
              title={t('landing.fullControl', 'Full Control')}
              description={t('landing.fullControlDesc', 'Maintain complete control of your assets with our non-custodial solution')}
            />
          </div>
        </section>
        
        {/* Call to Action Final */}
        <section className="py-12 px-4 text-center bg-gradient-to-r from-indigo-900/50 to-purple-900/50">
          <div className="max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-3 text-white">
              {t('landing.ctaTitle', 'Ready to Optimize Your Liquidity?')}
            </h2>
            <p className="text-slate-300 mb-6">
              {t('landing.ctaSubtitle', 'Join thousands of users who trust WayBank with their DeFi investments')}
            </p>
            <Button 
              className="w-full py-6 text-lg font-medium bg-gradient-to-r from-purple-600 to-indigo-600 border-0 text-white hover:from-purple-700 hover:to-indigo-700"
              onClick={() => navigate('/dashboard')}
            >
              {t('landing.getStarted', 'Get Started')} <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </section>
      </main>
      
      {/* Calculadora de Perfiles de Riesgo */}
      <section className="py-12 px-4 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 mb-4">
              <BarChart2 className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-2 text-white">
              {riskCalculatorTranslations[language]?.riskCalculatorTitle || riskCalculatorTranslations.en.riskCalculatorTitle}
            </h2>
            <p className="text-slate-300 text-sm">
              {riskCalculatorTranslations[language]?.riskCalculatorSubtitle || riskCalculatorTranslations.en.riskCalculatorSubtitle}
            </p>
          </div>
          
          {/* Tarjetas de perfiles de riesgo */}
          <div className="grid grid-cols-1 gap-4 mb-6">
            {/* Perfil Conservador */}
            <button
              onClick={() => setSelectedRiskProfile("conservative")}
              className={cn(
                "p-4 rounded-lg text-left transition-all duration-200",
                selectedRiskProfile === "conservative"
                  ? "bg-blue-900/50 border-2 border-blue-500"
                  : "bg-slate-800/80 border border-slate-700 hover:border-blue-400"
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center mr-3">
                    <Shield className="h-5 w-5 text-blue-400" />
                  </div>
                  <h3 className="font-semibold text-lg text-white">
                    {riskCalculatorTranslations[language]?.conservativeProfile || riskCalculatorTranslations.en.conservativeProfile}
                  </h3>
                </div>
                <div className="h-6 w-6 rounded-full border border-slate-500 flex items-center justify-center">
                  {selectedRiskProfile === "conservative" && (
                    <div className="h-4 w-4 rounded-full bg-blue-500"></div>
                  )}
                </div>
              </div>
              <p className="text-sm text-slate-300 ml-13">
                {riskCalculatorTranslations[language]?.conservativeDescription || riskCalculatorTranslations.en.conservativeDescription}
              </p>
              <div className="mt-3 grid grid-cols-2 gap-2 text-center">
                <div className="bg-green-500/10 rounded-lg p-2">
                  <div className="text-xs text-green-300 mb-1">
                    {riskCalculatorTranslations[language]?.worstCaseScenario || riskCalculatorTranslations.en.worstCaseScenario}
                  </div>
                  <div className="font-bold text-green-400">+5%</div>
                </div>
                <div className="bg-green-500/10 rounded-lg p-2">
                  <div className="text-xs text-green-300 mb-1">
                    {riskCalculatorTranslations[language]?.bestCaseScenario || riskCalculatorTranslations.en.bestCaseScenario}
                  </div>
                  <div className="font-bold text-green-400">+25%</div>
                </div>
              </div>
            </button>
            
            {/* Perfil Moderado */}
            <button
              onClick={() => setSelectedRiskProfile("moderate")}
              className={cn(
                "p-4 rounded-lg text-left transition-all duration-200",
                selectedRiskProfile === "moderate"
                  ? "bg-purple-900/50 border-2 border-purple-500"
                  : "bg-slate-800/80 border border-slate-700 hover:border-purple-400"
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center mr-3">
                    <Activity className="h-5 w-5 text-purple-400" />
                  </div>
                  <h3 className="font-semibold text-lg text-white">
                    {riskCalculatorTranslations[language]?.moderateProfile || riskCalculatorTranslations.en.moderateProfile}
                  </h3>
                </div>
                <div className="h-6 w-6 rounded-full border border-slate-500 flex items-center justify-center">
                  {selectedRiskProfile === "moderate" && (
                    <div className="h-4 w-4 rounded-full bg-purple-500"></div>
                  )}
                </div>
              </div>
              <p className="text-sm text-slate-300 ml-13">
                {riskCalculatorTranslations[language]?.moderateDescription || riskCalculatorTranslations.en.moderateDescription}
              </p>
              <div className="mt-3 grid grid-cols-2 gap-2 text-center">
                <div className="bg-red-500/10 rounded-lg p-2">
                  <div className="text-xs text-red-300 mb-1">
                    {riskCalculatorTranslations[language]?.worstCaseScenario || riskCalculatorTranslations.en.worstCaseScenario}
                  </div>
                  <div className="font-bold text-red-400">-15%</div>
                </div>
                <div className="bg-green-500/10 rounded-lg p-2">
                  <div className="text-xs text-green-300 mb-1">
                    {riskCalculatorTranslations[language]?.bestCaseScenario || riskCalculatorTranslations.en.bestCaseScenario}
                  </div>
                  <div className="font-bold text-green-400">+75%</div>
                </div>
              </div>
            </button>
            
            {/* Perfil Agresivo */}
            <button
              onClick={() => setSelectedRiskProfile("aggressive")}
              className={cn(
                "p-4 rounded-lg text-left transition-all duration-200",
                selectedRiskProfile === "aggressive"
                  ? "bg-red-900/50 border-2 border-red-500"
                  : "bg-slate-800/80 border border-slate-700 hover:border-red-400"
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center mr-3">
                    <Flame className="h-5 w-5 text-red-400" />
                  </div>
                  <h3 className="font-semibold text-lg text-white">
                    {riskCalculatorTranslations[language]?.aggressiveProfile || riskCalculatorTranslations.en.aggressiveProfile}
                  </h3>
                </div>
                <div className="h-6 w-6 rounded-full border border-slate-500 flex items-center justify-center">
                  {selectedRiskProfile === "aggressive" && (
                    <div className="h-4 w-4 rounded-full bg-red-500"></div>
                  )}
                </div>
              </div>
              <p className="text-sm text-slate-300 ml-13">
                {riskCalculatorTranslations[language]?.aggressiveDescription || riskCalculatorTranslations.en.aggressiveDescription}
              </p>
              <div className="mt-3 grid grid-cols-2 gap-2 text-center">
                <div className="bg-red-500/10 rounded-lg p-2">
                  <div className="text-xs text-red-300 mb-1">
                    {riskCalculatorTranslations[language]?.worstCaseScenario || riskCalculatorTranslations.en.worstCaseScenario}
                  </div>
                  <div className="font-bold text-red-400">-35%</div>
                </div>
                <div className="bg-green-500/10 rounded-lg p-2">
                  <div className="text-xs text-green-300 mb-1">
                    {riskCalculatorTranslations[language]?.bestCaseScenario || riskCalculatorTranslations.en.bestCaseScenario}
                  </div>
                  <div className="font-bold text-green-400">+200%</div>
                </div>
              </div>
            </button>
          </div>
          
          {/* Alerta de riesgo */}
          <Alert className="bg-slate-800/50 border border-amber-500/30 mb-6">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            <AlertDescription className="text-xs text-slate-300">
              <strong>{riskCalculatorTranslations[language]?.riskDisclaimerTitle || riskCalculatorTranslations.en.riskDisclaimerTitle}:</strong> {riskCalculatorTranslations[language]?.riskDisclaimerText || riskCalculatorTranslations.en.riskDisclaimerText}
            </AlertDescription>
          </Alert>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-800 py-8 px-4">
        <div className="max-w-md mx-auto">
          <div className="flex justify-center mb-6">
            <span className="text-2xl font-bold bg-transparent" style={{ textShadow: 'none', border: 'none', outline: 'none', background: 'transparent' }}>
              <span className="text-white bg-transparent" style={{ textShadow: 'none', border: 'none', outline: 'none', background: 'transparent' }}>Way</span>
              <span className="text-primary bg-transparent" style={{ textShadow: 'none', border: 'none', outline: 'none', background: 'transparent' }}>Pool</span>
            </span>
          </div>
          
          <div className="grid grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-sm font-medium text-white mb-3">{t('landing.platform', 'Platform')}</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="/dashboard" className="text-slate-400 hover:text-white">{t('landing.dashboard', 'Dashboard')}</a></li>
                <li><a href="/positions" className="text-slate-400 hover:text-white">{t('landing.positions', 'Positions')}</a></li>
                <li><a href="/analytics" className="text-slate-400 hover:text-white">{t('landing.analytics', 'Analytics')}</a></li>
                <li><a href="/uniswap" className="text-slate-400 hover:text-white">TOP Pools</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-white mb-3">{t('landing.resources', 'Resources')}</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="/documentation" className="text-slate-400 hover:text-white">{t('landing.documentation', 'Documentation')}</a></li>
                <li><a href="/support" className="text-slate-400 hover:text-white">{t('landing.support', 'Support')}</a></li>
                <li><a href="/community" className="text-slate-400 hover:text-white">{t('landing.community', 'Community')}</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-800 pt-6 text-center">
            <div className="flex justify-center space-x-4 mb-4">
              <a href="/terms" className="text-xs text-slate-400 hover:text-white">{t('landing.termsOfUse', 'Terms of Use')}</a>
              <a href="/privacy" className="text-xs text-slate-400 hover:text-white">{t('landing.privacyPolicy', 'Privacy Policy')}</a>
              <a href="/disclaimer" className="text-xs text-slate-400 hover:text-white">{t('landing.disclaimer', 'Disclaimer')}</a>
            </div>
            <p className="text-xs text-slate-500">{t('landing.copyright', '© 2025 WayBank. All rights reserved.')}</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Componente de tarjeta de característica para la landing móvil
interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => {
  return (
    <div className="p-5 bg-gradient-to-br from-slate-800/50 to-slate-800/30 rounded-lg border border-slate-700/50 backdrop-blur-sm">
      <div className="flex items-start">
        <div className="flex-shrink-0 inline-flex items-center justify-center h-10 w-10 rounded-lg bg-gradient-to-br from-purple-500/20 to-indigo-500/20 text-purple-400 mr-4">
          {icon}
        </div>
        <div>
          <h3 className="font-medium text-white mb-1">{title}</h3>
          <p className="text-sm text-slate-300">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default MobileLanding;