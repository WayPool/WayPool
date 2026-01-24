import React, { useState } from 'react';
import { Link } from "wouter";
import { useWallet } from "@/hooks/use-wallet";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import AdminLayout from "@/components/layout/admin-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ChevronLeft,
  ExternalLink,
  Search,
  RefreshCw,
  Copy,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowUpRight,
  ArrowDownLeft,
  Coins,
  Activity,
  Hash,
  Calendar
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Types
interface WBCTransaction {
  id: number;
  txHash: string;
  fromAddress: string;
  toAddress: string;
  amount: number;
  positionId: number;
  transactionType: string;
  status: string;
  blockNumber: number | null;
  gasUsed: string | null;
  errorMessage: string | null;
  createdAt: string;
  confirmedAt: string | null;
}

interface WBCStats {
  config: {
    contractAddress: string;
    ownerWallet: string;
    network: string;
    chainId: string;
    decimals: string;
    initialSupply: string;
    deployTxHash: string;
    deployDate: string;
    isActive: boolean;
  };
  stats: {
    totalTransactions: number;
    confirmedCount: number;
    failedCount: number;
    pendingCount: number;
    totalSent: number;
    totalReturned: number;
    netDistributed: number;
    uniqueUsers: number;
    uniquePositions: number;
  };
}

