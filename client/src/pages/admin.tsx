import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useWallet } from "@/hooks/use-wallet";
import { apiRequest } from "@/lib/queryClient";
import { NETWORKS } from "@/lib/constants";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import TimeframeAdjustments from "@/components/admin/timeframe-adjustments";
import UserPositionsManager from "@/components/admin/user-positions-manager";
import OptimizedPositionsManager from "@/components/admin/optimized-positions-manager";
import SupportTicketsManager from "@/components/admin/support-tickets-manager";
import { AdminInvoicesManager } from "@/components/admin/admin-invoices";
import BillingProfilesManager from "@/components/admin/billing-profiles-manager";
import GlobalPositionStats from "@/components/admin/global-position-stats";
import AppVersionManager from "@/components/admin/app-version-manager";
import VideoManagement from "@/components/admin/video-management";
import PodcastManagement from "@/components/admin/podcast-management";
import LeadsManager from "@/components/admin/leads-manager-fixed";
import AccountingExport from "@/components/admin/accounting-export";
import DatabaseMonitor from "@/components/admin/DatabaseMonitor";
import AdvancedDatabaseMonitor from "@/components/admin/AdvancedDatabaseMonitor";
import FeeWithdrawalsManager from "@/components/admin/fee-withdrawals-manager";
import LegalSignaturesManager from "@/components/admin/legal-signatures-manager";
import YieldDistributionManager from "@/components/admin/yield-distribution-manager";

// Función de utilidad para extraer una dirección de pool de Uniswap desde varias fuentes
function extractPoolAddress(input: string): string {
  // Si la entrada está vacía o es nula, devolver una cadena vacía
  if (!input) {
    return input;
  }

  // Si la entrada ya es una dirección Ethereum válida, la devolvemos como está
  if (/^0x[a-fA-F0-9]{40}$/.test(input)) {
    console.log("Input ya es una dirección Ethereum válida:", input);
    return input;
  }
  
  try {
    // Verificar si es una URL de Uniswap
    const url = new URL(input);
    
    // Formato nuevo: https://app.uniswap.org/explore/pools/ethereum/0x88e6A0c2dDD26FEEb64F039a2c41296FcB3f5640
    if (url.pathname.includes('/explore/pools/')) {
      const parts = url.pathname.split('/');
      // El formato es /explore/pools/{network}/{address}
      for (const part of parts) {
        if (part.startsWith('0x') && part.length === 42) {
          console.log("Extraída dirección del pool desde URL de formato nuevo:", part);
          return part;
        }
      }
    }
    
    // Formato antiguo: https://app.uniswap.org/#/pool/1234
    if (url.hash && url.hash.includes('/pool/')) {
      const poolId = url.hash.split('/pool/')[1];
      if (poolId && poolId.startsWith('0x') && poolId.length === 42) {
        console.log("Extraída dirección del pool desde URL de formato antiguo:", poolId);
        return poolId;
      }
    }
    
    // Formato con info para pools: https://info.uniswap.org/#/pools/0x...
    if (url.hash && url.hash.includes('/pools/')) {
      const poolId = url.hash.split('/pools/')[1];
      if (poolId && poolId.startsWith('0x') && poolId.length === 42) {
        console.log("Extraída dirección del pool desde URL de info:", poolId);
        return poolId;
      }
    }
    
    // Formato nuevo: https://app.uniswap.org/explore/pools/ethereum/0x...
    if (url.pathname && url.pathname.includes('/explore/pools/ethereum/')) {
      const poolId = url.pathname.split('/explore/pools/ethereum/')[1];
      if (poolId && poolId.startsWith('0x') && poolId.length === 42) {
        console.log("Extraída dirección del pool desde URL de nueva app:", poolId);
        return poolId;
      }
    }
    
    // Buscar cualquier dirección Ethereum en la URL
    const matches = input.match(/0x[a-fA-F0-9]{40}/g);
    if (matches && matches.length > 0) {
      console.log("Extraída dirección del pool usando expresión regular en URL:", matches[0]);
      return matches[0];
    }
  } catch (error) {
    // Si la entrada no es una URL válida, verificamos si contiene una dirección Ethereum
    const matches = input.match(/0x[a-fA-F0-9]{40}/g);
    if (matches && matches.length > 0) {
      console.log("Extraída dirección del pool desde texto:", matches[0]);
      return matches[0];
    }
  }
  
  // Si no pudimos extraer una dirección, devolvemos la entrada original
  console.log("No se pudo extraer dirección del pool, devolviendo entrada original:", input);
  return input;
}

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { 
  AlertTriangle,
  Check, 
  Copy,
  Download,
  Edit,
  ExternalLink, 
  Loader2,
  Lock, 
  Plus, 
  Power,
  RefreshCw, 
  Trash, 
  UserPlus
} from "lucide-react";
import { Link } from "wouter";

// Schema de validación para admin access
const adminAccessSchema = z.object({
  walletAddress: z.string().min(20, "Dirección de billetera requerida").max(100),
  adminSecret: z.string().min(1, "Clave de administrador requerida"),
});

// Schema de validación para nuevo pool
const newPoolSchema = z.object({
  name: z.string().min(3, "Nombre del pool requerido"),
  address: z.string()
    .min(42, "Dirección del pool debe tener 42 caracteres")
    .max(42, "Dirección del pool debe tener 42 caracteres")
    .refine(val => /^0x[a-fA-F0-9]{40}$/.test(val), "Dirección Ethereum inválida"),
  networkId: z.coerce.number().min(1, "Red requerida"),
  networkName: z.string().min(1, "Nombre de red requerido"),
  token0Symbol: z.string().min(1, "Símbolo del token 0 requerido"),
  token1Symbol: z.string().min(1, "Símbolo del token 1 requerido"),
  token0Name: z.string().min(1, "Nombre del token 0 requerido"),
  token1Name: z.string().min(1, "Nombre del token 1 requerido"),
  token0Decimals: z.coerce.number().min(0, "Decimales del token 0 requeridos"),
  token1Decimals: z.coerce.number().min(0, "Decimales del token 1 requeridos"),
  token0Address: z.string()
    .refine(val => {
      // Verificar si es un token nativo
      if (["ETH", "MATIC", "BNB", "AVAX"].includes(val)) return true;
      // O verificar si es una dirección Ethereum válida con checksum
      return /^0x[a-fA-F0-9]{40}$/.test(val);
    }, "Dirección del token 0 inválida. Usa 'ETH' para tokens nativos o una dirección válida."),
  token1Address: z.string()
    .refine(val => {
      // Verificar si es un token nativo
      if (["ETH", "MATIC", "BNB", "AVAX"].includes(val)) return true;
      // O verificar si es una dirección Ethereum válida
      return /^0x[a-fA-F0-9]{40}$/.test(val);
    }, "Dirección del token 1 inválida. Usa 'ETH' para tokens nativos o una dirección válida."),
  feeTier: z.coerce.number()
    .refine(val => [100, 500, 3000, 10000].includes(val), 
      "Fee tier debe ser uno de los valores válidos: 100 (0.01%), 500 (0.05%), 3000 (0.3%), 10000 (1%)"),
  active: z.boolean().default(true),
});

