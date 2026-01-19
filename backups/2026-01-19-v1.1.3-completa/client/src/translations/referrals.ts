import { Language } from "@/context/language-context";

// Interface for referral page translations
export interface ReferralsTranslations {
  // Add missing required properties (agrupadas al principio o donde tenga sentido)
  referralsNeeded: string;
  noReferredUsers: string; // Una sola vez
  fiveReferrals: string;
  twentyReferrals: string;
  fiftyReferrals: string;
  referralsAvgInvestment: string;
  blockchainVerified: string;
  automaticDistribution: string;
  // Main title and description
  referralProgram: string;
  earnWhileFriendsEarn: string;
  referralCount: string; // Renombrado de 'referrals' para evitar ambigüedad con el título de la pestaña

  // Tabs
  myReferralCode: string;
  useReferralCode: string;
  referredUsers: string;
  benefits: string;

  // My Referral Code Section
  growTogether: string;
  joinOurProgram: string;
  joinNow: string;
  seeBenefits: string;
  shareYourCode: string;
  personalReferralCode: string;
  copy: string;
  share: string;
  createReferralCode: string;
  notAuthenticated: string;
  connectWallet: string;

  // Wallet security
  secureConnection: string;
  encryptedConnections: string;

  // Stats and rewards
  referralStats: string;
  totalReferred: string;
  activeUsers: string;
  totalRewards: string;
  completionRate: string;
  activeProgram: string;
  accumulatedEarnings: string;
  withdraw: string;
  withdrawing: string;
  noRewardsAvailable: string;
  noRewardsToWithdraw: string;
  walletNotConnected: string;
  connectWalletToWithdraw: string;
  withdrawalSuccessful: string;
  rewardsSentToWallet: string;
  withdrawalError: string;
  confirmWithdrawal: string;
  confirmWithdrawalMessage: string;
  amountToWithdraw: string;
  withdrawalCurrency: string;
  receivingWallet: string;
  minimumBalanceNotMet: string;
  withdrawalMinimumBalance: string;
  withdrawalNote: string;
  cancel: string;
  processing: string;
  confirmAndWithdraw: string;
  featureInDevelopment: string;
  withdrawalFeatureComingSoon: string;
  withdrawalFailed: string;
  withdrawalProcessingError: string;
  yourBenefit: string;
  ofAllReturns: string;
  aprBoost: string;
  yourRank: string;
  nextRank: string;
  usersNeeded: string;
  nextMilestone: string;
  current: string;

  // Ranks and rank titles
  yourReferralRank: string;
  keepInvitingFriends: string;
  rankBenefits: string;
  unlockSpecialPerks: string;

  // Rank names
  Rookie: string;
  Rabbit: string;
  Cat: string;
  Dog: string;
  Sentinel: string;
  Phoenix: string;
  Legend: string;
  Champion: string;
  Advanced: string;
  Elite: string;

  // Rank benefits
  onePercentRewards: string;
  basicDashboardAccess: string;
  standardSupport: string;
  onePointFivePercentRewards: string;
  prioritySupport: string;
  exclusiveWebinars: string;
  twoPercentRewards: string;
  vipSupport: string;
  earlyAccess: string;

  // Rank progress section
  youNeed: string;
  moreReferralsToAdvance: string;
  // referralsNeeded: string; // Ya está definida arriba. Si es para el mismo concepto, eliminar duplicado.

  // Maximum rank messages
  congratsHighestRank: string;
  enjoyChampionBenefits: string;

  // Referred Users section
  loadingReferredUsers: string;
  noReferredUsersYet: string;
  startReferred: string;
  inviteMoreFriends: string;
  seeAllRanks: string;

  // Additional properties for "Use Code" section
  referralCodeDetected: string;
  referralCodeFound: string;
  using: string;
  useCode: string;
  submitting: string;

  // Use Referral Code Section
  useReferralCodeTitle: string;
  enterCode: string;
  submitCode: string;
  alreadyReferred: string;
  referredBy: string;
  referredByComplete: string;
  referralAprBoostMessage: string;

  // Referred Users Section (Estas propiedades deben ser únicas o se fusionan)
  referredUsersTitle: string;
  // noReferredUsers: string; // Duplicado, ya está definido
  inviteFriends: string;
  referralCodeRequired: string;
  address: string;
  joinDate: string;
  status: string;
  rewards: string;
  active: string;
  inactive: string;
  // fiveReferrals: string; // Duplicado, ya está definido
  // twentyReferrals: string; // Duplicado, ya está definido
  // fiftyReferrals: string; // Duplicado, ya está definido
  // referralsAvgInvestment: string; // Duplicado, ya está definido

  // Benefits Section
  benefitsTitle: string;
  benefitsDescription: string;
  commissionRewards: string;
  commissionDescription: string;
  rankingSystem: string;
  rankingDescription: string;
  aprBoostDescription: string;
  referralBenefits: string;
  whenYouUseCode: string;
  aprBoostDescription1: string;
  whenOthersUseCode: string;
  passiveIncomeStream: string;
  networkEffect: string;
  noLimits: string;
  instantRewards: string;
  winWinSystem: string;
  secureTransparent: string;
  // blockchainVerified: string; // Duplicado, ya está definido
  // automaticDistribution: string; // Duplicado, ya está definido
  noHiddenConditions: string;

  // Rewards calculator
  rewardsCalculator: string;
  calculateEarnings: string;
  numberOfReferrals: string;
  averageInvestment: string;
  baseAPR: string;
  timeHorizon: string;
  years: string;
  year: string;
  potentialEarnings: string;
  totalOver: string;
  with: string;
  referralsInvesting: string;
  each: string;
  annualEarnings: string;
  monthlyEarnings: string;
  commissionRate: string;
  rankGivesYou: string;
  commissionOnEarnings: string;
  calculator: string;
  earningScenarios: string;
  updating: string;
  // dataRefresh: string; // Eliminar o renombrar a refetchData
  yourCommissionRate: string;
  perReferralAnnual: string;
  basedOn: string;
  at: string;
  calculatorUsesRealAPR: string;
  fromAllActivePositions: string;
  basedOnPlatformAverage: string;
  calculatedFrom: string;
  activePositionsWithLiquidity: string;
  outOf: string;
  totalActivePositions: string;

  // Referral Levels
  referralLevels: string;
  progressThroughRanks: string;
  // referrals: string; // Duplicado, usar referralCount

  // Success stories
  successStoryTitle: string;
  successStoryDescription: string;
  noLimitUsers: string;
  earningsGrow: string;
  passiveIncomeContinues: string;
  averageEarnings: string;
  perYearWithActive: string;
  enterpriseInvestor: string;
  cryptoEnthusiast: string;
  financialAdvisor: string;
  referredUsers2: string; // Si es lo mismo que referredUsers, consolidar
  totalEarned: string;
  yourSuccessStoryAwaits: string;
  joinCommunity: string;

  // How it works section
  howItWorks: string;
  stepsToEarn: string;
  getYourCode: string;
  codeAutoGenerated: string;
  shareWithFriends: string;
  sendReferralLink: string;
  earnRewards: string;

  // Errors and messages
  success: string;
  error: string;
  copied: string;
  copyToClipboard: string;
  copyReferralLink: string;
  fullReferralCopied: string;
  errorCopying: string;
  shareText: string;
  errorSharing: string;
  errorNotAuthenticated: string;
  errorMissingWallet: string;
  errorMissingCode: string;
  errorAuthentication: string;
  referralCodeCreated: string;
  referralCodeSuccess: string;
  referralCodeError: string;
  referralCodeUsed: string;
  referralCodeUseError: string;

  // Action buttons
  refresh: string;
  refetchData: string; // Renombrado de dataRefresh
  getStarted: string;
  learnMore: string;

  // Security and Wallet (estas estaban en las traducciones pero no en la interfaz)
  militarySecurity: string;
  e2eEncryption: string;
  compatibleWallets: string;
  walletCompatibilityDesc: string;
  connectWalletTitle: string;
  connect: string;
  agreeToTerms: string;
  termsOfService: string;

  // Stats Cards (estas estaban en las traducciones pero no en la interfaz)
  nextTarget: string;
  progress: string;
  rewardAtNextLevel: string;
  need: string;
  more: string;
}

// Spanish translations
export const es: ReferralsTranslations = {
  // Add missing required properties
  referralsNeeded: "Referidos necesarios",
  noReferredUsers: "Sin usuarios referidos",
  fiveReferrals: "5 referidos",
  twentyReferrals: "20 referidos",
  fiftyReferrals: "50 referidos",
  referralsAvgInvestment: "Inversión promedio de referidos",
  blockchainVerified: "Verificado en blockchain",
  automaticDistribution: "Distribución automática",
  // Main title and description
  referralProgram: "Programa de Referidos",
  earnWhileFriendsEarn: "Gana mientras tus amigos ganan. Obtén el 1% de todos los beneficios que generen.",

  // Tabs
  myReferralCode: "Mi Código de Referido",
  useReferralCode: "Usar Código de Referido",
  referredUsers: "Usuarios Referidos",
  benefits: "Beneficios",

  // My Referral Code Section
  growTogether: "Crecer Juntos, Ganar Más",
  joinOurProgram: "Únete a nuestro programa de referidos y gana ingresos pasivos presentando tu red a las soluciones DeFi avanzadas de WayBank.",
  joinNow: "Únete Ahora",
  seeBenefits: "Ver Beneficios",
  shareYourCode: "Comparte tu código de referido",
  personalReferralCode: "Tu código personal de referido",
  copy: "Copiar",
  share: "Compartir",
  createReferralCode: "Crear Código de Referido",
  notAuthenticated: "Necesitas conectar tu billetera para generar tu código de referido único.",
  connectWallet: "Conectar Billetera",

  // Wallet security
  secureConnection: "Conexión Segura",
  encryptedConnections: "Todas las conexiones están encriptadas y auditadas",
  militarySecurity: "Seguridad de grado militar",
  e2eEncryption: "Conexiones cifradas E2E con los estándares criptográficos más altos. Las claves privadas nunca salen de tu dispositivo.",
  compatibleWallets: "Compatible con +170 billeteras",
  walletCompatibilityDesc: "MetaMask, Coinbase Wallet, Trust Wallet, Ledger, Trezor, Rainbow y muchas más billeteras compatibles.",
  connectWalletTitle: "Conectar Billetera",
  connect: "Conectar",
  agreeToTerms: "Al conectar tu billetera, aceptas nuestros",
  termsOfService: "Términos de Servicio",

  // Stats and rewards
  referralStats: "Estadísticas de Referidos",
  totalReferred: "Total Referidos",
  activeUsers: "Usuarios Activos",
  totalRewards: "Recompensas Totales",
  completionRate: "Tasa de Completación",
  activeProgram: "Programa activo",
  accumulatedEarnings: "Ganancias acumuladas",
  withdraw: "Retirar",
  withdrawing: "Retirando...",
  noRewardsAvailable: "No hay recompensas disponibles",
  noRewardsToWithdraw: "No tienes recompensas para retirar.",
  walletNotConnected: "Billetera no conectada",
  connectWalletToWithdraw: "Por favor conecta tu billetera para retirar recompensas.",
  withdrawalSuccessful: "Retiro exitoso",
  rewardsSentToWallet: "Tus recompensas han sido enviadas a tu billetera",
  withdrawalError: "Hubo un error al procesar tu retiro. Por favor, inténtalo de nuevo.",
  confirmWithdrawal: "Confirmar Retiro",
  confirmWithdrawalMessage: "Por favor confirma que deseas retirar tus recompensas a tu billetera conectada.",
  amountToWithdraw: "Cantidad a retirar",
  withdrawalCurrency: "Moneda",
  receivingWallet: "Billetera receptora",
  minimumBalanceNotMet: "Saldo mínimo no alcanzado",
  withdrawalMinimumBalance: "Necesitas un mínimo de 100 USDC para retirar. Tu saldo actual es",
  withdrawalNote: "Nota: Los fondos serán enviados a tu billetera conectada como tokens USDC.",
  cancel: "Cancelar",
  processing: "Procesando",
  confirmAndWithdraw: "Confirmar y Retirar",
  featureInDevelopment: "Funcionalidad en Desarrollo",
  withdrawalFeatureComingSoon: "La función de retiro está siendo implementada y estará disponible pronto.",
  withdrawalFailed: "Retiro Fallido",
  withdrawalProcessingError: "Hubo un error al procesar tu retiro",
  yourBenefit: "Tu Beneficio",
  ofAllReturns: "De todos los rendimientos",
  aprBoost: "Impulso APR",
  yourRank: "Tu Rango",
  nextRank: "Siguiente Rango",
  usersNeeded: "Necesitas {count} más para alcanzar {rank}",
  nextMilestone: "Próximo Hito",
  current: "Actual",

  // Ranks and rank titles
  yourReferralRank: "Tu Rango de Referidos",
  keepInvitingFriends: "Sigue invitando amigos para alcanzar rangos superiores y desbloquear más beneficios",
  rankBenefits: "Beneficios del Rango",
  unlockSpecialPerks: "Desbloquea ventajas especiales a medida que avanzas a través de los rangos",

  // Rank names
  Rookie: "Novato",
  Rabbit: "Conejo",
  Cat: "Gato",
  Dog: "Perro",
  Sentinel: "Centinela",
  Phoenix: "Fénix",
  Legend: "Leyenda",
  Champion: "Campeón",
  Advanced: "Avanzado",
  Elite: "Elite",

  // Rank benefits
  onePercentRewards: "1% de las recompensas de amigos",
  basicDashboardAccess: "Acceso básico al dashboard",
  standardSupport: "Soporte estándar",
  onePointFivePercentRewards: "1.5% de las recompensas de amigos",
  prioritySupport: "Soporte prioritario",
  exclusiveWebinars: "Webinars exclusivos",
  twoPercentRewards: "2% de las recompensas de amigos",
  vipSupport: "Soporte VIP",
  earlyAccess: "Acceso anticipado a nuevas funciones",

  // Rank progress section
  youNeed: "Necesitas",
  moreReferralsToAdvance: "más referidos para avanzar al siguiente rango",
  // Maximum rank messages
  congratsHighestRank: "¡Felicidades! Has alcanzado nuestro rango más alto.",
  enjoyChampionBenefits: "Disfruta de todos los beneficios exclusivos de ser un Campeón.",

  // Referred Users section
  loadingReferredUsers: "Cargando tus usuarios referidos...",
  startReferred: "Comparte tu código de referido para comenzar a obtener recompensas",
  inviteMoreFriends: "Invita a más amigos para avanzar al siguiente rango",
  seeAllRanks: "Ver Todos los Rangos",

  // Additional properties for "Use Code" section
  referralCodeDetected: "Código de referido detectado",
  referralCodeFound: "Hemos detectado un código de referido en el enlace que usaste para acceder a esta página.",
  using: "Usando...",
  useCode: "Usar este código",
  submitting: "Enviando...",

  // Use Referral Code Section
  useReferralCodeTitle: "Usa un código de referido",
  enterCode: "Ingresa el código de referido",
  submitCode: "Enviar Código",
  alreadyReferred: "Ya estás referido",
  referredBy: "Has sido referido por",
  referredByComplete: "Has sido referido por {address}",
  referralAprBoostMessage: "Impulso APR 1,0% Tus referidos obtienen un impulso del 1% de APR en todas sus posiciones con WayBank.",

  // Benefits Section
  referralBenefits: "Beneficios del Programa de Referidos",
  whenYouUseCode: "Cuando utilizas un código de referido",
  aprBoostDescription1: "Recibes un aumento del 1% en el APR de todas tus posiciones, maximizando tus rendimientos sin costos adicionales.",
  whenOthersUseCode: "Cuando otros usan tu código",
  passiveIncomeStream: "Generas un flujo de ingresos pasivos basado en las comisiones generadas por tus referidos.",

  // Referred Users Section
  referredUsersTitle: "Usuarios que has referido",
  inviteFriends: "Invita a tus amigos a unirse usando tu código de referido",
  referralCodeRequired: "Necesitas crear un código de referido primero",
  address: "Dirección",
  joinDate: "Fecha de Unión",
  status: "Estado",
  rewards: "Recompensas",
  active: "Activo",
  inactive: "Inactivo",

  // Stats Cards
  nextTarget: "Próxima Meta",
  progress: "Progreso",
  rewardAtNextLevel: "Recompensa en el siguiente nivel",
  need: "Necesitas",
  more: "más",

  // Benefits Section
  benefitsTitle: "Beneficios del Programa de Referidos",
  benefitsDescription: "Nuestro programa de referidos está diseñado para beneficiar tanto a ti como a las personas que refieres.",
  commissionRewards: "Recompensas por Comisión",
  commissionDescription: "Gana hasta un 4,5% de comisión sobre los rendimientos de tus referidos, pagados en USDC.",
  rankingSystem: "Sistema de Rangos",
  rankingDescription: "Progresa a través de nuestro sistema de rangos gamificado con niveles temáticos y recompensas crecientes.",
  aprBoostDescription: "Tus referidos obtienen un impulso del 1% de APR en todas sus posiciones con WayBank.",

  // Additional texts for the benefits section
  networkEffect: "Efecto de Red",
  noLimits: "Sin Límites",
  instantRewards: "Recompensas Instantáneas",
  winWinSystem: "Sistema Ganar-Ganar",
  noReferredUsersYet: "Aún no has referido a ningún usuario",
  earningsGrow: "Las ganancias crecen a medida que tus referidos invierten más",
  passiveIncomeContinues: "Los ingresos pasivos continúan mientras tus referidos permanezcan activos",
  noHiddenConditions: "Sin condiciones ocultas",
  secureTransparent: "Seguro y Transparente",

  // Rewards calculator
  rewardsCalculator: "Calculadora de Recompensas de Referidos",
  calculateEarnings: "Calcula tus ganancias potenciales de nuestro programa de referidos",
  numberOfReferrals: "Número de Referidos",
  averageInvestment: "Inversión Promedio",
  baseAPR: "APR Base",
  timeHorizon: "Horizonte Temporal",
  years: "años",
  year: "año",
  potentialEarnings: "Tus Ganancias Potenciales",
  totalOver: "Total en",
  with: "Con",
  referralsInvesting: "referidos invirtiendo",
  each: "cada uno",
  annualEarnings: "Ganancias Anuales",
  monthlyEarnings: "Ganancias Mensuales",
  commissionRate: "Tu Tasa de Comisión",
  rankGivesYou: "Tu rango te da una",
  commissionOnEarnings: "tasa de comisión sobre todas las ganancias generadas por tus referidos.",
  calculator: "Calculadora",
  earningScenarios: "Escenarios de Ganancias",
  updating: "Actualizando...",
  refetchData: "Actualizar datos",
  yourCommissionRate: "Tu Tasa de Comisión",
  perReferralAnnual: "Por Referido (Anual)",
  basedOn: "Basado en",
  at: "a",
  calculatorUsesRealAPR: "Esta calculadora usa el APR promedio real",
  fromAllActivePositions: "de todas las posiciones activas",
  basedOnPlatformAverage: "Basado en el monto promedio de inversión de la plataforma de",
  calculatedFrom: "calculado de",
  activePositionsWithLiquidity: "posiciones activas con liquidez",
  outOf: "de un total de",
  totalActivePositions: "posiciones activas totales",

  // Referral Levels
  referralLevels: "Niveles de Nuestro Programa de Referidos",
  progressThroughRanks: "Progresa a través de estos rangos exclusivos a medida que crece tu red de referidos.",
  referrals: "Referidos",

  // Success Stories
  successStoryTitle: "Historias de Éxito",
  successStoryDescription: "Usuarios reales compartiendo sus experiencias con nuestro programa de referidos",
  noLimitUsers: "Sin límite en cuántos usuarios puedes referir",
  averageEarnings: "Ganancias Promedio",
  perYearWithActive: "por año con 10 referidos activos",
  enterpriseInvestor: "Inversor Empresarial",
  cryptoEnthusiast: "Entusiasta de Crypto",
  financialAdvisor: "Asesor Financiero",
  referredUsers2: "Usuarios Referidos",
  totalEarned: "Total Ganado",
  yourSuccessStoryAwaits: "Tu Historia de Éxito te Espera",
  joinCommunity: "Únete a nuestra creciente comunidad de referidores exitosos. Crea tu código de referido hoy y comienza a construir tu flujo de ingresos pasivos.",

  // How It Works Section
  howItWorks: "Cómo Funciona",
  stepsToEarn: "3 pasos simples para comenzar a ganar",
  getYourCode: "Obtén tu código",
  codeAutoGenerated: "Tu código de referido se genera automáticamente",
  shareWithFriends: "Comparte con amigos",
  sendReferralLink: "Envía tu enlace de referido a amigos usando cualquier plataforma",
  earnRewards: "Gana recompensas",

  // Errors and messages
  success: "Éxito",
  error: "Error",
  copied: "¡Copiado!",
  copyToClipboard: "Copiar al portapapeles",
  copyReferralLink: "Copiar Mi Enlace de Referido",
  fullReferralCopied: "Enlace completo de referido copiado al portapapeles",
  errorCopying: "No se pudo copiar al portapapeles",
  shareText: "Únete a WayBank con mi enlace de referido y obtén un 1% extra de APR",
  errorSharing: "No se pudo compartir el enlace de referido",
  errorNotAuthenticated: "Necesitas conectar tu billetera y estar autenticado para usar un código de referido.",
  errorMissingWallet: "No se ha proporcionado dirección de wallet",
  errorMissingCode: "Por favor ingresa un código de referido válido",
  errorAuthentication: "Hubo un problema al iniciar sesión. Por favor, intenta de nuevo.",
  referralCodeCreated: "Código de referido creado",
  referralCodeSuccess: "Tu código de referido ha sido creado exitosamente",
  referralCodeError: "Hubo un error al crear tu código de referido",
  referralCodeUsed: "Has usado exitosamente un código de referido",
  referralCodeUseError: "Hubo un error al usar el código de referido",

  // Action buttons
  refresh: "Actualizar",
  getStarted: "Comenzar",
  learnMore: "Saber más"
};

