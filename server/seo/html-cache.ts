/**
 * Sistema de caché de HTML para almacenar versiones pre-renderizadas
 * de las páginas públicas para motores de búsqueda.
 * 
 * Este módulo se encarga de almacenar y gestionar el ciclo de vida
 * de las páginas pre-renderizadas sin modificar el código original.
 */

interface CacheEntry {
  html: string;
  timestamp: number;
  url: string;
}

class HtmlCache {
  private cache: Map<string, CacheEntry>;
  private maxAge: number; // Tiempo de vida máximo de una entrada en caché (en ms)
  
  constructor(maxAgeMinutes: number = 60) { // 1 hora por defecto
    this.cache = new Map<string, CacheEntry>();
    this.maxAge = maxAgeMinutes * 60 * 1000;
  }
  
  /**
   * Almacena una página HTML en la caché
   * @param url - URL única para identificar la página
   * @param html - Contenido HTML pre-renderizado
   */
  set(url: string, html: string): void {
    const normalizedUrl = this.normalizeUrl(url);
    
    this.cache.set(normalizedUrl, {
      html,
      timestamp: Date.now(),
      url: normalizedUrl
    });
    
    console.log(`[SEO] Cached HTML for ${normalizedUrl}`);
  }
  
  /**
   * Obtiene una página HTML de la caché
   * @param url - URL a buscar
   * @returns El HTML si existe y es válido, undefined en caso contrario
   */
  get(url: string): string | undefined {
    const normalizedUrl = this.normalizeUrl(url);
    const entry = this.cache.get(normalizedUrl);
    
    if (!entry) {
      return undefined;
    }
    
    // Comprobar si la entrada ha expirado
    if (this.isExpired(entry)) {
      console.log(`[SEO] Cache expired for ${normalizedUrl}`);
      this.cache.delete(normalizedUrl);
      return undefined;
    }
    
    console.log(`[SEO] Cache hit for ${normalizedUrl}`);
    return entry.html;
  }
  
  /**
   * Elimina una entrada específica de la caché
   * @param url - URL a invalidar
   */
  invalidate(url: string): void {
    const normalizedUrl = this.normalizeUrl(url);
    this.cache.delete(normalizedUrl);
    console.log(`[SEO] Invalidated cache for ${normalizedUrl}`);
  }
  
  /**
   * Limpia las entradas expiradas de la caché
   */
  cleanup(): void {
    const now = Date.now();
    let expiredCount = 0;
    
    // Usar Array.from para evitar problemas de iteración con IE o entornos antiguos
    Array.from(this.cache.entries()).forEach(([url, entry]) => {
      if (now - entry.timestamp > this.maxAge) {
        this.cache.delete(url);
        expiredCount++;
      }
    });
    
    if (expiredCount > 0) {
      console.log(`[SEO] Cleaned up ${expiredCount} expired cache entries`);
    }
  }
  
  /**
   * Normaliza una URL para usarla como clave en la caché
   * @param url - URL a normalizar
   * @returns URL normalizada
   */
  private normalizeUrl(url: string): string {
    // Eliminar query params y hash
    let normalizedUrl = url.split('?')[0].split('#')[0];
    
    // Eliminar barra final si existe
    if (normalizedUrl.endsWith('/') && normalizedUrl !== '/') {
      normalizedUrl = normalizedUrl.slice(0, -1);
    }
    
    // Asegurar que las URLs comienzan con /
    if (!normalizedUrl.startsWith('/')) {
      normalizedUrl = '/' + normalizedUrl;
    }
    
    return normalizedUrl;
  }
  
  /**
   * Comprueba si una entrada de la caché ha expirado
   * @param entry - Entrada de caché a comprobar
   * @returns true si ha expirado, false en caso contrario
   */
  private isExpired(entry: CacheEntry): boolean {
    return Date.now() - entry.timestamp > this.maxAge;
  }
  
  /**
   * Devuelve el número de entradas en la caché
   */
  get size(): number {
    return this.cache.size;
  }
  
  /**
   * Devuelve todas las URLs almacenadas en caché
   */
  get urls(): string[] {
    return Array.from(this.cache.keys());
  }
}

// Exportamos una única instancia para usar en toda la aplicación
export const htmlCache = new HtmlCache(30); // 30 minutos de tiempo de vida

// Programar limpieza periódica de la caché
setInterval(() => {
  htmlCache.cleanup();
}, 15 * 60 * 1000); // Cada 15 minutos