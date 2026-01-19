import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";
import { Moon, Sun, ChevronRight, Check, ArrowRight, Shield, Zap, Settings, Clock, Menu, X, Headphones, HelpCircle } from "lucide-react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useLanguage } from "@/context/language-context";
import translations from "@/translations/landing";
import LanguageSelectorContext from "@/components/language-selector-context";
import { useOnClickOutside } from "@/hooks/use-click-outside";
import SEOManager from "@/components/seo/seo-manager";
import { createTranslationProxy } from "@/utils/translation-utils";
import PodcastPromo from "@/components/podcast/podcast-promo";
import PoolStatistics from "@/components/landing/pool-statistics";
import LandingRewardsSimulator from "@/components/landing/landing-rewards-simulator";
import { sendGAEvent } from "@/components/analytics/GoogleAnalytics";
import { trackLanguageChange, trackThemeChange } from "@/components/analytics/analytics-events";
import { ConsoleCleaner } from "@/components/debug/console-cleaner";
import { PasswordRecoveryDialog } from "@/components/wallet/password-recovery-dialog";
import { APP_NAME } from "@/utils/app-config";
import { riskCalculatorTranslations } from "../translations/risk-calculator";

export default function Landing() {
  const { theme, setTheme } = useTheme();
  const { language, direction } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [recoveryDialogOpen, setRecoveryDialogOpen] = useState(false);
  const [activeRiskProfile, setActiveRiskProfile] = useState<'conservative' | 'moderate' | 'aggressive'>('moderate');
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Obtener las traducciones para el idioma actual, con fallback a inglés
  // Usamos el proxy para manejar automáticamente el fallback a inglés
  const t = createTranslationProxy(translations, language);

  // Para cerrar el menú cuando se hace clic fuera
  useOnClickOutside(mobileMenuRef, () => setMobileMenuOpen(false));

  // Para evitar problemas de hidratación
  useEffect(() => {
    setMounted(true);

    // Verificar si hay parámetro recovery=direct en la URL
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('recovery') === 'direct') {
        // Limpiar parámetro de URL para que no persista
        window.history.replaceState({}, document.title, window.location.pathname);
        // Mostrar diálogo de recuperación de contraseña
        setRecoveryDialogOpen(true);
      }
    }

    // Enviar evento de vista de página a Google Analytics cuando se carga la página de inicio
    if (typeof window !== 'undefined') {
      sendGAEvent('landing_page_view', {
        language: language,
        theme: theme,
        timestamp: new Date().toISOString()
      });

      console.log('[Google Analytics] Landing page loaded', {
        language: language,
        theme: theme
      });
    }
  }, []);

  // Cerrar menú cuando se cambia de tamaño de pantalla
  useEffect(() => {
    if (isDesktop && mobileMenuOpen) {
      setMobileMenuOpen(false);
    }
  }, [isDesktop, mobileMenuOpen]);

  // Seguimiento de cambios en el idioma
  useEffect(() => {
    if (mounted) {
      trackLanguageChange(language);
    }
  }, [language, mounted]);

  // Seguimiento de cambios en el tema
  useEffect(() => {
    if (mounted) {
      trackThemeChange(theme);
    }
  }, [theme, mounted]);

  if (!mounted) return null;

  // Limpiar logs y advertencias innecesarias en la consola solo para la página de inicio
  // Esto no afecta el dashboard ni las herramientas de desarrollo necesarias

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);

    // Registrar cambio de tema en Google Analytics
    sendGAEvent('theme_change', {
      previous_theme: theme,
      new_theme: newTheme,
      page: 'landing'
    });

    console.log('[Google Analytics] Theme changed', {
      previous: theme,
      new: newTheme
    });
  };

  const toggleMobileMenu = () => {
    const newState = !mobileMenuOpen;
    setMobileMenuOpen(newState);

    // Registrar apertura/cierre del menú móvil en Google Analytics
    sendGAEvent('mobile_menu_interaction', {
      action: newState ? 'open' : 'close',
      theme: theme,
      language: language
    });
  };

  // Activar limpieza de la consola solo para la página home
  // Este componente intercepta y filtra los mensajes de consola no esenciales
  // sin afectar el funcionamiento de la aplicación

  return (
    <div className="min-h-screen flex flex-col landing-page public-page"
      style={{ backgroundColor: theme === 'dark' ? 'hsl(224 71% 4%)' : undefined }}>
      <ConsoleCleaner isHomePage={true} />
      <SEOManager
        title={`${APP_NAME} - Optimización Inteligente de Liquidez`}
        description={`Maximiza tus rendimientos en Uniswap V4 con la optimización de liquidez inteligente de ${APP_NAME}.`}
        path="/"
        type="website"
        image="/og-landing-image.jpg"
      />
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b backdrop-blur-sm bg-background/80" dir={direction}>
        <div className="container flex h-16 items-center justify-between mx-auto max-w-screen-xl">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold">
              {APP_NAME === "WayBank" ? (
                <>
                  <span className="text-foreground">Way</span>
                  <span className="text-primary">Bank</span>
                </>
              ) : APP_NAME}
            </span>
          </div>

          {/* Menú de escritorio */}
          <nav className="hidden md:flex items-center gap-6">
            <a href="#how-it-works" className="text-sm font-medium hover:text-primary transition-colors">
              {t.howItWorks}
            </a>
            <Link href="/algorithm-details">
              <span className="text-sm font-medium hover:text-primary transition-colors cursor-pointer bg-primary/10 px-2 py-1 rounded-md">
                {t.algorithm || "Algoritmo"}
              </span>
            </Link>
            <Link href="/how-it-works">
              <span className="text-sm font-medium hover:text-primary transition-colors cursor-pointer">
                {t.documentation}
              </span>
            </Link>
            <a href="#features" className="text-sm font-medium hover:text-primary transition-colors">
              {t.features}
            </a>
            <a href="#risk-return" className="text-sm font-medium hover:text-primary transition-colors">
              {t.riskReturn}
            </a>
            <a href="#faq" className="text-sm font-medium hover:text-primary transition-colors">
              {t.faq}
            </a>
          </nav>

          <div className="flex items-center gap-2">
            <LanguageSelectorContext />

            {/* Botón de ayuda */}
            <Button
              variant="ghost"
              size="icon"
              asChild
              title="Centro de Ayuda"
              className="hidden md:flex bg-primary/10 hover:bg-primary/20 text-primary rounded-full mr-2"
              onClick={() => {
                sendGAEvent('help_button_click', {
                  from: 'landing_header',
                  language: language,
                  theme: theme
                });
              }}
            >
              <a href={APP_NAME.includes("Way") ? "https://waybank.info" : "https://waybank.info"} target="_blank" rel="noopener noreferrer">
                <HelpCircle className="h-5 w-5" />
              </a>
            </Button>

            <Button variant="ghost" size="icon" onClick={toggleTheme} className="mr-2">
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>

            {/* Botón de hamburgusa para móviles */}
            <Button variant="ghost" size="icon" onClick={toggleMobileMenu} className="md:hidden mr-2">
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>

            {/* Botón de acceso al dashboard */}
            <Button asChild className="hidden md:flex">
              <Link href="/dashboard">
                {t.accessDashboard} <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Menú móvil desplegable */}
        {mobileMenuOpen && (
          <div
            ref={mobileMenuRef}
            className="md:hidden absolute top-16 left-0 right-0 border-b z-40 bg-background/95 backdrop-blur-sm shadow-lg"
          >
            <nav className="container py-4 flex flex-col space-y-4 max-w-screen-xl mx-auto">
              <a
                href="#how-it-works"
                className="px-4 py-2 text-sm font-medium hover:bg-muted rounded-md transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t.howItWorks}
              </a>
              <Link
                href="/algorithm-details"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="px-4 py-2 block text-sm font-medium hover:bg-muted rounded-md transition-colors">
                  {t.algorithm || "Algoritmo"}
                </span>
              </Link>
              <Link
                href="/how-it-works"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="px-4 py-2 block text-sm font-medium hover:bg-muted rounded-md transition-colors">
                  {t.documentation}
                </span>
              </Link>
              <a
                href="#features"
                className="px-4 py-2 text-sm font-medium hover:bg-muted rounded-md transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t.features}
              </a>
              <a
                href="#risk-return"
                className="px-4 py-2 text-sm font-medium hover:bg-muted rounded-md transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t.riskReturn}
              </a>
              <a
                href="#faq"
                className="px-4 py-2 text-sm font-medium hover:bg-muted rounded-md transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t.faq}
              </a>
              <Link
                href="/podcast"
                onClick={() => setMobileMenuOpen(false)}
              >
                <div className="px-4 py-2 text-sm font-medium hover:bg-muted rounded-md transition-colors flex items-center gap-2">
                  <Headphones className="h-4 w-4" />
                  <span>Podcast</span>
                </div>
              </Link>

              {/* Enlace de ayuda en menú móvil */}
              <a
                href={APP_NAME.includes("Way") ? "https://waybank.info" : "https://waybank.info"}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 text-sm font-medium hover:bg-muted rounded-md transition-colors flex items-center gap-2"
                onClick={() => {
                  setMobileMenuOpen(false);
                  sendGAEvent('help_button_click', {
                    from: 'landing_mobile_menu',
                    language: language,
                    theme: theme
                  });
                }}
              >
                <HelpCircle className="h-4 w-4 text-primary" />
                <span>Centro de Ayuda</span>
              </a>

              <div className="px-4 pt-2 pb-4">
                <Button asChild className="w-full">
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t.accessDashboard} <ChevronRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </nav>
          </div>
        )}
      </header>

      <main className="flex-1" style={{ backgroundColor: theme === 'dark' ? 'hsl(224 71% 4%)' : undefined }}>
        {/* Hero Section */}
        <section className="py-20 md:py-28 bg-gradient-to-b from-background to-background/80"
          dir={direction}
          style={{ backgroundColor: theme === 'dark' ? 'rgb(9, 14, 33)' : undefined }}>
          <div className="container px-4 md:px-6 mx-auto max-w-screen-xl">
            <div className="flex flex-col items-center text-center space-y-8">
              <div className="space-y-4 max-w-3xl mx-auto">
                <h1 className="text-4xl md:text-6xl font-bold tracking-tighter" data-seo-title="true">
                  {t.heroTitle.replace("Uniswap V4", "")} <span className="text-primary">Uniswap V4</span>
                </h1>
                <p className="text-xl md:text-2xl text-muted-foreground">
                  {t.heroSubtitle}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="gap-2 bg-primary text-white hover:bg-primary/90"
                  style={{
                    backgroundColor: "#6263E7",
                    border: "none",
                    boxShadow: "0 4px 14px 0 rgba(98, 99, 231, 0.39)"
                  }}
                  onClick={() => {
                    // Google Analytics - Tracking CTA button click
                    sendGAEvent('cta_button_click', {
                      button: 'get_started',
                      from: 'landing_hero',
                      language: language,
                      theme: theme
                    });
                    console.log('[Google Analytics] CTA clicked: Get Started');
                  }}
                >
                  <Link href="/dashboard">
                    {t.getStarted} <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline"
                  style={{
                    border: "1px solid rgba(98, 99, 231, 0.5)",
                    color: theme === 'dark' ? "white" : "inherit"
                  }}
                  onClick={() => {
                    // Google Analytics - Tracking secondary CTA button click
                    sendGAEvent('cta_button_click', {
                      button: 'learn_more',
                      from: 'landing_hero',
                      language: language,
                      theme: theme
                    });
                    console.log('[Google Analytics] CTA clicked: Learn More');
                  }}
                >
                  <a href="#how-it-works">
                    {t.learnMore}
                  </a>
                </Button>
              </div>

              <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl mx-auto">
                <div className="flex flex-col items-center p-6 rounded-lg shadow-sm border dark-feature-card group cursor-default transition-all duration-300 hover:scale-105 hover:shadow-lg hover:-translate-y-2"
                  style={{
                    backgroundColor: theme === 'dark' ? 'rgb(19, 24, 54)' : undefined,
                    borderColor: theme === 'dark' ? 'rgb(39, 46, 79)' : undefined
                  }}>
                  <Shield className="h-12 w-12 text-primary mb-4 transition-all duration-300 group-hover:scale-110 group-hover:text-primary/80" />
                  <h3 className="text-xl font-bold mb-2 transition-colors duration-300 group-hover:text-primary">{t.minimizeRisks}</h3>
                  <p className="text-muted-foreground text-center transition-all duration-300 group-hover:text-foreground/90"
                    style={{
                      backgroundColor: theme === 'dark' ? 'transparent' : undefined,
                      color: theme === 'dark' ? 'rgb(186, 195, 218)' : undefined
                    }}>
                    {t.minimizeRisksDesc}
                  </p>
                </div>
                <div className="flex flex-col items-center p-6 rounded-lg shadow-sm border dark-feature-card group cursor-default transition-all duration-300 hover:scale-105 hover:shadow-lg hover:-translate-y-2"
                  style={{
                    backgroundColor: theme === 'dark' ? 'rgb(19, 24, 54)' : undefined,
                    borderColor: theme === 'dark' ? 'rgb(39, 46, 79)' : undefined
                  }}>
                  <Zap className="h-12 w-12 text-primary mb-4 transition-all duration-300 group-hover:scale-110 group-hover:text-primary/80" />
                  <h3 className="text-xl font-bold mb-2 transition-colors duration-300 group-hover:text-primary">{t.maximizeYields}</h3>
                  <p className="text-muted-foreground text-center transition-all duration-300 group-hover:text-foreground/90"
                    style={{
                      backgroundColor: theme === 'dark' ? 'transparent' : undefined,
                      color: theme === 'dark' ? 'rgb(186, 195, 218)' : undefined
                    }}>
                    {t.maximizeYieldsDesc}
                  </p>
                </div>
                <div className="flex flex-col items-center p-6 rounded-lg shadow-sm border dark-feature-card group cursor-default transition-all duration-300 hover:scale-105 hover:shadow-lg hover:-translate-y-2"
                  style={{
                    backgroundColor: theme === 'dark' ? 'rgb(19, 24, 54)' : undefined,
                    borderColor: theme === 'dark' ? 'rgb(39, 46, 79)' : undefined
                  }}>
                  <Settings className="h-12 w-12 text-primary mb-4 transition-all duration-300 group-hover:scale-110 group-hover:text-primary/80" />
                  <h3 className="text-xl font-bold mb-2 transition-colors duration-300 group-hover:text-primary">{t.fullControl}</h3>
                  <p className="text-muted-foreground text-center transition-all duration-300 group-hover:text-foreground/90"
                    style={{
                      backgroundColor: theme === 'dark' ? 'transparent' : undefined,
                      color: theme === 'dark' ? 'rgb(186, 195, 218)' : undefined
                    }}>
                    {t.fullControlDesc}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Simulador de Rentabilidad Section */}
        <section className="py-16 bg-gradient-to-b from-muted/30 to-muted/50" dir={direction}>
          <div className="container px-4 md:px-6 mx-auto max-w-screen-xl">
            <div className="flex flex-col items-center text-center space-y-4 mb-10">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tighter">
                {t.rewardsSimulatorTitle}
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                {t.rewardsSimulatorSubtitle}
              </p>
            </div>
            <LandingRewardsSimulator />
          </div>
        </section>

        {/* How it Works Section */}
        <section id="how-it-works" className="py-20 bg-muted/50" dir={direction}>
          <div className="container px-4 md:px-6 mx-auto max-w-screen-xl">
            <div className="flex flex-col items-center text-center space-y-4 mb-12">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tighter">
                {t.howItWorksTitle}
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                {t.howItWorksSubtitle}
              </p>
              <Button
                asChild
                variant="outline"
                className="mt-2"
                onClick={() => {
                  // Google Analytics - Tracking documentation button click
                  sendGAEvent('documentation_link_click', {
                    from: 'landing_how_it_works_section',
                    language: language,
                    theme: theme
                  });
                  console.log('[Google Analytics] Documentation link clicked');
                }}
              >
                <Link href="/how-it-works">
                  {t.viewFullDocumentation}
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-8 max-w-5xl mx-auto">
              <div className="flex flex-col items-center text-center space-y-4 group cursor-default transition-all duration-300 hover:-translate-y-2">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 text-primary transition-all duration-300 group-hover:scale-110 group-hover:bg-primary/30 group-hover:shadow-lg">
                  <span className="text-2xl font-bold transition-transform duration-300 group-hover:scale-105">1</span>
                </div>
                <h3 className="text-xl font-bold transition-colors duration-300 group-hover:text-primary">{t.step1Title}</h3>
                <p className="text-muted-foreground transition-all duration-300 group-hover:text-foreground/90">
                  {t.step1Desc}
                </p>
              </div>
              <div className="flex flex-col items-center text-center space-y-4 group cursor-default transition-all duration-300 hover:-translate-y-2">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 text-primary transition-all duration-300 group-hover:scale-110 group-hover:bg-primary/30 group-hover:shadow-lg">
                  <span className="text-2xl font-bold transition-transform duration-300 group-hover:scale-105">2</span>
                </div>
                <h3 className="text-xl font-bold transition-colors duration-300 group-hover:text-primary">{t.step2Title}</h3>
                <p className="text-muted-foreground transition-all duration-300 group-hover:text-foreground/90">
                  {t.step2Desc}
                </p>
              </div>
              <div className="flex flex-col items-center text-center space-y-4 group cursor-default transition-all duration-300 hover:-translate-y-2">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 text-primary transition-all duration-300 group-hover:scale-110 group-hover:bg-primary/30 group-hover:shadow-lg">
                  <span className="text-2xl font-bold transition-transform duration-300 group-hover:scale-105">3</span>
                </div>
                <h3 className="text-xl font-bold transition-colors duration-300 group-hover:text-primary">{t.step3Title}</h3>
                <p className="text-muted-foreground transition-all duration-300 group-hover:text-foreground/90">
                  {t.step3Desc}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Liquidity Pools Stats Section */}
        <section id="liquidity-pools" className="py-20" dir={direction}>
          <div className="container px-4 md:px-6 mx-auto max-w-screen-xl">
            <PoolStatistics />
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20" dir={direction}>
          <div className="container px-4 md:px-6 mx-auto max-w-screen-xl">
            <div className="flex flex-col items-center text-center space-y-4 mb-12">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tighter">
                {t.featuresTitle}
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                {t.featuresSubtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              <div className="flex items-start space-x-4 group cursor-default transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] p-4 rounded-lg hover:shadow-md">
                <div className="mt-1 bg-primary/20 p-2 rounded-full text-primary transition-all duration-300 group-hover:scale-110 group-hover:bg-primary/30">
                  <Check className="h-5 w-5 transition-transform duration-300 group-hover:scale-105" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 transition-colors duration-300 group-hover:text-primary">{t.feature1Title}</h3>
                  <p className="text-muted-foreground transition-all duration-300 group-hover:text-foreground/90">
                    {t.feature1Desc}
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4 group cursor-default transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] p-4 rounded-lg hover:shadow-md">
                <div className="mt-1 bg-primary/20 p-2 rounded-full text-primary transition-all duration-300 group-hover:scale-110 group-hover:bg-primary/30">
                  <Check className="h-5 w-5 transition-transform duration-300 group-hover:scale-105" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 transition-colors duration-300 group-hover:text-primary">{t.feature2Title}</h3>
                  <p className="text-muted-foreground transition-all duration-300 group-hover:text-foreground/90">
                    {t.feature2Desc}
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4 group cursor-default transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] p-4 rounded-lg hover:shadow-md">
                <div className="mt-1 bg-primary/20 p-2 rounded-full text-primary transition-all duration-300 group-hover:scale-110 group-hover:bg-primary/30">
                  <Check className="h-5 w-5 transition-transform duration-300 group-hover:scale-105" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 transition-colors duration-300 group-hover:text-primary">{t.feature3Title}</h3>
                  <p className="text-muted-foreground transition-all duration-300 group-hover:text-foreground/90">
                    {t.feature3Desc}
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4 group cursor-default transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] p-4 rounded-lg hover:shadow-md">
                <div className="mt-1 bg-primary/20 p-2 rounded-full text-primary transition-all duration-300 group-hover:scale-110 group-hover:bg-primary/30">
                  <Check className="h-5 w-5 transition-transform duration-300 group-hover:scale-105" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 transition-colors duration-300 group-hover:text-primary">{t.feature4Title}</h3>
                  <p className="text-muted-foreground transition-all duration-300 group-hover:text-foreground/90">
                    {t.feature4Desc}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Risk/Return Configuration Section */}
        <section id="risk-return" className="py-20 bg-muted/50" dir={direction}>
          <div className="container px-4 md:px-6 mx-auto max-w-screen-xl">
            <div className="flex flex-col items-center text-center space-y-4 mb-12">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tighter">
                {t.riskReturnTitle}
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                {t.riskReturnSubtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="p-6 flex flex-col bg-card border rounded-lg group cursor-default transition-all duration-300 hover:scale-105 hover:shadow-lg hover:-translate-y-2"
                style={{ backgroundColor: theme === 'dark' ? 'hsl(224 71% 12%)' : undefined }}>
                <div className="bg-green-100 dark:bg-transparent text-green-600 dark:text-green-400 p-3 rounded-full w-fit mb-4 transition-all duration-300 group-hover:scale-110 group-hover:shadow-md"
                  style={{
                    backgroundColor: theme === 'dark' ? 'rgb(19, 24, 54)' : undefined,
                    border: theme === 'dark' ? '1px solid rgb(39, 46, 79)' : undefined
                  }}>
                  <Shield className="h-6 w-6 transition-transform duration-300 group-hover:scale-105" />
                </div>
                <h3 className="text-xl font-bold mb-2 transition-colors duration-300 group-hover:text-primary">{t.conservativeTitle}</h3>
                <p className="text-muted-foreground mb-4 flex-1 transition-all duration-300 group-hover:text-foreground/90">
                  {t.conservativeDesc}
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-2" /> {t.conservativeItem1}
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-2" /> {t.conservativeItem2}
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-2" /> {t.conservativeItem3}
                  </li>
                </ul>
                <Button
                  asChild
                  className="w-full"
                  onClick={() => {
                    // Google Analytics - Tracking risk profile selection
                    sendGAEvent('risk_profile_selected', {
                      profile: 'conservative',
                      section: 'risk_return',
                      language: language,
                      theme: theme
                    });
                    console.log('[Google Analytics] Risk profile selected: conservative');
                  }}
                >
                  <Link href="/dashboard?risk=conservative">
                    {t.selectBtn}
                  </Link>
                </Button>
              </div>
              <div className="p-6 flex flex-col bg-card border rounded-lg group cursor-default transition-all duration-300 hover:scale-105 hover:shadow-lg hover:-translate-y-2"
                style={{ backgroundColor: theme === 'dark' ? 'hsl(224 71% 12%)' : undefined }}>
                <div className="bg-blue-100 dark:bg-transparent text-blue-600 dark:text-blue-400 p-3 rounded-full w-fit mb-4 transition-all duration-300 group-hover:scale-110 group-hover:shadow-md"
                  style={{
                    backgroundColor: theme === 'dark' ? 'rgb(19, 24, 54)' : undefined,
                    border: theme === 'dark' ? '1px solid rgb(39, 46, 79)' : undefined
                  }}>
                  <Zap className="h-6 w-6 transition-transform duration-300 group-hover:scale-105" />
                </div>
                <h3 className="text-xl font-bold mb-2 transition-colors duration-300 group-hover:text-primary">{t.moderateTitle}</h3>
                <p className="text-muted-foreground mb-4 flex-1 transition-all duration-300 group-hover:text-foreground/90">
                  {t.moderateDesc}
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-blue-500 mr-2" /> {t.moderateItem1}
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-blue-500 mr-2" /> {t.moderateItem2}
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-blue-500 mr-2" /> {t.moderateItem3}
                  </li>
                </ul>
                <Button
                  asChild
                  className="w-full"
                  variant="default"
                  style={{
                    backgroundColor: "#6263E7",
                    border: "none",
                    boxShadow: "0 4px 14px 0 rgba(98, 99, 231, 0.39)"
                  }}
                  onClick={() => {
                    // Google Analytics - Tracking risk profile selection
                    sendGAEvent('risk_profile_selected', {
                      profile: 'moderate',
                      section: 'risk_return',
                      language: language,
                      theme: theme
                    });
                    console.log('[Google Analytics] Risk profile selected: moderate');
                  }}
                >
                  <Link href="/dashboard?risk=moderate">
                    {t.selectBtn}
                  </Link>
                </Button>
              </div>
              <div className="p-6 flex flex-col bg-card border rounded-lg group cursor-default transition-all duration-300 hover:scale-105 hover:shadow-lg hover:-translate-y-2"
                style={{ backgroundColor: theme === 'dark' ? 'hsl(224 71% 12%)' : undefined }}>
                <div className="bg-purple-100 dark:bg-transparent text-purple-600 dark:text-purple-400 p-3 rounded-full w-fit mb-4 transition-all duration-300 group-hover:scale-110 group-hover:shadow-md"
                  style={{
                    backgroundColor: theme === 'dark' ? 'rgb(19, 24, 54)' : undefined,
                    border: theme === 'dark' ? '1px solid rgb(39, 46, 79)' : undefined
                  }}>
                  <Clock className="h-6 w-6 transition-transform duration-300 group-hover:scale-105" />
                </div>
                <h3 className="text-xl font-bold mb-2 transition-colors duration-300 group-hover:text-primary">{t.aggressiveTitle}</h3>
                <p className="text-muted-foreground mb-4 flex-1 transition-all duration-300 group-hover:text-foreground/90">
                  {t.aggressiveDesc}
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-purple-500 mr-2" /> {t.aggressiveItem1}
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-purple-500 mr-2" /> {t.aggressiveItem2}
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-purple-500 mr-2" /> {t.aggressiveItem3}
                  </li>
                </ul>
                <Button
                  asChild
                  className="w-full"
                  variant="default"
                  style={{
                    backgroundColor: "#6263E7",
                    border: "none",
                    boxShadow: "0 4px 14px 0 rgba(98, 99, 231, 0.39)"
                  }}
                  onClick={() => {
                    // Google Analytics - Tracking risk profile selection
                    sendGAEvent('risk_profile_selected', {
                      profile: 'aggressive',
                      section: 'risk_return',
                      language: language,
                      theme: theme
                    });
                    console.log('[Google Analytics] Risk profile selected: aggressive');
                  }}
                >
                  <Link href="/dashboard?risk=aggressive">
                    {t.selectBtn}
                  </Link>
                </Button>
              </div>
            </div>

            {/* Risk-Return Calculator Section */}
            <div className="mt-16 max-w-5xl mx-auto">
              <div className="p-6 bg-card border rounded-lg shadow-sm group cursor-default transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:-translate-y-1"
                style={{ backgroundColor: theme === 'dark' ? 'hsl(224 71% 12%)' : undefined }}>
                <h3 className="text-2xl font-bold mb-4 text-center">
                  {riskCalculatorTranslations[language]?.riskCalculatorTitle || riskCalculatorTranslations.en.riskCalculatorTitle}
                </h3>
                <p className="text-muted-foreground mb-6 text-center">
                  {riskCalculatorTranslations[language]?.riskCalculatorSubtitle || riskCalculatorTranslations.en.riskCalculatorSubtitle}
                </p>

                {/* Risk Profiles Selector Buttons */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  <button
                    onClick={() => {
                      // Set conservative profile active
                      setActiveRiskProfile('conservative');
                      // Google Analytics tracking
                      sendGAEvent('risk_calculator', {
                        profile: 'conservative',
                        action: 'select'
                      });
                    }}
                    className={`p-3 rounded-md transition-all ${activeRiskProfile === 'conservative'
                        ? 'bg-green-100 dark:bg-green-900/30 border-green-500 dark:border-green-700 border-2'
                        : 'bg-muted/50 hover:bg-green-50 dark:hover:bg-green-900/10 border border-muted-foreground/20'
                      }`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Shield className="h-5 w-5 text-green-500" />
                      <span className="font-medium">
                        {riskCalculatorTranslations[language]?.conservativeProfile || riskCalculatorTranslations.en.conservativeProfile}
                      </span>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      // Set moderate profile active
                      setActiveRiskProfile('moderate');
                      // Google Analytics tracking
                      sendGAEvent('risk_calculator', {
                        profile: 'moderate',
                        action: 'select'
                      });
                    }}
                    className={`p-3 rounded-md transition-all ${activeRiskProfile === 'moderate'
                        ? 'bg-blue-100 dark:bg-blue-900/30 border-blue-500 dark:border-blue-700 border-2'
                        : 'bg-muted/50 hover:bg-blue-50 dark:hover:bg-blue-900/10 border border-muted-foreground/20'
                      }`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Zap className="h-5 w-5 text-blue-500" />
                      <span className="font-medium">
                        {riskCalculatorTranslations[language]?.moderateProfile || riskCalculatorTranslations.en.moderateProfile}
                      </span>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      // Set aggressive profile active
                      setActiveRiskProfile('aggressive');
                      // Google Analytics tracking
                      sendGAEvent('risk_calculator', {
                        profile: 'aggressive',
                        action: 'select'
                      });
                    }}
                    className={`p-3 rounded-md transition-all ${activeRiskProfile === 'aggressive'
                        ? 'bg-purple-100 dark:bg-purple-900/30 border-purple-500 dark:border-purple-700 border-2'
                        : 'bg-muted/50 hover:bg-purple-50 dark:hover:bg-purple-900/10 border border-muted-foreground/20'
                      }`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Clock className="h-5 w-5 text-purple-500" />
                      <span className="font-medium">
                        {riskCalculatorTranslations[language]?.aggressiveProfile || riskCalculatorTranslations.en.aggressiveProfile}
                      </span>
                    </div>
                  </button>
                </div>

                {/* Results Display */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {/* Worst Case Scenario */}
                  <div className={`p-5 rounded-lg border ${activeRiskProfile === 'conservative' ? 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/10' :
                      activeRiskProfile === 'moderate' ? 'border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/10' :
                        'border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-900/10'
                    }`}>
                    <h4 className="text-lg font-bold mb-3 flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`${activeRiskProfile === 'conservative' ? 'text-green-600 dark:text-green-400' :
                          activeRiskProfile === 'moderate' ? 'text-blue-600 dark:text-blue-400' :
                            'text-purple-600 dark:text-purple-400'
                        }`}>
                        <path d="m7 7 10 10-5 5V2l-5 5z"></path>
                      </svg>
                      {riskCalculatorTranslations[language]?.worstCaseScenario || riskCalculatorTranslations.en.worstCaseScenario}
                    </h4>
                    <div className="flex items-center">
                      <div className={`text-5xl font-bold ${activeRiskProfile === 'conservative' ? 'text-green-700 dark:text-green-400' :
                          activeRiskProfile === 'moderate' ? 'text-blue-700 dark:text-blue-400' :
                            'text-purple-700 dark:text-purple-400'
                        }`}>
                        {activeRiskProfile === 'conservative' ? '+5%' :
                          activeRiskProfile === 'moderate' ? '-15%' :
                            '-35%'}
                      </div>
                      <div className="ml-4">
                        <p className="text-muted-foreground">
                          {riskCalculatorTranslations[language]?.worstCaseDescription || riskCalculatorTranslations.en.worstCaseDescription}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Best Case Scenario */}
                  <div className={`p-5 rounded-lg border ${activeRiskProfile === 'conservative' ? 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/10' :
                      activeRiskProfile === 'moderate' ? 'border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/10' :
                        'border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-900/10'
                    }`}>
                    <h4 className="text-lg font-bold mb-3 flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`${activeRiskProfile === 'conservative' ? 'text-green-600 dark:text-green-400' :
                          activeRiskProfile === 'moderate' ? 'text-blue-600 dark:text-blue-400' :
                            'text-purple-600 dark:text-purple-400'
                        }`}>
                        <path d="m17 17-10-10 5-5v20l5-5z"></path>
                      </svg>
                      {riskCalculatorTranslations[language]?.bestCaseScenario || riskCalculatorTranslations.en.bestCaseScenario}
                    </h4>
                    <div className="flex items-center">
                      <div className={`text-5xl font-bold ${activeRiskProfile === 'conservative' ? 'text-green-700 dark:text-green-400' :
                          activeRiskProfile === 'moderate' ? 'text-blue-700 dark:text-blue-400' :
                            'text-purple-700 dark:text-purple-400'
                        }`}>
                        {activeRiskProfile === 'conservative' ? '+25%' :
                          activeRiskProfile === 'moderate' ? '+75%' :
                            '+200%'}
                      </div>
                      <div className="ml-4">
                        <p className="text-muted-foreground">
                          {riskCalculatorTranslations[language]?.bestCaseDescription || riskCalculatorTranslations.en.bestCaseDescription}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Risk Disclaimer */}
                <div className="bg-amber-50 dark:bg-amber-950/40 p-4 rounded-md border border-amber-200 dark:border-amber-800 mt-2">
                  <p className="text-sm text-amber-800 dark:text-amber-200 flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 mt-0.5 flex-shrink-0 text-amber-500">
                      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path>
                      <path d="M12 9v4"></path>
                      <path d="M12 17h.01"></path>
                    </svg>
                    <span>
                      <strong>{riskCalculatorTranslations[language]?.riskDisclaimerTitle || riskCalculatorTranslations.en.riskDisclaimerTitle}:</strong> {riskCalculatorTranslations[language]?.riskDisclaimerText || riskCalculatorTranslations.en.riskDisclaimerText}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Referral Section */}
        <section id="referrals" className="py-20" dir={direction}>
          <div className="container px-4 md:px-6 mx-auto max-w-screen-xl">
            <div className="flex flex-col items-center text-center space-y-4 mb-12">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary to-indigo-600 dark:from-primary dark:to-indigo-400">
                {t.referralTitle}
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                {t.referralSubtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="flex flex-col items-center p-6 relative overflow-hidden bg-card rounded-lg shadow-md border"
                style={{ backgroundColor: theme === 'dark' ? 'hsl(224 71% 12%)' : undefined }}>
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary/20 to-transparent rounded-bl-full"></div>
                <div className="mb-5 p-3 bg-primary/10 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">{t.referralCardTitle1}</h3>
                <p className="text-muted-foreground text-center mb-6">
                  {t.referralCardDesc1}
                </p>
                <div className="mt-auto">
                  <span className="inline-block px-4 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                    USDC
                  </span>
                </div>
              </div>

              <div className="flex flex-col items-center p-6 relative overflow-hidden bg-card rounded-lg shadow-md border transform scale-105 z-10"
                style={{ backgroundColor: theme === 'dark' ? 'hsl(224 71% 12%)' : undefined }}>
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-primary/20 to-transparent rounded-full"></div>
                <div className="mb-5 p-3 bg-primary/10 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">{t.referralCardTitle2}</h3>
                <p className="text-muted-foreground text-center mb-6">
                  {t.referralCardDesc2}
                </p>
                <div className="grid grid-cols-8 gap-1 w-full mt-auto">
                  <span className="h-1.5 bg-green-500 rounded"></span>
                  <span className="h-1.5 bg-green-500 rounded"></span>
                  <span className="h-1.5 bg-blue-500 rounded"></span>
                  <span className="h-1.5 bg-blue-500 rounded"></span>
                  <span className="h-1.5 bg-purple-500 rounded"></span>
                  <span className="h-1.5 bg-purple-500 rounded"></span>
                  <span className="h-1.5 bg-primary rounded"></span>
                  <span className="h-1.5 bg-primary rounded"></span>
                </div>
              </div>

              <div className="flex flex-col items-center p-6 relative overflow-hidden bg-card rounded-lg shadow-md border"
                style={{ backgroundColor: theme === 'dark' ? 'hsl(224 71% 12%)' : undefined }}>
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary/20 to-transparent rounded-bl-full"></div>
                <div className="mb-5 p-3 bg-primary/10 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">{t.referralCardTitle3}</h3>
                <p className="text-muted-foreground text-center mb-6">
                  {t.referralCardDesc3}
                </p>
                <div className="mt-auto">
                  <span className="inline-block px-4 py-1 bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-full text-sm font-medium">
                    +1% APR
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-16 p-8 bg-muted/30 backdrop-blur-sm rounded-2xl border shadow-lg max-w-5xl mx-auto relative overflow-hidden"
              style={{ backgroundColor: theme === 'dark' ? 'hsl(224 71% 12%)' : undefined }}>
              {/* Movemos el div decorativo al fondo con z-index negativo para que no bloquee la interacción */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-primary/10 to-transparent rounded-bl-full" style={{ zIndex: -1 }}></div>
              <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
                <div className="text-left max-w-md">
                  <h3 className="text-2xl font-bold mb-4">{t.referralHighlight}</h3>
                  <p className="text-muted-foreground">
                    {t.referralHighlightText}
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    asChild
                    size="lg"
                    className="gap-2 relative z-20 bg-primary text-white hover:bg-primary/90"
                    style={{
                      backgroundColor: "#6263E7",
                      border: "none",
                      boxShadow: "0 4px 14px 0 rgba(98, 99, 231, 0.39)"
                    }}
                    onClick={() => {
                      // Google Analytics - Tracking referral primary button click
                      sendGAEvent('referral_button_click', {
                        button: 'main_referral',
                        from: 'landing_referral_section',
                        language: language,
                        theme: theme
                      });
                      console.log('[Google Analytics] Referral primary button clicked');
                    }}
                  >
                    <Link href="/dashboard">
                      {t.referralCtaButton}
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </Link>
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="relative z-20"
                    style={{
                      border: "1px solid rgba(98, 99, 231, 0.5)",
                      color: theme === 'dark' ? "white" : "inherit"
                    }}
                    onClick={() => {
                      // Google Analytics - Tracking referral secondary button click
                      sendGAEvent('referral_button_click', {
                        button: 'public_referrals',
                        from: 'landing_referral_section',
                        language: language,
                        theme: theme
                      });
                      console.log('[Google Analytics] Referral secondary button clicked');
                    }}
                  >
                    <Link href="/public-referrals">
                      {t.referralCtaSecondary}
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Podcast Promo Section */}
        <section className="py-16 bg-background" dir={direction}>
          <div className="container px-4 md:px-6 mx-auto max-w-screen-xl">
            <PodcastPromo />
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="py-20" dir={direction}>
          <div className="container px-4 md:px-6 mx-auto max-w-screen-xl">
            <div className="flex flex-col items-center text-center space-y-4 mb-12">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tighter">
                {t.faqTitle}
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                {t.faqSubtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              <div className="space-y-4 group cursor-default transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] p-4 rounded-lg hover:shadow-md">
                <h3 className="text-xl font-bold transition-colors duration-300 group-hover:text-primary">{t.faqQuestion1}</h3>
                <p className="text-muted-foreground transition-all duration-300 group-hover:text-foreground/90">
                  {t.faqAnswer1}
                </p>
              </div>
              <div className="space-y-4 group cursor-default transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] p-4 rounded-lg hover:shadow-md">
                <h3 className="text-xl font-bold transition-colors duration-300 group-hover:text-primary">{t.faqQuestion2}</h3>
                <p className="text-muted-foreground transition-all duration-300 group-hover:text-foreground/90">
                  {t.faqAnswer2}
                </p>
              </div>
              <div className="space-y-4 group cursor-default transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] p-4 rounded-lg hover:shadow-md">
                <h3 className="text-xl font-bold transition-colors duration-300 group-hover:text-primary">{t.faqQuestion3}</h3>
                <p className="text-muted-foreground transition-all duration-300 group-hover:text-foreground/90">
                  {t.faqAnswer3}
                </p>
              </div>
              <div className="space-y-4 group cursor-default transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] p-4 rounded-lg hover:shadow-md">
                <h3 className="text-xl font-bold transition-colors duration-300 group-hover:text-primary">{t.faqQuestion4}</h3>
                <p className="text-muted-foreground transition-all duration-300 group-hover:text-foreground/90">
                  {t.faqAnswer4}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-primary/5" dir={direction}
          style={{ backgroundColor: theme === 'dark' ? 'hsl(224 71% 4%)' : undefined }}>
          <div className="container px-4 md:px-6 mx-auto max-w-screen-xl">
            <div className="flex flex-col items-center text-center space-y-8 max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tighter">
                {t.ctaTitle}
              </h2>
              <p className="text-xl text-muted-foreground">
                {t.ctaSubtitle}
              </p>
              <Button
                asChild
                size="lg"
                className="gap-2 bg-primary text-white hover:bg-primary/90"
                style={{
                  backgroundColor: "#6263E7",
                  border: "none",
                  boxShadow: "0 4px 14px 0 rgba(98, 99, 231, 0.39)"
                }}
                onClick={() => {
                  // Google Analytics - Tracking footer CTA button click
                  sendGAEvent('cta_button_click', {
                    button: 'final_cta',
                    from: 'landing_footer',
                    language: language,
                    theme: theme
                  });
                  console.log('[Google Analytics] Footer CTA clicked');
                }}
              >
                <Link href="/dashboard">
                  {t.accessDashboard} <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-12 bg-muted/30" dir={direction}
        style={{ backgroundColor: theme === 'dark' ? 'hsl(223 47% 18%)' : undefined }}>
        <div className="container px-4 md:px-6 mx-auto max-w-screen-xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <div className="space-y-4">
              <div className="text-2xl font-bold">
                <span className="text-foreground">Way</span>
                <span className="text-primary">Pool</span>
              </div>
              <p className="text-sm text-muted-foreground">
                {t.footerTagline}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-4 dark:text-current text-gray-800">{t.platform}</h3>
              <ul className="space-y-3 text-sm">
                <li><Link href="/dashboard"><span className="text-muted-foreground hover:text-primary transition-colors">{t.dashboard}</span></Link></li>
                <li><Link href="/positions"><span className="text-muted-foreground hover:text-primary transition-colors">{t.positions}</span></Link></li>
                <li><Link href="/analytics"><span className="text-muted-foreground hover:text-primary transition-colors">{t.analytics}</span></Link></li>
                <li><Link href="/uniswap"><span className="text-muted-foreground hover:text-primary transition-colors">TOP Pools</span></Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-4 dark:text-current text-gray-800">{t.resources}</h3>
              <ul className="space-y-3 text-sm">
                <li><Link href="/how-it-works" className="text-muted-foreground hover:text-primary transition-colors">{t.documentation}</Link></li>
                <li><Link href="/support" className="text-muted-foreground hover:text-primary transition-colors">{t.support}</Link></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">{t.community}</a></li>
                <li><Link href="/podcast" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
                  <Headphones className="h-3 w-3" />
                  <span>Podcast</span>
                </Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-4 dark:text-current text-gray-800">{t.legal}</h3>
              <ul className="space-y-3 text-sm">
                <li><Link href="/terms-of-use"><a className="text-muted-foreground hover:text-primary transition-colors">{t.termsOfUse}</a></Link></li>
                <li><Link href="/privacy-policy"><a className="text-muted-foreground hover:text-primary transition-colors">{t.privacyPolicy}</a></Link></li>
                <li><Link href="/disclaimer"><a className="text-muted-foreground hover:text-primary transition-colors">{t.disclaimer}</a></Link></li>
                <li><a href="/audit.html" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
                  <Shield className="h-3 w-3" />
                  <span>Technical Audit</span>
                </a></li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 flex flex-col md:flex-row justify-between items-center max-w-6xl mx-auto">
            <p className="text-sm text-muted-foreground mb-4 md:mb-0">
              {t.copyright}
            </p>
            <div className="flex items-center space-x-4">
              <a href="https://x.com/WayBank3" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                  <path d="M4 4l11.733 16H20L8.267 4H4z" />
                  <path d="M4 20l6.768-6.768" />
                  <path d="M20 4l-7.733 7.733" />
                </svg>
              </a>
              <a href="https://www.youtube.com/@WayBank3" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                  <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
                  <path d="m10 15 5-3-5-3z" />
                </svg>
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect width="4" height="12" x="2" y="9" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Diálogo de recuperación de contraseña */}
      <PasswordRecoveryDialog
        isOpen={recoveryDialogOpen}
        onClose={() => setRecoveryDialogOpen(false)}
      />
    </div>
  );
}