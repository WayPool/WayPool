import express, { Request, Response, NextFunction } from "express";
import { db } from "./db";
import { landingVideos, insertLandingVideoSchema } from "@shared/schema";
import { eq, and } from "drizzle-orm";
import { sql } from "drizzle-orm/sql";

// Router para las rutas de videos
const videosRouter = express.Router();

// Middleware para verificar si el usuario es admin
const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.session?.user?.isAdmin) {
    return res.status(403).json({ error: "No tienes permisos de administrador" });
  }
  next();
};

// Obtener todos los videos
videosRouter.get("/", async (req: Request, res: Response) => {
  try {
    // Primero verificamos si la tabla existe
    const result = await db.execute(sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public'
        AND table_name = 'landing_videos'
      );
    `);
    
    const existsValue = result.rows[0]?.exists;
    const tableExists = existsValue === 't' || existsValue === true;
    
    if (!tableExists) {
      console.log("Tabla landing_videos no existe, creándola...");
      
      // Crear la tabla
      await db.execute(sql`
        CREATE TABLE IF NOT EXISTS "landing_videos" (
          "id" SERIAL PRIMARY KEY,
          "language" TEXT NOT NULL,
          "main_video_url" TEXT NOT NULL,
          "full_video_url" TEXT,
          "video_type" TEXT DEFAULT 'video/mp4',
          "active" BOOLEAN DEFAULT true,
          "created_at" TIMESTAMP DEFAULT NOW(),
          "updated_at" TIMESTAMP DEFAULT NOW(),
          "created_by" TEXT
        );
      `);
      
      // Insertar videos por defecto
      await db.execute(sql`
        INSERT INTO "landing_videos" 
          ("language", "main_video_url", "full_video_url", "active", "created_by") 
        VALUES 
          ('es', 'https://waybank.info/videos/welcome-es.mp4', null, true, 'system_migration');
      `);
      
      await db.execute(sql`
        INSERT INTO "landing_videos" 
          ("language", "main_video_url", "full_video_url", "active", "created_by") 
        VALUES 
          ('en', 'https://waybank.info/videos/welcome-en.mp4', null, true, 'system_migration');
      `);
      
      // Retornar los videos recién creados
      const videos = await db.select().from(landingVideos).orderBy(landingVideos.language);
      return res.json(videos);
    }
    
    // Si la tabla existe, continuar con la consulta normal
    const videos = await db.select().from(landingVideos).orderBy(landingVideos.language);
    return res.json(videos);
  } catch (error) {
    console.error("Error fetching landing videos:", error);
    return res.status(500).json({ error: "Error al obtener los videos" });
  }
});

// Obtener video por idioma (para uso público)
videosRouter.get("/language/:language", async (req: Request, res: Response) => {
  const { language } = req.params;
  
  try {
    // Primero verificamos si la tabla existe
    const result = await db.execute(sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public'
        AND table_name = 'landing_videos'
      );
    `);
    
    const existsValue = result.rows[0]?.exists;
    const tableExists = existsValue === 't' || existsValue === true;
    
    if (!tableExists) {
      console.log("Tabla landing_videos no existe, creándola...");
      
      // Crear la tabla
      await db.execute(sql`
        CREATE TABLE IF NOT EXISTS "landing_videos" (
          "id" SERIAL PRIMARY KEY,
          "language" TEXT NOT NULL,
          "main_video_url" TEXT NOT NULL,
          "full_video_url" TEXT,
          "video_type" TEXT DEFAULT 'video/mp4',
          "active" BOOLEAN DEFAULT true,
          "created_at" TIMESTAMP DEFAULT NOW(),
          "updated_at" TIMESTAMP DEFAULT NOW(),
          "created_by" TEXT
        );
      `);
      
      // Insertar videos por defecto para español e inglés
      await db.execute(sql`
        INSERT INTO "landing_videos" 
          ("language", "main_video_url", "full_video_url", "active", "created_by") 
        VALUES 
          ('es', 'https://waybank.info/videos/welcome-es.mp4', null, true, 'system_migration');
      `);
      
      await db.execute(sql`
        INSERT INTO "landing_videos" 
          ("language", "main_video_url", "full_video_url", "active", "created_by") 
        VALUES 
          ('en', 'https://waybank.info/videos/welcome-en.mp4', null, true, 'system_migration');
      `);
      
      // Ahora buscamos el video solicitado
      if (language === 'es' || language === 'en') {
        const [newVideo] = await db
          .select()
          .from(landingVideos)
          .where(eq(landingVideos.language, language));
        
        return res.json(newVideo);
      } else {
        // Si el idioma solicitado no es uno de los disponibles por defecto, devolver inglés
        const [fallbackVideo] = await db
          .select()
          .from(landingVideos)
          .where(eq(landingVideos.language, 'en'));
        
        return res.json(fallbackVideo);
      }
    }
    
    // Buscar el video para el idioma solicitado
    const videos = await db
      .select()
      .from(landingVideos)
      .where(and(
        eq(landingVideos.language, language),
        eq(landingVideos.active, true)
      ));
    
    const [video] = videos;
    
    if (!video) {
      // Si no existe video para ese idioma, intentar devolver el de inglés como fallback
      if (language !== "en") {
        const fallbackVideos = await db
          .select()
          .from(landingVideos)
          .where(and(
            eq(landingVideos.language, "en"),
            eq(landingVideos.active, true)
          ));
        
        const [fallbackVideo] = fallbackVideos;
        
        if (fallbackVideo) {
          return res.json(fallbackVideo);
        }
      }
      
      return res.status(404).json({ error: `No se encontró video para el idioma: ${language}` });
    }
    
    return res.json(video);
  } catch (error) {
    console.error(`Error fetching landing video for language ${language}:`, error);
    return res.status(500).json({ error: "Error al obtener el video" });
  }
});

