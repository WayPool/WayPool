/**
 * ModalBackgroundFix
 * 
 * Componente que soluciona el problema del fondo negro que aparece
 * al abrir selectores o elementos de interfaz que usan portales.
 * 
 * El problema: Cuando se abre un selector, la página completa se vuelve negra.
 * La causa: Los portales de Radix UI están afectando la clase 'dark' en el html.
 * La solución: Mantener un fondo fijo persistente del color correcto.
 */

import { useEffect } from 'react';
import { useTheme } from '@/hooks/use-theme';

export function ModalBackgroundFix() {
  const { theme } = useTheme();
  
  useEffect(() => {
    // Crear un elemento de fondo fijo que cubra toda la página
    const createBackdrop = () => {
      // Verificar si ya existe el backdrop
      let backdrop = document.getElementById('modal-backdrop-fix');
      
      if (!backdrop) {
        backdrop = document.createElement('div');
        backdrop.id = 'modal-backdrop-fix';
        backdrop.style.position = 'fixed';
        backdrop.style.top = '0';
        backdrop.style.left = '0';
        backdrop.style.width = '100vw';
        backdrop.style.height = '100vh';
        backdrop.style.zIndex = '-9999';
        backdrop.style.pointerEvents = 'none';
        backdrop.style.transition = 'background-color 0.2s ease';
        
        // Añadir el backdrop como primer hijo del body
        document.body.insertBefore(backdrop, document.body.firstChild);
      }
      
      // Actualizar el color del backdrop según el tema
      if (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        backdrop.style.backgroundColor = 'rgb(9, 14, 33)'; // Color oscuro
      } else {
        backdrop.style.backgroundColor = '#ffffff'; // Color claro
      }
    };
    
    // Crear el backdrop inmediatamente
    createBackdrop();
    
    // Observar cambios en el DOM que podrían afectar al tema
    const observer = new MutationObserver((mutations) => {
      mutations.forEach(mutation => {
        if (mutation.attributeName === 'class' && 
            mutation.target === document.documentElement) {
          // Si cambia la clase en el HTML, actualizamos el backdrop
          createBackdrop();
        }
      });
    });
    
    // Observar cambios en la clase del elemento HTML
    observer.observe(document.documentElement, { attributes: true });
    
    // Limpiar al desmontar
    return () => {
      observer.disconnect();
      const backdrop = document.getElementById('modal-backdrop-fix');
      if (backdrop) {
        document.body.removeChild(backdrop);
      }
    };
  }, [theme]);
  
  // Este componente no renderiza nada visible
  return null;
}