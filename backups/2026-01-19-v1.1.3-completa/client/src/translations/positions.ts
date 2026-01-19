export interface PositionsTranslations {
  // Títulos y encabezados
  title: string;
  subtitle: string;
  myPositions: string;
  positionDetails: string;
  
  // Filtros y acciones
  filter: string;
  filterAll: string;
  filterActive: string;
  filterInactive: string;
  filterClosed: string;
  filterPending: string;
  filterFinalized: string;
  search: string;
  searchPlaceholder: string;
  refresh: string;
  newPosition: string;
  
  // Estados de posición
  statusActive: string;
  statusInactive: string;
  statusClosed: string;
  statusPending: string;
  statusFinalized: string;
  
  // Estadísticas principales
  totalLiquidity: string;
  totalLiquidityTooltip: string;
  totalFeesEarned: string;
  totalFeesEarnedTooltip: string;
  activePositions: string;
  activePositionsTooltip: string;
  
  // Analytics
  positionAnalytics: string;
  realTimeLiquidityDistribution: string;
  averageAPR: string;
  averageAPRTooltip: string;
  investedCapital: string;
  investedCapitalTooltip: string;
  dailyEarnings: string;
  dailyEarningsTooltip: string;
  timeToMaturity: string;
  timeToMaturityTooltip: string;
  notAvailable: string;
  day: string;
  poolDistribution: string;
  poolDistributionTooltip: string;
  byCapital: string;
  performanceByPool: string;
  performanceByPoolTooltip: string;
  
  // Detalles de posición
  positionId: string;
  depositAmount: string;
  initialValue: string;
  currentValue: string;
  profitLoss: string;
  apr: string;
  pool: string;
  createdOn: string;
  lastUpdate: string;
  feesEarned: string;
  accumulatedFees: string;
  historicalTotal: string;
  estEarnings: string;
  projectedAnnualYield: string;
  priceRange: string;
  currentPrice: string;
  contractPeriod: string;
  ilRisk: string;
  low: string;
  medium: string;
  high: string;
  
  // Acciones
  addLiquidity: string;
  collectFees: string;
  closePosition: string;
  viewDetails: string;
  copyAddress: string;
  viewOnEtherscan: string;
  viewOnUniswap: string;
  
  // Estados de colección
  collecting: string;
  collectingFees: string;
  collectSuccess: string;
  collectError: string;
  waitDaysToCollect: string;
  collectFeesAmount: string;
  cooldownActive: string;
  monthlyTimeframe: string;
  quarterlyTimeframe: string;
  yearlyTimeframe: string;
  customTimeframe: string;
  
  // Mensajes de cierre
  closeConfirmation: string;
  closeSuccess: string;
  closeError: string;
  days: string;
  
  // Estados sin posiciones
  noActivePositions: string;
  noPositionsMessage: string;
  createFirstPosition: string;
  
  // Errores
  errorUpdatingPositions: string;
  errorUpdatingPositionsDescription: string;
  
  // Seguridad
  militaryGradeSecurity: string;
  securityDescription: string;
  compatibleWallets: string;
  walletsDescription: string;
  mobileDesktopConnection: string;
  connectionDescription: string;
  neverStoreKeys: string;
  credentialsOnDevice: string;
  verifiableConnections: string;
  auditedCode: string;
  completeControl: string;
  explicitApproval: string;
  securityInformation: string;
  
  // Traducciones adicionales necesarias
  annualized: string;
  start: string;
  maturity: string;
  singlePosition: string;
  multiplePositions: string;
  
  // Textos de conexión de wallet
  secureConnection: string;
  secureConnectionDescription: string;
  allConnectionsEncrypted: string;
  walletConnect: string;
  universalMultiWallet: string;
  
  // Detalles de posición específicos
  positionCapitalText: string;
  positionCanBeClosed: string;
}

