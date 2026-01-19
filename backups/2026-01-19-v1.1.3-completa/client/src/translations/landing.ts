import { Language } from "@/context/language-context";
import { APP_NAME } from "@/utils/app-config";

// Interfaz para las traducciones del landing
// Traducciones para la página de términos de uso
export interface TermsOfUseTranslations {
  termsOfUseTitle: string;
  lastUpdated: string;
  contentIndex: string;
  
  // Títulos de secciones
  section1Title: string;
  section2Title: string;
  section3Title: string;
  section4Title: string;
  section5Title: string;
  section6Title: string;
  section7Title: string;
  section8Title: string;
  section9Title: string;
  section10Title: string;
  
  // Contenido de secciones
  introText: string;
  acceptanceText: string;
  natureText: string;
  usageText: string;
  usageListTitle: string;
  usageListItems: string[];
  risksText: string;
  risksListTitle: string;
  risksListItems: string[];
  intellectualText: string;
  liabilityText: string;
  modificationsText: string;
  lawText: string;
  generalText: string;
  contactText: string;
}

// Traducciones para la página de política de privacidad
export interface PrivacyPolicyTranslations {
  privacyPolicyTitle: string;
  lastUpdated: string;
  contentIndex: string;
  
  // Títulos de secciones
  section1Title: string;
  section2Title: string;
  section3Title: string;
  section4Title: string;
  section5Title: string;
  section6Title: string;
  section7Title: string;
  section8Title: string;
  section9Title: string;
  section10Title: string;
  section11Title: string;
  
  // Contenido de secciones
  introText: string;
  
  information1Title: string;
  information1Text: string;
  information2Title: string;
  information2Text: string;
  information2List: string[];
  information3Title: string;
  information3Text: string;
  
  usageText: string;
  usageList: string[];
  
  sharing1Title: string;
  sharing1Text: string;
  sharing2Title: string;
  sharing2Text: string;
  sharing2List: string[];
  sharing3Title: string;
  sharing3Text: string;
  
  security1Text: string;
  security2Title: string;
  security2Text: string;
  
  rightsText: string;
  rightsList: string[];
  rightsActionText: string;
  
  transfersText: string;
  
  retentionText: string;
  
  changesText: string;
  
  contactText: string;
  contactAddress: string;
  
  lawText: string;
}

// Traducciones para la página de disclaimer
export interface DisclaimerTranslations {
  disclaimerTitle: string;
  lastUpdated: string;
  contentIndex: string;
  
  // Títulos de secciones
  section1Title: string;
  section2Title: string;
  section3Title: string;
  section4Title: string;
  section5Title: string;
  section6Title: string;
  section7Title: string;
  section8Title: string;
  section9Title: string;
  section10Title: string;
  section11Title: string;

  // Contenido de secciones
  section1_1Title: string;
  section1_1Content: string;
  section1_2Title: string;
  section1_2Content: string;

  section2_1Title: string;
  section2_1Content: string;
  section2_2Title: string;
  section2_2Content: string;

  section3_1Title: string;
  section3_1Content: string;
  section3_2Title: string;
  section3_2Content: string;
  section3_3Title: string;
  section3_3Content: string;

  section4_1Title: string;
  section4_1Content: string;
  section4_2Title: string;
  section4_2Content: string;

  section5_1Title: string;
  section5_1Content: string;
  section5_2Title: string;
  section5_2Content: string;
  section5_3Title: string;
  section5_3Content: string;
  section5_4Title: string;
  section5_4Content: string;

  section6_1Title: string;
  section6_1Content: string;
  section6_2Title: string;
  section6_2Content: string;

  section7_1Title: string;
  section7_1Content: string;
  section7_2Title: string;
  section7_2Content: string;

  section8_1Title: string;
  section8_1Content: string;
  section8_2Title: string;
  section8_2Content: string;

  section9Content: string;

  section10Content: string;

  section11Content: string;
  section11Address: string;
}

interface LandingTranslations {
  // Header/Nav
  howItWorks: string;
  algorithm: string;
  features: string;
  riskReturn: string;
  referrals: string;
  faq: string;
  accessDashboard: string;
  learnMore: string;
  
  // Hero section
  heroTitle: string;
  heroSubtitle: string;
  getStarted: string;
  
  // Liquidity Pools section
  liquidityPoolsTitle: string;
  liquidityPoolsDescription: string;
  viewAllPools: string;
  totalValueLocked: string;
  
  // Rewards Simulator section
  rewardsSimulatorTitle: string;
  rewardsSimulatorSubtitle: string;
  
  // Feature cards
  minimizeRisks: string;
  minimizeRisksDesc: string;
  maximizeYields: string;
  maximizeYieldsDesc: string;
  fullControl: string;
  fullControlDesc: string;
  
  // How it works section
  howItWorksTitle: string;
  howItWorksSubtitle: string;
  viewFullDocumentation: string;
  step1Title: string;
  step1Desc: string;
  step2Title: string;
  step2Desc: string;
  step3Title: string;
  step3Desc: string;
  
  // Features section
  featuresTitle: string;
  featuresSubtitle: string;
  feature1Title: string;
  feature1Desc: string;
  feature2Title: string;
  feature2Desc: string;
  feature3Title: string;
  feature3Desc: string;
  feature4Title: string;
  feature4Desc: string;
  
  // Risk/Return section
  riskReturnTitle: string;
  riskReturnSubtitle: string;
  conservativeTitle: string;
  conservativeDesc: string;
  conservativeItem1: string;
  conservativeItem2: string;
  conservativeItem3: string;
  moderateTitle: string;
  moderateDesc: string;
  moderateItem1: string;
  moderateItem2: string;
  moderateItem3: string;
  aggressiveTitle: string;
  aggressiveDesc: string;
  aggressiveItem1: string;
  aggressiveItem2: string;
  aggressiveItem3: string;
  selectBtn: string;
  popular: string;
  
  // Risk Calculator Section
  riskCalculatorTitle: string;
  riskCalculatorSubtitle: string;
  conservativeProfile: string;
  moderateProfile: string;
  aggressiveProfile: string;
  worstCaseScenario: string;
  bestCaseScenario: string;
  worstCaseDescription: string;
  bestCaseDescription: string;
  riskDisclaimerTitle: string;
  riskDisclaimerText: string;
  
  // Referral section
  referralTitle: string;
  referralSubtitle: string;
  referralCardTitle1: string; 
  referralCardDesc1: string;
  referralCardTitle2: string;
  referralCardDesc2: string;
  referralCardTitle3: string;
  referralCardDesc3: string;
  referralCtaButton: string;
  referralCtaSecondary: string;
  referralHighlight: string;
  referralHighlightText: string;
  
  // FAQ section
  faqTitle: string;
  faqSubtitle: string;
  faqQuestion1: string;
  faqAnswer1: string;
  faqQuestion2: string;
  faqAnswer2: string;
  faqQuestion3: string;
  faqAnswer3: string;
  faqQuestion4: string;
  faqAnswer4: string;
  
  // CTA section
  ctaTitle: string;
  ctaSubtitle: string;
  
  // Footer
  footerTagline: string;
  platform: string;
  dashboard: string;
  positions: string;
  analytics: string;
  resources: string;
  documentation: string;
  support: string;
  community: string;
  legal: string;
  termsOfUse: string;
  privacyPolicy: string;
  disclaimer: string;
  lastUpdated: string;
  copyright: string;
}