// English translations
export const en: ReferralsTranslations = {
  // Título principal y descripción
  referralProgram: "Referral Program",
  earnWhileFriendsEarn: "Earn while your friends earn. Get 1% of all benefits they generate.",

  // Tabs
  myReferralCode: "My Referral Code",
  useReferralCode: "Use Referral Code",
  referredUsers: "Referred Users",
  benefits: "Benefits",

  // My Referral Code Section
  growTogether: "Grow Together, Earn More",
  joinOurProgram: "Join our referral program and earn passive income by introducing your network to WayBank's advanced DeFi solutions.",
  joinNow: "Join Now",
  seeBenefits: "See Benefits",
  shareYourCode: "Share your referral code",
  personalReferralCode: "Your personal referral code",
  copy: "Copy",
  share: "Share",
  createReferralCode: "Create Referral Code",
  notAuthenticated: "You need to connect your wallet to generate your unique referral code.",
  connectWallet: "Connect Wallet",

  // Wallet security
  secureConnection: "Secure Connection",
  encryptedConnections: "All connections are encrypted and audited",
  militarySecurity: "Military-grade security",
  e2eEncryption: "E2E encrypted connections using the highest cryptographic standards. Private keys never leave your device.",
  compatibleWallets: "Compatible with +170 wallets",
  walletCompatibilityDesc: "MetaMask, Coinbase Wallet, Trust Wallet, Ledger, Trezor, Rainbow and many more supported wallets.",
  connectWalletTitle: "Connect Wallet",
  connect: "Connect",
  agreeToTerms: "By connecting your wallet, you agree to our",
  termsOfService: "Terms of Service",

  // Stats and rewards
  referralStats: "Referral Statistics",
  totalReferred: "Total Referred",
  activeUsers: "Active Users",
  totalRewards: "Total Rewards",
  completionRate: "Completion Rate",
  activeProgram: "Active program",
  accumulatedEarnings: "Accumulated earnings",
  withdraw: "Withdraw",
  withdrawing: "Withdrawing...",
  noRewardsAvailable: "No Rewards Available",
  noRewardsToWithdraw: "You don't have any rewards to withdraw.",
  walletNotConnected: "Wallet Not Connected",
  connectWalletToWithdraw: "Please connect your wallet to withdraw rewards.",
  withdrawalSuccessful: "Withdrawal Successful",
  rewardsSentToWallet: "Your rewards have been sent to your wallet",
  withdrawalError: "There was an error processing your withdrawal. Please try again.",
  confirmWithdrawal: "Confirm Withdrawal",
  confirmWithdrawalMessage: "Please confirm that you want to withdraw your rewards to your connected wallet.",
  amountToWithdraw: "Amount to withdraw",
  withdrawalCurrency: "Currency",
  receivingWallet: "Receiving wallet",
  minimumBalanceNotMet: "Minimum Balance Not Met",
  withdrawalMinimumBalance: "You need a minimum of 100 USDC to withdraw. Your current balance is",
  withdrawalNote: "Note: Funds will be sent to your connected wallet as USDC tokens.",
  cancel: "Cancel",
  processing: "Processing",
  confirmAndWithdraw: "Confirm & Withdraw",
  featureInDevelopment: "Feature In Development",
  withdrawalFeatureComingSoon: "The withdrawal feature is being implemented and will be available soon.",
  withdrawalFailed: "Withdrawal Failed",
  withdrawalProcessingError: "There was an error processing your withdrawal",
  yourBenefit: "Your Benefit",
  ofAllReturns: "Of all returns",
  aprBoost: "APR Boost",
  yourRank: "Your Rank",
  nextRank: "Next Rank",
  usersNeeded: "Need {count} more to reach {rank}",
  nextMilestone: "Next Milestone",
  current: "Current",

  // Ranks and rank titles
  yourReferralRank: "Your Referral Rank",
  keepInvitingFriends: "Keep inviting friends to reach higher ranks and unlock more benefits",
  rankBenefits: "Rank Benefits",
  unlockSpecialPerks: "Unlock special perks as you progress through the ranks",

  // Rank names
  Rookie: "Rookie",
  Rabbit: "Rabbit",
  Cat: "Cat",
  Dog: "Dog",
  Sentinel: "Sentinel",
  Phoenix: "Phoenix",
  Legend: "Legend",
  Champion: "Champion",
  Advanced: "Advanced",
  Elite: "Elite",

  // Rank benefits
  onePercentRewards: "1% of friends' rewards",
  basicDashboardAccess: "Basic dashboard access",
  standardSupport: "Standard support",
  onePointFivePercentRewards: "1.5% of friends' rewards",
  prioritySupport: "Priority support",
  exclusiveWebinars: "Exclusive webinars",
  twoPercentRewards: "2% of friends' rewards",
  vipSupport: "VIP support",
  earlyAccess: "Early access to new features",

  // Rank progress section
  youNeed: "You need",
  moreReferralsToAdvance: "more referrals to advance to the next rank",

  // Maximum rank messages
  congratsHighestRank: "Congratulations! You have reached our highest rank.",
  enjoyChampionBenefits: "Enjoy all the exclusive benefits of being a Champion.",

  // Additional properties for "Use Code" section
  referralCodeDetected: "Referral code detected",
  referralCodeFound: "We have detected a referral code in the link you used to access this page.",
  using: "Using...",
  useCode: "Use this code",
  submitting: "Submitting...",

  // Use Referral Code Section
  useReferralCodeTitle: "Use a referral code",
  enterCode: "Enter the referral code",
  submitCode: "Submit Code",
  alreadyReferred: "You are already referred",
  referredBy: "You have been referred by",
  referredByComplete: "You have been referred by {address}",
  referralAprBoostMessage: "APR Boost 1.0% Your referrals receive a 1% APR boost on all their positions with WayBank.",

  // Referred Users Section
  referredUsersTitle: "Users you have referred",
  noReferredUsers: "You haven't referred any users yet",
  noReferredUsersYet: "You haven't referred any users yet",
  inviteFriends: "Invite your friends to join using your referral code",
  referralCodeRequired: "You need to create a referral code first",
  loadingReferredUsers: "Loading your referred users...",
  startReferred: "Share your referral code to start earning rewards",
  inviteMoreFriends: "Invite more friends to advance to the next rank",
  seeAllRanks: "See All Ranks",
  address: "Address",
  joinDate: "Join Date",
  status: "Status",
  rewards: "Rewards",
  active: "Active",
  inactive: "Inactive",

  // Stats Cards
  progress: "Progress",
  rewardAtNextLevel: "Reward at next level",
  need: "Need",
  more: "more",

  // Benefits Section
  benefitsTitle: "Referral Program Benefits",
  benefitsDescription: "Our referral program is designed to benefit both you and the people you refer.",
  commissionRewards: "Commission Rewards",
  commissionDescription: "Earn up to 4.5% commission on your referrals' yield earnings, paid in USDC.",
  rankingSystem: "Ranking System",
  rankingDescription: "Progress through our gamified ranking system with themed levels and increasing rewards.",
  aprBoostDescription: "Your referrals get a 1% APR boost on all their positions with WayBank.",

  // These keys are needed for the Referral Benefits card in referrals-page.tsx
  referralBenefits: "Referral Program Benefits",
  whenYouUseCode: "When you use a referral code",
  aprBoostDescription1: "You receive a 1% APR boost on all your positions, maximizing your returns at no additional cost.",
  whenOthersUseCode: "When others use your code",
  passiveIncomeStream: "You generate a passive income stream based on fees generated by your referrals.",
  networkEffect: "Network Effect",
  noLimits: "No Limits",
  instantRewards: "Instant Rewards",
  winWinSystem: "Win-Win System",
  earningsGrow: "Earnings grow as your referrals invest more",
  passiveIncomeContinues: "Passive income continues for as long as your referrals remain active",
  noHiddenConditions: "No hidden conditions",
  secureTransparent: "Secure & Transparent",

  // Rewards Calculator
  rewardsCalculator: "Referral Rewards Calculator",
  calculateEarnings: "Calculate your potential earnings from our referral program",
  numberOfReferrals: "Number of Referrals",
  averageInvestment: "Average Investment",
  baseAPR: "Base APR",
  timeHorizon: "Time Horizon",
  years: "years",
  year: "year",
  potentialEarnings: "Your Potential Earnings",
  totalOver: "Total Over",
  with: "With",
  referralsInvesting: "referrals investing",
  each: "each",
  annualEarnings: "Annual Earnings",
  monthlyEarnings: "Monthly Earnings",
  commissionRate: "Your Commission Rate",
  rankGivesYou: "Your rank gives you",
  commissionOnEarnings: "commission rate on all earnings generated by your referrals.",
  calculator: "Calculator",
  earningScenarios: "Earning Scenarios",
  updating: "Updating...",
  refetchData: "Refresh Data",
  yourCommissionRate: "Your Commission Rate",
  perReferralAnnual: "Per Referral (Annual)",
  basedOn: "Based on",
  at: "at",
  calculatorUsesRealAPR: "This calculator uses the real average APR",
  fromAllActivePositions: "from all active positions",
  basedOnPlatformAverage: "Based on the platform's average investment amount of",
  calculatedFrom: "calculated from",
  activePositionsWithLiquidity: "active positions with liquidity",
  outOf: "out of",
  totalActivePositions: "total active positions",

  // Referral Levels
  referralLevels: "Our Referral Program Levels",
  progressThroughRanks: "Progress through these exclusive ranks as your referral network grows.",
  referrals: "Referrals",

  // Success Stories
  successStoryTitle: "Success Stories",
  successStoryDescription: "Real users sharing their experiences with our referral program",
  noLimitUsers: "No limit to how many users you can refer",
  averageEarnings: "Average Earnings",
  perYearWithActive: "per year with 10 active referrals",
  enterpriseInvestor: "Enterprise Investor",
  cryptoEnthusiast: "Crypto Enthusiast",
  financialAdvisor: "Financial Advisor",
  referredUsers2: "Referred Users",
  totalEarned: "Total Earned",
  yourSuccessStoryAwaits: "Your Success Story Awaits",
  joinCommunity: "Join our growing community of successful referrers. Create your referral code today and start building your passive income stream.",

  // How It Works Section
  howItWorks: "How It Works",
  stepsToEarn: "3 simple steps to start earning",
  getYourCode: "Get your code",
  codeAutoGenerated: "Your referral code is automatically generated",
  shareWithFriends: "Share with friends",
  sendReferralLink: "Send your referral link to friends using any platform",
  earnRewards: "Earn rewards",

  // Errors and messages
  success: "Success",
  error: "Error",
  copied: "Copied!",
  copyToClipboard: "Copy to clipboard",
  copyReferralLink: "Copy My Referral Link",
  fullReferralCopied: "Full referral link copied to clipboard",
  errorCopying: "Could not copy to clipboard",
  shareText: "Join WayBank with my referral link and get an extra 1% APR",
  errorSharing: "Could not share the referral link",
  errorNotAuthenticated: "You need to connect your wallet and be authenticated to use a referral code.",
  errorMissingWallet: "No wallet address provided",
  errorMissingCode: "Please enter a valid referral code",
  errorAuthentication: "There was a problem logging in. Please try again.",
  referralCodeCreated: "Referral code created",
  referralCodeSuccess: "Your referral code has been created successfully",
  referralCodeError: "There was an error creating your referral code",
  referralCodeUsed: "You have successfully used a referral code",
  referralCodeUseError: "There was an error using the referral code",

  // Action buttons
  refresh: "Refresh",
  getStarted: "Get Started",
  learnMore: "Learn More"
};

