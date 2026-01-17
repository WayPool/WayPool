import React, { createContext, useState, useContext, ReactNode, useEffect, useMemo } from "react";
import { createSafeTranslationFunction } from "@/utils/translation-utils";
import { useQuery } from "@tanstack/react-query";
import { useWallet } from "@/hooks/use-wallet";
import { apiRequest } from "@/lib/queryClient";

/**
 * CONTEXT DE IDIOMA ULTRA-PROTEGIDO
 * Implementamos mecanismos de seguridad adicionales para evitar problemas
 * de "t is not a function" y otros errores relacionados con el cambio de idioma.
 * Ahora también con persistencia en la base de datos para usuarios autenticados.
 */

export type Language = 
  | "es" // Español
  | "en" // Inglés
  | "ar" // Árabe
  | "pt" // Portugués
  | "it" // Italiano
  | "fr" // Francés
  | "de" // Alemán
  | "hi" // Hindi
  | "zh" // Chino Mandarín
  | "ru" // Ruso
;

// Nombres de los idiomas para mostrar en el selector
export const languageNames: Record<Language, string> = {
  es: "Español",
  en: "English",
  ar: "العربية",
  pt: "Português",
  it: "Italiano",
  fr: "Français",
  de: "Deutsch",
  hi: "हिन्दी",
  zh: "中文",
  ru: "Русский"
};

