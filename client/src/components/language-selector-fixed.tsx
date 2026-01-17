import React from 'react';
import { useTranslation } from 'react-i18next';
import { FixedSelect, FixedSelectItem } from '@/lib/fixed-theme-components';
import { supportedLanguages } from '@/lib/i18n';

export function LanguageSelectorFixed() {
  const { i18n } = useTranslation();
  
  const handleLanguageChange = (value: string) => {
    if (value) {
      i18n.changeLanguage(value);
      
      // Definir la dirección basada en el idioma (RTL para árabe)
      document.documentElement.setAttribute(
        'dir', 
        value === 'ar' ? 'rtl' : 'ltr'
      );
      
      // Guardar preferencia en localStorage
      localStorage.setItem('preferredLanguage', value);
    }
  };

  return (
    <div className="max-w-[180px]">
      <FixedSelect
        value={i18n.language}
        onValueChange={handleLanguageChange}
        placeholder="Seleccionar idioma"
      >
        {supportedLanguages.map((lang) => (
          <FixedSelectItem key={lang.code} value={lang.code}>
            <div className="flex items-center gap-2">
              <span className="text-base">{lang.flag}</span>
              <span>{lang.name}</span>
            </div>
          </FixedSelectItem>
        ))}
      </FixedSelect>
    </div>
  );
}