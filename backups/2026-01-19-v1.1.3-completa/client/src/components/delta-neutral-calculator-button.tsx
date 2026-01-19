import React from 'react';
import { Calculator, ExternalLink } from 'lucide-react';
import { useLanguage } from '@/context/language-context';
import { sendGAEvent } from '@/components/analytics/GoogleAnalytics';

const DeltaNeutralCalculatorButton: React.FC = () => {
  const { language } = useLanguage();

  return (
    <div className="px-4 py-8 bg-background border-t border-b border-border mt-6 mb-6">
      <div className="max-w-3xl mx-auto text-center">
        <h3 className="text-2xl font-bold mb-4">
          {language === 'es' ? 'Calculadora Delta Neutral' : 'Delta Neutral Calculator'}
        </h3>
        
        <p className="text-muted-foreground mb-6">
          {language === 'es' 
            ? 'Calcula tu posición delta neutral y simula diferentes escenarios para visualizar cómo se protege tu capital.'
            : 'Calculate your delta neutral position and simulate different scenarios to visualize how your capital is protected.'}
        </p>
        
        <a 
          href="https://waybank-delta-neutral-calculator.replit.app/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-3 py-4 px-8 bg-primary text-white rounded-lg font-bold text-lg shadow-xl hover:bg-primary/90 transition-colors"
          onClick={() => {
            sendGAEvent('delta_neutral_calculator_click', {
              from: 'how_it_works_page',
              location: 'standalone_button',
              language
            });
          }}
        >
          <Calculator className="w-6 h-6" />
          <span>
            {language === 'es' ? 'CALCULADORA DELTA NEUTRAL' : 'DELTA NEUTRAL CALCULATOR'}
          </span>
          <ExternalLink className="w-5 h-5" />
        </a>
      </div>
    </div>
  );
};

export default DeltaNeutralCalculatorButton;