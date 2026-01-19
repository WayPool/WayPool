import { useState, useEffect } from "react";
import { Link } from "wouter";
import { useTranslation } from "@/hooks/use-translation";
import { useLanguage } from "@/context/language-context";
import { useTheme } from "@/hooks/use-theme";
import { useToast } from "@/hooks/use-toast";
import { APP_NAME } from "@/utils/app-config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Moon, Sun, ChevronRight, Check, ArrowRight, 
  Gift, Users, Calculator, ChevronsUp,
  TrendingUp, Zap, ShieldCheck, RefreshCw,
  Clock, DollarSign, LineChart, Sparkles, Info
} from "lucide-react";
import LanguageSelector from "@/components/language-selector";
import { formatExactCurrency } from "@/lib/utils";
import { getRankInfo, referralRankLevels } from "@/components/referrals/referral-rank";

// Componente para la sección de Hero
const ReferralHero = () => {
  const { t } = useTranslation();
  
  return (
    <section className="py-20 md:py-28 bg-gradient-to-b from-background to-background/80">
      <div className="container px-4 md:px-6 mx-auto max-w-screen-xl">
        <div className="flex flex-col items-center text-center space-y-8">
          <div className="space-y-4 max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
              {t("Grow Together, Earn More")}
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground">
              {t(`Join our referral program and earn passive income by introducing your network to ${APP_NAME}'s advanced DeFi solutions.`)}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="gap-2">
              <Link href="/dashboard">
                {t("Join Now")} <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href="#benefits">
                {t("See Benefits")}
              </a>
            </Button>
          </div>
          
          <div className="mt-8 w-full max-w-5xl mx-auto bg-muted/30 backdrop-blur-sm rounded-2xl overflow-hidden border shadow-lg">
            <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center p-6 bg-card rounded-lg shadow-sm border">
                <Gift className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-2">{t("Commission Rewards")}</h3>
                <p className="text-muted-foreground text-center">
                  {t("Earn up to 4.5% commission on your referrals' yield earnings, paid in USDC.")}
                </p>
              </div>
              <div className="flex flex-col items-center p-6 bg-card rounded-lg shadow-sm border">
                <Users className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-2">{t("Ranking System")}</h3>
                <p className="text-muted-foreground text-center">
                  {t("Progress through our gamified ranking system with themed levels and increasing rewards.")}
                </p>
              </div>
              <div className="flex flex-col items-center p-6 bg-card rounded-lg shadow-sm border">
                <ChevronsUp className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-2">{t("APR Boost for Friends")}</h3>
                <p className="text-muted-foreground text-center">
                  {t(`Your referrals get a 1% APR boost on all their positions with ${APP_NAME}.`)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Componente de calculadora simplificada de recompensas para la página pública
const PublicRewardsCalculator = () => {
  const { t } = useTranslation();
  
  // Estados para los sliders
  const [numReferrals, setNumReferrals] = useState<number>(100);
  const [avgInvestment, setAvgInvestment] = useState<number>(25000);
  const [baseApr, setBaseApr] = useState<number>(60);
  const [timeHorizon, setTimeHorizon] = useState<number>(5); // años
  
  // Obtener el porcentaje de comisión según el número de referidos
  const getCommissionRate = (referrals: number) => {
    // Porcentaje base es 1%
    let rate = 0.01;
    
    // Por cada nivel completado, aumentamos un 0.5% adicional
    const currentRank = getRankInfo(referrals);
    const rankIndex = referralRankLevels.findIndex(rank => rank.name === currentRank.name);
    
    // Agregamos 0.5% por cada nivel alcanzado después del primero
    if (rankIndex > 0) {
      rate += (rankIndex * 0.005);
    }
    
    return rate;
  };
  
  // Calcular recompensas
  const calculateRewards = () => {
    // Obtenemos la tasa de comisión actual basada en el nivel de referidos
    const commissionRate = getCommissionRate(numReferrals);
    
    // Ganancia por referido = inversión promedio * APR base * tasa de comisión (que aumenta con los niveles)
    const perReferralAnnual = avgInvestment * (baseApr / 100) * commissionRate;
    
    // Total anual
    const annualRewards = perReferralAnnual * numReferrals;
    
    // Total acumulado según el horizonte temporal (sin compounding para simplicidad)
    const totalRewards = annualRewards * timeHorizon;
    
    // Retornar datos calculados
    return {
      perReferral: perReferralAnnual,
      annual: annualRewards,
      total: totalRewards,
      monthly: annualRewards / 12,
      commissionRate: commissionRate * 100 // Convertido a porcentaje para mostrar
    };
  };
  
  const rewards = calculateRewards();
  
  return (
    <Card className="shadow-lg border-primary/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5 text-primary" />
          {t("Referral Rewards Calculator")}
        </CardTitle>
        <CardDescription>
          {t("Calculate your potential earnings from our referral program")}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Columna de controles */}
          <div className="space-y-6">
            {/* Slider: Número de referidos */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="font-medium text-sm flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" />
                  {t("Number of Referrals")}
                </label>
                <span className="bg-primary/10 px-2 py-1 rounded text-sm font-medium">
                  {numReferrals}
                </span>
              </div>
              <Slider
                value={[numReferrals]}
                min={1}
                max={1000}
                step={10}
                onValueChange={(value) => setNumReferrals(value[0])}
                className="py-2"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>1</span>
                <span>500</span>
                <span>1000</span>
              </div>
            </div>
            
            {/* Slider: Inversión promedio */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="font-medium text-sm flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-primary" />
                  {t("Average Investment")}
                </label>
                <span className="bg-primary/10 px-2 py-1 rounded text-sm font-medium">
                  ${avgInvestment.toLocaleString()}
                </span>
              </div>
              <Slider
                value={[avgInvestment]}
                min={100}
                max={100000}
                step={500}
                onValueChange={(value) => setAvgInvestment(value[0])}
                className="py-2"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>$100</span>
                <span>$50,000</span>
                <span>$100,000</span>
              </div>
            </div>
            
            {/* Slider: APR Base */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="font-medium text-sm flex items-center gap-2">
                  <LineChart className="h-4 w-4 text-primary" />
                  {t("Base APR")}
                </label>
                <span className="bg-primary/10 px-2 py-1 rounded text-sm font-medium">
                  {baseApr.toFixed(2)}%
                </span>
              </div>
              <Slider
                value={[baseApr]}
                min={1}
                max={100}
                step={1}
                onValueChange={(value) => setBaseApr(value[0])}
                className="py-2"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>1%</span>
                <span>50%</span>
                <span>100%</span>
              </div>
            </div>
            
            {/* Slider: Horizonte Temporal */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="font-medium text-sm flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" />
                  {t("Time Horizon")}
                </label>
                <span className="bg-primary/10 px-2 py-1 rounded text-sm font-medium">
                  {timeHorizon} {t("year(s)")}
                </span>
              </div>
              <Slider
                value={[timeHorizon]}
                min={1}
                max={10}
                step={1}
                onValueChange={(value) => setTimeHorizon(value[0])}
                className="py-2"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>1 {t("year")}</span>
                <span>5 {t("years")}</span>
                <span>10 {t("years")}</span>
              </div>
            </div>
          </div>
          
          {/* Columna de resultados */}
          <div className="space-y-6">
            <div className="flex items-center">
              <h3 className="font-medium text-lg flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                {t("Your Potential Earnings")}
              </h3>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
                <CardContent className="pt-6">
                  <div className="text-muted-foreground text-sm">{t("Total Over")} {timeHorizon} {t("years")}</div>
                  <div className="text-3xl font-bold mt-1">
                    {formatExactCurrency(rewards.total, "USD")}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {t("With")} {numReferrals} {t("referrals investing")} {formatExactCurrency(avgInvestment, "USD")} {t("each")}
                  </div>
                </CardContent>
              </Card>
              
              <div className="grid grid-cols-2 gap-4">
                <Card className="border-primary/10">
                  <CardContent className="pt-6">
                    <div className="text-muted-foreground text-sm">{t("Annual Earnings")}</div>
                    <div className="text-2xl font-bold mt-1">
                      {formatExactCurrency(rewards.annual, "USD")}
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border-primary/10">
                  <CardContent className="pt-6">
                    <div className="text-muted-foreground text-sm">{t("Monthly Earnings")}</div>
                    <div className="text-2xl font-bold mt-1">
                      {formatExactCurrency(rewards.monthly, "USD")}
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Alert className="bg-primary/5 border-primary/20">
                <Sparkles className="h-4 w-4 text-primary" />
                <AlertDescription className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{t("Your Commission Rate")}</h4>
                    <Badge variant="outline" className="bg-primary/10 hover:bg-primary/15">
                      {rewards.commissionRate.toFixed(1)}%
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {t("Your rank gives you")} {rewards.commissionRate.toFixed(1)}% {t("commission rate on all earnings generated by your referrals.")}
                  </p>
                </AlertDescription>
              </Alert>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Componente de sección de beneficios
const BenefitsSection = () => {
  const { t } = useTranslation();
  
  return (
    <section id="benefits" className="py-20 bg-muted/50">
      <div className="container px-4 md:px-6 mx-auto max-w-screen-xl">
        <div className="flex flex-col items-center text-center space-y-4 mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
            {t("Benefits for Everyone")}
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {t("Our referral program is designed to benefit both you and the people you refer.")}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto">
          {/* Beneficios para referidores */}
          <div className="bg-card border shadow-md rounded-xl overflow-hidden">
            <div className="bg-primary/10 p-6">
              <h3 className="text-2xl font-bold flex items-center gap-2">
                <Gift className="h-6 w-6 text-primary" />
                {t("For Referrers")}
              </h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-start space-x-4">
                <div className="mt-1 bg-primary/20 p-2 rounded-full text-primary">
                  <Check className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="font-semibold">{t("Passive Income")}</h4>
                  <p className="text-muted-foreground text-sm mt-1">
                    {t("Earn ongoing commission from your referrals' yield as long as they remain active.")}
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="mt-1 bg-primary/20 p-2 rounded-full text-primary">
                  <Check className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="font-semibold">{t("Increasing Rewards")}</h4>
                  <p className="text-muted-foreground text-sm mt-1">
                    {t("Your commission rate increases as you progress through our ranking system, from 1% up to 4.5%.")}
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="mt-1 bg-primary/20 p-2 rounded-full text-primary">
                  <Check className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="font-semibold">{t("Exclusive Rewards")}</h4>
                  <p className="text-muted-foreground text-sm mt-1">
                    {t("Unlock exclusive perks, early access to new features, and special events at higher ranks.")}
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="mt-1 bg-primary/20 p-2 rounded-full text-primary">
                  <Check className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="font-semibold">{t("Quick Withdrawals")}</h4>
                  <p className="text-muted-foreground text-sm mt-1">
                    {t("Withdraw your earned commissions in USDC directly to your wallet anytime (minimum 100 USDC).")}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Beneficios para referidos */}
          <div className="bg-card border shadow-md rounded-xl overflow-hidden">
            <div className="bg-primary/10 p-6">
              <h3 className="text-2xl font-bold flex items-center gap-2">
                <Users className="h-6 w-6 text-primary" />
                {t("For Your Referrals")}
              </h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-start space-x-4">
                <div className="mt-1 bg-primary/20 p-2 rounded-full text-primary">
                  <Check className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="font-semibold">{t("APR Boost")}</h4>
                  <p className="text-muted-foreground text-sm mt-1">
                    {t(`Your referrals receive a permanent 1% APR boost on all their positions with ${APP_NAME}.`)}
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="mt-1 bg-primary/20 p-2 rounded-full text-primary">
                  <Check className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="font-semibold">{t("No Fee Sharing")}</h4>
                  <p className="text-muted-foreground text-sm mt-1">
                    {t(`Your commission doesn't come from your referrals' earnings - it's paid by ${APP_NAME} as a reward.`)}
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="mt-1 bg-primary/20 p-2 rounded-full text-primary">
                  <Check className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="font-semibold">{t("Enhanced Support")}</h4>
                  <p className="text-muted-foreground text-sm mt-1">
                    {t("Referred users receive priority support and personalized onboarding assistance.")}
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="mt-1 bg-primary/20 p-2 rounded-full text-primary">
                  <Check className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="font-semibold">{t("Join Our Community")}</h4>
                  <p className="text-muted-foreground text-sm mt-1">
                    {t("Become part of our growing DeFi community with exclusive educational content and events.")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Componente de sección de niveles de ranking
const RankingSection = () => {
  const { t } = useTranslation();
  
  // Muestra solo algunos niveles representativos para la página pública
  const displayedRanks = [
    referralRankLevels[0], // Rookie (0-10)
    referralRankLevels[2], // Cat (26-50)
    referralRankLevels[4], // Sentinel (101-250)
    referralRankLevels[6], // Legend (501-999)
  ];
  
  return (
    <section className="py-20">
      <div className="container px-4 md:px-6 mx-auto max-w-screen-xl">
        <div className="flex flex-col items-center text-center space-y-4 mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
            {t("Referral Ranking System")}
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {t("Progress through our gamified ranking system and earn higher commission rates as you refer more users.")}
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {displayedRanks.map((rank, idx) => (
            <Card key={idx} className={`border shadow-md overflow-hidden ${idx === 3 ? 'bg-gradient-to-b from-primary/5 to-background border-primary/20' : ''}`}>
              <div className={`p-6 flex flex-col items-center ${idx === 3 ? 'relative overflow-hidden' : ''}`}>
                {idx === 3 && (
                  <div className="absolute -right-3 -top-3 bg-primary text-primary-foreground text-xs px-3 py-1 rotate-12 shadow-sm">
                    {t("Ultimate")}
                  </div>
                )}
                <div className="w-20 h-20 rounded-full flex items-center justify-center mb-4 bg-primary/10">
                  <rank.icon className={`h-12 w-12 ${rank.color}`} />
                </div>
                <h3 className="text-xl font-bold">{rank.name}</h3>
                <div className="text-sm text-muted-foreground mt-1">
                  {rank.min === 1000 ? 
                    t("1000+ referrals") : 
                    `${rank.min}-${rank.max} ${t("referrals")}`
                  }
                </div>
                <Badge variant="outline" className="mt-4 bg-primary/10">
                  {(1 + (referralRankLevels.indexOf(rank) * 0.5)).toFixed(1)}% {t("Commission")}
                </Badge>
                <p className="text-sm text-muted-foreground mt-4">
                  {t(`Earn ${(1 + (referralRankLevels.indexOf(rank) * 0.5)).toFixed(1)}% commission on all referrals' yields`)}
                </p>
              </div>
            </Card>
          ))}
        </div>
        
        <div className="mt-8 text-center">
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t(`View all 7 ranking levels and their benefits by signing up for ${APP_NAME}.`)}
          </p>
          <Link href="/dashboard">
            <Button className="mt-4">
              {t("Sign Up & See All Ranks")}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

// Componente de testimonios
const TestimonialsSection = () => {
  const { t } = useTranslation();
  
  return (
    <section className="py-20 bg-muted/50">
      <div className="container px-4 md:px-6 mx-auto max-w-screen-xl">
        <div className="flex flex-col items-center text-center space-y-4 mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
            {t("Success Stories")}
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {t("Hear from our top referrers and learn how they've built their passive income stream.")}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card className="shadow-md border">
            <CardContent className="pt-8 pb-6 px-6">
              <div className="flex flex-col items-center mb-6">
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-xl mb-4">
                  CL
                </div>
                <h3 className="font-semibold">Carlos L.</h3>
                <div className="text-sm text-muted-foreground">Phoenix Rank • 347 Referrals</div>
                <div className="flex mt-2">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 fill-primary" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-muted-foreground italic text-sm">
{t(`I've been earning over $3,500 monthly in passive income through ${APP_NAME}'s referral program. As a crypto influencer, the transparent commission structure and real-time dashboard have made it easy to track my earnings.`)}
              </p>
            </CardContent>
          </Card>
          
          <Card className="shadow-md border">
            <CardContent className="pt-8 pb-6 px-6">
              <div className="flex flex-col items-center mb-6">
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-xl mb-4">
                  MK
                </div>
                <h3 className="font-semibold">Maria K.</h3>
                <div className="text-sm text-muted-foreground">Dog Rank • 72 Referrals</div>
                <div className="flex mt-2">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 fill-primary" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-muted-foreground italic text-sm">
                "{t("What I love most is that my friends get a 1% APR boost - it's a win-win. I started with just my close network and have grown to Dog rank in 3 months. The gamification makes it fun to track progress!")}"
              </p>
            </CardContent>
          </Card>
          
          <Card className="shadow-md border">
            <CardContent className="pt-8 pb-6 px-6">
              <div className="flex flex-col items-center mb-6">
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-xl mb-4">
                  AR
                </div>
                <h3 className="font-semibold">Alex R.</h3>
                <div className="text-sm text-muted-foreground">Sentinel Rank • 183 Referrals</div>
                <div className="flex mt-2">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 fill-primary" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-muted-foreground italic text-sm">
                "{t("As a DeFi advisor, I've generated over $45,000 in commissions since joining the program last year. My clients appreciate the APR boost, and I love how the increasing commission tiers reward my ongoing efforts.")}"
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

// Componente CTA
const CTASection = () => {
  const { t, language } = useTranslation();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showNameField, setShowNameField] = useState(false);
  const { toast } = useToast();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: t("Email Required"),
        description: t("Please enter your email address"),
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      console.log("Enviando solicitud de suscripción:", {
        email,
        name: name || undefined,
        language: language || 'es'
      });
      
      const response = await fetch('/api/referral/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          name: name || undefined,
          language: language || 'es',
        }),
      });
      
      console.log("Respuesta recibida:", {
        status: response.status,
        statusText: response.statusText,
      });
      
      const responseData = await response.json();
      console.log("Datos de respuesta:", responseData);
      
      if (response.ok) {
        toast({
          title: t("Subscription Successful"),
          description: t("You've been subscribed to our referral program updates!"),
        });
        setEmail('');
        setName('');
      } else {
        toast({
          title: t("Subscription Failed"),
          description: responseData.error || t("An error occurred. Please try again."),
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error subscribing:", error);
      toast({
        title: t("Subscription Failed"),
        description: t("Connection error. Please check your internet and try again."),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <section className="py-20">
      <div className="container px-4 md:px-6 mx-auto max-w-screen-xl">
        <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-2xl p-8 md:p-12 shadow-lg">
          <div className="flex flex-col items-center text-center space-y-6 max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tighter">
              {t("Start Earning Today")}
            </h2>
            <p className="text-xl text-muted-foreground">
              {t("Join thousands of users already benefiting from our referral program. Sign up, share your code, and start earning.")}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
              <Link href="/dashboard" className="flex-1">
                <Button className="w-full" size="lg">
                  {t("Sign Up Now")}
                </Button>
              </Link>
              <Link href="/how-it-works" className="flex-1">
                <Button variant="outline" className="w-full" size="lg">
                  {t("Learn More")}
                </Button>
              </Link>
            </div>
            
            <div className="w-full max-w-md pt-8 border-t border-primary/10 mt-8">
              <h3 className="font-medium mb-4">{t("Get Updates on Our Referral Program")}</h3>
              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <div className="flex gap-2">
                  <Input 
                    type="email" 
                    placeholder={t("Your email address")} 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1"
                    onFocus={() => setShowNameField(true)}
                  />
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <span className="animate-spin mr-2">⟳</span>
                        {t("Sending")}
                      </>
                    ) : (
                      t("Subscribe")
                    )}
                  </Button>
                </div>
                
                {showNameField && (
                  <Input 
                    type="text" 
                    placeholder={t("Your name (optional)")} 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full"
                  />
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Sección de preguntas frecuentes
const FAQSection = () => {
  const { t } = useTranslation();
  
  return (
    <section className="py-20 bg-muted/50">
      <div className="container px-4 md:px-6 mx-auto max-w-screen-xl">
        <div className="flex flex-col items-center text-center space-y-4 mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
            {t("Frequently Asked Questions")}
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {t("Get answers to common questions about our referral program.")}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <div>
            <h3 className="text-xl font-bold mb-4">{t("How does the referral program work?")}</h3>
            <p className="text-muted-foreground">
              {t(`Once you sign up for ${APP_NAME}, you'll get a unique referral code. Share this code with friends, and when they join using your code, you'll earn ongoing commissions from their yield earnings while they receive a 1% APR boost.`)}
            </p>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">{t("How much can I earn?")}</h3>
            <p className="text-muted-foreground">
              {t("Your earnings depend on your referrals' investment amount, the yield they generate, and your commission rate. Commission rates start at 1% and increase up to 4.5% as you progress through our ranking system by referring more users.")}
            </p>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">{t("When and how do I get paid?")}</h3>
            <p className="text-muted-foreground">
              {t("Commissions accumulate in real-time and are displayed on your dashboard. You can withdraw your earnings in USDC once you've accumulated at least 100 USDC. Withdrawals process within 24 hours directly to your connected wallet.")}
            </p>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">{t("Do my referrals lose any yield to pay my commission?")}</h3>
            <p className="text-muted-foreground">
              {t(`No! This is what makes our program special. Your commission is paid by ${APP_NAME}, not deducted from your referrals' earnings. In fact, they receive a 1% APR boost, making it beneficial for them to use your referral code.`)}
            </p>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">{t("How long do I earn commissions?")}</h3>
            <p className="text-muted-foreground">
              {t(`You earn commissions as long as your referrals have active positions with ${APP_NAME}. There's no time limit - it's truly passive income that can last for years.`)}
            </p>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">{t("What happens if I reach Champion rank?")}</h3>
            <p className="text-muted-foreground">
              {t("Champion rank (1000+ referrals) gives you our maximum 4.5% commission rate, priority support, early access to new features, exclusive events, and custom benefits tailored to top referrers. You'll also be featured in our success stories if you choose.")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

// Página principal de referidos públicos
export default function PublicReferrals() {
  const { theme, setTheme } = useTheme();
  const { language, direction } = useLanguage();
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);
  
  // Para evitar problemas de hidratación
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b backdrop-blur-sm bg-background/80" dir={direction}>
        <div className="container flex h-16 items-center justify-between mx-auto max-w-screen-xl">
          <div className="flex items-center gap-2">
            <Link href="/">
              <span className="text-2xl font-bold cursor-pointer">
                <span className="text-foreground">Way</span>
                <span className="text-primary">Pool</span>
              </span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <a href="#benefits" className="text-sm font-medium hover:text-primary transition-colors">
              {t("Benefits")}
            </a>
            <a href="#calculator" className="text-sm font-medium hover:text-primary transition-colors">
              {t("Calculator")}
            </a>
            <Link href="/how-it-works">
              <span className="text-sm font-medium hover:text-primary transition-colors cursor-pointer">
                {t("How It Works")}
              </span>
            </Link>
            <a href="#faq" className="text-sm font-medium hover:text-primary transition-colors">
              {t("FAQ")}
            </a>
          </nav>

          <div className="flex items-center gap-2">
            <LanguageSelector />
            <Button variant="ghost" size="icon" onClick={toggleTheme} className="mr-2">
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <Link href="/dashboard">
              <Button>{t("Sign Up Now")} <ChevronRight className="ml-2 h-4 w-4" /></Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <ReferralHero />
        
        {/* Benefits Section */}
        <BenefitsSection />
        
        {/* Calculadora de Recompensas */}
        <section id="calculator" className="py-20">
          <div className="container px-4 md:px-6 mx-auto max-w-screen-xl">
            <div className="flex flex-col items-center text-center space-y-4 mb-12">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
                {t("Calculate Your Potential Earnings")}
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                {t("Use our calculator to see how much you could earn through our referral program.")}
              </p>
            </div>
            
            <div className="max-w-5xl mx-auto">
              <PublicRewardsCalculator />
            </div>
          </div>
        </section>
        
        {/* Ranking System */}
        <RankingSection />
        
        {/* Success Stories */}
        <TestimonialsSection />
        
        {/* FAQ Section */}
        <FAQSection />
        
        {/* CTA Section */}
        <CTASection />
      </main>

      {/* Footer */}
      <footer className="border-t py-12 bg-muted/30" dir={direction}>
        <div className="container px-4 md:px-6 mx-auto max-w-screen-xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <div className="space-y-4">
              <div className="text-2xl font-bold">
                <span className="text-foreground">Way</span>
                <span className="text-primary">Pool</span>
              </div>
              <p className="text-sm text-muted-foreground">
                {t("Intelligent liquidity optimization on Uniswap V4 with a rewarding referral program.")}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-4">{t("Platform")}</h3>
              <ul className="space-y-3 text-sm">
                <li><Link href="/dashboard"><span className="text-muted-foreground hover:text-primary transition-colors">{t("Dashboard")}</span></Link></li>
                <li><Link href="/positions"><span className="text-muted-foreground hover:text-primary transition-colors">{t("Positions")}</span></Link></li>
                <li><Link href="/analytics"><span className="text-muted-foreground hover:text-primary transition-colors">{t("Analytics")}</span></Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-4">{t("Resources")}</h3>
              <ul className="space-y-3 text-sm">
                <li><Link href="/how-it-works" className="text-muted-foreground hover:text-primary transition-colors">{t("Documentation")}</Link></li>
                <li><Link href="/support" className="text-muted-foreground hover:text-primary transition-colors">{t("Support")}</Link></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">{t("Community")}</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-4">{t("Legal")}</h3>
              <ul className="space-y-3 text-sm">
                <li><Link href="/terms-of-use"><span className="text-muted-foreground hover:text-primary transition-colors">{t("Terms of Use")}</span></Link></li>
                <li><Link href="/privacy-policy"><span className="text-muted-foreground hover:text-primary transition-colors">{t("Privacy Policy")}</span></Link></li>
                <li><Link href="/disclaimer"><span className="text-muted-foreground hover:text-primary transition-colors">{t("Disclaimer")}</span></Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 flex flex-col md:flex-row justify-between items-center max-w-6xl mx-auto">
            <p className="text-sm text-muted-foreground mb-4 md:mb-0">
              {t("© 2025 WayBank. All rights reserved.")}
            </p>
            <div className="flex items-center space-x-4">
              <a href="https://x.com/WayBank" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                  <path d="M4 4l11.733 16H20L8.267 4H4z" />
                  <path d="M4 20l6.768-6.768" />
                  <path d="M20 4l-7.733 7.733" />
                </svg>
              </a>
              <a href="https://www.youtube.com/@WayBank" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
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
    </div>
  );
}