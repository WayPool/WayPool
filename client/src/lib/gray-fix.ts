/**
 * Script para corregir fondos grises persistentes en dispositivos móviles
 * 
 * Este script busca elementos con fondo gris claro y los corrige dinámicamente
 * aplicando el fondo azul oscuro correcto en modo oscuro.
 */

export function initGrayFix() {
  // Solo ejecutar en móviles
  if (window.innerWidth > 768) return;
  
  // Solo ejecutar en modo oscuro
  if (!document.documentElement.classList.contains('dark')) return;
  
  console.log('[GrayFix] Iniciando corrección de fondos grises...');
  
  // Corregir elementos con span y bg-slate-700
  fixElementsBySelector('span.bg-slate-700, span.rounded-lg, span.px-4');
  
  // Corregir específicamente el elemento de "Minimize Risks"
  fixElementsBySelector('div > span.px-4.py-2.rounded-lg, div > span.px-4.py-2');
  
  // Corregir contenedores de iconos
  fixElementsBySelector('div.p-3.rounded-full, div.p-3.rounded-full.w-fit');
  
  // Corregir elementos específicos de la landing page
  fixElementsBySelector('.dark-feature-card h3');
  fixElementsBySelector('.dark-feature-card div.flex.items-center.justify-center');
  
  // Corregir titulos de secciones
  fixElementsBySelector('h3 span.bg-slate-700, h3 span.px-4');

  // Insertar CSS agresivo para casos específicos
  injectAggressiveCSS();
  
  console.log('[GrayFix] Corrección de fondos grises completada');
}

function fixElementsBySelector(selector: string) {
  const elements = document.querySelectorAll(selector);
  
  elements.forEach(element => {
    // Aplicar estilo correcto
    element.setAttribute('style', `
      background-color: rgb(19, 24, 54) !important; 
      border: 1px solid rgb(39, 46, 79) !important;
      color: white !important;
    `);
    
    // Marcar como arreglado
    element.classList.add('gray-fixed');
  });
  
  console.log(`[GrayFix] Corregidos ${elements.length} elementos con selector: ${selector}`);
}

function injectAggressiveCSS() {
  // Crear estilo específico para el caso mostrado en la captura (Minimize Risk)
  const style = document.createElement('style');
  style.id = 'gray-fix-aggressive';
  style.textContent = `
    @media (max-width: 767px) {
      /* Corrección específica para "Minimize Risks" */
      html.dark span.px-4.py-2.rounded-lg,
      html.dark span.px-4.py-2,
      html.dark [class*="px-4"][class*="py-2"],
      html.dark span[class*="bg-slate"],
      html.dark span[class*="rounded"] {
        background-color: rgb(19, 24, 54) !important;
        border: 1px solid rgb(39, 46, 79) !important;
        color: white !important;
      }
      
      /* Forzar colores correctos para todos los spans dentro de h3 */
      html.dark h3 span {
        background-color: rgb(19, 24, 54) !important;
        border: 1px solid rgb(39, 46, 79) !important;
      }
      
      /* Forzar iconos con fondo correcto */
      html.dark div[class*="w-16"][class*="h-16"],
      html.dark div[class*="rounded-full"],
      html.dark div[class*="justify-center"][class*="items-center"] svg {
        background-color: rgb(19, 24, 54) !important;
        border: 1px solid rgb(39, 46, 79) !important;
      }
    }
  `;
  
  document.head.appendChild(style);
  console.log('[GrayFix] CSS agresivo inyectado');
}

// Ejecutar script múltiples veces para capturar elementos que se cargan dinámicamente
export function setupRecurringFix() {
  // Ejecutar inmediatamente
  initGrayFix();
  
  // Ejecutar después de 500ms (después del primer render)
  setTimeout(initGrayFix, 500);
  
  // Ejecutar después de 1500ms (después de cargar datos dinámicos)
  setTimeout(initGrayFix, 1500);
  
  // Ejecutar después de 3000ms (captura tardía)
  setTimeout(initGrayFix, 3000);
  
  // También añadir un observador para ajustar elementos que se creen dinámicamente
  const observer = new MutationObserver((mutations) => {
    let needsFix = false;
    
    // Revisar si las mutaciones añadieron elementos que podrían necesitar arreglo
    mutations.forEach(mutation => {
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === 1) { // Es un elemento
            // Ver si es un elemento que podría tener fondo gris
            const element = node as Element;
            if (element.classList.contains('rounded-lg') || 
                element.classList.contains('rounded-full') ||
                element.tagName === 'SPAN') {
              needsFix = true;
            }
          }
        });
      }
    });
    
    // Si se añadieron elementos que posiblemente necesiten arreglo, ejecutar la corrección
    if (needsFix) {
      initGrayFix();
    }
  });
  
  // Comenzar a observar el documento
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
  
  console.log('[GrayFix] Observador de mutaciones activado');
}