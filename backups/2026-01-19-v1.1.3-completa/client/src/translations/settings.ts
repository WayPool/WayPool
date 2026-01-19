import { createTranslationProxy } from '@/utils/translation-utils';
// Crear la función de traducción
import { Language, useLanguage } from '@/context/language-context';

// Definir los tipos para las traducciones de la página de configuraciones
export interface SettingsTranslations {
  // Pestañas
  profile: string;
  appearance: string;
  network: string;
  security: string;
  advanced: string;
  general: string;
  automation: string;

  // Respaldo de claves de seguridad
  downloadBackup: string;
  neverShare: string;

  // Sección de apariencia
  theme: string;
  themeDescription: string;
  light: string;
  dark: string;
  system: string;
  
  // Visualización de wallet
  walletDisplay: string;
  walletDisplayDescription: string;
  shortened: string;
  fullAddress: string;
  ensName: string;
  
  // Idioma
  language: string;
  languageDescription: string;
  
  // Red
  networkSettings: string;
  networkSettingsDescription: string;
  defaultNetwork: string;
  ethereum: string;
  polygon: string;
  arbitrum: string;
  optimism: string;
  rpcEndpoint: string;
  customRpcEndpoint: string;
  customRpcDisabled: string;
  
  // Gas
  gasPreference: string;
  gasPreferenceDescription: string;
  standard: string;
  fast: string;
  rapid: string;
  economy: string;
  
  // Seguridad del wallet
  walletSecurity: string;
  walletSecurityDescription: string;
  changePassword: string;
  currentPassword: string;
  enterCurrentPassword: string;
  newPassword: string;
  enterNewPassword: string;
  confirmPassword: string;
  confirmNewPassword: string;
  updatePassword: string;
  updating: string;
  
  // Protección de wallet
  walletProtection: string;
  walletProtectionDescription: string;
  passwordStrength: string;
  passwordRequirements: string;
  
  // Cosecha automática
  autoHarvest: string;
  autoHarvestDescription: string;
  harvestPercentage: string;
  harvestPercentageDescription: string;
  automationNote: string;
  automationNoteDescription: string;
  
  // Botones
  saveSettings: string;
  resetSettings: string;
  
  // Tarjetas y títulos
  settings: string;
  configurePreferences: string;
  accountSettings: string;
  accountSettingsDescription: string;
  accountInfo: string;
  connectWallet: string;
  connectWalletToAccess: string;
  connectYourWalletToView: string;
  
  // Información de cuenta
  walletAddress: string;
  networkName: string;
  connectedVia: string;
  
  // MiCA Compliance
  micaCompliance: string;
  micaCompliant: string;
  noCustody: string;
  transparentFees: string;
  onChainTransactions: string;
  
  // Sobre WayBank
  aboutWayBank: string;
  version: string;
  lastUpdated: string;
  documentation: string;
  support: string;
  
  // Notificaciones toast
  settingsSaved: string;
  settingsSavedDescription: string;
  errorSaving: string;
  errorSavingDescription: string;
  walletNotConnected: string;
  walletNotConnectedDescription: string;
  passwordUpdated: string;
  passwordUpdatedDescription: string;
  passwordError: string;
  currentPasswordRequired: string;
  currentPasswordRequiredDescription: string;
  newPasswordRequired: string;
  newPasswordRequiredDescription: string;
  weakPassword: string;
  weakPasswordDescription: string;
  passwordsNotMatch: string;
  passwordsNotMatchDescription: string;
  
  // Fortaleza de contraseña
  noPassword: string;
  veryWeak: string;
  weak: string;
  moderate: string;
  strong: string;
  veryStrong: string;
}

// Traducciones en inglés (idioma por defecto)
const en: SettingsTranslations = {
  // Pestañas
  profile: "Profile",
  appearance: "Appearance",
  network: "Network",
  security: "Security",
  advanced: "Advanced",
  general: "General",
  automation: "Automation",
  
  // Respaldo de claves de seguridad
  downloadBackup: "Download Backup",
  neverShare: "Never share this with anyone",

  // Sección de apariencia
  theme: "Theme",
  themeDescription: "Customize your interface theme",
  light: "Light",
  dark: "Dark", 
  system: "System",
  
  // Visualización de wallet
  walletDisplay: "Wallet Display",
  walletDisplayDescription: "How your wallet address is shown",
  shortened: "Shortened (0x71C7...F1E2)",
  fullAddress: "Full Address",
  ensName: "ENS Name (if available)",
  
  // Idioma
  language: "Language",
  languageDescription: "Interface language preference",
  
  // Red
  networkSettings: "Network Settings",
  networkSettingsDescription: "Configure your default network",
  defaultNetwork: "Default Network",
  ethereum: "Ethereum",
  polygon: "Polygon",
  arbitrum: "Arbitrum",
  optimism: "Optimism",
  rpcEndpoint: "RPC Endpoint",
  customRpcEndpoint: "Custom RPC endpoint (advanced)",
  customRpcDisabled: "Custom RPC endpoints are disabled in this version",
  
  // Gas
  gasPreference: "Gas Preference",
  gasPreferenceDescription: "Default speed for transactions",
  standard: "Standard",
  fast: "Fast",
  rapid: "Rapid",
  economy: "Economy",
  
  // Seguridad del wallet
  walletSecurity: "Wallet Security",
  walletSecurityDescription: "Manage wallet security settings and passwords",
  changePassword: "Change Password",
  currentPassword: "Current Password",
  enterCurrentPassword: "Enter your current password",
  newPassword: "New Password",
  enterNewPassword: "Enter your new password",
  confirmPassword: "Confirm Password",
  confirmNewPassword: "Confirm your new password",
  updatePassword: "Update Password",
  updating: "Updating...",
  
  // Protección de wallet
  walletProtection: "Wallet Protection",
  walletProtectionDescription: "Your custodial WayBank is protected with bank-grade encryption. Keep your password secure and never share it with anyone.",
  passwordStrength: "Password Strength",
  passwordRequirements: "Your password should include uppercase, lowercase, numbers and special characters.",
  
  // Cosecha automática
  autoHarvest: "Auto Harvest",
  autoHarvestDescription: "Automatically harvest rewards",
  harvestPercentage: "Harvest Percentage",
  harvestPercentageDescription: "Percentage of rewards to harvest",
  automationNote: "Automation Note",
  automationNoteDescription: "Automation features require a connected wallet and may incur gas fees. All operations are carried out directly from your wallet without taking custody of your funds, in compliance with MiCA regulations.",
  
  // Botones
  saveSettings: "Save Settings",
  resetSettings: "Reset to Defaults",
  
  // Tarjetas y títulos
  settings: "Settings",
  configurePreferences: "Configure your WayBank preferences",
  accountSettings: "Account Settings",
  accountSettingsDescription: "Manage your account preferences",
  accountInfo: "Account Information",
  connectWallet: "Connect Wallet",
  connectWalletToAccess: "Connect wallet to access your positions",
  connectYourWalletToView: "Connect your wallet to view account info",
  
  // Información de cuenta
  walletAddress: "Wallet Address",
  networkName: "Network",
  connectedVia: "Connected Via",
  
  // MiCA Compliance
  micaCompliance: "MiCA Compliance",
  micaCompliant: "WayBank operates in full compliance with the Markets in Crypto-Assets (MiCA) regulation.",
  noCustody: "No custody of user funds - all operations are performed directly from your wallet.",
  transparentFees: "Transparent fee structure with no hidden charges.",
  onChainTransactions: "All transactions occur on-chain for full transparency and auditability.",
  
  // Sobre WayBank
  aboutWayBank: "About WayBank",
  version: "Version",
  lastUpdated: "Last Updated",
  documentation: "Documentation",
  support: "Support",
  
  // Notificaciones toast
  settingsSaved: "Settings Saved",
  settingsSavedDescription: "Your preferences have been successfully updated.",
  errorSaving: "Error Saving",
  errorSavingDescription: "Could not save settings. Please try again later.",
  walletNotConnected: "Wallet Not Connected",
  walletNotConnectedDescription: "Connect your wallet to save settings.",
  passwordUpdated: "Password Updated",
  passwordUpdatedDescription: "Your password has been successfully updated.",
  passwordError: "Password Error",
  currentPasswordRequired: "Current Password Required",
  currentPasswordRequiredDescription: "Please enter your current password.",
  newPasswordRequired: "New Password Required",
  newPasswordRequiredDescription: "Please enter your new password.",
  weakPassword: "Weak Password",
  weakPasswordDescription: "Please use a stronger password with uppercase, lowercase, numbers, and special characters.",
  passwordsNotMatch: "Passwords Don't Match",
  passwordsNotMatchDescription: "New password and confirmation must match.",
  
  // Fortaleza de contraseña
  noPassword: "No password",
  veryWeak: "Very weak",
  weak: "Weak",
  moderate: "Moderate",
  strong: "Strong",
  veryStrong: "Very strong"
};

