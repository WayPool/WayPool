import React, { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { useLanguage } from "@/context/language-context";
import translations, { privacyPolicyTranslations } from "@/translations/landing";
import LanguageSelector from "@/components/language-selector";
import { smoothScrollToTop } from "@/lib/smooth-scroll";
import { ArrowUp, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { sendGAEvent } from "@/components/analytics/GoogleAnalytics";
import { cn } from "@/lib/utils";
import { SmoothLink } from "@/components/ui/smooth-link";
import { setupEntryAnimation } from "@/lib/smooth-transitions";
import SEOManager from "@/components/seo/seo-manager";
import { APP_NAME } from "@/utils/app-config";

// Definición de las secciones para la tabla de contenidos
interface Section {
  id: string;
  title: string;
  ref: React.RefObject<HTMLElement>;
}

export default function PrivacyPolicy() {
  const { language } = useLanguage();
  
  // Recuperamos directamente las traducciones del idioma actual con fallback a inglés
  const t = translations[language] || translations.en;
  const pt = privacyPolicyTranslations[language] || privacyPolicyTranslations.en;
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [headerShadow, setHeaderShadow] = useState(false);
  
  // Referencias para las secciones principales
  const sectionRefs = {
    intro: useRef<HTMLHeadingElement>(null),
    information: useRef<HTMLHeadingElement>(null),
    usage: useRef<HTMLHeadingElement>(null),
    sharing: useRef<HTMLHeadingElement>(null),
    security: useRef<HTMLHeadingElement>(null),
    rights: useRef<HTMLHeadingElement>(null),
    transfers: useRef<HTMLHeadingElement>(null),
    retention: useRef<HTMLHeadingElement>(null),
    changes: useRef<HTMLHeadingElement>(null),
    contact: useRef<HTMLHeadingElement>(null),
    law: useRef<HTMLHeadingElement>(null),
  };
  
  // Lista de secciones para la tabla de contenidos
  const sections: Section[] = [
    { id: "intro", title: pt.section1Title, ref: sectionRefs.intro },
    { id: "information", title: pt.section2Title, ref: sectionRefs.information },
    { id: "usage", title: pt.section3Title, ref: sectionRefs.usage },
    { id: "sharing", title: pt.section4Title, ref: sectionRefs.sharing },
    { id: "security", title: pt.section5Title, ref: sectionRefs.security },
    { id: "rights", title: pt.section6Title, ref: sectionRefs.rights },
    { id: "transfers", title: pt.section7Title, ref: sectionRefs.transfers },
    { id: "retention", title: pt.section8Title, ref: sectionRefs.retention },
    { id: "changes", title: pt.section9Title, ref: sectionRefs.changes },
    { id: "contact", title: pt.section10Title, ref: sectionRefs.contact },
    { id: "law", title: pt.section11Title, ref: sectionRefs.law },
  ];

  // Controlar el scroll y mostrar/ocultar el botón de volver arriba
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
      setHeaderShadow(window.scrollY > 10);
      
      // Determinar la sección activa
      const scrollPosition = window.scrollY + 100;
      
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section.ref.current && section.ref.current.offsetTop <= scrollPosition) {
          setActiveSection(section.id);
          break;
        }
      }
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [sections]);
  
  // Log para depurar problemas de traducción
  useEffect(() => {
    console.log("Idioma actual:", language);
    console.log("Traducciones de privacidad:", privacyPolicyTranslations[language]);
    console.log("Traducciones inglés:", privacyPolicyTranslations.en);
    console.log("Proxy funcionando:", pt.privacyPolicyTitle);
  }, [language]);
  
  // Eliminar la configuración de animación para resolver problemas con emotion
  // useEffect(() => {
  //   setupEntryAnimation();
  // }, []);
  
  // Función para el desplazamiento suave a una sección
  const scrollToSection = (sectionId: string) => {
    const section = sections.find(s => s.id === sectionId);
    if (section && section.ref.current) {
      section.ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* SEO Optimizado */}
      <SEOManager 
        path="/privacy-policy"
        type="website"
        image="/images/privacy-policy-og.jpg"
      />
      {/* Navigation con efecto de sombra al scroll */}
      <header className={cn(
        "sticky top-0 z-50 bg-background/80 backdrop-blur-md transition-shadow duration-300",
        headerShadow ? "shadow-md" : ""
      )}>
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <SmoothLink href="/" className="flex items-center space-x-2 transition-transform hover:scale-105 duration-300">
            <span className="font-bold text-xl">
              {APP_NAME.includes("Way") ? (
                <>
                  <span className="text-foreground">Way</span>
                  <span className="text-primary">Pool</span>
                </>
              ) : APP_NAME}
            </span>
          </SmoothLink>
          <div className="flex items-center space-x-4">
            <LanguageSelector />
            
            {/* Botón de ayuda */}
            <Button 
              variant="ghost" 
              size="icon" 
              asChild
              title="Centro de Ayuda"
              className="bg-primary/10 hover:bg-primary/20 text-primary rounded-full"
            >
              <a 
                href={APP_NAME.includes("Way") ? "https://waybank.info" : "https://waybank.info"}
                target="_blank" 
                rel="noopener noreferrer"
                onClick={() => {
                  sendGAEvent('help_button_click', {
                    from: 'privacy_policy_page',
                    language: language,
                    theme: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
                  });
                  console.log('[Google Analytics] Help button clicked from privacy-policy page');
                }}
              >
                <HelpCircle className="h-5 w-5" />
              </a>
            </Button>
            
            <SmoothLink 
              href="/" 
              className="text-sm text-muted-foreground hover:text-foreground transition duration-300"
            >
              {t.howItWorks}
            </SmoothLink>
              <SmoothLink 
                href="/dashboard" 
                className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md text-sm font-medium transition duration-300 shadow-sm hover:shadow-md hover:scale-105 active:scale-95"
              >
                {t.accessDashboard}
              </SmoothLink>
          </div>
        </div>
      </header>

      {/* Main Content with Table of Contents */}
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Tabla de contenido flotante en escritorio, fija en móvil */}
          <div className="hidden lg:block">
            <div className="sticky top-32 bg-muted/30 p-6 rounded-lg backdrop-blur-sm shadow-sm">
              <h3 className="font-medium text-lg mb-4 pb-2 border-b">{pt.contentIndex}</h3>
              <nav>
                <ul className="space-y-2">
                  {sections.map((section) => (
                    <li key={section.id}>
                      <button
                        onClick={() => scrollToSection(section.id)}
                        className={cn(
                          "text-sm w-full text-left py-1 px-2 rounded-md transition-all duration-300 hover:bg-primary/10 hover:text-primary",
                          activeSection === section.id
                            ? "bg-primary/20 text-primary font-medium"
                            : "text-muted-foreground"
                        )}
                      >
                        {section.title}
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </div>

          {/* Contenido principal */}
          <div className="lg:col-span-3">
            <div className="mb-8">
              <h1 className="text-4xl font-bold mb-2 text-center bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
                {pt.privacyPolicyTitle}
              </h1>
              <div className="h-1 w-20 bg-primary mx-auto rounded-full mb-6"></div>
              <p className="font-medium text-center text-muted-foreground">{pt.lastUpdated}</p>
            </div>
            
            {/* Versión móvil de la tabla de contenidos */}
            <div className="lg:hidden mb-8 bg-muted/30 p-4 rounded-lg shadow-sm">
              <details className="group">
                <summary className="flex cursor-pointer items-center justify-between font-medium">
                  <span>{pt.contentIndex}</span>
                  <span className="transition group-open:rotate-180">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-4 w-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                  </span>
                </summary>
                <div className="mt-3 text-sm">
                  <ul className="space-y-1">
                    {sections.map((section) => (
                      <li key={section.id}>
                        <button
                          onClick={() => scrollToSection(section.id)}
                          className={cn(
                            "w-full text-left py-1 px-2 rounded-md transition-all duration-300 hover:bg-primary/10",
                            activeSection === section.id
                              ? "text-primary font-medium"
                              : "text-muted-foreground"
                          )}
                        >
                          {section.title}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </details>
            </div>
            
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <h2 ref={sectionRefs.intro} id="intro" className="scroll-mt-32">{pt.section1Title}</h2>
              <p>
                {pt.introText}
              </p>
              
              <h2 ref={sectionRefs.information} id="information" className="scroll-mt-32">{pt.section2Title}</h2>
              <p>
                <strong>{pt.information1Title}</strong> {pt.information1Text}
              </p>
              <p>
                <strong>{pt.information2Title}</strong> {pt.information2Text}
              </p>
              <ul>
                {pt.information2List.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
              <p>
                <strong>{pt.information3Title}</strong> {pt.information3Text}
              </p>
              
              <h2 ref={sectionRefs.usage} id="usage" className="scroll-mt-32">{pt.section3Title}</h2>
              <p>
                {pt.usageText}
              </p>
              <ul>
                {pt.usageList.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
              
              <h2 ref={sectionRefs.sharing} id="sharing" className="scroll-mt-32">{pt.section4Title}</h2>
              <p>
                <strong>{pt.sharing1Title}</strong> {pt.sharing1Text}
              </p>
              <p>
                <strong>{pt.sharing2Title}</strong> {pt.sharing2Text}
              </p>
              <ul>
                {pt.sharing2List.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
              <p>
                <strong>{pt.sharing3Title}</strong> {pt.sharing3Text}
              </p>
              
              <h2 ref={sectionRefs.security} id="security" className="scroll-mt-32">{pt.section5Title}</h2>
              <p>
                {pt.security1Text}
              </p>
              <p>
                <strong>{pt.security2Title}</strong> {pt.security2Text}
              </p>
              
              <h2 ref={sectionRefs.rights} id="rights" className="scroll-mt-32">{pt.section6Title}</h2>
              <p>
                {pt.rightsText}
              </p>
              <ul>
                {pt.rightsList.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
              <p>
                {pt.rightsActionText}
              </p>
              
              <h2 ref={sectionRefs.transfers} id="transfers" className="scroll-mt-32">{pt.section7Title}</h2>
              <p>
                {pt.transfersText}
              </p>
              
              <h2 ref={sectionRefs.retention} id="retention" className="scroll-mt-32">{pt.section8Title}</h2>
              <p>
                {pt.retentionText}
              </p>
              
              <h2 ref={sectionRefs.changes} id="changes" className="scroll-mt-32">{pt.section9Title}</h2>
              <p>
                {pt.changesText}
              </p>
              
              <h2 ref={sectionRefs.contact} id="contact" className="scroll-mt-32">{pt.section10Title}</h2>
              <p>
                {pt.contactText}
              </p>
              <div className="bg-muted p-4 rounded-lg shadow-sm mt-2">
                <p className="mb-0">
                  {pt.contactAddress}
                </p>
              </div>
              
              <h2 ref={sectionRefs.law} id="law" className="scroll-mt-32">{pt.section11Title}</h2>
              <p>
                {pt.lawText}
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8 mt-12 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-sm font-medium mb-4">{t.platform}</h3>
              <ul className="space-y-3 text-sm">
                <li><SmoothLink href="/dashboard" className="text-muted-foreground hover:text-primary transition-colors duration-300">{t.dashboard}</SmoothLink></li>
                <li><SmoothLink href="/positions" className="text-muted-foreground hover:text-primary transition-colors duration-300">{t.positions}</SmoothLink></li>
                <li><SmoothLink href="/analytics" className="text-muted-foreground hover:text-primary transition-colors duration-300">{t.analytics}</SmoothLink></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-4">{t.resources}</h3>
              <ul className="space-y-3 text-sm">
                <li><SmoothLink href="/how-it-works" className="text-muted-foreground hover:text-primary transition-colors duration-300">{t.documentation}</SmoothLink></li>
                <li><Link href="/support" className="text-muted-foreground hover:text-primary transition-colors duration-300">{t.support}</Link></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors duration-300">{t.community}</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-4">{t.legal}</h3>
              <ul className="space-y-3 text-sm">
                <li><SmoothLink href="/terms-of-use" className="text-muted-foreground hover:text-primary transition-colors duration-300">{t.termsOfUse}</SmoothLink></li>
                <li><SmoothLink href="/privacy-policy" className="text-primary font-bold transition-colors duration-300 hover:opacity-80">{t.privacyPolicy}</SmoothLink></li>
                <li><SmoothLink href="/disclaimer" className="text-muted-foreground hover:text-primary transition-colors duration-300">{t.disclaimer}</SmoothLink></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-4">{APP_NAME}</h3>
              <p className="text-sm text-muted-foreground mb-4">{t.footerTagline}</p>
              <div className="flex space-x-4">
                <a 
                  href="https://x.com/WayBank3" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-all hover:scale-110 active:scale-95"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                    <path d="M4 4l11.733 16H20L8.267 4H4z" />
                    <path d="M4 20l6.768-6.768" />
                    <path d="M20 4l-7.733 7.733" />
                  </svg>
                </a>
                <a 
                  href="https://www.youtube.com/@WayBank3" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-all hover:scale-110 active:scale-95"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
                    <path d="m10 15 5-3-5-3z" />
                  </svg>
                </a>
                <a 
                  href="#" 
                  className="text-muted-foreground hover:text-primary transition-all hover:scale-110 active:scale-95"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                  </svg>
                </a>
                <a 
                  href="#" 
                  className="text-muted-foreground hover:text-primary transition-all hover:scale-110 active:scale-95"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground mb-4 md:mb-0">
              {t.copyright}
            </p>
            <div className="flex items-center space-x-4">
              <span className="text-muted-foreground text-sm">Elysium Media FZCO</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Botón de volver arriba */}
      {showScrollTop && (
        <button
          onClick={() => smoothScrollToTop()}
          className="fixed bottom-6 right-6 p-3 rounded-full bg-primary text-primary-foreground shadow-lg z-50 transition-transform hover:scale-110 active:scale-95"
        >
          <ArrowUp size={20} />
        </button>
      )}
    </div>
  );
}