// Traducciones para la página de política de privacidad
// Traducciones para términos de uso
export const termsOfUseTranslations: Record<Language, TermsOfUseTranslations> = {
  // Español
  es: {
    termsOfUseTitle: "Términos de Uso",
    lastUpdated: "Última actualización: 2 de abril de 2021",
    contentIndex: "Contenido",
    
    // Títulos de secciones
    section1Title: "1. Aceptación de los Términos",
    section2Title: "2. Naturaleza de la Plataforma",
    section3Title: "3. Uso de la Plataforma",
    section4Title: "4. Riesgos y Responsabilidades",
    section5Title: "5. Propiedad Intelectual",
    section6Title: "6. Limitación de Responsabilidad",
    section7Title: "7. Modificaciones",
    section8Title: "8. Ley Aplicable y Resolución de Disputas",
    section9Title: "9. Disposiciones Generales",
    section10Title: "10. Contacto",
    
    // Contenido de secciones
    introText: `Bienvenido a ${APP_NAME}. Estos Términos de Uso constituyen un acuerdo legalmente vinculante entre usted y Elysium Media FZCO, que opera la plataforma descentralizada ${APP_NAME}. Al acceder o utilizar nuestra plataforma, usted acepta quedar vinculado por estos términos. Si no está de acuerdo con estos términos, por favor, absténgase de utilizar nuestra plataforma.`,
    acceptanceText: `Bienvenido a ${APP_NAME}. Estos Términos de Uso constituyen un acuerdo legalmente vinculante entre usted y Elysium Media FZCO, que opera la plataforma descentralizada ${APP_NAME}. Al acceder o utilizar nuestra plataforma, usted acepta quedar vinculado por estos términos. Si no está de acuerdo con estos términos, por favor, absténgase de utilizar nuestra plataforma.`,
    natureText: `${APP_NAME} es una plataforma descentralizada que opera directamente vía API con Uniswap. La plataforma se conecta única y exclusivamente con wallets y permite realizar operaciones en pools de liquidez concentrada. Nuestro algoritmo balancea entre diferentes pools para maximizar los rendimientos para los usuarios.`,
    usageText: `Para utilizar ${APP_NAME}, debe tener al menos 18 años y la capacidad legal para aceptar estos términos en su jurisdicción. El uso de la plataforma requiere una wallet compatible con Ethereum. Usted es responsable de la seguridad de su wallet, incluyendo sus claves privadas y frases de recuperación.`,
    usageListTitle: "Actividades Prohibidas: Usted se compromete a no utilizar la plataforma para:",
    usageListItems: [
      "Actividades ilegales o fraudulentas",
      "Violar estos términos o cualquier ley aplicable",
      "Infringir los derechos de propiedad intelectual u otros derechos de terceros",
      "Intentar manipular o interferir con el funcionamiento de la plataforma",
      "Realizar operaciones que puedan considerarse como manipulación del mercado"
    ],
    risksText: `El uso de criptomonedas y la participación en mercados descentralizados implica riesgos significativos. ${APP_NAME} es una plataforma no custodial. No almacenamos ni tenemos acceso a sus claves privadas, fondos o activos digitales. Usted mantiene pleno control y responsabilidad sobre sus activos en todo momento.`,
    risksListTitle: "Riesgos Asociados: El uso de criptomonedas y la participación en mercados descentralizados implica riesgos significativos. Estos incluyen, entre otros:",
    risksListItems: [
      "Volatilidad del precio de los activos digitales",
      "Pérdidas impermanentes en posiciones de liquidez",
      "Riesgos técnicos relacionados con contratos inteligentes",
      "Cambios regulatorios que podrían afectar la operación de la plataforma"
    ],
    intellectualText: "Todos los derechos de propiedad intelectual relacionados con la plataforma, incluyendo software, diseño, logotipos, marcas y contenido, son propiedad de Elysium Media FZCO o sus licenciantes. Se le otorga una licencia limitada, no exclusiva y no transferible para acceder y utilizar la plataforma de acuerdo con estos términos.",
    liabilityText: "La plataforma se proporciona 'tal cual' y 'según disponibilidad', sin garantías de ningún tipo, ya sean expresas o implícitas. En la máxima medida permitida por la ley aplicable, Elysium Media FZCO y sus afiliados no serán responsables por daños directos, indirectos, incidentales, especiales, consecuentes o punitivos, incluyendo, pero no limitado a, pérdida de beneficios, datos, uso, fondo de comercio u otras pérdidas intangibles.",
    modificationsText: "Nos reservamos el derecho de modificar estos Términos de Uso en cualquier momento. Las modificaciones entrarán en vigor inmediatamente después de su publicación en la plataforma. Su uso continuado de la plataforma después de tales modificaciones constituirá su aceptación de los términos modificados.",
    lawText: "Estos términos se regirán e interpretarán de acuerdo con las leyes de Dubai, Emiratos Árabes Unidos, sin tener en cuenta los principios de conflicto de leyes. Cualquier disputa que surja de o en relación con estos términos se resolverá exclusivamente mediante arbitraje en Dubai, de acuerdo con las reglas del Centro de Arbitraje Internacional de Dubai (DIAC).",
    generalText: "Estos términos constituyen el acuerdo completo entre usted y Elysium Media FZCO con respecto al uso de la plataforma. Si alguna disposición de estos términos se considera inválida o inaplicable, dicha disposición se interpretará y limitará en la medida necesaria para hacerla válida y aplicable, o se eliminará si tal interpretación no es posible, y las disposiciones restantes continuarán en pleno vigor y efecto.",
    contactText: "Si tiene preguntas o comentarios sobre estos Términos de Uso, contáctenos en: Elysium Media FZCO, ID: 58510, Premises no. 58510 - 001, IFZA Business Park, DDP, DUBAI, United Arab Emirates."
  },
  
  // English
  en: {
    termsOfUseTitle: "Terms of Use",
    lastUpdated: "Last updated: April 2, 2021",
    contentIndex: "Contents",
    
    // Section titles
    section1Title: "1. Acceptance of Terms",
    section2Title: "2. Nature of the Platform",
    section3Title: "3. Platform Usage",
    section4Title: "4. Risks and Responsibilities",
    section5Title: "5. Intellectual Property",
    section6Title: "6. Limitation of Liability",
    section7Title: "7. Modifications",
    section8Title: "8. Applicable Law and Dispute Resolution",
    section9Title: "9. General Provisions",
    section10Title: "10. Contact",
    
    // Section content
    introText: `Welcome to ${APP_NAME}. These Terms of Use constitute a legally binding agreement between you and Elysium Media FZCO, which operates the ${APP_NAME} decentralized platform. By accessing or using our platform, you agree to be bound by these terms. If you do not agree with these terms, please refrain from using our platform.`,
    acceptanceText: `Welcome to ${APP_NAME}. These Terms of Use constitute a legally binding agreement between you and Elysium Media FZCO, which operates the ${APP_NAME} decentralized platform. By accessing or using our platform, you agree to be bound by these terms. If you do not agree with these terms, please refrain from using our platform.`,
    natureText: `${APP_NAME} is a decentralized platform that operates directly via API with Uniswap. The platform connects exclusively with wallets and allows operations in concentrated liquidity pools. Our algorithm balances between different pools to maximize returns for users.`,
    usageText: `To use ${APP_NAME}, you must be at least 18 years old and have the legal capacity to accept these terms in your jurisdiction. Using the platform requires a wallet compatible with Ethereum. You are responsible for the security of your wallet, including your private keys and recovery phrases.`,
    usageListTitle: "Prohibited Activities: You agree not to use the platform for:",
    usageListItems: [
      "Illegal or fraudulent activities",
      "Violating these terms or any applicable law",
      "Infringing the intellectual property or other rights of third parties",
      "Attempting to manipulate or interfere with the operation of the platform",
      "Conducting operations that may be considered market manipulation"
    ],
    risksText: `Using cryptocurrencies and participating in decentralized markets involves significant risks. ${APP_NAME} is a non-custodial platform. We do not store or have access to your private keys, funds, or digital assets. You maintain full control and responsibility over your assets at all times.`,
    risksListTitle: "Associated Risks: Using cryptocurrencies and participating in decentralized markets involves significant risks. These include, but are not limited to:",
    risksListItems: [
      "Volatility of digital asset prices",
      "Impermanent losses in liquidity positions",
      "Technical risks related to smart contracts",
      "Regulatory changes that could affect the operation of the platform"
    ],
    intellectualText: "All intellectual property rights related to the platform, including software, design, logos, trademarks, and content, are the property of Elysium Media FZCO or its licensors. You are granted a limited, non-exclusive, and non-transferable license to access and use the platform in accordance with these terms.",
    liabilityText: "The platform is provided 'as is' and 'as available', without warranties of any kind, whether express or implied. To the maximum extent permitted by applicable law, Elysium Media FZCO and its affiliates will not be liable for direct, indirect, incidental, special, consequential, or punitive damages, including, but not limited to, loss of profits, data, use, goodwill, or other intangible losses.",
    modificationsText: "We reserve the right to modify these Terms of Use at any time. The modifications will take effect immediately after their publication on the platform. Your continued use of the platform after such modifications will constitute your acceptance of the modified terms.",
    lawText: "These terms will be governed and interpreted in accordance with the laws of Dubai, United Arab Emirates, without regard to principles of conflict of laws. Any dispute arising from or relating to these terms will be resolved exclusively through arbitration in Dubai, in accordance with the rules of the Dubai International Arbitration Centre (DIAC).",
    generalText: "These terms constitute the complete agreement between you and Elysium Media FZCO regarding the use of the platform. If any provision of these terms is deemed invalid or unenforceable, such provision will be interpreted and limited to the extent necessary to make it valid and enforceable, or will be eliminated if such interpretation is not possible, and the remaining provisions will continue in full force and effect.",
    contactText: "If you have questions or comments about these Terms of Use, contact us at: Elysium Media FZCO, ID: 58510, Premises no. 58510 - 001, IFZA Business Park, DDP, DUBAI, United Arab Emirates."
  },
  // Russian
  ru: {
    termsOfUseTitle: "Условия использования",
    lastUpdated: "Последнее обновление: 2 апреля 2021 г.",
    contentIndex: "Содержание",
    
    // Section titles
    section1Title: "1. Принятие Условий",
    section2Title: "2. Характер Платформы",
    section3Title: "3. Использование Платформы",
    section4Title: "4. Риски и Ответственность",
    section5Title: "5. Интеллектуальная Собственность",
    section6Title: "6. Ограничение Ответственности",
    section7Title: "7. Модификации",
    section8Title: "8. Применимое Законодательство и Разрешение Споров",
    section9Title: "9. Общие Положения",
    section10Title: "10. Контакты",
    
    // Section content
    introText: `Добро пожаловать в ${APP_NAME}. Настоящие Условия использования представляют собой юридически обязывающее соглашение между вами и Elysium Media FZCO, которая управляет децентрализованной платформой ${APP_NAME}. Получая доступ к нашей платформе или используя ее, вы соглашаетесь соблюдать настоящие условия. Если вы не согласны с настоящими условиями, пожалуйста, воздержитесь от использования нашей платформы.`,
    acceptanceText: `Добро пожаловать в ${APP_NAME}. Настоящие Условия использования представляют собой юридически обязывающее соглашение между вами и Elysium Media FZCO, которая управляет децентрализованной платформой ${APP_NAME}. Получая доступ к нашей платформе или используя ее, вы соглашаетесь соблюдать настоящие условия. Если вы не согласны с настоящими условиями, пожалуйста, воздержитесь от использования нашей платформы.`,
    natureText: `${APP_NAME} — это децентрализованная платформа, которая работает напрямую через API с Uniswap. Платформа подключается исключительно к кошелькам и позволяет осуществлять операции в пулах концентрированной ликвидности. Наш алгоритм балансирует между различными пулами для максимизации доходности для пользователей.`,
    usageText: `Для использования ${APP_NAME} вам должно быть не менее 18 лет, и вы должны обладать законной способностью принимать настоящие условия в вашей юрисдикции. Для использования платформы требуется кошелек, совместимый с Ethereum. Вы несете ответственность за безопасность вашего кошелька, включая ваши приватные ключи и фразы восстановления.`,
    usageListTitle: "Запрещенные действия: Вы соглашаетесь не использовать платформу для:",
    usageListItems: [
      "Незаконная или мошенническая деятельность",
      "Нарушение настоящих условий или любого применимого законодательства",
      "Нарушение интеллектуальной собственности или других прав третьих лиц",
      "Попытки манипулировать или вмешиваться в работу платформы",
      "Проведение операций, которые могут быть расценены как манипулирование рынком"
    ],
    risksText: `Использование криптовалют и участие в децентрализованных рынках сопряжено со значительными рисками. ${APP_NAME} — это некастодиальная платформа. Мы не храним и не имеем доступа к вашим приватным ключам, средствам или цифровым активам. Вы сохраняете полный контроль и ответственность за свои активы в любое время.`,
    risksListTitle: "Связанные риски: Использование криптовалют и участие в децентрализованных рынках сопряжено со значительными рисками. К ним относятся, помимо прочего:",
    risksListItems: [
      "Волатильность цен цифровых активов",
      "Непостоянные потери по позициям ликвидности",
      "Технические риски, связанные со смарт-контрактами",
      "Регуляторные изменения, которые могут повлиять на работу платформы"
    ],
    intellectualText: "Все права интеллектуальной собственности, связанные с платформой, включая программное обеспечение, дизайн, логотипы, товарные знаки и контент, являются собственностью Elysium Media FZCO или ее лицензиаров. Вам предоставляется ограниченная, неисключительная и непередаваемая лицензия на доступ и использование платформы в соответствии с настоящими условиями.",
    liabilityText: "Платформа предоставляется «как есть» и «как доступно», без каких-либо гарантий, явных или подразумеваемых. В максимально допустимой степени, разрешенной применимым законодательством, Elysium Media FZCO и ее аффилированные лица не несут ответственности за прямые, косвенные, случайные, специальные, косвенные или штрафные убытки, включая, помимо прочего, потерю прибыли, данных, использования, деловой репутации или другие нематериальные потери.",
    modificationsText: "Мы оставляем за собой право изменять настоящие Условия использования в любое время. Изменения вступают в силу немедленно после их публикации на платформе. Ваше дальнейшее использование платформы после таких изменений будет означать ваше согласие с измененными условиями.",
    lawText: "Настоящие условия будут регулироваться и толковаться в соответствии с законодательством Дубая, Объединенные Арабские Эмираты, без учета принципов коллизионного права. Любой спор, возникающий из настоящих условий или связанный с ними, будет разрешаться исключительно посредством арбитража в Дубае в соответствии с правилами Дубайского международного арбитражного центра (DIAC).",
    generalText: "Настоящие условия представляют собой полное соглашение между вами и Elysium Media FZCO относительно использования платформы. Если какое-либо положение настоящих условий будет признано недействительным или не имеющим исковой силы, такое положение будет толковаться и ограничиваться в той степени, в которой это необходимо для придания ему юридической силы, или будет исключено, если такая интерпретация невозможна, а остальные положения останутся в полной силе и действии.",
    contactText: "Если у вас есть вопросы или комментарии относительно настоящих Условий использования, свяжитесь с нами по адресу: Elysium Media FZCO, ID: 58510, Premises no. 58510 - 001, IFZA Business Park, DDP, DUBAI, United Arab Emirates."
  },  
  // Árabe
  ar: {
    termsOfUseTitle: "شروط الاستخدام",
    lastUpdated: "آخر تحديث: 2 أبريل 2021",
    contentIndex: "المحتويات",
    
    // عناوين الأقسام
    section1Title: "1. قبول الشروط",
    section2Title: "2. طبيعة المنصة",
    section3Title: "3. استخدام المنصة",
    section4Title: "4. المخاطر والمسؤوليات",
    section5Title: "5. الملكية الفكرية",
    section6Title: "6. حدود المسؤولية",
    section7Title: "7. التعديلات",
    section8Title: "8. القانون المطبق وحل النزاعات",
    section9Title: "9. أحكام عامة",
    section10Title: "10. التواصل",
    
    // محتوى الأقسام
    introText: "مرحبًا بك في WayBank. تشكل شروط الاستخدام هذه اتفاقية ملزمة قانونًا بينك وبين Elysium Media FZCO، التي تدير منصة WayBank اللامركزية. من خلال الوصول إلى منصتنا أو استخدامها، فإنك توافق على الالتزام بهذه الشروط. إذا لم توافق على هذه الشروط، يرجى الامتناع عن استخدام منصتنا.",
    acceptanceText: "مرحبًا بك في WayBank. تشكل شروط الاستخدام هذه اتفاقية ملزمة قانونًا بينك وبين Elysium Media FZCO، التي تدير منصة WayBank اللامركزية. من خلال الوصول إلى منصتنا أو استخدامها، فإنك توافق على الالتزام بهذه الشروط. إذا لم توافق على هذه الشروط، يرجى الامتناع عن استخدام منصتنا.",
    natureText: "WayBank هي منصة لامركزية تعمل مباشرة عبر واجهة برمجة التطبيقات مع Uniswap. تتصل المنصة حصريًا بالمحافظ وتسمح بالعمليات في تجمعات السيولة المركزة. يوازن خوارزميتنا بين مجمعات مختلفة لتعظيم العوائد للمستخدمين.",
    usageText: "لاستخدام WayBank، يجب أن يكون عمرك 18 عامًا على الأقل وأن تتمتع بالقدرة القانونية على قبول هذه الشروط في نطاق اختصاصك. يتطلب استخدام المنصة محفظة متوافقة مع Ethereum. أنت مسؤول عن أمان محفظتك، بما في ذلك مفاتيحك الخاصة وعبارات الاسترداد.",
    usageListTitle: "الأنشطة المحظورة: أنت توافق على عدم استخدام المنصة لـ:",
    usageListItems: [
      "الأنشطة غير القانونية أو الاحتيالية",
      "انتهاك هذه الشروط أو أي قانون معمول به",
      "انتهاك حقوق الملكية الفكرية أو غيرها من حقوق الطرف الثالث",
      "محاولة التلاعب أو التدخل في تشغيل المنصة",
      "إجراء عمليات قد تعتبر تلاعبًا في السوق"
    ],
    risksText: "ينطوي استخدام العملات المشفرة والمشاركة في الأسواق اللامركزية على مخاطر كبيرة. WayBank هي منصة غير وصائية. نحن لا نخزن أو نصل إلى مفاتيحك الخاصة أو أموالك أو أصولك الرقمية. أنت تحتفظ بالسيطرة الكاملة والمسؤولية عن أصولك في جميع الأوقات.",
    risksListTitle: "المخاطر المرتبطة: ينطوي استخدام العملات المشفرة والمشاركة في الأسواق اللامركزية على مخاطر كبيرة. تشمل هذه، على سبيل المثال لا الحصر:",
    risksListItems: [
      "تقلب أسعار الأصول الرقمية",
      "خسائر غير دائمة في مراكز السيولة",
      "المخاطر التقنية المتعلقة بالعقود الذكية",
      "التغييرات التنظيمية التي قد تؤثر على تشغيل المنصة"
    ],
    intellectualText: "جميع حقوق الملكية الفكرية المتعلقة بالمنصة، بما في ذلك البرامج والتصميم والشعارات والعلامات التجارية والمحتوى، هي ملك لشركة Elysium Media FZCO أو المرخصين لها. يتم منحك ترخيصًا محدودًا وغير حصري وغير قابل للتحويل للوصول إلى المنصة واستخدامها وفقًا لهذه الشروط.",
    liabilityText: "يتم توفير المنصة 'كما هي' و'حسب التوافر'، دون أي ضمانات من أي نوع، سواء كانت صريحة أو ضمنية. إلى أقصى حد يسمح به القانون المعمول به، لن تكون Elysium Media FZCO والشركات التابعة لها مسؤولة عن الأضرار المباشرة أو غير المباشرة أو العرضية أو الخاصة أو التبعية أو العقابية، بما في ذلك، على سبيل المثال لا الحصر، فقدان الأرباح أو البيانات أو الاستخدام أو الشهرة أو غيرها من الخسائر غير الملموسة.",
    modificationsText: "نحتفظ بالحق في تعديل شروط الاستخدام هذه في أي وقت. ستدخل التعديلات حيز التنفيذ فورًا بعد نشرها على المنصة. سيشكل استمرار استخدامك للمنصة بعد هذه التعديلات قبولك للشروط المعدلة.",
    lawText: "ستخضع هذه الشروط وتفسر وفقًا لقوانين دبي، الإمارات العربية المتحدة، دون النظر إلى مبادئ تضارب القوانين. سيتم حل أي نزاع ينشأ عن أو يتعلق بهذه الشروط حصريًا من خلال التحكيم في دبي، وفقًا لقواعد مركز دبي للتحكيم الدولي (DIAC).",
    generalText: "تشكل هذه الشروط الاتفاقية الكاملة بينك وبين Elysium Media FZCO فيما يتعلق باستخدام المنصة. إذا اعتبر أي حكم من أحكام هذه الشروط غير صالح أو غير قابل للتنفيذ، فسيتم تفسير هذا الحكم وتحديده بالقدر اللازم لجعله صالحًا وقابلاً للتنفيذ، أو سيتم حذفه إذا كان هذا التفسير غير ممكن، وستظل الأحكام المتبقية سارية المفعول.",
    contactText: "إذا كانت لديك أسئلة أو تعليقات حول شروط الاستخدام هذه، فاتصل بنا على: Elysium Media FZCO، المعرف: 58510، المباني رقم 58510 - 001، حديقة أعمال IFZA، DDP، دبي، الإمارات العربية المتحدة."
  },
  
  // Portugués
  pt: {
    termsOfUseTitle: "Termos de Uso",
    lastUpdated: "Última atualização: 2 de abril de 2021",
    contentIndex: "Conteúdo",
    
    // Títulos das seções
    section1Title: "1. Aceitação dos Termos",
    section2Title: "2. Natureza da Plataforma",
    section3Title: "3. Uso da Plataforma",
    section4Title: "4. Riscos e Responsabilidades",
    section5Title: "5. Propriedade Intelectual",
    section6Title: "6. Limitação de Responsabilidade",
    section7Title: "7. Modificações",
    section8Title: "8. Lei Aplicável e Resolução de Disputas",
    section9Title: "9. Disposições Gerais",
    section10Title: "10. Contato",
    
    // Conteúdo das seções
    introText: `Bem-vindo ao ${APP_NAME}. Estes Termos de Uso constituem um acordo legalmente vinculativo entre você e a Elysium Media FZCO, que opera a plataforma descentralizada ${APP_NAME}. Ao acessar ou usar nossa plataforma, você concorda em estar vinculado a estes termos. Se você não concordar com estes termos, por favor, abstenha-se de usar nossa plataforma.`,
    acceptanceText: `Bem-vindo ao ${APP_NAME}. Estes Termos de Uso constituem um acordo legalmente vinculativo entre você e a Elysium Media FZCO, que opera a plataforma descentralizada ${APP_NAME}. Ao acessar ou usar nossa plataforma, você concorda em estar vinculado a estes termos. Se você não concordar com estes termos, por favor, abstenha-se de usar nossa plataforma.`,
    natureText: `${APP_NAME} é uma plataforma descentralizada que opera diretamente via API com Uniswap. A plataforma conecta-se exclusivamente com carteiras e permite operações em pools de liquidez concentrada. Nosso algoritmo equilibra entre diferentes pools para maximizar os retornos para os usuários.`,
    usageText: `Para usar o ${APP_NAME}, você deve ter pelo menos 18 anos e a capacidade legal para aceitar estes termos em sua jurisdição. O uso da plataforma requer uma carteira compatível com Ethereum. Você é responsável pela segurança de sua carteira, incluindo suas chaves privadas e frases de recuperação.`,
    usageListTitle: "Atividades Proibidas: Você concorda em não usar a plataforma para:",
    usageListItems: [
      "Atividades ilegais ou fraudulentas",
      "Violar estes termos ou qualquer lei aplicável",
      "Infringir a propriedade intelectual ou outros direitos de terceiros",
      "Tentar manipular ou interferir com a operação da plataforma",
      "Realizar operações que possam ser consideradas manipulação de mercado"
    ],
    risksText: `O uso de criptomoedas e a participação em mercados descentralizados envolvem riscos significativos. ${APP_NAME} é uma plataforma não custodial. Não armazenamos ou temos acesso às suas chaves privadas, fundos ou ativos digitais. Você mantém controle total e responsabilidade sobre seus ativos em todos os momentos.`,
    risksListTitle: "Riscos Associados: O uso de criptomoedas e a participação em mercados descentralizados envolvem riscos significativos. Estes incluem, mas não se limitam a:",
    risksListItems: [
      "Volatilidade dos preços de ativos digitais",
      "Perdas impermanentes em posições de liquidez",
      "Riscos técnicos relacionados a contratos inteligentes",
      "Mudanças regulatórias que poderiam afetar a operação da plataforma"
    ],
    intellectualText: "Todos os direitos de propriedade intelectual relacionados à plataforma, incluindo software, design, logotipos, marcas registradas e conteúdo, são propriedade da Elysium Media FZCO ou seus licenciadores. É concedida a você uma licença limitada, não exclusiva e não transferível para acessar e usar a plataforma de acordo com estes termos.",
    liabilityText: "A plataforma é fornecida 'como está' e 'conforme disponível', sem garantias de qualquer tipo, sejam expressas ou implícitas. Na máxima extensão permitida pela lei aplicável, a Elysium Media FZCO e suas afiliadas não serão responsáveis por danos diretos, indiretos, incidentais, especiais, consequenciais ou punitivos, incluindo, mas não se limitando a, perda de lucros, dados, uso, boa vontade ou outras perdas intangíveis.",
    modificationsText: "Reservamo-nos o direito de modificar estes Termos de Uso a qualquer momento. As modificações entrarão em vigor imediatamente após sua publicação na plataforma. Seu uso contínuo da plataforma após tais modificações constituirá sua aceitação dos termos modificados.",
    lawText: "Estes termos serão regidos e interpretados de acordo com as leis de Dubai, Emirados Árabes Unidos, sem considerar princípios de conflito de leis. Qualquer disputa decorrente de ou relacionada a estes termos será resolvida exclusivamente por meio de arbitragem em Dubai, de acordo com as regras do Centro de Arbitragem Internacional de Dubai (DIAC).",
    generalText: "Estes termos constituem o acordo completo entre você e a Elysium Media FZCO em relação ao uso da plataforma. Se qualquer disposição destes termos for considerada inválida ou inexequível, tal disposição será interpretada e limitada na medida necessária para torná-la válida e exequível, ou será eliminada se tal interpretação não for possível, e as disposições remanescentes continuarão em pleno vigor e efeito.",
    contactText: "Se você tiver dúvidas ou comentários sobre estes Termos de Uso, entre em contato conosco em: Elysium Media FZCO, ID: 58510, Premises no. 58510 - 001, IFZA Business Park, DDP, DUBAI, United Arab Emirates."
  },
  
  // Italiano
  it: {
    termsOfUseTitle: "Termini di Utilizzo",
    lastUpdated: "Ultimo aggiornamento: 2 aprile 2021",
    contentIndex: "Contenuti",
    
    // Titoli delle sezioni
    section1Title: "1. Accettazione dei Termini",
    section2Title: "2. Natura della Piattaforma",
    section3Title: "3. Utilizzo della Piattaforma",
    section4Title: "4. Rischi e Responsabilità",
    section5Title: "5. Proprietà Intellettuale",
    section6Title: "6. Limitazione di Responsabilità",
    section7Title: "7. Modifiche",
    section8Title: "8. Legge Applicabile e Risoluzione delle Controversie",
    section9Title: "9. Disposizioni Generali",
    section10Title: "10. Contatto",
    
    // Contenuto delle sezioni
    introText: `Benvenuto su ${APP_NAME}. Questi Termini di Utilizzo costituiscono un accordo legalmente vincolante tra te ed Elysium Media FZCO, che gestisce la piattaforma decentralizzata ${APP_NAME}. Accedendo o utilizzando la nostra piattaforma, accetti di essere vincolato da questi termini. Se non sei d'accordo con questi termini, ti preghiamo di astenerti dall'utilizzare la nostra piattaforma.`,
    acceptanceText: `Benvenuto su ${APP_NAME}. Questi Termini di Utilizzo costituiscono un accordo legalmente vincolante tra te ed Elysium Media FZCO, che gestisce la piattaforma decentralizzata ${APP_NAME}. Accedendo o utilizzando la nostra piattaforma, accetti di essere vincolato da questi termini. Se non sei d'accordo con questi termini, ti preghiamo di astenerti dall'utilizzare la nostra piattaforma.`,
    natureText: `${APP_NAME} è una piattaforma decentralizzata che opera direttamente tramite API con Uniswap. La piattaforma si connette esclusivamente con wallet e consente operazioni in pool di liquidità concentrata. Il nostro algoritmo bilancia tra diversi pool per massimizzare i rendimenti per gli utenti.`,
    usageText: `Per utilizzare ${APP_NAME}, devi avere almeno 18 anni e la capacità legale di accettare questi termini nella tua giurisdizione. L'utilizzo della piattaforma richiede un wallet compatibile con Ethereum. Sei responsabile della sicurezza del tuo wallet, incluse le tue chiavi private e le frasi di recupero.`,
    usageListTitle: "Attività Proibite: Accetti di non utilizzare la piattaforma per:",
    usageListItems: [
      "Attività illegali o fraudolente",
      "Violare questi termini o qualsiasi legge applicabile",
      "Violare la proprietà intellettuale o altri diritti di terzi",
      "Tentare di manipolare o interferire con il funzionamento della piattaforma",
      "Condurre operazioni che possono essere considerate manipolazione del mercato"
    ],
    risksText: `L'utilizzo di criptovalute e la partecipazione a mercati decentralizzati comportano rischi significativi. ${APP_NAME} è una piattaforma non custodial. Non memorizziamo né abbiamo accesso alle tue chiavi private, fondi o asset digitali. Mantieni il pieno controllo e la responsabilità sui tuoi asset in ogni momento.`,
    risksListTitle: "Rischi Associati: L'utilizzo di criptovalute e la partecipazione a mercati decentralizzati comportano rischi significativi. Questi includono, ma non sono limitati a:",
    risksListItems: [
      "Volatilità dei prezzi degli asset digitali",
      "Perdite impermanenti nelle posizioni di liquidità",
      "Rischi tecnici relativi ai contratti intelligenti",
      "Modifiche normative che potrebbero influenzare il funzionamento della piattaforma"
    ],
    intellectualText: "Tutti i diritti di proprietà intellettuale relativi alla piattaforma, inclusi software, design, loghi, marchi e contenuti, sono di proprietà di Elysium Media FZCO o dei suoi concessori di licenza. Ti viene concessa una licenza limitata, non esclusiva e non trasferibile per accedere e utilizzare la piattaforma in conformità con questi termini.",
    liabilityText: "La piattaforma è fornita 'così com'è' e 'come disponibile', senza garanzie di alcun tipo, siano esse espresse o implicite. Nella massima misura consentita dalla legge applicabile, Elysium Media FZCO e le sue affiliate non saranno responsabili per danni diretti, indiretti, incidentali, speciali, consequenziali o punitivi, inclusi, ma non limitati a, perdita di profitti, dati, utilizzo, avviamento o altre perdite intangibili.",
    modificationsText: "Ci riserviamo il diritto di modificare questi Termini di Utilizzo in qualsiasi momento. Le modifiche entreranno in vigore immediatamente dopo la loro pubblicazione sulla piattaforma. Il tuo uso continuato della piattaforma dopo tali modifiche costituirà la tua accettazione dei termini modificati.",
    lawText: "Questi termini saranno regolati e interpretati in conformità con le leggi di Dubai, Emirati Arabi Uniti, senza riguardo ai principi di conflitto di leggi. Qualsiasi controversia derivante da o relativa a questi termini sarà risolta esclusivamente mediante arbitrato a Dubai, in conformità con le regole del Centro Internazionale di Arbitrato di Dubai (DIAC).",
    generalText: "Questi termini costituiscono l'accordo completo tra te ed Elysium Media FZCO riguardo all'utilizzo della piattaforma. Se una qualsiasi disposizione di questi termini è ritenuta non valida o inapplicabile, tale disposizione sarà interpretata e limitata nella misura necessaria per renderla valida e applicabile, o sarà eliminata se tale interpretazione non è possibile, e le disposizioni rimanenti continueranno ad avere pieno vigore ed effetto.",
    contactText: "Se hai domande o commenti su questi Termini di Utilizzo, contattaci a: Elysium Media FZCO, ID: 58510, Premises no. 58510 - 001, IFZA Business Park, DDP, DUBAI, United Arab Emirates."
  },
  
  // Francés
  fr: {
    termsOfUseTitle: "Conditions d'Utilisation",
    lastUpdated: "Dernière mise à jour: 2 avril 2021",
    contentIndex: "Sommaire",
    
    // Titres des sections
    section1Title: "1. Acceptation des Conditions",
    section2Title: "2. Nature de la Plateforme",
    section3Title: "3. Utilisation de la Plateforme",
    section4Title: "4. Risques et Responsabilités",
    section5Title: "5. Propriété Intellectuelle",
    section6Title: "6. Limitation de Responsabilité",
    section7Title: "7. Modifications",
    section8Title: "8. Loi Applicable et Résolution des Litiges",
    section9Title: "9. Dispositions Générales",
    section10Title: "10. Contact",
    
    // Contenu des sections
    introText: `Bienvenue sur ${APP_NAME}. Ces Conditions d'Utilisation constituent un accord juridiquement contraignant entre vous et Elysium Media FZCO, qui exploite la plateforme décentralisée ${APP_NAME}. En accédant ou en utilisant notre plateforme, vous acceptez d'être lié par ces conditions. Si vous n'êtes pas d'accord avec ces conditions, veuillez vous abstenir d'utiliser notre plateforme.`,
    acceptanceText: `Bienvenue sur ${APP_NAME}. Ces Conditions d'Utilisation constituent un accord juridiquement contraignant entre vous et Elysium Media FZCO, qui exploite la plateforme décentralisée ${APP_NAME}. En accédant ou en utilisant notre plateforme, vous acceptez d'être lié par ces conditions. Si vous n'êtes pas d'accord avec ces conditions, veuillez vous abstenir d'utiliser notre plateforme.`,
    natureText: `${APP_NAME} est une plateforme décentralisée qui fonctionne directement via API avec Uniswap. La plateforme se connecte exclusivement avec des portefeuilles et permet des opérations dans des pools de liquidité concentrée. Notre algorithme équilibre entre différents pools pour maximiser les rendements pour les utilisateurs.`,
    usageText: `Pour utiliser ${APP_NAME}, vous devez avoir au moins 18 ans et la capacité juridique d'accepter ces conditions dans votre juridiction. L'utilisation de la plateforme nécessite un portefeuille compatible avec Ethereum. Vous êtes responsable de la sécurité de votre portefeuille, y compris vos clés privées et phrases de récupération.`,
    usageListTitle: "Activités Interdites: Vous acceptez de ne pas utiliser la plateforme pour:",
    usageListItems: [
      "Des activités illégales ou frauduleuses",
      "Violer ces conditions ou toute loi applicable",
      "Enfreindre la propriété intellectuelle ou d'autres droits de tiers",
      "Tenter de manipuler ou d'interférer avec le fonctionnement de la plateforme",
      "Effectuer des opérations qui pourraient être considérées comme une manipulation du marché"
    ],
    risksText: `L'utilisation de cryptomonnaies et la participation à des marchés décentralisés comportent des risques importants. ${APP_NAME} est une plateforme non-dépositaire. Nous ne stockons pas et n'avons pas accès à vos clés privées, fonds ou actifs numériques. Vous conservez le contrôle total et la responsabilité de vos actifs à tout moment.`,
    risksListTitle: "Risques Associés: L'utilisation de cryptomonnaies et la participation à des marchés décentralisés comportent des risques importants. Ceux-ci incluent, mais ne sont pas limités à:",
    risksListItems: [
      "Volatilité des prix des actifs numériques",
      "Pertes impermanentes dans les positions de liquidité",
      "Risques techniques liés aux contrats intelligents",
      "Changements réglementaires qui pourraient affecter le fonctionnement de la plateforme"
    ],
    intellectualText: "Tous les droits de propriété intellectuelle liés à la plateforme, y compris les logiciels, la conception, les logos, les marques et le contenu, sont la propriété d'Elysium Media FZCO ou de ses concédants. Il vous est accordé une licence limitée, non exclusive et non transférable pour accéder et utiliser la plateforme conformément à ces conditions.",
    liabilityText: "La plateforme est fournie 'telle quelle' et 'selon disponibilité', sans garanties d'aucune sorte, qu'elles soient expresses ou implicites. Dans la mesure maximale permise par la loi applicable, Elysium Media FZCO et ses affiliés ne seront pas responsables des dommages directs, indirects, accessoires, spéciaux, consécutifs ou punitifs, y compris, mais sans s'y limiter, la perte de profits, de données, d'utilisation, de clientèle ou d'autres pertes intangibles.",
    modificationsText: "Nous nous réservons le droit de modifier ces Conditions d'Utilisation à tout moment. Les modifications prendront effet immédiatement après leur publication sur la plateforme. Votre utilisation continue de la plateforme après de telles modifications constituera votre acceptation des conditions modifiées.",
    lawText: "Ces conditions seront régies et interprétées conformément aux lois de Dubaï, Émirats Arabes Unis, sans égard aux principes de conflit de lois. Tout litige découlant de ou lié à ces conditions sera résolu exclusivement par arbitrage à Dubaï, conformément aux règles du Centre d'Arbitrage International de Dubaï (DIAC).",
    generalText: "Ces conditions constituent l'accord complet entre vous et Elysium Media FZCO concernant l'utilisation de la plateforme. Si une disposition de ces conditions est jugée invalide ou inapplicable, cette disposition sera interprétée et limitée dans la mesure nécessaire pour la rendre valide et applicable, ou sera éliminée si une telle interprétation n'est pas possible, et les dispositions restantes continueront à avoir plein effet.",
    contactText: "Si vous avez des questions ou des commentaires concernant ces Conditions d'Utilisation, contactez-nous à: Elysium Media FZCO, ID: 58510, Premises no. 58510 - 001, IFZA Business Park, DDP, DUBAI, United Arab Emirates."
  },
  
  // Alemán
  de: {
    termsOfUseTitle: "Nutzungsbedingungen",
    lastUpdated: "Zuletzt aktualisiert: 2. April 2021",
    contentIndex: "Inhalt",
    
    // Abschnittstitel
    section1Title: "1. Annahme der Bedingungen",
    section2Title: "2. Art der Plattform",
    section3Title: "3. Nutzung der Plattform",
    section4Title: "4. Risiken und Verantwortlichkeiten",
    section5Title: "5. Geistiges Eigentum",
    section6Title: "6. Haftungsbeschränkung",
    section7Title: "7. Änderungen",
    section8Title: "8. Anwendbares Recht und Streitbeilegung",
    section9Title: "9. Allgemeine Bestimmungen",
    section10Title: "10. Kontakt",
    
    // Inhalt der Abschnitte
    introText: `Willkommen bei ${APP_NAME}. Diese Nutzungsbedingungen stellen eine rechtsverbindliche Vereinbarung zwischen Ihnen und Elysium Media FZCO dar, die die dezentrale Plattform ${APP_NAME} betreibt. Durch den Zugriff auf oder die Nutzung unserer Plattform erklären Sie sich mit diesen Bedingungen einverstanden. Wenn Sie mit diesen Bedingungen nicht einverstanden sind, nutzen Sie bitte unsere Plattform nicht.`,
    acceptanceText: `Willkommen bei ${APP_NAME}. Diese Nutzungsbedingungen stellen eine rechtsverbindliche Vereinbarung zwischen Ihnen und Elysium Media FZCO dar, die die dezentrale Plattform ${APP_NAME} betreibt. Durch den Zugriff auf oder die Nutzung unserer Plattform erklären Sie sich mit diesen Bedingungen einverstanden. Wenn Sie mit diesen Bedingungen nicht einverstanden sind, nutzen Sie bitte unsere Plattform nicht.`,
    natureText: `${APP_NAME} ist eine dezentrale Plattform, die direkt über API mit Uniswap arbeitet. Die Plattform verbindet sich ausschließlich mit Wallets und ermöglicht Operationen in konzentrierten Liquiditätspools. Unser Algorithmus balanciert zwischen verschiedenen Pools, um die Renditen für die Benutzer zu maximieren.`,
    usageText: `Um ${APP_NAME} zu nutzen, müssen Sie mindestens 18 Jahre alt sein und die rechtliche Fähigkeit haben, diese Bedingungen in Ihrer Jurisdiktion zu akzeptieren. Die Nutzung der Plattform erfordert eine mit Ethereum kompatible Wallet. Sie sind für die Sicherheit Ihrer Wallet verantwortlich, einschließlich Ihrer privaten Schlüssel und Recovery-Phrasen.`,
    usageListTitle: "Verbotene Aktivitäten: Sie verpflichten sich, die Plattform nicht zu nutzen für:",
    usageListItems: [
      "Illegale oder betrügerische Aktivitäten",
      "Verstoß gegen diese Bedingungen oder geltendes Recht",
      "Verletzung des geistigen Eigentums oder anderer Rechte Dritter",
      "Versuch, den Betrieb der Plattform zu manipulieren oder zu stören",
      "Durchführung von Operationen, die als Marktmanipulation angesehen werden könnten"
    ],
    risksText: `Die Verwendung von Kryptowährungen und die Teilnahme an dezentralen Märkten birgt erhebliche Risiken. ${APP_NAME} ist eine nicht-depotführende Plattform. Wir speichern oder haben keinen Zugriff auf Ihre privaten Schlüssel, Gelder oder digitalen Vermögenswerte. Sie behalten jederzeit die volle Kontrolle und Verantwortung über Ihre Vermögenswerte.`,
    risksListTitle: "Verbundene Risiken: Die Verwendung von Kryptowährungen und die Teilnahme an dezentralen Märkten birgt erhebliche Risiken. Dazu gehören unter anderem:",
    risksListItems: [
      "Volatilität der Preise digitaler Vermögenswerte",
      "Unbeständige Verluste in Liquiditätspositionen",
      "Technische Risiken im Zusammenhang mit Smart Contracts",
      "Regulatorische Änderungen, die den Betrieb der Plattform beeinflussen könnten"
    ],
    intellectualText: "Alle mit der Plattform verbundenen geistigen Eigentumsrechte, einschließlich Software, Design, Logos, Marken und Inhalte, sind Eigentum von Elysium Media FZCO oder deren Lizenzgebern. Ihnen wird eine begrenzte, nicht-exklusive und nicht übertragbare Lizenz gewährt, um auf die Plattform zuzugreifen und sie gemäß diesen Bedingungen zu nutzen.",
    liabilityText: "Die Plattform wird 'wie besehen' und 'wie verfügbar' bereitgestellt, ohne Garantien jeglicher Art, seien sie ausdrücklich oder implizit. Im maximalen gesetzlich zulässigen Umfang sind Elysium Media FZCO und ihre verbundenen Unternehmen nicht haftbar für direkte, indirekte, zufällige, besondere, Folge- oder Strafschäden, einschließlich, aber nicht beschränkt auf, Verlust von Gewinnen, Daten, Nutzung, Goodwill oder anderen immateriellen Verlusten.",
    modificationsText: "Wir behalten uns das Recht vor, diese Nutzungsbedingungen jederzeit zu ändern. Die Änderungen treten unmittelbar nach ihrer Veröffentlichung auf der Plattform in Kraft. Ihre fortgesetzte Nutzung der Plattform nach solchen Änderungen stellt Ihre Akzeptanz der geänderten Bedingungen dar.",
    lawText: "Diese Bedingungen unterliegen den Gesetzen von Dubai, Vereinigte Arabische Emirate, und werden in Übereinstimmung mit diesen ausgelegt, ohne Berücksichtigung von Grundsätzen des Kollisionsrechts. Jede Streitigkeit, die aus diesen Bedingungen entsteht oder mit ihnen in Zusammenhang steht, wird ausschließlich durch Schiedsverfahren in Dubai gemäß den Regeln des Dubai International Arbitration Centre (DIAC) beigelegt.",
    generalText: "Diese Bedingungen stellen die vollständige Vereinbarung zwischen Ihnen und Elysium Media FZCO in Bezug auf die Nutzung der Plattform dar. Sollte eine Bestimmung dieser Bedingungen als ungültig oder nicht durchsetzbar erachtet werden, wird diese Bestimmung in dem Maße ausgelegt und eingeschränkt, wie es notwendig ist, um sie gültig und durchsetzbar zu machen, oder sie wird gestrichen, wenn eine solche Auslegung nicht möglich ist, und die übrigen Bestimmungen bleiben in vollem Umfang in Kraft.",
    contactText: "Wenn Sie Fragen oder Anmerkungen zu diesen Nutzungsbedingungen haben, kontaktieren Sie uns unter: Elysium Media FZCO, ID: 58510, Premises no. 58510 - 001, IFZA Business Park, DDP, DUBAI, United Arab Emirates."
  },
  
  // Hindi
  hi: {
    termsOfUseTitle: "उपयोग की शर्तें",
    lastUpdated: "अंतिम अपडेट: 2 अप्रैल 2021",
    contentIndex: "सामग्री",
    
    // अनुभाग शीर्षक
    section1Title: "1. शर्तों की स्वीकृति",
    section2Title: "2. प्लेटफॉर्म की प्रकृति",
    section3Title: "3. प्लेटफॉर्म का उपयोग",
    section4Title: "4. जोखिम और जिम्मेदारियां",
    section5Title: "5. बौद्धिक संपदा",
    section6Title: "6. दायित्व की सीमा",
    section7Title: "7. संशोधन",
    section8Title: "8. लागू कानून और विवाद समाधान",
    section9Title: "9. सामान्य प्रावधान",
    section10Title: "10. संपर्क",
    
    // अनुभाग सामग्री
    introText: `${APP_NAME} में आपका स्वागत है। ये उपयोग की शर्तें आपके और Elysium Media FZCO के बीच एक कानूनी रूप से बाध्यकारी समझौता है, जो विकेंद्रीकृत प्लेटफॉर्म ${APP_NAME} का संचालन करता है। हमारे प्लेटफॉर्म तक पहुंचकर या इसका उपयोग करके, आप इन शर्तों से बंधे होने के लिए सहमत होते हैं। यदि आप इन शर्तों से सहमत नहीं हैं, तो कृपया हमारे प्लेटफॉर्म का उपयोग करने से बचें।`,
    acceptanceText: `${APP_NAME} में आपका स्वागत है। ये उपयोग की शर्तें आपके और Elysium Media FZCO के बीच एक कानूनी रूप से बाध्यकारी समझौता है, जो विकेंद्रीकृत प्लेटफॉर्म ${APP_NAME} का संचालन करता है। हमारे प्लेटफॉर्म तक पहुंचकर या इसका उपयोग करके, आप इन शर्तों से बंधे होने के लिए सहमत होते हैं। यदि आप इन शर्तों से सहमत नहीं हैं, तो कृपया हमारे प्लेटफॉर्म का उपयोग करने से बचें।`,
    natureText: `${APP_NAME} एक विकेंद्रीकृत प्लेटफॉर्म है जो सीधे API के माध्यम से Uniswap के साथ काम करता है। प्लेटफॉर्म केवल वॉलेट के साथ जुड़ता है और केंद्रित तरलता पूल में संचालन की अनुमति देता है। हमारा एल्गोरिदम उपयोगकर्ताओं के लिए रिटर्न को अधिकतम करने के लिए विभिन्न पूल के बीच संतुलन बनाता है।`,
    usageText: `${APP_NAME} का उपयोग करने के लिए, आपकी आयु कम से कम 18 वर्ष होनी चाहिए और आपके अधिकार क्षेत्र में इन शर्तों को स्वीकार करने की कानूनी क्षमता होनी चाहिए। प्लेटफॉर्म का उपयोग करने के लिए Ethereum के साथ संगत वॉलेट की आवश्यकता होती है। आप अपने वॉलेट की सुरक्षा के लिए जिम्मेदार हैं, जिसमें आपकी निजी कुंजियां और रिकवरी वाक्यांश शामिल हैं।`,
    usageListTitle: "निषिद्ध गतिविधियां: आप प्लेटफॉर्म का उपयोग निम्नलिखित के लिए न करने का वचन देते हैं:",
    usageListItems: [
      "अवैध या धोखाधड़ी वाली गतिविधियां",
      "इन शर्तों या किसी भी लागू कानून का उल्लंघन",
      "बौद्धिक संपदा या तीसरे पक्ष के अन्य अधिकारों का उल्लंघन",
      "प्लेटफॉर्म के संचालन में हेरफेर करने या हस्तक्षेप करने का प्रयास",
      "ऐसे संचालन करना जिन्हें बाजार में हेरफेर माना जा सकता है"
    ],
    risksText: `क्रिप्टोकरेंसी का उपयोग और विकेंद्रीकृत बाजारों में भागीदारी में महत्वपूर्ण जोखिम शामिल हैं। ${APP_NAME} एक गैर-संरक्षक प्लेटफॉर्म है। हम आपकी निजी कुंजियों, धन या डिजिटल संपत्तियों को संग्रहीत नहीं करते हैं या उन तक पहुंच नहीं रखते हैं। आप हर समय अपनी संपत्तियों पर पूर्ण नियंत्रण और जिम्मेदारी बनाए रखते हैं।`,
    risksListTitle: "संबंधित जोखिम: क्रिप्टोकरेंसी का उपयोग और विकेंद्रीकृत बाजारों में भागीदारी में महत्वपूर्ण जोखिम शामिल हैं। इनमें शामिल हैं, लेकिन इन तक सीमित नहीं हैं:",
    risksListItems: [
      "डिजिटल संपत्तियों की कीमतों में उतार-चढ़ाव",
      "तरलता स्थितियों में अस्थायी नुकसान",
      "स्मार्ट अनुबंधों से संबंधित तकनीकी जोखिम",
      "नियामक परिवर्तन जो प्लेटफॉर्म के संचालन को प्रभावित कर सकते हैं"
    ],
    intellectualText: "प्लेटफॉर्म से संबंधित सभी बौद्धिक संपदा अधिकार, जिनमें सॉफ्टवेयर, डिजाइन, लोगो, ट्रेडमार्क और सामग्री शामिल हैं, Elysium Media FZCO या उसके लाइसेंसधारकों की संपत्ति हैं। आपको इन शर्तों के अनुसार प्लेटफॉर्म तक पहुंचने और उसका उपयोग करने के लिए एक सीमित, गैर-अनन्य और गैर-हस्तांतरणीय लाइसेंस दिया जाता है।",
    liabilityText: "प्लेटफॉर्म 'जैसा है' और 'जैसा उपलब्ध है' प्रदान किया जाता है, बिना किसी प्रकार की वारंटी के, चाहे वह स्पष्ट हो या निहित। लागू कानून द्वारा अनुमत अधिकतम सीमा तक, Elysium Media FZCO और उसके सहयोगी प्रत्यक्ष, अप्रत्यक्ष, आकस्मिक, विशेष, परिणामी या दंडात्मक क्षतियों के लिए उत्तरदायी नहीं होंगे, जिनमें शामिल हैं, लेकिन इन तक सीमित नहीं हैं, लाभ, डेटा, उपयोग, सद्भावना या अन्य अमूर्त नुकसान।",
    modificationsText: "हम इन उपयोग की शर्तों को किसी भी समय संशोधित करने का अधिकार सुरक्षित रखते हैं। संशोधन प्लेटफॉर्म पर उनके प्रकाशन के तुरंत बाद प्रभावी होंगे। ऐसे संशोधनों के बाद प्लेटफॉर्म का आपका निरंतर उपयोग संशोधित शर्तों की आपकी स्वीकृति का गठन करेगा।",
    lawText: "ये शर्तें दुबई, संयुक्त अरब अमीरात के कानूनों के अनुसार शासित और व्याख्या की जाएंगी, बिना कानूनों के संघर्ष के सिद्धांतों पर विचार किए। इन शर्तों से उत्पन्न या संबंधित कोई भी विवाद दुबई में अंतर्राष्ट्रीय मध्यस्थता केंद्र दुबई (DIAC) के नियमों के अनुसार विशेष रूप से मध्यस्थता के माध्यम से हल किया जाएगा।",
    generalText: "ये शर्तें प्लेटफॉर्म के उपयोग के संबंध में आपके और Elysium Media FZCO के बीच पूर्ण समझौता बनाती हैं। यदि इन शर्तों का कोई प्रावधान अमान्य या अप्रवर्तनीय माना जाता है, तो ऐसे प्रावधान को उस सीमा तक व्याख्या और सीमित किया जाएगा जितना आवश्यक है ताकि इसे वैध और प्रवर्तनीय बनाया जा सके, या यदि ऐसी व्याख्या संभव नहीं है तो इसे हटा दिया जाएगा, और शेष प्रावधान पूर्ण बल और प्रभाव में जारी रहेंगे।",
    contactText: "यदि आपके पास इन उपयोग की शर्तों के बारे में कोई प्रश्न या टिप्पणी है, तो हमसे संपर्क करें: Elysium Media FZCO, ID: 58510, Premises no. 58510 - 001, IFZA Business Park, DDP, DUBAI, United Arab Emirates."
  },
  
  // Chino
  zh: {
    termsOfUseTitle: "使用条款",
    lastUpdated: "最后更新日期：2021年4月2日",
    contentIndex: "目录",
    
    // 章节标题
    section1Title: "1. 接受条款",
    section2Title: "2. 平台性质",
    section3Title: "3. 平台使用",
    section4Title: "4. 风险和责任",
    section5Title: "5. 知识产权",
    section6Title: "6. 责任限制",
    section7Title: "7. 修改",
    section8Title: "8. 适用法律和争议解决",
    section9Title: "9. 一般条款",
    section10Title: "10. 联系方式",
    
    // 章节内容
    introText: `欢迎来到${APP_NAME}。这些使用条款构成您与Elysium Media FZCO（运营${APP_NAME}去中心化平台的公司）之间具有法律约束力的协议。通过访问或使用我们的平台，您同意受这些条款的约束。如果您不同意这些条款，请勿使用我们的平台。`,
    acceptanceText: `欢迎来到${APP_NAME}。这些使用条款构成您与Elysium Media FZCO（运营${APP_NAME}去中心化平台的公司）之间具有法律约束力的协议。通过访问或使用我们的平台，您同意受这些条款的约束。如果您不同意这些条款，请勿使用我们的平台。`,
    natureText: `${APP_NAME}是一个通过API直接与Uniswap操作的去中心化平台。该平台专门与钱包连接，并允许在集中流动性池中进行操作。我们的算法在不同的池之间平衡，以最大化用户的回报。`,
    usageText: `要使用${APP_NAME}，您必须年满18岁，并在您的管辖区域内有法律能力接受这些条款。使用平台需要一个兼容以太坊的钱包。您负责您钱包的安全，包括您的私钥和恢复短语。`,
    usageListTitle: "禁止活动：您承诺不会使用平台进行：",
    usageListItems: [
      "非法或欺诈活动",
      "违反这些条款或任何适用法律",
      "侵犯知识产权或第三方的其他权利",
      "试图操纵或干扰平台的运行",
      "进行可能被视为市场操纵的操作"
    ],
    risksText: `使用加密货币和参与去中心化市场涉及重大风险。${APP_NAME}是一个非托管平台。我们不存储或访问您的私钥、资金或数字资产。您始终保持对资产的完全控制和责任。`,
    risksListTitle: "相关风险：使用加密货币和参与去中心化市场涉及重大风险。这些包括但不限于：",
    risksListItems: [
      "数字资产价格的波动性",
      "流动性头寸中的非永久性损失",
      "与智能合约相关的技术风险",
      "可能影响平台运营的监管变化"
    ],
    intellectualText: "与平台相关的所有知识产权，包括软件、设计、标志、商标和内容，均为Elysium Media FZCO或其许可方的财产。我们授予您有限的、非排他性的、不可转让的许可，以根据这些条款访问和使用平台。",
    liabilityText: "平台按'原样'和'可用性'提供，没有任何形式的明示或暗示担保。在适用法律允许的最大范围内，Elysium Media FZCO及其关联公司不对直接、间接、偶然、特殊、后果性或惩罚性损害负责，包括但不限于利润、数据、使用、商誉或其他无形损失。",
    modificationsText: "我们保留随时修改这些使用条款的权利。修改将在平台上发布后立即生效。您在此类修改后继续使用平台将构成您对修改后条款的接受。",
    lawText: "这些条款将受迪拜，阿拉伯联合酋长国法律管辖并按其解释，不考虑法律冲突原则。任何因这些条款引起或与之相关的争议将专门通过在迪拜进行的仲裁解决，根据迪拜国际仲裁中心（DIAC）的规则。",
    generalText: "这些条款构成您与Elysium Media FZCO之间关于平台使用的完整协议。如果这些条款的任何条款被视为无效或不可执行，将在必要的范围内解释和限制该条款以使其有效和可执行，或者如果无法解释，则将删除该条款，而其余条款将继续完全有效。",
    contactText: "如果您对这些使用条款有任何问题或意见，请联系我们：Elysium Media FZCO，ID：58510，Premises no. 58510 - 001，IFZA Business Park，DDP，DUBAI，United Arab Emirates。"
  }
};

