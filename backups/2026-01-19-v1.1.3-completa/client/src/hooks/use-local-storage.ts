import { useState, useEffect } from 'react';

/**
 * Hook personalizado para usar localStorage de forma segura
 * @param key Clave en localStorage
 * @param initialValue Valor inicial si no existe la clave
 * @returns Estado y setter para el valor en localStorage
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] {
  // Estado para almacenar nuestro valor
  // Pasa la función de inicialización a useState para que la lógica se ejecute solo una vez
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    try {
      // Obtener del localStorage por clave
      const item = window.localStorage.getItem(key);
      // Analizar el JSON almacenado o devolver el valor inicial
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // Si hay un error, devolver el valor inicial
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Devolver una versión en memoria del valor de localStorage actualizado
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Permitir que el valor sea una función para que tengamos la misma API que useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      // Guardar el estado
      setStoredValue(valueToStore);
      // Guardar en localStorage
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      // El almacenamiento puede fallar si la cuota se supera o los permisos no lo permiten
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  // Escuchar los cambios en otros contextos de ventana/iframes
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue) {
        try {
          setStoredValue(JSON.parse(e.newValue));
        } catch (error) {
          console.error(`Error parsing localStorage change for key "${key}":`, error);
        }
      }
    };

    // Registrar el evento de cambio de almacenamiento para sincronizar entre pestañas/ventanas
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [key]);

  return [storedValue, setValue];
}