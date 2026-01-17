import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Edit, Trash2, DollarSign, CheckCircle, Clock, XCircle, Eye, ExternalLink } from "lucide-react";
import AprPenaltySimulator from "./apr-penalty-simulator";

// Tipos para los retiros de fees
interface FeeWithdrawal {
  id: number;
  walletAddress: string;
  poolAddress: string;
  poolName: string;
  tokenPair: string;
  amount: string;
  currency: string;
  status: 'pending' | 'confirmed' | 'rejected';
  transactionHash?: string;
  requestedAt: string;
  processedAt?: string;
  processedBy?: string;
  notes?: string;
  network: string;
  feeType: string;
  // Campos para penalización de APR
  aprBeforeWithdrawal?: string; // APR antes del retiro
  aprAfterWithdrawal?: string; // APR después del retiro
  aprPenaltyApplied?: boolean; // Si se aplicó penalización
  aprPenaltyAmount?: string; // Cantidad de penalización (0.73%)
  // Email del usuario (join con users)
  userEmail?: string | null;
}

// Schema para actualizar retiros
const updateWithdrawalSchema = z.object({
  status: z.enum(['pending', 'confirmed', 'rejected']),
  transactionHash: z.string().optional(),
  notes: z.string().optional(),
  processedBy: z.string().optional(),
});

