/**
 * Hook y proveedor para la internacionalización (i18n) de la aplicación
 * Sistema mejorado que usa los archivos de traducción centralizados
 */

import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { SUPPORTED_LANGUAGES, Language as SupportedLanguage, commonWords } from '../translations';

// Tipos de idiomas soportados
export type Language = SupportedLanguage;

// Interfaz para el contexto de traducción
interface TranslationContextType {
  language: Language;
  setLanguage: React.Dispatch<React.SetStateAction<Language>>;
  t: (key: string, defaultValueOrVariables?: string | Record<string, any>, variables?: Record<string, any>) => string;
  getSupportedLanguages: () => Record<string, string>;
  getCommonWord: (word: string) => string;
}

// Valores predeterminados para el contexto
const defaultContextValue: TranslationContextType = {
  language: 'es', // Configurado a español como idioma predeterminado
  setLanguage: () => {},
  t: (key: string, defaultValueOrVariables?: string | Record<string, any>, variables?: Record<string, any>) => {
    if (typeof defaultValueOrVariables === 'string') {
      return defaultValueOrVariables || key;
    }
    return key;
  },
  getSupportedLanguages: () => SUPPORTED_LANGUAGES,
  getCommonWord: (word: string) => word
};

// Creamos el contexto
const TranslationContext = createContext<TranslationContextType>(defaultContextValue);

// Props para el proveedor
interface TranslationProviderProps {
  children: ReactNode;
}

// Diccionario de traducciones para español
const spanishTranslations: Record<string, string> = {
  // General UI
  'Dark Mode': 'Modo Oscuro',
  'Network': 'Red',
  'Connected Network': 'Red conectada',
  'Dashboard': 'Panel',
  'My Positions': 'My Positions',
  
  // Wallet Connection Page
  'wallet.connectTitle': 'Conecta tu Wallet',
  'wallet.connectDescription': 'Para acceder a todas las funcionalidades de la plataforma, necesitas conectar tu wallet. Selecciona tu método preferido de conexión.',
  'wallet.maintenanceMessage': 'Sistema de conexión de wallets en mantenimiento. Estamos rediseñando el sistema desde cero para mejorar la experiencia de usuario.',
  'wallet.maintenanceTitle': 'Mantenimiento del Sistema',
  'wallet.maintenanceDesc': 'Estamos realizando actualizaciones importantes para mejorar tu experiencia de conexión.',
  'wallet.connectOptions': 'Opciones de Conexión',
  'wallet.wayBankWallet': 'Wallet WayBank',
  'wallet.wayBankDesc': 'Usa nuestra wallet custodial integrada',
  'wallet.externalWallet': 'Wallet Externa',
  'wallet.externalDesc': 'Conecta tu MetaMask, WalletConnect, etc.',
  'wallet.scanQR': 'Código QR',
  'wallet.scanDesc': 'Escanea con tu aplicación móvil',
  'wallet.connectButton': 'Conectar',
  'wallet.backToDashboard': 'Volver al Dashboard',
  'wallet.metaMaskDesc': 'Para usuarios de extensión MetaMask',
  'wallet.popularExtensive': 'Popular y extensamente utilizado',
  'wallet.excellentDesktop': 'Excelente para usuarios de escritorio',
  'wallet.easySecure': 'Fácil de usar y seguro',
  'wallet.walletConnectDesc': 'Para aplicaciones móviles y otras wallets',
  'wallet.mobileCompatible': 'Compatible con aplicaciones móviles',
  'wallet.multipleWallets': 'Conecta múltiples wallets diferentes',
  'wallet.qrCodeDesc': 'Para conexión rápida móvil',
  'wallet.scanQRCode': 'Escanea código QR',
  'wallet.quickMobileConnection': 'Conexión móvil rápida',
  'wallet.instantAccess': 'Acceso instantáneo',
  'wallet.coinbaseWalletDesc': 'Para usuarios de Coinbase móvil',
  'wallet.specificCoinbase': 'Específico para Coinbase Wallet',
  'wallet.idealMobile': 'Ideal para usuarios móviles',
  'wallet.instantQRConnection': 'Conexión instantánea vía QR',
  'wallet.inMaintenance': 'En mantenimiento',
  'Add Liquidity': 'Añadir Liquidez',
  'Analytics': 'Analítica',
  'Invoices': 'Facturas',
  'Settings': 'Ajustes',
  'Support': 'Soporte',
  'SuperAdmin': 'SuperAdmin',
  'Red': 'Red',
  'Change': 'Cambiar',
  'View Pools': 'Ver Pools',
  'How It Works': 'Cómo Funciona',
  
  // Rewards Simulator
  'Estimate Your Potential Earnings': 'Estima Tus Ganancias Potenciales',
  'Adjust parameters to simulate your potential returns with liquidity provision': 'Ajusta los parámetros para simular tus retornos potenciales con provisión de liquidez',
  'Liquidity Pool': 'Pool de Liquidez',
  'Select a pool': 'Selecciona un pool',
  'Loading pools...': 'Cargando pools...',
  'Investment Amount (USDC)': 'Cantidad a Invertir (USDC)',
  'Price Range Width': 'Ancho del Rango de Precio',
  'Narrow (Higher APR, requires frequent readjustments)': 'Estrecho (APR más alto, requiere reajustes frecuentes)',
  'Wide (Lower APR, fewer readjustments)': 'Amplio (APR más bajo, menos reajustes)',
  'Time Period': 'Período de Tiempo',
  '1 Month': '1 Mes',
  '3 Months': '3 Meses',
  '1 Year': '1 Año',
  'Estimated Returns': 'Retornos Estimados',
  'estimated APR': 'APR estimado',
  'With adjustment of': 'Con ajuste de',
  'for': 'para',
  'days': 'días',
  'Estimated earnings': 'Ganancias estimadas',
  'Fee income': 'Ingresos por tarifas',
  'Price impact': 'Impacto del precio',
  'Impermanent loss risk': 'Riesgo de pérdida impermanente',
  'High': 'Alto',
  'Medium': 'Medio',
  'Low': 'Bajo',
  'Start investing': 'Comenzar a invertir',
  'Error loading pools': 'Error al cargar los pools',
  'Error loading pool data:': 'Error al cargar datos de pools:',
  'Error loading timeframe adjustments:': 'Error al cargar ajustes de timeframe:',
  
  // Wallet
  'Connect Wallet': 'Conectar Wallet',
  'Connecting...': 'Conectando...',
  'Wallet connected': 'Wallet conectada',
  'Update connection': 'Actualizar conexión',
  'Copy address': 'Copiar dirección',
  'Disconnect': 'Desconectar',
  'Address copied': 'Dirección copiada',
  'The address has been copied to clipboard': 'La dirección ha sido copiada al portapapeles',
  'Connection updated': 'Conexión actualizada',
  'Wallet information has been updated': 'La información de la wallet ha sido actualizada',
  'Could not update': 'No se pudo actualizar',
  'No changes detected or there was an error': 'No se detectaron cambios o hubo un error',
  'Error': 'Error',
  'Could not update the connection': 'No se pudo actualizar la conexión',
  'Successful disconnection': 'Desconexión exitosa',
  'Your wallet has been disconnected': 'Tu wallet ha sido desconectada',
  'Connection error': 'Error de conexión',
  'Could not connect wallet': 'No se pudo conectar la wallet',
  
  // Invoice related
  'Mis facturas': 'Mis facturas',
  'Historial de facturas asociadas a tu wallet': 'Historial de facturas asociadas a tu wallet',
  'No tienes facturas registradas.': 'No tienes facturas registradas.',
  'Nº Factura': 'Nº Factura',
  'Fecha': 'Fecha',
  'Importe': 'Importe',
  'Estado': 'Estado',
  'Método de pago': 'Método de pago',
  'Acciones': 'Acciones',
  'Ver': 'Ver',
  'Factura': 'Factura',
  'Detalles de la factura': 'Detalles de la factura',
  'Pending': 'Pendiente',
  'Paid': 'Pagada',
  'Active': 'Activa',
  'Cancelled': 'Cancelada',
  'Fecha de emisión': 'Fecha de emisión',
  'Fecha de vencimiento': 'Fecha de vencimiento',
  'Fecha de pago': 'Fecha de pago',
  'Datos de pago': 'Datos de pago',
  'Hash de transacción': 'Hash de transacción',
  'Referencia bancaria': 'Referencia bancaria',
  'Información del cliente': 'Información del cliente',
  'Dirección de wallet': 'Dirección de wallet',
  'ID de posición': 'ID de posición',
  'Información de la empresa': 'Información de la empresa',
  'Datos bancarios': 'Datos bancarios',
  'Cerrar': 'Cerrar',
  'Descargar PDF': 'Descargar PDF',
  'Error al cargar las facturas': 'Error al cargar las facturas',
  'Reintentar': 'Reintentar',
  'Listado de todas tus facturas en WayBank': 'Listado de todas tus facturas en WayBank',
  'Bank Transfer': 'Transferencia Bancaria',
  'Wallet Payment': 'Pago con Wallet',
  'Crypto': 'Criptomoneda',
  'Accede a tus facturas': 'Accede a tus facturas',
  'Conecta tu wallet para ver tus facturas': 'Conecta tu wallet para ver tus facturas',
  'Total Facturado': 'Total Facturado',
  'Pendiente de Cobro': 'Pendiente de Cobro',
  'Cobrado': 'Cobrado',
  'Facturas Canceladas': 'Facturas Canceladas',
  'vs mes anterior': 'vs mes anterior',
  'Nº Facturas': 'Nº Facturas',
  'Media': 'Media',
  'Ratio facturación': 'Ratio facturación',
  'facturas': 'facturas',
  'Método más común': 'Método más común',
  'Transferencia': 'Transferencia',
  'Último pago': 'Último pago',
  'Mayor factura': 'Mayor factura',
  'del total': 'del total',
  'Estado facturas': 'Estado facturas',
  'pagadas': 'pagadas',
  'pendientes': 'pendientes',
  'Buscar facturas...': 'Buscar facturas...',
  'Perfil de facturación': 'Perfil de facturación',
  'Error al cargar las facturas: ': 'Error al cargar las facturas: ',
  
  // Liquidity Pools Section
  'liquidityPoolsTitle': 'Pools de Liquidez',
  'liquidityPoolsDescription': 'Explora nuestros pools de liquidez Uniswap v4 con datos en tiempo real y estadísticas completas sobre rendimiento y retornos',
  'totalValueLocked': 'Valor Total Bloqueado',
  'totalValueLockedDesc': 'Valor total bloqueado en todos los pools',
  'avgApr': 'APR Promedio',
  'avgAprDesc': 'Tasa porcentual anual promedio',
  '24hVolume': 'Volumen 24h',
  '24hVolumeDesc': 'Volumen total de operaciones en las últimas 24 horas',
  'activePools': 'Pools Activos',
  'activePoolsDesc': 'Número total de pools de liquidez activos',
  'dailyFees': 'Comisiones Diarias',
  'dailyFeesDesc': 'Total de comisiones diarias por operaciones',
  'highestApr': 'APR Más Alto',
  'pool': 'Pool',
  'noPoolsAvailable': 'No hay pools disponibles',
  'volumeTvlRatio': 'Ratio Volumen/TVL',
  'volumeTvlRatioDesc': 'Volumen 24h como % del TVL total',
  'weightedAvgFee': 'Comisión Media Ponderada',
  'weightedAvgFeeDesc': 'Nivel de comisión promedio ponderado por volumen',
  'viewAllPools': 'Ver todos los pools',
  'loading': 'Cargando...',
  
  // Referral Page
  'Grow Together, Earn More': 'Crecer Juntos, Ganar Más',
  'Join our referral program and earn passive income by introducing your network to WayBank\'s advanced DeFi solutions.': 'Únete a nuestro programa de referidos y gana ingresos pasivos presentando tu red a las soluciones DeFi avanzadas de WayBank.',
  'Join Now': 'Únete Ahora',
  'See Benefits': 'Ver Beneficios',
  'Commission Rewards': 'Recompensas por Comisión',
  'Earn up to 4.5% commission on your referrals\' yield earnings, paid in USDC.': 'Gana hasta un 4,5% de comisión sobre los rendimientos de tus referidos, pagados en USDC.',
  'Popular': 'Popular',
  'Ranking System': 'Sistema de Rangos',
  'Progress through our gamified ranking system with themed levels and increasing rewards.': 'Progresa a través de nuestro sistema de rangos gamificado con niveles temáticos y recompensas crecientes.',
  'APR Boost for Friends': 'Impulso de APR para Amigos',
  'Your referrals get a 1% APR boost on all their positions with WayBank.': 'Tus referidos obtienen un impulso del 1% de APR en todas sus posiciones con WayBank.',
  'Referral Rewards Calculator': 'Calculadora de Recompensas de Referidos',
  'Calculate your potential earnings from our referral program': 'Calcula tus ganancias potenciales de nuestro programa de referidos',
  'Number of Referrals': 'Número de Referidos',
  'Average Investment': 'Inversión Promedio',
  'Base APR': 'APR Base',
  'Time Horizon': 'Horizonte Temporal',
  'year(s)': 'año(s)',
  'year': 'año',
  'years': 'años',
  'Your Potential Earnings': 'Tus Ganancias Potenciales',
  'Total Over': 'Total en',
  'With': 'Con',
  'referrals investing': 'referidos invirtiendo',
  'each': 'cada uno',
  'Annual Earnings': 'Ganancias Anuales',
  'Monthly Earnings': 'Ganancias Mensuales',
  'Your Commission Rate': 'Tu Tasa de Comisión',
  'Your rank gives you': 'Tu rango te da una',
  'commission rate on all earnings generated by your referrals.': 'tasa de comisión sobre todas las ganancias generadas por tus referidos.',
  'Benefits for Everyone': 'Beneficios para Todos',
  'Our referral program is designed to benefit both you and the people you refer.': 'Nuestro programa de referidos está diseñado para beneficiar tanto a ti como a las personas que refieres.',
  'For Referrers': 'Para Referidores',
  'Passive Income': 'Ingresos Pasivos',
  'Earn ongoing commission from your referrals\' yield as long as they remain active.': 'Gana comisiones continuas del rendimiento de tus referidos mientras permanezcan activos.',
  'Ranking Progression': 'Progresión de Rango',
  'Advance through exclusive levels with increasing commission rates.': 'Avanza a través de niveles exclusivos con tasas de comisión crecientes.',
  'No Investment Required': 'Sin Inversión Requerida',
  'Start earning without any initial capital - just share your referral link.': 'Comienza a ganar sin capital inicial - solo comparte tu enlace de referido.',
  'Real-Time Tracking': 'Seguimiento en Tiempo Real',
  'Monitor your earnings and referral performance through our dashboard.': 'Monitorea tus ganancias y rendimiento de referidos a través de nuestro panel.',
  'For Referred Users': 'Para Usuarios Referidos',
  'APR Boost': 'Impulso de APR',
  'Get a 1% APR boost on all your positions when you join through a referral.': 'Obtén un impulso del 1% de APR en todas tus posiciones cuando te unes a través de un referido.',
  'Lower Entry Barrier': 'Menor Barrera de Entrada',
  'Access to exclusive educational resources and personalized onboarding support.': 'Acceso a recursos educativos exclusivos y soporte de incorporación personalizado.',
  'Staking Bonuses': 'Bonificaciones de Staking',
  'Qualify for special staking rewards with enhanced protections.': 'Calificas para recompensas especiales de staking con protecciones mejoradas.',
  'Continuous Support': 'Soporte Continuo',
  'Get priority support and guidance from your referrer and our team.': 'Obtén soporte prioritario y orientación de tu referente y nuestro equipo.',
  'Join Our Growing Community': 'Únete a Nuestra Comunidad Creciente',
  'Start earning passive income today by sharing the benefits of WayBank with your network.': 'Comienza a ganar ingresos pasivos hoy compartiendo los beneficios de WayBank con tu red.',
  'Get My Referral Link': 'Obtener Mi Enlace de Referido',
  'Learn About Levels': 'Conocer los Niveles',
  'Our Referral Program Levels': 'Niveles de Nuestro Programa de Referidos',
  'Progress through these exclusive ranks as your referral network grows.': 'Progresa a través de estos rangos exclusivos a medida que crece tu red de referidos.',
  'Referrals': 'Referidos',
  'Commission Rate': 'Tasa de Comisión',
  'Benefits': 'Beneficios',
  'What Our Referrers Say': 'Lo Que Dicen Nuestros Referidores',
  'Real experiences from members of our referral program.': 'Experiencias reales de miembros de nuestro programa de referidos.',
  'Frequently Asked Questions': 'Preguntas Frecuentes',
  'Find answers to common questions about our referral program.': 'Encuentra respuestas a preguntas comunes sobre nuestro programa de referidos.',
  'Ready to Start Earning?': 'Listo para Comenzar a Ganar?',
  'Join our referral program today and start earning passive income while helping others discover the benefits of WayBank.': 'Únete a nuestro programa de referidos hoy y comienza a ganar ingresos pasivos mientras ayudas a otros a descubrir los beneficios de WayBank.',
  'Email Address': 'Correo Electrónico',
  'Subscribe for Updates': 'Suscribirse para Actualizaciones',
  'Terms & Conditions': 'Términos y Condiciones',
  'Privacy Policy': 'Política de Privacidad',
  'FAQ': 'Preguntas Frecuentes',
  'Start Earning Today': 'Comienza a Ganar Hoy',
  'Get Updates on Our Referral Program': 'Recibe Actualizaciones de Nuestro Programa de Referidos',
  'Your email address': 'Tu correo electrónico',
  'Subscribe': 'Suscribirse',
  'How does the referral program work?': '¿Cómo funciona el programa de referidos?',
  'How much can I earn?': '¿Cuánto puedo ganar?',
  'When and how do I get paid?': '¿Cuándo y cómo me pagan?',
  'Sign Up Now': 'Regístrate Ahora',
  'Join thousands of users already benefiting from our referral program. Sign up, share your code, and start earning.': 'Únete a miles de usuarios que ya se benefician de nuestro programa de referidos. Regístrate, comparte tu código y comienza a ganar.',
  'Learn More': 'Conoce Más',
  'Sign Up & See All Ranks': 'Regístrate y Ve Todos los Rangos',
  'View all 7 ranking levels and their benefits by signing up for WayBank.': 'Descubre los 7 niveles de rango y sus beneficios registrándote en WayBank.',
  'Success Stories': 'Historias de Éxito',
  'Hear from our top referrers and learn how they\'ve built their passive income stream.': 'Escucha a nuestros mejores referidores y aprende cómo han construido su fuente de ingresos pasivos.',
  'Once you sign up for WayBank, you\'ll get a unique referral code. Share this code with friends, and when they join using your code, you\'ll earn ongoing commissions from their yield earnings while they receive a 1% APR boost.': 'Una vez que te registres en WayBank, obtendrás un código de referido único. Comparte este código con amigos, y cuando se unan usando tu código, ganarás comisiones continuas de sus ganancias mientras ellos reciben un impulso del 1% en el APR.',
  'Your earnings depend on your referrals\' investment amount, the yield they generate, and your commission rate. Commission rates start at 1% and increase up to 4.5% as you progress through our ranking system by referring more users.': 'Tus ganancias dependen del monto de inversión de tus referidos, el rendimiento que generan y tu tasa de comisión. Las tasas de comisión comienzan en 1% y aumentan hasta 4.5% a medida que progresas en nuestro sistema de rangos al referir más usuarios.',
  'Commissions accumulate in real-time and are displayed on your dashboard. You can withdraw your earnings in USDC once you\'ve accumulated at least 100 USDC. Withdrawals process within 24 hours directly to your connected wallet.': 'Las comisiones se acumulan en tiempo real y se muestran en tu panel. Puedes retirar tus ganancias en USDC una vez que hayas acumulado al menos 100 USDC. Los retiros se procesan dentro de las 24 horas directamente a tu wallet conectada.',
  'Do my referrals lose any yield to pay my commission?': '¿Mis referidos pierden rendimiento para pagar mi comisión?',
  'No! This is what makes our program special. Your commission is paid by WayBank, not deducted from your referrals\' earnings. In fact, they receive a 1% APR boost, making it beneficial for them to use your referral code.': '¡No! Esto es lo que hace especial a nuestro programa. Tu comisión es pagada por WayBank, no se deduce de las ganancias de tus referidos. De hecho, ellos reciben un impulso del 1% en el APR, lo que hace beneficioso para ellos usar tu código de referido.',
  'How long do I earn commissions?': '¿Durante cuánto tiempo gano comisiones?',
  'You earn commissions as long as your referrals have active positions with WayBank. There\'s no time limit - it\'s truly passive income that can last for years.': 'Ganas comisiones mientras tus referidos tengan posiciones activas con WayBank. No hay límite de tiempo - es un ingreso verdaderamente pasivo que puede durar años.',
  'What happens if I reach Champion rank?': '¿Qué sucede si alcanzo el rango de Campeón?',
  'Champion rank (1000+ referrals) gives you our maximum 4.5% commission rate, priority support, early access to new features, exclusive events, and custom benefits tailored to top referrers. You\'ll also be featured in our success stories if you choose.': 'El rango de Campeón (1000+ referidos) te otorga nuestra tasa máxima de comisión del 4.5%, soporte prioritario, acceso anticipado a nuevas funciones, eventos exclusivos y beneficios personalizados adaptados a los mejores referidores. También serás destacado en nuestras historias de éxito si así lo deseas.',
  'Commission': 'Comisión',
  'I\'ve been earning over $3,500 monthly in passive income through WayBank\'s referral program. As a crypto influencer, the transparent commission structure and real-time dashboard have made it easy to track my earnings.': 'He estado ganando más de $3,500 mensuales en ingresos pasivos a través del programa de referidos de WayBank. Como influencer de criptomonedas, la estructura de comisiones transparente y el panel en tiempo real han facilitado el seguimiento de mis ganancias.',
  'What I love most is that my friends get a 1% APR boost - it\'s a win-win. I started with just my close network and have grown to Dog rank in 3 months. The gamification makes it fun to track progress!': 'Lo que más me gusta es que mis amigos obtienen un impulso del 1% en el APR - es un beneficio mutuo. Comencé solo con mi red cercana y he crecido al rango de Perro en 3 meses. ¡La gamificación hace que sea divertido seguir el progreso!',
  'As a DeFi advisor, I\'ve generated over $45,000 in commissions since joining the program last year. My clients appreciate the APR boost, and I love how the increasing commission tiers reward my ongoing efforts.': 'Como asesor de DeFi, he generado más de $45,000 en comisiones desde que me uní al programa el año pasado. Mis clientes aprecian el impulso de APR, y me encanta cómo los niveles crecientes de comisión recompensan mis esfuerzos continuos.',
  'Calculator': 'Calculadora',
  'Earn ${(1 + (referralRankLevels.indexOf(rank) * 0.5)).toFixed(1)}% commission on all referrals\' yields': 'Gana ${(1 + (referralRankLevels.indexOf(rank) * 0.5)).toFixed(1)}% de comisión sobre todos los rendimientos de tus referidos',
  'Calculate Your Potential Earnings': 'Calcula Tus Ganancias Potenciales',
  'Use our calculator to see how much you could earn through our referral program.': 'Usa nuestra calculadora para ver cuánto podrías ganar a través de nuestro programa de referidos.',
  'Intelligent liquidity optimization on Uniswap V4 with a rewarding referral program.': 'Optimización inteligente de liquidez en Uniswap V4 con un programa de referidos gratificante.'
};

