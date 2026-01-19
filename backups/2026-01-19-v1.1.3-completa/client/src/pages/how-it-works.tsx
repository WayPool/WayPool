import React from "react";
import { Link } from "wouter";
// Importamos framer-motion para animaciones
import { motion } from "framer-motion";
import { 
  ArrowLeft, Github, Moon, Sun, HelpCircle, 
  ChevronRight, ChevronDown, Shield, BarChart3, LineChart, 
  Zap, Calculator, ExternalLink 
} from "lucide-react";
import { sendGAEvent } from "@/components/analytics/GoogleAnalytics";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { useTheme } from "@/hooks/use-theme";
import { useLanguage } from "@/context/language-context";
import LanguageSelector from "@/components/language-selector";
import { howItWorksTranslations } from "@/translations/how-it-works";
import SEOManager from "@/components/seo/seo-manager";
import DeltaNeutralBanner from "@/components/calculator-button";
import { APP_NAME } from "@/utils/app-config";

const HowItWorks: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage } = useLanguage();
  const isDark = theme === "dark" || (theme === "system" && 
    window.matchMedia("(prefers-color-scheme: dark)").matches);

  

  return (
    <div className="min-h-screen bg-background">
      <SEOManager 
        path="/how-it-works" 
        type="article" 
        image="/og-how-it-works-image.jpg"
      />
      {/* Header */}
      <header className="border-b">
        <div className="container px-4 py-4 mx-auto max-w-7xl flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon" className="mr-2">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="font-bold text-xl">
              {APP_NAME.includes("Way") ? (
                <>
                  <span className="text-foreground">Way</span>
                  <span className="text-primary">Pool</span>
                </>
              ) : APP_NAME}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <LanguageSelector />
            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            
            {/* Botón de ayuda */}
            <Button 
              variant="ghost" 
              size="icon" 
              asChild
              title="Centro de Ayuda"
              className="bg-primary/10 hover:bg-primary/20 text-primary rounded-full"
            >
              <a 
                href="https://waybank.info"
                target="_blank" 
                rel="noopener noreferrer"
                onClick={() => {
                  sendGAEvent('help_button_click', {
                    from: 'how_it_works_page',
                    language: language,
                    theme: theme
                  });
                  console.log('[Google Analytics] Help button clicked from how-it-works page');
                }}
              >
                <HelpCircle className="h-5 w-5" />
              </a>
            </Button>
            
            <Button variant="outline" size="sm" asChild>
              <a href="https://github.com/waybank/waybank" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                <Github className="h-4 w-4" />
                <span className="hidden sm:inline">GitHub</span>
              </a>
            </Button>
            <Link href="/dashboard">
              <Button size="sm">{language === 'es' ? 'Acceder a Dashboard' : 'Access Dashboard'}</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container px-4 py-12 mx-auto max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="font-bold text-4xl mb-4">
            {howItWorksTranslations[language]?.pageTitle || howItWorksTranslations.en.pageTitle}
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {howItWorksTranslations[language]?.pageSubtitle || howItWorksTranslations.en.pageSubtitle}
          </p>
        </div>
        
        {/* Delta Neutral System - Showcase Section */}
        <div className="mb-16 rounded-xl overflow-hidden border bg-card text-card-foreground shadow relative">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5 pointer-events-none"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
            <div className="space-y-6 z-10">
              <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/20 text-primary mb-2">
                <Shield className="w-4 h-4 mr-1" />
                {howItWorksTranslations[language]?.deltaNeutralSubtitle || howItWorksTranslations.en.deltaNeutralSubtitle}
              </div>
              <h2 className="text-3xl font-bold">
                {howItWorksTranslations[language]?.deltaNeutralTitle || howItWorksTranslations.en.deltaNeutralTitle}
              </h2>
              <p className="text-muted-foreground text-lg">
                {howItWorksTranslations[language]?.deltaNeutralDesc || howItWorksTranslations.en.deltaNeutralDesc}
              </p>
              
              <div className="bg-background/60 backdrop-blur-sm rounded-lg p-5 border border-border/50 space-y-3">
                <h3 className="font-semibold text-lg">{howItWorksTranslations[language]?.deltaNeutralBenefits || howItWorksTranslations.en.deltaNeutralBenefits}</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-3">
                    <div className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center text-green-500">
                      <Zap className="w-3 h-3" />
                    </div>
                    <span>{howItWorksTranslations[language]?.deltaNeutralBenefit1 || howItWorksTranslations.en.deltaNeutralBenefit1}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center text-green-500">
                      <Zap className="w-3 h-3" />
                    </div>
                    <span>{howItWorksTranslations[language]?.deltaNeutralBenefit2 || howItWorksTranslations.en.deltaNeutralBenefit2}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center text-green-500">
                      <Zap className="w-3 h-3" />
                    </div>
                    <span>{howItWorksTranslations[language]?.deltaNeutralBenefit3 || howItWorksTranslations.en.deltaNeutralBenefit3}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center text-green-500">
                      <Zap className="w-3 h-3" />
                    </div>
                    <span>{howItWorksTranslations[language]?.deltaNeutralBenefit4 || howItWorksTranslations.en.deltaNeutralBenefit4}</span>
                  </li>
                </ul>
              </div>
              
              <a 
                href="https://waybank-delta-neutral-calculator.replit.app/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-primary text-primary-foreground shadow hover:bg-primary/90 px-5 py-3 font-medium"
                onClick={() => {
                  sendGAEvent('delta_neutral_calculator_click', {
                    from: 'how_it_works_page',
                    language: language,
                    theme: theme
                  });
                }}
              >
                <Calculator className="w-5 h-5" />
                {howItWorksTranslations[language]?.deltaNeutralCalculatorCta || howItWorksTranslations.en.deltaNeutralCalculatorCta}
                <ExternalLink className="w-4 h-4 ml-1" />
              </a>
            </div>
            
            <div className="space-y-6 z-10">
              <div className="rounded-lg overflow-hidden bg-gradient-to-br from-card/50 to-background border border-border/50 h-full flex flex-col">
                <div className="p-5 bg-background/80 backdrop-blur-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="bg-primary/20 text-primary p-2 rounded-md">
                      <Shield className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-lg">
                      {howItWorksTranslations[language]?.riskReductionTitle || howItWorksTranslations.en.riskReductionTitle}
                    </h3>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    {howItWorksTranslations[language]?.riskReductionDesc || howItWorksTranslations.en.riskReductionDesc}
                  </p>
                </div>
                <div className="p-5 flex-1 flex flex-col items-center justify-center bg-background/50 backdrop-blur-sm">
                  {/* Círculo del 5% */}
                  <div className="w-32 h-32 relative mb-3">
                    <div className="absolute inset-0 rounded-full bg-primary/10 animate-pulse"></div>
                    <div className="absolute inset-2 rounded-full bg-primary/20 animate-pulse animation-delay-300"></div>
                    <div className="absolute inset-4 rounded-full bg-green-500/20 animate-pulse animation-delay-600"></div>
                    <div className="absolute inset-6 rounded-full bg-primary/10 animate-pulse animation-delay-900"></div>
                    <div className="absolute inset-0 rounded-full border-4 border-primary/20 flex items-center justify-center">
                      <span className="text-3xl font-bold text-primary">5%</span>
                    </div>
                  </div>
                  
                  <p className="text-center text-sm text-muted-foreground mx-auto max-w-xs mb-5">
                    {language === 'es' 
                      ? `Riesgo máximo con Delta Neutral de ${APP_NAME}`
                      : `Maximum risk with ${APP_NAME} Delta Neutral`}
                  </p>
                  
                  {/* Flecha indicadora */}
                  <div className="text-primary animate-bounce mb-3">
                    <ChevronDown className="w-6 h-6" />
                  </div>
                </div>
                
                {/* BOTÓN GIGANTE INDEPENDIENTE */}
                <div className="mx-5 mb-5 rounded-xl overflow-hidden">
                  <a 
                    href="https://waybank-delta-neutral-calculator.replit.app/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block w-full text-center py-4 px-6 bg-primary text-white rounded-lg font-bold text-lg"
                    onClick={() => {
                      sendGAEvent('delta_neutral_calculator_click', {
                        from: 'how_it_works_page',
                        location: 'big_button',
                        language
                      });
                    }}
                  >
                    <div className="flex items-center justify-center gap-3">
                      <Calculator className="w-6 h-6" />
                      <span>CALCULADORA DELTA NEUTRAL</span>
                      <ExternalLink className="w-5 h-5" />
                    </div>
                  </a>
                </div>
                <div className="p-5 border-t bg-background/80 backdrop-blur-sm">
                  <a 
                    href="https://waybank-delta-neutral-calculator.replit.app/" 
                    target="_blank"
                    rel="noopener noreferrer" 
                    className="w-full flex items-center justify-center gap-2 text-sm text-primary font-medium"
                  >
                    <Calculator className="w-4 h-4" />
                    {howItWorksTranslations[language]?.deltaNeutralCalculator || howItWorksTranslations.en.deltaNeutralCalculator}
                    <ChevronRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* BANNER CALCULADORA DELTA NEUTRAL - VERSIÓN FIJA Y DIRECTA */}
        <div className="container mx-auto px-4 mb-8 relative z-10">
          <DeltaNeutralBanner />
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid grid-cols-4 mb-8 border border-primary/10 bg-card/80 rounded-xl p-1">
            <TabsTrigger value="overview" className="flex items-center gap-2 data-[state=active]:bg-primary/15 data-[state=active]:text-primary">
              <BarChart3 className="w-4 h-4" />
              {howItWorksTranslations[language]?.overview || howItWorksTranslations.en.overview}
            </TabsTrigger>
            <TabsTrigger value="architecture" className="flex items-center gap-2 data-[state=active]:bg-primary/15 data-[state=active]:text-primary">
              <LineChart className="w-4 h-4" />
              {howItWorksTranslations[language]?.architecture || howItWorksTranslations.en.architecture}
            </TabsTrigger>
            <TabsTrigger value="algorithms" className="flex items-center gap-2 data-[state=active]:bg-primary/15 data-[state=active]:text-primary">
              <Zap className="w-4 h-4" />
              {howItWorksTranslations[language]?.algorithms || howItWorksTranslations.en.algorithms}
            </TabsTrigger>
            <TabsTrigger value="integration" className="flex items-center gap-2 data-[state=active]:bg-primary/15 data-[state=active]:text-primary">
              <Shield className="w-4 h-4" />
              {howItWorksTranslations[language]?.integration || howItWorksTranslations.en.integration}
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-8">
            <section className="space-y-8">
              <div className="bg-gradient-to-br from-card to-background border border-border/50 rounded-xl overflow-hidden">
                <div className="p-6 space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary mb-2">
                    <BarChart3 className="w-4 h-4" />
                    {`${language === 'es' ? '¿Qué es' : 'What is'} ${APP_NAME}?`}
                  </div>
                  <p className="text-muted-foreground text-lg">
                    {howItWorksTranslations[language]?.whatIsWaybankDesc?.replace('WayBank', APP_NAME) || 
                     howItWorksTranslations.en.whatIsWaybankDesc?.replace('WayBank', APP_NAME)}
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6 bg-card/50 backdrop-blur-sm border-t border-border/30">
                  <div className="flex flex-col space-y-3 p-4 rounded-lg border border-border/50 bg-background/70 backdrop-blur-md">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-md bg-primary/15 flex items-center justify-center text-primary">
                        <LineChart className="h-5 w-5" />
                      </div>
                      <h3 className="font-semibold">{howItWorksTranslations[language]?.dynamicRangeOptimization || howItWorksTranslations.en.dynamicRangeOptimization}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {howItWorksTranslations[language]?.dynamicRangeOptimizationDesc || howItWorksTranslations.en.dynamicRangeOptimizationDesc}
                    </p>
                  </div>
                  <div className="flex flex-col space-y-3 p-4 rounded-lg border border-border/50 bg-background/70 backdrop-blur-md">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-md bg-primary/15 flex items-center justify-center text-primary">
                        <Shield className="h-5 w-5" />
                      </div>
                      <h3 className="font-semibold">{howItWorksTranslations[language]?.impermanentLossMinimization || howItWorksTranslations.en.impermanentLossMinimization}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {howItWorksTranslations[language]?.impermanentLossMinimizationDesc || howItWorksTranslations.en.impermanentLossMinimizationDesc}
                    </p>
                  </div>
                  <div className="flex flex-col space-y-3 p-4 rounded-lg border border-border/50 bg-background/70 backdrop-blur-md">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-md bg-primary/15 flex items-center justify-center text-primary">
                        <Zap className="h-5 w-5" />
                      </div>
                      <h3 className="font-semibold">{howItWorksTranslations[language]?.nonCustodialControl || howItWorksTranslations.en.nonCustodialControl}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {howItWorksTranslations[language]?.nonCustodialControlDesc || howItWorksTranslations.en.nonCustodialControlDesc}
                    </p>
                  </div>
                  <div className="flex flex-col space-y-3 p-4 rounded-lg border border-border/50 bg-background/70 backdrop-blur-md">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-md bg-primary/15 flex items-center justify-center text-primary">
                        <BarChart3 className="h-5 w-5" />
                      </div>
                      <h3 className="font-semibold">{howItWorksTranslations[language]?.advancedAnalytics || howItWorksTranslations.en.advancedAnalytics}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {howItWorksTranslations[language]?.advancedAnalyticsDesc || howItWorksTranslations.en.advancedAnalyticsDesc}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-card to-background border border-border/50 rounded-xl overflow-hidden p-6">
                <h3 className="text-xl font-bold mb-4">{howItWorksTranslations[language]?.advantagesOverManual || howItWorksTranslations.en.advantagesOverManual}</h3>
                <p className="text-muted-foreground mb-5">
                  {howItWorksTranslations[language]?.manualDescription || howItWorksTranslations.en.manualDescription}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3 p-4 rounded-lg border border-border/50 bg-background/70 backdrop-blur-md">
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-500">
                      <Zap className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-foreground">{howItWorksTranslations[language]?.maximizeFees || howItWorksTranslations.en.maximizeFees}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 rounded-lg border border-border/50 bg-background/70 backdrop-blur-md">
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-500">
                      <Shield className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-foreground">{howItWorksTranslations[language]?.reduceLosses || howItWorksTranslations.en.reduceLosses}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 rounded-lg border border-border/50 bg-background/70 backdrop-blur-md">
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-500">
                      <BarChart3 className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-foreground">{howItWorksTranslations[language]?.optimizeCapital || howItWorksTranslations.en.optimizeCapital}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 rounded-lg border border-border/50 bg-background/70 backdrop-blur-md">
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-500">
                      <LineChart className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-foreground">{howItWorksTranslations[language]?.adaptToMarket || howItWorksTranslations.en.adaptToMarket}</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 flex justify-center">
                  <a 
                    href="https://waybank-delta-neutral-calculator.replit.app/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg px-5 py-2 border border-primary/50 bg-primary/10 text-primary font-medium hover:bg-primary/20 transition-colors"
                  >
                    <Calculator className="w-4 h-4" />
                    {howItWorksTranslations[language]?.deltaNeutralCalculatorCta || howItWorksTranslations.en.deltaNeutralCalculatorCta}
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </a>
                </div>
              </div>
            </section>
          </TabsContent>

          {/* Architecture Tab */}
          <TabsContent value="architecture" className="space-y-8">
            <section className="prose prose-slate dark:prose-invert max-w-none">
              <h2>{howItWorksTranslations[language]?.protocolArchitecture || howItWorksTranslations.en.protocolArchitecture}</h2>
              <p>
                {howItWorksTranslations[language]?.architectureDesc || howItWorksTranslations.en.architectureDesc}
              </p>
              
              <h3>{howItWorksTranslations[language]?.mainComponents || howItWorksTranslations.en.mainComponents}</h3>
              <div className="my-6">
                <Card>
                  <CardHeader>
                    <CardTitle>{howItWorksTranslations[language]?.positionManagementContracts || howItWorksTranslations.en.positionManagementContracts}</CardTitle>
                    <CardDescription>{howItWorksTranslations[language]?.positionManagementDesc || howItWorksTranslations.en.positionManagementDesc}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>
                      {howItWorksTranslations[language]?.contractsResponsible || howItWorksTranslations.en.contractsResponsible}
                    </p>
                    <ul>
                      <li>{howItWorksTranslations[language]?.contractsItem1 || howItWorksTranslations.en.contractsItem1}</li>
                      <li>{howItWorksTranslations[language]?.contractsItem2 || howItWorksTranslations.en.contractsItem2}</li>
                      <li>{howItWorksTranslations[language]?.contractsItem3 || howItWorksTranslations.en.contractsItem3}</li>
                      <li>{howItWorksTranslations[language]?.contractsItem4 || howItWorksTranslations.en.contractsItem4}</li>
                    </ul>
                    <p className="text-sm text-muted-foreground mt-4">
                      {howItWorksTranslations[language]?.contractsFooter || howItWorksTranslations.en.contractsFooter}
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="my-6">
                <Card>
                  <CardHeader>
                    <CardTitle>{howItWorksTranslations[language]?.onchainOracles || howItWorksTranslations.en.onchainOracles}</CardTitle>
                    <CardDescription>{howItWorksTranslations[language]?.oraclesDesc || howItWorksTranslations.en.oraclesDesc}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>
                      {howItWorksTranslations[language]?.oraclesProvide || howItWorksTranslations.en.oraclesProvide}
                    </p>
                    <ul>
                      <li>{howItWorksTranslations[language]?.oraclesItem1 || howItWorksTranslations.en.oraclesItem1}</li>
                      <li>{howItWorksTranslations[language]?.oraclesItem2 || howItWorksTranslations.en.oraclesItem2}</li>
                      <li>{howItWorksTranslations[language]?.oraclesItem3 || howItWorksTranslations.en.oraclesItem3}</li>
                      <li>{howItWorksTranslations[language]?.oraclesItem4 || howItWorksTranslations.en.oraclesItem4}</li>
                    </ul>
                    <p className="text-sm text-muted-foreground mt-4">
                      {howItWorksTranslations[language]?.oraclesFooter || howItWorksTranslations.en.oraclesFooter}
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="my-6">
                <Card>
                  <CardHeader>
                    <CardTitle>{howItWorksTranslations[language]?.gelatoAutomation || howItWorksTranslations.en.gelatoAutomation}</CardTitle>
                    <CardDescription>{howItWorksTranslations[language]?.gelatoDesc || howItWorksTranslations.en.gelatoDesc}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>
                      {howItWorksTranslations[language]?.gelatoUses || howItWorksTranslations.en.gelatoUses}
                    </p>
                    <ul>
                      <li>{howItWorksTranslations[language]?.gelatoItem1 || howItWorksTranslations.en.gelatoItem1}</li>
                      <li>{howItWorksTranslations[language]?.gelatoItem2 || howItWorksTranslations.en.gelatoItem2}</li>
                      <li>{howItWorksTranslations[language]?.gelatoItem3 || howItWorksTranslations.en.gelatoItem3}</li>
                      <li>{howItWorksTranslations[language]?.gelatoItem4 || howItWorksTranslations.en.gelatoItem4}</li>
                    </ul>
                    <p className="text-sm text-muted-foreground mt-4">
                      {howItWorksTranslations[language]?.gelatoFooter || howItWorksTranslations.en.gelatoFooter}
                    </p>
                  </CardContent>
                </Card>
              </div>

              <h3>{howItWorksTranslations[language]?.dataFlow || howItWorksTranslations.en.dataFlow}</h3>
              <p>
                {howItWorksTranslations[language]?.systemCycle || howItWorksTranslations.en.systemCycle}
              </p>
              <ol>
                <li>{howItWorksTranslations[language]?.cycleStep1 || howItWorksTranslations.en.cycleStep1}</li>
                <li>{howItWorksTranslations[language]?.cycleStep2 || howItWorksTranslations.en.cycleStep2}</li>
                <li>{howItWorksTranslations[language]?.cycleStep3 || howItWorksTranslations.en.cycleStep3}</li>
                <li>{howItWorksTranslations[language]?.cycleStep4 || howItWorksTranslations.en.cycleStep4}</li>
                <li>{howItWorksTranslations[language]?.cycleStep5 || howItWorksTranslations.en.cycleStep5}</li>
                <li>{howItWorksTranslations[language]?.cycleStep6 || howItWorksTranslations.en.cycleStep6}</li>
              </ol>
            </section>
          </TabsContent>

          {/* Algorithms Tab */}
          <TabsContent value="algorithms" className="space-y-8">
            <section className="prose prose-slate dark:prose-invert max-w-none">
              <h2>{howItWorksTranslations[language]?.algorithmsAndModels || howItWorksTranslations.en.algorithmsAndModels}</h2>
              <p>
                {howItWorksTranslations[language]?.algorithmsDesc || howItWorksTranslations.en.algorithmsDesc}
              </p>
              
              <h3>{howItWorksTranslations[language]?.volatilityPrediction || howItWorksTranslations.en.volatilityPrediction}</h3>
              <p>
                {howItWorksTranslations[language]?.volatilityDesc || howItWorksTranslations.en.volatilityDesc}
              </p>
              <ul>
                <li>{howItWorksTranslations[language]?.volatilityItem1 || howItWorksTranslations.en.volatilityItem1}</li>
                <li>{howItWorksTranslations[language]?.volatilityItem2 || howItWorksTranslations.en.volatilityItem2}</li>
                <li>{howItWorksTranslations[language]?.volatilityItem3 || howItWorksTranslations.en.volatilityItem3}</li>
                <li>{howItWorksTranslations[language]?.volatilityItem4 || howItWorksTranslations.en.volatilityItem4}</li>
              </ul>
              <p>
                {howItWorksTranslations[language]?.volatilityFooter || howItWorksTranslations.en.volatilityFooter}
              </p>

              <h3>{howItWorksTranslations[language]?.ilMitigationStrategies || howItWorksTranslations.en.ilMitigationStrategies}</h3>
              <p>
                {howItWorksTranslations[language]?.ilMitigationDesc || howItWorksTranslations.en.ilMitigationDesc}
              </p>
              
              <div className="my-6">
                <Card>
                  <CardHeader>
                    <CardTitle>{howItWorksTranslations[language]?.dynamicRangeTitle || howItWorksTranslations.en.dynamicRangeTitle}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>
                      {howItWorksTranslations[language]?.dynamicRangeDesc || howItWorksTranslations.en.dynamicRangeDesc}
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="my-6">
                <Card>
                  <CardHeader>
                    <CardTitle>{howItWorksTranslations[language]?.autoHedgingTitle || howItWorksTranslations.en.autoHedgingTitle}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>
                      {howItWorksTranslations[language]?.autoHedgingDesc || howItWorksTranslations.en.autoHedgingDesc}
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="my-6">
                <Card>
                  <CardHeader>
                    <CardTitle>{howItWorksTranslations[language]?.multiTierTitle || howItWorksTranslations.en.multiTierTitle}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>
                      {howItWorksTranslations[language]?.multiTierDesc || howItWorksTranslations.en.multiTierDesc}
                    </p>
                  </CardContent>
                </Card>
              </div>

              <h3>{howItWorksTranslations[language]?.gasOptimization || howItWorksTranslations.en.gasOptimization}</h3>
              <p>
                {howItWorksTranslations[language]?.algorithmsConsider || howItWorksTranslations.en.algorithmsConsider}
              </p>
              <ul>
                <li>{howItWorksTranslations[language]?.gasItem1 || howItWorksTranslations.en.gasItem1}</li>
                <li>{howItWorksTranslations[language]?.gasItem2 || howItWorksTranslations.en.gasItem2}</li>
                <li>{howItWorksTranslations[language]?.gasItem3 || howItWorksTranslations.en.gasItem3}</li>
                <li>{howItWorksTranslations[language]?.gasItem4 || howItWorksTranslations.en.gasItem4}</li>
              </ul>
            </section>
          </TabsContent>

          {/* Integration Tab */}
          <TabsContent value="integration" className="space-y-8">
            <section className="prose prose-slate dark:prose-invert max-w-none">
              <h2>{howItWorksTranslations[language]?.uniswapIntegration || howItWorksTranslations.en.uniswapIntegration}</h2>
              <p>
                {howItWorksTranslations[language]?.integrationDesc || howItWorksTranslations.en.integrationDesc}
              </p>
              
              <h3>{howItWorksTranslations[language]?.uniswapHooks || howItWorksTranslations.en.uniswapHooks}</h3>
              <p>
                {howItWorksTranslations[language]?.hooksDesc || howItWorksTranslations.en.hooksDesc}
              </p>
              <ul>
                <li>{howItWorksTranslations[language]?.hooksItem1 || howItWorksTranslations.en.hooksItem1}</li>
                <li>{howItWorksTranslations[language]?.hooksItem2 || howItWorksTranslations.en.hooksItem2}</li>
                <li>{howItWorksTranslations[language]?.hooksItem3 || howItWorksTranslations.en.hooksItem3}</li>
                <li>{howItWorksTranslations[language]?.hooksItem4 || howItWorksTranslations.en.hooksItem4}</li>
              </ul>

              <h3>{howItWorksTranslations[language]?.singletonPools || howItWorksTranslations.en.singletonPools}</h3>
              <p>
                {howItWorksTranslations[language]?.poolsDesc || howItWorksTranslations.en.poolsDesc}
              </p>
              <ul>
                <li>{howItWorksTranslations[language]?.poolsItem1 || howItWorksTranslations.en.poolsItem1}</li>
                <li>{howItWorksTranslations[language]?.poolsItem2 || howItWorksTranslations.en.poolsItem2}</li>
                <li>{howItWorksTranslations[language]?.poolsItem3 || howItWorksTranslations.en.poolsItem3}</li>
                <li>{howItWorksTranslations[language]?.poolsItem4 || howItWorksTranslations.en.poolsItem4}</li>
              </ul>

              <div className="my-6">
                <Card>
                  <CardHeader>
                    <CardTitle>{howItWorksTranslations[language]?.poolLibrary || howItWorksTranslations.en.poolLibrary}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>
                      {howItWorksTranslations[language]?.libraryDesc || howItWorksTranslations.en.libraryDesc}
                    </p>
                    <ul>
                      <li>{howItWorksTranslations[language]?.libraryItem1 || howItWorksTranslations.en.libraryItem1}</li>
                      <li>{howItWorksTranslations[language]?.libraryItem2 || howItWorksTranslations.en.libraryItem2}</li>
                      <li>{howItWorksTranslations[language]?.libraryItem3 || howItWorksTranslations.en.libraryItem3}</li>
                      <li>{howItWorksTranslations[language]?.libraryItem4 || howItWorksTranslations.en.libraryItem4}</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <h3>{howItWorksTranslations[language]?.securityImplementation || howItWorksTranslations.en.securityImplementation}</h3>
              <p>
                {howItWorksTranslations[language]?.securityDesc || howItWorksTranslations.en.securityDesc}
              </p>
              <ul>
                <li>{howItWorksTranslations[language]?.securityItem1 || howItWorksTranslations.en.securityItem1}</li>
                <li>{howItWorksTranslations[language]?.securityItem2 || howItWorksTranslations.en.securityItem2}</li>
                <li>{howItWorksTranslations[language]?.securityItem3 || howItWorksTranslations.en.securityItem3}</li>
                <li>{howItWorksTranslations[language]?.securityItem4 || howItWorksTranslations.en.securityItem4}</li>
              </ul>
            </section>
          </TabsContent>
        </Tabs>

        {/* Call to Action */}
        <div className="text-center mt-16 bg-primary/5 p-8 rounded-xl">
          <h2 className="font-bold text-2xl mb-2">
            {language === 'es' ? '¿Listo para optimizar tu liquidez?' : 'Ready to optimize your liquidity?'}
          </h2>
          <p className="text-muted-foreground mb-6">
            {language === 'es' 
              ? `Comienza a utilizar ${APP_NAME} hoy y experimenta el futuro de la gestión de liquidez en DeFi`
              : `Start using ${APP_NAME} today and experience the future of liquidity management in DeFi`}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard">
              <Button size="lg">
                {language === 'es' ? 'Acceder a Dashboard' : 'Access Dashboard'}
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline" size="lg">
                {language === 'es' ? 'Explorar más funcionalidades' : 'Explore More Features'}
              </Button>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t mt-16 py-8 bg-muted/30">
        <div className="container px-4 mx-auto max-w-7xl">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <div className="mb-4 sm:mb-0">
              <div className="font-bold text-xl mb-2">
                {APP_NAME.includes("Way") ? (
                  <>
                    <span className="text-foreground">Way</span>
                    <span className="text-primary">Pool</span>
                  </>
                ) : APP_NAME}
              </div>
              <p className="text-sm text-muted-foreground">
                {language === 'es' 
                  ? 'Optimización inteligente de liquidez en Uniswap V4'
                  : 'Intelligent liquidity optimization on Uniswap V4'}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Link href="/">
                <span className="text-sm font-medium hover:text-primary transition-colors">
                  {language === 'es' ? 'Inicio' : 'Home'}
                </span>
              </Link>
              <Link href="/dashboard">
                <span className="text-sm font-medium hover:text-primary transition-colors">Dashboard</span>
              </Link>
              <a href="/support" className="text-sm font-medium hover:text-primary transition-colors">
                {language === 'es' ? 'Documentación' : 'Documentation'}
              </a>
              <a href="/support" className="text-sm font-medium hover:text-primary transition-colors">
                {language === 'es' ? 'Comunidad' : 'Community'}
              </a>
            </div>
          </div>
          <Separator className="my-6" />
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground mb-4 sm:mb-0">
              © 2025 {APP_NAME}. {language === 'es' ? 'Todos los derechos reservados.' : 'All rights reserved.'}
            </p>
            <div className="flex items-center space-x-4">
              <a href="https://x.com/WayBank3" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                  <path d="M4 4l11.733 16H20L8.267 4H4z" />
                  <path d="M4 20l6.768-6.768" />
                  <path d="M20 4l-7.733 7.733" />
                </svg>
              </a>
              <a href="https://www.youtube.com/@WayBank3" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                  <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
                  <path d="m10 15 5-3-5-3z" />
                </svg>
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                  <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                  <path d="M9 18c-4.51 2-5-2-7-2" />
                </svg>
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HowItWorks;