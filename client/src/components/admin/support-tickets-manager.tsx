import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import type { SupportTicket } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Search,
  Loader2, 
  MessageCircle, 
  RefreshCw, 
  Send,
  ChevronLeft,
  Trash,
  Copy,
  ArrowUp,
  ArrowDown,
  Plus,
  Users,
  User,
  UserPlus,
  X
} from "lucide-react";

export default function SupportTicketsManager() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [messageOpen, setMessageOpen] = useState(false);
  const [ticketFilter, setTicketFilter] = useState<string>("all");
  const [newMessage, setNewMessage] = useState("");
  
  // Estado para el diálogo de envío de tickets
  const [isCreateTicketOpen, setIsCreateTicketOpen] = useState(false);
  const [recipientType, setRecipientType] = useState<"single" | "multiple" | "all">("single");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [userSearchQuery, setUserSearchQuery] = useState("");
  const [newTicketSubject, setNewTicketSubject] = useState("");
  const [newTicketMessage, setNewTicketMessage] = useState("");
  const [newTicketCategory, setNewTicketCategory] = useState("general");
  const [newTicketPriority, setNewTicketPriority] = useState("medium");
  
  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [ticketsPerPage] = useState(10);
  
  // Ordenación
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Función para cambiar el ordenamiento
  const handleSortChange = (field: string) => {
    if (sortField === field) {
      // Si ya estamos ordenando por este campo, cambiamos la dirección
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Si es un nuevo campo, lo establecemos y reseteamos la dirección a ascendente
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Consultar todos los tickets de soporte
  const {
    data: tickets,
    isLoading: isTicketsLoading,
    refetch: refetchTickets
  } = useQuery({
    queryKey: ['/api/support/tickets'],
    queryFn: async () => {
      const response = await fetch('/api/support/tickets');
      if (!response.ok) {
        throw new Error('Error al cargar tickets');
      }
      return response.json();
    }
  });

  // Filtrar tickets según estado y búsqueda
  const filteredTickets = tickets ? tickets.filter((ticket: any) => {
    // Filtrar por estado
    const statusMatch = ticketFilter === 'all' || ticket.status === ticketFilter;
    
    // Filtrar por búsqueda
    const searchLower = searchQuery.toLowerCase();
    const searchMatch = 
      searchQuery === '' || 
      ticket.ticketNumber.toLowerCase().includes(searchLower) ||
      ticket.subject.toLowerCase().includes(searchLower) ||
      ticket.walletAddress.toLowerCase().includes(searchLower) ||
      ticket.category.toLowerCase().includes(searchLower);
    
    return statusMatch && searchMatch;
  }).sort((a: any, b: any) => {
    // Si no hay un campo de ordenación, no ordenar
    if (!sortField) return 0;
    
    let valueA, valueB;
    
    // Extraer los valores a comparar según el campo seleccionado
    switch (sortField) {
      case 'ticketNumber':
        valueA = a.ticketNumber;
        valueB = b.ticketNumber;
        break;
      case 'subject':
        valueA = a.subject;
        valueB = b.subject;
        break;
      case 'status':
        valueA = a.status;
        valueB = b.status;
        break;
      case 'priority':
        // Convertir prioridades a valores numéricos para ordenar correctamente
        const priorityOrder: Record<string, number> = { 
          'low': 1, 
          'medium': 2, 
          'high': 3, 
          'urgent': 4 
        };
        valueA = priorityOrder[a.priority] || 0;
        valueB = priorityOrder[b.priority] || 0;
        break;
      case 'updatedAt':
        valueA = new Date(a.updatedAt).getTime();
        valueB = new Date(b.updatedAt).getTime();
        break;
      default:
        valueA = a[sortField] || '';
        valueB = b[sortField] || '';
    }
    
    // Ordenar según la dirección
    if (sortDirection === 'asc') {
      return valueA > valueB ? 1 : valueA < valueB ? -1 : 0;
    } else {
      return valueA < valueB ? 1 : valueA > valueB ? -1 : 0;
    }
  }) : [];
  
  // Obtener tickets actuales para la página actual
  const indexOfLastTicket = currentPage * ticketsPerPage;
  const indexOfFirstTicket = indexOfLastTicket - ticketsPerPage;
  const currentTickets = filteredTickets.slice(indexOfFirstTicket, indexOfLastTicket);
  
  // Cambiar página
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  
  // Resetear la paginación cuando cambian los filtros
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, ticketFilter]);
  
  // Consultar todos los usuarios del sistema
  const {
    data: users,
    isLoading: isUsersLoading,
  } = useQuery({
    queryKey: ['/api/users'],
    queryFn: async () => {
      const response = await fetch('/api/users');
      if (!response.ok) {
        throw new Error('Error al cargar usuarios');
      }
      return response.json();
    },
    enabled: isCreateTicketOpen // Solo cargar cuando se abre el diálogo
  });
  
  // Filtrar usuarios según búsqueda
  const filteredUsers = users ? users.filter((user: any) => {
    if (!userSearchQuery || userSearchQuery.trim() === "") return true;
    
    const searchLower = userSearchQuery.toLowerCase().trim();
    
    // Mostrar datos de usuario para debugging
    console.log("Filtrando usuario:", user);
    
    // Búsqueda por wallet (completa o parcial)
    const walletMatch = user.walletAddress && 
      user.walletAddress.toLowerCase().includes(searchLower);
    
    // Búsqueda por nombre de usuario
    const usernameMatch = user.username && 
      user.username.toLowerCase().includes(searchLower);
    
    // Búsqueda por email (si existe)
    const emailMatch = user.email && 
      user.email.toLowerCase().includes(searchLower);
    
    // Búsqueda por ID
    const idMatch = user.id && 
      user.id.toString().includes(searchLower);
    
    // Búsqueda por otras propiedades personalizadas (si existen)
    const tagMatch = user.tag && 
      user.tag.toLowerCase().includes(searchLower);
    const roleMatch = user.role && 
      user.role.toLowerCase().includes(searchLower);
    
    const isMatch = walletMatch || usernameMatch || emailMatch || idMatch || tagMatch || roleMatch;
    console.log(`¿Coincide con "${searchLower}"?`, isMatch);
    
    return isMatch;
  }) : [];
  
  // Mutación para crear tickets
  const createTicketMutation = useMutation({
    mutationFn: async (data: { 
      walletAddress: string; 
      subject: string; 
      description: string; 
      category: string; 
      priority: string; 
    }) => {
      const response = await fetch('/api/support/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Error al crear ticket");
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Ticket creado",
        description: "El ticket ha sido creado exitosamente.",
      });
      setIsCreateTicketOpen(false);
      resetCreateTicketForm();
      refetchTickets();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `${error}`,
        variant: "destructive",
      });
    },
  });

  // Consultar mensajes para un ticket específico
  const {
    data: messages,
    isLoading: isMessagesLoading,
    refetch: refetchMessages
  } = useQuery({
    queryKey: ['/api/support/tickets', selectedTicket?.id, 'messages'],
    queryFn: async () => {
      if (!selectedTicket) return [];
      const response = await fetch(`/api/support/tickets/${selectedTicket.id}/messages`);
      if (!response.ok) {
        throw new Error('Error al cargar mensajes');
      }
      return response.json();
    },
    enabled: !!selectedTicket,
  });

  // Mutación para enviar mensaje
  const sendMessageMutation = useMutation({
    mutationFn: async (data: { ticketId: number; message: string }) => {
      const response = await fetch(`/api/support/tickets/${data.ticketId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ticketId: data.ticketId,
          sender: "admin",
          message: data.message,
        }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Error al enviar mensaje");
      }
      
      return response.json();
    },
    onSuccess: () => {
      setNewMessage("");
      refetchMessages();
      // También actualizamos la lista de tickets para ver cambios en fechas
      refetchTickets();
      toast({
        title: "Mensaje enviado",
        description: "Tu mensaje ha sido enviado exitosamente.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `${error}`,
        variant: "destructive",
      });
    },
  });

  // Mutación para actualizar estado de ticket
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
        throw new Error(error.message || "Error al actualizar ticket");
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      setSelectedTicket(data);
      refetchTickets();
      toast({
        title: "Ticket actualizado",
        description: "El estado del ticket ha sido actualizado.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `${error}`,
        variant: "destructive",
      });
    },
  });
  
  // Estado para el diálogo de confirmación de eliminación
  const [ticketToDelete, setTicketToDelete] = useState<any>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  // Mutación para eliminar ticket
  const deleteTicketMutation = useMutation({
    mutationFn: async (ticketId: number) => {
      const response = await fetch(`/api/support/tickets/${ticketId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Error al eliminar ticket");
      }
      
      return response.json();
    },
    onSuccess: () => {
      refetchTickets();
      setIsDeleteDialogOpen(false);
      setTicketToDelete(null);
      toast({
        title: "Ticket eliminado",
        description: "El ticket ha sido eliminado exitosamente.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `${error}`,
        variant: "destructive",
      });
    },
  });

  // Renderizar badges de prioridad con colores apropiados
  const renderPriorityBadge = (priority: string) => {
    switch (priority) {
      case "low":
        return <Badge variant="outline">Baja</Badge>;
      case "medium":
        return <Badge variant="secondary">Media</Badge>;
      case "high":
        return <Badge variant="default">Alta</Badge>;
      case "urgent":
        return <Badge variant="destructive">Urgente</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  // Renderizar badges de estado con colores apropiados
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "open":
        return <Badge variant="default">Abierto</Badge>;
      case "in-progress":
        return <Badge variant="secondary">En progreso</Badge>;
      case "resolved":
        return <Badge variant="outline">Resuelto</Badge>;
      case "closed":
        return <Badge variant="destructive">Cerrado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Formatear fecha para mostrar
  const formatDate = (dateInput: string | Date | null) => {
    if (!dateInput) return 'N/A';
    const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
    return date.toLocaleString();
  };

  // Manejar envío de mensaje
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedTicket) {
      toast({
        title: "Mensaje vacío",
        description: "Por favor ingrese un mensaje para enviar.",
        variant: "destructive",
      });
      return;
    }
    
    sendMessageMutation.mutate({
      ticketId: selectedTicket.id,
      message: newMessage,
    });
  };

  // Manejar actualización de estado del ticket
  const handleUpdateTicketStatus = (status: string) => {
    if (!selectedTicket) return;
    
    updateTicketMutation.mutate({
      ticketId: selectedTicket.id,
      status: status,
    });
  };

  // Truncar direcciones largas
  const truncateAddress = (address: string) => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };
  
  // Reiniciar formulario de creación de ticket
  const resetCreateTicketForm = () => {
    setRecipientType("single");
    setSelectedUsers([]);
    setUserSearchQuery("");
    setNewTicketSubject("");
    setNewTicketMessage("");
    setNewTicketCategory("general");
    setNewTicketPriority("medium");
  };

  return (
    <div>
      <Card className="mb-6">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Tickets de Soporte</CardTitle>
            <div className="flex space-x-2">
              <Button 
                onClick={() => setIsCreateTicketOpen(true)} 
                className="mr-2"
                variant="default"
              >
                <Plus className="h-4 w-4 mr-2" />
                Crear Ticket
              </Button>
              <Button variant="outline" onClick={() => refetchTickets()} disabled={isTicketsLoading}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Actualizar
              </Button>
            </div>
          </div>
          <CardDescription>
            Gestione los tickets de soporte y responda a las consultas de los usuarios
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="relative flex-grow">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por número, asunto o dirección..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select
              value={ticketFilter}
              onValueChange={setTicketFilter}
            >
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Filtrar por estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los tickets</SelectItem>
                <SelectItem value="open">Abiertos</SelectItem>
                <SelectItem value="in-progress">En progreso</SelectItem>
                <SelectItem value="resolved">Resueltos</SelectItem>
                <SelectItem value="closed">Cerrados</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {isTicketsLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (!filteredTickets || filteredTickets.length === 0) ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No hay tickets de soporte que coincidan con los criterios.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableCaption>Lista de tickets de soporte</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead 
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handleSortChange('ticketNumber')}
                    >
                      <div className="flex items-center gap-1">
                        Ticket #
                        {sortField === 'ticketNumber' && (
                          sortDirection === 'asc' 
                            ? <ArrowUp className="h-3 w-3 text-primary" /> 
                            : <ArrowDown className="h-3 w-3 text-primary" />
                        )}
                        {sortField !== 'ticketNumber' && (
                          <ArrowUp className="h-3 w-3 text-muted-foreground opacity-20" />
                        )}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handleSortChange('subject')}
                    >
                      <div className="flex items-center gap-1">
                        Asunto
                        {sortField === 'subject' && (
                          sortDirection === 'asc' 
                            ? <ArrowUp className="h-3 w-3 text-primary" /> 
                            : <ArrowDown className="h-3 w-3 text-primary" />
                        )}
                        {sortField !== 'subject' && (
                          <ArrowUp className="h-3 w-3 text-muted-foreground opacity-20" />
                        )}
                      </div>
                    </TableHead>
                    <TableHead>Usuario</TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handleSortChange('status')}
                    >
                      <div className="flex items-center gap-1">
                        Estado
                        {sortField === 'status' && (
                          sortDirection === 'asc' 
                            ? <ArrowUp className="h-3 w-3 text-primary" /> 
                            : <ArrowDown className="h-3 w-3 text-primary" />
                        )}
                        {sortField !== 'status' && (
                          <ArrowUp className="h-3 w-3 text-muted-foreground opacity-20" />
                        )}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handleSortChange('priority')}
                    >
                      <div className="flex items-center gap-1">
                        Prioridad
                        {sortField === 'priority' && (
                          sortDirection === 'asc' 
                            ? <ArrowUp className="h-3 w-3 text-primary" /> 
                            : <ArrowDown className="h-3 w-3 text-primary" />
                        )}
                        {sortField !== 'priority' && (
                          <ArrowUp className="h-3 w-3 text-muted-foreground opacity-20" />
                        )}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handleSortChange('updatedAt')}
                    >
                      <div className="flex items-center gap-1">
                        Actualizado
                        {sortField === 'updatedAt' && (
                          sortDirection === 'asc' 
                            ? <ArrowUp className="h-3 w-3 text-primary" /> 
                            : <ArrowDown className="h-3 w-3 text-primary" />
                        )}
                        {sortField !== 'updatedAt' && (
                          <ArrowUp className="h-3 w-3 text-muted-foreground opacity-20" />
                        )}
                      </div>
                    </TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentTickets.map((ticket: any) => (
                    <TableRow key={ticket.id}>
                      <TableCell>{ticket.ticketNumber}</TableCell>
                      <TableCell className="font-medium max-w-[200px] truncate">
                        {ticket.subject}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <span title={ticket.walletAddress} className="font-mono">
                            {truncateAddress(ticket.walletAddress)}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => {
                              navigator.clipboard.writeText(ticket.walletAddress);
                              toast({
                                title: "Dirección copiada",
                                description: "La dirección del wallet ha sido copiada al portapapeles",
                                duration: 2000,
                              });
                            }}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>{renderStatusBadge(ticket.status)}</TableCell>
                      <TableCell>{renderPriorityBadge(ticket.priority)}</TableCell>
                      <TableCell>{formatDate(ticket.updatedAt)}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedTicket(ticket);
                              setMessageOpen(true);
                              
                              // Marcar el ticket como leído por el administrador
                              fetch(`/api/support/tickets/${ticket.id}`, {
                                method: 'PUT',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ markReadBy: 'admin' })
                              }).then(() => {
                                // Actualizar el conteo de tickets no leídos después de un breve retraso
                                setTimeout(() => {
                                  queryClient.invalidateQueries({ queryKey: ['/api/support/tickets/unread-count'] });
                                }, 500);
                              });
                            }}
                          >
                            <MessageCircle className="h-4 w-4 mr-2" />
                            Responder
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => {
                              setTicketToDelete(ticket);
                              setIsDeleteDialogOpen(true);
                            }}
                          >
                            <Trash className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              {/* Paginación */}
              {filteredTickets.length > ticketsPerPage && (
                <div className="flex justify-center mt-6">
                  <div className="flex gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      Anterior
                    </Button>
                    
                    {/* Lógica de paginación mejorada para mostrar un número limitado de botones */}
                    {(() => {
                      const totalPages = Math.ceil(filteredTickets.length / ticketsPerPage);
                      const maxPageButtons = 5; // Número máximo de botones de página a mostrar
                      
                      let startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
                      let endPage = Math.min(totalPages, startPage + maxPageButtons - 1);
                      
                      // Ajustar si estamos cerca del final
                      if (endPage - startPage + 1 < maxPageButtons) {
                        startPage = Math.max(1, endPage - maxPageButtons + 1);
                      }
                      
                      const pages = [];
                      
                      // Siempre mostrar la primera página
                      if (startPage > 1) {
                        pages.push(
                          <Button
                            key={1}
                            variant="outline"
                            size="sm"
                            onClick={() => paginate(1)}
                          >
                            1
                          </Button>
                        );
                        // Mostrar ellipsis si hay un salto
                        if (startPage > 2) {
                          pages.push(
                            <div key="ellipsis1" className="px-2 flex items-center">
                              ...
                            </div>
                          );
                        }
                      }
                      
                      // Páginas intermedias
                      for (let i = startPage; i <= endPage; i++) {
                        pages.push(
                          <Button
                            key={i}
                            variant={currentPage === i ? "default" : "outline"}
                            size="sm"
                            onClick={() => paginate(i)}
                          >
                            {i}
                          </Button>
                        );
                      }
                      
                      // Siempre mostrar la última página
                      if (endPage < totalPages) {
                        // Mostrar ellipsis si hay un salto
                        if (endPage < totalPages - 1) {
                          pages.push(
                            <div key="ellipsis2" className="px-2 flex items-center">
                              ...
                            </div>
                          );
                        }
                        pages.push(
                          <Button
                            key={totalPages}
                            variant="outline"
                            size="sm"
                            onClick={() => paginate(totalPages)}
                          >
                            {totalPages}
                          </Button>
                        );
                      }
                      
                      return pages;
                    })()}
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => 
                        setCurrentPage(p => Math.min(Math.ceil(filteredTickets.length / ticketsPerPage), p + 1))
                      }
                      disabled={currentPage === Math.ceil(filteredTickets.length / ticketsPerPage)}
                    >
                      Siguiente
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal para ver y responder a un ticket */}
      <Dialog open={messageOpen} onOpenChange={setMessageOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
          {selectedTicket && (
            <>
              <DialogHeader>
                <div className="flex justify-between">
                  <DialogTitle>Ticket #{selectedTicket.ticketNumber}</DialogTitle>
                  <div className="flex gap-2">
                    {renderStatusBadge(selectedTicket.status)}
                    {renderPriorityBadge(selectedTicket.priority)}
                  </div>
                </div>
                <DialogDescription>
                  <div className="text-sm text-muted-foreground mt-1 flex items-center flex-wrap gap-x-2">
                    <div className="flex items-center">
                      <span>Usuario: </span>
                      <span className="font-mono ml-1">{truncateAddress(selectedTicket.walletAddress)}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 ml-1"
                        onClick={() => {
                          navigator.clipboard.writeText(selectedTicket.walletAddress);
                          toast({
                            title: "Dirección copiada",
                            description: "La dirección del wallet ha sido copiada al portapapeles",
                            duration: 2000,
                          });
                        }}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                    <span>|</span>
                    <span>Categoría: {selectedTicket.category}</span>
                    <span>|</span>
                    <span>Creado: {formatDate(selectedTicket.createdAt)}</span>
                  </div>
                  <div className="font-medium mt-2">{selectedTicket.subject}</div>
                  {selectedTicket.description && (
                    <div className="mt-2 text-sm whitespace-pre-wrap border-t pt-2">{selectedTicket.description}</div>
                  )}
                </DialogDescription>
              </DialogHeader>

              <div className="mb-4">
                <div className="flex flex-wrap gap-2 mb-4">
                  <Button 
                    variant={selectedTicket.status === "open" ? "default" : "outline"}
                    size="sm" 
                    onClick={() => handleUpdateTicketStatus("open")}
                  >
                    Abrir
                  </Button>
                  <Button 
                    variant={selectedTicket.status === "in-progress" ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleUpdateTicketStatus("in-progress")}
                  >
                    En Progreso
                  </Button>
                  <Button 
                    variant={selectedTicket.status === "resolved" ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleUpdateTicketStatus("resolved")}
                  >
                    Resuelto
                  </Button>
                  <Button 
                    variant={selectedTicket.status === "closed" ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleUpdateTicketStatus("closed")}
                  >
                    Cerrado
                  </Button>
                </div>
              </div>

              <div className="py-4">
                <h4 className="text-sm font-medium mb-2">Conversación</h4>
                <div className="space-y-4 max-h-[250px] overflow-y-auto p-4 border rounded-md">
                  {isMessagesLoading ? (
                    <div className="flex justify-center py-4">
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    </div>
                  ) : (!messages || messages.length === 0) ? (
                    <div className="text-center py-4 text-muted-foreground">
                      <p>No hay mensajes en este ticket todavía.</p>
                    </div>
                  ) : (
                    messages.map((msg: any) => (
                      <div 
                        key={msg.id} 
                        className={`flex ${
                          msg.sender === "admin" ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div 
                          className={`max-w-[80%] rounded-lg p-3 ${
                            msg.sender === "admin" 
                              ? "bg-primary text-primary-foreground" 
                              : msg.sender === "user"
                                ? "bg-secondary text-secondary-foreground"
                                : "bg-muted text-muted-foreground"
                          }`}
                        >
                          <div className="text-xs mb-1">
                            {msg.sender === "admin" 
                              ? "Administrador" 
                              : msg.sender === "user" 
                                ? "Usuario" 
                                : "Sistema"}
                            {" "}• {formatDate(msg.createdAt)}
                          </div>
                          <div className="whitespace-pre-wrap">{msg.message}</div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {selectedTicket.status !== "closed" && (
                <form onSubmit={handleSendMessage} className="space-y-4">
                  <div className="grid gap-2">
                    <label htmlFor="message">Responder</label>
                    <Textarea
                      id="message"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Escribe tu mensaje aquí..."
                      rows={3}
                      required
                    />
                  </div>
                  <div className="flex justify-between">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setMessageOpen(false)}
                    >
                      <ChevronLeft className="h-4 w-4 mr-2" />
                      Volver
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={sendMessageMutation.isPending}
                    >
                      {sendMessageMutation.isPending && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      <Send className="h-4 w-4 mr-2" />
                      Enviar
                    </Button>
                  </div>
                </form>
              )}
              
              {selectedTicket.status === "closed" && (
                <div className="border-t pt-4 flex justify-between">
                  <p className="text-muted-foreground">
                    Este ticket está cerrado. {selectedTicket.closedAt && `Cerrado el ${formatDate(selectedTicket.closedAt)}`}
                  </p>
                  <Button
                    variant="outline" 
                    onClick={() => setMessageOpen(false)}
                  >
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Volver
                  </Button>
                </div>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Diálogo de confirmación para eliminar ticket */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar eliminación</AlertDialogTitle>
            <AlertDialogDescription>
              {ticketToDelete && (
                <>
                  ¿Está seguro de que desea eliminar el ticket <span className="font-medium">{ticketToDelete.ticketNumber}</span>?
                  <br/><br/>
                  <span className="font-medium">Asunto:</span> {ticketToDelete.subject}
                  <br/>
                  <span className="font-medium">Usuario:</span> {truncateAddress(ticketToDelete.walletAddress)}
                  <br/>
                  <span className="font-medium">Estado:</span> {ticketToDelete.status}
                  <br/><br/>
                  Esta acción no se puede deshacer y eliminará permanentemente toda la información y mensajes asociados a este ticket.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => {
                if (ticketToDelete) {
                  deleteTicketMutation.mutate(ticketToDelete.id);
                }
              }}
              className="bg-red-500 hover:bg-red-600"
            >
              {deleteTicketMutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Trash className="mr-2 h-4 w-4" />
              )}
              Eliminar ticket
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Diálogo para crear un nuevo ticket */}
      <Dialog open={isCreateTicketOpen} onOpenChange={setIsCreateTicketOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Crear Nuevo Ticket de Soporte</DialogTitle>
            <DialogDescription>
              Cree un nuevo ticket para enviar a sus usuarios.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {/* Selección de tipo de destinatario */}
            <div className="space-y-2">
              <Label>Destinatarios</Label>
              <RadioGroup 
                value={recipientType} 
                onValueChange={(value) => setRecipientType(value as "single" | "multiple" | "all")}
                className="flex flex-col sm:flex-row gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="single" id="single" />
                  <Label htmlFor="single" className="flex items-center cursor-pointer">
                    <User className="h-4 w-4 mr-2" />
                    Usuario Específico
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="multiple" id="multiple" />
                  <Label htmlFor="multiple" className="flex items-center cursor-pointer">
                    <Users className="h-4 w-4 mr-2" />
                    Varios Usuarios
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="all" id="all" />
                  <Label htmlFor="all" className="flex items-center cursor-pointer">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Todos los Usuarios
                  </Label>
                </div>
              </RadioGroup>
            </div>
            
            {/* Búsqueda y selección de usuarios */}
            {(recipientType === "single" || recipientType === "multiple") && (
              <div className="space-y-2">
                <Label>Seleccionar Usuario{recipientType === "multiple" ? "s" : ""}</Label>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por dirección, nombre, email, ID o cualquier dato..."
                    className="pl-8"
                    value={userSearchQuery}
                    onChange={(e) => setUserSearchQuery(e.target.value)}
                  />
                  {userSearchQuery && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1 h-7 w-7"
                      onClick={() => setUserSearchQuery("")}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                
                {/* Lista de usuarios filtrados */}
                <div className="border rounded-md h-[150px] overflow-y-auto p-2">
                  {isUsersLoading ? (
                    <div className="flex justify-center items-center h-full">
                      <Loader2 className="h-5 w-5 animate-spin text-primary" />
                    </div>
                  ) : filteredUsers.length === 0 ? (
                    <div className="text-center py-4 text-muted-foreground">
                      <p>No se encontraron usuarios.</p>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      {filteredUsers.map((user: any) => (
                        <div 
                          key={user.walletAddress} 
                          className="flex items-center p-2 hover:bg-muted rounded-md"
                        >
                          <Checkbox 
                            id={user.walletAddress}
                            checked={selectedUsers.includes(user.walletAddress)}
                            onCheckedChange={(checked) => {
                              if (recipientType === "single") {
                                setSelectedUsers(checked ? [user.walletAddress] : []);
                              } else {
                                if (checked) {
                                  setSelectedUsers([...selectedUsers, user.walletAddress]);
                                } else {
                                  setSelectedUsers(selectedUsers.filter(addr => addr !== user.walletAddress));
                                }
                              }
                            }}
                            className="mr-2"
                          />
                          <Label 
                            htmlFor={user.walletAddress} 
                            className="flex-1 flex flex-col cursor-pointer text-sm"
                          >
                            <div className="flex items-center">
                              {user.username && <span className="font-medium mr-2">{user.username}</span>}
                              <span className="font-mono text-xs opacity-75">{truncateAddress(user.walletAddress)}</span>
                            </div>
                            <div className="text-xs text-muted-foreground mt-1 flex flex-wrap gap-2">
                              {user.email && <span>Email: {user.email}</span>}
                              {user.id && <span>ID: {user.id}</span>}
                              {user.role && <span>Rol: {user.role}</span>}
                              {user.tag && <span>Tag: {user.tag}</span>}
                              {user.createdAt && <span>Registrado: {new Date(user.createdAt).toLocaleDateString()}</span>}
                            </div>
                          </Label>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                {/* Mostrar usuarios seleccionados */}
                {selectedUsers.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm font-medium">Seleccionado{selectedUsers.length > 1 ? "s" : ""}:</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedUsers.map(address => (
                        <Badge 
                          key={address} 
                          variant="secondary" 
                          className="flex items-center"
                        >
                          {truncateAddress(address)}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-4 w-4 ml-1 p-0"
                            onClick={() => setSelectedUsers(selectedUsers.filter(addr => addr !== address))}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* Información del ticket */}
            <div className="space-y-2">
              <Label htmlFor="subject">Asunto</Label>
              <Input 
                id="subject" 
                placeholder="Ingrese el asunto del ticket" 
                value={newTicketSubject}
                onChange={(e) => setNewTicketSubject(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="message">Mensaje</Label>
              <Textarea 
                id="message" 
                placeholder="Ingrese el mensaje para el ticket"
                className="min-h-[120px]"
                value={newTicketMessage}
                onChange={(e) => setNewTicketMessage(e.target.value)}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Categoría</Label>
                <Select 
                  value={newTicketCategory} 
                  onValueChange={setNewTicketCategory}
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Seleccionar categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="billing">Facturación</SelectItem>
                    <SelectItem value="technical">Soporte Técnico</SelectItem>
                    <SelectItem value="account">Cuenta</SelectItem>
                    <SelectItem value="feature">Sugerencia</SelectItem>
                    <SelectItem value="security">Seguridad</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="priority">Prioridad</Label>
                <Select 
                  value={newTicketPriority} 
                  onValueChange={setNewTicketPriority}
                >
                  <SelectTrigger id="priority">
                    <SelectValue placeholder="Seleccionar prioridad" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Baja</SelectItem>
                    <SelectItem value="medium">Media</SelectItem>
                    <SelectItem value="high">Alta</SelectItem>
                    <SelectItem value="urgent">Urgente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsCreateTicketOpen(false);
                resetCreateTicketForm();
              }}
            >
              Cancelar
            </Button>
            <Button
              onClick={() => {
                // Validar los campos
                if (!newTicketSubject.trim()) {
                  toast({
                    title: "Error",
                    description: "Por favor ingrese un asunto para el ticket.",
                    variant: "destructive",
                  });
                  return;
                }
                
                if (!newTicketMessage.trim()) {
                  toast({
                    title: "Error",
                    description: "Por favor ingrese un mensaje para el ticket.",
                    variant: "destructive",
                  });
                  return;
                }
                
                if ((recipientType === "single" || recipientType === "multiple") && selectedUsers.length === 0) {
                  toast({
                    title: "Error",
                    description: "Por favor seleccione al menos un usuario.",
                    variant: "destructive",
                  });
                  return;
                }
                
                // Determinar los destinatarios
                let recipients: string[] = [];
                if (recipientType === "all") {
                  // Si es "all", obtenemos todos los usuarios
                  recipients = users.map((user: any) => user.walletAddress);
                } else {
                  // Si es "single" o "multiple", usamos los seleccionados
                  recipients = selectedUsers;
                }
                
                // Crear tickets para cada destinatario
                let ticketsCreated = 0;
                const totalTickets = recipients.length;
                
                recipients.forEach((walletAddress) => {
                  createTicketMutation.mutate({
                    walletAddress,
                    subject: newTicketSubject,
                    description: newTicketMessage,
                    category: newTicketCategory,
                    priority: newTicketPriority,
                  }, {
                    onSuccess: () => {
                      ticketsCreated++;
                      
                      // Si hemos terminado con todos los tickets, mostrar mensaje final
                      if (ticketsCreated === totalTickets) {
                        toast({
                          title: "Tickets creados",
                          description: `Se han creado ${totalTickets} ticket${totalTickets !== 1 ? 's' : ''} exitosamente.`,
                        });
                        
                        setIsCreateTicketOpen(false);
                        resetCreateTicketForm();
                        refetchTickets();
                      }
                    }
                  });
                });
              }}
              disabled={createTicketMutation.isPending}
            >
              {createTicketMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creando...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Crear Ticket{recipientType !== "single" ? "s" : ""}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}