// Diccionario de traducciones para inglés
const englishTranslations: Record<string, string> = {
  // Position cooling periods
  'positions.cooldownActive': 'Cooldown period active. You can collect fees again in {{days}} days.',
  'positions.monthlyTimeframe': 'Monthly positions have a 30-day cooldown period.',
  'positions.quarterlyTimeframe': 'Quarterly positions have a 90-day cooldown period.',
  'positions.yearlyTimeframe': 'Annual positions have a 365-day cooldown period.',
  'positions.customTimeframe': 'This position has a {{days}}-day cooldown period.',
  
  // General UI
  'Dark Mode': 'Dark Mode',
  'Network': 'Network',
  'Connected Network': 'Connected Network',
  'Dashboard': 'Dashboard',
  'My Positions': 'My Positions',
  'Add Liquidity': 'Add Liquidity',
  'Analytics': 'Analytics',
  'Invoices': 'Invoices',
  'Settings': 'Settings',
  'Support': 'Support',
  'SuperAdmin': 'SuperAdmin',
  'Red': 'Network',
  'Change': 'Change',
  'View Pools': 'View Pools',
  
  // Rewards Simulator
  'Estimate Your Potential Earnings': 'Estimate Your Potential Earnings',
  'Adjust parameters to simulate your potential returns with liquidity provision': 'Adjust parameters to simulate your potential returns with liquidity provision',
  'Liquidity Pool': 'Liquidity Pool',
  'Select a pool': 'Select a pool',
  'Loading pools...': 'Loading pools...',
  'Investment Amount (USDC)': 'Investment Amount (USDC)',
  'Price Range Width': 'Price Range Width',
  'Narrow (Higher APR, requires frequent readjustments)': 'Narrow (Higher APR, requires frequent readjustments)',
  'Wide (Lower APR, fewer readjustments)': 'Wide (Lower APR, fewer readjustments)',
  'Time Period': 'Time Period',
  '1 Month': '1 Month',
  '3 Months': '3 Months',
  '1 Year': '1 Year',
  'Estimated Returns': 'Estimated Returns',
  'estimated APR': 'estimated APR',
  'With adjustment of': 'With adjustment of',
  'for': 'for',
  'days': 'days',
  'Estimated earnings': 'Estimated earnings',
  'Fee income': 'Fee income',
  'Price impact': 'Price impact',
  'Impermanent loss risk': 'Impermanent loss risk',
  'High': 'High',
  'Medium': 'Medium',
  'Low': 'Low',
  'Start investing': 'Start investing',
  'Error loading pools': 'Error loading pools',
  'Error loading pool data:': 'Error loading pool data:',
  'Error loading timeframe adjustments:': 'Error loading timeframe adjustments:',
  
  // Wallet
  'Connect Wallet': 'Connect Wallet',
  'Connecting...': 'Connecting...',
  'Wallet connected': 'Wallet connected',
  'Update connection': 'Update connection',
  'Copy address': 'Copy address',
  'Disconnect': 'Disconnect',
  'Address copied': 'Address copied',
  'The address has been copied to clipboard': 'The address has been copied to clipboard',
  'Connection updated': 'Connection updated',
  'Wallet information has been updated': 'Wallet information has been updated',
  'Could not update': 'Could not update',
  'No changes detected or there was an error': 'No changes detected or there was an error',
  'Error': 'Error',
  'Could not update the connection': 'Could not update the connection',
  'Successful disconnection': 'Successful disconnection',
  'Your wallet has been disconnected': 'Your wallet has been disconnected',
  'Connection error': 'Connection error',
  'Could not connect wallet': 'Could not connect wallet',
  
  // Invoice related
  'Mis facturas': 'My Invoices',
  'Historial de facturas asociadas a tu wallet': 'Invoice history associated with your wallet',
  'No tienes facturas registradas.': 'You don\'t have any registered invoices.',
  'Nº Factura': 'Invoice #',
  'Fecha': 'Date',
  'Importe': 'Amount',
  'Estado': 'Status',
  'Método de pago': 'Payment Method',
  'Acciones': 'Actions',
  'Ver': 'View',
  'Factura': 'Invoice',
  'Detalles de la factura': 'Invoice details',
  'Pending': 'Pending',
  'Paid': 'Paid',
  'Active': 'Active',
  'Cancelled': 'Cancelled',
  'Fecha de emisión': 'Issue date',
  'Fecha de vencimiento': 'Due date',
  'Fecha de pago': 'Payment date',
  'Datos de pago': 'Payment details',
  'Hash de transacción': 'Transaction hash',
  'Referencia bancaria': 'Bank reference',
  'Información del cliente': 'Customer information',
  'Dirección de wallet': 'Wallet address',
  'ID de posición': 'Position ID',
  'Información de la empresa': 'Company information',
  'Datos bancarios': 'Bank details',
  'Cerrar': 'Close',
  'Descargar PDF': 'Download PDF',
  'Error al cargar las facturas': 'Error loading invoices',
  'Reintentar': 'Retry',
  'Listado de todas tus facturas en WayBank': 'List of all your invoices in WayBank',
  'Bank Transfer': 'Bank Transfer',
  'Wallet Payment': 'Wallet Payment',
  'Crypto': 'Crypto',
  'Accede a tus facturas': 'Access your invoices',
  'Conecta tu wallet para ver tus facturas': 'Connect your wallet to view your invoices',
  'Total Facturado': 'Total Billed',
  'Pendiente de Cobro': 'Pending Collection',
  'Cobrado': 'Collected',
  'Facturas Canceladas': 'Cancelled Invoices',
  'vs mes anterior': 'vs previous month',
  'Nº Facturas': 'Number of Invoices',
  'Media': 'Average',
  'Ratio facturación': 'Billing ratio',
  'facturas': 'invoices',
  'Método más común': 'Most common method',
  'Transferencia': 'Bank Transfer',
  'Último pago': 'Last payment',
  'Mayor factura': 'Largest invoice',
  'del total': 'of total',
  'Estado facturas': 'Invoice status',
  'pagadas': 'paid',
  'pendientes': 'pending',
  'Buscar facturas...': 'Search invoices...',
  'Perfil de facturación': 'Billing Profile',
  'Completa tu información de facturación para agilizar el proceso de generación de facturas': 'Complete your billing information to streamline the invoice generation process',
  'Información para emitir facturas asociadas a tu cuenta': 'Information for issuing invoices associated with your account',
  'Nombre completo': 'Full Name',
  'Empresa (opcional)': 'Company (optional)',
  'NIF/CIF/VAT (opcional)': 'NIF/CIF/VAT (optional)',
  'Número de identificación fiscal para la factura': 'Tax identification number for the invoice',
  'Dirección (opcional)': 'Address (optional)',
  'Ciudad (opcional)': 'City (optional)',
  'Código postal (opcional)': 'Postal code (optional)',
  'País': 'Country',
  'Teléfono (opcional)': 'Phone (optional)',
  'Correo electrónico (opcional)': 'Email (optional)',
  'Notas adicionales (opcional)': 'Additional notes (optional)',
  'Guardar perfil': 'Save profile',
  'Perfil verificado': 'Profile verified',
  'Este perfil ha sido verificado en blockchain el': 'This profile has been verified through blockchain on',
  'Verificación rechazada': 'Verification rejected',
  'La verificación de este perfil ha sido rechazada. Por favor contacta a soporte.': 'The verification of this profile has been rejected. Please contact support.',
  'Perfil pendiente de verificación': 'Profile pending verification',
  'Para mayor seguridad, verifica tu perfil firmando un mensaje con tu wallet': 'For added security, verify your profile by signing a message with your wallet',
  'Conecta tu wallet para acceder a tu perfil de facturación': 'Connect your wallet to access your billing profile',
  'Verificado': 'Verified',
  'Rechazado': 'Rejected',
  'Pendiente': 'Pending',
  'Cargando perfil...': 'Loading profile...',
  'Perfil guardado': 'Profile saved',
  'Tu perfil de facturación ha sido guardado correctamente': 'Your billing profile has been saved successfully',
  'No se pudo guardar el perfil de facturación': 'Could not save the billing profile',
  'Se requiere conexión de wallet para verificar el perfil': 'Wallet connection is required to verify the profile',
  'Tu perfil ha sido verificado correctamente usando blockchain': 'Your profile has been successfully verified using blockchain',
  'Verificación cancelada': 'Verification canceled',
  'Usuario denegó la solicitud de firma': 'User denied the signature request',
  'No se pudo verificar el perfil': 'Could not verify the profile',
  'Error al cargar las facturas: ': 'Error loading invoices: ',
  'Perfil seleccionado': 'Profile selected',
  'El perfil de facturación ha sido seleccionado correctamente': 'The billing profile has been successfully selected',
  'Perfil creado y asignado': 'Profile created and assigned',
  'El nuevo perfil de facturación ha sido creado y asignado a la factura': 'The new billing profile has been created and assigned to the invoice',
  'El perfil se creó correctamente pero no se pudo asignar a la factura': 'The profile was created successfully but could not be assigned to the invoice',
  'Perfil creado': 'Profile created',
  'El nuevo perfil de facturación ha sido creado correctamente': 'The new billing profile has been created successfully',
  'Perfil asignado': 'Profile assigned',
  'El perfil de facturación ha sido asignado correctamente a la factura': 'The billing profile has been successfully assigned to the invoice',
  'No se pudo asignar el perfil a la factura': 'Could not assign profile to the invoice',
  'No hay perfil de facturación seleccionado': 'No billing profile selected',
  'Seleccionar perfil': 'Select profile',
  'Cambiar': 'Change',
  'NIF/CIF': 'Tax ID',
  'Email': 'Email',
  'Dirección': 'Address',
  'Ciudad': 'City',
  'Datos de facturación': 'Billing information',
  'Seleccionar perfil de facturación': 'Select billing profile',
  'Selecciona un perfil existente o crea uno nuevo para la factura': 'Select an existing profile or create a new one for the invoice',
  'Perfiles existentes': 'Existing profiles',
  'Crear nuevo perfil': 'Create new profile',
  'Crear nuevo perfil de facturación': 'Create new billing profile',
  'Introduce los datos para el nuevo perfil de facturación': 'Enter the data for the new billing profile',
  'Error al cargar el perfil': 'Error loading profile',
  'No se pudo cargar el perfil de facturación. Intente nuevamente.': 'Could not load the billing profile. Please try again.',
  // Pools page
  'Liquidity Pools': 'Liquidity Pools',
  'Refreshing pool data...': 'Actualizando datos del pool...',
  'Fetching the latest data from the blockchain': 'Obteniendo los datos más recientes de la blockchain',
  'Data refreshed': 'Datos actualizados',
  'Pool data has been updated with the latest information': 'Los datos del pool han sido actualizados con la información más reciente',
  'Est. anual': 'Est. anual',
  'Daily fees': 'Comisiones diarias',
  'of TVL': 'del TVL',
  'Real': 'Real',
  'Pool Type': 'Tipo de Pool',
  'Concentrated': 'Concentrado',
  'Price Impact': 'Impacto de Precio',
  'Low': 'Bajo',
  'Liquidity': 'Liquidez',
  '24h Volume': 'Volumen 24h',
  'Volume History (7d)': 'Historial de Volumen (7d)',
  'Add Liquidity': 'Añadir Liquidez',
  'View Pool Details': 'Ver Detalles del Pool',
  'Error loading pools': 'Error al cargar los pools',
  'There was a problem getting the data': 'Hubo un problema al obtener los datos',
  'Retry': 'Reintentar',
  'No pools found': 'No se encontraron pools',
  'Try changing filters or search terms': 'Intenta cambiar los filtros o términos de búsqueda',
  'Total Trading Volume Last 24 Hours': 'Volumen Total de Operaciones Últimas 24 Horas',
  'Total Number of Active Liquidity Pools': 'Número Total de Pools Activos',
  'Volume/TVL': 'Volumen/TVL',
  '24h Volume as % of Total TVL': 'Volumen 24h como % del TVL Total',
  'Volume-Weighted Average Fee Tier': 'Nivel de Comisión Promedio Ponderado por Volumen',
  'Fee Tier': 'Nivel de Comisión',
  'en': 'in',
  
  // Support page
  'Soporte': 'Support',
  'Nuevo Ticket': 'New Ticket',
  'Actualizar': 'Refresh',
  'Mis Tickets': 'My Tickets',
  'Visualiza y gestiona tus solicitudes de soporte': 'View and manage your support requests',
  'No tienes tickets de soporte activos.': 'You don\'t have any active support tickets.',
  'Crear nuevo ticket': 'Create new ticket',
  'Lista de tus tickets de soporte': 'List of your support tickets',
  'Ticket #': 'Ticket #',
  'Asunto': 'Subject',
  'Categoría': 'Category',
  'Prioridad': 'Priority',
  'Actualizado': 'Updated',
  'Baja': 'Low',
  'Alta': 'High',
  'Urgente': 'Urgent',
  'Abierto': 'Open',
  'En progreso': 'In Progress',
  'Resuelto': 'Resolved',
  'Cerrado': 'Closed',
  'Crear Nuevo Ticket': 'Create New Ticket',
  'Completa el formulario para generar una nueva solicitud de soporte': 'Complete the form to generate a new support request',
  'Describe brevemente tu problema': 'Briefly describe your problem',
  'Descripción': 'Description',
  'Explica detalladamente tu problema o consulta': 'Explain your problem or query in detail',
  'Selecciona una categoría': 'Select a category',
  'Soporte Técnico': 'Technical Support',
  'Problemas de Cuenta': 'Account Issues',
  'Problemas de Pago': 'Payment Problems',
  'Solicitud de Funcionalidad': 'Feature Request',
  'Consulta General': 'General Question',
  'Selecciona una prioridad': 'Select a priority',
  'Cancelar': 'Cancel',
  'Crear Ticket': 'Create Ticket',
  'Campos faltantes': 'Missing fields',
  'Por favor complete todos los campos requeridos.': 'Please complete all required fields.',
  'Ticket creado': 'Ticket created',
  'Tu ticket de soporte ha sido creado exitosamente.': 'Your support ticket has been created successfully.',
  'Detalles del Ticket': 'Ticket Details',
  'Enviar Mensaje': 'Send Message',
  'Escribe tu mensaje aquí...': 'Write your message here...',
  'Mensaje vacío': 'Empty message',
  'Por favor ingrese un mensaje para enviar.': 'Please enter a message to send.',
  'Mensaje enviado': 'Message sent',
  'Tu mensaje ha sido enviado exitosamente.': 'Your message has been sent successfully.',
  'Cerrar Ticket': 'Close Ticket',
  'Reabrir Ticket': 'Reopen Ticket',
  'Ticket actualizado': 'Ticket updated',
  'El estado del ticket ha sido actualizado.': 'The ticket status has been updated.',
  'Error al cargar tickets': 'Error loading tickets',
  'Error al cargar mensajes': 'Error loading messages',
  'general': 'general',
  'Account Issues': 'Account Issues',
  'Technical Support': 'Technical Support',
  
  // Positions Page
  'positions.myPositions': 'My Positions',
  'positions.trackAndManage': 'Track and manage your active liquidity positions',
  'positions.totalLiquidity': 'Total Liquidity',
  'positions.totalLiquidityTooltip': 'Total value of your active liquidity positions, including invested capital and generated fees.',
  'positions.totalFeesEarned': 'Total Fees Earned',
  'positions.totalFeesEarnedTooltip': 'Total accumulated fees to date, including pending and already collected fees.',
  'positions.activePositions': 'Active Positions',
  'positions.positionAnalytics': 'Position Analytics',
  'positions.realTime': 'Real Time',
  'positions.averageAPR': 'Average APR',
  'positions.averageAPRTooltip': 'Weighted average APR across all your active positions.',
  'positions.investedCapital': 'Invested Capital',
  'positions.dailyEarnings': 'Daily Earnings',
  'positions.dailyEarningsTooltip': 'Estimated daily earnings based on current APR.',
  'positions.timeToMaturity': 'Time to Maturity',
  'positions.timeToMaturityTooltip': 'Average remaining time until positions reach maturity date.',
  'positions.notAvailable': 'N/A',
  'positions.day': 'day',
  'positions.poolDistribution': 'Pool Distribution',
  'positions.poolDistributionTooltip': 'Distribution of your capital across different liquidity pools.',
  'positions.byCapital': 'By capital',
  'positions.performanceByPool': 'Performance by Pool',
  'positions.performanceByPoolTooltip': 'APR comparison across different pools you have invested in.',
  'positions.noActivePositions': 'No hay posiciones activas',
  'positions.filterAll': 'Todos',
  'positions.filterActive': 'Activos',
  'positions.filterPending': 'Pendientes',
  'positions.filterFinalized': 'Finalizados',
  'positions.searchPositions': 'Buscar posiciones...',
  'positions.refresh': 'Actualizar',
  'positions.newPosition': 'Nueva Posición',
  'positions.militaryGradeSecurity': 'Seguridad de nivel militar',
  'positions.securityDescription': 'Conexiones cifradas E2E con los más altos estándares criptográficos. Las claves privadas nunca salen de tu dispositivo.',
  'positions.neverStoreKeys': 'Nunca almacenamos tus claves privadas.',
  'positions.credentialsOnDevice': 'Todas las credenciales se mantienen exclusivamente en tu dispositivo y la autenticación se realiza mediante firmas criptográficas seguras.',
  'positions.verifiableConnections': 'Conexiones verificables y auditadas.',
  'positions.auditedCode': 'Nuestro código de conexión de wallet es completamente auditado por empresas de ciberseguridad y utiliza protocolos estándar de la industria.',
  'positions.completeControl': 'Control completo sobre las transacciones.',
  'positions.explicitApproval': 'Cada transacción requiere tu aprobación explícita y puedes revisar todos los detalles antes de confirmar cualquier operación.',
  'positions.openMenu': 'Abrir menú',
  'positions.collectFeesWait': 'Cobrar Comisiones (Espera {{days}} días)',
  'positions.collectFees': 'Cobrar Comisiones',
  'positions.addressCopied': 'Dirección copiada',
  'positions.poolAddressCopied': 'Dirección del pool copiada al portapapeles',
  'positions.copyPoolAddress': 'Copiar Dirección del Pool',
  'positions.viewOnEtherscan': 'Ver en Etherscan',
  'positions.viewOnUniswap': 'Ver en Uniswap',

  // More Position Card Translations
  'positions.initialValue': 'Initial Value',
  'positions.apr': 'APR',
  'positions.accumulatedFees': 'Accumulated Fees',
  'positions.historicalTotal': 'Historical total',
  'positions.estEarnings': 'Est. Earnings',
  'positions.contractPeriod': 'Contract Period',
  'positions.createdOn': 'Created on',
  'positions.ilRisk': 'IL Risk',
  'positions.low': 'Low',
  'positions.medium': 'Medium',
  'positions.high': 'High',
  'positions.collecting': 'Collecting...',
  'positions.waitDaysToCollect': 'Wait {{days}} days for next collection',
  'positions.collectFeesAmount': 'Collect {{amount}} in Fees',
  'positions.cooldownActive': 'Cooldown period active. You can collect fees again in {{days}} days.',
  'positions.monthlyTimeframe': 'Monthly positions have a 30-day cooldown period.',
  'positions.quarterlyTimeframe': 'Quarterly positions have a 90-day cooldown period.',
  'positions.yearlyTimeframe': 'Annual positions have a 365-day cooldown period.',
  'positions.customTimeframe': 'This position has a {{days}}-day cooldown period.',
  
  // Liquidity Pools Section
  'liquidityPoolsTitle': 'Liquidity Pools',
  'liquidityPoolsDescription': 'Explore our Uniswap v4 liquidity pools with real-time data and comprehensive statistics on performance and returns',
  'totalValueLocked': 'Total Value Locked',
  'totalValueLockedDesc': 'Total value locked across all pools',
  'avgApr': 'Average APR',
  'avgAprDesc': 'Average annual percentage rate',
  '24hVolume': '24h Volume',
  '24hVolumeDesc': 'Total trading volume in the last 24 hours',
  'activePools': 'Active Pools',
  'activePoolsDesc': 'Total number of active liquidity pools',
  'dailyFees': 'Daily Fees',
  'dailyFeesDesc': 'Total daily trading fees',
  'highestApr': 'Highest APR',
  'pool': 'Pool',
  'noPoolsAvailable': 'No pools available',
  'volumeTvlRatio': 'Volume/TVL Ratio',
  'volumeTvlRatioDesc': '24h volume as % of total TVL',
  'weightedAvgFee': 'Weighted Avg Fee',
  'weightedAvgFeeDesc': 'Volume-weighted average fee tier',
  'viewAllPools': 'View all pools',
  'loading': 'Loading...',
  
  // Referral Page
  'Grow Together, Earn More': 'Grow Together, Earn More',
  'Join our referral program and earn passive income by introducing your network to WayBank\'s advanced DeFi solutions.': 'Join our referral program and earn passive income by introducing your network to WayBank\'s advanced DeFi solutions.',
  'How It Works': 'How It Works',
  'Join Now': 'Join Now',
  'See Benefits': 'See Benefits',
  'Commission Rewards': 'Commission Rewards',
  'Earn up to 4.5% commission on your referrals\' yield earnings, paid in USDC.': 'Earn up to 4.5% commission on your referrals\' yield earnings, paid in USDC.',
  'Popular': 'Popular',
  'Ranking System': 'Ranking System',
  'Progress through our gamified ranking system with themed levels and increasing rewards.': 'Progress through our gamified ranking system with themed levels and increasing rewards.',
  'APR Boost for Friends': 'APR Boost for Friends',
  'Your referrals get a 1% APR boost on all their positions with WayBank.': 'Your referrals get a 1% APR boost on all their positions with WayBank.',
  'Referral Rewards Calculator': 'Referral Rewards Calculator',
  'Calculate your potential earnings from our referral program': 'Calculate your potential earnings from our referral program',
  'Number of Referrals': 'Number of Referrals',
  'Average Investment': 'Average Investment',
  'Base APR': 'Base APR',
  'Time Horizon': 'Time Horizon',
  'year(s)': 'year(s)',
  'year': 'year',
  'years': 'years',
  'Your Potential Earnings': 'Your Potential Earnings',
  'Total Over': 'Total Over',
  'With': 'With',
  'referrals investing': 'referrals investing',
  'each': 'each',
  'Annual Earnings': 'Annual Earnings',
  'Monthly Earnings': 'Monthly Earnings',
  'Your Commission Rate': 'Your Commission Rate',
  'Your rank gives you': 'Your rank gives you',
  'commission rate on all earnings generated by your referrals.': 'commission rate on all earnings generated by your referrals.',
  'Benefits for Everyone': 'Benefits for Everyone',
  'Our referral program is designed to benefit both you and the people you refer.': 'Our referral program is designed to benefit both you and the people you refer.',
  'For Referrers': 'For Referrers',
  'Passive Income': 'Passive Income',
  'Earn ongoing commission from your referrals\' yield as long as they remain active.': 'Earn ongoing commission from your referrals\' yield as long as they remain active.',
  'Ranking Progression': 'Ranking Progression',
  'Advance through exclusive levels with increasing commission rates.': 'Advance through exclusive levels with increasing commission rates.',
  'No Investment Required': 'No Investment Required',
  'Start earning without any initial capital - just share your referral link.': 'Start earning without any initial capital - just share your referral link.',
  'Real-Time Tracking': 'Real-Time Tracking',
  'Monitor your earnings and referral performance through our dashboard.': 'Monitor your earnings and referral performance through our dashboard.',
  'For Referred Users': 'For Referred Users',
  'APR Boost': 'APR Boost',
  'Get a 1% APR boost on all your positions when you join through a referral.': 'Get a 1% APR boost on all your positions when you join through a referral.',
  'Lower Entry Barrier': 'Lower Entry Barrier',
  'Access to exclusive educational resources and personalized onboarding support.': 'Access to exclusive educational resources and personalized onboarding support.',
  'Staking Bonuses': 'Staking Bonuses',
  'Qualify for special staking rewards with enhanced protections.': 'Qualify for special staking rewards with enhanced protections.',
  'Continuous Support': 'Continuous Support',
  'Get priority support and guidance from your referrer and our team.': 'Get priority support and guidance from your referrer and our team.',
  'Join Our Growing Community': 'Join Our Growing Community',
  'Start earning passive income today by sharing the benefits of WayBank with your network.': 'Start earning passive income today by sharing the benefits of WayBank with your network.',
  'Get My Referral Link': 'Get My Referral Link',
  'Learn About Levels': 'Learn About Levels',
  'Our Referral Program Levels': 'Our Referral Program Levels',
  'Progress through these exclusive ranks as your referral network grows.': 'Progress through these exclusive ranks as your referral network grows.',
  'Referrals': 'Referrals',
  'Commission Rate': 'Commission Rate',
  'Benefits': 'Benefits',
  'What Our Referrers Say': 'What Our Referrers Say',
  'Real experiences from members of our referral program.': 'Real experiences from members of our referral program.',
  'Frequently Asked Questions': 'Frequently Asked Questions',
  'Find answers to common questions about our referral program.': 'Find answers to common questions about our referral program.',
  'Ready to Start Earning?': 'Ready to Start Earning?',
  'Join our referral program today and start earning passive income while helping others discover the benefits of WayBank.': 'Join our referral program today and start earning passive income while helping others discover the benefits of WayBank.',
  'Email Address': 'Email Address',
  'Subscribe for Updates': 'Subscribe for Updates',
  'Terms & Conditions': 'Terms & Conditions',
  'Privacy Policy': 'Privacy Policy',
  'FAQ': 'FAQ',
  'Start Earning Today': 'Comienza a Ganar Hoy',
  'Get Updates on Our Referral Program': 'Get Updates on Our Referral Program',
  'Your email address': 'Your email address',
  'Subscribe': 'Subscribe',
  'How does the referral program work?': 'How does the referral program work?',
  'How much can I earn?': 'How much can I earn?',
  'When and how do I get paid?': 'When and how do I get paid?',
  'Commissions accumulate in real-time and are displayed on your dashboard. You can withdraw your earnings in USDC once you\'ve accumulated at least 100 USDC. Withdrawals process within 24 hours directly to your connected wallet.': 'Commissions accumulate in real-time and are displayed on your dashboard. You can withdraw your earnings in USDC once you\'ve accumulated at least 100 USDC. Withdrawals process within 24 hours directly to your connected wallet.',
  'Do my referrals lose any yield to pay my commission?': 'Do my referrals lose any yield to pay my commission?',
  'No! This is what makes our program special. Your commission is paid by WayBank, not deducted from your referrals\' earnings. In fact, they receive a 1% APR boost, making it beneficial for them to use your referral code.': 'No! This is what makes our program special. Your commission is paid by WayBank, not deducted from your referrals\' earnings. In fact, they receive a 1% APR boost, making it beneficial for them to use your referral code.',
  'How long do I earn commissions?': 'How long do I earn commissions?',
  'You earn commissions as long as your referrals have active positions with WayBank. There\'s no time limit - it\'s truly passive income that can last for years.': 'You earn commissions as long as your referrals have active positions with WayBank. There\'s no time limit - it\'s truly passive income that can last for years.',
  'What happens if I reach Champion rank?': 'What happens if I reach Champion rank?',
  'Champion rank (1000+ referrals) gives you our maximum 4.5% commission rate, priority support, early access to new features, exclusive events, and custom benefits tailored to top referrers. You\'ll also be featured in our success stories if you choose.': 'Champion rank (1000+ referrals) gives you our maximum 4.5% commission rate, priority support, early access to new features, exclusive events, and custom benefits tailored to top referrers. You\'ll also be featured in our success stories if you choose.',
  'Sign Up Now': 'Regístrate Ahora',
  'Join thousands of users already benefiting from our referral program. Sign up, share your code, and start earning.': 'Únete a miles de usuarios que ya se benefician de nuestro programa de referidos. Regístrate, comparte tu código y comienza a ganar.',
  'Learn More': 'Conoce Más',
  'Sign Up & See All Ranks': 'Sign Up & See All Ranks',
  'View all 7 ranking levels and their benefits by signing up for WayBank.': 'View all 7 ranking levels and their benefits by signing up for WayBank.',
  'Success Stories': 'Success Stories',
  'Hear from our top referrers and learn how they\'ve built their passive income stream.': 'Hear from our top referrers and learn how they\'ve built their passive income stream.',
  'Once you sign up for WayBank, you\'ll get a unique referral code. Share this code with friends, and when they join using your code, you\'ll earn ongoing commissions from their yield earnings while they receive a 1% APR boost.': 'Once you sign up for WayBank, you\'ll get a unique referral code. Share this code with friends, and when they join using your code, you\'ll earn ongoing commissions from their yield earnings while they receive a 1% APR boost.',
  'Your earnings depend on your referrals\' investment amount, the yield they generate, and your commission rate. Commission rates start at 1% and increase up to 4.5% as you progress through our ranking system by referring more users.': 'Your earnings depend on your referrals\' investment amount, the yield they generate, and your commission rate. Commission rates start at 1% and increase up to 4.5% as you progress through our ranking system by referring more users.',
  'Commission': 'Commission',
  'I\'ve been earning over $3,500 monthly in passive income through WayBank\'s referral program. As a crypto influencer, the transparent commission structure and real-time dashboard have made it easy to track my earnings.': 'I\'ve been earning over $3,500 monthly in passive income through WayBank\'s referral program. As a crypto influencer, the transparent commission structure and real-time dashboard have made it easy to track my earnings.',
  'What I love most is that my friends get a 1% APR boost - it\'s a win-win. I started with just my close network and have grown to Dog rank in 3 months. The gamification makes it fun to track progress!': 'What I love most is that my friends get a 1% APR boost - it\'s a win-win. I started with just my close network and have grown to Dog rank in 3 months. The gamification makes it fun to track progress!',
  'As a DeFi advisor, I\'ve generated over $45,000 in commissions since joining the program last year. My clients appreciate the APR boost, and I love how the increasing commission tiers reward my ongoing efforts.': 'As a DeFi advisor, I\'ve generated over $45,000 in commissions since joining the program last year. My clients appreciate the APR boost, and I love how the increasing commission tiers reward my ongoing efforts.',
  'Calculator': 'Calculator',
  'Earn ${(1 + (referralRankLevels.indexOf(rank) * 0.5)).toFixed(1)}% commission on all referrals\' yields': 'Earn ${(1 + (referralRankLevels.indexOf(rank) * 0.5)).toFixed(1)}% commission on all referrals\' yields',
  'Calculate Your Potential Earnings': 'Calculate Your Potential Earnings',
  'Use our calculator to see how much you could earn through our referral program.': 'Use our calculator to see how much you could earn through our referral program.',
  'Intelligent liquidity optimization on Uniswap V4 with a rewarding referral program.': 'Intelligent liquidity optimization on Uniswap V4 with a rewarding referral program.'
};

