/**
 * Utilidad de prueba para verificar la funcionalidad del middleware SEO
 * Esta herramienta ayuda a simular peticiones de motores de búsqueda
 * y verificar que la respuesta contiene la información SEO optimizada.
 */

import fetch from 'node-fetch';
import { log } from '../vite';
import { isSearchEngineBot } from './crawler-detection';

// Array de User Agents para probar
const TEST_USER_AGENTS = [
  {
    name: 'Google',
    agent: 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'
  },
  {
    name: 'Bing',
    agent: 'Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)'
  },
  {
    name: 'Normal User',
    agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
  }
];

// Array de URLs para probar
const TEST_URLS = [
  '/',
  '/algorithm-details',
  '/how-it-works',
  '/terms-of-use',
  '/privacy-policy',
  '/disclaimer'
];

/**
 * Prueba el middleware SEO con diferentes combinaciones de bots y URLs
 */
export async function testSeoMiddleware() {
  log('[SEO Test] Starting SEO middleware test...');
  
  for (const ua of TEST_USER_AGENTS) {
    log(`\n[SEO Test] Testing with ${ua.name} user agent: ${ua.agent}`);
    log(`[SEO Test] Bot detection result: ${isSearchEngineBot(ua.agent) ? 'BOT DETECTED ✓' : 'NOT A BOT ✗'}`);
    
    for (const url of TEST_URLS) {
      log(`\n[SEO Test] Testing URL: ${url}`);
      
      try {
        const response = await fetch(`http://localhost:5000${url}`, {
          headers: {
            'User-Agent': ua.agent
          }
        });
        
        const html = await response.text();
        const headers = response.headers;
        
        // Verificar si la respuesta contiene metadatos SEO
        const hasSeoMiddleware = headers.get('X-SEO-Middleware') !== null;
        const hasMetaTags = html.includes('<meta name="description"');
        const hasStructuredData = html.includes('<script type="application/ld+json">');
        
        // Contar metaetiquetas
        const metaTagsCount = (html.match(/<meta[^>]*>/g) || []).length;
        
        log(`[SEO Test] Status: ${response.status}`);
        log(`[SEO Test] SEO Middleware Header: ${hasSeoMiddleware ? 'YES ✓' : 'NO ✗'}`);
        log(`[SEO Test] SEO Meta Tags: ${hasMetaTags ? 'YES ✓' : 'NO ✗'} (${metaTagsCount} tags)`);
        log(`[SEO Test] JSON-LD Structured Data: ${hasStructuredData ? 'YES ✓' : 'NO ✗'}`);
        
        // Para crawlers en páginas públicas, deberíamos tener contenido optimizado
        if (isSearchEngineBot(ua.agent) && TEST_URLS.includes(url)) {
          if (hasSeoMiddleware && hasMetaTags && hasStructuredData) {
            log('[SEO Test] ✅ SEO optimization working correctly!');
          } else {
            log('[SEO Test] ❌ SEO optimization not applied as expected');
          }
        } else {
          // Para usuarios normales, no deberíamos tener la optimización
          if (!hasSeoMiddleware) {
            log('[SEO Test] ✅ Normal user flow preserved correctly!');
          } else {
            log('[SEO Test] ❌ SEO middleware unexpectedly affecting normal users');
          }
        }
      } catch (error) {
        log(`[SEO Test] Error testing ${url}: ${error}`);
      }
    }
  }
  
  log('\n[SEO Test] Test completed!');
}

// Esta función puede ser ejecutada directamente para depuración
// testSeoMiddleware().catch(console.error);