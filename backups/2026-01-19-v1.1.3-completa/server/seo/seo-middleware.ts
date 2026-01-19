/**
 * Middleware SEO para Express
 * 
 * Este middleware intercepta solicitudes de motores de búsqueda a páginas públicas
 * y devuelve versiones pre-renderizadas optimizadas para SEO sin tocar la aplicación.
 */

import { Request, Response, NextFunction } from 'express';
import { isSearchEngineBot, isPublicPage, needsSeoRendering } from './crawler-detection';
import { seoRenderer } from './html-renderer';
import { log } from '../vite';
import { APP_NAME } from './app-config';

/**
 * Opciones para el middleware SEO
 */
export interface SeoMiddlewareOptions {
  /** Si es true, el middleware registrará todas las solicitudes */
  debug?: boolean;
  /** URLs a excluir del renderizado SEO */
  excludePaths?: string[];
  /** Headers personalizados para añadir a las respuestas SEO */
  customHeaders?: Record<string, string>;
}

/**
 * Crea un middleware Express para optimización SEO sin alterar el código existente
 * @param options - Opciones de configuración
 * @returns Middleware Express
 */
export function createSeoMiddleware(options: SeoMiddlewareOptions = {}) {
  const {
    debug = false,
    excludePaths = ['/api', '/dashboard', '/admin', '/assets', '/_next'],
    customHeaders = {
      'X-Robots-Tag': 'index, follow',
      'X-Content-Type-Options': 'nosniff'
    }
  } = options;
  
  return async function seoMiddleware(req: Request, res: Response, next: NextFunction) {
    // Obtener ruta y user agent
    const url = req.path;
    const userAgent = req.get('user-agent') || '';
    
    // Comprobar si la ruta está excluida
    const isExcluded = excludePaths.some(prefix => url.startsWith(prefix));
    if (isExcluded) {
      return next();
    }
    
    // Verificar si es un bot y si la página necesita renderizado SEO
    const isCrawler = isSearchEngineBot(userAgent);
    const isPublic = isPublicPage(url);
    
    if (debug) {
      log(`[SEO] Request: ${url} - Bot: ${isCrawler} - Public: ${isPublic}`);
    }
    
    // Si no es un bot o no es una página pública, continuar con la cadena de middleware
    if (!needsSeoRendering(url, userAgent)) {
      return next();
    }
    
    // Es un bot y una página pública, realizar renderizado SEO
    try {
      log(`[SEO] Bot detected at ${url}: ${userAgent}`);
      
      // Renderizar la página
      const html = await seoRenderer.renderPage(url);
      
      // Si no se pudo renderizar, continuar con la cadena normal
      if (!html) {
        log(`[SEO] Failed to render ${url}, falling back to normal rendering`);
        return next();
      }
      
      // Añadir headers personalizados
      Object.entries(customHeaders).forEach(([key, value]) => {
        res.setHeader(key, value);
      });
      
      // Añadir header para identificar que la respuesta proviene del middleware SEO
      res.setHeader('X-SEO-Middleware', `${APP_NAME}-SEO-Render`);
      
      // Enviar la respuesta pre-renderizada
      res.send(html);
      
      log(`[SEO] Successfully served pre-rendered page for ${url}`);
    } catch (error) {
      log(`[SEO] Error in SEO middleware for ${url}: ${error}`);
      // En caso de error, continuamos con la cadena normal
      next();
    }
  };
}

// Exportar middleware pre-configurado para usar directamente
export const seoMiddleware = createSeoMiddleware();