// Diccionario de traducciones para alemán (de)
const germanTranslations: Record<string, string> = {
  // Position cooling periods
  'positions.cooldownActive': 'Abkühlungszeit aktiv. Sie können in {{days}} Tagen erneut Gebühren sammeln.',
  'positions.monthlyTimeframe': 'Monatliche Positionen haben eine Abkühlungszeit von 30 Tagen.',
  'positions.quarterlyTimeframe': 'Vierteljährliche Positionen haben eine Abkühlungszeit von 90 Tagen.',
  'positions.yearlyTimeframe': 'Jährliche Positionen haben eine Abkühlungszeit von 365 Tagen.',
  'positions.customTimeframe': 'Diese Position hat eine Abkühlungszeit von {{days}} Tagen.',
  
  // Referral Page
  'Grow Together, Earn More': 'Gemeinsam wachsen, mehr verdienen',
  'Join our referral program and earn passive income by introducing your network to WayBank\'s advanced DeFi solutions.': 'Nehmen Sie an unserem Empfehlungsprogramm teil und verdienen Sie passives Einkommen, indem Sie Ihr Netzwerk mit den fortschrittlichen DeFi-Lösungen von WayBank bekannt machen.',
  'How It Works': 'Wie es funktioniert',
  'Join Now': 'Jetzt beitreten',
  'See Benefits': 'Vorteile ansehen',
  'Start Earning Today': 'Fangen Sie heute an zu verdienen',
  'Sign Up Now': 'Jetzt anmelden',
  'Join thousands of users already benefiting from our referral program. Sign up, share your code, and start earning.': 'Schließen Sie sich Tausenden von Nutzern an, die bereits von unserem Empfehlungsprogramm profitieren. Melden Sie sich an, teilen Sie Ihren Code und beginnen Sie zu verdienen.',
  'Learn More': 'Mehr erfahren',
  
  // FAQ Section
  'Frequently Asked Questions': 'Häufig gestellte Fragen',
  'Get answers to common questions about our referral program.': 'Erhalten Sie Antworten auf häufig gestellte Fragen zu unserem Empfehlungsprogramm.',
  'How does the referral program work?': 'Wie funktioniert das Empfehlungsprogramm?',
  'Once you sign up for WayBank, you\'ll get a unique referral code. Share this code with friends, and when they join using your code, you\'ll earn ongoing commissions from their yield earnings while they receive a 1% APR boost.': 'Sobald Sie sich bei WayBank anmelden, erhalten Sie einen einzigartigen Empfehlungscode. Teilen Sie diesen Code mit Freunden, und wenn sie sich mit Ihrem Code anmelden, verdienen Sie laufende Provisionen aus ihren Ertragseinkünften, während sie einen APR-Boost von 1% erhalten.',
  'When and how do I get paid?': 'Wann und wie werde ich bezahlt?',
  'Commissions accumulate in real-time and are displayed on your dashboard. You can withdraw your earnings in USDC once you\'ve accumulated at least 100 USDC. Withdrawals process within 24 hours directly to your connected wallet.': 'Provisionen werden in Echtzeit gesammelt und auf Ihrem Dashboard angezeigt. Sie können Ihre Einnahmen in USDC abheben, sobald Sie mindestens 100 USDC angesammelt haben. Auszahlungen werden innerhalb von 24 Stunden direkt an Ihre verbundene Wallet überwiesen.',
  'How long do I earn commissions?': 'Wie lange verdiene ich Provisionen?',
  'You earn commissions as long as your referrals have active positions with WayBank. There\'s no time limit - it\'s truly passive income that can last for years.': 'Sie verdienen Provisionen, solange Ihre Empfehlungen aktive Positionen bei WayBank haben. Es gibt keine zeitliche Begrenzung - es ist wirklich passives Einkommen, das Jahre dauern kann.',
  'How much can I earn?': 'Wie viel kann ich verdienen?',
  'Your earnings depend on your referrals\' investment amount, the yield they generate, and your commission rate. Commission rates start at 1% and increase up to 4.5% as you progress through our ranking system by referring more users.': 'Ihre Einnahmen hängen vom Investitionsbetrag Ihrer Empfehlungen, dem von ihnen generierten Ertrag und Ihrer Provisionsrate ab. Die Provisionsraten beginnen bei 1% und erhöhen sich auf bis zu 4,5%, wenn Sie durch mehr Empfehlungen in unserem Rangsystem aufsteigen.',
  'Do my referrals lose any yield to pay my commission?': 'Verlieren meine Empfehlungen Erträge, um meine Provision zu bezahlen?',
  'No! This is what makes our program special. Your commission is paid by WayBank, not deducted from your referrals\' earnings. In fact, they receive a 1% APR boost, making it beneficial for them to use your referral code.': 'Nein! Das macht unser Programm besonders. Ihre Provision wird von WayBank bezahlt, nicht von den Einnahmen Ihrer Empfehlungen abgezogen. Tatsächlich erhalten sie einen APR-Boost von 1%, was es für sie vorteilhaft macht, Ihren Empfehlungscode zu verwenden.',
  'What happens if I reach Champion rank?': 'Was passiert, wenn ich den Champion-Rang erreiche?',
  'Champion rank (1000+ referrals) gives you our maximum 4.5% commission rate, priority support, early access to new features, exclusive events, and custom benefits tailored to top referrers. You\'ll also be featured in our success stories if you choose.': 'Der Champion-Rang (1000+ Empfehlungen) gibt Ihnen unsere maximale Provisionsrate von 4,5%, bevorzugten Support, frühzeitigen Zugang zu neuen Funktionen, exklusive Veranstaltungen und maßgeschneiderte Vorteile für Top-Empfehler. Auf Wunsch werden Sie auch in unseren Erfolgsgeschichten vorgestellt.',
  
  // Earnings Calculator
  'Calculate Your Potential Earnings': 'Berechnen Sie Ihre potenziellen Einnahmen',
  'Use our calculator to see how much you could earn through our referral program.': 'Verwenden Sie unseren Rechner, um zu sehen, wie viel Sie durch unser Empfehlungsprogramm verdienen könnten.',
  'Empfehlungsbelohnungsrechner': 'Empfehlungsbelohnungsrechner',
  'Berechnen Sie Ihre potenziellen Einnahmen aus unserem Empfehlungsprogramm.': 'Berechnen Sie Ihre potenziellen Einnahmen aus unserem Empfehlungsprogramm.',
  'Anzahl der Empfehlungen': 'Anzahl der Empfehlungen',
  'Ihre potenziellen Einnahmen': 'Ihre potenziellen Einnahmen',
  'Insgesamt über 5 Jahre': 'Insgesamt über 5 Jahre',
  'Mit 100 Empfehlungen, die mindestens 25000 USD jewells': 'Mit 100 Empfehlungen, die mindestens 25000 USD jewells',
  'Durchschnittliche Investition': 'Durchschnittliche Investition',
  'Basis-APR': 'Basis-APR',
  'Monatliche Einnahmen': 'Monatliche Einnahmen',
  'Jährliche Einnahmen': 'Jährliche Einnahmen',
  'Ihre Provisionsrate': 'Ihre Provisionsrate',
  'Ihr Rang gibt Ihnen 2,5% Provisionsrate auf alle durch Ihre Empfehlungen generierten Einnahmen.': 'Ihr Rang gibt Ihnen 2,5% Provisionsrate auf alle durch Ihre Empfehlungen generierten Einnahmen.',
  'Zeitraum': 'Zeitraum',
  'Jahr(e)': 'Jahr(e)',
  
  // Referral Ranking System
  'Referral Ranking System': 'Empfehlungs-Rangsystem',
  'Progress through our gamified ranking system and earn higher commission rates as you refer more users.': 'Steigen Sie in unserem spielerischen Rangsystem auf und verdienen Sie höhere Provisionen, je mehr Nutzer Sie empfehlen.',
  'Rookie': 'Anfänger',
  'Cat': 'Katze',
  'Sentinel': 'Wächter',
  'Legend': 'Legende',
  'referrals': 'Empfehlungen',
  'Commission': 'Provision',
  'Earn': 'Verdienen Sie',
  'commission on all referrals\' yields': 'Provision auf alle Erträge von Empfehlungen',
  'View all 7 ranking levels and their benefits by signing up for WayBank.': 'Sehen Sie alle 7 Rangstufen und deren Vorteile, indem Sie sich bei WayBank anmelden.',
  'Sign Up & See All Ranks': 'Anmelden & alle Ränge sehen',
  
  // Success Stories
  'Success Stories': 'Erfolgsgeschichten',
  'Hear from our top referrers and learn how they\'ve built their passive income stream.': 'Hören Sie von unseren Top-Empfehlern und erfahren Sie, wie sie ihren passiven Einkommensstrom aufgebaut haben.',
  
  // Referral Hero Section
  'Commission Rewards': 'Provisionsbelohnungen',
  'Earn up to 4.5% commission on your referrals\' yield earnings, paid in USDC.': 'Verdienen Sie bis zu 4,5% Provision auf die Ertragsgewinne Ihrer Empfehlungen, ausgezahlt in USDC.',
  'Popular': 'Beliebt',
  'Ranking System': 'Rangsystem',
  'Progress through our gamified ranking system with themed levels and increasing rewards.': 'Fortschritte durch unser gamifiziertes Rangsystem mit thematischen Stufen und steigenden Belohnungen.',
  'APR Boost for Friends': 'APR-Steigerung für Freunde',
  'Your referrals get a 1% APR boost on all their positions with WayBank.': 'Ihre Empfehlungen erhalten einen APR-Boost von 1% auf alle ihre Positionen bei WayBank.',
  
  // Calculator Section
  'Referral Rewards Calculator': 'Empfehlungsbelohnungsrechner',
  'Calculate your potential earnings from our referral program': 'Berechnen Sie Ihre potenziellen Einnahmen aus unserem Empfehlungsprogramm',
  'Number of Referrals': 'Anzahl der Empfehlungen',
  'Average Investment': 'Durchschnittliche Investition',
  'Base APR': 'Basis-APR',
  'Time Horizon': 'Zeithorizont',
  'year(s)': 'Jahr(e)',
  'year': 'Jahr',
  'years': 'Jahre',
  'Your Potential Earnings': 'Ihre potenziellen Einnahmen',
  'Total Over': 'Insgesamt über',
  'With': 'Mit',
  'referrals investing': 'Empfehlungen, die investieren',
  'each': 'jeweils',
  'Annual Earnings': 'Jährliche Einnahmen',
  'Monthly Earnings': 'Monatliche Einnahmen',
  'Your Commission Rate': 'Ihre Provisionsrate',
  'Your rank gives you': 'Ihr Rang gibt Ihnen',
  'commission rate on all earnings generated by your referrals.': 'Provisionsrate auf alle durch Ihre Empfehlungen generierten Einnahmen.',
  
  // Benefits Section
  'Benefits for Everyone': 'Vorteile für alle',
  'Our referral program is designed to benefit both you and the people you refer.': 'Unser Empfehlungsprogramm ist so konzipiert, dass sowohl Sie als auch die von Ihnen empfohlenen Personen davon profitieren.',
  'For Referrers': 'Für Empfehlende',
  'Passive Income': 'Passives Einkommen',
  'Earn ongoing commission from your referrals\' yield as long as they remain active.': 'Verdienen Sie laufende Provisionen aus den Erträgen Ihrer Empfehlungen, solange diese aktiv bleiben.',
  'Increasing Rewards': 'Steigende Belohnungen',
  'Your commission rate increases as you progress through our ranking system, from 1% up to 4.5%.': 'Ihre Provisionsrate steigt, wenn Sie in unserem Rangsystem vorankommen, von 1% auf bis zu 4,5%.',
  'Exclusive Rewards': 'Exklusive Belohnungen',
  'Unlock exclusive perks, early access to new features, and special events at higher ranks.': 'Schalten Sie exklusive Vorteile, frühzeitigen Zugang zu neuen Funktionen und spezielle Veranstaltungen bei höheren Rängen frei.',
  'Quick Withdrawals': 'Schnelle Auszahlungen',
  'Withdraw your earned commissions in USDC directly to your wallet anytime (minimum 100 USDC).': 'Zahlen Sie Ihre verdienten Provisionen jederzeit direkt in USDC an Ihre Wallet aus (Mindestbetrag 100 USDC).',
  'For Your Referrals': 'Für Ihre Empfehlungen',
  'APR Boost': 'APR-Steigerung',
  'Your referrals receive a permanent 1% APR boost on all their positions with WayBank.': 'Ihre Empfehlungen erhalten eine permanente APR-Steigerung von 1% auf alle ihre Positionen bei WayBank.',
  'No Fee Sharing': 'Keine Gebührenteilung',
  'Your commission doesn\'t come from your referrals\' earnings - it\'s paid by WayBank as a reward.': 'Ihre Provision kommt nicht aus den Einnahmen Ihrer Empfehlungen - sie wird von WayBank als Belohnung gezahlt.',
  'Enhanced Support': 'Erweiterter Support',
  'Referred users receive priority support and personalized onboarding assistance.': 'Empfohlene Benutzer erhalten bevorzugten Support und personalisierte Hilfe beim Onboarding.',
  'Join Our Community': 'Unserer Community beitreten',
  'Become part of our growing DeFi community with exclusive educational content and events.': 'Werden Sie Teil unserer wachsenden DeFi-Community mit exklusiven Bildungsinhalten und Veranstaltungen.',
  
  // Rewards Simulator Title Block
  'Simulador de Rentabilidad': 'Rentabilitätssimulator',
  'Calcula tus potenciales beneficios con diferentes estrategias de liquidez': 'Berechnen Sie Ihre potenziellen Gewinne mit verschiedenen Liquiditätsstrategien',
  // Rewards Simulator
  'Estimate Your Potential Earnings': 'Schätzen Sie Ihre potenziellen Einnahmen',
  'Adjust parameters to simulate your potential returns with liquidity provision': 'Passen Sie Parameter an, um Ihre potenziellen Renditen mit Liquiditätsbereitstellung zu simulieren',
  'Liquidity Pool': 'Liquiditätspool',
  'Select a pool': 'Wählen Sie einen Pool',
  'Loading pools...': 'Pools werden geladen...',
  'Investment Amount (USDC)': 'Investitionsbetrag (USDC)',
  'Price Range Width': 'Breite des Preisbereichs',
  'Narrow (Higher APR, requires frequent readjustments)': 'Eng (höherer APR, erfordert häufige Anpassungen)',
  'Wide (Lower APR, fewer readjustments)': 'Breit (niedrigerer APR, weniger Anpassungen)',
  'Time Period': 'Zeitraum',
  '1 Month': '1 Monat',
  '3 Months': '3 Monate',
  '1 Year': '1 Jahr',
  'Estimated Returns': 'Geschätzte Renditen',
  'estimated APR': 'geschätzter APR',
  'With adjustment of': 'Mit Anpassung von',
  'for': 'für',
  'days': 'Tage',
  'Estimated earnings': 'Geschätzte Einnahmen',
  'Fee income': 'Gebühreneinnahmen',
  'Price impact': 'Preisauswirkungen',
  'Impermanent loss risk': 'Risiko durch vorübergehenden Verlust',
  'High': 'Hoch',
  'Medium': 'Mittel',
  'Low': 'Niedrig',
  'Start investing': 'Beginnen Sie zu investieren',
  'Error loading pools': 'Fehler beim Laden der Pools',
  'Error loading pool data:': 'Fehler beim Laden der Pool-Daten:',
  'Error loading timeframe adjustments:': 'Fehler beim Laden der Zeitrahmenanpassungen:',
  
  // Liquidity Pools Section
  'liquidityPoolsTitle': 'Liquiditätspools',
  'liquidityPoolsDescription': 'Entdecken Sie unsere Uniswap v4 Liquiditätspools mit Echtzeitdaten und umfassenden Statistiken zu Performance und Renditen',
  'totalValueLocked': 'Gesperrter Gesamtwert',
  'totalValueLockedDesc': 'Gesperrter Gesamtwert über alle Pools hinweg',
  'avgApr': 'Durchschn. APR',
  'avgAprDesc': 'Durchschnittlicher jährlicher Prozentsatz',
  '24hVolume': '24h-Volumen',
  '24hVolumeDesc': 'Gesamthandelsvolumen der letzten 24 Stunden',
  'activePools': 'Aktive Pools',
  'activePoolsDesc': 'Gesamtzahl der aktiven Liquiditätspools',
  'dailyFees': 'Tägliche Gebühren',
  'dailyFeesDesc': 'Gesamte tägliche Handelsgebühren',
  'highestApr': 'Höchster APR',
  'pool': 'Pool',
  'noPoolsAvailable': 'Keine Pools verfügbar',
  'volumeTvlRatio': 'Volumen/TVL',
  'volumeTvlRatioDesc': '24h-Volumen als % des Gesamt-TVL',
  'weightedAvgFee': 'Gewichtete Durchschnittsgebühr',
  'weightedAvgFeeDesc': 'Volumengewichtete durchschnittliche Gebührenstufe',
  'viewAllPools': 'Alle Pools anzeigen',
  'loading': 'Wird geladen...'
};

