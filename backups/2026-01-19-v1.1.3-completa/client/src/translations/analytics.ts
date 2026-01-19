// Traducciones para la página de Analítica

export interface AnalyticsTranslations {
  // Títulos y encabezados
  title: string;
  subtitle: string;
  overview: string;
  metrics: string;
  
  // Filtros y navegación
  timeframeLabel: string;
  timeframeDay: string;
  timeframeWeek: string;
  timeframeMonth: string;
  timeframeYear: string;
  timeframeAll: string;
  compareWith: string;
  filterByPool: string;
  filterByNetwork: string;
  
  // Gráficos y visualizaciones
  performanceChart: string;
  tvlChart: string;
  volumeChart: string;
  feesChart: string;
  aprChart: string;
  positionsChart: string;
  
  // Métricas
  tvl: string;
  volume24h: string;
  fees24h: string;
  apr: string;
  positionsCount: string;
  totalDeposited: string;
  totalEarned: string;
  impermanentLoss: string;
  priceImpact: string;
  feeRevenue: string;
  
  // Cambios y comparaciones
  change: string;
  vs: string;
  increase: string;
  decrease: string;
  noChange: string;
  
  // Secciones
  poolPerformance: string;
  yourPerformance: string;
  marketOverview: string;
  topPools: string;
  recentActivity: string;
  
  // Tablas y listas
  rank: string;
  pool: string;
  network: string;
  value: string;
  action: string;
  date: string;
  
  // Mensajes informativos
  loadingAnalytics: string;
  errorLoadingAnalytics: string;
  noDataAvailable: string;
  connectWalletMessage: string;
  
  // Tooltip y ayuda
  tooltipTVL: string;
  tooltipVolume: string;
  tooltipFees: string;
  tooltipAPR: string;
  tooltipImpermanentLoss: string;
  
  // Otros
  exportData: string;
  refreshData: string;
  lastUpdated: string;
  learnMore: string;
  viewDetails: string;
}

