/**
 * WBC Return Dialog
 *
 * Premium dialog for users to return WBC tokens before collecting fees or closing positions.
 * Features step-by-step guidance with excellent UI/UX.
 */

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Loader2,
  Wallet,
  ArrowRight,
  CheckCircle2,
  XCircle,
  ExternalLink,
  AlertTriangle,
  Shield,
  Coins,
  Network,
  PenTool,
  Clock,
  RefreshCw,
  ChevronRight,
  Info,
  Zap,
} from 'lucide-react';
import { useWBCToken } from '@/hooks/use-wbc-token';
import { cn } from '@/lib/utils';

interface WBCReturnDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  amount: number;
  positionId: number;
  reason: 'fee_collection' | 'position_close';
  onSuccess: (txHash: string) => void;
  onCancel: () => void;
}

type Step = 'checking' | 'connect' | 'switch_network' | 'confirm' | 'signing' | 'waiting' | 'success' | 'error';

const STEPS_ORDER: Step[] = ['checking', 'connect', 'switch_network', 'confirm', 'signing', 'waiting', 'success'];

export function WBCReturnDialog({
  open,
  onOpenChange,
  amount,
  positionId,
  reason,
  onSuccess,
  onCancel,
}: WBCReturnDialogProps) {
  const {
    isConnected,
    address,
    isOnPolygon,
    isLoading,
    getBalance,
    returnToOwner,
    switchToPolygon,
    ownerAddress,
  } = useWBCToken();

  const [step, setStep] = useState<Step>('checking');
  const [balance, setBalance] = useState<number | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [waitingSeconds, setWaitingSeconds] = useState(0);

  // Check initial state when dialog opens
  useEffect(() => {
    if (open) {
      checkState();
    } else {
      setStep('checking');
      setBalance(null);
      setTxHash(null);
      setErrorMessage(null);
      setWaitingSeconds(0);
    }
  }, [open, isConnected, isOnPolygon]);

  // Waiting timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === 'waiting' || step === 'signing') {
      interval = setInterval(() => {
        setWaitingSeconds(s => s + 1);
      }, 1000);
    } else {
      setWaitingSeconds(0);
    }
    return () => clearInterval(interval);
  }, [step]);

  const checkState = async () => {
    setStep('checking');

    if (!isConnected) {
      setStep('connect');
      return;
    }

    if (!isOnPolygon) {
      setStep('switch_network');
      return;
    }

    const balanceResult = await getBalance();
    if (balanceResult) {
      setBalance(balanceResult.balance);

      if (balanceResult.balance < amount) {
        setErrorMessage(`Saldo insuficiente. Tienes ${balanceResult.formatted} WBC pero necesitas ${amount.toFixed(2)} WBC para completar esta operacion.`);
        setStep('error');
        return;
      }
    }

    setStep('confirm');
  };

  const handleSwitchNetwork = async () => {
    setStep('checking');
    const success = await switchToPolygon();
    if (success) {
      await checkState();
    } else {
      setErrorMessage('No se pudo cambiar a la red Polygon. Cambia manualmente en tu wallet.');
      setStep('error');
    }
  };

  const handleConfirm = async () => {
    setStep('signing');

    const result = await returnToOwner(amount, positionId, reason);

    if (result.success && result.txHash) {
      setTxHash(result.txHash);
      setStep('success');
    } else {
      // Parse common errors
      let friendlyError = result.error || 'Error desconocido';
      if (friendlyError.includes('user rejected')) {
        friendlyError = 'Transaccion rechazada. Debes aprobar la transaccion en tu wallet para continuar.';
      } else if (friendlyError.includes('insufficient funds')) {
        friendlyError = 'Fondos insuficientes para pagar el gas de la transaccion (MATIC).';
      }
      setErrorMessage(friendlyError);
      setStep('error');
    }
  };

  const handleSuccess = () => {
    if (txHash) {
      onSuccess(txHash);
    }
    onOpenChange(false);
  };

  const handleRetry = () => {
    setErrorMessage(null);
    checkState();
  };

  const reasonText = reason === 'fee_collection' ? 'cobrar tus fees' : 'cerrar tu posicion';
  const reasonTitle = reason === 'fee_collection' ? 'Cobrar Fees' : 'Cerrar Posicion';
  const getPolygonScanUrl = (hash: string) => `https://polygonscan.com/tx/${hash}`;

  // Calculate progress
  const getProgress = () => {
    const stepIndex = STEPS_ORDER.indexOf(step);
    if (step === 'error') return 0;
    return Math.min(100, (stepIndex / (STEPS_ORDER.length - 1)) * 100);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg p-0 overflow-hidden">
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 p-6 text-white">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                <Coins className="h-6 w-6" />
              </div>
              <div>
                <DialogTitle className="text-xl font-semibold text-white">
                  Devolucion de WBC
                </DialogTitle>
                <p className="text-purple-100 text-sm mt-0.5">
                  {reasonTitle} - Posicion #{positionId}
                </p>
              </div>
            </div>
          </DialogHeader>

          {/* Progress bar */}
          <div className="mt-4">
            <Progress
              value={getProgress()}
              className="h-1.5 bg-white/20"
              indicatorClassName="bg-white/80"
            />
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Step: Checking */}
          {step === 'checking' && (
            <StepContainer>
              <StepIcon loading>
                <Loader2 className="h-8 w-8 animate-spin" />
              </StepIcon>
              <StepTitle>Verificando estado</StepTitle>
              <StepDescription>
                Comprobando conexion de wallet y saldo de WBC...
              </StepDescription>
            </StepContainer>
          )}

          {/* Step: Connect Wallet */}
          {step === 'connect' && (
            <StepContainer>
              <StepIcon warning>
                <Wallet className="h-8 w-8" />
              </StepIcon>
              <StepTitle>Conecta tu Wallet</StepTitle>
              <StepDescription>
                Necesitas conectar tu wallet para firmar la transaccion de devolucion de WBC.
              </StepDescription>

              <InfoCard className="mt-6">
                <Info className="h-4 w-4 text-blue-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-slate-700">Wallet requerida</p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Usa la misma wallet con la que creaste la posicion para poder devolver los tokens WBC.
                  </p>
                </div>
              </InfoCard>

              <div className="mt-6 flex gap-3">
                <Button variant="outline" onClick={onCancel} className="flex-1">
                  Cancelar
                </Button>
              </div>
            </StepContainer>
          )}

          {/* Step: Switch Network */}
          {step === 'switch_network' && (
            <StepContainer>
              <StepIcon warning>
                <Network className="h-8 w-8" />
              </StepIcon>
              <StepTitle>Cambiar a Polygon</StepTitle>
              <StepDescription>
                El token WBC esta en la red Polygon. Cambia de red para continuar.
              </StepDescription>

              <div className="mt-6 flex items-center justify-center gap-4">
                <NetworkBadge name="Red actual" icon="?" variant="muted" />
                <ArrowRight className="h-5 w-5 text-slate-400" />
                <NetworkBadge name="Polygon" icon="MATIC" variant="polygon" />
              </div>

              <div className="mt-6 flex gap-3">
                <Button variant="outline" onClick={onCancel} className="flex-1">
                  Cancelar
                </Button>
                <Button onClick={handleSwitchNetwork} className="flex-1 bg-purple-600 hover:bg-purple-700">
                  <Network className="mr-2 h-4 w-4" />
                  Cambiar Red
                </Button>
              </div>
            </StepContainer>
          )}

          {/* Step: Confirm */}
          {step === 'confirm' && (
            <StepContainer>
              <StepIcon>
                <Shield className="h-8 w-8" />
              </StepIcon>
              <StepTitle>Confirmar Devolucion</StepTitle>
              <StepDescription>
                Para {reasonText}, debes devolver WBC al contrato WayBank.
              </StepDescription>

              {/* Transaction Details Card */}
              <div className="mt-6 rounded-xl border-2 border-slate-100 overflow-hidden">
                <div className="bg-slate-50 px-4 py-3 border-b border-slate-100">
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                    Detalles de la transaccion
                  </p>
                </div>

                <div className="p-4 space-y-4">
                  {/* Amount */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-amber-100 rounded-lg">
                        <Coins className="h-4 w-4 text-amber-600" />
                      </div>
                      <span className="text-sm text-slate-600">Cantidad a devolver</span>
                    </div>
                    <div className="text-right">
                      <p className="font-mono font-bold text-lg text-slate-900">
                        {amount.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                      <p className="text-xs text-slate-500">WBC</p>
                    </div>
                  </div>

                  {/* Balance */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-emerald-100 rounded-lg">
                        <Wallet className="h-4 w-4 text-emerald-600" />
                      </div>
                      <span className="text-sm text-slate-600">Tu saldo actual</span>
                    </div>
                    <div className="text-right">
                      <p className="font-mono font-semibold text-slate-900">
                        {balance?.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '...'}
                      </p>
                      <p className="text-xs text-slate-500">WBC</p>
                    </div>
                  </div>

                  {/* Remaining */}
                  <div className="flex items-center justify-between pt-3 border-t border-dashed border-slate-200">
                    <span className="text-sm text-slate-600">Saldo restante</span>
                    <p className="font-mono font-medium text-slate-700">
                      {((balance || 0) - amount).toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} WBC
                    </p>
                  </div>
                </div>

                {/* Flow visualization */}
                <div className="bg-gradient-to-r from-slate-50 to-purple-50 px-4 py-3 border-t border-slate-100">
                  <div className="flex items-center justify-center gap-3 text-sm">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                      <span className="text-slate-600 font-mono text-xs">
                        {address?.substring(0, 6)}...{address?.substring(address.length - 4)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <ChevronRight className="h-4 w-4 text-slate-400" />
                      <Coins className="h-4 w-4 text-purple-500" />
                      <ChevronRight className="h-4 w-4 text-slate-400" />
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                      <span className="text-slate-600 font-mono text-xs">WayBank</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Network badge */}
              <div className="mt-4 flex justify-center">
                <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                  <div className="w-2 h-2 rounded-full bg-purple-500 mr-2"></div>
                  Polygon Mainnet
                </Badge>
              </div>

              {/* Action buttons */}
              <div className="mt-6 flex gap-3">
                <Button variant="outline" onClick={onCancel} className="flex-1">
                  Cancelar
                </Button>
                <Button
                  onClick={handleConfirm}
                  disabled={isLoading}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                >
                  <PenTool className="mr-2 h-4 w-4" />
                  Firmar Transaccion
                </Button>
              </div>
            </StepContainer>
          )}

          {/* Step: Signing */}
          {step === 'signing' && (
            <StepContainer>
              <StepIcon loading>
                <PenTool className="h-8 w-8" />
              </StepIcon>
              <StepTitle>Firma en tu Wallet</StepTitle>
              <StepDescription>
                Revisa y aprueba la transaccion en tu wallet para continuar.
              </StepDescription>

              {/* Wallet animation */}
              <div className="mt-6 flex justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-purple-500/20 rounded-2xl animate-ping"></div>
                  <div className="relative p-6 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-2xl">
                    <Wallet className="h-12 w-12 text-purple-600" />
                  </div>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-center gap-2 text-slate-500">
                <Clock className="h-4 w-4" />
                <span className="text-sm">Esperando... {waitingSeconds}s</span>
              </div>

              <InfoCard className="mt-4">
                <Zap className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-slate-700">Revisa tu wallet</p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Deberia aparecer una solicitud de firma. Si no la ves, abre tu extension de wallet.
                  </p>
                </div>
              </InfoCard>
            </StepContainer>
          )}

          {/* Step: Waiting */}
          {step === 'waiting' && (
            <StepContainer>
              <StepIcon loading>
                <RefreshCw className="h-8 w-8 animate-spin" />
              </StepIcon>
              <StepTitle>Confirmando en Blockchain</StepTitle>
              <StepDescription>
                Esperando confirmacion de la red Polygon...
              </StepDescription>

              <div className="mt-6 flex items-center justify-center gap-2 text-slate-500">
                <Clock className="h-4 w-4" />
                <span className="text-sm">Procesando... {waitingSeconds}s</span>
              </div>

              <Progress
                value={Math.min(100, waitingSeconds * 5)}
                className="mt-4 h-2"
                indicatorClassName="bg-gradient-to-r from-blue-500 to-purple-500"
              />
            </StepContainer>
          )}

          {/* Step: Success */}
          {step === 'success' && (
            <StepContainer>
              <StepIcon success>
                <CheckCircle2 className="h-8 w-8" />
              </StepIcon>
              <StepTitle>WBC Devueltos Exitosamente</StepTitle>
              <StepDescription>
                La devolucion se ha completado. Ahora puedes {reasonText}.
              </StepDescription>

              {/* Success card */}
              <div className="mt-6 rounded-xl bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-200 p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-emerald-800">Transaccion confirmada</span>
                  <Badge className="bg-emerald-100 text-emerald-700 border-0">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Exitoso
                  </Badge>
                </div>

                {txHash && (
                  <div className="flex items-center justify-between bg-white/60 rounded-lg px-3 py-2">
                    <span className="font-mono text-xs text-slate-600">
                      {txHash.substring(0, 14)}...{txHash.substring(txHash.length - 10)}
                    </span>
                    <a
                      href={getPolygonScanUrl(txHash)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-purple-600 hover:text-purple-700 text-xs font-medium"
                    >
                      Ver en PolygonScan
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                )}

                <div className="mt-3 pt-3 border-t border-emerald-200/50 flex items-center justify-between">
                  <span className="text-sm text-emerald-700">WBC devueltos</span>
                  <span className="font-mono font-bold text-emerald-800">
                    {amount.toLocaleString('es-ES', { minimumFractionDigits: 2 })} WBC
                  </span>
                </div>
              </div>

              <Button
                onClick={handleSuccess}
                className="w-full mt-6 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700"
              >
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Continuar con {reason === 'fee_collection' ? 'Cobro de Fees' : 'Cierre'}
              </Button>
            </StepContainer>
          )}

          {/* Step: Error */}
          {step === 'error' && (
            <StepContainer>
              <StepIcon error>
                <XCircle className="h-8 w-8" />
              </StepIcon>
              <StepTitle>Error en la Transaccion</StepTitle>
              <StepDescription>
                No se pudo completar la devolucion de WBC.
              </StepDescription>

              {/* Error card */}
              <div className="mt-6 rounded-xl bg-gradient-to-br from-red-50 to-rose-50 border border-red-200 p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-red-800">Detalles del error</p>
                    <p className="text-sm text-red-600 mt-1">{errorMessage}</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <Button variant="outline" onClick={onCancel} className="flex-1">
                  Cancelar
                </Button>
                <Button onClick={handleRetry} className="flex-1">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Reintentar
                </Button>
              </div>
            </StepContainer>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Subcomponents for cleaner code

function StepContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center text-center">
      {children}
    </div>
  );
}

function StepIcon({
  children,
  loading,
  success,
  error,
  warning,
}: {
  children: React.ReactNode;
  loading?: boolean;
  success?: boolean;
  error?: boolean;
  warning?: boolean;
}) {
  return (
    <div
      className={cn(
        'p-4 rounded-2xl mb-4',
        loading && 'bg-blue-100 text-blue-600',
        success && 'bg-emerald-100 text-emerald-600',
        error && 'bg-red-100 text-red-600',
        warning && 'bg-amber-100 text-amber-600',
        !loading && !success && !error && !warning && 'bg-purple-100 text-purple-600'
      )}
    >
      {children}
    </div>
  );
}

function StepTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-lg font-semibold text-slate-900">{children}</h3>
  );
}

function StepDescription({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-sm text-slate-500 mt-1 max-w-sm">{children}</p>
  );
}

function InfoCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('flex gap-3 p-4 bg-blue-50 rounded-xl border border-blue-100', className)}>
      {children}
    </div>
  );
}

function NetworkBadge({
  name,
  icon,
  variant,
}: {
  name: string;
  icon: string;
  variant: 'muted' | 'polygon';
}) {
  return (
    <div
      className={cn(
        'flex flex-col items-center gap-1 p-3 rounded-xl',
        variant === 'muted' && 'bg-slate-100',
        variant === 'polygon' && 'bg-purple-100'
      )}
    >
      <div
        className={cn(
          'w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm',
          variant === 'muted' && 'bg-slate-200 text-slate-500',
          variant === 'polygon' && 'bg-purple-500 text-white'
        )}
      >
        {icon}
      </div>
      <span
        className={cn(
          'text-xs font-medium',
          variant === 'muted' && 'text-slate-500',
          variant === 'polygon' && 'text-purple-700'
        )}
      >
        {name}
      </span>
    </div>
  );
}
