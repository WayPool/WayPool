import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";
import { Headphones, Play, Pause, Clock, Calendar, ArrowLeft, ExternalLink, Download, Grid3X3, List, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import { useMediaQuery } from "@/hooks/use-media-query";
import SEOManager from "@/components/seo/seo-manager";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useLanguage } from "@/context/language-context";
import { getPodcastTranslations } from "@/translations/podcast";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

// Types for our podcast episodes from database
interface PodcastEpisode {
  id: number;
  title: string;
  description: string;
  audio_url: string;
  language: string;
  duration: number;
  file_size?: string;
  audio_type: string;
  category: string;
  tags?: string[];
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

// Interface for legacy compatibility in the audio player
interface LegacyPodcastEpisode {
  id: string;
  title: string;
  description: string;
  audioUrl: string;
  externalAudioUrl?: string;
  duration: string;
  date: string;
  image: string;
  tags: string[];
  featured?: boolean;
  waveform?: number[];
}

// Function to convert database podcast to legacy format for compatibility
function convertToLegacyFormat(dbEpisode: PodcastEpisode): LegacyPodcastEpisode {
  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return {
    id: `ep${dbEpisode.id.toString().padStart(3, '0')}`,
    title: dbEpisode.title,
    description: dbEpisode.description,
    audioUrl: dbEpisode.audio_url,
    externalAudioUrl: dbEpisode.audio_url,
    duration: formatDuration(dbEpisode.duration),
    date: dbEpisode.published_date ? new Date(dbEpisode.published_date).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }) : new Date(dbEpisode.created_at).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }),
    image: dbEpisode.thumbnail_url || `/podcast/episode${dbEpisode.id}.jpg`,
    tags: Array.isArray(dbEpisode.tags) ? dbEpisode.tags : [],
    featured: dbEpisode.featured,
    waveform: Array(50).fill(0).map(() => Math.random() * 0.8 + 0.2)
  };
}