export const analyticsTranslations = {
  es: {
    // Títulos y encabezados
    title: "Analítica",
    subtitle: "Métricas y rendimiento de tus posiciones de liquidez",
    overview: "Resumen",
    metrics: "Métricas",
    
    // Filtros y navegación
    timeframeLabel: "Período de tiempo",
    timeframeDay: "Día",
    timeframeWeek: "Semana",
    timeframeMonth: "Mes",
    timeframeYear: "Año",
    timeframeAll: "Todo",
    compareWith: "Comparar con",
    filterByPool: "Filtrar por pool",
    filterByNetwork: "Filtrar por red",
    
    // Gráficos y visualizaciones
    performanceChart: "Gráfico de Rendimiento",
    tvlChart: "Gráfico de TVL",
    volumeChart: "Gráfico de Volumen",
    feesChart: "Gráfico de Comisiones",
    aprChart: "Gráfico de APR",
    positionsChart: "Gráfico de Posiciones",
    
    // Métricas
    tvl: "TVL",
    volume24h: "Volumen 24h",
    fees24h: "Comisiones 24h",
    apr: "APR",
    positionsCount: "Número de Posiciones",
    totalDeposited: "Total Depositado",
    totalEarned: "Total Ganado",
    impermanentLoss: "Pérdida Impermanente",
    priceImpact: "Impacto de Precio",
    feeRevenue: "Ingresos por Comisiones",
    
    // Cambios y comparaciones
    change: "Cambio",
    vs: "vs",
    increase: "Incremento",
    decrease: "Decremento",
    noChange: "Sin cambios",
    
    // Secciones
    poolPerformance: "Rendimiento del Pool",
    yourPerformance: "Tu Rendimiento",
    marketOverview: "Visión General del Mercado",
    topPools: "Mejores Pools",
    recentActivity: "Actividad Reciente",
    
    // Tablas y listas
    rank: "Rango",
    pool: "Pool",
    network: "Red",
    value: "Valor",
    action: "Acción",
    date: "Fecha",
    
    // Mensajes informativos
    loadingAnalytics: "Cargando analítica...",
    errorLoadingAnalytics: "Error al cargar analítica",
    noDataAvailable: "No hay datos disponibles",
    connectWalletMessage: "Conecta tu wallet para ver tus analíticas personalizadas",
    
    // Tooltip y ayuda
    tooltipTVL: "Valor Total Bloqueado en el contrato del pool",
    tooltipVolume: "Volumen total negociado en las últimas 24 horas",
    tooltipFees: "Comisiones generadas en las últimas 24 horas",
    tooltipAPR: "Tasa Porcentual Anual basada en las comisiones generadas",
    tooltipImpermanentLoss: "Pérdida potencial por cambios de precio en comparación con mantener los activos",
    
    // Otros
    exportData: "Exportar Datos",
    refreshData: "Actualizar Datos",
    lastUpdated: "Última actualización",
    learnMore: "Más información",
    viewDetails: "Ver Detalles"
  },
  en: {
    // Títulos y encabezados
    title: "Analytics",
    subtitle: "Metrics and performance of your liquidity positions",
    overview: "Overview",
    metrics: "Metrics",
    
    // Filtros y navegación
    timeframeLabel: "Timeframe",
    timeframeDay: "Day",
    timeframeWeek: "Week",
    timeframeMonth: "Month",
    timeframeYear: "Year",
    timeframeAll: "All",
    compareWith: "Compare with",
    filterByPool: "Filter by pool",
    filterByNetwork: "Filter by network",
    
    // Gráficos y visualizaciones
    performanceChart: "Performance Chart",
    tvlChart: "TVL Chart",
    volumeChart: "Volume Chart",
    feesChart: "Fees Chart",
    aprChart: "APR Chart",
    positionsChart: "Positions Chart",
    
    // Métricas
    tvl: "TVL",
    volume24h: "24h Volume",
    fees24h: "24h Fees",
    apr: "APR",
    positionsCount: "Positions Count",
    totalDeposited: "Total Deposited",
    totalEarned: "Total Earned",
    impermanentLoss: "Impermanent Loss",
    priceImpact: "Price Impact",
    feeRevenue: "Fee Revenue",
    
    // Cambios y comparaciones
    change: "Change",
    vs: "vs",
    increase: "Increase",
    decrease: "Decrease",
    noChange: "No change",
    
    // Secciones
    poolPerformance: "Pool Performance",
    yourPerformance: "Your Performance",
    marketOverview: "Market Overview",
    topPools: "Top Pools",
    recentActivity: "Recent Activity",
    
    // Tablas y listas
    rank: "Rank",
    pool: "Pool",
    network: "Network",
    value: "Value",
    action: "Action",
    date: "Date",
    
    // Mensajes informativos
    loadingAnalytics: "Loading analytics...",
    errorLoadingAnalytics: "Error loading analytics",
    noDataAvailable: "No data available",
    connectWalletMessage: "Connect your wallet to view your personalized analytics",
    
    // Tooltip y ayuda
    tooltipTVL: "Total Value Locked in the pool contract",
    tooltipVolume: "Total volume traded in the last 24 hours",
    tooltipFees: "Fees generated in the last 24 hours",
    tooltipAPR: "Annual Percentage Rate based on generated fees",
    tooltipImpermanentLoss: "Potential loss due to price changes compared to holding the assets",
    
    // Otros
    exportData: "Export Data",
    refreshData: "Refresh Data",
    lastUpdated: "Last updated",
    learnMore: "Learn more",
    viewDetails: "View Details"
  },
  fr: {
    // Títulos y encabezados
    title: "Analytique",
    subtitle: "Métriques et performance de vos positions de liquidité",
    overview: "Aperçu",
    metrics: "Métriques",
    
    // Filtros y navegación
    timeframeLabel: "Période",
    timeframeDay: "Jour",
    timeframeWeek: "Semaine",
    timeframeMonth: "Mois",
    timeframeYear: "Année",
    timeframeAll: "Tous",
    compareWith: "Comparer avec",
    filterByPool: "Filtrer par pool",
    filterByNetwork: "Filtrer par réseau",
    
    // Gráficos y visualizaciones
    performanceChart: "Graphique de Performance",
    tvlChart: "Graphique de TVL",
    volumeChart: "Graphique de Volume",
    feesChart: "Graphique de Frais",
    aprChart: "Graphique d'APR",
    positionsChart: "Graphique de Positions",
    
    // Métricas
    tvl: "TVL",
    volume24h: "Volume 24h",
    fees24h: "Frais 24h",
    apr: "APR",
    positionsCount: "Nombre de Positions",
    totalDeposited: "Total Déposé",
    totalEarned: "Total Gagné",
    impermanentLoss: "Perte Impermanente",
    priceImpact: "Impact de Prix",
    feeRevenue: "Revenus des Frais",
    
    // Cambios y comparaciones
    change: "Changement",
    vs: "vs",
    increase: "Augmentation",
    decrease: "Diminution",
    noChange: "Pas de changement",
    
    // Secciones
    poolPerformance: "Performance du Pool",
    yourPerformance: "Votre Performance",
    marketOverview: "Aperçu du Marché",
    topPools: "Meilleurs Pools",
    recentActivity: "Activité Récente",
    
    // Tablas y listas
    rank: "Rang",
    pool: "Pool",
    network: "Réseau",
    value: "Valeur",
    action: "Action",
    date: "Date",
    
    // Mensajes informativos
    loadingAnalytics: "Chargement de l'analytique...",
    errorLoadingAnalytics: "Erreur lors du chargement de l'analytique",
    noDataAvailable: "Aucune donnée disponible",
    connectWalletMessage: "Connectez votre portefeuille pour voir vos analytiques personnalisées",
    
    // Tooltip y ayuda
    tooltipTVL: "Valeur Totale Verrouillée dans le contrat du pool",
    tooltipVolume: "Volume total échangé au cours des dernières 24 heures",
    tooltipFees: "Frais générés au cours des dernières 24 heures",
    tooltipAPR: "Taux Annuel en Pourcentage basé sur les frais générés",
    tooltipImpermanentLoss: "Perte potentielle due aux changements de prix par rapport à la détention des actifs",
    
    // Otros
    exportData: "Exporter les Données",
    refreshData: "Actualiser les Données",
    lastUpdated: "Dernière mise à jour",
    learnMore: "En savoir plus",
    viewDetails: "Voir les Détails"
  },
  de: {
    // Títulos y encabezados
    title: "Analytik",
    subtitle: "Metriken und Performance Ihrer Liquiditätspositionen",
    overview: "Überblick",
    metrics: "Metriken",
    
    // Filtros y navegación
    timeframeLabel: "Zeitrahmen",
    timeframeDay: "Tag",
    timeframeWeek: "Woche",
    timeframeMonth: "Monat",
    timeframeYear: "Jahr",
    timeframeAll: "Alle",
    compareWith: "Vergleichen mit",
    filterByPool: "Nach Pool filtern",
    filterByNetwork: "Nach Netzwerk filtern",
    
    // Gráficos y visualizaciones
    performanceChart: "Leistungsdiagramm",
    tvlChart: "TVL-Diagramm",
    volumeChart: "Volumendiagramm",
    feesChart: "Gebührendiagramm",
    aprChart: "APR-Diagramm",
    positionsChart: "Positionsdiagramm",
    
    // Métricas
    tvl: "TVL",
    volume24h: "24h Volumen",
    fees24h: "24h Gebühren",
    apr: "APR",
    positionsCount: "Anzahl der Positionen",
    totalDeposited: "Gesamt eingezahlt",
    totalEarned: "Gesamt verdient",
    impermanentLoss: "Impermanenter Verlust",
    priceImpact: "Preisauswirkung",
    feeRevenue: "Gebühreneinnahmen",
    
    // Cambios y comparaciones
    change: "Änderung",
    vs: "vs",
    increase: "Zunahme",
    decrease: "Abnahme",
    noChange: "Keine Änderung",
    
    // Secciones
    poolPerformance: "Pool-Leistung",
    yourPerformance: "Ihre Leistung",
    marketOverview: "Marktüberblick",
    topPools: "Top Pools",
    recentActivity: "Aktuelle Aktivität",
    
    // Tablas y listas
    rank: "Rang",
    pool: "Pool",
    network: "Netzwerk",
    value: "Wert",
    action: "Aktion",
    date: "Datum",
    
    // Mensajes informativos
    loadingAnalytics: "Analytik wird geladen...",
    errorLoadingAnalytics: "Fehler beim Laden der Analytik",
    noDataAvailable: "Keine Daten verfügbar",
    connectWalletMessage: "Verbinden Sie Ihre Wallet, um Ihre personalisierte Analytik anzuzeigen",
    
    // Tooltip y ayuda
    tooltipTVL: "Gesamtwert, der im Pool-Vertrag gesperrt ist",
    tooltipVolume: "Gesamtes Handelsvolumen in den letzten 24 Stunden",
    tooltipFees: "Gebühren, die in den letzten 24 Stunden generiert wurden",
    tooltipAPR: "Jährlicher Prozentsatz basierend auf generierten Gebühren",
    tooltipImpermanentLoss: "Potenzieller Verlust aufgrund von Preisänderungen im Vergleich zum Halten der Vermögenswerte",
    
    // Otros
    exportData: "Daten exportieren",
    refreshData: "Daten aktualisieren",
    lastUpdated: "Zuletzt aktualisiert",
    learnMore: "Mehr erfahren",
    viewDetails: "Details anzeigen"
  },
  it: {
    // Títulos y encabezados
    title: "Analisi",
    subtitle: "Metriche e performance delle tue posizioni di liquidità",
    overview: "Panoramica",
    metrics: "Metriche",
    
    // Filtros y navegación
    timeframeLabel: "Periodo",
    timeframeDay: "Giorno",
    timeframeWeek: "Settimana",
    timeframeMonth: "Mese",
    timeframeYear: "Anno",
    timeframeAll: "Tutto",
    compareWith: "Confronta con",
    filterByPool: "Filtra per pool",
    filterByNetwork: "Filtra per rete",
    
    // Gráficos y visualizaciones
    performanceChart: "Grafico delle Performance",
    tvlChart: "Grafico TVL",
    volumeChart: "Grafico del Volume",
    feesChart: "Grafico delle Commissioni",
    aprChart: "Grafico APR",
    positionsChart: "Grafico delle Posizioni",
    
    // Métricas
    tvl: "TVL",
    volume24h: "Volume 24h",
    fees24h: "Commissioni 24h",
    apr: "APR",
    positionsCount: "Numero di Posizioni",
    totalDeposited: "Totale Depositato",
    totalEarned: "Totale Guadagnato",
    impermanentLoss: "Perdita Impermanente",
    priceImpact: "Impatto sul Prezzo",
    feeRevenue: "Ricavi dalle Commissioni",
    
    // Cambios y comparaciones
    change: "Variazione",
    vs: "vs",
    increase: "Aumento",
    decrease: "Diminuzione",
    noChange: "Nessuna variazione",
    
    // Secciones
    poolPerformance: "Performance del Pool",
    yourPerformance: "La Tua Performance",
    marketOverview: "Panoramica del Mercato",
    topPools: "Migliori Pool",
    recentActivity: "Attività Recente",
    
    // Tablas y listas
    rank: "Posizione",
    pool: "Pool",
    network: "Rete",
    value: "Valore",
    action: "Azione",
    date: "Data",
    
    // Mensajes informativos
    loadingAnalytics: "Caricamento analisi...",
    errorLoadingAnalytics: "Errore nel caricamento delle analisi",
    noDataAvailable: "Nessun dato disponibile",
    connectWalletMessage: "Connetti il tuo portafoglio per visualizzare le tue analisi personalizzate",
    
    // Tooltip y ayuda
    tooltipTVL: "Valore Totale Bloccato nel contratto del pool",
    tooltipVolume: "Volume totale scambiato nelle ultime 24 ore",
    tooltipFees: "Commissioni generate nelle ultime 24 ore",
    tooltipAPR: "Tasso Percentuale Annuo basato sulle commissioni generate",
    tooltipImpermanentLoss: "Perdita potenziale dovuta ai cambiamenti di prezzo rispetto al mantenimento degli asset",
    
    // Otros
    exportData: "Esporta Dati",
    refreshData: "Aggiorna Dati",
    lastUpdated: "Ultimo aggiornamento",
    learnMore: "Scopri di più",
    viewDetails: "Visualizza Dettagli"
},
pt: {
  // Títulos y encabezados
  title: "Analíticas",
  subtitle: "Métricas e performance das suas posições de liquidez",
  overview: "Visão Geral",
  metrics: "Métricas",
  
  // Filtros y navegación
  timeframeLabel: "Período",
  timeframeDay: "Dia",
  timeframeWeek: "Semana",
  timeframeMonth: "Mês",
  timeframeYear: "Ano",
  timeframeAll: "Todos",
  compareWith: "Comparar com",
  filterByPool: "Filtrar por pool",
  filterByNetwork: "Filtrar por rede",
  
  // Gráficos y visualizaciones
  performanceChart: "Gráfico de Performance",
  tvlChart: "Gráfico de TVL",
  volumeChart: "Gráfico de Volume",
  feesChart: "Gráfico de Taxas",
  aprChart: "Gráfico de APR",
  positionsChart: "Gráfico de Posições",
  
  // Métricas
  tvl: "TVL",
  volume24h: "Volume 24h",
  fees24h: "Taxas 24h",
  apr: "APR",
  positionsCount: "Número de Posições",
  totalDeposited: "Total Depositado",
  totalEarned: "Total Ganho",
  impermanentLoss: "Perda Impermanente",
  priceImpact: "Impacto no Preço",
  feeRevenue: "Receita de Taxas",
  
  // Cambios y comparaciones
  change: "Mudança",
  vs: "vs",
  increase: "Aumento",
  decrease: "Diminuição",
  noChange: "Sem mudança",
  
  // Secciones
  poolPerformance: "Performance do Pool",
  yourPerformance: "Sua Performance",
  marketOverview: "Visão Geral do Mercado",
  topPools: "Melhores Pools",
  recentActivity: "Atividade Recente",
  
  // Tablas y listas
  rank: "Posição",
  pool: "Pool",
  network: "Rede",
  value: "Valor",
  action: "Ação",
  date: "Data",
  
  // Mensajes informativos
  loadingAnalytics: "Carregando analíticas...",
  errorLoadingAnalytics: "Erro ao carregar analíticas",
  noDataAvailable: "Nenhum dado disponível",
  connectWalletMessage: "Conecte sua carteira para visualizar suas analíticas personalizadas",
  
  // Tooltip y ayuda
  tooltipTVL: "Valor Total Bloqueado no contrato do pool",
  tooltipVolume: "Volume total negociado nas últimas 24 horas",
  tooltipFees: "Taxas geradas nas últimas 24 horas",
  tooltipAPR: "Taxa Percentual Anual baseada nas taxas geradas",
  tooltipImpermanentLoss: "Perda potencial devido a mudanças de preço comparado a manter os ativos",
  
  // Otros
  exportData: "Exportar Dados",
  refreshData: "Atualizar Dados",
  lastUpdated: "Última atualização",
  learnMore: "Saiba mais",
  viewDetails: "Ver Detalhes"
},
ar: {
  // Títulos y encabezados
  title: "التحليلات",
  subtitle: "المقاييس وأداء مراكز السيولة الخاصة بك",
  overview: "نظرة عامة",
  metrics: "المقاييس",
  
  // Filtros y navegación
  timeframeLabel: "الإطار الزمني",
  timeframeDay: "يوم",
  timeframeWeek: "أسبوع",
  timeframeMonth: "شهر",
  timeframeYear: "سنة",
  timeframeAll: "الكل",
  compareWith: "مقارنة مع",
  filterByPool: "تصفية حسب المجمع",
  filterByNetwork: "تصفية حسب الشبكة",
  
  // Gráficos y visualizaciones
  performanceChart: "مخطط الأداء",
  tvlChart: "مخطط TVL",
  volumeChart: "مخطط الحجم",
  feesChart: "مخطط الرسوم",
  aprChart: "مخطط APR",
  positionsChart: "مخطط المراكز",
  
  // Métricas
  tvl: "TVL",
  volume24h: "حجم 24 ساعة",
  fees24h: "رسوم 24 ساعة",
  apr: "APR",
  positionsCount: "عدد المراكز",
  totalDeposited: "إجمالي المودع",
  totalEarned: "إجمالي المكتسب",
  impermanentLoss: "الخسارة المؤقتة",
  priceImpact: "تأثير السعر",
  feeRevenue: "إيرادات الرسوم",
  
  // Cambios y comparaciones
  change: "التغيير",
  vs: "مقابل",
  increase: "زيادة",
  decrease: "انخفاض",
  noChange: "لا يوجد تغيير",
  
  // Secciones
  poolPerformance: "أداء المجمع",
  yourPerformance: "أداؤك",
  marketOverview: "نظرة عامة على السوق",
  topPools: "أفضل المجمعات",
  recentActivity: "النشاط الأخير",
  
  // Tablas y listas
  rank: "الترتيب",
  pool: "المجمع",
  network: "الشبكة",
  value: "القيمة",
  action: "الإجراء",
  date: "التاريخ",
  
  // Mensajes informativos
  loadingAnalytics: "جاري تحميل التحليلات...",
  errorLoadingAnalytics: "خطأ في تحميل التحليلات",
  noDataAvailable: "لا توجد بيانات متاحة",
  connectWalletMessage: "اربط محفظتك لعرض تحليلاتك المخصصة",
  
  // Tooltip y ayuda
  tooltipTVL: "إجمالي القيمة المقفلة في عقد المجمع",
  tooltipVolume: "إجمالي الحجم المتداول في آخر 24 ساعة",
  tooltipFees: "الرسوم المولدة في آخر 24 ساعة",
  tooltipAPR: "معدل النسبة المئوية السنوية بناءً على الرسوم المولدة",
  tooltipImpermanentLoss: "الخسارة المحتملة بسبب تغيرات الأسعار مقارنة بالاحتفاظ بالأصول",
  
  // Otros
  exportData: "تصدير البيانات",
  refreshData: "تحديث البيانات",
  lastUpdated: "آخر تحديث",
  learnMore: "اعرف المزيد",
  viewDetails: "عرض التفاصيل"
},
hi: {
  // Títulos y encabezados
  title: "विश्लेषण",
  subtitle: "आपकी तरलता स्थितियों के मेट्रिक्स और प्रदर्शन",
  overview: "अवलोकन",
  metrics: "मेट्रिक्स",
  
  // Filtros y navegación
  timeframeLabel: "समयावधि",
  timeframeDay: "दिन",
  timeframeWeek: "सप्ताह",
  timeframeMonth: "महीना",
  timeframeYear: "वर्ष",
  timeframeAll: "सभी",
  compareWith: "तुलना करें",
  filterByPool: "पूल के अनुसार फ़िल्टर करें",
  filterByNetwork: "नेटवर्क के अनुसार फ़िल्टर करें",
  
  // Gráficos y visualizaciones
  performanceChart: "प्रदर्शन चार्ट",
  tvlChart: "TVL चार्ट",
  volumeChart: "वॉल्यूम चार्ट",
  feesChart: "शुल्क चार्ट",
  aprChart: "APR चार्ट",
  positionsChart: "स्थिति चार्ट",
  
  // Métricas
  tvl: "TVL",
  volume24h: "24 घंटे वॉल्यूम",
  fees24h: "24 घंटे शुल्क",
  apr: "APR",
  positionsCount: "स्थितियों की संख्या",
  totalDeposited: "कुल जमा",
  totalEarned: "कुल अर्जित",
  impermanentLoss: "अस्थायी हानि",
  priceImpact: "मूल्य प्रभाव",
  feeRevenue: "शुल्क आय",
  
  // Cambios y comparaciones
  change: "परिवर्तन",
  vs: "बनाम",
  increase: "वृद्धि",
  decrease: "कमी",
  noChange: "कोई बदलाव नहीं",
  
  // Secciones
  poolPerformance: "पूल प्रदर्शन",
  yourPerformance: "आपका प्रदर्शन",
  marketOverview: "बाजार अवलोकन",
  topPools: "शीर्ष पूल",
  recentActivity: "हाल की गतिविधि",
  
  // Tablas y listas
  rank: "रैंक",
  pool: "पूल",
  network: "नेटवर्क",
  value: "मूल्य",
  action: "कार्रवाई",
  date: "तारीख",
  
  // Mensajes informativos
  loadingAnalytics: "विश्लेषण लोड हो रहा है...",
  errorLoadingAnalytics: "विश्लेषण लोड करने में त्रुटि",
  noDataAvailable: "कोई डेटा उपलब्ध नहीं",
  connectWalletMessage: "अपने व्यक्तिगत विश्लेषण देखने के लिए अपना वॉलेट कनेक्ट करें",
  
  // Tooltip y ayuda
  tooltipTVL: "पूल कॉन्ट्रैक्ट में कुल लॉक्ड वैल्यू",
  tooltipVolume: "पिछले 24 घंटों में कुल व्यापारित वॉल्यूम",
  tooltipFees: "पिछले 24 घंटों में उत्पन्न शुल्क",
  tooltipAPR: "उत्पन्न शुल्क के आधार पर वार्षिक प्रतिशत दर",
  tooltipImpermanentLoss: "संपत्ति रखने की तुलना में मूल्य परिवर्तन के कारण संभावित हानि",
  
  // Otros
  exportData: "डेटा निर्यात करें",
  refreshData: "डेटा रीफ्रेश करें",
  lastUpdated: "अंतिम अपडेट",
  learnMore: "और जानें",
  viewDetails: "विवरण देखें"
},
zh: {
  // Títulos y encabezados
  title: "分析",
  subtitle: "您的流动性头寸的指标和表现",
  overview: "概览",
  metrics: "指标",
  
  // Filtros y navegación
  timeframeLabel: "时间范围",
  timeframeDay: "日",
  timeframeWeek: "周",
  timeframeMonth: "月",
  timeframeYear: "年",
  timeframeAll: "全部",
  compareWith: "比较",
  filterByPool: "按资金池筛选",
  filterByNetwork: "按网络筛选",
  
  // Gráficos y visualizaciones
  performanceChart: "表现图表",
  tvlChart: "TVL图表",
  volumeChart: "交易量图表",
  feesChart: "手续费图表",
  aprChart: "APR图表",
  positionsChart: "头寸图表",
  
  // Métricas
  tvl: "TVL",
  volume24h: "24小时交易量",
  fees24h: "24小时手续费",
  apr: "APR",
  positionsCount: "头寸数量",
  totalDeposited: "总存入",
  totalEarned: "总收益",
  impermanentLoss: "无常损失",
  priceImpact: "价格影响",
  feeRevenue: "手续费收入",
  
  // Cambios y comparaciones
  change: "变化",
  vs: "对比",
  increase: "增加",
  decrease: "减少",
  noChange: "无变化",
  
  // Secciones
  poolPerformance: "资金池表现",
  yourPerformance: "您的表现",
  marketOverview: "市场概览",
  topPools: "热门资金池",
  recentActivity: "最近活动",
  
  // Tablas y listas
  rank: "排名",
  pool: "资金池",
  network: "网络",
  value: "价值",
  action: "操作",
  date: "日期",
  
  // Mensajes informativos
  loadingAnalytics: "正在加载分析数据...",
  errorLoadingAnalytics: "加载分析数据时出错",
  noDataAvailable: "暂无数据",
  connectWalletMessage: "连接您的钱包以查看个性化分析",
  
  // Tooltip y ayuda
  tooltipTVL: "资金池合约中锁定的总价值",
  tooltipVolume: "过去24小时的总交易量",
  tooltipFees: "过去24小时产生的手续费",
  tooltipAPR: "基于产生手续费的年化收益率",
  tooltipImpermanentLoss: "与持有资产相比，由于价格变化可能产生的损失",
  
  // Otros
  exportData: "导出数据",
  refreshData: "刷新数据",
  lastUpdated: "最后更新",
  learnMore: "了解更多",
  viewDetails: "查看详情"
},
ru: {
  // Títulos y encabezados
  title: "Аналитика",
  subtitle: "Метрики и производительность ваших позиций ликвидности",
  overview: "Обзор",
  metrics: "Метрики",
  
  // Filtros y navegación
  timeframeLabel: "Временные рамки",
  timeframeDay: "День",
  timeframeWeek: "Неделя",
  timeframeMonth: "Месяц",
  timeframeYear: "Год",
  timeframeAll: "Все",
  compareWith: "Сравнить с",
  filterByPool: "Фильтр по пулу",
  filterByNetwork: "Фильтр по сети",
  
  // Gráficos y visualizaciones
  performanceChart: "График производительности",
  tvlChart: "График TVL",
  volumeChart: "График объема",
  feesChart: "График комиссий",
  aprChart: "График APR",
  positionsChart: "График позиций",
  
  // Métricas
  tvl: "TVL",
  volume24h: "Объем 24ч",
  fees24h: "Комиссии 24ч",
  apr: "APR",
  positionsCount: "Количество позиций",
  totalDeposited: "Всего депонировано",
  totalEarned: "Всего заработано",
  impermanentLoss: "Непостоянная потеря",
  priceImpact: "Влияние на цену",
  feeRevenue: "Доход от комиссий",
  
  // Cambios y comparaciones
  change: "Изменение",
  vs: "против",
  increase: "Увеличение",
  decrease: "Уменьшение",
  noChange: "Без изменений",
  
  // Secciones
  poolPerformance: "Производительность пула",
  yourPerformance: "Ваша производительность",
  marketOverview: "Обзор рынка",
  topPools: "Топ пулы",
  recentActivity: "Недавняя активность",
  
  // Tablas y listas
  rank: "Ранг",
  pool: "Пул",
  network: "Сеть",
  value: "Значение",
  action: "Действие",
  date: "Дата",
  
  // Mensajes informativos
  loadingAnalytics: "Загрузка аналитики...",
  errorLoadingAnalytics: "Ошибка загрузки аналитики",
  noDataAvailable: "Данные недоступны",
  connectWalletMessage: "Подключите кошелек для просмотра персонализированной аналитики",
  
  // Tooltip y ayuda
  tooltipTVL: "Общая заблокированная стоимость в контракте пула",
  tooltipVolume: "Общий объем торгов за последние 24 часа",
  tooltipFees: "Комиссии, сгенерированные за последние 24 часа",
  tooltipAPR: "Годовая процентная ставка на основе сгенерированных комиссий",
  tooltipImpermanentLoss: "Потенциальная потеря из-за изменений цены по сравнению с удержанием активов",
  
  // Otros
  exportData: "Экспорт данных",
  refreshData: "Обновить данные",
  lastUpdated: "Последнее обновление",
  learnMore: "Узнать больше",
  viewDetails: "Просмотр деталей"
}
};