interface TransactionResponse {
  transactions: WBCTransaction[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

const WBC_CONTRACT = '0xf79e7330eF4DA9C567B8811845Ce9b0B75064456';
const OWNER_WALLET = '0x6b22cEB508db3C81d69ED6451d63B56a1fb7271F';

export default function WBCTransactionsPage() {
  const { toast } = useToast();
  const { account } = useWallet();

  // Filters
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch WBC stats
  const { data: statsData, refetch: refetchStats } = useQuery<WBCStats>({
    queryKey: ['/api/admin/wbc/stats'],
    queryFn: async () => {
      const headers: Record<string, string> = { 'x-is-admin': 'true' };
      if (account) headers['x-wallet-address'] = account;
      return apiRequest<WBCStats>('GET', '/api/admin/wbc/stats', undefined, { headers });
    },
    refetchInterval: 30000
  });

  // Fetch transactions
  const { data: txData, isLoading: txLoading, refetch: refetchTx } = useQuery<TransactionResponse>({
    queryKey: ['/api/admin/wbc/transactions', page, limit, typeFilter, statusFilter, searchQuery],
    queryFn: async () => {
      const headers: Record<string, string> = { 'x-is-admin': 'true' };
      if (account) headers['x-wallet-address'] = account;

      let url = `/api/admin/wbc/transactions?page=${page}&limit=${limit}`;
      if (typeFilter !== 'all') url += `&type=${typeFilter}`;
      if (statusFilter !== 'all') url += `&status=${statusFilter}`;
      if (searchQuery) url += `&walletAddress=${searchQuery}`;

      return apiRequest<TransactionResponse>('GET', url, undefined, { headers });
    },
    refetchInterval: 15000
  });

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copiado",
      description: `${label} copiado al portapapeles`
    });
  };

  const formatAddress = (address: string) => {
    if (!address) return '-';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return (
          <Badge className="bg-emerald-100 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Confirmado
          </Badge>
        );
      case 'failed':
        return (
          <Badge className="bg-red-100 text-red-800 border border-red-200">
            <XCircle className="w-3 h-3 mr-1" />
            Fallido
          </Badge>
        );
      case 'pending':
      case 'pending_confirmation':
        return (
          <Badge className="bg-amber-100 text-amber-800 border border-amber-200">
            <Clock className="w-3 h-3 mr-1" />
            Pendiente
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'activation':
        return (
          <Badge className="bg-blue-100 text-blue-800 border border-blue-200">
            <ArrowUpRight className="w-3 h-3 mr-1" />
            Activacion
          </Badge>
        );
      case 'daily_fee':
        return (
          <Badge className="bg-purple-100 text-purple-800 border border-purple-200">
            <Coins className="w-3 h-3 mr-1" />
            Fee Diario
          </Badge>
        );
      case 'fee_collection':
        return (
          <Badge className="bg-orange-100 text-orange-800 border border-orange-200">
            <ArrowDownLeft className="w-3 h-3 mr-1" />
            Cobro Fee
          </Badge>
        );
      case 'position_close':
        return (
          <Badge className="bg-slate-100 text-slate-800 border border-slate-200">
            <ArrowDownLeft className="w-3 h-3 mr-1" />
            Cierre
          </Badge>
        );
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  const getPolygonScanTxUrl = (txHash: string) => {
    if (txHash.startsWith('failed_') || txHash.startsWith('wbc_return_')) {
      return null;
    }
    return `https://polygonscan.com/tx/${txHash}`;
  };

  const getPolygonScanAddressUrl = (address: string) => {
    return `https://polygonscan.com/address/${address}`;
  };

  const handleRefresh = () => {
    refetchStats();
    refetchTx();
    toast({ title: "Actualizando", description: "Recargando datos..." });
  };

  return (
    <AdminLayout>
      <div className="container mx-auto p-4 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold">Historial WBC Token</h1>
            <Button variant="outline" size="sm" asChild className="flex items-center gap-2">
              <Link href="/admin">
                <ChevronLeft className="h-4 w-4" />
                Volver al panel
              </Link>
            </Button>
          </div>
          <Button onClick={handleRefresh} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualizar
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Contract Info Card */}
          <Card className="bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-300 flex items-center gap-2">
                <Hash className="h-4 w-4 text-blue-400" />
                Contrato WBC
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <code className="text-xs text-white font-mono bg-slate-800 px-2 py-1 rounded">
                  {formatAddress(statsData?.config.contractAddress || WBC_CONTRACT)}
                </code>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 text-slate-400 hover:text-white"
                  onClick={() => copyToClipboard(statsData?.config.contractAddress || WBC_CONTRACT, 'Contrato')}
                >
                  <Copy className="h-3 w-3" />
                </Button>
                <a
                  href={`https://polygonscan.com/address/${statsData?.config.contractAddress || WBC_CONTRACT}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300"
                >
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {statsData?.config.isActive ? (
                  <span className="text-emerald-400">Sistema Activo</span>
                ) : (
                  <span className="text-red-400">Sistema Inactivo</span>
                )}
              </p>
            </CardContent>
          </Card>

          {/* Total Distributed */}
          <Card className="bg-gradient-to-br from-emerald-900/50 to-emerald-800/50 border-emerald-700/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-emerald-300 flex items-center gap-2">
                <ArrowUpRight className="h-4 w-4" />
                Total Enviado
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {(statsData?.stats.totalSent || 0).toLocaleString('es-ES', { minimumFractionDigits: 2 })} WBC
              </div>
              <p className="text-xs text-emerald-400">
                {statsData?.stats.uniqueUsers || 0} usuarios - {statsData?.stats.uniquePositions || 0} posiciones
              </p>
            </CardContent>
          </Card>

          {/* Total Returned */}
          <Card className="bg-gradient-to-br from-amber-900/50 to-amber-800/50 border-amber-700/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-amber-300 flex items-center gap-2">
                <ArrowDownLeft className="h-4 w-4" />
                Total Devuelto
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {(statsData?.stats.totalReturned || 0).toLocaleString('es-ES', { minimumFractionDigits: 2 })} WBC
              </div>
              <p className="text-xs text-amber-400">
                Neto: {(statsData?.stats.netDistributed || 0).toLocaleString('es-ES', { minimumFractionDigits: 2 })} WBC
              </p>
            </CardContent>
          </Card>

          {/* Transaction Stats */}
          <Card className="bg-gradient-to-br from-purple-900/50 to-purple-800/50 border-purple-700/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-purple-300 flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Transacciones
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {statsData?.stats.totalTransactions || 0}
              </div>
              <div className="flex gap-2 text-xs mt-1">
                <span className="text-emerald-400">{statsData?.stats.confirmedCount || 0} OK</span>
                <span className="text-red-400">{statsData?.stats.failedCount || 0} Error</span>
                <span className="text-amber-400">{statsData?.stats.pendingCount || 0} Pend.</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Filtros</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por wallet..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
                />
              </div>

              <Select value={typeFilter} onValueChange={(v) => { setTypeFilter(v); setPage(1); }}>
                <SelectTrigger>
                  <SelectValue placeholder="Tipo de transaccion" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los tipos</SelectItem>
                  <SelectItem value="activation">Activacion</SelectItem>
                  <SelectItem value="daily_fee">Fee Diario</SelectItem>
                  <SelectItem value="fee_collection">Cobro Fee</SelectItem>
                  <SelectItem value="position_close">Cierre</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
                <SelectTrigger>
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="confirmed">Confirmado</SelectItem>
                  <SelectItem value="pending">Pendiente</SelectItem>
                  <SelectItem value="failed">Fallido</SelectItem>
                </SelectContent>
              </Select>

              <Select value={limit.toString()} onValueChange={(v) => { setLimit(parseInt(v)); setPage(1); }}>
                <SelectTrigger>
                  <SelectValue placeholder="Por pagina" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10 por pagina</SelectItem>
                  <SelectItem value="25">25 por pagina</SelectItem>
                  <SelectItem value="50">50 por pagina</SelectItem>
                  <SelectItem value="100">100 por pagina</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Transactions Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Historial de Transacciones WBC</span>
              <span className="text-sm font-normal text-muted-foreground">
                {txData?.pagination.total || 0} transacciones totales
              </span>
            </CardTitle>
            <CardDescription>
              Registro completo de todas las operaciones con tokens WBC en Polygon
            </CardDescription>
          </CardHeader>
          <CardContent>
            {txLoading ? (
              <div className="flex justify-center py-8">
                <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : (txData?.transactions?.length || 0) === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Coins className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No hay transacciones WBC registradas</p>
                <p className="text-sm">Las transacciones apareceran cuando el sistema procese fees diarios</p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-slate-50 dark:bg-slate-800">
                        <TableHead className="w-[80px]">ID</TableHead>
                        <TableHead>Fecha/Hora</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>De</TableHead>
                        <TableHead>A</TableHead>
                        <TableHead className="text-right">Cantidad</TableHead>
                        <TableHead>Posicion</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead>TX Hash</TableHead>
                        <TableHead className="text-right">Bloque</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {txData?.transactions.map((tx) => (
                        <TableRow key={tx.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                          <TableCell className="font-mono text-xs">#{tx.id}</TableCell>
                          <TableCell className="text-xs">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3 text-muted-foreground" />
                              {formatDate(tx.createdAt)}
                            </div>
                          </TableCell>
                          <TableCell>{getTypeBadge(tx.transactionType)}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <code className="text-xs font-mono bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">
                                {formatAddress(tx.fromAddress)}
                              </code>
                              {tx.fromAddress.toLowerCase() === OWNER_WALLET.toLowerCase() && (
                                <Badge variant="outline" className="text-[10px] px-1">Owner</Badge>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-5 w-5 p-0"
                                onClick={() => copyToClipboard(tx.fromAddress, 'Direccion')}
                              >
                                <Copy className="h-2.5 w-2.5" />
                              </Button>
                              <a
                                href={getPolygonScanAddressUrl(tx.fromAddress)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 hover:text-blue-400"
                              >
                                <ExternalLink className="h-2.5 w-2.5" />
                              </a>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <code className="text-xs font-mono bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">
                                {formatAddress(tx.toAddress)}
                              </code>
                              {tx.toAddress.toLowerCase() === OWNER_WALLET.toLowerCase() && (
                                <Badge variant="outline" className="text-[10px] px-1">Owner</Badge>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-5 w-5 p-0"
                                onClick={() => copyToClipboard(tx.toAddress, 'Direccion')}
                              >
                                <Copy className="h-2.5 w-2.5" />
                              </Button>
                              <a
                                href={getPolygonScanAddressUrl(tx.toAddress)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 hover:text-blue-400"
                              >
                                <ExternalLink className="h-2.5 w-2.5" />
                              </a>
                            </div>
                          </TableCell>
                          <TableCell className="text-right font-mono font-medium">
                            <span className={tx.transactionType === 'daily_fee' || tx.transactionType === 'activation' ? 'text-emerald-600' : 'text-amber-600'}>
                              {tx.transactionType === 'daily_fee' || tx.transactionType === 'activation' ? '+' : '-'}
                              {tx.amount.toLocaleString('es-ES', { minimumFractionDigits: 6 })}
                            </span>
                            <span className="text-xs text-muted-foreground ml-1">WBC</span>
                          </TableCell>
                          <TableCell>
                            {tx.positionId ? (
                              <Badge variant="outline" className="font-mono">#{tx.positionId}</Badge>
                            ) : '-'}
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(tx.status)}
                            {tx.errorMessage && (
                              <p className="text-[10px] text-red-500 mt-1 max-w-[120px] truncate" title={tx.errorMessage}>
                                {tx.errorMessage}
                              </p>
                            )}
                          </TableCell>
                          <TableCell>
                            {getPolygonScanTxUrl(tx.txHash) ? (
                              <div className="flex items-center gap-1">
                                <code className="text-xs font-mono bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">
                                  {formatAddress(tx.txHash)}
                                </code>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-5 w-5 p-0"
                                  onClick={() => copyToClipboard(tx.txHash, 'TX Hash')}
                                >
                                  <Copy className="h-2.5 w-2.5" />
                                </Button>
                                <a
                                  href={getPolygonScanTxUrl(tx.txHash)!}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-500 hover:text-blue-400"
                                >
                                  <ExternalLink className="h-2.5 w-2.5" />
                                </a>
                              </div>
                            ) : (
                              <span className="text-xs text-muted-foreground">
                                {tx.txHash.substring(0, 20)}...
                              </span>
                            )}
                          </TableCell>
                          <TableCell className="text-right font-mono text-xs">
                            {tx.blockNumber ? (
                              <a
                                href={`https://polygonscan.com/block/${tx.blockNumber}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 hover:underline"
                              >
                                {tx.blockNumber.toLocaleString()}
                              </a>
                            ) : '-'}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination */}
                {txData && txData.pagination.totalPages > 1 && (
                  <div className="flex items-center justify-between mt-4 pt-4 border-t">
                    <p className="text-sm text-muted-foreground">
                      Pagina {txData.pagination.page} de {txData.pagination.totalPages}
                      {' '}({txData.pagination.total} registros)
                    </p>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                      >
                        Anterior
                      </Button>
                      {Array.from({ length: Math.min(5, txData.pagination.totalPages) }, (_, i) => {
                        const pageNum = page <= 3 ? i + 1 : page - 2 + i;
                        if (pageNum > txData.pagination.totalPages) return null;
                        return (
                          <Button
                            key={pageNum}
                            variant={pageNum === page ? "default" : "outline"}
                            size="sm"
                            onClick={() => setPage(pageNum)}
                          >
                            {pageNum}
                          </Button>
                        );
                      })}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(p => Math.min(txData.pagination.totalPages, p + 1))}
                        disabled={page === txData.pagination.totalPages}
                      >
                        Siguiente
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>

        {/* Contract Info Footer */}
        <Card className="bg-slate-50 dark:bg-slate-900/50">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground mb-1">Contrato WBC Token</p>
                <div className="flex items-center gap-2">
                  <a
                    href={`https://polygonscan.com/address/${WBC_CONTRACT}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-xs text-blue-500 hover:underline"
                  >
                    {WBC_CONTRACT}
                  </a>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-5 w-5 p-0"
                    onClick={() => copyToClipboard(WBC_CONTRACT, 'Contrato')}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">Owner Wallet</p>
                <div className="flex items-center gap-2">
                  <a
                    href={`https://polygonscan.com/address/${OWNER_WALLET}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-xs text-blue-500 hover:underline"
                  >
                    {OWNER_WALLET}
                  </a>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-5 w-5 p-0"
                    onClick={() => copyToClipboard(OWNER_WALLET, 'Owner')}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">Red</p>
                <p className="font-medium">Polygon Mainnet (Chain ID: 137)</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
