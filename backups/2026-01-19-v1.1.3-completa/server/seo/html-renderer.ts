/**
 * Servicio de renderizado HTML para SEO
 * Utiliza técnicas avanzadas para renderizar páginas como lo haría un navegador
 * sin modificar la aplicación principal.
 */

import { htmlCache } from './html-cache';
import { enhanceHtmlWithSeoMetadata } from './metadata-enhancer';
import { log } from '../vite';
import { APP_NAME } from './app-config';

// Constante para el user-agent
const SEO_USER_AGENT = `Mozilla/5.0 ${APP_NAME} SEO Renderer (+https://waybank.finance/bot.html)`;

/**
 * Interfaz para los renderizadores HTML
 */
interface HtmlRenderer {
  renderUrl(url: string): Promise<string | null>;
}

/**
 * Implementación simple que obtiene el HTML desde el servidor
 * Esta implementación fallback se usa cuando no está disponible Puppeteer
 */
class SimpleHtmlRenderer implements HtmlRenderer {
  async renderUrl(url: string): Promise<string | null> {
    try {
      const fullUrl = `http://localhost:5000${url}`;
      log(`[SEO] SimpleHtmlRenderer fetching ${fullUrl}`);
      
      const response = await fetch(fullUrl);
      
      if (!response.ok) {
        log(`[SEO] SimpleHtmlRenderer: Error fetching ${fullUrl} - ${response.status}`);
        return null;
      }
      
      const html = await response.text();
      return html;
    } catch (error) {
      log(`[SEO] SimpleHtmlRenderer: Error rendering ${url} - ${error}`);
      return null;
    }
  }
}

/**
 * Clase de renderizado HTML principal que administra el proceso de renderizado
 * y la caché para optimizar el rendimiento.
 */
class SeoHtmlRenderer {
  private renderer: HtmlRenderer;
  
  constructor() {
    // Por defecto, usamos el renderizador simple
    this.renderer = new SimpleHtmlRenderer();
    
    // Intentamos cargar Puppeteer dinámicamente para no afectar el rendimiento
    // si no se utiliza para usuarios normales
    this.initPuppeteerRenderer();
  }
  
  /**
   * Inicializa el renderizador basado en Puppeteer si está disponible
   */
  private async initPuppeteerRenderer() {
    try {
      // Importamos dinámicamente para evitar dependencias innecesarias
      const puppeteerPath = require.resolve('puppeteer');
      
      if (puppeteerPath) {
        log('[SEO] Puppeteer found, initializing advanced renderer');
        
        // Importación dinámica
        const { default: puppeteer } = await import('puppeteer');
        
        // Implementamos el renderizador con Puppeteer
        this.renderer = {
          renderUrl: async (url: string): Promise<string | null> => {
            let browser = null;
            
            try {
              log(`[SEO] PuppeteerRenderer rendering: ${url}`);
              
              // Lanzar navegador sin cabeza
              browser = await puppeteer.launch({
                headless: 'new',
                args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
              });
              
              const page = await browser.newPage();
              
              // Configurar timeout y UA para evitar bloqueos
              await page.setDefaultNavigationTimeout(15000);
              await page.setUserAgent(SEO_USER_AGENT);
              
              // Visitar la URL
              const fullUrl = `http://localhost:5000${url}`;
              await page.goto(fullUrl, { waitUntil: 'networkidle0' });
              
              // Esperar a que la aplicación React se cargue completamente
              await page.waitForSelector('#root > div', { timeout: 5000 });
              
              // Esperar un poco más para asegurarnos que todo el contenido dinámico está cargado
              await page.waitForTimeout(1000);
              
              // Obtener el HTML final
              const content = await page.content();
              return content;
            } catch (error) {
              log(`[SEO] PuppeteerRenderer: Error rendering ${url} - ${error}`);
              return null;
            } finally {
              if (browser) {
                await browser.close();
              }
            }
          }
        };
        
        log('[SEO] Advanced renderer initialized successfully');
      }
    } catch (error) {
      log(`[SEO] Could not initialize advanced renderer: ${error}`);
      log('[SEO] Using simple renderer as fallback');
    }
  }
  
  /**
   * Renderiza una URL y devuelve el HTML optimizado para SEO
   * @param url - URL a renderizar
   * @returns HTML renderizado o null si hubo un error
   */
  public async renderPage(url: string): Promise<string | null> {
    // Comprobar primero en la caché
    const cachedHtml = htmlCache.get(url);
    if (cachedHtml) {
      return cachedHtml;
    }
    
    // Renderizar la página
    log(`[SEO] Rendering page: ${url}`);
    const html = await this.renderer.renderUrl(url);
    
    if (!html) {
      log(`[SEO] Failed to render page: ${url}`);
      return null;
    }
    
    // Mejorar el HTML con metadatos SEO
    const enhancedHtml = enhanceHtmlWithSeoMetadata(html, url);
    
    // Guardar en caché
    htmlCache.set(url, enhancedHtml);
    
    return enhancedHtml;
  }
  
  /**
   * Invalida la caché para una URL específica
   * @param url - URL a invalidar
   */
  public invalidateCache(url: string): void {
    htmlCache.invalidate(url);
  }
}

// Exportamos una única instancia para usar en toda la aplicación
export const seoRenderer = new SeoHtmlRenderer();