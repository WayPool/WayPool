import { useEffect, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useWallet } from "@/hooks/use-wallet";
import { useTranslation } from "@/hooks/use-translation";
import { useSupportTranslations } from "@/translations/support";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { APP_NAME } from "@/utils/app-config";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { queryClient } from "@/lib/queryClient";
import { Loader2, RefreshCw, Send, Plus, MessageCircle } from "lucide-react";

type SupportTicket = {
  id: number;
  ticketNumber: string;
  walletAddress: string;
  subject: string;
  description: string;
  category: string;
  status: "open" | "in-progress" | "resolved" | "closed";
  priority: "low" | "medium" | "high" | "urgent";
  createdAt: string;
  updatedAt: string;
  closedAt: string | null;
};

type TicketMessage = {
  id: number;
  ticketId: number;
  sender: "user" | "admin" | "system";
  message: string;
  attachmentUrl: string | null;
  createdAt: string;
};

export default function Support() {
  const { toast } = useToast();
  const { address } = useWallet();
  const { t } = useTranslation();
  const st = useSupportTranslations();
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [messageOpen, setMessageOpen] = useState(false);
  const [newTicketOpen, setNewTicketOpen] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [newTicket, setNewTicket] = useState({
    subject: "",
    description: "",
    category: "Technical Support",
    priority: "medium"
  });

  const { data: tickets, isLoading: isTicketsLoading, refetch: refetchTickets } = useQuery({
    queryKey: ['/api/support/tickets', address],
    queryFn: async () => {
      const response = await fetch(`/api/support/tickets?walletAddress=${address}`);
      if (!response.ok) throw new Error(t('Error al cargar tickets'));
      return response.json() as Promise<SupportTicket[]>;
    },
    enabled: !!address,
  });

  const { data: messages, isLoading: isMessagesLoading, refetch: refetchMessages } = useQuery({
    queryKey: ['/api/support/tickets', selectedTicket?.id, 'messages'],
    queryFn: async () => {
      const response = await fetch(`/api/support/tickets/${selectedTicket?.id}/messages`);
      if (!response.ok) throw new Error(t('Error al cargar mensajes'));
      return response.json() as Promise<TicketMessage[]>;
    },
    enabled: !!selectedTicket,
  });

  const createTicketMutation = useMutation({
    mutationFn: async (data: { subject: string; description: string; category: string; priority: string }) => {
      const response = await fetch('/api/support/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          walletAddress: address,
          subject: data.subject,
          description: data.description,
          category: data.category,
          priority: data.priority
        }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Error al crear ticket");
      }
      
      return response.json();
    },
    onSuccess: () => {
      setNewTicketOpen(false);
      setNewTicket({ subject: "", description: "", category: "Technical Support", priority: "medium" });
      refetchTickets();
      toast({
        title: t("Ticket creado"),
        description: t("Tu ticket de soporte ha sido creado exitosamente."),
      });
    },
    onError: (error) => {
      toast({
        title: t("Error"),
        description: `${error}`,
        variant: "destructive",
      });
    },
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (data: { ticketId: number; message: string }) => {
      const response = await fetch(`/api/support/tickets/${data.ticketId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ticketId: data.ticketId,
          sender: "user",
          message: data.message,
        }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || t("Error al enviar mensaje"));
      }
      
      return response.json();
    },
    onSuccess: () => {
      setNewMessage("");
      refetchMessages();
      // También actualizamos la lista de tickets para ver cambios en fechas
      refetchTickets();
      toast({
        title: t("Mensaje enviado"),
        description: t("Tu mensaje ha sido enviado exitosamente."),
      });
    },
    onError: (error) => {
      toast({
        title: t("Error"),
        description: `${error}`,
        variant: "destructive",
      });
    },
  });

  const updateTicketMutation = useMutation({
    mutationFn: async (data: { ticketId: number; status: string }) => {
      const response = await fetch(`/api/support/tickets/${data.ticketId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: data.status,
        }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || t("Error al actualizar ticket"));
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      setSelectedTicket(data);
      refetchTickets();
      toast({
        title: t("Ticket actualizado"),
        description: t("El estado del ticket ha sido actualizado."),
      });
    },
    onError: (error) => {
      toast({
        title: t("Error"),
        description: `${error}`,
        variant: "destructive",
      });
    },
  });

  // Cuando cambia el wallet, refrescamos los tickets
  useEffect(() => {
    if (address) {
      refetchTickets();
    }
  }, [address, refetchTickets]);

  // Renderizar badges de prioridad con colores apropiados
  const renderPriorityBadge = (priority: string) => {
    switch (priority) {
      case "low":
        return <Badge variant="outline">{t('Baja')}</Badge>;
      case "medium":
        return <Badge variant="secondary">{t('Media')}</Badge>;
      case "high":
        return <Badge variant="default">{t('Alta')}</Badge>;
      case "urgent":
        return <Badge variant="destructive">{t('Urgente')}</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  // Renderizar badges de estado con colores apropiados
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "open":
        return <Badge variant="default">{t('Open')}</Badge>;
      case "in-progress":
        return <Badge variant="secondary">{t('In Progress')}</Badge>;
      case "resolved":
        return <Badge variant="outline">{t('Resolved')}</Badge>;
      case "closed":
        return <Badge variant="destructive">{t('Closed')}</Badge>;
      default:
        return <Badge variant="outline">{t(status)}</Badge>;
    }
  };

  // Formatear fecha para mostrar
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Verificar que todos los campos requeridos estén presentes
    if (!address) {
      toast({
        title: t("Error de Wallet"),
        description: t("Por favor conecte su wallet antes de crear un ticket de soporte."),
        variant: "destructive",
      });
      return;
    }
    
    if (!newTicket.subject || !newTicket.category) {
      toast({
        title: t("Campos faltantes"),
        description: t("Por favor complete todos los campos requeridos."),
        variant: "destructive",
      });
      return;
    }
    
    // Si todos los campos están presentes, enviar el ticket
    createTicketMutation.mutate(newTicket);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedTicket) {
      toast({
        title: t("Mensaje vacío"),
        description: t("Por favor ingrese un mensaje para enviar."),
        variant: "destructive",
      });
      return;
    }
    
    sendMessageMutation.mutate({
      ticketId: selectedTicket.id,
      message: newMessage,
    });
  };

  const handleCloseTicket = () => {
    if (!selectedTicket) return;
    
    updateTicketMutation.mutate({
      ticketId: selectedTicket.id,
      status: "closed",
    });
  };

  const handleReopenTicket = () => {
    if (!selectedTicket) return;
    
    updateTicketMutation.mutate({
      ticketId: selectedTicket.id,
      status: "open",
    });
  };

  return (
    <div className="page-container py-8">
      {/* Hero section with blockchain styling */}
      <div className="relative mb-10 rounded-xl bg-gradient-to-br from-indigo-900 via-blue-900 to-blue-950 p-8 overflow-hidden">
        {/* Decorative blockchain elements */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 left-10 w-20 h-20 rounded-full bg-blue-400 opacity-10 filter blur-xl"></div>
          <div className="absolute bottom-10 right-10 w-32 h-32 rounded-full bg-indigo-400 opacity-10 filter blur-xl"></div>
          <div className="absolute top-1/2 left-1/4 w-40 h-40 rounded-full bg-cyan-400 opacity-5 filter blur-xl"></div>
          
          {/* Hexagon grid pattern - blockchain style */}
          <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 5 L 0 15 L 10 20 L 20 15 L 20 5 Z" fill="none" stroke="white" strokeWidth="0.2" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
        
        {/* Content */}
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{APP_NAME} {st.supportCenter}</h1>
            <p className="text-blue-100 max-w-xl">
              {st.expertAssistance}
            </p>
          </div>
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={() => refetchTickets()} 
              disabled={isTicketsLoading}
              className="bg-opacity-20 border-blue-400 border-opacity-30 text-blue-50 hover:bg-blue-800 hover:bg-opacity-30"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              {st.refresh}
            </Button>
            <Button 
              onClick={() => setNewTicketOpen(true)}
              className="bg-blue-600 hover:bg-blue-500 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              {st.newTicket}
            </Button>
          </div>
        </div>
      </div>

      {/* Support resources grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {/* Support guidelines card */}
        <Card className="md:col-span-1 bg-gradient-to-br from-background to-blue-950/5 border-blue-900/20">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-xl">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {st.supportGuidelines}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="space-y-2">
              <h4 className="font-medium text-blue-500">{st.creatingEffectiveTickets}</h4>
              <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                <li>{st.specificIssue}</li>
                <li>{st.includeTransactionHashes}</li>
                <li>{st.specifyNetwork}</li>
                <li>{st.describeErrorMessages}</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-blue-500">{st.responseTimes}</h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 bg-blue-500/5 rounded border border-blue-500/10">
                  <span className="font-medium block">{st.urgent}:</span>
                  <span className="text-muted-foreground">{st.urgentTime}</span>
                </div>
                <div className="p-2 bg-blue-500/5 rounded border border-blue-500/10">
                  <span className="font-medium block">{st.high}:</span>
                  <span className="text-muted-foreground">{st.highTime}</span>
                </div>
                <div className="p-2 bg-blue-500/5 rounded border border-blue-500/10">
                  <span className="font-medium block">{st.medium}:</span>
                  <span className="text-muted-foreground">{st.mediumTime}</span>
                </div>
                <div className="p-2 bg-blue-500/5 rounded border border-blue-500/10">
                  <span className="font-medium block">{st.low}:</span>
                  <span className="text-muted-foreground">{st.lowTime}</span>
                </div>
              </div>
            </div>
            
            <div className="pt-2">
              <Button variant="outline" size="sm" className="w-full" onClick={() => setNewTicketOpen(true)}>
                {st.createSupportTicket}
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Priority level guide */}
        <Card className="md:col-span-2 bg-gradient-to-br from-background to-blue-950/5 border-blue-900/20">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-xl">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              {st.priorityLevelGuide}
            </CardTitle>
            <CardDescription>
              {st.priorityLevelDescription}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 p-3 rounded-lg bg-red-500/5 border border-red-500/10">
                <div className="flex items-center">
                  <Badge variant="destructive" className="mr-2">{st.urgent}</Badge>
                  <span className="text-sm text-muted-foreground">{st.criticalServiceDisruption}</span>
                </div>
                <p className="text-sm">
                  {st.reserveForEmergencies}
                </p>
                <ul className="list-disc pl-5 space-y-1 text-xs text-muted-foreground">
                  <li>{st.completeInability}</li>
                  <li>{st.securityBreaches}</li>
                  <li>{st.platformFailure}</li>
                </ul>
                <p className="text-xs text-red-500 italic">
                  {st.misusePriority}
                </p>
              </div>
              
              <div className="space-y-2 p-3 rounded-lg bg-blue-500/5 border border-blue-500/10">
                <div className="flex items-center">
                  <Badge className="mr-2">{st.high}</Badge>
                  <span className="text-sm text-muted-foreground">{st.significantImpact}</span>
                </div>
                <p className="text-sm">
                  {st.useForSerious}
                </p>
                <ul className="list-disc pl-5 space-y-1 text-xs text-muted-foreground">
                  <li>{st.transactionErrors}</li>
                  <li>{st.multiplePositions}</li>
                  <li>{st.featureNotWorking}</li>
                </ul>
              </div>
              
              <div className="space-y-2 p-3 rounded-lg bg-blue-500/5 border border-blue-500/10">
                <div className="flex items-center">
                  <Badge variant="secondary" className="mr-2">{st.medium}</Badge>
                  <span className="text-sm text-muted-foreground">{st.generalQuestion}</span>
                </div>
                <p className="text-sm">
                  {st.appropriateForCommon}
                </p>
                <ul className="list-disc pl-5 space-y-1 text-xs text-muted-foreground">
                  <li>{st.generalQuestions}</li>
                  <li>{st.clarificationDetails}</li>
                  <li>{st.uiIssues}</li>
                </ul>
              </div>
              
              <div className="space-y-2 p-3 rounded-lg bg-blue-500/5 border border-blue-500/10">
                <div className="flex items-center">
                  <Badge variant="outline" className="mr-2">{st.low}</Badge>
                  <span className="text-sm text-muted-foreground">{st.minorIssue}</span>
                </div>
                <p className="text-sm">
                  {st.forNonUrgent}
                </p>
                <ul className="list-disc pl-5 space-y-1 text-xs text-muted-foreground">
                  <li>{st.featureSuggestions}</li>
                  <li>{st.documentationQuestions}</li>
                  <li>{st.generalInfo}</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* My Tickets section */}
      <Card className="border-blue-900/20 shadow-md">
        <CardHeader className="border-b border-blue-950/10 bg-blue-950/5">
          <CardTitle className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            {st.myTickets}
          </CardTitle>
          <CardDescription>
            {st.creatingEffectiveTickets}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          {isTicketsLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
          ) : (!tickets || tickets.length === 0) ? (
            <div className="text-center py-12 px-4">
              <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-blue-100/10 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-500 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium mb-2">{st.noActiveTickets}</h3>
              <p className="text-muted-foreground max-w-md mx-auto mb-6">
                {st.noActiveTicketsDesc}
              </p>
              <Button 
                className="bg-blue-600 hover:bg-blue-500 text-white"
                onClick={() => setNewTicketOpen(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                {st.createNewTicket}
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-blue-50/5 hover:bg-blue-50/10">
                    <TableHead className="w-[100px]">{st.ticket} #</TableHead>
                    <TableHead>{st.subject}</TableHead>
                    <TableHead className="hidden md:table-cell">{st.ticketCategory}</TableHead>
                    <TableHead>{st.status || t('Estado')}</TableHead>
                    <TableHead className="hidden md:table-cell">{st.priority}</TableHead>
                    <TableHead className="hidden md:table-cell">{st.updated}</TableHead>
                    <TableHead>{st.actions}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tickets.map((ticket) => (
                    <TableRow key={ticket.id} className="border-b border-blue-950/10">
                      <TableCell className="font-mono text-xs">{ticket.ticketNumber}</TableCell>
                      <TableCell className="font-medium max-w-[200px] truncate">{ticket.subject}</TableCell>
                      <TableCell className="hidden md:table-cell">{ticket.category}</TableCell>
                      <TableCell>{renderStatusBadge(ticket.status)}</TableCell>
                      <TableCell className="hidden md:table-cell">{renderPriorityBadge(ticket.priority)}</TableCell>
                      <TableCell className="hidden md:table-cell text-xs text-muted-foreground">{formatDate(ticket.updatedAt)}</TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-blue-500/20 text-blue-600 hover:bg-blue-50/10 hover:text-blue-500"
                          onClick={() => {
                            setSelectedTicket(ticket);
                            setMessageOpen(true);
                            
                            // Marcar el ticket como leído por el usuario
                            fetch(`/api/support/tickets/${ticket.id}`, {
                              method: 'PUT',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ markReadBy: 'user' })
                            }).then(() => {
                              // Actualizar el conteo de tickets no leídos después de un breve retraso
                              setTimeout(() => {
                                queryClient.invalidateQueries({ queryKey: ['/api/support/tickets/unread-count'] });
                              }, 500);
                            });
                          }}
                        >
                          <MessageCircle className="h-4 w-4 mr-2" />
                          {st.view}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Enhanced new ticket modal with blockchain styling */}
      <Dialog open={newTicketOpen} onOpenChange={setNewTicketOpen}>
        <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-900 to-indigo-900 p-6 relative">
            {/* Background decorative elements */}
            <div className="absolute inset-0 opacity-10">
              <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
                <defs>
                  <pattern id="grid-modal" width="10" height="10" patternUnits="userSpaceOnUse">
                    <path d="M 10 0 L 0 5 L 0 15 L 10 20 L 20 15 L 20 5 Z" fill="none" stroke="white" strokeWidth="0.2" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid-modal)" />
              </svg>
            </div>
            
            {/* Content */}
            <div className="relative z-10">
              <DialogTitle className="text-white text-xl flex items-center mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                {st.createSupportTicket}
              </DialogTitle>
              <DialogDescription className="text-blue-100">
                {st.responseTimes}
              </DialogDescription>
            </div>
          </div>
          
          <form onSubmit={handleCreateTicket} className="p-6">
            <div className="grid gap-5">
              <div className="grid gap-2">
                <label htmlFor="subject" className="font-medium text-sm">{st.subject}</label>
                <Input
                  id="subject"
                  value={newTicket.subject}
                  onChange={(e) => setNewTicket({...newTicket, subject: e.target.value})}
                  placeholder={st.enterSubject}
                  required
                  className="border-blue-200 focus:border-blue-500"
                />
                <p className="text-xs text-muted-foreground">
                  {st.ticketSubjectExample}
                </p>
              </div>
              
              <div className="grid gap-2">
                <label htmlFor="description" className="font-medium text-sm">{st.description}</label>
                <Textarea
                  id="description"
                  value={newTicket.description}
                  onChange={(e) => setNewTicket({...newTicket, description: e.target.value})}
                  placeholder={st.enterDescription}
                  rows={5}
                  className="border-blue-200 focus:border-blue-500"
                />
                <div className="bg-blue-50 dark:bg-blue-950/20 p-3 rounded-md border border-blue-100 dark:border-blue-950/30 text-xs space-y-2">
                  <p className="font-medium text-blue-700 dark:text-blue-400">{st.tipsFasterResolution}</p>
                  <ul className="list-disc pl-4 text-muted-foreground space-y-1">
                    <li>{st.includeTransactionHashesTip}</li>
                    <li>{st.specifyBlockchainNetworkTip}</li>
                    <li>{st.describeStepsTip}</li>
                    <li>{st.includeScreenshotsTip}</li>
                  </ul>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <label htmlFor="category" className="font-medium text-sm">{st.categoryLabel}</label>
                  <Select
                    value={newTicket.category}
                    onValueChange={(value) => setNewTicket({...newTicket, category: value})}
                  >
                    <SelectTrigger id="category" className="border-blue-200 focus:border-blue-500">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Technical Support">Technical Support</SelectItem>
                      <SelectItem value="Account Issues">Account Issues</SelectItem>
                      <SelectItem value="Payment Problems">Payment Problems</SelectItem>
                      <SelectItem value="Feature Request">Feature Request</SelectItem>
                      <SelectItem value="General Question">General Question</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid gap-2">
                  <label htmlFor="priority" className="font-medium text-sm">{st.priority}</label>
                  <Select
                    value={newTicket.priority}
                    onValueChange={(value) => setNewTicket({...newTicket, priority: value})}
                  >
                    <SelectTrigger id="priority" className="border-blue-200 focus:border-blue-500">
                      <SelectValue placeholder="Select a priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <div className="p-2 text-xs text-amber-600 border-b border-border">
                        {st.priorityLevelDescription}
                      </div>
                      <SelectItem value="low" className="flex items-center">
                        <Badge variant="outline" className="mr-2 h-5">{st.low}</Badge>
                        <span className="text-xs text-muted-foreground">{st.generalInfo}</span>
                      </SelectItem>
                      <SelectItem value="medium" className="flex items-center">
                        <Badge variant="secondary" className="mr-2 h-5">{st.medium}</Badge>
                        <span className="text-xs text-muted-foreground">{st.standardIssues}</span>
                      </SelectItem>
                      <SelectItem value="high" className="flex items-center">
                        <Badge className="mr-2 h-5">{st.high}</Badge>
                        <span className="text-xs text-muted-foreground">{st.significantImpact}</span>
                      </SelectItem>
                      <SelectItem value="urgent" className="flex items-center">
                        <Badge variant="destructive" className="mr-2 h-5">{st.urgent}</Badge>
                        <span className="text-xs text-muted-foreground">{st.criticalServiceDisruption}</span>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-amber-600">
                    {st.reserveUrgentText}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-8">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setNewTicketOpen(false)}
              >
                {st.cancel}
              </Button>
              <Button 
                type="submit" 
                disabled={createTicketMutation.isPending}
                className="bg-blue-600 hover:bg-blue-500 text-white"
              >
                {createTicketMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    {st.submit}
                  </>
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal para ver y responder a un ticket */}
      <Dialog open={messageOpen} onOpenChange={setMessageOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
          {selectedTicket && (
            <>
              <DialogHeader>
                <div className="flex justify-between">
                  <DialogTitle>{st.ticket} #{selectedTicket.ticketNumber}</DialogTitle>
                  <div className="flex gap-2">
                    {renderStatusBadge(selectedTicket.status)}
                    {renderPriorityBadge(selectedTicket.priority)}
                  </div>
                </div>
                <DialogDescription>
                  <div className="text-sm text-muted-foreground mt-1">
                    {st.category}: {t(selectedTicket.category)} | 
                    {st.created}: {formatDate(selectedTicket.createdAt)}
                  </div>
                  <div className="font-medium mt-2">{selectedTicket.subject}</div>
                  {selectedTicket.description && (
                    <div className="mt-2 text-sm whitespace-pre-wrap">{selectedTicket.description}</div>
                  )}
                </DialogDescription>
              </DialogHeader>

              <div className="py-4">
                <h4 className="text-sm font-medium mb-2">{st.conversation}</h4>
                <div className="space-y-4 max-h-[300px] overflow-y-auto p-4 border rounded-md">
                  {isMessagesLoading ? (
                    <div className="flex justify-center py-4">
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    </div>
                  ) : (!messages || messages.length === 0) ? (
                    <div className="text-center py-4 text-muted-foreground">
                      <p>{st.noMessages}</p>
                    </div>
                  ) : (
                    messages.map((msg) => (
                      <div 
                        key={msg.id} 
                        className={`flex ${
                          msg.sender === "user" ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div 
                          className={`max-w-[80%] rounded-lg p-3 ${
                            msg.sender === "user" 
                              ? "bg-primary text-primary-foreground" 
                              : msg.sender === "admin"
                                ? "bg-secondary text-secondary-foreground"
                                : "bg-muted text-muted-foreground"
                          }`}
                        >
                          <div className="text-xs mb-1">
                            {msg.sender === "user" 
                              ? st.you 
                              : msg.sender === "admin" 
                                ? st.support 
                                : st.system}
                            {" "}• {formatDate(msg.createdAt)}
                          </div>
                          <div className="whitespace-pre-wrap">{msg.message}</div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {selectedTicket.status !== "closed" ? (
                <form onSubmit={handleSendMessage} className="space-y-4">
                  <div className="grid gap-2">
                    <label htmlFor="message">{st.reply}</label>
                    <Textarea
                      id="message"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder={st.writeMessage}
                      rows={3}
                      required
                    />
                  </div>
                  <div className="flex justify-between">
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={handleCloseTicket}
                    >
                      {st.closeTicket}
                    </Button>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setMessageOpen(false)}
                      >
                        {st.cancel}
                      </Button>
                      <Button 
                        type="submit" 
                        disabled={sendMessageMutation.isPending}
                      >
                        {sendMessageMutation.isPending && (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        <Send className="h-4 w-4 mr-2" />
                        {st.send}
                      </Button>
                    </div>
                  </div>
                </form>
              ) : (
                <div className="border-t pt-4 flex justify-between">
                  <p className="text-muted-foreground">
                    {st.ticketClosed} {selectedTicket.closedAt && `${st.closedOn} ${formatDate(selectedTicket.closedAt)}`}
                  </p>
                  <Button
                    variant="outline" 
                    onClick={handleReopenTicket}
                  >
                    {st.reopenTicket}
                  </Button>
                </div>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}