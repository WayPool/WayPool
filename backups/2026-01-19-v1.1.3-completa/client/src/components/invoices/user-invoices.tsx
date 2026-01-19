/**
 * Componente para mostrar las facturas del usuario actual
 * con opciones para verlas en detalle y descargarlas
 */

import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Invoice } from '@shared/schema';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Eye, AlertTriangle, CheckCircle, Clock, DollarSign, CalendarIcon, X } from 'lucide-react';
import { formatDate, formatCurrency } from '@/lib/date-utils';
import { InvoiceDetailView } from './invoice-detail-view';
import { useTranslation } from '@/hooks/use-translation';
import { InvoiceService } from '@/lib/invoice-service';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

// Props para el componente
interface UserInvoicesProps {
  walletAddress: string;
}

/**
 * Componente para mostrar las facturas del usuario
 */
export function UserInvoices({ walletAddress }: UserInvoicesProps) {
  const { t, language } = useTranslation();
  const { toast } = useToast();
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [sortBy, setSortBy] = useState<string>('issueDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  
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
    if (sortBy !== column) return null;
    
    return (
      <span className="ml-1">
        {sortDirection === 'asc' ? '↑' : '↓'}
      </span>
    );
  };

  // Consultar las facturas del usuario
  const {
    data: invoices,
    isLoading,
    error,
    refetch
  } = useQuery<Invoice[]>({
    queryKey: [`/api/invoices/wallet/${walletAddress}`],
    queryFn: async () => {
      try {
        console.log(`Obteniendo facturas para wallet: ${walletAddress}`);
        const response = await fetch(`/api/invoices/wallet/${walletAddress}`);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error(`Error de API (${response.status}):`, errorText);
          throw new Error(`Error de servidor: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Facturas recibidas:', data);
        
        if (!Array.isArray(data)) {
          console.warn('La API no devolvió un array de facturas:', data);
          return [];
        }
        
        return data as Invoice[];
      } catch (err: any) {
        console.error('Error fetching invoices:', err);
        toast({
          title: t('Error'),
          description: t('Error al cargar las facturas: ') + (err?.message || 'Error desconocido'),
          variant: 'destructive',
        });
        // Devolver un array vacío en caso de error para evitar errores de renderizado
        return [];
      }
    },
    staleTime: 1000 * 60, // 1 minuto
    enabled: !!walletAddress,
    retry: 2, // Reintentar 2 veces en caso de error
  });

  // Manejar la visualización de una factura
  const handleViewInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
  };

  // Cerrar el modal de detalle
  const handleCloseDetail = () => {
    setSelectedInvoice(null);
  };

  // Formatear el estado de la factura
  const formatStatus = (status: string) => {
    switch (status) {
      case 'Paid':
      case 'Active':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">
            {t(status)}
          </span>
        );
      case 'Pending':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-800 dark:text-amber-100">
            {t(status)}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100">
            {t(status)}
          </span>
        );
    }
  };

  // Si está cargando
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t('Mis facturas')}</CardTitle>
          <CardDescription>{t('Historial de facturas asociadas a tu wallet')}</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-40">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  // Si hay un error
  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t('Mis facturas')}</CardTitle>
          <CardDescription>{t('Historial de facturas asociadas a tu wallet')}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center h-40 space-y-4">
          <AlertTriangle className="h-12 w-12 text-amber-500" />
          <p className="text-center text-sm text-muted-foreground">{t('Error al cargar las facturas')}</p>
          <Button variant="outline" onClick={() => refetch()}>
            {t('Reintentar')}
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Filtrar facturas por fecha
  const filteredInvoices = useMemo(() => {
    if (!invoices) return [];
    
    let filtered = [...invoices];
    
    // Filtrar por fecha si hay fechas seleccionadas
    if (startDate && endDate) {
      const startDateObj = new Date(startDate);
      startDateObj.setHours(0, 0, 0, 0);
      
      const endDateObj = new Date(endDate);
      endDateObj.setHours(23, 59, 59, 999);
      
      filtered = filtered.filter(invoice => {
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
  }, [invoices, startDate, endDate, sortBy, sortDirection]);
  
  // Calcular estadísticas para las tarjetas
  const statistics = useMemo(() => {
    if (!filteredInvoices || filteredInvoices.length === 0) {
      return {
        total: 0,
        paid: 0,
        pending: 0,
        cancelled: 0,
        paidCount: 0,
        pendingCount: 0,
        cancelledCount: 0,
      };
    }
    
    return filteredInvoices.reduce((stats, invoice) => {
      // Sumar al total
      stats.total += Number(invoice.amount);
      
      // Contar por estado
      if (invoice.status === 'Paid') {
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
  }, [filteredInvoices]);

  // Si no hay facturas
  if (!invoices || invoices.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t('Mis facturas')}</CardTitle>
          <CardDescription>{t('Historial de facturas asociadas a tu wallet')}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center h-40 p-6 text-center">
          <p className="text-sm text-muted-foreground">{t('No tienes facturas registradas.')}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between space-y-0">
        <div>
          <CardTitle>{t('Mis facturas')}</CardTitle>
          <CardDescription>{t('Listado de todas tus facturas en WayBank')}</CardDescription>
        </div>
        <Button 
          variant="outline" 
          onClick={() => window.location.href = '/billing-profile'}
          className="flex items-center gap-2"
        >
          <DollarSign className="h-4 w-4" />
          {t('Perfil de facturación')}
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Tarjetas de estadísticas */}
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
        
        {/* Filtros */}
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
              <PopoverContent className="w-auto p-0 min-w-[688px]" align="start">
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
        
        {/* Tabla de facturas */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead 
                  className="cursor-pointer w-[140px]"
                  onClick={() => handleSort("invoiceNumber")}
                >
                  <div className="flex items-center">
                    {t('Nº Factura')}
                    {getSortIndicator("invoiceNumber")}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer w-[100px]"
                  onClick={() => handleSort("issueDate")}
                >
                  <div className="flex items-center">
                    {t('Fecha')}
                    {getSortIndicator("issueDate")}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer w-[120px]"
                  onClick={() => handleSort("amount")}
                >
                  <div className="flex items-center">
                    {t('Importe')}
                    {getSortIndicator("amount")}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer w-[120px]"
                  onClick={() => handleSort("status")}
                >
                  <div className="flex items-center">
                    {t('Estado')}
                    {getSortIndicator("status")}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => handleSort("paymentMethod")}
                >
                  <div className="flex items-center">
                    {t('Método de pago')}
                    {getSortIndicator("paymentMethod")}
                  </div>
                </TableHead>
                <TableHead className="text-right w-[120px]">{t('Acciones')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInvoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell>{invoice.invoiceNumber}</TableCell>
                  <TableCell>{formatDate(invoice.issueDate, 'dd/MM/yyyy', language)}</TableCell>
                  <TableCell>{formatCurrency(invoice.amount, 'USD', language)}</TableCell>
                  <TableCell>{formatStatus(invoice.status)}</TableCell>
                  <TableCell>{t(invoice.paymentMethod)}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewInvoice(invoice)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      {t('Ver')}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      {/* Modal para ver detalle de factura */}
      {selectedInvoice && (
        <InvoiceDetailView
          invoice={selectedInvoice}
          onClose={handleCloseDetail}
          walletAddress={walletAddress}
        />
      )}
    </Card>
  );
}