// Diccionario de traducciones para francés (fr)
const frenchTranslations: Record<string, string> = {
  // Position cooling periods
  'positions.cooldownActive': 'Période de refroidissement active. Vous pouvez collecter des frais à nouveau dans {{days}} jours.',
  'positions.monthlyTimeframe': 'Les positions mensuelles ont une période de refroidissement de 30 jours.',
  'positions.quarterlyTimeframe': 'Les positions trimestrielles ont une période de refroidissement de 90 jours.',
  'positions.yearlyTimeframe': 'Les positions annuelles ont une période de refroidissement de 365 jours.',
  'positions.customTimeframe': 'Cette position a une période de refroidissement de {{days}} jours.',
  
  // Referral Page
  'Grow Together, Earn More': 'Grandissez ensemble, gagnez plus',
  'Join our referral program and earn passive income by introducing your network to WayBank\'s advanced DeFi solutions.': 'Rejoignez notre programme de parrainage et gagnez un revenu passif en présentant votre réseau aux solutions DeFi avancées de WayBank.',
  'How It Works': 'Comment ça marche',
  'Join Now': 'Rejoindre maintenant',
  'See Benefits': 'Voir les avantages',
  'Start Earning Today': 'Commencez à gagner aujourd\'hui',
  'Sign Up Now': 'Inscrivez-vous maintenant',
  'Join thousands of users already benefiting from our referral program. Sign up, share your code, and start earning.': 'Rejoignez des milliers d\'utilisateurs qui bénéficient déjà de notre programme de parrainage. Inscrivez-vous, partagez votre code et commencez à gagner.',
  'Learn More': 'En savoir plus',
  
  // FAQ Section
  'Frequently Asked Questions': 'Questions fréquemment posées',
  'Get answers to common questions about our referral program.': 'Obtenez des réponses aux questions courantes sur notre programme de parrainage.',
  'How does the referral program work?': 'Comment fonctionne le programme de parrainage?',
  'Once you sign up for WayBank, you\'ll get a unique referral code. Share this code with friends, and when they join using your code, you\'ll earn ongoing commissions from their yield earnings while they receive a 1% APR boost.': 'Une fois inscrit à WayBank, vous recevrez un code de parrainage unique. Partagez ce code avec vos amis, et lorsqu\'ils s\'inscrivent en utilisant votre code, vous gagnerez des commissions continues sur leurs rendements tandis qu\'ils bénéficieront d\'une augmentation de 1% de leur APR.',
  'When and how do I get paid?': 'Quand et comment suis-je payé?',
  'Commissions accumulate in real-time and are displayed on your dashboard. You can withdraw your earnings in USDC once you\'ve accumulated at least 100 USDC. Withdrawals process within 24 hours directly to your connected wallet.': 'Les commissions s\'accumulent en temps réel et sont affichées sur votre tableau de bord. Vous pouvez retirer vos gains en USDC une fois que vous avez accumulé au moins 100 USDC. Les retraits sont traités dans les 24 heures directement sur votre portefeuille connecté.',
  'How long do I earn commissions?': 'Pendant combien de temps vais-je gagner des commissions?',
  'You earn commissions as long as your referrals have active positions with WayBank. There\'s no time limit - it\'s truly passive income that can last for years.': 'Vous gagnez des commissions tant que vos filleuls ont des positions actives chez WayBank. Il n\'y a pas de limite de temps - c\'est vraiment un revenu passif qui peut durer des années.',
  'How much can I earn?': 'Combien puis-je gagner?',
  'Your earnings depend on your referrals\' investment amount, the yield they generate, and your commission rate. Commission rates start at 1% and increase up to 4.5% as you progress through our ranking system by referring more users.': 'Vos gains dépendent du montant d\'investissement de vos filleuls, du rendement qu\'ils génèrent et de votre taux de commission. Les taux de commission commencent à 1% et augmentent jusqu\'à 4,5% à mesure que vous progressez dans notre système de classement en parrainant plus d\'utilisateurs.',
  'Do my referrals lose any yield to pay my commission?': 'Mes filleuls perdent-ils une partie de leur rendement pour payer ma commission?',
  'No! This is what makes our program special. Your commission is paid by WayBank, not deducted from your referrals\' earnings. In fact, they receive a 1% APR boost, making it beneficial for them to use your referral code.': 'Non! C\'est ce qui rend notre programme spécial. Votre commission est payée par WayBank, et non déduite des gains de vos filleuls. En fait, ils reçoivent une augmentation de 1% de leur APR, ce qui les incite à utiliser votre code de parrainage.',
  'What happens if I reach Champion rank?': 'Que se passe-t-il si j\'atteins le rang Champion?',
  'Champion rank (1000+ referrals) gives you our maximum 4.5% commission rate, priority support, early access to new features, exclusive events, and custom benefits tailored to top referrers. You\'ll also be featured in our success stories if you choose.': 'Le rang Champion (1000+ parrainages) vous donne notre taux de commission maximum de 4,5%, un support prioritaire, un accès anticipé aux nouvelles fonctionnalités, des événements exclusifs et des avantages personnalisés pour les meilleurs parrains. Vous pourrez également figurer dans nos histoires de réussite si vous le souhaitez.',

  // Earnings Calculator
  'Calculate Your Potential Earnings': 'Calculez vos gains potentiels',
  'Use our calculator to see how much you could earn through our referral program.': 'Utilisez notre calculateur pour voir combien vous pourriez gagner grâce à notre programme de parrainage.',
  
  // Referral Ranking System
  'Referral Ranking System': 'Système de classement des parrainages',
  'Progress through our gamified ranking system and earn higher commission rates as you refer more users.': 'Progressez dans notre système de classement ludique et gagnez des taux de commission plus élevés à mesure que vous parrainez plus d\'utilisateurs.',
  'Rookie': 'Débutant',
  'Cat': 'Chat',
  'Sentinel': 'Sentinelle',
  'Legend': 'Légende',
  'referrals': 'parrainages',
  'Commission': 'Commission',
  'Earn': 'Gagnez',
  'commission on all referrals\' yields': 'de commission sur tous les rendements des parrainages',
  'View all 7 ranking levels and their benefits by signing up for WayBank.': 'Découvrez les 7 niveaux de classement et leurs avantages en vous inscrivant à WayBank.',
  'Sign Up & See All Ranks': 'Inscrivez-vous et découvrez tous les rangs',
  
  // Success Stories
  'Success Stories': 'Histoires de réussite',
  'Hear from our top referrers and learn how they\'ve built their passive income stream.': 'Écoutez nos meilleurs parrains et découvrez comment ils ont construit leur flux de revenus passifs.',
  
  // Rewards Simulator Title Block
  'Simulador de Rentabilidad': 'Simulateur de Rentabilité',
  'Calcula tus potenciales beneficios con diferentes estrategias de liquidez': 'Calculez vos bénéfices potentiels avec différentes stratégies de liquidité',
  // Rewards Simulator
  'Estimate Your Potential Earnings': 'Estimez vos gains potentiels',
  'Adjust parameters to simulate your potential returns with liquidity provision': 'Ajustez les paramètres pour simuler vos rendements potentiels avec la fourniture de liquidité',
  'Liquidity Pool': 'Pool de liquidité',
  'Select a pool': 'Sélectionnez un pool',
  'Loading pools...': 'Chargement des pools...',
  'Investment Amount (USDC)': 'Montant d\'investissement (USDC)',
  'Price Range Width': 'Largeur de la fourchette de prix',
  'Narrow (Higher APR, requires frequent readjustments)': 'Étroite (APR plus élevé, nécessite des réajustements fréquents)',
  'Wide (Lower APR, fewer readjustments)': 'Large (APR plus bas, moins de réajustements)',
  'Time Period': 'Période',
  '1 Month': '1 Mois',
  '3 Months': '3 Mois',
  '1 Year': '1 An',
  'Estimated Returns': 'Rendements estimés',
  'estimated APR': 'APR estimé',
  'With adjustment of': 'Avec ajustement de',
  'for': 'pour',
  'days': 'jours',
  'Estimated earnings': 'Gains estimés',
  'Fee income': 'Revenus des frais',
  'Price impact': 'Impact sur le prix',
  'Impermanent loss risk': 'Risque de perte temporaire',
  'High': 'Élevé',
  'Medium': 'Moyen',
  'Low': 'Faible',
  'Start investing': 'Commencer à investir',
  'Error loading pools': 'Erreur lors du chargement des pools',
  'Error loading pool data:': 'Erreur lors du chargement des données de pool:',
  'Error loading timeframe adjustments:': 'Erreur lors du chargement des ajustements de période:',
  
  // Liquidity Pools Section
  'liquidityPoolsTitle': 'Pools de Liquidité',
  'liquidityPoolsDescription': 'Explorez nos pools de liquidité Uniswap v4 avec des données en temps réel et des statistiques complètes sur la performance et les rendements',
  'totalValueLocked': 'Valeur Totale Verrouillée',
  'totalValueLockedDesc': 'Valeur totale verrouillée dans tous les pools',
  'avgApr': 'APR Moyen',
  'avgAprDesc': 'Taux de pourcentage annuel moyen',
  '24hVolume': 'Volume 24h',
  '24hVolumeDesc': 'Volume total des transactions des dernières 24 heures',
  'activePools': 'Pools Actifs',
  'activePoolsDesc': 'Nombre total de pools de liquidité actifs',
  'dailyFees': 'Frais Quotidiens',
  'dailyFeesDesc': 'Frais de transaction quotidiens totaux',
  'highestApr': 'APR le Plus Élevé',
  'pool': 'Pool',
  'noPoolsAvailable': 'Aucun pool disponible',
  'volumeTvlRatio': 'Ratio Volume/TVL',
  'volumeTvlRatioDesc': 'Volume sur 24h en % du TVL total',
  'weightedAvgFee': 'Frais Moyen Pondéré',
  'weightedAvgFeeDesc': 'Niveau de frais moyen pondéré par volume',
  'viewAllPools': 'Voir tous les pools',
  'loading': 'Chargement...'
};

