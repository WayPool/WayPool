import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useWallet } from "@/hooks/use-wallet";
import { useUserNFTs } from "@/hooks/use-nfts";
import { usePositions } from "@/hooks/use-positions";
import { Wallet, Layers, Cog, CreditCard, ArrowRight, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "@/hooks/use-translation";
import { APP_NAME } from "@/utils/app-config";
import { dashboardTranslations } from "@/translations/dashboard";

interface PoolYield {
  poolName: string;
  totalAmount: string;  // Monto total (capital + beneficios)
}

interface PositionFlowData {
  tokenId: string;
  imageUrl: string;
  yields: PoolYield[];
  hasActiveNfts: boolean;
}

// Este estado no se usa y lo eliminamos para evitar confusiones
// Únicamente trabajamos con poolCapitalStates y poolYieldStates

// Estado global para mantener los valores anteriores y asegurar transiciones suaves
// Usamos any para evitar errores de tipado en esta etapa
// y permitir que el dashboard se cargue correctamente
const poolStates: any = {};

// Genera distribuciones para pools usando datos dinámicos de la página /pools
const generateRandomYields = (baseAmount: number, tokenId: string = "default", pools: any[] = []): PoolYield[] => {
  // Si no hay suficientes pools disponibles, fallback a los valores de captura de pantalla
  if (!pools || pools.length < 2) {
    const fallbackPoolNames = ["USDC/ETH", "USDT/ETH", "DAI/MATIC", "WETH/MATIC"];
    const fallbackAmounts = [42177.86, 1901.81, 8943.30, 10196.97];
    
    // Calculamos un factor de escala para ajustar al baseAmount total
    const totalFallbackAmount = fallbackAmounts.reduce((sum, amount) => sum + amount, 0);
    const scaleFactor = baseAmount / totalFallbackAmount;
    
    // Calculamos el monto para Delta Neutral (7.3% del monto mayor)
    const maxAmount = Math.max(...fallbackAmounts);
    const deltaNeutralAmount = maxAmount * 0.073;
    
    // Devolvemos valores escalados según el baseAmount
    const yields = fallbackPoolNames.map((name, index) => ({
      poolName: name,
      totalAmount: `$${(fallbackAmounts[index] * scaleFactor).toFixed(2)}`
    }));
    
    // Añadimos el elemento Delta Neutral
    yields.push({
      poolName: "Delta Neutral",
      totalAmount: `$${(deltaNeutralAmount * scaleFactor).toFixed(2)}`
    });
    
    return yields;
  }
  
  // Usamos los pares reales de la página /pools (limitados a 4 para mantener la UI limpia)
  const poolPairs = pools.slice(0, 4).map(pool => {
    // Formamos un nombre de par legible usando token0Symbol y token1Symbol
    return {
      name: pool.displayName || `${pool.token0Symbol}/${pool.token1Symbol}`,
      address: pool.address
    };
  });
  
  // Extraemos solo los nombres de pares para usar como claves en poolStates
  const poolNames = poolPairs.map(pair => pair.name);
  
  // Distribuimos el monto base en proporciones según una tabla inicial
  // Distribución con proporciones similares a la captura: ~67%, ~3%, ~14%, ~16%
  const proportions = [0.67, 0.03, 0.14, 0.16].slice(0, poolNames.length);
  
  // Si tenemos menos de 4 pools, ajustamos las proporciones
  if (proportions.length < 4) {
    const remainingPortion = 1 - proportions.reduce((sum, p) => sum + p, 0);
    if (remainingPortion > 0 && proportions.length > 0) {
      // Distribuimos equitativamente el restante
      const extra = remainingPortion / proportions.length;
      proportions.forEach((_, i) => proportions[i] += extra);
    }
  }
  
  // Calculamos el monto para Delta Neutral (7.3% del pool con mayor valor)
  const maxIndex = proportions.indexOf(Math.max(...proportions));
  const maxPoolValue = baseAmount * proportions[maxIndex];
  const deltaNeutralAmount = maxPoolValue * 0.073;
  
  // Inicializar o resetear el estado si han cambiado los pools
  const now = Date.now();
  const poolStatesKey = poolNames.join('|'); // Usamos los nombres concatenados como clave
  
  if (!poolStates[tokenId] || !('poolStatesKey' in poolStates[tokenId]) || poolStates[tokenId].poolStatesKey !== poolStatesKey) {
    // Creamos un nuevo estado para estas pools
    poolStates[tokenId] = {
      lastUpdated: now,
      poolStatesKey: poolStatesKey,
      ...poolNames.reduce((acc, name, index) => {
        // Inicializamos con proporciones específicas del monto base
        acc[name] = baseAmount * (proportions[index] || 0.25); // 0.25 por defecto si no hay proporción
        return acc;
      }, {} as Record<string, number>)
    };
  } else if (baseAmount > 0) {
    // Solo aplicamos variaciones si hay un monto base positivo
    const UPDATE_INTERVAL = 15000; // 15 segundos entre actualizaciones sustanciales
    const MAX_VARIATION_PERCENT = 0.02; // Máximo 2% de variación para mantener proporciones similares
    
    const timeSinceLastUpdate = now - poolStates[tokenId].lastUpdated;
    const updatePercent = Math.min(1, timeSinceLastUpdate / UPDATE_INTERVAL);
    
    if (updatePercent > 0.2) { // Solo actualizar si ha pasado al menos 20% del intervalo
      // Mantener el total antes de la actualización
      let totalBeforeUpdate = 0;
      poolNames.forEach(name => {
        totalBeforeUpdate += poolStates[tokenId][name] || 0;
      });
      
      // Aplicamos pequeñas variaciones aleatorias para simular cambios en tiempo real
      poolNames.forEach((name, index) => {
        if (!poolStates[tokenId][name]) {
          poolStates[tokenId][name] = baseAmount * (proportions[index] || 0.25);
        }
        
        const currentValue = poolStates[tokenId][name];
        const maxChange = currentValue * MAX_VARIATION_PERCENT * updatePercent;
        const randomChange = (Math.random() * 2 - 1) * maxChange;
        
        // Aseguramos que el valor no sea negativo
        poolStates[tokenId][name] = Math.max(0.1, currentValue + randomChange);
      });
      
      // Normalizamos para mantener el monto base total
      let totalAfterUpdate = 0;
      poolNames.forEach(name => {
        totalAfterUpdate += poolStates[tokenId][name];
      });
      
      // Solo normalizar si hay diferencia significativa
      if (Math.abs(totalBeforeUpdate - totalAfterUpdate) > 0.01) {
        const normalizationFactor = totalBeforeUpdate / totalAfterUpdate;
        poolNames.forEach(name => {
          poolStates[tokenId][name] *= normalizationFactor;
        });
      }
      
      // Actualizar timestamp
      poolStates[tokenId].lastUpdated = now;
    }
  }
  
  // Almacenamos el estado de Delta Neutral si no existe
  if (!poolStates[tokenId]["Delta Neutral"]) {
    poolStates[tokenId]["Delta Neutral"] = deltaNeutralAmount;
  } else if (baseAmount > 0) {
    // Solo aplicamos variaciones si hay un monto base positivo y ha pasado tiempo suficiente
    const now = Date.now();
    const timeSinceLastUpdate = now - poolStates[tokenId].lastUpdated;
    const UPDATE_INTERVAL = 15000; // 15 segundos entre actualizaciones sustanciales
    const updatePercent = Math.min(1, timeSinceLastUpdate / UPDATE_INTERVAL);
    
    if (updatePercent > 0.2) { // Solo actualizar si ha pasado al menos 20% del intervalo
      // Aplicamos pequeñas variaciones aleatorias para simular cambios en tiempo real
      const MAX_VARIATION_PERCENT = 0.02; // Máximo 2% de variación
      const maxChange = poolStates[tokenId]["Delta Neutral"] * MAX_VARIATION_PERCENT * updatePercent;
      const randomChange = (Math.random() * 2 - 1) * maxChange;
      poolStates[tokenId]["Delta Neutral"] = Math.max(0.1, poolStates[tokenId]["Delta Neutral"] + randomChange);
    }
  }
  
  // Devolver los datos formateados para mostrar, incluyendo Delta Neutral
  const yields = poolNames.map(name => ({
    poolName: name,
    totalAmount: `$${(poolStates[tokenId][name] || 0).toFixed(2)}`
  }));
  
  // Añadimos el elemento Delta Neutral
  yields.push({
    poolName: "Delta Neutral",
    totalAmount: `$${poolStates[tokenId]["Delta Neutral"].toFixed(2)}`
  });
  
  return yields;
};

// Genera proporciones con la distribución específica requerida de 67%, 3%, 14%, 16%
const generateInitialProportions = (count: number): number[] => {
  // Distribución específica requerida: 67%, 3%, 14%, 16%
  const fixedProportions = [0.67, 0.03, 0.14, 0.16];
  
  // Verificar que el número de pools coincida con nuestras proporciones predefinidas
  if (count === fixedProportions.length) {
    return fixedProportions;
  }
  
  // Si el número de pools no coincide, implementamos una lógica de fallback
  // que distribuye el capital de forma más equitativa
  const values: number[] = [];
  let remaining = 1.0;
  
  // Generar valores aleatorios excepto para el último
  for (let i = 0; i < count - 1; i++) {
    // Asegurar una distribución razonable
    const maxProportion = remaining * 0.6; // No tomar más del 60% de lo que queda
    const proportion = Math.random() * maxProportion;
    values.push(proportion);
    remaining -= proportion;
  }
  
  // El último valor es lo que queda
  values.push(remaining);
  
  return values;
};

// Genera distribuciones estáticas para NFTs inactivos (en rojo y sin movimiento)
const generateStaticYields = (baseAmount: number, pools: any[] = []): PoolYield[] => {
  // Si no hay suficientes pools disponibles, fallback a los valores de captura de pantalla
  if (!pools || pools.length < 2) {
    const fallbackPoolNames = ["USDC/ETH", "USDT/ETH", "DAI/MATIC", "WETH/MATIC"];
    const fallbackAmounts = [42177.86, 1901.81, 8943.30, 10196.97];
    
    // Calculamos un factor de escala para ajustar al baseAmount total
    const totalFallbackAmount = fallbackAmounts.reduce((sum, amount) => sum + amount, 0);
    const scaleFactor = baseAmount / totalFallbackAmount;
    
    // Calculamos el monto para Delta Neutral (7.3% del monto mayor)
    const maxAmount = Math.max(...fallbackAmounts);
    const deltaNeutralAmount = maxAmount * 0.073;
    
    // Devolvemos valores escalados según el baseAmount
    const yields = fallbackPoolNames.map((name, index) => ({
      poolName: name,
      totalAmount: `$${(fallbackAmounts[index] * scaleFactor).toFixed(2)}`
    }));
    
    // Añadimos el elemento Delta Neutral
    yields.push({
      poolName: "Delta Neutral",
      totalAmount: `$${(deltaNeutralAmount * scaleFactor).toFixed(2)}`
    });
    
    return yields;
  }
  
  // Usamos los pares reales de la página /pools (limitados a 4 para mantener la UI limpia)
  const poolPairs = pools.slice(0, 4).map(pool => {
    // Formamos un nombre de par legible usando token0Symbol y token1Symbol
    return {
      name: pool.displayName || `${pool.token0Symbol}/${pool.token1Symbol}`,
      address: pool.address
    };
  });
  
  // Extraemos solo los nombres de pares para usar como claves
  const poolNames = poolPairs.map(pair => pair.name);
  
  // Distribución con proporciones similares a la captura: ~67%, ~3%, ~14%, ~16%
  const proportions = [0.67, 0.03, 0.14, 0.16].slice(0, poolNames.length);
  
  // Si tenemos menos de 4 pools, ajustamos las proporciones
  if (proportions.length < 4) {
    const remainingPortion = 1 - proportions.reduce((sum, p) => sum + p, 0);
    if (remainingPortion > 0 && proportions.length > 0) {
      // Distribuimos equitativamente el restante
      const extra = remainingPortion / proportions.length;
      proportions.forEach((_, i) => proportions[i] += extra);
    }
  }
  
  // Calculamos el monto para Delta Neutral (7.3% del pool con mayor valor)
  const maxIndex = proportions.indexOf(Math.max(...proportions));
  const maxPoolValue = baseAmount * proportions[maxIndex];
  const deltaNeutralAmount = maxPoolValue * 0.073;
  
  // Crear los objetos con el monto total en modo estático (sin animación)
  const yields = poolNames.map((name, index) => ({
    poolName: name,
    totalAmount: `$${(baseAmount * proportions[index]).toFixed(2)}`
  }));
  
  // Añadimos el elemento Delta Neutral
  yields.push({
    poolName: "Delta Neutral",
    totalAmount: `$${deltaNeutralAmount.toFixed(2)}`
  });
  
  return yields;
};

const NFTIcon: React.FC<{ imageUrl: string }> = ({ imageUrl }) => {
  // Si no hay imagen, usar un icono de Layers
  if (!imageUrl) {
    return (
      <div className="relative w-12 h-12 flex items-center justify-center">
        {/* Círculo de fondo con gradiente */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-400/40 via-fuchsia-500/30 to-pink-600/40 dark:from-purple-500/20 dark:via-fuchsia-600/15 dark:to-pink-700/20"></div>
        
        {/* Icono central */}
        <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center z-10 border border-purple-300 dark:border-purple-700 shadow-lg">
          <Layers className="h-5 w-5 text-purple-600 dark:text-purple-400" />
        </div>
      </div>
    );
  }

  // Si hay imagen, mostrarla en un círculo con un borde elegante
  return (
    <div className="relative w-12 h-12 flex items-center justify-center">
      {/* Círculo de fondo con gradiente */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-400/40 via-fuchsia-500/30 to-pink-600/40 dark:from-purple-500/20 dark:via-fuchsia-600/15 dark:to-pink-700/20"></div>
      
      {/* Imagen del NFT */}
      <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-purple-300 dark:border-purple-700 z-10 shadow-lg">
        <img src={imageUrl} alt="NFT" className="w-full h-full object-cover" />
      </div>
    </div>
  );
};

// Componente para el engranaje giratorio
const SpinningCog: React.FC = () => {
  return (
    <div className="relative w-12 h-12 flex items-center justify-center">
      {/* Círculo de fondo con gradiente */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-violet-400/40 via-indigo-500/30 to-purple-600/40 dark:from-violet-500/20 dark:via-indigo-600/15 dark:to-purple-700/20 animate-pulse-opacity"></div>
      
      {/* Engranaje rotativo */}
      <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center animate-spin-slow z-10 border border-indigo-300 dark:border-indigo-700 shadow-lg">
        <Cog className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
      </div>
    </div>
  );
};

// Componente para una fila de flujo de posición NFT
const NFTFlowRow: React.FC<{ 
  data: PositionFlowData;
  walletAddressShort: string;
  index: number;
}> = ({ data, walletAddressShort, index }) => {
  // Determinar si debe usar el tema rojo para los pools (sin NFTs activos)
  const useRedTheme = !data.hasActiveNfts;
  
  return (
    <div className={cn(
      "flex flex-col md:flex-row items-center justify-between gap-3 py-3 px-2 md:px-4",
      index > 0 && "border-t dark:border-slate-700"
    )}>
      {/* Flujo de wallet a algoritmo - primera sección */}
      <div className="w-full md:w-auto flex items-center gap-2 md:gap-4 justify-center md:justify-start mb-3 md:mb-0">
        {/* Wallet */}
        <div className="flex flex-col items-center justify-center">
          <div className="relative w-10 h-10 md:w-12 md:h-12 flex items-center justify-center">
            {/* Círculo de fondo con gradiente */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400/40 via-sky-500/30 to-cyan-600/40 dark:from-blue-500/20 dark:via-sky-600/15 dark:to-cyan-700/20"></div>
            
            {/* Icono de wallet */}
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center z-10 border border-blue-300 dark:border-blue-700 shadow-lg">
              <Wallet className="h-4 w-4 md:h-5 md:w-5 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <span className="text-xs mt-1 text-slate-600 dark:text-slate-400 font-mono hidden md:block">{walletAddressShort}</span>
        </div>
        
        {/* Flecha */}
        <ArrowRight className="h-3 w-3 md:h-4 md:w-4 text-slate-400 animate-pulse-opacity" />
        
        {/* NFT Position */}
        <div className="flex flex-col items-center justify-center">
          <div className="md:hidden">
            <NFTIcon imageUrl={data.imageUrl} />
          </div>
          <div className="hidden md:block">
            <NFTIcon imageUrl={data.imageUrl} />
          </div>
          <span className="text-xs mt-1 text-slate-600 dark:text-slate-400 font-mono hidden md:block">NFTs Uniswap</span>
        </div>
        
        {/* Flecha */}
        <ArrowRight className="h-3 w-3 md:h-4 md:w-4 text-slate-400 animate-pulse-opacity" />
        
        {/* Engranaje giratorio */}
        <div className="flex flex-col items-center justify-center">
          <div className="md:hidden">
            <div className="relative w-10 h-10 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-violet-400/40 via-indigo-500/30 to-purple-600/40 dark:from-violet-500/20 dark:via-indigo-600/15 dark:to-purple-700/20 animate-pulse-opacity"></div>
              <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center animate-spin-slow z-10 border border-indigo-300 dark:border-indigo-700 shadow-lg">
                <Cog className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <SpinningCog />
          </div>
          <span className="text-xs mt-1 text-slate-600 dark:text-slate-400 hidden md:block">{APP_NAME}</span>
        </div>
      </div>
      
      {/* Flecha central y línea divisoria para pantallas medianas y grandes */}
      <div className="flex items-center justify-center w-full md:w-auto md:flex-1">
        <div className="hidden md:block w-12 lg:w-24 h-px bg-slate-300 dark:bg-slate-600"></div>
        <ArrowRight className="h-4 w-4 md:h-5 md:w-5 text-slate-400 animate-pulse-opacity mx-1 md:mx-2" />
        <div className="hidden md:block w-12 lg:w-24 h-px bg-slate-300 dark:bg-slate-600"></div>
      </div>
      
      {/* Pools y rendimientos */}
      <div className="grid grid-cols-2 md:flex gap-2 md:gap-4 w-full md:w-auto justify-between md:justify-end">
        {data.yields.map((yieldItem, idx) => {
          // Verificar si es el elemento Delta Neutral (debería ser el último)
          const isDeltaNeutral = yieldItem.poolName === 'Delta Neutral';
          
          return (
            <div key={idx} className="flex flex-col items-center justify-center">
              <div className="relative w-10 h-10 md:w-12 md:h-12 flex items-center justify-center">
                {/* Círculo de fondo con gradiente - colores invertidos para Delta Neutral */}
                <div className={cn(
                  "absolute inset-0 rounded-full",
                  isDeltaNeutral
                    ? useRedTheme
                      ? "bg-gradient-to-br from-green-400/40 via-emerald-500/30 to-teal-600/40 dark:from-green-500/20 dark:via-emerald-600/15 dark:to-teal-700/20"
                      : "bg-gradient-to-br from-red-400/40 via-rose-500/30 to-red-600/40 dark:from-red-500/20 dark:via-rose-600/15 dark:to-red-700/20"
                    : useRedTheme 
                      ? "bg-gradient-to-br from-red-400/40 via-rose-500/30 to-red-600/40 dark:from-red-500/20 dark:via-rose-600/15 dark:to-red-700/20"
                      : "bg-gradient-to-br from-green-400/40 via-emerald-500/30 to-teal-600/40 dark:from-green-500/20 dark:via-emerald-600/15 dark:to-teal-700/20"
                )}></div>
                
                {/* Icono de tarjeta - colores invertidos para Delta Neutral */}
                <div className={cn(
                  "w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center z-10 shadow-lg",
                  isDeltaNeutral
                    ? useRedTheme
                      ? "bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700"
                      : "bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700"
                    : useRedTheme 
                      ? "bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700"
                      : "bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700"
                )}>
                  <CreditCard className={cn(
                    "h-4 w-4 md:h-5 md:w-5",
                    isDeltaNeutral
                      ? useRedTheme
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                      : useRedTheme 
                        ? "text-red-600 dark:text-red-400"
                        : "text-green-600 dark:text-green-400"
                  )} />
                </div>
              </div>
              <span className="text-xs mt-0.5 md:mt-1 text-slate-600 dark:text-slate-400">{yieldItem.poolName}</span>
              <span className={cn(
                "text-xs font-medium",
                isDeltaNeutral
                  ? useRedTheme
                    ? "text-green-600"
                    : "text-red-600"
                  : useRedTheme 
                    ? "text-red-600" 
                    : "text-green-600"
              )}>{yieldItem.totalAmount}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const NFTFlowProcess: React.FC = () => {
  const { t, language } = useTranslation();
  const { address } = useWallet();
  const { data: nfts = [], isLoading: isLoadingNfts } = useUserNFTs();
  const { dbPositions, isLoadingPositions, totalLiquidityValueRaw } = usePositions();
  const [positionFlowData, setPositionFlowData] = useState<PositionFlowData[]>([]);
  
  // Obtener las pools desde la API
  const { data: pools = [], isLoading: isLoadingPools } = useQuery({
    queryKey: ['/api/pools/custom'],
    queryFn: async () => {
      const response = await fetch('/api/pools/custom');
      if (!response.ok) throw new Error('Failed to fetch pools');
      return response.json();
    }
  });
  
  // Abreviatura de la dirección del wallet
  const walletAddressShort = address 
    ? `${address.substring(0, 4)}...${address.substring(address.length - 4)}`
    : "";
  
  // Efecto para montar los datos de posiciones NFT y establecer una actualización periódica
  useEffect(() => {
    // Si aún están cargando, no hacer nada
    if (isLoadingNfts || isLoadingPositions || isLoadingPools) return;
    
    // Iniciar procesamiento de datos de flujo
    
    // Función para actualizar los datos de flujo
    const updateFlowData = () => {
      // Verificar si hay NFTs activos
      // Al menos un NFT tiene el estado="Activo" (confirmación visual)
      const hasActiveNfts = nfts.some((nft: any) => nft.status === "Activo");
      
      // También verificar si hay posiciones marcadas como Active en la BD
      const hasActivePositions = dbPositions.some((pos: any) => 
        pos.status === "Active" || pos.status === "Activo"
      );
      
      // Si cualquiera de las dos condiciones es verdadera, consideramos que hay NFTs activos
      const hasAnyActiveNfts = hasActiveNfts || hasActivePositions;
      
      // Determinar si usar valores con movimiento (verde) o estáticos (rojo)
      // Usar el valor total de liquidez real del usuario + fees (comisiones) ganadas
      // Extraer las comisiones ganadas de las posiciones activas
      let totalLiquidityValue = 0;
      let totalFeesEarned = 0;
      
      // Sumar el valor de liquidez depositada y las comisiones ganadas de todas las posiciones activas
      dbPositions.forEach((position: any) => {
        if (position.status === "Active" || position.status === "Activo") {
          // Convertir a número y sumar el depósito inicial (depositedUSDC)
          const depositedValue = parseFloat(position.depositedUSDC) || 0;
          totalLiquidityValue += depositedValue;
          
          // Sumar las comisiones ganadas (feesEarned)
          totalFeesEarned += position.feesEarned || 0;
        }
      });
      
      // Si no hay posiciones activas, el valor debería ser 0
      if (totalLiquidityValue <= 0 && totalFeesEarned <= 0) {
        totalLiquidityValue = 0;
      } else {
        // Sumar el valor de liquidez y las comisiones
        totalLiquidityValue += totalFeesEarned;
      }
      
      // Usar valores verdes (animados) solo si hay NFTs activos
      // Usar valores rojos (estáticos) si no hay NFTs activos
      const useGreenValues = hasAnyActiveNfts;
      
      // Crear datos de flujo
      const flowData = [{
        tokenId: "default",
        imageUrl: "",
        yields: useGreenValues
          ? generateRandomYields(totalLiquidityValue, "default", pools)  // Con animación (verde)
          : generateStaticYields(totalLiquidityValue, pools),            // Sin animación (rojo)
        hasActiveNfts: useGreenValues
      }];
      
      setPositionFlowData(flowData);
    };
    
    // Inicialización inicial
    updateFlowData();
    
    // Configurar actualización periódica 
    let intervalId: NodeJS.Timeout | null = null;
    
    // Verificar si hay algún NFT activo
    const hasActiveNfts = nfts.some((nft: any) => nft.status === "Activo");
    const hasActivePositions = dbPositions.some((pos: any) => 
      pos.status === "Active" || pos.status === "Activo"
    );
    const hasAnyActiveNfts = hasActiveNfts || hasActivePositions;

    // Always update periodically if there's at least one active NFT
    if (hasAnyActiveNfts) {
      // There are active NFTs, update periodically
      intervalId = setInterval(() => {
        updateFlowData();
      }, 2000); // Update every 2 seconds for smooth animation
    }
    
    // Cleanup when unmounting
    return () => {
      if (intervalId !== null) {
        clearInterval(intervalId);
      }
    };
  }, [nfts, dbPositions, isLoadingNfts, isLoadingPositions, totalLiquidityValueRaw, pools]);
  
  // If loading or no data, show loading state
  if ((isLoadingNfts || isLoadingPositions || isLoadingPools) && !positionFlowData.length) {
    return (
      <Card className="mb-6">
        <CardContent className="p-6">
          <h3 className="text-lg font-medium mb-4">
            {t("nftPositionCreationTitle", "NFT Position Creation")}
          </h3>
          <div className="h-20 animate-pulse bg-slate-100 dark:bg-slate-800 rounded-lg"></div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="mb-6 overflow-hidden relative">
      {/* Fondo decorativo con gradiente sutil */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/30 via-transparent to-purple-50/30 dark:from-indigo-950/10 dark:via-transparent dark:to-purple-950/10 pointer-events-none"></div>
      
      <CardContent className="p-0 relative">
        <div className="bg-slate-50/80 dark:bg-slate-800/70 p-3 md:p-4 border-b dark:border-slate-700">
          <h3 className="text-base md:text-lg font-semibold flex items-center gap-2">
            <Layers className="h-4 w-4 md:h-5 md:w-5 text-indigo-500" />
            {dashboardTranslations[language]?.nftPositionCreationTitle || "NFT Position Creation"}
          </h3>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 md:line-clamp-none">
            {(dashboardTranslations[language]?.nftPositionCreationDescription || `When users add liquidity to ${APP_NAME}, the system generates NFT positions that represent your share in the managed pools.`).replace('{APP_NAME}', APP_NAME)}
          </p>
        </div>
        
        <div className="p-2">
          {positionFlowData.map((data, index) => (
            <NFTFlowRow 
              key={data.tokenId} 
              data={data} 
              walletAddressShort={walletAddressShort}
              index={index}
            />
          ))}
        </div>
        
        {/* Additional information at the bottom */}
        <div className="px-2 py-3 bg-slate-50/80 dark:bg-slate-800/70 border-t dark:border-slate-700 flex flex-col md:flex-row items-start md:items-center justify-between gap-2 md:gap-0">
          <div className="grid grid-cols-2 md:flex md:flex-row items-start md:items-center gap-1 md:gap-2 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center">
              <div className="w-2.5 h-2.5 md:w-3 md:h-3 bg-purple-500 rounded-full mr-1"></div>
              <span className="text-[10px] md:text-xs">{dashboardTranslations[language]?.nftPosition || "NFT Position"}</span>
            </div>
            <div className="flex items-center">
              <div className="w-2.5 h-2.5 md:w-3 md:h-3 bg-indigo-500 rounded-full mr-1"></div>
              <span className="text-[10px] md:text-xs">{dashboardTranslations[language]?.appAlgorithm || `${APP_NAME} Algorithm`}</span>
            </div>
            <div className="flex items-center">
              <div className="w-2.5 h-2.5 md:w-3 md:h-3 bg-green-500 rounded-full mr-1"></div>
              <span className="text-[10px] md:text-xs">{dashboardTranslations[language]?.yieldPools || "Yield Pools"}</span>
            </div>
            <div className="flex items-center">
              <div className="w-2.5 h-2.5 md:w-3 md:h-3 bg-red-500 rounded-full mr-1 animate-pulse"></div>
              <span className="text-[10px] md:text-xs">{dashboardTranslations[language]?.deltaNeutral || "Delta Neutral"}</span>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row items-center justify-end gap-2 w-full md:w-auto">
            <div className="text-[10px] md:text-xs text-slate-500 dark:text-slate-400 text-center">
              {t("realTimeLiquidityDistribution", "Real-time liquidity distribution")}
            </div>
            <Link href="/pools" className="inline-flex items-center px-2 py-1 text-[10px] md:text-xs rounded-md bg-primary/10 hover:bg-primary/20 text-primary transition-colors duration-200 border border-primary/20">
              <ExternalLink className="w-3 h-3 mr-1" />
              {t('View Pools')}
            </Link>
            <Link href="/how-it-works" className="inline-flex items-center px-2 py-1 text-[10px] md:text-xs rounded-md bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-500 transition-colors duration-200 border border-indigo-500/20">
              <ExternalLink className="w-3 h-3 mr-1" />
              {t('How It Works')}
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NFTFlowProcess;