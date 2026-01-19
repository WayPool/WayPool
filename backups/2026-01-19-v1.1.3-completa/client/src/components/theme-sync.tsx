/**
 * ThemeSync Component
 * 
 * Este componente ayuda a mantener la coherencia del tema en componentes de portal
 * como SelectContent, PopoverContent, DialogContent, etc. que abren fuera del flujo
 * normal del DOM y pueden perder el contexto del tema.
 */

import { useEffect } from 'react';
import { useTheme } from '@/hooks/use-theme';

/**
 * Componente encargado de sincronizar el tema
 * No renderiza ningún elemento en la interfaz de usuario
 */
export function ThemeSync() {
  const { theme } = useTheme();
  
  useEffect(() => {
    // Función que se ejecuta cuando Radix UI crea un portal
    const handleMutation = (mutations: MutationRecord[]) => {
      for (const mutation of mutations) {
        if (mutation.type === 'childList') {
          // Buscar elementos de portal añadidos
          mutation.addedNodes.forEach((node) => {
            if (node instanceof HTMLElement) {
              // Buscar contenedores de portales de Radix UI
              const popperWrappers = node.querySelectorAll('[data-radix-popper-content-wrapper]');
              const portalNodes = node.querySelectorAll('[role="dialog"], [role="menu"], [role="listbox"]');
              
              // Aplicar el tema actual a wrappers de popper
              popperWrappers.forEach(wrapper => {
                if (wrapper instanceof HTMLElement) {
                  wrapper.dataset.theme = theme;
                }
              });
              
              // Aplicar el tema actual a nodos de portal
              portalNodes.forEach(portal => {
                if (portal instanceof HTMLElement) {
                  portal.dataset.theme = theme;
                }
              });
            }
          });
        }
      }
    };

    // Configurar el observador
    const observer = new MutationObserver(handleMutation);
    
    // Observar cambios en el cuerpo del documento
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    // Limpiar al desmontar
    return () => {
      observer.disconnect();
    };
  }, [theme]);

  // Este componente no renderiza nada visible
  return null;
}