import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
// Importamos el select con corrección de tema en lugar del original
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/fixed-select';
import { apiRequest } from '@/lib/queryClient';
import { useLanguage } from '@/context/language-context';
import { SimpleFormPhoneInput } from '@/components/ui/simple-phone-input'; // Versión simplificada con selector de país
import '@/styles/flags.css';
import '@/styles/phone-input.css';

// Definir el esquema de validación
const formSchema = z.object({
  fullName: z.string().min(2, {
    message: 'El nombre debe tener al menos 2 caracteres'
  }),
  email: z.string().email({
    message: 'Por favor, introduce un email válido'
  }),
  phone: z.string().optional(),
  phoneCountryCode: z.string().optional(),
  phoneFormatted: z.string().optional(),
  company: z.string().optional(),
  investmentSize: z.string({
    required_error: 'Por favor, selecciona un rango de inversión'
  }),
  message: z.string().optional(),
  consent: z.boolean().refine(val => val === true, {
    message: 'Debes aceptar los términos y condiciones'
  })
});

// Definir el tipo de los datos del formulario
type FormValues = z.infer<typeof formSchema>;

// Definir las traducciones
const translations = {
  // Inglés
  en: {
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
  },
  
  // Español
  es: {
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
  },
  
  // Francés
  fr: {
    title: "Contactez-nous",
    subtitle: "Entrez en contact pour en savoir plus sur nos services",
    fullName: "Nom complet",
    fullNamePlaceholder: "Entrez votre nom complet",
    email: "Email",
    emailPlaceholder: "Entrez votre adresse email",
    phone: "Numéro de téléphone (optionnel)",
    phonePlaceholder: "Entrez votre numéro de téléphone",
    company: "Entreprise (optionnel)",
    companyPlaceholder: "Entrez le nom de votre entreprise",
    investmentSize: "Gamme d'investissement",
    investmentSizePlaceholder: "Sélectionnez une gamme d'investissement",
    message: "Message (optionnel)",
    messagePlaceholder: "Parlez-nous de vos besoins et questions",
    consentText: "J'accepte de recevoir des informations sur les services WayBank et j'accepte la politique de confidentialité",
    submit: "Envoyer",
    submitting: "Envoi en cours...",
    successTitle: "Merci!",
    successMessage: "Nous avons reçu vos informations et vous contacterons bientôt.",
    errorTitle: "Erreur",
    errorMessage: "Une erreur s'est produite lors de la soumission du formulaire. Veuillez réessayer.",
    investmentRanges: {
      lessThan5k: "Moins de 5 000 $",
      between5kAnd10k: "5 000 $ - 10 000 $",
      between10kAnd25k: "10 000 $ - 25 000 $", 
      between25kAnd50k: "25 000 $ - 50 000 $",
      between50kAnd100k: "50 000 $ - 100 000 $",
      moreThan100k: "Plus de 100 000 $"
    }
  },
  
  // Alemán
  de: {
    title: "Kontaktieren Sie uns",
    subtitle: "Nehmen Sie Kontakt auf, um mehr über unsere Dienstleistungen zu erfahren",
    fullName: "Vollständiger Name",
    fullNamePlaceholder: "Geben Sie Ihren vollständigen Namen ein",
    email: "E-Mail",
    emailPlaceholder: "Geben Sie Ihre E-Mail-Adresse ein",
    phone: "Telefonnummer (optional)",
    phonePlaceholder: "Geben Sie Ihre Telefonnummer ein",
    company: "Unternehmen (optional)",
    companyPlaceholder: "Geben Sie Ihren Firmennamen ein",
    investmentSize: "Investitionsbereich",
    investmentSizePlaceholder: "Wählen Sie einen Investitionsbereich",
    message: "Nachricht (optional)",
    messagePlaceholder: "Erzählen Sie uns von Ihren Bedürfnissen und Fragen",
    consentText: "Ich bin damit einverstanden, Informationen über WayBank-Dienste zu erhalten und stimme der Datenschutzrichtlinie zu",
    submit: "Absenden",
    submitting: "Wird gesendet...",
    successTitle: "Vielen Dank!",
    successMessage: "Wir haben Ihre Informationen erhalten und werden Sie in Kürze kontaktieren.",
    errorTitle: "Fehler",
    errorMessage: "Beim Absenden des Formulars ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.",
    investmentRanges: {
      lessThan5k: "Weniger als 5.000 $",
      between5kAnd10k: "5.000 $ - 10.000 $",
      between10kAnd25k: "10.000 $ - 25.000 $", 
      between25kAnd50k: "25.000 $ - 50.000 $",
      between50kAnd100k: "50.000 $ - 100.000 $",
      moreThan100k: "Mehr als 100.000 $"
    }
  },
  
  // Italiano
  it: {
    title: "Contattaci",
    subtitle: "Mettiti in contatto per saperne di più sui nostri servizi",
    fullName: "Nome completo",
    fullNamePlaceholder: "Inserisci il tuo nome completo",
    email: "Email",
    emailPlaceholder: "Inserisci il tuo indirizzo email",
    phone: "Numero di telefono (opzionale)",
    phonePlaceholder: "Inserisci il tuo numero di telefono",
    company: "Azienda (opzionale)",
    companyPlaceholder: "Inserisci il nome della tua azienda",
    investmentSize: "Gamma di investimento",
    investmentSizePlaceholder: "Seleziona una gamma di investimento",
    message: "Messaggio (opzionale)",
    messagePlaceholder: "Parlaci delle tue esigenze e domande",
    consentText: "Accetto di ricevere informazioni sui servizi WayBank e accetto la politica sulla privacy",
    submit: "Invia",
    submitting: "Invio in corso...",
    successTitle: "Grazie!",
    successMessage: "Abbiamo ricevuto le tue informazioni e ti contatteremo a breve.",
    errorTitle: "Errore",
    errorMessage: "Si è verificato un errore durante l'invio del modulo. Per favore riprova.",
    investmentRanges: {
      lessThan5k: "Meno di 5.000 $",
      between5kAnd10k: "5.000 $ - 10.000 $",
      between10kAnd25k: "10.000 $ - 25.000 $", 
      between25kAnd50k: "25.000 $ - 50.000 $",
      between50kAnd100k: "50.000 $ - 100.000 $",
      moreThan100k: "Più di 100.000 $"
    }
  },
  
  // Portugués
  pt: {
    title: "Entre em contato",
    subtitle: "Entre em contato para saber mais sobre nossos serviços",
    fullName: "Nome completo",
    fullNamePlaceholder: "Digite seu nome completo",
    email: "E-mail",
    emailPlaceholder: "Digite seu endereço de e-mail",
    phone: "Número de telefone (opcional)",
    phonePlaceholder: "Digite seu número de telefone",
    company: "Empresa (opcional)",
    companyPlaceholder: "Digite o nome da sua empresa",
    investmentSize: "Faixa de investimento",
    investmentSizePlaceholder: "Selecione uma faixa de investimento",
    message: "Mensagem (opcional)",
    messagePlaceholder: "Conte-nos sobre suas necessidades e perguntas",
    consentText: "Concordo em receber informações sobre os serviços WayBank e concordo com a política de privacidade",
    submit: "Enviar",
    submitting: "Enviando...",
    successTitle: "Obrigado!",
    successMessage: "Recebemos suas informações e entraremos em contato em breve.",
    errorTitle: "Erro",
    errorMessage: "Ocorreu um erro ao enviar o formulário. Por favor, tente novamente.",
    investmentRanges: {
      lessThan5k: "Menos de $5.000",
      between5kAnd10k: "$5.000 - $10.000",
      between10kAnd25k: "$10.000 - $25.000", 
      between25kAnd50k: "$25.000 - $50.000",
      between50kAnd100k: "$50.000 - $100.000",
      moreThan100k: "Mais de $100.000"
    }
  },
  
  // Árabe
  ar: {
    title: "اتصل بنا",
    subtitle: "تواصل معنا لمعرفة المزيد عن خدماتنا",
    fullName: "الاسم الكامل",
    fullNamePlaceholder: "أدخل اسمك الكامل",
    email: "البريد الإلكتروني",
    emailPlaceholder: "أدخل عنوان بريدك الإلكتروني",
    phone: "رقم الهاتف (اختياري)",
    phonePlaceholder: "أدخل رقم هاتفك",
    company: "الشركة (اختياري)",
    companyPlaceholder: "أدخل اسم شركتك",
    investmentSize: "نطاق الاستثمار",
    investmentSizePlaceholder: "حدد نطاق الاستثمار",
    message: "الرسالة (اختياري)",
    messagePlaceholder: "أخبرنا عن احتياجاتك وأسئلتك",
    consentText: "أوافق على تلقي معلومات حول خدمات WayBank وأوافق على سياسة الخصوصية",
    submit: "إرسال",
    submitting: "جارٍ الإرسال...",
    successTitle: "شكراً لك!",
    successMessage: "لقد تلقينا معلوماتك وسنتصل بك قريباً.",
    errorTitle: "خطأ",
    errorMessage: "حدث خطأ أثناء تقديم النموذج. يرجى المحاولة مرة أخرى.",
    investmentRanges: {
      lessThan5k: "أقل من 5,000$",
      between5kAnd10k: "5,000$ - 10,000$",
      between10kAnd25k: "10,000$ - 25,000$", 
      between25kAnd50k: "25,000$ - 50,000$",
      between50kAnd100k: "50,000$ - 100,000$",
      moreThan100k: "أكثر من 100,000$"
    }
  },
  
  // Chino
  zh: {
    title: "联系我们",
    subtitle: "与我们联系，了解更多关于我们的服务",
    fullName: "全名",
    fullNamePlaceholder: "输入您的全名",
    email: "电子邮件",
    emailPlaceholder: "输入您的电子邮件地址",
    phone: "电话号码（可选）",
    phonePlaceholder: "输入您的电话号码",
    company: "公司（可选）",
    companyPlaceholder: "输入您的公司名称",
    investmentSize: "投资范围",
    investmentSizePlaceholder: "选择投资范围",
    message: "留言（可选）",
    messagePlaceholder: "告诉我们您的需求和问题",
    consentText: "我同意接收有关WayBank服务的信息，并同意隐私政策",
    submit: "提交",
    submitting: "提交中...",
    successTitle: "谢谢您！",
    successMessage: "我们已收到您的信息，将尽快与您联系。",
    errorTitle: "错误",
    errorMessage: "提交表单时出错。请再试一次。",
    investmentRanges: {
      lessThan5k: "低于 $5,000",
      between5kAnd10k: "$5,000 - $10,000",
      between10kAnd25k: "$10,000 - $25,000", 
      between25kAnd50k: "$25,000 - $50,000",
      between50kAnd100k: "$50,000 - $100,000",
      moreThan100k: "超过 $100,000"
    }
  },
  
  // Hindi
  hi: {
    title: "संपर्क करें",
    subtitle: "हमारी सेवाओं के बारे में अधिक जानने के लिए संपर्क करें",
    fullName: "पूरा नाम",
    fullNamePlaceholder: "अपना पूरा नाम दर्ज करें",
    email: "ईमेल",
    emailPlaceholder: "अपना ईमेल पता दर्ज करें",
    phone: "फोन नंबर (वैकल्पिक)",
    phonePlaceholder: "अपना फोन नंबर दर्ज करें",
    company: "कंपनी (वैकल्पिक)",
    companyPlaceholder: "अपनी कंपनी का नाम दर्ज करें",
    investmentSize: "निवेश सीमा",
    investmentSizePlaceholder: "निवेश सीमा चुनें",
    message: "संदेश (वैकल्पिक)",
    messagePlaceholder: "हमें अपनी जरूरतों और प्रश्नों के बारे में बताएं",
    consentText: "मैं WayBank सेवाओं के बारे में जानकारी प्राप्त करने के लिए सहमत हूं और गोपनीयता नीति से सहमत हूं",
    submit: "जमा करें",
    submitting: "जमा कर रहे हैं...",
    successTitle: "धन्यवाद!",
    successMessage: "हमें आपकी जानकारी मिल गई है और हम जल्द ही आपसे संपर्क करेंगे।",
    errorTitle: "त्रुटि",
    errorMessage: "फॉर्म जमा करने में त्रुटि हुई। कृपया पुनः प्रयास करें।",
    investmentRanges: {
      lessThan5k: "$5,000 से कम",
      between5kAnd10k: "$5,000 - $10,000",
      between10kAnd25k: "$10,000 - $25,000", 
      between25kAnd50k: "$25,000 - $50,000",
      between50kAnd100k: "$50,000 - $100,000",
      moreThan100k: "$100,000 से अधिक"
    }
  }
};

