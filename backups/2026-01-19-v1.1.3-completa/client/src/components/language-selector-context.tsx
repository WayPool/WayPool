import React from "react";
import { useLanguage, Language, languageNames } from "@/context/language-context";
import { Button } from "@/components/ui/button";
import { Check, ChevronDown, Globe } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

export default function LanguageSelectorContext() {
  const { language, setLanguage } = useLanguage();

  const handleLanguageChange = (newLanguage: Language) => {
    // Almacenar el nuevo idioma en ambas claves de localStorage para mantener la compatibilidad
    localStorage.setItem('waybank_language', newLanguage);
    localStorage.setItem('language', newLanguage);
    
    // Actualizar el idioma en el contexto
    setLanguage(newLanguage);
    
    // También actualizar atributos del documento para RTL y lang
    document.documentElement.dir = newLanguage === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = newLanguage;
    
    // Actualizar la URL para mantener la página actual al recargar
    const currentPath = window.location.pathname;
    window.location.href = currentPath;
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