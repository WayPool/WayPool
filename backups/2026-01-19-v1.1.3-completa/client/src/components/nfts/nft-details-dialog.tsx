import React, { useState, useEffect, useCallback } from "react";
import { useNFTDetails, useActivateNFT } from "@/hooks/use-nfts";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { 
  ExternalLink, 
  Tag, 
  AlertCircle, 
  Activity, 
  Layers, 
  Banknote, 
  Info, 
  BarChart3, 
  Repeat, 
  CheckCircle, 
  XCircle,
  Copy,
} from "lucide-react";

// Componente para mostrar la dirección del pool
const PoolAddressDisplay: React.FC<{nftDetails: any}> = ({nftDetails}) => {
  const [poolAddress, setPoolAddress] = React.useState<string>("");
  
  React.useEffect(() => {
    // Variable para guardar la dirección del pool
    let extractedAddress = nftDetails.poolAddress || "";
    
    if (nftDetails.description) {
      // Intentar extraer la dirección del pool de los metadatos
      const poolAddressMatch = nftDetails.description.match(/Pool Address:\s*(0x[a-fA-F0-9]+)/);
      if (poolAddressMatch && poolAddressMatch[1]) {
        extractedAddress = poolAddressMatch[1];
      } else {
        // Si no hay Pool Address, intentar con Pool Manager (para V4)
        const poolManagerMatch = nftDetails.description.match(/Pool Manager Address:\s*(0x[a-fA-F0-9]+)/);
        if (poolManagerMatch && poolManagerMatch[1]) {
          extractedAddress = poolManagerMatch[1];
        }
      }
    }
    
    // Actualizar el estado
    setPoolAddress(extractedAddress);
  }, [nftDetails]);
  
  return (
    <div className="flex items-center">
      <code className="text-xs bg-slate-100 dark:bg-slate-800 p-2 rounded-l-md border border-slate-200 dark:border-slate-700 flex-1 truncate">
        {poolAddress || "No disponible"}
      </code>
      
      {poolAddress && poolAddress !== "No disponible" && (
        <div className="flex">
          <Button 
            variant="outline" 
            size="icon" 
            className="h-8 rounded-none border-l-0 border-r-0 border-slate-200 dark:border-slate-700"
            onClick={() => {
              navigator.clipboard.writeText(poolAddress);
            }}
          >
            <Copy className="h-3.5 w-3.5" />
          </Button>
          
          <Button 
            variant="outline" 
            size="icon" 
            className="h-8 rounded-l-none border-l-0 bg-slate-50 dark:bg-slate-800" 
            asChild
          >
            <a
              href={`https://${nftDetails.network === "ethereum" ? "etherscan.io" : "polygonscan.com"}/address/${poolAddress}`}
              target="_blank"
              rel="noopener noreferrer"
              title="Ver en Etherscan/Polygonscan"
            >
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </Button>
        </div>
      )}
    </div>
  );
};

