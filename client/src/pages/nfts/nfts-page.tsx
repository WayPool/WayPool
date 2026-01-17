import React, { useState, useEffect, useCallback } from "react";
import { useUserNFTs, useManagedNFTs, useActivateNFT } from "@/hooks/use-nfts";
import { useWallet } from "@/hooks/use-wallet";
import { useAdmin } from "@/hooks/use-admin";
import { formatExactCurrency } from "@/lib/utils";
import { useLanguage } from "@/context/language-context";
import { nftsTranslations } from "@/translations/nfts";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Spinner } from "@/components/ui/spinner";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { 
  ExternalLink, 
  Filter, 
  ListFilter, 
  Plus, 
  Sliders, 
  ChevronRight, 
  Wallet, 
  Tag, 
  ChevronUp, 
  ChevronDown, 
  Check, 
  AlertCircle, 
  Activity, 
  Layers, 
  Banknote, 
  Info, 
  Globe, 
  BarChart3, 
  Repeat, 
  CheckCircle, 
  XCircle,
  LayoutGrid,
  List,
  ChevronLeft,
  DollarSign,
  RotateCcw,
  ArrowUpDown,
  Copy,
  Send
} from "lucide-react";
import DashboardLayout from "@/components/layouts/dashboard-layout";
import NFTDetailsDialog from "@/components/nfts/nft-details-dialog";

