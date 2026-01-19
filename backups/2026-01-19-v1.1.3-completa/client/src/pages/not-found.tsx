import React from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useLanguage } from '@/context/language-context';
import { AlertCircle, Home, ArrowLeft, RefreshCw } from 'lucide-react';

// Translations for the 404 page
const translations = {
  en: {
    title: "Page Not Found",
    subtitle: "The blockchain address you're looking for doesn't exist",
    description: "The page you requested could not be found. It might have been moved, renamed, or might not exist.",
    goHome: "Return to Home",
    goBack: "Go Back",
    refresh: "Refresh Page",
    suggestionsTitle: "You might want to check:",
    suggestion1: "The URL for any typos or errors",
    suggestion2: "Your connection - the network might be experiencing issues",
    suggestion3: "Our dashboard for available features and sections",
    errorCode: "Error Code: 404"
  },
  es: {
    title: "Página no encontrada",
    subtitle: "La dirección blockchain que buscas no existe",
    description: "La página solicitada no pudo ser encontrada. Es posible que haya sido movida, renombrada o que no exista.",
    goHome: "Volver al inicio",
    goBack: "Regresar",
    refresh: "Actualizar página",
    suggestionsTitle: "Podrías verificar:",
    suggestion1: "La URL en busca de errores tipográficos",
    suggestion2: "Tu conexión - la red podría estar experimentando problemas",
    suggestion3: "Nuestro dashboard para ver funciones y secciones disponibles",
    errorCode: "Código de error: 404"
  }
};

export default function NotFoundPage() {
  const { language } = useLanguage();
  const t = translations[language as keyof typeof translations] || translations.en;

  // SEO metadata
  React.useEffect(() => {
    document.title = `${t.title} | WayBank`;
    
    // Add meta description for SEO
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', t.description);
    }
  }, [language, t]);

  const goBack = () => {
    window.history.back();
  };

  const refreshPage = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-background to-background/90">
      <Card className="max-w-2xl w-full p-8 border-2 border-primary/20 backdrop-blur-sm bg-card/80 shadow-xl">
        <div className="flex items-center justify-center mb-6">
          <div className="relative">
            <AlertCircle size={64} className="text-primary animate-pulse" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xl font-bold text-primary-foreground">404</span>
            </div>
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-center mb-2 text-foreground">{t.title}</h1>
        <h2 className="text-lg text-center mb-6 text-muted-foreground">{t.subtitle}</h2>
        
        <Separator className="my-4" />
        
        <p className="text-center mb-8 text-foreground/80">{t.description}</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Button onClick={goBack} variant="outline" className="flex items-center gap-2">
            <ArrowLeft size={16} />
            {t.goBack}
          </Button>
          
          <Link href="/">
            <Button className="w-full flex items-center gap-2">
              <Home size={16} />
              {t.goHome}
            </Button>
          </Link>
          
          <Button onClick={refreshPage} variant="outline" className="flex items-center gap-2">
            <RefreshCw size={16} />
            {t.refresh}
          </Button>
        </div>
        
        <div className="bg-primary/5 p-4 rounded-lg border border-primary/10">
          <h3 className="font-semibold mb-3 text-foreground">{t.suggestionsTitle}</h3>
          <ul className="list-disc pl-5 space-y-2 text-foreground/80">
            <li>{t.suggestion1}</li>
            <li>{t.suggestion2}</li>
            <li>{t.suggestion3}</li>
          </ul>
        </div>
        
        <div className="text-center mt-8 text-xs text-muted-foreground/50 font-mono">
          {t.errorCode}
        </div>
      </Card>
    </div>
  );
}