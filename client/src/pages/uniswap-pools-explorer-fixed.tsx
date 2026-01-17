import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, Filter, RefreshCw, HelpCircle, Menu, X, ArrowLeft, Sun, Moon, Globe, ChevronDown } from 'lucide-react';
import { formatCurrency } from '@/lib/formatters';
import { useTranslation, Language } from '@/hooks/use-translation';
import { Link } from 'wouter';
import { useTheme } from '@/hooks/use-theme';
import { useLanguage } from '@/context/language-context';
import FooterMenuFixer from '@/components/shared/footer-menu-fixer';
import LanguageSelectorContext from "@/components/language-selector-context";

// Constante para el nombre de la aplicación
const APP_NAME = "WayBank";

// Las URLs directas ya no se utilizan, usamos nuestro proxy en su lugar
// que gestiona la autenticación con la Graph API

// Función para convertir la tarifa a formato legible
const formatFeeTier = (feeTier: string) => {
  const fee = parseInt(feeTier) / 10000;
  return `${fee.toFixed(2)}%`;
};

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
  network?: string;
}

export default function UniswapPoolsExplorer() {
  const { t, language, setLanguage } = useTranslation();
  const { theme, setTheme } = useTheme();
  const { direction } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [protocolFilter, setProtocolFilter] = useState('all');
  const [feeTierFilter, setFeeTierFilter] = useState('all');
  const [sortBy, setSortBy] = useState('apr');
  const [version, setVersion] = useState<'all' | 'v3' | 'v4'>('all');
  const [network, setNetwork] = useState<'all' | 'ethereum' | 'polygon' | 'arbitrum' | 'unichain'>('all');
  const [showTopByApr, setShowTopByApr] = useState(true); // Para mostrar siempre el top por APR
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [displayPools, setDisplayPools] = useState<DisplayPool[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Nombres de los idiomas para mostrar en el selector
  const languageNames: Record<string, string> = {
    es: "Español",
    en: "English",
    fr: "Français",
    de: "Deutsch"
  };
  
  // Alterna el tema entre claro y oscuro
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };
  
  // Alterna el menú móvil
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  // Maneja el cambio de idioma
  const handleLanguageChange = (newLanguage: Language) => {
    localStorage.setItem('waybank_language', newLanguage);
    localStorage.setItem('language', newLanguage);
    setLanguage(newLanguage);
    document.documentElement.dir = 'ltr'; // Siempre ltr para estos idiomas
    document.documentElement.lang = newLanguage;
  };

  // Función para consultar una combinación específica de versión y red
  const fetchSingleVersionAndNetwork = async (ver: string, net: string) => {
    try {
      // Usamos el endpoint que soporta versión y red
      const GATEWAY_PROXY = `/api/uniswap-proxy/gateway/${ver}/${net}`;
      console.log(`Consultando datos de Uniswap ${ver} en ${net}...`);
      
      // Consulta GraphQL adaptada al esquema real de Uniswap
      // Obtenemos más pools (100) para después poder ordenarlos por APR
      const graphQuery = `{
        pools(first: 100, orderBy: volumeUSD, orderDirection: desc) {
          id
          feeTier
          liquidity
          token0 {
            id
            symbol
            name
          }
          token1 {
            id
            symbol
            name
          }
          volumeUSD
          totalValueLockedUSD
          feesUSD
          txCount
          poolDayData(first: 1, orderBy: date, orderDirection: desc) {
            feesUSD
            volumeUSD
            tvlUSD
            date
          }
        }
        bundles(first: 1) {
          ethPriceUSD
        }
      }`;
      
      // Realizamos la petición a nuestro proxy
      console.log('Consultando datos reales desde The Graph Gateway...');
      console.log(`URL: ${GATEWAY_PROXY}`);
      console.log(`Versión: ${ver}, Red: ${net}`);
      
      const response = await axios.post(GATEWAY_PROXY, { query: graphQuery });
      
      if (response.data && response.data.data && response.data.data.pools) {
        const rawPools = response.data.data.pools;
        
        // Transformamos los datos a nuestro formato DisplayPool
        return rawPools.map((pool: any) => {
          // Calculamos APR basado en volumen y fees (simplificado)
          // El feeTier viene en formato "500", "3000", "10000" que representa 0.05%, 0.3%, 1%
          const feeTier = parseInt(pool.feeTier) / 10000; // convertir de bps a porcentaje
          const tvl = parseFloat(pool.totalValueLockedUSD);
          const volume = parseFloat(pool.volumeUSD);
          const fees = parseFloat(pool.feesUSD || '0');
          
          // Cálculo exacto del APR directamente de los datos diarios de la API
          let realApr = 0;
          
          if (pool.poolDayData && pool.poolDayData.length > 0) {
            // Usamos los datos diarios exactos tal como vienen de la API
            const dayData = pool.poolDayData[0];
            
            // Calculamos el APR exacto usando los datos reales de la API
            const dailyFees = parseFloat(dayData.feesUSD);
            const poolTvl = parseFloat(dayData.tvlUSD);
            
            if (poolTvl > 0) {
              // APR anualizado basado en los datos reales diarios (365 días)
              // Sin ningún tipo de redondeo o límite artificial
              realApr = (dailyFees * 365 * 100) / poolTvl;
            }
          } else if (fees > 0 && tvl > 0) {
            // Si no hay datos diarios, usamos el total acumulado de fees
            // Calculamos el APR usando el ratio real de fees/TVL
            realApr = (fees / tvl) * (365 / 30) * 100;
          }
          
          return {
            id: pool.id,
            pairName: `${pool.token0.symbol}/${pool.token1.symbol}`,
            protocol: `Uniswap ${ver.toUpperCase()}`,
            feeTier: `${feeTier}%`,
            tvl: tvl,
            apr: realApr,
            rewardApr: 0, // No hay datos de recompensas en esta consulta
            oneDayVolume: pool.poolDayData?.length > 0 ? parseFloat(pool.poolDayData[0].volumeUSD) : volume / 30,
            thirtyDayVolume: volume, // Volumen total acumulado
            volumeTvlRatio: tvl > 0 ? volume / tvl : 0,
            network: net
          };
        });
      }
      return [];
    } catch (error) {
      console.error(`Error consultando ${ver} en ${net}:`, error);
      return [];
    }
  };

  // Función para cargar datos de pools de Uniswap usando la API real con soporte multiversión
  const fetchUniswapData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      let allPools: DisplayPool[] = [];
      
      if (version === 'all' && network === 'all') {
        // Si seleccionó todas las versiones y todas las redes, consultar todo
        // Definimos versiones y redes que funcionan correctamente
        
        // Priorizamos primero las combinaciones más estables para obtener resultados rápidos
        const versionNetworkPriority = [
          // Primero V3 en las redes principales que sabemos que funcionan mejor
          { version: 'v3', network: 'ethereum' },
          { version: 'v3', network: 'polygon' },
          
          // Luego V4 en todas las redes soportadas
          { version: 'v4', network: 'ethereum' },
          { version: 'v4', network: 'polygon' },
          { version: 'v4', network: 'unichain' },
          { version: 'v4', network: 'arbitrum' },
          
          // Finalmente intentamos V3 en otras redes (que podrían fallar)
          { version: 'v3', network: 'arbitrum' },
          { version: 'v3', network: 'unichain' }
        ];
        
        // Consultar según la lista de prioridad
        console.log("Consultando todas las versiones y redes con prioridad...");
        for (const { version: ver, network: net } of versionNetworkPriority) {
          try {
            console.log(`Intentando obtener datos de ${ver} en ${net}...`);
            const pools = await fetchSingleVersionAndNetwork(ver, net);
            if (pools.length > 0) {
              console.log(`Obtenidos ${pools.length} pools de ${ver} en ${net}`);
              allPools = [...allPools, ...pools];
            }
          } catch (error) {
            console.error(`Error al obtener datos de ${ver} en ${net}:`, error);
          }
        }
        
        console.log(`Total de pools combinados: ${allPools.length}`);
      } else if (version === 'all') {
        // Si seleccionó todas las versiones pero una red específica
        const versions = ['v3', 'v4'];
        for (const ver of versions) {
          try {
            const pools = await fetchSingleVersionAndNetwork(ver, network);
            allPools = [...allPools, ...pools];
          } catch (error) {
            console.error(`Error al obtener datos de ${ver} en ${network}:`, error);
          }
        }
      } else if (network === 'all') {
        // Si seleccionó todas las redes pero una versión específica
        const networks = ['ethereum', 'polygon', 'arbitrum', 'unichain'];
        for (const net of networks) {
          try {
            const pools = await fetchSingleVersionAndNetwork(version, net);
            allPools = [...allPools, ...pools];
          } catch (error) {
            console.error(`Error al obtener datos de ${version} en ${net}:`, error);
          }
        }
      } else {
        // Caso normal: una versión y una red específicas
        allPools = await fetchSingleVersionAndNetwork(version, network);
      }
      
      console.log(`Total de pools obtenidos: ${allPools.length}`);
      
      if (allPools.length > 0) {
        // Siempre ordenar por APR primero
        allPools.sort((a, b) => b.apr - a.apr);
        
        // Luego aplicar otros criterios de ordenación si es necesario
        if (sortBy === 'tvl') {
          allPools.sort((a, b) => b.tvl - a.tvl);
        } else if (sortBy === 'oneDayVolume') {
          allPools.sort((a, b) => b.oneDayVolume - a.oneDayVolume);
        } else if (sortBy === 'thirtyDayVolume') {
          allPools.sort((a, b) => b.thirtyDayVolume - a.thirtyDayVolume);
        } else if (sortBy === 'volumeTvlRatio') {
          allPools.sort((a, b) => b.volumeTvlRatio - a.volumeTvlRatio);
        }
        
        // Tomar los top 20
        allPools = allPools.slice(0, 20);
        
        // Actualizar el estado
        setDisplayPools(allPools);
        setIsLoading(false);
        return;
      }
      
      // Si llegamos aquí sin datos, hay un problema
      throw new Error("No se pudieron obtener datos de ninguna fuente");
    } catch (error) {
      console.error('Error al cargar datos de Uniswap:', error);
      setError('Error al cargar datos. Por favor, intenta con otra versión o red.');
      setIsLoading(false);
    }
  };
  
  // Cargar datos al montar el componente y cuando cambia el criterio de ordenamiento
  useEffect(() => {
    fetchUniswapData();
  }, [sortBy, version, network]);

  // Filtrar pools según criterios de búsqueda
  const filteredPools = displayPools.filter(pool => {
    const matchesSearch = pool.pairName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesProtocol = protocolFilter === 'all' || pool.protocol === protocolFilter;
    const matchesFeeTier = feeTierFilter === 'all' || pool.feeTier === feeTierFilter;
    const hasMinimumVolume = pool.thirtyDayVolume >= 500000; // Filtrar pools con menos de 500,000 de volumen a 30 días
    
    return matchesSearch && matchesProtocol && matchesFeeTier && hasMinimumVolume;
  });

  // Manejar la actualización de datos
  const handleRefresh = () => {
    fetchUniswapData();
    setIsLoading(true);
  };

  // Lista de opciones de tarifa
  const feeOptions = [
    { value: 'all', label: 'Todas las tarifas' },
    { value: '0.01%', label: '0.01%' },
    { value: '0.05%', label: '0.05%' },
    { value: '0.30%', label: '0.30%' },
    { value: '1.00%', label: '1.00%' }
  ];

  return (
    <div className="min-h-screen flex flex-col landing-page public-page" 
      style={{ backgroundColor: theme === 'dark' ? 'hsl(224 71% 4%)' : undefined }}>
      
      {/* Header exactamente como el de la página principal */}
      <header className="sticky top-0 z-50 w-full border-b backdrop-blur-sm bg-background/80" dir={direction}>
        <div className="container flex h-16 items-center justify-between mx-auto max-w-screen-xl">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold">
              <span className="text-foreground">Way</span>
              <span className="text-primary">Pool</span>
            </span>
          </div>
          
          {/* Navegación de escritorio */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/">
              <span className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                {language === 'es' ? 'Inicio' : 'Home'}
              </span>
            </Link>
            <Link href="/uniswap">
              <span className="text-foreground font-medium text-sm">
                {language === 'es' ? 'Explorador de Pools' : 'Pools Explorer'}
              </span>
            </Link>
            <Link href="/dashboard">
              <span className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                Dashboard
              </span>
            </Link>
          </nav>
          
          {/* Controles de la derecha */}
          <div className="flex items-center gap-2">
            {/* Selector de idioma */}
            <div className="relative">
              <LanguageSelectorContext />
            </div>
            
            {/* Botón de tema */}
            <Button variant="ghost" size="icon" onClick={toggleTheme} className="text-muted-foreground hover:text-foreground">
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            
            {/* Menú móvil */}
            <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleMobileMenu}>
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
        
        {/* Menú móvil desplegable */}
        {mobileMenuOpen && (
          <div className="absolute top-16 inset-x-0 bg-background border-b shadow-lg md:hidden z-50">
            <div className="container mx-auto py-4 space-y-3">
              <Link href="/">
                <span className="block px-4 py-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md">
                  {language === 'es' ? 'Inicio' : 'Home'}
                </span>
              </Link>
              <Link href="/uniswap">
                <span className="block px-4 py-2 text-foreground bg-muted rounded-md font-medium">
                  {language === 'es' ? 'Explorador de Pools' : 'Pools Explorer'}
                </span>
              </Link>
              <Link href="/dashboard">
                <span className="block px-4 py-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md">
                  Dashboard
                </span>
              </Link>
            </div>
          </div>
        )}
      </header>
      
      <main className="flex-1">
        <div className="container py-6 mx-auto">
          <PageHeader
            title="Explorador de Pools de Uniswap"
            description="Consulta las pools más rentables de Uniswap a través de diferentes versiones del protocolo"
          />
      
      <div className="flex flex-col gap-4 my-6">
        {/* Fila 1: Búsqueda y selectores de versión/red */}
        <div className="flex flex-col md:flex-row gap-4">
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
          
          {/* Selector de Versión */}
          <Select value={version} onValueChange={(v: any) => setVersion(v)}>
            <SelectTrigger className="w-full md:w-[140px]">
              <SelectValue placeholder="Versión" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las versiones</SelectItem>
              <SelectItem value="v3">Uniswap V3</SelectItem>
              <SelectItem value="v4">Uniswap V4</SelectItem>
            </SelectContent>
          </Select>
          
          {/* Selector de Red */}
          <Select value={network} onValueChange={(n: any) => setNetwork(n)}>
            <SelectTrigger className="w-full md:w-[140px]">
              <SelectValue placeholder="Red" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las redes</SelectItem>
              <SelectItem value="ethereum">Ethereum</SelectItem>
              <SelectItem value="polygon">Polygon</SelectItem>
              <SelectItem value="arbitrum">Arbitrum</SelectItem>
              <SelectItem value="unichain">Unichain</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Fila 2: Filtros adicionales */}
        <div className="flex flex-col md:flex-row gap-4">
          <Select value={protocolFilter} onValueChange={setProtocolFilter}>
            <SelectTrigger className="w-full md:w-[150px]">
              <SelectValue placeholder="Protocolo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="UNISWAP V3">V3</SelectItem>
              <SelectItem value="UNISWAP V4">V4</SelectItem>
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
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Red</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">TVL</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Fondo de APR</th>
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
                    <td className="px-4 py-4 whitespace-nowrap text-sm">{pool.network}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">{formatCurrency(pool.tvl)}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">{pool.apr.toFixed(3)}%</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">{formatCurrency(pool.oneDayVolume)}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">{formatCurrency(pool.thirtyDayVolume)}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">{pool.volumeTvlRatio.toFixed(3)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {error && (
            <div className="my-4 p-4 border rounded-md bg-destructive/10 text-destructive">
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}
          
          {!isLoading && filteredPools.length === 0 && !error && (
            <div className="my-4 p-4 border rounded-md bg-muted">
              <p className="text-sm text-muted-foreground text-center">No se encontraron pools que coincidan con los criterios de búsqueda.</p>
            </div>
          )}
        </>
      )}
        </div>
      </main>
      
      {/* Footer */}
      <footer className="border-t py-6 md:py-8">
        <div className="container mx-auto max-w-screen-xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-3">{APP_NAME}</h3>
              <p className="text-sm text-muted-foreground max-w-xs">
                {language === 'es' 
                  ? "Solución avanzada de gestión de liquidez para DeFi, maximizando rendimientos y minimizando riesgos"
                  : "Advanced liquidity management solution for DeFi, maximizing yields while minimizing risks"}
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-3">{language === 'es' ? 'Enlaces' : 'Links'}</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/">
                    <span className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      {language === 'es' ? 'Inicio' : 'Home'}
                    </span>
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard">
                    <span className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      Dashboard
                    </span>
                  </Link>
                </li>
                <li>
                  <Link href="/login">
                    <span className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      {language === 'es' ? 'Iniciar Sesión' : 'Login'}
                    </span>
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-3">{language === 'es' ? 'Legal' : 'Legal'}</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/terms">
                    <span className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      {language === 'es' ? 'Términos de Uso' : 'Terms of Use'}
                    </span>
                  </Link>
                </li>
                <li>
                  <Link href="/privacy">
                    <span className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      {language === 'es' ? 'Política de Privacidad' : 'Privacy Policy'}
                    </span>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t">
            <p className="text-sm text-muted-foreground text-center">
              &copy; {new Date().getFullYear()} {APP_NAME}. {language === 'es' ? 'Todos los derechos reservados.' : 'All rights reserved.'}
            </p>
          </div>
        </div>
      </footer>
      
      {/* Componente que corrige el margen del footer en pantallas móviles */}
      <FooterMenuFixer />
    </div>
  );
}