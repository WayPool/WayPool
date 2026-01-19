/**
 * Componente para gestión SEO
 * 
 * Este componente se encarga de administrar aspectos SEO centralizados
 * como etiquetas meta, enlaces canónicos y otros elementos necesarios
 * para optimizar el posicionamiento y migración de dominio.
 */

import { useEffect } from 'react';
import { Helmet } from 'react-helmet'; // Asumiendo que se usa react-helmet
import { useLocation } from 'wouter';
import { APP_NAME, CANONICAL_BASE_URL, getCanonicalUrl } from '@/utils/app-config';

interface SeoManagerProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  children?: React.ReactNode;
  // Props compatibles con implementación anterior
  path?: string;
  type?: string;
  image?: string;
}

/**
 * Componente de gestión SEO que maneja todas las etiquetas meta, títulos y enlaces canónicos
 */
export default function SEOManager({
  title,
  description = `Maximiza tus rendimientos en Uniswap V4 con la optimización de liquidez inteligente de ${APP_NAME}.`,
  keywords = 'defi, crypto, uniswap, liquidity positions, ethereum, blockchain',
  ogImage = '/images/og-image.png',
  image, // Compatibilidad con versión anterior
  path, // Compatibilidad con versión anterior
  type, // Compatibilidad con versión anterior
  children
}: SeoManagerProps) {
  // Compatibilidad con versión anterior
  const finalOgImage = image || ogImage;
  const [location] = useLocation();
  
  // Formatear título para incluir el nombre de la aplicación cuando sea necesario
  const formattedTitle = title ? `${title} | ${APP_NAME}` : `${APP_NAME} - Optimización Inteligente de Liquidez`;
  
  // Obtener URL canónica para la página actual
  const canonicalUrl = getCanonicalUrl(location);
  
  // Verificar y actualizar etiquetas cuando cambia la ruta
  useEffect(() => {
    // Añadir o actualizar etiqueta canónica
    let canonicalTag = document.querySelector('link[rel="canonical"]');
    if (!canonicalTag) {
      canonicalTag = document.createElement('link');
      canonicalTag.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalTag);
    }
    canonicalTag.setAttribute('href', canonicalUrl);
    
    // Limpiar la etiqueta cuando el componente se desmonte
    return () => {
      // No eliminar, sólo actualizar en cada cambio de ruta
    };
  }, [location, canonicalUrl]);
  
  return (
    <Helmet>
      {/* Metadatos básicos */}
      <title>{formattedTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      {/* Enlaces canónicos y alternativos */}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Metadatos para redes sociales - Open Graph */}
      <meta property="og:title" content={formattedTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={`${CANONICAL_BASE_URL}${finalOgImage}`} />
      <meta property="og:site_name" content={APP_NAME} />
      
      {/* Metadatos para Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={formattedTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`${CANONICAL_BASE_URL}${finalOgImage}`} />
      
      {/* Metadatos para migración de dominio */}
      <meta name="robots" content="index, follow" />
      
      {/* Children para permitir sobrescritura de etiquetas */}
      {children}
    </Helmet>
  );
}