import express, { type Request, Response, NextFunction } from "express";
import session from "express-session";
import MemoryStore from 'memorystore';
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { runMigration } from "./db-migration";
import { seoMiddleware } from "./seo";
import { registerHealthRoutes } from "./health-routes";
import { replicationMiddleware, startSyncMonitor } from "./dual-write-middleware.js";

const MemoryStoreSession = MemoryStore(session);

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// RUTAS DE PODCASTS CON PRIORIDAD ABSOLUTA
import { pool } from "./db";

// Rutas de podcasts con máxima prioridad - ANTES de cualquier middleware
app.get('/api/admin/podcasts', async (req: any, res: any) => {
  try {
    res.setHeader('Content-Type', 'application/json');
    const walletAddress = req.headers['x-wallet-address'] || req.session?.walletAddress;
    const adminWallets = ['0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f'];

    if (!walletAddress || !adminWallets.includes(walletAddress.toLowerCase())) {
      return res.status(403).json({ error: "Acceso de administrador requerido" });
    }

    const result = await pool.query(`
      SELECT id, title, description, audio_url, language, duration, 
             file_size, audio_type, category, tags, transcript, 
             thumbnail_url, published_date, active, featured, 
             download_count, play_count, created_at, updated_at, created_by
      FROM podcasts 
      ORDER BY created_at ASC
    `);

    console.log(`✅ [PODCASTS-PRIORITY] Devolviendo ${result.rows.length} podcasts`);
    return res.json(result.rows);
  } catch (error) {
    console.error("❌ [PODCASTS-PRIORITY] Error:", error);
    return res.status(500).json({ error: "Error al obtener los podcasts" });
  }
});

app.post('/api/admin/podcasts', async (req: any, res: any) => {
  try {
    res.setHeader('Content-Type', 'application/json');
    const walletAddress = req.headers['x-wallet-address'] || req.session?.walletAddress;
    const adminWallets = ['0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f'];

    if (!walletAddress || !adminWallets.includes(walletAddress.toLowerCase())) {
      return res.status(403).json({ error: "Acceso de administrador requerido" });
    }

    const {
      title, description, audio_url, language, duration, file_size,
      audio_type, category, tags, transcript, thumbnail_url,
      published_date, active, featured, created_by
    } = req.body;

    console.log("✅ [PODCASTS-PRIORITY] Creando podcast:", { title });

    // Convertir tags a formato PostgreSQL array correcto
    let tagsArray = null;
    if (tags) {
      if (typeof tags === 'string') {
        // Convertir string como "Algorithm,WayBank" a array de JavaScript
        tagsArray = tags.split(',').map(t => t.trim()).filter(t => t.length > 0);
        console.log("🔄 [PODCAST-CREATE] Tags convertido de string a array:", { original: tags, converted: tagsArray });
      } else if (Array.isArray(tags)) {
        tagsArray = tags;
        console.log("🔄 [PODCAST-CREATE] Tags ya es array:", tagsArray);
      }
    }

    // Validar y limpiar la fecha de publicación
    let validPublishedDate = published_date;
    if (!published_date || published_date === '' || (typeof published_date === 'string' && published_date.trim() === '')) {
      validPublishedDate = null; // PostgreSQL aceptará NULL
    }

    console.log("🔍 [DEBUG-DATE] Fecha recibida:", published_date, "Fecha validada:", validPublishedDate);

    const result = await pool.query(`
      INSERT INTO podcasts (
        title, description, audio_url, language, duration, file_size,
        audio_type, category, tags, transcript, thumbnail_url,
        published_date, active, featured, created_by, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, NOW(), NOW())
      RETURNING *
    `, [
      title, description, audio_url, language, duration, file_size,
      audio_type, category, tagsArray, transcript, thumbnail_url,
      validPublishedDate, active, featured, created_by
    ]);

    console.log("✅ [PODCASTS-PRIORITY] Podcast creado exitosamente");
    return res.json(result.rows[0]);
  } catch (error) {
    console.error("❌ [PODCASTS-PRIORITY] Error:", error);
    return res.status(500).json({ error: "Error al crear el podcast" });
  }
});