// Portuguese translations
export const pt: ReferralsTranslations = {
  // Add missing required properties
  referralsNeeded: "Referências necessárias",
  noReferredUsers: "Nenhum usuário indicado",
  fiveReferrals: "5 referências",
  twentyReferrals: "20 referências",
  fiftyReferrals: "50 referências",
  referralsAvgInvestment: "Investimento médio de referências",
  blockchainVerified: "Verificado em blockchain",
  automaticDistribution: "Distribuição automática",
  // Main title and description
  referralProgram: "Programa de Indicação",
  earnWhileFriendsEarn: "Ganhe enquanto seus amigos ganham. Obtenha 1% de todos os benefícios que eles gerarem.",

  // Tabs
  myReferralCode: "Meu Código de Indicação",
  useReferralCode: "Usar Código de Indicação",
  referredUsers: "Usuários Indicados",
  benefits: "Benefícios",

  // My Referral Code Section
  growTogether: "Cresçam Juntos, Ganhem Mais",
  joinOurProgram: "Junte-se ao nosso programa de indicação e ganhe renda passiva apresentando sua rede às soluções DeFi avançadas da WayBank.",
  joinNow: "Junte-se Agora",
  seeBenefits: "Ver Benefícios",
  shareYourCode: "Compartilhe seu código de indicação",
  personalReferralCode: "Seu código pessoal de indicação",
  copy: "Copiar",
  share: "Compartilhar",
  createReferralCode: "Criar Código de Indicação",
  notAuthenticated: "Você precisa conectar sua carteira para gerar seu código de indicação exclusivo.",
  connectWallet: "Conectar Carteira",

  // Wallet security
  secureConnection: "Conexão Segura",
  encryptedConnections: "Todas as conexões são criptografadas e auditadas",
  militarySecurity: "Segurança de nível militar",
  e2eEncryption: "Conexões criptografadas de ponta a ponta usando os mais altos padrões criptográficos. Chaves privadas nunca saem do seu dispositivo.",
  compatibleWallets: "Compatível com +170 carteiras",
  walletCompatibilityDesc: "MetaMask, Coinbase Wallet, Trust Wallet, Ledger, Trezor, Rainbow e muitas outras carteiras suportadas.",
  connectWalletTitle: "Conectar Carteira",
  connect: "Conectar",
  agreeToTerms: "Ao conectar sua carteira, você concorda com nossos",
  termsOfService: "Termos de Serviço",

  // Stats and rewards
  referralStats: "Estatísticas de Indicação",
  totalReferred: "Total de Indicados",
  activeUsers: "Usuários Ativos",
  totalRewards: "Recompensas Totais",
  completionRate: "Taxa de Conclusão",
  activeProgram: "Programa ativo",
  accumulatedEarnings: "Ganhos acumulados",
  withdraw: "Retirar",
  withdrawing: "Retirando...",
  noRewardsAvailable: "Nenhuma Recompensa Disponível",
  noRewardsToWithdraw: "Você não tem nenhuma recompensa para retirar.",
  walletNotConnected: "Carteira Não Conectada",
  connectWalletToWithdraw: "Por favor, conecte sua carteira para retirar as recompensas.",
  withdrawalSuccessful: "Retirada Bem-sucedida",
  rewardsSentToWallet: "Suas recompensas foram enviadas para sua carteira",
  withdrawalError: "Ocorreu um erro ao processar sua retirada. Por favor, tente novamente.",
  confirmWithdrawal: "Confirmar Retirada",
  confirmWithdrawalMessage: "Por favor, confirme que você deseja retirar suas recompensas para sua carteira conectada.",
  amountToWithdraw: "Valor a retirar",
  withdrawalCurrency: "Moeda",
  receivingWallet: "Carteira de recebimento",
  minimumBalanceNotMet: "Saldo Mínimo Não Atingido",
  withdrawalMinimumBalance: "Você precisa de um mínimo de 100 USDC para retirar. Seu saldo atual é",
  withdrawalNote: "Nota: Os fundos serão enviados para sua carteira conectada como tokens USDC.",
  cancel: "Cancelar",
  processing: "Processando",
  confirmAndWithdraw: "Confirmar e Retirar",
  featureInDevelopment: "Funcionalidade em Desenvolvimento",
  withdrawalFeatureComingSoon: "O recurso de retirada está sendo implementado e estará disponível em breve.",
  withdrawalFailed: "Retirada Falhou",
  withdrawalProcessingError: "Ocorreu um erro ao processar sua retirada",
  yourBenefit: "Seu Benefício",
  ofAllReturns: "De todos os retornos",
  aprBoost: "Impulso APR",
  yourRank: "Sua Classificação",
  nextRank: "Próxima Classificação",
  usersNeeded: "Precisa de mais {count} para alcançar {rank}",
  nextMilestone: "Próximo Marco",
  current: "Atual",

  // Ranks and rank titles
  yourReferralRank: "Sua Classificação de Indicação",
  keepInvitingFriends: "Continue convidando amigos para alcançar classificações mais altas e desbloquear mais benefícios",
  rankBenefits: "Benefícios da Classificação",
  unlockSpecialPerks: "Desbloqueie vantagens especiais à medida que avança nas classificações",

  // Rank names
  Rookie: "Novato",
  Rabbit: "Coelho",
  Cat: "Gato",
  Dog: "Cão",
  Sentinel: "Sentinela",
  Phoenix: "Fênix",
  Legend: "Lenda",
  Champion: "Campeão",
  Advanced: "Avançado",
  Elite: "Elite",

  // Rank benefits
  onePercentRewards: "1% das recompensas dos amigos",
  basicDashboardAccess: "Acesso básico ao painel",
  standardSupport: "Suporte padrão",
  onePointFivePercentRewards: "1.5% das recompensas dos amigos",
  prioritySupport: "Suporte prioritário",
  exclusiveWebinars: "Webinars exclusivos",
  twoPercentRewards: "2% das recompensas dos amigos",
  vipSupport: "Suporte VIP",
  earlyAccess: "Acesso antecipado a novos recursos",

  // Rank progress section
  youNeed: "Você precisa",
  moreReferralsToAdvance: "mais indicações para avançar para a próxima classificação",

  // Maximum rank messages
  congratsHighestRank: "Parabéns! Você atingiu nossa classificação mais alta.",
  enjoyChampionBenefits: "Aproveite todos os benefícios exclusivos de ser um Campeão.",

  // Additional properties for "Use Code" section
  referralCodeDetected: "Código de indicação detectado",
  referralCodeFound: "Detectamos um código de indicação no link que você usou para acessar esta página.",
  using: "Usando...",
  useCode: "Usar este código",
  submitting: "Enviando...",

  // Use Referral Code Section
  useReferralCodeTitle: "Usar um código de indicação",
  enterCode: "Digite o código de indicação",
  submitCode: "Enviar Código",
  alreadyReferred: "Você já foi indicado",
  referredBy: "Você foi indicado por",
  referredByComplete: "Você foi indicado por {address}",
  referralAprBoostMessage: "Impulso APR 1,0% Suas indicações recebem um impulso de 1% no APR em todas as suas posições com WayBank.",

  // Benefits Section
  referralBenefits: "Benefícios do Programa de Indicação",
  whenYouUseCode: "Quando você usa um código de indicação",
  aprBoostDescription1: "Você recebe um aumento de 1% no APR em todas as suas posições, maximizando seus retornos sem custos adicionais.",
  whenOthersUseCode: "Quando outros usam seu código",
  passiveIncomeStream: "Você gera uma fonte de renda passiva com base nas comissões geradas por suas indicações.",

  // Referred Users Section
  referredUsersTitle: "Usuários que você indicou",
  inviteFriends: "Convide seus amigos para se juntarem usando seu código de indicação",
  referralCodeRequired: "Você precisa criar um código de indicação primeiro",
  address: "Endereço",
  joinDate: "Data de Adesão",
  status: "Status",
  rewards: "Recompensas",
  active: "Ativo",
  inactive: "Inativo",

  // Stats Cards
  nextTarget: "Próxima Meta",
  progress: "Progresso",
  rewardAtNextLevel: "Recompensa no próximo nível",
  need: "Precisa",
  more: "mais",

  // Benefits Section
  benefitsTitle: "Benefícios do Programa de Indicação",
  benefitsDescription: "Nosso programa de indicação foi projetado para beneficiar tanto você quanto as pessoas que você indica.",
  commissionRewards: "Recompensas por Comissão",
  commissionDescription: "Ganhe até 4,5% de comissão sobre os rendimentos de suas indicações, pagos em USDC.",
  rankingSystem: "Sistema de Classificação",
  rankingDescription: "Avance em nosso sistema de classificação gamificado com níveis temáticos e recompensas crescentes.",
  aprBoostDescription: "Suas indicações recebem um impulso de 1% no APR em todas as suas posições com WayBank.",

  // Additional texts for the benefits section
  networkEffect: "Efeito de Rede",
  noLimits: "Sem Limites",
  instantRewards: "Recompensas Instantâneas",
  winWinSystem: "Sistema Ganha-Ganha",
  noReferredUsersYet: "Você ainda não indicou nenhum usuário",
  earningsGrow: "Os ganhos crescem à medida que suas indicações investem mais",
  passiveIncomeContinues: "A renda passiva continua enquanto suas indicações permanecerem ativas",
  noHiddenConditions: "Sem condições ocultas",
  secureTransparent: "Seguro e Transparente",

  // Rewards calculator
  rewardsCalculator: "Calculadora de Recompensas de Indicação",
  calculateEarnings: "Calcule seus ganhos potenciais de nosso programa de indicação",
  numberOfReferrals: "Número de Indicações",
  averageInvestment: "Investimento Médio",
  baseAPR: "APR Base",
  timeHorizon: "Horizonte de Tempo",
  years: "anos",
  year: "ano",
  potentialEarnings: "Seus Ganhos Potenciais",
  totalOver: "Total em",
  with: "Com",
  referralsInvesting: "indicações investindo",
  each: "cada um",
  annualEarnings: "Ganhos Anuais",
  monthlyEarnings: "Ganhos Mensais",
  commissionRate: "Sua Taxa de Comissão",
  rankGivesYou: "Sua classificação lhe dá uma",
  commissionOnEarnings: "taxa de comissão sobre todos os ganhos gerados por suas indicações.",
  calculator: "Calculadora",
  earningScenarios: "Cenários de Ganhos",
  updating: "Atualizando...",
  refetchData: "Atualizar Dados",
  yourCommissionRate: "Sua Taxa de Comissão",
  perReferralAnnual: "Por Indicação (Anual)",
  basedOn: "Baseado em",
at: "em",
  calculatorUsesRealAPR: "Esta calculadora usa o APR médio real",
  fromAllActivePositions: "de todas as posições ativas",
  basedOnPlatformAverage: "Baseado no valor médio de investimento da plataforma de",
  calculatedFrom: "calculado de",
  activePositionsWithLiquidity: "posições ativas com liquidez",
  outOf: "de um total de",
  totalActivePositions: "posições ativas totais",

  // Referral Levels
  referralLevels: "Níveis do Nosso Programa de Indicação",
  progressThroughRanks: "Progrida através dessas classificações exclusivas à medida que sua rede de indicações cresce.",
  referrals: "Referências",

  // Success Stories
  successStoryTitle: "Histórias de Sucesso",
  successStoryDescription: "Usuários reais compartilhando suas experiências com nosso programa de indicação",
  noLimitUsers: "Sem limite de quantos usuários você pode indicar",
  averageEarnings: "Ganhos Médios",
  perYearWithActive: "por ano com 10 indicações ativas",
  enterpriseInvestor: "Investidor Empresarial",
  cryptoEnthusiast: "Entusiasta de Cripto",
  financialAdvisor: "Consultor Financeiro",
  referredUsers2: "Usuários Indicados",
  totalEarned: "Total Ganho",
  yourSuccessStoryAwaits: "Sua História de Sucesso Espera por Você",
  joinCommunity: "Junte-se à nossa crescente comunidade de indicadores de sucesso. Crie seu código de indicação hoje e comece a construir seu fluxo de renda passiva.",

  // How It Works Section
  howItWorks: "Como Funciona",
  stepsToEarn: "3 passos simples para começar a ganhar",
  getYourCode: "Obtenha seu código",
  codeAutoGenerated: "Seu código de indicação é gerado automaticamente",
  shareWithFriends: "Compartilhe com amigos",
  sendReferralLink: "Envie seu link de indicação para amigos usando qualquer plataforma",
  earnRewards: "Ganhe recompensas",

  // Errors and messages
  success: "Sucesso",
  error: "Erro",
  copied: "Copiado!",
  copyToClipboard: "Copiar para a área de transferência",
  copyReferralLink: "Copiar Meu Link de Indicação",
  fullReferralCopied: "Link de indicação completo copiado para a área de transferência",
  errorCopying: "Não foi possível copiar para a área de transferência",
  shareText: "Junte-se ao WayBank com meu link de indicação e obtenha um APR extra de 1%",
  errorSharing: "Não foi possível compartilhar o link de indicação",
  errorNotAuthenticated: "Você precisa conectar sua carteira e estar autenticado para usar um código de indicação.",
  errorMissingWallet: "Nenhum endereço de carteira fornecido",
  errorMissingCode: "Por favor, insira um código de indicação válido",
  errorAuthentication: "Ocorreu um problema ao fazer login. Por favor, tente novamente.",
  referralCodeCreated: "Código de indicação criado",
  referralCodeSuccess: "Seu código de indicação foi criado com sucesso",
  referralCodeError: "Ocorreu um erro ao criar seu código de indicação",
  referralCodeUsed: "Você usou um código de indicação com sucesso",
  referralCodeUseError: "Ocorreu um erro ao usar o código de indicação",

  // Action buttons
  refresh: "Atualizar",
  getStarted: "Começar",
  learnMore: "Saiba Mais"
};

// Italian translations
export const it: ReferralsTranslations = {
  // Add missing required properties
  referralsNeeded: "Referral necessari",
  noReferredUsers: "Nessun utente referenziato",
  fiveReferrals: "5 referral",
  twentyReferrals: "20 referral",
  fiftyReferrals: "50 referral",
  referralsAvgInvestment: "Investimento medio dei referral",
  blockchainVerified: "Verificato su blockchain",
  automaticDistribution: "Distribuzione automatica",
  // Main title and description
  referralProgram: "Programma di Referral",
  earnWhileFriendsEarn: "Guadagna mentre i tuoi amici guadagnano. Ottieni l'1% di tutti i benefici che generano.",

  // Tabs
  myReferralCode: "Il Mio Codice Referral",
  useReferralCode: "Usa Codice Referral",
  referredUsers: "Utenti Referenziati",
  benefits: "Benefici",

  // My Referral Code Section
  growTogether: "Crescere Insieme, Guadagnare di Più",
  joinOurProgram: "Unisciti al nostro programma di referral e guadagna un reddito passivo introducendo la tua rete alle soluzioni DeFi avanzate di WayBank.",
  joinNow: "Unisciti Ora",
  seeBenefits: "Vedi i Benefici",
  shareYourCode: "Condividi il tuo codice referral",
  personalReferralCode: "Il tuo codice referral personale",
  copy: "Copia",
  share: "Condividi",
  createReferralCode: "Crea Codice Referral",
  notAuthenticated: "Devi connettere il tuo wallet per generare il tuo codice referral unico.",
  connectWallet: "Connetti Wallet",

  // Wallet security
  secureConnection: "Connessione Sicura",
  encryptedConnections: "Tutte le connessioni sono crittografate e auditate",
  militarySecurity: "Sicurezza di livello militare",
  e2eEncryption: "Connessioni crittografate end-to-end utilizzando i più alti standard crittografici. Le chiavi private non lasciano mai il tuo dispositivo.",
  compatibleWallets: "Compatibile con +170 wallet",
  walletCompatibilityDesc: "MetaMask, Coinbase Wallet, Trust Wallet, Ledger, Trezor, Rainbow e molti altri wallet supportati.",
  connectWalletTitle: "Connetti Wallet",
  connect: "Connetti",
  agreeToTerms: "Connettendo il tuo wallet, accetti i nostri",
  termsOfService: "Termini di Servizio",

  // Stats and rewards
  referralStats: "Statistiche Referral",
  totalReferred: "Totale Referral",
  activeUsers: "Utenti Attivi",
  totalRewards: "Ricompense Totali",
  completionRate: "Tasso di Completamento",
  activeProgram: "Programma attivo",
  accumulatedEarnings: "Guadagni accumulati",
  withdraw: "Preleva",
  withdrawing: "Prelevando...",
  noRewardsAvailable: "Nessuna Ricompensa Disponibile",
  noRewardsToWithdraw: "Non hai ricompense da prelevare.",
  walletNotConnected: "Wallet Non Connesso",
  connectWalletToWithdraw: "Per favore connetti il tuo wallet per prelevare le ricompense.",
  withdrawalSuccessful: "Prelevamento Effettuato con Successo",
  rewardsSentToWallet: "Le tue ricompense sono state inviate al tuo wallet",
  withdrawalError: "Si è verificato un errore durante l'elaborazione del tuo prelievo. Per favore, riprova.",
  confirmWithdrawal: "Conferma Prelievo",
  confirmWithdrawalMessage: "Per favore conferma che desideri prelevare le tue ricompense al tuo wallet connesso.",
  amountToWithdraw: "Importo da prelevare",
  withdrawalCurrency: "Valuta",
  receivingWallet: "Wallet ricevente",
  minimumBalanceNotMet: "Saldo Minimo Non Raggiunto",
  withdrawalMinimumBalance: "Hai bisogno di un minimo di 100 USDC per prelevare. Il tuo saldo attuale è",
  withdrawalNote: "Nota: i fondi verranno inviati al tuo wallet connesso come token USDC.",
  cancel: "Annulla",
  processing: "Elaborazione",
  confirmAndWithdraw: "Conferma e Preleva",
  featureInDevelopment: "Funzionalità in Sviluppo",
  withdrawalFeatureComingSoon: "La funzione di prelievo è in fase di implementazione e sarà disponibile a breve.",
  withdrawalFailed: "Prelevamento Fallito",
  withdrawalProcessingError: "Si è verificato un errore durante l'elaborazione del tuo prelievo",
  yourBenefit: "Il Tuo Beneficio",
  ofAllReturns: "Di tutti i rendimenti",
  aprBoost: "Boost APR",
  yourRank: "Il Tuo Rango",
  nextRank: "Prossimo Rango",
  usersNeeded: "Servono {count} in più per raggiungere {rank}",
  nextMilestone: "Prossima Tappa",
  current: "Attuale",

  // Ranks and rank titles
  yourReferralRank: "Il Tuo Rango Referral",
  keepInvitingFriends: "Continua a invitare amici per raggiungere ranghi più alti e sbloccare più benefici",
  rankBenefits: "Benefici del Rango",
  unlockSpecialPerks: "Sblocca vantaggi speciali man mano che avanzi tra i ranghi",

  // Rank names
  Rookie: "Principiante",
  Rabbit: "Coniglio",
  Cat: "Gatto",
  Dog: "Cane",
  Sentinel: "Sentinella",
  Phoenix: "Fenice",
  Legend: "Leggenda",
  Champion: "Campione",
  Advanced: "Avanzato",
  Elite: "Elite",

  // Rank benefits
  onePercentRewards: "1% delle ricompense degli amici",
  basicDashboardAccess: "Accesso base alla dashboard",
  standardSupport: "Supporto standard",
  onePointFivePercentRewards: "1.5% delle ricompense degli amici",
  prioritySupport: "Supporto prioritario",
  exclusiveWebinars: "Webinar esclusivi",
  twoPercentRewards: "2% delle ricompense degli amici",
  vipSupport: "Supporto VIP",
  earlyAccess: "Accesso anticipato a nuove funzionalità",

  // Rank progress section
  youNeed: "Ti servono",
  moreReferralsToAdvance: "altri referral per avanzare al prossimo rango",

  // Maximum rank messages
  congratsHighestRank: "Congratulazioni! Hai raggiunto il nostro rango più alto.",
  enjoyChampionBenefits: "Goditi tutti i benefici esclusivi di essere un Campione.",

  // Additional properties for "Use Code" section
  referralCodeDetected: "Codice referral rilevato",
  referralCodeFound: "Abbiamo rilevato un codice referral nel link che hai usato per accedere a questa pagina.",
  using: "Utilizzo...",
  useCode: "Usa questo codice",
  submitting: "Invio...",

  // Use Referral Code Section
  useReferralCodeTitle: "Usa un codice referral",
  enterCode: "Inserisci il codice referral",
  submitCode: "Invia Codice",
  alreadyReferred: "Sei già referenziato",
  referredBy: "Sei stato referenziato da",
  referredByComplete: "Sei stato referenziato da {address}",
  referralAprBoostMessage: "Boost APR 1,0% I tuoi referral ricevono un boost APR dell'1% su tutte le loro posizioni con WayBank.",

  // Benefits Section
  referralBenefits: "Benefici del Programma Referral",
  whenYouUseCode: "Quando usi un codice referral",
  aprBoostDescription1: "Ricevi un aumento dell'1% dell'APR su tutte le tue posizioni, massimizzando i tuoi rendimenti senza costi aggiuntivi.",
  whenOthersUseCode: "Quando altri usano il tuo codice",
  passiveIncomeStream: "Generi un flusso di reddito passivo basato sulle commissioni generate dai tuoi referral.",

  // Referred Users Section
  referredUsersTitle: "Utenti che hai referenziato",
  inviteFriends: "Invita i tuoi amici a unirsi usando il tuo codice referral",
  referralCodeRequired: "Devi prima creare un codice referral",
  address: "Indirizzo",
  joinDate: "Data di Iscrizione",
  status: "Stato",
  rewards: "Ricompense",
  active: "Attivo",
  inactive: "Inattivo",

  // Stats Cards
  nextTarget: "Prossimo Obiettivo",
  progress: "Progresso",
  rewardAtNextLevel: "Ricompensa al prossimo livello",
  need: "Hai bisogno di",
  more: "altro",

  // Benefits Section
  benefitsTitle: "Benefici del Programma Referral",
  benefitsDescription: "Il nostro programma referral è progettato per avvantaggiare sia te che le persone che referenzi.",
  commissionRewards: "Ricompense in Commissione",
  commissionDescription: "Guadagna fino al 4,5% di commissione sui rendimenti dei tuoi referral, pagati in USDC.",
  rankingSystem: "Sistema di Ranking",
  rankingDescription: "Progredisci attraverso il nostro sistema di ranking gamificato con livelli a tema e ricompense crescenti.",
  aprBoostDescription: "I tuoi referral ottengono un boost APR dell'1% su tutte le loro posizioni con WayBank.",

  // Additional texts for the benefits section
  networkEffect: "Effetto Rete",
  noLimits: "Nessun Limite",
  instantRewards: "Ricompense Instantanee",
  winWinSystem: "Sistema Win-Win",
  noReferredUsersYet: "Non hai ancora referenziato nessun utente",
  earningsGrow: "I guadagni crescono man mano che i tuoi referral investono di più",
  passiveIncomeContinues: "Il reddito passivo continua finché i tuoi referral rimangono attivi",
  noHiddenConditions: "Nessuna condizione nascosta",
  secureTransparent: "Sicuro e Trasparente",

  // Rewards calculator
  rewardsCalculator: "Calcolatore Ricompense Referral",
  calculateEarnings: "Calcola i tuoi potenziali guadagni dal nostro programma referral",
  numberOfReferrals: "Numero di Referral",
  averageInvestment: "Investimento Medio",
  baseAPR: "APR Base",
  timeHorizon: "Orizzonte Temporale",
  years: "anni",
  year: "anno",
  potentialEarnings: "I Tuoi Guadagni Potenziali",
  totalOver: "Totale su",
  with: "Con",
  referralsInvesting: "referral che investono",
  each: "ciascuno",
  annualEarnings: "Guadagni Annuali",
  monthlyEarnings: "Guadagni Mensili",
  commissionRate: "La Tua Tassa di Commissione",
  rankGivesYou: "Il tuo rango ti dà una",
  commissionOnEarnings: "tassa di commissione su tutti i guadagni generati dai tuoi referral.",
  calculator: "Calcolatore",
  earningScenarios: "Scenari di Guadagno",
  updating: "Aggiornamento...",
  refetchData: "Aggiorna Dati",
  yourCommissionRate: "La Tua Tassa di Commissione",
  perReferralAnnual: "Per Referral (Annuale)",
  basedOn: "Basato su",
at: "a",
  calculatorUsesRealAPR: "Questo calcolatore utilizza l'APR medio reale",
  fromAllActivePositions: "da tutte le posizioni attive",
  basedOnPlatformAverage: "Basato sull'importo medio di investimento della piattaforma di",
  calculatedFrom: "calcolato da",
  activePositionsWithLiquidity: "posizioni attive con liquidità",
  outOf: "su un totale di",
  totalActivePositions: "posizioni attive totali",

  // Referral Levels
  referralLevels: "I Livelli del Nostro Programma Referral",
  progressThroughRanks: "Progredisci attraverso questi ranghi esclusivi man mano che la tua rete di referral cresce.",
  referrals: "Referral",

  // Success Stories
  successStoryTitle: "Storie di Successo",
  successStoryDescription: "Utenti reali che condividono le loro esperienze con il nostro programma referral",
  noLimitUsers: "Nessun limite al numero di utenti che puoi referenziare",
  averageEarnings: "Guadagni Medi",
  perYearWithActive: "all'anno con 10 referral attivi",
  enterpriseInvestor: "Investitore Aziendale",
  cryptoEnthusiast: "Appassionato di Cripto",
  financialAdvisor: "Consulente Finanziario",
  referredUsers2: "Utenti Referenziati",
  totalEarned: "Totale Guadagnato",
  yourSuccessStoryAwaits: "La Tua Storia di Successo Ti Aspetta",
  joinCommunity: "Unisciti alla nostra crescente comunità di referenti di successo. Crea il tuo codice referral oggi e inizia a costruire il tuo flusso di reddito passivo.",

  // How It Works Section
  howItWorks: "Come Funziona",
  stepsToEarn: "3 semplici passi per iniziare a guadagnare",
  getYourCode: "Ottieni il tuo codice",
  codeAutoGenerated: "Il tuo codice referral viene generato automaticamente",
  shareWithFriends: "Condividi con gli amici",
  sendReferralLink: "Invia il tuo link referral agli amici utilizzando qualsiasi piattaforma",
  earnRewards: "Guadagna ricompense",

  // Errors and messages
  success: "Successo",
  error: "Errore",
  copied: "Copiato!",
  copyToClipboard: "Copia negli appunti",
  copyReferralLink: "Copia il Mio Link Referral",
  fullReferralCopied: "Link referral completo copiato negli appunti",
  errorCopying: "Impossibile copiare negli appunti",
  shareText: "Unisciti a WayBank con il mio link referral e ottieni un 1% extra di APR",
  errorSharing: "Impossibile condividere il link referral",
  errorNotAuthenticated: "Devi connettere il tuo wallet ed essere autenticato per usare un codice referral.",
  errorMissingWallet: "Nessun indirizzo wallet fornito",
  errorMissingCode: "Per favore inserisci un codice referral valido",
  errorAuthentication: "Si è verificato un problema durante l'accesso. Per favore, riprova.",
  referralCodeCreated: "Codice referral creato",
  referralCodeSuccess: "Il tuo codice referral è stato creato con successo",
  referralCodeError: "Si è verificato un errore durante la creazione del tuo codice referral",
  referralCodeUsed: "Hai usato con successo un codice referral",
  referralCodeUseError: "Si è verificato un errore durante l'uso del codice referral",

  // Action buttons
  refresh: "Aggiorna",
  getStarted: "Inizia",
  learnMore: "Scopri di più"
};

