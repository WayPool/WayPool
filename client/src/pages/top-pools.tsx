import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { PageHeader } from '@/components/ui/page-header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PoolCard } from '@/components/ui/pool-card';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, Filter, ChevronDown, RefreshCw } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { Network } from '@/types/blockchain';

// Tipos para los pools (compartidos con el backend)
export interface Pool {
  id: string;
  address: string;
  name: string;
  token0Symbol: string;
  token1Symbol: string;
  tvl: number;
  volume24h: number;
  fees24h: number;
  apr: number;
  fee: string;
  network: string;
  isV4: boolean;
  hasStablecoin: boolean;
  version: string;
  feeTier?: number;
  priceRatio?: number;
  createdAt?: string;
  priceChange24h?: number;
}

// Lista de redes disponibles
const NETWORKS: Network[] = [
  { id: 'all', name: 'Todas las redes', icon: '🌐' },
  { id: 'ethereum', name: 'Ethereum', icon: '🔷' },
  { id: 'polygon', name: 'Polygon', icon: '🟣' },
  { id: 'arbitrum', name: 'Arbitrum', icon: '🔵' },
  { id: 'optimism', name: 'Optimism', icon: '🔴' },
  { id: 'base', name: 'Base', icon: '🔘' },
];

// Lista de opciones de ordenamiento
const SORT_OPTIONS = [
  { value: 'apr', label: 'Mayor APR' },
  { value: 'tvl', label: 'Mayor TVL' },
  { value: 'volume24h', label: 'Mayor Volumen 24h' },
  { value: 'fees24h', label: 'Mayores Comisiones 24h' },
  { value: 'priceChange24h', label: 'Mayor Cambio de Precio 24h' },
  { value: 'newest', label: 'Más Recientes' },
];

export default function TopPoolsPage() {
  // Estado para filtros y ordenamiento
  const [searchTerm, setSearchTerm] = useState('');
  const [network, setNetwork] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('apr');
  const [activeTab, setActiveTab] = useState<string>('all');
  const [selectedPoolId, setSelectedPoolId] = useState<string | null>(null);
  
  const { toast } = useToast();

  // Consulta para obtener los pools
  const { data: pools, isLoading, isError, error, refetch } = useQuery<Pool[]>({
    queryKey: ['/api/top-v4-stablecoin-pools'],
    retry: 1,
  });

  // Función para filtrar pools
  const getFilteredPools = () => {
    if (!pools) return [];

    // Filtrar por término de búsqueda
    let filtered = pools.filter(pool => 
      pool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pool.token0Symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pool.token1Symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pool.address.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Filtrar por red
    if (network !== 'all') {
      filtered = filtered.filter(pool => pool.network === network);
    }

    // Filtrar por versión (V3 o V4)
    if (activeTab !== 'all') {
      filtered = filtered.filter(pool => pool.version === activeTab);
    }

    // Ordenar
    return sortPools(filtered, sortBy);
  };

  // Función para ordenar pools
  const sortPools = (poolsToSort: Pool[], sortKey: string): Pool[] => {
    switch (sortKey) {
      case 'apr':
        return [...poolsToSort].sort((a, b) => b.apr - a.apr);
      case 'tvl':
        return [...poolsToSort].sort((a, b) => b.tvl - a.tvl);
      case 'volume24h':
        return [...poolsToSort].sort((a, b) => b.volume24h - a.volume24h);
      case 'fees24h':
        return [...poolsToSort].sort((a, b) => b.fees24h - a.fees24h);
      case 'priceChange24h':
        return [...poolsToSort].sort((a, b) => {
          // Manejar casos donde priceChange24h es undefined
          const changeA = a.priceChange24h || 0;
          const changeB = b.priceChange24h || 0;
          return Math.abs(changeB) - Math.abs(changeA); // Ordenar por magnitud del cambio
        });
      case 'newest':
        return [...poolsToSort].sort((a, b) => {
          // Si no hay fechas, ordenar por ID (asumiendo que los IDs más altos son más recientes)
          if (!a.createdAt || !b.createdAt) {
            return parseInt(b.id) - parseInt(a.id);
          }
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
      default:
        return poolsToSort;
    }
  };

  // Obtener los pools filtrados
  const filteredPools = getFilteredPools();

  // Manejar click en un pool
  const handlePoolClick = (poolId: string) => {
    setSelectedPoolId(poolId);

    // Encontrar el pool seleccionado
    const pool = pools?.find(p => p.id === poolId);
    if (pool) {
      toast({
        title: `Pool ${pool.name} seleccionado`,
        description: `APR: ${pool.apr.toFixed(2)}% | TVL: $${pool.tvl.toLocaleString()}`,
      });
    }
  };

  // Manejar la actualización de datos
  const handleRefresh = () => {
    refetch();
    toast({
      title: "Actualizando datos",
      description: "Obteniendo información más reciente de los pools",
    });
  };

  return (
    <div className="container mx-auto py-6 space-y-8">
      <PageHeader
        title="Top Pools de Uniswap"
        description="Explora los mejores pools de liquidez en Uniswap V3 y V4 por rendimiento (APR), TVL, y volumen"
      />

      <div className="flex flex-col md:flex-row gap-4 justify-between">
        {/* Filtros */}
        <div className="flex flex-col md:flex-row gap-2 flex-1">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Buscar por nombre o dirección..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={network} onValueChange={setNetwork}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Red" />
            </SelectTrigger>
            <SelectContent>
              {NETWORKS.map((net) => (
                <SelectItem key={net.id} value={net.id}>
                  <div className="flex items-center">
                    <span className="mr-2">{net.icon}</span> {net.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Ordenar por" />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Botón de actualizar */}
        <Button variant="outline" onClick={handleRefresh} className="flex items-center">
          <RefreshCw className="h-4 w-4 mr-2" />
          Actualizar
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="all">Todos</TabsTrigger>
          <TabsTrigger value="V4">V4</TabsTrigger>
          <TabsTrigger value="V3">V3</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab} className="mt-0">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(9)].map((_, index) => (
                <Skeleton key={index} className="h-[200px] w-full" />
              ))}
            </div>
          ) : isError ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <h3 className="text-lg font-semibold mb-2">Error al cargar los pools</h3>
              <p className="text-muted-foreground mb-4">
                {error instanceof Error ? error.message : "Hubo un problema al obtener los datos"}
              </p>
              <Button onClick={() => refetch()}>Reintentar</Button>
            </div>
          ) : filteredPools.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <h3 className="text-lg font-semibold mb-2">No se encontraron pools</h3>
              <p className="text-muted-foreground">
                Intenta cambiar los filtros o términos de búsqueda
              </p>
            </div>
          ) : (
            <>
              <p className="text-sm text-muted-foreground mb-4">
                Mostrando {filteredPools.length} pools
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredPools.map((pool) => (
                  <PoolCard
                    key={pool.id}
                    pool={pool}
                    onClick={handlePoolClick}
                    isSelected={selectedPoolId === pool.id}
                  />
                ))}
              </div>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}