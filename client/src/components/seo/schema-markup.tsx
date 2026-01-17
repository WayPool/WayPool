/**
 * Componente para marcado de datos estructurados (JSON-LD)
 * 
 * Este componente genera el marcado de datos estructurados para
 * mejorar el SEO y la visualización en los resultados de búsqueda.
 */

import { Helmet } from 'react-helmet';
import { APP_NAME, CANONICAL_BASE_URL } from '@/utils/app-config';

interface SchemaMarkupProps {
  pageType?: 'HomePage' | 'AboutPage' | 'ArticlePage' | 'ProductPage' | 'FaqPage';
  title?: string;
  description?: string;
  path?: string;
  imageUrl?: string;
  datePublished?: string;
  dateModified?: string;
}

/**
 * Componente que genera el marcado JSON-LD para SEO
 */
export default function SchemaMarkup({
  pageType = 'HomePage',
  title = `${APP_NAME} - Optimizador DeFi para posiciones de liquidez en Uniswap V4`,
  description = `${APP_NAME} le permite optimizar sus posiciones de liquidez en Uniswap V4 para maximizar rendimientos y minimizar riesgos.`,
  path = '/',
  imageUrl = '/images/og-image.png',
  datePublished = '2023-01-01T00:00:00Z',
  dateModified = new Date().toISOString()
}: SchemaMarkupProps) {
  // URL completa del sitio y página actual
  const siteUrl = CANONICAL_BASE_URL;
  const pageUrl = `${siteUrl}${path}`;
  const fullImageUrl = `${siteUrl}${imageUrl}`;
  
  // Esquema básico para el sitio web y organización
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${siteUrl}/#website`,
    'url': siteUrl,
    'name': APP_NAME,
    'description': `${APP_NAME} - Plataforma de optimización DeFi para posiciones de liquidez en Uniswap V4`,
    'publisher': {
      '@type': 'Organization',
      '@id': `${siteUrl}/#organization`,
      'name': APP_NAME,
      'logo': {
        '@type': 'ImageObject',
        '@id': `${siteUrl}/#logo`,
        'url': `${siteUrl}/logo.png`,
        'contentUrl': `${siteUrl}/logo.png`,
        'width': '512',
        'height': '512'
      }
    }
  };
  
  // Esquema para la página específica
  const pageSchema = {
    '@context': 'https://schema.org',
    '@type': pageType,
    '@id': `${pageUrl}#${pageType.toLowerCase()}`,
    'url': pageUrl,
    'name': title,
    'description': description,
    'isPartOf': {
      '@id': `${siteUrl}/#website`
    },
    'datePublished': datePublished,
    'dateModified': dateModified,
    'image': {
      '@type': 'ImageObject',
      '@id': `${pageUrl}#primaryimage`,
      'url': fullImageUrl,
      'width': '1200',
      'height': '630'
    },
    'inLanguage': 'es',
    'keywords': 'WayBank, DeFi, Liquidity, Uniswap, Blockchain, Ethereum, Crypto, Finance, APR, TVL',
    'mainEntityOfPage': {
      '@type': 'WebPage',
      '@id': pageUrl
    }
  };
  
  // Esquema para marcar la migración de dominio
  const siteLinksSearchBoxSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    'url': siteUrl,
    'potentialAction': {
      '@type': 'SearchAction',
      'target': `${siteUrl}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string'
    },
    'alternateName': ['WayBank Finance', 'WayBank DeFi']
  };
  
  // Combinar todos los esquemas
  const completeSchema = [
    websiteSchema,
    pageSchema,
    siteLinksSearchBoxSchema
  ];
  
  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(completeSchema)}
      </script>
    </Helmet>
  );
}