// Chinese translations (Simplified Chinese)
export const zh: ReferralsTranslations = {
  // Add missing required properties
  referralsNeeded: "所需推荐数",
  noReferredUsers: "暂无推荐用户",
  fiveReferrals: "5 个推荐",
  twentyReferrals: "20 个推荐",
  fiftyReferrals: "50 个推荐",
  referralsAvgInvestment: "推荐用户平均投资",
  blockchainVerified: "区块链验证",
  automaticDistribution: "自动分发",
  // Main title and description
  referralProgram: "推荐计划",
  earnWhileFriendsEarn: "朋友赚，你跟着赚。获取他们产生的所有收益的 1%。",

  // Tabs
  myReferralCode: "我的推荐码",
  useReferralCode: "使用推荐码",
  referredUsers: "推荐用户",
  benefits: "福利",

  // My Referral Code Section
  growTogether: "共同成长，赚取更多",
  joinOurProgram: "加入我们的推荐计划，通过向您的网络介绍 WayBank 的高级 DeFi 解决方案来赚取被动收入。",
  joinNow: "立即加入",
  seeBenefits: "查看福利",
  shareYourCode: "分享您的推荐码",
  personalReferralCode: "您的个人推荐码",
  copy: "复制",
  share: "分享",
  createReferralCode: "创建推荐码",
  notAuthenticated: "您需要连接您的钱包才能生成您的专属推荐码。",
  connectWallet: "连接钱包",

  // Wallet security
  secureConnection: "安全连接",
  encryptedConnections: "所有连接都经过加密和审计",
  militarySecurity: "军事级安全",
  e2eEncryption: "使用最高加密标准进行端到端加密连接。私钥永不离开您的设备。",
  compatibleWallets: "兼容 +170 种钱包",
  walletCompatibilityDesc: "MetaMask、Coinbase Wallet、Trust Wallet、Ledger、Trezor、Rainbow 以及更多支持的钱包。",
  connectWalletTitle: "连接钱包",
  connect: "连接",
  agreeToTerms: "通过连接您的钱包，即表示您同意我们的",
  termsOfService: "服务条款",

  // Stats and rewards
  referralStats: "推荐统计",
  totalReferred: "总推荐数",
  activeUsers: "活跃用户",
  totalRewards: "总奖励",
  completionRate: "完成率",
  activeProgram: "活跃计划",
  accumulatedEarnings: "累计收益",
  withdraw: "提现",
  withdrawing: "提现中...",
  noRewardsAvailable: "无可用奖励",
  noRewardsToWithdraw: "您没有任何可提现的奖励。",
  walletNotConnected: "钱包未连接",
  connectWalletToWithdraw: "请连接您的钱包以提现奖励。",
  withdrawalSuccessful: "提现成功",
  rewardsSentToWallet: "您的奖励已发送至您的钱包",
  withdrawalError: "处理您的提现时出错。请重试。",
  confirmWithdrawal: "确认提现",
  confirmWithdrawalMessage: "请确认您希望将奖励提现至已连接的钱包。",
  amountToWithdraw: "提现金额",
  withdrawalCurrency: "货币",
  receivingWallet: "接收钱包",
  minimumBalanceNotMet: "未达到最低余额",
  withdrawalMinimumBalance: "您需要至少 100 USDC 才能提现。您当前的余额为",
  withdrawalNote: "注意：资金将作为 USDC 代币发送到您已连接的钱包。",
  cancel: "取消",
  processing: "处理中",
  confirmAndWithdraw: "确认并提现",
  featureInDevelopment: "功能开发中",
  withdrawalFeatureComingSoon: "提现功能正在开发中，即将推出。",
  withdrawalFailed: "提现失败",
  withdrawalProcessingError: "处理您的提现时出错",
  yourBenefit: "您的福利",
  ofAllReturns: "所有收益的",
  aprBoost: "APR 提升",
  yourRank: "您的等级",
  nextRank: "下一等级",
  usersNeeded: "还需要 {count} 个推荐才能达到 {rank}",
  nextMilestone: "下一里程碑",
  current: "当前",

  // Ranks and rank titles
  yourReferralRank: "您的推荐等级",
  keepInvitingFriends: "继续邀请朋友以达到更高等级并解锁更多福利",
  rankBenefits: "等级福利",
  unlockSpecialPerks: "随着您在等级中晋升，解锁特殊福利",

  // Rank names
  Rookie: "新秀",
  Rabbit: "兔子",
  Cat: "猫",
  Dog: "狗",
  Sentinel: "哨兵",
  Phoenix: "凤凰",
  Legend: "传奇",
  Champion: "冠军",
  Advanced: "高级",
  Elite: "精英",

  // Rank benefits
  onePercentRewards: "朋友奖励的 1%",
  basicDashboardAccess: "基本仪表板访问权限",
  standardSupport: "标准支持",
  onePointFivePercentRewards: "朋友奖励的 1.5%",
  prioritySupport: "优先支持",
  exclusiveWebinars: "独家网络研讨会",
  twoPercentRewards: "朋友奖励的 2%",
  vipSupport: "VIP 支持",
  earlyAccess: "新功能抢先体验",

  // Rank progress section
  youNeed: "您还需要",
  moreReferralsToAdvance: "个推荐才能晋升到下一等级",

  // Maximum rank messages
  congratsHighestRank: "恭喜！您已达到最高等级。",
  enjoyChampionBenefits: "享受作为冠军的所有专属福利。",

  // Additional properties for "Use Code" section
  referralCodeDetected: "检测到推荐码",
  referralCodeFound: "我们已在您用于访问此页面的链接中检测到推荐码。",
  using: "使用中...",
  useCode: "使用此代码",
  submitting: "提交中...",

  // Use Referral Code Section
  useReferralCodeTitle: "使用推荐码",
  enterCode: "输入推荐码",
  submitCode: "提交代码",
  alreadyReferred: "您已被推荐",
  referredBy: "您已被推荐人",
  referredByComplete: "您已被 {address} 推荐",
  referralAprBoostMessage: "APR 提升 1.0% 您的推荐用户在 WayBank 中的所有头寸都将获得 1% 的 APR 提升。",

  // Benefits Section
  referralBenefits: "推荐计划福利",
  whenYouUseCode: "当您使用推荐码时",
  aprBoostDescription1: "您在所有头寸上都将获得 1% 的 APR 提升，以零额外成本最大化您的收益。",
  whenOthersUseCode: "当其他人使用您的代码时",
  passiveIncomeStream: "您将根据推荐用户产生的费用获得被动收入流。",

  // Referred Users Section
  referredUsersTitle: "您已推荐的用户",
  inviteFriends: "邀请您的朋友使用您的推荐码加入",
  referralCodeRequired: "您需要先创建一个推荐码",
  address: "地址",
  joinDate: "加入日期",
  status: "状态",
  rewards: "奖励",
  active: "活跃",
  inactive: "不活跃",

  // Stats Cards
  nextTarget: "下一个目标",
  progress: "进度",
  rewardAtNextLevel: "下一等级奖励",
  need: "需要",
  more: "更多",

  // Benefits Section
  benefitsTitle: "推荐计划福利",
  benefitsDescription: "我们的推荐计划旨在为您和您推荐的人带来好处。",
  commissionRewards: "佣金奖励",
  commissionDescription: "根据您的推荐用户的收益赚取高达 4.5% 的佣金，以 USDC 支付。",
  rankingSystem: "排名系统",
  rankingDescription: "通过我们的游戏化排名系统晋升，享受主题级别和不断增加的奖励。",
  aprBoostDescription: "您的推荐用户在 WayBank 中的所有头寸都将获得 1% 的 APR 提升。",

  // Additional texts for the benefits section
  networkEffect: "网络效应",
  noLimits: "无限制",
  instantRewards: "即时奖励",
  winWinSystem: "双赢系统",
  noReferredUsersYet: "您还没有推荐任何用户",
  earningsGrow: "随着推荐用户投资更多，收益会增长",
  passiveIncomeContinues: "只要您的推荐用户保持活跃，被动收入就会持续",
  noHiddenConditions: "无隐藏条件",
  secureTransparent: "安全透明",

  // Rewards calculator
  rewardsCalculator: "推荐奖励计算器",
  calculateEarnings: "计算您通过推荐计划可能获得的收益",
  numberOfReferrals: "推荐人数",
  averageInvestment: "平均投资",
  baseAPR: "基础 APR",
  timeHorizon: "时间范围",
  years: "年",
  year: "年",
  potentialEarnings: "您的潜在收益",
  totalOver: "总计",
  with: "包含",
  referralsInvesting: "个推荐用户投资",
  each: "每个",
  annualEarnings: "年收益",
  monthlyEarnings: "月收益",
  commissionRate: "您的佣金率",
  rankGivesYou: "您的等级为您提供",
  commissionOnEarnings: "所有由您的推荐用户产生的收益的佣金率。",
  calculator: "计算器",
  earningScenarios: "收益情景",
  updating: "更新中...",
  refetchData: "刷新数据",
  yourCommissionRate: "您的佣金率",
  perReferralAnnual: "每个推荐用户（每年）",
  basedOn: "基于",
  at: "在",
  calculatorUsesRealAPR: "此计算器使用实际平均 APR",
  fromAllActivePositions: "来自所有活跃头寸",
  basedOnPlatformAverage: "基于平台平均投资金额",
  calculatedFrom: "计算自",
  activePositionsWithLiquidity: "活跃头寸（含流动性）",
  outOf: "总计",
  totalActivePositions: "活跃头寸总数",

  // Referral Levels
  referralLevels: "我们的推荐计划等级",
  progressThroughRanks: "随着您的推荐网络增长，通过这些专属等级晋升。",
  referrals: "推荐",

  // Success Stories
  successStoryTitle: "成功案例",
  successStoryDescription: "真实用户分享他们参与推荐计划的经验",
  noLimitUsers: "推荐用户数量无限制",
  averageEarnings: "平均收益",
  perYearWithActive: "每年拥有 10 个活跃推荐用户",
  enterpriseInvestor: "企业投资者",
  cryptoEnthusiast: "加密货币爱好者",
  financialAdvisor: "财务顾问",
  referredUsers2: "推荐用户",
  totalEarned: "总赚取",
  yourSuccessStoryAwaits: "您的成功故事等待书写",
  joinCommunity: "加入我们不断壮大的成功推荐者社区。立即创建您的推荐码，开始建立您的被动收入流。",

  // How It Works Section
  howItWorks: "工作原理",
  stepsToEarn: "3 个简单步骤即可开始赚取收益",
  getYourCode: "获取您的代码",
  codeAutoGenerated: "您的推荐码将自动生成",
  shareWithFriends: "与朋友分享",
  sendReferralLink: "使用任何平台将您的推荐链接发送给朋友",
  earnRewards: "赚取奖励",

  // Errors and messages
  success: "成功",
  error: "错误",
  copied: "已复制！",
  copyToClipboard: "复制到剪贴板",
  copyReferralLink: "复制我的推荐链接",
  fullReferralCopied: "完整推荐链接已复制到剪贴板",
  errorCopying: "无法复制到剪贴板",
  shareText: "使用我的推荐链接加入 WayBank，即可获得额外 1% 的 APR",
  errorSharing: "无法分享推荐链接",
  errorNotAuthenticated: "您需要连接您的钱包并进行身份验证才能使用推荐码。",
  errorMissingWallet: "未提供钱包地址",
  errorMissingCode: "请输入有效的推荐码",
  errorAuthentication: "登录时出现问题。请重试。",
  referralCodeCreated: "推荐码已创建",
  referralCodeSuccess: "您的推荐码已成功创建",
  referralCodeError: "创建推荐码时出错",
  referralCodeUsed: "您已成功使用推荐码",
  referralCodeUseError: "使用推荐码时出错",

  // Action buttons
  refresh: "刷新",
  getStarted: "开始",
  learnMore: "了解更多"
};

