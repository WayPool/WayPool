import { useLanguage, Language } from "@/context/language-context";
import { createTranslationProxy } from "@/utils/translation-utils";

// Traducciones para el formulario de captura de leads
const leadFormTranslations = {
  en: {
    leadForm: {
      title: "Contact Us",
      subtitle: "Get in touch to learn more about our services",
      fullName: "Full Name",
      fullNamePlaceholder: "Enter your full name",
      email: "Email",
      emailPlaceholder: "Enter your email address",
      phone: "Phone Number (optional)",
      phonePlaceholder: "Enter your phone number",
      company: "Company (optional)",
      companyPlaceholder: "Enter your company name",
      investmentSize: "Investment Range",
      investmentSizePlaceholder: "Select investment range",
      message: "Message (optional)",
      messagePlaceholder: "Tell us about your needs and questions",
      consentText: "I agree to receive information about WayBank services and agree to the privacy policy",
      submit: "Submit",
      submitting: "Submitting...",
      successTitle: "Thank you!",
      successMessage: "We've received your information and will contact you shortly.",
      errorTitle: "Error",
      errorMessage: "There was an error submitting the form. Please try again.",
      investmentRanges: {
        lessThan5k: "Less than $5,000",
        between5kAnd10k: "$5,000 - $10,000",
        between10kAnd25k: "$10,000 - $25,000", 
        between25kAnd50k: "$25,000 - $50,000",
        between50kAnd100k: "$50,000 - $100,000",
        moreThan100k: "More than $100,000"
      }
    }
  },
  es: {
    leadForm: {
      title: "Contáctanos",
      subtitle: "Comunícate con nosotros para conocer más sobre nuestros servicios",
      fullName: "Nombre completo",
      fullNamePlaceholder: "Ingresa tu nombre completo",
      email: "Correo electrónico",
      emailPlaceholder: "Ingresa tu correo electrónico",
      phone: "Teléfono (opcional)",
      phonePlaceholder: "Ingresa tu número de teléfono",
      company: "Empresa (opcional)",
      companyPlaceholder: "Ingresa el nombre de tu empresa",
      investmentSize: "Rango de inversión",
      investmentSizePlaceholder: "Selecciona un rango de inversión",
      message: "Mensaje (opcional)",
      messagePlaceholder: "Cuéntanos sobre tus necesidades y preguntas",
      consentText: "Acepto recibir información sobre los servicios de WayBank y estoy de acuerdo con la política de privacidad",
      submit: "Enviar",
      submitting: "Enviando...",
      successTitle: "¡Gracias!",
      successMessage: "Hemos recibido tu información y te contactaremos pronto.",
      errorTitle: "Error",
      errorMessage: "Hubo un error al enviar el formulario. Por favor intenta de nuevo.",
      investmentRanges: {
        lessThan5k: "Menos de $5,000",
        between5kAnd10k: "$5,000 - $10,000",
        between10kAnd25k: "$10,000 - $25,000", 
        between25kAnd50k: "$25,000 - $50,000",
        between50kAnd100k: "$50,000 - $100,000",
        moreThan100k: "Más de $100,000"
      }
    }
  }
};

// Completamos traducciones para otros idiomas base en inglés o español
const allLeadFormTranslations: Record<Language, any> = {
  en: leadFormTranslations.en,
  es: leadFormTranslations.es,
  fr: leadFormTranslations.en,
  de: leadFormTranslations.en,
  it: leadFormTranslations.en,
  pt: leadFormTranslations.es,
  ar: leadFormTranslations.en,
  zh: leadFormTranslations.en,
  hi: leadFormTranslations.en
};

export function useTranslations() {
  const { language } = useLanguage();
  
  // Crear proxy para traducciones específicas del formulario
  const t = createTranslationProxy(allLeadFormTranslations, language);
  
  return {
    t,
    currentLanguage: language
  };
}