// Traducciones en español
const es: SettingsTranslations = {
  // Pestañas
  profile: "Perfil",
  appearance: "Apariencia",
  network: "Red",
  security: "Seguridad",
  advanced: "Avanzado",
  general: "General",
  automation: "Automatización",

  // Respaldo de claves de seguridad
  downloadBackup: "Descargar Respaldo",
  neverShare: "Nunca compartas esto con nadie",

  // Sección de apariencia
  theme: "Tema",
  themeDescription: "Personaliza el tema de la interfaz",
  light: "Claro",
  dark: "Oscuro", 
  system: "Sistema",
  
  // Visualización de wallet
  walletDisplay: "Visualización de Wallet",
  walletDisplayDescription: "Cómo se muestra la dirección de tu wallet",
  shortened: "Acortada (0x71C7...F1E2)",
  fullAddress: "Dirección Completa",
  ensName: "Nombre ENS (si está disponible)",
  
  // Idioma
  language: "Idioma",
  languageDescription: "Preferencia de idioma de la interfaz",
  
  // Red
  networkSettings: "Configuración de Red",
  networkSettingsDescription: "Configura tu red predeterminada",
  defaultNetwork: "Red Predeterminada",
  ethereum: "Ethereum",
  polygon: "Polygon",
  arbitrum: "Arbitrum",
  optimism: "Optimism",
  rpcEndpoint: "Punto de Conexión RPC",
  customRpcEndpoint: "Punto de conexión RPC personalizado (avanzado)",
  customRpcDisabled: "Los puntos de conexión RPC personalizados están desactivados en esta versión",
  
  // Gas
  gasPreference: "Preferencia de Gas",
  gasPreferenceDescription: "Velocidad predeterminada para transacciones",
  standard: "Estándar",
  fast: "Rápido",
  rapid: "Instantáneo",
  economy: "Económico",
  
  // Seguridad del wallet
  walletSecurity: "Seguridad del Wallet",
  walletSecurityDescription: "Administrar configuración de seguridad y contraseñas",
  changePassword: "Cambiar Contraseña",
  currentPassword: "Contraseña Actual",
  enterCurrentPassword: "Ingresa tu contraseña actual",
  newPassword: "Nueva Contraseña",
  enterNewPassword: "Ingresa tu nueva contraseña",
  confirmPassword: "Confirmar Contraseña",
  confirmNewPassword: "Confirma tu nueva contraseña",
  updatePassword: "Actualizar Contraseña",
  updating: "Actualizando...",
  
  // Protección de wallet
  walletProtection: "Protección del Wallet",
  walletProtectionDescription: "Tu wallet custodial de WayBank está protegido con encriptación de nivel bancario. Mantén tu contraseña segura y nunca la compartas con nadie.",
  passwordStrength: "Fortaleza de Contraseña",
  passwordRequirements: "Tu contraseña debe incluir mayúsculas, minúsculas, números y caracteres especiales.",
  
  // Cosecha automática
  autoHarvest: "Cosecha Automática",
  autoHarvestDescription: "Cosechar recompensas automáticamente",
  harvestPercentage: "Porcentaje de Cosecha",
  harvestPercentageDescription: "Porcentaje de recompensas a cosechar",
  automationNote: "Nota de Automatización",
  automationNoteDescription: "Las funciones de automatización requieren una wallet conectada y pueden generar comisiones de gas. Todas las operaciones se realizan directamente desde tu wallet sin tomar custodia de tus fondos, en conformidad con las regulaciones MiCA.",
  
  // Botones
  saveSettings: "Guardar Configuración",
  resetSettings: "Restaurar Valores Predeterminados",
  
  // Tarjetas y títulos
  settings: "Configuración",
  configurePreferences: "Configura tus preferencias de WayBank",
  accountSettings: "Configuración de Cuenta",
  accountSettingsDescription: "Administra las preferencias de tu cuenta",
  accountInfo: "Información de Cuenta",
  connectWallet: "Conectar Wallet",
  connectWalletToAccess: "Conecta tu wallet para acceder a tus posiciones",
  connectYourWalletToView: "Conecta tu wallet para ver la información de tu cuenta",
  
  // Información de cuenta
  walletAddress: "Dirección del Wallet",
  networkName: "Red",
  connectedVia: "Conectado Vía",
  
  // MiCA Compliance
  micaCompliance: "Conformidad MiCA",
  micaCompliant: "WayBank opera en total conformidad con la regulación de Mercados de Criptoactivos (MiCA).",
  noCustody: "Sin custodia de fondos de usuarios - todas las operaciones se realizan directamente desde tu wallet.",
  transparentFees: "Estructura de tarifas transparente sin cargos ocultos.",
  onChainTransactions: "Todas las transacciones ocurren en cadena para total transparencia y auditabilidad.",
  
  // Sobre WayBank
  aboutWayBank: "Acerca de WayBank",
  version: "Versión",
  lastUpdated: "Última Actualización",
  documentation: "Documentación",
  support: "Soporte",
  
  // Notificaciones toast
  settingsSaved: "Configuración Guardada",
  settingsSavedDescription: "Tus preferencias han sido actualizadas correctamente.",
  errorSaving: "Error al Guardar",
  errorSavingDescription: "No se pudo guardar la configuración. Inténtalo de nuevo más tarde.",
  walletNotConnected: "Wallet no Conectado",
  walletNotConnectedDescription: "Conecta tu wallet para guardar la configuración.",
  passwordUpdated: "Contraseña Actualizada",
  passwordUpdatedDescription: "Tu contraseña ha sido actualizada correctamente.",
  passwordError: "Error de Contraseña",
  currentPasswordRequired: "Contraseña Actual Requerida",
  currentPasswordRequiredDescription: "Por favor, ingresa tu contraseña actual.",
  newPasswordRequired: "Nueva Contraseña Requerida",
  newPasswordRequiredDescription: "Por favor, ingresa tu nueva contraseña.",
  weakPassword: "Contraseña Débil",
  weakPasswordDescription: "Por favor, usa una contraseña más fuerte con mayúsculas, minúsculas, números y caracteres especiales.",
  passwordsNotMatch: "Las Contraseñas no Coinciden",
  passwordsNotMatchDescription: "La nueva contraseña y su confirmación deben coincidir.",
  
  // Fortaleza de contraseña
  noPassword: "Sin contraseña",
  veryWeak: "Muy débil",
  weak: "Débil",
  moderate: "Moderada",
  strong: "Fuerte",
  veryStrong: "Muy fuerte"
};