export const privacyPolicyTranslations: Record<Language, PrivacyPolicyTranslations> = {
  es: {
    privacyPolicyTitle: "Política de Privacidad",
    lastUpdated: "Última actualización: 2 de abril de 2021",
    contentIndex: "Contenido",
    
    // Títulos de secciones
    section1Title: "1. Introducción",
    section2Title: "2. Información que Recopilamos",
    section3Title: "3. Cómo Utilizamos la Información",
    section4Title: "4. Intercambio y Divulgación de Información",
    section5Title: "5. Seguridad de la Información",
    section6Title: "6. Derechos de Privacidad",
    section7Title: "7. Transferencias Internacionales de Datos",
    section8Title: "8. Retención de Datos",
    section9Title: "9. Cambios a esta Política",
    section10Title: "10. Contacto",
    section11Title: "11. Legislación Aplicable",
    
    // Contenido de secciones
    introText: `En ${APP_NAME}, operado por Elysium Media FZCO, valoramos y respetamos su privacidad. Esta Política de Privacidad explica cómo recopilamos, utilizamos, compartimos y protegemos la información que obtenemos cuando utiliza nuestra plataforma descentralizada. Al utilizar ${APP_NAME}, usted acepta las prácticas descritas en este documento.`,
    
    information1Title: "2.1 Información del Blockchain:",
    information1Text: `Como aplicación descentralizada (dApp), ${APP_NAME} interactúa directamente con la blockchain. Recopilamos y procesamos información disponible públicamente en la blockchain, incluyendo direcciones de wallet, transacciones y datos de posiciones de liquidez.`,
    information2Title: "2.2 Información de Uso:",
    information2Text: "Recopilamos datos sobre cómo interactúa con nuestra plataforma, incluyendo:",
    information2List: [
      "Patrones de uso y actividad en la plataforma",
      "Información técnica como tipo de dispositivo, navegador y sistema operativo",
      "Datos de registro y errores",
      "Métricas de rendimiento y análisis"
    ],
    information3Title: "2.3 Información de Comunicaciones:",
    information3Text: "Si se comunica con nosotros, podemos recopilar la información que nos proporcione en esas comunicaciones.",
    
    usageText: "Utilizamos la información recopilada para:",
    usageList: [
      "Proporcionar, mantener y mejorar nuestra plataforma",
      "Optimizar los algoritmos de gestión de liquidez",
      "Desarrollar nuevas características y servicios",
      "Analizar tendencias y patrones de uso",
      "Detectar, prevenir y abordar problemas técnicos y de seguridad",
      "Cumplir con obligaciones legales y proteger nuestros derechos"
    ],
    
    sharing1Title: "4.1 Naturaleza de la Blockchain:",
    sharing1Text: "Es importante entender que debido a la naturaleza de la blockchain, las transacciones y direcciones de wallet son información pública visible en la blockchain.",
    sharing2Title: "4.2 Compartir con Terceros:",
    sharing2Text: "Podemos compartir información con:",
    sharing2List: [
      "Proveedores de servicios que nos ayudan a operar, mantener y mejorar nuestra plataforma",
      "Asesores profesionales, como abogados y auditores",
      "Autoridades reguladoras, entidades de gobierno y otras partes, cuando sea requerido por ley",
      "En caso de fusión, venta o transferencia de activos, con la parte adquirente"
    ],
    sharing3Title: "4.3 Información Agregada o Anonimizada:",
    sharing3Text: "Podemos usar y compartir información agregada o anonimizada (que no identifica a usuarios individuales) para cualquier propósito, incluyendo para análisis de mercado, mejora de servicios y comunicaciones de marketing.",
    
    security1Text: "Implementamos medidas de seguridad técnicas, administrativas y físicas para proteger la información que recopilamos y procesamos. Sin embargo, ningún sistema es completamente seguro, y no podemos garantizar la seguridad absoluta de su información.",
    security2Title: "5.1 Seguridad de sus Activos:",
    security2Text: `${APP_NAME} es una plataforma no custodial, lo que significa que no almacenamos claves privadas ni tenemos acceso directo a los activos digitales de los usuarios. Usted mantiene el control total de sus activos en todo momento.`,
    
    rightsText: "Dependiendo de su jurisdicción, puede tener ciertos derechos respecto a su información personal, incluyendo:",
    rightsList: [
      "Acceso: Solicitar copias de su información personal",
      "Rectificación: Corregir información inexacta",
      "Eliminación: Solicitar la eliminación de su información personal",
      "Restricción: Limitar el procesamiento de su información",
      "Objeción: Oponerse al procesamiento de su información",
      "Portabilidad: Recibir su información en un formato estructurado y transferible"
    ],
    rightsActionText: "Para ejercer estos derechos, contáctenos utilizando la información proporcionada al final de esta política.",
    
    transfersText: "Operamos internacionalmente y podemos transferir su información a países distintos del suyo. Cuando lo hacemos, tomamos medidas para asegurar que su información reciba un nivel adecuado de protección.",
    
    retentionText: "Conservamos su información mientras sea necesario para los propósitos descritos en esta política, a menos que se requiera o permita un período de retención más largo por ley.",
    
    changesText: "Podemos actualizar esta Política de Privacidad de vez en cuando. Le notificaremos cualquier cambio material publicando la nueva política en nuestra plataforma o por otros medios apropiados. Le recomendamos revisar periódicamente esta política para estar informado sobre cómo protegemos su información.",
    
    contactText: "Si tiene preguntas o inquietudes sobre esta Política de Privacidad o nuestras prácticas de privacidad, contáctenos en:",
    contactAddress: "Elysium Media FZCO\nID: 58510, Premises no. 58510 - 001\nIFZA Business Park, DDP\nDUBAI, United Arab Emirates",
    
    lawText: "Esta Política de Privacidad se rige e interpreta de acuerdo con las leyes de Dubai, Emiratos Árabes Unidos, y cualquier disputa relacionada con esta política estará sujeta a la jurisdicción exclusiva de los tribunales de Dubai."
  },
  en: {
    privacyPolicyTitle: "Privacy Policy",
    lastUpdated: "Last updated: April 2, 2021",
    contentIndex: "Contents",
    
    // Section titles
    section1Title: "1. Introduction",
    section2Title: "2. Information We Collect",
    section3Title: "3. How We Use Information",
    section4Title: "4. Information Sharing and Disclosure",
    section5Title: "5. Information Security",
    section6Title: "6. Privacy Rights",
    section7Title: "7. International Data Transfers",
    section8Title: "8. Data Retention",
    section9Title: "9. Changes to This Policy",
    section10Title: "10. Contact",
    section11Title: "11. Applicable Law",
    
    // Section content
    introText: `At ${APP_NAME}, operated by Elysium Media FZCO, we value and respect your privacy. This Privacy Policy explains how we collect, use, share, and protect information when you use our decentralized platform. By using ${APP_NAME}, you agree to the practices described in this document.`,
    
    information1Title: "2.1 Blockchain Information:",
    information1Text: `As a decentralized application (dApp), ${APP_NAME} interacts directly with the blockchain. We collect and process publicly available information on the blockchain, including wallet addresses, transactions, and liquidity position data.`,
    information2Title: "2.2 Usage Information:",
    information2Text: "We collect data about how you interact with our platform, including:",
    information2List: [
      "Usage patterns and activity on the platform",
      "Technical information such as device type, browser, and operating system",
      "Log data and errors",
      "Performance metrics and analytics"
    ],
    information3Title: "2.3 Communication Information:",
    information3Text: "If you communicate with us, we may collect the information you provide in those communications.",
    
    usageText: "We use the collected information to:",
    usageList: [
      "Provide, maintain, and improve our platform",
      "Optimize liquidity management algorithms",
      "Develop new features and services",
      "Analyze trends and usage patterns",
      "Detect, prevent, and address technical and security issues",
      "Comply with legal obligations and protect our rights"
    ],
    
    sharing1Title: "4.1 Nature of the Blockchain:",
    sharing1Text: "It's important to understand that due to the nature of the blockchain, transactions and wallet addresses are public information visible on the blockchain.",
    sharing2Title: "4.2 Sharing with Third Parties:",
    sharing2Text: "We may share information with:",
    sharing2List: [
      "Service providers who help us operate, maintain, and improve our platform",
      "Professional advisors, such as lawyers and auditors",
      "Regulatory authorities, government entities, and other parties when required by law",
      "In the event of a merger, sale, or transfer of assets, with the acquiring party"
    ],
    sharing3Title: "4.3 Aggregated or Anonymized Information:",
    sharing3Text: "We may use and share aggregated or anonymized information (which does not identify individual users) for any purpose, including market analysis, service improvement, and marketing communications.",
    
    security1Text: "We implement technical, administrative, and physical security measures to protect the information we collect and process. However, no system is completely secure, and we cannot guarantee the absolute security of your information.",
    security2Title: "5.1 Security of Your Assets:",
    security2Text: `${APP_NAME} is a non-custodial platform, which means we do not store private keys or have direct access to users' digital assets. You maintain full control of your assets at all times.`,
    
    rightsText: "Depending on your jurisdiction, you may have certain rights regarding your personal information, including:",
    rightsList: [
      "Access: Request copies of your personal information",
      "Rectification: Correct inaccurate information",
      "Erasure: Request deletion of your personal information",
      "Restriction: Limit the processing of your information",
      "Objection: Object to the processing of your information",
      "Portability: Receive your information in a structured, transferable format"
    ],
    rightsActionText: "To exercise these rights, please contact us using the information provided at the end of this policy.",
    
    transfersText: "We operate internationally and may transfer your information to countries other than your own. When we do so, we take steps to ensure that your information receives an adequate level of protection.",
    
    retentionText: "We retain your information for as long as necessary for the purposes outlined in this policy, unless a longer retention period is required or permitted by law.",
    
    changesText: "We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on our platform or through other appropriate means. We encourage you to review this policy periodically to stay informed about how we protect your information.",
    
    contactText: "If you have questions or concerns about this Privacy Policy or our privacy practices, please contact us at:",
    contactAddress: "Elysium Media FZCO\nID: 58510, Premises no. 58510 - 001\nIFZA Business Park, DDP\nDUBAI, United Arab Emirates",
    
    lawText: "This Privacy Policy is governed by and construed in accordance with the laws of Dubai, United Arab Emirates, and any disputes relating to this policy will be subject to the exclusive jurisdiction of the courts of Dubai."
  },
  ru: {
    privacyPolicyTitle: "Политика конфиденциальности",
    lastUpdated: "Последнее обновление: 2 апреля 2021 г.",
    contentIndex: "Содержание",
    
    // Section titles
    section1Title: "1. Введение",
    section2Title: "2. Собираемая нами информация",
    section3Title: "3. Как мы используем информацию",
    section4Title: "4. Обмен и раскрытие информации",
    section5Title: "5. Безопасность информации",
    section6Title: "6. Права на конфиденциальность",
    section7Title: "7. Международная передача данных",
    section8Title: "8. Хранение данных",
    section9Title: "9. Изменения в настоящей Политике",
    section10Title: "10. Контакты",
    section11Title: "11. Применимое законодательство",
    
    // Section content
    introText: `В ${APP_NAME}, управляемом Elysium Media FZCO, мы ценим и уважаем вашу конфиденциальность. Настоящая Политика конфиденциальности объясняет, как мы собираем, используем, передаем и защищаем информацию, когда вы используете нашу децентрализованную платформу. Используя ${APP_NAME}, вы соглашаетесь с практиками, описанными в этом документе.`,
    
    information1Title: "2.1 Информация о блокчейне:",
    information1Text: `Будучи децентрализованным приложением (dApp), ${APP_NAME} взаимодействует непосредственно с блокчейном. Мы собираем и обрабатываем общедоступную информацию в блокчейне, включая адреса кошельков, транзакции и данные о позициях ликвидности.`,
    information2Title: "2.2 Информация об использовании:",
    information2Text: "Мы собираем данные о том, как вы взаимодействуете с нашей платформой, включая:",
    information2List: [
      "Шаблоны использования и активность на платформе",
      "Техническая информация, такая как тип устройства, браузер и операционная система",
      "Данные журналов и ошибки",
      "Метрики производительности и аналитика"
    ],
    information3Title: "2.3 Информация для связи:",
    information3Text: "Если вы связываетесь с нами, мы можем собирать информацию, которую вы предоставляете в этих сообщениях.",
    
    usageText: "Мы используем собранную информацию для:",
    usageList: [
      "Предоставления, поддержки и улучшения нашей платформы",
      "Оптимизации алгоритмов управления ликвидностью",
      "Разработки новых функций и услуг",
      "Анализа тенденций и моделей использования",
      "Обнаружения, предотвращения и устранения технических проблем и проблем безопасности",
      "Соблюдения юридических обязательств и защиты наших прав"
    ],
    
    sharing1Title: "4.1 Характер блокчейна:",
    sharing1Text: "Важно понимать, что из-за характера блокчейна транзакции и адреса кошельков являются общедоступной информацией, видимой в блокчейне.",
    sharing2Title: "4.2 Передача третьим сторонам:",
    sharing2Text: "Мы можем передавать информацию:",
    sharing2List: [
      "Поставщикам услуг, которые помогают нам управлять, поддерживать и улучшать нашу платформу",
      "Профессиональным консультантам, таким как юристы и аудиторы",
      "Регулирующим органам, государственным учреждениям и другим сторонам, когда это требуется по закону",
      "В случае слияния, продажи или передачи активов — приобретающей стороне"
    ],
    sharing3Title: "4.3 Агрегированная или анонимная информация:",
    sharing3Text: "Мы можем использовать и передавать агрегированную или анонимную информацию (которая не идентифицирует отдельных пользователей) для любых целей, включая анализ рынка, улучшение услуг и маркетинговые коммуникации.",
    
    security1Text: "Мы применяем технические, административные и физические меры безопасности для защиты информации, которую мы собираем и обрабатываем. Однако ни одна система не является полностью безопасной, и мы не можем гарантировать абсолютную безопасность вашей информации.",
    security2Title: "5.1 Безопасность ваших активов:",
    security2Text: `${APP_NAME} — это некастодиальная платформа, что означает, что мы не храним приватные ключи и не имеем прямого доступа к цифровым активам пользователей. Вы сохраняете полный контроль над своими активами в любое время.`,
    
    rightsText: "В зависимости от вашей юрисдикции у вас могут быть определенные права в отношении вашей личной информации, включая:",
    rightsList: [
      "Доступ: Запрос копий вашей личной информации",
      "Исправление: Исправление неточной информации",
      "Удаление: Запрос на удаление вашей личной информации",
      "Ограничение: Ограничение обработки вашей информации",
      "Возражение: Возражение против обработки вашей информации",
      "Переносимость: Получение вашей информации в структурированном, передаваемом формате"
    ],
    rightsActionText: "Чтобы воспользоваться этими правами, пожалуйста, свяжитесь с нами, используя информацию, указанную в конце настоящей политики.",
    
    transfersText: "Мы работаем на международном уровне и можем передавать вашу информацию в другие страны. При этом мы принимаем меры для обеспечения надлежащего уровня защиты вашей информации.",
    
    retentionText: "Мы храним вашу информацию столько, сколько необходимо для целей, изложенных в настоящей политике, если более длительный срок хранения не требуется или не разрешен законом.",
    
    changesText: "Мы можем время от времени обновлять настоящую Политику конфиденциальности. Мы уведомим вас о любых существенных изменениях, опубликовав новую политику на нашей платформе или другими соответствующими способами. Мы рекомендуем вам периодически просматривать эту политику, чтобы оставаться в курсе того, как мы защищаем вашу информацию.",
    
    contactText: "Если у вас есть вопросы или опасения по поводу настоящей Политики конфиденциальности или нашей практики конфиденциальности, пожалуйста, свяжитесь с нами по адресу:",
    contactAddress: "Elysium Media FZCO\nID: 58510, Premises no. 58510 - 001\nIFZA Business Park, DDP\nDUBAI, United Arab Emirates",
    
    lawText: "Настоящая Политика конфиденциальности регулируется и толкуется в соответствии с законодательством Дубая, Объединенные Арабские Эмираты, и любые споры, касающиеся настоящей политики, будут подлежать исключительной юрисдикции судов Дубая."
  },
  fr: { 
    privacyPolicyTitle: "Politique de Confidentialité", 
    lastUpdated: "Dernière mise à jour: 2 avril 2021", 
    contentIndex: "Contenu", 
    section1Title: "1. Introduction", 
    section2Title: "2. Informations que nous collectons", 
    section3Title: "3. Comment nous utilisons vos informations", 
    section4Title: "4. Partage et divulgation d'informations", 
    section5Title: "5. Sécurité des informations", 
    section6Title: "6. Droits relatifs à la vie privée", 
    section7Title: "7. Transferts internationaux de données", 
    section8Title: "8. Conservation des données", 
    section9Title: "9. Modifications de cette politique", 
    section10Title: "10. Contact", 
    section11Title: "11. Loi applicable", 
    introText: `Chez ${APP_NAME}, exploité par Elysium Media FZCO, nous valorisons et respectons votre vie privée. Cette Politique de Confidentialité explique comment nous collectons, utilisons, partageons et protégeons les informations lorsque vous utilisez notre plateforme décentralisée. En utilisant ${APP_NAME}, vous acceptez les pratiques décrites dans ce document.`, 
    information1Title: "2.1 Informations de la blockchain:", 
    information1Text: `En tant qu'application décentralisée (dApp), ${APP_NAME} interagit directement avec la blockchain. Nous collectons et traitons les informations disponibles publiquement sur la blockchain, y compris les adresses de portefeuille, les transactions et les données de position de liquidité.`, 
    information2Title: "2.2 Informations d'utilisation:", 
    information2Text: "Nous collectons des données sur la façon dont vous interagissez avec notre plateforme, notamment:", 
    information2List: [
      "Modèles d'utilisation et activité sur la plateforme",
      "Informations techniques telles que le type d'appareil, le navigateur et le système d'exploitation",
      "Données de journalisation et erreurs",
      "Métriques de performance et analyses"
    ], 
    information3Title: "2.3 Informations de communication:", 
    information3Text: "Si vous communiquez avec nous, nous pouvons collecter les informations que vous fournissez dans ces communications.", 
    usageText: "Nous utilisons les informations collectées pour:", 
    usageList: [
      "Fournir, maintenir et améliorer notre plateforme",
      "Optimiser les algorithmes de gestion de liquidité",
      "Développer de nouvelles fonctionnalités et services",
      "Analyser les tendances et les modèles d'utilisation",
      "Détecter, prévenir et résoudre les problèmes techniques et de sécurité",
      "Respecter les obligations légales et protéger nos droits"
    ], 
    sharing1Title: "4.1 Nature de la blockchain:", 
    sharing1Text: "Il est important de comprendre qu'en raison de la nature de la blockchain, les transactions et les adresses de portefeuille sont des informations publiques visibles sur la blockchain.", 
    sharing2Title: "4.2 Partage avec des tiers:", 
    sharing2Text: "Nous pouvons partager des informations avec:", 
    sharing2List: [
      "Des prestataires de services qui nous aident à exploiter, maintenir et améliorer notre plateforme",
      "Des conseillers professionnels, comme des avocats et des auditeurs",
      "Des autorités réglementaires, des entités gouvernementales et d'autres parties, lorsque la loi l'exige",
      "En cas de fusion, vente ou transfert d'actifs, avec la partie acquéreuse"
    ], 
    sharing3Title: "4.3 Informations agrégées ou anonymisées:", 
    sharing3Text: "Nous pouvons utiliser et partager des informations agrégées ou anonymisées (qui n'identifient pas les utilisateurs individuels) à toute fin, y compris pour l'analyse de marché, l'amélioration des services et les communications marketing.", 
    security1Text: "Nous mettons en œuvre des mesures de sécurité techniques, administratives et physiques pour protéger les informations que nous collectons et traitons. Cependant, aucun système n'est totalement sécurisé, et nous ne pouvons garantir la sécurité absolue de vos informations.", 
    security2Title: "5.1 Sécurité de vos actifs:", 
    security2Text: `${APP_NAME} fonctionne comme une plateforme non-dépositaire, ce qui signifie que nous ne stockons pas de clés privées ni n'avons d'accès direct aux actifs numériques des utilisateurs. Vous gardez le contrôle total de vos actifs à tout moment.`, 
    rightsText: "Selon votre juridiction, vous pouvez avoir certains droits concernant vos informations personnelles, notamment:", 
    rightsList: [
      "Accès: Demander des copies de vos informations personnelles",
      "Rectification: Corriger des informations inexactes",
      "Effacement: Demander la suppression de vos informations personnelles",
      "Restriction: Limiter le traitement de vos informations",
      "Opposition: S'opposer au traitement de vos informations",
      "Portabilité: Recevoir vos informations dans un format structuré et transférable"
    ], 
    rightsActionText: "Pour exercer ces droits, veuillez nous contacter en utilisant les informations fournies à la fin de cette politique.", 
    transfersText: "Nous opérons à l'international et pouvons transférer vos informations vers des pays autres que le vôtre. Lorsque nous le faisons, nous prenons des mesures pour garantir que vos informations bénéficient d'un niveau de protection adéquat.", 
    retentionText: "Nous conservons vos informations aussi longtemps que nécessaire aux fins décrites dans cette politique, sauf si une période de conservation plus longue est requise ou autorisée par la loi.", 
    changesText: "Nous pouvons mettre à jour cette Politique de Confidentialité de temps à autre. Nous vous informerons de tout changement important en publiant la nouvelle politique sur notre plateforme ou par d'autres moyens appropriés. Nous vous encourageons à consulter cette politique périodiquement pour rester informé de la façon dont nous protégeons vos informations.", 
    contactText: "Si vous avez des questions ou des préoccupations concernant cette Politique de Confidentialité ou nos pratiques en matière de confidentialité, veuillez nous contacter à:", 
    contactAddress: "Elysium Media FZCO\nID: 58510, Premises no. 58510 - 001\nIFZA Business Park, DDP\nDUBAI, United Arab Emirates", 
    lawText: "Cette Politique de Confidentialité est régie et interprétée conformément aux lois de Dubaï, Émirats Arabes Unis, et tout litige relatif à cette politique sera soumis à la juridiction exclusive des tribunaux de Dubaï."
  },
  ar: { 
    privacyPolicyTitle: "سياسة الخصوصية", 
    lastUpdated: "آخر تحديث: 2 أبريل 2021", 
    contentIndex: "المحتويات", 
    section1Title: "1. مقدمة", 
    section2Title: "2. المعلومات التي نجمعها", 
    section3Title: "3. كيفية استخدامنا للمعلومات", 
    section4Title: "4. مشاركة المعلومات وكشفها", 
    section5Title: "5. أمن المعلومات", 
    section6Title: "6. حقوق الخصوصية", 
    section7Title: "7. نقل البيانات الدولية", 
    section8Title: "8. الاحتفاظ بالبيانات", 
    section9Title: "9. التغييرات على هذه السياسة", 
    section10Title: "10. اتصل بنا", 
    section11Title: "11. القانون المطبق", 
    introText: `في ${APP_NAME}، التي تديرها شركة Elysium Media FZCO، نحن نقدر ونحترم خصوصيتك. توضح سياسة الخصوصية هذه كيفية جمعنا واستخدامنا ومشاركتنا وحمايتنا للمعلومات عند استخدامك لمنصتنا اللامركزية. باستخدامك ${APP_NAME}، فإنك توافق على الممارسات الموضحة في هذا المستند.`, 
    information1Title: "2.1 معلومات البلوكشين:", 
    information1Text: `كتطبيق لامركزي (dApp)، يتفاعل ${APP_NAME} مباشرة مع البلوكشين. نحن نجمع ونعالج المعلومات المتاحة للجمهور على البلوكشين، بما في ذلك عناوين المحفظة والمعاملات وبيانات مراكز السيولة.`, 
    information2Title: "2.2 معلومات الاستخدام:", 
    information2Text: "نحن نجمع بيانات حول كيفية تفاعلك مع منصتنا، بما في ذلك:", 
    information2List: [
      "أنماط الاستخدام والنشاط على المنصة",
      "المعلومات التقنية مثل نوع الجهاز والمتصفح ونظام التشغيل",
      "بيانات السجل والأخطاء",
      "مقاييس الأداء والتحليلات"
    ], 
    information3Title: "2.3 معلومات الاتصال:", 
    information3Text: "إذا تواصلت معنا، فقد نجمع المعلومات التي تقدمها في هذه الاتصالات.", 
    usageText: "نستخدم المعلومات التي نجمعها من أجل:", 
    usageList: [
      "توفير وصيانة وتحسين منصتنا",
      "تحسين خوارزميات إدارة السيولة",
      "تطوير ميزات وخدمات جديدة",
      "تحليل الاتجاهات وأنماط الاستخدام",
      "اكتشاف ومنع وحل المشكلات التقنية والأمنية",
      "الامتثال للالتزامات القانونية وحماية حقوقنا"
    ], 
    sharing1Title: "4.1 طبيعة البلوكشين:", 
    sharing1Text: "من المهم فهم أنه بسبب طبيعة البلوكشين، فإن المعاملات وعناوين المحفظة هي معلومات عامة مرئية على البلوكشين.", 
    sharing2Title: "4.2 المشاركة مع الأطراف الثالثة:", 
    sharing2Text: "قد نشارك المعلومات مع:", 
    sharing2List: [
      "مقدمي الخدمات الذين يساعدوننا في تشغيل وصيانة وتحسين منصتنا",
      "المستشارين المهنيين، مثل المحامين والمدققين",
      "الهيئات التنظيمية والكيانات الحكومية والأطراف الأخرى، عندما يقتضي القانون ذلك",
      "في حالة الاندماج أو البيع أو نقل الأصول، مع الطرف المستحوذ"
    ], 
    sharing3Title: "4.3 المعلومات المجمعة أو المجهولة:", 
    sharing3Text: "قد نستخدم ونشارك المعلومات المجمعة أو المجهولة (التي لا تحدد المستخدمين الفرديين) لأي غرض، بما في ذلك تحليل السوق وتحسين الخدمة والاتصالات التسويقية.", 
    security1Text: "نحن ننفذ تدابير أمنية تقنية وإدارية ومادية لحماية المعلومات التي نجمعها ونعالجها. ومع ذلك، لا يوجد نظام آمن تمامًا، ولا يمكننا ضمان الأمن المطلق لمعلوماتك.", 
    security2Title: "5.1 أمن أصولك:", 
    security2Text: `يعمل ${APP_NAME} كمنصة غير وصائية، مما يعني أننا لا نخزن المفاتيح الخاصة ولا نملك وصولاً مباشرًا إلى الأصول الرقمية للمستخدمين. أنت تحتفظ بالسيطرة الكاملة على أصولك في جميع الأوقات.`, 
    rightsText: "اعتمادًا على ولايتك القضائية، قد يكون لديك حقوق معينة فيما يتعلق بمعلوماتك الشخصية، بما في ذلك:", 
    rightsList: [
      "الوصول: طلب نسخ من معلوماتك الشخصية",
      "التصحيح: تصحيح المعلومات غير الدقيقة",
      "المحو: طلب حذف معلوماتك الشخصية",
      "التقييد: تقييد معالجة معلوماتك",
      "الاعتراض: الاعتراض على معالجة معلوماتك",
      "قابلية النقل: تلقي معلوماتك بتنسيق منظم وقابل للنقل"
    ], 
    rightsActionText: "لممارسة هذه الحقوق، يرجى الاتصال بنا باستخدام المعلومات المقدمة في نهاية هذه السياسة.", 
    transfersText: "نحن نعمل دوليًا وقد ننقل معلوماتك إلى بلدان غير بلدك. عندما نقوم بذلك، نتخذ خطوات لضمان حصول معلوماتك على مستوى كافٍ من الحماية.", 
    retentionText: "نحتفظ بمعلوماتك طالما كان ذلك ضروريًا للأغراض المذكورة في هذه السياسة، ما لم تكن فترة احتفاظ أطول مطلوبة أو مسموح بها بموجب القانون.", 
    changesText: "قد نقوم بتحديث سياسة الخصوصية هذه من وقت لآخر. سنخطرك بأي تغييرات جوهرية من خلال نشر السياسة الجديدة على منصتنا أو من خلال وسائل مناسبة أخرى. نشجعك على مراجعة هذه السياسة بشكل دوري للبقاء على اطلاع بكيفية حمايتنا لمعلوماتك.", 
    contactText: "إذا كانت لديك أي أسئلة أو مخاوف بشأن سياسة الخصوصية هذه أو ممارسات الخصوصية لدينا، فيرجى الاتصال بنا على:", 
    contactAddress: "Elysium Media FZCO\nID: 58510, Premises no. 58510 - 001\nIFZA Business Park, DDP\nDUBAI, United Arab Emirates", 
    lawText: "تخضع سياسة الخصوصية هذه وتفسر وفقًا لقوانين دبي، الإمارات العربية المتحدة، وتخضع أي نزاعات تتعلق بهذه السياسة للاختصاص القضائي الحصري لمحاكم دبي."
  },
  pt: { 
    privacyPolicyTitle: "Política de Privacidade", 
    lastUpdated: "Última atualização: 2 de abril de 2021", 
    contentIndex: "Conteúdo", 
    section1Title: "1. Introdução", 
    section2Title: "2. Informações que Coletamos", 
    section3Title: "3. Como Usamos as Informações", 
    section4Title: "4. Compartilhamento e Divulgação de Informações", 
    section5Title: "5. Segurança das Informações", 
    section6Title: "6. Direitos de Privacidade", 
    section7Title: "7. Transferências Internacionais de Dados", 
    section8Title: "8. Retenção de Dados", 
    section9Title: "9. Alterações nesta Política", 
    section10Title: "10. Contato", 
    section11Title: "11. Lei Aplicável", 
    introText: `Na ${APP_NAME}, operada pela Elysium Media FZCO, valorizamos e respeitamos sua privacidade. Esta Política de Privacidade explica como coletamos, usamos, compartilhamos e protegemos informações quando você usa nossa plataforma descentralizada. Ao usar a ${APP_NAME}, você concorda com as práticas descritas neste documento.`, 
    information1Title: "2.1 Informações da Blockchain:", 
    information1Text: `Como um aplicativo descentralizado (dApp), a ${APP_NAME} interage diretamente com a blockchain. Coletamos e processamos informações disponíveis publicamente na blockchain, incluindo endereços de carteira, transações e dados de posição de liquidez.`, 
    information2Title: "2.2 Informações de Uso:", 
    information2Text: "Coletamos dados sobre como você interage com nossa plataforma, incluindo:", 
    information2List: [
      "Padrões de uso e atividade na plataforma",
      "Informações técnicas como tipo de dispositivo, navegador e sistema operacional",
      "Dados de registro e erros",
      "Métricas de desempenho e análises"
    ], 
    information3Title: "2.3 Informações de Comunicação:", 
    information3Text: "Se você se comunicar conosco, poderemos coletar as informações que você fornecer nessas comunicações.", 
    usageText: "Usamos as informações coletadas para:", 
    usageList: [
      "Fornecer, manter e melhorar nossa plataforma",
      "Otimizar os algoritmos de gerenciamento de liquidez",
      "Desenvolver novos recursos e serviços",
      "Analisar tendências e padrões de uso",
      "Detectar, prevenir e resolver problemas técnicos e de segurança",
      "Cumprir obrigações legais e proteger nossos direitos"
    ], 
    sharing1Title: "4.1 Natureza da Blockchain:", 
    sharing1Text: "É importante entender que, devido à natureza da blockchain, transações e endereços de carteira são informações públicas visíveis na blockchain.", 
    sharing2Title: "4.2 Compartilhamento com Terceiros:", 
    sharing2Text: "Podemos compartilhar informações com:", 
    sharing2List: [
      "Provedores de serviços que nos ajudam a operar, manter e melhorar nossa plataforma",
      "Consultores profissionais, como advogados e auditores",
      "Autoridades reguladoras, entidades governamentais e outras partes, quando exigido por lei",
      "Em caso de fusão, venda ou transferência de ativos, com a parte adquirente"
    ], 
    sharing3Title: "4.3 Informações Agregadas ou Anonimizadas:", 
    sharing3Text: "Podemos usar e compartilhar informações agregadas ou anonimizadas (que não identificam usuários individuais) para qualquer finalidade, incluindo análise de mercado, melhoria de serviço e comunicações de marketing.", 
    security1Text: "Implementamos medidas de segurança técnicas, administrativas e físicas para proteger as informações que coletamos e processamos. No entanto, nenhum sistema é completamente seguro, e não podemos garantir a segurança absoluta de suas informações.", 
    security2Title: "5.1 Segurança de Seus Ativos:", 
    security2Text: `A ${APP_NAME} opera como uma plataforma não-custodial, o que significa que não armazenamos chaves privadas nem temos acesso direto aos ativos digitais dos usuários. Você mantém controle total sobre seus ativos a todo momento.`, 
    rightsText: "Dependendo da sua jurisdição, você pode ter certos direitos em relação às suas informações pessoais, incluindo:", 
    rightsList: [
      "Acesso: Solicitar cópias de suas informações pessoais",
      "Retificação: Corrigir informações imprecisas",
      "Exclusão: Solicitar a exclusão de suas informações pessoais",
      "Restrição: Limitar o processamento de suas informações",
      "Objeção: Opor-se ao processamento de suas informações",
      "Portabilidade: Receber suas informações em formato estruturado e transferível"
    ], 
    rightsActionText: "Para exercer esses direitos, entre em contato conosco usando as informações fornecidas no final desta política.", 
    transfersText: "Operamos internacionalmente e podemos transferir suas informações para países diferentes do seu. Quando o fazemos, tomamos medidas para garantir que suas informações recebam um nível adequado de proteção.", 
    retentionText: "Retemos suas informações pelo tempo necessário para os fins descritos nesta política, a menos que um período de retenção mais longo seja exigido ou permitido por lei.", 
    changesText: "Podemos atualizar esta Política de Privacidade de tempos em tempos. Notificaremos você sobre quaisquer alterações materiais publicando a nova política em nossa plataforma ou por outros meios apropriados. Encorajamos você a revisar esta política periodicamente para se manter informado sobre como protegemos suas informações.", 
    contactText: "Se você tiver dúvidas ou preocupações sobre esta Política de Privacidade ou nossas práticas de privacidade, entre em contato conosco em:", 
    contactAddress: "Elysium Media FZCO\nID: 58510, Premises no. 58510 - 001\nIFZA Business Park, DDP\nDUBAI, United Arab Emirates", 
    lawText: "Esta Política de Privacidade é regida e interpretada de acordo com as leis de Dubai, Emirados Árabes Unidos, e quaisquer disputas relacionadas a esta política estarão sujeitas à jurisdição exclusiva dos tribunais de Dubai."
  },
  it: { 
    privacyPolicyTitle: "Politica sulla Privacy", 
    lastUpdated: "Ultimo aggiornamento: 2 aprile 2021", 
    contentIndex: "Contenuti", 
    section1Title: "1. Introduzione", 
    section2Title: "2. Informazioni che raccogliamo", 
    section3Title: "3. Come utilizziamo le informazioni", 
    section4Title: "4. Condivisione e divulgazione delle informazioni", 
    section5Title: "5. Sicurezza delle informazioni", 
    section6Title: "6. Diritti sulla privacy", 
    section7Title: "7. Trasferimenti internazionali di dati", 
    section8Title: "8. Conservazione dei dati", 
    section9Title: "9. Modifiche a questa politica", 
    section10Title: "10. Contatti", 
    section11Title: "11. Legge applicabile", 
    introText: `In ${APP_NAME}, gestito da Elysium Media FZCO, valorizziamo e rispettiamo la tua privacy. Questa Politica sulla Privacy spiega come raccogliamo, utilizziamo, condividiamo e proteggiamo le informazioni quando utilizzi la nostra piattaforma decentralizzata. Utilizzando ${APP_NAME}, accetti le pratiche descritte in questo documento.`, 
    information1Title: "2.1 Informazioni della blockchain:", 
    information1Text: `Come applicazione decentralizzata (dApp), ${APP_NAME} interagisce direttamente con la blockchain. Raccogliamo ed elaboriamo informazioni disponibili pubblicamente sulla blockchain, inclusi indirizzi di wallet, transazioni e dati sulle posizioni di liquidità.`, 
    information2Title: "2.2 Informazioni sull'utilizzo:", 
    information2Text: "Raccogliamo dati su come interagisci con la nostra piattaforma, tra cui:", 
    information2List: [
      "Modelli di utilizzo e attività sulla piattaforma",
      "Informazioni tecniche come tipo di dispositivo, browser e sistema operativo",
      "Dati di registro ed errori",
      "Metriche di prestazione e analisi"
    ], 
    information3Title: "2.3 Informazioni di comunicazione:", 
    information3Text: "Se comunichi con noi, potremmo raccogliere le informazioni che fornisci in tali comunicazioni.", 
    usageText: "Utilizziamo le informazioni raccolte per:", 
    usageList: [
      "Fornire, mantenere e migliorare la nostra piattaforma",
      "Ottimizzare gli algoritmi di gestione della liquidità",
      "Sviluppare nuove funzionalità e servizi",
      "Analizzare tendenze e modelli di utilizzo",
      "Rilevare, prevenire e affrontare problemi tecnici e di sicurezza",
      "Adempiere agli obblighi legali e proteggere i nostri diritti"
    ], 
    sharing1Title: "4.1 Natura della blockchain:", 
    sharing1Text: "È importante comprendere che a causa della natura della blockchain, le transazioni e gli indirizzi del wallet sono informazioni pubbliche visibili sulla blockchain.", 
    sharing2Title: "4.2 Condivisione con terze parti:", 
    sharing2Text: "Potremmo condividere informazioni con:", 
    sharing2List: [
      "Fornitori di servizi che ci aiutano a gestire, mantenere e migliorare la nostra piattaforma",
      "Consulenti professionali, come avvocati e revisori",
      "Autorità di regolamentazione, enti governativi e altre parti, quando richiesto dalla legge",
      "In caso di fusione, vendita o trasferimento di attività, con la parte acquirente"
    ], 
    sharing3Title: "4.3 Informazioni aggregate o anonimizzate:", 
    sharing3Text: "Potremmo utilizzare e condividere informazioni aggregate o anonimizzate (che non identificano singoli utenti) per qualsiasi scopo, incluse analisi di mercato, miglioramento dei servizi e comunicazioni di marketing.", 
    security1Text: "Implementiamo misure di sicurezza tecniche, amministrative e fisiche per proteggere le informazioni che raccogliamo ed elaboriamo. Tuttavia, nessun sistema è completamente sicuro, e non possiamo garantire la sicurezza assoluta delle tue informazioni.", 
    security2Title: "5.1 Sicurezza dei tuoi asset:", 
    security2Text: `${APP_NAME} opera come piattaforma non-custodial, il che significa che non memorizziamo chiavi private né abbiamo accesso diretto agli asset digitali degli utenti. Mantieni il pieno controllo dei tuoi asset in ogni momento.`, 
    rightsText: "A seconda della tua giurisdizione, potresti avere determinati diritti riguardo alle tue informazioni personali, tra cui:", 
    rightsList: [
      "Accesso: Richiedere copie delle tue informazioni personali",
      "Rettifica: Correggere informazioni imprecise",
      "Cancellazione: Richiedere l'eliminazione delle tue informazioni personali",
      "Restrizione: Limitare il trattamento delle tue informazioni",
      "Obiezione: Opporsi al trattamento delle tue informazioni",
      "Portabilità: Ricevere le tue informazioni in un formato strutturato e trasferibile"
    ], 
    rightsActionText: "Per esercitare questi diritti, contattaci utilizzando le informazioni fornite alla fine di questa politica.", 
    transfersText: "Operiamo a livello internazionale e potremmo trasferire le tue informazioni in paesi diversi dal tuo. Quando lo facciamo, adottiamo misure per garantire che le tue informazioni ricevano un livello adeguato di protezione.", 
    retentionText: "Conserviamo le tue informazioni per il tempo necessario per le finalità descritte in questa politica, a meno che un periodo di conservazione più lungo non sia richiesto o consentito dalla legge.", 
    changesText: "Potremmo aggiornare questa Politica sulla Privacy di tanto in tanto. Ti informeremo di eventuali modifiche sostanziali pubblicando la nuova politica sulla nostra piattaforma o attraverso altri mezzi appropriati. Ti incoraggiamo a rivedere periodicamente questa politica per rimanere informato su come proteggiamo le tue informazioni.", 
    contactText: "Se hai domande o dubbi riguardo questa Politica sulla Privacy o le nostre pratiche sulla privacy, contattaci a:", 
    contactAddress: "Elysium Media FZCO\nID: 58510, Premises no. 58510 - 001\nIFZA Business Park, DDP\nDUBAI, United Arab Emirates", 
    lawText: "Questa Politica sulla Privacy è regolata e interpretata in conformità con le leggi di Dubai, Emirati Arabi Uniti, e qualsiasi controversia relativa a questa politica sarà soggetta alla giurisdizione esclusiva dei tribunali di Dubai."
  },
  de: { 
    privacyPolicyTitle: "Datenschutzrichtlinie", 
    lastUpdated: "Zuletzt aktualisiert: 2. April 2021", 
    contentIndex: "Inhalt", 
    section1Title: "1. Einführung", 
    section2Title: "2. Informationen, die wir sammeln", 
    section3Title: "3. Wie wir Informationen verwenden", 
    section4Title: "4. Informationsaustausch und Offenlegung", 
    section5Title: "5. Informationssicherheit", 
    section6Title: "6. Datenschutzrechte", 
    section7Title: "7. Internationale Datenübertragungen", 
    section8Title: "8. Datenspeicherung", 
    section9Title: "9. Änderungen dieser Richtlinie", 
    section10Title: "10. Kontakt", 
    section11Title: "11. Anwendbares Recht", 
    introText: `Bei ${APP_NAME}, betrieben von Elysium Media FZCO, schätzen und respektieren wir Ihre Privatsphäre. Diese Datenschutzrichtlinie erklärt, wie wir Informationen sammeln, verwenden, teilen und schützen, wenn Sie unsere dezentrale Plattform nutzen. Durch die Nutzung von ${APP_NAME} stimmen Sie den in diesem Dokument beschriebenen Praktiken zu.`, 
    information1Title: "2.1 Blockchain-Informationen:", 
    information1Text: `Als dezentrale Anwendung (dApp) interagiert ${APP_NAME} direkt mit der Blockchain. Wir sammeln und verarbeiten öffentlich verfügbare Informationen auf der Blockchain, einschließlich Wallet-Adressen, Transaktionen und Liquiditätspositionsdaten.`, 
    information2Title: "2.2 Nutzungsinformationen:", 
    information2Text: "Wir sammeln Daten darüber, wie Sie mit unserer Plattform interagieren, einschließlich:", 
    information2List: [
      "Nutzungsmuster und Aktivitäten auf der Plattform",
      "Technische Informationen wie Gerätetyp, Browser und Betriebssystem",
      "Protokolldaten und Fehler",
      "Leistungsmetriken und Analysen"
    ], 
    information3Title: "2.3 Kommunikationsinformationen:", 
    information3Text: "Wenn Sie mit uns kommunizieren, können wir die Informationen sammeln, die Sie in diesen Kommunikationen bereitstellen.", 
    usageText: "Wir verwenden die gesammelten Informationen für:", 
    usageList: [
      "Bereitstellung, Wartung und Verbesserung unserer Plattform",
      "Optimierung der Liquiditätsmanagement-Algorithmen",
      "Entwicklung neuer Funktionen und Dienste",
      "Analyse von Trends und Nutzungsmustern",
      "Erkennung, Verhinderung und Behebung technischer und Sicherheitsprobleme",
      "Erfüllung rechtlicher Verpflichtungen und Schutz unserer Rechte"
    ], 
    sharing1Title: "4.1 Natur der Blockchain:", 
    sharing1Text: "Es ist wichtig zu verstehen, dass aufgrund der Natur der Blockchain Transaktionen und Wallet-Adressen öffentliche Informationen sind, die auf der Blockchain sichtbar sind.", 
    sharing2Title: "4.2 Teilen mit Dritten:", 
    sharing2Text: "Wir können Informationen teilen mit:", 
    sharing2List: [
      "Dienstleistern, die uns beim Betrieb, der Wartung und Verbesserung unserer Plattform helfen",
      "Professionellen Beratern wie Anwälten und Wirtschaftsprüfern",
      "Regulierungsbehörden, staatlichen Stellen und anderen Parteien, wenn dies gesetzlich vorgeschrieben ist",
      "Im Falle einer Fusion, eines Verkaufs oder einer Übertragung von Vermögenswerten, mit der erwerbenden Partei"
    ], 
    sharing3Title: "4.3 Aggregierte oder anonymisierte Informationen:", 
    sharing3Text: "Wir können aggregierte oder anonymisierte Informationen (die keine einzelnen Benutzer identifizieren) für jeden Zweck verwenden und teilen, einschließlich Marktanalyse, Serviceverbesserung und Marketingkommunikation.", 
    security1Text: "Wir implementieren technische, administrative und physische Sicherheitsmaßnahmen, um die Informationen zu schützen, die wir sammeln und verarbeiten. Allerdings ist kein System vollständig sicher, und wir können die absolute Sicherheit Ihrer Informationen nicht garantieren.", 
    security2Title: "5.1 Sicherheit Ihrer Vermögenswerte:", 
    security2Text: `${APP_NAME} ist eine nicht-verwaltende Plattform, was bedeutet, dass wir keine privaten Schlüssel speichern oder direkten Zugriff auf die digitalen Vermögenswerte der Benutzer haben. Sie behalten jederzeit die volle Kontrolle über Ihre Vermögenswerte.`, 
    rightsText: "Je nach Ihrer Gerichtsbarkeit haben Sie möglicherweise bestimmte Rechte bezüglich Ihrer persönlichen Informationen, darunter:", 
    rightsList: [
      "Zugang: Kopien Ihrer persönlichen Informationen anfordern",
      "Berichtigung: Ungenaue Informationen korrigieren",
      "Löschung: Löschung Ihrer persönlichen Informationen beantragen",
      "Einschränkung: Einschränkung der Verarbeitung Ihrer Informationen",
      "Widerspruch: Widerspruch gegen die Verarbeitung Ihrer Informationen",
      "Übertragbarkeit: Erhalt Ihrer Informationen in einem strukturierten, übertragbaren Format"
    ], 
    rightsActionText: "Um diese Rechte auszuüben, kontaktieren Sie uns bitte über die am Ende dieser Richtlinie angegebenen Informationen.", 
    transfersText: "Wir operieren international und können Ihre Informationen in andere Länder als Ihr eigenes übertragen. Wenn wir dies tun, ergreifen wir Maßnahmen, um sicherzustellen, dass Ihre Informationen ein angemessenes Schutzniveau erhalten.", 
    retentionText: "Wir bewahren Ihre Informationen so lange auf, wie es für die in dieser Richtlinie dargelegten Zwecke erforderlich ist, es sei denn, ein längerer Aufbewahrungszeitraum ist gesetzlich vorgeschrieben oder zulässig.", 
    changesText: "Wir können diese Datenschutzrichtlinie von Zeit zu Zeit aktualisieren. Wir werden Sie über wesentliche Änderungen informieren, indem wir die neue Richtlinie auf unserer Plattform oder durch andere geeignete Mittel veröffentlichen. Wir empfehlen Ihnen, diese Richtlinie regelmäßig zu überprüfen, um darüber informiert zu bleiben, wie wir Ihre Informationen schützen.", 
    contactText: "Wenn Sie Fragen oder Bedenken zu dieser Datenschutzrichtlinie oder unseren Datenschutzpraktiken haben, kontaktieren Sie uns bitte unter:", 
    contactAddress: "Elysium Media FZCO\nID: 58510, Premises no. 58510 - 001\nIFZA Business Park, DDP\nDUBAI, United Arab Emirates", 
    lawText: "Diese Datenschutzrichtlinie unterliegt den Gesetzen von Dubai, Vereinigte Arabische Emirate, und wird in Übereinstimmung mit diesen ausgelegt, und alle Streitigkeiten im Zusammenhang mit dieser Richtlinie unterliegen der ausschließlichen Zuständigkeit der Gerichte von Dubai."
  },
  hi: { 
    privacyPolicyTitle: "गोपनीयता नीति", 
    lastUpdated: "अंतिम अपडेट: 2 अप्रैल, 2021", 
    contentIndex: "विषय-सूची", 
    section1Title: "1. परिचय", 
    section2Title: "2. हम जो जानकारी एकत्र करते हैं", 
    section3Title: "3. हम जानकारी का उपयोग कैसे करते हैं", 
    section4Title: "4. जानकारी साझाकरण और प्रकटीकरण", 
    section5Title: "5. जानकारी सुरक्षा", 
    section6Title: "6. गोपनीयता अधिकार", 
    section7Title: "7. अंतरराष्ट्रीय डेटा स्थानांतरण", 
    section8Title: "8. डेटा प्रतिधारण", 
    section9Title: "9. इस नीति में परिवर्तन", 
    section10Title: "10. संपर्क", 
    section11Title: "11. लागू कानून", 
    introText: `एलिसियम मीडिया FZCO द्वारा संचालित ${APP_NAME} में, हम आपकी गोपनीयता का सम्मान और मूल्य देते हैं। यह गोपनीयता नीति बताती है कि हम कैसे जानकारी एकत्र, उपयोग, साझा और सुरक्षित करते हैं जब आप हमारे विकेंद्रीकृत प्लेटफॉर्म का उपयोग करते हैं। ${APP_NAME} का उपयोग करके, आप इस दस्तावेज़ में वर्णित प्रथाओं से सहमत होते हैं।`, 
    information1Title: "2.1 ब्लॉकचेन जानकारी:", 
    information1Text: `एक विकेंद्रीकृत एप्लिकेशन (dApp) के रूप में, ${APP_NAME} सीधे ब्लॉकचेन के साथ इंटरैक्ट करता है। हम ब्लॉकचेन पर सार्वजनिक रूप से उपलब्ध जानकारी एकत्र और प्रोसेस करते हैं, जिसमें वॉलेट पते, लेनदेन और लिक्विडिटी पोजीशन डेटा शामिल हैं।`, 
    information2Title: "2.2 उपयोग जानकारी:", 
    information2Text: "हम इस बारे में डेटा एकत्र करते हैं कि आप हमारे प्लेटफॉर्म के साथ कैसे इंटरैक्ट करते हैं, जिसमें शामिल हैं:", 
    information2List: [
      "प्लेटफॉर्म पर उपयोग पैटर्न और गतिविधि",
      "डिवाइस प्रकार, ब्राउज़र और ऑपरेटिंग सिस्टम जैसी तकनीकी जानकारी",
      "लॉग डेटा और त्रुटियां",
      "प्रदर्शन मैट्रिक्स और एनालिटिक्स"
    ], 
    information3Title: "2.3 संचार जानकारी:", 
    information3Text: "यदि आप हमारे साथ संवाद करते हैं, तो हम उन संचारों में आपके द्वारा प्रदान की गई जानकारी एकत्र कर सकते हैं।", 
    usageText: "हम एकत्रित जानकारी का उपयोग इसके लिए करते हैं:", 
    usageList: [
      "हमारे प्लेटफॉर्म को प्रदान करना, बनाए रखना और सुधारना",
      "लिक्विडिटी प्रबंधन एल्गोरिदम को अनुकूलित करना",
      "नई सुविधाओं और सेवाओं का विकास करना",
      "रुझानों और उपयोग पैटर्न का विश्लेषण करना",
      "तकनीकी और सुरक्षा समस्याओं का पता लगाना, रोकना और हल करना",
      "कानूनी दायित्वों का पालन करना और हमारे अधिकारों की रक्षा करना"
    ], 
    sharing1Title: "4.1 ब्लॉकचेन की प्रकृति:", 
    sharing1Text: "यह समझना महत्वपूर्ण है कि ब्लॉकचेन की प्रकृति के कारण, लेनदेन और वॉलेट पते ब्लॉकचेन पर दिखाई देने वाली सार्वजनिक जानकारी हैं।", 
    sharing2Title: "4.2 तीसरे पक्षों के साथ साझाकरण:", 
    sharing2Text: "हम इनके साथ जानकारी साझा कर सकते हैं:", 
    sharing2List: [
      "सेवा प्रदाता जो हमारे प्लेटफॉर्म को संचालित, बनाए रखने और सुधारने में मदद करते हैं",
      "वकील और ऑडिटर जैसे पेशेवर सलाहकार",
      "नियामक प्राधिकरण, सरकारी संस्थाएं और अन्य पक्ष, जब कानून द्वारा आवश्यक हो",
      "विलय, बिक्री या संपत्ति के हस्तांतरण के मामले में, अधिग्रहणकर्ता पक्ष के साथ"
    ], 
    sharing3Title: "4.3 एकत्रित या अनामित जानकारी:", 
    sharing3Text: "हम एकत्रित या अनामित जानकारी (जो व्यक्तिगत उपयोगकर्ताओं की पहचान नहीं करती) का उपयोग और साझा किसी भी उद्देश्य के लिए कर सकते हैं, जिसमें बाजार विश्लेषण, सेवा सुधार और मार्केटिंग संचार शामिल हैं।", 
    security1Text: "हम हमारे द्वारा एकत्र और प्रोसेस की जाने वाली जानकारी की रक्षा के लिए तकनीकी, प्रशासनिक और भौतिक सुरक्षा उपाय लागू करते हैं। हालांकि, कोई भी सिस्टम पूरी तरह से सुरक्षित नहीं है, और हम आपकी जानकारी की पूर्ण सुरक्षा की गारंटी नहीं दे सकते हैं।", 
    security2Title: "5.1 आपकी संपत्ति की सुरक्षा:", 
    security2Text: `${APP_NAME} एक गैर-कस्टोडियल प्लेटफॉर्म के रूप में काम करता है, जिसका अर्थ है कि हम प्राइवेट की स्टोर नहीं करते हैं या उपयोगकर्ताओं की डिजिटल संपत्तियों तक सीधे पहुंच नहीं रखते हैं। आप हर समय अपनी संपत्तियों पर पूर्ण नियंत्रण रखते हैं।`, 
    rightsText: "आपके न्यायाधिकार के आधार पर, आपके पास अपनी व्यक्तिगत जानकारी के संबंध में कुछ अधिकार हो सकते हैं, जिनमें शामिल हैं:", 
    rightsList: [
      "पहुंच: अपनी व्यक्तिगत जानकारी की प्रतियां अनुरोध करना",
      "सुधार: अशुद्ध जानकारी को सही करना",
      "हटाना: अपनी व्यक्तिगत जानकारी को हटाने का अनुरोध करना",
      "प्रतिबंध: अपनी जानकारी के प्रोसेसिंग को सीमित करना",
      "आपत्ति: अपनी जानकारी के प्रोसेसिंग का विरोध करना",
      "पोर्टेबिलिटी: अपनी जानकारी को संरचित और हस्तांतरणीय प्रारूप में प्राप्त करना"
    ], 
    rightsActionText: "इन अधिकारों का प्रयोग करने के लिए, कृपया इस नीति के अंत में प्रदान की गई जानकारी का उपयोग करके हमसे संपर्क करें।", 
    transfersText: "हम अंतरराष्ट्रीय स्तर पर संचालित करते हैं और आपकी जानकारी को आपके देश से अलग देशों में स्थानांतरित कर सकते हैं। जब हम ऐसा करते हैं, तो हम यह सुनिश्चित करने के लिए कदम उठाते हैं कि आपकी जानकारी को पर्याप्त स्तर का संरक्षण मिले।", 
    retentionText: "हम आपकी जानकारी को इस नीति में वर्णित उद्देश्यों के लिए आवश्यक समय तक बनाए रखते हैं, जब तक कि कानून द्वारा लंबी अवधि की प्रतिधारण आवश्यक या अनुमति नहीं दी जाती है।", 
    changesText: "हम समय-समय पर इस गोपनीयता नीति को अपडेट कर सकते हैं। हम आपको किसी भी महत्वपूर्ण परिवर्तन के बारे में हमारे प्लेटफॉर्म पर नई नीति प्रकाशित करके या अन्य उपयुक्त साधनों से सूचित करेंगे। हम आपको इस नीति को समय-समय पर समीक्षा करने के लिए प्रोत्साहित करते हैं ताकि आप इस बारे में जानकारी रख सकें कि हम आपकी जानकारी की रक्षा कैसे करते हैं।", 
    contactText: "यदि आपके पास इस गोपनीयता नीति या हमारी गोपनीयता प्रथाओं के बारे में कोई प्रश्न या चिंताएं हैं, तो कृपया हमसे यहां संपर्क करें:", 
    contactAddress: "Elysium Media FZCO\nID: 58510, Premises no. 58510 - 001\nIFZA Business Park, DDP\nDUBAI, United Arab Emirates", 
    lawText: "यह गोपनीयता नीति दुबई, संयुक्त अरब अमीरात के कानूनों के अनुसार शासित और व्याख्या की जाती है, और इस नीति से संबंधित कोई भी विवाद दुबई के न्यायालयों के विशेष अधिकार क्षेत्र के अधीन होगा।"
  },
  zh: { 
    privacyPolicyTitle: "隐私政策", 
    lastUpdated: "最后更新：2021年4月2日", 
    contentIndex: "目录", 
    section1Title: "1. 简介", 
    section2Title: "2. 我们收集的信息", 
    section3Title: "3. 我们如何使用信息", 
    section4Title: "4. 信息共享和披露", 
    section5Title: "5. 信息安全", 
    section6Title: "6. 隐私权", 
    section7Title: "7. 国际数据传输", 
    section8Title: "8. 数据保留", 
    section9Title: "9. 本政策的变更", 
    section10Title: "10. 联系我们", 
    section11Title: "11. 适用法律", 
    introText: `在由Elysium Media FZCO运营的${APP_NAME}，我们重视并尊重您的隐私。本隐私政策解释了我们在您使用我们的去中心化平台时如何收集、使用、共享和保护信息。使用${APP_NAME}，即表示您同意本文档中描述的做法。`, 
    information1Title: "2.1 区块链信息：", 
    information1Text: `作为去中心化应用（dApp），${APP_NAME}直接与区块链交互。我们收集和处理区块链上公开可用的信息，包括钱包地址、交易和流动性头寸数据。`, 
    information2Title: "2.2 使用信息：", 
    information2Text: "我们收集有关您如何与我们的平台交互的数据，包括：", 
    information2List: [
      "平台上的使用模式和活动",
      "技术信息，如设备类型、浏览器和操作系统",
      "日志数据和错误",
      "性能指标和分析"
    ], 
    information3Title: "2.3 通信信息：", 
    information3Text: "如果您与我们交流，我们可能会收集您在这些通信中提供的信息。", 
    usageText: "我们使用收集的信息：", 
    usageList: [
      "提供、维护和改进我们的平台",
      "优化流动性管理算法",
      "开发新功能和服务",
      "分析趋势和使用模式",
      "检测、预防和解决技术和安全问题",
      "履行法律义务并保护我们的权利"
    ], 
    sharing1Title: "4.1 区块链的性质：", 
    sharing1Text: "重要的是要理解，由于区块链的性质，交易和钱包地址是在区块链上可见的公共信息。", 
    sharing2Title: "4.2 与第三方共享：", 
    sharing2Text: "我们可能会与以下方面共享信息：", 
    sharing2List: [
      "帮助我们运营、维护和改进我们平台的服务提供商",
      "专业顾问，如律师和审计师",
      "法律要求时的监管机构、政府实体和其他方",
      "在合并、出售或资产转让的情况下，与收购方"
    ], 
    sharing3Title: "4.3 汇总或匿名信息：", 
    sharing3Text: "我们可能会出于任何目的使用和共享汇总或匿名信息（不识别个人用户），包括市场分析、服务改进和营销通信。", 
    security1Text: "我们实施技术、管理和物理安全措施，以保护我们收集和处理的信息。然而，没有任何系统是完全安全的，我们不能保证您信息的绝对安全。", 
    security2Title: "5.1 您资产的安全：", 
    security2Text: `${APP_NAME}作为非托管平台运营，这意味着我们不存储私钥，也不直接访问用户的数字资产。您始终保持对资产的完全控制。`, 
    rightsText: "根据您的司法管辖区，您可能对您的个人信息拥有某些权利，包括：", 
    rightsList: [
      "访问：请求您个人信息的副本",
      "纠正：更正不准确的信息",
      "删除：请求删除您的个人信息",
      "限制：限制处理您的信息",
      "反对：反对处理您的信息",
      "可移植性：以结构化和可转让的格式接收您的信息"
    ], 
    rightsActionText: "要行使这些权利，请使用本政策末尾提供的信息联系我们。", 
    transfersText: "我们在国际上运营，可能会将您的信息传输到不同于您所在国家的国家。当我们这样做时，我们会采取措施确保您的信息获得充分的保护级别。", 
    retentionText: "我们将按照本政策中所述的目的所需的时间保留您的信息，除非法律要求或允许更长的保留期。", 
    changesText: "我们可能会不时更新本隐私政策。我们将通过在我们的平台上发布新政策或通过其他适当方式通知您任何重大变更。我们鼓励您定期审阅本政策，以了解我们如何保护您的信息。", 
    contactText: "如果您对本隐私政策或我们的隐私做法有任何问题或疑虑，请通过以下方式联系我们：", 
    contactAddress: "Elysium Media FZCO\nID: 58510, Premises no. 58510 - 001\nIFZA Business Park, DDP\nDUBAI, United Arab Emirates", 
    lawText: "本隐私政策受阿拉伯联合酋长国迪拜法律管辖并按其解释，与本政策有关的任何争议将受迪拜法院的专属管辖权管辖。"
  }
};