// Crear nuevo video (admin only)
videosRouter.post("/", isAdmin, async (req: Request, res: Response) => {
  try {
    const validatedData = insertLandingVideoSchema.parse(req.body);
    
    // Añadir address del creador
    validatedData.createdBy = req.session?.user?.walletAddress || "unknown";
    
    // Verificar si ya existe un video para ese idioma
    const [existingVideo] = await db
      .select()
      .from(landingVideos)
      .where(eq(landingVideos.language, validatedData.language));
    
    if (existingVideo) {
      return res.status(409).json({ 
        error: `Ya existe un video para el idioma ${validatedData.language}. Usa actualizar en su lugar.` 
      });
    }
    
    const [newVideo] = await db.insert(landingVideos).values(validatedData).returning();
    
    return res.status(201).json(newVideo);
  } catch (error) {
    console.error("Error creating landing video:", error);
    return res.status(500).json({ error: "Error al crear el video" });
  }
});

// Actualizar video existente (admin only)
videosRouter.put("/:id", isAdmin, async (req: Request, res: Response) => {
  const { id } = req.params;
  const videoId = parseInt(id, 10);
  
  if (isNaN(videoId)) {
    return res.status(400).json({ error: "ID de video inválido" });
  }
  
  try {
    const validatedData = insertLandingVideoSchema.parse(req.body);
    
    // Validamos los datos y los preparamos para la actualización
    
    const [updatedVideo] = await db
      .update(landingVideos)
      .set({
        language: validatedData.language,
        mainVideoUrl: validatedData.mainVideoUrl,
        fullVideoUrl: validatedData.fullVideoUrl,
        videoType: validatedData.videoType,
        active: validatedData.active
      })
      .where(eq(landingVideos.id, videoId))
      .returning();
    
    if (!updatedVideo) {
      return res.status(404).json({ error: "Video no encontrado" });
    }
    
    return res.json(updatedVideo);
  } catch (error) {
    console.error(`Error updating landing video ${id}:`, error);
    return res.status(500).json({ error: "Error al actualizar el video" });
  }
});

// Eliminar video (admin only)
videosRouter.delete("/:id", isAdmin, async (req: Request, res: Response) => {
  const { id } = req.params;
  const videoId = parseInt(id, 10);
  
  if (isNaN(videoId)) {
    return res.status(400).json({ error: "ID de video inválido" });
  }
  
  try {
    const [deletedVideo] = await db
      .delete(landingVideos)
      .where(eq(landingVideos.id, videoId))
      .returning();
    
    if (!deletedVideo) {
      return res.status(404).json({ error: "Video no encontrado" });
    }
    
    return res.json({ success: true, message: "Video eliminado correctamente" });
  } catch (error) {
    console.error(`Error deleting landing video ${id}:`, error);
    return res.status(500).json({ error: "Error al eliminar el video" });
  }
});

// Función para registrar las rutas de videos en la app
export function registerLandingVideosRoutes(app: express.Express) {
  app.use("/api/admin/landing-videos", videosRouter);
}