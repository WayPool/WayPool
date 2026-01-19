import express from 'express';
import { pool } from './db';

const app = express();
app.use(express.json());

// Headers CORS para permitir conexiones desde el frontend
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, x-wallet-address');
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Middleware de autenticación admin
const requireAdmin = (req: any, res: any, next: any) => {
  const walletAddress = req.headers['x-wallet-address'];
  const adminWallets = ['0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f'];
  
  if (!walletAddress || !adminWallets.includes(walletAddress.toLowerCase())) {
    return res.status(403).json({ error: "Acceso de administrador requerido" });
  }
  next();
};

// GET - Obtener todos los podcasts
app.get('/podcasts', requireAdmin, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, title, description, audio_url, language, duration, 
             file_size, audio_type, category, tags, transcript, 
             thumbnail_url, published_date, active, featured, 
             download_count, play_count, created_at, updated_at, created_by
      FROM podcasts 
      ORDER BY created_at ASC
    `);
    
    console.log(`✅ [PODCAST-SERVER] Devolviendo ${result.rows.length} podcasts`);
    res.json(result.rows);
  } catch (error) {
    console.error('❌ [PODCAST-SERVER] Error:', error);
    res.status(500).json({ error: "Error al obtener los podcasts" });
  }
});

// POST - Crear nuevo podcast
app.post('/podcasts', requireAdmin, async (req, res) => {
  try {
    const {
      title, description, audio_url, language, duration, file_size,
      audio_type, category, tags, transcript, thumbnail_url,
      published_date, active, featured, created_by
    } = req.body;
    
    console.log('✅ [PODCAST-SERVER] Creando podcast:', { title, category, language });
    
    const result = await pool.query(`
      INSERT INTO podcasts (
        title, description, audio_url, language, duration, file_size,
        audio_type, category, tags, transcript, thumbnail_url,
        published_date, active, featured, created_by, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, NOW(), NOW())
      RETURNING *
    `, [
      title, description, audio_url, language, duration, file_size,
      audio_type, category, tags, transcript, thumbnail_url,
      published_date, active, featured, created_by
    ]);
    
    console.log('✅ [PODCAST-SERVER] Podcast creado exitosamente');
    res.json(result.rows[0]);
  } catch (error) {
    console.error('❌ [PODCAST-SERVER] Error:', error);
    res.status(500).json({ error: "Error al crear el podcast" });
  }
});

// PUT - Actualizar podcast
app.put('/podcasts/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title, description, audio_url, language, duration, file_size,
      audio_type, category, tags, transcript, thumbnail_url,
      published_date, active, featured
    } = req.body;
    
    const result = await pool.query(`
      UPDATE podcasts SET
        title = $1, description = $2, audio_url = $3, language = $4,
        duration = $5, file_size = $6, audio_type = $7, category = $8,
        tags = $9, transcript = $10, thumbnail_url = $11,
        published_date = $12, active = $13, featured = $14, updated_at = NOW()
      WHERE id = $15
      RETURNING *
    `, [
      title, description, audio_url, language, duration, file_size,
      audio_type, category, tags, transcript, thumbnail_url,
      published_date, active, featured, id
    ]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Podcast no encontrado" });
    }
    
    console.log('✅ [PODCAST-SERVER] Podcast actualizado exitosamente');
    res.json(result.rows[0]);
  } catch (error) {
    console.error('❌ [PODCAST-SERVER] Error:', error);
    res.status(500).json({ error: "Error al actualizar el podcast" });
  }
});

// DELETE - Eliminar podcast
app.delete('/podcasts/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(`
      DELETE FROM podcasts WHERE id = $1 RETURNING *
    `, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Podcast no encontrado" });
    }
    
    console.log('✅ [PODCAST-SERVER] Podcast eliminado exitosamente');
    res.json({ message: "Podcast eliminado correctamente" });
  } catch (error) {
    console.error('❌ [PODCAST-SERVER] Error:', error);
    res.status(500).json({ error: "Error al eliminar el podcast" });
  }
});

const PORT = 5001;
app.listen(PORT, () => {
  console.log(`🎧 Servidor de podcasts iniciado en puerto ${PORT}`);
});