export default function FeeWithdrawalsManager() {
  const [selectedWithdrawal, setSelectedWithdrawal] = useState<FeeWithdrawal | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<number | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Query para obtener todos los retiros
  const { data: withdrawals = [], isLoading } = useQuery({
    queryKey: ["/api/fee-withdrawals"],
    refetchInterval: 10000, // Actualizar cada 10 segundos
  });

  // Filtrar retiros por estado
  const filteredWithdrawals = withdrawals.filter((withdrawal: FeeWithdrawal) =>
    statusFilter === "all" || withdrawal.status === statusFilter
  );

  // Form para editar retiros
  const form = useForm<z.infer<typeof updateWithdrawalSchema>>({
    resolver: zodResolver(updateWithdrawalSchema),
    defaultValues: {
      status: 'pending',
      transactionHash: '',
      notes: '',
      processedBy: '',
    },
  });

  // Mutation para actualizar retiro
  const updateWithdrawalMutation = useMutation({
    mutationFn: (data: { id: number; updates: z.infer<typeof updateWithdrawalSchema> }) =>
      apiRequest(`/api/fee-withdrawals/${data.id}`, {
        method: "PATCH",
        body: JSON.stringify(data.updates),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/fee-withdrawals"] });
      setIsEditDialogOpen(false);
      setSelectedWithdrawal(null);
      toast({
        title: "Retiro actualizado",
        description: "El retiro ha sido actualizado correctamente.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Hubo un error al actualizar el retiro.",
        variant: "destructive",
      });
    },
  });

  // Mutation para eliminar retiro
  const deleteWithdrawalMutation = useMutation({
    mutationFn: (id: number) =>
      apiRequest(`/api/fee-withdrawals/${id}`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/fee-withdrawals"] });
      setDeleteDialogOpen(null);
      toast({
        title: "Retiro eliminado",
        description: "El retiro ha sido eliminado correctamente.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Hubo un error al eliminar el retiro.",
        variant: "destructive",
      });
    },
  });

  // Función para abrir el diálogo de edición
  const openEditDialog = (withdrawal: FeeWithdrawal) => {
    setSelectedWithdrawal(withdrawal);
    form.reset({
      status: withdrawal.status,
      transactionHash: withdrawal.transactionHash || '',
      notes: withdrawal.notes || '',
      processedBy: withdrawal.processedBy || '',
    });
    setIsEditDialogOpen(true);
  };

  // Función para manejar la actualización
  const onSubmit = (values: z.infer<typeof updateWithdrawalSchema>) => {
    if (!selectedWithdrawal) return;
    
    updateWithdrawalMutation.mutate({
      id: selectedWithdrawal.id,
      updates: values,
    });
  };

  // Función para obtener el badge del estado
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-300"><Clock className="w-3 h-3 mr-1" />Pendiente</Badge>;
      case 'confirmed':
        return <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-300"><CheckCircle className="w-3 h-3 mr-1" />Confirmado</Badge>;
      case 'rejected':
        return <Badge variant="secondary" className="bg-red-100 text-red-800 border-red-300"><XCircle className="w-3 h-3 mr-1" />Rechazado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Función para formatear la fecha
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Estadísticas rápidas
  const stats = {
    total: withdrawals.length,
    pending: withdrawals.filter((w: FeeWithdrawal) => w.status === 'pending').length,
    confirmed: withdrawals.filter((w: FeeWithdrawal) => w.status === 'confirmed').length,
    rejected: withdrawals.filter((w: FeeWithdrawal) => w.status === 'rejected').length,
    totalAmount: withdrawals.reduce((sum: number, w: FeeWithdrawal) => sum + parseFloat(w.amount), 0),
    totalPenaltiesApplied: withdrawals.filter((w: FeeWithdrawal) => w.aprPenaltyApplied).length,
    averageAprReduction: withdrawals.filter((w: FeeWithdrawal) => w.aprPenaltyApplied).length > 0 
      ? withdrawals.filter((w: FeeWithdrawal) => w.aprPenaltyApplied)
          .reduce((sum: number, w: FeeWithdrawal) => sum + parseFloat(w.aprPenaltyAmount || "0"), 0) / 
        withdrawals.filter((w: FeeWithdrawal) => w.aprPenaltyApplied).length
      : 0,
  };

  return (
    <div className="space-y-6">
      {/* Simulador de penalización APR */}
      <AprPenaltySimulator />
      
      {/* Header con estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">Total Retiros</p>
                <p className="text-2xl font-bold text-blue-900">{stats.total}</p>
              </div>
              <DollarSign className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-yellow-600 font-medium">Pendientes</p>
                <p className="text-2xl font-bold text-yellow-900">{stats.pending}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">Confirmados</p>
                <p className="text-2xl font-bold text-green-900">{stats.confirmed}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-pink-50 border-red-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-600 font-medium">Rechazados</p>
                <p className="text-2xl font-bold text-red-900">{stats.rejected}</p>
              </div>
              <XCircle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 font-medium">Total Retirado</p>
                <p className="text-2xl font-bold text-purple-900">${stats.totalAmount.toFixed(2)}</p>
                <p className="text-xs text-orange-500">Penalizaciones APR: {stats.totalPenaltiesApplied}</p>
                <p className="text-xs text-red-500">Promedio reducción: {stats.averageAprReduction.toFixed(2)}%</p>
              </div>
              <DollarSign className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros y tabla */}
      <Card className="bg-gradient-to-br from-slate-50 to-gray-50 border-slate-200">
        <CardHeader className="bg-gradient-to-r from-slate-800 to-gray-900 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Gestión de Retiros de Fees
          </CardTitle>
          <CardDescription className="text-slate-200">
            Administra y procesa los retiros de fees de liquidez
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          {/* Filtros */}
          <div className="flex gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Label htmlFor="status-filter">Filtrar por estado:</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="pending">Pendientes</SelectItem>
                  <SelectItem value="confirmed">Confirmados</SelectItem>
                  <SelectItem value="rejected">Rechazados</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Tabla de retiros */}
          {isLoading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-100">
                    <TableHead className="font-semibold">ID</TableHead>
                    <TableHead className="font-semibold">Wallet</TableHead>
                    <TableHead className="font-semibold">Email</TableHead>
                    <TableHead className="font-semibold">Pool</TableHead>
                    <TableHead className="font-semibold">Monto</TableHead>
                    <TableHead className="font-semibold">Estado</TableHead>
                    <TableHead className="font-semibold">Solicitado</TableHead>
                    <TableHead className="font-semibold">Hash TX</TableHead>
                    <TableHead className="font-semibold">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredWithdrawals.map((withdrawal: FeeWithdrawal) => (
                    <TableRow key={withdrawal.id} className="hover:bg-slate-50" data-testid={`row-withdrawal-${withdrawal.id}`}>
                      <TableCell className="font-mono text-sm" data-testid={`text-withdrawal-id-${withdrawal.id}`}>{withdrawal.id}</TableCell>
                      <TableCell>
                        <div className="max-w-32 truncate text-sm font-mono" data-testid={`text-wallet-${withdrawal.id}`} title={withdrawal.walletAddress}>
                          {withdrawal.walletAddress}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm" data-testid={`text-email-${withdrawal.id}`}>
                          {withdrawal.userEmail ? (
                            <a href={`mailto:${withdrawal.userEmail}`} className="text-blue-600 hover:text-blue-800 hover:underline">
                              {withdrawal.userEmail}
                            </a>
                          ) : (
                            <span className="text-gray-400 italic">Sin email</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium text-sm">{withdrawal.tokenPair}</div>
                          <div className="text-xs text-gray-500">{withdrawal.poolName}</div>
                          <Badge variant="outline" className="text-xs">{withdrawal.network}</Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium text-sm">
                            {parseFloat(withdrawal.amount).toFixed(4)} {withdrawal.currency}
                          </div>
                          {withdrawal.aprPenaltyApplied && (
                            <div className="text-xs text-orange-600">
                              APR: {withdrawal.aprBeforeWithdrawal}% → {withdrawal.aprAfterWithdrawal}% (-{withdrawal.aprPenaltyAmount}%)
                            </div>
                          )}
                          {!withdrawal.aprPenaltyApplied && withdrawal.aprBeforeWithdrawal && (
                            <div className="text-xs text-gray-500">
                              APR: {withdrawal.aprBeforeWithdrawal}% (sin penalización)
                            </div>
                          )}
                          <div className="text-xs text-gray-500">{withdrawal.feeType}</div>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(withdrawal.status)}</TableCell>
                      <TableCell className="text-sm">
                        {formatDate(withdrawal.requestedAt)}
                      </TableCell>
                      <TableCell>
                        {withdrawal.transactionHash ? (
                          <div className="flex items-center gap-1">
                            <span className="font-mono text-xs truncate max-w-20">
                              {withdrawal.transactionHash}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => window.open(`https://etherscan.io/tx/${withdrawal.transactionHash}`, '_blank')}
                            >
                              <ExternalLink className="w-3 h-3" />
                            </Button>
                          </div>
                        ) : (
                          <span className="text-gray-400 text-sm">Sin hash</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEditDialog(withdrawal)}
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setDeleteDialogOpen(withdrawal.id)}
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {filteredWithdrawals.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No se encontraron retiros de fees {statusFilter !== "all" && `con estado "${statusFilter}"`}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Diálogo de edición */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Actualizar Retiro de Fee</DialogTitle>
          </DialogHeader>
          
          {selectedWithdrawal && (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-lg">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Monto</Label>
                    <p className="font-mono text-lg">{parseFloat(selectedWithdrawal.amount).toFixed(4)} {selectedWithdrawal.currency}</p>
                    
                    {selectedWithdrawal.aprBeforeWithdrawal && (
                      <div className="space-y-1">
                        <Label className="text-sm font-medium">Impacto en APR</Label>
                        {selectedWithdrawal.aprPenaltyApplied ? (
                          <div className="text-sm">
                            <p className="text-red-600">
                              <span className="font-mono">{selectedWithdrawal.aprBeforeWithdrawal}%</span> → 
                              <span className="font-mono"> {selectedWithdrawal.aprAfterWithdrawal}%</span>
                            </p>
                            <p className="text-xs text-orange-600">Penalización: -{selectedWithdrawal.aprPenaltyAmount}%</p>
                          </div>
                        ) : (
                          <p className="text-sm text-green-600">
                            Sin penalización (APR: {selectedWithdrawal.aprBeforeWithdrawal}%)
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Pool</Label>
                    <p className="text-sm">{selectedWithdrawal.tokenPair}</p>
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estado</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="pending">Pendiente</SelectItem>
                          <SelectItem value="confirmed">Confirmado</SelectItem>
                          <SelectItem value="rejected">Rechazado</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="transactionHash"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hash de Transacción</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="0x..." className="font-mono text-sm" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="processedBy"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Procesado por (Wallet)</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="0x..." className="font-mono text-sm" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notas</FormLabel>
                      <FormControl>
                        <Textarea {...field} placeholder="Notas adicionales..." rows={3} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex gap-2 pt-4">
                  <Button
                    type="submit"
                    disabled={updateWithdrawalMutation.isPending}
                    className="flex-1"
                  >
                    {updateWithdrawalMutation.isPending ? "Actualizando..." : "Actualizar"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsEditDialogOpen(false)}
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </Form>
          )}
        </DialogContent>
      </Dialog>

      {/* Diálogo de confirmación de eliminación */}
      <AlertDialog open={deleteDialogOpen !== null} onOpenChange={() => setDeleteDialogOpen(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar retiro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El retiro será eliminado permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteDialogOpen && deleteWithdrawalMutation.mutate(deleteDialogOpen)}
              className="bg-red-600 hover:bg-red-700"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}