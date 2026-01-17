import { Router } from "express";
import { storage } from "../storage";
import { updateFeeWithdrawalSchema, insertFeeWithdrawalSchema } from "@shared/schema";
import { z } from "zod";

const router = Router();

// Obtener todos los retiros de fees (admin)
router.get("/", async (req, res) => {
  try {
    const withdrawals = await storage.getAllFeeWithdrawals();
    res.json(withdrawals);
  } catch (error) {
    console.error("Error al obtener retiros de fees:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

// Obtener retiros por estado
router.get("/status/:status", async (req, res) => {
  try {
    const { status } = req.params;
    const withdrawals = await storage.getFeeWithdrawalsByStatus(status);
    res.json(withdrawals);
  } catch (error) {
    console.error("Error al obtener retiros por estado:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

// Obtener retiros por wallet address
router.get("/wallet/:walletAddress", async (req, res) => {
  try {
    const { walletAddress } = req.params;
    const withdrawals = await storage.getFeeWithdrawalsByWalletAddress(walletAddress);
    res.json(withdrawals);
  } catch (error) {
    console.error("Error al obtener retiros por wallet:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

// Obtener total retirado para una posición específica (wallet + pool/tokenPair)
router.get("/total/:walletAddress/:identifier", async (req, res) => {
  try {
    const { walletAddress, identifier } = req.params;
    const totalWithdrawn = await storage.getTotalWithdrawnByPosition(walletAddress, identifier);
    res.json({ totalWithdrawn });
  } catch (error) {
    console.error("Error al obtener total retirado:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

// Crear nuevo retiro de fee
router.post("/", async (req, res) => {
  try {
    console.log('🔵 [Fee Withdrawal Backend] === INICIO PROCESAMIENTO BACKEND ===');
    console.log('📦 [Fee Withdrawal Backend] Datos recibidos:', req.body);
    console.log('📋 [Fee Withdrawal Backend] Headers:', req.headers);
    console.log('🔐 [Fee Withdrawal Backend] Usuario autenticado:', req.headers['x-wallet-address']);
    
    console.log('🔍 [Fee Withdrawal Backend] Validando datos con schema...');
    const validatedData = insertFeeWithdrawalSchema.parse(req.body);
    console.log('✅ [Fee Withdrawal Backend] Datos validados exitosamente:', validatedData);
    
    // Obtener el pool para verificar el APR actual (opcional)
    let pool = null;
    try {
      pool = await storage.getCustomPoolByAddress(validatedData.poolAddress, validatedData.network);
    } catch (error) {
      console.log(`Pool no encontrado para ${validatedData.poolAddress}, continuando con valores por defecto`);
    }
    
    // Simular APR actual (en un caso real vendría de la blockchain o base de datos)
    let currentApr = 85; // Ejemplo: 85% APR
    const penaltyAmount = 7.73; // 7.73% de penalización por pérdida de interés compuesto
    const minAprForPenalty = 30; // APR mínimo para aplicar penalización
    
    let aprAfterWithdrawal = currentApr;
    let penaltyApplied = false;
    
    // Aplicar penalización solo si APR > 30%
    if (currentApr > minAprForPenalty) {
      aprAfterWithdrawal = Math.max(currentApr - penaltyAmount, minAprForPenalty);
      penaltyApplied = true;
    }
    
    // Crear datos del retiro con información de APR
    const withdrawalData = {
      ...validatedData,
      aprBeforeWithdrawal: currentApr.toString(),
      aprAfterWithdrawal: aprAfterWithdrawal.toString(),
      aprPenaltyApplied: penaltyApplied,
      aprPenaltyAmount: penaltyAmount.toString()
    };
    
    const withdrawal = await storage.createFeeWithdrawal(withdrawalData);
    
    // TODO: Aquí se actualizaría el APR real de la pool en la blockchain/base de datos
    // La penalización refleja la pérdida de interés compuesto por retiro anticipado
    console.log(`✅ [Fee Withdrawal] APR actualizado para pool ${validatedData.poolAddress}: ${currentApr}% → ${aprAfterWithdrawal}% (penalización: -${penaltyAmount}%)`);
    console.log('✅ [Fee Withdrawal] Retirada creada exitosamente:', withdrawal.id);
    
    res.status(201).json(withdrawal);
  } catch (error) {
    console.error('🔴 [Fee Withdrawal Backend] Error durante el procesamiento:', error);
    
    if (error instanceof z.ZodError) {
      console.error('🔴 [Fee Withdrawal Backend] Error de validación Zod:', error.errors);
      res.status(400).json({ message: "Datos inválidos", errors: error.errors });
    } else {
      console.error("🔴 [Fee Withdrawal Backend] Error interno:", error);
      res.status(500).json({ message: "Error interno del servidor", error: error.message });
    }
  }
});

// Actualizar retiro de fee (admin)
router.patch("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const validatedData = updateFeeWithdrawalSchema.parse({ ...req.body, id });
    
    const withdrawal = await storage.updateFeeWithdrawal(id, validatedData);
    
    if (!withdrawal) {
      return res.status(404).json({ message: "Retiro de fee no encontrado" });
    }
    
    res.json(withdrawal);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: "Datos inválidos", errors: error.errors });
    } else {
      console.error("Error al actualizar retiro de fee:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  }
});

// Eliminar retiro de fee (admin)
router.delete("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const success = await storage.deleteFeeWithdrawal(id);
    
    if (!success) {
      return res.status(404).json({ message: "Retiro de fee no encontrado" });
    }
    
    res.json({ message: "Retiro de fee eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar retiro de fee:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

export { router as feeWithdrawalsRoutes };