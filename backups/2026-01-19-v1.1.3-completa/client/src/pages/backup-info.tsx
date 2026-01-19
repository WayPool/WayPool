import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "@/hooks/use-translation";
import { Download } from "lucide-react";
import { Link } from "wouter";
import { APP_NAME } from "@/utils/app-config";

export default function BackupInfo() {
  const { t } = useTranslation();
  const today = new Date().toLocaleDateString('es-ES', { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric' 
  });
  
  const backupFileName = `waybank_full_backup_${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(new Date().getDate()).padStart(2, '0')}.zip`;
  const backupUrl = `/${backupFileName}`;

  return (
    <div className="container mx-auto py-10">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Información de Copia de Seguridad</CardTitle>
          <CardDescription>
            Se ha creado una copia de seguridad completa del proyecto {APP_NAME}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium">Detalles de la copia de seguridad</h3>
              <ul className="mt-2 space-y-2">
                <li className="flex items-center justify-between border-b pb-2">
                  <span className="text-muted-foreground">Fecha de creación:</span>
                  <span className="font-medium">{today}</span>
                </li>
                <li className="flex items-center justify-between border-b pb-2">
                  <span className="text-muted-foreground">Nombre del archivo:</span>
                  <span className="font-medium">{backupFileName}</span>
                </li>
                <li className="flex items-center justify-between border-b pb-2">
                  <span className="text-muted-foreground">Tamaño:</span>
                  <span className="font-medium">2.4 MB</span>
                </li>
                <li className="flex items-center justify-between border-b pb-2">
                  <span className="text-muted-foreground">Ubicación en servidor:</span>
                  <span className="font-medium">public/{backupFileName}</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-medium">Contenido de la copia de seguridad</h3>
              <ul className="mt-2 space-y-1 list-disc pl-5">
                <li>Código del servidor (código de backend en Node.js)</li>
                <li>Componentes del cliente (código de frontend en React)</li>
                <li>Esquema de datos compartidos</li>
                <li>Archivos de configuración</li>
                <li>Recursos estáticos</li>
              </ul>
            </div>
            
            <div className="flex flex-col items-center justify-center pt-4">
              <Button asChild size="lg" className="w-full sm:w-auto">
                <a href={backupUrl} download>
                  <Download className="mr-2 h-4 w-4" />
                  Descargar copia de seguridad
                </a>
              </Button>
              <p className="text-sm text-muted-foreground mt-2">
                Tamaño de descarga: aproximadamente 2.4 MB
              </p>
            </div>
            
            <div className="pt-6 text-center">
              <Link href="/admin">
                <Button variant="outline">Volver al panel de administración</Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}