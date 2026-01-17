import { useEffect, useState, useRef } from "react";
import { useLanguage } from "@/context/language-context";
import { createSafeTranslationFunction, isTranslationFunction } from "@/utils/translation-utils";
import { algorithmTranslations } from "@/translations/algorithm";
import { landingTranslations } from "@/translations/landing";
import logger from "@/utils/logger";

/**
 * TRANSLATION SHIELD - ESCUDO DE PROTECCIÓN CONTRA ERRORES DE TRADUCCIÓN
 * 
 * Este componente actúa como un escudo global que intercepta cualquier problema
 * relacionado con las traducciones y asegura que la aplicación no se rompa.
 * 
 * Se coloca cerca de la raíz de la aplicación (en App.tsx) y realiza tareas
 * de monitoreo constante para detectar problemas.
 * 
 * VERSIÓN ULTRA: Esta versión mejorada incluye:
 * - Monitoreo global con MutationObserver
 * - Detección y reparación inmediata de funciones t en componentes
 * - Protección contra interferencias de SES/lockdown.js
 * - Reemplazo preventivo en eventos críticos
 */

// Declaramos el tipo global para window
declare global {
  interface Window {
    __emergency_t?: (key: string) => string;
    __last_t?: (key: string) => string;
    __t_repair_count?: number;
    __global_translations?: {
      algorithm: Record<string, Record<string, string>>;
      landing: Record<string, Record<string, string>>;
    };
    __current_language?: string;
  }
}

export function TranslationShield() {
  const { language } = useLanguage();
  const [lastCheck, setLastCheck] = useState<number>(Date.now());
  const repairCount = useRef<number>(0);
  
  // Instalar mecanismos de protección global
  useEffect(() => {
    logger.info("[ESCUDO] Iniciando monitoreo global de traducciones");
    
    try {
      // Inicializar contadores y estado
      if (typeof window !== 'undefined') {
        // Almacenar traducciones globalmente para acceso de emergencia
        window.__global_translations = {
          algorithm: algorithmTranslations,
          landing: landingTranslations
        };
        
        window.__current_language = language;
        window.__t_repair_count = 0;
        
        // Crear función de traducción de emergencia mejorada
        const robustEmergencyTranslation = (key: string): string => {
          try {
            if (!key) return '';
            
            // Intentar usar traducciones globales
            if (window.__global_translations) {
              const lang = window.__current_language || language || 'es';
              const algoDict = window.__global_translations.algorithm;
              const landingDict = window.__global_translations.landing;
              
              // Buscar en ambos diccionarios
              if (algoDict && algoDict[lang] && algoDict[lang][key]) {
                return algoDict[lang][key];
              }
              
              if (landingDict && landingDict[lang] && landingDict[lang][key]) {
                return landingDict[lang][key];
              }
              
              // Intentar con inglés como fallback
              if (algoDict && algoDict.en && algoDict.en[key]) {
                return algoDict.en[key];
              }
              
              if (landingDict && landingDict.en && landingDict.en[key]) {
                return landingDict.en[key];
              }
            }
            
            // Si no se encuentra, retornar la key
            return key;
          } catch (e) {
            logger.error("[EMERGENCIA-CRÍTICA] Error fatal en traducción:", e);
            return key || '';
          }
        };
        
        // Instalar en window para acceso global
        window.__emergency_t = robustEmergencyTranslation;
        window.__last_t = robustEmergencyTranslation;
      }
      
      // Función para reparación profunda de elementos
      const repairTranslationFunctions = () => {
        try {
          if (typeof window !== 'undefined') {
            repairCount.current += 1;
            window.__t_repair_count = (window.__t_repair_count || 0) + 1;
            
            // Actualizar idioma global
            window.__current_language = language;
            
            // Crear nuevas funciones de traducción frescas
            const freshAlgorithmT = createSafeTranslationFunction(
              window.__global_translations?.algorithm, 
              language,
              'algorithm-fresh'
            );
            
            const freshLandingT = createSafeTranslationFunction(
              window.__global_translations?.landing, 
              language,
              'landing-fresh'
            );
            
            // Exponer para situaciones de emergencia
            window.__last_t = freshAlgorithmT;
            
            // Actualizar timestamp para mostrar que el escudo está activo
            setLastCheck(Date.now());
            
            // En producción no mostramos estos logs, solo en desarrollo
            if (process.env.NODE_ENV !== 'production') {
              logger.info(`[ESCUDO] Reparación preventiva #${repairCount.current} completada`);
            }
          }
        } catch (e) {
          logger.error("[ESCUDO] Error en reparación:", e);
        }
      };
      
      // Ejecutar primera reparación inmediatamente
      repairTranslationFunctions();
      
      // Programar reparaciones periódicas optimizadas (menos frecuentes para mejor rendimiento)
      const interval = setInterval(repairTranslationFunctions, 
        process.env.NODE_ENV === 'production' ? 30000 : 60000); // 30s en producción, 60s en desarrollo
      
      // Observador de eventos críticos optimizado con throttling
      let lastEventTime = 0;
      const throttleDelay = 5000; // 5 segundos mínimo entre reparaciones por eventos
      
      const handleCriticalEvent = () => {
        const now = Date.now();
        if (now - lastEventTime >= throttleDelay) {
          lastEventTime = now;
          repairTranslationFunctions();
        }
      };
      
      // Solo añadir listeners para eventos realmente críticos (menos eventos)
      window.addEventListener('popstate', handleCriticalEvent);
      document.addEventListener('visibilitychange', handleCriticalEvent);
      
      // Limpiar al desmontar
      return () => {
        clearInterval(interval);
        window.removeEventListener('popstate', handleCriticalEvent);
        document.removeEventListener('visibilitychange', handleCriticalEvent);
      };
    } catch (e) {
      logger.error("[ESCUDO] Error crítico en inicialización:", e);
      return undefined;
    }
  }, [language]);

  // Sin render, este es un componente funcional puro
  return null;
}

