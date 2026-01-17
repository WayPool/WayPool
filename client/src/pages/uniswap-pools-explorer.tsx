import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, Filter, RefreshCw, HelpCircle, Menu, X, ArrowLeft, Sun, Moon, Globe, ChevronDown, ExternalLink, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { formatCurrency } from '@/lib/formatters';
import { useTranslation } from '@/hooks/use-translation';
import { Link } from 'wouter';
import { useTheme } from '@/hooks/use-theme';
import { useLanguage, Language } from '@/context/language-context';
import FooterMenuFixer from '@/components/shared/footer-menu-fixer';
import LanguageSelectorContext from "@/components/language-selector-context";
import MetaTags from '@/components/seo/meta-tags';
import SchemaMarkup from '@/components/seo/schema-markup';

// Constante para el nombre de la aplicación
const APP_NAME = "WayBank";

// Traducciones para la interfaz
const translations = {
  es: {
    sortBy: "Ordenar por",
    highestApr: "Mayor APR",
    highestTvl: "Mayor TVL",
    highest1dVolume: "Mayor Volumen 1D",
    highest30dVolume: "Mayor Volumen 30D",
    highestVolTvlRatio: "Mayor Ratio Vol/TVL",
    refresh: "Actualizar",
    pair: "Fondo",
    protocol: "Protocolo",
    feeTier: "Nivel de comisión",
    network: "Red",
    d1Volume: "Volumen de 1d",
    d30Volume: "Vol. de 30d",
    d1VolTvl: "Vol. de 1 día/TVL",
    action: "Acción",
    viewOnUniswap: "Ver en Uniswap",
    noPoolsFound: "No se encontraron pools que coincidan con los criterios de búsqueda.",
    uniswapPoolsExplorer: "Explorador de Pools de Uniswap",
    poolsExplorerDescription: "Consulta las pools más rentables de Uniswap a través de diferentes versiones del protocolo", 
    showing: "Mostrando",
    of: "de",
    pools: "pools",
    home: "Inicio",
    searchByPair: "Buscar por par..."
  },
  en: {
    sortBy: "Sort by",
    highestApr: "Highest APR",
    highestTvl: "Highest TVL",
    highest1dVolume: "Highest 1D Volume",
    highest30dVolume: "Highest 30D Volume",
    highestVolTvlRatio: "Highest Vol/TVL Ratio",
    refresh: "Refresh",
    pair: "Pair",
    protocol: "Protocol",
    feeTier: "Fee Tier",
    network: "Network",
    d1Volume: "1d Volume",
    d30Volume: "30d Volume",
    d1VolTvl: "1d Vol/TVL",
    action: "Action",
    viewOnUniswap: "View on Uniswap",
    noPoolsFound: "No pools found matching the search criteria.",
    uniswapPoolsExplorer: "Uniswap Pools Explorer",
    poolsExplorerDescription: "Check the most profitable Uniswap pools across different protocol versions",
    showing: "Showing",
    of: "of",
    pools: "pools",
    home: "Home",
    searchByPair: "Search by pair..."
  },
  pt: {
    sortBy: "Ordenar por",
    highestApr: "Maior APR",
    highestTvl: "Maior TVL",
    highest1dVolume: "Maior Volume 1D",
    highest30dVolume: "Maior Volume 30D",
    highestVolTvlRatio: "Maior Proporção Vol/TVL",
    refresh: "Atualizar",
    pair: "Fundo",
    protocol: "Protocolo",
    feeTier: "Nível de taxa",
    network: "Rede",
    d1Volume: "Volume de 1d",
    d30Volume: "Vol. de 30d",
    d1VolTvl: "Vol. de 1 dia/TVL",
    action: "Ação",
    viewOnUniswap: "Ver no Uniswap",
    noPoolsFound: "Não foram encontradas pools que correspondam aos critérios de busca.",
    uniswapPoolsExplorer: "Explorador de Pools do Uniswap",
    poolsExplorerDescription: "Consulte as pools mais rentáveis do Uniswap em diferentes versões do protocolo",
    showing: "Mostrando",
    of: "de",
    pools: "pools",
    home: "Início",
    searchByPair: "Buscar por par..."
  },
  fr: {
    sortBy: "Trier par",
    highestApr: "APR plus élevé",
    highestTvl: "TVL plus élevé",
    highest1dVolume: "Volume 1J plus élevé",
    highest30dVolume: "Volume 30J plus élevé",
    highestVolTvlRatio: "Ratio Vol/TVL plus élevé",
    refresh: "Actualiser",
    pair: "Paire",
    protocol: "Protocole",
    feeTier: "Niveau de frais",
    network: "Réseau",
    d1Volume: "Volume sur 1j",
    d30Volume: "Vol. sur 30j",
    d1VolTvl: "Vol. 1j/TVL",
    action: "Action",
    viewOnUniswap: "Voir sur Uniswap",
    noPoolsFound: "Aucun pool correspondant aux critères de recherche n'a été trouvé.",
    uniswapPoolsExplorer: "Explorateur de Pools Uniswap",
    poolsExplorerDescription: "Consultez les pools les plus rentables d'Uniswap à travers différentes versions du protocole",
    showing: "Affichage de",
    of: "sur",
    pools: "pools",
    home: "Accueil",
    searchByPair: "Rechercher par paire..."
  },
  de: {
    sortBy: "Sortieren nach",
    highestApr: "Höchste APR",
    highestTvl: "Höchste TVL",
    highest1dVolume: "Höchstes 1T-Volumen",
    highest30dVolume: "Höchstes 30T-Volumen",
    highestVolTvlRatio: "Höchstes Vol/TVL-Verhältnis",
    refresh: "Aktualisieren",
    pair: "Pool",
    protocol: "Protokoll",
    feeTier: "Gebührenstufe",
    network: "Netzwerk",
    d1Volume: "1T-Volumen",
    d30Volume: "30T-Vol.",
    d1VolTvl: "1T-Vol./TVL",
    action: "Aktion",
    viewOnUniswap: "Auf Uniswap ansehen",
    noPoolsFound: "Es wurden keine Pools gefunden, die den Suchkriterien entsprechen.",
    uniswapPoolsExplorer: "Uniswap Pools Explorer",
    poolsExplorerDescription: "Sehen Sie sich die profitabelsten Uniswap-Pools über verschiedene Protokollversionen hinweg an",
    showing: "Anzeige von",
    of: "von",
    pools: "Pools",
    home: "Startseite",
    searchByPair: "Nach Paar suchen..."
  },
  it: {
    sortBy: "Ordina per",
    highestApr: "APR più alto",
    highestTvl: "TVL più alto",
    highest1dVolume: "Maggior Volume 1G",
    highest30dVolume: "Maggior Volume 30G",
    highestVolTvlRatio: "Maggior Rapporto Vol/TVL",
    refresh: "Aggiorna",
    pair: "Pool",
    protocol: "Protocollo",
    feeTier: "Livello commissione",
    network: "Rete",
    d1Volume: "Volume 1g",
    d30Volume: "Vol. 30g",
    d1VolTvl: "Vol. 1g/TVL",
    action: "Azione",
    viewOnUniswap: "Visualizza su Uniswap",
    noPoolsFound: "Non sono state trovate pool che corrispondono ai criteri di ricerca.",
    uniswapPoolsExplorer: "Esploratore di Pool Uniswap",
    poolsExplorerDescription: "Controlla le pool più redditizie di Uniswap attraverso diverse versioni del protocollo",
    showing: "Mostrando",
    of: "di",
    pools: "pool",
    home: "Home",
    searchByPair: "Cerca per coppia..."
  },
  ar: {
    sortBy: "ترتيب حسب",
    highestApr: "أعلى نسبة عائد سنوي",
    highestTvl: "أعلى قيمة مقفلة",
    highest1dVolume: "أعلى حجم لمدة يوم",
    highest30dVolume: "أعلى حجم لمدة 30 يوم",
    highestVolTvlRatio: "أعلى نسبة حجم/قيمة مقفلة",
    refresh: "تحديث",
    pair: "الزوج",
    protocol: "البروتوكول",
    feeTier: "مستوى الرسوم",
    network: "الشبكة",
    d1Volume: "حجم يوم واحد",
    d30Volume: "حجم 30 يوم",
    d1VolTvl: "حجم يوم/TVL",
    action: "إجراء",
    viewOnUniswap: "عرض في يونيسواب",
    noPoolsFound: "لم يتم العثور على تجمعات تطابق معايير البحث.",
    uniswapPoolsExplorer: "مستكشف تجمعات يونيسواب",
    poolsExplorerDescription: "تحقق من أكثر تجمعات يونيسواب ربحية عبر إصدارات مختلفة من البروتوكول",
    showing: "عرض",
    of: "من",
    pools: "تجمعات",
    home: "الرئيسية",
    searchByPair: "البحث حسب الزوج..."
  },
  hi: {
    sortBy: "इसके अनुसार क्रमबद्ध करें",
    highestApr: "उच्चतम APR",
    highestTvl: "उच्चतम TVL",
    highest1dVolume: "उच्चतम 1 दिन का वॉल्यूम",
    highest30dVolume: "उच्चतम 30 दिन का वॉल्यूम",
    highestVolTvlRatio: "उच्चतम वॉल्यूम/TVL अनुपात",
    refresh: "अपडेट करें",
    pair: "पेयर",
    protocol: "प्रोटोकॉल",
    feeTier: "शुल्क स्तर",
    network: "नेटवर्क",
    d1Volume: "1 दिन का वॉल्यूम",
    d30Volume: "30 दिन का वॉल्यूम",
    d1VolTvl: "1 दिन वॉल्यूम/TVL",
    action: "कार्रवाई",
    viewOnUniswap: "यूनीस्वैप पर देखें",
    noPoolsFound: "खोज मापदंडों से मेल खाने वाले कोई पूल नहीं मिले।",
    uniswapPoolsExplorer: "यूनीस्वैप पूल एक्सप्लोरर",
    poolsExplorerDescription: "विभिन्न प्रोटोकॉल संस्करणों में सबसे लाभदायक यूनीस्वैप पूल देखें",
    showing: "दिखा रहा है",
    of: "में से",
    pools: "पूल",
    home: "होम",
    searchByPair: "जोड़ी द्वारा खोजें..."
  },
  zh: {
    sortBy: "排序方式",
    highestApr: "最高 APR",
    highestTvl: "最高锁仓量",
    highest1dVolume: "最高 1 日交易量",
    highest30dVolume: "最高 30 日交易量",
    highestVolTvlRatio: "最高交易量/锁仓比",
    refresh: "刷新",
    pair: "交易对",
    protocol: "协议",
    feeTier: "费率等级",
    network: "网络",
    d1Volume: "1日交易量",
    d30Volume: "30日交易量",
    d1VolTvl: "1日量/TVL",
    action: "操作",
    viewOnUniswap: "在Uniswap上查看",
    noPoolsFound: "未找到符合搜索条件的交易池。",
    uniswapPoolsExplorer: "Uniswap 资金池浏览器",
    poolsExplorerDescription: "查看不同协议版本中最有盈利的 Uniswap 资金池",
    showing: "显示",
    of: "共",
    pools: "个池",
    home: "首页",
    searchByPair: "按交易对搜索..."
  }
};

