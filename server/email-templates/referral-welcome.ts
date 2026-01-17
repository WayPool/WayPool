import { Language } from "../../client/src/hooks/use-translation";

interface EmailTemplate {
  subject: string;
  html: string;
}

// Constante para el nombre de la aplicación (reemplaza todas las instancias de "WayBank")
const APP_NAME = "WayBank";

/**
 * Genera la plantilla HTML para el correo de bienvenida al programa de referidos
 * según el idioma seleccionado
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
  const baseUrl = "https://waybank.finance";
  const dashboardUrl = `${baseUrl}/dashboard`;
  const referralUrl = `${baseUrl}/public-referrals`;
  
  // Personaliza el saludo si hay un nombre
  const greeting = name ? `${getGreeting(language)} ${name},` : getGreeting(language);

  // Plantillas según idioma
  switch (language) {
    case "en":
      return {
        subject: `Welcome to the ${APP_NAME} Referral Program!`,
        html: `
          <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto;">
            <div style="background-color: #070F2B; padding: 20px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">${APP_NAME}</h1>
            </div>
            <div style="padding: 20px; background-color: #f9f9f9; border-radius: 0 0 5px 5px;">
              <h2 style="color: #070F2B;">${greeting}</h2>
              <p>Thank you for subscribing to our referral program! We're excited to have you on board.</p>
              <p>${APP_NAME} offers you a unique opportunity to earn commissions by referring investors to our platform. With our automated investment strategies in Uniswap pools, you can provide real value to your network.</p>
              
              ${referralCode ? `
              <div style="background-color: #e9f0ff; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <p style="margin: 0;"><strong>Your referral code:</strong> <span style="color: #1a56db; font-size: 18px;">${referralCode}</span></p>
              </div>
              ` : ''}
              
              <h3 style="color: #070F2B;">How to get started:</h3>
              <ol>
                <li>Visit our <a href="${referralUrl}" style="color: #1a56db; text-decoration: none;">referral program page</a> to learn more</li>
                <li>Share your referral code with potential investors</li>
                <li>Track your earnings in your dashboard</li>
                <li>Receive commissions every time your referrals generate fees</li>
              </ol>
              
              <p>If you have any questions or need assistance, feel free to reply to this email.</p>
              
              <div style="text-align: center; margin-top: 30px;">
                <a href="${dashboardUrl}" style="background-color: #1a56db; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">Access Your Dashboard</a>
              </div>
              
              <p style="margin-top: 30px; font-size: 14px; color: #666;">Best regards,<br>The ${APP_NAME} Team</p>
            </div>
            <div style="text-align: center; padding: 15px; font-size: 12px; color: #999;">
              <p>© ${new Date().getFullYear()} ${APP_NAME}. All rights reserved.</p>
              <p>
                <a href="${baseUrl}/terms" style="color: #999; text-decoration: none; margin: 0 10px;">Terms of Service</a> |
                <a href="${baseUrl}/privacy" style="color: #999; text-decoration: none; margin: 0 10px;">Privacy Policy</a>
              </p>
            </div>
          </div>
        `
      };
      
    case "es":
      return {
        subject: `¡Bienvenido al Programa de Referidos de ${APP_NAME}!`,
        html: `
          <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto;">
            <div style="background-color: #070F2B; padding: 20px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">${APP_NAME}</h1>
            </div>
            <div style="padding: 20px; background-color: #f9f9f9; border-radius: 0 0 5px 5px;">
              <h2 style="color: #070F2B;">${greeting}</h2>
              <p>¡Gracias por suscribirte a nuestro programa de referidos! Estamos emocionados de tenerte a bordo.</p>
              <p>${APP_NAME} te ofrece una oportunidad única para ganar comisiones refiriendo inversores a nuestra plataforma. Con nuestras estrategias de inversión automatizadas en pools de Uniswap, puedes proporcionar un valor real a tu red.</p>
              
              ${referralCode ? `
              <div style="background-color: #e9f0ff; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <p style="margin: 0;"><strong>Tu código de referido:</strong> <span style="color: #1a56db; font-size: 18px;">${referralCode}</span></p>
              </div>
              ` : ''}
              
              <h3 style="color: #070F2B;">Cómo empezar:</h3>
              <ol>
                <li>Visita nuestra <a href="${referralUrl}" style="color: #1a56db; text-decoration: none;">página del programa de referidos</a> para saber más</li>
                <li>Comparte tu código de referido con potenciales inversores</li>
                <li>Haz seguimiento de tus ganancias en tu dashboard</li>
                <li>Recibe comisiones cada vez que tus referidos generen comisiones</li>
              </ol>
              
              <p>Si tienes alguna pregunta o necesitas ayuda, no dudes en responder a este email.</p>
              
              <div style="text-align: center; margin-top: 30px;">
                <a href="${dashboardUrl}" style="background-color: #1a56db; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">Acceder a tu Dashboard</a>
              </div>
              
              <p style="margin-top: 30px; font-size: 14px; color: #666;">Saludos cordiales,<br>El Equipo de ${APP_NAME}</p>
            </div>
            <div style="text-align: center; padding: 15px; font-size: 12px; color: #999;">
              <p>© ${new Date().getFullYear()} ${APP_NAME}. Todos los derechos reservados.</p>
              <p>
                <a href="${baseUrl}/terms" style="color: #999; text-decoration: none; margin: 0 10px;">Términos de Servicio</a> |
                <a href="${baseUrl}/privacy" style="color: #999; text-decoration: none; margin: 0 10px;">Política de Privacidad</a>
              </p>
            </div>
          </div>
        `
      };
      
    case "de":
      return {
        subject: `Willkommen beim ${APP_NAME}-Partnerprogramm!`,
        html: `
          <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto;">
            <div style="background-color: #070F2B; padding: 20px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">${APP_NAME}</h1>
            </div>
            <div style="padding: 20px; background-color: #f9f9f9; border-radius: 0 0 5px 5px;">
              <h2 style="color: #070F2B;">${greeting}</h2>
              <p>Vielen Dank für Ihr Interesse an unserem Partnerprogramm! Wir freuen uns, Sie an Bord zu haben.</p>
              <p>${APP_NAME} bietet Ihnen die einzigartige Möglichkeit, Provisionen zu verdienen, indem Sie Investoren auf unsere Plattform verweisen. Mit unseren automatisierten Anlagestrategien in Uniswap-Pools können Sie Ihrem Netzwerk einen echten Mehrwert bieten.</p>
              
              ${referralCode ? `
              <div style="background-color: #e9f0ff; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <p style="margin: 0;"><strong>Ihr Empfehlungscode:</strong> <span style="color: #1a56db; font-size: 18px;">${referralCode}</span></p>
              </div>
              ` : ''}
              
              <h3 style="color: #070F2B;">So starten Sie:</h3>
              <ol>
                <li>Besuchen Sie unsere <a href="${referralUrl}" style="color: #1a56db; text-decoration: none;">Partnerprogramm-Seite</a> für weitere Informationen</li>
                <li>Teilen Sie Ihren Empfehlungscode mit potenziellen Investoren</li>
                <li>Verfolgen Sie Ihre Einnahmen in Ihrem Dashboard</li>
                <li>Erhalten Sie Provisionen, wenn Ihre Empfehlungen Gebühren generieren</li>
              </ol>
              
              <p>Wenn Sie Fragen haben oder Hilfe benötigen, antworten Sie einfach auf diese E-Mail.</p>
              
              <div style="text-align: center; margin-top: 30px;">
                <a href="${dashboardUrl}" style="background-color: #1a56db; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">Zugang zum Dashboard</a>
              </div>
              
              <p style="margin-top: 30px; font-size: 14px; color: #666;">Mit freundlichen Grüßen,<br>Das ${APP_NAME}-Team</p>
            </div>
            <div style="text-align: center; padding: 15px; font-size: 12px; color: #999;">
              <p>© ${new Date().getFullYear()} ${APP_NAME}. Alle Rechte vorbehalten.</p>
              <p>
                <a href="${baseUrl}/terms" style="color: #999; text-decoration: none; margin: 0 10px;">Nutzungsbedingungen</a> |
                <a href="${baseUrl}/privacy" style="color: #999; text-decoration: none; margin: 0 10px;">Datenschutzrichtlinie</a>
              </p>
            </div>
          </div>
        `
      };

    case "fr":
      return {
        subject: `Bienvenue au Programme de Parrainage ${APP_NAME} !`,
        html: `
          <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto;">
            <div style="background-color: #070F2B; padding: 20px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">${APP_NAME}</h1>
            </div>
            <div style="padding: 20px; background-color: #f9f9f9; border-radius: 0 0 5px 5px;">
              <h2 style="color: #070F2B;">${greeting}</h2>
              <p>Merci de vous être inscrit à notre programme de parrainage ! Nous sommes ravis de vous compter parmi nous.</p>
              <p>${APP_NAME} vous offre une opportunité unique de gagner des commissions en parrainant des investisseurs sur notre plateforme. Avec nos stratégies d'investissement automatisées dans les pools Uniswap, vous pouvez apporter une réelle valeur à votre réseau.</p>
              
              ${referralCode ? `
              <div style="background-color: #e9f0ff; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <p style="margin: 0;"><strong>Votre code de parrainage :</strong> <span style="color: #1a56db; font-size: 18px;">${referralCode}</span></p>
              </div>
              ` : ''}
              
              <h3 style="color: #070F2B;">Comment commencer :</h3>
              <ol>
                <li>Visitez notre <a href="${referralUrl}" style="color: #1a56db; text-decoration: none;">page du programme de parrainage</a> pour en savoir plus</li>
                <li>Partagez votre code de parrainage avec des investisseurs potentiels</li>
                <li>Suivez vos gains dans votre tableau de bord</li>
                <li>Recevez des commissions chaque fois que vos filleuls génèrent des frais</li>
              </ol>
              
              <p>Si vous avez des questions ou besoin d'aide, n'hésitez pas à répondre à cet e-mail.</p>
              
              <div style="text-align: center; margin-top: 30px;">
                <a href="${dashboardUrl}" style="background-color: #1a56db; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">Accéder à votre tableau de bord</a>
              </div>
              
              <p style="margin-top: 30px; font-size: 14px; color: #666;">Cordialement,<br>L'équipe ${APP_NAME}</p>
            </div>
            <div style="text-align: center; padding: 15px; font-size: 12px; color: #999;">
              <p>© ${new Date().getFullYear()} ${APP_NAME}. Tous droits réservés.</p>
              <p>
                <a href="${baseUrl}/terms" style="color: #999; text-decoration: none; margin: 0 10px;">Conditions d'utilisation</a> |
                <a href="${baseUrl}/privacy" style="color: #999; text-decoration: none; margin: 0 10px;">Politique de confidentialité</a>
              </p>
            </div>
          </div>
        `
      };

    case "it":
      return {
        subject: `Benvenuto al Programma di Referral ${APP_NAME}!`,
        html: `
          <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto;">
            <div style="background-color: #070F2B; padding: 20px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">${APP_NAME}</h1>
            </div>
            <div style="padding: 20px; background-color: #f9f9f9; border-radius: 0 0 5px 5px;">
              <h2 style="color: #070F2B;">${greeting}</h2>
              <p>Grazie per esserti iscritto al nostro programma di referral! Siamo entusiasti di averti con noi.</p>
              <p>${APP_NAME} ti offre un'opportunità unica di guadagnare commissioni indirizzando investitori alla nostra piattaforma. Con le nostre strategie di investimento automatizzate nei pool Uniswap, puoi offrire un valore reale alla tua rete.</p>
              
              ${referralCode ? `
              <div style="background-color: #e9f0ff; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <p style="margin: 0;"><strong>Il tuo codice referral:</strong> <span style="color: #1a56db; font-size: 18px;">${referralCode}</span></p>
              </div>
              ` : ''}
              
              <h3 style="color: #070F2B;">Come iniziare:</h3>
              <ol>
                <li>Visita la nostra <a href="${referralUrl}" style="color: #1a56db; text-decoration: none;">pagina del programma di referral</a> per saperne di più</li>
                <li>Condividi il tuo codice referral con potenziali investitori</li>
                <li>Monitora i tuoi guadagni nella dashboard</li>
                <li>Ricevi commissioni ogni volta che i tuoi referral generano commissioni</li>
              </ol>
              
              <p>Se hai domande o hai bisogno di assistenza, non esitare a rispondere a questa email.</p>
              
              <div style="text-align: center; margin-top: 30px;">
                <a href="${dashboardUrl}" style="background-color: #1a56db; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">Accedi alla tua Dashboard</a>
              </div>
              
              <p style="margin-top: 30px; font-size: 14px; color: #666;">Cordiali saluti,<br>Il Team ${APP_NAME}</p>
            </div>
            <div style="text-align: center; padding: 15px; font-size: 12px; color: #999;">
              <p>© ${new Date().getFullYear()} ${APP_NAME}. Tutti i diritti riservati.</p>
              <p>
                <a href="${baseUrl}/terms" style="color: #999; text-decoration: none; margin: 0 10px;">Termini di Servizio</a> |
                <a href="${baseUrl}/privacy" style="color: #999; text-decoration: none; margin: 0 10px;">Informativa sulla Privacy</a>
              </p>
            </div>
          </div>
        `
      };

    case "pt":
      return {
        subject: `Bem-vindo ao Programa de Indicação do ${APP_NAME}!`,
        html: `
          <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto;">
            <div style="background-color: #070F2B; padding: 20px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">${APP_NAME}</h1>
            </div>
            <div style="padding: 20px; background-color: #f9f9f9; border-radius: 0 0 5px 5px;">
              <h2 style="color: #070F2B;">${greeting}</h2>
              <p>Obrigado por se inscrever em nosso programa de indicação! Estamos muito felizes em tê-lo conosco.</p>
              <p>O ${APP_NAME} oferece a você uma oportunidade única de ganhar comissões indicando investidores para nossa plataforma. Com nossas estratégias de investimento automatizadas em pools da Uniswap, você pode fornecer valor real à sua rede.</p>
              
              ${referralCode ? `
              <div style="background-color: #e9f0ff; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <p style="margin: 0;"><strong>Seu código de indicação:</strong> <span style="color: #1a56db; font-size: 18px;">${referralCode}</span></p>
              </div>
              ` : ''}
              
              <h3 style="color: #070F2B;">Como começar:</h3>
              <ol>
                <li>Visite nossa <a href="${referralUrl}" style="color: #1a56db; text-decoration: none;">página do programa de indicação</a> para saber mais</li>
                <li>Compartilhe seu código de indicação com potenciais investidores</li>
                <li>Acompanhe seus ganhos em seu painel</li>
                <li>Receba comissões sempre que seus indicados gerarem taxas</li>
              </ol>
              
              <p>Se você tiver alguma dúvida ou precisar de ajuda, sinta-se à vontade para responder a este e-mail.</p>
              
              <div style="text-align: center; margin-top: 30px;">
                <a href="${dashboardUrl}" style="background-color: #1a56db; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">Acessar seu Painel</a>
              </div>
              
              <p style="margin-top: 30px; font-size: 14px; color: #666;">Atenciosamente,<br>A Equipe ${APP_NAME}</p>
            </div>
            <div style="text-align: center; padding: 15px; font-size: 12px; color: #999;">
              <p>© ${new Date().getFullYear()} ${APP_NAME}. Todos os direitos reservados.</p>
              <p>
                <a href="${baseUrl}/terms" style="color: #999; text-decoration: none; margin: 0 10px;">Termos de Serviço</a> |
                <a href="${baseUrl}/privacy" style="color: #999; text-decoration: none; margin: 0 10px;">Política de Privacidade</a>
              </p>
            </div>
          </div>
        `
      };

    case "ar":
      return {
        subject: `مرحبًا بك في برنامج الإحالة من ${APP_NAME}!`,
        html: `
          <div dir="rtl" style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto;">
            <div style="background-color: #070F2B; padding: 20px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">${APP_NAME}</h1>
            </div>
            <div style="padding: 20px; background-color: #f9f9f9; border-radius: 0 0 5px 5px;">
              <h2 style="color: #070F2B;">${greeting}</h2>
              <p>شكرا لاشتراكك في برنامج الإحالة لدينا! نحن متحمسون لانضمامك إلينا.</p>
              <p>يقدم ${APP_NAME} لك فرصة فريدة لكسب العمولات من خلال إحالة المستثمرين إلى منصتنا. مع استراتيجيات الاستثمار الآلي لدينا في مجمعات Uniswap، يمكنك تقديم قيمة حقيقية لشبكتك.</p>
              
              ${referralCode ? `
              <div style="background-color: #e9f0ff; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <p style="margin: 0;"><strong>رمز الإحالة الخاص بك:</strong> <span style="color: #1a56db; font-size: 18px;">${referralCode}</span></p>
              </div>
              ` : ''}
              
              <h3 style="color: #070F2B;">كيفية البدء:</h3>
              <ol>
                <li>قم بزيارة <a href="${referralUrl}" style="color: #1a56db; text-decoration: none;">صفحة برنامج الإحالة</a> لمعرفة المزيد</li>
                <li>شارك رمز الإحالة الخاص بك مع المستثمرين المحتملين</li>
                <li>تتبع أرباحك في لوحة التحكم الخاصة بك</li>
                <li>استلم العمولات في كل مرة ينتج فيها المحالون رسومًا</li>
              </ol>
              
              <p>إذا كان لديك أي أسئلة أو تحتاج إلى مساعدة، فلا تتردد في الرد على هذا البريد الإلكتروني.</p>
              
              <div style="text-align: center; margin-top: 30px;">
                <a href="${dashboardUrl}" style="background-color: #1a56db; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">الوصول إلى لوحة التحكم</a>
              </div>
              
              <p style="margin-top: 30px; font-size: 14px; color: #666;">مع أطيب التحيات،<br>فريق ${APP_NAME}</p>
            </div>
            <div style="text-align: center; padding: 15px; font-size: 12px; color: #999;">
              <p>© ${new Date().getFullYear()} ${APP_NAME}. جميع الحقوق محفوظة.</p>
              <p>
                <a href="${baseUrl}/terms" style="color: #999; text-decoration: none; margin: 0 10px;">شروط الخدمة</a> |
                <a href="${baseUrl}/privacy" style="color: #999; text-decoration: none; margin: 0 10px;">سياسة الخصوصية</a>
              </p>
            </div>
          </div>
        `
      };

    case "zh":
      return {
        subject: `欢迎加入${APP_NAME}推荐计划！`,
        html: `
          <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto;">
            <div style="background-color: #070F2B; padding: 20px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">${APP_NAME}</h1>
            </div>
            <div style="padding: 20px; background-color: #f9f9f9; border-radius: 0 0 5px 5px;">
              <h2 style="color: #070F2B;">${greeting}</h2>
              <p>感谢您订阅我们的推荐计划！我们很高兴您能加入我们。</p>
              <p>${APP_NAME}为您提供了通过推荐投资者到我们的平台来赚取佣金的独特机会。凭借我们在Uniswap矿池中的自动投资策略，您可以为您的网络提供真正的价值。</p>
              
              ${referralCode ? `
              <div style="background-color: #e9f0ff; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <p style="margin: 0;"><strong>您的推荐代码：</strong> <span style="color: #1a56db; font-size: 18px;">${referralCode}</span></p>
              </div>
              ` : ''}
              
              <h3 style="color: #070F2B;">如何开始：</h3>
              <ol>
                <li>访问我们的<a href="${referralUrl}" style="color: #1a56db; text-decoration: none;">推荐计划页面</a>了解更多</li>
                <li>与潜在投资者分享您的推荐代码</li>
                <li>在您的仪表板中跟踪您的收益</li>
                <li>每当您的推荐人产生费用时，您都会收到佣金</li>
              </ol>
              
              <p>如果您有任何问题或需要帮助，请随时回复此电子邮件。</p>
              
              <div style="text-align: center; margin-top: 30px;">
                <a href="${dashboardUrl}" style="background-color: #1a56db; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">访问您的仪表板</a>
              </div>
              
              <p style="margin-top: 30px; font-size: 14px; color: #666;">此致，<br>${APP_NAME}团队</p>
            </div>
            <div style="text-align: center; padding: 15px; font-size: 12px; color: #999;">
              <p>© ${new Date().getFullYear()} ${APP_NAME}. 版权所有。</p>
              <p>
                <a href="${baseUrl}/terms" style="color: #999; text-decoration: none; margin: 0 10px;">服务条款</a> |
                <a href="${baseUrl}/privacy" style="color: #999; text-decoration: none; margin: 0 10px;">隐私政策</a>
              </p>
            </div>
          </div>
        `
      };

    case "hi":
      return {
        subject: `${APP_NAME} रेफरल प्रोग्राम में आपका स्वागत है!`,
        html: `
          <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto;">
            <div style="background-color: #070F2B; padding: 20px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">${APP_NAME}</h1>
            </div>
            <div style="padding: 20px; background-color: #f9f9f9; border-radius: 0 0 5px 5px;">
              <h2 style="color: #070F2B;">${greeting}</h2>
              <p>हमारे रेफरल प्रोग्राम की सदस्यता लेने के लिए धन्यवाद! हम आपको अपने साथ पाकर उत्साहित हैं।</p>
              <p>${APP_NAME} आपको हमारे प्लेटफॉर्म पर निवेशकों को रेफर करके कमीशन कमाने का एक अनूठा अवसर प्रदान करता है। Uniswap पूल में हमारी स्वचालित निवेश रणनीतियों के साथ, आप अपने नेटवर्क को वास्तविक मूल्य प्रदान कर सकते हैं।</p>
              
              ${referralCode ? `
              <div style="background-color: #e9f0ff; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <p style="margin: 0;"><strong>आपका रेफरल कोड:</strong> <span style="color: #1a56db; font-size: 18px;">${referralCode}</span></p>
              </div>
              ` : ''}
              
              <h3 style="color: #070F2B;">शुरू कैसे करें:</h3>
              <ol>
                <li>अधिक जानने के लिए हमारे <a href="${referralUrl}" style="color: #1a56db; text-decoration: none;">रेफरल प्रोग्राम पेज</a> पर जाएं</li>
                <li>संभावित निवेशकों के साथ अपना रेफरल कोड साझा करें</li>
                <li>अपने डैशबोर्ड में अपनी कमाई को ट्रैक करें</li>
                <li>जब भी आपके रेफरल शुल्क उत्पन्न करते हैं, कमीशन प्राप्त करें</li>
              </ol>
              
              <p>यदि आपके कोई प्रश्न हैं या सहायता की आवश्यकता है, तो इस ईमेल का जवाब देने में संकोच न करें।</p>
              
              <div style="text-align: center; margin-top: 30px;">
                <a href="${dashboardUrl}" style="background-color: #1a56db; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">अपने डैशबोर्ड तक पहुंचें</a>
              </div>
              
              <p style="margin-top: 30px; font-size: 14px; color: #666;">सादर,<br>${APP_NAME} टीम</p>
            </div>
            <div style="text-align: center; padding: 15px; font-size: 12px; color: #999;">
              <p>© ${new Date().getFullYear()} ${APP_NAME}. सर्वाधिकार सुरक्षित।</p>
              <p>
                <a href="${baseUrl}/terms" style="color: #999; text-decoration: none; margin: 0 10px;">सेवा की शर्तें</a> |
                <a href="${baseUrl}/privacy" style="color: #999; text-decoration: none; margin: 0 10px;">गोपनीयता नीति</a>
              </p>
            </div>
          </div>
        `
      };

    // Por defecto, usar español
    default:
      return getReferralWelcomeTemplate("es", referralCode, name);
  }
}

/**
 * Obtiene el saludo apropiado según el idioma
 * @param language Código del idioma
 * @returns Saludo traducido
 */
function getGreeting(language: Language): string {
  const greetings: Record<Language, string> = {
    es: "Hola",
    en: "Hello",
    de: "Hallo",
    fr: "Bonjour",
    it: "Ciao",
    pt: "Olá",
    ar: "مرحبًا",
    zh: "您好",
    hi: "नमस्ते"
  };
  
  return greetings[language] || greetings.es;
}