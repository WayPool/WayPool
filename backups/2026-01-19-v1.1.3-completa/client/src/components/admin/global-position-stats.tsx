import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useWallet } from "@/hooks/use-wallet";
import { apiRequest } from "@/lib/queryClient";

// Función para calcular ganancias en tiempo real basadas en APR y tiempo transcurrido
const calculateRealTimeEarnings = (positions: any[]): number => {
  // Usando la fecha real del sistema en tiempo real
  const now = new Date();
  console.log(`[Global Stats] Calculando ganancias en tiempo real para ${positions.length} posiciones a fecha: ${now.toISOString()}`);
  
  // Filtrar posiciones activas
  const activePositions = positions.filter((pos: any) => pos.status === "Active");
  console.log(`[Global Stats] Posiciones activas: ${activePositions.length} de ${positions.length}`);
  
  // Calcular ganancias totales usando fórmula: Monto * APR / 365 * días transcurridos
  const totalEarnings = activePositions.reduce((sum: number, pos: any) => {
    // Asegurar que siempre tengamos una fecha de inicio válida
    const startDate = pos.startDate ? new Date(pos.startDate) : new Date(pos.timestamp);
    
    // Calcular minutos exactos transcurridos para mayor precisión
    const minutesElapsed = Math.max(1, Math.floor((now.getTime() - startDate.getTime()) / (1000 * 60)));
    const daysElapsed = minutesElapsed / (24 * 60);
    
    // Calcular las ganancias diarias basadas en APR
    const aprPercentage = parseFloat(String(pos.apr)) / 100;
    const dailyEarnings = (parseFloat(String(pos.depositedUSDC)) * aprPercentage) / 365;
    
    // Calcular ganancias totales basadas en días transcurridos
    const positionEarnings = dailyEarnings * daysElapsed;
    
    console.log(`[Global Stats] Posición ${pos.id}: ${pos.depositedUSDC} USDC × ${pos.apr}% APR ÷ 365 × ${daysElapsed.toFixed(2)} días = ${positionEarnings.toFixed(2)} USDC`);
    
    return sum + positionEarnings;
  }, 0);
  
  console.log(`[Global Stats] Ganancias totales calculadas: ${totalEarnings.toFixed(2)} USDC`);
  return totalEarnings;
};
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowUpRight,
  Coins,
  DollarSign,
  ActivitySquare,
  BarChart,
  PieChart,
  Network,
  Calculator,
  Maximize2,
  Clock,
  AlertTriangle,
  Users,
  Layers,
  TrendingUp,
  Percent
} from "lucide-react";

// Funciones auxiliares para formateo de números
const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
};

const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
};

interface Position {
  id: number;
  walletAddress: string;
  poolAddress: string;
  poolName: string;
  token0: string;
  token1: string;
  depositedUSDC: number;
  feesEarned: number;
  apr: number;
  status: string;
  network?: string;
  timeframe: number;
  impermanentLossRisk?: string;
  inRange?: boolean;
}