// Diccionario de traducciones para italiano (it)
const italianTranslations: Record<string, string> = {
  // Referral Page
  'Grow Together, Earn More': 'Cresci insieme, guadagna di più',
  'Join our referral program and earn passive income by introducing your network to WayBank\'s advanced DeFi solutions.': 'Unisciti al nostro programma di referral e guadagna reddito passivo presentando la tua rete alle soluzioni DeFi avanzate di WayBank.',
  'How It Works': 'Come funziona',
  'Join Now': 'Unisciti ora',
  'See Benefits': 'Vedi i benefici',
  'Start Earning Today': 'Inizia a guadagnare oggi',
  'Sign Up Now': 'Registrati ora',
  'Join thousands of users already benefiting from our referral program. Sign up, share your code, and start earning.': 'Unisciti a migliaia di utenti che già beneficiano del nostro programma di referral. Registrati, condividi il tuo codice e inizia a guadagnare.',
  'Learn More': 'Scopri di più',
  
  // Rewards Simulator Title Block
  'Simulador de Rentabilidad': 'Simulatore di Redditività',
  'Calcula tus potenciales beneficios con diferentes estrategias de liquidez': 'Calcola i tuoi potenziali benefici con diverse strategie di liquidità',
  // Rewards Simulator
  'Estimate Your Potential Earnings': 'Stima i tuoi potenziali guadagni',
  'Adjust parameters to simulate your potential returns with liquidity provision': 'Regola i parametri per simulare i potenziali rendimenti con la fornitura di liquidità',
  'Liquidity Pool': 'Pool di liquidità',
  'Select a pool': 'Seleziona un pool',
  'Loading pools...': 'Caricamento pool...',
  'Investment Amount (USDC)': 'Importo dell\'investimento (USDC)',
  'Price Range Width': 'Ampiezza dell\'intervallo di prezzo',
  'Narrow (Higher APR, requires frequent readjustments)': 'Stretto (APR più alto, richiede frequenti aggiustamenti)',
  'Wide (Lower APR, fewer readjustments)': 'Ampio (APR più basso, meno aggiustamenti)',
  'Time Period': 'Periodo di tempo',
  '1 Month': '1 Mese',
  '3 Months': '3 Mesi',
  '1 Year': '1 Anno',
  'Estimated Returns': 'Rendimenti stimati',
  'estimated APR': 'APR stimato',
  'With adjustment of': 'Con adeguamento di',
  'for': 'per',
  'days': 'giorni',
  'Estimated earnings': 'Guadagni stimati',
  'Fee income': 'Reddito da commissioni',
  'Price impact': 'Impatto sul prezzo',
  'Impermanent loss risk': 'Rischio di perdita temporanea',
  'High': 'Alto',
  'Medium': 'Medio',
  'Low': 'Basso',
  'Start investing': 'Inizia a investire',
  'Error loading pools': 'Errore nel caricamento dei pool',
  'Error loading pool data:': 'Errore nel caricamento dei dati del pool:',
  'Error loading timeframe adjustments:': 'Errore nel caricamento delle regolazioni temporali:',
  
  // Liquidity Pools Section
  'liquidityPoolsTitle': 'Pool di Liquidità',
  'liquidityPoolsDescription': 'Esplora i nostri pool di liquidità Uniswap v4 con dati in tempo reale e statistiche complete su performance e rendimenti',
  'totalValueLocked': 'Valore Totale Bloccato',
  'totalValueLockedDesc': 'Valore totale bloccato in tutti i pool',
  'avgApr': 'APR Medio',
  'avgAprDesc': 'Percentuale media annua',
  '24hVolume': 'Volume 24h',
  '24hVolumeDesc': 'Volume totale delle transazioni nelle ultime 24 ore',
  'activePools': 'Pool Attivi',
  'activePoolsDesc': 'Numero totale di pool di liquidità attivi',
  'dailyFees': 'Commissioni Giornaliere',
  'dailyFeesDesc': 'Commissioni totali giornaliere sulle transazioni',
  'highestApr': 'APR Più Alto',
  'pool': 'Pool',
  'noPoolsAvailable': 'Nessun pool disponibile',
  'volumeTvlRatio': 'Rapporto Volume/TVL',
  'volumeTvlRatioDesc': 'Volume 24h come % del TVL totale',
  'weightedAvgFee': 'Commissione Media Ponderata',
  'weightedAvgFeeDesc': 'Livello di commissione medio ponderato per volume',
  'viewAllPools': 'Visualizza tutti i pool',
  'loading': 'Caricamento...'
};

