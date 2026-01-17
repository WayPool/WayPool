import express, { Request, Response } from "express";
import { db } from "./db";
import { podcasts, insertPodcastSchema } from "../shared/schema";
import { eq, sql } from "drizzle-orm";
import { z } from "zod";

// Middleware de autenticación de admin (copiado del patrón existente)
function isAdmin(req: Request, res: Response, next: Function) {
  const walletAddress = req.headers['x-wallet-address'] as string || req.session?.walletAddress;
  
  if (!walletAddress) {
    return res.status(401).json({ error: "Wallet address requerida" });
  }
  
  // Lista de administradores (misma lógica que en otros archivos)
  const adminWallets = [
    '0x6b22cEB508db3C81d69ED6451d63B56a1fb7271F',
    '0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f'
  ];
  
  const isAdminWallet = adminWallets.includes(walletAddress.toLowerCase());
  
  if (!isAdminWallet) {
    return res.status(403).json({ error: "Acceso de administrador requerido" });
  }
  
  next();
}

const podcastsRouter = express.Router();

// Obtener todos los podcasts
podcastsRouter.get("/", async (req: Request, res: Response) => {
  try {
    const allPodcasts = await db.select().from(podcasts).orderBy(podcasts.createdAt);
    return res.json(allPodcasts);
  } catch (error) {
    console.error("Error fetching podcasts:", error);
    return res.status(500).json({ error: "Error al obtener los podcasts" });
  }
});

// Obtener podcast por ID
podcastsRouter.get("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const podcastId = parseInt(id, 10);
  
  if (isNaN(podcastId)) {
    return res.status(400).json({ error: "ID de podcast inválido" });
  }
  
  try {
    const podcast = await db.select().from(podcasts).where(eq(podcasts.id, podcastId)).limit(1);
    
    if (podcast.length === 0) {
      return res.status(404).json({ error: "Podcast no encontrado" });
    }
    
    return res.json(podcast[0]);
  } catch (error) {
    console.error(`Error fetching podcast ${id}:`, error);
    return res.status(500).json({ error: "Error al obtener el podcast" });
  }
});

// Obtener podcasts por idioma (para uso público)
podcastsRouter.get("/language/:language", async (req: Request, res: Response) => {
  const { language } = req.params;
  
  try {
    const languagePodcasts = await db
      .select()
      .from(podcasts)
      .where(eq(podcasts.language, language))
      .orderBy(podcasts.createdAt);
    
    return res.json(languagePodcasts);
  } catch (error) {
    console.error(`Error fetching podcasts for language ${language}:`, error);
    return res.status(500).json({ error: "Error al obtener los podcasts del idioma" });
  }
});

// Incrementar contador de reproducciones
podcastsRouter.post("/:id/play", async (req: Request, res: Response) => {
  const { id } = req.params;
  const podcastId = parseInt(id, 10);
  
  if (isNaN(podcastId)) {
    return res.status(400).json({ error: "ID de podcast inválido" });
  }
  
  try {
    await db.execute(sql`
      UPDATE podcasts 
      SET play_count = play_count + 1 
      WHERE id = ${podcastId}
    `);
    
    return res.json({ success: true });
  } catch (error) {
    console.error(`Error incrementing play count for podcast ${id}:`, error);
    return res.status(500).json({ error: "Error al actualizar contador de reproducciones" });
  }
});

// Incrementar contador de descargas
podcastsRouter.post("/:id/download", async (req: Request, res: Response) => {
  const { id } = req.params;
  const podcastId = parseInt(id, 10);
  
  if (isNaN(podcastId)) {
    return res.status(400).json({ error: "ID de podcast inválido" });
  }
  
  try {
    await db.execute(sql`
      UPDATE podcasts 
      SET download_count = download_count + 1 
      WHERE id = ${podcastId}
    `);
    
    return res.json({ success: true });
  } catch (error) {
    console.error(`Error incrementing download count for podcast ${id}:`, error);
    return res.status(500).json({ error: "Error al actualizar contador de descargas" });
  }
});

// Crear podcast (admin only)
podcastsRouter.post("/", isAdmin, async (req: Request, res: Response) => {
  const parseResult = insertPodcastSchema.safeParse(req.body);
  
  if (!parseResult.success) {
    console.error("Error validating podcast data:", parseResult.error);
    return res.status(400).json({ 
      error: "Datos del podcast inválidos", 
      details: parseResult.error.errors 
    });
  }
  
  try {
    const [newPodcast] = await db
      .insert(podcasts)
      .values({
        ...parseResult.data,
        createdBy: req.session.walletAddress || 'unknown'
      })
      .returning();
    
    return res.status(201).json(newPodcast);
  } catch (error) {
    console.error("Error creating podcast:", error);
    return res.status(500).json({ error: "Error al crear el podcast" });
  }
});

// Actualizar podcast (admin only)
podcastsRouter.put("/:id", isAdmin, async (req: Request, res: Response) => {
  const { id } = req.params;
  const podcastId = parseInt(id, 10);
  
  if (isNaN(podcastId)) {
    return res.status(400).json({ error: "ID de podcast inválido" });
  }
  
  const parseResult = insertPodcastSchema.partial().safeParse(req.body);
  
  if (!parseResult.success) {
    console.error("Error validating podcast update data:", parseResult.error);
    return res.status(400).json({ 
      error: "Datos de actualización inválidos", 
      details: parseResult.error.errors 
    });
  }
  
  try {
    const [updatedPodcast] = await db
      .update(podcasts)
      .set({
        ...parseResult.data,
        updatedAt: new Date()
      })
      .where(eq(podcasts.id, podcastId))
      .returning();
    
    if (!updatedPodcast) {
      return res.status(404).json({ error: "Podcast no encontrado" });
    }
    
    return res.json(updatedPodcast);
  } catch (error) {
    console.error(`Error updating podcast ${id}:`, error);
    return res.status(500).json({ error: "Error al actualizar el podcast" });
  }
});

// Eliminar podcast (admin only)
podcastsRouter.delete("/:id", isAdmin, async (req: Request, res: Response) => {
  const { id } = req.params;
  const podcastId = parseInt(id, 10);
  
  if (isNaN(podcastId)) {
    return res.status(400).json({ error: "ID de podcast inválido" });
  }
  
  try {
    const [deletedPodcast] = await db
      .delete(podcasts)
      .where(eq(podcasts.id, podcastId))
      .returning();
    
    if (!deletedPodcast) {
      return res.status(404).json({ error: "Podcast no encontrado" });
    }
    
    return res.json({ success: true, message: "Podcast eliminado correctamente" });
  } catch (error) {
    console.error(`Error deleting podcast ${id}:`, error);
    return res.status(500).json({ error: "Error al eliminar el podcast" });
  }
});

// Función para registrar las rutas de podcasts en la app
export function registerPodcastRoutes(app: express.Express) {
  app.use("/api/admin/podcasts", podcastsRouter);
  console.log("Podcast management routes registered successfully");
}