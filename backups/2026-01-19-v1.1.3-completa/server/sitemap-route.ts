import { Router, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { format } from 'date-fns';

// Interfaz para las entradas del sitemap
interface SitemapEntry {
  url: string;
  changefreq: string;
  priority: number;
  lastmod?: string;
}

/**
 * Genera un sitemap XML con todas las rutas públicas de la aplicación
 */
export function generateSitemapXml(baseUrl: string = 'https://waybank.finance'): string {
  const entries: SitemapEntry[] = [];
  const today = format(new Date(), 'yyyy-MM-dd');
  
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
  
  // Agregar cada ruta al sitemap
  publicRoutes.forEach(route => {
    entries.push({
      url: `${baseUrl}${route.path}`,
      changefreq: route.changefreq,
      priority: route.priority,
      lastmod: today
    });
  });
  
  // Generar el XML
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  
  // Agregar cada entrada
  entries.forEach(entry => {
    xml += '  <url>\n';
    xml += `    <loc>${entry.url}</loc>\n`;
    
    if (entry.lastmod) {
      xml += `    <lastmod>${entry.lastmod}</lastmod>\n`;
    }
    
    xml += `    <changefreq>${entry.changefreq}</changefreq>\n`;
    xml += `    <priority>${entry.priority.toFixed(1)}</priority>\n`;
    xml += '  </url>\n';
  });
  
  xml += '</urlset>';
  return xml;
}

/**
 * Genera y guarda el sitemap en el directorio público
 */
export function generateAndSaveSitemap(baseUrl: string, outputPath: string = './public/sitemap.xml'): boolean {
  try {
    console.log('[SEO] Generating sitemap.xml...');
    
    // Asegurar que la carpeta public exista
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    // Generar el contenido XML
    const sitemapXml = generateSitemapXml(baseUrl);
    
    // Guardar el archivo
    fs.writeFileSync(outputPath, sitemapXml, 'utf8');
    
    // Establecer permisos adecuados (644 = owner: rw, group: r, others: r)
    try {
      fs.chmodSync(outputPath, 0o644);
      console.log('[SEO] Sitemap permissions set to 644');
    } catch (error) {
      console.warn('[SEO] Could not set sitemap permissions');
    }
    
    // Generar o actualizar robots.txt
    updateRobotsTxt(baseUrl, outputPath);
    
    console.log('[SEO] Sitemap generated successfully at', outputPath);
    return true;
  } catch (error) {
    console.error('[SEO] Error generating sitemap:', error);
    return false;
  }
}

/**
 * Verifica y actualiza el archivo robots.txt para incluir la referencia al sitemap
 */
function updateRobotsTxt(baseUrl: string, sitemapPath: string): void {
  const robotsPath = path.join(path.dirname(sitemapPath), 'robots.txt');
  const sitemapUrl = `${baseUrl}/sitemap.xml`;
  
  // Si no existe robots.txt, crear uno básico
  if (!fs.existsSync(robotsPath)) {
    const defaultRobotsTxt = `# WayBank Robots.txt
User-agent: *
Allow: /

# Sitemap
Sitemap: ${sitemapUrl}
`;
    fs.writeFileSync(robotsPath, defaultRobotsTxt);
    console.log('[SEO] Created default robots.txt file');
    return;
  }
  
  // Si existe, verificar si contiene la referencia al sitemap
  let robotsContent = fs.readFileSync(robotsPath, 'utf8');
  
  if (!robotsContent.includes('Sitemap:')) {
    // Si no existe la referencia, agregarla
    robotsContent += `\n\nSitemap: ${sitemapUrl}\n`;
    fs.writeFileSync(robotsPath, robotsContent);
    console.log('[SEO] Added sitemap reference to robots.txt');
  } else if (!robotsContent.includes(sitemapUrl)) {
    // Si existe una referencia pero a una URL diferente, actualizarla
    robotsContent = robotsContent.replace(/Sitemap:.*\n/, `Sitemap: ${sitemapUrl}\n`);
    fs.writeFileSync(robotsPath, robotsContent);
    console.log('[SEO] Updated sitemap reference in robots.txt');
  } else {
    console.log('[SEO] robots.txt already contains sitemap reference');
  }
}

/**
 * Crear el router para las rutas de SEO
 */
export default function sitemapRouter() {
  const router = Router();
  
  // Ruta para regenerar el sitemap
  router.get('/api/sitemap/generate', (req: Request, res: Response) => {
    try {
      const baseUrl = req.protocol + '://' + req.get('host');
      const outputPath = './public/sitemap.xml';
      
      const success = generateAndSaveSitemap(baseUrl, outputPath);
      
      if (success) {
        return res.json({
          success: true,
          message: 'Sitemap generated successfully',
          location: '/sitemap.xml'
        });
      } else {
        return res.status(500).json({
          success: false,
          message: 'Error generating sitemap'
        });
      }
    } catch (error) {
      console.error('Error generating sitemap:', error);
      return res.status(500).json({
        success: false,
        message: 'Error generating sitemap',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  });
  
  // Ruta para ver el sitemap actual
  router.get('/sitemap.xml', (req: Request, res: Response) => {
    const sitemapPath = path.join(process.cwd(), 'public', 'sitemap.xml');
    
    if (fs.existsSync(sitemapPath)) {
      res.header('Content-Type', 'application/xml');
      
      // Si se solicita regenerar, generamos el sitemap de nuevo
      if (req.query.regenerate === 'true') {
        const baseUrl = req.protocol + '://' + req.get('host');
        generateAndSaveSitemap(baseUrl, sitemapPath);
      }
      
      const sitemapContent = fs.readFileSync(sitemapPath, 'utf8');
      return res.send(sitemapContent);
    } else {
      // Si no existe, lo generamos
      const baseUrl = req.protocol + '://' + req.get('host');
      generateAndSaveSitemap(baseUrl, sitemapPath);
      
      if (fs.existsSync(sitemapPath)) {
        res.header('Content-Type', 'application/xml');
        const sitemapContent = fs.readFileSync(sitemapPath, 'utf8');
        return res.send(sitemapContent);
      } else {
        // Si hay algún problema, generamos el XML directamente
        res.header('Content-Type', 'application/xml');
        const xml = generateSitemapXml(baseUrl);
        return res.send(xml);
      }
    }
  });
  
  // Ruta para robots.txt
  router.get('/robots.txt', (req: Request, res: Response) => {
    const robotsPath = path.join(process.cwd(), 'public', 'robots.txt');
    const baseUrl = req.protocol + '://' + req.get('host');
    
    if (!fs.existsSync(robotsPath)) {
      const defaultRobotsTxt = `# WayBank Robots.txt
User-agent: *
Allow: /

# Sitemap
Sitemap: ${baseUrl}/sitemap.xml
`;
      fs.writeFileSync(robotsPath, defaultRobotsTxt);
    }
    
    if (fs.existsSync(robotsPath)) {
      res.header('Content-Type', 'text/plain');
      const robotsContent = fs.readFileSync(robotsPath, 'utf8');
      return res.send(robotsContent);
    } else {
      res.header('Content-Type', 'text/plain');
      return res.send(`# WayBank Robots.txt
User-agent: *
Allow: /

# Sitemap
Sitemap: ${baseUrl}/sitemap.xml
`);
    }
  });
  
  return router;
}