import { useEffect } from 'react';

/**
 * Componente que corrige el problema de fondos grises en versión móvil
 * Aplica correcciones agresivas directamente al DOM para asegurar fondos oscuros
 */
export const GrayBackgroundFixer = () => {
  useEffect(() => {
    // Solo ejecutamos en móvil
    if (window.innerWidth <= 768) {
      console.log('[GrayFix] Iniciando corrección de fondos grises...');
      
      // Función para corregir elementos
      const fixElements = () => {
        // Corregir varios elementos que pueden tener fondo gris
        const selectors = [
          'span.bg-slate-700, span.rounded-lg, span.px-4',
          'div > span.px-4.py-2.rounded-lg, div > span.px-4.py-2',
          'div.p-3.rounded-full, div.p-3.rounded-full.w-fit',
          '.dark-feature-card h3',
          '.dark-feature-card div.flex.items-center.justify-center',
          'h3 span.bg-slate-700, h3 span.px-4'
        ];
        
        let totalFixed = 0;
        
        selectors.forEach(selector => {
          const elements = document.querySelectorAll(selector);
          console.log(`[GrayFix] Corregidos ${elements.length} elementos con selector: ${selector}`);
          
          elements.forEach(el => {
            if (el instanceof HTMLElement) {
              el.style.backgroundColor = 'rgb(19, 24, 54)';
              el.style.borderColor = 'rgb(39, 46, 79)';
              totalFixed++;
            }
          });
        });
        
        // Aplicar CSS agresivo para asegurar que no queden fondos grises
        const styleEl = document.createElement('style');
        styleEl.innerHTML = `
          @media (max-width: 768px) {
            .dark body, .dark div, .dark section {
              background-color: rgb(9, 14, 33) !important;
            }
            
            .dark .bg-muted, 
            .dark .bg-muted\\/50,
            .dark .bg-background\\/50,
            .dark .bg-background\\/90,
            .dark .bg-card {
              background-color: rgb(19, 24, 54) !important;
            }
            
            .dark div.rounded-xl, 
            .dark div.card,
            .dark div.shadow-lg,
            .dark div.shadow-xl {
              background-color: rgb(19, 24, 54) !important;
              border-color: rgb(39, 46, 79) !important;
            }
          }
        `;
        document.head.appendChild(styleEl);
        console.log('[GrayFix] CSS agresivo inyectado');
        
        // Retornamos el número total de elementos corregidos
        return totalFixed;
      };
      
      // Corregir elementos al cargar
      fixElements();
      console.log('[GrayFix] Corrección de fondos grises completada');
      
      // Configurar un observador para detectar cambios en el DOM
      const observer = new MutationObserver((mutations) => {
        fixElements();
      });
      
      // Iniciar la observación del documento
      observer.observe(document.body, { 
        childList: true, 
        subtree: true 
      });
      console.log('[GrayFix] Observador de mutaciones activado');
      
      // Limpiar observador al desmontar
      return () => {
        observer.disconnect();
      };
    }
  }, []);

  return null; // Este componente no renderiza nada visible
};

export default GrayBackgroundFixer;