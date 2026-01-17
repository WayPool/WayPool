import fs from 'fs';
import path from 'path';
import { format } from 'date-fns';

interface SitemapEntry {
  url: string;             // URL completa de la página
  changefreq: string;      // Frecuencia de cambio (daily, weekly, monthly...)
  priority: number;        // Prioridad relativa (0.0 - 1.0)
  lastmod?: string;        // Fecha de última modificación (opcional)
  alternates?: Record<string, string>; // URLs alternativas para diferentes idiomas
}

/**
 * Generador de Sitemap completo para SEO
 * 
 * Este módulo genera un sitemap.xml completo con:
 * - Todas las páginas públicas
 * - Soporte para múltiples idiomas (hreflang)
 * - Prioridades y frecuencias de cambio optimizadas
 * - Fechas de última modificación
 */
export class SitemapGenerator {
  private baseUrl: string;
  private outputPath: string;
  private supportedLanguages: string[];
  private entries: SitemapEntry[] = [];
  
  constructor(
    baseUrl: string = 'https://waybank.finance',
    outputPath: string = './public/sitemap.xml',
    supportedLanguages: string[] = ['en', 'es', 'fr', 'de', 'it', 'pt', 'ar', 'hi', 'zh']
  ) {
    this.baseUrl = baseUrl;
    this.outputPath = outputPath;
    this.supportedLanguages = supportedLanguages;
    
    // Asegurar que la carpeta public exista
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }
  
  /**
   * Agrega las páginas predefinidas a la lista de entradas del sitemap
   */
  private addPredefinedPages() {
    // Definir todas las rutas públicas de la aplicación
    const publicRoutes = [
      // Páginas principales
      { path: '/', changefreq: 'daily', priority: 1.0 },
      
      // Páginas informativas
      { path: '/how-it-works', changefreq: 'weekly', priority: 0.9 },
      { path: '/algorithm-details', changefreq: 'weekly', priority: 0.9 },
      
      // Documentos legales
      { path: '/terms-of-use', changefreq: 'monthly', priority: 0.8 },
      { path: '/privacy-policy', changefreq: 'monthly', priority: 0.8 },
      { path: '/disclaimer', changefreq: 'monthly', priority: 0.8 },
      
      // Secciones funcionales públicas
      { path: '/public-referrals', changefreq: 'weekly', priority: 0.8 },
      { path: '/podcast', changefreq: 'weekly', priority: 0.9 },
      
      // Secciones con autenticación pero con landing pública
      { path: '/dashboard', changefreq: 'weekly', priority: 0.8 },
      { path: '/analytics', changefreq: 'weekly', priority: 0.8 },
      { path: '/positions', changefreq: 'weekly', priority: 0.8 },
      { path: '/rewards', changefreq: 'weekly', priority: 0.7 },
      
      // Sección NFT
      { path: '/nft', changefreq: 'weekly', priority: 0.8 },
      { path: '/nft-details', changefreq: 'weekly', priority: 0.7 },
      
      // Sección de soporte
      { path: '/support', changefreq: 'weekly', priority: 0.7 },
      { path: '/faq', changefreq: 'weekly', priority: 0.8 },
      
      // Otras páginas de interés
      { path: '/tools', changefreq: 'weekly', priority: 0.6 },
      { path: '/contact', changefreq: 'monthly', priority: 0.6 },
      { path: '/about', changefreq: 'monthly', priority: 0.6 }
    ];
    
    // Fecha actual formateada para lastmod
    const today = format(new Date(), 'yyyy-MM-dd');
    
    // Procesar cada ruta de forma simple, sin alternativas de idioma que puedan causar problemas
    publicRoutes.forEach(route => {
      // Agregar la entrada principal
      this.entries.push({
        url: `${this.baseUrl}${route.path}`,
        changefreq: route.changefreq,
        priority: route.priority,
        lastmod: today
      });
    });
  }
  
  /**
   * Genera el contenido XML del sitemap
   */
  private generateSitemapXml(): string {
    // Encabezado XML
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
    
    // Para asegurar que sólo incluimos cada URL una vez
    const processedUrls = new Set<string>();
    
    // Agregar cada entrada
    this.entries.forEach(entry => {
      // Evitar duplicados
      if (processedUrls.has(entry.url)) {
        return;
      }
      
      processedUrls.add(entry.url);
      
      xml += '  <url>\n';
      xml += `    <loc>${entry.url}</loc>\n`;
      
      if (entry.lastmod) {
        xml += `    <lastmod>${entry.lastmod}</lastmod>\n`;
      }
      
      xml += `    <changefreq>${entry.changefreq}</changefreq>\n`;
      xml += `    <priority>${entry.priority.toFixed(1)}</priority>\n`;
      xml += '  </url>\n';
    });
    
    // Cerrar el XML
    xml += '</urlset>';
    
    return xml;
  }
  