// Diccionario de traducciones para portugués (pt)
const portugueseTranslations: Record<string, string> = {
  // Referral Page
  'Grow Together, Earn More': 'Cresça junto, ganhe mais',
  'Join our referral program and earn passive income by introducing your network to WayBank\'s advanced DeFi solutions.': 'Participe do nosso programa de indicação e ganhe renda passiva apresentando sua rede às soluções DeFi avançadas do WayBank.',
  'How It Works': 'Como funciona',
  'Join Now': 'Participe agora',
  'See Benefits': 'Ver benefícios',
  'Start Earning Today': 'Comece a ganhar hoje',
  'Sign Up Now': 'Inscreva-se agora',
  'Join thousands of users already benefiting from our referral program. Sign up, share your code, and start earning.': 'Junte-se a milhares de usuários que já estão se beneficiando do nosso programa de indicação. Inscreva-se, compartilhe seu código e comece a ganhar.',
  'Learn More': 'Saiba mais',
  
  // Rewards Simulator Title Block
  'Simulador de Rentabilidad': 'Simulador de Rentabilidade',
  'Calcula tus potenciales beneficios con diferentes estrategias de liquidez': 'Calcule seus benefícios potenciais com diferentes estratégias de liquidez',
  // Rewards Simulator
  'Estimate Your Potential Earnings': 'Estime seus ganhos potenciais',
  'Adjust parameters to simulate your potential returns with liquidity provision': 'Ajuste os parâmetros para simular seus retornos potenciais com provisão de liquidez',
  'Liquidity Pool': 'Pool de liquidez',
  'Select a pool': 'Selecione um pool',
  'Loading pools...': 'Carregando pools...',
  'Investment Amount (USDC)': 'Valor do investimento (USDC)',
  'Price Range Width': 'Largura da faixa de preço',
  'Narrow (Higher APR, requires frequent readjustments)': 'Estreita (APR mais alto, requer reajustes frequentes)',
  'Wide (Lower APR, fewer readjustments)': 'Ampla (APR mais baixo, menos reajustes)',
  'Time Period': 'Período de tempo',
  '1 Month': '1 Mês',
  '3 Months': '3 Meses',
  '1 Year': '1 Ano',
  'Estimated Returns': 'Retornos estimados',
  'estimated APR': 'APR estimado',
  'With adjustment of': 'Com ajuste de',
  'for': 'para',
  'days': 'dias',
  'Estimated earnings': 'Ganhos estimados',
  'Fee income': 'Receita de taxas',
  'Price impact': 'Impacto no preço',
  'Impermanent loss risk': 'Risco de perda temporária',
  'High': 'Alto',
  'Medium': 'Médio',
  'Low': 'Baixo',
  'Start investing': 'Comece a investir',
  'Error loading pools': 'Erro ao carregar pools',
  'Error loading pool data:': 'Erro ao carregar dados do pool:',
  'Error loading timeframe adjustments:': 'Erro ao carregar ajustes de período:',
  
  // Liquidity Pools Section
  'liquidityPoolsTitle': 'Pools de Liquidez',
  'liquidityPoolsDescription': 'Explore nossos pools de liquidez Uniswap v4 com dados em tempo real e estatísticas abrangentes sobre desempenho e retornos',
  'totalValueLocked': 'Valor Total Bloqueado',
  'totalValueLockedDesc': 'Valor total bloqueado em todos os pools',
  'avgApr': 'APR Médio',
  'avgAprDesc': 'Taxa percentual anual média',
  '24hVolume': 'Volume 24h',
  '24hVolumeDesc': 'Volume total de transações nas últimas 24 horas',
  'activePools': 'Pools Ativos',
  'activePoolsDesc': 'Número total de pools de liquidez ativos',
  'dailyFees': 'Taxas Diárias',
  'dailyFeesDesc': 'Taxas totais diárias de transação',
  'highestApr': 'APR Mais Alto',
  'pool': 'Pool',
  'noPoolsAvailable': 'Nenhum pool disponível',
  'volumeTvlRatio': 'Relação Volume/TVL',
  'volumeTvlRatioDesc': 'Volume de 24h como % do TVL total',
  'weightedAvgFee': 'Taxa Média Ponderada',
  'weightedAvgFeeDesc': 'Nível de taxa média ponderada por volume',
  'viewAllPools': 'Ver todos os pools',
  'loading': 'Carregando...'
};

