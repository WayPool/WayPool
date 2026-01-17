import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CreditCard, DollarSign } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import UsdcTransferDialog from './usdc-transfer-dialog';
import { StripePaymentForm } from '@/components/payments/stripe-payment-form';

interface PaymentMethodSelectorProps {
  amount: number;
  onSuccess?: (txHash?: string) => void;
  showStripe?: boolean;
  showCrypto?: boolean;
  title?: string;
  description?: string;
}

export default function PaymentMethodSelector({
  amount,
  onSuccess,
  showStripe = true,
  showCrypto = true,
  title = "Seleccionar método de pago",
  description = "Elija el método de pago que prefiera para continuar."
}: PaymentMethodSelectorProps) {
  const [selectedMethod, setSelectedMethod] = useState<'stripe' | 'crypto' | null>(null);
  const [isStripeDialogOpen, setIsStripeDialogOpen] = useState(false);
  const [isCryptoDialogOpen, setIsCryptoDialogOpen] = useState(false);

  const handleSelectMethod = (method: 'stripe' | 'crypto') => {
    setSelectedMethod(method);
    
    if (method === 'stripe') {
      setIsStripeDialogOpen(true);
    } else if (method === 'crypto') {
      setIsCryptoDialogOpen(true);
    }
  };

  const handleStripeSuccess = () => {
    if (onSuccess) onSuccess();
    setIsStripeDialogOpen(false);
  };

  const handleCryptoSuccess = (txHash: string) => {
    if (onSuccess) onSuccess(txHash);
    setIsCryptoDialogOpen(false);
  };

  return (
    <>
      <div className="space-y-4">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold">{title}</h2>
          <p className="text-slate-500 dark:text-slate-400">{description}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {showStripe && (
            <Card 
              className={`cursor-pointer transition-all hover:border-primary/50 ${selectedMethod === 'stripe' ? 'border-primary/70 dark:border-primary/70 ring-1 ring-primary/30' : ''}`}
              onClick={() => handleSelectMethod('stripe')}
            >
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="bg-primary/10 p-3 rounded-full mb-4">
                  <CreditCard className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Tarjeta de crédito/débito</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                  Pague de manera segura con su tarjeta de crédito o débito a través de Stripe.
                </p>
                <Button variant="outline" size="sm">
                  Seleccionar
                </Button>
              </CardContent>
            </Card>
          )}

          {showCrypto && (
            <Card 
              className={`cursor-pointer transition-all hover:border-primary/50 ${selectedMethod === 'crypto' ? 'border-primary/70 dark:border-primary/70 ring-1 ring-primary/30' : ''}`}
              onClick={() => handleSelectMethod('crypto')}
            >
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="bg-primary/10 p-3 rounded-full mb-4">
                  <DollarSign className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Pago con USDC</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                  Pague con USDC directamente desde su wallet conectada.
                </p>
                <Button variant="outline" size="sm">
                  Seleccionar
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Diálogo para pago con Stripe */}
      {showStripe && isStripeDialogOpen && (
        <Dialog open={isStripeDialogOpen} onOpenChange={setIsStripeDialogOpen}>
          <DialogContent className="sm:max-w-md p-0 overflow-hidden">
            <StripePaymentForm 
              amount={amount}
              clientSecret=""
              onSuccess={handleStripeSuccess}
              onCancel={() => setIsStripeDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* Diálogo para pago con USDC */}
      {showCrypto && (
        <UsdcTransferDialog
          open={isCryptoDialogOpen}
          onOpenChange={setIsCryptoDialogOpen}
          amount={amount.toString()}
          onSuccess={handleCryptoSuccess}
        />
      )}
    </>
  );
}