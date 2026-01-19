/**
 * Email Translations for WayPool
 *
 * Multi-language support for all transactional emails
 * Supported languages: en, es, de, fr, it, pt, ar, zh, hi, ru
 */

export type EmailLanguage = 'en' | 'es' | 'de' | 'fr' | 'it' | 'pt' | 'ar' | 'zh' | 'hi' | 'ru';

export const DEFAULT_LANGUAGE: EmailLanguage = 'en';

// Fee Collection Email Translations
export const feeCollectionTranslations: Record<EmailLanguage, {
  subject: string;
  subtitle: string;
  greeting: string;
  amountLabel: string;
  positionId: string;
  pool: string;
  tokenPair: string;
  dateTime: string;
  transactionId: string;
  status: string;
  statusCompleted: string;
  ctaButton: string;
  disclaimer: string;
}> = {
  en: {
    subject: 'Fee Collection Completed - WayPool',
    subtitle: 'Fee Collection Completed',
    greeting: 'Great news! Your liquidity position fees have been successfully collected and transferred to your wallet.',
    amountLabel: 'Amount Collected',
    positionId: 'Position ID',
    pool: 'Pool',
    tokenPair: 'Token Pair',
    dateTime: 'Date/Time',
    transactionId: 'Transaction ID',
    status: 'Status',
    statusCompleted: 'Completed',
    ctaButton: 'View Dashboard',
    disclaimer: 'Cryptocurrency investments involve substantial risk. Past performance is not indicative of future results. Please invest responsibly.'
  },
  es: {
    subject: 'Recolección de Fees Completada - WayPool',
    subtitle: 'Recolección de Fees Completada',
    greeting: '¡Buenas noticias! Los fees de tu posición de liquidez han sido recolectados exitosamente y transferidos a tu wallet.',
    amountLabel: 'Cantidad Recolectada',
    positionId: 'ID de Posición',
    pool: 'Pool',
    tokenPair: 'Par de Tokens',
    dateTime: 'Fecha/Hora',
    transactionId: 'ID de Transacción',
    status: 'Estado',
    statusCompleted: 'Completado',
    ctaButton: 'Ver Dashboard',
    disclaimer: 'Las inversiones en criptomonedas conllevan un riesgo sustancial. El rendimiento pasado no es indicativo de resultados futuros. Invierte responsablemente.'
  },
  de: {
    subject: 'Gebühreneinzug Abgeschlossen - WayPool',
    subtitle: 'Gebühreneinzug Abgeschlossen',
    greeting: 'Gute Nachrichten! Die Gebühren Ihrer Liquiditätsposition wurden erfolgreich eingezogen und auf Ihre Wallet übertragen.',
    amountLabel: 'Eingezogener Betrag',
    positionId: 'Positions-ID',
    pool: 'Pool',
    tokenPair: 'Token-Paar',
    dateTime: 'Datum/Uhrzeit',
    transactionId: 'Transaktions-ID',
    status: 'Status',
    statusCompleted: 'Abgeschlossen',
    ctaButton: 'Dashboard Anzeigen',
    disclaimer: 'Kryptowährungsinvestitionen bergen erhebliche Risiken. Vergangene Ergebnisse sind kein Indikator für zukünftige Resultate. Investieren Sie verantwortungsvoll.'
  },
  fr: {
    subject: 'Collecte de Frais Terminée - WayPool',
    subtitle: 'Collecte de Frais Terminée',
    greeting: 'Bonne nouvelle ! Les frais de votre position de liquidité ont été collectés avec succès et transférés vers votre portefeuille.',
    amountLabel: 'Montant Collecté',
    positionId: 'ID de Position',
    pool: 'Pool',
    tokenPair: 'Paire de Tokens',
    dateTime: 'Date/Heure',
    transactionId: 'ID de Transaction',
    status: 'Statut',
    statusCompleted: 'Terminé',
    ctaButton: 'Voir le Tableau de Bord',
    disclaimer: 'Les investissements en cryptomonnaies comportent des risques importants. Les performances passées ne préjugent pas des résultats futurs. Investissez de manière responsable.'
  },
  it: {
    subject: 'Raccolta Fee Completata - WayPool',
    subtitle: 'Raccolta Fee Completata',
    greeting: 'Ottime notizie! Le fee della tua posizione di liquidità sono state raccolte con successo e trasferite al tuo wallet.',
    amountLabel: 'Importo Raccolto',
    positionId: 'ID Posizione',
    pool: 'Pool',
    tokenPair: 'Coppia di Token',
    dateTime: 'Data/Ora',
    transactionId: 'ID Transazione',
    status: 'Stato',
    statusCompleted: 'Completato',
    ctaButton: 'Visualizza Dashboard',
    disclaimer: 'Gli investimenti in criptovalute comportano rischi sostanziali. I rendimenti passati non sono indicativi dei risultati futuri. Investi responsabilmente.'
  },
  pt: {
    subject: 'Coleta de Taxas Concluída - WayPool',
    subtitle: 'Coleta de Taxas Concluída',
    greeting: 'Ótimas notícias! As taxas da sua posição de liquidez foram coletadas com sucesso e transferidas para sua carteira.',
    amountLabel: 'Valor Coletado',
    positionId: 'ID da Posição',
    pool: 'Pool',
    tokenPair: 'Par de Tokens',
    dateTime: 'Data/Hora',
    transactionId: 'ID da Transação',
    status: 'Status',
    statusCompleted: 'Concluído',
    ctaButton: 'Ver Painel',
    disclaimer: 'Investimentos em criptomoedas envolvem riscos substanciais. O desempenho passado não é indicativo de resultados futuros. Invista com responsabilidade.'
  },
  ar: {
    subject: 'اكتمل تحصيل الرسوم - WayPool',
    subtitle: 'اكتمل تحصيل الرسوم',
    greeting: 'أخبار رائعة! تم تحصيل رسوم مركز السيولة الخاص بك بنجاح وتحويلها إلى محفظتك.',
    amountLabel: 'المبلغ المحصل',
    positionId: 'رقم المركز',
    pool: 'المجمع',
    tokenPair: 'زوج الرموز',
    dateTime: 'التاريخ/الوقت',
    transactionId: 'رقم المعاملة',
    status: 'الحالة',
    statusCompleted: 'مكتمل',
    ctaButton: 'عرض لوحة التحكم',
    disclaimer: 'تنطوي استثمارات العملات المشفرة على مخاطر كبيرة. الأداء السابق لا يدل على النتائج المستقبلية. استثمر بمسؤولية.'
  },
  zh: {
    subject: '费用收取完成 - WayPool',
    subtitle: '费用收取完成',
    greeting: '好消息！您的流动性头寸费用已成功收取并转入您的钱包。',
    amountLabel: '收取金额',
    positionId: '头寸ID',
    pool: '池',
    tokenPair: '代币对',
    dateTime: '日期/时间',
    transactionId: '交易ID',
    status: '状态',
    statusCompleted: '已完成',
    ctaButton: '查看仪表板',
    disclaimer: '加密货币投资涉及重大风险。过去的表现不代表未来的结果。请负责任地投资。'
  },
  hi: {
    subject: 'शुल्क संग्रह पूर्ण - WayPool',
    subtitle: 'शुल्क संग्रह पूर्ण',
    greeting: 'बढ़िया खबर! आपकी तरलता स्थिति शुल्क सफलतापूर्वक एकत्र किए गए और आपके वॉलेट में स्थानांतरित कर दिए गए।',
    amountLabel: 'एकत्रित राशि',
    positionId: 'स्थिति आईडी',
    pool: 'पूल',
    tokenPair: 'टोकन जोड़ी',
    dateTime: 'तारीख/समय',
    transactionId: 'लेनदेन आईडी',
    status: 'स्थिति',
    statusCompleted: 'पूर्ण',
    ctaButton: 'डैशबोर्ड देखें',
    disclaimer: 'क्रिप्टोकरेंसी निवेश में पर्याप्त जोखिम शामिल है। पिछला प्रदर्शन भविष्य के परिणामों का संकेत नहीं है। जिम्मेदारी से निवेश करें।'
  },
  ru: {
    subject: 'Сбор комиссий завершен - WayPool',
    subtitle: 'Сбор комиссий завершен',
    greeting: 'Отличные новости! Комиссии с вашей позиции ликвидности успешно собраны и переведены на ваш кошелек.',
    amountLabel: 'Собранная сумма',
    positionId: 'ID позиции',
    pool: 'Пул',
    tokenPair: 'Пара токенов',
    dateTime: 'Дата/Время',
    transactionId: 'ID транзакции',
    status: 'Статус',
    statusCompleted: 'Завершено',
    ctaButton: 'Открыть панель',
    disclaimer: 'Инвестиции в криптовалюту сопряжены со значительным риском. Прошлые результаты не гарантируют будущих показателей. Инвестируйте ответственно.'
  }
};

