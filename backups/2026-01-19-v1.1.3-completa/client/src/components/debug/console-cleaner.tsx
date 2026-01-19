import { useEffect } from 'react';

/**
 * Componente para limpiar logs de consola no deseados en la home
 * Utiliza un enfoque no invasivo que solo suprime mensajes específicos
 * sin afectar la funcionalidad principal de la aplicación
 */
export const ConsoleCleaner = ({ isHomePage = false }: { isHomePage?: boolean }) => {
  useEffect(() => {
    if (!isHomePage || typeof window === 'undefined') return;

    // Guarda las funciones originales de console
    const originalConsoleLog = console.log;
    const originalConsoleWarn = console.warn;
    const originalConsoleError = console.error;
    const originalConsoleDebug = console.debug;

    // Lista de patrones de mensajes a filtrar (solo en la página de inicio)
    const messageFilters = [
      '[ESCUDO] Reparación preventiva',
      '[ESCUDO] Iniciando monitoreo',
      '[SEO] Encabezados encontrados',
      '[SEO] Texto de H1',
      '[Sistema Traducción] createTranslationProxy',
      'Dirección del wallet eliminada',
      'useUserNFTs hook',
      'useManagedNFTs hook',
      'Dashboard - Verificando posiciones',
      'Actualizando automáticamente datos',
      'Updated position markers'
    ];

    // Función para verificar si un mensaje debe ser filtrado
    const shouldFilter = (args: any[]) => {
      if (!args.length) return false;
      
      // Convertir el primer argumento a string de forma segura (puede ser objeto, array, etc.)
      let firstArg = '';
      try {
        if (typeof args[0] === 'string') {
          firstArg = args[0];
        } else if (args[0] === null) {
          firstArg = 'null';
        } else if (args[0] === undefined) {
          firstArg = 'undefined';
        } else if (typeof args[0] === 'object') {
          // Intenta obtener una representación en string segura
          firstArg = String(args[0]);
          if (firstArg === '[object Object]') {
            try {
              // Intenta extraer algunas propiedades clave si es posible
              const keys = Object.keys(args[0]).slice(0, 3);
              firstArg = keys.map(k => k).join(',');
            } catch (e) {
              // Silenciosamente fallback al String básico
            }
          }
        } else {
          firstArg = String(args[0]);
        }
      } catch (error) {
        // Si hay un error al convertir, simplemente ignoramos el filtrado
        return false;
      }

      // Verificar si alguno de los patrones coincide
      return messageFilters.some(pattern => 
        firstArg.includes(pattern)
      );
    };

    // Sobrescribir console.log para la página de inicio
    console.log = function(...args: any[]) {
      if (!shouldFilter(args)) {
        originalConsoleLog.apply(console, args);
      }
    };

    // Sobrescribir console.warn 
    console.warn = function(...args: any[]) {
      if (!shouldFilter(args)) {
        originalConsoleWarn.apply(console, args);
      }
    };

    // Sobrescribir console.error (solo filtramos errores no críticos)
    console.error = function(...args: any[]) {
      if (!shouldFilter(args)) {
        originalConsoleError.apply(console, args);
      }
    };

    // Sobrescribir console.debug
    console.debug = function(...args: any[]) {
      if (!shouldFilter(args)) {
        originalConsoleDebug.apply(console, args);
      }
    };

    // Restaurar las funciones originales al desmontar el componente
    return () => {
      console.log = originalConsoleLog;
      console.warn = originalConsoleWarn;
      console.error = originalConsoleError;
      console.debug = originalConsoleDebug;
    };
  }, [isHomePage]);

  // Este componente no renderiza nada en el DOM
  return null;
};