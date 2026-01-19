/**
 * Componente para transferencias USDC reales multi-red
 * Reemplaza las simulaciones con transacciones blockchain auténticas
 */

import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { useWallet } from "@/hooks/use-wallet";
import { 
  transferUSDC, 
  detectUserNetwork, 
  checkUSDCBalance,
  USDC_CONFIG
} from "@/lib/multi-network-usdc";
import { DEPOSIT_WALLET_ADDRESS } from "@/lib/ethereum";
import { 
  AlertCircle, 
  CheckCircle, 
  ExternalLink, 
  RefreshCw, 
  Network,
  Wallet
} from "lucide-react";

interface RealUSDCTransferDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  amount: string;
  onSuccess?: (txHash: string, networkName: string) => void;
}

export default function RealUSDCTransferDialog({
  open,
  onOpenChange,
  amount,
  onSuccess
}: RealUSDCTransferDialogProps) {
  const { address } = useWallet();
  const { toast } = useToast();

  // Estados del componente
  const [isTransferring, setIsTransferring] = useState(false);
  const [networkInfo, setNetworkInfo] = useState<any>(null);
  const [balanceInfo, setBalanceInfo] = useState<any>(null);
  const [isLoadingNetwork, setIsLoadingNetwork] = useState(true);
  const [transferResult, setTransferResult] = useState<any>(null);

  // Detectar red al abrir el diálogo
  useEffect(() => {
    if (open && address) {
      loadNetworkInfo();
    }
  }, [open, address]);

  const loadNetworkInfo = async () => {
    setIsLoadingNetwork(true);
    try {
      // Detectar red actual
      const network = await detectUserNetwork();
      setNetworkInfo(network);

      // Verificar balance si la red soporta USDC
      if (network.usdcConfig && address) {
        const balance = await checkUSDCBalance(address, amount);
        setBalanceInfo(balance);
      }
    } catch (error) {
      console.error("Error loading network info:", error);
      toast({
        title: "Error de red",
        description: "No se pudo detectar la red de tu wallet.",
        variant: "destructive"
      });
    } finally {
      setIsLoadingNetwork(false);
    }
  };

  const handleTransfer = async () => {
    if (!address || !networkInfo) return;

    setIsTransferring(true);
    setTransferResult(null);

    try {
      console.log(`🚀 Iniciando transferencia de ${amount} USDC...`);
      
      const result = await transferUSDC(
        address,
        DEPOSIT_WALLET_ADDRESS,
        amount
      );

      setTransferResult(result);

      if (result.success) {
        toast({
          title: "¡Transferencia exitosa!",
          description: `Se transfirieron ${result.amount} en ${result.networkName}`,
        });

        // Notificar al componente padre
        if (onSuccess && result.txHash) {
          onSuccess(result.txHash, result.networkName || "Unknown");
        }

        // Cerrar diálogo después de 3 segundos
        setTimeout(() => {
          onOpenChange(false);
        }, 3000);

      } else {
        toast({
          title: "Error en la transferencia",
          description: result.error,
          variant: "destructive"
        });
      }

    } catch (error: any) {
      console.error("Transfer error:", error);
      setTransferResult({
        success: false,
        error: error.message || "Error desconocido"
      });
      
      toast({
        title: "Error inesperado",
        description: "Ocurrió un error durante la transferencia",
        variant: "destructive"
      });
    } finally {
      setIsTransferring(false);
    }
  };



  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Pago con USDC Real
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Información del monto */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-900">
                ${amount} USDC
              </div>
              <div className="text-sm text-blue-700">
                Monto a transferir
              </div>
            </div>
          </div>

          {/* Estado de carga de red */}
          {isLoadingNetwork && (
            <div className="flex items-center justify-center gap-2 py-4">
              <RefreshCw className="h-4 w-4 animate-spin" />
              <span>Detectando red...</span>
            </div>
          )}

          {/* Información de red */}
          {!isLoadingNetwork && networkInfo && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-medium">Red actual:</span>
                <Badge variant={networkInfo.usdcConfig ? "default" : "destructive"}>
                  <Network className="h-3 w-3 mr-1" />
                  {networkInfo.networkName}
                </Badge>
              </div>

              {/* Red no soportada */}
              {!networkInfo.usdcConfig && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    USDC no está disponible en {networkInfo.networkName}. 
                    Por favor cambia a una red compatible.
                  </AlertDescription>
                </Alert>
              )}

              {/* Balance insuficiente */}
              {networkInfo.usdcConfig && balanceInfo && !balanceInfo.hasEnough && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Balance insuficiente: Tienes {balanceInfo.userBalance} USDC 
                    pero necesitas {amount} USDC.
                  </AlertDescription>
                </Alert>
              )}

              {/* Balance suficiente */}
              {networkInfo.usdcConfig && balanceInfo && balanceInfo.hasEnough && (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription className="text-green-700">
                    ✅ Balance suficiente: {balanceInfo.userBalance} USDC disponibles
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}

          {/* Información sobre redes compatibles (solo informativa) */}
          {!isLoadingNetwork && !networkInfo?.usdcConfig && (
            <div className="space-y-2">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Para usar USDC, cambia manualmente tu wallet a una de estas redes: Ethereum, Polygon, Arbitrum, Base u Optimism.
                </AlertDescription>
              </Alert>
            </div>
          )}

          {/* Resultado de transferencia */}
          {transferResult && (
            <Alert variant={transferResult.success ? "default" : "destructive"}>
              {transferResult.success ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <AlertCircle className="h-4 w-4" />
              )}
              <AlertDescription>
                {transferResult.success ? (
                  <div className="space-y-2">
                    <div>✅ Transferencia completada exitosamente</div>
                    {transferResult.txHash && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs">TX:</span>
                        <code className="text-xs bg-gray-100 px-1 rounded">
                          {transferResult.txHash.slice(0, 10)}...
                        </code>
                        <ExternalLink className="h-3 w-3" />
                      </div>
                    )}
                  </div>
                ) : (
                  <div>❌ {transferResult.error}</div>
                )}
              </AlertDescription>
            </Alert>
          )}

          {/* Botones de acción */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancelar
            </Button>
            
            <Button
              onClick={handleTransfer}
              disabled={
                isTransferring || 
                isLoadingNetwork || 
                !networkInfo?.usdcConfig || 
                (balanceInfo && !balanceInfo.hasEnough) ||
                transferResult?.success
              }
              className="flex-1"
            >
              {isTransferring ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Transfiriendo...
                </>
              ) : transferResult?.success ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Completado
                </>
              ) : (
                <>
                  <Wallet className="h-4 w-4 mr-2" />
                  Transferir USDC
                </>
              )}
            </Button>
          </div>

          {/* Información adicional */}
          <div className="text-xs text-gray-500 space-y-1">
            <div>• Los fondos se transfieren al wallet de administración</div>
            <div>• Compatible con Ethereum, Polygon, Arbitrum, Base, Optimism</div>
            <div>• Se requieren fees de gas para la transacción</div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}