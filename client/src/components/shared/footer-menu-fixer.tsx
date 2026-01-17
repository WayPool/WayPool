import React, { useEffect } from 'react';
import '@/styles/footer-menu-fix.css';

/**
 * Componente que mejora los estilos de los menús del footer para móviles
 * Elimina fondos grises y encuadres innecesarios
 */
const FooterMenuFixer: React.FC = () => {
  useEffect(() => {
    // Función para aplicar clases a elementos específicos
    const applyClassesToElements = () => {
      try {
        // Seleccionar elementos del menú de footer
        const footerSections = document.querySelectorAll('footer h3');
        footerSections.forEach(section => {
          section.classList.add('footer-section-title');
        });

        const footerLinks = document.querySelectorAll('footer a, footer li a');
        footerLinks.forEach(link => {
          link.classList.add('footer-menu-item');
        });

        // Aplicar clase al menú móvil desplegable
        const mobileMenus = document.querySelectorAll('nav.md\\:hidden, div.md\\:hidden[role="navigation"]');
        mobileMenus.forEach(menu => {
          menu.classList.add('site-mobile-menu');
        });

        // Aplicar a elementos específicos del dashboard
        const dashboardNavItems = document.querySelectorAll('.dashboard-nav-item, .mobile-nav-item');
        dashboardNavItems.forEach(item => {
          item.classList.add('clean-background');
        });

        // Limpiar fondo de elementos con class="bg-slate"
        const slateElements = document.querySelectorAll('.bg-slate-700, .bg-slate-800, .bg-slate-900');
        slateElements.forEach(element => {
          element.classList.add('clean-background');
        });

        // Aplicar estilo a la barra de navegación inferior del dashboard
        const bottomNav = document.querySelector('.fixed.bottom-0.left-0.right-0');
        if (bottomNav) {
          bottomNav.classList.add('dashboard-footer-menu');
        }

        console.log('[FooterMenuFixer] Estilos aplicados correctamente para mejorar el aspecto móvil');
      } catch (error) {
        console.error('[FooterMenuFixer] Error al aplicar estilos:', error);
      }
    };

    // Aplicar las clases en la carga inicial
    applyClassesToElements();

    // Aplicar las clases después de cambios en el DOM 
    // (útil cuando los menús se cargan dinámicamente)
    const observer = new MutationObserver(() => {
      applyClassesToElements();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    return () => {
      // Limpiar el observer al desmontar el componente
      observer.disconnect();
    };
  }, []);

  return null; // Este componente no renderiza nada, solo aplica estilos
};

export default FooterMenuFixer;