// Audio player component
function AudioPlayer({ episode, autoPlay, onAutoPlayComplete }: { episode: LegacyPodcastEpisode | null, autoPlay?: boolean, onAutoPlayComplete?: () => void }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [audioError, setAudioError] = useState(false);
  const [audioReady, setAudioReady] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const { language } = useLanguage();
  const t = getPodcastTranslations(language);
  
  // Función para formatear el tiempo en formato MM:SS
  const formatTime = (time: number) => {
    if (isNaN(time)) return "00:00";
    
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
  
  // Extraer el tiempo como número desde un string "MM:SS"
  const parseTimeString = (timeString: string): number => {
    const parts = timeString.split(':');
    if (parts.length !== 2) return 0;
    
    const minutes = parseInt(parts[0], 10);
    const seconds = parseInt(parts[1], 10);
    if (isNaN(minutes) || isNaN(seconds)) return 0;
    
    return minutes * 60 + seconds;
  };
  
  // Normalizar URL del audio para asegurar compatibilidad en diferentes entornos
  const getAudioUrl = (url: string) => {
    // Convertir enlaces de Google Drive al formato directo reproducible
    if (url.includes('drive.google.com/file/d/')) {
      // Extraer el ID del archivo de Google Drive
      const fileId = url.match(/\/d\/([^\/]+)/)?.[1];
      if (fileId) {
        return `https://drive.google.com/uc?export=download&id=${fileId}`;
      }
    }
    
    // Asegurarse de que la URL comience con "/" si es una ruta relativa
    if (!url.startsWith('http') && !url.startsWith('/')) {
      return '/' + url;
    }
    return url;
  };
  
  // Precarga y verifica si el audio está disponible
  const preloadAudio = async (url: string) => {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      if (response.ok && response.headers.get('content-length') !== '0') {
        console.log('Audio disponible:', url, 'tamaño:', response.headers.get('content-length'));
        setAudioError(false);
        setAudioReady(true);
        return true;
      } else {
        console.warn('Audio no disponible o vacío:', url);
        setAudioError(true);
        setAudioReady(false);
        return false;
      }
    } catch (error) {
      console.error('Error verificando audio:', error);
      setAudioError(true);
      setAudioReady(false);
      return false;
    }
  };
  
  // Manejar la reproducción/pausa
  const togglePlayPause = (autoPlay = false) => {
    if (audioError || !audioReady) {
      // Mostrar el diálogo para elegir opciones alternativas
      if (episode?.externalAudioUrl) {
        setShowDialog(true);
      } else {
        // Si no hay alternativas, mostrar un mensaje
        alert('Este episodio del podcast WayBank estará disponible próximamente. Actualmente estamos finalizando la producción de los episodios. ¡Gracias por tu interés!');
      }
      
      // Opcional: podríamos registrar el interés del usuario para analíticas
      console.log('Intento de reproducción de episodio no disponible:', episode?.id);
      return;
    }
    
    if (!audioRef.current) return;
    
    if (isPlaying && !autoPlay) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      // Intentamos reproducir y manejamos posibles errores
      const playPromise = audioRef.current.play();
      
      if (playPromise !== undefined) {
        playPromise.then(() => {
          setIsPlaying(true);
          console.log('Reproducción iniciada con éxito:', episode?.id);
        }).catch(error => {
          console.error('Error reproduciendo audio:', error);
          setAudioError(true);
          setIsPlaying(false);
          
          // En caso de error, mostrar el diálogo en lugar de una alerta
          if (episode?.externalAudioUrl) {
            setShowDialog(true);
          } else {
            alert('Este episodio del podcast WayBank estará disponible próximamente. Actualmente estamos finalizando la producción de los episodios. ¡Gracias por tu interés!');
          }
        });
      } else {
        setIsPlaying(true);
      }
    }
  };
  
  // Manejar cambios en el progreso del audio
  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    
    setCurrentTime(audioRef.current.currentTime);
  };
  
  // Manejar cuando el audio está listo
  const handleLoadedMetadata = () => {
    if (!audioRef.current) return;
    
    setDuration(audioRef.current.duration);
    setAudioError(false);
    setAudioReady(true);
    console.log('Audio metadata cargada:', episode?.audioUrl);
  };
  
  // Manejar cuando el audio está listo para reproducirse
  const handleCanPlay = () => {
    setAudioReady(true);
    setAudioError(false);
    console.log('Audio listo para reproducirse:', episode?.audioUrl);
  };
  
  // Manejar errores en la carga del audio
  const handleError = () => {
    console.error('Error cargando audio:', episode?.audioUrl);
    
    // Mostrar el diálogo para elegir entre reproducir o descargar
    if (episode?.externalAudioUrl) {
      setShowDialog(true);
      setAudioError(true);
      setIsPlaying(false);
      return;
    }
    
    // Intentar cargar la URL alternativa si existe (esto ahora lo decidirá el usuario)
    // if (episode?.externalAudioUrl && audioRef.current) {
    //   console.log('Intentando reproducir URL alternativa:', episode.externalAudioUrl);
    //   audioRef.current.src = getAudioUrl(episode.externalAudioUrl);
    //   audioRef.current.load();
    //   return; // No marcamos como error todavía, esperamos a ver si carga la URL alternativa
    // }
    
    setAudioError(true);
    setIsPlaying(false);
    setAudioReady(false);
    
    // Si el archivo no está disponible, usamos la duración del episodio como fallback
    if (episode) {
      setDuration(parseTimeString(episode.duration));
    }
  };
  
  // Manejar el arrastre del control de progreso
  const handleProgressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!audioRef.current || audioError || !audioReady) return;
    
    const newTime = parseFloat(event.target.value);
    setCurrentTime(newTime);
    audioRef.current.currentTime = newTime;
  };
  
  // Efecto para manejar autoPlay
  useEffect(() => {
    if (autoPlay && audioReady && episode && audioRef.current && !audioError) {
      const playPromise = audioRef.current.play();
      
      if (playPromise !== undefined) {
        playPromise.then(() => {
          setIsPlaying(true);
          console.log('Auto-reproducción iniciada:', episode.id);
          onAutoPlayComplete?.();
        }).catch(error => {
          console.error('Error en auto-reproducción:', error);
          onAutoPlayComplete?.();
        });
      } else {
        setIsPlaying(true);
        onAutoPlayComplete?.();
      }
    }
  }, [autoPlay, audioReady, episode, audioError, onAutoPlayComplete]);

  // Limpiar efectos al desmontar
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);
  
  // Reset al cambiar de episodio
  useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    setAudioError(false);
    
    // Si el episodio cambia, intentamos precargar el audio
    if (episode) {
      setDuration(parseTimeString(episode.duration));
    }
  }, [episode?.id]);

  if (!episode) return null;

  // Generar barras de visualización (waveform) si no existen
  const waveform = episode.waveform || Array(50).fill(0).map(() => Math.random() * 0.8 + 0.2); 
  
  // Calcular duración a mostrar
  const displayDuration = isNaN(duration) ? episode.duration : formatTime(duration);

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-primary/10 p-4 z-50">
      <div className="container max-w-screen-xl mx-auto">
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-md overflow-hidden bg-primary/5 flex-shrink-0">
                <div className="w-full h-full bg-indigo-950/70 flex items-center justify-center">
                  <Headphones className="text-primary h-6 w-6" />
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium line-clamp-1">{episode.title}</h4>
                <p className="text-xs text-muted-foreground">Episode {episode.id.replace("ep", "")}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="icon" 
                className={`rounded-full bg-primary/10 hover:bg-primary/20 text-primary ${audioError ? 'opacity-50' : ''}`}
                onClick={() => togglePlayPause()}
              >
                {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
              </Button>
              <div className="text-xs text-muted-foreground hidden md:flex gap-2 items-center">
                <span>{formatTime(currentTime)}</span>
                <span>/</span>
                <span>{displayDuration}</span>
              </div>
            </div>
          </div>
          
          {/* Barra de progreso y visualización */}
          <div className="w-full flex-1 hidden md:block">
            <div className="h-8 flex items-center gap-2">
              <div className="flex-1 relative">
                {/* Visualización (simulada) */}
                <div className="absolute inset-0 flex items-center justify-between pointer-events-none">
                  {waveform.map((height, i) => (
                    <div 
                      key={i}
                      style={{ 
                        height: `${Math.round(height * 100)}%`,
                        backgroundColor: i / waveform.length < currentTime / (duration || parseTimeString(episode.duration)) 
                          ? 'var(--primary)' 
                          : 'var(--primary-foreground)', 
                        opacity: i / waveform.length < currentTime / (duration || parseTimeString(episode.duration)) 
                          ? 0.8 
                          : 0.2,
                      }}
                      className="w-1 rounded-full mx-px transition-all duration-150"
                    />
                  ))}
                </div>
                
                {/* Control deslizante */}
                <input
                  type="range"
                  min="0"
                  max={duration || parseTimeString(episode.duration)}
                  value={currentTime}
                  onChange={handleProgressChange}
                  className={`w-full h-2 absolute ${audioError ? 'opacity-0 cursor-not-allowed' : 'opacity-0 cursor-pointer'}`}
                />
              </div>
            </div>
          </div>
          
          <audio 
            ref={audioRef}
            src={getAudioUrl(episode.audioUrl)}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onCanPlay={handleCanPlay}
            onError={handleError}
            onEnded={() => setIsPlaying(false)}
            className="hidden"
            crossOrigin="anonymous"
            preload="auto"
          />
          {/* Diálogo para elegir entre reproducir o descargar */}
          <Dialog open={showDialog} onOpenChange={setShowDialog}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>{t.audioErrorTitle}</DialogTitle>
                <DialogDescription>
                  {t.audioErrorDescription}
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <p className="text-sm text-muted-foreground mb-4">
                  {t.audioErrorContent}
                </p>
              </div>
              <DialogFooter className="flex flex-col sm:flex-row sm:justify-center gap-2">
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button
                    variant="outline"
                    className="gap-2"
                    asChild
                  >
                    <a 
                      href={episode.audioUrl} 
                      download={`episode${episode.id.replace("ep", "")}.wav`}
                      onClick={() => {
                        setShowDialog(false);
                        console.log('Descargando episodio local:', episode.id);
                      }}
                    >
                      <Download className="h-4 w-4" /> {t.downloadButton}
                    </a>
                  </Button>
                  
                  <Button
                    className="gap-2"
                    asChild
                  >
                    <a 
                      href={episode.externalAudioUrl} 
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => {
                        setShowDialog(false);
                        console.log('Accediendo a URL externa:', episode.id);
                      }}
                    >
                      <ExternalLink className="h-4 w-4" /> {t.openExternalUrlButton}
                    </a>
                  </Button>
                </div>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          {/* Enlace alternativo para escuchar - mostrado si hay un error pero el diálogo está cerrado */}
          {audioError && !showDialog && episode.externalAudioUrl && (
            <div className="mt-2 text-center flex items-center justify-center gap-2">
              <Button 
                size="sm" 
                variant="outline"
                className="text-xs gap-1 text-primary"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDialog(true);
                }}
              >
                <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polygon points="10 8 16 12 10 16 10 8"></polygon></svg>
                {t.playbackOptions}
              </Button>
              <span className="text-xs text-muted-foreground">
                {t.audioErrorLabel}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Episode card component
