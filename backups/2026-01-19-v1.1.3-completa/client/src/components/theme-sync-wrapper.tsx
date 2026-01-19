/**
 * ThemeSyncWrapper
 * 
 * Componente que sincroniza el tema entre el documento principal y los portales de Radix UI.
 * Esta es una solución integral al problema del fondo negro al abrir selectores y dropdowns.
 */

import { useEffect } from 'react';

export function ThemeSyncWrapper() {
  useEffect(() => {
    const syncThemeToPortals = () => {
      // Obtener el tema actual del documento
      const htmlElement = document.documentElement;
      const isDark = htmlElement.classList.contains('dark');
      const currentTheme = isDark ? 'dark' : 'light';
      
      // 1. Aplicar tema a los portales de Radix
      const radixPortals = document.querySelectorAll('[data-radix-portal]');
      radixPortals.forEach(portal => {
        // Asegurar que el portal tenga la clase correcta
        if (currentTheme === 'dark') {
          portal.classList.add('dark');
          portal.classList.remove('light');
        } else {
          portal.classList.add('light');
          portal.classList.remove('dark');
        }
        
        // Aplicar tema a través de data-theme
        portal.setAttribute('data-theme', currentTheme);
      });
      
      // 2. Aplicar tema a wrappers de Popper
      const popperWrappers = document.querySelectorAll('[data-radix-popper-content-wrapper]');
      popperWrappers.forEach(wrapper => {
        if (currentTheme === 'dark') {
          wrapper.classList.add('dark');
          wrapper.classList.remove('light');
        } else {
          wrapper.classList.add('light');
          wrapper.classList.remove('dark');
        }
        
        wrapper.setAttribute('data-theme', currentTheme);
        
        // Aplicar tema a elementos hijos
        const children = wrapper.querySelectorAll('*');
        children.forEach(child => {
          child.setAttribute('data-theme', currentTheme);
        });
      });
    };
    
    // Observer para detectar cuando se añaden portales al DOM
    const bodyObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.addedNodes.length > 0) {
          // Si se añaden nodos, verificar si son portales y sincronizar
          const newPortals = Array.from(mutation.addedNodes).filter(
            node => 
              node.nodeType === Node.ELEMENT_NODE && 
              ((node as Element).hasAttribute('data-radix-portal') || 
               (node as Element).hasAttribute('data-radix-popper-content-wrapper'))
          );
          
          if (newPortals.length > 0) {
            syncThemeToPortals();
          }
        }
      });
    });
    
    // Observer para detectar cambios en el tema del documento
    const themeObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          syncThemeToPortals();
        }
      });
    });
    
    // Iniciar los observers
    bodyObserver.observe(document.body, { childList: true, subtree: true });
    themeObserver.observe(document.documentElement, { attributes: true });
    
    // Ejecutar la sincronización inicial
    syncThemeToPortals();
    
    // También ejecutar periódicamente por si acaso se pierde la sincronización
    const intervalId = setInterval(syncThemeToPortals, 200);
    
    return () => {
      bodyObserver.disconnect();
      themeObserver.disconnect();
      clearInterval(intervalId);
    };
  }, []);
  
  return null;
}