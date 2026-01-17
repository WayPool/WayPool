import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, FileSpreadsheet, Calendar, Filter } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRealWallet } from '@/hooks/use-real-wallet';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

interface Invoice {
  id: number;
  invoiceNumber: string;
  walletAddress: string;
  email: string;
  fullName: string;
  amount: number;
  taxAmount: number;
  totalAmount: number;
  currency: string;
  status: string;
  createdAt: string;
  dueDate: string;
  paymentDate?: string;
  description: string;
  taxRate: number;
  country: string;
  city: string;
  address: string;
  taxId?: string;
  paymentMethod?: string;
  stripePaymentId?: string;
}

export default function AccountingExport() {
  const [startDate, setStartDate] = useState('2025-01-01');
  const [endDate, setEndDate] = useState('2025-05-27');
  const [status, setStatus] = useState('all');
  const [currency, setCurrency] = useState('all');
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();
  const { address } = useRealWallet();
  
  // Fallback: obtener wallet desde localStorage si el hook falla
  const walletAddress = address || localStorage.getItem('waybank_wallet_address') || '0x6b22cEB508db3C81d69ED6451d63B56a1fb7271F';

  // Formatear fecha para Excel
  const formatDateForExcel = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES');
  };

  // Formatear números para contabilidad (formato UAE/Dubai)
  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-AE', {
      style: 'currency',
      currency: currency || 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  // Obtener datos de facturas desde el backend
  const fetchInvoices = async (): Promise<Invoice[]> => {
    try {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      if (status !== 'all') params.append('status', status);
      if (currency !== 'all') params.append('currency', currency);
      
      console.log('🔍 Frontend sending params:', { startDate, endDate, status, currency });
      console.log('🔍 URL params string:', params.toString());

      const response = await fetch(`/api/admin/invoices/export?${params}`, {
        method: 'GET',
        credentials: 'include', // Incluir cookies de sesión
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'x-wallet-address': walletAddress // Añadir wallet para autenticación
        }
      });
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Facturas obtenidas para exportación:', data.length);
      return data;
    } catch (error) {
      console.error('Error fetching invoices:', error);
      toast({
        title: "Error",
        description: "No se pudieron obtener las facturas para exportar",
        variant: "destructive"
      });
      return [];
    }
  };

  // Generar archivo Excel para contabilidad
  const generateAccountingExcel = async () => {
    setIsExporting(true);
    
    try {
      const invoices = await fetchInvoices();
      
      if (invoices.length === 0) {
        toast({
          title: "Sin datos",
          description: "No hay facturas en el rango de fechas seleccionado",
          variant: "destructive"
        });
        return;
      }

      // Preparar datos principales de facturas
      const invoiceData = invoices.map((invoice, index) => ({
        // Identificación
        'Nº Factura': invoice.invoiceNumber,
        'ID Sistema': invoice.id,
        'Nº Consecutivo': index + 1,
        
        // Fechas contables
        'Fecha Emisión': formatDateForExcel(invoice.createdAt),
        'Fecha Vencimiento': formatDateForExcel(invoice.dueDate),
        'Fecha Pago': formatDateForExcel(invoice.paymentDate || ''),
        'Periodo Contable': new Date(invoice.createdAt).toLocaleDateString('es-ES', { year: 'numeric', month: 'long' }),
        
        // Cliente
        'Cliente': invoice.fullName || 'N/A',
        'Email Cliente': invoice.email || 'N/A',
        'Dirección Wallet': invoice.walletAddress,
        'País': invoice.country || 'N/A',
        'Ciudad': invoice.city || 'N/A',
        'Dirección Fiscal': invoice.address || 'N/A',
        'NIF/CIF': invoice.taxId || 'N/A',
        
        // Importes contables (UAE/Dubai)
        'Base Imponible': parseFloat(invoice.amount.toFixed(2)),
        'Tipo VAT (%)': parseFloat(invoice.taxRate.toFixed(2)),
        'Importe VAT': parseFloat(invoice.taxAmount.toFixed(2)),
        'Total Factura': parseFloat(invoice.totalAmount.toFixed(2)),
        'Moneda': invoice.currency,
        
        // Contabilización UAE
        'Cuenta Ingreso': '4100000', // Revenue Account UAE
        'Cuenta VAT Cobrado': '2300000', // VAT Payable UAE
        'Cuenta Cliente': '1200000', // Accounts Receivable UAE
        
        // Estado y control
        'Estado': invoice.status,
        'Cobrado': invoice.status === 'paid' ? 'SÍ' : 'NO',
        'Método Pago': invoice.paymentMethod || 'N/A',
        'ID Pago Stripe': invoice.stripePaymentId || 'N/A',
        
        // Descripción
        'Concepto': invoice.description || 'Servicios de liquidez WayBank',
        
        // Campos adicionales para análisis
        'Trimestre': Math.ceil((new Date(invoice.createdAt).getMonth() + 1) / 3),
        'Año Fiscal': new Date(invoice.createdAt).getFullYear(),
        'Días Vencimiento': invoice.dueDate ? Math.ceil((new Date(invoice.dueDate).getTime() - new Date(invoice.createdAt).getTime()) / (1000 * 60 * 60 * 24)) : 0
      }));

      // Crear resumen contable
      const summaryData = [
        {
          'Concepto': 'RESUMEN CONTABLE - FACTURAS',
          'Valor': '',
          'Moneda': ''
        },
        {
          'Concepto': 'Total Facturas',
          'Valor': invoices.length,
          'Moneda': ''
        },
        {
          'Concepto': 'Facturas Pagadas',
          'Valor': invoices.filter(inv => inv.status === 'paid').length,
          'Moneda': ''
        },
        {
          'Concepto': 'Facturas Pendientes',
          'Valor': invoices.filter(inv => inv.status === 'pending').length,
          'Moneda': ''
        },
        {
          'Concepto': '',
          'Valor': '',
          'Moneda': ''
        },
        // Totales por moneda
        ...Object.entries(
          invoices.reduce((acc, inv) => {
            if (!acc[inv.currency]) {
              acc[inv.currency] = { base: 0, tax: 0, total: 0 };
            }
            acc[inv.currency].base += inv.amount;
            acc[inv.currency].tax += inv.taxAmount;
            acc[inv.currency].total += inv.totalAmount;
            return acc;
          }, {} as Record<string, { base: number; tax: number; total: number }>)
        ).flatMap(([currency, amounts]) => [
          {
            'Concepto': `BASE IMPONIBLE ${currency}`,
            'Valor': parseFloat(amounts.base.toFixed(2)),
            'Moneda': currency
          },
          {
            'Concepto': `VAT COBRADO ${currency}`,
            'Valor': parseFloat(amounts.tax.toFixed(2)),
            'Moneda': currency
          },
          {
            'Concepto': `TOTAL FACTURADO ${currency}`,
            'Valor': parseFloat(amounts.total.toFixed(2)),
            'Moneda': currency
          },
          {
            'Concepto': '',
            'Valor': '',
            'Moneda': ''
          }
        ])
      ];

      // Crear libro de Excel
      const workbook = XLSX.utils.book_new();
      
      // Hoja principal de facturas
      const invoiceSheet = XLSX.utils.json_to_sheet(invoiceData);
      
      // Ajustar anchos de columna
      const columnWidths = [
        { wch: 15 }, // Nº Factura
        { wch: 10 }, // ID Sistema
        { wch: 12 }, // Nº Consecutivo
        { wch: 15 }, // Fecha Emisión
        { wch: 15 }, // Fecha Vencimiento
        { wch: 15 }, // Fecha Pago
        { wch: 20 }, // Periodo Contable
        { wch: 25 }, // Cliente
        { wch: 30 }, // Email Cliente
        { wch: 45 }, // Dirección Wallet
        { wch: 15 }, // País
        { wch: 15 }, // Ciudad
        { wch: 30 }, // Dirección Fiscal
        { wch: 15 }, // NIF/CIF
        { wch: 15 }, // Base Imponible
        { wch: 12 }, // Tipo VAT
        { wch: 15 }, // Importe VAT
        { wch: 15 }, // Total Factura
        { wch: 10 }, // Moneda
        { wch: 12 }, // Cuenta Ingreso
        { wch: 15 }, // Cuenta VAT
        { wch: 15 }, // Cuenta Cliente
        { wch: 12 }, // Estado
        { wch: 10 }, // Cobrado
        { wch: 15 }, // Método Pago
        { wch: 25 }, // ID Pago Stripe
        { wch: 35 }, // Concepto
        { wch: 12 }, // Trimestre
        { wch: 12 }, // Año Fiscal
        { wch: 15 }  // Días Vencimiento
      ];
      
      invoiceSheet['!cols'] = columnWidths;
      
      // Hoja de resumen
      const summarySheet = XLSX.utils.json_to_sheet(summaryData);
      summarySheet['!cols'] = [{ wch: 30 }, { wch: 20 }, { wch: 15 }];
      
      // Agregar hojas al libro
      XLSX.utils.book_append_sheet(workbook, invoiceSheet, 'Facturas Detalle');
      XLSX.utils.book_append_sheet(workbook, summarySheet, 'Resumen Contable');
      
      // Generar nombre de archivo
      const dateRange = startDate && endDate 
        ? `${startDate}_${endDate}`
        : new Date().toISOString().split('T')[0];
      
      const fileName = `WayBank_Contabilidad_Facturas_${dateRange}.xlsx`;
      
      // Descargar archivo
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
      saveAs(blob, fileName);
      
      toast({
        title: "Excel generado exitosamente",
        description: `Archivo ${fileName} descargado correctamente`,
      });
      
    } catch (error) {
      console.error('Error generating Excel:', error);
      toast({
        title: "Error",
        description: "Error al generar el archivo Excel",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileSpreadsheet className="h-5 w-5" />
          Exportación Contable - Excel
        </CardTitle>
        <CardDescription>
          Genera un archivo Excel completo con todas las facturas y datos necesarios para contabilidad
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Filtros de fecha */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="startDate" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Fecha Inicio
            </Label>
            <Input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="endDate" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Fecha Fin
            </Label>
            <Input
              id="endDate"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full"
            />
          </div>
        </div>

        {/* Filtros adicionales */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Estado de Factura
            </Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las facturas</SelectItem>
                <SelectItem value="paid">Solo pagadas</SelectItem>
                <SelectItem value="pending">Solo pendientes</SelectItem>
                <SelectItem value="overdue">Solo vencidas</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Moneda
            </Label>
            <Select value={currency} onValueChange={setCurrency}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar moneda" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las monedas</SelectItem>
                <SelectItem value="USD">USD</SelectItem>
                <SelectItem value="EUR">EUR</SelectItem>
                <SelectItem value="USDC">USDC</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Información del archivo */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-900 mb-2">El archivo Excel incluirá:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-blue-800">
            <div>
              <p>✓ Datos completos de facturación</p>
              <p>✓ Información fiscal y contable</p>
              <p>✓ Códigos de cuenta contable</p>
              <p>✓ Análisis de vencimientos</p>
            </div>
            <div>
              <p>✓ Resumen por monedas</p>
              <p>✓ Totales de VAT cobrado</p>
              <p>✓ Control de cobros</p>
              <p>✓ Datos para UAE Tax Authority</p>
            </div>
          </div>
        </div>

        {/* Botón de descarga */}
        <Button 
          onClick={generateAccountingExcel}
          disabled={isExporting}
          className="w-full"
          size="lg"
        >
          {isExporting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Generando Excel...
            </>
          ) : (
            <>
              <Download className="h-4 w-4 mr-2" />
              Descargar Excel Contable
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}