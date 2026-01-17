import express from "express";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { storage } from "./storage";
import { insertReferralSchema, insertReferredUserSchema } from "@shared/schema";

// Definimos la función de middleware directamente aquí para evitar problemas de importación
const isAuthenticated = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (!req.session || !req.session.user || !req.session.user.walletAddress) {
    // En lugar de error 401, devolvemos un objeto JSON para que el cliente pueda manejarlo sin errores
    return res.json({ 
      isReferred: false, 
      referredUser: null,
      referrerWalletAddress: null,
      needsAuthentication: true  // Indicador para el cliente de que necesita autenticarse
    });
  }
  next();
};

export const referralRouter = express.Router();

// Función auxiliar para calcular y actualizar las recompensas de todos los usuarios referidos de un referente
async function updateAllReferredUserFees(referralId: number): Promise<void> {
  try {
    // Obtenemos la lista de usuarios referidos
    const referredUsers = await storage.getReferredUsersByReferralId(referralId);
    if (!referredUsers || referredUsers.length === 0) {
      console.log(`No hay usuarios referidos para actualizar recompensas para el referralId ${referralId}`);
      return;
    }
    
    // Para cada usuario referido, calculamos las recompensas basadas en sus posiciones (1% de comisión)
    let totalUpdatedRewards = 0;
    
    for (const user of referredUsers) {
      try {
        if (!user.referredWalletAddress) continue;
        
        // Normalizamos la dirección a minúsculas para consultar posiciones
        const normalizedWalletAddress = user.referredWalletAddress.toLowerCase();
        
        // Obtenemos directamente las posiciones del historial 
        const positionHistories = await storage.getPositionHistoryByWalletAddress(normalizedWalletAddress);
        console.log(`Obtenidas ${positionHistories.length} posiciones de historial para usuario referido ${normalizedWalletAddress}`);
        
        // Obtenemos la fecha de unión del usuario referido o usamos una fecha por defecto
        const joinDate = user.joinedAt ? new Date(user.joinedAt) : new Date();
        const now = new Date();
        
        // Calculamos el número de días desde la unión
        const daysSinceJoined = Math.max(0, (now.getTime() - joinDate.getTime()) / (1000 * 60 * 60 * 24));
        console.log(`Usuario ${normalizedWalletAddress} referido hace ${daysSinceJoined.toFixed(2)} días`);
        
        // Calculamos la suma de beneficios generados por las posiciones activas
        let totalFeesEarned = 0;
        
        // Recorremos todas las posiciones de historial
        for (const position of positionHistories) {
          try {
            // Determinamos si la posición está activa según su status
            // Consideramos como válidas todas las variantes de 'Active' y 'confirmed'
            const posStatus = position.status?.toLowerCase();
            const isValidStatus = 
              posStatus === 'active' || 
              posStatus === 'confirmed';
            
            // Obtenemos el valor de fees en cualquier formato que pueda tener
            let feesValue = 0;
            
            if (position.feesEarned !== undefined && position.feesEarned !== null) {
              // Intentamos extraer el valor de fees con manejo de diferentes tipos
              if (typeof position.feesEarned === 'number') {
                feesValue = position.feesEarned;
              } else if (typeof position.feesEarned === 'string') {
                feesValue = parseFloat(position.feesEarned) || 0;
              } else if (typeof position.feesEarned === 'object') {
                // Para tipos numéricos de PostgreSQL
                feesValue = parseFloat(String(position.feesEarned)) || 0;
              }
            }
            
            // Si la posición tiene un estado válido y tiene fees, los sumamos directamente
            if (isValidStatus && !isNaN(feesValue) && feesValue > 0) {
              // Importante: Tomamos el valor total sin prorratear por días
              totalFeesEarned += feesValue;
              
              console.log(`Posición historial ${position.id}: estado=${position.status}, fees=$${feesValue.toFixed(2)}`);
            } else {
              const statusText = position.status ? position.status : 'unknown';
              console.log(`Posición historial ${position.id}: estado=${statusText}, fees=${feesValue} - No sumada (inactiva o sin fees)`);
            }
          } catch (positionError) {
            console.error(`Error al procesar posición historial ${position.id}:`, positionError);
            // Continuamos con la siguiente posición
          }
        }
        
        // Calculamos las recompensas: 1% de los beneficios generados
        const rewards = totalFeesEarned * 0.01;
        
        // Si hay recompensas, actualizamos en la base de datos
        if (rewards > 0) {
          console.log(`Actualizando recompensas para usuario referido ${normalizedWalletAddress}, monto: ${rewards.toFixed(2)} (1% de $${totalFeesEarned.toFixed(2)} de fees)`);
          
          // Actualizamos el campo earnedRewards del usuario referido
          await storage.updateReferredUser(user.id, {
            earnedRewards: rewards.toString()
          });
          
          totalUpdatedRewards += rewards;
        } else {
          console.log(`No hay recompensas para el usuario ${normalizedWalletAddress} (total fees: $${totalFeesEarned.toFixed(2)})`);
        }
      } catch (userError) {
        console.error(`Error al actualizar recompensas para usuario ${user.referredWalletAddress}:`, userError);
        // Continuamos con el siguiente usuario
      }
    }
    
    console.log(`Total de recompensas actualizadas para referralId ${referralId}: $${totalUpdatedRewards.toFixed(2)}`);
  } catch (error) {
    console.error("Error general al actualizar recompensas de usuarios referidos:", error);
    // No propagamos el error para no interrumpir el flujo
  }
}

