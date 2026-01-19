import React, { useEffect } from "react";
import { useLocation } from "wouter";

// Componente para envolver todas las páginas del dashboard
// Este layout proporciona la estructura común para todas las páginas internas
// Incluye integración con Google Analytics (GA4) para todas las páginas
const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [location] = useLocation();
  
  // Enviar evento de vista de página a Google Analytics cada vez que cambia la ubicación
  useEffect(() => {
    // Verificar que Google Analytics está cargado
    if (typeof window.gtag !== 'undefined') {
      // Google Analytics - Enviar evento de cambio de página
      window.gtag('event', 'page_view', {
        page_path: location,
        page_location: window.location.href,
        page_title: document.title,
        send_to: 'G-XXXXXXXXXX' // Código de seguimiento de Google Analytics
      });
      
      console.log('[Google Analytics] Página registrada:', location);
    }
  }, [location]);
  
  return (
    <div className="min-h-screen bg-background">
      {/* 
        Google Analytics (GA4) implementado en index.html y componente <GoogleAnalytics />
        ID de seguimiento: G-XXXXXXXXXX
      */}
      <div className="flex-1 pb-12">
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;