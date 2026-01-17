import React, { useState, useMemo } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Invoice } from '@shared/schema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { AlertCircle, AlertTriangle, CheckCircle, RefreshCw, Search, Edit, Eye, Trash, DollarSign, Clock, CalendarIcon, X, ArrowUp, ArrowDown, ArrowUpDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { formatDate, formatCurrency } from '@/lib/date-utils';
import { Badge } from '@/components/ui/badge';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/hooks/use-translation';
import { InvoiceDetailView } from '@/components/invoices/invoice-detail-view';
import { BillingProfileSelector } from '@/components/invoices/billing-profile-selector';
import { InvoiceService } from '@/lib/invoice-service';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription,
  DialogClose
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";

export function AdminInvoicesManager() {
  const { t, language } = useTranslation();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDetailViewOpen, setIsDetailViewOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [invoiceToDelete, setInvoiceToDelete] = useState<Invoice | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [sortBy, setSortBy] = useState<string>('issueDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  
  // Estados para paginación
  const [pageSize, setPageSize] = useState<number | 'all'>(10);
  const [currentPage, setCurrentPage] = useState(1);
  
  // Estado para los datos de edición
  const [editData, setEditData] = useState({
    status: '',
    paymentMethod: '',
    bankReference: '',
    transactionHash: '',
    paidDate: '',
    notes: '',
    clientName: '',
    clientAddress: '',
    clientCity: '',
    clientCountry: '',
    clientTaxId: ''
  });

  // Obtener todas las facturas
  const { data: invoices, isLoading, refetch, isRefetching } = useQuery<Invoice[]>({
    queryKey: ['/api/invoices'],
    queryFn: async () => {
      console.log("Fetching invoices data...");
      const res = await fetch('/api/invoices');
      if (!res.ok) throw new Error('Error al cargar facturas');
      const data = await res.json();
      console.log("Invoices data fetched successfully:", data.length);
      return data;
    },
    staleTime: 30000 // 30 segundos
  });

  // Función para ordenar facturas
  const handleSort = (column: string) => {
    if (sortBy === column) {
      // Si ya estaba ordenando por esta columna, cambiar dirección
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Nueva columna para ordenar
      setSortBy(column);
      setSortDirection('asc');
    }
  };

  // Obtener indicador de ordenación (flecha arriba/abajo)
  const getSortIndicator = (column: string) => {
    if (sortBy !== column) {
      // Mostrar un indicador sutil cuando la columna no está ordenada
      return (
        <span className="ml-1 text-muted-foreground/30">
          <ArrowUpDown className="h-3 w-3 inline" />
        </span>
      );
    }
    
    return (
      <span className="ml-1 text-primary">
        {sortDirection === 'asc' ? <ArrowUp className="h-4 w-4 inline" /> : <ArrowDown className="h-4 w-4 inline" />}
      </span>
    );
  };

  // Filtrar y ordenar facturas
  const filteredInvoices = React.useMemo(() => {
    if (!invoices) return [];
    
    // Aplicar filtros
    let filtered = [...invoices];
    
    // Filtro por estado
    if (statusFilter !== 'all') {
      filtered = filtered.filter(invoice => invoice.status === statusFilter);
    }
    
    // Filtro por búsqueda
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(invoice => 
        invoice.invoiceNumber.toLowerCase().includes(query) ||
        invoice.walletAddress.toLowerCase().includes(query) ||
        (invoice.clientName && invoice.clientName.toLowerCase().includes(query)) ||
        (invoice.notes && invoice.notes.toLowerCase().includes(query))
      );
    }
    
    // Filtrar por fecha si hay fechas seleccionadas
    if (startDate && endDate) {
      const startDateObj = new Date(startDate);
      startDateObj.setHours(0, 0, 0, 0);
      
      const endDateObj = new Date(endDate);
      endDateObj.setHours(23, 59, 59, 999);
      
      filtered = filtered.filter(invoice => {
        if (!invoice.issueDate) return false;
        const invoiceDate = new Date(invoice.issueDate);
        return invoiceDate >= startDateObj && invoiceDate <= endDateObj;
      });
    }
    
    // Ordenar las facturas
    filtered.sort((a, b) => {
      const aValue = a[sortBy as keyof Invoice];
      const bValue = b[sortBy as keyof Invoice];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        const comparison = aValue.localeCompare(bValue);
        return sortDirection === 'asc' ? comparison : -comparison;
      }
      
      if (aValue instanceof Date && bValue instanceof Date) {
        const comparison = aValue.getTime() - bValue.getTime();
        return sortDirection === 'asc' ? comparison : -comparison;
      }
      
      // Para números y otros tipos
      const valA = aValue ? aValue.toString() : '';
      const valB = bValue ? bValue.toString() : '';
      const comparison = valA.localeCompare(valB);
      return sortDirection === 'asc' ? comparison : -comparison;
    });
    
    return filtered;
  }, [invoices, statusFilter, searchQuery, startDate, endDate, sortBy, sortDirection]);
  
  // Calcular facturas visibles según la paginación
  const paginatedInvoices = React.useMemo(() => {
    // Si se selecciona "all", mostrar todas las facturas
    if (pageSize === 'all') {
      return filteredInvoices;
    }
    
    // Calcular el índice inicial y final para la paginación
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, filteredInvoices.length);
    
    // Devolver solo las facturas de la página actual
    return filteredInvoices.slice(startIndex, endIndex);
  }, [filteredInvoices, pageSize, currentPage]);
  
  // Calcular el número total de páginas
  const totalPages = React.useMemo(() => {
    if (pageSize === 'all') return 1;
    return Math.ceil(filteredInvoices.length / pageSize);
  }, [filteredInvoices.length, pageSize]);
  
  // Manejar el cambio de página
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  
  // Manejar el cambio del tamaño de página
  const handlePageSizeChange = (size: number | 'all') => {
    setPageSize(size);
    setCurrentPage(1); // Resetear a la primera página cuando cambia el tamaño
  };

  // Mutación para actualizar una factura
  const updateInvoiceMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => 
      apiRequest('PUT', `/api/invoices/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/invoices'] });
      toast({
        title: t('Factura actualizada'),
        description: t('La factura ha sido actualizada correctamente'),
      });
      setIsEditDialogOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: t('Error'),
        description: error.message || t('No se pudo actualizar la factura'),
        variant: 'destructive',
      });
    }
  });
  
  // Mutación para eliminar una factura
  const deleteInvoiceMutation = useMutation({
    mutationFn: (id: number) => 
      apiRequest('DELETE', `/api/invoices/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/invoices'] });
      toast({
        title: t('Factura eliminada'),
        description: t('La factura ha sido eliminada correctamente'),
      });
      setIsDeleteDialogOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: t('Error'),
        description: error.message || t('No se pudo eliminar la factura'),
        variant: 'destructive',
      });
    }
  });
  
  // Manejador para abrir el diálogo de confirmación de eliminación
  const handleDeleteClick = (invoice: Invoice) => {
    setInvoiceToDelete(invoice);
    setIsDeleteDialogOpen(true);
  };
  
  // Manejador para confirmar la eliminación
  const confirmDelete = () => {
    if (invoiceToDelete) {
      deleteInvoiceMutation.mutate(invoiceToDelete.id);
    }
  };

  // Manejador para abrir el diálogo de edición
  const handleEditClick = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    
    // Inicializar el formulario con los datos actuales
    setEditData({
      status: invoice.status || '',
      paymentMethod: invoice.paymentMethod || '',
      bankReference: invoice.bankReference || '',
      transactionHash: invoice.transactionHash || '',
      paidDate: invoice.paidDate ? new Date(invoice.paidDate).toISOString().split('T')[0] : '',
      notes: invoice.notes || '',
      clientName: invoice.clientName || '',
      clientAddress: invoice.clientAddress || '',
      clientCity: invoice.clientCity || '',
      clientCountry: invoice.clientCountry || '',
      clientTaxId: invoice.clientTaxId || ''
    });
    
    setIsEditDialogOpen(true);
  };

  // Manejador para guardar los cambios
  const handleSaveChanges = async () => {
    if (!selectedInvoice) return;
    
    const updateData: any = {};
    
    // Solo incluir campos que han cambiado
    if (editData.status && editData.status !== selectedInvoice.status) 
      updateData.status = editData.status;
      
    if (editData.paymentMethod && editData.paymentMethod !== selectedInvoice.paymentMethod) 
      updateData.paymentMethod = editData.paymentMethod;
      
    if (editData.bankReference !== selectedInvoice.bankReference) 
      updateData.bankReference = editData.bankReference || null;
      
    if (editData.transactionHash !== selectedInvoice.transactionHash) 
      updateData.transactionHash = editData.transactionHash || null;
      
    if (editData.notes !== selectedInvoice.notes) 
      updateData.notes = editData.notes;
      
    if (editData.clientName !== selectedInvoice.clientName) 
      updateData.clientName = editData.clientName;
      
    if (editData.clientAddress !== selectedInvoice.clientAddress) 
      updateData.clientAddress = editData.clientAddress;
      
    if (editData.clientCity !== selectedInvoice.clientCity) 
      updateData.clientCity = editData.clientCity;
      
    if (editData.clientCountry !== selectedInvoice.clientCountry) 
      updateData.clientCountry = editData.clientCountry;
      
    if (editData.clientTaxId !== selectedInvoice.clientTaxId) 
      updateData.clientTaxId = editData.clientTaxId;
    
    // Manejar la fecha de pago
    if (editData.status === 'Paid' || editData.status === 'Active') {
      // Si se marca como pagada y no había fecha de pago, establecer la fecha actual
      if (!selectedInvoice.paidDate) {
        updateData.paidDate = new Date();
      } else if (editData.paidDate) {
        // Si hay una fecha de pago proporcionada, usarla
        updateData.paidDate = new Date(editData.paidDate);
      }
    } else if (editData.status === 'Pending' || editData.status === 'Cancelled') {
      // Si se cambia a pendiente o cancelada, eliminar la fecha de pago
      updateData.paidDate = null;
    }
    
    // Si hay cambios, actualizar la factura
    if (Object.keys(updateData).length > 0) {
      updateInvoiceMutation.mutate({ 
        id: selectedInvoice.id, 
        data: updateData 
      });
    } else {
      toast({
        title: t('Sin cambios'),
        description: t('No se detectaron cambios en la factura'),
      });
      setIsEditDialogOpen(false);
    }
  };

  // Manejador para el cambio de estado rápido
  const handleQuickStatusChange = async (invoice: Invoice, newStatus: string) => {
    if (invoice.status === newStatus) return;
    
    const updateData: any = { status: newStatus };
    
    // Si se marca como pagada y no tenía fecha de pago, establecer la fecha actual
    if ((newStatus === 'Paid' || newStatus === 'Active') && !invoice.paidDate) {
      updateData.paidDate = new Date();
    } 
    // Si se marca como pendiente o cancelada, eliminar la fecha de pago
    else if ((newStatus === 'Pending' || newStatus === 'Cancelled') && invoice.paidDate) {
      updateData.paidDate = null;
    }
    
    updateInvoiceMutation.mutate({ id: invoice.id, data: updateData });
  };

  // Función para renderizar el badge de estado
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'Paid':
      case 'Active':
        return <Badge className="bg-green-600">{t(status)}</Badge>;
      case 'Pending':
        return <Badge variant="outline" className="text-amber-600 border-amber-600">{t(status)}</Badge>;
      case 'Cancelled':
        return <Badge variant="destructive">{t(status)}</Badge>;
      default:
        return <Badge variant="secondary">{t(status)}</Badge>;
    }
  };
  
  // Calcular estadísticas para las tarjetas
  const statistics = React.useMemo(() => {
    if (!filteredInvoices || filteredInvoices.length === 0) {
      return {
        total: 0,
        paid: 0,
        pending: 0,
        cancelled: 0,
        paidCount: 0,
        pendingCount: 0,
        cancelledCount: 0,
        avgInvoiceValue: 0,
        monthlyRevenue: 0,
        monthlyPaid: 0,
        pendingRate: 0,
        collectionRate: 0,
      };
    }
    
    // Estadísticas básicas
    const stats = filteredInvoices.reduce((stats, invoice) => {
      // Sumar al total
      stats.total += Number(invoice.amount);
      
      // Contar por estado
      if (invoice.status === 'Paid' || invoice.status === 'Active') {
        stats.paid += Number(invoice.amount);
        stats.paidCount++;
      } else if (invoice.status === 'Pending') {
        stats.pending += Number(invoice.amount);
        stats.pendingCount++;
      } else if (invoice.status === 'Cancelled') {
        stats.cancelled += Number(invoice.amount);
        stats.cancelledCount++;
      }
      
      return stats;
    }, {
      total: 0,
      paid: 0,
      pending: 0,
      cancelled: 0,
      paidCount: 0,
      pendingCount: 0,
      cancelledCount: 0,
    });
    
    // Cálculos analíticos adicionales
    const now = new Date();
    const oneMonthAgo = new Date(now);
    oneMonthAgo.setMonth(now.getMonth() - 1);
    
    // Facturas del último mes
    const lastMonthInvoices = filteredInvoices.filter(invoice => {
      if (!invoice.issueDate) return false;
      const issueDate = new Date(invoice.issueDate);
      return issueDate >= oneMonthAgo;
    });
    
    // Ingresos del último mes (total facturado)
    const monthlyRevenue = lastMonthInvoices.reduce((sum, invoice) => 
      sum + Number(invoice.amount), 0);
    
    // Ingresos cobrados del último mes
    const monthlyPaid = lastMonthInvoices
      .filter(invoice => invoice.status === 'Paid' || invoice.status === 'Active')
      .reduce((sum, invoice) => sum + Number(invoice.amount), 0);
    
    // Valor promedio de factura
    const avgInvoiceValue = stats.total / filteredInvoices.length;
    
    // Tasa de pendientes (Pendientes / Total)
    const pendingRate = stats.total > 0 ? (stats.pending / stats.total) * 100 : 0;
    
    // Tasa de cobro (Pagados / Total)
    const collectionRate = stats.total > 0 ? (stats.paid / stats.total) * 100 : 0;
    
    // Añadir métricas analíticas a las estadísticas básicas
    return {
      ...stats,
      avgInvoiceValue,
      monthlyRevenue,
      monthlyPaid,
      pendingRate,
      collectionRate
    };
  }, [filteredInvoices]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle>{t('Gestión de Facturas')}</CardTitle>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => {
                console.log("Refetch button clicked");
                refetch();
              }}
              disabled={isLoading || isRefetching}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${(isLoading || isRefetching) ? 'animate-spin' : ''}`} />
              {t('Actualizar')}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Tarjetas de estadísticas principales */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm font-medium">{t('Total facturado')}</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{formatCurrency(statistics.total, 'USD', language)}</p>
                    <p className="text-xs text-muted-foreground">{t('en')} {filteredInvoices.length} {t('facturas')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <p className="text-sm font-medium">{t('Pagado')}</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{formatCurrency(statistics.paid, 'USD', language)}</p>
                    <p className="text-xs text-muted-foreground">{statistics.paidCount} {t('facturas pagadas')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-amber-500" />
                    <p className="text-sm font-medium">{t('Pendiente')}</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{formatCurrency(statistics.pending, 'USD', language)}</p>
                    <p className="text-xs text-muted-foreground">{statistics.pendingCount} {t('facturas pendientes')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                    <p className="text-sm font-medium">{t('Cancelado')}</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{formatCurrency(statistics.cancelled, 'USD', language)}</p>
                    <p className="text-xs text-muted-foreground">{statistics.cancelledCount} {t('facturas canceladas')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Tarjetas de estadísticas analíticas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4 text-blue-500" />
                    <p className="text-sm font-medium">{t('Facturación mensual')}</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{formatCurrency(statistics.monthlyRevenue, 'USD', language)}</p>
                    <p className="text-xs text-muted-foreground">{t('últimos 30 días')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-indigo-500" />
                    <p className="text-sm font-medium">{t('Cobrado mensual')}</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{formatCurrency(statistics.monthlyPaid, 'USD', language)}</p>
                    <p className="text-xs text-muted-foreground">{t('últimos 30 días')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center gap-2">
                    <ArrowUp className="h-4 w-4 text-emerald-500" />
                    <p className="text-sm font-medium">{t('Tasa de cobro')}</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{statistics.collectionRate.toFixed(1)}%</p>
                    <p className="text-xs text-muted-foreground">{t('del total facturado')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center gap-2">
                    <ArrowUpDown className="h-4 w-4 text-purple-500" />
                    <p className="text-sm font-medium">{t('Valor promedio')}</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{formatCurrency(statistics.avgInvoiceValue, 'USD', language)}</p>
                    <p className="text-xs text-muted-foreground">{t('por factura')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Filtros de búsqueda */}
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder={t('Buscar por número, wallet o cliente...')}
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div>
              <Select 
                value={statusFilter} 
                onValueChange={setStatusFilter}
              >
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder={t('Estado')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('Todos los estados')}</SelectItem>
                  <SelectItem value="Pending">{t('Pending')}</SelectItem>
                  <SelectItem value="Paid">{t('Paid')}</SelectItem>
                  <SelectItem value="Active">{t('Active')}</SelectItem>
                  <SelectItem value="Cancelled">{t('Cancelled')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Filtros de fecha */}
          <div className="flex flex-col sm:flex-row justify-between gap-2 items-start sm:items-center">
            <div className="text-sm text-muted-foreground">
              {filteredInvoices.length} {t('facturas encontradas')}
            </div>
            <div className="w-full sm:w-auto">
              <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant={startDate && endDate ? "default" : "outline"}
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate && endDate ? (
                      <span>
                        {formatDate(startDate, "short")} - {formatDate(endDate, "short")}
                      </span>
                    ) : (
                      <span>{t("Rango de fechas")}</span>
                    )}
                    {startDate && endDate && (
                      <Badge variant="secondary" className="ml-2 bg-primary/20">
                        {t("Filtro activo")}
                      </Badge>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <div className="p-3 flex flex-col space-y-3">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">{t("Filtrar por fechas")}</h4>
                      {(startDate || endDate) && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 px-2"
                          onClick={() => {
                            setStartDate(null);
                            setEndDate(null);
                            setIsDatePickerOpen(false);
                          }}
                        >
                          <X className="h-4 w-4 mr-1" />
                          {t("Limpiar")}
                        </Button>
                      )}
                    </div>
                    <div>
                      <p className="text-sm mb-1">{t("Rango de fechas")}</p>
                      <Calendar
                        mode="range"
                        selected={{
                          from: startDate || undefined,
                          to: endDate || undefined,
                        }}
                        onSelect={(range) => {
                          if (range?.from) {
                            setStartDate(range.from);
                          }
                          if (range?.to) {
                            setEndDate(range.to);
                          }
                        }}
                        initialFocus
                        numberOfMonths={2}
                        showOutsideDays={false}
                      />
                    </div>
                    <Button 
                      className="w-full" 
                      onClick={() => setIsDatePickerOpen(false)}
                    >
                      {t("Aplicar filtro")}
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {isLoading || isRefetching ? (
            <div className="flex justify-center items-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2 text-primary">{isRefetching ? t('Actualizando...') : t('Cargando...')}</span>
            </div>
          ) : filteredInvoices && filteredInvoices.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead 
                      className="cursor-pointer"
                      onClick={() => handleSort("invoiceNumber")}
                    >
                      <div className="flex items-center">
                        {t('Nº Factura')}
                        {getSortIndicator("invoiceNumber")}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer"
                      onClick={() => handleSort("clientName")}
                    >
                      <div className="flex items-center">
                        {t('Cliente')}
                        {getSortIndicator("clientName")}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer"
                      onClick={() => handleSort("walletAddress")}
                    >
                      <div className="flex items-center">
                        {t('Wallet')}
                        {getSortIndicator("walletAddress")}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer"
                      onClick={() => handleSort("amount")}
                    >
                      <div className="flex items-center">
                        {t('Importe')}
                        {getSortIndicator("amount")}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer"
                      onClick={() => handleSort("status")}
                    >
                      <div className="flex items-center">
                        {t('Estado')}
                        {getSortIndicator("status")}
                      </div>
                    </TableHead>
                    <TableHead className="text-right">{t('Acciones')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedInvoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
                      <TableCell>
                        {invoice.clientName || 
                          `${t('Usuario')} ${invoice.walletAddress.substring(0, 6)}...${invoice.walletAddress.substring(38)}`
                        }
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {invoice.walletAddress.substring(0, 10)}...
                      </TableCell>
                      <TableCell>
                        {formatCurrency(invoice.amount, 'USD', language)}
                      </TableCell>
                      <TableCell>
                        {renderStatusBadge(invoice.status)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {invoice.status === 'Pending' && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 gap-1 text-green-600"
                              onClick={() => handleQuickStatusChange(invoice, 'Paid')}
                            >
                              <CheckCircle className="h-4 w-4" />
                              {t('Marcar pagada')}
                            </Button>
                          )}
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-blue-600"
                            onClick={() => {
                              setSelectedInvoice(invoice);
                              setIsDetailViewOpen(true);
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8"
                            onClick={() => handleEditClick(invoice)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-destructive hover:text-destructive/80"
                            onClick={() => handleDeleteClick(invoice)}
                            title={t('Eliminar factura')}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              {/* Paginación y selector de cantidad */}
              <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-4">
                <div className="flex items-center gap-2">
                  <p className="text-sm text-muted-foreground whitespace-nowrap">
                    {t('Mostrar')}:
                  </p>
                  <Select
                    value={pageSize.toString()}
                    onValueChange={(value) => handlePageSizeChange(value === 'all' ? 'all' : parseInt(value))}
                  >
                    <SelectTrigger className="w-[100px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                      <SelectItem value="100">100</SelectItem>
                      <SelectItem value="all">{t('Todas')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {pageSize !== 'all' && totalPages > 1 && (
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handlePageChange(1)}
                      disabled={currentPage === 1}
                    >
                      <ArrowUp className="h-4 w-4 -rotate-[135deg]" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      <ArrowUp className="h-4 w-4 -rotate-90" />
                    </Button>
                    
                    <div className="flex items-center gap-1">
                      {Array.from({length: Math.min(5, totalPages)}, (_, i) => {
                        // Mostrar páginas alrededor de la actual
                        let pageToShow;
                        if (totalPages <= 5) {
                          // Si hay 5 o menos páginas, mostrarlas todas
                          pageToShow = i + 1;
                        } else if (currentPage <= 3) {
                          // Si estamos en las primeras páginas
                          pageToShow = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          // Si estamos en las últimas páginas
                          pageToShow = totalPages - 4 + i;
                        } else {
                          // Estamos en medio, mostrar páginas centradas alrededor de la actual
                          pageToShow = currentPage - 2 + i;
                        }
                        
                        return (
                          <Button
                            key={pageToShow}
                            variant={currentPage === pageToShow ? "default" : "outline"}
                            size="icon"
                            className={currentPage === pageToShow ? "pointer-events-none" : ""}
                            onClick={() => handlePageChange(pageToShow)}
                          >
                            {pageToShow}
                          </Button>
                        );
                      })}
                    </div>
                    
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      <ArrowUp className="h-4 w-4 rotate-90" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handlePageChange(totalPages)}
                      disabled={currentPage === totalPages}
                    >
                      <ArrowUp className="h-4 w-4 rotate-45" />
                    </Button>
                  </div>
                )}
                
                <div className="text-sm text-muted-foreground whitespace-nowrap">
                  {t('Mostrando')} {filteredInvoices.length > 0 
                    ? `${pageSize === 'all' 
                      ? '1' 
                      : Math.min((currentPage - 1) * Number(pageSize) + 1, filteredInvoices.length)
                    }-${pageSize === 'all' 
                      ? filteredInvoices.length 
                      : Math.min(currentPage * Number(pageSize), filteredInvoices.length)
                    }` 
                    : '0'
                  } {t('de')} {filteredInvoices.length}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              {searchQuery || statusFilter !== 'all' ? (
                <p>{t('No se encontraron facturas con los filtros seleccionados')}</p>
              ) : (
                <p>{t('No hay facturas registradas')}</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Diálogo de edición de factura */}
      {selectedInvoice && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {t('Editar Factura')} #{selectedInvoice.invoiceNumber}
              </DialogTitle>
              <DialogDescription>
                {t('Actualiza los datos de la factura según sea necesario')}
              </DialogDescription>
            </DialogHeader>

            <Tabs defaultValue="invoice-status" className="mt-4">
              <TabsList className="grid grid-cols-3">
                <TabsTrigger value="invoice-status">{t('Estado y Pago')}</TabsTrigger>
                <TabsTrigger value="client-data">{t('Datos del Cliente')}</TabsTrigger>
                <TabsTrigger value="billing-profile">{t('Perfil de Facturación')}</TabsTrigger>
              </TabsList>
              
              <TabsContent value="invoice-status" className="space-y-4 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="status">{t('Estado')}</Label>
                    <Select 
                      value={editData.status} 
                      onValueChange={(value) => setEditData({...editData, status: value})}
                    >
                      <SelectTrigger id="status">
                        <SelectValue placeholder={t('Seleccionar estado')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Pending">{t('Pending')}</SelectItem>
                        <SelectItem value="Paid">{t('Paid')}</SelectItem>
                        <SelectItem value="Active">{t('Active')}</SelectItem>
                        <SelectItem value="Cancelled">{t('Cancelled')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="paymentMethod">{t('Método de pago')}</Label>
                    <Select 
                      value={editData.paymentMethod} 
                      onValueChange={(value) => setEditData({...editData, paymentMethod: value})}
                    >
                      <SelectTrigger id="paymentMethod">
                        <SelectValue placeholder={t('Seleccionar método')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Bank Transfer">{t('Bank Transfer')}</SelectItem>
                        <SelectItem value="Wallet Payment">{t('Wallet Payment')}</SelectItem>
                        <SelectItem value="Credit Card">{t('Credit Card')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="bankReference">{t('Referencia bancaria')}</Label>
                  <Input
                    id="bankReference"
                    value={editData.bankReference}
                    onChange={(e) => setEditData({...editData, bankReference: e.target.value})}
                    placeholder={t('Referencia de la transferencia bancaria')}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="transactionHash">{t('Hash de transacción')}</Label>
                  <Input
                    id="transactionHash"
                    value={editData.transactionHash}
                    onChange={(e) => setEditData({...editData, transactionHash: e.target.value})}
                    placeholder={t('Hash de la transacción en blockchain')}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="paidDate">{t('Fecha de pago')}</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="paidDate"
                      type="date"
                      value={editData.paidDate}
                      onChange={(e) => setEditData({...editData, paidDate: e.target.value})}
                      disabled={editData.status !== 'Paid' && editData.status !== 'Active'}
                    />
                    {(editData.status === 'Paid' || editData.status === 'Active') && !editData.paidDate && (
                      <div className="text-sm text-muted-foreground flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {t('Se usará la fecha actual')}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="notes">{t('Notas')}</Label>
                  <Textarea
                    id="notes"
                    value={editData.notes}
                    onChange={(e) => setEditData({...editData, notes: e.target.value})}
                    placeholder={t('Notas adicionales sobre la factura')}
                    rows={3}
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="client-data" className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="clientName">{t('Nombre del cliente')}</Label>
                  <Input
                    id="clientName"
                    value={editData.clientName}
                    onChange={(e) => setEditData({...editData, clientName: e.target.value})}
                    placeholder={t('Nombre completo del cliente o empresa')}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="clientTaxId">{t('ID Fiscal')}</Label>
                  <Input
                    id="clientTaxId"
                    value={editData.clientTaxId}
                    onChange={(e) => setEditData({...editData, clientTaxId: e.target.value})}
                    placeholder={t('Número de identificación fiscal')}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="clientAddress">{t('Dirección')}</Label>
                  <Input
                    id="clientAddress"
                    value={editData.clientAddress}
                    onChange={(e) => setEditData({...editData, clientAddress: e.target.value})}
                    placeholder={t('Dirección postal')}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="clientCity">{t('Ciudad')}</Label>
                    <Input
                      id="clientCity"
                      value={editData.clientCity}
                      onChange={(e) => setEditData({...editData, clientCity: e.target.value})}
                      placeholder={t('Ciudad')}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="clientCountry">{t('País')}</Label>
                    <Input
                      id="clientCountry"
                      value={editData.clientCountry}
                      onChange={(e) => setEditData({...editData, clientCountry: e.target.value})}
                      placeholder={t('País')}
                    />
                  </div>
                </div>
                
                <div className="pt-2">
                  <p className="text-sm text-muted-foreground">
                    {t('Los datos del cliente aparecerán en la factura PDF generada')}
                  </p>
                </div>
              </TabsContent>
              
              <TabsContent value="billing-profile" className="space-y-4 pt-4">
                {selectedInvoice && (
                  <BillingProfileSelector
                    invoiceId={selectedInvoice.id}
                    walletAddress={selectedInvoice.walletAddress}
                    initialBillingProfileId={selectedInvoice.billingProfileId || undefined}
                    onProfileSelected={(profile) => {
                      // Actualizar los datos del cliente con los del perfil seleccionado
                      setEditData({
                        ...editData,
                        clientName: profile.companyName || profile.fullName,
                        clientAddress: profile.address || '',
                        clientCity: profile.city || '',
                        clientCountry: profile.country || '',
                        clientTaxId: profile.taxId || ''
                      });
                      
                      // Refrescar la factura actual después de la asignación
                      InvoiceService.getInvoiceById(selectedInvoice.id)
                        .then(updatedInvoice => {
                          setSelectedInvoice(updatedInvoice);
                        })
                        .catch(error => {
                          console.error('Error al actualizar los datos de la factura:', error);
                        });
                    }}
                  />
                )}
              </TabsContent>
            </Tabs>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                {t('Cancelar')}
              </Button>
              <Button 
                onClick={handleSaveChanges} 
                disabled={updateInvoiceMutation.isPending}
              >
                {updateInvoiceMutation.isPending && (
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                )}
                {t('Guardar cambios')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      
      {/* Vista detallada de factura */}
      {isDetailViewOpen && selectedInvoice && (
        <InvoiceDetailView 
          invoice={selectedInvoice} 
          onClose={() => setIsDetailViewOpen(false)} 
        />
      )}
      
      {/* Diálogo de confirmación para eliminar factura */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t('¿Está seguro de eliminar esta factura?')}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {invoiceToDelete && (
                <>
                  {t('Se eliminará permanentemente la factura')} <strong>{invoiceToDelete.invoiceNumber}</strong>.{' '}
                  {t('Esta acción no se puede deshacer.')}
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              {t('Cancelar')}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteInvoiceMutation.isPending ? (
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              {t('Eliminar')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}