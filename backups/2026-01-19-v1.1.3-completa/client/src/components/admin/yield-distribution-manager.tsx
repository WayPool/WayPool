/**
 * Yield Distribution Manager
 *
 * SuperAdmin component for managing trading profit distributions
 * to all active positions proportionally.
 */

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { useWallet } from '@/hooks/use-wallet';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Loader2,
  DollarSign,
  TrendingUp,
  Users,
  History,
  PieChart,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Sparkles,
  Building,
  Calendar,
  ExternalLink,
  RefreshCw,
  Eye,
  Send,
} from 'lucide-react';

interface ActivePosition {
  id: number;
  walletAddress: string;
  depositedUSDC: string;
  apr: string;
  status: string;
  poolName: string;
  token0: string;
  token1: string;
}

interface DistributionCalculation {
  positionId: number;
  walletAddress: string;
  capital: number;
  apr: number;
  weight: number;
  baseDistribution: number;
  aprBonus: number;
  totalDistribution: number;
  distributionPercent: number;
}

interface DistributionPreview {
  totalAmount: number;
  totalPositions: number;
  totalActiveCapital: number;
  averageDistributionPercent: number;
  distributions: DistributionCalculation[];
}

interface Distribution {
  id: number;
  distributionCode: string;
  totalAmount: string;
  distributedAmount: string;
  source: string;
  sourceDetails: string;
  brokerName: string;
  totalActivePositions: number;
  totalActiveCapital: string;
  status: string;
  notes: string;
  createdBy: string;
  processedAt: string;
  createdAt: string;
}

interface YieldStats {
  totalDistributed: number;
  totalDistributions: number;
  averageDistribution: number;
  lastDistributionDate: string | null;
  topPositionsByYield: any[];
}

