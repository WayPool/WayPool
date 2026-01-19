/**
 * Middleware para mejorar el SEO de la aplicación
 * 
 * Este middleware se encarga de:
 * 1. Generar y mantener actualizado el sitemap.xml
 * 2. Servir las etiquetas meta para los crawlers
 * 3. Optimizar el contenido para los motores de búsqueda
 */

import { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import { isCrawler, getCrawlerType, shouldRedirectCrawler } from './seo/crawler-detection';
import { CANONICAL_DOMAIN, CANONICAL_BASE_URL, isOldDomain, replaceAppName } from './seo/app-config';

/**
 * Middleware para mejorar el SEO de la aplicación
 */
export function seoMiddleware(req: Request, res: Response, next: NextFunction) {
  // Extraer información de la solicitud
  const userAgent = req.headers['user-agent'] || '';
  const host = req.headers.host || '';
  const url = req.url;
  const fullUrl = `https://${host}${url}`;

  // Skip SEO middleware for API routes - they should not have SEO headers
  if (url.startsWith('/api/') || url.startsWith('/api')) {
    return next();
  }
  
  // Detectar si es un crawler
  const isCrawlerRequest = isCrawler(userAgent || '');
  const crawlerType = getCrawlerType(userAgent || '');
  
  // Agregar información para logs y depuración
  console.log(`[SEO] User agent: ${userAgent}`);
  console.log(`[SEO] Is crawler: ${isCrawlerRequest}, type: ${crawlerType}`);
  
  // Redirigir si es un dominio antiguo y es un crawler que debe ser redirigido
  if (isOldDomain(host) && (isCrawlerRequest && shouldRedirectCrawler(crawlerType))) {
    const canonicalUrl = `${CANONICAL_BASE_URL}${url}`;
    console.log(`[SEO] Redirecting crawler from ${fullUrl} to ${canonicalUrl}`);
    res.redirect(301, canonicalUrl);
    return;
  }
  
  // Para robots.txt, generar uno dinámico según el dominio
  if (url === '/robots.txt') {
    const robotsTxt = generateRobotsTxt(host);
    res.type('text/plain');
    res.send(robotsTxt);
    return;
  }
  
  // Para sitemap.xml, servir el generado estáticamente
  if (url === '/sitemap.xml') {
    const sitemapPath = path.join(process.cwd(), 'public', 'sitemap.xml');
    if (fs.existsSync(sitemapPath)) {
      res.type('text/xml');
      res.sendFile(sitemapPath);
    } else {
      res.status(404).send('Sitemap not found');
    }
    return;
  }
  
  // Agregar encabezados Link para indicar la URL canónica
  if (host !== CANONICAL_DOMAIN) {
    const canonicalUrl = `${CANONICAL_BASE_URL}${url}`;
    res.setHeader('Link', `<${canonicalUrl}>; rel="canonical"`);
  }
  
  // Continuar con la cadena de middleware
  next();
}

/**
 * Renderizador avanzado para contenido optimizado para SEO
 * @param content Contenido HTML a optimizar
 * @returns Contenido HTML optimizado para SEO
 */
export function renderSeoContent(content: string, path: string): string {
  // Primero aplicar optimizaciones básicas
  let optimizedContent = content;
  
  // Asegurar que el título incluye el nombre correcto de la aplicación
  optimizedContent = replaceAppName(optimizedContent);
  
  // Optimizaciones específicas de migración de dominio
  optimizedContent = applyDomainMigrationOptimizations(optimizedContent, path);
  
  // Si el contenido cambió mucho, usar la versión simple
  if (Math.abs(optimizedContent.length - content.length) > content.length * 0.3) {
    console.log('[SEO] Detected large changes in optimized content, reverting to simple optimization');
    return renderSeoContentSimple(content, path);
  }
  
  return optimizedContent;
}

/**
 * Versión simple del renderizador SEO para casos donde el avanzado no está disponible
 */
function renderSeoContentSimple(content: string, path: string): string {
  // Solo hacer las optimizaciones más básicas
  let simpleOptimized = content;
  
  // Reemplazar referencias al nombre antiguo
  simpleOptimized = replaceAppName(simpleOptimized);
  
  // Asegurar que existe una etiqueta canónica
  if (!simpleOptimized.includes('rel="canonical"')) {
    const canonicalUrl = `${CANONICAL_BASE_URL}${path}`;
    const canonicalTag = `<link rel="canonical" href="${canonicalUrl}" />`;
    simpleOptimized = simpleOptimized.replace('</head>', `${canonicalTag}\n</head>`);
  }
  
  return simpleOptimized;
}

/**
 * Aplica optimizaciones específicas para la migración de dominio
 * @param content Contenido HTML
 * @param path Ruta de la página
 * @returns Contenido optimizado
 */
function applyDomainMigrationOptimizations(content: string, path: string): string {
  let optimized = content;
  
  // Reemplazar URLs absolutas de la forma https://waybank.info
  const oldDomainRegex = new RegExp('https://waybank\\.net', 'g');
  optimized = optimized.replace(oldDomainRegex, CANONICAL_BASE_URL);
  
  // Reemplazar URLs de la forma //waybank.info
  const protocolRelativeRegex = new RegExp('//waybank\\.net', 'g');
  optimized = optimized.replace(protocolRelativeRegex, `//${CANONICAL_DOMAIN}`);
  
  // Añadir etiqueta canónica si no existe
  if (!optimized.includes('rel="canonical"')) {
    const canonicalUrl = `${CANONICAL_BASE_URL}${path}`;
    const canonicalTag = `<link rel="canonical" href="${canonicalUrl}" />`;
    optimized = optimized.replace('</head>', `${canonicalTag}\n</head>`);
  }
  
  // Actualizar og:url y otras propiedades Open Graph
  const ogUrlRegex = /<meta property="og:url" content="[^"]+"/;
  const newOgUrl = `<meta property="og:url" content="${CANONICAL_BASE_URL}${path}"`;
  optimized = optimized.replace(ogUrlRegex, newOgUrl);
  
  return optimized;
}

/**
 * Genera un robots.txt adecuado según el dominio de la solicitud
 * @param host Dominio de la solicitud
 * @returns Contenido de robots.txt
 */
function generateRobotsTxt(host: string): string {
  // Base común para todos los robots.txt
  let robotsTxt = `# WayBank Robots.txt\n`;
  
  // Configuración específica según el dominio
  if (host === CANONICAL_DOMAIN) {
    // Dominio canónico - permisivo
    robotsTxt += `# Configuración para ${CANONICAL_DOMAIN} (permisivo)
User-agent: *
Allow: /

# Host canónico
Host: ${CANONICAL_DOMAIN}

# Sitemap
Sitemap: ${CANONICAL_BASE_URL}/sitemap.xml`;
  } else if (isOldDomain(host)) {
    // Dominio antiguo - restrictivo para evitar indexación
    robotsTxt += `# Configuración para ${host} (restrictivo - dominio antiguo)
User-agent: *
Disallow: /

# Host canónico
Host: ${CANONICAL_DOMAIN}

# Sitemap canónico
Sitemap: ${CANONICAL_BASE_URL}/sitemap.xml`;
  } else {
    // Otros dominios - configuración por defecto
    robotsTxt += `# Configuración por defecto
User-agent: *
Allow: /

# Host canónico
Host: ${CANONICAL_DOMAIN}

# Sitemap
Sitemap: ${CANONICAL_BASE_URL}/sitemap.xml`;
  }
  
  return robotsTxt;
}