// Propiedades del componente
interface LeadCaptureFormProps {
  onSuccess?: () => void;
  className?: string;
}

// Definición de países con sus prefijos telefónicos
const countryCodes = [
  { code: 'es', name: 'España', prefix: '34' },
  { code: 'us', name: 'Estados Unidos', prefix: '1' },
  { code: 'mx', name: 'México', prefix: '52' },
  { code: 'ar', name: 'Argentina', prefix: '54' },
  { code: 'co', name: 'Colombia', prefix: '57' },
  { code: 'pe', name: 'Perú', prefix: '51' },
  { code: 'cl', name: 'Chile', prefix: '56' },
  { code: 'bo', name: 'Bolivia', prefix: '591' },
  { code: 'cr', name: 'Costa Rica', prefix: '506' },
  { code: 'cu', name: 'Cuba', prefix: '53' },
  { code: 'ec', name: 'Ecuador', prefix: '593' },
  { code: 'sv', name: 'El Salvador', prefix: '503' },
  { code: 'gt', name: 'Guatemala', prefix: '502' },
  { code: 'hn', name: 'Honduras', prefix: '504' },
  { code: 'ni', name: 'Nicaragua', prefix: '505' },
  { code: 'pa', name: 'Panamá', prefix: '507' },
  { code: 'py', name: 'Paraguay', prefix: '595' },
  { code: 'do', name: 'República Dominicana', prefix: '1809' },
  { code: 'uy', name: 'Uruguay', prefix: '598' },
  { code: 've', name: 'Venezuela', prefix: '58' },
  { code: 'fr', name: 'Francia', prefix: '33' },
  { code: 'de', name: 'Alemania', prefix: '49' },
  { code: 'it', name: 'Italia', prefix: '39' },
  { code: 'pt', name: 'Portugal', prefix: '351' },
  { code: 'gb', name: 'Reino Unido', prefix: '44' },
  { code: 'br', name: 'Brasil', prefix: '55' },
  { code: 'be', name: 'Bélgica', prefix: '32' },
  { code: 'nl', name: 'Países Bajos', prefix: '31' },
  { code: 'ca', name: 'Canadá', prefix: '1' },
  { code: 'au', name: 'Australia', prefix: '61' },
  { code: 'nz', name: 'Nueva Zelanda', prefix: '64' },
  { code: 'ch', name: 'Suiza', prefix: '41' },
  { code: 'se', name: 'Suecia', prefix: '46' },
  { code: 'no', name: 'Noruega', prefix: '47' },
  { code: 'dk', name: 'Dinamarca', prefix: '45' },
  { code: 'fi', name: 'Finlandia', prefix: '358' },
  { code: 'at', name: 'Austria', prefix: '43' },
  { code: 'pl', name: 'Polonia', prefix: '48' },
  { code: 'ru', name: 'Rusia', prefix: '7' },
  { code: 'cn', name: 'China', prefix: '86' },
  { code: 'jp', name: 'Japón', prefix: '81' },
  { code: 'kr', name: 'Corea del Sur', prefix: '82' },
  { code: 'in', name: 'India', prefix: '91' },
  { code: 'za', name: 'Sudáfrica', prefix: '27' },
  { code: 'ae', name: 'Emiratos Árabes Unidos', prefix: '971' },
  { code: 'sa', name: 'Arabia Saudita', prefix: '966' },
  { code: 'il', name: 'Israel', prefix: '972' },
  { code: 'tr', name: 'Turquía', prefix: '90' },
  { code: 'gr', name: 'Grecia', prefix: '30' },
];