function EpisodeCard({ episode, onClick, viewMode = 'grid' }: { episode: LegacyPodcastEpisode, onClick: () => void, viewMode?: 'grid' | 'list' }) {
  const isEpisodeOne = episode.id === "ep001";
  const { language } = useLanguage();
  const t = getPodcastTranslations(language);
  
  // Los archivos están disponibles, pero pueden haber problemas de CORS
  const isComingSoon = false;
  
  if (viewMode === 'list') {
    return (
      <div 
        className={`
          border rounded-xl overflow-hidden transition-all duration-300 hover:shadow-md hover:border-primary/30
          ${episode.featured ? 'bg-gradient-to-br from-primary/5 to-background' : 'bg-background'}
          ${isEpisodeOne ? 'ring-2 ring-primary/30' : ''}
          ${isComingSoon ? 'relative' : ''}
          flex flex-row gap-4 p-4
        `}
      >
        {/* Thumbnail más pequeño para vista lista */}
        <div className="w-24 h-24 bg-muted/30 rounded-lg flex-shrink-0 relative">
          <div className="w-full h-full bg-indigo-950/70 flex items-center justify-center rounded-lg">
            {isEpisodeOne ? (
              <div className="flex flex-col items-center">
                <Headphones className="text-primary h-6 w-6 opacity-80 mb-1" />
                <p className="text-xs text-primary/90 font-medium text-center">WayBank's Algorithm</p>
              </div>
            ) : (
              <Headphones className="text-primary h-6 w-6 opacity-60" />
            )}
          </div>
          {episode.featured && (
            <div className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs px-1 py-0.5 rounded-full">
              {t.featuredLabel}
            </div>
          )}
        </div>

        {/* Contenido en vista lista */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-sm line-clamp-2 text-foreground">
              {episode.title}
            </h3>
            <div className="flex items-center gap-2 ml-2 flex-shrink-0">
              {/* Language indicator */}
              <span className="bg-muted text-muted-foreground text-xs px-2 py-1 rounded-full">
                EN
              </span>
              <Button
                size="sm"
                onClick={onClick}
                className="gap-1"
                disabled={isComingSoon}
              >
                <Play className="h-3 w-3" />
                {t.playButton}
              </Button>
            </div>
          </div>
          
          <p className="text-muted-foreground text-xs line-clamp-2 mb-2">
            {episode.description}
          </p>
          
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {episode.date}
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {episode.duration}
            </div>
            {episode.tags && (
              <div className="flex gap-1">
                {episode.tags.slice(0, 2).map(tag => (
                  <span key={tag} className="bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div 
      className={`
        border rounded-xl overflow-hidden transition-all duration-300 hover:shadow-md hover:border-primary/30
        ${episode.featured ? 'bg-gradient-to-br from-primary/5 to-background' : 'bg-background'}
        ${isEpisodeOne ? 'ring-2 ring-primary/30' : ''}
        ${isComingSoon ? 'relative' : ''}
      `}
    >
      <div className="aspect-[16/9] bg-muted/30 relative">
        <div className="w-full h-full bg-indigo-950/70 flex items-center justify-center">
          {isEpisodeOne ? (
            <div className="flex flex-col items-center">
              <Headphones className="text-primary h-10 w-10 opacity-80 mb-1" />
              <p className="text-xs text-primary/90 font-medium">WayBank's Algorithm</p>
            </div>
          ) : (
            <Headphones className="text-primary h-10 w-10 opacity-60" />
          )}
        </div>
        {episode.featured && (
          <div className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
            {t.featuredLabel}
          </div>
        )}
        {isEpisodeOne && (
          <div className="absolute top-2 left-2 bg-primary/90 text-primary-foreground text-xs px-2 py-1 rounded-full flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-primary-foreground rounded-full animate-pulse"></span> {t.newLabel}
          </div>
        )}
      </div>
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold">{episode.title}</h3>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full flex-shrink-0 bg-primary/10 hover:bg-primary/20 text-primary"
            onClick={onClick}
          >
            <Play className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
          {episode.description}
        </p>
        <div className="flex flex-wrap gap-2 mb-4">
          {episode.tags.map(tag => (
            <span 
              key={tag} 
              className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>{episode.date}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{episode.duration}</span>
            </div>
          </div>
          <div className="flex items-center gap-1 bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">
            <span className="text-xs uppercase">EN</span>
          </div>
        </div>

      </div>
    </div>
  );
}

export default function Podcast() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [currentEpisode, setCurrentEpisode] = useState<LegacyPodcastEpisode | null>(null);
  const [autoPlay, setAutoPlay] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const episodesPerPage = 6;
  const [showSubscribeDialog, setShowSubscribeDialog] = useState(false);
  const [subscribeEmail, setSubscribeEmail] = useState("");
  const [subscribeName, setSubscribeName] = useState("");
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const { language } = useLanguage();
  const t = getPodcastTranslations(language);
  const { toast } = useToast();

  // Mutation for newsletter subscription
  const subscriptionMutation = useMutation({
    mutationFn: async (data: { email: string; name?: string; language: string }) => {
      const response = await fetch('/api/referral/subscribe', {
        method: 'POST',
        body: JSON.stringify({
          email: data.email,
          name: data.name,
          language: data.language,
          referralCode: 'PODCAST_NEWSLETTER' // Special code to identify podcast subscriptions
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error en la suscripción');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "¡Suscripción exitosa!",
        description: "Te has suscrito correctamente a nuestro newsletter de podcast.",
      });
      setShowSubscribeDialog(false);
      setSubscribeEmail("");
      setSubscribeName("");
    },
    onError: (error: any) => {
      toast({
        title: "Error en la suscripción",
        description: error.message || "Hubo un problema al procesar tu suscripción. Inténtalo de nuevo.",
        variant: "destructive",
      });
    }
  });

  const handleSubscribe = () => {
    if (!subscribeEmail.trim()) {
      toast({
        title: "Email requerido",
        description: "Por favor ingresa tu email para suscribirte.",
        variant: "destructive",
      });
      return;
    }

    subscriptionMutation.mutate({
      email: subscribeEmail.trim(),
      name: subscribeName.trim() || undefined,
      language: language
    });
  };

  // Fetch podcasts from database (always load English podcasts for now)
  const { data: podcastsFromDB = [], isLoading } = useQuery({
    queryKey: ['/api/podcasts', 'en'],
    queryFn: async () => {
      const response = await fetch('/api/podcasts?language=en&active=true');
      if (!response.ok) {
        throw new Error('Error al cargar podcasts');
      }
      return response.json() as Promise<PodcastEpisode[]>;
    }
  });

  // SEO metadata for the podcast page
  const seoTitle = "WayBank DeFi Podcast | Blockchain & Liquidity Management Insights";
  const seoDescription = "Tune into the WayBank podcast for expert insights on DeFi, liquidity management, and blockchain technology. New episodes released weekly.";
  
  // For avoiding hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  // Convert database podcasts to legacy format
  const legacyPodcasts = podcastsFromDB.map(convertToLegacyFormat);
  
  // Obtener categorías únicas de los podcasts
  const categories = ['all', ...Array.from(new Set(legacyPodcasts.map(ep => ep.tags).flat()))];
  
  // Filtrar podcasts según la categoría seleccionada
  const filteredPodcasts = selectedCategory === 'all' 
    ? legacyPodcasts 
    : legacyPodcasts.filter(ep => ep.tags.includes(selectedCategory));
  
  // Calcular paginación
  const totalPages = Math.ceil(filteredPodcasts.length / episodesPerPage);
  const startIndex = (currentPage - 1) * episodesPerPage;
  const endIndex = startIndex + episodesPerPage;
  const currentEpisodes = filteredPodcasts.slice(startIndex, endIndex);
  
  // Reset page when category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory]);
  
  if (!mounted) return null;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando podcasts...</p>
        </div>
      </div>
    );
  }
  
  const featuredEpisode = legacyPodcasts.find(ep => ep.featured) || legacyPodcasts[0];
  
  return (
    <div className="min-h-screen flex flex-col">
      <SEOManager 
        title={seoTitle}
        description={seoDescription}
        keywords="defi podcast, blockchain podcast, crypto liquidity, waybank audio"
        image="/podcast/featured-image.jpg"
        type="article"
      />
      
      <header className="border-b bg-background">
        <div className="container px-4 md:px-6 max-w-screen-xl mx-auto py-4 flex justify-between items-center">
          <Link href="/">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="rounded-full">
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="font-bold text-xl">
                <span className="text-foreground">Way</span>
                <span className="text-primary">Pool</span>
                <span className="ml-2 text-sm bg-primary/10 text-primary px-2 py-1 rounded-full">
                  Podcast
                </span>
              </div>
            </div>
          </Link>
          
          <div className="flex items-center gap-2">
            <a 
              href="https://podcasts.apple.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <Button variant="ghost" size="sm" className="gap-1 text-xs">
                <ExternalLink className="h-3 w-3" /> Apple Podcasts
              </Button>
            </a>
            <a 
              href="https://spotify.com/podcasts" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <Button variant="ghost" size="sm" className="gap-1 text-xs">
                <ExternalLink className="h-3 w-3" /> Spotify
              </Button>
            </a>
          </div>
        </div>
      </header>
      
      <main className="flex-1 py-8">
        <div className="container px-4 md:px-6 mx-auto max-w-screen-xl">
          {/* Hero section */}
          <section className="mb-16">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 to-background border border-primary/20">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary opacity-10 rounded-full filter blur-3xl translate-x-1/3 -translate-y-1/3"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500 opacity-10 rounded-full filter blur-3xl -translate-x-1/3 translate-y-1/3"></div>
              
              <div className="relative p-8 md:p-12 flex flex-col md:flex-row items-center gap-8">
                <div className="flex-1">
                  <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                    The WayBank DeFi Podcast
                  </h1>
                  <p className="text-lg md:text-xl text-muted-foreground mb-6">
                    Dive into the world of decentralized finance with expert insights on liquidity management, blockchain technology, and market trends.
                  </p>
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-wrap gap-4">
                      <Button 
                        className="gap-2" 
                        onClick={() => {
                          // Seleccionar el episodio más reciente (el primero en la lista ordenada)
                          const latestEpisode = legacyPodcasts[0];
                          setCurrentEpisode(latestEpisode);
                          setAutoPlay(true);
                        }}
                      >
                        <Headphones className="h-4 w-4" />
                        {t.listenLatest}
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => setShowSubscribeDialog(true)}
                      >
                        {t.subscribeLabel}
                      </Button>
                    </div>
                    
                    <div className="mt-2">
                      <h3 className="text-lg font-semibold mb-1">{t.highlightedEpisode}</h3>
                      <p className="text-muted-foreground text-sm">
                        "Introduction to WayBank's Algorithmic Liquidity Management" - Exploring the innovative approach that sets WayBank apart in the DeFi ecosystem.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="w-full md:w-1/3 aspect-square relative rounded-xl overflow-hidden border border-primary/20 shadow-lg bg-background">
                  <div className="absolute inset-0 flex items-center justify-center bg-indigo-950/70">
                    <div className="flex flex-col items-center">
                      <Headphones className="text-primary h-16 w-16 mb-2" />
                      <div className="text-center px-4">
                        <p className="text-sm font-medium text-primary">EP 001</p>
                        <p className="text-xs text-primary/80 mt-1">Algorithmic Liquidity Management</p>
                      </div>
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background to-transparent p-4">
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">{t.newEpisodesThursday}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          
          {/* Latest episodes */}
          <section className="mb-16">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold">{t.latestEpisodes}</h2>
              <div className="text-sm text-muted-foreground">
                {filteredPodcasts.length} {t.episodesCount}
              </div>
            </div>
            
            {/* Filtros y controles */}
            <div className="flex flex-col md:flex-row gap-4 mb-8 p-4 bg-muted/30 rounded-lg border">
              {/* Selector de vista */}
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-muted-foreground">{t.viewLabel}</span>
                <div className="flex border rounded-lg overflow-hidden bg-background">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    className="rounded-none border-0"
                    onClick={() => setViewMode('grid')}
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    className="rounded-none border-0"
                    onClick={() => setViewMode('list')}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {/* Filtro por categoría */}
              <div className="flex items-center gap-2 flex-1">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">{t.categoryLabel}</span>
                <select 
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="flex-1 md:flex-none md:min-w-[200px] px-3 py-2 text-sm border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category === 'all' ? t.allCategories : category}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            {/* Grid de episodios */}
            <div className={
              viewMode === 'grid' 
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
                : "space-y-4"
            }>
              {currentEpisodes.map(episode => (
                <EpisodeCard 
                  key={episode.id} 
                  episode={episode} 
                  onClick={() => {
                    setCurrentEpisode(episode);
                    setAutoPlay(true);
                  }}
                  viewMode={viewMode}
                />
              ))}
            </div>
            
            {/* Paginación */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-8">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  {t.previousButton}
                </Button>
                
                <div className="flex items-center gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <Button
                      key={page}
                      variant={currentPage === page ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      className="w-10 h-10"
                    >
                      {page}
                    </Button>
                  ))}
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  {t.nextButton}
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </section>
          
          {/* Subscribe section */}
          <section className="mb-16">
            <div className="bg-muted/30 rounded-xl p-8 border">
              <div className="max-w-3xl mx-auto text-center">
                <h2 className="text-2xl font-bold mb-4">{t.neverMissEpisode}</h2>
                <p className="text-muted-foreground mb-6">
                  {t.subscribeNotification}
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Button variant="outline" className="gap-2" asChild>
                    <a 
                      href="https://podcasts.apple.com" 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                        <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 2a8 8 0 1 1 0 16 8 8 0 0 1 0-16zm0 2a1 1 0 0 0-1 1v5H8a1 1 0 1 0 0 2h3v1a1 1 0 1 0 2 0v-1h3a1 1 0 1 0 0-2h-3V7a1 1 0 0 0-1-1z"/>
                      </svg>
                      Apple Podcasts
                    </a>
                  </Button>
                  <Button variant="outline" className="gap-2" asChild>
                    <a 
                      href="https://spotify.com/podcasts" 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                        <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 2a8 8 0 1 1 0 16 8 8 0 0 1 0-16zm1 4a1 1 0 0 0-2 0v4.268l-1.85 1.85a1 1 0 0 0 1.414 1.415l2.5-2.5A1 1 0 0 0 13 12V8z"/>
                      </svg>
                      Spotify
                    </a>
                  </Button>
                  <Button variant="outline" className="gap-2" asChild>
                    <a 
                      href="https://podcasts.google.com" 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                        <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zM8.5 8a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm7 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm-3.5 9a6 6 0 0 1-5.178-3h10.356A6 6 0 0 1 12 17z"/>
                      </svg>
                      Google Podcasts
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-muted/30 border-t py-8">
        <div className="container px-4 md:px-6 mx-auto max-w-screen-xl">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <div className="text-lg font-bold mb-1">
                <span className="text-foreground">Way</span>
                <span className="text-primary">Pool</span>
                <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                  Podcast
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                © {new Date().getFullYear()} WayBank. All rights reserved.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/">
                <span className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  {t.backToHome}
                </span>
              </Link>
              <Link href="/dashboard">
                <span className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Dashboard
                </span>
              </Link>
              <Link href="/algorithm-details">
                <span className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Algorithm
                </span>
              </Link>
              <Link href="/podcast">
                <span className="text-sm text-primary font-medium transition-colors">
                  {t.podcastLabel}
                </span>
              </Link>
            </div>
          </div>
        </div>
      </footer>
      
      {/* Audio player (fixed at bottom) */}
      {currentEpisode && (
        <AudioPlayer 
          episode={currentEpisode} 
          autoPlay={autoPlay}
          onAutoPlayComplete={() => setAutoPlay(false)}
        />
      )}

      {/* Newsletter Subscription Dialog */}
      <Dialog open={showSubscribeDialog} onOpenChange={setShowSubscribeDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Suscríbete a nuestro newsletter</DialogTitle>
            <DialogDescription>
              Recibe notificaciones de nuevos episodios y contenido exclusivo de nuestro podcast.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="subscribe-email">Email *</Label>
              <Input
                id="subscribe-email"
                type="email"
                placeholder="tu@email.com"
                value={subscribeEmail}
                onChange={(e) => setSubscribeEmail(e.target.value)}
                disabled={subscriptionMutation.isPending}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subscribe-name">Nombre (opcional)</Label>
              <Input
                id="subscribe-name"
                type="text"
                placeholder="Tu nombre"
                value={subscribeName}
                onChange={(e) => setSubscribeName(e.target.value)}
                disabled={subscriptionMutation.isPending}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowSubscribeDialog(false)}
              disabled={subscriptionMutation.isPending}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSubscribe}
              disabled={subscriptionMutation.isPending || !subscribeEmail.trim()}
            >
              {subscriptionMutation.isPending ? "Suscribiendo..." : "Suscribirse"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}