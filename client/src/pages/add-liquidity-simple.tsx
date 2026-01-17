import React, { useState, useEffect } from "react";
import { useWallet } from "@/hooks/use-wallet";
import { DEPOSIT_WALLET_ADDRESS } from "@/lib/ethereum";
import { formatCurrency as formatCurrencyEth } from "@/lib/ethereum";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { calculatePotentialRewards } from "@/lib/uniswap";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { StripePaymentForm } from "@/components/payments/stripe-payment-form";
import RealUSDCTransferDialog from "@/components/payment/real-usdc-transfer-dialog";
import ConnectModal from "@/components/wallet/connect-modal";
import { Slider } from "@/components/ui/slider";
import { useLanguage } from "@/context/language-context";
import { addLiquidityTranslations } from "@/translations/add-liquidity";
import { useLocation } from "wouter";

// Declaración del tipo global para almacenar los ajustes de timeframe
declare global {
  interface Window {
    __currentTimeframeAdjustments?: Record<number, number>;
  }
}

// Definición local de createUserPosition en lugar de importarla
async function createUserPosition(
  txHash: string,
  poolData: any,
  walletAddress: string,
  depositAmount: string,
  rangeWidth: number,
  minPrice: string,
  maxPrice: string,
  status: "Active" | "Pending" | "Finalized" = "Active",
  selectedTimeframe: number = 365,
  baseAprParam: number = 10 // APR base real desde la API
) {
  try {
    // Obtener la fecha actual para el inicio del contrato
    const startDate = new Date();
    // Calcular la fecha de finalización basada en el timeframe seleccionado
    const endDate = new Date();
    
    if (selectedTimeframe === 30) {
      endDate.setDate(endDate.getDate() + 30); // 1 mes (30 días)
    } else if (selectedTimeframe === 90) {
      endDate.setDate(endDate.getDate() + 90); // 3 meses (90 días)
    } else {
      endDate.setFullYear(endDate.getFullYear() + 1); // 1 año (365 días)
    }
    
    // Calcular APR ajustado basado en el ancho de rango y timeframe
    const rangeMultiplier = 1 + (5 - Math.ceil(rangeWidth / 10)) * 0.1; // Convertir rangeWidth (porcentaje) a escala 1-5
    
    // El timeframeAdjustments en el momento de crear la posición será obtenido
    // desde el estado actual del componente principal, pasado como parámetro
    const timeframeAdjustmentsParam = window.__currentTimeframeAdjustments || {
      30: -88.56, // 1 mes (valor predeterminado en caso de fallo)
      90: -78.37, // 3 meses (valor predeterminado en caso de fallo)
      365: -69.52  // 1 año (valor predeterminado en caso de fallo)
    };
    const timeframeAdjustment = timeframeAdjustmentsParam[selectedTimeframe] || 0;
    
    // Calcular APR ajustado usando el APR real de la API
    const adjustedApr = baseAprParam * rangeMultiplier * (1 + timeframeAdjustment / 100);
    
    // Crear objeto con los datos de la posición según el esquema de la base de datos
    const positionData = {
      walletAddress: walletAddress.toLowerCase(),
      poolAddress: poolData.address,
      poolName: `${poolData.token0.symbol}/${poolData.token1.symbol}`,
      token0: poolData.token0.symbol,
      token1: poolData.token1.symbol,
      token0Decimals: 18,
      token1Decimals: 18,
      token0Amount: "0",
      token1Amount: "0",
      liquidityAdded: null,
      txHash: txHash,
      depositedUSDC: depositAmount,
      startDate: startDate.toISOString(), // Usar ISO String para fechas
      endDate: endDate.toISOString(),     // Usar ISO String para fechas
      timeframe: selectedTimeframe, // Usar el timeframe seleccionado por el usuario (30, 90 o 365 días)
      status: status, // Valor de enum en la BD: 'Active', 'Pending', 'Finalized'
      apr: adjustedApr.toFixed(2), // Usar el APR calculado dinámicamente
      feesEarned: "0.00", 
      feesCollected: "0",
      lowerPrice: minPrice,
      upperPrice: maxPrice,
      inRange: true,
      rangeWidth: `±${rangeWidth}%`,
      impermanentLossRisk: rangeWidth <= 20 ? "High" : rangeWidth <= 40 ? "Medium" : "Low"
    };
    
    console.log("Creando nueva posición:", positionData);
    
    // Enviar al servidor para crear la posición e indicar que se debe enviar notificación
    const result = await apiRequest('POST', '/api/position-history', positionData, {
      headers: {
        'X-Send-Email-Notification': 'true'
      }
    });
    console.log("Posición creada exitosamente:", result);
    
    return result;
  } catch (error) {
    console.error("Error al crear la posición:", error);
    throw error;
  }
}

// UI Components
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ConnectButton from "@/components/wallet/connect-button";

// Icons
import {
  AlertTriangle,
  Info,
  Wallet,
  Building2,
  Copy,
  CreditCard
} from "lucide-react";