app.put('/api/admin/podcasts/:id', async (req: any, res: any) => {
  try {
    res.setHeader('Content-Type', 'application/json');
    const walletAddress = req.headers['x-wallet-address'] || req.session?.walletAddress;
    const adminWallets = ['0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f'];

    if (!walletAddress || !adminWallets.includes(walletAddress.toLowerCase())) {
      return res.status(403).json({ error: "Acceso de administrador requerido" });
    }

    const { id } = req.params;
    let {
      title, description, audio_url, language, duration, file_size,
      audio_type, category, tags, transcript, thumbnail_url,
      published_date, active, featured
    } = req.body;

    // Conversión definitiva de tags para PostgreSQL
    console.log("🔍 [DEBUG-TAGS] Tags recibidos:", tags, "tipo:", typeof tags);

    if (tags) {
      if (typeof tags === 'string') {
        // Convertir string a array
        const tagsArray = tags.split(',').map(t => t.trim()).filter(t => t.length > 0);
        tags = tagsArray;
        console.log("✅ [DEBUG-TAGS] Convertido a array:", tags);
      }
    } else {
      tags = [];
    }

    console.log("✅ [PODCAST-UPDATE-FINAL] Actualizando con tags:", tags, "tipo final:", typeof tags);

    // Validar y limpiar la fecha de publicación para UPDATE
    let validPublishedDate = published_date;
    if (!published_date || published_date === '' || (typeof published_date === 'string' && published_date.trim() === '')) {
      validPublishedDate = null; // PostgreSQL aceptará NULL
    }

    console.log("🔍 [DEBUG-DATE-UPDATE] Fecha recibida:", published_date, "Fecha validada:", validPublishedDate);

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
      validPublishedDate, active, featured, id
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Podcast no encontrado" });
    }

    console.log("✅ [PODCASTS-PRIORITY] Podcast actualizado exitosamente");
    return res.json(result.rows[0]);
  } catch (error) {
    console.error("❌ [PODCASTS-PRIORITY] Error:", error);
    return res.status(500).json({ error: "Error al actualizar el podcast" });
  }
});

// Endpoint público para obtener podcasts (para la página /podcast)
app.get('/api/podcasts', async (req, res) => {
  try {
    const { language, active } = req.query;

    let query = `
      SELECT * FROM podcasts 
      WHERE 1=1
    `;
    const params: any[] = [];

    if (language) {
      query += ` AND language = $${params.length + 1}`;
      params.push(language);
    }

    if (active === 'true') {
      query += ` AND active = $${params.length + 1}`;
      params.push(true);
    }

    query += ` ORDER BY featured DESC, created_at DESC`;

    const result = await pool.query(query, params);

    console.log(`📻 [PODCASTS-PUBLIC] Sirviendo ${result.rows.length} podcasts para idioma: ${language || 'todos'}`);
    return res.json(result.rows);
  } catch (error) {
    console.error("❌ [PODCASTS-PUBLIC] Error:", error);
    return res.status(500).json({ error: "Error al cargar podcasts" });
  }
});