// New Position Email Translations
export const newPositionTranslations: Record<EmailLanguage, {
  subject: string;
  subtitle: string;
  greeting: string;
  amountLabel: string;
  positionId: string;
  tokenPair: string;
  period: string;
  estimatedApr: string;
  ilRisk: string;
  status: string;
  statusActive: string;
  created: string;
  ctaButton: string;
  disclaimer: string;
}> = {
  en: {
    subject: 'New Liquidity Position Created - WayPool',
    subtitle: 'New Position Created Successfully',
    greeting: 'Congratulations! Your liquidity position has been successfully created and is now active.',
    amountLabel: 'Amount Invested',
    positionId: 'Position ID',
    tokenPair: 'Token Pair',
    period: 'Period',
    estimatedApr: 'Estimated APR',
    ilRisk: 'IL Risk',
    status: 'Status',
    statusActive: 'Active',
    created: 'Created',
    ctaButton: 'View Your Position',
    disclaimer: 'Cryptocurrency investments involve substantial risk of loss. Past performance is not indicative of future results. Impermanent loss may affect your position value. Please invest responsibly and only with funds you can afford to lose.'
  },
  es: {
    subject: 'Nueva Posición de Liquidez Creada - WayPool',
    subtitle: 'Nueva Posición Creada Exitosamente',
    greeting: '¡Felicitaciones! Tu posición de liquidez ha sido creada exitosamente y está activa.',
    amountLabel: 'Cantidad Invertida',
    positionId: 'ID de Posición',
    tokenPair: 'Par de Tokens',
    period: 'Período',
    estimatedApr: 'APR Estimado',
    ilRisk: 'Riesgo IL',
    status: 'Estado',
    statusActive: 'Activa',
    created: 'Creada',
    ctaButton: 'Ver Tu Posición',
    disclaimer: 'Las inversiones en criptomonedas conllevan un riesgo sustancial de pérdida. El rendimiento pasado no es indicativo de resultados futuros. La pérdida impermanente puede afectar el valor de tu posición. Invierte responsablemente y solo con fondos que puedas permitirte perder.'
  },
  de: {
    subject: 'Neue Liquiditätsposition Erstellt - WayPool',
    subtitle: 'Neue Position Erfolgreich Erstellt',
    greeting: 'Herzlichen Glückwunsch! Ihre Liquiditätsposition wurde erfolgreich erstellt und ist jetzt aktiv.',
    amountLabel: 'Investierter Betrag',
    positionId: 'Positions-ID',
    tokenPair: 'Token-Paar',
    period: 'Zeitraum',
    estimatedApr: 'Geschätzter APR',
    ilRisk: 'IL-Risiko',
    status: 'Status',
    statusActive: 'Aktiv',
    created: 'Erstellt',
    ctaButton: 'Position Anzeigen',
    disclaimer: 'Kryptowährungsinvestitionen bergen ein erhebliches Verlustrisiko. Vergangene Ergebnisse sind kein Indikator für zukünftige Resultate. Impermanenter Verlust kann den Wert Ihrer Position beeinflussen. Investieren Sie verantwortungsvoll.'
  },
  fr: {
    subject: 'Nouvelle Position de Liquidité Créée - WayPool',
    subtitle: 'Nouvelle Position Créée avec Succès',
    greeting: 'Félicitations ! Votre position de liquidité a été créée avec succès et est maintenant active.',
    amountLabel: 'Montant Investi',
    positionId: 'ID de Position',
    tokenPair: 'Paire de Tokens',
    period: 'Période',
    estimatedApr: 'APR Estimé',
    ilRisk: 'Risque IL',
    status: 'Statut',
    statusActive: 'Active',
    created: 'Créée',
    ctaButton: 'Voir Votre Position',
    disclaimer: 'Les investissements en cryptomonnaies comportent un risque de perte important. Les performances passées ne préjugent pas des résultats futurs. La perte impermanente peut affecter la valeur de votre position. Investissez de manière responsable.'
  },
  it: {
    subject: 'Nuova Posizione di Liquidità Creata - WayPool',
    subtitle: 'Nuova Posizione Creata con Successo',
    greeting: 'Congratulazioni! La tua posizione di liquidità è stata creata con successo ed è ora attiva.',
    amountLabel: 'Importo Investito',
    positionId: 'ID Posizione',
    tokenPair: 'Coppia di Token',
    period: 'Periodo',
    estimatedApr: 'APR Stimato',
    ilRisk: 'Rischio IL',
    status: 'Stato',
    statusActive: 'Attiva',
    created: 'Creata',
    ctaButton: 'Visualizza Posizione',
    disclaimer: 'Gli investimenti in criptovalute comportano un rischio sostanziale di perdita. I rendimenti passati non sono indicativi dei risultati futuri. La perdita impermanente può influire sul valore della tua posizione. Investi responsabilmente.'
  },
  pt: {
    subject: 'Nova Posição de Liquidez Criada - WayPool',
    subtitle: 'Nova Posição Criada com Sucesso',
    greeting: 'Parabéns! Sua posição de liquidez foi criada com sucesso e está ativa.',
    amountLabel: 'Valor Investido',
    positionId: 'ID da Posição',
    tokenPair: 'Par de Tokens',
    period: 'Período',
    estimatedApr: 'APR Estimado',
    ilRisk: 'Risco IL',
    status: 'Status',
    statusActive: 'Ativa',
    created: 'Criada',
    ctaButton: 'Ver Sua Posição',
    disclaimer: 'Investimentos em criptomoedas envolvem risco substancial de perda. O desempenho passado não é indicativo de resultados futuros. A perda impermanente pode afetar o valor da sua posição. Invista com responsabilidade.'
  },
  ar: {
    subject: 'تم إنشاء مركز سيولة جديد - WayPool',
    subtitle: 'تم إنشاء المركز بنجاح',
    greeting: 'تهانينا! تم إنشاء مركز السيولة الخاص بك بنجاح وهو نشط الآن.',
    amountLabel: 'المبلغ المستثمر',
    positionId: 'رقم المركز',
    tokenPair: 'زوج الرموز',
    period: 'الفترة',
    estimatedApr: 'العائد السنوي المتوقع',
    ilRisk: 'مخاطر الخسارة غير الدائمة',
    status: 'الحالة',
    statusActive: 'نشط',
    created: 'تاريخ الإنشاء',
    ctaButton: 'عرض مركزك',
    disclaimer: 'تنطوي استثمارات العملات المشفرة على مخاطر كبيرة للخسارة. الأداء السابق لا يدل على النتائج المستقبلية. قد تؤثر الخسارة غير الدائمة على قيمة مركزك. استثمر بمسؤولية.'
  },
  zh: {
    subject: '新流动性头寸已创建 - WayPool',
    subtitle: '新头寸创建成功',
    greeting: '恭喜！您的流动性头寸已成功创建并已激活。',
    amountLabel: '投资金额',
    positionId: '头寸ID',
    tokenPair: '代币对',
    period: '期限',
    estimatedApr: '预估年化收益',
    ilRisk: '无常损失风险',
    status: '状态',
    statusActive: '活跃',
    created: '创建时间',
    ctaButton: '查看您的头寸',
    disclaimer: '加密货币投资涉及重大损失风险。过去的表现不代表未来的结果。无常损失可能影响您头寸的价值。请负责任地投资。'
  },
  hi: {
    subject: 'नई तरलता स्थिति बनाई गई - WayPool',
    subtitle: 'नई स्थिति सफलतापूर्वक बनाई गई',
    greeting: 'बधाई हो! आपकी तरलता स्थिति सफलतापूर्वक बनाई गई है और अब सक्रिय है।',
    amountLabel: 'निवेशित राशि',
    positionId: 'स्थिति आईडी',
    tokenPair: 'टोकन जोड़ी',
    period: 'अवधि',
    estimatedApr: 'अनुमानित APR',
    ilRisk: 'IL जोखिम',
    status: 'स्थिति',
    statusActive: 'सक्रिय',
    created: 'बनाया गया',
    ctaButton: 'अपनी स्थिति देखें',
    disclaimer: 'क्रिप्टोकरेंसी निवेश में पर्याप्त नुकसान का जोखिम शामिल है। पिछला प्रदर्शन भविष्य के परिणामों का संकेत नहीं है। अस्थायी नुकसान आपकी स्थिति के मूल्य को प्रभावित कर सकता है। जिम्मेदारी से निवेश करें।'
  },
  ru: {
    subject: 'Новая позиция ликвидности создана - WayPool',
    subtitle: 'Новая позиция успешно создана',
    greeting: 'Поздравляем! Ваша позиция ликвидности успешно создана и теперь активна.',
    amountLabel: 'Инвестированная сумма',
    positionId: 'ID позиции',
    tokenPair: 'Пара токенов',
    period: 'Период',
    estimatedApr: 'Ожидаемый APR',
    ilRisk: 'Риск IL',
    status: 'Статус',
    statusActive: 'Активна',
    created: 'Создана',
    ctaButton: 'Посмотреть позицию',
    disclaimer: 'Инвестиции в криптовалюту сопряжены со значительным риском потерь. Прошлые результаты не гарантируют будущих показателей. Непостоянные потери могут повлиять на стоимость вашей позиции. Инвестируйте ответственно.'
  }
};

