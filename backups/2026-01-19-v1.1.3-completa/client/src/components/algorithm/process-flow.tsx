import { Wallet, CreditCard, Cpu, Box } from "lucide-react";
import { useLanguage } from "@/context/language-context";
import { algorithmTranslations } from "@/translations/algorithm";
import { getTranslatedValue } from "@/utils/translation-utils";
import { useEffect, useState } from "react";

interface ProcessFlowStepProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  isLast?: boolean;
  isHighlighted?: boolean;
}

export function ProcessFlowStep({ 
  icon, 
  title, 
  description, 
  isLast = false, 
  isHighlighted = false 
}: ProcessFlowStepProps) {
  // Color base según si está destacado o no
  const bgColor = isHighlighted 
    ? "bg-violet-700" 
    : "bg-indigo-950/70";
  
  const textColor = isHighlighted 
    ? "text-white" 
    : "text-indigo-300";
    
  const glowEffect = isHighlighted 
    ? "shadow-lg shadow-violet-700/30" 
    : "";
  
  return (
    <div className="flex flex-col items-center text-center max-w-[180px] mx-auto">
      {/* Icono */}
      <div className={`${bgColor} ${textColor} p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4 ${glowEffect} transition-all`}>
        {icon}
      </div>
      
      {/* Título */}
      <h4 className={`font-bold text-sm mb-1 ${isHighlighted ? "text-violet-300" : "text-blue-300"}`}>{title}</h4>
      
      {/* Descripción */}
      <p className="text-xs text-indigo-300/90">{description}</p>
      
      {/* Flecha si no es el último - Ahora en una capa separada para aparecer en pantallas móviles también */}
    </div>
  );
}

export function ProcessFlow() {
  // Obtener el idioma actual
  const { language } = useLanguage();
  const [mounted, setMounted] = useState(false);
  
  // Para evitar problemas de hidratación y SSR
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Si no está montado, no renderizamos nada
  if (!mounted) return null;
  
  // Función para obtener traducciones de forma segura
  const t = (key: string) => {
    return getTranslatedValue(algorithmTranslations, language, key, ['en', 'es']);
  };

  return (
    <div className="bg-gradient-to-br from-[#0F172A] to-[#131B32] border border-indigo-900/80 rounded-xl p-8 overflow-hidden shadow-lg">
      <h3 className="text-xl font-bold mb-4 text-center text-blue-100">{t('nftPositionTitle')}</h3>
      <p className="text-indigo-200/90 mb-8 text-center max-w-3xl mx-auto">
        {t('nftPositionDesc')}
      </p>
      
      {/* Grid con flechas entre cada paso, visible en todos los tamaños de pantalla */}
      <div className="grid grid-cols-1 md:grid-cols-7 gap-2 items-center justify-items-center">
        {/* Primer paso */}
        <div className="md:col-span-1">
          <ProcessFlowStep 
            icon={<Wallet className="h-6 w-6" />}
            title={t('userWallet')}
            description={t('userWalletDesc')}
          />
        </div>
        
        {/* Flecha 1 */}
        <div className="text-indigo-500 transform rotate-90 md:rotate-0 my-2 md:my-0 md:col-span-1">
          <svg width="40" height="24" viewBox="0 0 40 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 12H30M30 12L20 5M30 12L20 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        
        {/* Segundo paso */}
        <div className="md:col-span-1">
          <ProcessFlowStep 
            icon={<CreditCard className="h-6 w-6" />}
            title={t('uniswapNFT')}
            description={t('uniswapNFTDesc')}
          />
        </div>
        
        {/* Flecha 2 */}
        <div className="text-indigo-500 transform rotate-90 md:rotate-0 my-2 md:my-0 md:col-span-1">
          <svg width="40" height="24" viewBox="0 0 40 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 12H30M30 12L20 5M30 12L20 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        
        {/* Tercer paso - Destacado */}
        <div className="md:col-span-1">
          <ProcessFlowStep 
            icon={<Cpu className="h-6 w-6" />}
            title={t('waybankAlgorithm')}
            description={t('waybankAlgorithmDesc')}
            isHighlighted={true}
          />
        </div>
        
        {/* Flecha 3 */}
        <div className="text-indigo-500 transform rotate-90 md:rotate-0 my-2 md:my-0 md:col-span-1">
          <svg width="40" height="24" viewBox="0 0 40 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 12H30M30 12L20 5M30 12L20 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        
        {/* Cuarto paso */}
        <div className="md:col-span-1">
          <ProcessFlowStep 
            icon={<Box className="h-6 w-6" />}
            title={t('liquidityPool')}
            description={t('liquidityPoolDesc')}
            isLast={true}
          />
        </div>
      </div>
    </div>
  );
}