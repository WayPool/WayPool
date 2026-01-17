import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';

declare global {
  interface Window {
    Stripe?: (apiKey: string) => any;
  }
}

interface StripePaymentFormProps {
  clientSecret: string | null;
  amount?: number;
  onPaymentSuccess?: () => void;
  onCancel?: () => void;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export function StripePaymentForm({ 
  clientSecret, 
  amount = 100.00,
  onPaymentSuccess,
  onCancel,
  onSuccess,
  onError
}: StripePaymentFormProps) {
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [stripeLoaded, setStripeLoaded] = useState(false);
  const [stripe, setStripe] = useState<any>(null);
  const [cardNumberElement, setCardNumberElement] = useState<any>(null);
  const [cardExpiryElement, setCardExpiryElement] = useState<any>(null);
  const [cardCvcElement, setCardCvcElement] = useState<any>(null);
  const [elements, setElements] = useState<any>(null);
  const { toast } = useToast();

  // Cargar el script de Stripe si no está cargado
  useEffect(() => {
    // Comprobar si el script ya está cargado
    const stripeScript = document.getElementById('stripe-js');
    const stripeKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY;
    
    console.log('Stripe initialization - Public Key available:', !!stripeKey);
    
    if (!stripeScript && stripeKey) {
      // Si no está cargado, crear un script y agregarlo al head
      console.log('Loading Stripe script dynamically');
      const script = document.createElement('script');
      script.id = 'stripe-js';
      script.src = 'https://js.stripe.com/v3/';
      script.async = true;
      
      script.onload = () => {
        console.log('Stripe script loaded successfully');
        // Inicializar Stripe una vez que se carga el script
        if (window.Stripe) {
          try {
            const stripeInstance = window.Stripe(stripeKey);
            console.log('Stripe instance created successfully');
            setStripe(stripeInstance);
            setStripeLoaded(true);
          } catch (error) {
            console.error('Error initializing Stripe:', error);
            setErrorMessage('Error al inicializar el procesador de pagos');
            setPaymentStatus('error');
          }
        } else {
          console.error('window.Stripe not available after script load');
          setErrorMessage('Error: La biblioteca Stripe no está disponible');
          setPaymentStatus('error');
        }
      };
      
      script.onerror = () => {
        console.error('Failed to load Stripe script');
        setErrorMessage('Error al cargar el procesador de pagos');
        setPaymentStatus('error');
      };
      
      document.head.appendChild(script);
    } else if (stripeKey) {
      // Si ya está cargado, inicializar Stripe
      console.log('Stripe script already loaded, initializing directly');
      if (window.Stripe) {
        try {
          const stripeInstance = window.Stripe(stripeKey);
          console.log('Stripe instance created successfully');
          setStripe(stripeInstance);
          setStripeLoaded(true);
        } catch (error) {
          console.error('Error initializing Stripe:', error);
          setErrorMessage('Error al inicializar el procesador de pagos');
          setPaymentStatus('error');
        }
      } else {
        console.error('window.Stripe not available despite script being loaded');
        setErrorMessage('Error: La biblioteca Stripe no está disponible');
        setPaymentStatus('error');
      }
    } else {
      // No hay clave API de Stripe, usar modo simulación
      console.warn('No Stripe key available, using simulation mode');
      // Simular que Stripe está cargado
      setTimeout(() => {
        console.log('Simulated Stripe loaded');
        setStripeLoaded(true);
        setStripe({ simulationMode: true });
      }, 1500);
    }
    
    return () => {
      // No eliminamos el script ya que otros componentes podrían usarlo
    };
  }, []);

  // Cargar los elementos de tarjeta una vez que Stripe esté disponible
  useEffect(() => {
    if (stripe && clientSecret) {
      // Si estamos en modo simulación, no necesitamos crear elementos
      if (stripe.simulationMode) {
        return;
      }
      
      try {
        console.log('Creando elementos individuales de Stripe con clientSecret');
        
        const elementOptions = {
          style: {
            base: {
              fontSize: '16px',
              color: '#32325d',
              fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
              '::placeholder': {
                color: '#aab7c4',
              },
            },
            invalid: {
              color: '#fa755a',
              iconColor: '#fa755a',
            },
          },
        };
        
        // Crear una instancia de Elements
        const elementsInstance = stripe.elements({ clientSecret });
        setElements(elementsInstance);
        
        // Asegurarse de limpiar cualquier elemento previo y crear uno nuevo
        setTimeout(() => {
          // Crear y montar elemento número de tarjeta
          const cardNumber = elementsInstance.create('cardNumber', elementOptions);
          const cardNumberMount = document.getElementById('card-number-element');
          if (cardNumberMount) {
            cardNumber.mount('#card-number-element');
            setCardNumberElement(cardNumber);
          }
          
          // Crear y montar elemento fecha de expiración
          const cardExpiry = elementsInstance.create('cardExpiry', elementOptions);
          const cardExpiryMount = document.getElementById('card-expiry-element');
          if (cardExpiryMount) {
            cardExpiry.mount('#card-expiry-element');
            setCardExpiryElement(cardExpiry);
          }
          
          // Crear y montar elemento CVC
          const cardCvc = elementsInstance.create('cardCvc', elementOptions);
          const cardCvcMount = document.getElementById('card-cvc-element');
          if (cardCvcMount) {
            cardCvc.mount('#card-cvc-element');
            setCardCvcElement(cardCvc);
          }
          
          // También crear un elemento card oculto para compatibilidad
          const cardElement = elementsInstance.create('card', { ...elementOptions, hidePostalCode: true });
          const cardMount = document.getElementById('card-element');
          if (cardMount) {
            cardElement.mount('#card-element');
          }
          
          // Añadir listeners para detectar errores en los campos
          const handleChange = (event: { error?: { message: string }; complete?: boolean }) => {
            if (event.error) {
              console.error('Error en el elemento de tarjeta:', event.error.message);
              setErrorMessage(event.error.message);
            } else {
              setErrorMessage(null);
            }
          };
          
          cardNumber.on('change', handleChange);
          cardExpiry.on('change', handleChange);
          cardCvc.on('change', handleChange);
          
          console.log('Elementos de tarjeta montados correctamente');
        }, 100);
      } catch (error) {
        console.error('Error creating Stripe elements:', error);
        setErrorMessage('Error al crear el formulario de pago');
        setPaymentStatus('error');
      }
    }
    
    return () => {
      // Limpiar elementos cuando el componente se desmonte
      if (cardNumberElement) { 
        try { cardNumberElement.unmount(); } catch (e) { console.error(e); }
      }
      if (cardExpiryElement) {
        try { cardExpiryElement.unmount(); } catch (e) { console.error(e); }
      }
      if (cardCvcElement) {
        try { cardCvcElement.unmount(); } catch (e) { console.error(e); }
      }
    };
  }, [stripe, clientSecret]);

  // Función para procesar el pago
  const handlePayment = async () => {
    if (!stripe || !clientSecret) {
      setErrorMessage('Error: El procesador de pagos no está completamente inicializado');
      setPaymentStatus('error');
      return;
    }
    
    try {
      setPaymentStatus('loading');
      setErrorMessage(null);
      
      // Modo simulación o modo real
      if (stripe.simulationMode) {
        // Simular el proceso de pago
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        setPaymentStatus('success');
        
        if (onPaymentSuccess) {
          onPaymentSuccess();
        }
        
        if (onSuccess) {
          onSuccess();
        }
        
        toast({
          title: 'Pago completado (Simulación)',
          description: `Se ha simulado el pago de $${Number(amount).toFixed(2)}`,
          variant: 'default',
        });
      } else {
        // Proceso real con Stripe
        if (!elements) {
          throw new Error('Error: El formulario de tarjeta no está inicializado correctamente');
        }
        
        const result = await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: elements.getElement('card'),
          },
        });
        
        if (result.error) {
          throw new Error(result.error.message || 'Error al procesar el pago');
        } else if (result.paymentIntent?.status === 'succeeded') {
          setPaymentStatus('success');
          
          if (onPaymentSuccess) {
            onPaymentSuccess();
          }
          
          if (onSuccess) {
            onSuccess();
          }
          
          toast({
            title: 'Pago completado',
            description: `Se ha procesado correctamente el pago de $${Number(amount).toFixed(2)}`,
            variant: 'default',
          });
        } else {
          toast({
            title: 'Pago en proceso',
            description: 'Su pago está siendo procesado. Recibirá una confirmación en breve.',
            variant: 'default',
          });
        }
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Error desconocido al procesar el pago';
      setErrorMessage(errorMsg);
      setPaymentStatus('error');
      
      if (onError) {
        onError(errorMsg);
      }
      
      toast({
        title: 'Error de pago',
        description: errorMsg,
        variant: 'destructive',
      });
    }
  };

  // Si el estado simula que Stripe no ha cargado, mostramos pantalla de carga
  if (!stripeLoaded || !stripe) {
    return (
      <div className="flex flex-col items-center justify-center p-6 space-y-4 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-slate-600 dark:text-slate-400">Cargando procesador de pagos...</p>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {import.meta.env.VITE_STRIPE_PUBLIC_KEY ? 'Modo de pago real' : 'Modo de pago simulado'}
        </p>
      </div>
    );
  }

  // Si hay un error en la inicialización, mostramos mensaje de error
  if (paymentStatus === 'error' && errorMessage) {
    return (
      <div className="flex flex-col items-center justify-center p-6 space-y-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-700">
        <AlertCircle className="h-8 w-8 text-red-500 dark:text-red-400" />
        <div className="text-center">
          <h3 className="font-semibold text-red-700 dark:text-red-400">Error al procesar el pago</h3>
          <p className="text-sm text-red-600 dark:text-red-300">{errorMessage}</p>
        </div>
        <Button
          variant="outline"
          onClick={() => {
            setPaymentStatus('idle');
            setErrorMessage(null);
          }}
        >
          Intentar de nuevo
        </Button>
      </div>
    );
  }

  // Si el pago ha sido exitoso, mostramos mensaje de confirmación
  if (paymentStatus === 'success') {
    return (
      <div className="flex flex-col items-center justify-center p-6 space-y-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700">
        <CheckCircle className="h-8 w-8 text-green-500 dark:text-green-400" />
        <div className="text-center">
          <h3 className="font-semibold text-green-700 dark:text-green-400">¡Pago completado!</h3>
          <p className="text-sm text-green-600 dark:text-green-300">
            Se ha procesado correctamente su pago de ${Number(amount).toFixed(2)}
          </p>
        </div>
      </div>
    );
  }

  // Formulario de pago con elementos individuales de Stripe
  return (
    <div className="flex flex-col space-y-6 p-6 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
      <div className="flex flex-col space-y-1.5">
        <h3 className="text-lg font-semibold">Pago con tarjeta</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Monto a pagar: ${Number(amount).toFixed(2)}
        </p>
      </div>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="card-number-element" className="text-sm font-medium">
            Número de tarjeta
          </label>
          <div 
            id="card-number-element"
            className="flex h-10 w-full rounded-md border border-slate-300 bg-white dark:bg-slate-800 px-3 py-2 text-base shadow-sm transition-colors cursor-text focus-within:ring-2 focus-within:ring-primary focus-within:border-primary dark:border-slate-600"
          ></div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="card-expiry-element" className="text-sm font-medium">
              Fecha de expiración
            </label>
            <div
              id="card-expiry-element"
              className="flex h-10 w-full rounded-md border border-slate-300 bg-white dark:bg-slate-800 px-3 py-2 text-base shadow-sm transition-colors cursor-text focus-within:ring-2 focus-within:ring-primary focus-within:border-primary dark:border-slate-600"
            ></div>
          </div>
          <div className="space-y-2">
            <label htmlFor="card-cvc-element" className="text-sm font-medium">
              CVC
            </label>
            <div
              id="card-cvc-element"
              className="flex h-10 w-full rounded-md border border-slate-300 bg-white dark:bg-slate-800 px-3 py-2 text-base shadow-sm transition-colors cursor-text focus-within:ring-2 focus-within:ring-primary focus-within:border-primary dark:border-slate-600"
            ></div>
          </div>
        </div>
        
        {errorMessage && (
          <p className="text-sm text-red-500 mt-1">{errorMessage}</p>
        )}
        
        {/* Elemento oculto para mantener compatibilidad con el código existente */}
        <div id="card-element" className="hidden"></div>
      </div>

      <div className="flex flex-col space-y-4">
        <Button
          className="w-full"
          size="lg"
          onClick={handlePayment}
          disabled={paymentStatus === 'loading' || !clientSecret}
        >
          {paymentStatus === 'loading' ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Procesando
            </>
          ) : (
            'Pagar con Stripe'
          )}
        </Button>
        
        {onCancel && (
          <Button
            className="w-full"
            variant="outline"
            onClick={onCancel}
            disabled={paymentStatus === 'loading'}
          >
            Cancelar
          </Button>
        )}
      </div>
      
      {/* Logos e información de seguridad */}
      <div className="flex items-center justify-center space-x-4 pt-4 border-t border-slate-200 dark:border-slate-700">
        <span className="text-xs text-slate-500 dark:text-slate-400">
          Pagos seguros procesados por Stripe
        </span>
      </div>
    </div>
  );
}