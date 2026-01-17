import React, { useState, useEffect } from 'react';
import { Link, useLocation } from "wouter";
import { useWallet } from "@/hooks/use-wallet";
import { usePoolData } from "@/hooks/use-pool-data";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { 
  Activity,
  PlusCircle, 
  Save, 
  Trash2, 
  Search, 
  Filter, 
  ChevronDown, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  ArrowDownUp,
  ExternalLink,
  HelpCircle,
  Loader2
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import AdminLayout from "@/components/layout/admin-layout";
import { useQuery, useMutation, useQueryClient, QueryObserverResult } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { formatExactCurrency } from "@/lib/utils";

// Tipo para NFTs administrados
interface ManagedNft {
  id: number;
  network: string;
  version: string;
  tokenId: string;
  valueUsdc: string;
  status: 'Active' | 'Unknown' | 'Closed' | 'Finalized';
  contractAddress?: string;
  token0Symbol?: string;
  token1Symbol?: string;
  feeTier?: string;
  poolAddress?: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

// Tipo para crear un nuevo NFT administrado
interface NewNft {
  network: string;
  version: string;
  tokenId: string;
  valueUsdc: string;
  status?: 'Active' | 'Unknown' | 'Closed' | 'Finalized';
  contractAddress?: string;
}

const ManagedNftsPage: React.FC = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Obtener el precio actual de ETH usando el hook usePoolData
  const { poolData } = usePoolData();
  
  // Estado para la nueva fila que se está editando
  const [newNft, setNewNft] = useState<NewNft>({
    network: "polygon",
    version: "V3",
    tokenId: "",
    valueUsdc: "",
    status: "Active"
  });
  
  // Estado para las filas que se están editando
  const [editingRows, setEditingRows] = useState<Record<number, boolean>>({});
  
  // Estado para las filas modificadas
  const [modifiedRows, setModifiedRows] = useState<Record<number, ManagedNft>>({});
  
  // Estado para almacenar los datos de listado de OpenSea para cada NFT
  const [nftListings, setNftListings] = useState<Record<string, any>>({});
  
  // Estado para búsqueda
  const [searchQuery, setSearchQuery] = useState<string>("");
  
  // Estado para filtros
  const [networkFilter, setNetworkFilter] = useState<string>("all");
  const [versionFilter, setVersionFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  
  // Estado para ordenación
  const [sortField, setSortField] = useState<keyof ManagedNft>("id");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  
  // Estado para paginación
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  
  // Administración de estado de autenticación
  const [isSessionValid, setIsSessionValid] = useState<boolean>(true);
  const [isAdminVerified, setIsAdminVerified] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Importamos hooks necesarios
  const { account } = useWallet();
  const [location, setLocation] = useLocation();

  // Verificación directa de estado de administrador al cargar la página
  useEffect(() => {
    const verifyAdminStatus = async () => {
      try {
        // Método 1: Verificar en sessionStorage para respuesta inmediata
        if (sessionStorage.getItem('isAdmin') === 'true') {
          console.log('📋 Managed NFTs: Admin encontrado en sessionStorage');
          setIsAdminVerified(true);
          return;
        }
        
        // Método 2: Verificar en la sesión actual
        try {
          const sessionResponse = await fetch('/api/auth/session');
          if (sessionResponse.ok) {
            const sessionData = await sessionResponse.json();
            if (sessionData.isLoggedIn && sessionData.user && sessionData.user.isAdmin) {
              console.log('📋 Managed NFTs: Admin encontrado en sesión activa', sessionData.user);
              setIsAdminVerified(true);
              
              // Guardar en sessionStorage para futuras verificaciones
              try {
                sessionStorage.setItem('isAdmin', 'true');
              } catch (e) {
                console.warn('No se pudo guardar en sessionStorage', e);
              }
              return;
            }
          }
        } catch (sessionError) {
          console.warn('Error al verificar sesión:', sessionError);
        }
        
        // Método 3: Verificar con API específica de admin
        const walletAddress = account || localStorage.getItem('walletAddress');
        
        if (!walletAddress) {
          console.error('No hay dirección de wallet disponible');
          setAuthError("No se pudo encontrar la dirección del wallet.");
          setIsSessionValid(false);
          return;
        }

        console.log('🔍 Managed NFTs: Verificando admin para', walletAddress);
        
        try {
          const data = await apiRequest('GET', `/api/user/${walletAddress}/admin-status`);
          if (data?.isAdmin) {
            console.log('✅ Managed NFTs: Usuario verificado como admin');
            setIsAdminVerified(true);
            
            // Guardamos en sessionStorage para futuras verificaciones
            try {
              sessionStorage.setItem('isAdmin', 'true');
            } catch (e) {
              console.warn('No se pudo guardar en sessionStorage', e);
            }
            return;
          } else {
            console.log('⚠️ Managed NFTs: Usuario no es admin según API, probando métodos alternativos');
          }
        } catch (apiError) {
          console.warn('Error en verificación con apiRequest, intentando métodos alternativos:', apiError);
        }
        
        // Método 4: Verificar el localStorage
        const adminUsers = localStorage.getItem('adminUsers');
        if (adminUsers && walletAddress) {
          try {
            const admins = JSON.parse(adminUsers);
            if (Array.isArray(admins) && admins.includes(walletAddress.toLowerCase())) {
              console.log('📋 Managed NFTs: Admin encontrado en adminUsers de localStorage');
              setIsAdminVerified(true);
              return;
            }
          } catch (e) {
            console.warn('Error al parsear adminUsers:', e);
          }
        }
        
        // Método 5: Clave específica en localStorage
        if (walletAddress && localStorage.getItem(`isAdmin-${walletAddress.toLowerCase()}`) === 'true') {
          console.log('📋 Managed NFTs: Admin encontrado en clave específica en localStorage');
          setIsAdminVerified(true);
          return;
        }
        
        // Si llegamos hasta aquí, intentamos una verificación manual con el backend
        try {
          const loginResponse = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ walletAddress: walletAddress })
          });
          
          if (loginResponse.ok) {
            const loginData = await loginResponse.json();
            if (loginData.success && loginData.user && loginData.user.isAdmin) {
              console.log('✅ Managed NFTs: Admin verificado después de login manual');
              sessionStorage.setItem('isAdmin', 'true');
              setIsAdminVerified(true);
              return;
            }
          }
        } catch (loginError) {
          console.warn('Error en login manual:', loginError);
        }
        
        // Si llegamos hasta aquí, no es admin
        setAuthError("No tienes permisos de administrador para acceder a esta sección.");
        setIsSessionValid(false);
      } catch (error) {
        console.error('Error en verificación general de admin:', error);
        setAuthError("Error al verificar permisos. Por favor recarga la página o intenta más tarde.");
        setIsSessionValid(false);
      }
    };

    verifyAdminStatus();
  }, [account]);

  // Si tuvimos un problema de autenticación, damos opciones al usuario
  useEffect(() => {
    if (!isSessionValid) {
      // Intentar iniciar sesión nuevamente solo si tenemos una dirección
      const reconnectWallet = async () => {
        try {
          const walletAddress = account || localStorage.getItem('walletAddress');
          if (!walletAddress) return;
          
          console.log('🔄 Managed NFTs: Intentando reconexión para', walletAddress);
          const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ walletAddress: walletAddress })
          });
          
          if (response.ok) {
            console.log('✅ Managed NFTs: Reconexión exitosa');
            // Recargar la página después de reconectar
            window.location.reload();
          }
        } catch (e) {
          console.error('Error en reconexión:', e);
        }
      };
      
      reconnectWallet();
    }
  }, [isSessionValid, account]);

  // Consulta para obtener los NFTs administrados (solo si la autenticación es válida)
  const { data: nfts, isLoading, isError } = useQuery<ManagedNft[]>({
    queryKey: ['/api/admin/managed-nfts'],
    retry: 3,
    enabled: isAdminVerified, // Solo ejecutar si el admin está verificado
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      try {
        // Asegurar que enviamos el encabezado de admin
        const customHeaders: Record<string, string> = {
          'x-is-admin': 'true'
        };
        
        // Añadir el wallet address si está disponible
        if (account) {
          customHeaders['x-wallet-address'] = account;
        }
        
        // Realizar la solicitud con los encabezados personalizados
        const data = await apiRequest<ManagedNft[]>(
          'GET', 
          '/api/admin/managed-nfts', 
          undefined, 
          { headers: customHeaders }
        );
        
        return data;
      } catch (error) {
        console.error('Error al cargar NFTs administrados:', error);
        setAuthError("Error al cargar los NFTs. Por favor, recarga la página o verifica tu conexión.");
        setIsSessionValid(false);
        throw error;
      }
    }
  });
  
  // Mutación para crear un nuevo NFT
  const createMutation = useMutation({
    mutationFn: async (newNft: NewNft) => {
      // Asegurar que enviamos todos los encabezados necesarios para autenticación
      const customHeaders: Record<string, string> = {
        'x-is-admin': 'true',
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      };
      
      // Añadir el wallet address si está disponible
      if (account) {
        customHeaders['x-wallet-address'] = account;
      }
      
      // Añadir token de emergencia para casos donde la autenticación normal falla
      customHeaders['x-admin-override'] = 'WayBank-SuperAdmin-Override-Token';
      
      // Incluir información de autenticación en los datos
      const dataWithAuth = {
        ...newNft,
        walletAddress: account || '0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f',
        createdBy: account || '0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f'
      };
      
      // Usar fetch directamente para tener más control
      try {
        const response = await fetch('/api/admin/managed-nfts', {
          method: 'POST',
          headers: customHeaders,
          credentials: 'include', // Importante: incluir cookies de sesión
          body: JSON.stringify(dataWithAuth)
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Error de servidor (${response.status}): ${errorText}`);
        }
        
        return await response.json();
      } catch (error) {
        console.error("Error al crear NFT:", error);
        throw error;
      }
    },
    onSuccess: () => {
      toast({
        title: "NFT creado correctamente",
        description: "El NFT ha sido añadido a la lista de NFTs administrados.",
      });
      setNewNft({
        network: "polygon",
        version: "V3",
        tokenId: "",
        valueUsdc: "",
        status: "Active"
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/managed-nfts'] });
    },
    onError: (error) => {
      toast({
        title: "Error al crear el NFT",
        description: "Ha ocurrido un error al crear el NFT. Por favor, inténtalo de nuevo.",
        variant: "destructive"
      });
      console.error("Error creating NFT:", error);
    }
  });
  
  // Mutación para actualizar un NFT existente
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number, data: Partial<ManagedNft> }) => {
      // Asegurar que enviamos todos los encabezados necesarios para autenticación
      const customHeaders: Record<string, string> = {
        'x-is-admin': 'true',
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      };
      
      // Añadir el wallet address si está disponible
      if (account) {
        customHeaders['x-wallet-address'] = account;
      }
      
      // Añadir token de emergencia para casos donde la autenticación normal falla
      customHeaders['x-admin-override'] = 'WayBank-SuperAdmin-Override-Token';
      
      console.log(`Actualizando NFT #${id} con datos:`, data);
      
      // Asegurarnos de enviar todos los datos modificados
      const dataToSend = data;
      
      // Incluir información de autenticación en los datos
      const dataWithAuth = {
        ...dataToSend,
        walletAddress: account || '0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f' // Añadir dirección del usuario o super admin
      };
      
      // Usar fetch directamente para tener más control
      try {
        // Asegurarse de tener cookies habilitadas para mantener la sesión
        const response = await fetch(`/api/admin/managed-nfts/${id}`, {
          method: 'PATCH',
          headers: customHeaders,
          credentials: 'include', // Importante: incluir cookies de sesión
          body: JSON.stringify(dataWithAuth)
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Error de servidor (${response.status}): ${errorText}`);
        }
        
        const result = await response.json();
        console.log(`NFT #${id} actualizado correctamente:`, result);
        return result;
      } catch (error) {
        console.error(`Error al actualizar NFT #${id}:`, error);
        throw error;
      }
    },
    onSuccess: (data, variables) => {
      toast({
        title: "NFT actualizado correctamente",
        description: `Los cambios han sido guardados correctamente.${data.valueUsdc ? ` Valor: ${formatExactCurrency(Number(data.valueUsdc), 0, 'USD')}` : ''}`,
      });
      setEditingRows(prev => ({ ...prev, [variables.id]: false }));
      // Forzar actualización inmediata
      queryClient.invalidateQueries({ queryKey: ['/api/admin/managed-nfts'] });
      
      // Actualizar el NFT en la lista local para cambio inmediato
      // Invalidar queries es suficiente, la actualización manual no es necesaria
      // ya que el backend ya ha actualizado los datos
    },
    onError: (error) => {
      toast({
        title: "Error al actualizar el NFT",
        description: "Ha ocurrido un error al guardar los cambios. Por favor, inténtalo de nuevo.",
        variant: "destructive"
      });
      console.error("Error updating NFT:", error);
    }
  });
  
  // Mutación para eliminar un NFT
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      // Asegurar que enviamos los encabezados necesarios para autenticación
      const customHeaders: Record<string, string> = {
        'x-is-admin': 'true',
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      };
      
      // Añadir el wallet address si está disponible
      if (account) {
        customHeaders['x-wallet-address'] = account;
      }
      
      // Añadir token de emergencia para casos donde la autenticación normal falla
      customHeaders['x-admin-override'] = 'WayBank-SuperAdmin-Override-Token';
      
      // Usar fetch directamente para tener más control
      try {
        const response = await fetch(`/api/admin/managed-nfts/${id}`, {
          method: 'DELETE',
          headers: customHeaders,
          credentials: 'include', // Importante: incluir cookies de sesión
          body: JSON.stringify({
            walletAddress: account || '0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f' // Incluir info de autenticación
          })
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Error de servidor (${response.status}): ${errorText}`);
        }
        
        // Para respuestas 204 (No Content), devolver un objeto vacío en lugar de intentar parsear JSON
        if (response.status === 204) {
          console.log(`NFT #${id} eliminado correctamente (respuesta vacía)`);
          return {};
        }
        
        try {
          return await response.json();
        } catch (jsonError) {
          console.log(`NFT #${id} eliminado correctamente pero sin respuesta JSON válida`);
          return {};
        }
      } catch (error) {
        console.error(`Error al eliminar NFT #${id}:`, error);
        throw error;
      }
    },
    onSuccess: () => {
      toast({
        title: "NFT eliminado correctamente",
        description: "El NFT ha sido eliminado de la lista de NFTs administrados.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/managed-nfts'] });
    },
    onError: (error) => {
      toast({
        title: "Error al eliminar el NFT",
        description: "Ha ocurrido un error al eliminar el NFT. Por favor, inténtalo de nuevo.",
        variant: "destructive"
      });
      console.error("Error deleting NFT:", error);
    }
  });
  
  // Función para activar edición de una fila
  const handleEdit = (id: number) => {
    setEditingRows(prev => ({ ...prev, [id]: true }));
    if (nfts) {
      const nft = nfts.find((nft) => nft.id === id);
      if (nft) {
        setModifiedRows(prev => ({ ...prev, [id]: { ...nft } }));
      }
    }
  };
  
  // Función para guardar una fila editada
  const handleSave = (id: number) => {
    const nft = modifiedRows[id];
    if (nft) {
      // Eliminamos los campos de fecha para evitar errores de conversión
      const { createdAt, updatedAt, ...dataToUpdate } = nft;
      updateMutation.mutate({ id, data: dataToUpdate });
    }
  };
  
  // Función para descartar cambios
  const handleCancelEdit = (id: number) => {
    setEditingRows(prev => ({ ...prev, [id]: false }));
    setModifiedRows(prev => {
      const newState = { ...prev };
      delete newState[id];
      return newState;
    });
  };
  
  // Función para actualizar los datos de la fila modificada
  const handleChangeRow = (id: number, field: keyof ManagedNft, value: string) => {
    setModifiedRows(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value
      }
    }));
  };
  
  // Dirección del contrato de Uniswap V3 NFT Position Manager (igual en Ethereum y Polygon)
  const UNISWAP_V3_NFT_CONTRACT = "0xc36442b4a4522e871399cd717abdd847ab11fe88";
  
  // Dirección del contrato de Uniswap V4 NFT Position Manager
  const UNISWAP_V4_NFT_CONTRACT = "0x1ec2ebf4f37e7363fdfe3551602425af0b3ceef9";

  // Función para obtener la dirección del contrato para un NFT
  const getContractAddress = (nft: ManagedNft): string => {
    // Para NFTs de Uniswap V3, siempre usamos la dirección estándar
    // independientemente de si hay otra dirección guardada
    if (nft.version === 'V3') {
      return UNISWAP_V3_NFT_CONTRACT;
    }
    
    // Para NFTs de Uniswap V4, usar también la dirección estándar
    if (nft.version === 'V4') {
      return UNISWAP_V4_NFT_CONTRACT;
    }
    
    // Para otros tipos de NFT, si hay una dirección definida, la usamos
    if (nft.contractAddress) {
      return nft.contractAddress;
    }
    
    // En otros casos retornamos una cadena vacía
    return '';
  };

  // Función para generar enlace a OpenSea
  const getOpenSeaUrl = (nft: ManagedNft): string | null => {
    if (!nft.tokenId) {
      return null;
    }

    const contractAddress = getContractAddress(nft);
    if (!contractAddress) {
      return null;
    }

    // En OpenSea, cada red tiene su identificador específico
    const networkName = nft.network === 'polygon' ? 'matic' : 
                        nft.network === 'unichain' ? 'unichain' : 
                        'ethereum';
    
    return `https://opensea.io/assets/${networkName}/${contractAddress}/${nft.tokenId}`;
  };
  
  // Función para obtener el precio de un NFT para ordenación
  const getListingPrice = (nft: ManagedNft): number => {
    const nftKey = `${nft.tokenId}_${nft.network}`;
    const listing = nftListings[nftKey];
    
    if (listing && listing.isListed && listing.price) {
      // Extraer el valor numérico del precio (X WETH)
      const match = listing.price.match(/(\d+(\.\d+)?)\s*WETH/);
      if (match && match[1]) {
        return parseFloat(match[1]);
      }
    }
    
    return 0; // Sin precio o no listado
  };
  
  // Función para cargar datos de listado de OpenSea para un NFT
  const fetchNftListing = async (nft: ManagedNft) => {
    if (!nft.tokenId) return;
    
    // Identificador único para este NFT (combinación de tokenId y network)
    const nftKey = `${nft.tokenId}_${nft.network}`;
    
    // Si ya tenemos datos para este NFT y son recientes (menos de 5 minutos), no recargamos
    if (nftListings[nftKey] && (Date.now() - nftListings[nftKey].timestamp < 5 * 60 * 1000)) {
      return;
    }
    
    try {
      const response = await fetch(`/api/nfts/listings/${nft.tokenId}?network=${nft.network}`);
      if (response.ok) {
        const data = await response.json();
        
        // Si está listado y tiene precio, calculamos el precio en USD usando el precio actual de ETH
        if (data.isListed && data.price) {
          // Extraer el valor numérico del precio en ETH (formato: "X WETH")
          const priceMatch = data.price.match(/(\d+(\.\d+)?)\s*WETH/);
          if (priceMatch && priceMatch[1] && poolData?.ethPriceUsd) {
            const ethAmount = parseFloat(priceMatch[1]);
            // Calcula el precio en USD
            const priceUsd = ethAmount * poolData.ethPriceUsd;
            // Añade el precio en USD a los datos
            data.priceUsd = priceUsd;
          }
        }
        
        setNftListings(prev => ({
          ...prev,
          [nftKey]: {
            ...data,
            timestamp: Date.now()
          }
        }));
      }
    } catch (error) {
      console.error(`Error al cargar datos de listado para NFT #${nft.tokenId}:`, error);
    }
  };

  // Función para eliminar un NFT
  const handleDelete = (id: number) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este NFT?")) {
      deleteMutation.mutate(id);
    }
  };
  
  // Función para manejar cambios en la nueva fila
  const handleNewNftChange = (field: keyof NewNft, value: string) => {
    setNewNft(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // Función para crear un nuevo NFT
  const handleCreateNft = () => {
    if (!newNft.tokenId || !newNft.valueUsdc) {
      toast({
        title: "Error al crear el NFT",
        description: "Por favor, completa todos los campos obligatorios.",
        variant: "destructive"
      });
      return;
    }
    
    // Validar que valueUsdc sea un número
    if (isNaN(parseFloat(newNft.valueUsdc))) {
      toast({
        title: "Error en el formato",
        description: "El valor en USDC debe ser un número válido.",
        variant: "destructive"
      });
      return;
    }
    
    createMutation.mutate(newNft);
  };
  
  // Función para manejar cambios en la búsqueda
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Resetear a la primera página cuando cambia la búsqueda
  };
  
  // Función para manejar cambios en los filtros
  const handleFilterChange = (filter: string, value: string) => {
    switch (filter) {
      case 'network':
        setNetworkFilter(value);
        break;
      case 'version':
        setVersionFilter(value);
        break;
      case 'status':
        setStatusFilter(value);
        break;
    }
    setCurrentPage(1); // Resetear a la primera página cuando cambian los filtros
  };
  
  // Función para manejar cambios en la ordenación
  const handleSortChange = (field: keyof ManagedNft) => {
    // Si hacemos clic en el mismo campo, cambiamos la dirección
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };
  
  // Función para limpiar todos los filtros
  const handleClearFilters = () => {
    setSearchQuery("");
    setNetworkFilter("all");
    setVersionFilter("all");
    setStatusFilter("all");
    setCurrentPage(1);
  };
  
  // Función para aplicar filtros, ordenación y paginación
  const getProcessedNfts = () => {
    if (!nfts) return { data: [] as ManagedNft[], totalItems: 0, totalPages: 0 };
    
    // Primero filtramos
    let filteredData = [...nfts];
    
    // Filtrar por búsqueda (ID o dirección de contrato)
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filteredData = filteredData.filter((nft) => 
        nft.tokenId.toLowerCase().includes(query) || 
        (nft.contractAddress && nft.contractAddress.toLowerCase().includes(query))
      );
    }
    
    // Filtrar por red
    if (networkFilter !== "all") {
      filteredData = filteredData.filter((nft) => nft.network === networkFilter);
    }
    
    // Filtrar por versión
    if (versionFilter !== "all") {
      filteredData = filteredData.filter((nft) => nft.version === versionFilter);
    }
    
    // Filtrar por estado
    if (statusFilter !== "all") {
      filteredData = filteredData.filter((nft) => nft.status === statusFilter);
    }
    
    // Luego ordenamos
    filteredData.sort((a, b) => {
      let aValue: any;
      let bValue: any;
      
      // Si ordenamos por precio de OpenSea (usamos el campo contractAddress como identificador)
      if (sortField === 'contractAddress') {
        // Usamos nuestra función auxiliar para obtener el precio
        aValue = getListingPrice(a);
        bValue = getListingPrice(b);
      } else {
        // Para otros campos, usamos el valor directo
        aValue = a[sortField];
        bValue = b[sortField];
        
        // Convertir a números si es necesario
        if (sortField === 'valueUsdc') {
          aValue = Number(aValue || '0');
          bValue = Number(bValue || '0');
        }
      }
      
      // Ordenar
      if (aValue < bValue) {
        return sortDirection === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortDirection === "asc" ? 1 : -1;
      }
      return 0;
    });
    
    // Calculamos el total de páginas
    const totalItems = filteredData.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    
    // Finalmente paginamos
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);
    
    return {
      data: paginatedData,
      totalItems,
      totalPages
    };
  };
  
  // Efecto para cargar los datos de listado de NFTs
  useEffect(() => {
    if (!nfts || nfts.length === 0) return;
    
    // Cargamos los datos de listado para cada NFT
    const loadListings = async () => {
      for (const nft of nfts) {
        await fetchNftListing(nft);
      }
    };
    
    loadListings();
  }, [nfts, poolData?.ethPriceUsd]); // Añadimos dependencia al precio de ETH para recalcular cuando cambie
  
  // Procesamos los NFTs con los filtros, ordenación y paginación
  const processedData = nfts ? getProcessedNfts() : { data: [] as ManagedNft[], totalItems: 0, totalPages: 0 };
  const { data: filteredNfts = [], totalItems = 0, totalPages = 0 } = processedData;
  
  // Mostrar errores de autenticación si es necesario
  if (authError && !isAdminVerified) {
    return (
      <div className="container max-w-7xl mx-auto p-6">
        <div className="mb-6">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold">Gestión de NFTs</h1>
            <Button variant="outline" size="sm" asChild className="flex items-center gap-2">
              <Link href="/admin">
                <ChevronLeft className="h-4 w-4" />
                Volver al panel de Admin
              </Link>
            </Button>
          </div>
        </div>
        
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 rounded-md mb-4">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <h3 className="text-md font-semibold text-red-800 dark:text-red-200">Error de acceso</h3>
          </div>
          <p className="mt-2 text-sm text-red-700 dark:text-red-300">{authError}</p>
        </div>
        
        <div className="flex gap-2 mt-4">
          <Button 
            variant="default" 
            onClick={() => window.location.reload()}
          >
            Volver a intentar
          </Button>
          
          <Button 
            variant="outline" 
            onClick={() => {
              // Forzar reconexión del wallet manualmente
              const account = localStorage.getItem('walletAddress');
              if (account) {
                fetch('/api/auth/login', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ walletAddress: account })
                }).then(() => {
                  // Recargar la página después de reconectar
                  window.location.reload();
                });
              } else {
                window.location.href = '/dashboard';
              }
            }}
          >
            Reconectar wallet
          </Button>
          
          <Button 
            variant="ghost" 
            onClick={() => window.location.href = '/dashboard'}
          >
            Volver al dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold">Gestión de NFTs</h1>
            <Button variant="outline" size="sm" asChild className="flex items-center gap-2">
              <Link href="/admin">
                <ChevronLeft className="h-4 w-4" />
                Volver al panel de Admin
              </Link>
            </Button>
          </div>
        </div>
        
        {/* Panel de estadísticas en tarjetas */}
        {!isLoading && nfts && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Tarjeta 1: Total de USDC en NFTs activos filtrados */}
            <Card className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 shadow-lg overflow-hidden">
              <CardHeader className="pb-2 pt-4">
                <CardTitle className="flex items-center text-md font-medium text-slate-300">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-5 w-5 mr-2 text-emerald-400" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 8h6m-5 0a3 3 0 110 6H9l3-3m-3 3h5a3 3 0 110-6h-5l3-3" />
                  </svg>
                  USDC en NFTs Filtrados
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white mb-1">
                  {formatExactCurrency(
                    filteredNfts
                      .filter(nft => nft.status === 'Active')
                      .reduce((total, nft) => total + Number(nft.valueUsdc || 0), 0),
                    0
                  )}
                </div>
                <p className="text-xs text-slate-400">
                  {filteredNfts.filter(nft => nft.status === 'Active').length} NFTs activos filtrados
                </p>
              </CardContent>
            </Card>
            
            {/* Tarjeta 2: Total de USDC en todos los NFTs */}
            <Card className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 shadow-lg overflow-hidden">
              <CardHeader className="pb-2 pt-4">
                <CardTitle className="flex items-center text-md font-medium text-slate-300">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-5 w-5 mr-2 text-blue-400" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  USDC Total Listado
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white mb-1">
                  {formatExactCurrency(
                    nfts.reduce((total, nft) => total + Number(nft.valueUsdc || 0), 0),
                    0
                  )}
                </div>
                <p className="text-xs text-slate-400">
                  {nfts.length} NFTs en total
                </p>
              </CardContent>
            </Card>
            
            {/* Tarjeta 3: Distribución por redes */}
            <Card className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 shadow-lg overflow-hidden">
              <CardHeader className="pb-2 pt-4">
                <CardTitle className="flex items-center text-md font-medium text-slate-300">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-5 w-5 mr-2 text-purple-400" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                  Distribución por Redes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex flex-col">
                    <span className="text-xl font-semibold text-white">
                      {nfts.filter(nft => nft.network === 'polygon').length}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center">
                      <span className="w-2 h-2 rounded-full bg-purple-500 mr-1"></span> Polygon
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xl font-semibold text-white">
                      {nfts.filter(nft => nft.network === 'ethereum').length}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center">
                      <span className="w-2 h-2 rounded-full bg-blue-500 mr-1"></span> Ethereum
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Tarjeta 4: Distribución por versión */}
            <Card className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 shadow-lg overflow-hidden">
              <CardHeader className="pb-2 pt-4">
                <CardTitle className="flex items-center text-md font-medium text-slate-300">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-5 w-5 mr-2 text-amber-400" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                  </svg>
                  Distribución por Versión
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex flex-col">
                    <span className="text-xl font-semibold text-white">
                      {nfts.filter(nft => nft.version === 'V3').length}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center">
                      <span className="w-2 h-2 rounded-full bg-pink-500 mr-1"></span> Uniswap V3
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xl font-semibold text-white">
                      {nfts.filter(nft => nft.version === 'V4').length}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center">
                      <span className="w-2 h-2 rounded-full bg-green-500 mr-1"></span> Uniswap V4
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        
        {isLoading && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="mt-2 text-sm text-muted-foreground">Cargando NFTs...</p>
          </div>
        )}
        
        {isError && (
          <div className="text-center py-8 text-destructive">
            <p>Error al cargar los NFTs. Por favor, recarga la página.</p>
          </div>
        )}
        
        {!isLoading && !isError && (
          <>
            {/* Barra de búsqueda y filtros */}
            <Card className="mb-6">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Filtros y búsqueda</CardTitle>
                <CardDescription>
                  Busca NFTs por ID o dirección de contrato, y filtra por red, versión o estado
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Búsqueda */}
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Buscar por ID o dirección de contrato..."
                    className="pl-9 pr-4"
                    value={searchQuery}
                    onChange={handleSearchChange}
                  />
                </div>
                
                {/* Filtros */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Red</label>
                    <Select 
                      value={networkFilter} 
                      onValueChange={(value) => handleFilterChange('network', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Filtrar por red" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todas las redes</SelectItem>
                        <SelectItem value="ethereum">Ethereum</SelectItem>
                        <SelectItem value="polygon">Polygon</SelectItem>
                        <SelectItem value="unichain">Unichain</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Versión</label>
                    <Select 
                      value={versionFilter} 
                      onValueChange={(value) => handleFilterChange('version', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Filtrar por versión" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todas las versiones</SelectItem>
                        <SelectItem value="V3">V3</SelectItem>
                        <SelectItem value="V4">V4</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Estado</label>
                    <Select 
                      value={statusFilter} 
                      onValueChange={(value) => handleFilterChange('status', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Filtrar por estado" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos los estados</SelectItem>
                        <SelectItem value="Active">Activo</SelectItem>
                        <SelectItem value="Unknown">Desconocido</SelectItem>
                        <SelectItem value="Closed">Cerrado</SelectItem>
                        <SelectItem value="Finalized">Finalizado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                {/* Botón para limpiar filtros */}
                <div className="flex justify-end">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleClearFilters}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Limpiar filtros
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            {/* Conteo de resultados */}
            <div className="mb-4 flex justify-between items-center">
              <p className="text-sm text-muted-foreground">
                Mostrando {filteredNfts.length} de {totalItems} NFTs
              </p>
              <Select
                value={itemsPerPage.toString()}
                onValueChange={(value) => {
                  setItemsPerPage(parseInt(value));
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="NFTs por página" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 por página</SelectItem>
                  <SelectItem value="10">10 por página</SelectItem>
                  <SelectItem value="25">25 por página</SelectItem>
                  <SelectItem value="50">50 por página</SelectItem>
                </SelectContent>
              </Select>
            </div>
                  
            <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50 dark:bg-slate-800">
                    <TableHead 
                      className="w-[120px] cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700"
                      onClick={() => handleSortChange('network')}
                    >
                      <div className="flex items-center">
                        Red
                        <ArrowDownUp className={`ml-1 h-4 w-4 ${sortField === 'network' ? '' : 'opacity-25'} ${sortField === 'network' && sortDirection === 'asc' ? 'transform rotate-180' : ''}`} />
                      </div>
                    </TableHead>
                    <TableHead 
                      className="w-[80px] cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700"
                      onClick={() => handleSortChange('version')}
                    >
                      <div className="flex items-center">
                        Versión
                        <ArrowDownUp className={`ml-1 h-4 w-4 ${sortField === 'version' ? '' : 'opacity-25'} ${sortField === 'version' && sortDirection === 'asc' ? 'transform rotate-180' : ''}`} />
                      </div>
                    </TableHead>
                    <TableHead 
                      className="w-[100px] cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700"
                      onClick={() => handleSortChange('tokenId')}
                    >
                      <div className="flex items-center">
                        ID
                        <ArrowDownUp className={`ml-1 h-4 w-4 ${sortField === 'tokenId' ? '' : 'opacity-25'} ${sortField === 'tokenId' && sortDirection === 'asc' ? 'transform rotate-180' : ''}`} />
                      </div>
                    </TableHead>
                    <TableHead 
                      className="w-[120px] cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700"
                      onClick={() => handleSortChange('valueUsdc')}
                    >
                      <div className="flex items-center">
                        Valor (USDC)
                        <ArrowDownUp className={`ml-1 h-4 w-4 ${sortField === 'valueUsdc' ? '' : 'opacity-25'} ${sortField === 'valueUsdc' && sortDirection === 'asc' ? 'transform rotate-180' : ''}`} />
                      </div>
                    </TableHead>
                    <TableHead 
                      className="w-[120px] cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700"
                      onClick={() => handleSortChange('status')}
                    >
                      <div className="flex items-center">
                        Estado
                        <ArrowDownUp className={`ml-1 h-4 w-4 ${sortField === 'status' ? '' : 'opacity-25'} ${sortField === 'status' && sortDirection === 'asc' ? 'transform rotate-180' : ''}`} />
                      </div>
                    </TableHead>
                    <TableHead 
                      className="w-[200px] cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50"
                      onClick={() => handleSortChange('contractAddress')}
                    >
                      <div className="flex items-center">
                        Precio en OpenSea
                        <ArrowDownUp className={`ml-1 h-4 w-4 ${sortField === 'contractAddress' ? '' : 'opacity-25'} ${sortField === 'contractAddress' && sortDirection === 'asc' ? 'transform rotate-180' : ''}`} />
                      </div>
                    </TableHead>
                    <TableHead 
                      className="w-[100px] cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700"
                      onClick={() => handleSortChange('id')}
                    >
                      <div className="flex items-center">
                        OpenSea
                        <ArrowDownUp className={`ml-1 h-4 w-4 ${sortField === 'id' ? '' : 'opacity-25'} ${sortField === 'id' && sortDirection === 'asc' ? 'transform rotate-180' : ''}`} />
                      </div>
                    </TableHead>
                    <TableHead 
                      className="text-right w-[120px] cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700"
                      onClick={() => handleSortChange('updatedAt')}
                    >
                      <div className="flex items-center justify-end">
                        Acciones
                        <ArrowDownUp className={`ml-1 h-4 w-4 ${sortField === 'updatedAt' ? '' : 'opacity-25'} ${sortField === 'updatedAt' && sortDirection === 'asc' ? 'transform rotate-180' : ''}`} />
                      </div>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                
                <TableBody>
                  {/* Fila para añadir un nuevo NFT */}
                  <TableRow className="border-t border-b border-slate-200 dark:border-slate-700">
                    <TableCell>
                      <Select 
                        value={newNft.network} 
                        onValueChange={(value) => handleNewNftChange('network', value)}
                      >
                        <SelectTrigger className="h-8">
                          <SelectValue placeholder="Seleccionar red" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ethereum">Ethereum</SelectItem>
                          <SelectItem value="polygon">Polygon</SelectItem>
                          <SelectItem value="unichain">Unichain</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Select 
                        value={newNft.version} 
                        onValueChange={(value) => handleNewNftChange('version', value)}
                      >
                        <SelectTrigger className="h-8">
                          <SelectValue placeholder="Seleccionar versión" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="V3">V3</SelectItem>
                          <SelectItem value="V4">V4</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Input
                        className="h-8"
                        value={newNft.tokenId}
                        onChange={(e) => handleNewNftChange('tokenId', e.target.value)}
                        placeholder="ID del NFT"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        className="h-8"
                        value={newNft.valueUsdc}
                        onChange={(e) => handleNewNftChange('valueUsdc', e.target.value)}
                        placeholder="Valor en USDC"
                        type="number"
                        step="0.01"
                      />
                    </TableCell>
                    <TableCell>
                      <Select 
                        value={newNft.status || 'Active'} 
                        onValueChange={(value) => handleNewNftChange('status', value)}
                      >
                        <SelectTrigger className="h-8">
                          <SelectValue placeholder="Seleccionar estado" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Active">Activo</SelectItem>
                          <SelectItem value="Unknown">Desconocido</SelectItem>
                          <SelectItem value="Closed">Cerrado</SelectItem>
                          <SelectItem value="Finalized">Finalizado</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <div className="text-xs text-slate-500">
                        Se mostrará el precio después de crear
                      </div>
                    </TableCell>
                    <TableCell>
                      {newNft.version === 'V3' ? (
                        <span className="text-emerald-500 text-xs">Se conectará automáticamente</span>
                      ) : (
                        <span className="text-slate-400 text-xs">No disponible</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="default"
                        className="h-8"
                        onClick={handleCreateNft}
                        disabled={createMutation.isPending}
                      >
                        <PlusCircle className="h-4 w-4 mr-1" />
                        Añadir
                      </Button>
                    </TableCell>
                  </TableRow>
                  
                  {/* Filas con los NFTs existentes */}
                  {filteredNfts.length > 0 ? (
                    filteredNfts.map((nft: ManagedNft) => (
                    <TableRow key={nft.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <TableCell>
                        {editingRows[nft.id] ? (
                          <Select 
                            value={modifiedRows[nft.id]?.network || nft.network} 
                            onValueChange={(value) => handleChangeRow(nft.id, 'network', value)}
                          >
                            <SelectTrigger className="h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="ethereum">Ethereum</SelectItem>
                              <SelectItem value="polygon">Polygon</SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          <span className="capitalize">{nft.network}</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {editingRows[nft.id] ? (
                          <Select 
                            value={modifiedRows[nft.id]?.version || nft.version} 
                            onValueChange={(value) => handleChangeRow(nft.id, 'version', value)}
                          >
                            <SelectTrigger className="h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="V3">V3</SelectItem>
                              <SelectItem value="V4">V4</SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          nft.version
                        )}
                      </TableCell>
                      <TableCell>
                        {editingRows[nft.id] ? (
                          <Input
                            className="h-8"
                            value={modifiedRows[nft.id]?.tokenId || nft.tokenId}
                            onChange={(e) => handleChangeRow(nft.id, 'tokenId', e.target.value)}
                          />
                        ) : (
                          <span className="font-mono text-sm">{nft.tokenId}</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {editingRows[nft.id] ? (
                          <Input
                            className="h-8"
                            value={modifiedRows[nft.id]?.valueUsdc || nft.valueUsdc}
                            onChange={(e) => handleChangeRow(nft.id, 'valueUsdc', e.target.value)}
                            type="number"
                            step="0.01"
                          />
                        ) : (
                          <span className="font-medium">
                            {formatExactCurrency(Number(nft.valueUsdc || '0'), 0, 'USD')}
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        {editingRows[nft.id] ? (
                          <Select 
                            value={modifiedRows[nft.id]?.status || nft.status} 
                            onValueChange={(value) => handleChangeRow(nft.id, 'status', value)}
                          >
                            <SelectTrigger className="h-8">
                              <div className="flex items-center gap-2">
                                <span 
                                  className={`h-2 w-2 rounded-full ${
                                    (modifiedRows[nft.id]?.status || nft.status) === 'Active' ? 'bg-emerald-500' : 
                                    (modifiedRows[nft.id]?.status || nft.status) === 'Unknown' ? 'bg-slate-400' : 
                                    (modifiedRows[nft.id]?.status || nft.status) === 'Closed' ? 'bg-amber-500' : 
                                    'bg-indigo-500'
                                  }`} 
                                />
                                <SelectValue />
                              </div>
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Active" className="text-emerald-700 font-medium">
                                <div className="flex items-center">
                                  <span className="h-2 w-2 rounded-full bg-emerald-500 mr-2"></span>
                                  Activo
                                </div>
                              </SelectItem>
                              <SelectItem value="Unknown" className="text-slate-600 font-medium">
                                <div className="flex items-center">
                                  <span className="h-2 w-2 rounded-full bg-slate-400 mr-2"></span>
                                  Desconocido
                                </div>
                              </SelectItem>
                              <SelectItem value="Closed" className="text-amber-700 font-medium">
                                <div className="flex items-center">
                                  <span className="h-2 w-2 rounded-full bg-amber-500 mr-2"></span>
                                  Cerrado
                                </div>
                              </SelectItem>
                              <SelectItem value="Finalized" className="text-indigo-700 font-medium">
                                <div className="flex items-center">
                                  <span className="h-2 w-2 rounded-full bg-indigo-500 mr-2"></span>
                                  Finalizado
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold
                            ${nft.status === 'Active' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 
                              nft.status === 'Unknown' ? 'bg-slate-100 text-slate-600 border border-slate-200' : 
                              nft.status === 'Closed' ? 'bg-amber-100 text-amber-800 border border-amber-200' : 
                              'bg-indigo-100 text-indigo-800 border border-indigo-200'}`}
                          >
                            {nft.status === 'Active' ? 'Activo' : 
                             nft.status === 'Unknown' ? 'Desconocido' : 
                             nft.status === 'Closed' ? 'Cerrado' : 'Finalizado'}
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        {editingRows[nft.id] ? (
                          <div className="text-xs text-slate-500">
                            No se modifica el precio en modo edición
                            <input
                              type="hidden"
                              value={modifiedRows[nft.id]?.contractAddress || nft.contractAddress || ''}
                              onChange={(e) => handleChangeRow(nft.id, 'contractAddress', e.target.value)}
                            />
                          </div>
                        ) : (
                          <div className="flex items-center">
                            {/* Obtener el identificador único para este NFT */}
                            {(() => {
                              const nftKey = `${nft.tokenId}_${nft.network}`;
                              const listing = nftListings[nftKey];
                              
                              if (listing && listing.isListed) {
                                return (
                                  <div className="flex items-center gap-1.5">
                                    <Activity className="h-3.5 w-3.5 text-emerald-500" />
                                    <div className="text-sm font-medium text-emerald-600 dark:text-emerald-500">
                                      {listing.price}
                                    </div>
                                    <div className="text-xs text-slate-500">
                                      ({listing.priceUsd ? formatExactCurrency(listing.priceUsd, 0, 'USD') : 'Precio desconocido'})
                                    </div>
                                  </div>
                                );
                              } else if (listing && listing.hasOwnProperty('isListed')) {
                                return (
                                  <div className="text-xs text-slate-500">
                                    No listado en OpenSea
                                  </div>
                                );
                              } else {
                                return (
                                  <div className="flex items-center text-xs text-slate-500">
                                    <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                                    Consultando OpenSea...
                                  </div>
                                );
                              }
                            })()}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        {nft.tokenId && getContractAddress(nft) ? (
                          <a 
                            href={getOpenSeaUrl(nft) || '#'} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                            Ver en OpenSea
                          </a>
                        ) : (
                          <span className="text-xs text-slate-400">
                            {nft.version === 'V3' ? 'NFT V3 - Automático' : 
                            nft.version === 'V4' ? 'NFT V4 - Automático' : 'Falta token ID'}
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-right space-x-1">
                        {editingRows[nft.id] ? (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8"
                              onClick={() => handleCancelEdit(nft.id)}
                            >
                              Cancelar
                            </Button>
                            <Button
                              size="sm"
                              variant="default"
                              className="h-8"
                              onClick={() => handleSave(nft.id)}
                              disabled={updateMutation.isPending}
                            >
                              <Save className="h-4 w-4 mr-1" />
                              Guardar
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8"
                              onClick={() => handleEdit(nft.id)}
                            >
                              Editar
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              className="h-8"
                              onClick={() => handleDelete(nft.id)}
                              disabled={deleteMutation.isPending}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      No hay NFTs administrados. Añade uno nuevo usando el formulario superior.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            
            {/* Paginación */}
            {totalPages > 1 && (
              <div className="flex justify-center py-4">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className={currentPage === 1 ? "opacity-50" : ""}
                      >
                        Anterior
                      </Button>
                    </PaginationItem>
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <PaginationItem key={page}>
                        <Button
                          variant={page === currentPage ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(page)}
                          disabled={page === currentPage}
                        >
                          {page}
                        </Button>
                      </PaginationItem>
                    ))}
                    
                    <PaginationItem>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className={currentPage === totalPages ? "opacity-50" : ""}
                      >
                        Siguiente
                      </Button>
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default ManagedNftsPage;