export const positionsTranslations: Record<string, PositionsTranslations> = {
  es: {
    // Títulos y encabezados
    title: "Mis Posiciones",
    subtitle: "Administra tus posiciones de liquidez",
    myPositions: "Mis Posiciones",
    positionDetails: "Detalles de Posición",
    
    // Filtros y acciones
    filter: "Filtrar",
    filterAll: "Todos",
    filterActive: "Activos",
    filterInactive: "Inactivos",
    filterClosed: "Cerrados",
    filterPending: "Pendientes",
    filterFinalized: "Finalizados",
    search: "Buscar",
    searchPlaceholder: "Buscar posiciones...",
    refresh: "Actualizar",
    newPosition: "Nueva Posición",
    
    // Estados de posición
    statusActive: "Activo",
    statusInactive: "Inactivo",
    statusClosed: "Cerrado",
    statusPending: "Pendiente",
    statusFinalized: "Finalizado",
    
    // Estadísticas principales
    totalLiquidity: "Liquidez Total",
    totalLiquidityTooltip: "Valor total de tus posiciones de liquidez activas, incluyendo capital invertido y comisiones generadas.",
    totalFeesEarned: "Comisiones Acumuladas",
    totalFeesEarnedTooltip: "Total de comisiones acumuladas hasta la fecha, incluyendo comisiones pendientes y ya recolectadas.",
    activePositions: "Posiciones Activas",
    activePositionsTooltip: "Número total de posiciones de liquidez activas que tienes actualmente.",
    
    // Analytics
    positionAnalytics: "Análisis de Posiciones",
    realTimeLiquidityDistribution: "Distribución de liquidez en tiempo real",
    averageAPR: "APR Promedio",
    averageAPRTooltip: "Promedio ponderado de APR en todas tus posiciones activas.",
    investedCapital: "Capital Invertido",
    investedCapitalTooltip: "Total de capital que has invertido en todas las posiciones.",
    dailyEarnings: "Ganancias Diarias",
    dailyEarningsTooltip: "Ganancias diarias estimadas basadas en el APR actual.",
    timeToMaturity: "Tiempo hasta Vencimiento",
    timeToMaturityTooltip: "Tiempo promedio restante hasta que las posiciones alcancen la fecha de vencimiento.",
    notAvailable: "N/D",
    day: "día",
    poolDistribution: "Distribución de Pools",
    poolDistributionTooltip: "Distribución de tu capital en diferentes pools de liquidez.",
    byCapital: "Por capital",
    performanceByPool: "Rendimiento por Pool",
    performanceByPoolTooltip: "Comparación de APR en los diferentes pools donde has invertido.",
    
    // Detalles de posición
    positionId: "ID de Posición",
    depositAmount: "Cantidad Depositada",
    initialValue: "Valor Inicial",
    currentValue: "Valor Actual",
    profitLoss: "Ganancia/Pérdida",
    apr: "APR",
    pool: "Pool",
    createdOn: "Creado el",
    lastUpdate: "Última Actualización",
    feesEarned: "Comisiones Ganadas",
    accumulatedFees: "Comisiones Acumuladas",
    historicalTotal: "Total histórico",
    estEarnings: "Ganancias Est.",
    projectedAnnualYield: "Rendimiento Anual Proyectado",
    priceRange: "Rango de Precio",
    currentPrice: "Precio Actual",
    contractPeriod: "Período del Contrato",
    ilRisk: "Riesgo IL",
    low: "Bajo",
    medium: "Medio",
    high: "Alto",
    
    // Acciones
    addLiquidity: "Añadir Liquidez",
    collectFees: "Cobrar Comisiones",
    closePosition: "Cerrar Posición",
    viewDetails: "Ver Detalles",
    copyAddress: "Copiar Dirección",
    viewOnEtherscan: "Ver en Etherscan",
    viewOnUniswap: "Ver en Uniswap",
    
    // Estados de colección
    collecting: "Cobrando...",
    collectingFees: "Cobrando comisiones...",
    collectSuccess: "Comisiones cobradas con éxito",
    collectError: "Error al cobrar comisiones",
    waitDaysToCollect: "Espera {{days}} días para la próxima colección",
    collectFeesAmount: "Cobrar {{amount}} en comisiones",
    cooldownActive: "Período de enfriamiento activo. Puedes cobrar comisiones nuevamente en {{days}} días.",
    monthlyTimeframe: "Las posiciones mensuales tienen un período de enfriamiento de 30 días.",
    quarterlyTimeframe: "Las posiciones trimestrales tienen un período de enfriamiento de 90 días.",
    yearlyTimeframe: "Las posiciones anuales tienen un período de enfriamiento de 365 días.",
    customTimeframe: "Esta posición tiene un período de enfriamiento de {{days}} días.",
    
    // Mensajes de cierre
    closeConfirmation: "¿Estás seguro de que quieres cerrar esta posición?",
    closeSuccess: "Posición cerrada con éxito",
    closeError: "Error al cerrar la posición",
    days: "días",
    
    // Estados sin posiciones
    noActivePositions: "No hay posiciones activas",
    noPositionsMessage: "Aún no tienes posiciones de liquidez",
    createFirstPosition: "Crear primera posición",
    
    // Errores
    errorUpdatingPositions: "Error al actualizar posiciones",
    errorUpdatingPositionsDescription: "No se pudieron actualizar los datos de posiciones",
    
    // Seguridad
    militaryGradeSecurity: "Seguridad de Grado Militar",
    securityDescription: "Conexiones encriptadas E2E con los más altos estándares criptográficos.",
    compatibleWallets: "Compatible con +170 wallets",
    walletsDescription: "MetaMask, Coinbase Wallet, Trust Wallet, Ledger, Trezor, Rainbow y muchos más wallets compatibles.",
    mobileDesktopConnection: "Conexión móvil y escritorio",
    connectionDescription: "Escaneo de código QR para wallets móviles y conexión directa para extensiones de navegador.",
    neverStoreKeys: "Nunca almacenamos tus claves privadas.",
    credentialsOnDevice: "Las credenciales permanecen en tu dispositivo.",
    verifiableConnections: "Conexiones verificables y auditadas.",
    auditedCode: "Código de conexión completamente auditado.",
    completeControl: "Control completo sobre las transacciones.",
    explicitApproval: "Cada transacción requiere tu aprobación explícita.",
    securityInformation: "Información de Seguridad",
    
    // Traducciones adicionales necesarias
    annualized: "Anualizado",
    start: "Inicio",
    maturity: "Vencimiento",
    singlePosition: "posición",
    multiplePositions: "posiciones",
    
    // Textos de conexión de wallet
    secureConnection: "Conexión Segura",
    secureConnectionDescription: "Conecta tu wallet blockchain de forma segura para acceder a funciones avanzadas de gestión de liquidez y trading.",
    allConnectionsEncrypted: "Todas las conexiones están encriptadas y auditadas",
    walletConnect: "WalletConnect",
    universalMultiWallet: "Conexión multi-wallet universal compatible con todos los principales wallets blockchain",
    
    // Detalles de posición específicos
    positionCapitalText: "El capital de esta posición es {capital} y ha generado {fees} en comisiones.",
    positionCanBeClosed: "La posición puede cerrarse ahora"
  },
  
  en: {
    // Títulos y encabezados
    title: "My Positions",
    subtitle: "Manage your liquidity positions",
    myPositions: "My Positions",
    positionDetails: "Position Details",
    
    // Filtros y acciones
    filter: "Filter",
    filterAll: "All",
    filterActive: "Active",
    filterInactive: "Inactive",
    filterClosed: "Closed",
    filterPending: "Pending",
    filterFinalized: "Finalized",
    search: "Search",
    searchPlaceholder: "Search positions...",
    refresh: "Refresh",
    newPosition: "New Position",
    
    // Estados de posición
    statusActive: "Active",
    statusInactive: "Inactive",
    statusClosed: "Closed",
    statusPending: "Pending",
    statusFinalized: "Finalized",
    
    // Estadísticas principales
    totalLiquidity: "Total Liquidity",
    totalLiquidityTooltip: "Total value of your active liquidity positions, including invested capital and generated fees.",
    totalFeesEarned: "Total Fees Earned",
    totalFeesEarnedTooltip: "Total accumulated fees to date, including pending and already collected fees.",
    activePositions: "Active Positions",
    activePositionsTooltip: "Total number of active liquidity positions you currently have.",
    
    // Analytics
    positionAnalytics: "Position Analytics",
    realTimeLiquidityDistribution: "Real-time liquidity distribution",
    averageAPR: "Average APR",
    averageAPRTooltip: "Weighted average APR across all your active positions.",
    investedCapital: "Invested Capital",
    investedCapitalTooltip: "Total capital you have invested across all positions.",
    dailyEarnings: "Daily Earnings",
    dailyEarningsTooltip: "Estimated daily earnings based on current APR.",
    timeToMaturity: "Time to Maturity",
    timeToMaturityTooltip: "Average remaining time until positions reach maturity date.",
    notAvailable: "N/A",
    day: "day",
    poolDistribution: "Pool Distribution",
    poolDistributionTooltip: "Distribution of your capital across different liquidity pools.",
    byCapital: "By capital",
    performanceByPool: "Performance by Pool",
    performanceByPoolTooltip: "APR comparison across different pools you have invested in.",
    
    // Detalles de posición
    positionId: "Position ID",
    depositAmount: "Deposit Amount",
    initialValue: "Initial Value",
    currentValue: "Current Value",
    profitLoss: "Profit/Loss",
    apr: "APR",
    pool: "Pool",
    createdOn: "Created on",
    lastUpdate: "Last Update",
    feesEarned: "Fees Earned",
    accumulatedFees: "Accumulated Fees",
    historicalTotal: "Historical total",
    estEarnings: "Est. Earnings",
    projectedAnnualYield: "Projected Annual Yield",
    priceRange: "Price Range",
    currentPrice: "Current Price",
    contractPeriod: "Contract Period",
    ilRisk: "IL Risk",
    low: "Low",
    medium: "Medium",
    high: "High",
    
    // Acciones
    addLiquidity: "Add Liquidity",
    collectFees: "Collect Fees",
    closePosition: "Close Position",
    viewDetails: "View Details",
    copyAddress: "Copy Address",
    viewOnEtherscan: "View on Etherscan",
    viewOnUniswap: "View on Uniswap",
    
    // Estados de colección
    collecting: "Collecting...",
    collectingFees: "Collecting fees...",
    collectSuccess: "Fees collected successfully",
    collectError: "Error collecting fees",
    waitDaysToCollect: "Wait {{days}} days for next collection",
    collectFeesAmount: "Collect {{amount}} in fees",
    cooldownActive: "Cooldown period active. You can collect fees again in {{days}} days.",
    monthlyTimeframe: "Monthly positions have a 30-day cooldown period.",
    quarterlyTimeframe: "Quarterly positions have a 90-day cooldown period.",
    yearlyTimeframe: "Annual positions have a 365-day cooldown period.",
    customTimeframe: "This position has a {{days}}-day cooldown period.",
    
    // Mensajes de cierre
    closeConfirmation: "Are you sure you want to close this position?",
    closeSuccess: "Position closed successfully",
    closeError: "Error closing position",
    days: "days",
    
    // Estados sin posiciones
    noActivePositions: "No active positions",
    noPositionsMessage: "You don't have any liquidity positions yet",
    createFirstPosition: "Create first position",
    
    // Errores
    errorUpdatingPositions: "Error updating positions",
    errorUpdatingPositionsDescription: "Could not update position data",
    
    // Seguridad
    militaryGradeSecurity: "Military Grade Security",
    securityDescription: "E2E encrypted connections with the highest cryptographic standards.",
    neverStoreKeys: "We never store your private keys.",
    credentialsOnDevice: "Credentials remain on your device.",
    verifiableConnections: "Verifiable and audited connections.",
    auditedCode: "Fully audited connection code.",
    completeControl: "Complete control over transactions.",
    explicitApproval: "Each transaction requires your explicit approval.",
    compatibleWallets: "Compatible Wallets",
    walletsDescription: "Compatible with MetaMask, Coinbase Wallet, WalletConnect and more.",
    mobileDesktopConnection: "Mobile & Desktop Connection",
    connectionDescription: "Access from any device with automatic synchronization.",
    securityInformation: "Security Information",
    annualized: "Annualized",
    start: "Start",
    maturity: "Maturity",
    singlePosition: "position",
    multiplePositions: "positions",
    secureConnection: "Secure Connection",
    secureConnectionDescription: "Connect your blockchain wallet securely to access advanced liquidity management and trading features.",
    allConnectionsEncrypted: "All connections are encrypted and audited",
    walletConnect: "WalletConnect",
    universalMultiWallet: "Universal multi-wallet connection compatible with all major blockchain wallets",
    
    // Detalles de posición específicos
    positionCapitalText: "This position's capital is {capital} and has earned {fees} in fees.",
    positionCanBeClosed: "Position can be closed now"
  },
  ru: {
    // Títulos y encabezados
    title: "Мои позиции",
    subtitle: "Управляйте своими позициями ликвидности",
    myPositions: "Мои позиции",
    positionDetails: "Детали позиции",
    
    // Filtros y acciones
    filter: "Фильтр",
    filterAll: "Все",
    filterActive: "Активные",
    filterInactive: "Неактивные",
    filterClosed: "Закрытые",
    filterPending: "В ожидании",
    filterFinalized: "Завершенные",
    search: "Поиск",
    searchPlaceholder: "Поиск позиций...",
    refresh: "Обновить",
    newPosition: "Новая позиция",
    
    // Estados de posición
    statusActive: "Активно",
    statusInactive: "Неактивно",
    statusClosed: "Закрыто",
    statusPending: "В ожидании",
    statusFinalized: "Завершено",
    
    // Estadísticas principales
    totalLiquidity: "Общая ликвидность",
    totalLiquidityTooltip: "Общая стоимость ваших активных позиций ликвидности, включая инвестированный капитал и полученные комиссии.",
    totalFeesEarned: "Всего заработано комиссий",
    totalFeesEarnedTooltip: "Общие накопленные комиссии на текущий момент, включая ожидающие и уже собранные комиссии.",
    activePositions: "Активные позиции",
    activePositionsTooltip: "Общее количество активных позиций ликвидности, которые у вас есть в настоящее время.",
    
    // Analytics
    positionAnalytics: "Аналитика позиций",
    realTimeLiquidityDistribution: "Распределение ликвидности в реальном времени",
    averageAPR: "Средний APR",
    averageAPRTooltip: "Средневзвешенный APR по всем вашим активным позициям.",
    investedCapital: "Инвестированный капитал",
    investedCapitalTooltip: "Общий капитал, который вы инвестировали во все позиции.",
    dailyEarnings: "Ежедневный доход",
    dailyEarningsTooltip: "Оценочный ежедневный доход на основе текущего APR.",
    timeToMaturity: "Время до погашения",
    timeToMaturityTooltip: "Среднее оставшееся время до достижения позициями даты погашения.",
    notAvailable: "Н/Д",
    day: "день",
    poolDistribution: "Распределение по пулам",
    poolDistributionTooltip: "Распределение вашего капитала по различным пулам ликвидности.",
    byCapital: "По капиталу",
    performanceByPool: "Производительность по пулу",
    performanceByPoolTooltip: "Сравнение APR по различным пулам, в которые вы инвестировали.",
    
    // Detalles de posición
    positionId: "ID позиции",
    depositAmount: "Сумма депозита",
    initialValue: "Начальная стоимость",
    currentValue: "Текущая стоимость",
    profitLoss: "Прибыль/убыток",
    apr: "APR",
    pool: "Пул",
    createdOn: "Создано",
    lastUpdate: "Последнее обновление",
    feesEarned: "Заработанные комиссии",
    accumulatedFees: "Накопленные комиссии",
    historicalTotal: "Исторический итог",
    estEarnings: "Ориентировочный доход",
    projectedAnnualYield: "Прогнозируемая годовая доходность",
    priceRange: "Ценовой диапазон",
    currentPrice: "Текущая цена",
    contractPeriod: "Срок контракта",
    ilRisk: "Риск IL",
    low: "Низкий",
    medium: "Средний",
    high: "Высокий",
    
    // Acciones
    addLiquidity: "Добавить ликвидность",
    collectFees: "Собрать комиссии",
    closePosition: "Закрыть позицию",
    viewDetails: "Посмотреть детали",
    copyAddress: "Скопировать адрес",
    viewOnEtherscan: "Посмотреть на Etherscan",
    viewOnUniswap: "Посмотреть на Uniswap",
    
    // Estados de colección
    collecting: "Сбор...",
    collectingFees: "Сбор комиссий...",
    collectSuccess: "Комиссии успешно собраны",
    collectError: "Ошибка при сборе комиссий",
    waitDaysToCollect: "Подождите {{days}} дней до следующего сбора",
    collectFeesAmount: "Собрать {{amount}} комиссий",
    cooldownActive: "Период ожидания активен. Вы можете собрать комиссии снова через {{days}} дней.",
    monthlyTimeframe: "Месячные позиции имеют 30-дневный период ожидания.",
    quarterlyTimeframe: "Квартальные позиции имеют 90-дневный период ожидания.",
    yearlyTimeframe: "Годовые позиции имеют 365-дневный период ожидания.",
    customTimeframe: "Эта позиция имеет {{days}}-дневный период ожидания.",
    
    // Mensajes de cierre
    closeConfirmation: "Вы уверены, что хотите закрыть эту позицию?",
    closeSuccess: "Позиция успешно закрыта",
    closeError: "Ошибка при закрытии позиции",
    days: "дней",
    
    // Estados sin posiciones
    noActivePositions: "Нет активных позиций",
    noPositionsMessage: "У вас пока нет позиций ликвидности",
    createFirstPosition: "Создать первую позицию",
    
    // Errores
    errorUpdatingPositions: "Ошибка обновления позиций",
    errorUpdatingPositionsDescription: "Не удалось обновить данные позиции",
    
    // Seguridad
    militaryGradeSecurity: "Безопасность военного уровня",
    securityDescription: "E2E зашифрованные соединения с высочайшими криптографическими стандартами.",
    neverStoreKeys: "Мы никогда не храним ваши приватные ключи.",
    credentialsOnDevice: "Учетные данные остаются на вашем устройстве.",
    verifiableConnections: "Проверяемые и аудируемые соединения.",
    auditedCode: "Полностью проверенный код соединения.",
    completeControl: "Полный контроль над транзакциями.",
    explicitApproval: "Каждая транзакция требует вашего явного одобрения.",
    compatibleWallets: "Совместимые кошельки",
    walletsDescription: "Совместимо с MetaMask, Coinbase Wallet, WalletConnect и другими.",
    mobileDesktopConnection: "Мобильное и настольное подключение",
    connectionDescription: "Доступ с любого устройства с автоматической синхронизацией.",
    securityInformation: "Информация о безопасности",
    annualized: "Годовая",
    start: "Начало",
    maturity: "Срок погашения",
    singlePosition: "позиция",
    multiplePositions: "позиции",
    secureConnection: "Безопасное соединение",
    secureConnectionDescription: "Безопасно подключите свой блокчейн-кошелек для доступа к расширенным функциям управления ликвидностью и торговли.",
    allConnectionsEncrypted: "Все соединения зашифрованы и проверены",
    walletConnect: "WalletConnect",
    universalMultiWallet: "Универсальное мультикошельковое соединение, совместимое со всеми основными блокчейн-кошельками",
    
    // Detalles de posición específicos
    positionCapitalText: "Капитал этой позиции составляет {capital} и заработал {fees} в виде комиссий.",
    positionCanBeClosed: "Позицию можно закрыть сейчас"
  },
  it: {
    // Títulos y encabezados
    title: "Le Mie Posizioni",
    subtitle: "Gestisci le tue posizioni di liquidità",
    myPositions: "Le Mie Posizioni",
    positionDetails: "Dettagli Posizione",
    
    // Filtros y acciones
    filter: "Filtra",
    filterAll: "Tutti",
    filterActive: "Attivi",
    filterInactive: "Inattivi",
    filterClosed: "Chiusi",
    filterPending: "In Sospeso",
    filterFinalized: "Finalizzati",
    search: "Cerca",
    searchPlaceholder: "Cerca posizioni...",
    refresh: "Aggiorna",
    newPosition: "Nuova Posizione",
    
    // Estados de posición
    statusActive: "Attivo",
    statusInactive: "Inattivo",
    statusClosed: "Chiuso",
    statusPending: "In Sospeso",
    statusFinalized: "Finalizzato",
    
    // Estadísticas principales
    totalLiquidity: "Liquidità Totale",
    totalLiquidityTooltip: "Valore totale delle tue posizioni di liquidità attive, inclusi capitale investito e commissioni generate.",
    totalFeesEarned: "Commissioni Totali Guadagnate",
    totalFeesEarnedTooltip: "Totale commissioni accumulate fino ad oggi, incluse quelle in sospeso e già riscosse.",
    activePositions: "Posizioni Attive",
    activePositionsTooltip: "Numero totale di posizioni di liquidità attive che hai attualmente.",
    
    // Analytics
    positionAnalytics: "Analisi Posizione",
    realTimeLiquidityDistribution: "Distribuzione della liquidità in tempo reale",
    averageAPR: "APR Medio",
    averageAPRTooltip: "APR medio ponderato su tutte le tue posizioni attive.",
    investedCapital: "Capitale Investito",
    investedCapitalTooltip: "Capitale totale che hai investito in tutte le posizioni.",
    dailyEarnings: "Guadagni Giornalieri",
    dailyEarningsTooltip: "Guadagni giornalieri stimati in base all'APR corrente.",
    timeToMaturity: "Tempo alla Scadenza",
    timeToMaturityTooltip: "Tempo medio rimanente fino a quando le posizioni raggiungono la data di scadenza.",
    notAvailable: "N/D",
    day: "giorno",
    poolDistribution: "Distribuzione Pool",
    poolDistributionTooltip: "Distribuzione del tuo capitale tra i diversi pool di liquidità.",
    byCapital: "Per capitale",
    performanceByPool: "Performance per Pool",
    performanceByPoolTooltip: "Confronto APR tra i diversi pool in cui hai investito.",
    
    // Detalles de posición
    positionId: "ID Posizione",
    depositAmount: "Importo Depositato",
    initialValue: "Valore Iniziale",
    currentValue: "Valore Attuale",
    profitLoss: "Profitto/Perdita",
    apr: "APR",
    pool: "Pool",
    createdOn: "Creato il",
    lastUpdate: "Ultimo Aggiornamento",
    feesEarned: "Commissioni Guadagnate",
    accumulatedFees: "Commissioni Accumulate",
    historicalTotal: "Totale storico",
    estEarnings: "Guadagni Stimati",
    projectedAnnualYield: "Rendimento Annuo Proiettato",
    priceRange: "Intervallo di Prezzo",
    currentPrice: "Prezzo Attuale",
    contractPeriod: "Periodo Contrattuale",
    ilRisk: "Rischio IL",
    low: "Basso",
    medium: "Medio",
    high: "Alto",
    
    // Acciones
    addLiquidity: "Aggiungi Liquidità",
    collectFees: "Raccogli Commissioni",
    closePosition: "Chiudi Posizione",
    viewDetails: "Visualizza Dettagli",
    copyAddress: "Copia Indirizzo",
    viewOnEtherscan: "Visualizza su Etherscan",
    viewOnUniswap: "Visualizza su Uniswap",
    
    // Estados de colección
    collecting: "Raccolta in corso...",
    collectingFees: "Raccolta commissioni in corso...",
    collectSuccess: "Commissioni raccolte con successo",
    collectError: "Errore durante la raccolta delle commissioni",
    waitDaysToCollect: "Attendi {{days}} giorni per la prossima raccolta",
    collectFeesAmount: "Raccogli {{amount}} in commissioni",
    cooldownActive: "Periodo di cooldown attivo. Puoi raccogliere nuovamente le commissioni tra {{days}} giorni.",
    monthlyTimeframe: "Le posizioni mensili hanno un periodo di cooldown di 30 giorni.",
    quarterlyTimeframe: "Le posizioni trimestrali hanno un periodo di cooldown di 90 giorni.",
    yearlyTimeframe: "Le posizioni annuali hanno un periodo di cooldown di 365 giorni.",
    customTimeframe: "Questa posizione ha un periodo di cooldown di {{days}} giorni.",
    
    // Mensajes de cierre
    closeConfirmation: "Sei sicuro di voler chiudere questa posizione?",
    closeSuccess: "Posizione chiusa con successo",
    closeError: "Errore durante la chiusura della posizione",
    days: "giorni",
    
    // Estados sin posiciones
    noActivePositions: "Nessuna posizione attiva",
    noPositionsMessage: "Non hai ancora posizioni di liquidità",
    createFirstPosition: "Crea la prima posizione",
    
    // Errores
    errorUpdatingPositions: "Errore nell'aggiornamento delle posizioni",
    errorUpdatingPositionsDescription: "Impossibile aggiornare i dati della posizione",
    
    // Seguridad
    militaryGradeSecurity: "Sicurezza di Grado Militare",
    securityDescription: "Connessioni crittografate E2E con i più alti standard crittografici.",
    neverStoreKeys: "Non memorizziamo mai le tue chiavi private.",
    credentialsOnDevice: "Le credenziali rimangono sul tuo dispositivo.",
    verifiableConnections: "Connessioni verificabili e auditabili.",
    auditedCode: "Codice di connessione completamente auditato.",
    completeControl: "Controllo completo sulle transazioni.",
    explicitApproval: "Ogni transazione richiede la tua esplicita approvazione.",
    compatibleWallets: "Wallet Compatibili",
    walletsDescription: "Compatibile con MetaMask, Coinbase Wallet, WalletConnect e altro.",
    mobileDesktopConnection: "Connessione Mobile & Desktop",
    connectionDescription: "Accesso da qualsiasi dispositivo con sincronizzazione automatica.",
    securityInformation: "Informazioni sulla Sicurezza",
    annualized: "Annualizzato",
    start: "Inizio",
    maturity: "Scadenza",
    singlePosition: "posizione",
    multiplePositions: "posizioni",
    secureConnection: "Connessione Sicura",
    secureConnectionDescription: "Connetti il tuo wallet blockchain in modo sicuro per accedere alla gestione avanzata della liquidità e alle funzionalità di trading.",
    allConnectionsEncrypted: "Tutte le connessioni sono crittografate e auditate",
    walletConnect: "WalletConnect",
    universalMultiWallet: "Connessione multi-wallet universale compatibile con tutti i principali wallet blockchain",
    
    // Detalles de posición específicos
    positionCapitalText: "Il capitale di questa posizione è {capital} e ha guadagnato {fees} in commissioni.",
    positionCanBeClosed: "La posizione può essere chiusa ora"
  },
  fr: {
    // Títulos y encabezados
    title: "Mes Positions",
    subtitle: "Gérez vos positions de liquidité",
    myPositions: "Mes Positions",
    positionDetails: "Détails de la Position",
    
    // Filtros y acciones
    filter: "Filtrer",
    filterAll: "Toutes",
    filterActive: "Actives",
    filterInactive: "Inactives",
    filterClosed: "Fermées",
    filterPending: "En attente",
    filterFinalized: "Finalisées",
    search: "Rechercher",
    searchPlaceholder: "Rechercher des positions...",
    refresh: "Actualiser",
    newPosition: "Nouvelle Position",
    
    // Estados de posición
    statusActive: "Active",
    statusInactive: "Inactive",
    statusClosed: "Fermée",
    statusPending: "En attente",
    statusFinalized: "Finalisée",
    
    // Estadísticas principales
    totalLiquidity: "Liquidité Totale",
    totalLiquidityTooltip: "Valeur totale de vos positions de liquidité actives, incluant le capital investi et les frais générés.",
    totalFeesEarned: "Frais Totaux Gagnés",
    totalFeesEarnedTooltip: "Total des frais accumulés à ce jour, y compris les frais en attente et déjà collectés.",
    activePositions: "Positions Actives",
    activePositionsTooltip: "Nombre total de positions de liquidité actives que vous avez actuellement.",
    
    // Analytics
    positionAnalytics: "Analyse des Positions",
    realTimeLiquidityDistribution: "Distribution de liquidité en temps réel",
    averageAPR: "APR Moyen",
    averageAPRTooltip: "APR moyen pondéré sur toutes vos positions actives.",
    investedCapital: "Capital Investi",
    investedCapitalTooltip: "Capital total que vous avez investi dans toutes les positions.",
    dailyEarnings: "Gains Quotidiens",
    dailyEarningsTooltip: "Gains quotidiens estimés basés sur l'APR actuel.",
    timeToMaturity: "Temps jusqu'à l'Échéance",
    timeToMaturityTooltip: "Temps moyen restant jusqu'à ce que les positions atteignent la date d'échéance.",
    notAvailable: "N/A",
    day: "jour",
    poolDistribution: "Distribution des Pools",
    poolDistributionTooltip: "Distribution de votre capital dans différents pools de liquidité.",
    byCapital: "Par capital",
    performanceByPool: "Performance par Pool",
    performanceByPoolTooltip: "Comparaison APR entre les différents pools dans lesquels vous avez investi.",
    
    // Detalles de posición
    positionId: "ID de Position",
    depositAmount: "Montant Déposé",
    initialValue: "Valeur Initiale",
    currentValue: "Valeur Actuelle",
    profitLoss: "Profit/Perte",
    apr: "APR",
    pool: "Pool",
    createdOn: "Créée le",
    lastUpdate: "Dernière Mise à Jour",
    feesEarned: "Frais Gagnés",
    accumulatedFees: "Frais Accumulés",
    historicalTotal: "Total historique",
    estEarnings: "Gains Est.",
    projectedAnnualYield: "Rendement Annuel Projeté",
    priceRange: "Fourchette de Prix",
    currentPrice: "Prix Actuel",
    contractPeriod: "Période du Contrat",
    ilRisk: "Risque IL",
    low: "Faible",
    medium: "Moyen",
    high: "Élevé",
    
    // Acciones
    addLiquidity: "Ajouter de la Liquidité",
    collectFees: "Collecter les Frais",
    closePosition: "Fermer la Position",
    viewDetails: "Voir les Détails",
    copyAddress: "Copier l'Adresse",
    viewOnEtherscan: "Voir sur Etherscan",
    viewOnUniswap: "Voir sur Uniswap",
    
    // Estados de colección
    collecting: "Collecte...",
    collectingFees: "Collecte des frais...",
    collectSuccess: "Frais collectés avec succès",
    collectError: "Erreur lors de la collecte des frais",
    waitDaysToCollect: "Attendez {{days}} jours pour la prochaine collecte",
    collectFeesAmount: "Collecter {{amount}} en frais",
    cooldownActive: "Période de refroidissement active. Vous pouvez collecter à nouveau des frais dans {{days}} jours.",
    monthlyTimeframe: "Les positions mensuelles ont une période de refroidissement de 30 jours.",
    quarterlyTimeframe: "Les positions trimestrielles ont une période de refroidissement de 90 jours.",
    yearlyTimeframe: "Les positions annuelles ont une période de refroidissement de 365 jours.",
    customTimeframe: "Cette position a une période de refroidissement de {{days}} jours.",
    
    // Mensajes de cierre
    closeConfirmation: "Êtes-vous sûr de vouloir fermer cette position ?",
    closeSuccess: "Position fermée avec succès",
    closeError: "Erreur lors de la fermeture de la position",
    days: "jours",
    
    // Estados sin posiciones
    noActivePositions: "Aucune position active",
    noPositionsMessage: "Vous n'avez pas encore de positions de liquidité",
    createFirstPosition: "Créer la première position",
    
    // Errores
    errorUpdatingPositions: "Erreur lors de la mise à jour des positions",
    errorUpdatingPositionsDescription: "Impossible de mettre à jour les données de position",
    
    // Seguridad
    militaryGradeSecurity: "Sécurité de Grade Militaire",
    securityDescription: "Connexions chiffrées E2E avec les plus hauts standards cryptographiques.",
    neverStoreKeys: "Nous ne stockons jamais vos clés privées.",
    credentialsOnDevice: "Les identifiants restent sur votre appareil.",
    verifiableConnections: "Connexions vérifiables et auditées.",
    auditedCode: "Code de connexion entièrement audité.",
    completeControl: "Contrôle complet sur les transactions.",
    explicitApproval: "Chaque transaction nécessite votre approbation explicite.",
    compatibleWallets: "Portefeuilles Compatibles",
    walletsDescription: "Compatible avec MetaMask, Coinbase Wallet, WalletConnect et plus.",
    mobileDesktopConnection: "Connexion Mobile et Bureau",
    connectionDescription: "Accédez depuis n'importe quel appareil avec synchronisation automatique.",
    securityInformation: "Informations de Sécurité",
    annualized: "Annualisé",
    start: "Début",
    maturity: "Échéance",
    singlePosition: "position",
    multiplePositions: "positions",
    secureConnection: "Connexion Sécurisée",
    secureConnectionDescription: "Connectez votre portefeuille blockchain en toute sécurité pour accéder aux fonctionnalités avancées de gestion de liquidité et de trading.",
    allConnectionsEncrypted: "Toutes les connexions sont cryptées et auditées",
    walletConnect: "WalletConnect",
    universalMultiWallet: "Connexion multi-portefeuilles universelle compatible avec tous les principaux portefeuilles blockchain",
    
    // Detalles de posición específicos
    positionCapitalText: "Le capital de cette position est de {capital} et a généré {fees} en frais.",
    positionCanBeClosed: "La position peut être fermée maintenant"
  },
  
  de: {
    // Títulos y encabezados
    title: "Meine Positionen",
    subtitle: "Verwalten Sie Ihre Liquiditätspositionen",
    myPositions: "Meine Positionen",
    positionDetails: "Positionsdetails",
    
    // Filtros y acciones
    filter: "Filter",
    filterAll: "Alle",
    filterActive: "Aktive",
    filterInactive: "Inaktive",
    filterClosed: "Geschlossene",
    filterPending: "Ausstehend",
    filterFinalized: "Abgeschlossen",
    search: "Suchen",
    searchPlaceholder: "Positionen suchen...",
    refresh: "Aktualisieren",
    newPosition: "Neue Position",
    
    // Estados de posición
    statusActive: "Aktiv",
    statusInactive: "Inaktiv",
    statusClosed: "Geschlossen",
    statusPending: "Ausstehend",
    statusFinalized: "Abgeschlossen",
    
    // Estadísticas principales
    totalLiquidity: "Gesamtliquidität",
    totalLiquidityTooltip: "Gesamtwert Ihrer aktiven Liquiditätspositionen, einschließlich investiertem Kapital und generierten Gebühren.",
    totalFeesEarned: "Gesamtgebühren Verdient",
    totalFeesEarnedTooltip: "Gesamtgebühren bis heute, einschließlich ausstehender und bereits eingezogener Gebühren.",
    activePositions: "Aktive Positionen",
    activePositionsTooltip: "Gesamtzahl der aktiven Liquiditätspositionen, die Sie derzeit haben.",
    
    // Analytics
    positionAnalytics: "Positionsanalyse",
    realTimeLiquidityDistribution: "Echtzeit-Liquiditätsverteilung",
    averageAPR: "Durchschnittliche APR",
    averageAPRTooltip: "Gewichteter durchschnittlicher APR über alle Ihre aktiven Positionen.",
    investedCapital: "Investiertes Kapital",
    investedCapitalTooltip: "Gesamtkapital, das Sie in alle Positionen investiert haben.",
    dailyEarnings: "Tägliche Erträge",
    dailyEarningsTooltip: "Geschätzte tägliche Erträge basierend auf der aktuellen APR.",
    timeToMaturity: "Zeit bis zur Fälligkeit",
    timeToMaturityTooltip: "Durchschnittliche verbleibende Zeit bis die Positionen das Fälligkeitsdatum erreichen.",
    notAvailable: "N/V",
    day: "Tag",
    poolDistribution: "Pool-Verteilung",
    poolDistributionTooltip: "Verteilung Ihres Kapitals auf verschiedene Liquiditätspools.",
    byCapital: "Nach Kapital",
    performanceByPool: "Leistung nach Pool",
    performanceByPoolTooltip: "APR-Vergleich zwischen verschiedenen Pools, in die Sie investiert haben.",
    
    // Detalles de posición
    positionId: "Positions-ID",
    depositAmount: "Einzahlungsbetrag",
    initialValue: "Anfangswert",
    currentValue: "Aktueller Wert",
    profitLoss: "Gewinn/Verlust",
    apr: "APR",
    pool: "Pool",
    createdOn: "Erstellt am",
    lastUpdate: "Letzte Aktualisierung",
    feesEarned: "Verdiente Gebühren",
    accumulatedFees: "Angesammelte Gebühren",
    historicalTotal: "Historische Summe",
    estEarnings: "Geschätzte Erträge",
    projectedAnnualYield: "Projizierte Jahresrendite",
    priceRange: "Preisspanne",
    currentPrice: "Aktueller Preis",
    contractPeriod: "Vertragslaufzeit",
    ilRisk: "IL-Risiko",
    low: "Niedrig",
    medium: "Mittel",
    high: "Hoch",
    
    // Acciones
    addLiquidity: "Liquidität Hinzufügen",
    collectFees: "Gebühren Einziehen",
    closePosition: "Position Schließen",
    viewDetails: "Details Anzeigen",
    copyAddress: "Adresse Kopieren",
    viewOnEtherscan: "Auf Etherscan Anzeigen",
    viewOnUniswap: "Auf Uniswap Anzeigen",
    
    // Estados de colección
    collecting: "Einziehen...",
    collectingFees: "Gebühren einziehen...",
    collectSuccess: "Gebühren erfolgreich eingezogen",
    collectError: "Fehler beim Einziehen der Gebühren",
    waitDaysToCollect: "Warten Sie {{days}} Tage für die nächste Einziehung",
    collectFeesAmount: "{{amount}} an Gebühren einziehen",
    cooldownActive: "Abkühlperiode aktiv. Sie können in {{days}} Tagen wieder Gebühren einziehen.",
    monthlyTimeframe: "Monatliche Positionen haben eine 30-tägige Abkühlperiode.",
    quarterlyTimeframe: "Vierteljährliche Positionen haben eine 90-tägige Abkühlperiode.",
    yearlyTimeframe: "Jährliche Positionen haben eine 365-tägige Abkühlperiode.",
    customTimeframe: "Diese Position hat eine {{days}}-tägige Abkühlperiode.",
    
    // Mensajes de cierre
    closeConfirmation: "Sind Sie sicher, dass Sie diese Position schließen möchten?",
    closeSuccess: "Position erfolgreich geschlossen",
    closeError: "Fehler beim Schließen der Position",
    days: "Tage",
    
    // Estados sin posiciones
    noActivePositions: "Keine aktiven Positionen",
    noPositionsMessage: "Sie haben noch keine Liquiditätspositionen",
    createFirstPosition: "Erste Position erstellen",
    
    // Errores
    errorUpdatingPositions: "Fehler beim Aktualisieren der Positionen",
    errorUpdatingPositionsDescription: "Positionsdaten konnten nicht aktualisiert werden",
    
    // Seguridad
    militaryGradeSecurity: "Militärische Sicherheit",
    securityDescription: "E2E-verschlüsselte Verbindungen mit höchsten kryptographischen Standards.",
    neverStoreKeys: "Wir speichern niemals Ihre privaten Schlüssel.",
    credentialsOnDevice: "Anmeldedaten bleiben auf Ihrem Gerät.",
    verifiableConnections: "Überprüfbare und geprüfte Verbindungen.",
    auditedCode: "Vollständig geprüfter Verbindungscode.",
    completeControl: "Vollständige Kontrolle über Transaktionen.",
    explicitApproval: "Jede Transaktion erfordert Ihre ausdrückliche Genehmigung.",
    compatibleWallets: "Kompatible Wallets",
    walletsDescription: "Kompatibel mit MetaMask, Coinbase Wallet, WalletConnect und mehr.",
    mobileDesktopConnection: "Mobile & Desktop-Verbindung",
    connectionDescription: "Zugriff von jedem Gerät mit automatischer Synchronisierung.",
    securityInformation: "Sicherheitsinformationen",
    annualized: "Jährlich",
    start: "Start",
    maturity: "Fälligkeit",
    singlePosition: "Position",
    multiplePositions: "Positionen",
    secureConnection: "Sichere Verbindung",
    secureConnectionDescription: "Verbinden Sie Ihr Blockchain-Wallet sicher, um auf erweiterte Liquiditätsverwaltung und Trading-Funktionen zuzugreifen.",
    allConnectionsEncrypted: "Alle Verbindungen sind verschlüsselt und geprüft",
    walletConnect: "WalletConnect",
    universalMultiWallet: "Universelle Multi-Wallet-Verbindung kompatibel mit allen wichtigen Blockchain-Wallets",
    
    // Detalles de posición específicos
    positionCapitalText: "Das Kapital dieser Position beträgt {capital} und hat {fees} an Gebühren verdient.",
    positionCanBeClosed: "Die Position kann jetzt geschlossen werden"
  },
  
  pt: {
    // Títulos y encabezados
    title: "Minhas Posições",
    subtitle: "Gerencie suas posições de liquidez",
    myPositions: "Minhas Posições",
    positionDetails: "Detalhes da Posição",
    
    // Filtros y acciones
    filter: "Filtrar",
    filterAll: "Todas",
    filterActive: "Ativas",
    filterInactive: "Inativas",
    filterClosed: "Fechadas",
    filterPending: "Pendentes",
    filterFinalized: "Finalizadas",
    search: "Buscar",
    searchPlaceholder: "Buscar posições...",
    refresh: "Atualizar",
    newPosition: "Nova Posição",
    
    // Estados de posición
    statusActive: "Ativa",
    statusInactive: "Inativa",
    statusClosed: "Fechada",
    statusPending: "Pendente",
    statusFinalized: "Finalizada",
    
    // Estadísticas principales
    totalLiquidity: "Liquidez Total",
    totalLiquidityTooltip: "Valor total de suas posições de liquidez ativas, incluindo capital investido e taxas geradas.",
    totalFeesEarned: "Total de Taxas Ganhas",
    totalFeesEarnedTooltip: "Total de taxas acumuladas até a data, incluindo taxas pendentes e já coletadas.",
    activePositions: "Posições Ativas",
    activePositionsTooltip: "Número total de posições de liquidez ativas que você possui atualmente.",
    
    // Analytics
    positionAnalytics: "Análise de Posições",
    realTimeLiquidityDistribution: "Distribuição de liquidez em tempo real",
    averageAPR: "APR Médio",
    averageAPRTooltip: "APR médio ponderado em todas as suas posições ativas.",
    investedCapital: "Capital Investido",
    investedCapitalTooltip: "Capital total que você investiu em todas as posições.",
    dailyEarnings: "Ganhos Diários",
    dailyEarningsTooltip: "Ganhos diários estimados baseados no APR atual.",
    timeToMaturity: "Tempo até o Vencimento",
    timeToMaturityTooltip: "Tempo médio restante até que as posições atinjam a data de vencimento.",
    notAvailable: "N/D",
    day: "dia",
    poolDistribution: "Distribuição de Pools",
    poolDistributionTooltip: "Distribuição do seu capital em diferentes pools de liquidez.",
    byCapital: "Por capital",
    performanceByPool: "Desempenho por Pool",
    performanceByPoolTooltip: "Comparação de APR entre diferentes pools nos quais você investiu.",
    
    // Detalles de posición
    positionId: "ID da Posição",
    depositAmount: "Valor Depositado",
    initialValue: "Valor Inicial",
    currentValue: "Valor Atual",
    profitLoss: "Lucro/Prejuízo",
    apr: "APR",
    pool: "Pool",
    createdOn: "Criada em",
    lastUpdate: "Última Atualização",
    feesEarned: "Taxas Ganhas",
    accumulatedFees: "Taxas Acumuladas",
    historicalTotal: "Total histórico",
    estEarnings: "Ganhos Est.",
    projectedAnnualYield: "Rendimento Anual Projetado",
    priceRange: "Faixa de Preço",
    currentPrice: "Preço Atual",
    contractPeriod: "Período do Contrato",
    ilRisk: "Risco IL",
    low: "Baixo",
    medium: "Médio",
    high: "Alto",
    
    // Acciones
    addLiquidity: "Adicionar Liquidez",
    collectFees: "Coletar Taxas",
    closePosition: "Fechar Posição",
    viewDetails: "Ver Detalhes",
    copyAddress: "Copiar Endereço",
    viewOnEtherscan: "Ver no Etherscan",
    viewOnUniswap: "Ver no Uniswap",
    
    // Estados de colección
    collecting: "Coletando...",
    collectingFees: "Coletando taxas...",
    collectSuccess: "Taxas coletadas com sucesso",
    collectError: "Erro ao coletar taxas",
    waitDaysToCollect: "Aguarde {{days}} dias para a próxima coleta",
    collectFeesAmount: "Coletar {{amount}} em taxas",
    cooldownActive: "Período de resfriamento ativo. Você pode coletar taxas novamente em {{days}} dias.",
    monthlyTimeframe: "Posições mensais têm um período de resfriamento de 30 dias.",
    quarterlyTimeframe: "Posições trimestrais têm um período de resfriamento de 90 dias.",
    yearlyTimeframe: "Posições anuais têm um período de resfriamento de 365 dias.",
    customTimeframe: "Esta posição tem um período de resfriamento de {{days}} dias.",
    
    // Mensajes de cierre
    closeConfirmation: "Tem certeza de que deseja fechar esta posição?",
    closeSuccess: "Posição fechada com sucesso",
    closeError: "Erro ao fechar posição",
    days: "dias",
    
    // Estados sin posiciones
    noActivePositions: "Nenhuma posição ativa",
    noPositionsMessage: "Você ainda não tem posições de liquidez",
    createFirstPosition: "Criar primeira posição",
    
    // Errores
    errorUpdatingPositions: "Erro ao atualizar posições",
    errorUpdatingPositionsDescription: "Não foi possível atualizar dados das posições",
    
    // Seguridad
    militaryGradeSecurity: "Segurança de Grau Militar",
    securityDescription: "Conexões criptografadas E2E com os mais altos padrões criptográficos.",
    neverStoreKeys: "Nunca armazenamos suas chaves privadas.",
    credentialsOnDevice: "Credenciais permanecem em seu dispositivo.",
    verifiableConnections: "Conexões verificáveis e auditadas.",
    auditedCode: "Código de conexão totalmente auditado.",
    completeControl: "Controle completo sobre transações.",
    explicitApproval: "Cada transação requer sua aprovação explícita.",
    compatibleWallets: "Carteiras Compatíveis",
    walletsDescription: "Compatível com MetaMask, Coinbase Wallet, WalletConnect e mais.",
    mobileDesktopConnection: "Conexão Móvel e Desktop",
    connectionDescription: "Acesse de qualquer dispositivo com sincronização automática.",
    securityInformation: "Informações de Segurança",
    annualized: "Anualizado",
    start: "Início",
    maturity: "Vencimento",
    singlePosition: "posição",
    multiplePositions: "posições",
    secureConnection: "Conexão Segura",
    secureConnectionDescription: "Conecte sua carteira blockchain com segurança para acessar recursos avançados de gerenciamento de liquidez e trading.",
    allConnectionsEncrypted: "Todas as conexões são criptografadas e auditadas",
    walletConnect: "WalletConnect",
    universalMultiWallet: "Conexão multi-carteira universal compatível com todas as principais carteiras blockchain",
    
    // Detalles de posición específicos
    positionCapitalText: "O capital desta posição é {capital} e ganhou {fees} em taxas.",
    positionCanBeClosed: "A posição pode ser fechada agora"
  },
  zh: {
    // Títulos y encabezados
    title: "我的头寸",
    subtitle: "管理您的流动性头寸",
    myPositions: "我的头寸",
    positionDetails: "头寸详情",
    
    // Filtros y acciones
    filter: "筛选",
    filterAll: "全部",
    filterActive: "活跃",
    filterInactive: "非活跃",
    filterClosed: "已关闭",
    filterPending: "待处理",
    filterFinalized: "已完成",
    search: "搜索",
    searchPlaceholder: "搜索头寸...",
    refresh: "刷新",
    newPosition: "新头寸",
    
    // Estados de posición
    statusActive: "活跃",
    statusInactive: "非活跃",
    statusClosed: "已关闭",
    statusPending: "待处理",
    statusFinalized: "已完成",
    
    // Estadísticas principales
    totalLiquidity: "总流动性",
    totalLiquidityTooltip: "您活跃流动性头寸的总价值，包括投资资本和产生的费用。",
    totalFeesEarned: "总费用收入",
    totalFeesEarnedTooltip: "迄今为止累积的总费用，包括待收和已收取的费用。",
    activePositions: "活跃头寸",
    activePositionsTooltip: "您当前拥有的活跃流动性头寸总数。",
    
    // Analytics
    positionAnalytics: "头寸分析",
    realTimeLiquidityDistribution: "实时流动性分布",
    averageAPR: "平均年化收益率",
    averageAPRTooltip: "所有活跃头寸的加权平均年化收益率。",
    investedCapital: "投资资本",
    investedCapitalTooltip: "您在所有头寸中投资的总资本。",
    dailyEarnings: "日收益",
    dailyEarningsTooltip: "基于当前年化收益率的估计日收益。",
    timeToMaturity: "到期时间",
    timeToMaturityTooltip: "头寸到达到期日的平均剩余时间。",
    notAvailable: "不适用",
    day: "天",
    poolDistribution: "资金池分布",
    poolDistributionTooltip: "您的资本在不同流动性池中的分布。",
    byCapital: "按资本",
    performanceByPool: "按池表现",
    performanceByPoolTooltip: "您投资的不同池之间的年化收益率比较。",
    
    // Detalles de posición
    positionId: "头寸ID",
    depositAmount: "存款金额",
    initialValue: "初始价值",
    currentValue: "当前价值",
    profitLoss: "盈亏",
    apr: "年化收益率",
    pool: "资金池",
    createdOn: "创建于",
    lastUpdate: "最后更新",
    feesEarned: "费用收入",
    accumulatedFees: "累积费用",
    historicalTotal: "历史总计",
    estEarnings: "预估收益",
    projectedAnnualYield: "预计年收益",
    priceRange: "价格范围",
    currentPrice: "当前价格",
    contractPeriod: "合约期间",
    ilRisk: "无常损失风险",
    low: "低",
    medium: "中",
    high: "高",
    
    // Acciones
    addLiquidity: "添加流动性",
    collectFees: "收取费用",
    closePosition: "关闭头寸",
    viewDetails: "查看详情",
    copyAddress: "复制地址",
    viewOnEtherscan: "在Etherscan查看",
    viewOnUniswap: "在Uniswap查看",
    
    // Estados de colección
    collecting: "收取中...",
    collectingFees: "收取费用中...",
    collectSuccess: "费用收取成功",
    collectError: "收取费用出错",
    waitDaysToCollect: "等待{{days}}天进行下次收取",
    collectFeesAmount: "收取{{amount}}费用",
    cooldownActive: "冷却期激活。您可以在{{days}}天后再次收取费用。",
    monthlyTimeframe: "月度头寸有30天冷却期。",
    quarterlyTimeframe: "季度头寸有90天冷却期。",
    yearlyTimeframe: "年度头寸有365天冷却期。",
    customTimeframe: "此头寸有{{days}}天冷却期。",
    
    // Mensajes de cierre
    closeConfirmation: "您确定要关闭此头寸吗？",
    closeSuccess: "头寸关闭成功",
    closeError: "关闭头寸出错",
    days: "天",
    
    // Estados sin posiciones
    noActivePositions: "没有活跃头寸",
    noPositionsMessage: "您还没有流动性头寸",
    createFirstPosition: "创建第一个头寸",
    
    // Errores
    errorUpdatingPositions: "更新头寸出错",
    errorUpdatingPositionsDescription: "无法更新头寸数据",
    
    // Seguridad
    militaryGradeSecurity: "军用级安全",
    securityDescription: "采用最高加密标准的端到端加密连接。",
    neverStoreKeys: "我们从不存储您的私钥。",
    credentialsOnDevice: "凭据保留在您的设备上。",
    verifiableConnections: "可验证和审计的连接。",
    auditedCode: "完全审计的连接代码。",
    completeControl: "对交易的完全控制。",
    explicitApproval: "每笔交易都需要您的明确批准。",
    compatibleWallets: "兼容钱包",
    walletsDescription: "兼容MetaMask、Coinbase Wallet、WalletConnect等。",
    mobileDesktopConnection: "移动和桌面连接",
    connectionDescription: "从任何设备访问，具有自动同步功能。",
    securityInformation: "安全信息",
    annualized: "年化",
    start: "开始",
    maturity: "到期",
    singlePosition: "仓位",
    multiplePositions: "仓位",
    secureConnection: "安全连接",
    secureConnectionDescription: "安全连接您的区块链钱包以访问高级流动性管理和交易功能。",
    allConnectionsEncrypted: "所有连接都已加密和审计",
    walletConnect: "WalletConnect",
    universalMultiWallet: "通用多钱包连接，兼容所有主要的区块链钱包",
    
    // Detalles de posición específicos
    positionCapitalText: "此头寸的资本为 {capital}，已赚取 {fees} 的费用。",
    positionCanBeClosed: "头寸现在可以关闭"
  },
  
  hi: {
    // Títulos y encabezados
    title: "मेरी पोजीशन",
    subtitle: "अपनी लिक्विडिटी पोजीशन का प्रबंधन करें",
    myPositions: "मेरी पोजीशन",
    positionDetails: "पोजीशन विवरण",
    
    // Filtros y acciones
    filter: "फ़िल्टर",
    filterAll: "सभी",
    filterActive: "सक्रिय",
    filterInactive: "निष्क्रिय",
    filterClosed: "बंद",
    filterPending: "लंबित",
    filterFinalized: "अंतिम",
    search: "खोजें",
    searchPlaceholder: "पोजीशन खोजें...",
    refresh: "रीफ्रेश",
    newPosition: "नई पोजीशन",
    
    // Estados de posición
    statusActive: "सक्रिय",
    statusInactive: "निष्क्रिय",
    statusClosed: "बंद",
    statusPending: "लंबित",
    statusFinalized: "अंतिम",
    
    // Estadísticas principales
    totalLiquidity: "कुल लिक्विडिटी",
    totalLiquidityTooltip: "आपकी सक्रिय लिक्विडिटी पोजीशन का कुल मूल्य, निवेशित पूंजी और उत्पन्न फीस सहित।",
    totalFeesEarned: "कुल अर्जित फीस",
    totalFeesEarnedTooltip: "आज तक की कुल संचित फीस, लंबित और पहले से एकत्रित फीस सहित।",
    activePositions: "सक्रिय पोजीशन",
    activePositionsTooltip: "आपके पास वर्तमान में सक्रिय लिक्विडिटी पोजीशन की कुल संख्या।",
    
    // Analytics
    positionAnalytics: "पोजीशन विश्लेषण",
    realTimeLiquidityDistribution: "रियल-टाइम लिक्विडिटी वितरण",
    averageAPR: "औसत APR",
    averageAPRTooltip: "आपकी सभी सक्रिय पोजीशन में भारित औसत APR।",
    investedCapital: "निवेशित पूंजी",
    investedCapitalTooltip: "आपने सभी पोजीशन में निवेश की गई कुल पूंजी।",
    dailyEarnings: "दैनिक आय",
    dailyEarningsTooltip: "वर्तमान APR के आधार पर अनुमानित दैनिक आय।",
    timeToMaturity: "परिपक्वता तक समय",
    timeToMaturityTooltip: "पोजीशन के परिपक्वता तिथि तक पहुंचने का औसत शेष समय।",
    notAvailable: "उपलब्ध नहीं",
    day: "दिन",
    poolDistribution: "पूल वितरण",
    poolDistributionTooltip: "विभिन्न लिक्विडिटी पूल में आपकी पूंजी का वितरण।",
    byCapital: "पूंजी के अनुसार",
    performanceByPool: "पूल के अनुसार प्रदर्शन",
    performanceByPoolTooltip: "आपने जिन विभिन्न पूल में निवेश किया है उनमें APR तुलना।",
    
    // Detalles de posición
    positionId: "पोजीशन ID",
    depositAmount: "जमा राशि",
    initialValue: "प्रारंभिक मूल्य",
    currentValue: "वर्तमान मूल्य",
    profitLoss: "लाभ/हानि",
    apr: "APR",
    pool: "पूल",
    createdOn: "बनाया गया",
    lastUpdate: "अंतिम अपडेट",
    feesEarned: "अर्जित फीस",
    accumulatedFees: "संचित फीस",
    historicalTotal: "ऐतिहासिक कुल",
    estEarnings: "अनुमानित आय",
    projectedAnnualYield: "अनुमानित वार्षिक उपज",
    priceRange: "मूल्य सीमा",
    currentPrice: "वर्तमान मूल्य",
    contractPeriod: "अनुबंध अवधि",
    ilRisk: "IL जोखिम",
    low: "कम",
    medium: "मध्यम",
    high: "उच्च",
    
    // Acciones
    addLiquidity: "लिक्विडिटी जोड़ें",
    collectFees: "फीस एकत्रित करें",
    closePosition: "पोजीशन बंद करें",
    viewDetails: "विवरण देखें",
    copyAddress: "पता कॉपी करें",
    viewOnEtherscan: "Etherscan पर देखें",
    viewOnUniswap: "Uniswap पर देखें",
    
    // Estados de colección
    collecting: "एकत्रित कर रहे हैं...",
    collectingFees: "फीस एकत्रित कर रहे हैं...",
    collectSuccess: "फीस सफलतापूर्वक एकत्रित",
    collectError: "फीस एकत्रित करने में त्रुटि",
    waitDaysToCollect: "अगली संग्रह के लिए {{days}} दिन प्रतीक्षा करें",
    collectFeesAmount: "{{amount}} फीस एकत्रित करें",
    cooldownActive: "कूलडाउन अवधि सक्रिय। आप {{days}} दिनों में फिर से फीस एकत्रित कर सकते हैं।",
    monthlyTimeframe: "मासिक पोजीशन में 30-दिन की कूलडाउन अवधि होती है।",
    quarterlyTimeframe: "त्रैमासिक पोजीशन में 90-दिन की कूलडाउन अवधि होती है।",
    yearlyTimeframe: "वार्षिक पोजीशन में 365-दिन की कूलडाउन अवधि होती है।",
    customTimeframe: "इस पोजीशन में {{days}}-दिन की कूलडाउन अवधि है।",
    
    // Mensajes de cierre
    closeConfirmation: "क्या आप वाकई इस पोजीशन को बंद करना चाहते हैं?",
    closeSuccess: "पोजीशन सफलतापूर्वक बंद",
    closeError: "पोजीशन बंद करने में त्रुटि",
    days: "दिन",
    
    // Estados sin posiciones
    noActivePositions: "कोई सक्रिय पोजीशन नहीं",
    noPositionsMessage: "आपके पास अभी तक कोई लिक्विडिटी पोजीशन नहीं है",
    createFirstPosition: "पहली पोजीशन बनाएं",
    
    // Errores
    errorUpdatingPositions: "पोजीशन अपडेट करने में त्रुटि",
    errorUpdatingPositionsDescription: "पोजीशन डेटा अपडेट नहीं कर सका",
    
    // Seguridad
    militaryGradeSecurity: "सैन्य ग्रेड सुरक्षा",
    securityDescription: "उच्चतम क्रिप्टोग्राफिक मानकों के साथ E2E एन्क्रिप्टेड कनेक्शन।",
    neverStoreKeys: "हम कभी भी आपकी निजी चाबियां संग्रहीत नहीं करते।",
    credentialsOnDevice: "क्रेडेंशियल आपके डिवाइस पर रहते हैं।",
    verifiableConnections: "सत्यापन योग्य और ऑडिटेड कनेक्शन।",
    auditedCode: "पूरी तरह से ऑडिटेड कनेक्शन कोड।",
    completeControl: "लेनदेन पर पूर्ण नियंत्रण।",
    explicitApproval: "प्रत्येक लेनदेन के लिए आपकी स्पष्ट अनुमति आवश्यक है।",
    compatibleWallets: "संगत वॉलेट",
    walletsDescription: "MetaMask, Coinbase Wallet, WalletConnect और अधिक के साथ संगत।",
    mobileDesktopConnection: "मोबाइल और डेस्कटॉप कनेक्शन",
    connectionDescription: "स्वचालित सिंक्रोनाइज़ेशन के साथ किसी भी डिवाइस से एक्सेस करें।",
    securityInformation: "सुरक्षा जानकारी",
    annualized: "वार्षिक",
    start: "शुरुआत",
    maturity: "परिपक्वता",
    singlePosition: "स्थिति",
    multiplePositions: "स्थितियां",
    secureConnection: "सुरक्षित कनेक्शन",
    secureConnectionDescription: "उन्नत तरलता प्रबंधन और ट्रेडिंग सुविधाओं तक पहुंचने के लिए अपने ब्लॉकचेन वॉलेट को सुरक्षित रूप से कनेक्ट करें।",
    allConnectionsEncrypted: "सभी कनेक्शन एन्क्रिप्टेड और ऑडिटेड हैं",
    walletConnect: "WalletConnect",
    universalMultiWallet: "सभी प्रमुख ब्लॉकचेन वॉलेट के साथ संगत सार्वभौमिक मल्टी-वॉलेट कनेक्शन",
    
    // Detalles de posición específicos
    positionCapitalText: "इस पोजीशन की पूंजी {capital} है और इसने {fees} फीस में कमाई की है।",
    positionCanBeClosed: "पोजीशन अब बंद की जा सकती है"
  },
  
  ar: {
    // Títulos y encabezados
    title: "مراكز المعاملات",
    subtitle: "إدارة مراكز السيولة الخاصة بك",
    myPositions: "مراكز المعاملات",
    positionDetails: "تفاصيل المركز",
    
    // Filtros y acciones
    filter: "فلتر",
    filterAll: "الكل",
    filterActive: "نشط",
    filterInactive: "غير نشط",
    filterClosed: "مغلق",
    filterPending: "معلق",
    filterFinalized: "مكتمل",
    search: "بحث",
    searchPlaceholder: "البحث في المراكز...",
    refresh: "تحديث",
    newPosition: "مركز جديد",
    
    // Estados de posición
    statusActive: "نشط",
    statusInactive: "غير نشط",
    statusClosed: "مغلق",
    statusPending: "معلق",
    statusFinalized: "مكتمل",
    
    // Estadísticas principales
    totalLiquidity: "إجمالي السيولة",
    totalLiquidityTooltip: "القيمة الإجمالية لمراكز السيولة النشطة، بما في ذلك رأس المال المستثمر والرسوم المُحققة.",
    totalFeesEarned: "إجمالي الرسوم المكتسبة",
    totalFeesEarnedTooltip: "إجمالي الرسوم المتراكمة حتى اليوم، بما في ذلك الرسوم المعلقة والمُجمعة بالفعل.",
    activePositions: "المراكز النشطة",
    activePositionsTooltip: "العدد الإجمالي لمراكز السيولة النشطة التي تملكها حالياً.",
    
    // Analytics
    positionAnalytics: "تحليل المراكز",
    realTimeLiquidityDistribution: "توزيع السيولة في الوقت الفعلي",
    averageAPR: "متوسط معدل الفائدة السنوي",
    averageAPRTooltip: "متوسط معدل الفائدة السنوي المرجح عبر جميع مراكزك النشطة.",
    investedCapital: "رأس المال المستثمر",
    investedCapitalTooltip: "إجمالي رأس المال الذي استثمرته في جميع المراكز.",
    dailyEarnings: "الأرباح اليومية",
    dailyEarningsTooltip: "الأرباح اليومية المقدرة بناءً على معدل الفائدة السنوي الحالي.",
    timeToMaturity: "الوقت حتى الاستحقاق",
    timeToMaturityTooltip: "متوسط الوقت المتبقي حتى تصل المراكز إلى تاريخ الاستحقاق.",
    notAvailable: "غير متاح",
    day: "يوم",
    poolDistribution: "توزيع التجمعات",
    poolDistributionTooltip: "توزيع رأس مالك عبر تجمعات السيولة المختلفة.",
    byCapital: "حسب رأس المال",
    performanceByPool: "الأداء حسب التجمع",
    performanceByPoolTooltip: "مقارنة معدل الفائدة السنوي عبر التجمعات المختلفة التي استثمرت بها.",
    
    // Detalles de posición
    positionId: "معرف المركز",
    depositAmount: "مبلغ الإيداع",
    initialValue: "القيمة الأولية",
    currentValue: "القيمة الحالية",
    profitLoss: "ربح/خسارة",
    apr: "معدل الفائدة السنوي",
    pool: "التجمع",
    createdOn: "تم الإنشاء في",
    lastUpdate: "آخر تحديث",
    feesEarned: "الرسوم المكتسبة",
    accumulatedFees: "الرسوم المتراكمة",
    historicalTotal: "الإجمالي التاريخي",
    estEarnings: "الأرباح المقدرة",
    projectedAnnualYield: "العائد السنوي المتوقع",
    priceRange: "نطاق السعر",
    currentPrice: "السعر الحالي",
    contractPeriod: "فترة العقد",
    ilRisk: "مخاطر فقدان غير دائم",
    low: "منخفض",
    medium: "متوسط",
    high: "مرتفع",
    
    // Acciones
    addLiquidity: "إضافة سيولة",
    collectFees: "تجميع الرسوم",
    closePosition: "إغلاق المركز",
    viewDetails: "عرض التفاصيل",
    copyAddress: "نسخ العنوان",
    viewOnEtherscan: "عرض على Etherscan",
    viewOnUniswap: "عرض على Uniswap",
    
    // Estados de colección
    collecting: "يتم التجميع...",
    collectingFees: "تجميع الرسوم...",
    collectSuccess: "تم تجميع الرسوم بنجاح",
    collectError: "خطأ في تجميع الرسوم",
    waitDaysToCollect: "انتظر {{days}} أيام للتجميع التالي",
    collectFeesAmount: "تجميع {{amount}} من الرسوم",
    cooldownActive: "فترة التهدئة نشطة. يمكنك تجميع الرسوم مرة أخرى خلال {{days}} أيام.",
    monthlyTimeframe: "المراكز الشهرية لها فترة تهدئة 30 يوماً.",
    quarterlyTimeframe: "المراكز الفصلية لها فترة تهدئة 90 يوماً.",
    yearlyTimeframe: "المراكز السنوية لها فترة تهدئة 365 يوماً.",
    customTimeframe: "هذا المركز له فترة تهدئة {{days}} يوماً.",
    
    // Mensajes de cierre
    closeConfirmation: "هل أنت متأكد من أنك تريد إغلاق هذا المركز؟",
    closeSuccess: "تم إغلاق المركز بنجاح",
    closeError: "خطأ في إغلاق المركز",
    days: "أيام",
    
    // Estados sin posiciones
    noActivePositions: "لا توجد مراكز نشطة",
    noPositionsMessage: "ليس لديك مراكز سيولة بعد",
    createFirstPosition: "إنشاء أول مركز",
    
    // Errores
    errorUpdatingPositions: "خطأ في تحديث المراكز",
    errorUpdatingPositionsDescription: "لا يمكن تحديث بيانات المراكز",
    
    // Seguridad
    militaryGradeSecurity: "أمان من الدرجة العسكرية",
    securityDescription: "اتصالات مشفرة من نهاية إلى نهاية بأعلى المعايير التشفيرية.",
    neverStoreKeys: "نحن لا نخزن مفاتيحك الخاصة أبداً.",
    credentialsOnDevice: "بيانات الاعتماد تبقى على جهازك.",
    verifiableConnections: "اتصالات قابلة للتحقق ومراجعة.",
    auditedCode: "كود الاتصال مراجع بالكامل.",
    completeControl: "تحكم كامل في المعاملات.",
    explicitApproval: "كل معاملة تتطلب موافقتك الصريحة.",
    securityInformation: "معلومات الأمان",
    
    // Traducciones adicionales necesarias
    annualized: "سنوي",
    start: "بداية",
    maturity: "استحقاق",
    singlePosition: "مركز",
    multiplePositions: "مراكز",
    
    // Textos de conexión de wallet
    secureConnection: "اتصال آمن",
    secureConnectionDescription: "قم بتوصيل محفظة البلوك تشين الخاصة بك بأمان للوصول إلى ميزات إدارة السيولة والتداول المتقدمة.",
    allConnectionsEncrypted: "جميع الاتصالات مشفرة ومدققة",
    walletConnect: "WalletConnect",
    universalMultiWallet: "اتصال محفظة متعددة عالمية متوافقة مع جميع محافظ البلوك تشين الرئيسية",
    
    // Detalles de posición específicos
    positionCapitalText: "رأس مال هذا المركز هو {capital} وقد حقق {fees} في الرسوم.",
    positionCanBeClosed: "يمكن إغلاق المركز الآن"
  }
};