export function LeadCaptureForm({ onSuccess, className = '' }: LeadCaptureFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { language } = useLanguage();
  const [selectedCountry, setSelectedCountry] = useState(countryCodes[0]);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Obtener traducción según el idioma actual
  const t = translations[language as keyof typeof translations] || translations.en;
  
  // Estado para filtrar países según el término de búsqueda
  const filteredCountries = searchTerm
    ? countryCodes.filter(
        country => 
          country.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
          country.prefix.includes(searchTerm)
      )
    : countryCodes;

  // Rangos de inversión disponibles
  const investmentRanges = [
    { value: 'menos-de-5000', label: t.investmentRanges.lessThan5k },
    { value: '5000-10000', label: t.investmentRanges.between5kAnd10k },
    { value: '10000-25000', label: t.investmentRanges.between10kAnd25k },
    { value: '25000-50000', label: t.investmentRanges.between25kAnd50k },
    { value: '50000-100000', label: t.investmentRanges.between50kAnd100k },
    { value: 'mas-de-100000', label: t.investmentRanges.moreThan100k }
  ];

  // Inicializar formulario con validación
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      company: '',
      investmentSize: '',
      message: '',
      consent: false
    }
  });

  // Efecto para inicializar los valores del teléfono después de que el formulario esté disponible
  useEffect(() => {
    const defaultCountry = countryCodes[0];
    form.setValue('phoneCountryCode', defaultCountry.code);
    form.setValue('phoneFormatted', `+${defaultCountry.prefix} `);
  }, [form]);

  // Función para enviar el formulario
  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    
    // Preparar datos para envío incluyendo información de teléfono
    const formattedData = {
      ...data,
      // Si tenemos un teléfono formateado, usamos ese; de lo contrario, usamos el original
      phone: data.phoneFormatted || data.phone,
      // Incluir preferencia de idioma
      languagePreference: language
    };

    try {
      const response = await apiRequest('POST', '/api/leads', formattedData);

      // apiRequest ya devuelve los datos JSON parsificados, no necesitamos llamar a .json()
      if (response.error) {
        throw new Error(response.error || 'Error al enviar el formulario');
      }

      // Mostrar mensaje de éxito
      toast({
        title: t.successTitle,
        description: t.successMessage,
        variant: 'default'
      });

      // Resetear el formulario
      form.reset();

      // Llamar a la función de éxito si existe
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error al enviar lead:', error);
      toast({
        title: t.errorTitle,
        description: typeof error === 'object' && error !== null && 'message' in error
          ? String((error as Error).message)
          : t.errorMessage,
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`rounded-lg bg-card p-6 shadow-md ${className}`}>
      <h2 className="text-2xl font-semibold mb-4">{t.title}</h2>
      <p className="text-muted-foreground mb-6">{t.subtitle}</p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">


          {/* Campo de nombre completo que ocupa ancho completo */}
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t.fullName}</FormLabel>
                <FormControl>
                  <Input placeholder={t.fullNamePlaceholder} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Grupo de email y empresa */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t.email}</FormLabel>
                  <FormControl>
                    <Input placeholder={t.emailPlaceholder} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Empresa */}
            <FormField
              control={form.control}
              name="company"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t.company}</FormLabel>
                  <FormControl>
                    <Input placeholder={t.companyPlaceholder} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          {/* Teléfono con selector internacional (ancho completo) - Versión simplificada */}
          <SimpleFormPhoneInput
            form={form}
            field={{
              name: "phone",
              onChange: (value: string) => {
                form.setValue("phone", value);
              },
              value: form.watch("phone") || ""
            }}
            label={t.phone}
            placeholder={t.phonePlaceholder}
          />

          {/* Rango de inversión */}
          <FormField
            control={form.control}
            name="investmentSize"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t.investmentSize}</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t.investmentSizePlaceholder} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {investmentRanges.map((range) => (
                      <SelectItem key={range.value} value={range.value}>
                        {range.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Mensaje */}
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t.message}</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder={t.messagePlaceholder}
                    className="h-20"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Consentimiento */}
          <FormField
            control={form.control}
            name="consent"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="font-normal cursor-pointer">
                    {t.consentText}
                  </FormLabel>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          {/* Botón de envío */}
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isSubmitting}
          >
            {isSubmitting ? t.submitting : t.submit}
          </Button>
        </form>
      </Form>
    </div>
  );
}