import { emailService } from "./email-service";
import { getReferralWelcomeTemplate } from "./email-templates/referral-welcome";
import { storage } from "./storage";
import { Language } from "../client/src/hooks/use-translation";

class ReferralEmailService {
  /**
   * Envía un email de bienvenida al programa de referidos
   * @param email Email del suscriptor
   * @param language Idioma preferido del suscriptor
   * @param referralCode Código de referido (opcional)
   * @param name Nombre del suscriptor (opcional)
   */
  async sendWelcomeEmail(
    email: string,
    language: Language = "es",
    referralCode?: string | null,
    name?: string | null
  ): Promise<boolean> {
    try {
      // Si no hay un código de referido y el email existe en la tabla de referidos, obtener ese código
      if (!referralCode) {
        const referral = await storage.getReferralByEmail(email);
        if (referral) {
          referralCode = referral.referralCode;
        }
      }

      // Si aún no hay código, dejar espacio en blanco en la plantilla
      const code = referralCode || "";
      
      // Obtener plantilla según el idioma
      const { subject, html } = getReferralWelcomeTemplate(language, code, name);
      
      // Enviar el email
      const result = await emailService.sendEmail({
        to: email,
        subject,
        html
      });
      
      return result;
    } catch (error) {
      console.error("Error al enviar email de bienvenida al programa de referidos:", error);
      return false;
    }
  }
  
  /**
   * Envía una notificación al equipo cuando hay un nuevo suscriptor
   * @param email Email del nuevo suscriptor
   * @param language Idioma seleccionado
   * @param name Nombre del suscriptor (opcional)
   */
  async sendNewSubscriberNotification(email: string, language: Language = "es", name?: string): Promise<boolean> {
    try {
      const notificationEmail = "info@elysiumdubai.net";
      
      const languageNames: Record<Language, string> = {
        es: "Español",
        en: "Inglés",
        de: "Alemán",
        fr: "Francés",
        it: "Italiano",
        pt: "Portugués",
        ar: "Árabe",
        zh: "Chino",
        hi: "Hindi"
      };
      
      const subject = "Nuevo suscriptor al programa de referidos";
      const html = `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <div style="background-color: #7c3aed; padding: 20px; text-align: center; margin-bottom: 20px;">
            <h1 style="color: white; margin: 0; font-size: 28px;">WayBank</h1>
          </div>
          <h2>Nuevo suscriptor al programa de referidos</h2>
          <p>Un nuevo usuario se ha suscrito al programa de referidos:</p>
          <ul>
            <li><strong>Email:</strong> ${email}</li>
            ${name ? `<li><strong>Nombre:</strong> ${name}</li>` : ''}
            <li><strong>Idioma:</strong> ${languageNames[language] || language}</li>
            <li><strong>Fecha:</strong> ${new Date().toLocaleString()}</li>
          </ul>
          <p>Revisa el panel de administración para más detalles.</p>
          <div style="border-top: 1px solid #eee; padding-top: 10px; margin-top: 20px; text-align: center;">
            <p style="color: #666; font-size: 12px;">&copy; ${new Date().getFullYear()} WayBank. Todos los derechos reservados.</p>
          </div>
        </div>
      `;
      
      const result = await emailService.sendEmail({
        to: notificationEmail,
        subject,
        html
      });
      
      return result;
    } catch (error) {
      console.error("Error al enviar notificación de nuevo suscriptor:", error);
      return false;
    }
  }
}

export const referralEmailService = new ReferralEmailService();