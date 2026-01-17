/**
 * NFT Pool Creation Banner
 *
 * This component displays a banner when the user has positions that need NFT creation.
 * It appears after the admin activates a position and the user connects their wallet.
 */

import { useState } from 'react';
import { useNFTPoolCreation } from '@/hooks/use-nft-pool-creation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Loader2, Sparkles, Wallet, ExternalLink, AlertCircle } from 'lucide-react';

export function NFTPoolCreationBanner() {
  const {
    isLoading,
    isCreating,
    pendingCreations,
    currentCreation,
    error,
    createNFTPool,
    createAllPendingPools,
    hasPendingCreations,
  } = useNFTPoolCreation();

  const [showDialog, setShowDialog] = useState(false);

  // Don't render if no pending creations
  if (!hasPendingCreations && !isLoading) {
    return null;
  }

  // Loading state
  if (isLoading) {
    return (
      <Alert className="mb-6 border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950">
        <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
        <AlertTitle className="text-blue-800 dark:text-blue-200">Verificando posiciones...</AlertTitle>
        <AlertDescription className="text-blue-700 dark:text-blue-300">
          Comprobando si tienes posiciones pendientes de activación.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <>
      {/* Main Banner */}
      <Alert className="mb-6 border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950">
        <Sparkles className="h-4 w-4 text-amber-600" />
        <AlertTitle className="text-amber-800 dark:text-amber-200">
          ¡Tienes {pendingCreations.length} posición(es) lista(s) para activar!
        </AlertTitle>
        <AlertDescription className="text-amber-700 dark:text-amber-300">
          <p className="mb-3">
            Tu pago ha sido confirmado. Para completar la activación, necesitas crear tu posición NFT
            en la red Polygon. Esto requiere una pequeña cantidad de MATIC para gas.
          </p>
          <div className="flex gap-2">
            <Button
              onClick={() => setShowDialog(true)}
              disabled={isCreating}
              className="bg-amber-600 hover:bg-amber-700 text-white"
            >
              {isCreating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Procesando...
                </>
              ) : (
                <>
                  <Wallet className="mr-2 h-4 w-4" />
                  Activar posiciones
                </>
              )}
            </Button>
          </div>
        </AlertDescription>
      </Alert>

      {/* Detailed Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-amber-500" />
              Activar posiciones NFT
            </DialogTitle>
            <DialogDescription>
              Tus pagos han sido confirmados. Completa la activación creando tu posición NFT en Polygon.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Info box */}
            <div className="rounded-lg bg-slate-100 dark:bg-slate-800 p-4 text-sm">
              <h4 className="font-medium mb-2">¿Qué sucederá?</h4>
              <ul className="space-y-1 text-slate-600 dark:text-slate-400">
                <li>• Se creará un NFT de posición en Uniswap V3</li>
                <li>• El NFT aparecerá en tu wallet de Polygon</li>
                <li>• Tu posición quedará completamente activa</li>
                <li>• Solo necesitas MATIC para gas (~$0.01)</li>
              </ul>
            </div>

            {/* Pending creations list */}
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Posiciones pendientes:</h4>
              {pendingCreations.map((creation) => (
                <Card
                  key={creation.positionId}
                  className={`${
                    currentCreation?.positionId === creation.positionId
                      ? 'border-amber-500 bg-amber-50 dark:bg-amber-950'
                      : ''
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">
                          Posición #{creation.positionId}
                        </p>
                        <p className="text-sm text-slate-500">
                          Valor: ${parseFloat(creation.valueUsdc).toLocaleString()} USDC
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {currentCreation?.positionId === creation.positionId ? (
                          <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                            <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                            Procesando
                          </Badge>
                        ) : (
                          <Badge variant="outline">Pendiente</Badge>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => createNFTPool(creation)}
                          disabled={isCreating}
                        >
                          Activar
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Error display */}
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Requirements */}
            <div className="rounded-lg border border-slate-200 dark:border-slate-700 p-3 text-sm">
              <p className="font-medium mb-1">Requisitos:</p>
              <ul className="text-slate-600 dark:text-slate-400 space-y-1">
                <li>✓ Wallet conectada a Polygon</li>
                <li>✓ Pequeña cantidad de MATIC para gas</li>
              </ul>
            </div>
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Cancelar
            </Button>
            <Button
              onClick={createAllPendingPools}
              disabled={isCreating || pendingCreations.length === 0}
              className="bg-amber-600 hover:bg-amber-700"
            >
              {isCreating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Procesando...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Activar todas ({pendingCreations.length})
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default NFTPoolCreationBanner;