app.delete('/api/admin/podcasts/:id', async (req: any, res: any) => {
  try {
    res.setHeader('Content-Type', 'application/json');
    const walletAddress = req.headers['x-wallet-address'] || req.session?.walletAddress;
    const adminWallets = ['0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f'];

    if (!walletAddress || !adminWallets.includes(walletAddress.toLowerCase())) {
      return res.status(403).json({ error: "Acceso de administrador requerido" });
    }

    const { id } = req.params;

    const result = await pool.query(`
      DELETE FROM podcasts WHERE id = $1 RETURNING *
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Podcast no encontrado" });
    }

    console.log("✅ [PODCASTS-PRIORITY] Podcast eliminado");
    return res.json({ message: "Podcast eliminado correctamente" });
  } catch (error) {
    console.error("❌ [PODCASTS-PRIORITY] Error:", error);
    return res.status(500).json({ error: "Error al eliminar el podcast" });
  }
});

console.log("🎧 Rutas de podcasts con prioridad absoluta registradas");

// Middleware ANTI-CACHE agresivo para todas las rutas API y páginas dinámicas
app.use((req, res, next) => {
  // ANTI-CACHE: Todas las rutas API deben ser siempre frescas
  if (req.path.startsWith('/api/')) {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate, max-age=0');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('Surrogate-Control', 'no-store');
    // Prevenir cache en CDNs y proxies
    res.setHeader('Vary', '*');
  }

  // ANTI-CACHE: Páginas HTML y rutas dinámicas de la SPA
  if (req.path.endsWith('.html') ||
      req.path === '/' ||
      req.path === '/algorithm' ||
      req.path === '/how-it-works' ||
      req.path === '/dashboard' ||
      req.path === '/nfts' ||
      req.path === '/positions' ||
      req.path === '/analytics' ||
      req.path === '/referrals' ||
      req.path === '/settings' ||
      req.path === '/admin' ||
      req.path === '/support' ||
      req.path === '/transfers' ||
      req.path.includes('seo') ||
      req.path.includes('meta')) {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate, max-age=0');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
  }

  next();
});

// Configuración de sesiones - Duración extendida (7 días) para sesión permanente
app.use(session({
  secret: process.env.SESSION_SECRET || 'waybank-secure-session-secret',
  resave: true, // Permitir re-guardar sesión para extender duración
  saveUninitialized: false,
  rolling: true, // Renovar cookie en cada request para sesión permanente
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días - sesión permanente
    httpOnly: true, // Seguridad: no accesible desde JavaScript
    sameSite: 'lax' // Protección CSRF pero permite navegación normal
  },
  store: new MemoryStoreSession({
    checkPeriod: 86400000 // Eliminar sesiones caducadas cada 24h
  })
}));


// Middleware SEO para optimización de páginas públicas para motores de búsqueda
// Este middleware solo afecta a los crawlers, no a los usuarios normales
app.use(seoMiddleware);

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }
    }
  });

  next();
});

(async () => {
  // Ejecutar la migración de la base de datos primero
  await runMigration();

  // Ejecutar la migración de tablas para wallet custodiado
  try {
    const { runCustodialWalletMigration } = await import('./custodial-wallet/migrations');
    await runCustodialWalletMigration();

    // Ejecutar la migración para la tabla de frases semilla
    const { addWalletSeedPhrasesTableMigration } = await import('./migrations/add-wallet-seed-phrases-table');
    await addWalletSeedPhrasesTableMigration();
    console.log("Migración de tabla de frases semilla completada con éxito");
  } catch (error) {
    log(`[DB] Error in custodial wallet migration: ${error}`);
  }

  // Generar sitemap.xml para mejorar SEO
  try {
    const { generateSitemap, writeSitemapToFile } = await import('./seo/generate-sitemap');
    writeSitemapToFile();
  } catch (error) {
    log(`[SEO] Error generating sitemap: ${error}`);
  }



  // Registrar rutas de diagnóstico SSL/WebSocket para resolver error 4500
  try {
    const { registerSSLDiagnosticRoutes } = await import('./ssl-diagnostics');
    registerSSLDiagnosticRoutes(app);
    log(`[SSL] Rutas de diagnóstico SSL/WebSocket registradas correctamente`);
  } catch (error) {
    log(`[SSL] Error registrando diagnósticos SSL: ${error}`);
  }

  // Registrar rutas de monitoreo de salud del sistema antes que las rutas principales
  log(`[HA] Registrando endpoints de monitoreo del sistema de alta disponibilidad...`);
  registerHealthRoutes(app);
  log(`[HA] Sistema de monitoreo de alta disponibilidad registrado correctamente`);

  // Registrar rutas para la recuperación de wallet con frase semilla única
  try {
    const { registerWalletRecoveryRoutes } = await import('./custodial-wallet-recovery');
    registerWalletRecoveryRoutes(app);
    log(`[Wallet] Rutas de recuperación de wallet registradas correctamente`);

    // IMPORTANTE: Modificamos el orden de registro para evitar conflictos
    // Primero registramos las rutas específicas de frases semilla y DESPUÉS las genéricas

    // SOLUCIÓN ÚNICA: Solo usamos api-wallet-seed.js que ya tiene simple-recovery implementado
    const { registerWalletSeedRoutes } = await import('./api-wallet-seed.js');
    registerWalletSeedRoutes(app);
    log(`[Wallet] API de frases semilla registrado correctamente - RECUPERACIÓN INCLUIDA`);
  } catch (error) {
    log(`[Wallet] Error al registrar rutas de wallet: ${error}`);
  }

  // ENDPOINT CRÍTICO: Exportación contable - DEBE ir ANTES de registerRoutes
  console.log('🔧 Registrando endpoint crítico: /api/admin/invoices/export');
  app.get('/api/admin/invoices/export', async (req: any, res: any) => {
    console.log('🚀 ENDPOINT CRÍTICO LLAMADO: /api/admin/invoices/export');
    console.log('🔍 DEBUG - Session completa:', JSON.stringify(req.session, null, 2));
    console.log('🔍 DEBUG - Headers relevantes:', {
      'x-wallet-address': req.headers['x-wallet-address'],
      'authorization': req.headers['authorization'],
      'cookie': req.headers['cookie']
    });

    try {
      // Verificación de administrador - múltiples métodos
      let userWallet = null;

      // Método 1: Desde sesión
      if (req.session?.walletAddress) {
        userWallet = req.session.walletAddress.toLowerCase();
        console.log('Export - Wallet desde sesión:', userWallet);
      }

      // Método 2: Desde headers (backup)
      if (!userWallet && req.headers['x-wallet-address']) {
        userWallet = req.headers['x-wallet-address'].toString().toLowerCase();
        console.log('Export - Wallet desde header:', userWallet);
      }

      const adminWallets = [
        '0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f',
        '0x072e5c543c2d898af125c20d30c8d13a66dda9af'
      ];

      if (!userWallet || !adminWallets.includes(userWallet)) {
        console.log('Export endpoint - Access denied for wallet:', userWallet);
        return res.status(401).json({ message: "Admin access required" });
      }

      console.log('Export endpoint - Admin access granted for:', userWallet);

      const { startDate, endDate, status, currency } = req.query;

      console.log('🔍 DEBUG Query parameters:', { startDate, endDate, status, currency });

      // Obtener facturas desde la base de datos
      // Usar created_at en lugar de issue_date ya que todas las facturas tienen issue_date NULL
      const query = `
        SELECT * FROM invoices 
        WHERE 1=1
        ${startDate ? "AND created_at >= $1" : ""}
        ${endDate ? "AND created_at <= $2" : ""}
        ${status && status !== 'all' ? "AND status = $3" : ""}
        ${currency && currency !== 'all' ? "AND currency = $4" : ""}
        ORDER BY created_at DESC
      `;

      const params = [];
      if (startDate) params.push(startDate);
      if (endDate) params.push(endDate);
      if (status && status !== 'all') params.push(status);
      if (currency && currency !== 'all') params.push(currency);

      const result = await pool.query(query, params);
      console.log('Export endpoint - Total invoices found:', result.rows.length);

      // Formatear datos para exportación contable (Dubai/UAE)
      const invoices = result.rows.map((invoice: any) => ({
        id: invoice.id,
        invoiceNumber: invoice.invoice_number || `INV-${invoice.id}`,
        walletAddress: invoice.wallet_address || '',
        email: invoice.client_email || '',
        fullName: invoice.client_name || '',
        amount: parseFloat(invoice.amount || '0'),
        taxAmount: parseFloat(invoice.amount || '0') * 0.05, // 5% VAT UAE
        totalAmount: parseFloat(invoice.amount || '0') * 1.05,
        currency: invoice.currency || 'USD',
        status: invoice.status,
        createdAt: invoice.issue_date,
        dueDate: invoice.due_date,
        paymentDate: invoice.paid_date,
        description: 'Servicios de liquidez WayBank',
        taxRate: 5.0, // UAE VAT rate
        country: invoice.client_country || 'UAE',
        city: invoice.client_city || 'Dubai',
        address: invoice.client_address || '',
        taxId: invoice.client_tax_id || '',
        paymentMethod: invoice.payment_method || '',
        stripePaymentId: invoice.payment_intent_id || ''
      }));

      console.log('Export endpoint - Sending invoices:', invoices.length);
      res.json(invoices);
    } catch (error) {
      console.error('Error in export endpoint:', error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // RUTAS DE RETIROS DE FEES
  const { feeWithdrawalsRoutes } = await import("./routes/fee-withdrawals.js");
  app.use("/api/fee-withdrawals", feeWithdrawalsRoutes);
  console.log("Fee withdrawals routes registered successfully");

  // RUTAS DE PRUEBA DE EMAIL
  app.get('/api/email/config', async (req, res) => {
    try {
      const config = {
        smtpHost: process.env.SMTP_HOST ? '✅ Configurado' : '❌ Falta',
        smtpPort: process.env.SMTP_PORT ? '✅ Configurado' : '❌ Falta',
        smtpUser: process.env.SMTP_USER ? '✅ Configurado' : '❌ Falta',
        smtpPassword: process.env.SMTP_PASSWORD ? '✅ Configurado' : '❌ Falta',
        smtpFrom: process.env.SMTP_FROM ? '✅ Configurado' : '❌ Falta',
        resendApiKey: process.env.RESEND_API_KEY ? '✅ Configurado (backup)' : '⚠️ No configurado (opcional)'
      };

      const allConfigured = Object.entries(config)
        .filter(([key]) => key !== 'resendApiKey')
        .every(([, value]) => value.includes('✅'));

      res.json({
        success: true,
        configured: allConfigured,
        status: allConfigured ? 'Sistema de emails completamente configurado' : 'Faltan configuraciones',
        configuration: config,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error verificando configuración',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // ACTIVAR SISTEMA DE REPLICACIÓN AUTOMÁTICA
  log('[REPLICATION] Activating automatic database replication system...');
  app.use(replicationMiddleware);

  // Iniciar monitor de sincronización continua (cada 5 minutos)
  startSyncMonitor(300000);
  log('[REPLICATION] Database replication system activated and monitoring started');

  // Registrar rutas principales de la aplicación
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on the configured port (default 5000)
  // this serves both the API and the client.
  // Use environment variable PORT to override.
  const port = process.env.PORT ? parseInt(process.env.PORT) : 5000;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });

  return server;
})();
