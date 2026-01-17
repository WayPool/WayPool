import { useState, useEffect } from "react";
import { useLanguage } from "@/context/language-context";
import { apiRequest } from "@/lib/queryClient";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { AlertTriangle, ExternalLink } from "lucide-react";

// Tipo para el video de landing page
interface LandingVideo {
  id: number;
  language: string;
  mainVideoUrl: string;
  fullVideoUrl?: string;
  videoType?: string;
  active: boolean;
  createdAt: string;
  updatedAt?: string;
  createdBy?: string;
}

interface MultiLanguageVideoProps {
  className?: string;
  language?: string;
}

export default function MultiLanguageVideo({ className = "", language: propLanguage }: MultiLanguageVideoProps) {
  const { language: contextLanguage } = useLanguage();
  const language = propLanguage || contextLanguage;
  const [video, setVideo] = useState<LandingVideo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Efecto para cargar el video según el idioma actual
  useEffect(() => {
    const fetchVideo = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Obtener el video para el idioma seleccionado
        const data = await apiRequest<LandingVideo>(
          "GET", 
          `/api/admin/landing-videos/language/${language}`
        );
        
        setVideo(data);
      } catch (err: any) {
        console.error("Error fetching landing video:", err);
        setError(
          err.message || 
          "No se pudo cargar el video. Por favor intenta de nuevo más tarde."
        );
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchVideo();
  }, [language]);
  
  // Si está cargando, mostrar skeleton
  if (isLoading) {
    return (
      <div className="w-full aspect-video rounded-lg overflow-hidden">
        <Skeleton className="w-full h-full" />
      </div>
    );
  }
  
  // Si hay un error, mostrar mensaje
  if (error || !video) {
    return (
      <div className="w-full aspect-video rounded-lg bg-slate-100 dark:bg-slate-800 flex flex-col items-center justify-center p-6 text-center">
        <AlertTriangle className="h-10 w-10 text-amber-500 mb-4" />
        <h3 className="text-lg font-medium mb-2">
          {error || "Video no disponible"}
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          No se pudo cargar el video para este idioma. Por favor intenta con otro idioma o contacta al soporte.
        </p>
      </div>
    );
  }
  
  // Función para extraer ID de YouTube
  const getYoutubeVideoId = (url: string): string | null => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  // Verifica si es una URL de YouTube
  const isYoutubeUrl = (url: string): boolean => {
    return url.includes('youtube.com') || url.includes('youtu.be');
  };

  // Si todo va bien, mostrar el video
  return (
    <div className={`w-full space-y-4 ${className}`}>
      <div className="aspect-video rounded-lg overflow-hidden bg-black">
        {isYoutubeUrl(video.mainVideoUrl) ? (
          // Mostrar iframe de YouTube si es URL de YouTube
          <iframe
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${getYoutubeVideoId(video.mainVideoUrl)}`}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          ></iframe>
        ) : (
          // Mostrar reproductor de video nativo si es otro tipo de URL
          <video 
            src={video.mainVideoUrl}
            className="w-full h-full object-contain"
            controls
            autoPlay
            muted
            playsInline
            loop
            poster="/video-poster.jpg"
          >
            Tu navegador no soporta la reproducción de videos.
          </video>
        )}
      </div>
      
      {video.fullVideoUrl && (
        <div className="flex justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(video.fullVideoUrl, "_blank")}
            className="text-xs"
          >
            <ExternalLink className="h-3 w-3 mr-1" />
            Ver video completo
          </Button>
        </div>
      )}
    </div>
  );
}