// Traducciones para la página de disclaimer
export const disclaimerTranslations: Record<Language, DisclaimerTranslations> = {
  es: {
    disclaimerTitle: "Aviso Legal",
    lastUpdated: "Última actualización: 2 de abril de 2021",
    contentIndex: "Contenido",
    section1Title: "1. Aceptación del Aviso Legal",
    section2Title: "2. Naturaleza de la Plataforma",
    section3Title: "3. Riesgos de Inversión",
    section4Title: "4. No Asesoramiento Financiero",
    section5Title: "5. Limitación de Responsabilidad",
    section6Title: "6. Mecanismo No Custodial",
    section7Title: "7. Precisión de la Información",
    section8Title: "8. Cumplimiento Normativo",
    section9Title: "9. Cambios en el Aviso Legal",
    section10Title: "10. Ley Aplicable",
    section11Title: "11. Contacto",

    // Contenido de sección 1
    section1_1Title: "1.1 Términos de Uso:",
    section1_1Content: `Al acceder o utilizar ${APP_NAME}, acepta estar legalmente vinculado por este Aviso Legal. Si no está de acuerdo con alguno de los términos, debe dejar de usar la plataforma inmediatamente.`,
    section1_2Title: "1.2 Capacidad Legal:",
    section1_2Content: "Al usar nuestra plataforma, usted declara que tiene la capacidad legal para aceptar estos términos y que tiene al menos 18 años de edad.",

    // Contenido de sección 2
    section2_1Title: "2.1 Descripción del Servicio:",
    section2_1Content: `${APP_NAME} es una plataforma descentralizada que facilita la optimización de liquidez en protocolos DeFi como Uniswap. Proporcionamos herramientas para gestionar posiciones de liquidez concentrada, pero no tenemos control directo sobre los protocolos subyacentes.`,
    section2_2Title: "2.2 Carácter Experimental:",
    section2_2Content: `Usted reconoce que la tecnología blockchain, DeFi y los contratos inteligentes son experimentales. ${APP_NAME} opera en un espacio tecnológico en evolución que conlleva riesgos tecnológicos significativos.`,

    // Contenido de sección 3
    section3_1Title: "3.1 Riesgo Inherente:",
    section3_1Content: "Todas las actividades relacionadas con criptomonedas, incluyendo el suministro de liquidez, implican un alto riesgo. El valor de las criptomonedas puede fluctuar significativamente y podría perder parte o la totalidad de su inversión.",
    section3_2Title: "3.2 Pérdida Impermanente:",
    section3_2Content: "A pesar de nuestros algoritmos de optimización, la pérdida impermanente es un riesgo inherente al proporcionar liquidez. Nuestras estrategias buscan minimizar, pero no pueden eliminar completamente este riesgo.",
    section3_3Title: "3.3 Riesgos Técnicos:",
    section3_3Content: "Existen riesgos asociados con los contratos inteligentes, fallos técnicos, errores y vulnerabilidades que podrían resultar en la pérdida de fondos.",

    // Contenido de sección 4
    section4_1Title: "4.1 Sin Recomendaciones:",
    section4_1Content: `La información proporcionada en ${APP_NAME} es solo para fines informativos y no constituye asesoramiento financiero, de inversión o fiscal. No recomendamos ninguna estrategia de inversión específica.`,
    section4_2Title: "4.2 Decisiones Independientes:",
    section4_2Content: "Debe tomar sus propias decisiones de inversión basadas en su investigación personal y considerar buscar asesoramiento de profesionales financieros calificados antes de realizar cualquier inversión.",

    // Contenido de sección 5
    section5_1Title: "5.1 Limitación de Garantías:",
    section5_1Content: `${APP_NAME} se proporciona 'tal cual' y 'según disponibilidad' sin garantías de ningún tipo, ya sean expresas o implícitas.`,
    section5_2Title: "5.2 Exclusión de Responsabilidad:",
    section5_2Content: "En la máxima medida permitida por la ley, no seremos responsables por ningún daño directo, indirecto, incidental, especial, consecuente o punitivo, o cualquier pérdida de beneficios o ingresos.",
    section5_3Title: "5.3 Riesgos Asumidos:",
    section5_3Content: "Usted asume todos los riesgos relacionados con el uso de nuestra plataforma, incluyendo pero no limitado a la volatilidad de precios de criptomonedas y posibles pérdidas financieras.",
    section5_4Title: "5.4 No Responsabilidad por Terceros:",
    section5_4Content: "No somos responsables por las acciones, contenido, información o datos de terceros, incluyendo otros usuarios o protocolos como Uniswap.",

    // Contenido de sección 6
    section6_1Title: "6.1 Control de Activos:",
    section6_1Content: `${APP_NAME} opera como una plataforma no custodial, lo que significa que no almacenamos ni tenemos acceso a las claves privadas, frases semilla, claves de recuperación u otros datos de acceso a los activos digitales de los usuarios.`,
    section6_2Title: "6.2 Responsabilidad del Usuario:",
    section6_2Content: "Usted mantiene pleno control y responsabilidad sobre sus activos digitales en todo momento. Es su responsabilidad exclusiva asegurar y proteger sus credenciales de acceso a la wallet y sus activos.",

    // Contenido de sección 7
    section7_1Title: "7.1 Esfuerzos de Exactitud:",
    section7_1Content: "Nos esforzamos por proporcionar información precisa y actualizada, sin embargo, no garantizamos la exactitud, integridad, actualidad o fiabilidad de cualquier información proporcionada en la plataforma.",
    section7_2Title: "7.2 Datos de Terceros:",
    section7_2Content: "Parte de la información mostrada en nuestra plataforma proviene de fuentes de terceros como oráculos de precios, protocolos DeFi y APIs de blockchain. No asumimos responsabilidad por errores o inexactitudes en estos datos.",

    // Contenido de sección 8
    section8_1Title: "8.1 Responsabilidad del Usuario:",
    section8_1Content: "Es su responsabilidad comprender y cumplir con todas las leyes, reglas y regulaciones aplicables en su jurisdicción con respecto al uso de criptomonedas y servicios DeFi.",
    section8_2Title: "8.2 Restricciones Jurisdiccionales:",
    section8_2Content: `El acceso a ${APP_NAME} puede no ser legal en ciertas jurisdicciones. Usted es responsable de determinar si le está permitido utilizar nuestra plataforma según las leyes de su jurisdicción.`,

    // Contenido de sección 9
    section9Content: `Nos reservamos el derecho de modificar este Aviso Legal en cualquier momento a nuestra discreción. Las modificaciones entrarán en vigor inmediatamente tras su publicación en la plataforma. Su uso continuado de ${APP_NAME} después de cualquier modificación constituirá su aceptación de los términos actualizados.`,

    // Contenido de sección 10
    section10Content: `Este Aviso Legal se rige e interpreta de acuerdo con las leyes de Dubai, Emiratos Árabes Unidos, sin consideración a sus disposiciones sobre conflictos de leyes. Cualquier disputa que surja en relación con este aviso o su uso de ${APP_NAME} estará sujeta a la jurisdicción exclusiva de los tribunales de Dubai.`,

    // Contenido de sección 11
    section11Content: "Si tiene alguna pregunta sobre este Aviso Legal, puede contactarnos en:",
    section11Address: "Elysium Media FZCO\nID: 58510, Premises no. 58510 - 001\nIFZA Business Park, DDP\nDUBAI, United Arab Emirates"
  },
  en: {
    disclaimerTitle: "Legal Disclaimer",
    lastUpdated: "Last updated: April 2, 2021",
    contentIndex: "Contents",
    section1Title: "1. Acceptance of the Disclaimer",
    section2Title: "2. Nature of the Platform",
    section3Title: "3. Investment Risks",
    section4Title: "4. No Financial Advice",
    section5Title: "5. Limitation of Liability",
    section6Title: "6. Non-Custodial Mechanism",
    section7Title: "7. Accuracy of Information",
    section8Title: "8. Regulatory Compliance",
    section9Title: "9. Changes to the Disclaimer",
    section10Title: "10. Applicable Law",
    section11Title: "11. Contact",

    // Section 1 content
    section1_1Title: "1.1 Terms of Use:",
    section1_1Content: "By accessing or using WayBank, you agree to be legally bound by this Legal Disclaimer. If you do not agree with any of the terms, you must stop using the platform immediately.",
    section1_2Title: "1.2 Legal Capacity:",
    section1_2Content: "By using our platform, you represent that you have the legal capacity to accept these terms and that you are at least 18 years of age.",

    // Section 2 content
    section2_1Title: "2.1 Service Description:",
    section2_1Content: `${APP_NAME} is a decentralized platform that facilitates liquidity optimization in DeFi protocols like Uniswap. We provide tools for managing concentrated liquidity positions, but we have no direct control over the underlying protocols.`,
    section2_2Title: "2.2 Experimental Nature:",
    section2_2Content: `You acknowledge that blockchain technology, DeFi, and smart contracts are experimental. ${APP_NAME} operates in an evolving technological space that carries significant technological risks.`,

    // Section 3 content
    section3_1Title: "3.1 Inherent Risk:",
    section3_1Content: "All cryptocurrency-related activities, including providing liquidity, involve high risk. Cryptocurrency values can fluctuate significantly, and you could lose part or all of your investment.",
    section3_2Title: "3.2 Impermanent Loss:",
    section3_2Content: "Despite our optimization algorithms, impermanent loss is an inherent risk when providing liquidity. Our strategies aim to minimize, but cannot completely eliminate this risk.",
    section3_3Title: "3.3 Technical Risks:",
    section3_3Content: "There are risks associated with smart contracts, technical failures, errors, and vulnerabilities that could result in loss of funds.",

    // Section 4 content
    section4_1Title: "4.1 No Recommendations:",
    section4_1Content: `The information provided on ${APP_NAME} is for informational purposes only and does not constitute financial, investment, or tax advice. We do not recommend any specific investment strategy.`,
    section4_2Title: "4.2 Independent Decisions:",
    section4_2Content: "You should make your own investment decisions based on your personal research and consider seeking advice from qualified financial professionals before making any investment.",

    // Section 5 content
    section5_1Title: "5.1 Limitation of Warranties:",
    section5_1Content: `${APP_NAME} is provided 'as is' and 'as available' without warranties of any kind, either express or implied.`,
    section5_2Title: "5.2 Exclusion of Liability:",
    section5_2Content: "To the maximum extent permitted by law, we will not be liable for any direct, indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues.",
    section5_3Title: "5.3 Assumed Risks:",
    section5_3Content: "You assume all risks related to the use of our platform, including but not limited to cryptocurrency price volatility and potential financial losses.",
    section5_4Title: "5.4 No Liability for Third Parties:",
    section5_4Content: "We are not responsible for the actions, content, information, or data of third parties, including other users or protocols like Uniswap.",

    // Section 6 content
    section6_1Title: "6.1 Asset Control:",
    section6_1Content: `${APP_NAME} operates as a non-custodial platform, meaning we do not store or have access to private keys, seed phrases, recovery keys, or other access data to users' digital assets.`,
    section6_2Title: "6.2 User Responsibility:",
    section6_2Content: "You maintain full control and responsibility for your digital assets at all times. It is your sole responsibility to secure and protect your wallet credentials and assets.",

    // Section 7 content
    section7_1Title: "7.1 Accuracy Efforts:",
    section7_1Content: "We strive to provide accurate and up-to-date information, however, we do not guarantee the accuracy, completeness, timeliness, or reliability of any information provided on the platform.",
    section7_2Title: "7.2 Third-Party Data:",
    section7_2Content: "Some of the information displayed on our platform comes from third-party sources such as price oracles, DeFi protocols, and blockchain APIs. We assume no responsibility for errors or inaccuracies in this data.",

    // Section 8 content
    section8_1Title: "8.1 User Responsibility:",
    section8_1Content: "It is your responsibility to understand and comply with all applicable laws, rules, and regulations in your jurisdiction regarding the use of cryptocurrencies and DeFi services.",
    section8_2Title: "8.2 Jurisdictional Restrictions:",
    section8_2Content: `Access to ${APP_NAME} may not be legal in certain jurisdictions. You are responsible for determining whether you are permitted to use our platform under the laws in your jurisdiction.`,

    // Section 9 content
    section9Content: `We reserve the right to modify this Legal Disclaimer at any time at our discretion. Modifications will be effective immediately upon posting to the platform. Your continued use of ${APP_NAME} after any modification constitutes your acceptance of the updated terms.`,

    // Section 10 content
    section10Content: `This Legal Disclaimer is governed by and construed in accordance with the laws of Dubai, United Arab Emirates, without regard to its conflict of law provisions. Any disputes arising in connection with this disclaimer or your use of ${APP_NAME} shall be subject to the exclusive jurisdiction of the courts of Dubai.`,

    // Section 11 content
    section11Content: "If you have any questions about this Legal Disclaimer, you can contact us at:",
    section11Address: "Elysium Media FZCO\nID: 58510, Premises no. 58510 - 001\nIFZA Business Park, DDP\nDUBAI, United Arab Emirates"
  },
  ru: {
    disclaimerTitle: "Правовое уведомление",
    lastUpdated: "Последнее обновление: 2 апреля 2021 г.",
    contentIndex: "Содержание",
    section1Title: "1. Принятие Уведомления",
    section2Title: "2. Характер Платформы",
    section3Title: "3. Инвестиционные риски",
    section4Title: "4. Отсутствие финансовых консультаций",
    section5Title: "5. Ограничение ответственности",
    section6Title: "6. Некастодиальный механизм",
    section7Title: "7. Точность информации",
    section8Title: "8. Соответствие нормативным требованиям",
    section9Title: "9. Изменения в Уведомлении",
    section10Title: "10. Применимое законодательство",
    section11Title: "11. Контакты",

    // Section 1 content
    section1_1Title: "1.1 Условия использования:",
    section1_1Content: "Получая доступ или используя WayBank, вы соглашаетесь быть юридически связанными настоящим Правовым уведомлением. Если вы не согласны с какими-либо условиями, вы должны немедленно прекратить использование платформы.",
    section1_2Title: "1.2 Правоспособность:",
    section1_2Content: "Используя нашу платформу, вы заявляете, что обладаете правоспособностью принимать настоящие условия и что вам исполнилось 18 лет.",

    // Section 2 content
    section2_1Title: "2.1 Описание услуги:",
    section2_1Content: `${APP_NAME} — это децентрализованная платформа, которая облегчает оптимизацию ликвидности в протоколах DeFi, таких как Uniswap. Мы предоставляем инструменты для управления концентрированными позициями ликвидности, но не имеем прямого контроля над базовыми протоколами.`,
    section2_2Title: "2.2 Экспериментальный характер:",
    section2_2Content: `Вы признаете, что технология блокчейн, DeFi и смарт-контракты носят экспериментальный характер. ${APP_NAME} работает в развивающемся технологическом пространстве, которое несет значительные технологические риски.`,

    // Section 3 content
    section3_1Title: "3.1 Неотъемлемый риск:",
    section3_1Content: "Все действия, связанные с криптовалютами, включая предоставление ликвидности, сопряжены с высоким риском. Стоимость криптовалют может значительно колебаться, и вы можете потерять часть или всю свою инвестицию.",
    section3_2Title: "3.2 Непостоянная потеря:",
    section3_2Content: "Несмотря на наши алгоритмы оптимизации, непостоянная потеря является неотъемлемым риском при предоставлении ликвидности. Наши стратегии направлены на минимизацию, но не могут полностью исключить этот риск.",
    section3_3Title: "3.3 Технические риски:",
    section3_3Content: "Существуют риски, связанные со смарт-контрактами, техническими сбоями, ошибками и уязвимостями, которые могут привести к потере средств.",

    // Section 4 content
    section4_1Title: "4.1 Отсутствие рекомендаций:",
    section4_1Content: `Информация, представленная на ${APP_NAME}, носит исключительно информационный характер и не является финансовой, инвестиционной или налоговой консультацией. Мы не рекомендуем какую-либо конкретную инвестиционную стратегию.`,
    section4_2Content: "Вы должны принимать собственные инвестиционные решения на основе собственного исследования и рассмотреть возможность обращения за советом к квалифицированным финансовым специалистам, прежде чем делать какие-либо инвестиции.",

    // Section 5 content
    section5_1Title: "5.1 Ограничение гарантий:",
    section5_1Content: `${APP_NAME} предоставляется «как есть» и «как доступно» без каких-либо гарантий, явных или подразумеваемых.`,
    section5_2Content: "В максимально допустимой законом степени мы не несем ответственности за любые прямые, косвенные, случайные, специальные, косвенные или штрафные убытки, а также за любую упущенную выгоду или доходы.",
    section5_3Content: "Вы принимаете на себя все риски, связанные с использованием нашей платформы, включая, помимо прочего, волатильность цен на криптовалюты и потенциальные финансовые потери.",
    section5_4Content: "Мы не несем ответственности за действия, контент, информацию или данные третьих лиц, включая других пользователей или протоколы, такие как Uniswap.",

    // Section 6 content
    section6_1Title: "6.1 Контроль активов:",
    section6_1Content: `${APP_NAME} работает как некастодиальная платформа, что означает, что мы не храним и не имеем доступа к приватным ключам, сид-фразам, ключам восстановления или другим данным доступа к цифровым активам пользователей.`,
    section6_2Content: "Вы сохраняете полный контроль и ответственность за свои цифровые активы в любое время. Вы несете исключительную ответственность за обеспечение безопасности и защиту учетных данных и активов вашего кошелька.",

    // Section 7 content
    section7_1Title: "7.1 Усилия по обеспечению точности:",
    section7_1Content: "Мы стремимся предоставлять точную и актуальную информацию, однако не гарантируем точность, полноту, своевременность или надежность любой информации, представленной на платформе.",
    section7_2Content: "Некоторые данные, отображаемые на нашей платформе, получены из сторонних источников, таких как ценовые оракулы, протоколы DeFi и блокчейн-API. Мы не несем ответственности за ошибки или неточности в этих данных.",

    // Section 8 content
    section8_1Title: "8.1 Ответственность пользователя:",
    section8_1Content: "Вы несете ответственность за понимание и соблюдение всех применимых законов, правил и нормативных актов вашей юрисдикции, касающихся использования криптовалют и услуг DeFi.",
    section8_2Content: `Доступ к ${APP_NAME} может быть незаконным в определенных юрисдикциях. Вы несете ответственность за определение того, разрешено ли вам использовать нашу платформу в соответствии с законами вашей юрисдикции.`,

    // Section 9 content
    section9Content: `Мы оставляем за собой право изменять настоящее Правовое уведомление в любое время по нашему усмотрению. Изменения вступают в силу немедленно после их публикации на платформе. Ваше дальнейшее использование ${APP_NAME} после любых изменений означает ваше согласие с обновленными условиями.`,

    // Section 10 content
    section10Content: `Настоящее Правовое уведомление регулируется и толкуется в соответствии с законодательством Дубая, Объединенные Арабские Эмираты, без учета его положений о коллизионном праве. Любые споры, возникающие в связи с настоящим уведомлением или использованием вами ${APP_NAME}, подлежат исключительной юрисдикции судов Дубая.`,

    // Section 11 content
    section11Content: "Если у вас есть вопросы по настоящему Правовому уведомлению, вы можете связаться с нами по адресу:",
    section11Address: "Elysium Media FZCO\nID: 58510, Premises no. 58510 - 001\nIFZA Business Park, DDP\nDUBAI, United Arab Emirates"
  },
  ar: {
    disclaimerTitle: "إخلاء المسؤولية القانونية",
    lastUpdated: "آخر تحديث: 2 أبريل 2021",
    contentIndex: "المحتويات",
    section1Title: "1. قبول إخلاء المسؤولية",
    section2Title: "2. طبيعة المنصة",
    section3Title: "3. مخاطر الاستثمار",
    section4Title: "4. لا نصيحة مالية",
    section5Title: "5. حدود المسؤولية",
    section6Title: "6. آلية غير وصائية",
    section7Title: "7. دقة المعلومات",
    section8Title: "8. الامتثال التنظيمي",
    section9Title: "9. التغييرات في إخلاء المسؤولية",
    section10Title: "10. القانون المطبق",
    section11Title: "11. الاتصال",

    // Contenido de sección 1
    section1_1Title: "1.1 شروط الاستخدام:",
    section1_1Content: `من خلال الوصول إلى ${APP_NAME} أو استخدامه، فإنك توافق على الالتزام قانونًا بإخلاء المسؤولية القانونية هذا. إذا كنت لا توافق على أي من الشروط، يجب عليك التوقف عن استخدام المنصة فورًا.`,
    section1_2Title: "1.2 الأهلية القانونية:",
    section1_2Content: "باستخدام منصتنا، فإنك تمثل أن لديك الأهلية القانونية لقبول هذه الشروط وأن عمرك 18 عامًا على الأقل.",

    // Contenido de sección 2
    section2_1Title: "2.1 وصف الخدمة:",
    section2_1Content: `${APP_NAME} هي منصة لامركزية تسهل تحسين السيولة في بروتوكولات التمويل اللامركزي مثل Uniswap. نحن نوفر أدوات لإدارة مراكز السيولة المركزة، ولكن ليس لدينا سيطرة مباشرة على البروتوكولات الأساسية.`,
    section2_2Title: "2.2 الطبيعة التجريبية:",
    section2_2Content: `أنت تقر بأن تقنية البلوكتشين والتمويل اللامركزي والعقود الذكية هي تجريبية. تعمل ${APP_NAME} في مساحة تكنولوجية متطورة تحمل مخاطر تكنولوجية كبيرة.`,

    // Contenido de sección 3
    section3_1Title: "3.1 المخاطر المتأصلة:",
    section3_1Content: "تنطوي جميع الأنشطة المتعلقة بالعملات المشفرة، بما في ذلك توفير السيولة، على مخاطر عالية. يمكن أن تتقلب قيم العملات المشفرة بشكل كبير، ويمكن أن تخسر جزءًا أو كل استثمارك.",
    section3_2Title: "3.2 الخسارة المؤقتة:",
    section3_2Content: "على الرغم من خوارزميات التحسين لدينا، إلا أن الخسارة المؤقتة هي مخاطر متأصلة عند توفير السيولة. تهدف استراتيجياتنا إلى التقليل، ولكن لا يمكنها القضاء تمامًا على هذه المخاطر.",
    section3_3Title: "3.3 المخاطر التقنية:",
    section3_3Content: "هناك مخاطر مرتبطة بالعقود الذكية والأعطال التقنية والأخطاء ونقاط الضعف التي يمكن أن تؤدي إلى فقدان الأموال.",

    // Contenido de sección 4
    section4_1Title: "4.1 لا توصيات:",
    section4_1Content: `المعلومات المقدمة على ${APP_NAME} هي لأغراض إعلامية فقط ولا تشكل نصيحة مالية أو استثمارية أو ضريبية. نحن لا نوصي بأي استراتيجية استثمارية محددة.`,
    section4_2Title: "4.2 القرارات المستقلة:",
    section4_2Content: "يجب عليك اتخاذ قرارات الاستثمار الخاصة بك بناءً على بحثك الشخصي والنظر في طلب المشورة من المهنيين الماليين المؤهلين قبل إجراء أي استثمار.",

    // Contenido de sección 5
    section5_1Title: "5.1 حدود الضمانات:",
    section5_1Content: `يتم توفير ${APP_NAME} 'كما هي' و'كما هي متاحة' دون ضمانات من أي نوع، سواء كانت صريحة أو ضمنية.`,
    section5_2Title: "5.2 استبعاد المسؤولية:",
    section5_2Content: "إلى أقصى حد يسمح به القانون، لن نكون مسؤولين عن أي أضرار مباشرة أو غير مباشرة أو عرضية أو خاصة أو تبعية أو عقابية، أو أي خسارة في الأرباح أو الإيرادات.",
    section5_3Title: "5.3 المخاطر المفترضة:",
    section5_3Content: "أنت تتحمل جميع المخاطر المتعلقة باستخدام منصتنا، بما في ذلك على سبيل المثال لا الحصر تقلب أسعار العملات المشفرة والخسائر المالية المحتملة.",
    section5_4Title: "5.4 لا مسؤولية عن الأطراف الثالثة:",
    section5_4Content: "نحن لسنا مسؤولين عن إجراءات أو محتوى أو معلومات أو بيانات الأطراف الثالثة، بما في ذلك المستخدمين الآخرين أو البروتوكولات مثل Uniswap.",

    // Contenido de sección 6
    section6_1Title: "6.1 التحكم في الأصول:",
    section6_1Content: `تعمل ${APP_NAME} كمنصة غير وصائية، مما يعني أننا لا نخزن أو نمتلك حق الوصول إلى المفاتيح الخاصة أو عبارات الاسترداد أو مفاتيح الاسترداد أو بيانات الوصول الأخرى إلى الأصول الرقمية للمستخدمين.`,
    section6_2Title: "6.2 مسؤولية المستخدم:",
    section6_2Content: "أنت تحتفظ بالسيطرة الكاملة والمسؤولية عن أصولك الرقمية في جميع الأوقات. إنها مسؤوليتك الوحيدة تأمين وحماية بيانات اعتماد المحفظة الخاصة بك وأصولك.",

    // Contenido de sección 7
    section7_1Title: "7.1 جهود الدقة:",
    section7_1Content: "نحن نسعى جاهدين لتقديم معلومات دقيقة ومحدثة، ومع ذلك، لا نضمن دقة أو اكتمال أو حداثة أو موثوقية أي معلومات مقدمة على المنصة.",
    section7_2Title: "7.2 بيانات الطرف الثالث:",
    section7_2Content: "جزء من المعلومات المعروضة على منصتنا يأتي من مصادر الطرف الثالث مثل أوراكل الأسعار وبروتوكولات التمويل اللامركزي وواجهات برمجة تطبيقات البلوكتشين. نحن لا نتحمل المسؤولية عن الأخطاء أو عدم الدقة في هذه البيانات.",

    // Contenido de sección 8
    section8_1Title: "8.1 مسؤولية المستخدم:",
    section8_1Content: "تقع على عاتقك مسؤولية فهم والامتثال لجميع القوانين والقواعد واللوائح المعمول بها في ولايتك القضائية فيما يتعلق باستخدام العملات المشفرة وخدمات التمويل اللامركزي.",
    section8_2Title: "8.2 القيود القضائية:",
    section8_2Content: `قد لا يكون الوصول إلى ${APP_NAME} قانونيًا في بعض الولايات القضائية. أنت مسؤول عن تحديد ما إذا كان مسموحًا لك باستخدام منصتنا وفقًا لقوانين ولايتك القضائية.`,

    // Contenido de sección 9
    section9Content: `نحتفظ بالحق في تعديل إخلاء المسؤولية القانونية هذا في أي وقت وفقًا لتقديرنا. ستدخل التعديلات حيز التنفيذ فور نشرها على المنصة. سيشكل استخدامك المستمر لـ ${APP_NAME} بعد أي تعديل قبولك للشروط المحدثة.`,

    // Contenido de sección 10
    section10Content: `يخضع إخلاء المسؤولية القانونية هذا ويفسر وفقًا لقوانين دبي، الإمارات العربية المتحدة، دون اعتبار لأحكام تنازع القوانين. أي نزاع ينشأ فيما يتعلق بهذا الإشعار أو استخدامك لـ ${APP_NAME} سيخضع للاختصاص القضائي الحصري لمحاكم دبي.`,

    // Contenido de sección 11
    section11Content: "إذا كان لديك أي أسئلة حول إخلاء المسؤولية القانونية هذا، يمكنك الاتصال بنا على:",
    section11Address: "Elysium Media FZCO\nID: 58510, Premises no. 58510 - 001\nIFZA Business Park, DDP\nDUBAI, United Arab Emirates"
  },
  pt: {
    disclaimerTitle: "Aviso Legal",
    lastUpdated: "Última atualização: 2 de abril de 2021",
    contentIndex: "Conteúdo",
    section1Title: "1. Aceitação do Aviso Legal",
    section2Title: "2. Natureza da Plataforma",
    section3Title: "3. Riscos de Investimento",
    section4Title: "4. Não é Aconselhamento Financeiro",
    section5Title: "5. Limitação de Responsabilidade",
    section6Title: "6. Mecanismo Não-Custodial",
    section7Title: "7. Precisão da Informação",
    section8Title: "8. Conformidade Regulatória",
    section9Title: "9. Alterações no Aviso Legal",
    section10Title: "10. Lei Aplicável",
    section11Title: "11. Contato",

    // Contenido de sección 1
    section1_1Title: "1.1 Termos de Uso:",
    section1_1Content: `Ao acessar ou utilizar o ${APP_NAME}, você concorda em estar legalmente vinculado por este Aviso Legal. Se você não concordar com algum dos termos, deve parar de usar a plataforma imediatamente.`,
    section1_2Title: "1.2 Capacidade Legal:",
    section1_2Content: "Ao usar nossa plataforma, você declara que tem capacidade legal para aceitar estes termos e que tem pelo menos 18 anos de idade.",

    // Contenido de sección 2
    section2_1Title: "2.1 Descrição do Serviço:",
    section2_1Content: `${APP_NAME} é uma plataforma descentralizada que facilita a otimização de liquidez em protocolos DeFi como Uniswap. Fornecemos ferramentas para gerenciar posições de liquidez concentrada, mas não temos controle direto sobre os protocolos subjacentes.`,
    section2_2Title: "2.2 Natureza Experimental:",
    section2_2Content: `Você reconhece que a tecnologia blockchain, DeFi e contratos inteligentes são experimentais. ${APP_NAME} opera em um espaço tecnológico em evolução que carrega riscos tecnológicos significativos.`,

    // Contenido de sección 3
    section3_1Title: "3.1 Risco Inerente:",
    section3_1Content: "Todas as atividades relacionadas a criptomoedas, incluindo o fornecimento de liquidez, envolvem alto risco. Os valores das criptomoedas podem flutuar significativamente e você pode perder parte ou todo o seu investimento.",
    section3_2Title: "3.2 Perda Impermanente:",
    section3_2Content: "Apesar de nossos algoritmos de otimização, a perda impermanente é um risco inerente ao fornecer liquidez. Nossas estratégias visam minimizar, mas não podem eliminar completamente esse risco.",
    section3_3Title: "3.3 Riscos Técnicos:",
    section3_3Content: "Existem riscos associados a contratos inteligentes, falhas técnicas, erros e vulnerabilidades que podem resultar em perda de fundos.",

    // Contenido de sección 4
    section4_1Title: "4.1 Sem Recomendações:",
    section4_1Content: `As informações fornecidas no ${APP_NAME} são apenas para fins informativos e não constituem aconselhamento financeiro, de investimento ou fiscal. Não recomendamos nenhuma estratégia de investimento específica.`,
    section4_2Title: "4.2 Decisões Independentes:",
    section4_2Content: "Você deve tomar suas próprias decisões de investimento com base em sua pesquisa pessoal e considerar buscar aconselhamento de profissionais financeiros qualificados antes de fazer qualquer investimento.",

    // Contenido de sección 5
    section5_1Title: "5.1 Limitação de Garantias:",
    section5_1Content: `${APP_NAME} é fornecido 'como está' e 'conforme disponível' sem garantias de qualquer tipo, sejam expressas ou implícitas.`,
    section5_2Title: "5.2 Exclusão de Responsabilidade:",
    section5_2Content: "Na máxima extensão permitida pela lei, não seremos responsáveis por quaisquer danos diretos, indiretos, incidentais, especiais, consequenciais ou punitivos, ou qualquer perda de lucros ou receitas.",
    section5_3Title: "5.3 Riscos Assumidos:",
    section5_3Content: "Você assume todos os riscos relacionados ao uso de nossa plataforma, incluindo, mas não se limitando a, volatilidade do preço das criptomoedas e potenciais perdas financeiras.",
    section5_4Title: "5.4 Sem Responsabilidade por Terceiros:",
    section5_4Content: "Não somos responsáveis pelas ações, conteúdo, informações ou dados de terceiros, incluindo outros usuários ou protocolos como Uniswap.",

    // Contenido de sección 6
    section6_1Title: "6.1 Controle de Ativos:",
    section6_1Content: `${APP_NAME} opera como uma plataforma não-custodial, o que significa que não armazenamos nem temos acesso a chaves privadas, frases-semente, chaves de recuperação ou outros dados de acesso aos ativos digitais dos usuários.`,
    section6_2Title: "6.2 Responsabilidade do Usuário:",
    section6_2Content: "Você mantém controle total e responsabilidade por seus ativos digitais em todos os momentos. É sua exclusiva responsabilidade garantir e proteger suas credenciais de carteira e ativos.",

    // Contenido de sección 7
    section7_1Title: "7.1 Esforços de Precisão:",
    section7_1Content: "Nos esforçamos para fornecer informações precisas e atualizadas, no entanto, não garantimos a precisão, integridade, atualidade ou confiabilidade de qualquer informação fornecida na plataforma.",
    section7_2Title: "7.2 Dados de Terceiros:",
    section7_2Content: "Parte das informações exibidas em nossa plataforma vem de fontes de terceiros, como oráculos de preços, protocolos DeFi e APIs blockchain. Não assumimos responsabilidade por erros ou imprecisões nesses dados.",

    // Contenido de sección 8
    section8_1Title: "8.1 Responsabilidade do Usuário:",
    section8_1Content: "É sua responsabilidade entender e cumprir todas as leis, regras e regulamentos aplicáveis em sua jurisdição em relação ao uso de criptomoedas e serviços DeFi.",
    section8_2Title: "8.2 Restrições Jurisdicionais:",
    section8_2Content: `O acesso ao ${APP_NAME} pode não ser legal em certas jurisdições. Você é responsável por determinar se você está autorizado a usar nossa plataforma de acordo com as leis de sua jurisdição.`,

    // Contenido de sección 9
    section9Content: "Reservamo-nos o direito de modificar este Aviso Legal a qualquer momento, a nosso critério. As modificações entrarão em vigor imediatamente após a publicação na plataforma. Seu uso continuado do WayBank após qualquer modificação constituirá sua aceitação dos termos atualizados.",

    // Contenido de sección 10
    section10Content: "Este Aviso Legal é regido e interpretado de acordo com as leis de Dubai, Emirados Árabes Unidos, sem consideração às suas disposições sobre conflitos de leis. Qualquer disputa decorrente deste aviso ou do seu uso do WayBank estará sujeita à jurisdição exclusiva dos tribunais de Dubai.",

    // Contenido de sección 11
    section11Content: "Se você tiver alguma dúvida sobre este Aviso Legal, pode entrar em contato conosco em:",
    section11Address: "Elysium Media FZCO\nID: 58510, Premises no. 58510 - 001\nIFZA Business Park, DDP\nDUBAI, United Arab Emirates"
  },
  it: {
    disclaimerTitle: "Avviso Legale",
    lastUpdated: "Ultimo aggiornamento: 2 aprile 2021",
    contentIndex: "Contenuti",
    section1Title: "1. Accettazione dell'Avviso Legale",
    section2Title: "2. Natura della Piattaforma",
    section3Title: "3. Rischi di Investimento",
    section4Title: "4. Nessuna Consulenza Finanziaria",
    section5Title: "5. Limitazione di Responsabilità",
    section6Title: "6. Meccanismo Non-Custodial",
    section7Title: "7. Precisione delle Informazioni",
    section8Title: "8. Conformità Normativa",
    section9Title: "9. Modifiche all'Avviso Legale",
    section10Title: "10. Legge Applicabile",
    section11Title: "11. Contatti",

    // Contenido de sección 1
    section1_1Title: "1.1 Termini di Utilizzo:",
    section1_1Content: "Accedendo o utilizzando WayBank, accetti di essere legalmente vincolato da questo Avviso Legale. Se non sei d'accordo con qualsiasi termine, devi smettere di utilizzare la piattaforma immediatamente.",
    section1_2Title: "1.2 Capacità Legale:",
    section1_2Content: "Utilizzando la nostra piattaforma, dichiari di avere la capacità legale di accettare questi termini e di avere almeno 18 anni di età.",

    // Contenido de sección 2
    section2_1Title: "2.1 Descrizione del Servizio:",
    section2_1Content: "WayBank è una piattaforma decentralizzata che facilita l'ottimizzazione della liquidità nei protocolli DeFi come Uniswap. Forniamo strumenti per gestire posizioni di liquidità concentrata, ma non abbiamo controllo diretto sui protocolli sottostanti.",
    section2_2Title: "2.2 Natura Sperimentale:",
    section2_2Content: "Riconosci che la tecnologia blockchain, DeFi e smart contract sono sperimentali. WayBank opera in uno spazio tecnologico in evoluzione che comporta significativi rischi tecnologici.",

    // Contenido de sección 3
    section3_1Title: "3.1 Rischio Intrinseco:",
    section3_1Content: "Tutte le attività legate alle criptovalute, inclusa la fornitura di liquidità, comportano un alto rischio. I valori delle criptovalute possono fluttuare significativamente e potresti perdere parte o tutto il tuo investimento.",
    section3_2Title: "3.2 Perdita Impermanente:",
    section3_2Content: "Nonostante i nostri algoritmi di ottimizzazione, la perdita impermanente è un rischio intrinseco quando si fornisce liquidità. Le nostre strategie mirano a minimizzare, ma non possono eliminare completamente questo rischio.",
    section3_3Title: "3.3 Rischi Tecnici:",
    section3_3Content: "Esistono rischi associati agli smart contract, guasti tecnici, errori e vulnerabilità che potrebbero comportare la perdita di fondi.",

    // Contenido de sección 4
    section4_1Title: "4.1 Nessuna Raccomandazione:",
    section4_1Content: "Le informazioni fornite su WayBank sono solo a scopo informativo e non costituiscono consulenza finanziaria, d'investimento o fiscale. Non raccomandiamo alcuna strategia d'investimento specifica.",
    section4_2Title: "4.2 Decisioni Indipendenti:",
    section4_2Content: "Dovresti prendere le tue decisioni d'investimento basate sulla tua ricerca personale e considerare di richiedere consigli a professionisti finanziari qualificati prima di effettuare qualsiasi investimento.",

    // Contenido de sección 5
    section5_1Title: "5.1 Limitazione di Garanzie:",
    section5_1Content: "WayBank è fornito 'così com'è' e 'come disponibile' senza garanzie di alcun tipo, sia espresse che implicite.",
    section5_2Title: "5.2 Esclusione di Responsabilità:",
    section5_2Content: "Nella misura massima consentita dalla legge, non saremo responsabili per danni diretti, indiretti, incidentali, speciali, consequenziali o punitivi, o qualsiasi perdita di profitti o ricavi.",
    section5_3Title: "5.3 Rischi Assunti:",
    section5_3Content: "Ti assumi tutti i rischi legati all'uso della nostra piattaforma, inclusi ma non limitati alla volatilità dei prezzi delle criptovalute e potenziali perdite finanziarie.",
    section5_4Title: "5.4 Nessuna Responsabilità per Terze Parti:",
    section5_4Content: "Non siamo responsabili per le azioni, contenuti, informazioni o dati di terze parti, inclusi altri utenti o protocolli come Uniswap.",

    // Contenido de sección 6
    section6_1Title: "6.1 Controllo degli Asset:",
    section6_1Content: "WayBank opera come una piattaforma non-custodial, il che significa che non memorizziamo né abbiamo accesso a chiavi private, frasi seed, chiavi di recupero o altri dati di accesso agli asset digitali degli utenti.",
    section6_2Title: "6.2 Responsabilità dell'Utente:",
    section6_2Content: "Mantieni il pieno controllo e la responsabilità dei tuoi asset digitali in ogni momento. È tua esclusiva responsabilità proteggere le tue credenziali di wallet e i tuoi asset.",

    // Contenido de sección 7
    section7_1Title: "7.1 Sforzi di Precisione:",
    section7_1Content: "Ci impegniamo a fornire informazioni accurate e aggiornate, tuttavia, non garantiamo l'accuratezza, completezza, tempestività o affidabilità di qualsiasi informazione fornita sulla piattaforma.",
    section7_2Title: "7.2 Dati di Terze Parti:",
    section7_2Content: "Parte delle informazioni visualizzate sulla nostra piattaforma proviene da fonti di terze parti come oracoli di prezzo, protocolli DeFi e API blockchain. Non ci assumiamo alcuna responsabilità per errori o imprecisioni in questi dati.",

    // Contenido de sección 8
    section8_1Title: "8.1 Responsabilità dell'Utente:",
    section8_1Content: "È tua responsabilità comprendere e rispettare tutte le leggi, regole e normative applicabili nella tua giurisdizione riguardo all'uso di criptovalute e servizi DeFi.",
    section8_2Title: "8.2 Restrizioni Giurisdizionali:",
    section8_2Content: "L'accesso a WayBank potrebbe non essere legale in alcune giurisdizioni. Sei responsabile di determinare se ti è consentito utilizzare la nostra piattaforma secondo le leggi della tua giurisdizione.",

    // Contenido de sección 9
    section9Content: "Ci riserviamo il diritto di modificare questo Avviso Legale in qualsiasi momento a nostra discrezione. Le modifiche entreranno in vigore immediatamente dopo la pubblicazione sulla piattaforma. Il tuo uso continuato di WayBank dopo qualsiasi modifica costituirà la tua accettazione dei termini aggiornati.",

    // Contenido de sección 10
    section10Content: "Questo Avviso Legale è regolato e interpretato in conformità con le leggi di Dubai, Emirati Arabi Uniti, senza riguardo alle sue disposizioni sui conflitti di legge. Qualsiasi controversia derivante da questo avviso o dal tuo utilizzo di WayBank sarà soggetta alla giurisdizione esclusiva dei tribunali di Dubai.",

    // Contenido de sección 11
    section11Content: "Se hai domande su questo Avviso Legale, puoi contattarci a:",
    section11Address: "Elysium Media FZCO\nID: 58510, Premises no. 58510 - 001\nIFZA Business Park, DDP\nDUBAI, United Arab Emirates"
  },
  fr: {
    disclaimerTitle: "Avis Juridique",
    lastUpdated: "Dernière mise à jour : 2 avril 2021",
    contentIndex: "Contenu",
    section1Title: "1. Acceptation de l'Avis Juridique",
    section2Title: "2. Nature de la Plateforme",
    section3Title: "3. Risques d'Investissement",
    section4Title: "4. Aucun Conseil Financier",
    section5Title: "5. Limitation de Responsabilité",
    section6Title: "6. Mécanisme Non-Custodial",
    section7Title: "7. Exactitude des Informations",
    section8Title: "8. Conformité Réglementaire",
    section9Title: "9. Modifications de l'Avis Juridique",
    section10Title: "10. Loi Applicable",
    section11Title: "11. Contact",

    // Contenido de sección 1
    section1_1Title: "1.1 Conditions d'Utilisation :",
    section1_1Content: "En accédant ou en utilisant WayBank, vous acceptez d'être légalement lié par cet Avis Juridique. Si vous n'êtes pas d'accord avec l'une des conditions, vous devez cesser d'utiliser la plateforme immédiatement.",
    section1_2Title: "1.2 Capacité Juridique :",
    section1_2Content: "En utilisant notre plateforme, vous déclarez que vous avez la capacité juridique d'accepter ces conditions et que vous avez au moins 18 ans.",

    // Contenido de sección 2
    section2_1Title: "2.1 Description du Service :",
    section2_1Content: "WayBank est une plateforme décentralisée qui facilite l'optimisation de la liquidité dans les protocoles DeFi comme Uniswap. Nous fournissons des outils pour gérer les positions de liquidité concentrée, mais nous n'avons aucun contrôle direct sur les protocoles sous-jacents.",
    section2_2Title: "2.2 Nature Expérimentale :",
    section2_2Content: "Vous reconnaissez que la technologie blockchain, la DeFi et les contrats intelligents sont expérimentaux. WayBank opère dans un espace technologique en évolution qui comporte des risques technologiques importants.",

    // Contenido de sección 3
    section3_1Title: "3.1 Risque Inhérent :",
    section3_1Content: "Toutes les activités liées aux crypto-monnaies, y compris la fourniture de liquidités, comportent un risque élevé. Les valeurs des crypto-monnaies peuvent fluctuer considérablement et vous pourriez perdre une partie ou la totalité de votre investissement.",
    section3_2Title: "3.2 Perte Impermanente :",
    section3_2Content: "Malgré nos algorithmes d'optimisation, la perte impermanente est un risque inhérent lors de la fourniture de liquidités. Nos stratégies visent à minimiser, mais ne peuvent pas éliminer complètement ce risque.",
    section3_3Title: "3.3 Risques Techniques :",
    section3_3Content: "Il existe des risques associés aux contrats intelligents, aux défaillances techniques, aux erreurs et aux vulnérabilités qui pourraient entraîner une perte de fonds.",

    // Contenido de sección 4
    section4_1Title: "4.1 Aucune Recommandation :",
    section4_1Content: "Les informations fournies sur WayBank sont uniquement à des fins informatives et ne constituent pas des conseils financiers, d'investissement ou fiscaux. Nous ne recommandons aucune stratégie d'investissement spécifique.",
    section4_2Title: "4.2 Décisions Indépendantes :",
    section4_2Content: "Vous devez prendre vos propres décisions d'investissement en fonction de vos recherches personnelles et envisager de demander conseil à des professionnels financiers qualifiés avant de faire un investissement.",

    // Contenido de sección 5
    section5_1Title: "5.1 Limitation de Garanties :",
    section5_1Content: "WayBank est fourni 'tel quel' et 'tel que disponible' sans garanties d'aucune sorte, qu'elles soient explicites ou implicites.",
    section5_2Title: "5.2 Exclusion de Responsabilité :",
    section5_2Content: "Dans la mesure maximale permise par la loi, nous ne serons pas responsables des dommages directs, indirects, accessoires, spéciaux, consécutifs ou punitifs, ni de toute perte de profits ou de revenus.",
    section5_3Title: "5.3 Risques Assumés :",
    section5_3Content: "Vous assumez tous les risques liés à l'utilisation de notre plateforme, y compris, mais sans s'y limiter, la volatilité des prix des crypto-monnaies et les pertes financières potentielles.",
    section5_4Title: "5.4 Aucune Responsabilité pour les Tiers :",
    section5_4Content: "Nous ne sommes pas responsables des actions, du contenu, des informations ou des données des tiers, y compris d'autres utilisateurs ou protocoles comme Uniswap.",

    // Contenido de sección 6
    section6_1Title: "6.1 Contrôle des Actifs :",
    section6_1Content: "WayBank fonctionne comme une plateforme non-custodiale, ce qui signifie que nous ne stockons pas et n'avons pas accès aux clés privées, phrases de récupération, clés de récupération ou autres données d'accès aux actifs numériques des utilisateurs.",
    section6_2Title: "6.2 Responsabilité de l'Utilisateur :",
    section6_2Content: "Vous conservez le contrôle total et la responsabilité de vos actifs numériques à tout moment. Il est de votre seule responsabilité de sécuriser et de protéger vos identifiants de portefeuille et vos actifs.",

    // Contenido de sección 7
    section7_1Title: "7.1 Efforts d'Exactitude :",
    section7_1Content: "Nous nous efforçons de fournir des informations précises et à jour, cependant, nous ne garantissons pas l'exactitude, l'exhaustivité, l'actualité ou la fiabilité de toute information fournie sur la plateforme.",
    section7_2Title: "7.2 Données de Tiers :",
    section7_2Content: "Une partie des informations affichées sur notre plateforme provient de sources tierces telles que des oracles de prix, des protocoles DeFi et des API blockchain. Nous n'assumons aucune responsabilité pour les erreurs ou inexactitudes dans ces données.",

    // Contenido de sección 8
    section8_1Title: "8.1 Responsabilité de l'Utilisateur :",
    section8_1Content: "Il est de votre responsabilité de comprendre et de respecter toutes les lois, règles et réglementations applicables dans votre juridiction concernant l'utilisation des crypto-monnaies et des services DeFi.",
    section8_2Title: "8.2 Restrictions Juridictionnelles :",
    section8_2Content: "L'accès à WayBank peut ne pas être légal dans certaines juridictions. Vous êtes responsable de déterminer si vous êtes autorisé à utiliser notre plateforme selon les lois de votre juridiction.",

    // Contenido de sección 9
    section9Content: "Nous nous réservons le droit de modifier cet Avis Juridique à tout moment à notre discrétion. Les modifications entreront en vigueur immédiatement après leur publication sur la plateforme. Votre utilisation continue de WayBank après toute modification constituera votre acceptation des conditions mises à jour.",

    // Contenido de sección 10
    section10Content: "Cet Avis Juridique est régi et interprété conformément aux lois de Dubaï, Émirats Arabes Unis, sans égard à ses dispositions relatives aux conflits de lois. Tout litige découlant de cet avis ou de votre utilisation de WayBank sera soumis à la juridiction exclusive des tribunaux de Dubaï.",

    // Contenido de sección 11
    section11Content: "Si vous avez des questions concernant cet Avis Juridique, vous pouvez nous contacter à :",
    section11Address: "Elysium Media FZCO\nID: 58510, Premises no. 58510 - 001\nIFZA Business Park, DDP\nDUBAI, United Arab Emirates"
  },
  de: {
    disclaimerTitle: "Rechtlicher Hinweis",
    lastUpdated: "Letzte Aktualisierung: 2. April 2021",
    contentIndex: "Inhalt",
    section1Title: "1. Annahme des rechtlichen Hinweises",
    section2Title: "2. Art der Plattform",
    section3Title: "3. Anlagerisiken",
    section4Title: "4. Keine Finanzberatung",
    section5Title: "5. Haftungsbeschränkung",
    section6Title: "6. Nicht-Verwahrungsmechanismus",
    section7Title: "7. Richtigkeit der Informationen",
    section8Title: "8. Einhaltung regulatorischer Vorschriften",
    section9Title: "9. Änderungen des rechtlichen Hinweises",
    section10Title: "10. Anwendbares Recht",
    section11Title: "11. Kontakt",

    // Contenido de sección 1
    section1_1Title: "1.1 Nutzungsbedingungen:",
    section1_1Content: "Durch den Zugriff auf oder die Nutzung von WayBank erklären Sie sich damit einverstanden, rechtlich an diesen rechtlichen Hinweis gebunden zu sein. Wenn Sie mit einer der Bedingungen nicht einverstanden sind, müssen Sie die Nutzung der Plattform sofort einstellen.",
    section1_2Title: "1.2 Rechtliche Handlungsfähigkeit:",
    section1_2Content: "Durch die Nutzung unserer Plattform versichern Sie, dass Sie die rechtliche Fähigkeit besitzen, diese Bedingungen zu akzeptieren und mindestens 18 Jahre alt sind.",

    // Contenido de sección 2
    section2_1Title: "2.1 Dienstbeschreibung:",
    section2_1Content: "WayBank ist eine dezentrale Plattform, die die Liquiditätsoptimierung in DeFi-Protokollen wie Uniswap erleichtert. Wir bieten Tools zur Verwaltung von konzentrierten Liquiditätspositionen, haben jedoch keine direkte Kontrolle über die zugrunde liegenden Protokolle.",
    section2_2Title: "2.2 Experimenteller Charakter:",
    section2_2Content: "Sie erkennen an, dass Blockchain-Technologie, DeFi und Smart Contracts experimentell sind. WayBank operiert in einem sich entwickelnden technologischen Raum, der erhebliche technologische Risiken birgt.",

    // Contenido de sección 3
    section3_1Title: "3.1 Inhärentes Risiko:",
    section3_1Content: "Alle Aktivitäten im Zusammenhang mit Kryptowährungen, einschließlich der Bereitstellung von Liquidität, beinhalten ein hohes Risiko. Die Werte von Kryptowährungen können erheblich schwanken, und Sie könnten einen Teil oder Ihre gesamte Investition verlieren.",
    section3_2Title: "3.2 Unbeständiger Verlust:",
    section3_2Content: "Trotz unserer Optimierungsalgorithmen ist unbeständiger Verlust ein inhärentes Risiko bei der Bereitstellung von Liquidität. Unsere Strategien zielen darauf ab, dieses Risiko zu minimieren, können es aber nicht vollständig eliminieren.",
    section3_3Title: "3.3 Technische Risiken:",
    section3_3Content: "Es gibt Risiken im Zusammenhang mit Smart Contracts, technischen Fehlern, Fehlern und Schwachstellen, die zum Verlust von Geldern führen können.",

    // Contenido de sección 4
    section4_1Title: "4.1 Keine Empfehlungen:",
    section4_1Content: "Die auf WayBank bereitgestellten Informationen dienen nur zu Informationszwecken und stellen keine Finanz-, Anlage- oder Steuerberatung dar. Wir empfehlen keine spezifische Anlagestrategie.",
    section4_2Title: "4.2 Unabhängige Entscheidungen:",
    section4_2Content: "Sie sollten Ihre eigenen Anlageentscheidungen auf der Grundlage Ihrer persönlichen Recherche treffen und in Betracht ziehen, vor jeder Investition Rat von qualifizierten Finanzfachleuten einzuholen.",

    // Contenido de sección 5
    section5_1Title: "5.1 Garantiebeschränkung:",
    section5_1Content: "${APP_NAME} wird 'wie besehen' und 'wie verfügbar' ohne Garantien jeglicher Art, weder ausdrücklich noch implizit, bereitgestellt.",
    section5_2Title: "5.2 Haftungsausschluss:",
    section5_2Content: "Im größtmöglichen gesetzlich zulässigen Umfang haften wir nicht für direkte, indirekte, zufällige, besondere, Folge- oder Strafschäden oder für entgangene Gewinne oder Einnahmen.",
    section5_3Title: "5.3 Angenommene Risiken:",
    section5_3Content: "Sie übernehmen alle Risiken im Zusammenhang mit der Nutzung unserer Plattform, einschließlich, aber nicht beschränkt auf, Preisvolatilität von Kryptowährungen und potenzielle finanzielle Verluste.",
    section5_4Title: "5.4 Keine Haftung für Dritte:",
    section5_4Content: "Wir sind nicht verantwortlich für die Handlungen, Inhalte, Informationen oder Daten Dritter, einschließlich anderer Benutzer oder Protokolle wie Uniswap.",

    // Contenido de sección 6
    section6_1Title: "6.1 Vermögenskontrolle:",
    section6_1Content: "${APP_NAME} fungiert als nicht-verwahrende Plattform, was bedeutet, dass wir keine privaten Schlüssel, Seed-Phrasen, Wiederherstellungsschlüssel oder andere Zugriffsdaten zu den digitalen Vermögenswerten der Benutzer speichern oder Zugriff darauf haben.",
    section6_2Title: "6.2 Benutzerverantwortung:",
    section6_2Content: "Sie behalten jederzeit die volle Kontrolle und Verantwortung für Ihre digitalen Vermögenswerte. Es liegt in Ihrer alleinigen Verantwortung, Ihre Wallet-Anmeldedaten und Vermögenswerte zu sichern und zu schützen.",

    // Contenido de sección 7
    section7_1Title: "7.1 Genauigkeitsbemühungen:",
    section7_1Content: "Wir bemühen uns, genaue und aktuelle Informationen bereitzustellen, garantieren jedoch nicht die Genauigkeit, Vollständigkeit, Aktualität oder Zuverlässigkeit der auf der Plattform bereitgestellten Informationen.",
    section7_2Title: "7.2 Daten Dritter:",
    section7_2Content: "Ein Teil der auf unserer Plattform angezeigten Informationen stammt von Drittquellen wie Preisorakeln, DeFi-Protokollen und Blockchain-APIs. Wir übernehmen keine Verantwortung für Fehler oder Ungenauigkeiten in diesen Daten.",

    // Contenido de sección 8
    section8_1Title: "8.1 Benutzerverantwortung:",
    section8_1Content: "Es liegt in Ihrer Verantwortung, alle geltenden Gesetze, Regeln und Vorschriften in Ihrer Gerichtsbarkeit bezüglich der Nutzung von Kryptowährungen und DeFi-Diensten zu verstehen und einzuhalten.",
    section8_2Title: "8.2 Jurisdiktionsbeschränkungen:",
    section8_2Content: "Der Zugang zu ${APP_NAME} ist möglicherweise in bestimmten Gerichtsbarkeiten nicht legal. Sie sind dafür verantwortlich zu bestimmen, ob Sie gemäß den Gesetzen Ihrer Gerichtsbarkeit berechtigt sind, unsere Plattform zu nutzen.",

    // Contenido de sección 9
    section9Content: "Wir behalten uns das Recht vor, diesen rechtlichen Hinweis jederzeit nach eigenem Ermessen zu ändern. Die Änderungen treten unmittelbar nach ihrer Veröffentlichung auf der Plattform in Kraft. Ihre fortgesetzte Nutzung von ${APP_NAME} nach einer Änderung stellt Ihre Annahme der aktualisierten Bedingungen dar.",

    // Contenido de sección 10
    section10Content: "Dieser rechtliche Hinweis unterliegt den Gesetzen von Dubai, Vereinigte Arabische Emirate, und wird in Übereinstimmung mit diesen ausgelegt, ohne Berücksichtigung ihrer Kollisionsnormen. Jede Streitigkeit, die sich aus diesem Hinweis oder Ihrer Nutzung von ${APP_NAME} ergibt, unterliegt der ausschließlichen Zuständigkeit der Gerichte von Dubai.",

    // Contenido de sección 11
    section11Content: "Wenn Sie Fragen zu diesem rechtlichen Hinweis haben, können Sie uns kontaktieren unter:",
    section11Address: "Elysium Media FZCO\nID: 58510, Premises no. 58510 - 001\nIFZA Business Park, DDP\nDUBAI, United Arab Emirates"
  },
  hi: {
    disclaimerTitle: "कानूनी अस्वीकरण",
    lastUpdated: "अंतिम अपडेट: 2 अप्रैल, 2021",
    contentIndex: "विषय-सूची",
    section1Title: "1. अस्वीकरण की स्वीकृति",
    section2Title: "2. प्लेटफॉर्म की प्रकृति",
    section3Title: "3. निवेश जोखिम",
    section4Title: "4. कोई वित्तीय सलाह नहीं",
    section5Title: "5. देयता की सीमा",
    section6Title: "6. गैर-अभिरक्षा तंत्र",
    section7Title: "7. जानकारी की सटीकता",
    section8Title: "8. नियामक अनुपालन",
    section9Title: "9. अस्वीकरण में परिवर्तन",
    section10Title: "10. लागू कानून",
    section11Title: "11. संपर्क",

    // Contenido de sección 1
    section1_1Title: "1.1 उपयोग की शर्तें:",
    section1_1Content: "${APP_NAME} तक पहुंचकर या उसका उपयोग करके, आप इस कानूनी अस्वीकरण से कानूनी रूप से बाध्य होने के लिए सहमत होते हैं। यदि आप किसी भी शर्त से असहमत हैं, तो आपको तुरंत प्लेटफॉर्म का उपयोग बंद कर देना चाहिए।",
    section1_2Title: "1.2 कानूनी क्षमता:",
    section1_2Content: "हमारे प्लेटफॉर्म का उपयोग करके, आप प्रतिनिधित्व करते हैं कि आपके पास इन शर्तों को स्वीकार करने की कानूनी क्षमता है और आप कम से कम 18 वर्ष की आयु के हैं।",

    // Contenido de sección 2
    section2_1Title: "2.1 सेवा विवरण:",
    section2_1Content: "${APP_NAME} एक विकेंद्रीकृत प्लेटफॉर्म है जो Uniswap जैसे DeFi प्रोटोकॉल में तरलता अनुकूलन की सुविधा प्रदान करता है। हम केंद्रित तरलता स्थितियों के प्रबंधन के लिए उपकरण प्रदान करते हैं, लेकिन हमारे पास अंतर्निहित प्रोटोकॉल पर कोई प्रत्यक्ष नियंत्रण नहीं है।",
    section2_2Title: "2.2 प्रयोगात्मक प्रकृति:",
    section2_2Content: "आप स्वीकार करते हैं कि ब्लॉकचेन प्रौद्योगिकी, DeFi, और स्मार्ट कॉन्ट्रैक्ट प्रयोगात्मक हैं। ${APP_NAME} एक विकासशील तकनीकी स्थान में संचालित होता है जिसमें महत्वपूर्ण तकनीकी जोखिम होते हैं।",

    // Contenido de sección 3
    section3_1Title: "3.1 अंतर्निहित जोखिम:",
    section3_1Content: "क्रिप्टोकरेंसी से संबंधित सभी गतिविधियों, जिनमें तरलता प्रदान करना शामिल है, में उच्च जोखिम शामिल है। क्रिप्टोकरेंसी के मूल्य महत्वपूर्ण रूप से उतार-चढ़ाव कर सकते हैं, और आप अपने निवेश का हिस्सा या पूरा निवेश खो सकते हैं।",
    section3_2Title: "3.2 अस्थायी हानि:",
    section3_2Content: "हमारे अनुकूलन एल्गोरिदम के बावजूद, तरलता प्रदान करते समय अस्थायी हानि एक अंतर्निहित जोखिम है। हमारी रणनीतियां इस जोखिम को कम करने का लक्ष्य रखती हैं, लेकिन इसे पूरी तरह से समाप्त नहीं कर सकती हैं।",
    section3_3Title: "3.3 तकनीकी जोखिम:",
    section3_3Content: "स्मार्ट कॉन्ट्रैक्ट, तकनीकी विफलताओं, त्रुटियों और कमजोरियों से जुड़े जोखिम हैं जो धन की हानि का कारण बन सकते हैं।",

    // Contenido de sección 4
    section4_1Title: "4.1 कोई सिफारिशें नहीं:",
    section4_1Content: "${APP_NAME} पर प्रदान की गई जानकारी केवल सूचनात्मक उद्देश्यों के लिए है और वित्तीय, निवेश या कर सलाह का गठन नहीं करती है। हम किसी विशिष्ट निवेश रणनीति की सिफारिश नहीं करते हैं।",
    section4_2Title: "4.2 स्वतंत्र निर्णय:",
    section4_2Content: "आपको अपने व्यक्तिगत शोध के आधार पर अपने निवेश निर्णय लेने चाहिए और किसी भी निवेश करने से पहले योग्य वित्तीय पेशेवरों से सलाह लेने पर विचार करना चाहिए।",

    // Contenido de sección 5
    section5_1Title: "5.1 वारंटी की सीमा:",
    section5_1Content: "${APP_NAME} किसी भी प्रकार की वारंटी के बिना, चाहे स्पष्ट हो या निहित, 'जैसा है' और 'जैसा उपलब्ध है' प्रदान किया जाता है।",
    section5_2Title: "5.2 देयता का बहिष्करण:",
    section5_2Content: "कानून द्वारा अनुमत अधिकतम सीमा तक, हम किसी भी प्रत्यक्ष, अप्रत्यक्ष, आकस्मिक, विशेष, परिणामी या दंडात्मक क्षति, या लाभ या राजस्व के किसी भी नुकसान के लिए उत्तरदायी नहीं होंगे।",
    section5_3Title: "5.3 मान्य जोखिम:",
    section5_3Content: "आप हमारे प्लेटफॉर्म के उपयोग से संबंधित सभी जोखिमों को मानते हैं, जिसमें क्रिप्टोकरेंसी मूल्य की अस्थिरता और संभावित वित्तीय हानि शामिल है, लेकिन इन्हीं तक सीमित नहीं है।",
    section5_4Title: "5.4 तीसरे पक्ष के लिए कोई देयता नहीं:",
    section5_4Content: "हम अन्य उपयोगकर्ताओं या Uniswap जैसे प्रोटोकॉल सहित तीसरे पक्ष के कार्यों, सामग्री, जानकारी या डेटा के लिए जिम्मेदार नहीं हैं।",

    // Contenido de sección 6
    section6_1Title: "6.1 संपत्ति नियंत्रण:",
    section6_1Content: "${APP_NAME} एक गैर-अभिरक्षा प्लेटफॉर्म के रूप में कार्य करता है, जिसका अर्थ है कि हम उपयोगकर्ताओं की डिजिटल संपत्तियों के लिए निजी कुंजियां, बीज वाक्यांश, रिकवरी कुंजियां या अन्य एक्सेस डेटा संग्रहीत नहीं करते हैं या उन तक पहुंच नहीं रखते हैं।",
    section6_2Title: "6.2 उपयोगकर्ता की जिम्मेदारी:",
    section6_2Content: "आप हर समय अपनी डिजिटल संपत्तियों पर पूर्ण नियंत्रण और जिम्मेदारी बनाए रखते हैं। आपकी वॉलेट क्रेडेंशियल्स और संपत्तियों को सुरक्षित और संरक्षित करना आपकी एकमात्र जिम्मेदारी है।",

    // Contenido de sección 7
    section7_1Title: "7.1 सटीकता प्रयास:",
    section7_1Content: "हम सटीक और अप-टू-डेट जानकारी प्रदान करने का प्रयास करते हैं, हालांकि, हम प्लेटफॉर्म पर प्रदान की गई किसी भी जानकारी की सटीकता, पूर्णता, समयबद्धता या विश्वसनीयता की गारंटी नहीं देते हैं।",
    section7_2Title: "7.2 तृतीय पक्ष डेटा:",
    section7_2Content: "हमारे प्लेटफॉर्म पर प्रदर्शित जानकारी का एक हिस्सा मूल्य ओरेकल्स, DeFi प्रोटोकॉल और ब्लॉकचेन एपीआई जैसे तृतीय पक्ष स्रोतों से आता है। हम इन डेटा में त्रुटियों या अशुद्धियों के लिए कोई जिम्मेदारी नहीं लेते हैं।",

    // Contenido de sección 8
    section8_1Title: "8.1 उपयोगकर्ता की जिम्मेदारी:",
    section8_1Content: "क्रिप्टोकरेंसी और DeFi सेवाओं के उपयोग के संबंध में अपने क्षेत्राधिकार में लागू सभी कानूनों, नियमों और विनियमों को समझना और उनका पालन करना आपकी जिम्मेदारी है।",
    section8_2Title: "8.2 न्यायिक प्रतिबंध:",
    section8_2Content: "कुछ क्षेत्राधिकारों में ${APP_NAME} तक पहुंच कानूनी नहीं हो सकती है। आप अपने क्षेत्राधिकार के कानूनों के अनुसार हमारे प्लेटफॉर्म का उपयोग करने के लिए अधिकृत हैं या नहीं, यह निर्धारित करने के लिए आप जिम्मेदार हैं।",

    // Contenido de sección 9
    section9Content: "हम किसी भी समय अपने विवेकाधिकार पर इस कानूनी अस्वीकरण को संशोधित करने का अधिकार सुरक्षित रखते हैं। संशोधन प्लेटफॉर्म पर उनके प्रकाशन के तुरंत बाद प्रभावी होंगे। किसी भी संशोधन के बाद ${APP_NAME} का आपका निरंतर उपयोग अपडेट की गई शर्तों की आपकी स्वीकृति का गठन करेगा।",

    // Contenido de sección 10
    section10Content: "यह कानूनी अस्वीकरण दुबई, संयुक्त अरब अमीरात के कानूनों के अनुसार शासित और व्याख्या की जाती है, बिना कानूनों के संघर्ष के प्रावधानों पर विचार किए। इस नोटिस या ${APP_NAME} के आपके उपयोग से उत्पन्न होने वाला कोई भी विवाद दुबई के न्यायालयों के विशेष क्षेत्राधिकार के अधीन होगा।",

    // Contenido de sección 11
    section11Content: "यदि आपके पास इस कानूनी अस्वीकरण के बारे में कोई प्रश्न हैं, तो आप हमसे यहां संपर्क कर सकते हैं:",
    section11Address: "Elysium Media FZCO\nID: 58510, Premises no. 58510 - 001\nIFZA Business Park, DDP\nDUBAI, United Arab Emirates"
  },
  zh: {
    disclaimerTitle: "法律免责声明",
    lastUpdated: "最后更新日期：2021年4月2日",
    contentIndex: "目录",
    section1Title: "1. 接受免责声明",
    section2Title: "2. 平台性质",
    section3Title: "3. 投资风险",
    section4Title: "4. 非财务建议",
    section5Title: "5. 责任限制",
    section6Title: "6. 非托管机制",
    section7Title: "7. 信息准确性",
    section8Title: "8. 监管合规",
    section9Title: "9. 免责声明变更",
    section10Title: "10. 适用法律",
    section11Title: "11. 联系方式",

    // Contenido de sección 1
    section1_1Title: "1.1 使用条款：",
    section1_1Content: "通过访问或使用${APP_NAME}，您同意受此法律免责声明的法律约束。如果您不同意任何条款，您必须立即停止使用本平台。",
    section1_2Title: "1.2 法律能力：",
    section1_2Content: "使用我们的平台，即表示您声明您具有接受这些条款的法律能力，并且您至少年满18岁。",

    // Contenido de sección 2
    section2_1Title: "2.1 服务描述：",
    section2_1Content: "${APP_NAME}是一个去中心化平台，旨在简化Uniswap等DeFi协议中的流动性优化。我们提供工具来管理集中流动性仓位，但我们对底层协议没有直接控制权。",
    section2_2Title: "2.2 实验性质：",
    section2_2Content: "您承认区块链技术、DeFi和智能合约具有实验性质。${APP_NAME}在一个不断发展的技术空间中运营，该空间存在重大技术风险。",

    // Contenido de sección 3
    section3_1Title: "3.1 固有风险：",
    section3_1Content: "与加密货币相关的所有活动，包括提供流动性，都涉及高风险。加密货币价值可能会大幅波动，您可能会损失部分或全部投资。",
    section3_2Title: "3.2 无常损失：",
    section3_2Content: "尽管我们有优化算法，但提供流动性时无常损失是固有风险。我们的策略旨在最小化，但不能完全消除这种风险。",
    section3_3Title: "3.3 技术风险：",
    section3_3Content: "存在与智能合约、技术故障、错误和漏洞相关的风险，这些风险可能导致资金损失。",

    // Contenido de sección 4
    section4_1Title: "4.1 无推荐：",
    section4_1Content: "${APP_NAME}提供的信息仅用于信息目的，不构成财务、投资或税务建议。我们不推荐任何特定的投资策略。",
    section4_2Title: "4.2 独立决策：",
    section4_2Content: "您应基于个人研究做出投资决策，并考虑在投资前咨询合格的财务专业人士。",

    // Contenido de sección 5
    section5_1Title: "5.1 保证限制：",
    section5_1Content: "${APP_NAME}按'原样'和'可用性'提供，没有任何明示或暗示的保证。",
    section5_2Title: "5.2 责任排除：",
    section5_2Content: "在法律允许的最大范围内，我们不对任何直接、间接、附带、特殊、后果性或惩罚性损害，或任何利润或收入损失负责。",
    section5_3Title: "5.3 已接受风险：",
    section5_3Content: "您承担使用我们平台相关的所有风险，包括但不限于加密货币价格波动和潜在财务损失。",
    section5_4Title: "5.4 无第三方责任：",
    section5_4Content: "我们不对第三方的行动、内容、信息或数据负责，包括其他用户或Uniswap等协议。",

    // Contenido de sección 6
    section6_1Title: "6.1 资产控制：",
    section6_1Content: "${APP_NAME}作为非托管平台运营，这意味着我们不存储或无权访问用户的私钥、助记词、恢复密钥或其他数字资产访问数据。",
    section6_2Title: "6.2 用户责任：",
    section6_2Content: "您始终保持对数字资产的完全控制和责任。保护和安全您的钱包凭证和资产是您的唯一责任。",

    // Contenido de sección 7
    section7_1Title: "7.1 准确性努力：",
    section7_1Content: "我们努力提供准确和最新的信息，但不保证平台提供的任何信息的准确性、完整性、及时性或可靠性。",
    section7_2Title: "7.2 第三方数据：",
    section7_2Content: "我们平台展示的部分信息来自第三方来源，如价格预言机、DeFi协议和区块链API。我们不承担这些数据中错误或不准确的责任。",

    // Contenido de sección 8
    section8_1Title: "8.1 用户责任：",
    section8_1Content: "您有责任了解并遵守您司法管辖区内有关使用加密货币和DeFi服务的所有适用法律、规则和规定。",
    section8_2Title: "8.2 司法管辖区限制：",
    section8_2Content: "在某些司法管辖区，访问${APP_NAME}可能不合法。您有责任确定根据您司法管辖区的法律，您是否被授权使用我们的平台。",

    // Contenido de sección 9
    section9Content: "我们保留随时自行修改本法律免责声明的权利。修改将在平台上发布后立即生效。任何修改后继续使用${APP_NAME}将构成您对更新条款的接受。",

    // Contenido de sección 10
    section10Content: "本法律免责声明受阿拉伯联合酋长国迪拜法律管辖并按其解释，不考虑法律冲突规定。因本声明或您使用${APP_NAME}而产生的任何争议均受迪拜法院的专属管辖。",

    // Contenido de sección 11
    section11Content: "如果您对本法律免责声明有任何疑问，可以通过以下方式联系我们：",
    section11Address: "Elysium Media FZCO\nID: 58510, Premises no. 58510 - 001\nIFZA Business Park, DDP\nDUBAI, United Arab Emirates"
  }
};

