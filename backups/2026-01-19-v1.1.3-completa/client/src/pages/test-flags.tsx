import React from 'react';
import { FlagDisplay } from '@/components/landing/flag-display';

export default function TestFlagsPage() {
  return (
    <div className="container py-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Prueba de Banderas Internacionales</h1>
        
        <p className="text-muted-foreground mb-8">
          Esta página permite verificar que las banderas SVG se están cargando correctamente 
          y que el selector de países con prefijos telefónicos funciona adecuadamente.
        </p>
        
        <FlagDisplay className="mb-8" />
        
        <div className="space-y-4 border-t pt-8 mt-8">
          <h2 className="text-xl font-semibold">Información Adicional</h2>
          <p>
            Las banderas SVG incluidas en el proyecto son utilizadas por el componente 
            <code className="bg-muted px-1 py-0.5 rounded mx-1 text-sm">CountrySelector</code>
            para mostrar los prefijos telefónicos internacionales en el formulario de captura de leads.
          </p>
          
          <p>
            Si alguna bandera no se visualiza correctamente, revisa la consola del navegador 
            para detectar posibles errores, o utiliza la herramienta de verificación incluida 
            en esta página.
          </p>
        </div>
      </div>
    </div>
  );
}