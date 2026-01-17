/**
 * Generador de metaetiquetas y cabeceras para SEO
 * 
 * Este archivo contiene funciones para generar metaetiquetas y cabeceras HTTP
 * para optimización SEO, especialmente relacionadas con la migración de dominio.
 */

import { getCanonicalUrl, OLD_DOMAINS, NEW_DOMAINS, CANONICAL_DOMAIN } from './app-config';

/**
 * Genera cabeceras HTTP para cambio de dominio
 * @param path Ruta actual (sin dominio)
 * @returns Objeto con nombres y valores de cabeceras
 */
export function getDomainChangeHeaders(path: string): Record<string, string> {
  const canonicalUrl = getCanonicalUrl(path);
  const headers: Record<string, string> = {
    'Link': `<${canonicalUrl}>; rel="canonical"`
  };
  
  // Agregar cabeceras adicionales si es necesario
  return headers;
}

/**
 * Inserta etiquetas meta para el cambio de dominio en el HTML
 * @param html Contenido HTML a modificar
 * @param path Ruta actual
 * @returns HTML modificado con las etiquetas meta adecuadas
 */
export function insertDomainChangeMetaTags(html: string, path: string): string {
  const canonicalUrl = getCanonicalUrl(path);
  
  // Preparar etiquetas a insertar
  const metaTags = [
    `<link rel="canonical" href="${canonicalUrl}" />`,
    
    // Etiquetas para enlaces alternados (dominios antiguos)
    ...OLD_DOMAINS.map(domain => 
      `<link rel="alternate" href="https://${domain}${path}" />`
    ),
    
    // Enlaces alternados para los nuevos dominios (que no sean el canónico)
    ...NEW_DOMAINS
      .filter(domain => domain !== CANONICAL_DOMAIN)
      .map(domain => `<link rel="alternate" href="https://${domain}${path}" />`),
    
    // Metaetiqueta para indicar la migración de dominio
    `<meta name="robots" content="index, follow" />`,
    
    // Metaetiqueta para la gestión de redirecciones
    `<meta name="domain-migration" content="origin=waybank.info;target=waybank.finance" />`
  ].join('\n');
  
  // Insertar las etiquetas meta en el head
  return html.replace('</head>', `${metaTags}\n</head>`);
}

/**
 * Genera un conjunto completo de headers HTTP para SEO
 * @param req Objeto de solicitud HTTP
 * @returns Objeto con los headers a establecer
 */
export function generateSeoHeaders(req: any): Record<string, string> {
  const path = req.path || '/';
  const userAgent = req.headers['user-agent'] || '';
  const host = req.headers.host || '';
  
  // Headers básicos
  const headers: Record<string, string> = {
    'X-Robots-Tag': 'index, follow',
    'Vary': 'Accept-Language, User-Agent'
  };
  
  // Headers de cambio de dominio
  const domainHeaders = getDomainChangeHeaders(path);
  Object.assign(headers, domainHeaders);
  
  // Headers específicos para bots
  if (userAgent.toLowerCase().includes('bot') || 
      userAgent.toLowerCase().includes('crawler') ||
      userAgent.toLowerCase().includes('spider')) {
    headers['X-Waybank-Bot-Info'] = 'migration-in-progress';
  }
  
  return headers;
}