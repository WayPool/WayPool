import React, { useState, useEffect, useMemo } from "react";
import { useUserNFTs, useNFTDetails, useManagedNFTs } from "@/hooks/use-nfts";
import { useWallet } from "@/hooks/use-wallet";
import { formatExactCurrency } from "@/lib/utils";
import { APP_NAME } from "@/utils/app-config";
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
import { Spinner } from "@/components/ui/spinner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Button } from "@/components/ui/button";
import {
  ExternalLink,
  Plus,
  Sliders,
  ChevronRight,
  ChevronLeft,
  Tag,
  ChevronUp,
  ChevronDown,
  CheckCircle,
  XCircle,
  AlertCircle,
  Activity,
  Layers,
  Banknote,
  Info,
  Globe,
  BarChart3,
  Repeat,
  LayoutGrid,
  Shield,
  List,
  ArrowUpDown,
  Copy
} from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";
import { nftsTranslations } from "@/translations/nfts";
import { getSafeTranslation } from "@/utils/translation-safety";

// Componente para status badge
const NFTStatusBadge: React.FC<{
  nftDetails: any;
}> = ({ nftDetails }) => {
  const { t, language } = useTranslation();
  
  // Función para normalizar status
  const normalizeStatus = (status: string) => {
    if (!status) return "unknown";
    
    const lowercaseStatus = status.toLowerCase();
    if (lowercaseStatus === "active" || lowercaseStatus === "activo") {
      return "active";
    } else if (lowercaseStatus === "closed" || lowercaseStatus === "cerrado") {
      return "closed";
    } else if (lowercaseStatus === "finalized" || lowercaseStatus === "finalizado") {
      return "finalized";
    } else {
      return lowercaseStatus;
    }
  };
  
  // Determinar el status directamente del NFT
  let status = "unknown";
  if (nftDetails.status) {
    status = normalizeStatus(nftDetails.status);
  }
  
  // Renderizar el badge adecuado
  return (
    <Badge 
      variant={
        status === "active" ? "success" : 
        status === "closed" ? "destructive" : 
        status === "finalized" ? "default" : 
        "outline"
      } 
      className="flex items-center gap-1"
    >
      {status === "active" ? (
        <>
          <CheckCircle className="h-3 w-3" />
          <span>{t("statusActive", nftsTranslations[language]?.statusActive || "Active")}</span>
        </>
      ) : status === "closed" ? (
        <>
          <XCircle className="h-3 w-3" />
          <span>{t("statusClosed", nftsTranslations[language]?.statusClosed || "Closed")}</span>
        </>
      ) : status === "finalized" ? (
        <>
          <CheckCircle className="h-3 w-3" />
          <span>{language === 'es' ? 'Finalizado' : language === 'fr' ? 'Finalisé' : language === 'de' ? 'Finalisiert' : 'Finalized'}</span>
        </>
      ) : (
        <>
          <AlertCircle className="h-3 w-3" />
          <span>{t("unknownToken", nftsTranslations[language]?.unknownToken || "Unknown Token")}</span>
        </>
      )}
    </Badge>
  );
};

// Componente para TokenPair
const TokenPairDisplay: React.FC<{
  nftDetails: any;
}> = ({ nftDetails }) => {
  // Extraer el par de tokens de distintas fuentes de datos
  const getTokenPair = () => {
    // 1. Si es un NFT V4 y el campo fee contiene un formato "TOKEN0/TOKEN1", úsalo
    if (nftDetails.version === "Uniswap V4" && nftDetails.fee && nftDetails.fee.includes("/")) {
      return nftDetails.fee;
    }
    
    // 1.1 Si es un NFT V4 pero fee no tiene el formato correcto, usar el valor por defecto
    if (nftDetails.version === "Uniswap V4") {
      return "WETH/USDC";
    }
    
    // 2. Si los símbolos de los tokens son conocidos (no "Unknown"), úsalos
    if (nftDetails.token0Symbol !== "Unknown" || nftDetails.token1Symbol !== "Unknown") {
      return `${nftDetails.token0Symbol}/${nftDetails.token1Symbol}`;
    }
    
    // 3. Extraer del campo de descripción que contiene información como "USDC-MATIC"
    if (nftDetails.description) {
      // Buscar patrones como "Uniswap V3 USDC-MATIC pool" o similares
      const poolMatch = nftDetails.description.match(/Uniswap V[34]\s+([A-Z0-9]+)[- /]+([A-Z0-9]+)\s+pool/i);
      if (poolMatch && poolMatch.length >= 3) {
        return `${poolMatch[1]}/${poolMatch[2]}`;
      }
      
      // También buscar formato "TOKEN0/TOKEN1"
      const slashMatch = nftDetails.description.match(/([A-Z0-9]+)\/([A-Z0-9]+)/i);
      if (slashMatch && slashMatch.length >= 3) {
        return `${slashMatch[1]}/${slashMatch[2]}`;
      }
      
      // O formato "TOKEN0-TOKEN1"
      const dashMatch = nftDetails.description.match(/([A-Z0-9]+)-([A-Z0-9]+)/i);
      if (dashMatch && dashMatch.length >= 3) {
        return `${dashMatch[1]}/${dashMatch[2]}`;
      }
    }
    
    // 4. En caso de que todo lo anterior falle, usar lo que tenemos (aunque sea "Unknown/Unknown")
    return `${nftDetails.token0Symbol}/${nftDetails.token1Symbol}`;
  };

  return <span className="font-medium">{getTokenPair()}</span>;
};

