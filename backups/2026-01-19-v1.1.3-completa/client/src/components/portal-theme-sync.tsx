/**
 * PortalThemeSync
 * 
 * Este componente se encarga de sincronizar el tema entre el documento principal
 * y los portales creados por componentes como Select, Popover y DropdownMenu.
 */

import { useEffect } from 'react';
import { useTheme } from '@/hooks/use-theme';

export function PortalThemeSync() {
  const { theme } = useTheme();
  
  useEffect(() => {
    // Determinar si está en modo oscuro
    const isDarkMode = () => {
      if (theme === 'system') {
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
      }
      return theme === 'dark';
    };
    
    // Función para sincronizar el tema con portales
    const synchronizeTheme = () => {
      const isDark = isDarkMode();
      const themeClass = isDark ? 'dark' : 'light';
      
      // Aplicar a portales
      document.querySelectorAll('[data-radix-portal]').forEach(portal => {
        // Remover clases de tema
        portal.classList.remove('dark', 'light');
        // Añadir la clase correcta
        portal.classList.add(themeClass);
        // Establecer el atributo data-theme
        portal.setAttribute('data-theme', themeClass);
        
        // También aplicar a todos los elementos hijos
        portal.querySelectorAll('*').forEach(element => {
          element.setAttribute('data-theme', themeClass);
        });
      });
      
      // Aplicar a wrappers de contenido
      document.querySelectorAll('[data-radix-popper-content-wrapper]').forEach(wrapper => {
        // Remover clases de tema
        wrapper.classList.remove('dark', 'light');
        // Añadir la clase correcta
        wrapper.classList.add(themeClass);
        // Establecer el atributo data-theme
        wrapper.setAttribute('data-theme', themeClass);
        
        // También aplicar a todos los elementos hijos (esencial para dropdowns)
        wrapper.querySelectorAll('*').forEach(element => {
          element.setAttribute('data-theme', themeClass);
        });
      });
    };
    
    // Sincronizar tema inicialmente y cuando cambie
    synchronizeTheme();
    
    // Observer para detectar nuevos portales
    const portalObserver = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.addedNodes.length > 0) {
          synchronizeTheme();
        }
      });
    });
    
    // Observer para detectar cambios en el tema
    const themeObserver = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          synchronizeTheme();
        }
      });
    });
    
    // Iniciar observers
    portalObserver.observe(document.body, { 
      childList: true, 
      subtree: true 
    });
    
    themeObserver.observe(document.documentElement, { 
      attributes: true 
    });
    
    // También ejecutar periódicamente para asegurar sincronización
    const intervalId = setInterval(synchronizeTheme, 100);
    
    // Limpiar al desmontar
    return () => {
      portalObserver.disconnect();
      themeObserver.disconnect();
      clearInterval(intervalId);
    };
  }, [theme]);
  
  return null;
}