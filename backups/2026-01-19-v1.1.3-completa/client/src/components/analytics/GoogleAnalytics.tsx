import { useEffect } from 'react';
import { useLocation } from 'wouter';

/**
 * Componente para integrar Google Analytics en toda la aplicación
 * Este componente se debe importar en el componente raíz de la aplicación
 * Enviará eventos de cambio de página automáticamente
 */
export const GoogleAnalytics = () => {
  const [location] = useLocation();

  useEffect(() => {
    // Asegurarse de que el objeto gtag está disponible
    if (typeof window.gtag !== 'undefined') {
      // Enviar evento de cambio de página
      window.gtag('event', 'page_view', {
        page_path: location,
        page_title: document.title
      });
    }
  }, [location]);

  return null; // Este componente no renderiza nada visible
};

// Declaración global para TypeScript
declare global {
  interface Window {
    gtag: (
      command: string,
      action: string,
      params?: {
        [key: string]: any;
      }
    ) => void;
    dataLayer: any[];
  }
}

/**
 * Función auxiliar para enviar eventos personalizados a Google Analytics
 * @param eventName Nombre del evento
 * @param eventParams Parámetros adicionales del evento
 */
export const sendGAEvent = (
  eventName: string,
  eventParams: { [key: string]: any } = {}
) => {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', eventName, eventParams);
  }
};