// Componente de diálogo de detalles del NFT
const NFTDetailsDialog: React.FC<{
  tokenId: string | null;
  network: string;
  contractAddress?: string;
  nftData?: any;
  isOpen: boolean;
  onClose: () => void;
  managedNfts?: any[];
  isAdmin?: boolean;
}> = ({ tokenId, network, contractAddress, nftData, isOpen, onClose, managedNfts = [], isAdmin = false }) => {
  // Estados
  const [valueUsdc, setValueUsdc] = useState("0.00");
  const [tokenPair, setTokenPair] = useState<string>("");
  const [managedNft, setManagedNft] = useState<any>(null);

  // Hooks
  const { data: nftDetails, isLoading, error } = useNFTDetails(
    isOpen && tokenId ? tokenId : "", 
    network,
    contractAddress
  );
  const activateNftMutation = useActivateNFT();

  // Efecto para encontrar el NFT administrado correspondiente
  useEffect(() => {
    if (!tokenId || !managedNfts?.length) {
      setManagedNft(null);
      return;
    }

    const managed = managedNfts.find(nft => {
      const tokenIdMatches = nft.tokenId === tokenId;
      const networkMatches = 
        nft.network === network || 
        (nft.network === 'ethereum' && network === 'mainnet') ||
        (nft.network === 'polygon' && network === 'matic');
      
      return tokenIdMatches && networkMatches;
    });
    
    setManagedNft(managed);

    // Si encontramos un NFT administrado con valor USDC, usarlo
    if (managed?.valueUsdc) {
      setValueUsdc(managed.valueUsdc);
    } else {
      setValueUsdc("0.00");
    }
  }, [tokenId, managedNfts, network]);

  // Efecto para calcular el tokenPair
  useEffect(() => {
    if (!nftDetails) {
      setTokenPair("");
      return;
    }

    let pair = "";

    // Lógica para determinar el par de tokens basado en los detalles del NFT
    if (nftDetails.description && nftDetails.version === "Uniswap V3") {
      const lines = nftDetails.description.split('\n');
      let token0 = "";
      let token1 = "";
      
      for (const line of lines) {
        if (line.includes("Address:") && !line.includes("Pool Address:")) {
          const tokenName = line.split("Address:")[0].trim();
          if (!token0) token0 = tokenName;
          else if (!token1) token1 = tokenName;
        }
      }
      
      if (token0 && token1) {
        pair = `${token0}/${token1}`;
      } else if (nftDetails.token0Symbol === "Unknown" && nftDetails.token1Symbol === "Unknown" && 
                nftDetails.fee && nftDetails.fee.includes("/")) {
        pair = nftDetails.fee;
      } else {
        pair = `${nftDetails.token0Symbol}/${nftDetails.token1Symbol}`;
      }
    } else if (nftDetails.version === "Uniswap V4") {
      if (nftDetails.token0Symbol === "Unknown" && nftDetails.token1Symbol === "Unknown") {
        if (nftDetails.fee && nftDetails.fee.includes("/")) {
          pair = nftDetails.fee;
        } else if (nftDetails.feeTier === "0.3%") {
          pair = "WETH/USDC";
        } else if (nftDetails.feeTier === "0.01%") {
          pair = "USDT/USDC";
        } else {
          pair = `${nftDetails.token0Symbol}/${nftDetails.token1Symbol}`;
        }
      } else {
        pair = `${nftDetails.token0Symbol}/${nftDetails.token1Symbol}`;
      }
    } else {
      pair = `${nftDetails.token0Symbol}/${nftDetails.token1Symbol}`;
    }

    setTokenPair(pair);
  }, [nftDetails]);

  // Función para activar el NFT
  const handleActivateNFT = useCallback(() => {
    if (!tokenId) return;
    
    activateNftMutation.mutate({
      tokenId,
      network,
      status: "Active",
      valueUsdc
    });
  }, [tokenId, network, valueUsdc, activateNftMutation]);

  // Si no hay tokenId o no está abierto, no renderizar nada
  if (!tokenId || !isOpen) {
    return null;
  }

  // Renderizado del componente
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 border-slate-200 dark:border-slate-700">
        <DialogTitle className="sr-only">NFT #{tokenId} Detalles</DialogTitle>
        <DialogDescription className="sr-only">Información detallada sobre el NFT de Uniswap</DialogDescription>
        
        {/* Encabezado con gradiente */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-700 dark:from-slate-900 dark:to-slate-800 p-6 text-white">
          <div className="flex items-center gap-2 mb-1">
            <Tag className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-bold tracking-tight">NFT #{tokenId}</h2>
          </div>
          <p className="text-slate-300 ml-7">
            Información detallada sobre tu posición de liquidez en {network === "ethereum" ? "Ethereum" : "Polygon"}
          </p>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Spinner size="lg" className="text-primary" />
          </div>
        ) : nftDetails ? (
          <div className="px-6 pb-6">
            {/* Panel superior con imagen y datos principales */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-6">
              {/* Columna izquierda: Imagen */}
              <div className="aspect-square bg-gradient-to-br from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-700 p-1 rounded-lg overflow-hidden">
                {(nftData?.imageUrl || nftDetails.imageUrl) ? (
                  <img 
                    src={nftData?.imageUrl || nftDetails.imageUrl} 
                    alt={`NFT ${tokenId}`} 
                    className="w-full h-full object-contain rounded-md"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "https://app.uniswap.org/static/media/position.b05a58a8.svg";
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-900/40 via-slate-900 to-purple-900/40 rounded-md">
                    <div className="text-center text-white/80">
                      <div className="text-2xl font-bold mb-1">#{tokenId}</div>
                      <div className="text-sm opacity-70">{network === 'unichain' ? 'Unichain' : network}</div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Columna derecha: Datos principales */}
              <div className="md:col-span-2 space-y-4">
                {/* Par de tokens y estado */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                  <div className="flex items-center">
                    <Repeat className="h-5 w-5 text-primary mr-2" />
                    <h3 className="text-xl font-bold">{tokenPair}</h3>
                  </div>
                  
                  <div>
                    {managedNft && managedNft.status ? (
                      <Badge 
                        variant={
                          managedNft.status === "Active" ? "success" : 
                          managedNft.status === "Closed" ? "destructive" : 
                          managedNft.status === "Finalized" ? "default" : 
                          "outline"
                        } 
                        className="px-3 py-1 h-7 flex items-center gap-1.5 text-sm font-medium"
                      >
                        {managedNft.status === "Active" ? (
                          <>
                            <CheckCircle className="h-4 w-4" />
                            <span>Activo</span>
                          </>
                        ) : managedNft.status === "Closed" ? (
                          <>
                            <XCircle className="h-4 w-4" />
                            <span>Cerrado</span>
                          </>
                        ) : managedNft.status === "Finalized" ? (
                          <>
                            <CheckCircle className="h-4 w-4" />
                            <span>Finalizado</span>
                          </>
                        ) : (
                          <>
                            <Info className="h-4 w-4" />
                            <span>Desconocido</span>
                          </>
                        )}
                      </Badge>
                    ) : nftDetails.inRange !== undefined ? (
                      <Badge 
                        variant={nftDetails.inRange ? "success" : "destructive"} 
                        className="px-3 py-1 h-7 flex items-center gap-1.5 text-sm font-medium"
                      >
                        {nftDetails.inRange ? (
                          <>
                            <CheckCircle className="h-4 w-4" />
                            <span>En rango</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="h-4 w-4" />
                            <span>Fuera de rango</span>
                          </>
                        )}
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="px-3 py-1 h-7 flex items-center gap-1.5 text-sm font-medium">
                        <Info className="h-4 w-4" />
                        <span>No administrado</span>
                      </Badge>
                    )}
                  </div>
                </div>
                
                {/* Tarjetas de datos */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {/* Fee */}
                  <div className="bg-slate-100/80 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center mb-1.5 text-slate-500 dark:text-slate-400 text-xs">
                      <BarChart3 className="h-3.5 w-3.5 mr-1.5 text-amber-500" />
                      <span>Fee</span>
                    </div>
                    <div className="font-bold text-sm">
                      {nftDetails.fee}
                    </div>
                  </div>
                  
                  {/* Versión */}
                  <div className="bg-slate-100/80 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center mb-1.5 text-slate-500 dark:text-slate-400 text-xs">
                      <Layers className="h-3.5 w-3.5 mr-1.5 text-indigo-500" />
                      <span>Versión</span>
                    </div>
                    <div className="font-bold text-sm">{nftDetails.version}</div>
                  </div>
                  
                  {/* Valor */}
                  <div className="bg-slate-100/80 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center mb-1.5 text-slate-500 dark:text-slate-400 text-xs">
                      <Banknote className="h-3.5 w-3.5 mr-1.5 text-emerald-500" />
                      <span>Valor actualizado en tiempo real</span>
                    </div>
                    <div className="font-bold text-sm">
                      {nftDetails.valueUsdc ? (
                        <span className="text-emerald-600">${Math.floor(Number(nftDetails.valueUsdc))} USD</span>
                      ) : managedNft && managedNft.valueUsdc ? (
                        <span className="text-emerald-600">${Math.floor(Number(managedNft.valueUsdc))} USD</span>
                      ) : (
                        nftDetails.poolValue || "No disponible"
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Estado del listado */}
                {nftDetails.marketplaceStatus?.isListed && (
                  <div className="mt-4 bg-gradient-to-r from-primary/10 to-primary/5 p-4 rounded-lg border border-primary/20">
                    <div className="flex items-center mb-2">
                      <Activity className="h-5 w-5 text-primary mr-2" />
                      <h4 className="font-semibold">Información de listado</h4>
                    </div>
                    <div className="grid grid-cols-2 gap-4 ml-7">
                      <div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">Listado en</div>
                        <div className="font-medium">{nftDetails.marketplaceStatus.marketplace}</div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">Precio</div>
                        <div className="font-medium">{nftDetails.marketplaceStatus.price}</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Separador con gradiente */}
            <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-700 to-transparent mb-6"></div>
            
            {/* Panel inferior con datos blockchain */}
            <div className="space-y-5">
              <h4 className="font-semibold flex items-center">
                <div className="h-4 w-1 bg-primary rounded-full mr-2"></div>
                Datos de blockchain
              </h4>
              
              {/* Dirección del contrato */}
              <div className="space-y-1.5">
                <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                  <Info className="h-4 w-4 mr-1.5 text-slate-400" />
                  <span>Dirección del contrato</span>
                </div>
                <div className="flex items-center">
                  <code className="text-xs bg-slate-100 dark:bg-slate-800 p-2 rounded-l-md border border-slate-200 dark:border-slate-700 flex-1 truncate">
                    {nftDetails.contractAddress}
                  </code>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-8 rounded-l-none border-l-0 bg-slate-50 dark:bg-slate-800" 
                    asChild
                  >
                    <a
                      href={`https://${nftDetails.network === "ethereum" ? "etherscan.io" : "polygonscan.com"}/address/${nftDetails.contractAddress}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </Button>
                </div>
              </div>
              
              {/* Dirección del pool */}
              <div className="space-y-1.5">
                <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                  <Info className="h-4 w-4 mr-1.5 text-slate-400" />
                  <span>Dirección del pool</span>
                </div>
                <PoolAddressDisplay nftDetails={nftDetails} />
              </div>
              
              {/* Descripción */}
              {nftDetails.description && (
                <div className="space-y-1.5">
                  <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                    <Info className="h-4 w-4 mr-1.5 text-slate-400" />
                    <span>Descripción</span>
                  </div>
                  <div className="text-sm p-3 bg-slate-100/50 dark:bg-slate-800/30 rounded-md border border-slate-200 dark:border-slate-700">
                    {nftDetails.description || "Sin descripción disponible."}
                  </div>
                </div>
              )}
            </div>
            
            {/* Acciones */}
            <div className="flex justify-between items-center gap-3 mt-8">
              {/* Botón de activación - visible para todos */}
              <Button 
                variant={managedNft?.status === "Active" ? "outline" : "default"} 
                onClick={handleActivateNFT}
                disabled={activateNftMutation.isPending || managedNft?.status === "Active"}
                className="relative overflow-hidden"
              >
                {activateNftMutation.isPending ? (
                  <>
                    <Spinner className="h-4 w-4 mr-2" />
                    Procesando...
                  </>
                ) : managedNft?.status === "Active" ? (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Ya activado
                  </>
                ) : (
                  <>
                    <Activity className="h-4 w-4 mr-2" />
                    Activar NFT
                  </>
                )}
              </Button>
              
              {/* Botones del lado derecho */}
              <div className="flex items-center gap-3">
                <Button 
                  variant="outline" 
                  onClick={onClose} 
                  className="border-slate-200 dark:border-slate-700"
                >
                  Cerrar
                </Button>
                
                {/* Botón OpenSea - visible para todos */}
                <Button 
                  variant="outline"
                  className="border-slate-200 dark:border-slate-700 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-700"
                  asChild
                >
                  <a
                    href={`https://opensea.io/assets/${nftDetails.network === "ethereum" ? "ethereum" : nftDetails.network === "unichain" ? "unichain" : "matic"}/${nftDetails.contractAddress}/${tokenId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center"
                  >
                    Ver en OpenSea
                    <ExternalLink className="h-4 w-4 ml-2" />
                  </a>
                </Button>
                
                {/* Botón Uniswap - solo visible para administradores */}
                {isAdmin && (
                  <Button 
                    className="bg-gradient-to-br from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80"
                    asChild
                  >
                    <a
                      href={(() => {
                        // Para NFT #277909 de Unichain, usar la dirección del pool específica
                        if (tokenId === "277909" && nftDetails.network === "unichain") {
                          return "https://app.uniswap.org/explore/pools/unichain/0x3258f413c7a88cda2fa8709a589d221a80f6574f63df5a5b6774485d8acc39d9";
                        }
                        
                        // Extraer la dirección del pool para otros NFTs
                        let poolAddress = nftDetails.poolAddress || "";
                        
                        // Si no hay dirección del pool, intentar extraerla de la descripción
                        if (!poolAddress && nftDetails.description) {
                          const poolAddressMatch = nftDetails.description.match(/Pool Address:\s*(0x[a-fA-F0-9]+)/);
                          if (poolAddressMatch && poolAddressMatch[1]) {
                            poolAddress = poolAddressMatch[1];
                          } else {
                            // Si no hay Pool Address, intentar con Pool Manager (para V4)
                            const poolManagerMatch = nftDetails.description.match(/Pool Manager Address:\s*(0x[a-fA-F0-9]+)/);
                            if (poolManagerMatch && poolManagerMatch[1]) {
                              poolAddress = poolManagerMatch[1];
                            }
                          }
                        }
                        
                        // Obtener la red correcta para la URL
                        const networkPath = nftDetails.network === "ethereum" ? "ethereum" : 
                                          nftDetails.network === "unichain" ? "unichain" : "polygon";
                        
                        // Si hemos encontrado una dirección de pool
                        if (poolAddress) {
                          // Para ambas versiones V3 y V4, usar el mismo formato de URL
                          return `https://app.uniswap.org/explore/pools/${networkPath}/${poolAddress}`;
                        }
                        
                        // Como última opción, usar la URL de la posición
                        const versionPath = nftDetails?.version?.includes("V3") ? "v3" : "v4";
                        return `https://app.uniswap.org/positions/${versionPath}/${networkPath}/${tokenId}`;
                      })()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center"
                    >
                      Ver en Uniswap
                      <ExternalLink className="h-4 w-4 ml-2" />
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="py-12 px-6 text-center">
            <AlertCircle className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No se pudieron cargar los detalles</h3>
            <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              No hemos podido recuperar la información del NFT #{tokenId} en este momento.
            </p>
            <Button variant="outline" onClick={onClose} className="mt-6">
              Cerrar
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default NFTDetailsDialog;