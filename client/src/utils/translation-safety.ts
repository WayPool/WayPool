/**
 * Utilidad para acceso seguro a traducciones
 * Esta función ayuda a prevenir errores al acceder a propiedades de traducciones
 * que pueden no estar definidas en ciertos idiomas.
 */

/**
 * Obtiene de forma segura una propiedad de traducción, proporcionando un valor por defecto en caso de que no exista
 * @param translationObject Objeto de traducción (e.j. nftsTranslations[language])
 * @param key Clave de la traducción que se intenta acceder
 * @param defaultValue Valor por defecto en caso de que la traducción no exista
 * @returns La traducción o el valor por defecto
 */
export function getSafeTranslation(
  translationObject: any | undefined,
  key: string,
  defaultValue: string
): string {
  // Si el objeto de traducción no existe, retornar valor por defecto
  if (!translationObject) {
    return defaultValue;
  }
  
  // Si la clave no existe en el objeto, retornar valor por defecto
  if (!translationObject[key]) {
    return defaultValue;
  }
  
  // Retornar la traducción
  return translationObject[key];
}

/**
 * Tabla de traducciones de respaldo en inglés para componentes críticos
 * Proporciona textos en inglés para los casos donde las traducciones fallan
 */
export const defaultEnglishTranslations = {
  dashboard: {
    // Títulos y encabezados
    title: "Dashboard",
    subtitle: "Visualize your liquidity positions and metrics",
    welcome: "Welcome, ",
    overview: "Overview",
    
    // Tarjetas de resumen
    portfolioValue: "Portfolio Value",
    totalDeposited: "Total Deposited",
    totalEarned: "Total Earned",
    averageApr: "Average APR",
    positionsCount: "Positions Count",
    poolsCount: "Pools Count",
    totalRewards: "Total Rewards",
    
    // Calculadora de recompensas
    rewardsSimulatorTitle: "Rewards Simulator",
    rewardsSimulatorDescription: "Calculate potential returns based on your investment parameters",
    selectPool: "Select Pool",
    investmentAmount: "Investment Amount (USDC)",
    priceRangeWidth: "Price Range Width",
    narrowRange: "Narrow (Higher APR, needs frequent rebalancing)",
    wideRange: "Wide (Lower APR, less rebalancing)",
    timeframe: "Timeframe",
    oneMonth: "1 Month",
    threeMonths: "3 Months",
    oneYear: "1 Year",
    estimatedReturns: "Estimated Returns",
    estimatedApr: "Estimated APR",
    estimatedEarnings: "Estimated Earnings",
    feeIncome: "Fee Income",
    priceImpact: "Price Impact",
    impermanentLossRisk: "Impermanent Loss Risk",
    high: "High",
    medium: "Medium",
    low: "Low",
    connectionStatus: "Connection Status",
    connected: "Connected",
    notConnected: "Not Connected",
    connectWallet: "Connect Wallet",
    transferUsdc: "Transfer USDC to WayBank Wallet",
    processingTransfer: "Processing transfer...",
    depositWallet: "Deposit wallet",
    recommended: "Recommended"
  }
};

/**
 * Crea un objeto de traducción seguro con respaldo en inglés
 * Combina el objeto de traducción original con valores por defecto en inglés
 * @param translationSection Sección de traducción (e.j. 'dashboard', 'nfts')
 * @param translations Objeto de traducciones completo
 * @returns Objeto de traducción con valores ingleses como respaldo
 */
export function createSafeTranslationObject(
  translationSection: keyof typeof defaultEnglishTranslations,
  translations: any | undefined
): any {
  // Si las traducciones no existen en absoluto, usar solamente los valores en inglés
  if (!translations) {
    return { ...defaultEnglishTranslations[translationSection] };
  }
  
  // Si la sección específica no existe, usar valores en inglés
  if (!translations[translationSection]) {
    return { ...defaultEnglishTranslations[translationSection] };
  }
  
  // Combinar los valores de respaldo en inglés con las traducciones existentes
  // Las traducciones existentes tienen prioridad sobre los valores en inglés
  return {
    ...defaultEnglishTranslations[translationSection],
    ...translations[translationSection]
  };
}