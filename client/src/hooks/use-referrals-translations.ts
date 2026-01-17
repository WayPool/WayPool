import { useContext } from 'react';
import { LanguageContext } from '@/context/language-context';
import { en, es, fr, de } from '@/translations/referrals';
import type { ReferralsTranslations } from '@/translations/referrals';

/**
 * Hook para acceder a las traducciones específicas de la sección de referidos
 * @returns El objeto de traducciones según el idioma seleccionado
 */
export function useReferralsTranslations(): ReferralsTranslations {
  const { language } = useContext(LanguageContext);
  
  switch (language) {
    case 'es':
      return es;
    case 'fr':
      return fr;
    case 'de':
      return de;
    default:
      return en;
  }
}