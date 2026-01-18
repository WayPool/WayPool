import React, { useState, useEffect, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useWallet } from "@/hooks/use-wallet";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { formatAddress } from "@/lib/ethereum";

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

// Función para calcular ganancias respetando valores editados manualmente
const calculateRealTimeEarnings = (positions: any[]): number => {
  // Usando la fecha real del sistema en tiempo real
  const now = new Date();
  console.log(`Calculando ganancias en tiempo real para ${positions.length} posiciones a fecha: ${now.toISOString()}`);
  
  // Filtrar posiciones activas
  const activePositions = positions.filter((pos: any) => pos.status === "Active");
  console.log(`Posiciones activas: ${activePositions.length} de ${positions.length}`);
  
  // Calcular ganancias totales respetando valores editados manualmente
  const totalEarnings = activePositions.reduce((sum: number, pos: any) => {
    // Verificamos información completa de la posición
    console.log(`Datos completos de posición ${pos.id}:`, JSON.stringify({
      deposited: pos.depositedUSDC,
      feesEarned: pos.feesEarned,
      apr: pos.apr,
      status: pos.status,
      startDate: pos.startDate,
      timestamp: pos.timestamp,
      timeframe: pos.timeframe,
      token0: pos.token0,
      token1: pos.token1
    }));
    
    let positionEarnings = 0;
    
    // SIEMPRE calcular automáticamente, ignorando cualquier edición manual
    const startDate = pos.startDate ? new Date(pos.startDate) : new Date(pos.timestamp);
    
    // Calcular minutos exactos transcurridos para mayor precisión
    const minutesElapsed = Math.max(1, Math.floor((now.getTime() - startDate.getTime()) / (1000 * 60)));
    const daysElapsed = minutesElapsed / (24 * 60);
    
    // Calcular las ganancias diarias basadas en APR
    const aprPercentage = parseFloat(String(pos.apr)) / 100;
    const dailyEarnings = (parseFloat(String(pos.depositedUSDC)) * aprPercentage) / 365;
    
    // Calcular ganancias totales basadas en días transcurridos
    positionEarnings = dailyEarnings * daysElapsed;
    
    console.log(`[Admin] Posición ${pos.id}: Calculado automáticamente: ${pos.depositedUSDC} USDC × ${pos.apr}% APR ÷ 365 × ${daysElapsed.toFixed(2)} días = ${positionEarnings.toFixed(2)} USDC`);
    
    return sum + positionEarnings;
  }, 0);
  
  console.log(`Ganancias totales calculadas: ${totalEarnings.toFixed(2)} USDC`);
  return totalEarnings;
};

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  RefreshCw, 
  Check, 
  Info, 
  Edit, 
  User, 
  Search, 
  AlertCircle, 
  AlertTriangle,
  Trash, 
  Trash2,
  Plus, 
  Copy, 
  TrendingUp, 
  SortAsc, 
  ArrowDownUp,
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
  ShieldCheck,
  PlusCircle,
  Loader2,
  Mail,
  Pencil,
  Download,
  FileSpreadsheet,
  MinusCircle
} from "lucide-react";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { withdrawalSchema, type WithdrawalFormValues } from "../../../../shared/schema";

// Interfaces para tipar los datos
interface PositionHistory {
  id: number;
  walletAddress: string;
  tokenId?: string;
  nftTokenId?: string; // ID específico del NFT de Uniswap asociado a esta posición
  poolAddress: string;
  poolName: string;
  token0: string;
  token1: string;
  token0Decimals: number;
  token1Decimals: number;
  token0Amount: string;
  token1Amount: string;
  liquidity_added?: string;
  txHash?: string;
  depositedUSDC: number;
  timestamp: string;
  startDate?: string;
  endDate?: string;
  timeframe: number;
  status: string;
  apr: number;
  currentApr?: number; // APR actual basado en pools (variable diario)
  lastAprUpdate?: string; // Última actualización del APR actual
  feesEarned: number;
  lowerPrice?: number;
  upperPrice?: number;
  inRange?: boolean;
  rangeWidth?: string; // '±10%', '±20%', '±30%', '±40%', '±50%'
  impermanentLossRisk?: string; // 'Low', 'Medium', 'High'
  network?: string; // 'ethereum', 'polygon', etc.
  fee?: string; // Porcentaje de fee del pool (ej: '0.05%', '0.3%', '1%')
  data?: any;
  contractAddress?: string; // Dirección del contrato NFT
  tokenPair?: string; // Par de tokens formateado (ej: 'USDC/WETH')
  nftUrl?: string; // URL completa del NFT
}

interface UserInfo {
  id: number;
  walletAddress: string;
  username?: string;
  email?: string;
  theme: string;
  defaultNetwork: string;
  isAdmin: boolean;
  createdAt: string;
  updatedAt: string;
  isCustodial?: boolean; // Para identificar si es una wallet de WayBank
}

// Esquema de validación para la edición de posiciones
const positionEditSchema = z.object({
  status: z.string().min(1, "Estado requerido"),
  depositedUSDC: z.coerce.number().min(0, "El monto debe ser mayor o igual a 0"),
  feesEarned: z.coerce.number().min(0, "Fees no pueden ser negativos"),
  inRange: z.boolean().optional(),
  apr: z.coerce.number().min(0, "APR no puede ser negativo"),
  timeframe: z.coerce.number().min(1, "Timeframe requerido"), // Timeframe en días (30, 90, 365)
  contractDuration: z.coerce.number().min(365, "Duración del contrato debe ser mínimo 1 año"), // Duración del contrato en días
  lowerPrice: z.coerce.number().optional(),
  upperPrice: z.coerce.number().optional(),
  rangeWidth: z.string().optional(),
  impermanentLossRisk: z.string().optional(),
  nftTokenId: z.string().optional(), // ID del NFT de Uniswap asociado
  network: z.string().optional(), // Red blockchain: ethereum, polygon, etc.
  poolAddress: z.string().optional(), // Dirección del pool en Uniswap
  contractAddress: z.string().optional(), // Dirección del contrato NFT
  tokenPair: z.string().optional(), // Par de tokens (ej: USDC/WETH)
  fee: z.string().optional() // Porcentaje de fee (ej: 0.05%, 0.3%, 1%)
});

// Esquema de validación para crear nuevas posiciones
const createPositionSchema = z.object({
  poolAddress: z.string().min(1, "Pool requerido"),
  depositedUSDC: z.number().min(1, "El monto debe ser mayor a 0"),
  timeframe: z.number().min(1, "Timeframe requerido"),
  status: z.string().default("Pending"),
  apr: z.number().min(0, "APR no puede ser negativo"),
  feesEarned: z.number().default(0),
  startDate: z.string().min(1, "Fecha de inicio requerida"),
  endDate: z.string().min(1, "Fecha de fin requerida"),
  rangeWidth: z.string().optional(), // '±10%', '±20%', '±30%', '±40%', '±50%'
  impermanentLossRisk: z.string().optional(), // 'Low', 'Medium', 'High'
  nftTokenId: z.string().optional(),
  network: z.string().default("ethereum") // Red blockchain: ethereum, polygon, etc.
});

// Esquema de validación para emails
const emailSchema = z.object({
  email: z.string().email({ message: "Por favor, introduce un email válido" }).min(5, {
    message: "El email debe tener al menos 5 caracteres",
  }),
});

type PositionFormValues = z.infer<typeof positionEditSchema>;
type CreatePositionFormValues = z.infer<typeof createPositionSchema>;
type EmailFormValues = z.infer<typeof emailSchema>;

