// Traducciones para la página de transferencias
// Translations for the transfers page

export interface TransfersTranslations {
  // Header
  title: string;
  description: string;
  readOnlyMode: string;
  limitedFunctionality: string;
  noActiveSession: string;
  
  // Tab titles
  cryptocurrencies: string;
  nfts: string;
  
  // Crypto transfer section
  sendCryptocurrencies: string;
  transferDescription: string;
  selectNetwork: string;
  ethMatic: string;
  erc20Tokens: string;
  
  // Form fields
  destinationAddress: string;
  addressDescription: string;
  amount: string;
  amountDescription: string;
  useMax: string;
  
  // Token transfer
  tokenAddress: string;
  tokenAddressDescription: string;
  custom: string;
  tokenAmount: string;
  tokenAmountDescription: string;
  
  // NFT transfer section
  sendNFTs: string;
  nftTransferDescription: string;
  nftContractAddress: string;
  nftContractAddressDescription: string;
  tokenId: string;
  tokenIdDescription: string;
  
  // Alerts
  importantVerification: string;
  verificationDescription: string;
  nftVerificationDescription: string;
  
  // Buttons
  sending: string;
  send: string;
  sendEth: string;
  sendMatic: string;
  sendTokens: string;
  sendNft: string;
  
  // Wallet panel
  wallet: string;
  ethBalance: string;
  maticBalance: string;
  erc20TokensLabel: string;
  noTokensFound: string;
  
  // History panel
  transferHistory: string;
  noTransfers: string;
  pending: string;
  completed: string;
  failed: string;
  viewOnBlockExplorer: string;
  from: string;
  to: string;
  date: string;
  status: string;
  txHash: string;
}

