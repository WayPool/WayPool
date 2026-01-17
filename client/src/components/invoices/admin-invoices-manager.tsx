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
  ArrowUpRight 
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

function AdminInvoicesManager() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<number | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [searchWallet, setSearchWallet] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("");

  const { data: invoices, isLoading, error } = useQuery({
    queryKey: ["/api/invoices"],
    queryFn: () => InvoiceService.getAllInvoices(),
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
      updateData.paidDate = values.paidDate ? new Date(values.paidDate) : null;
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

  const filteredInvoices = invoices?.filter((invoice) => {
    const matchesWallet = !searchWallet || 
      invoice.walletAddress.toLowerCase().includes(searchWallet.toLowerCase());
    const matchesStatus = !filterStatus || invoice.status === filterStatus;
    return matchesWallet && matchesStatus;
  });
  
  // Calcular estadísticas de facturación
  const invoiceStats = useMemo(() => {
    if (!invoices) return {
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

    // Calcular totales
    const paidInvoices = invoices.filter(inv => inv.status === "Paid");
    const pendingInvoices = invoices.filter(inv => inv.status === "Pending");
    const cancelledInvoices = invoices.filter(inv => inv.status === "Cancelled");
    
    const totalAmount = invoices.reduce((sum, inv) => sum + Number(inv.amount), 0);
    const paidAmount = paidInvoices.reduce((sum, inv) => sum + Number(inv.amount), 0);
    const pendingAmount = pendingInvoices.reduce((sum, inv) => sum + Number(inv.amount), 0);
    
    // Calcular métodos de pago
    const bankTransferCount = invoices.filter(inv => inv.paymentMethod === "Bank Transfer").length;
    const walletPaymentCount = invoices.filter(inv => inv.paymentMethod === "Wallet Payment").length;
    
    // Calcular factura más grande
    const largestInvoice = Math.max(...invoices.map(inv => Number(inv.amount)), 0);
    
    // Calcular promedio
    const averageInvoiceAmount = totalAmount / invoices.length;
    
    // Fecha del último pago
    const paidDates = paidInvoices
      .filter(inv => inv.paidDate)
      .map(inv => new Date(inv.paidDate!).getTime());
    
    const latestPaidDate = paidDates.length > 0 
      ? new Date(Math.max(...paidDates))
      : null;
    
    // Calcular tendencia mensual (crecimiento respecto al mes anterior)
    let monthlyTrend = 0;
    if (paidInvoices.length > 0) {
      // Simplificación: comparar con facturas del mes en curso vs mes anterior
      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();
      
      const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
      const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
      
      const currentMonthInvoices = paidInvoices.filter(inv => {
        const dateStr = inv.paidDate ? String(inv.paidDate) : String(inv.issueDate);
        const date = new Date(dateStr);
        return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
      });
      
      const lastMonthInvoices = paidInvoices.filter(inv => {
        const dateStr = inv.paidDate ? String(inv.paidDate) : String(inv.issueDate);
        const date = new Date(dateStr);
        return date.getMonth() === lastMonth && date.getFullYear() === lastMonthYear;
      });
      
      const currentMonthTotal = currentMonthInvoices.reduce((sum, inv) => sum + Number(inv.amount), 0);
      const lastMonthTotal = lastMonthInvoices.reduce((sum, inv) => sum + Number(inv.amount), 0);
      
      if (lastMonthTotal > 0) {
        monthlyTrend = ((currentMonthTotal - lastMonthTotal) / lastMonthTotal) * 100;
      } else if (currentMonthTotal > 0) {
        monthlyTrend = 100; // Si el mes pasado no hubo facturas y este mes sí
      }
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
      invoiceCount: invoices.length,
      paymentMethods: {
        bankTransfer: bankTransferCount,
        walletPayment: walletPaymentCount
      },
      latestPaidDate,
      monthlyTrend
    };
  }, [invoices]);

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
                    <span>{t("Tasa de cobro")}:</span>
                    <span>
                      {invoiceStats.totalAmount > 0 
                        ? ((invoiceStats.paidAmount / invoiceStats.totalAmount) * 100).toFixed(1) 
                        : "0"}%
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>{t("Último cobro")}:</span>
                    <span>
                      {invoiceStats.latestPaidDate 
                        ? formatDate(invoiceStats.latestPaidDate.toISOString())
                        : t("N/A")}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Tarjeta 4: Facturas Canceladas */}
            <Card className="border-none shadow-md bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950 dark:to-red-900">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-red-600 dark:text-red-400 mb-1">{t("Canceladas")}</p>
                    <h3 className="text-2xl font-bold">{invoiceStats.totalCancelled}</h3>
                    <div className="flex items-center mt-2">
                      <Badge 
                        variant={invoiceStats.totalCancelled > 0 ? "destructive" : "outline"}
                        className="text-xs font-normal"
                      >
                        {invoiceStats.totalCancelled > 0 
                          ? t("Requiere atención") 
                          : t("Todo en orden")}
                      </Badge>
                    </div>
                  </div>
                  <div className="p-3 rounded-full bg-red-500/10 dark:bg-red-500/20">
                    <AlertCircle className="h-5 w-5 text-red-700 dark:text-red-300" />
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{t("Ratio cancelación")}:</span>
                    <span>
                      {invoiceStats.invoiceCount > 0 
                        ? ((invoiceStats.totalCancelled / invoiceStats.invoiceCount) * 100).toFixed(1) 
                        : "0"}%
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>{t("Mayor factura")}:</span>
                    <span>${invoiceStats.largestInvoice.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Filtros */}
          <div className="flex flex-wrap gap-4 mb-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t("Buscar por dirección de wallet...")}
                  value={searchWallet}
                  onChange={(e) => setSearchWallet(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <div className="w-[200px]">
              <Select
                value={filterStatus}
                onValueChange={setFilterStatus}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("Filtrar por estado")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">{t("Todos")}</SelectItem>
                  <SelectItem value="Pending">{t("Pendiente")}</SelectItem>
                  <SelectItem value="Paid">{t("Pagada")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {!filteredInvoices || filteredInvoices.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64">
              <FileText className="w-16 h-16 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                {searchWallet || filterStatus
                  ? t("No hay facturas que coincidan con los filtros")
                  : t("No hay facturas registradas en el sistema")}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("ID")}</TableHead>
                    <TableHead>{t("Nº Factura")}</TableHead>
                    <TableHead>{t("Wallet")}</TableHead>
                    <TableHead>{t("Fecha")}</TableHead>
                    <TableHead className="text-right">{t("Importe")}</TableHead>
                    <TableHead>{t("Estado")}</TableHead>
                    <TableHead>{t("Método")}</TableHead>
                    <TableHead className="text-right">{t("Acciones")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInvoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell>{invoice.id}</TableCell>
                      <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
                      <TableCell className="max-w-[120px] truncate">
                        <span title={invoice.walletAddress}>
                          {invoice.walletAddress.substring(0, 6)}...{invoice.walletAddress.substring(invoice.walletAddress.length - 4)}
                        </span>
                      </TableCell>
                      <TableCell>{formatDate(invoice.issueDate)}</TableCell>
                      <TableCell className="text-right">${invoice.amount} USD</TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(invoice.status)}>
                          {t(invoice.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>{t(invoice.paymentMethod)}</TableCell>
                      <TableCell className="text-right space-x-1">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => viewInvoiceDetails(invoice.id)}
                          title={t("Ver detalles")}
                        >
                          <Search className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => editInvoice(invoice.id)}
                          title={t("Editar factura")}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleDownloadPdf(invoice.id)}
                          title={t("Descargar PDF")}
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleDeleteInvoice(invoice.id)}
                          title={t("Eliminar factura")}
                          className="text-destructive hover:text-destructive/80"
                        >
                          <Trash className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          <div className="flex justify-between mt-4 text-sm text-muted-foreground">
            <p>
              {t("Total")}: {filteredInvoices?.length} {t("facturas de")} {invoices?.length}
            </p>
            {searchWallet || filterStatus ? (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => {
                  setSearchWallet("");
                  setFilterStatus("");
                }}
              >
                {t("Limpiar filtros")}
              </Button>
            ) : null}
          </div>
        </CardContent>
      </Card>

      {/* Diálogo de detalles de factura */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{t("Detalles de la Factura")}</DialogTitle>
            <DialogDescription>
              {t("Información completa de la factura seleccionada")}
            </DialogDescription>
          </DialogHeader>
          {selectedInvoiceId && (
            <InvoiceDetailView
              invoiceId={selectedInvoiceId}
              onClose={() => setIsDetailOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Diálogo de edición de factura */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("Editar Factura")}</DialogTitle>
            <DialogDescription>
              {t("Modifica los datos de la factura seleccionada")}
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
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t("Selecciona un estado")} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Pending">{t("Pendiente")}</SelectItem>
                        <SelectItem value="Paid">{t("Pagada")}</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      {t("Si cambias a 'Pagada', la fecha de pago se establecerá automáticamente si no se proporciona.")}
                    </FormDescription>
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
                    <FormControl>
                      <Input
                        type="date"
                        {...field}
                        value={field.value || ""}
                        disabled={form.watch("status") !== "Paid"}
                      />
                    </FormControl>
                    <FormDescription>
                      {t("Fecha en que se recibió el pago (solo para facturas pagadas)")}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bankReference"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("Referencia bancaria")}</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder={t("Referencia de la transferencia")} />
                    </FormControl>
                    <FormDescription>
                      {t("Número de referencia para transferencias bancarias")}
                    </FormDescription>
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
                    <FormControl>
                      <Input {...field} placeholder={t("Hash de la transacción blockchain")} />
                    </FormControl>
                    <FormDescription>
                      {t("Hash de la transacción para pagos con criptomonedas")}
                    </FormDescription>
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
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder={t("Notas adicionales sobre la factura")}
                        rows={3}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Separador para datos del cliente */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    {t("Datos del cliente")}
                  </span>
                </div>
              </div>

              {/* Nombre del cliente */}
              <FormField
                control={form.control}
                name="clientName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("Nombre del cliente")}</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder={t("Nombre completo del cliente o empresa")} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Dirección del cliente */}
              <FormField
                control={form.control}
                name="clientAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("Dirección")}</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder={t("Dirección postal del cliente")} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Ciudad del cliente */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="clientCity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("Ciudad")}</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder={t("Ciudad del cliente")} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* País del cliente */}
                <FormField
                  control={form.control}
                  name="clientCountry"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("País")}</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder={t("País del cliente")} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* ID fiscal del cliente */}
              <FormField
                control={form.control}
                name="clientTaxId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("ID Fiscal")}</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder={t("Número de identificación fiscal (VAT, CIF, etc.)")} />
                    </FormControl>
                    <FormDescription>
                      {t("Identificador fiscal necesario para la facturación")}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsEditOpen(false)}
                >
                  {t("Cancelar")}
                </Button>
                <Button 
                  type="submit"
                  disabled={updateInvoiceMutation.isPending}
                >
                  {updateInvoiceMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t("Guardando...")}
                    </>
                  ) : (
                    t("Guardar cambios")
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
};

// Ya está exportado como export default function AdminInvoicesManager