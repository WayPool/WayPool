import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogTrigger
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import '@/styles/flags.css';

// Lista de códigos de país que queremos verificar
const countryCodes = [
  'es', 'us', 'mx', 'ar', 'co', 'pe', 'cl', 'bo', 'cr', 'cu', 'ec', 'sv', 'gt', 
  'hn', 'ni', 'pa', 'py', 'do', 'uy', 've', 'fr', 'de', 'it', 'pt', 'gb', 'br', 
  'be', 'nl', 'ca', 'au', 'nz', 'ch', 'se', 'no', 'dk', 'fi', 'at', 'pl', 'ru', 
  'cn', 'jp', 'kr', 'in', 'za', 'ae', 'sa', 'il', 'tr', 'gr', 'ua', 'ro', 'cz', 
  'hu', 'id', 'my', 'ph', 'sg', 'th', 'vn', 'pk', 'ng', 'ke', 'tw', 'hk', 'ie'
];

// Mapeo de códigos de país a nombres
const countryNames: Record<string, string> = {
  'es': 'España',
  'us': 'Estados Unidos',
  'mx': 'México',
  'ar': 'Argentina',
  'co': 'Colombia',
  'pe': 'Perú',
  'cl': 'Chile',
  'bo': 'Bolivia',
  'cr': 'Costa Rica',
  'cu': 'Cuba',
  'ec': 'Ecuador',
  'sv': 'El Salvador',
  'gt': 'Guatemala',
  'hn': 'Honduras',
  'ni': 'Nicaragua',
  'pa': 'Panamá',
  'py': 'Paraguay',
  'do': 'República Dominicana',
  'uy': 'Uruguay',
  've': 'Venezuela',
  'fr': 'Francia',
  'de': 'Alemania',
  'it': 'Italia',
  'pt': 'Portugal',
  'gb': 'Reino Unido',
  'br': 'Brasil',
  'be': 'Bélgica',
  'nl': 'Países Bajos',
  'ca': 'Canadá',
  'au': 'Australia',
  'nz': 'Nueva Zelanda',
  'ch': 'Suiza',
  'se': 'Suecia',
  'no': 'Noruega',
  'dk': 'Dinamarca',
  'fi': 'Finlandia',
  'at': 'Austria',
  'pl': 'Polonia',
  'ru': 'Rusia',
  'cn': 'China',
  'jp': 'Japón',
  'kr': 'Corea del Sur',
  'in': 'India',
  'za': 'Sudáfrica',
  'ae': 'Emiratos Árabes Unidos',
  'sa': 'Arabia Saudita',
  'il': 'Israel',
  'tr': 'Turquía',
  'gr': 'Grecia',
  'ua': 'Ucrania',
  'ro': 'Rumanía',
  'cz': 'República Checa',
  'hu': 'Hungría',
  'id': 'Indonesia',
  'my': 'Malasia',
  'ph': 'Filipinas',
  'sg': 'Singapur',
  'th': 'Tailandia',
  'vn': 'Vietnam',
  'pk': 'Pakistán',
  'ng': 'Nigeria',
  'ke': 'Kenia',
  'tw': 'Taiwán',
  'hk': 'Hong Kong',
  'ie': 'Irlanda'
};

// Prefijos telefónicos correspondientes
const countryPrefixes: Record<string, string> = {
  'es': '+34',
  'us': '+1',
  'mx': '+52',
  'ar': '+54',
  'co': '+57',
  'pe': '+51',
  'cl': '+56',
  'bo': '+591',
  'cr': '+506',
  'cu': '+53',
  'ec': '+593',
  'sv': '+503',
  'gt': '+502',
  'hn': '+504',
  'ni': '+505',
  'pa': '+507',
  'py': '+595',
  'do': '+1809',
  'uy': '+598',
  've': '+58',
  'fr': '+33',
  'de': '+49',
  'it': '+39',
  'pt': '+351',
  'gb': '+44',
  'br': '+55',
  'be': '+32',
  'nl': '+31',
  'ca': '+1',
  'au': '+61',
  'nz': '+64',
  'ch': '+41',
  'se': '+46',
  'no': '+47',
  'dk': '+45',
  'fi': '+358',
  'at': '+43',
  'pl': '+48',
  'ru': '+7',
  'cn': '+86',
  'jp': '+81',
  'kr': '+82',
  'in': '+91',
  'za': '+27',
  'ae': '+971',
  'sa': '+966',
  'il': '+972',
  'tr': '+90',
  'gr': '+30',
  'ua': '+380',
  'ro': '+40',
  'cz': '+420',
  'hu': '+36',
  'id': '+62',
  'my': '+60',
  'ph': '+63',
  'sg': '+65',
  'th': '+66',
  'vn': '+84',
  'pk': '+92',
  'ng': '+234',
  'ke': '+254',
  'tw': '+886',
  'hk': '+852',
  'ie': '+353'
};

export const FlagChecker: React.FC = () => {
  const [brokenFlags, setBrokenFlags] = useState<string[]>([]);
  const [checkComplete, setCheckComplete] = useState(false);

  const checkAllFlags = () => {
    const broken: string[] = [];
    
    countryCodes.forEach(code => {
      const img = new Image();
      img.src = `/flags/${code}.svg`;
      
      img.onerror = () => {
        broken.push(code);
        if (broken.length === 1 || broken.length === countryCodes.length) {
          setBrokenFlags([...broken]);
        }
      };
    });
    
    // Marcar como completado después de un tiempo razonable
    setTimeout(() => {
      setCheckComplete(true);
    }, 2000);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button onClick={checkAllFlags} variant="outline" size="sm">
          Verificar Banderas
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Verificador de Banderas</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          {!checkComplete ? (
            <p className="text-center">Verificando banderas...</p>
          ) : brokenFlags.length > 0 ? (
            <div>
              <p className="mb-2 text-destructive">
                {brokenFlags.length} banderas no se pudieron cargar:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                {brokenFlags.map(code => (
                  <li key={code}>{countryNames[code] || code} ({code})</li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="text-center text-green-600 dark:text-green-400">
              Todas las banderas se cargaron correctamente
            </p>
          )}
        </div>
        
        <ScrollArea className="h-[300px] rounded-md border p-4">
          <div className="grid grid-cols-2 gap-4">
            {countryCodes.map(code => (
              <div key={code} className="flex items-center gap-2 p-2 border rounded">
                <img
                  src={`/flags/${code}.svg`}
                  alt={countryNames[code] || code}
                  className="w-8 h-5 object-cover rounded shadow-sm"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.backgroundColor = '#f5f5f5';
                    (e.target as HTMLImageElement).style.border = '1px solid #ddd';
                  }}
                />
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{countryNames[code] || code}</span>
                  <span className="text-xs text-muted-foreground">{countryPrefixes[code]}</span>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
        
        <DialogFooter>
          <Button onClick={() => window.location.reload()}>Recargar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FlagChecker;