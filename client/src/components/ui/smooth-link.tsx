import React, { ReactNode } from 'react';
import { useLocation, Link } from 'wouter';
import { cn } from '@/lib/utils';

interface SmoothLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  ariaLabel?: string;
  onClick?: () => void;
  activeClassName?: string;
  external?: boolean;
}

/**
 * Componente Link ultra simplificado sin dependencias de emotion para evitar problemas en producción
 */
export function SmoothLink({
  href,
  children,
  className = '',
  ariaLabel,
  onClick,
  activeClassName = '',
  external = false,
}: SmoothLinkProps) {
  const [location] = useLocation();
  const isActive = location === href;
  
  // Combinamos las clases de manera simple sin usar cn() que podría tener dependencias problemáticas
  const finalClassName = `${className} ${isActive ? activeClassName : ''}`.trim();
  
  // Si es un link externo, usamos un anchor normal
  if (external) {
    return (
      <a
        href={href}
        className={finalClassName}
        onClick={onClick}
        aria-label={ariaLabel}
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    );
  }
  
  // Para links internos, simplificamos al máximo usando solo el Link básico de wouter
  return (
    <Link href={href}>
      <a 
        className={finalClassName}
        onClick={onClick}
        aria-label={ariaLabel}
      >
        {children}
      </a>
    </Link>
  );
}