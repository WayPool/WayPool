import React, { createContext, useContext, useState, useEffect } from 'react';

interface ReferralCodeContextType {
  detectedReferralCode: string | null;
  setDetectedReferralCode: (code: string | null) => void;
  clearDetectedReferralCode: () => void;
}

const ReferralCodeContext = createContext<ReferralCodeContextType | undefined>(undefined);

const STORAGE_KEY = 'waybank_detected_referral_code';

export function ReferralCodeProvider({ children }: { children: React.ReactNode }) {
  const [detectedReferralCode, setDetectedReferralCodeState] = useState<string | null>(() => {
    // Intentar recuperar el código guardado del localStorage al inicializar
    try {
      const savedCode = localStorage.getItem(STORAGE_KEY);
      return savedCode;
    } catch (error) {
      console.error("Error al recuperar código de referido del localStorage:", error);
      return null;
    }
  });

  // Detectar código de referido en la URL al cargar la aplicación
  useEffect(() => {
    // Envolvemos en un setTimeout para no bloquear el renderizado inicial
    const timerId = setTimeout(() => {
      try {
        // Verificamos si window está disponible (esto es crucial en entornos SSR)
        if (typeof window !== 'undefined' && window.location) {
          const params = new URLSearchParams(window.location.search);
          const codeFromUrl = params.get('code');
          
          if (codeFromUrl) {
            console.log("Código de referido detectado en URL global:", codeFromUrl);
            setDetectedReferralCodeState(codeFromUrl);
            
            // Guardar en localStorage para persistencia entre páginas
            // Verificamos si localStorage está disponible
            if (typeof localStorage !== 'undefined') {
              try {
                localStorage.setItem(STORAGE_KEY, codeFromUrl);
              } catch (storageError) {
                // Puede fallar en modo incógnito o si el almacenamiento está lleno
                console.warn("No se pudo guardar en localStorage:", storageError);
              }
            }
          }
        }
      } catch (error) {
        // Capturamos cualquier error y lo registramos, pero no interrumpimos la aplicación
        console.error("Error al detectar código de referido en URL:", error);
      }
    }, 500); // Retraso corto para priorizar el renderizado de la aplicación
    
    // Limpieza al desmontar
    return () => clearTimeout(timerId);
  }, []);

  // Función para establecer el código detectado
  const setDetectedReferralCode = (code: string | null) => {
    setDetectedReferralCodeState(code);
    
    // Actualizar localStorage
    if (code) {
      try {
        localStorage.setItem(STORAGE_KEY, code);
      } catch (error) {
        console.error("Error al guardar código de referido en localStorage:", error);
      }
    } else {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (error) {
        console.error("Error al eliminar código de referido del localStorage:", error);
      }
    }
  };

  // Función para limpiar el código detectado
  const clearDetectedReferralCode = () => {
    setDetectedReferralCodeState(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error("Error al eliminar código de referido del localStorage:", error);
    }
  };

  return (
    <ReferralCodeContext.Provider 
      value={{ 
        detectedReferralCode, 
        setDetectedReferralCode,
        clearDetectedReferralCode 
      }}
    >
      {children}
    </ReferralCodeContext.Provider>
  );
}

export function useReferralCode() {
  const context = useContext(ReferralCodeContext);
  if (context === undefined) {
    throw new Error('useReferralCode debe usarse dentro de un ReferralCodeProvider');
  }
  return context;
}