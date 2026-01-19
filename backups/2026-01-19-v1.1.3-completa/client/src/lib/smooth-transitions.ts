/**
 * Utilidad para manejar transiciones suaves entre páginas
 */

/**
 * Realiza una transición suave amortiguada al cambiar de página
 * @param href - URL a la que se navegará
 * @param callback - Función que ejecuta la navegación (normalmente de wouter)
 */
export const smoothPageTransition = (href: string, callback: (to: string) => void): void => {
  // Guardamos la posición actual de scroll
  const currentScrollPosition = window.scrollY;
  
  // Creamos una animación de salida con un elemento que cubre toda la pantalla
  const overlay = document.createElement('div');
  overlay.style.position = 'fixed';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.width = '100%';
  overlay.style.height = '100%';
  overlay.style.backgroundColor = 'var(--background)';
  overlay.style.zIndex = '9999';
  overlay.style.opacity = '0';
  overlay.style.pointerEvents = 'none';
  overlay.style.transition = 'opacity 300ms cubic-bezier(0.65, 0, 0.35, 1)';
  
  document.body.appendChild(overlay);
  
  // Animación de salida
  requestAnimationFrame(() => {
    overlay.style.opacity = '0.5';
    
    // Amortiguamos el scroll actual
    window.scrollTo({
      top: Math.max(0, currentScrollPosition - 50),
      behavior: 'smooth'
    });
    
    setTimeout(() => {
      // Guardamos en sessionStorage que venimos de una transición
      // para que la página de destino pueda animar su entrada
      sessionStorage.setItem('smoothTransition', 'true');
      
      // Ejecutamos la navegación
      callback(href);
      
      // Limpiamos el overlay después de la navegación
      setTimeout(() => {
        document.body.removeChild(overlay);
      }, 100);
    }, 280);
  });
};

/**
 * Hook que se usa en la página de destino para animar la entrada
 */
export const setupEntryAnimation = (): void => {
  const hadSmoothTransition = sessionStorage.getItem('smoothTransition') === 'true';
  
  if (hadSmoothTransition) {
    // Limpiamos la bandera
    sessionStorage.removeItem('smoothTransition');
    
    // Creamos un overlay para la animación de entrada
    const entryOverlay = document.createElement('div');
    entryOverlay.style.position = 'fixed';
    entryOverlay.style.top = '0';
    entryOverlay.style.left = '0';
    entryOverlay.style.width = '100%';
    entryOverlay.style.height = '100%';
    entryOverlay.style.backgroundColor = 'var(--background)';
    entryOverlay.style.zIndex = '9999';
    entryOverlay.style.opacity = '0.5';
    entryOverlay.style.pointerEvents = 'none';
    entryOverlay.style.transition = 'opacity 400ms cubic-bezier(0.65, 0, 0.35, 1)';
    
    document.body.appendChild(entryOverlay);
    
    // Aseguramos que estamos al principio de la página
    window.scrollTo(0, 0);
    
    // Animación de entrada
    requestAnimationFrame(() => {
      entryOverlay.style.opacity = '0';
      
      setTimeout(() => {
        document.body.removeChild(entryOverlay);
      }, 400);
    });
  }
};