// Diccionario de traducciones para árabe (ar)
const arabicTranslations: Record<string, string> = {
  // Referral Page
  'Grow Together, Earn More': 'انمو معاً، اكسب أكثر',
  'Join our referral program and earn passive income by introducing your network to WayBank\'s advanced DeFi solutions.': 'انضم إلى برنامج الإحالة لدينا واكسب دخلاً سلبياً من خلال تعريف شبكتك بحلول DeFi المتقدمة من WayBank.',
  'How It Works': 'كيف يعمل',
  'Join Now': 'انضم الآن',
  'See Benefits': 'اطلع على الفوائد',
  'Start Earning Today': 'ابدأ الكسب اليوم',
  'Sign Up Now': 'سجل الآن',
  'Join thousands of users already benefiting from our referral program. Sign up, share your code, and start earning.': 'انضم إلى آلاف المستخدمين الذين يستفيدون بالفعل من برنامج الإحالة لدينا. سجل، شارك رمزك، وابدأ الكسب.',
  'Learn More': 'اعرف المزيد',
  
  // Rewards Simulator Title Block
  'Simulador de Rentabilidad': 'محاكي الربحية',
  'Calcula tus potenciales beneficios con diferentes estrategias de liquidez': 'احسب أرباحك المحتملة مع استراتيجيات السيولة المختلفة',
  // Rewards Simulator
  'Estimate Your Potential Earnings': 'تقدير أرباحك المحتملة',
  'Adjust parameters to simulate your potential returns with liquidity provision': 'ضبط المعلمات لمحاكاة عوائدك المحتملة مع توفير السيولة',
  'Liquidity Pool': 'مجمع السيولة',
  'Select a pool': 'اختر مجمعًا',
  'Loading pools...': 'جاري تحميل المجمعات...',
  'Investment Amount (USDC)': 'مبلغ الاستثمار (USDC)',
  'Price Range Width': 'عرض نطاق السعر',
  'Narrow (Higher APR, requires frequent readjustments)': 'ضيق (APR أعلى، يتطلب تعديلات متكررة)',
  'Wide (Lower APR, fewer readjustments)': 'واسع (APR أقل، تعديلات أقل)',
  'Time Period': 'الفترة الزمنية',
  '1 Month': 'شهر واحد',
  '3 Months': '3 أشهر',
  '1 Year': 'سنة واحدة',
  'Estimated Returns': 'العوائد المقدرة',
  'estimated APR': 'APR المقدر',
  'With adjustment of': 'مع تعديل بنسبة',
  'for': 'لمدة',
  'days': 'أيام',
  'Estimated earnings': 'الأرباح المقدرة',
  'Fee income': 'دخل الرسوم',
  'Price impact': 'تأثير السعر',
  'Impermanent loss risk': 'مخاطر الخسارة المؤقتة',
  'High': 'عالي',
  'Medium': 'متوسط',
  'Low': 'منخفض',
  'Start investing': 'ابدأ الاستثمار',
  'Error loading pools': 'خطأ في تحميل المجمعات',
  'Error loading pool data:': 'خطأ في تحميل بيانات المجمع:',
  'Error loading timeframe adjustments:': 'خطأ في تحميل تعديلات الإطار الزمني:',
  
  // Liquidity Pools Section
  'liquidityPoolsTitle': 'مجمعات السيولة',
  'liquidityPoolsDescription': 'استكشف مجمعات السيولة Uniswap v4 لدينا مع بيانات في الوقت الحقيقي وإحصائيات شاملة عن الأداء والعوائد',
  'totalValueLocked': 'إجمالي القيمة المقفلة',
  'totalValueLockedDesc': 'إجمالي القيمة المقفلة عبر جميع المجمعات',
  'avgApr': 'متوسط ​​APR',
  'avgAprDesc': 'متوسط ​​النسبة المئوية السنوية',
  '24hVolume': 'حجم 24 ساعة',
  '24hVolumeDesc': 'إجمالي حجم التداول في آخر 24 ساعة',
  'activePools': 'المجمعات النشطة',
  'activePoolsDesc': 'العدد الإجمالي لمجمعات السيولة النشطة',
  'dailyFees': 'الرسوم اليومية',
  'dailyFeesDesc': 'إجمالي رسوم التداول اليومية',
  'highestApr': 'أعلى APR',
  'pool': 'مجمع',
  'noPoolsAvailable': 'لا توجد مجمعات متاحة',
  'volumeTvlRatio': 'نسبة الحجم/TVL',
  'volumeTvlRatioDesc': 'حجم 24 ساعة كنسبة من إجمالي TVL',
  'weightedAvgFee': 'متوسط ​​الرسوم المرجح',
  'weightedAvgFeeDesc': 'مستوى متوسط ​​الرسوم المرجح بالحجم',
  'viewAllPools': 'عرض جميع المجمعات',
  'loading': 'جاري التحميل...'
};