// Dirección del texto para cada idioma (RTL para árabe)
export const getTextDirection = (lang: Language): "ltr" | "rtl" => {
  try {
    // Protección adicional para garantizar un valor válido
    return lang === "ar" ? "rtl" : "ltr";
  } catch (e) {
    console.error("[PROTECCIÓN-UI] Error en getTextDirection:", e);
    return "ltr"; // Valor seguro por defecto
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  direction: "ltr" | "rtl";
  // Propiedades adicionales de seguridad para diagnóstico
  __debug_lastLanguageChange?: number;
}

const defaultContext: LanguageContextType = {
  language: "en",
  setLanguage: () => {},
  direction: "ltr",
  __debug_lastLanguageChange: Date.now()
};

export const LanguageContext = createContext<LanguageContextType>(defaultContext);

// Hook mejorado con protecciones adicionales
export const useLanguage = () => {
  try {
    const context = useContext(LanguageContext);
    
    // Verificar que el contexto sea válido y tenga las propiedades esperadas
    if (!context || typeof context.language !== 'string' || !context.setLanguage) {
      console.error("[PROTECCIÓN-UI] Contexto de idioma inválido:", context);
      return defaultContext; // Devolver un valor seguro por defecto
    }
    
    return context;
  } catch (e) {
    console.error("[PROTECCIÓN-UI] Error al usar el contexto de idioma:", e);
    return defaultContext; // Devolver un valor seguro por defecto
  }
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const { address } = useWallet();
  
  // Detecta el idioma del navegador con protecciones adicionales
  const detectBrowserLanguage = (): Language => {
    try {
      if (typeof window !== "undefined" && navigator && navigator.language) {
        const browserLang = navigator.language.split("-")[0];
        return (Object.keys(languageNames).includes(browserLang) 
          ? browserLang 
          : "en") as Language;
      }
    } catch (e) {
      console.error("[PROTECCIÓN-UI] Error al detectar idioma del navegador:", e);
    }
    return "en"; // Valor seguro por defecto
  };
  
  // Estado inicial del idioma (se actualizará después según localStorage o DB)
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      // En el lado del cliente
      if (typeof window !== "undefined" && localStorage) {
        try {
          // Verificar ambas claves para compatibilidad entre los contextos
          const savedLanguage = localStorage.getItem("language") as Language;
          const waybankSavedLanguage = localStorage.getItem("waybank_language") as Language;
          
          // Primero verificar la clave principal de este contexto
          if (savedLanguage && Object.keys(languageNames).includes(savedLanguage)) {
            return savedLanguage;
          } 
          // Luego verificar la clave del otro contexto
          else if (waybankSavedLanguage && Object.keys(languageNames).includes(waybankSavedLanguage)) {
            // Sincronizar las claves
            try {
              localStorage.setItem("language", waybankSavedLanguage);
            } catch (e) {
              console.warn("[PROTECCIÓN-UI] No se pudo sincronizar el idioma en localStorage:", e);
            }
            return waybankSavedLanguage;
          }
        } catch (e) {
          console.warn("[PROTECCIÓN-UI] Error al acceder a localStorage:", e);
        }
        
        return detectBrowserLanguage();
      }
    } catch (e) {
      console.error("[PROTECCIÓN-UI] Error crítico en inicialización de idioma:", e);
    }
    
    // En el lado del servidor (SSR) o si hay errores
    return "en";
  });
  
  // Consulta la configuración de idioma del usuario desde la API si está autenticado
  const { data: userSettings } = useQuery<{
    language?: string;
    theme?: string;
    walletDisplay?: string;
    defaultNetwork?: string;
  }>({
    queryKey: ['/api/user/settings'],
    enabled: !!address, // Solo ejecutar si el usuario está autenticado
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
  
  // Variable para controlar si ya cargamos el idioma inicial de la BD
  const [initialLanguageLoaded, setInitialLanguageLoaded] = useState(false);
  
  // Efecto para aplicar el idioma desde la configuración del usuario SOLO AL INICIO
  useEffect(() => {
    if (!initialLanguageLoaded && userSettings?.language && 
        Object.keys(languageNames).includes(userSettings.language as Language)) {
      // Actualizar el idioma si viene de la base de datos y es válido
      const dbLanguage = userSettings.language as Language;
      console.log("[SISTEMA-IDIOMA] Idioma cargado desde la base de datos (inicialización):", dbLanguage);
      
      // Solo actualizar si es diferente al actual
      if (dbLanguage !== language) {
        setLanguageState(dbLanguage);
        
        // Actualizar localStorage para mantener sincronización
        try {
          localStorage.setItem("language", dbLanguage);
          localStorage.setItem("waybank_language", dbLanguage);
        } catch (e) {
          console.warn("[PROTECCIÓN-UI] No se pudo sincronizar el idioma en localStorage:", e);
        }
      }
      
      // Marcar que ya cargamos el idioma inicial
      setInitialLanguageLoaded(true);
    }
  }, [userSettings, initialLanguageLoaded, language]);

  // Timestamp del último cambio de idioma (para debugging)
  const [lastLanguageChange, setLastLanguageChange] = useState<number>(Date.now());

  // Calcula la dirección del texto basada en el idioma (memoizado para estabilidad)
  const direction = useMemo(() => getTextDirection(language), [language]);

  // Función para guardar el idioma en la base de datos
  const saveLanguageToDatabase = async (newLanguage: Language) => {
    if (!address) return; // Solo guardar si el usuario está autenticado
    
    try {
      console.log("[SISTEMA-IDIOMA] Guardando idioma en base de datos:", newLanguage);
      
      // Llamar a la API para actualizar la configuración del usuario
      const response = await apiRequest("POST", "/api/user/settings", {
        language: newLanguage
      });
      
      if (response.ok) {
        console.log("[SISTEMA-IDIOMA] Idioma guardado correctamente en la base de datos");
      } else {
        console.warn("[SISTEMA-IDIOMA] Error al guardar idioma en la base de datos:", response.status);
      }
    } catch (error) {
      console.error("[SISTEMA-IDIOMA] Error al guardar idioma en la base de datos:", error);
    }
  };

  // Actualiza el idioma y lo guarda en localStorage y base de datos con protecciones adicionales
  const setLanguage = (newLanguage: Language) => {
    try {
      // Validar que sea un idioma soportado
      if (!Object.keys(languageNames).includes(newLanguage)) {
        console.warn("[PROTECCIÓN-UI] Intento de establecer idioma no soportado:", newLanguage);
        newLanguage = "en"; // Valor seguro por defecto
      }
      
      // Actualizar estado
      setLanguageState(newLanguage);
      setLastLanguageChange(Date.now());
      
      // Actualizar localStorage con manejo de errores
      try {
        // Actualizar ambas claves para mantener sincronizados los contextos
        localStorage.setItem("language", newLanguage);
        localStorage.setItem("waybank_language", newLanguage);
      } catch (e) {
        console.warn("[PROTECCIÓN-UI] No se pudo guardar el idioma en localStorage:", e);
      }
      
      // Actualizar atributos HTML con manejo de errores
      try {
        // Actualiza el atributo dir en el elemento html para el soporte RTL
        document.documentElement.dir = getTextDirection(newLanguage);
        
        // Actualiza el atributo lang en el elemento html
        document.documentElement.lang = newLanguage;
      } catch (e) {
        console.warn("[PROTECCIÓN-UI] No se pudieron actualizar atributos HTML:", e);
      }
      
      // Guardar en la base de datos si el usuario está autenticado
      if (address) {
        saveLanguageToDatabase(newLanguage);
      }
      
      console.log("[SISTEMA-IDIOMA] Idioma cambiado a:", newLanguage);
    } catch (e) {
      console.error("[PROTECCIÓN-UI] Error crítico al cambiar idioma:", e);
    }
  };

  // Efecto para establecer los atributos dir y lang en el elemento html al cargar
  useEffect(() => {
    try {
      document.documentElement.dir = direction;
      document.documentElement.lang = language;
    } catch (e) {
      console.warn("[PROTECCIÓN-UI] Error al establecer atributos HTML:", e);
    }
  }, [direction, language]);

  // Valor del contexto memoizado para estabilidad
  const contextValue = useMemo(() => ({
    language,
    setLanguage,
    direction,
    __debug_lastLanguageChange: lastLanguageChange
  }), [language, direction, lastLanguageChange]);

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
};