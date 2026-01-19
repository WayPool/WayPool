/**
 * Traducciones para la calculadora de perfiles de riesgo
 * Todas las traducciones relacionadas con la calculadora interactiva de perfiles de riesgo
 */

interface RiskCalculatorTranslations {
  // Títulos y subtítulos
  riskCalculatorTitle: string;
  riskCalculatorSubtitle: string;

  // Perfiles de riesgo
  conservativeProfile: string;
  moderateProfile: string;
  aggressiveProfile: string;

  // Escenarios
  worstCaseScenario: string;
  bestCaseScenario: string;

  // Descripciones de cada perfil
  conservativeDescription: string;
  moderateDescription: string;
  aggressiveDescription: string;

  // Descripciones de escenarios
  worstCaseDescription: string;
  bestCaseDescription: string;

  // Advertencia de riesgo
  riskDisclaimerTitle: string;
  riskDisclaimerText: string;
}

export const riskCalculatorTranslations: Record<string, RiskCalculatorTranslations> = {
  es: {
    riskCalculatorTitle: "Calcula tu perfil de riesgo",
    riskCalculatorSubtitle: "Elige el perfil que mejor se adapte a tus objetivos de inversión",

    conservativeProfile: "Conservador",
    moderateProfile: "Moderado",
    aggressiveProfile: "Agresivo",

    worstCaseScenario: "Escenario pesimista",
    bestCaseScenario: "Escenario optimista",

    conservativeDescription: "Minimiza el riesgo con exposición limitada a la volatilidad. Ideal para inversores que priorizan la preservación del capital.",
    moderateDescription: "Equilibra riesgo y recompensa con exposición moderada a la volatilidad. Para inversores con tolerancia media al riesgo.",
    aggressiveDescription: "Maximiza las ganancias potenciales con mayor exposición a la volatilidad. Para inversores dispuestos a asumir mayores riesgos.",

    worstCaseDescription: "Pérdida máxima estimada en condiciones de mercado volátiles.",
    bestCaseDescription: "Ganancia máxima estimada en condiciones de mercado óptimas.",

    riskDisclaimerTitle: "Aviso importante",
    riskDisclaimerText: "Los escenarios presentados son estimaciones basadas en condiciones normales de mercado. El mercado de criptomonedas es altamente volátil y los rendimientos reales pueden variar significativamente. Los rendimientos pasados no garantizan resultados futuros. Antes de invertir, considera tu perfil de riesgo y realiza tu propia investigación."
  },

  ru: {
    riskCalculatorTitle: "Рассчитайте свой профиль риска",
    riskCalculatorSubtitle: "Выберите профиль, который наилучшим образом соответствует вашим инвестиционным целям",

    conservativeProfile: "Консервативный",
    moderateProfile: "Умеренный",
    aggressiveProfile: "Агрессивный",

    worstCaseScenario: "Наихудший сценарий",
    bestCaseScenario: "Наилучший сценарий",

    conservativeDescription: "Минимизирует риск с ограниченным воздействием волатильности. Идеально подходит для инвесторов, которые отдают приоритет сохранению капитала.",
    moderateDescription: "Балансирует риск и вознаграждение с умеренным воздействием волатильности. Для инвесторов со средней толерантностью к риску.",
    aggressiveDescription: "Максимизирует потенциальную прибыль с большим воздействием волатильности. Для инвесторов, готовых взять на себя более высокие риски.",

    worstCaseDescription: "Расчетный максимальный убыток в условиях нестабильного рынка.",
    bestCaseDescription: "Расчетная максимальная прибыль в оптимальных рыночных условиях.",

    riskDisclaimerTitle: "Важное примечание",
    riskDisclaimerText: "Представленные сценарии являются оценками, основанными на нормальных рыночных условиях. Рынок криптовалют очень волатилен, и фактическая доходность может значительно отличаться. Прошлая доходность не гарантирует будущих результатов. Перед инвестированием рассмотрите свой профиль риска и проведите собственное исследование."
  },

  en: {
    riskCalculatorTitle: "Calculate your risk profile",
    riskCalculatorSubtitle: "Choose the profile that best suits your investment goals",

    conservativeProfile: "Conservative",
    moderateProfile: "Moderate",
    aggressiveProfile: "Aggressive",

    worstCaseScenario: "Worst case scenario",
    bestCaseScenario: "Best case scenario",

    conservativeDescription: "Minimizes risk with limited exposure to volatility. Ideal for investors who prioritize capital preservation.",
    moderateDescription: "Balances risk and reward with moderate exposure to volatility. For investors with medium risk tolerance.",
    aggressiveDescription: "Maximizes potential gains with greater exposure to volatility. For investors willing to take higher risks.",

    worstCaseDescription: "Estimated maximum loss under volatile market conditions.",
    bestCaseDescription: "Estimated maximum gain under optimal market conditions.",

    riskDisclaimerTitle: "Important notice",
    riskDisclaimerText: "The scenarios presented are estimates based on normal market conditions. The cryptocurrency market is highly volatile and actual returns may vary significantly. Past returns do not guarantee future results. Before investing, consider your risk profile and do your own research."
  },

  pt: {
    riskCalculatorTitle: "Calcule seu perfil de risco",
    riskCalculatorSubtitle: "Escolha o perfil que melhor se adapta aos seus objetivos de investimento",

    conservativeProfile: "Conservador",
    moderateProfile: "Moderado",
    aggressiveProfile: "Agressivo",

    worstCaseScenario: "Cenário pessimista",
    bestCaseScenario: "Cenário otimista",

    conservativeDescription: "Minimiza o risco com exposição limitada à volatilidade. Ideal para investidores que priorizam a preservação de capital.",
    moderateDescription: "Equilibra risco e recompensa com exposição moderada à volatilidade. Para investidores com tolerância média ao risco.",
    aggressiveDescription: "Maximiza os ganhos potenciais com maior exposição à volatilidade. Para investidores dispostos a assumir maiores riscos.",

    worstCaseDescription: "Perda máxima estimada sob condições de mercado voláteis.",
    bestCaseDescription: "Ganho máximo estimado sob condições de mercado ideais.",

    riskDisclaimerTitle: "Aviso importante",
    riskDisclaimerText: "Os cenários apresentados são estimativas baseadas em condições normais de mercado. O mercado de criptomoedas é altamente volátil e os retornos reais podem variar significativamente. Retornos passados não garantem resultados futuros. Antes de investir, considere seu perfil de risco e faça sua própria pesquisa."
  },

  ar: {
    riskCalculatorTitle: "حساب ملف المخاطر الخاص بك",
    riskCalculatorSubtitle: "اختر الملف الذي يناسب أهداف الاستثمار الخاصة بك",

    conservativeProfile: "محافظ",
    moderateProfile: "معتدل",
    aggressiveProfile: "عدواني",

    worstCaseScenario: "السيناريو الأسوأ",
    bestCaseScenario: "السيناريو الأفضل",

    conservativeDescription: "يقلل المخاطر مع التعرض المحدود للتقلبات. مثالي للمستثمرين الذين يعطون الأولوية للحفاظ على رأس المال.",
    moderateDescription: "يوازن بين المخاطرة والمكافأة مع التعرض المعتدل للتقلبات. للمستثمرين ذوي القدرة المتوسطة على تحمل المخاطر.",
    aggressiveDescription: "يزيد المكاسب المحتملة مع زيادة التعرض للتقلبات. للمستثمرين الراغبين في تحمل مخاطر أعلى.",

    worstCaseDescription: "الخسارة القصوى المقدرة في ظل ظروف السوق المتقلبة.",
    bestCaseDescription: "الربح الأقصى المقدر في ظل ظروف السوق المثالية.",

    riskDisclaimerTitle: "إشعار هام",
    riskDisclaimerText: "السيناريوهات المقدمة هي تقديرات بناءً على ظروف السوق العادية. سوق العملات المشفرة متقلب للغاية وقد تختلف العوائد الفعلية بشكل كبير. العوائد السابقة لا تضمن النتائج المستقبلية. قبل الاستثمار، ضع في اعتبارك ملف المخاطر الخاص بك وقم بإجراء بحثك الخاص."
  },

  it: {
    riskCalculatorTitle: "Calcola il tuo profilo di rischio",
    riskCalculatorSubtitle: "Scegli il profilo che meglio si adatta ai tuoi obiettivi di investimento",

    conservativeProfile: "Conservativo",
    moderateProfile: "Moderato",
    aggressiveProfile: "Aggressivo",

    worstCaseScenario: "Scenario pessimistico",
    bestCaseScenario: "Scenario ottimistico",

    conservativeDescription: "Minimizza il rischio con un'esposizione limitata alla volatilità. Ideale per gli investitori che danno priorità alla conservazione del capitale.",
    moderateDescription: "Bilancia rischio e rendimento con un'esposizione moderata alla volatilità. Per investitori con tolleranza media al rischio.",
    aggressiveDescription: "Massimizza i guadagni potenziali con una maggiore esposizione alla volatilità. Per investitori disposti ad assumere rischi più elevati.",

    worstCaseDescription: "Perdita massima stimata in condizioni di mercato volatili.",
    bestCaseDescription: "Guadagno massimo stimato in condizioni di mercato ottimali.",

    riskDisclaimerTitle: "Avviso importante",
    riskDisclaimerText: "Gli scenari presentati sono stime basate su condizioni di mercato normali. Il mercato delle criptovalute è altamente volatile e i rendimenti effettivi possono variare in modo significativo. I rendimenti passati non garantiscono risultati futuri. Prima di investire, considera il tuo profilo di rischio e conduci la tua ricerca."
  },

  fr: {
    riskCalculatorTitle: "Calculez votre profil de risque",
    riskCalculatorSubtitle: "Choisissez le profil qui correspond le mieux à vos objectifs d'investissement",

    conservativeProfile: "Conservateur",
    moderateProfile: "Modéré",
    aggressiveProfile: "Agressif",

    worstCaseScenario: "Scénario pessimiste",
    bestCaseScenario: "Scénario optimiste",

    conservativeDescription: "Minimise le risque avec une exposition limitée à la volatilité. Idéal pour les investisseurs qui privilégient la préservation du capital.",
    moderateDescription: "Équilibre risque et récompense avec une exposition modérée à la volatilité. Pour les investisseurs ayant une tolérance moyenne au risque.",
    aggressiveDescription: "Maximise les gains potentiels avec une plus grande exposition à la volatilité. Pour les investisseurs prêts à prendre des risques plus élevés.",

    worstCaseDescription: "Perte maximale estimée dans des conditions de marché volatiles.",
    bestCaseDescription: "Gain maximal estimé dans des conditions de marché optimales.",

    riskDisclaimerTitle: "Avis important",
    riskDisclaimerText: "Les scénarios présentés sont des estimations basées sur des conditions normales de marché. Le marché des cryptomonnaies est très volatile et les rendements réels peuvent varier considérablement. Les rendements passés ne garantissent pas les résultats futurs. Avant d'investir, tenez compte de votre profil de risque et faites vos propres recherches."
  },

  de: {
    riskCalculatorTitle: "Berechnen Sie Ihr Risikoprofil",
    riskCalculatorSubtitle: "Wählen Sie das Profil, das am besten zu Ihren Anlagezielen passt",

    conservativeProfile: "Konservativ",
    moderateProfile: "Moderat",
    aggressiveProfile: "Aggressiv",

    worstCaseScenario: "Pessimistisches Szenario",
    bestCaseScenario: "Optimistisches Szenario",

    conservativeDescription: "Minimiert das Risiko mit begrenzter Volatilitätsexposition. Ideal für Anleger, die Kapitalerhalt priorisieren.",
    moderateDescription: "Balanciert Risiko und Ertrag mit moderater Volatilitätsexposition. Für Anleger mit mittlerer Risikotoleranz.",
    aggressiveDescription: "Maximiert potenzielle Gewinne mit höherer Volatilitätsexposition. Für Anleger, die bereit sind, höhere Risiken einzugehen.",

    worstCaseDescription: "Geschätzter maximaler Verlust unter volatilen Marktbedingungen.",
    bestCaseDescription: "Geschätzter maximaler Gewinn unter optimalen Marktbedingungen.",

    riskDisclaimerTitle: "Wichtiger Hinweis",
    riskDisclaimerText: "Die dargestellten Szenarien sind Schätzungen basierend auf normalen Marktbedingungen. Der Kryptowährungsmarkt ist sehr volatil, und die tatsächlichen Renditen können erheblich variieren. Vergangene Renditen garantieren keine zukünftigen Ergebnisse. Bevor Sie investieren, berücksichtigen Sie Ihr Risikoprofil und führen Sie Ihre eigene Recherche durch."
  },

  hi: {
    riskCalculatorTitle: "अपना जोखिम प्रोफाइल की गणना करें",
    riskCalculatorSubtitle: "वह प्रोफाइल चुनें जो आपके निवेश लक्ष्यों के लिए सबसे उपयुक्त हो",

    conservativeProfile: "रूढ़िवादी",
    moderateProfile: "मध्यम",
    aggressiveProfile: "आक्रामक",

    worstCaseScenario: "सबसे खराब स्थिति",
    bestCaseScenario: "सबसे अच्छी स्थिति",

    conservativeDescription: "अस्थिरता के सीमित जोखिम के साथ जोखिम को कम करता है। उन निवेशकों के लिए आदर्श जो पूंजी संरक्षण को प्राथमिकता देते हैं।",
    moderateDescription: "मध्यम अस्थिरता के जोखिम के साथ जोखिम और पुरस्कार को संतुलित करता है। मध्यम जोखिम सहनशीलता वाले निवेशकों के लिए।",
    aggressiveDescription: "उच्च जोखिम लेने के इच्छुक निवेशकों के लिए अधिक अस्थिरता के जोखिम के साथ संभावित लाभ को अधिकतम करता है।",

    worstCaseDescription: "अस्थिर बाजार स्थितियों के तहत अनुमानित अधिकतम हानि।",
    bestCaseDescription: "इष्टतम बाजार स्थितियों के तहत अनुमानित अधिकतम लाभ।",

    riskDisclaimerTitle: "महत्वपूर्ण सूचना",
    riskDisclaimerText: "प्रस्तुत परिदृश्य सामान्य बाजार स्थितियों पर आधारित अनुमान हैं। क्रिप्टोकरेंसी बाजार अत्यधिक अस्थिर है और वास्तविक रिटर्न काफी भिन्न हो सकते हैं। पिछले रिटर्न भविष्य के परिणामों की गारंटी नहीं देते हैं। निवेश करने से पहले, अपने जोखिम प्रोफाइल पर विचार करें और अपना स्वयं का शोध करें।"
  },

  zh: {
    riskCalculatorTitle: "计算您的风险状况",
    riskCalculatorSubtitle: "选择最适合您投资目标的状况",

    conservativeProfile: "保守型",
    moderateProfile: "稳健型",
    aggressiveProfile: "激进型",

    worstCaseScenario: "最坏情况",
    bestCaseScenario: "最佳情况",

    conservativeDescription: "通过有限的波动暴露来最小化风险。适合优先考虑资本保值的投资者。",
    moderateDescription: "通过适度的波动暴露来平衡风险和回报。适合具有中等风险承受能力的投资者。",
    aggressiveDescription: "通过更大的波动暴露来最大化潜在收益。适合愿意承担更高风险的投资者。",

    worstCaseDescription: "在波动市场条件下的估计最大损失。",
    bestCaseDescription: "在理想市场条件下的估计最大收益。",

    riskDisclaimerTitle: "重要提示",
    riskDisclaimerText: "所呈现的情景是基于正常市场条件的估计。加密货币市场波动性很大，实际回报可能会有显著差异。过去的回报不保证未来的结果。在投资之前，请考虑您的风险状况并进行自己的研究。"
  }
};