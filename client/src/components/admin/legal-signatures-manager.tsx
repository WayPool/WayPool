import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useWallet } from "@/hooks/use-wallet";
import { useToast } from "@/hooks/use-toast";
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, Search, FileCheck, Eye, Download, RefreshCw, Shield, CheckCircle, XCircle } from "lucide-react";

type LegalSignatureRecord = {
  id: number;
  userId: number;
  walletAddress: string;
  email: string | null;
  documentType: string;
  version: string;
  signatureDate: string;
  ipAddress: string | null;
  userAgent: string | null;
  locationData: any;
  deviceInfo: any;
  blockchainSignature: string | null;
  referralSource: string | null;
  consentText: string | null;
  documentHash: string | null;
};

type UserLegalStatus = {
  walletAddress: string;
  email: string | null;
  termsAccepted: boolean;
  privacyAccepted: boolean;
  disclaimerAccepted: boolean;
  allAccepted: boolean;
  lastSignatureDate: string | null;
  signatureCount: number;
};

export default function LegalSignaturesManager() {
  const { address } = useWallet();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedSignature, setSelectedSignature] = useState<LegalSignatureRecord | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const { data: signatures, isLoading, refetch } = useQuery<LegalSignatureRecord[]>({
    queryKey: ["/api/admin/legal-signatures"],
    enabled: !!address,
  });

  const { data: userStatuses, isLoading: loadingStatuses, refetch: refetchStatuses } = useQuery<UserLegalStatus[]>({
    queryKey: ["/api/admin/legal-status"],
    enabled: !!address,
  });

  const filteredSignatures = signatures?.filter((sig) => {
    const matchesSearch =
      sig.walletAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (sig.email && sig.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      sig.documentType.toLowerCase().includes(searchTerm.toLowerCase());

    if (filterStatus === "all") return matchesSearch;
    return matchesSearch && sig.documentType === filterStatus;
  });

  const filteredUsers = userStatuses?.filter((user) => {
    const matchesSearch =
      user.walletAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase()));

    if (filterStatus === "all") return matchesSearch;
    if (filterStatus === "complete") return matchesSearch && user.allAccepted;
    if (filterStatus === "incomplete") return matchesSearch && !user.allAccepted;
    return matchesSearch;
  });

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleString("es-ES", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getDocumentTypeBadge = (type: string) => {
    const colors: Record<string, string> = {
      terms_of_use: "bg-blue-500",
      privacy_policy: "bg-green-500",
      disclaimer: "bg-orange-500",
    };
    const labels: Record<string, string> = {
      terms_of_use: "Términos de Uso",
      privacy_policy: "Política de Privacidad",
      disclaimer: "Aviso Legal",
    };
    return (
      <Badge className={colors[type] || "bg-gray-500"}>
        {labels[type] || type}
      </Badge>
    );
  };

  const shortenAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const exportToCSV = () => {
    if (!signatures?.length) return;

    const headers = ["ID", "Wallet", "Email", "Documento", "Version", "Fecha", "IP", "Navegador"];
    const rows = signatures.map((sig) => [
      sig.id,
      sig.walletAddress,
      sig.email || "",
      sig.documentType,
      sig.version,
      formatDate(sig.signatureDate),
      sig.ipAddress || "",
      sig.deviceInfo?.browser || "",
    ]);

    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `legal_signatures_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const totalUsers = userStatuses?.length || 0;
  const completeUsers = userStatuses?.filter((u) => u.allAccepted).length || 0;
  const incompleteUsers = totalUsers - completeUsers;

  return (
    <div className="space-y-6" data-testid="legal-signatures-manager">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Gestión de Aceptaciones Legales
          </CardTitle>
          <CardDescription>
            Registro completo de usuarios que han aceptado los términos legales con IP, dispositivo y fecha
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Aceptaciones Completas</p>
                    <p className="text-2xl font-bold text-green-600">{completeUsers}</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Aceptaciones Pendientes</p>
                    <p className="text-2xl font-bold text-orange-600">{incompleteUsers}</p>
                  </div>
                  <XCircle className="h-8 w-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Firmas</p>
                    <p className="text-2xl font-bold text-blue-600">{signatures?.length || 0}</p>
                  </div>
                  <FileCheck className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por wallet, email o documento..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                data-testid="input-search-legal"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full md:w-48" data-testid="select-filter-status">
                <SelectValue placeholder="Filtrar por estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="complete">Completos</SelectItem>
                <SelectItem value="incomplete">Pendientes</SelectItem>
                <SelectItem value="terms_of_use">Términos de Uso</SelectItem>
                <SelectItem value="privacy_policy">Privacidad</SelectItem>
                <SelectItem value="disclaimer">Aviso Legal</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              onClick={() => {
                refetch();
                refetchStatuses();
              }}
              data-testid="button-refresh-legal"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Actualizar
            </Button>
            <Button variant="outline" onClick={exportToCSV} data-testid="button-export-csv">
              <Download className="h-4 w-4 mr-2" />
              Exportar CSV
            </Button>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Estado por Usuario</h3>
            {loadingStatuses ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : (
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Wallet</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead className="text-center">Términos</TableHead>
                      <TableHead className="text-center">Privacidad</TableHead>
                      <TableHead className="text-center">Aviso Legal</TableHead>
                      <TableHead>Última Firma</TableHead>
                      <TableHead className="text-center">Estado</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers?.map((user) => (
                      <TableRow key={user.walletAddress} data-testid={`row-user-${user.walletAddress}`}>
                        <TableCell className="font-mono text-sm">
                          {shortenAddress(user.walletAddress)}
                        </TableCell>
                        <TableCell>
                          {user.email ? (
                            <a href={`mailto:${user.email}`} className="text-blue-600 hover:underline">
                              {user.email}
                            </a>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          {user.termsAccepted ? (
                            <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                          ) : (
                            <XCircle className="h-5 w-5 text-red-500 mx-auto" />
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          {user.privacyAccepted ? (
                            <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                          ) : (
                            <XCircle className="h-5 w-5 text-red-500 mx-auto" />
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          {user.disclaimerAccepted ? (
                            <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                          ) : (
                            <XCircle className="h-5 w-5 text-red-500 mx-auto" />
                          )}
                        </TableCell>
                        <TableCell>{formatDate(user.lastSignatureDate)}</TableCell>
                        <TableCell className="text-center">
                          {user.allAccepted ? (
                            <Badge className="bg-green-500">Completo</Badge>
                          ) : (
                            <Badge variant="destructive">Pendiente</Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Historial de Firmas</h3>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : (
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Wallet</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Documento</TableHead>
                      <TableHead>Versión</TableHead>
                      <TableHead>Fecha</TableHead>
                      <TableHead>IP</TableHead>
                      <TableHead>Dispositivo</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSignatures?.map((sig) => (
                      <TableRow key={sig.id} data-testid={`row-signature-${sig.id}`}>
                        <TableCell>{sig.id}</TableCell>
                        <TableCell className="font-mono text-sm">
                          {shortenAddress(sig.walletAddress)}
                        </TableCell>
                        <TableCell>
                          {sig.email ? (
                            <a href={`mailto:${sig.email}`} className="text-blue-600 hover:underline">
                              {sig.email}
                            </a>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>{getDocumentTypeBadge(sig.documentType)}</TableCell>
                        <TableCell>{sig.version}</TableCell>
                        <TableCell>{formatDate(sig.signatureDate)}</TableCell>
                        <TableCell className="font-mono text-xs">
                          {sig.ipAddress || "-"}
                        </TableCell>
                        <TableCell className="text-sm">
                          {sig.deviceInfo?.browser || "-"}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedSignature(sig);
                              setShowDetails(true);
                            }}
                            data-testid={`button-view-${sig.id}`}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileCheck className="h-5 w-5" />
              Detalles de Firma Legal
            </DialogTitle>
            <DialogDescription>
              Información completa de la aceptación de términos
            </DialogDescription>
          </DialogHeader>
          {selectedSignature && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">ID</label>
                  <p className="font-mono">{selectedSignature.id}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">User ID</label>
                  <p>{selectedSignature.userId}</p>
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-medium text-muted-foreground">Wallet</label>
                  <p className="font-mono text-sm break-all">{selectedSignature.walletAddress}</p>
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-medium text-muted-foreground">Email</label>
                  <p>{selectedSignature.email || "No registrado"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Documento</label>
                  <p>{getDocumentTypeBadge(selectedSignature.documentType)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Versión</label>
                  <p>{selectedSignature.version}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Fecha de Firma</label>
                  <p>{formatDate(selectedSignature.signatureDate)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">IP Pública</label>
                  <p className="font-mono">{selectedSignature.ipAddress || "No capturada"}</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">User Agent</label>
                <p className="text-xs break-all bg-muted p-2 rounded">
                  {selectedSignature.userAgent || "No registrado"}
                </p>
              </div>

              {selectedSignature.deviceInfo && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Información del Dispositivo</label>
                  <pre className="text-xs bg-muted p-2 rounded overflow-x-auto">
                    {JSON.stringify(selectedSignature.deviceInfo, null, 2)}
                  </pre>
                </div>
              )}

              {selectedSignature.locationData && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Datos de Ubicación</label>
                  <pre className="text-xs bg-muted p-2 rounded overflow-x-auto">
                    {JSON.stringify(selectedSignature.locationData, null, 2)}
                  </pre>
                </div>
              )}

              {selectedSignature.blockchainSignature && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Firma Blockchain</label>
                  <p className="font-mono text-xs break-all bg-muted p-2 rounded">
                    {selectedSignature.blockchainSignature}
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
