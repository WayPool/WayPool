import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, Filter, RefreshCw } from 'lucide-react';
import MetaTags from '@/components/seo/meta-tags';
import SchemaMarkup from '@/components/seo/schema-markup';
import { APP_NAME, CANONICAL_BASE_URL } from '@/utils/app-config';

// Tipo para la visualización en la tabla
interface DisplayPool {
  id: string;
  pairName: string;
  protocol: string;
  feeTier: string;
  tvl: number;
  apr: number;
  rewardApr?: number;
  oneDayVolume: number;
  thirtyDayVolume: number;
  volumeTvlRatio: number;
}

export default function UniswapExplorer() {
  const [searchTerm, setSearchTerm] = useState('');
  const [protocolFilter, setProtocolFilter] = useState('all');
  const [feeTierFilter, setFeeTierFilter] = useState('all');
  const [sortBy, setSortBy] = useState('apr');
  const [displayPools, setDisplayPools] = useState<DisplayPool[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // SEO configuration
  const title = `${APP_NAME} | Explorador de Pools de Uniswap`;
  const description = "Explora las pools más rentables de Uniswap. Compara APR, TVL y volumen en tiempo real entre diferentes versiones y redes de Uniswap.";
  const currentPath = "/uniswap";
  
  // Structured data for search engines
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": title,
    "description": description,
    "applicationCategory": "FinanceApplication",
    "operatingSystem": "Any",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "keywords": "uniswap, defi, liquidity pools, crypto, ethereum, apr, tvl, tokens, blockchain, finance"
  };

  // Cargar datos de pools de Uniswap
  useEffect(() => {
    setIsLoading(true);
    
    // Datos simulados para mostrar en la tabla
    const mockPools: DisplayPool[] = [
      {
        id: 'v3-eth-usdc-005',
        pairName: 'ETH/USDC',
        protocol: 'v3',
        feeTier: '0.05%',
        tvl: 50200000,
        apr: 81.03,
        oneDayVolume: 222700000,
        thirtyDayVolume: 4933600000,
        volumeTvlRatio: 4.44
      },
      {
        id: 'v3-wbtc-usdc-030',
        pairName: 'WBTC/USDC',
        protocol: 'v3',
        feeTier: '0.30%',
        tvl: 100300000,
        apr: 85.22,
        oneDayVolume: 78100000,
        thirtyDayVolume: 1036700000,
        volumeTvlRatio: 0.78
      },
      {
        id: 'v3-wbtc-usdc-100',
        pairName: 'WBTC/USDC',
        protocol: 'v3',
        feeTier: '1.00%',
        tvl: 22600000,
        apr: 249.005,
        oneDayVolume: 15400000,
        thirtyDayVolume: 31600000,
        volumeTvlRatio: 0.68
      },
      {
        id: 'v3-eth-usdt-005',
        pairName: 'ETH/USDT',
        protocol: 'v3',
        feeTier: '0.05%',
        tvl: 11000000,
        apr: 55.768,
        oneDayVolume: 33500000,
        thirtyDayVolume: 894900000,
        volumeTvlRatio: 3.06
      },
      {
        id: 'v3-eth-usdt-030',
        pairName: 'ETH/USDT',
        protocol: 'v3',
        feeTier: '0.30%',
        tvl: 60900000,
        apr: 65.275,
        oneDayVolume: 36300000,
        thirtyDayVolume: 937900000,
        volumeTvlRatio: 0.60
      },
      {
        id: 'v3-dai-eth-030',
        pairName: 'DAI/ETH',
        protocol: 'v3',
        feeTier: '0.30%',
        tvl: 7900000,
        apr: 69.209,
        oneDayVolume: 5000000,
        thirtyDayVolume: 98700000,
        volumeTvlRatio: 0.63
      },
      {
        id: 'v3-usdc-eth-030',
        pairName: 'USDC/ETH',
        protocol: 'v3',
        feeTier: '0.30%',
        tvl: 68400000,
        apr: 57.631,
        oneDayVolume: 36000000,
        thirtyDayVolume: 766000000,
        volumeTvlRatio: 0.53
      },
      {
        id: 'v2-virtual-eth-030',
        pairName: 'VIRTUAL/ETH',
        protocol: 'v2',
        feeTier: '0.30%',
        tvl: 7600000,
        apr: 37.747,
        oneDayVolume: 2600000,
        thirtyDayVolume: 136900000,
        volumeTvlRatio: 0.34
      },
      {
        id: 'v4-eth-usdc-005',
        pairName: 'ETH/USDC',
        protocol: 'v4',
        feeTier: '0.05%',
        tvl: 63900000,
        apr: 53.256,
        rewardApr: 21.9,
        oneDayVolume: 186500000,
        thirtyDayVolume: 3624000000,
        volumeTvlRatio: 2.92
      },
      {
        id: 'v4-usdc-wbtc-030',
        pairName: 'USDC/WBTC',
        protocol: 'v4',
        feeTier: '0.30%',
        tvl: 34900000,
        apr: 46.131,
        rewardApr: 12.28,
        oneDayVolume: 14700000,
        thirtyDayVolume: 298600000,
        volumeTvlRatio: 0.42
      },
      {
        id: 'v4-usdt0-wbtc-005',
        pairName: 'USDT0/WBTC',
        protocol: 'v4',
        feeTier: '0.05%',
        tvl: 15300000,
        apr: 40.879,
        rewardApr: 30.83,
        oneDayVolume: 34400000,
        thirtyDayVolume: 1119700000,
        volumeTvlRatio: 2.24
      },
      {
        id: 'v4-eth-usdt0-005',
        pairName: 'ETH/USDT0',
        protocol: 'v4',
        feeTier: '0.05%',
        tvl: 44500000,
        apr: 38.346,
        rewardApr: 30.96,
        oneDayVolume: 93600000,
        thirtyDayVolume: 2288100000,
        volumeTvlRatio: 2.10
      },
      {
        id: 'v4-wbtc-usdc-100',
        pairName: 'WBTC/USDC',
        protocol: 'v4',
        feeTier: '1.00%',
        tvl: 22600000,
        apr: 249.005,
        rewardApr: 0,
        oneDayVolume: 15400000,
        thirtyDayVolume: 31600000,
        volumeTvlRatio: 0.68
      },
      {
        id: 'v4-wbtc-usdc-030',
        pairName: 'WBTC/USDC',
        protocol: 'v4',
        feeTier: '0.30%',
        tvl: 100300000,
        apr: 85.22,
        rewardApr: 0,
        oneDayVolume: 78100000,
        thirtyDayVolume: 1036700000,
        volumeTvlRatio: 0.78
      },
      {
        id: 'v4-eth-usdc-005b',
        pairName: 'ETH/USDC',
        protocol: 'v4',
        feeTier: '0.05%',
        tvl: 50200000,
        apr: 81.03,
        rewardApr: 0,
        oneDayVolume: 222700000,
        thirtyDayVolume: 4933600000,
        volumeTvlRatio: 4.44
      }
    ];
    
    // Ordenar los pools según el criterio seleccionado
    const sortedPools = [...mockPools].sort((a, b) => {
      if (sortBy === 'apr') {
        return b.apr - a.apr;
      } else if (sortBy === 'tvl') {
        return b.tvl - a.tvl;
      } else if (sortBy === 'oneDayVolume') {
        return b.oneDayVolume - a.oneDayVolume;
      } else if (sortBy === 'thirtyDayVolume') {
        return b.thirtyDayVolume - a.thirtyDayVolume;
      } else if (sortBy === 'volumeTvlRatio') {
        return b.volumeTvlRatio - a.volumeTvlRatio;
      }
      return 0;
    });
    
    setDisplayPools(sortedPools);
    setIsLoading(false);
  }, [sortBy]);
  
  // Filtrar pools según criterios de búsqueda
  const filteredPools = displayPools.filter(pool => {
    const matchesSearch = pool.pairName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesProtocol = protocolFilter === 'all' || pool.protocol === protocolFilter;
    const matchesFeeTier = feeTierFilter === 'all' || pool.feeTier === feeTierFilter;
    
    return matchesSearch && matchesProtocol && matchesFeeTier;
  });
  
  // Manejar la actualización de datos
  const handleRefresh = () => {
    setIsLoading(true);
    
    // Simular carga de datos
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };
  
  // Lista de opciones de tarifa
  const feeOptions = [
    { value: 'all', label: 'Todas las tarifas' },
    { value: '0.01%', label: '0.01%' },
    { value: '0.05%', label: '0.05%' },
    { value: '0.30%', label: '0.30%' },
    { value: '1.00%', label: '1.00%' }
  ];
  
  // Función de utilidad para formatear números como moneda
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="container py-6 mx-auto">
      {/* SEO Meta Tags */}
      <MetaTags
        title={title}
        description={description}
        canonical={currentPath}
        ogImage="/images/uniswap-pools-og.jpg"
        structuredData={structuredData}
      />
      
      {/* Schema.org markup for search engines */}
      <SchemaMarkup 
        pageType="ProductPage"
        title={title}
        description={description}
        path={currentPath}
        imageUrl="/images/uniswap-pools-og.jpg"
      />
      
      <PageHeader
        title="Explorador de Pools de Uniswap"
        description="Consulta las pools más rentables de Uniswap a través de diferentes versiones del protocolo"
      />
      
      <div className="flex flex-col md:flex-row gap-4 my-6">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Buscar por par..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Select value={protocolFilter} onValueChange={setProtocolFilter}>
          <SelectTrigger className="w-full md:w-[150px]">
            <SelectValue placeholder="Protocolo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="v2">v2</SelectItem>
            <SelectItem value="v3">v3</SelectItem>
            <SelectItem value="v4">v4</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={feeTierFilter} onValueChange={setFeeTierFilter}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Nivel de comisión" />
          </SelectTrigger>
          <SelectContent>
            {feeOptions.map(option => (
              <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Ordenar por" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="apr">Mayor APR</SelectItem>
            <SelectItem value="tvl">Mayor TVL</SelectItem>
            <SelectItem value="oneDayVolume">Mayor Volumen 1D</SelectItem>
            <SelectItem value="thirtyDayVolume">Mayor Volumen 30D</SelectItem>
            <SelectItem value="volumeTvlRatio">Mayor Ratio Vol/TVL</SelectItem>
          </SelectContent>
        </Select>
        
        <Button variant="outline" onClick={handleRefresh} className="md:w-auto">
          <RefreshCw className="h-4 w-4 mr-2" />
          Actualizar
        </Button>
      </div>
      
      {isLoading ? (
        <div className="w-full animate-pulse">
          <Skeleton className="h-12 w-full mb-2" />
          <Skeleton className="h-12 w-full mb-2" />
          <Skeleton className="h-12 w-full mb-2" />
          <Skeleton className="h-12 w-full mb-2" />
          <Skeleton className="h-12 w-full mb-2" />
        </div>
      ) : (
        <>
          <div className="overflow-x-auto rounded-lg border">
            <table className="min-w-full divide-y divide-border">
              <thead className="bg-muted">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">#</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Fondo</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Protocolo</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Nivel de comisión</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">TVL</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Fondo de APR</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Reward APR</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Volumen de 1d</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Vol. de 30d</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Vol. de 1 día/TVL</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredPools.map((pool, index) => (
                  <tr key={pool.id} className={index % 2 === 0 ? 'bg-background' : 'bg-muted/30'}>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">{index + 1}</td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="ml-2">
                          <div className="text-sm font-medium">{pool.pairName}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">{pool.protocol}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">{pool.feeTier}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">{formatCurrency(pool.tvl)}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">{pool.apr.toFixed(3)}%</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                      {pool.rewardApr ? (
                        <span className="text-green-500">+{pool.rewardApr.toFixed(2)}%</span>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">{formatCurrency(pool.oneDayVolume)}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">{formatCurrency(pool.thirtyDayVolume)}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">{pool.volumeTvlRatio.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="mt-4 text-sm text-muted-foreground">
            Mostrando {filteredPools.length} de {displayPools.length} pools
          </div>
        </>
      )}
    </div>
  );
}