import { Language } from "@/context/language-context";
import { APP_NAME } from "@/utils/app-config";

/**
 * SISTEMA CENTRALIZADO Y ULTRA-ROBUSTO DE TRADUCCIÓN
 * Esta versión mejorada soluciona el problema crítico de "t is not a function"
 * al garantizar consistencia en cómo se accede a las traducciones en toda la aplicación.
 */

/**
 * Procesa una cadena de texto para reemplazar variables como ${APP_NAME}
 * @param text El texto a procesar
 * @returns Texto con las variables reemplazadas
 */
export function processTranslationVariables(text: string): string {
  if (!text || typeof text !== 'string') return text;
  
  try {
    // Reemplazar ${APP_NAME} con el valor real
    return text.replace(/\${APP_NAME}/g, APP_NAME);
  } catch (error) {
    console.error('[Sistema Traducción] Error al procesar variables:', error);
    return text;
  }
}

/**
 * Función que obtiene un valor de traducción de un objeto, con múltiples capas de fallback
 * para garantizar que nunca devuelva undefined o lance errores.
 * 
 * @param translations Objeto con las traducciones de todos los idiomas
 * @param language Idioma actual
 * @param key Clave de la traducción
 * @param fallbackLanguages Lista ordenada de idiomas de fallback (por defecto: ['en', 'es'])
 * @returns El valor traducido o la propia key como último recurso
 */
export function getTranslatedValue<T extends Record<string, any>>(
  translations: Record<string, T> | null | undefined,
  language: string,
  key: string,
  fallbackLanguages: string[] = ['en', 'es']
): string {
  // Verificación de seguridad extrema
  if (!translations || typeof translations !== 'object') {
    console.warn('[Sistema Traducción] Objeto de traducciones inválido:', translations);
    return key;
  }
  
  if (!language || typeof language !== 'string') {
    console.warn('[Sistema Traducción] Idioma inválido:', language);
    language = 'en';
  }
  
  if (!key || typeof key !== 'string') {
    console.warn('[Sistema Traducción] Clave inválida');
    return '';
  }
  
  try {
    // Intentar obtener la traducción en el idioma actual
    if (translations[language] && 
        typeof translations[language] === 'object' && 
        translations[language][key] !== undefined &&
        typeof translations[language][key] === 'string' &&
        translations[language][key].trim() !== '') {
      // Procesar variables como ${APP_NAME} antes de devolver la traducción
      return processTranslationVariables(translations[language][key]);
    }
    
    // Intentar con cada idioma de fallback en orden
    for (const fallbackLang of fallbackLanguages) {
      if (translations[fallbackLang] && 
          typeof translations[fallbackLang] === 'object' && 
          translations[fallbackLang][key] !== undefined &&
          typeof translations[fallbackLang][key] === 'string' &&
          translations[fallbackLang][key].trim() !== '') {
        // Procesar variables como ${APP_NAME} antes de devolver la traducción
        return processTranslationVariables(translations[fallbackLang][key]);
      }
    }
    
    // Último recurso: devolver la clave
    return key;
  } catch (error) {
    console.error('[Sistema Traducción] Error al obtener traducción:', error);
    return key;
  }
}

/**
 * Crea una función de traducción segura que nunca fallará, incluso en condiciones adversas.
 * Esta es la solución al problema de "t is not a function" porque garantiza que SIEMPRE
 * devuelve una función, incluso si el contexto cambia, los objetos están vacíos, etc.
 * 
 * @param translations Objeto con las traducciones de todos los idiomas
 * @param language Idioma actual
 * @param namespace Espacio de nombres opcional para debugging
 * @returns Función de traducción segura que SIEMPRE devuelve un string y nunca falla
 */