export const transfersTranslations: Record<string, TransfersTranslations> = {
  es: {
    // Header
    title: "Transferencias",
    description: "Envía criptomonedas y NFTs desde tu billetera WayBank a cualquier dirección.",
    readOnlyMode: "Modo Solo Lectura",
    limitedFunctionality: "Funcionalidad Limitada",
    noActiveSession: "No tienes una sesión activa. Puedes ver saldos, pero no realizar transferencias.",
    
    // Tab titles
    cryptocurrencies: "Criptomonedas",
    nfts: "NFTs",
    
    // Crypto transfer section
    sendCryptocurrencies: "Enviar Criptomonedas",
    transferDescription: "Transferir ETH, MATIC o tokens ERC20 a otra dirección",
    selectNetwork: "Seleccionar red",
    ethMatic: "ETH / MATIC",
    erc20Tokens: "Tokens ERC20",
    
    // Form fields
    destinationAddress: "Dirección Destino",
    addressDescription: "Dirección de billetera Ethereum a la que enviarás fondos",
    amount: "Cantidad",
    amountDescription: "Cantidad a enviar",
    useMax: "Usar Máximo",
    
    // Token transfer
    tokenAddress: "Dirección del Token",
    tokenAddressDescription: "Dirección del contrato del token ERC20",
    custom: "Personalizado",
    tokenAmount: "Cantidad",
    tokenAmountDescription: "Cantidad de tokens a enviar",
    
    // NFT transfer section
    sendNFTs: "Enviar NFTs",
    nftTransferDescription: "Transfiere NFTs (tokens ERC-721) a otra dirección",
    nftContractAddress: "Dirección del Contrato NFT",
    nftContractAddressDescription: "Dirección del contrato NFT (ERC-721)",
    tokenId: "ID del Token",
    tokenIdDescription: "ID único del NFT que deseas transferir",
    
    // Alerts
    importantVerification: "Verificación importante",
    verificationDescription: "Revisa cuidadosamente la dirección y la cantidad antes de enviar. Las transacciones en blockchain son irreversibles.",
    nftVerificationDescription: "Revisa cuidadosamente la dirección del contrato y el ID del token antes de enviar. Las transferencias de NFTs son irreversibles.",
    
    // Buttons
    sending: "Enviando...",
    send: "Enviar",
    sendEth: "Enviar ETH",
    sendMatic: "Enviar MATIC",
    sendTokens: "Enviar Tokens",
    sendNft: "Enviar NFT",
    
    // Wallet panel
    wallet: "Billetera WayBank",
    ethBalance: "Saldo ETH",
    maticBalance: "Saldo MATIC",
    erc20TokensLabel: "Tokens ERC20",
    noTokensFound: "No se encontraron tokens ERC20",
    
    // History panel
    transferHistory: "Historial de Transferencias",
    noTransfers: "No hay transferencias en tu historial",
    pending: "Pendiente",
    completed: "Completada",
    failed: "Fallida",
    viewOnBlockExplorer: "Ver en explorador",
    from: "Desde",
    to: "Hasta",
    date: "Fecha",
    status: "Estado",
    txHash: "Hash de transacción"
  },
  en: {
    // Header
    title: "Transfers",
    description: "Send cryptocurrencies and NFTs from your WayBank wallet to any address.",
    readOnlyMode: "Read-Only Mode",
    limitedFunctionality: "Limited Functionality",
    noActiveSession: "You don't have an active session. You can view balances, but not make transfers.",
    
    // Tab titles
    cryptocurrencies: "Cryptocurrencies",
    nfts: "NFTs",
    
    // Crypto transfer section
    sendCryptocurrencies: "Send Cryptocurrencies",
    transferDescription: "Transfer ETH, MATIC or ERC20 tokens to another address",
    selectNetwork: "Select network",
    ethMatic: "ETH / MATIC",
    erc20Tokens: "ERC20 Tokens",
    
    // Form fields
    destinationAddress: "Destination Address",
    addressDescription: "Ethereum wallet address to which you will send funds",
    amount: "Amount",
    amountDescription: "Amount to send",
    useMax: "Use Max",
    
    // Token transfer
    tokenAddress: "Token Address",
    tokenAddressDescription: "ERC20 token contract address",
    custom: "Custom",
    tokenAmount: "Amount",
    tokenAmountDescription: "Amount of tokens to send",
    
    // NFT transfer section
    sendNFTs: "Send NFTs",
    nftTransferDescription: "Transfer NFTs (ERC-721 tokens) to another address",
    nftContractAddress: "NFT Contract Address",
    nftContractAddressDescription: "NFT contract address (ERC-721)",
    tokenId: "Token ID",
    tokenIdDescription: "Unique ID of the NFT you want to transfer",
    
    // Alerts
    importantVerification: "Important Verification",
    verificationDescription: "Carefully review the address and amount before sending. Blockchain transactions are irreversible.",
    nftVerificationDescription: "Carefully review the contract address and token ID before sending. NFT transfers are irreversible.",
    
    // Buttons
    sending: "Sending...",
    send: "Send",
    sendEth: "Send ETH",
    sendMatic: "Send MATIC",
    sendTokens: "Send Tokens",
    sendNft: "Send NFT",
    
    // Wallet panel
    wallet: "WayBank Wallet",
    ethBalance: "ETH Balance",
    maticBalance: "MATIC Balance",
    erc20TokensLabel: "ERC20 Tokens",
    noTokensFound: "No ERC20 tokens found",
    
    // History panel
    transferHistory: "Transfer History",
    noTransfers: "No transfers in your history",
    pending: "Pending",
    completed: "Completed",
    failed: "Failed",
    viewOnBlockExplorer: "View on block explorer",
    from: "From",
    to: "To",
    date: "Date",
    status: "Status",
    txHash: "Transaction hash"
  },
  it: {
    // Header
    title: "Trasferimenti",
    description: "Invia criptovalute e NFT dal tuo wallet WayBank a qualsiasi indirizzo.",
    readOnlyMode: "Modalità Sola Lettura",
    limitedFunctionality: "Funzionalità Limitata",
    noActiveSession: "Non hai una sessione attiva. Puoi visualizzare i saldi, ma non effettuare trasferimenti.",
    
    // Tab titles
    cryptocurrencies: "Criptovalute",
    nfts: "NFT",
    
    // Crypto transfer section
    sendCryptocurrencies: "Invia Criptovalute",
    transferDescription: "Trasferisci ETH, MATIC o token ERC20 a un altro indirizzo",
    selectNetwork: "Seleziona rete",
    ethMatic: "ETH / MATIC",
    erc20Tokens: "Token ERC20",
    
    // Form fields
    destinationAddress: "Indirizzo di Destinazione",
    addressDescription: "Indirizzo del wallet Ethereum a cui invierai i fondi",
    amount: "Importo",
    amountDescription: "Importo da inviare",
    useMax: "Usa Max",
    
    // Token transfer
    tokenAddress: "Indirizzo Token",
    tokenAddressDescription: "Indirizzo del contratto del token ERC20",
    custom: "Personalizzato",
    tokenAmount: "Importo",
    tokenAmountDescription: "Quantità di token da inviare",
    
    // NFT transfer section
    sendNFTs: "Invia NFT",
    nftTransferDescription: "Trasferisci NFT (token ERC-721) a un altro indirizzo",
    nftContractAddress: "Indirizzo Contratto NFT",
    nftContractAddressDescription: "Indirizzo del contratto NFT (ERC-721)",
    tokenId: "ID Token",
    tokenIdDescription: "ID univoco dell'NFT che desideri trasferire",
    
    // Alerts
    importantVerification: "Verifica Importante",
    verificationDescription: "Rivedi attentamente l'indirizzo e l'importo prima di inviare. Le transazioni blockchain sono irreversibili.",
    nftVerificationDescription: "Rivedi attentamente l'indirizzo del contratto e l'ID del token prima di inviare. I trasferimenti NFT sono irreversibili.",
    
    // Buttons
    sending: "Invio...",
    send: "Invia",
    sendEth: "Invia ETH",
    sendMatic: "Invia MATIC",
    sendTokens: "Invia Token",
    sendNft: "Invia NFT",
    
    // Wallet panel
    wallet: "Wallet WayBank",
    ethBalance: "Saldo ETH",
    maticBalance: "Saldo MATIC",
    erc20TokensLabel: "Token ERC20",
    noTokensFound: "Nessun token ERC20 trovato",
    
    // History panel
    transferHistory: "Cronologia Trasferimenti",
    noTransfers: "Nessun trasferimento nella tua cronologia",
    pending: "In sospeso",
    completed: "Completato",
    failed: "Fallito",
    viewOnBlockExplorer: "Visualizza su block explorer",
    from: "Da",
    to: "A",
    date: "Data",
    status: "Stato",
    txHash: "Hash transazione"
  },
  pt: {
    // Header
    title: "Transferências",
    description: "Envie criptomoedas e NFTs da sua carteira WayBank para qualquer endereço.",
    readOnlyMode: "Modo Somente Leitura",
    limitedFunctionality: "Funcionalidade Limitada",
    noActiveSession: "Você não tem uma sessão ativa. Você pode ver saldos, mas não fazer transferências.",
    
    // Tab titles
    cryptocurrencies: "Criptomoedas",
    nfts: "NFTs",
    
    // Crypto transfer section
    sendCryptocurrencies: "Enviar Criptomoedas",
    transferDescription: "Transfira ETH, MATIC ou tokens ERC20 para outro endereço",
    selectNetwork: "Selecionar rede",
    ethMatic: "ETH / MATIC",
    erc20Tokens: "Tokens ERC20",
    
    // Form fields
    destinationAddress: "Endereço de Destino",
    addressDescription: "Endereço da carteira Ethereum para a qual você enviará fundos",
    amount: "Valor",
    amountDescription: "Valor a enviar",
    useMax: "Usar Máx",
    
    // Token transfer
    tokenAddress: "Endereço do Token",
    tokenAddressDescription: "Endereço do contrato do token ERC20",
    custom: "Personalizado",
    tokenAmount: "Valor",
    tokenAmountDescription: "Quantidade de tokens a enviar",
    
    // NFT transfer section
    sendNFTs: "Enviar NFTs",
    nftTransferDescription: "Transfira NFTs (tokens ERC-721) para outro endereço",
    nftContractAddress: "Endereço do Contrato NFT",
    nftContractAddressDescription: "Endereço do contrato NFT (ERC-721)",
    tokenId: "ID do Token",
    tokenIdDescription: "ID único do NFT que você deseja transferir",
    
    // Alerts
    importantVerification: "Verificação Importante",
    verificationDescription: "Revise cuidadosamente o endereço e o valor antes de enviar. As transações blockchain são irreversíveis.",
    nftVerificationDescription: "Revise cuidadosamente o endereço do contrato e o ID do token antes de enviar. As transferências de NFT são irreversíveis.",
    
    // Buttons
    sending: "Enviando...",
    send: "Enviar",
    sendEth: "Enviar ETH",
    sendMatic: "Enviar MATIC",
    sendTokens: "Enviar Tokens",
    sendNft: "Enviar NFT",
    
    // Wallet panel
    wallet: "Carteira WayBank",
    ethBalance: "Saldo ETH",
    maticBalance: "Saldo MATIC",
    erc20TokensLabel: "Tokens ERC20",
    noTokensFound: "Nenhum token ERC20 encontrado",
    
    // History panel
    transferHistory: "Histórico de Transferências",
    noTransfers: "Nenhuma transferência em seu histórico",
    pending: "Pendente",
    completed: "Concluído",
    failed: "Falhou",
    viewOnBlockExplorer: "Ver no explorador de blocos",
    from: "De",
    to: "Para",
    date: "Data",
    status: "Status",
    txHash: "Hash da transação"
  },
  ar: {
    // Header
    title: "التحويلات",
    description: "أرسل العملات المشفرة والرموز غير القابلة للاستبدال (NFTs) من محفظة WayBank الخاصة بك إلى أي عنوان.",
    readOnlyMode: "وضع القراءة فقط",
    limitedFunctionality: "وظائف محدودة",
    noActiveSession: "ليس لديك جلسة نشطة. يمكنك عرض الأرصدة، ولكن لا يمكنك إجراء تحويلات.",
    
    // Tab titles
    cryptocurrencies: "العملات المشفرة",
    nfts: "الرموز غير القابلة للاستبدال (NFTs)", // Or simply "NFTs" if preferred
    
    // Crypto transfer section
    sendCryptocurrencies: "إرسال العملات المشفرة",
    transferDescription: "تحويل ETH أو MATIC أو رموز ERC20 إلى عنوان آخر",
    selectNetwork: "اختر الشبكة",
    ethMatic: "ETH / MATIC",
    erc20Tokens: "رموز ERC20",
    
    // Form fields
    destinationAddress: "عنوان الوجهة",
    addressDescription: "عنوان محفظة الإيثيريوم التي سترسل الأموال إليها",
    amount: "المبلغ",
    amountDescription: "المبلغ المراد إرساله",
    useMax: "استخدام الحد الأقصى",
    
    // Token transfer
    tokenAddress: "عنوان الرمز",
    tokenAddressDescription: "عنوان عقد رمز ERC20",
    custom: "مخصص",
    tokenAmount: "المبلغ",
    tokenAmountDescription: "كمية الرموز المراد إرسالها",
    
    // NFT transfer section
    sendNFTs: "إرسال الرموز غير القابلة للاستبدال (NFTs)",
    nftTransferDescription: "تحويل NFTs (رموز ERC-721) إلى عنوان آخر",
    nftContractAddress: "عنوان عقد NFT",
    nftContractAddressDescription: "عنوان عقد NFT (ERC-721)",
    tokenId: "معرف الرمز",
    tokenIdDescription: "المعرف الفريد لـ NFT الذي ترغب في تحويله",
    
    // Alerts
    importantVerification: "تحقق مهم",
    verificationDescription: "راجع العنوان والمبلغ بعناية قبل الإرسال. معاملات البلوكشين لا رجعة فيها.",
    nftVerificationDescription: "راجع عنوان العقد ومعرف الرمز بعناية قبل الإرسال. تحويلات NFT لا رجعة فيها.",
    
    // Buttons
    sending: "جاري الإرسال...",
    send: "إرسال",
    sendEth: "إرسال ETH",
    sendMatic: "إرسال MATIC",
    sendTokens: "إرسال الرموز",
    sendNft: "إرسال NFT",
    
    // Wallet panel
    wallet: "محفظة WayBank",
    ethBalance: "رصيد ETH",
    maticBalance: "رصيد MATIC",
    erc20TokensLabel: "رموز ERC20",
    noTokensFound: "لم يتم العثور على رموز ERC20",
    
    // History panel
    transferHistory: "سجل التحويلات",
    noTransfers: "لا توجد تحويلات في سجلك",
    pending: "قيد الانتظار",
    completed: "مكتمل",
    failed: "فشل",
    viewOnBlockExplorer: "عرض على مستكشف الكتل",
    from: "من",
    to: "إلى",
    date: "التاريخ",
    status: "الحالة",
    txHash: "تجزئة المعاملة"
  },
  zh: {
    // Header
    title: "转账",
    description: "将加密货币和 NFT 从您的 WayBank 钱包发送到任何地址。",
    readOnlyMode: "只读模式",
    limitedFunctionality: "功能受限",
    noActiveSession: "您没有活跃会话。您可以查看余额，但无法进行转账。",
    
    // Tab titles
    cryptocurrencies: "加密货币",
    nfts: "NFT",
    
    // Crypto transfer section
    sendCryptocurrencies: "发送加密货币",
    transferDescription: "将 ETH、MATIC 或 ERC20 代币转账到另一个地址",
    selectNetwork: "选择网络",
    ethMatic: "ETH / MATIC",
    erc20Tokens: "ERC20 代币",
    
    // Form fields
    destinationAddress: "目标地址",
    addressDescription: "您将资金发送到的以太坊钱包地址",
    amount: "金额",
    amountDescription: "发送金额",
    useMax: "使用最大值",
    
    // Token transfer
    tokenAddress: "代币地址",
    tokenAddressDescription: "ERC20 代币合约地址",
    custom: "自定义",
    tokenAmount: "金额",
    tokenAmountDescription: "要发送的代币数量",
    
    // NFT transfer section
    sendNFTs: "发送 NFT",
    nftTransferDescription: "将 NFT（ERC-721 代币）转账到另一个地址",
    nftContractAddress: "NFT 合约地址",
    nftContractAddressDescription: "NFT 合约地址 (ERC-721)",
    tokenId: "代币 ID",
    tokenIdDescription: "您要转账的 NFT 的唯一 ID",
    
    // Alerts
    importantVerification: "重要验证",
    verificationDescription: "发送前请仔细检查地址和金额。区块链交易不可逆。",
    nftVerificationDescription: "发送前请仔细检查合约地址和代币 ID。NFT 转账不可逆。",
    
    // Buttons
    sending: "正在发送...",
    send: "发送",
    sendEth: "发送 ETH",
    sendMatic: "发送 MATIC",
    sendTokens: "发送代币",
    sendNft: "发送 NFT",
    
    // Wallet panel
    wallet: "WayBank 钱包",
    ethBalance: "ETH 余额",
    maticBalance: "MATIC 余额",
    erc20TokensLabel: "ERC20 代币",
    noTokensFound: "未找到 ERC20 代币",
    
    // History panel
    transferHistory: "转账历史",
    noTransfers: "您的历史记录中没有转账",
    pending: "待处理",
    completed: "已完成",
    failed: "失败",
    viewOnBlockExplorer: "在区块浏览器上查看",
    from: "从",
    to: "到",
    date: "日期",
    status: "状态",
    txHash: "交易哈希"
  },
  hi: {
    // Header
    title: "स्थानांतरण",
    description: "अपने वेपूल वॉलेट से किसी भी पते पर क्रिप्टोकरेंसी और एनएफटी भेजें।",
    readOnlyMode: "केवल पढ़ने का मोड",
    limitedFunctionality: "सीमित कार्यक्षमता",
    noActiveSession: "आपके पास कोई सक्रिय सत्र नहीं है। आप शेष राशि देख सकते हैं, लेकिन स्थानांतरण नहीं कर सकते।",
    
    // Tab titles
    cryptocurrencies: "क्रिप्टोकरेंसी",
    nfts: "एनएफटी",
    
    // Crypto transfer section
    sendCryptocurrencies: "क्रिप्टोकरेंसी भेजें",
    transferDescription: "ETH, MATIC या ERC20 टोकन को दूसरे पते पर स्थानांतरित करें",
    selectNetwork: "नेटवर्क चुनें",
    ethMatic: "ETH / MATIC",
    erc20Tokens: "ERC20 टोकन",
    
    // Form fields
    destinationAddress: "गंतव्य पता",
    addressDescription: "एथेरियम वॉलेट पता जिस पर आप फंड भेजेंगे",
    amount: "राशि",
    amountDescription: "भेजने की राशि",
    useMax: "अधिकतम उपयोग करें",
    
    // Token transfer
    tokenAddress: "टोकन पता",
    tokenAddressDescription: "ERC20 टोकन अनुबंध पता",
    custom: "कस्टम",
    tokenAmount: "राशि",
    tokenAmountDescription: "भेजने वाले टोकन की राशि",
    
    // NFT transfer section
    sendNFTs: "एनएफटी भेजें",
    nftTransferDescription: "एनएफटी (ERC-721 टोकन) को दूसरे पते पर स्थानांतरित करें",
    nftContractAddress: "एनएफटी अनुबंध पता",
    nftContractAddressDescription: "एनएफटी अनुबंध पता (ERC-721)",
    tokenId: "टोकन आईडी",
    tokenIdDescription: "उस एनएफटी की अद्वितीय आईडी जिसे आप स्थानांतरित करना चाहते हैं",
    
    // Alerts
    importantVerification: "महत्वपूर्ण सत्यापन",
    verificationDescription: "भेजने से पहले पते और राशि की सावधानीपूर्वक समीक्षा करें। ब्लॉकचेन लेनदेन अपरिवर्तनीय होते हैं।",
    nftVerificationDescription: "भेजने से पहले अनुबंध पते और टोकन आईडी की सावधानीपूर्वक समीक्षा करें। एनएफटी स्थानांतरण अपरिवर्तनीय होते हैं।",
    
    // Buttons
    sending: "भेज रहा है...",
    send: "भेजें",
    sendEth: "ETH भेजें",
    sendMatic: "MATIC भेजें",
    sendTokens: "टोकन भेजें",
    sendNft: "एनएफटी भेजें",
    
    // Wallet panel
    wallet: "वेपूल वॉलेट",
    ethBalance: "ETH बैलेंस",
    maticBalance: "MATIC बैलेंस",
    erc20TokensLabel: "ERC20 टोकन",
    noTokensFound: "कोई ERC20 टोकन नहीं मिला",
    
    // History panel
    transferHistory: "स्थानांतरण इतिहास",
    noTransfers: "आपके इतिहास में कोई स्थानांतरण नहीं है",
    pending: "लंबित",
    completed: "पूर्ण",
    failed: "विफल",
    viewOnBlockExplorer: "ब्लॉक एक्सप्लोरर पर देखें",
    from: "से",
    to: "को",
    date: "दिनांक",
    status: "स्थिति",
    txHash: "लेनदेन हैश"
  },
  ru: {
    // Header
    title: "Переводы",
    description: "Отправляйте криптовалюты и NFT из вашего кошелька WayBank на любой адрес.",
    readOnlyMode: "Режим только для чтения",
    limitedFunctionality: "Ограниченная функциональность",
    noActiveSession: "У вас нет активной сессии. Вы можете просматривать балансы, но не совершать переводы.",
    
    // Tab titles
    cryptocurrencies: "Криптовалюты",
    nfts: "NFT",
    
    // Crypto transfer section
    sendCryptocurrencies: "Отправить криптовалюты",
    transferDescription: "Перевести ETH, MATIC или токены ERC20 на другой адрес",
    selectNetwork: "Выберите сеть",
    ethMatic: "ETH / MATIC",
    erc20Tokens: "Токены ERC20",
    
    // Form fields
    destinationAddress: "Адрес назначения",
    addressDescription: "Адрес Ethereum-кошелька, на который вы будете отправлять средства",
    amount: "Сумма",
    amountDescription: "Сумма для отправки",
    useMax: "Использовать максимум",
    
    // Token transfer
    tokenAddress: "Адрес токена",
    tokenAddressDescription: "Адрес контракта токена ERC20",
    custom: "Пользовательский",
    tokenAmount: "Сумма",
    tokenAmountDescription: "Количество токенов для отправки",
    
    // NFT transfer section
    sendNFTs: "Отправить NFT",
    nftTransferDescription: "Перевести NFT (токены ERC-721) на другой адрес",
    nftContractAddress: "Адрес контракта NFT",
    nftContractAddressDescription: "Адрес контракта NFT (ERC-721)",
    tokenId: "ID токена",
    tokenIdDescription: "Уникальный ID NFT, который вы хотите перевести",
    
    // Alerts
    importantVerification: "Важная проверка",
    verificationDescription: "Внимательно проверьте адрес и сумму перед отправкой. Блокчейн-транзакции необратимы.",
    nftVerificationDescription: "Внимательно проверьте адрес контракта и ID токена перед отправкой. Переводы NFT необратимы.",
    
    // Buttons
    sending: "Отправка...",
    send: "Отправить",
    sendEth: "Отправить ETH",
    sendMatic: "Отправить MATIC",
    sendTokens: "Отправить токены",
    sendNft: "Отправить NFT",
    
    // Wallet panel
    wallet: "Кошелек WayBank",
    ethBalance: "Баланс ETH",
    maticBalance: "Баланс MATIC",
    erc20TokensLabel: "Токены ERC20",
    noTokensFound: "Токены ERC20 не найдены",
    
    // History panel
    transferHistory: "История переводов",
    noTransfers: "В вашей истории нет переводов",
    pending: "В ожидании",
    completed: "Завершено",
    failed: "Ошибка",
    viewOnBlockExplorer: "Просмотреть в обозревателе блоков",
    from: "От",
    to: "Кому",
    date: "Дата",
    status: "Статус",
    txHash: "Хеш транзакции"
  },
  fr: {
    // Header
    title: "Transferts",
    description: "Envoyez des cryptomonnaies et des NFT depuis votre portefeuille WayBank vers n'importe quelle adresse.",
    readOnlyMode: "Mode Lecture Seule",
    limitedFunctionality: "Fonctionnalité Limitée",
    noActiveSession: "Vous n'avez pas de session active. Vous pouvez consulter les soldes, mais pas effectuer de transferts.",
    
    // Tab titles
    cryptocurrencies: "Cryptomonnaies",
    nfts: "NFTs",
    
    // Crypto transfer section
    sendCryptocurrencies: "Envoyer des Cryptomonnaies",
    transferDescription: "Transférer des ETH, MATIC ou jetons ERC20 vers une autre adresse",
    selectNetwork: "Sélectionner le réseau",
    ethMatic: "ETH / MATIC",
    erc20Tokens: "Jetons ERC20",
    
    // Form fields
    destinationAddress: "Adresse de Destination",
    addressDescription: "Adresse du portefeuille Ethereum vers laquelle vous enverrez des fonds",
    amount: "Montant",
    amountDescription: "Montant à envoyer",
    useMax: "Utiliser le Maximum",
    
    // Token transfer
    tokenAddress: "Adresse du Jeton",
    tokenAddressDescription: "Adresse du contrat du jeton ERC20",
    custom: "Personnalisé",
    tokenAmount: "Montant",
    tokenAmountDescription: "Montant de jetons à envoyer",
    
    // NFT transfer section
    sendNFTs: "Envoyer des NFTs",
    nftTransferDescription: "Transférer des NFTs (jetons ERC-721) vers une autre adresse",
    nftContractAddress: "Adresse du Contrat NFT",
    nftContractAddressDescription: "Adresse du contrat NFT (ERC-721)",
    tokenId: "ID du Jeton",
    tokenIdDescription: "ID unique du NFT que vous souhaitez transférer",
    
    // Alerts
    importantVerification: "Vérification Importante",
    verificationDescription: "Vérifiez attentivement l'adresse et le montant avant d'envoyer. Les transactions blockchain sont irréversibles.",
    nftVerificationDescription: "Vérifiez attentivement l'adresse du contrat et l'ID du jeton avant d'envoyer. Les transferts de NFT sont irréversibles.",
    
    // Buttons
    sending: "Envoi en cours...",
    send: "Envoyer",
    sendEth: "Envoyer ETH",
    sendMatic: "Envoyer MATIC",
    sendTokens: "Envoyer des Jetons",
    sendNft: "Envoyer NFT",
    
    // Wallet panel
    wallet: "Portefeuille WayBank",
    ethBalance: "Solde ETH",
    maticBalance: "Solde MATIC",
    erc20TokensLabel: "Jetons ERC20",
    noTokensFound: "Aucun jeton ERC20 trouvé",
    
    // History panel
    transferHistory: "Historique des Transferts",
    noTransfers: "Aucun transfert dans votre historique",
    pending: "En attente",
    completed: "Complété",
    failed: "Échoué",
    viewOnBlockExplorer: "Voir sur l'explorateur de blocs",
    from: "De",
    to: "À",
    date: "Date",
    status: "Statut",
    txHash: "Hash de transaction"
  },
  de: {
    // Header
    title: "Überweisungen",
    description: "Senden Sie Kryptowährungen und NFTs von Ihrer WayBank-Wallet an jede Adresse.",
    readOnlyMode: "Nur-Lese-Modus",
    limitedFunctionality: "Eingeschränkte Funktionalität",
    noActiveSession: "Sie haben keine aktive Sitzung. Sie können Guthaben einsehen, aber keine Überweisungen durchführen.",
    
    // Tab titles
    cryptocurrencies: "Kryptowährungen",
    nfts: "NFTs",
    
    // Crypto transfer section
    sendCryptocurrencies: "Kryptowährungen senden",
    transferDescription: "ETH, MATIC oder ERC20-Token an eine andere Adresse übertragen",
    selectNetwork: "Netzwerk auswählen",
    ethMatic: "ETH / MATIC",
    erc20Tokens: "ERC20-Token",
    
    // Form fields
    destinationAddress: "Zieladresse",
    addressDescription: "Ethereum-Wallet-Adresse, an die Sie Gelder senden werden",
    amount: "Betrag",
    amountDescription: "Zu sendender Betrag",
    useMax: "Maximum verwenden",
    
    // Token transfer
    tokenAddress: "Token-Adresse",
    tokenAddressDescription: "ERC20-Token-Vertragsadresse",
    custom: "Benutzerdefiniert",
    tokenAmount: "Betrag",
    tokenAmountDescription: "Anzahl der zu sendenden Token",
    
    // NFT transfer section
    sendNFTs: "NFTs senden",
    nftTransferDescription: "NFTs (ERC-721-Token) an eine andere Adresse übertragen",
    nftContractAddress: "NFT-Vertragsadresse",
    nftContractAddressDescription: "NFT-Vertragsadresse (ERC-721)",
    tokenId: "Token-ID",
    tokenIdDescription: "Eindeutige ID des NFT, das Sie übertragen möchten",
    
    // Alerts
    importantVerification: "Wichtige Überprüfung",
    verificationDescription: "Überprüfen Sie sorgfältig die Adresse und den Betrag vor dem Senden. Blockchain-Transaktionen sind irreversibel.",
    nftVerificationDescription: "Überprüfen Sie sorgfältig die Vertragsadresse und Token-ID vor dem Senden. NFT-Übertragungen sind irreversibel.",
    
    // Buttons
    sending: "Senden...",
    send: "Senden",
    sendEth: "ETH senden",
    sendMatic: "MATIC senden",
    sendTokens: "Token senden",
    sendNft: "NFT senden",
    
    // Wallet panel
    wallet: "WayBank-Wallet",
    ethBalance: "ETH-Guthaben",
    maticBalance: "MATIC-Guthaben",
    erc20TokensLabel: "ERC20-Token",
    noTokensFound: "Keine ERC20-Token gefunden",
    
    // History panel
    transferHistory: "Überweisungsverlauf",
    noTransfers: "Keine Überweisungen in Ihrem Verlauf",
    pending: "Ausstehend",
    completed: "Abgeschlossen",
    failed: "Fehlgeschlagen",
    viewOnBlockExplorer: "Im Block-Explorer anzeigen",
    from: "Von",
    to: "An",
    date: "Datum",
    status: "Status",
    txHash: "Transaktions-Hash"
  }
};