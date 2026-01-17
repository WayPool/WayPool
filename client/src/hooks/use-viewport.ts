import { useState, useEffect } from 'react';

export type Viewport = 'mobile' | 'tablet' | 'desktop';

interface ViewportState {
  width: number;
  height: number;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  viewport: Viewport;
}

/**
 * Hook para detectar el tamaño de pantalla y tipo de dispositivo
 * Proporciona valores booleanos (isMobile, isTablet, isDesktop)
 * así como las dimensiones exactas (width, height)
 */
export function useViewport(): ViewportState {
  // Establecer valores iniciales en función del entorno
  const initialWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;
  const initialHeight = typeof window !== 'undefined' ? window.innerHeight : 800;
  
  const [state, setState] = useState<ViewportState>(() => {
    const isMobile = initialWidth < 768;
    const isTablet = initialWidth >= 768 && initialWidth < 1024;
    const isDesktop = initialWidth >= 1024;
    
    const viewport: Viewport = isMobile 
      ? 'mobile' 
      : isTablet 
        ? 'tablet' 
        : 'desktop';
    
    return {
      width: initialWidth,
      height: initialHeight,
      isMobile,
      isTablet,
      isDesktop,
      viewport
    };
  });
  
  useEffect(() => {
    // No ejecutar en entorno server-side
    if (typeof window === 'undefined') return;
    
    // Función para actualizar el estado cuando cambia el tamaño de la ventana
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      const isMobile = width < 768;
      const isTablet = width >= 768 && width < 1024;
      const isDesktop = width >= 1024;
      
      const viewport: Viewport = isMobile 
        ? 'mobile' 
        : isTablet 
          ? 'tablet' 
          : 'desktop';
      
      setState({
        width,
        height,
        isMobile,
        isTablet,
        isDesktop,
        viewport
      });
    };
    
    // Suscribirse al evento resize
    window.addEventListener('resize', handleResize);
    
    // Limpiar listener al desmontar
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  return state;
}