// Traducciones en portugués
const pt: SettingsTranslations = {
  // Pestañas
  profile: "Perfil",
  appearance: "Aparência",
  network: "Rede",
  security: "Segurança",
  advanced: "Avançado",
  general: "Geral",
  automation: "Automação",
  
  // Respaldo de claves de seguridad
  downloadBackup: "Baixar Backup",
  neverShare: "Nunca compartilhe isto com ninguém",

  // Sección de apariencia
  theme: "Tema",
  themeDescription: "Personalize o tema da interface",
  light: "Claro",
  dark: "Escuro", 
  system: "Sistema",
  
  // Visualización de wallet
  walletDisplay: "Exibição da Carteira",
  walletDisplayDescription: "Como seu endereço de carteira é mostrado",
  shortened: "Abreviado (0x71C7...F1E2)",
  fullAddress: "Endereço Completo",
  ensName: "Nome ENS (se disponível)",
  
  // Idioma
  language: "Idioma",
  languageDescription: "Preferência de idioma da interface",
  
  // Red
  networkSettings: "Configurações de Rede",
  networkSettingsDescription: "Configure sua rede padrão",
  defaultNetwork: "Rede Padrão",
  ethereum: "Ethereum",
  polygon: "Polygon",
  arbitrum: "Arbitrum",
  optimism: "Optimism",
  rpcEndpoint: "Endpoint RPC",
  customRpcEndpoint: "Endpoint RPC Personalizado",
  customRpcDisabled: "Desabilitado (usando RPC padrão)",
  
  // Gas
  gasPreference: "Preferência de Gas",
  gasPreferenceDescription: "Velocidade padrão para transações",
  standard: "Padrão",
  fast: "Rápido",
  rapid: "Imediato",
  economy: "Econômico",
  
  // Seguridad del wallet
  walletSecurity: "Segurança da Carteira",
  walletSecurityDescription: "Gerencie a segurança da sua carteira",
  changePassword: "Alterar Senha",
  currentPassword: "Senha Atual",
  enterCurrentPassword: "Digite sua senha atual",
  newPassword: "Nova Senha",
  enterNewPassword: "Digite sua nova senha",
  confirmPassword: "Confirmar Senha",
  confirmNewPassword: "Confirme sua nova senha",
  updatePassword: "Atualizar Senha",
  updating: "Atualizando...",
  
  // Protección de wallet
  walletProtection: "Proteção da Carteira",
  walletProtectionDescription: "Configure medidas de proteção adicionais",
  passwordStrength: "Força da Senha",
  passwordRequirements: "Requisitos de Senha",
  
  // Cosecha automática
  autoHarvest: "Colheita Automática",
  autoHarvestDescription: "Colher recompensas automaticamente",
  harvestPercentage: "Porcentagem de Colheita",
  harvestPercentageDescription: "Porcentagem de recompensas a colher",
  automationNote: "Nota sobre Automação",
  automationNoteDescription: "As funções de automação requerem uma carteira conectada e podem gerar taxas de gas. Todas as operações são realizadas diretamente da sua carteira sem custodiar seus fundos, em conformidade com as regulamentações MiCA.",
  
  // Botones
  saveSettings: "Salvar Configurações",
  resetSettings: "Restaurar Padrões",
  
  // Tarjetas y títulos
  settings: "Configurações",
  configurePreferences: "Configure suas preferências do WayBank",
  accountSettings: "Configurações da Conta",
  accountSettingsDescription: "Gerencie as preferências da sua conta",
  accountInfo: "Informações da Conta",
  connectWallet: "Conectar Carteira",
  connectWalletToAccess: "Conecte sua carteira para acessar suas posições",
  connectYourWalletToView: "Conecte sua carteira para ver as informações da conta",
  
  // Información de cuenta
  walletAddress: "Endereço da Carteira",
  networkName: "Rede",
  connectedVia: "Conectado Via",
  
  // MiCA Compliance
  micaCompliance: "Conformidade MiCA",
  micaCompliant: "Em conformidade com MiCA",
  noCustody: "Sem custódia",
  transparentFees: "Taxas transparentes",
  onChainTransactions: "Transações on-chain",
  
  // Sobre WayBank
  aboutWayBank: "Sobre WayBank",
  version: "Versão",
  lastUpdated: "Última Atualização",
  documentation: "Documentação",
  support: "Suporte",
  
  // Notificaciones toast
  settingsSaved: "Configurações Salvas",
  settingsSavedDescription: "Suas configurações foram atualizadas com sucesso",
  errorSaving: "Erro ao Salvar",
  errorSavingDescription: "Ocorreu um erro ao salvar suas configurações",
  walletNotConnected: "Carteira não Conectada",
  walletNotConnectedDescription: "Conecte sua carteira para acessar esta funcionalidade",
  passwordUpdated: "Senha Atualizada",
  passwordUpdatedDescription: "Sua senha foi atualizada com sucesso",
  passwordError: "Erro na Senha",
  currentPasswordRequired: "Senha Atual Necessária",
  currentPasswordRequiredDescription: "Por favor, digite sua senha atual",
  newPasswordRequired: "Nova Senha Necessária",
  newPasswordRequiredDescription: "Por favor, digite uma nova senha",
  weakPassword: "Senha Fraca",
  weakPasswordDescription: "Por favor, escolha uma senha mais forte",
  passwordsNotMatch: "Senhas não Coincidem",
  passwordsNotMatchDescription: "A confirmação da senha não coincide com a nova senha",
  
  // Fortaleza de contraseña
  noPassword: "Sem senha",
  veryWeak: "Muito fraca",
  weak: "Fraca",
  moderate: "Moderada",
  strong: "Forte",
  veryStrong: "Muito forte"
};

// Traducciones al árabe
const ar: SettingsTranslations = {
  // Pestañas
  profile: "الملف الشخصي",
  appearance: "المظهر",
  network: "الشبكة",
  security: "الأمان",
  advanced: "إعدادات متقدمة",
  general: "عام",
  automation: "الأتمتة",

  // Respaldo de claves de seguridad
  downloadBackup: "تنزيل نسخة احتياطية",
  neverShare: "لا تشارك هذا مع أي شخص أبدًا",

  // Sección de apariencia
  theme: "السمة",
  themeDescription: "تخصيص سمة الواجهة الخاصة بك",
  light: "فاتح",
  dark: "داكن",
  system: "النظام",

  // Visualización de wallet
  walletDisplay: "عرض المحفظة",
  walletDisplayDescription: "كيف يتم عرض عنوان محفظتك",
  shortened: "مختصر (0x71C7...F1E2)",
  fullAddress: "العنوان الكامل",
  ensName: "اسم ENS (إذا كان متاحًا)",

  // Idioma
  language: "اللغة",
  languageDescription: "تفضيل لغة الواجهة",

  // Red
  networkSettings: "إعدادات الشبكة",
  networkSettingsDescription: "تكوين الشبكة الافتراضية الخاصة بك",
  defaultNetwork: "الشبكة الافتراضية",
  ethereum: "إيثيريوم",
  polygon: "بوليغون",
  arbitrum: "أربيتروم",
  optimism: "أوبتيميزم",
  rpcEndpoint: "نقطة نهاية RPC",
  customRpcEndpoint: "نقطة نهاية RPC مخصصة (متقدمة)",
  customRpcDisabled: "نقاط نهاية RPC المخصصة معطلة في هذا الإصدار",

  // Gas
  gasPreference: "تفضيل الغاز",
  gasPreferenceDescription: "السرعة الافتراضية للمعاملات",
  standard: "قياسي",
  fast: "سريع",
  rapid: "سريع جدًا",
  economy: "اقتصادي",

  // Seguridad del wallet
  walletSecurity: "أمان المحفظة",
  walletSecurityDescription: "إدارة إعدادات أمان المحفظة وكلمات المرور",
  changePassword: "تغيير كلمة المرور",
  currentPassword: "كلمة المرور الحالية",
  enterCurrentPassword: "أدخل كلمة المرور الحالية",
  newPassword: "كلمة المرور الجديدة",
  enterNewPassword: "أدخل كلمة المرور الجديدة",
  confirmPassword: "تأكيد كلمة المرور",
  confirmNewPassword: "تأكيد كلمة المرور الجديدة",
  updatePassword: "تحديث كلمة المرور",
  updating: "جاري التحديث...",

  // Protección de wallet
  walletProtection: "حماية المحفظة",
  walletProtectionDescription: "محفظة WayBank الحاضنة الخاصة بك محمية بتشفير من الدرجة المصرفية. حافظ على كلمة المرور الخاصة بك آمنة ولا تشاركها مع أي شخص أبدًا.",
  passwordStrength: "قوة كلمة المرور",
  passwordRequirements: "يجب أن تتضمن كلمة المرور الخاصة بك أحرفًا كبيرة وصغيرة وأرقامًا وأحرفًا خاصة.",

  // Cosecha automática
  autoHarvest: "حصاد تلقائي",
  autoHarvestDescription: "حصاد المكافآت تلقائيًا",
  harvestPercentage: "نسبة الحصاد",
  harvestPercentageDescription: "نسبة المكافآت المراد حصادها",
  automationNote: "ملاحظة الأتمتة",
  automationNoteDescription: "تتطلب ميزات الأتمتة محفظة متصلة وقد تتكبد رسوم الغاز. يتم تنفيذ جميع العمليات مباشرة من محفظتك دون أخذ حضانة أموالك، وذلك بما يتوافق مع لوائح MiCA.",

  // Botones
  saveSettings: "حفظ الإعدادات",
  resetSettings: "إعادة تعيين إلى الافتراضيات",

  // Tarjetas y títulos
  settings: "الإعدادات",
  configurePreferences: "تكوين تفضيلات WayBank الخاصة بك",
  accountSettings: "إعدادات الحساب",
  accountSettingsDescription: "إدارة تفضيلات حسابك",
  accountInfo: "معلومات الحساب",
  connectWallet: "ربط المحفظة",
  connectWalletToAccess: "ربط المحفظة للوصول إلى مراكزك",
  connectYourWalletToView: "ربط محفظتك لعرض معلومات الحساب",

  // Información de cuenta
  walletAddress: "عنوان المحفظة",
  networkName: "الشبكة",
  connectedVia: "متصل عبر",

  // MiCA Compliance
  micaCompliance: "الامتثال للائحة MiCA",
  micaCompliant: "تعمل WayBank بالامتثال الكامل للائحة الأسواق في الأصول المشفرة (MiCA).",
  noCustody: "لا توجد حضانة لأموال المستخدمين - يتم تنفيذ جميع العمليات مباشرة من محفظتك.",
  transparentFees: "هيكل رسوم شفاف بدون رسوم خفية.",
  onChainTransactions: "تحدث جميع المعاملات على السلسلة لضمان الشفافية الكاملة وإمكانية التدقيق.",

  // Sobre WayBank
  aboutWayBank: "حول WayBank",
  version: "الإصدار",
  lastUpdated: "آخر تحديث",
  documentation: "الوثائق",
  support: "الدعم",

  // Notificaciones toast
  settingsSaved: "تم حفظ الإعدادات",
  settingsSavedDescription: "تم تحديث تفضيلاتك بنجاح.",
  errorSaving: "خطأ في الحفظ",
  errorSavingDescription: "تعذر حفظ الإعدادات. يرجى المحاولة مرة أخرى لاحقًا.",
  walletNotConnected: "المحفظة غير متصلة",
  walletNotConnectedDescription: "ربط محفظتك لحفظ الإعدادات.",
  passwordUpdated: "تم تحديث كلمة المرور",
  passwordUpdatedDescription: "تم تحديث كلمة المرور الخاصة بك بنجاح.",
  passwordError: "خطأ في كلمة المرور",
  currentPasswordRequired: "كلمة المرور الحالية مطلوبة",
  currentPasswordRequiredDescription: "الرجاء إدخال كلمة المرور الحالية الخاصة بك.",
  newPasswordRequired: "كلمة المرور الجديدة مطلوبة",
  newPasswordRequiredDescription: "الرجاء إدخال كلمة المرور الجديدة الخاصة بك.",
  weakPassword: "كلمة مرور ضعيفة",
  weakPasswordDescription: "يرجى استخدام كلمة مرور أقوى تتضمن أحرفًا كبيرة وصغيرة وأرقامًا وأحرفًا خاصة.",
  passwordsNotMatch: "كلمات المرور غير متطابقة",
  passwordsNotMatchDescription: "يجب أن تتطابق كلمة المرور الجديدة والتأكيد.",

  // Fortaleza de contraseña
  noPassword: "لا توجد كلمة مرور",
  veryWeak: "ضعيف جداً",
  weak: "ضعيف",
  moderate: "متوسط",
  strong: "قوي",
  veryStrong: "قوي جداً"
};

