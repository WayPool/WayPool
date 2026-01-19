import React, { useState, useEffect } from 'react';
import { StripePaymentForm } from '@/components/payments/stripe-payment-form';
import { useWallet } from '@/hooks/use-wallet';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';

interface StripePaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  amount: number;
  onSuccess?: () => void;
}

export default function StripePaymentDialog({
  open,
  onOpenChange,
  amount,
  onSuccess
}: StripePaymentDialogProps) {
  const { address } = useWallet();
  const { toast } = useToast();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [positionId, setPositionId] = useState<number | null>(null);

  // Efectos para obtener el clientSecret cuando se abre el diálogo
  useEffect(() => {
    if (open && address && amount > 0) {
      createPaymentIntent();
    }
  }, [open, address, amount]);

  const createPaymentIntent = async () => {
    if (!address || amount <= 0) return;
    
    setProcessing(true);
    
    try {
      // 1. Primero creamos una posición pendiente
      const poolDetails = {
        address: "0x4e68ccd3e89f51c3074ca5072bbac773960dfa36", // Usando el pool predeterminado
        token0: { symbol: "USDC", address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48" },
        token1: { symbol: "ETH", address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2" }
      };
      
      // Crear posición pendiente
      const tempTxHash = `pending_${Date.now()}`;
      const rangeWidth = 30; // Ancho de rango predeterminado
      const timeframe = 365; // Periodo predeterminado
      
      const positionData = {
        walletAddress: address.toLowerCase(),
        poolAddress: poolDetails.address,
        poolName: `${poolDetails.token0.symbol}/${poolDetails.token1.symbol}`,
        token0: poolDetails.token0.symbol,
        token1: poolDetails.token1.symbol,
        token0Decimals: 18,
        token1Decimals: 18,
        token0Amount: "0",
        token1Amount: "0",
        liquidityAdded: null,
        txHash: tempTxHash,
        depositedUSDC: amount.toString(),
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        timeframe: timeframe,
        status: "Pending",
        apr: "61.64",
        feesEarned: "0.00",
        feesCollected: "0",
        lowerPrice: "0.32",
        upperPrice: "0.64",
        inRange: true,
        rangeWidth: `±${rangeWidth}%`,
        impermanentLossRisk: rangeWidth <= 20 ? "High" : rangeWidth <= 40 ? "Medium" : "Low"
      };
      
      // Crear posición en la base de datos
      const positionResult = await apiRequest('POST', '/api/position-history', positionData);
      
      if (!positionResult || !positionResult.id) {
        throw new Error("No se pudo crear la posición en la base de datos");
      }
      
      setPositionId(positionResult.id);
      
      // 2. Crear intención de pago con Stripe
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          amount: amount,
          currency: 'usd',
          walletAddress: address,
          description: `Posición #${positionResult.id} - ${poolDetails.token0.symbol}/${poolDetails.token1.symbol} - Wallet: ${address}`,
          positionId: positionResult.id,
          metadata: {
            positionId: positionResult.id,
            positionType: 'liquidity',
            timeframe: timeframe,
            rangeWidth: rangeWidth,
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
      await apiRequest('PATCH', `/api/position-history/${positionResult.id}`, {
        txHash: finalTxHash,
        payment_intent_id: stripePaymentId,
        payment_status: 'pending'
      });
      
      // 4. Establecer el clientSecret para el formulario de Stripe
      setClientSecret(paymentIntent.client_secret);
      
    } catch (error) {
      toast({
        title: "Error al iniciar el pago",
        description: error instanceof Error ? error.message : "Hubo un problema al iniciar el proceso de pago",
        variant: "destructive"
      });
      onOpenChange(false);
    } finally {
      setProcessing(false);
    }
  };

  const handlePaymentSuccess = async () => {
    toast({
      title: "Pago completado",
      description: "Su pago ha sido procesado correctamente. La posición será activada pronto.",
    });
    
    if (positionId) {
      try {
        // Actualizar el estado de la posición a activa
        await apiRequest('PATCH', `/api/position-history/${positionId}`, {
          status: 'Active',
          payment_status: 'completed'
        });
      } catch (error) {
        console.error("Error al actualizar la posición:", error);
      }
    }
    
    if (onSuccess) {
      onSuccess();
    }
    
    onOpenChange(false);
  };

  const handleClose = () => {
    if (processing) return; // No permitir cerrar mientras se está procesando
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden">
        {clientSecret ? (
          <StripePaymentForm 
            amount={amount} 
            clientSecret={clientSecret}
            onSuccess={handlePaymentSuccess}
            onCancel={() => onOpenChange(false)}
          />
        ) : (
          <div className="p-6">
            <div className="text-center">
              <div className="mb-4">
                <div className="animate-spin inline-block w-8 h-8 border-[3px] border-current border-t-transparent text-primary rounded-full" aria-hidden="true"></div>
              </div>
              <h3 className="text-lg font-medium">Preparando el pago...</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                Estamos configurando su pago con Stripe. Esto puede tomar unos momentos.
              </p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}