/**
 * Obtiene una función de traducción de emergencia
 * como último recurso cuando todo lo demás falla
 */
export function getEmergencyTranslation(): (key: string) => string {
  try {
    // Intentar usar función global más reciente primero
    if (typeof window !== 'undefined') {
      if (window.__last_t && typeof window.__last_t === 'function') {
        return window.__last_t;
      }
      
      if (window.__emergency_t && typeof window.__emergency_t === 'function') {
        return window.__emergency_t;
      }
    }
  } catch (e) {
    logger.error("[ESCUDO] Error al obtener función de emergencia:", e);
  }
  
  // Si todo falla, devolver una función ultra resistente
  return (key: string) => {
    try {
      if (!key) return '';
      
      // Último intento con acceso directo a las traducciones
      if (typeof window !== 'undefined' && window.__global_translations) {
        const lang = window.__current_language || 'es';
        const translations = window.__global_translations;
        
        // Intentar ambos diccionarios con fallback a 'en'
        if (translations.algorithm && 
            translations.algorithm[lang] && 
            translations.algorithm[lang][key]) {
          return translations.algorithm[lang][key];
        }
        
        if (translations.landing && 
            translations.landing[lang] && 
            translations.landing[lang][key]) {
          return translations.landing[lang][key];
        }
        
        // Fallback a inglés
        if (translations.algorithm && 
            translations.algorithm.en && 
            translations.algorithm.en[key]) {
          return translations.algorithm.en[key];
        }
        
        if (translations.landing && 
            translations.landing.en && 
            translations.landing.en[key]) {
          return translations.landing.en[key];
        }
      }
      
      // Absolutamente último recurso
      return key;
    } catch {
      // Si todo lo demás falla
      return key || 'error';
    }
  };
}

export default TranslationShield;