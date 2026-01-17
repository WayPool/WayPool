/**
 * Generador de Sitemap XML para SEO
 * 
 * Este archivo contiene funciones para generar dinámicamente el sitemap.xml
 * con soporte para múltiples dominios, idiomas y páginas disponibles.
 */

import fs from 'fs';
import path from 'path';
import { CANONICAL_DOMAIN, NEW_DOMAINS, OLD_DOMAINS } from './app-config';

// Rutas principales disponibles en la aplicación
const MAIN_ROUTES = [
  '/',
  '/algorithm',
  '/how-it-works',
  '/pool',
  '/faq',
  '/terms',
  '/privacy',
  '/disclaimer',
  '/support',
  '/contact',
];

// Idiomas soportados por la aplicación
const SUPPORTED_LANGUAGES = ['es', 'en', 'pt', 'fr', 'de', 'it', 'ar', 'hi', 'zh'];

// Función para generar sitemap XML
export function generateSitemap(): string {
  const today = new Date().toISOString().split('T')[0];
  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
`;

  // Generar entradas para cada ruta en el dominio canónico
  MAIN_ROUTES.forEach(route => {
    const canonicalUrl = `https://${CANONICAL_DOMAIN}${route}`;
    
    sitemap += `  <url>
    <loc>${canonicalUrl}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${route === '/' ? '1.0' : '0.8'}</priority>
`;

    // Agregar enlaces alternativos para otros dominios (migración)
    [...OLD_DOMAINS, ...NEW_DOMAINS.filter(d => d !== CANONICAL_DOMAIN)].forEach(domain => {
      const alternateUrl = `https://${domain}${route}`;
      sitemap += `    <xhtml:link rel="alternate" hreflang="x-default" href="${alternateUrl}" />\n`;
    });

    // Agregar enlaces alternativos para otros idiomas
    SUPPORTED_LANGUAGES.forEach(lang => {
      sitemap += `    <xhtml:link rel="alternate" hreflang="${lang}" href="${canonicalUrl}?lang=${lang}" />\n`;
    });

    sitemap += `  </url>\n`;
  });

  sitemap += `</urlset>`;
  return sitemap;
}

// Función para escribir el sitemap en el sistema de archivos
export function writeSitemapToFile(outputPath: string = path.join(process.cwd(), 'public', 'sitemap.xml')): void {
  const sitemap = generateSitemap();
  fs.writeFileSync(outputPath, sitemap);
  console.log(`[SEO] Sitemap generado en ${outputPath}`);
}

// Generar el sitemap cuando este módulo es importado
try {
  writeSitemapToFile();
} catch (error) {
  console.error('[SEO] Error al generar sitemap:', error);
}