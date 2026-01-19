import { Language } from "../../client/src/hooks/use-translation";
import {
  wrapEmail,
  getEmailHeader,
  getButton,
  COLORS,
  COMPANY_INFO,
  URLS
} from "./email-base";

interface EmailTemplate {
  subject: string;
  html: string;
}

// Constante para el nombre de la aplicación
const APP_NAME = "WayPool";

// Translations for multi-language support
const translations: Record<Language, {
  subject: string;
  greeting: string;
  greetingWithName: string;
  intro: string;
  description: string;
  codeLabel: string;
  howToStart: string;
  step1: string;
  step2: string;
  step3: string;
  step4: string;
  questions: string;
  buttonText: string;
  closing: string;
  team: string;
}> = {
  en: {
    subject: `Welcome to the ${APP_NAME} Referral Program!`,
    greeting: "Hello",
    greetingWithName: "Hello",
    intro: "Thank you for subscribing to our referral program! We're excited to have you on board.",
    description: `${APP_NAME} offers you a unique opportunity to earn commissions by referring investors to our platform. With our automated investment strategies in Uniswap pools, you can provide real value to your network.`,
    codeLabel: "Your referral code",
    howToStart: "How to get started",
    step1: "Visit our referral program page to learn more",
    step2: "Share your referral code with potential investors",
    step3: "Track your earnings in your dashboard",
    step4: "Receive commissions every time your referrals generate fees",
    questions: "If you have any questions or need assistance, feel free to contact us.",
    buttonText: "Access Your Dashboard",
    closing: "Best regards,",
    team: `The ${APP_NAME} Team`
  },
  es: {
    subject: `¡Bienvenido al Programa de Referidos de ${APP_NAME}!`,
    greeting: "Hola",
    greetingWithName: "Hola",
    intro: "¡Gracias por suscribirte a nuestro programa de referidos! Estamos emocionados de tenerte a bordo.",
    description: `${APP_NAME} te ofrece una oportunidad única para ganar comisiones refiriendo inversores a nuestra plataforma. Con nuestras estrategias de inversión automatizadas en pools de Uniswap, puedes proporcionar un valor real a tu red.`,
    codeLabel: "Tu código de referido",
    howToStart: "Cómo empezar",
    step1: "Visita nuestra página del programa de referidos para saber más",
    step2: "Comparte tu código de referido con potenciales inversores",
    step3: "Haz seguimiento de tus ganancias en tu dashboard",
    step4: "Recibe comisiones cada vez que tus referidos generen comisiones",
    questions: "Si tienes alguna pregunta o necesitas ayuda, no dudes en contactarnos.",
    buttonText: "Acceder a tu Dashboard",
    closing: "Saludos cordiales,",
    team: `El Equipo de ${APP_NAME}`
  },
  de: {
    subject: `Willkommen beim ${APP_NAME}-Partnerprogramm!`,
    greeting: "Hallo",
    greetingWithName: "Hallo",
    intro: "Vielen Dank für Ihr Interesse an unserem Partnerprogramm! Wir freuen uns, Sie an Bord zu haben.",
    description: `${APP_NAME} bietet Ihnen die einzigartige Möglichkeit, Provisionen zu verdienen, indem Sie Investoren auf unsere Plattform verweisen. Mit unseren automatisierten Anlagestrategien in Uniswap-Pools können Sie Ihrem Netzwerk einen echten Mehrwert bieten.`,
    codeLabel: "Ihr Empfehlungscode",
    howToStart: "So starten Sie",
    step1: "Besuchen Sie unsere Partnerprogramm-Seite für weitere Informationen",
    step2: "Teilen Sie Ihren Empfehlungscode mit potenziellen Investoren",
    step3: "Verfolgen Sie Ihre Einnahmen in Ihrem Dashboard",
    step4: "Erhalten Sie Provisionen, wenn Ihre Empfehlungen Gebühren generieren",
    questions: "Wenn Sie Fragen haben oder Hilfe benötigen, kontaktieren Sie uns.",
    buttonText: "Zugang zum Dashboard",
    closing: "Mit freundlichen Grüßen,",
    team: `Das ${APP_NAME}-Team`
  },
  fr: {
    subject: `Bienvenue au Programme de Parrainage ${APP_NAME}!`,
    greeting: "Bonjour",
    greetingWithName: "Bonjour",
    intro: "Merci de vous être inscrit à notre programme de parrainage! Nous sommes ravis de vous compter parmi nous.",
    description: `${APP_NAME} vous offre une opportunité unique de gagner des commissions en parrainant des investisseurs sur notre plateforme. Avec nos stratégies d'investissement automatisées dans les pools Uniswap, vous pouvez apporter une réelle valeur à votre réseau.`,
    codeLabel: "Votre code de parrainage",
    howToStart: "Comment commencer",
    step1: "Visitez notre page du programme de parrainage pour en savoir plus",
    step2: "Partagez votre code de parrainage avec des investisseurs potentiels",
    step3: "Suivez vos gains dans votre tableau de bord",
    step4: "Recevez des commissions chaque fois que vos filleuls génèrent des frais",
    questions: "Si vous avez des questions ou besoin d'aide, n'hésitez pas à nous contacter.",
    buttonText: "Accéder à votre tableau de bord",
    closing: "Cordialement,",
    team: `L'équipe ${APP_NAME}`
  },
  it: {
    subject: `Benvenuto al Programma di Referral ${APP_NAME}!`,
    greeting: "Ciao",
    greetingWithName: "Ciao",
    intro: "Grazie per esserti iscritto al nostro programma di referral! Siamo entusiasti di averti con noi.",
    description: `${APP_NAME} ti offre un'opportunità unica di guadagnare commissioni indirizzando investitori alla nostra piattaforma. Con le nostre strategie di investimento automatizzate nei pool Uniswap, puoi offrire un valore reale alla tua rete.`,
    codeLabel: "Il tuo codice referral",
    howToStart: "Come iniziare",
    step1: "Visita la nostra pagina del programma di referral per saperne di più",
    step2: "Condividi il tuo codice referral con potenziali investitori",
    step3: "Monitora i tuoi guadagni nella dashboard",
    step4: "Ricevi commissioni ogni volta che i tuoi referral generano commissioni",
    questions: "Se hai domande o hai bisogno di assistenza, non esitare a contattarci.",
    buttonText: "Accedi alla tua Dashboard",
    closing: "Cordiali saluti,",
    team: `Il Team ${APP_NAME}`
  },
  pt: {
    subject: `Bem-vindo ao Programa de Indicação do ${APP_NAME}!`,
    greeting: "Olá",
    greetingWithName: "Olá",
    intro: "Obrigado por se inscrever em nosso programa de indicação! Estamos muito felizes em tê-lo conosco.",
    description: `O ${APP_NAME} oferece a você uma oportunidade única de ganhar comissões indicando investidores para nossa plataforma. Com nossas estratégias de investimento automatizadas em pools da Uniswap, você pode fornecer valor real à sua rede.`,
    codeLabel: "Seu código de indicação",
    howToStart: "Como começar",
    step1: "Visite nossa página do programa de indicação para saber mais",
    step2: "Compartilhe seu código de indicação com potenciais investidores",
    step3: "Acompanhe seus ganhos em seu painel",
    step4: "Receba comissões sempre que seus indicados gerarem taxas",
    questions: "Se você tiver alguma dúvida ou precisar de ajuda, entre em contato conosco.",
    buttonText: "Acessar seu Painel",
    closing: "Atenciosamente,",
    team: `A Equipe ${APP_NAME}`
  },
  ar: {
    subject: `مرحبًا بك في برنامج الإحالة من ${APP_NAME}!`,
    greeting: "مرحبًا",
    greetingWithName: "مرحبًا",
    intro: "شكرا لاشتراكك في برنامج الإحالة لدينا! نحن متحمسون لانضمامك إلينا.",
    description: `يقدم ${APP_NAME} لك فرصة فريدة لكسب العمولات من خلال إحالة المستثمرين إلى منصتنا. مع استراتيجيات الاستثمار الآلي لدينا في مجمعات Uniswap، يمكنك تقديم قيمة حقيقية لشبكتك.`,
    codeLabel: "رمز الإحالة الخاص بك",
    howToStart: "كيفية البدء",
    step1: "قم بزيارة صفحة برنامج الإحالة لمعرفة المزيد",
    step2: "شارك رمز الإحالة الخاص بك مع المستثمرين المحتملين",
    step3: "تتبع أرباحك في لوحة التحكم الخاصة بك",
    step4: "استلم العمولات في كل مرة ينتج فيها المحالون رسومًا",
    questions: "إذا كان لديك أي أسئلة أو تحتاج إلى مساعدة، فلا تتردد في الاتصال بنا.",
    buttonText: "الوصول إلى لوحة التحكم",
    closing: "مع أطيب التحيات،",
    team: `فريق ${APP_NAME}`
  },
  zh: {
    subject: `欢迎加入${APP_NAME}推荐计划！`,
    greeting: "您好",
    greetingWithName: "您好",
    intro: "感谢您订阅我们的推荐计划！我们很高兴您能加入我们。",
    description: `${APP_NAME}为您提供了通过推荐投资者到我们的平台来赚取佣金的独特机会。凭借我们在Uniswap矿池中的自动投资策略，您可以为您的网络提供真正的价值。`,
    codeLabel: "您的推荐代码",
    howToStart: "如何开始",
    step1: "访问我们的推荐计划页面了解更多",
    step2: "与潜在投资者分享您的推荐代码",
    step3: "在您的仪表板中跟踪您的收益",
    step4: "每当您的推荐人产生费用时，您都会收到佣金",
    questions: "如果您有任何问题或需要帮助，请随时联系我们。",
    buttonText: "访问您的仪表板",
    closing: "此致，",
    team: `${APP_NAME}团队`
  },
  hi: {
    subject: `${APP_NAME} रेफरल प्रोग्राम में आपका स्वागत है!`,
    greeting: "नमस्ते",
    greetingWithName: "नमस्ते",
    intro: "हमारे रेफरल प्रोग्राम की सदस्यता लेने के लिए धन्यवाद! हम आपको अपने साथ पाकर उत्साहित हैं।",
    description: `${APP_NAME} आपको हमारे प्लेटफॉर्म पर निवेशकों को रेफर करके कमीशन कमाने का एक अनूठा अवसर प्रदान करता है। Uniswap पूल में हमारी स्वचालित निवेश रणनीतियों के साथ, आप अपने नेटवर्क को वास्तविक मूल्य प्रदान कर सकते हैं।`,
    codeLabel: "आपका रेफरल कोड",
    howToStart: "शुरू कैसे करें",
    step1: "अधिक जानने के लिए हमारे रेफरल प्रोग्राम पेज पर जाएं",
    step2: "संभावित निवेशकों के साथ अपना रेफरल कोड साझा करें",
    step3: "अपने डैशबोर्ड में अपनी कमाई को ट्रैक करें",
    step4: "जब भी आपके रेफरल शुल्क उत्पन्न करते हैं, कमीशन प्राप्त करें",
    questions: "यदि आपके कोई प्रश्न हैं या सहायता की आवश्यकता है, तो हमसे संपर्क करें।",
    buttonText: "अपने डैशबोर्ड तक पहुंचें",
    closing: "सादर,",
    team: `${APP_NAME} टीम`
  }
};