// IMPORTANTE: Definimos primero las rutas específicas antes de las que tienen parámetros
// para evitar conflictos de captura

// RUTA 1: Verificar si el usuario actual está referido - implementación simplificada y robusta
referralRouter.get("/check-referred", async (req, res) => {
  console.log("Ejecutando endpoint /check-referred con query:", req.query);
  
  // Definir respuesta por defecto
  const defaultResponse = {
    success: true,
    isReferred: false,
    referredUser: null,
    referrerWalletAddress: null
  };
  
  try {
    // Intentar obtener la dirección del wallet del usuario autenticado
    let walletAddress = req.session.user?.walletAddress;
    
    // Intentar obtener de la query string si no está en la sesión
    if (!walletAddress && req.query && req.query.walletAddress) {
      console.log("Usando dirección de wallet de la query string:", req.query.walletAddress);
      walletAddress = req.query.walletAddress as string;
    }
    
    // Si no hay wallet, responder con un objeto por defecto
    if (!walletAddress) {
      console.log("No hay dirección de wallet en la sesión al comprobar referidos");
      return res.json({
        ...defaultResponse,
        needsAuthentication: true
      });
    }
    
    // Normalizar la dirección del wallet a minúsculas
    walletAddress = walletAddress.toLowerCase();
    
    // Verificar si el usuario es un referido
    let referredUser;
    try {
      referredUser = await storage.getReferredUserByWalletAddress(walletAddress);
    } catch (err) {
      console.error("Error al consultar si el usuario es referido:", err);
      // En caso de error, seguimos con una respuesta por defecto
      return res.json(defaultResponse);
    }
    
    // Si no es referido, responder con el objeto por defecto
    if (!referredUser) {
      console.log(`Usuario ${walletAddress} no es un referido`);
      return res.json(defaultResponse);
    }
    
    // Normalizar datos del usuario referido para evitar valores nulos o undefined
    const safeReferredUser = {
      id: referredUser.id || 0,
      referralId: 0, // Valor inicial seguro
      referredWalletAddress: referredUser.referredWalletAddress || walletAddress,
      joinedAt: referredUser.joinedAt || new Date().toISOString(),
      status: referredUser.status || "active",
      earnedRewards: referredUser.earnedRewards || "0",
      aprBoost: referredUser.aprBoost || "1.01"
    };
    
    // Verificar el referralId de forma segura
    let referrerWalletAddress = null;
    
    // Sólo si referralId es un número válido mayor que 0
    if (typeof referredUser.referralId === 'number' && 
        !isNaN(referredUser.referralId) && 
        referredUser.referralId > 0) {
      
      // Actualizar el ID en el objeto seguro
      safeReferredUser.referralId = referredUser.referralId;
      
      // Intentar obtener el referral asociado
      try {
        const referral = await storage.getReferral(referredUser.referralId);
        if (referral && referral.walletAddress) {
          referrerWalletAddress = referral.walletAddress;
        }
      } catch (err) {
        console.error(`Error al obtener referral con ID ${referredUser.referralId}:`, err);
        // No hacemos nada, simplemente continuamos con referrerWalletAddress = null
      }
    } else {
      console.log(`ID de referral inválido o no numérico: ${referredUser.referralId}`);
    }
    
    // Responder con los datos del usuario referido
    return res.json({
      success: true,
      isReferred: true,
      referredUser: safeReferredUser,
      referrerWalletAddress: referrerWalletAddress
    });
    
  } catch (error) {
    // Capturar cualquier otro error no previsto
    console.error("Error general al verificar estado de referido:", error);
    
    // Siempre devolver una respuesta válida
    return res.json({
      ...defaultResponse,
      errorMessage: "Error al verificar el estado de referido"
    });
  }
});

