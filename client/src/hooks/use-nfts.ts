import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useWallet } from "@/hooks/use-wallet";
import { ManagedNft } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import logger from "@/utils/logger";

// Definición de tipos para NFTs
export interface UniswapNFT {
  tokenId: string;
  contractAddress: string;
  network: string;
  token0Symbol: string;
  token1Symbol: string;
  fee: string;
  feeTier?: string; // Campo para el fee real extraído de la descripción
  feeAmount?: string; // Campo alternativo para el fee
  poolAddress?: string;
  poolValue?: string;
  inRange?: boolean;
  status?: string;
  version?: string;
  imageUrl?: string; // URL de la imagen del NFT
  title?: string; // Título del NFT que puede contener información del par
  description?: string; // Descripción del NFT que puede contener información del par
  poolName?: string; // Nombre del pool que puede contener información del par
  metadata?: {
    token0Symbol?: string;
    token1Symbol?: string;
    fee?: string;
    feeTier?: string;
    poolAddress?: string;
    [key: string]: any; // Para aceptar otras propiedades de metadatos
  };
  listing?: {
    price?: string;
    priceUsd?: string;
    marketplace?: string;
    isListed: boolean;
  };
  [key: string]: any; // Para aceptar propiedades dinámicas de los NFTs
}

export interface NFTDetails extends UniswapNFT {
  poolManagerAddress?: string;
  description?: string;
  walletAddress?: string;
  estimatedValue?: string;
  marketplaceStatus?: {
    isListed: boolean;
    price?: string;
    marketplace?: string;
  };
}

/**
 * Hook simplificado para obtener todos los NFTs del usuario conectado
 * Esta versión trae los NFTs reales y actualiza su estado si están activados
 */