// Traductions en Français
const fr: SettingsTranslations = {
  // Pestañas
  profile: "Profil",
  appearance: "Apparence",
  network: "Réseau",
  security: "Sécurité",
  advanced: "Avancé",
  general: "Général",
  automation: "Automatisation",
  
  // Respaldo de claves de seguridad
  downloadBackup: "Télécharger la sauvegarde",
  neverShare: "Ne jamais partager ceci avec personne",

  // Sección de apariencia
  theme: "Thème",
  themeDescription: "Personnaliser le thème de votre interface",
  light: "Clair",
  dark: "Sombre", 
  system: "Système",
  
  // Visualización de wallet
  walletDisplay: "Affichage du portefeuille",
  walletDisplayDescription: "Comment votre adresse de portefeuille est affichée",
  shortened: "Raccourcie (0x71C7...F1E2)",
  fullAddress: "Adresse complète",
  ensName: "Nom ENS (si disponible)",
  
  // Idioma
  language: "Langue",
  languageDescription: "Préférence de langue de l'interface",
  
  // Red
  networkSettings: "Paramètres réseau",
  networkSettingsDescription: "Configurer votre réseau par défaut",
  defaultNetwork: "Réseau par défaut",
  ethereum: "Ethereum",
  polygon: "Polygon",
  arbitrum: "Arbitrum",
  optimism: "Optimism",
  rpcEndpoint: "Point de terminaison RPC",
  customRpcEndpoint: "Point de terminaison RPC personnalisé (avancé)",
  customRpcDisabled: "Les points de terminaison RPC personnalisés sont désactivés dans cette version",
  
  // Gas
  gasPreference: "Préférence de gaz",
  gasPreferenceDescription: "Vitesse par défaut pour les transactions",
  standard: "Standard",
  fast: "Rapide",
  rapid: "Très rapide",
  economy: "Économie",
  
  // Seguridad del wallet
  walletSecurity: "Sécurité du portefeuille",
  walletSecurityDescription: "Gérer les paramètres de sécurité et les mots de passe du portefeuille",
  changePassword: "Changer le mot de passe",
  currentPassword: "Mot de passe actuel",
  enterCurrentPassword: "Entrez votre mot de passe actuel",
  newPassword: "Nouveau mot de passe",
  enterNewPassword: "Entrez votre nouveau mot de passe",
  confirmPassword: "Confirmer le mot de passe",
  confirmNewPassword: "Confirmez votre nouveau mot de passe",
  updatePassword: "Mettre à jour le mot de passe",
  updating: "Mise à jour...",
  
  // Protección de wallet
  walletProtection: "Protection du portefeuille",
  walletProtectionDescription: "Votre WayBank custodial est protégé par un chiffrement de niveau bancaire. Gardez votre mot de passe en sécurité et ne le partagez jamais avec personne.",
  passwordStrength: "Force du mot de passe",
  passwordRequirements: "Votre mot de passe doit inclure des majuscules, des minuscules, des chiffres et des caractères spéciaux.",
  
  // Cosecha automática
  autoHarvest: "Récolte automatique",
  autoHarvestDescription: "Récolter automatiquement les récompenses",
  harvestPercentage: "Pourcentage de récolte",
  harvestPercentageDescription: "Pourcentage de récompenses à récolter",
  automationNote: "Note sur l'automatisation",
  automationNoteDescription: "Les fonctionnalités d'automatisation nécessitent un portefeuille connecté et peuvent entraîner des frais de gaz. Toutes les opérations sont effectuées directement depuis votre portefeuille sans prise en charge de vos fonds, conformément aux réglementations MiCA.",
  
  // Botones
  saveSettings: "Enregistrer les paramètres",
  resetSettings: "Réinitialiser aux valeurs par défaut",
  
  // Tarjetas y títulos
  settings: "Paramètres",
  configurePreferences: "Configurer vos préférences WayBank",
  accountSettings: "Paramètres du compte",
  accountSettingsDescription: "Gérer vos préférences de compte",
  accountInfo: "Informations du compte",
  connectWallet: "Connecter le portefeuille",
  connectWalletToAccess: "Connecter le portefeuille pour accéder à vos positions",
  connectYourWalletToView: "Connectez votre portefeuille pour afficher les informations du compte",
  
  // Información de cuenta
  walletAddress: "Adresse du portefeuille",
  networkName: "Réseau",
  connectedVia: "Connecté via",
  
  // MiCA Compliance
  micaCompliance: "Conformité MiCA",
  micaCompliant: "WayBank opère en pleine conformité avec le règlement sur les marchés de crypto-actifs (MiCA).",
  noCustody: "Pas de garde des fonds des utilisateurs - toutes les opérations sont effectuées directement depuis votre portefeuille.",
  transparentFees: "Structure de frais transparente sans frais cachés.",
  onChainTransactions: "Toutes les transactions se produisent sur la chaîne pour une transparence et une auditabilité complètes.",
  
  // Sobre WayBank
  aboutWayBank: "À propos de WayBank",
  version: "Version",
  lastUpdated: "Dernière mise à jour",
  documentation: "Documentation",
  support: "Support",
  
  // Notificaciones toast
  settingsSaved: "Paramètres enregistrés",
  settingsSavedDescription: "Vos préférences ont été mises à jour avec succès.",
  errorSaving: "Erreur d'enregistrement",
  errorSavingDescription: "Impossible d'enregistrer les paramètres. Veuillez réessayer plus tard.",
  walletNotConnected: "Portefeuille non connecté",
  walletNotConnectedDescription: "Connectez votre portefeuille pour enregistrer les paramètres.",
  passwordUpdated: "Mot de passe mis à jour",
  passwordUpdatedDescription: "Votre mot de passe a été mis à jour avec succès.",
  passwordError: "Erreur de mot de passe",
  currentPasswordRequired: "Mot de passe actuel requis",
  currentPasswordRequiredDescription: "Veuillez entrer votre mot de passe actuel.",
  newPasswordRequired: "Nouveau mot de passe requis",
  newPasswordRequiredDescription: "Veuillez entrer votre nouveau mot de passe.",
  weakPassword: "Mot de passe faible",
  weakPasswordDescription: "Veuillez utiliser un mot de passe plus fort avec des majuscules, des minuscules, des chiffres et des caractères spéciaux.",
  passwordsNotMatch: "Les mots de passe ne correspondent pas",
  passwordsNotMatchDescription: "Le nouveau mot de passe et la confirmation doivent correspondre.",
  
  // Fortaleza de contraseña
  noPassword: "Pas de mot de passe",
  veryWeak: "Très faible",
  weak: "Faible",
  moderate: "Modéré",
  strong: "Fort",
  veryStrong: "Très fort"
};
// Übersetzungen auf Deutsch
const de: SettingsTranslations = {
  // Pestañas
  profile: "Profil",
  appearance: "Erscheinungsbild",
  network: "Netzwerk",
  security: "Sicherheit",
  advanced: "Erweitert",
  general: "Allgemein",
  automation: "Automatisierung",
  
  // Respaldo de claves de seguridad
  downloadBackup: "Backup herunterladen",
  neverShare: "Teilen Sie dies niemals mit jemandem",

  // Sección de apariencia
  theme: "Thema",
  themeDescription: "Passen Sie Ihr Interface-Thema an",
  light: "Hell",
  dark: "Dunkel", 
  system: "System",
  
  // Visualización de wallet
  walletDisplay: "Wallet-Anzeige",
  walletDisplayDescription: "Wie Ihre Wallet-Adresse angezeigt wird",
  shortened: "Gekürzt (0x71C7...F1E2)",
  fullAddress: "Volle Adresse",
  ensName: "ENS-Name (falls verfügbar)",
  
  // Idioma
  language: "Sprache",
  languageDescription: "Bevorzugte Oberflächensprache",
  
  // Red
  networkSettings: "Netzwerkeinstellungen",
  networkSettingsDescription: "Konfigurieren Sie Ihr Standardnetzwerk",
  defaultNetwork: "Standardnetzwerk",
  ethereum: "Ethereum",
  polygon: "Polygon",
  arbitrum: "Arbitrum",
  optimism: "Optimismus",
  rpcEndpoint: "RPC-Endpunkt",
  customRpcEndpoint: "Benutzerdefinierter RPC-Endpunkt (erweitert)",
  customRpcDisabled: "Benutzerdefinierte RPC-Endpunkte sind in dieser Version deaktiviert",
  
  // Gas
  gasPreference: "Gas-Präferenz",
  gasPreferenceDescription: "Standardgeschwindigkeit für Transaktionen",
  standard: "Standard",
  fast: "Schnell",
  rapid: "Sehr schnell",
  economy: "Wirtschaftlich",
  
  // Seguridad del wallet
  walletSecurity: "Wallet-Sicherheit",
  walletSecurityDescription: "Verwalten Sie die Sicherheitseinstellungen und Passwörter des Wallets",
  changePassword: "Passwort ändern",
  currentPassword: "Aktuelles Passwort",
  enterCurrentPassword: "Geben Sie Ihr aktuelles Passwort ein",
  newPassword: "Neues Passwort",
  enterNewPassword: "Geben Sie Ihr neues Passwort ein",
  confirmPassword: "Passwort bestätigen",
  confirmNewPassword: "Bestätigen Sie Ihr neues Passwort",
  updatePassword: "Passwort aktualisieren",
  updating: "Wird aktualisiert...",
  
  // Protección de wallet
  walletProtection: "Wallet-Schutz",
  walletProtectionDescription: "Ihr verwahrtes WayBank ist mit Banken-Verschlüsselung geschützt. Halten Sie Ihr Passwort sicher und teilen Sie es niemals mit jemandem.",
  passwordStrength: "Passwortstärke",
  passwordRequirements: "Ihr Passwort sollte Großbuchstaben, Kleinbuchstaben, Zahlen und Sonderzeichen enthalten.",
  
  // Cosecha automática
  autoHarvest: "Automatische Ernte",
  autoHarvestDescription: "Belohnungen automatisch ernten",
  harvestPercentage: "Ernteprozentsatz",
  harvestPercentageDescription: "Prozentsatz der zu erntenden Belohnungen",
  automationNote: "Automatisierungshinweis",
  automationNoteDescription: "Automatisierungsfunktionen erfordern ein verbundenes Wallet und können Gasgebühren verursachen. Alle Vorgänge werden direkt von Ihrem Wallet aus ohne Übernahme der Verwahrung Ihrer Gelder gemäß den MiCA-Vorschriften durchgeführt.",
  
  // Botones
  saveSettings: "Einstellungen speichern",
  resetSettings: "Auf Standard zurücksetzen",
  
  // Tarjetas y títulos
  settings: "Einstellungen",
  configurePreferences: "Konfigurieren Sie Ihre WayBank-Einstellungen",
  accountSettings: "Kontoeinstellungen",
  accountSettingsDescription: "Verwalten Sie Ihre Kontoeinstellungen",
  accountInfo: "Kontoinformationen",
  connectWallet: "Wallet verbinden",
  connectWalletToAccess: "Wallet verbinden, um auf Ihre Positionen zuzugreifen",
  connectYourWalletToView: "Verbinden Sie Ihr Wallet, um Kontoinformationen anzuzeigen",
  
  // Información de cuenta
  walletAddress: "Wallet-Adresse",
  networkName: "Netzwerk",
  connectedVia: "Verbunden über",
  
  // MiCA Compliance
  micaCompliance: "MiCA-Konformität",
  micaCompliant: "WayBank arbeitet in voller Übereinstimmung mit der Markets in Crypto-Assets (MiCA)-Verordnung.",
  noCustody: "Keine Verwahrung von Benutzergeldern - alle Operationen werden direkt von Ihrem Wallet aus durchgeführt.",
  transparentFees: "Transparente Gebührenstruktur ohne versteckte Kosten.",
  onChainTransactions: "Alle Transaktionen erfolgen On-Chain für volle Transparenz und Prüfbarkeit.",
  
  // Sobre WayBank
  aboutWayBank: "Über WayBank",
  version: "Version",
  lastUpdated: "Zuletzt aktualisiert",
  documentation: "Dokumentation",
  support: "Support",
  
  // Notificaciones toast
  settingsSaved: "Einstellungen gespeichert",
  settingsSavedDescription: "Ihre Präferenzen wurden erfolgreich aktualisiert.",
  errorSaving: "Fehler beim Speichern",
  errorSavingDescription: "Einstellungen konnten nicht gespeichert werden. Bitte versuchen Sie es später erneut.",
  walletNotConnected: "Wallet nicht verbunden",
  walletNotConnectedDescription: "Verbinden Sie Ihr Wallet, um Einstellungen zu speichern.",
  passwordUpdated: "Passwort aktualisiert",
  passwordUpdatedDescription: "Ihr Passwort wurde erfolgreich aktualisiert.",
  passwordError: "Passwortfehler",
  currentPasswordRequired: "Aktuelles Passwort erforderlich",
  currentPasswordRequiredDescription: "Bitte geben Sie Ihr aktuelles Passwort ein.",
  newPasswordRequired: "Neues Passwort erforderlich",
  newPasswordRequiredDescription: "Bitte geben Sie Ihr neues Passwort ein.",
  weakPassword: "Schwaches Passwort",
  weakPasswordDescription: "Bitte verwenden Sie ein stärkeres Passwort mit Groß- und Kleinbuchstaben, Zahlen und Sonderzeichen.",
  passwordsNotMatch: "Passwörter stimmen nicht überein",
  passwordsNotMatchDescription: "Neues Passwort und Bestätigung müssen übereinstimmen.",
  
  // Fortaleza de contraseña
  noPassword: "Kein Passwort",
  veryWeak: "Sehr schwach",
  weak: "Schwach",
  moderate: "Mittel",
  strong: "Stark",
  veryStrong: "Sehr stark"
};

