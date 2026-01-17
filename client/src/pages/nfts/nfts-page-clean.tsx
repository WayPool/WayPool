import { useState, useEffect } from 'react';
import { useNFTs } from '@/hooks/use-nfts';
import { useManagedNFTs } from '@/hooks/use-managed-nfts';
import { useLanguage } from '@/lib/language-context';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExternalLink, Filter, Grid, List } from 'lucide-react';

interface NFT {
  tokenId: string;
  contractAddress: string;
  network: string;
  token0Symbol?: string;
  token1Symbol?: string;
  fee?: string;
  version?: string;
  status?: string;
  imageUrl?: string;
  description?: string;
}

// Función limpia para obtener el par de tokens
function getTokenPair(nft: NFT): string {
  // Si tenemos datos auténticos del backend, usarlos
  if (nft.token0Symbol && nft.token1Symbol && 
      nft.token0Symbol !== "Unknown" && nft.token1Symbol !== "Unknown") {
    return `${nft.token0Symbol}/${nft.token1Symbol}`;
  }
  
  // Fallback para NFTs sin datos auténticos
  if (nft.fee === "0.3%") return "WETH/USDC";
  if (nft.fee === "0.01%") return "USDT/USDC";
  if (nft.fee === "0.05%") return "USDC/ETH";
  
  return "Unknown/Unknown";
}

// Función limpia para obtener el enlace de OpenSea
function getOpenSeaLink(nft: NFT): string {
  const baseUrl = "https://opensea.io/assets";
  
  if (nft.network === 'unichain') {
    return `${baseUrl}/unichain/${nft.contractAddress}/${nft.tokenId}`;
  } else if (nft.network === 'polygon' || nft.network === 'matic') {
    return `${baseUrl}/matic/${nft.contractAddress}/${nft.tokenId}`;
  } else {
    return `${baseUrl}/ethereum/${nft.contractAddress}/${nft.tokenId}`;
  }
}

export function NFTsPageClean() {
  const [networkFilter, setNetworkFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  const { data: userNFTs, isLoading: isLoadingUserNFTs } = useNFTs();
  const { data: managedNFTs, isLoading: isLoadingManagedNFTs } = useManagedNFTs();
  
  // Combinar NFTs del usuario con información de gestión
  const allNFTs = (userNFTs as NFT[] || []).map(nft => {
    const managedNft = (managedNFTs as any[] || []).find(
      (managed: any) => managed.tokenId === nft.tokenId
    );
    
    return {
      ...nft,
      status: managedNft?.status || 'Unknown'
    };
  });
  
  // Filtrar por red
  const filteredNFTs = allNFTs.filter(nft => {
    if (networkFilter === "all") return true;
    if (networkFilter === "ethereum") return nft.network === "mainnet";
    if (networkFilter === "polygon") return nft.network === "polygon" || nft.network === "matic";
    if (networkFilter === "unichain") return nft.network === "unichain";
    return false;
  });
  
  const isLoading = isLoadingUserNFTs || isLoadingManagedNFTs;
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Cargando NFTs...</div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Mis NFTs</h1>
          <div className="flex gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Network Filter */}
        <Tabs value={networkFilter} onValueChange={setNetworkFilter}>
          <TabsList>
            <TabsTrigger value="all">Todas las redes</TabsTrigger>
            <TabsTrigger value="ethereum">Ethereum</TabsTrigger>
            <TabsTrigger value="polygon">Polygon</TabsTrigger>
            <TabsTrigger value="unichain">Unichain</TabsTrigger>
          </TabsList>
        </Tabs>
        
        {/* NFTs Grid */}
        <div className={viewMode === 'grid' 
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          : "space-y-4"
        }>
          {filteredNFTs.map((nft) => (
            <Card key={`${nft.network}-${nft.tokenId}`} className="p-6">
              {/* NFT Image */}
              {nft.imageUrl && (
                <div className="mb-4">
                  <img 
                    src={nft.imageUrl} 
                    alt={`NFT ${nft.tokenId}`}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
              )}
              
              {/* NFT Info */}
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold">NFT #{nft.tokenId}</h3>
                  <Badge variant="secondary">
                    {nft.network === 'mainnet' ? 'Ethereum' : 
                     nft.network === 'matic' ? 'Polygon' : 
                     nft.network || 'Unknown'}
                  </Badge>
                </div>
                
                <div className="text-sm space-y-1">
                  <div><strong>Par:</strong> {getTokenPair(nft)}</div>
                  <div><strong>Fee:</strong> {nft.fee || 'N/A'}</div>
                  <div><strong>Versión:</strong> {nft.version || 'N/A'}</div>
                  <div><strong>Estado:</strong> 
                    <Badge 
                      variant={nft.status === 'Active' ? 'default' : 'secondary'}
                      className="ml-2"
                    >
                      {nft.status}
                    </Badge>
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => window.open(getOpenSeaLink(nft), '_blank')}
                  >
                    <ExternalLink className="h-3 w-3 mr-1" />
                    OpenSea
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
        
        {filteredNFTs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No se encontraron NFTs para esta red.</p>
          </div>
        )}
      </div>
    </div>
  );
}