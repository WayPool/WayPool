import React from "react";
import { useTranslation, Language } from "@/hooks/use-translation";
import { Button } from "@/components/ui/button";
import { Check, ChevronDown, Globe } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuSeparator,
} from "@/components/ui/fixed-dropdown-menu"; // Usamos el componente arreglado
import { useLanguage } from "@/context/language-context";

// Nombres de los idiomas para mostrar en el selector
const languageNames: Record<Language, string> = {
  es: "Español",
  en: "English",
  ar: "العربية",
  pt: "Português",
  it: "Italiano",
  fr: "Français",
  de: "Deutsch",
  hi: "हिन्दी",
  zh: "中文"
};

export default function LanguageSelector() {
  const { language, setLanguage } = useTranslation();
  // También obtenemos la función setLanguage del contexto de lenguaje
  const contextLanguage = useLanguage();

  const handleLanguageChange = (newLanguage: Language) => {
    // Solo usamos el contexto principal para actualizar el idioma
    // Este método ahora guarda en localStorage y en la base de datos si el usuario está logueado
    if (contextLanguage.setLanguage) {
      contextLanguage.setLanguage(newLanguage);
      
      // También actualizamos el idioma en el hook de traducción para compatibilidad
      setLanguage(newLanguage);
      
      // Mostramos un mensaje de confirmación (opcional)
      console.log("[SELECTOR-IDIOMA] Idioma cambiado a:", newLanguage);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors"
        >
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline">{languageNames[language as Language] || language}</span>
          <ChevronDown className="h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 max-h-80 overflow-y-auto">
        <DropdownMenuGroup>
          {/* Todos los idiomas disponibles */}
          {Object.entries(languageNames).map(([langCode, langName]) => (
            <DropdownMenuItem
              key={langCode}
              className={`${
                langCode === language
                  ? "bg-primary/10 text-primary"
                  : ""
              } cursor-pointer`}
              onClick={() => handleLanguageChange(langCode as Language)}
            >
              <span className="flex items-center justify-between w-full">
                {langName}
                {langCode === language && <Check className="h-4 w-4 ml-2" />}
              </span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}