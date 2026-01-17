import React from 'react';
import { useViewport } from '@/hooks/use-viewport';
import MobileLanding from '@/components/mobile-landing';
import DesktopLanding from '@/pages/landing'; // Importamos la landing page actual

/**
 * Página que detecta el tamaño de la pantalla y muestra la versión
 * apropiada de la landing (móvil o desktop)
 */
const ResponsiveLanding: React.FC = () => {
  const { isMobile } = useViewport();
  
  // Si es un dispositivo móvil, mostramos la landing específica para móviles
  if (isMobile) {
    return <MobileLanding />;
  }
  
  // En caso contrario, mostramos la landing regular
  return <DesktopLanding />;
};

export default ResponsiveLanding;