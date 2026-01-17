/**
 * Sistema de detección de crawlers y bots para SEO
 * 
 * Este módulo permite identificar cuando una solicitud proviene de
 * un bot o crawler de motores de búsqueda, y tomar acciones específicas
 * como redireccionar correctamente o proporcionar contenido optimizado.
 */

// Tipos de crawlers conocidos
export type CrawlerType = 
  | 'GoogleBot' 
  | 'BingBot' 
  | 'YandexBot' 
  | 'BaiduSpider'
  | 'DuckDuckBot'
  | 'FacebookBot'
  | 'TwitterBot'
  | 'LinkedInBot'
  | 'AppleBot'
  | 'PinterestBot'
  | 'SlackBot'
  | 'N/A';

// Lista de patrones para detectar crawlers conocidos
const CRAWLER_PATTERNS: Record<CrawlerType, RegExp[]> = {
  'GoogleBot': [
    /googlebot/i,
    /google-structured-data-testing-tool/i,
    /google web preview/i,
    /google favicon/i,
    /AdsBot-Google/i
  ],
  'BingBot': [
    /bingbot/i,
    /msnbot/i,
    /adidxbot/i
  ],
  'YandexBot': [
    /yandex/i,
    /YandexBot/i,
    /YandexImages/i
  ],
  'BaiduSpider': [
    /Baiduspider/i,
    /Baidu/i
  ],
  'DuckDuckBot': [
    /DuckDuckBot/i,
    /DuckDuckGo/i
  ],
  'FacebookBot': [
    /facebookexternalhit/i,
    /facebot/i
  ],
  'TwitterBot': [
    /Twitterbot/i
  ],
  'LinkedInBot': [
    /LinkedInBot/i
  ],
  'AppleBot': [
    /Applebot/i
  ],
  'PinterestBot': [
    /Pinterest/i
  ],
  'SlackBot': [
    /Slackbot/i
  ],
  'N/A': []
};

// Lista general de patrones para detectar cualquier tipo de bot
const GENERAL_BOT_PATTERNS = [
  /bot/i,
  /spider/i,
  /crawler/i,
  /scraper/i,
  /preview/i,
  /fetch/i,
  /headless/i,
  /lighthouse/i,
  /prerender/i,
  /phantomjs/i,
  /validator/i,
  /pinterest/i,
  /whatsapp/i,
  /telegram/i,
  /slurp/i,
  /archive/i,
  /monitor/i
];

/**
 * Verifica si un user agent pertenece a un crawler
 * @param userAgent User agent de la solicitud
 * @returns true si es un crawler, false en caso contrario
 */
export function isCrawler(userAgent: string): boolean {
  if (!userAgent) {
    return false;
  }

  // Primero verificar patrones específicos
  for (const patterns of Object.values(CRAWLER_PATTERNS)) {
    for (const pattern of patterns) {
      if (pattern.test(userAgent)) {
        return true;
      }
    }
  }

  // Luego verificar patrones generales
  for (const pattern of GENERAL_BOT_PATTERNS) {
    if (pattern.test(userAgent)) {
      return true;
    }
  }

  return false;
}

/**
 * Identifica el tipo específico de crawler según su user agent
 * @param userAgent User agent de la solicitud
 * @returns Tipo de crawler identificado o 'N/A' si no es un crawler conocido
 */
export function getCrawlerType(userAgent: string): CrawlerType {
  if (!userAgent) {
    return 'N/A';
  }

  for (const [type, patterns] of Object.entries(CRAWLER_PATTERNS)) {
    for (const pattern of patterns) {
      if (pattern.test(userAgent)) {
        return type as CrawlerType;
      }
    }
  }

  // Verificar si es un bot genérico
  for (const pattern of GENERAL_BOT_PATTERNS) {
    if (pattern.test(userAgent)) {
      return 'N/A'; // Es un bot, pero no de un tipo específico conocido
    }
  }

  return 'N/A';
}

/**
 * Determina si un crawler debe ser redirigido al dominio canónico
 * @param crawlerType Tipo de crawler
 * @returns true si debe ser redirigido, false en caso contrario
 */
export function shouldRedirectCrawler(crawlerType: CrawlerType): boolean {
  // Redireccionar la mayoría de los crawlers importantes
  return [
    'GoogleBot', 
    'BingBot', 
    'YandexBot', 
    'BaiduSpider',
    'DuckDuckBot'
  ].includes(crawlerType);
}

/**
 * Determina si se deben agregar encabezados Link para indicar URLs canónicas
 * @param crawlerType Tipo de crawler
 * @returns true si se deben agregar encabezados, false en caso contrario
 */
export function shouldAddCanonicalHeaders(crawlerType: CrawlerType): boolean {
  // Para todos los crawlers importantes
  return crawlerType !== 'N/A';
}

/**
 * Genera un string de agente de usuario para pruebas
 * Útil para depuración y desarrollo
 * @param crawlerType Tipo de crawler para simular
 * @returns String de user agent simulado
 */
export function generateTestUserAgent(crawlerType: CrawlerType): string {
  switch (crawlerType) {
    case 'GoogleBot':
      return 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)';
    case 'BingBot':
      return 'Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)';
    case 'YandexBot':
      return 'Mozilla/5.0 (compatible; YandexBot/3.0; +http://yandex.com/bots)';
    case 'BaiduSpider':
      return 'Mozilla/5.0 (compatible; Baiduspider/2.0; +http://www.baidu.com/search/spider.html)';
    case 'FacebookBot':
      return 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)';
    case 'TwitterBot':
      return 'Twitterbot/1.0';
    default:
      return 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36';
  }
}