export function useUserNFTs() {
  const { address, account } = useWallet();
  
  // Usamos tanto address como account para mayor compatibilidad
  const walletAddress = address || account || localStorage.getItem('walletAddress');

  // Verificamos si el usuario es administrador
  const isAdmin = localStorage.getItem('isAdmin') === 'true' || sessionStorage.getItem('isAdmin') === 'true';
  
  // Obtenemos los NFTs de blockchain
  return useQuery({
    queryKey: ["nfts", walletAddress],
    staleTime: 0, // Forzar actualización inmediata
    cacheTime: 0, // No mantener en caché para datos auténticos
    queryFn: async () => {
      if (!walletAddress) {
        logger.info('No wallet address available, returning empty NFT array');
        return [];
      }
      
      try {
        // Configurar cabeceras personalizadas
        const customHeaders: Record<string, string> = {};
        
        if (isAdmin) {
          customHeaders['x-is-admin'] = 'true';
        }
        
        if (walletAddress) {
          customHeaders['x-wallet-address'] = walletAddress;
        }
        
        // 1. Obtener NFTs REALES de la blockchain del usuario
        const nftsResponse = await apiRequest<UniswapNFT[]>(
          'GET',
          `/api/nfts/blockchain/${walletAddress}`, // NFTs reales de blockchain
          undefined,
          { headers: customHeaders }
        );

        const blockchainNfts = nftsResponse || [];
        logger.info(`Blockchain NFTs fetched (${blockchainNfts.length}):`, blockchainNfts.map(n => n.tokenId));
        
        // 2. Obtener información de estados para los NFTs
        try {
          // Detectamos si el usuario es administrador para usar el enfoque correspondiente
          if (isAdmin) {
            // ENFOQUE PARA ADMINISTRADORES: Obtener todos los NFTs administrados
            logger.info('Usuario es admin. Usando endpoint de administrador para estados de NFTs');
            
            const managedNftsResponse = await apiRequest<ManagedNft[]>(
              'GET',
              '/api/admin/managed-nfts',
              undefined,
              { headers: customHeaders }
            );
            
            const managedNfts = managedNftsResponse || [];
            logger.info(`Managed NFTs fetched successfully (${managedNfts.length}):`, managedNfts);
            
            logger.info('Filtrando NFTs para wallet:', walletAddress.toLowerCase());
            
            // 3. SOLO mostrar los NFTs que existen en blockchain pero aplicando estados de la base de datos
            if (blockchainNfts.length > 0) {
              // Función para normalizar tokenIds para comparación
              const normalizeTokenId = (id: string | undefined | null) => {
                if (!id) return '';
                // Eliminar ceros a la izquierda si es un número
                return id.toString().replace(/^0+/, '');
              };
              
              // Función para comparar networks con mayor flexibilidad
              const networksMatch = (network1: string | undefined | null, network2: string | undefined | null) => {
                if (!network1 || !network2) return true; // Si alguna es indefinida, consideramos que coinciden
                
                const net1 = network1.toLowerCase();
                const net2 = network2.toLowerCase();
                
                // Comparación directa
                if (net1 === net2) return true;
                
                // Comparaciones alternativas conocidas
                if ((net1 === 'ethereum' && net2 === 'mainnet') || 
                    (net1 === 'mainnet' && net2 === 'ethereum')) return true;
                    
                if ((net1 === 'polygon' && net2 === 'matic') || 
                    (net1 === 'matic' && net2 === 'polygon')) return true;
                    
                return false;
              };
              
              // Para cada NFT real de blockchain, buscar información en managedNfts
              return blockchainNfts.map(nft => {
                // Si hay NFTs administrados, buscar coincidencia
                if (managedNfts.length > 0) {
                  const managedNft = managedNfts.find(
                    managed => {
                      // Normalizar tokenIds para la comparación
                      const nftTokenIdNormalized = normalizeTokenId(nft.tokenId);
                      const managedTokenIdNormalized = normalizeTokenId(managed.tokenId);
                      
                      const tokenIdMatches = nftTokenIdNormalized === managedTokenIdNormalized;
                      
                      // Comparación más flexible de redes
                      const networkMatches = networksMatch(managed.network, nft.network);
                      
                      return tokenIdMatches && networkMatches;
                    }
                  );
                  
                  // Si existe, actualizar el estado del NFT
                  if (managedNft) {
                    logger.info(`✅ Admin: Aplicando estado "${managedNft.status}" al NFT #${nft.tokenId} (DB ID: ${managedNft.id})`);
                    return {
                      ...nft,
                      walletAddress: walletAddress, // CRÍTICO: Asignar wallet del usuario
                      status: managedNft.status || nft.status || 'Unknown',
                      valueUsdc: managedNft.valueUsdc || '0.00',
                      managedId: managedNft.id
                    };
                  }
                }

                // Si no existe un estado en la base de datos, inferir estado inteligente
                let inferredStatus = 'Inactive';

                // Si el NFT tiene información básica válida, marcar como activo
                if (nft.fee && nft.token0Symbol && nft.token1Symbol &&
                    nft.token0Symbol !== 'Unknown' && nft.token1Symbol !== 'Unknown') {
                  inferredStatus = 'Active';
                }

                return {
                  ...nft,
                  walletAddress: walletAddress, // CRÍTICO: Asignar wallet del usuario
                  status: inferredStatus,
                  valueUsdc: '0.00',
                };
              });
            }
          } else {
            // ENFOQUE PARA USUARIOS NORMALES: Usar el endpoint público para cada NFT
            logger.info('Usuario normal. Usando endpoint público para estados de NFTs');
            
            // Procesamos cada NFT uno por uno para obtener su estado
            const nftsWithStatus = await Promise.all(blockchainNfts.map(async (nft) => {
              try {
                // 🔍 LOG ESPECÍFICO PARA NFT #277909
                if (nft.tokenId === "277909") {
                  console.log(`🔍 HOOK: NFT #277909 DATOS ORIGINALES:`, {
                    tokenId: nft.tokenId,
                    token0Symbol: nft.token0Symbol,
                    token1Symbol: nft.token1Symbol,
                    fee: nft.fee,
                    network: nft.network
                  });
                }
                
                logger.debug(`Consultando estado público para NFT #${nft.tokenId} en red ${nft.network || 'ethereum'}`);
                
                // Usar el nuevo endpoint público para obtener el estado
                const response = await fetch(`/api/public/nft-status/${nft.tokenId}?network=${nft.network || 'ethereum'}`);
                
                if (response.ok) {
                  const statusData = await response.json();
                  logger.debug(`Estado para NFT #${nft.tokenId}:`, statusData);

                  if (statusData.found) {
                    logger.info(`✅ Usuario: NFT #${nft.tokenId} tiene estado "${statusData.status}" y valor ${statusData.valueUsdc}`);
                    return {
                      ...nft,
                      walletAddress: walletAddress, // CRÍTICO: Asignar wallet del usuario
                      status: statusData.status || 'Unknown',
                      valueUsdc: statusData.valueUsdc || '0.00'
                    };
                  }
                }

                // Si no hay datos o hay error, devolver con estado Unknown
                return {
                  ...nft,
                  walletAddress: walletAddress, // CRÍTICO: Asignar wallet del usuario
                  status: 'Unknown',
                  valueUsdc: '0.00'
                };
              } catch (error) {
                logger.error(`Error obteniendo estado para NFT #${nft.tokenId}:`, error);
                return {
                  ...nft,
                  walletAddress: walletAddress, // CRÍTICO: Asignar wallet del usuario
                  status: 'Unknown',
                  valueUsdc: '0.00'
                };
              }
            }));

            return nftsWithStatus;
          }
        } catch (error) {
          logger.error('Error fetching NFT states:', error);
          // Si hay error, simplemente usamos los NFTs de blockchain sin estados
        }

        // Si no pudimos obtener estados, al menos devolver NFTs de blockchain con walletAddress
        return blockchainNfts.map(nft => ({
          ...nft,
          walletAddress: walletAddress
        }));
      } catch (error) {
        logger.error(`Error fetching NFTs:`, error);
        
        // En caso de error, intentamos directamente con fetch como fallback
        try {
          logger.info(`Attempting fallback fetch for NFTs...`);
          const headers: Record<string, string> = {
            'Content-Type': 'application/json'
          };

          if (isAdmin) headers['x-is-admin'] = 'true';
          if (walletAddress) headers['x-wallet-address'] = walletAddress;

          const fallbackResponse = await fetch(`/api/nfts/blockchain/${walletAddress}`, {
            method: 'GET',
            headers
          });
          
          if (fallbackResponse.ok) {
            const data = await fallbackResponse.json();
            logger.info(`Fallback NFT fetch succeeded:`, data);
            // Asignar walletAddress a cada NFT del fallback
            return (data || []).map((nft: any) => ({
              ...nft,
              walletAddress: walletAddress
            }));
          }
        } catch (fallbackError) {
          console.error(`Fallback fetch also failed:`, fallbackError);
        }

        return []; // Devolvemos un array vacío en caso de error total
      }
    },
    enabled: !!walletAddress,
    retry: 2,
    // ANTI-CACHE: Configuración agresiva para datos siempre frescos
    staleTime: 0,
    gcTime: 30000,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchInterval: 60000 // Refetch cada 60 segundos
  });
}

