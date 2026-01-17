import React from "react";
import { useWallet } from "@/hooks/use-wallet";
import { isAdmin } from "@/lib/auth-service";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";

interface AdminLayoutProps {
  children: React.ReactNode;
}

/**
 * Layout especial para secciones de administración
 * Verifica que el usuario sea administrador
 */
export default function AdminLayout({ children }: AdminLayoutProps) {
  const { account, isConnected } = useWallet();
  const [location, setLocation] = useLocation();
  const [isLoading, setIsLoading] = React.useState(true);
  const [isUserAdmin, setIsUserAdmin] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  
  const navigate = (path: string) => setLocation(path);

  React.useEffect(() => {
    // Uso de sessionStorage como respaldo para comprobar el estado de admin
    // esto ayudará en casos donde hay problemas con la conexión del wallet
    const checkAdminStatusFromSession = () => {
      try {
        // Primero intentamos con sessionStorage (más seguro y persistente entre navegación)
        const adminStatus = sessionStorage.getItem('isAdmin');
        if (adminStatus === 'true') {
          console.log('📋 Admin layout usando estado de administrador desde sessionStorage');
          setIsUserAdmin(true);
          setIsLoading(false);
          return true;
        }
        
        // Si no hay estado en sessionStorage, comprobar en localStorage (múltiples opciones)
        // Opción 1: Array de adminUsers
        const adminUsers = localStorage.getItem('adminUsers');
        if (adminUsers) {
          try {
            const admins = JSON.parse(adminUsers);
            if (Array.isArray(admins) && account && admins.includes(account.toLowerCase())) {
              console.log('📋 Admin layout usando estado de administrador desde adminUsers en localStorage');
              setIsUserAdmin(true);
              setIsLoading(false);
              
              // También guardamos en sessionStorage para futuras verificaciones
              try {
                sessionStorage.setItem('isAdmin', 'true');
              } catch (e) {
                console.warn('No se pudo guardar en sessionStorage', e);
              }
              
              return true;
            }
          } catch (e) {
            console.warn('Error al parsear adminUsers:', e);
          }
        }
        
        // Opción 2: Clave específica para cada wallet
        if (account) {
          const isAdminInLocalStorage = localStorage.getItem(`isAdmin-${account.toLowerCase()}`);
          if (isAdminInLocalStorage === 'true') {
            console.log('📋 Admin layout usando estado de administrador desde clave específica en localStorage');
            setIsUserAdmin(true);
            setIsLoading(false);
            
            // También guardamos en sessionStorage para futuras verificaciones
            try {
              sessionStorage.setItem('isAdmin', 'true');
            } catch (e) {
              console.warn('No se pudo guardar en sessionStorage', e);
            }
            
            return true;
          }
        }
      } catch (e) {
        console.warn("Error al acceder a almacenamiento local:", e);
      }
      return false;
    };

    const checkAdminStatus = async () => {
      // Primero intentamos obtener el estado desde sessionStorage/localStorage
      if (checkAdminStatusFromSession()) {
        return;
      }

      if (account) {
        try {
          // Agregamos un timeout para evitar que la verificación se quede colgada
          const timeoutPromise = new Promise<boolean>((_, reject) => 
            setTimeout(() => reject(new Error('Timeout al verificar estado de admin')), 5000)
          );
          
          // Ejecutamos ambas promesas en paralelo
          const userIsAdmin = await Promise.race([
            isAdmin(account),
            timeoutPromise
          ]);
          
          setIsUserAdmin(userIsAdmin);
          
          // Guardar el estado en sessionStorage y localStorage para futuras comprobaciones
          if (userIsAdmin) {
            try {
              // Guardamos en múltiples ubicaciones para mayor resiliencia
              sessionStorage.setItem('isAdmin', 'true');
              localStorage.setItem(`isAdmin-${account.toLowerCase()}`, 'true');
              
              // También actualizar el array en localStorage
              const adminUsers = localStorage.getItem('adminUsers');
              let admins = [];
              if (adminUsers) {
                try {
                  admins = JSON.parse(adminUsers);
                  if (!Array.isArray(admins)) admins = [];
                } catch {
                  admins = [];
                }
              }
              
              if (!admins.includes(account.toLowerCase())) {
                admins.push(account.toLowerCase());
                localStorage.setItem('adminUsers', JSON.stringify(admins));
              }
            } catch (e) {
              console.warn("Error al guardar en storage:", e);
            }
          }
        } catch (err) {
          console.error("Error verificando estado de administrador:", err);
          
          // Intento alternativo usando fetch directo
          try {
            console.log('🔄 Intentando verificación manual de admin para', account);
            const response = await fetch(`/api/user/${account}/admin-status`);
            const data = await response.json();
            
            if (data && data.isAdmin) {
              console.log('📋 Admin verificado mediante fetch manual');
              setIsUserAdmin(true);
              setError(null);
              
              // Guardar en storage para futuras verificaciones
              try {
                sessionStorage.setItem('isAdmin', 'true');
                localStorage.setItem(`isAdmin-${account.toLowerCase()}`, 'true');
              } catch (e) {
                console.warn('No se pudo guardar en storage:', e);
              }
            } else {
              // No mostrar error inmediatamente, intentar recuperarse con storage local
              if (!checkAdminStatusFromSession()) {
                setError("No tienes permisos de administrador para acceder a esta sección.");
              }
            }
          } catch (e) {
            console.error('Error también en verificación manual:', e);
            // No mostrar error inmediatamente, intentar recuperarse con storage local
            if (!checkAdminStatusFromSession()) {
              setError("No se pudo verificar tu estado de administrador. Por favor, intenta de nuevo más tarde.");
            }
          }
        } finally {
          setIsLoading(false);
        }
      } else {
        // Si no hay cuenta pero tenemos información en sessionStorage
        if (!checkAdminStatusFromSession()) {
          setIsLoading(false);
          setIsUserAdmin(false);
        }
      }
    };

    checkAdminStatus();
  }, [account]);

  // Redireccionar al dashboard si no está conectado (con manejo de errores mejorado)
  React.useEffect(() => {
    // Solo redirigimos si no es admin, no está cargando y además no tiene cuenta
    // Esto permite que los administradores previamente autenticados puedan ver la página
    // incluso si hay un problema temporal con la conexión del wallet
    if (!isUserAdmin && !isLoading && !account && !sessionStorage.getItem('isAdmin')) {
      navigate("/dashboard");
    }
  }, [account, isLoading, isUserAdmin, navigate]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error && !isUserAdmin) {
    return (
      <div className="container py-10">
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4 mr-2" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button onClick={() => navigate("/dashboard")}>
          Volver al dashboard
        </Button>
      </div>
    );
  }

  if (!isUserAdmin) {
    return (
      <div className="container py-10">
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4 mr-2" />
          <AlertTitle>Acceso Denegado</AlertTitle>
          <AlertDescription>
            No tienes permisos de administrador para acceder a esta sección.
          </AlertDescription>
        </Alert>
        <Button onClick={() => navigate("/dashboard")}>
          Volver al dashboard
        </Button>
      </div>
    );
  }

  return <>{children}</>;
}