// Hindi translations
export const hi: ReferralsTranslations = {
  // Add missing required properties
  referralsNeeded: "रेफरल आवश्यक हैं",
  noReferredUsers: "कोई संदर्भित उपयोगकर्ता नहीं",
  fiveReferrals: "5 रेफरल",
  twentyReferrals: "20 रेफरल",
  fiftyReferrals: "50 रेफरल",
  referralsAvgInvestment: "रेफरल का औसत निवेश",
  blockchainVerified: "ब्लॉकचेन सत्यापित",
  automaticDistribution: "स्वचालित वितरण",
  // Main title and description
  referralProgram: "रेफरल कार्यक्रम",
  earnWhileFriendsEarn: "जब आपके दोस्त कमाते हैं तो आप कमाते हैं। उनके द्वारा उत्पन्न सभी लाभों का 1% प्राप्त करें।",

  // Tabs
  myReferralCode: "मेरा रेफरल कोड",
  useReferralCode: "रेफरल कोड का उपयोग करें",
  referredUsers: "संदर्भित उपयोगकर्ता",
  benefits: "लाभ",

  // My Referral Code Section
  growTogether: "एक साथ बढ़ें, अधिक कमाएं",
  joinOurProgram: "हमारे रेफरल कार्यक्रम में शामिल हों और वेपूल के उन्नत डेफी समाधानों के लिए अपने नेटवर्क का परिचय देकर निष्क्रिय आय अर्जित करें।",
  joinNow: "अभी शामिल हों",
  seeBenefits: "लाभ देखें",
  shareYourCode: "अपना रेफरल कोड साझा करें",
  personalReferralCode: "आपका व्यक्तिगत रेफरल कोड",
  copy: "कॉपी करें",
  share: "साझा करें",
  createReferralCode: "रेफरल कोड बनाएं",
  notAuthenticated: "आपको अपना अद्वितीय रेफरल कोड उत्पन्न करने के लिए अपना वॉलेट कनेक्ट करना होगा।",
  connectWallet: "वॉलेट कनेक्ट करें",

  // Wallet security
  secureConnection: "सुरक्षित कनेक्शन",
  encryptedConnections: "सभी कनेक्शन एन्क्रिप्टेड और ऑडिट किए गए हैं",
  militarySecurity: "सैन्य-ग्रेड सुरक्षा",
  e2eEncryption: "उच्चतम क्रिप्टोग्राफिक मानकों का उपयोग करके E2E एन्क्रिप्टेड कनेक्शन। निजी कुंजी कभी भी आपके डिवाइस को नहीं छोड़ते हैं।",
  compatibleWallets: "+170 वॉलेट के साथ संगत",
  walletCompatibilityDesc: "मेटामास्क, कॉइनबेस वॉलेट, ट्रस्ट वॉलेट, लेजर, ट्रेज़ोर, रेनबो और कई अन्य समर्थित वॉलेट।",
  connectWalletTitle: "वॉलेट कनेक्ट करें",
  connect: "कनेक्ट करें",
  agreeToTerms: "अपना वॉलेट कनेक्ट करके, आप हमारे",
  termsOfService: "सेवा की शर्तों",
  // Stats and rewards
  referralStats: "रेफरल सांख्यिकी",
  totalReferred: "कुल संदर्भित",
  activeUsers: "सक्रिय उपयोगकर्ता",
  totalRewards: "कुल पुरस्कार",
  completionRate: "पूर्णता दर",
  activeProgram: "सक्रिय कार्यक्रम",
  accumulatedEarnings: "संचित कमाई",
  withdraw: "निकालें",
  withdrawing: "निकाला जा रहा है...",
  noRewardsAvailable: "कोई पुरस्कार उपलब्ध नहीं",
  noRewardsToWithdraw: "आपके पास निकालने के लिए कोई पुरस्कार नहीं है।",
  walletNotConnected: "वॉलेट कनेक्ट नहीं है",
  connectWalletToWithdraw: "पुरस्कार निकालने के लिए कृपया अपना वॉलेट कनेक्ट करें।",
  withdrawalSuccessful: "निकासी सफल",
  rewardsSentToWallet: "आपके पुरस्कार आपके वॉलेट में भेज दिए गए हैं",
  withdrawalError: "आपकी निकासी को संसाधित करने में एक त्रुटि थी। कृपया पुनः प्रयास करें।",
  confirmWithdrawal: "निकासी की पुष्टि करें",
  confirmWithdrawalMessage: "कृपया पुष्टि करें कि आप अपने पुरस्कारों को अपने कनेक्टेड वॉलेट में निकालना चाहते हैं।",
  amountToWithdraw: "निकासी की राशि",
  withdrawalCurrency: "मुद्रा",
  receivingWallet: "प्राप्तकर्ता वॉलेट",
  minimumBalanceNotMet: "न्यूनतम शेष राशि पूरी नहीं हुई",
  withdrawalMinimumBalance: "आपको निकालने के लिए कम से कम 100 USDC की आवश्यकता है। आपकी वर्तमान शेष राशि है",
  withdrawalNote: "नोट: फंड आपके कनेक्टेड वॉलेट में USDC टोकन के रूप में भेजे जाएंगे।",
  cancel: "रद्द करें",
  processing: "प्रसंस्करण",
  confirmAndWithdraw: "पुष्टि करें और निकालें",
  featureInDevelopment: "सुविधा विकास में",
  withdrawalFeatureComingSoon: "निकासी सुविधा लागू की जा रही है और जल्द ही उपलब्ध होगी।",
  withdrawalFailed: "निकासी विफल",
  withdrawalProcessingError: "आपकी निकासी को संसाधित करने में एक त्रुटि थी",
  yourBenefit: "आपका लाभ",
  ofAllReturns: "सभी रिटर्न का",
  aprBoost: "APR बूस्ट",
  yourRank: "आपकी रैंक",
  nextRank: "अगली रैंक",
  usersNeeded: "{rank} तक पहुँचने के लिए {count} और की आवश्यकता है",
  nextMilestone: "अगला मील का पत्थर",
  current: "वर्तमान",

  // Ranks and rank titles
  yourReferralRank: "आपकी रेफरल रैंक",
  keepInvitingFriends: "उच्च रैंक तक पहुंचने और अधिक लाभ अनलॉक करने के लिए दोस्तों को आमंत्रित करते रहें",
  rankBenefits: "रैंक लाभ",
  unlockSpecialPerks: "जैसे-जैसे आप रैंकों के माध्यम से आगे बढ़ते हैं, विशेष भत्तों को अनलॉक करें",

  // Rank names
  Rookie: "रूकी",
  Rabbit: "खरगोश",
  Cat: "बिल्ली",
  Dog: "कुत्ता",
  Sentinel: "सेंटिनल",
  Phoenix: "फीनिक्स",
  Legend: "किंवदंती",
  Champion: "चैंपियन",
  Advanced: "उन्नत",
  Elite: "कुलीन",

  // Rank benefits
  onePercentRewards: "दोस्तों के पुरस्कारों का 1%",
  basicDashboardAccess: "मूल डैशबोर्ड एक्सेस",
  standardSupport: "मानक समर्थन",
  onePointFivePercentRewards: "दोस्तों के पुरस्कारों का 1.5%",
  prioritySupport: "प्राथमिकता समर्थन",
  exclusiveWebinars: "विशेष वेबिनार",
  twoPercentRewards: "दोस्तों के पुरस्कारों का 2%",
  vipSupport: "वीआईपी समर्थन",
  earlyAccess: "नई सुविधाओं तक शीघ्र पहुंच",

  // Rank progress section
  youNeed: "आपको आवश्यकता है",
  moreReferralsToAdvance: "अगली रैंक तक आगे बढ़ने के लिए अधिक रेफरल",

  // Maximum rank messages
  congratsHighestRank: "बधाई हो! आप हमारी सर्वोच्च रैंक तक पहुंच गए हैं।",
  enjoyChampionBenefits: "एक चैंपियन होने के सभी विशेष लाभों का आनंद लें।",

  // Additional properties for "Use Code" section
  referralCodeDetected: "रेफरल कोड का पता चला",
  referralCodeFound: "हमने उस लिंक में एक रेफरल कोड का पता लगाया है जिसका उपयोग आपने इस पृष्ठ तक पहुंचने के लिए किया था।",
  using: "उपयोग कर रहा है...",
  useCode: "इस कोड का उपयोग करें",
  submitting: "सबमिट कर रहा है...",

  // Use Referral Code Section
  useReferralCodeTitle: "रेफरल कोड का उपयोग करें",
  enterCode: "रेफरल कोड दर्ज करें",
  submitCode: "कोड सबमिट करें",
  alreadyReferred: "आप पहले से ही संदर्भित हैं",
  referredBy: "आपको संदर्भित किया गया है",
  referredByComplete: "आपको {address} द्वारा संदर्भित किया गया है",
  referralAprBoostMessage: "APR बूस्ट 1.0% आपके रेफरल को वेपूल के साथ अपनी सभी पोजीशनों पर 1% APR बूस्ट प्राप्त होता है।",

  // Benefits Section
  referralBenefits: "रेफरल कार्यक्रम के लाभ",
  whenYouUseCode: "जब आप रेफरल कोड का उपयोग करते हैं",
  aprBoostDescription1: "आपको अपनी सभी पोजीशनों पर 1% APR बूस्ट प्राप्त होता है, जिससे बिना किसी अतिरिक्त लागत के आपकी रिटर्न अधिकतम हो जाती है।",
  whenOthersUseCode: "जब दूसरे आपके कोड का उपयोग करते हैं",
  passiveIncomeStream: "आप अपने रेफरल द्वारा उत्पन्न शुल्कों के आधार पर एक निष्क्रिय आय स्ट्रीम उत्पन्न करते हैं।",

  // Referred Users Section
  referredUsersTitle: "आपके द्वारा संदर्भित उपयोगकर्ता",
  inviteFriends: "अपने रेफरल कोड का उपयोग करके अपने दोस्तों को शामिल होने के लिए आमंत्रित करें",
  referralCodeRequired: "आपको पहले एक रेफरल कोड बनाना होगा",
  address: "पता",
  joinDate: "शामिल होने की तिथि",
  status: "स्थिति",
  rewards: "पुरस्कार",
  active: "सक्रिय",
  inactive: "निष्क्रिय",

  // Stats Cards
  nextTarget: "अगला लक्ष्य",
  progress: "प्रगति",
  rewardAtNextLevel: "अगले स्तर पर पुरस्कार",
  need: "आवश्यकता",
  more: "अधिक",

  // Benefits Section
  benefitsTitle: "रेफरल कार्यक्रम के लाभ",
  benefitsDescription: "हमारा रेफरल कार्यक्रम आपको और आपके द्वारा संदर्भित लोगों दोनों को लाभान्वित करने के लिए डिज़ाइन किया गया है।",
  commissionRewards: "कमीशन पुरस्कार",
  commissionDescription: "अपने रेफरल की उपज कमाई पर 4.5% तक कमीशन अर्जित करें, USDC में भुगतान किया गया।",
  rankingSystem: "रैंकिंग सिस्टम",
  rankingDescription: "थीम वाले स्तरों और बढ़ते पुरस्कारों के साथ हमारे गेमिफाइड रैंकिंग सिस्टम के माध्यम से प्रगति करें।",
  aprBoostDescription: "आपके रेफरल को वेपूल के साथ अपनी सभी पोजीशनों पर 1% APR बूस्ट प्राप्त होता है।",

  // Additional texts for the benefits section
  networkEffect: "नेटवर्क प्रभाव",
  noLimits: "कोई सीमा नहीं",
  instantRewards: "तत्काल पुरस्कार",
  winWinSystem: "जीत-जीत प्रणाली",
  noReferredUsersYet: "आपने अभी तक कोई उपयोगकर्ता संदर्भित नहीं किया है",
  earningsGrow: "जैसे-जैसे आपके रेफरल अधिक निवेश करते हैं, कमाई बढ़ती जाती है",
  passiveIncomeContinues: "निष्क्रिय आय तब तक जारी रहती है जब तक आपके रेफरल सक्रिय रहते हैं",
  noHiddenConditions: "कोई छिपी हुई शर्तें नहीं",
  secureTransparent: "सुरक्षित और पारदर्शी",

  // Rewards calculator
  rewardsCalculator: "रेफरल पुरस्कार कैलकुलेटर",
  calculateEarnings: "हमारे रेफरल कार्यक्रम से अपनी संभावित कमाई की गणना करें",
  numberOfReferrals: "रेफरल की संख्या",
  averageInvestment: "औसत निवेश",
  baseAPR: "आधार APR",
  timeHorizon: "समय क्षितिज",
  years: "वर्ष",
  year: "वर्ष",
  potentialEarnings: "आपकी संभावित कमाई",
  totalOver: "कुल मिलाकर",
  with: "के साथ",
  referralsInvesting: "रेफरल निवेश",
  each: "प्रत्येक",
  annualEarnings: "वार्षिक कमाई",
  monthlyEarnings: "मासिक कमाई",
  commissionRate: "आपकी कमीशन दर",
  rankGivesYou: "आपकी रैंक आपको देती है",
  commissionOnEarnings: "आपके रेफरल द्वारा उत्पन्न सभी कमाई पर कमीशन दर।",
  calculator: "कैलकुलेटर",
  earningScenarios: "कमाई के परिदृश्य",
  updating: "अपडेट कर रहा है...",
  refetchData: "डेटा रीफ्रेश करें",
  yourCommissionRate: "आपकी कमीशन दर",
  perReferralAnnual: "प्रति रेफरल (वार्षिक)",
  basedOn: "के आधार पर",
  at: "पर",
  calculatorUsesRealAPR: "यह कैलकुलेटर वास्तविक औसत APR का उपयोग करता है",
  fromAllActivePositions: "सभी सक्रिय पोजीशन से",
  basedOnPlatformAverage: "प्लेटफॉर्म के औसत निवेश राशि के आधार पर",
  calculatedFrom: "से गणना की गई",
  activePositionsWithLiquidity: "लिक्विडिटी के साथ सक्रिय पोजीशन",
  outOf: "कुल में से",
  totalActivePositions: "कुल सक्रिय पोजीशन",

  // Referral Levels
  referralLevels: "हमारे रेफरल कार्यक्रम के स्तर",
  progressThroughRanks: "जैसे-जैसे आपका रेफरल नेटवर्क बढ़ता है, इन विशेष रैंकों के माध्यम से प्रगति करें।",
  referrals: "रेफरल",

  // Success Stories
  successStoryTitle: "सफलता की कहानियां",
  successStoryDescription: "वास्तविक उपयोगकर्ता हमारे रेफरल कार्यक्रम के साथ अपने अनुभव साझा कर रहे हैं",
  noLimitUsers: "आप जितने उपयोगकर्ताओं को संदर्भित कर सकते हैं उसकी कोई सीमा नहीं है",
  averageEarnings: "औसत कमाई",
  perYearWithActive: "10 सक्रिय रेफरल के साथ प्रति वर्ष",
  enterpriseInvestor: "एंटरप्राइज इन्वेस्टर",
  cryptoEnthusiast: "क्रिप्टो उत्साही",
  financialAdvisor: "वित्तीय सलाहकार",
  referredUsers2: "संदर्भित उपयोगकर्ता",
  totalEarned: "कुल अर्जित",
  yourSuccessStoryAwaits: "आपकी सफलता की कहानी आपका इंतजार कर रही है",
  joinCommunity: "सफल रेफरलर्स के हमारे बढ़ते समुदाय में शामिल हों। आज ही अपना रेफरल कोड बनाएं और अपनी निष्क्रिय आय स्ट्रीम बनाना शुरू करें।",

  // How It Works Section
  howItWorks: "यह कैसे काम करता है",
  stepsToEarn: "कमाना शुरू करने के लिए 3 सरल कदम",
  getYourCode: "अपना कोड प्राप्त करें",
  codeAutoGenerated: "आपका रेफरल कोड स्वचालित रूप से उत्पन्न होता है",
  shareWithFriends: "दोस्तों के साथ साझा करें",
  sendReferralLink: "किसी भी प्लेटफॉर्म का उपयोग करके अपने रेफरल लिंक को दोस्तों को भेजें",
  earnRewards: "पुरस्कार अर्जित करें",

  // Errors and messages
  success: "सफलता",
  error: "त्रुटि",
  copied: "कॉपी किया गया!",
  copyToClipboard: "क्लिपबोर्ड पर कॉपी करें",
  copyReferralLink: "मेरा रेफरल लिंक कॉपी करें",
  fullReferralCopied: "पूर्ण रेफरल लिंक क्लिपबोर्ड पर कॉपी किया गया",
  errorCopying: "क्लिपबोर्ड पर कॉपी नहीं किया जा सका",
  shareText: "मेरे रेफरल लिंक के साथ वेपूल में शामिल हों और 1% अतिरिक्त APR प्राप्त करें",
  errorSharing: "रेफरल लिंक साझा नहीं किया जा सका",
  errorNotAuthenticated: "रेफरल कोड का उपयोग करने के लिए आपको अपना वॉलेट कनेक्ट करना और प्रमाणित होना आवश्यक है।",
  errorMissingWallet: "कोई वॉलेट पता प्रदान नहीं किया गया",
  errorMissingCode: "कृपया एक वैध रेफरल कोड दर्ज करें",
  errorAuthentication: "लॉग इन करने में एक समस्या थी। कृपया पुनः प्रयास करें।",
  referralCodeCreated: "रेफरल कोड बनाया गया",
  referralCodeSuccess: "आपका रेफरल कोड सफलतापूर्वक बनाया गया है",
  referralCodeError: "आपका रेफरल कोड बनाने में एक त्रुटि थी",
  referralCodeUsed: "आपने सफलतापूर्वक एक रेफरल कोड का उपयोग किया है",
  referralCodeUseError: "रेफरल कोड का उपयोग करने में एक त्रुटि थी",

  // Action buttons
  refresh: "ताज़ा करें",
  getStarted: "शुरू करें",
  learnMore: "और जानें"
};