// RUTA 2: Obtener estadísticas de referidos
referralRouter.get("/stats", async (req, res) => {
  // Definir estadísticas por defecto para casos de error o sin datos
  const defaultStats = {
    success: true,
    totalReferred: 0,
    activeUsers: 0,
    totalRewards: "$0.00",
    completionRate: 0
  };
  
  try {
    // Intentar obtener la dirección del wallet primero de la query string
    // ya que este es un endpoint público que puede ser llamado sin sesión
    let walletAddress = req.query.walletAddress as string || req.session.user?.walletAddress;
    
    console.log("Query params recibidos:", req.query);
    
    if (!walletAddress) {
      console.log("No hay dirección de wallet, devolviendo estadísticas por defecto");
      return res.json({ ...defaultStats, success: true }); // Cambiado a true
    }
    
    // Normalizar la dirección del wallet a minúsculas
    walletAddress = walletAddress.toLowerCase();
    
    // Buscar el referral del usuario
    let referrals;
    try {
      referrals = await storage.getReferralsByWalletAddress(walletAddress);
      console.log(`Encontrados ${referrals.length} referrals para ${walletAddress}`);
    } catch (err) {
      console.error("Error al obtener referrals:", err);
      return res.json(defaultStats);
    }
    
    if (!referrals || referrals.length === 0) {
      console.log("No se encontraron referrals, devolviendo estadísticas por defecto");
      return res.json(defaultStats);
    }
    
    // Validar que el ID del referido es un número válido
    if (!referrals[0] || typeof referrals[0].id !== 'number' || isNaN(referrals[0].id)) {
      console.warn("ID de referido inválido o no encontrado, devolviendo estadísticas por defecto");
      return res.json({
        success: true,
        totalReferred: 0,
        activeUsers: 0,
        totalRewards: "$0.00",
        completionRate: 0
      });
    }
    
    const referralId = referrals[0].id;
    console.log("Referido encontrado con ID:", referralId);
    
    // OBTENER DATOS DE REFERRED USERS PRIMERO - ya que los usaremos para todos los cálculos
    let referredUsers: any[] = [];
    try {
      referredUsers = await storage.getReferredUsersByReferralId(referralId);
      console.log(`Obtenidos ${referredUsers.length} usuarios referidos para estadísticas`);
    } catch (err) {
      console.error(`Error al obtener usuarios referidos para ID ${referralId}:`, err);
      // Continuamos con el array vacío, pero devolvemos valores por defecto
      return res.json(defaultStats);
    }
    
    // Si no hay usuarios referidos, devolvemos los valores por defecto
    if (!referredUsers || !Array.isArray(referredUsers)) {
      console.log("No hay usuarios referidos o formato inválido, devolviendo estadísticas por defecto");
      return res.json(defaultStats);
    }
    
    // Contar usuarios referidos directamente del array
    const referredCount = referredUsers.length;
    
    // Contar usuarios activos (considerando cualquier variante de "active" o "Active")
    const activeCount = referredUsers.filter(u => u && u.status && u.status.toLowerCase() === "active").length;
    
    // Calcular completion rate de forma segura
    let completionRate = 0;
    if (referredCount > 0) {
      completionRate = (activeCount / referredCount) * 100;
      // Asegurar que sea un número válido
      completionRate = isNaN(completionRate) ? 0 : completionRate;
    }
    
    // Calcular recompensas totales (sumar earnedRewards de todos los usuarios referidos)
    let totalRewards = "$0.00";
    if (referredCount > 0) {
      try {
        // Intentamos actualizar las recompensas, pero no bloqueamos si hay un error
        try {
          await updateAllReferredUserFees(referralId);
        } catch (feeError) {
          console.error("Error al actualizar recompensas, continuando:", feeError);
        }
        
        // Ahora obtenemos las recompensas actualizadas
        const updatedReferredUsers = await storage.getReferredUsersByReferralId(referralId);
        
        const rewardsSum = updatedReferredUsers.reduce((sum, user) => {
          const reward = user && user.earnedRewards ? parseFloat(user.earnedRewards) : 0;
          return isNaN(reward) ? sum : sum + reward;
        }, 0);
        
        // Formatear el total de recompensas como moneda
        totalRewards = `$${rewardsSum.toFixed(2)}`;
      } catch (rewardsError) {
        console.error("Error al calcular recompensas totales:", rewardsError);
        // Mantenemos el valor por defecto
      }
    }
    
    // Devolver las estadísticas calculadas
    return res.json({
      success: true,
      totalReferred: referredCount,
      activeUsers: activeCount,
      totalRewards,
      completionRate
    });
  } catch (error) {
    console.error("Error general al obtener estadísticas de referidos:", error);
    return res.json(defaultStats);
  }
});

