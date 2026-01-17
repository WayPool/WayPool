import React from "react";
import { Calculator, ExternalLink, ChevronRight } from "lucide-react";
import { useLanguage } from "@/context/language-context";
import { sendGAEvent } from "@/components/analytics/GoogleAnalytics";

const BlockchainCalculatorButton = () => {
  const { language } = useLanguage();

  return (
    <div className="w-full bg-gradient-to-r from-[#0a192f] to-[#112240] py-12 px-4 border-t border-b border-indigo-900/30 my-10">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          <div className="md:col-span-2 space-y-4">
            <h3 className="text-2xl md:text-3xl font-bold text-white">
              {language === 'es' ? 'Calculadora Delta Neutral' : 'Delta Neutral Calculator'}
            </h3>
            <p className="text-indigo-200 text-lg">
              {language === 'es' 
                ? 'Simula diferentes escenarios y visualiza cómo el sistema Delta Neutral protege tu capital mientras mantiene rendimientos atractivos.'
                : 'Simulate different scenarios and visualize how the Delta Neutral system protects your capital while maintaining attractive returns.'}
            </p>
          </div>
          
          <div className="flex justify-center md:justify-end">
            <a 
              href="https://waybank-delta-neutral-calculator.replit.app/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="relative group"
              onClick={() => {
                sendGAEvent('delta_neutral_calculator_button', {
                  from: 'how_it_works_page',
                  language
                });
              }}
            >
              {/* Efectos de luz para aspecto blockchain */}
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg blur opacity-50 group-hover:opacity-75 transition duration-200"></div>
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 rounded-lg blur-sm opacity-30 group-hover:opacity-50 animate-pulse"></div>
              
              {/* Botón principal */}
              <div className="relative flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-[#1a365d] to-[#2a4365] rounded-lg border border-blue-400/20 shadow-xl">
                <Calculator className="h-6 w-6 text-blue-400" />
                <span className="text-white font-bold text-lg tracking-wide">
                  {language === 'es' ? 'ACCEDER A CALCULADORA' : 'ACCESS CALCULATOR'}
                </span>
                <ChevronRight className="h-5 w-5 text-blue-400" />
              </div>
              
              {/* Brillo inferior */}
              <div className="absolute inset-x-3 bottom-0 h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>
            </a>
          </div>
        </div>

        {/* Indicadores de tecnología blockchain */}
        <div className="mt-8 flex justify-center space-x-3">
          <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse"></div>
          <div className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse" style={{animationDelay: '300ms'}}></div>
          <div className="h-2 w-2 rounded-full bg-violet-500 animate-pulse" style={{animationDelay: '600ms'}}></div>
        </div>
      </div>
    </div>
  );
};

export default BlockchainCalculatorButton;