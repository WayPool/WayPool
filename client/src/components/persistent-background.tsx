/**
 * PersistentBackground
 * 
 * Este componente crea un fondo persistente de la página, asegurando que
 * aunque los portales afecten al tema, siempre haya un elemento con el
 * color de fondo correcto que cubra toda la página.
 */

import { useEffect, useState } from 'react';
import { useTheme } from '@/hooks/use-theme';

export function PersistentBackground() {
  const { theme } = useTheme();
  const [isDark, setIsDark] = useState<boolean>(
    theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
  );
  
  useEffect(() => {
    // Determinar si el tema actual es oscuro
    const checkDark = () => {
      if (theme === 'system') {
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
      }
      return theme === 'dark';
    };
    
    setIsDark(checkDark());
    
    // Observer para cambios en el tema del sistema
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleMediaChange = () => {
      if (theme === 'system') {
        setIsDark(mediaQuery.matches);
      }
    };
    
    mediaQuery.addEventListener('change', handleMediaChange);
    
    return () => {
      mediaQuery.removeEventListener('change', handleMediaChange);
    };
  }, [theme]);
  
  // Crear los elementos de fondo
  useEffect(() => {
    // Crear un div de fondo fijo
    const backdrop = document.createElement('div');
    backdrop.id = 'persistent-backdrop';
    backdrop.style.position = 'fixed';
    backdrop.style.top = '0';
    backdrop.style.left = '0';
    backdrop.style.width = '100vw';
    backdrop.style.height = '100vh';
    backdrop.style.zIndex = '-9999';
    backdrop.style.pointerEvents = 'none';
    backdrop.style.transition = 'background-color 0.2s ease';
    backdrop.style.backgroundColor = isDark 
      ? 'rgb(9, 14, 33)' // Color oscuro
      : '#ffffff';       // Color claro
    
    // Añadir el backdrop al body
    document.body.insertBefore(backdrop, document.body.firstChild);
    
    return () => {
      if (document.getElementById('persistent-backdrop')) {
        document.body.removeChild(backdrop);
      }
    };
  }, [isDark]);
  
  // También añadir una protección para las clases de temas en el HTML
  useEffect(() => {
    const htmlElement = document.documentElement;
    
    // Asegurar que html tenga siempre el tema correcto
    const ensureThemeClass = () => {
      if (isDark) {
        htmlElement.classList.add('dark');
        htmlElement.classList.remove('light');
      } else {
        htmlElement.classList.add('light');
        htmlElement.classList.remove('dark');
      }
    };
    
    // Primera ejecución
    ensureThemeClass();
    
    // Monitorear cambios en el elemento HTML
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          const hasDark = htmlElement.classList.contains('dark');
          const hasLight = htmlElement.classList.contains('light');
          
          // Si no tiene ninguna clase de tema o tiene la incorrecta
          if ((isDark && !hasDark) || (!isDark && !hasLight) || (isDark && hasLight) || (!isDark && hasDark)) {
            ensureThemeClass();
          }
        }
      });
    });
    
    observer.observe(htmlElement, { attributes: true });
    
    // También ejecutar periódicamente para asegurar consistencia
    const intervalId = setInterval(ensureThemeClass, 100);
    
    return () => {
      observer.disconnect();
      clearInterval(intervalId);
    };
  }, [isDark]);
  
  return null;
}