// Diccionario de traducciones para chino (zh)
const chineseTranslations: Record<string, string> = {
  // Referral Page
  'Grow Together, Earn More': '共同成长，赚更多',
  'Join our referral program and earn passive income by introducing your network to WayBank\'s advanced DeFi solutions.': '加入我们的推荐计划，通过向您的网络介绍WayBank的先进DeFi解决方案来赚取被动收入。',
  'How It Works': '如何运作',
  'Join Now': '立即加入',
  'See Benefits': '查看福利',
  'Start Earning Today': '今天开始赚钱',
  'Sign Up Now': '立即注册',
  'Join thousands of users already benefiting from our referral program. Sign up, share your code, and start earning.': '加入已经从我们的推荐计划中受益的成千上万用户。注册，分享您的代码，开始赚钱。',
  'Learn More': '了解更多',
  
  // Rewards Simulator Title Block
  'Simulador de Rentabilidad': '收益模拟器',
  'Calcula tus potenciales beneficios con diferentes estrategias de liquidez': '通过不同的流动性策略计算您的潜在收益',
  // Rewards Simulator
  'Estimate Your Potential Earnings': '估算潜在收益',
  'Adjust parameters to simulate your potential returns with liquidity provision': '调整参数以模拟您通过提供流动性获得的潜在回报',
  'Liquidity Pool': '流动性池',
  'Select a pool': '选择一个池',
  'Loading pools...': '正在加载池...',
  'Investment Amount (USDC)': '投资金额 (USDC)',
  'Price Range Width': '价格范围宽度',
  'Narrow (Higher APR, requires frequent readjustments)': '窄（更高APR，需要频繁调整）',
  'Wide (Lower APR, fewer readjustments)': '宽（更低APR，较少调整）',
  'Time Period': '时间周期',
  '1 Month': '1个月',
  '3 Months': '3个月',
  '1 Year': '1年',
  'Estimated Returns': '预估回报',
  'estimated APR': '预估APR',
  'With adjustment of': '调整幅度为',
  'for': '周期为',
  'days': '天',
  'Estimated earnings': '预估收益',
  'Fee income': '手续费收入',
  'Price impact': '价格影响',
  'Impermanent loss risk': '无常损失风险',
  'High': '高',
  'Medium': '中',
  'Low': '低',
  'Start investing': '开始投资',
  'Error loading pools': '加载池时出错',
  'Error loading pool data:': '加载池数据时出错:',
  'Error loading timeframe adjustments:': '加载时间框架调整时出错:',
  
  // Liquidity Pools Section
  'liquidityPoolsTitle': '流动性池',
  'liquidityPoolsDescription': '通过实时数据和全面的性能与回报统计信息，探索我们的Uniswap v4流动性池',
  'totalValueLocked': '总锁定价值',
  'totalValueLockedDesc': '所有池中的总锁定价值',
  'avgApr': '平均APR',
  'avgAprDesc': '平均年化百分比率',
  '24hVolume': '24小时交易量',
  '24hVolumeDesc': '过去24小时的总交易量',
  'activePools': '活跃池',
  'activePoolsDesc': '活跃流动性池的总数',
  'dailyFees': '每日费用',
  'dailyFeesDesc': '每日交易费用总额',
  'highestApr': '最高APR',
  'pool': '池',
  'noPoolsAvailable': '没有可用的池',
  'volumeTvlRatio': '交易量/TVL比率',
  'volumeTvlRatioDesc': '24小时交易量占总TVL的百分比',
  'weightedAvgFee': '加权平均费用',
  'weightedAvgFeeDesc': '按交易量加权的平均费用级别',
  'viewAllPools': '查看所有池',
  'loading': '加载中...'
};

// Diccionario de traducciones para hindi (hi)
const hindiTranslations: Record<string, string> = {
  // Referral Page
  'Grow Together, Earn More': 'साथ मिलकर बढ़ें, अधिक कमाएं',
  'Join our referral program and earn passive income by introducing your network to WayBank\'s advanced DeFi solutions.': 'हमारे रेफरल प्रोग्राम में शामिल हों और अपने नेटवर्क को WayBank के उन्नत DeFi समाधानों से परिचित कराकर निष्क्रिय आय अर्जित करें।',
  'How It Works': 'यह कैसे काम करता है',
  'Join Now': 'अभी शामिल हों',
  'See Benefits': 'लाभ देखें',
  'Start Earning Today': 'आज से कमाना शुरू करें',
  'Sign Up Now': 'अभी साइन अप करें',
  'Join thousands of users already benefiting from our referral program. Sign up, share your code, and start earning.': 'हजारों उपयोगकर्ताओं के साथ शामिल हों जो पहले से ही हमारे रेफरल प्रोग्राम से लाभ उठा रहे हैं। साइन अप करें, अपना कोड शेयर करें, और कमाना शुरू करें।',
  'Learn More': 'अधिक जानें',
  
  // Rewards Simulator Title Block
  'Simulador de Rentabilidad': 'प्रतिफल सिमुलेटर',
  'Calcula tus potenciales beneficios con diferentes estrategias de liquidez': 'विभिन्न तरलता रणनीतियों के साथ अपने संभावित लाभों की गणना करें',
  // Rewards Simulator
  'Estimate Your Potential Earnings': 'अपनी संभावित कमाई का अनुमान लगाएं',
  'Adjust parameters to simulate your potential returns with liquidity provision': 'तरलता प्रावधान के साथ अपने संभावित रिटर्न का अनुकरण करने के लिए पैरामीटर समायोजित करें',
  'Liquidity Pool': 'तरलता पूल',
  'Select a pool': 'एक पूल चुनें',
  'Loading pools...': 'पूल लोड हो रहे हैं...',
  'Investment Amount (USDC)': 'निवेश राशि (USDC)',
  'Price Range Width': 'मूल्य सीमा की चौड़ाई',
  'Narrow (Higher APR, requires frequent readjustments)': 'संकीर्ण (उच्च APR, बार-बार समायोजन की आवश्यकता)',
  'Wide (Lower APR, fewer readjustments)': 'चौड़ा (निम्न APR, कम समायोजन)',
  'Time Period': 'समय अवधि',
  '1 Month': '1 महीना',
  '3 Months': '3 महीने',
  '1 Year': '1 वर्ष',
  'Estimated Returns': 'अनुमानित रिटर्न',
  'estimated APR': 'अनुमानित APR',
  'With adjustment of': 'समायोजन के साथ',
  'for': 'के लिए',
  'days': 'दिन',
  'Estimated earnings': 'अनुमानित कमाई',
  'Fee income': 'शुल्क आय',
  'Price impact': 'मूल्य प्रभाव',
  'Impermanent loss risk': 'अस्थायी हानि का जोखिम',
  'High': 'उच्च',
  'Medium': 'मध्यम',
  'Low': 'निम्न',
  'Start investing': 'निवेश शुरू करें',
  'Error loading pools': 'पूल लोड करने में त्रुटि',
  'Error loading pool data:': 'पूल डेटा लोड करने में त्रुटि:',
  'Error loading timeframe adjustments:': 'समय सीमा समायोजन लोड करने में त्रुटि:',
  
  // Liquidity Pools Section
  'liquidityPoolsTitle': 'तरलता पूल',
  'liquidityPoolsDescription': 'रीयल-टाइम डेटा और प्रदर्शन और रिटर्न पर व्यापक आंकड़ों के साथ हमारे Uniswap v4 तरलता पूल्स का अन्वेषण करें',
  'totalValueLocked': 'कुल लॉक्ड वैल्यू',
  'totalValueLockedDesc': 'सभी पूल्स में कुल लॉक्ड वैल्यू',
  'avgApr': 'औसत APR',
  'avgAprDesc': 'औसत वार्षिक प्रतिशत दर',
  '24hVolume': '24 घंटे का वॉल्यूम',
  '24hVolumeDesc': 'पिछले 24 घंटों का कुल ट्रेडिंग वॉल्यूम',
  'activePools': 'सक्रिय पूल्स',
  'activePoolsDesc': 'सक्रिय तरलता पूल्स की कुल संख्या',
  'dailyFees': 'दैनिक शुल्क',
  'dailyFeesDesc': 'कुल दैनिक ट्रेडिंग शुल्क',
  'highestApr': 'उच्चतम APR',
  'pool': 'पूल',
  'noPoolsAvailable': 'कोई पूल उपलब्ध नहीं',
  'volumeTvlRatio': 'वॉल्यूम/TVL अनुपात',
  'volumeTvlRatioDesc': 'कुल TVL के % के रूप में 24 घंटे का वॉल्यूम',
  'weightedAvgFee': 'भारित औसत शुल्क',
  'weightedAvgFeeDesc': 'वॉल्यूम-भारित औसत शुल्क स्तर',
  'viewAllPools': 'सभी पूल्स देखें',
  'loading': 'लोड हो रहा है...'
};

// Crear el diccionario de traducciones completo
const translations: Record<Language, Record<string, string>> = {
  es: spanishTranslations,
  en: englishTranslations,
  de: { ...englishTranslations, ...germanTranslations },
  fr: { ...englishTranslations, ...frenchTranslations },
  it: { ...englishTranslations, ...italianTranslations },
  pt: { ...englishTranslations, ...portugueseTranslations },
  ar: { ...englishTranslations, ...arabicTranslations },
  zh: { ...englishTranslations, ...chineseTranslations },
  hi: { ...englishTranslations, ...hindiTranslations }
};

// Función para detectar el idioma del navegador
function getBrowserLanguage(): Language {
  const browserLang = navigator.language.split('-')[0] as Language;
  return Object.keys(translations).includes(browserLang) ? browserLang : 'es';
}

// Proveedor de traducciones
export const TranslationProvider = ({ children }: TranslationProviderProps) => {
  // Estado para el idioma actual
  const [language, setLanguage] = useState<Language>(() => {
    // Intentar recuperar el idioma guardado
    if (typeof window !== "undefined") {
      // Verificar ambas claves de localStorage para compatibilidad
      const savedLanguage = localStorage.getItem('waybank_language') as Language;
      const altSavedLanguage = localStorage.getItem('language') as Language;
      
      // Priorizar waybank_language, luego language
      if (savedLanguage && Object.keys(translations).includes(savedLanguage)) {
        return savedLanguage;
      } else if (altSavedLanguage && Object.keys(translations).includes(altSavedLanguage)) {
        // Si se encuentra en la clave alternativa, también sincronizar con la principal
        localStorage.setItem('waybank_language', altSavedLanguage);
        return altSavedLanguage;
      }
      
      return getBrowserLanguage();
    }
    return 'es'; // Configurado a español como idioma predeterminado
  });

  // Guardar el idioma cuando cambie
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Actualizar ambas claves para mantener sincronizados los contextos
      localStorage.setItem('waybank_language', language);
      localStorage.setItem('language', language);
      
      // Actualizar el atributo dir en el elemento html para el soporte RTL
      document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
      
      // Actualizar el atributo lang en el elemento html
      document.documentElement.lang = language;
    }
  }, [language]);

  // Función para reemplazar variables en un texto
  const replaceVariables = (text: string, variables?: Record<string, any>): string => {
    if (!variables) return text;
    
    return text.replace(/\{\{([^}]+)\}\}/g, (match, variableName) => {
      const trimmedName = variableName.trim();
      return variables[trimmedName] !== undefined ? String(variables[trimmedName]) : match;
    });
  };

  // Función para traducir textos con soporte para variables
  const t = (key: string, defaultValueOrVariables?: string | Record<string, any>, variables?: Record<string, any>): string => {
    let defaultValue: string | undefined;
    let vars: Record<string, any> | undefined;
    
    // Determinar qué parámetros se han pasado
    if (typeof defaultValueOrVariables === 'string') {
      defaultValue = defaultValueOrVariables;
      vars = variables;
    } else if (defaultValueOrVariables && typeof defaultValueOrVariables === 'object') {
      defaultValue = undefined;
      vars = defaultValueOrVariables;
    }
    
    // Verificar si existe la traducción para el idioma actual
    let translatedText: string;
    if (translations[language] && translations[language][key] !== undefined) {
      const value = translations[language][key];
      // Verificar si es una cadena vacía
      if (typeof value === 'string' && value.trim() === '') {
        // Si está vacía, buscar en inglés
        if (language !== 'en' && translations['en'] && translations['en'][key]) {
          translatedText = translations['en'][key];
        } else {
          // Si no hay traducción en inglés o también está vacía, usar el valor por defecto o la clave
          translatedText = defaultValue || key;
        }
      } else {
        // Si tiene valor, usarlo
        translatedText = value;
      }
    } else if (language !== 'en' && translations['en'] && translations['en'][key]) {
      // Si no existe traducción para el idioma actual, intentar con inglés
      translatedText = translations['en'][key];
    } else {
      // Si no hay traducción en inglés, usar el valor por defecto o la clave
      translatedText = defaultValue || key;
    }
    
    // Reemplazar variables si es necesario
    return replaceVariables(translatedText, vars);
  };

  // Valor del contexto
  const contextValue: TranslationContextType = {
    language,
    setLanguage,
    t,
    getSupportedLanguages: () => SUPPORTED_LANGUAGES,
    getCommonWord: (word: string) => commonWords[language]?.[word] || word
  };

  return React.createElement(
    TranslationContext.Provider,
    { value: contextValue },
    children
  );
};

// Importamos el contexto de idioma global para sincronización
import { useLanguage } from '@/context/language-context';

// Hook para usar traducciones, sincronizado con el contexto de idioma global
export const useTranslation = (): TranslationContextType => {
  // Obtenemos el contexto local
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslation debe usarse dentro de un TranslationProvider');
  }
  
  // Obtenemos el contexto global de idioma para sincronizar
  const globalLanguageContext = useLanguage();
  
  // Si los idiomas no coinciden, sincronizamos
  if (context.language !== globalLanguageContext.language) {
    setTimeout(() => {
      // Usamos setTimeout para evitar cambios durante el renderizado
      context.setLanguage(globalLanguageContext.language as Language);
    }, 0);
  }
  
  return {
    ...context,
    // Aseguramos que el idioma sea el mismo que en el contexto global
    language: globalLanguageContext.language as Language,
    // Cuando cambiamos idioma, actualizamos ambos contextos
    setLanguage: (lang) => {
      // Manejar tanto funciones como valores directos
      if (typeof lang === 'function') {
        const newLang = lang(context.language);
        context.setLanguage(newLang);
        globalLanguageContext.setLanguage(newLang);
      } else {
        context.setLanguage(lang);
        globalLanguageContext.setLanguage(lang);
      }
    }
  };
};