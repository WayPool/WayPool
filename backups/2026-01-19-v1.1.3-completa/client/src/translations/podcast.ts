import { Language } from "@/context/language-context";

// Interfaz para las traducciones del podcast
export interface PodcastTranslations {
  // Diálogo del reproductor de audio
  audioErrorTitle: string;
  audioErrorDescription: string;
  audioErrorContent: string;
  downloadButton: string;
  openExternalUrlButton: string;
  playbackOptions: string;
  audioErrorLabel: string;
  
  // Componentes del reproductor
  featuredLabel: string;
  newLabel: string;
  playText: string;
  listenLatest: string;
  subscribeLabel: string;
  highlightedEpisode: string;
  newEpisodesThursday: string;
  
  // Secciones de la página
  latestEpisodes: string;
  viewAllEpisodes: string;
  neverMissEpisode: string;
  subscribeNotification: string;
  
  // Breadcrumbs y navegación
  backToHome: string;
  podcastLabel: string;
  
  // Podcast Promo
  newEpisode: string;
  podcastTitle: string;
  podcastDescription: string;
  listenNow: string;
  latestEpisode: string;
  everyThursday: string;
  
  // Filtros y controles
  episodesCount: string;
  viewLabel: string;
  categoryLabel: string;
  allCategories: string;
  previousButton: string;
  nextButton: string;
  
  // Newsletter subscription dialog
  subscribeNewsletterTitle: string;
  subscribeNewsletterDescription: string;
  emailLabel: string;
  emailPlaceholder: string;
  nameLabel: string;
  namePlaceholder: string;
  cancelButton: string;
  subscribeButton: string;
  subscribingButton: string;
  subscriptionSuccessTitle: string;
  subscriptionSuccessDescription: string;
  subscriptionErrorTitle: string;
  emailRequiredTitle: string;
  emailRequiredDescription: string;
}

