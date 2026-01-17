/**
 * ThemeGuard
 * 
 * Este componente protege la aplicación contra cambios inesperados en el tema
 * al interactuar con componentes que usan portales (Radix UI).
 * 
 * El problema: Al abrir selectores o dropdowns, la página entera cambia a negro.
 * La solución: Guardar el estado del tema actual y restaurarlo si cambia inesperadamente.
 */

import { useEffect, useState } from 'react';

export function ThemeGuard() {
  // Almacenar el tema actual
  const [currentTheme, setCurrentTheme] = useState<string | null>(null);
  
  useEffect(() => {
    // Capturar el tema inicial cuando el componente se monta
    const htmlElement = document.documentElement;
    const isDark = htmlElement.classList.contains('dark');
    const initialTheme = isDark ? 'dark' : 'light';
    setCurrentTheme(initialTheme);
    
    // Función para monitorear y corregir cambios inesperados en el tema
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          const htmlElement = document.documentElement;
          const hasDarkClass = htmlElement.classList.contains('dark');
          const hasLightClass = htmlElement.classList.contains('light');
          
          // Si no tiene ninguna clase de tema, restaurar el tema anterior
          if (!hasDarkClass && !hasLightClass && currentTheme) {
            console.log('[ThemeGuard] Restaurando tema a:', currentTheme);
            htmlElement.classList.add(currentTheme);
          } 
          // Si tiene una clase de tema, actualizar nuestro registro
          else if (hasDarkClass && currentTheme !== 'dark') {
            console.log('[ThemeGuard] Tema cambió a: dark');
            setCurrentTheme('dark');
          } 
          else if (hasLightClass && currentTheme !== 'light') {
            console.log('[ThemeGuard] Tema cambió a: light');
            setCurrentTheme('light');
          }
        }
      });
    });
    
    // Observar cambios en el atributo class del elemento html
    observer.observe(htmlElement, { attributes: true });

    // Añadir a protección adicional que restaura el tema cada 100ms
    const intervalId = setInterval(() => {
      const htmlElement = document.documentElement;
      const hasDarkClass = htmlElement.classList.contains('dark');
      const hasLightClass = htmlElement.classList.contains('light');
      
      // Si ambas clases están ausentes y tenemos un tema guardado
      if (!hasDarkClass && !hasLightClass && currentTheme) {
        console.log('[ThemeGuard] Restaurando tema (intervalo):', currentTheme);
        htmlElement.classList.add(currentTheme);
      }
    }, 100);
    
    // Limpiar el observer y el intervalo cuando el componente se desmonta
    return () => {
      observer.disconnect();
      clearInterval(intervalId);
    };
  }, [currentTheme]);

  // Este componente no renderiza ningún elemento visible
  return null;
}