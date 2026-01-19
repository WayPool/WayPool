import { useState, useEffect, useMemo } from "react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format, isAfter, isBefore, startOfDay, endOfDay, differenceInDays, addDays, parse, isValid } from "date-fns";
import { es } from "date-fns/locale";
import { AlertTriangle, Calendar as CalendarIcon, Check, ChevronLeft, ChevronRight, ChevronsUpDown, Download, Eye, Mail, Phone, SortAsc, SortDesc, Trash, User, UsersRound, DollarSign, Clock, BarChart4, Filter } from "lucide-react";

// Tipos para leads
interface Lead {
  id: number;
  name: string;           // Campo name para compatibilidad
  full_name: string;      // Campo full_name para compatibilidad
  email: string;
  phone?: string;
  company?: string;
  investment?: string;    // Campo investment para compatibilidad
  investment_size: string; // Campo investment_size para compatibilidad
  message?: string;
  language_preference?: string;
  status: string;
  created_at: string;
  updated_at?: string;
  notes?: string;
  additional_data?: {
    phoneCountryCode?: string;
    phoneFormatted?: string;
    [key: string]: any;
  };
}

type SortOption = {
  field: keyof Lead | "investment" | "created_at" | "name";
  direction: "asc" | "desc";
};

export default function LeadsManager() {
  // Estados para los leads
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]);
  const [displayedLeads, setDisplayedLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Estados para los filtros
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [investmentFilter, setInvestmentFilter] = useState("all");
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });
  
  // Estados para paginación y ordenamiento
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortOption, setSortOption] = useState<SortOption>({
    field: "created_at",
    direction: "desc",
  });
  
  // Estados para gestión de leads
  const [viewLead, setViewLead] = useState<Lead | null>(null);
  const [leadNotes, setLeadNotes] = useState("");
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  
  const { toast } = useToast();
  
  // Cargar leads al montar el componente
  useEffect(() => {
    loadLeads();
  }, []);

  // Filtrar leads cuando cambian los filtros
  useEffect(() => {
    filterLeads();
  }, [leads, statusFilter, searchQuery, dateRange, investmentFilter]);

  // Aplicar paginación y ordenamiento a los leads filtrados
  useEffect(() => {
    applyPaginationAndSort();
  }, [filteredLeads, currentPage, itemsPerPage, sortOption]);

  // Cargar leads desde la API
  const loadLeads = async () => {
    setIsLoading(true);
    try {
      const response = await apiRequest<any[]>("GET", "/api/admin/leads");
      console.log("Respuesta de API /api/admin/leads:", response);
      
      if (response) {
        // Procesar cada lead para asegurar que el campo additional_data sea válido
        const sanitizedLeads = response.map(lead => {
          // Imprimir los datos originales del lead para depuración
          console.log(`Procesando lead #${lead.id}, additional_data:`, lead.additional_data);
          // Crear una copia del lead - Campos adaptados para API actual
          const sanitizedLead: Lead = {
            id: lead.id || 0,
            name: lead.name || lead.fullName || "",
            full_name: lead.fullName || lead.name || "",
            email: lead.email || "",
            phone: lead.phone || "",
            company: lead.company || "",
            investment_size: lead.investmentSize || lead.investment_size || lead.investment || "",
            investment: lead.investmentSize || lead.investment_size || lead.investment || "",
            message: lead.message || "",
            language_preference: lead.languagePreference || "",
            status: lead.status || "nuevo",
            created_at: lead.createdAt || lead.created_at || new Date().toISOString(),
            updated_at: lead.updatedAt || lead.updated_at,
            notes: lead.notes || "",
            additional_data: {},
          };
          
          // Sanitizar el campo additional_data
          try {
            console.log(`Lead #${lead.id}: additional_data tipo: ${typeof lead.additional_data}`);
            
            if (lead.additional_data) {
              // Si additional_data es una cadena, intentar parsearlo
              if (typeof lead.additional_data === 'string') {
                console.log(`Lead #${lead.id}: additional_data es string, intentando parsear: ${lead.additional_data}`);
                try {
                  sanitizedLead.additional_data = JSON.parse(lead.additional_data);
                  console.log(`Lead #${lead.id}: additional_data parseado correctamente:`, sanitizedLead.additional_data);
                } catch (jsonError) {
                  console.error(`Lead #${lead.id}: Error en JSON.parse:`, jsonError);
                  // Si falla el parsing, usar un objeto vacío
                  sanitizedLead.additional_data = {};
                }
              } 
              // Si es un objeto, usarlo directamente pero verificar que no sea null
              else if (typeof lead.additional_data === 'object') {
                if (lead.additional_data === null) {
                  console.log(`Lead #${lead.id}: additional_data es objeto pero null, usando objeto vacío`);
                  sanitizedLead.additional_data = {};
                } else {
                  console.log(`Lead #${lead.id}: additional_data es objeto, usando directamente:`, lead.additional_data);
                  // Hacer una copia segura del objeto para evitar referencias al original
                  try {
                    sanitizedLead.additional_data = JSON.parse(JSON.stringify(lead.additional_data));
                  } catch (jsonError) {
                    console.error(`Lead #${lead.id}: Error al serializar/deserializar additional_data:`, jsonError);
                    sanitizedLead.additional_data = {};
                  }
                }
              } 
              // Si no es ni string ni objeto, establecerlo como un objeto vacío
              else {
                console.log(`Lead #${lead.id}: additional_data es de tipo inesperado (${typeof lead.additional_data}), usando objeto vacío`);
                sanitizedLead.additional_data = {};
              }
            } else {
              console.log(`Lead #${lead.id}: additional_data es undefined/null, usando objeto vacío`);
              sanitizedLead.additional_data = {};
            }
          } catch (parseError) {
            console.error(`Lead #${lead.id}: Error general al procesar additional_data:`, parseError);
            sanitizedLead.additional_data = {}; // En caso de error, usar un objeto vacío
          }
          
          return sanitizedLead;
        });
        
        setLeads(sanitizedLeads);
      }
    } catch (error) {
      console.error("Error cargando leads:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los leads. Inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Filtrar leads según filtros seleccionados
  const filterLeads = () => {
    let filtered = [...leads];

    // Filtrar por estado
    if (statusFilter !== "all") {
      filtered = filtered.filter((lead) => lead.status === statusFilter);
    }

    // Filtrar por rango de inversión
    if (investmentFilter !== "all") {
      filtered = filtered.filter((lead) => {
        const leadInvestment = lead.investment_size || lead.investment || "";
        return leadInvestment === investmentFilter;
      });
    }

    // Filtrar por rango de fechas
    if (dateRange.from || dateRange.to) {
      filtered = filtered.filter((lead) => {
        const leadDate = new Date(lead.created_at);
        
        if (dateRange.from && dateRange.to) {
          // Filtro con fecha de inicio y fin
          return (
            isAfter(leadDate, startOfDay(dateRange.from)) && 
            isBefore(leadDate, endOfDay(dateRange.to))
          );
        } else if (dateRange.from) {
          // Solo fecha de inicio
          return isAfter(leadDate, startOfDay(dateRange.from));
        } else if (dateRange.to) {
          // Solo fecha de fin
          return isBefore(leadDate, endOfDay(dateRange.to));
        }
        
        return true;
      });
    }

    // Filtrar por búsqueda
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (lead) => {
          const nombreCompleto = (lead.full_name || lead.name || "").toLowerCase();
          const rangoInversion = formatInvestmentRange(lead.investment_size || lead.investment || "").toLowerCase();
          
          return nombreCompleto.includes(query) ||
            lead.email.toLowerCase().includes(query) ||
            (lead.company && lead.company.toLowerCase().includes(query)) ||
            (lead.phone && lead.phone.toLowerCase().includes(query)) ||
            rangoInversion.includes(query);
        }
      );
    }

    setFilteredLeads(filtered);
    // Reset a la primera página cuando cambian los filtros
    setCurrentPage(1);
  };
  
  // Aplicar paginación y ordenamiento a los leads filtrados
  const applyPaginationAndSort = () => {
    if (!filteredLeads.length) {
      setDisplayedLeads([]);
      return;
    }
    
    console.log("Aplicando paginación y ordenamiento a", filteredLeads.length, "leads");
    
    // Paso 1: Aplicar ordenamiento
    let sorted = [...filteredLeads];
    
    // Ordenar según la opción seleccionada
    const { field, direction } = sortOption;
    
    sorted.sort((a, b) => {
      let valueA, valueB;
      
      // Determinar los valores a comparar según el campo seleccionado
      switch (field) {
        case "id":
          valueA = a.id;
          valueB = b.id;
          break;
        case "name":
        case "full_name":
          valueA = (a.full_name || a.name || "").toLowerCase();
          valueB = (b.full_name || b.name || "").toLowerCase();
          break;
        case "email":
          valueA = a.email.toLowerCase();
          valueB = b.email.toLowerCase();
          break;
        case "investment":
        case "investment_size":
          // Convertir rangos de inversión a valores numéricos para ordenamiento
          const getInvestmentValue = (range: string) => {
            switch (range) {
              case "menos-de-5000": return 1;
              case "5000-10000": return 2;
              case "10000-25000": return 3;
              case "25000-50000": return 4;
              case "50000-100000": return 5;
              case "mas-de-100000": return 6;
              default: return 0;
            }
          };
          valueA = getInvestmentValue(a.investment_size || a.investment || "");
          valueB = getInvestmentValue(b.investment_size || b.investment || "");
          break;
        case "created_at":
          valueA = new Date(a.created_at).getTime();
          valueB = new Date(b.created_at).getTime();
          break;
        case "status":
          valueA = a.status;
          valueB = b.status;
          break;
        default:
          valueA = a.id;
          valueB = b.id;
      }
      
      // Aplicar la dirección del ordenamiento
      if (direction === "asc") {
        return valueA > valueB ? 1 : valueA < valueB ? -1 : 0;
      } else {
        return valueA < valueB ? 1 : valueA > valueB ? -1 : 0;
      }
    });
    
    // Paso 2: Aplicar paginación
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedLeads = sorted.slice(startIndex, endIndex);
    
    console.log("Leads a mostrar después de paginación:", paginatedLeads.length);
    if (paginatedLeads.length > 0) {
      console.log("Muestra de lead para debug:", 
        JSON.stringify({
          id: paginatedLeads[0].id,
          nombre: paginatedLeads[0].full_name || paginatedLeads[0].name,
          email: paginatedLeads[0].email,
          inversion: paginatedLeads[0].investment_size || paginatedLeads[0].investment
        })
      );
    }
    
    // Actualizar los leads mostrados
    setDisplayedLeads(paginatedLeads);
  };

  // Actualizar estado de un lead
  const updateLeadStatus = async (leadId: number, newStatus: string) => {
    setIsUpdatingStatus(true);
    try {
      const response = await apiRequest<{ success: boolean }>("PATCH", `/api/admin/leads/${leadId}`, {
        status: newStatus,
        notes: leadNotes,
      });

      if (response.success) {
        // Actualizar lead en el estado local
        setLeads((prevLeads) =>
          prevLeads.map((lead) =>
            lead.id === leadId
              ? { ...lead, status: newStatus, notes: leadNotes, updated_at: new Date().toISOString() }
              : lead
          )
        );

        toast({
          title: "Estado actualizado",
          description: `El estado del lead ha sido actualizado a ${newStatus}`,
        });

        // Cerrar el diálogo de visualización
        setViewLead(null);
      }
    } catch (error) {
      console.error("Error actualizando estado del lead:", error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el estado del lead. Inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  // Exportar leads a CSV
  const exportLeadsToCSV = async () => {
    setExportLoading(true);
    try {
      // Construir datos CSV
      const headers = ["ID", "Nombre Completo", "Email", "Teléfono", "País", "Empresa", "Inversión", "Mensaje", "Idioma", "Estado", "Fecha", "Notas"];
      const rows = filteredLeads.map((lead) => {
        // Validar si additional_data es un objeto antes de acceder a sus propiedades
        let countryCode = "";
        if (lead.additional_data && 
            typeof lead.additional_data === 'object' && 
            lead.additional_data.phoneCountryCode && 
            typeof lead.additional_data.phoneCountryCode === 'string') {
          countryCode = lead.additional_data.phoneCountryCode.toUpperCase();
        }
        
        // Usar el campo full_name o name, dependiendo de cuál está disponible
        const nombreCompleto = lead.full_name || lead.name || "";
        // Usar investment_size o investment para compatibilidad
        const rangoInversion = formatInvestmentRange(lead.investment_size || lead.investment || "");
        
        return [
          lead.id,
          nombreCompleto,
          lead.email,
          lead.phone || "",
          countryCode,
          lead.company || "",
          rangoInversion,
          lead.message || "",
          lead.language_preference === "en" ? "Inglés" : "Español",
          lead.status === "nuevo" ? "Nuevo" : 
           lead.status === "contactado" ? "Contactado" :
           lead.status === "interesado" ? "Interesado" :
           lead.status === "convertido" ? "Convertido" :
           lead.status === "no_interesado" ? "No interesado" :
           lead.status === "inactivo" ? "Inactivo" : lead.status,
          new Date(lead.created_at).toLocaleDateString(),
          lead.notes || "",
        ];
      });

      const csvContent = [
        headers.join(","),
        ...rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")),
      ].join("\n");

      // Crear blob y descargar
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `leads_${new Date().toISOString().split("T")[0]}.csv`);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Exportación completa",
        description: "Los leads han sido exportados exitosamente",
      });
    } catch (error) {
      console.error("Error exportando leads:", error);
      toast({
        title: "Error",
        description: "No se pudieron exportar los leads. Inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setExportLoading(false);
    }
  };

  // Formatear rango de inversión para mostrar
  const formatInvestmentRange = (range: string) => {
    switch (range) {
      case "menos-de-5000":
        return "< $5,000";
      case "5000-10000":
        return "$5,000 - $10,000";
      case "10000-25000":
        return "$10,000 - $25,000";
      case "25000-50000":
        return "$25,000 - $50,000";
      case "50000-100000":
        return "$50,000 - $100,000";
      case "mas-de-100000":
        return "> $100,000";
      default:
        return range;
    }
  };

  // Obtener color del badge según el estado
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "nuevo":
        return "default";
      case "contactado":
        return "secondary";
      case "interesado":
        return "blue";
      case "convertido":
        return "success";
      case "no_interesado":
        return "destructive";
      case "inactivo":
        return "outline";
      // Compatibilidad con estados en inglés (para leads anteriores)
      case "new":
        return "default";
      case "contacted":
        return "secondary";
      case "qualified":
        return "blue";
      case "converted":
        return "success";
      case "rejected":
        return "destructive";
      default:
        return "outline";
    }
  };
  
  // Cambiar el ordenamiento
  const toggleSort = (field: SortOption['field']) => {
    setSortOption(prev => {
      if (prev.field === field) {
        // Si ya estamos ordenando por este campo, cambiar la dirección
        return {
          field,
          direction: prev.direction === 'asc' ? 'desc' : 'asc'
        };
      } else {
        // Si es un nuevo campo, ordenar ascendente por defecto
        return {
          field,
          direction: 'asc'
        };
      }
    });
  };
  
  // Funciones para paginación
  const totalPages = Math.ceil(filteredLeads.length / itemsPerPage);
  
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };
  
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };
  
  // Calcular estadísticas para las tarjetas
  const stats = useMemo(() => {
    if (leads.length === 0) return null;
    
    // Total de leads
    const totalLeads = leads.length;
    
    // Leads por estado
    const leadsByStatus = leads.reduce((acc, lead) => {
      const status = lead.status || "nuevo";
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    // Conversión (porcentaje de leads que han llegado a "convertido")
    const convertedLeads = leadsByStatus["convertido"] || 0;
    const conversionRate = totalLeads > 0 ? (convertedLeads / totalLeads) * 100 : 0;
    
    // Leads por rango de inversión
    const leadsByInvestment = leads.reduce((acc, lead) => {
      const investment = lead.investment_size || lead.investment || "";
      acc[investment] = (acc[investment] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    // Obtener el rango de inversión más popular
    let popularInvestment = "menos-de-5000";
    let maxCount = 0;
    
    for (const [investment, count] of Object.entries(leadsByInvestment)) {
      if (count > maxCount) {
        maxCount = count;
        popularInvestment = investment;
      }
    }
    
    // Leads en los últimos 30 días
    const now = new Date();
    const thirtyDaysAgo = addDays(now, -30);
    const recentLeads = leads.filter(lead => isAfter(new Date(lead.created_at), thirtyDaysAgo));
    
    return {
      totalLeads,
      convertedLeads,
      conversionRate,
      newLeads: leadsByStatus["nuevo"] || 0,
      contactedLeads: leadsByStatus["contactado"] || 0,
      interestedLeads: leadsByStatus["interesado"] || 0,
      notInterestedLeads: leadsByStatus["no_interesado"] || 0,
      popularInvestment: formatInvestmentRange(popularInvestment),
      recentLeadsCount: recentLeads.length,
      recentLeadsPercentage: totalLeads > 0 ? (recentLeads.length / totalLeads) * 100 : 0
    };
  }, [leads]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl">Gestión de Leads</CardTitle>
        <CardDescription>
          Administra y da seguimiento a los leads capturados desde el formulario de la landing page
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {/* Tarjetas de estadísticas */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Leads</p>
                    <h3 className="text-2xl font-bold mt-1">{stats.totalLeads}</h3>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <UsersRound className="h-5 w-5 text-primary" />
                  </div>
                </div>
                <div className="mt-3 text-xs text-muted-foreground">
                  <span className="font-medium">{stats.recentLeadsCount} nuevos</span> en los últimos 30 días
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Tasa de Conversión</p>
                    <h3 className="text-2xl font-bold mt-1">{stats.conversionRate.toFixed(1)}%</h3>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-green-500/20 flex items-center justify-center">
                    <BarChart4 className="h-5 w-5 text-green-500" />
                  </div>
                </div>
                <div className="mt-3 text-xs text-muted-foreground">
                  <span className="font-medium">{stats.convertedLeads} leads</span> convertidos en total
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-blue-500/10 to-blue-500/5">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Leads en Proceso</p>
                    <h3 className="text-2xl font-bold mt-1">{stats.contactedLeads + stats.interestedLeads}</h3>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <Clock className="h-5 w-5 text-blue-500" />
                  </div>
                </div>
                <div className="mt-3 text-xs text-muted-foreground">
                  <span className="font-medium">{stats.interestedLeads} interesados</span> y {stats.contactedLeads} contactados
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-amber-500/10 to-amber-500/5">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Inversión Popular</p>
                    <h3 className="text-2xl font-bold mt-1">{stats.popularInvestment}</h3>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-amber-500/20 flex items-center justify-center">
                    <DollarSign className="h-5 w-5 text-amber-500" />
                  </div>
                </div>
                <div className="mt-3 text-xs text-muted-foreground">
                  Rango de inversión más común entre los leads
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        
        {/* Filtros y acciones */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="w-full sm:w-auto flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="w-full sm:w-64">
              <Input
                placeholder="Buscar por nombre, email, etc."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="w-full sm:w-48">
              <Select
                value={statusFilter}
                onValueChange={setStatusFilter}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="nuevo">Nuevos</SelectItem>
                  <SelectItem value="contactado">Contactados</SelectItem>
                  <SelectItem value="interesado">Interesados</SelectItem>
                  <SelectItem value="convertido">Convertidos</SelectItem>
                  <SelectItem value="no_interesado">No interesados</SelectItem>
                  <SelectItem value="inactivo">Inactivos</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="w-full sm:w-auto flex items-center gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="h-9 gap-1">
                    <Filter className="h-4 w-4" />
                    <span>Filtros</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-4">
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <h4 className="font-medium leading-none">Filtrar por rango de fechas</h4>
                      <div className="flex flex-col gap-2">
                        <div className="grid gap-2">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="from-date">Desde</Label>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-7 text-xs"
                              onClick={() => setDateRange(prev => ({ ...prev, from: undefined }))}
                              disabled={!dateRange.from}
                            >
                              Limpiar
                            </Button>
                          </div>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                id="from-date"
                                variant="outline"
                                className="justify-start text-left font-normal"
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {dateRange.from ? (
                                  format(dateRange.from, "dd/MM/yyyy", { locale: es })
                                ) : (
                                  <span>Seleccionar fecha</span>
                                )}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={dateRange.from}
                                onSelect={date => setDateRange(prev => ({ ...prev, from: date }))}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                        
                        <div className="grid gap-2">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="to-date">Hasta</Label>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-7 text-xs"
                              onClick={() => setDateRange(prev => ({ ...prev, to: undefined }))}
                              disabled={!dateRange.to}
                            >
                              Limpiar
                            </Button>
                          </div>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                id="to-date"
                                variant="outline"
                                className="justify-start text-left font-normal"
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {dateRange.to ? (
                                  format(dateRange.to, "dd/MM/yyyy", { locale: es })
                                ) : (
                                  <span>Seleccionar fecha</span>
                                )}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={dateRange.to}
                                onSelect={date => setDateRange(prev => ({ ...prev, to: date }))}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-medium leading-none">Filtrar por inversión</h4>
                      <Select
                        value={investmentFilter}
                        onValueChange={setInvestmentFilter}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar rango" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todos los rangos</SelectItem>
                          <SelectItem value="menos-de-5000">Menos de $5,000</SelectItem>
                          <SelectItem value="5000-10000">$5,000 - $10,000</SelectItem>
                          <SelectItem value="10000-25000">$10,000 - $25,000</SelectItem>
                          <SelectItem value="25000-50000">$25,000 - $50,000</SelectItem>
                          <SelectItem value="50000-100000">$50,000 - $100,000</SelectItem>
                          <SelectItem value="mas-de-100000">Más de $100,000</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
            <Button 
              variant="outline"
              className="w-full sm:w-auto"
              onClick={loadLeads}
              disabled={isLoading}
            >
              Actualizar
            </Button>
            <Button 
              variant="secondary"
              className="w-full sm:w-auto"
              onClick={exportLeadsToCSV}
              disabled={exportLoading || isLoading || filteredLeads.length === 0}
            >
              <Download className="h-4 w-4 mr-2" />
              Exportar CSV
            </Button>
          </div>
        </div>

        {/* Tabla de leads */}
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableCaption>
              {isLoading 
                ? "Cargando leads..." 
                : filteredLeads.length === 0 
                  ? "No se encontraron leads con los filtros aplicados"
                  : `Total: ${filteredLeads.length} leads`
              }
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead 
                  className="w-[5%] cursor-pointer"
                  onClick={() => toggleSort("id")}
                >
                  <div className="flex items-center gap-1">
                    ID
                    {sortOption.field === "id" && (
                      sortOption.direction === "asc" ? 
                        <SortAsc className="h-4 w-4" /> : 
                        <SortDesc className="h-4 w-4" />
                    )}
                  </div>
                </TableHead>
                <TableHead 
                  className="w-[20%] cursor-pointer"
                  onClick={() => toggleSort("name")}
                >
                  <div className="flex items-center gap-1">
                    Nombre
                    {sortOption.field === "name" && (
                      sortOption.direction === "asc" ? 
                        <SortAsc className="h-4 w-4" /> : 
                        <SortDesc className="h-4 w-4" />
                    )}
                  </div>
                </TableHead>
                <TableHead 
                  className="w-[20%] cursor-pointer"
                  onClick={() => toggleSort("email")}
                >
                  <div className="flex items-center gap-1">
                    Email
                    {sortOption.field === "email" && (
                      sortOption.direction === "asc" ? 
                        <SortAsc className="h-4 w-4" /> : 
                        <SortDesc className="h-4 w-4" />
                    )}
                  </div>
                </TableHead>
                <TableHead 
                  className="w-[15%] cursor-pointer"
                  onClick={() => toggleSort("investment")}
                >
                  <div className="flex items-center gap-1">
                    Inversión
                    {sortOption.field === "investment" && (
                      sortOption.direction === "asc" ? 
                        <SortAsc className="h-4 w-4" /> : 
                        <SortDesc className="h-4 w-4" />
                    )}
                  </div>
                </TableHead>
                <TableHead 
                  className="w-[15%] cursor-pointer"
                  onClick={() => toggleSort("created_at")}
                >
                  <div className="flex items-center gap-1">
                    Fecha
                    {sortOption.field === "created_at" && (
                      sortOption.direction === "asc" ? 
                        <SortAsc className="h-4 w-4" /> : 
                        <SortDesc className="h-4 w-4" />
                    )}
                  </div>
                </TableHead>
                <TableHead 
                  className="w-[15%] cursor-pointer"
                  onClick={() => toggleSort("status")}
                >
                  <div className="flex items-center gap-1">
                    Estado
                    {sortOption.field === "status" && (
                      sortOption.direction === "asc" ? 
                        <SortAsc className="h-4 w-4" /> : 
                        <SortDesc className="h-4 w-4" />
                    )}
                  </div>
                </TableHead>
                <TableHead className="w-[10%]">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <div className="flex justify-center">
                      <div className="animate-spin h-6 w-6 border-t-2 border-primary rounded-full"></div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredLeads.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    No se encontraron leads con los filtros aplicados
                  </TableCell>
                </TableRow>
              ) : (
                displayedLeads.map((lead) => (
                  <TableRow key={lead.id}>
                    <TableCell className="font-medium">{lead.id}</TableCell>
                    <TableCell>
                      {/* Mostrar nombre con prioridad a fullName sobre name para compatibilidad con API */}
                      {lead.full_name || lead.name || ""}
                    </TableCell>
                    <TableCell>{lead.email}</TableCell>
                    <TableCell>
                      {/* Mostrar rango de inversión con prioridad a investmentSize */}
                      {formatInvestmentRange(lead.investment_size || lead.investment || "")}
                    </TableCell>
                    <TableCell>{new Date(lead.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(lead.status) as any}>
                        {lead.status === "nuevo" ? "Nuevo" : 
                         lead.status === "contactado" ? "Contactado" :
                         lead.status === "interesado" ? "Interesado" :
                         lead.status === "convertido" ? "Convertido" :
                         lead.status === "no_interesado" ? "No interesado" :
                         lead.status === "inactivo" ? "Inactivo" :
                         // Compatibilidad con estados antiguos en inglés
                         lead.status === "new" ? "Nuevo" : 
                         lead.status === "contacted" ? "Contactado" :
                         lead.status === "qualified" ? "Calificado" :
                         lead.status === "converted" ? "Convertido" :
                         lead.status === "rejected" ? "Rechazado" : 
                         lead.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => setViewLead(lead)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        
        {/* Controles de paginación */}
        {filteredLeads.length > 0 && (
          <div className="flex items-center justify-between py-4">
            <div className="flex-1 text-sm text-muted-foreground">
              Mostrando <span className="font-medium">{displayedLeads.length}</span> de{" "}
              <span className="font-medium">{filteredLeads.length}</span> leads
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-2">
                <Select
                  value={itemsPerPage.toString()}
                  onValueChange={(value) => {
                    setItemsPerPage(Number(value));
                    setCurrentPage(1); // Reseteamos la página al cambiar los ítems por página
                  }}
                >
                  <SelectTrigger className="h-8 w-[70px]">
                    <SelectValue placeholder={itemsPerPage.toString()} />
                  </SelectTrigger>
                  <SelectContent side="top">
                    {[5, 10, 25, 50, 100].map((value) => (
                      <SelectItem key={value} value={value.toString()}>
                        {value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div>por página</div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={prevPage}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="text-sm">
                  Página <span className="font-medium">{currentPage}</span> de{" "}
                  <span className="font-medium">{totalPages}</span>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={nextPage}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>

      {/* Diálogo para ver detalles del lead */}
      <Dialog 
        open={!!viewLead} 
        onOpenChange={(open) => !open && setViewLead(null)}
      >
        <DialogContent className="max-w-2xl">
          {viewLead && (
            <>
              <DialogHeader>
                <DialogTitle>Detalles del Lead</DialogTitle>
                <DialogDescription>
                  Información completa y gestión del lead
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center mb-1">
                      <User className="h-4 w-4 mr-2 text-muted-foreground" />
                      <Label>Nombre Completo</Label>
                    </div>
                    <div className="text-sm font-medium">{viewLead.full_name || viewLead.name || ""}</div>
                  </div>
                  
                  <div>
                    <div className="flex items-center mb-1">
                      <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                      <Label>Email</Label>
                    </div>
                    <div className="text-sm font-medium">{viewLead.email}</div>
                  </div>
                  
                  {viewLead.phone && (
                    <div>
                      <div className="flex items-center mb-1">
                        <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                        <Label>Teléfono</Label>
                      </div>
                      <div className="text-sm font-medium">
                        {viewLead.phone}
                        {viewLead.additional_data && typeof viewLead.additional_data === 'object' && viewLead.additional_data.phoneCountryCode && (
                          <Badge variant="outline" className="ml-2">
                            {typeof viewLead.additional_data.phoneCountryCode === 'string' 
                              ? viewLead.additional_data.phoneCountryCode.toUpperCase() 
                              : ''}
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {viewLead.company && (
                    <div>
                      <div className="flex items-center mb-1">
                        <Label>Empresa</Label>
                      </div>
                      <div className="text-sm font-medium">{viewLead.company}</div>
                    </div>
                  )}
                </div>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center mb-1">
                      <Label>Rango de Inversión</Label>
                    </div>
                    <div className="text-sm font-medium">
                      {formatInvestmentRange(viewLead.investment_size || viewLead.investment || "")}
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center mb-1">
                      <Label>Idioma Preferido</Label>
                    </div>
                    <div className="text-sm font-medium">
                      {viewLead.language_preference === "en" ? "Inglés" : "Español"}
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center mb-1">
                      <Label>Fecha de Captura</Label>
                    </div>
                    <div className="text-sm font-medium">
                      {new Date(viewLead.created_at).toLocaleDateString()} {new Date(viewLead.created_at).toLocaleTimeString()}
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center mb-1">
                      <Label>Estado Actual</Label>
                    </div>
                    <Badge className="text-sm" variant={getStatusBadgeVariant(viewLead.status) as any}>
                      {viewLead.status === "nuevo" ? "Nuevo" : 
                       viewLead.status === "contactado" ? "Contactado" :
                       viewLead.status === "interesado" ? "Interesado" :
                       viewLead.status === "convertido" ? "Convertido" :
                       viewLead.status === "no_interesado" ? "No interesado" :
                       viewLead.status === "inactivo" ? "Inactivo" : viewLead.status}
                    </Badge>
                  </div>
                </div>
              </div>
              
              {viewLead.message && (
                <div className="mt-4">
                  <Label>Mensaje</Label>
                  <div className="mt-1 p-3 bg-muted rounded-md text-sm">
                    {viewLead.message}
                  </div>
                </div>
              )}
              
              <div className="mt-4">
                <Label htmlFor="notes">Notas</Label>
                <Textarea 
                  id="notes"
                  value={leadNotes}
                  onChange={(e) => setLeadNotes(e.target.value)}
                  placeholder="Agregar notas sobre este lead..."
                  className="mt-1 h-24"
                />
              </div>
              
              <DialogFooter className="flex-col sm:flex-row gap-2 mt-4">
                <div className="flex-1 flex flex-col sm:flex-row gap-2">
                  <Select
                    value={viewLead.status}
                    onValueChange={(value) => updateLeadStatus(viewLead.id, value)}
                    disabled={isUpdatingStatus}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Cambiar estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="nuevo">Nuevo</SelectItem>
                      <SelectItem value="contactado">Contactado</SelectItem>
                      <SelectItem value="interesado">Interesado</SelectItem>
                      <SelectItem value="convertido">Convertido</SelectItem>
                      <SelectItem value="no_interesado">No interesado</SelectItem>
                      <SelectItem value="inactivo">Inactivo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button 
                  onClick={() => setViewLead(null)}
                  variant="outline"
                >
                  Cerrar
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
}