// Componente para Fee
const FeeTierDisplay: React.FC<{
  nftDetails: any;
}> = ({ nftDetails }) => {
  // Extraer el fee de distintas fuentes de datos
  const getFee = () => {
    // Para los NFTs V4, tenemos una lógica especial
    if (nftDetails.version === "Uniswap V4" || nftDetails.version?.includes("V4")) {
      // Obtener el fee del campo feeTier primero (que suele ser el correcto)
      if (nftDetails.feeTier && nftDetails.feeTier.includes('%')) {
        return nftDetails.feeTier;
      }
      
      // Si feeTier no tiene el valor, buscar en el campo fee 
      // (solo si no parece ser un par de tokens)
      if (nftDetails.fee && !nftDetails.fee.includes('/') && nftDetails.fee.includes('%')) {
        return nftDetails.fee;
      }
      
      // Si aún no tenemos el fee, intentar extraerlo del título
      if (nftDetails.title && nftDetails.title.includes('%')) {
        const feeMatch = nftDetails.title.match(/([0-9.]+%)/);
        if (feeMatch && feeMatch.length >= 2) {
          return feeMatch[1];
        }
      }
      
      // Valor por defecto para V4 si no se encontró nada
      return "0.05%";
    } else {
      // Para NFTs V3, usamos la lógica original
      // Intentar obtener el fee del campo feeTier primero
      if (nftDetails.feeTier && nftDetails.feeTier.includes('%')) {
        return nftDetails.feeTier;
      }
      
      // Si el campo fee NO contiene una barra (no es un par de tokens)
      // y contiene un porcentaje, es probablemente el fee
      if (nftDetails.fee && !nftDetails.fee.includes('/') && nftDetails.fee.includes('%')) {
        return nftDetails.fee;
      }
    }
    
    // Intentar extraer el fee tier de la descripción
    if (nftDetails.description) {
      const feeMatch = nftDetails.description.match(/Fee Tier: ([0-9.]+%)/i);
      if (feeMatch && feeMatch.length >= 2) {
        return feeMatch[1]; // Retornar el porcentaje encontrado
      }
    }
    
    // Si todo lo anterior falla, extraer del nombre/título
    if (nftDetails.title) {
      const titleMatch = nftDetails.title.match(/([0-9.]+%)/);
      if (titleMatch && titleMatch.length >= 2) {
        return titleMatch[1];
      }
    }
    
    return "Unknown";
  };

  return <Badge variant="outline">{getFee()}</Badge>;
};

// Componente para valor de NFT
const NFTValueBadge: React.FC<{
  nftDetails: any;
}> = ({ nftDetails }) => {
  const { t, language } = useTranslation();
  
  if (nftDetails.valueUsdc) {
    return (
      <Badge variant="secondary" className="font-medium">
        {formatExactCurrency(Number(nftDetails.valueUsdc), 0)}
      </Badge>
    );
  } else {
    return (
      <Badge variant="outline" className="text-slate-500">
        {t("notValued", nftsTranslations[language]?.notValued || "Not valued")}
      </Badge>
    );
  }
};

