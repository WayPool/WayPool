/**
 * Traducciones para la página de soporte
 */

import { Language } from "@/context/language-context";
import { useLanguage } from "@/context/language-context";

// Interfaz para las traducciones de la página de soporte
export interface SupportTranslations {
  // Títulos y secciones principales
  supportCenter: string;
  expertAssistance: string;
  refresh: string;
  newTicket: string;
  myTickets: string;
  
  // Guías y prioridades
  supportGuidelines: string;
  priorityLevelGuide: string;
  creatingEffectiveTickets: string;
  responseTimes: string;
  priorityLevelDescription: string;
  
  // Guidelines - bullets
  specificIssue: string;
  includeTransactionHashes: string;
  specifyNetwork: string;
  describeErrorMessages: string;
  
  // Prioridades
  urgent: string;
  high: string;
  medium: string;
  low: string;
  urgentTime: string;
  highTime: string;
  mediumTime: string;
  lowTime: string;
  
  // Mensajes de urgencia
  criticalServiceDisruption: string;
  significantImpact: string;
  generalQuestion: string;
  minorIssue: string;
  
  // Ejemplos
  urgentExample: string;
  highExample: string;
  mediumExample: string;
  lowExample: string;
  
  // Textos de descripción de prioridad
  reserveForEmergencies: string;
  completeInability: string;
  securityBreaches: string;
  platformFailure: string;
  misusePriority: string;
  useForSerious: string;
  transactionErrors: string;
  multiplePositions: string;
  featureNotWorking: string;
  appropriateForCommon: string;
  generalQuestions: string;
  clarificationDetails: string;
  uiIssues: string;
  forNonUrgent: string;
  featureSuggestions: string;
  documentationQuestions: string;
  generalInfo: string;
  
  // Estados de tickets
  open: string;
  inProgress: string;
  resolved: string;
  closed: string;
  category: string;
  
  // Crear ticket
  createSupportTicket: string;
  subject: string;
  enterSubject: string;
  description: string;
  enterDescription: string;
  categoryLabel: string;
  priority: string;
  submit: string;
  cancel: string;
  
  // Diálogo de creación de ticket
  tipsFasterResolution: string;
  includeTransactionHashesTip: string;
  specifyBlockchainNetworkTip: string;
  describeStepsTip: string;
  includeScreenshotsTip: string;
  reserveUrgentText: string;
  standardIssues: string;
  ticketSubjectExample: string;
  
  // Mensajes técnicos
  ticketCreated: string;
  ticketCreatedDesc: string;
  error: string;
  walletError: string;
  walletErrorDesc: string;
  missingFields: string;
  missingFieldsDesc: string;
  emptyMessage: string;
  emptyMessageDesc: string;
  messageSent: string;
  messageSentDesc: string;
  errorLoadingTickets: string;
  errorLoadingMessages: string;
  errorSendingMessage: string;
  errorUpdatingTicket: string;
  ticketUpdated: string;
  ticketUpdatedDesc: string;
  
  // Detalles del ticket
  ticket: string;
  ticketCategory: string;
  created: string;
  updated: string;
  actions: string;
  status: string;
  view: string;
  conversation: string;
  noMessages: string;
  you: string;
  support: string;
  system: string;
  reply: string;
  writeMessage: string;
  closeTicket: string;
  ticketClosed: string;
  closedOn: string;
  reopenTicket: string;
  send: string;
  
  // Mensajes de estado de tickets
  noActiveTickets: string;
  noActiveTicketsDesc: string;
  createNewTicket: string;

  // Categorías
  technicalSupport: string;
  accountIssues: string;
  billingQuestions: string;
  featureRequest: string;
  securityConcern: string;
  other: string;
}

// Traducciones en Español
const es: SupportTranslations = {
  status: "Estado",
  view: "Ver",
  supportCenter: "Centro de Soporte",
  expertAssistance: "Obtenga asistencia experta para sus operaciones blockchain y necesidades de gestión de liquidez",
  refresh: "Actualizar",
  newTicket: "Nuevo Ticket",
  myTickets: "Mis Tickets",
  
  supportGuidelines: "Guías de Soporte",
  priorityLevelGuide: "Guía de Niveles de Prioridad",
  creatingEffectiveTickets: "Crear Tickets Efectivos",
  responseTimes: "Tiempos de Respuesta",
  priorityLevelDescription: "Entendiendo cuándo usar cada nivel de prioridad para asegurar una eficiencia óptima del soporte",
  
  specificIssue: "Sea específico sobre el problema que está experimentando",
  includeTransactionHashes: "Incluya hashes de transacciones relevantes cuando sea aplicable",
  specifyNetwork: "Especifique qué red está utilizando (Ethereum, Polygon, etc.)",
  describeErrorMessages: "Describa cualquier mensaje de error que encuentre",
  
  urgent: "Urgente",
  high: "Alta",
  medium: "Media",
  low: "Baja",
  urgentTime: "2-4 horas",
  highTime: "4-8 horas",
  mediumTime: "24 horas",
  lowTime: "48-72 horas",
  
  criticalServiceDisruption: "Interrupción crítica del servicio",
  significantImpact: "Impacto significativo en operaciones",
  generalQuestion: "Pregunta general o asistencia",
  minorIssue: "Problema menor o sugerencia",
  
  urgentExample: "Fondos bloqueados, problemas de liquidez críticos",
  highExample: "Error en transacción, problemas con NFTs existentes",
  mediumExample: "Preguntas sobre productos, problemas de UI",
  lowExample: "Sugerencias, preguntas generales",
  
  // Textos de descripción de prioridad
  reserveForEmergencies: "Reservar solo para verdaderas emergencias, como:",
  completeInability: "Incapacidad completa para acceder a los fondos",
  securityBreaches: "Brechas de seguridad o transacciones no autorizadas",
  platformFailure: "Fallo completo de la funcionalidad de la plataforma",
  misusePriority: "El mal uso de la prioridad urgente retrasa los tiempos de respuesta para todos los usuarios",
  useForSerious: "Usar para problemas serios que afecten sus operaciones:",
  transactionErrors: "Errores de transacción con valor significativo",
  multiplePositions: "Problemas que afectan múltiples posiciones",
  featureNotWorking: "Función específica que no funciona correctamente",
  appropriateForCommon: "Apropiado para la mayoría de las necesidades de soporte:",
  generalQuestions: "Preguntas generales sobre funciones de la plataforma",
  clarificationDetails: "Aclaración sobre detalles de transacciones",
  uiIssues: "Problemas de interfaz que no impiden el uso",
  forNonUrgent: "Para solicitudes no urgentes:",
  featureSuggestions: "Sugerencias de funciones o comentarios",
  documentationQuestions: "Preguntas sobre documentación",
  generalInfo: "Información general de la plataforma",
  
  open: "Abierto",
  inProgress: "En Progreso",
  resolved: "Resuelto",
  closed: "Cerrado",
  
  createSupportTicket: "Crear Ticket de Soporte",
  subject: "Asunto",
  enterSubject: "Ingrese un asunto para su ticket",
  description: "Descripción",
  enterDescription: "Describa su problema en detalle",
  categoryLabel: "Categoría",
  priority: "Prioridad",
  submit: "Enviar",
  cancel: "Cancelar",
  
  // Diálogo de creación de ticket
  tipsFasterResolution: "Consejos para una resolución más rápida:",
  includeTransactionHashesTip: "Incluya cualquier hash de transacción relevante",
  specifyBlockchainNetworkTip: "Especifique la red blockchain (Ethereum, Polygon, etc.)",
  describeStepsTip: "Describa los pasos que ya ha intentado",
  includeScreenshotsTip: "Incluya capturas de pantalla o mensajes de error si corresponde",
  reserveUrgentText: "Por favor reserve \"Urgente\" solo para emergencias genuinas",
  standardIssues: "Problemas estándar",
  ticketSubjectExample: "Ejemplo: \"Transacción fallida en la red Ethereum\" o \"Necesito ayuda con la conexión de wallet\"",
  
  ticketCreated: "Ticket creado",
  ticketCreatedDesc: "Tu ticket de soporte ha sido creado exitosamente.",
  error: "Error",
  walletError: "Error de Wallet",
  walletErrorDesc: "Por favor conecte su wallet antes de crear un ticket de soporte.",
  missingFields: "Campos faltantes",
  missingFieldsDesc: "Por favor complete todos los campos requeridos.",
  emptyMessage: "Mensaje vacío",
  emptyMessageDesc: "Por favor ingrese un mensaje para enviar.",
  messageSent: "Mensaje enviado",
  messageSentDesc: "Tu mensaje ha sido enviado exitosamente.",
  errorLoadingTickets: "Error al cargar tickets",
  errorLoadingMessages: "Error al cargar mensajes",
  errorSendingMessage: "Error al enviar mensaje",
  errorUpdatingTicket: "Error al actualizar ticket",
  ticketUpdated: "Ticket actualizado",
  ticketUpdatedDesc: "El estado del ticket ha sido actualizado.",
  
  ticket: "Ticket",
  ticketCategory: "Categoría",
  created: "Creado",
  updated: "Actualizado",
  actions: "Acciones",
  conversation: "Conversación",
  noMessages: "No hay mensajes en este ticket todavía.",
  you: "Tú",
  support: "Soporte",
  system: "Sistema",
  reply: "Responder",
  writeMessage: "Escribe tu mensaje aquí...",
  closeTicket: "Cerrar Ticket",
  ticketClosed: "Este ticket está cerrado.",
  closedOn: "Cerrado el",
  reopenTicket: "Reabrir Ticket",
  send: "Enviar",

  // Mensajes de estado de tickets
  noActiveTickets: "No hay tickets de soporte activos",
  noActiveTicketsDesc: "No tienes ningún ticket de soporte activo en este momento. Crea un nuevo ticket si necesitas asistencia.",
  createNewTicket: "Crear nuevo ticket WayBank",
  
  technicalSupport: "Soporte Técnico",
  accountIssues: "Problemas de Cuenta",
  billingQuestions: "Preguntas de Facturación",
  featureRequest: "Solicitud de Función",
  securityConcern: "Preocupación de Seguridad",
  other: "Otro"
};

