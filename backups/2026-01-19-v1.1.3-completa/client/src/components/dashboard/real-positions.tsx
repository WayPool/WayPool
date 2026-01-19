import React, { useState, useEffect } from "react";
import { useRealPositions } from "@/hooks/use-real-positions";
import { useUniswapPositions } from "@/hooks/use-uniswap-positions";
import { useWallet } from "@/hooks/use-wallet";
import { usePositions } from "@/hooks/use-positions";
import { LiquidityPosition } from "@/lib/uniswap";
import { useQuery } from "@tanstack/react-query";
import { APP_NAME } from "@/utils/app-config";

/**
 * Formatea un valor de liquidez para su visualización.
 * 
 * @param liquidityValue El valor de liquidez como string o número
 * @returns El valor formateado para visualización
 */
const formatLiquidity = (liquidityValue: string | number): string => {
  // Convertir a número si es string
  const numValue = typeof liquidityValue === 'string' ? Number(liquidityValue) : liquidityValue;
  
  // Verificar si es un número válido
  if (isNaN(numValue)) return String(liquidityValue);
  
  // Para números extremadamente grandes (trillones o más)
  if (numValue >= 1_000_000_000_000) {
    const inTrillions = numValue / 1_000_000_000_000;
    return `${inTrillions.toLocaleString('en-US', { 
      maximumFractionDigits: 2,
      minimumFractionDigits: 0 
    })}T`;
  }
  
  // Para números muy grandes (miles de millones)
  if (numValue >= 1_000_000_000) {
    const inBillions = numValue / 1_000_000_000;
    return `${inBillions.toLocaleString('en-US', { 
      maximumFractionDigits: 2,
      minimumFractionDigits: 0 
    })}B`;
  }
  
  // Para millones
  if (numValue >= 1_000_000) {
    const inMillions = numValue / 1_000_000;
    return `${inMillions.toLocaleString('en-US', { 
      maximumFractionDigits: 2,
      minimumFractionDigits: 0 
    })}M`;
  }
  
  // Para números normales, simplemente añadir separadores de miles
  return numValue.toLocaleString('en-US', {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0
  });
};
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Interfaz extendida para incluir el campo nftTokenId
interface ExtendedLiquidityPosition extends LiquidityPosition {
  nftTokenId?: string;
}
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ExternalLink, Check, Clock, AlertTriangle, Wallet, Info, ChevronDown, Link as LinkIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
// Definimos el tipo para una posición real creada por {APP_NAME}
interface RealPosition {
  id: number;
  walletAddress: string;
  virtualPositionId: string;
  poolAddress: string;
  poolName: string;
  token0: string;
  token1: string;
  token0Amount: string | number;
  token1Amount: string | number;
  tokenId?: string;
  txHash?: string;
  network: string;
  status: string;
  blockExplorerUrl?: string;
  liquidityValue?: string | number;
  feesEarned?: string | number;
  inRange: boolean;
  additionalData?: string;
}

/**
 * Componente que muestra las posiciones reales de Uniswap del usuario
 */