// Traduzioni in italiano
const it: SettingsTranslations = {
  // Pestañas
  profile: "Profilo",
  appearance: "Aspetto",
  network: "Rete",
  security: "Sicurezza",
  advanced: "Avanzate",
  general: "Generali",
  automation: "Automazione",
  
  // Respaldo de claves de seguridad
  downloadBackup: "Scarica Backup",
  neverShare: "Non condividere mai questo con nessuno",

  // Sección de apariencia
  theme: "Tema",
  themeDescription: "Personalizza il tema della tua interfaccia",
  light: "Chiaro",
  dark: "Scuro", 
  system: "Sistema",
  
  // Visualización de wallet
  walletDisplay: "Visualizzazione Wallet",
  walletDisplayDescription: "Come viene visualizzato l'indirizzo del tuo wallet",
  shortened: "Accorciato (0x71C7...F1E2)",
  fullAddress: "Indirizzo Completo",
  ensName: "Nome ENS (se disponibile)",
  
  // Idioma
  language: "Lingua",
  languageDescription: "Preferenza lingua interfaccia",
  
  // Red
  networkSettings: "Impostazioni di Rete",
  networkSettingsDescription: "Configura la tua rete predefinita",
  defaultNetwork: "Rete Predefinita",
  ethereum: "Ethereum",
  polygon: "Polygon",
  arbitrum: "Arbitrum",
  optimism: "Optimism",
  rpcEndpoint: "Endpoint RPC",
  customRpcEndpoint: "Endpoint RPC personalizzato (avanzato)",
  customRpcDisabled: "Gli endpoint RPC personalizzati sono disabilitati in questa versione",
  
  // Gas
  gasPreference: "Preferenza Gas",
  gasPreferenceDescription: "Velocità predefinita per le transazioni",
  standard: "Standard",
  fast: "Veloce",
  rapid: "Rapido",
  economy: "Economia",
  
  // Seguridad del wallet
  walletSecurity: "Sicurezza del Wallet",
  walletSecurityDescription: "Gestisci le impostazioni di sicurezza e le password del wallet",
  changePassword: "Cambia Password",
  currentPassword: "Password Attuale",
  enterCurrentPassword: "Inserisci la tua password attuale",
  newPassword: "Nuova Password",
  enterNewPassword: "Inserisci la tua nuova password",
  confirmPassword: "Conferma Password",
  confirmNewPassword: "Conferma la tua nuova password",
  updatePassword: "Aggiorna Password",
  updating: "Aggiornamento...",
  
  // Protección de wallet
  walletProtection: "Protezione del Wallet",
  walletProtectionDescription: "Il tuo WayBank custodiale è protetto con crittografia di livello bancario. Mantieni la tua password al sicuro e non condividerla mai con nessuno.",
  passwordStrength: "Forza della Password",
  passwordRequirements: "La tua password dovrebbe includere maiuscole, minuscole, numeri e caratteri speciali.",
  
  // Cosecha automática
  autoHarvest: "Raccolta Automatica",
  autoHarvestDescription: "Raccogli automaticamente le ricompense",
  harvestPercentage: "Percentuale di Raccolta",
  harvestPercentageDescription: "Percentuale di ricompense da raccogliere",
  automationNote: "Nota sull'Automazione",
  automationNoteDescription: "Le funzionalità di automazione richiedono un wallet connesso e potrebbero comportare commissioni di gas. Tutte le operazioni vengono eseguite direttamente dal tuo wallet senza prendere in custodia i tuoi fondi, in conformità con le normative MiCA.",
  
  // Botones
  saveSettings: "Salva Impostazioni",
  resetSettings: "Ripristina le impostazioni predefinite",
  
  // Tarjetas y títulos
  settings: "Impostazioni",
  configurePreferences: "Configura le tue preferenze WayBank",
  accountSettings: "Impostazioni Account",
  accountSettingsDescription: "Gestisci le preferenze del tuo account",
  accountInfo: "Informazioni Account",
  connectWallet: "Connetti Wallet",
  connectWalletToAccess: "Connetti il wallet per accedere alle tue posizioni",
  connectYourWalletToView: "Connetti il tuo wallet per visualizzare le informazioni dell'account",
  
  // Información de cuenta
  walletAddress: "Indirizzo Wallet",
  networkName: "Rete",
  connectedVia: "Connesso tramite",
  
  // MiCA Compliance
  micaCompliance: "Conformità MiCA",
  micaCompliant: "WayBank opera in piena conformità con il regolamento sui mercati delle cripto-attività (MiCA).",
  noCustody: "Nessuna custodia dei fondi dell'utente - tutte le operazioni vengono eseguite direttamente dal tuo wallet.",
  transparentFees: "Struttura delle commissioni trasparente senza costi nascosti.",
  onChainTransactions: "Tutte le transazioni avvengono on-chain per piena trasparenza e verificabilità.",
  
  // Sobre WayBank
  aboutWayBank: "Informazioni su WayBank",
  version: "Versione",
  lastUpdated: "Ultimo Aggiornamento",
  documentation: "Documentazione",
  support: "Supporto",
  
  // Notificaciones toast
  settingsSaved: "Impostazioni Salvate",
  settingsSavedDescription: "Le tue preferenze sono state aggiornate con successo.",
  errorSaving: "Errore nel Salvataggio",
  errorSavingDescription: "Impossibile salvare le impostazioni. Riprova più tardi.",
  walletNotConnected: "Wallet non Connesso",
  walletNotConnectedDescription: "Connetti il tuo wallet per salvare le impostazioni.",
  passwordUpdated: "Password Aggiornata",
  passwordUpdatedDescription: "La tua password è stata aggiornata con successo.",
  passwordError: "Errore Password",
  currentPasswordRequired: "Password Attuale Richiesta",
  currentPasswordRequiredDescription: "Inserisci la tua password attuale.",
  newPasswordRequired: "Nuova Password Richiesta",
  newPasswordRequiredDescription: "Inserisci la tua nuova password.",
  weakPassword: "Password Debole",
  weakPasswordDescription: "Utilizza una password più forte con maiuscole, minuscole, numeri e caratteri speciali.",
  passwordsNotMatch: "Le Password non Corrispondono",
  passwordsNotMatchDescription: "La nuova password e la conferma devono corrispondere.",
  
  // Fortaleza de contraseña
  noPassword: "Nessuna password",
  veryWeak: "Molto debole",
  weak: "Debole",
  moderate: "Moderata",
  strong: "Forte",
  veryStrong: "Molto forte"
};