// RUTA 3: Obtener usuarios referidos
referralRouter.get("/users/referred", async (req, res) => {
  try {
    // Intentar obtener la dirección del wallet primero de la query string
    // ya que este endpoint puede ser llamado sin sesión
    let walletAddress = req.query.walletAddress as string || req.session.user?.walletAddress;
    
    if (!walletAddress) {
      return res.json({ 
        success: false, 
        error: "No se ha proporcionado dirección de wallet",
        data: []
      });
    }
    
    // Normalizar la dirección del wallet a minúsculas
    walletAddress = walletAddress.toLowerCase();
    
    // Buscar el referral del usuario
    let referrals;
    try {
      referrals = await storage.getReferralsByWalletAddress(walletAddress);
      console.log(`Encontrados ${referrals.length} referrals para listado de usuarios referidos`);
    } catch (err) {
      console.error("Error al obtener referrals para listado:", err);
      return res.json({ 
        success: false, 
        error: "Error al obtener referrals",
        data: []
      });
    }
    
    if (!referrals || referrals.length === 0) {
      console.log("No se encontraron referrals para listado, devolviendo array vacío");
      return res.json({ 
        success: true, 
        data: []
      });
    }
    
    // Validar que el ID del referido es un número válido
    if (!referrals[0] || typeof referrals[0].id !== 'number' || isNaN(referrals[0].id)) {
      console.warn("ID de referido inválido o no encontrado para listado, devolviendo array vacío");
      return res.json({ 
        success: false, 
        error: "ID de referido inválido",
        data: []
      });
    }
    
    const referralId = referrals[0].id;
    console.log("Referido encontrado con ID para listado de usuarios:", referralId);
    
    // Obtener los usuarios referidos con manejo de errores
    try {
      const referredUsers = await storage.getReferredUsersByReferralId(referralId);
      console.log(`Obtenidos ${referredUsers.length} usuarios referidos para mostrar en la lista`);
      
      // Enviar respuesta con formato estándar, manteniendo compatibilidad con el frontend actual
      return res.json({
        success: true,
        data: referredUsers || []
      });
    } catch (err) {
      console.error(`Error al obtener usuarios referidos para ID ${referralId}:`, err);
      return res.json({
        success: false,
        error: "Error al obtener usuarios referidos",
        data: []
      });
    }
  } catch (error) {
    console.error("Error general al obtener usuarios referidos:", error);
    return res.json({
      success: false,
      error: "Error general al obtener usuarios referidos",
      data: []
    });
  }
});

// Crear un nuevo referral
referralRouter.post("/", async (req, res) => {
  try {
    // Obtener la dirección del wallet del usuario autenticado
    const walletAddress = req.session.user?.walletAddress;
    
    if (!walletAddress) {
      return res.status(401).json({ error: "No se ha proporcionado dirección de wallet" });
    }
    
    // Verificar si el usuario ya tiene un referral
    const existingReferrals = await storage.getReferralsByWalletAddress(walletAddress);
    if (existingReferrals && existingReferrals.length > 0) {
      return res.json(existingReferrals[0]);
    }
    
    // Generar un código de referido único
    const referralCode = await storage.generateReferralCode(walletAddress);
    
    // Crear el referral
    const newReferral = await storage.createReferral({
      walletAddress: walletAddress.toLowerCase(),
      referralCode,
      totalRewards: "0"
    });
    
    return res.status(201).json(newReferral);
  } catch (error) {
    console.error(`Error al crear referral:`, error);
    return res.status(500).json({ error: "Error al crear referral" });
  }
});

