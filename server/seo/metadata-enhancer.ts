/**
 * Módulo para mejorar el contenido HTML con metadatos SEO
 * e información estructurada para motores de búsqueda.
 * 
 * Este servicio añade etiquetas meta, Open Graph, Twitter Cards,
 * y datos estructurados JSON-LD sin modificar el código original.
 */

import { APP_NAME, BASE_URL, SITE_DESCRIPTION } from './app-config';

// Tipos de página para metadatos específicos
type PageType = 'landing' | 'algorithm' | 'howItWorks' | 'terms' | 'privacy' | 'disclaimer';

// Metadatos SEO por defecto para la aplicación
const DEFAULT_METADATA = {
  title: `${APP_NAME} - Gestión Inteligente de Liquidez en DeFi`,
  description: `${APP_NAME} proporciona soluciones de gestión de liquidez avanzada en pools concentrados, maximizando el rendimiento y minimizando los riesgos en DeFi.`,
  keywords: 'DeFi, Uniswap, liquidez, finanzas descentralizadas, ethereum, web3, gestión de activos digitales',
  image: '/images/preview.png',
  siteUrl: BASE_URL,
  twitterHandle: '@waybank',
  themeColor: '#3730a3'
};

// Metadatos específicos por página
const PAGE_METADATA: Record<PageType, {title: string, description: string}> = {
  landing: {
    title: `${APP_NAME} - Gestión Inteligente de Liquidez en DeFi`,
    description: `Maximiza tus rendimientos en DeFi con la gestión inteligente de liquidez. ${APP_NAME} elimina la pérdida impermanente y optimiza tus posiciones automáticamente.`
  },
  algorithm: {
    title: `Algoritmo ${APP_NAME} - Innovación en la Gestión de Liquidez`,
    description: `Descubre cómo funciona el algoritmo de ${APP_NAME} para maximizar rendimientos y minimizar riesgos en pools de liquidez concentrada de Uniswap.`
  },
  howItWorks: {
    title: `Cómo Funciona ${APP_NAME} - Gestión de Liquidez DeFi Simplificada`,
    description: `Guía paso a paso de cómo funciona la plataforma ${APP_NAME} para gestionar tu liquidez en DeFi de forma segura y rentable.`
  },
  terms: {
    title: `Términos de Uso - ${APP_NAME}`,
    description: `Términos y condiciones legales para el uso de la plataforma ${APP_NAME} de gestión de liquidez en DeFi.`
  },
  privacy: {
    title: `Política de Privacidad - ${APP_NAME}`,
    description: `Política de privacidad de ${APP_NAME} detallando cómo tratamos tus datos en nuestra plataforma de gestión de liquidez DeFi.`
  },
  disclaimer: {
    title: `Aviso Legal - ${APP_NAME}`,
    description: `Información legal importante sobre los servicios de gestión de liquidez DeFi proporcionados por ${APP_NAME}.`
  }
};

/**
 * Mapea una URL a un tipo de página específica
 * @param url - URL de la página
 * @returns El tipo de página o undefined si no coincide con ninguna conocida
 */
function getPageType(url: string): PageType | undefined {
  const cleanUrl = url.split('?')[0].split('#')[0];
  
  if (cleanUrl === '/' || cleanUrl === '') return 'landing';
  if (cleanUrl === '/algorithm-details') return 'algorithm';
  if (cleanUrl === '/how-it-works') return 'howItWorks';
  if (cleanUrl === '/terms-of-use') return 'terms';
  if (cleanUrl === '/privacy-policy') return 'privacy';
  if (cleanUrl === '/disclaimer') return 'disclaimer';
  
  return undefined;
}

/**
 * Genera metaetiquetas HTML basadas en la URL de la página
 * @param url - URL de la página
 * @returns Cadena HTML con las metaetiquetas
 */
function generateMetaTags(url: string): string {
  const pageType = getPageType(url);
  
  // Usar metadatos específicos o por defecto
  const title = pageType ? PAGE_METADATA[pageType].title : DEFAULT_METADATA.title;
  const description = pageType ? PAGE_METADATA[pageType].description : DEFAULT_METADATA.description;
  const fullUrl = DEFAULT_METADATA.siteUrl + url;
  
  return `
    <!-- Metadatos SEO Básicos -->
    <meta name="description" content="${description}">
    <meta name="keywords" content="${DEFAULT_METADATA.keywords}">
    <meta name="author" content="${APP_NAME}">
    <meta name="robots" content="index, follow">
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website">
    <meta property="og:url" content="${fullUrl}">
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${description}">
    <meta property="og:image" content="${DEFAULT_METADATA.siteUrl}${DEFAULT_METADATA.image}">
    <meta property="og:site_name" content="${APP_NAME}">
    
    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:site" content="${DEFAULT_METADATA.twitterHandle}">
    <meta name="twitter:title" content="${title}">
    <meta name="twitter:description" content="${description}">
    <meta name="twitter:image" content="${DEFAULT_METADATA.siteUrl}${DEFAULT_METADATA.image}">
    
    <!-- Otras metaetiquetas -->
    <meta name="theme-color" content="${DEFAULT_METADATA.themeColor}">
    <link rel="canonical" href="${fullUrl}">
  `;
}

