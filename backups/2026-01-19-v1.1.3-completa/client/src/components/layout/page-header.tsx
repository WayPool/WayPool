/**
 * Componente para los encabezados de página
 * Proporciona un estilo consistente para todas las páginas
 */

import React from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
}

export function PageHeader({ title, description, children }: PageHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        {description && (
          <p className="text-muted-foreground mt-1">{description}</p>
        )}
      </div>
      {children && (
        <div className="mt-4 md:mt-0 w-full md:w-auto flex justify-start md:justify-end">
          {children}
        </div>
      )}
    </div>
  );
}