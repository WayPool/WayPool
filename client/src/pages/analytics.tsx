import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useWallet } from "@/hooks/use-wallet";
import { useLanguage } from "@/context/language-context";
import ConnectButton from "@/components/wallet/connect-button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePoolData } from "@/hooks/use-pool-data";
import { useQueryClient } from "@tanstack/react-query";
import { formatCurrency, formatNumber } from "@/lib/ethereum";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
} from "recharts";

// Los datos de volumen, TVL y fees ahora se cargan en tiempo real desde el endpoint
// Usamos useState y useEffect para cargarlos

// Los datos de APR se cargan desde el endpoint

// Los datos de distribución de liquidez se cargan desde el endpoint

// Los datos de breakdown de retornos se cargan desde el endpoint

const COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))", "hsl(var(--chart-5))"];

// Componente personalizado para el tooltip de los gráficos
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background p-3 rounded-md border border-slate-200 dark:border-slate-800 shadow-md">
        <p className="text-sm font-medium mb-1">{label}</p>
        {payload.map((item: any, index: number) => (
          <div key={index} className="flex items-center text-sm">
            <span
              className="inline-block w-3 h-3 mr-2 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span className="font-medium mr-2">
              {item.name}:
            </span>
            <span>
              {item.name.toLowerCase().includes('apr') ? 
                `${item.value}%` : 
                (item.name.toLowerCase().includes('liquidity') ? 
                  `${item.value}%` : 
                  formatCurrency(item.value)
                )
              }
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const Analytics: React.FC = () => {
  const { address } = useWallet();
  const { language } = useLanguage();
  const [selectedPool, setSelectedPool] = useState("0x88e6A0c2dDD26FEEb64F039a2c41296FcB3f5640"); // Dirección del pool por defecto
  const [timeframe, setTimeframe] = useState("1y");
  // Forzamos actualización de poolData cuando cambia selectedPool
  // Solución simplificada: usar directamente el hook de TanStack Query
  const { poolData, isLoading, refetch } = usePoolData(selectedPool);
  
  // Obtener el cliente de consultas para invalidar caché
  const queryClient = useQueryClient();
  
  // Extra: Mostrar los datos del pool en consola para debug
  useEffect(() => {
    if (poolData) {
      console.log("DATOS ACTUALES DEL POOL:", selectedPool);
      console.log("TVL:", poolData.tvl);
      console.log("24h Volume:", poolData.volume24h);
      console.log("24h Fees:", poolData.fees24h);
      console.log("APR:", poolData.apr);
    }
  }, [poolData, selectedPool]);
  
  // Filtrar datos según el período seleccionado
  const filterDataByTimeframe = useCallback((data: any[], timeframe: string) => {
    if (!data || data.length === 0) return [];

    const now = new Date();
    let filteredData = [...data];

    // Función para parsear la fecha del item (soporta múltiples formatos)
    const parseItemDate = (dateStr: string): Date => {
      if (!dateStr) return new Date();

      // Si es formato ISO (2026-01-15)
      if (dateStr.includes('-') && dateStr.length >= 10) {
        return new Date(dateStr);
      }

      // Si es formato corto español (Ene 15)
      const monthNameToIndex: {[key: string]: number} = {
        "Ene": 0, "Feb": 1, "Mar": 2, "Abr": 3, "May": 4, "Jun": 5,
        "Jul": 6, "Ago": 7, "Sept": 8, "Oct": 9, "Nov": 10, "Dic": 11,
        "ene": 0, "feb": 1, "mar": 2, "abr": 3, "may": 4, "jun": 5,
        "jul": 6, "ago": 7, "sept": 8, "oct": 9, "nov": 10, "dic": 11
      };

      // Extraer mes del string (ej: "Ene 15" o simplemente "Ene")
      const parts = dateStr.split(' ');
      const monthName = parts[0];
      const day = parts[1] ? parseInt(parts[1]) : 15;

      const monthIndex = monthNameToIndex[monthName];
      if (monthIndex !== undefined) {
        const date = new Date();
        date.setMonth(monthIndex);
        date.setDate(day || 15);
        // Si el mes es mayor que el mes actual, asumimos que es del año pasado
        if (monthIndex > now.getMonth()) {
          date.setFullYear(date.getFullYear() - 1);
        }
        return date;
      }

      return new Date();
    };

    // Formatear fecha para mostrar en gráficos (Ene 15)
    const formatDateForChart = (dateStr: string): string => {
      const date = parseItemDate(dateStr);
      const monthNames = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sept", "Oct", "Nov", "Dic"];
      return `${monthNames[date.getMonth()]} ${date.getDate()}`;
    };

    // Calcular días de diferencia
    const getDaysDifference = (date: Date): number => {
      const diffTime = now.getTime() - date.getTime();
      return Math.floor(diffTime / (1000 * 60 * 60 * 24));
    };

    switch (timeframe) {
      case '7d':
        // Últimos 7 días
        filteredData = data.filter(item => {
          if (!item.date) return false;
          const itemDate = parseItemDate(item.date);
          return getDaysDifference(itemDate) <= 7;
        });
        // Si no hay suficientes datos, usar los últimos 7 disponibles
        if (filteredData.length === 0 && data.length > 0) {
          filteredData = data.slice(-7);
        }
        break;
      case '1m':
        // Últimos 30 días
        filteredData = data.filter(item => {
          if (!item.date) return false;
          const itemDate = parseItemDate(item.date);
          return getDaysDifference(itemDate) <= 30;
        });
        if (filteredData.length === 0 && data.length > 0) {
          filteredData = data.slice(-30);
        }
        break;
      case '3m':
        // Últimos 90 días
        filteredData = data.filter(item => {
          if (!item.date) return false;
          const itemDate = parseItemDate(item.date);
          return getDaysDifference(itemDate) <= 90;
        });
        if (filteredData.length === 0 && data.length > 0) {
          filteredData = data;
        }
        break;
      case '1y':
        // Todos los datos disponibles (hasta 365 días)
        // No filtramos, usamos todos los datos
        break;
      default:
        break;
    }

    // Formatear las fechas para mostrar en gráficos
    filteredData = filteredData.map(item => ({
      ...item,
      date: formatDateForChart(item.date)
    }));

    console.log(`Filtrando datos para timeframe: ${timeframe}. Datos originales: ${data.length}, filtrados: ${filteredData.length}`);
    return filteredData;
  }, []);
  
  // Función para actualizar todos los datos del pool seleccionado
  const updatePoolData = useCallback(() => {
    // Primero resetear los estados para mostrar loading
    setLoadingVolumeData(true);
    setLoadingTvlData(true);
    setLoadingFeesData(true);
    setLoadingAprData(true);
    setLoadingLiquidityDistData(true);
    setLoadingReturnsData(true);
    
    // Invalidar la caché para el pool actual para forzar nueva petición
    queryClient.invalidateQueries({ queryKey: [`/api/blockchain/uniswap-pool?address=${selectedPool}`] });
    
    // Forzar recarga de datos del pool
    refetch();
    
    console.log(`Actualizando datos para timeframe: ${timeframe}`);
  }, [selectedPool, refetch, queryClient, timeframe]);
  
  // Refrescar datos cuando cambia el pool seleccionado o el timeframe
  useEffect(() => {
    if (selectedPool) {
      updatePoolData();
      
      // Cuando cambia el timeframe, forzamos la "invalidación" de la caché
      // para que se actualicen los filtros en los gráficos
      setLoadingVolumeData(true);
      setLoadingTvlData(true);
      setLoadingFeesData(true);
      setLoadingAprData(true);
      setLoadingLiquidityDistData(true);
      setLoadingReturnsData(true);
      
      // Simular un pequeño retardo para mostrar el loader y que se note visualmente el cambio
      setTimeout(() => {
        setLoadingVolumeData(false);
        setLoadingTvlData(false);
        setLoadingFeesData(false);
        setLoadingAprData(false);
        setLoadingLiquidityDistData(false);
        setLoadingReturnsData(false);
      }, 300);
    }
  }, [selectedPool, timeframe, updatePoolData]);
  
  // Estado para la lista de pools disponibles
  const [availablePools, setAvailablePools] = useState<{
    id: number;
    name: string;
    displayName: string;
    address: string;
    feeTier: number;
    token0: string;
    token1: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    createdBy: string;
  }[]>([]);
  const [loadingPools, setLoadingPools] = useState(true);
  
  // Estado para almacenar los datos de volumen reales
  const [volumeData, setVolumeData] = useState<{ date: string; volume: number }[]>([]);
  const [loadingVolumeData, setLoadingVolumeData] = useState(true);
  const [volumeError, setVolumeError] = useState<string | null>(null);
  
  // Estado para almacenar los datos de TVL reales
  const [tvlData, setTvlData] = useState<{ date: string; tvl: number }[]>([]);
  const [loadingTvlData, setLoadingTvlData] = useState(true);
  const [tvlError, setTvlError] = useState<string | null>(null);
  
  // Estado para almacenar los datos de comisiones (fees) reales
  const [feesData, setFeesData] = useState<{ date: string; fees: number }[]>([]);
  const [loadingFeesData, setLoadingFeesData] = useState(true);
  const [feesError, setFeesError] = useState<string | null>(null);
  
  // Estado para almacenar los datos de APR histórico reales
  const [aprData, setAprData] = useState<{ date: string; apr: number }[]>([]);
  const [loadingAprData, setLoadingAprData] = useState(true);
  const [aprError, setAprError] = useState<string | null>(null);
  
  // Estado para almacenar los datos de distribución de liquidez
  const [liquidityDistData, setLiquidityDistData] = useState<{ price: string; percentage: number }[]>([]);
  const [loadingLiquidityDistData, setLoadingLiquidityDistData] = useState(true);
  const [liquidityDistError, setLiquidityDistError] = useState<string | null>(null);
  
  // Estado para almacenar los datos de breakdown de retornos
  const [returnsData, setReturnsData] = useState<{ source: string; percentage: number }[]>([]);
  const [loadingReturnsData, setLoadingReturnsData] = useState(true);
  const [returnsError, setReturnsError] = useState<string | null>(null);
  
  // Cargar la lista de pools disponibles
  useEffect(() => {
    const fetchPools = async () => {
      try {
        setLoadingPools(true);
        
        const response = await fetch('/api/pools/custom');
        
        if (!response.ok) {
          throw new Error(`Error getting pools list: ${response.status}`);
        }
        
        const data = await response.json();
        console.log("Available pools data received:", data);
        
        if (Array.isArray(data) && data.length > 0) {
          setAvailablePools(data);
        } else {
          console.warn("No se recibieron datos de pools válidos, usando solo el predeterminado");
          setAvailablePools([{
            id: 0,
            name: "USDC-ETH",
            displayName: "USDC / ETH (0.30%)",
            address: "0x88e6A0c2dDD26FEEb64F039a2c41296FcB3f5640",
            feeTier: 3000,
            token0: "USDC",
            token1: "ETH",
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            createdBy: "system"
          }]);
        }
      } catch (error) {
        console.error("Error fetching pools:", error);
        
        // En caso de error, usar al menos el pool predeterminado
        setAvailablePools([{
          id: 0,
          name: "USDC-ETH",
          displayName: "USDC / ETH (0.30%)",
          address: "0x88e6A0c2dDD26FEEb64F039a2c41296FcB3f5640",
          feeTier: 3000,
          token0: "USDC",
          token1: "ETH",
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          createdBy: "system"
        }]);
      } finally {
        setLoadingPools(false);
      }
    };
    
    fetchPools();
  }, []);
  
  // Cargar datos de TVL reales cuando cambia el pool seleccionado o el timeframe
  useEffect(() => {
    const fetchTvlData = async () => {
      try {
        setLoadingTvlData(true);
        setTvlError(null);
        
        // Usar la dirección del pool seleccionado
        const poolAddress = selectedPool; // Ya está en formato de dirección
        
        console.log("Fetching TVL data for pool:", poolAddress);
        
        const response = await fetch(`/api/blockchain/tvl-history?address=${poolAddress}`);
        
        if (!response.ok) {
          throw new Error(`Error getting TVL data: ${response.status}`);
        }
        
        const data = await response.json();
        console.log("TVL data received:", data);
        
        if (Array.isArray(data) && data.length > 0) {
          setTvlData(data);
          console.log(`TVL data loaded. Will be filtered by timeframe: ${timeframe}`);
        } else {
          throw new Error("No se recibieron datos de TVL válidos");
        }
      } catch (error) {
        console.error("Error fetching TVL data:", error);
        setTvlError(error instanceof Error ? error.message : "Error desconocido");
        
        // En caso de error, mostrar error pero no usar datos de ejemplo
        setTvlData([]);
      } finally {
        setLoadingTvlData(false);
      }
    };
    
    fetchTvlData();
  }, [selectedPool, timeframe]);
  
  // Cargar datos de volumen reales cuando cambia el pool seleccionado o el timeframe
  useEffect(() => {
    const fetchVolumeData = async () => {
      try {
        setLoadingVolumeData(true);
        setVolumeError(null);
        
        // Usar la dirección del pool seleccionado
        const poolAddress = selectedPool; // Ya está en formato de dirección
        
        console.log("Fetching volume data for pool:", poolAddress);
        
        const response = await fetch(`/api/blockchain/trading-volume?address=${poolAddress}`);
        
        if (!response.ok) {
          throw new Error(`Error getting volume data: ${response.status}`);
        }
        
        const data = await response.json();
        console.log("Volume data received:", data);
        
        if (Array.isArray(data) && data.length > 0) {
          setVolumeData(data);
          console.log(`Volume data loaded. Will be filtered by timeframe: ${timeframe}`);
        } else {
          throw new Error("No se recibieron datos de volumen válidos");
        }
      } catch (error) {
        console.error("Error fetching volume data:", error);
        setVolumeError(error instanceof Error ? error.message : "Error desconocido");
        
        // En caso de error, mostrar error pero no usar datos de ejemplo
        setVolumeData([]);
      } finally {
        setLoadingVolumeData(false);
      }
    };
    
    fetchVolumeData();
  }, [selectedPool, timeframe]);

  // Cargar datos de comisiones (fees) reales cuando cambia el pool seleccionado o el timeframe
  useEffect(() => {
    const fetchFeesData = async () => {
      try {
        setLoadingFeesData(true);
        setFeesError(null);
        
        // Usar la dirección del pool seleccionado
        const poolAddress = selectedPool; // Ya está en formato de dirección
        
        console.log("Fetching fees data for pool:", poolAddress);
        
        const response = await fetch(`/api/blockchain/fees-history?address=${poolAddress}`);
        
        if (!response.ok) {
          throw new Error(`Error getting fees data: ${response.status}`);
        }
        
        const data = await response.json();
        console.log("Fees data received:", data);
        
        if (Array.isArray(data) && data.length > 0) {
          setFeesData(data);
          console.log(`Fees data loaded. Will be filtered by timeframe: ${timeframe}`);
        } else {
          throw new Error("No se recibieron datos de comisiones válidos");
        }
      } catch (error) {
        console.error("Error fetching fees data:", error);
        setFeesError(error instanceof Error ? error.message : "Error desconocido");
        
        // En caso de error, mostrar error pero no usar datos de ejemplo
        setFeesData([]);
      } finally {
        setLoadingFeesData(false);
      }
    };
    
    fetchFeesData();
  }, [selectedPool, timeframe]);
  
  // Cargar datos de APR histórico cuando cambia el pool seleccionado o el timeframe
  useEffect(() => {
    const fetchAprData = async () => {
      try {
        setLoadingAprData(true);
        setAprError(null);
        
        // Usar la dirección del pool seleccionado
        const poolAddress = selectedPool; // Ya está en formato de dirección
        
        console.log("Fetching APR history data for pool:", poolAddress);
        
        const response = await fetch(`/api/blockchain/apr-history?address=${poolAddress}`);
        
        if (!response.ok) {
          throw new Error(`Error getting historical APR data: ${response.status}`);
        }
        
        const data = await response.json();
        console.log("APR history data received:", data);
        
        if (Array.isArray(data) && data.length > 0) {
          setAprData(data);
          console.log(`APR history data loaded. Will be filtered by timeframe: ${timeframe}`);
        } else {
          throw new Error("No se recibieron datos de APR histórico válidos");
        }
      } catch (error) {
        console.error("Error fetching APR history data:", error);
        setAprError(error instanceof Error ? error.message : "Error desconocido");
        
        // En caso de error, mostrar error pero no usar datos de ejemplo
        setAprData([]);
      } finally {
        setLoadingAprData(false);
      }
    };
    
    fetchAprData();
  }, [selectedPool, timeframe]);
  
  // Cargar datos de distribución de liquidez cuando cambia el pool seleccionado o el timeframe
  useEffect(() => {
    const fetchLiquidityDistData = async () => {
      try {
        setLoadingLiquidityDistData(true);
        setLiquidityDistError(null);
        
        // Usar la dirección del pool seleccionado
        const poolAddress = selectedPool; // Ya está en formato de dirección
        
        console.log("Fetching liquidity distribution data for pool:", poolAddress);
        
        const response = await fetch(`/api/blockchain/liquidity-distribution?address=${poolAddress}`);
        
        if (!response.ok) {
          throw new Error(`Error getting liquidity distribution data: ${response.status}`);
        }
        
        const data = await response.json();
        console.log("Liquidity distribution data received:", data);
        
        if (Array.isArray(data) && data.length > 0) {
          setLiquidityDistData(data);
          console.log(`Liquidity distribution data loaded. Will be filtered by timeframe: ${timeframe}`);
        } else {
          throw new Error("No se recibieron datos de distribución de liquidez válidos");
        }
      } catch (error) {
        console.error("Error fetching liquidity distribution data:", error);
        setLiquidityDistError(error instanceof Error ? error.message : "Error desconocido");
        
        // En caso de error, mostrar error pero no usar datos de ejemplo
        setLiquidityDistData([]);
      } finally {
        setLoadingLiquidityDistData(false);
      }
    };
    
    fetchLiquidityDistData();
  }, [selectedPool, timeframe]);
  
  // Cargar datos de breakdown de retornos cuando cambia el pool seleccionado o el timeframe
  useEffect(() => {
    const fetchReturnsData = async () => {
      try {
        setLoadingReturnsData(true);
        setReturnsError(null);
        
        // Usar la dirección del pool seleccionado
        const poolAddress = selectedPool; // Ya está en formato de dirección
        
        console.log("Fetching returns breakdown data for pool:", poolAddress);
        
        const response = await fetch(`/api/blockchain/returns-breakdown?address=${poolAddress}`);
        
        if (!response.ok) {
          throw new Error(`Error getting returns breakdown data: ${response.status}`);
        }
        
        const data = await response.json();
        console.log("Returns breakdown data received:", data);
        
        if (Array.isArray(data) && data.length > 0) {
          setReturnsData(data);
          console.log(`Returns breakdown data loaded. Will be filtered by timeframe: ${timeframe}`);
        } else {
          throw new Error("No se recibieron datos de breakdown de retornos válidos");
        }
      } catch (error) {
        console.error("Error fetching returns breakdown data:", error);
        setReturnsError(error instanceof Error ? error.message : "Error desconocido");
        
        // En caso de error, mostrar error pero no usar datos de ejemplo
        setReturnsData([]);
      } finally {
        setLoadingReturnsData(false);
      }
    };
    
    fetchReturnsData();
  }, [selectedPool, timeframe]);

  // Función para calcular el APR promedio del periodo seleccionado
  const calculateAverageApr = useCallback(() => {
    if (!aprData || aprData.length === 0) {
      return Number(poolData?.apr || 0).toFixed(2);
    }
    
    const filteredData = filterDataByTimeframe(aprData, timeframe);
    if (filteredData.length === 0) {
      return Number(poolData?.apr || 0).toFixed(2);
    }
    
    // Calcular el promedio de APR para el periodo seleccionado
    const sum = filteredData.reduce((acc, item) => acc + Number(item.apr || 0), 0);
    const average = sum / filteredData.length;
    
    return average.toFixed(2);
  }, [aprData, timeframe, poolData, filterDataByTimeframe]);
  
  // Función para calcular las fees acumuladas del periodo seleccionado
  const calculateTotalFees = useCallback(() => {
    if (!feesData || feesData.length === 0) {
      return Number(poolData?.fees24h || 0);
    }
    
    const filteredData = filterDataByTimeframe(feesData, timeframe);
    if (filteredData.length === 0) {
      return Number(poolData?.fees24h || 0);
    }
    
    // Calcular el total de fees para el periodo seleccionado
    const total = filteredData.reduce((acc, item) => acc + Number(item.fees || 0), 0);
    
    // Si es periodo > 1 día, calcular promedio diario
    if (timeframe !== '7d') {
      // Para periodos más largos, promediamos los datos para obtener un valor diario representativo
      return total / filteredData.length;
    }
    
    return total;
  }, [feesData, timeframe, poolData, filterDataByTimeframe]);
  
  // Fin de los useEffect

  return (
    <>
      {/* Header with Wallet Connection */}
      <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">
            {language === 'en' ? 'Analytics' : 
             language === 'es' ? 'Analíticas' : 
             language === 'fr' ? 'Analytiques' : 
             'Analytik'}
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            {language === 'en' ? 'Track performance and data for Uniswap v4 pools' : 
             language === 'es' ? 'Seguimiento de rendimiento y datos para pools de Uniswap v4' : 
             language === 'fr' ? 'Suivez la performance et les données des pools Uniswap v4' : 
             'Verfolgen Sie Leistung und Daten für Uniswap v4 Pools'}
          </p>
        </div>
        <div className="w-full md:w-auto">
          <ConnectButton />
        </div>
      </div>

      {/* Filter Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium mb-2">
            {language === 'en' ? 'Select Pool' : 
             language === 'es' ? 'Seleccionar Pool' : 
             language === 'fr' ? 'Sélectionner Pool' : 
             'Pool Auswählen'}
          </label>
          <Select
            value={selectedPool}
            onValueChange={(value) => {
              console.log("*** SELECCIONANDO POOL:", value, "***");
              
              // Asegurarse de que el valor ha cambiado realmente
              if (value !== selectedPool) {
                console.log(`*** CAMBIANDO POOL: ${selectedPool} → ${value} ***`);
                
                // Resetear estados para evitar mostrar datos antiguos durante la carga
                setLoadingVolumeData(true);
                setLoadingTvlData(true);
                setLoadingFeesData(true);
                setLoadingAprData(true);
                setLoadingLiquidityDistData(true);
                setLoadingReturnsData(true);
                
                // Limpiar errores previos
                setVolumeError(null);
                setTvlError(null);
                setFeesError(null);
                setAprError(null);
                setLiquidityDistError(null);
                setReturnsError(null);
                
                // Actualizar el pool seleccionado
                setSelectedPool(value);
                
                // Invalidar consultas y forzar actualización inmediata
                queryClient.invalidateQueries({queryKey: ["poolData"]});
                queryClient.removeQueries({queryKey: ["poolData", selectedPool]});
                
                // Forzar actualización inmediata
                refetch();
              }
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a pool" />
            </SelectTrigger>
            <SelectContent>
              {loadingPools ? (
                <div className="flex items-center justify-center p-4">
                  <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin mr-2"></div>
                  <span>Loading pools...</span>
                </div>
              ) : (
                availablePools.map((pool) => (
                  <SelectItem key={pool.id} value={pool.address}>
                    {pool.name} {pool.feeTier ? `(${pool.feeTier / 10000}%)` : ''}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">
            {language === 'en' ? 'Timeframe' : 
             language === 'es' ? 'Período de Tiempo' : 
             language === 'fr' ? 'Période' : 
             'Zeitraum'}
          </label>
          <Tabs 
            value={timeframe} 
            onValueChange={(value) => {
              console.log(`Changing timeframe to: ${value}`);
              setTimeframe(value);
              
              // Forzar actualización de estado visual para los gráficos
              setLoadingVolumeData(true);
              setLoadingTvlData(true);
              setLoadingFeesData(true);
              setLoadingAprData(true);
              setLoadingLiquidityDistData(true);
              setLoadingReturnsData(true);
              
              // Breve delay para mostrar el estado de carga
              setTimeout(() => {
                setLoadingVolumeData(false);
                setLoadingTvlData(false);
                setLoadingFeesData(false);
                setLoadingAprData(false);
                setLoadingLiquidityDistData(false);
                setLoadingReturnsData(false);
              }, 300);
            }} 
            className="w-full"
          >
            <TabsList className="grid grid-cols-4">
              <TabsTrigger value="7d">
                {language === 'en' ? '7D' : 
                 language === 'es' ? '7D' : 
                 language === 'fr' ? '7J' : 
                 '7T'}
              </TabsTrigger>
              <TabsTrigger value="1m">
                {language === 'en' ? '1M' : 
                 language === 'es' ? '1M' : 
                 language === 'fr' ? '1M' : 
                 '1M'}
              </TabsTrigger>
              <TabsTrigger value="3m">
                {language === 'en' ? '3M' : 
                 language === 'es' ? '3M' : 
                 language === 'fr' ? '3M' : 
                 '3M'}
              </TabsTrigger>
              <TabsTrigger value="1y">
                {language === 'en' ? '1Y' : 
                 language === 'es' ? '1A' : 
                 language === 'fr' ? '1A' : 
                 '1J'}
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Pool Overview - Simplificado para mostrar datos directamente del API */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-slate-500 dark:text-slate-400">
              {language === 'en' ? 'Total Liquidity' : 
               language === 'es' ? 'Liquidez Total' : 
               language === 'fr' ? 'Liquidité Totale' : 
               'Gesamte Liquidität'}
            </div>
            {isLoading ? (
              <div className="flex items-center space-x-2 h-8">
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                <span className="text-slate-400">
                  {language === 'en' ? 'Loading pool data...' : 
                   language === 'es' ? 'Cargando datos del pool...' : 
                   language === 'fr' ? 'Chargement des données du pool...' : 
                   'Pool-Daten werden geladen...'}
                </span>
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold" key={`tvl-${selectedPool}`}>
                  {formatCurrency(Number(poolData?.tvl || 0))}
                </div>
                <div className="text-xs text-slate-500">Pool: {selectedPool.substring(0, 8)}...</div>
              </>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-slate-500 dark:text-slate-400">
              {language === 'en' ? '24h Volume' : 
               language === 'es' ? 'Volumen 24h' : 
               language === 'fr' ? 'Volume 24h' : 
               '24h Volumen'}
            </div>
            {isLoading ? (
              <div className="flex items-center space-x-2 h-8">
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                <span className="text-slate-400">
                  {language === 'en' ? 'Loading pool data...' : 
                   language === 'es' ? 'Cargando datos del pool...' : 
                   language === 'fr' ? 'Chargement des données du pool...' : 
                   'Pool-Daten werden geladen...'}
                </span>
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold" key={`volume-${selectedPool}`}>
                  {formatCurrency(Number(poolData?.volume24h || 0))}
                </div>
                <div className="text-xs text-slate-500">
                  {language === 'en' ? 'Updated' : 
                   language === 'es' ? 'Actualizado' : 
                   language === 'fr' ? 'Mis à jour' : 
                   'Aktualisiert'}: {new Date().toLocaleTimeString()}
                </div>
              </>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-slate-500 dark:text-slate-400">
              {language === 'en' ? '24h Fees' : 
               language === 'es' ? 'Comisiones 24h' : 
               language === 'fr' ? 'Frais 24h' : 
               '24h Gebühren'}
            </div>
            {isLoading ? (
              <div className="flex items-center space-x-2 h-8">
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                <span className="text-slate-400">
                  {language === 'en' ? 'Loading pool data...' : 
                   language === 'es' ? 'Cargando datos del pool...' : 
                   language === 'fr' ? 'Chargement des données du pool...' : 
                   'Pool-Daten werden geladen...'}
                </span>
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold" key={`fees-${selectedPool}-${timeframe}`}>
                  {formatCurrency(calculateTotalFees())}
                </div>
                <div className="text-xs text-slate-500">
                  {console.log("RENDERIZANDO FEES:", calculateTotalFees())}
                  {language === 'en' ? 'Current pool' : 
                   language === 'es' ? 'Pool actual' : 
                   language === 'fr' ? 'Pool actuel' : 
                   'Aktueller Pool'}: {poolData?.token0?.symbol || ''}/{poolData?.token1?.symbol || ''}
                </div>
              </>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-slate-500 dark:text-slate-400">
              {language === 'en' ? 'APR (est.)' : 
               language === 'es' ? 'APR (est.)' : 
               language === 'fr' ? 'APR (est.)' : 
               'APR (Schätz.)'}
            </div>
            {isLoading ? (
              <div className="flex items-center space-x-2 h-8">
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                <span className="text-slate-400">
                  {language === 'en' ? 'Loading pool data...' : 
                   language === 'es' ? 'Cargando datos del pool...' : 
                   language === 'fr' ? 'Chargement des données du pool...' : 
                   'Pool-Daten werden geladen...'}
                </span>
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold text-green-500" key={`apr-${selectedPool}-${timeframe}`}>
                  {`${calculateAverageApr()}%`}
                </div>
                <div className="text-xs text-slate-500">
                  {console.log("RENDERIZANDO APR:", calculateAverageApr())}
                  FeeTier: {poolData?.feeTier ? (poolData.feeTier / 10000) + '%' : 'N/A'}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Volume Chart */}
        <Card>
          <CardHeader>
            <CardTitle>
              {language === 'en' ? 'Trading Volume' : 
               language === 'es' ? 'Volumen de Operaciones' : 
               language === 'fr' ? 'Volume d\'Échanges' : 
               'Handelsvolumen'}
            </CardTitle>
            <CardDescription>
              {language === 'en' ? 'Monthly trading volume in USD' : 
               language === 'es' ? 'Volumen mensual de operaciones en USD' : 
               language === 'fr' ? 'Volume d\'échange mensuel en USD' : 
               'Monatliches Handelsvolumen in USD'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              {loadingVolumeData ? (
                <div className="h-full flex flex-col items-center justify-center">
                  <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                  <p className="text-slate-500 dark:text-slate-400">Loading historical data...</p>
                </div>
              ) : volumeError ? (
                <div className="h-full flex flex-col items-center justify-center">
                  <div className="text-red-500 mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <p className="text-red-500 font-medium">Error loading data</p>
                  <p className="text-slate-500 text-sm text-center mt-2">{volumeError}</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={filterDataByTimeframe(volumeData, timeframe)}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis
                      tickFormatter={(value) => value >= 1000000 ? `$${value / 1000000}M` : `$${value}`}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="volume" name="Volume" fill="hsl(var(--chart-1))" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>

        {/* TVL Chart */}
        <Card>
          <CardHeader>
            <CardTitle>
              {language === 'en' ? 'Total Value Locked' : 
               language === 'es' ? 'Valor Total Bloqueado' : 
               language === 'fr' ? 'Valeur Totale Verrouillée' : 
               'Gesamtwert Gesperrt'}
            </CardTitle>
            <CardDescription>
              {language === 'en' ? 'TVL over time in USD' : 
               language === 'es' ? 'TVL a lo largo del tiempo en USD' : 
               language === 'fr' ? 'TVL au fil du temps en USD' : 
               'TVL im Zeitverlauf in USD'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              {loadingTvlData ? (
                <div className="h-full flex flex-col items-center justify-center">
                  <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                  <p className="text-slate-500 dark:text-slate-400">Loading historical data...</p>
                </div>
              ) : tvlError ? (
                <div className="h-full flex flex-col items-center justify-center">
                  <div className="text-red-500 mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <p className="text-red-500 font-medium">Error loading data</p>
                  <p className="text-slate-500 text-sm text-center mt-2">{tvlError}</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={filterDataByTimeframe(tvlData, timeframe)}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis
                      tickFormatter={(value) => value >= 1000000 ? `$${value / 1000000}M` : `$${value}`}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="tvl"
                      name="TVL"
                      stroke="hsl(var(--chart-2))"
                      fill="hsl(var(--chart-2) / 0.3)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Fees Chart */}
        <Card>
          <CardHeader>
            <CardTitle>
              {language === 'en' ? 'Fees Generated' : 
               language === 'es' ? 'Comisiones Generadas' : 
               language === 'fr' ? 'Frais Générés' : 
               'Generierte Gebühren'}
            </CardTitle>
            <CardDescription>
              {language === 'en' ? 'Monthly fees in USD' : 
               language === 'es' ? 'Comisiones mensuales en USD' : 
               language === 'fr' ? 'Frais mensuels en USD' : 
               'Monatliche Gebühren in USD'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              {loadingFeesData ? (
                <div className="h-full flex flex-col items-center justify-center">
                  <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                  <p className="text-slate-500 dark:text-slate-400">Loading historical data...</p>
                </div>
              ) : feesError ? (
                <div className="h-full flex flex-col items-center justify-center">
                  <div className="text-red-500 mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <p className="text-red-500 font-medium">Error loading data</p>
                  <p className="text-slate-500 text-sm text-center mt-2">{feesError}</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={filterDataByTimeframe(feesData, timeframe)}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis
                      tickFormatter={(value) => value >= 1000000 ? `$${value / 1000000}M` : `$${value}`}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Line
                      type="monotone"
                      dataKey="fees"
                      name="Fees"
                      stroke="hsl(var(--chart-3))"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>

        {/* APR History Chart */}
        <Card>
          <CardHeader>
            <CardTitle>
              {language === 'en' ? 'APR History' : 
               language === 'es' ? 'Historial de APR' : 
               language === 'fr' ? 'Historique APR' : 
               'APR-Verlauf'}
            </CardTitle>
            <CardDescription>
              {language === 'en' ? 'Estimated APR over time' : 
               language === 'es' ? 'APR estimado a lo largo del tiempo' : 
               language === 'fr' ? 'APR estimé au fil du temps' : 
               'Geschätzter APR im Zeitverlauf'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              {loadingAprData ? (
                <div className="h-full flex flex-col items-center justify-center">
                  <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                  <p className="text-slate-500 dark:text-slate-400">Loading historical data...</p>
                </div>
              ) : aprError ? (
                <div className="h-full flex flex-col items-center justify-center">
                  <div className="text-red-500 mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <p className="text-red-500 font-medium">Error loading data</p>
                  <p className="text-slate-500 text-sm text-center mt-2">{aprError}</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={filterDataByTimeframe(aprData, timeframe)}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Line
                      type="monotone"
                      dataKey="apr"
                      name="APR %"
                      stroke="hsl(var(--chart-4))"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Liquidity Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>
              {language === 'en' ? 'Liquidity Distribution' : 
               language === 'es' ? 'Distribución de Liquidez' : 
               language === 'fr' ? 'Distribution de Liquidité' : 
               'Liquiditätsverteilung'}
            </CardTitle>
            <CardDescription>
              {language === 'en' ? 'Distribution of liquidity by price range' : 
               language === 'es' ? 'Distribución de liquidez por rango de precio' : 
               language === 'fr' ? 'Distribution de liquidité par plage de prix' : 
               'Verteilung der Liquidität nach Preisbereich'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              {loadingLiquidityDistData ? (
                <div className="h-full flex flex-col items-center justify-center">
                  <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                  <p className="text-slate-500 dark:text-slate-400">Loading distribution data...</p>
                </div>
              ) : liquidityDistError ? (
                <div className="h-full flex flex-col items-center justify-center">
                  <div className="text-red-500 mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <p className="text-red-500 font-medium">Error loading data</p>
                  <p className="text-slate-500 text-sm text-center mt-2">{liquidityDistError}</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={filterDataByTimeframe(liquidityDistData, timeframe)}
                    layout="vertical"
                    margin={{ top: 10, right: 30, left: 80, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="price" type="category" width={150} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar
                      dataKey="percentage"
                      name="Liquidity %"
                      fill="hsl(var(--chart-5))"
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Returns Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>
              {language === 'en' ? 'Returns Breakdown' : 
               language === 'es' ? 'Desglose de Rendimientos' : 
               language === 'fr' ? 'Répartition des Rendements' : 
               'Renditeaufschlüsselung'}
            </CardTitle>
            <CardDescription>
              {language === 'en' ? 'Sources of returns for liquidity providers' : 
               language === 'es' ? 'Fuentes de rendimiento para proveedores de liquidez' : 
               language === 'fr' ? 'Sources de rendement pour les fournisseurs de liquidité' : 
               'Ertragsquellen für Liquiditätsanbieter'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              {loadingReturnsData ? (
                <div className="h-full flex flex-col items-center justify-center">
                  <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                  <p className="text-slate-500 dark:text-slate-400">Loading returns data...</p>
                </div>
              ) : returnsError ? (
                <div className="h-full flex flex-col items-center justify-center">
                  <div className="text-red-500 mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <p className="text-red-500 font-medium">Error loading data</p>
                  <p className="text-slate-500 text-sm text-center mt-2">{returnsError}</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={filterDataByTimeframe(returnsData, timeframe)}
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="percentage"
                      nameKey="source"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {returnsData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number) => [`${value}%`, "Porcentaje"]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default Analytics;
