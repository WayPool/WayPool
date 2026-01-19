import { useState, useEffect } from "react";
import {
  TrendingUp,
  Percent,
  Clock,
  Users,
  ArrowRight,
  Database,
  Cpu,
  Shield,
  BarChart3,
  Wallet,
  RefreshCcw,
  CheckCircle2,
  ArrowDownToLine,
  Layers,
  Zap,
  Globe,
  Calendar,
  DollarSign,
  PieChart,
  LineChart,
  Activity,
  AlertTriangle,
  Scale,
  FileWarning,
  Info
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/language-context";

// Traducciones
const translations = {
  en: {
    title: "Yield Distribution System",
    subtitle: "How PMTS Algorithm distributes returns to WayPool positions",
    pmtsTitle: "PMTS Algorithm",
    pmtsDesc: "Proprietary Multi-Strategy Trading System that generates consistent returns through advanced quantitative strategies",
    howItWorks: "How It Works",
    step1Title: "Capital Aggregation",
    step1Desc: "User deposits are aggregated into optimized liquidity pools across multiple DeFi protocols",
    step2Title: "PMTS Processing",
    step2Desc: "The PMTS algorithm executes quantitative strategies generating daily returns",
    step3Title: "APR Calculation",
    step3Desc: "Average APR from 4 Uniswap V3 pools is calculated and adjusted by timeframe",
    step4Title: "Daily Distribution",
    step4Desc: "Returns are distributed proportionally to all active positions at midnight UTC",
    aprAdjustments: "APR Adjustments by Timeframe",
    timeframe30: "30 Days (Monthly)",
    timeframe90: "90 Days (Quarterly)",
    timeframe365: "365 Days (Annual)",
    adjustment: "Adjustment",
    finalApr: "Final APR",
    example: "Example",
    baseApr: "Base APR",
    formula: "Distribution Formula",
    formulaDesc: "Daily Yield = (Capital × Adjusted APR) / 365",
    realTimeMonitoring: "Real-Time Monitoring",
    currentApr: "Current APR",
    contractApr: "Contract APR",
    lastUpdate: "Last Update",
    activePools: "Active Pools",
    poolsMonitored: "pools monitored in real-time",
    securityFeatures: "Security & Transparency",
    feature1: "Blockchain-verified transactions",
    feature2: "Auditable distribution history",
    feature3: "Non-custodial NFT positions",
    feature4: "Daily automatic updates",
    viewPmts: "View PMTS Platform",
    learnMore: "Learn More",
    // Risk Disclaimer
    riskDisclaimer: "Risk Disclaimer",
    riskWarning: "Important Investment Warning",
    riskText1: "Cryptocurrency and DeFi investments involve substantial risk of loss and are not suitable for all investors. The value of digital assets can be extremely volatile and may result in significant or total loss of invested capital.",
    riskText2: "Past performance is not indicative of future results. Historical returns, expected yields, and APR projections shown on this platform do not guarantee future performance. Market conditions can change rapidly and without warning.",
    riskText3: "This platform does not provide financial, investment, tax, or legal advice. You should consult with qualified professionals before making any investment decisions. Only invest funds you can afford to lose entirely.",
    riskText4: "Regulatory frameworks for digital assets vary by jurisdiction. Users are responsible for compliance with applicable laws in their country of residence.",
    euRegulation: "EU Regulation (MiCA)",
    euText: "In accordance with the Markets in Crypto-Assets Regulation (EU) 2023/1114, crypto-assets are not covered by investor compensation schemes and may lose their entire value.",
    usRegulation: "US Regulation (SEC/CFTC)",
    usText: "Digital assets may be considered securities under U.S. law. This platform is not registered with the SEC or CFTC. U.S. residents should verify regulatory compliance before investing.",
    uaeRegulation: "UAE Regulation (VARA/SCA)",
    uaeText: "Virtual assets in the UAE are regulated by VARA and SCA. This platform operates in compliance with applicable UAE regulations. Investors should understand local requirements.",
    acknowledgment: "By using this platform, you acknowledge that you have read, understood, and accept these risks."
  },
  es: {
    title: "Sistema de Distribución de Rendimientos",
    subtitle: "Cómo el algoritmo PMTS distribuye los rendimientos a las posiciones de WayPool",
    pmtsTitle: "Algoritmo PMTS",
    pmtsDesc: "Sistema de Trading Multi-Estrategia Propietario que genera rendimientos consistentes mediante estrategias cuantitativas avanzadas",
    howItWorks: "Cómo Funciona",
    step1Title: "Agregación de Capital",
    step1Desc: "Los depósitos de usuarios se agregan en pools de liquidez optimizados en múltiples protocolos DeFi",
    step2Title: "Procesamiento PMTS",
    step2Desc: "El algoritmo PMTS ejecuta estrategias cuantitativas generando rendimientos diarios",
    step3Title: "Cálculo de APR",
    step3Desc: "El APR promedio de 4 pools de Uniswap V3 se calcula y ajusta según el timeframe",
    step4Title: "Distribución Diaria",
    step4Desc: "Los rendimientos se distribuyen proporcionalmente a todas las posiciones activas a medianoche UTC",
    aprAdjustments: "Ajustes de APR por Timeframe",
    timeframe30: "30 Días (Mensual)",
    timeframe90: "90 Días (Trimestral)",
    timeframe365: "365 Días (Anual)",
    adjustment: "Ajuste",
    finalApr: "APR Final",
    example: "Ejemplo",
    baseApr: "APR Base",
    formula: "Fórmula de Distribución",
    formulaDesc: "Rendimiento Diario = (Capital × APR Ajustado) / 365",
    realTimeMonitoring: "Monitoreo en Tiempo Real",
    currentApr: "APR Actual",
    contractApr: "APR Contrato",
    lastUpdate: "Última Actualización",
    activePools: "Pools Activos",
    poolsMonitored: "pools monitoreados en tiempo real",
    securityFeatures: "Seguridad y Transparencia",
    feature1: "Transacciones verificadas en blockchain",
    feature2: "Historial de distribución auditable",
    feature3: "Posiciones NFT no custodiales",
    feature4: "Actualizaciones automáticas diarias",
    viewPmts: "Ver Plataforma PMTS",
    learnMore: "Más Información",
    // Risk Disclaimer
    riskDisclaimer: "Aviso de Riesgos",
    riskWarning: "Advertencia Importante de Inversión",
    riskText1: "Las inversiones en criptomonedas y DeFi conllevan un riesgo sustancial de pérdida y no son adecuadas para todos los inversores. El valor de los activos digitales puede ser extremadamente volátil y puede resultar en una pérdida significativa o total del capital invertido.",
    riskText2: "El rendimiento pasado no es indicativo de resultados futuros. Los rendimientos históricos, rendimientos esperados y proyecciones de APR mostrados en esta plataforma no garantizan el rendimiento futuro. Las condiciones del mercado pueden cambiar rápidamente y sin previo aviso.",
    riskText3: "Esta plataforma no proporciona asesoramiento financiero, de inversión, fiscal o legal. Debe consultar con profesionales calificados antes de tomar cualquier decisión de inversión. Solo invierta fondos que pueda permitirse perder por completo.",
    riskText4: "Los marcos regulatorios para activos digitales varían según la jurisdicción. Los usuarios son responsables del cumplimiento de las leyes aplicables en su país de residencia.",
    euRegulation: "Regulación UE (MiCA)",
    euText: "De acuerdo con el Reglamento de Mercados de Criptoactivos (UE) 2023/1114, los criptoactivos no están cubiertos por esquemas de compensación de inversores y pueden perder todo su valor.",
    usRegulation: "Regulación EE.UU. (SEC/CFTC)",
    usText: "Los activos digitales pueden considerarse valores según la ley estadounidense. Esta plataforma no está registrada en la SEC ni en la CFTC. Los residentes de EE.UU. deben verificar el cumplimiento normativo antes de invertir.",
    uaeRegulation: "Regulación EAU (VARA/SCA)",
    uaeText: "Los activos virtuales en los EAU están regulados por VARA y SCA. Esta plataforma opera en cumplimiento con las regulaciones aplicables de los EAU. Los inversores deben comprender los requisitos locales.",
    acknowledgment: "Al usar esta plataforma, reconoce que ha leído, entendido y acepta estos riesgos."
  },
  fr: {
    title: "Système de Distribution des Rendements",
    subtitle: "Comment l'algorithme PMTS distribue les rendements aux positions WayPool",
    pmtsTitle: "Algorithme PMTS",
    pmtsDesc: "Système de Trading Multi-Stratégie Propriétaire générant des rendements constants via des stratégies quantitatives avancées",
    howItWorks: "Comment Ça Marche",
    step1Title: "Agrégation du Capital",
    step1Desc: "Les dépôts des utilisateurs sont agrégés dans des pools de liquidité optimisés sur plusieurs protocoles DeFi",
    step2Title: "Traitement PMTS",
    step2Desc: "L'algorithme PMTS exécute des stratégies quantitatives générant des rendements quotidiens",
    step3Title: "Calcul de l'APR",
    step3Desc: "L'APR moyen de 4 pools Uniswap V3 est calculé et ajusté selon le timeframe",
    step4Title: "Distribution Quotidienne",
    step4Desc: "Les rendements sont distribués proportionnellement à toutes les positions actives à minuit UTC",
    aprAdjustments: "Ajustements APR par Durée",
    timeframe30: "30 Jours (Mensuel)",
    timeframe90: "90 Jours (Trimestriel)",
    timeframe365: "365 Jours (Annuel)",
    adjustment: "Ajustement",
    finalApr: "APR Final",
    example: "Exemple",
    baseApr: "APR de Base",
    formula: "Formule de Distribution",
    formulaDesc: "Rendement Quotidien = (Capital × APR Ajusté) / 365",
    realTimeMonitoring: "Surveillance en Temps Réel",
    currentApr: "APR Actuel",
    contractApr: "APR Contrat",
    lastUpdate: "Dernière Mise à Jour",
    activePools: "Pools Actifs",
    poolsMonitored: "pools surveillés en temps réel",
    securityFeatures: "Sécurité et Transparence",
    feature1: "Transactions vérifiées sur blockchain",
    feature2: "Historique de distribution auditable",
    feature3: "Positions NFT non-custodiales",
    feature4: "Mises à jour automatiques quotidiennes",
    viewPmts: "Voir Plateforme PMTS",
    learnMore: "En Savoir Plus",
    // Risk Disclaimer
    riskDisclaimer: "Avertissement sur les Risques",
    riskWarning: "Avertissement Important sur l'Investissement",
    riskText1: "Les investissements en cryptomonnaies et DeFi comportent un risque substantiel de perte et ne conviennent pas à tous les investisseurs. La valeur des actifs numériques peut être extrêmement volatile et peut entraîner une perte significative ou totale du capital investi.",
    riskText2: "Les performances passées ne préjugent pas des résultats futurs. Les rendements historiques, les rendements attendus et les projections d'APR affichés sur cette plateforme ne garantissent pas les performances futures. Les conditions du marché peuvent changer rapidement et sans préavis.",
    riskText3: "Cette plateforme ne fournit pas de conseils financiers, d'investissement, fiscaux ou juridiques. Vous devez consulter des professionnels qualifiés avant de prendre toute décision d'investissement. N'investissez que des fonds que vous pouvez vous permettre de perdre entièrement.",
    riskText4: "Les cadres réglementaires pour les actifs numériques varient selon les juridictions. Les utilisateurs sont responsables du respect des lois applicables dans leur pays de résidence.",
    euRegulation: "Réglementation UE (MiCA)",
    euText: "Conformément au Règlement sur les Marchés de Crypto-actifs (UE) 2023/1114, les crypto-actifs ne sont pas couverts par les systèmes d'indemnisation des investisseurs et peuvent perdre toute leur valeur.",
    usRegulation: "Réglementation US (SEC/CFTC)",
    usText: "Les actifs numériques peuvent être considérés comme des valeurs mobilières en vertu de la loi américaine. Cette plateforme n'est pas enregistrée auprès de la SEC ou de la CFTC. Les résidents américains doivent vérifier la conformité réglementaire avant d'investir.",
    uaeRegulation: "Réglementation EAU (VARA/SCA)",
    uaeText: "Les actifs virtuels aux EAU sont réglementés par VARA et SCA. Cette plateforme opère en conformité avec les réglementations applicables des EAU. Les investisseurs doivent comprendre les exigences locales.",
    acknowledgment: "En utilisant cette plateforme, vous reconnaissez avoir lu, compris et accepté ces risques."
  },
  de: {
    title: "Ertragsverteilungssystem",
    subtitle: "Wie der PMTS-Algorithmus Erträge an WayPool-Positionen verteilt",
    pmtsTitle: "PMTS-Algorithmus",
    pmtsDesc: "Proprietäres Multi-Strategie-Handelssystem, das konsistente Renditen durch fortschrittliche quantitative Strategien generiert",
    howItWorks: "Wie es funktioniert",
    step1Title: "Kapitalaggregation",
    step1Desc: "Benutzereinlagen werden in optimierten Liquiditätspools über mehrere DeFi-Protokolle aggregiert",
    step2Title: "PMTS-Verarbeitung",
    step2Desc: "Der PMTS-Algorithmus führt quantitative Strategien aus und generiert tägliche Renditen",
    step3Title: "APR-Berechnung",
    step3Desc: "Der durchschnittliche APR von 4 Uniswap V3-Pools wird berechnet und nach Zeitrahmen angepasst",
    step4Title: "Tägliche Verteilung",
    step4Desc: "Erträge werden proportional an alle aktiven Positionen um Mitternacht UTC verteilt",
    aprAdjustments: "APR-Anpassungen nach Zeitrahmen",
    timeframe30: "30 Tage (Monatlich)",
    timeframe90: "90 Tage (Vierteljährlich)",
    timeframe365: "365 Tage (Jährlich)",
    adjustment: "Anpassung",
    finalApr: "Endgültiger APR",
    example: "Beispiel",
    baseApr: "Basis-APR",
    formula: "Verteilungsformel",
    formulaDesc: "Täglicher Ertrag = (Kapital × Angepasster APR) / 365",
    realTimeMonitoring: "Echtzeit-Überwachung",
    currentApr: "Aktueller APR",
    contractApr: "Vertrags-APR",
    lastUpdate: "Letzte Aktualisierung",
    activePools: "Aktive Pools",
    poolsMonitored: "Pools in Echtzeit überwacht",
    securityFeatures: "Sicherheit & Transparenz",
    feature1: "Blockchain-verifizierte Transaktionen",
    feature2: "Überprüfbare Verteilungshistorie",
    feature3: "Nicht-verwahrte NFT-Positionen",
    feature4: "Tägliche automatische Updates",
    viewPmts: "PMTS-Plattform anzeigen",
    learnMore: "Mehr erfahren",
    // Risk Disclaimer
    riskDisclaimer: "Risikohinweis",
    riskWarning: "Wichtiger Investitionshinweis",
    riskText1: "Investitionen in Kryptowährungen und DeFi bergen ein erhebliches Verlustrisiko und sind nicht für alle Anleger geeignet. Der Wert digitaler Vermögenswerte kann extrem volatil sein und zu einem erheblichen oder vollständigen Verlust des investierten Kapitals führen.",
    riskText2: "Die vergangene Wertentwicklung ist kein Indikator für zukünftige Ergebnisse. Historische Renditen, erwartete Erträge und auf dieser Plattform gezeigte APR-Prognosen garantieren keine zukünftige Wertentwicklung. Marktbedingungen können sich schnell und ohne Vorwarnung ändern.",
    riskText3: "Diese Plattform bietet keine Finanz-, Anlage-, Steuer- oder Rechtsberatung. Sie sollten qualifizierte Fachleute konsultieren, bevor Sie Anlageentscheidungen treffen. Investieren Sie nur Mittel, deren vollständigen Verlust Sie sich leisten können.",
    riskText4: "Die regulatorischen Rahmenbedingungen für digitale Vermögenswerte variieren je nach Rechtsordnung. Nutzer sind für die Einhaltung der geltenden Gesetze in ihrem Wohnsitzland verantwortlich.",
    euRegulation: "EU-Verordnung (MiCA)",
    euText: "Gemäß der Verordnung über Märkte für Krypto-Assets (EU) 2023/1114 sind Krypto-Assets nicht durch Anlegerentschädigungssysteme abgedeckt und können ihren gesamten Wert verlieren.",
    usRegulation: "US-Regulierung (SEC/CFTC)",
    usText: "Digitale Vermögenswerte können nach US-Recht als Wertpapiere gelten. Diese Plattform ist nicht bei der SEC oder CFTC registriert. US-Bürger sollten die regulatorische Konformität vor einer Investition überprüfen.",
    uaeRegulation: "VAE-Regulierung (VARA/SCA)",
    uaeText: "Virtuelle Vermögenswerte in den VAE werden von VARA und SCA reguliert. Diese Plattform arbeitet in Übereinstimmung mit den geltenden VAE-Vorschriften. Anleger sollten die lokalen Anforderungen verstehen.",
    acknowledgment: "Durch die Nutzung dieser Plattform bestätigen Sie, dass Sie diese Risiken gelesen, verstanden und akzeptiert haben."
  }
};

// Componente de flujo animado
const FlowStep = ({
  number,
  title,
  description,
  icon: Icon,
  isLast = false,
  delay = 0
}: {
  number: number;
  title: string;
  description: string;
  icon: any;
  isLast?: boolean;
  delay?: number;
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div className={`relative transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      <div className="flex items-start gap-4">
        <div className="relative">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg shadow-primary/25">
            <Icon className="w-7 h-7 text-white" />
          </div>
          <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-background border-2 border-primary flex items-center justify-center text-xs font-bold text-primary">
            {number}
          </div>
        </div>
        <div className="flex-1 pt-1">
          <h4 className="font-semibold text-lg mb-1">{title}</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
        </div>
      </div>
      {!isLast && (
        <div className="ml-7 my-4 h-8 border-l-2 border-dashed border-primary/30 relative">
          <ArrowDownToLine className="absolute -bottom-1 -left-[9px] w-4 h-4 text-primary/50" />
        </div>
      )}
    </div>
  );
};

// Componente de gráfico de APR animado
const AprChart = () => {
  const [values, setValues] = useState([65, 45, 80, 55]);

  useEffect(() => {
    const interval = setInterval(() => {
      setValues(prev => prev.map(v => Math.max(30, Math.min(90, v + (Math.random() - 0.5) * 10))));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const poolNames = ['USDC/ETH', 'USDC/WBTC', 'ETH/WBTC', 'USDC/DAI'];

  return (
    <div className="space-y-3">
      {poolNames.map((name, i) => (
        <div key={name} className="flex items-center gap-3">
          <span className="text-xs font-medium w-20 text-muted-foreground">{name}</span>
          <div className="flex-1 h-6 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary/70 to-primary rounded-full transition-all duration-1000 flex items-center justify-end pr-2"
              style={{ width: `${values[i]}%` }}
            >
              <span className="text-[10px] font-bold text-white">{(values[i] / 5).toFixed(1)}%</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Componente principal
export function YieldDistributionSystem() {
  const { language } = useLanguage();
  const t = translations[language as keyof typeof translations] || translations.en;

  const [animatedApr, setAnimatedApr] = useState(11.0);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimatedApr(prev => {
        const change = (Math.random() - 0.5) * 0.2;
        return Math.max(9, Math.min(13, prev + change));
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const timeframeData = [
    { timeframe: t.timeframe30, adjustment: -24.56, baseApr: 11, color: 'from-orange-500 to-orange-600' },
    { timeframe: t.timeframe90, adjustment: -17.37, baseApr: 11, color: 'from-blue-500 to-blue-600' },
    { timeframe: t.timeframe365, adjustment: -4.52, baseApr: 11, color: 'from-green-500 to-green-600' },
  ];

  return (
    <div className="space-y-8 mt-12">
      {/* Header Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-background border p-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />

        <div className="relative">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-primary rounded-xl">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
                {t.title}
              </h2>
              <p className="text-muted-foreground">{t.subtitle}</p>
            </div>
          </div>

          {/* PMTS Badge */}
          <div className="mt-6 p-4 bg-background/80 backdrop-blur-sm rounded-xl border flex items-start gap-4">
            <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg">
              <Cpu className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-bold text-lg">{t.pmtsTitle}</h3>
                <Badge variant="secondary" className="text-xs">
                  <Zap className="w-3 h-3 mr-1" />
                  Live
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{t.pmtsDesc}</p>
              <a
                href="https://pmts.elysiumdubai.net/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 mt-2 text-sm text-primary hover:underline"
              >
                <Globe className="w-4 h-4" />
                {t.viewPmts}
                <ArrowRight className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works - Flow Diagram */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCcw className="w-5 h-5 text-primary" />
            {t.howItWorks}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left: Flow Steps */}
            <div className="space-y-2">
              <FlowStep
                number={1}
                title={t.step1Title}
                description={t.step1Desc}
                icon={Wallet}
                delay={0}
              />
              <FlowStep
                number={2}
                title={t.step2Title}
                description={t.step2Desc}
                icon={Cpu}
                delay={200}
              />
              <FlowStep
                number={3}
                title={t.step3Title}
                description={t.step3Desc}
                icon={BarChart3}
                delay={400}
              />
              <FlowStep
                number={4}
                title={t.step4Title}
                description={t.step4Desc}
                icon={Users}
                isLast
                delay={600}
              />
            </div>

            {/* Right: Visual Diagram */}
            <div className="bg-muted/30 rounded-xl p-6 border">
              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full">
                  <Activity className="w-4 h-4 text-primary animate-pulse" />
                  <span className="text-sm font-medium">{t.realTimeMonitoring}</span>
                </div>
              </div>

              {/* Live APR Display */}
              <div className="bg-background rounded-xl p-4 border mb-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-muted-foreground">{t.currentApr}</span>
                  <span className="text-3xl font-bold text-primary">{animatedApr.toFixed(2)}%</span>
                </div>
                <AprChart />
              </div>

              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                <span>{t.lastUpdate}: {new Date().toLocaleTimeString()}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* APR Adjustments Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Percent className="w-5 h-5 text-primary" />
            {t.aprAdjustments}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {timeframeData.map((item, index) => (
              <div
                key={index}
                className="relative overflow-hidden rounded-xl border bg-gradient-to-br from-background to-muted/30 p-5"
              >
                <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${item.color} opacity-10 rounded-full blur-2xl translate-x-1/2 -translate-y-1/2`} />

                <div className="relative">
                  <div className="flex items-center gap-2 mb-3">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{item.timeframe}</span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">{t.baseApr}:</span>
                      <span className="font-medium">{item.baseApr}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">{t.adjustment}:</span>
                      <span className="font-medium text-red-500">{item.adjustment}%</span>
                    </div>
                    <div className="h-px bg-border my-2" />
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-medium">{t.finalApr}:</span>
                      <span className={`text-lg font-bold bg-gradient-to-r ${item.color} bg-clip-text text-transparent`}>
                        {(item.baseApr + item.adjustment).toFixed(2)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Formula Section */}
          <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl p-6 border">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <LineChart className="w-5 h-5 text-primary" />
              </div>
              <h4 className="font-semibold">{t.formula}</h4>
            </div>

            <div className="bg-background rounded-lg p-4 font-mono text-sm border">
              <code className="text-primary">{t.formulaDesc}</code>
            </div>

            <div className="mt-4 p-4 bg-background/50 rounded-lg border border-dashed">
              <p className="text-sm text-muted-foreground mb-2">
                <strong>{t.example}:</strong>
              </p>
              <div className="space-y-1 text-sm">
                <p>Capital: <span className="font-medium">$10,000</span></p>
                <p>APR Ajustado (365d): <span className="font-medium">6.48%</span></p>
                <p>Rendimiento Diario: <span className="font-medium text-primary">($10,000 × 6.48%) / 365 = $1.78/día</span></p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Shield, text: t.feature1, color: 'from-green-500 to-emerald-600' },
          { icon: Database, text: t.feature2, color: 'from-blue-500 to-cyan-600' },
          { icon: Layers, text: t.feature3, color: 'from-purple-500 to-violet-600' },
          { icon: RefreshCcw, text: t.feature4, color: 'from-orange-500 to-amber-600' },
        ].map((feature, index) => (
          <div
            key={index}
            className="group relative overflow-hidden rounded-xl border bg-background p-4 hover:shadow-lg transition-all duration-300"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity`} />
            <div className="relative flex items-start gap-3">
              <div className={`p-2 rounded-lg bg-gradient-to-br ${feature.color}`}>
                <feature.icon className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-1 mb-1">
                  <CheckCircle2 className="w-3 h-3 text-green-500" />
                  <span className="text-xs font-medium text-green-600">Verified</span>
                </div>
                <p className="text-sm text-muted-foreground">{feature.text}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Active Pools Indicator */}
      <div className="flex items-center justify-center">
        <div className="inline-flex items-center gap-3 px-6 py-3 bg-primary/5 rounded-full border">
          <div className="flex -space-x-2">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/80 to-primary flex items-center justify-center border-2 border-background"
              >
                <PieChart className="w-4 h-4 text-white" />
              </div>
            ))}
          </div>
          <div className="h-6 w-px bg-border" />
          <div>
            <span className="font-bold text-primary">4</span>
            <span className="text-sm text-muted-foreground ml-1">{t.activePools}</span>
          </div>
          <Badge variant="outline" className="ml-2">
            <Activity className="w-3 h-3 mr-1 animate-pulse text-green-500" />
            {t.poolsMonitored}
          </Badge>
        </div>
      </div>

      {/* Risk Disclaimer Section */}
      <Card className="border-amber-200 dark:border-amber-900/50 bg-gradient-to-br from-amber-50/50 to-orange-50/30 dark:from-amber-950/20 dark:to-orange-950/10">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-amber-700 dark:text-amber-400">
            <div className="p-2 bg-amber-100 dark:bg-amber-900/50 rounded-lg">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold">{t.riskDisclaimer}</h3>
              <p className="text-sm font-normal text-amber-600 dark:text-amber-500">{t.riskWarning}</p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Main Risk Warnings */}
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 bg-white/60 dark:bg-slate-900/40 rounded-lg border border-amber-200/50 dark:border-amber-800/30">
              <FileWarning className="w-5 h-5 text-amber-600 dark:text-amber-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{t.riskText1}</p>
            </div>
            <div className="flex items-start gap-3 p-4 bg-white/60 dark:bg-slate-900/40 rounded-lg border border-amber-200/50 dark:border-amber-800/30">
              <TrendingUp className="w-5 h-5 text-amber-600 dark:text-amber-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{t.riskText2}</p>
            </div>
            <div className="flex items-start gap-3 p-4 bg-white/60 dark:bg-slate-900/40 rounded-lg border border-amber-200/50 dark:border-amber-800/30">
              <Info className="w-5 h-5 text-amber-600 dark:text-amber-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{t.riskText3}</p>
            </div>
            <div className="flex items-start gap-3 p-4 bg-white/60 dark:bg-slate-900/40 rounded-lg border border-amber-200/50 dark:border-amber-800/30">
              <Scale className="w-5 h-5 text-amber-600 dark:text-amber-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{t.riskText4}</p>
            </div>
          </div>

          {/* Regulatory Sections */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-amber-200/50 dark:border-amber-800/30">
            {/* EU Regulation */}
            <div className="p-4 bg-blue-50/50 dark:bg-blue-950/20 rounded-lg border border-blue-200/50 dark:border-blue-800/30">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-5 bg-gradient-to-r from-blue-600 via-blue-600 to-blue-600 rounded-sm flex items-center justify-center">
                  <span className="text-yellow-400 text-[8px] font-bold">EU</span>
                </div>
                <h4 className="font-semibold text-sm text-blue-700 dark:text-blue-400">{t.euRegulation}</h4>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{t.euText}</p>
            </div>

            {/* US Regulation */}
            <div className="p-4 bg-red-50/50 dark:bg-red-950/20 rounded-lg border border-red-200/50 dark:border-red-800/30">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-5 bg-gradient-to-b from-red-500 via-white to-blue-600 rounded-sm flex items-center justify-center">
                  <span className="text-blue-900 text-[8px] font-bold">US</span>
                </div>
                <h4 className="font-semibold text-sm text-red-700 dark:text-red-400">{t.usRegulation}</h4>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{t.usText}</p>
            </div>

            {/* UAE Regulation */}
            <div className="p-4 bg-green-50/50 dark:bg-green-950/20 rounded-lg border border-green-200/50 dark:border-green-800/30">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-5 rounded-sm overflow-hidden flex flex-col">
                  <div className="flex-1 bg-green-600"></div>
                  <div className="flex-1 bg-white"></div>
                  <div className="flex-1 bg-black"></div>
                  <div className="absolute left-0 top-0 bottom-0 w-2 bg-red-600"></div>
                </div>
                <h4 className="font-semibold text-sm text-green-700 dark:text-green-400">{t.uaeRegulation}</h4>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{t.uaeText}</p>
            </div>
          </div>

          {/* Acknowledgment */}
          <div className="mt-4 p-4 bg-slate-100/80 dark:bg-slate-800/40 rounded-lg border border-slate-200 dark:border-slate-700 text-center">
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
              {t.acknowledgment}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default YieldDistributionSystem;
