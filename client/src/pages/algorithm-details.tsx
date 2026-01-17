import { useState, useEffect } from "react";
import { 
  ArrowLeft, 
  BarChart2, 
  Shield, 
  PieChart, 
  RefreshCcw,
  Sun,
  Moon,
  Code,
  Layers,
  Cpu,
  LineChart,
  Network,
  Lock,
  Github,
  HelpCircle
} from "lucide-react";
import { APP_NAME } from "@/utils/app-config";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useLanguage } from "@/context/language-context";
import { useTheme } from "@/hooks/use-theme";
import { algorithmTranslations } from "@/translations/algorithm";
import { createTranslationProxy } from "@/utils/translation-utils";
import { sendGAEvent } from "@/components/analytics/GoogleAnalytics";
import LanguageSelector from "@/components/language-selector";
import SEOManager from "@/components/seo/seo-manager";
import { BlockchainBackground, BlockchainBanner } from "@/components/svg/blockchain-background";
import { 
  AlgorithmOverviewIcon, 
  MultiPoolIcon, 
  LossPreventionIcon, 
  NFTIntegrationIcon 
} from "@/components/svg/algorithm-icons";
import { AnimatedChart } from "@/components/algorithm/animated-chart";
import { FeatureCard } from "@/components/algorithm/feature-card";
import { BlockchainScene } from "@/components/algorithm/blockchain-scene";
import { ProcessFlow } from "@/components/algorithm/process-flow";