  /**
   * Verifica y actualiza el archivo robots.txt para incluir la referencia al sitemap
   */
  private updateRobotsTxt() {
    const robotsPath = path.join(path.dirname(this.outputPath), 'robots.txt');
    const sitemapUrl = `${this.baseUrl}/sitemap.xml`;
    
    let robotsContent = '';
    
    // Leer el archivo robots.txt si existe
    if (fs.existsSync(robotsPath)) {
      robotsContent = fs.readFileSync(robotsPath, 'utf8');
    }
    
    // Verificar si ya contiene la referencia al sitemap
    if (!robotsContent.includes('Sitemap:')) {
      // Si no existe la referencia, agregarla
      robotsContent += `\n\nSitemap: ${sitemapUrl}\n`;
      fs.writeFileSync(robotsPath, robotsContent);
      console.log('[SEO] Added sitemap reference to robots.txt');
      return true;
    } else if (!robotsContent.includes(sitemapUrl)) {
      // Si existe una referencia pero a una URL diferente, actualizarla
      robotsContent = robotsContent.replace(/Sitemap:.*\n/, `Sitemap: ${sitemapUrl}\n`);
      fs.writeFileSync(robotsPath, robotsContent);
      console.log('[SEO] Updated sitemap reference in robots.txt');
      return true;
    }
    
    console.log('[SEO] robots.txt already contains sitemap reference');
    return false;
  }
  
  /**
   * Crea un archivo robots.txt básico si no existe
   */
  private createDefaultRobotsTxt() {
    const robotsPath = path.join(path.dirname(this.outputPath), 'robots.txt');
    
    // Si no existe robots.txt, crear uno básico
    if (!fs.existsSync(robotsPath)) {
      const defaultRobotsTxt = `# WayBank Robots.txt
User-agent: *
Allow: /

# Sitemap
Sitemap: ${this.baseUrl}/sitemap.xml
`;
      fs.writeFileSync(robotsPath, defaultRobotsTxt);
      console.log('[SEO] Created default robots.txt file');
      return true;
    }
    
    return false;
  }
  
  /**
   * Ajusta los permisos del archivo sitemap.xml para asegurar que sea accesible
   */
  private setFilePermissions() {
    try {
      // 644 permisos (owner: rw, group: r, others: r)
      fs.chmodSync(this.outputPath, 0o644);
      console.log('[SEO] Sitemap permissions set to 644');
    } catch (error) {
      console.warn('[SEO] Could not set sitemap permissions:', error);
    }
  }
  
  /**
   * Genera y guarda el sitemap en disco
   */
  public generate(): boolean {
    try {
      console.log('[SEO] Generating sitemap.xml...');
      
      // Agregar páginas predefinidas
      this.addPredefinedPages();
      
      // Generar el contenido XML
      const sitemapXml = this.generateSitemapXml();
      
      // Guardar el archivo
      fs.writeFileSync(this.outputPath, sitemapXml, 'utf8');
      
      // Establecer permisos adecuados
      this.setFilePermissions();
      
      // Verificar/actualizar robots.txt
      this.createDefaultRobotsTxt() || this.updateRobotsTxt();
      
      console.log('[SEO] Sitemap and robots.txt generated successfully');
      return true;
    } catch (error) {
      console.error('[SEO] Error generating sitemap:', error);
      return false;
    }
  }
  
  /**
   * Agrega una página personalizada al sitemap
   */
  public addPage(
    path: string,
    changefreq: string = 'weekly',
    priority: number = 0.7,
    lastmod?: string
  ): void {
    const url = `${this.baseUrl}${path}`;
    const today = lastmod || format(new Date(), 'yyyy-MM-dd');
    
    // Crear alternativas de idioma para la página
    const alternates: Record<string, string> = {};
    this.supportedLanguages.forEach(lang => {
      alternates[lang] = `${url}${url.includes('?') ? '&' : '?'}lang=${lang}`;
    });
    
    this.entries.push({
      url,
      changefreq,
      priority,
      lastmod: today,
      alternates
    });
  }
}

/**
 * Genera un nuevo sitemap y lo guarda en el directorio público
 */
export function generateSitemap(
  baseUrl: string = 'https://waybank.finance',
  outputPath: string = './public/sitemap.xml'
): boolean {
  const generator = new SitemapGenerator(baseUrl, outputPath);
  return generator.generate();
}