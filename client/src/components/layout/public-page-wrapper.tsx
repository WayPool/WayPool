import React, { useEffect } from 'react';
import { useTheme } from '@/hooks/use-theme';

interface PublicPageWrapperProps {
  children: React.ReactNode;
}

/**
 * Componente envoltorio para páginas públicas que asegura el scroll en dispositivos móviles
 * Aplica las clases CSS de public-pages-mobile.css para permitir desplazamiento en móviles
 * 
 * Añadido fix manual para forzar los colores correctos en modo oscuro para móviles
 */
const PublicPageWrapper: React.FC<PublicPageWrapperProps> = ({ children }) => {
  const { theme } = useTheme();
  
  // Efecto para forzar colores correctos en modo oscuro en móviles
  useEffect(() => {
    if (theme === 'dark') {
      // Crea un estilo inline directamente en el head
      const styleTag = document.createElement('style');
      styleTag.innerHTML = `
        @media (max-width: 767px) {
          .dark {
            --background: 224 71% 4% !important;
            --card: 224 71% 12% !important;
            --muted: 223 47% 18% !important;
            --primary: 239 84% 67% !important;
          }
          
          /* Sobreescribir directamente todos los elementos para asegurar consistencia */
          .dark section,
          .dark div,
          .dark footer,
          .dark main,
          .dark body {
            background-color: hsl(224 71% 4%) !important;
          }
          
          .dark .bg-card,
          .dark [class*="bg-card"],
          .dark [class*="rounded-lg"],
          .dark [class*="p-6"],
          .dark [class*="flex-col"] {
            background-color: hsl(224 71% 12%) !important;
          }
          
          .dark section[class*="bg-muted"],
          .dark div[class*="bg-muted"],
          .dark footer {
            background-color: hsl(223 47% 18%) !important;
          }
        }
      `;
      document.head.appendChild(styleTag);
      
      return () => {
        // Limpieza al desmontar
        document.head.removeChild(styleTag);
      };
    }
  }, [theme]);

  return (
    <div className="public-page" 
      style={{ 
        backgroundColor: theme === 'dark' ? 'hsl(224 71% 4%)' : undefined 
      }}
    >
      <div className="public-page-container">
        {children}
      </div>
    </div>
  );
};

export default PublicPageWrapper;