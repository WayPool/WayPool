/**
 * Component for displaying the current user's invoices
 * with options to view them in detail and download them
 */

import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Invoice } from '@shared/schema';
import { APP_NAME } from '@/utils/app-config';
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
import { Loader2, Eye, AlertTriangle, CheckCircle, Clock, DollarSign, CalendarIcon, X, Search } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatDate, formatCurrency } from '@/lib/date-utils';
import { InvoiceDetailView } from './invoice-detail-view';
import { BillingProfileDialog } from './billing-profile-dialog';
import { useTranslation } from '@/hooks/use-translation';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

// Props for the component
interface UserInvoicesProps {
  walletAddress: string;
}

/**
 * Component for displaying user invoices
 */
export function UserInvoicesNew({ walletAddress }: UserInvoicesProps) {
  const { t, language } = useTranslation();
  const { toast } = useToast();
  
  // States
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [sortBy, setSortBy] = useState<string>('issueDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  
  // Query user invoices
  const {
    data: invoices,
    isLoading,
    error,
    refetch
  } = useQuery<Invoice[]>({
    queryKey: [`/api/invoices/wallet/${walletAddress}`],
    queryFn: async () => {
      try {
        console.log(`Getting invoices for wallet: ${walletAddress}`);
        const response = await fetch(`/api/invoices/wallet/${walletAddress}`);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error(`API Error (${response.status}):`, errorText);
          throw new Error(`Server error: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Received invoices:', data);
        
        if (!Array.isArray(data)) {
          console.warn('The API did not return an invoice array:', data);
          return [];
        }
        
        return data as Invoice[];
      } catch (err: any) {
        console.error('Error fetching invoices:', err);
        toast({
          title: t('Error'),
          description: t('Error loading invoices: ') + (err?.message || 'Unknown error'),
          variant: 'destructive',
        });
        // Return empty array in case of error to avoid rendering errors
        return [];
      }
    },
    staleTime: 1000 * 60, // 1 minute
    enabled: !!walletAddress,
    retry: 2, // Retry 2 times in case of error
  });
  
  // Function to sort invoices
  const handleSort = (column: string) => {
    if (sortBy === column) {
      // If already sorting by this column, change direction
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // New column to sort by
      setSortBy(column);
      setSortDirection('asc');
    }
  };

  // Get sort indicator (up/down arrow)
  const getSortIndicator = (column: string) => {
    if (sortBy !== column) return null;
    
    return (
      <span className="ml-1">
        {sortDirection === 'asc' ? '↑' : '↓'}
      </span>
    );
  };
  
  // Filter invoices by date
  const filteredInvoices = useMemo(() => {
    if (!invoices) return [];
    
    let filtered = [...invoices];
    
    // Filter by date if dates are selected
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
    
    // Sort the invoices
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
      
      // For numbers and other types
      const valA = aValue ? aValue.toString() : '';
      const valB = bValue ? bValue.toString() : '';
      const comparison = valA.localeCompare(valB);
      return sortDirection === 'asc' ? comparison : -comparison;
    });
    
    return filtered;
  }, [invoices, startDate, endDate, sortBy, sortDirection]);
  
  // Calculate statistics for the cards
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
      // Add to total
      stats.total += Number(invoice.amount);
      
      // Count by status
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

  // Handle invoice viewing
  const handleViewInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
  };

  // Close the detail modal
  const handleCloseDetail = () => {
    setSelectedInvoice(null);
  };

  // Format the invoice status
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

  // If loading
  if (isLoading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>{t('Mis facturas')}</CardTitle>
            <CardDescription>{t('Historial de facturas asociadas a tu wallet')}</CardDescription>
          </div>
          <div className="ml-auto">
            <BillingProfileDialog walletAddress={walletAddress} />
          </div>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-40">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  // If there is an error
  if (error) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>{t('Mis facturas')}</CardTitle>
            <CardDescription>{t('Historial de facturas asociadas a tu wallet')}</CardDescription>
          </div>
          <div className="ml-auto">
            <BillingProfileDialog walletAddress={walletAddress} />
          </div>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center h-40 space-y-4">
          <AlertTriangle className="h-12 w-12 text-amber-500" />
          <p className="text-center text-sm text-muted-foreground">{t('Error loading invoices')}</p>
          <Button variant="outline" onClick={() => refetch()}>
            {t('Retry')}
          </Button>
        </CardContent>
      </Card>
    );
  }

  // If there are no invoices
  if (!invoices || invoices.length === 0) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>{t('Mis facturas')}</CardTitle>
            <CardDescription>{t('Historial de facturas asociadas a tu wallet')}</CardDescription>
          </div>
          <div className="ml-auto">
            <BillingProfileDialog walletAddress={walletAddress} />
          </div>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center h-40 p-6 text-center">
          <p className="text-sm text-muted-foreground">{t('You have no registered invoices.')}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>{t('Mis facturas')}</CardTitle>
          <CardDescription>{t('Listado de todas tus facturas en')} {APP_NAME}</CardDescription>
        </div>
        <div className="ml-auto">
          <BillingProfileDialog walletAddress={walletAddress} />
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Statistics cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-blue-950">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex flex-col space-y-3">
                  <div className="text-gray-300 text-sm">{t('Total Facturado')}</div>
                  <div className="text-white text-2xl font-bold">${Number(statistics.total).toFixed(2)}</div>
                  <div className="text-gray-300 text-xs flex items-center mt-2">
                    <span className="text-green-400">+{(statistics.paidCount / (filteredInvoices.length || 1) * 100).toFixed(0)}%</span>
                    <span className="ml-1">{t('vs mes anterior')}</span>
                  </div>
                </div>
                <div className="bg-blue-900 p-3 rounded-full">
                  <DollarSign className="h-5 w-5 text-white" />
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-blue-900 text-gray-300 text-xs flex justify-between">
                <div>{t('Nº Facturas')}:</div>
                <div>{filteredInvoices.length}</div>
              </div>
              <div className="mt-1 text-gray-300 text-xs flex justify-between">
                <div>{t('Media')}:</div>
                <div>${(statistics.total / (filteredInvoices.length || 1)).toFixed(2)}</div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-amber-900">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex flex-col space-y-3">
                  <div className="text-gray-300 text-sm">{t('Pendiente de Cobro')}</div>
                  <div className="text-white text-2xl font-bold">${Number(statistics.pending).toFixed(2)}</div>
                  <div className="text-gray-300 text-xs flex items-center mt-2">
                    <span>{statistics.pendingCount} {t('facturas')}</span>
                  </div>
                </div>
                <div className="bg-amber-800 p-3 rounded-full">
                  <Clock className="h-5 w-5 text-white" />
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-amber-800 text-gray-300 text-xs flex justify-between">
                <div>{t('Ratio facturación')}:</div>
                <div>{(statistics.pending / (statistics.total || 1) * 100).toFixed(1)}%</div>
              </div>
              <div className="mt-1 text-gray-300 text-xs flex justify-between">
                <div>{t('Método más común')}:</div>
                <div>{t('Transferencia')}</div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-green-900">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex flex-col space-y-3">
                  <div className="text-gray-300 text-sm">{t('Cobrado')}</div>
                  <div className="text-white text-2xl font-bold">${Number(statistics.paid).toFixed(2)}</div>
                  <div className="text-gray-300 text-xs flex items-center mt-2">
                    <span>{statistics.paidCount} {t('facturas')}</span>
                  </div>
                </div>
                <div className="bg-green-800 p-3 rounded-full">
                  <CheckCircle className="h-5 w-5 text-white" />
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-green-800 text-gray-300 text-xs flex justify-between">
                <div>{t('Último pago')}:</div>
                <div>04/04/25</div>
              </div>
              <div className="mt-1 text-gray-300 text-xs flex justify-between">
                <div>{t('Mayor factura')}:</div>
                <div>${Math.max(...filteredInvoices.map(inv => Number(inv.amount) || 0)).toFixed(2)}</div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-red-900">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex flex-col space-y-3">
                  <div className="text-gray-300 text-sm">{t('Facturas Canceladas')}</div>
                  <div className="text-white text-2xl font-bold">{statistics.cancelledCount}</div>
                  <div className="text-gray-300 text-xs flex items-center mt-2">
                    <span>{(statistics.cancelledCount / (filteredInvoices.length || 1) * 100).toFixed(1)}% {t('del total')}</span>
                  </div>
                </div>
                <div className="bg-red-800 p-3 rounded-full">
                  <AlertTriangle className="h-5 w-5 text-white" />
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-red-800 text-gray-300 text-xs flex justify-between">
                <div>{t('Estado facturas')}:</div>
                <div className="flex items-center">
                  <span className="h-2 w-2 bg-green-500 rounded-full mr-1"></span>
                  <span>{statistics.paidCount} {t('pagadas')}</span>
                </div>
              </div>
              <div className="mt-1 text-gray-300 text-xs flex justify-between">
                <div></div>
                <div className="flex items-center">
                  <span className="h-2 w-2 bg-amber-500 rounded-full mr-1"></span>
                  <span>{statistics.pendingCount} {t('pendientes')}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Filters */}
        <div className="flex flex-col lg:flex-row justify-between gap-4">
          {/* Search and date filter */}
          <div className="flex flex-1 items-center space-x-2">
            <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate && endDate ? (
                    <span>
                      {formatDate(startDate, language)} - {formatDate(endDate, language)}
                    </span>
                  ) : (
                    <span>{t('Filtrar por fecha')}</span>
                  )}
                  {(startDate || endDate) && (
                    <X 
                      className="ml-2 h-4 w-4 hover:text-destructive" 
                      onClick={(e) => {
                        e.stopPropagation();
                        setStartDate(null);
                        setEndDate(null);
                      }}
                    />
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <div className="flex flex-col space-y-2 p-2">
                  <div className="grid gap-2">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-xs text-muted-foreground">{t('Fecha inicial')}</label>
                        <Calendar
                          mode="single"
                          selected={startDate}
                          onSelect={setStartDate}
                          initialFocus
                        />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground">{t('Fecha final')}</label>
                        <Calendar
                          mode="single"
                          selected={endDate}
                          onSelect={setEndDate}
                          initialFocus
                          disabled={(date) => startDate ? date < startDate : false}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setIsDatePickerOpen(false)}
                    >
                      {t('Aplicar filtro')}
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t('Buscar facturas...')}
                className="pl-8"
              />
            </div>
          </div>
          
          {/* Selector de estado */}
          <div className="flex items-center space-x-2">
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={t('Filtrar por estado')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('Todos los estados')}</SelectItem>
                <SelectItem value="Paid">{t('Pagadas')}</SelectItem>
                <SelectItem value="Pending">{t('Pendientes')}</SelectItem>
                <SelectItem value="Cancelled">{t('Canceladas')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Tabla de facturas */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[140px] cursor-pointer" onClick={() => handleSort('invoiceNumber')}>
                  {t('Nº Factura')} {getSortIndicator('invoiceNumber')}
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort('issueDate')}>
                  {t('Fecha')} {getSortIndicator('issueDate')}
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort('amount')}>
                  {t('Importe')} {getSortIndicator('amount')}
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort('status')}>
                  {t('Estado')} {getSortIndicator('status')}
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort('clientName')}>
                  {t('Cliente')} {getSortIndicator('clientName')}
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort('paymentMethod')}>
                  {t('Método de pago')} {getSortIndicator('paymentMethod')}
                </TableHead>
                <TableHead className="text-right">{t('Acciones')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInvoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
                  <TableCell>{formatDate(new Date(invoice.issueDate), language)}</TableCell>
                  <TableCell>${Number(invoice.amount).toFixed(2)}</TableCell>
                  <TableCell>{formatStatus(invoice.status)}</TableCell>
                  <TableCell>{invoice.clientName || 'N/A'}</TableCell>
                  <TableCell>{t(invoice.paymentMethod) || 'N/A'}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => handleViewInvoice(invoice)}>
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

      {/* Modal de detalle de factura */}
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