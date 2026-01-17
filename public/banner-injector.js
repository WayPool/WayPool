// Script independiente para inyectar el banner de calculadora
// Este script se carga de forma separada para evitar conflictos con CSS existentes

(function() {
  // Función para crear un banner estático (HTML puro)
  function createStaticBanner() {
    // Crear un iframe - este método es el más aislado y a prueba de conflictos CSS
    const iframe = document.createElement('iframe');
    iframe.style.border = 'none';
    iframe.style.width = '100%';
    iframe.style.height = '60px'; // Altura fija
    iframe.style.overflow = 'hidden';
    iframe.style.marginTop = '20px';
    iframe.style.marginBottom = '20px';
    
    // Esta función se ejecutará cuando el iframe esté cargado
    iframe.onload = function() {
      // Acceder al documento dentro del iframe
      const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
      
      // Escribir el HTML directamente - completamente aislado del CSS de la página
      iframeDoc.open();
      iframeDoc.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              margin: 0;
              padding: 0;
              font-family: system-ui, -apple-system, sans-serif;
              background-color: #2563eb;
              cursor: pointer;
            }
            .banner {
              display: flex;
              justify-content: center;
              align-items: center;
              width: 100%;
              height: 60px;
              text-align: center;
            }
            h2 {
              color: white;
              font-size: 24px;
              font-weight: bold;
              margin: 0;
            }
          </style>
        </head>
        <body onclick="window.parent.open('https://waybank-delta-neutral-calculator.replit.app/', '_blank')">
          <div class="banner">
            <h2>PRUEBA NUESTRA CALCULADORA DELTA NEUTRAL</h2>
          </div>
        </body>
        </html>
      `);
      iframeDoc.close();
    };
    
    return iframe;
  }
  function injectBanner() {
    // Esperamos a que la página esté completamente cargada
    if (document.readyState === 'complete') {
      console.log('DOM completamente cargado, intentando inyectar el banner...');
      
      // Buscar el contenedor donde queremos insertar el banner
      const mainContainer = document.querySelector('main');
      const deltaSection = document.querySelector('.mb-16.rounded-xl.overflow-hidden.border.bg-card');
      const tabsContainer = document.querySelector('.w-full.tabs-list, .container main, main') || mainContainer;
      
      // Log de diagnóstico
      console.log('Contenedores encontrados:', {
        mainContainer: !!mainContainer,
        deltaSection: !!deltaSection,
        tabsContainer: !!tabsContainer
      });
      
      if (tabsContainer || mainContainer || deltaSection) {
        const targetContainer = deltaSection || tabsContainer || mainContainer;
        
        // Crear el iframe banner (totalmente aislado de los estilos de la página)
        const banner = createStaticBanner();
        
        // Insertar el banner después de la sección Delta Neutral
        if (deltaSection && deltaSection.nextSibling) {
          deltaSection.parentNode.insertBefore(banner, deltaSection.nextSibling);
          console.log('Banner insertado después de la sección Delta Neutral');
        } else {
          // Si no encuentra la sección Delta Neutral, lo inserta al principio del contenido principal
          const mainContent = document.querySelector('.space-y-8') || targetContainer;
          if (mainContent && mainContent.firstChild) {
            mainContent.insertBefore(banner, mainContent.firstChild);
            console.log('Banner insertado al principio del contenido principal');
          } else {
            targetContainer.appendChild(banner);
            console.log('Banner añadido al final del contenedor objetivo');
          }
        }
        
        console.log('Banner de calculadora Delta Neutral inyectado en la página');
      } else {
        console.error('No se encontró el contenedor para inyectar el banner');
        // Intentarlo de nuevo en 500ms
        setTimeout(injectBanner, 500);
      }
    } else {
      // Si la página no está lista, esperar y volver a intentarlo
      document.addEventListener('readystatechange', function() {
        if (document.readyState === 'complete') {
          setTimeout(injectBanner, 200);
        }
      });
    }
  }

  // Ejecutar cuando el DOM esté completamente cargado
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      setTimeout(injectBanner, 200);
    });
  } else {
    setTimeout(injectBanner, 200);
  }
  
  // También ejecutar un poco después para asegurarnos de que la página esté completamente renderizada
  setTimeout(injectBanner, 1000);
  setTimeout(injectBanner, 2000);
  setTimeout(injectBanner, 3000);
})();