// Obtener todos los referrals del usuario
referralRouter.get("/", async (req, res) => {
  try {
    // Intentar obtener la dirección del wallet primero de la sesión, luego de la query string
    let walletAddress = req.session.user?.walletAddress;
    
    // Intentar obtener de la query string si no está en la sesión
    if (!walletAddress && req.query && req.query.walletAddress) {
      console.log("Usando dirección de wallet de la query string para obtener referrals:", req.query.walletAddress);
      walletAddress = req.query.walletAddress as string;
    }
    
    if (!walletAddress) {
      return res.status(401).json({ error: "No se ha proporcionado dirección de wallet" });
    }
    
    // Normalizar la dirección del wallet a minúsculas
    walletAddress = walletAddress.toLowerCase();

    const referrals = await storage.getReferralsByWalletAddress(walletAddress);
    return res.json(referrals);
  } catch (error) {
    console.error("Error al obtener referrals:", error);
    return res.status(500).json({ error: "Error al obtener referrals" });
  }
});

// RUTA 4: Obtener un referral por código
referralRouter.get("/code/:referralCode", async (req, res) => {
  try {
    const { referralCode } = req.params;
    
    const referral = await storage.getReferralByCode(referralCode);
    
    if (!referral) {
      return res.status(404).json({ error: "Código de referido no encontrado" });
    }
    
    // Solo devolvemos información limitada para visualización pública
    return res.json({
      id: referral.id,
      referralCode: referral.referralCode,
      createdAt: referral.createdAt
    });
  } catch (error) {
    console.error(`Error al obtener referral por código:`, error);
    return res.status(500).json({ error: "Error al obtener referral por código" });
  }
});

// Registrar un nuevo usuario referido
referralRouter.post("/users/referred", async (req, res) => {
  try {
    // Obtener la dirección primero de la sesión, luego del cuerpo
    let walletAddress = req.session.user?.walletAddress;
    
    // Si no hay dirección en la sesión, intentar obtenerla del cuerpo
    if (!walletAddress && req.body && req.body.walletAddress) {
      console.log("Usando dirección de wallet del cuerpo de la solicitud para referido:", req.body.walletAddress);
      walletAddress = req.body.walletAddress;
    }
    
    if (!walletAddress) {
      return res.status(401).json({ error: "No se ha proporcionado dirección de wallet" });
    }
    
    // Normalizar la dirección del wallet a minúsculas
    walletAddress = walletAddress.toLowerCase();
    
    // Validar datos del cuerpo de la solicitud
    const validationSchema = z.object({
      referralCode: z.string().min(1, "El código de referido es obligatorio")
    });
    
    const validationResult = validationSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({ 
        error: "Datos inválidos", 
        details: validationResult.error.errors 
      });
    }
    
    const { referralCode } = validationResult.data;
    
    // Verificar si el usuario ya está registrado como referido
    const existingReferredUser = await storage.getReferredUserByWalletAddress(walletAddress);
    if (existingReferredUser) {
      return res.status(400).json({ 
        error: "Ya estás registrado como usuario referido", 
        referredUser: existingReferredUser 
      });
    }
    
    // Obtener el referral por código
    const referral = await storage.getReferralByCode(referralCode);
    if (!referral) {
      return res.status(404).json({ error: "Código de referido no válido" });
    }
    
    // Verificar que no esté intentando auto-referirse
    if (referral.walletAddress.toLowerCase() === walletAddress.toLowerCase()) {
      return res.status(400).json({ error: "No puedes usar tu propio código de referido" });
    }
    
    // Crear el usuario referido
    const newReferredUser = await storage.createReferredUser({
      referralId: referral.id,
      referredWalletAddress: walletAddress,
      joinedAt: new Date().toISOString(), // Usar formato ISO para compatibilidad
      status: "active",
      earnedRewards: "0",
      aprBoost: "1.01" // 1% de incremento en APR
    } as any); // Usar 'as any' para evitar errores de tipos temporalmente
    
    // Actualizar el contador de referidos para el referral
    console.log(`Actualizando contador de referidos para referral ID ${referral.id}`);
    const referredCount = await storage.countReferredUsersByReferralId(referral.id);
    console.log(`Total de referidos contabilizados: ${referredCount}`);
    
    // Registrar en logs para debug
    console.log(`Usuario referido creado con éxito. Total de referidos para el código ${referralCode}: ${referredCount}`);
    
    // Responder con el usuario referido y datos adicionales para el frontend
    return res.status(201).json({
      referredUser: newReferredUser,
      referrerWalletAddress: referral.walletAddress,
      referralCode: referral.referralCode,
      success: true
    });
  } catch (error) {
    console.error("Error al registrar usuario referido:", error);
    return res.status(500).json({ 
      error: "Error al registrar usuario referido",
      success: false
    });
  }
});

