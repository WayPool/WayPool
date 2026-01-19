import { useState } from 'react';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

/**
 * Hook para gestionar el procesamiento de pagos con Stripe
 */
export function useStripePayment() {
  const [isLoading, setIsLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const { toast } = useToast();

  /**
   * Crear un intento de pago en Stripe
   * @param amount - El monto a pagar en dólares
   * @param currency - La moneda (por defecto USD)
   */
  const createPaymentIntent = async (amount: number, currency: string = 'usd') => {
    try {
      setIsLoading(true);
      
      // Llamar al endpoint en el servidor para crear el intento de pago
      const response = await apiRequest('POST', '/api/create-payment-intent', {
        amount,
        currency
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al crear el intento de pago');
      }
      
      const data = await response.json();
      setClientSecret(data.clientSecret);
      
      return data.clientSecret;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      
      toast({
        title: 'Error al iniciar el pago',
        description: errorMessage,
        variant: 'destructive',
      });
      
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const resetClientSecret = () => {
    setClientSecret(null);
  };

  return {
    isLoading,
    clientSecret,
    createPaymentIntent,
    resetClientSecret
  };
}