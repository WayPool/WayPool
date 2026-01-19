import React, { useState } from 'react';
import { FlagChecker } from "@/components/ui/flag-checker";
import { Button } from "@/components/ui/button";
import { CountrySelector } from "@/components/ui/country-selector";
import '@/styles/flags.css';

interface FlagDisplayProps {
  className?: string;
}

export function FlagDisplay({ className = '' }: FlagDisplayProps) {
  const [selectedDialCode, setSelectedDialCode] = useState("+34");
  const [showFlagGrid, setShowFlagGrid] = useState(false);
  
  const countries = [
    { code: 'es', name: 'España', dialCode: '+34' },
    { code: 'us', name: 'Estados Unidos', dialCode: '+1' },
    { code: 'mx', name: 'México', dialCode: '+52' },
    { code: 'ae', name: 'Emiratos Árabes Unidos', dialCode: '+971' },
    { code: 'gb', name: 'Reino Unido', dialCode: '+44' },
    { code: 'br', name: 'Brasil', dialCode: '+55' },
    { code: 'cn', name: 'China', dialCode: '+86' },
    { code: 'jp', name: 'Japón', dialCode: '+81' },
    { code: 'de', name: 'Alemania', dialCode: '+49' },
    { code: 'fr', name: 'Francia', dialCode: '+33' },
    { code: 'it', name: 'Italia', dialCode: '+39' },
    { code: 'sg', name: 'Singapur', dialCode: '+65' },
    { code: 'kr', name: 'Corea del Sur', dialCode: '+82' },
    { code: 'za', name: 'Sudáfrica', dialCode: '+27' },
    { code: 'in', name: 'India', dialCode: '+91' },
    { code: 'ua', name: 'Ucrania', dialCode: '+380' }
  ];

  return (
    <div className={`rounded-lg bg-card p-6 shadow-md ${className}`}>
      <h2 className="text-2xl font-semibold mb-4">Visualizador de Banderas</h2>
      <p className="text-muted-foreground mb-6">
        Esta herramienta permite verificar que las banderas se están cargando correctamente.
      </p>
      
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Prueba del selector de países</h3>
          <FlagChecker />
        </div>
        
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center mb-6">
          <div className="flex-1">
            <CountrySelector
              value={selectedDialCode}
              onChange={(dialCode) => setSelectedDialCode(dialCode)}
              className="w-full"
            />
          </div>
          
          <div className="flex-shrink-0">
            <Button
              variant="outline"
              onClick={() => setShowFlagGrid(!showFlagGrid)}
            >
              {showFlagGrid ? "Ocultar Grid" : "Mostrar Grid"}
            </Button>
          </div>
        </div>
        
        {showFlagGrid && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-6">
            {countries.map((country) => (
              <div
                key={country.code}
                className="flex items-center gap-2 p-3 border rounded-md hover:bg-accent transition-colors"
              >
                <img
                  src={`/flags/${country.code}.svg`}
                  alt={country.name}
                  className="w-8 h-5 object-cover rounded-sm shadow-sm"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.backgroundColor = '#f5f5f5';
                    (e.target as HTMLImageElement).style.border = '1px solid #ddd';
                  }}
                />
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{country.name}</span>
                  <span className="text-xs text-muted-foreground">{country.dialCode}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default FlagDisplay;