const AddLiquiditySimple: React.FC = () => {
  const { address, setIsModalOpen } = useWallet();
  const { toast } = useToast();
  const { language } = useLanguage();
  const [location] = useLocation();
  
  // Función de traducción para los textos de la página
  const t = (key: keyof typeof addLiquidityTranslations.es): string => {
    const currentLanguage = language as keyof typeof addLiquidityTranslations;
    const translations = addLiquidityTranslations[currentLanguage] || addLiquidityTranslations.en;
    return translations[key] || key;
  };
  
  // Input para USDC
  const [usdcAmount, setUsdcAmount] = useState("");
  
  // Payment dialogs
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [realUsdcTransferDialogOpen, setRealUsdcTransferDialogOpen] = useState(false);
  const [bankTransferDialogOpen, setBankTransferDialogOpen] = useState(false);
  const [paymentMethodDialogOpen, setPaymentMethodDialogOpen] = useState(false);
  const [creditCardDialogOpen, setCreditCardDialogOpen] = useState(false);
  
  // Stripe payment form fields
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  const [cardName, setCardName] = useState("");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [stripeClientSecret, setStripeClientSecret] = useState<string | null>(null);
  
  // Términos y condiciones
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [riskAccepted, setRiskAccepted] = useState(false);
  
  // Estados para errores de validación
  const [showTermsError, setShowTermsError] = useState(false);
  const [showRiskError, setShowRiskError] = useState(false);
  
  // Variables para el simulador de recompensas
  const [baseApr, setBaseApr] = useState(10); // APR base se cargará desde la API
  const [rangeWidth, setRangeWidth] = useState(3); // Ancho de rango (1-5, donde 3 es el valor medio)
  const [timeframe, setTimeframe] = useState(365); // Período en días (30, 90, 365)
  const [timeframeAdjustments, setTimeframeAdjustments] = useState<Record<number, number>>({
    30: -88.56, // 1 mes
    90: -78.37, // 3 meses
    365: -69.52  // 1 año
  });

  // Cargar APR real desde la API de pools
  useEffect(() => {
    const fetchPoolApr = async () => {
      try {
        const response = await fetch("/api/pools/apr");
        if (response.ok) {
          const pools = await response.json();
          // Buscar el pool USDT-ETH (el pool por defecto)
          const usdtEthPool = pools.find((p: any) => p.name === "USDT-ETH");
          if (usdtEthPool && usdtEthPool.apr) {
            setBaseApr(usdtEthPool.apr);
            console.log("[AddLiquidity] APR real cargado:", usdtEthPool.apr);
          }
        }
      } catch (error) {
        console.error("[AddLiquidity] Error cargando APR:", error);
      }
    };
    fetchPoolApr();
  }, []);

  // Leer parámetros de la URL para pre-completar campos desde la calculadora
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    
    // Si viene desde la calculadora, pre-completar todos los campos
    if (urlParams.get('fromCalculator') === 'true') {
      const amount = urlParams.get('amount');
      const pool = urlParams.get('pool');
      const rangeWidthParam = urlParams.get('rangeWidth');
      const timeframeParam = urlParams.get('timeframe');
      const aprParam = urlParams.get('apr');
      const baseAprParam = urlParams.get('baseApr');
      
      if (amount) setUsdcAmount(amount);
      if (rangeWidthParam) setRangeWidth(parseInt(rangeWidthParam));
      if (timeframeParam) setTimeframe(parseInt(timeframeParam));
      if (baseAprParam) setBaseApr(parseFloat(baseAprParam));
      
      // Mostrar mensaje de confirmación
      toast({
        title: "Configuración importada",
        description: `Se han aplicado los parámetros desde la calculadora: ${amount} USDC, ${pool}`,
        variant: "default",
      });
    }
  }, [location, toast]);

  // Cargar ajustes de timeframe desde la API
  useEffect(() => {
    const fetchTimeframeAdjustments = async () => {
      try {
        const adjustmentsData = await apiRequest('GET', '/api/timeframe-adjustments');
        
        // Verificar si los datos son válidos
        if (adjustmentsData && Array.isArray(adjustmentsData)) {
          // Crear un mapa de timeframe -> adjustmentPercentage
          const adjustmentsMap: Record<number, number> = {};
          adjustmentsData.forEach((adjustment: any) => {
            if (adjustment && adjustment.timeframe && adjustment.adjustmentPercentage) {
              adjustmentsMap[adjustment.timeframe] = parseFloat(adjustment.adjustmentPercentage);
            }
          });
          
          // Solo actualizar si hay al menos un dato válido
          if (Object.keys(adjustmentsMap).length > 0) {
            console.log('Ajustes de timeframe cargados:', adjustmentsMap);
            setTimeframeAdjustments(adjustmentsMap);
            
            // Guardar en variable global para que createUserPosition pueda acceder
            window.__currentTimeframeAdjustments = adjustmentsMap;
          }
        } else if (typeof adjustmentsData === 'object' && adjustmentsData !== null) {
          // En caso de que la API devuelva un objeto en lugar de un array
          const adjustmentsMap: Record<number, number> = {};
          
          // Extraer los datos en formato object
          Object.entries(adjustmentsData).forEach(([timeframe, adjustment]) => {
            const timeframeNum = parseInt(timeframe, 10);
            if (!isNaN(timeframeNum) && adjustment !== null && adjustment !== undefined) {
              adjustmentsMap[timeframeNum] = parseFloat(adjustment.toString());
            }
          });
          
          if (Object.keys(adjustmentsMap).length > 0) {
            console.log('Ajustes de timeframe cargados desde objeto:', adjustmentsMap);
            setTimeframeAdjustments(adjustmentsMap);
            
            // Guardar en variable global para que createUserPosition pueda acceder
            window.__currentTimeframeAdjustments = adjustmentsMap;
          }
        }
      } catch (error) {
        console.error('Error al cargar ajustes de timeframe:', error);
        // No modificar valores predeterminados si hay error
        // Usar valores predeterminados en la variable global
        window.__currentTimeframeAdjustments = {
          30: -88.56,
          90: -78.37,
          365: -69.52
        };
      }
    };
    
    fetchTimeframeAdjustments();
  }, []);
  
  // Función para copiar al portapapeles
  const copyToClipboard = (text: string, message: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: t('copied'),
        description: message,
      });
    });
  };
  
  // Verificar aceptación de términos y riesgos
  const checkTermsAndRiskAcceptance = () => {
    let hasErrors = false;
    
    // Verificar términos y condiciones
    if (!termsAccepted) {
      setShowTermsError(true);
      hasErrors = true;
    } else {
      setShowTermsError(false);
    }
    
    // Verificar aceptación de riesgos
    if (!riskAccepted) {
      setShowRiskError(true);
      hasErrors = true;
    } else {
      setShowRiskError(false);
    }
    
    // Si hay errores, mostrar notificación
    if (hasErrors) {
      toast({
        title: t('termsNotAccepted'),
        description: "Debes aceptar los términos y condiciones, así como entender los riesgos asociados.",
        variant: "destructive",
      });
    }
    
    return !hasErrors;
  };
  
  // Mostrar diálogo de selección de método de pago
  const showPaymentDialog = () => {
    if (!address) {
      toast({
        title: t('walletNotConnected'),
        description: t('pleaseConnect'),
        variant: "destructive",
      });
      return;
    }
    
    if (!usdcAmount || parseFloat(usdcAmount) <= 0) {
      toast({
        title: t('invalidAmount'),
        description: "Por favor ingresa un monto válido de USDC.",
        variant: "destructive",
      });
      return;
    }
    
    // Verificar aceptación de términos antes de continuar
    if (!checkTermsAndRiskAcceptance()) {
      return;
    }
    
    setPaymentMethodDialogOpen(true);
  };
  
  // Mostrar diálogo de pago con wallet
  const showWalletPaymentDialog = () => {
    setPaymentMethodDialogOpen(false);
    // Aquí estaba el problema - estábamos usando el mismo diálogo para wallet y tarjeta
    // Vamos a abrir un diálogo específico para wallet
    setRealUsdcTransferDialogOpen(true);
  };
  
  // Mostrar diálogo de transferencia bancaria
  const showBankTransferDialog = () => {
    setPaymentMethodDialogOpen(false);
    setBankTransferDialogOpen(true);
  };
  
  // Mostrar diálogo de pago con tarjeta y crear posición
  const showCreditCardDialog = async () => {
    setPaymentMethodDialogOpen(false);
    
    try {
      const amountInUsd = parseFloat(usdcAmount);
      
      // Validación
      if (!address) {
        toast({
          title: t('walletNotConnected'),
          description: t('pleaseConnect'),
          variant: "destructive",
        });
        return;
      }
      
      if (isNaN(amountInUsd) || amountInUsd <= 0) {
        toast({
          title: t('invalidAmount'),
          description: "Por favor ingresa un monto válido mayor que cero.",
          variant: "destructive",
        });
        return;
      }
      
      toast({
        title: t('processingRequest'),
        description: "Estamos preparando el proceso de pago...",
      });
      
      // 1. Primero creamos la posición en estado pendiente
      const poolDetails = {
        address: "0x4e68ccd3e89f51c3074ca5072bbac773960dfa36", // Pool específica USDT-ETH solicitada
        token0: { symbol: "USDC", address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48" },
        token1: { symbol: "ETH", address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2" }
      };
      
      // Crear la posición pendiente
      const tempTxHash = `pending_${Date.now()}`;
      const positionResult = await createUserPosition(
        tempTxHash,
        poolDetails,
        address,
        usdcAmount,
        rangeWidth * 10,
        "0.32",
        "0.64",
        "Pending",
        timeframe,
        baseApr // APR real desde la API
      );
      
      console.log("Posición inicial creada:", positionResult);
      
      // Verificar que la posición se creó correctamente
      if (!positionResult || !positionResult.id) {
        throw new Error("No se pudo crear la posición en la base de datos");
      }
      
      const newPositionId = positionResult.id;
      
      // 2. Crear intención de pago con Stripe
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          amount: amountInUsd,
          currency: 'usd',
          walletAddress: address,
          description: `Posición #${newPositionId} - ${poolDetails.token0.symbol}/${poolDetails.token1.symbol} - Wallet: ${address}`,
          positionId: newPositionId,
          metadata: {
            positionId: newPositionId,
            positionType: 'liquidity',
            timeframe: timeframe,
            rangeWidth: rangeWidth * 10,
            walletAddress: address
          }
        })
      });
      
      const responseData = await response.json();
      
      if (!responseData.success) {
        throw new Error(responseData.message || "Error al crear la intención de pago");
      }
      
      // 3. Actualizar la posición con el ID de PaymentIntent
      const { paymentIntent } = responseData;
      const stripePaymentId = paymentIntent.id;
      const finalTxHash = `stripe_${stripePaymentId}`;
      
      // Actualizar la posición con el ID definitivo
      await apiRequest('PATCH', `/api/position-history/${newPositionId}`, {
        txHash: finalTxHash,
        payment_intent_id: stripePaymentId,
        payment_status: 'pending'
      });
      
      console.log("Posición actualizada con datos de pago:", {
        positionId: newPositionId,
        paymentIntentId: stripePaymentId,
        txHash: finalTxHash
      });
      
      // 4. Iniciar el formulario de pago
      setStripeClientSecret(paymentIntent.client_secret);
      setPaymentDialogOpen(true);
      
    } catch (error) {
      console.error("Error al iniciar el pago con tarjeta:", error);
      toast({
        title: "Error al iniciar el pago",
        description: error instanceof Error ? error.message : "Hubo un problema al iniciar el proceso de pago",
        variant: "destructive"
      });
    }
  };
  
  // Simulación del proceso de registro por transferencia bancaria
  const processBankTransfer = async () => {
    setBankTransferDialogOpen(false);
    
    if (!address) {
      toast({
        title: "Error de conexión",
        description: t('pleaseConnect'),
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Simulación de creación de posición con transferencia bancaria
      // En un caso real, esto se confirmaría manualmente después de verificar la transferencia
      toast({
        title: t('requestSent'),
        description: "Tu solicitud de transferencia bancaria ha sido registrada. Tu posición será activada una vez confirmado el pago.",
      });
      
      // Simular hash de transacción para registro interno
      const txHash = "bank-" + Math.random().toString(16).substring(2, 10);
      
      // Datos de pool principal predeterminada (USDC/ETH)
      const poolData = {
        address: "0x4e68ccd3e89f51c3074ca5072bbac773960dfa36", // Pool específica USDT-ETH solicitada
        token0: { symbol: "USDC", address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48" },
        token1: { symbol: "ETH", address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2" }
      };
      
      // Crear nueva posición con estado "Pending" hasta confirmar transferencia
      const result = await createUserPosition(
        txHash,
        poolData,
        address || "",
        usdcAmount,
        rangeWidth * 10, // Usar el ancho de rango seleccionado por el usuario (multiplicado por 10 para convertir de 1-5 a porcentaje)
        "0.32", // Precio mínimo predeterminado
        "0.64", // Precio máximo predeterminado
        "Pending", // Estado pendiente hasta confirmar transferencia
        timeframe, // Usar el timeframe seleccionado por el usuario
        baseApr // APR real desde la API
      );
      
      console.log("Contrato en estado pendiente registrado:", result);
      
      // Limpiar el formulario
      setUsdcAmount("");
      setTermsAccepted(false);
      setRiskAccepted(false);
      
    } catch (error) {
      console.error("Error al registrar la solicitud:", error);
      toast({
        title: "Error al registrar solicitud",
        description: "Hubo un problema al registrar tu solicitud de posición.",
        variant: "destructive"
      });
    }
  };
  
  // Procesar el pago con tarjeta de crédito - ahora este método redirige al formulario de Stripe
  const processCreditCardPayment = async () => {
    try {
      setIsProcessingPayment(true);
      
      if (!address) {
        toast({
          title: "Error de conexión",
          description: "Por favor conecta tu wallet para continuar.",
          variant: "destructive",
        });
        setIsProcessingPayment(false);
        return;
      }
      
      // Cerrar diálogo actual e iniciar flujo de Stripe directamente
      setCreditCardDialogOpen(false);
      showCreditCardDialog();
      
    } catch (error) {
      console.error("Error al iniciar el proceso de pago:", error);
      toast({
        title: "Error en el pago",
        description: "No se pudo iniciar el proceso de pago. Por favor, intenta nuevamente.",
        variant: "destructive"
      });
    } finally {
      setIsProcessingPayment(false);
    }
  };
  
  // Procesar el pago con USDC mediante wallet
  // Manejador de transferencia USDC cuando se confirma la transacción
  const handleTransferSuccess = async (txHash: string) => {
    try {
      // Datos de pool principal predeterminada (USDC/ETH)
      const poolData = {
        address: "0x4e68ccd3e89f51c3074ca5072bbac773960dfa36", // Pool específica USDT-ETH solicitada
        token0: { symbol: "USDC", address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48" },
        token1: { symbol: "ETH", address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2" }
      };
      
      // Crear nueva posición con el hash real de la transacción
      const result = await createUserPosition(
        txHash,
        poolData,
        address || "",
        usdcAmount,
        rangeWidth * 10, // Usar el ancho de rango seleccionado por el usuario
        "0.32", // Precio mínimo predeterminado
        "0.64", // Precio máximo predeterminado
        "Active", // Estado activo ya que la transacción fue confirmada en la blockchain
        timeframe, // Usar el timeframe seleccionado por el usuario
        baseApr // APR real desde la API
      );
      
      console.log("Posición creada exitosamente con transacción real:", result);
      
      toast({
        title: "¡Posición creada con éxito!",
        description: "Se ha registrado una nueva posición de liquidez utilizando tu transacción USDC.",
      });
      
      // Limpiar el formulario
      setUsdcAmount("");
      setTermsAccepted(false);
      setRiskAccepted(false);
      
    } catch (error) {
      console.error("Error al crear la posición:", error);
      toast({
        title: "Error al registrar posición",
        description: "La transferencia USDC fue exitosa, pero hubo un problema al registrar tu posición. Contacta a soporte con tu hash de transacción.",
        variant: "destructive"
      });
    }
  };
  
  const processPayment = async () => {
    // Cerrar el diálogo de selección de método
    setPaymentMethodDialogOpen(false);
    
    if (!address) {
      toast({
        title: "Error de conexión",
        description: "Por favor conecta tu wallet para continuar.",
        variant: "destructive",
      });
      return;
    }
    
    // Verificar monto
    if (!usdcAmount || parseFloat(usdcAmount) <= 0) {
      toast({
        title: "Monto inválido",
        description: "Por favor ingresa un monto válido de USDC.",
        variant: "destructive",
      });
      return;
    }
    
    // Abrir el diálogo de transferencia USDC real multi-red
    setRealUsdcTransferDialogOpen(true);
  };

  // Manejo del éxito de transferencia USDC
  const handleUSDCTransferSuccess = async (txHash: string, networkName: string) => {
    try {
      console.log(`💰 Transferencia USDC exitosa: ${txHash} en ${networkName}`);
      
      // Datos de pool principal predeterminada (USDC/ETH)
      const poolData = {
        address: "0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640", // Pool USDC/ETH principal
        token0: { symbol: "USDC", address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48" },
        token1: { symbol: "ETH", address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2" }
      };
      
      // Crear nueva posición con el hash de transacción real
      const result = await createUserPosition(
        txHash,
        poolData,
        address!,
        usdcAmount,
        rangeWidth * 10,
        "0.32", // Precio mínimo predeterminado
        "0.64", // Precio máximo predeterminado
        "Active", // Posición activa ya que el pago se realizó
        timeframe,
        baseApr // APR real desde la API
      );
      
      console.log("✅ Posición creada exitosamente:", result);
      
      toast({
        title: "¡Posición creada exitosamente!",
        description: `Se transfirió ${usdcAmount} USDC desde ${networkName} y se creó tu posición.`,
      });
      
      // Limpiar el formulario
      setUsdcAmount("");
      setTermsAccepted(false);
      setRiskAccepted(false);
      
    } catch (error) {
      console.error("Error al crear la posición:", error);
      toast({
        title: "Error al registrar posición",
        description: "La transferencia fue exitosa pero hubo un problema al registrar tu posición.",
        variant: "destructive"
      });
    }
  };
  
  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex flex-col space-y-6">
        <div>
          <h1 className="text-3xl font-bold">{t('title')}</h1>
          <p className="text-slate-500 dark:text-slate-400">Invest USDC to maximize your earnings in Uniswap v4</p>
        </div>
        
        {/* Diálogo de selección de método de pago */}
        <Dialog open={paymentMethodDialogOpen} onOpenChange={setPaymentMethodDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{t('selectPaymentMethod')}</DialogTitle>
              <DialogDescription>
                {t('choosePaymentMethod')} {formatCurrency(parseFloat(usdcAmount || "0"))} USDC.
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 gap-4 py-4">
              <Button
                variant="outline"
                className="flex items-center justify-start px-4 py-6 h-auto"
                onClick={showWalletPaymentDialog}
              >
                <Wallet className="h-5 w-5 mr-3 text-primary" />
                <div className="text-left">
                  <p className="font-medium">{t('walletPayment')}</p>
                  <p className="text-xs text-slate-500 mt-1">
                    {t('payWithWallet')}
                  </p>
                </div>
              </Button>

              <Button
                variant="outline"
                className="flex items-center justify-start px-4 py-6 h-auto"
                onClick={showBankTransferDialog}
              >
                <Building2 className="h-5 w-5 mr-3 text-primary" />
                <div className="text-left">
                  <p className="font-medium">{t('bankTransfer')}</p>
                  <p className="text-xs text-slate-500 mt-1">
                    Pay via bank transfer to our account.
                  </p>
                </div>
              </Button>
              
              <Button
                variant="outline"
                className="flex items-center justify-start px-4 py-6 h-auto"
                onClick={showCreditCardDialog}
              >
                <CreditCard className="h-5 w-5 mr-3 text-primary" />
                <div className="text-left">
                  <p className="font-medium">{t('creditCardPayment')}</p>
                  <p className="text-xs text-slate-500 mt-1">
                    {t('payWithCreditCard')}
                  </p>
                </div>
              </Button>
            </div>
            <DialogFooter className="sm:justify-end">
              <Button
                variant="secondary"
                onClick={() => setPaymentMethodDialogOpen(false)}
              >
                Cancel
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* RealUSDCTransferDialog para transferencias reales de USDC multi-red */}
        <RealUSDCTransferDialog 
          open={realUsdcTransferDialogOpen} 
          onOpenChange={setRealUsdcTransferDialogOpen}
          amount={usdcAmount}
          onSuccess={handleUSDCTransferSuccess}
        />
        
        {/* Diálogo de pago con Stripe */}
        <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Pago con Tarjeta</DialogTitle>
              <DialogDescription>
                Completa el pago usando tu tarjeta de crédito o débito.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <div className="rounded-md bg-muted p-4 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Monto a pagar:</span>
                  <span className="font-bold">${parseFloat(usdcAmount).toFixed(2)} USD</span>
                </div>
              </div>
              
              {/* Formulario de pago de Stripe */}
              {stripeClientSecret && (
                <StripePaymentForm
                  clientSecret={stripeClientSecret}
                  amount={parseFloat(usdcAmount)}
                  onPaymentSuccess={() => {
                    // Cuando el pago sea exitoso, cerrar el diálogo
                    setPaymentDialogOpen(false);
                    toast({
                      title: "Pago procesado con éxito",
                      description: "Tu posición ha sido creada y será activada en breve.",
                    });
                    // Limpiar formulario
                    setUsdcAmount("");
                    setTermsAccepted(false);
                    setRiskAccepted(false);
                    setStripeClientSecret(null);
                  }}
                  onError={(error) => {
                    console.error("Error en el pago de Stripe:", error);
                    toast({
                      title: "Error en el pago",
                      description: error || "No se pudo procesar el pago. Por favor, intenta nuevamente.",
                      variant: "destructive"
                    });
                  }}
                  onCancel={() => {
                    setPaymentDialogOpen(false);
                    setStripeClientSecret(null);
                  }}
                />
              )}
            </div>
            <DialogFooter className="flex justify-end">
              <Button
                variant="secondary"
                onClick={() => {
                  setPaymentDialogOpen(false);
                  setStripeClientSecret(null);
                }}
              >
                Cancelar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Diálogo de transferencia bancaria */}
        <Dialog open={bankTransferDialogOpen} onOpenChange={setBankTransferDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{t('bankTransfer')}</DialogTitle>
              <DialogDescription>
                {t('bankTransferInstructions')}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <p className="text-sm font-medium">Bank:</p>
                <p>Banco Santander</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Account Holder:</p>
                <p>WayBank Technologies Ltd.</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">IBAN:</p>
                <div className="flex items-center">
                  <code className="bg-muted px-3 py-2 rounded text-sm flex-1">
                    ES91 0049 1500 0512 3456 7890
                  </code>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="ml-2"
                    onClick={() => copyToClipboard("ES91 0049 1500 0512 3456 7890", "IBAN copiado")}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">BIC/SWIFT:</p>
                <div className="flex items-center">
                  <code className="bg-muted px-3 py-2 rounded text-sm flex-1">
                    BSCHESMMXXX
                  </code>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="ml-2"
                    onClick={() => copyToClipboard("BSCHESMMXXX", "SWIFT copiado")}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Amount:</p>
                <p>{formatCurrency(parseFloat(usdcAmount || "0"))}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Reference/Concept:</p>
                <div className="flex items-center">
                  <code className="bg-muted px-3 py-2 rounded text-sm flex-1">
                    WAY-{address?.substring(0, 8).toUpperCase()}
                  </code>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="ml-2"
                    onClick={() => copyToClipboard(`WAY-${address?.substring(0, 8).toUpperCase()}`, "Reference copied")}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded p-3">
                <div className="flex">
                  <Info className="h-5 w-5 text-amber-500 mr-2" />
                  <div className="text-xs text-amber-800 dark:text-amber-300">
                    <p>
                      Important: Include the reference exactly as shown so we can identify your payment. Your position will be manually activated after verifying the transfer.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter className="flex flex-col sm:flex-row gap-2">
              <Button
                variant="secondary"
                onClick={() => setBankTransferDialogOpen(false)}
                className="sm:flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={processBankTransfer}
                className="sm:flex-1"
              >
                I've Made the Transfer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Diálogo de pago con tarjeta de crédito */}
        <Dialog open={creditCardDialogOpen} onOpenChange={setCreditCardDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Card Payment</DialogTitle>
              <DialogDescription>
                Enter your card details to complete the payment
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="rounded-md bg-muted p-4 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Monto a pagar:</span>
                  <span className="font-bold">${parseFloat(usdcAmount).toFixed(2)} USD</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="card-name">Name on card</Label>
                <Input
                  id="card-name"
                  placeholder="Como aparece en la tarjeta"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="card-number">Card number</Label>
                <Input
                  id="card-number"
                  placeholder="1234 5678 9012 3456"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiry">Expiry date</Label>
                  <Input
                    id="expiry"
                    placeholder="MM/AA"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cvc">CVC</Label>
                  <Input
                    id="cvc"
                    placeholder="123"
                    value={cardCvc}
                    onChange={(e) => setCardCvc(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setCreditCardDialogOpen(false)}
                disabled={isProcessingPayment}
              >
                Cancel
              </Button>
              <Button 
                type="button"
                onClick={processCreditCardPayment}
                disabled={!cardName || !cardNumber || !cardExpiry || !cardCvc || isProcessingPayment}
              >
                {isProcessingPayment ? (
                  <>
                    <svg className="mr-2 h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  "Pay now"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {!address ? (
          <div className="mt-8 mb-8 bg-[#0b101e] overflow-hidden rounded-lg p-5">
            <div className="flex mb-8 justify-end">
              <div className="bg-[#19203b] px-4 py-2 rounded-lg flex items-center justify-between gap-4">
                <span className="text-sm text-gray-300">Connect wallet to access your positions</span>
                <Button 
                  className="bg-indigo-600 hover:bg-indigo-500"
                  onClick={() => setIsModalOpen(true)}
                >
                  Connect Wallet
                </Button>
              </div>
            </div>
            <div className="clear-both"></div>
            
            {/* Secure Connection Section */}
            <div className="mb-6">
              <div className="flex items-center mb-3 gap-3">
                <div className="bg-[#19203b] p-2 rounded-lg">
                  <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white">Secure Connection</h3>
                <div className="ml-auto flex items-center gap-2 text-xs text-green-400">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  All connections are encrypted and audited
                </div>
              </div>
              <p className="text-[#8a9fc0] ml-11">
                Connect your blockchain wallet securely to access advanced liquidity management and trading features.
              </p>
            </div>
            
            {/* WalletConnect Section */}
            <div className="mb-6 flex">
              <div className="w-3/4 pr-6">
                <div className="flex items-center mb-3 gap-3">
                  <div className="bg-[#19203b] p-2 rounded-lg">
                    <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white">WalletConnect</h3>
                </div>
                <p className="text-[#8a9fc0] ml-11 mb-5">
                  Universal multi-wallet connection compatible with all major blockchain wallets.
                </p>
                
                {/* Security Features */}
                <div className="ml-11 mb-3 flex items-start gap-3">
                  <div className="mt-1 p-1 bg-[#19203b] rounded-full">
                    <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-white font-medium">Military-grade security</h4>
                    <p className="text-[#8a9fc0] text-sm">E2E encrypted connections using the highest cryptographic standards. Private keys never leave your device.</p>
                  </div>
                </div>
                
                {/* Compatibility */}
                <div className="ml-11 mb-3 flex items-start gap-3">
                  <div className="mt-1 p-1 bg-[#19203b] rounded-full">
                    <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-white font-medium">Compatible with +170 wallets</h4>
                    <p className="text-[#8a9fc0] text-sm">MetaMask, Coinbase Wallet, Trust Wallet, Ledger, Trezor, Rainbow and many more supported wallets.</p>
                  </div>
                </div>
                
                {/* Mobile and Desktop */}
                <div className="ml-11 mb-3 flex items-start gap-3">
                  <div className="mt-1 p-1 bg-[#19203b] rounded-full">
                    <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-white font-medium">Mobile and desktop connection</h4>
                    <p className="text-[#8a9fc0] text-sm">QR code scanning for mobile wallets and direct connection for browser extensions.</p>
                  </div>
                </div>
              </div>
              
              {/* Connect Wallet Box */}
              <div className="w-1/4">
                <div className="bg-[#19203b] rounded-lg p-6 flex flex-col items-center">
                  <div className="mb-6 w-14 h-14 bg-[#232c45] rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <h3 className="text-white text-lg font-medium mb-4">Connect Wallet</h3>
                  <Button
                    size="lg"
                    onClick={() => setIsModalOpen(true)}
                    className="w-full bg-indigo-600 hover:bg-indigo-500 text-white"
                  >
                    Connect
                  </Button>
                  <p className="text-[#8a9fc0] text-xs mt-4 text-center">
                    By connecting your wallet, you agree to our <a href="/terms-of-use" className="text-indigo-400 hover:underline">Terms of Service</a>
                  </p>
                </div>
              </div>
            </div>
            
            {/* Security Information */}
            <div className="border-t border-gray-800 pt-6">
              <div className="flex items-center mb-4 gap-2">
                <div className="text-indigo-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-white">Security Information</h3>
              </div>
              
              <div className="grid grid-cols-3 gap-6">
                <div className="flex items-start gap-2">
                  <div className="mt-1 p-0.5 bg-[#19203b] rounded-full">
                    <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-white text-sm font-medium">We never store your private keys.</h4>
                    <p className="text-[#8a9fc0] text-xs">All credentials are kept exclusively on your device and authentication is performed using secure cryptographic signatures.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <div className="mt-1 p-0.5 bg-[#19203b] rounded-full">
                    <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-white text-sm font-medium">Verifiable and audited connections.</h4>
                    <p className="text-[#8a9fc0] text-xs">Our wallet connection code is fully audited by cybersecurity firms and uses industry standard protocols.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <div className="mt-1 p-0.5 bg-[#19203b] rounded-full">
                    <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-white text-sm font-medium">Complete control over transactions.</h4>
                    <p className="text-[#8a9fc0] text-xs">Each transaction requires your explicit approval and you can review all details before confirming any operation.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>{t('addLiquidityWithUsdc')}</CardTitle>
                  <CardDescription>
                    {t('enterUsdcAmount')}
                  </CardDescription>
                  <div className="mt-2 p-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-900/30 rounded-lg border border-green-100 dark:border-green-800">
                    <div className="flex items-start">
                      <div className="mr-2 mt-0.5 text-green-600 dark:text-green-400 flex-shrink-0">
                        <Info className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-green-800 dark:text-green-300">
                          {language === 'es' ? 'Beneficios del Interés Compuesto' : 
                           language === 'fr' ? 'Avantages des Intérêts Composés' : 
                           language === 'de' ? 'Vorteile des Zinseszins' : 
                           'Compound Interest Benefits'}
                        </h4>
                        <p className="text-xs text-green-700 dark:text-green-400 mt-1">
                          {language === 'es' ? 'Sus posiciones se renuevan automáticamente después de 24 horas al finalizar el período, maximizando sus rendimientos a través del interés compuesto y garantizando que no pierda oportunidades de generación de beneficios.' : 
                           language === 'fr' ? 'Vos positions sont automatiquement renouvelées 24 heures après la fin de la période, maximisant vos rendements grâce aux intérêts composés et garantissant que vous ne manquez pas d\'opportunités de génération de profits.' : 
                           language === 'de' ? 'Ihre Positionen werden nach 24 Stunden am Ende der Periode automatisch verlängert, maximieren Ihre Rendite durch Zinseszins und stellen sicher, dass Sie keine Gewinnchancen verpassen.' : 
                           'Your positions automatically renew after 24 hours when the period ends, maximizing your yields through compound interest and ensuring you don\'t miss out on profit-generating opportunities.'}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Campo único para USDC */}
                  <div className="space-y-6 mb-6">
                    <div>
                      <Label htmlFor="usdc-amount" className="mb-2 block">
                        {t('amountUsdcLabel')}
                      </Label>
                      <div className="flex">
                        <Input
                          id="usdc-amount"
                          type="number"
                          placeholder={t('amountPlaceholder')}
                          value={usdcAmount}
                          onChange={(e) => setUsdcAmount(e.target.value)}
                          className="rounded-r-none"
                        />
                        <Button
                          variant="outline"
                          className="rounded-l-none"
                          type="button"
                        >
                          USDC
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Términos y condiciones */}
                  <div className="space-y-4 mt-6">
                    <div className={`flex items-center space-x-2 ${showTermsError ? 'p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md' : ''}`}>
                      <Checkbox 
                        id="terms" 
                        checked={termsAccepted}
                        onCheckedChange={(checked) => {
                          setTermsAccepted(checked === true);
                          if (checked === true) setShowTermsError(false);
                        }}
                      />
                      <label
                        htmlFor="terms"
                        className={`text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${showTermsError ? 'text-red-600 dark:text-red-400 font-medium' : ''}`}
                      >
                        {t('iAcceptTerms')} <a href="/terms-of-use" className="text-blue-500 hover:underline">{t('termsAndConditions')}</a>
                      </label>
                    </div>
                    {showTermsError && (
                      <div className="text-xs text-red-600 dark:text-red-400 ml-6">
                        You must accept the terms and conditions to continue
                      </div>
                    )}
                    
                    <div className={`flex items-center space-x-2 ${showRiskError ? 'p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md' : ''}`}>
                      <Checkbox 
                        id="risk" 
                        checked={riskAccepted}
                        onCheckedChange={(checked) => {
                          setRiskAccepted(checked === true);
                          if (checked === true) setShowRiskError(false);
                        }}
                      />
                      <label
                        htmlFor="risk"
                        className={`text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${showRiskError ? 'text-red-600 dark:text-red-400 font-medium' : ''}`}
                      >
                        {t('iUnderstandRisks')} <a href="https://waybank.info/disclaimer" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{t('riskDisclaimer')}</a>
                      </label>
                    </div>
                    {showRiskError && (
                      <div className="text-xs text-red-600 dark:text-red-400 ml-6">
                        You must acknowledge that you understand the risks to continue
                      </div>
                    )}
                  </div>

                  {/* Botón de acción */}
                  <Button
                    className="w-full mt-6"
                    size="lg"
                    disabled={!termsAccepted || !riskAccepted || !usdcAmount || parseFloat(usdcAmount) <= 0}
                    onClick={showPaymentDialog}
                  >
                    {t('addLiquidityButton')}
                  </Button>

                  {/* Avisos legales */}
                  <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3 mt-6">
                    <div className="flex">
                      <AlertTriangle className="h-5 w-5 text-amber-500 mr-2 flex-shrink-0" />
                      <div className="text-xs text-amber-800 dark:text-amber-300">
                        <p className="font-medium mb-1">
                          {language === 'es' ? 'Aviso de Riesgo' : 
                           language === 'fr' ? 'Avis de Risque' : 
                           language === 'de' ? 'Risikohinweis' : 
                           'Risk Notice'}
                        </p>
                        <p>
                          {language === 'es' ? 
                            'Al proporcionar liquidez, quedas expuesto a pérdidas impermanentes y otros riesgos asociados con los mercados de criptomonedas y pools de liquidez automatizados. Asegúrate de entender completamente estas implicaciones antes de continuar.' : 
                           language === 'fr' ? 
                            'En fournissant de la liquidité, vous êtes exposé à des pertes impermanentes et à d\'autres risques associés aux marchés des cryptomonnaies et aux pools de liquidité automatisés. Assurez-vous de bien comprendre ces implications avant de continuer.' : 
                           language === 'de' ? 
                            'Durch die Bereitstellung von Liquidität sind Sie unbeständigen Verlusten und anderen Risiken ausgesetzt, die mit Kryptowährungsmärkten und automatisierten Liquiditätspools verbunden sind. Stellen Sie sicher, dass Sie diese Auswirkungen vollständig verstehen, bevor Sie fortfahren.' : 
                            'By providing liquidity, you are exposed to impermanent loss and other risks associated with cryptocurrency markets and automated liquidity pools. Be sure to fully understand these implications before proceeding.'}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Panel lateral con información */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>{t('operationSummary')}</CardTitle>
                  <CardDescription>
                    Details of your investment
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {usdcAmount && parseFloat(usdcAmount) > 0 ? (
                    <div className="space-y-4">
                      <div>
                        <div className="text-sm text-slate-500 mb-1">Pool</div>
                        <div className="font-medium">
                          USDC / ETH (Default pool)
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-slate-500 mb-1">Total Amount</div>
                        <div className="font-medium">
                          {formatCurrency(parseFloat(usdcAmount))}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-slate-500 mb-1">Estimated APR</div>
                        <div className="font-medium text-green-600">
                          {(() => {
                            // Calculate adjusted APR based on range width and timeframe
                            const rangeMultiplier = 1 + (5 - rangeWidth) * 0.1;
                            const timeframeAdjustment = timeframeAdjustments[timeframe] || 0;
                            const adjustedApr = baseApr * rangeMultiplier * (1 + timeframeAdjustment / 100);
                            return `${formatNumber(adjustedApr)}% (estimated)`;
                          })()}
                        </div>
                        <div className="text-xs text-slate-500 mt-1">
                          With {timeframeAdjustments[timeframe] || 0}% adjustment for {timeframe === 30 ? '1 month' : timeframe === 90 ? '3 months' : '1 year'}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-slate-500 mb-1">Estimated Earnings</div>
                        <div className="font-medium text-green-600">
                          {(() => {
                            // Calculate adjusted APR
                            const rangeMultiplier = 1 + (5 - rangeWidth) * 0.1;
                            const timeframeAdjustment = timeframeAdjustments[timeframe] || 0;
                            const adjustedApr = baseApr * rangeMultiplier * (1 + timeframeAdjustment / 100);
                            
                            // Calculate earnings based on amount, adjusted APR, and timeframe
                            const amount = parseFloat(usdcAmount);
                            const earnings = calculatePotentialRewards(amount, adjustedApr, timeframe);
                            return formatCurrency(earnings);
                          })()}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-slate-500 mb-1">{t('timeframeLabel')}</div>
                        <div className="grid grid-cols-3 gap-2 mt-2">
                          <Button
                            variant={timeframe === 30 ? "default" : "outline"}
                            size="sm"
                            onClick={() => setTimeframe(30)}
                          >
                            {t('timeframe30Days')}
                          </Button>
                          <Button
                            variant={timeframe === 90 ? "default" : "outline"}
                            size="sm"
                            onClick={() => setTimeframe(90)}
                          >
                            {t('timeframe90Days')}
                          </Button>
                          <Button
                            variant={timeframe === 365 ? "default" : "outline"}
                            size="sm"
                            onClick={() => setTimeframe(365)}
                          >
                            {t('timeframe365Days')}
                          </Button>
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-slate-500 mb-1">{t('rangeWidthLabel')}</div>
                        <div className="mb-2 flex justify-between text-xs text-slate-500 dark:text-slate-400">
                          <span>{t('rangeWidthDescriptionNarrow')}</span>
                          <span>{t('rangeWidthDescriptionWide')}</span>
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
                          {["±10%", "±20%", "±30%", "±40%", "±50%"].map((label, i) => (
                            <span key={i}>{label}</span>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-sm text-slate-500 mb-1">Impermanent Loss Risk</div>
                        <div className="font-medium text-yellow-500">
                          {rangeWidth <= 2 ? 'High' : rangeWidth === 3 ? 'Medium' : 'Low'}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-slate-500 mb-1">Payment Methods</div>
                        <div>
                          <div className="flex flex-col space-y-2 mt-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="justify-start"
                              onClick={() => {
                                // Verify terms acceptance before opening dialog
                                if (checkTermsAndRiskAcceptance()) {
                                  setPaymentMethodDialogOpen(true);
                                }
                              }}
                            >
                              <CreditCard className="h-4 w-4 mr-2" />
                              {t('selectPaymentMethod')}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center p-4">
                      <p className="text-slate-500 dark:text-slate-400">
                        {t('amountPlaceholder')}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
      {/* Bank Transfer Dialog */}
      <Dialog open={bankTransferDialogOpen} onOpenChange={setBankTransferDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t('bankTransfer')}</DialogTitle>
            <DialogDescription>
              {t('bankTransferInstructions')}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="rounded-md border p-4">
              <div className="space-y-3">
                <div className="space-y-1 mb-3">
                  <div className="text-xs font-medium text-slate-500 dark:text-slate-400">{t('accountDetails')}</div>
                  <div className="font-semibold">ELYSIUM MEDIA - FZCO</div>
                </div>
                
                <div className="flex justify-between items-start mb-3">
                  <div className="space-y-1">
                    <div className="text-xs font-medium text-slate-500 dark:text-slate-400">IBAN</div>
                    <div className="font-semibold overflow-hidden text-ellipsis">AE590860000009839365601</div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6 flex-shrink-0 mt-3"
                    onClick={() => copyToClipboard("AE590860000009839365601", t('ibanCopied'))}
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </Button>
                </div>
                
                <div className="flex justify-between items-start mb-3">
                  <div className="space-y-1">
                    <div className="text-xs font-medium text-slate-500 dark:text-slate-400">BIC</div>
                    <div className="font-semibold">WIOBAEADXXX</div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6 flex-shrink-0 mt-3"
                    onClick={() => copyToClipboard("WIOBAEADXXX", t('bicCopied'))}
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </Button>
                </div>
                
                <div className="space-y-1 mb-3">
                  <div className="text-xs font-medium text-slate-500 dark:text-slate-400">{t('address')}</div>
                  <div className="text-sm">Etihad Airways Centre 5th Floor, Abu Dhabi, UAE</div>
                </div>
                
                <div className="flex justify-between items-start mb-3">
                  <div className="space-y-1">
                    <div className="text-xs font-medium text-slate-500 dark:text-slate-400">{t('reference')}</div>
                    <div className="font-semibold">
                      {address ? address.substring(0, 8) : t('connectWallet')}
                    </div>
                  </div>
                  {address && (
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6 flex-shrink-0 mt-3"
                      onClick={() => copyToClipboard(address.substring(0, 8), t('referenceCopied'))}
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>
                
                <div className="space-y-1">
                  <div className="text-xs font-medium text-slate-500 dark:text-slate-400">{t('amount')}</div>
                  <div className="font-semibold">{formatCurrency(parseFloat(usdcAmount || "0"))}</div>
                </div>
              </div>
            </div>
            
            <div className="rounded-md bg-amber-50 dark:bg-amber-900/20 p-4 text-sm text-amber-800 dark:text-amber-300">
              <p className="flex items-start">
                <AlertTriangle className="h-4 w-4 mr-2 mt-0.5 text-amber-500 flex-shrink-0" />
                <span>
                  <strong className="font-medium">{t('important')}</strong>: {t('walletReferenceWarning')}
                </span>
              </p>
            </div>
          </div>
          <DialogFooter className="flex flex-col sm:flex-row gap-3">
            <Button
              type="button"
              variant="secondary"
              className="sm:w-auto w-full"
              onClick={() => setBankTransferDialogOpen(false)}
            >
              {t('cancel')}
            </Button>
            <Button
              type="button"
              className="sm:w-auto w-full"
              onClick={processBankTransfer}
            >
              {t('transferMade')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Wallet connection modal */}
      <ConnectModal />
    </div>
  );
};

export default AddLiquiditySimple;