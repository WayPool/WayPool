import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Edit, Trash2, Play, Download, Star } from "lucide-react";

// Schema para validación del formulario
const podcastSchema = z.object({
  title: z.string().min(1, "El título es obligatorio"),
  description: z.string().min(1, "La descripción es obligatoria"),
  audio_url: z.string().url("URL de audio inválida"),
  language: z.string().min(1, "El idioma es obligatorio"),
  duration: z.union([z.string(), z.number()]).transform((val) => String(val)),
  file_size: z.string().optional(),
  audio_type: z.string().default("wav"),
  category: z.string().min(1, "La categoría es obligatoria"),
  tags: z.union([z.string(), z.array(z.string())]).transform((val) => 
    Array.isArray(val) ? val.join(',') : val
  ).optional(),
  transcript: z.string().optional(),
  thumbnail_url: z.string().refine((val) => 
    val === "" || val.startsWith('http') || val.startsWith('/'), 
    "URL debe ser válida o estar vacía"
  ).optional(),
  published_date: z.string().optional(),
  active: z.boolean().default(true),
  featured: z.boolean().default(false),
  created_by: z.string().default("admin")
});

type PodcastFormData = z.infer<typeof podcastSchema>;

interface Podcast {
  id: number;
  title: string;
  description: string;
  audio_url: string;
  language: string;
  duration: string;
  file_size?: string;
  audio_type: string;
  category: string;
  tags?: string;
  transcript?: string;
  thumbnail_url?: string;
  published_date?: string;
  active: boolean;
  featured: boolean;
  download_count: number;
  play_count: number;
  created_at: string;
  updated_at: string;
  created_by: string;
}

export default function PodcastManagement() {
  const [editingPodcast, setEditingPodcast] = useState<Podcast | null>(null);
  const [isCreateMode, setIsCreateMode] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch podcasts desde el servidor principal
  const { data: podcasts = [], isLoading } = useQuery({
    queryKey: ['/api/admin/podcasts'],
    queryFn: async () => {
      const response = await fetch('/api/admin/podcasts', {
        headers: {
          'x-wallet-address': localStorage.getItem('walletAddress') || ''
        }
      });
      if (!response.ok) {
        throw new Error('Error al cargar podcasts');
      }
      return response.json();
    }
  });

  // Form setup with proper default values
  const form = useForm<PodcastFormData>({
    resolver: zodResolver(podcastSchema),
    defaultValues: {
      title: "",
      description: "",
      audio_url: "",
      language: "es",
      duration: "",
      file_size: "",
      audio_type: "wav",
      category: "",
      tags: "",
      transcript: "",
      thumbnail_url: "",
      published_date: "",
      active: true,
      featured: false,
      created_by: "admin"
    }
  });

  // Reset form when editing podcast changes
  useEffect(() => {
    if (editingPodcast) {
      form.reset({
        title: editingPodcast.title || "",
        description: editingPodcast.description || "",
        audio_url: editingPodcast.audio_url || "",
        language: editingPodcast.language || "es",
        duration: String(editingPodcast.duration || ""),
        file_size: editingPodcast.file_size || "",
        audio_type: editingPodcast.audio_type || "wav",
        category: editingPodcast.category || "",
        tags: Array.isArray(editingPodcast.tags) ? editingPodcast.tags.join(',') : (editingPodcast.tags || ""),
        transcript: editingPodcast.transcript || "",
        thumbnail_url: editingPodcast.thumbnail_url || "",
        published_date: editingPodcast.published_date || "",
        active: editingPodcast.active ?? true,
        featured: editingPodcast.featured ?? false,
        created_by: editingPodcast.created_by || "admin"
      });
    } else if (isCreateMode) {
      form.reset({
        title: "",
        description: "",
        audio_url: "",
        language: "es",
        duration: "",
        file_size: "",
        audio_type: "wav",
        category: "",
        tags: "",
        transcript: "",
        thumbnail_url: "",
        published_date: "",
        active: true,
        featured: false,
        created_by: "admin"
      });
    }
  }, [editingPodcast, isCreateMode, form]);

  // Create/Update mutation usando servidor principal
  const saveMutation = useMutation({
    mutationFn: async (data: PodcastFormData) => {
      const url = editingPodcast 
        ? `/api/admin/podcasts/${editingPodcast.id}` 
        : '/api/admin/podcasts';
      const method = editingPodcast ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'x-wallet-address': localStorage.getItem('walletAddress') || ''
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error al ${editingPodcast ? 'actualizar' : 'crear'} el podcast: ${errorText}`);
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/podcasts'] });
      toast({
        title: "Éxito",
        description: `Podcast ${editingPodcast ? 'actualizado' : 'creado'} correctamente`,
      });
      handleCloseDialog();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Delete mutation usando servidor principal
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/admin/podcasts/${id}`, {
        method: 'DELETE',
        headers: {
          'x-wallet-address': localStorage.getItem('walletAddress') || ''
        }
      });

      if (!response.ok) {
        throw new Error('Error al eliminar el podcast');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/podcasts'] });
      toast({
        title: "Éxito",
        description: "Podcast eliminado correctamente",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingPodcast(null);
    setIsCreateMode(false);
    form.reset();
  };

  const handleEdit = (podcast: Podcast) => {
    setEditingPodcast(podcast);
    setIsCreateMode(false);
    setDialogOpen(true);
  };

  const handleCreate = () => {
    setEditingPodcast(null);
    setIsCreateMode(true);
    setDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm('¿Estás seguro de que quieres eliminar este podcast?')) {
      deleteMutation.mutate(id);
    }
  };

  const onSubmit = (data: PodcastFormData) => {
    saveMutation.mutate(data);
  };

  const formatFileSize = (sizeStr?: string) => {
    if (!sizeStr) return 'N/A';
    const size = parseInt(sizeStr);
    if (isNaN(size)) return sizeStr;
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatDuration = (duration: string | number) => {
    const durationStr = String(duration || '0');
    if (durationStr.includes(':')) return durationStr;
    const minutes = parseInt(durationStr);
    if (isNaN(minutes)) return durationStr;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}:${mins.toString().padStart(2, '0')}:00` : `${mins}:00`;
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Gestión de Podcasts</CardTitle>
          <CardDescription>Cargando podcasts...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Gestión de Podcasts</CardTitle>
              <CardDescription>
                Administra todos los podcasts de la plataforma
              </CardDescription>
            </div>
            <Button onClick={handleCreate} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Nuevo Podcast
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Título</TableHead>
                  <TableHead>Idioma</TableHead>
                  <TableHead>Duración</TableHead>
                  <TableHead>Categoría</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Estadísticas</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {podcasts.map((podcast: Podcast) => (
                  <TableRow key={podcast.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div>
                          <div className="font-medium">{podcast.title}</div>
                          <div className="text-sm text-muted-foreground">
                            {podcast.description.length > 60 
                              ? `${podcast.description.substring(0, 60)}...` 
                              : podcast.description}
                          </div>
                        </div>
                        {podcast.featured && <Star className="h-4 w-4 text-yellow-500" />}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{podcast.language.toUpperCase()}</Badge>
                    </TableCell>
                    <TableCell>{formatDuration(podcast.duration)}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{podcast.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={podcast.active ? "default" : "secondary"}>
                        {podcast.active ? "Activo" : "Inactivo"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="flex items-center gap-1">
                          <Play className="h-3 w-3" />
                          {podcast.play_count || 0}
                        </div>
                        <div className="flex items-center gap-1">
                          <Download className="h-3 w-3" />
                          {podcast.download_count || 0}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(podcast)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(podcast.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Dialog for Create/Edit */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingPodcast ? 'Editar Podcast' : 'Crear Nuevo Podcast'}
            </DialogTitle>
            <DialogDescription>
              {editingPodcast 
                ? 'Modifica los datos del podcast seleccionado'
                : 'Completa la información para crear un nuevo podcast'
              }
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Título</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Título del podcast" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Descripción</FormLabel>
                      <FormControl>
                        <Textarea {...field} placeholder="Descripción del podcast" rows={3} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="audio_url"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>URL del Audio</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="https://example.com/audio.wav" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="language"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Idioma</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar idioma" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="es">Español</SelectItem>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="pt">Português</SelectItem>
                          <SelectItem value="fr">Français</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duración</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="36:45 o 2205 (segundos)" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Categoría</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar categoría" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="DeFi">DeFi</SelectItem>
                          <SelectItem value="Blockchain">Blockchain</SelectItem>
                          <SelectItem value="NFTs">NFTs</SelectItem>
                          <SelectItem value="Technical">Technical</SelectItem>
                          <SelectItem value="Tutorial">Tutorial</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="audio_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de Audio</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Tipo de archivo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="wav">WAV</SelectItem>
                          <SelectItem value="mp3">MP3</SelectItem>
                          <SelectItem value="m4a">M4A</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="tags"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Tags</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="DeFi, Uniswap, Liquidity (separados por comas)" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="thumbnail_url"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>URL de Miniatura (Opcional)</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="https://example.com/thumbnail.jpg" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="active"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Activo</FormLabel>
                        <FormDescription>
                          El podcast estará visible públicamente
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="featured"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Destacado</FormLabel>
                        <FormDescription>
                          Aparecerá como podcast destacado
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={handleCloseDialog}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={saveMutation.isPending}>
                  {saveMutation.isPending 
                    ? 'Guardando...' 
                    : editingPodcast 
                      ? 'Actualizar' 
                      : 'Crear'
                  }
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}