/**
 * Genera la plantilla HTML para el correo de bienvenida al programa de referidos
 * según el idioma seleccionado con diseño profesional y footer legal
 *
 * @param language Idioma de la plantilla
 * @param referralCode Código de referido (opcional)
 * @param name Nombre del suscriptor (opcional)
 * @returns Objeto con asunto y cuerpo HTML del correo
 */
export function getReferralWelcomeTemplate(
  language: Language = "es",
  referralCode: string = "",
  name?: string | null
): EmailTemplate {
  const baseUrl = URLS.website;
  const dashboardUrl = `${baseUrl}/dashboard`;
  const referralUrl = `${baseUrl}/public-referrals`;

  // Get translations for the language
  const t = translations[language] || translations.es;

  // Personalize greeting
  const greeting = name ? `${t.greetingWithName} ${name},` : `${t.greeting},`;

  // RTL support for Arabic
  const isRTL = language === 'ar';
  const dirAttr = isRTL ? 'dir="rtl"' : '';

  const content = `
    ${getEmailHeader(APP_NAME, "Referral Program")}
    <tr>
      <td style="padding: 32px 24px;" ${dirAttr}>
        <!-- Greeting -->
        <h2 style="color: ${COLORS.text}; font-size: 22px; margin: 0 0 16px 0; font-weight: 600;">
          ${greeting}
        </h2>

        <!-- Intro -->
        <p style="color: ${COLORS.text}; font-size: 15px; line-height: 1.6; margin: 0 0 16px 0;">
          ${t.intro}
        </p>

        <!-- Description -->
        <p style="color: ${COLORS.textMuted}; font-size: 14px; line-height: 1.6; margin: 0 0 24px 0;">
          ${t.description}
        </p>

        ${referralCode ? `
        <!-- Referral Code Card -->
        <div style="background: linear-gradient(135deg, ${COLORS.primary}20 0%, ${COLORS.primaryDark}20 100%); border: 1px solid ${COLORS.primary}40; border-radius: 12px; padding: 24px; margin: 24px 0; text-align: center;">
          <p style="color: ${COLORS.textMuted}; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 8px 0;">
            ${t.codeLabel}
          </p>
          <p style="color: ${COLORS.primary}; font-size: 32px; font-weight: 700; margin: 0; letter-spacing: 2px; font-family: monospace;">
            ${referralCode}
          </p>
        </div>
        ` : ''}

        <!-- How to Start Section -->
        <div style="background-color: ${COLORS.darkCard}; border-radius: 8px; padding: 20px; margin: 24px 0;">
          <h3 style="color: ${COLORS.text}; font-size: 16px; margin: 0 0 16px 0; font-weight: 600;">
            ${t.howToStart}
          </h3>
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="padding: 8px 0;">
                <table cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="width: 28px; vertical-align: top;">
                      <div style="width: 24px; height: 24px; background: ${COLORS.primary}; border-radius: 50%; text-align: center; line-height: 24px; color: white; font-size: 12px; font-weight: 600;">1</div>
                    </td>
                    <td style="color: ${COLORS.textMuted}; font-size: 14px; padding-left: 12px;">
                      <a href="${referralUrl}" style="color: ${COLORS.primary}; text-decoration: none;">${t.step1}</a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding: 8px 0;">
                <table cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="width: 28px; vertical-align: top;">
                      <div style="width: 24px; height: 24px; background: ${COLORS.primary}; border-radius: 50%; text-align: center; line-height: 24px; color: white; font-size: 12px; font-weight: 600;">2</div>
                    </td>
                    <td style="color: ${COLORS.textMuted}; font-size: 14px; padding-left: 12px;">
                      ${t.step2}
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding: 8px 0;">
                <table cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="width: 28px; vertical-align: top;">
                      <div style="width: 24px; height: 24px; background: ${COLORS.primary}; border-radius: 50%; text-align: center; line-height: 24px; color: white; font-size: 12px; font-weight: 600;">3</div>
                    </td>
                    <td style="color: ${COLORS.textMuted}; font-size: 14px; padding-left: 12px;">
                      ${t.step3}
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding: 8px 0;">
                <table cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="width: 28px; vertical-align: top;">
                      <div style="width: 24px; height: 24px; background: ${COLORS.success}; border-radius: 50%; text-align: center; line-height: 24px; color: white; font-size: 12px; font-weight: 600;">4</div>
                    </td>
                    <td style="color: ${COLORS.textMuted}; font-size: 14px; padding-left: 12px;">
                      ${t.step4}
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </div>

        <!-- Questions -->
        <p style="color: ${COLORS.textMuted}; font-size: 14px; line-height: 1.6; margin: 0 0 8px 0;">
          ${t.questions}
        </p>

        <!-- CTA Button -->
        ${getButton(t.buttonText, dashboardUrl)}

        <!-- Closing -->
        <p style="color: ${COLORS.textMuted}; font-size: 14px; margin: 24px 0 0 0;">
          ${t.closing}<br>
          <strong style="color: ${COLORS.text};">${t.team}</strong>
        </p>
      </td>
    </tr>
  `;

  return {
    subject: t.subject,
    html: wrapEmail(content, { includeDisclaimer: true, includeUnsubscribe: true })
  };
}
