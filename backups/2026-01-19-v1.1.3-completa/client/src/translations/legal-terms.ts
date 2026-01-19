import { Language } from "@/context/language-context";
import { APP_NAME } from "@/utils/app-config";

// Interfaz para las traducciones de los términos legales
export interface LegalTermsTranslations {
  // Titulos de las pestañas
  termsOfUseTab: string;
  privacyPolicyTab: string;
  disclaimerTab: string;
  
  // Textos generales
  dialogTitle: string;
  dialogSubtitle: string;
  warningMessage: string;
  infoMessage: string;
  allDocsRequired: string;
  
  // Botones
  nextDocument: string;
  confirmAndContinue: string;
  processing: string;
  acceptedDocs: string;
  allDocsAccepted: string;
  
  // Términos de uso
  termsOfUseTitle: string;
  termsOfUseIntro: string;
  acceptTermsOfUse: string;
  viewFullTerms: string;
  termsContent: string; // Contenido completo de los términos
  
  // Política de privacidad
  privacyPolicyTitle: string;
  privacyPolicyIntro: string;
  acceptPrivacyPolicy: string;
  viewFullPrivacy: string;
  privacyContent: string; // Contenido completo de la política de privacidad
  
  // Aviso legal
  disclaimerTitle: string;
  disclaimerIntro: string;
  acceptDisclaimer: string;
  viewFullDisclaimer: string;
  disclaimerContent: string; // Contenido completo del aviso legal
}

