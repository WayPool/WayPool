import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { RefreshCw, Download, AlertTriangle, CheckCircle, Database, Activity } from 'lucide-react';

interface TableStatus {
  table: string;
  primary: number;
  secondary: number;
  synchronized: boolean;
  difference: number;
  status: 'SYNCED' | 'OUT_OF_SYNC' | 'ERROR';
  checksumMatch?: boolean;
}

interface SyncReport {
  timestamp: string;
  totalTables: number;
  syncedTables: number;
  outOfSyncTables: number;
  errorTables: number;
  tables: TableStatus[];
  dualWriteTest: {
    success: boolean;
    primaryFound: boolean;
    secondaryFound: boolean;
    testId: string;
  };
  overallStatus: 'FULLY_SYNCHRONIZED' | 'PARTIALLY_SYNCHRONIZED' | 'SYNCHRONIZATION_ISSUES';
}

interface BackupStatus {
  inProgress: boolean;
  completed: boolean;
  totalTables: number;
  completedTables: number;
  currentTable: string;
  downloadUrl?: string;
  error?: string;
}

export default function DatabaseMonitor() {
  const [syncReport, setSyncReport] = useState<SyncReport | null>(null);
  const [backupStatus, setBackupStatus] = useState<BackupStatus>({
    inProgress: false,
    completed: false,
    totalTables: 0,
    completedTables: 0,
    currentTable: ''
  });
  const [loading, setLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const fetchSyncReport = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/database/sync-report');
      if (response.ok) {
        const data = await response.json();
        setSyncReport(data);
        setLastUpdate(new Date());
      } else {
        console.error('Error fetching sync report:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching sync report:', error);
    } finally {
      setLoading(false);
    }
  };

  const createBackup = async () => {
    setBackupStatus({
      inProgress: true,
      completed: false,
      totalTables: 0,
      completedTables: 0,
      currentTable: 'Iniciando...'
    });

    try {
      const response = await fetch('/api/admin/database/create-backup', {
        method: 'POST'
      });

      if (response.ok) {
        // Monitorear progreso del backup
        const pollBackupStatus = setInterval(async () => {
          try {
            const statusResponse = await fetch('/api/admin/database/backup-status');
            if (statusResponse.ok) {
              const status = await statusResponse.json();
              setBackupStatus(status);
              
              if (status.completed || status.error) {
                clearInterval(pollBackupStatus);
              }
            }
          } catch (error) {
            console.error('Error polling backup status:', error);
            clearInterval(pollBackupStatus);
          }
        }, 1000);
      } else {
        setBackupStatus(prev => ({
          ...prev,
          inProgress: false,
          error: 'Error al iniciar el backup'
        }));
      }
    } catch (error) {
      setBackupStatus(prev => ({
        ...prev,
        inProgress: false,
        error: 'Error de conexión'
      }));
    }
  };

  const downloadBackup = () => {
    if (backupStatus.downloadUrl) {
      window.open(backupStatus.downloadUrl, '_blank');
    }
  };

  useEffect(() => {
    fetchSyncReport();
    
    // Auto-refresh cada 30 segundos
    const interval = setInterval(fetchSyncReport, 30000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SYNCED':
      case 'FULLY_SYNCHRONIZED':
        return 'bg-green-100 text-green-800';
      case 'OUT_OF_SYNC':
      case 'PARTIALLY_SYNCHRONIZED':
        return 'bg-yellow-100 text-yellow-800';
      case 'ERROR':
      case 'SYNCHRONIZATION_ISSUES':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getSyncPercentage = () => {
    if (!syncReport) return 0;
    return Math.round((syncReport.syncedTables / syncReport.totalTables) * 100);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Monitor de Base de Datos</h2>
          <p className="text-gray-600">
            Estado de sincronización entre bases de datos principal y secundaria
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button 
            onClick={fetchSyncReport} 
            disabled={loading}
            variant="outline"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
          
          <Button 
            onClick={createBackup}
            disabled={backupStatus.inProgress}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Download className="w-4 h-4 mr-2" />
            {backupStatus.inProgress ? 'Creando Backup...' : 'Backup Completo'}
          </Button>
        </div>
      </div>

      {lastUpdate && (
        <Alert>
          <Activity className="h-4 w-4" />
          <AlertDescription>
            Última actualización: {lastUpdate.toLocaleString()}
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Resumen General</TabsTrigger>
          <TabsTrigger value="tables">Detalles de Tablas</TabsTrigger>
          <TabsTrigger value="backup">Sistema de Backup</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {syncReport && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Estado General</CardTitle>
                    <Database className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <Badge className={getStatusColor(syncReport.overallStatus)}>
                      {syncReport.overallStatus === 'FULLY_SYNCHRONIZED' && 'Completamente Sincronizado'}
                      {syncReport.overallStatus === 'PARTIALLY_SYNCHRONIZED' && 'Parcialmente Sincronizado'}
                      {syncReport.overallStatus === 'SYNCHRONIZATION_ISSUES' && 'Problemas de Sincronización'}
                    </Badge>
                    <div className="mt-2">
                      <Progress value={getSyncPercentage()} className="w-full" />
                      <p className="text-xs text-muted-foreground mt-1">
                        {syncReport.syncedTables} de {syncReport.totalTables} tablas sincronizadas
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Tablas Sincronizadas</CardTitle>
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">
                      {syncReport.syncedTables}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      de {syncReport.totalTables} total
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Problemas Detectados</CardTitle>
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-yellow-600">
                      {syncReport.outOfSyncTables + syncReport.errorTables}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {syncReport.outOfSyncTables} desincronizadas, {syncReport.errorTables} errores
                    </p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Prueba de Escritura Dual</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    {syncReport.dualWriteTest.success ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <AlertTriangle className="h-5 w-5 text-red-600" />
                    )}
                    <span className={syncReport.dualWriteTest.success ? 'text-green-600' : 'text-red-600'}>
                      {syncReport.dualWriteTest.success ? 'Sistema de escritura dual funcionando correctamente' : 'Fallo en el sistema de escritura dual'}
                    </span>
                  </div>
                  <div className="mt-2 text-sm text-gray-600">
                    Test ID: {syncReport.dualWriteTest.testId} | 
                    Principal: {syncReport.dualWriteTest.primaryFound ? 'OK' : 'FALLO'} | 
                    Secundaria: {syncReport.dualWriteTest.secondaryFound ? 'OK' : 'FALLO'}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        <TabsContent value="tables" className="space-y-6">
          {syncReport && (
            <Card>
              <CardHeader>
                <CardTitle>Estado Detallado de Tablas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Tabla</th>
                        <th className="text-center p-2">Base Principal</th>
                        <th className="text-center p-2">Base Secundaria</th>
                        <th className="text-center p-2">Diferencia</th>
                        <th className="text-center p-2">Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {syncReport.tables.map((table) => (
                        <tr key={table.table} className="border-b hover:bg-gray-50">
                          <td className="p-2 font-medium">{table.table}</td>
                          <td className="text-center p-2">{table.primary}</td>
                          <td className="text-center p-2">{table.secondary}</td>
                          <td className="text-center p-2">
                            {table.difference !== 0 && (
                              <span className={table.difference > 0 ? 'text-red-600' : 'text-blue-600'}>
                                {table.difference > 0 ? '+' : ''}{table.difference}
                              </span>
                            )}
                          </td>
                          <td className="text-center p-2">
                            <Badge className={getStatusColor(table.status)}>
                              {table.status === 'SYNCED' && 'Sincronizada'}
                              {table.status === 'OUT_OF_SYNC' && 'Desincronizada'}
                              {table.status === 'ERROR' && 'Error'}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="backup" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Sistema de Backup Completo</CardTitle>
              <p className="text-sm text-gray-600">
                Crear respaldo completo de todas las tablas y datos del sistema
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {backupStatus.inProgress && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Progreso del backup</span>
                    <span className="text-sm">
                      {backupStatus.completedTables} / {backupStatus.totalTables}
                    </span>
                  </div>
                  <Progress 
                    value={backupStatus.totalTables > 0 ? (backupStatus.completedTables / backupStatus.totalTables) * 100 : 0} 
                    className="w-full" 
                  />
                  <p className="text-sm text-gray-600">
                    Procesando: {backupStatus.currentTable}
                  </p>
                </div>
              )}

              {backupStatus.completed && (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    Backup completado exitosamente. {backupStatus.totalTables} tablas respaldadas.
                  </AlertDescription>
                </Alert>
              )}

              {backupStatus.error && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Error en el backup: {backupStatus.error}
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex gap-2">
                <Button 
                  onClick={createBackup}
                  disabled={backupStatus.inProgress}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Download className="w-4 h-4 mr-2" />
                  {backupStatus.inProgress ? 'Creando Backup...' : 'Crear Backup Completo'}
                </Button>

                {backupStatus.downloadUrl && (
                  <Button 
                    onClick={downloadBackup}
                    variant="outline"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Descargar Backup
                  </Button>
                )}
              </div>

              <div className="text-xs text-gray-500 mt-4">
                <p><strong>Nota:</strong> El backup incluye todas las tablas con datos auténticos de producción.</p>
                <p>Se recomienda realizar backups regulares para garantizar la integridad de los datos.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}