import React, { useState, useRef, useEffect } from "react";
import Sidebar from "./sidebar";
import MobileNav from "./mobile-nav";
import { LegalTermsDialog } from "@/components/legal/legal-terms-dialog";
import { LegalTermsLoading } from "@/components/legal/legal-terms-loading";
import { useWallet } from "@/hooks/use-wallet";
import { useLocation } from "wouter";
import { sendGAEvent } from "@/components/analytics/GoogleAnalytics";

interface LayoutProps {
  children: React.ReactNode;
  hasAcceptedLegalTerms?: boolean;
  isLoadingLegalTerms?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  hasAcceptedLegalTerms = true,
  isLoadingLegalTerms = false 
}) => {
  // Estado del diálogo legal
  const [legalDialogOpen, setLegalDialogOpen] = useState(false);
  
  // Estado para controlar la inicialización y carga inicial
  const [isInitializing, setIsInitializing] = useState(true);
  const [shouldShowDialog, setShouldShowDialog] = useState(false);
  
  // Obtener la ubicación actual para Google Analytics
  const [location] = useLocation();
  
  const { account } = useWallet();
  
  // Mantener la referencia para el último cierre (para futuras funcionalidades)
  const lastClosedTimestamp = useRef(0);
  const hasRunInitialCheck = useRef(false);
  
  // Google Analytics - Seguimiento de cambio de página
  useEffect(() => {
    // Enviar evento de vista de página a Google Analytics (GA4)
    if (typeof window !== 'undefined' && typeof window.gtag !== 'undefined') {
      // Google Analytics - Enviar evento de cambio de página
      window.gtag('event', 'page_view', {
        page_path: location,
        page_location: window.location.href,
        page_title: document.title,
        send_to: 'G-XXXXXXXXXX' // ID de seguimiento de Google Analytics
      });
      
      // Evento personalizado para usuarios autenticados/no autenticados
      sendGAEvent('page_visited', {
        page_path: location,
        user_type: account ? 'authenticated' : 'guest',
        wallet_connected: !!account
      });
      
      // Página registrada en Google Analytics
    } else {
      // Analytics no disponible
    }
  }, [location, account]);
  
  // Efecto para controlar cuándo mostrar el diálogo según el estado de los términos legales
  useEffect(() => {
    // No hacemos nada si no hay una cuenta conectada
    if (!account) {
      setIsInitializing(false);
      return;
    }
    
    // Marcamos como inicializando mientras verificamos el estado
    setIsInitializing(true);
    
    // Simulamos un tiempo mínimo de carga para asegurar que se muestre el indicador
    // y que se haya completado la verificación en la base de datos
    const minLoadTime = setTimeout(() => {
      // Si todavía está cargando después del tiempo mínimo, seguimos mostrando el indicador
      if (isLoadingLegalTerms) {
        // El indicador de carga seguirá mostrándose hasta que isLoadingLegalTerms sea false
        return;
      }
      
      // Cuando termina la carga, determinamos si debemos mostrar el diálogo
      setIsInitializing(false);
      
      // ARREGLO CRÍTICO: Siempre considerar ambas fuentes: base de datos y localStorage
      // Verificar localStorage como fuente adicional de verificación
      let localStorageAccepted = false;
      try {
        const localStorageKey = `waybank_legal_accepted_${account.toLowerCase()}`;
        localStorageAccepted = localStorage.getItem(localStorageKey) === "true";
      } catch (e) {
        console.warn("Error al verificar localStorage:", e);
      }

      // Si los términos NO han sido aceptados en ninguna fuente, mostramos el diálogo
      if (!hasAcceptedLegalTerms && !localStorageAccepted) {
        // Términos legales no aceptados
        setShouldShowDialog(true);
        setLegalDialogOpen(true);
      } else {
        // Términos legales ya aceptados
        setShouldShowDialog(false);
        setLegalDialogOpen(false);
      }
      
      // Marcamos que ya hemos completado la verificación inicial
      hasRunInitialCheck.current = true;
    }, 1000); // Tiempo mínimo de carga: 1 segundo
    
    return () => clearTimeout(minLoadTime);
  }, [account, hasAcceptedLegalTerms, isLoadingLegalTerms]);
  
  // Actualizar el estado cuando cambia isLoadingLegalTerms
  useEffect(() => {
    if (!isLoadingLegalTerms && isInitializing && hasRunInitialCheck.current) {
      setIsInitializing(false);
      
      // ARREGLO CRÍTICO: Verificar también localStorage en este efecto
      let localStorageAccepted = false;
      try {
        if (account) {
          const localStorageKey = `waybank_legal_accepted_${account.toLowerCase()}`;
          localStorageAccepted = localStorage.getItem(localStorageKey) === "true";
        }
      } catch (e) {
        console.warn("Error al verificar localStorage:", e);
      }
      
      // Determinamos si debemos mostrar el diálogo basado en el estado de aceptación
      if (!hasAcceptedLegalTerms && !localStorageAccepted) {
        setShouldShowDialog(true);
        setLegalDialogOpen(true);
      } else {
        setShouldShowDialog(false);
        setLegalDialogOpen(false);
      }
    }
  }, [isLoadingLegalTerms, hasAcceptedLegalTerms, isInitializing, account]);
  
  // Función para manejar cambios en el estado del diálogo
  const handleOpenChange = (open: boolean) => {
    // ARREGLO CRÍTICO: Siempre permitir cerrar el diálogo después de una aceptación exitosa
    // Este cambio es esencial para permitir que el usuario cierre el diálogo después de aceptar
    setLegalDialogOpen(open);
    
    // Si estamos cerrando el diálogo, registrar el timestamp
    if (!open) {
      lastClosedTimestamp.current = Date.now();
    }
  };
  
  // Función explícita para abrir el diálogo desde el exterior
  const openLegalDialog = () => {
    setLegalDialogOpen(true);
  };
  
  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden">
      {/* 
        Google Analytics (GA4) - Integración en toda la aplicación
        - ID de seguimiento: G-XXXXXXXXXX
        - Se rastrea cada cambio de página
        - Se captura información de usuario (autenticado vs. invitado)
        - Se envían eventos personalizados para acciones importantes
      */}
      
      {/* Desktop Sidebar - fijo, sin scroll */}
      <Sidebar />
      
      {/* Mobile Header - fijo, sin scroll */}
      <MobileNav />
      
      {/* Main Content - ÚNICO elemento con scroll vertical en toda la aplicación */}
      <main className="flex-1 p-4 md:p-6 pb-20 md:pb-6 overflow-y-auto overflow-x-hidden">
        {/* El contenido de la página va aquí - no le damos scroll adicional */}
        {children}
      </main>
      
      {/* Indicador de carga durante la verificación inicial */}
      {isInitializing && account && isLoadingLegalTerms && <LegalTermsLoading />}
      
      {/* Diálogo de términos legales - Solo se muestra si es necesario */}
      {account && (
        <LegalTermsDialog
          walletAddress={account}
          open={legalDialogOpen}
          onOpenChange={handleOpenChange}
        />
      )}
      
      {/* 
        <!-- Google tag (gtag.js) -->
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
        <script>
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-XXXXXXXXXX');
        </script>
      */}
    </div>
  );
};

export default Layout;