// Traducciones para cada idioma
export const podcastTranslations: Record<Language, PodcastTranslations> = {
  es: {
    // Diálogo del reproductor de audio
    audioErrorTitle: "Problema al reproducir el audio",
    audioErrorDescription: "Hemos detectado un problema al reproducir este episodio. ¿Qué acción quieres realizar?",
    audioErrorContent: "El archivo de audio principal no está disponible en este momento. Puedes descargar el archivo para escucharlo más tarde o acceder directamente a la fuente externa.",
    downloadButton: "Descargar (local)",
    openExternalUrlButton: "Abrir URL externa",
    playbackOptions: "Opciones de reproducción",
    audioErrorLabel: "(Problemas al reproducir audio)",
    
    // Componentes del reproductor
    featuredLabel: "Destacado",
    newLabel: "Nuevo",
    playText: "Reproducir",
    listenLatest: "Escuchar último episodio",
    subscribeLabel: "Suscribirse",
    highlightedEpisode: "Episodio destacado:",
    newEpisodesThursday: "Nuevos episodios cada jueves",
    
    // Secciones de la página
    latestEpisodes: "Últimos episodios",
    viewAllEpisodes: "Ver todos los episodios",
    neverMissEpisode: "No te pierdas ningún episodio",
    subscribeNotification: "Suscríbete al podcast de WayBank en tu plataforma favorita y recibe notificaciones cuando se publiquen nuevos episodios.",
    
    // Breadcrumbs y navegación
    backToHome: "Volver al inicio",
    podcastLabel: "Podcast",
    
    // Podcast Promo
    newEpisode: "Nuevo Episodio",
    podcastTitle: "El Podcast DeFi de WayBank",
    podcastDescription: "Escucha nuestro último episodio donde discutimos estrategias de gestión de liquidez y el futuro de DeFi con expertos de la industria.",
    listenNow: "Escuchar Ahora",
    latestEpisode: "Último Episodio",
    everyThursday: "Cada Jueves",
    
    // Filtros y controles
    episodesCount: "episodios",
    viewLabel: "Vista:",
    categoryLabel: "Categoría:",
    allCategories: "Todas las categorías",
    previousButton: "Anterior",
    nextButton: "Siguiente",
    
    // Newsletter subscription dialog
    subscribeNewsletterTitle: "Suscríbete a nuestro newsletter",
    subscribeNewsletterDescription: "Recibe notificaciones de nuevos episodios y contenido exclusivo de nuestro podcast.",
    emailLabel: "Email *",
    emailPlaceholder: "tu@email.com",
    nameLabel: "Nombre (opcional)",
    namePlaceholder: "Tu nombre",
    cancelButton: "Cancelar",
    subscribeButton: "Suscribirse",
    subscribingButton: "Suscribiendo...",
    subscriptionSuccessTitle: "¡Suscripción exitosa!",
    subscriptionSuccessDescription: "Te has suscrito correctamente a nuestro newsletter de podcast.",
    subscriptionErrorTitle: "Error en la suscripción",
    emailRequiredTitle: "Email requerido",
    emailRequiredDescription: "Por favor ingresa tu email para suscribirte."
  },
  
  en: {
    // Diálogo del reproductor de audio
    audioErrorTitle: "Audio Playback Issue",
    audioErrorDescription: "We've detected a problem playing this episode. What would you like to do?",
    audioErrorContent: "The main audio file is not available at the moment. You can download the file to listen later or access the external source directly.",
    downloadButton: "Download (local)",
    openExternalUrlButton: "Open External URL",
    playbackOptions: "Playback Options",
    audioErrorLabel: "(Audio playback issues)",
    
    // Componentes del reproductor
    featuredLabel: "Featured",
    newLabel: "New",
    playText: "Play",
    listenLatest: "Listen to latest episode",
    subscribeLabel: "Subscribe",
    highlightedEpisode: "Highlighted Episode:",
    newEpisodesThursday: "New episodes every Thursday",
    
    // Secciones de la página
    latestEpisodes: "Latest Episodes",
    viewAllEpisodes: "View all episodes",
    neverMissEpisode: "Never Miss an Episode",
    subscribeNotification: "Subscribe to the WayBank podcast on your favorite platform and get notified when new episodes are released.",
    
    // Breadcrumbs y navegación
    backToHome: "Back to home",
    podcastLabel: "Podcast",
    
    // Podcast Promo
    newEpisode: "New Episode",
    podcastTitle: "The WayBank DeFi Podcast",
    podcastDescription: "Tune in to our latest episode where we discuss liquidity management strategies and the future of DeFi with industry experts.",
    listenNow: "Listen Now",
    latestEpisode: "Latest Episode",
    everyThursday: "Every Thursday",
    
    // Filtros y controles
    episodesCount: "episodes",
    viewLabel: "View:",
    categoryLabel: "Category:",
    allCategories: "All categories",
    previousButton: "Previous",
    nextButton: "Next",
    
    // Newsletter subscription dialog
    subscribeNewsletterTitle: "Subscribe to our newsletter",
    subscribeNewsletterDescription: "Get notifications of new episodes and exclusive content from our podcast.",
    emailLabel: "Email *",
    emailPlaceholder: "your@email.com",
    nameLabel: "Name (optional)",
    namePlaceholder: "Your name",
    cancelButton: "Cancel",
    subscribeButton: "Subscribe",
    subscribingButton: "Subscribing...",
    subscriptionSuccessTitle: "Subscription successful!",
    subscriptionSuccessDescription: "You have successfully subscribed to our podcast newsletter.",
    subscriptionErrorTitle: "Subscription error",
    emailRequiredTitle: "Email required",
    emailRequiredDescription: "Please enter your email to subscribe."
  },
  ru: {
    // Diálogo del reproductor de audio
    audioErrorTitle: "Проблема с воспроизведением аудио",
    audioErrorDescription: "Мы обнаружили проблему при воспроизведении этого эпизода. Что бы вы хотели сделать?",
    audioErrorContent: "Основной аудиофайл в данный момент недоступен. Вы можете загрузить файл, чтобы прослушать его позже, или получить доступ к внешнему источнику напрямую.",
    downloadButton: "Скачать (локально)",
    openExternalUrlButton: "Открыть внешнюю ссылку",
    playbackOptions: "Параметры воспроизведения",
    audioErrorLabel: "(Проблемы с воспроизведением аудио)",
    
    // Componentes del reproductor
    featuredLabel: "Рекомендуемое",
    newLabel: "Новое",
    playText: "Воспроизвести",
    listenLatest: "Слушать последний эпизод",
    subscribeLabel: "Подписаться",
    highlightedEpisode: "Выделенный эпизод:",
    newEpisodesThursday: "Новые эпизоды каждый четверг",
    
    // Secciones de la página
    latestEpisodes: "Последние эпизоды",
    viewAllEpisodes: "Просмотреть все эпизоды",
    neverMissEpisode: "Никогда не пропускайте эпизод",
    subscribeNotification: "Подпишитесь на подкаст WayBank на вашей любимой платформе и получайте уведомления о выходе новых эпизодов.",
    
    // Breadcrumbs y navegación
    backToHome: "Назад на главную",
    podcastLabel: "Подкаст",
    
    // Podcast Promo
    newEpisode: "Новый эпизод",
    podcastTitle: "Подкаст WayBank DeFi",
    podcastDescription: "Послушайте наш последний эпизод, где мы обсуждаем стратегии управления ликвидностью и будущее DeFi с экспертами отрасли.",
    listenNow: "Слушать сейчас",
    latestEpisode: "Последний эпизод",
    everyThursday: "Каждый четверг",
    
    // Filtros y controles
    episodesCount: "эпизодов",
    viewLabel: "Просмотр:",
    categoryLabel: "Категория:",
    allCategories: "Все категории",
    previousButton: "Предыдущий",
    nextButton: "Следующий",
    
    // Newsletter subscription dialog
    subscribeNewsletterTitle: "Подпишитесь на нашу рассылку",
    subscribeNewsletterDescription: "Получайте уведомления о новых эпизодах и эксклюзивном контенте нашего подкаста.",
    emailLabel: "Электронная почта *",
    emailPlaceholder: "ваш@email.com",
    nameLabel: "Имя (необязательно)",
    namePlaceholder: "Ваше имя",
    cancelButton: "Отмена",
    subscribeButton: "Подписаться",
    subscribingButton: "Подписка...",
    subscriptionSuccessTitle: "Подписка успешно оформлена!",
    subscriptionSuccessDescription: "Вы успешно подписались на рассылку нашего подкаста.",
    subscriptionErrorTitle: "Ошибка подписки",
    emailRequiredTitle: "Требуется адрес электронной почты",
    emailRequiredDescription: "Пожалуйста, введите свой адрес электронной почты, чтобы подписаться."
  },
  
  fr: {
    // Diálogo del reproductor de audio
    audioErrorTitle: "Problème de lecture audio",
    audioErrorDescription: "Nous avons détecté un problème lors de la lecture de cet épisode. Que souhaitez-vous faire?",
    audioErrorContent: "Le fichier audio principal n'est pas disponible pour le moment. Vous pouvez télécharger le fichier pour l'écouter plus tard ou accéder directement à la source externe.",
    downloadButton: "Télécharger (local)",
    openExternalUrlButton: "Ouvrir URL externe",
    playbackOptions: "Options de lecture",
    audioErrorLabel: "(Problèmes de lecture audio)",
    
    // Componentes del reproductor
    featuredLabel: "En vedette",
    newLabel: "Nouveau",
    playText: "Lecture",
    listenLatest: "Écouter le dernier épisode",
    subscribeLabel: "S'abonner",
    highlightedEpisode: "Épisode en vedette:",
    newEpisodesThursday: "Nouveaux épisodes chaque jeudi",
    
    // Secciones de la página
    latestEpisodes: "Derniers épisodes",
    viewAllEpisodes: "Voir tous les épisodes",
    neverMissEpisode: "Ne manquez aucun épisode",
    subscribeNotification: "Abonnez-vous au podcast WayBank sur votre plateforme préférée et recevez des notifications lors de la sortie de nouveaux épisodes.",
    
    // Breadcrumbs y navegación
    backToHome: "Retour à l'accueil",
    podcastLabel: "Podcast",
    
    // Podcast Promo
    newEpisode: "Nouvel Épisode",
    podcastTitle: "Le Podcast DeFi de WayBank",
    podcastDescription: "Écoutez notre dernier épisode où nous discutons des stratégies de gestion de liquidité et de l'avenir de la DeFi avec des experts du secteur.",
    listenNow: "Écouter Maintenant",
    latestEpisode: "Dernier Épisode",
    everyThursday: "Chaque Jeudi",
    
    // Filtros y controles
    episodesCount: "épisodes",
    viewLabel: "Vue:",
    categoryLabel: "Catégorie:",
    allCategories: "Toutes les catégories",
    previousButton: "Précédent",
    nextButton: "Suivant",
    
    // Newsletter subscription dialog
    subscribeNewsletterTitle: "Abonnez-vous à notre newsletter",
    subscribeNewsletterDescription: "Recevez des notifications de nouveaux épisodes et du contenu exclusif de notre podcast.",
    emailLabel: "Email *",
    emailPlaceholder: "votre@email.com",
    nameLabel: "Nom (optionnel)",
    namePlaceholder: "Votre nom",
    cancelButton: "Annuler",
    subscribeButton: "S'abonner",
    subscribingButton: "Abonnement...",
    subscriptionSuccessTitle: "Abonnement réussi!",
    subscriptionSuccessDescription: "Vous vous êtes abonné avec succès à notre newsletter podcast.",
    subscriptionErrorTitle: "Erreur d'abonnement",
    emailRequiredTitle: "Email requis",
    emailRequiredDescription: "Veuillez entrer votre email pour vous abonner."
  },
  
  de: {
    // Diálogo del reproductor de audio
    audioErrorTitle: "Problem bei der Audiowiedergabe",
    audioErrorDescription: "Wir haben ein Problem bei der Wiedergabe dieser Episode festgestellt. Was möchten Sie tun?",
    audioErrorContent: "Die Hauptaudiodatei ist momentan nicht verfügbar. Sie können die Datei herunterladen, um sie später anzuhören, oder direkt auf die externe Quelle zugreifen.",
    downloadButton: "Herunterladen (lokal)",
    openExternalUrlButton: "Externe URL öffnen",
    playbackOptions: "Wiedergabeoptionen",
    audioErrorLabel: "(Probleme bei der Audiowiedergabe)",
    
    // Componentes del reproductor
    featuredLabel: "Empfohlen",
    newLabel: "Neu",
    playText: "Abspielen",
    listenLatest: "Neueste Episode anhören",
    subscribeLabel: "Abonnieren",
    highlightedEpisode: "Hervorgehobene Episode:",
    newEpisodesThursday: "Neue Episoden jeden Donnerstag",
    
    // Secciones de la página
    latestEpisodes: "Neueste Episoden",
    viewAllEpisodes: "Alle Episoden anzeigen",
    neverMissEpisode: "Verpassen Sie keine Episode",
    subscribeNotification: "Abonnieren Sie den WayBank-Podcast auf Ihrer bevorzugten Plattform und erhalten Sie Benachrichtigungen, wenn neue Episoden veröffentlicht werden.",
    
    // Breadcrumbs y navegación
    backToHome: "Zurück zur Startseite",
    podcastLabel: "Podcast",
    
    // Podcast Promo
    newEpisode: "Neue Folge",
    podcastTitle: "Der WayBank DeFi Podcast",
    podcastDescription: "Hören Sie in unsere neueste Folge rein, in der wir mit Branchenexperten über Liquiditätsmanagement-Strategien und die Zukunft von DeFi diskutieren.",
    listenNow: "Jetzt Anhören",
    latestEpisode: "Neueste Folge",
    everyThursday: "Jeden Donnerstag",
    
    // Filtros y controles
    episodesCount: "Episoden",
    viewLabel: "Ansicht:",
    categoryLabel: "Kategorie:",
    allCategories: "Alle Kategorien",
    previousButton: "Zurück",
    nextButton: "Weiter",
    
    // Newsletter subscription dialog
    subscribeNewsletterTitle: "Abonnieren Sie unseren Newsletter",
    subscribeNewsletterDescription: "Erhalten Sie Benachrichtigungen über neue Episoden und exklusive Inhalte unseres Podcasts.",
    emailLabel: "E-Mail *",
    emailPlaceholder: "ihre@email.com",
    nameLabel: "Name (optional)",
    namePlaceholder: "Ihr Name",
    cancelButton: "Abbrechen",
    subscribeButton: "Abonnieren",
    subscribingButton: "Abonnieren...",
    subscriptionSuccessTitle: "Abonnement erfolgreich!",
    subscriptionSuccessDescription: "Sie haben sich erfolgreich für unseren Podcast-Newsletter angemeldet.",
    subscriptionErrorTitle: "Abonnement-Fehler",
    emailRequiredTitle: "E-Mail erforderlich",
    emailRequiredDescription: "Bitte geben Sie Ihre E-Mail-Adresse ein, um sich anzumelden."
  },
  
  it: {
    // Diálogo del reproductor de audio
    audioErrorTitle: "Problema di riproduzione audio",
    audioErrorDescription: "Abbiamo rilevato un problema durante la riproduzione di questo episodio. Cosa vorresti fare?",
    audioErrorContent: "Il file audio principale non è disponibile al momento. Puoi scaricare il file per ascoltarlo più tardi o accedere direttamente alla fonte esterna.",
    downloadButton: "Scarica (locale)",
    openExternalUrlButton: "Apri URL esterno",
    playbackOptions: "Opzioni di riproduzione",
    audioErrorLabel: "(Problemi di riproduzione audio)",
    
    // Componentes del reproductor
    featuredLabel: "In evidenza",
    newLabel: "Nuovo",
    playText: "Riproduci",
    listenLatest: "Ascolta l'ultimo episodio",
    subscribeLabel: "Iscriviti",
    highlightedEpisode: "Episodio in evidenza:",
    newEpisodesThursday: "Nuovi episodi ogni giovedì",
    
    // Secciones de la página
    latestEpisodes: "Ultimi episodi",
    viewAllEpisodes: "Visualizza tutti gli episodi",
    neverMissEpisode: "Non perdere mai un episodio",
    subscribeNotification: "Iscriviti al podcast WayBank sulla tua piattaforma preferita e ricevi notifiche quando vengono rilasciati nuovi episodi.",
    
    // Breadcrumbs y navegación
    backToHome: "Torna alla home",
    podcastLabel: "Podcast",
    
    // Podcast Promo
    newEpisode: "Nuovo Episodio",
    podcastTitle: "Il Podcast DeFi di WayBank",
    podcastDescription: "Sintonizzati sul nostro ultimo episodio in cui discutiamo di strategie di gestione della liquidità e del futuro di DeFi con esperti del settore.",
    listenNow: "Ascolta Ora",
    latestEpisode: "Ultimo Episodio",
    everyThursday: "Ogni Giovedì",
    
    // Filtros y controles
    episodesCount: "episodi",
    viewLabel: "Vista:",
    categoryLabel: "Categoria:",
    allCategories: "Tutte le categorie",
    previousButton: "Precedente",
    nextButton: "Successivo",
    
    // Newsletter subscription dialog
    subscribeNewsletterTitle: "Iscriviti alla nostra newsletter",
    subscribeNewsletterDescription: "Ricevi notifiche di nuovi episodi e contenuti esclusivi del nostro podcast.",
    emailLabel: "Email *",
    emailPlaceholder: "tua@email.com",
    nameLabel: "Nome (opzionale)",
    namePlaceholder: "Il tuo nome",
    cancelButton: "Annulla",
    subscribeButton: "Iscriviti",
    subscribingButton: "Iscrizione...",
    subscriptionSuccessTitle: "Iscrizione riuscita!",
    subscriptionSuccessDescription: "Ti sei iscritto con successo alla nostra newsletter del podcast.",
    subscriptionErrorTitle: "Errore nell'iscrizione",
    emailRequiredTitle: "Email richiesta",
    emailRequiredDescription: "Inserisci la tua email per iscriverti."
  },
  
  pt: {
    // Diálogo del reproductor de audio
    audioErrorTitle: "Problema na reprodução de áudio",
    audioErrorDescription: "Detectamos um problema ao reproduzir este episódio. O que você gostaria de fazer?",
    audioErrorContent: "O arquivo de áudio principal não está disponível no momento. Você pode baixar o arquivo para ouvir mais tarde ou acessar diretamente a fonte externa.",
    downloadButton: "Baixar (local)",
    openExternalUrlButton: "Abrir URL externa",
    playbackOptions: "Opções de reprodução",
    audioErrorLabel: "(Problemas na reprodução de áudio)",
    
    // Componentes del reproductor
    featuredLabel: "Destaque",
    newLabel: "Novo",
    playText: "Reproduzir",
    listenLatest: "Ouça o episódio mais recente",
    subscribeLabel: "Inscrever-se",
    highlightedEpisode: "Episódio em destaque:",
    newEpisodesThursday: "Novos episódios toda quinta-feira",
    
    // Secciones de la página
    latestEpisodes: "Episódios mais recentes",
    viewAllEpisodes: "Ver todos os episódios",
    neverMissEpisode: "Nunca perca um episódio",
    subscribeNotification: "Inscreva-se no podcast WayBank na sua plataforma favorita e receba notificações quando novos episódios forem lançados.",
    
    // Breadcrumbs y navegación
    backToHome: "Voltar para a página inicial",
    podcastLabel: "Podcast",
    
    // Podcast Promo
    newEpisode: "Novo Episódio",
    podcastTitle: "O Podcast DeFi da WayBank",
    podcastDescription: "Sintonize nosso episódio mais recente onde discutimos estratégias de gerenciamento de liquidez e o futuro do DeFi com especialistas do setor.",
    listenNow: "Ouça Agora",
    latestEpisode: "Episódio mais Recente",
    everyThursday: "Todas as Quintas-feiras",
    
    // Filtros y controles
    episodesCount: "episódios",
    viewLabel: "Visualização:",
    categoryLabel: "Categoria:",
    allCategories: "Todas as categorias",
    previousButton: "Anterior",
    nextButton: "Próximo",
    
    // Newsletter subscription dialog
    subscribeNewsletterTitle: "Inscreva-se em nossa newsletter",
    subscribeNewsletterDescription: "Receba notificações de novos episódios e conteúdo exclusivo do nosso podcast.",
    emailLabel: "Email *",
    emailPlaceholder: "seu@email.com",
    nameLabel: "Nome (opcional)",
    namePlaceholder: "Seu nome",
    cancelButton: "Cancelar",
    subscribeButton: "Inscrever-se",
    subscribingButton: "Inscrevendo...",
    subscriptionSuccessTitle: "Inscrição bem-sucedida!",
    subscriptionSuccessDescription: "Você se inscreveu com sucesso em nossa newsletter do podcast.",
    subscriptionErrorTitle: "Erro na inscrição",
    emailRequiredTitle: "Email obrigatório",
    emailRequiredDescription: "Por favor, insira seu email para se inscrever."
  },
  
  ar: {
    // Diálogo del reproductor de audio
    audioErrorTitle: "مشكلة في تشغيل الصوت",
    audioErrorDescription: "لقد اكتشفنا مشكلة في تشغيل هذه الحلقة. ماذا تريد أن تفعل؟",
    audioErrorContent: "ملف الصوت الرئيسي غير متوفر في الوقت الحالي. يمكنك تنزيل الملف للاستماع إليه لاحقًا أو الوصول مباشرة إلى المصدر الخارجي.",
    downloadButton: "تنزيل (محلي)",
    openExternalUrlButton: "فتح الرابط الخارجي",
    playbackOptions: "خيارات التشغيل",
    audioErrorLabel: "(مشاكل في تشغيل الصوت)",
    
    // Componentes del reproductor
    featuredLabel: "مميز",
    newLabel: "جديد",
    playText: "تشغيل",
    listenLatest: "استمع إلى أحدث حلقة",
    subscribeLabel: "اشترك",
    highlightedEpisode: "الحلقة المميزة:",
    newEpisodesThursday: "حلقات جديدة كل يوم خميس",
    
    // Secciones de la página
    latestEpisodes: "أحدث الحلقات",
    viewAllEpisodes: "عرض جميع الحلقات",
    neverMissEpisode: "لا تفوت أي حلقة",
    subscribeNotification: "اشترك في بودكاست WayBank على منصتك المفضلة واحصل على إشعارات عند إصدار حلقات جديدة.",
    
    // Breadcrumbs y navegación
    backToHome: "العودة إلى الصفحة الرئيسية",
    podcastLabel: "بودكاست",
    
    // Podcast Promo
    newEpisode: "حلقة جديدة",
    podcastTitle: "بودكاست وايبول للتمويل اللامركزي",
    podcastDescription: "استمع إلى أحدث حلقة لدينا حيث نناقش استراتيجيات إدارة السيولة ومستقبل التمويل اللامركزي مع خبراء الصناعة.",
    listenNow: "استمع الآن",
    latestEpisode: "أحدث حلقة",
    everyThursday: "كل يوم خميس",
    
    // Filtros y controles
    episodesCount: "حلقات",
    viewLabel: "عرض:",
    categoryLabel: "الفئة:",
    allCategories: "جميع الفئات",
    previousButton: "السابق",
    nextButton: "التالي",
    
    // Newsletter subscription dialog
    subscribeNewsletterTitle: "اشترك في نشرتنا الإخبارية",
    subscribeNewsletterDescription: "احصل على إشعارات بالحلقات الجديدة والمحتوى الحصري من بودكاستنا.",
    emailLabel: "البريد الإلكتروني *",
    emailPlaceholder: "your@email.com",
    nameLabel: "الاسم (اختياري)",
    namePlaceholder: "اسمك",
    cancelButton: "إلغاء",
    subscribeButton: "اشترك",
    subscribingButton: "جاري الاشتراك...",
    subscriptionSuccessTitle: "تم الاشتراك بنجاح!",
    subscriptionSuccessDescription: "لقد اشتركت بنجاح في نشرتنا الإخبارية للبودكاست.",
    subscriptionErrorTitle: "خطأ في الاشتراك",
    emailRequiredTitle: "البريد الإلكتروني مطلوب",
    emailRequiredDescription: "يرجى إدخال بريدك الإلكتروني للاشتراك."
  },
  
  zh: {
    // Diálogo del reproductor de audio
    audioErrorTitle: "音频播放问题",
    audioErrorDescription: "我们检测到播放此剧集时出现问题。您想怎么做？",
    audioErrorContent: "主音频文件目前不可用。您可以下载文件以便稍后收听，或直接访问外部源。",
    downloadButton: "下载（本地）",
    openExternalUrlButton: "打开外部链接",
    playbackOptions: "播放选项",
    audioErrorLabel: "（音频播放问题）",
    
    // Componentes del reproductor
    featuredLabel: "精选",
    newLabel: "新",
    playText: "播放",
    listenLatest: "收听最新一集",
    subscribeLabel: "订阅",
    highlightedEpisode: "精选剧集：",
    newEpisodesThursday: "每周四更新新剧集",
    
    // Secciones de la página
    latestEpisodes: "最新剧集",
    viewAllEpisodes: "查看所有剧集",
    neverMissEpisode: "永不错过任何剧集",
    subscribeNotification: "在您喜欢的平台上订阅WayBank播客，并在新剧集发布时获得通知。",
    
    // Breadcrumbs y navegación
    backToHome: "返回首页",
    podcastLabel: "播客",
    
    // Podcast Promo
    newEpisode: "新剧集",
    podcastTitle: "WayBank DeFi 播客",
    podcastDescription: "收听我们的最新一集，我们将与行业专家讨论流动性管理策略和去中心化金融的未来。",
    listenNow: "立即收听",
    latestEpisode: "最新剧集",
    everyThursday: "每周四更新",
    
    // Filtros y controles
    episodesCount: "剧集",
    viewLabel: "视图：",
    categoryLabel: "类别：",
    allCategories: "所有类别",
    previousButton: "上一页",
    nextButton: "下一页",
    
    // Newsletter subscription dialog
    subscribeNewsletterTitle: "订阅我们的新闻通讯",
    subscribeNewsletterDescription: "获取新剧集通知和播客独家内容。",
    emailLabel: "邮箱 *",
    emailPlaceholder: "your@email.com",
    nameLabel: "姓名（可选）",
    namePlaceholder: "您的姓名",
    cancelButton: "取消",
    subscribeButton: "订阅",
    subscribingButton: "订阅中...",
    subscriptionSuccessTitle: "订阅成功！",
    subscriptionSuccessDescription: "您已成功订阅我们的播客新闻通讯。",
    subscriptionErrorTitle: "订阅错误",
    emailRequiredTitle: "需要邮箱",
    emailRequiredDescription: "请输入您的邮箱地址以订阅。"
  },
  
  hi: {
    // Diálogo del reproductor de audio
    audioErrorTitle: "ऑडियो प्लेबैक समस्या",
    audioErrorDescription: "हमने इस एपिसोड को चलाने में एक समस्या का पता लगाया है। आप क्या करना चाहेंगे?",
    audioErrorContent: "मुख्य ऑडियो फ़ाइल इस समय उपलब्ध नहीं है। आप बाद में सुनने के लिए फ़ाइल डाउनलोड कर सकते हैं या सीधे बाहरी स्रोत तक पहुंच सकते हैं।",
    downloadButton: "डाउनलोड (स्थानीय)",
    openExternalUrlButton: "बाहरी URL खोलें",
    playbackOptions: "प्लेबैक विकल्प",
    audioErrorLabel: "(ऑडियो प्लेबैक में समस्या)",
    
    // Componentes del reproductor
    featuredLabel: "विशेष रुप से प्रदर्शित",
    newLabel: "नया",
    playText: "चलाएं",
    listenLatest: "नवीनतम एपिसोड सुनें",
    subscribeLabel: "सदस्यता लें",
    highlightedEpisode: "हाइलाइट किया गया एपिसोड:",
    newEpisodesThursday: "हर गुरुवार नए एपिसोड",
    
    // Secciones de la página
    latestEpisodes: "नवीनतम एपिसोड",
    viewAllEpisodes: "सभी एपिसोड देखें",
    neverMissEpisode: "कोई एपिसोड न चूकें",
    subscribeNotification: "अपने पसंदीदा प्लेटफॉर्म पर WayBank पॉडकास्ट की सदस्यता लें और नए एपिसोड जारी होने पर सूचित किए जाएं।",
    
    // Breadcrumbs y navegación
    backToHome: "होम पर वापस जाएं",
    podcastLabel: "पॉडकास्ट",
    
    // Podcast Promo
    newEpisode: "नया एपिसोड",
    podcastTitle: "वेपूल डीफाई पॉडकास्ट",
    podcastDescription: "हमारे नवीनतम एपिसोड में शामिल हों जहां हम उद्योग विशेषज्ञों के साथ तरलता प्रबंधन रणनीतियों और डीफाई के भविष्य पर चर्चा करते हैं।",
    listenNow: "अभी सुनें",
    latestEpisode: "नवीनतम एपिसोड",
    everyThursday: "हर गुरुवार",
    
    // Filtros y controles
    episodesCount: "एपिसोड",
    viewLabel: "दृश्य:",
    categoryLabel: "श्रेणी:",
    allCategories: "सभी श्रेणियां",
    previousButton: "पिछला",
    nextButton: "अगला",
    
    // Newsletter subscription dialog
    subscribeNewsletterTitle: "हमारे न्यूज़लेटर की सदस्यता लें",
    subscribeNewsletterDescription: "नए एपिसोड की सूचना और हमारे पॉडकास्ट की विशेष सामग्री प्राप्त करें।",
    emailLabel: "ईमेल *",
    emailPlaceholder: "your@email.com",
    nameLabel: "नाम (वैकल्पिक)",
    namePlaceholder: "आपका नाम",
    cancelButton: "रद्द करें",
    subscribeButton: "सदस्यता लें",
    subscribingButton: "सदस्यता ली जा रही है...",
    subscriptionSuccessTitle: "सदस्यता सफल!",
    subscriptionSuccessDescription: "आपने हमारे पॉडकास्ट न्यूज़लेटर की सफलतापूर्वक सदस्यता ली है।",
    subscriptionErrorTitle: "सदस्यता त्रुटि",
    emailRequiredTitle: "ईमेल आवश्यक",
    emailRequiredDescription: "सदस्यता लेने के लिए कृपया अपना ईमेल दर्ज करें।"
  }
};

// Función para obtener las traducciones para un idioma específico
export function getPodcastTranslations(language: Language): PodcastTranslations {
  return podcastTranslations[language] || podcastTranslations.es;
}