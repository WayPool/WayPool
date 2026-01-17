import React, { useEffect } from 'react';
import { useLocation } from 'wouter';
import { useLanguage } from '@/context/language-context';
import { useTheme } from '@/hooks/use-theme';

/**
 * PublicPagesEnhancer es un componente que mejora la semántica de las páginas públicas
 * para optimizar su SEO y facilitar la indexación por motores de búsqueda.
 * 
 * Este componente añade metadatos semánticos adicionales específicos para cada tipo de página
 * sin alterar el contenido visible para el usuario.
 * 
 * También aplica una corrección de estilo global para solucionar problemas de color en móviles.
 */
export default function PublicPagesEnhancer() {
  const [location] = useLocation();
  const { language } = useLanguage();
  const { theme } = useTheme();
  
  // Detectar si es una página pública basada en la URL
  const isPublicPage = !location.startsWith('/dashboard') && 
                       !location.startsWith('/admin') &&
                       !location.startsWith('/settings');
  
  // Efecto para forzar colores correctos en modo oscuro
  useEffect(() => {
    // Crear un estilo global para corregir colores en dispositivos móviles en modo oscuro
    const styleId = 'mobile-dark-theme-fix';
    
    // Solo aplicar en modo oscuro
    if (theme === 'dark') {
      // Verificar si ya existe el estilo
      if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        style.innerHTML = `
          @media (max-width: 767px) {
            /* Variables de colores para tema oscuro */
            :root.dark {
              --background: 224 71% 4% !important;
              --card: 224 71% 12% !important;
              --muted: 223 47% 18% !important;
              --primary: 239 84% 67% !important;
            }
            
            /* SOLUCIÓN EXTREMA PARA FONDOS GRISES - APLICAR BACKGROUND AZUL OSCURO A TODOS LOS ELEMENTOS */
            /* Aplicar directamente a elementos */
            html.dark body,
            html.dark main, 
            html.dark div#root,
            html.dark section:not([class*="muted"]):not([class*="card"]) {
              background-color: rgb(9, 14, 33) !important;
            }
            
            /* SOLUCIÓN DEFINITIVA PARA LOS TÍTULOS CON ICONOS - Transformar TODOS los fondos grises claros */
            html.dark .bg-slate-700,
            html.dark [class*="bg-slate-700"],
            html.dark h1 span,
            html.dark h1 span.px-4, 
            html.dark h1 span.rounded-lg, 
            html.dark h1 [class*="rounded-lg"],
            html.dark h1.text-4xl,
            html.dark span.px-4.py-2.rounded-lg,
            html.dark [class*="bg-green-100"],
            html.dark [class*="bg-blue-100"],
            html.dark [class*="bg-purple-100"],
            html.dark [class*="dark:bg-green-900"],
            html.dark [class*="dark:bg-blue-900"],
            html.dark [class*="dark:bg-purple-900"],
            html.dark div.p-3.rounded-full.w-fit,
            html.dark [class*="rounded-full"].w-fit,
            html.dark div[class*="p-3"][class*="rounded-full"],
            html.dark div[class*="mb-4"][class*="rounded-full"],
            html.dark div[class*="w-fit"][class*="rounded-full"],
            html.dark div[class*="mb-5"][class*="rounded-full"] {
              background-color: rgb(19, 24, 54) !important;
              border: 1px solid rgb(39, 46, 79) !important;
              color: white !important;
            }
            
            /* CONTENEDORES DE ICONOS ESPECÍFICOS */
            html.dark section div.p-3.rounded-full.w-fit.mb-4,
            html.dark section div[class*="rounded-full"][class*="mb-4"],
            html.dark div[class*="bg-green-100"],
            html.dark div[class*="bg-blue-100"],
            html.dark div[class*="bg-purple-100"],
            html.dark div[class*="dark:bg-green-900"],
            html.dark div[class*="dark:bg-blue-900"],
            html.dark div[class*="dark:bg-purple-900"] {
              background-color: rgb(19, 24, 54) !important;
              border: 1px solid rgb(39, 46, 79) !important;
            }
            
            /* CORREGIR ESPECÍFICAMENTE LOS BLOQUES GRISES */
            html.dark p.text-xl.md\\:text-2xl.text-muted-foreground,
            html.dark section p.text-xl.text-muted-foreground,
            html.dark p[class*="text-muted-foreground"] {
              background-color: transparent !important;
              color: rgb(186, 195, 218) !important;
            }
            
            html.dark .bg-card,
            html.dark [class*="bg-card"],
            html.dark [class*="rounded-lg"],
            html.dark [class*="p-6"],
            html.dark div[class*="flex flex-col"] {
              background-color: rgb(19, 24, 54) !important;
              border-color: rgb(39, 46, 79) !important;
            }
            
            html.dark section[class*="bg-muted"],
            html.dark [class*="bg-muted"],
            html.dark footer {
              background-color: rgb(29, 35, 67) !important;
            }
            
            /* Páginas específicas */
            html.dark .landing-page,
            html.dark .landing-page > div,
            html.dark .landing-page main {
              background-color: rgb(9, 14, 33) !important;
            }
            
            /* Tarjetas de características - Específicas */
            html.dark .dark-feature-card,
            html.dark div[class*="p-6"][class*="rounded-lg"][class*="shadow-sm"] {
              background-color: rgb(19, 24, 54) !important;
              border-color: rgb(39, 46, 79) !important;
            }
            
            /* Forzar colores para las tarjetas en la landing page */
            html.dark [class*="min-h-screen"] [class*="grid-cols"] [class*="flex-col"],
            html.dark [class*="p-6"][class*="rounded-lg"],
            html.dark [class*="items-center"][class*="rounded-lg"],
            html.dark div.flex.flex-col.items-center.p-6 {
              background-color: rgb(19, 24, 54) !important;
              border-color: rgb(39, 46, 79) !important;
            }
            
            /* CORRECCIÓN PARA TEXTOS GRISES ESPECÍFICOS */
            html.dark [class*="space-y-4"] p.text-xl.md\\:text-2xl.text-muted-foreground,
            html.dark [class*="space-y-4"] p.text-xl.text-muted-foreground.max-w-3xl.mx-auto {
              background-color: transparent !important;
              padding: 0.75rem !important;
              border-radius: 0.5rem !important;
            }
            
            /* TEXTOS DE COLOR PRIMARIO */
            html.dark span.text-primary,
            html.dark .text-primary {
              color: rgb(99, 102, 241) !important;
            }
          }
        `;
        document.head.appendChild(style);
      }
    } else {
      // Remover el estilo si no estamos en modo oscuro
      const existingStyle = document.getElementById(styleId);
      if (existingStyle) {
        document.head.removeChild(existingStyle);
      }
    }
    
    // Limpieza al desmontar
    return () => {
      const existingStyle = document.getElementById(styleId);
      if (existingStyle) {
        document.head.removeChild(existingStyle);
      }
    };
  }, [theme]);
  
  useEffect(() => {
    if (!isPublicPage) return;
    
    // Función para añadir atributos semánticos a los elementos existentes
    const enhanceSemanticElements = () => {
      // Mejorar los enlaces para SEO
      document.querySelectorAll('a').forEach(link => {
        // Añadir atributos de relación para los enlaces externos
        if (link.hostname !== window.location.hostname && !link.hasAttribute('rel')) {
          link.setAttribute('rel', 'noopener noreferrer');
        }
        
        // Asegurar que los enlaces tengan título para accesibilidad si tienen texto
        if (!link.hasAttribute('title') && link.textContent?.trim()) {
          link.setAttribute('title', link.textContent.trim());
        }
      });
      
      // Mejorar imágenes para SEO
      document.querySelectorAll('img').forEach(img => {
        // Asegurar que todas las imágenes tengan atributo alt
        if (!img.hasAttribute('alt') || img.getAttribute('alt') === '') {
          const imgName = img.src.split('/').pop()?.split('.')[0] || '';
          img.setAttribute('alt', imgName.replace(/[-_]/g, ' '));
        }
        
        // Marcar imágenes decorativas apropiadamente
        if (img.classList.contains('decorative') || img.classList.contains('bg-image')) {
          img.setAttribute('role', 'presentation');
          img.setAttribute('aria-hidden', 'true');
        }
      });
      
      // Mejorar la estructura semántica
      if (location === '/') {
        // En la página principal, marcar secciones principales para mejor estructura
        document.querySelectorAll('section').forEach((section, index) => {
          if (!section.hasAttribute('aria-label')) {
            const headings = section.querySelectorAll('h2, h3');
            if (headings.length > 0) {
              section.setAttribute('aria-label', headings[0].textContent || `Section ${index + 1}`);
            }
          }
          
          // Identificar la sección de características o funcionalidades
          if (section.innerHTML.includes('minimizeRisks') || 
              section.innerHTML.includes('maximizeYields') ||
              section.innerHTML.includes('feature')) {
            section.setAttribute('itemscope', '');
            section.setAttribute('itemtype', 'https://schema.org/ItemList');
            
            // Marcar cada tarjeta de característica como un item de la lista
            const featureCards = section.querySelectorAll('.feature-card, [class*="feature"]');
            featureCards.forEach((card, cardIndex) => {
              card.setAttribute('itemprop', 'itemListElement');
              card.setAttribute('itemscope', '');
              card.setAttribute('itemtype', 'https://schema.org/ListItem');
              
              // Encontrar el título dentro de la tarjeta
              const cardTitle = card.querySelector('h3, h4');
              if (cardTitle) {
                cardTitle.setAttribute('itemprop', 'name');
              }
              
              // Encontrar la descripción dentro de la tarjeta
              const cardDesc = card.querySelector('p');
              if (cardDesc) {
                cardDesc.setAttribute('itemprop', 'description');
              }
              
              // Añadir posición en la lista
              const position = document.createElement('meta');
              position.setAttribute('itemprop', 'position');
              position.setAttribute('content', (cardIndex + 1).toString());
              card.appendChild(position);
            });
          }
          
          // Identificar la sección de FAQ
          if (section.innerHTML.includes('faqTitle') || 
              section.innerHTML.includes('faqQuestion') ||
              section.querySelector('[class*="faq"]')) {
            section.setAttribute('itemscope', '');
            section.setAttribute('itemtype', 'https://schema.org/FAQPage');
            
            // Encontrar cada par de pregunta/respuesta
            const questions = section.querySelectorAll('[class*="question"], [class*="faq-item"]');
            questions.forEach(question => {
              question.setAttribute('itemscope', '');
              question.setAttribute('itemtype', 'https://schema.org/Question');
              
              const questionText = question.querySelector('h3, h4, [class*="question-text"]');
              const answerText = question.querySelector('p, [class*="answer"], [class*="content"]');
              
              if (questionText) {
                questionText.setAttribute('itemprop', 'name');
              }
              
              if (answerText) {
                answerText.setAttribute('itemscope', '');
                answerText.setAttribute('itemtype', 'https://schema.org/Answer');
                answerText.setAttribute('itemprop', 'acceptedAnswer');
                
                // Marcar el texto de la respuesta
                const answerContent = answerText.querySelector('p') || answerText;
                answerContent.setAttribute('itemprop', 'text');
              }
            });
          }
        });
      } else if (location === '/algorithm' || location.includes('how-it-works')) {
        // Para páginas de documentación, añadir metadata de artículo técnico
        const mainContent = document.querySelector('main') || document.body;
        mainContent.setAttribute('itemscope', '');
        mainContent.setAttribute('itemtype', 'https://schema.org/TechArticle');
        
        // Marcar el título principal
        const mainTitle = mainContent.querySelector('h1');
        if (mainTitle) {
          mainTitle.setAttribute('itemprop', 'headline');
        }
        
        // Marcar la introducción
        const intro = mainContent.querySelector('p');
        if (intro) {
          intro.setAttribute('itemprop', 'abstract');
        }
      }
    };
    
    // Ejecutar después de que el DOM esté completamente cargado
    setTimeout(enhanceSemanticElements, 500);
    
  }, [location, language, isPublicPage]);
  
  // Este componente no renderiza nada visible
  return null;
}