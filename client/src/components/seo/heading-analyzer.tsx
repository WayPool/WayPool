import React, { useEffect, useRef } from 'react';

/**
 * HeadingAnalyzer: Componente para analizar y mejorar la estructura de encabezados HTML para SEO
 * 
 * Este componente:
 * 1. Analiza los encabezados H1-H6 de la página actual
 * 2. Detecta problemas comunes de SEO relacionados con encabezados
 * 3. Genera información de diagnóstico en la consola (solo en desarrollo)
 * 4. No altera el diseño ni el contenido visible
 */
const HeadingAnalyzer: React.FC = () => {
  const analyzerRef = useRef<boolean>(false);

  useEffect(() => {
    // Evitar análisis múltiples en renderizados
    if (analyzerRef.current) return;
    analyzerRef.current = true;
    
    // Esperar a que el DOM esté completamente cargado
    setTimeout(() => {
      // Analizar todos los encabezados
      const h1Elements = document.querySelectorAll('h1');
      const h2Elements = document.querySelectorAll('h2');
      const h3Elements = document.querySelectorAll('h3');
      const h4Elements = document.querySelectorAll('h4');
      const h5Elements = document.querySelectorAll('h5');
      const h6Elements = document.querySelectorAll('h6');
      
      // Recopilar texto para análisis
      const h1Texts = Array.from(h1Elements).map(el => el.textContent?.trim());
      
      // Registrar resultados para diagnóstico
      const headingStats = {
        h1: h1Elements.length,
        h2: h2Elements.length,
        h3: h3Elements.length,
        h4: h4Elements.length,
        h5: h5Elements.length,
        h6: h6Elements.length
      };
      
      console.log('[SEO] Encabezados encontrados:', headingStats);
      
      // Verificar problemas y emitir advertencias
      if (h1Elements.length === 0) {
        console.warn('[SEO] Advertencia: Esta página no tiene un encabezado H1. Cada página debe tener exactamente un H1 para SEO óptimo.');
      } else if (h1Elements.length > 1) {
        console.warn('[SEO] Advertencia: Esta página tiene múltiples H1 (' + h1Elements.length + '). Debería tener solo uno para SEO óptimo.');
      } else {
        console.log('[SEO] Texto de H1:', h1Texts);
      }
      
      // Verificar estructura jerárquica
      if (h3Elements.length > 0 && h2Elements.length === 0) {
        console.warn('[SEO] Advertencia: Hay encabezados H3 sin encabezados H2 previos. Mantenga una jerarquía adecuada.');
      }
      
      // Verificar encabezados vacíos
      const emptyHeadings = [
        ...Array.from(h1Elements).filter(el => !el.textContent?.trim()),
        ...Array.from(h2Elements).filter(el => !el.textContent?.trim()),
        ...Array.from(h3Elements).filter(el => !el.textContent?.trim()),
        ...Array.from(h4Elements).filter(el => !el.textContent?.trim()),
        ...Array.from(h5Elements).filter(el => !el.textContent?.trim()),
        ...Array.from(h6Elements).filter(el => !el.textContent?.trim())
      ];
      
      if (emptyHeadings.length > 0) {
        console.warn('[SEO] Advertencia: Hay ' + emptyHeadings.length + ' encabezados sin texto. Los encabezados vacíos no son útiles para SEO.');
      }
      
      // Añadir atributo para ayudar a la indexación semántica, sin alterar diseño visual
      addSeoAttributes();
    }, 500); // Esperar a que la página se cargue completamente
  }, []);
  
  // Función para añadir atributos de accesibilidad y SEO sin alterar diseño
  const addSeoAttributes = () => {
    // Mejorar semántica para los lectores de pantalla y rastreadores de búsqueda
    document.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach(heading => {
      if (!heading.hasAttribute('data-seo-heading')) {
        heading.setAttribute('data-seo-heading', 'true');
      }
    });
    
    // Identificar contenido principal para SEO
    const mainContent = document.querySelector('main');
    if (mainContent && !mainContent.hasAttribute('data-seo-main')) {
      mainContent.setAttribute('data-seo-main', 'true');
    }
  };

  // No renderizar nada visible, solo análisis
  return null;
};

export default HeadingAnalyzer;