// Actualizar recompensas de un usuario referido (solo accesible para administradores)
referralRouter.post("/users/referred/:id/rewards", async (req, res) => {
  try {
    const { id } = req.params;
    const { amount } = req.body;
    
    // Validar que el usuario es administrador
    if (!req.session.user?.isAdmin) {
      return res.status(403).json({ error: "No tienes permisos para actualizar recompensas" });
    }
    
    // Validar parámetros
    const referredUserId = Number(id);
    if (isNaN(referredUserId) || !Number.isInteger(referredUserId) || referredUserId <= 0) {
      return res.status(400).json({ error: "ID de usuario referido inválido" });
    }
    
    const earnedAmount = Number(amount);
    if (isNaN(earnedAmount) || earnedAmount < 0) {
      return res.status(400).json({ error: "Cantidad de recompensa inválida" });
    }
    
    // Actualizar recompensas
    const updatedUser = await storage.updateReferredUserRewards(referredUserId, earnedAmount);
    
    if (!updatedUser) {
      return res.status(404).json({ error: "Usuario referido no encontrado" });
    }
    
    return res.json(updatedUser);
  } catch (error) {
    console.error(`Error al actualizar recompensas:`, error);
    return res.status(500).json({ error: "Error al actualizar recompensas" });
  }
});

// Actualizar un usuario referido (solo accesible para administradores)
referralRouter.patch("/users/referred/:id", async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validar que el usuario es administrador
    if (!req.session.user?.isAdmin) {
      return res.status(403).json({ error: "No tienes permisos para actualizar usuarios referidos" });
    }
    
    // Validar ID
    const referredUserId = Number(id);
    if (isNaN(referredUserId) || !Number.isInteger(referredUserId) || referredUserId <= 0) {
      return res.status(400).json({ error: "ID de usuario referido inválido" });
    }
    
    // Validar cuerpo de la solicitud (solo permitir ciertos campos)
    const allowedFields = ["status", "aprBoost"];
    const updateData: Record<string, any> = {};
    
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    }
    
    // Si no hay campos para actualizar, devolver error
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: "No se han proporcionado campos válidos para actualizar" });
    }
    
    // Actualizar usuario referido
    const updatedUser = await storage.updateReferredUser(referredUserId, updateData);
    
    if (!updatedUser) {
      return res.status(404).json({ error: "Usuario referido no encontrado" });
    }
    
    return res.json(updatedUser);
  } catch (error) {
    console.error(`Error al actualizar usuario referido:`, error);
    return res.status(500).json({ error: "Error al actualizar usuario referido" });
  }
});

// RUTA 5: Obtener un referral específico por ID
// IMPORTANTE: esta ruta debe ir DESPUÉS de todas las rutas específicas
referralRouter.get("/:id", async (req, res) => {
  try {
    // Validar que no estamos intentando acceder a una ruta especial como "check-referred"
    if (req.params.id === 'check-referred') {
      return res.status(404).json({ error: "Ruta no encontrada" });
    }
    
    const { id } = req.params;
    const walletAddress = req.session.user?.walletAddress;
    
    if (!walletAddress) {
      return res.status(401).json({ error: "No se ha proporcionado dirección de wallet" });
    }
    
    // Validar que el ID es un número entero válido
    const referralId = Number(id);
    if (isNaN(referralId) || !Number.isInteger(referralId) || referralId <= 0) {
      return res.status(400).json({ error: "ID de referido inválido" });
    }

    const referral = await storage.getReferral(referralId);
    
    if (!referral) {
      return res.status(404).json({ error: "Referral no encontrado" });
    }
    
    // Verificar que el referral pertenece al usuario autenticado
    if (referral.walletAddress.toLowerCase() !== walletAddress.toLowerCase()) {
      return res.status(403).json({ error: "No tienes permiso para acceder a este referral" });
    }
    
    return res.json(referral);
  } catch (error) {
    console.error(`Error al obtener referral por ID:`, error);
    return res.status(500).json({ error: "Error al obtener referral" });
  }
});