// Schema de validación para pool URL (para utilizar en el formulario simplificado)
const poolUrlSchema = z.object({
  poolUrl: z.string().url("URL del pool inválida")
    .refine(url => {
      // Acepta tanto el formato antiguo (/pool/) como el nuevo (/explore/pools/)
      return url.includes("uniswap.org") && 
        (url.includes("/pool/") || url.includes("/explore/pools/"));
    }, {
      message: "La URL debe ser de un pool de Uniswap (formatos aceptados: app.uniswap.org/#/pool/... o app.uniswap.org/explore/pools/...)"
    }),
});

// Tipos para los pools y admins
type CustomPool = z.infer<typeof newPoolSchema> & {
  id: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
};

type AdminUser = {
  id: number;
  walletAddress: string;
  isAdmin: boolean;
};

export default function AdminPage() {
  const { address, isConnecting } = useWallet();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isCheckingAdmin, setIsCheckingAdmin] = useState(true);
  const [pools, setPools] = useState<CustomPool[]>([]);
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [isLoadingPools, setIsLoadingPools] = useState(false);
  const [isAddingPool, setIsAddingPool] = useState(false);
  const [openPoolDialog, setOpenPoolDialog] = useState(false);
  const [openUrlDialog, setOpenUrlDialog] = useState(false);
  const [isProcessingFromUrl, setIsProcessingFromUrl] = useState(false);
  const [poolFromUrl, setPoolFromUrl] = useState<Partial<CustomPool> | null>(null);
  const [openNewAdminDialog, setOpenNewAdminDialog] = useState(false);
  const [newAdminAddress, setNewAdminAddress] = useState("");
  const [isAddingAdmin, setIsAddingAdmin] = useState(false);
  const [editingPoolId, setEditingPoolId] = useState<number | null>(null);
  const [deletingPool, setDeletingPool] = useState<{id: number, name: string} | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  // Función auxiliar para actualizar la pestaña en la URL
  const updateTabInUrl = (tab: string) => {
    const url = new URL(window.location.href);
    url.searchParams.set('tab', tab);
    window.history.pushState({}, '', url.toString());
    return tab;
  };

  // Usamos la URL para determinar la pestaña inicial
  const [activeTab, setActiveTab] = useState(() => {
    // Obtener la pestaña desde la URL si existe
    const queryParams = new URLSearchParams(window.location.search);
    const tabParam = queryParams.get('tab');
    return tabParam || "invoices"; // Si no hay parámetro, usar "invoices" por defecto
  });
  
  // Wrapper para setActiveTab que también actualiza la URL
  const setTabWithUrlUpdate = (tab: string) => {
    updateTabInUrl(tab);
    setActiveTab(tab);
  };
  
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Form para acceso de administrador
  const adminForm = useForm<z.infer<typeof adminAccessSchema>>({
    resolver: zodResolver(adminAccessSchema),
    defaultValues: {
      walletAddress: address || "",
      adminSecret: "",
    },
  });

  // Form para agregar nuevo pool
  const poolForm = useForm<z.infer<typeof newPoolSchema>>({
    resolver: zodResolver(newPoolSchema),
    defaultValues: {
      name: "",
      address: "",
      networkId: 1,
      networkName: "ETHEREUM",
      token0Symbol: "",
      token1Symbol: "",
      token0Name: "",
      token1Name: "",
      token0Decimals: 18,
      token1Decimals: 18,
      token0Address: "",
      token1Address: "",
      feeTier: 3000, // Por defecto 0.3%
      active: true,
    },
  });
  
  // Form para ingresar URL de pool
  const urlForm = useForm<z.infer<typeof poolUrlSchema>>({
    resolver: zodResolver(poolUrlSchema),
    defaultValues: {
      poolUrl: "",
    },
  });

  // Verificar si el usuario es administrador cuando se carga la página
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!address) {
        setIsAdmin(false);
        setIsCheckingAdmin(false);
        return;
      }
      
      try {
        // Usar el nuevo endpoint específico para verificar estado de admin
        const response = await apiRequest<{isAdmin: boolean}>("GET", `/api/user/${address}/admin-status`);
        setIsAdmin(response?.isAdmin === true);
      } catch (error) {
        console.error("Error checking admin status:", error);
        setIsAdmin(false);
      } finally {
        setIsCheckingAdmin(false);
      }
    };
    
    checkAdminStatus();
  }, [address]);
  
  // Cargar los pools y admins cuando el usuario es administrador
  useEffect(() => {
    if (isAdmin && address) {
      loadPools();
      loadAdmins();
    }
  }, [isAdmin, address]);
  
  // Actualizar el campo walletAddress cuando cambia la address
  useEffect(() => {
    if (address) {
      adminForm.setValue("walletAddress", address);
    }
  }, [address, adminForm]);
  
  // Función para cargar pools
  const loadPools = async () => {
    if (!address) return;
    
    setIsLoadingPools(true);
    try {
      const headers = { "x-wallet-address": address };
      const data = await apiRequest<CustomPool[]>("GET", "/api/admin/pools", null, { headers });
      
      setPools(data || []);
    } catch (error) {
      console.error("Error loading pools:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los pools",
        variant: "destructive",
      });
    } finally {
      setIsLoadingPools(false);
    }
  };
  
  // Función para cargar admins
  const loadAdmins = async () => {
    if (!address) return;
    
    try {
      // Obtener la lista de administradores desde la API
      const headers = { "x-wallet-address": address };
      const users = await apiRequest<AdminUser[]>("GET", "/api/admin/users", null, { headers });
      
      if (users && Array.isArray(users)) {
        // Filtrar solo los usuarios que son administradores
        const adminUsers = users.filter(user => user.isAdmin === true);
        setAdmins(adminUsers);
      } else {
        // Si no hay datos o no es un array, mostrar solo el usuario actual
        setAdmins([{
          id: 1,
          walletAddress: address,
          isAdmin: true
        }]);
      }
    } catch (error) {
      console.error("Error loading admins:", error);
      // En caso de error, mostrar solo el usuario actual
      setAdmins([{
        id: 1,
        walletAddress: address,
        isAdmin: true
      }]);
    }
  };
  
  // Función para agregar un nuevo administrador
  const addNewAdmin = async () => {
    if (!address || !newAdminAddress) return;
    
    setIsAddingAdmin(true);
    try {
      const values = {
        walletAddress: newAdminAddress,
        adminSecret: "WayBank2025Admin" // Usamos la clave secreta directamente
      };
      
      const result = await apiRequest<{success: boolean, user: AdminUser}>("POST", "/api/admin/promote", values);
      
      if (result.success && result.user) {
        // Actualizar la lista de administradores
        setAdmins(prevAdmins => [...prevAdmins, result.user]);
        setNewAdminAddress("");
        setOpenNewAdminDialog(false);
        
        toast({
          title: "Administrador añadido",
          description: `${newAdminAddress.substring(0, 6)}...${newAdminAddress.substring(newAdminAddress.length - 4)} ahora tiene permisos de administrador`,
        });
      }
    } catch (error) {
      console.error("Error adding new admin:", error);
      toast({
        title: "Error",
        description: "No se pudo añadir el nuevo administrador",
        variant: "destructive",
      });
    } finally {
      setIsAddingAdmin(false);
    }
  };
  
  // Función para solicitar acceso como administrador
  const onSubmitAdminAccess = async (values: z.infer<typeof adminAccessSchema>) => {
    try {
      const result = await apiRequest<{success: boolean}>("POST", "/api/admin/promote", values);
      
      if (result.success) {
        setIsAdmin(true);
        toast({
          title: "Éxito",
          description: "Ahora tienes permisos de administrador",
        });
      }
    } catch (error) {
      console.error("Error requesting admin access:", error);
      toast({
        title: "Error",
        description: "No se pudo obtener acceso de administrador. Verifica la clave.",
        variant: "destructive",
      });
    }
  };
  
  // Función para agregar o actualizar un pool
  const onSubmitNewPool = async (values: z.infer<typeof newPoolSchema>) => {
    if (!address) return;
    
    setIsAddingPool(true);
    try {
      // Extraer dirección del pool en caso de que el usuario haya ingresado una URL
      const extractedAddress = extractPoolAddress(values.address);
      
      // Crear objeto de pool con todos los campos requeridos
      const poolData = {
        name: values.name,
        address: extractedAddress, // Usar la dirección extraída
        networkId: values.networkId,
        networkName: values.networkName,
        token0Symbol: values.token0Symbol,
        token1Symbol: values.token1Symbol,
        token0Name: values.token0Name,
        token1Name: values.token1Name,
        token0Decimals: values.token0Decimals,
        token1Decimals: values.token1Decimals,
        token0Address: values.token0Address,
        token1Address: values.token1Address,
        feeTier: values.feeTier,
        active: values.active,
        createdBy: address
      };
      
      // Mostrar mensaje informativo si se extrajo una dirección diferente
      if (extractedAddress !== values.address) {
        console.log(`Se extrajo la dirección ${extractedAddress} de la entrada original ${values.address}`);
        toast({
          title: "Dirección extraída",
          description: `Se extrajo la dirección ${extractedAddress.substring(0, 6)}...${extractedAddress.substring(extractedAddress.length - 4)} de la URL proporcionada.`,
        });
      }
      
      // Configurar los headers para incluir la dirección del wallet
      const headers = { 
        "x-wallet-address": address,
        "Content-Type": "application/json"
      };
      
      let result;
      
      // Determinar si estamos editando un pool existente o creando uno nuevo
      if (editingPoolId !== null) {
        console.log(`Actualizando pool existente ID: ${editingPoolId}`, poolData);
        
        // Actualizar un pool existente usando PUT
        result = await apiRequest<CustomPool>(
          "PUT", 
          `/api/admin/pools/${editingPoolId}`, 
          poolData, 
          { headers }
        );
        
        if (result) {
          toast({
            title: "Éxito",
            description: "Pool actualizado correctamente",
          });
          
          // Actualizar localmente
          setPools(prevPools => 
            prevPools.map(pool => 
              pool.id === editingPoolId ? { ...pool, ...poolData } : pool
            )
          );
        }
      } else {
        console.log("Creando nuevo pool", poolData);
        
        // Crear un nuevo pool usando POST
        result = await apiRequest<CustomPool>(
          "POST", 
          "/api/admin/pools", 
          poolData, 
          { headers }
        );
        
        if (result) {
          toast({
            title: "Éxito",
            description: "Pool agregado correctamente",
          });
        }
      }
      
      // Si la operación fue exitosa
      if (result) {
        // Forzar refresco de datos
        queryClient.invalidateQueries({ queryKey: ["/api/pools/custom"] });
        
        // Recargar pools y limpiar estado
        loadPools();
        setOpenPoolDialog(false);
        poolForm.reset();
        setEditingPoolId(null);
      }
    } catch (error) {
      console.error("Error al guardar el pool:", error);
      toast({
        title: "Error",
        description: editingPoolId ? 
          "No se pudo actualizar el pool. Verifica los datos y la conexión." : 
          "No se pudo agregar el pool. Verifica los datos y la conexión.",
        variant: "destructive",
      });
    } finally {
      setIsAddingPool(false);
    }
  };
  
  // Función para cambiar el estado activo/inactivo de un pool
  const togglePoolStatus = async (poolId: number, isActive: boolean) => {
    if (!address) return;
    
    try {
      const headers = { "x-wallet-address": address };
      await apiRequest<{success: boolean}>("PUT", `/api/admin/pools/${poolId}`, { active: !isActive }, { headers });
      
      // Actualizar localmente
      setPools(prevPools => 
        prevPools.map(pool => 
          pool.id === poolId ? { ...pool, active: !isActive } : pool
        )
      );
      
      toast({
        title: "Estado actualizado",
        description: `Pool ${!isActive ? "activado" : "desactivado"} correctamente`,
      });
    } catch (error) {
      console.error("Error toggling pool status:", error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el estado del pool",
        variant: "destructive",
      });
    }
  };
  
  // Función para iniciar proceso de eliminación de un pool
  const confirmDeletePool = (poolId: number, poolName: string) => {
    // Establecer el pool que queremos eliminar
    setDeletingPool({ id: poolId, name: poolName });
  };
  
  // Función para ejecutar la eliminación después de la confirmación
  const executePoolDeletion = async () => {
    if (!address || !deletingPool) return;
    
    setIsDeleting(true);
    
    try {
      console.log(`Eliminando pool ${deletingPool.id}`);
      
      const headers = { "x-wallet-address": address };
      
      // Llamada a la API para eliminar
      const response = await apiRequest<{success: boolean}>(
        "DELETE", 
        `/api/admin/pools/${deletingPool.id}`, 
        null, 
        { headers }
      );
      
      console.log("Respuesta de la API para eliminación:", response);
      
      // Actualizar localmente solo si la eliminación fue exitosa
      setPools(prevPools => prevPools.filter(pool => pool.id !== deletingPool.id));
      
      // Forzar refresco de datos después de eliminar
      queryClient.invalidateQueries({ queryKey: ["/api/pools/custom"] });
      
      toast({
        title: "Pool eliminado",
        description: `El pool "${deletingPool.name}" ha sido eliminado correctamente`,
      });
      
      // Limpiar estado
      setDeletingPool(null);
    } catch (error) {
      console.error("Error deleting pool:", error);
      toast({
        title: "Error",
        description: "No se pudo eliminar el pool. Por favor, verifica la conexión a la API.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };
  
  // Función para editar un pool existente
  const editPool = (pool: CustomPool) => {
    // Establecer los valores del formulario con los datos del pool seleccionado
    poolForm.reset({
      name: pool.name,
      address: pool.address,
      networkId: pool.networkId,
      networkName: pool.networkName,
      token0Symbol: pool.token0Symbol,
      token1Symbol: pool.token1Symbol,
      token0Name: pool.token0Name,
      token1Name: pool.token1Name,
      token0Address: pool.token0Address || "",
      token1Address: pool.token1Address || "",
      token0Decimals: pool.token0Decimals,
      token1Decimals: pool.token1Decimals,
      feeTier: pool.feeTier,
      active: pool.active
    });
    
    // Guardar el ID del pool que estamos editando
    setEditingPoolId(pool.id);
    
    // Abrir el diálogo de edición
    setOpenPoolDialog(true);
  };
  
  // Función para extraer datos de una URL de Uniswap
  const processPoolUrl = async (values: z.infer<typeof poolUrlSchema>) => {
    setIsProcessingFromUrl(true);
    try {
      console.log("Procesando URL del pool:", values.poolUrl);
      
      // Extraer la dirección del pool usando nuestra función de utilidad
      const poolAddress = extractPoolAddress(values.poolUrl);
      console.log("Dirección extraída:", poolAddress);
      
      // Si no pudimos extraer una dirección válida, mostrar un error
      if (!poolAddress.startsWith('0x') || poolAddress.length !== 42) {
        console.log("La dirección extraída no es válida:", poolAddress);
        toast({
          title: "Error en la URL",
          description: `No se pudo extraer una dirección válida: "${poolAddress}"`,
          variant: "destructive",
        });
        throw new Error("No se pudo extraer una dirección válida de la URL");
      }
      
      // Obtener la red de la URL
      let networkId = 1; // Ethereum por defecto
      let networkName = "ETHEREUM";
      
      // Analizar la URL original para intentar determinar la red
      try {
        const url = new URL(values.poolUrl);
        
        // Verificar si la red está especificada en la URL (formato nuevo: /explore/pools/ethereum/)
        if (url.pathname.includes("/explore/pools/")) {
          // En el formato nuevo, la red está en el segmento después de /pools/
          const pathParts = url.pathname.split('/');
          const networkIndex = pathParts.findIndex(part => part === "pools") + 1;
          
          if (networkIndex > 0 && networkIndex < pathParts.length) {
            const networkValue = pathParts[networkIndex];
            
            if (networkValue === "polygon") {
              networkId = 137;
              networkName = "POLYGON";
            } else if (networkValue === "optimism") {
              networkId = 10;
              networkName = "OPTIMISM";
            } else if (networkValue === "arbitrum") {
              networkId = 42161;
              networkName = "ARBITRUM";
            }
          }
        } 
        // Para URLs en formato antiguo o cuando no se encuentra en el formato nuevo
        else if (url.pathname.includes("polygon") || url.host.includes("polygon")) {
          networkId = 137;
          networkName = "POLYGON";
        } else if (url.pathname.includes("optimism") || url.host.includes("optimism")) {
          networkId = 10;
          networkName = "OPTIMISM";
        } else if (url.pathname.includes("arbitrum") || url.host.includes("arbitrum")) {
          networkId = 42161;
          networkName = "ARBITRUM";
        }
      } catch (urlError) {
        console.error("Error analizando la URL para la red:", urlError);
        // Mantener los valores predeterminados para la red (Ethereum)
      }
      
      // Aquí en un caso real, podríamos hacer una llamada a un API para obtener
      // más información sobre el pool, como tokens, feeTier, etc.
      // Por ahora, configuramos valores básicos para demostración
      
      const poolData: Partial<CustomPool> = {
        address: poolAddress,
        name: `Pool ${poolAddress.slice(0, 6)}...${poolAddress.slice(-4)}`,
        networkId,
        networkName,
        token0Symbol: "TOKEN0",
        token1Symbol: "TOKEN1",
        token0Name: "Token 0",
        token1Name: "Token 1",
        token0Decimals: 18,
        token1Decimals: 18,
        token0Address: "0x0000000000000000000000000000000000000000",
        token1Address: "0x0000000000000000000000000000000000000000",
        feeTier: 3000, // 0.3% por defecto
        active: true,
      };
      
      setPoolFromUrl(poolData);
      poolForm.reset(poolData as any);
      setOpenUrlDialog(false);
      setOpenPoolDialog(true);
      
      toast({
        title: "URL procesada",
        description: "Completa los detalles faltantes del pool",
      });
    } catch (error) {
      console.error("Error processing pool URL:", error);
      toast({
        title: "Error",
        description: "No se pudo procesar la URL. Formato incorrecto.",
        variant: "destructive",
      });
    } finally {
      setIsProcessingFromUrl(false);
    }
  };
  
  // Renderizar la página de acceso de administrador si el usuario no es admin
  if (!isAdmin) {
    return (
      <div className="container mx-auto py-8">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Lock className="w-5 h-5 mr-2" />
              Acceso de Administrador
            </CardTitle>
            <CardDescription>
              Ingresa la clave de administrador para acceder al panel
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...adminForm}>
              <form onSubmit={adminForm.handleSubmit(onSubmitAdminAccess)} className="space-y-4">
                <FormField
                  control={adminForm.control}
                  name="walletAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dirección de Billetera</FormLabel>
                      <FormControl>
                        <Input {...field} readOnly={!!address} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={adminForm.control}
                  name="adminSecret"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Clave de Administrador</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button type="submit" className="w-full" disabled={isConnecting || isCheckingAdmin}>
                  {isCheckingAdmin ? "Verificando..." : "Acceder"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  // No necesitamos hooks específicos para los estilos - los aplicamos directamente con CSS

  // Renderizar el panel de administración
  return (
    <div className="container mx-auto py-6 admin-page">
      {/* Diálogo de confirmación para eliminar pool */}
      <AlertDialog 
        open={!!deletingPool} 
        onOpenChange={(open) => {
          if (!open) setDeletingPool(null);
        }}
      >
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-red-500">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Confirmar eliminación
              </div>
            </AlertDialogTitle>
            <AlertDialogDescription className="py-4">
              <p className="mb-2">¿Estás seguro de que deseas eliminar permanentemente el siguiente pool?</p>
              
              {deletingPool && (
                <div className="my-4 p-4 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{deletingPool.name}</span>
                  </div>
                </div>
              )}
              
              <p className="text-red-500 font-medium mt-4">Esta acción no se puede deshacer</p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={isDeleting}
              className="border-slate-200 dark:border-slate-700"
            >
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                executePoolDeletion();
              }}
              disabled={isDeleting}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              {isDeleting ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Eliminando...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Trash className="h-4 w-4" />
                  Eliminar
                </div>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Header con diseño blockchain */}
      <div className="relative mb-8 p-6 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-lg shadow-lg border border-slate-700/50 overflow-hidden">
        {/* Background hexagon pattern */}
        <div className="absolute inset-0 opacity-5">
          {[...Array(20)].map((_, i) => (
            <div 
              key={i} 
              className="absolute"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                width: `${Math.random() * 50 + 30}px`,
                height: `${Math.random() * 50 + 30}px`,
                border: '1px solid rgba(255,255,255,0.2)',
                transform: `rotate(${Math.random() * 360}deg)`,
                opacity: Math.random() * 0.5 + 0.2
              }}
            >
              <div className="w-full h-full bg-white/5 rounded-lg"></div>
            </div>
          ))}
        </div>
        
        {/* Header content */}
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="w-12 h-12 flex items-center justify-center mr-4 rounded-lg bg-primary/20 border border-primary/30">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="24" 
                  height="24" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="text-primary"
                >
                  <path d="M7.21 15 2.66 7.14a2 2 0 0 1 .13-2.2L4.4 2.8A2 2 0 0 1 6 2h12a2 2 0 0 1 1.6.8l1.6 2.14a2 2 0 0 1 .14 2.2L16.79 15" />
                  <path d="M11 12 5.12 2.2" />
                  <path d="m13 12 5.88-9.8" />
                  <path d="M8 7h8" />
                  <circle cx="12" cy="19" r="3" />
                  <path d="M12 16v-4" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Panel de SuperAdmin</h1>
                <p className="text-slate-300 text-sm">Gestiona los recursos del sistema y configura los parámetros globales</p>
              </div>
            </div>
            
            <div className="hidden md:flex space-x-2">
              <div className="px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-md text-green-400 text-xs flex items-center">
                <span className="w-2 h-2 rounded-full bg-green-400 mr-2 animate-pulse"></span>
                Sistema Activo
              </div>
              <div className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-md text-blue-400 text-xs flex items-center">
                <span className="w-2 h-2 rounded-full bg-blue-400 mr-2"></span>
                Blockchain Sincronizada
              </div>
            </div>
          </div>
          
          {/* Navigation Menu */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-700/50">
            <div className="flex flex-wrap gap-2">
              <Link href="/admin/managed-nfts">
                <Button variant="secondary" className="bg-white/5 hover:bg-white/10 text-white border border-white/10 flex items-center gap-2">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="16" 
                    height="16" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                  >
                    <path d="M2 12h2"></path>
                    <path d="M6 8V4c0-1 .6-2 2-2h8c1.4 0 2 .6 2 2v4"></path>
                    <path d="M18 12h2c1 0 2 .6 2 2v4c0 1.4-.6 2-2 2H4c-1.4 0-2-.6-2-2v-4c0-1.4.6-2 2-2h2"></path>
                    <path d="M6 16h12"></path>
                    <path d="M6 12v4"></path>
                    <path d="M18 12v4"></path>
                    <path d="M10 12v4"></path>
                    <path d="M14 12v4"></path>
                  </svg>
                  Gestión NFTs
                </Button>
              </Link>
              <Link href="/admin/transaction-history">
                <Button variant="secondary" className="bg-white/5 hover:bg-white/10 text-white border border-white/10 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                  Historico
                </Button>
              </Link>
              <Link href="/admin/wbc-transactions">
                <Button variant="secondary" className="bg-purple-500/20 hover:bg-purple-500/30 text-purple-200 border border-purple-500/30 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="8"/>
                    <path d="M14.5 9.5 9.5 14.5"/>
                    <path d="M9.5 9.5h5v5"/>
                  </svg>
                  WBC Token
                </Button>
              </Link>
              <Button
                variant="secondary"
                className="bg-white/5 hover:bg-white/10 text-white border border-white/10 flex items-center gap-2"
                onClick={() => setTabWithUrlUpdate("yield-distribution")}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 15h.01"/></svg>
                Rendimientos
              </Button>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-xs text-slate-400 flex items-center">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse mr-2"></div>
                Gas: 42 Gwei
              </div>
              <div className="px-3 py-1 bg-slate-700/50 rounded-md text-slate-300 text-xs">
                Block #19372401
              </div>
            </div>
          </div>
        </div>
      </div>

      <Tabs 
        value={activeTab} 
        onValueChange={setTabWithUrlUpdate}
        className="admin-tabs">
        {/* Menú de navegación profesional rediseñado */}
        <div className="admin-navigation-container mb-6">
          <div className="bg-white/95 backdrop-blur-sm border border-slate-200/50 rounded-2xl shadow-xl p-6">
            <div className="grid grid-cols-6 gap-3">
              {/* Fila 1 - Gestión Principal */}
              <button
                onClick={() => setTabWithUrlUpdate("pools")}
                className={`admin-nav-button ${activeTab === "pools" ? "active" : ""}`}
              >
                <div className="admin-nav-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="3"/>
                    <path d="M12 1v6m0 6v6"/>
                    <path d="m1 12 6 0m6 0 6 0"/>
                  </svg>
                </div>
                <span className="admin-nav-text">Pools</span>
              </button>

              <button
                onClick={() => setTabWithUrlUpdate("fee-withdrawals")}
                className={`admin-nav-button ${activeTab === "fee-withdrawals" ? "active" : ""}`}
              >
                <div className="admin-nav-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                  </svg>
                </div>
                <span className="admin-nav-text">Retiros</span>
              </button>

              <button
                onClick={() => setTabWithUrlUpdate("admins")}
                className={`admin-nav-button ${activeTab === "admins" ? "active" : ""}`}
              >
                <div className="admin-nav-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                    <path d="m22 11-3-3m0 0-3 3m3-3v12"/>
                  </svg>
                </div>
                <span className="admin-nav-text">Admins</span>
              </button>

              <button
                onClick={() => setTabWithUrlUpdate("positions")}
                className={`admin-nav-button ${activeTab === "positions" ? "active" : ""}`}
              >
                <div className="admin-nav-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 3v18h18"/>
                    <path d="m19 9-5 5-4-4-3 3"/>
                  </svg>
                </div>
                <span className="admin-nav-text">Posiciones</span>
              </button>

              <button
                onClick={() => setTabWithUrlUpdate("invoices")}
                className={`admin-nav-button ${activeTab === "invoices" ? "active" : ""}`}
              >
                <div className="admin-nav-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14,2 14,8 20,8"/>
                    <line x1="16" y1="13" x2="8" y2="13"/>
                    <line x1="16" y1="17" x2="8" y2="17"/>
                    <polyline points="10,9 9,9 8,9"/>
                  </svg>
                </div>
                <span className="admin-nav-text">Facturas</span>
              </button>

              <button
                onClick={() => setTabWithUrlUpdate("billing")}
                className={`admin-nav-button ${activeTab === "billing" ? "active" : ""}`}
              >
                <div className="admin-nav-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="20" height="14" x="2" y="5" rx="2"/>
                    <line x1="2" y1="10" x2="22" y2="10"/>
                  </svg>
                </div>
                <span className="admin-nav-text">Facturación</span>
              </button>

              <button
                onClick={() => setTabWithUrlUpdate("database")}
                className={`admin-nav-button ${activeTab === "database" ? "active" : ""}`}
              >
                <div className="admin-nav-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <ellipse cx="12" cy="5" rx="9" ry="3"/>
                    <path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5"/>
                    <path d="M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3"/>
                  </svg>
                </div>
                <span className="admin-nav-text">Base Datos</span>
              </button>

              {/* Fila 2 - Herramientas y Configuración */}
              <button
                onClick={() => setTabWithUrlUpdate("timeframe")}
                className={`admin-nav-button ${activeTab === "timeframe" ? "active" : ""}`}
              >
                <div className="admin-nav-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12,6 12,12 16,14"/>
                  </svg>
                </div>
                <span className="admin-nav-text">Timeframe</span>
              </button>

              <button
                onClick={() => setTabWithUrlUpdate("support")}
                className={`admin-nav-button ${activeTab === "support" ? "active" : ""}`}
              >
                <div className="admin-nav-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 12l2 2 4-4"/>
                    <path d="M21 12c.552 0 1-.448 1-1V8a2 2 0 0 0-2-2h-1l-1-2h-2l-1 2H8L7 6H5a2 2 0 0 0-2 2v3c0 .552.448 1 1 1"/>
                  </svg>
                </div>
                <span className="admin-nav-text">Soporte</span>
              </button>

              <button
                onClick={() => setTabWithUrlUpdate("videos")}
                className={`admin-nav-button ${activeTab === "videos" ? "active" : ""}`}
              >
                <div className="admin-nav-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="23 7 16 12 23 17 23 7"/>
                    <rect width="15" height="14" x="1" y="5" rx="2" ry="2"/>
                  </svg>
                </div>
                <span className="admin-nav-text">Videos</span>
              </button>

              <button
                onClick={() => setTabWithUrlUpdate("podcasts")}
                className={`admin-nav-button ${activeTab === "podcasts" ? "active" : ""}`}
              >
                <div className="admin-nav-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/>
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                    <line x1="12" y1="19" x2="12" y2="22"/>
                  </svg>
                </div>
                <span className="admin-nav-text">Podcasts</span>
              </button>

              <button
                onClick={() => setTabWithUrlUpdate("leads")}
                className={`admin-nav-button ${activeTab === "leads" ? "active" : ""}`}
              >
                <div className="admin-nav-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                    <path d="m22 11-3-3m0 0-3 3m3-3v12"/>
                  </svg>
                </div>
                <span className="admin-nav-text">Leads</span>
              </button>

              <button
                onClick={() => setTabWithUrlUpdate("version")}
                className={`admin-nav-button ${activeTab === "version" ? "active" : ""}`}
              >
                <div className="admin-nav-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                    <path d="M12 17h.01"/>
                  </svg>
                </div>
                <span className="admin-nav-text">Versión</span>
              </button>

              <button
                onClick={() => setTabWithUrlUpdate("legal")}
                className={`admin-nav-button ${activeTab === "legal" ? "active" : ""}`}
                data-testid="button-nav-legal"
              >
                <div className="admin-nav-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                    <path d="m9 12 2 2 4-4"/>
                  </svg>
                </div>
                <span className="admin-nav-text">Legal</span>
              </button>

              <button
                onClick={() => setTabWithUrlUpdate("yield-distribution")}
                className={`admin-nav-button ${activeTab === "yield-distribution" ? "active" : ""}`}
                data-testid="button-nav-yield-distribution"
              >
                <div className="admin-nav-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="1" x2="12" y2="23"/>
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                    <path d="m16 16 2 2 4-4"/>
                  </svg>
                </div>
                <span className="admin-nav-text">Rendimientos</span>
              </button>
            </div>
          </div>
        </div>
        
        {/* Menú hamburguesa para móviles (visible solo en pantallas pequeñas) */}
        <div className="mobile-menu-container">
          <span className="text-sm font-medium">Panel de Administración</span>
          <Button 
            variant="ghost" 
            size="sm"
            className="mobile-menu-trigger"
            onClick={() => {
              const mobileMenu = document.querySelector('.admin-tabs .mobile-menu');
              if (mobileMenu) {
                mobileMenu.classList.toggle('open');
              }
            }}
          >
            <span>Secciones</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </Button>
          
          <div className="mobile-menu">
            <button className="mobile-menu-item" data-state={activeTab === "pools" ? "active" : ""} onClick={() => setTabWithUrlUpdate("pools")}>
              Administrar Pools
            </button>
            <button className="mobile-menu-item" data-state={activeTab === "admins" ? "active" : ""} onClick={() => setTabWithUrlUpdate("admins")}>
              Administradores
            </button>
            <button className="mobile-menu-item" data-state={activeTab === "positions" ? "active" : ""} onClick={() => setTabWithUrlUpdate("positions")}>
              Posiciones de Usuarios
            </button>
            <button className="mobile-menu-item" data-state={activeTab === "invoices" ? "active" : ""} onClick={() => setTabWithUrlUpdate("invoices")}>
              Facturas
            </button>
            <button className="mobile-menu-item" data-state={activeTab === "billing" ? "active" : ""} onClick={() => setTabWithUrlUpdate("billing")}>
              Perfiles de Facturación
            </button>
            <button className="mobile-menu-item" data-state={activeTab === "timeframe" ? "active" : ""} onClick={() => setTabWithUrlUpdate("timeframe")}>
              Ajustes de Timeframe
            </button>
            <button className="mobile-menu-item" data-state={activeTab === "support" ? "active" : ""} onClick={() => setTabWithUrlUpdate("support")}>
              Tickets de Soporte
            </button>
            <button className="mobile-menu-item" data-state={activeTab === "version" ? "active" : ""} onClick={() => setTabWithUrlUpdate("version")}>
              Versión
            </button>
            <button className="mobile-menu-item" data-state={activeTab === "videos" ? "active" : ""} onClick={() => setTabWithUrlUpdate("videos")}>
              Videos
            </button>
            <button className="mobile-menu-item" data-state={activeTab === "podcasts" ? "active" : ""} onClick={() => setTabWithUrlUpdate("podcasts")}>
              Podcasts
            </button>
            <button className="mobile-menu-item" data-state={activeTab === "leads" ? "active" : ""} onClick={() => setTabWithUrlUpdate("leads")}>
              Leads
            </button>
            <button className="mobile-menu-item" data-state={activeTab === "database" ? "active" : ""} onClick={() => setTabWithUrlUpdate("database")}>
              Base de Datos
            </button>
            <button className="mobile-menu-item" data-state={activeTab === "legal" ? "active" : ""} onClick={() => setTabWithUrlUpdate("legal")}>
              Legal
            </button>
            <button className="mobile-menu-item" data-state={activeTab === "yield-distribution" ? "active" : ""} onClick={() => setTabWithUrlUpdate("yield-distribution")}>
              Rendimientos Trading
            </button>
          </div>
        </div>
        
        <TabsContent value="pools" className="admin-content">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Pools Personalizados</CardTitle>
                <div className="flex gap-2">
                  <Dialog open={openUrlDialog} onOpenChange={setOpenUrlDialog}>
                    <DialogTrigger asChild>
                      <Button size="sm" variant="outline">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Agregar por URL
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Agregar Pool desde URL de Uniswap</DialogTitle>
                        <DialogDescription>
                          Ingresa la URL de un pool de Uniswap para extraer su información
                        </DialogDescription>
                      </DialogHeader>
                      
                      <Form {...urlForm}>
                        <form onSubmit={urlForm.handleSubmit(processPoolUrl)} className="space-y-4">
                          <FormField
                            control={urlForm.control}
                            name="poolUrl"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>URL del Pool</FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="https://app.uniswap.org/explore/pools/ethereum/..."
                                    {...field} 
                                  />
                                </FormControl>
                                <FormDescription>
                                  Ejemplo: https://app.uniswap.org/explore/pools/ethereum/0x88e6A0c2dDD26FEEb64F039a2c41296FcB3f5640
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <DialogFooter>
                            <Button 
                              type="submit" 
                              disabled={isProcessingFromUrl}
                            >
                              {isProcessingFromUrl ? "Procesando..." : "Procesar URL"}
                            </Button>
                          </DialogFooter>
                        </form>
                      </Form>
                    </DialogContent>
                  </Dialog>
                  
                  <Dialog 
                    open={openPoolDialog} 
                    onOpenChange={(open) => {
                      // Cuando se cierra el diálogo, limpiamos el estado de edición
                      if (!open) {
                        setEditingPoolId(null);
                        poolForm.reset({
                          name: "",
                          address: "",
                          networkId: 1,
                          networkName: "ETHEREUM",
                          token0Symbol: "",
                          token1Symbol: "",
                          token0Name: "",
                          token1Name: "",
                          token0Decimals: 18,
                          token1Decimals: 18,
                          token0Address: "",
                          token1Address: "",
                          feeTier: 3000,
                          active: true
                        });
                      }
                      setOpenPoolDialog(open);
                    }}>
                    <DialogTrigger asChild>
                      <Button size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Agregar Pool
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>{editingPoolId !== null ? "Editar Pool" : "Agregar Nuevo Pool"}</DialogTitle>
                        <DialogDescription>
                          {editingPoolId !== null 
                            ? "Modifica los detalles del pool seleccionado" 
                            : "Ingresa los detalles del pool que deseas agregar al selector"}
                        </DialogDescription>
                      </DialogHeader>
                      
                      <Form {...poolForm}>
                        <form onSubmit={poolForm.handleSubmit(onSubmitNewPool)} className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <FormField
                              control={poolForm.control}
                              name="name"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Nombre del Pool</FormLabel>
                                  <FormControl>
                                    <Input {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={poolForm.control}
                              name="address"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Dirección del Pool</FormLabel>
                                  <FormControl>
                                    <Input {...field} placeholder="Dirección o URL completa de Uniswap" />
                                  </FormControl>
                                  <FormDescription>
                                    Puedes ingresar la dirección directamente o pegar una URL completa de Uniswap.
                                    Se admiten formatos como: https://app.uniswap.org/#/pool/123 o https://app.uniswap.org/explore/pools/ethereum/0x123...
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <FormField
                              control={poolForm.control}
                              name="networkId"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>ID de Red</FormLabel>
                                  <FormControl>
                                    <Input type="number" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={poolForm.control}
                              name="networkName"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Nombre de Red</FormLabel>
                                  <FormControl>
                                    <Input {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <FormField
                              control={poolForm.control}
                              name="token0Symbol"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Símbolo Token 0</FormLabel>
                                  <FormControl>
                                    <Input {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={poolForm.control}
                              name="token1Symbol"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Símbolo Token 1</FormLabel>
                                  <FormControl>
                                    <Input {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <FormField
                              control={poolForm.control}
                              name="token0Name"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Nombre Token 0</FormLabel>
                                  <FormControl>
                                    <Input {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={poolForm.control}
                              name="token1Name"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Nombre Token 1</FormLabel>
                                  <FormControl>
                                    <Input {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <FormField
                              control={poolForm.control}
                              name="token0Address"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Dirección Token 0</FormLabel>
                                  <FormControl>
                                    <Input {...field} placeholder="Dirección o 'ETH' para tokens nativos" />
                                  </FormControl>
                                  <FormDescription>
                                    Para tokens nativos como ETH, MATIC, BNB, AVAX, escribe el símbolo directamente.
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={poolForm.control}
                              name="token1Address"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Dirección Token 1</FormLabel>
                                  <FormControl>
                                    <Input {...field} placeholder="Dirección o 'ETH' para tokens nativos" />
                                  </FormControl>
                                  <FormDescription>
                                    Para tokens nativos como ETH, MATIC, BNB, AVAX, escribe el símbolo directamente.
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <FormField
                              control={poolForm.control}
                              name="token0Decimals"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Decimales Token 0</FormLabel>
                                  <FormControl>
                                    <Input type="number" {...field} />
                                  </FormControl>
                                  <FormDescription>
                                    Generalmente 18 para tokens ERC20, 6 para USDC/USDT
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={poolForm.control}
                              name="token1Decimals"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Decimales Token 1</FormLabel>
                                  <FormControl>
                                    <Input type="number" {...field} />
                                  </FormControl>
                                  <FormDescription>
                                    Generalmente 18 para tokens ERC20, 6 para USDC/USDT
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        
                          <div className="grid grid-cols-2 gap-4">
                            <FormField
                              control={poolForm.control}
                              name="feeTier"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Fee Tier (puntos base)</FormLabel>
                                  <FormControl>
                                    <Input type="number" {...field} />
                                  </FormControl>
                                  <FormDescription>
                                    Valores válidos: 100 (0.01%), 500 (0.05%), 3000 (0.3%), 10000 (1%)
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={poolForm.control}
                              name="active"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                  <div className="space-y-0.5">
                                    <FormLabel className="text-base">
                                      Estado Activo
                                    </FormLabel>
                                    <FormDescription>
                                      Este pool estará disponible para los usuarios
                                    </FormDescription>
                                  </div>
                                  <FormControl>
                                    <Switch
                                      checked={field.value}
                                      onCheckedChange={field.onChange}
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                          </div>
                          
                          <DialogFooter>
                            <Button type="submit" disabled={isAddingPool}>
                              {isAddingPool 
                                ? (editingPoolId !== null ? "Guardando..." : "Agregando...") 
                                : (editingPoolId !== null ? "Guardar Cambios" : "Agregar Pool")
                              }
                            </Button>
                          </DialogFooter>
                        </form>
                      </Form>
                    </DialogContent>
                  </Dialog>
                  
                  <Button size="sm" variant="outline" onClick={loadPools} disabled={isLoadingPools}>
                    <RefreshCw className={`w-4 h-4 mr-2 ${isLoadingPools ? 'animate-spin' : ''}`} />
                    Recargar
                  </Button>
                </div>
              </div>
              <CardDescription>
                Administra los pools personalizados que aparecerán en el selector de la aplicación
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingPools ? (
                <div className="flex justify-center py-8">
                  <RefreshCw className="w-6 h-6 animate-spin" />
                </div>
              ) : pools.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  <p>No hay pools personalizados. Agrega uno para comenzar.</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">Estado</TableHead>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Par</TableHead>
                      <TableHead>Red</TableHead>
                      <TableHead>Fee</TableHead>
                      <TableHead>Dirección</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pools.map((pool) => (
                      <TableRow key={pool.id}>
                        <TableCell>
                          <Badge variant={pool.active ? "default" : "outline"}>
                            {pool.active ? "Activo" : "Inactivo"}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium">{pool.name}</TableCell>
                        <TableCell>{`${pool.token0Symbol}/${pool.token1Symbol}`}</TableCell>
                        <TableCell>{pool.networkName}</TableCell>
                        <TableCell>{`${(pool.feeTier / 10000).toFixed(2)}%`}</TableCell>
                        <TableCell 
                          className="font-mono text-xs cursor-pointer hover:text-primary-600"
                          onClick={() => {
                            navigator.clipboard.writeText(pool.address);
                            toast({
                              title: "Dirección copiada",
                              description: "Dirección del pool copiada al portapapeles",
                            });
                          }}
                        >
                          <div className="flex items-center">
                            {`${pool.address.slice(0, 6)}...${pool.address.slice(-4)}`}
                            <Copy className="ml-1 h-3 w-3" />
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => togglePoolStatus(pool.id, pool.active)}
                            >
                              <Power className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => editPool(pool)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => confirmDeletePool(pool.id, pool.name)}
                            >
                              <Trash className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
            <CardFooter>
              <p className="text-sm text-slate-500">
                Total: {pools.length} pools ({pools.filter(p => p.active).length} activos)
              </p>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="admins" className="admin-content">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Administradores</CardTitle>
                  <CardDescription>
                    Usuarios con permisos de administrador
                  </CardDescription>
                </div>
                <Dialog open={openNewAdminDialog} onOpenChange={setOpenNewAdminDialog}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <UserPlus className="w-4 h-4 mr-2" />
                      Añadir Administrador
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Añadir Nuevo Administrador</DialogTitle>
                      <DialogDescription>
                        Ingresa la dirección de wallet del nuevo administrador
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="walletAddress">Dirección de Wallet</Label>
                        <Input 
                          id="walletAddress" 
                          placeholder="0x..." 
                          value={newAdminAddress}
                          onChange={(e) => setNewAdminAddress(e.target.value)}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        onClick={addNewAdmin}
                        disabled={!newAdminAddress || isAddingAdmin}
                      >
                        {isAddingAdmin ? "Añadiendo..." : "Añadir Administrador"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">Estado</TableHead>
                    <TableHead>Dirección</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {admins.map((admin) => (
                    <TableRow key={admin.id}>
                      <TableCell>
                        <Badge variant="default">
                          <Check className="w-3 h-3 mr-1" /> Activo
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono">
                        {admin.walletAddress}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant="ghost"
                          disabled={admin.walletAddress === address}
                          onClick={() => {
                            toast({
                              title: "Función en desarrollo",
                              description: "La eliminación de administradores estará disponible próximamente",
                            });
                          }}
                        >
                          <Trash className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="fee-withdrawals" className="admin-content">
          <FeeWithdrawalsManager />
        </TabsContent>
        
        <TabsContent value="positions" className="admin-content">
          <GlobalPositionStats />
          <UserPositionsManager />
        </TabsContent>
        

        
        <TabsContent value="invoices" className="admin-content">
          <div className="space-y-6">
            <AccountingExport />
            <AdminInvoicesManager />
          </div>
        </TabsContent>
        
        <TabsContent value="billing" className="admin-content">
          <BillingProfilesManager adminWalletAddress={address || ''} />
        </TabsContent>

        <TabsContent value="timeframe" className="admin-content">
          <TimeframeAdjustments />
        </TabsContent>
        
        <TabsContent value="support" className="admin-content">
          <SupportTicketsManager />
        </TabsContent>
        
        <TabsContent value="version" className="admin-content">
          <AppVersionManager />
        </TabsContent>
        
        <TabsContent value="videos" className="admin-content">
          <VideoManagement />
        </TabsContent>

        <TabsContent value="podcasts" className="admin-content">
          <PodcastManagement />
        </TabsContent>
        
        <TabsContent value="leads" className="admin-content">
          <LeadsManager />
        </TabsContent>
        
        <TabsContent value="database" className="admin-content">
          <AdvancedDatabaseMonitor />
        </TabsContent>

        <TabsContent value="legal" className="admin-content">
          <LegalSignaturesManager />
        </TabsContent>

        <TabsContent value="yield-distribution" className="admin-content">
          <YieldDistributionManager />
        </TabsContent>
      </Tabs>
      
      {/* Diálogo de confirmación para eliminar pools */}
      <AlertDialog open={!!deletingPool} onOpenChange={(open) => !open && setDeletingPool(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2 text-red-500" />
              Confirmar Eliminación
            </AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de que deseas eliminar el pool "{deletingPool?.name}"?
              <br />
              <span className="text-red-600 font-medium">Esta acción no se puede deshacer.</span>
              <br />
              <span className="text-sm text-gray-600">Los usuarios ya no podrán acceder a este pool.</span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={executePoolDeletion}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Eliminando...
                </>
              ) : (
                <>
                  <Trash className="w-4 h-4 mr-2" />
                  Eliminar Pool
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}