export default function AlgorithmDetails() {
  const { language } = useLanguage();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  // Obtenemos traducciones
  const t = createTranslationProxy(algorithmTranslations, language);
  
  // Para evitar problemas de hidratación
  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted) return null;
  
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };
  
  const isDark = theme === "dark" || (theme === "system" && 
    window.matchMedia("(prefers-color-scheme: dark)").matches);
  
  return (
    <div className="min-h-screen bg-background relative">
      {/* Fondo Blockchain */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <BlockchainBackground />
      </div>
      
      <SEOManager 
        path="/algorithm-details" 
        type="article" 
        image="/og-algorithm-image.jpg"
        title={t.algorithmTitle}
        description={t.algorithmMetaDescription}
      />
      
      {/* Header Mejorado */}
      <header className="border-b bg-background/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="container px-4 py-4 mx-auto max-w-7xl flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon" className="mr-2">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="font-bold text-xl">
              <span className="text-foreground">Way</span>
              <span className="text-primary">Pool</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a href="https://github.com/JBHAPEX/WayBank" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="icon" className="border-primary/20" title="GitHub Repository">
                <Github className="h-5 w-5" />
              </Button>
            </a>
            
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
                    from: 'algorithm_details_page',
                    language: language,
                    theme: theme
                  });
                  console.log('[Google Analytics] Help button clicked from algorithm page');
                }}
              >
                <HelpCircle className="h-5 w-5" />
              </a>
            </Button>
            
            <LanguageSelector />
            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <Link href="/dashboard">
              <Button size="sm">Dashboard</Button>
            </Link>
          </div>
        </div>
      </header>
      
      {/* Hero Section con Banner */}
      <div className="relative overflow-hidden bg-primary/5 border-b">
        <div className="absolute inset-0 pointer-events-none">
          <BlockchainBanner className="text-primary" />
        </div>
        
        <div className="container px-4 py-16 mx-auto max-w-7xl relative">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight bg-gradient-to-r from-primary/90 to-primary bg-clip-text text-transparent">
              {t.pageTitle}
            </h1>
            <p className="text-xl text-muted-foreground">
              {t.pageSubtitle}
            </p>
          </div>
        </div>
      </div>
      
      {/* Contenido principal */}
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <Tabs defaultValue="overview" className="w-full">
            {/* Tabs responsivos con versión móvil optimizada */}
            <div className="overflow-x-auto pb-2 mb-2">
              <TabsList className="flex mb-6 w-full md:w-auto md:grid md:grid-cols-4">
                <TabsTrigger value="overview" className="flex items-center gap-1 text-xs md:text-sm whitespace-nowrap px-2 md:px-4">
                  <AlgorithmOverviewIcon className="w-4 h-4" />
                  <span className="hidden xs:inline">{t.overview}</span>
                  <span className="inline xs:hidden">Intro</span>
                </TabsTrigger>
                <TabsTrigger value="poolStrategy" className="flex items-center gap-1 text-xs md:text-sm whitespace-nowrap px-2 md:px-4">
                  <MultiPoolIcon className="w-4 h-4" />
                  <span className="hidden xs:inline">{t.poolStrategy}</span>
                  <span className="inline xs:hidden">Pools</span>
                </TabsTrigger>
                <TabsTrigger value="permanentLoss" className="flex items-center gap-1 text-xs md:text-sm whitespace-nowrap px-2 md:px-4">
                  <LossPreventionIcon className="w-4 h-4" />
                  <span className="hidden xs:inline">{t.permanentLoss}</span>
                  <span className="inline xs:hidden">Protección</span>
                </TabsTrigger>
                <TabsTrigger value="nftIntegration" className="flex items-center gap-1 text-xs md:text-sm whitespace-nowrap px-2 md:px-4">
                  <NFTIntegrationIcon className="w-4 h-4" />
                  <span className="hidden xs:inline">{t.nftIntegration}</span>
                  <span className="inline xs:hidden">NFTs</span>
                </TabsTrigger>
              </TabsList>
            </div>
            
            {/* Tab Contenido: Overview */}
            <TabsContent value="overview" className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                  <h2 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
                    {t.whatIsAlgorithm}
                  </h2>
                  <p className="text-muted-foreground mb-6">{t.algorithmDesc}</p>
                </div>
                <div className="relative h-64 bg-primary/5 rounded-lg border overflow-hidden">
                  <BlockchainScene className="opacity-75" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-background/80 backdrop-blur-sm p-3 rounded-lg border shadow-lg">
                      <Code className="h-10 w-10 text-primary" />
                    </div>
                  </div>
                </div>
              </div>
              
              <h3 className="text-2xl font-bold mb-4">{t.keyBenefits}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FeatureCard
                  title={t.benefitCapital}
                  description={t.benefitCapitalDesc}
                  icon={<BarChart2 className="h-6 w-6" />}
                  variant="highlight"
                />
                <FeatureCard
                  title={t.benefitRisk}
                  description={t.benefitRiskDesc}
                  icon={<Shield className="h-6 w-6" />}
                  variant="highlight"
                />
                <FeatureCard
                  title={t.benefitYield}
                  description={t.benefitYieldDesc}
                  icon={<PieChart className="h-6 w-6" />}
                  variant="highlight"
                />
                <FeatureCard
                  title={t.benefitAutomation}
                  description={t.benefitAutomationDesc}
                  icon={<RefreshCcw className="h-6 w-6" />}
                  variant="highlight"
                />
              </div>
              
              <div className="bg-primary/5 p-6 rounded-lg border mt-8">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <LineChart className="h-5 w-5 text-primary" />
                  {t.simulatedPerformance || 
                    (currentLanguage === 'es' ? "Rendimiento Simulado" : 
                     currentLanguage === 'fr' ? "Performance Simulée" : 
                     "Simulated Performance")}
                </h3>
                <AnimatedChart type="poolPerformance" />
              </div>
            </TabsContent>
            
            {/* Tab Contenido: Pool Strategy */}
            <TabsContent value="poolStrategy" className="space-y-8">
              <div className="relative overflow-hidden rounded-lg border bg-primary/5 p-8 mb-8">
                <div className="absolute inset-0 opacity-10">
                  <MultiPoolIcon className="w-full h-full text-primary" />
                </div>
                <div className="relative">
                  <h2 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
                    {t.poolStrategyTitle}
                  </h2>
                  <p className="text-muted-foreground text-lg max-w-2xl">
                    {t.poolStrategyDesc}
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <FeatureCard
                    title={t.multiPoolAdvantage}
                    description={t.multiPoolAdvantageDesc}
                    icon={<Network className="h-6 w-6" />}
                    direction="vertical"
                  />
                  
                  <FeatureCard
                    title={t.poolSelection}
                    description={t.poolSelectionDesc}
                    icon={<PieChart className="h-6 w-6" />}
                    direction="vertical"
                  />
                  
                  <FeatureCard
                    title={t.balancingMechanism}
                    description={t.balancingMechanismDesc}
                    icon={<RefreshCcw className="h-6 w-6" />}
                    direction="vertical"
                  />
                </div>
                
                <div className="space-y-6">
                  <div className="bg-background rounded-lg border p-6">
                    <h3 className="font-medium text-lg mb-4">Distribución Dinámica entre Pools</h3>
                    <AnimatedChart type="balance" className="mb-6" />
                    
                    <h3 className="font-medium text-lg mb-4">Distribución de Liquidez</h3>
                    <AnimatedChart type="liquidity" />
                  </div>
                  
                  <div className="bg-primary/5 rounded-lg border p-6">
                    <h3 className="font-semibold mb-4">Pasos del Algoritmo</h3>
                    <div className="space-y-3">
                      <div className="flex gap-3 items-start">
                        <div className="bg-primary/10 text-primary font-medium rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">1</div>
                        <p className="text-sm">{t.poolStrategyStep1}</p>
                      </div>
                      <div className="flex gap-3 items-start">
                        <div className="bg-primary/10 text-primary font-medium rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">2</div>
                        <p className="text-sm">{t.poolStrategyStep2}</p>
                      </div>
                      <div className="flex gap-3 items-start">
                        <div className="bg-primary/10 text-primary font-medium rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">3</div>
                        <p className="text-sm">{t.poolStrategyStep3}</p>
                      </div>
                      <div className="flex gap-3 items-start">
                        <div className="bg-primary/10 text-primary font-medium rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">4</div>
                        <p className="text-sm">{t.poolStrategyStep4}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            {/* Tab Contenido: Permanent Loss */}
            <TabsContent value="permanentLoss" className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                  <h2 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
                    {t.permanentLossTitle}
                  </h2>
                  <p className="text-muted-foreground mb-6">{t.permanentLossDesc}</p>
                </div>
                <div className="bg-primary/5 border rounded-xl p-6 flex justify-center">
                  <LossPreventionIcon className="w-44 h-44 text-primary" />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="overflow-hidden">
                  <div className="bg-red-500/10 px-6 py-3 border-b">
                    <h3 className="font-semibold text-red-600 dark:text-red-400 flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      {t.traditionalProblems}
                    </h3>
                  </div>
                  <CardContent className="pt-6">
                    <p className="text-muted-foreground">{t.traditionalProblemsDesc}</p>
                    
                    <div className="mt-6 flex justify-center">
                      <div className="relative w-40 h-40">
                        <div className="absolute inset-0 border-4 border-dashed border-red-200 dark:border-red-950 rounded-full animate-spin-slow" style={{ animationDuration: '30s' }}></div>
                        <div className="absolute inset-4 flex items-center justify-center bg-background rounded-full border">
                          <div className="text-red-500 text-lg font-semibold">Pérdida</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="overflow-hidden">
                  <div className="bg-green-500/10 px-6 py-3 border-b">
                    <h3 className="font-semibold text-green-600 dark:text-green-400 flex items-center gap-2">
                      <Lock className="h-5 w-5" />
                      {t.waybankSolution}
                    </h3>
                  </div>
                  <CardContent className="pt-6">
                    <p className="text-muted-foreground">{t.waybankSolutionDesc}</p>
                    
                    <div className="mt-6 relative flex justify-center">
                      <div className="relative w-40 h-40">
                        <div className="absolute inset-0 bg-primary/10 rounded-full"></div>
                        <div className="absolute inset-4 flex items-center justify-center bg-background rounded-full border border-primary">
                          <div className="text-primary text-lg font-semibold">Protegido</div>
                        </div>
                        <div className="absolute inset-[-12px] border-4 border-primary/20 rounded-full"></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <FeatureCard
                  title={t.dynamicRanges}
                  description={t.dynamicRangesDesc}
                  icon={<Layers className="h-6 w-6" />}
                  variant="outline"
                />
                <FeatureCard
                  title={t.crossPoolHedging}
                  description={t.crossPoolHedgingDesc}
                  icon={<Network className="h-6 w-6" />}
                  variant="outline"
                />
              </div>
            </TabsContent>
            
            {/* Tab Contenido: NFT Integration */}
            <TabsContent value="nftIntegration" className="space-y-8">
              <div className="relative overflow-hidden rounded-lg border bg-gradient-to-br from-primary/10 to-background p-8 mb-8">
                <div className="absolute inset-0 opacity-10">
                  <NFTIntegrationIcon className="w-full h-full text-primary" />
                </div>
                <div className="relative">
                  <h2 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
                    {t.nftIntegrationTitle}
                  </h2>
                  <p className="text-muted-foreground text-lg max-w-2xl">
                    {t.nftIntegrationDesc}
                  </p>
                </div>
              </div>
              
              {/* Flujo de capital - Visualización de 4 pasos */}
              <ProcessFlow />
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 flex justify-center">
                  <div className="p-6 bg-background rounded-xl border shadow-lg max-w-xs">
                    <div className="aspect-square rounded-lg overflow-hidden bg-primary/5 border mb-4 flex items-center justify-center">
                      <NFTIntegrationIcon className="w-4/5 h-4/5 text-primary" />
                    </div>
                    <div className="text-center">
                      <h3 className="font-bold text-lg">{APP_NAME} NFT</h3>
                      <p className="text-sm text-muted-foreground">Certificado digital de participación en el algoritmo</p>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                      <div className="p-2 bg-background border rounded-md">
                        <span className="block text-primary font-medium">Pool ID</span>
                        ETH-USDC 0.3%
                      </div>
                      <div className="p-2 bg-background border rounded-md">
                        <span className="block text-primary font-medium">Tokens</span>
                        2.5 ETH + 5K USDC
                      </div>
                      <div className="p-2 bg-background border rounded-md">
                        <span className="block text-primary font-medium">Fecha</span>
                        04.04.2025
                      </div>
                      <div className="p-2 bg-background border rounded-md">
                        <span className="block text-primary font-medium">Estado</span>
                        Activo
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="lg:col-span-2 space-y-6">
                  <FeatureCard
                    title={t.nftCreation}
                    description={t.nftCreationDesc}
                    icon={<Code className="h-6 w-6" />}
                    direction="vertical"
                  />
                  
                  <FeatureCard
                    title={t.nftOwnership}
                    description={t.nftOwnershipDesc}
                    icon={<Lock className="h-6 w-6" />}
                    direction="vertical"
                  />
                  
                  <FeatureCard
                    title={t.nftWithdrawal}
                    description={t.nftWithdrawalDesc}
                    icon={<Cpu className="h-6 w-6" />}
                    direction="vertical"
                  />
                  
                  <div className="mt-8 bg-primary/5 p-6 rounded-lg border">
                    <h3 className="text-xl font-semibold mb-4">{t.nftBenefits}</h3>
                    <p className="text-muted-foreground mb-6">{t.nftBenefitsDesc}</p>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <div className="bg-primary/10 text-primary rounded-full p-1 mt-0.5">
                          <Shield className="h-4 w-4" />
                        </div>
                        <span>{t.nftBenefit1}</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="bg-primary/10 text-primary rounded-full p-1 mt-0.5">
                          <BarChart2 className="h-4 w-4" />
                        </div>
                        <span>{t.nftBenefit2}</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="bg-primary/10 text-primary rounded-full p-1 mt-0.5">
                          <RefreshCcw className="h-4 w-4" />
                        </div>
                        <span>{t.nftBenefit3}</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}