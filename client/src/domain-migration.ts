/**
 * Utilidades para migración de dominio en el cliente
 * 
 * Este archivo contiene funciones para asegurar la correcta migración
 * del dominio waybank.info a waybank.finance, asegurando que los enlaces,
 * referencias, etc. sean actualizados adecuadamente.
 */

import { APP_NAME, OLD_APP_NAME, CANONICAL_DOMAIN, OLD_DOMAINS } from './utils/app-config';

/**
 * Verifica si el dominio actual es un dominio antiguo
 * @returns true si estamos en un dominio antiguo, false en caso contrario
 */
export function isOldDomain(): boolean {
  const currentHost = window.location.hostname;
  return OLD_DOMAINS.some(domain => 
    currentHost === domain || currentHost.endsWith(`.${domain}`)
  );
}

/**
 * Verifica si el dominio actual es el dominio canónico
 * @returns true si estamos en el dominio canónico, false en caso contrario
 */
export function isCanonicalDomain(): boolean {
  const currentHost = window.location.hostname;
  return currentHost === CANONICAL_DOMAIN || currentHost.endsWith(`.${CANONICAL_DOMAIN}`);
}

/**
 * Redirige al usuario al dominio canónico si está en un dominio antiguo
 * @param force Si es true, redirige incluso si no es un dominio antiguo
 * @returns true si realizó una redirección, false en caso contrario
 */
export function redirectToCanonicalDomain(force: boolean = false): boolean {
  // Solo redirigir si es un dominio antiguo o se fuerza la redirección
  if (force || isOldDomain()) {
    const currentHost = window.location.hostname;
    const protocol = window.location.protocol;
    const path = window.location.pathname;
    const search = window.location.search;
    const hash = window.location.hash;
    
    // Determinar el nuevo host
    const newHost = currentHost.replace(/waybank\.(net|finance)/, `${CANONICAL_DOMAIN}`);
    
    // Crear la nueva URL
    const newUrl = `${protocol}//${newHost}${path}${search}${hash}`;
    
    // Redirigir utilizando window.location
    window.location.href = newUrl;
    return true;
  }
  
  return false;
}

/**
 * Reemplaza todas las menciones del nombre de aplicación antiguo por el nuevo
 * @param content Contenido a procesar
 * @returns Contenido con las menciones reemplazadas
 */
export function replaceAppName(content: string): string {
  // Crear expresiones regulares con y sin distinciones de mayúsculas y minúsculas
  const regexCaseSensitive = new RegExp(OLD_APP_NAME, 'g');
  const regexCaseInsensitive = new RegExp(OLD_APP_NAME, 'gi');
  
  // Reemplazar primero las coincidencias exactas
  let replacedContent = content.replace(regexCaseSensitive, APP_NAME);
  
  // Luego reemplazar las coincidencias sin distinción de mayúsculas y minúsculas
  // pero asegurándose de preservar el formato de las letras (mayúsculas/minúsculas)
  replacedContent = replacedContent.replace(regexCaseInsensitive, (match) => {
    if (match === OLD_APP_NAME) return APP_NAME;
    if (match === OLD_APP_NAME.toLowerCase()) return APP_NAME.toLowerCase();
    if (match === OLD_APP_NAME.toUpperCase()) return APP_NAME.toUpperCase();
    
    // Para otros casos, mantener el mismo patrón de capitalización
    return match.replace(OLD_APP_NAME.toLowerCase(), APP_NAME.toLowerCase());
  });
  
  return replacedContent;
}

/**
 * Actualiza las referencias a la aplicación en el DOM
 * Esta función puede ser utilizada para actualizar textos mostrados
 * después de que la página ha cargado
 */
export function updateDomReferences(): void {
  // Actualizar el título de la página si es necesario
  if (document.title.includes(OLD_APP_NAME)) {
    document.title = replaceAppName(document.title);
  }
  
  // Recorrer todos los nodos de texto en el documento y reemplazar referencias al nombre antiguo
  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    null
  );
  
  let node;
  while ((node = walker.nextNode())) {
    if (node.nodeValue && node.nodeValue.includes(OLD_APP_NAME)) {
      node.nodeValue = replaceAppName(node.nodeValue);
    }
  }
  
  // Buscar y actualizar atributos href con dominios antiguos
  const links = document.querySelectorAll('a[href*="waybank"]');
  links.forEach(link => {
    const href = link.getAttribute('href');
    if (href) {
      // Reemplazar dominio antiguo por el nuevo en los enlaces
      const newHref = href.replace(/waybank\.(net|finance)/g, CANONICAL_DOMAIN);
      link.setAttribute('href', newHref);
    }
  });
}