import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { InvoiceService, InvoiceUpdateData } from "@/lib/invoice-service";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
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
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Calendar,
} from "@/components/ui/calendar";
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Loader2, 
  FileText, 
  Download, 
  Edit, 
  Trash, 
  Search, 
  RefreshCw, 
  DollarSign, 
  AlertCircle, 
  Clock, 
  CheckCircle, 
  ArrowUpRight,
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
  Calendar as CalendarIcon,
  X
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { formatDate } from "@/lib/date-utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { InvoiceDetailView } from "./invoice-detail-view";
import { useTranslation } from "@/hooks/use-translation";

const editInvoiceSchema = z.object({
  status: z.string(),
  paidDate: z.string().optional().nullable(),
  notes: z.string().optional(),
  bankReference: z.string().optional(),
  transactionHash: z.string().optional(),
  // Datos del cliente
  clientName: z.string().optional(),
  clientAddress: z.string().optional(),
  clientCity: z.string().optional(),
  clientCountry: z.string().optional(),
  clientTaxId: z.string().optional(),
});

export default function AdminInvoicesManager() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<number | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [searchWallet, setSearchWallet] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  
  // Gestión del ordenamiento
  type SortField = "invoiceNumber" | "walletAddress" | "issueDate" | "amount" | "status";
  type SortDirection = "asc" | "desc";
  const [sortField, setSortField] = useState<SortField>("invoiceNumber");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  const { data: invoices, isLoading, error } = useQuery({
    queryKey: ["/api/invoices"],
    queryFn: async () => {
      try {
        console.log("Iniciando consulta de invoices desde el admin manager");
        const result = await InvoiceService.getAllInvoices();
        console.log("Resultado de getAllInvoices:", result);
        if (!result) {
          console.warn("La consulta de invoices retornó un valor nulo o undefined");
          return [];
        }
        if (!Array.isArray(result)) {
          console.warn("La consulta de invoices no retornó un array:", result);
          return [];
        }
        return result;
      } catch (error) {
        console.error("Error en queryFn de invoices:", error);
        throw error;
      }
    }
  });

  const form = useForm<z.infer<typeof editInvoiceSchema>>({
    resolver: zodResolver(editInvoiceSchema),
    defaultValues: {
      status: "Pending",
      paidDate: null,
      notes: "",
      bankReference: "",
      transactionHash: "",
    },
  });

  const updateInvoiceMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: InvoiceUpdateData }) => 
      InvoiceService.updateInvoice(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/invoices"] });
      toast({
        title: t("Factura actualizada"),
        description: t("La factura ha sido actualizada correctamente"),
      });
      setIsEditOpen(false);
    },
    onError: (error) => {
      toast({
        title: t("Error"),
        description: t("No se pudo actualizar la factura") + ": " + error.message,
        variant: "destructive",
      });
    },
  });

  const deleteInvoiceMutation = useMutation({
    mutationFn: (id: number) => InvoiceService.deleteInvoice(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/invoices"] });
      toast({
        title: t("Factura eliminada"),
        description: t("La factura ha sido eliminada correctamente"),
      });
    },
    onError: (error) => {
      toast({
        title: t("Error"),
        description: t("No se pudo eliminar la factura") + ": " + error.message,
        variant: "destructive",
      });
    },
  });

  const handleDownloadPdf = async (invoiceId: number) => {
    try {
      toast({
        title: t("Generando PDF"),
        description: t("Espere mientras se genera el documento"),
      });
      
      const pdfBlob = await InvoiceService.generateInvoicePdf(invoiceId);
      const url = URL.createObjectURL(pdfBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `invoice-${invoiceId}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: t("PDF generado"),
        description: t("La factura ha sido descargada correctamente"),
      });
    } catch (error) {
      console.error("Error al descargar la factura:", error);
      toast({
        title: t("Error"),
        description: t("No se pudo generar el PDF de la factura"),
        variant: "destructive",
      });
    }
  };

  const viewInvoiceDetails = (invoiceId: number) => {
    setSelectedInvoiceId(invoiceId);
    setIsDetailOpen(true);
  };

  const editInvoice = (invoiceId: number) => {
    const invoice = invoices?.find((inv) => inv.id === invoiceId);
    if (!invoice) return;

    form.reset({
      status: invoice.status,
      paidDate: invoice.paidDate ? new Date(invoice.paidDate).toISOString().substring(0, 10) : null,
      notes: invoice.notes || "",
      bankReference: invoice.bankReference || "",
      transactionHash: invoice.transactionHash || "",
      // Datos del cliente
      clientName: invoice.clientName || "",
      clientAddress: invoice.clientAddress || "",
      clientCity: invoice.clientCity || "",
      clientCountry: invoice.clientCountry || "",
      clientTaxId: invoice.clientTaxId || "",
    });

    setSelectedInvoiceId(invoiceId);
    setIsEditOpen(true);
  };

  const handleDeleteInvoice = (invoiceId: number) => {
    if (window.confirm(t("¿Estás seguro de que deseas eliminar esta factura?"))) {
      deleteInvoiceMutation.mutate(invoiceId);
    }
  };

  const onSubmitEdit = (values: z.infer<typeof editInvoiceSchema>) => {
    if (!selectedInvoiceId) return;

    const updateData: InvoiceUpdateData = {
      status: values.status,
      notes: values.notes,
      bankReference: values.bankReference,
      transactionHash: values.transactionHash,
      // Datos del cliente
      clientName: values.clientName,
      clientAddress: values.clientAddress,
      clientCity: values.clientCity,
      clientCountry: values.clientCountry,
      clientTaxId: values.clientTaxId,
    };

    // Si el estado cambió a "Paid" y no hay fecha de pago, establecerla automáticamente
    if (values.status === "Paid") {
      updateData.paidDate = values.paidDate ? new Date(values.paidDate) : new Date();
    } else {
      updateData.paidDate = values.paidDate ? new Date(values.paidDate) : undefined;
    }

    updateInvoiceMutation.mutate({
      id: selectedInvoiceId,
      data: updateData,
    });
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "Paid":
        return "success";
      case "Pending":
        return "warning";
      default:
        return "secondary";
    }
  };

  // Función para cambiar el orden de la tabla
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // Si es el mismo campo, invertir la dirección
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      // Si es un campo diferente, establecer el nuevo campo y dirección por defecto desc
      setSortField(field);
      setSortDirection("desc");
    }
  };
  
  // Flecha indicadora para columnas ordenables
  const getSortIndicator = (field: SortField) => {
    if (sortField !== field) return <ArrowUpDown className="ml-1 h-4 w-4 opacity-50" />;
    
    return sortDirection === "asc" 
      ? <ArrowUp className="ml-1 h-4 w-4" /> 
      : <ArrowDown className="ml-1 h-4 w-4" />;
  };
  
  const filteredInvoices = useMemo(() => {
    // Si no hay facturas, devuelve un array vacío para evitar errores
    if (!invoices || !Array.isArray(invoices)) {
      console.log("No hay facturas disponibles para filtrar");
      return [];
    }
    
    // Primero filtramos las facturas según los criterios
    const filtered = invoices.filter((invoice) => {
      // Verificar que invoice sea un objeto válido
      if (!invoice || typeof invoice !== 'object') {
        console.warn("Elemento inválido en el array de facturas:", invoice);
        return false;
      }
      
      try {
        // Filtro por dirección de wallet
        const matchesWallet = !searchWallet || 
          (invoice.walletAddress && invoice.walletAddress.toLowerCase().includes(searchWallet.toLowerCase()));
        
        // Filtro por estado
        const matchesStatus = !filterStatus || filterStatus === "all" || invoice.status === filterStatus;
        
        // Filtro por rango de fechas
        let matchesDateRange = true;
        if (invoice.issueDate) {
          const issueDate = new Date(invoice.issueDate);
          
          // Verificar fecha de inicio
          if (startDate) {
            // Establecer hora a 00:00:00 para comparar solo la fecha
            const startDateTime = new Date(startDate);
            startDateTime.setHours(0, 0, 0, 0);
            matchesDateRange = matchesDateRange && issueDate >= startDateTime;
          }
          
          // Verificar fecha de fin
          if (endDate) {
            // Establecer hora a 23:59:59 para incluir todo el día final
            const endDateTime = new Date(endDate);
            endDateTime.setHours(23, 59, 59, 999);
            matchesDateRange = matchesDateRange && issueDate <= endDateTime;
          }
        }
        
        return matchesWallet && matchesStatus && matchesDateRange;
      } catch (err) {
        console.error("Error al filtrar factura:", err, invoice);
        return false;
      }
    });
    
    // Luego ordenamos las facturas según el campo y dirección actuales
    return [...filtered].sort((a, b) => {
      if (!a || !b) return 0;
      
      try {
        let valueA, valueB;
        
        switch (sortField) {
          case "invoiceNumber":
            valueA = a.invoiceNumber || "";
            valueB = b.invoiceNumber || "";
            break;
          case "walletAddress":
            valueA = a.walletAddress || "";
            valueB = b.walletAddress || "";
            break;
          case "issueDate":
            valueA = a.issueDate ? new Date(a.issueDate).getTime() : 0;
            valueB = b.issueDate ? new Date(b.issueDate).getTime() : 0;
            break;
          case "amount":
            valueA = parseFloat(a.amount || "0");
            valueB = parseFloat(b.amount || "0");
            break;
          case "status":
            valueA = a.status || "";
            valueB = b.status || "";
            break;
          default:
            return 0;
        }
        
        // Comparar en la dirección correcta
        const multiplier = sortDirection === "asc" ? 1 : -1;
        
        if (typeof valueA === "string" && typeof valueB === "string") {
          return valueA.localeCompare(valueB) * multiplier;
        } else {
          return ((valueA < valueB) ? -1 : (valueA > valueB) ? 1 : 0) * multiplier;
        }
      } catch (error) {
        console.error("Error al ordenar facturas:", error);
        return 0;
      }
    });
  }, [invoices, searchWallet, filterStatus, startDate, endDate, sortField, sortDirection]);
  
  // Calcular estadísticas de facturación con manejo seguro de datos
  const invoiceStats = useMemo(() => {
    const defaultStats = {
      totalPaid: 0,
      totalPending: 0,
      totalCancelled: 0,
      totalAmount: 0,
      paidAmount: 0,
      pendingAmount: 0,
      averageInvoiceAmount: 0,
      largestInvoice: 0,
      invoiceCount: 0,
      paymentMethods: {
        bankTransfer: 0,
        walletPayment: 0
      },
      latestPaidDate: null,
      monthlyTrend: 0
    };

    if (!invoices || !Array.isArray(invoices) || invoices.length === 0) {
      console.log("No hay facturas o el formato es incorrecto:", invoices);
      return defaultStats;
    }

    try {
      // Filtrar facturas según el rango de fechas seleccionado
      const filteredByDateInvoices = invoices.filter(inv => {
        if (!inv || !inv.issueDate) return true; // Si no hay fecha, incluirla
        
        const issueDate = new Date(inv.issueDate);
        
        // Aplicar filtros de fecha
        if (startDate) {
          const startDateTime = new Date(startDate);
          startDateTime.setHours(0, 0, 0, 0);
          if (issueDate < startDateTime) return false;
        }
        
        if (endDate) {
          const endDateTime = new Date(endDate);
          endDateTime.setHours(23, 59, 59, 999);
          if (issueDate > endDateTime) return false;
        }
        
        return true;
      });
      
      // Calcular totales con manejo seguro de valores nulos
      const paidInvoices = filteredByDateInvoices.filter(inv => inv?.status === "Paid");
      const pendingInvoices = filteredByDateInvoices.filter(inv => inv?.status === "Pending");
      const cancelledInvoices = filteredByDateInvoices.filter(inv => inv?.status === "Cancelled");
      
      // Usar valores seguros para cálculos numéricos
      const totalAmount = filteredByDateInvoices.reduce((sum, inv) => {
        const amount = inv?.amount ? Number(inv.amount) : 0;
        return isNaN(amount) ? sum : sum + amount;
      }, 0);
      
      const paidAmount = paidInvoices.reduce((sum, inv) => {
        const amount = inv?.amount ? Number(inv.amount) : 0;
        return isNaN(amount) ? sum : sum + amount;
      }, 0);
      
      const pendingAmount = pendingInvoices.reduce((sum, inv) => {
        const amount = inv?.amount ? Number(inv.amount) : 0;
        return isNaN(amount) ? sum : sum + amount;
      }, 0);
      
      // Calcular métodos de pago
      const bankTransferCount = filteredByDateInvoices.filter(inv => inv?.paymentMethod === "Bank Transfer").length;
      const walletPaymentCount = filteredByDateInvoices.filter(inv => inv?.paymentMethod === "Wallet Payment").length;
      
      // Calcular factura más grande con validación
      const validAmounts = filteredByDateInvoices
        .map(inv => inv?.amount ? Number(inv.amount) : 0)
        .filter(amount => !isNaN(amount));
        
      const largestInvoice = validAmounts.length > 0 ? Math.max(...validAmounts) : 0;
      
      // Calcular promedio con validación
      const averageInvoiceAmount = validAmounts.length > 0 ? totalAmount / validAmounts.length : 0;
      
      // Fecha del último pago con validación
      const paidDates = paidInvoices
        .filter(inv => inv?.paidDate)
        .map(inv => {
          try {
            return new Date(inv.paidDate!).getTime();
          } catch (e) {
            return 0;
          }
        })
        .filter(timestamp => timestamp > 0);
      
      const latestPaidDate = paidDates.length > 0 
        ? new Date(Math.max(...paidDates))
        : null;
      
      // Calcular tendencia mensual con manejo de errores
      let monthlyTrend = 0;
      
      try {
        if (paidInvoices.length > 0) {
          // Simplificación: comparar con facturas del mes en curso vs mes anterior
          const now = new Date();
          const currentMonth = now.getMonth();
          const currentYear = now.getFullYear();
          
          const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
          const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
          
          const currentMonthInvoices = paidInvoices.filter(inv => {
            try {
              const dateStr = inv?.paidDate ? String(inv.paidDate) : inv?.issueDate ? String(inv.issueDate) : "";
              if (!dateStr) return false;
              
              const date = new Date(dateStr);
              return !isNaN(date.getTime()) && date.getMonth() === currentMonth && date.getFullYear() === currentYear;
            } catch (e) {
              return false;
            }
          });
          
          const lastMonthInvoices = paidInvoices.filter(inv => {
            try {
              const dateStr = inv?.paidDate ? String(inv.paidDate) : inv?.issueDate ? String(inv.issueDate) : "";
              if (!dateStr) return false;
              
              const date = new Date(dateStr);
              return !isNaN(date.getTime()) && date.getMonth() === lastMonth && date.getFullYear() === lastMonthYear;
            } catch (e) {
              return false;
            }
          });
          
          const currentMonthTotal = currentMonthInvoices.reduce((sum, inv) => {
            const amount = inv?.amount ? Number(inv.amount) : 0;
            return isNaN(amount) ? sum : sum + amount;
          }, 0);
          
          const lastMonthTotal = lastMonthInvoices.reduce((sum, inv) => {
            const amount = inv?.amount ? Number(inv.amount) : 0;
            return isNaN(amount) ? sum : sum + amount;
          }, 0);
          
          if (lastMonthTotal > 0) {
            monthlyTrend = ((currentMonthTotal - lastMonthTotal) / lastMonthTotal) * 100;
          } else if (currentMonthTotal > 0) {
            monthlyTrend = 100; // Si el mes pasado no hubo facturas y este mes sí
          }
        }
      } catch (e) {
        console.error("Error calculando tendencia mensual:", e);
        monthlyTrend = 0;
      }
      
      return {
        totalPaid: paidInvoices.length,
        totalPending: pendingInvoices.length,
        totalCancelled: cancelledInvoices.length,
        totalAmount,
        paidAmount,
        pendingAmount,
        averageInvoiceAmount,
        largestInvoice,
        invoiceCount: filteredByDateInvoices.length,
        paymentMethods: {
          bankTransfer: bankTransferCount,
          walletPayment: walletPaymentCount
        },
        latestPaidDate,
        monthlyTrend
      };
    } catch (e) {
      console.error("Error calculando estadísticas de facturas:", e);
      return defaultStats;
    }
  }, [invoices, startDate, endDate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="ml-2">{t("Cargando facturas...")}</p>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border border-destructive">
        <CardHeader>
          <CardTitle>{t("Error")}</CardTitle>
          <CardDescription>
            {t("No se pudieron cargar las facturas")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>{error.message}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{t("Gestión de Facturas")}</span>
            <Button
              size="sm"
              variant="outline"
              onClick={() => queryClient.invalidateQueries({ queryKey: ["/api/invoices"] })}
            >
              <RefreshCw className="w-4 h-4 mr-1" />
              {t("Actualizar")}
            </Button>
          </CardTitle>
          <CardDescription>{t("Administra todas las facturas del sistema")}</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Tarjetas de estadísticas de facturación */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Tarjeta 1: Total Facturado */}
            <Card className="border-none shadow-md bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-1">{t("Total Facturado")}</p>
                    <h3 className="text-2xl font-bold">${invoiceStats.totalAmount.toFixed(2)}</h3>
                    <div className="flex items-center mt-2">
                      <Badge 
                        variant={invoiceStats.monthlyTrend >= 0 ? "success" : "destructive"}
                        className="text-xs font-normal"
                      >
                        {invoiceStats.monthlyTrend >= 0 ? "+" : ""}{invoiceStats.monthlyTrend.toFixed(1)}%
                      </Badge>
                      <span className="text-xs text-muted-foreground ml-2">
                        {t("vs mes anterior")}
                      </span>
                    </div>
                  </div>
                  <div className="p-3 rounded-full bg-blue-500/10 dark:bg-blue-500/20">
                    <DollarSign className="h-5 w-5 text-blue-700 dark:text-blue-300" />
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{t("Nº Facturas")}:</span>
                    <span>{invoiceStats.invoiceCount}</span>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>{t("Media")}:</span>
                    <span>${invoiceStats.averageInvoiceAmount.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Tarjeta 2: Facturas Pendientes */}
            <Card className="border-none shadow-md bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950 dark:to-amber-900">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-amber-600 dark:text-amber-400 mb-1">{t("Pendiente de Cobro")}</p>
                    <h3 className="text-2xl font-bold">${invoiceStats.pendingAmount.toFixed(2)}</h3>
                    <div className="flex items-center mt-2">
                      <Badge 
                        variant="warning"
                        className="text-xs font-normal"
                      >
                        {invoiceStats.totalPending} {t("facturas")}
                      </Badge>
                    </div>
                  </div>
                  <div className="p-3 rounded-full bg-amber-500/10 dark:bg-amber-500/20">
                    <Clock className="h-5 w-5 text-amber-700 dark:text-amber-300" />
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{t("Ratio facturación")}:</span>
                    <span>
                      {invoiceStats.totalAmount > 0 
                        ? ((invoiceStats.pendingAmount / invoiceStats.totalAmount) * 100).toFixed(1) 
                        : "0"}%
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>{t("Método más común")}:</span>
                    <span>
                      {invoiceStats.paymentMethods.bankTransfer >= invoiceStats.paymentMethods.walletPayment
                        ? t("Transferencia")
                        : t("Wallet")}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Tarjeta 3: Facturas Pagadas */}
            <Card className="border-none shadow-md bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950 dark:to-emerald-900">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400 mb-1">{t("Cobrado")}</p>
                    <h3 className="text-2xl font-bold">${invoiceStats.paidAmount.toFixed(2)}</h3>
                    <div className="flex items-center mt-2">
                      <Badge 
                        variant="success"
                        className="text-xs font-normal"
                      >
                        {invoiceStats.totalPaid} {t("facturas")}
                      </Badge>
                    </div>
                  </div>
                  <div className="p-3 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20">
                    <CheckCircle className="h-5 w-5 text-emerald-700 dark:text-emerald-300" />
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{t("Último pago")}:</span>
                    <span>
                      {invoiceStats.latestPaidDate 
                        ? formatDate(invoiceStats.latestPaidDate, "short")
                        : t("N/A")}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>{t("Mayor factura")}:</span>
                    <span>${invoiceStats.largestInvoice.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Tarjeta 4: Facturas Canceladas */}
            <Card className="border-none shadow-md bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950 dark:to-red-900">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-red-600 dark:text-red-400 mb-1">{t("Facturas Canceladas")}</p>
                    <h3 className="text-2xl font-bold">{invoiceStats.totalCancelled}</h3>
                    <div className="flex items-center mt-2">
                      <Badge 
                        variant="destructive"
                        className="text-xs font-normal"
                      >
                        {invoiceStats.invoiceCount > 0 
                          ? ((invoiceStats.totalCancelled / invoiceStats.invoiceCount) * 100).toFixed(1) 
                          : "0"}%
                      </Badge>
                      <span className="text-xs text-muted-foreground ml-2">
                        {t("del total")}
                      </span>
                    </div>
                  </div>
                  <div className="p-3 rounded-full bg-red-500/10 dark:bg-red-500/20">
                    <AlertCircle className="h-5 w-5 text-red-700 dark:text-red-300" />
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{t("Estado facturas")}:</span>
                    <span className="flex items-center">
                      <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 mr-1"></span> {invoiceStats.totalPaid} {t("pagadas")}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span></span>
                    <span className="flex items-center">
                      <span className="inline-block w-2 h-2 rounded-full bg-amber-500 mr-1"></span> {invoiceStats.totalPending} {t("pendientes")}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Filtros y búsqueda */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder={t("Buscar por wallet...")}
                value={searchWallet}
                onChange={(e) => setSearchWallet(e.target.value)}
                className="pl-8"
              />
            </div>
            <div className="w-full sm:w-48">
              <Select
                value={filterStatus}
                onValueChange={setFilterStatus}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("Estado: Todos")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("Todos los estados")}</SelectItem>
                  <SelectItem value="Pending">{t("Pendiente")}</SelectItem>
                  <SelectItem value="Paid">{t("Pagado")}</SelectItem>
                  <SelectItem value="Cancelled">{t("Cancelado")}</SelectItem>
                </SelectContent>
              </Select>
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
          <div className="rounded-md border overflow-x-auto">
            <Table className="w-full min-w-[800px]">
              <TableHeader>
                <TableRow>
                  <TableHead 
                    className="w-[180px] cursor-pointer"
                    onClick={() => handleSort("invoiceNumber")}
                  >
                    <div className="flex items-center">
                      {t("ID")}
                      {getSortIndicator("invoiceNumber")}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="w-[140px] cursor-pointer"
                    onClick={() => handleSort("walletAddress")}
                  >
                    <div className="flex items-center">
                      {t("Wallet")}
                      {getSortIndicator("walletAddress")}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="w-[100px] cursor-pointer"
                    onClick={() => handleSort("issueDate")}
                  >
                    <div className="flex items-center">
                      {t("Fecha")}
                      {getSortIndicator("issueDate")}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="w-[120px] cursor-pointer"
                    onClick={() => handleSort("amount")}
                  >
                    <div className="flex items-center">
                      {t("Importe")}
                      {getSortIndicator("amount")}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="w-[120px] cursor-pointer"
                    onClick={() => handleSort("status")}
                  >
                    <div className="flex items-center">
                      {t("Estado")}
                      {getSortIndicator("status")}
                    </div>
                  </TableHead>
                  <TableHead className="text-right w-[160px]">{t("Acciones")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.isArray(filteredInvoices) && filteredInvoices.length > 0 ? (
                  filteredInvoices.map((invoice) => {
                    // Verificación adicional para asegurar que tenemos un objeto válido
                    if (!invoice || typeof invoice !== 'object') return null;
                    
                    try {
                      const id = invoice.id || 0;
                      const invoiceNumber = invoice.invoiceNumber || t("Sin número");
                      const walletAddress = invoice.walletAddress || t("Sin dirección");
                      const issueDate = invoice.issueDate || new Date();
                      const amount = invoice.amount ? Number(invoice.amount) : 0;
                      const status = invoice.status || "Pending";
                      
                      return (
                        <TableRow key={id}>
                          <TableCell className="font-medium whitespace-normal">
                            {invoiceNumber}
                          </TableCell>
                          <TableCell className="font-mono text-xs overflow-hidden text-ellipsis">
                            {walletAddress.substring(0, 8)}...
                          </TableCell>
                          <TableCell className="whitespace-nowrap">
                            {formatDate(issueDate, "short")}
                          </TableCell>
                          <TableCell className="whitespace-nowrap">${amount.toFixed(2)}</TableCell>
                          <TableCell>
                            <Badge variant={getStatusBadgeVariant(status)}>
                              {t(status)}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => viewInvoiceDetails(id)}
                                title={t("Ver detalle")}
                              >
                                <FileText className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => editInvoice(id)}
                                title={t("Editar")}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDownloadPdf(id)}
                                title={t("Descargar PDF")}
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteInvoice(id)}
                                title={t("Eliminar")}
                                className="text-destructive"
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    } catch (err) {
                      console.error("Error al renderizar factura:", err, invoice);
                      return null;
                    }
                  }).filter(Boolean) // Filtrar elementos nulos
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      {t("No se encontraron facturas con los filtros aplicados")}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      {/* Modal de edición */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("Editar factura")}</DialogTitle>
            <DialogDescription>
              {t("Modifica los datos de la factura")}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmitEdit)} className="space-y-4">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("Estado")}</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t("Seleccionar estado")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Pending">{t("Pendiente")}</SelectItem>
                        <SelectItem value="Paid">{t("Pagada")}</SelectItem>
                        <SelectItem value="Cancelled">{t("Cancelada")}</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="paidDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("Fecha de pago")}</FormLabel>
                    <Input
                      type="date"
                      {...field}
                      value={field.value || ""}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Mostrar método de pago sin poder cambiarlo */}
              <FormItem className="mb-4">
                <FormLabel>{t("Método de pago")}</FormLabel>
                <Input 
                  value={invoices?.find(inv => inv.id === selectedInvoiceId)?.paymentMethod || ""}
                  disabled
                />
                <FormDescription>
                  {t("El método de pago no se puede cambiar")}
                </FormDescription>
              </FormItem>
              
              <FormField
                control={form.control}
                name="bankReference"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("Referencia bancaria")}</FormLabel>
                    <Input {...field} value={field.value || ""} />
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="transactionHash"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("Hash de transacción")}</FormLabel>
                    <Input {...field} value={field.value || ""} />
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("Notas")}</FormLabel>
                    <Textarea {...field} value={field.value || ""} />
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="submit">{t("Guardar cambios")}</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Detalle de factura */}
      {selectedInvoiceId && (
        <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>{t("Detalle de factura")}</DialogTitle>
            </DialogHeader>
            <InvoiceDetailView 
              invoiceId={selectedInvoiceId} 
              onClose={() => setIsDetailOpen(false)}
              onEdit={() => {
                setIsDetailOpen(false);
                editInvoice(selectedInvoiceId);
              }}
              onDownload={async () => await handleDownloadPdf(selectedInvoiceId)}
            />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}