// Componente de tarjeta de NFT
const NFTCard: React.FC<{
  nft: any;
  onClick: () => void;
}> = ({ nft, onClick }) => {
  // Implementation to correctly display token pairs and fees
  let tokenPair;
  let feeValue;
  
  // Extraer información de pares de tokens y fees de manera segura
  // Sabemos por los logs y pruebas que:
  // 1. Para NFTs V3 y V4, a veces el par de tokens está en el campo fee
  // 2. Para NFTs V4, el fee real a menudo está en feeTier
  
  // Primero verificamos si el campo fee contiene un formato de par de tokens (como "WETH/USDC")
  if (nft.fee && nft.fee.includes("/")) {
    // El campo fee tiene el formato de un par de tokens
    tokenPair = nft.fee;
    
    // El fee real debe estar en feeTier o simplemente mostramos lo que tenemos
    feeValue = nft.feeTier || "...";
  } 
  // Si fee no contiene un par de tokens
  else {
    // Verificamos si tenemos token symbols válidos
    if (nft.token0Symbol && nft.token1Symbol && 
        nft.token0Symbol !== "Unknown" && nft.token1Symbol !== "Unknown") {
      tokenPair = `${nft.token0Symbol}/${nft.token1Symbol}`;
    } 
    // Si no tenemos tokens válidos, usamos lo que tengamos
    else {
      // Si hay datos en el título, intentamos extraer de ahí
      if (nft.title && nft.title.includes("/")) {
        const pairMatch = nft.title.match(/([A-Z0-9]+)\/([A-Z0-9]+)/i);
        if (pairMatch && pairMatch.length >= 3) {
          tokenPair = `${pairMatch[1]}/${pairMatch[2]}`;
        }
      } 
      // Si hay datos en la descripción, intentamos extraer de ahí
      else if (nft.description && nft.description.includes("/")) {
        const pairMatch = nft.description.match(/([A-Z0-9]+)\/([A-Z0-9]+)/i);
        if (pairMatch && pairMatch.length >= 3) {
          tokenPair = `${pairMatch[1]}/${pairMatch[2]}`;
        }
      }
      
      // Si aún no tenemos un par, dejamos un marcador genérico
      if (!tokenPair) {
        tokenPair = "Unknown/Unknown";
      }
    }
    
    // Para el fee, usamos el valor disponible, pero NUNCA valores predeterminados incorrectos
    feeValue = nft.feeTier || nft.fee || "...";
  }
    
  return (
    <Card 
      className="overflow-hidden shadow-lg hover:shadow-xl dark:border-slate-700 transition-all cursor-pointer flex flex-col h-full bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800"
      onClick={onClick}
    >
      <CardContent className="p-0 flex flex-col h-full">
        {/* Header with ID and Status */}
        <div className="flex justify-between items-center p-2.5 bg-gradient-to-r from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-800/90 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center">
            <Tag className="h-3.5 w-3.5 text-primary mr-1.5" />
            <span className="text-xs font-medium text-slate-600 dark:text-slate-400">ID: {nft.tokenId}</span>
          </div>
          
          <div>
            {/* {NFT Status Indicator con debugging} */}
            {nft.status ? (
              <>
                {console.log(`NFT ${nft.tokenId} status: ${nft.status} (${typeof nft.status})`)}
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
                      <span>Active</span>
                    </>
                  ) : nft.status.toLowerCase() === "closed" || nft.status.toLowerCase() === "cerrado" ? (
                    <>
                      <XCircle className="h-3 w-3" />
                      <span>Closed</span>
                    </>
                  ) : nft.status.toLowerCase() === "finalized" || nft.status.toLowerCase() === "finalizado" ? (
                    <>
                      <CheckCircle className="h-3 w-3" />
                      <span>Finalized</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-3 w-3" />
                      <span>Unknown</span>
                    </>
                  )}
                </Badge>
              </>
            ) : (
              <Badge variant="outline" className="px-2 py-0 h-5 flex items-center gap-1 text-xs font-medium">
                <AlertCircle className="h-3 w-3" />
                <span>Unknown Status</span>
              </Badge>
            )}
          </div>
        </div>
        
        {/* NFT Image */}
        <div className="relative aspect-square w-full bg-gradient-to-br from-indigo-900/30 via-slate-900 to-purple-900/30">
          {nft.imageUrl ? (
            <div className="relative w-full h-full flex items-center justify-center">
              <img
                src={nft.imageUrl}
                alt={`Uniswap NFT #${nft.tokenId}`}
                className="w-[85%] h-[85%] object-contain rounded shadow-md"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-purple-500/10"></div>
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-slate-900">
              <Activity className="h-12 w-12 text-indigo-400" />
            </div>
          )}
          <div className="absolute top-2 right-2">
            <Badge
              variant="secondary"
              className="bg-black/80 text-white border-none px-2 py-1 text-xs font-semibold shadow-lg"
            >
              {nft.version === "Uniswap V3" ? "V3" : nft.version === "Uniswap V4" ? "V4" : nft.version}
            </Badge>
          </div>
        </div>
        
        {/* NFT Information */}
        <div className="p-3 flex flex-col flex-grow">
          <div className="mb-2">
            <div className="text-sm font-medium">
              {nft.version === "Uniswap V4" || nft.version?.includes("V4") 
                ? (
                    // Para V4, verificar si fee contiene '/' (indicando que es un par de tokens)
                    (nft.fee && nft.fee.includes('/')) 
                      ? nft.fee  // Si contiene '/', es el par de tokens
                      : tokenPair || "..." // No usar valores predeterminados incorrectos
                  )
                : tokenPair // Para V3 y otros, mantener el comportamiento actual
              }
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <div className="flex items-center">
                <Activity className="h-3 w-3 mr-1" />
                <span>
                  {nft.version === "Uniswap V4" || nft.version?.includes("V4") 
                    ? (nft.feeTier || nft.fee || "...") // Para V4, no usar valores predeterminados incorrectos
                    : feeValue // Para V3 y otros, mantener el comportamiento actual
                  }
                </span>
              </div>
              <div className="flex items-center">
                <Globe className="h-3 w-3 mr-1" />
                <span>{nft.network === "ethereum" ? "Ethereum" : nft.network === "polygon" ? "Polygon" : nft.network}</span>
              </div>
            </div>
          </div>
          
          <Separator className="my-1.5" />
          
          {/* Value */}
          <div className="mt-auto pt-1.5 flex flex-col">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span className="flex items-center">
                <Banknote className="h-3 w-3 mr-1" /> 
                Estimated Value
              </span>
              <Badge 
                variant="outline" 
                className="bg-slate-50 dark:bg-slate-800 text-xs font-normal h-5 px-1.5"
              >
                {nft.valueUsdc ? 
                  formatExactCurrency(Number(nft.valueUsdc), 0) : 
                  "No valorado"}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center">
                <BarChart3 className="h-3 w-3 mr-1" /> 
                Pool Status
              </span>
              <Badge
                variant={
                  nft.inRange === true ? "success" : 
                  nft.inRange === false ? "destructive" : 
                  (nft.version === "Uniswap V4" || nft.version?.includes("V4")) ? "success" :
                  "outline"
                }
                className="h-5 px-1.5 text-xs"
              >
                {
                  nft.inRange === true ? "In Range" : 
                  nft.inRange === false ? "Out of Range" : 
                  (nft.version === "Uniswap V4" || nft.version?.includes("V4")) ? "Always In Range" :
                  "Unknown"
                }
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export function ActiveNFTPositions() {
  const { address } = useWallet();
  const walletAddress = address?.toLowerCase() || '';
  const { t, language } = useTranslation();

  // 1. Obtenemos los NFTs REALES de blockchain del usuario
  const { data: blockchainNfts = [], isLoading: isLoadingBlockchain } = useUserNFTs();

  // 2. Obtenemos los NFTs administrados (para saber cuáles tienen status Active y valueUsdc)
  const { data: managedNfts = [], isLoading: isLoadingManaged } = useManagedNFTs();

  const isLoading = isLoadingBlockchain || isLoadingManaged;

  // LÓGICA SIMPLE:
  // - Tomar NFTs reales de blockchain
  // - Buscar cada uno en managed_nfts para obtener status y valueUsdc
  // - Solo mostrar los que tienen status Active y valueUsdc > 0
  const nfts = useMemo(() => {
    console.log(`[ActiveNFTPositions] NFTs de blockchain: ${blockchainNfts.length}`);
    console.log(`[ActiveNFTPositions] NFTs administrados disponibles: ${managedNfts.length}`);

    // Para cada NFT de blockchain, buscar su entrada en managed_nfts
    return blockchainNfts.map((nft: any) => {
      // Buscar en managed_nfts por tokenId
      const managedNft = managedNfts.find((m: any) => m.tokenId === nft.tokenId);

      if (managedNft) {
        console.log(`[ActiveNFTPositions] NFT #${nft.tokenId} encontrado en managed_nfts: status=${managedNft.status}, valueUsdc=${managedNft.valueUsdc}`);
        // Combinar datos de blockchain con datos de managed_nfts
        return {
          ...nft,
          walletAddress: walletAddress,
          status: managedNft.status || nft.status || 'Unknown',
          valueUsdc: managedNft.valueUsdc || '0.00',
        };
      }

      // Si no está en managed_nfts, mantener el NFT pero sin status/valueUsdc activo
      return {
        ...nft,
        walletAddress: walletAddress,
        status: nft.status || 'Unknown',
        valueUsdc: nft.valueUsdc || '0.00',
      };
    });
  }, [blockchainNfts, managedNfts, walletAddress]);
  
  // State for details dialog
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [selectedNFT, setSelectedNFT] = useState<string | undefined>(undefined);
  const [selectedNetwork, setSelectedNetwork] = useState<string>("polygon");
  
  // States for display and filters
  const [viewMode, setViewMode] = useState<"grid" | "table">("table");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  // Siempre mostrar solo los activos - no es configurable
  const showOnlyActive = true;
  const [showOnlyListed, setShowOnlyListed] = useState(false);
  
  // States for sorting
  const [sortField, setSortField] = useState<string>("tokenId");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  
  // Get details of the selected NFT
  const { data: nftDetails, isLoading: isLoadingDetails } = useNFTDetails(
    selectedNFT || "",
    selectedNetwork,
    selectedNFT && nfts.find((n: any) => n.tokenId === selectedNFT)?.contractAddress
  );
  
  // Handle changes in sorting
  const handleSortChange = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
    setCurrentPage(1);
  };
  
  // IMPLEMENTACIÓN EXACTA:
  // Si un usuario tiene un NFT en su wallet con ID: 000000000
  // Y en la base de datos existe el mismo ID
  // Leemos el estado del NFT de la base de datos
  // Si el estado es "Active", lo mostramos en el dashboard con su valor
  const filteredNFTs = useMemo(() => {
    if (!nfts || !Array.isArray(nfts)) return [];
    
    // Solo mostramos NFTs si hay un wallet conectado
    if (!walletAddress) return [];
    
    console.log(`Filtrando NFTs para wallet: ${walletAddress}`);
    
    // 1. Primero filtramos para obtener NFTs activos del usuario
    // 2. Luego eliminamos duplicados por tokenId
    
    // Paso 1: Obtener NFTs activos del usuario
    const activeUserNfts = nfts.filter(nft => {
      // Verificamos que el NFT está en la wallet del usuario
      const isUserNft = nft.tokenId && nft.walletAddress && 
                        nft.walletAddress.toLowerCase() === walletAddress.toLowerCase();
      
      // Verificamos que el estado es "Active" en la base de datos
      // Los NFTs sin entrada en la base de datos tendrán status === "Unknown"
      const isActive = nft.status && 
                      (nft.status.toLowerCase() === "active" || 
                       nft.status.toLowerCase() === "activo");
      
      // Solo NFTs que cumplen ambas condiciones (del usuario y con estado activo)
      // Los NFTs "Unknown" nunca se mostrarán como activos
      console.log(`NFT #${nft.tokenId} isUserNft: ${isUserNft}, isActive: ${isActive}, status: ${nft.status}`);
      return isUserNft && isActive;
    });
    
    console.log(`NFTs activos antes de eliminar duplicados: ${activeUserNfts.length}`);
    
    // Paso 2: Eliminar duplicados con el mismo tokenId y conservar solo los NFTs completos
    // Para cada grupo de NFTs con el mismo ID, nos quedamos con el que tiene más información
    const uniqueNfts: any[] = [];
    const processedIds = new Set<string>();
    
    // Agrupar NFTs por ID para encontrar duplicados
    const nftsByTokenId = new Map<string, any[]>();
    
    // Agrupar todos los NFTs por tokenId
    activeUserNfts.forEach(nft => {
      if (!nftsByTokenId.has(nft.tokenId)) {
        nftsByTokenId.set(nft.tokenId, []);
      }
      nftsByTokenId.get(nft.tokenId)!.push(nft);
    });
    
    // Para cada grupo de NFTs con el mismo ID
    nftsByTokenId.forEach((duplicates, tokenId) => {
      // Si hay más de un NFT con este ID, seleccionamos el mejor
      if (duplicates.length > 1) {
        console.log(`⚠️ ENCONTRADO NFT DUPLICADO con ID ${tokenId}, eliminando NFTs fantasma`);
        
        // Ordenamos por una puntuación de calidad
        duplicates.sort((a, b) => {
          // Puntuación basada en completitud (más puntos = más completo)
          const getScore = (nft: any) => {
            let score = 0;
            
            // Consideramos campos importantes
            if (nft.fee && typeof nft.fee === 'string' && nft.fee.includes("%")) score += 10; // Fee con formato correcto
            if (nft.feeTier) score += 5;
            if (nft.token0Symbol && nft.token0Symbol !== "Unknown") score += 2;
            if (nft.token1Symbol && nft.token1Symbol !== "Unknown") score += 2;
            if (nft.imageUrl) score += 2;
            if (nft.valueUsdc) score += 3;
            
            // Un NFT con estado y sin datos básicos probablemente es un fantasma
            if (!nft.fee && nft.status) score -= 5;
            
            console.log(`NFT ID ${tokenId}: Puntuación de calidad ${score}, Fee: ${nft.fee || 'ninguno'}, FeeTier: ${nft.feeTier || 'ninguno'}`);
            
            return score;
          };
          
          return getScore(b) - getScore(a); // Ordenamos de mayor a menor puntuación
        });
        
        // Seleccionamos el mejor NFT (el primero después de ordenar)
        uniqueNfts.push(duplicates[0]);
        
        console.log(`✅ Seleccionado NFT ID ${tokenId} con fee ${duplicates[0].fee || 'N/A'} de entre ${duplicates.length} duplicados`);
      } else {
        // Si solo hay uno, lo agregamos directamente
        uniqueNfts.push(duplicates[0]);
        
        console.log(`✅ Mostrando NFT #${tokenId} - Estado: ${duplicates[0].status} - Valor: ${duplicates[0].valueUsdc || '0'} USDC`);
      }
      
      // Marcar como procesado
      processedIds.add(tokenId);
    });
    
    console.log(`Total NFTs activos ÚNICOS encontrados: ${uniqueNfts.length}`);
    
    // Filtro adicional de marketplace si está habilitado
    const filteredNfts = !showOnlyListed 
      ? uniqueNfts 
      : uniqueNfts.filter(nft => nft.listing && nft.listing.isListed);
    
    // Paso 3: Ordenamos los NFTs según el campo y dirección seleccionados
    return filteredNfts.sort((a, b) => {
        // Sort according to the selected field
        let valueA, valueB;
        
        switch (sortField) {
          case "tokenId":
            // Convertir IDs a números para ordenar numéricamente
            valueA = parseInt(a.tokenId);
            valueB = parseInt(b.tokenId);
            break;
          case "version":
            valueA = a.version || "";
            valueB = b.version || "";
            break;
          case "pair":
            // Sort by token pairs
            const getPair = (nft: any) => {
              if (nft.fee && nft.fee.includes("/")) {
                return nft.fee;
              }
              return `${nft.token0Symbol}/${nft.token1Symbol}`;
            };
            valueA = getPair(a);
            valueB = getPair(b);
            break;
          case "fee":
            valueA = a.feeTier || a.fee || "";
            valueB = b.feeTier || b.fee || "";
            break;
          case "network":
            valueA = a.network || "";
            valueB = b.network || "";
            break;
          default:
            valueA = a[sortField] || "";
            valueB = b[sortField] || "";
        }
        
        // Comparar valores teniendo en cuenta la dirección de ordenación
        if (valueA < valueB) {
          return sortDirection === "asc" ? -1 : 1;
        }
        if (valueA > valueB) {
          return sortDirection === "asc" ? 1 : -1;
        }
        return 0;
      });
  }, [nfts, selectedNetwork, showOnlyActive, showOnlyListed, sortField, sortDirection]);
  
  // Efecto para reiniciar la paginación cuando cambian los filtros
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedNetwork, showOnlyActive, showOnlyListed, viewMode, itemsPerPage]);
  
  // Manejar clic en tarjeta o fila de NFT
  const [selectedContractAddress, setSelectedContractAddress] = useState<string | undefined>(undefined);
  
  const handleNFTClick = (tokenId: string, network: string, contractAddress: string) => {
    setSelectedNFT(tokenId);
    setSelectedNetwork(network);
    setSelectedContractAddress(contractAddress);
    setIsDetailsDialogOpen(true);
  };
  
  return (
    <div className="space-y-5">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">{t("myNFTs", nftsTranslations[language]?.myNFTs || "My NFTs")}</h3>
        
        <div className="flex items-center gap-4">
          {/* View selector (grid/table) */}
          <ToggleGroup 
            type="single" 
            value={viewMode} 
            onValueChange={(value) => value && setViewMode(value as "grid" | "table")}
            className="border rounded-md"
          >
            <ToggleGroupItem value="grid" aria-label="View as cards" className="h-8 w-8 p-0 data-[state=on]:bg-slate-100 dark:data-[state=on]:bg-slate-800">
              <LayoutGrid className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="table" aria-label="View as table" className="h-8 w-8 p-0 data-[state=on]:bg-slate-100 dark:data-[state=on]:bg-slate-800">
              <List className="h-4 w-4" />
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      ) : filteredNFTs.length > 0 ? (
        viewMode === "grid" ? (
          // Card view (grid)
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredNFTs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((nft, index) => (
                <NFTCard
                  key={`${nft.tokenId}-${nft.network}-${nft.id || index}`}
                  nft={nft}
                  onClick={() => handleNFTClick(nft.tokenId, nft.network, nft.contractAddress)}
                />
              ))}
            </div>
            
            {filteredNFTs.length > itemsPerPage && (
              <div className="flex items-center justify-between px-4 py-4 mt-4 border-t dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-8"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  {t("previous", nftsTranslations[language].previous)}
                </Button>
                <div className="flex items-center gap-1">
                  {(() => {
                    const totalPages = Math.ceil(filteredNFTs.length / itemsPerPage);
                    const pageNumbers = [];
                    
                    // Always show the first page
                    if (currentPage > 3) {
                      pageNumbers.push(1);
                      // If there's a gap, show ellipsis
                      if (currentPage > 4) {
                        pageNumbers.push('...');
                      }
                    }
                    
                    // Show pages around the current page
                    for (
                      let i = Math.max(2, currentPage - 1);
                      i <= Math.min(currentPage + 1, totalPages - 1);
                      i++
                    ) {
                      pageNumbers.push(i);
                    }
                    
                    // Always show the last page if there's more than one page
                    if (totalPages > 1) {
                      // If there's a gap at the end, show ellipsis
                      if (currentPage < totalPages - 2) {
                        pageNumbers.push('...');
                      }
                      pageNumbers.push(totalPages);
                    }
                    
                    return pageNumbers.map((page, index) => {
                      if (page === '...') {
                        return (
                          <span key={`ellipsis-${index}`} className="mx-1 text-sm text-slate-500">
                            ...
                          </span>
                        );
                      }
                      
                      return (
                        <Button
                          key={`page-${page}`}
                          variant={page === currentPage ? "default" : "outline"}
                          size="sm"
                          className={`h-8 w-8 p-0`}
                          onClick={() => setCurrentPage(Number(page))}
                        >
                          {page}
                        </Button>
                      );
                    });
                  })()}
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-8"
                  disabled={currentPage === Math.ceil(filteredNFTs.length / itemsPerPage)}
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(filteredNFTs.length / itemsPerPage)))}
                >
                  {t("next", nftsTranslations[language].next)}
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            )}
          </div>
        ) : (
          // Table view
          <div className="border rounded-lg overflow-hidden bg-white dark:bg-slate-900 dark:border-slate-700">
            <Table>
              <TableHeader className="bg-slate-50 dark:bg-slate-800">
                <TableRow>
                  <TableHead className="w-16"></TableHead>
                  <TableHead 
                    onClick={() => handleSortChange("pair")}
                    className="cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                  >
                    <div className="flex items-center">
                      <span>Token Pair</span>
                      {sortField === "pair" && (
                        <div className="ml-1">
                          {sortDirection === "asc" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </div>
                      )}
                      {sortField !== "pair" && <ArrowUpDown className="h-4 w-4 ml-1 opacity-30" />}
                    </div>
                  </TableHead>
                  <TableHead 
                    onClick={() => handleSortChange("version")}
                    className="cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                  >
                    <div className="flex items-center">
                      <span>Version</span>
                      {sortField === "version" && (
                        <div className="ml-1">
                          {sortDirection === "asc" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </div>
                      )}
                      {sortField !== "version" && <ArrowUpDown className="h-4 w-4 ml-1 opacity-30" />}
                    </div>
                  </TableHead>
                  <TableHead 
                    onClick={() => handleSortChange("tokenId")}
                    className="cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                  >
                    <div className="flex items-center">
                      <span>Token ID</span>
                      {sortField === "tokenId" && (
                        <div className="ml-1">
                          {sortDirection === "asc" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </div>
                      )}
                      {sortField !== "tokenId" && <ArrowUpDown className="h-4 w-4 ml-1 opacity-30" />}
                    </div>
                  </TableHead>
                  <TableHead 
                    onClick={() => handleSortChange("fee")}
                    className="cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                  >
                    <div className="flex items-center">
                      <span>Fee</span>
                      {sortField === "fee" && (
                        <div className="ml-1">
                          {sortDirection === "asc" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </div>
                      )}
                      {sortField !== "fee" && <ArrowUpDown className="h-4 w-4 ml-1 opacity-30" />}
                    </div>
                  </TableHead>
                  <TableHead>{t("status", nftsTranslations[language]?.status || "Status")}</TableHead>
                  <TableHead>{t("nftValue", "Value")}</TableHead>
                  <TableHead>{t("actions", "Actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredNFTs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((nft, index) => {
                  // Simplificado: Ya no necesitamos buscar NFTs administrados
                  // El estado se guarda directamente en el NFT
                  // Los NFTs sin entrada en la base de datos tendrán status === "Unknown"
                  const isActive = nft.status && 
                    (nft.status.toLowerCase() === 'active' || 
                     nft.status.toLowerCase() === 'activo' || 
                     nft.status.toLowerCase() === 'confirmed');
                  
                  // Determine token pair and fee to show in the table
                  let tokenPair, feeValue;
                  
                  // LÓGICA ESPECIAL PARA NFTS V4
                  if (nft.version === "Uniswap V4" || nft.version?.includes("V4")) {
                    // Para NFTs V4, sabemos que el par de tokens suele estar en el campo fee
                    if (nft.fee && nft.fee.includes("/")) {
                      tokenPair = nft.fee; // El campo fee contiene el par de tokens (ej. "WETH/USDC")
                      feeValue = nft.feeTier || "..."; // El fee real está en feeTier (ej. "0.3%")
                    } 
                    // Si no hay par en fee, verificamos en otros campos
                    else if (nft.title) {
                      // Intentar extraer del título si contiene un formato como "Uniswap - 0.3% - WETH/USDC"
                      const nameMatch = nft.title.match(/[^-]+ - [^-]+ - ([A-Z0-9]+)\/([A-Z0-9]+)/i);
                      if (nameMatch && nameMatch.length >= 3) {
                        tokenPair = `${nameMatch[1]}/${nameMatch[2]}`;
                        // Extraer el fee del título si es posible
                        const feeMatch = nft.title.match(/([0-9.]+%)/);
                        if (feeMatch && feeMatch.length >= 2) {
                          feeValue = feeMatch[1];
                        } else {
                          feeValue = nft.feeTier || nft.fee || "...";
                        }
                      } else {
                        // Intentar con un patrón más simple
                        const pairMatch = nft.title.match(/([A-Z0-9]+)\/([A-Z0-9]+)/i);
                        if (pairMatch && pairMatch.length >= 3) {
                          tokenPair = `${pairMatch[1]}/${pairMatch[2]}`;
                        } else {
                          tokenPair = "Unknown/Unknown"; // Última opción si no encontramos nada
                        }
                        feeValue = nft.feeTier || nft.fee || "...";
                      }
                    }
                    // Si aún no tenemos un par, intentar extraer de la descripción
                    else if (!tokenPair && nft.description) {
                      // Extraer de la descripción si tiene formato como "Fee Tier: 0.3%..."
                      const feeMatch = nft.description.match(/Fee Tier: ([0-9.]+%)/i);
                      if (feeMatch && feeMatch.length >= 2) {
                        feeValue = feeMatch[1];
                      }
                      
                      // Buscar pares de tokens en la descripción
                      const tokenMatch = nft.description.match(/([A-Z0-9]+)[- ]?\/[- ]?([A-Z0-9]+)/i);
                      if (tokenMatch && tokenMatch.length >= 3) {
                        tokenPair = `${tokenMatch[1]}/${tokenMatch[2]}`;
                      } else {
                        tokenPair = "Unknown/Unknown";
                      }
                    }
                    // Si aún no tenemos valor para tokenPair, usar uno genérico
                    if (!tokenPair) {
                      tokenPair = "Unknown/Unknown";
                    }
                  } 
                  // LÓGICA PARA NFTS V3 Y OTROS
                  else {
                    // Extraer información del par de tokens directamente de los metadatos del NFT
                    if (nft.fee && nft.fee.includes("/")) {
                      // Si el fee contiene un slash, es probable que tenga el formato "TOKEN0/TOKEN1"
                      tokenPair = nft.fee;
                      feeValue = nft.feeTier || nft.feeAmount || "...";
                    } else if (nft.token0Symbol && nft.token1Symbol && 
                               nft.token0Symbol !== "Unknown" && nft.token1Symbol !== "Unknown") {
                      // Usar los símbolos de token extraídos directamente de los metadatos
                      tokenPair = `${nft.token0Symbol}/${nft.token1Symbol}`;
                      feeValue = nft.fee || nft.feeAmount || nft.feeTier || "...";
                    } else if (nft.metadata?.token0Symbol && nft.metadata?.token1Symbol) {
                      // Alternativa: buscar en el objeto de metadatos si está disponible
                      tokenPair = `${nft.metadata.token0Symbol}/${nft.metadata.token1Symbol}`;
                      feeValue = nft.fee || nft.feeAmount || nft.feeTier || "...";
                    } else if (nft.description && nft.description.includes("/")) {
                      // Intentar extraer del campo de descripción si contiene un formato de par
                      const pairMatch = nft.description.match(/([A-Z0-9]+)\/([A-Z0-9]+)/i);
                      if (pairMatch && pairMatch.length >= 3) {
                        tokenPair = `${pairMatch[1]}/${pairMatch[2]}`;
                      } else {
                        tokenPair = `${nft.token0Symbol || ""}/${nft.token1Symbol || ""}`;
                      }
                      feeValue = nft.fee || nft.feeAmount || nft.feeTier || "...";
                    } else {
                      // Si ninguna fuente de datos proporciona información de par de tokens clara
                      tokenPair = `${nft.token0Symbol || ""}/${nft.token1Symbol || ""}`;
                      feeValue = nft.fee || nft.feeAmount || nft.feeTier || "...";
                    }
                  }
                  
                  return (
                    <TableRow 
                      key={`${nft.tokenId}-${nft.network}-${nft.id || index}`} 
                      className="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/70"
                      onClick={() => handleNFTClick(nft.tokenId, nft.network, nft.contractAddress)}
                    >
                      <TableCell className="p-2">
                        <div className="w-12 h-12 relative rounded-md overflow-hidden">
                          {nft.imageUrl ? (
                            <img
                              src={nft.imageUrl}
                              alt={`NFT #${nft.tokenId}`}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                              <Activity className="h-6 w-6 text-slate-400" />
                            </div>
                          )}
                          <div className="absolute top-0 right-0 text-xs bg-black/70 text-white px-1 py-0.5 rounded-bl-md">
                            {nft.version === "Uniswap V3" ? "V3" : nft.version === "Uniswap V4" ? "V4" : nft.version}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">
                          {nft.version === "Uniswap V4" || nft.version?.includes("V4") 
                            ? (
                                // Para V4, verificar si fee contiene '/' (indicando que es un par de tokens)
                                (nft.fee && nft.fee.includes('/')) 
                                  ? nft.fee  // Si contiene '/', es el par de tokens
                                  : "WETH/USDC" // Valor por defecto para V4 si no hay par de tokens
                              )
                            : tokenPair // Para V3 y otros, mantener el comportamiento actual
                          }
                        </div>
                        <div className="text-xs text-slate-500">{nft.network === "ethereum" ? "Ethereum" : nft.network === "polygon" ? "Polygon" : nft.network}</div>
                      </TableCell>
                      <TableCell>
                        {nft.version === "Uniswap V3" ? "V3" : nft.version === "Uniswap V4" ? "V4" : nft.version}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <span className="font-medium">{nft.tokenId}</span>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="w-6 h-6 text-slate-500 hover:text-slate-900"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigator.clipboard.writeText(nft.tokenId);
                            }}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-normal">
                          {nft.version === "Uniswap V4" || nft.version?.includes("V4") 
                            ? (nft.feeTier || nft.fee || "...") // Para V4, no usar valores predeterminados incorrectos
                            : feeValue // Para V3 y otros, mantener el comportamiento actual
                          }
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {nft.status ? (
                          <Badge 
                            variant={
                              nft.status.toLowerCase() === "active" || nft.status.toLowerCase() === "activo" ? "success" : 
                              nft.status.toLowerCase() === "closed" ? "destructive" : 
                              nft.status.toLowerCase() === "finalized" ? "default" : 
                              "outline"
                            } 
                            className="flex items-center gap-1 font-normal"
                          >
                            {nft.status.toLowerCase() === "active" || nft.status.toLowerCase() === "activo" ? (
                              <>
                                <CheckCircle className="h-3 w-3" />
                                <span>Active</span>
                              </>
                            ) : nft.status.toLowerCase() === "closed" ? (
                              <>
                                <XCircle className="h-3 w-3" />
                                <span>Closed</span>
                              </>
                            ) : nft.status.toLowerCase() === "finalized" ? (
                              <>
                                <CheckCircle className="h-3 w-3" />
                                <span>Finalized</span>
                              </>
                            ) : (
                              <>
                                <AlertCircle className="h-3 w-3" />
                                <span>Unknown</span>
                              </>
                            )}
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="flex items-center gap-1 font-normal">
                            <AlertCircle className="h-3 w-3" />
                            <span>{language === 'es' ? 'Estado Desconocido' : language === 'fr' ? 'Statut Inconnu' : language === 'de' ? 'Unbekannter Status' : 'Unknown Status'}</span>
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {nft.valueUsdc ? (
                          <div className="font-medium">
                            {formatExactCurrency(Number(nft.valueUsdc), 0)}
                          </div>
                        ) : (
                          <span className="text-slate-500 text-xs">{t("notValued", nftsTranslations[language].notValued)}</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm" className="h-8">
                          <ExternalLink className="h-3 w-3 mr-1" /> 
                          {t("viewDetails", nftsTranslations[language]?.viewDetails || "View Details")}
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            
            {filteredNFTs.length > itemsPerPage && (
              <div className="flex items-center justify-between px-4 py-2 border-t dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-8"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  {t("previous", nftsTranslations[language].previous)}
                </Button>
                <div className="flex items-center gap-1">
                  <span className="text-sm text-slate-500">
                    {t("page", nftsTranslations[language].page)} {currentPage} {t("of", nftsTranslations[language].of)} {Math.ceil(filteredNFTs.length / itemsPerPage)}
                  </span>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-8"
                  disabled={currentPage === Math.ceil(filteredNFTs.length / itemsPerPage)}
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(filteredNFTs.length / itemsPerPage)))}
                >
                  {t("next", nftsTranslations[language].next)}
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            )}
          </div>
        )
      ) : (
        <div className="py-8 text-center text-muted-foreground border rounded-lg dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
          <p>No active NFTs found in your wallet.</p>
          <p className="text-sm mt-2">
            Activate your NFTs from the administration section to make them appear here.
          </p>
        </div>
      )}
      
      {/* NFT details dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="max-w-3xl">
          {isLoadingDetails ? (
            <div className="flex justify-center py-8">
              <Spinner size="lg" />
            </div>
          ) : nftDetails ? (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center justify-between">
                  <span>Position #{nftDetails.tokenId}</span>
                  <div className="flex items-center gap-1">
                    <Badge variant="outline" className="font-normal">
                      {nftDetails.network === "ethereum" ? "Ethereum" : nftDetails.network === "polygon" ? "Polygon" : nftDetails.network}
                    </Badge>
                    <Badge variant="secondary" className="font-normal">
                      {nftDetails.version === "Uniswap V3" ? "V3" : nftDetails.version === "Uniswap V4" ? "V4" : nftDetails.version}
                    </Badge>
                  </div>
                </DialogTitle>
                <DialogDescription>
                  Details of the tokenized liquidity position
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Image and status */}
                <div className="flex flex-col h-full">
                  <div className="relative aspect-square w-full rounded-lg overflow-hidden mb-3 border dark:border-slate-700 bg-gradient-to-br from-indigo-900/40 via-slate-900 to-purple-900/40">
                    {nftDetails.imageUrl ? (
                      <div className="relative w-full h-full flex items-center justify-center">
                        <img
                          src={nftDetails.imageUrl}
                          alt={`Uniswap NFT #${nftDetails.tokenId}`}
                          className="max-w-[90%] max-h-[90%] object-contain z-10 rounded shadow-lg"
                        />
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-purple-500/10 z-0"></div>
                      </div>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-slate-900">
                        <Activity className="h-16 w-16 text-indigo-400" />
                      </div>
                    )}
                  </div>
                  
                  {/* NFT Status */}
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border dark:border-slate-700">
                    <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
                      <Info className="h-4 w-4" /> 
                      Position Status
                    </h4>
                    
                    <div className="space-y-2">
                      {/* Status from managed NFT */}
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-500">Status:</span>
                        <NFTStatusBadge
                          nftDetails={nftDetails}
                        />
                      </div>
                      
                      {/* NFT Value */}
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-500">Estimated Value:</span>
                        <NFTValueBadge
                          nftDetails={nftDetails}
                        />
                      </div>
                      
                      {/* Pool Status */}
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-500">In Range:</span>
                        <Badge
                          variant={
                            nftDetails.inRange === true ? "success" : 
                            nftDetails.inRange === false ? "destructive" : 
                            (nftDetails.version === "Uniswap V4" || nftDetails.version?.includes("V4")) ? "success" :
                            "outline"
                          }
                        >
                          {
                            nftDetails.inRange === true ? "In Range" : 
                            nftDetails.inRange === false ? "Out of Range" : 
                            (nftDetails.version === "Uniswap V4" || nftDetails.version?.includes("V4")) ? "Always In Range" :
                            "Unknown"
                          }
                        </Badge>
                      </div>
                      
                      {/* Marketplace listing status */}
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-500">Marketplace Listing:</span>
                        <Badge
                          variant={nftDetails.listing?.isListed ? "success" : "outline"}
                        >
                          {nftDetails.listing?.isListed ? 
                            `Listed (${nftDetails.listing.marketplace || "Marketplace"})` : 
                            "Not Listed"}
                        </Badge>
                      </div>
                    </div>
                    
                    {nftDetails.listing?.isListed && nftDetails.listing.priceUsd && (
                      <div className="mt-3 pt-3 border-t dark:border-slate-700">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-slate-500">Listed Price:</span>
                          <span className="font-medium">{nftDetails.listing.priceUsd}</span>
                        </div>
                      </div>
                    )}
                    
                    {/* Strategic position notice */}
                    <div className="mt-4 p-3 rounded-lg bg-indigo-950/30 border border-indigo-500/20 backdrop-blur-sm relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-purple-500/5 z-0"></div>
                      <div className="absolute top-0 right-0 w-24 h-24 bg-purple-600/10 blur-3xl rounded-full -mr-8 -mt-8"></div>
                      <div className="absolute bottom-0 left-0 w-16 h-16 bg-indigo-600/10 blur-2xl rounded-full -ml-4 -mb-4"></div>
                      
                      <div className="flex items-start gap-2 relative z-10">
                        <div className="shrink-0 mt-0.5">
                          <Shield className="h-5 w-5 text-indigo-400" />
                        </div>
                        <div className="space-y-1">
                          <h5 className="text-sm font-medium text-indigo-300">{APP_NAME} Strategic Position</h5>
                          <p className="text-xs text-slate-300 leading-relaxed">
                            This NFT represents a tokenized liquidity position that {APP_NAME} uses in the main pool to generate yield. Upon completion of the investment period, the full capital will be returned to the current token, increasing its value on the blockchain.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Position details */}
                <div className="flex flex-col space-y-4">
                  {/* General information */}
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg border dark:border-slate-700">
                    <h4 className="text-sm font-medium mb-3 flex items-center gap-1">
                      <Layers className="h-4 w-4" /> 
                      Position Information
                    </h4>
                    
                    <div className="space-y-2.5">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-500">Token Pair:</span>
                        <TokenPairDisplay nftDetails={nftDetails} />
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-500">Transaction Fee:</span>
                        <FeeTierDisplay nftDetails={nftDetails} />
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-500">Token ID:</span>
                        <div className="flex items-center gap-1">
                          <span className="font-medium">{nftDetails.tokenId}</span>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="w-6 h-6 text-slate-500 hover:text-slate-900"
                            onClick={() => {
                              navigator.clipboard.writeText(nftDetails.tokenId);
                            }}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-500">Network:</span>
                        <span className="font-medium">
                          {nftDetails.network === "ethereum" ? "Ethereum" : 
                           nftDetails.network === "polygon" ? "Polygon" : 
                           nftDetails.network}
                        </span>
                      </div>
                      
                      {nftDetails.poolAddress && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-slate-500">Pool Address:</span>
                          <div className="flex items-center gap-1">
                            <span className="font-medium text-xs font-mono">
                              {nftDetails.poolAddress.slice(0, 6)}...{nftDetails.poolAddress.slice(-4)}
                            </span>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="w-6 h-6 text-slate-500 hover:text-slate-900"
                              onClick={() => {
                                navigator.clipboard.writeText(nftDetails.poolAddress || "");
                              }}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="w-6 h-6 text-slate-500 hover:text-slate-900"
                              onClick={() => {
                                const network = nftDetails.network === "polygon" ? "polygon" : "mainnet";
                                window.open(`https://app.uniswap.org/explore/pools/${network}/${nftDetails.poolAddress}`, "_blank");
                              }}
                            >
                              <ExternalLink className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      )}
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-500">NFT Contract Address:</span>
                        <div className="flex items-center gap-1">
                          <span className="font-medium text-xs font-mono">
                            {nftDetails.contractAddress.slice(0, 6)}...{nftDetails.contractAddress.slice(-4)}
                          </span>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="w-6 h-6 text-slate-500 hover:text-slate-900"
                            onClick={() => {
                              navigator.clipboard.writeText(nftDetails.contractAddress);
                            }}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Description (optional) */}
                  {nftDetails.description && (
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg border dark:border-slate-700">
                      <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
                        <Info className="h-4 w-4" /> 
                        Description
                      </h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400 whitespace-pre-wrap">
                        {nftDetails.description}
                      </p>
                    </div>
                  )}
                </div>
              </div>
              
              <DialogFooter className="flex flex-col sm:flex-row gap-2">
                <div className="flex gap-2 w-full sm:w-auto">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      const network = nftDetails.network?.toLowerCase();
                      const nftContract = nftDetails.contractAddress || "0xC36442b4a4522E871399CD717aBDD847Ab11FE88";
                      let url = "";
                      
                      // Determinar la URL de OpenSea según la red y el contrato
                      if (network === "polygon") {
                        url = `https://opensea.io/assets/matic/${nftContract}/${nftDetails.tokenId}`;
                      } else if (network === "unichain") {
                        url = `https://opensea.io/assets/unichain/${nftContract}/${nftDetails.tokenId}`;
                      } else {
                        // Para Ethereum y cualquier otra red por defecto
                        url = `https://opensea.io/assets/ethereum/${nftContract}/${nftDetails.tokenId}`;
                      }
                      
                      window.open(url, "_blank");
                    }}
                    className="flex-grow"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View on OpenSea
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      const network = nftDetails.network.toLowerCase();
                      const nftContract = nftDetails.contractAddress || "0xC36442b4a4522E871399CD717aBDD847Ab11FE88";
                      let url = "";
                      
                      switch (network) {
                        case "polygon":
                          url = `https://polygonscan.com/nft/${nftContract}/${nftDetails.tokenId}`;
                          break;
                        case "optimism":
                          url = `https://optimistic.etherscan.io/token/${nftContract}?a=${nftDetails.tokenId}`;
                          break;
                        case "arbitrum":
                          url = `https://arbiscan.io/token/${nftContract}?a=${nftDetails.tokenId}`;
                          break;
                        case "ethereum":
                        default:
                          url = `https://etherscan.io/token/${nftContract}?a=${nftDetails.tokenId}`;
                          break;
                      }
                      
                      window.open(url, "_blank");
                    }}
                    className="flex-grow"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View on Explorer
                  </Button>
                </div>
                
                <Button variant="default" onClick={() => setIsDetailsDialogOpen(false)} className="w-full sm:w-auto">
                  Close
                </Button>
              </DialogFooter>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-8">
              <AlertCircle className="h-10 w-10 text-slate-400 mb-2" />
              <p className="text-slate-500">Could not load NFT details.</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-4"
                onClick={() => setIsDetailsDialogOpen(false)}
              >
                Close
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}