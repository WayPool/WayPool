import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import AdminLayout from "@/components/layout/admin-layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CalendarIcon, ChevronLeft, ChevronDown, Filter, Search, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

// Tipo para las transacciones
interface Transaction {
  id: number;
  walletAddress: string;
  tokenId?: string;
  poolAddress: string;
  poolName: string;
  token0: string;
  token1: string;
  token0Amount: string;
  token1Amount: string;
  depositedUSDC: number;
  timestamp: string;
  startDate?: string;
  endDate?: string;
  timeframe: number;
  status: string;
  apr: number;
  feesEarned: number;
  network?: string;
  txHash?: string;
  type?: string;
  amount?: number;
  positionId?: number;
}

// Tipo para la respuesta paginada
interface PaginatedResponse {
  data: Transaction[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Componente principal de Historial de Transacciones
export default function TransactionHistoryPage() {
  const { toast } = useToast();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filterWallet, setFilterWallet] = useState("");
  const [filterNetwork, setFilterNetwork] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Estados para el diálogo de confirmación
  const [dialogOpen, setDialogOpen] = useState(false);
  const [statusToChange, setStatusToChange] = useState<{id: number, newStatus: string} | null>(null);

  // Función para obtener las transacciones con filtros
  const fetchTransactions = async ({ queryKey }: any) => {
    const [_, page, limit, wallet, network, status, type, sDate, eDate] = queryKey;
    
    let url = `/api/admin/transaction-history?page=${page}&limit=${limit}`;
    
    if (wallet) url += `&walletAddress=${wallet}`;
    if (network && network !== "all") url += `&network=${network}`;
    if (status && status !== "all") url += `&status=${status}`;
    if (type && type !== "all") url += `&type=${type}`;
    if (sDate) url += `&startDate=${sDate.toISOString()}`;
    if (eDate) url += `&endDate=${eDate.toISOString()}`;
    
    const response = await fetch(url, {
      headers: {
        'x-is-admin': 'true'
      }
    });
    
    if (!response.ok) {
      throw new Error("Error al obtener historial de transacciones");
    }
    
    return response.json();
  };

  // Usar React Query para obtener los datos
  const { data, isLoading, isError, error, refetch } = useQuery<PaginatedResponse>({
    queryKey: [
      'transactions', 
      currentPage, 
      pageSize, 
      filterWallet, 
      filterNetwork, 
      filterStatus, 
      filterType,
      startDate, 
      endDate
    ],
    queryFn: fetchTransactions
  });

  // Resetear la página cuando cambian los filtros
  useEffect(() => {
    setCurrentPage(1);
  }, [filterWallet, filterNetwork, filterStatus, filterType, startDate, endDate]);

  // Formatear valor de token
  const formatTokenAmount = (amount: string) => {
    const num = parseFloat(amount);
    if (isNaN(num)) return amount;
    if (num > 1) return num.toFixed(2);
    return num.toExponential(2);
  };

  // Manejar error
  if (isError) {
    console.error("Error fetching transactions:", error);
    toast({
      title: "Error",
      description: "No se pudieron cargar las transacciones. Intente de nuevo más tarde.",
      variant: "destructive"
    });
  }

  // Formatear dirección de wallet
  const formatWalletAddress = (address: string) => {
    if (!address) return "";
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  // Obtener el color del estado
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case 'Pending':
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case 'Finalized':
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case 'Closed':
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };
  
  // Función para iniciar el proceso de cambio de estado (abre diálogo)
  const initiateStatusChange = (id: number, newStatus: string) => {
    setStatusToChange({ id, newStatus });
    setDialogOpen(true);
  };

  // Función para confirmar y ejecutar el cambio de estado
  const confirmStatusChange = async () => {
    if (!statusToChange) return;
    
    try {
      const { id, newStatus } = statusToChange;
      
      // Cerrar el diálogo inmediatamente para mejor experiencia de usuario
      setDialogOpen(false);
      
      // Mostrar toast de procesamiento
      toast({
        title: "Procesando cambio...",
        description: `Actualizando posición ${id} a estado ${newStatus}`,
      });
      
      const response = await fetch(`/api/admin/positions/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-is-admin': 'true',
          'Cache-Control': 'no-cache'
        },
        body: JSON.stringify({ 
          status: newStatus,
          timestamp: new Date().getTime() // Añadir timestamp para evitar caché
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al actualizar el estado');
      }
      
      // Forzar una espera breve antes de recargar
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Refrescar los datos con una función directa antes de usar refetch()
      // Esto utiliza una nueva petición fetch para evitar problemas de caché
      const refreshResponse = await fetch(
        `/api/admin/transaction-history?page=${currentPage}&limit=${pageSize}&_t=${new Date().getTime()}`, 
        {
          headers: { 'x-is-admin': 'true', 'Cache-Control': 'no-cache' }
        }
      );
      
      if (refreshResponse.ok) {
        // Notificar éxito
        toast({
          title: "Estado actualizado",
          description: `La posición ha sido cambiada a estado ${newStatus}`,
          variant: "default",
        });
        
        // Refrescar la UI con react-query
        await refetch();
      }
    } catch (error) {
      console.error('Error al actualizar el estado:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Error al actualizar el estado',
        variant: "destructive",
      });
    }
  };

  return (
    <AdminLayout>
      {/* Diálogo de confirmación para cambio de estado */}
      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar cambio de estado</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de que deseas cambiar el estado de esta transacción?
              {statusToChange && (
                <p className="mt-2 font-medium">
                  Nuevo estado: <Badge className={getStatusColor(statusToChange.newStatus)}>{statusToChange.newStatus}</Badge>
                </p>
              )}
              <p className="mt-2 text-sm text-gray-500">
                Esta acción no se puede deshacer y podría afectar los cálculos de rendimiento.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setStatusToChange(null)}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmStatusChange}>Confirmar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-white">Historial de Transacciones</h1>
          <Link href="/admin">
            <Button variant="outline" className="text-white border-white hover:bg-white hover:text-slate-800">
              <ChevronLeft className="mr-2 h-5 w-5" />
              Volver al panel de Admin
            </Button>
          </Link>
        </div>
        
        <Card className="shadow-md">
          <CardHeader className="bg-gradient-to-r from-slate-800 to-slate-700 text-white">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <CardTitle className="text-2xl font-bold flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Historial de Transacciones
              </CardTitle>
              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={() => refetch()}
                  size="sm"
                  variant="outline"
                  className="bg-transparent text-white border-white hover:bg-white hover:text-slate-800"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refrescar
                </Button>
                <Button
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  size="sm"
                  variant={isFilterOpen ? "default" : "outline"}
                  className={isFilterOpen 
                    ? "bg-white text-slate-800 border-white hover:bg-gray-100 hover:text-slate-900" 
                    : "bg-transparent text-white border-white hover:bg-white hover:text-slate-800"
                  }
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filtros
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            {isFilterOpen && (
              <div className="mb-6 p-4 border border-gray-200 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-800">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="wallet" className="text-sm font-medium">Wallet</label>
                    <div className="flex">
                      <Input
                        id="wallet"
                        placeholder="Dirección de wallet"
                        value={filterWallet}
                        onChange={(e) => setFilterWallet(e.target.value)}
                        className="flex-grow"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="network" className="text-sm font-medium">Red</label>
                    <Select
                      value={filterNetwork}
                      onValueChange={setFilterNetwork}
                    >
                      <SelectTrigger id="network">
                        <SelectValue placeholder="Todas las redes" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todas las redes</SelectItem>
                        <SelectItem value="ethereum">Ethereum</SelectItem>
                        <SelectItem value="polygon">Polygon</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="status" className="text-sm font-medium">Estado</label>
                    <Select
                      value={filterStatus}
                      onValueChange={setFilterStatus}
                    >
                      <SelectTrigger id="status">
                        <SelectValue placeholder="Todos los estados" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos los estados</SelectItem>
                        <SelectItem value="Active">Activo</SelectItem>
                        <SelectItem value="Pending">Pendiente</SelectItem>
                        <SelectItem value="Finalized">Finalizado</SelectItem>
                        <SelectItem value="Closed">Cerrado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="type" className="text-sm font-medium">Tipo de Transacción</label>
                    <Select
                      value={filterType}
                      onValueChange={setFilterType}
                    >
                      <SelectTrigger id="type">
                        <SelectValue placeholder="Todos los tipos" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos los tipos</SelectItem>
                        <SelectItem value="fee-collection">Cobro de Fees</SelectItem>
                        <SelectItem value="position">Posiciones</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Rango de fechas</label>
                    <div className="flex space-x-2">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="flex-grow justify-start text-left font-normal"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {startDate ? format(startDate, "PPP", { locale: es }) : "Fecha inicio"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={startDate}
                            onSelect={setStartDate}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="flex-grow justify-start text-left font-normal"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {endDate ? format(endDate, "PPP", { locale: es }) : "Fecha fin"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={endDate}
                            onSelect={setEndDate}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end mt-4 space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setFilterWallet("");
                      setFilterNetwork("all");
                      setFilterStatus("all");
                      setFilterType("all");
                      setStartDate(undefined);
                      setEndDate(undefined);
                    }}
                  >
                    Limpiar filtros
                  </Button>
                  <Button
                    onClick={() => {
                      refetch();
                      setIsFilterOpen(false);
                    }}
                  >
                    Aplicar filtros
                  </Button>
                </div>
              </div>
            )}
            
            {isLoading ? (
              <>
                {[...Array(5)].map((_, index) => (
                  <div key={index} className="flex flex-col space-y-3 mb-4">
                    <Skeleton className="h-12 w-full" />
                  </div>
                ))}
              </>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Wallet</TableHead>
                        <TableHead>Pool</TableHead>
                        <TableHead>Valor (USDC)</TableHead>
                        <TableHead>Tokens</TableHead>
                        <TableHead>Timeframe</TableHead>
                        <TableHead>APR</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead>Fecha</TableHead>
                        <TableHead>Red</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data?.data && data.data.length > 0 ? (
                        data.data.map((tx) => (
                          <TableRow key={tx.id}>
                            <TableCell className="font-medium">{tx.id}</TableCell>
                            <TableCell>
                              <span 
                                title={tx.walletAddress}
                                className="cursor-help"
                              >
                                {formatWalletAddress(tx.walletAddress)}
                              </span>
                            </TableCell>
                            <TableCell>
                              <div>
                                <span className="font-medium">{tx.token0}/{tx.token1}</span>
                                <div className="text-xs text-muted-foreground truncate max-w-[140px]" title={tx.poolAddress}>
                                  {tx.poolName || formatWalletAddress(tx.poolAddress)}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              {tx.type === 'fee-collection' 
                                ? `$${typeof tx.amount === 'number' ? tx.amount.toFixed(2) : tx.amount || '-'}`
                                : `$${typeof tx.depositedUSDC === 'number' ? tx.depositedUSDC.toFixed(2) : tx.depositedUSDC || '-'}`
                              }
                            </TableCell>
                            <TableCell>
                              {tx.type === 'fee-collection' ? (
                                <div className="text-xs">
                                  <div className="font-semibold text-green-600 dark:text-green-400">
                                    Cobro de Fees
                                  </div>
                                  <div>Posición #{tx.positionId || tx.id}</div>
                                </div>
                              ) : (
                                <div className="text-xs space-y-1">
                                  <div>{formatTokenAmount(tx.token0Amount)} {tx.token0}</div>
                                  <div>{formatTokenAmount(tx.token1Amount)} {tx.token1}</div>
                                </div>
                              )}
                            </TableCell>
                            <TableCell>
                              {tx.type === 'fee-collection' 
                                ? '-'
                                : `${tx.timeframe} días`
                              }
                            </TableCell>
                            <TableCell>
                              {tx.type === 'fee-collection' 
                                ? '-'
                                : typeof tx.apr === 'number' ? tx.apr.toFixed(2) + '%' : tx.apr ? tx.apr + '%' : '-'
                              }
                            </TableCell>
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" className="h-8 p-0">
                                    <Badge className={getStatusColor(tx.status)}>
                                      {tx.status}
                                    </Badge>
                                    <ChevronDown className="ml-1 h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Cambiar estado</DropdownMenuLabel>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem 
                                    className={tx.status === "Active" ? "font-bold" : ""}
                                    onClick={() => initiateStatusChange(tx.id, "Active")}
                                  >
                                    <Badge variant="outline" className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 mr-2">
                                      Active
                                    </Badge>
                                    <span>Activar</span>
                                    {tx.status === "Active" && <span className="ml-2 text-xs text-muted-foreground">(actual)</span>}
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    className={tx.status === "Pending" ? "font-bold" : ""}
                                    onClick={() => initiateStatusChange(tx.id, "Pending")}
                                  >
                                    <Badge variant="outline" className="bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300 mr-2">
                                      Pending
                                    </Badge>
                                    <span>Pendiente</span>
                                    {tx.status === "Pending" && <span className="ml-2 text-xs text-muted-foreground">(actual)</span>}
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    className={tx.status === "Finalized" ? "font-bold" : ""}
                                    onClick={() => initiateStatusChange(tx.id, "Finalized")}
                                  >
                                      <Badge variant="outline" className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 mr-2">
                                        Finalized
                                      </Badge>
                                      <span>Finalizar</span>
                                      {tx.status === "Finalized" && <span className="ml-2 text-xs text-muted-foreground">(actual)</span>}
                                    </DropdownMenuItem>
                                    <DropdownMenuItem 
                                      className={tx.status === "Closed" ? "font-bold" : ""}
                                      onClick={() => initiateStatusChange(tx.id, "Closed")}
                                    >
                                      <Badge variant="outline" className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 mr-2">
                                        Closed
                                      </Badge>
                                      <span>Cerrar</span>
                                      {tx.status === "Closed" && <span className="ml-2 text-xs text-muted-foreground">(actual)</span>}
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                            <TableCell>
                              {tx.timestamp ? new Date(tx.timestamp).toLocaleDateString() : "N/A"}
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className="capitalize">
                                {tx.network || "ethereum"}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={10} className="text-center py-6">
                            No se encontraron transacciones con los filtros actuales
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
                
                {data?.meta && data.meta.totalPages > 1 && (
                  <div className="flex justify-between items-center mt-4">
                    <div className="text-sm text-muted-foreground">
                      Mostrando {(data.meta.page - 1) * data.meta.limit + 1} a{" "}
                      {Math.min(data.meta.page * data.meta.limit, data.meta.total)} de{" "}
                      {data.meta.total} resultados
                    </div>
                    
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          {currentPage === 1 ? (
                            <Button variant="outline" size="icon" className="opacity-50 cursor-not-allowed">
                              <span className="sr-only">Ir a la página anterior</span>
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                                <polyline points="15 18 9 12 15 6"></polyline>
                              </svg>
                            </Button>
                          ) : (
                            <PaginationPrevious onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} />
                          )}
                        </PaginationItem>
                        
                        {/* Mostrar hasta 5 páginas numéricas */}
                        {Array.from({ length: Math.min(5, data.meta.totalPages) }).map((_, i) => {
                          // Mostrar páginas alrededor de la actual
                          let pageNum;
                          if (data.meta.totalPages <= 5) {
                            // Si hay 5 o menos páginas, mostrar todas
                            pageNum = i + 1;
                          } else if (currentPage <= 3) {
                            // Si estamos cerca del inicio
                            pageNum = i + 1;
                          } else if (currentPage >= data.meta.totalPages - 2) {
                            // Si estamos cerca del final
                            pageNum = data.meta.totalPages - 4 + i;
                          } else {
                            // Estamos en medio, centrar en la página actual
                            pageNum = currentPage - 2 + i;
                          }
                          
                          // Solo mostrar si la página es válida
                          if (pageNum > 0 && pageNum <= data.meta.totalPages) {
                            return (
                              <PaginationItem key={pageNum}>
                                <Button
                                  variant={pageNum === currentPage ? "default" : "outline"}
                                  size="icon"
                                  onClick={() => setCurrentPage(pageNum)}
                                  disabled={pageNum === currentPage}
                                >
                                  {pageNum}
                                </Button>
                              </PaginationItem>
                            );
                          }
                          return null;
                        })}
                        
                        <PaginationItem>
                          {currentPage === data.meta.totalPages ? (
                            <Button variant="outline" size="icon" className="opacity-50 cursor-not-allowed">
                              <span className="sr-only">Ir a la página siguiente</span>
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                                <polyline points="9 18 15 12 9 6"></polyline>
                              </svg>
                            </Button>
                          ) : (
                            <PaginationNext onClick={() => setCurrentPage((prev) => Math.min(prev + 1, data.meta.totalPages))} />
                          )}
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                    
                    <Select
                      value={pageSize.toString()}
                      onValueChange={(value) => setPageSize(parseInt(value))}
                    >
                      <SelectTrigger className="w-[120px]">
                        <SelectValue placeholder="10 por página" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10">10 por página</SelectItem>
                        <SelectItem value="25">25 por página</SelectItem>
                        <SelectItem value="50">50 por página</SelectItem>
                        <SelectItem value="100">100 por página</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}