/**
 * Hook para obtener detalles específicos de un NFT
 */
export function useNFTDetails(tokenId: string, network: string = "ethereum", contractAddress?: string) {
  const { address, account } = useWallet();
  
  // Usamos tanto address como account para mayor compatibilidad
  const walletAddress = address || account || localStorage.getItem('walletAddress');
  
  return useQuery({
    queryKey: ["nft-details", tokenId, network, contractAddress, walletAddress],
    queryFn: async () => {
      if (!tokenId) {
        console.log('No token ID provided for NFT details');
        return null;
      }
      
      if (!walletAddress) {
        console.log('No wallet address available for NFT details');
        return null;
      }
      
      console.log(`Obteniendo detalles para NFT #${tokenId} en red ${network}${contractAddress ? `, contrato ${contractAddress}` : ''}`);
      
      // Construir la URL incluyendo el contrato si está disponible
      const url = `/api/nfts/details/${tokenId}?network=${network}${contractAddress ? `&contractAddress=${contractAddress}` : ''}`;
      
      try {
        const response = await apiRequest<NFTDetails>(
          'GET',
          url
        );
        
        console.log(`Respuesta de detalles NFT #${tokenId}:`, response);
        return response;
      } catch (error) {
        console.error(`Error fetching NFT details:`, error);
        // En caso de error, intentamos directamente con fetch
        try {
          console.log(`Attempting fallback fetch for NFT details...`);
          const fallbackResponse = await fetch(url);
          if (fallbackResponse.ok) {
            const data = await fallbackResponse.json();
            console.log(`Fallback NFT details fetch succeeded:`, data);
            return data || null;
          }
        } catch (fallbackError) {
          console.error(`Fallback fetch also failed:`, fallbackError);
        }
        return null;
      }
    },
    enabled: !!tokenId && !!walletAddress,
    // ANTI-CACHE: Configuración para datos frescos
    staleTime: 0,
    gcTime: 30000,
    retry: 2,
    refetchOnWindowFocus: true,
    refetchOnMount: true
  });
}

/**
 * Hook para obtener información de listado (marketplace) de un NFT
 */