// Traducciones para cada idioma
const translations: Record<Language, LegalTermsTranslations> = {
  // Español
  es: {
    termsOfUseTab: "Términos de Uso",
    privacyPolicyTab: "Política de Privacidad",
    disclaimerTab: "Aviso Legal",
    
    dialogTitle: "Términos Legales",
    dialogSubtitle: `Antes de comenzar a usar ${APP_NAME}, debes aceptar nuestros términos legales.`,
    warningMessage: `Para acceder a ${APP_NAME}, debes leer y aceptar todos los documentos legales.`,
    infoMessage: `Para utilizar ${APP_NAME}, debes aceptar los Términos de Uso, la Política de Privacidad y el Aviso Legal.`,
    allDocsRequired: "Este diálogo no se puede cerrar hasta que aceptes todos los documentos.",
    
    nextDocument: "Siguiente documento",
    confirmAndContinue: "Confirmar y continuar",
    processing: "Procesando...",
    acceptedDocs: "documentos aceptados",
    allDocsAccepted: "Todos los documentos aceptados ✓",
    
    termsOfUseTitle: "Términos de Uso",
    termsOfUseIntro: `Estos Términos de Uso (los "Términos") rigen su acceso y uso de la aplicación decentralizada ${APP_NAME} ("${APP_NAME}" o la "Aplicación"), proporcionada por Elysium Media FZCO.`,
    acceptTermsOfUse: "Acepto los Términos de Uso",
    viewFullTerms: "Ver versión completa",
    termsContent: `Estos Términos de Uso (los "Términos") rigen su acceso y uso de la aplicación decentralizada WayBank ("WayBank" o la "Aplicación"), proporcionada por Elysium Media FZCO, con dirección registrada en ID: 58510, Premises no. 58510 - 001, IFZA Business Park, DDP, DUBAI, UAE.

Al acceder o utilizar WayBank, usted acepta estar legalmente obligado por estos Términos. Si no está de acuerdo con alguna parte de estos Términos, no debe acceder ni utilizar la Aplicación.

1. Definiciones
- "Aplicación" se refiere a la aplicación decentralizada WayBank, que proporciona servicios de gestión de posiciones de liquidez para Uniswap v4.
- "Usuario" se refiere a cualquier persona o entidad que accede o utiliza la Aplicación.
- "Servicios" se refiere a todas las funcionalidades, características y servicios proporcionados a través de la Aplicación.
- "Contenido" se refiere a toda la información y materiales disponibles en la Aplicación, incluyendo texto, gráficos, interfaces de usuario, marcas comerciales, logotipos, imágenes y código.

2. Elegibilidad
Para utilizar la Aplicación, debe tener al menos 18 años y la capacidad legal para celebrar un contrato vinculante. Al utilizar la Aplicación, usted declara y garantiza que cumple con estos requisitos.

3. Servicios de la Aplicación
WayBank proporciona herramientas para gestionar posiciones de liquidez en Uniswap v4, incluyendo:
- Creación y gestión de posiciones de liquidez
- Seguimiento del rendimiento
- Análisis de datos blockchain
- Gestión de posiciones NFT

Estos servicios interactúan con contratos inteligentes en múltiples blockchains e implican riesgos inherentes. Los Usuarios asumen todos los riesgos asociados con el uso de la Aplicación y las transacciones blockchain.`,
    
    privacyPolicyTitle: "Política de Privacidad",
    privacyPolicyIntro: "Esta Política de Privacidad describe cómo Elysium Media FZCO recopila, utiliza, almacena y protege la información recopilada cuando usted utiliza nuestra aplicación decentralizada.",
    acceptPrivacyPolicy: "Acepto la Política de Privacidad",
    viewFullPrivacy: "Ver versión completa",
    privacyContent: `Esta Política de Privacidad describe cómo Elysium Media FZCO, con dirección registrada en ID: 58510, Premises no. 58510 - 001, IFZA Business Park, DDP, DUBAI, UAE ("nosotros", "nuestro" o "WayBank") recopila, utiliza, almacena y protege la información recopilada cuando usted utiliza nuestra aplicación decentralizada.

Al utilizar WayBank, usted acepta las prácticas descritas en esta Política de Privacidad. Si no está de acuerdo con esta Política, por favor no utilice nuestra Aplicación.

1. Información que Recopilamos
**Información proporcionada directamente por usted:**
- Dirección de wallet
- Preferencias de configuración
- Información de transacciones realizadas a través de la Aplicación

**Información recopilada automáticamente:**
- Datos de uso y análisis
- Información del dispositivo y navegador
- Dirección IP
- Datos de log y actividad en la Aplicación

2. Cómo Utilizamos su Información
Utilizamos la información recopilada para:
- Proporcionar y mantener nuestros servicios
- Mejorar, personalizar y expandir nuestra Aplicación
- Comprender cómo usted utiliza nuestra Aplicación
- Desarrollar nuevos productos, servicios y funcionalidades
- Comunicarnos con usted
- Prevenir actividades fraudulentas o ilegales`,
    
    disclaimerTitle: "Aviso Legal",
    disclaimerIntro: `Este Aviso Legal (el "Aviso") es proporcionado por Elysium Media FZCO y se aplica a todos los usuarios de la aplicación decentralizada ${APP_NAME} ("${APP_NAME}" o la "Aplicación").`,
    acceptDisclaimer: "Acepto el Aviso Legal",
    viewFullDisclaimer: "Ver versión completa",
    disclaimerContent: `Este Aviso Legal (el "Aviso") es proporcionado por Elysium Media FZCO, con dirección registrada en ID: 58510, Premises no. 58510 - 001, IFZA Business Park, DDP, DUBAI, UAE, y se aplica a todos los usuarios de la aplicación decentralizada WayBank ("WayBank" o la "Aplicación").

Por favor, lea este Aviso cuidadosamente. Al acceder o utilizar WayBank, usted acepta estar legalmente obligado por todas las declaraciones, advertencias y exenciones contenidas en este Aviso.

1. Riesgo y No Asesoramiento Financiero
**NO ASESORAMIENTO FINANCIERO:** La información y servicios proporcionados a través de WayBank son solo para fines informativos y de conveniencia, y no constituyen asesoramiento financiero, de inversión o legal. No somos asesores financieros, de inversión o legales.

**RIESGO DE INVERSIÓN:** Invertir en criptomonedas, tokens, y el uso de la tecnología DeFi implica un alto riesgo, incluida la posibilidad de pérdida total del capital. El valor de los activos digitales puede fluctuar significativamente y puede perder valor. Debe invertir solo lo que está dispuesto a perder.

2. Exactitud de la Información
A pesar de nuestros esfuerzos por proporcionar información precisa y actualizada, no garantizamos la exactitud, integridad o actualidad de la información proporcionada en o a través de la Aplicación. La información puede contener errores, inexactitudes o estar desactualizada, y podemos realizar cambios en la información en cualquier momento sin previo aviso.

3. Exención de Garantías
LA APLICACIÓN Y TODOS LOS SERVICIOS, CONTENIDO Y FUNCIONALIDAD DISPONIBLES A TRAVÉS DE LA APLICACIÓN SE PROPORCIONAN "TAL CUAL" Y "SEGÚN DISPONIBILIDAD", SIN GARANTÍA DE NINGÚN TIPO, YA SEA EXPRESA O IMPLÍCITA.

RENUNCIAMOS EXPRESAMENTE A TODAS LAS GARANTÍAS DE CUALQUIER TIPO, YA SEAN EXPRESAS O IMPLÍCITAS, INCLUYENDO, PERO NO LIMITADO A, LAS GARANTÍAS IMPLÍCITAS DE COMERCIABILIDAD, IDONEIDAD PARA UN PROPÓSITO PARTICULAR, NO INFRACCIÓN, TÍTULO, OPERACIÓN SIN INTERRUPCIÓN, SIN ERRORES Y SIN VIRUS.`,
  },
  
  // English
  en: {
    termsOfUseTab: "Terms of Use",
    privacyPolicyTab: "Privacy Policy",
    disclaimerTab: "Disclaimer",
    
    dialogTitle: "Legal Terms",
    dialogSubtitle: `Before you start using ${APP_NAME}, you must accept our legal terms.`,
    warningMessage: `To access ${APP_NAME}, you must read and accept all legal documents.`,
    infoMessage: `To use ${APP_NAME}, you must accept the Terms of Use, Privacy Policy, and Disclaimer.`,
    allDocsRequired: "This dialog cannot be closed until you accept all documents.",
    
    nextDocument: "Next document",
    confirmAndContinue: "Confirm and continue",
    processing: "Processing...",
    acceptedDocs: "documents accepted",
    allDocsAccepted: "All documents accepted ✓",
    
    termsOfUseTitle: "Terms of Use",
    termsOfUseIntro: `These Terms of Use (the "Terms") govern your access and use of the ${APP_NAME} decentralized application ("${APP_NAME}" or the "Application"), provided by Elysium Media FZCO.`,
    acceptTermsOfUse: "I accept the Terms of Use",
    viewFullTerms: "View full version",
    termsContent: `These Terms of Use (the "Terms") govern your access and use of the ${APP_NAME} decentralized application ("${APP_NAME}" or the "Application"), provided by Elysium Media FZCO, with registered address at ID: 58510, Premises no. 58510 - 001, IFZA Business Park, DDP, DUBAI, UAE.

By accessing or using ${APP_NAME}, you agree to be legally bound by these Terms. If you do not agree with any part of these Terms, you should not access or use the Application.

1. Definitions
- "Application" refers to the ${APP_NAME} decentralized application that provides liquidity position management services for Uniswap v4.
- "User" refers to any person or entity that accesses or uses the Application.
- "Services" refers to all functionalities, features, and services provided through the Application.
- "Content" refers to all information and materials available on the Application, including text, graphics, user interfaces, trademarks, logos, images, and code.

2. Eligibility
To use the Application, you must be at least 18 years old and have the legal capacity to enter into a binding contract. By using the Application, you represent and warrant that you meet these requirements.

3. Application Services
${APP_NAME} provides tools for managing liquidity positions on Uniswap v4, including:
- Creation and management of liquidity positions
- Performance tracking
- Blockchain data analysis
- NFT position management

These services interact with smart contracts on multiple blockchains and involve inherent risks. Users assume all risks associated with the use of the Application and blockchain transactions.`,
    
    privacyPolicyTitle: "Privacy Policy",
    privacyPolicyIntro: "This Privacy Policy describes how Elysium Media FZCO collects, uses, stores, and protects information collected when you use our decentralized application.",
    acceptPrivacyPolicy: "I accept the Privacy Policy",
    viewFullPrivacy: "View full version",
    privacyContent: `This Privacy Policy describes how Elysium Media FZCO, with registered address at ID: 58510, Premises no. 58510 - 001, IFZA Business Park, DDP, DUBAI, UAE ("we," "our," or "${APP_NAME}") collects, uses, stores, and protects information collected when you use our decentralized application.

By using ${APP_NAME}, you agree to the practices described in this Privacy Policy. If you do not agree with this Policy, please do not use our Application.

1. Information We Collect
**Information provided directly by you:**
- Wallet address
- Configuration preferences
- Information on transactions made through the Application

**Information collected automatically:**
- Usage and analytics data
- Device and browser information
- IP address
- Log data and Application activity

2. How We Use Your Information
We use the collected information to:
- Provide and maintain our services
- Improve, personalize, and expand our Application
- Understand how you use our Application
- Develop new products, services, and features
- Communicate with you
- Prevent fraudulent or illegal activities`,
    
    disclaimerTitle: "Disclaimer",
    disclaimerIntro: `This Disclaimer (the "Notice") is provided by Elysium Media FZCO and applies to all users of the ${APP_NAME} decentralized application ("${APP_NAME}" or the "Application").`,
    acceptDisclaimer: "I accept the Disclaimer",
    viewFullDisclaimer: "View full version",
    disclaimerContent: `This Disclaimer (the "Notice") is provided by Elysium Media FZCO, with registered address at ID: 58510, Premises no. 58510 - 001, IFZA Business Park, DDP, DUBAI, UAE, and applies to all users of the ${APP_NAME} decentralized application ("${APP_NAME}" or the "Application").

Please read this Notice carefully. By accessing or using ${APP_NAME}, you agree to be legally bound by all statements, warnings, and disclaimers contained in this Notice.

1. Risk and No Financial Advice
**NO FINANCIAL ADVICE:** The information and services provided through ${APP_NAME} are for informational and convenience purposes only and do not constitute financial, investment, or legal advice. We are not financial, investment, or legal advisors.

**INVESTMENT RISK:** Investing in cryptocurrencies, tokens, and using DeFi technology involves high risk, including the possibility of total loss of capital. The value of digital assets can fluctuate significantly and may lose value. You should only invest what you are willing to lose.

2. Accuracy of Information
Despite our efforts to provide accurate and up-to-date information, we do not guarantee the accuracy, completeness, or timeliness of information provided on or through the Application. The information may contain errors, inaccuracies, or be outdated, and we may make changes to the information at any time without prior notice.

3. Disclaimer of Warranties
THE APPLICATION AND ALL SERVICES, CONTENT, AND FUNCTIONALITY AVAILABLE THROUGH THE APPLICATION ARE PROVIDED "AS IS" AND "AS AVAILABLE," WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESS OR IMPLIED.

WE EXPRESSLY DISCLAIM ALL WARRANTIES OF ANY KIND, WHETHER EXPRESS OR IMPLIED, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, NON-INFRINGEMENT, TITLE, OPERATION WITHOUT INTERRUPTION, WITHOUT ERRORS AND WITHOUT VIRUSES.`,
  },
  ru: {
    termsOfUseTab: "Условия использования",
    privacyPolicyTab: "Политика конфиденциальности",
    disclaimerTab: "Отказ от ответственности",
    
    dialogTitle: "Юридические условия",
    dialogSubtitle: `Прежде чем начать использовать ${APP_NAME}, вы должны принять наши юридические условия.`,
    warningMessage: `Для доступа к ${APP_NAME} вы должны прочитать и принять все юридические документы.`,
    infoMessage: `Для использования ${APP_NAME} вы должны принять Условия использования, Политику конфиденциальности и Отказ от ответственности.`,
    allDocsRequired: "Этот диалог не может быть закрыт, пока вы не примете все документы.",
    
    nextDocument: "Следующий документ",
    confirmAndContinue: "Подтвердить и продолжить",
    processing: "Обработка...",
    acceptedDocs: "документов принято",
    allDocsAccepted: "Все документы приняты ✓",
    
    termsOfUseTitle: "Условия использования",
    termsOfUseIntro: `Настоящие Условия использования («Условия») регулируют ваш доступ и использование децентрализованного приложения ${APP_NAME} («${APP_NAME}» или «Приложение»), предоставляемого Elysium Media FZCO.`,
    acceptTermsOfUse: "Я принимаю Условия использования",
    viewFullTerms: "Посмотреть полную версию",
    termsContent: `Настоящие Условия использования («Условия») регулируют ваш доступ и использование децентрализованного приложения ${APP_NAME} («${APP_NAME}» или «Приложение»), предоставляемого Elysium Media FZCO, с зарегистрированным адресом: ID: 58510, Premises no. 58510 - 001, IFZA Business Park, DDP, DUBAI, UAE.

Получая доступ к ${APP_NAME} или используя его, вы соглашаетесь быть юридически связанными настоящими Условиями. Если вы не согласны с какой-либо частью настоящих Условий, вы не должны получать доступ к Приложению или использовать его.

1. Определения
- «Приложение» относится к децентрализованному приложению ${APP_NAME}, которое предоставляет услуги по управлению позициями ликвидности для Uniswap v4.
- «Пользователь» относится к любому лицу или организации, которые получают доступ к Приложению или используют его.
- «Услуги» относятся ко всем функциям, возможностям и услугам, предоставляемым через Приложение.
- «Контент» относится ко всей информации и материалам, доступным в Приложении, включая текст, графику, пользовательские интерфейсы, товарные знаки, логотипы, изображения и код.

2. Приемлемость
Для использования Приложения вам должно быть не менее 18 лет, и вы должны обладать законной способностью заключать обязывающий договор. Используя Приложение, вы заявляете и гарантируете, что соответствуете этим требованиям.

3. Услуги Приложения
${APP_NAME} предоставляет инструменты для управления позициями ликвидности на Uniswap v4, включая:
- Создание и управление позициями ликвидности
- Отслеживание производительности
- Анализ данных блокчейна
- Управление позициями NFT

Эти услуги взаимодействуют со смарт-контрактами в нескольких блокчейнах и сопряжены с неотъемлемыми рисками. Пользователи принимают на себя все риски, связанные с использованием Приложения и транзакциями блокчейна.`,
    
    privacyPolicyTitle: "Политика конфиденциальности",
    privacyPolicyIntro: "Настоящая Политика конфиденциальности описывает, как Elysium Media FZCO собирает, использует, хранит и защищает информацию, собранную при использовании вами нашего децентрализованного приложения.",
    acceptPrivacyPolicy: "Я принимаю Политику конфиденциальности",
    viewFullPrivacy: "Посмотреть полную версию",
    privacyContent: `Настоящая Политика конфиденциальности описывает, как Elysium Media FZCO, с зарегистрированным адресом: ID: 58510, Premises no. 58510 - 001, IFZA Business Park, DDP, DUBAI, UAE («мы» или «${APP_NAME}») собирает, использует, хранит и защищает информацию, собранную при использовании вами нашего децентрализованного приложения.

Используя ${APP_NAME}, вы соглашаетесь с практиками, описанными в настоящей Политике конфиденциальности. Если вы не согласны с настоящей Политикой, пожалуйста, не используйте наше Приложение.

1. Собираемая нами информация
**Информация, предоставленная вами напрямую:**
- Адрес кошелька
- Настройки конфигурации
- Информация о транзакциях, совершенных через Приложение

**Информация, собираемая автоматически:**
- Данные об использовании и аналитике
- Информация об устройстве и браузере
- IP-адрес
- Данные журналов и активность Приложения

2. Как мы используем вашу информацию
Мы используем собранную информацию для:
- Предоставления и поддержания наших услуг
- Улучшения, персонализации и расширения нашего Приложения
- Понимания того, как вы используете наше Приложение
- Разработки новых продуктов, услуг и функций
- Общения с вами
- Предотвращения мошеннических или незаконных действий`,
    
    disclaimerTitle: "Отказ от ответственности",
    disclaimerIntro: `Настоящий Отказ от ответственности («Уведомление») предоставляется Elysium Media FZCO и применяется ко всем пользователям децентрализованного приложения ${APP_NAME} («${APP_NAME}» или «Приложение»).`,
    acceptDisclaimer: "Я принимаю Отказ от ответственности",
    viewFullDisclaimer: "Посмотреть полную версию",
    disclaimerContent: `Настоящий Отказ от ответственности («Уведомление») предоставляется Elysium Media FZCO, с зарегистрированным адресом: ID: 58510, Premises no. 58510 - 001, IFZA Business Park, DDP, DUBAI, UAE, и применяется ко всем пользователям децентрализованного приложения ${APP_NAME} («${APP_NAME}» или «Приложение»).

Пожалуйста, внимательно прочитайте это Уведомление. Получая доступ или используя ${APP_NAME}, вы соглашаетесь быть юридически связанными всеми заявлениями, предупреждениями и отказами от ответственности, содержащимися в настоящем Уведомлении.

1. Риск и отсутствие финансовых консультаций
**ОТСУТСТВИЕ ФИНАНСОВЫХ КОНСУЛЬТАЦИЙ:** Информация и услуги, предоставляемые через ${APP_NAME}, предназначены исключительно для информационных и удобства целей и не являются финансовыми, инвестиционными или юридическими консультациями. Мы не являемся финансовыми, инвестиционными или юридическими консультантами.

**ИНВЕСТИЦИОННЫЙ РИСК:** Инвестирование в криптовалюты, токены и использование технологии DeFi сопряжено с высоким риском, включая возможность полной потери капитала. Стоимость цифровых активов может значительно колебаться и может потерять ценность. Вы должны инвестировать только то, что готовы потерять.

2. Точность информации
Несмотря на наши усилия по предоставлению точной и актуальной информации, мы не гарантируем точность, полноту или своевременность информации, предоставляемой на или через Приложение. Информация может содержать ошибки, неточности или быть устаревшей, и мы можем вносить изменения в информацию в любое время без предварительного уведомления.

3. Отказ от гарантий
ПРИЛОЖЕНИЕ И ВСЕ УСЛУГИ, КОНТЕНТ И ФУНКЦИОНАЛЬНОСТЬ, ДОСТУПНЫЕ ЧЕРЕЗ ПРИЛОЖЕНИЕ, ПРЕДОСТАВЛЯЮТСЯ «КАК ЕСТЬ» И «КАК ДОСТУПНО», БЕЗ КАКИХ-ЛИБО ГАРАНТИЙ, ЯВНЫХ ИЛИ ПОДРАЗУМЕВАЕМЫХ.

МЫ ЯВНО ОТКАЗЫВАЕМСЯ ОТ ВСЕХ ГАРАНТИЙ ЛЮБОГО РОДА, ЯВНЫХ ИЛИ ПОДРАЗУМЕВАЕМЫХ, ВКЛЮЧАЯ, НО НЕ ОГРАНИЧИВАЯСЬ, ПОДРАЗУМЕВАЕМЫМИ ГАРАНТИЯМИ ТОВАРНОЙ ПРИГОДНОСТИ, ПРИГОДНОСТИ ДЛЯ ОПРЕДЕЛЕННОЙ ЦЕЛИ, ОТСУТСТВИЯ НАРУШЕНИЙ, ПРАВА СОБСТВЕННОСТИ, РАБОТЫ БЕЗ ПЕРЕРЫВОВ, БЕЗ ОШИБОК И БЕЗ ВИРУСОВ.`,
  },
  // Árabe
  ar: {
    termsOfUseTab: "شروط الاستخدام",
    privacyPolicyTab: "سياسة الخصوصية",
    disclaimerTab: "إخلاء المسؤولية",
    
    dialogTitle: "الشروط القانونية",
    dialogSubtitle: `قبل البدء في استخدام ${APP_NAME}، يجب عليك قبول شروطنا القانونية.`,
    warningMessage: `للوصول إلى ${APP_NAME}، يجب قراءة جميع المستندات القانونية وقبولها.`,
    infoMessage: `لاستخدام ${APP_NAME}، يجب عليك قبول شروط الاستخدام وسياسة الخصوصية وإخلاء المسؤولية.`,
    allDocsRequired: "لا يمكن إغلاق مربع الحوار هذا حتى تقبل جميع المستندات.",
    
    nextDocument: "المستند التالي",
    confirmAndContinue: "تأكيد ومتابعة",
    processing: "جاري المعالجة...",
    acceptedDocs: "مستندات مقبولة",
    allDocsAccepted: "تم قبول جميع المستندات ✓",
    
    termsOfUseTitle: "شروط الاستخدام",
    termsOfUseIntro: `تحكم شروط الاستخدام هذه ("الشروط") وصولك واستخدامك لتطبيق ${APP_NAME} اللامركزي ("${APP_NAME}" أو "التطبيق")، المقدم من Elysium Media FZCO.`,
    acceptTermsOfUse: "أوافق على شروط الاستخدام",
    viewFullTerms: "عرض النسخة الكاملة",
    termsContent: `تحكم شروط الاستخدام هذه ("الشروط") وصولك واستخدامك لتطبيق WayBank اللامركزي ("WayBank" أو "التطبيق")، المقدم من Elysium Media FZCO، مع العنوان المسجل في المعرف: 58510، المبنى رقم 58510 - 001، منطقة الأعمال IFZA، DDP، دبي، الإمارات العربية المتحدة.

بمجرد الوصول إلى أو استخدام WayBank، فإنك توافق على الالتزام قانونًا بهذه الشروط. إذا كنت لا توافق على أي جزء من هذه الشروط، فيجب ألا تصل أو تستخدم التطبيق.

1. التعريفات
- "التطبيق" يشير إلى تطبيق WayBank اللامركزي الذي يوفر خدمات إدارة مواقع السيولة لـ Uniswap v4.
- "المستخدم" يشير إلى أي شخص أو كيان يصل إلى أو يستخدم التطبيق.
- "الخدمات" تشير إلى جميع الوظائف والميزات والخدمات المقدمة من خلال التطبيق.
- "المحتوى" يشير إلى جميع المعلومات والمواد المتاحة في التطبيق، بما في ذلك النص والرسومات وواجهات المستخدم والعلامات التجارية والشعارات والصور والرمز.

2. الأهلية
لاستخدام التطبيق، يجب أن يكون عمرك 18 عامًا على الأقل وأن تكون لديك القدرة القانونية على إبرام عقد ملزم. باستخدام التطبيق، فإنك تقر وتضمن أنك تستوفي هذه المتطلبات.

3. خدمات التطبيق
يوفر WayBank أدوات لإدارة مواقع السيولة على Uniswap v4، بما في ذلك:
- إنشاء وإدارة مواقع السيولة
- تتبع الأداء
- تحليل بيانات blockchain
- إدارة مواقع NFT

تتفاعل هذه الخدمات مع العقود الذكية على سلاسل blockchain متعددة وتنطوي على مخاطر متأصلة. يتحمل المستخدمون جميع المخاطر المرتبطة باستخدام التطبيق ومعاملات blockchain.`,
    
    privacyPolicyTitle: "سياسة الخصوصية",
    privacyPolicyIntro: `تصف سياسة الخصوصية هذه كيفية جمع Elysium Media FZCO واستخدام وتخزين وحماية المعلومات التي يتم جمعها عند استخدام تطبيق ${APP_NAME} اللامركزي.`,
    acceptPrivacyPolicy: "أوافق على سياسة الخصوصية",
    viewFullPrivacy: "عرض النسخة الكاملة",
    privacyContent: `تصف سياسة الخصوصية هذه كيفية جمع Elysium Media FZCO، مع العنوان المسجل في المعرف: 58510، المبنى رقم 58510 - 001، منطقة الأعمال IFZA، DDP، دبي، الإمارات العربية المتحدة ("نحن"، "لدينا" أو "WayBank") واستخدام وتخزين وحماية المعلومات المجمعة عند استخدام تطبيقنا اللامركزي.

باستخدام WayBank، فإنك توافق على الممارسات الموضحة في سياسة الخصوصية هذه. إذا كنت لا توافق على هذه السياسة، فالرجاء عدم استخدام تطبيقنا.

1. المعلومات التي نجمعها
**المعلومات المقدمة مباشرة من قبلك:**
- عنوان المحفظة
- تفضيلات التكوين
- معلومات حول المعاملات التي تتم من خلال التطبيق

**المعلومات التي يتم جمعها تلقائيًا:**
- بيانات الاستخدام والتحليلات
- معلومات الجهاز والمتصفح
- عنوان IP
- بيانات السجل ونشاط التطبيق

2. كيف نستخدم معلوماتك
نستخدم المعلومات المجمعة لـ:
- توفير وصيانة خدماتنا
- تحسين وتخصيص وتوسيع تطبيقنا
- فهم كيفية استخدامك لتطبيقنا
- تطوير منتجات وخدمات وميزات جديدة
- التواصل معك
- منع الأنشطة الاحتيالية أو غير القانونية`,
    
    disclaimerTitle: "إخلاء المسؤولية",
    disclaimerIntro: `يتم توفير إخلاء المسؤولية هذا ("الإشعار") بواسطة Elysium Media FZCO وينطبق على جميع مستخدمي تطبيق ${APP_NAME} اللامركزي ("${APP_NAME}" أو "التطبيق").`,
    acceptDisclaimer: "أوافق على إخلاء المسؤولية",
    viewFullDisclaimer: "عرض النسخة الكاملة",
    disclaimerContent: `يتم توفير إخلاء المسؤولية هذا ("الإشعار") بواسطة Elysium Media FZCO، مع العنوان المسجل في المعرف: 58510، المبنى رقم 58510 - 001، منطقة الأعمال IFZA، DDP، دبي، الإمارات العربية المتحدة، وينطبق على جميع مستخدمي تطبيق WayBank اللامركزي ("WayBank" أو "التطبيق").

يرجى قراءة هذا الإشعار بعناية. بمجرد الوصول إلى أو استخدام WayBank، فإنك توافق على الالتزام قانونًا بجميع البيانات والتحذيرات والإعفاءات الواردة في هذا الإشعار.

1. المخاطر وعدم تقديم المشورة المالية
**ليست مشورة مالية:** المعلومات والخدمات المقدمة من خلال WayBank هي لأغراض إعلامية وللتسهيل فقط، ولا تشكل مشورة مالية أو استثمارية أو قانونية. نحن لسنا مستشارين ماليين أو استثماريين أو قانونيين.

**مخاطر الاستثمار:** ينطوي الاستثمار في العملات المشفرة والرموز واستخدام تقنية DeFi على مخاطر عالية، بما في ذلك إمكانية خسارة رأس المال بالكامل. يمكن أن تتقلب قيمة الأصول الرقمية بشكل كبير وقد تفقد قيمتها. يجب عليك الاستثمار فقط فيما أنت على استعداد لخسارته.

2. دقة المعلومات
على الرغم من جهودنا لتقديم معلومات دقيقة وحديثة، فإننا لا نضمن دقة أو اكتمال أو حداثة المعلومات المقدمة في أو من خلال التطبيق. قد تحتوي المعلومات على أخطاء أو عدم دقة أو تكون قديمة، ويمكننا إجراء تغييرات على المعلومات في أي وقت دون إشعار مسبق.

3. إخلاء المسؤولية عن الضمانات
يتم توفير التطبيق وجميع الخدمات والمحتوى والوظائف المتاحة من خلال التطبيق "كما هي" و"كما هي متاحة"، دون أي ضمان من أي نوع، سواء كان صريحًا أو ضمنيًا.

نحن نتنصل صراحة من جميع الضمانات من أي نوع، سواء كانت صريحة أو ضمنية، بما في ذلك، على سبيل المثال لا الحصر، الضمانات الضمنية للتسويق والملاءمة لغرض معين وعدم الانتهاك والملكية والتشغيل دون انقطاع وخالية من الأخطاء والفيروسات.`,
  },
  
  // Portugués
  pt: {
    termsOfUseTab: "Termos de Uso",
    privacyPolicyTab: "Política de Privacidade",
    disclaimerTab: "Aviso Legal",
    
    dialogTitle: "Termos Legais",
    dialogSubtitle: `Antes de começar a usar o ${APP_NAME}, você deve aceitar nossos termos legais.`,
    warningMessage: `Para acessar o ${APP_NAME}, você deve ler e aceitar todos os documentos legais.`,
    infoMessage: `Para usar o ${APP_NAME}, você deve aceitar os Termos de Uso, a Política de Privacidade e o Aviso Legal.`,
    allDocsRequired: "Este diálogo não pode ser fechado até que você aceite todos os documentos.",
    
    nextDocument: "Próximo documento",
    confirmAndContinue: "Confirmar e continuar",
    processing: "Processando...",
    acceptedDocs: "documentos aceitos",
    allDocsAccepted: "Todos os documentos aceitos ✓",
    
    termsOfUseTitle: "Termos de Uso",
    termsOfUseIntro: `Estes Termos de Uso (os "Termos") regem seu acesso e uso do aplicativo descentralizado ${APP_NAME} ("${APP_NAME}" ou o "Aplicativo"), fornecido por Elysium Media FZCO.`,
    acceptTermsOfUse: "Aceito os Termos de Uso",
    viewFullTerms: "Ver versão completa",
    termsContent: `Estes Termos de Uso (os "Termos") regem seu acesso e uso do aplicativo descentralizado WayBank ("WayBank" ou o "Aplicativo"), fornecido por Elysium Media FZCO, com endereço registrado em ID: 58510, Premises no. 58510 - 001, IFZA Business Park, DDP, DUBAI, UAE.

Ao acessar ou utilizar o WayBank, você concorda em estar legalmente vinculado por estes Termos. Se você não concordar com qualquer parte destes Termos, não deve acessar ou usar o Aplicativo.

1. Definições
- "Aplicativo" refere-se ao aplicativo descentralizado WayBank, que fornece serviços de gerenciamento de posições de liquidez para Uniswap v4.
- "Usuário" refere-se a qualquer pessoa ou entidade que acessa ou usa o Aplicativo.
- "Serviços" refere-se a todas as funcionalidades, recursos e serviços fornecidos através do Aplicativo.
- "Conteúdo" refere-se a todas as informações e materiais disponíveis no Aplicativo, incluindo texto, gráficos, interfaces de usuário, marcas comerciais, logotipos, imagens e código.

2. Elegibilidade
Para usar o Aplicativo, você deve ter pelo menos 18 anos de idade e capacidade legal para celebrar um contrato vinculante. Ao usar o Aplicativo, você declara e garante que atende a esses requisitos.

3. Serviços do Aplicativo
WayBank fornece ferramentas para gerenciar posições de liquidez no Uniswap v4, incluindo:
- Criação e gerenciamento de posições de liquidez
- Acompanhamento de desempenho
- Análise de dados blockchain
- Gerenciamento de posições NFT

Esses serviços interagem com contratos inteligentes em múltiplas blockchains e envolvem riscos inerentes. Os Usuários assumem todos os riscos associados ao uso do Aplicativo e transações blockchain.`,
    
    privacyPolicyTitle: "Política de Privacidade",
    privacyPolicyIntro: "Esta Política de Privacidade descreve como a Elysium Media FZCO coleta, usa, armazena e protege as informações coletadas quando você usa nosso aplicativo descentralizado.",
    acceptPrivacyPolicy: "Aceito a Política de Privacidade",
    viewFullPrivacy: "Ver versão completa",
    privacyContent: `Esta Política de Privacidade descreve como a Elysium Media FZCO, com endereço registrado em ID: 58510, Premises no. 58510 - 001, IFZA Business Park, DDP, DUBAI, UAE ("nós", "nosso" ou "WayBank") coleta, usa, armazena e protege as informações coletadas quando você usa nosso aplicativo descentralizado.

Ao usar o WayBank, você concorda com as práticas descritas nesta Política de Privacidade. Se você não concordar com esta Política, por favor não use nosso Aplicativo.

1. Informações que Coletamos
**Informações fornecidas diretamente por você:**
- Endereço da carteira
- Preferências de configuração
- Informações sobre transações realizadas através do Aplicativo

**Informações coletadas automaticamente:**
- Dados de uso e análise
- Informações do dispositivo e navegador
- Endereço IP
- Dados de log e atividade no Aplicativo

2. Como Usamos Suas Informações
Usamos as informações coletadas para:
- Fornecer e manter nossos serviços
- Melhorar, personalizar e expandir nosso Aplicativo
- Entender como você usa nosso Aplicativo
- Desenvolver novos produtos, serviços e recursos
- Comunicar-nos com você
- Prevenir atividades fraudulentas ou ilegais`,
    
    disclaimerTitle: "Aviso Legal",
    disclaimerIntro: `Este Aviso Legal (o "Aviso") é fornecido pela Elysium Media FZCO e se aplica a todos os usuários do aplicativo descentralizado ${APP_NAME} ("${APP_NAME}" ou o "Aplicativo").`,
    acceptDisclaimer: "Aceito o Aviso Legal",
    viewFullDisclaimer: "Ver versão completa",
    disclaimerContent: `Este Aviso Legal (o "Aviso") é fornecido pela Elysium Media FZCO, com endereço registrado em ID: 58510, Premises no. 58510 - 001, IFZA Business Park, DDP, DUBAI, UAE, e se aplica a todos os usuários do aplicativo descentralizado WayBank ("WayBank" ou o "Aplicativo").

Por favor, leia este Aviso cuidadosamente. Ao acessar ou usar o WayBank, você concorda em estar legalmente vinculado por todas as declarações, advertências e isenções contidas neste Aviso.

1. Risco e Não Aconselhamento Financeiro
**NÃO É ACONSELHAMENTO FINANCEIRO:** As informações e serviços fornecidos através do WayBank são apenas para fins informativos e de conveniência, e não constituem aconselhamento financeiro, de investimento ou legal. Não somos consultores financeiros, de investimento ou legais.

**RISCO DE INVESTIMENTO:** Investir em criptomoedas, tokens e o uso da tecnologia DeFi envolve alto risco, incluindo a possibilidade de perda total do capital. O valor dos ativos digitais pode flutuar significativamente e pode perder valor. Você deve investir apenas o que está disposto a perder.

2. Precisão das Informações
Apesar de nossos esforços para fornecer informações precisas e atualizadas, não garantimos a precisão, integridade ou atualidade das informações fornecidas em ou através do Aplicativo. As informações podem conter erros, imprecisões ou estar desatualizadas, e podemos fazer alterações nas informações a qualquer momento sem aviso prévio.

3. Isenção de Garantias
O APLICATIVO E TODOS OS SERVIÇOS, CONTEÚDO E FUNCIONALIDADE DISPONÍVEIS ATRAVÉS DO APLICATIVO SÃO FORNECIDOS "COMO ESTÃO" E "CONFORME DISPONÍVEIS", SEM GARANTIA DE QUALQUER TIPO, EXPRESSA OU IMPLÍCITA.

RENUNCIAMOS EXPRESSAMENTE A TODAS AS GARANTIAS DE QUALQUER TIPO, SEJAM EXPRESSAS OU IMPLÍCITAS, INCLUINDO, MAS NÃO SE LIMITANDO A, GARANTIAS IMPLÍCITAS DE COMERCIALIZAÇÃO, ADEQUAÇÃO A UM DETERMINADO FIM, NÃO VIOLAÇÃO, TÍTULO, OPERAÇÃO SEM INTERRUPÇÃO, SEM ERROS E SEM VÍRUS.`,
  },
  
  // Italiano
  it: {
    termsOfUseTab: "Termini di Utilizzo",
    privacyPolicyTab: "Politica sulla Privacy",
    disclaimerTab: "Disclaimer",
    
    dialogTitle: "Termini Legali",
    dialogSubtitle: `Prima di iniziare a utilizzare ${APP_NAME}, devi accettare i nostri termini legali.`,
    warningMessage: `Per accedere a ${APP_NAME}, devi leggere e accettare tutti i documenti legali.`,
    infoMessage: `Per utilizzare ${APP_NAME}, devi accettare i Termini di Utilizzo, la Politica sulla Privacy e il Disclaimer.`,
    allDocsRequired: "Questa finestra di dialogo non può essere chiusa finché non accetti tutti i documenti.",
    
    nextDocument: "Documento successivo",
    confirmAndContinue: "Conferma e continua",
    processing: "Elaborazione in corso...",
    acceptedDocs: "documenti accettati",
    allDocsAccepted: "Tutti i documenti accettati ✓",
    
    termsOfUseTitle: "Termini di Utilizzo",
    termsOfUseIntro: `Questi Termini di Utilizzo (i "Termini") regolano l'accesso e l'utilizzo dell'applicazione decentralizzata ${APP_NAME} ("${APP_NAME}" o l'"Applicazione"), fornita da Elysium Media FZCO.`,
    acceptTermsOfUse: "Accetto i Termini di Utilizzo",
    viewFullTerms: "Visualizza versione completa",
    termsContent: `Questi Termini di Utilizzo (i "Termini") regolano l'accesso e l'utilizzo dell'applicazione decentralizzata WayBank ("WayBank" o l'"Applicazione"), fornita da Elysium Media FZCO, con sede legale presso ID: 58510, Premises no. 58510 - 001, IFZA Business Park, DDP, DUBAI, UAE.

Accedendo o utilizzando WayBank, accetti di essere legalmente vincolato da questi Termini. Se non sei d'accordo con qualsiasi parte di questi Termini, non dovresti accedere o utilizzare l'Applicazione.

1. Definizioni
- "Applicazione" si riferisce all'applicazione decentralizzata WayBank che fornisce servizi di gestione delle posizioni di liquidità per Uniswap v4.
- "Utente" si riferisce a qualsiasi persona o entità che accede o utilizza l'Applicazione.
- "Servizi" si riferisce a tutte le funzionalità, caratteristiche e servizi forniti attraverso l'Applicazione.
- "Contenuto" si riferisce a tutte le informazioni e materiali disponibili sull'Applicazione, inclusi testi, grafica, interfacce utente, marchi, loghi, immagini e codice.

2. Idoneità
Per utilizzare l'Applicazione, devi avere almeno 18 anni e la capacità legale di stipulare un contratto vincolante. Utilizzando l'Applicazione, dichiari e garantisci di soddisfare questi requisiti.

3. Servizi dell'Applicazione
WayBank fornisce strumenti per gestire posizioni di liquidità su Uniswap v4, tra cui:
- Creazione e gestione di posizioni di liquidità
- Monitoraggio delle prestazioni
- Analisi dei dati blockchain
- Gestione delle posizioni NFT

Questi servizi interagiscono con smart contract su diverse blockchain e comportano rischi intrinseci. Gli Utenti si assumono tutti i rischi associati all'uso dell'Applicazione e alle transazioni blockchain.`,
    
    privacyPolicyTitle: "Politica sulla Privacy",
    privacyPolicyIntro: "Questa Politica sulla Privacy descrive come Elysium Media FZCO raccoglie, utilizza, memorizza e protegge le informazioni raccolte quando utilizzi la nostra applicazione decentralizzata.",
    acceptPrivacyPolicy: "Accetto la Politica sulla Privacy",
    viewFullPrivacy: "Visualizza versione completa",
    privacyContent: `Questa Politica sulla Privacy descrive come Elysium Media FZCO, con sede legale presso ID: 58510, Premises no. 58510 - 001, IFZA Business Park, DDP, DUBAI, UAE ("noi", "nostro" o "WayBank") raccoglie, utilizza, memorizza e protegge le informazioni raccolte quando utilizzi la nostra applicazione decentralizzata.

Utilizzando WayBank, accetti le pratiche descritte in questa Politica sulla Privacy. Se non sei d'accordo con questa Politica, ti preghiamo di non utilizzare la nostra Applicazione.

1. Informazioni che Raccogliamo
**Informazioni fornite direttamente da te:**
- Indirizzo del wallet
- Preferenze di configurazione
- Informazioni sulle transazioni effettuate attraverso l'Applicazione

**Informazioni raccolte automaticamente:**
- Dati di utilizzo e analisi
- Informazioni sul dispositivo e sul browser
- Indirizzo IP
- Dati di log e attività dell'Applicazione

2. Come Utilizziamo le Tue Informazioni
Utilizziamo le informazioni raccolte per:
- Fornire e mantenere i nostri servizi
- Migliorare, personalizzare ed espandere la nostra Applicazione
- Capire come utilizzi la nostra Applicazione
- Sviluppare nuovi prodotti, servizi e funzionalità
- Comunicare con te
- Prevenire attività fraudolente o illegali`,
    
    disclaimerTitle: "Disclaimer",
    disclaimerIntro: `Questo Disclaimer (l'"Avviso") è fornito da Elysium Media FZCO e si applica a tutti gli utenti dell'applicazione decentralizzata ${APP_NAME} ("${APP_NAME}" o l'"Applicazione").`,
    acceptDisclaimer: "Accetto il Disclaimer",
    viewFullDisclaimer: "Visualizza versione completa",
    disclaimerContent: `Questo Disclaimer (l'"Avviso") è fornito da Elysium Media FZCO, con sede legale presso ID: 58510, Premises no. 58510 - 001, IFZA Business Park, DDP, DUBAI, UAE, e si applica a tutti gli utenti dell'applicazione decentralizzata WayBank ("WayBank" o l'"Applicazione").

Ti preghiamo di leggere attentamente questo Avviso. Accedendo o utilizzando WayBank, accetti di essere legalmente vincolato da tutte le dichiarazioni, avvertenze ed esclusioni di responsabilità contenute in questo Avviso.

1. Rischio e Nessuna Consulenza Finanziaria
**NESSUNA CONSULENZA FINANZIARIA:** Le informazioni e i servizi forniti attraverso WayBank sono solo a scopo informativo e di comodità e non costituiscono consulenza finanziaria, di investimento o legale. Non siamo consulenti finanziari, di investimento o legali.

**RISCHIO DI INVESTIMENTO:** Investire in criptovalute, token e utilizzare la tecnologia DeFi comporta un alto rischio, inclusa la possibilità di perdita totale del capitale. Il valore degli asset digitali può fluttuare significativamente e può perdere valore. Dovresti investire solo ciò che sei disposto a perdere.

2. Accuratezza delle Informazioni
Nonostante i nostri sforzi per fornire informazioni accurate e aggiornate, non garantiamo l'accuratezza, la completezza o la tempestività delle informazioni fornite su o attraverso l'Applicazione. Le informazioni possono contenere errori, imprecisioni o essere obsolete, e potremmo apportare modifiche alle informazioni in qualsiasi momento senza preavviso.

3. Esclusione di Garanzie
L'APPLICAZIONE E TUTTI I SERVIZI, CONTENUTI E FUNZIONALITÀ DISPONIBILI ATTRAVERSO L'APPLICAZIONE SONO FORNITI "COSÌ COME SONO" E "COME DISPONIBILI", SENZA GARANZIE DI ALCUN TIPO, ESPLICITE O IMPLICITE.

DECLINIAMO ESPRESSAMENTE TUTTE LE GARANZIE DI QUALSIASI TIPO, SIANO ESSE ESPLICITE O IMPLICITE, INCLUDENDO, MA NON LIMITANDOSI A, GARANZIE IMPLICITE DI COMMERCIABILITÀ, IDONEITÀ PER UNO SCOPO PARTICOLARE, NON VIOLAZIONE, TITOLO, FUNZIONAMENTO SENZA INTERRUZIONI, SENZA ERRORI E SENZA VIRUS.`,
  },
  
  // Francés
  fr: {
    termsOfUseTab: "Conditions d'Utilisation",
    privacyPolicyTab: "Politique de Confidentialité",
    disclaimerTab: "Avis de Non-Responsabilité",
    
    dialogTitle: "Conditions Légales",
    dialogSubtitle: `Avant de commencer à utiliser ${APP_NAME}, vous devez accepter nos conditions légales.`,
    warningMessage: `Pour accéder à ${APP_NAME}, vous devez lire et accepter tous les documents légaux.`,
    infoMessage: `Pour utiliser ${APP_NAME}, vous devez accepter les Conditions d'Utilisation, la Politique de Confidentialité et l'Avis de Non-Responsabilité.`,
    allDocsRequired: "Cette boîte de dialogue ne peut pas être fermée tant que vous n'avez pas accepté tous les documents.",
    
    nextDocument: "Document suivant",
    confirmAndContinue: "Confirmer et continuer",
    processing: "Traitement en cours...",
    acceptedDocs: "documents acceptés",
    allDocsAccepted: "Tous les documents acceptés ✓",
    
    termsOfUseTitle: "Conditions d'Utilisation",
    termsOfUseIntro: `Ces Conditions d'Utilisation (les "Conditions") régissent votre accès et utilisation de l'application décentralisée ${APP_NAME} ("${APP_NAME}" ou l'"Application"), fournie par Elysium Media FZCO.`,
    acceptTermsOfUse: "J'accepte les Conditions d'Utilisation",
    viewFullTerms: "Voir version complète",
    termsContent: `Ces Conditions d'Utilisation (les "Conditions") régissent votre accès et utilisation de l'application décentralisée WayBank ("WayBank" ou l'"Application"), fournie par Elysium Media FZCO, dont l'adresse enregistrée est ID: 58510, Premises no. 58510 - 001, IFZA Business Park, DDP, DUBAI, UAE.

En accédant ou en utilisant WayBank, vous acceptez d'être légalement lié par ces Conditions. Si vous n'êtes pas d'accord avec une partie de ces Conditions, vous ne devriez pas accéder ou utiliser l'Application.

1. Définitions
- "Application" désigne l'application décentralisée WayBank qui fournit des services de gestion de positions de liquidité pour Uniswap v4.
- "Utilisateur" désigne toute personne ou entité qui accède ou utilise l'Application.
- "Services" désigne toutes les fonctionnalités, caractéristiques et services fournis via l'Application.
- "Contenu" désigne toutes les informations et matériaux disponibles sur l'Application, y compris texte, graphiques, interfaces utilisateur, marques commerciales, logos, images et code.

2. Éligibilité
Pour utiliser l'Application, vous devez avoir au moins 18 ans et la capacité juridique de conclure un contrat contraignant. En utilisant l'Application, vous déclarez et garantissez que vous remplissez ces conditions.

3. Services de l'Application
WayBank fournit des outils pour gérer les positions de liquidité sur Uniswap v4, notamment:
- Création et gestion de positions de liquidité
- Suivi des performances
- Analyse des données blockchain
- Gestion des positions NFT

Ces services interagissent avec des contrats intelligents sur plusieurs blockchains et comportent des risques inhérents. Les Utilisateurs assument tous les risques associés à l'utilisation de l'Application et aux transactions blockchain.`,
    
    privacyPolicyTitle: "Politique de Confidentialité",
    privacyPolicyIntro: `Cette Politique de Confidentialité décrit comment Elysium Media FZCO collecte, utilise, stocke et protège les informations recueillies lorsque vous utilisez notre application décentralisée ${APP_NAME}.`,
    acceptPrivacyPolicy: "J'accepte la Politique de Confidentialité",
    viewFullPrivacy: "Voir version complète",
    privacyContent: `Cette Politique de Confidentialité décrit comment Elysium Media FZCO, dont l'adresse enregistrée est ID: 58510, Premises no. 58510 - 001, IFZA Business Park, DDP, DUBAI, UAE ("nous", "notre" ou "WayBank") collecte, utilise, stocke et protège les informations recueillies lorsque vous utilisez notre application décentralisée.

En utilisant WayBank, vous acceptez les pratiques décrites dans cette Politique de Confidentialité. Si vous n'êtes pas d'accord avec cette Politique, veuillez ne pas utiliser notre Application.

1. Informations que Nous Collectons
**Informations fournies directement par vous:**
- Adresse de portefeuille
- Préférences de configuration
- Informations sur les transactions effectuées via l'Application

**Informations collectées automatiquement:**
- Données d'utilisation et d'analyse
- Informations sur l'appareil et le navigateur
- Adresse IP
- Données de journal et activité de l'Application

2. Comment Nous Utilisons Vos Informations
Nous utilisons les informations collectées pour:
- Fournir et maintenir nos services
- Améliorer, personnaliser et étendre notre Application
- Comprendre comment vous utilisez notre Application
- Développer de nouveaux produits, services et fonctionnalités
- Communiquer avec vous
- Prévenir les activités frauduleuses ou illégales`,
    
    disclaimerTitle: "Avis de Non-Responsabilité",
    disclaimerIntro: `Cet Avis de Non-Responsabilité (l'"Avis") est fourni par Elysium Media FZCO et s'applique à tous les utilisateurs de l'application décentralisée ${APP_NAME} ("${APP_NAME}" ou l'"Application").`,
    acceptDisclaimer: "J'accepte l'Avis de Non-Responsabilité",
    viewFullDisclaimer: "Voir version complète",
    disclaimerContent: `Cet Avis de Non-Responsabilité (l'"Avis") est fourni par Elysium Media FZCO, dont l'adresse enregistrée est ID: 58510, Premises no. 58510 - 001, IFZA Business Park, DDP, DUBAI, UAE, et s'applique à tous les utilisateurs de l'application décentralisée WayBank ("WayBank" ou l'"Application").

Veuillez lire attentivement cet Avis. En accédant ou en utilisant WayBank, vous acceptez d'être légalement lié par toutes les déclarations, avertissements et clauses de non-responsabilité contenus dans cet Avis.

1. Risque et Absence de Conseil Financier
**PAS DE CONSEIL FINANCIER:** Les informations et services fournis via WayBank sont uniquement à des fins informatives et de commodité, et ne constituent pas un conseil financier, d'investissement ou juridique. Nous ne sommes pas des conseillers financiers, d'investissement ou juridiques.

**RISQUE D'INVESTISSEMENT:** Investir dans des cryptomonnaies, des tokens et utiliser la technologie DeFi comporte un risque élevé, y compris la possibilité de perte totale du capital. La valeur des actifs numériques peut fluctuer considérablement et peut perdre de la valeur. Vous ne devriez investir que ce que vous êtes prêt à perdre.

2. Exactitude des Informations
Malgré nos efforts pour fournir des informations précises et à jour, nous ne garantissons pas l'exactitude, l'exhaustivité ou l'actualité des informations fournies sur ou via l'Application. Les informations peuvent contenir des erreurs, des inexactitudes ou être obsolètes, et nous pouvons apporter des modifications aux informations à tout moment sans préavis.

3. Exclusion de Garanties
L'APPLICATION ET TOUS LES SERVICES, CONTENUS ET FONCTIONNALITÉS DISPONIBLES VIA L'APPLICATION SONT FOURNIS "TELS QUELS" ET "SELON DISPONIBILITÉ", SANS GARANTIE D'AUCUNE SORTE, EXPRESSE OU IMPLICITE.

NOUS DÉCLINONS EXPRESSÉMENT TOUTES LES GARANTIES DE TOUTE SORTE, QU'ELLES SOIENT EXPRESSES OU IMPLICITES, Y COMPRIS, MAIS SANS S'Y LIMITER, LES GARANTIES IMPLICITES DE QUALITÉ MARCHANDE, D'ADÉQUATION À UN USAGE PARTICULIER, DE NON-VIOLATION, DE TITRE, DE FONCTIONNEMENT SANS INTERRUPTION, SANS ERREURS ET SANS VIRUS.`,
  },
  
  // Alemán
  de: {
    termsOfUseTab: "Nutzungsbedingungen",
    privacyPolicyTab: "Datenschutzrichtlinie",
    disclaimerTab: "Haftungsausschluss",
    
    dialogTitle: "Rechtliche Bedingungen",
    dialogSubtitle: `Bevor Sie ${APP_NAME} nutzen können, müssen Sie unsere rechtlichen Bedingungen akzeptieren.`,
    warningMessage: `Um auf ${APP_NAME} zugreifen zu können, müssen Sie alle rechtlichen Dokumente lesen und akzeptieren.`,
    infoMessage: `Um ${APP_NAME} zu nutzen, müssen Sie die Nutzungsbedingungen, die Datenschutzrichtlinie und den Haftungsausschluss akzeptieren.`,
    allDocsRequired: "Dieser Dialog kann nicht geschlossen werden, bis Sie alle Dokumente akzeptiert haben.",
    
    nextDocument: "Nächstes Dokument",
    confirmAndContinue: "Bestätigen und fortfahren",
    processing: "Verarbeitung...",
    acceptedDocs: "Dokumente akzeptiert",
    allDocsAccepted: "Alle Dokumente akzeptiert ✓",
    
    termsOfUseTitle: "Nutzungsbedingungen",
    termsOfUseIntro: `Diese Nutzungsbedingungen (die "Bedingungen") regeln Ihren Zugang und die Nutzung der dezentralen Anwendung ${APP_NAME} ("${APP_NAME}" oder die "Anwendung"), die von Elysium Media FZCO bereitgestellt wird.`,
    acceptTermsOfUse: "Ich akzeptiere die Nutzungsbedingungen",
    viewFullTerms: "Vollständige Version anzeigen",
    termsContent: `Diese Nutzungsbedingungen (die "Bedingungen") regeln Ihren Zugang und die Nutzung der dezentralen Anwendung WayBank ("WayBank" oder die "Anwendung"), die von Elysium Media FZCO mit Sitz in ID: 58510, Premises no. 58510 - 001, IFZA Business Park, DDP, DUBAI, UAE bereitgestellt wird.

Durch den Zugriff auf oder die Nutzung von WayBank erklären Sie sich damit einverstanden, rechtlich an diese Bedingungen gebunden zu sein. Wenn Sie mit einem Teil dieser Bedingungen nicht einverstanden sind, sollten Sie nicht auf die Anwendung zugreifen oder diese nutzen.

1. Definitionen
- "Anwendung" bezieht sich auf die dezentrale Anwendung WayBank, die Liquiditätspositionsverwaltungsdienste für Uniswap v4 bereitstellt.
- "Benutzer" bezieht sich auf jede Person oder Einrichtung, die auf die Anwendung zugreift oder diese nutzt.
- "Dienste" bezieht sich auf alle Funktionalitäten, Merkmale und Dienste, die über die Anwendung bereitgestellt werden.
- "Inhalt" bezieht sich auf alle Informationen und Materialien, die in der Anwendung verfügbar sind, einschließlich Text, Grafiken, Benutzeroberflächen, Marken, Logos, Bilder und Code.

2. Berechtigung
Um die Anwendung zu nutzen, müssen Sie mindestens 18 Jahre alt sein und die rechtliche Fähigkeit besitzen, einen bindenden Vertrag einzugehen. Durch die Nutzung der Anwendung erklären und garantieren Sie, dass Sie diese Anforderungen erfüllen.

3. Anwendungsdienste
WayBank bietet Tools zur Verwaltung von Liquiditätspositionen auf Uniswap v4, darunter:
- Erstellung und Verwaltung von Liquiditätspositionen
- Leistungsverfolgung
- Blockchain-Datenanalyse
- NFT-Positionsverwaltung

Diese Dienste interagieren mit Smart Contracts auf mehreren Blockchains und beinhalten inhärente Risiken. Benutzer übernehmen alle Risiken im Zusammenhang mit der Nutzung der Anwendung und Blockchain-Transaktionen.`,
    
    privacyPolicyTitle: "Datenschutzrichtlinie",
    privacyPolicyIntro: `Diese Datenschutzrichtlinie beschreibt, wie Elysium Media FZCO Informationen sammelt, verwendet, speichert und schützt, die bei der Nutzung unserer dezentralen Anwendung ${APP_NAME} erfasst werden.`,
    acceptPrivacyPolicy: "Ich akzeptiere die Datenschutzrichtlinie",
    viewFullPrivacy: "Vollständige Version anzeigen",
    privacyContent: `Diese Datenschutzrichtlinie beschreibt, wie Elysium Media FZCO mit Sitz in ID: 58510, Premises no. 58510 - 001, IFZA Business Park, DDP, DUBAI, UAE ("wir", "uns" oder "WayBank") Informationen sammelt, verwendet, speichert und schützt, die bei der Nutzung unserer dezentralen Anwendung erfasst werden.

Durch die Nutzung von WayBank stimmen Sie den in dieser Datenschutzrichtlinie beschriebenen Praktiken zu. Wenn Sie mit dieser Richtlinie nicht einverstanden sind, nutzen Sie bitte unsere Anwendung nicht.

1. Informationen, die wir sammeln
**Direkt von Ihnen bereitgestellte Informationen:**
- Wallet-Adresse
- Konfigurationseinstellungen
- Informationen zu Transaktionen, die über die Anwendung durchgeführt werden

**Automatisch gesammelte Informationen:**
- Nutzungs- und Analysedaten
- Geräte- und Browserinformationen
- IP-Adresse
- Protokolldaten und Anwendungsaktivität

2. Wie wir Ihre Informationen verwenden
Wir verwenden die gesammelten Informationen, um:
- Unsere Dienste bereitzustellen und zu warten
- Unsere Anwendung zu verbessern, anzupassen und zu erweitern
- Zu verstehen, wie Sie unsere Anwendung nutzen
- Neue Produkte, Dienste und Funktionen zu entwickeln
- Mit Ihnen zu kommunizieren
- Betrügerische oder illegale Aktivitäten zu verhindern`,
    
    disclaimerTitle: "Haftungsausschluss",
    disclaimerIntro: `Dieser Haftungsausschluss (der "Hinweis") wird von Elysium Media FZCO bereitgestellt und gilt für alle Benutzer der dezentralen Anwendung ${APP_NAME} ("${APP_NAME}" oder die "Anwendung").`,
    acceptDisclaimer: "Ich akzeptiere den Haftungsausschluss",
    viewFullDisclaimer: "Vollständige Version anzeigen",
    disclaimerContent: `Dieser Haftungsausschluss (der "Hinweis") wird von Elysium Media FZCO mit Sitz in ID: 58510, Premises no. 58510 - 001, IFZA Business Park, DDP, DUBAI, UAE bereitgestellt und gilt für alle Benutzer der dezentralen Anwendung WayBank ("WayBank" oder die "Anwendung").

Bitte lesen Sie diesen Hinweis sorgfältig durch. Durch den Zugriff auf oder die Nutzung von WayBank erklären Sie sich damit einverstanden, rechtlich an alle Aussagen, Warnungen und Haftungsausschlüsse in diesem Hinweis gebunden zu sein.

1. Risiko und keine Finanzberatung
**KEINE FINANZBERATUNG:** Die über WayBank bereitgestellten Informationen und Dienste dienen nur zu Informations- und Annehmlichkeitszwecken und stellen keine Finanz-, Anlage- oder Rechtsberatung dar. Wir sind keine Finanz-, Anlage- oder Rechtsberater.

**ANLAGERISIKO:** Die Investition in Kryptowährungen, Token und die Nutzung der DeFi-Technologie ist mit hohem Risiko verbunden, einschließlich der Möglichkeit eines vollständigen Kapitalverlusts. Der Wert digitaler Vermögenswerte kann erheblich schwanken und an Wert verlieren. Sie sollten nur investieren, was Sie bereit sind zu verlieren.

2. Genauigkeit der Informationen
Trotz unserer Bemühungen, genaue und aktuelle Informationen bereitzustellen, garantieren wir nicht die Genauigkeit, Vollständigkeit oder Aktualität der über die Anwendung bereitgestellten Informationen. Die Informationen können Fehler, Ungenauigkeiten enthalten oder veraltet sein, und wir können jederzeit ohne vorherige Ankündigung Änderungen an den Informationen vornehmen.

3. Haftungsausschluss
DIE ANWENDUNG UND ALLE DIENSTE, INHALTE UND FUNKTIONEN, DIE ÜBER DIE ANWENDUNG VERFÜGBAR SIND, WERDEN "WIE BESEHEN" UND "WIE VERFÜGBAR" OHNE JEGLICHE GARANTIE, WEDER AUSDRÜCKLICH NOCH STILLSCHWEIGEND, BEREITGESTELLT.

WIR LEHNEN AUSDRÜCKLICH ALLE GARANTIEN JEGLICHER ART AB, OB AUSDRÜCKLICH ODER STILLSCHWEIGEND, EINSCHLIESSLICH, ABER NICHT BESCHRÄNKT AUF, DIE STILLSCHWEIGENDEN GARANTIEN DER MARKTGÄNGIGKEIT, EIGNUNG FÜR EINEN BESTIMMTEN ZWECK, NICHTVERLETZUNG, TITEL, BETRIEB OHNE UNTERBRECHUNG, OHNE FEHLER UND OHNE VIREN.`,
  },
  
  // Hindi
  hi: {
    termsOfUseTab: "उपयोग की शर्तें",
    privacyPolicyTab: "गोपनीयता नीति",
    disclaimerTab: "अस्वीकरण",
    
    dialogTitle: "कानूनी शर्तें",
    dialogSubtitle: `${APP_NAME} का उपयोग शुरू करने से पहले, आपको हमारी कानूनी शर्तों को स्वीकार करना होगा।`,
    warningMessage: `${APP_NAME} तक पहुंचने के लिए, आपको सभी कानूनी दस्तावेज़ों को पढ़ना और स्वीकार करना होगा।`,
    infoMessage: `${APP_NAME} का उपयोग करने के लिए, आपको उपयोग की शर्तें, गोपनीयता नीति और अस्वीकरण को स्वीकार करना होगा।`,
    allDocsRequired: "जब तक आप सभी दस्तावेज़ों को स्वीकार नहीं करते, तब तक यह संवाद बंद नहीं किया जा सकता।",
    
    nextDocument: "अगला दस्तावेज़",
    confirmAndContinue: "पुष्टि करें और जारी रखें",
    processing: "प्रसंस्करण...",
    acceptedDocs: "दस्तावेज़ स्वीकृत",
    allDocsAccepted: "सभी दस्तावेज़ स्वीकृत ✓",
    
    termsOfUseTitle: "उपयोग की शर्तें",
    termsOfUseIntro: `ये उपयोग की शर्तें ("शर्तें") Elysium Media FZCO द्वारा प्रदान की गई ${APP_NAME} विकेंद्रीकृत एप्लिकेशन ("${APP_NAME}" या "एप्लिकेशन") तक आपकी पहुंच और उपयोग को नियंत्रित करती हैं।`,
    acceptTermsOfUse: "मैं उपयोग की शर्तों को स्वीकार करता हूं",
    viewFullTerms: "पूर्ण संस्करण देखें",
    termsContent: `ये उपयोग की शर्तें ("शर्तें") Elysium Media FZCO द्वारा प्रदान की गई WayBank विकेंद्रीकृत एप्लिकेशन ("WayBank" या "एप्लिकेशन") तक आपकी पहुंच और उपयोग को नियंत्रित करती हैं, जिसका पंजीकृत पता है ID: 58510, Premises no. 58510 - 001, IFZA Business Park, DDP, DUBAI, UAE।

WayBank तक पहुंचने या उसका उपयोग करने पर, आप इन शर्तों से कानूनी रूप से बाध्य होने के लिए सहमत होते हैं। यदि आप इन शर्तों के किसी भी हिस्से से सहमत नहीं हैं, तो आपको एप्लिकेशन तक पहुंच या उपयोग नहीं करना चाहिए।

1. परिभाषाएँ
- "एप्लिकेशन" का अर्थ WayBank विकेंद्रीकृत एप्लिकेशन से है, जो Uniswap v4 के लिए तरलता स्थिति प्रबंधन सेवाएं प्रदान करता है।
- "उपयोगकर्ता" का अर्थ किसी भी व्यक्ति या संस्था से है जो एप्लिकेशन तक पहुंचता है या उसका उपयोग करता है।
- "सेवाओं" का अर्थ एप्लिकेशन के माध्यम से प्रदान की जाने वाली सभी कार्यक्षमताओं, विशेषताओं और सेवाओं से है।
- "सामग्री" का अर्थ एप्लिकेशन में उपलब्ध सभी जानकारी और सामग्री से है, जिसमें पाठ, ग्राफिक्स, उपयोगकर्ता इंटरफेस, ट्रेडमार्क, लोगो, छवियां और कोड शामिल हैं।

2. पात्रता
एप्लिकेशन का उपयोग करने के लिए, आपकी आयु कम से कम 18 वर्ष होनी चाहिए और बाध्यकारी अनुबंध करने की कानूनी क्षमता होनी चाहिए। एप्लिकेशन का उपयोग करके, आप घोषणा और गारंटी देते हैं कि आप इन आवश्यकताओं को पूरा करते हैं।

3. एप्लिकेशन सेवाएँ
WayBank Uniswap v4 पर तरलता स्थितियों का प्रबंधन करने के लिए उपकरण प्रदान करता है, जिसमें शामिल हैं:
- तरलता स्थितियों का निर्माण और प्रबंधन
- प्रदर्शन ट्रैकिंग
- ब्लॉकचेन डेटा विश्लेषण
- NFT स्थिति प्रबंधन

ये सेवाएँ कई ब्लॉकचेन पर स्मार्ट कॉन्ट्रैक्ट्स के साथ इंटरैक्ट करती हैं और अंतर्निहित जोखिम शामिल हैं। उपयोगकर्ता एप्लिकेशन और ब्लॉकचेन लेनदेन के उपयोग से जुड़े सभी जोखिमों को स्वीकार करते हैं।`,
    
    privacyPolicyTitle: "गोपनीयता नीति",
    privacyPolicyIntro: `यह गोपनीयता नीति बताती है कि Elysium Media FZCO कैसे जानकारी एकत्र करता है, उपयोग करता है, संग्रहीत करता है और सुरक्षित रखता है जो आपके द्वारा हमारे ${APP_NAME} विकेंद्रीकृत एप्लिकेशन का उपयोग करते समय एकत्र की जाती है।`,
    acceptPrivacyPolicy: "मैं गोपनीयता नीति को स्वीकार करता हूं",
    viewFullPrivacy: "पूर्ण संस्करण देखें",
    privacyContent: `यह गोपनीयता नीति बताती है कि Elysium Media FZCO, जिसका पंजीकृत पता है ID: 58510, Premises no. 58510 - 001, IFZA Business Park, DDP, DUBAI, UAE ("हम", "हमारा" या "WayBank") कैसे जानकारी एकत्र करता है, उपयोग करता है, संग्रहीत करता है और सुरक्षित रखता है जो आपके द्वारा हमारे विकेंद्रीकृत एप्लिकेशन का उपयोग करते समय एकत्र की जाती है।

WayBank का उपयोग करके, आप इस गोपनीयता नीति में वर्णित प्रथाओं से सहमत होते हैं। यदि आप इस नीति से सहमत नहीं हैं, तो कृपया हमारे एप्लिकेशन का उपयोग न करें।

1. हम कौन सी जानकारी एकत्र करते हैं
**आपके द्वारा सीधे प्रदान की गई जानकारी:**
- वॉलेट पता
- कॉन्फ़िगरेशन प्राथमिकताएँ
- एप्लिकेशन के माध्यम से किए गए लेनदेन के बारे में जानकारी

**स्वचालित रूप से एकत्र की गई जानकारी:**
- उपयोग और विश्लेषण डेटा
- डिवाइस और ब्राउज़र जानकारी
- आईपी पता
- लॉग डेटा और एप्लिकेशन गतिविधि

2. हम आपकी जानकारी का उपयोग कैसे करते हैं
हम एकत्रित जानकारी का उपयोग निम्नलिखित के लिए करते हैं:
- हमारी सेवाओं को प्रदान करना और बनाए रखना
- हमारे एप्लिकेशन को बेहतर बनाना, अनुकूलित करना और विस्तारित करना
- यह समझना कि आप हमारे एप्लिकेशन का उपयोग कैसे करते हैं
- नए उत्पादों, सेवाओं और सुविधाओं का विकास करना
- आपके साथ संवाद करना
- धोखाधड़ी या अवैध गतिविधियों को रोकना`,
    
    disclaimerTitle: "अस्वीकरण",
    disclaimerIntro: `यह अस्वीकरण ("नोटिस") Elysium Media FZCO द्वारा प्रदान किया गया है और ${APP_NAME} विकेंद्रीकृत एप्लिकेशन ("${APP_NAME}" या "एप्लिकेशन") के सभी उपयोगकर्ताओं पर लागू होता है।`,
    acceptDisclaimer: "मैं अस्वीकरण को स्वीकार करता हूं",
    viewFullDisclaimer: "पूर्ण संस्करण देखें",
    disclaimerContent: `यह अस्वीकरण ("नोटिस") Elysium Media FZCO द्वारा प्रदान किया गया है, जिसका पंजीकृत पता है ID: 58510, Premises no. 58510 - 001, IFZA Business Park, DDP, DUBAI, UAE, और WayBank विकेंद्रीकृत एप्लिकेशन ("WayBank" या "एप्लिकेशन") के सभी उपयोगकर्ताओं पर लागू होता है।

कृपया इस नोटिस को ध्यान से पढ़ें। WayBank तक पहुंचने या उसका उपयोग करने पर, आप इस नोटिस में निहित सभी बयानों, चेतावनियों और अस्वीकरणों से कानूनी रूप से बाध्य होने के लिए सहमत होते हैं।

1. जोखिम और वित्तीय सलाह नहीं
**वित्तीय सलाह नहीं:** WayBank के माध्यम से प्रदान की जाने वाली जानकारी और सेवाएं केवल सूचनात्मक और सुविधा के उद्देश्यों के लिए हैं, और वित्तीय, निवेश या कानूनी सलाह का गठन नहीं करती हैं। हम वित्तीय, निवेश या कानूनी सलाहकार नहीं हैं।

**निवेश जोखिम:** क्रिप्टोकरेंसी, टोकन और DeFi तकनीक का उपयोग करने में उच्च जोखिम शामिल है, जिसमें पूंजी की पूर्ण हानि की संभावना भी शामिल है। डिजिटल परिसंपत्तियों का मूल्य काफी उतार-चढ़ाव कर सकता है और मूल्य खो सकता है। आपको केवल वही निवेश करना चाहिए जिसे आप खोने के लिए तैयार हैं।

2. जानकारी की सटीकता
सटीक और अद्यतित जानकारी प्रदान करने के हमारे प्रयासों के बावजूद, हम एप्लिकेशन द्वारा या उसके माध्यम से प्रदान की गई जानकारी की सटीकता, पूर्णता या समय पर होने की गारंटी नहीं देते हैं। जानकारी में त्रुटियां, अशुद्धियां हो सकती हैं या पुरानी हो सकती है, और हम बिना पूर्व सूचना के किसी भी समय जानकारी में परिवर्तन कर सकते हैं।

3. वारंटी का अस्वीकरण
एप्लिकेशन और एप्लिकेशन के माध्यम से उपलब्ध सभी सेवाएं, सामग्री और कार्यक्षमता "जैसी है" और "जैसी उपलब्ध है" के आधार पर प्रदान की जाती हैं, बिना किसी प्रकार की व्यक्त या निहित वारंटी के।

हम स्पष्ट रूप से किसी भी प्रकार की सभी वारंटियों को अस्वीकार करते हैं, चाहे वे व्यक्त हों या निहित, जिनमें शामिल हैं, लेकिन इन्हीं तक सीमित नहीं, व्यापारिकता, किसी विशेष उद्देश्य के लिए उपयुक्तता, गैर-उल्लंघन, शीर्षक, बिना रुकावट के संचालन, त्रुटियों के बिना और वायरस के बिना की निहित वारंटियां।`,
  },
  
  // Chino Mandarín
  zh: {
    termsOfUseTab: "使用条款",
    privacyPolicyTab: "隐私政策",
    disclaimerTab: "免责声明",
    
    dialogTitle: "法律条款",
    dialogSubtitle: `在开始使用 ${APP_NAME} 之前，您必须接受我们的法律条款。`,
    warningMessage: `要访问 ${APP_NAME}，您必须阅读并接受所有法律文件。`,
    infoMessage: `要使用 ${APP_NAME}，您必须接受使用条款、隐私政策和免责声明。`,
    allDocsRequired: "在您接受所有文件之前，无法关闭此对话框。",
    
    nextDocument: "下一个文件",
    confirmAndContinue: "确认并继续",
    processing: "处理中...",
    acceptedDocs: "文件已接受",
    allDocsAccepted: "所有文件已接受 ✓",
    
    termsOfUseTitle: "使用条款",
    termsOfUseIntro: `这些使用条款管辖您对 Elysium Media FZCO 提供的 ${APP_NAME} 去中心化应用程序的访问和使用。`,
    acceptTermsOfUse: "我接受使用条款",
    viewFullTerms: "查看完整版本",
    termsContent: `这些使用条款（"条款"）管辖您对 Elysium Media FZCO 提供的 WayBank 去中心化应用程序（"WayBank"或"应用程序"）的访问和使用，该公司注册地址为：ID: 58510, Premises no. 58510 - 001, IFZA Business Park, DDP, DUBAI, UAE。

通过访问或使用 WayBank，您同意受这些条款的法律约束。如果您不同意这些条款的任何部分，则不应访问或使用该应用程序。

1. 定义
- "应用程序"是指 WayBank 去中心化应用程序，它为 Uniswap v4 提供流动性头寸管理服务。
- "用户"是指访问或使用应用程序的任何个人或实体。
- "服务"是指通过应用程序提供的所有功能、特性和服务。
- "内容"是指应用程序中可用的所有信息和材料，包括文本、图形、用户界面、商标、徽标、图像和代码。

2. 资格
要使用应用程序，您必须年满 18 岁并具有签订具有约束力的合同的法律能力。通过使用应用程序，您声明并保证您满足这些要求。

3. 应用程序服务
WayBank 提供用于管理 Uniswap v4 上的流动性头寸的工具，包括：
- 创建和管理流动性头寸
- 跟踪性能
- 区块链数据分析
- NFT 头寸管理

这些服务与多个区块链上的智能合约交互，并涉及固有风险。用户承担与使用应用程序和区块链交易相关的所有风险。`,
    
    privacyPolicyTitle: "隐私政策",
    privacyPolicyIntro: `本隐私政策描述了 Elysium Media FZCO 如何收集、使用、存储和保护在您使用我们的 ${APP_NAME} 去中心化应用程序时收集的信息。`,
    acceptPrivacyPolicy: "我接受隐私政策",
    viewFullPrivacy: "查看完整版本",
    privacyContent: `本隐私政策描述了 Elysium Media FZCO，注册地址为：ID: 58510, Premises no. 58510 - 001, IFZA Business Park, DDP, DUBAI, UAE（"我们"、"我们的"或"WayBank"）如何收集、使用、存储和保护在您使用我们的去中心化应用程序时收集的信息。

通过使用 WayBank，您同意本隐私政策中描述的做法。如果您不同意本政策，请不要使用我们的应用程序。

1. 我们收集的信息
**您直接提供的信息：**
- 钱包地址
- 配置偏好
- 有关通过应用程序进行的交易的信息

**自动收集的信息：**
- 使用和分析数据
- 设备和浏览器信息
- IP 地址
- 日志数据和应用程序活动

2. 我们如何使用您的信息
我们使用收集的信息来：
- 提供和维护我们的服务
- 改进、定制和扩展我们的应用程序
- 了解您如何使用我们的应用程序
- 开发新产品、服务和功能
- 与您沟通
- 防止欺诈或非法活动`,
    
    disclaimerTitle: "免责声明",
    disclaimerIntro: `本免责声明由 Elysium Media FZCO 提供，适用于 ${APP_NAME} 去中心化应用程序的所有用户。`,
    acceptDisclaimer: "我接受免责声明",
    viewFullDisclaimer: "查看完整版本",
    disclaimerContent: `本免责声明（"声明"）由 Elysium Media FZCO 提供，注册地址为：ID: 58510, Premises no. 58510 - 001, IFZA Business Park, DDP, DUBAI, UAE，适用于 WayBank 去中心化应用程序（"WayBank"或"应用程序"）的所有用户。

请仔细阅读本声明。通过访问或使用 WayBank，您同意受本声明中包含的所有陈述、警告和免责声明的法律约束。

1. 风险和非财务建议
**非财务建议：** 通过 WayBank 提供的信息和服务仅供参考和便利之用，不构成财务、投资或法律建议。我们不是财务、投资或法律顾问。

**投资风险：** 投资加密货币、代币和使用 DeFi 技术涉及高风险，包括可能完全损失资本。数字资产的价值可能会大幅波动并可能损失价值。您应该只投资您准备好损失的资金。

2. 信息准确性
尽管我们努力提供准确和最新的信息，但我们不保证在应用程序上或通过应用程序提供的信息的准确性、完整性或及时性。信息可能包含错误、不准确或过时，我们可能随时更改信息，恕不另行通知。

3. 免责声明
应用程序和通过应用程序提供的所有服务、内容和功能均按"原样"和"可用性"提供，不提供任何明示或暗示的保证。

我们明确否认任何种类的所有保证，无论是明示或暗示的，包括但不限于适销性、特定用途适用性、非侵权、所有权、不间断运行、无错误和无病毒的暗示保证。`,
  },
};

export default translations;
export const legalTermsTranslations = translations;