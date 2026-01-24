import React, { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";
import { 
  Moon, Sun, ChevronRight, ArrowRight, Shield, 
  Zap, BarChart3, Lock, Menu, X, 
  ChevronDown, Cpu, DollarSign, LineChart, Percent, AreaChart
} from "lucide-react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useLanguage, Language } from "@/context/language-context";
import PublicLanguageSelector from "@/components/public-language-selector";
import { useOnClickOutside } from "@/hooks/use-click-outside";
import SEOManager from "@/components/seo/seo-manager";
import { createTranslationProxy } from "@/utils/translation-utils";
import { sendGAEvent } from "@/components/analytics/GoogleAnalytics";
import { trackLanguageChange, trackThemeChange } from "@/components/analytics/analytics-events";
import { Card, CardContent } from "@/components/ui/card";
import { LeadCaptureForm } from "@/components/landing/lead-capture-form";
import MultiLanguageVideo from "@/components/landing/multi-language-video";
import { APP_NAME } from "@/utils/app-config";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Creamos primero las traducciones base para cada idioma
const enTranslations = {
  // Header/Nav
  howItWorks: "How it Works",
  features: "Features",
  riskReturn: "Risk & Return",
  faq: "FAQ",
  contact: "Contact",
  accessDashboard: "Access Dashboard",
  learnMore: "Learn More",
  
  // Hero section
  heroTitle: "Maximize your yields with Delta Neutral strategy",
  heroSubtitle: "Reduce capital loss risk to only 5% while achieving above-market returns",
  getStarted: "Get Started",
  requestDemo: "Request Demo",
  
  // Stats section
  statsTitle: "Performance Data",
  statsDescription: "Proven results through our innovative strategy",
  stat1Value: "5%",
  stat1Label: "Loss Risk",
  stat2Value: "25%+",
  stat2Label: "Average APR",
  stat3Value: "48h",
  stat3Label: "Setup Time",
  
  // Value Proposition section
  valueTitle: `Why Choose ${APP_NAME}?`,
  valueSubtitle: "A complete solution for DeFi liquidity management",
  value1Title: "Smart Strategy",
  value1Description: "Our Delta Neutral strategy protects your capital and maximizes yields automatically",
  value2Title: "Optimal Diversification",
  value2Description: "We intelligently distribute your assets to minimize risks and maximize returns",
  value3Title: "Advanced Technology",
  value3Description: "Cutting-edge algorithms that constantly optimize your position",
  
  // How it works tabs
  howItWorksTitle: "How Our Strategy Works",
  howItWorksSubtitle: "A simple three-step process to get started",
  tab1Title: "Deposit",
  tab1Content: "Connect your wallet and deposit your assets securely on our platform. We maintain a non-custodial system where you always control your funds.",
  tab2Title: "Distribution",
  tab2Content: "Our algorithm automatically distributes your assets across different liquidity pools to maximize yields while implementing the Delta Neutral strategy.",
  tab3Title: "Yields",
  tab3Content: "Watch your investments generate consistent yields as our system automatically adjusts positions to maintain optimal balance.",
  
  // Risk management section
  riskManagementTitle: "Advanced Risk Management",
  riskManagementDescription: "Our Delta Neutral strategy significantly reduces the risks associated with liquidity provision",
  riskItem1Title: "Minimized Impermanent Loss",
  riskItem1Description: "We reduce the impact of impermanent loss through our multi-pool balancing strategy",
  riskItem2Title: "Volatility Protection",
  riskItem2Description: "Positions are automatically adjusted to maintain a controlled risk level even in volatile markets",
  riskItem3Title: "Diversified Exposure",
  riskItem3Description: "Intelligent distribution across different trading pairs to minimize exposure to a single asset",
  
  // Testimonials
  testimonialsTitle: "What Our Users Say",
  testimonial1Text: `${APP_NAME} has transformed my DeFi experience. The yields are consistent and the risk is perfectly controlled.`,
  testimonial1Author: "Charles M., Investor",
  testimonial2Text: "I've been using the Delta Neutral strategy for 6 months and the results far exceed my expectations.",
  testimonial2Author: "Mary L., Trader",
  testimonial3Text: `The ease of use combined with technical sophistication make ${APP_NAME} my preferred platform for managing liquidity.`,
  testimonial3Author: "James R., Entrepreneur",
  
  // CTA section
  ctaTitle: "Start Your Delta Neutral Strategy Today",
  ctaSubtitle: "Join thousands of investors already maximizing their yields with controlled risk",
  ctaButton: "Get Started",
  
  // Footer
  footerTagline: `${APP_NAME} - Delta Neutral Strategy for Optimized Returns`,
  platform: "Platform",
  dashboard: "Dashboard",
  positions: "Positions",
  analytics: "Analytics",
  resources: "Resources",
  documentation: "Documentation",
  auditDocs: "Audit Documentation",
  support: "Support",
  community: "Community",
  legal: "Legal",
  termsOfUse: "Terms of Use",
  privacyPolicy: "Privacy Policy",
  disclaimer: "Disclaimer",
  copyright: `© 2025 ${APP_NAME}. All rights reserved.`
};

const esTranslations = {
  // Header/Nav
  howItWorks: "Cómo funciona",
  features: "Características",
  riskReturn: "Riesgo y Retorno",
  faq: "Preguntas frecuentes",
  contact: "Contacto",
  accessDashboard: "Acceder al Dashboard",
  learnMore: "Saber más",
  
  // Hero section
  heroTitle: "Maximiza tus rendimientos con estrategia Delta Neutral",
  heroSubtitle: "Reduce el riesgo de pérdida de capital a solo un 5% mientras obtienes rendimientos superiores al mercado",
  getStarted: "Comenzar ahora",
  requestDemo: "Solicitar demostración",
  
  // Stats section
  statsTitle: "Datos de rendimiento",
  statsDescription: "Resultados comprobados a través de nuestra estrategia innovadora",
  stat1Value: "5%",
  stat1Label: "Riesgo de pérdida",
  stat2Value: "25%+",
  stat2Label: "APR promedio",
  stat3Value: "48h",
  stat3Label: "Tiempo de setup",
  
  // Value Proposition section
  valueTitle: `¿Por qué elegir ${APP_NAME}?`,
  valueSubtitle: "Una solución completa para la gestión de liquidez en DeFi",
  value1Title: "Estrategia inteligente",
  value1Description: "Nuestra estrategia Delta Neutral protege tu capital y maximiza rendimientos automáticamente",
  value2Title: "Diversificación óptima",
  value2Description: "Distribuimos inteligentemente tus activos para minimizar riesgos y maximizar retornos",
  value3Title: "Tecnología avanzada",
  value3Description: "Algoritmos de última generación que optimizan constantemente tu posición",
  
  // How it works tabs
  howItWorksTitle: "Cómo funciona nuestra estrategia",
  howItWorksSubtitle: "Un proceso simple de tres pasos para comenzar",
  tab1Title: "Depósito",
  tab1Content: "Conecta tu wallet y deposita tus activos en nuestra plataforma de forma segura. Mantenemos un sistema no-custodial donde tú siempre controlas tus fondos.",
  tab2Title: "Distribución",
  tab2Content: "Nuestro algoritmo distribuye automáticamente tus activos en diferentes pools de liquidez para maximizar rendimientos mientras implementa la estrategia Delta Neutral.",
  tab3Title: "Rendimientos",
  tab3Content: "Observa cómo tus inversiones generan rendimientos constantes mientras nuestro sistema ajusta automáticamente las posiciones para mantener el equilibrio óptimo.",
  
  // Risk management section
  riskManagementTitle: "Gestión de riesgos avanzada",
  riskManagementDescription: "Nuestra estrategia Delta Neutral reduce significativamente los riesgos asociados con la provisión de liquidez",
  riskItem1Title: "Pérdida impermanente minimizada",
  riskItem1Description: "Reducimos el impacto de la pérdida impermanente a través de nuestra estrategia de balanceo entre múltiples pools",
  riskItem2Title: "Protección ante volatilidad",
  riskItem2Description: "Las posiciones se ajustan automáticamente para mantener un nivel de riesgo controlado incluso en mercados volátiles",
  riskItem3Title: "Exposición diversificada",
  riskItem3Description: "Distribución inteligente entre diferentes pares de trading para minimizar la exposición a un solo activo",
  
  // Testimonials
  testimonialsTitle: "Lo que dicen nuestros usuarios",
  testimonial1Text: `${APP_NAME} ha transformado mi experiencia en DeFi. Los rendimientos son consistentes y el riesgo está perfectamente controlado.`,
  testimonial1Author: "Carlos M., Inversor",
  testimonial2Text: "Llevo 6 meses utilizando la estrategia Delta Neutral y los resultados superan ampliamente mis expectativas.",
  testimonial2Author: "María L., Trader",
  testimonial3Text: `La facilidad de uso combinada con la sofisticación técnica hacen de ${APP_NAME} mi plataforma preferida para gestionar liquidez.`,
  testimonial3Author: "Javier R., Empresario",
  
  // CTA section
  ctaTitle: "Comienza tu estrategia Delta Neutral hoy",
  ctaSubtitle: "Únete a miles de inversores que ya están maximizando sus rendimientos con riesgo controlado",
  ctaButton: "Comenzar ahora",
  
  // Footer
  footerTagline: `${APP_NAME} - Estrategia Delta Neutral para rendimientos optimizados`,
  platform: "Plataforma",
  dashboard: "Dashboard",
  positions: "Posiciones",
  analytics: "Analíticas",
  resources: "Recursos",
  documentation: "Documentación",
  auditDocs: "Documentación de Auditoría",
  support: "Soporte",
  community: "Comunidad",
  legal: "Legal",
  termsOfUse: "Términos de Uso",
  privacyPolicy: "Política de Privacidad",
  disclaimer: "Aviso Legal",
  copyright: `© 2025 ${APP_NAME}. Todos los derechos reservados.`
};

// Ahora creamos el objeto de traducciones completo
// Definimos un tipo para asegurarnos de incluir todos los idiomas
type SupportedLanguages = Record<Language, any>;

// Traducciones en francés
const frTranslations = {
  // Header/Nav
  howItWorks: "Comment ça marche",
  features: "Fonctionnalités",
  riskReturn: "Risque & Rendement",
  faq: "FAQ",
  contact: "Contact",
  accessDashboard: "Accéder au Dashboard",
  learnMore: "En savoir plus",
  
  // Hero section
  heroTitle: "Maximisez vos rendements avec la stratégie Delta Neutral",
  heroSubtitle: "Réduisez le risque de perte de capital à seulement 5% tout en obtenant des rendements supérieurs au marché",
  getStarted: "Commencer",
  requestDemo: "Demander une démo",
  
  // Stats section
  statsTitle: "Données de performance",
  statsDescription: "Résultats prouvés grâce à notre stratégie innovante",
  stat1Value: "5%",
  stat1Label: "Risque de perte",
  stat2Value: "25%+",
  stat2Label: "APR moyen",
  stat3Value: "48h",
  stat3Label: "Temps de configuration",
  
  // Value Proposition section
  valueTitle: `Pourquoi choisir ${APP_NAME}?`,
  valueSubtitle: "Une solution complète pour la gestion de liquidité DeFi",
  value1Title: "Stratégie intelligente",
  value1Description: "Notre stratégie Delta Neutral protège votre capital et maximise les rendements automatiquement",
  value2Title: "Diversification optimale",
  value2Description: "Nous distribuons intelligemment vos actifs pour minimiser les risques et maximiser les rendements",
  value3Title: "Technologie avancée",
  value3Description: "Des algorithmes de pointe qui optimisent constamment votre position",
  
  // How it works tabs
  howItWorksTitle: "Comment fonctionne notre stratégie",
  howItWorksSubtitle: "Un processus simple en trois étapes pour commencer",
  tab1Title: "Dépôt",
  tab1Content: "Connectez votre portefeuille et déposez vos actifs en toute sécurité sur notre plateforme. Nous maintenons un système non-custodial où vous contrôlez toujours vos fonds.",
  tab2Title: "Distribution",
  tab2Content: "Notre algorithme distribue automatiquement vos actifs dans différents pools de liquidité pour maximiser les rendements tout en implémentant la stratégie Delta Neutral.",
  tab3Title: "Rendements",
  tab3Content: "Regardez vos investissements générer des rendements constants tandis que notre système ajuste automatiquement les positions pour maintenir un équilibre optimal.",
  
  // Risk management section
  riskManagementTitle: "Gestion avancée des risques",
  riskManagementDescription: "Notre stratégie Delta Neutral réduit considérablement les risques associés à la fourniture de liquidité",
  riskItem1Title: "Perte impermanente minimisée",
  riskItem1Description: "Nous réduisons l'impact de la perte impermanente grâce à notre stratégie d'équilibrage multi-pools",
  riskItem2Title: "Protection contre la volatilité",
  riskItem2Description: "Les positions sont automatiquement ajustées pour maintenir un niveau de risque contrôlé même sur des marchés volatils",
  riskItem3Title: "Exposition diversifiée",
  riskItem3Description: "Distribution intelligente entre différentes paires de trading pour minimiser l'exposition à un seul actif",
  
  // Testimonials
  testimonialsTitle: "Ce que disent nos utilisateurs",
  testimonial1Text: `${APP_NAME} a transformé mon expérience DeFi. Les rendements sont constants et le risque est parfaitement contrôlé.`,
  testimonial1Author: "Charles M., Investisseur",
  testimonial2Text: "J'utilise la stratégie Delta Neutral depuis 6 mois et les résultats dépassent largement mes attentes.",
  testimonial2Author: "Marie L., Trader",
  testimonial3Text: `La facilité d'utilisation combinée à la sophistication technique font de ${APP_NAME} ma plateforme préférée pour gérer la liquidité.`,
  testimonial3Author: "Jacques R., Entrepreneur",
  
  // CTA section
  ctaTitle: "Commencez votre stratégie Delta Neutral aujourd'hui",
  ctaSubtitle: "Rejoignez des milliers d'investisseurs qui maximisent déjà leurs rendements avec un risque contrôlé",
  ctaButton: "Commencer",
  
  // Footer
  footerTagline: `${APP_NAME} - Stratégie Delta Neutral pour des rendements optimisés`,
  platform: "Plateforme",
  dashboard: "Dashboard",
  positions: "Positions",
  analytics: "Analytiques",
  resources: "Ressources",
  documentation: "Documentation",
  auditDocs: "Documentation d'Audit",
  support: "Support",
  community: "Communauté",
  legal: "Mentions légales",
  termsOfUse: "Conditions d'utilisation",
  privacyPolicy: "Politique de confidentialité",
  disclaimer: "Avertissement",
  copyright: `© 2025 ${APP_NAME}. Tous droits réservés.`
};

// Traducciones en alemán
const deTranslations = {
  // Header/Nav
  howItWorks: "Wie es funktioniert",
  features: "Funktionen",
  riskReturn: "Risiko & Rendite",
  faq: "FAQ",
  contact: "Kontakt",
  accessDashboard: "Zum Dashboard",
  learnMore: "Mehr erfahren",
  
  // Hero section
  heroTitle: "Maximieren Sie Ihre Renditen mit der Delta Neutral Strategie",
  heroSubtitle: "Reduzieren Sie das Kapitalverlustrisiko auf nur 5%, während Sie überdurchschnittliche Renditen erzielen",
  getStarted: "Loslegen",
  requestDemo: "Demo anfordern",
  
  // Stats section
  statsTitle: "Leistungsdaten",
  statsDescription: "Bewährte Ergebnisse durch unsere innovative Strategie",
  stat1Value: "5%",
  stat1Label: "Verlustrisiko",
  stat2Value: "25%+",
  stat2Label: "Durchschnittlicher APR",
  stat3Value: "48h",
  stat3Label: "Einrichtungszeit",
  
  // Value Proposition section
  valueTitle: `Warum ${APP_NAME} wählen?`,
  valueSubtitle: "Eine komplette Lösung für DeFi-Liquiditätsmanagement",
  value1Title: "Intelligente Strategie",
  value1Description: "Unsere Delta Neutral Strategie schützt Ihr Kapital und maximiert automatisch die Renditen",
  value2Title: "Optimale Diversifizierung",
  value2Description: "Wir verteilen Ihre Assets intelligent, um Risiken zu minimieren und Renditen zu maximieren",
  value3Title: "Fortschrittliche Technologie",
  value3Description: "Hochmoderne Algorithmen, die Ihre Position ständig optimieren",
  
  // How it works tabs
  howItWorksTitle: "Wie unsere Strategie funktioniert",
  howItWorksSubtitle: "Ein einfacher Drei-Schritte-Prozess zum Einstieg",
  tab1Title: "Einzahlung",
  tab1Content: "Verbinden Sie Ihre Wallet und hinterlegen Sie Ihre Assets sicher auf unserer Plattform. Wir bieten ein nicht-verwahrtes System, bei dem Sie immer die Kontrolle über Ihre Gelder behalten.",
  tab2Title: "Verteilung",
  tab2Content: "Unser Algorithmus verteilt Ihre Assets automatisch auf verschiedene Liquiditätspools, um die Renditen zu maximieren und gleichzeitig die Delta Neutral Strategie umzusetzen.",
  tab3Title: "Renditen",
  tab3Content: "Beobachten Sie, wie Ihre Investitionen konstante Renditen erwirtschaften, während unser System automatisch Positionen anpasst, um ein optimales Gleichgewicht zu halten.",
  
  // Risk management section
  riskManagementTitle: "Fortschrittliches Risikomanagement",
  riskManagementDescription: "Unsere Delta Neutral Strategie reduziert erheblich die Risiken, die mit der Bereitstellung von Liquidität verbunden sind",
  riskItem1Title: "Minimierter Impermanent Loss",
  riskItem1Description: "Wir reduzieren die Auswirkungen des Impermanent Loss durch unsere Multi-Pool-Ausgleichsstrategie",
  riskItem2Title: "Volatilitätsschutz",
  riskItem2Description: "Positionen werden automatisch angepasst, um ein kontrolliertes Risikoniveau auch in volatilen Märkten aufrechtzuerhalten",
  riskItem3Title: "Diversifizierte Exposition",
  riskItem3Description: "Intelligente Verteilung auf verschiedene Handelspaare, um die Exposition gegenüber einem einzelnen Asset zu minimieren",
  
  // Testimonials
  testimonialsTitle: "Was unsere Nutzer sagen",
  testimonial1Text: `${APP_NAME} hat meine DeFi-Erfahrung verändert. Die Renditen sind konstant und das Risiko ist perfekt kontrolliert.`,
  testimonial1Author: "Karl M., Investor",
  testimonial2Text: "Ich nutze die Delta Neutral Strategie seit 6 Monaten und die Ergebnisse übertreffen meine Erwartungen bei weitem.",
  testimonial2Author: "Maria L., Traderin",
  testimonial3Text: `Die einfache Bedienung in Kombination mit technischer Raffinesse machen ${APP_NAME} zu meiner bevorzugten Plattform für Liquiditätsmanagement.`,
  testimonial3Author: "Jakob R., Unternehmer",
  
  // CTA section
  ctaTitle: "Starten Sie Ihre Delta Neutral Strategie noch heute",
  ctaSubtitle: "Schließen Sie sich Tausenden von Investoren an, die ihre Renditen bereits mit kontrolliertem Risiko maximieren",
  ctaButton: "Jetzt starten",
  
  // Footer
  footerTagline: `${APP_NAME} - Delta Neutral Strategie für optimierte Renditen`,
  platform: "Plattform",
  dashboard: "Dashboard",
  positions: "Positionen",
  analytics: "Analytik",
  resources: "Ressourcen",
  documentation: "Dokumentation",
  auditDocs: "Audit-Dokumentation",
  support: "Support",
  community: "Community",
  legal: "Rechtliches",
  termsOfUse: "Nutzungsbedingungen",
  privacyPolicy: "Datenschutzrichtlinie",
  disclaimer: "Haftungsausschluss",
  copyright: `© 2025 ${APP_NAME}. Alle Rechte vorbehalten.`
};

// Traducciones en italiano
const itTranslations = {
  // Header/Nav
  howItWorks: "Come funziona",
  features: "Caratteristiche",
  riskReturn: "Rischio & Rendimento",
  faq: "FAQ",
  contact: "Contatto",
  accessDashboard: "Accedi alla Dashboard",
  learnMore: "Scopri di più",
  
  // Hero section
  heroTitle: "Massimizza i tuoi rendimenti con la strategia Delta Neutral",
  heroSubtitle: "Riduci il rischio di perdita di capitale a solo il 5% ottenendo rendimenti superiori al mercato",
  getStarted: "Inizia ora",
  requestDemo: "Richiedi una demo",
  
  // Stats section
  statsTitle: "Dati di performance",
  statsDescription: "Risultati comprovati attraverso la nostra strategia innovativa",
  stat1Value: "5%",
  stat1Label: "Rischio di perdita",
  stat2Value: "25%+",
  stat2Label: "APR medio",
  stat3Value: "48h",
  stat3Label: "Tempo di setup",
  
  // Value Proposition section
  valueTitle: `Perché scegliere ${APP_NAME}?`,
  valueSubtitle: "Una soluzione completa per la gestione della liquidità DeFi",
  value1Title: "Strategia intelligente",
  value1Description: "La nostra strategia Delta Neutral protegge il tuo capitale e massimizza i rendimenti automaticamente",
  value2Title: "Diversificazione ottimale",
  value2Description: "Distribuiamo intelligentemente i tuoi asset per minimizzare i rischi e massimizzare i rendimenti",
  value3Title: "Tecnologia avanzata",
  value3Description: "Algoritmi all'avanguardia che ottimizzano costantemente la tua posizione",
  
  // How it works tabs
  howItWorksTitle: "Come funziona la nostra strategia",
  howItWorksSubtitle: "Un semplice processo in tre fasi per iniziare",
  tab1Title: "Deposito",
  tab1Content: "Connetti il tuo wallet e deposita i tuoi asset in modo sicuro sulla nostra piattaforma. Manteniamo un sistema non-custodial dove hai sempre il controllo dei tuoi fondi.",
  tab2Title: "Distribuzione",
  tab2Content: "Il nostro algoritmo distribuisce automaticamente i tuoi asset tra diversi pool di liquidità per massimizzare i rendimenti implementando la strategia Delta Neutral.",
  tab3Title: "Rendimenti",
  tab3Content: "Osserva i tuoi investimenti generare rendimenti costanti mentre il nostro sistema regola automaticamente le posizioni per mantenere un equilibrio ottimale.",
  
  // Risk management section
  riskManagementTitle: "Gestione avanzata del rischio",
  riskManagementDescription: "La nostra strategia Delta Neutral riduce significativamente i rischi associati alla fornitura di liquidità",
  riskItem1Title: "Perdita impermanente minimizzata",
  riskItem1Description: "Riduciamo l'impatto della perdita impermanente attraverso la nostra strategia di bilanciamento multi-pool",
  riskItem2Title: "Protezione dalla volatilità",
  riskItem2Description: "Le posizioni vengono regolate automaticamente per mantenere un livello di rischio controllato anche in mercati volatili",
  riskItem3Title: "Esposizione diversificata",
  riskItem3Description: "Distribuzione intelligente tra diverse coppie di trading per minimizzare l'esposizione a un singolo asset",
  
  // Testimonials
  testimonialsTitle: "Cosa dicono i nostri utenti",
  testimonial1Text: `${APP_NAME} ha trasformato la mia esperienza DeFi. I rendimenti sono costanti e il rischio è perfettamente controllato.`,
  testimonial1Author: "Carlo M., Investitore",
  testimonial2Text: "Sto utilizzando la strategia Delta Neutral da 6 mesi e i risultati superano di gran lunga le mie aspettative.",
  testimonial2Author: "Maria L., Trader",
  testimonial3Text: `La facilità d'uso combinata con la sofisticazione tecnica rendono ${APP_NAME} la mia piattaforma preferita per gestire la liquidità.`,
  testimonial3Author: "Giovanni R., Imprenditore",
  
  // CTA section
  ctaTitle: "Inizia la tua strategia Delta Neutral oggi",
  ctaSubtitle: "Unisciti a migliaia di investitori che stanno già massimizzando i loro rendimenti con rischio controllato",
  ctaButton: "Inizia ora",
  
  // Footer
  footerTagline: `${APP_NAME} - Strategia Delta Neutral per rendimenti ottimizzati`,
  platform: "Piattaforma",
  dashboard: "Dashboard",
  positions: "Posizioni",
  analytics: "Analisi",
  resources: "Risorse",
  documentation: "Documentazione",
  auditDocs: "Documentazione di Audit",
  support: "Supporto",
  community: "Comunità",
  legal: "Legale",
  termsOfUse: "Termini di utilizzo",
  privacyPolicy: "Politica sulla privacy",
  disclaimer: "Disclaimer",
  copyright: `© 2025 ${APP_NAME}. Tutti i diritti riservati.`
};

// Traducciones en portugués
const ptTranslations = {
  // Header/Nav
  howItWorks: "Como funciona",
  features: "Recursos",
  riskReturn: "Risco & Retorno",
  faq: "Perguntas frequentes",
  contact: "Contato",
  accessDashboard: "Acessar o Dashboard",
  learnMore: "Saiba mais",
  
  // Hero section
  heroTitle: "Maximize seus rendimentos com a estratégia Delta Neutral",
  heroSubtitle: "Reduza o risco de perda de capital para apenas 5% enquanto obtém rendimentos acima do mercado",
  getStarted: "Começar agora",
  requestDemo: "Solicitar demonstração",
  
  // Stats section
  statsTitle: "Dados de desempenho",
  statsDescription: "Resultados comprovados através da nossa estratégia inovadora",
  stat1Value: "5%",
  stat1Label: "Risco de perda",
  stat2Value: "25%+",
  stat2Label: "APR médio",
  stat3Value: "48h",
  stat3Label: "Tempo de configuração",
  
  // Value Proposition section
  valueTitle: `Por que escolher ${APP_NAME}?`,
  valueSubtitle: "Uma solução completa para gestão de liquidez em DeFi",
  value1Title: "Estratégia inteligente",
  value1Description: "Nossa estratégia Delta Neutral protege seu capital e maximiza rendimentos automaticamente",
  value2Title: "Diversificação ótima",
  value2Description: "Distribuímos inteligentemente seus ativos para minimizar riscos e maximizar retornos",
  value3Title: "Tecnologia avançada",
  value3Description: "Algoritmos de ponta que otimizam constantemente sua posição",
  
  // How it works tabs
  howItWorksTitle: "Como nossa estratégia funciona",
  howItWorksSubtitle: "Um processo simples de três etapas para começar",
  tab1Title: "Depósito",
  tab1Content: "Conecte sua carteira e deposite seus ativos com segurança em nossa plataforma. Mantemos um sistema não custodial onde você sempre controla seus fundos.",
  tab2Title: "Distribuição",
  tab2Content: "Nosso algoritmo distribui automaticamente seus ativos em diferentes pools de liquidez para maximizar rendimentos enquanto implementa a estratégia Delta Neutral.",
  tab3Title: "Rendimentos",
  tab3Content: "Observe seus investimentos gerarem rendimentos constantes enquanto nosso sistema ajusta automaticamente as posições para manter o equilíbrio ideal.",
  
  // Risk management section
  riskManagementTitle: "Gestão avançada de riscos",
  riskManagementDescription: "Nossa estratégia Delta Neutral reduz significativamente os riscos associados à provisão de liquidez",
  riskItem1Title: "Perda impermanente minimizada",
  riskItem1Description: "Reduzimos o impacto da perda impermanente através da nossa estratégia de balanceamento entre múltiplos pools",
  riskItem2Title: "Proteção contra volatilidade",
  riskItem2Description: "As posições são ajustadas automaticamente para manter um nível de risco controlado mesmo em mercados voláteis",
  riskItem3Title: "Exposição diversificada",
  riskItem3Description: "Distribuição inteligente entre diferentes pares de negociação para minimizar a exposição a um único ativo",
  
  // Testimonials
  testimonialsTitle: "O que nossos usuários dizem",
  testimonial1Text: `${APP_NAME} transformou minha experiência em DeFi. Os rendimentos são consistentes e o risco está perfeitamente controlado.`,
  testimonial1Author: "Carlos M., Investidor",
  testimonial2Text: "Estou usando a estratégia Delta Neutral há 6 meses e os resultados superam amplamente minhas expectativas.",
  testimonial2Author: "Maria L., Trader",
  testimonial3Text: `A facilidade de uso combinada com a sofisticação técnica fazem do ${APP_NAME} minha plataforma preferida para gerenciar liquidez.`,
  testimonial3Author: "João R., Empresário",
  
  // CTA section
  ctaTitle: "Comece sua estratégia Delta Neutral hoje",
  ctaSubtitle: "Junte-se a milhares de investidores que já estão maximizando seus rendimentos com risco controlado",
  ctaButton: "Começar agora",
  
  // Footer
  footerTagline: `${APP_NAME} - Estratégia Delta Neutral para rendimentos otimizados`,
  platform: "Plataforma",
  dashboard: "Dashboard",
  positions: "Posições",
  analytics: "Análises",
  resources: "Recursos",
  documentation: "Documentação",
  auditDocs: "Documentação de Auditoria",
  support: "Suporte",
  community: "Comunidade",
  legal: "Legal",
  termsOfUse: "Termos de Uso",
  privacyPolicy: "Política de Privacidade",
  disclaimer: "Aviso Legal",
  copyright: `© 2025 ${APP_NAME}. Todos os direitos reservados.`
};

// Traducciones en árabe
const arTranslations = {
  // Header/Nav
  howItWorks: "كيف يعمل",
  features: "الميزات",
  riskReturn: "المخاطر والعائد",
  faq: "الأسئلة الشائعة",
  contact: "اتصل بنا",
  accessDashboard: "الوصول إلى لوحة التحكم",
  learnMore: "معرفة المزيد",
  
  // Hero section
  heroTitle: "زيادة عوائدك مع استراتيجية دلتا نيوترال",
  heroSubtitle: "تقليل مخاطر خسارة رأس المال إلى 5% فقط مع تحقيق عوائد تفوق السوق",
  getStarted: "البدء الآن",
  requestDemo: "طلب عرض توضيحي",
  
  // Stats section
  statsTitle: "بيانات الأداء",
  statsDescription: "نتائج مثبتة من خلال استراتيجيتنا المبتكرة",
  stat1Value: "5%",
  stat1Label: "مخاطر الخسارة",
  stat2Value: "25%+",
  stat2Label: "متوسط العائد السنوي",
  stat3Value: "48h",
  stat3Label: "وقت الإعداد",
  
  // Value Proposition section
  valueTitle: `لماذا تختار ${APP_NAME}؟`,
  valueSubtitle: "حل متكامل لإدارة السيولة في التمويل اللامركزي",
  value1Title: "استراتيجية ذكية",
  value1Description: "استراتيجية دلتا نيوترال تحمي رأس مالك وتزيد العوائد تلقائيًا",
  value2Title: "تنويع مثالي",
  value2Description: "نوزع أصولك بذكاء لتقليل المخاطر وزيادة العوائد",
  value3Title: "تقنية متقدمة",
  value3Description: "خوارزميات متطورة تحسن موقفك باستمرار",
  
  // How it works tabs
  howItWorksTitle: "كيف تعمل استراتيجيتنا",
  howItWorksSubtitle: "عملية بسيطة من ثلاث خطوات للبدء",
  tab1Title: "الإيداع",
  tab1Content: "قم بتوصيل محفظتك وإيداع أصولك بأمان على منصتنا. نحافظ على نظام غير وصائي حيث تتحكم دائمًا في أموالك.",
  tab2Title: "التوزيع",
  tab2Content: "تقوم خوارزميتنا تلقائيًا بتوزيع أصولك عبر مجمعات سيولة مختلفة لزيادة العوائد مع تنفيذ استراتيجية دلتا نيوترال.",
  tab3Title: "العوائد",
  tab3Content: "شاهد استثماراتك تولد عوائد ثابتة بينما يقوم نظامنا تلقائيًا بضبط المواقف للحفاظ على التوازن الأمثل.",
  
  // Risk management section
  riskManagementTitle: "إدارة المخاطر المتقدمة",
  riskManagementDescription: "تقلل استراتيجية دلتا نيوترال بشكل كبير من المخاطر المرتبطة بتوفير السيولة",
  riskItem1Title: "تقليل الخسارة المؤقتة",
  riskItem1Description: "نقلل من تأثير الخسارة المؤقتة من خلال استراتيجية توازن متعددة المجمعات",
  riskItem2Title: "الحماية من التقلبات",
  riskItem2Description: "يتم ضبط المواقف تلقائيًا للحفاظ على مستوى مخاطر متحكم به حتى في الأسواق المتقلبة",
  riskItem3Title: "تعرض متنوع",
  riskItem3Description: "توزيع ذكي عبر أزواج تداول مختلفة لتقليل التعرض لأصل واحد",
  
  // Testimonials
  testimonialsTitle: "ما يقوله مستخدمونا",
  testimonial1Text: `لقد غير ${APP_NAME} تجربتي في التمويل اللامركزي. العوائد ثابتة والمخاطر متحكم بها تمامًا.`,
  testimonial1Author: "خالد م.، مستثمر",
  testimonial2Text: "أنا أستخدم استراتيجية دلتا نيوترال منذ 6 أشهر والنتائج تفوق توقعاتي بكثير.",
  testimonial2Author: "مريم ل.، متداولة",
  testimonial3Text: `سهولة الاستخدام مع التطور التقني تجعل ${APP_NAME} منصتي المفضلة لإدارة السيولة.`,
  testimonial3Author: "جاسم ر.، رجل أعمال",
  
  // CTA section
  ctaTitle: "ابدأ استراتيجية دلتا نيوترال اليوم",
  ctaSubtitle: "انضم إلى آلاف المستثمرين الذين يزيدون عوائدهم بالفعل مع مخاطر متحكم بها",
  ctaButton: "البدء الآن",
  
  // Footer
  footerTagline: `${APP_NAME} - استراتيجية دلتا نيوترال لعوائد محسنة`,
  platform: "المنصة",
  dashboard: "لوحة التحكم",
  positions: "المواقف",
  analytics: "التحليلات",
  resources: "الموارد",
  documentation: "التوثيق",
  auditDocs: "وثائق التدقيق",
  support: "الدعم",
  community: "المجتمع",
  legal: "قانوني",
  termsOfUse: "شروط الاستخدام",
  privacyPolicy: "سياسة الخصوصية",
  disclaimer: "إخلاء المسؤولية",
  copyright: `© 2025 ${APP_NAME}. جميع الحقوق محفوظة.`
};

// Traducciones en chino
const zhTranslations = {
  // Header/Nav
  howItWorks: "运作方式",
  features: "功能特点",
  riskReturn: "风险与回报",
  faq: "常见问题",
  contact: "联系我们",
  accessDashboard: "访问仪表板",
  learnMore: "了解更多",
  
  // Hero section
  heroTitle: "通过Delta Neutral策略最大化您的收益",
  heroSubtitle: "将资本损失风险降低到仅5%，同时获得高于市场的回报",
  getStarted: "立即开始",
  requestDemo: "申请演示",
  
  // Stats section
  statsTitle: "性能数据",
  statsDescription: "通过我们的创新策略证明的结果",
  stat1Value: "5%",
  stat1Label: "损失风险",
  stat2Value: "25%+",
  stat2Label: "平均年化收益率",
  stat3Value: "48h",
  stat3Label: "设置时间",
  
  // Value Proposition section
  valueTitle: `为何选择${APP_NAME}？`,
  valueSubtitle: "DeFi流动性管理的完整解决方案",
  value1Title: "智能策略",
  value1Description: "我们的Delta Neutral策略保护您的资本并自动最大化收益",
  value2Title: "最佳多样化",
  value2Description: "我们智能分配您的资产以最小化风险并最大化回报",
  value3Title: "先进技术",
  value3Description: "不断优化您的位置的前沿算法",
  
  // How it works tabs
  howItWorksTitle: "我们的策略如何运作",
  howItWorksSubtitle: "一个简单的三步流程开始",
  tab1Title: "存款",
  tab1Content: "连接您的钱包并在我们的平台上安全存入您的资产。我们维持一个非托管系统，您始终控制您的资金。",
  tab2Title: "分配",
  tab2Content: "我们的算法自动在不同的流动性池中分配您的资产，同时实施Delta Neutral策略以最大化收益。",
  tab3Title: "收益",
  tab3Content: "看着您的投资产生稳定的收益，而我们的系统自动调整头寸以保持最佳平衡。",
  
  // Risk management section
  riskManagementTitle: "高级风险管理",
  riskManagementDescription: "我们的Delta Neutral策略显著降低与提供流动性相关的风险",
  riskItem1Title: "最小化无常损失",
  riskItem1Description: "我们通过多池平衡策略减少无常损失的影响",
  riskItem2Title: "波动性保护",
  riskItem2Description: "即使在波动的市场中，头寸也会自动调整以维持受控的风险水平",
  riskItem3Title: "多样化敞口",
  riskItem3Description: "在不同交易对之间进行智能分配，以最小化对单一资产的敞口",
  
  // Testimonials
  testimonialsTitle: "用户评价",
  testimonial1Text: `${APP_NAME}改变了我的DeFi体验。收益稳定，风险完全受控。`,
  testimonial1Author: "陈先生，投资者",
  testimonial2Text: "我已经使用Delta Neutral策略6个月了，结果远远超出了我的预期。",
  testimonial2Author: "李女士，交易员",
  testimonial3Text: `易用性与技术复杂性的结合使${APP_NAME}成为我管理流动性的首选平台。`,
  testimonial3Author: "王先生，企业家",
  
  // CTA section
  ctaTitle: "今天就开始您的Delta Neutral策略",
  ctaSubtitle: "加入已经在以可控风险最大化收益的数千名投资者",
  ctaButton: "立即开始",
  
  // Footer
  footerTagline: `${APP_NAME} - 优化回报的Delta Neutral策略`,
  platform: "平台",
  dashboard: "仪表板",
  positions: "头寸",
  analytics: "分析",
  resources: "资源",
  documentation: "文档",
  auditDocs: "审计文档",
  support: "支持",
  community: "社区",
  legal: "法律",
  termsOfUse: "使用条款",
  privacyPolicy: "隐私政策",
  disclaimer: "免责声明",
  copyright: `© 2025 ${APP_NAME}. 保留所有权利。`
};

// Traducciones en hindi
const hiTranslations = {
  // Header/Nav
  howItWorks: "यह कैसे काम करता है",
  features: "विशेषताएँ",
  riskReturn: "जोखिम और रिटर्न",
  faq: "अक्सर पूछे जाने वाले प्रश्न",
  contact: "संपर्क करें",
  accessDashboard: "डैशबोर्ड एक्सेस करें",
  learnMore: "और जानें",
  
  // Hero section
  heroTitle: "डेल्टा न्यूट्रल रणनीति के साथ अपने लाभ को अधिकतम करें",
  heroSubtitle: "पूंजी हानि जोखिम को केवल 5% तक कम करें और बाजार से अधिक रिटर्न प्राप्त करें",
  getStarted: "शुरू करें",
  requestDemo: "डेमो का अनुरोध करें",
  
  // Stats section
  statsTitle: "प्रदर्शन डेटा",
  statsDescription: "हमारी नवीन रणनीति के माध्यम से सिद्ध परिणाम",
  stat1Value: "5%",
  stat1Label: "हानि जोखिम",
  stat2Value: "25%+",
  stat2Label: "औसत APR",
  stat3Value: "48h",
  stat3Label: "सेटअप समय",
  
  // Value Proposition section
  valueTitle: `${APP_NAME} को क्यों चुनें?`,
  valueSubtitle: "DeFi तरलता प्रबंधन के लिए एक पूर्ण समाधान",
  value1Title: "स्मार्ट रणनीति",
  value1Description: "हमारी डेल्टा न्यूट्रल रणनीति आपकी पूंजी की रक्षा करती है और स्वचालित रूप से लाभ को अधिकतम करती है",
  value2Title: "इष्टतम विविधीकरण",
  value2Description: "हम जोखिम को कम करने और रिटर्न को अधिकतम करने के लिए आपकी संपत्ति को बुद्धिमानी से वितरित करते हैं",
  value3Title: "उन्नत तकनीक",
  value3Description: "अत्याधुनिक एल्गोरिदम जो लगातार आपकी स्थिति को अनुकूलित करते हैं",
  
  // How it works tabs
  howItWorksTitle: "हमारी रणनीति कैसे काम करती है",
  howItWorksSubtitle: "शुरू करने के लिए एक सरल तीन-चरण प्रक्रिया",
  tab1Title: "जमा",
  tab1Content: "अपना वॉलेट कनेक्ट करें और अपनी संपत्ति को हमारे प्लेटफॉर्म पर सुरक्षित रूप से जमा करें। हम एक गैर-कस्टोडियल सिस्टम बनाए रखते हैं जहां आप हमेशा अपने फंड को नियंत्रित करते हैं।",
  tab2Title: "वितरण",
  tab2Content: "हमारा एल्गोरिदम स्वचालित रूप से आपकी संपत्ति को विभिन्न तरलता पूल में वितरित करता है ताकि डेल्टा न्यूट्रल रणनीति को लागू करते हुए लाभ को अधिकतम किया जा सके।",
  tab3Title: "लाभ",
  tab3Content: "देखें कि कैसे आपके निवेश लगातार लाभ उत्पन्न करते हैं जबकि हमारा सिस्टम स्वचालित रूप से इष्टतम संतुलन बनाए रखने के लिए स्थितियों को समायोजित करता है।",
  
  // Risk management section
  riskManagementTitle: "उन्नत जोखिम प्रबंधन",
  riskManagementDescription: "हमारी डेल्टा न्यूट्रल रणनीति तरलता प्रदान करने से जुड़े जोखिमों को महत्वपूर्ण रूप से कम करती है",
  riskItem1Title: "अस्थायी हानि को कम किया गया",
  riskItem1Description: "हम अपनी मल्टी-पूल बैलेंसिंग रणनीति के माध्यम से अस्थायी हानि के प्रभाव को कम करते हैं",
  riskItem2Title: "अस्थिरता सुरक्षा",
  riskItem2Description: "स्थितियों को स्वचालित रूप से समायोजित किया जाता है ताकि अस्थिर बाजारों में भी एक नियंत्रित जोखिम स्तर बनाए रखा जा सके",
  riskItem3Title: "विविध एक्सपोज़र",
  riskItem3Description: "एक एकल परिसंपत्ति के एक्सपोज़र को कम करने के लिए विभिन्न ट्रेडिंग जोड़े के बीच बुद्धिमान वितरण",
  
  // Testimonials
  testimonialsTitle: "हमारे उपयोगकर्ता क्या कहते हैं",
  testimonial1Text: `${APP_NAME} ने मेरे DeFi अनुभव को बदल दिया है। लाभ स्थिर हैं और जोखिम पूरी तरह से नियंत्रित है।`,
  testimonial1Author: "अनिल एम., निवेशक",
  testimonial2Text: "मैं 6 महीने से डेल्टा न्यूट्रल रणनीति का उपयोग कर रहा हूं और परिणाम मेरी अपेक्षाओं से कहीं अधिक हैं।",
  testimonial2Author: "प्रिया एल., ट्रेडर",
  testimonial3Text: `उपयोग में आसानी के साथ तकनीकी परिष्कार ${APP_NAME} को तरलता प्रबंधन के लिए मेरा पसंदीदा प्लेटफॉर्म बनाते हैं।`,
  testimonial3Author: "राजीव आर., उद्यमी",
  
  // CTA section
  ctaTitle: "आज ही अपनी डेल्टा न्यूट्रल रणनीति शुरू करें",
  ctaSubtitle: "हजारों निवेशकों से जुड़ें जो पहले से ही नियंत्रित जोखिम के साथ अपने लाभ को अधिकतम कर रहे हैं",
  ctaButton: "शुरू करें",
  
  // Footer
  footerTagline: `${APP_NAME} - अनुकूलित रिटर्न के लिए डेल्टा न्यूट्रल रणनीति`,
  platform: "प्लेटफॉर्म",
  dashboard: "डैशबोर्ड",
  positions: "पोजीशन",
  analytics: "एनालिटिक्स",
  resources: "संसाधन",
  documentation: "दस्तावेज़ीकरण",
  auditDocs: "ऑडिट दस्तावेज़ीकरण",
  support: "सहायता",
  community: "समुदाय",
  legal: "कानूनी",
  termsOfUse: "उपयोग की शर्तें",
  privacyPolicy: "गोपनीयता नीति",
  disclaimer: "अस्वीकरण",
  copyright: `© 2025 ${APP_NAME}. सर्वाधिकार सुरक्षित।`
};

// Objeto de traducciones completo con todos los idiomas
const publicLandingTranslations: SupportedLanguages = {
  en: enTranslations,
  es: esTranslations,
  fr: frTranslations,
  de: deTranslations,
  it: itTranslations,
  pt: ptTranslations,
  ar: arTranslations,
  zh: zhTranslations,
  hi: hiTranslations
};

export default function PublicLanding() {
  const { theme, setTheme } = useTheme();
  const { language, direction } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [demoDialogOpen, setDemoDialogOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  
  // Obtener las traducciones para el idioma actual
  const t = createTranslationProxy(publicLandingTranslations, language);

  // Para cerrar el menú cuando se hace clic fuera
  useOnClickOutside(mobileMenuRef, () => setMobileMenuOpen(false));

  // Para evitar problemas de hidratación
  useEffect(() => {
    setMounted(true);
    
    // Enviar evento de vista de página a Google Analytics
    if (typeof window !== 'undefined') {
      sendGAEvent('public_landing_page_view', {
        language: language,
        theme: theme,
        timestamp: new Date().toISOString()
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
  
  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    
    // Registrar cambio de tema en Google Analytics
    sendGAEvent('theme_change', {
      previous_theme: theme,
      new_theme: newTheme,
      page: 'public_landing'
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

  return (
    <div className="min-h-screen flex flex-col public-landing-page" 
      style={{ backgroundColor: theme === 'dark' ? 'hsl(224 71% 4%)' : undefined }}>
      <SEOManager 
        path="/welcome" 
        type="website" 
        title={`${APP_NAME} - Estrategia Delta Neutral para rendimientos optimizados`}
        description="Maximiza tus rendimientos mientras reduces el riesgo de pérdida de capital al 5% con nuestra estrategia Delta Neutral en Uniswap V4."
        keywords="Delta Neutral, Uniswap V4, DeFi, rendimientos, estrategia, liquidez, inversión crypto"
        image="/og-landing-image.jpg"
      />
      
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b backdrop-blur-sm bg-background/90" dir={direction}>
        <div className="container flex h-16 items-center justify-between mx-auto max-w-screen-xl">
          <div className="flex items-center gap-2">
            <Link href="/" className="text-2xl font-bold no-underline hover:opacity-80 transition-opacity">
              <span className="text-foreground">Way</span>
              <span className="text-primary">Pool</span>
            </Link>
          </div>

          {/* Menú de escritorio */}
          <nav className="hidden md:flex items-center gap-6">
            <a href="#how-it-works" className="text-sm font-medium hover:text-primary transition-colors">
              {t.howItWorks}
            </a>
            <a href="#features" className="text-sm font-medium hover:text-primary transition-colors">
              {t.features}
            </a>
            <a href="#risk-management" className="text-sm font-medium hover:text-primary transition-colors">
              {t.riskReturn}
            </a>
            <a href="#testimonials" className="text-sm font-medium hover:text-primary transition-colors">
              {t.testimonialsTitle}
            </a>
            <a href="#contact" className="text-sm font-medium hover:text-primary transition-colors">
              {t.contact}
            </a>
          </nav>

          <div className="flex items-center gap-2">
            <PublicLanguageSelector />
            
            <Button variant="ghost" size="icon" onClick={toggleTheme} className="mr-2">
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            
            {/* Botón de hamburguesa para móviles */}
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
              <a 
                href="#features" 
                className="px-4 py-2 text-sm font-medium hover:bg-muted rounded-md transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t.features}
              </a>
              <a 
                href="#risk-management" 
                className="px-4 py-2 text-sm font-medium hover:bg-muted rounded-md transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t.riskReturn}
              </a>
              <a 
                href="#testimonials" 
                className="px-4 py-2 text-sm font-medium hover:bg-muted rounded-md transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t.testimonialsTitle}
              </a>
              <a 
                href="#contact" 
                className="px-4 py-2 text-sm font-medium hover:bg-muted rounded-md transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t.contact}
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

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 md:py-24 bg-gradient-to-b from-background to-background/90" 
          dir={direction} 
          style={{ backgroundColor: theme === 'dark' ? 'rgb(9, 14, 33)' : undefined }}>
          <div className="container px-4 mx-auto max-w-screen-xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              {/* Contenido a la izquierda */}
              <div className="space-y-8 order-1 lg:order-1">
                <div className="space-y-4">
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter">
                    {t.heroTitle}
                  </h1>
                  <p className="text-xl text-muted-foreground">
                    {t.heroSubtitle}
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 hidden md:flex">
                  <Button asChild size="lg" className="gap-2" 
                    onClick={() => {
                      sendGAEvent('cta_button_click', {
                        button: 'get_started',
                        from: 'public_landing_hero',
                        language: language
                      });
                    }}
                  >
                    <Link href="/dashboard">
                      {t.getStarted} <ArrowRight className="h-5 w-5" />
                    </Link>
                  </Button>
                  
                  <Dialog open={demoDialogOpen} onOpenChange={setDemoDialogOpen}>
                    <DialogTrigger asChild>
                      <Button size="lg" variant="outline"
                        onClick={() => {
                          sendGAEvent('cta_button_click', {
                            button: 'request_demo',
                            from: 'public_landing_hero',
                            language: language
                          });
                        }}
                      >
                        {t.requestDemo}
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                      <DialogHeader>
                        <DialogTitle>Solicita una demostración</DialogTitle>
                        <DialogDescription>
                          Completa el formulario y un especialista te contactará para mostrarte cómo funciona nuestra plataforma.
                        </DialogDescription>
                      </DialogHeader>
                      <LeadCaptureForm 
                        onSuccess={() => setDemoDialogOpen(false)}
                        className="mt-4"
                      />
                    </DialogContent>
                  </Dialog>
                </div>
                
                {/* Video explicativo después de los botones (solo visible en escritorio) */}
                <div className="rounded-xl overflow-hidden shadow-xl mt-6 hidden md:block">
                  <MultiLanguageVideo 
                    className="w-full aspect-video" 
                    language={language}
                  />
                </div>
                
                {/* Estadísticas destacadas */}
                <div className="grid grid-cols-3 gap-4 mt-8">
                  <div className="text-center p-4 rounded-lg bg-primary/10">
                    <p className="text-3xl font-bold text-primary">{t.stat1Value}</p>
                    <p className="text-sm text-muted-foreground">{t.stat1Label}</p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-primary/10">
                    <p className="text-3xl font-bold text-primary">{t.stat2Value}</p>
                    <p className="text-sm text-muted-foreground">{t.stat2Label}</p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-primary/10">
                    <p className="text-3xl font-bold text-primary">{t.stat3Value}</p>
                    <p className="text-sm text-muted-foreground">{t.stat3Label}</p>
                  </div>
                </div>
              </div>
              
              {/* Formulario de captación de leads a la derecha */}
              <div className="relative rounded-xl overflow-hidden shadow-xl bg-card p-6 order-2 lg:order-2">
                <h2 className="text-2xl font-bold mb-4">Solicita más información</h2>
                <LeadCaptureForm 
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </section>
        
        {/* Sección de características */}
        <section id="features" className="py-16 bg-background/50" dir={direction}>
          <div className="container px-4 mx-auto max-w-screen-xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                {t.valueTitle}
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                {t.valueSubtitle}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 rounded-full bg-primary/10">
                      <Shield className="h-8 w-8 text-primary" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{t.value1Title}</h3>
                  <p className="text-muted-foreground">{t.value1Description}</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 rounded-full bg-primary/10">
                      <BarChart3 className="h-8 w-8 text-primary" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{t.value2Title}</h3>
                  <p className="text-muted-foreground">{t.value2Description}</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 rounded-full bg-primary/10">
                      <Cpu className="h-8 w-8 text-primary" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{t.value3Title}</h3>
                  <p className="text-muted-foreground">{t.value3Description}</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        
        {/* Sección Cómo funciona */}
        <section id="how-it-works" className="py-16 bg-muted/50" dir={direction}>
          <div className="container px-4 mx-auto max-w-screen-xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                {t.howItWorksTitle}
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                {t.howItWorksSubtitle}
              </p>
            </div>
            
            <Tabs defaultValue="deposit" className="w-full max-w-4xl mx-auto">
              <TabsList className="grid grid-cols-3 mb-8">
                <TabsTrigger value="deposit">{t.tab1Title}</TabsTrigger>
                <TabsTrigger value="distribution">{t.tab2Title}</TabsTrigger>
                <TabsTrigger value="yields">{t.tab3Title}</TabsTrigger>
              </TabsList>
              
              <TabsContent value="deposit" className="p-6 bg-background rounded-lg shadow-sm">
                <div className="flex flex-col md:flex-row gap-8 items-center">
                  <div className="md:w-1/2">
                    <h3 className="text-2xl font-bold mb-4">{t.tab1Title}</h3>
                    <p className="text-muted-foreground">{t.tab1Content}</p>
                  </div>
                  <div className="md:w-1/2 flex justify-center">
                    <div className="aspect-square w-48 h-48 rounded-full bg-primary/10 flex items-center justify-center">
                      <DollarSign className="h-24 w-24 text-primary/60" />
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="distribution" className="p-6 bg-background rounded-lg shadow-sm">
                <div className="flex flex-col md:flex-row gap-8 items-center">
                  <div className="md:w-1/2">
                    <h3 className="text-2xl font-bold mb-4">{t.tab2Title}</h3>
                    <p className="text-muted-foreground">{t.tab2Content}</p>
                  </div>
                  <div className="md:w-1/2 flex justify-center">
                    <div className="aspect-square w-48 h-48 rounded-full bg-primary/10 flex items-center justify-center">
                      <LineChart className="h-24 w-24 text-primary/60" />
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="yields" className="p-6 bg-background rounded-lg shadow-sm">
                <div className="flex flex-col md:flex-row gap-8 items-center">
                  <div className="md:w-1/2">
                    <h3 className="text-2xl font-bold mb-4">{t.tab3Title}</h3>
                    <p className="text-muted-foreground">{t.tab3Content}</p>
                  </div>
                  <div className="md:w-1/2 flex justify-center">
                    <div className="aspect-square w-48 h-48 rounded-full bg-primary/10 flex items-center justify-center">
                      <Percent className="h-24 w-24 text-primary/60" />
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>
        
        {/* Sección de Gestión de Riesgos */}
        <section id="risk-management" className="py-16 bg-background" dir={direction}>
          <div className="container px-4 mx-auto max-w-screen-xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                {t.riskManagementTitle}
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                {t.riskManagementDescription}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-2 rounded-full bg-primary/10">
                      <Shield className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">{t.riskItem1Title}</h3>
                      <p className="text-muted-foreground">{t.riskItem1Description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-2 rounded-full bg-primary/10">
                      <AreaChart className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">{t.riskItem2Title}</h3>
                      <p className="text-muted-foreground">{t.riskItem2Description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-2 rounded-full bg-primary/10">
                      <Lock className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">{t.riskItem3Title}</h3>
                      <p className="text-muted-foreground">{t.riskItem3Description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        
        {/* Sección de Testimonios */}
        <section id="testimonials" className="py-16 bg-muted/50" dir={direction}>
          <div className="container px-4 mx-auto max-w-screen-xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                {t.testimonialsTitle}
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <blockquote className="text-lg italic">"{t.testimonial1Text}"</blockquote>
                    <p className="font-medium">{t.testimonial1Author}</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <blockquote className="text-lg italic">"{t.testimonial2Text}"</blockquote>
                    <p className="font-medium">{t.testimonial2Author}</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <blockquote className="text-lg italic">"{t.testimonial3Text}"</blockquote>
                    <p className="font-medium">{t.testimonial3Author}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        
        {/* Sección de contacto */}
        <section id="contact" className="py-16 bg-background" dir={direction}>
          <div className="container px-4 mx-auto max-w-screen-xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="space-y-4">
                  <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                    {t.ctaTitle}
                  </h2>
                  <p className="text-xl text-muted-foreground">
                    {t.ctaSubtitle}
                  </p>
                </div>
                
                <Button asChild size="lg" className="gap-2" 
                  onClick={() => {
                    sendGAEvent('cta_button_click', {
                      button: 'get_started',
                      from: 'public_landing_cta',
                      language: language
                    });
                  }}
                >
                  <Link href="/dashboard">
                    {t.ctaButton} <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>
              </div>
              
              <div className="bg-card rounded-xl p-6 shadow-md">
                <h3 className="text-2xl font-bold mb-6">{t.contact}</h3>
                <LeadCaptureForm className="w-full" onSuccess={() => {
                  sendGAEvent('lead_form_submission', {
                    from: 'public_landing_cta',
                    language: language
                  });
                }} />
              </div>
            </div>
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <footer className="py-12 bg-muted/50 border-t" dir={direction}>
        <div className="container px-4 mx-auto max-w-screen-xl">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            <div className="md:col-span-2">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Link href="/" className="text-2xl font-bold no-underline hover:opacity-80 transition-opacity">
                    <span className="text-foreground">Way</span>
                    <span className="text-primary">Bank</span>
                  </Link>
                </div>
                <p className="text-muted-foreground">
                  {t.footerTagline}
                </p>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold mb-4 uppercase tracking-wider">
                {t.platform}
              </h4>
              <ul className="space-y-2">
                <li><Link href="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">{t.dashboard}</Link></li>
                <li><Link href="/positions" className="text-muted-foreground hover:text-foreground transition-colors">{t.positions}</Link></li>
                <li><Link href="/analytics" className="text-muted-foreground hover:text-foreground transition-colors">{t.analytics}</Link></li>
                <li><Link href="/uniswap" className="text-muted-foreground hover:text-foreground transition-colors">TOP Pools</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold mb-4 uppercase tracking-wider">
                {t.resources}
              </h4>
              <ul className="space-y-2">
                <li><Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">{t.documentation}</Link></li>
                <li><a href="/docs/audit-report.html" className="text-muted-foreground hover:text-foreground transition-colors">{t.auditDocs}</a></li>
                <li><Link href="/support" className="text-muted-foreground hover:text-foreground transition-colors">{t.support}</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">{t.community}</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold mb-4 uppercase tracking-wider">
                {t.legal}
              </h4>
              <ul className="space-y-2">
                <li><Link href="/terms-of-use" className="text-muted-foreground hover:text-foreground transition-colors">{t.termsOfUse}</Link></li>
                <li><Link href="/privacy-policy" className="text-muted-foreground hover:text-foreground transition-colors">{t.privacyPolicy}</Link></li>
                <li><Link href="/disclaimer" className="text-muted-foreground hover:text-foreground transition-colors">{t.disclaimer}</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t mt-12 pt-8 text-center text-muted-foreground">
            <p>{t.copyright}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}