// Password Recovery Email Translations
export const passwordRecoveryTranslations: Record<EmailLanguage, {
  subject: string;
  subtitle: string;
  greeting: string;
  intro: string;
  codeLabel: string;
  important: string;
  expiresIn: string;
  step1: string;
  step2: string;
  step3: string;
  step4: string;
  securityTip: string;
  securityText: string;
  notRequested: string;
}> = {
  en: {
    subject: 'Password Recovery Request - WayPool',
    subtitle: 'Security Center',
    greeting: 'Hello',
    intro: 'We have received a request to reset the password for your WayPool account. Use the code below to create a new secure password.',
    codeLabel: 'Recovery Code',
    important: 'Important',
    expiresIn: 'This code will expire in 24 hours for security reasons.',
    step1: 'Go to the WayPool main page',
    step2: 'Click "Enter recovery code" button',
    step3: 'Enter the recovery code in the form',
    step4: 'Create a new secure password for your account',
    securityTip: 'Security Tips',
    securityText: 'Create a strong password with at least 8 characters, including uppercase, lowercase, numbers, and symbols.',
    notRequested: 'If you did not request this password reset, please ignore this message or contact our support team.'
  },
  es: {
    subject: 'Solicitud de Recuperación de Contraseña - WayPool',
    subtitle: 'Centro de Seguridad',
    greeting: 'Hola',
    intro: 'Hemos recibido una solicitud para restablecer la contraseña de tu cuenta de WayPool. Usa el código de abajo para crear una nueva contraseña segura.',
    codeLabel: 'Código de Recuperación',
    important: 'Importante',
    expiresIn: 'Este código expirará en 24 horas por razones de seguridad.',
    step1: 'Ve a la página principal de WayPool',
    step2: 'Haz clic en el botón "Ingresar código de recuperación"',
    step3: 'Ingresa el código de recuperación en el formulario',
    step4: 'Crea una nueva contraseña segura para tu cuenta',
    securityTip: 'Consejos de Seguridad',
    securityText: 'Crea una contraseña segura con al menos 8 caracteres, incluyendo mayúsculas, minúsculas, números y símbolos.',
    notRequested: 'Si no solicitaste este restablecimiento de contraseña, ignora este mensaje o contacta a nuestro equipo de soporte.'
  },
  de: {
    subject: 'Anfrage zur Passwortwiederherstellung - WayPool',
    subtitle: 'Sicherheitscenter',
    greeting: 'Hallo',
    intro: 'Wir haben eine Anfrage erhalten, das Passwort für Ihr WayPool-Konto zurückzusetzen. Verwenden Sie den folgenden Code, um ein neues sicheres Passwort zu erstellen.',
    codeLabel: 'Wiederherstellungscode',
    important: 'Wichtig',
    expiresIn: 'Dieser Code läuft aus Sicherheitsgründen in 24 Stunden ab.',
    step1: 'Gehen Sie zur WayPool-Hauptseite',
    step2: 'Klicken Sie auf "Wiederherstellungscode eingeben"',
    step3: 'Geben Sie den Wiederherstellungscode im Formular ein',
    step4: 'Erstellen Sie ein neues sicheres Passwort für Ihr Konto',
    securityTip: 'Sicherheitstipps',
    securityText: 'Erstellen Sie ein starkes Passwort mit mindestens 8 Zeichen, einschließlich Groß- und Kleinbuchstaben, Zahlen und Symbolen.',
    notRequested: 'Wenn Sie diese Passwortwiederherstellung nicht angefordert haben, ignorieren Sie diese Nachricht oder kontaktieren Sie unser Support-Team.'
  },
  fr: {
    subject: 'Demande de Récupération de Mot de Passe - WayPool',
    subtitle: 'Centre de Sécurité',
    greeting: 'Bonjour',
    intro: 'Nous avons reçu une demande de réinitialisation du mot de passe de votre compte WayPool. Utilisez le code ci-dessous pour créer un nouveau mot de passe sécurisé.',
    codeLabel: 'Code de Récupération',
    important: 'Important',
    expiresIn: 'Ce code expirera dans 24 heures pour des raisons de sécurité.',
    step1: 'Allez sur la page principale de WayPool',
    step2: 'Cliquez sur "Entrer le code de récupération"',
    step3: 'Entrez le code de récupération dans le formulaire',
    step4: 'Créez un nouveau mot de passe sécurisé pour votre compte',
    securityTip: 'Conseils de Sécurité',
    securityText: 'Créez un mot de passe fort avec au moins 8 caractères, incluant majuscules, minuscules, chiffres et symboles.',
    notRequested: 'Si vous n\'avez pas demandé cette réinitialisation de mot de passe, veuillez ignorer ce message ou contacter notre équipe support.'
  },
  it: {
    subject: 'Richiesta di Recupero Password - WayPool',
    subtitle: 'Centro Sicurezza',
    greeting: 'Ciao',
    intro: 'Abbiamo ricevuto una richiesta per reimpostare la password del tuo account WayPool. Usa il codice qui sotto per creare una nuova password sicura.',
    codeLabel: 'Codice di Recupero',
    important: 'Importante',
    expiresIn: 'Questo codice scadrà tra 24 ore per motivi di sicurezza.',
    step1: 'Vai alla pagina principale di WayPool',
    step2: 'Clicca su "Inserisci codice di recupero"',
    step3: 'Inserisci il codice di recupero nel modulo',
    step4: 'Crea una nuova password sicura per il tuo account',
    securityTip: 'Suggerimenti di Sicurezza',
    securityText: 'Crea una password forte con almeno 8 caratteri, includendo maiuscole, minuscole, numeri e simboli.',
    notRequested: 'Se non hai richiesto questo reset della password, ignora questo messaggio o contatta il nostro team di supporto.'
  },
  pt: {
    subject: 'Solicitação de Recuperação de Senha - WayPool',
    subtitle: 'Centro de Segurança',
    greeting: 'Olá',
    intro: 'Recebemos uma solicitação para redefinir a senha da sua conta WayPool. Use o código abaixo para criar uma nova senha segura.',
    codeLabel: 'Código de Recuperação',
    important: 'Importante',
    expiresIn: 'Este código expirará em 24 horas por razões de segurança.',
    step1: 'Vá para a página principal do WayPool',
    step2: 'Clique em "Inserir código de recuperação"',
    step3: 'Insira o código de recuperação no formulário',
    step4: 'Crie uma nova senha segura para sua conta',
    securityTip: 'Dicas de Segurança',
    securityText: 'Crie uma senha forte com pelo menos 8 caracteres, incluindo maiúsculas, minúsculas, números e símbolos.',
    notRequested: 'Se você não solicitou esta redefinição de senha, ignore esta mensagem ou entre em contato com nossa equipe de suporte.'
  },
  ar: {
    subject: 'طلب استعادة كلمة المرور - WayPool',
    subtitle: 'مركز الأمان',
    greeting: 'مرحباً',
    intro: 'لقد تلقينا طلبًا لإعادة تعيين كلمة مرور حساب WayPool الخاص بك. استخدم الرمز أدناه لإنشاء كلمة مرور آمنة جديدة.',
    codeLabel: 'رمز الاستعادة',
    important: 'مهم',
    expiresIn: 'سينتهي صلاحية هذا الرمز خلال 24 ساعة لأسباب أمنية.',
    step1: 'انتقل إلى صفحة WayPool الرئيسية',
    step2: 'انقر على زر "إدخال رمز الاستعادة"',
    step3: 'أدخل رمز الاستعادة في النموذج',
    step4: 'أنشئ كلمة مرور آمنة جديدة لحسابك',
    securityTip: 'نصائح أمنية',
    securityText: 'أنشئ كلمة مرور قوية تتكون من 8 أحرف على الأقل، تشمل أحرفًا كبيرة وصغيرة وأرقامًا ورموزًا.',
    notRequested: 'إذا لم تطلب إعادة تعيين كلمة المرور هذه، يرجى تجاهل هذه الرسالة أو الاتصال بفريق الدعم لدينا.'
  },
  zh: {
    subject: '密码恢复请求 - WayPool',
    subtitle: '安全中心',
    greeting: '您好',
    intro: '我们收到了重置您WayPool账户密码的请求。请使用下面的代码创建新的安全密码。',
    codeLabel: '恢复代码',
    important: '重要',
    expiresIn: '出于安全原因，此代码将在24小时后过期。',
    step1: '前往WayPool主页',
    step2: '点击"输入恢复代码"按钮',
    step3: '在表单中输入恢复代码',
    step4: '为您的账户创建新的安全密码',
    securityTip: '安全提示',
    securityText: '创建一个至少8个字符的强密码，包括大写字母、小写字母、数字和符号。',
    notRequested: '如果您没有请求此密码重置，请忽略此消息或联系我们的支持团队。'
  },
  hi: {
    subject: 'पासवर्ड रिकवरी अनुरोध - WayPool',
    subtitle: 'सुरक्षा केंद्र',
    greeting: 'नमस्ते',
    intro: 'हमें आपके WayPool खाते का पासवर्ड रीसेट करने का अनुरोध प्राप्त हुआ है। एक नया सुरक्षित पासवर्ड बनाने के लिए नीचे दिए गए कोड का उपयोग करें।',
    codeLabel: 'रिकवरी कोड',
    important: 'महत्वपूर्ण',
    expiresIn: 'सुरक्षा कारणों से यह कोड 24 घंटे में समाप्त हो जाएगा।',
    step1: 'WayPool मुख्य पृष्ठ पर जाएं',
    step2: '"रिकवरी कोड दर्ज करें" बटन पर क्लिक करें',
    step3: 'फॉर्म में रिकवरी कोड दर्ज करें',
    step4: 'अपने खाते के लिए एक नया सुरक्षित पासवर्ड बनाएं',
    securityTip: 'सुरक्षा सुझाव',
    securityText: 'कम से कम 8 अक्षरों का एक मजबूत पासवर्ड बनाएं, जिसमें बड़े अक्षर, छोटे अक्षर, संख्याएं और प्रतीक शामिल हों।',
    notRequested: 'यदि आपने इस पासवर्ड रीसेट का अनुरोध नहीं किया है, तो कृपया इस संदेश को अनदेखा करें या हमारी सहायता टीम से संपर्क करें।'
  },
  ru: {
    subject: 'Запрос на восстановление пароля - WayPool',
    subtitle: 'Центр безопасности',
    greeting: 'Здравствуйте',
    intro: 'Мы получили запрос на сброс пароля вашей учетной записи WayPool. Используйте код ниже для создания нового безопасного пароля.',
    codeLabel: 'Код восстановления',
    important: 'Важно',
    expiresIn: 'Срок действия этого кода истекает через 24 часа в целях безопасности.',
    step1: 'Перейдите на главную страницу WayPool',
    step2: 'Нажмите кнопку "Ввести код восстановления"',
    step3: 'Введите код восстановления в форму',
    step4: 'Создайте новый безопасный пароль для вашей учетной записи',
    securityTip: 'Советы по безопасности',
    securityText: 'Создайте надежный пароль длиной не менее 8 символов, включая заглавные и строчные буквы, цифры и символы.',
    notRequested: 'Если вы не запрашивали сброс пароля, пожалуйста, проигнорируйте это сообщение или свяжитесь с нашей службой поддержки.'
  }
};

// Helper function to get language or fallback to default
export function getEmailLanguage(lang: string | undefined | null): EmailLanguage {
  if (!lang) return DEFAULT_LANGUAGE;

  const normalizedLang = lang.toLowerCase().substring(0, 2);

  const validLanguages: EmailLanguage[] = ['en', 'es', 'de', 'fr', 'it', 'pt', 'ar', 'zh', 'hi', 'ru'];

  if (validLanguages.includes(normalizedLang as EmailLanguage)) {
    return normalizedLang as EmailLanguage;
  }

  return DEFAULT_LANGUAGE;
}

// Check if language is RTL
export function isRTL(lang: EmailLanguage): boolean {
  return lang === 'ar';
}