/**
 * Genera datos estructurados JSON-LD para SEO
 * @param url - URL de la página
 * @returns Cadena HTML con el script JSON-LD
 */
function generateStructuredData(url: string): string {
  const pageType = getPageType(url);
  
  // Usar metadatos específicos o por defecto
  const title = pageType ? PAGE_METADATA[pageType].title : DEFAULT_METADATA.title;
  const description = pageType ? PAGE_METADATA[pageType].description : DEFAULT_METADATA.description;
  
  // Datos estructurados básicos para Organization y WebSite
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${DEFAULT_METADATA.siteUrl}/#organization`,
        'name': `${APP_NAME}`,
        'url': DEFAULT_METADATA.siteUrl,
        'logo': {
          '@type': 'ImageObject',
          '@id': `${DEFAULT_METADATA.siteUrl}/#logo`,
          'inLanguage': 'es',
          'url': `${DEFAULT_METADATA.siteUrl}${DEFAULT_METADATA.image}`,
          'contentUrl': `${DEFAULT_METADATA.siteUrl}${DEFAULT_METADATA.image}`,
          'width': 1200,
          'height': 630,
          'caption': `${APP_NAME}`
        },
        'image': { '@id': `${DEFAULT_METADATA.siteUrl}/#logo` }
      },
      {
        '@type': 'WebSite',
        '@id': `${DEFAULT_METADATA.siteUrl}/#website`,
        'url': DEFAULT_METADATA.siteUrl,
        'name': `${APP_NAME}`,
        'description': DEFAULT_METADATA.description,
        'publisher': { '@id': `${DEFAULT_METADATA.siteUrl}/#organization` },
        'inLanguage': 'es'
      },
      {
        '@type': 'WebPage',
        '@id': `${DEFAULT_METADATA.siteUrl}${url}/#webpage`,
        'url': `${DEFAULT_METADATA.siteUrl}${url}`,
        'name': title,
        'isPartOf': { '@id': `${DEFAULT_METADATA.siteUrl}/#website` },
        'description': description,
        'inLanguage': 'es',
        'potentialAction': [
          {
            '@type': 'ReadAction',
            'target': [`${DEFAULT_METADATA.siteUrl}${url}`]
          }
        ]
      }
    ]
  };
  
  // Añadir datos específicos según el tipo de página
  if (pageType === 'algorithm' || pageType === 'howItWorks') {
    const articleData: any = {
      '@type': 'TechArticle',
      '@id': `${DEFAULT_METADATA.siteUrl}${url}/#article`,
      'isPartOf': { '@id': `${DEFAULT_METADATA.siteUrl}${url}/#webpage` },
      'headline': title,
      'description': description,
      'publisher': { '@id': `${DEFAULT_METADATA.siteUrl}/#organization` },
      'mainEntityOfPage': { '@id': `${DEFAULT_METADATA.siteUrl}${url}/#webpage` }
    };
    
    structuredData['@graph'].push(articleData);
  }
  
  return `
    <script type="application/ld+json">
      ${JSON.stringify(structuredData, null, 2)}
    </script>
  `;
}

/**
 * Mejora el HTML con metadatos SEO y datos estructurados
 * @param html - HTML original
 * @param url - URL de la página
 * @returns HTML mejorado con metadatos SEO
 */
export function enhanceHtmlWithSeoMetadata(html: string, url: string): string {
  const pageType = getPageType(url);
  
  // Si no es una página reconocida, devolvemos el HTML original
  if (!pageType) return html;
  
  const metaTags = generateMetaTags(url);
  const structuredData = generateStructuredData(url);
  const pageTitle = pageType ? PAGE_METADATA[pageType].title : DEFAULT_METADATA.title;
  
  // Reemplazar el título si existe
  let enhancedHtml = html.replace(/<title>.*?<\/title>/i, `<title>${pageTitle}</title>`);
  
  // Añadir metaetiquetas antes del cierre del head
  enhancedHtml = enhancedHtml.replace('</head>', `${metaTags}\n</head>`);
  
  // Añadir datos estructurados después de la apertura del body
  enhancedHtml = enhancedHtml.replace('<body>', `<body>\n${structuredData}`);
  
  return enhancedHtml;
}