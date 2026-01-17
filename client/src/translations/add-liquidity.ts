// Traducciones para la página de añadir liquidez
// Translations for the add liquidity page

export interface AddLiquidityTranslations {
  // Header
  title: string;
  
  // Form and inputs
  addLiquidity: string;
  addLiquidityWithUsdc: string;
  enterUsdcAmount: string;
  amountUsdcLabel: string;
  amountPlaceholder: string;
  invalidAmount: string;
  pleaseConnect: string;
  walletNotConnected: string;
  
  // Slider and options
  rangeWidthLabel: string;
  rangeWidthDescriptionNarrow: string;
  rangeWidthDescriptionWide: string;
  rangeWidthDescription?: string; // For backward compatibility
  timeframeLabel: string;
  timeframe30Days: string;
  timeframe90Days: string;
  timeframe365Days: string;
  
  // Risk and terms
  riskNotice: string;
  riskDisclaimer: string;
  termsAndConditions: string;
  termsNotAccepted: string;
  iUnderstandRisks: string;
  iAcceptTerms: string;
  
  // Payment methods
  choosePaymentMethod: string;
  processingRequest: string;
  requestSent: string;
  selectPaymentMethod: string;
  payWithWallet: string;
  payWithCreditCard: string;
  payWithBankTransfer: string;
  
  // Payment dialogs
  walletPayment: string;
  creditCardPayment: string;
  bankTransfer: string;
  bankTransferInstructions: string;
  accountDetails: string;
  bankName: string;
  accountNumber: string;
  routingNumber: string;
  swift: string;
  reference: string;
  includeReference: string;
  address: string;
  amount: string;
  
  // Bank transfer specific
  ibanCopied: string;
  bicCopied: string;
  referenceCopied: string;
  important: string;
  walletReferenceWarning: string;
  transferMade: string;
  connectWallet: string;
  
  // Summary
  operationSummary: string;
  impermanentLossRisk: string;
  high: string;
  medium: string;
  low: string;
  expectedApr: string;
  potentialRewards: string;
  
  // Buttons
  connect: string;
  disconnect: string;
  continue: string;
  addLiquidityButton: string;
  copyToClipboard: string;
  copied: string;
  cancel: string;
  back: string;
  iHaveTransferred: string;
  pay: string;
}

