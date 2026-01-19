/**
 * Configuración global de la aplicación - WayPool.net
 *
 * Este archivo contiene configuraciones y constantes importantes
 * utilizadas en toda la aplicación, incluyendo nombres, dominios, etc.
 */

// Nombre de la aplicación
export const APP_NAME = 'WayPool';
export const OLD_APP_NAME = 'WayPool';

// Dominios canónicos - waypool.net es el dominio principal de producción
export const CANONICAL_DOMAIN = 'waypool.net';
export const CANONICAL_BASE_URL = `https://${CANONICAL_DOMAIN}`;

// Dominios antiguos (para redirecciones)
// NOTA: waypool.net NO está aquí porque es el dominio canónico
export const OLD_DOMAINS = [
  'waypool.finance',
  'app.waypool.net',
];

// Configuración para metadatos de SEO
export const DEFAULT_TITLE = 'WayPool | The Intelligent Liquidity Management Platform';
export const DEFAULT_DESCRIPTION = 'WayPool is the ultimate platform for optimizing your Uniswap V3 liquidity positions. Maximize yields and minimize risks with our advanced analytics tools.';
export const DEFAULT_KEYWORDS = 'defi, liquidity, uniswap, crypto, yield, finance, blockchain, ethereum, web3, staking, trading, investing, polygon';
export const DEFAULT_OG_IMAGE = '/images/waypool-og-image.jpg';
export const DEFAULT_TWITTER_HANDLE = '@waypool_net';

// Configuración para documentación
export const DOCS_URL = 'https://docs.waypool.net';
export const API_DOCS_URL = 'https://api.waypool.net/docs';
export const GITHUB_URL = 'https://github.com/waypool';

// Configuración para redes sociales
export const TWITTER_URL = 'https://twitter.com/waypool_net';
export const TELEGRAM_URL = 'https://t.me/waypool_net';
export const DISCORD_URL = 'https://discord.gg/waypool';

// Mapa de lenguajes soportados
export const SUPPORTED_LANGUAGES = {
  en: 'English',
  es: 'Español',
  pt: 'Português',
  fr: 'Français',
  de: 'Deutsch',
  it: 'Italiano',
  ar: 'العربية',
  hi: 'हिन्दी',
  zh: '中文'
};

/**
 * Obtiene la URL canónica para una ruta específica
 * @param path Ruta relativa sin el dominio
 * @returns URL canónica completa para la ruta
 */
export function getCanonicalUrl(path: string): string {
  // Normalizar path (asegurar que comienza con /)
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${CANONICAL_BASE_URL}${normalizedPath}`;
}
