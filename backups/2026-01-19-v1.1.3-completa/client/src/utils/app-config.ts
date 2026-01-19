/**
 * Configuración global de la aplicación
 * 
 * Este archivo contiene configuraciones y constantes importantes
 * utilizadas en toda la aplicación, incluyendo nombres, dominios, etc.
 */

// Nombre de la aplicación
export const APP_NAME = 'WayBank';
export const OLD_APP_NAME = 'WayPool';

// Dominios canónicos
export const CANONICAL_DOMAIN = 'waybank.info';
export const CANONICAL_BASE_URL = `https://${CANONICAL_DOMAIN}`;

// Dominios antiguos (para redirecciones)
// NOTA: waypool.net removido porque es un dominio de producción activo
export const OLD_DOMAINS = [
  'waypool.finance',
  'waybank.finance',
];

// Configuración para metadatos de SEO
export const DEFAULT_TITLE = 'WayBank Finance | The Intelligent Liquidity Management Platform';
export const DEFAULT_DESCRIPTION = 'WayBank Finance is the ultimate platform for optimizing your Uniswap V4 liquidity positions. Maximize yields and minimize risks with our advanced AI and analytics tools.';
export const DEFAULT_KEYWORDS = 'defi, liquidity, uniswap, crypto, yield, finance, blockchain, ethereum, web3, staking, trading, investing';
export const DEFAULT_OG_IMAGE = '/images/waybank-og-image.jpg';
export const DEFAULT_TWITTER_HANDLE = '@waybank_finance';

// Configuración para documentación
export const DOCS_URL = 'https://docs.waybank.finance';
export const API_DOCS_URL = 'https://api.waybank.finance/docs';
export const GITHUB_URL = 'https://github.com/waybank';

// Configuración para redes sociales
export const TWITTER_URL = 'https://twitter.com/waybank_finance';
export const TELEGRAM_URL = 'https://t.me/waybank_finance';
export const DISCORD_URL = 'https://discord.gg/waybank';

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