export const addLiquidityTranslations: Record<string, AddLiquidityTranslations> = {
  es: {
    // Header
    title: "Añadir Liquidez",
    
    // Form and inputs
    addLiquidity: "Añadir Liquidez",
    addLiquidityWithUsdc: "Añadir Liquidez con USDC",
    enterUsdcAmount: "Ingresa la cantidad de USDC que deseas invertir",
    amountUsdcLabel: "Cantidad de USDC",
    amountPlaceholder: "Introduce la cantidad",
    invalidAmount: "Monto inválido",
    pleaseConnect: "Por favor conecta tu wallet para continuar.",
    walletNotConnected: "Wallet no conectada",
    
    // Slider and options
    rangeWidthLabel: "Ancho de Rango",
    rangeWidthDescriptionNarrow: "Estrecho (APR más alto, rebalanceo frecuente)",
    rangeWidthDescriptionWide: "Amplio (APR más bajo, menos rebalanceo)",
    timeframeLabel: "Período de Tiempo",
    timeframe30Days: "30 días",
    timeframe90Days: "90 días",
    timeframe365Days: "365 días",
    
    // Risk and terms
    riskNotice: "Aviso de Riesgo",
    riskDisclaimer: "Entiendo que añadir liquidez conlleva riesgos incluyendo pérdida impermanente y otros riesgos de mercado.",
    termsAndConditions: "Términos y Condiciones",
    termsNotAccepted: "Términos no aceptados",
    iUnderstandRisks: "Entiendo los riesgos implicados",
    iAcceptTerms: "Acepto los términos y condiciones",
    
    // Payment methods
    choosePaymentMethod: "Elige cómo quieres pagar",
    processingRequest: "Procesando solicitud",
    requestSent: "Solicitud enviada",
    selectPaymentMethod: "Seleccionar método de pago",
    payWithWallet: "Pagar con Wallet",
    payWithCreditCard: "Pagar con Tarjeta",
    payWithBankTransfer: "Transferencia Bancaria",
    
    // Payment dialogs
    walletPayment: "Pago con Wallet",
    creditCardPayment: "Pago con Tarjeta",
    bankTransfer: "Transferencia Bancaria",
    bankTransferInstructions: "Para completar tu inversión mediante transferencia bancaria, utiliza los siguientes datos:",
    accountDetails: "Datos de la cuenta",
    bankName: "Nombre del banco",
    accountNumber: "Número de cuenta",
    routingNumber: "Número de ruta",
    swift: "Código SWIFT",
    reference: "Referencia",
    includeReference: "Incluye la referencia exacta en tu transferencia para que podamos identificar tu pago.",
    address: "Dirección",
    amount: "Cantidad",
    
    // Bank transfer specific
    ibanCopied: "IBAN copiado",
    bicCopied: "BIC copiado",
    referenceCopied: "Referencia copiada",
    important: "Importante",
    walletReferenceWarning: "Debes incluir los primeros 8 dígitos de tu dirección de wallet como referencia para identificar tu pago.",
    transferMade: "He realizado la transferencia",
    connectWallet: "Conectar wallet",
    
    // Summary
    operationSummary: "Resumen de Operación",
    impermanentLossRisk: "Riesgo de Pérdida Impermanente",
    high: "Alto",
    medium: "Medio",
    low: "Bajo",
    expectedApr: "APR Esperado",
    potentialRewards: "Recompensas Potenciales",
    
    // Buttons
    connect: "Conectar",
    disconnect: "Desconectar",
    continue: "Continuar",
    addLiquidityButton: "Añadir Liquidez",
    copyToClipboard: "Copiar al portapapeles",
    copied: "Copiado",
    cancel: "Cancelar",
    back: "Volver",
    iHaveTransferred: "He realizado la transferencia",
    pay: "Pagar"
  },
  en: {
    // Header
    title: "Add Liquidity",
    
    // Form and inputs
    addLiquidity: "Add Liquidity",
    addLiquidityWithUsdc: "Add Liquidity with USDC",
    enterUsdcAmount: "Enter the amount of USDC you want to invest",
    amountUsdcLabel: "USDC Amount",
    amountPlaceholder: "Enter amount",
    invalidAmount: "Invalid amount",
    pleaseConnect: "Please connect your wallet to continue.",
    walletNotConnected: "Wallet not connected",
    
    // Slider and options
    rangeWidthLabel: "Range Width",
    rangeWidthDescriptionNarrow: "Narrow (Higher APR, frequent rebalancing)",
    rangeWidthDescriptionWide: "Wide (Lower APR, less rebalancing)",
    timeframeLabel: "Timeframe",
    timeframe30Days: "30 days",
    timeframe90Days: "90 days",
    timeframe365Days: "365 days",
    
    // Risk and terms
    riskNotice: "Risk Notice",
    riskDisclaimer: "I understand that adding liquidity carries risks including impermanent loss and other market risks.",
    termsAndConditions: "Terms and Conditions",
    termsNotAccepted: "Terms not accepted",
    iUnderstandRisks: "I understand the risks involved",
    iAcceptTerms: "I accept the terms and conditions",
    
    // Payment methods
    choosePaymentMethod: "Choose how you want to pay",
    processingRequest: "Processing request",
    requestSent: "Request sent",
    selectPaymentMethod: "Select payment method",
    payWithWallet: "Pay with Wallet",
    payWithCreditCard: "Pay with Credit Card",
    payWithBankTransfer: "Bank Transfer",
    
    // Payment dialogs
    walletPayment: "Wallet Payment",
    creditCardPayment: "Credit Card Payment",
    bankTransfer: "Bank Transfer",
    bankTransferInstructions: "To complete your investment via bank transfer, use the following details:",
    accountDetails: "Account Details",
    bankName: "Bank name",
    accountNumber: "Account number",
    routingNumber: "Routing number",
    swift: "SWIFT code",
    reference: "Reference",
    includeReference: "Include the exact reference in your transfer so we can identify your payment.",
    address: "Address",
    amount: "Amount",
    
    // Bank transfer specific
    ibanCopied: "IBAN copied",
    bicCopied: "BIC copied",
    referenceCopied: "Reference copied",
    important: "Important",
    walletReferenceWarning: "You must include the first 8 digits of your wallet address as a reference to identify your payment.",
    transferMade: "I have made the transfer",
    connectWallet: "Connect wallet",
    
    // Summary
    operationSummary: "Operation Summary",
    impermanentLossRisk: "Impermanent Loss Risk",
    high: "High",
    medium: "Medium",
    low: "Low",
    expectedApr: "Expected APR",
    potentialRewards: "Potential Rewards",
    
    // Buttons
    connect: "Connect",
    disconnect: "Disconnect",
    continue: "Continue",
    addLiquidityButton: "Add Liquidity",
    copyToClipboard: "Copy to clipboard",
    copied: "Copied",
    cancel: "Cancel",
    back: "Back",
    iHaveTransferred: "I have made the transfer",
    pay: "Pay"
  },
  it: {
    // Header
    title: "Aggiungi Liquidità",
    
    // Form and inputs
    addLiquidity: "Aggiungi Liquidità",
    addLiquidityWithUsdc: "Aggiungi Liquidità con USDC",
    enterUsdcAmount: "Inserisci la quantità di USDC che vuoi investire",
    amountUsdcLabel: "Quantità USDC",
    amountPlaceholder: "Inserisci importo",
    invalidAmount: "Importo non valido",
    pleaseConnect: "Per favore connetti il tuo portafoglio per continuare.",
    walletNotConnected: "Portafoglio non connesso",
    
    // Slider and options
    rangeWidthLabel: "Ampiezza del Range",
    rangeWidthDescriptionNarrow: "Stretto (APR più alto, riequilibrio frequente)",
    rangeWidthDescriptionWide: "Ampio (APR più basso, meno riequilibrio)",
    timeframeLabel: "Periodo di Tempo",
    timeframe30Days: "30 giorni",
    timeframe90Days: "90 giorni",
    timeframe365Days: "365 giorni",
    
    // Risk and terms
    riskNotice: "Avviso di Rischio",
    riskDisclaimer: "Capisco che aggiungere liquidità comporta rischi inclusa la perdita impermanente e altri rischi di mercato.",
    termsAndConditions: "Termini e Condizioni",
    termsNotAccepted: "Termini non accettati",
    iUnderstandRisks: "Capisco i rischi coinvolti",
    iAcceptTerms: "Accetto i termini e condizioni",
    
    // Payment methods
    choosePaymentMethod: "Scegli come vuoi pagare",
    processingRequest: "Elaborazione richiesta",
    requestSent: "Richiesta inviata",
    selectPaymentMethod: "Seleziona metodo di pagamento",
    payWithWallet: "Paga con Portafoglio",
    payWithCreditCard: "Paga con Carta di Credito",
    payWithBankTransfer: "Bonifico Bancario",
    
    // Payment dialogs
    walletPayment: "Pagamento con Portafoglio",
    creditCardPayment: "Pagamento con Carta di Credito",
    bankTransfer: "Bonifico Bancario",
    bankTransferInstructions: "Per completare il tuo investimento tramite bonifico bancario, usa i seguenti dettagli:",
    accountDetails: "Dettagli del Conto",
    bankName: "Nome della banca",
    accountNumber: "Numero di conto",
    routingNumber: "Numero di routing",
    swift: "Codice SWIFT",
    reference: "Riferimento",
    includeReference: "Includi il riferimento esatto nel tuo bonifico così possiamo identificare il tuo pagamento.",
    address: "Indirizzo",
    amount: "Importo",
    
    // Bank transfer specific
    ibanCopied: "IBAN copiato",
    bicCopied: "BIC copiato",
    referenceCopied: "Riferimento copiato",
    important: "Importante",
    walletReferenceWarning: "Devi includere le prime 8 cifre del tuo indirizzo del portafoglio come riferimento per identificare il tuo pagamento.",
    transferMade: "Ho effettuato il bonifico",
    connectWallet: "Connetti portafoglio",
    
    // Summary
    operationSummary: "Riepilogo Operazione",
    impermanentLossRisk: "Rischio di Perdita Impermanente",
    high: "Alto",
    medium: "Medio",
    low: "Basso",
    expectedApr: "APR Previsto",
    potentialRewards: "Ricompense Potenziali",
    
    // Buttons
    connect: "Connetti",
    disconnect: "Disconnetti",
    continue: "Continua",
    addLiquidityButton: "Aggiungi Liquidità",
    copyToClipboard: "Copia negli appunti",
    copied: "Copiato",
    cancel: "Annulla",
    back: "Indietro",
    iHaveTransferred: "Ho effettuato il bonifico",
    pay: "Paga"
  },
  pt: {
    // Header
    title: "Adicionar Liquidez",
    
    // Form and inputs
    addLiquidity: "Adicionar Liquidez",
    addLiquidityWithUsdc: "Adicionar Liquidez com USDC",
    enterUsdcAmount: "Digite a quantidade de USDC que deseja investir",
    amountUsdcLabel: "Quantidade USDC",
    amountPlaceholder: "Digite o valor",
    invalidAmount: "Valor inválido",
    pleaseConnect: "Por favor conecte sua carteira para continuar.",
    walletNotConnected: "Carteira não conectada",
    
    // Slider and options
    rangeWidthLabel: "Largura do Intervalo",
    rangeWidthDescriptionNarrow: "Estreito (APR mais alto, rebalanceamento frequente)",
    rangeWidthDescriptionWide: "Amplo (APR mais baixo, menos rebalanceamento)",
    timeframeLabel: "Período de Tempo",
    timeframe30Days: "30 dias",
    timeframe90Days: "90 dias",
    timeframe365Days: "365 dias",
    
    // Risk and terms
    riskNotice: "Aviso de Risco",
    riskDisclaimer: "Entendo que adicionar liquidez envolve riscos incluindo perda impermanente e outros riscos de mercado.",
    termsAndConditions: "Termos e Condições",
    termsNotAccepted: "Termos não aceitos",
    iUnderstandRisks: "Entendo os riscos envolvidos",
    iAcceptTerms: "Aceito os termos e condições",
    
    // Payment methods
    choosePaymentMethod: "Escolha como deseja pagar",
    processingRequest: "Processando solicitação",
    requestSent: "Solicitação enviada",
    selectPaymentMethod: "Selecionar método de pagamento",
    payWithWallet: "Pagar com Carteira",
    payWithCreditCard: "Pagar com Cartão de Crédito",
    payWithBankTransfer: "Transferência Bancária",
    
    // Payment dialogs
    walletPayment: "Pagamento com Carteira",
    creditCardPayment: "Pagamento com Cartão de Crédito",
    bankTransfer: "Transferência Bancária",
    bankTransferInstructions: "Para completar seu investimento via transferência bancária, use os seguintes detalhes:",
    accountDetails: "Detalhes da Conta",
    bankName: "Nome do banco",
    accountNumber: "Número da conta",
    routingNumber: "Número de roteamento",
    swift: "Código SWIFT",
    reference: "Referência",
    includeReference: "Inclua a referência exata em sua transferência para que possamos identificar seu pagamento.",
    address: "Endereço",
    amount: "Valor",
    
    // Bank transfer specific
    ibanCopied: "IBAN copiado",
    bicCopied: "BIC copiado",
    referenceCopied: "Referência copiada",
    important: "Importante",
    walletReferenceWarning: "Você deve incluir os primeiros 8 dígitos do endereço da sua carteira como referência para identificar seu pagamento.",
    transferMade: "Realizei a transferência",
    connectWallet: "Conectar carteira",
    
    // Summary
    operationSummary: "Resumo da Operação",
    impermanentLossRisk: "Risco de Perda Impermanente",
    high: "Alto",
    medium: "Médio",
    low: "Baixo",
    expectedApr: "APR Esperado",
    potentialRewards: "Recompensas Potenciais",
    
    // Buttons
    connect: "Conectar",
    disconnect: "Desconectar",
    continue: "Continuar",
    addLiquidityButton: "Adicionar Liquidez",
    copyToClipboard: "Copiar para área de transferência",
    copied: "Copiado",
    cancel: "Cancelar",
    back: "Voltar",
    iHaveTransferred: "Realizei a transferência",
    pay: "Pagar"
  },
  de: {
    // Header
    title: "Liquidität hinzufügen",
    
    // Form and inputs
    addLiquidity: "Liquidität hinzufügen",
    addLiquidityWithUsdc: "Liquidität mit USDC hinzufügen",
    enterUsdcAmount: "Geben Sie den USDC-Betrag ein, den Sie investieren möchten",
    amountUsdcLabel: "USDC-Betrag",
    amountPlaceholder: "Betrag eingeben",
    invalidAmount: "Ungültiger Betrag",
    pleaseConnect: "Bitte verbinden Sie Ihre Wallet, um fortzufahren.",
    walletNotConnected: "Wallet nicht verbunden",
    
    // Slider and options
    rangeWidthLabel: "Bereichsbreite",
    rangeWidthDescriptionNarrow: "Eng (höherer APR, häufiges Rebalancing)",
    rangeWidthDescriptionWide: "Breit (niedrigerer APR, weniger Rebalancing)",
    timeframeLabel: "Zeitraum",
    timeframe30Days: "30 Tage",
    timeframe90Days: "90 Tage",
    timeframe365Days: "365 Tage",
    
    // Risk and terms
    riskNotice: "Risikohinweis",
    riskDisclaimer: "Ich verstehe, dass das Hinzufügen von Liquidität Risiken birgt, einschließlich unbeständiger Verluste und anderer Marktrisiken.",
    termsAndConditions: "Allgemeine Geschäftsbedingungen",
    termsNotAccepted: "Bedingungen nicht akzeptiert",
    iUnderstandRisks: "Ich verstehe die damit verbundenen Risiken",
    iAcceptTerms: "Ich akzeptiere die Allgemeinen Geschäftsbedingungen",
    
    // Payment methods
    choosePaymentMethod: "Wählen Sie, wie Sie bezahlen möchten",
    processingRequest: "Bearbeitung der Anfrage",
    requestSent: "Anfrage gesendet",
    selectPaymentMethod: "Zahlungsmethode auswählen",
    payWithWallet: "Mit Wallet bezahlen",
    payWithCreditCard: "Mit Kreditkarte bezahlen",
    payWithBankTransfer: "Banküberweisung",
    
    // Payment dialogs
    walletPayment: "Wallet-Zahlung",
    creditCardPayment: "Kreditkartenzahlung",
    bankTransfer: "Banküberweisung",
    bankTransferInstructions: "Um Ihre Investition per Banküberweisung abzuschließen, verwenden Sie die folgenden Details:",
    accountDetails: "Kontodetails",
    bankName: "Bankname",
    accountNumber: "Kontonummer",
    routingNumber: "Routing-Nummer",
    swift: "SWIFT-Code",
    reference: "Referenz",
    includeReference: "Geben Sie die genaue Referenz in Ihrer Überweisung an, damit wir Ihre Zahlung identifizieren können.",
    address: "Adresse",
    amount: "Betrag",
    
    // Bank transfer specific
    ibanCopied: "IBAN kopiert",
    bicCopied: "BIC kopiert",
    referenceCopied: "Referenz kopiert",
    important: "Wichtig",
    walletReferenceWarning: "Sie müssen die ersten 8 Stellen Ihrer Wallet-Adresse als Referenz angeben, um Ihre Zahlung zu identifizieren.",
    transferMade: "Ich habe die Überweisung getätigt",
    connectWallet: "Wallet verbinden",
    
    // Summary
    operationSummary: "Zusammenfassung der Operation",
    impermanentLossRisk: "Risiko für unbeständigen Verlust",
    high: "Hoch",
    medium: "Mittel",
    low: "Niedrig",
    expectedApr: "Erwarteter APR",
    potentialRewards: "Potenzielle Belohnungen",
    
    // Buttons
    connect: "Verbinden",
    disconnect: "Trennen",
    continue: "Fortfahren",
    addLiquidityButton: "Liquidität hinzufügen",
    copyToClipboard: "In die Zwischenablage kopieren",
    copied: "Kopiert",
    cancel: "Abbrechen",
    back: "Zurück",
    iHaveTransferred: "Ich habe die Überweisung getätigt",
    pay: "Bezahlen"
  },
  fr: {
    // Header
    title: "Ajouter de la Liquidité",
    
    // Form and inputs
    addLiquidity: "Ajouter de la Liquidité",
    addLiquidityWithUsdc: "Ajouter de la Liquidité avec USDC",
    enterUsdcAmount: "Entrez le montant d'USDC que vous souhaitez investir",
    amountUsdcLabel: "Montant USDC",
    amountPlaceholder: "Entrer le montant",
    invalidAmount: "Montant invalide",
    pleaseConnect: "Veuillez connecter votre portefeuille pour continuer.",
    walletNotConnected: "Portefeuille non connecté",
    
    // Slider and options
    rangeWidthLabel: "Largeur de Gamme",
    rangeWidthDescriptionNarrow: "Étroite (APR plus élevé, rééquilibrage fréquent)",
    rangeWidthDescriptionWide: "Large (APR plus bas, moins de rééquilibrage)",
    timeframeLabel: "Période",
    timeframe30Days: "30 jours",
    timeframe90Days: "90 jours",
    timeframe365Days: "365 jours",
    
    // Risk and terms
    riskNotice: "Avis de Risque",
    riskDisclaimer: "Je comprends que l'ajout de liquidité comporte des risques, notamment des pertes impermanentes et d'autres risques de marché.",
    termsAndConditions: "Termes et Conditions",
    termsNotAccepted: "Termes non acceptés",
    iUnderstandRisks: "Je comprends les risques impliqués",
    iAcceptTerms: "J'accepte les termes et conditions",
    
    // Payment methods
    choosePaymentMethod: "Choisissez comment vous souhaitez payer",
    processingRequest: "Traitement de la demande",
    requestSent: "Demande envoyée",
    selectPaymentMethod: "Sélectionner le mode de paiement",
    payWithWallet: "Payer avec Portefeuille",
    payWithCreditCard: "Payer par Carte de Crédit",
    payWithBankTransfer: "Virement Bancaire",
    
    // Payment dialogs
    walletPayment: "Paiement par Portefeuille",
    creditCardPayment: "Paiement par Carte de Crédit",
    bankTransfer: "Virement Bancaire",
    bankTransferInstructions: "Pour compléter votre investissement par virement bancaire, utilisez les détails suivants :",
    accountDetails: "Détails du Compte",
    bankName: "Nom de la banque",
    accountNumber: "Numéro de compte",
    routingNumber: "Numéro de routage",
    swift: "Code SWIFT",
    reference: "Référence",
    includeReference: "Incluez la référence exacte dans votre virement pour que nous puissions identifier votre paiement.",
    address: "Adresse",
    amount: "Montant",
    
    // Bank transfer specific
    ibanCopied: "IBAN copié",
    bicCopied: "BIC copié",
    referenceCopied: "Référence copiée",
    important: "Important",
    walletReferenceWarning: "Vous devez inclure les 8 premiers chiffres de votre adresse de portefeuille comme référence pour identifier votre paiement.",
    transferMade: "J'ai effectué le virement",
    connectWallet: "Connecter le portefeuille",
    
    // Summary
    operationSummary: "Résumé de l'Opération",
    impermanentLossRisk: "Risque de Perte Impermanente",
    high: "Élevé",
    medium: "Moyen",
    low: "Faible",
    expectedApr: "APR Attendu",
    potentialRewards: "Récompenses Potentielles",
    
    // Buttons
    connect: "Connecter",
    disconnect: "Déconnecter",
    continue: "Continuer",
    addLiquidityButton: "Ajouter de la Liquidité",
    copyToClipboard: "Copier dans le presse-papiers",
    copied: "Copié",
    cancel: "Annuler",
    back: "Retour",
    iHaveTransferred: "J'ai effectué le virement",
    pay: "Payer"
  },
  hi: {
    // Header
    title: "तरलता जोड़ें",
    
    // Form and inputs
    addLiquidity: "तरलता जोड़ें",
    addLiquidityWithUsdc: "USDC के साथ तरलता जोड़ें",
    enterUsdcAmount: "आप जो USDC राशि निवेश करना चाहते हैं उसे दर्ज करें",
    amountUsdcLabel: "USDC राशि",
    amountPlaceholder: "राशि दर्ज करें",
    invalidAmount: "अमान्य राशि",
    pleaseConnect: "कृपया आगे बढ़ने के लिए अपना वॉलेट कनेक्ट करें।",
    walletNotConnected: "वॉलेट कनेक्ट नहीं है",
    
    // Slider and options
    rangeWidthLabel: "रेंज चौड़ाई",
    rangeWidthDescriptionNarrow: "संकरा (उच्च APR, बार-बार रीबैलेंसिंग)",
    rangeWidthDescriptionWide: "चौड़ा (कम APR, कम रीबैलेंसिंग)",
    timeframeLabel: "समय सीमा",
    timeframe30Days: "30 दिन",
    timeframe90Days: "90 दिन",
    timeframe365Days: "365 दिन",
    
    // Risk and terms
    riskNotice: "जोखिम सूचना",
    riskDisclaimer: "मैं समझता हूं कि तरलता जोड़ने में स्थायी हानि और अन्य बाजार जोखिम शामिल हैं।",
    termsAndConditions: "नियम और शर्तें",
    termsNotAccepted: "नियम स्वीकार नहीं किए गए",
    iUnderstandRisks: "मैं शामिल जोखिमों को समझता हूं",
    iAcceptTerms: "मैं नियम और शर्तों को स्वीकार करता हूं",
    
    // Payment methods
    choosePaymentMethod: "चुनें कि आप कैसे भुगतान करना चाहते हैं",
    processingRequest: "अनुरोध प्रसंस्करण",
    requestSent: "अनुरोध भेजा गया",
    selectPaymentMethod: "भुगतान विधि चुनें",
    payWithWallet: "वॉलेट से भुगतान करें",
    payWithCreditCard: "क्रेडिट कार्ड से भुगतान करें",
    payWithBankTransfer: "बैंक ट्रांसफर",
    
    // Payment dialogs
    walletPayment: "वॉलेट भुगतान",
    creditCardPayment: "क्रेडिट कार्ड भुगतान",
    bankTransfer: "बैंक ट्रांसफर",
    bankTransferInstructions: "बैंक ट्रांसफर के माध्यम से अपना निवेश पूरा करने के लिए, निम्नलिखित विवरण का उपयोग करें:",
    accountDetails: "खाता विवरण",
    bankName: "बैंक का नाम",
    accountNumber: "खाता संख्या",
    routingNumber: "रूटिंग संख्या",
    swift: "SWIFT कोड",
    reference: "संदर्भ",
    includeReference: "अपने ट्रांसफर में सटीक संदर्भ शामिल करें ताकि हम आपके भुगतान की पहचान कर सकें।",
    address: "पता",
    amount: "राशि",
    
    // Bank transfer specific
    ibanCopied: "IBAN कॉपी किया गया",
    bicCopied: "BIC कॉपी किया गया",
    referenceCopied: "संदर्भ कॉपी किया गया",
    important: "महत्वपूर्ण",
    walletReferenceWarning: "आपके भुगतान की पहचान के लिए आपको अपने वॉलेट पते के पहले 8 अंकों को संदर्भ के रूप में शामिल करना होगा।",
    transferMade: "मैंने ट्रांसफर किया है",
    connectWallet: "वॉलेट कनेक्ट करें",
    
    // Summary
    operationSummary: "ऑपरेशन सारांश",
    impermanentLossRisk: "स्थायी हानि जोखिम",
    high: "उच्च",
    medium: "मध्यम",
    low: "कम",
    expectedApr: "अपेक्षित APR",
    potentialRewards: "संभावित पुरस्कार",
    
    // Buttons
    connect: "कनेक्ट करें",
    disconnect: "डिस्कनेक्ट करें",
    continue: "जारी रखें",
    addLiquidityButton: "तरलता जोड़ें",
    copyToClipboard: "क्लिपबोर्ड में कॉपी करें",
    copied: "कॉपी किया गया",
    cancel: "रद्द करें",
    back: "वापस",
    iHaveTransferred: "मैंने ट्रांसफर किया है",
    pay: "भुगतान करें"
  },
  zh: {
    // Header
    title: "添加流动性",
    
    // Form and inputs
    addLiquidity: "添加流动性",
    addLiquidityWithUsdc: "使用USDC添加流动性",
    enterUsdcAmount: "输入您想要投资的USDC数量",
    amountUsdcLabel: "USDC数量",
    amountPlaceholder: "输入金额",
    invalidAmount: "无效金额",
    pleaseConnect: "请连接您的钱包以继续。",
    walletNotConnected: "钱包未连接",
    
    // Slider and options
    rangeWidthLabel: "范围宽度",
    rangeWidthDescriptionNarrow: "窄范围（更高APR，频繁重新平衡）",
    rangeWidthDescriptionWide: "宽范围（更低APR，较少重新平衡）",
    timeframeLabel: "时间框架",
    timeframe30Days: "30天",
    timeframe90Days: "90天",
    timeframe365Days: "365天",
    
    // Risk and terms
    riskNotice: "风险提示",
    riskDisclaimer: "我了解添加流动性存在风险，包括无常损失和其他市场风险。",
    termsAndConditions: "条款和条件",
    termsNotAccepted: "条款未接受",
    iUnderstandRisks: "我了解所涉及的风险",
    iAcceptTerms: "我接受条款和条件",
    
    // Payment methods
    choosePaymentMethod: "选择您的付款方式",
    processingRequest: "处理请求中",
    requestSent: "请求已发送",
    selectPaymentMethod: "选择付款方式",
    payWithWallet: "使用钱包付款",
    payWithCreditCard: "使用信用卡付款",
    payWithBankTransfer: "银行转账",
    
    // Payment dialogs
    walletPayment: "钱包付款",
    creditCardPayment: "信用卡付款",
    bankTransfer: "银行转账",
    bankTransferInstructions: "要通过银行转账完成您的投资，请使用以下详细信息：",
    accountDetails: "账户详情",
    bankName: "银行名称",
    accountNumber: "账户号码",
    routingNumber: "路由号码",
    swift: "SWIFT代码",
    reference: "参考",
    includeReference: "在您的转账中包含确切的参考，以便我们能够识别您的付款。",
    address: "地址",
    amount: "金额",
    
    // Bank transfer specific
    ibanCopied: "IBAN已复制",
    bicCopied: "BIC已复制",
    referenceCopied: "参考已复制",
    important: "重要",
    walletReferenceWarning: "您必须包含钱包地址的前8位数字作为参考来识别您的付款。",
    transferMade: "我已经完成转账",
    connectWallet: "连接钱包",
    
    // Summary
    operationSummary: "操作摘要",
    impermanentLossRisk: "无常损失风险",
    high: "高",
    medium: "中",
    low: "低",
    expectedApr: "预期APR",
    potentialRewards: "潜在奖励",
    
    // Buttons
    connect: "连接",
    disconnect: "断开连接",
    continue: "继续",
    addLiquidityButton: "添加流动性",
    copyToClipboard: "复制到剪贴板",
    copied: "已复制",
    cancel: "取消",
    back: "返回",
    iHaveTransferred: "我已经完成转账",
    pay: "付款"
  },
  ar: {
    // Header
    title: "إضافة سيولة",
    
    // Form and inputs
    addLiquidity: "إضافة سيولة",
    addLiquidityWithUsdc: "إضافة سيولة بـ USDC",
    enterUsdcAmount: "أدخل كمية USDC التي تريد استثمارها",
    amountUsdcLabel: "كمية USDC",
    amountPlaceholder: "أدخل المبلغ",
    invalidAmount: "مبلغ غير صالح",
    pleaseConnect: "يرجى ربط محفظتك للمتابعة.",
    walletNotConnected: "المحفظة غير متصلة",
    
    // Slider and options
    rangeWidthLabel: "عرض النطاق",
    rangeWidthDescriptionNarrow: "ضيق (APR أعلى، إعادة توازن متكررة)",
    rangeWidthDescriptionWide: "واسع (APR أقل، إعادة توازن أقل)",
    timeframeLabel: "الإطار الزمني",
    timeframe30Days: "30 يوماً",
    timeframe90Days: "90 يوماً",
    timeframe365Days: "365 يوماً",
    
    // Risk and terms
    riskNotice: "إشعار المخاطر",
    riskDisclaimer: "أفهم أن إضافة السيولة تحمل مخاطر بما في ذلك الخسارة غير الدائمة ومخاطر السوق الأخرى.",
    termsAndConditions: "الشروط والأحكام",
    termsNotAccepted: "الشروط غير مقبولة",
    iUnderstandRisks: "أفهم المخاطر المتضمنة",
    iAcceptTerms: "أوافق على الشروط والأحكام",
    
    // Payment methods
    choosePaymentMethod: "اختر كيف تريد الدفع",
    processingRequest: "معالجة الطلب",
    requestSent: "تم إرسال الطلب",
    selectPaymentMethod: "اختر طريقة الدفع",
    payWithWallet: "ادفع بالمحفظة",
    payWithCreditCard: "ادفع بالبطاقة الائتمانية",
    payWithBankTransfer: "تحويل بنكي",
    
    // Payment dialogs
    walletPayment: "دفع بالمحفظة",
    creditCardPayment: "دفع بالبطاقة الائتمانية",
    bankTransfer: "تحويل بنكي",
    bankTransferInstructions: "لإكمال استثمارك عبر التحويل البنكي، استخدم التفاصيل التالية:",
    accountDetails: "تفاصيل الحساب",
    bankName: "اسم البنك",
    accountNumber: "رقم الحساب",
    routingNumber: "رقم التوجيه",
    swift: "كود SWIFT",
    reference: "المرجع",
    includeReference: "قم بتضمين المرجع الدقيق في تحويلك حتى نتمكن من تحديد دفعتك.",
    address: "العنوان",
    amount: "المبلغ",
    
    // Bank transfer specific
    ibanCopied: "تم نسخ IBAN",
    bicCopied: "تم نسخ BIC",
    referenceCopied: "تم نسخ المرجع",
    important: "مهم",
    walletReferenceWarning: "يجب أن تقوم بتضمين أول 8 أرقام من عنوان محفظتك كمرجع لتحديد دفعتك.",
    transferMade: "لقد قمت بالتحويل",
    connectWallet: "ربط المحفظة",
    
    // Summary
    operationSummary: "ملخص العملية",
    impermanentLossRisk: "مخاطر الخسارة غير الدائمة",
    high: "عالي",
    medium: "متوسط",
    low: "منخفض",
    expectedApr: "APR المتوقع",
    potentialRewards: "المكافآت المحتملة",
    
    // Buttons
    connect: "ربط",
    disconnect: "قطع الاتصال",
    continue: "متابعة",
    addLiquidityButton: "إضافة سيولة",
    copyToClipboard: "نسخ إلى الحافظة",
    copied: "تم النسخ",
    cancel: "إلغاء",
    back: "رجوع",
    iHaveTransferred: "لقد قمت بالتحويل",
    pay: "دفع"
  },
  ru: {
    // Header
    title: "Добавить Ликвидность",
    
    // Form and inputs
    addLiquidity: "Добавить Ликвидность",
    addLiquidityWithUsdc: "Добавить Ликвидность с USDC",
    enterUsdcAmount: "Введите количество USDC, которое вы хотите инвестировать",
    amountUsdcLabel: "Количество USDC",
    amountPlaceholder: "Введите сумму",
    invalidAmount: "Недопустимая сумма",
    pleaseConnect: "Пожалуйста, подключите ваш кошелек для продолжения.",
    walletNotConnected: "Кошелек не подключен",
    
    // Slider and options
    rangeWidthLabel: "Ширина Диапазона",
    rangeWidthDescriptionNarrow: "Узкий (Выше APR, частая перебалансировка)",
    rangeWidthDescriptionWide: "Широкий (Ниже APR, меньше перебалансировки)",
    timeframeLabel: "Временные Рамки",
    timeframe30Days: "30 дней",
    timeframe90Days: "90 дней",
    timeframe365Days: "365 дней",
    
    // Risk and terms
    riskNotice: "Уведомление о Рисках",
    riskDisclaimer: "Я понимаю, что добавление ликвидности несет риски, включая непостоянные потери и другие рыночные риски.",
    termsAndConditions: "Условия и Положения",
    termsNotAccepted: "Условия не приняты",
    iUnderstandRisks: "Я понимаю связанные риски",
    iAcceptTerms: "Я принимаю условия и положения",
    
    // Payment methods
    choosePaymentMethod: "Выберите способ оплаты",
    processingRequest: "Обработка запроса",
    requestSent: "Запрос отправлен",
    selectPaymentMethod: "Выберите метод оплаты",
    payWithWallet: "Оплатить Кошельком",
    payWithCreditCard: "Оплатить Кредитной Картой",
    payWithBankTransfer: "Банковский Перевод",
    
    // Payment dialogs
    walletPayment: "Оплата Кошельком",
    creditCardPayment: "Оплата Кредитной Картой",
    bankTransfer: "Банковский Перевод",
    bankTransferInstructions: "Чтобы завершить ваши инвестиции через банковский перевод, используйте следующие данные:",
    accountDetails: "Реквизиты Счета",
    bankName: "Название банка",
    accountNumber: "Номер счета",
    routingNumber: "Номер маршрутизации",
    swift: "SWIFT код",
    reference: "Ссылка",
    includeReference: "Включите точную ссылку в ваш перевод, чтобы мы могли идентифицировать ваш платеж.",
    address: "Адрес",
    amount: "Сумма",
    
    // Bank transfer specific
    ibanCopied: "IBAN скопирован",
    bicCopied: "BIC скопирован",
    referenceCopied: "Ссылка скопирована",
    important: "Важно",
    walletReferenceWarning: "Вы должны включить первые 8 цифр адреса вашего кошелька в качестве ссылки для идентификации вашего платежа.",
    transferMade: "Я сделал перевод",
    connectWallet: "Подключить кошелек",
    
    // Summary
    operationSummary: "Сводка Операции",
    impermanentLossRisk: "Риск Непостоянных Потерь",
    high: "Высокий",
    medium: "Средний",
    low: "Низкий",
    expectedApr: "Ожидаемый APR",
    potentialRewards: "Потенциальные Награды",
    
    // Buttons
    connect: "Подключить",
    disconnect: "Отключить",
    continue: "Продолжить",
    addLiquidityButton: "Добавить Ликвидность",
    copyToClipboard: "Копировать в буфер обмена",
    copied: "Скопировано",
    cancel: "Отменить",
    back: "Назад",
    iHaveTransferred: "Я сделал перевод",
    pay: "Оплатить"
  }
};