// Traducciones en Inglés
const en: SupportTranslations = {
  status: "Status",
  view: "View",
  reply: "Reply",
  writeMessage: "Write your message here...",
  closeTicket: "Close Ticket",
  cancel: "Cancel",
  send: "Send",
  ticketClosed: "This ticket is closed.",
  closedOn: "Closed on",
  reopenTicket: "Reopen Ticket",
  you: "You",
  support: "Support",
  system: "System",
  category: "Category",
  created: "Created",
  conversation: "Conversation",
  noMessages: "No messages in this ticket yet.",
  supportCenter: "Support Center",
  expertAssistance: "Get expert assistance for your blockchain operations and liquidity management needs",
  refresh: "Refresh",
  newTicket: "New Ticket",
  myTickets: "My Tickets",
  
  supportGuidelines: "Support Guidelines",
  priorityLevelGuide: "Priority Level Guide",
  creatingEffectiveTickets: "Creating Effective Tickets",
  responseTimes: "Response Times",
  priorityLevelDescription: "Understanding when to use each priority level to ensure optimal support efficiency",
  
  specificIssue: "Be specific about the issue you're experiencing",
  includeTransactionHashes: "Include relevant transaction hashes when applicable",
  specifyNetwork: "Specify which network you're using (Ethereum, Polygon, etc.)",
  describeErrorMessages: "Describe any error messages you encounter",
  
  urgent: "Urgent",
  high: "High",
  medium: "Medium",
  low: "Low",
  urgentTime: "2-4 hours",
  highTime: "4-8 hours",
  mediumTime: "24 hours",
  lowTime: "48-72 hours",
  
  criticalServiceDisruption: "Critical service disruption",
  significantImpact: "Significant operational impact",
  generalQuestion: "General question or assistance",
  minorIssue: "Minor issue or suggestion",
  
  urgentExample: "Funds locked, critical liquidity issues",
  highExample: "Transaction error, existing NFT issues",
  mediumExample: "Product questions, UI problems",
  lowExample: "Suggestions, general inquiries",
  
  // Textos de descripción de prioridad
  reserveForEmergencies: "Reserve for true emergencies only, such as:",
  completeInability: "Complete inability to access funds",
  securityBreaches: "Security breaches or unauthorized transactions",
  platformFailure: "Complete platform functionality failure",
  misusePriority: "Misuse of urgent priority delays response times for all users",
  useForSerious: "Use for serious issues affecting your operations:",
  transactionErrors: "Transaction errors with significant value",
  multiplePositions: "Problems affecting multiple positions",
  featureNotWorking: "Specific feature not working properly",
  appropriateForCommon: "Appropriate for most common support needs:",
  generalQuestions: "General questions about platform features",
  clarificationDetails: "Clarification on transaction details",
  uiIssues: "UI/UX issues that don't prevent usage",
  forNonUrgent: "For non-urgent requests:",
  featureSuggestions: "Feature suggestions or feedback",
  documentationQuestions: "Documentation questions",
  generalInfo: "General platform information",
  
  open: "Open",
  inProgress: "In Progress",
  resolved: "Resolved",
  closed: "Closed",
  
  createSupportTicket: "Create Support Ticket",
  subject: "Subject",
  enterSubject: "Enter a subject for your ticket",
  description: "Description",
  enterDescription: "Describe your issue in detail",
  categoryLabel: "Category",
  priority: "Priority",
  submit: "Submit",

  // Diálogo de creación de ticket
  tipsFasterResolution: "Tips for a faster resolution:",
  includeTransactionHashesTip: "Include any relevant transaction hashes",
  specifyBlockchainNetworkTip: "Specify the blockchain network (Ethereum, Polygon, etc.)",
  describeStepsTip: "Describe any steps you've already tried",
  includeScreenshotsTip: "Include screenshots or error messages if applicable",
  reserveUrgentText: "Please reserve \"Urgent\" for genuine emergencies only",
  standardIssues: "Standard issues",
  ticketSubjectExample: "Example: \"Transaction failed on Ethereum network\" or \"Need assistance with wallet connection\"",
  
  ticketCreated: "Ticket created",
  ticketCreatedDesc: "Your support ticket has been successfully created.",
  error: "Error",
  walletError: "Wallet Error",
  walletErrorDesc: "Please connect your wallet before creating a support ticket.",
  missingFields: "Missing Fields",
  missingFieldsDesc: "Please complete all required fields.",
  emptyMessage: "Empty Message",
  emptyMessageDesc: "Please enter a message to send.",
  messageSent: "Message Sent",
  messageSentDesc: "Your message has been sent successfully.",
  errorLoadingTickets: "Error loading tickets",
  errorLoadingMessages: "Error loading messages",
  errorSendingMessage: "Error sending message",
  errorUpdatingTicket: "Error updating ticket",
  ticketUpdated: "Ticket updated",
  ticketUpdatedDesc: "The ticket status has been updated.",
  
  ticket: "Ticket",
  ticketCategory: "Category",
  updated: "Updated",
  actions: "Actions",

  // Mensajes de estado de tickets
  noActiveTickets: "No Active Support Tickets",
  noActiveTicketsDesc: "You don't have any active support tickets at the moment. Create a new ticket if you need assistance.",
  createNewTicket: "Create New WayBank Ticket",
  
  technicalSupport: "Technical Support",
  accountIssues: "Account Issues",
  billingQuestions: "Billing Questions",
  featureRequest: "Feature Request",
  securityConcern: "Security Concern",
  other: "Other"
};
// Traduzioni in Italiano
const it: SupportTranslations = {
  status: "Stato",
  view: "Visualizza",
  reply: "Rispondi",
  writeMessage: "Scrivi qui il tuo messaggio...",
  closeTicket: "Chiudi Ticket",
  cancel: "Annulla",
  send: "Invia",
  ticketClosed: "Questo ticket è chiuso.",
  closedOn: "Chiuso il",
  reopenTicket: "Riapri Ticket",
  you: "Tu",
  support: "Supporto",
  system: "Sistema",
  category: "Categoria",
  created: "Creato",
  conversation: "Conversazione",
  noMessages: "Nessun messaggio in questo ticket.",
  supportCenter: "Centro Assistenza",
  expertAssistance: "Ottieni assistenza esperta per le tue operazioni blockchain e le tue esigenze di gestione della liquidità",
  refresh: "Aggiorna",
  newTicket: "Nuovo Ticket",
  myTickets: "I miei Ticket",
  
  supportGuidelines: "Linee Guida del Supporto",
  priorityLevelGuide: "Guida al Livello di Priorità",
  creatingEffectiveTickets: "Creare Ticket Efficaci",
  responseTimes: "Tempi di Risposta",
  priorityLevelDescription: "Comprendere quando utilizzare ciascun livello di priorità per garantire un'efficienza ottimale del supporto",
  
  specificIssue: "Sii specifico riguardo al problema che stai riscontrando",
  includeTransactionHashes: "Includi hash di transazione pertinenti, ove applicabile",
  specifyNetwork: "Specifica quale rete stai utilizzando (Ethereum, Polygon, ecc.)",
  describeErrorMessages: "Descrivi eventuali messaggi di errore riscontrati",
  
  urgent: "Urgente",
  high: "Alta",
  medium: "Media",
  low: "Bassa",
  urgentTime: "2-4 ore",
  highTime: "4-8 ore",
  mediumTime: "24 ore",
  lowTime: "48-72 ore",
  
  criticalServiceDisruption: "Interruzione critica del servizio",
  significantImpact: "Impatto operativo significativo",
  generalQuestion: "Domanda generale o assistenza",
  minorIssue: "Problema minore o suggerimento",
  
  urgentExample: "Fondi bloccati, problemi critici di liquidità",
  highExample: "Errore di transazione, problemi NFT esistenti",
  mediumExample: "Domande sul prodotto, problemi UI",
  lowExample: "Suggerimenti, domande generali",
  
  // Textos de descripción de prioridad
  reserveForEmergencies: "Riservare solo per vere emergenze, come:",
  completeInability: "Completa impossibilità di accedere ai fondi",
  securityBreaches: "Violazioni della sicurezza o transazioni non autorizzate",
  platformFailure: "Guasto completo delle funzionalità della piattaforma",
  misusePriority: "L'uso improprio della priorità urgente ritarda i tempi di risposta per tutti gli utenti",
  useForSerious: "Utilizzare per problemi seri che influenzano le tue operazioni:",
  transactionErrors: "Errori di transazione con valore significativo",
  multiplePositions: "Problemi che interessano più posizioni",
  featureNotWorking: "Funzionalità specifica non funziona correttamente",
  appropriateForCommon: "Appropriato per la maggior parte delle esigenze di supporto comuni:",
  generalQuestions: "Domande generali sulle funzionalità della piattaforma",
  clarificationDetails: "Chiarimenti sui dettagli delle transazioni",
  uiIssues: "Problemi UI/UX che non impediscono l'utilizzo",
  forNonUrgent: "Per richieste non urgenti:",
  featureSuggestions: "Suggerimenti o feedback sulle funzionalità",
  documentationQuestions: "Domande sulla documentazione",
  generalInfo: "Informazioni generali sulla piattaforma",
  
  open: "Aperto",
  inProgress: "In Corso",
  resolved: "Risolto",
  closed: "Chiuso",
  
  createSupportTicket: "Crea Ticket di Supporto",
  subject: "Oggetto",
  enterSubject: "Inserisci un oggetto per il tuo ticket",
  description: "Descrizione",
  enterDescription: "Descrivi il tuo problema in dettaglio",
  categoryLabel: "Categoria",
  priority: "Priorità",
  submit: "Invia",

  // Diálogo de creación de ticket
  tipsFasterResolution: "Consigli per una risoluzione più rapida:",
  includeTransactionHashesTip: "Includi eventuali hash di transazione pertinenti",
  specifyBlockchainNetworkTip: "Specifica la rete blockchain (Ethereum, Polygon, ecc.)",
  describeStepsTip: "Descrivi tutti i passaggi che hai già provato",
  includeScreenshotsTip: "Includi screenshot o messaggi di errore, se applicabile",
  reserveUrgentText: "Si prega di riservare \"Urgente\" solo per vere emergenze",
  standardIssues: "Problemi standard",
  ticketSubjectExample: "Esempio: \"Transazione fallita sulla rete Ethereum\" o \"Richiesta di assistenza per la connessione del wallet\"",
  
  ticketCreated: "Ticket creato",
  ticketCreatedDesc: "Il tuo ticket di supporto è stato creato con successo.",
  error: "Errore",
  walletError: "Errore Wallet",
  walletErrorDesc: "Per favore connetti il tuo wallet prima di creare un ticket di supporto.",
  missingFields: "Campi Mancanti",
  missingFieldsDesc: "Per favore completa tutti i campi richiesti.",
  emptyMessage: "Messaggio Vuoto",
  emptyMessageDesc: "Per favore inserisci un messaggio da inviare.",
  messageSent: "Messaggio Inviato",
  messageSentDesc: "Il tuo messaggio è stato inviato con successo.",
  errorLoadingTickets: "Errore durante il caricamento dei ticket",
  errorLoadingMessages: "Errore durante il caricamento dei messaggi",
  errorSendingMessage: "Errore durante l'invio del messaggio",
  errorUpdatingTicket: "Errore durante l'aggiornamento del ticket",
  ticketUpdated: "Ticket aggiornato",
  ticketUpdatedDesc: "Lo stato del ticket è stato aggiornato.",
  
  ticket: "Ticket",
  ticketCategory: "Categoria",
  updated: "Aggiornato",
  actions: "Azioni",

  // Mensajes de estado de tickets
  noActiveTickets: "Nessun Ticket di Supporto Attivo",
  noActiveTicketsDesc: "Al momento non hai ticket di supporto attivi. Crea un nuovo ticket se hai bisogno di assistenza.",
  createNewTicket: "Crea Nuovo Ticket WayBank",
  
  technicalSupport: "Supporto Tecnico",
  accountIssues: "Problemi Account",
  billingQuestions: "Domande di Fatturazione",
  featureRequest: "Richiesta Funzionalità",
  securityConcern: "Problema di Sicurezza",
  other: "Altro"
};
// Traduções em Português
const pt: SupportTranslations = {
  status: "Status",
  view: "Ver",
  reply: "Responder",
  writeMessage: "Escreva sua mensagem aqui...",
  closeTicket: "Fechar Ticket",
  cancel: "Cancelar",
  send: "Enviar",
  ticketClosed: "Este ticket está fechado.",
  closedOn: "Fechado em",
  reopenTicket: "Reabrir Ticket",
  you: "Você",
  support: "Suporte",
  system: "Sistema",
  category: "Categoria",
  created: "Criado em",
  conversation: "Conversa",
  noMessages: "Nenhuma mensagem neste ticket ainda.",
  supportCenter: "Central de Suporte",
  expertAssistance: "Obtenha assistência especializada para suas operações de blockchain e necessidades de gestão de liquidez",
  refresh: "Atualizar",
  newTicket: "Novo Ticket",
  myTickets: "Meus Tickets",
  
  supportGuidelines: "Diretrizes de Suporte",
  priorityLevelGuide: "Guia de Nível de Prioridade",
  creatingEffectiveTickets: "Criando Tickets Eficazes",
  responseTimes: "Tempos de Resposta",
  priorityLevelDescription: "Entenda quando usar cada nível de prioridade para garantir a eficiência ideal do suporte",
  
  specificIssue: "Seja específico sobre o problema que você está enfrentando",
  includeTransactionHashes: "Inclua hashes de transação relevantes, quando aplicável",
  specifyNetwork: "Especifique qual rede você está usando (Ethereum, Polygon, etc.)",
  describeErrorMessages: "Descreva quaisquer mensagens de erro que você encontrar",
  
  urgent: "Urgente",
  high: "Alta",
  medium: "Média",
  low: "Baixa",
  urgentTime: "2-4 horas",
  highTime: "4-8 horas",
  mediumTime: "24 horas",
  lowTime: "48-72 horas",
  
  criticalServiceDisruption: "Interrupção crítica do serviço",
  significantImpact: "Impacto operacional significativo",
  generalQuestion: "Pergunta geral ou assistência",
  minorIssue: "Problema menor ou sugestão",
  
  urgentExample: "Fundos bloqueados, problemas críticos de liquidez",
  highExample: "Erro de transação, problemas com NFTs existentes",
  mediumExample: "Perguntas sobre o produto, problemas de UI",
  lowExample: "Sugestões, dúvidas gerais",
  
  // Textos de descrição de prioridade
  reserveForEmergencies: "Reserve apenas para emergências reais, como:",
  completeInability: "Incapacidade total de acessar fundos",
  securityBreaches: "Violações de segurança ou transações não autorizadas",
  platformFailure: "Falha completa da funcionalidade da plataforma",
  misusePriority: "O uso indevido da prioridade urgente atrasa os tempos de resposta para todos os usuários",
  useForSerious: "Use para problemas sérios que afetam suas operações:",
  transactionErrors: "Erros de transação com valor significativo",
  multiplePositions: "Problemas que afetam múltiplas posições",
  featureNotWorking: "Recurso específico não funciona corretamente",
  appropriateForCommon: "Adequado para a maioria das necessidades comuns de suporte:",
  generalQuestions: "Perguntas gerais sobre os recursos da plataforma",
  clarificationDetails: "Esclarecimento sobre detalhes da transação",
  uiIssues: "Problemas de UI/UX que não impedem o uso",
  forNonUrgent: "Para solicitações não urgentes:",
  featureSuggestions: "Sugestões de recursos ou feedback",
  documentationQuestions: "Perguntas sobre documentação",
  generalInfo: "Informações gerais da plataforma",
  
  open: "Aberto",
  inProgress: "Em Andamento",
  resolved: "Resolvido",
  closed: "Fechado",
  
  createSupportTicket: "Criar Ticket de Suporte",
  subject: "Assunto",
  enterSubject: "Insira um assunto para o seu ticket",
  description: "Descrição",
  enterDescription: "Descreva seu problema em detalhes",
  categoryLabel: "Categoria",
  priority: "Prioridade",
  submit: "Enviar",

  // Diálogo de criação de ticket
  tipsFasterResolution: "Dicas para uma resolução mais rápida:",
  includeTransactionHashesTip: "Inclua quaisquer hashes de transação relevantes",
  specifyBlockchainNetworkTip: "Especifique a rede blockchain (Ethereum, Polygon, etc.)",
  describeStepsTip: "Descreva quaisquer passos que você já tentou",
  includeScreenshotsTip: "Inclua capturas de tela ou mensagens de erro, se aplicável",
  reserveUrgentText: "Por favor, reserve \"Urgente\" apenas para emergências genuínas",
  standardIssues: "Problemas padrão",
  ticketSubjectExample: "Exemplo: \"Transação falhou na rede Ethereum\" ou \"Preciso de ajuda com a conexão da carteira\"",
  
  ticketCreated: "Ticket criado",
  ticketCreatedDesc: "Seu ticket de suporte foi criado com sucesso.",
  error: "Erro",
  walletError: "Erro da Carteira",
  walletErrorDesc: "Por favor, conecte sua carteira antes de criar um ticket de suporte.",
  missingFields: "Campos Faltando",
  missingFieldsDesc: "Por favor, preencha todos os campos obrigatórios.",
  emptyMessage: "Mensagem Vazia",
  emptyMessageDesc: "Por favor, insira uma mensagem para enviar.",
  messageSent: "Mensagem Enviada",
  messageSentDesc: "Sua mensagem foi enviada com sucesso.",
  errorLoadingTickets: "Erro ao carregar tickets",
  errorLoadingMessages: "Erro ao carregar mensagens",
  errorSendingMessage: "Erro ao enviar mensagem",
  errorUpdatingTicket: "Erro ao atualizar ticket",
  ticketUpdated: "Ticket atualizado",
  ticketUpdatedDesc: "O status do ticket foi atualizado.",
  
  ticket: "Ticket",
  ticketCategory: "Categoria",
  updated: "Atualizado",
  actions: "Ações",

  // Mensajes de estado de tickets
  noActiveTickets: "Nenhum Ticket de Suporte Ativo",
  noActiveTicketsDesc: "Você não tem nenhum ticket de suporte ativo no momento. Crie um novo ticket se precisar de assistência.",
  createNewTicket: "Criar Novo Ticket WayBank",
  
  technicalSupport: "Suporte Técnico",
  accountIssues: "Problemas de Conta",
  billingQuestions: "Perguntas de Faturamento",
  featureRequest: "Solicitação de Recurso",
  securityConcern: "Preocupação de Segurança",
  other: "Outro"
};
// Traduções em Árabe
const ar: SupportTranslations = {
  status: "الحالة",
  view: "عرض",
  reply: "رد",
  writeMessage: "اكتب رسالتك هنا...",
  closeTicket: "إغلاق التذكرة",
  cancel: "إلغاء",
  send: "إرسال",
  ticketClosed: "هذه التذكرة مغلقة.",
  closedOn: "أُغلقت في",
  reopenTicket: "إعادة فتح التذكرة",
  you: "أنت",
  support: "الدعم",
  system: "النظام",
  category: "الفئة",
  created: "تاريخ الإنشاء",
  conversation: "المحادثة",
  noMessages: "لا توجد رسائل في هذه التذكرة بعد.",
  supportCenter: "مركز الدعم",
  expertAssistance: "احصل على مساعدة الخبراء لعمليات البلوكشين واحتياجات إدارة السيولة",
  refresh: "تحديث",
  newTicket: "تذكرة جديدة",
  myTickets: "تذاكري",
  
  supportGuidelines: "إرشادات الدعم",
  priorityLevelGuide: "دليل مستوى الأولوية",
  creatingEffectiveTickets: "إنشاء تذاكر فعالة",
  responseTimes: "أوقات الاستجابة",
  priorityLevelDescription: "فهم متى يجب استخدام كل مستوى أولوية لضمان كفاءة الدعم المثلى",
  
  specificIssue: "كن محددًا بشأن المشكلة التي تواجهها",
  includeTransactionHashes: "قم بتضمين تجزئات المعاملات ذات الصلة عند الاقتضاء",
  specifyNetwork: "حدد الشبكة التي تستخدمها (Ethereum, Polygon, إلخ.)",
  describeErrorMessages: "صف أي رسائل خطأ تواجهها",
  
  urgent: "عاجل",
  high: "عالية",
  medium: "متوسطة",
  low: "منخفضة",
  urgentTime: "2-4 ساعات",
  highTime: "4-8 ساعات",
  mediumTime: "24 ساعة",
  lowTime: "48-72 ساعة",
  
  criticalServiceDisruption: "انقطاع حرج في الخدمة",
  significantImpact: "تأثير تشغيلي كبير",
  generalQuestion: "سؤال عام أو مساعدة",
  minorIssue: "مشكلة بسيطة أو اقتراح",
  
  urgentExample: "أموال محجوبة، مشاكل سيولة حرجة",
  highExample: "خطأ في المعاملة، مشاكل NFT موجودة",
  mediumExample: "أسئلة حول المنتج، مشاكل في واجهة المستخدم",
  lowExample: "اقتراحات، استفسارات عامة",
  
  // Textos de descripción de prioridad
  reserveForEmergencies: "احتفظ به للحالات الطارئة الحقيقية فقط، مثل:",
  completeInability: "عدم القدرة الكاملة على الوصول إلى الأموال",
  securityBreaches: "اختراقات أمنية أو معاملات غير مصرح بها",
  platformFailure: "فشل كامل لوظائف المنصة",
  misusePriority: "سوء استخدام الأولوية العاجلة يؤخر أوقات الاستجابة لجميع المستخدمين",
  useForSerious: "استخدمه للمشاكل الخطيرة التي تؤثر على عملياتك:",
  transactionErrors: "أخطاء في المعاملات ذات القيمة الكبيرة",
  multiplePositions: "مشاكل تؤثر على عدة مراكز",
  featureNotWorking: "ميزة معينة لا تعمل بشكل صحيح",
  appropriateForCommon: "مناسب لمعظم احتياجات الدعم الشائعة:",
  generalQuestions: "أسئلة عامة حول ميزات المنصة",
  clarificationDetails: "توضيح حول تفاصيل المعاملة",
  uiIssues: "مشاكل واجهة المستخدم/تجربة المستخدم التي لا تمنع الاستخدام",
  forNonUrgent: "للطلبات غير العاجلة:",
  featureSuggestions: "اقتراحات الميزات أو الملاحظات",
  documentationQuestions: "أسئلة الوثائق",
  generalInfo: "معلومات عامة عن المنصة",
  
  open: "مفتوح",
  inProgress: "قيد التقدم",
  resolved: "تم الحل",
  closed: "مغلق",
  
  createSupportTicket: "إنشاء تذكرة دعم",
  subject: "الموضوع",
  enterSubject: "أدخل موضوع تذكرتك",
  description: "الوصف",
  enterDescription: "صف مشكلتك بالتفصيل",
  categoryLabel: "الفئة",
  priority: "الأولوية",
  submit: "إرسال",

  // Diálogo de creación de ticket
  tipsFasterResolution: "نصائح لحل أسرع:",
  includeTransactionHashesTip: "تضمين أي تجزئات معاملات ذات صلة",
  specifyBlockchainNetworkTip: "تحديد شبكة البلوكشين (Ethereum, Polygon, إلخ.)",
  describeStepsTip: "صف أي خطوات قمت بتجربتها بالفعل",
  includeScreenshotsTip: "تضمين لقطات شاشة أو رسائل خطأ إن أمكن",
  reserveUrgentText: "يرجى حجز \"عاجل\" لحالات الطوارئ الحقيقية فقط",
  standardIssues: "المشاكل القياسية",
  ticketSubjectExample: "مثال: \"فشلت المعاملة على شبكة Ethereum\" أو \"أحتاج إلى مساعدة في اتصال المحفظة\"",
  
  ticketCreated: "تم إنشاء التذكرة",
  ticketCreatedDesc: "تم إنشاء تذكرة الدعم الخاصة بك بنجاح.",
  error: "خطأ",
  walletError: "خطأ في المحفظة",
  walletErrorDesc: "يرجى توصيل محفظتك قبل إنشاء تذكرة دعم.",
  missingFields: "حقول مفقودة",
  missingFieldsDesc: "يرجى إكمال جميع الحقول المطلوبة.",
  emptyMessage: "رسالة فارغة",
  emptyMessageDesc: "يرجى إدخال رسالة لإرسالها.",
  messageSent: "تم إرسال الرسالة",
  messageSentDesc: "تم إرسال رسالتك بنجاح.",
  errorLoadingTickets: "خطأ في تحميل التذاكر",
  errorLoadingMessages: "خطأ في تحميل الرسائل",
  errorSendingMessage: "خطأ في إرسال الرسالة",
  errorUpdatingTicket: "خطأ في تحديث التذكرة",
  ticketUpdated: "تم تحديث التذكرة",
  ticketUpdatedDesc: "تم تحديث حالة التذكرة.",
  
  ticket: "تذكرة",
  ticketCategory: "الفئة",
  updated: "تاريخ التحديث",
  actions: "الإجراءات",

  // Mensajes de estado de tickets
  noActiveTickets: "لا توجد تذاكر دعم نشطة",
  noActiveTicketsDesc: "ليس لديك أي تذاكر دعم نشطة حاليًا. أنشئ تذكرة جديدة إذا كنت بحاجة إلى مساعدة.",
  createNewTicket: "إنشاء تذكرة WayBank جديدة",
  
  technicalSupport: "الدعم الفني",
  accountIssues: "مشاكل الحساب",
  billingQuestions: "أسئلة الفواتير",
  featureRequest: "طلب ميزة",
  securityConcern: "مخاوف أمنية",
  other: "أخرى"
};
// Traduções em Hindi
const hi: SupportTranslations = {
  status: "स्थिति",
  view: "देखें",
  reply: "उत्तर दें",
  writeMessage: "अपना संदेश यहाँ लिखें...",
  closeTicket: "टिकट बंद करें",
  cancel: "रद्द करें",
  send: "भेजें",
  ticketClosed: "यह टिकट बंद है।",
  closedOn: "पर बंद हुआ",
  reopenTicket: "टिकट फिर से खोलें",
  you: "आप",
  support: "समर्थन",
  system: "सिस्टम",
  category: "श्रेणी",
  created: "बनाया गया",
  conversation: "बातचीत",
  noMessages: "इस टिकट में अभी तक कोई संदेश नहीं है।",
  supportCenter: "सहायता केंद्र",
  expertAssistance: "अपने ब्लॉकचेन संचालन और तरलता प्रबंधन आवश्यकताओं के लिए विशेषज्ञ सहायता प्राप्त करें",
  refresh: "ताज़ा करें",
  newTicket: "नया टिकट",
  myTickets: "मेरे टिकट",
  
  supportGuidelines: "समर्थन दिशानिर्देश",
  priorityLevelGuide: "प्राथमिकता स्तर मार्गदर्शिका",
  creatingEffectiveTickets: "प्रभावी टिकट बनाना",
  responseTimes: "प्रतिक्रिया समय",
  priorityLevelDescription: "इष्टतम समर्थन दक्षता सुनिश्चित करने के लिए प्रत्येक प्राथमिकता स्तर का उपयोग कब करना है, यह समझना",
  
  specificIssue: "आप जिस समस्या का सामना कर रहे हैं, उसके बारे में विशिष्ट रहें",
  includeTransactionHashes: "लागू होने पर प्रासंगिक लेनदेन हैश शामिल करें",
  specifyNetwork: "उस नेटवर्क को निर्दिष्ट करें जिसका आप उपयोग कर रहे हैं (Ethereum, Polygon, आदि)",
  describeErrorMessages: "आपको मिलने वाले किसी भी त्रुटि संदेश का वर्णन करें",
  
  urgent: "अति आवश्यक",
  high: "उच्च",
  medium: "मध्यम",
  low: "निम्न",
  urgentTime: "2-4 घंटे",
  highTime: "4-8 घंटे",
  mediumTime: "24 घंटे",
  lowTime: "48-72 घंटे",
  
  criticalServiceDisruption: "गंभीर सेवा व्यवधान",
  significantImpact: "महत्वपूर्ण परिचालन प्रभाव",
  generalQuestion: "सामान्य प्रश्न या सहायता",
  minorIssue: "मामूली समस्या या सुझाव",
  
  urgentExample: "फंड लॉक, गंभीर तरलता समस्याएँ",
  highExample: "लेनदेन त्रुटि, मौजूदा NFT समस्याएँ",
  mediumExample: "उत्पाद संबंधी प्रश्न, UI समस्याएँ",
  lowExample: "सुझाव, सामान्य पूछताछ",
  
  // Textos de descripción de prioridad
  reserveForEmergencies: "केवल वास्तविक आपात स्थितियों के लिए आरक्षित करें, जैसे:",
  completeInability: "फंड तक पहुंचने में पूर्ण अक्षमता",
  securityBreaches: "सुरक्षा उल्लंघन या अनधिकृत लेनदेन",
  platformFailure: "पूर्ण प्लेटफ़ॉर्म कार्यक्षमता विफलता",
  misusePriority: "तत्काल प्राथमिकता का दुरुपयोग सभी उपयोगकर्ताओं के लिए प्रतिक्रिया समय में देरी करता है",
  useForSerious: "अपने संचालन को प्रभावित करने वाले गंभीर मुद्दों के लिए उपयोग करें:",
  transactionErrors: "महत्वपूर्ण मूल्य के साथ लेनदेन त्रुटियाँ",
  multiplePositions: "कई पदों को प्रभावित करने वाली समस्याएँ",
  featureNotWorking: "विशिष्ट सुविधा ठीक से काम नहीं कर रही है",
  appropriateForCommon: "अधिकांश सामान्य समर्थन आवश्यकताओं के लिए उपयुक्त:",
  generalQuestions: "प्लेटफ़ॉर्म सुविधाओं के बारे में सामान्य प्रश्न",
  clarificationDetails: "लेनदेन विवरण पर स्पष्टीकरण",
  uiIssues: "UI/UX समस्याएँ जो उपयोग को नहीं रोकतीं",
  forNonUrgent: "गैर-तत्काल अनुरोधों के लिए:",
  featureSuggestions: "सुविधा सुझाव या प्रतिक्रिया",
  documentationQuestions: "दस्तावेज़ संबंधी प्रश्न",
  generalInfo: "सामान्य प्लेटफ़ॉर्म जानकारी",
  
  open: "खुला",
  inProgress: "प्रगति पर",
  resolved: "हल किया गया",
  closed: "बंद",
  
  createSupportTicket: "समर्थन टिकट बनाएं",
  subject: "विषय",
  enterSubject: "अपने टिकट के लिए एक विषय दर्ज करें",
  description: "विवरण",
  enterDescription: "अपनी समस्या का विस्तार से वर्णन करें",
  categoryLabel: "श्रेणी",
  priority: "प्राथमिकता",
  submit: "जमा करें",

  // Diálogo de creación de ticket
  tipsFasterResolution: "तेज़ समाधान के लिए युक्तियाँ:",
  includeTransactionHashesTip: "किसी भी प्रासंगिक लेनदेन हैश को शामिल करें",
  specifyBlockchainNetworkTip: "ब्लॉकचेन नेटवर्क निर्दिष्ट करें (Ethereum, Polygon, आदि)",
  describeStepsTip: "आपके द्वारा पहले से आजमाए गए किसी भी कदम का वर्णन करें",
  includeScreenshotsTip: "यदि लागू हो तो स्क्रीनशॉट या त्रुटि संदेश शामिल करें",
  reserveUrgentText: "कृपया \"तत्काल\" को केवल वास्तविक आपात स्थितियों के लिए आरक्षित करें",
  standardIssues: "मानक समस्याएँ",
  ticketSubjectExample: "उदाहरण: \"एथेरियम नेटवर्क पर लेनदेन विफल\" या \"वॉलेट कनेक्शन के साथ सहायता की आवश्यकता है\"",
  
  ticketCreated: "टिकट बनाया गया",
  ticketCreatedDesc: "आपका समर्थन टिकट सफलतापूर्वक बनाया गया है।",
  error: "त्रुटि",
  walletError: "वॉलेट त्रुटि",
  walletErrorDesc: "समर्थन टिकट बनाने से पहले कृपया अपना वॉलेट कनेक्ट करें।",
  missingFields: "छूटे हुए फ़ील्ड",
  missingFieldsDesc: "कृपया सभी आवश्यक फ़ील्ड भरें।",
  emptyMessage: "खाली संदेश",
  emptyMessageDesc: "कृपया भेजने के लिए एक संदेश दर्ज करें।",
  messageSent: "संदेश भेजा गया",
  messageSentDesc: "आपका संदेश सफलतापूर्वक भेजा गया है।",
  errorLoadingTickets: "टिकट लोड करने में त्रुटि",
  errorLoadingMessages: "संदेश लोड करने में त्रुटि",
  errorSendingMessage: "संदेश भेजने में त्रुटि",
  errorUpdatingTicket: "टिकट अपडेट करने में त्रुटि",
  ticketUpdated: "टिकट अपडेट किया गया",
  ticketUpdatedDesc: "टिकट की स्थिति अपडेट कर दी गई है।",
  
  ticket: "टिकट",
  ticketCategory: "श्रेणी",
  updated: "अपडेट किया गया",
  actions: "कार्य",

  // Mensajes de estado de tickets
  noActiveTickets: "कोई सक्रिय समर्थन टिकट नहीं",
  noActiveTicketsDesc: "आपके पास वर्तमान में कोई सक्रिय समर्थन टिकट नहीं है। यदि आपको सहायता की आवश्यकता है तो एक नया टिकट बनाएं।",
  createNewTicket: "नया WayBank टिकट बनाएं",
  
  technicalSupport: "तकनीकी सहायता",
  accountIssues: "खाता संबंधी समस्याएँ",
  billingQuestions: "बिलिंग प्रश्न",
  featureRequest: "सुविधा अनुरोध",
  securityConcern: "सुरक्षा चिंता",
  other: "अन्य"
};
// Traduções em Chinês
const zh: SupportTranslations = {
  status: "状态",
  view: "查看",
  reply: "回复",
  writeMessage: "在此处写入您的消息...",
  closeTicket: "关闭工单",
  cancel: "取消",
  send: "发送",
  ticketClosed: "此工单已关闭。",
  closedOn: "关闭于",
  reopenTicket: "重新打开工单",
  you: "您",
  support: "支持",
  system: "系统",
  category: "类别",
  created: "创建于",
  conversation: "对话",
  noMessages: "此工单中还没有消息。",
  supportCenter: "支持中心",
  expertAssistance: "为您的区块链操作和流动性管理需求获取专家协助",
  refresh: "刷新",
  newTicket: "新工单",
  myTickets: "我的工单",
  
  supportGuidelines: "支持指南",
  priorityLevelGuide: "优先级指南",
  creatingEffectiveTickets: "创建有效工单",
  responseTimes: "响应时间",
  priorityLevelDescription: "了解何时使用每个优先级级别以确保最佳支持效率",
  
  specificIssue: "请具体说明您遇到的问题",
  includeTransactionHashes: "在适用时包含相关交易哈希",
  specifyNetwork: "指定您正在使用的网络（以太坊、Polygon 等）",
  describeErrorMessages: "描述您遇到的任何错误消息",
  
  urgent: "紧急",
  high: "高",
  medium: "中",
  low: "低",
  urgentTime: "2-4 小时",
  highTime: "4-8 小时",
  mediumTime: "24 小时",
  lowTime: "48-72 小时",
  
  criticalServiceDisruption: "关键服务中断",
  significantImpact: "重大操作影响",
  generalQuestion: "一般问题或协助",
  minorIssue: "小问题或建议",
  
  urgentExample: "资金锁定，关键流动性问题",
  highExample: "交易错误，现有 NFT 问题",
  mediumExample: "产品问题，UI 问题",
  lowExample: "建议，一般查询",
  
  // Textos de descripción de prioridad
  reserveForEmergencies: "仅限真正的紧急情况，例如：",
  completeInability: "完全无法访问资金",
  securityBreaches: "安全漏洞或未经授权的交易",
  platformFailure: "平台功能完全失效",
  misusePriority: "滥用紧急优先级会延迟所有用户的响应时间",
  useForSerious: "用于影响您操作的严重问题：",
  transactionErrors: "具有重大价值的交易错误",
  multiplePositions: "影响多个头寸的问题",
  featureNotWorking: "特定功能无法正常工作",
  appropriateForCommon: "适用于大多数常见支持需求：",
  generalQuestions: "有关平台功能的常见问题",
  clarificationDetails: "交易详情澄清",
  uiIssues: "不影响使用的 UI/UX 问题",
  forNonUrgent: "对于非紧急请求：",
  featureSuggestions: "功能建议或反馈",
  documentationQuestions: "文档问题",
  generalInfo: "一般平台信息",
  
  open: "开放",
  inProgress: "处理中",
  resolved: "已解决",
  closed: "已关闭",
  
  createSupportTicket: "创建支持工单",
  subject: "主题",
  enterSubject: "输入您的工单主题",
  description: "描述",
  enterDescription: "详细描述您的问题",
  categoryLabel: "类别",
  priority: "优先级",
  submit: "提交",

  // Diálogo de creación de ticket
  tipsFasterResolution: "更快解决的技巧：",
  includeTransactionHashesTip: "包含任何相关的交易哈希",
  specifyBlockchainNetworkTip: "指定区块链网络（以太坊、Polygon 等）",
  describeStepsTip: "描述您已经尝试过的任何步骤",
  includeScreenshotsTip: "如果适用，包含屏幕截图或错误消息",
  reserveUrgentText: "请将“紧急”仅保留给真正的紧急情况",
  standardIssues: "标准问题",
  ticketSubjectExample: "示例：“以太坊网络上的交易失败”或“需要钱包连接帮助”",
  
  ticketCreated: "工单已创建",
  ticketCreatedDesc: "您的支持工单已成功创建。",
  error: "错误",
  walletError: "钱包错误",
  walletErrorDesc: "请在创建支持工单之前连接您的钱包。",
  missingFields: "缺少字段",
  missingFieldsDesc: "请填写所有必填字段。",
  emptyMessage: "空消息",
  emptyMessageDesc: "请输入要发送的消息。",
  messageSent: "消息已发送",
  messageSentDesc: "您的消息已成功发送。",
  errorLoadingTickets: "加载工单时出错",
  errorLoadingMessages: "加载消息时出错",
  errorSendingMessage: "发送消息时出错",
  errorUpdatingTicket: "更新工单时出错",
  ticketUpdated: "工单已更新",
  ticketUpdatedDesc: "工单状态已更新。",
  
  ticket: "工单",
  ticketCategory: "类别",
  updated: "已更新",
  actions: "操作",

  // Mensajes de estado de tickets
  noActiveTickets: "无活跃支持工单",
  noActiveTicketsDesc: "您目前没有活跃的支持工单。如果您需要帮助，请创建新工单。",
  createNewTicket: "创建新的 WayBank 工单",
  
  technicalSupport: "技术支持",
  accountIssues: "账户问题",
  billingQuestions: "账单问题",
  featureRequest: "功能请求",
  securityConcern: "安全问题",
  other: "其他"
};
// Traducciones en Francés
const fr: SupportTranslations = {
  status: "Statut",
  view: "Voir",
  supportCenter: "Centre d'assistance",
  expertAssistance: "Obtenez une assistance d'expert pour vos opérations blockchain et vos besoins de gestion de liquidité",
  refresh: "Actualiser",
  newTicket: "Nouveau Ticket",
  myTickets: "Mes Tickets",
  
  supportGuidelines: "Directives d'assistance",
  priorityLevelGuide: "Guide des niveaux de priorité",
  creatingEffectiveTickets: "Créer des tickets efficaces",
  responseTimes: "Temps de réponse",
  priorityLevelDescription: "Comprendre quand utiliser chaque niveau de priorité pour assurer une efficacité optimale du support",
  
  specificIssue: "Soyez précis sur le problème que vous rencontrez",
  includeTransactionHashes: "Incluez les hachages de transaction pertinents le cas échéant",
  specifyNetwork: "Spécifiez quel réseau vous utilisez (Ethereum, Polygon, etc.)",
  describeErrorMessages: "Décrivez les messages d'erreur que vous rencontrez",
  
  urgent: "Urgent",
  high: "Élevé",
  medium: "Moyen",
  low: "Faible",
  urgentTime: "2-4 heures",
  highTime: "4-8 heures",
  mediumTime: "24 heures",
  lowTime: "48-72 heures",
  
  criticalServiceDisruption: "Perturbation critique du service",
  significantImpact: "Impact opérationnel significatif",
  generalQuestion: "Question générale ou assistance",
  minorIssue: "Problème mineur ou suggestion",
  
  urgentExample: "Fonds bloqués, problèmes critiques de liquidité",
  highExample: "Erreur de transaction, problèmes avec les NFT existants",
  mediumExample: "Questions sur les produits, problèmes d'interface utilisateur",
  lowExample: "Suggestions, demandes générales",
  
  // Textos de descripción de prioridad
  reserveForEmergencies: "Réservé aux véritables urgences, comme:",
  completeInability: "Incapacité totale d'accéder aux fonds",
  securityBreaches: "Violations de sécurité ou transactions non autorisées",
  platformFailure: "Défaillance complète des fonctionnalités de la plateforme",
  misusePriority: "L'abus de la priorité d'urgence retarde les délais de réponse pour tous les utilisateurs",
  useForSerious: "Utilisez pour les problèmes graves affectant vos opérations:",
  transactionErrors: "Erreurs de transaction avec valeur significative",
  multiplePositions: "Problèmes affectant plusieurs positions",
  featureNotWorking: "Fonctionnalité spécifique ne fonctionnant pas correctement",
  appropriateForCommon: "Approprié pour la plupart des besoins d'assistance courants:",
  generalQuestions: "Questions générales sur les fonctionnalités de la plateforme",
  clarificationDetails: "Clarification sur les détails de la transaction",
  uiIssues: "Problèmes d'interface utilisateur qui n'empêchent pas l'utilisation",
  forNonUrgent: "Pour les demandes non urgentes:",
  featureSuggestions: "Suggestions de fonctionnalités ou feedback",
  documentationQuestions: "Questions sur la documentation",
  generalInfo: "Informations générales sur la plateforme",
  
  open: "Ouvert",
  inProgress: "En cours",
  resolved: "Résolu",
  closed: "Fermé",
  
  createSupportTicket: "Créer un ticket d'assistance",
  subject: "Sujet",
  enterSubject: "Entrez un sujet pour votre ticket",
  description: "Description",
  enterDescription: "Décrivez votre problème en détail",
  categoryLabel: "Catégorie",
  priority: "Priorité",
  submit: "Soumettre",
  cancel: "Annuler",
  
  // Diálogo de creación de ticket
  tipsFasterResolution: "Conseils pour une résolution plus rapide:",
  includeTransactionHashesTip: "Inclure tout hachage de transaction pertinent",
  specifyBlockchainNetworkTip: "Spécifiez le réseau blockchain (Ethereum, Polygon, etc.)",
  describeStepsTip: "Décrivez les étapes que vous avez déjà essayées",
  includeScreenshotsTip: "Incluez des captures d'écran ou des messages d'erreur si applicable",
  reserveUrgentText: "Veuillez réserver \"Urgent\" uniquement pour les véritables urgences",
  standardIssues: "Problèmes standard",
  ticketSubjectExample: "Exemple: \"Échec de transaction sur le réseau Ethereum\" ou \"Besoin d'aide avec la connexion de portefeuille\"",
  
  ticketCreated: "Ticket créé",
  ticketCreatedDesc: "Votre ticket d'assistance a été créé avec succès.",
  error: "Erreur",
  walletError: "Erreur de portefeuille",
  walletErrorDesc: "Veuillez connecter votre portefeuille avant de créer un ticket d'assistance.",
  missingFields: "Champs manquants",
  missingFieldsDesc: "Veuillez remplir tous les champs obligatoires.",
  emptyMessage: "Message vide",
  emptyMessageDesc: "Veuillez saisir un message à envoyer.",
  messageSent: "Message envoyé",
  messageSentDesc: "Votre message a été envoyé avec succès.",
  errorLoadingTickets: "Erreur lors du chargement des tickets",
  errorLoadingMessages: "Erreur lors du chargement des messages",
  errorSendingMessage: "Erreur lors de l'envoi du message",
  errorUpdatingTicket: "Erreur lors de la mise à jour du ticket",
  ticketUpdated: "Ticket mis à jour",
  ticketUpdatedDesc: "Le statut du ticket a été mis à jour.",
  
  ticket: "Ticket",
  ticketCategory: "Catégorie",
  created: "Créé",
  updated: "Mis à jour",
  actions: "Actions",
  conversation: "Conversation",
  noMessages: "Pas encore de messages dans ce ticket.",
  you: "Vous",
  support: "Support",
  system: "Système",
  reply: "Répondre",
  writeMessage: "Écrivez votre message ici...",
  closeTicket: "Fermer le ticket",
  ticketClosed: "Ce ticket est fermé.",
  closedOn: "Fermé le",
  reopenTicket: "Rouvrir le ticket",
  send: "Envoyer",
  
  // Mensajes de estado de tickets
  noActiveTickets: "Aucun ticket de support actif",
  noActiveTicketsDesc: "Vous n'avez aucun ticket de support actif pour le moment. Créez un nouveau ticket si vous avez besoin d'assistance.",
  createNewTicket: "Créer un nouveau ticket WayBank",

  technicalSupport: "Support Technique",
  accountIssues: "Problèmes de compte",
  billingQuestions: "Questions de facturation",
  featureRequest: "Demande de fonctionnalité",
  securityConcern: "Préoccupation de sécurité",
  other: "Autre"
};
// Переводы на русский
const ru: SupportTranslations = {
  status: "Статус",
  view: "Просмотр",
  reply: "Ответить",
  writeMessage: "Напишите ваше сообщение здесь...",
  closeTicket: "Закрыть заявку",
  cancel: "Отмена",
  send: "Отправить",
  ticketClosed: "Эта заявка закрыта.",
  closedOn: "Закрыто",
  reopenTicket: "Вновь открыть заявку",
  you: "Вы",
  support: "Поддержка",
  system: "Система",
  category: "Категория",
  created: "Создано",
  conversation: "Разговор",
  noMessages: "В этой заявке пока нет сообщений.",
  supportCenter: "Центр поддержки",
  expertAssistance: "Получите экспертную помощь по операциям с блокчейном и управлению ликвидностью",
  refresh: "Обновить",
  newTicket: "Новая заявка",
  myTickets: "Мои заявки",
  
  supportGuidelines: "Рекомендации по поддержке",
  priorityLevelGuide: "Руководство по уровням приоритета",
  creatingEffectiveTickets: "Создание эффективных заявок",
  responseTimes: "Время ответа",
  priorityLevelDescription: "Понимание того, когда использовать каждый уровень приоритета для обеспечения оптимальной эффективности поддержки",
  
  specificIssue: "Будьте конкретны в отношении проблемы, с которой вы столкнулись",
  includeTransactionHashes: "Включите соответствующие хеши транзакций, если применимо",
  specifyNetwork: "Укажите, какую сеть вы используете (Ethereum, Polygon и т.д.)",
  describeErrorMessages: "Опишите любые сообщения об ошибках, с которыми вы сталкиваетесь",
  
  urgent: "Срочно",
  high: "Высокий",
  medium: "Средний",
  low: "Низкий",
  urgentTime: "2-4 часа",
  highTime: "4-8 часов",
  mediumTime: "24 часа",
  lowTime: "48-72 часа",
  
  criticalServiceDisruption: "Критическое нарушение работы сервиса",
  significantImpact: "Значительное операционное воздействие",
  generalQuestion: "Общий вопрос или помощь",
  minorIssue: "Незначительная проблема или предложение",
  
  urgentExample: "Заблокированные средства, критические проблемы с ликвидностью",
  highExample: "Ошибка транзакции, проблемы с существующими NFT",
  mediumExample: "Вопросы по продукту, проблемы с пользовательским интерфейсом",
  lowExample: "Предложения, общие запросы",
  
  // Textos de descripción de prioridad
  reserveForEmergencies: "Зарезервируйте только для настоящих чрезвычайных ситуаций, таких как:",
  completeInability: "Полная невозможность доступа к средствам",
  securityBreaches: "Нарушения безопасности или несанкционированные транзакции",
  platformFailure: "Полный сбой функциональности платформы",
  misusePriority: "Неправильное использование срочного приоритета задерживает время ответа для всех пользователей",
  useForSerious: "Используйте для серьезных проблем, влияющих на ваши операции:",
  transactionErrors: "Ошибки транзакций со значительной стоимостью",
  multiplePositions: "Проблемы, затрагивающие несколько позиций",
  featureNotWorking: "Определенная функция не работает должным образом",
  appropriateForCommon: "Подходит для большинства распространенных потребностей в поддержке:",
  generalQuestions: "Общие вопросы о функциях платформы",
  clarificationDetails: "Разъяснения по деталям транзакций",
  uiIssues: "Проблемы UI/UX, которые не препятствуют использованию",
  forNonUrgent: "Для несрочных запросов:",
  featureSuggestions: "Предложения по функциям или отзывы",
  documentationQuestions: "Вопросы по документации",
  generalInfo: "Общая информация о платформе",
  
  open: "Открыто",
  inProgress: "В процессе",
  resolved: "Решено",
  closed: "Закрыто",
  
  createSupportTicket: "Создать заявку в поддержку",
  subject: "Тема",
  enterSubject: "Введите тему для вашей заявки",
  description: "Описание",
  enterDescription: "Подробно опишите вашу проблему",
  categoryLabel: "Категория",
  priority: "Приоритет",
  submit: "Отправить",

  // Diálogo de creación de ticket
  tipsFasterResolution: "Советы для более быстрого решения:",
  includeTransactionHashesTip: "Включите любые соответствующие хеши транзакций",
  specifyBlockchainNetworkTip: "Укажите сеть блокчейна (Ethereum, Polygon и т.д.)",
  describeStepsTip: "Опишите все шаги, которые вы уже пробовали",
  includeScreenshotsTip: "Включите скриншоты или сообщения об ошибках, если применимо",
  reserveUrgentText: "Пожалуйста, резервируйте \"Срочно\" только для настоящих чрезвычайных ситуаций",
  standardIssues: "Стандартные проблемы",
  ticketSubjectExample: "Пример: \"Транзакция не удалась в сети Ethereum\" или \"Нужна помощь с подключением кошелька\"",
  
  ticketCreated: "Заявка создана",
  ticketCreatedDesc: "Ваша заявка в службу поддержки успешно создана.",
  error: "Ошибка",
  walletError: "Ошибка кошелька",
  walletErrorDesc: "Пожалуйста, подключите свой кошелек, прежде чем создавать заявку в службу поддержки.",
  missingFields: "Отсутствующие поля",
  missingFieldsDesc: "Пожалуйста, заполните все обязательные поля.",
  emptyMessage: "Пустое сообщение",
  emptyMessageDesc: "Пожалуйста, введите сообщение для отправки.",
  messageSent: "Сообщение отправлено",
  messageSentDesc: "Ваше сообщение успешно отправлено.",
  errorLoadingTickets: "Ошибка загрузки заявок",
  errorLoadingMessages: "Ошибка загрузки сообщений",
  errorSendingMessage: "Ошибка отправки сообщения",
  errorUpdatingTicket: "Ошибка обновления заявки",
  ticketUpdated: "Заявка обновлена",
  ticketUpdatedDesc: "Статус заявки обновлен.",
  
  ticket: "Заявка",
  ticketCategory: "Категория",
  updated: "Обновлено",
  actions: "Действия",

  // Mensajes de estado de tickets
  noActiveTickets: "Нет активных заявок в службу поддержки",
  noActiveTicketsDesc: "У вас нет активных заявок в службу поддержки в данный момент. Создайте новую заявку, если вам нужна помощь.",
  createNewTicket: "Создать новую заявку WayBank",
  
  technicalSupport: "Техническая поддержка",
  accountIssues: "Проблемы с аккаунтом",
  billingQuestions: "Вопросы по выставлению счетов",
  featureRequest: "Запрос функции",
  securityConcern: "Проблема безопасности",
  other: "Другое"
};
// Traducciones en Alemán
const de: SupportTranslations = {
  status: "Status",
  view: "Ansehen",
  supportCenter: "Support-Center",
  expertAssistance: "Erhalten Sie Experten-Unterstützung für Ihre Blockchain-Operationen und Liquiditätsmanagement-Bedürfnisse",
  refresh: "Aktualisieren",
  newTicket: "Neues Ticket",
  myTickets: "Meine Tickets",
  
  supportGuidelines: "Support-Richtlinien",
  priorityLevelGuide: "Prioritätsstufen-Leitfaden",
  creatingEffectiveTickets: "Effektive Tickets erstellen",
  responseTimes: "Antwortzeiten",
  priorityLevelDescription: "Verstehen Sie, wann Sie welche Prioritätsstufe verwenden sollten, um eine optimale Support-Effizienz zu gewährleisten",
  
  specificIssue: "Seien Sie spezifisch über das Problem, das Sie erleben",
  includeTransactionHashes: "Fügen Sie relevante Transaktions-Hashes hinzu, wenn zutreffend",
  specifyNetwork: "Geben Sie an, welches Netzwerk Sie verwenden (Ethereum, Polygon, usw.)",
  describeErrorMessages: "Beschreiben Sie alle Fehlermeldungen, auf die Sie stoßen",
  
  urgent: "Dringend",
  high: "Hoch",
  medium: "Mittel",
  low: "Niedrig",
  urgentTime: "2-4 Stunden",
  highTime: "4-8 Stunden",
  mediumTime: "24 Stunden",
  lowTime: "48-72 Stunden",
  
  criticalServiceDisruption: "Kritische Serviceunterbrechung",
  significantImpact: "Erhebliche Betriebsauswirkungen",
  generalQuestion: "Allgemeine Frage oder Unterstützung",
  minorIssue: "Kleineres Problem oder Vorschlag",
  
  urgentExample: "Gesperrte Gelder, kritische Liquiditätsprobleme",
  highExample: "Transaktionsfehler, Probleme mit bestehenden NFTs",
  mediumExample: "Produktfragen, UI-Probleme",
  lowExample: "Vorschläge, allgemeine Anfragen",
  
  // Textos de descripción de prioridad
  reserveForEmergencies: "Nur für echte Notfälle reservieren, wie:",
  completeInability: "Vollständige Unfähigkeit, auf Gelder zuzugreifen",
  securityBreaches: "Sicherheitsverletzungen oder unbefugte Transaktionen",
  platformFailure: "Vollständiger Ausfall der Plattformfunktionalität",
  misusePriority: "Missbrauch der Dringlichkeitspriorität verzögert die Antwortzeiten für alle Benutzer",
  useForSerious: "Verwendung für ernste Probleme, die Ihre Operationen beeinträchtigen:",
  transactionErrors: "Transaktionsfehler mit erheblichem Wert",
  multiplePositions: "Probleme, die mehrere Positionen betreffen",
  featureNotWorking: "Spezifische Funktion, die nicht richtig funktioniert",
  appropriateForCommon: "Geeignet für die meisten üblichen Support-Anfragen:",
  generalQuestions: "Allgemeine Fragen zu Plattformfunktionen",
  clarificationDetails: "Klärung zu Transaktionsdetails",
  uiIssues: "Benutzeroberflächen-Probleme, die die Nutzung nicht verhindern",
  forNonUrgent: "Für nicht dringende Anfragen:",
  featureSuggestions: "Funktionsvorschläge oder Feedback",
  documentationQuestions: "Dokumentationsfragen",
  generalInfo: "Allgemeine Plattforminformationen",
  
  open: "Offen",
  inProgress: "In Bearbeitung",
  resolved: "Gelöst",
  closed: "Geschlossen",
  
  createSupportTicket: "Support-Ticket erstellen",
  subject: "Betreff",
  enterSubject: "Geben Sie einen Betreff für Ihr Ticket ein",
  description: "Beschreibung",
  enterDescription: "Beschreiben Sie Ihr Problem im Detail",
  categoryLabel: "Kategorie",
  priority: "Priorität",
  submit: "Absenden",
  cancel: "Abbrechen",
  
  // Diálogo de creación de ticket
  tipsFasterResolution: "Tipps für eine schnellere Lösung:",
  includeTransactionHashesTip: "Fügen Sie relevante Transaktions-Hashes hinzu",
  specifyBlockchainNetworkTip: "Geben Sie das Blockchain-Netzwerk an (Ethereum, Polygon, usw.)",
  describeStepsTip: "Beschreiben Sie Schritte, die Sie bereits versucht haben",
  includeScreenshotsTip: "Fügen Sie Screenshots oder Fehlermeldungen bei, falls zutreffend",
  reserveUrgentText: "Bitte reservieren Sie \"Dringend\" nur für echte Notfälle",
  standardIssues: "Standardprobleme",
  ticketSubjectExample: "Beispiel: \"Transaktion im Ethereum-Netzwerk fehlgeschlagen\" oder \"Benötige Hilfe bei der Wallet-Verbindung\"",
  
  ticketCreated: "Ticket erstellt",
  ticketCreatedDesc: "Ihr Support-Ticket wurde erfolgreich erstellt.",
  error: "Fehler",
  walletError: "Wallet-Fehler",
  walletErrorDesc: "Bitte verbinden Sie Ihre Wallet, bevor Sie ein Support-Ticket erstellen.",
  missingFields: "Fehlende Felder",
  missingFieldsDesc: "Bitte füllen Sie alle erforderlichen Felder aus.",
  emptyMessage: "Leere Nachricht",
  emptyMessageDesc: "Bitte geben Sie eine Nachricht ein, um sie zu senden.",
  messageSent: "Nachricht gesendet",
  messageSentDesc: "Ihre Nachricht wurde erfolgreich gesendet.",
  errorLoadingTickets: "Fehler beim Laden von Tickets",
  errorLoadingMessages: "Fehler beim Laden von Nachrichten",
  errorSendingMessage: "Fehler beim Senden der Nachricht",
  errorUpdatingTicket: "Fehler beim Aktualisieren des Tickets",
  ticketUpdated: "Ticket aktualisiert",
  ticketUpdatedDesc: "Der Ticket-Status wurde aktualisiert.",
  
  ticket: "Ticket",
  ticketCategory: "Kategorie",
  created: "Erstellt",
  updated: "Aktualisiert",
  actions: "Aktionen",
  conversation: "Konversation",
  noMessages: "Noch keine Nachrichten in diesem Ticket.",
  you: "Sie",
  support: "Support",
  system: "System",
  reply: "Antworten",
  writeMessage: "Schreiben Sie Ihre Nachricht hier...",
  closeTicket: "Ticket schließen",
  ticketClosed: "Dieses Ticket ist geschlossen.",
  closedOn: "Geschlossen am",
  reopenTicket: "Ticket wieder öffnen",
  send: "Senden",

  // Mensajes de estado de tickets
  noActiveTickets: "Keine aktiven Support-Tickets",
  noActiveTicketsDesc: "Sie haben derzeit keine aktiven Support-Tickets. Erstellen Sie ein neues Ticket, wenn Sie Hilfe benötigen.",
  createNewTicket: "Neues WayBank-Ticket erstellen",
  
  technicalSupport: "Technischer Support",
  accountIssues: "Kontoprobleme",
  billingQuestions: "Abrechnungsfragen",
  featureRequest: "Funktionsanfrage",
  securityConcern: "Sicherheitsbedenken",
  other: "Andere"
};

