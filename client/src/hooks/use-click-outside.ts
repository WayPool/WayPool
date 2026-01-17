import { useEffect, RefObject } from 'react';

/**
 * Hook que detecta clics fuera de un elemento referenciado
 * @param ref Referencia al elemento DOM que se quiere monitorear
 * @param handler Función que se ejecutará cuando se haga clic fuera del elemento
 */
export function useOnClickOutside<T extends HTMLElement = HTMLElement>(
  ref: RefObject<T>,
  handler: (event: MouseEvent | TouchEvent) => void
): void {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      // No hacer nada si se hizo clic en el elemento ref o sus descendientes
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }
      
      handler(event);
    };
    
    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);
    
    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
}