export function createSafeTranslationFunction(
  translations: Record<string, Record<string, string>> | null | undefined,
  language: string,
  namespace: string = 'default'
): (key: string) => string {
  // Crear una función de traducción que captura su propio contexto
  // y no depende de variables externas que pueden cambiar
  const translationFn = function(key: string): string {
    try {
      // Verificar que la función se está llamando correctamente
      if (!key || typeof key !== 'string') {
        console.warn(`[Sistema Traducción:${namespace}] Clave inválida:`, key);
        return '';
      }
      
      // Usar la implementación robusta para obtener el valor
      return getTranslatedValue(
        translations, 
        language, 
        key, 
        ['en', 'es']
      );
    } catch (e) {
      // Capturar cualquier error inesperado
      console.error(`[Sistema Traducción:${namespace}] Error crítico:`, e);
      return key || '';
    }
  };
  
  // Importante: para depuración, añadir propiedades a la función
  Object.defineProperties(translationFn, {
    toString: {
      value: () => `[SafeTranslationFunction:${namespace}:${language}]`,
      writable: false
    },
    _namespace: {
      value: namespace,
      writable: false
    },
    _language: {
      value: language,
      writable: false
    }
  });
  
  return translationFn;
}

/**
 * Esta función verifica si algo es realmente una función de traducción.
 * Útil para comprobaciones defensivas en componentes.
 */
export function isTranslationFunction(value: any): value is (key: string) => string {
  return typeof value === 'function' && value.length === 1;
}

/**
 * Función ultra-segura para traducir textos en JSX.
 * Esta función SIEMPRE devolverá un string, incluso si todas las demás
 * capas de protección fallan.
 * 
 * @param t Función de traducción original o null/undefined
 * @param key Clave de traducción
 * @param translations Objeto de traducciones para usar como fallback
 * @param language Idioma actual
 * @returns El texto traducido o la clave como último recurso
 */
export function safeT(
  t: ((key: string) => string) | null | undefined,
  key: string,
  translations?: Record<string, Record<string, string>> | null,
  language?: string
): string {
  try {
    // Primer intento: Usar la función t directamente si es válida
    if (typeof t === 'function') {
      try {
        const result = t(key);
        if (typeof result === 'string' && result.trim() !== '') {
          return processTranslationVariables(result);
        }
      } catch (e) {
        console.warn('[SafeT] Error usando función t:', e);
      }
    }
    
    // Segundo intento: Usar la función global de respaldo
    if (typeof window !== 'undefined' && 
        typeof (window as any).__safeTFunction === 'function') {
      try {
        const result = (window as any).__safeTFunction(key);
        if (typeof result === 'string' && result.trim() !== '') {
          return processTranslationVariables(result);
        }
      } catch (e) {
        console.warn('[SafeT] Error usando función global:', e);
      }
    }
    
    // Tercer intento: Acceder directamente a las traducciones
    if (translations && language) {
      try {
        return getTranslatedValue(translations, language, key);
      } catch (e) {
        console.warn('[SafeT] Error accediendo directamente:', e);
      }
    }
    
    // Cuarto intento: Acceder a las traducciones globales
    if (typeof window !== 'undefined') {
      const globalTranslations = (window as any).__global_translations?.landing || {};
      const globalLanguage = (window as any).__current_language || 'en';
      
      try {
        if (globalTranslations[globalLanguage]?.[key]) {
          return processTranslationVariables(globalTranslations[globalLanguage][key]);
        }
        if (globalTranslations['en']?.[key]) {
          return processTranslationVariables(globalTranslations['en'][key]);
        }
      } catch (e) {
        console.warn('[SafeT] Error accediendo a traducciones globales:', e);
      }
    }
    
    // Último recurso: devolver la clave
    return key;
  } catch (error) {
    // Capturar cualquier error inesperado
    console.error('[SafeT] Error crítico:', error);
    return key || '';
  }
}

/**
 * Opción legada para compatibilidad
 * @deprecated Usar createSafeTranslationFunction en su lugar
 */
export function createTranslationProxy<T extends Record<string, any>>(
  translations: Record<Language, T>,
  language: Language,
  fallbackLanguage: Language = 'en'
): T {
  console.warn('[Sistema Traducción] createTranslationProxy está deprecado, usar createSafeTranslationFunction');
  
  // Crear objeto vacío del tipo T para usarlo como base del proxy
  const baseObj = {} as T;
  
  // Crear proxy para acceso a traducciones con fallback automático
  return new Proxy(baseObj, {
    get: (target, prop) => {
      if (typeof prop !== 'string') return undefined;
      
      // Usar la implementación robusta para obtener el valor
      return getTranslatedValue(
        translations as any, 
        language, 
        prop, 
        ['en', fallbackLanguage]
      );
    }
  });
}