export function useNFTListingInfo(tokenId: string, network: string = "ethereum") {
  const { address, account } = useWallet();
  
  // Usamos tanto address como account para mayor compatibilidad
  const walletAddress = address || account || localStorage.getItem('walletAddress');
  
  return useQuery({
    queryKey: ["nft-listing", tokenId, network, walletAddress],
    queryFn: async () => {
      if (!tokenId) {
        console.log('No token ID provided for NFT listing info');
        return null;
      }
      
      if (!walletAddress) {
        console.log('No wallet address available for NFT listing info');
        return null;
      }
      
      try {
        const response = await apiRequest<{
          isListed: boolean;
          price?: string;
          priceUsd?: string;
          marketplace?: string;
        }>(
          'GET',
          `/api/nfts/listings/${tokenId}?network=${network}`
        );
        
        console.log(`Información de listado para NFT #${tokenId}:`, response);
        return response;
      } catch (error) {
        console.error(`Error fetching NFT listing info:`, error);
        // En caso de error, intentamos directamente con fetch
        try {
          console.log(`Attempting fallback fetch for NFT listing...`);
          const fallbackResponse = await fetch(`/api/nfts/listings/${tokenId}?network=${network}`);
          if (fallbackResponse.ok) {
            const data = await fallbackResponse.json();
            console.log(`Fallback NFT listing fetch succeeded:`, data);
            return data || null;
          }
        } catch (fallbackError) {
          console.error(`Fallback fetch also failed:`, fallbackError);
        }
        return null;
      }
    },
    enabled: !!tokenId && !!walletAddress,
    // ANTI-CACHE: Configuración para datos frescos
    staleTime: 0,
    gcTime: 30000,
    retry: 2,
    refetchOnWindowFocus: true,
    refetchOnMount: true
  });
}

/**
 * Hook para obtener los NFTs administrados (para admin y usuarios normales)
 */
export function useManagedNFTs() {
  const { address, account } = useWallet();
  
  // Usamos tanto address como account para mayor compatibilidad
  const walletAddress = address || account || localStorage.getItem('walletAddress');
  
  // Verificamos si el usuario es administrador
  const isAdmin = localStorage.getItem('isAdmin') === 'true' || sessionStorage.getItem('isAdmin') === 'true';
  
  console.log('[useManagedNFTs] Iniciando hook - wallet address:', walletAddress, 'isAdmin:', isAdmin);
  
  return useQuery({
    queryKey: ["managed-nfts", walletAddress, isAdmin],
    queryFn: async () => {
      if (!walletAddress) {
        console.log('[useManagedNFTs] No wallet address available for managed NFTs');
        return [];
      }
      
      console.log(`[useManagedNFTs] Obteniendo NFTs administrados para ${walletAddress}, isAdmin=${isAdmin}`);
      try {
        // Configurar headers según el tipo de usuario
        const customHeaders: Record<string, string> = {};
        
        if (isAdmin) {
          customHeaders['x-is-admin'] = 'true';
        }
        
        if (walletAddress) {
          customHeaders['x-wallet-address'] = walletAddress;
        }
        
        // Elegir el endpoint correcto según el tipo de usuario
        const endpoint = isAdmin 
          ? '/api/admin/managed-nfts'
          : `/api/nfts/managed/${walletAddress}`;
        
        console.log(`[useManagedNFTs] Consultando endpoint: ${endpoint}`);
        
        const response = await apiRequest<ManagedNft[]>(
          'GET',
          endpoint,
          undefined,
          { headers: customHeaders }
        );
        
        console.log(`[useManagedNFTs] NFTs administrados obtenidos (${response?.length || 0}):`, response);
        return response || [];
      } catch (error) {
        console.error('[useManagedNFTs] Error al obtener NFTs administrados:', error);
        
        // Intento con fetch directo como fallback
        try {
          console.log(`[useManagedNFTs] Intentando fallback con fetch directo...`);
          
          // Configuración de headers para el fallback
          const headers: Record<string, string> = {
            'Content-Type': 'application/json'
          };
          
          if (isAdmin) {
            headers['x-is-admin'] = 'true';
          }
          
          if (walletAddress) {
            headers['x-wallet-address'] = walletAddress;
          }
          
          // Elegir el endpoint correcto según el tipo de usuario
          const endpoint = isAdmin 
            ? '/api/admin/managed-nfts'
            : `/api/nfts/managed/${walletAddress}`;
          
          const fallbackResponse = await fetch(endpoint, { 
            method: 'GET',
            headers
          });
          
          if (fallbackResponse.ok) {
            const data = await fallbackResponse.json();
            console.log(`[useManagedNFTs] Fallback exitoso, NFTs obtenidos:`, data);
            return data || [];
          }
        } catch (fallbackError) {
          console.error(`[useManagedNFTs] Fallback también falló:`, fallbackError);
        }
        return [];
      }
    },
    enabled: !!walletAddress, // Habilitado para todos los usuarios que tengan wallet
    // ANTI-CACHE: Configuración para datos frescos
    staleTime: 0,
    gcTime: 30000,
    retry: 2,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchInterval: 60000 // Refetch cada 60 segundos
  });
}