// Traducciones para cada idioma
const translations: Record<Language, LandingTranslations> = {
  // Español
  es: {
    // Header/Nav
    howItWorks: "Cómo funciona",
    lastUpdated: "Última actualización: 2 de abril de 2021",
    algorithm: "Algoritmo",
    features: "Características",
    riskReturn: "Riesgo/Retorno",
    referrals: "Referidos",
    faq: "FAQ",
    accessDashboard: "Acceder a Dashboard",
    
    // Liquidity Pools section
    liquidityPoolsTitle: "Pools de Liquidez",
    liquidityPoolsDescription: "Esta página muestra todos los pools de liquidez disponibles para agregar liquidez. Cada pool muestra datos en tiempo real de Uniswap y otros DEXes. Haz clic en una tarjeta de pool para ver información más detallada.",
    viewAllPools: "Ver todos los pools",
    totalValueLocked: "Valor Total Bloqueado en Todos los Pools",
    
    // Rewards Simulator section
    rewardsSimulatorTitle: "Simulador de Rentabilidad",
    rewardsSimulatorSubtitle: "Calcula tus potenciales beneficios con diferentes estrategias de liquidez",
    learnMore: "Conocer más",
    
    // Hero section
    heroTitle: "Optimiza tu Liquidez en Uniswap V4",
    heroSubtitle: "${APP_NAME} gestiona de forma inteligente tus posiciones de liquidez concentrada, minimizando pérdidas impermanentes y maximizando rendimientos.",
    getStarted: "Comenzar ahora",
    
    // Feature cards
    minimizeRisks: "Minimiza Riesgos",
    minimizeRisksDesc: "Algoritmos avanzados para reducir pérdidas impermanentes en hasta un 95%.",
    maximizeYields: "Maximiza Rendimientos",
    maximizeYieldsDesc: "Posiciones de liquidez concentrada que generan hasta 3x más en tarifas.",
    fullControl: "Control Total",
    fullControlDesc: "Solución no-custodial que te mantiene en control de tus activos en todo momento.",
    
    // How it works section
    howItWorksTitle: "Cómo Funciona",
    howItWorksSubtitle: "${APP_NAME} utiliza contratos inteligentes en Uniswap V4 para optimizar tus posiciones de liquidez.",
    viewFullDocumentation: "Ver documentación técnica completa",
    step1Title: "Depósito de Activos",
    step1Desc: "Deposita tus criptomonedas en pares compatibles con Uniswap V4 para crear posiciones de liquidez.",
    step2Title: "Gestión Inteligente",
    step2Desc: "Nuestros contratos inteligentes monitorean el mercado y ajustan automáticamente el rango de precios.",
    step3Title: "Cosecha de Rendimientos",
    step3Desc: "Genera ingresos pasivos a través de tarifas de trading y mantén el control total sobre tus activos.",
    
    // Features section
    featuresTitle: "Características",
    featuresSubtitle: "Diseñado para maximizar tu experiencia DeFi con herramientas avanzadas y control intuitivo.",
    feature1Title: "Optimización de Rango",
    feature1Desc: "Algoritmos que ajustan el rango de precios para maximizar el rendimiento y reducir pérdidas impermanentes.",
    feature2Title: "Automatización Inteligente",
    feature2Desc: "Rebalanceo automático basado en condiciones de mercado y análisis predictivo.",
    feature3Title: "Control No-Custodial",
    feature3Desc: "Mantén la propiedad completa de tus activos en todo momento sin intermediarios.",
    feature4Title: "Analytics Avanzados",
    feature4Desc: "Panel de control detallado para visualizar rendimientos, posiciones y métricas importantes.",
    
    // Risk/Return section
    riskReturnTitle: "Configura tu Perfil de Riesgo/Retorno",
    riskReturnSubtitle: "${APP_NAME} te permite personalizar tu estrategia según tu tolerancia al riesgo y objetivos de rendimiento.",
    conservativeTitle: "Perfil Conservador",
    conservativeDesc: "Prioriza la preservación del capital con rangos de precio más amplios y menor riesgo.",
    conservativeItem1: "APR estimado: 10-25%",
    conservativeItem2: "Riesgo de pérdida impermanente: Bajo",
    conservativeItem3: "Liquidez durante fluctuaciones: Alta",
    moderateTitle: "Perfil Moderado",
    moderateDesc: "Balance óptimo entre crecimiento y riesgo, ajustando dinámicamente el rango de precios.",
    moderateItem1: "APR estimado: 25-75%",
    moderateItem2: "Riesgo de pérdida impermanente: Medio",
    moderateItem3: "Rebalanceo automático: Semanal",
    aggressiveTitle: "Perfil Agresivo",
    aggressiveDesc: "Enfocado en maximizar rendimientos con un rango de precios más estrecho y gestión activa.",
    aggressiveItem1: "APR estimado: 75-200%+",
    aggressiveItem2: "Riesgo de pérdida impermanente: Alto",
    aggressiveItem3: "Rebalanceo automático: Diario",
    selectBtn: "Seleccionar",
    popular: "Popular",
    
    // Referral section
    referralTitle: "Multiplica tus Ganancias con Referidos",
    referralSubtitle: "Forma parte de nuestra comunidad de referidos y obtén recompensas por invitar a otros a unirse",
    referralCardTitle1: "Hasta 4.5% en Comisiones",
    referralCardDesc1: "Gana comisiones por cada rendimiento generado por tus referidos, pagadas directamente en USDC",
    referralCardTitle2: "Sistema de Rangos Gamificado",
    referralCardDesc2: "Progresa desde Rookie hasta Champion mientras aumentan tus recompensas con cada nivel",
    referralCardTitle3: "Beneficio Mutuo",
    referralCardDesc3: "Tus amigos también ganan con un aumento del 1% en APR para todas sus posiciones",
    referralCtaButton: "Únete al Programa",
    referralCtaSecondary: "Más Información",
    referralHighlight: "¡Hasta $25,000!",
    referralHighlightText: "Es lo que algunos usuarios ya han ganado con sus referidos",
    
    // FAQ section
    faqTitle: "Preguntas Frecuentes",
    faqSubtitle: "Respuestas a las consultas más comunes sobre ${APP_NAME} y cómo funciona.",
    faqQuestion1: "¿Qué es ${APP_NAME}?",
    faqAnswer1: "${APP_NAME} es una aplicación descentralizada (dApp) que optimiza posiciones de liquidez en Uniswap V4, minimizando pérdidas impermanentes y maximizando rendimientos a través de algoritmos inteligentes.",
    faqQuestion2: "¿Cómo se minimiza la pérdida impermanente?",
    faqAnswer2: "Nuestros contratos inteligentes mantienen la liquidez concentrada en un rango de precios optimizado, ajustándolo automáticamente según las condiciones del mercado para reducir el impacto de las fluctuaciones.",
    faqQuestion3: "¿Es seguro usar ${APP_NAME}?",
    faqAnswer3: "${APP_NAME} es una solución no-custodial, lo que significa que mantienes el control total de tus activos. Nuestros contratos han sido auditados por empresas de seguridad líderes en la industria.",
    faqQuestion4: "¿Qué pares de tokens puedo utilizar?",
    faqAnswer4: "Actualmente soportamos los principales pares en Uniswap V4, incluyendo ETH-USDT, ETH-USDC, ETH-DAI y otros pares de alta liquidez. Estamos constantemente expandiendo nuestra oferta.",
    
    // CTA section
    ctaTitle: "Empieza a Optimizar tu Liquidez Hoy",
    ctaSubtitle: "Únete a miles de inversores que ya están maximizando sus rendimientos con nuestra plataforma.",
    
    // Footer
    footerTagline: "Optimización inteligente de liquidez en Uniswap V4.",
    platform: "Plataforma",
    dashboard: "Dashboard",
    positions: "Posiciones",
    analytics: "Analíticas",
    resources: "Recursos",
    documentation: "Documentación",
    support: "Soporte",
    community: "Comunidad",
    legal: "Legal",
    termsOfUse: "Términos de uso",
    privacyPolicy: "Política de privacidad",
    disclaimer: "Aviso legal",
    copyright: "© 2025 ${APP_NAME}. Todos los derechos reservados."
  },
  
  // Inglés
  en: {
    // Header/Nav
    howItWorks: "How It Works",
    lastUpdated: "Last updated: April 2, 2021",
    algorithm: "Algorithm",
    features: "Features",
    riskReturn: "Risk/Return",
    referrals: "Referrals",
    faq: "FAQ",
    accessDashboard: "Access Dashboard",
    learnMore: "Learn More",
    
    // Liquidity Pools section
    liquidityPoolsTitle: "Liquidity Pools",
    liquidityPoolsDescription: "This page displays all the available liquidity pools for adding liquidity. Each pool shows real-time data from Uniswap and other DEXes. Click on a pool card to see more detailed information.",
    viewAllPools: "View All Pools",
    totalValueLocked: "Total Value Locked Across All Pools",
    
    // Rewards Simulator section
    rewardsSimulatorTitle: "Profitability Simulator",
    rewardsSimulatorSubtitle: "Calculate your potential benefits with different liquidity strategies",
    
    // Hero section
    heroTitle: "Optimize Your Liquidity on Uniswap V4",
    heroSubtitle: "${APP_NAME} intelligently manages your concentrated liquidity positions, minimizing impermanent loss and maximizing yields.",
    getStarted: "Get Started Now",
    
    // Feature cards
    minimizeRisks: "Minimize Risks",
    minimizeRisksDesc: "Advanced algorithms to reduce impermanent losses by up to 95%.",
    maximizeYields: "Maximize Yields",
    maximizeYieldsDesc: "Concentrated liquidity positions that generate up to 3x more in fees.",
    fullControl: "Full Control",
    fullControlDesc: "Non-custodial solution that keeps you in control of your assets at all times.",
    
    // How it works section
    howItWorksTitle: "How It Works",
    howItWorksSubtitle: "${APP_NAME} uses smart contracts on Uniswap V4 to optimize your liquidity positions.",
    viewFullDocumentation: "View Full Technical Documentation",
    step1Title: "Asset Deposit",
    step1Desc: "Deposit your cryptocurrencies in Uniswap V4 compatible pairs to create liquidity positions.",
    step2Title: "Intelligent Management",
    step2Desc: "Our smart contracts monitor the market and automatically adjust the price range.",
    step3Title: "Yield Harvesting",
    step3Desc: "Generate passive income through trading fees and maintain full control over your assets.",
    
    // Features section
    featuresTitle: "Features",
    featuresSubtitle: "Designed to maximize your DeFi experience with advanced tools and intuitive control.",
    feature1Title: "Range Optimization",
    feature1Desc: "Algorithms that adjust the price range to maximize yield and reduce impermanent losses.",
    feature2Title: "Smart Automation",
    feature2Desc: "Automatic rebalancing based on market conditions and predictive analysis.",
    feature3Title: "Non-Custodial Control",
    feature3Desc: "Maintain complete ownership of your assets at all times without intermediaries.",
    feature4Title: "Advanced Analytics",
    feature4Desc: "Detailed dashboard to visualize yields, positions, and important metrics.",
    
    // Risk/Return section
    riskReturnTitle: "Configure Your Risk/Return Profile",
    riskReturnSubtitle: "${APP_NAME} allows you to customize your strategy according to your risk tolerance and yield objectives.",
    conservativeTitle: "Conservative Profile",
    conservativeDesc: "Prioritizes capital preservation with wider price ranges and lower risk.",
    conservativeItem1: "Estimated APR: 10-25%",
    conservativeItem2: "Impermanent loss risk: Low",
    conservativeItem3: "Liquidity during fluctuations: High",
    moderateTitle: "Moderate Profile",
    moderateDesc: "Optimal balance between growth and risk, dynamically adjusting the price range.",
    moderateItem1: "Estimated APR: 25-75%",
    moderateItem2: "Impermanent loss risk: Medium",
    moderateItem3: "Automatic rebalancing: Weekly",
    aggressiveTitle: "Aggressive Profile",
    aggressiveDesc: "Focused on maximizing returns with a narrower price range and active management.",
    aggressiveItem1: "Estimated APR: 75-200%+",
    aggressiveItem2: "Impermanent loss risk: High",
    aggressiveItem3: "Automatic rebalancing: Daily",
    selectBtn: "Select",
    popular: "Popular",
    
    // Referral section
    referralTitle: "Multiply Your Earnings with Referrals",
    referralSubtitle: "Join our referral community and get rewarded for inviting others to join",
    referralCardTitle1: "Up to 4.5% in Commissions",
    referralCardDesc1: "Earn commissions for every yield generated by your referrals, paid directly in USDC",
    referralCardTitle2: "Gamified Ranking System",
    referralCardDesc2: "Progress from Rookie to Champion while your rewards increase with each level",
    referralCardTitle3: "Mutual Benefit",
    referralCardDesc3: "Your friends also win with a 1% APR boost on all their positions",
    referralCtaButton: "Join the Program",
    referralCtaSecondary: "Learn More",
    referralHighlight: "Up to $25,000!",
    referralHighlightText: "Is what some users have already earned with their referrals",
    
    // FAQ section
    faqTitle: "Frequently Asked Questions",
    faqSubtitle: "Answers to the most common questions about ${APP_NAME} and how it works.",
    faqQuestion1: "What is ${APP_NAME}?",
    faqAnswer1: "${APP_NAME} is a decentralized application (dApp) that optimizes liquidity positions on Uniswap V4, minimizing impermanent losses and maximizing yields through intelligent algorithms.",
    faqQuestion2: "How is impermanent loss minimized?",
    faqAnswer2: "Our smart contracts keep liquidity concentrated in an optimized price range, automatically adjusting it according to market conditions to reduce the impact of fluctuations.",
    faqQuestion3: "Is using ${APP_NAME} safe?",
    faqAnswer3: "${APP_NAME} is a non-custodial solution, which means you retain full control of your assets. Our contracts have been audited by leading security companies in the industry.",
    faqQuestion4: "Which token pairs can I use?",
    faqAnswer4: "We currently support the main pairs on Uniswap V4, including ETH-USDT, ETH-USDC, ETH-DAI, and other high-liquidity pairs. We are constantly expanding our offering.",
    
    // CTA section
    ctaTitle: "Start Optimizing Your Liquidity Today",
    ctaSubtitle: "Join thousands of investors who are already maximizing their returns with our platform.",
    
    // Footer
    footerTagline: "Intelligent liquidity optimization on Uniswap V4.",
    platform: "Platform",
    dashboard: "Dashboard",
    positions: "Positions",
    analytics: "Analytics",
    resources: "Resources",
    documentation: "Documentation",
    support: "Support",
    community: "Community",
    legal: "Legal",
    termsOfUse: "Terms of Use",
    privacyPolicy: "Privacy Policy",
    disclaimer: "Disclaimer",
    copyright: "© 2025 ${APP_NAME}. All rights reserved."
  },
  
  // Árabe (Dubai)
  ar: {
    // Header/Nav
    howItWorks: "كيف يعمل",
    algorithm: "الخوارزمية",
    features: "المميزات",
    riskReturn: "المخاطر/العائد",
    referrals: "الإحالات",
    faq: "الأسئلة الشائعة",
    accessDashboard: "الوصول إلى لوحة التحكم",
    learnMore: "اعرف المزيد",
    lastUpdated: "آخر تحديث: 2 أبريل 2021",
    
    // Liquidity Pools section
    liquidityPoolsTitle: "مجمعات السيولة",
    liquidityPoolsDescription: "تعرض هذه الصفحة جميع مجمعات السيولة المتاحة لإضافة السيولة. يعرض كل مجمع بيانات في الوقت الفعلي من Uniswap ومنصات التبادل اللامركزية الأخرى. انقر على بطاقة المجمع لمشاهدة معلومات أكثر تفصيلاً.",
    viewAllPools: "عرض جميع المجمعات",
    totalValueLocked: "إجمالي القيمة المقفلة في جميع المجمعات",
    
    // Rewards Simulator section
    rewardsSimulatorTitle: "محاكي الربحية",
    rewardsSimulatorSubtitle: "احسب فوائدك المحتملة مع استراتيجيات السيولة المختلفة",
    
    // Hero section
    heroTitle: "حسّن سيولتك على Uniswap V4",
    heroSubtitle: "يدير ${APP_NAME} مواقع السيولة المركزة بذكاء، مما يقلل الخسارة المؤقتة ويزيد العوائد.",
    getStarted: "ابدأ الآن",
    
    // Feature cards
    minimizeRisks: "تقليل المخاطر",
    minimizeRisksDesc: "خوارزميات متقدمة لتقليل الخسائر المؤقتة بنسبة تصل إلى 95٪.",
    maximizeYields: "تعظيم العوائد",
    maximizeYieldsDesc: "مواقع سيولة مركزة تولد ما يصل إلى 3 أضعاف الرسوم.",
    fullControl: "تحكم كامل",
    fullControlDesc: "حل غير وصائي يبقيك متحكمًا في أصولك في جميع الأوقات.",
    
    // How it works section
    howItWorksTitle: "كيف يعمل",
    howItWorksSubtitle: "يستخدم ${APP_NAME} العقود الذكية على Uniswap V4 لتحسين مواقع السيولة الخاصة بك.",
    viewFullDocumentation: "عرض التوثيق التقني الكامل",
    step1Title: "إيداع الأصول",
    step1Desc: "قم بإيداع عملاتك المشفرة في أزواج متوافقة مع Uniswap V4 لإنشاء مواقع سيولة.",
    step2Title: "الإدارة الذكية",
    step2Desc: "تراقب عقودنا الذكية السوق وتعدل نطاق السعر تلقائيًا.",
    step3Title: "حصاد العائدات",
    step3Desc: "توليد دخل سلبي من خلال رسوم التداول والحفاظ على التحكم الكامل في أصولك.",
    
    // Features section
    featuresTitle: "المميزات",
    featuresSubtitle: "مصمم لتحسين تجربة التمويل اللامركزي باستخدام أدوات متقدمة وتحكم بديهي.",
    feature1Title: "تحسين النطاق",
    feature1Desc: "خوارزميات تعدل نطاق السعر لتعظيم العائد وتقليل الخسائر المؤقتة.",
    feature2Title: "الأتمتة الذكية",
    feature2Desc: "إعادة التوازن التلقائي بناءً على ظروف السوق والتحليل التنبؤي.",
    feature3Title: "تحكم غير وصائي",
    feature3Desc: "حافظ على الملكية الكاملة لأصولك في جميع الأوقات بدون وسطاء.",
    feature4Title: "تحليلات متقدمة",
    feature4Desc: "لوحة تحكم مفصلة لتصور العوائد والمواقع والمقاييس المهمة.",
    
    // Risk/Return section
    riskReturnTitle: "قم بتكوين ملف المخاطر/العائد الخاص بك",
    riskReturnSubtitle: "يتيح لك ${APP_NAME} تخصيص استراتيجيتك وفقًا لتحمل المخاطر وأهداف العائد.",
    conservativeTitle: "الملف المحافظ",
    conservativeDesc: "يعطي الأولوية للحفاظ على رأس المال مع نطاقات أسعار أوسع ومخاطر أقل.",
    conservativeItem1: "APR المقدر: 10-25٪",
    conservativeItem2: "خطر الخسارة المؤقتة: منخفض",
    conservativeItem3: "السيولة أثناء التقلبات: عالية",
    moderateTitle: "الملف المعتدل",
    moderateDesc: "توازن مثالي بين النمو والمخاطر، مع تعديل نطاق السعر ديناميكيًا.",
    moderateItem1: "APR المقدر: 25-75٪",
    moderateItem2: "خطر الخسارة المؤقتة: متوسط",
    moderateItem3: "إعادة التوازن التلقائي: أسبوعيًا",
    aggressiveTitle: "الملف العدواني",
    aggressiveDesc: "يركز على تعظيم العوائد مع نطاق أسعار أضيق وإدارة نشطة.",
    aggressiveItem1: "APR المقدر: 75-200٪+",
    aggressiveItem2: "خطر الخسارة المؤقتة: عالي",
    aggressiveItem3: "إعادة التوازن التلقائي: يوميًا",
    selectBtn: "اختيار",
    popular: "شائع",
    
    // Referral section
    referralTitle: "ضاعف أرباحك مع الإحالات",
    referralSubtitle: "انضم إلى مجتمع الإحالة لدينا واحصل على مكافآت لدعوة الآخرين للانضمام",
    referralCardTitle1: "عمولات تصل إلى 4.5%",
    referralCardDesc1: "اكسب عمولات على كل عائد يولده المحالين من قبلك، مدفوعة مباشرة بعملة USDC",
    referralCardTitle2: "نظام تصنيف تفاعلي",
    referralCardDesc2: "تقدم من المبتدئ إلى البطل بينما تزداد مكافآتك مع كل مستوى",
    referralCardTitle3: "منفعة متبادلة",
    referralCardDesc3: "يستفيد أصدقاؤك أيضًا بزيادة APR بنسبة 1% على جميع مراكزهم",
    referralCtaButton: "انضم إلى البرنامج",
    referralCtaSecondary: "تعرف على المزيد",
    referralHighlight: "يصل إلى 25,000 دولار!",
    referralHighlightText: "هذا ما ربحه بعض المستخدمين بالفعل من خلال إحالاتهم",
    
    // FAQ section
    faqTitle: "الأسئلة الشائعة",
    faqSubtitle: "إجابات على الأسئلة الأكثر شيوعًا حول ${APP_NAME} وكيفية عمله.",
    faqQuestion1: "ما هو ${APP_NAME}؟",
    faqAnswer1: "${APP_NAME} هو تطبيق لامركزي (dApp) يحسن مواقع السيولة على Uniswap V4، مما يقلل الخسائر المؤقتة ويزيد العوائد من خلال خوارزميات ذكية.",
    faqQuestion2: "كيف يتم تقليل الخسارة المؤقتة؟",
    faqAnswer2: "تحافظ عقودنا الذكية على تركيز السيولة في نطاق سعر محسن، وتعديله تلقائيًا وفقًا لظروف السوق لتقليل تأثير التقلبات.",
    faqQuestion3: "هل استخدام ${APP_NAME} آمن؟",
    faqAnswer3: "${APP_NAME} هو حل غير وصائي، مما يعني أنك تحتفظ بالتحكم الكامل في أصولك. تم تدقيق عقودنا من قبل شركات أمان رائدة في الصناعة.",
    faqQuestion4: "ما هي أزواج الرموز التي يمكنني استخدامها؟",
    faqAnswer4: "نحن ندعم حاليًا الأزواج الرئيسية على Uniswap V4، بما في ذلك ETH-USDT و ETH-USDC و ETH-DAI وأزواج أخرى عالية السيولة. نحن نوسع عرضنا باستمرار.",
    
    // CTA section
    ctaTitle: "ابدأ بتحسين سيولتك اليوم",
    ctaSubtitle: "انضم إلى آلاف المستثمرين الذين يعظمون عوائدهم بالفعل مع منصتنا.",
    
    // Footer
    footerTagline: "تحسين ذكي للسيولة على Uniswap V4.",
    platform: "المنصة",
    dashboard: "لوحة التحكم",
    positions: "المواقع",
    analytics: "التحليلات",
    resources: "الموارد",
    documentation: "التوثيق",
    support: "الدعم",
    community: "المجتمع",
    legal: "قانوني",
    termsOfUse: "شروط الاستخدام",
    privacyPolicy: "سياسة الخصوصية",
    disclaimer: "إخلاء المسؤولية",
    copyright: "© 2025 ${APP_NAME}. جميع الحقوق محفوظة."
  },
  
  // Portugués
  pt: {
    // Header/Nav
    howItWorks: "Como Funciona",
    algorithm: "Algoritmo",
    features: "Recursos",
    riskReturn: "Risco/Retorno",
    referrals: "Indicações",
    faq: "FAQ",
    accessDashboard: "Acessar Dashboard",
    learnMore: "Saiba Mais",
    lastUpdated: "Última atualização: 2 de abril de 2021",
    
    // Liquidity Pools section
    liquidityPoolsTitle: "Pools de Liquidez",
    liquidityPoolsDescription: "Esta página mostra todas as pools de liquidez disponíveis para adicionar liquidez. Cada pool exibe dados em tempo real do Uniswap e outras DEXs. Clique em um cartão de pool para ver informações mais detalhadas.",
    viewAllPools: "Ver todas as pools",
    totalValueLocked: "Valor Total Bloqueado em Todas as Pools",
    
    // Rewards Simulator section
    rewardsSimulatorTitle: "Simulador de Rentabilidade",
    rewardsSimulatorSubtitle: "Calcule seus benefícios potenciais com diferentes estratégias de liquidez",
    
    // Hero section
    heroTitle: "Otimize Sua Liquidez no Uniswap V4",
    heroSubtitle: "${APP_NAME} gerencia inteligentemente suas posições de liquidez concentrada, minimizando perdas impermanentes e maximizando rendimentos.",
    getStarted: "Comece Agora",
    
    // Feature cards
    minimizeRisks: "Minimizar Riscos",
    minimizeRisksDesc: "Algoritmos avançados para reduzir perdas impermanentes em até 95%.",
    maximizeYields: "Maximizar Rendimentos",
    maximizeYieldsDesc: "Posições de liquidez concentrada que geram até 3x mais em taxas.",
    fullControl: "Controle Total",
    fullControlDesc: "Solução não-custodial que mantém você no controle de seus ativos o tempo todo.",
    
    // How it works section
    howItWorksTitle: "Como Funciona",
    howItWorksSubtitle: "${APP_NAME} usa contratos inteligentes no Uniswap V4 para otimizar suas posições de liquidez.",
    viewFullDocumentation: "Ver Documentação Técnica Completa",
    step1Title: "Depósito de Ativos",
    step1Desc: "Deposite suas criptomoedas em pares compatíveis com Uniswap V4 para criar posições de liquidez.",
    step2Title: "Gerenciamento Inteligente",
    step2Desc: "Nossos contratos inteligentes monitoram o mercado e ajustam automaticamente o intervalo de preço.",
    step3Title: "Colheita de Rendimentos",
    step3Desc: "Gere renda passiva através de taxas de negociação e mantenha controle total sobre seus ativos.",
    
    // Features section
    featuresTitle: "Recursos",
    featuresSubtitle: "Projetado para maximizar sua experiência DeFi com ferramentas avançadas e controle intuitivo.",
    feature1Title: "Otimização de Intervalo",
    feature1Desc: "Algoritmos que ajustam o intervalo de preço para maximizar o rendimento e reduzir perdas impermanentes.",
    feature2Title: "Automação Inteligente",
    feature2Desc: "Rebalanceamento automático baseado em condições de mercado e análise preditiva.",
    feature3Title: "Controle Não-Custodial",
    feature3Desc: "Mantenha propriedade completa de seus ativos em todos os momentos sem intermediários.",
    feature4Title: "Análises Avançadas",
    feature4Desc: "Painel detalhado para visualizar rendimentos, posições e métricas importantes.",
    
    // Risk/Return section
    riskReturnTitle: "Configure Seu Perfil de Risco/Retorno",
    riskReturnSubtitle: "${APP_NAME} permite personalizar sua estratégia de acordo com sua tolerância ao risco e objetivos de rendimento.",
    conservativeTitle: "Perfil Conservador",
    conservativeDesc: "Prioriza a preservação de capital com intervalos de preço mais amplos e menor risco.",
    conservativeItem1: "APR estimado: 10-25%",
    conservativeItem2: "Risco de perda impermanente: Baixo",
    conservativeItem3: "Liquidez durante flutuações: Alta",
    moderateTitle: "Perfil Moderado",
    moderateDesc: "Equilíbrio ótimo entre crescimento e risco, ajustando dinamicamente o intervalo de preço.",
    moderateItem1: "APR estimado: 25-75%",
    moderateItem2: "Risco de perda impermanente: Médio",
    moderateItem3: "Rebalanceamento automático: Semanal",
    aggressiveTitle: "Perfil Agressivo",
    aggressiveDesc: "Focado em maximizar retornos com um intervalo de preço mais estreito e gerenciamento ativo.",
    aggressiveItem1: "APR estimado: 75-200%+",
    aggressiveItem2: "Risco de perda impermanente: Alto",
    aggressiveItem3: "Rebalanceamento automático: Diário",
    selectBtn: "Selecionar",
    popular: "Popular",
    
    // Referral section
    referralTitle: "Multiplique Seus Ganhos com Indicações",
    referralSubtitle: "Junte-se à nossa comunidade de indicações e seja recompensado por convidar outros a se juntarem",
    referralCardTitle1: "Até 4,5% em Comissões",
    referralCardDesc1: "Ganhe comissões por cada rendimento gerado por suas indicações, pagas diretamente em USDC",
    referralCardTitle2: "Sistema de Ranking Gamificado",
    referralCardDesc2: "Progrida de Rookie até Champion enquanto suas recompensas aumentam com cada nível",
    referralCardTitle3: "Benefício Mútuo",
    referralCardDesc3: "Seus amigos também ganham com um aumento de 1% no APR em todas as suas posições",
    referralCtaButton: "Junte-se ao Programa",
    referralCtaSecondary: "Saiba Mais",
    referralHighlight: "Até $25.000!",
    referralHighlightText: "É o que alguns usuários já ganharam com suas indicações",
    
    // FAQ section
    faqTitle: "Perguntas Frequentes",
    faqSubtitle: "Respostas às perguntas mais comuns sobre o ${APP_NAME} e como ele funciona.",
    faqQuestion1: "O que é ${APP_NAME}?",
    faqAnswer1: "${APP_NAME} é um aplicativo descentralizado (dApp) que otimiza posições de liquidez no Uniswap V4, minimizando perdas impermanentes e maximizando rendimentos através de algoritmos inteligentes.",
    faqQuestion2: "Como a perda impermanente é minimizada?",
    faqAnswer2: "Nossos contratos inteligentes mantêm a liquidez concentrada em um intervalo de preço otimizado, ajustando-o automaticamente de acordo com as condições do mercado para reduzir o impacto das flutuações.",
    faqQuestion3: "É seguro usar o ${APP_NAME}?",
    faqAnswer3: "${APP_NAME} é uma solução não-custodial, o que significa que você mantém o controle total de seus ativos. Nossos contratos foram auditados por empresas de segurança líderes do setor.",
    faqQuestion4: "Quais pares de tokens posso usar?",
    faqAnswer4: "Atualmente suportamos os principais pares no Uniswap V4, incluindo ETH-USDT, ETH-USDC, ETH-DAI e outros pares de alta liquidez. Estamos constantemente expandindo nossa oferta.",
    
    // CTA section
    ctaTitle: "Comece a Otimizar Sua Liquidez Hoje",
    ctaSubtitle: "Junte-se a milhares de investidores que já estão maximizando seus retornos com nossa plataforma.",
    
    // Footer
    footerTagline: "Otimização inteligente de liquidez no Uniswap V4.",
    platform: "Plataforma",
    dashboard: "Dashboard",
    positions: "Posições",
    analytics: "Análises",
    resources: "Recursos",
    documentation: "Documentação",
    support: "Suporte",
    community: "Comunidade",
    legal: "Legal",
    termsOfUse: "Termos de Uso",
    privacyPolicy: "Política de Privacidade",
    disclaimer: "Aviso Legal",
    copyright: "© 2025 ${APP_NAME}. Todos os direitos reservados."
  },
  
  // Italiano
  it: {
    // Header/Nav
    howItWorks: "Come Funziona",
    algorithm: "Algoritmo",
    features: "Funzionalità",
    riskReturn: "Rischio/Rendimento",
    referrals: "Referral",
    faq: "FAQ",
    accessDashboard: "Accedi alla Dashboard",
    learnMore: "Scopri di Più",
    
    // Liquidity Pools section
    liquidityPoolsTitle: "Pool di Liquidità",
    liquidityPoolsDescription: "Questa pagina mostra tutte le pool di liquidità disponibili per aggiungere liquidità. Ogni pool mostra dati in tempo reale da Uniswap e altri DEX. Clicca su una card pool per vedere informazioni più dettagliate.",
    viewAllPools: "Visualizza tutte le pool",
    totalValueLocked: "Valore Totale Bloccato in Tutte le Pool",
    
    // Rewards Simulator section
    rewardsSimulatorTitle: "Simulatore di Redditività",
    rewardsSimulatorSubtitle: "Calcola i tuoi potenziali benefici con diverse strategie di liquidità",
    
    // Hero section
    heroTitle: "Ottimizza la Tua Liquidità su Uniswap V4",
    heroSubtitle: "${APP_NAME} gestisce intelligentemente le tue posizioni di liquidità concentrata, minimizzando le perdite impermanenti e massimizzando i rendimenti.",
    getStarted: "Inizia Ora",
    
    // Feature cards
    minimizeRisks: "Minimizza i Rischi",
    minimizeRisksDesc: "Algoritmi avanzati per ridurre le perdite impermanenti fino al 95%.",
    maximizeYields: "Massimizza i Rendimenti",
    maximizeYieldsDesc: "Posizioni di liquidità concentrata che generano fino a 3 volte di più in commissioni.",
    fullControl: "Controllo Totale",
    fullControlDesc: "Soluzione non-custodial che ti mantiene in controllo dei tuoi asset in ogni momento.",
    
    // How it works section
    howItWorksTitle: "Come Funziona",
    howItWorksSubtitle: "${APP_NAME} utilizza smart contract su Uniswap V4 per ottimizzare le tue posizioni di liquidità.",
    viewFullDocumentation: "Visualizza la Documentazione Tecnica Completa",
    step1Title: "Deposito di Asset",
    step1Desc: "Deposita le tue criptovalute in coppie compatibili con Uniswap V4 per creare posizioni di liquidità.",
    step2Title: "Gestione Intelligente",
    step2Desc: "I nostri smart contract monitorano il mercato e regolano automaticamente l'intervallo di prezzo.",
    step3Title: "Raccolta dei Rendimenti",
    step3Desc: "Genera reddito passivo attraverso le commissioni di trading e mantieni il controllo totale sui tuoi asset.",
    
    // Features section
    featuresTitle: "Funzionalità",
    featuresSubtitle: "Progettato per massimizzare la tua esperienza DeFi con strumenti avanzati e controllo intuitivo.",
    feature1Title: "Ottimizzazione dell'Intervallo",
    feature1Desc: "Algoritmi che regolano l'intervallo di prezzo per massimizzare il rendimento e ridurre le perdite impermanenti.",
    feature2Title: "Automazione Intelligente",
    feature2Desc: "Ribilanciamento automatico basato sulle condizioni di mercato e analisi predittiva.",
    feature3Title: "Controllo Non-Custodial",
    feature3Desc: "Mantieni la proprietà completa dei tuoi asset in ogni momento senza intermediari.",
    feature4Title: "Analisi Avanzate",
    feature4Desc: "Dashboard dettagliata per visualizzare rendimenti, posizioni e metriche importanti.",
    
    // Risk/Return section
    riskReturnTitle: "Configura il Tuo Profilo di Rischio/Rendimento",
    riskReturnSubtitle: "${APP_NAME} ti permette di personalizzare la tua strategia in base alla tua tolleranza al rischio e agli obiettivi di rendimento.",
    conservativeTitle: "Profilo Conservativo",
    conservativeDesc: "Dà priorità alla conservazione del capitale con intervalli di prezzo più ampi e rischio inferiore.",
    conservativeItem1: "APR stimato: 10-25%",
    conservativeItem2: "Rischio di perdita impermanente: Basso",
    conservativeItem3: "Liquidità durante le fluttuazioni: Alta",
    moderateTitle: "Profilo Moderato",
    moderateDesc: "Equilibrio ottimale tra crescita e rischio, regolando dinamicamente l'intervallo di prezzo.",
    moderateItem1: "APR stimato: 25-75%",
    moderateItem2: "Rischio di perdita impermanente: Medio",
    moderateItem3: "Ribilanciamento automatico: Settimanale",
    aggressiveTitle: "Profilo Aggressivo",
    aggressiveDesc: "Concentrato sulla massimizzazione dei rendimenti con un intervallo di prezzo più stretto e gestione attiva.",
    aggressiveItem1: "APR stimato: 75-200%+",
    aggressiveItem2: "Rischio di perdita impermanente: Alto",
    aggressiveItem3: "Ribilanciamento automatico: Giornaliero",
    selectBtn: "Seleziona",
    popular: "Popolare",
    
    // Referral section
    referralTitle: "Moltiplica i Tuoi Guadagni con i Referral",
    referralSubtitle: "Unisciti alla nostra community di referral e ottieni ricompense per aver invitato altri a unirsi",
    referralCardTitle1: "Fino al 4,5% di Commissioni",
    referralCardDesc1: "Guadagna commissioni per ogni rendimento generato dai tuoi referral, pagate direttamente in USDC",
    referralCardTitle2: "Sistema di Ranking Gamificato",
    referralCardDesc2: "Avanza da Rookie a Champion mentre le tue ricompense aumentano con ogni livello",
    referralCardTitle3: "Beneficio Reciproco",
    referralCardDesc3: "Anche i tuoi amici vincono con un aumento dell'1% dell'APR su tutte le loro posizioni",
    referralCtaButton: "Unisciti al Programma",
    referralCtaSecondary: "Scopri di Più",
    referralHighlight: "Fino a $25.000!",
    referralHighlightText: "È quanto alcuni utenti hanno già guadagnato con i loro referral",
    
    // FAQ section
    faqTitle: "Domande Frequenti",
    faqSubtitle: "Risposte alle domande più comuni su ${APP_NAME} e su come funziona.",
    faqQuestion1: "Cos'è ${APP_NAME}?",
    faqAnswer1: "${APP_NAME} è un'applicazione decentralizzata (dApp) che ottimizza le posizioni di liquidità su Uniswap V4, minimizzando le perdite impermanenti e massimizzando i rendimenti attraverso algoritmi intelligenti.",
    faqQuestion2: "Come viene minimizzata la perdita impermanente?",
    faqAnswer2: "I nostri smart contract mantengono la liquidità concentrata in un intervallo di prezzo ottimizzato, regolandolo automaticamente in base alle condizioni di mercato per ridurre l'impatto delle fluttuazioni.",
    faqQuestion3: "È sicuro usare ${APP_NAME}?",
    faqAnswer3: "${APP_NAME} è una soluzione non-custodial, il che significa che mantieni il pieno controllo dei tuoi asset. I nostri contratti sono stati sottoposti ad audit da parte delle principali società di sicurezza del settore.",
    faqQuestion4: "Quali coppie di token posso utilizzare?",
    faqAnswer4: "Attualmente supportiamo le principali coppie su Uniswap V4, inclusi ETH-USDT, ETH-USDC, ETH-DAI e altre coppie ad alta liquidità. Stiamo costantemente espandendo la nostra offerta.",
    
    // CTA section
    ctaTitle: "Inizia a Ottimizzare la Tua Liquidità Oggi",
    ctaSubtitle: "Unisciti a migliaia di investitori che stanno già massimizzando i loro rendimenti con la nostra piattaforma.",
    
    // Footer
    footerTagline: "Ottimizzazione intelligente della liquidità su Uniswap V4.",
    platform: "Piattaforma",
    dashboard: "Dashboard",
    positions: "Posizioni",
    analytics: "Analisi",
    resources: "Risorse",
    documentation: "Documentazione",
    support: "Supporto",
    community: "Comunità",
    legal: "Legale",
    termsOfUse: "Termini di utilizzo",
    privacyPolicy: "Politica sulla privacy",
    disclaimer: "Disclaimer",
    lastUpdated: "Ultimo aggiornamento: 2 aprile 2021",
    copyright: "© 2025 ${APP_NAME}. Tutti i diritti riservati."
  },
  
  // Francés
  fr: {
    // Header/Nav
    howItWorks: "Comment ça marche",
    algorithm: "Algorithme",
    features: "Fonctionnalités",
    riskReturn: "Risque/Rendement",
    referrals: "Parrainages",
    faq: "FAQ",
    accessDashboard: "Accéder au Tableau de bord",
    learnMore: "En savoir plus",
    
    // Liquidity Pools section
    liquidityPoolsTitle: "Pools de Liquidité",
    liquidityPoolsDescription: "Cette page affiche toutes les pools de liquidité disponibles pour ajouter de la liquidité. Chaque pool affiche des données en temps réel d'Uniswap et d'autres DEX. Cliquez sur une carte de pool pour voir des informations plus détaillées.",
    viewAllPools: "Voir toutes les pools",
    totalValueLocked: "Valeur Totale Verrouillée dans Toutes les Pools",
    
    // Rewards Simulator section
    rewardsSimulatorTitle: "Simulateur de Rentabilité",
    rewardsSimulatorSubtitle: "Calculez vos bénéfices potentiels avec différentes stratégies de liquidité",
    
    // Hero section
    heroTitle: "Optimisez Votre Liquidité sur Uniswap V4",
    heroSubtitle: "${APP_NAME} gère intelligemment vos positions de liquidité concentrée, minimisant les pertes impermanentes et maximisant les rendements.",
    getStarted: "Commencer Maintenant",
    
    // Feature cards
    minimizeRisks: "Minimiser les Risques",
    minimizeRisksDesc: "Algorithmes avancés pour réduire les pertes impermanentes jusqu'à 95%.",
    maximizeYields: "Maximiser les Rendements",
    maximizeYieldsDesc: "Positions de liquidité concentrée qui génèrent jusqu'à 3 fois plus de frais.",
    fullControl: "Contrôle Total",
    fullControlDesc: "Solution non-custodiale qui vous garde en contrôle de vos actifs à tout moment.",
    
    // How it works section
    howItWorksTitle: "Comment ça marche",
    howItWorksSubtitle: "${APP_NAME} utilise des smart contracts sur Uniswap V4 pour optimiser vos positions de liquidité.",
    viewFullDocumentation: "Voir la Documentation Technique Complète",
    step1Title: "Dépôt d'Actifs",
    step1Desc: "Déposez vos cryptomonnaies dans des paires compatibles avec Uniswap V4 pour créer des positions de liquidité.",
    step2Title: "Gestion Intelligente",
    step2Desc: "Nos smart contracts surveillent le marché et ajustent automatiquement la plage de prix.",
    step3Title: "Récolte des Rendements",
    step3Desc: "Générez des revenus passifs grâce aux frais de trading et conservez un contrôle total sur vos actifs.",
    
    // Features section
    featuresTitle: "Fonctionnalités",
    featuresSubtitle: "Conçu pour maximiser votre expérience DeFi avec des outils avancés et un contrôle intuitif.",
    feature1Title: "Optimisation de Plage",
    feature1Desc: "Algorithmes qui ajustent la plage de prix pour maximiser le rendement et réduire les pertes impermanentes.",
    feature2Title: "Automatisation Intelligente",
    feature2Desc: "Rééquilibrage automatique basé sur les conditions du marché et l'analyse prédictive.",
    feature3Title: "Contrôle Non-Custodial",
    feature3Desc: "Conservez la propriété complète de vos actifs à tout moment sans intermédiaires.",
    feature4Title: "Analytique Avancée",
    feature4Desc: "Tableau de bord détaillé pour visualiser les rendements, positions et métriques importantes.",
    
    // Risk/Return section
    riskReturnTitle: "Configurez Votre Profil de Risque/Rendement",
    riskReturnSubtitle: "${APP_NAME} vous permet de personnaliser votre stratégie selon votre tolérance au risque et vos objectifs de rendement.",
    conservativeTitle: "Profil Conservateur",
    conservativeDesc: "Privilégie la préservation du capital avec des plages de prix plus larges et un risque moindre.",
    conservativeItem1: "APR estimé: 10-25%",
    conservativeItem2: "Risque de perte impermanente: Faible",
    conservativeItem3: "Liquidité pendant les fluctuations: Élevée",
    moderateTitle: "Profil Modéré",
    moderateDesc: "Équilibre optimal entre croissance et risque, ajustant dynamiquement la plage de prix.",
    moderateItem1: "APR estimé: 25-75%",
    moderateItem2: "Risque de perte impermanente: Moyen",
    moderateItem3: "Rééquilibrage automatique: Hebdomadaire",
    aggressiveTitle: "Profil Agressif",
    aggressiveDesc: "Focalisé sur la maximisation des rendements avec une plage de prix plus étroite et une gestion active.",
    aggressiveItem1: "APR estimé: 75-200%+",
    aggressiveItem2: "Risque de perte impermanente: Élevé",
    aggressiveItem3: "Rééquilibrage automatique: Quotidien",
    selectBtn: "Sélectionner",
    popular: "Populaire",
    
    // Referral section
    referralTitle: "Multipliez Vos Gains avec les Parrainages",
    referralSubtitle: "Rejoignez notre communauté de parrainage et soyez récompensé pour inviter d'autres à nous rejoindre",
    referralCardTitle1: "Jusqu'à 4,5% de Commissions",
    referralCardDesc1: "Gagnez des commissions sur chaque rendement généré par vos filleuls, payées directement en USDC",
    referralCardTitle2: "Système de Classement Ludifié",
    referralCardDesc2: "Progressez de Rookie à Champion tandis que vos récompenses augmentent avec chaque niveau",
    referralCardTitle3: "Bénéfice Mutuel",
    referralCardDesc3: "Vos amis bénéficient également d'une augmentation de 1% d'APR sur toutes leurs positions",
    referralCtaButton: "Rejoindre le Programme",
    referralCtaSecondary: "En Savoir Plus",
    referralHighlight: "Jusqu'à 25 000 $!",
    referralHighlightText: "C'est ce que certains utilisateurs ont déjà gagné grâce à leurs parrainages",
    
    // FAQ section
    faqTitle: "Questions Fréquemment Posées",
    faqSubtitle: "Réponses aux questions les plus courantes sur ${APP_NAME} et son fonctionnement.",
    faqQuestion1: "Qu'est-ce que ${APP_NAME}?",
    faqAnswer1: "${APP_NAME} est une application décentralisée (dApp) qui optimise les positions de liquidité sur Uniswap V4, minimisant les pertes impermanentes et maximisant les rendements grâce à des algorithmes intelligents.",
    faqQuestion2: "Comment la perte impermanente est-elle minimisée?",
    faqAnswer2: "Nos smart contracts maintiennent la liquidité concentrée dans une plage de prix optimisée, l'ajustant automatiquement selon les conditions du marché pour réduire l'impact des fluctuations.",
    faqQuestion3: "Est-il sûr d'utiliser ${APP_NAME}?",
    faqAnswer3: "${APP_NAME} est une solution non-custodiale, ce qui signifie que vous conservez le contrôle total de vos actifs. Nos contrats ont été audités par des entreprises de sécurité leaders de l'industrie.",
    faqQuestion4: "Quelles paires de tokens puis-je utiliser?",
    faqAnswer4: "Nous prenons actuellement en charge les principales paires sur Uniswap V4, y compris ETH-USDT, ETH-USDC, ETH-DAI et d'autres paires à haute liquidité. Nous élargissons constamment notre offre.",
    
    // CTA section
    ctaTitle: "Commencez à Optimiser Votre Liquidité Aujourd'hui",
    ctaSubtitle: "Rejoignez des milliers d'investisseurs qui maximisent déjà leurs rendements avec notre plateforme.",
    
    // Footer
    footerTagline: "Optimisation intelligente de la liquidité sur Uniswap V4.",
    platform: "Plateforme",
    dashboard: "Tableau de bord",
    positions: "Positions",
    analytics: "Analytique",
    resources: "Ressources",
    documentation: "Documentation",
    support: "Support",
    community: "Communauté",
    legal: "Juridique",
    termsOfUse: "Conditions d'utilisation",
    privacyPolicy: "Politique de confidentialité",
    lastUpdated: "Dernière mise à jour: 2 avril 2021",
    disclaimer: "Avertissement",
    copyright: "© 2025 ${APP_NAME}. Tous droits réservés."
  },
  
  // Alemán
  de: {
    // Header/Nav
    howItWorks: "Wie es funktioniert",
    algorithm: "Algorithmus",
    features: "Funktionen",
    riskReturn: "Risiko/Ertrag",
    referrals: "Empfehlungen",
    faq: "FAQ",
    accessDashboard: "Dashboard aufrufen",
    learnMore: "Mehr erfahren",
    
    // Liquidity Pools section
    liquidityPoolsTitle: "Liquiditätspools",
    liquidityPoolsDescription: "Diese Seite zeigt alle verfügbaren Liquiditätspools zum Hinzufügen von Liquidität an. Jeder Pool zeigt Echtzeitdaten von Uniswap und anderen DEXes. Klicken Sie auf eine Pool-Karte, um detailliertere Informationen zu sehen.",
    viewAllPools: "Alle Pools anzeigen",
    totalValueLocked: "Gesamtwert in allen Pools gesperrt",
    
    // Rewards Simulator section
    rewardsSimulatorTitle: "Rentabilitätsrechner",
    rewardsSimulatorSubtitle: "Berechnen Sie Ihre potentiellen Vorteile mit verschiedenen Liquiditätsstrategien",
    
    // Hero section
    heroTitle: "Optimieren Sie Ihre Liquidität auf Uniswap V4",
    heroSubtitle: "${APP_NAME} verwaltet intelligent Ihre konzentrierten Liquiditätspositionen, minimiert temporäre Verluste und maximiert die Renditen.",
    getStarted: "Jetzt beginnen",
    
    // Feature cards
    minimizeRisks: "Risiken minimieren",
    minimizeRisksDesc: "Fortschrittliche Algorithmen zur Reduzierung temporärer Verluste um bis zu 95%.",
    maximizeYields: "Renditen maximieren",
    maximizeYieldsDesc: "Konzentrierte Liquiditätspositionen, die bis zu 3-mal mehr an Gebühren generieren.",
    fullControl: "Volle Kontrolle",
    fullControlDesc: "Nicht-verwahrende Lösung, die Ihnen jederzeit die Kontrolle über Ihre Assets gibt.",
    
    // How it works section
    howItWorksTitle: "Wie es funktioniert",
    howItWorksSubtitle: "${APP_NAME} verwendet Smart Contracts auf Uniswap V4, um Ihre Liquiditätspositionen zu optimieren.",
    viewFullDocumentation: "Vollständige technische Dokumentation anzeigen",
    step1Title: "Asset-Einzahlung",
    step1Desc: "Zahlen Sie Ihre Kryptowährungen in Uniswap V4-kompatible Paare ein, um Liquiditätspositionen zu erstellen.",
    step2Title: "Intelligentes Management",
    step2Desc: "Unsere Smart Contracts überwachen den Markt und passen den Preisbereich automatisch an.",
    step3Title: "Rendite-Ernte",
    step3Desc: "Generieren Sie passives Einkommen durch Handelsgebühren und behalten Sie die volle Kontrolle über Ihre Assets.",
    
    // Features section
    featuresTitle: "Funktionen",
    featuresSubtitle: "Entwickelt, um Ihre DeFi-Erfahrung mit fortschrittlichen Tools und intuitiver Steuerung zu maximieren.",
    feature1Title: "Bereichsoptimierung",
    feature1Desc: "Algorithmen, die den Preisbereich anpassen, um die Rendite zu maximieren und temporäre Verluste zu reduzieren.",
    feature2Title: "Intelligente Automatisierung",
    feature2Desc: "Automatische Neugewichtung basierend auf Marktbedingungen und prädiktiver Analyse.",
    feature3Title: "Nicht-verwahrende Kontrolle",
    feature3Desc: "Behalten Sie jederzeit das vollständige Eigentum an Ihren Assets ohne Zwischenhändler.",
    feature4Title: "Erweiterte Analytik",
    feature4Desc: "Detailliertes Dashboard zur Visualisierung von Renditen, Positionen und wichtigen Metriken.",
    
    // Risk/Return section
    riskReturnTitle: "Konfigurieren Sie Ihr Risiko/Ertrags-Profil",
    riskReturnSubtitle: "${APP_NAME} ermöglicht es Ihnen, Ihre Strategie entsprechend Ihrer Risikobereitschaft und Renditeziele anzupassen.",
    conservativeTitle: "Konservatives Profil",
    conservativeDesc: "Priorisiert Kapitalerhalt mit breiteren Preisbereichen und geringerem Risiko.",
    conservativeItem1: "Geschätzter APR: 10-25%",
    conservativeItem2: "Risiko temporärer Verluste: Niedrig",
    conservativeItem3: "Liquidität während Schwankungen: Hoch",
    moderateTitle: "Moderates Profil",
    moderateDesc: "Optimales Gleichgewicht zwischen Wachstum und Risiko, dynamische Anpassung des Preisbereichs.",
    moderateItem1: "Geschätzter APR: 25-75%",
    moderateItem2: "Risiko temporärer Verluste: Mittel",
    moderateItem3: "Automatische Neugewichtung: Wöchentlich",
    aggressiveTitle: "Aggressives Profil",
    aggressiveDesc: "Fokussiert auf Renditemaximierung mit einem engeren Preisbereich und aktivem Management.",
    aggressiveItem1: "Geschätzter APR: 75-200%+",
    aggressiveItem2: "Risiko temporärer Verluste: Hoch",
    aggressiveItem3: "Automatische Neugewichtung: Täglich",
    selectBtn: "Auswählen",
    popular: "Beliebt",
    
    // Referral section
    referralTitle: "Multiplizieren Sie Ihre Erträge mit Empfehlungen",
    referralSubtitle: "Treten Sie unserer Empfehlungsgemeinschaft bei und werden Sie für Einladungen an andere belohnt",
    referralCardTitle1: "Bis zu 4,5% Kommission",
    referralCardDesc1: "Verdienen Sie Provisionen auf jeden Ertrag, den Ihre Empfehlungen generieren, direkt in USDC ausgezahlt",
    referralCardTitle2: "Gamifiziertes Rangsystem",
    referralCardDesc2: "Steigen Sie vom Rookie zum Champion auf, während Ihre Belohnungen mit jeder Stufe wachsen",
    referralCardTitle3: "Gegenseitiger Nutzen",
    referralCardDesc3: "Auch Ihre Freunde profitieren mit einer 1% APR-Steigerung auf all ihre Positionen",
    referralCtaButton: "Programm beitreten",
    referralCtaSecondary: "Mehr erfahren",
    referralHighlight: "Bis zu $25.000!",
    referralHighlightText: "So viel haben einige Nutzer bereits durch ihre Empfehlungen verdient",
    
    // FAQ section
    faqTitle: "Häufig gestellte Fragen",
    faqSubtitle: "Antworten auf die häufigsten Fragen zu ${APP_NAME} und wie es funktioniert.",
    faqQuestion1: "Was ist ${APP_NAME}?",
    faqAnswer1: "${APP_NAME} ist eine dezentrale Anwendung (dApp), die Liquiditätspositionen auf Uniswap V4 optimiert, temporäre Verluste minimiert und Renditen durch intelligente Algorithmen maximiert.",
    faqQuestion2: "Wie wird der temporäre Verlust minimiert?",
    faqAnswer2: "Unsere Smart Contracts halten die Liquidität in einem optimierten Preisbereich konzentriert und passen ihn automatisch an die Marktbedingungen an, um die Auswirkungen von Schwankungen zu reduzieren.",
    faqQuestion3: "Ist die Verwendung von ${APP_NAME} sicher?",
    faqAnswer3: "${APP_NAME} ist eine nicht-verwahrende Lösung, was bedeutet, dass Sie die volle Kontrolle über Ihre Assets behalten. Unsere Verträge wurden von führenden Sicherheitsunternehmen der Branche geprüft.",
    faqQuestion4: "Welche Token-Paare kann ich verwenden?",
    faqAnswer4: "Wir unterstützen derzeit die Hauptpaare auf Uniswap V4, darunter ETH-USDT, ETH-USDC, ETH-DAI und andere Paare mit hoher Liquidität. Wir erweitern unser Angebot ständig.",
    
    // CTA section
    ctaTitle: "Beginnen Sie noch heute mit der Optimierung Ihrer Liquidität",
    ctaSubtitle: "Schließen Sie sich Tausenden von Anlegern an, die ihre Renditen mit unserer Plattform bereits maximieren.",
    
    // Footer
    footerTagline: "Intelligente Liquiditätsoptimierung auf Uniswap V4.",
    platform: "Plattform",
    dashboard: "Dashboard",
    positions: "Positionen",
    analytics: "Analytik",
    resources: "Ressourcen",
    documentation: "Dokumentation",
    support: "Support",
    community: "Gemeinschaft",
    legal: "Rechtliches",
    termsOfUse: "Nutzungsbedingungen",
    lastUpdated: "Letztes Update: 2. April 2021",
    privacyPolicy: "Datenschutzrichtlinie",
    disclaimer: "Haftungsausschluss",
    copyright: "© 2025 ${APP_NAME}. Alle Rechte vorbehalten."
  },
  
  // Hindi
  hi: {
    // Header/Nav
    howItWorks: "यह कैसे काम करता है",
    algorithm: "एल्गोरिथ्म",
    features: "विशेषताएं",
    riskReturn: "जोखिम/वापसी",
    referrals: "रेफरल",
    faq: "अक्सर पूछे जाने वाले प्रश्न",
    accessDashboard: "डैशबोर्ड एक्सेस करें",
    learnMore: "और जानें",
    lastUpdated: "अंतिम अपडेट: 2 अप्रैल, 2021",
    
    // Liquidity Pools section
    liquidityPoolsTitle: "तरलता पूल",
    liquidityPoolsDescription: "यह पेज तरलता जोड़ने के लिए उपलब्ध सभी तरलता पूल दिखाता है। प्रत्येक पूल Uniswap और अन्य DEX से रीयल-टाइम डेटा दिखाता है। अधिक विस्तृत जानकारी देखने के लिए पूल कार्ड पर क्लिक करें।",
    viewAllPools: "सभी पूल देखें",
    totalValueLocked: "सभी पूल में कुल मूल्य लॉक किया गया",
    
    // Rewards Simulator section
    rewardsSimulatorTitle: "लाभप्रदता सिम्युलेटर",
    rewardsSimulatorSubtitle: "विभिन्न तरलता रणनीतियों के साथ अपने संभावित लाभों की गणना करें",
    
    // Hero section
    heroTitle: "Uniswap V4 पर अपनी तरलता को अनुकूलित करें",
    heroSubtitle: "${APP_NAME} आपकी केंद्रित तरलता स्थितियों को बुद्धिमानी से प्रबंधित करता है, अस्थायी नुकसान को कम करता है और लाभ को अधिकतम करता है।",
    getStarted: "अभी शुरू करें",
    
    // Feature cards
    minimizeRisks: "जोखिमों को कम करें",
    minimizeRisksDesc: "अस्थायी नुकसानों को 95% तक कम करने के लिए उन्नत एल्गोरिदम।",
    maximizeYields: "लाभ को अधिकतम करें",
    maximizeYieldsDesc: "केंद्रित तरलता स्थितियां जो शुल्क में 3 गुना अधिक उत्पन्न करती हैं।",
    fullControl: "पूर्ण नियंत्रण",
    fullControlDesc: "गैर-कस्टोडियल समाधान जो आपको हर समय अपनी संपत्तियों पर नियंत्रण रखता है।",
    
    // How it works section
    howItWorksTitle: "यह कैसे काम करता है",
    howItWorksSubtitle: "${APP_NAME} आपकी तरलता स्थितियों को अनुकूलित करने के लिए Uniswap V4 पर स्मार्ट कॉन्ट्रैक्ट्स का उपयोग करता है।",
    viewFullDocumentation: "पूर्ण तकनीकी प्रलेखन देखें",
    step1Title: "संपत्ति जमा",
    step1Desc: "तरलता स्थितियां बनाने के लिए Uniswap V4 संगत जोड़े में अपनी क्रिप्टोकरेंसी जमा करें।",
    step2Title: "बुद्धिमान प्रबंधन",
    step2Desc: "हमारे स्मार्ट कॉन्ट्रैक्ट्स बाजार की निगरानी करते हैं और मूल्य सीमा को स्वचालित रूप से समायोजित करते हैं।",
    step3Title: "लाभ की कटाई",
    step3Desc: "ट्रेडिंग शुल्क के माध्यम से निष्क्रिय आय उत्पन्न करें और अपनी संपत्तियों पर पूर्ण नियंत्रण बनाए रखें।",
    
    // Features section
    featuresTitle: "विशेषताएं",
    featuresSubtitle: "उन्नत उपकरणों और सहज नियंत्रण के साथ आपके DeFi अनुभव को अधिकतम करने के लिए डिज़ाइन किया गया।",
    feature1Title: "रेंज अनुकूलन",
    feature1Desc: "ऐल्गोरिदम जो लाभ को अधिकतम करने और अस्थायी नुकसानों को कम करने के लिए मूल्य सीमा को समायोजित करते हैं।",
    feature2Title: "स्मार्ट ऑटोमेशन",
    feature2Desc: "बाजार की स्थितियों और भविष्य कहनेवाला विश्लेषण के आधार पर स्वचालित पुनर्संतुलन।",
    feature3Title: "गैर-कस्टोडियल नियंत्रण",
    feature3Desc: "बिना मध्यस्थों के हर समय अपनी संपत्तियों का पूर्ण स्वामित्व बनाए रखें।",
    feature4Title: "उन्नत विश्लेषण",
    feature4Desc: "लाभ, स्थितियों और महत्वपूर्ण मेट्रिक्स को देखने के लिए विस्तृत डैशबोर्ड।",
    
    // Risk/Return section
    riskReturnTitle: "अपना जोखिम/वापसी प्रोफ़ाइल कॉन्फ़िगर करें",
    riskReturnSubtitle: "${APP_NAME} आपको अपने जोखिम सहनशीलता और लाभ उद्देश्यों के अनुसार अपनी रणनीति को अनुकूलित करने की अनुमति देता है।",
    conservativeTitle: "रूढ़िवादी प्रोफ़ाइल",
    conservativeDesc: "व्यापक मूल्य सीमाओं और कम जोखिम के साथ पूंजी संरक्षण को प्राथमिकता देता है।",
    conservativeItem1: "अनुमानित APR: 10-25%",
    conservativeItem2: "अस्थायी नुकसान का जोखिम: कम",
    conservativeItem3: "उतार-चढ़ाव के दौरान तरलता: उच्च",
    moderateTitle: "मध्यम प्रोफ़ाइल",
    moderateDesc: "विकास और जोखिम के बीच इष्टतम संतुलन, गतिशील रूप से मूल्य सीमा को समायोजित करता है।",
    moderateItem1: "अनुमानित APR: 25-75%",
    moderateItem2: "अस्थायी नुकसान का जोखिम: मध्यम",
    moderateItem3: "स्वचालित पुनर्संतुलन: साप्ताहिक",
    aggressiveTitle: "आक्रामक प्रोफ़ाइल",
    aggressiveDesc: "संकीर्ण मूल्य सीमा और सक्रिय प्रबंधन के साथ रिटर्न को अधिकतम करने पर केंद्रित।",
    aggressiveItem1: "अनुमानित APR: 75-200%+",
    aggressiveItem2: "अस्थायी नुकसान का जोखिम: उच्च",
    aggressiveItem3: "स्वचालित पुनर्संतुलन: दैनिक",
    selectBtn: "चयन करें",
    popular: "लोकप्रिय",
    
    // Referral section
    referralTitle: "रेफरल के साथ अपनी कमाई को बढ़ाएं",
    referralSubtitle: "हमारे रेफरल समुदाय में शामिल हों और दूसरों को आमंत्रित करने के लिए पुरस्कार प्राप्त करें",
    referralCardTitle1: "4.5% तक का कमीशन",
    referralCardDesc1: "अपने रेफरल द्वारा उत्पन्न प्रत्येक रिटर्न पर कमीशन कमाएं, सीधे USDC में भुगतान किया जाता है",
    referralCardTitle2: "गेमिफाइड रैंकिंग सिस्टम",
    referralCardDesc2: "प्रत्येक स्तर के साथ आपके पुरस्कार बढ़ते हैं, जैसे आप Rookie से Champion तक बढ़ते हैं",
    referralCardTitle3: "आपसी लाभ",
    referralCardDesc3: "आपके दोस्तों को भी उनके सभी पोजीशन पर 1% APR की वृद्धि से लाभ होता है",
    referralCtaButton: "प्रोग्राम में शामिल हों",
    referralCtaSecondary: "अधिक जानें",
    referralHighlight: "$25,000 तक!",
    referralHighlightText: "कुछ उपयोगकर्ताओं ने अपने रेफरल से पहले से ही इतना कमा लिया है",
    
    // FAQ section
    faqTitle: "अक्सर पूछे जाने वाले प्रश्न",
    faqSubtitle: "${APP_NAME} और इसके कार्य प्रणाली के बारे में सबसे आम प्रश्नों के उत्तर।",
    faqQuestion1: "${APP_NAME} क्या है?",
    faqAnswer1: "${APP_NAME} एक विकेंद्रीकृत एप्लिकेशन (dApp) है जो Uniswap V4 पर तरलता स्थितियों को अनुकूलित करता है, बुद्धिमान एल्गोरिदम के माध्यम से अस्थायी नुकसानों को कम करता है और लाभ को अधिकतम करता है।",
    faqQuestion2: "अस्थायी नुकसान को कैसे कम किया जाता है?",
    faqAnswer2: "हमारे स्मार्ट कॉन्ट्रैक्ट्स तरलता को एक अनुकूलित मूल्य सीमा में केंद्रित रखते हैं, उतार-चढ़ाव के प्रभाव को कम करने के लिए बाजार की स्थितियों के अनुसार इसे स्वचालित रूप से समायोजित करते हैं।",
    faqQuestion3: "क्या ${APP_NAME} का उपयोग करना सुरक्षित है?",
    faqAnswer3: "${APP_NAME} एक गैर-कस्टोडियल समाधान है, जिसका अर्थ है कि आप अपनी संपत्तियों पर पूर्ण नियंत्रण बनाए रखते हैं। हमारे अनुबंधों की उद्योग की प्रमुख सुरक्षा कंपनियों द्वारा ऑडिट की गई है।",
    faqQuestion4: "मैं कौन से टोकन पेयर उपयोग कर सकता हूँ?",
    faqAnswer4: "हम वर्तमान में Uniswap V4 पर मुख्य जोड़े का समर्थन करते हैं, जिसमें ETH-USDT, ETH-USDC, ETH-DAI और अन्य उच्च तरलता वाले जोड़े शामिल हैं। हम लगातार अपनी पेशकश का विस्तार कर रहे हैं।",
    
    // CTA section
    ctaTitle: "आज ही अपनी तरलता को अनुकूलित करना शुरू करें",
    ctaSubtitle: "हजारों निवेशकों से जुड़ें जो पहले से ही हमारे प्लेटफॉर्म के साथ अपने रिटर्न को अधिकतम कर रहे हैं।",
    
    // Footer
    footerTagline: "Uniswap V4 पर बुद्धिमान तरलता अनुकूलन।",
    platform: "प्लेटफॉर्म",
    dashboard: "डैशबोर्ड",
    positions: "पोजीशंस",
    analytics: "एनालिटिक्स",
    resources: "संसाधन",
    documentation: "प्रलेखन",
    support: "सहायता",
    community: "समुदाय",
    legal: "कानूनी",
    termsOfUse: "उपयोग की शर्तें",
    privacyPolicy: "गोपनीयता नीति",
    disclaimer: "अस्वीकरण",
    copyright: "© 2025 ${APP_NAME}. सर्वाधिकार सुरक्षित।"
  },
  // Russian
  ru: {
    // Header/Nav
    howItWorks: "Как это работает",
    lastUpdated: "Последнее обновление: 2 апреля 2021 г.",
    algorithm: "Алгоритм",
    features: "Возможности",
    riskReturn: "Риск/Доходность",
    referrals: "Рефералы",
    faq: "FAQ",
    accessDashboard: "Доступ к панели управления",
    learnMore: "Узнать больше",
    
    // Liquidity Pools section
    liquidityPoolsTitle: "Пулы ликвидности",
    liquidityPoolsDescription: "На этой странице отображаются все доступные пулы ликвидности для добавления ликвидности. Каждый пул показывает данные в реальном времени от Uniswap и других DEX. Нажмите на карточку пула, чтобы увидеть более подробную информацию.",
    viewAllPools: "Просмотреть все пулы",
    totalValueLocked: "Общая заблокированная стоимость во всех пулах",
    
    // Rewards Simulator section
    rewardsSimulatorTitle: "Симулятор доходности",
    rewardsSimulatorSubtitle: "Рассчитайте свои потенциальные выгоды с различными стратегиями ликвидности",
    
    // Hero section
    heroTitle: "Оптимизируйте свою ликвидность на Uniswap V4",
    heroSubtitle: "${APP_NAME} интеллектуально управляет вашими концентрированными позициями ликвидности, минимизируя непостоянные потери и максимизируя доходность.",
    getStarted: "Начать сейчас",
    
    // Feature cards
    minimizeRisks: "Минимизация рисков",
    minimizeRisksDesc: "Продвинутые алгоритмы для снижения непостоянных потерь до 95%.",
    maximizeYields: "Максимизация доходности",
    maximizeYieldsDesc: "Концентрированные позиции ликвидности, которые генерируют до 3 раз больше комиссий.",
    fullControl: "Полный контроль",
    fullControlDesc: "Некастодиальное решение, которое всегда оставляет вам полный контроль над вашими активами.",
    
    // How it works section
    howItWorksTitle: "Как это работает",
    howItWorksSubtitle: "${APP_NAME} использует смарт-контракты на Uniswap V4 для оптимизации ваших позиций ликвидности.",
    viewFullDocumentation: "Просмотреть полную техническую документацию",
    step1Title: "Внесение активов",
    step1Desc: "Внесите свои криптовалюты в пары, совместимые с Uniswap V4, для создания позиций ликвидности.",
    step2Title: "Интеллектуальное управление",
    step2Desc: "Наши смарт-контракты отслеживают рынок и автоматически корректируют ценовой диапазон.",
    step3Title: "Сбор прибыли",
    step3Desc: "Получайте пассивный доход за счет торговых комиссий и сохраняйте полный контроль над своими активами.",
    
    // Features section
    featuresTitle: "Возможности",
    featuresSubtitle: "Разработано для максимизации вашего опыта DeFi с помощью передовых инструментов и интуитивно понятного управления.",
    feature1Title: "Оптимизация диапазона",
    feature1Desc: "Алгоритмы, которые корректируют ценовой диапазон для максимизации доходности и снижения непостоянных потерь.",
    feature2Title: "Умная автоматизация",
    feature2Desc: "Автоматическое ребалансирование на основе рыночных условий и предиктивного анализа.",
    feature3Title: "Некастодиальный контроль",
    feature3Desc: "Сохраняйте полное владение своими активами в любое время без посредников.",
    feature4Title: "Расширенная аналитика",
    feature4Desc: "Подробная панель управления для визуализации доходности, позиций и важных метрик.",
    
    // Risk/Return section
    riskReturnTitle: "Настройте свой профиль риск/доходность",
    riskReturnSubtitle: "${APP_NAME} позволяет настраивать стратегию в соответствии с вашей толерантностью к риску и целями доходности.",
    conservativeTitle: "Консервативный профиль",
    conservativeDesc: "Приоритет сохранения капитала с более широкими ценовыми диапазонами и низким риском.",
    conservativeItem1: "Ориентировочный APR: 10-25%",
    conservativeItem2: "Риск непостоянных потерь: Низкий",
    conservativeItem3: "Ликвидность при колебаниях: Высокая",
    moderateTitle: "Умеренный профиль",
    moderateDesc: "Оптимальный баланс между ростом и риском, динамически корректирующий ценовой диапазон.",
    moderateItem1: "Ориентировочный APR: 25-75%",
    moderateItem2: "Риск непостоянных потерь: Средний",
    moderateItem3: "Автоматическое ребалансирование: Еженедельно",
    aggressiveTitle: "Агрессивный профиль",
    aggressiveDesc: "Нацелен на максимизацию доходности с более узким ценовым диапазоном и активным управлением.",
    aggressiveItem1: "Ориентировочный APR: 75-200%+",
    aggressiveItem2: "Риск непостоянных потерь: Высокий",
    aggressiveItem3: "Автоматическое ребалансирование: Ежедневно",
    selectBtn: "Выбрать",
    popular: "Популярный",
    
    // Referral section
    referralTitle: "Умножьте свой заработок с рефералами",
    referralSubtitle: "Присоединяйтесь к нашему реферальному сообществу и получайте вознаграждение за приглашение других",
    referralCardTitle1: "До 4,5% комиссионных",
    referralCardDesc1: "Зарабатывайте комиссии за каждый доход, сгенерированный вашими рефералами, выплачиваемые напрямую в USDC",
    referralCardTitle2: "Геймифицированная система рангов",
    referralCardDesc2: "Прогрессируйте от Новичка до Чемпиона, при этом ваши награды увеличиваются с каждым уровнем",
    referralCardTitle3: "Взаимная выгода",
    referralCardDesc3: "Ваши друзья также выигрывают с увеличением APR на 1% по всем их позициям",
    referralCtaButton: "Присоединиться к программе",
    referralCtaSecondary: "Узнать больше",
    referralHighlight: "До $25 000!",
    referralHighlightText: "Столько уже заработали некоторые пользователи со своими рефералами",
    
    // FAQ section
    faqTitle: "Часто задаваемые вопросы",
    faqSubtitle: "Ответы на самые распространенные вопросы о ${APP_NAME} и его работе.",
    faqQuestion1: "Что такое ${APP_NAME}?",
    faqAnswer1: "${APP_NAME} — это децентрализованное приложение (dApp), которое оптимизирует позиции ликвидности на Uniswap V4, минимизируя непостоянные потери и максимизируя доходность с помощью интеллектуальных алгоритмов.",
    faqQuestion2: "Как минимизируются непостоянные потери?",
    faqAnswer2: "Наши смарт-контракты поддерживают концентрированную ликвидность в оптимизированном ценовом диапазоне, автоматически корректируя его в соответствии с рыночными условиями для снижения влияния колебаний.",
    faqQuestion3: "Безопасно ли использовать ${APP_NAME}?",
    faqAnswer3: "${APP_NAME} — это некастодиальное решение, что означает, что вы сохраняете полный контроль над своими активами. Наши контракты были проверены ведущими компаниями по безопасности в отрасли.",
    faqQuestion4: "Какие пары токенов я могу использовать?",
    faqAnswer4: "В настоящее время мы поддерживаем основные пары на Uniswap V4, включая ETH-USDT, ETH-USDC, ETH-DAI и другие пары с высокой ликвидностью. Мы постоянно расширяем наше предложение.",
    
    // CTA section
    ctaTitle: "Начните оптимизировать свою ликвидность сегодня",
    ctaSubtitle: "Присоединяйтесь к тысячам инвесторов, которые уже максимизируют свою доходность с нашей платформой.",
    
    // Footer
    footerTagline: "Интеллектуальная оптимизация ликвидности на Uniswap V4.",
    platform: "Платформа",
    dashboard: "Панель управления",
    positions: "Позиции",
    analytics: "Аналитика",
    resources: "Ресурсы",
    documentation: "Документация",
    support: "Поддержка",
    community: "Сообщество",
    legal: "Юридическая информация",
    termsOfUse: "Условия использования",
    privacyPolicy: "Политика конфиденциальности",
    disclaimer: "Отказ от ответственности",
    copyright: "© 2025 ${APP_NAME}. Все права защищены."
  },
  
  // Chinese
  zh: {
    // Header/Nav
    howItWorks: "工作原理",
    algorithm: "算法",
    features: "功能特点",
    riskReturn: "风险/回报",
    referrals: "推荐计划",
    faq: "常见问题",
    accessDashboard: "访问仪表盘",
    learnMore: "了解更多",
    lastUpdated: "最后更新：2021年4月2日",
    
    // Liquidity Pools section
    liquidityPoolsTitle: "流动性池",
    liquidityPoolsDescription: "此页面显示所有可添加流动性的流动性池。每个池都显示来自Uniswap和其他DEX的实时数据。点击池卡片查看更详细的信息。",
    viewAllPools: "查看所有池",
    totalValueLocked: "所有池中锁定的总价值",
    
    // Rewards Simulator section
    rewardsSimulatorTitle: "盈利能力模拟器",
    rewardsSimulatorSubtitle: "计算不同流动性策略的潜在收益",
    
    // Hero section
    heroTitle: "优化您在Uniswap V4上的流动性",
    heroSubtitle: "${APP_NAME}智能管理您的集中流动性头寸，最小化无常损失并最大化收益。",
    getStarted: "立即开始",
    
    // Feature cards
    minimizeRisks: "最小化风险",
    minimizeRisksDesc: "先进算法，将无常损失减少高达95%。",
    maximizeYields: "最大化收益",
    maximizeYieldsDesc: "集中流动性头寸，产生高达3倍的费用收入。",
    fullControl: "完全控制",
    fullControlDesc: "非托管解决方案，让您始终掌控自己的资产。",
    
    // How it works section
    howItWorksTitle: "工作原理",
    howItWorksSubtitle: "${APP_NAME}利用Uniswap V4上的智能合约来优化您的流动性头寸。",
    viewFullDocumentation: "查看完整技术文档",
    step1Title: "资产存入",
    step1Desc: "将您的加密货币存入兼容Uniswap V4的交易对，创建流动性头寸。",
    step2Title: "智能管理",
    step2Desc: "我们的智能合约监控市场并自动调整价格范围。",
    step3Title: "收益收割",
    step3Desc: "通过交易费用产生被动收入，并保持对资产的完全控制。",
    
    // Features section
    featuresTitle: "功能特点",
    featuresSubtitle: "通过先进工具和直观控制，旨在最大化您的DeFi体验。",
    feature1Title: "范围优化",
    feature1Desc: "调整价格范围的算法，最大化收益并减少无常损失。",
    feature2Title: "智能自动化",
    feature2Desc: "基于市场条件和预测分析的自动再平衡。",
    feature3Title: "非托管控制",
    feature3Desc: "无需中介，始终保持对资产的完全所有权。",
    feature4Title: "高级分析",
    feature4Desc: "详细的仪表盘，可视化收益、头寸和重要指标。",
    
    // Risk/Return section
    riskReturnTitle: "配置您的风险/回报组合",
    riskReturnSubtitle: "${APP_NAME}允许您根据风险承受能力和收益目标定制策略。",
    conservativeTitle: "保守型组合",
    conservativeDesc: "优先考虑资本保值，采用更宽的价格范围和较低的风险。",
    conservativeItem1: "预计年化收益率：10-25%",
    conservativeItem2: "无常损失风险：低",
    conservativeItem3: "波动期间的流动性：高",
    moderateTitle: "稳健型组合",
    moderateDesc: "在增长和风险之间取得最佳平衡，动态调整价格范围。",
    moderateItem1: "预计年化收益率：25-75%",
    moderateItem2: "无常损失风险：中",
    moderateItem3: "自动再平衡：每周",
    aggressiveTitle: "激进型组合",
    aggressiveDesc: "专注于通过更窄的价格范围和积极管理最大化回报。",
    aggressiveItem1: "预计年化收益率：75-200%+",
    aggressiveItem2: "无常损失风险：高",
    aggressiveItem3: "自动再平衡：每天",
    selectBtn: "选择",
    popular: "热门",
    
    // Referral section
    referralTitle: "通过推荐计划增加您的收益",
    referralSubtitle: "加入我们的推荐社区，邀请他人加入即可获得奖励",
    referralCardTitle1: "高达4.5%的佣金",
    referralCardDesc1: "从您推荐的用户生成的每一笔收益中赚取佣金，直接以USDC支付",
    referralCardTitle2: "游戏化排名系统",
    referralCardDesc2: "从新手(Rookie)到冠军(Champion)一路晋升，每升一级您的奖励也会相应增加",
    referralCardTitle3: "互惠互利",
    referralCardDesc3: "您的朋友也能在他们所有的头寸上获得1%的APR提升",
    referralCtaButton: "加入推荐计划",
    referralCtaSecondary: "了解更多",
    referralHighlight: "高达$25,000!",
    referralHighlightText: "这是一些用户通过推荐已经赚到的金额",
    
    // FAQ section
    faqTitle: "常见问题",
    faqSubtitle: "关于${APP_NAME}及其工作原理的最常见问题的答案。",
    faqQuestion1: "什么是${APP_NAME}？",
    faqAnswer1: "${APP_NAME}是一个去中心化应用程序（dApp），通过智能算法优化Uniswap V4上的流动性头寸，最小化无常损失并最大化收益。",
    faqQuestion2: "如何最小化无常损失？",
    faqAnswer2: "我们的智能合约将流动性集中在优化的价格范围内，根据市场条件自动调整，减少波动的影响。",
    faqQuestion3: "使用${APP_NAME}安全吗？",
    faqAnswer3: "${APP_NAME}是一个非托管解决方案，这意味着您保持对资产的完全控制。我们的合约已经由行业领先的安全公司进行审计。",
    faqQuestion4: "我可以使用哪些代币对？",
    faqAnswer4: "我们目前支持Uniswap V4上的主要交易对，包括ETH-USDT、ETH-USDC、ETH-DAI和其他高流动性交易对。我们不断扩展我们的产品。",
    
    // CTA section
    ctaTitle: "今天开始优化您的流动性",
    ctaSubtitle: "加入已经使用我们平台最大化回报的数千名投资者。",
    
    // Footer
    footerTagline: "Uniswap V4上的智能流动性优化。",
    platform: "平台",
    dashboard: "仪表盘",
    positions: "头寸",
    analytics: "分析",
    resources: "资源",
    documentation: "文档",
    support: "支持",
    community: "社区",
    legal: "法律",
    termsOfUse: "使用条款",
    privacyPolicy: "隐私政策",
    disclaimer: "免责声明",
    copyright: "© 2025 ${APP_NAME}. 保留所有权利。"
  }
};

export default translations;
export { translations as landingTranslations };
