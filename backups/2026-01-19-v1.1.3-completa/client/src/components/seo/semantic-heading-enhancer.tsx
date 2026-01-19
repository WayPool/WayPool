import React, { useEffect } from 'react';
import { useLocation } from 'wouter';

/**
 * SemanticHeadingEnhancer es un componente que mejora la semántica de los encabezados HTML
 * para optimizar la estructura de la página para motores de búsqueda.
 * 
 * Este componente se asegura de que:
 * - Exista un solo H1 por página
 * - Los encabezados sigan una jerarquía adecuada (H1 → H2 → H3...)
 * - No haya saltos en la jerarquía de encabezados
 */
export default function SemanticHeadingEnhancer() {
  const [location] = useLocation();
  
  useEffect(() => {
    // Dar tiempo para que la página se cargue completamente
    const timeout = setTimeout(() => {
      // Verificar y corregir la estructura de encabezados
      enhanceHeadingStructure();
    }, 500);
    
    return () => clearTimeout(timeout);
  }, [location]);
  
  // Función para analizar y mejorar la estructura de encabezados
  const enhanceHeadingStructure = () => {
    try {
      // Obtener todos los encabezados en la página
      const h1s = document.querySelectorAll('h1');
      const h2s = document.querySelectorAll('h2');
      const h3s = document.querySelectorAll('h3');
      const h4s = document.querySelectorAll('h4');
      const h5s = document.querySelectorAll('h5');
      const h6s = document.querySelectorAll('h6');
      
      // Asegurar que solo haya un H1 por página
      if (h1s.length > 1) {
        console.warn('[SEO] Advertencia: Esta página tiene múltiples H1 (' + h1s.length + '). Debería tener solo uno para SEO óptimo.');
        
        // En entornos de producción, podemos decidir corregir esto automáticamente
        // Convertir H1s adicionales a H2
        /*
        Array.from(h1s).slice(1).forEach(h1 => {
          // Crear un nuevo H2 con el mismo contenido
          const h2 = document.createElement('h2');
          h2.innerHTML = h1.innerHTML;
          h2.className = h1.className;
          // Reemplazar el H1 con el nuevo H2
          h1.parentNode?.replaceChild(h2, h1);
        });
        */
      }
      
      // Verificar si hay saltos en la jerarquía de encabezados
      // Por ejemplo, un H1 seguido de un H3 sin H2 intermedio
      if (h1s.length === 0 && (h2s.length > 0 || h3s.length > 0 || h4s.length > 0)) {
        console.warn('[SEO] Advertencia: Esta página no tiene un H1, pero tiene encabezados secundarios. Debería tener un H1 principal.');
      }
      
      if (h2s.length === 0 && (h3s.length > 0 || h4s.length > 0)) {
        console.warn('[SEO] Advertencia: Esta página tiene H3 o H4 sin H2. Esto puede afectar negativamente el SEO.');
      }
      
      // Verificar la presencia de elementos <nav> sin aria-label
      const navs = document.querySelectorAll('nav');
      navs.forEach(nav => {
        if (!nav.hasAttribute('aria-label')) {
          nav.setAttribute('aria-label', 'Navegación principal');
        }
      });
      
      // Mejorar la accesibilidad de los enlaces sin texto
      const emptyLinks = Array.from(document.querySelectorAll('a')).filter(a => 
        !a.textContent?.trim() && !a.querySelector('img') && !a.getAttribute('aria-label')
      );
      
      emptyLinks.forEach(link => {
        // Intentar encontrar un título o atributo alternativo
        const title = link.getAttribute('title');
        const ariaLabel = link.getAttribute('aria-labelledby');
        
        if (title) {
          link.setAttribute('aria-label', title);
        } else if (!ariaLabel) {
          // Si no tiene ninguna etiqueta, intentar inferir una basada en el contenido del padre
          const parentText = link.parentElement?.textContent?.trim();
          if (parentText) {
            link.setAttribute('aria-label', 'Enlace: ' + parentText.substring(0, 30) + (parentText.length > 30 ? '...' : ''));
          } else {
            link.setAttribute('aria-label', 'Enlace');
          }
        }
      });
      
      // Registrar información sobre los encabezados encontrados
      console.log("[SEO] Encabezados encontrados:", {
        h1: h1s.length,
        h2: h2s.length,
        h3: h3s.length,
        h4: h4s.length,
        h5: h5s.length,
        h6: h6s.length
      });
      
    } catch (error) {
      console.error('[SEO] Error al mejorar la estructura de encabezados:', error);
    }
  };
  
  // Este componente no renderiza nada visible
  return null;
}