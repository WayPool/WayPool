import React, { useEffect, useRef } from "react";
import { Calculator, ExternalLink } from "lucide-react";
import { sendGAEvent } from "@/components/analytics/GoogleAnalytics";
import { useLanguage } from "@/context/language-context";
import { howItWorksTranslations } from "@/translations/how-it-works";

const DeltaNeutralBanner = () => {
  const bannerRef = useRef<HTMLDivElement>(null);
  const { language } = useLanguage();

  // Traducción para el botón de calculadora en diferentes idiomas
  const getButtonText = () => {
    if (language === 'es') return "PRUEBA NUESTRA CALCULADORA DELTA NEUTRAL";
    if (language === 'en') return "TRY OUR DELTA NEUTRAL CALCULATOR";
    if (language === 'pt') return "EXPERIMENTE NOSSA CALCULADORA DELTA NEUTRAL";
    if (language === 'fr') return "ESSAYEZ NOTRE CALCULATRICE DELTA NEUTRAL";
    if (language === 'it') return "PROVA IL NOSTRO CALCOLATORE DELTA NEUTRAL";
    if (language === 'de') return "TESTEN SIE UNSEREN DELTA NEUTRAL RECHNER";
    if (language === 'zh') return "试用我们的德尔塔中性计算器";
    // Si el idioma no está en la lista, mostrar en inglés por defecto
    return "TRY OUR DELTA NEUTRAL CALCULATOR";
  };

  // Asegura que el banner se renderice correctamente y permanezca visible
  useEffect(() => {
    if (bannerRef.current) {
      // Aplica estilos directamente al elemento DOM para evitar conflictos CSS
      const banner = bannerRef.current;
      
      // Estilos inline aplicados directamente para máxima compatibilidad
      Object.assign(banner.style, {
        backgroundColor: '#2563eb',
        color: 'white',
        padding: '20px',
        borderRadius: '12px',
        marginTop: '24px',
        marginBottom: '24px',
        textAlign: 'center',
        cursor: 'pointer',
        width: '100%',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      });
    }
  }, []);

  const handleClick = () => {
    window.open('https://waybank-delta-neutral-calculator.replit.app/', '_blank');
    console.log("Banner Delta Neutral clickeado - Idioma:", language);
    
    // Registrar evento de analytics
    sendGAEvent('delta_neutral_calculator_click', {
      from: 'how_it_works_banner',
      component: 'delta_neutral_banner',
      language: language
    });
  };

  return (
    <div 
      ref={bannerRef}
      onClick={handleClick}
      className="delta-neutral-banner"
    >
      <div className="flex items-center justify-center gap-2">
        <Calculator className="w-5 h-5" />
        <h2 className="text-2xl font-bold m-0">{getButtonText()}</h2>
        <ExternalLink className="w-4 h-4 ml-1" />
      </div>
    </div>
  );
};

export default DeltaNeutralBanner;