// Arabic translations
export const ar: ReferralsTranslations = {
  // Add missing required properties
  referralsNeeded: "الإحالات المطلوبة",
  noReferredUsers: "لا يوجد مستخدمون محالون",
  fiveReferrals: "5 إحالات",
  twentyReferrals: "20 إحالة",
  fiftyReferrals: "50 إحالة",
  referralsAvgInvestment: "متوسط استثمار الإحالات",
  blockchainVerified: "تم التحقق منه على البلوكتشين",
  automaticDistribution: "توزيع تلقائي",
  // Main title and description
  referralProgram: "برنامج الإحالة",
  earnWhileFriendsEarn: "اكسب بينما يكسب أصدقاؤك. احصل على 1% من جميع الفوائد التي يولدونها.",

  // Tabs
  myReferralCode: "رمز الإحالة الخاص بي",
  useReferralCode: "استخدام رمز الإحالة",
  referredUsers: "المستخدمون المحالون",
  benefits: "الفوائد",

  // My Referral Code Section
  growTogether: "النمو معًا، الكسب أكثر",
  joinOurProgram: "انضم إلى برنامج الإحالة الخاص بنا واكسب دخلًا سلبيًا من خلال تعريف شبكتك على حلول التمويل اللامركزي المتقدمة من WayBank.",
  joinNow: "انضم الآن",
  seeBenefits: "عرض الفوائد",
  shareYourCode: "شارك رمز الإحالة الخاص بك",
  personalReferralCode: "رمز الإحالة الشخصي الخاص بك",
  copy: "نسخ",
  share: "مشاركة",
  createReferralCode: "إنشاء رمز الإحالة",
  notAuthenticated: "يجب عليك ربط محفظتك لإنشاء رمز الإحالة الفريد الخاص بك.",
  connectWallet: "ربط المحفظة",

  // Wallet security
  secureConnection: "اتصال آمن",
  encryptedConnections: "جميع الاتصالات مشفرة ومدققة",
  militarySecurity: "أمان على مستوى عسكري",
  e2eEncryption: "اتصالات مشفرة من طرف إلى طرف باستخدام أعلى معايير التشفير. المفاتيح الخاصة لا تغادر جهازك أبدًا.",
  compatibleWallets: "متوافق مع +170 محفظة",
  walletCompatibilityDesc: "MetaMask، Coinbase Wallet، Trust Wallet، Ledger، Trezor، Rainbow والعديد من المحافظ الأخرى المدعومة.",
  connectWalletTitle: "ربط المحفظة",
  connect: "ربط",
  agreeToTerms: "بربط محفظتك، فإنك توافق على",
  termsOfService: "شروط الخدمة الخاصة بنا",

  // Stats and rewards
  referralStats: "إحصائيات الإحالة",
  totalReferred: "إجمالي المحالين",
  activeUsers: "المستخدمون النشطون",
  totalRewards: "إجمالي المكافآت",
  completionRate: "معدل الإكمال",
  activeProgram: "برنامج نشط",
  accumulatedEarnings: "الأرباح المتراكمة",
  withdraw: "سحب",
  withdrawing: "جارٍ السحب...",
  noRewardsAvailable: "لا توجد مكافآت متاحة",
  noRewardsToWithdraw: "ليس لديك أي مكافآت لسحبها.",
  walletNotConnected: "المحفظة غير متصلة",
  connectWalletToWithdraw: "يرجى ربط محفظتك لسحب المكافآت.",
  withdrawalSuccessful: "تم السحب بنجاح",
  rewardsSentToWallet: "تم إرسال مكافآتك إلى محفظتك",
  withdrawalError: "حدث خطأ أثناء معالجة سحبك. يرجى المحاولة مرة أخرى.",
  confirmWithdrawal: "تأكيد السحب",
  confirmWithdrawalMessage: "يرجى تأكيد رغبتك في سحب مكافآتك إلى محفظتك المتصلة.",
  amountToWithdraw: "المبلغ المراد سحبه",
  withdrawalCurrency: "العملة",
  receivingWallet: "محفظة الاستلام",
  minimumBalanceNotMet: "الحد الأدنى للرصيد غير مستوفى",
  withdrawalMinimumBalance: "تحتاج إلى 100 USDC على الأقل للسحب. رصيدك الحالي هو",
  withdrawalNote: "ملاحظة: سيتم إرسال الأموال إلى محفظتك المتصلة كرموز USDC.",
  cancel: "إلغاء",
  processing: "جارٍ المعالجة",
  confirmAndWithdraw: "تأكيد وسحب",
  featureInDevelopment: "الميزة قيد التطوير",
  withdrawalFeatureComingSoon: "ميزة السحب قيد التنفيذ وستكون متاحة قريبًا.",
  withdrawalFailed: "فشل السحب",
  withdrawalProcessingError: "حدث خطأ أثناء معالجة سحبك",
  yourBenefit: "منفعتك",
  ofAllReturns: "من جميع العائدات",
  aprBoost: "تعزيز APR",
  yourRank: "رتبتك",
  nextRank: "الرتبة التالية",
  usersNeeded: "تحتاج إلى {count} إحالة إضافية للوصول إلى {rank}",
  nextMilestone: "المرحلة التالية",
  current: "الحالي",

  // Ranks and rank titles
  yourReferralRank: "رتبة الإحالة الخاصة بك",
  keepInvitingFriends: "استمر في دعوة الأصدقاء للوصول إلى رتب أعلى وفتح المزيد من الفوائد",
  rankBenefits: "فوائد الرتبة",
  unlockSpecialPerks: "افتح امتيازات خاصة كلما تقدمت في الرتب",

  // Rank names
  Rookie: "مبتدئ",
  Rabbit: "أرنب",
  Cat: "قط",
  Dog: "كلب",
  Sentinel: "حارس",
  Phoenix: "فينكس",
  Legend: "أسطورة",
  Champion: "بطل",
  Advanced: "متقدم",
  Elite: "نخبة",

  // Rank benefits
  onePercentRewards: "1% من مكافآت الأصدقاء",
  basicDashboardAccess: "وصول أساسي إلى لوحة التحكم",
  standardSupport: "دعم قياسي",
  onePointFivePercentRewards: "1.5% من مكافآت الأصدقاء",
  prioritySupport: "دعم ذو أولوية",
  exclusiveWebinars: "ندوات حصرية عبر الإنترنت",
  twoPercentRewards: "2% من مكافآت الأصدقاء",
  vipSupport: "دعم VIP",
  earlyAccess: "وصول مبكر إلى الميزات الجديدة",

  // Rank progress section
  youNeed: "أنت تحتاج إلى",
  moreReferralsToAdvance: "إحالات إضافية للتقدم إلى الرتبة التالية",

  // Maximum rank messages
  congratsHighestRank: "تهانينا! لقد وصلت إلى أعلى رتبة لدينا.",
  enjoyChampionBenefits: "استمتع بجميع المزايا الحصرية لكونك بطلاً.",

  // Additional properties for "Use Code" section
  referralCodeDetected: "تم الكشف عن رمز الإحالة",
  referralCodeFound: "لقد اكتشفنا رمز إحالة في الرابط الذي استخدمته للوصول إلى هذه الصفحة.",
  using: "جاري الاستخدام...",
  useCode: "استخدم هذا الرمز",
  submitting: "جارٍ الإرسال...",

  // Use Referral Code Section
  useReferralCodeTitle: "استخدام رمز الإحالة",
  enterCode: "أدخل رمز الإحالة",
  submitCode: "إرسال الرمز",
  alreadyReferred: "تمت إحالتك بالفعل",
  referredBy: "تمت إحالتك بواسطة",
  referredByComplete: "تمت إحالتك بواسطة {address}",
  referralAprBoostMessage: "تعزيز APR بنسبة 1.0% يحصل المحالون منك على تعزيز APR بنسبة 1% على جميع مراكزهم في WayBank.",

  // Benefits Section
  referralBenefits: "فوائد برنامج الإحالة",
  whenYouUseCode: "عند استخدامك لرمز إحالة",
  aprBoostDescription1: "تحصل على تعزيز APR بنسبة 1% على جميع مراكزك، مما يزيد من عوائدك دون أي تكلفة إضافية.",
  whenOthersUseCode: "عندما يستخدم الآخرون رمزك",
  passiveIncomeStream: "تولد تيار دخل سلبي يعتمد على الرسوم التي يولدها المحالون منك.",

  // Referred Users Section
  referredUsersTitle: "المستخدمون الذين قمت بإحالتهم",
  inviteFriends: "ادعُ أصدقاءك للانضمام باستخدام رمز الإحالة الخاص بك",
  referralCodeRequired: "تحتاج إلى إنشاء رمز إحالة أولاً",
  address: "العنوان",
  joinDate: "تاريخ الانضمام",
  status: "الحالة",
  rewards: "المكافآت",
  active: "نشط",
  inactive: "غير نشط",

  // Stats Cards
  nextTarget: "الهدف التالي",
  progress: "التقدم",
  rewardAtNextLevel: "المكافأة في المستوى التالي",
  need: "تحتاج",
  more: "أكثر",

  // Benefits Section
  benefitsTitle: "فوائد برنامج الإحالة",
  benefitsDescription: "تم تصميم برنامج الإحالة الخاص بنا ليفيدك أنت والأشخاص الذين تحيلهم.",
  commissionRewards: "مكافآت العمولة",
  commissionDescription: "اكسب ما يصل إلى 4.5% عمولة على أرباح عائدات المحالين منك، مدفوعة بعملة USDC.",
  rankingSystem: "نظام التصنيف",
  rankingDescription: "تقدم عبر نظام التصنيف الخاص بنا المستوحى من الألعاب بمستويات ذات طابع خاص ومكافآت متزايدة.",
  aprBoostDescription: "يحصل المحالون منك على تعزيز APR بنسبة 1% على جميع مراكزهم في WayBank.",

  // Additional texts for the benefits section
  networkEffect: "تأثير الشبكة",
  noLimits: "لا حدود",
  instantRewards: "مكافآت فورية",
  winWinSystem: "نظام مربح للجانبين",
  noReferredUsersYet: "لم تقم بإحالة أي مستخدمين بعد",
  earningsGrow: "تنمو الأرباح مع زيادة استثمار المحالين منك",
  passiveIncomeContinues: "يستمر الدخل السلبي طالما ظل المحالون منك نشطين",
  noHiddenConditions: "لا توجد شروط مخفية",
  secureTransparent: "آمن وشفاف",

  // Rewards calculator
  rewardsCalculator: "حاسبة مكافآت الإحالة",
  calculateEarnings: "احسب أرباحك المحتملة من برنامج الإحالة الخاص بنا",
  numberOfReferrals: "عدد الإحالات",
  averageInvestment: "متوسط الاستثمار",
  baseAPR: "النسبة المئوية السنوية الأساسية (APR)",
  timeHorizon: "الأفق الزمني",
  years: "سنوات",
  year: "سنة",
  potentialEarnings: "أرباحك المحتملة",
  totalOver: "الإجمالي خلال",
  with: "مع",
  referralsInvesting: "إحالات تستثمر",
  each: "كل",
  annualEarnings: "الأرباح السنوية",
  monthlyEarnings: "الأرباح الشهرية",
  commissionRate: "معدل عمولتك",
  rankGivesYou: "رتبتك تمنحك",
  commissionOnEarnings: "معدل عمولة على جميع الأرباح التي يولدها المحالون منك.",
  calculator: "الآلة الحاسبة",
  earningScenarios: "سيناريوهات الكسب",
  updating: "جارٍ التحديث...",
  refetchData: "تحديث البيانات",
  yourCommissionRate: "معدل عمولتك",
  perReferralAnnual: "لكل إحالة (سنويًا)",
  basedOn: "بناءً على",
  at: "عند",
  calculatorUsesRealAPR: "تستخدم هذه الحاسبة متوسط APR الحقيقي",
  fromAllActivePositions: "من جميع المراكز النشطة",
  basedOnPlatformAverage: "بناءً على متوسط مبلغ الاستثمار للمنصة وهو",
  calculatedFrom: "محسوب من",
  activePositionsWithLiquidity: "المراكز النشطة ذات السيولة",
  outOf: "من إجمالي",
  totalActivePositions: "إجمالي المراكز النشطة",

  // Referral Levels
  referralLevels: "مستويات برنامج الإحالة الخاص بنا",
  progressThroughRanks: "تقدم عبر هذه الرتب الحصرية مع نمو شبكة الإحالة الخاصة بك.",
  referrals: "الإحالات",

  // Success Stories
  successStoryTitle: "قصص النجاح",
  successStoryDescription: "مستخدمون حقيقيون يشاركون تجاربهم مع برنامج الإحالة الخاص بنا",
  noLimitUsers: "لا يوجد حد لعدد المستخدمين الذين يمكنك إحالتهم",
  averageEarnings: "متوسط الأرباح",
  perYearWithActive: "سنويًا مع 10 إحالات نشطة",
  enterpriseInvestor: "مستثمر مؤسسي",
  cryptoEnthusiast: "متحمس للعملات المشفرة",
  financialAdvisor: "مستشار مالي",
  referredUsers2: "المستخدمون المحالون",
  totalEarned: "إجمالي الأرباح",
  yourSuccessStoryAwaits: "قصة نجاحك تنتظرك",
  joinCommunity: "انضم إلى مجتمعنا المتنامي من المحيلين الناجحين. أنشئ رمز الإحالة الخاص بك اليوم وابدأ في بناء تدفق الدخل السلبي الخاص بك.",

  // How It Works Section
  howItWorks: "كيف يعمل",
  stepsToEarn: "3 خطوات بسيطة لبدء الكسب",
  getYourCode: "احصل على رمزك",
  codeAutoGenerated: "يتم إنشاء رمز الإحالة الخاص بك تلقائيًا",
  shareWithFriends: "شارك مع الأصدقاء",
  sendReferralLink: "أرسل رابط الإحالة الخاص بك إلى الأصدقاء باستخدام أي منصة",
  earnRewards: "اكسب المكافآت",

  // Errors and messages
  success: "نجاح",
  error: "خطأ",
  copied: "تم النسخ!",
  copyToClipboard: "نسخ إلى الحافظة",
  copyReferralLink: "نسخ رابط الإحالة الخاص بي",
  fullReferralCopied: "تم نسخ رابط الإحالة الكامل إلى الحافظة",
  errorCopying: "تعذر النسخ إلى الحافظة",
  shareText: "انضم إلى WayBank باستخدام رابط الإحالة الخاص بي واحصل على 1% APR إضافي",
  errorSharing: "تعذر مشاركة رابط الإحالة",
  errorNotAuthenticated: "تحتاج إلى ربط محفظتك والمصادقة لاستخدام رمز الإحالة.",
  errorMissingWallet: "لم يتم تقديم عنوان المحفظة",
  errorMissingCode: "يرجى إدخال رمز إحالة صالح",
  errorAuthentication: "حدثت مشكلة أثناء تسجيل الدخول. يرجى المحاولة مرة أخرى.",
  referralCodeCreated: "تم إنشاء رمز الإحالة",
  referralCodeSuccess: "تم إنشاء رمز الإحالة الخاص بك بنجاح",
  referralCodeError: "حدث خطأ أثناء إنشاء رمز الإحالة الخاص بك",
  referralCodeUsed: "لقد استخدمت رمز إحالة بنجاح",
  referralCodeUseError: "حدث خطأ أثناء استخدام رمز الإحالة",

  // Action buttons
  refresh: "تحديث",
  getStarted: "ابدأ",
  learnMore: "معرفة المزيد"
};

// Russian translations
export const ru: ReferralsTranslations = {
  // Add missing required properties
  referralsNeeded: "Требуется рефералов",
  noReferredUsers: "Нет реферальных пользователей",
  fiveReferrals: "5 рефералов",
  twentyReferrals: "20 рефералов",
  fiftyReferrals: "50 рефералов",
  referralsAvgInvestment: "Средний объем инвестиций рефералов",
  blockchainVerified: "Подтверждено блокчейном",
  automaticDistribution: "Автоматическое распределение",
  // Main title and description
  referralProgram: "Реферальная программа",
  earnWhileFriendsEarn: "Зарабатывайте, пока зарабатывают ваши друзья. Получайте 1% от всех генерируемых ими преимуществ.",

  // Tabs
  myReferralCode: "Мой реферальный код",
  useReferralCode: "Использовать реферальный код",
  referredUsers: "Приглашенные пользователи",
  benefits: "Преимущества",

  // My Referral Code Section
  growTogether: "Растим вместе, зарабатываем больше",
  joinOurProgram: "Присоединяйтесь к нашей реферальной программе и получайте пассивный доход, знакомя свою сеть с передовыми решениями WayBank в сфере DeFi.",
  joinNow: "Присоединиться сейчас",
  seeBenefits: "Посмотреть преимущества",
  shareYourCode: "Поделитесь своим реферальным кодом",
  personalReferralCode: "Ваш персональный реферальный код",
  copy: "Копировать",
  share: "Поделиться",
  createReferralCode: "Создать реферальный код",
  notAuthenticated: "Вам необходимо подключить свой кошелек, чтобы сгенерировать свой уникальный реферальный код.",
  connectWallet: "Подключить кошелек",

  // Wallet security
  secureConnection: "Безопасное соединение",
  encryptedConnections: "Все соединения зашифрованы и проверены",
  militarySecurity: "Военный уровень безопасности",
  e2eEncryption: "Сквозное шифрование соединений с использованием высочайших криптографических стандартов. Приватные ключи никогда не покидают ваше устройство.",
  compatibleWallets: "Совместимо с +170 кошельками",
  walletCompatibilityDesc: "MetaMask, Coinbase Wallet, Trust Wallet, Ledger, Trezor, Rainbow и многие другие поддерживаемые кошельки.",
  connectWalletTitle: "Подключить кошелек",
  connect: "Подключить",
  agreeToTerms: "Подключая свой кошелек, вы соглашаетесь с нашими",
  termsOfService: "Условиями обслуживания",

  // Stats and rewards
  referralStats: "Статистика рефералов",
  totalReferred: "Всего рефералов",
  activeUsers: "Активные пользователи",
  totalRewards: "Общие награды",
  completionRate: "Коэффициент завершения",
  activeProgram: "Активная программа",
  accumulatedEarnings: "Накопленный заработок",
  withdraw: "Вывести",
  withdrawing: "Вывод средств...",
  noRewardsAvailable: "Награды недоступны",
  noRewardsToWithdraw: "У вас нет наград для вывода.",
  walletNotConnected: "Кошелек не подключен",
  connectWalletToWithdraw: "Пожалуйста, подключите свой кошелек для вывода наград.",
  withdrawalSuccessful: "Вывод средств успешно завершен",
  rewardsSentToWallet: "Ваши награды были отправлены на ваш кошелек",
  withdrawalError: "Произошла ошибка при обработке вашего вывода средств. Пожалуйста, попробуйте еще раз.",
  confirmWithdrawal: "Подтвердить вывод",
  confirmWithdrawalMessage: "Пожалуйста, подтвердите, что вы хотите вывести свои награды на подключенный кошелек.",
  amountToWithdraw: "Сумма к выводу",
  withdrawalCurrency: "Валюта",
  receivingWallet: "Кошелек получателя",
  minimumBalanceNotMet: "Минимальный баланс не достигнут",
  withdrawalMinimumBalance: "Вам необходимо иметь минимум 100 USDC для вывода. Ваш текущий баланс составляет",
  withdrawalNote: "Примечание: Средства будут отправлены на ваш подключенный кошелек в виде токенов USDC.",
  cancel: "Отмена",
  processing: "Обработка",
  confirmAndWithdraw: "Подтвердить и вывести",
  featureInDevelopment: "Функция в разработке",
  withdrawalFeatureComingSoon: "Функция вывода средств находится в стадии реализации и скоро будет доступна.",
  withdrawalFailed: "Вывод средств не удался",
  withdrawalProcessingError: "Произошла ошибка при обработке вашего вывода средств",
  yourBenefit: "Ваша выгода",
  ofAllReturns: "От всех доходов",
  aprBoost: "Увеличение APR",
  yourRank: "Ваш ранг",
  nextRank: "Следующий ранг",
  usersNeeded: "Нужно еще {count}, чтобы достичь {rank}",
  nextMilestone: "Следующая веха",
  current: "Текущий",

  // Ranks and rank titles
  yourReferralRank: "Ваш реферальный ранг",
  keepInvitingFriends: "Продолжайте приглашать друзей, чтобы достигать более высоких рангов и открывать больше преимуществ",
  rankBenefits: "Преимущества ранга",
  unlockSpecialPerks: "Разблокируйте специальные привилегии по мере продвижения по рангам",

  // Rank names
  Rookie: "Новичок",
  Rabbit: "Кролик",
  Cat: "Кошка",
  Dog: "Собака",
  Sentinel: "Страж",
  Phoenix: "Феникс",
  Legend: "Легенда",
  Champion: "Чемпион",
  Advanced: "Продвинутый",
  Elite: "Элита",

  // Rank benefits
  onePercentRewards: "1% от наград друзей",
  basicDashboardAccess: "Базовый доступ к панели управления",
  standardSupport: "Стандартная поддержка",
  onePointFivePercentRewards: "1.5% от наград друзей",
  prioritySupport: "Приоритетная поддержка",
  exclusiveWebinars: "Эксклюзивные вебинары",
  twoPercentRewards: "2% от наград друзей",
  vipSupport: "VIP поддержка",
  earlyAccess: "Ранний доступ к новым функциям",

  // Rank progress section
  youNeed: "Вам нужно",
  moreReferralsToAdvance: "больше рефералов для продвижения на следующий ранг",

  // Maximum rank messages
  congratsHighestRank: "Поздравляем! Вы достигли нашего наивысшего ранга.",
  enjoyChampionBenefits: "Наслаждайтесь всеми эксклюзивными преимуществами быть Чемпионом.",

  // Additional properties for "Use Code" section
  referralCodeDetected: "Реферальный код обнаружен",
  referralCodeFound: "Мы обнаружили реферальный код в ссылке, которую вы использовали для доступа к этой странице.",
  using: "Используется...",
  useCode: "Использовать этот код",
  submitting: "Отправка...",

  // Use Referral Code Section
  useReferralCodeTitle: "Использовать реферальный код",
  enterCode: "Введите реферальный код",
  submitCode: "Отправить код",
  alreadyReferred: "Вы уже являетесь рефералом",
  referredBy: "Вы были приглашены",
  referredByComplete: "Вас пригласил {address}",
  referralAprBoostMessage: "Увеличение APR на 1.0%. Ваши рефералы получают увеличение APR на 1% по всем своим позициям с WayBank.",

  // Benefits Section
  referralBenefits: "Преимущества реферальной программы",
  whenYouUseCode: "Когда вы используете реферальный код",
  aprBoostDescription1: "Вы получаете увеличение APR на 1% по всем своим позициям, максимизируя свою прибыль без дополнительных затрат.",
  whenOthersUseCode: "Когда другие используют ваш код",
  passiveIncomeStream: "Вы генерируете пассивный доход, основанный на комиссиях, сгенерированных вашими рефералами.",

  // Referred Users Section
  referredUsersTitle: "Пользователи, которых вы пригласили",
  inviteFriends: "Пригласите своих друзей присоединиться, используя ваш реферальный код",
  referralCodeRequired: "Вам нужно сначала создать реферальный код",
  address: "Адрес",
  joinDate: "Дата присоединения",
  status: "Статус",
  rewards: "Награды",
  active: "Активный",
  inactive: "Неактивный",

  // Stats Cards
  nextTarget: "Следующая цель",
  progress: "Прогресс",
  rewardAtNextLevel: "Награда на следующем уровне",
  need: "Вам нужно",
  more: "больше",

  // Benefits Section
  benefitsTitle: "Преимущества реферальной программы",
  benefitsDescription: "Наша реферальная программа разработана для того, чтобы приносить пользу как вам, так и тем, кого вы приглашаете.",
  commissionRewards: "Комиссионные вознаграждения",
  commissionDescription: "Получайте до 4,5% комиссии от доходов ваших рефералов, выплачиваемых в USDC.",
  rankingSystem: "Система ранжирования",
  rankingDescription: "Продвигайтесь по нашей геймифицированной системе ранжирования с тематическими уровнями и растущими наградами.",
  aprBoostDescription: "Ваши рефералы получают увеличение APR на 1% по всем своим позициям с WayBank.",

  // Additional texts for the benefits section
  networkEffect: "Сетевой эффект",
  noLimits: "Без ограничений",
  instantRewards: "Мгновенные награды",
  winWinSystem: "Беспроигрышная система",
  noReferredUsersYet: "Вы еще не пригласили ни одного пользователя",
  earningsGrow: "Доходы растут по мере того, как ваши рефералы инвестируют больше",
  passiveIncomeContinues: "Пассивный доход сохраняется до тех пор, пока ваши рефералы остаются активными",
  noHiddenConditions: "Без скрытых условий",
  secureTransparent: "Безопасно и прозрачно",

  // Rewards calculator
  rewardsCalculator: "Калькулятор реферальных наград",
  calculateEarnings: "Рассчитайте свой потенциальный доход от нашей реферальной программы",
  numberOfReferrals: "Количество рефералов",
  averageInvestment: "Средняя инвестиция",
  baseAPR: "Базовая APR",
  timeHorizon: "Временной горизонт",
  years: "лет",
  year: "год",
  potentialEarnings: "Ваш потенциальный доход",
  totalOver: "Всего за",
  with: "С",
  referralsInvesting: "рефералов инвестируют",
  each: "каждый",
  annualEarnings: "Годовой заработок",
  monthlyEarnings: "Ежемесячный заработок",
  commissionRate: "Ваша комиссионная ставка",
  rankGivesYou: "Ваш ранг дает вам",
  commissionOnEarnings: "комиссионная ставка на все доходы, сгенерированные вашими рефералами.",
  calculator: "Калькулятор",
  earningScenarios: "Сценарии заработка",
  updating: "Обновление...",
  refetchData: "Обновить данные",
  yourCommissionRate: "Ваша комиссионная ставка",
  perReferralAnnual: "За реферала (годовой)",
  basedOn: "На основе",
  at: "при",
  calculatorUsesRealAPR: "Этот калькулятор использует реальный средний APR",
  fromAllActivePositions: "от всех активных позиций",
  basedOnPlatformAverage: "На основе средней суммы инвестиций платформы в",
  calculatedFrom: "рассчитано из",
  activePositionsWithLiquidity: "активных позиций с ликвидностью",
  outOf: "из общего числа",
  totalActivePositions: "всех активных позиций",

  // Referral Levels
  referralLevels: "Уровни нашей реферальной программы",
  progressThroughRanks: "Продвигайтесь по этим эксклюзивным рангам по мере роста вашей реферальной сети.",
  referrals: "Рефералы",

  // Success Stories
  successStoryTitle: "Истории успеха",
  successStoryDescription: "Реальные пользователи делятся своим опытом участия в нашей реферальной программе",
  noLimitUsers: "Нет ограничений на количество пользователей, которых вы можете пригласить",
  averageEarnings: "Средний заработок",
  perYearWithActive: "в год с 10 активными рефералами",
  enterpriseInvestor: "Корпоративный инвестор",
  cryptoEnthusiast: "Крипто-энтузиаст",
  financialAdvisor: "Финансовый консультант",
  referredUsers2: "Приглашенные пользователи",
  totalEarned: "Всего заработано",
  yourSuccessStoryAwaits: "Ваша история успеха ждет вас",
  joinCommunity: "Присоединяйтесь к нашему растущему сообществу успешных рефереров. Создайте свой реферальный код сегодня и начните строить свой поток пассивного дохода.",

  // How It Works Section
  howItWorks: "Как это работает",
  stepsToEarn: "3 простых шага, чтобы начать зарабатывать",
  getYourCode: "Получите свой код",
  codeAutoGenerated: "Ваш реферальный код генерируется автоматически",
  shareWithFriends: "Поделиться с друзьями",
  sendReferralLink: "Отправьте свою реферальную ссылку друзьям, используя любую платформу",
  earnRewards: "Зарабатывайте награды",

  // Errors and messages
  success: "Успех",
  error: "Ошибка",
  copied: "Скопировано!",
  copyToClipboard: "Скопировать в буфер обмена",
  copyReferralLink: "Скопировать мою реферальную ссылку",
  fullReferralCopied: "Полная реферальная ссылка скопирована в буфер обмена",
  errorCopying: "Не удалось скопировать в буфер обмена",
  shareText: "Присоединяйтесь к WayBank по моей реферальной ссылке и получите дополнительно 1% APR",
  errorSharing: "Не удалось поделиться реферальной ссылкой",
  errorNotAuthenticated: "Вам необходимо подключить свой кошелек и пройти аутентификацию, чтобы использовать реферальный код.",
  errorMissingWallet: "Адрес кошелька не указан",
  errorMissingCode: "Пожалуйста, введите действительный реферальный код",
  errorAuthentication: "Произошла проблема при входе в систему. Пожалуйста, попробуйте еще раз.",
  referralCodeCreated: "Реферальный код создан",
  referralCodeSuccess: "Ваш реферальный код успешно создан",
  referralCodeError: "Произошла ошибка при создании вашего реферального кода",
  referralCodeUsed: "Вы успешно использовали реферальный код",
  referralCodeUseError: "Произошла ошибка при использовании реферального кода",

  // Action buttons
  refresh: "Обновить",
  getStarted: "Начать",
  learnMore: "Узнать больше"
};

