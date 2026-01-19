import React, { useState } from "react";
import { useTranslation, Language } from "@/hooks/use-translation";
import { Button } from "@/components/ui/button";
import { Check, ChevronDown, Globe } from "lucide-react";
import { useLanguage } from "@/context/language-context";

// Solo para este componente específico
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { cn } from "@/lib/utils";

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

/**
 * Componente selector de idiomas específico para páginas públicas
 * que soluciona el problema del fondo negro al abrir el menú
 */
export default function PublicLanguageSelector() {
  const { language, setLanguage } = useTranslation();
  // También obtenemos la función setLanguage del contexto de lenguaje
  const contextLanguage = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  
  // Referencia al color de fondo actual antes de abrir el menú
  const [bodyBackgroundBeforeOpen, setBodyBackgroundBeforeOpen] = 
    useState<string | null>(null);

  const handleLanguageChange = (newLanguage: Language) => {
    // Solo usamos el contexto principal para actualizar el idioma
    // Este método ahora guarda en localStorage y en la base de datos si el usuario está logueado
    if (contextLanguage.setLanguage) {
      contextLanguage.setLanguage(newLanguage);
      
      // También actualizamos el idioma en el hook de traducción para compatibilidad
      setLanguage(newLanguage);
      
      // Cerrar el menú después de seleccionar
      setIsOpen(false);
      
      // Mostramos un mensaje de confirmación (opcional)
      console.log("[SELECTOR-IDIOMA-PÚBLICO] Idioma cambiado a:", newLanguage);
    }
  };
  
  // Cuando el menú se abre, guardamos el color de fondo actual
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    
    // Solo en las páginas públicas aplicamos la solución especial
    const isPublicPage = document.documentElement.classList.contains('public-page-active');
    if (!isPublicPage) return;
    
    if (open) {
      // Guardar el color de fondo actual antes de abrir el menú
      const bodyBg = window.getComputedStyle(document.body).backgroundColor;
      setBodyBackgroundBeforeOpen(bodyBg);
    } else {
      // Restaurar el color de fondo cuando se cierra el menú
      setBodyBackgroundBeforeOpen(null);
    }
  };

  return (
    <>
      {/* Capa de fondo que solo aparece cuando el menú está abierto en páginas públicas */}
      {isOpen && bodyBackgroundBeforeOpen && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: document.documentElement.classList.contains('dark') 
              ? 'rgb(9, 14, 33)' 
              : '#ffffff',
            zIndex: 0,
            pointerEvents: 'none'
          }}
        />
      )}
    
      <DropdownMenuPrimitive.Root onOpenChange={handleOpenChange} open={isOpen}>
        <DropdownMenuPrimitive.Trigger asChild>
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors"
          >
            <Globe className="h-4 w-4" />
            <span className="hidden sm:inline">{languageNames[language as Language] || language}</span>
            <ChevronDown className="h-3 w-3" />
          </Button>
        </DropdownMenuPrimitive.Trigger>
        
        <DropdownMenuPrimitive.Portal>
          <DropdownMenuPrimitive.Content
            align="end"
            className="z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 w-48 max-h-80 overflow-y-auto"
            // Forzar el tema actual para evitar problemas de contexto
            style={{
              backgroundColor: document.documentElement.classList.contains('dark') 
                ? 'hsl(224 71% 12%)' 
                : 'white',
              color: document.documentElement.classList.contains('dark') 
                ? 'hsl(213 31% 91%)' 
                : 'hsl(215 25% 27%)',
              borderColor: document.documentElement.classList.contains('dark') 
                ? 'hsl(216 34% 17%)' 
                : 'hsl(220 13% 91%)',
              // Asegurar que este contenido siempre esté por encima
              zIndex: 9999
            }}
          >
            <DropdownMenuPrimitive.Group>
              {/* Todos los idiomas disponibles */}
              {Object.entries(languageNames).map(([langCode, langName]) => (
                <DropdownMenuPrimitive.Item
                  key={langCode}
                  className={cn(
                    "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
                    langCode === language ? "bg-primary/10 text-primary" : "",
                    "cursor-pointer"
                  )}
                  onClick={() => handleLanguageChange(langCode as Language)}
                  style={{
                    // Estilos en línea específicos para mantener la consistencia en este menú
                    backgroundColor: document.documentElement.classList.contains('dark')
                      ? langCode === language 
                        ? 'rgba(99, 102, 241, 0.1)' 
                        : 'transparent'
                      : langCode === language 
                        ? 'rgba(99, 102, 241, 0.1)' 
                        : 'transparent',
                    color: document.documentElement.classList.contains('dark')
                      ? langCode === language 
                        ? 'rgb(99, 102, 241)' 
                        : 'hsl(213 31% 91%)'
                      : langCode === language 
                        ? 'rgb(99, 102, 241)' 
                        : 'hsl(215 25% 27%)'
                  }}
                >
                  <span className="flex items-center justify-between w-full">
                    {langName}
                    {langCode === language && <Check className="h-4 w-4 ml-2" />}
                  </span>
                </DropdownMenuPrimitive.Item>
              ))}
            </DropdownMenuPrimitive.Group>
          </DropdownMenuPrimitive.Content>
        </DropdownMenuPrimitive.Portal>
      </DropdownMenuPrimitive.Root>
    </>
  );
}