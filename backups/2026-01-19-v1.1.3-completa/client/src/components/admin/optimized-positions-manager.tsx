import { useState, useEffect, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { withdrawalSchema, type WithdrawalFormValues } from "../../../../shared/schema";
import { useWallet } from "@/hooks/use-wallet";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { 
  Search, 
  RefreshCw, 
  Edit, 
  Trash2, 
  ChevronLeft, 
  ChevronRight, 
  SortAsc, 
  SortDesc,
  BarChart3,
  Users,
  TrendingUp,
  DollarSign,
  MinusCircle,
  SeparatorHorizontal as SeparatorIcon
} from "lucide-react";

// Tipos optimizados
interface OptimizedPosition {
  id: number;
  walletAddress: string;
  username?: string;
  email?: string;
  isCustodial?: boolean;
  status: string;
  depositedUSDC: number;
  feesEarned: number;
  apr: number;
  currentApr?: number;
  lastAprUpdate?: string;
  startDate: string;
  timestamp: string;
  timeframe: number;
  contractPeriod?: number;
  token0: string;
  token1: string;
  network: string;
  poolAddress?: string;
  nftTokenId?: string;
  inRange?: boolean;
  lowerPrice?: number;
  upperPrice?: number;
  rangeWidth?: string;
  impermanentLossRisk?: string;
}

interface OptimizedResponse {
  positions: OptimizedPosition[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  metrics: {
    totalPositions: number;
    activePositions: number;
    pendingPositions: number;
    finalizedPositions: number;
    totalCapital: number;
    totalFees: number;
    averageApr: number;
    uniqueUsers: number;
  };
}

// Schema para edición de posiciones
const positionEditSchema = z.object({
  status: z.string().min(1, "Status is required"),
  depositedUSDC: z.number().min(0, "Amount must be positive"),
  feesEarned: z.number().min(0, "Fees must be positive"),
  apr: z.number().min(0, "APR must be positive"),
  inRange: z.boolean(),
  lowerPrice: z.number().optional(),
  upperPrice: z.number().optional(),
  rangeWidth: z.string().optional(),
  impermanentLossRisk: z.string().optional(),
});

type PositionFormValues = z.infer<typeof positionEditSchema>;

export default function OptimizedPositionsManager() {
  const { address } = useWallet();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Estados para filtros y paginación
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("id");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [editingPosition, setEditingPosition] = useState<OptimizedPosition | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Estados para registro de retiradas
  const [showWithdrawalForm, setShowWithdrawalForm] = useState(false);
  const [isProcessingWithdrawal, setIsProcessingWithdrawal] = useState(false);

  // Formulario para edición
  const form = useForm<PositionFormValues>({
    resolver: zodResolver(positionEditSchema),
    defaultValues: {
      status: "",
      depositedUSDC: 0,
      feesEarned: 0,
      apr: 0,
      inRange: true,
      lowerPrice: undefined,
      upperPrice: undefined,
      rangeWidth: "",
      impermanentLossRisk: "",
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

  // Query optimizada que obtiene posiciones con paginación y filtros
  const { 
    data: positionsData, 
    isLoading, 
    refetch 
  } = useQuery<OptimizedResponse>({
    queryKey: ['/api/admin/all-positions-optimized', { page, limit, status, search, sortBy, sortOrder }],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(status !== 'all' && { status }),
        ...(search && { search }),
        sortBy,
        sortOrder
      });
      
      return await apiRequest('GET', `/api/admin/all-positions-optimized?${params}`, null, {
        headers: { 'x-wallet-address': address || '' }
      });
    },
    enabled: !!address,
    staleTime: 30000, // 30 segundos
    refetchInterval: 120000, // 2 minutos para métricas actualizadas - optimizado para reducir costes
  });

  // Mutación para actualizar posición
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
      queryClient.invalidateQueries({ queryKey: ['/api/admin/all-positions-optimized'] });
      toast({
        title: "Posición actualizada",
        description: "La posición ha sido actualizada correctamente",
      });
      setIsDialogOpen(false);
      setEditingPosition(null);
    },
    onError: (error) => {
      console.error("Error al actualizar posición:", error);
      toast({
        title: "Error",
        description: "No se pudo actualizar la posición",
        variant: "destructive",
      });
    },
  });
  
  // Mutación para crear retiradas
  const createWithdrawalMutation = useMutation({
    mutationFn: async (withdrawalData: any) => {
      return await apiRequest('POST', '/api/fee-withdrawals', withdrawalData, {
        headers: {
          'Content-Type': 'application/json',
          'x-wallet-address': address || '',
        },
      });
    },
    onSuccess: () => {
      toast({
        title: "Retirada registrada",
        description: "La retirada ha sido registrada correctamente y se aplicará la penalización APR correspondiente",
      });
      setShowWithdrawalForm(false);
      withdrawalForm.reset();
      setIsProcessingWithdrawal(false);
      // Actualizar las posiciones para reflejar los cambios
      refetch();
    },
    onError: (error) => {
      console.error("Error al registrar retirada:", error);
      toast({
        title: "Error",
        description: "No se pudo registrar la retirada",
        variant: "destructive",
      });
      setIsProcessingWithdrawal(false);
    },
  });

  // Función para manejar cambio de ordenamiento
  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("desc");
    }
  };

  // Función para abrir diálogo de edición
  const openEditDialog = (position: OptimizedPosition) => {
    setEditingPosition(position);
    form.reset({
      status: position.status,
      depositedUSDC: position.depositedUSDC || 0,
      feesEarned: position.feesEarned || 0,
      apr: position.apr || 0,
      inRange: position.inRange ?? true,
      lowerPrice: position.lowerPrice,
      upperPrice: position.upperPrice,
      rangeWidth: position.rangeWidth || "",
      impermanentLossRisk: position.impermanentLossRisk || "",
    });
    // Resetear formulario de retiradas
    withdrawalForm.reset({
      amount: 0,
      notes: "",
    });
    setShowWithdrawalForm(false);
    setIsDialogOpen(true);
  };

  // Función para manejar la actualización
  const handleUpdatePosition = (values: PositionFormValues) => {
    if (!editingPosition) return;
    
    const positionData = {
      status: values.status,
      depositedUSDC: Number(values.depositedUSDC),
      feesEarned: Number(values.feesEarned),
      inRange: values.inRange,
      apr: Number(values.apr),
      lowerPrice: values.lowerPrice ? Number(values.lowerPrice) : undefined,
      upperPrice: values.upperPrice ? Number(values.upperPrice) : undefined,
      rangeWidth: values.rangeWidth,
      impermanentLossRisk: values.impermanentLossRisk,
    };
    
    updatePositionMutation.mutate({ id: editingPosition.id, positionData });
  };
  
  // Función para manejar el registro de retiradas
  const handleCreateWithdrawal = (values: WithdrawalFormValues) => {
    if (!editingPosition) return;
    
    setIsProcessingWithdrawal(true);
    
    // Construir el objeto de retirada con datos de la posición
    const withdrawalData = {
      walletAddress: editingPosition.walletAddress,
      poolAddress: editingPosition.poolAddress || 'default_pool_address', // Usar poolAddress de la posición o un valor por defecto
      poolName: `${editingPosition.token0}-${editingPosition.token1}`, // Construir nombre del pool
      tokenPair: `${editingPosition.token0}/${editingPosition.token1}`,
      amount: values.amount.toString(),
      currency: 'USD',
      status: 'pending',
      network: editingPosition.network || 'ethereum',
      feeType: 'pool_fees',
      notes: values.notes || `Retirada desde admin para posición #${editingPosition.id}`,
    };
    
    createWithdrawalMutation.mutate(withdrawalData);
  };

  // Formatear moneda
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  // Formatear fecha
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Componente de métricas
  const MetricsCards = () => {
    if (!positionsData?.metrics) return null;

    const { metrics } = positionsData;

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="flex items-center p-4">
            <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg mr-3">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Usuarios Únicos</p>
              <p className="text-2xl font-bold">{metrics.uniqueUsers}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-4">
            <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-lg mr-3">
              <DollarSign className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Capital Total</p>
              <p className="text-2xl font-bold">{formatCurrency(metrics.totalCapital)}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-4">
            <div className="flex items-center justify-center w-10 h-10 bg-purple-100 rounded-lg mr-3">
              <TrendingUp className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Ganancias Totales</p>
              <p className="text-2xl font-bold">{formatCurrency(metrics.totalFees)}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-4">
            <div className="flex items-center justify-center w-10 h-10 bg-orange-100 rounded-lg mr-3">
              <BarChart3 className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">APR Promedio</p>
              <p className="text-2xl font-bold">{metrics.averageApr.toFixed(2)}%</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  // Componente de paginación
  const Pagination = () => {
    if (!positionsData?.pagination) return null;

    const { pagination } = positionsData;

    return (
      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-gray-500">
          Mostrando {((pagination.page - 1) * pagination.limit) + 1} a{" "}
          {Math.min(pagination.page * pagination.limit, pagination.total)} de{" "}
          {pagination.total} posiciones
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={pagination.page <= 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm">
            Página {pagination.page} de {pagination.totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
            disabled={pagination.page >= pagination.totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  };

  return (
    <Card className="optimized-positions-manager">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Gestión Optimizada de Posiciones</CardTitle>
            <CardDescription>
              Panel optimizado para manejar miles de posiciones eficientemente
            </CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => refetch()}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Actualizar
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        {/* Métricas globales */}
        <MetricsCards />

        {/* Filtros */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar por wallet, usuario o email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los estados</SelectItem>
              <SelectItem value="Active">Activo</SelectItem>
              <SelectItem value="Pending">Pendiente</SelectItem>
              <SelectItem value="Finalized">Finalizado</SelectItem>
            </SelectContent>
          </Select>

          <Select value={limit.toString()} onValueChange={(value) => setLimit(Number(value))}>
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="25">25 por página</SelectItem>
              <SelectItem value="50">50 por página</SelectItem>
              <SelectItem value="100">100 por página</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Tabla optimizada */}
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead 
                  className="cursor-pointer hover:bg-gray-50" 
                  onClick={() => handleSort('id')}
                >
                  <div className="flex items-center">
                    ID
                    {sortBy === 'id' && (
                      sortOrder === 'asc' ? <SortAsc className="ml-1 h-4 w-4" /> : <SortDesc className="ml-1 h-4 w-4" />
                    )}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-gray-50" 
                  onClick={() => handleSort('wallet_address')}
                >
                  <div className="flex items-center">
                    Usuario
                    {sortBy === 'wallet_address' && (
                      sortOrder === 'asc' ? <SortAsc className="ml-1 h-4 w-4" /> : <SortDesc className="ml-1 h-4 w-4" />
                    )}
                  </div>
                </TableHead>
                <TableHead>Estado</TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-gray-50" 
                  onClick={() => handleSort('deposited_usdc')}
                >
                  <div className="flex items-center">
                    Capital
                    {sortBy === 'deposited_usdc' && (
                      sortOrder === 'asc' ? <SortAsc className="ml-1 h-4 w-4" /> : <SortDesc className="ml-1 h-4 w-4" />
                    )}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-gray-50" 
                  onClick={() => handleSort('fees_earned')}
                >
                  <div className="flex items-center">
                    Ganancias
                    {sortBy === 'fees_earned' && (
                      sortOrder === 'asc' ? <SortAsc className="ml-1 h-4 w-4" /> : <SortDesc className="ml-1 h-4 w-4" />
                    )}
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSort('apr')}
                >
                  <div className="flex items-center">
                    APR Actual / Contrato
                    {sortBy === 'apr' && (
                      sortOrder === 'asc' ? <SortAsc className="ml-1 h-4 w-4" /> : <SortDesc className="ml-1 h-4 w-4" />
                    )}
                  </div>
                </TableHead>
                <TableHead>Par</TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-gray-50" 
                  onClick={() => handleSort('start_date')}
                >
                  <div className="flex items-center">
                    Fecha Inicio
                    {sortBy === 'start_date' && (
                      sortOrder === 'asc' ? <SortAsc className="ml-1 h-4 w-4" /> : <SortDesc className="ml-1 h-4 w-4" />
                    )}
                  </div>
                </TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8">
                    <div className="flex items-center justify-center">
                      <RefreshCw className="animate-spin h-5 w-5 mr-2" />
                      Cargando posiciones...
                    </div>
                  </TableCell>
                </TableRow>
              ) : positionsData?.positions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                    No se encontraron posiciones
                  </TableCell>
                </TableRow>
              ) : (
                positionsData?.positions.map((position) => (
                  <TableRow key={position.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium">{position.id}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium text-sm">
                          {position.username || `${position.walletAddress.slice(0, 6)}...${position.walletAddress.slice(-4)}`}
                        </span>
                        {position.email && (
                          <span className="text-xs text-gray-500">{position.email}</span>
                        )}
                        {position.isCustodial && (
                          <Badge variant="secondary" className="w-fit mt-1 text-xs">Custodiada</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          position.status === 'Active' ? 'default' : 
                          position.status === 'Pending' ? 'secondary' : 
                          'outline'
                        }
                      >
                        {position.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">
                      {formatCurrency(position.depositedUSDC)}
                    </TableCell>
                    <TableCell className="font-medium text-green-600">
                      {formatCurrency(position.feesEarned)}
                    </TableCell>
                    <TableCell className="font-medium">
                      <div className="flex flex-col">
                        <span className="text-blue-600">
                          {position.currentApr !== undefined && position.currentApr !== null
                            ? `${position.currentApr.toFixed(2)}%`
                            : `${position.apr.toFixed(2)}%`
                          }
                        </span>
                        <span className="text-xs text-gray-400">
                          Contrato: {position.apr.toFixed(2)}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {position.token0}/{position.token1}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {formatDate(position.startDate)}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditDialog(position)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Paginación */}
        <Pagination />

        {/* Diálogo de edición */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Editar Posición #{editingPosition?.id}</DialogTitle>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleUpdatePosition)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Estado</FormLabel>
                        <FormControl>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar estado" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Pending">Pending</SelectItem>
                              <SelectItem value="Active">Active</SelectItem>
                              <SelectItem value="Finalized">Finalized</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="depositedUSDC"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Capital Depositado (USDC)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="feesEarned"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ganancias (USDC)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value))}
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
                            onChange={(e) => field.onChange(parseFloat(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="inRange"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          Posición en rango
                        </FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
                
                {/* Sección de Registrar Retirada */}
                <Separator className="my-6" />
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <MinusCircle className="h-5 w-5 text-red-600" />
                        Registrar Retirada
                      </h3>
                      <p className="text-sm text-gray-600">
                        Registra una retirada para esta posición. Se aplicará automáticamente la penalización APR de 7.73% si el APR es mayor al 30%.
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setShowWithdrawalForm(!showWithdrawalForm)}
                    >
                      {showWithdrawalForm ? 'Cancelar' : 'Registrar Retirada'}
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
                                    placeholder="0.00"
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
                                Registrar Retirada
                              </>
                            )}
                          </Button>
                        </div>
                      </form>
                    </Form>
                  )}
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={updatePositionMutation.isPending}
                  >
                    {updatePositionMutation.isPending ? "Guardando..." : "Guardar Cambios"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}