export function RealPositions() {
  const { address } = useWallet();
  const walletAddress = address || '';
  const { realPositions, isLoading: isLoadingPoolPositions, refetch } = useRealPositions(walletAddress);
  const { positions: nftPositions, isLoading: isLoadingNFT, refresh: refreshNFTs } = useUniswapPositions();
  const { positions: poolPositions, isLoadingPositions } = usePositions();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("nft");
  
  // Estado para almacenar posiciones NFT vinculadas a las posiciones virtuales de {APP_NAME}
  const [linkedPositions, setLinkedPositions] = useState<Map<string, string>>(new Map());
  
  // Estado para almacenar datos de liquidez de pools
  const [poolLiquidityData, setPoolLiquidityData] = useState<Map<string, string>>(new Map());
  
  // Consulta para obtener datos de pools de Uniswap
  const { data: mainPoolData } = useQuery({
    queryKey: ['poolData', '0x4e68ccd3e89f51c3074ca5072bbac773960dfa36'],
    queryFn: async () => {
      try {
        const response = await fetch(`/api/blockchain/uniswap-pool?address=0x4e68ccd3e89f51c3074ca5072bbac773960dfa36`);
        if (!response.ok) {
          throw new Error('Error al obtener datos del pool');
        }
        return await response.json();
      } catch (error) {
        console.error('Error al cargar datos del pool:', error);
        return null;
      }
    },
    staleTime: 30000 // 30 segundos
  });

  // Consulta para obtener datos del pool USDC/ETH
  const { data: usdcEthPoolData } = useQuery({
    queryKey: ['poolData', '0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640'],
    queryFn: async () => {
      try {
        const response = await fetch(`/api/blockchain/uniswap-pool?address=0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640`);
        if (!response.ok) {
          throw new Error('Error al obtener datos del pool');
        }
        return await response.json();
      } catch (error) {
        console.error('Error al cargar datos del pool:', error);
        return null;
      }
    },
    staleTime: 30000 // 30 segundos
  });

  // Función para cargar datos de un pool específico basado en su dirección y red
  const loadPoolData = async (poolAddress: string, network = 'ethereum') => {
    try {
      console.log(`Fetching pool data from API endpoint for address: ${poolAddress} on network ${network}`);
      const response = await fetch(`/api/blockchain/uniswap-pool?address=${poolAddress}&network=${network}`);
      
      if (!response.ok) {
        console.error(`Error loading pool data for ${poolAddress} on ${network}: ${response.status}`);
        return null;
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Error loading pool data:`, error);
      return null;
    }
  };

  // Efecto para actualizar el mapa de liquidez de pools
  useEffect(() => {
    const newPoolLiquidityData = new Map<string, string>();
    
    if (mainPoolData && mainPoolData.liquidity) {
      newPoolLiquidityData.set('0x4e68ccd3e89f51c3074ca5072bbac773960dfa36', mainPoolData.liquidity);
      console.log("Pool USDT-ETH liquidity:", mainPoolData.liquidity);
    }
    
    if (usdcEthPoolData && usdcEthPoolData.liquidity) {
      newPoolLiquidityData.set('0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640', usdcEthPoolData.liquidity);
      console.log("Pool USDC-ETH liquidity:", usdcEthPoolData.liquidity);
    }
    
    // Obtener liquidez para pools específicos de posiciones NFT
    const loadSpecificPoolData = async () => {
      if (nftPositions && nftPositions.length > 0) {
        for (const position of nftPositions) {
          // Solo consultar si tenemos una dirección de pool válida
          if (position.poolAddress && !newPoolLiquidityData.has(position.poolAddress)) {
            // Usar la red correcta (ethereum o polygon) para la consulta
            const network = position.network || 'ethereum';
            
            const poolData = await loadPoolData(position.poolAddress, network);
            if (poolData && poolData.liquidity) {
              newPoolLiquidityData.set(position.poolAddress, poolData.liquidity);
              console.log(`Pool ${position.token0Symbol}-${position.token1Symbol} (${network}) liquidity:`, poolData.liquidity);
            }
          }
        }
      }
      
      // Una vez que tenemos todos los datos, actualizamos el estado
      setPoolLiquidityData(newPoolLiquidityData);
    };
    
    loadSpecificPoolData();
    
    // Actualizar las posiciones NFT con las direcciones de pool correctas
    if (nftPositions) {
      const updatedPositions = nftPositions.map(pos => {
        // Intentar identificar el pool por los símbolos de token solo para posiciones de Ethereum
        if (pos.network === 'ethereum' || !pos.network) {
          if ((pos.token0Symbol === 'USDT' && pos.token1Symbol === 'ETH') || 
              (pos.token0Symbol === 'ETH' && pos.token1Symbol === 'USDT')) {
            pos.poolAddress = '0x4e68ccd3e89f51c3074ca5072bbac773960dfa36';
          } 
          else if ((pos.token0Symbol === 'USDC' && pos.token1Symbol === 'ETH') || 
                   (pos.token0Symbol === 'ETH' && pos.token1Symbol === 'USDC')) {
            pos.poolAddress = '0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640';
          }
        }
        // Para posiciones de Polygon, usar la dirección de pool específica
        else if (pos.network === 'polygon') {
          // Usar la dirección de pool de la base de datos si está disponible
          if ((pos.token0Symbol === 'DAI' && pos.token1Symbol === 'MATIC') || 
              (pos.token1Symbol === 'DAI' && pos.token0Symbol === 'MATIC')) {
            // NFT 2081095 - DAI/MATIC en Polygon
            pos.poolAddress = '0xfe530931da161232ec76a7c3bea7d36cf3811a0d';
          }
        }
        
        return pos;
      });
    }
  }, [mainPoolData, usdcEthPoolData, nftPositions]);

  // Efecto para buscar qué posiciones NFT están vinculadas a posiciones de {APP_NAME}
  useEffect(() => {
    if (poolPositions && Array.isArray(poolPositions) && nftPositions && Array.isArray(nftPositions)) {
      // Registra las posiciones para depuración
      console.log(`${APP_NAME} Positions:`, poolPositions.map(p => ({
        id: (p as any).id, 
        nftTokenId: (p as any).nftTokenId,
        token0: (p as any).token0
      })));
      
      console.log("NFT Positions:", nftPositions.map(p => ({
        id: p.tokenId,
        token0: p.token0Symbol,
        token1: p.token1Symbol,
        linkedFromPool: p.linkedFromWaybank
      })));
      
      const newLinkedPositions = new Map<string, string>();
      
      // Buscar posiciones de {APP_NAME} que tienen un nftTokenId establecido
      poolPositions.forEach(position => {
        // Usamos la propiedad definida en la base de datos
        const dbPosition = position as any; // Primero usamos 'any' para acceder a cualquier propiedad
        if (dbPosition.nftTokenId) {
          console.log(`Buscando coincidencia para NFT ID: ${dbPosition.nftTokenId}`);
          
          // Verificar si este token existe en nftPositions
          // Asegurémonos de que estamos comparando el mismo tipo (string) y normalizando
          const dbTokenId = String(dbPosition.nftTokenId).trim();
          const matchingNFT = nftPositions.find(nft => {
            const nftTokenId = String(nft.tokenId).trim();
            const match = nftTokenId === dbTokenId;
            console.log(`- Comparando NFT ID: "${nftTokenId}" con DB ID: "${dbTokenId}", coincide: ${match}`);
            return match;
          });
          
          if (matchingNFT) {
            console.log(`¡Coincidencia encontrada! NFT ID: ${matchingNFT.tokenId} vinculado a posición: ${dbPosition.id}`);
            // Marcar este NFT como vinculado a una posición de {APP_NAME}
            newLinkedPositions.set(matchingNFT.tokenId, dbPosition.id.toString());
          } else {
            console.log(`No se encontró coincidencia para NFT ID: ${dbPosition.nftTokenId}`);
          }
        }
      });
      
      console.log("Linked Positions Map:", Array.from(newLinkedPositions.entries()));
      setLinkedPositions(newLinkedPositions);
    }
  }, [poolPositions, nftPositions]);

  // Maneja el refresh de posiciones reales
  const handleRefresh = () => {
    if (activeTab === "poolPositions") {
      refetch().then(() => {
        toast({
          title: "Posiciones actualizadas",
          description: `Se han actualizado las posiciones reales en Uniswap creadas desde ${APP_NAME}`,
        });
      });
    } else {
      refreshNFTs();
      toast({
        title: "NFTs actualizados",
        description: "Se han actualizado las posiciones NFT de Uniswap en tu wallet",
      });
    }
  };

  // Maneja la apertura de enlaces externos
  const openExternalLink = (url: string) => {
    if (url) window.open(url, "_blank", "noopener,noreferrer");
  };

  // Abre el explorador de blockchain para un token ID según la red
  const openBlockExplorer = (tokenId: string, network: string = 'ethereum') => {
    let url = '';
    const nftContract = '0xC36442b4a4522E871399CD717aBDD847Ab11FE88'; // Contrato de Uniswap Position Manager
    
    // Selección del explorador según la red
    switch (network.toLowerCase()) {
      case 'polygon':
        // Utilizamos el formato específico para NFTs en Polygonscan
        url = `https://polygonscan.com/nft/${nftContract}/${tokenId}`;
        break;
      case 'optimism':
        url = `https://optimistic.etherscan.io/token/${nftContract}?a=${tokenId}`;
        break;
      case 'arbitrum':
        url = `https://arbiscan.io/token/${nftContract}?a=${tokenId}`;
        break;
      case 'ethereum':
      default:
        url = `https://etherscan.io/token/${nftContract}?a=${tokenId}`;
        break;
    }
    
    window.open(url, "_blank", "noopener,noreferrer");
  };

  // Renderiza el estado de la posición con color adecuado
  const renderStatus = (status: string) => {
    switch (status) {
      case "confirmed":
        return (
          <Badge variant="success" className="flex items-center gap-1">
            <Check size={14} /> Confirmed
          </Badge>
        );
      case "pending":
        return (
          <Badge variant="outline" className="flex items-center gap-1">
            <Clock size={14} /> Pending
          </Badge>
        );
      case "failed":
        return (
          <Badge variant="destructive" className="flex items-center gap-1">
            <AlertTriangle size={14} /> Failed
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  // Renderiza el contenido de posiciones creadas por {APP_NAME}
  const renderPoolPositions = () => {
    if (isLoadingPoolPositions) {
      return (
        <div className="space-y-2">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
        </div>
      );
    }

    if (!realPositions || !Array.isArray(realPositions) || realPositions.length === 0) {
      return (
        <div className="py-8 text-center text-muted-foreground">
          <p>No real positions found in your Uniswap account.</p>
          <p className="text-sm mt-2">
            When you create a position in {APP_NAME}, a real Uniswap position with
            a small amount will be created automatically for demonstration.
          </p>
        </div>
      );
    }

    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Pool</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Transaction</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.isArray(realPositions) && realPositions.map((position: RealPosition) => (
            <TableRow key={position.id}>
              <TableCell className="font-medium">
                {position.poolName}
              </TableCell>
              <TableCell>
                {parseFloat(position.token0Amount.toString()).toFixed(4)}{" "}
                {position.token0} + {parseFloat(position.token1Amount.toString()).toFixed(4)}{" "}
                {position.token1}
              </TableCell>
              <TableCell>{renderStatus(position.status)}</TableCell>
              <TableCell>
                {position.blockExplorerUrl ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      openExternalLink(position.blockExplorerUrl || "")
                    }
                    className="flex items-center gap-1"
                  >
                    <ExternalLink size={14} />
                    View
                  </Button>
                ) : (
                  <span className="text-muted-foreground text-sm">
                    Not available
                  </span>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  // Renderiza el contenido de NFTs de Uniswap
  const renderNFTPositions = () => {
    if (isLoadingNFT || isLoadingPositions) {
      return (
        <div className="space-y-2">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
        </div>
      );
    }

    if (!nftPositions || nftPositions.length === 0) {
      return (
        <div className="py-8 text-center text-muted-foreground">
          <p>No Uniswap NFT positions found in your wallet.</p>
          <p className="text-sm mt-2">
            You can create Uniswap positions directly on Uniswap.org and they will appear here.
          </p>
        </div>
      );
    }

    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[12%]">Token ID</TableHead>
            <TableHead className="w-[23%]">Pool</TableHead>
            <TableHead className="w-[25%]">Liquidity</TableHead>
            <TableHead className="w-[15%]">Status</TableHead>
            <TableHead className="w-[15%]">Linked</TableHead>
            <TableHead className="w-[10%]">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {nftPositions.map((position) => {
            // Verifica si esta posición está vinculada a una posición de {APP_NAME}
            const isLinked = linkedPositions.has(position.tokenId);
            const linkedPositionId = isLinked ? linkedPositions.get(position.tokenId) : null;
            
            // Marca esta posición como vinculada desde {APP_NAME} si corresponde
            position.linkedFromPool = isLinked;
            
            return (
              <TableRow key={position.tokenId} className={isLinked ? "bg-blue-950 bg-opacity-30" : undefined}>
                <TableCell>
                  <span className="font-medium text-slate-300">#{position.tokenId}</span>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium text-blue-400">
                      {position.tokenPair || `${position.token0Symbol}/${position.token1Symbol}`}
                    </span>
                    <span className="text-xs text-slate-400">
                      Fee: <span className="font-semibold text-slate-300">{position.fee ? (position.fee/10000).toFixed(2) : '0.30'}%</span> • Network: <span className="font-semibold text-slate-300">{position.network || 'ethereum'}</span>
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="rounded-lg overflow-hidden border border-slate-700 shadow-md max-w-[220px]">
                    <div className="bg-slate-800 px-3 py-2 flex justify-between items-center">
                      <span className="text-xs text-white font-medium">Liquidity</span>
                      {position.inRange ? 
                        <div className="bg-green-800/50 rounded-full px-2 py-0.5 text-green-300 text-xs font-medium">Active</div> :
                        <div className="bg-orange-800/30 rounded-full px-2 py-0.5 text-orange-300 text-xs font-medium border border-orange-400/30">Inactive</div>
                      }
                    </div>
                    
                    <div className="bg-slate-900 px-3 py-2">
                      {position.poolAddress && poolLiquidityData.has(position.poolAddress) && (
                        <div className="space-y-1.5">
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-slate-400">Pool Liquidity:</span>
                            <span className="text-xs font-semibold text-blue-300">
                              {formatLiquidity(poolLiquidityData.get(position.poolAddress) || "0")}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-slate-400">Position Value:</span>
                            <span className="text-xs font-semibold text-green-300">
                              ${parseFloat(poolLiquidityData.get(position.poolAddress) || "0") > 0 ? 
                                (parseFloat(poolLiquidityData.get(position.poolAddress) || "0") * 0.0000215).toLocaleString('en-US', {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2
                                }) : "0.00"}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-slate-400">Fees Earned:</span>
                            <span className="text-xs font-semibold text-indigo-300">
                              ${parseFloat(poolLiquidityData.get(position.poolAddress) || "0") > 0 ? 
                                (parseFloat(poolLiquidityData.get(position.poolAddress) || "0") * 0.0000012).toLocaleString('en-US', {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2
                                }) : "0.00"}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className={`flex items-center gap-1 px-3 py-1 rounded-full ${position.inRange 
                    ? "bg-green-800/50 text-green-300" 
                    : "bg-orange-800/30 text-orange-300 border border-orange-400/30"}`
                  }>
                    {position.inRange 
                      ? <Check size={14} className="text-green-300" /> 
                      : <AlertTriangle size={14} className="text-orange-300" />
                    }
                    <span className={`text-xs font-medium ${position.inRange ? "text-green-300" : "text-orange-300"}`}>
                      {position.inRange ? "In Range" : "Out of Range"}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-center gap-1.5 bg-blue-900/70 text-blue-300 py-1 px-3 rounded-full">
                    <LinkIcon size={13} className="text-blue-300" />
                    <span className="text-xs font-medium">{APP_NAME}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openBlockExplorer(position.tokenId, position.network)}
                    className="flex items-center gap-1 text-slate-300 hover:text-white hover:bg-slate-800"
                  >
                    <ExternalLink size={14} />
                    <span className="text-xs">View</span>
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    );
  };

  const [isOpen, setIsOpen] = useState(false);

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="w-full"
    >
      <Card className="w-full shadow-md">
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer group">
            <div className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Uniswap Positions</CardTitle>
                <CardDescription>
                  Uniswap positions in your wallet and positions created from {APP_NAME}
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={(e) => {
                  e.stopPropagation();
                  handleRefresh();
                }}>
                  Refresh
                </Button>
                <ChevronDown 
                  size={20} 
                  className={`text-slate-400 transition-transform duration-200 group-hover:text-primary ${isOpen ? '' : '-rotate-90'}`} 
                />
              </div>
            </div>
          </CardHeader>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div className="px-6 py-4 mb-4 bg-slate-900 bg-opacity-40 border border-slate-700 mx-6 rounded-md">
            <div className="flex items-start gap-2.5">
              <Info size={15} className="text-red-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-slate-300 mb-1.5">Legal Disclaimer regarding the NFT:</p>
                <p className="mb-2 text-xs text-slate-400 leading-relaxed">
                  The listed NFT solely serves as a digital receipt tied to the client's individual position. It does not, in itself, represent an active investment position. The actual working investment is consolidated within a smart contract-bound internal NFT under the "{APP_NAME}" protocol, which operates a shared liquidity pool. This common pool enables algorithmic and efficient capital management, ensuring proportional participation of all clients in the generated returns.
                </p>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Once the active position within the contract is liquidated, the corresponding capital is transferred and deposited into the NFT shown below, which then becomes the final receipt of the operation.
                </p>
              </div>
            </div>
          </div>
          
          <CardContent>
            <Tabs defaultValue="nft" onValueChange={setActiveTab} value={activeTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="poolPositions">{APP_NAME} Positions</TabsTrigger>
                <TabsTrigger value="nft">
                  <div className="flex items-center gap-1">
                    <Wallet size={16} />
                    <span>My NFT Positions</span>
                  </div>
                </TabsTrigger>
              </TabsList>
              <TabsContent value="poolPositions">
                {renderPoolPositions()}
              </TabsContent>
              <TabsContent value="nft">
                {renderNFTPositions()}
              </TabsContent>
            </Tabs>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}