// Traduções em Chinês
const zh: SettingsTranslations = {
  // Pestañas
  profile: "个人资料",
  appearance: "外观",
  network: "网络",
  security: "安全",
  advanced: "高级",
  general: "通用",
  automation: "自动化",
  
  // Respaldo de claves de seguridad
  downloadBackup: "下载备份",
  neverShare: "切勿与任何人分享此内容",

  // Sección de apariencia
  theme: "主题",
  themeDescription: "自定义您的界面主题",
  light: "浅色",
  dark: "深色", 
  system: "系统",
  
  // Visualización de wallet
  walletDisplay: "钱包显示",
  walletDisplayDescription: "您的钱包地址显示方式",
  shortened: "缩短 (0x71C7...F1E2)",
  fullAddress: "完整地址",
  ensName: "ENS 名称 (如果可用)",
  
  // Idioma
  language: "语言",
  languageDescription: "界面语言偏好",
  
  // Red
  networkSettings: "网络设置",
  networkSettingsDescription: "配置您的默认网络",
  defaultNetwork: "默认网络",
  ethereum: "以太坊",
  polygon: "Polygon",
  arbitrum: "Arbitrum",
  optimism: "Optimism",
  rpcEndpoint: "RPC 端点",
  customRpcEndpoint: "自定义 RPC 端点 (高级)",
  customRpcDisabled: "此版本中已禁用自定义 RPC 端点",
  
  // Gas
  gasPreference: "Gas 偏好",
  gasPreferenceDescription: "交易的默认速度",
  standard: "标准",
  fast: "快速",
  rapid: "急速",
  economy: "经济",
  
  // Seguridad del wallet
  walletSecurity: "钱包安全",
  walletSecurityDescription: "管理钱包安全设置和密码",
  changePassword: "更改密码",
  currentPassword: "当前密码",
  enterCurrentPassword: "输入您的当前密码",
  newPassword: "新密码",
  enterNewPassword: "输入您的新密码",
  confirmPassword: "确认密码",
  confirmNewPassword: "确认您的新密码",
  updatePassword: "更新密码",
  updating: "正在更新...",
  
  // Protección de wallet
  walletProtection: "钱包保护",
  walletProtectionDescription: "您的托管 WayBank 受银行级加密保护。请妥善保管您的密码，切勿与任何人分享。",
  passwordStrength: "密码强度",
  passwordRequirements: "您的密码应包含大写字母、小写字母、数字和特殊字符。",
  
  // Cosecha automática
  autoHarvest: "自动收割",
  autoHarvestDescription: "自动收割奖励",
  harvestPercentage: "收割百分比",
  harvestPercentageDescription: "收割奖励的百分比",
  automationNote: "自动化说明",
  automationNoteDescription: "自动化功能需要连接钱包，并可能产生 Gas 费用。所有操作均直接从您的钱包执行，不托管您的资金，符合 MiCA 法规。",
  
  // Botones
  saveSettings: "保存设置",
  resetSettings: "重置为默认值",
  
  // Tarjetas y títulos
  settings: "设置",
  configurePreferences: "配置您的 WayBank 偏好",
  accountSettings: "账户设置",
  accountSettingsDescription: "管理您的账户偏好",
  accountInfo: "账户信息",
  connectWallet: "连接钱包",
  connectWalletToAccess: "连接钱包以访问您的头寸",
  connectYourWalletToView: "连接您的钱包以查看账户信息",
  
  // Información de cuenta
  walletAddress: "钱包地址",
  networkName: "网络",
  connectedVia: "连接方式",
  
  // MiCA Compliance
  micaCompliance: "MiCA 合规性",
  micaCompliant: "WayBank 完全符合加密资产市场 (MiCA) 法规。",
  noCustody: "不托管用户资金 - 所有操作均直接从您的钱包执行。",
  transparentFees: "透明的费用结构，无隐藏费用。",
  onChainTransactions: "所有交易都在链上进行，以实现完全透明和可审计性。",
  
  // Sobre WayBank
  aboutWayBank: "关于 WayBank",
  version: "版本",
  lastUpdated: "最后更新",
  documentation: "文档",
  support: "支持",
  
  // Notificaciones toast
  settingsSaved: "设置已保存",
  settingsSavedDescription: "您的偏好已成功更新。",
  errorSaving: "保存错误",
  errorSavingDescription: "无法保存设置。请稍后再试。",
  walletNotConnected: "钱包未连接",
  walletNotConnectedDescription: "连接您的钱包以保存设置。",
  passwordUpdated: "密码已更新",
  passwordUpdatedDescription: "您的密码已成功更新。",
  passwordError: "密码错误",
  currentPasswordRequired: "需要当前密码",
  currentPasswordRequiredDescription: "请输入您的当前密码。",
  newPasswordRequired: "需要新密码",
  newPasswordRequiredDescription: "请输入您的新密码。",
  weakPassword: "弱密码",
  weakPasswordDescription: "请使用更强的密码，包含大写字母、小写字母、数字和特殊字符。",
  passwordsNotMatch: "密码不匹配",
  passwordsNotMatchDescription: "新密码和确认密码必须匹配。",
  
  // Fortaleza de contraseña
  noPassword: "无密码",
  veryWeak: "非常弱",
  weak: "弱",
  moderate: "中等",
  strong: "强",
  veryStrong: "非常强"
};
// Traduções em Hindi
const hi: SettingsTranslations = {
  // Pestañas
  profile: "प्रोफ़ाइल",
  appearance: "दिखावट",
  network: "नेटवर्क",
  security: "सुरक्षा",
  advanced: "उन्नत",
  general: "सामान्य",
  automation: "स्वचालन",
  
  // Respaldo de claves de seguridad
  downloadBackup: "बैकअप डाउनलोड करें",
  neverShare: "इसे कभी भी किसी के साथ साझा न करें",

  // Sección de apariencia
  theme: "थीम",
  themeDescription: "अपने इंटरफ़ेस थीम को अनुकूलित करें",
  light: "हल्का",
  dark: "गहरा", 
  system: "सिस्टम",
  
  // Visualización de wallet
  walletDisplay: "वॉलेट डिस्प्ले",
  walletDisplayDescription: "आपका वॉलेट पता कैसे दिखाया जाता है",
  shortened: "छोटा किया गया (0x71C7...F1E2)",
  fullAddress: "पूरा पता",
  ensName: "ENS नाम (यदि उपलब्ध हो)",
  
  // Idioma
  language: "भाषा",
  languageDescription: "इंटरफ़ेस भाषा वरीयता",
  
  // Red
  networkSettings: "नेटवर्क सेटिंग्स",
  networkSettingsDescription: "अपना डिफ़ॉल्ट नेटवर्क कॉन्फ़िगर करें",
  defaultNetwork: "डिफ़ॉल्ट नेटवर्क",
  ethereum: "एथेरियम",
  polygon: "पॉलीगॉन",
  arbitrum: "आर्बिट्रम",
  optimism: "ऑप्टिमिज्म",
  rpcEndpoint: "RPC एंडपॉइंट",
  customRpcEndpoint: "कस्टम RPC एंडपॉइंट (उन्नत)",
  customRpcDisabled: "इस संस्करण में कस्टम RPC एंडपॉइंट अक्षम हैं",
  
  // Gas
  gasPreference: "गैस वरीयता",
  gasPreferenceDescription: "लेनदेन के लिए डिफ़ॉल्ट गति",
  standard: "मानक",
  fast: "तेज",
  rapid: "तेज",
  economy: "अर्थव्यवस्था",
  
  // Seguridad del wallet
  walletSecurity: "वॉलेट सुरक्षा",
  walletSecurityDescription: "वॉलेट सुरक्षा सेटिंग्स और पासवर्ड प्रबंधित करें",
  changePassword: "पासवर्ड बदलें",
  currentPassword: "वर्तमान पासवर्ड",
  enterCurrentPassword: "अपना वर्तमान पासवर्ड दर्ज करें",
  newPassword: "नया पासवर्ड",
  enterNewPassword: "अपना नया पासवर्ड दर्ज करें",
  confirmPassword: "पासवर्ड की पुष्टि करें",
  confirmNewPassword: "अपने नए पासवर्ड की पुष्टि करें",
  updatePassword: "पासवर्ड अपडेट करें",
  updating: "अपडेट कर रहा है...",
  
  // Protección de wallet
  walletProtection: "वॉलेट सुरक्षा",
  walletProtectionDescription: "आपका कस्टोडियल वेपूल बैंक-ग्रेड एन्क्रिप्शन से सुरक्षित है। अपना पासवर्ड सुरक्षित रखें और इसे कभी भी किसी के साथ साझा न करें।",
  passwordStrength: "पासवर्ड की शक्ति",
  passwordRequirements: "आपके पासवर्ड में बड़े अक्षर, छोटे अक्षर, संख्याएँ और विशेष वर्ण शामिल होने चाहिए।",
  
  // Cosecha automática
  autoHarvest: "ऑटो हार्वेस्ट",
  autoHarvestDescription: "स्वचालित रूप से पुरस्कार हार्वेस्ट करें",
  harvestPercentage: "हार्वेस्ट प्रतिशत",
  harvestPercentageDescription: "हार्वेस्ट करने के लिए पुरस्कारों का प्रतिशत",
  automationNote: "स्वचालन नोट",
  automationNoteDescription: "स्वचालन सुविधाओं के लिए एक कनेक्टेड वॉलेट की आवश्यकता होती है और इससे गैस शुल्क लग सकता है। सभी संचालन सीधे आपके वॉलेट से किए जाते हैं, MiCA नियमों के अनुपालन में आपके फंड की कस्टडी लिए बिना।",
  
  // Botones
  saveSettings: "सेटिंग्स सहेजें",
  resetSettings: "डिफ़ॉल्ट पर रीसेट करें",
  
  // Tarjetas y títulos
  settings: "सेटिंग्स",
  configurePreferences: "अपनी वेपूल वरीयताओं को कॉन्फ़िगर करें",
  accountSettings: "खाता सेटिंग्स",
  accountSettingsDescription: "अपनी खाता वरीयताओं को प्रबंधित करें",
  accountInfo: "खाता जानकारी",
  connectWallet: "वॉलेट कनेक्ट करें",
  connectWalletToAccess: "अपनी स्थिति तक पहुंचने के लिए वॉलेट कनेक्ट करें",
  connectYourWalletToView: "खाता जानकारी देखने के लिए अपना वॉलेट कनेक्ट करें",
  
  // Información de cuenta
  walletAddress: "वॉलेट पता",
  networkName: "नेटवर्क",
  connectedVia: "के माध्यम से जुड़ा",
  
  // MiCA Compliance
  micaCompliance: "MiCA अनुपालन",
  micaCompliant: "वेपूल क्रिप्टो-परिसंपत्तियों में बाजार (MiCA) विनियमन के पूर्ण अनुपालन में संचालित होता है।",
  noCustody: "उपयोगकर्ता फंड की कोई कस्टडी नहीं - सभी संचालन सीधे आपके वॉलेट से किए जाते हैं।",
  transparentFees: "कोई छिपी हुई फीस के साथ पारदर्शी शुल्क संरचना।",
  onChainTransactions: "पूरी पारदर्शिता और ऑडिटेबिलिटी के लिए सभी लेनदेन ऑन-चेन होते हैं।",
  
  // Sobre WayBank
  aboutWayBank: "वेपूल के बारे में",
  version: "संस्करण",
  lastUpdated: "अंतिम बार अपडेट किया गया",
  documentation: "दस्तावेज़",
  support: "समर्थन",
  
  // Notificaciones toast
  settingsSaved: "सेटिंग्स सहेजी गईं",
  settingsSavedDescription: "आपकी वरीयताएं सफलतापूर्वक अपडेट कर दी गई हैं।",
  errorSaving: "सहेजने में त्रुटि",
  errorSavingDescription: "सेटिंग्स सहेजी नहीं जा सकीं। कृपया बाद में पुनः प्रयास करें।",
  walletNotConnected: "वॉलेट कनेक्टेड नहीं है",
  walletNotConnectedDescription: "सेटिंग्स सहेजने के लिए अपना वॉलेट कनेक्ट करें।",
  passwordUpdated: "पासवर्ड अपडेट किया गया",
  passwordUpdatedDescription: "आपका पासवर्ड सफलतापूर्वक अपडेट कर दिया गया है।",
  passwordError: "पासवर्ड त्रुटि",
  currentPasswordRequired: "वर्तमान पासवर्ड आवश्यक है",
  currentPasswordRequiredDescription: "कृपया अपना वर्तमान पासवर्ड दर्ज करें।",
  newPasswordRequired: "नया पासवर्ड आवश्यक है",
  newPasswordRequiredDescription: "कृपया अपना नया पासवर्ड दर्ज करें।",
  weakPassword: "कमजोर पासवर्ड",
  weakPasswordDescription: "कृपया बड़े अक्षर, छोटे अक्षर, संख्याएँ और विशेष वर्णों के साथ एक मजबूत पासवर्ड का उपयोग करें।",
  passwordsNotMatch: "पासवर्ड मेल नहीं खाते",
  passwordsNotMatchDescription: "नया पासवर्ड और पुष्टि मेल खानी चाहिए।",
  
  // Fortaleza de contraseña
  noPassword: "कोई पासवर्ड नहीं",
  veryWeak: "बहुत कमजोर",
  weak: "कमजोर",
  moderate: "मध्यम",
  strong: "मजबूत",
  veryStrong: "बहुत मजबूत"
};
// Переводы на русский
const ru: SettingsTranslations = {
  // Вкладки
  profile: "Профиль",
  appearance: "Внешний вид",
  network: "Сеть",
  security: "Безопасность",
  advanced: "Расширенные",
  general: "Общие",
  automation: "Автоматизация",
  
  // Резервное копирование ключей безопасности
  downloadBackup: "Скачать резервную копию",
  neverShare: "Никогда не делитесь этим ни с кем",

  // Раздел внешнего вида
  theme: "Тема",
  themeDescription: "Настройте тему вашего интерфейса",
  light: "Светлая", 
  dark: "Темная",
  system: "Системная", // The "system" theme usually refers to matching the OS theme setting.
  
  // Отображение кошелька
  walletDisplay: "Отображение кошелька",
  walletDisplayDescription: "Как отображается адрес вашего кошелька",
  shortened: "Сокращенный (0x71C7...F1E2)",
  fullAddress: "Полный адрес",
  ensName: "Имя ENS (если доступно)",
  
  // Язык
  language: "Язык",
  languageDescription: "Предпочтительный язык интерфейса",
  
  // Сеть
  networkSettings: "Настройки сети",
  networkSettingsDescription: "Настройте вашу сеть по умолчанию",
  defaultNetwork: "Сеть по умолчанию",
  ethereum: "Ethereum",
  polygon: "Polygon",
  arbitrum: "Arbitrum",
  optimism: "Optimism",
  rpcEndpoint: "RPC-конечная точка",
  customRpcEndpoint: "Пользовательская RPC-конечная точка (расширенная)",
  customRpcDisabled: "Пользовательские RPC-конечные точки отключены в этой версии",
  
  // Газ
  gasPreference: "Предпочтения по газу",
  gasPreferenceDescription: "Скорость транзакций по умолчанию",
  standard: "Стандартная",
  fast: "Быстрая",
  rapid: "Молниеносная",
  economy: "Экономичная",
  
  // Безопасность кошелька
  walletSecurity: "Безопасность кошелька",
  walletSecurityDescription: "Управление настройками безопасности и паролями кошелька",
  changePassword: "Изменить пароль",
  currentPassword: "Текущий пароль",
  enterCurrentPassword: "Введите ваш текущий пароль",
  newPassword: "Новый пароль",
  enterNewPassword: "Введите ваш новый пароль",
  confirmPassword: "Подтвердить пароль",
  confirmNewPassword: "Подтвердите ваш новый пароль",
  updatePassword: "Обновить пароль",
  updating: "Обновление...",
  
  // Защита кошелька
  walletProtection: "Защита кошелька",
  walletProtectionDescription: "Ваш кастодиальный WayBank защищен шифрованием банковского уровня. Храните свой пароль в безопасности и никогда не делитесь им ни с кем.",
  passwordStrength: "Стойкость пароля",
  passwordRequirements: "Ваш пароль должен включать заглавные и строчные буквы, цифры и специальные символы.",
  
  // Автоматический сбор
  autoHarvest: "Автоматический сбор",
  autoHarvestDescription: "Автоматически собирать вознаграждения",
  harvestPercentage: "Процент сбора",
  harvestPercentageDescription: "Процент вознаграждений для сбора",
  automationNote: "Примечание по автоматизации",
  automationNoteDescription: "Функции автоматизации требуют подключенного кошелька и могут повлечь за собой комиссии за газ. Все операции выполняются непосредственно из вашего кошелька без получения доступа к вашим средствам, в соответствии с правилами MiCA.",
  
  // Кнопки
  saveSettings: "Сохранить настройки",
  resetSettings: "Сбросить до значений по умолчанию",
  
  // Карточки и заголовки
  settings: "Настройки",
  configurePreferences: "Настройте свои предпочтения WayBank",
  accountSettings: "Настройки аккаунта",
  accountSettingsDescription: "Управляйте настройками вашего аккаунта",
  accountInfo: "Информация об аккаунте",
  connectWallet: "Подключить кошелек",
  connectWalletToAccess: "Подключите кошелек для доступа к вашим позициям",
  connectYourWalletToView: "Подключите свой кошелек, чтобы просмотреть информацию об аккаунте",
  
  // Информация об аккаунте
  walletAddress: "Адрес кошелька",
  networkName: "Сеть",
  connectedVia: "Подключено через",
  
  // Соответствие MiCA
  micaCompliance: "Соответствие MiCA",
  micaCompliant: "WayBank полностью соответствует Регламенту о рынках криптоактивов (MiCA).",
  noCustody: "Отсутствие хранения средств пользователей – все операции выполняются непосредственно из вашего кошелька.",
  transparentFees: "Прозрачная структура комиссий без скрытых платежей.",
  onChainTransactions: "Все транзакции происходят в блокчейне для полной прозрачности и проверяемости.",
  
  // О WayBank
  aboutWayBank: "О WayBank",
  version: "Версия",
  lastUpdated: "Последнее обновление",
  documentation: "Документация",
  support: "Поддержка",
  
  // Уведомления toast
  settingsSaved: "Настройки сохранены",
  settingsSavedDescription: "Ваши предпочтения успешно обновлены.",
  errorSaving: "Ошибка сохранения",
  errorSavingDescription: "Не удалось сохранить настройки. Пожалуйста, попробуйте еще раз позже.",
  walletNotConnected: "Кошелек не подключен",
  walletNotConnectedDescription: "Подключите свой кошелек, чтобы сохранить настройки.",
  passwordUpdated: "Пароль обновлен",
  passwordUpdatedDescription: "Ваш пароль успешно обновлен.",
  passwordError: "Ошибка пароля",
  currentPasswordRequired: "Требуется текущий пароль",
  currentPasswordRequiredDescription: "Пожалуйста, введите ваш текущий пароль.",
  newPasswordRequired: "Требуется новый пароль",
  newPasswordRequiredDescription: "Пожалуйста, введите ваш новый пароль.",
  weakPassword: "Слабый пароль",
  weakPasswordDescription: "Пожалуйста, используйте более надежный пароль, включающий заглавные и строчные буквы, цифры и специальные символы.",
  passwordsNotMatch: "Пароли не совпадают",
  passwordsNotMatchDescription: "Новый пароль и подтверждение должны совпадать.",
  
  // Стойкость пароля
  noPassword: "Нет пароля",
  veryWeak: "Очень слабый",
  weak: "Слабый",
  moderate: "Умеренный",
  strong: "Сильный",
  veryStrong: "Очень сильный"
};
// Definición de traducciones por idioma
const translations = {
  en,
  es,
  pt,
  ar,
  fr,
  de,
  it,
  zh,
  hi,
  ru
};
// Exportación para el sistema centralizado
export const settingsTranslations = {
  es: {
    title: "Configuración",
    subtitle: "Personaliza tu experiencia",
    language: "Idioma",
    theme: "Tema",
    notifications: "Notificaciones"
  },
  en: {
    title: "Settings",
    subtitle: "Customize your experience",
    language: "Language",
    theme: "Theme",
    notifications: "Notifications"
  },
  fr: {
    title: "Paramètres",
    subtitle: "Personnalisez votre expérience",
    language: "Langue",
    theme: "Thème",
    notifications: "Notifications"
  },
  de: {
    title: "Einstellungen",
    subtitle: "Passen Sie Ihre Erfahrung an",
    language: "Sprache",
    theme: "Thema",
    notifications: "Benachrichtigungen"
  },
  it: {
    title: "Impostazioni",
    subtitle: "Personalizza la tua esperienza",
    language: "Lingua",
    theme: "Tema",
    notifications: "Notifiche"
  },
  pt: {
    title: "Configurações",
    subtitle: "Personalize sua experiência",
    language: "Idioma",
    theme: "Tema",
    notifications: "Notificações"
  },
  ar: {
    title: "الإعدادات",
    subtitle: "خصص تجربتك",
    language: "اللغة",
    theme: "السمة",
    notifications: "الإشعارات"
  },
  hi: {
    title: "सेटिंग्स",
    subtitle: "अपने अनुभव को अनुकूलित करें",
    language: "भाषा",
    theme: "थीम",
    notifications: "सूचनाएं"
  },
  zh: {
    title: "设置",
    subtitle: "自定义您的体验",
    language: "语言",
    theme: "主题",
    notifications: "通知"
  },
  ru: {
    title: "Настройки",
    subtitle: "Настройте свой опыт",
    language: "Язык",
    theme: "Тема",
    notifications: "Уведомления"
  }
};
export function useSettingsTranslations() {
  // Conseguir el idioma actual
  const { language } = useLanguage();
  
  // Crear y devolver el proxy de traducción
  return createTranslationProxy<SettingsTranslations>(
    translations as Record<Language, SettingsTranslations>,
    language as Language
  );
}