// German translations
// German translations
export const de: ReferralsTranslations = {
  // Add missing required properties
  referralsNeeded: "Benötigte Empfehlungen",
  noReferredUsers: "Keine empfohlenen Benutzer",
  fiveReferrals: "5 Empfehlungen",
  twentyReferrals: "20 Empfehlungen",
  fiftyReferrals: "50 Empfehlungen",
  referralsAvgInvestment: "Durchschnittliche Investition der Empfehlungen",
  blockchainVerified: "Blockchain-verifiziert",
  automaticDistribution: "Automatische Verteilung",
  // Main title and description
  referralProgram: "Empfehlungsprogramm",
  earnWhileFriendsEarn: "Verdiene, während deine Freunde verdienen. Erhalte 1% aller generierten Gewinne.",
  referralCount: "Empfehlungen", // Cambiado para coincidir con la interfaz corregida

  // Tabs
  myReferralCode: "Mein Empfehlungscode",
  useReferralCode: "Empfehlungscode verwenden",
  referredUsers: "Empfohlene Benutzer",
  benefits: "Vorteile",

  // My Referral Code Section
  growTogether: "Gemeinsam wachsen, mehr verdienen",
  joinOurProgram: "Nimm an unserem Empfehlungsprogramm teil und verdiene passives Einkommen, indem du dein Netzwerk mit den fortschrittlichen DeFi-Lösungen von WayBank bekannt machst.",
  joinNow: "Jetzt beitreten",
  seeBenefits: "Vorteile ansehen",
  shareYourCode: "Teile deinen Empfehlungscode",
  personalReferralCode: "Dein persönlicher Empfehlungscode",
  copy: "Kopieren",
  share: "Teilen",
  createReferralCode: "Empfehlungscode erstellen",
  notAuthenticated: "Du musst deine Wallet verbinden, um deinen einzigartigen Empfehlungscode zu generieren.",
  connectWallet: "Wallet verbinden",

  // Wallet security
  secureConnection: "Sichere Verbindung",
  encryptedConnections: "Alle Verbindungen sind verschlüsselt und auditiert",
  militarySecurity: "Sicherheit auf Militärniveau",
  e2eEncryption: "E2E-verschlüsselte Verbindungen mit den höchsten kryptografischen Standards. Private Schlüssel verlassen niemals dein Gerät.",
  compatibleWallets: "Kompatibel mit +170 Wallets",
  walletCompatibilityDesc: "MetaMask, Coinbase Wallet, Trust Wallet, Ledger, Trezor, Rainbow und viele weitere kompatible Wallets.",
  connectWalletTitle: "Wallet verbinden",
  connect: "Verbinden",
  agreeToTerms: "Durch das Verbinden deiner Wallet stimmst du unseren",
  termsOfService: "Nutzungsbedingungen zu",

  // Stats and rewards
  referralStats: "Empfehlungsstatistiken",
  totalReferred: "Gesamtzahl der Empfohlenen",
  activeUsers: "Aktive Benutzer",
  totalRewards: "Gesamte Belohnungen",
  completionRate: "Abschlussrate",
  activeProgram: "Aktives Programm",
  accumulatedEarnings: "Kumulierte Einnahmen",
  withdraw: "Abheben",
  withdrawing: "Wird abgehoben...",
  noRewardsAvailable: "Keine Belohnungen verfügbar",
  noRewardsToWithdraw: "Du hast keine Belohnungen zum Abheben.",
  walletNotConnected: "Wallet nicht verbunden",
  connectWalletToWithdraw: "Bitte verbinde deine Wallet, um Belohnungen abzuheben.",
  withdrawalSuccessful: "Auszahlung erfolgreich",
  rewardsSentToWallet: "Deine Belohnungen wurden an deine Wallet gesendet",
  withdrawalError: "Es gab einen Fehler bei der Bearbeitung deiner Auszahlung. Bitte versuche es erneut.",
  confirmWithdrawal: "Auszahlung bestätigen",
  confirmWithdrawalMessage: "Bitte bestätige, dass du deine Belohnungen auf deine verbundene Wallet abheben möchtest.",
  amountToWithdraw: "Betrag zum Abheben",
  withdrawalCurrency: "Währung",
  receivingWallet: "Empfangende Wallet",
  minimumBalanceNotMet: "Mindestguthaben nicht erreicht",
  withdrawalMinimumBalance: "Du benötigst mindestens 100 USDC zum Abheben. Dein aktuelles Guthaben beträgt",
  withdrawalNote: "Hinweis: Die Gelder werden als USDC-Token an deine verbundene Wallet gesendet.",
  cancel: "Abbrechen",
  processing: "Wird verarbeitet",
  confirmAndWithdraw: "Bestätigen und Abheben",
  featureInDevelopment: "Funktion in Entwicklung",
  withdrawalFeatureComingSoon: "Die Auszahlungsfunktion wird implementiert und ist bald verfügbar.",
  withdrawalFailed: "Auszahlung fehlgeschlagen",
  withdrawalProcessingError: "Es gab einen Fehler bei der Bearbeitung deiner Auszahlung",
  yourBenefit: "Dein Vorteil",
  ofAllReturns: "Aller Renditen",
  aprBoost: "APR-Boost",
  yourRank: "Dein Rang",
  nextRank: "Nächster Rang",
  usersNeeded: "Du benötigst {count} weitere, um {rank} zu erreichen",
  nextMilestone: "Nächster Meilenstein",
  current: "Aktuell",

  // Ranks and rank titles
  yourReferralRank: "Dein Empfehlungsrang",
  keepInvitingFriends: "Lade weiterhin Freunde ein, um höhere Ränge zu erreichen und weitere Vorteile freizuschalten",
  rankBenefits: "Rangvorteile",
  unlockSpecialPerks: "Schalte spezielle Vorteile frei, während du durch die Ränge aufsteigst",

  // Rank names
  Rookie: "Anfänger",
  Rabbit: "Hase",
  Cat: "Katze",
  Dog: "Hund",
  Sentinel: "Wächter",
  Phoenix: "Phönix",
  Legend: "Legende",
  Champion: "Champion",
  Advanced: "Fortgeschritten",
  Elite: "Elite",

  // Rank benefits
  onePercentRewards: "1% der Freunde-Belohnungen",
  basicDashboardAccess: "Grundlegender Dashboard-Zugriff",
  standardSupport: "Standard-Support",
  onePointFivePercentRewards: "1,5% der Freunde-Belohnungen",
  prioritySupport: "Priorisierter Support",
  exclusiveWebinars: "Exklusive Webinare",
  twoPercentRewards: "2% der Freunde-Belohnungen",
  vipSupport: "VIP-Support",
  earlyAccess: "Frühzugang zu neuen Funktionen",

  // Rank progress section
  youNeed: "Du brauchst",
  moreReferralsToAdvance: "weitere Empfehlungen, um zum nächsten Rang aufzusteigen",

  // Maximum rank messages
  congratsHighestRank: "Herzlichen Glückwunsch! Du hast unseren höchsten Rang erreicht.",
  enjoyChampionBenefits: "Genieße alle exklusiven Vorteile als Champion.",

  // Referred Users section
  loadingReferredUsers: "Deine empfohlenen Benutzer werden geladen...",
  startReferred: "Teile deinen Empfehlungscode, um Belohnungen zu erhalten",
  inviteMoreFriends: "Lade weitere Freunde ein, um zum nächsten Rang aufzusteigen",
  seeAllRanks: "Alle Ränge ansehen",

  // Additional properties for "Use Code" section
  referralCodeDetected: "Empfehlungscode erkannt",
  referralCodeFound: "Wir haben einen Empfehlungscode in dem Link erkannt, den du verwendet hast, um auf diese Seite zuzugreifen.",
  using: "Wird verwendet...",
  useCode: "Diesen Code verwenden",
  submitting: "Wird gesendet...",

  // Use Referral Code Section
  useReferralCodeTitle: "Einen Empfehlungscode verwenden",
  enterCode: "Empfehlungscode eingeben",
  submitCode: "Code senden",
  alreadyReferred: "Du wurdest bereits empfohlen",
  referredBy: "Du wurdest empfohlen von",
  referredByComplete: "Du wurdest empfohlen von {address}",
  referralAprBoostMessage: "1,0% APR-Boost. Deine Empfehlungen erhalten einen 1%igen APR-Boost auf alle ihre Positionen bei WayBank.",

  // Benefits Section
  referralBenefits: "Vorteile des Empfehlungsprogramms",
  whenYouUseCode: "Wenn du einen Empfehlungscode verwendest",
  aprBoostDescription1: "Du erhältst einen 1%igen APR-Boost auf alle deine Positionen, wodurch deine Erträge ohne zusätzliche Kosten maximiert werden.",
  whenOthersUseCode: "Wenn andere deinen Code verwenden",
  passiveIncomeStream: "Du generierst ein passives Einkommen, das auf den Provisionen deiner Empfehlungen basiert.",

  // Referred Users Section
  referredUsersTitle: "Benutzer, die du empfohlen hast",
  inviteFriends: "Lade deine Freunde ein, mit deinem Empfehlungscode beizutreten",
  referralCodeRequired: "Du musst zuerst einen Empfehlungscode erstellen",
  address: "Adresse",
  joinDate: "Beitrittsdatum",
  status: "Status",
  rewards: "Belohnungen",
  active: "Aktiv",
  inactive: "Inaktiv",

  // Stats Cards
  nextTarget: "Nächstes Ziel",
  progress: "Fortschritt",
  rewardAtNextLevel: "Belohnung auf der nächsten Stufe",
  need: "Benötigt",
  more: "mehr",

  // Benefits Section
  benefitsTitle: "Vorteile des Empfehlungsprogramms",
  benefitsDescription: "Unser Empfehlungsprogramm wurde entwickelt, um sowohl dir als auch den von dir empfohlenen Personen zu nützen.",
  commissionRewards: "Provisionsbelohnungen",
  commissionDescription: "Verdiene bis zu 4,5% Provision auf die Erträge deiner Empfehlungen, ausgezahlt in USDC.",
  rankingSystem: "Rangsystem",
  rankingDescription: "Steige in unserem gamifizierten Rangsystem mit thematischen Stufen und steigenden Belohnungen auf.",
  aprBoostDescription: "Deine Empfehlungen erhalten einen 1%igen APR-Boost auf alle ihre Positionen bei WayBank.",

  // Additional texts for the benefits section
  networkEffect: "Netzwerkeffekt",
  noLimits: "Keine Grenzen",
  instantRewards: "Sofortige Belohnungen",
  winWinSystem: "Win-Win-System",
  noReferredUsersYet: "Du hast noch keine Benutzer empfohlen",
  earningsGrow: "Die Einnahmen wachsen, wenn deine Empfehlungen mehr investieren",
  passiveIncomeContinues: "Passives Einkommen wird fortgesetzt, solange deine Empfehlungen aktiv bleiben",
  noHiddenConditions: "Keine versteckten Bedingungen",
  secureTransparent: "Sicher und Transparent",

  // Rewards calculator
  rewardsCalculator: "Rechner für Empfehlungsbelohnungen",
  calculateEarnings: "Berechne deine potenziellen Einnahmen aus unserem Empfehlungsprogramm",
  numberOfReferrals: "Anzahl der Empfehlungen",
  averageInvestment: "Durchschnittliche Investition",
  baseAPR: "Basis-APR",
  timeHorizon: "Zeitlicher Horizont",
  years: "Jahre",
  year: "Jahr",
  potentialEarnings: "Deine potenziellen Einnahmen",
  totalOver: "Gesamt über",
  with: "Mit",
  referralsInvesting: "Empfehlungen investieren",
  each: "jeweils",
  annualEarnings: "Jährliche Einnahmen",
  monthlyEarnings: "Monatliche Einnahmen",
  commissionRate: "Deine Provisionsrate",
  rankGivesYou: "Dein Rang gibt dir eine",
  commissionOnEarnings: "Provisionsrate auf alle von deinen Empfehlungen generierten Einnahmen.",
  calculator: "Rechner",
  earningScenarios: "Einnahmenszenarien",
  updating: "Wird aktualisiert...",
  refetchData: "Daten aktualisieren", // Corregido para que coincida con la interfaz
  yourCommissionRate: "Deine Provisionsrate",
  perReferralAnnual: "Pro Empfehlung (Jährlich)",
  basedOn: "Basierend auf",
  at: "zu",
  calculatorUsesRealAPR: "Dieser Rechner verwendet den tatsächlichen durchschnittlichen APR",
  fromAllActivePositions: "aus allen aktiven Positionen",
  basedOnPlatformAverage: "Basierend auf dem durchschnittlichen Investitionsbetrag der Plattform von",
  calculatedFrom: "berechnet aus",
  activePositionsWithLiquidity: "aktiven Positionen mit Liquidität",
  outOf: "von insgesamt",
  totalActivePositions: "aktiven Positionen",

  // Referral Levels
  referralLevels: "Stufen unseres Empfehlungsprogramms",
  progressThroughRanks: "Steige durch diese exklusiven Ränge auf, während dein Empfehlungsnetzwerk wächst.",
  // referrals: "Empfehlungen", // Eliminado ya que ahora se usa referralCount

  // Success Stories
  successStoryTitle: "Erfolgsgeschichten",
  successStoryDescription: "Echte Benutzer teilen ihre Erfahrungen mit unserem Empfehlungsprogramm",
  noLimitUsers: "Keine Begrenzung der Anzahl der Benutzer, die du empfehlen kannst",
  averageEarnings: "Durchschnittliche Einnahmen",
  perYearWithActive: "pro Jahr mit 10 aktiven Empfehlungen",
  enterpriseInvestor: "Unternehmensinvestor",
  cryptoEnthusiast: "Krypto-Enthusiast",
  financialAdvisor: "Finanzberater",
  referredUsers2: "Empfohlene Benutzer",
  totalEarned: "Gesamtverdient",
  yourSuccessStoryAwaits: "Deine Erfolgsgeschichte wartet auf dich",
  joinCommunity: "Tritt unserer wachsenden Gemeinschaft erfolgreicher Empfehler bei. Erstelle noch heute deinen Empfehlungscode und beginne, deinen passiven Einkommensstrom aufzubauen.",

  // How It Works Section
  howItWorks: "So funktioniert's",
  stepsToEarn: "3 einfache Schritte, um mit dem Verdienen zu beginnen",
  getYourCode: "Hole dir deinen Code",
  codeAutoGenerated: "Dein Empfehlungscode wird automatisch generiert",
  shareWithFriends: "Mit Freunden teilen",
  sendReferralLink: "Sende deinen Empfehlungslink an Freunde über eine beliebige Plattform",
  earnRewards: "Belohnungen verdienen",

  // Errors and messages
  success: "Erfolg",
  error: "Fehler",
  copied: "Kopiert!",
  copyToClipboard: "In Zwischenablage kopieren",
  copyReferralLink: "Meinen Empfehlungslink kopieren",
  fullReferralCopied: "Vollständiger Empfehlungslink in Zwischenablage kopiert",
  errorCopying: "Kopieren in Zwischenablage fehlgeschlagen",
  shareText: "Tritt WayBank mit meinem Empfehlungslink bei und erhalte 1% extra APR",
  errorSharing: "Empfehlungslink konnte nicht geteilt werden",
  errorNotAuthenticated: "Du musst deine Wallet verbinden und authentifiziert sein, um einen Empfehlungscode zu verwenden.",
  errorMissingWallet: "Wallet-Adresse wurde nicht angegeben",
  errorMissingCode: "Bitte gib einen gültigen Empfehlungscode ein",
  errorAuthentication: "Es gab ein Problem bei der Anmeldung. Bitte versuche es erneut.",
  referralCodeCreated: "Empfehlungscode erstellt",
  referralCodeSuccess: "Dein Empfehlungscode wurde erfolgreich erstellt",
  referralCodeError: "Es gab einen Fehler beim Erstellen deines Empfehlungscodes",
  referralCodeUsed: "Du hast einen Empfehlungscode erfolgreich verwendet",
  referralCodeUseError: "Es gab einen Fehler bei der Verwendung des Empfehlungscodes",

  // Action buttons
  refresh: "Aktualisieren",
  getStarted: "Loslegen",
  learnMore: "Mehr erfahren"
};
// French translations
export const fr: ReferralsTranslations = {
  // Add missing required properties
  referralsNeeded: "Parrainages nécessaires",
  noReferredUsers: "Aucun utilisateur parrainé",
  fiveReferrals: "5 parrainages",
  twentyReferrals: "20 parrainages",
  fiftyReferrals: "50 parrainages",
  referralsAvgInvestment: "Investissement moyen des parrainages",
  blockchainVerified: "Vérifié sur la blockchain",
  automaticDistribution: "Distribution automatique",
  // Main title and description
  referralProgram: "Programme de parrainage",
  earnWhileFriendsEarn: "Gagnez pendant que vos amis gagnent. Obtenez 1% de tous les profits qu'ils génèrent.",

  // Tabs
  myReferralCode: "Mon code de parrainage",
  useReferralCode: "Utiliser le code de parrainage",
  referredUsers: "Utilisateurs parrainés",
  benefits: "Avantages",

  // My Referral Code Section
  growTogether: "Grandir ensemble, gagner plus",
  joinOurProgram: "Rejoignez notre programme de parrainage et gagnez un revenu passif en présentant votre réseau aux solutions DeFi avancées de WayBank.",
  joinNow: "Adhérer maintenant",
  seeBenefits: "Voir les avantages",
  shareYourCode: "Partagez votre code de parrainage",
  personalReferralCode: "Votre code de parrainage personnel",
  copy: "Copier",
  share: "Partager",
  createReferralCode: "Créer un code de parrainage",
  notAuthenticated: "Vous devez connecter votre portefeuille pour générer votre code de parrainage unique.",
  connectWallet: "Connecter le portefeuille",

  // Wallet security
  secureConnection: "Connexion sécurisée",
  encryptedConnections: "Toutes les connexions sont cryptées et auditées",
  militarySecurity: "Sécurité de qualité militaire",
  e2eEncryption: "Connexions cryptées E2E avec les normes cryptographiques les plus élevées. Les clés privées ne quittent jamais votre appareil.",
  compatibleWallets: "Compatible avec +170 portefeuilles",
  walletCompatibilityDesc: "MetaMask, Coinbase Wallet, Trust Wallet, Ledger, Trezor, Rainbow et bien d'autres portefeuilles compatibles.",
  connectWalletTitle: "Connecter le portefeuille",
  connect: "Connecter",
  agreeToTerms: "En connectant votre portefeuille, vous acceptez nos",
  termsOfService: "Conditions d'utilisation",

  // Stats and rewards
  referralStats: "Statistiques de parrainage",
  totalReferred: "Total parrainé",
  activeUsers: "Utilisateurs actifs",
  totalRewards: "Récompenses totales",
  completionRate: "Taux d'achèvement",
  activeProgram: "Programme actif",
  accumulatedEarnings: "Gains cumulés",
  withdraw: "Retirer",
  withdrawing: "Retrait en cours...",
  noRewardsAvailable: "Aucune récompense disponible",
  noRewardsToWithdraw: "Vous n'avez aucune récompense à retirer.",
  walletNotConnected: "Portefeuille non connecté",
  connectWalletToWithdraw: "Veuillez connecter votre portefeuille pour retirer vos récompenses.",
  withdrawalSuccessful: "Retrait réussi",
  rewardsSentToWallet: "Vos récompenses ont été envoyées à votre portefeuille",
  withdrawalError: "Une erreur est survenue lors du traitement de votre retrait. Veuillez réessayer.",
  confirmWithdrawal: "Confirmer le retrait",
  confirmWithdrawalMessage: "Veuillez confirmer que vous souhaitez retirer vos récompenses vers votre portefeuille connecté.",
  amountToWithdraw: "Montant à retirer",
  withdrawalCurrency: "Devise",
  receivingWallet: "Portefeuille de réception",
  minimumBalanceNotMet: "Solde minimum non atteint",
  withdrawalMinimumBalance: "Vous avez besoin d'un minimum de 100 USDC pour retirer. Votre solde actuel est de",
  withdrawalNote: "Remarque : Les fonds seront envoyés à votre portefeuille connecté sous forme de jetons USDC.",
  cancel: "Annuler",
  processing: "Traitement",
  confirmAndWithdraw: "Confirmer et retirer",
  featureInDevelopment: "Fonctionnalité en développement",
  withdrawalFeatureComingSoon: "La fonction de retrait est en cours d'implémentation et sera bientôt disponible.",
  withdrawalFailed: "Échec du retrait",
  withdrawalProcessingError: "Une erreur est survenue lors du traitement de votre retrait",
  yourBenefit: "Votre avantage",
  ofAllReturns: "De tous les rendements",
  aprBoost: "Boost APR",
  yourRank: "Votre rang",
  nextRank: "Rang suivant",
  usersNeeded: "Il vous faut {count} de plus pour atteindre {rank}",
  nextMilestone: "Prochain jalon",
  current: "Actuel",

  // Ranks and rank titles
  yourReferralRank: "Votre rang de parrainage",
  keepInvitingFriends: "Continuez d'inviter des amis pour atteindre des rangs supérieurs et débloquer plus d'avantages",
  rankBenefits: "Avantages du rang",
  unlockSpecialPerks: "Débloquez des avantages spéciaux à mesure que vous progressez dans les rangs",

  // Rank names
  Rookie: "Débutant",
  Rabbit: "Lapin",
  Cat: "Chat",
  Dog: "Chien",
  Sentinel: "Sentinelle",
  Phoenix: "Phénix",
  Legend: "Légende",
  Champion: "Champion",
  Advanced: "Avancé",
  Elite: "Élite",

  // Rank benefits
  onePercentRewards: "1% des récompenses des amis",
  basicDashboardAccess: "Accès basique au tableau de bord",
  standardSupport: "Support standard",
  onePointFivePercentRewards: "1,5% des récompenses des amis",
  prioritySupport: "Support prioritaire",
  exclusiveWebinars: "Webinaires exclusifs",
  twoPercentRewards: "2% des récompenses des amis",
  vipSupport: "Support VIP",
  earlyAccess: "Accès anticipé aux nouvelles fonctionnalités",

  // Rank progress section
  youNeed: "Il vous faut",
  moreReferralsToAdvance: "plus de parrainages pour passer au rang suivant",
  // Maximum rank messages
  congratsHighestRank: "Félicitations ! Vous avez atteint notre rang le plus élevé.",
  enjoyChampionBenefits: "Profitez de tous les avantages exclusifs d'être un Champion.",

  // Referred Users section
  loadingReferredUsers: "Chargement de vos utilisateurs parrainés...",
  startReferred: "Partagez votre code de parrainage pour commencer à gagner des récompenses",
  inviteMoreFriends: "Invitez plus d'amis pour passer au rang suivant",
  seeAllRanks: "Voir tous les rangs",

  // Additional properties for "Use Code" section
  referralCodeDetected: "Code de parrainage détecté",
  referralCodeFound: "Nous avons détecté un code de parrainage dans le lien que vous avez utilisé pour accéder à cette page.",
  using: "Utilisation de...",
  useCode: "Utiliser ce code",
  submitting: "Soumission en cours...",

  // Use Referral Code Section
  useReferralCodeTitle: "Utiliser un code de parrainage",
  enterCode: "Entrez le code de parrainage",
  submitCode: "Soumettre le code",
  alreadyReferred: "Vous êtes déjà parrainé",
  referredBy: "Vous avez été parrainé par",
  referredByComplete: "Vous avez été parrainé par {address}",
  referralAprBoostMessage: "Boost APR de 1,0 %. Vos parrainages bénéficient d'un boost APR de 1 % sur toutes leurs positions avec WayBank.",

  // Benefits Section
  referralBenefits: "Avantages du programme de parrainage",
  whenYouUseCode: "Lorsque vous utilisez un code de parrainage",
  aprBoostDescription1: "Vous recevez un boost de 1 % sur l'APR de toutes vos positions, maximisant vos rendements sans frais supplémentaires.",
  whenOthersUseCode: "Lorsque d'autres utilisent votre code",
  passiveIncomeStream: "Vous générez un flux de revenus passif basé sur les commissions générées par vos parrainages.",

  // Referred Users Section
  referredUsersTitle: "Utilisateurs que vous avez parrainés",
  inviteFriends: "Invitez vos amis à nous rejoindre en utilisant votre code de parrainage",
  referralCodeRequired: "Vous devez d'abord créer un code de parrainage",
  address: "Adresse",
  joinDate: "Date d'adhésion",
  status: "Statut",
  rewards: "Récompenses",
  active: "Actif",
  inactive: "Inactif",

  // Stats Cards
  nextTarget: "Prochaine cible",
  progress: "Progrès",
  rewardAtNextLevel: "Récompense au niveau suivant",
  need: "Besoin",
  more: "plus",

  // Benefits Section
  benefitsTitle: "Avantages du programme de parrainage",
  benefitsDescription: "Notre programme de parrainage est conçu pour vous bénéficier, ainsi que les personnes que vous parrainez.",
  commissionRewards: "Récompenses de commission",
  commissionDescription: "Gagnez jusqu'à 4,5 % de commission sur les rendements de vos parrainages, payés en USDC.",
  rankingSystem: "Système de classement",
  rankingDescription: "Progressez dans notre système de classement gamifié avec des niveaux thématiques et des récompenses croissantes.",
  aprBoostDescription: "Vos parrainages bénéficient d'un boost APR de 1 % sur toutes leurs positions avec WayBank.",

  // Additional texts for the benefits section
  networkEffect: "Effet de réseau",
  noLimits: "Aucune limite",
  instantRewards: "Récompenses instantanées",
  winWinSystem: "Système gagnant-gagnant",
  noReferredUsersYet: "Vous n'avez pas encore parrainé d'utilisateurs",
  earningsGrow: "Les gains augmentent à mesure que vos parrainages investissent plus",
  passiveIncomeContinues: "Les revenus passifs continuent tant que vos parrainages restent actifs",
  noHiddenConditions: "Aucune condition cachée",
  secureTransparent: "Sécurisé et transparent",

  // Rewards calculator
  rewardsCalculator: "Calculateur de récompenses de parrainage",
  calculateEarnings: "Calculez vos gains potentiels grâce à notre programme de parrainage",
  numberOfReferrals: "Nombre de parrainages",
  averageInvestment: "Investissement moyen",
  baseAPR: "APR de base",
  timeHorizon: "Horizon temporel",
  years: "ans",
  year: "an",
  potentialEarnings: "Vos gains potentiels",
  totalOver: "Total sur",
  with: "Avec",
  referralsInvesting: "parrainages investissant",
  each: "chacun",
  annualEarnings: "Gains annuels",
  monthlyEarnings: "Gains mensuels",
  commissionRate: "Votre taux de commission",
  rankGivesYou: "Votre rang vous donne un",
  commissionOnEarnings: "taux de commission sur tous les gains générés par vos parrainages.",
  calculator: "Calculatrice",
  earningScenarios: "Scénarios de gains",
  updating: "Mise à jour...",
  refetchData: "Actualiser les données",
  yourCommissionRate: "Votre taux de commission",
  perReferralAnnual: "Par parrainage (Annuel)",
  basedOn: "Basé sur",
  at: "à",
  calculatorUsesRealAPR: "Ce calculateur utilise l'APR moyen réel",
  fromAllActivePositions: "de toutes les positions actives",
  basedOnPlatformAverage: "Basé sur le montant moyen d'investissement de la plateforme de",
  calculatedFrom: "calculé à partir de",
  activePositionsWithLiquidity: "positions actives avec liquidité",
  outOf: "sur un total de",
  totalActivePositions: "positions actives totales",

  // Referral Levels
  referralLevels: "Niveaux de notre programme de parrainage",
  progressThroughRanks: "Progressez à travers ces rangs exclusifs à mesure que votre réseau de parrainage se développe.",
  referrals: "Parrainages",

  // Success Stories
  successStoryTitle: "Témoignages de réussite",
  successStoryDescription: "De vrais utilisateurs partagent leurs expériences avec notre programme de parrainage",
  noLimitUsers: "Aucune limite sur le nombre d'utilisateurs que vous pouvez parrainer",
  averageEarnings: "Gains moyens",
  perYearWithActive: "par an avec 10 parrainages actifs",
  enterpriseInvestor: "Investisseur d'entreprise",
  cryptoEnthusiast: "Enthousiaste de la crypto",
  financialAdvisor: "Conseiller financier",
  referredUsers2: "Utilisateurs parrainés",
  totalEarned: "Total gagné",
  yourSuccessStoryAwaits: "Votre histoire de réussite vous attend",
  joinCommunity: "Rejoignez notre communauté grandissante de parrains à succès. Créez votre code de parrainage dès aujourd'hui et commencez à construire votre flux de revenus passifs.",

  // How It Works Section
  howItWorks: "Comment ça marche",
  stepsToEarn: "3 étapes simples pour commencer à gagner",
  getYourCode: "Obtenez votre code",
  codeAutoGenerated: "Votre code de parrainage est généré automatiquement",
  shareWithFriends: "Partagez avec des amis",
  sendReferralLink: "Envoyez votre lien de parrainage à des amis via n'importe quelle plateforme",
  earnRewards: "Gagnez des récompenses",

  // Errors and messages
  success: "Succès",
  error: "Erreur",
  copied: "Copié !",
  copyToClipboard: "Copier dans le presse-papiers",
  copyReferralLink: "Copier mon lien de parrainage",
  fullReferralCopied: "Lien de parrainage complet copié dans le presse-papiers",
  errorCopying: "Impossible de copier dans le presse-papiers",
  shareText: "Rejoignez WayBank avec mon lien de parrainage et obtenez 1% d'APR supplémentaire",
  errorSharing: "Impossible de partager le lien de parrainage",
  errorNotAuthenticated: "Vous devez connecter votre portefeuille et être authentifié pour utiliser un code de parrainage.",
  errorMissingWallet: "Adresse du portefeuille non fournie",
  errorMissingCode: "Veuillez entrer un code de parrainage valide",
  errorAuthentication: "Un problème est survenu lors de la connexion. Veuillez réessayer.",
  referralCodeCreated: "Code de parrainage créé",
  referralCodeSuccess: "Votre code de parrainage a été créé avec succès",
  referralCodeError: "Une erreur est survenue lors de la création de votre code de parrainage",
  referralCodeUsed: "Vous avez utilisé un code de parrainage avec succès",
  referralCodeUseError: "Une erreur est survenue lors de l'utilisation du code de parrainage",

  // Action buttons
  refresh: "Actualiser",
  getStarted: "Commencer",
  learnMore: "En savoir plus"
};
// Collection of all translations
const translations: Record<Language, ReferralsTranslations> = {
  es,
  en,
  ar,
  pt,
  it,
  fr,
  de,
  hi,
  zh,
  ru
};