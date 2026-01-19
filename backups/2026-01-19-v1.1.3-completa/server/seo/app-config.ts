/**
 * Configuración SEO - Servidor
 * 
 * Contiene constantes y configuraciones relacionadas con SEO para
 * el servidor, incluyendo dominios y nombres de la aplicación.
 */

// Nombre de la aplicación
export const APP_NAME = 'WayBank';
export const OLD_APP_NAME = 'WayBank';

// Dominios canónicos y alternativos
export const CANONICAL_DOMAIN = 'waybank.finance';
export const CANONICAL_BASE_URL = `https://${CANONICAL_DOMAIN}`;

// Dominios antiguos (para redirecciones y SEO)
export const OLD_DOMAINS = [
  'waybank.info',
  'waybank.finance',
  'app.waybank.info',
];

// Dominios nuevos (para enlaces alternativos)
export const NEW_DOMAINS = [
  'waybank.finance',  // Canónico
  'waybank.info',      // Alternativo
];

/**
 * Verifica si un dominio dado es un dominio antiguo
 * @param domain Dominio a verificar
 * @returns true si es un dominio antiguo, false en caso contrario
 */
export function isOldDomain(domain: string): boolean {
  return OLD_DOMAINS.some(oldDomain => 
    domain === oldDomain || domain.endsWith(`.${oldDomain}`)
  );
}

/**
 * Verifica si un dominio dado es el dominio canónico
 * @param domain Dominio a verificar
 * @returns true si es el dominio canónico, false en caso contrario
 */
export function isCanonicalDomain(domain: string): boolean {
  return domain === CANONICAL_DOMAIN || domain.endsWith(`.${CANONICAL_DOMAIN}`);
}

/**
 * Reemplaza todas las menciones del nombre de aplicación antiguo por el nuevo
 * @param content Contenido a procesar
 * @returns Contenido con las menciones reemplazadas
 */
export function replaceAppName(content: string): string {
  return content
    .replace(new RegExp(OLD_APP_NAME, 'g'), APP_NAME)
    .replace(new RegExp(OLD_APP_NAME.toLowerCase(), 'g'), APP_NAME.toLowerCase());
}

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