export default function YieldDistributionManager() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { address: walletAddress } = useWallet();

  // Form state
  const [totalAmount, setTotalAmount] = useState<string>('');
  const [includeAprBonus, setIncludeAprBonus] = useState(false);
  const [source, setSource] = useState('external_trading');
  const [brokerName, setBrokerName] = useState('');
  const [notes, setNotes] = useState('');

  // UI state
  const [showPreview, setShowPreview] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [previewData, setPreviewData] = useState<DistributionPreview | null>(null);
  const [selectedDistribution, setSelectedDistribution] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Helper to get auth headers
  const getAuthHeaders = () => ({
    'x-wallet-address': walletAddress || localStorage.getItem('walletAddress') || '',
  });

  // Fetch active positions
  const { data: positionsData, isLoading: loadingPositions, refetch: refetchPositions } = useQuery({
    queryKey: ['yield-distribution-positions', walletAddress],
    queryFn: async () => {
      return await apiRequest('GET', '/api/superadmin/yield-distribution/positions', null, {
        headers: getAuthHeaders()
      });
    },
    enabled: !!walletAddress,
  });

  // Fetch distribution history
  const { data: historyData, isLoading: loadingHistory, refetch: refetchHistory } = useQuery({
    queryKey: ['yield-distribution-history', currentPage, walletAddress],
    queryFn: async () => {
      return await apiRequest('GET', `/api/superadmin/yield-distribution/history?page=${currentPage}&limit=10`, null, {
        headers: getAuthHeaders()
      });
    },
    enabled: !!walletAddress,
  });

  // Fetch yield statistics
  const { data: statsData, isLoading: loadingStats } = useQuery({
    queryKey: ['yield-distribution-stats', walletAddress],
    queryFn: async () => {
      return await apiRequest('GET', '/api/superadmin/yield-distribution/stats', null, {
        headers: getAuthHeaders()
      });
    },
    enabled: !!walletAddress,
  });

  // Fetch distribution details
  const { data: detailsData, isLoading: loadingDetails } = useQuery({
    queryKey: ['yield-distribution-details', selectedDistribution, walletAddress],
    queryFn: async () => {
      return await apiRequest('GET', `/api/superadmin/yield-distribution/${selectedDistribution}`, null, {
        headers: getAuthHeaders()
      });
    },
    enabled: !!selectedDistribution && !!walletAddress,
  });

  // Preview mutation
  const previewMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest('POST', '/api/superadmin/yield-distribution/preview', {
        totalAmount: parseFloat(totalAmount),
        includeAprBonus,
      }, {
        headers: getAuthHeaders()
      });
    },
    onSuccess: (data) => {
      if (data.success) {
        setPreviewData(data.preview);
        setShowPreview(true);
      } else {
        toast({
          title: 'Error',
          description: data.error || 'Error al calcular la vista previa',
          variant: 'destructive',
        });
      }
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Error al calcular la vista previa',
        variant: 'destructive',
      });
    },
  });

  // Execute mutation
  const executeMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest('POST', '/api/superadmin/yield-distribution/execute', {
        totalAmount: parseFloat(totalAmount),
        includeAprBonus,
        source,
        brokerName,
        notes,
      }, {
        headers: getAuthHeaders()
      });
    },
    onSuccess: (data) => {
      if (data.success) {
        toast({
          title: 'Distribución completada',
          description: `Código: ${data.distributionCode} - ${data.positionsUpdated} posiciones actualizadas`,
        });
        setShowConfirmation(false);
        setShowPreview(false);
        setTotalAmount('');
        setNotes('');
        setBrokerName('');
        queryClient.invalidateQueries({ queryKey: ['yield-distribution-history'] });
        queryClient.invalidateQueries({ queryKey: ['yield-distribution-stats'] });
        refetchPositions();
      } else {
        toast({
          title: 'Error',
          description: data.error || 'Error al ejecutar la distribución',
          variant: 'destructive',
        });
      }
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Error al ejecutar la distribución',
        variant: 'destructive',
      });
    },
  });

  const formatCurrency = (value: number | string) => {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  };

  const formatPercent = (value: number) => {
    return `${value.toFixed(4)}%`;
  };

  const formatAddress = (address: string) => {
    if (!address) return '-';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      completed: 'default',
      completed_with_errors: 'secondary',
      processing: 'outline',
      pending: 'outline',
      failed: 'destructive',
    };
    const labels: Record<string, string> = {
      completed: 'Completado',
      completed_with_errors: 'Completado con errores',
      processing: 'Procesando',
      pending: 'Pendiente',
      failed: 'Fallido',
    };
    return (
      <Badge variant={variants[status] || 'outline'}>
        {labels[status] || status}
      </Badge>
    );
  };

  const handlePreview = () => {
    if (!totalAmount || parseFloat(totalAmount) <= 0) {
      toast({
        title: 'Error',
        description: 'Ingresa un monto válido mayor a 0',
        variant: 'destructive',
      });
      return;
    }
    previewMutation.mutate();
  };

  const handleExecute = () => {
    setShowConfirmation(true);
  };

  const confirmExecute = () => {
    executeMutation.mutate();
  };

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border-emerald-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
              Total Distribuido
            </CardTitle>
            <DollarSign className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-200">
              {loadingStats ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                formatCurrency(statsData?.totalDistributed || 0)
              )}
            </div>
            <p className="text-xs text-emerald-600/70 dark:text-emerald-400/70">
              En {statsData?.totalDistributions || 0} distribuciones
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">
              Posiciones Activas
            </CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700 dark:text-blue-200">
              {loadingPositions ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                positionsData?.totalPositions || 0
              )}
            </div>
            <p className="text-xs text-blue-600/70 dark:text-blue-400/70">
              Capital: {formatCurrency(positionsData?.totalCapital || 0)}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-300">
              Promedio por Distribución
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-700 dark:text-purple-200">
              {loadingStats ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                formatCurrency(statsData?.averageDistribution || 0)
              )}
            </div>
            <p className="text-xs text-purple-600/70 dark:text-purple-400/70">
              Por operación de trading
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-500/10 to-amber-600/5 border-amber-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-amber-700 dark:text-amber-300">
              Última Distribución
            </CardTitle>
            <Calendar className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold text-amber-700 dark:text-amber-200">
              {loadingStats ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : statsData?.lastDistributionDate ? (
                formatDate(statsData.lastDistributionDate)
              ) : (
                'Ninguna'
              )}
            </div>
            <p className="text-xs text-amber-600/70 dark:text-amber-400/70">
              Fecha de procesamiento
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="distribute" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="distribute" className="flex items-center gap-2">
            <Send className="h-4 w-4" />
            Nueva Distribución
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            Historial
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <PieChart className="h-4 w-4" />
            Análisis
          </TabsTrigger>
        </TabsList>

        {/* New Distribution Tab */}
        <TabsContent value="distribute" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-amber-500" />
                Distribuir Rendimientos de Trading
              </CardTitle>
              <CardDescription>
                Ingresa el total de USDC generado en plataformas de trading externas para distribuirlo
                proporcionalmente entre todas las posiciones activas.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Amount Input */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="totalAmount">Monto Total a Distribuir (USDC)</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="totalAmount"
                      type="number"
                      placeholder="10000.00"
                      value={totalAmount}
                      onChange={(e) => setTotalAmount(e.target.value)}
                      className="pl-10 text-lg font-medium"
                      step="0.01"
                      min="0"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Este monto se distribuirá proporcionalmente según el capital de cada posición
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="brokerName">Broker / Plataforma de Trading</Label>
                  <div className="relative">
                    <Building className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="brokerName"
                      placeholder="Ej: Binance, eToro, Interactive Brokers..."
                      value={brokerName}
                      onChange={(e) => setBrokerName(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              {/* APR Bonus Toggle */}
              <div className="flex items-center justify-between rounded-lg border p-4 bg-slate-50 dark:bg-slate-900/50">
                <div className="space-y-0.5">
                  <Label className="text-base">Bonus por APR</Label>
                  <p className="text-sm text-muted-foreground">
                    Aplicar un bonus adicional a posiciones con APR más alto (hasta 10% extra)
                  </p>
                </div>
                <Switch
                  checked={includeAprBonus}
                  onCheckedChange={setIncludeAprBonus}
                />
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <Label htmlFor="notes">Notas (opcional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Notas adicionales sobre esta distribución..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                />
              </div>

              {/* Summary Box */}
              {positionsData && (
                <div className="rounded-lg border bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4">
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Resumen de Posiciones Activas
                  </h4>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div>
                      <p className="text-sm text-muted-foreground">Posiciones elegibles</p>
                      <p className="text-xl font-bold">{positionsData.totalPositions}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Capital total activo</p>
                      <p className="text-xl font-bold">{formatCurrency(positionsData.totalCapital)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Distribución estimada por posición</p>
                      <p className="text-xl font-bold">
                        {totalAmount && positionsData.totalPositions > 0
                          ? formatCurrency(parseFloat(totalAmount) / positionsData.totalPositions)
                          : '-'
                        }
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-4">
              <Button
                variant="outline"
                onClick={() => refetchPositions()}
                disabled={loadingPositions}
              >
                <RefreshCw className={`mr-2 h-4 w-4 ${loadingPositions ? 'animate-spin' : ''}`} />
                Actualizar datos
              </Button>
              <Button
                onClick={handlePreview}
                disabled={!totalAmount || parseFloat(totalAmount) <= 0 || previewMutation.isPending}
                className="bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600"
              >
                {previewMutation.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Eye className="mr-2 h-4 w-4" />
                )}
                Vista Previa
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                Historial de Distribuciones
              </CardTitle>
              <CardDescription>
                Registro completo de todas las distribuciones de rendimientos realizadas
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loadingHistory ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : historyData?.distributions?.length > 0 ? (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Código</TableHead>
                        <TableHead>Fecha</TableHead>
                        <TableHead className="text-right">Monto</TableHead>
                        <TableHead className="text-center">Posiciones</TableHead>
                        <TableHead>Broker</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {historyData.distributions.map((dist: Distribution) => (
                        <TableRow key={dist.id}>
                          <TableCell className="font-mono text-sm">
                            {dist.distributionCode}
                          </TableCell>
                          <TableCell>{formatDate(dist.processedAt || dist.createdAt)}</TableCell>
                          <TableCell className="text-right font-medium">
                            {formatCurrency(dist.distributedAmount)}
                          </TableCell>
                          <TableCell className="text-center">
                            {dist.totalActivePositions}
                          </TableCell>
                          <TableCell>{dist.brokerName || '-'}</TableCell>
                          <TableCell>{getStatusBadge(dist.status)}</TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedDistribution(dist.id)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <History className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No hay distribuciones registradas</p>
                </div>
              )}

              {/* Pagination */}
              {historyData?.totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    Anterior
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Página {currentPage} de {historyData.totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.min(historyData.totalPages, p + 1))}
                    disabled={currentPage === historyData.totalPages}
                  >
                    Siguiente
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                Top Posiciones por Rendimiento
              </CardTitle>
              <CardDescription>
                Posiciones que han recibido más rendimientos acumulados
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loadingStats ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : statsData?.topPositionsByYield?.length > 0 ? (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>#</TableHead>
                        <TableHead>Wallet</TableHead>
                        <TableHead>Pool</TableHead>
                        <TableHead className="text-right">Capital</TableHead>
                        <TableHead className="text-right">Total Recibido</TableHead>
                        <TableHead className="text-center">Distribuciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {statsData.topPositionsByYield.map((pos: any, idx: number) => (
                        <TableRow key={pos.positionId}>
                          <TableCell className="font-medium">{idx + 1}</TableCell>
                          <TableCell className="font-mono text-sm">
                            {formatAddress(pos.walletAddress)}
                          </TableCell>
                          <TableCell>{pos.poolName || '-'}</TableCell>
                          <TableCell className="text-right">
                            {formatCurrency(pos.depositedUsdc || 0)}
                          </TableCell>
                          <TableCell className="text-right font-medium text-emerald-600">
                            {formatCurrency(pos.totalYieldReceived || 0)}
                          </TableCell>
                          <TableCell className="text-center">
                            {pos.totalDistributions || 0}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <PieChart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No hay datos de análisis disponibles</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Vista Previa de Distribución
            </DialogTitle>
            <DialogDescription>
              Revisa cómo se distribuirán los {formatCurrency(parseFloat(totalAmount) || 0)} entre las posiciones activas
            </DialogDescription>
          </DialogHeader>

          {previewData && (
            <div className="flex-1 overflow-hidden">
              {/* Summary Stats */}
              <div className="grid gap-3 md:grid-cols-4 mb-4">
                <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-3 text-center">
                  <p className="text-xs text-muted-foreground">Total a Distribuir</p>
                  <p className="text-lg font-bold text-emerald-600">
                    {formatCurrency(previewData.totalAmount)}
                  </p>
                </div>
                <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-3 text-center">
                  <p className="text-xs text-muted-foreground">Posiciones</p>
                  <p className="text-lg font-bold">{previewData.totalPositions}</p>
                </div>
                <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-3 text-center">
                  <p className="text-xs text-muted-foreground">Capital Activo</p>
                  <p className="text-lg font-bold">{formatCurrency(previewData.totalActiveCapital)}</p>
                </div>
                <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-3 text-center">
                  <p className="text-xs text-muted-foreground">% Promedio</p>
                  <p className="text-lg font-bold">{formatPercent(previewData.averageDistributionPercent)}</p>
                </div>
              </div>

              {/* Distribution Table */}
              <ScrollArea className="h-[400px] rounded-md border">
                <Table>
                  <TableHeader className="sticky top-0 bg-white dark:bg-slate-950">
                    <TableRow>
                      <TableHead>Wallet</TableHead>
                      <TableHead className="text-right">Capital</TableHead>
                      <TableHead className="text-right">APR</TableHead>
                      <TableHead className="text-right">Base</TableHead>
                      {includeAprBonus && <TableHead className="text-right">Bonus APR</TableHead>}
                      <TableHead className="text-right">Total</TableHead>
                      <TableHead className="text-right">%</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {previewData.distributions.map((dist) => (
                      <TableRow key={dist.positionId}>
                        <TableCell className="font-mono text-sm">
                          {formatAddress(dist.walletAddress)}
                        </TableCell>
                        <TableCell className="text-right">{formatCurrency(dist.capital)}</TableCell>
                        <TableCell className="text-right">{dist.apr}%</TableCell>
                        <TableCell className="text-right">{formatCurrency(dist.baseDistribution)}</TableCell>
                        {includeAprBonus && (
                          <TableCell className="text-right text-emerald-600">
                            +{formatCurrency(dist.aprBonus)}
                          </TableCell>
                        )}
                        <TableCell className="text-right font-medium text-emerald-600">
                          {formatCurrency(dist.totalDistribution)}
                        </TableCell>
                        <TableCell className="text-right text-muted-foreground">
                          {formatPercent(dist.distributionPercent)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </div>
          )}

          <DialogFooter className="border-t pt-4">
            <Button variant="outline" onClick={() => setShowPreview(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleExecute}
              className="bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600"
            >
              <Send className="mr-2 h-4 w-4" />
              Ejecutar Distribución
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-amber-600">
              <AlertCircle className="h-5 w-5" />
              Confirmar Distribución
            </DialogTitle>
            <DialogDescription>
              Esta acción distribuirá {formatCurrency(parseFloat(totalAmount) || 0)} a {previewData?.totalPositions || 0} posiciones.
              Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
              <h4 className="font-medium text-amber-800 dark:text-amber-200 mb-2">
                Resumen de la distribución:
              </h4>
              <ul className="text-sm text-amber-700 dark:text-amber-300 space-y-1">
                <li>• Monto total: {formatCurrency(parseFloat(totalAmount) || 0)}</li>
                <li>• Posiciones a actualizar: {previewData?.totalPositions || 0}</li>
                <li>• Broker: {brokerName || 'No especificado'}</li>
                <li>• Bonus APR: {includeAprBonus ? 'Sí' : 'No'}</li>
              </ul>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmation(false)}>
              Cancelar
            </Button>
            <Button
              onClick={confirmExecute}
              disabled={executeMutation.isPending}
              className="bg-gradient-to-r from-emerald-600 to-emerald-500"
            >
              {executeMutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <CheckCircle2 className="mr-2 h-4 w-4" />
              )}
              Confirmar y Distribuir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Distribution Details Dialog */}
      <Dialog open={!!selectedDistribution} onOpenChange={() => setSelectedDistribution(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              Detalles de Distribución
              {detailsData?.distribution && (
                <Badge variant="outline" className="ml-2">
                  {detailsData.distribution.distributionCode}
                </Badge>
              )}
            </DialogTitle>
          </DialogHeader>

          {loadingDetails ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : detailsData?.distribution && (
            <div className="flex-1 overflow-hidden">
              {/* Distribution Info */}
              <div className="grid gap-3 md:grid-cols-4 mb-4">
                <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground">Monto Distribuido</p>
                  <p className="text-lg font-bold text-emerald-600">
                    {formatCurrency(detailsData.distribution.distributedAmount)}
                  </p>
                </div>
                <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground">Posiciones</p>
                  <p className="text-lg font-bold">{detailsData.distribution.totalActivePositions}</p>
                </div>
                <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground">Broker</p>
                  <p className="text-lg font-bold">{detailsData.distribution.brokerName || '-'}</p>
                </div>
                <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground">Estado</p>
                  <div className="mt-1">{getStatusBadge(detailsData.distribution.status)}</div>
                </div>
              </div>

              {/* Details Table */}
              <ScrollArea className="h-[400px] rounded-md border">
                <Table>
                  <TableHeader className="sticky top-0 bg-white dark:bg-slate-950">
                    <TableRow>
                      <TableHead>Wallet</TableHead>
                      <TableHead>Pool</TableHead>
                      <TableHead className="text-right">Capital</TableHead>
                      <TableHead className="text-right">APR</TableHead>
                      <TableHead className="text-right">Recibido</TableHead>
                      <TableHead>Estado</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {detailsData.details?.map((detail: any) => (
                      <TableRow key={detail.id}>
                        <TableCell className="font-mono text-sm">
                          {formatAddress(detail.walletAddress)}
                        </TableCell>
                        <TableCell>{detail.poolName || '-'}</TableCell>
                        <TableCell className="text-right">{formatCurrency(detail.positionCapital)}</TableCell>
                        <TableCell className="text-right">{detail.positionApr}%</TableCell>
                        <TableCell className="text-right font-medium text-emerald-600">
                          {formatCurrency(detail.totalDistribution)}
                        </TableCell>
                        <TableCell>
                          <Badge variant={detail.status === 'credited' ? 'default' : 'destructive'}>
                            {detail.status === 'credited' ? 'Acreditado' : 'Error'}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>

              {/* Notes */}
              {detailsData.distribution.notes && (
                <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
                  <p className="text-sm text-muted-foreground">Notas:</p>
                  <p className="text-sm">{detailsData.distribution.notes}</p>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedDistribution(null)}>
              Cerrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