const UserPositionsManager = () => {
  const { address } = useWallet();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchWallet, setSearchWallet] = useState<string>("");
  const [currentSearchWallet, setCurrentSearchWallet] = useState<string>("");
  const [currentStatus, setCurrentStatus] = useState<string>("all");
  const [editingPosition, setEditingPosition] = useState<PositionHistory | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<UserInfo | null>(null);
  const [emailDialogOpen, setEmailDialogOpen] = useState<boolean>(false);
  const [userForEmail, setUserForEmail] = useState<UserInfo | null>(null);
  
  // Estados para registro de retiradas
  const [showWithdrawalForm, setShowWithdrawalForm] = useState(false);
  const [isProcessingWithdrawal, setIsProcessingWithdrawal] = useState(false);
  
  // Estado para paginación y ordenamiento
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10); // Por defecto 10 usuarios por página
  const [sortOrder, setSortOrder] = useState<'az' | 'value' | 'contracts' | 'earnings' | 'status'>('az'); // Opciones de ordenamiento
  
  // Estado para la consulta de pools
  const { data: pools = [] } = useQuery<any[]>({
    queryKey: ['/api/pools/custom'],
    queryFn: async () => await apiRequest('GET', '/api/pools/custom')
  });

  // Formulario para edición de posición
  const form = useForm<PositionFormValues>({
    resolver: zodResolver(positionEditSchema),
    defaultValues: {
      status: "",
      depositedUSDC: 0,
      feesEarned: 0,
      inRange: true,
      apr: 0,
      timeframe: 30, // Valor por defecto: 30 días (1 mes)
      contractDuration: 365, // Valor por defecto: 1 año
      lowerPrice: undefined,
      upperPrice: undefined,
      rangeWidth: "",
      impermanentLossRisk: ""
    }
  });
  
  // Formulario para edición de email
  const emailForm = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: ""
    }
  });
  
  // Formulario para retiradas
  const withdrawalForm = useForm<WithdrawalFormValues>({
    resolver: zodResolver(withdrawalSchema),
    defaultValues: {
      amount: 0,
      notes: "",
    }
  });

  // Consulta para obtener usuarios (admins para ver la lista)
  const { 
    data: users = [], 
    isLoading: isLoadingUsers,
    refetch: refetchUsers
  } = useQuery<UserInfo[]>({
    queryKey: ['/api/admin/users'],
    queryFn: async () => {
      if (!address) return [];
      try {
        const userData = await apiRequest('GET', '/api/admin/users', null, {
          headers: {
            'x-wallet-address': address
          }
        });
        // Depuración: verificar qué usuarios recibimos y si tienen email
        console.log("[ADMIN] Usuarios recibidos:", userData);
        // Ver si los emails están presentes
        const usersWithEmail = userData.filter((u: UserInfo) => u.email);
        console.log("[ADMIN] Usuarios con email:", usersWithEmail.length);
        if (usersWithEmail.length > 0) {
          console.log("[ADMIN] Ejemplo de email:", usersWithEmail[0].email);
        }
        return userData;
      } catch (error) {
        console.error("Error al cargar usuarios:", error);
        return [];
      }
    },
    enabled: !!address
  });

  // Consulta para obtener todas las posiciones
  const {
    data: allPositions = [],
    isLoading: isLoadingAllPositions,
    refetch: refetchAllPositions
  } = useQuery<PositionHistory[]>({
    queryKey: ['/api/admin/all-positions'],
    queryFn: async () => {
      if (!address) return [];
      try {
        // Obtener las posiciones de todos los usuarios iterando sobre la lista de usuarios
        const allPositionsData: PositionHistory[] = [];
        
        if (users && users.length > 0) {
          console.log("Cargando posiciones para", users.length, "usuarios");
          
          // Para cada usuario, obtenemos sus posiciones
          for (const user of users) {
            try {
              const userPositions = await apiRequest('GET', `/api/admin/positions/${user.walletAddress}`, null, {
                headers: { 'x-wallet-address': address }
              });
              
              if (Array.isArray(userPositions) && userPositions.length > 0) {
                console.log(`Usuario ${user.username || user.walletAddress}: ${userPositions.length} posiciones`);
                allPositionsData.push(...userPositions);
              }
            } catch (err) {
              console.error(`Error al cargar posiciones para ${user.walletAddress}:`, err);
            }
          }
          
          console.log("Total de posiciones cargadas:", allPositionsData.length);
        }
        
        return allPositionsData;
      } catch (error) {
        console.error("Error al cargar todas las posiciones:", error);
        return [];
      }
    },
    enabled: !!address && users.length > 0,
    staleTime: 30000
  });

  // Consulta para obtener posiciones del usuario
  const { 
    data: positions = [], 
    isLoading: isLoadingPositions,
    refetch: refetchPositions 
  } = useQuery<PositionHistory[]>({
    queryKey: ['/api/admin/positions', currentSearchWallet],
    queryFn: async () => {
      if (!address || !currentSearchWallet) return [];
      
      try {
        return await apiRequest('GET', `/api/admin/positions/${currentSearchWallet}`, null, {
          headers: {
            'x-wallet-address': address
          }
        });
      } catch (error) {
        console.error("Error al cargar posiciones:", error);
        return [];
      }
    },
    enabled: !!address && !!currentSearchWallet
  });

  // Mutación para eliminar una posición
  const deletePositionMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest('DELETE', `/api/admin/positions/${id}`, null, {
        headers: {
          'x-wallet-address': address || '',
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/positions', currentSearchWallet] });
      queryClient.invalidateQueries({ queryKey: ['/api/position-history', currentSearchWallet] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/all-positions'] });
      
      toast({
        title: "Posición eliminada",
        description: "La posición ha sido eliminada correctamente",
      });
    },
    onError: (error) => {
      console.error("Error al eliminar posición:", error);
      toast({
        title: "Error",
        description: "No se pudo eliminar la posición. Verifica que tienes permisos de administrador.",
        variant: "destructive",
      });
    },
  });
  
  // Mutación para actualizar el email de un usuario
  const updateUserEmailMutation = useMutation({
    mutationFn: async ({ walletAddress, email }: { walletAddress: string, email: string }) => {
      console.log(`[ADMIN] Enviando solicitud de actualización de email para ${walletAddress}:`, email);
      
      // Usar directamente fetch para tener más control sobre la respuesta
      const response = await fetch('/api/admin/users/update-email', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-wallet-address': address || '',
        },
        body: JSON.stringify({ walletAddress, email }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al actualizar email');
      }
      
      const data = await response.json();
      console.log(`[ADMIN] Respuesta de actualización de email:`, data);
      return data;
    },
  });

  // Mutación para actualizar una posición
  const updatePositionMutation = useMutation({
    mutationFn: async ({ id, positionData }: { id: number, positionData: any }) => {
      return await apiRequest('PUT', `/api/admin/positions/${id}`, positionData, {
        headers: {
          'Content-Type': 'application/json',
          'x-wallet-address': address || '',
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/positions', currentSearchWallet] });
      queryClient.invalidateQueries({ queryKey: ['/api/position-history', currentSearchWallet] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/all-positions'] });
      
      toast({
        title: "Posición actualizada",
        description: "La posición ha sido actualizada correctamente",
      });
      
      // Cerrar el diálogo
      setIsDialogOpen(false);
      setEditingPosition(null);
    },
    onError: (error) => {
      console.error("Error al actualizar posición:", error);
      toast({
        title: "Error",
        description: "No se pudo actualizar la posición. Verifica que tienes permisos de administrador.",
        variant: "destructive",
      });
    },
  });

  // Mutación para eliminar un usuario
  const deleteUserMutation = useMutation({
    mutationFn: async (walletAddress: string) => {
      return await apiRequest('DELETE', `/api/admin/users/wallet/${walletAddress}`, null, {
        headers: {
          'Content-Type': 'application/json',
          'x-wallet-address': address || '',
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/all-positions'] });
      
      toast({
        title: "Usuario eliminado",
        description: "El usuario ha sido eliminado correctamente junto con todas sus posiciones",
      });
      
      // Cerrar el diálogo
      setIsDeleteDialogOpen(false);
      setUserToDelete(null);
    },
    onError: (error) => {
      console.error("Error al eliminar usuario:", error);
      toast({
        title: "Error",
        description: "No se pudo eliminar el usuario. Verifica que tienes permisos de administrador o que no estés intentando eliminar tu propio usuario.",
        variant: "destructive",
      });
      setIsDeleteDialogOpen(false);
    },
  });
  
  // Mutación para recolectar fees (usando el sistema existente)
  const createWithdrawalMutation = useMutation({
    mutationFn: async (withdrawalData: any) => {
      // Usar la misma API que ya funciona en "Collect Fees"
      const response = await fetch('/api/fees/collect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          positionId: withdrawalData.positionId,
          amount: withdrawalData.amount,
          walletAddress: withdrawalData.walletAddress,
          poolAddress: withdrawalData.poolAddress,
          token0: withdrawalData.token0,
          token1: withdrawalData.token1
        }),
      });
      
      if (!response.ok) {
        throw new Error('Error al recolectar fees');
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Fees recolectados",
        description: "Los fees han sido recolectados exitosamente. La posición se ha reseteado para el nuevo período.",
      });
      setShowWithdrawalForm(false);
      withdrawalForm.reset();
      setIsProcessingWithdrawal(false);
      // Actualizar las posiciones para reflejar los cambios
      refetchPositions();
    },
    onError: (error: any) => {
      console.error("Error al recolectar fees:", error);
      setIsProcessingWithdrawal(false);
      
      let errorMessage = "No se pudo registrar la retirada";
      
      if (error?.response?.status === 404) {
        errorMessage = "Pool no encontrado. Verifica la configuración de la posición.";
      } else if (error?.response?.status === 400) {
        errorMessage = "Datos inválidos en el formulario. Verifica los campos.";
      } else if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Error al registrar retirada",
        description: errorMessage,
        variant: "destructive",
      });
      
      // NO cerrar el diálogo en caso de error para que el usuario pueda reintentar
      // setShowWithdrawalForm(false);
    },
  });

  // Filtrado de posiciones por estado
  const filteredPositions = positions.filter(position => {
    if (currentStatus === "all") return true;
    return position.status.toLowerCase() === currentStatus.toLowerCase();
  });

  // Manejar la búsqueda por wallet
  const handleSearch = () => {
    if (searchWallet.trim()) {
      setCurrentSearchWallet(searchWallet.trim());
    }
  };

  // Refrescar las posiciones
  const refreshPositions = async () => {
    setIsLoading(true);
    try {
      await Promise.all([refetchPositions(), refetchAllPositions()]);
      toast({
        title: "Datos actualizados",
        description: "Las posiciones han sido actualizadas",
      });
    } catch (error) {
      console.error("Error al refrescar datos:", error);
      toast({
        title: "Error",
        description: "No se pudieron actualizar las posiciones",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Abrir el diálogo de edición de email
  const openEmailDialog = (user: UserInfo) => {
    setUserForEmail(user);
    
    // Si ya hay un email, lo cargamos en el formulario
    emailForm.reset({
      email: user.email || ""
    });
    
    setEmailDialogOpen(true);
  };
  
  // Manejar el envío del formulario de email
  const handleUpdateEmail = async (values: EmailFormValues) => {
    if (!userForEmail) return;
    
    try {
      setIsLoading(true);
      
      // Realizar la actualización
      await updateUserEmailMutation.mutateAsync({
        walletAddress: userForEmail.walletAddress,
        email: values.email
      });
      
      // Forzar una actualización completa de datos
      await refetchUsers();
      
      // Cerrar el diálogo
      setEmailDialogOpen(false);
      setUserForEmail(null);
      
      // Mostrar mensaje de éxito adicional
      console.log("[ADMIN] Email actualizado correctamente para:", userForEmail.walletAddress);
      
      // Forzar actualización de la UI con un pequeño retraso
      setTimeout(() => {
        refetchUsers().then(() => {
          console.log("[ADMIN] Lista de usuarios refrescada después de actualizar email");
        });
      }, 500);
    } catch (error) {
      console.error("Error al actualizar email:", error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el email. Verifica el formato o los permisos.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Abrir el diálogo de edición para una posición
  const openEditDialog = (position: PositionHistory) => {
    setEditingPosition(position);
    
    // Convertir y mostrar los valores existentes en la consola para depuración
    console.log("Abriendo diálogo de edición para posición:", {
      id: position.id,
      status: position.status,
      tokenPair: position.tokenPair || `${position.token0}/${position.token1}`,
      fee: position.fee,
      token0: position.token0,
      token1: position.token1
    });
    
    // Actualizar valores por defecto
    form.reset({
      status: position.status,
      depositedUSDC: position.depositedUSDC || 0,
      feesEarned: position.feesEarned || 0,
      inRange: position.inRange ?? true,
      apr: position.apr || 0,
      timeframe: position.timeframe || 30, // Añadimos el timeframe con valor por defecto 30 días
      contractDuration: (position as any).contractDuration || 365, // Duración del contrato con valor por defecto 1 año
      lowerPrice: position.lowerPrice,
      upperPrice: position.upperPrice,
      rangeWidth: position.rangeWidth || "",
      impermanentLossRisk: position.impermanentLossRisk || "",
      nftTokenId: position.nftTokenId || "",
      network: position.network || "ethereum",
      poolAddress: position.poolAddress || "",
      contractAddress: position.contractAddress || "0xC36442b4a4522E871399CD717aBDD847Ab11FE88", // Contrato NFT de posiciones de Uniswap V3
      // Priorizar el campo tokenPair existente, o construirlo a partir de token0/token1 si no existe
      tokenPair: position.tokenPair || (position.token0 && position.token1 ? `${position.token0}/${position.token1}` : ""),
      // Priorizar el campo fee existente (lo guardamos tal cual viene de la base de datos)
      fee: position.fee || ""
    });
    
    // Resetear formulario de retiradas
    withdrawalForm.reset({
      amount: 0,
      notes: "",
    });
    setShowWithdrawalForm(false);
    
    setIsDialogOpen(true);
  };

  // Manejar la actualización de una posición
  const handleUpdatePosition = (values: PositionFormValues) => {
    if (!editingPosition) return;
    
    // Verificar si estamos cambiando de "Pending" a "Active"
    const isChangingFromPendingToActive = 
      editingPosition.status.toLowerCase() === "pending" && 
      values.status.toLowerCase() === "active";
    
    // Construir el objeto de datos para la actualización
    const positionData: any = {
      status: values.status,
      depositedUSDC: Number(values.depositedUSDC),
      feesEarned: Number(values.feesEarned),
      inRange: values.inRange,
      apr: Number(values.apr),
      timeframe: Number(values.timeframe), // Añadimos el timeframe
      lowerPrice: values.lowerPrice ? Number(values.lowerPrice) : undefined,
      upperPrice: values.upperPrice ? Number(values.upperPrice) : undefined,
      rangeWidth: values.rangeWidth,
      impermanentLossRisk: values.impermanentLossRisk,
      nftTokenId: values.nftTokenId,
      network: values.network,
      poolAddress: values.poolAddress,
      contractAddress: values.contractAddress,
      tokenPair: values.tokenPair,
      fee: values.fee
    };
    
    // Registro para diagnóstico
    console.log("Enviando solicitud de actualización para posición", editingPosition.id, "con datos:", {
      tokenPair: positionData.tokenPair,
      fee: positionData.fee,
      status: positionData.status
    });
    
    // Si estamos cambiando de pendiente a activa, reseteamos fees y actualizamos la fecha de inicio
    if (isChangingFromPendingToActive) {
      positionData.feesEarned = 0; // Resetear ganancias a 0
      positionData.startDate = new Date().toISOString(); // Actualizar fecha de inicio a hoy
      
      console.log("Cambiando posición de Pendiente a Activa:", {
        id: editingPosition.id,
        feesReseteadas: true,
        nuevaFechaInicio: positionData.startDate
      });
    }
    
    // Ejecutar la mutación
    updatePositionMutation.mutate({ id: editingPosition.id, positionData });
  };
  
  // Función para manejar el registro de retiradas (usando sistema existente)
  const handleCreateWithdrawal = (values: WithdrawalFormValues) => {
    if (!editingPosition) return;
    
    setIsProcessingWithdrawal(true);
    
    // Usar los mismos datos que el sistema "Collect Fees" que ya funciona
    const withdrawalData = {
      positionId: editingPosition.id,
      amount: values.amount,
      walletAddress: editingPosition.walletAddress,
      poolAddress: editingPosition.poolAddress,
      token0: editingPosition.token0,
      token1: editingPosition.token1
    };
    
    createWithdrawalMutation.mutate(withdrawalData);
  };
  
  
  // Estado para el diálogo de confirmación de eliminación de posiciones
  const [positionToDelete, setPositionToDelete] = useState<PositionHistory | null>(null);
  
  // Manejar la eliminación de una posición
  const handleDeletePosition = (position: PositionHistory) => {
    if (!position) return;
    
    // Abrir el diálogo de confirmación
    setPositionToDelete(position);
    setIsDeleteDialogOpen(true);
  };
  
  // Confirmar la eliminación
  const confirmDelete = () => {
    if (!positionToDelete) return;
    
    deletePositionMutation.mutate(positionToDelete.id);
    setIsDeleteDialogOpen(false);
    setPositionToDelete(null);
  };

  // Formatear la fecha
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Renderizar mensaje para cada timeframe
  const getTimeframeDisplay = (timeframe: number) => {
    switch (timeframe) {
      case 30:
        return "1 mes";
      case 90:
        return "3 meses";
      case 365:
        return "1 año";
      default:
        return `${timeframe} días`;
    }
  };

  // Determinar el color del estado
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-400";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-800/20 dark:text-yellow-400";
      case "finalized":
        return "bg-blue-100 text-blue-800 dark:bg-blue-800/20 dark:text-blue-400";
      default:
        return "bg-slate-100 text-slate-800 dark:bg-slate-800/20 dark:text-slate-400";
    }
  };
  
  // Mostrar diálogo para eliminar usuario
  const handleDeleteUser = (user: UserInfo) => {
    // No permitir eliminar al usuario actual (admin que está usando la interfaz)
    if (user.walletAddress.toLowerCase() === address?.toLowerCase()) {
      toast({
        title: "Operación no permitida",
        description: "No puedes eliminar tu propio usuario administrador",
        variant: "destructive",
      });
      return;
    }
    
    setUserToDelete(user);
    setIsDeleteDialogOpen(true);
  };
  
  // Confirmar la eliminación del usuario
  const confirmDeleteUser = () => {
    if (!userToDelete) return;
    
    deleteUserMutation.mutate(userToDelete.walletAddress);
  };
  
  // Cálculo de paginación y ordenamiento
  const paginatedUsers = useMemo(() => {
    // Primero ordenamos según el criterio seleccionado
    let sortedUsers = [...users];
    
    if (sortOrder === 'az') {
      // Ordenar alfabéticamente por nombre de usuario
      sortedUsers.sort((a, b) => {
        const usernameA = (a.username || a.walletAddress).toLowerCase();
        const usernameB = (b.username || b.walletAddress).toLowerCase();
        return usernameA.localeCompare(usernameB);
      });
    } else if (sortOrder === 'value') {
      // Ordenar por valor total de posiciones (mayor a menor)
      sortedUsers.sort((a, b) => {
        // Calculamos el valor total de las posiciones de cada usuario
        const positionsA = allPositions.filter(p => 
          p.walletAddress.toLowerCase() === a.walletAddress.toLowerCase()
        );
        const positionsB = allPositions.filter(p => 
          p.walletAddress.toLowerCase() === b.walletAddress.toLowerCase()
        );
        
        const totalValueA = positionsA.reduce((sum, pos) => sum + (Number(pos.depositedUSDC) || 0), 0);
        const totalValueB = positionsB.reduce((sum, pos) => sum + (Number(pos.depositedUSDC) || 0), 0);
        
        // Ordenar de mayor a menor
        return totalValueB - totalValueA;
      });
    } else if (sortOrder === 'contracts') {
      // Ordenar por número de contratos (mayor a menor)
      sortedUsers.sort((a, b) => {
        const positionsA = allPositions.filter(p => 
          p.walletAddress.toLowerCase() === a.walletAddress.toLowerCase()
        ).length;
        const positionsB = allPositions.filter(p => 
          p.walletAddress.toLowerCase() === b.walletAddress.toLowerCase()
        ).length;
        
        // Ordenar de mayor a menor
        return positionsB - positionsA;
      });
    } else if (sortOrder === 'earnings') {
      // Ordenar por ganancias totales (mayor a menor)
      sortedUsers.sort((a, b) => {
        const positionsA = allPositions.filter(p => 
          p.walletAddress.toLowerCase() === a.walletAddress.toLowerCase()
        );
        const positionsB = allPositions.filter(p => 
          p.walletAddress.toLowerCase() === b.walletAddress.toLowerCase()
        );
        
        const totalEarningsA = positionsA.reduce((sum, pos) => sum + (Number(pos.feesEarned) || 0), 0);
        const totalEarningsB = positionsB.reduce((sum, pos) => sum + (Number(pos.feesEarned) || 0), 0);
        
        // Ordenar de mayor a menor
        return totalEarningsB - totalEarningsA;
      });
    } else if (sortOrder === 'status') {
      // Ordenar por estado (primero activas, luego pendientes, finalmente finalizadas)
      sortedUsers.sort((a, b) => {
        const positionsA = allPositions.filter(p => 
          p.walletAddress.toLowerCase() === a.walletAddress.toLowerCase()
        );
        const positionsB = allPositions.filter(p => 
          p.walletAddress.toLowerCase() === b.walletAddress.toLowerCase()
        );
        
        const activeA = positionsA.filter(p => p.status === "Active").length;
        const activeB = positionsB.filter(p => p.status === "Active").length;
        
        // Si hay diferencia en activas, priorizar por número de activas
        if (activeA !== activeB) {
          return activeB - activeA;
        }
        
        const pendingA = positionsA.filter(p => p.status === "Pending").length;
        const pendingB = positionsB.filter(p => p.status === "Pending").length;
        
        // Si hay diferencia en pendientes, priorizar por número de pendientes
        if (pendingA !== pendingB) {
          return pendingB - pendingA;
        }
        
        // Finalmente ordenar por finalizadas
        const finalizedA = positionsA.filter(p => p.status === "Finalized").length;
        const finalizedB = positionsB.filter(p => p.status === "Finalized").length;
        
        return finalizedB - finalizedA;
      });
    }
    
    // Luego aplicamos la paginación
    if (pageSize === 0) return sortedUsers; // Mostrar todos
    
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return sortedUsers.slice(startIndex, endIndex);
  }, [users, currentPage, pageSize, sortOrder, allPositions]);
  
  // Total de páginas
  const totalPages = useMemo(() => {
    if (pageSize === 0) return 1; // Si mostramos todos, solo hay 1 página
    return Math.ceil(users.length / pageSize);
  }, [users, pageSize]);
  
  // Cambiar de página
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  
  // Cambiar el tamaño de página
  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1); // Volver a la primera página al cambiar el tamaño
  };

  // Función para exportar datos a CSV
  const exportToCSV = () => {
    if (!users.length || !allPositions.length) {
      toast({
        title: "Sin datos para exportar",
        description: "No hay usuarios o posiciones disponibles para exportar",
        variant: "destructive"
      });
      return;
    }

    // Crear datos combinados con información completa
    const exportData = users.map(user => {
      const userPositions = allPositions.filter(p => 
        p.walletAddress.toLowerCase() === user.walletAddress.toLowerCase()
      );
      
      // Calcular métricas del usuario
      const totalValue = userPositions.reduce((sum, pos) => sum + (Number(pos.depositedUSDC) || 0), 0);
      const totalEarnings = calculateRealTimeEarnings(userPositions);
      const activePositions = userPositions.filter(p => p.status === "Active").length;
      const pendingPositions = userPositions.filter(p => p.status === "Pending").length;
      const finalizedPositions = userPositions.filter(p => p.status === "Finalized").length;

      return {
        // Información del Usuario
        'ID Usuario': user.id,
        'Dirección Wallet': user.walletAddress,
        'Nombre Usuario': user.username || 'Sin nombre',
        'Email': user.email || 'Sin email',
        'Es Admin': user.isAdmin ? 'Sí' : 'No',
        'Es Custodiada': user.isCustodial ? 'Sí' : 'No',
        'Tema': user.theme,
        'Red Predeterminada': user.defaultNetwork,
        'Fecha Creación': new Date(user.createdAt).toLocaleString('es-ES'),
        'Última Actualización': new Date(user.updatedAt).toLocaleString('es-ES'),
        
        // Métricas de Posiciones
        'Total Posiciones': userPositions.length,
        'Posiciones Activas': activePositions,
        'Posiciones Pendientes': pendingPositions,
        'Posiciones Finalizadas': finalizedPositions,
        'Capital Total (USDC)': totalValue.toFixed(2),
        'Ganancias Totales (USDC)': totalEarnings.toFixed(2),
        'ROI Promedio (%)': totalValue > 0 ? ((totalEarnings / totalValue) * 100).toFixed(2) : '0.00',
        
        // Detalles de Posiciones (concatenadas)
        'IDs Posiciones': userPositions.map(p => p.id).join('; '),
        'Pools': userPositions.map(p => p.poolName).join('; '),
        'Tokens': userPositions.map(p => `${p.token0}/${p.token1}`).join('; '),
        'APRs (%)': userPositions.map(p => p.apr).join('; '),
        'Estados': userPositions.map(p => p.status).join('; '),
        'Timeframes (días)': userPositions.map(p => p.timeframe).join('; '),
        'Fechas Inicio': userPositions.map(p => p.startDate ? new Date(p.startDate).toLocaleDateString('es-ES') : 'N/A').join('; '),
        'Fechas Fin': userPositions.map(p => p.endDate ? new Date(p.endDate).toLocaleDateString('es-ES') : 'N/A').join('; '),
        'Redes': userPositions.map(p => p.network || 'ethereum').join('; '),
        'Fees Ganados': userPositions.map(p => (p.feesEarned || 0).toFixed(2)).join('; ')
      };
    });

    // Convertir a CSV
    const headers = Object.keys(exportData[0]);
    const csvContent = [
      headers.join(','),
      ...exportData.map(row => 
        headers.map(header => {
          const value = row[header as keyof typeof row];
          // Escapar comillas y envolver en comillas si contiene comas
          const stringValue = String(value || '');
          return stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')
            ? `"${stringValue.replace(/"/g, '""')}"` 
            : stringValue;
        }).join(',')
      )
    ].join('\n');

    // Crear y descargar archivo
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `waybank_usuarios_posiciones_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Exportación completada",
      description: `Se han exportado ${exportData.length} usuarios con sus posiciones a CSV`
    });
  };

  // Función para exportar solo posiciones detalladas
  const exportPositionsToCSV = () => {
    if (!allPositions.length) {
      toast({
        title: "Sin posiciones para exportar",
        description: "No hay posiciones disponibles para exportar",
        variant: "destructive"
      });
      return;
    }

    // Crear datos detallados de posiciones
    const positionsData = allPositions.map(position => {
      const user = users.find(u => u.walletAddress.toLowerCase() === position.walletAddress.toLowerCase());
      const realTimeEarnings = calculateRealTimeEarnings([position]);
      
      return {
        // Información de la Posición
        'ID Posición': position.id,
        'Dirección Wallet': position.walletAddress,
        'Nombre Usuario': user?.username || 'Sin nombre',
        'Email Usuario': user?.email || 'Sin email',
        'Es Custodiada': user?.isCustodial ? 'Sí' : 'No',
        
        // Detalles del Pool
        'Dirección Pool': position.poolAddress,
        'Nombre Pool': position.poolName,
        'Token 0': position.token0,
        'Token 1': position.token1,
        'Decimales Token 0': position.token0Decimals,
        'Decimales Token 1': position.token1Decimals,
        'Cantidad Token 0': position.token0Amount,
        'Cantidad Token 1': position.token1Amount,
        'Red': position.network || 'ethereum',
        'Fee Pool': position.fee || 'N/A',
        
        // Información Financiera
        'USDC Depositado': Number(position.depositedUSDC).toFixed(2),
        'APR (%)': position.apr,
        'Fees Ganados': Number(position.feesEarned || 0).toFixed(2),
        'Ganancias Tiempo Real': realTimeEarnings.toFixed(2),
        'ROI Actual (%)': position.depositedUSDC > 0 ? ((realTimeEarnings / Number(position.depositedUSDC)) * 100).toFixed(2) : '0.00',
        
        // Configuración de Posición
        'Estado': position.status,
        'Timeframe (días)': position.timeframe,
        'Fecha Inicio': position.startDate ? new Date(position.startDate).toLocaleString('es-ES') : 'N/A',
        'Fecha Fin': position.endDate ? new Date(position.endDate).toLocaleString('es-ES') : 'N/A',
        'Fecha Creación': new Date(position.timestamp).toLocaleString('es-ES'),
        
        // Información de Rango (si disponible)
        'Precio Inferior': position.lowerPrice || 'N/A',
        'Precio Superior': position.upperPrice || 'N/A',
        'En Rango': position.inRange !== undefined ? (position.inRange ? 'Sí' : 'No') : 'N/A',
        'Ancho Rango': position.rangeWidth || 'N/A',
        'Riesgo IL': position.impermanentLossRisk || 'N/A',
        
        // Información NFT (si disponible)
        'Token ID NFT': position.nftTokenId || 'N/A',
        'Token ID Blockchain': position.tokenId || 'N/A',
        'Contrato NFT': position.contractAddress || 'N/A',
        'URL NFT': position.nftUrl || 'N/A',
        
        // Información Técnica
        'Liquidez Añadida': position.liquidity_added || 'N/A',
        'Hash Transacción': position.txHash || 'N/A',
        'Par Tokens': position.tokenPair || `${position.token0}/${position.token1}`,
        'Datos Adicionales': position.data ? JSON.stringify(position.data) : 'N/A'
      };
    });

    // Convertir a CSV
    const headers = Object.keys(positionsData[0]);
    const csvContent = [
      headers.join(','),
      ...positionsData.map(row => 
        headers.map(header => {
          const value = row[header as keyof typeof row];
          const stringValue = String(value || '');
          return stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')
            ? `"${stringValue.replace(/"/g, '""')}"` 
            : stringValue;
        }).join(',')
      )
    ].join('\n');

    // Crear y descargar archivo
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `waybank_posiciones_detalladas_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Exportación completada",
      description: `Se han exportado ${positionsData.length} posiciones detalladas a CSV`
    });
  };

  return (
    <Card className="user-positions-card">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Gestión de Posiciones de Usuarios</CardTitle>
            <CardDescription>
              Ver y editar las posiciones de liquidez de los usuarios
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="default"
              size="sm" 
              onClick={() => setIsCreateDialogOpen(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Nueva Posición
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={refreshPositions}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
              Actualizar
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={exportToCSV}
              disabled={!users.length || !allPositions.length}
            >
              <Download className="h-4 w-4 mr-2" />
              Exportar Usuarios
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={exportPositionsToCSV}
              disabled={!allPositions.length}
            >
              <FileSpreadsheet className="h-4 w-4 mr-2" />
              Exportar Posiciones
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="admin-content">
        <div className="space-y-6">
          {/* Buscador de wallet */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Input
                placeholder="Buscar por dirección de wallet"
                value={searchWallet}
                onChange={(e) => setSearchWallet(e.target.value)}
                className="pr-10"
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <Button 
                variant="ghost" 
                size="sm" 
                className="absolute right-0 top-0 h-full"
                onClick={handleSearch}
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
            <Select value={currentStatus} onValueChange={setCurrentStatus}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrar por estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="active">Activas</SelectItem>
                <SelectItem value="pending">Pendientes</SelectItem>
                <SelectItem value="finalized">Finalizadas</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Lista de usuarios para selección rápida */}
          {users.length > 0 && (
            <div className="border border-slate-200 dark:border-slate-700 rounded-md p-3">
              <div className="mb-3">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-medium flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    Usuarios con posiciones: 
                    <span className="ml-2 text-xs text-slate-500">
                      {`${users.length} usuarios (${pageSize > 0 ? `Página ${currentPage} de ${totalPages}` : 'Mostrando todos'})`}
                    </span>
                  </h4>
                  
                  <Select value={pageSize.toString()} onValueChange={(val) => handlePageSizeChange(Number(val))}>
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="Por página" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10 por página</SelectItem>
                      <SelectItem value="25">25 por página</SelectItem>
                      <SelectItem value="50">50 por página</SelectItem>
                      <SelectItem value="100">100 por página</SelectItem>
                      <SelectItem value="0">Todos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Cabecera con columnas y botones de ordenamiento */}
                <div className="grid grid-cols-6 gap-1 bg-slate-100 dark:bg-slate-800/50 rounded p-2 mb-2">
                  {/* Columna 1 - Usuario */}
                  <div className="flex items-center">
                    <Button 
                      variant={sortOrder === 'az' ? "default" : "ghost"} 
                      size="sm"
                      onClick={() => setSortOrder('az')}
                      className="h-8 px-3 rounded shadow-none"
                    >
                      <span className="mr-2">Usuario</span>
                      <SortAsc className={`h-4 w-4 ${sortOrder === 'az' ? 'text-white' : 'text-slate-400'}`} />
                    </Button>
                  </div>
                  
                  {/* Columna 2 - Email */}
                  <div className="flex items-center justify-center">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="h-8 px-3 rounded shadow-none"
                      disabled
                    >
                      <span className="mr-2">Email</span>
                    </Button>
                  </div>
                  
                  {/* Columna 3 - Contratos */}
                  <div className="flex items-center justify-center">
                    <Button 
                      variant={sortOrder === 'contracts' ? "default" : "ghost"} 
                      size="sm"
                      onClick={() => setSortOrder('contracts')}
                      className="h-8 px-3 rounded shadow-none"
                    >
                      <span className="mr-2">Contratos</span>
                      <ArrowDownUp className={`h-4 w-4 ${sortOrder === 'contracts' ? 'text-white' : 'text-slate-400'}`} />
                    </Button>
                  </div>
                  
                  {/* Columna 4 - Valor */}
                  <div className="flex items-center justify-end">
                    <Button 
                      variant={sortOrder === 'value' ? "default" : "ghost"} 
                      size="sm"
                      onClick={() => setSortOrder('value')}
                      className="h-8 px-3 rounded shadow-none ml-auto"
                    >
                      <span className="mr-2">Valor</span>
                      <TrendingUp className={`h-4 w-4 ${sortOrder === 'value' ? 'text-white' : 'text-slate-400'}`} />
                    </Button>
                  </div>
                  
                  {/* Columna 5 - Ganancias */}
                  <div className="flex items-center justify-center">
                    <Button 
                      variant={sortOrder === 'earnings' ? "default" : "ghost"} 
                      size="sm"
                      onClick={() => setSortOrder('earnings')}
                      className="h-8 px-3 rounded shadow-none"
                    >
                      <span className="mr-2">Ganancias</span>
                      <TrendingUp className={`h-4 w-4 ${sortOrder === 'earnings' ? 'text-white' : 'text-slate-400'}`} />
                    </Button>
                  </div>
                  
                  {/* Columna 6 - Estado */}
                  <div className="flex items-center justify-end">
                    <Button 
                      variant={sortOrder === 'status' ? "default" : "ghost"} 
                      size="sm"
                      onClick={() => setSortOrder('status')}
                      className="h-8 px-3 rounded shadow-none ml-auto"
                    >
                      <span className="mr-2">Estado</span>
                      <ArrowDownUp className={`h-4 w-4 ${sortOrder === 'status' ? 'text-white' : 'text-slate-400'}`} />
                    </Button>
                  </div>
                </div>
              </div>
              <div className="grid gap-2">
                {paginatedUsers.map((user) => {
                  // Obtener las posiciones de este usuario a partir de allPositions
                  const userPositions = allPositions.filter(p => 
                    p.walletAddress.toLowerCase() === user.walletAddress.toLowerCase()
                  );
                  
                  console.log(`Posiciones para ${user.username || user.walletAddress}:`, userPositions.length);
                  
                  // Contar las posiciones por estado
                  const activePositions = userPositions.filter(p => p.status === "Active").length;
                  const pendingPositions = userPositions.filter(p => p.status === "Pending").length;
                  const finalizedPositions = userPositions.filter(p => p.status === "Finalized").length;
                  
                  // Calcular valor total de contratos
                  const totalValue = userPositions.reduce((acc, pos) => {
                    const deposit = typeof pos.depositedUSDC === 'string' 
                      ? parseFloat(pos.depositedUSDC) 
                      : (pos.depositedUSDC || 0);
                    return acc + deposit;
                  }, 0);
                  
                  const totalFeesEarned = userPositions.reduce((acc, pos) => {
                    const fees = typeof pos.feesEarned === 'string' 
                      ? parseFloat(pos.feesEarned) 
                      : (pos.feesEarned || 0);
                    return acc + fees;
                  }, 0);
                  
                  return (
                    <div 
                      key={user.id} 
                      className={`border rounded-lg p-3 ${currentSearchWallet === user.walletAddress ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50'}`}
                      onClick={() => {
                        setSearchWallet(user.walletAddress);
                        setCurrentSearchWallet(user.walletAddress);
                      }}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="grid grid-cols-6 gap-1">
                        {/* Columna 1 - Usuario y dirección */}
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-full ${
                            user.isCustodial 
                            ? "bg-blue-100 dark:bg-blue-900/30" 
                            : "bg-slate-100 dark:bg-slate-700"
                          }`}>
                            <User className={`h-5 w-5 ${
                              user.isCustodial 
                              ? "text-blue-600 dark:text-blue-400" 
                              : "text-slate-500 dark:text-slate-400"
                            }`} />
                          </div>
                          <div>
                            <div className="font-medium flex items-center gap-1">
                              {user.isAdmin ? (
                                <div className="flex items-center gap-1">
                                  <span>{user.username || "Usuario"}</span>
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <span className="inline-flex items-center">
                                          <ShieldCheck className="h-4 w-4 text-indigo-500 dark:text-indigo-400" />
                                        </span>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>Usuario Administrador</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                </div>
                              ) : (
                                <span>{user.username || "Usuario"}</span>
                              )}
                            </div>
                            <div className="text-xs text-slate-500 font-mono flex items-center">
                              <span>{formatAddress(user.walletAddress)}</span>
                              <button
                                className="ml-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigator.clipboard.writeText(user.walletAddress);
                                  toast({
                                    title: "Dirección copiada",
                                    description: "La dirección del wallet ha sido copiada al portapapeles",
                                    duration: 2000,
                                  });
                                }}
                                aria-label="Copiar dirección de wallet"
                              >
                                <Copy className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                        
                        {/* Columna 2 - Email */}
                        <div className="bg-slate-50 dark:bg-slate-800/40 px-4 py-1.5 flex flex-col justify-center items-start">
                          {/* Botón debug (visible) para mostrar detalles del usuario en consola */}
                          <button 
                            className="absolute top-0 right-0 opacity-0 hover:opacity-100"
                            onClick={(e) => {
                              e.stopPropagation();
                              console.log(`DEBUG: Usuario ${user.walletAddress}:`, user);
                              toast({
                                title: "Datos de usuario",
                                description: `Email: ${user.email || "No definido"}, ID: ${user.id}`,
                                duration: 3000,
                              });
                            }}
                          >
                            <Info className="h-3 w-3" />
                          </button>
                          
                          {user.email && user.email.length > 0 ? (
                            <div className="text-sm flex items-center gap-2">
                              <Mail className="h-3.5 w-3.5 text-green-500 flex-shrink-0" />
                              <span className="text-slate-800 dark:text-slate-200 truncate max-w-[150px]" title={user.email}>
                                {user.email}
                              </span>
                              <div className="flex items-center flex-shrink-0 gap-1 relative z-10">
                                <button
                                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700 relative z-20"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    navigator.clipboard.writeText(user.email || "");
                                    toast({
                                      title: "Email copiado",
                                      description: "El email ha sido copiado al portapapeles",
                                      duration: 2000,
                                    });
                                  }}
                                  aria-label="Copiar email"
                                >
                                  <Copy className="h-3.5 w-3.5" />
                                </button>
                                <button
                                  className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors p-2 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20 relative z-30 border border-transparent hover:border-blue-200"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    
                                    console.log("[EDIT EMAIL] ✏️ BOTÓN DEL LÁPIZ CLICKEADO para:", user.walletAddress, "Email:", user.email);
                                    
                                    // Configurar diálogo inmediatamente
                                    setUserForEmail(user);
                                    emailForm.reset({ email: user.email || "" });
                                    setEmailDialogOpen(true);
                                    
                                    console.log("[EDIT EMAIL] ✅ DIÁLOGO DEBERÍA ESTAR ABIERTO AHORA");
                                  }}
                                  aria-label="Editar email"
                                  title="Editar email"
                                  style={{ minWidth: '32px', minHeight: '32px' }}
                                >
                                  <Edit className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center w-full">
                              <Mail className="h-3.5 w-3.5 text-yellow-500 mr-1.5 flex-shrink-0" />
                              <span className="text-slate-400 dark:text-slate-500 italic mr-2 text-xs">
                                {user.isCustodial ? "Email WayBank pendiente" : "No hay email configurado"}
                              </span>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <button
                                      className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors flex-shrink-0 p-1 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        console.log("[DEBUG] Botón de añadir email clickeado para usuario:", user.walletAddress);
                                        console.log("[DEBUG] Estado actual emailDialogOpen:", emailDialogOpen);
                                        
                                        // Abrir el diálogo para añadir email
                                        setUserForEmail(user);
                                        emailForm.reset({
                                          email: ""
                                        });
                                        setEmailDialogOpen(true);
                                        
                                        console.log("[DEBUG] Diálogo de email debería estar abierto ahora");
                                      }}
                                      aria-label="Añadir email"
                                      title="Añadir email"
                                    >
                                      <PlusCircle className="h-4 w-4" />
                                    </button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Añadir email</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                          )}
                        </div>
                        
                        {/* Columna 3 - Contratos */}
                        <div className="bg-slate-50 dark:bg-slate-800/40 px-4 py-1.5 flex flex-col justify-center items-center" style={{ padding: '10px', paddingLeft: '30px' }}>
                          <div className="font-semibold text-base">{userPositions.length}</div>
                        </div>
                        
                        {/* Columna 4 - Valor */}
                        <div className="bg-slate-50 dark:bg-slate-800/40 px-4 py-1.5 flex flex-col justify-center items-end">
                          <div className="font-semibold text-base">{formatCurrency(totalValue)}</div>
                        </div>
                        
                        {/* Columna 5 - Ganancias (calculadas en tiempo real) */}
                        <div className="bg-slate-50 dark:bg-slate-800/40 px-4 py-1.5 flex flex-col justify-center items-center">
                          <div className="font-semibold text-base text-green-600">{formatCurrency(calculateRealTimeEarnings(userPositions))}</div>
                        </div>
                        
                        {/* Columna 6 - Estado */}
                        <div className="bg-slate-50 dark:bg-slate-800/40 px-4 py-1.5 flex flex-col justify-center items-end">
                          <div className="flex justify-end gap-1">
                            {activePositions > 0 && (
                              <Badge variant="default" className="text-xs py-0 h-5">
                                {activePositions} A
                              </Badge>
                            )}
                            {pendingPositions > 0 && (
                              <Badge variant="outline" className="text-xs py-0 h-5">
                                {pendingPositions} P
                              </Badge>
                            )}
                            {finalizedPositions > 0 && (
                              <Badge variant="secondary" className="text-xs py-0 h-5">
                                {finalizedPositions} F
                              </Badge>
                            )}
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-5 w-5 ml-1 text-red-500 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900/20"
                              title="Eliminar usuario"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteUser(user);
                              }}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {/* Controles de paginación */}
              {pageSize > 0 && totalPages > 1 && (
                <div className="flex justify-center mt-4 gap-1">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handlePageChange(1)}
                    disabled={currentPage === 1}
                  >
                    <span className="sr-only">Primera página</span>
                    <span>«</span>
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <span className="sr-only">Página anterior</span>
                    <span>‹</span>
                  </Button>
                  
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    // Cálculo de páginas a mostrar (siempre mostramos máximo 5 páginas)
                    let pageNumber;
                    if (totalPages <= 5) {
                      // Si hay 5 o menos páginas, mostramos todas
                      pageNumber = i + 1;
                    } else if (currentPage <= 3) {
                      // Si estamos en las primeras páginas
                      pageNumber = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      // Si estamos en las últimas páginas
                      pageNumber = totalPages - 4 + i;
                    } else {
                      // Si estamos en medio
                      pageNumber = currentPage - 2 + i;
                    }
                    
                    return (
                      <Button
                        key={pageNumber}
                        variant={currentPage === pageNumber ? "default" : "outline"}
                        size="icon"
                        onClick={() => handlePageChange(pageNumber)}
                      >
                        {pageNumber}
                      </Button>
                    );
                  })}
                  
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    <span className="sr-only">Página siguiente</span>
                    <span>›</span>
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handlePageChange(totalPages)}
                    disabled={currentPage === totalPages}
                  >
                    <span className="sr-only">Última página</span>
                    <span>»</span>
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Estado de la búsqueda */}
          {currentSearchWallet && (
            <>
              <div id="user-positions-section" className="flex items-center justify-between bg-slate-50 dark:bg-slate-800 p-3 rounded-md">
                <div>
                  <span className="text-sm text-slate-500 dark:text-slate-400">Mostrando posiciones para:</span>
                  <div className="font-mono ml-2 inline-flex items-center">
                    <span>{formatAddress(currentSearchWallet)}</span>
                    <button
                      className="ml-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                      onClick={() => {
                        navigator.clipboard.writeText(currentSearchWallet);
                        toast({
                          title: "Dirección copiada",
                          description: "La dirección del wallet ha sido copiada al portapapeles",
                          duration: 2000,
                        });
                      }}
                      aria-label="Copiar dirección de wallet"
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={filteredPositions.length > 0 ? "default" : "outline"}>
                    {filteredPositions.length} posiciones
                  </Badge>
                  <Button 
                    size="sm" 
                    onClick={() => setIsCreateDialogOpen(true)}
                  >
                    Crear Posición
                  </Button>
                </div>
              </div>
              
              {/* Panel de estadísticas - 8 tarjetas en 2 filas de 4 */}
              {filteredPositions.length > 0 && (
                <div id="estadisticas-panel" className="mt-6 mb-8 space-y-4 bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow">
                  <h2 className="text-xl font-bold mb-4 text-slate-900 dark:text-slate-50 flex items-center">
                    <BarChart className="mr-2 h-5 w-5" /> 
                    Métricas del Usuario: {users.find(u => u.walletAddress.toLowerCase() === currentSearchWallet.toLowerCase())?.username || formatAddress(currentSearchWallet)}
                  </h2>
                  
                  {/* Primera fila - 4 tarjetas */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Tarjeta 1: Capital Total Invertido */}
                    <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 mr-3">
                          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Capital Total</p>
                          <h3 className="text-2xl font-bold mt-1 text-slate-900 dark:text-slate-50">
                            {formatCurrency(filteredPositions.reduce((sum, p) => sum + Number(p.depositedUSDC), 0))}
                          </h3>
                          <div className="flex items-center mt-1 text-xs">
                            <span className="text-green-600">
                              <ArrowUpRight className="h-3 w-3 inline mr-1" />
                              {formatNumber(filteredPositions.filter(p => p.status === "Active").length / filteredPositions.length * 100)}%
                            </span>
                            <span className="text-slate-500 dark:text-slate-400 ml-1">activas</span>
                          </div>
                        </div>
                        <div className="flex-shrink-0 bg-blue-100 dark:bg-blue-900/30 p-2 rounded-md">
                          <Coins className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                        </div>
                      </div>
                    </div>

                    {/* Tarjeta 2: Ganancias Generadas */}
                    <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 mr-3">
                          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Ganancias Totales</p>
                          <h3 className="text-2xl font-bold mt-1 text-green-600 dark:text-green-400">
                            {formatCurrency(calculateRealTimeEarnings(filteredPositions))}
                          </h3>
                          <div className="flex items-center mt-1 text-xs">
                            <span className="text-blue-600">
                              <TrendingUp className="h-3 w-3 inline mr-1" />
                              {formatNumber(calculateRealTimeEarnings(filteredPositions) / 
                                filteredPositions.reduce((sum, p) => sum + Number(p.depositedUSDC), 0) * 100)}%
                            </span>
                            <span className="text-slate-500 dark:text-slate-400 ml-1">del capital</span>
                          </div>
                          <div className="flex items-center mt-1">
                            <span className="text-[10px] text-slate-500 dark:text-slate-400">actualizado en tiempo real</span>
                          </div>
                        </div>
                        <div className="flex-shrink-0 bg-green-100 dark:bg-green-900/30 p-2 rounded-md">
                          <DollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />
                        </div>
                      </div>
                    </div>

                    {/* Tarjeta 3: APR Promedio */}
                    <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 mr-3">
                          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">APR Promedio</p>
                          <h3 className="text-2xl font-bold mt-1 text-purple-600 dark:text-purple-400">
                            {formatNumber(filteredPositions.reduce((sum, p) => sum + Number(p.apr), 0) / 
                              (filteredPositions.length || 1))}%
                          </h3>
                          <div className="flex items-center mt-1 text-xs">
                            <span className="text-purple-600">
                              <ActivitySquare className="h-3 w-3 inline mr-1" />
                              {filteredPositions.filter(p => Number(p.apr) > 50).length}
                            </span>
                            <span className="text-slate-500 dark:text-slate-400 ml-1">posiciones con alto APR</span>
                          </div>
                        </div>
                        <div className="flex-shrink-0 bg-purple-100 dark:bg-purple-900/30 p-2 rounded-md">
                          <BarChart className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                        </div>
                      </div>
                    </div>

                    {/* Tarjeta 4: Distribución de Estados */}
                    <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 mr-3">
                          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Estados</p>
                          <div className="flex flex-wrap items-center gap-2 mt-1">
                            <Badge variant="default" className="py-1">
                              {filteredPositions.filter(p => p.status === "Active").length} Activas
                            </Badge>
                            <Badge variant="secondary" className="py-1">
                              {filteredPositions.filter(p => p.status === "Pending").length} Pendientes
                            </Badge>
                            <Badge variant="outline" className="py-1">
                              {filteredPositions.filter(p => p.status === "Finalized").length} Finalizadas
                            </Badge>
                          </div>
                          <div className="flex items-center mt-2 text-xs">
                            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5">
                              <div className="bg-green-500 h-1.5 rounded-full" style={{ width: `${filteredPositions.filter(p => p.status === "Active").length / filteredPositions.length * 100}%` }}></div>
                            </div>
                          </div>
                        </div>
                        <div className="flex-shrink-0 bg-indigo-100 dark:bg-indigo-900/30 p-2 rounded-md">
                          <PieChart className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Segunda fila - 4 tarjetas */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Tarjeta 5: Distribución por Red */}
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
                                {filteredPositions.filter(p => !p.network || p.network === 'ethereum').length}
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <div className="flex items-center">
                                <div className="w-2 h-2 rounded-full bg-purple-500 mr-2"></div>
                                <span className="text-sm">Polygon</span>
                              </div>
                              <span className="text-sm font-medium">
                                {filteredPositions.filter(p => p.network === 'polygon').length}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex-shrink-0 bg-amber-100 dark:bg-amber-900/30 p-2 rounded-md">
                          <Network className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                        </div>
                      </div>
                    </div>
                    
                    {/* Tarjeta 6: Valor por Posición */}
                    <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 mr-3">
                          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Valor Promedio</p>
                          <h3 className="text-2xl font-bold mt-1 text-cyan-600 dark:text-cyan-400">
                            {formatCurrency(filteredPositions.reduce((sum, p) => sum + Number(p.depositedUSDC), 0) / 
                              (filteredPositions.length || 1))}
                          </h3>
                          <div className="flex items-center mt-1 text-xs">
                            <span className="text-cyan-600">
                              <Maximize2 className="h-3 w-3 inline mr-1" />
                              {formatCurrency(Math.max(...filteredPositions.map(p => Number(p.depositedUSDC) || 0)))}
                            </span>
                            <span className="text-slate-500 dark:text-slate-400 ml-1">posición más alta</span>
                          </div>
                        </div>
                        <div className="flex-shrink-0 bg-cyan-100 dark:bg-cyan-900/30 p-2 rounded-md">
                          <Calculator className="h-6 w-6 text-cyan-600 dark:text-cyan-400" />
                        </div>
                      </div>
                    </div>

                    {/* Tarjeta 7: Timeframes */}
                    <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 mr-3">
                          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Timeframes</p>
                          <div className="mt-1 space-y-1">
                            <div className="flex justify-between items-center">
                              <span className="text-sm">30 días</span>
                              <span className="text-sm font-medium">
                                {filteredPositions.filter(p => p.timeframe === 30).length}
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm">90 días</span>
                              <span className="text-sm font-medium">
                                {filteredPositions.filter(p => p.timeframe === 90).length}
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm">365 días</span>
                              <span className="text-sm font-medium">
                                {filteredPositions.filter(p => p.timeframe === 365).length}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex-shrink-0 bg-emerald-100 dark:bg-emerald-900/30 p-2 rounded-md">
                          <Clock className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
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
                                {filteredPositions.filter(p => p.impermanentLossRisk === 'Low').length}
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <div className="flex items-center">
                                <div className="w-2 h-2 rounded-full bg-yellow-500 mr-2"></div>
                                <span className="text-sm">Medio</span>
                              </div>
                              <span className="text-sm font-medium">
                                {filteredPositions.filter(p => p.impermanentLossRisk === 'Medium').length}
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <div className="flex items-center">
                                <div className="w-2 h-2 rounded-full bg-red-500 mr-2"></div>
                                <span className="text-sm">Alto</span>
                              </div>
                              <span className="text-sm font-medium">
                                {filteredPositions.filter(p => p.impermanentLossRisk === 'High').length}
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
              )}
            </>
          )}

          {/* Tabla de posiciones */}
          {isLoadingPositions ? (
            <div className="flex justify-center py-8">
              <RefreshCw className="w-6 h-6 animate-spin" />
            </div>
          ) : currentSearchWallet && filteredPositions.length === 0 ? (
            <div className="text-center py-8 text-slate-500 flex flex-col items-center">
              <AlertCircle className="h-8 w-8 mb-2 text-slate-400" />
              <p>No hay posiciones {currentStatus !== "all" ? `en estado "${currentStatus}"` : ""} para este usuario.</p>
            </div>
          ) : currentSearchWallet ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Pool</TableHead>
                  <TableHead>Monto</TableHead>
                  <TableHead>Timeframe</TableHead>
                  <TableHead>APR Actual / Contrato</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPositions.map((position) => (
                  <TableRow key={position.id}>
                    <TableCell className="font-mono">{position.id}</TableCell>
                    <TableCell>
                      <div className="font-medium">{position.poolName}</div>
                      <div className="text-xs text-slate-500">
                        {position.token0}/{position.token1}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{formatCurrency(Number(position.depositedUSDC) || 0)}</div>
                      <div className="text-xs text-slate-500">
                        Ganancias: {formatCurrency(Number(position.feesEarned) || 0)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {getTimeframeDisplay(position.timeframe)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium text-blue-600">
                          {position.currentApr !== undefined && position.currentApr !== null
                            ? `${formatNumber(Number(position.currentApr))}%`
                            : `${formatNumber(Number(position.apr) || 0)}%`
                          }
                        </span>
                        <span className="text-xs text-gray-400">
                          Contrato: {formatNumber(Number(position.apr) || 0)}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(position.status)}>
                        {position.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{formatDate(position.timestamp)}</div>
                      {position.startDate && (
                        <div className="text-xs text-slate-500">
                          Contrato: {formatDate(position.startDate)} - {(() => {
                            // Calcular fecha de finalización usando timeframe
                            const startDate = new Date(position.startDate);
                            const contractDays = position.timeframe || 365;
                            const endDate = new Date(startDate);
                            endDate.setDate(startDate.getDate() + contractDays);
                            return formatDate(endDate.toISOString());
                          })()}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditDialog(position)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeletePosition(position)}
                        >
                          <Trash className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12 text-slate-500">
              <div className="mb-4">
                <User className="h-12 w-12 mx-auto text-slate-300" />
              </div>
              <p className="text-lg font-medium mb-1">Busca un usuario</p>
              <p className="max-w-md mx-auto">
                Ingresa la dirección de un wallet para ver y gestionar las posiciones de liquidez de ese usuario
              </p>
            </div>
          )}
        </div>
      </CardContent>

      {/* Diálogo para editar posición */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md md:max-w-2xl lg:max-w-4xl w-[95vw] max-h-[95vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Posición</DialogTitle>
            <DialogDescription>
              Actualiza los detalles de esta posición de liquidez
            </DialogDescription>
          </DialogHeader>
          
          {editingPosition && (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleUpdatePosition)} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                  <div className="col-span-2">
                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Estado</FormLabel>
                          <Select 
                            value={field.value} 
                            onValueChange={field.onChange}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Seleccionar estado" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Active">Activa</SelectItem>
                              <SelectItem value="Pending">Pendiente</SelectItem>
                              <SelectItem value="Finalized">Finalizada</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="depositedUSDC"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Importe del contrato ($)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.01"
                            min="0"
                            onChange={(e) => {
                              // Asegurar que se guarde como número con precisión de 2 decimales
                              const value = e.target.value ? parseFloat(parseFloat(e.target.value).toFixed(2)) : 0;
                              field.onChange(value);
                            }}
                            value={field.value}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="apr"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>APR (%)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.01"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="timeframe"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          <div className="flex items-center gap-1">
                            Timeframe
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger type="button">
                                  <Info className="h-3.5 w-3.5 text-slate-500" />
                                </TooltipTrigger>
                                <TooltipContent side="top">
                                  <p className="max-w-xs">
                                    Periodo de tiempo para la posición de liquidez (en días)
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </FormLabel>
                        <Select 
                          value={field.value.toString()} 
                          onValueChange={(value) => field.onChange(Number(value))}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar timeframe" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="30">1 mes (30 días)</SelectItem>
                            <SelectItem value="90">3 meses (90 días)</SelectItem>
                            <SelectItem value="180">6 meses (180 días)</SelectItem>
                            <SelectItem value="365">1 año (365 días)</SelectItem>
                            <SelectItem value="730">2 años (730 días)</SelectItem>
                            <SelectItem value="1095">3 años (1,095 días)</SelectItem>
                            <SelectItem value="1460">4 años (1,460 días)</SelectItem>
                            <SelectItem value="1825">5 años (1,825 días)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="contractDuration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          <div className="flex items-center gap-1">
                            Duración del Contrato
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger type="button">
                                  <Info className="h-3.5 w-3.5 text-slate-500" />
                                </TooltipTrigger>
                                <TooltipContent side="top">
                                  <p className="max-w-xs">
                                    Duración total del contrato de liquidez (de 1 a 5 años)
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </FormLabel>
                        <Select 
                          value={field.value?.toString() || "365"} 
                          onValueChange={(value) => field.onChange(Number(value))}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar duración" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="365">1 año (365 días)</SelectItem>
                            <SelectItem value="730">2 años (730 días)</SelectItem>
                            <SelectItem value="1095">3 años (1,095 días)</SelectItem>
                            <SelectItem value="1460">4 años (1,460 días)</SelectItem>
                            <SelectItem value="1825">5 años (1,825 días)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="feesEarned"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ganancias ($)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.01"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  
                  <FormField
                    control={form.control}
                    name="lowerPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Precio mínimo</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.00000001"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="upperPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Precio máximo</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.00000001"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="rangeWidth"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ancho de Rango de Precio</FormLabel>
                        <Select 
                          value={field.value || ""} 
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar ancho de rango" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="±10%">±10% (Alta APR, rebalanceo frecuente)</SelectItem>
                            <SelectItem value="±20%">±20% (APR media, rebalanceo regular)</SelectItem>
                            <SelectItem value="±30%">±30% (APR menor, rebalanceo ocasional)</SelectItem>
                            <SelectItem value="±40%">±40% (APR baja, rebalanceo poco frecuente)</SelectItem>
                            <SelectItem value="±50%">±50% (APR muy baja, rebalanceo mínimo)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="impermanentLossRisk"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Riesgo de Pérdida Impermanente</FormLabel>
                        <Select 
                          value={field.value || ""} 
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar nivel de riesgo" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Low">Bajo (pares estables)</SelectItem>
                            <SelectItem value="Medium">Medio (volatilidad moderada)</SelectItem>
                            <SelectItem value="High">Alto (alta volatilidad)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="col-span-2">
                    <FormField
                      control={form.control}
                      name="inRange"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>
                              En rango de precio
                            </FormLabel>
                            <FormDescription>
                              Indica si la posición está actualmente dentro del rango de precio óptimo
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="col-span-2">
                    <FormField
                      control={form.control}
                      name="nftTokenId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>ID del NFT de Uniswap</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Ej: 12345"
                              value={field.value || ""}
                            />
                          </FormControl>
                          <FormDescription>
                            Asocia un ID de NFT de Uniswap específico a esta posición. Este NFT se mostrará en el panel de usuario.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="col-span-2">
                    <FormField
                      control={form.control}
                      name="network"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Red Blockchain</FormLabel>
                          <Select 
                            value={field.value || "ethereum"}
                            onValueChange={field.onChange}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Seleccionar red" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="ethereum">Ethereum</SelectItem>
                              <SelectItem value="polygon">Polygon</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Selecciona la red blockchain donde está el NFT de posición
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="col-span-2">
                    <FormField
                      control={form.control}
                      name="poolAddress"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Dirección del pool</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Ej: 0x4e68ccd3e89f51c3074ca5072bbac773960dfa36"
                              value={field.value || ""}
                            />
                          </FormControl>
                          <FormDescription>
                            Dirección del pool de Uniswap asociado con este NFT
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="col-span-2">
                    <FormField
                      control={form.control}
                      name="contractAddress"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Dirección del contrato NFT</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Ej: 0xC36442b4a4522E871399CD717aBDD847Ab11FE88"
                              value={field.value || ""}
                            />
                          </FormControl>
                          <FormDescription>
                            Dirección del contrato que gestiona los NFTs de posición
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="col-span-2">
                    <FormField
                      control={form.control}
                      name="tokenPair"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Par de tokens</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Ej: USDC/WETH"
                              value={field.value || ""}
                            />
                          </FormControl>
                          <FormDescription>
                            Par de tokens que componen la posición
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="col-span-2">
                    <FormField
                      control={form.control}
                      name="fee"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Porcentaje de tarifa</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Ej: 0.3%"
                              value={field.value || ""}
                            />
                          </FormControl>
                          <FormDescription>
                            Porcentaje de tarifa que se cobra en este pool
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                
                {/* Sección de Recolectar Fees */}
                <Separator className="my-6" />
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <MinusCircle className="h-5 w-5 text-green-600" />
                        Recolectar Fees
                      </h3>
                      <p className="text-sm text-gray-600">
                        Recolecta los fees acumulados de esta posición. Se reseteará la posición para iniciar un nuevo período de acumulación.
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setShowWithdrawalForm(!showWithdrawalForm)}
                    >
                      {showWithdrawalForm ? 'Cancelar' : 'Recolectar Fees'}
                    </Button>
                  </div>
                  
                  {showWithdrawalForm && (
                    <Form {...withdrawalForm}>
                      <form onSubmit={withdrawalForm.handleSubmit(handleCreateWithdrawal)} className="space-y-4 bg-gray-50 p-4 rounded-lg border">
                        <div className="grid grid-cols-1 gap-4">
                          <FormField
                            control={withdrawalForm.control}
                            name="amount"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Cantidad a Retirar (USDC)</FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    step="0.01"
                                    placeholder="Ej: 100.50"
                                    {...field}
                                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={withdrawalForm.control}
                            name="notes"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Notas (Opcional)</FormLabel>
                                <FormControl>
                                  <Textarea
                                    placeholder="Motivo de la retirada..."
                                    rows={3}
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <div className="flex justify-end space-x-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setShowWithdrawalForm(false)}
                          >
                            Cancelar
                          </Button>
                          <Button
                            type="submit"
                            size="sm"
                            disabled={isProcessingWithdrawal || createWithdrawalMutation.isPending}
                          >
                            {(isProcessingWithdrawal || createWithdrawalMutation.isPending) ? (
                              <>
                                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                Procesando...
                              </>
                            ) : (
                              <>
                                <MinusCircle className="h-4 w-4 mr-2" />
                                Recolectar Fees
                              </>
                            )}
                          </Button>
                        </div>
                      </form>
                    </Form>
                  )}
                </div>

                <DialogFooter>
                  <Button 
                    type="button" 
                    variant="secondary" 
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <Button 
                    type="submit"
                    disabled={updatePositionMutation.isPending || !form.formState.isDirty}
                  >
                    {updatePositionMutation.isPending ? (
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Check className="h-4 w-4 mr-2" />
                    )}
                    Guardar cambios
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          )}
        </DialogContent>
      </Dialog>

      {/* Diálogo para crear una nueva posición */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-xl md:max-w-2xl lg:max-w-4xl w-[95vw] max-h-[95vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Crear Nueva Posición</DialogTitle>
            <DialogDescription>
              Añade una nueva posición de liquidez para cualquier wallet
            </DialogDescription>
          </DialogHeader>
          
          <CreatePositionForm 
            walletAddress={currentSearchWallet || ""} 
            pools={pools} 
            onSuccess={() => {
              setIsCreateDialogOpen(false);
              // Si tenemos un wallet seleccionado, refrescamos sus posiciones
              if (currentSearchWallet) {
                refetchPositions();
              }
              // En cualquier caso refrescamos todas las posiciones
              refetchAllPositions();
            }}
            onCancel={() => setIsCreateDialogOpen(false)}
            adminAddress={address || ''}
          />
        </DialogContent>
      </Dialog>
      
      {/* Diálogo para confirmar eliminación de posición */}
      <Dialog open={isDeleteDialogOpen && positionToDelete !== null} onOpenChange={(open) => {
        if (!open) {
          setPositionToDelete(null);
        }
        setIsDeleteDialogOpen(open);
      }}>
        <DialogContent className="sm:max-w-md md:max-w-lg w-[95vw]">
          <DialogHeader>
            <DialogTitle className="flex items-center text-red-600">
              <AlertCircle className="h-5 w-5 mr-2" /> 
              Confirmar eliminación de posición
            </DialogTitle>
            <DialogDescription>
              Esta acción es irreversible. La posición se eliminará permanentemente de la base de datos.
            </DialogDescription>
          </DialogHeader>
          
          {positionToDelete && (
            <div className="py-4 space-y-3">
              <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-md border border-slate-200 dark:border-slate-700">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold">Posición #{positionToDelete.id}</span>
                  <Badge className={getStatusColor(positionToDelete.status)}>
                    {positionToDelete.status}
                  </Badge>
                </div>
                
                <div className="flex flex-col gap-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Pool:</span>
                    <span className="font-medium">{positionToDelete.poolName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Monto:</span>
                    <span className="font-medium">{formatCurrency(Number(positionToDelete.depositedUSDC) || 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Ganancias:</span>
                    <span className="font-medium">{formatCurrency(Number(positionToDelete.feesEarned) || 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Periodo:</span>
                    <span className="font-medium">{getTimeframeDisplay(positionToDelete.timeframe)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button 
              variant="destructive" 
              onClick={confirmDelete}
              disabled={deletePositionMutation.isPending}
            >
              {deletePositionMutation.isPending ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Trash className="h-4 w-4 mr-2" />
              )}
              Eliminar posición
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo para confirmar eliminación de usuario */}
      <Dialog open={isDeleteDialogOpen && userToDelete !== null} onOpenChange={(open) => {
        if (!open) {
          setUserToDelete(null);
        }
        setIsDeleteDialogOpen(open);
      }}>
        <DialogContent className="sm:max-w-md w-[95vw]">
          <DialogHeader>
            <DialogTitle className="flex items-center text-red-600">
              <AlertCircle className="h-5 w-5 mr-2" /> 
              Confirmar eliminación de usuario
            </DialogTitle>
            <DialogDescription>
              Esta acción es irreversible. El usuario y todas sus posiciones se eliminarán permanentemente de la base de datos.
            </DialogDescription>
          </DialogHeader>
          
          {userToDelete && (
            <div className="py-4 space-y-3">
              <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-md border border-slate-200 dark:border-slate-700">
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold">{userToDelete.username || "Usuario"}</span>
                    {userToDelete.isAdmin && (
                      <Badge variant="outline" className="text-xs">Admin</Badge>
                    )}
                  </div>
                  <div className="flex flex-col gap-1 text-sm mb-2">
                    <div className="flex items-center">
                      <span className="text-slate-500 mr-2">Wallet:</span>
                      <span className="font-mono text-xs">{userToDelete.walletAddress}</span>
                    </div>
                  </div>
                  
                  <div className="mt-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md text-sm">
                    <p className="text-red-700 dark:text-red-400">
                      <AlertTriangle className="h-4 w-4 inline mr-1" />
                      <strong>Advertencia:</strong> Todas las posiciones asociadas a este usuario también serán eliminadas.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter className="flex justify-between mt-2">
            <Button 
              variant="outline" 
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button 
              variant="destructive" 
              onClick={confirmDeleteUser}
              disabled={deleteUserMutation.isPending}
            >
              {deleteUserMutation.isPending ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4 mr-2" />
              )}
              Eliminar usuario
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo para editar/añadir email */}
      <Dialog open={emailDialogOpen} onOpenChange={setEmailDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{userForEmail?.email ? "Editar Email" : "Añadir Email"}</DialogTitle>
            <DialogDescription>
              {userForEmail?.isCustodial 
                ? "Este es el email asociado a la wallet custodiada de WayBank." 
                : "Añade un email de contacto para esta wallet."}
            </DialogDescription>
          </DialogHeader>
          
          <Form {...emailForm}>
            <form onSubmit={emailForm.handleSubmit(handleUpdateEmail)} className="space-y-4">
              <FormField
                control={emailForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="usuario@ejemplo.com" 
                        {...field}
                        autoComplete="email" 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEmailDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={updateUserEmailMutation.isPending}
                >
                  {updateUserEmailMutation.isPending ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Check className="h-4 w-4 mr-2" />
                  )}
                  Guardar
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

// Componente para el formulario de creación de posiciones
const CreatePositionForm = ({ 
  walletAddress, 
  pools, 
  onSuccess, 
  onCancel,
  adminAddress
}: { 
  walletAddress: string; 
  pools: any[]; 
  onSuccess: () => void; 
  onCancel: () => void;
  adminAddress: string;
}) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [customWalletAddress, setCustomWalletAddress] = useState<string>(walletAddress);
  
  // Efecto para actualizar el estado local cuando cambia la prop
  useEffect(() => {
    setCustomWalletAddress(walletAddress);
  }, [walletAddress]);
  
  // Formulario para creación de posición
  const createForm = useForm<CreatePositionFormValues>({
    resolver: zodResolver(createPositionSchema),
    defaultValues: {
      poolAddress: "",
      depositedUSDC: 1000,
      timeframe: 30,
      status: "Pending",
      apr: 5,
      feesEarned: 0,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      rangeWidth: "±20%",
      impermanentLossRisk: "Medium",
      nftTokenId: "",
      network: "ethereum"
    }
  });
  
  // Mutación para crear una posición
  const createPositionMutation = useMutation({
    mutationFn: async (positionData: any) => {
      console.log("Enviando datos al servidor:", positionData);
      return await apiRequest('POST', '/api/admin/positions', positionData, {
        headers: {
          'Content-Type': 'application/json',
          'x-wallet-address': adminAddress,
        },
      });
    },
    onSuccess: (data) => {
      console.log("Posición creada con éxito:", data);
      queryClient.invalidateQueries({ queryKey: ['/api/admin/positions', walletAddress] });
      queryClient.invalidateQueries({ queryKey: ['/api/position-history', walletAddress] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
      queryClient.invalidateQueries({ queryKey: ['/api/invoices'] });
      
      // Verificar si la respuesta contiene información de factura
      const hasInvoice = data && data.invoice && data.invoice.id;
      
      toast({
        title: "Posición creada",
        description: hasInvoice 
          ? `La posición ha sido creada correctamente. Se ha generado la factura #${data.invoice.invoiceNumber}.`
          : "La posición ha sido creada correctamente.",
      });
      
      // Si se creó una factura, también mostrar un toast específico
      if (hasInvoice) {
        setTimeout(() => {
          toast({
            title: "Factura pendiente generada",
            description: `Se ha generado automáticamente la factura #${data.invoice.invoiceNumber} en estado Pendiente.`,
            variant: "default",
          });
        }, 1000);
      }
      
      onSuccess();
    },
    onError: (error: any) => {
      console.error("Error al crear posición:", error);
      toast({
        title: "Error",
        description: error.message || "No se pudo crear la posición. Verifica los datos e inténtalo de nuevo.",
        variant: "destructive",
      });
    },
  });
  
  // Manejar la creación de una posición
  const handleCreatePosition = async (values: CreatePositionFormValues) => {
    // Encontrar información completa del pool seleccionado
    const selectedPool = pools.find(pool => pool.address === values.poolAddress);
    
    if (!selectedPool) {
      toast({
        title: "Error",
        description: "Pool no encontrado. Por favor, selecciona un pool válido.",
        variant: "destructive",
      });
      return;
    }
    
    // Fecha actual para el timestamp
    const timestamp = new Date().toISOString();
    
    // Obtener datos del pool para calcular las proporciones de tokens
    let token0Amount = "0";
    let token1Amount = "0";
    
    try {
      // Obtener datos actuales del pool
      const poolData = await apiRequest('GET', `/api/blockchain/uniswap-pool?address=${values.poolAddress}&t=${Date.now()}`);
      
      // Extraer las proporciones de tokens del pool
      let token0Ratio = 0.5; // Valor predeterminado
      let token1Ratio = 0.5; // Valor predeterminado
      
      // Intentar obtener las proporciones desde los datos de balance
      if (poolData.balances) {
        const token0UsdValue = parseFloat(poolData.balances.token0?.usdValue || '0');
        const token1UsdValue = parseFloat(poolData.balances.token1?.usdValue || '0');
        const totalUsdValue = token0UsdValue + token1UsdValue;
        
        if (totalUsdValue > 0) {
          token0Ratio = token0UsdValue / totalUsdValue;
          token1Ratio = token1UsdValue / totalUsdValue;
        }
      } 
      // Alternativamente, usar el objeto tokenRatio si está disponible
      else if (poolData.tokenRatio) {
        const token0Key = selectedPool.token0Symbol.toLowerCase();
        const token1Key = selectedPool.token1Symbol.toLowerCase();
        
        if (token0Key in poolData.tokenRatio) {
          token0Ratio = poolData.tokenRatio[token0Key] !== null ? poolData.tokenRatio[token0Key] : 0.5;
        }
        if (token1Key in poolData.tokenRatio) {
          token1Ratio = poolData.tokenRatio[token1Key] !== null ? poolData.tokenRatio[token1Key] : 0.5;
        }
      }
      
      // Calcular los montos de tokens basado en las proporciones y el valor total de la posición
      const depositedUSDC = Number(values.depositedUSDC);
      
      // Valor de la posición distribuido según las proporciones del pool
      const token0Value = depositedUSDC * token0Ratio;
      const token1Value = depositedUSDC * token1Ratio;
      
      // Para token1 (normalmente ETH), necesitamos calcular la cantidad correcta
      // El valor en USD del token1 es token1Value
      // Si token1 es ETH, debemos convertir el valor en USD a ETH usando el precio de ETH
      const token1PriceUsd = poolData.ethPriceUsd || 1800; // Precio de ETH en USD
      
      // Calcular cantidades
      token0Amount = token0Value.toString();
      // Si token1 es ETH o similar, calculamos sus unidades basadas en el precio
      token1Amount = (token1Value / token1PriceUsd).toString();
      
      console.log(`Proporción calculada para nueva posición:`, {
        poolName: selectedPool.displayName || `${selectedPool.token0Symbol}/${selectedPool.token1Symbol}`,
        token0Ratio,
        token1Ratio,
        depositedUSDC,
        token0Value,
        token1Value,
        token1PriceUsd,
        token0Amount,
        token1Amount
      });
    } catch (error) {
      console.error("Error al obtener datos del pool para calcular proporciones:", error);
    }
    
    // Validar que tenemos una dirección de wallet
    if (!customWalletAddress.trim()) {
      toast({
        title: "Error",
        description: "Debe especificar una dirección de wallet válida",
        variant: "destructive",
      });
      return;
    }

    // Construir el objeto de datos para la creación
    const positionData = {
      walletAddress: customWalletAddress.trim(),
      poolAddress: values.poolAddress,
      poolName: selectedPool.displayName || `${selectedPool.token0Symbol}/${selectedPool.token1Symbol}`,
      token0: selectedPool.token0Symbol,
      token1: selectedPool.token1Symbol,
      token0Decimals: selectedPool.token0Decimals,
      token1Decimals: selectedPool.token1Decimals,
      depositedUSDC: Number(values.depositedUSDC),
      timeframe: Number(values.timeframe),
      apr: Number(values.apr),
      feesEarned: Number(values.feesEarned),
      timestamp,
      startDate: values.startDate, 
      endDate: values.endDate,
      status: values.status,
      token0Amount,
      token1Amount,
      lowerPrice: 0,
      upperPrice: 0,
      inRange: true,
      rangeWidth: values.rangeWidth,
      impermanentLossRisk: values.impermanentLossRisk,
      nftTokenId: values.nftTokenId,
      network: values.network
    };
    
    // Ejecutar la mutación
    createPositionMutation.mutate(positionData);
  };
  
  return (
    <Form {...createForm}>
      <form onSubmit={createForm.handleSubmit(handleCreatePosition)} className="space-y-4">
        {/* Campo de dirección de wallet - solo visible si no hay una dirección preseleccionada */}
        <div className="col-span-2 mb-2">
          <div className={`p-3 rounded-md ${!walletAddress ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800' : ''}`}>
            <div className="flex items-center gap-2 mb-2">
              <User className="h-4 w-4 text-slate-500" />
              <span className="font-medium">Dirección de Wallet</span>
            </div>
            
            <div className="flex gap-2 items-center">
              <Input
                value={customWalletAddress}
                onChange={(e) => setCustomWalletAddress(e.target.value)}
                placeholder="0x..."
                className={`font-mono`}
              />
              
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setCustomWalletAddress("")}
                className="flex-shrink-0"
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
            
            <p className="text-xs text-slate-500 mt-1">
              Ingresa la dirección Ethereum completa del wallet para el que deseas crear la posición
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4">
          <div className="col-span-2">
            <FormField
              control={createForm.control}
              name="poolAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pool</FormLabel>
                  <Select 
                    value={field.value} 
                    onValueChange={field.onChange}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar pool" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {pools.map(pool => (
                        <SelectItem key={pool.id} value={pool.address}>
                          {pool.displayName || `${pool.token0Symbol}/${pool.token1Symbol}`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={createForm.control}
            name="depositedUSDC"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Monto depositado (USDC)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    step="0.01"
                    min="1"
                    onChange={(e) => {
                      // Asegurar que se guarde como número
                      const value = e.target.value ? parseFloat(e.target.value) : 0;
                      field.onChange(value);
                    }}
                    value={field.value || 0}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={createForm.control}
            name="timeframe"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Timeframe</FormLabel>
                <Select 
                  value={field.value.toString()} 
                  onValueChange={(value) => {
                    field.onChange(Number(value));
                    
                    // Actualizar la fecha de fin basada en el timeframe seleccionado
                    const startDate = createForm.getValues("startDate");
                    if (startDate) {
                      const start = new Date(startDate);
                      const days = Number(value);
                      const endDate = new Date(start);
                      endDate.setDate(start.getDate() + days);
                      
                      createForm.setValue("endDate", endDate.toISOString().split('T')[0]);
                    }
                  }}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar timeframe" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="30">1 mes</SelectItem>
                    <SelectItem value="90">3 meses</SelectItem>
                    <SelectItem value="365">1 año</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={createForm.control}
            name="apr"
            render={({ field }) => (
              <FormItem>
                <FormLabel>APR estimado (%)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    step="0.01"
                    onChange={(e) => {
                      // Asegurar que se guarde como número
                      const value = e.target.value ? parseFloat(e.target.value) : 0;
                      field.onChange(value);
                    }}
                    value={field.value || 0}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={createForm.control}
            name="startDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fecha de inicio</FormLabel>
                <FormControl>
                  <Input 
                    type="date"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      
                      // Actualizar la fecha de fin basada en el timeframe seleccionado
                      const timeframe = createForm.getValues("timeframe");
                      if (timeframe && e.target.value) {
                        const start = new Date(e.target.value);
                        const days = Number(timeframe);
                        const endDate = new Date(start);
                        endDate.setDate(start.getDate() + days);
                        
                        createForm.setValue("endDate", endDate.toISOString().split('T')[0]);
                      }
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={createForm.control}
            name="endDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fecha de fin</FormLabel>
                <FormControl>
                  <Input 
                    type="date"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={createForm.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Estado</FormLabel>
                <Select 
                  value={field.value} 
                  onValueChange={field.onChange}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar estado" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Active">Activa</SelectItem>
                    <SelectItem value="Pending">Pendiente</SelectItem>
                    <SelectItem value="Finalized">Finalizada</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={createForm.control}
            name="rangeWidth"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ancho de Rango de Precio</FormLabel>
                <Select 
                  value={field.value || ""} 
                  onValueChange={field.onChange}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar ancho de rango" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="±10%">±10% (Alta APR, rebalanceo frecuente)</SelectItem>
                    <SelectItem value="±20%">±20% (APR media, rebalanceo regular)</SelectItem>
                    <SelectItem value="±30%">±30% (APR menor, rebalanceo ocasional)</SelectItem>
                    <SelectItem value="±40%">±40% (APR baja, rebalanceo poco frecuente)</SelectItem>
                    <SelectItem value="±50%">±50% (APR muy baja, rebalanceo mínimo)</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={createForm.control}
            name="impermanentLossRisk"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Riesgo de Pérdida Impermanente</FormLabel>
                <Select 
                  value={field.value || ""} 
                  onValueChange={field.onChange}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar nivel de riesgo" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Low">Bajo (pares estables)</SelectItem>
                    <SelectItem value="Medium">Medio (volatilidad moderada)</SelectItem>
                    <SelectItem value="High">Alto (alta volatilidad)</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={createForm.control}
            name="nftTokenId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ID del NFT de Uniswap</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Ej: 12345"
                    value={field.value || ""}
                  />
                </FormControl>
                <FormDescription>
                  Asocia un ID de NFT de Uniswap específico a esta posición. Este NFT se mostrará en el panel de usuario.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={createForm.control}
            name="network"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Red Blockchain</FormLabel>
                <Select 
                  value={field.value || "ethereum"}
                  onValueChange={field.onChange}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar red" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="ethereum">Ethereum</SelectItem>
                    <SelectItem value="polygon">Polygon</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Selecciona la red blockchain donde está el NFT de posición
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <DialogFooter>
          <Button 
            type="button" 
            variant="secondary" 
            onClick={onCancel}
          >
            Cancelar
          </Button>
          <Button 
            type="submit"
            disabled={createPositionMutation.isPending}
          >
            {createPositionMutation.isPending ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Check className="h-4 w-4 mr-2" />
            )}
            Crear Posición
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default UserPositionsManager;