/**
 * Hook simplificado para activar un NFT
 * Simplemente cambia el estado del NFT real sin crear nada nuevo
 */
export function useActivateNFT() {
  const { address, account } = useWallet();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Usamos tanto address como account para mayor compatibilidad
  const walletAddress = address || account || localStorage.getItem('walletAddress');
  
  // Verificamos si el usuario es administrador
  const isAdmin = localStorage.getItem('isAdmin') === 'true' || sessionStorage.getItem('isAdmin') === 'true';
  
  // Mutación simplificada para cambiar el estado de un NFT
  return useMutation({
    mutationFn: async ({ 
      tokenId, 
      network, 
      status = "Active",
      valueUsdc = "0.00"
    }: { 
      tokenId: string; 
      network: string; 
      status?: string;
      valueUsdc?: string;
    }) => {
      console.log(`Activando NFT #${tokenId} en red ${network} con estado ${status}...`);
      
      if (!walletAddress) {
        throw new Error('No hay dirección de wallet disponible para activar el NFT');
      }
      
      if (!isAdmin) {
        throw new Error('Se requieren permisos de administrador para activar NFTs');
      }
      
      // Configuración básica de cabeceras
      const customHeaders: Record<string, string> = {
        'x-is-admin': 'true',
        'Content-Type': 'application/json'
      };
      
      if (walletAddress) {
        customHeaders['x-wallet-address'] = walletAddress;
      }
      
      try {
        // Buscamos si el NFT ya existe en la lista administrada
        console.log(`Verificando si el NFT #${tokenId} ya existe...`);
        const managedNfts = await apiRequest<ManagedNft[]>(
          'GET',
          '/api/admin/managed-nfts',
          undefined,
          { headers: customHeaders }
        );
        
        // Buscar coincidencia exacta por tokenId
        const existingNft = managedNfts?.find(nft => nft.tokenId === tokenId);
        
        if (existingNft) {
          // Si existe, simplemente actualizamos su estado
          console.log(`NFT #${tokenId} encontrado, actualizando estado a "${status}"...`);
          
          const response = await fetch(`/api/admin/managed-nfts/${existingNft.id}`, {
            method: 'PATCH',
            headers: customHeaders,
            credentials: 'include',
            body: JSON.stringify({
              status,
              valueUsdc
            })
          });
          
          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error al actualizar el NFT (${response.status}): ${errorText}`);
          }
          
          return await response.json();
        } else {
          // Si no existe, creamos un registro básico con los datos esenciales
          console.log(`NFT #${tokenId} no encontrado, registrando con estado "${status}"...`);
          
          const response = await fetch(`/api/admin/managed-nfts`, {
            method: 'POST',
            headers: customHeaders,
            credentials: 'include',
            body: JSON.stringify({
              tokenId,
              network,
              status,
              valueUsdc,
              walletAddress,
              createdBy: walletAddress
            })
          });
          
          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error al registrar el NFT (${response.status}): ${errorText}`);
          }
          
          return await response.json();
        }
      } catch (error) {
        console.error(`Error al activar NFT #${tokenId}:`, error);
        throw error;
      }
    },
    onSuccess: (data, variables) => {
      toast({
        title: "NFT activado correctamente",
        description: `NFT #${variables.tokenId} actualizado con estado "${variables.status || 'Active'}".`,
      });
      
      // Invalidamos todas las consultas relacionadas
      queryClient.invalidateQueries({ queryKey: ['/api/admin/managed-nfts'] });
      queryClient.invalidateQueries({ queryKey: ['nfts'] });
      
      // También invalidamos la caché de NFT específico
      queryClient.invalidateQueries({ 
        queryKey: ['nft-details', variables.tokenId] 
      });
    },
    onError: (error) => {
      toast({
        title: "Error al activar el NFT",
        description: `Ha ocurrido un error: ${error instanceof Error ? error.message : 'Error desconocido'}`,
        variant: "destructive"
      });
    }
  });
}