// Hook para obtener las traducciones de la página support
// Exportación para el sistema centralizado
export const supportTranslations = {
  es: {
    title: "Soporte",
    subtitle: "Obtenga ayuda con su cuenta",
    contactUs: "Contáctenos",
    faq: "Preguntas frecuentes",
    helpCenter: "Centro de ayuda"
  },
  en: {
    title: "Support",
    subtitle: "Get help with your account",
    contactUs: "Contact Us",
    faq: "FAQ",
    helpCenter: "Help Center"
  },
  fr: {
    title: "Support",
    subtitle: "Obtenez de l'aide pour votre compte",
    contactUs: "Contactez-nous",
    faq: "FAQ",
    helpCenter: "Centre d'aide"
  },
  de: {
    title: "Unterstützung",
    subtitle: "Erhalten Sie Hilfe mit Ihrem Konto",
    contactUs: "Kontaktieren Sie uns",
    faq: "FAQ",
    helpCenter: "Hilfezentrum"
  },
  ru: {
    title: "Поддержка",
    subtitle: "Получите помощь с вашим аккаунтом",
    contactUs: "Связаться с нами",
    faq: "Часто задаваемые вопросы",
    helpCenter: "Справочный центр"
  },
  it: {
    title: "Supporto",
    subtitle: "Ottieni aiuto con il tuo account",
    contactUs: "Contattaci",
    faq: "FAQ",
    helpCenter: "Centro assistenza"
  },
  pt: {
    title: "Suporte",
    subtitle: "Obtenha ajuda com sua conta",
    contactUs: "Entre em contato conosco",
    faq: "FAQ",
    helpCenter: "Central de ajuda"
  },
  ar: {
    title: "الدعم",
    subtitle: "احصل على مساعدة بشأن حسابك",
    contactUs: "اتصل بنا",
    faq: "الأسئلة الشائعة",
    helpCenter: "مركز المساعدة"
  },
  zh: {
    title: "支持",
    subtitle: "获取账户帮助",
    contactUs: "联系我们",
    faq: "常见问题",
    helpCenter: "帮助中心"
  },
  hi: {
    title: "सहायता",
    subtitle: "अपने खाते के साथ सहायता प्राप्त करें",
    contactUs: "हमसे संपर्क करें",
    faq: "अक्सर पूछे जाने वाले प्रश्न",
    helpCenter: "सहायता केंद्र"
  }
};

// Objeto que mapea los idiomas a sus traducciones
const translations = {
  es,
  en,
  it,
  pt,
  ar,
  fr,
  de,
  zh,
  hi,
  ru
};

export function useSupportTranslations() {
  const { language } = useLanguage();
  return translations[language] || translations.en;
}