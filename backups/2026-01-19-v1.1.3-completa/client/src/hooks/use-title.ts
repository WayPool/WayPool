import { useEffect } from 'react';

/**
 * Hook para establecer el título de la página
 * @param title Título a establecer
 */
export function useTitle(title: string) {
  useEffect(() => {
    document.title = `${title} | Waybank`;
    
    return () => {
      document.title = 'Waybank';
    };
  }, [title]);
}