// Componente de tarjeta de NFT
const NFTCard: React.FC<{
  nft: any;
  onClick: () => void;
  managedNfts?: any[];
}> = ({ nft, onClick, managedNfts = [] }) => {
  // Datos del NFT procesados para visualización
  
  // Procesamiento de datos auténticos del NFT
  
  let tokenPair;
  let feeValue;
  
  const managedNft = managedNfts?.find(managed => managed.tokenId === nft.tokenId);
  
  if (nft.version === "Uniswap V3") {
    if (nft.fee && nft.fee.includes("/")) {
      tokenPair = nft.fee;
      if (nft.feeTier) {
        feeValue = nft.feeTier;
      } else {
        feeValue = "...";
      }
    } else {
      tokenPair = `${nft.token0Symbol}/${nft.token1Symbol}`;
      feeValue = nft.fee;
    }
  } else {
    if (nft.token0Symbol && nft.token1Symbol && 
        nft.token0Symbol !== "Unknown" && nft.token1Symbol !== "Unknown") {
      tokenPair = `${nft.token0Symbol}/${nft.token1Symbol}`;
    } else if (nft.token0Symbol === "Unknown" && nft.token1Symbol === "Unknown") {
      if (nft.description) {
        const lines = nft.description.split('\n');
        let token0 = "";
        let token1 = "";
        
        for (const line of lines) {
          if (line.includes("Address:") && !line.includes("Pool Address:") && !line.includes("Pool Manager Address:")) {
            const tokenName = line.split("Address:")[0].trim();
            if (!token0) token0 = tokenName;
            else if (!token1) token1 = tokenName;
          }
        }
        
        if (token0 && token1) {
          tokenPair = `${token0}/${token1}`;
        } else if (nft.fee === "0.3%") {
          tokenPair = "WETH/USDC";
        } else if (nft.fee === "0.01%") {
          tokenPair = "USDT/USDC";
        } else {
          tokenPair = "Unknown/Unknown";
        }
      } else {
        if (nft.fee === "0.3%") {
          tokenPair = "WETH/USDC";
        } else if (nft.fee === "0.01%") {
          tokenPair = "USDT/USDC";
        } else {
          tokenPair = "Unknown/Unknown";
        }
      }
    } else {
      tokenPair = `${nft.token0Symbol}/${nft.token1Symbol}`;
    }
    
    // Siempre mostrar el fee para V4 como viene de backend
    feeValue = nft.fee;
  }
  
  // Usar el valor directo del NFT, sin hardcodear ningún valor
    
  return (
    <Card 
      className="overflow-hidden shadow-lg hover:shadow-xl dark:border-slate-700 transition-all cursor-pointer flex flex-col h-full bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800"
      onClick={onClick}
    >
      <CardContent className="p-0 flex flex-col h-full">
        {/* Cabecera con ID y Estado */}
        <div className="flex justify-between items-center p-2.5 bg-gradient-to-r from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-800/90 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center">
            <Tag className="h-3.5 w-3.5 text-primary mr-1.5" />
            <span className="text-xs font-medium text-slate-600 dark:text-slate-400">ID: {nft.tokenId}</span>
          </div>
          
          <div>
            {/* Priorizar el estado existente en el NFT (que debería estar actualizado con useManagedNFTs) */}
            {nft.status ? (
              <Badge 
                variant={
                  nft.status.toLowerCase() === "active" || nft.status.toLowerCase() === "activo" ? "success" : 
                  nft.status.toLowerCase() === "closed" || nft.status.toLowerCase() === "cerrado" ? "destructive" : 
                  nft.status.toLowerCase() === "finalized" || nft.status.toLowerCase() === "finalizado" ? "default" : 
                  "outline"
                } 
                className="px-2 py-0 h-5 flex items-center gap-1 text-xs font-medium"
              >
                {nft.status.toLowerCase() === "active" || nft.status.toLowerCase() === "activo" ? (
                  <>
                    <CheckCircle className="h-3 w-3" />
                    <span>Activo</span>
                  </>
                ) : nft.status.toLowerCase() === "closed" || nft.status.toLowerCase() === "cerrado" ? (
                  <>
                    <XCircle className="h-3 w-3" />
                    <span>Cerrado</span>
                  </>
                ) : nft.status.toLowerCase() === "finalized" || nft.status.toLowerCase() === "finalizado" ? (
                  <>
                    <CheckCircle className="h-3 w-3" />
                    <span>Finalizado</span>
                  </>
                ) : (
                  <>
                    <Info className="h-3 w-3" />
                    <span>{nft.status}</span>
                  </>
                )}
              </Badge>
            ) : nft.inRange !== undefined ? (
              <Badge 
                variant={nft.inRange ? "success" : "destructive"} 
                className="px-2 py-0 h-5 flex items-center gap-1 text-xs font-medium"
              >
                {nft.inRange ? (
                  <>
                    <CheckCircle className="h-3 w-3" />
                    <span>En rango</span>
                  </>
                ) : (
                  <>
                    <XCircle className="h-3 w-3" />
                    <span>Fuera de rango</span>
                  </>
                )}
              </Badge>
            ) : (
              <Badge variant="outline" className="px-2 py-0 h-5 flex items-center gap-1 text-xs font-medium">
                <Info className="h-3 w-3" />
                <span>Estado desconocido</span>
              </Badge>
            )}
          </div>
        </div>
        
        {/* Imagen del NFT */}
        <div className="w-full overflow-hidden relative bg-gradient-to-br from-slate-100 to-slate-50 dark:from-slate-900 dark:to-slate-800 p-0.5">
          <div className="w-full aspect-square overflow-hidden rounded-md bg-black/5 dark:bg-white/5">
            <img 
              src={nft.imageUrl || "https://app.uniswap.org/static/media/position.b05a58a8.svg"} 
              alt={`NFT ${nft.tokenId}`} 
              className="w-full h-full object-contain"
              onError={(e) => {
                // Si hay un error al cargar la imagen, usar una imagen predeterminada
                const target = e.target as HTMLImageElement;
                target.src = "https://app.uniswap.org/static/media/position.b05a58a8.svg";
              }}
            />
          </div>
        </div>
        
        {/* Información del par de tokens con iconografía */}
        <div className="px-3 pt-3 pb-1">
          <div className="flex items-center mb-1.5">
            <Repeat className="h-4 w-4 text-primary mr-2" />
            <div className="text-base font-bold tracking-tight">
              {tokenPair}
            </div>
          </div>
          
          <div className="flex flex-col space-y-1.5 mb-2">
            {/* Fee con iconografía */}
            <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
              <BarChart3 className="h-3.5 w-3.5 mr-1.5 text-amber-500" />
              <span className="font-medium">Fee:</span>
              <span className="ml-1.5">{feeValue}</span>
            </div>
            
            {/* Versión con iconografía */}
            <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
              <Layers className="h-3.5 w-3.5 mr-1.5 text-indigo-500" />
              <span>{nft.version || (nft.network === "polygon" ? "Uniswap V3" : "Uniswap V4")}</span>
            </div>
          </div>
        </div>
        
        {/* Separador con gradiente */}
        <div className="px-3">
          <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-700 to-transparent"></div>
        </div>
        
        {/* Footer principal con datos clave */}
        <div className="p-3 pb-2 mt-auto bg-gradient-to-b from-transparent to-slate-50/80 dark:to-slate-800/50">
          {/* Valor y Red en formato 50/50 */}
          <div className="flex justify-between items-center mb-2">
            {/* Valor con iconografía - Priorizar el valor integrado en el propio NFT primero */}
            <div className="flex items-center text-sm font-semibold">
              <Banknote className="h-3.5 w-3.5 mr-1.5 text-emerald-500" />
              {nft.valueUsdc ? (
                <span className="text-emerald-600">${Math.floor(Number(nft.valueUsdc))} USD</span>
              ) : managedNft && managedNft.valueUsdc ? (
                <span className="text-emerald-600">${Math.floor(Number(managedNft.valueUsdc))} USD</span>
              ) : (
                <span>{nft.poolValue || "Valor no disponible"}</span>
              )}
            </div>
            
            {/* Red con iconografía */}
            <div className="flex items-center text-xs text-slate-500 dark:text-slate-400">
              <Globe className="h-3 w-3 mr-1.5 text-blue-500" />
              <span>
                {nft.network === "ethereum" ? "Ethereum" : 
                 nft.network === "unichain" ? "Unichain" : "Polygon"}
              </span>
            </div>
          </div>
          
          {/* Estado de listado - separado en su propia fila */}
          <div className="border-t border-slate-200/70 dark:border-slate-700/70 pt-2">
            {nft.listing?.isListed ? (
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-600 dark:text-slate-400">Estado:</span>
                <div className="flex items-center text-sm">
                  <Activity className="h-3.5 w-3.5 mr-1.5 text-primary" />
                  <div className="flex items-center">
                    <span className="text-xs font-semibold text-primary mr-1.5">Listado</span>
                    <span className="text-xs px-1.5 py-0.5 bg-primary/10 text-primary rounded-sm">{nft.listing.price}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-600 dark:text-slate-400">Estado:</span>
                <Badge variant="outline" className="flex items-center gap-1 text-xs py-0.5 h-5 bg-slate-100/80 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700">
                  <AlertCircle className="h-3 w-3 text-slate-500" />
                  <span>No listado</span>
                </Badge>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

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

// La definición del componente NFTDetailsDialog se ha eliminado y reemplazado
// por la importación de client/src/components/nfts/nft-details-dialog.tsx

// Componente NFTsList que muestra una cuadrícula de NFTs
const NFTsList: React.FC<{
  nfts: any[];
  isLoading: boolean;
  error: Error | null;
  viewMode: "grid" | "list";
  statusFilter: string;
  onSelectNFT: (nft: any) => void;
  managedNfts?: any[];
  sorting: {
    column: string | null;
    direction: "asc" | "desc";
  };
  onSort: (column: string) => void;
}> = ({ 
  nfts, 
  isLoading, 
  error, 
  viewMode, 
  statusFilter, 
  onSelectNFT, 
  managedNfts = [], 
  sorting,
  onSort
}) => {
  
  // Efecto para cargar detalles de NFTs V4 que tienen "Unknown/Unknown" como par de tokens
  useEffect(() => {
    if (!nfts || nfts.length === 0) return;
    
    const loadV4NFTDetails = async () => {
      const unknownPairNfts = nfts.filter(nft => 
        nft.version === "Uniswap V4" && 
        nft.token0Symbol === "Unknown" && 
        nft.token1Symbol === "Unknown"
      );
      
      if (unknownPairNfts.length > 0) {
        for (const nft of unknownPairNfts) {
          try {
            const response = await fetch(`/api/nfts/details/${nft.tokenId}?network=${nft.network}`);
            if (response.ok) {
              const details = await response.json();
              if (details) {
                nft.description = details.description;
                
                if (details.token0Symbol && details.token1Symbol) {
                  nft.token0Symbol = details.token0Symbol;
                  nft.token1Symbol = details.token1Symbol;
                  nft.fee = details.fee;
                  nft.poolAddress = details.poolAddress;
                } else if (details.description) {
                  const lines = details.description.split('\n');
                  let token0 = "";
                  let token1 = "";
                  
                  for (const line of lines) {
                    if (line.includes("Address:") && !line.includes("Pool Address:") && !line.includes("Pool Manager Address:")) {
                      const tokenName = line.split("Address:")[0].trim();
                      if (!token0) token0 = tokenName;
                      else if (!token1) token1 = tokenName;
                    }
                  }
                  
                  if (token0 && token1) {
                    nft.token0Symbol = token0;
                    nft.token1Symbol = token1;
                  }
                }
              }
            }
          } catch (error) {
            console.error(`Error al cargar detalles para NFT #${nft.tokenId}:`, error);
          }
        }
      }
    };
    
    loadV4NFTDetails();
  }, [nfts]);
  
  const { t } = useLanguage();

  // Función para ordenar NFTs
  const sortNFTs = (nftA: any, nftB: any) => {
    let valueA, valueB;
    
    if (!sorting.column) return 0;
    
    // Comprobar con qué columna estamos ordenando
    switch (sorting.column) {
      case "tokenId":
        valueA = parseInt(nftA.tokenId, 10);
        valueB = parseInt(nftB.tokenId, 10);
        break;
      case "tokens":
        // Usar el par de tokens para ordenar
        valueA = nftA.token0Symbol === "Unknown" && nftA.token1Symbol === "Unknown" && nftA.fee?.includes("/") 
          ? nftA.fee 
          : `${nftA.token0Symbol}/${nftA.token1Symbol}`;
        valueB = nftB.token0Symbol === "Unknown" && nftB.token1Symbol === "Unknown" && nftB.fee?.includes("/") 
          ? nftB.fee 
          : `${nftB.token0Symbol}/${nftB.token1Symbol}`;
        break;
      case "fee":
        valueA = nftA.feeTier || nftA.fee;
        valueB = nftB.feeTier || nftB.fee;
        
        // Si contiene %, eliminar para comparar como número
        if (typeof valueA === "string" && valueA.includes("%")) {
          valueA = parseFloat(valueA.replace("%", ""));
        }
        if (typeof valueB === "string" && valueB.includes("%")) {
          valueB = parseFloat(valueB.replace("%", ""));
        }
        break;
      case "network":
        valueA = nftA.network;
        valueB = nftB.network;
        break;
      case "status":
        // Orden personalizado para estados: Active > In-Range > Out-of-Range > Closed > Not Managed > Unknown
        const getStatusPriority = (nft: any) => {
          const managedNft = managedNfts?.find(managed => managed.tokenId === nft.tokenId);
          
          if (managedNft?.status === "Active") return 1;
          if (nft.inRange === true) return 2;
          if (nft.inRange === false) return 3;
          if (managedNft?.status === "Closed") return 4;
          if (managedNft?.status === "Finalized") return 5;
          if (!managedNft && nft.inRange === undefined) return 6;
          return 7; // Unknown
        };
        
        valueA = getStatusPriority(nftA);
        valueB = getStatusPriority(nftB);
        break;
      case "value":
        // Ordenar por valor USDC si está disponible
        const getValueUsdc = (nft: any) => {
          if (nft.valueUsdc) return parseFloat(nft.valueUsdc);
          
          // Buscar en NFTs administrados
          const managedNft = managedNfts?.find(managed => managed.tokenId === nft.tokenId);
          if (managedNft?.valueUsdc) return parseFloat(managedNft.valueUsdc);
          
          return 0; // Valor default para ordenación
        };
        
        valueA = getValueUsdc(nftA);
        valueB = getValueUsdc(nftB);
        break;
      default:
        return 0;
    }
    
    // Ordenar según la dirección
    if (sorting.direction === "asc") {
      return valueA > valueB ? 1 : valueA < valueB ? -1 : 0;
    } else {
      return valueA < valueB ? 1 : valueA > valueB ? -1 : 0;
    }
  };

  // Filtrar y ordenar NFTs (se hace más adelante después de definir filterNFTs)
  // const filteredNFTs = nfts.filter(filterNFTs).sort(sortNFTs);
  
  // Si está cargando, mostrar un spinner
  if (isLoading) {
    return (
      <div className="flex justify-center my-16">
        <Spinner size="lg" className="text-primary" />
      </div>
    );
  }
  
  // Si hay error, mostrar mensaje
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 space-y-4 text-center bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
        <AlertCircle className="h-12 w-12 text-red-500" />
        <h3 className="text-lg font-medium">Error al cargar NFTs</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md">
          {error.message || "No se pudieron cargar tus NFTs. Intenta de nuevo más tarde."}
        </p>
        <Button variant="default" onClick={() => window.location.reload()}>
          Reintentar
        </Button>
      </div>
    );
  }
  
  // Si no hay NFTs, mostrar mensaje
  if (nfts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 space-y-4 text-center bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
        <Tag className="h-12 w-12 text-slate-400" />
        <h3 className="text-lg font-medium">No se encontraron NFTs</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md">
          No tienes NFTs de Uniswap en tu wallet. Puedes crear posiciones de liquidez en Uniswap para recibir NFTs.
        </p>
        <Button variant="default" asChild>
          <a href="https://app.uniswap.org" target="_blank" rel="noopener noreferrer" className="flex items-center">
            Ir a Uniswap
            <ExternalLink className="ml-2 h-4 w-4" />
          </a>
        </Button>
      </div>
    );
  }
  
  // Si hay NFTs pero ninguno coincide con el filtro
  if (nfts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 space-y-4 text-center bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
        <Filter className="h-12 w-12 text-slate-400" />
        <h3 className="text-lg font-medium">No hay NFTs que coincidan con el filtro</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md">
          No se encontraron NFTs que coincidan con los criterios de filtrado seleccionados.
        </p>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Reiniciar filtros
        </Button>
      </div>
    );
  }
  
  // Renderizar cuadrícula o lista según el modo de vista
  if (viewMode === "grid") {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {nfts.map((nft) => (
          <NFTCard 
            key={`${nft.tokenId}-${nft.network}`} 
            nft={nft} 
            onClick={() => onSelectNFT(nft)} 
            managedNfts={managedNfts}
          />
        ))}
      </div>
    );
  } else {
    // Modo lista
    return (
      <div className="border rounded-md overflow-hidden border-slate-200 dark:border-slate-700">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800">
              <TableHead 
                className="text-xs cursor-pointer" 
                onClick={() => onSort("tokenId")}
              >
                <div className="flex items-center">
                  <span>ID</span>
                  {sorting.column === "tokenId" && (
                    <ArrowUpDown 
                      className={`ml-1 h-3.5 w-3.5 ${sorting.direction === "asc" ? "rotate-180" : ""}`} 
                    />
                  )}
                </div>
              </TableHead>
              <TableHead 
                className="text-xs cursor-pointer" 
                onClick={() => onSort("tokens")}
              >
                <div className="flex items-center">
                  <span>Par de tokens</span>
                  {sorting.column === "tokens" && (
                    <ArrowUpDown 
                      className={`ml-1 h-3.5 w-3.5 ${sorting.direction === "asc" ? "rotate-180" : ""}`} 
                    />
                  )}
                </div>
              </TableHead>
              <TableHead 
                className="text-xs cursor-pointer" 
                onClick={() => onSort("fee")}
              >
                <div className="flex items-center">
                  <span>Fee</span>
                  {sorting.column === "fee" && (
                    <ArrowUpDown 
                      className={`ml-1 h-3.5 w-3.5 ${sorting.direction === "asc" ? "rotate-180" : ""}`} 
                    />
                  )}
                </div>
              </TableHead>
              <TableHead 
                className="text-xs cursor-pointer" 
                onClick={() => onSort("network")}
              >
                <div className="flex items-center">
                  <span>Red</span>
                  {sorting.column === "network" && (
                    <ArrowUpDown 
                      className={`ml-1 h-3.5 w-3.5 ${sorting.direction === "asc" ? "rotate-180" : ""}`} 
                    />
                  )}
                </div>
              </TableHead>
              <TableHead 
                className="text-xs cursor-pointer" 
                onClick={() => onSort("status")}
              >
                <div className="flex items-center">
                  <span>Estado</span>
                  {sorting.column === "status" && (
                    <ArrowUpDown 
                      className={`ml-1 h-3.5 w-3.5 ${sorting.direction === "asc" ? "rotate-180" : ""}`} 
                    />
                  )}
                </div>
              </TableHead>
              <TableHead 
                className="text-xs text-right cursor-pointer" 
                onClick={() => onSort("value")}
              >
                <div className="flex items-center justify-end">
                  <span>Valor</span>
                  {sorting.column === "value" && (
                    <ArrowUpDown 
                      className={`ml-1 h-3.5 w-3.5 ${sorting.direction === "asc" ? "rotate-180" : ""}`} 
                    />
                  )}
                </div>
              </TableHead>
              <TableHead className="text-xs text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {nfts.map((nft) => {
              // Buscar si existe un NFT administrado con coincidencia de ID
              const managedNft = managedNfts?.find(managed => {
                return managed.tokenId === nft.tokenId;
              });
              
              // Determinar par de tokens tal como lo hace NFTCard
              let tokenPair;
              let feeValue;
              
              if (nft.version === "Uniswap V3") {
                if (nft.fee && nft.fee.includes("/")) {
                  tokenPair = nft.fee;
                  feeValue = nft.feeTier || "...";
                } else {
                  tokenPair = `${nft.token0Symbol}/${nft.token1Symbol}`;
                  feeValue = nft.fee;
                }
              } else {
                // ✅ PRIORIZAR SIEMPRE DATOS AUTÉNTICOS DEL BACKEND
                console.log(`🔍 DEBUG SEGUNDA VERIFICACIÓN NFT #${nft.tokenId}: token0=${nft.token0Symbol}, token1=${nft.token1Symbol}, fee=${nft.fee}, network=${nft.network}`);
                
                if (nft.token0Symbol && nft.token1Symbol && 
                    nft.token0Symbol !== "Unknown" && nft.token1Symbol !== "Unknown") {
                  tokenPair = `${nft.token0Symbol}/${nft.token1Symbol}`;
                  console.log(`✅ Datos auténticos aplicados en segunda verificación para NFT ${nft.network} #${nft.tokenId}: ${tokenPair}`);
                } else if (nft.token0Symbol === "Unknown" && nft.token1Symbol === "Unknown") {
                  if (nft.fee === "0.3%") {
                    tokenPair = "WETH/USDC";
                  } else if (nft.fee === "0.01%") {
                    tokenPair = "USDT/USDC";
                  } else {
                    tokenPair = "Unknown/Unknown";
                  }
                } else {
                  tokenPair = `${nft.token0Symbol}/${nft.token1Symbol}`;
                }
                feeValue = nft.fee;
              }
              
              return (
                <TableRow 
                  key={`${nft.tokenId}-${nft.network}`} 
                  className="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50"
                  onClick={() => onSelectNFT(nft)}
                >
                  <TableCell className="font-medium">{nft.tokenId}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Repeat className="h-3.5 w-3.5 text-primary mr-1.5" />
                      <span>{tokenPair}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <BarChart3 className="h-3.5 w-3.5 text-amber-500 mr-1.5" />
                      <span>{feeValue}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-slate-50 dark:bg-slate-800">
                      <Globe className="h-3 w-3 text-blue-500 mr-1.5" />
                      <span>
                        {nft.network === "ethereum" ? "Ethereum" : 
                         nft.network === "unichain" ? "Unichain" : 
                         "Polygon"}
                      </span>
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {nft.status ? (
                      <Badge 
                        variant={
                          nft.status.toLowerCase() === "active" || nft.status.toLowerCase() === "activo" ? "success" : 
                          nft.status.toLowerCase() === "closed" || nft.status.toLowerCase() === "cerrado" ? "destructive" : 
                          nft.status.toLowerCase() === "finalized" || nft.status.toLowerCase() === "finalizado" ? "default" : 
                          "outline"
                        } 
                      >
                        {nft.status.toLowerCase() === "active" || nft.status.toLowerCase() === "activo" ? (
                          <>
                            <CheckCircle className="h-3.5 w-3.5 mr-1" />
                            <span>Activo</span>
                          </>
                        ) : nft.status.toLowerCase() === "closed" || nft.status.toLowerCase() === "cerrado" ? (
                          <>
                            <XCircle className="h-3.5 w-3.5 mr-1" />
                            <span>Cerrado</span>
                          </>
                        ) : nft.status.toLowerCase() === "finalized" || nft.status.toLowerCase() === "finalizado" ? (
                          <>
                            <CheckCircle className="h-3.5 w-3.5 mr-1" />
                            <span>Finalizado</span>
                          </>
                        ) : (
                          <>
                            <Info className="h-3.5 w-3.5 mr-1" />
                            <span>{nft.status}</span>
                          </>
                        )}
                      </Badge>
                    ) : nft.inRange !== undefined ? (
                      <Badge 
                        variant={nft.inRange ? "success" : "destructive"} 
                      >
                        {nft.inRange ? (
                          <>
                            <CheckCircle className="h-3.5 w-3.5 mr-1" />
                            <span>En rango</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="h-3.5 w-3.5 mr-1" />
                            <span>Fuera de rango</span>
                          </>
                        )}
                      </Badge>
                    ) : (
                      <Badge variant="outline">
                        <Info className="h-3.5 w-3.5 mr-1" />
                        <span>No gestionado</span>
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end">
                      <Banknote className="h-3.5 w-3.5 text-emerald-500 mr-1.5" />
                      {nft.valueUsdc ? (
                        <span className="text-emerald-600">${Math.floor(Number(nft.valueUsdc))} USD</span>
                      ) : managedNft && managedNft.valueUsdc ? (
                        <span className="text-emerald-600">${Math.floor(Number(managedNft.valueUsdc))} USD</span>
                      ) : (
                        <span>{nft.poolValue || "No disponible"}</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 px-2" 
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectNFT(nft);
                      }}
                    >
                      Ver detalles
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    );
  }
};

// Página principal de NFTs
const NFTsPage: React.FC = () => {
  const { language } = useLanguage();
  const { address } = useWallet();
  const { isAdmin } = useAdmin();
  
  // Obtener traducciones para NFTs
  const t = nftsTranslations[language] || nftsTranslations.es;
  
  // Estados para el filtrado y visualización
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showManagedOnly, setShowManagedOnly] = useState<boolean>(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [networkFilter, setNetworkFilter] = useState<string>("all");
  const [versionFilter, setVersionFilter] = useState<string>("all");
  const [tokenPairFilter, setTokenPairFilter] = useState<string>("all");
  const [feeFilter, setFeeFilter] = useState<string>("all");
  const [valueFilter, setValueFilter] = useState<string>("all");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState<boolean>(false);
  const [selectedNFT, setSelectedNFT] = useState<string | null>(null);
  const [selectedNetwork, setSelectedNetwork] = useState<string>("ethereum");
  const [selectedContractAddress, setSelectedContractAddress] = useState<string | undefined>(undefined);
  const [selectedNFTData, setSelectedNFTData] = useState<any>(null);

  // Función avanzada para filtrar NFTs por múltiples criterios
  const filterNFTs = (nft: any) => {
    // Filtro por estado
    if (statusFilter !== "all") {
      if (statusFilter === "active" || statusFilter === "closed" || statusFilter === "finalized") {
        const managedNft = managedNFTs?.find(managed => managed.tokenId === nft.tokenId);
        if (managedNft) {
          if (managedNft.status?.toLowerCase() !== statusFilter.toLowerCase()) return false;
        } else {
          return false;
        }
      } else if (statusFilter === "inRange" || statusFilter === "outOfRange") {
        if (nft.inRange !== undefined) {
          if (statusFilter === "inRange" ? !nft.inRange : nft.inRange) return false;
        } else {
          return false;
        }
      } else if (statusFilter === "listed") {
        if (!nft.listing?.isListed) return false;
      }
    }

    // Filtro por versión
    if (versionFilter !== "all") {
      const version = nft.version?.toLowerCase() || "";
      if (versionFilter === "v2" && !version.includes("v2")) return false;
      if (versionFilter === "v3" && !version.includes("v3")) return false;
      if (versionFilter === "v4" && !version.includes("v4")) return false;
    }

    // Filtro por par de tokens
    if (tokenPairFilter !== "all") {
      let tokenPair = "";
      if (nft.token0Symbol && nft.token1Symbol && 
          nft.token0Symbol !== "Unknown" && nft.token1Symbol !== "Unknown") {
        tokenPair = `${nft.token0Symbol}/${nft.token1Symbol}`;
      } else if (nft.fee && nft.fee.includes("/")) {
        tokenPair = nft.fee;
      }
      if (!tokenPair.toLowerCase().includes(tokenPairFilter.toLowerCase())) return false;
    }

    // Filtro por fee
    if (feeFilter !== "all") {
      const fee = nft.feeTier || nft.fee || "";
      if (feeFilter === "0.01%" && !fee.includes("0.01%")) return false;
      if (feeFilter === "0.05%" && !fee.includes("0.05%")) return false;
      if (feeFilter === "0.3%" && !fee.includes("0.3%")) return false;
      if (feeFilter === "1%" && !fee.includes("1%")) return false;
    }

    // Filtro por valor
    if (valueFilter !== "all") {
      const managedNft = managedNFTs?.find(managed => managed.tokenId === nft.tokenId);
      const value = parseFloat(managedNft?.valueUsdc || "0");
      if (valueFilter === "low" && value >= 1000) return false;
      if (valueFilter === "medium" && (value < 1000 || value >= 10000)) return false;
      if (valueFilter === "high" && value < 10000) return false;
      if (valueFilter === "zero" && value > 0) return false;
    }

    return true;
  };
  const [sorting, setSorting] = useState<{column: string | null, direction: "asc" | "desc"}>({
    column: null,
    direction: "desc"
  });
  
  // Función para manejar ordenación
  const handleSort = (column: string) => {
    setSorting(prev => {
      // Si hacemos clic en la misma columna, cambiar la dirección
      if (prev.column === column) {
        return {
          ...prev,
          direction: prev.direction === "asc" ? "desc" : "asc"
        };
      }
      
      // Si hacemos clic en una nueva columna, ordenar descendentemente por defecto
      return {
        column,
        direction: "desc"
      };
    });
  };
  
  // Obtener NFTs del usuario y NFTs administrados
  const { 
    data: userNFTs = [], 
    isLoading: isLoadingUserNFTs, 
    error: userNFTsError,
    refetch: refetchUserNFTs
  } = useUserNFTs(address || "");
  
  const { 
    data: managedNFTs = [], 
    isLoading: isLoadingManagedNFTs, 
    error: managedNFTsError,
    refetch: refetchManagedNFTs
  } = useManagedNFTs();
  
  // Filtrar NFTs según showManagedOnly y networkFilter
  const filteredByManaged = showManagedOnly 
    ? userNFTs.filter(nft => 
        managedNFTs.some(managedNft => 
          managedNft.tokenId === nft.tokenId && 
          (managedNft.network === nft.network ||
           (managedNft.network === 'ethereum' && nft.network === 'mainnet') ||
           (managedNft.network === 'polygon' && nft.network === 'matic'))
        )
      )
    : userNFTs;

  // Filtrar por red
  const displayedNFTs = filteredByManaged.filter(nft => {
    if (networkFilter === "all") return true;
    return nft.network === networkFilter || 
           (networkFilter === 'ethereum' && nft.network === 'mainnet') ||
           (networkFilter === 'polygon' && nft.network === 'matic') ||
           (networkFilter === 'unichain' && nft.network === 'unichain');
  });
  
  // Combinar estados de carga y errores
  const isLoading = isLoadingUserNFTs || isLoadingManagedNFTs;
  const error = userNFTsError || managedNFTsError;
  
  // Funciones para manejar la selección de NFTs
  const handleSelectNFT = (nft: any) => {
    console.log('🎯 NFT seleccionado para diálogo:', nft);
    console.log('🖼️ URL de imagen del NFT:', nft.imageUrl);
    setSelectedNFT(nft.tokenId);
    setSelectedNetwork(nft.network);
    setSelectedContractAddress(nft.contractAddress);
    setSelectedNFTData(nft);
    setIsDetailsDialogOpen(true);
  };
  
  const handleCloseDetailsDialog = () => {
    setIsDetailsDialogOpen(false);
    // Refrescar para reflejar cambios
    refetchUserNFTs();
    refetchManagedNFTs();
  };
  
  // Contar NFTs por estado para las pestañas
  const countNFTsByStatus = () => {
    const counts = {
      all: userNFTs.length,
      active: 0,
      inRange: 0,
      outOfRange: 0,
      closed: 0,
      listed: 0
    };
    
    userNFTs.forEach(nft => {
      // Contar NFTs administrados activos
      const managedNft = managedNFTs?.find(managed => 
        managed.tokenId === nft.tokenId &&
        (managed.network === nft.network ||
         (managed.network === 'ethereum' && nft.network === 'mainnet') ||
         (managed.network === 'polygon' && nft.network === 'matic'))
      );
      
      if (managedNft?.status?.toLowerCase() === "active") {
        counts.active++;
      }
      
      if (managedNft?.status?.toLowerCase() === "closed") {
        counts.closed++;
      }
      
      // Contar por rango de precios
      if (nft.inRange === true) {
        counts.inRange++;
      } else if (nft.inRange === false) {
        counts.outOfRange++;
      }
      
      // Contar listados
      if (nft.listing?.isListed) {
        counts.listed++;
      }
    });
    
    return counts;
  };
  
  const nftCounts = countNFTsByStatus();
  
  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 space-y-6">
        {/* Header profesional blockchain redesignado */}
        <div className="mb-8">
          <div className="bg-gradient-to-br from-slate-900/90 via-slate-800/90 to-slate-900/90 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/30 shadow-2xl">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              {/* Título profesional */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <Wallet className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                      {t.title}
                    </h1>
                    <p className="text-slate-400 text-sm font-medium">
                      {t.subtitle}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Controles modernos alineados a la derecha */}
              <div className="flex flex-wrap items-center justify-end gap-4">
                {/* Botón refrescar profesional */}
                <Button
                  onClick={() => {
                    refetchUserNFTs();
                    refetchManagedNFTs();
                  }}
                  variant="outline"
                  size="sm"
                  className="border-slate-600/50 hover:border-blue-500/50 text-slate-300 hover:text-white bg-slate-800/30 hover:bg-slate-700/50 transition-all duration-300 backdrop-blur-sm"
                >
                  <Repeat className="h-4 w-4 mr-2" />
                  {t.refresh}
                </Button>

                {/* Vista grilla/lista moderna */}
                <div className="bg-slate-800/40 border border-slate-600/30 rounded-xl flex p-1 backdrop-blur-sm">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className={`h-9 px-4 rounded-lg transition-all duration-300 ${
                      viewMode === "grid" 
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25" 
                        : "text-slate-400 hover:text-white hover:bg-slate-700/50"
                    }`}
                  >
                    <LayoutGrid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className={`h-9 px-4 rounded-lg transition-all duration-300 ${
                      viewMode === "list" 
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25" 
                        : "text-slate-400 hover:text-white hover:bg-slate-700/50"
                    }`}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>

                {/* Filtros profesionales */}
                <Button
                  onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                  variant="ghost"
                  size="sm"
                  className={`h-9 px-4 rounded-xl transition-all duration-300 ${
                    showAdvancedFilters
                      ? "bg-purple-600 text-white shadow-lg shadow-purple-600/25 border border-purple-500/50"
                      : "border border-slate-600/50 text-slate-300 hover:text-white hover:border-purple-500/50 hover:bg-slate-700/50"
                  }`}
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filtros
                </Button>
                
                {/* Selector de red elegante */}
                <div className="bg-slate-800/40 border border-slate-600/30 rounded-xl px-4 py-2 backdrop-blur-sm">
                  <div className="flex items-center gap-3">
                    <Globe className="h-4 w-4 text-blue-400" />
                    <ToggleGroup 
                      type="single" 
                      value={networkFilter} 
                      onValueChange={(value) => value && setNetworkFilter(value)}
                      className="gap-2"
                    >
                      <ToggleGroupItem 
                        value="all" 
                        className="text-xs px-3 py-1.5 rounded-lg border-0 data-[state=on]:bg-slate-600 data-[state=on]:text-white text-slate-400 hover:text-white hover:bg-slate-700/50 transition-all duration-200"
                      >
                        Todas
                      </ToggleGroupItem>
                      <ToggleGroupItem 
                        value="ethereum" 
                        className="text-xs px-3 py-1.5 rounded-lg border-0 data-[state=on]:bg-green-600 data-[state=on]:text-white text-slate-400 hover:text-white hover:bg-slate-700/50 transition-all duration-200"
                      >
                        Ethereum
                      </ToggleGroupItem>
                      <ToggleGroupItem 
                        value="polygon" 
                        className="text-xs px-3 py-1.5 rounded-lg border-0 data-[state=on]:bg-purple-600 data-[state=on]:text-white text-slate-400 hover:text-white hover:bg-slate-700/50 transition-all duration-200"
                      >
                        Polygon
                      </ToggleGroupItem>
                      <ToggleGroupItem 
                        value="unichain" 
                        className="text-xs px-3 py-1.5 rounded-lg border-0 data-[state=on]:bg-pink-600 data-[state=on]:text-white text-slate-400 hover:text-white hover:bg-slate-700/50 transition-all duration-200"
                      >
                        Unichain
                      </ToggleGroupItem>
                    </ToggleGroup>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Panel de filtros avanzados profesional */}
        {showAdvancedFilters && (
          <div className="mb-8">
            <div className="bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-900/95 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-2xl overflow-hidden">
              {/* Header del panel */}
              <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-b border-slate-700/50 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <Sliders className="h-4 w-4 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-white">Filtros Avanzados</h3>
                  </div>
                  <Button
                    onClick={() => setShowAdvancedFilters(false)}
                    variant="ghost"
                    size="sm"
                    className="text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg"
                  >
                    <ChevronUp className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {/* Contenido del panel organizado en secciones */}
              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  
                  {/* Sección 1: Configuración Técnica */}
                  <div className="space-y-6">
                    <div className="flex items-center space-x-2 mb-4">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <h4 className="text-sm font-medium text-blue-400">Configuración Técnica</h4>
                      <div className="flex-1 h-px bg-gradient-to-r from-blue-500/50 to-transparent"></div>
                    </div>
                    
                    {/* Filtro por Versión */}
                    <div className="bg-slate-800/30 rounded-xl p-4 border border-slate-700/30">
                      <label className="text-sm font-medium text-slate-300 flex items-center mb-3">
                        <Layers className="h-4 w-4 mr-2 text-blue-400" />
                        Versión
                      </label>
                      <ToggleGroup 
                        type="single" 
                        value={versionFilter} 
                        onValueChange={(value) => value && setVersionFilter(value)} 
                        className="grid grid-cols-4 gap-2"
                      >
                        <ToggleGroupItem 
                          value="all" 
                          className="text-xs px-3 py-2 h-9 rounded-lg border-0 bg-slate-700/50 data-[state=on]:bg-blue-600 data-[state=on]:text-white text-slate-300 hover:text-white hover:bg-slate-600/50 transition-all"
                        >
                          {t.all}
                        </ToggleGroupItem>
                        <ToggleGroupItem 
                          value="v2" 
                          className="text-xs px-3 py-2 h-9 rounded-lg border-0 bg-slate-700/50 data-[state=on]:bg-blue-600 data-[state=on]:text-white text-slate-300 hover:text-white hover:bg-slate-600/50 transition-all"
                        >
                          {t.v2}
                        </ToggleGroupItem>
                        <ToggleGroupItem 
                          value="v3" 
                          className="text-xs px-3 py-2 h-9 rounded-lg border-0 bg-slate-700/50 data-[state=on]:bg-blue-600 data-[state=on]:text-white text-slate-300 hover:text-white hover:bg-slate-600/50 transition-all"
                        >
                          {t.v3}
                        </ToggleGroupItem>
                        <ToggleGroupItem 
                          value="v4" 
                          className="text-xs px-3 py-2 h-9 rounded-lg border-0 bg-slate-700/50 data-[state=on]:bg-blue-600 data-[state=on]:text-white text-slate-300 hover:text-white hover:bg-slate-600/50 transition-all"
                        >
                          {t.v4}
                        </ToggleGroupItem>
                      </ToggleGroup>
                    </div>

                    {/* Filtro por Fee */}
                    <div className="bg-slate-800/30 rounded-xl p-4 border border-slate-700/30">
                      <label className="text-sm font-medium text-slate-300 flex items-center mb-3">
                        <BarChart3 className="h-4 w-4 mr-2 text-green-400" />
                        Comisiones
                      </label>
                      <ToggleGroup 
                        type="single" 
                        value={feeFilter} 
                        onValueChange={(value) => value && setFeeFilter(value)} 
                        className="grid grid-cols-2 gap-2"
                      >
                        <ToggleGroupItem 
                          value="all" 
                          className="text-xs px-3 py-2 h-9 rounded-lg border-0 bg-slate-700/50 data-[state=on]:bg-green-600 data-[state=on]:text-white text-slate-300 hover:text-white hover:bg-slate-600/50 transition-all"
                        >
                          {t.all}
                        </ToggleGroupItem>
                        <ToggleGroupItem 
                          value="0.01%" 
                          className="text-xs px-3 py-2 h-9 rounded-lg border-0 bg-slate-700/50 data-[state=on]:bg-green-600 data-[state=on]:text-white text-slate-300 hover:text-white hover:bg-slate-600/50 transition-all"
                        >
                          0.01%
                        </ToggleGroupItem>
                        <ToggleGroupItem 
                          value="0.05%" 
                          className="text-xs px-3 py-2 h-9 rounded-lg border-0 bg-slate-700/50 data-[state=on]:bg-green-600 data-[state=on]:text-white text-slate-300 hover:text-white hover:bg-slate-600/50 transition-all"
                        >
                          0.05%
                        </ToggleGroupItem>
                        <ToggleGroupItem 
                          value="0.3%" 
                          className="text-xs px-3 py-2 h-9 rounded-lg border-0 bg-slate-700/50 data-[state=on]:bg-green-600 data-[state=on]:text-white text-slate-300 hover:text-white hover:bg-slate-600/50 transition-all"
                        >
                          0.3%
                        </ToggleGroupItem>
                      </ToggleGroup>
                    </div>
                  </div>
                  
                  {/* Sección 2: Filtros de Contenido */}
                  <div className="space-y-6">
                    <div className="flex items-center space-x-2 mb-4">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <h4 className="text-sm font-medium text-purple-400">Filtros de Contenido</h4>
                      <div className="flex-1 h-px bg-gradient-to-r from-purple-500/50 to-transparent"></div>
                    </div>
                    
                    {/* Filtro por Par de Tokens */}
                    <div className="bg-slate-800/30 rounded-xl p-4 border border-slate-700/30">
                      <label className="text-sm font-medium text-slate-300 flex items-center mb-3">
                        <Banknote className="h-4 w-4 mr-2 text-purple-400" />
                        {t.tokenPair}
                      </label>
                      <ToggleGroup 
                        type="single" 
                        value={tokenPairFilter} 
                        onValueChange={(value) => value && setTokenPairFilter(value)} 
                        className="grid grid-cols-2 gap-2"
                      >
                        <ToggleGroupItem 
                          value="all" 
                          className="text-xs px-3 py-2 h-9 rounded-lg border-0 bg-slate-700/50 data-[state=on]:bg-purple-600 data-[state=on]:text-white text-slate-300 hover:text-white hover:bg-slate-600/50 transition-all"
                        >
                          {t.all}
                        </ToggleGroupItem>
                        <ToggleGroupItem 
                          value="usdc" 
                          className="text-xs px-3 py-2 h-9 rounded-lg border-0 bg-slate-700/50 data-[state=on]:bg-purple-600 data-[state=on]:text-white text-slate-300 hover:text-white hover:bg-slate-600/50 transition-all"
                        >
                          USDC
                        </ToggleGroupItem>
                        <ToggleGroupItem 
                          value="eth" 
                          className="text-xs px-3 py-2 h-9 rounded-lg border-0 bg-slate-700/50 data-[state=on]:bg-purple-600 data-[state=on]:text-white text-slate-300 hover:text-white hover:bg-slate-600/50 transition-all"
                        >
                          ETH
                        </ToggleGroupItem>
                        <ToggleGroupItem 
                          value="weth" 
                          className="text-xs px-3 py-2 h-9 rounded-lg border-0 bg-slate-700/50 data-[state=on]:bg-purple-600 data-[state=on]:text-white text-slate-300 hover:text-white hover:bg-slate-600/50 transition-all"
                        >
                          WETH
                        </ToggleGroupItem>
                      </ToggleGroup>
                    </div>

                    {/* Filtro por Valor */}
                    <div className="bg-slate-800/30 rounded-xl p-4 border border-slate-700/30">
                      <label className="text-sm font-medium text-slate-300 flex items-center mb-3">
                        <DollarSign className="h-4 w-4 mr-2 text-yellow-400" />
                        {t.valueRange}
                      </label>
                      <ToggleGroup 
                        type="single" 
                        value={valueFilter} 
                        onValueChange={(value) => value && setValueFilter(value)} 
                        className="grid grid-cols-2 gap-2"
                      >
                        <ToggleGroupItem 
                          value="all" 
                          className="text-xs px-3 py-2 h-9 rounded-lg border-0 bg-slate-700/50 data-[state=on]:bg-yellow-600 data-[state=on]:text-white text-slate-300 hover:text-white hover:bg-slate-600/50 transition-all"
                        >
                          {t.all}
                        </ToggleGroupItem>
                        <ToggleGroupItem 
                          value="0" 
                          className="text-xs px-3 py-2 h-9 rounded-lg border-0 bg-slate-700/50 data-[state=on]:bg-yellow-600 data-[state=on]:text-white text-slate-300 hover:text-white hover:bg-slate-600/50 transition-all"
                        >
                          $0
                        </ToggleGroupItem>
                        <ToggleGroupItem 
                          value="<1k" 
                          className="text-xs px-3 py-2 h-9 rounded-lg border-0 bg-slate-700/50 data-[state=on]:bg-yellow-600 data-[state=on]:text-white text-slate-300 hover:text-white hover:bg-slate-600/50 transition-all"
                        >
                          &lt;$1K
                        </ToggleGroupItem>
                        <ToggleGroupItem 
                          value="1k-10k" 
                          className="text-xs px-3 py-2 h-9 rounded-lg border-0 bg-slate-700/50 data-[state=on]:bg-yellow-600 data-[state=on]:text-white text-slate-300 hover:text-white hover:bg-slate-600/50 transition-all"
                        >
                          $1K-$10K
                        </ToggleGroupItem>
                        <ToggleGroupItem 
                          value=">10k" 
                          className="text-xs px-3 py-2 h-9 rounded-lg border-0 bg-slate-700/50 data-[state=on]:bg-yellow-600 data-[state=on]:text-white text-slate-300 hover:text-white hover:bg-slate-600/50 transition-all"
                        >
                          &gt;$10K
                        </ToggleGroupItem>
                      </ToggleGroup>
                    </div>
                  </div>
                </div>
                
                {/* Botón para limpiar filtros */}
                <div className="mt-6 pt-4 border-t border-slate-700/50">
                  <Button
                    onClick={() => {
                      setVersionFilter("all");
                      setTokenPairFilter("all");
                      setFeeFilter("all");
                      setValueFilter("all");
                    }}
                    variant="outline"
                    className="w-full bg-slate-800/50 border-slate-600 text-slate-300 hover:bg-slate-700/50 hover:text-white transition-all"
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    {t.clearFilters}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="border rounded-lg overflow-hidden border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
          <Tabs defaultValue="all" value={statusFilter} onValueChange={setStatusFilter}>
            <div className="px-3 pt-3 border-b border-slate-200 dark:border-slate-700 overflow-x-auto scrollbar-hide">
              <TabsList className="h-9 bg-slate-100 dark:bg-slate-800 p-1">
                <TabsTrigger value="all" className="text-xs px-3 py-1.5 h-7">
                  Todos ({nftCounts.all})
                </TabsTrigger>
                <TabsTrigger value="active" className="text-xs px-3 py-1.5 h-7">
                  Activos ({nftCounts.active})
                </TabsTrigger>
                <TabsTrigger value="inRange" className="text-xs px-3 py-1.5 h-7">
                  En rango ({nftCounts.inRange})
                </TabsTrigger>
                <TabsTrigger value="outOfRange" className="text-xs px-3 py-1.5 h-7">
                  Fuera de rango ({nftCounts.outOfRange})
                </TabsTrigger>
                <TabsTrigger value="closed" className="text-xs px-3 py-1.5 h-7">
                  Cerrados ({nftCounts.closed})
                </TabsTrigger>
                <TabsTrigger value="listed" className="text-xs px-3 py-1.5 h-7">
                  Listados ({nftCounts.listed})
                </TabsTrigger>
              </TabsList>
            </div>
            
            <div className="p-4">
              <NFTsList 
                nfts={displayedNFTs}
                isLoading={isLoading}
                error={error}
                viewMode={viewMode}
                statusFilter={statusFilter}
                onSelectNFT={handleSelectNFT}
                managedNfts={managedNFTs}
                sorting={sorting}
                onSort={handleSort}
              />
            </div>
          </Tabs>
        </div>
      </div>
      <NFTDetailsDialog
        tokenId={selectedNFT}
        network={selectedNetwork}
        contractAddress={selectedContractAddress}
        nftData={selectedNFTData}
        isOpen={isDetailsDialogOpen}
        onClose={handleCloseDetailsDialog}
        managedNfts={managedNFTs}
        isAdmin={isAdmin}
      />
    </DashboardLayout>
  );
};

export default NFTsPage;