// Las URLs directas ya no se utilizan, usamos nuestro proxy en su lugar
// que gestiona la autenticación con la Graph API

// Función helper para obtener el texto traducido según el idioma actual
const getTranslatedText = (language: Language, key: keyof typeof translations['en']) => {
  // Si el idioma existe en las traducciones y la clave existe en ese idioma
  if (translations[language] && translations[language][key]) {
    return translations[language][key];
  }
  // Fallback a inglés
  return translations.en[key];
};

// Función para convertir la tarifa a formato legible
const formatFeeTier = (feeTier: string) => {
  const fee = parseInt(feeTier) / 10000;
  return `${fee.toFixed(2)}%`;
};

// Función para generar la URL de Uniswap para un pool específico
const getUniswapPoolUrl = (poolId: string, protocol: string, network: string) => {
  // Formato correcto según la documentación de Uniswap: app.uniswap.org/explore/pools/{network}/{poolAddress}
  
  // Determinar qué red usar en la URL
  let networkPath = 'ethereum'; // Por defecto, usamos ethereum
  if (network === 'polygon') {
    networkPath = 'polygon';
  } else if (network === 'arbitrum') {
    networkPath = 'arbitrum';
  } else if (network === 'unichain') {
    networkPath = 'base'; // Unichain se representa como 'base' en las URLs de Uniswap
  }
  
  // El formato es el mismo para V3 y V4, solo cambia la red
  return `https://app.uniswap.org/explore/pools/${networkPath}/${poolId}`;
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
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [version, setVersion] = useState<'all' | 'v3' | 'v4'>('all');
  const [network, setNetwork] = useState<'all' | 'ethereum' | 'polygon' | 'arbitrum' | 'unichain'>('all');
  const [showTopByApr, setShowTopByApr] = useState(true); // Para mostrar siempre el top por APR
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [displayPools, setDisplayPools] = useState<DisplayPool[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Nombres de los idiomas para mostrar en el selector
  const languageNames: Record<Language, string> = {
    es: "Español",
    en: "English",
    fr: "Français",
    de: "Deutsch",
    pt: "Português",
    it: "Italiano",
    ar: "العربية",
    hi: "हिन्दी",
    zh: "中文"
  };
  
  // Alterna el tema entre claro y oscuro
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };
  
  // Deshabilitar completamente el menú móvil
  const toggleMobileMenu = () => {
    // No hacer nada, menú móvil deshabilitado
  };
  
  // Maneja el cambio de idioma
  const handleLanguageChange = (newLanguage: Language) => {
    localStorage.setItem('waybank_language', newLanguage);
    localStorage.setItem('language', newLanguage);
    // Usamos casting para asegurar compatibilidad de tipo
    setLanguage(newLanguage as any); // Necesario debido a inconsistencias en los tipos
    
    // Configuramos la dirección RTL para árabe
    const dir = newLanguage === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.dir = dir;
    document.documentElement.lang = newLanguage;
  };

  // Función para manejar el ordenamiento
  const handleSort = (column: string) => {
    if (sortBy === column) {
      // Si ya estamos ordenando por esta columna, cambiar dirección
      setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
    } else {
      // Nueva columna, empezar con descendente
      setSortBy(column);
      setSortOrder('desc');
    }
  };

  // Componente para mostrar las flechas de ordenamiento clásicas
  const SortArrow = ({ column }: { column: string }) => {
    if (sortBy !== column) {
      return (
        <div className="ml-2 inline-flex flex-col">
          <div className="w-0 h-0 border-l-[3px] border-r-[3px] border-b-[4px] border-l-transparent border-r-transparent border-b-gray-400 opacity-50"></div>
          <div className="w-0 h-0 border-l-[3px] border-r-[3px] border-t-[4px] border-l-transparent border-r-transparent border-t-gray-400 opacity-50 -mt-[1px]"></div>
        </div>
      );
    }
    
    if (sortOrder === 'desc') {
      return (
        <div className="ml-2 inline-flex flex-col">
          <div className="w-0 h-0 border-l-[3px] border-r-[3px] border-b-[4px] border-l-transparent border-r-transparent border-b-blue-600"></div>
          <div className="w-0 h-0 border-l-[3px] border-r-[3px] border-t-[4px] border-l-transparent border-r-transparent border-t-gray-400 opacity-30 -mt-[1px]"></div>
        </div>
      );
    } else {
      return (
        <div className="ml-2 inline-flex flex-col">
          <div className="w-0 h-0 border-l-[3px] border-r-[3px] border-b-[4px] border-l-transparent border-r-transparent border-b-gray-400 opacity-30"></div>
          <div className="w-0 h-0 border-l-[3px] border-r-[3px] border-t-[4px] border-l-transparent border-r-transparent border-t-blue-600 -mt-[1px]"></div>
        </div>
      );
    }
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

  // Función para depurar el estilo de los pares
  useEffect(() => {
    // Añadir un script de inspección al cargar la página
    const script = document.createElement('script');
    script.textContent = `
      setTimeout(() => {
        // Buscar todos los elementos que muestran pares en la tabla
        const pairElements = document.querySelectorAll('td div.text-sm.font-medium');
        console.log('Elementos de pares encontrados:', pairElements.length);
        
        // Imprimir estilos computados del primer elemento encontrado
        if (pairElements.length > 0) {
          const computedStyle = window.getComputedStyle(pairElements[0]);
          console.log('Estilos computados del par:', {
            backgroundColor: computedStyle.backgroundColor,
            color: computedStyle.color,
            fontWeight: computedStyle.fontWeight,
            padding: computedStyle.padding,
            borderRadius: computedStyle.borderRadius
          });
          
          // Buscar elementos padre que puedan tener fondo negro
          let parent = pairElements[0].parentElement;
          while (parent && parent.tagName !== 'TR') {
            const parentStyle = window.getComputedStyle(parent);
            console.log('Estilos del padre ' + parent.tagName, {
              backgroundColor: parentStyle.backgroundColor,
              padding: parentStyle.padding,
              borderRadius: parentStyle.borderRadius
            });
            parent = parent.parentElement;
          }
        }
      }, 2000);
    `;
    document.head.appendChild(script);
    
    return () => {
      document.head.removeChild(script);
    };
  }, []);

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
        // Aplicar ordenamiento numérico correcto basado en la columna y dirección seleccionadas
        allPools.sort((a, b) => {
          let valueA, valueB, comparison = 0;
          
          if (sortBy === 'apr') {
            valueA = typeof a.apr === 'number' ? a.apr : parseFloat(a.apr) || 0;
            valueB = typeof b.apr === 'number' ? b.apr : parseFloat(b.apr) || 0;
          } else if (sortBy === 'tvl') {
            valueA = typeof a.tvl === 'number' ? a.tvl : parseFloat(a.tvl) || 0;
            valueB = typeof b.tvl === 'number' ? b.tvl : parseFloat(b.tvl) || 0;
          } else if (sortBy === 'oneDayVolume') {
            valueA = typeof a.oneDayVolume === 'number' ? a.oneDayVolume : parseFloat(a.oneDayVolume) || 0;
            valueB = typeof b.oneDayVolume === 'number' ? b.oneDayVolume : parseFloat(b.oneDayVolume) || 0;
          } else if (sortBy === 'thirtyDayVolume') {
            valueA = typeof a.thirtyDayVolume === 'number' ? a.thirtyDayVolume : parseFloat(a.thirtyDayVolume) || 0;
            valueB = typeof b.thirtyDayVolume === 'number' ? b.thirtyDayVolume : parseFloat(b.thirtyDayVolume) || 0;
          } else if (sortBy === 'volumeTvlRatio') {
            valueA = typeof a.volumeTvlRatio === 'number' ? a.volumeTvlRatio : parseFloat(a.volumeTvlRatio) || 0;
            valueB = typeof b.volumeTvlRatio === 'number' ? b.volumeTvlRatio : parseFloat(b.volumeTvlRatio) || 0;
          } else {
            // Por defecto, ordenar por APR
            valueA = typeof a.apr === 'number' ? a.apr : parseFloat(a.apr) || 0;
            valueB = typeof b.apr === 'number' ? b.apr : parseFloat(b.apr) || 0;
          }
          
          // Ordenamiento numérico correcto
          if (sortOrder === 'asc') {
            comparison = valueA - valueB;
          } else {
            comparison = valueB - valueA;
          }
          
          return comparison;
        });
        
        // Asegurarnos de que se muestren pools tanto de V3 como de V4 en el resultado
        // Separar los pools por versión (DESPUÉS del ordenamiento personalizado)
        const v3Pools = allPools.filter(pool => pool.protocol.includes('V3'));
        const v4Pools = allPools.filter(pool => pool.protocol.includes('V4'));
        
        console.log(`Pools V3 disponibles: ${v3Pools.length}`);
        console.log(`Pools V4 disponibles: ${v4Pools.length}`);
        
        // NO reordenar aquí - mantener el orden del usuario
        
        // Calcular cuántos pools tomar de cada versión para llegar a 20 en total
        // pero asegurarnos de representación equilibrada
        let poolsToTake: DisplayPool[] = [];
        
        if (version === 'all') {
          // Si ambas versiones tienen suficientes pools
          if (v3Pools.length >= 10 && v4Pools.length >= 10) {
            // Tomar 10 de cada versión para un total de 20
            poolsToTake = [...v3Pools.slice(0, 10), ...v4Pools.slice(0, 10)];
          } else if (v3Pools.length === 0) {
            // Si no hay pools V3, tomar 20 de V4 (o todos los disponibles)
            poolsToTake = v4Pools.slice(0, 20);
          } else if (v4Pools.length === 0) {
            // Si no hay pools V4, tomar 20 de V3 (o todos los disponibles)
            poolsToTake = v3Pools.slice(0, 20);
          } else {
            // Si hay alguno de cada versión pero no llegan a 10, distribuir proporcionalmente
            const totalAvailable = v3Pools.length + v4Pools.length;
            if (totalAvailable <= 20) {
              // Si en total hay 20 o menos, tomar todos
              poolsToTake = [...v3Pools, ...v4Pools];
            } else {
              // Calcular proporción para cada versión, priorizando el balance
              const v3Proportion = Math.min(Math.ceil(20 * (v3Pools.length / totalAvailable)), v3Pools.length);
              const v4Proportion = Math.min(20 - v3Proportion, v4Pools.length);
              
              poolsToTake = [...v3Pools.slice(0, v3Proportion), ...v4Pools.slice(0, v4Proportion)];
            }
          }
        } else {
          // Si se seleccionó una versión específica, simplemente tomar los top 20
          poolsToTake = allPools.slice(0, 20);
        }
        
        // Asegurarnos de que no exceda 20 (por si acaso)
        poolsToTake = poolsToTake.slice(0, 20);
        console.log(`Total de pools seleccionados: ${poolsToTake.length}`);
        
        // Actualizar allPools con la selección final
        allPools = poolsToTake;
        
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
  }, [sortBy, sortOrder, version, network]);

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

  // Lista de opciones de tarifa, traducida según el idioma
  const feeOptions = [
    { 
      value: 'all', 
      label: language === 'es' ? 'Todas las tarifas' :
             language === 'en' ? 'All fees' :
             language === 'pt' ? 'Todas as taxas' :
             language === 'fr' ? 'Tous les frais' :
             language === 'de' ? 'Alle Gebühren' :
             language === 'it' ? 'Tutte le commissioni' :
             language === 'ar' ? 'جميع الرسوم' :
             language === 'hi' ? 'सभी शुल्क' :
             language === 'zh' ? '所有费率' :
             'All fees'
    },
    { value: '0.01%', label: '0.01%' },
    { value: '0.05%', label: '0.05%' },
    { value: '0.30%', label: '0.30%' },
    { value: '1.00%', label: '1.00%' }
  ];

  // Estilos específicos para la versión móvil
  const mobileStyles = `
    @media (max-width: 768px) {
      .uniswap-mobile-container {
        margin-top: 70px;
      }
    }
  `;

  return (
    <div className="min-h-screen flex flex-col landing-page public-page uniswap-mobile-container" 
      style={{ backgroundColor: theme === 'dark' ? 'hsl(224 71% 4%)' : undefined }}>
      
      {/* Estilos inline para el ajuste móvil */}
      <style dangerouslySetInnerHTML={{ __html: mobileStyles }} />
      
      {/* Header exactamente como el de la página principal */}
      <header className="sticky top-0 z-50 w-full border-b backdrop-blur-sm bg-background/80" dir={direction}>
        <div className="container flex h-16 items-center justify-between mx-auto max-w-screen-xl">
          <div className="flex items-center gap-2">
            <div onClick={() => window.location.href = '/'} className="cursor-pointer">
              <span className="text-2xl font-bold">
                <span className="text-foreground">Way</span>
                <span className="text-primary">Pool</span>
              </span>
            </div>
          </div>
          
          {/* Botón de Dashboard en versión móvil */}
          <div className="md:hidden">
            <Button 
              size="sm" 
              className="bg-green-600 border-0 text-white hover:bg-green-700"
              onClick={() => window.location.href = '/dashboard'}
            >
              Dashboard
            </Button>
          </div>
          
          {/* Navegación principal, solo visible en desktop */}
          <nav className="flex items-center gap-6">
            <Link href="/" className="hidden md:block">
              <span className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                {getTranslatedText(language, 'home')}
              </span>
            </Link>
            <Link href="/uniswap" className="hidden md:block">
              <span className="text-foreground font-medium text-sm">
                {getTranslatedText(language, 'uniswapPoolsExplorer')}
              </span>
            </Link>
            <Link href="/dashboard" className="hidden md:block">
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
          </div>
        </div>
        
        {/* Menú móvil eliminado completamente */}
      </header>
      
      <main className="flex-1">
        <div className="container py-6 mx-auto">
          <PageHeader
            title={getTranslatedText(language, 'uniswapPoolsExplorer')}
            description={getTranslatedText(language, 'poolsExplorerDescription')}
          />
      
      <div className="flex flex-col gap-4 my-6">
        {/* Título para móvil - Solo visible en pantallas pequeñas */}
        <div className="md:hidden mb-4 text-center">
          <h2 className="text-xl font-bold">
            {language === 'es' ? "TOP Pools Uniswap" :
             language === 'en' ? "TOP Uniswap Pools" :
             language === 'pt' ? "TOP Pools Uniswap" :
             language === 'fr' ? "TOP Pools Uniswap" :
             language === 'de' ? "TOP Uniswap Pools" :
             language === 'it' ? "TOP Pool Uniswap" :
             language === 'ar' ? "أفضل تجمعات Uniswap" :
             language === 'hi' ? "टॉप Uniswap पूल्स" :
             language === 'zh' ? "顶级 Uniswap 池" :
             "TOP Uniswap Pools"}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {language === 'es' ? "Las mejores oportunidades de APR" :
             language === 'en' ? "Best APR opportunities" :
             language === 'pt' ? "Melhores oportunidades de APR" :
             language === 'fr' ? "Meilleures opportunités de APR" :
             language === 'de' ? "Beste APR-Möglichkeiten" :
             language === 'it' ? "Migliori opportunità di APR" :
             language === 'ar' ? "أفضل فرص العائد السنوي" :
             language === 'hi' ? "सर्वश्रेष्ठ APR अवसर" :
             language === 'zh' ? "最佳 APR 机会" :
             "Best APR opportunities"}
          </p>
        </div>

        {/* Fila 1: Búsqueda y selectores de versión/red - Solo visible en desktop */}
        <div className="hidden md:flex md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder={getTranslatedText(language, 'searchByPair')}
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {/* Selector de Versión */}
          <Select value={version} onValueChange={(v: any) => setVersion(v)}>
            <SelectTrigger className="w-full md:w-[140px]">
              <SelectValue 
                placeholder={
                  language === 'es' ? "Versión" :
                  language === 'pt' ? "Versão" :
                  language === 'fr' ? "Version" :
                  language === 'de' ? "Version" :
                  language === 'it' ? "Versione" :
                  language === 'ar' ? "الإصدار" :
                  language === 'hi' ? "संस्करण" :
                  language === 'zh' ? "版本" :
                  "Version"
                } 
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                {language === 'es' ? "Todas las versiones" :
                language === 'pt' ? "Todas as versões" :
                language === 'fr' ? "Toutes les versions" :
                language === 'de' ? "Alle Versionen" :
                language === 'it' ? "Tutte le versioni" :
                language === 'ar' ? "جميع الإصدارات" :
                language === 'hi' ? "सभी संस्करण" :
                language === 'zh' ? "所有版本" :
                "All versions"}
              </SelectItem>
              <SelectItem value="v3">
                {language === 'ar' ? "يونيسواب V3" : "Uniswap V3"}
              </SelectItem>
              <SelectItem value="v4">
                {language === 'ar' ? "يونيسواب V4" : "Uniswap V4"}
              </SelectItem>
            </SelectContent>
          </Select>
          
          {/* Selector de Red */}
          <Select value={network} onValueChange={(n: any) => setNetwork(n)}>
            <SelectTrigger className="w-full md:w-[140px]">
              <SelectValue 
                placeholder={
                  language === 'es' ? "Red" :
                  language === 'pt' ? "Rede" :
                  language === 'fr' ? "Réseau" :
                  language === 'de' ? "Netzwerk" :
                  language === 'it' ? "Rete" :
                  language === 'ar' ? "الشبكة" :
                  language === 'hi' ? "नेटवर्क" :
                  language === 'zh' ? "网络" :
                  "Network"
                } 
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                {language === 'es' ? "Todas las redes" :
                language === 'pt' ? "Todas as redes" :
                language === 'fr' ? "Tous les réseaux" :
                language === 'de' ? "Alle Netzwerke" :
                language === 'it' ? "Tutte le reti" :
                language === 'ar' ? "جميع الشبكات" :
                language === 'hi' ? "सभी नेटवर्क" :
                language === 'zh' ? "所有网络" :
                "All networks"}
              </SelectItem>
              <SelectItem value="ethereum">Ethereum</SelectItem>
              <SelectItem value="polygon">Polygon</SelectItem>
              <SelectItem value="arbitrum">Arbitrum</SelectItem>
              <SelectItem value="unichain">Unichain</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Fila 2: Filtros adicionales - Solo visible en desktop */}
        <div className="hidden md:flex md:flex-row gap-4">
          <Select value={protocolFilter} onValueChange={setProtocolFilter}>
            <SelectTrigger className="w-full md:w-[150px]">
              <SelectValue 
                placeholder={
                  language === 'es' ? "Protocolo" :
                  language === 'en' ? "Protocol" :
                  language === 'pt' ? "Protocolo" :
                  language === 'fr' ? "Protocole" :
                  language === 'de' ? "Protokoll" :
                  language === 'it' ? "Protocollo" :
                  language === 'ar' ? "البروتوكول" :
                  language === 'hi' ? "प्रोटोकॉल" :
                  language === 'zh' ? "协议" :
                  "Protocol"
                } 
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                {language === 'es' ? "Todos" :
                language === 'en' ? "All" :
                language === 'pt' ? "Todos" :
                language === 'fr' ? "Tous" :
                language === 'de' ? "Alle" :
                language === 'it' ? "Tutti" :
                language === 'ar' ? "الكل" :
                language === 'hi' ? "सभी" :
                language === 'zh' ? "全部" :
                "All"}
              </SelectItem>
              <SelectItem value="UNISWAP V3">V3</SelectItem>
              <SelectItem value="UNISWAP V4">V4</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={feeTierFilter} onValueChange={setFeeTierFilter}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue 
                placeholder={getTranslatedText(language, 'feeTier')} 
              />
            </SelectTrigger>
            <SelectContent>
              {feeOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          

          
          <Button variant="outline" onClick={handleRefresh} className="md:w-auto">
            <RefreshCw className="h-4 w-4 mr-2" />
            {getTranslatedText(language, 'refresh')}
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
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    {getTranslatedText(language, 'pair')}
                  </th>
                  <th scope="col" className="hidden md:table-cell px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    {getTranslatedText(language, 'protocol')}
                  </th>
                  <th scope="col" className="hidden md:table-cell px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    {getTranslatedText(language, 'feeTier')}
                  </th>
                  <th scope="col" className="hidden md:table-cell px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    {getTranslatedText(language, 'network')}
                  </th>
                  <th 
                    scope="col" 
                    className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => handleSort('tvl')}
                  >
                    <div className="flex items-center">
                      TVL
                      <SortArrow column="tvl" />
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => handleSort('apr')}
                  >
                    <div className="flex items-center">
                      APR
                      <SortArrow column="apr" />
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="hidden md:table-cell px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => handleSort('oneDayVolume')}
                  >
                    <div className="flex items-center">
                      {getTranslatedText(language, 'd1Volume')}
                      <SortArrow column="oneDayVolume" />
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="hidden md:table-cell px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => handleSort('thirtyDayVolume')}
                  >
                    <div className="flex items-center">
                      {getTranslatedText(language, 'd30Volume')}
                      <SortArrow column="thirtyDayVolume" />
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="hidden md:table-cell px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => handleSort('volumeTvlRatio')}
                  >
                    <div className="flex items-center">
                      {getTranslatedText(language, 'd1VolTvl')}
                      <SortArrow column="volumeTvlRatio" />
                    </div>
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    {getTranslatedText(language, 'action')}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredPools.map((pool, index) => (
                  <tr key={pool.id} className={index % 2 === 0 ? 'bg-background' : 'bg-muted/30'}>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">{index + 1}</td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium">{pool.pairName}</div>
                    </td>
                    <td className="hidden md:table-cell px-4 py-4 whitespace-nowrap text-sm">{pool.protocol}</td>
                    <td className="hidden md:table-cell px-4 py-4 whitespace-nowrap text-sm">{pool.feeTier}</td>
                    <td className="hidden md:table-cell px-4 py-4 whitespace-nowrap text-sm">{pool.network}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">{formatCurrency(pool.tvl)}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">{pool.apr.toFixed(2)}%</td>
                    <td className="hidden md:table-cell px-4 py-4 whitespace-nowrap text-sm">{formatCurrency(pool.oneDayVolume)}</td>
                    <td className="hidden md:table-cell px-4 py-4 whitespace-nowrap text-sm">{formatCurrency(pool.thirtyDayVolume)}</td>
                    <td className="hidden md:table-cell px-4 py-4 whitespace-nowrap text-sm">{pool.volumeTvlRatio.toFixed(3)}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                      <a 
                        href={getUniswapPoolUrl(pool.id, pool.protocol, pool.network || '')} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center p-1 rounded-md hover:bg-muted transition-colors"
                        title={getTranslatedText(language, 'viewOnUniswap')}
                      >
                        <ExternalLink className="h-4 w-4 text-primary" />
                      </a>
                    </td>
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
              <p className="text-sm text-muted-foreground text-center">
                {getTranslatedText(language, 'noPoolsFound')}
              </p>
            </div>
          )}
        </>
      )}
        </div>
      </main>
      
      {/* Footer - Versión estándar para desktop, oculta en móvil */}
      <footer className="border-t py-6 md:py-8 hidden md:block">
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
      
      {/* Nuevo Footer - Versión móvil que coincide con la homepage, visible solo en móvil */}
      <footer className="bg-slate-950 border-t border-slate-800 py-8 px-4 md:hidden">
        <div className="max-w-md mx-auto">
          <div className="flex justify-center mb-6">
            <span className="text-2xl font-bold bg-transparent" style={{ textShadow: 'none', border: 'none', outline: 'none', background: 'transparent' }}>
              <span className="text-white bg-transparent" style={{ textShadow: 'none', border: 'none', outline: 'none', background: 'transparent' }}>Way</span>
              <span className="text-primary bg-transparent" style={{ textShadow: 'none', border: 'none', outline: 'none', background: 'transparent' }}>Pool</span>
            </span>
          </div>
          
          <div className="grid grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-sm font-medium text-white mb-3">
                {language === 'es' ? 'Plataforma' : 
                 language === 'en' ? 'Platform' :
                 language === 'pt' ? 'Plataforma' :
                 language === 'fr' ? 'Plateforme' :
                 language === 'de' ? 'Plattform' :
                 language === 'it' ? 'Piattaforma' :
                 language === 'ar' ? 'منصة' :
                 language === 'hi' ? 'प्लेटफॉर्म' :
                 language === 'zh' ? '平台' : 'Platform'}
              </h3>
              <ul className="space-y-2 text-sm">
                <li><a href="/dashboard" className="text-slate-400 hover:text-white">
                  {language === 'es' ? 'Dashboard' : 
                   language === 'en' ? 'Dashboard' :
                   language === 'pt' ? 'Painel' :
                   language === 'fr' ? 'Tableau de bord' :
                   language === 'de' ? 'Dashboard' :
                   language === 'it' ? 'Dashboard' :
                   language === 'ar' ? 'لوحة القيادة' :
                   language === 'hi' ? 'डैशबोर्ड' :
                   language === 'zh' ? '仪表板' : 'Dashboard'}
                </a></li>
                <li><a href="/positions" className="text-slate-400 hover:text-white">
                  {language === 'es' ? 'Posiciones' : 
                   language === 'en' ? 'Positions' :
                   language === 'pt' ? 'Posições' :
                   language === 'fr' ? 'Positions' :
                   language === 'de' ? 'Positionen' :
                   language === 'it' ? 'Posizioni' :
                   language === 'ar' ? 'المواقع' :
                   language === 'hi' ? 'पोजीशन' :
                   language === 'zh' ? '头寸' : 'Positions'}
                </a></li>
                <li><a href="/analytics" className="text-slate-400 hover:text-white">
                  {language === 'es' ? 'Analíticas' : 
                   language === 'en' ? 'Analytics' :
                   language === 'pt' ? 'Análises' :
                   language === 'fr' ? 'Analytique' :
                   language === 'de' ? 'Analytik' :
                   language === 'it' ? 'Analisi' :
                   language === 'ar' ? 'تحليلات' :
                   language === 'hi' ? 'विश्लेषण' :
                   language === 'zh' ? '分析' : 'Analytics'}
                </a></li>
                <li><a href="/uniswap" className="text-slate-400 hover:text-white">TOP Pools</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-white mb-3">
                {language === 'es' ? 'Recursos' : 
                 language === 'en' ? 'Resources' :
                 language === 'pt' ? 'Recursos' :
                 language === 'fr' ? 'Ressources' :
                 language === 'de' ? 'Ressourcen' :
                 language === 'it' ? 'Risorse' :
                 language === 'ar' ? 'موارد' :
                 language === 'hi' ? 'संसाधन' :
                 language === 'zh' ? '资源' : 'Resources'}
              </h3>
              <ul className="space-y-2 text-sm">
                <li><a href="/documentation" className="text-slate-400 hover:text-white">
                  {language === 'es' ? 'Documentación' : 
                   language === 'en' ? 'Documentation' :
                   language === 'pt' ? 'Documentação' :
                   language === 'fr' ? 'Documentation' :
                   language === 'de' ? 'Dokumentation' :
                   language === 'it' ? 'Documentazione' :
                   language === 'ar' ? 'وثائق' :
                   language === 'hi' ? 'दस्तावेज़ीकरण' :
                   language === 'zh' ? '文档' : 'Documentation'}
                </a></li>
                <li><a href="/support" className="text-slate-400 hover:text-white">
                  {language === 'es' ? 'Soporte' : 
                   language === 'en' ? 'Support' :
                   language === 'pt' ? 'Suporte' :
                   language === 'fr' ? 'Support' :
                   language === 'de' ? 'Unterstützung' :
                   language === 'it' ? 'Supporto' :
                   language === 'ar' ? 'الدعم' :
                   language === 'hi' ? 'सहायता' :
                   language === 'zh' ? '支持' : 'Support'}
                </a></li>
                <li><a href="/community" className="text-slate-400 hover:text-white">
                  {language === 'es' ? 'Comunidad' : 
                   language === 'en' ? 'Community' :
                   language === 'pt' ? 'Comunidade' :
                   language === 'fr' ? 'Communauté' :
                   language === 'de' ? 'Gemeinschaft' :
                   language === 'it' ? 'Comunità' :
                   language === 'ar' ? 'مجتمع' :
                   language === 'hi' ? 'समुदाय' :
                   language === 'zh' ? '社区' : 'Community'}
                </a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-800 pt-6 text-center">
            <div className="flex justify-center space-x-4 mb-4">
              <a href="/terms" className="text-xs text-slate-400 hover:text-white">
                {language === 'es' ? 'Términos de Uso' : 
                 language === 'en' ? 'Terms of Use' :
                 language === 'pt' ? 'Termos de Uso' :
                 language === 'fr' ? 'Conditions d\'utilisation' :
                 language === 'de' ? 'Nutzungsbedingungen' :
                 language === 'it' ? 'Termini di utilizzo' :
                 language === 'ar' ? 'شروط الاستخدام' :
                 language === 'hi' ? 'उपयोग की शर्तें' :
                 language === 'zh' ? '使用条款' : 'Terms of Use'}
              </a>
              <a href="/privacy" className="text-xs text-slate-400 hover:text-white">
                {language === 'es' ? 'Política de Privacidad' : 
                 language === 'en' ? 'Privacy Policy' :
                 language === 'pt' ? 'Política de Privacidade' :
                 language === 'fr' ? 'Politique de Confidentialité' :
                 language === 'de' ? 'Datenschutzrichtlinie' :
                 language === 'it' ? 'Politica sulla Privacy' :
                 language === 'ar' ? 'سياسة الخصوصية' :
                 language === 'hi' ? 'गोपनीयता नीति' :
                 language === 'zh' ? '隐私政策' : 'Privacy Policy'}
              </a>
              <a href="/disclaimer" className="text-xs text-slate-400 hover:text-white">
                {language === 'es' ? 'Aviso Legal' : 
                 language === 'en' ? 'Disclaimer' :
                 language === 'pt' ? 'Aviso Legal' :
                 language === 'fr' ? 'Avertissement' :
                 language === 'de' ? 'Haftungsausschluss' :
                 language === 'it' ? 'Disclaimer' :
                 language === 'ar' ? 'إخلاء المسؤولية' :
                 language === 'hi' ? 'अस्वीकरण' :
                 language === 'zh' ? '免责声明' : 'Disclaimer'}
              </a>
            </div>
            <p className="text-xs text-slate-500">
              {language === 'es' ? '© 2025 WayBank. Todos los derechos reservados.' : 
               language === 'en' ? '© 2025 WayBank. All rights reserved.' :
               language === 'pt' ? '© 2025 WayBank. Todos os direitos reservados.' :
               language === 'fr' ? '© 2025 WayBank. Tous droits réservés.' :
               language === 'de' ? '© 2025 WayBank. Alle Rechte vorbehalten.' :
               language === 'it' ? '© 2025 WayBank. Tutti i diritti riservati.' :
               language === 'ar' ? '© 2025 WayBank. جميع الحقوق محفوظة.' :
               language === 'hi' ? '© 2025 WayBank. सर्वाधिकार सुरक्षित.' :
               language === 'zh' ? '© 2025 WayBank. 保留所有权利.' : 
               '© 2025 WayBank. All rights reserved.'}
            </p>
          </div>
        </div>
      </footer>
      
      {/* Componente que corrige el margen del footer en pantallas móviles */}
      <FooterMenuFixer />
    </div>
  );
}