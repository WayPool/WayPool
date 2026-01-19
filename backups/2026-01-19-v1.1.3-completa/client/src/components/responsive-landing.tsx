import React from 'react';
import { useViewport } from '@/hooks/use-viewport';
import MobileLanding from './mobile-landing';

// Importar el componente de landing original
// Cambia esta importación para que coincida con la ubicación de tu componente de landing actual
import Landing from '@/pages/landing';

/**
 * Componente que renderiza la landing apropiada basada en el tamaño de la pantalla
 */
const ResponsiveLanding: React.FC = () => {
  const { isMobile } = useViewport();
  
  if (isMobile) {
    return <MobileLanding />;
  }
  
  return <Landing />;
};

export default ResponsiveLanding;