/**
 * Función para realizar un desplazamiento suave a la parte superior de la página
 * o a un elemento específico si se proporciona un ID
 */
export function smoothScrollToTop(elementId?: string) {
  const scrollOptions: ScrollToOptions = {
    top: 0,
    behavior: 'smooth'
  };
  
  if (elementId) {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
      return;
    }
  }
  
  window.scrollTo(scrollOptions);
}

/**
 * Hook para agregar un evento de scroll al encabezado
 * Útil para crear efectos visuales en el encabezado al hacer scroll
 */
export function setupHeaderScrollEffect(callback: (scrollY: number) => void) {
  const handleScroll = () => {
    callback(window.scrollY);
  };
  
  window.addEventListener('scroll', handleScroll);
  
  return () => {
    window.removeEventListener('scroll', handleScroll);
  };
}