const GlobalPositionStats = () => {
  const { address } = useWallet();

  // Consulta para obtener todas las posiciones del sistema
  const { data: allPositions = [], isLoading: isLoadingPositions } = useQuery<Position[]>({
    queryKey: ['/api/admin/all-positions'],
    queryFn: async () => {
      if (!address) return [];
      
      // Primero obtenemos la lista de usuarios
      const users = await apiRequest('GET', '/api/admin/users', null, {
        headers: { 'x-wallet-address': address }
      });
      
      if (!Array.isArray(users) || users.length === 0) return [];
      
      // Luego obtenemos todas las posiciones de todos los usuarios
      const allPositionsData: Position[] = [];
      
      for (const user of users) {
        try {
          const userPositions = await apiRequest('GET', `/api/admin/positions/${user.walletAddress}`, null, {
            headers: { 'x-wallet-address': address }
          });
          
          if (Array.isArray(userPositions) && userPositions.length > 0) {
            allPositionsData.push(...userPositions);
          }
        } catch (err) {
          console.error(`Error al cargar posiciones para ${user.walletAddress}:`, err);
        }
      }
      
      return allPositionsData;
    },
    enabled: !!address,
    staleTime: 60000 // 1 minuto
  });
  
  // Consulta para obtener todos los usuarios
  const { data: allUsers = [], isLoading: isLoadingUsers } = useQuery<any[]>({
    queryKey: ['/api/admin/users'],
    queryFn: async () => {
      if (!address) return [];
      try {
        return await apiRequest('GET', '/api/admin/users', null, {
          headers: { 'x-wallet-address': address }
        });
      } catch (error) {
        console.error("Error al cargar usuarios:", error);
        return [];
      }
    },
    enabled: !!address,
    staleTime: 60000 // 1 minuto
  });

  const isLoading = isLoadingPositions || isLoadingUsers;
  
  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  // Si no hay posiciones, mostramos un mensaje
  if (!allPositions || allPositions.length === 0) {
    return (
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Layers className="mr-2 h-5 w-5" />
            No hay posiciones en el sistema
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Aún no se han creado posiciones en el sistema. Las métricas globales se mostrarán aquí cuando haya datos disponibles.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Calculamos las métricas globales
  const totalCapital = allPositions.reduce((sum, p) => sum + Number(p.depositedUSDC || 0), 0);
  const totalFeesEarned = calculateRealTimeEarnings(allPositions);
  const averageApr = allPositions.reduce((sum, p) => sum + Number(p.apr || 0), 0) / (allPositions.length || 1);
  const highAprPositions = allPositions.filter(p => Number(p.apr) > 50).length;
  
  const activePositions = allPositions.filter(p => p.status === "Active").length;
  const pendingPositions = allPositions.filter(p => p.status === "Pending").length;
  const finalizedPositions = allPositions.filter(p => p.status === "Finalized").length;
  
  const ethereumPositions = allPositions.filter(p => !p.network || p.network === 'ethereum').length;
  const polygonPositions = allPositions.filter(p => p.network === 'polygon').length;
  
  const avgPositionValue = totalCapital / (allPositions.length || 1);
  const maxPositionValue = Math.max(...allPositions.map(p => Number(p.depositedUSDC || 0)));
  
  const positions30Days = allPositions.filter(p => p.timeframe === 30).length;
  const positions90Days = allPositions.filter(p => p.timeframe === 90).length;
  const positions365Days = allPositions.filter(p => p.timeframe === 365).length;
  
  const lowRiskPositions = allPositions.filter(p => p.impermanentLossRisk === 'Low').length;
  const mediumRiskPositions = allPositions.filter(p => p.impermanentLossRisk === 'Medium').length;
  const highRiskPositions = allPositions.filter(p => p.impermanentLossRisk === 'High').length;

  // Contamos los usuarios únicos que tienen posiciones
  const uniqueUsers = new Set(allPositions.map(p => p.walletAddress)).size;
  
  // Contamos el total de usuarios en el sistema
  const totalUsers = allUsers.length;
  
  // Contamos los usuarios con posiciones activas
  const usersWithActivePositions = new Set(
    allPositions
      .filter(p => p.status === "Active")
      .map(p => p.walletAddress)
  ).size;
  
  // Calculamos el porcentaje de usuarios con posiciones activas sobre el total
  const activeUsersPercentage = totalUsers > 0 ? (usersWithActivePositions / totalUsers * 100) : 0;

  return (
    <div id="global-stats-panel" className="mb-8 space-y-4 bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow">
      <h2 className="text-xl font-bold mb-4 text-slate-900 dark:text-slate-50 flex items-center">
        <BarChart className="mr-2 h-5 w-5" /> 
        Métricas Globales del Sistema
      </h2>
      
      {/* Primera fila - 4 tarjetas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Tarjeta 1: Usuarios */}
        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-start justify-between">
            <div className="flex-1 mr-3">
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Usuarios</p>
              <div className="flex items-center gap-2 mt-1">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
                  {usersWithActivePositions}
                </h3>
                <span className="text-sm font-medium text-slate-600 dark:text-slate-400">/ {totalUsers}</span>
              </div>
              <div className="flex flex-col mt-1">
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 mb-1">
                  <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${activeUsersPercentage}%` }}></div>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-blue-600">
                    {formatNumber(activeUsersPercentage)}% activos
                  </span>
                  <span className="text-green-600">
                    <ArrowUpRight className="h-3 w-3 inline mr-1" />
                    {formatNumber(allPositions.length / uniqueUsers)}
                  </span>
                  <span className="text-slate-500 dark:text-slate-400">
                    posis./usuario
                  </span>
                </div>
              </div>
            </div>
            <div className="flex-shrink-0 bg-blue-100 dark:bg-blue-900/30 p-2 rounded-md">
              <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        {/* Tarjeta 2: Capital Total Invertido */}
        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-start justify-between">
            <div className="flex-1 mr-3">
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Capital Total</p>
              <h3 className="text-2xl font-bold mt-1 text-slate-900 dark:text-slate-50">
                {formatCurrency(totalCapital)}
              </h3>
              <div className="flex items-center mt-1 text-xs">
                <span className="text-green-600">
                  <ArrowUpRight className="h-3 w-3 inline mr-1" />
                  {formatNumber(activePositions / allPositions.length * 100)}%
                </span>
                <span className="text-slate-500 dark:text-slate-400 ml-1">en posiciones activas</span>
              </div>
            </div>
            <div className="flex-shrink-0 bg-indigo-100 dark:bg-indigo-900/30 p-2 rounded-md">
              <Coins className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            </div>
          </div>
        </div>

        {/* Tarjeta 3: Ganancias Generadas */}
        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-start justify-between">
            <div className="flex-1 mr-3">
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Ganancias Totales</p>
              <h3 className="text-2xl font-bold mt-1 text-green-600 dark:text-green-400">
                {formatCurrency(totalFeesEarned)}
              </h3>
              <div className="flex flex-col space-y-1 mt-1">
                <div className="flex items-center text-xs">
                  <span className="text-blue-600">
                    <TrendingUp className="h-3 w-3 inline mr-1" />
                    {formatNumber(totalFeesEarned / totalCapital * 100)}%
                  </span>
                  <span className="text-slate-500 dark:text-slate-400 ml-1">del capital</span>
                </div>
                <div className="flex items-center">
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 italic">actualizado en tiempo real</span>
                </div>
              </div>
            </div>
            <div className="flex-shrink-0 bg-green-100 dark:bg-green-900/30 p-2 rounded-md">
              <DollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        {/* Tarjeta 4: APR Promedio */}
        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-start justify-between">
            <div className="flex-1 mr-3">
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">APR Promedio</p>
              <h3 className="text-2xl font-bold mt-1 text-purple-600 dark:text-purple-400">
                {formatNumber(averageApr)}%
              </h3>
              <div className="flex items-center mt-1 text-xs">
                <span className="text-purple-600">
                  <ActivitySquare className="h-3 w-3 inline mr-1" />
                  {highAprPositions}
                </span>
                <span className="text-slate-500 dark:text-slate-400 ml-1">posiciones con alto APR</span>
              </div>
            </div>
            <div className="flex-shrink-0 bg-purple-100 dark:bg-purple-900/30 p-2 rounded-md">
              <Percent className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Segunda fila - 4 tarjetas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Tarjeta 5: Distribución de Estados */}
        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-start justify-between">
            <div className="flex-1 mr-3">
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Estados</p>
              <div className="flex flex-wrap items-center gap-2 mt-1">
                <Badge variant="default" className="py-1">
                  {activePositions} Activas
                </Badge>
                <Badge variant="secondary" className="py-1">
                  {pendingPositions} Pendientes
                </Badge>
                <Badge variant="outline" className="py-1">
                  {finalizedPositions} Finalizadas
                </Badge>
              </div>
              <div className="flex items-center mt-2 text-xs">
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5">
                  <div className="bg-green-500 h-1.5 rounded-full" style={{ width: `${activePositions / allPositions.length * 100}%` }}></div>
                </div>
              </div>
            </div>
            <div className="flex-shrink-0 bg-amber-100 dark:bg-amber-900/30 p-2 rounded-md">
              <PieChart className="h-6 w-6 text-amber-600 dark:text-amber-400" />
            </div>
          </div>
        </div>
        
        {/* Tarjeta 6: Distribución por Red */}
        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-start justify-between">
            <div className="flex-1 mr-3">
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Redes</p>
              <div className="mt-1 space-y-1">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-orange-500 mr-2"></div>
                    <span className="text-sm">Ethereum</span>
                  </div>
                  <span className="text-sm font-medium">
                    {ethereumPositions}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-purple-500 mr-2"></div>
                    <span className="text-sm">Polygon</span>
                  </div>
                  <span className="text-sm font-medium">
                    {polygonPositions}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex-shrink-0 bg-indigo-100 dark:bg-indigo-900/30 p-2 rounded-md">
              <Network className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            </div>
          </div>
        </div>
        
        {/* Tarjeta 7: Valor por Posición */}
        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-start justify-between">
            <div className="flex-1 mr-3">
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Valor Promedio</p>
              <h3 className="text-2xl font-bold mt-1 text-cyan-600 dark:text-cyan-400">
                {formatCurrency(avgPositionValue)}
              </h3>
              <div className="flex items-center mt-1 text-xs">
                <span className="text-cyan-600">
                  <Maximize2 className="h-3 w-3 inline mr-1" />
                  {formatCurrency(maxPositionValue)}
                </span>
                <span className="text-slate-500 dark:text-slate-400 ml-1">posición más alta</span>
              </div>
            </div>
            <div className="flex-shrink-0 bg-cyan-100 dark:bg-cyan-900/30 p-2 rounded-md">
              <Calculator className="h-6 w-6 text-cyan-600 dark:text-cyan-400" />
            </div>
          </div>
        </div>

        {/* Tarjeta 8: Riesgo de Pérdida Impermanente */}
        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-start justify-between">
            <div className="flex-1 mr-3">
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Riesgo IL</p>
              <div className="mt-1 space-y-1">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                    <span className="text-sm">Bajo</span>
                  </div>
                  <span className="text-sm font-medium">
                    {lowRiskPositions}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-yellow-500 mr-2"></div>
                    <span className="text-sm">Medio</span>
                  </div>
                  <span className="text-sm font-medium">
                    {mediumRiskPositions}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-red-500 mr-2"></div>
                    <span className="text-sm">Alto</span>
                  </div>
                  <span className="text-sm font-medium">
                    {highRiskPositions}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex-shrink-0 bg-rose-100 dark:bg-rose-900/30 p-2 rounded-md">
              <AlertTriangle className="h-6 w-6 text-rose-600 dark:text-rose-400" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlobalPositionStats;