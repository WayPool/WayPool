import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Language, languageNames } from "@/context/language-context";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { 
  Edit, 
  Trash2, 
  Plus, 
  FileVideo, 
  Play, 
  AlertTriangle,
  ExternalLink
} from "lucide-react";

// Esquema para validación de formulario
const videoSchema = z.object({
  language: z.string().min(2, {
    message: "El idioma es obligatorio",
  }),
  mainVideoUrl: z.string().url({
    message: "Ingresa una URL válida para el video principal",
  }),
  fullVideoUrl: z.string().url({
    message: "Ingresa una URL válida para el video completo",
  }).optional().or(z.literal("")),
  videoType: z.string().optional().or(z.literal("")),
  active: z.boolean().default(true),
});

// Tipo para el video de landing page
type LandingVideo = z.infer<typeof videoSchema> & {
  id: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
};

export default function VideoManagement() {
  const { toast } = useToast();
  const [videos, setVideos] = useState<LandingVideo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState<LandingVideo | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  // Formulario para crear/editar video
  const form = useForm<z.infer<typeof videoSchema>>({
    resolver: zodResolver(videoSchema),
    defaultValues: {
      language: "",
      mainVideoUrl: "",
      fullVideoUrl: "",
      videoType: "",
      active: true,
    }
  });
  
  // Efecto para cargar todos los videos al montar el componente
  useEffect(() => {
    const fetchVideos = async () => {
      setIsLoading(true);
      
      try {
        const data = await apiRequest<LandingVideo[]>("GET", "/api/admin/landing-videos");
        setVideos(data);
      } catch (err: any) {
        console.error("Error fetching landing videos:", err);
        toast({
          title: "Error",
          description: "No se pudieron cargar los videos de la landing page",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchVideos();
  }, [toast]);
  
  // Función para abrir el diálogo de creación
  const handleCreate = () => {
    form.reset({
      language: "",
      mainVideoUrl: "",
      fullVideoUrl: "",
      videoType: "",
      active: true,
    });
    setSelectedVideo(null);
    setIsEditing(false);
    setDialogOpen(true);
  };
  
  // Función para abrir el diálogo de edición
  const handleEdit = (video: LandingVideo) => {
    form.reset({
      language: video.language,
      mainVideoUrl: video.mainVideoUrl,
      fullVideoUrl: video.fullVideoUrl || "",
      videoType: video.videoType || "",
      active: video.active,
    });
    setSelectedVideo(video);
    setIsEditing(true);
    setDialogOpen(true);
  };
  
  // Función para abrir el diálogo de eliminación
  const handleDelete = (video: LandingVideo) => {
    setSelectedVideo(video);
    setIsDeleting(true);
    setDeleteDialogOpen(true);
  };
  
  // Función para crear un nuevo video
  const handleCreateVideo = async (values: z.infer<typeof videoSchema>) => {
    try {
      const data = await apiRequest<LandingVideo>("POST", "/api/admin/landing-videos", values);
      
      // Actualizar la lista de videos
      setVideos((prev) => [...prev, data]);
      
      toast({
        title: "Video creado",
        description: `Video para ${languageNames[values.language as Language]} añadido correctamente`,
      });
      
      queryClient.invalidateQueries({ queryKey: ["/api/admin/landing-videos"] });
      setDialogOpen(false);
    } catch (err: any) {
      console.error("Error creating video:", err);
      toast({
        title: "Error",
        description: err.message || "No se pudo crear el video",
        variant: "destructive",
      });
    }
  };
  
  // Función para actualizar un video existente
  const handleUpdateVideo = async (values: z.infer<typeof videoSchema>) => {
    if (!selectedVideo) return;
    
    try {
      const data = await apiRequest<LandingVideo>(
        "PUT", 
        `/api/admin/landing-videos/${selectedVideo.id}`,
        values
      );
      
      // Actualizar la lista de videos
      setVideos((prev) => 
        prev.map((video) => (video.id === selectedVideo.id ? data : video))
      );
      
      toast({
        title: "Video actualizado",
        description: `Video para ${languageNames[values.language as Language]} actualizado correctamente`,
      });
      
      queryClient.invalidateQueries({ queryKey: ["/api/admin/landing-videos"] });
      setDialogOpen(false);
    } catch (err: any) {
      console.error("Error updating video:", err);
      toast({
        title: "Error",
        description: err.message || "No se pudo actualizar el video",
        variant: "destructive",
      });
    }
  };
  
  // Función para eliminar un video
  const handleDeleteVideo = async () => {
    if (!selectedVideo) return;
    
    try {
      await apiRequest<{ success: boolean }>(
        "DELETE", 
        `/api/admin/landing-videos/${selectedVideo.id}`
      );
      
      // Actualizar la lista de videos
      setVideos((prev) => prev.filter((video) => video.id !== selectedVideo.id));
      
      toast({
        title: "Video eliminado",
        description: `Video para ${languageNames[selectedVideo.language as Language]} eliminado correctamente`,
      });
      
      queryClient.invalidateQueries({ queryKey: ["/api/admin/landing-videos"] });
      setDeleteDialogOpen(false);
    } catch (err: any) {
      console.error("Error deleting video:", err);
      toast({
        title: "Error",
        description: err.message || "No se pudo eliminar el video",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };
  
  // Función para enviar el formulario
  const onSubmit = (values: z.infer<typeof videoSchema>) => {
    if (isEditing) {
      handleUpdateVideo(values);
    } else {
      handleCreateVideo(values);
    }
  };
  
  // Componente para mostrar un skeleton mientras carga
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Gestión de Videos</h3>
          <Skeleton className="h-9 w-[140px]" />
        </div>
        <div className="border rounded-md">
          <div className="p-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="flex py-3 space-x-4">
                <Skeleton className="h-6 w-[80px]" />
                <Skeleton className="h-6 w-[200px]" />
                <Skeleton className="h-6 w-[80px]" />
                <Skeleton className="h-6 w-[120px]" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Gestión de Videos</h3>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Video
        </Button>
      </div>
      
      {videos.length === 0 ? (
        <div className="border rounded-lg p-8 text-center">
          <FileVideo className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No hay videos configurados</h3>
          <p className="text-muted-foreground mb-4">
            Aún no has añadido ningún video para la landing page. Cada idioma puede tener un video diferente.
          </p>
          <Button onClick={handleCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Añadir primer video
          </Button>
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Idioma</TableHead>
                <TableHead>URL del Video</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {videos.map((video) => (
                <TableRow key={video.id}>
                  <TableCell className="font-medium">
                    {video.language in languageNames
                      ? languageNames[video.language as Language]
                      : video.language}
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    <a
                      href={video.mainVideoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline flex items-center"
                    >
                      <span className="truncate">{video.mainVideoUrl}</span>
                      <ExternalLink className="h-3 w-3 ml-1 flex-shrink-0" />
                    </a>
                  </TableCell>
                  <TableCell>
                    {video.active ? (
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        Activo
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                        Inactivo
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => window.open(video.mainVideoUrl, "_blank")}
                        title="Reproducir video"
                      >
                        <Play className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleEdit(video)}
                        title="Editar video"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleDelete(video)}
                        title="Eliminar video"
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
      )}
      
      {/* Diálogo para crear/editar video */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Editar Video" : "Añadir Nuevo Video"}
            </DialogTitle>
            <DialogDescription>
              {isEditing
                ? "Actualiza los datos del video para la landing page"
                : "Añade un nuevo video para mostrar en la landing page"}
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="language"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Idioma</FormLabel>
                    <Select 
                      disabled={isEditing}
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona un idioma" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(languageNames).map(([code, name]) => (
                          <SelectItem key={code} value={code}>
                            {name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      El idioma para el que se mostrará este video.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="mainVideoUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL del Video Principal</FormLabel>
                    <FormControl>
                      <Input placeholder="https://..." {...field} />
                    </FormControl>
                    <FormDescription>
                      URL del video que se mostrará en la landing page.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="fullVideoUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL del Video Completo (opcional)</FormLabel>
                    <FormControl>
                      <Input placeholder="https://..." {...field} />
                    </FormControl>
                    <FormDescription>
                      URL del video completo, si es diferente al principal.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="videoType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Video (opcional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Tipo de video" {...field} />
                    </FormControl>
                    <FormDescription>
                      Clasificación o tipo del video (ej: "Tutorial", "Demostración").
                    </FormDescription>
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
                      <FormLabel className="text-base">Video Activo</FormLabel>
                      <FormDescription>
                        Activa o desactiva este video en la landing page.
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
              
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancelar</Button>
                </DialogClose>
                <Button type="submit">
                  {isEditing ? "Actualizar" : "Crear"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Diálogo de confirmación para eliminar */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Eliminación</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas eliminar este video?
              Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          
          {selectedVideo && (
            <div className="py-3">
              <div className="flex items-center space-x-2 mb-2">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                <p className="font-medium">
                  Video para: {languageNames[selectedVideo.language as Language] || selectedVideo.language}
                </p>
              </div>
              <p className="text-sm text-muted-foreground truncate">{selectedVideo.mainVideoUrl}</p>
            </div>
          )}
          
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
            <Button 
              variant="destructive" 
              onClick={handleDeleteVideo}
              disabled={isDeleting}
            >
              {isDeleting ? "Eliminando..." : "Eliminar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}