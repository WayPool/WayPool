import { 
  users, 
  type User, 
  type InsertUser,
  positionPreferences,
  type PositionPreferences,
  type InsertPositionPreferences,
  positionHistory,
  type PositionHistory,
  type InsertPositionHistory,
  customPools,
  type CustomPool,
  type InsertCustomPool,
  supportTickets,
  type SupportTicket,
  type InsertSupportTicket,
  ticketMessages,
  type TicketMessage,
  type InsertTicketMessage,
  managedNfts,
  type ManagedNft,
  type InsertManagedNft,
  invoices,
  type Invoice,
  type InsertInvoice,
  billingProfiles,
  type BillingProfile,
  type InsertBillingProfile,
  appConfig,
  type AppConfig,
  type InsertAppConfig,
  referrals,
  type Referral,
  type InsertReferral,
  referredUsers,
  type ReferredUser,
  type InsertReferredUser,
  passwordRecoveryTokens,
  type PasswordRecoveryToken,
  type InsertPasswordRecoveryToken,
  referralSubscribers,
  type ReferralSubscriber,
  type InsertReferralSubscriber,
  feeWithdrawals,
  type FeeWithdrawal,
  type InsertFeeWithdrawal,
  type UpdateFeeWithdrawal,
  legalSignatures,
  type LegalSignature,
  type InsertLegalSignature
} from "@shared/schema";

import {
  realPositions,
  type RealPosition,
  type InsertRealPosition
} from "@shared/real-positions-schema";
import { db } from './production-db';
import { eq, sql, desc, asc, and, or, isNull, count } from 'drizzle-orm';

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  // Posiciones - funciones para actualizar estados
  getPosition(id: number): Promise<PositionHistory | undefined>;
  getPositionHistoryById(id: number): Promise<PositionHistory | undefined>;
  updatePositionHistoryStatus(id: number, status: string): Promise<PositionHistory | undefined>;
  updatePositionFeeCollectionStatus(id: number, status: string): Promise<PositionHistory | undefined>;
  
  // Pasword recovery operations
  getUserByEmail(email: string): Promise<User | undefined>;
  savePasswordRecoveryToken(userId: number, data: { token: string, expiresAt: Date, used: boolean }): Promise<boolean>;
  getPasswordRecoveryByToken(token: string): Promise<{ userId: number, token: string, expiresAt: Date, used: boolean } | undefined>;
  markRecoveryTokenAsUsed(token: string): Promise<boolean>;
  updateUserPassword(userId: number, newPassword: string): Promise<boolean>;
  
  // Managed NFTs operations
  getManagedNfts(): Promise<ManagedNft[]>;
  getManagedNftById(id: number): Promise<ManagedNft | null>;
  getManagedNftByTokenId(tokenId: string, network: string): Promise<ManagedNft | null>;
  createManagedNft(data: InsertManagedNft): Promise<ManagedNft>;
  updateManagedNft(id: number, data: Partial<InsertManagedNft>): Promise<ManagedNft | null>;
  deleteManagedNft(id: number): Promise<boolean>;
  getManagedNftsFromPositionHistory(walletAddress: string): Promise<ManagedNft[]>;
  getManagedNftsByWalletAddress(walletAddress: string): Promise<ManagedNft[]>;
  
  // Stats operations
  getAverageAPR(): Promise<number>;
  
  // Position History operations
  getAllPositionHistory(): Promise<PositionHistory[]>;
  getUserPositionHistory(walletAddress: string): Promise<PositionHistory[]>;
  
  // Referral subscribers operations
  getReferralSubscriber(id: number): Promise<ReferralSubscriber | undefined>;
  getReferralSubscriberByEmail(email: string): Promise<ReferralSubscriber | undefined>;
  getAllReferralSubscribers(): Promise<ReferralSubscriber[]>;
  createReferralSubscriber(subscriber: InsertReferralSubscriber): Promise<ReferralSubscriber>;
  updateReferralSubscriber(id: number, data: Partial<ReferralSubscriber>): Promise<ReferralSubscriber | undefined>;
  deleteReferralSubscriber(id: number): Promise<boolean>;
  
  // Referrals operations
  getReferral(id: number): Promise<Referral | undefined>;
  getReferralByCode(referralCode: string): Promise<Referral | undefined>;
  getReferralByEmail(email: string): Promise<Referral | undefined>;
  getReferralsByWalletAddress(walletAddress: string): Promise<Referral[]>;
  createReferral(referral: InsertReferral): Promise<Referral>;
  updateReferral(id: number, data: Partial<Referral>): Promise<Referral | undefined>;
  generateReferralCode(walletAddress: string): Promise<string>;
  
  // Referred users operations
  getReferredUser(id: number): Promise<ReferredUser | undefined>;
  getReferredUserByWalletAddress(walletAddress: string): Promise<ReferredUser | undefined>;
  getReferredUsersByReferralId(referralId: number): Promise<ReferredUser[]>;
  createReferredUser(referredUser: InsertReferredUser): Promise<ReferredUser>;
  updateReferredUser(id: number, userData: Partial<ReferredUser>): Promise<ReferredUser | undefined>;
  updateReferredUserRewards(id: number, earnedAmount: number): Promise<ReferredUser | undefined>;
  
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByWalletAddress(walletAddress: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<User>): Promise<User | undefined>;
  updateUserByWalletAddress(walletAddress: string, user: Partial<User>): Promise<User | undefined>;
  updateUserEmail(walletAddress: string, email: string): Promise<User | undefined>;
  updateUserPassword(id: number, newPassword: string): Promise<boolean>;
  deleteUser(id: number): Promise<boolean>;
  deleteUserByWalletAddress(walletAddress: string): Promise<boolean>;
  getAllAdmins(): Promise<User[]>;
  getAllUsers(): Promise<User[]>;
  
  // Position preferences operations
  getPositionPreferences(id: number): Promise<PositionPreferences | undefined>;
  getPositionPreferencesByWalletAddress(walletAddress: string): Promise<PositionPreferences | undefined>;
  createPositionPreferences(preferences: InsertPositionPreferences): Promise<PositionPreferences>;
  updatePositionPreferences(id: number, preferences: Partial<PositionPreferences>): Promise<PositionPreferences | undefined>;
  
  // Position history operations
  getPositionHistory(id: number): Promise<PositionHistory | undefined>;
  getPositionHistoryByWalletAddress(walletAddress: string): Promise<PositionHistory[]>;
  getPositionHistoryByNFTTokenId(tokenId: string): Promise<PositionHistory[]>;
  getLatestPositionHistoryByRealPositionId(realPositionId: number): Promise<PositionHistory | undefined>;
  getAllPositionHistory(): Promise<PositionHistory[]>;
  createPositionHistory(history: InsertPositionHistory): Promise<PositionHistory>;
  updatePositionHistory(id: number, history: Partial<PositionHistory>): Promise<PositionHistory | undefined>;
  deletePositionHistory(id: number): Promise<boolean>;
  collectFees(positionId: number, amount: number): Promise<PositionHistory | undefined>;
  
  // Custom pools operations
  getAllCustomPools(): Promise<CustomPool[]>;
  getActiveCustomPools(): Promise<CustomPool[]>;
  getCustomPoolByAddress(address: string, network?: string): Promise<CustomPool | undefined>;
  createCustomPool(pool: InsertCustomPool): Promise<CustomPool>;
  updateCustomPool(id: number, pool: Partial<CustomPool>): Promise<CustomPool | undefined>;
  deleteCustomPool(id: number): Promise<boolean>;
  
  // Support tickets operations
  getSupportTicket(id: number): Promise<SupportTicket | undefined>;
  getSupportTicketByNumber(ticketNumber: string): Promise<SupportTicket | undefined>;
  getSupportTicketsByWalletAddress(walletAddress: string): Promise<SupportTicket[]>;
  getAllSupportTickets(): Promise<SupportTicket[]>;
  getOpenSupportTickets(): Promise<SupportTicket[]>;
  createSupportTicket(ticket: InsertSupportTicket): Promise<SupportTicket>;
  updateSupportTicket(id: number, ticket: Partial<SupportTicket>): Promise<SupportTicket | undefined>;
  deleteSupportTicket(id: number): Promise<boolean>;
  
  // Ticket messages operations
  getTicketMessages(ticketId: number): Promise<TicketMessage[]>;
  createTicketMessage(message: InsertTicketMessage): Promise<TicketMessage>;
  deleteTicketMessage(id: number): Promise<boolean>;
  
  // Real Uniswap positions operations
  getRealPosition(id: number): Promise<RealPosition | undefined>;
  getRealPositionByTokenId(tokenId: string): Promise<RealPosition | undefined>;
  getRealPositionsByWalletAddress(walletAddress: string): Promise<RealPosition[]>;
  getRealPositionsByVirtualPositionId(virtualPositionId: number): Promise<RealPosition[]>;
  getAllRealPositions(): Promise<RealPosition[]>;
  createRealPosition(position: InsertRealPosition): Promise<RealPosition>;
  updateRealPosition(id: number, position: Partial<InsertRealPosition>): Promise<RealPosition | undefined>;
  deleteRealPosition(id: number): Promise<boolean>;
  
  // Invoices operations
  getInvoice(id: number): Promise<Invoice | undefined>;
  getInvoiceByNumber(invoiceNumber: string): Promise<Invoice | undefined>;
  getInvoicesByWalletAddress(walletAddress: string): Promise<Invoice[]>;
  getInvoicesByPositionId(positionId: number): Promise<Invoice[]>;
  getAllInvoices(): Promise<Invoice[]>;
  createInvoice(invoice: InsertInvoice): Promise<Invoice>;
  updateInvoice(id: number, invoice: Partial<Invoice>): Promise<Invoice | undefined>;
  deleteInvoice(id: number): Promise<boolean>;
  generateInvoiceNumber(): Promise<string>;

  // Billing profiles operations
  getBillingProfile(id: number): Promise<BillingProfile | undefined>;
  getBillingProfileByWalletAddress(walletAddress: string): Promise<BillingProfile | undefined>;
  getAllBillingProfiles(): Promise<BillingProfile[]>;
  createBillingProfile(profile: InsertBillingProfile): Promise<BillingProfile>;
  updateBillingProfile(id: number, profile: Partial<BillingProfile>): Promise<BillingProfile | undefined>;
  updateBillingProfileByWalletAddress(walletAddress: string, profile: Partial<BillingProfile>): Promise<BillingProfile | undefined>;
  deleteBillingProfile(id: number): Promise<boolean>;
  verifyBillingProfile(id: number, txHash: string): Promise<BillingProfile | undefined>;
  
  // App config operations
  getAppConfigByKey(key: string): Promise<AppConfig | undefined>;
  getAllAppConfig(): Promise<AppConfig[]>;
  createAppConfig(config: InsertAppConfig): Promise<AppConfig>;
  updateAppConfig(key: string, value: string): Promise<AppConfig | undefined>;
  deleteAppConfig(id: number): Promise<boolean>;

  // Password recovery operations
  savePasswordRecoveryToken(userId: number, recoveryData: {token: string, expiresAt: Date, used: boolean}): Promise<boolean>;
  getPasswordRecoveryByToken(token: string): Promise<{userId: number, token: string, expiresAt: Date, used: boolean} | undefined>;
  markRecoveryTokenAsUsed(token: string): Promise<boolean>;
  
  // NFT operations for position history
  getUserPositionHistory(walletAddress: string): Promise<PositionHistory[]>;
  getManagedNftsFromPositionHistory(walletAddress: string): Promise<ManagedNft[]>;
  
  // Fee withdrawals operations
  getFeeWithdrawal(id: number): Promise<FeeWithdrawal | undefined>;
  getAllFeeWithdrawals(): Promise<FeeWithdrawal[]>;
  getFeeWithdrawalsWithUserEmail(): Promise<Array<FeeWithdrawal & { userEmail: string | null }>>;
  getFeeWithdrawalsByWalletAddress(walletAddress: string): Promise<FeeWithdrawal[]>;
  getFeeWithdrawalsByStatus(status: string): Promise<FeeWithdrawal[]>;
  getTotalWithdrawnByPosition(walletAddress: string, identifier: string): Promise<string>;
  createFeeWithdrawal(withdrawal: InsertFeeWithdrawal): Promise<FeeWithdrawal>;
  updateFeeWithdrawal(id: number, withdrawal: Partial<UpdateFeeWithdrawal>): Promise<FeeWithdrawal | undefined>;
  deleteFeeWithdrawal(id: number): Promise<boolean>;

  // Legal signatures operations
  getAllLegalSignatures(): Promise<LegalSignature[]>;
  getLegalSignaturesByWalletAddress(walletAddress: string): Promise<LegalSignature[]>;
  createLegalSignature(signature: InsertLegalSignature): Promise<LegalSignature>;
  getUsersLegalStatus(): Promise<Array<{
    walletAddress: string;
    email: string | null;
    termsAccepted: boolean;
    privacyAccepted: boolean;
    disclaimerAccepted: boolean;
    allAccepted: boolean;
    lastSignatureDate: string | null;
    signatureCount: number;
  }>>;
  checkUserLegalAcceptance(walletAddress: string): Promise<{
    termsAccepted: boolean;
    privacyAccepted: boolean;
    disclaimerAccepted: boolean;
    allAccepted: boolean;
  }>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private positionPreferences: Map<number, PositionPreferences>;
  private positionHistories: Map<number, PositionHistory>;
  private customPoolsMap: Map<number, CustomPool>;
  private supportTicketsMap: Map<number, SupportTicket>;
  private ticketMessagesMap: Map<number, TicketMessage>;
  private realPositionsMap: Map<number, RealPosition>;
  private invoicesMap: Map<number, Invoice>;
  private billingProfilesMap: Map<number, BillingProfile>;
  private appConfigMap: Map<number, AppConfig>;
  private referralsMap: Map<number, Referral>;
  private referredUsersMap: Map<number, ReferredUser>;
  private managedNftsMap: Map<number, ManagedNft>;
  private referralSubscribersMap: Map<number, ReferralSubscriber>;
  private passwordRecoveryMap: Map<string, {userId: number, token: string, expiresAt: Date, used: boolean}>;
  private userId: number;
  private preferenceId: number;
  private historyId: number;
  private poolId: number;
  private ticketId: number;
  private messageId: number;
  private realPositionId: number;
  private invoiceId: number;
  private billingProfileId: number;
  private appConfigId: number;
  private referralId: number;
  private referredUserId: number;
  private managedNftId: number;
  private referralSubscriberId: number;
  
  // Stub method for MemStorage - not used in production (uses DatabaseStorage instead)
  async getFeeWithdrawalsWithUserEmail(): Promise<Array<FeeWithdrawal & { userEmail: string | null }>> {
    // MemStorage is not used in production - return empty array for interface compliance
    console.warn('[MemStorage] getFeeWithdrawalsWithUserEmail called - this is a stub implementation');
    return [];
  }
  
  // Implementación de los métodos faltantes para cumplir con IStorage
  async updateBillingProfileByWalletAddress(walletAddress: string, profile: Partial<BillingProfile>): Promise<BillingProfile | undefined> {
    try {
      // Normalizar la dirección de la wallet
      const normalizedWalletAddress = walletAddress.toLowerCase();
      
      // Buscar el perfil por dirección de wallet
      let billingProfile: BillingProfile | undefined;
      for (const profile of this.billingProfilesMap.values()) {
        if (profile.walletAddress.toLowerCase() === normalizedWalletAddress) {
          billingProfile = profile;
          break;
        }
      }
      
      if (!billingProfile) {
        return undefined;
      }
      
      // Actualizar el perfil
      const updatedProfile: BillingProfile = {
        ...billingProfile,
        ...profile,
        updatedAt: new Date()
      };
      
      // Si se está actualizando la dirección de wallet, asegurarse de normalizarla
      if (profile.walletAddress) {
        updatedProfile.walletAddress = profile.walletAddress.toLowerCase();
      }
      
      this.billingProfilesMap.set(billingProfile.id, updatedProfile);
      return updatedProfile;
    } catch (error) {
      console.error(`Error al actualizar perfil por wallet ${walletAddress}:`, error);
      throw error;
    }
  }
  
  async deleteBillingProfile(id: number): Promise<boolean> {
    if (!this.billingProfilesMap.has(id)) {
      return false;
    }
    
    return this.billingProfilesMap.delete(id);
  }
  
  async verifyBillingProfile(id: number, txHash: string): Promise<BillingProfile | undefined> {
    const profile = this.billingProfilesMap.get(id);
    if (!profile) return undefined;
    
    const verifiedProfile = {
      ...profile,
      verificationStatus: "Verified",
      verificationTimestamp: new Date(),
      verificationHash: txHash,
      verificationTxHash: txHash,
      updatedAt: new Date()
    };
    
    this.billingProfilesMap.set(id, verifiedProfile);
    return verifiedProfile;
  }

  // Managed NFTs operations
  async getManagedNfts(): Promise<ManagedNft[]> {
    return Array.from(this.managedNftsMap.values());
  }
  
  async getUserPositionHistory(walletAddress: string): Promise<PositionHistory[]> {
    const normalizedAddress = walletAddress.toLowerCase();
    return Array.from(this.positionHistories.values())
      .filter(history => history.walletAddress.toLowerCase() === normalizedAddress)
      .sort((a, b) => {
        // Ordenar por fecha de creación descendente (más recientes primero)
        const dateA = a.timestamp ? new Date(a.timestamp).getTime() : 0;
        const dateB = b.timestamp ? new Date(b.timestamp).getTime() : 0;
        return dateB - dateA;
      });
  }
  
  async getManagedNftsFromPositionHistory(walletAddress: string): Promise<ManagedNft[]> {
    try {
      const normalizedAddress = walletAddress.toLowerCase();
      
      // Obtener las posiciones del usuario
      const positions = await this.getUserPositionHistory(normalizedAddress);
      
      console.log(`[MemStorage] Obtenidas ${positions.length} posiciones en position_history para ${normalizedAddress}`);
      
      if (positions.length === 0) {
        return [];
      }
      
      // Extraer tokenIds y networks de las posiciones
      const positionTokenIds = positions
        .filter(p => p.nftTokenId || p.tokenId)
        .map(p => {
          return {
            tokenId: p.nftTokenId || p.tokenId || '',
            network: p.network || 'ethereum',
            status: p.status || 'Unknown'
          };
        });
      
      console.log(`[MemStorage] Extrayendo información de ${positionTokenIds.length} tokens de position_history`);
      
      // Para cada token ID, buscar si existe un NFT administrado o crear uno virtual
      const managedNfts: ManagedNft[] = [];
      
      for (const { tokenId, network, status } of positionTokenIds) {
        if (!tokenId) continue;
        
        // Verificar si ya existe en managed_nfts
        const existingNft = await this.getManagedNftByTokenId(tokenId, network);
        
        if (existingNft) {
          managedNfts.push(existingNft);
        } else {
          // Buscar la posición correspondiente
          const position = positions.find(p => 
            (p.nftTokenId === tokenId || p.tokenId === tokenId) && 
            (p.network || 'ethereum') === network
          );
          
          if (position) {
            // Crear un NFT virtual basado en la posición
            const virtualNft: ManagedNft = {
              id: -1, // ID negativo para indicar que es virtual
              network: network,
              tokenId: tokenId,
              version: 'V3', // Default para NFTs virtuales
              contractAddress: position.contractAddress || '',
              token0Symbol: position.token0 || 'Unknown',
              token1Symbol: position.token1 || 'Unknown',
              valueUsdc: position.depositedUSDC || '0',
              feeTier: position.fee || '',
              poolAddress: position.poolAddress || '',
              imageUrl: '',
              status: status || 'Unknown',
              additionalData: {},
              createdAt: new Date(),
              updatedAt: new Date(),
              createdBy: 'system'
            };
            
            managedNfts.push(virtualNft);
          }
        }
      }
      
      console.log(`[MemStorage] Encontrados ${managedNfts.length} NFTs administrados a través de position_history para ${normalizedAddress}`);
      return managedNfts;
    } catch (error) {
      console.error(`[MemStorage] Error al obtener NFTs desde position_history para ${walletAddress}:`, error);
      return [];
    }
  }
  
  async getManagedNftsByWalletAddress(walletAddress: string): Promise<ManagedNft[]> {
    try {
      const normalizedAddress = walletAddress.toLowerCase();
      console.log(`[MemStorage] Buscando NFTs administrados directamente para wallet: ${normalizedAddress}`);
      
      // Filtrar NFTs basados en la propiedad additionalData que puede contener el owner
      const userNfts = Array.from(this.managedNftsMap.values()).filter(nft => {
        if (!nft.additionalData) return false;
        
        try {
          // La propiedad additionalData puede ser un string JSON o un objeto
          let additionalData: any;
          if (typeof nft.additionalData === 'string') {
            additionalData = JSON.parse(nft.additionalData);
          } else {
            additionalData = nft.additionalData;
          }
          
          // Comprobar si el propietario en additionalData coincide con la dirección del wallet
          const isOwner = (
            (additionalData.owner && additionalData.owner.toLowerCase() === normalizedAddress) ||
            (additionalData.ownerAddress && additionalData.ownerAddress.toLowerCase() === normalizedAddress)
          );
          
          if (isOwner) {
            console.log(`[MemStorage] NFT ${nft.id} (token ${nft.tokenId}) pertenece a ${normalizedAddress} según additionalData`);
          }
          
          return isOwner;
        } catch (err) {
          console.error(`[MemStorage] Error al analizar additionalData para NFT ${nft.id}:`, err);
          return false;
        }
      });
      
      console.log(`[MemStorage] Encontrados ${userNfts.length} NFTs administrados para ${normalizedAddress} según additionalData`);
      return userNfts;
    } catch (error) {
      console.error(`[MemStorage] Error al obtener NFTs administrados para wallet ${walletAddress}:`, error);
      return [];
    }
  }
  
  async getManagedNftById(id: number): Promise<ManagedNft | null> {
    const nft = this.managedNftsMap.get(id);
    return nft || null;
  }
  
  async getManagedNftByTokenId(tokenId: string, network: string): Promise<ManagedNft | null> {
    try {
      const nft = Array.from(this.managedNftsMap.values()).find(
        nft => nft.tokenId === tokenId && nft.network === network
      );
      return nft || null;
    } catch (error) {
      console.error(`Error al obtener NFT gestionado con token ID ${tokenId} en network ${network}:`, error);
      return null;
    }
  }
  
  async createManagedNft(data: InsertManagedNft): Promise<ManagedNft> {
    const id = this.managedNftId++;
    const now = new Date();
    const newNft = {
      ...data,
      id,
      createdAt: now,
      updatedAt: now
    } as ManagedNft;
    
    this.managedNftsMap.set(id, newNft);
    return newNft;
  }
  
  async updateManagedNft(id: number, data: Partial<InsertManagedNft>): Promise<ManagedNft | null> {
    const nft = this.managedNftsMap.get(id);
    if (!nft) return null;
    
    const updatedNft = {
      ...nft,
      ...data,
      updatedAt: new Date()
    } as ManagedNft;
    
    this.managedNftsMap.set(id, updatedNft);
    return updatedNft;
  }
  
  async deleteManagedNft(id: number): Promise<boolean> {
    return this.managedNftsMap.delete(id);
  }

  // Password recovery operations
  async getUserByEmail(email: string): Promise<User | undefined> {
    const normalizedEmail = email.toLowerCase();
    return Array.from(this.users.values()).find(
      user => user.email && user.email.toLowerCase() === normalizedEmail
    );
  }

  async updateUserPassword(userId: number, newPassword: string): Promise<boolean> {
    try {
      const user = this.users.get(userId);
      if (!user) {
        console.error(`Usuario no encontrado con ID: ${userId}`);
        return false;
      }
      
      const updatedUser = {
        ...user,
        password: newPassword,
        updatedAt: new Date()
      };
      
      this.users.set(userId, updatedUser);
      return true;
    } catch (error) {
      console.error(`Error actualizando contraseña para usuario ${userId}:`, error);
      return false;
    }
  }

  async savePasswordRecoveryToken(userId: number, data: {token: string, expiresAt: Date, used: boolean}): Promise<boolean> {
    try {
      this.passwordRecoveryMap.set(data.token, {
        userId,
        token: data.token,
        expiresAt: data.expiresAt,
        used: data.used
      });
      return true;
    } catch (error) {
      console.error("Error al guardar token de recuperación:", error);
      return false;
    }
  }

  async getPasswordRecoveryByToken(token: string): Promise<{userId: number, token: string, expiresAt: Date, used: boolean} | undefined> {
    const recovery = this.passwordRecoveryMap.get(token);
    if (!recovery) return undefined;
    
    return {
      userId: recovery.userId,
      token: recovery.token,
      expiresAt: recovery.expiresAt,
      used: recovery.used
    };
  }

  async markRecoveryTokenAsUsed(token: string): Promise<boolean> {
    try {
      const recovery = this.passwordRecoveryMap.get(token);
      if (!recovery) {
        console.error(`Token de recuperación no encontrado: ${token}`);
        return false;
      }
      
      recovery.used = true;
      this.passwordRecoveryMap.set(token, recovery);
      return true;
    } catch (error) {
      console.error(`Error al marcar token ${token} como usado:`, error);
      return false;
    }
  }

  constructor() {
    this.users = new Map();
    this.positionPreferences = new Map();
    this.positionHistories = new Map();
    this.customPoolsMap = new Map();
    this.supportTicketsMap = new Map();
    this.ticketMessagesMap = new Map();
    this.realPositionsMap = new Map();
    this.invoicesMap = new Map();
    this.billingProfilesMap = new Map();
    this.appConfigMap = new Map();
    this.referralsMap = new Map();
    this.referredUsersMap = new Map();
    this.managedNftsMap = new Map();
    this.referralSubscribersMap = new Map();
    this.passwordRecoveryMap = new Map();
    this.userId = 1;
    this.preferenceId = 1;
    this.historyId = 1;
    this.poolId = 1;
    this.ticketId = 1;
    this.messageId = 1;
    this.realPositionId = 1;
    this.invoiceId = 1;
    this.billingProfileId = 1;
    this.appConfigId = 1;
    this.referralId = 1;
    this.referredUserId = 1;
    this.managedNftId = 1;
    this.referralSubscriberId = 1;
    
    // Crear usuario administrador por defecto
    this.createDefaultAdmin();
    
    // Crear algunos pools personalizados de ejemplo
    this.createExamplePools();
  }
  
  // Stats operations
  async getAverageAPR(): Promise<number> {
    try {
      // Obtener todas las posiciones reales
      const positions = Array.from(this.realPositionsMap.values());
      
      // Si no hay posiciones, devolver un valor base de 61.64%
      if (positions.length === 0) {
        return 61.64;
      }
      
      // Utilizamos un valor fijo de 61.64% para todas las posiciones
      // Esto se corresponde con el APR real en la plataforma
      return 61.64;
    } catch (error) {
      console.error("Error al calcular el APR promedio:", error);
      return 61.64;
    }
  }
  
  // Obtener todas las posiciones históricas para admin
  async getAllPositionHistory(): Promise<PositionHistory[]> {
    try {
      // Consulta directa desde la base de datos para obtener todas las posiciones
      const result = await db
        .select()
        .from(positionHistory)
        .execute();
      
      return result;
    } catch (error) {
      console.error("Error al obtener todas las posiciones históricas:", error);
      return [];
    }
  }

  // Referrals operations
  async getReferral(id: number): Promise<Referral | undefined> {
    return this.referralsMap.get(id);
  }
  
  async getReferralByCode(referralCode: string): Promise<Referral | undefined> {
    return Array.from(this.referralsMap.values()).find(
      referral => referral.referralCode === referralCode
    );
  }
  
  // Implementación de getReferralByEmail
  async getReferralByEmail(email: string): Promise<Referral | undefined> {
    if (!email) return undefined;
    
    const normalizedEmail = email.toLowerCase();
    return Array.from(this.referralsMap.values()).find(
      referral => referral.hasOwnProperty('email') && referral.email && referral.email.toLowerCase() === normalizedEmail
    );
  }
  
  // Referral subscribers operations
  async getReferralSubscriber(id: number): Promise<ReferralSubscriber | undefined> {
    return this.referralSubscribersMap.get(id);
  }

  async getReferralSubscriberByEmail(email: string): Promise<ReferralSubscriber | undefined> {
    if (!email) return undefined;
    
    const normalizedEmail = email.toLowerCase();
    return Array.from(this.referralSubscribersMap.values()).find(
      subscriber => subscriber.email.toLowerCase() === normalizedEmail
    );
  }

  async getAllReferralSubscribers(): Promise<ReferralSubscriber[]> {
    return Array.from(this.referralSubscribersMap.values());
  }

  async createReferralSubscriber(subscriber: InsertReferralSubscriber): Promise<ReferralSubscriber> {
    const id = this.referralSubscriberId++;
    const now = new Date();
    
    // Normalizar el email a minúsculas
    const normalizedEmail = subscriber.email.toLowerCase();
    
    const newSubscriber = {
      ...subscriber,
      id,
      email: normalizedEmail,
      createdAt: now,
      updatedAt: now
    } as ReferralSubscriber;
    
    this.referralSubscribersMap.set(id, newSubscriber);
    return newSubscriber;
  }

  async updateReferralSubscriber(id: number, data: Partial<ReferralSubscriber>): Promise<ReferralSubscriber | undefined> {
    const subscriber = this.referralSubscribersMap.get(id);
    if (!subscriber) return undefined;
    
    // Si se actualiza el email, normalizarlo a minúsculas
    if (data.email) {
      data.email = data.email.toLowerCase();
    }
    
    const updatedSubscriber = {
      ...subscriber,
      ...data,
      updatedAt: new Date()
    } as ReferralSubscriber;
    
    this.referralSubscribersMap.set(id, updatedSubscriber);
    return updatedSubscriber;
  }

  async deleteReferralSubscriber(id: number): Promise<boolean> {
    return this.referralSubscribersMap.delete(id);
  }
  
  async getReferralsByWalletAddress(walletAddress: string): Promise<Referral[]> {
    return Array.from(this.referralsMap.values())
      .filter(referral => referral.walletAddress.toLowerCase() === walletAddress.toLowerCase());
  }
  
  async createReferral(referral: InsertReferral): Promise<Referral> {
    const id = this.referralId++;
    const now = new Date();
    const newReferral = {
      ...referral,
      id,
      createdAt: now,
      updatedAt: now
    } as Referral;
    
    this.referralsMap.set(id, newReferral);
    return newReferral;
  }
  
  async updateReferral(id: number, data: Partial<Referral>): Promise<Referral | undefined> {
    const referral = this.referralsMap.get(id);
    if (!referral) return undefined;
    
    // Si hay una dirección de wallet, asegurarse de que esté en minúsculas
    if (data.walletAddress) {
      data.walletAddress = data.walletAddress.toLowerCase();
    }
    
    const updatedReferral = {
      ...referral,
      ...data,
      updatedAt: new Date()
    } as Referral;
    
    this.referralsMap.set(id, updatedReferral);
    return updatedReferral;
  }
  
  async generateReferralCode(walletAddress: string): Promise<string> {
    // Generar un código único usando la dirección de wallet y un timestamp
    const timestamp = Date.now().toString(36);
    const addressPart = walletAddress.slice(2, 8).toLowerCase();
    const randomPart = Math.random().toString(36).substring(2, 6);
    return `${addressPart}-${randomPart}-${timestamp}`;
  }
  
  // Referred users operations
  async getReferredUser(id: number): Promise<ReferredUser | undefined> {
    return this.referredUsersMap.get(id);
  }
  
  async getReferredUserByWalletAddress(walletAddress: string): Promise<ReferredUser | undefined> {
    return Array.from(this.referredUsersMap.values()).find(
      user => user.referredWalletAddress.toLowerCase() === walletAddress.toLowerCase()
    );
  }
  
  async getReferredUsersByReferralId(referralId: number): Promise<ReferredUser[]> {
    return Array.from(this.referredUsersMap.values())
      .filter(user => user.referralId === referralId && user.status === "active");
  }
  
  /**
   * Cuenta el número de usuarios referidos para un referral específico
   * 
   * Implementación para MemStorage que devuelve un conteo de usuarios 
   * que coinciden con el ID de referido proporcionado y tienen estado activo.
   */
  async countReferredUsersByReferralId(referralId: number): Promise<number> {
    try {
      console.log(`MemStorage: Contando referidos para referralId ${referralId}`);
      const users = Array.from(this.referredUsersMap.values())
        .filter(user => user.referralId === referralId && user.status === "active");
      
      console.log(`MemStorage: Encontrados ${users.length} usuarios referidos activos`);
      return users.length;
    } catch (error) {
      console.error(`Error al contar referidos para referralId ${referralId} en MemStorage:`, error);
      return 0;
    }
  }
  
  async createReferredUser(referredUser: InsertReferredUser): Promise<ReferredUser> {
    const id = this.referredUserId++;
    const now = new Date();
    const newReferredUser = {
      ...referredUser,
      id,
      joinedAt: now,
      earnedRewards: referredUser.earnedRewards || "0",
      aprBoost: referredUser.aprBoost || "1.01" // 1% de incremento en APR por defecto
    } as ReferredUser;
    
    this.referredUsersMap.set(id, newReferredUser);
    return newReferredUser;
  }
  
  async updateReferredUser(id: number, userData: Partial<ReferredUser>): Promise<ReferredUser | undefined> {
    const user = this.referredUsersMap.get(id);
    if (!user) return undefined;
    
    const updatedUser = {
      ...user,
      ...userData
    } as ReferredUser;
    
    this.referredUsersMap.set(id, updatedUser);
    return updatedUser;
  }
  
  async updateReferredUserRewards(id: number, earnedAmount: number): Promise<ReferredUser | undefined> {
    const user = this.referredUsersMap.get(id);
    if (!user) return undefined;
    
    // Manejo seguro de posibles valores nulos
    const earnedRewardsStr = user.earnedRewards ? user.earnedRewards.toString() : "0";
    const currentRewards = parseFloat(earnedRewardsStr || "0");
    const newRewards = currentRewards + earnedAmount;
    
    const updatedUser = {
      ...user,
      earnedRewards: newRewards.toString()
    } as ReferredUser;
    
    this.referredUsersMap.set(id, updatedUser);
    return updatedUser;
  }
  
  private createExamplePools() {
    // Pool de ETH-DAI (0.05%)
    this.customPoolsMap.set(1, {
      id: 1,
      name: "ETH-DAI",
      address: "0x60594a405d53811d3bc4766596efd80fd545a270",
      feeTier: 500,
      token0Address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
      token0Symbol: "ETH",
      token0Name: "Ethereum",
      token0Decimals: 18,
      token1Address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
      token1Symbol: "DAI",
      token1Name: "Dai Stablecoin",
      token1Decimals: 18,
      active: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      networkId: 1,
      networkName: "Ethereum",
      network: "ethereum",
      createdBy: "system"
    } as CustomPool);
    
    // Pool de USDT-ETH (0.30%)
    this.customPoolsMap.set(2, {
      id: 2,
      name: "USDT-ETH",
      address: "0x4e68ccd3e89f51c3074ca5072bbac773960dfa36",
      feeTier: 3000,
      token0Address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
      token0Symbol: "USDT",
      token0Name: "Tether USD",
      token0Decimals: 6,
      token1Address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
      token1Symbol: "ETH",
      token1Name: "Ethereum",
      token1Decimals: 18,
      active: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      networkId: 1,
      networkName: "Ethereum",
      network: "ethereum",
      createdBy: "system"
    } as CustomPool);
    
    // Pool de DAI-MATIC (0.30%) en Polygon
    this.customPoolsMap.set(3, {
      id: 3,
      name: "DAI-MATIC",
      address: "0xfe530931da161232ec76a7c3bea7d36cf3811a0d",
      feeTier: 3000,
      token0Address: "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
      token0Symbol: "DAI",
      token0Name: "Dai Stablecoin (Polygon)",
      token0Decimals: 18,
      token1Address: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
      token1Symbol: "MATIC",
      token1Name: "Polygon",
      token1Decimals: 18,
      active: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      networkId: 137,
      networkName: "Polygon",
      network: "polygon",
      createdBy: "system"
    } as CustomPool);
    
    this.poolId = 4; // Actualizar el contador
  }
  
  private createDefaultAdmin() {
    const adminWallet = "0x6b22cEB508db3C81d69ED6451d63B56a1fb7271F";
    
    // Verificar si ya existe un usuario con esta wallet
    const existingUser = Array.from(this.users.values()).find(
      user => user.walletAddress.toLowerCase() === adminWallet.toLowerCase()
    );
    
    if (existingUser) {
      // Si existe, asegurarse de que sea admin
      if (!existingUser.isAdmin) {
        existingUser.isAdmin = true;
        this.users.set(existingUser.id, existingUser);
        console.log(`Usuario existente ${adminWallet} actualizado como admin`);
      }
    } else {
      // Crear nuevo usuario admin
      const admin: User = {
        id: this.userId++,
        walletAddress: adminWallet,
        theme: "system",
        defaultNetwork: "ethereum",
        isAdmin: true,
        createdAt: new Date(),
        updatedAt: new Date()
      } as User;
      
      this.users.set(admin.id, admin);
      console.log(`Usuario admin creado para ${adminWallet}`);
    }
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByWalletAddress(walletAddress: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.walletAddress.toLowerCase() === walletAddress.toLowerCase()
    );
  }

  async createUser(user: InsertUser): Promise<User> {
    const id = this.userId++;
    const now = new Date();
    const newUser = { 
      ...user, 
      id, 
      createdAt: now, 
      updatedAt: now 
    } as User;
    this.users.set(id, newUser);
    return newUser;
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser: User = {
      ...user,
      ...userData,
      updatedAt: new Date()
    };
    
    this.users.set(id, updatedUser);
    return updatedUser;
  }
  
  async updateUserByWalletAddress(walletAddress: string, userData: Partial<User>): Promise<User | undefined> {
    const user = await this.getUserByWalletAddress(walletAddress);
    if (!user) return undefined;
    
    return this.updateUser(user.id, userData);
  }
  
  async getAllAdmins(): Promise<User[]> {
    return Array.from(this.users.values()).filter(user => user.isAdmin);
  }
  
  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }
  
  async deleteUser(id: number): Promise<boolean> {
    if (!this.users.has(id)) {
      return false;
    }
    
    return this.users.delete(id);
  }
  
  async deleteUserByWalletAddress(walletAddress: string): Promise<boolean> {
    const user = await this.getUserByWalletAddress(walletAddress);
    if (!user) return false;
    
    return this.deleteUser(user.id);
  }

  // Position preferences operations
  async getPositionPreferences(id: number): Promise<PositionPreferences | undefined> {
    return this.positionPreferences.get(id);
  }

  async getPositionPreferencesByWalletAddress(walletAddress: string): Promise<PositionPreferences | undefined> {
    return Array.from(this.positionPreferences.values()).find(
      (pref) => pref.walletAddress.toLowerCase() === walletAddress.toLowerCase()
    );
  }

  async createPositionPreferences(preferences: InsertPositionPreferences): Promise<PositionPreferences> {
    const id = this.preferenceId++;
    const now = new Date();
    const newPreferences = {
      ...preferences,
      id,
      createdAt: now,
      updatedAt: now
    } as PositionPreferences;
    this.positionPreferences.set(id, newPreferences);
    return newPreferences;
  }

  async updatePositionPreferences(id: number, preferencesData: Partial<PositionPreferences>): Promise<PositionPreferences | undefined> {
    const preferences = this.positionPreferences.get(id);
    if (!preferences) return undefined;
    
    const updatedPreferences: PositionPreferences = {
      ...preferences,
      ...preferencesData,
      updatedAt: new Date()
    };
    
    this.positionPreferences.set(id, updatedPreferences);
    return updatedPreferences;
  }

  // Position history operations
  async getPositionHistory(id: number): Promise<PositionHistory | undefined> {
    return this.positionHistories.get(id);
  }

  async getPositionHistoryByWalletAddress(walletAddress: string): Promise<PositionHistory[]> {
    return Array.from(this.positionHistories.values()).filter(
      (history) => history.walletAddress.toLowerCase() === walletAddress.toLowerCase()
    );
  }
  
  async getPositionHistoryByNFTTokenId(tokenId: string): Promise<PositionHistory[]> {
    return Array.from(this.positionHistories.values()).filter(
      (history) => history.nftTokenId === tokenId
    );
  }
  
  async getLatestPositionHistoryByRealPositionId(realPositionId: number): Promise<PositionHistory | undefined> {
    try {
      // Primero obtenemos la posición real para tener access a wallet y tokenId
      const realPosition = await this.getRealPosition(realPositionId);
      
      if (!realPosition || !realPosition.walletAddress) {
        console.log(`No se encontró posición real con ID ${realPositionId} o falta wallet_address`);
        return undefined;
      }
      
      // Filtrar historiales de posición que coincidan con wallet_address
      const positionHistories = Array.from(this.positionHistories.values())
        .filter((history) => 
          history.walletAddress.toLowerCase() === realPosition.walletAddress.toLowerCase()
        );
      
      // Si hay tokenId en ambas tablas, filtrar también por tokenId
      let matchingHistories = positionHistories;
      if (realPosition.tokenId) {
        matchingHistories = positionHistories.filter(
          (history) => history.tokenId === realPosition.tokenId
        );
        
        // Si no hay coincidencias exactas por tokenId, usar todos los historiales encontrados por wallet
        if (matchingHistories.length === 0) {
          matchingHistories = positionHistories;
        }
      }
      
      // Ordenar por timestamp descendente y tomar el primero
      const latestHistory = matchingHistories.sort((a, b) => {
        const dateA = a.timestamp ? new Date(a.timestamp).getTime() : 0;
        const dateB = b.timestamp ? new Date(b.timestamp).getTime() : 0;
        return dateB - dateA; // Orden descendente
      })[0];
      
      if (latestHistory) {
        console.log(`Encontrado historial ${latestHistory.id} para posición real ${realPositionId}`);
        return latestHistory;
      } else {
        console.log(`No se encontró historial para posición real ${realPositionId}`);
        return undefined;
      }
    } catch (error) {
      console.error(`Error getting position history for real position ${realPositionId}:`, error);
      return undefined;
    }
  }

  async createPositionHistory(history: InsertPositionHistory): Promise<PositionHistory> {
    const id = this.historyId++;
    const now = new Date();
    const newHistory = {
      ...history,
      id,
      timestamp: now,
      data: history.data || null
    } as PositionHistory;
    this.positionHistories.set(id, newHistory);
    return newHistory;
  }
  
  async updatePositionHistory(id: number, historyData: Partial<PositionHistory>): Promise<PositionHistory | undefined> {
    const history = this.positionHistories.get(id);
    if (!history) return undefined;
    
    const updatedHistory = {
      ...history,
      ...historyData,
    } as PositionHistory;
    
    this.positionHistories.set(id, updatedHistory);
    return updatedHistory;
  }
  
  async deletePositionHistory(id: number): Promise<boolean> {
    const exists = this.positionHistories.has(id);
    if (!exists) return false;
    
    this.positionHistories.delete(id);
    return true;
  }
  
  async collectFees(positionId: number, amount: number): Promise<PositionHistory | undefined> {
    try {
      // Obtenemos la posición actual
      const position = this.positionHistories.get(positionId);
      if (!position) {
        console.error(`Posición ${positionId} no encontrada`);
        return undefined;
      }
      
      // Calculamos el total de fees colectados (sumando los actuales)
      const totalFeesCollected = parseFloat(position.totalFeesCollected?.toString() || "0") + parseFloat(amount.toString());
      
      // Actualizamos la posición con nuevos valores
      const updatedPosition = {
        ...position,
        feesEarned: "0", // Reiniciamos a 0 los fees mostrados en la posición
        startDate: new Date(), // Actualizamos la fecha de inicio para el cálculo de nuevos fees
        totalFeesCollected: totalFeesCollected.toString(), // Mantenemos un registro del total acumulado histórico
        feesCollected: (parseFloat(position.feesCollected?.toString() || "0") + parseFloat(amount.toString())).toString(), // Incrementamos el contador de fees recolectados
      } as PositionHistory;
      
      // Guardamos la posición actualizada
      this.positionHistories.set(positionId, updatedPosition);
      
      return updatedPosition;
    } catch (error) {
      console.error(`Error al recolectar fees para la posición ${positionId}:`, error);
      return undefined;
    }
  }
  
  // Custom pools operations
  async getAllCustomPools(): Promise<CustomPool[]> {
    return Array.from(this.customPoolsMap.values());
  }
  
  async getActiveCustomPools(): Promise<CustomPool[]> {
    return Array.from(this.customPoolsMap.values()).filter(
      pool => pool.active
    );
  }
  
  async getCustomPoolByAddress(address: string, network: string = 'ethereum'): Promise<CustomPool | undefined> {
    return Array.from(this.customPoolsMap.values()).find(
      pool => pool.address.toLowerCase() === address.toLowerCase() && 
        (!network || pool.network === network || pool.networkName.toLowerCase() === network.toLowerCase())
    );
  }
  
  async createCustomPool(pool: InsertCustomPool): Promise<CustomPool> {
    const id = this.poolId++;
    const now = new Date();
    const newPool = {
      ...pool,
      id,
      createdAt: now,
      updatedAt: now,
      active: pool.active ?? true
    } as CustomPool;
    this.customPoolsMap.set(id, newPool);
    return newPool;
  }
  
  async updateCustomPool(id: number, poolData: Partial<CustomPool>): Promise<CustomPool | undefined> {
    const pool = this.customPoolsMap.get(id);
    if (!pool) return undefined;
    
    const updatedPool = {
      ...pool,
      ...poolData,
      updatedAt: new Date()
    } as CustomPool;
    
    this.customPoolsMap.set(id, updatedPool);
    return updatedPool;
  }
  
  async deleteCustomPool(id: number): Promise<boolean> {
    const pool = this.customPoolsMap.get(id);
    if (!pool) return false;
    
    // Soft delete by marking as inactive
    const updatedPool = {
      ...pool,
      active: false,
      updatedAt: new Date()
    } as CustomPool;
    
    this.customPoolsMap.set(id, updatedPool);
    return true;
  }
  
  // Support tickets operations
  async getSupportTicket(id: number): Promise<SupportTicket | undefined> {
    return this.supportTicketsMap.get(id);
  }

  async getSupportTicketByNumber(ticketNumber: string): Promise<SupportTicket | undefined> {
    return Array.from(this.supportTicketsMap.values()).find(
      ticket => ticket.ticketNumber === ticketNumber
    );
  }

  async getSupportTicketsByWalletAddress(walletAddress: string): Promise<SupportTicket[]> {
    return Array.from(this.supportTicketsMap.values())
      .filter(ticket => 
        ticket.walletAddress.toLowerCase() === walletAddress.toLowerCase() && 
        !ticket.isDeleted
      )
      .sort((a, b) => {
        return new Date(b.updatedAt || b.createdAt || 0).getTime() - 
               new Date(a.updatedAt || a.createdAt || 0).getTime();
      });
  }

  async getAllSupportTickets(): Promise<SupportTicket[]> {
    return Array.from(this.supportTicketsMap.values())
      .filter(ticket => !ticket.isDeleted)
      .sort((a, b) => {
        return new Date(b.updatedAt || b.createdAt || 0).getTime() - 
               new Date(a.updatedAt || a.createdAt || 0).getTime();
      });
  }

  async getOpenSupportTickets(): Promise<SupportTicket[]> {
    return Array.from(this.supportTicketsMap.values())
      .filter(ticket => 
        ticket.status !== 'closed' && 
        !ticket.isDeleted
      )
      .sort((a, b) => {
        return new Date(b.updatedAt || b.createdAt || 0).getTime() - 
               new Date(a.updatedAt || a.createdAt || 0).getTime();
      });
  }

  async createSupportTicket(ticket: InsertSupportTicket): Promise<SupportTicket> {
    const id = this.ticketId++;
    const now = new Date();
    
    // Generar número de ticket único (formato: WB-YYYYMMDD-XXX)
    const date = new Date();
    const dateStr = date.getFullYear().toString() +
      (date.getMonth() + 1).toString().padStart(2, '0') +
      date.getDate().toString().padStart(2, '0');
    
    // Obtener el último número de ticket para determinar el siguiente
    const existingTickets = Array.from(this.supportTicketsMap.values())
      .filter(t => t.ticketNumber && t.ticketNumber.startsWith(`WB-${dateStr}-`))
      .sort((a, b) => b.id - a.id);
    
    let nextNumber = 1;
    if (existingTickets.length > 0) {
      const lastTicket = existingTickets[0];
      const parts = lastTicket.ticketNumber.split('-');
      if (parts.length === 3) {
        const lastNumber = parseInt(parts[2]);
        if (!isNaN(lastNumber)) {
          nextNumber = lastNumber + 1;
        }
      }
    }
    
    const ticketNumber = `WB-${dateStr}-${nextNumber.toString().padStart(3, '0')}`;
    
    const newTicket = {
      ...ticket,
      id,
      ticketNumber,
      walletAddress: ticket.walletAddress.toLowerCase(),
      createdAt: now,
      updatedAt: now,
      isDeleted: false
    } as SupportTicket;
    
    this.supportTicketsMap.set(id, newTicket);
    return newTicket;
  }

  async updateSupportTicket(id: number, ticketData: Partial<SupportTicket>): Promise<SupportTicket | undefined> {
    const ticket = this.supportTicketsMap.get(id);
    if (!ticket) return undefined;
    
    // Si se está cerrando el ticket, establecer la fecha de cierre
    if (ticketData.status === 'closed') {
      ticketData.closedAt = new Date();
    }
    
    const updatedTicket: SupportTicket = {
      ...ticket,
      ...ticketData,
      updatedAt: new Date()
    };
    
    this.supportTicketsMap.set(id, updatedTicket);
    return updatedTicket;
  }

  async deleteSupportTicket(id: number): Promise<boolean> {
    const ticket = this.supportTicketsMap.get(id);
    if (!ticket) return false;
    
    // Eliminación lógica
    const updatedTicket = {
      ...ticket,
      isDeleted: true,
      updatedAt: new Date()
    } as SupportTicket;
    
    this.supportTicketsMap.set(id, updatedTicket);
    return true;
  }

  // Ticket messages operations
  async getTicketMessages(ticketId: number): Promise<TicketMessage[]> {
    return Array.from(this.ticketMessagesMap.values())
      .filter(message => message.ticketId === ticketId && !message.isDeleted)
      .sort((a, b) => {
        return new Date(a.createdAt || 0).getTime() - 
               new Date(b.createdAt || 0).getTime();
      });
  }

  async createTicketMessage(message: InsertTicketMessage): Promise<TicketMessage> {
    const id = this.messageId++;
    const now = new Date();
    
    const newMessage = {
      ...message,
      id,
      createdAt: now,
      isDeleted: false
    } as TicketMessage;
    
    // Actualizar la fecha de actualización del ticket
    const ticket = this.supportTicketsMap.get(message.ticketId);
    if (ticket) {
      const updatedTicket = {
        ...ticket,
        updatedAt: now
      } as SupportTicket;
      this.supportTicketsMap.set(message.ticketId, updatedTicket);
    }
    
    this.ticketMessagesMap.set(id, newMessage);
    return newMessage;
  }

  async deleteTicketMessage(id: number): Promise<boolean> {
    const message = this.ticketMessagesMap.get(id);
    if (!message) return false;
    
    // Eliminación lógica
    const updatedMessage = {
      ...message,
      isDeleted: true
    } as TicketMessage;
    
    this.ticketMessagesMap.set(id, updatedMessage);
    return true;
  }

  // Real Uniswap positions operations
  async getRealPosition(id: number): Promise<RealPosition | undefined> {
    return this.realPositionsMap.get(id);
  }
  
  async getRealPositionByTokenId(tokenId: string): Promise<RealPosition | undefined> {
    return Array.from(this.realPositionsMap.values()).find(
      position => position.tokenId === tokenId
    );
  }

  async getRealPositionsByWalletAddress(walletAddress: string): Promise<RealPosition[]> {
    return Array.from(this.realPositionsMap.values())
      .filter(position => position.walletAddress.toLowerCase() === walletAddress.toLowerCase())
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getRealPositionsByVirtualPositionId(virtualPositionId: number): Promise<RealPosition[]> {
    return Array.from(this.realPositionsMap.values())
      .filter(position => position.virtualPositionId === virtualPositionId.toString())
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
  
  async getAllRealPositions(): Promise<RealPosition[]> {
    return Array.from(this.realPositionsMap.values())
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async createRealPosition(position: InsertRealPosition): Promise<RealPosition> {
    const id = this.realPositionId++;
    const now = new Date();
    const newPosition = {
      ...position,
      id,
      createdAt: now,
      updatedAt: now
    } as RealPosition;
    
    this.realPositionsMap.set(id, newPosition);
    return newPosition;
  }

  async updateRealPosition(id: number, positionData: Partial<InsertRealPosition>): Promise<RealPosition | undefined> {
    const position = this.realPositionsMap.get(id);
    if (!position) return undefined;
    
    const updatedPosition = {
      ...position,
      ...positionData,
      updatedAt: new Date()
    } as RealPosition;
    
    this.realPositionsMap.set(id, updatedPosition);
    return updatedPosition;
  }

  async deleteRealPosition(id: number): Promise<boolean> {
    if (!this.realPositionsMap.has(id)) return false;
    
    this.realPositionsMap.delete(id);
    return true;
  }
  
  // Invoices operations
  async getInvoice(id: number): Promise<Invoice | undefined> {
    return this.invoicesMap.get(id);
  }
  
  async getInvoiceByNumber(invoiceNumber: string): Promise<Invoice | undefined> {
    return Array.from(this.invoicesMap.values()).find(
      invoice => invoice.invoiceNumber === invoiceNumber
    );
  }
  
  async getInvoicesByWalletAddress(walletAddress: string): Promise<Invoice[]> {
    return Array.from(this.invoicesMap.values())
      .filter(invoice => invoice.walletAddress.toLowerCase() === walletAddress.toLowerCase())
      .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
  }
  
  async getInvoicesByPositionId(positionId: number): Promise<Invoice[]> {
    return Array.from(this.invoicesMap.values())
      .filter(invoice => invoice.positionId === positionId)
      .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
  }
  
  async getAllInvoices(): Promise<Invoice[]> {
    return Array.from(this.invoicesMap.values())
      .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
  }
  
  async createInvoice(invoice: InsertInvoice): Promise<Invoice> {
    const id = this.invoiceId++;
    const now = new Date();
    
    // Si no se proporciona un número de factura, generarlo
    if (!invoice.invoiceNumber) {
      invoice.invoiceNumber = await this.generateInvoiceNumber();
    }
    
    const newInvoice = {
      ...invoice,
      id,
      createdAt: now,
      updatedAt: now,
      issueDate: invoice.issueDate || now
    } as Invoice;
    
    this.invoicesMap.set(id, newInvoice);
    return newInvoice;
  }
  
  async updateInvoice(id: number, invoiceData: Partial<Invoice>): Promise<Invoice | undefined> {
    const invoice = this.invoicesMap.get(id);
    if (!invoice) return undefined;
    
    // Procesar los datos de la factura
    let processedData: any = { ...invoiceData };
    
    // Si se está actualizando el estado a "Paid", establecer paidDate
    if (processedData.status === 'Paid' && !processedData.paidDate) {
      processedData.paidDate = new Date();
    }
    
    // Convertir fechas de strings a objetos Date si es necesario
    if (processedData.issueDate && typeof processedData.issueDate === 'string') {
      processedData.issueDate = new Date(processedData.issueDate);
    }
    
    if (processedData.dueDate && typeof processedData.dueDate === 'string') {
      processedData.dueDate = new Date(processedData.dueDate);
    }
    
    if (processedData.paidDate && typeof processedData.paidDate === 'string') {
      processedData.paidDate = new Date(processedData.paidDate);
    }
    
    const updatedInvoice = {
      ...invoice,
      ...processedData,
      updatedAt: new Date()
    } as Invoice;
    
    this.invoicesMap.set(id, updatedInvoice);
    return updatedInvoice;
  }
  
  async deleteInvoice(id: number): Promise<boolean> {
    if (!this.invoicesMap.has(id)) return false;
    
    this.invoicesMap.delete(id);
    return true;
  }
  
  async generateInvoiceNumber(): Promise<string> {
    const date = new Date();
    const year = date.getFullYear().toString();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    
    // Formato: INV-YYYY-MM-XXXXX
    const prefix = `INV-${year}-${month}-`;
    
    // Buscar la última factura con este prefijo para determinar el siguiente número
    const existingInvoices = Array.from(this.invoicesMap.values())
      .filter(inv => inv.invoiceNumber && inv.invoiceNumber.startsWith(prefix))
      .sort((a, b) => {
        // Extraer el número secuencial y ordenar de mayor a menor
        const numA = parseInt(a.invoiceNumber.substring(prefix.length) || '0');
        const numB = parseInt(b.invoiceNumber.substring(prefix.length) || '0');
        return numB - numA;
      });
    
    let nextNumber = 1;
    if (existingInvoices.length > 0) {
      const lastInvoice = existingInvoices[0];
      const lastNumber = parseInt(lastInvoice.invoiceNumber.substring(prefix.length) || '0');
      if (!isNaN(lastNumber)) {
        nextNumber = lastNumber + 1;
      }
    }
    
    return `${prefix}${nextNumber.toString().padStart(5, '0')}`;
  }
  
  // Billing profiles operations
  async getBillingProfile(id: number): Promise<BillingProfile | undefined> {
    try {
      const [profile] = await db
        .select()
        .from(billingProfiles)
        .where(eq(billingProfiles.id, id));
      
      return profile;
    } catch (error) {
      console.error("Error al obtener perfil de facturación:", error);
      throw error;
    }
  }
  
  async getBillingProfileByWalletAddress(walletAddress: string): Promise<BillingProfile | undefined> {
    try {
      const normalizedAddress = walletAddress.toLowerCase();
      
      const [profile] = await db
        .select()
        .from(billingProfiles)
        .where(eq(billingProfiles.walletAddress, normalizedAddress));
      
      return profile;
    } catch (error) {
      console.error("Error al obtener perfil de facturación por wallet:", error);
      throw error;
    }
  }
  
  async getAllBillingProfiles(): Promise<BillingProfile[]> {
    try {
      const profiles = await db
        .select()
        .from(billingProfiles)
        .orderBy(asc(billingProfiles.fullName));
      
      return profiles;
    } catch (error) {
      console.error("Error al obtener todos los perfiles de facturación:", error);
      return [];
    }
  }
  
  async createBillingProfile(profile: InsertBillingProfile): Promise<BillingProfile> {
    try {
      // Normalizar dirección de wallet a minúsculas
      const normalizedData = {
        ...profile,
        walletAddress: profile.walletAddress.toLowerCase(),
      };
      
      const [newProfile] = await db
        .insert(billingProfiles)
        .values({
          ...normalizedData,
          verificationStatus: "Pending",
          createdAt: new Date(),
          updatedAt: new Date()
        })
        .returning();
      
      return newProfile;
    } catch (error) {
      console.error("Error al crear perfil de facturación:", error);
      throw error;
    }
  }
  
  async updateBillingProfile(id: number, profileData: Partial<BillingProfile>): Promise<BillingProfile | undefined> {
    try {
      // Si se actualiza la dirección de wallet, normalizarla a minúsculas
      const normalizedData = { ...profileData };
      if (normalizedData.walletAddress) {
        normalizedData.walletAddress = normalizedData.walletAddress.toLowerCase();
      }
      
      const [updatedProfile] = await db
        .update(billingProfiles)
        .set({
          ...normalizedData,
          updatedAt: new Date()
        })
        .where(eq(billingProfiles.id, id))
        .returning();
      
      return updatedProfile;
    } catch (error) {
      console.error(`Error al actualizar perfil de facturación ${id}:`, error);
      throw error;
    }
  }
  
  // Este método está duplicado más abajo con una implementación más actual
  // Por favor, usa el método definido en las líneas 1212+ que tiene un manejo mejorado de los campos
  
  // Este método está duplicado más abajo con una implementación más actual
  // Por favor, usa el método definido en las líneas 1238+ que tiene un manejo mejorado de los errores
  
  // Este método está duplicado más abajo con una implementación más actual
  // Por favor, usa el método definido en las líneas 1242+ que tiene un manejo mejorado del esquema de BD

  // Métodos para AppConfig
  async getAppConfigByKey(key: string): Promise<AppConfig | undefined> {
    for (const config of this.appConfigMap.values()) {
      if (config.key === key) {
        return config;
      }
    }
    return undefined;
  }

  async getAllAppConfig(): Promise<AppConfig[]> {
    return Array.from(this.appConfigMap.values());
  }

  async createAppConfig(config: InsertAppConfig): Promise<AppConfig> {
    const id = ++this.appConfigId;
    const now = new Date();
    
    const newConfig: AppConfig = {
      id,
      ...config,
      createdAt: now,
      updatedAt: now
    };
    
    this.appConfigMap.set(id, newConfig);
    return newConfig;
  }

  async updateAppConfig(key: string, value: string): Promise<AppConfig | undefined> {
    let configToUpdate: AppConfig | undefined;
    
    // Encontrar la configuración por su clave
    for (const config of this.appConfigMap.values()) {
      if (config.key === key) {
        configToUpdate = config;
        break;
      }
    }
    
    if (!configToUpdate) {
      return undefined;
    }
    
    // Actualizar el valor y la fecha
    const updatedConfig: AppConfig = {
      ...configToUpdate,
      value,
      updatedAt: new Date()
    };
    
    this.appConfigMap.set(configToUpdate.id, updatedConfig);
    return updatedConfig;
  }

  async deleteAppConfig(id: number): Promise<boolean> {
    if (!this.appConfigMap.has(id)) {
      return false;
    }
    
    return this.appConfigMap.delete(id);
  }
}

// Exportar la instancia de almacenamiento predeterminada

// Extender el tipo DatabaseStorage para incluir los métodos de recuperación de contraseña
interface DatabaseStoragePasswordRecovery {
  getUserByEmail(email: string): Promise<User | undefined>;
  savePasswordRecoveryToken(userId: number, data: {token: string, expiresAt: Date, used: boolean}): Promise<boolean>;
  getPasswordRecoveryByToken(token: string): Promise<{userId: number, token: string, expiresAt: Date, used: boolean} | undefined>;
  getAllRecoveryTokensForUser(userId: number): Promise<{userId: number, token: string, expiresAt: Date, used: boolean}[]>;
  markRecoveryTokenAsUsed(token: string): Promise<boolean>;
  updateUserPassword(userId: number, newPassword: string): Promise<boolean>;
}

export class DatabaseStorage implements IStorage, DatabaseStoragePasswordRecovery {
  // Implementación de funciones para actualizar estados de posiciones
  async getPosition(id: number): Promise<PositionHistory | undefined> {
    try {
      const result = await db
        .select()
        .from(positionHistory)
        .where(eq(positionHistory.id, id))
        .limit(1);
      
      return result.length > 0 ? result[0] : undefined;
    } catch (error) {
      console.error("Error al obtener posición por ID:", error);
      return undefined;
    }
  }

  async getPositionHistoryById(id: number): Promise<PositionHistory | undefined> {
    try {
      const result = await db
        .select()
        .from(positionHistory)
        .where(eq(positionHistory.id, id))
        .limit(1);
      
      return result.length > 0 ? result[0] : undefined;
    } catch (error) {
      console.error("Error al obtener posición por ID:", error);
      return undefined;
    }
  }
  
  async updatePositionHistoryStatus(id: number, status: string): Promise<PositionHistory | undefined> {
    try {
      const updatedRows = await db
        .update(positionHistory)
        .set({ status })
        .where(eq(positionHistory.id, id))
        .returning();
      
      return updatedRows.length > 0 ? updatedRows[0] : undefined;
    } catch (error) {
      console.error("Error al actualizar estado de posición:", error);
      return undefined;
    }
  }

  /**
   * Actualiza el estado de una transacción de recolección de tarifas y procesa
   * la recolección si el estado cambia a "Active"
   * @param id ID de la posición
   * @param status Nuevo estado (Active, Pending, Finalized, Closed)
   * @returns Posición actualizada o undefined si hay error
   */
  async updatePositionFeeCollectionStatus(id: number, status: string): Promise<PositionHistory | undefined> {
    try {
      // Primero obtener la posición actual para conocer su estado y saldo de fees
      const position = await this.getPositionHistory(id);
      if (!position) {
        throw new Error(`Posición ${id} no encontrada`);
      }
      
      // Si se activa la transacción, se realiza un proceso similar a collectFees
      if (status === "Active") {
        console.log(`Activando recolección de tarifas para posición ${id}`);
        
        // Obtener la cantidad de tarifas acumuladas
        const feesAmount = parseFloat(position.feesEarned?.toString() || "0");
        
        if (feesAmount <= 0) {
          console.warn(`No hay tarifas para recolectar en la posición ${id}`);
        }
        
        // Calcular el total histórico de tarifas recolectadas
        const totalFeesCollected = parseFloat(position.totalFeesCollected?.toString() || "0") + feesAmount;
        
        // Actualizar la posición con los nuevos valores
        const updateData = {
          feeCollectionStatus: status,
          feesEarned: "0", // Reiniciamos las tarifas a 0
          startDate: new Date(), // Actualizamos la fecha de inicio para cálculos futuros
          lastCollectionDate: new Date(), // Registramos la fecha de la recolección
          totalFeesCollected: totalFeesCollected.toString(), // Actualizamos el histórico
          feesCollected: (parseFloat(position.feesCollected?.toString() || "0") + feesAmount).toString(),
          updatedAt: new Date()
        };
        
        // Actualizar en la base de datos
        const [updatedPosition] = await db
          .update(positionHistory)
          .set(updateData)
          .where(eq(positionHistory.id, id))
          .returning();
        
        console.log(`Posición ${id} actualizada con estado de recolección ${status}. Tarifas reiniciadas: ${feesAmount} USDC, nuevo total histórico: ${totalFeesCollected} USDC`);
        
        return updatedPosition;
      } else {
        // Para otros estados, solo actualizar el estado de la recolección
        const [updatedPosition] = await db
          .update(positionHistory)
          .set({ 
            feeCollectionStatus: status,
            updatedAt: new Date()
          })
          .where(eq(positionHistory.id, id))
          .returning();
        
        console.log(`Actualizado estado de recolección de tarifas para posición ${id} a ${status}`);
        
        return updatedPosition;
      }
    } catch (error) {
      console.error(`Error al actualizar estado de recolección de tarifas para posición ${id}:`, error);
      return undefined;
    }
  }
  
  // Implementación para obtener las posiciones históricas de un usuario
  async getUserPositionHistory(walletAddress: string): Promise<PositionHistory[]> {
    return this.getPositionHistoryByWalletAddress(walletAddress);
  }

  // Referral subscribers operations
  async getReferralSubscriber(id: number): Promise<ReferralSubscriber | undefined> {
    try {
      const [result] = await db.select().from(referralSubscribers).where(eq(referralSubscribers.id, id));
      return result;
    } catch (error) {
      console.error(`Error al obtener suscriptor de referidos con ID ${id}:`, error);
      return undefined;
    }
  }

  async getReferralSubscriberByEmail(email: string): Promise<ReferralSubscriber | undefined> {
    try {
      // Normalizar el email a minúsculas
      const normalizedEmail = email.toLowerCase();
      
      const [result] = await db.select().from(referralSubscribers)
        .where(eq(referralSubscribers.email, normalizedEmail));
      
      return result;
    } catch (error) {
      console.error(`Error al obtener suscriptor por email ${email}:`, error);
      return undefined;
    }
  }

  async getAllReferralSubscribers(): Promise<ReferralSubscriber[]> {
    try {
      return await db.select().from(referralSubscribers);
    } catch (error) {
      console.error("Error al obtener todos los suscriptores de referidos:", error);
      return [];
    }
  }

  async createReferralSubscriber(subscriber: InsertReferralSubscriber): Promise<ReferralSubscriber> {
    try {
      // Normalizar el email a minúsculas
      const normalizedEmail = subscriber.email.toLowerCase();
      
      const [result] = await db.insert(referralSubscribers)
        .values({
          ...subscriber,
          email: normalizedEmail,
          createdAt: new Date(),
          updatedAt: new Date()
        })
        .returning();
      
      return result;
    } catch (error) {
      console.error("Error al crear suscriptor de referidos:", error);
      throw error;
    }
  }

  async updateReferralSubscriber(id: number, data: Partial<ReferralSubscriber>): Promise<ReferralSubscriber | undefined> {
    try {
      // Si se actualiza el email, normalizarlo a minúsculas
      if (data.email) {
        data.email = data.email.toLowerCase();
      }
      
      const [result] = await db.update(referralSubscribers)
        .set({
          ...data,
          updatedAt: new Date()
        })
        .where(eq(referralSubscribers.id, id))
        .returning();
      
      return result;
    } catch (error) {
      console.error(`Error al actualizar suscriptor de referidos ${id}:`, error);
      return undefined;
    }
  }

  async deleteReferralSubscriber(id: number): Promise<boolean> {
    try {
      await db.delete(referralSubscribers)
        .where(eq(referralSubscribers.id, id));
      
      return true;
    } catch (error) {
      console.error(`Error al eliminar suscriptor de referidos ${id}:`, error);
      return false;
    }
  }

  // Método para obtener un referral por email
  async getReferralByEmail(email: string): Promise<Referral | undefined> {
    try {
      if (!email) {
        console.warn("Se llamó a getReferralByEmail con un email vacío");
        return undefined;
      }
      
      // Normalizar el email a minúsculas
      const normalizedEmail = email.toLowerCase();
      
      // La columna email puede no existir en la tabla referrals,
      // así que buscaremos el usuario por email y luego su referral por wallet
      try {
        // Intenta encontrar el usuario por correo electrónico
        const user = await this.getUserByEmail(normalizedEmail);
        if (user && user.walletAddress) {
          // Si encuentra el usuario, busca el referral por su dirección de wallet
          const referrals = await this.getReferralsByWalletAddress(user.walletAddress);
          if (referrals && referrals.length > 0) {
            console.log(`Encontrado referral para email ${email} a través de wallet ${user.walletAddress}`);
            return referrals[0]; // Devolver el primer referral encontrado
          }
        }
      } catch (userError) {
        console.error(`Error al intentar buscar usuario por email:`, userError);
      }
      
      // Si no se encontró ningún referral, registramos y devolvemos undefined
      console.log(`No se encontró referral para el email ${email}`);
      return undefined;
    } catch (error) {
      console.error(`Error al obtener referral por email ${email}:`, error);
      return undefined;
    }
  }
  
  // Implementación para obtener todas las posiciones históricas para admin
  async getAllPositionHistory(): Promise<PositionHistory[]> {
    try {
      // Obtenemos todas las posiciones ordenadas por ID descedente (más recientes primero)
      const positions = await db
        .select()
        .from(positionHistory)
        .orderBy(desc(positionHistory.id));
      
      return positions;
    } catch (error) {
      console.error("Error al obtener todas las posiciones históricas:", error);
      return [];
    }
  }
  // Fee withdrawals operations
  async getFeeWithdrawal(id: number): Promise<FeeWithdrawal | undefined> {
    try {
      const [result] = await db.select()
        .from(feeWithdrawals)
        .where(eq(feeWithdrawals.id, id));
      return result;
    } catch (error) {
      console.error(`Error al obtener retiro de fee ${id}:`, error);
      return undefined;
    }
  }

  async getAllFeeWithdrawals(): Promise<FeeWithdrawal[]> {
    try {
      return await db.select()
        .from(feeWithdrawals)
        .orderBy(desc(feeWithdrawals.requestedAt));
    } catch (error) {
      console.error("Error al obtener todos los retiros de fees:", error);
      return [];
    }
  }

  async getFeeWithdrawalsWithUserEmail(): Promise<Array<FeeWithdrawal & { userEmail: string | null }>> {
    try {
      const results = await db.select({
        id: feeWithdrawals.id,
        walletAddress: feeWithdrawals.walletAddress,
        poolAddress: feeWithdrawals.poolAddress,
        poolName: feeWithdrawals.poolName,
        tokenPair: feeWithdrawals.tokenPair,
        amount: feeWithdrawals.amount,
        currency: feeWithdrawals.currency,
        status: feeWithdrawals.status,
        transactionHash: feeWithdrawals.transactionHash,
        requestedAt: feeWithdrawals.requestedAt,
        processedAt: feeWithdrawals.processedAt,
        processedBy: feeWithdrawals.processedBy,
        notes: feeWithdrawals.notes,
        network: feeWithdrawals.network,
        feeType: feeWithdrawals.feeType,
        aprBeforeWithdrawal: feeWithdrawals.aprBeforeWithdrawal,
        aprAfterWithdrawal: feeWithdrawals.aprAfterWithdrawal,
        aprPenaltyApplied: feeWithdrawals.aprPenaltyApplied,
        aprPenaltyAmount: feeWithdrawals.aprPenaltyAmount,
        userEmail: users.email
      })
      .from(feeWithdrawals)
      .leftJoin(users, sql`LOWER(${feeWithdrawals.walletAddress}) = LOWER(${users.walletAddress})`)
      .orderBy(desc(feeWithdrawals.requestedAt));
      
      return results;
    } catch (error) {
      console.error("Error al obtener retiros de fees con email de usuario:", error);
      return [];
    }
  }

  async getFeeWithdrawalsByWalletAddress(walletAddress: string): Promise<FeeWithdrawal[]> {
    try {
      return await db.select()
        .from(feeWithdrawals)
        .where(eq(feeWithdrawals.walletAddress, walletAddress))
        .orderBy(desc(feeWithdrawals.requestedAt));
    } catch (error) {
      console.error(`Error al obtener retiros de fees para wallet ${walletAddress}:`, error);
      return [];
    }
  }

  async getFeeWithdrawalsByStatus(status: string): Promise<FeeWithdrawal[]> {
    try {
      return await db.select()
        .from(feeWithdrawals)
        .where(eq(feeWithdrawals.status, status))
        .orderBy(desc(feeWithdrawals.requestedAt));
    } catch (error) {
      console.error(`Error al obtener retiros de fees con estado ${status}:`, error);
      return [];
    }
  }

  async createFeeWithdrawal(withdrawal: InsertFeeWithdrawal): Promise<FeeWithdrawal> {
    try {
      const [result] = await db.insert(feeWithdrawals)
        .values(withdrawal)
        .returning();
      return result;
    } catch (error) {
      console.error("Error al crear retiro de fee:", error);
      throw error;
    }
  }

  async updateFeeWithdrawal(id: number, withdrawal: Partial<UpdateFeeWithdrawal>): Promise<FeeWithdrawal | undefined> {
    try {
      const updateData: any = { ...withdrawal };
      
      // Si se actualiza el estado a confirmed o rejected, establecer processedAt
      if (withdrawal.status && withdrawal.status !== 'pending') {
        updateData.processedAt = new Date();
      }

      const [result] = await db.update(feeWithdrawals)
        .set(updateData)
        .where(eq(feeWithdrawals.id, id))
        .returning();
      
      return result;
    } catch (error) {
      console.error(`Error al actualizar retiro de fee ${id}:`, error);
      return undefined;
    }
  }

  async deleteFeeWithdrawal(id: number): Promise<boolean> {
    try {
      await db.delete(feeWithdrawals)
        .where(eq(feeWithdrawals.id, id));
      return true;
    } catch (error) {
      console.error(`Error al eliminar retiro de fee ${id}:`, error);
      return false;
    }
  }

  async getTotalWithdrawnByPosition(walletAddress: string, identifier: string): Promise<string> {
    try {
      const result = await db.select({
        total: sql<string>`COALESCE(SUM(CAST(amount AS DECIMAL)), 0)`
      })
      .from(feeWithdrawals)
      .where(
        and(
          eq(feeWithdrawals.walletAddress, walletAddress),
          or(
            eq(feeWithdrawals.poolAddress, identifier),
            eq(feeWithdrawals.tokenPair, identifier),
            eq(feeWithdrawals.poolName, identifier)
          ),
          eq(feeWithdrawals.status, 'confirmed') // Solo contar retiradas confirmadas
        )
      );
      
      return result[0]?.total || "0.00";
    } catch (error) {
      console.error(`Error al obtener total retirado para ${walletAddress} - ${identifier}:`, error);
      return "0.00";
    }
  }

  // ==================== LEGAL SIGNATURES OPERATIONS ====================

  async getAllLegalSignatures(): Promise<LegalSignature[]> {
    try {
      return await db.select()
        .from(legalSignatures)
        .orderBy(desc(legalSignatures.signatureDate));
    } catch (error) {
      console.error("Error al obtener firmas legales:", error);
      return [];
    }
  }

  async getLegalSignaturesByWalletAddress(walletAddress: string): Promise<LegalSignature[]> {
    try {
      return await db.select()
        .from(legalSignatures)
        .where(sql`LOWER(${legalSignatures.walletAddress}) = LOWER(${walletAddress})`)
        .orderBy(desc(legalSignatures.signatureDate));
    } catch (error) {
      console.error(`Error al obtener firmas legales de ${walletAddress}:`, error);
      return [];
    }
  }

  async createLegalSignature(signature: InsertLegalSignature): Promise<LegalSignature> {
    try {
      const [result] = await db.insert(legalSignatures)
        .values(signature)
        .returning();
      return result;
    } catch (error) {
      console.error("Error al crear firma legal:", error);
      throw error;
    }
  }

  async getUsersLegalStatus(): Promise<Array<{
    walletAddress: string;
    email: string | null;
    termsAccepted: boolean;
    privacyAccepted: boolean;
    disclaimerAccepted: boolean;
    allAccepted: boolean;
    lastSignatureDate: string | null;
    signatureCount: number;
  }>> {
    try {
      // Obtener todos los usuarios
      const allUsers = await db.select().from(users);
      
      // Obtener todas las firmas legales
      const allSignatures = await db.select().from(legalSignatures);
      
      // Construir el estado para cada usuario
      const statuses = allUsers.map(user => {
        const userSignatures = allSignatures.filter(
          s => s.walletAddress.toLowerCase() === user.walletAddress.toLowerCase()
        );
        
        const termsAccepted = userSignatures.some(s => s.documentType === 'terms_of_use');
        const privacyAccepted = userSignatures.some(s => s.documentType === 'privacy_policy');
        const disclaimerAccepted = userSignatures.some(s => s.documentType === 'disclaimer');
        
        const latestSignature = userSignatures.sort((a, b) => 
          new Date(b.signatureDate || 0).getTime() - new Date(a.signatureDate || 0).getTime()
        )[0];
        
        return {
          walletAddress: user.walletAddress,
          email: user.email || null,
          termsAccepted,
          privacyAccepted,
          disclaimerAccepted,
          allAccepted: termsAccepted && privacyAccepted && disclaimerAccepted,
          lastSignatureDate: latestSignature?.signatureDate?.toISOString() || null,
          signatureCount: userSignatures.length
        };
      });
      
      return statuses;
    } catch (error) {
      console.error("Error al obtener estados legales de usuarios:", error);
      return [];
    }
  }

  async checkUserLegalAcceptance(walletAddress: string): Promise<{
    termsAccepted: boolean;
    privacyAccepted: boolean;
    disclaimerAccepted: boolean;
    allAccepted: boolean;
  }> {
    try {
      const signatures = await this.getLegalSignaturesByWalletAddress(walletAddress);
      
      const termsAccepted = signatures.some(s => s.documentType === 'terms_of_use');
      const privacyAccepted = signatures.some(s => s.documentType === 'privacy_policy');
      const disclaimerAccepted = signatures.some(s => s.documentType === 'disclaimer');
      
      return {
        termsAccepted,
        privacyAccepted,
        disclaimerAccepted,
        allAccepted: termsAccepted && privacyAccepted && disclaimerAccepted
      };
    } catch (error) {
      console.error(`Error al verificar aceptación legal de ${walletAddress}:`, error);
      return {
        termsAccepted: false,
        privacyAccepted: false,
        disclaimerAccepted: false,
        allAccepted: false
      };
    }
  }

  // Managed NFTs operations
  async getManagedNfts(): Promise<ManagedNft[]> {
    try {
      return await db.select()
        .from(managedNfts)
        .orderBy(desc(managedNfts.createdAt));
    } catch (error) {
      console.error("Error al obtener NFTs administrados:", error);
      return [];
    }
  }
  
  async getManagedNftsFromPositionHistory(walletAddress: string): Promise<ManagedNft[]> {
    try {
      const normalized = walletAddress.toLowerCase();
      
      // Primero obtenemos las posiciones del usuario
      const positions = await db
        .select()
        .from(positionHistory)
        .where(sql`LOWER(${positionHistory.walletAddress}) = ${normalized}`);
      
      console.log(`Obtenidas ${positions.length} posiciones en position_history para ${normalized}`);
      
      if (positions.length === 0) {
        return [];
      }
      
      // Extraemos los tokenIds y networks de las posiciones
      const positionTokenIds = positions
        .filter(p => p.nftTokenId || p.tokenId) // Filtramos posiciones sin token ID
        .map(p => {
          return {
            tokenId: p.nftTokenId || p.tokenId,
            network: p.network || 'ethereum',
            status: p.status || 'Unknown'
          };
        });
      
      console.log(`Extrayendo información de ${positionTokenIds.length} tokens de position_history`);
      
      // Para cada token ID, buscamos el NFT administrado correspondiente
      const managedNfts: ManagedNft[] = [];
      
      for (const { tokenId, network, status } of positionTokenIds) {
        if (!tokenId) continue;
        
        // Primero verificamos si el NFT ya existe en la tabla managed_nfts
        const existingNft = await this.getManagedNftByTokenId(tokenId, network);
        
        if (existingNft) {
          // Si ya existe un NFT administrado, lo añadimos a la lista
          managedNfts.push(existingNft);
        } else {
          // Si no existe, creamos una versión temporal del NFT basada en la posición
          // Esto no se guarda en la base de datos, solo se usa para mostrar al usuario
          const position = positions.find(p => 
            (p.nftTokenId === tokenId || p.tokenId === tokenId) && 
            (p.network || 'ethereum') === network
          );
          
          if (position) {
            // Crear un "NFT virtual" basado en la información de la posición
            const virtualNft: ManagedNft = {
              id: -1, // ID negativo para indicar que es virtual
              network: network,
              tokenId: tokenId,
              version: position.version || 'V3',
              contractAddress: position.contractAddress || '',
              token0Symbol: position.token0 || 'Unknown',
              token1Symbol: position.token1 || 'Unknown',
              valueUsdc: position.valueUsdc || position.depositedUSDC || '0',
              feeTier: position.fee || '',
              poolAddress: position.poolAddress || '',
              imageUrl: '',
              status: status || 'Unknown',
              additionalData: {},
              createdAt: position.createdAt || new Date(),
              updatedAt: position.updatedAt || new Date(),
              createdBy: 'system'
            };
            
            managedNfts.push(virtualNft);
          }
        }
      }
      
      console.log(`Encontrados ${managedNfts.length} NFTs administrados a través de position_history para ${normalized}`);
      return managedNfts;
    } catch (error) {
      console.error(`Error al obtener NFTs desde position_history para ${walletAddress}:`, error);
      return [];
    }
  }

  async getManagedNftById(id: number): Promise<ManagedNft | null> {
    try {
      const result = await db.select()
        .from(managedNfts)
        .where(eq(managedNfts.id, id));
      
      return result.length > 0 ? result[0] : null;
    } catch (error) {
      console.error(`Error al obtener NFT administrado con ID ${id}:`, error);
      return null;
    }
  }
  
  async getManagedNftsByWalletAddress(walletAddress: string): Promise<ManagedNft[]> {
    try {
      const normalizedAddress = walletAddress.toLowerCase();
      console.log(`[NFT-STORAGE] Buscando NFTs administrados directamente para wallet: ${normalizedAddress}`);
      
      // Obtenemos todos los NFTs administrados
      const allManagedNfts = await this.getManagedNfts();
      console.log(`[NFT-STORAGE] Total de NFTs administrados en base de datos: ${allManagedNfts.length}`);
      
      // Filtrar NFTs basados en la propiedad additionalData que puede contener el owner
      const userNfts = allManagedNfts.filter(nft => {
        if (!nft.additionalData) return false;
        
        try {
          // La propiedad additionalData puede ser un string JSON o un objeto
          let additionalData: any;
          if (typeof nft.additionalData === 'string') {
            additionalData = JSON.parse(nft.additionalData);
          } else {
            additionalData = nft.additionalData;
          }
          
          // Comprobar si el propietario en additionalData coincide con la dirección del wallet
          const isOwner = (
            (additionalData.owner && additionalData.owner.toLowerCase() === normalizedAddress) ||
            (additionalData.ownerAddress && additionalData.ownerAddress.toLowerCase() === normalizedAddress)
          );
          
          if (isOwner) {
            console.log(`[NFT-STORAGE] NFT ${nft.id} (token ${nft.tokenId}) pertenece a ${normalizedAddress} según additionalData`);
          }
          
          return isOwner;
        } catch (err) {
          console.error(`[NFT-STORAGE] Error al analizar additionalData para NFT ${nft.id}:`, err);
          return false;
        }
      });
      
      console.log(`[NFT-STORAGE] Encontrados ${userNfts.length} NFTs administrados para ${normalizedAddress} según additionalData`);
      return userNfts;
    } catch (error) {
      console.error(`[NFT-STORAGE] Error al obtener NFTs administrados para wallet ${walletAddress}:`, error);
      return [];
    }
  }
  
  // Función para normalizar tokenIds (elimina ceros a la izquierda)
  private normalizeTokenId(id: string | undefined | null): string {
    if (!id) return '';
    return id.toString().replace(/^0+/, '');
  }
  
  // Función para manejar comparaciones de red con mayor flexibilidad
  private networksMatch(network1: string | undefined | null, network2: string | undefined | null): boolean {
    if (!network1 || !network2) return true;
    
    const net1 = network1.toLowerCase();
    const net2 = network2.toLowerCase();
    
    // Comparación directa
    if (net1 === net2) return true;
    
    // Comparaciones alternativas conocidas
    if ((net1 === 'ethereum' && net2 === 'mainnet') || 
        (net1 === 'mainnet' && net2 === 'ethereum')) {
      return true;
    }
      
    if ((net1 === 'polygon' && net2 === 'matic') || 
        (net1 === 'matic' && net2 === 'polygon')) {
      return true;
    }
      
    return false;
  }
  
  async getManagedNftByTokenId(tokenId: string, network: string): Promise<ManagedNft | null> {
    try {
      // Normalizar el tokenId para la búsqueda
      const normalizedTokenId = this.normalizeTokenId(tokenId);
      
      // Primero, intentamos búsqueda directa
      let result = await db.select()
        .from(managedNfts)
        .where(
          and(
            eq(managedNfts.tokenId, tokenId),
            eq(managedNfts.network, network)
          )
        );
      
      // Si encontramos un resultado directo, lo devolvemos
      if (result.length > 0) {
        console.log(`NFT encontrado con búsqueda directa para token ${tokenId} en red ${network}`);
        return result[0];
      }
      
      // Si no hay coincidencia directa, intentamos con normalización
      // Esto es más complejo para SQL, pero es necesario para mayor robustez
      console.log(`Buscando NFT con token normalizado ${normalizedTokenId} para original ${tokenId}`);
      
      // Obtenemos todos los NFTs para procesamiento local más flexible
      result = await db.select()
        .from(managedNfts);
      
      // Buscamos coincidencias con criterios flexibles
      const matchingNft = result.find(nft => {
        const dbTokenIdNormalized = this.normalizeTokenId(nft.tokenId);
        const networksMatch = this.networksMatch(nft.network, network);
        
        // Log de depuración
        if (dbTokenIdNormalized === normalizedTokenId) {
          console.log(`Posible coincidencia con ${nft.tokenId} (${dbTokenIdNormalized}), redes: ${nft.network}/${network} - coinciden: ${networksMatch}`);
        }
        
        return dbTokenIdNormalized === normalizedTokenId && networksMatch;
      });
      
      if (matchingNft) {
        console.log(`NFT encontrado con búsqueda flexible: ID ${matchingNft.id}, token ${matchingNft.tokenId} en red ${matchingNft.network}`);
        return matchingNft;
      }
      
      // Si no encontramos nada, devolvemos null
      return null;
    } catch (error) {
      console.error(`Error al obtener NFT administrado con token ID ${tokenId} en network ${network}:`, error);
      return null;
    }
  }

  async createManagedNft(data: InsertManagedNft): Promise<ManagedNft> {
    try {
      // First, fix the sequence if it's out of sync (common issue after restores/imports)
      try {
        await db.execute(sql`SELECT setval('managed_nfts_id_seq', COALESCE((SELECT MAX(id) FROM managed_nfts), 0))`);
      } catch (seqError) {
        console.warn("Could not fix managed_nfts sequence:", seqError);
      }

      const result = await db.insert(managedNfts).values({
        ...data,
        createdAt: new Date(),
        updatedAt: new Date()
      }).returning();

      console.log(`[Storage] Created managed NFT with ID: ${result[0].id}, tokenId: ${result[0].tokenId}`);
      return result[0];
    } catch (error: any) {
      // If duplicate key error, check if NFT already exists with same token_id
      if (error.message?.includes('duplicate key') || error.code === '23505') {
        console.warn(`[Storage] Duplicate key error, checking if NFT already exists with token_id: ${data.tokenId}`);
        const existing = await this.getManagedNftByTokenId(data.tokenId || '', data.network || 'polygon');
        if (existing) {
          console.log(`[Storage] Found existing NFT with token_id ${data.tokenId}, returning it`);
          return existing;
        }
      }
      console.error("Error al crear NFT administrado:", error);
      throw error;
    }
  }

  async updateManagedNft(id: number, data: Partial<InsertManagedNft>): Promise<ManagedNft | null> {
    try {
      console.log(`Actualizando NFT administrado ID=${id} con datos:`, data);
      
      // Primero obtenemos el NFT actual para tener todos los datos
      const currentNft = await db.select().from(managedNfts).where(eq(managedNfts.id, id)).limit(1);
      
      if (!currentNft || currentNft.length === 0) {
        console.log(`No se encontró el NFT con ID=${id} para actualizar`);
        return null;
      }
      
      // Actualizamos el NFT en la tabla managed_nfts
      const result = await db.update(managedNfts)
        .set({
          ...data,
          updatedAt: new Date()
        })
        .where(eq(managedNfts.id, id))
        .returning();
      
      // Si la actualización tuvo éxito y estamos cambiando el status a "Active"
      if (result.length > 0) {
        const updatedNft = result[0];
        console.log(`NFT actualizado correctamente. Resultado:`, updatedNft);
        
        // Si el status es "Active" y tenemos un valueUsdc, sincronizamos con position_history
        if (
          (data.status === "Active" || updatedNft.status === "Active") && 
          updatedNft.valueUsdc && 
          updatedNft.tokenId
        ) {
          try {
            // Buscamos si ya existe una entrada en position_history para este NFT
            // Búsqueda más robusta usando ambos campos tokenId y nftTokenId, y verificando la red
            const existingPositions = await db.select()
              .from(positionHistory)
              .where(
                or(
                  and(
                    eq(positionHistory.nftTokenId, updatedNft.tokenId),
                    eq(positionHistory.network, updatedNft.network || 'ethereum')
                  ),
                  and(
                    eq(positionHistory.tokenId, updatedNft.tokenId),
                    eq(positionHistory.network, updatedNft.network || 'ethereum')
                  )
                )
              )
              .limit(1);
            
            const now = new Date();
            
            // Buscar el dueño real del NFT en los datos adicionales, si existe
            let ownerWalletAddress = "0x6b22cEB508db3C81d69ED6451d63B56a1fb7271F"; // WALLET_BANK por defecto
            
            try {
              // Si hay datos adicionales en el NFT, intentar extraer el propietario
              if (updatedNft.additionalData) {
                let additionalData = {};
                
                // Los datos adicionales pueden ser un string JSON o un objeto
                if (typeof updatedNft.additionalData === 'string') {
                  additionalData = JSON.parse(updatedNft.additionalData);
                } else {
                  additionalData = updatedNft.additionalData;
                }
                
                // Extraer el owner de los datos adicionales si existe
                if (additionalData.owner) {
                  ownerWalletAddress = additionalData.owner.toLowerCase();
                  console.log(`Encontrado propietario en additionalData: ${ownerWalletAddress}`);
                } else if (additionalData.ownerAddress) {
                  ownerWalletAddress = additionalData.ownerAddress.toLowerCase();
                  console.log(`Encontrado propietario en additionalData.ownerAddress: ${ownerWalletAddress}`);
                }
              }
            } catch (parseError) {
              console.error("Error al procesar additionalData para obtener el propietario:", parseError);
            }
            
            // Datos básicos para position_history - usando nombres correctos de columna (snake_case)
            const positionData = {
              wallet_address: ownerWalletAddress, // Usamos el propietario real o WALLET_BANK
              pool_address: updatedNft.poolAddress || "0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640", // Default: USDC/ETH pool
              pool_name: `${updatedNft.token0Symbol || "Unknown"}/${updatedNft.token1Symbol || "Unknown"}`,
              token0: updatedNft.token0Symbol || "Unknown",
              token1: updatedNft.token1Symbol || "Unknown",
              token0_decimals: 6, // Default para USDC
              token1_decimals: 18, // Default para ETH
              token0_amount: "0",
              token1_amount: "0",
              deposited_usdc: updatedNft.valueUsdc,
              timestamp: now,
              start_date: now,
              timeframe: 365, // Default: 1 año
              status: "Active", // Aseguramos que el estado sea "Active"
              apr: 50.0, // APR default
              nft_token_id: updatedNft.tokenId,
              network: updatedNft.network,
              contract_address: updatedNft.contractAddress || "",
              token_pair: `${updatedNft.token0Symbol || "Unknown"}/${updatedNft.token1Symbol || "Unknown"}`,
              fee: updatedNft.feeTier || "0.3%"
            };
            
            // Si ya existe, actualizamos
            if (existingPositions.length > 0) {
              const existingPosition = existingPositions[0];
              
              await db.update(positionHistory)
                .set({
                  ...positionData,
                  // Conservar algunos campos si ya existen
                  token0_decimals: existingPosition.token0_decimals || positionData.token0_decimals,
                  token1_decimals: existingPosition.token1_decimals || positionData.token1_decimals,
                  start_date: existingPosition.start_date || positionData.start_date,
                  updated_at: now
                })
                .where(eq(positionHistory.id, existingPosition.id));
              
              console.log(`Position history actualizada para NFT tokenId=${updatedNft.tokenId}`);
            } 
            // Si no existe, creamos una nueva entrada
            else {
              await db.insert(positionHistory).values(positionData);
              console.log(`Nueva position history creada para NFT tokenId=${updatedNft.tokenId}`);
            }
          } catch (syncError) {
            console.error(`Error al sincronizar NFT con position_history:`, syncError);
            // No hacemos fallar la operación principal si falla la sincronización
          }
        }
        
        return updatedNft;
      } else {
        console.log(`No se actualizó ningún registro para el NFT con ID=${id}`);
        return null;
      }
    } catch (error) {
      console.error(`Error al actualizar NFT administrado con ID ${id}:`, error);
      return null;
    }
  }

  async deleteManagedNft(id: number): Promise<boolean> {
    try {
      await db.delete(managedNfts)
        .where(eq(managedNfts.id, id));
      
      return true;
    } catch (error) {
      console.error(`Error al eliminar NFT administrado con ID ${id}:`, error);
      return false;
    }
  }
  
  // Stats operations
  async getAverageAPR(): Promise<number> {
    try {
      // Obtener todas las posiciones reales de la base de datos que estén activas
      // Como no podemos consultar directamente 'closed' y 'liquidity', obtenemos todas las posiciones activas
      const result = await db.select({
        apr: realPositions.additionalData // El APR está almacenado en additionalData como JSON
      })
      .from(realPositions)
      .where(
        eq(realPositions.status, 'active')
      )
      .execute();
      
      // Si no hay posiciones, devolver un valor base de 50%
      if (!result || result.length === 0) {
        return 50.0;
      }
      
      // Calcular el promedio de APR
      const totalAPR = result.reduce((sum, position) => {
        try {
          // Intentar extraer APR de additionalData (que está en formato JSON)
          if (position.apr && typeof position.apr === 'string') {
            // Intentamos analizar los datos adicionales como JSON
            const additionalData = JSON.parse(position.apr);
            
            // Si hay un campo APR en los datos adicionales, usarlo
            if (additionalData && additionalData.apr && !isNaN(parseFloat(additionalData.apr.toString()))) {
              return sum + parseFloat(additionalData.apr.toString());
            }
          }
          
          // Si el campo APR existe directamente (en caso de que se agregue en el futuro)
          if (position.apr && !isNaN(parseFloat(position.apr.toString()))) {
            return sum + parseFloat(position.apr.toString());
          }
        } catch (e) {
          console.log("Error al procesar APR de posición:", e);
        }
        
        // De lo contrario, usar un valor predeterminado del 50%
        return sum + 50.0;
      }, 0);
      
      return totalAPR / result.length;
    } catch (error) {
      console.error("Error al calcular el APR promedio:", error);
      // En caso de error, devolver un valor predeterminado del 50%
      return 50.0;
    }
  }

  // Referrals operations
  async getReferral(id: number): Promise<Referral | undefined> {
    try {
      const result = await db.select({
        id: referrals.id,
        referralCode: referrals.referralCode,
        walletAddress: referrals.walletAddress,
        totalRewards: referrals.totalRewards,
        createdAt: referrals.createdAt,
        updatedAt: referrals.updatedAt,
      }).from(referrals).where(eq(referrals.id, id)).limit(1);
      return result[0];
    } catch (error) {
      console.error("Error al obtener referral por ID:", error);
      return undefined;
    }
  }
  
  async getReferralByCode(referralCode: string): Promise<Referral | undefined> {
    try {
      const result = await db.select({
        id: referrals.id,
        referralCode: referrals.referralCode,
        walletAddress: referrals.walletAddress,
        totalRewards: referrals.totalRewards,
        createdAt: referrals.createdAt,
        updatedAt: referrals.updatedAt,
      }).from(referrals).where(eq(referrals.referralCode, referralCode)).limit(1);
      return result[0];
    } catch (error) {
      console.error("Error al obtener referral por código:", error);
      return undefined;
    }
  }
  
  async getReferralsByWalletAddress(walletAddress: string): Promise<Referral[]> {
    try {
      const normalizedWalletAddress = walletAddress.toLowerCase();
      // Seleccionar solo las columnas que sabemos que existen en la tabla
      const result = await db.select({
        id: referrals.id,
        referralCode: referrals.referralCode,
        walletAddress: referrals.walletAddress,
        totalRewards: referrals.totalRewards,
        createdAt: referrals.createdAt,
        updatedAt: referrals.updatedAt,
      }).from(referrals).where(eq(referrals.walletAddress, normalizedWalletAddress));
      
      return result;
    } catch (error) {
      console.error(`Error al obtener referrals por wallet address ${walletAddress}:`, error);
      return [];
    }
  }
  
  async createReferral(referral: InsertReferral): Promise<Referral> {
    try {
      const normalizedWalletAddress = referral.walletAddress.toLowerCase();
      
      // Eliminamos cualquier referencia a email para evitar errores
      // si la columna no existe en algunas instancias
      const { email, ...safeReferralData } = referral;
      
      // Creamos un objeto con solo las propiedades que sabemos que existen
      const result = await db.insert(referrals).values({
        referralCode: safeReferralData.referralCode,
        walletAddress: normalizedWalletAddress,
        totalRewards: safeReferralData.totalRewards || "0",
        createdAt: new Date(),
        updatedAt: new Date()
      }).returning();
      
      return result[0];
    } catch (error) {
      console.error("Error al crear referral:", error);
      throw error;
    }
  }
  
  /**
   * Actualiza un registro de referral existente
   * @param id ID del referral a actualizar
   * @param data Datos parciales para actualizar
   * @returns El registro actualizado o undefined si no se encuentra
   */
  async updateReferral(id: number, data: Partial<Referral>): Promise<Referral | undefined> {
    try {
      // Si hay una dirección de wallet, asegurarse de que esté normalizada
      if (data.walletAddress) {
        data.walletAddress = data.walletAddress.toLowerCase();
      }
      
      // Eliminamos cualquier referencia a email para evitar errores
      // si la columna no existe en algunas instancias
      const { email, ...safeData } = data;
      
      // Añadir timestamp de actualización
      const updateData = {
        ...safeData,
        updatedAt: new Date()
      };
      
      // Asegurarse de usar solo campos que existen en la tabla
      const result = await db.update(referrals)
        .set({
          referralCode: updateData.referralCode,
          walletAddress: updateData.walletAddress,
          totalRewards: updateData.totalRewards,
          updatedAt: updateData.updatedAt
        })
        .where(eq(referrals.id, id))
        .returning();
      
      return result[0];
    } catch (error) {
      console.error(`Error al actualizar referral ${id}:`, error);
      return undefined;
    }
  }
  
  async generateReferralCode(walletAddress: string): Promise<string> {
    // Generar un código único usando la dirección de wallet y un timestamp
    const timestamp = Date.now().toString(36);
    const addressPart = walletAddress.slice(2, 8).toLowerCase();
    const randomPart = Math.random().toString(36).substring(2, 6);
    return `${addressPart}-${randomPart}-${timestamp}`;
  }
  
  // Referred users operations
  async getReferredUser(id: number): Promise<ReferredUser | undefined> {
    try {
      const result = await db.select().from(referredUsers).where(eq(referredUsers.id, id)).limit(1);
      return result[0];
    } catch (error) {
      console.error("Error al obtener usuario referido por ID:", error);
      return undefined;
    }
  }
  
  async getReferredUserByWalletAddress(walletAddress: string): Promise<ReferredUser | undefined> {
    try {
      const normalizedWalletAddress = walletAddress.toLowerCase();
      const result = await db.select().from(referredUsers).where(eq(referredUsers.referredWalletAddress, normalizedWalletAddress)).limit(1);
      return result[0];
    } catch (error) {
      console.error(`Error al obtener usuario referido por wallet address ${walletAddress}:`, error);
      return undefined;
    }
  }
  
  async getReferredUsersByReferralId(referralId: number): Promise<ReferredUser[]> {
    try {
      // Obtener todos los usuarios referidos, sin filtrar por estado,
      // esto permitirá hacer análisis más completos en la interfaz
      const result = await db.select().from(referredUsers)
        .where(eq(referredUsers.referralId, referralId));
      
      console.log(`Obtenidos ${result.length} usuarios referidos para referralId ${referralId}`, result);
      return result;
    } catch (error) {
      console.error(`Error al obtener usuarios referidos por referralId ${referralId}:`, error);
      return [];
    }
  }
  
  // La implementación está ahora activa y sin comentar
  
  async createReferredUser(referredUser: InsertReferredUser): Promise<ReferredUser> {
    try {
      const normalizedWalletAddress = referredUser.referredWalletAddress.toLowerCase();
      
      // Preparamos los datos asegurándonos que joinedAt sea una fecha válida
      const insertData: any = {
        ...referredUser,
        referredWalletAddress: normalizedWalletAddress,
        aprBoost: referredUser.aprBoost || "1.01", // 1% de incremento en APR por defecto
        earnedRewards: referredUser.earnedRewards || "0"
      };
      
      // Si tenemos joinedAt como string ISO, lo convertimos a objeto Date
      if (typeof referredUser.joinedAt === 'string') {
        // La columna en la base de datos espera un tipo timestamp, no guardamos el string
        delete insertData.joinedAt;
      }
      
      const result = await db.insert(referredUsers).values(insertData).returning();
      
      // Después de crear el usuario referido, actualizamos el contador de referidos del referidor
      if (result[0] && referredUser.referralId) {
        try {
          // Obtener el referral para actualizar las estadísticas
          const referral = await this.getReferral(referredUser.referralId);
          if (referral) {
            console.log(`Actualizando contador de referidos para referral ID ${referredUser.referralId}`);
            
            // Obtener la cantidad actual de referidos para este referidor
            const referredCount = await this.countReferredUsersByReferralId(referredUser.referralId);
            
            console.log(`Total de referidos contabilizados: ${referredCount}`);
          } else {
            console.error(`No se encontró el referral con ID ${referredUser.referralId}`);
          }
        } catch (countError) {
          console.error(`Error al actualizar contador de referidos: ${countError}`);
          // No fallamos la operación principal si el contador falla
        }
      }
      
      return result[0];
    } catch (error) {
      console.error("Error al crear usuario referido:", error);
      throw error;
    }
  }
  
  /**
   * Cuenta el número de usuarios referidos para un referral específico
   */
  async countReferredUsersByReferralId(referralId: number): Promise<number> {
    try {
      const result = await db.select({ count: count() })
        .from(referredUsers)
        .where(and(
          eq(referredUsers.referralId, referralId),
          eq(referredUsers.status, "active")
        ));
      
      return result[0]?.count || 0;
    } catch (error) {
      console.error(`Error al contar referidos para referralId ${referralId}:`, error);
      return 0;
    }
  }
  
  async updateReferredUser(id: number, userData: Partial<ReferredUser>): Promise<ReferredUser | undefined> {
    try {
      // Si se está actualizando la dirección del wallet, asegurarse de que esté normalizada
      if (userData.referredWalletAddress) {
        userData.referredWalletAddress = userData.referredWalletAddress.toLowerCase();
      }
      
      const result = await db.update(referredUsers)
        .set(userData)
        .where(eq(referredUsers.id, id))
        .returning();
      
      return result[0];
    } catch (error) {
      console.error(`Error al actualizar usuario referido ${id}:`, error);
      return undefined;
    }
  }
  
  async updateReferredUserRewards(id: number, earnedAmount: number): Promise<ReferredUser | undefined> {
    try {
      // Primero obtenemos los rewards actuales
      const user = await this.getReferredUser(id);
      if (!user) return undefined;
      
      // Manejo seguro de posibles valores nulos
      const earnedRewardsStr = user.earnedRewards ? user.earnedRewards.toString() : "0";
      const currentRewards = parseFloat(earnedRewardsStr || "0");
      const newRewards = currentRewards + earnedAmount;
      
      // Actualizamos en la base de datos
      const result = await db.update(referredUsers)
        .set({ earnedRewards: newRewards.toString() })
        .where(eq(referredUsers.id, id))
        .returning();
      
      return result[0];
    } catch (error) {
      console.error(`Error al actualizar rewards del usuario referido ${id}:`, error);
      return undefined;
    }
  }
  
  // Billing profiles operations
  async getBillingProfile(id: number): Promise<BillingProfile | undefined> {
    try {
      // Obtenemos solo las columnas que existen realmente en la BD
      const [dbProfile] = await db
        .select()
        .from(billingProfiles)
        .where(eq(billingProfiles.id, id));
      
      if (!dbProfile) {
        return undefined;
      }
      
      // Creamos un objeto con la estructura BillingProfile que espera el frontend
      // Añadimos los campos de verificación con valores predeterminados
      const profile: BillingProfile = {
        ...dbProfile,
        // Mapear el campo 'company' de la BD a 'companyName' que espera el cliente
        companyName: dbProfile.company,
        // Añadir campos de verificación virtuales (no existen en la BD)
        verificationStatus: 'Pending',
        verificationTimestamp: null,
        verificationHash: null,
        verificationTxHash: null
      };
      
      return profile;
    } catch (error) {
      console.error("Error getting billing profile by ID:", error);
      throw error;
    }
  }

  async getBillingProfileByWalletAddress(walletAddress: string): Promise<BillingProfile | undefined> {
    try {
      // Normalizar dirección wallet para consistencia en búsquedas
      const normalizedWalletAddress = walletAddress.toLowerCase();
      
      // Obtenemos el perfil de la base de datos
      const [dbProfile] = await db
        .select()
        .from(billingProfiles)
        .where(eq(billingProfiles.walletAddress, normalizedWalletAddress));
      
      if (!dbProfile) {
        return undefined;
      }
      
      // Ya no necesitamos mapear campos ni agregar campos virtuales,
      // ya que ahora existen en la base de datos
      return dbProfile as BillingProfile;
    } catch (error) {
      console.error("Error getting billing profile by wallet address:", error);
      throw error;
    }
  }

  async getAllBillingProfiles(): Promise<BillingProfile[]> {
    try {
      // Obtenemos los perfiles directamente de la base de datos
      const profiles = await db
        .select()
        .from(billingProfiles)
        .orderBy(desc(billingProfiles.createdAt));
      
      // Ya no necesitamos realizar transformaciones de campos
      return profiles as BillingProfile[];
    } catch (error) {
      console.error("Error getting all billing profiles:", error);
      throw error;
    }
  }

  async createBillingProfile(profile: InsertBillingProfile): Promise<BillingProfile> {
    try {
      // Normalizar dirección wallet para consistencia y mapear companyName a company
      const profileData = {
        ...profile,
        walletAddress: profile.walletAddress.toLowerCase(),
        // Mapear companyName a company (el nombre de la columna en la BD)
        company: profile.companyName,
        // Eliminar el campo companyName que no existe en la BD
        companyName: undefined,
        // Inicializar los campos de verificación
        verificationStatus: 'Pending',
        verificationTimestamp: null,
        verificationHash: null,
        verificationTxHash: null
      };
      
      // Convertir a un objeto simple para eliminar campos undefined
      const cleanedProfileData: Record<string, any> = {};
      for (const [key, value] of Object.entries(profileData)) {
        if (value !== undefined) {
          cleanedProfileData[key] = value;
        }
      }

      console.log("Datos para crear perfil:", cleanedProfileData);
      
      const [createdProfile] = await db.insert(billingProfiles).values(cleanedProfileData).returning();
      
      // Ya no necesitamos transformar el objeto, ya que ahora la base de datos tiene todos los campos
      return createdProfile as BillingProfile;
    } catch (error) {
      console.error("Error al crear perfil de facturación:", error);
      throw error;
    }
  }

  async updateBillingProfile(id: number, profile: Partial<BillingProfile>): Promise<BillingProfile | undefined> {
    try {
      if (Object.keys(profile).length === 0) {
        return await this.getBillingProfile(id);
      }

      // Filtrar campos para incluir solo los que existen en la tabla real
      // y mapear companyName a company (el nombre real en la BD)
      const fieldsToUpdate: Record<string, any> = {
        fullName: profile.fullName,
        // Importante: en la BD es 'company' pero en el frontend se usa 'companyName'
        company: profile.companyName,
        taxId: profile.taxId,
        address: profile.address,
        city: profile.city,
        postalCode: profile.postalCode,
        country: profile.country,
        phoneNumber: profile.phoneNumber,
        email: profile.email,
        notes: profile.notes,
        // Normalizar dirección wallet si se está actualizando
        walletAddress: profile.walletAddress ? profile.walletAddress.toLowerCase() : undefined,
        updatedAt: new Date(),
        // Incluir los campos de verificación si están presentes
        verificationStatus: profile.verificationStatus,
        verificationTimestamp: profile.verificationTimestamp,
        verificationHash: profile.verificationHash,
        verificationTxHash: profile.verificationTxHash
      };
      
      // Eliminar campos undefined
      const cleanedFields = Object.fromEntries(
        Object.entries(fieldsToUpdate).filter(([_, v]) => v !== undefined)
      );
      
      console.log("Campos filtrados para actualización por ID:", Object.keys(cleanedFields));
      
      await db
        .update(billingProfiles)
        .set(cleanedFields)
        .where(eq(billingProfiles.id, id));
        
      // Obtenemos el perfil actualizado
      return await this.getBillingProfile(id);
    } catch (error) {
      console.error(`Error al actualizar perfil de facturación con ID ${id}:`, error);
      throw error;
    }
  }

  async updateBillingProfileByWalletAddress(walletAddress: string, profile: Partial<BillingProfile>): Promise<BillingProfile | undefined> {
    try {
      // Normalizar dirección wallet para consistencia en búsquedas
      const normalizedWalletAddress = walletAddress.toLowerCase();
      
      if (Object.keys(profile).length === 0) {
        return await this.getBillingProfileByWalletAddress(normalizedWalletAddress);
      }
      
      // Filtrar campos para incluir solo los que existen en la tabla real
      // y mapear companyName a company (el nombre real en la BD)
      const fieldsToUpdate: Record<string, any> = {
        fullName: profile.fullName,
        // Importante: en la BD es 'company' pero en el frontend se usa 'companyName'
        company: profile.companyName,
        taxId: profile.taxId,
        address: profile.address,
        city: profile.city,
        postalCode: profile.postalCode,
        country: profile.country,
        phoneNumber: profile.phoneNumber,
        email: profile.email,
        notes: profile.notes,
        walletAddress: profile.walletAddress ? profile.walletAddress.toLowerCase() : undefined,
        updatedAt: new Date(),
        // Incluir los campos de verificación si están presentes
        verificationStatus: profile.verificationStatus,
        verificationTimestamp: profile.verificationTimestamp,
        verificationHash: profile.verificationHash,
        verificationTxHash: profile.verificationTxHash
      };
      
      // Eliminar campos undefined
      const cleanedFields = Object.fromEntries(
        Object.entries(fieldsToUpdate).filter(([_, v]) => v !== undefined)
      );
      
      console.log("Campos filtrados para actualización:", Object.keys(cleanedFields));
      
      await db
        .update(billingProfiles)
        .set(cleanedFields)
        .where(eq(billingProfiles.walletAddress, normalizedWalletAddress));
        
      // Obtenemos el perfil actualizado
      return await this.getBillingProfileByWalletAddress(normalizedWalletAddress);
    } catch (error) {
      console.error("Error updating billing profile by wallet address:", error);
      throw error;
    }
  }

  async deleteBillingProfile(id: number): Promise<boolean> {
    try {
      const result = await db
        .delete(billingProfiles)
        .where(eq(billingProfiles.id, id))
        .returning({ id: billingProfiles.id });
      
      return result.length > 0;
    } catch (error) {
      console.error(`Error eliminando perfil de facturación con ID ${id}:`, error);
      return false;
    }
  }

  async verifyBillingProfile(id: number, txHash: string): Promise<BillingProfile | undefined> {
    try {
      // Buscar el profile primero
      const profile = await this.getBillingProfile(id);
      if (!profile) {
        console.error(`No se encontró perfil de facturación con ID ${id}`);
        return undefined;
      }

      // Ahora actualizamos los campos de verificación en la base de datos
      const [updatedProfile] = await db
        .update(billingProfiles)
        .set({
          updatedAt: new Date(),
          verificationStatus: 'Verified',
          verificationTimestamp: new Date(),
          verificationHash: txHash,
          verificationTxHash: txHash
        })
        .where(eq(billingProfiles.id, id))
        .returning();
      
      return updatedProfile as BillingProfile;
    } catch (error) {
      console.error("Error verificando perfil de facturación:", error);
      throw error;
    }
  }
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByWalletAddress(walletAddress: string): Promise<User | undefined> {
    const normalized = walletAddress.toLowerCase();
    const result = await db.select()
      .from(users)
      .where(sql`LOWER(${users.walletAddress}) = ${normalized}`);
    
    return result.length > 0 ? result[0] : undefined;
  }

  async createUser(user: InsertUser): Promise<User> {
    try {
      // Asegurarse de que walletAddress siempre esté en minúsculas
      const normalizedUser = {
        ...user,
        walletAddress: user.walletAddress.toLowerCase(),
      };
      
      // Verificar primero si el usuario ya existe
      const existingUser = await this.getUserByWalletAddress(normalizedUser.walletAddress);
      if (existingUser) {
        console.log(`Usuario ya existe con la wallet ${normalizedUser.walletAddress}, retornando el existente`);
        return existingUser;
      }
      
      // Asegurarse de que todos los campos requeridos estén presentes
      if (!normalizedUser.username) {
        normalizedUser.username = `user_${normalizedUser.walletAddress.substring(2, 8)}`;
      }
      
      console.log(`Creando nuevo usuario con valores:`, JSON.stringify(normalizedUser));
      
      const [newUser] = await db
        .insert(users)
        .values(normalizedUser)
        .returning();
      
      console.log(`Usuario creado exitosamente con ID: ${newUser.id}`);
      return newUser;
    } catch (error) {
      console.error(`Error en createUser:`, error);
      
      // Intentar una última vez con solo los campos mínimos
      try {
        console.log(`Reintentando creación con campos mínimos...`);
        const minimalUser = {
          walletAddress: user.walletAddress.toLowerCase(),
          username: `user_${user.walletAddress.substring(2, 8)}`,
          theme: "dark",
          defaultNetwork: "ethereum",
          isAdmin: false
        };
        
        const [fallbackUser] = await db
          .insert(users)
          .values(minimalUser)
          .returning();
        
        console.log(`Usuario creado con campos mínimos con ID: ${fallbackUser.id}`);
        return fallbackUser;
      } catch (fallbackError) {
        console.error(`Error final en createUser (incluso con campos mínimos):`, fallbackError);
        throw error; // Lanzar el error original para mantener coherencia
      }
    }
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    const [updatedUser] = await db
      .update(users)
      .set({
        ...userData,
        updatedAt: new Date()
      })
      .where(eq(users.id, id))
      .returning();
    
    return updatedUser || undefined;
  }

  async updateUserByWalletAddress(walletAddress: string, userData: Partial<User>): Promise<User | undefined> {
    console.log("[Storage] Actualizando email para usuario:", walletAddress);
    console.log("[Storage] Datos a actualizar:", JSON.stringify(userData));
    
    const normalized = walletAddress.toLowerCase();
    
    try {
      // Primero, obtenemos el usuario actual para verificar
      const currentUser = await this.getUserByWalletAddress(walletAddress);
      if (!currentUser) {
        console.log("[Storage] Error: Usuario no encontrado con wallet:", walletAddress);
        return undefined;
      }
      
      console.log("[Storage] Usuario actual encontrado:", JSON.stringify(currentUser));
      
      // Realizar la actualización
      const [updatedUser] = await db
        .update(users)
        .set({
          ...userData,
          updatedAt: new Date()
        })
        .where(sql`LOWER(${users.walletAddress}) = ${normalized}`)
        .returning();
      
      console.log("[Storage] Usuario actualizado:", updatedUser ? JSON.stringify(updatedUser) : "No se actualizó");
      
      if (!updatedUser) {
        // Intento alternativo utilizando el ID
        console.log("[Storage] Intentando actualización alternativa por ID:", currentUser.id);
        const [altUpdatedUser] = await db
          .update(users)
          .set({
            ...userData,
            updatedAt: new Date()
          })
          .where(eq(users.id, currentUser.id))
          .returning();
        
        console.log("[Storage] Resultado de actualización alternativa:", altUpdatedUser ? JSON.stringify(altUpdatedUser) : "No se actualizó");
        return altUpdatedUser || undefined;
      }
      
      return updatedUser;
    } catch (error) {
      console.error("[Storage] Error al actualizar usuario por wallet:", error);
      return undefined;
    }
  }

  async updateUserEmail(walletAddress: string, email: string): Promise<User | undefined> {
    console.log(`[Storage] Actualizando email específicamente para ${walletAddress}: ${email}`);
    
    try {
      const normalized = walletAddress.toLowerCase();
      
      // Validar formato de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        console.error("[Storage] Formato de email inválido:", email);
        return undefined;
      }
      
      // Primero verificar que el usuario existe
      const currentUser = await this.getUserByWalletAddress(walletAddress);
      if (!currentUser) {
        console.error("[Storage] Usuario no encontrado con wallet:", walletAddress);
        return undefined;
      }
      
      // Actualizar el email del usuario
      const [updatedUser] = await db
        .update(users)
        .set({
          email: email,
          updatedAt: new Date()
        })
        .where(sql`LOWER(${users.walletAddress}) = ${normalized}`)
        .returning();
      
      if (updatedUser) {
        console.log(`[Storage] Email actualizado exitosamente para ${walletAddress}`);
        return updatedUser;
      } else {
        console.error("[Storage] No se pudo actualizar el email");
        return undefined;
      }
    } catch (error) {
      console.error("[Storage] Error al actualizar email:", error);
      return undefined;
    }
  }

  async getAllAdmins(): Promise<User[]> {
    return await db
      .select()
      .from(users)
      .where(eq(users.isAdmin, true));
  }
  
  async getAllUsers(): Promise<User[]> {
    return await db
      .select()
      .from(users)
      .orderBy(asc(users.walletAddress));
  }
  
  async deleteUser(id: number): Promise<boolean> {
    try {
      const result = await db
        .delete(users)
        .where(eq(users.id, id))
        .returning({ id: users.id });
      
      return result.length > 0;
    } catch (error) {
      console.error(`Error al eliminar usuario con ID ${id}:`, error);
      return false;
    }
  }
  
  async deleteUserByWalletAddress(walletAddress: string): Promise<boolean> {
    try {
      const normalized = walletAddress.toLowerCase();
      const result = await db
        .delete(users)
        .where(sql`LOWER(${users.walletAddress}) = ${normalized}`)
        .returning({ id: users.id });
      
      return result.length > 0;
    } catch (error) {
      console.error(`Error al eliminar usuario con wallet ${walletAddress}:`, error);
      return false;
    }
  }

  // Position preferences operations
  async getPositionPreferences(id: number): Promise<PositionPreferences | undefined> {
    const [pref] = await db
      .select()
      .from(positionPreferences)
      .where(eq(positionPreferences.id, id));
    
    return pref || undefined;
  }

  async getPositionPreferencesByWalletAddress(walletAddress: string): Promise<PositionPreferences | undefined> {
    const normalized = walletAddress.toLowerCase();
    const result = await db
      .select()
      .from(positionPreferences)
      .where(sql`LOWER(${positionPreferences.walletAddress}) = ${normalized}`);
    
    return result.length > 0 ? result[0] : undefined;
  }

  async createPositionPreferences(preferences: InsertPositionPreferences): Promise<PositionPreferences> {
    const [newPreferences] = await db
      .insert(positionPreferences)
      .values({
        ...preferences,
        walletAddress: preferences.walletAddress.toLowerCase(),
      })
      .returning();
    
    return newPreferences;
  }

  async updatePositionPreferences(id: number, preferencesData: Partial<PositionPreferences>): Promise<PositionPreferences | undefined> {
    const [updatedPreferences] = await db
      .update(positionPreferences)
      .set({
        ...preferencesData,
        updatedAt: new Date()
      })
      .where(eq(positionPreferences.id, id))
      .returning();
    
    return updatedPreferences || undefined;
  }

  // Position history operations
  async getPositionHistory(id: number): Promise<PositionHistory | undefined> {
    const [history] = await db
      .select()
      .from(positionHistory)
      .where(eq(positionHistory.id, id));
    
    return history || undefined;
  }

  async getPositionHistoryByWalletAddress(walletAddress: string): Promise<PositionHistory[]> {
    const normalized = walletAddress.toLowerCase();
    
    // Primero obtenemos todas las posiciones de la historia
    const positions = await db
      .select()
      .from(positionHistory)
      .where(sql`LOWER(${positionHistory.walletAddress}) = ${normalized}`)
      .orderBy(desc(positionHistory.timestamp));
    
    // Para cada posición, verificamos si hay un NFT administrado correspondiente
    // y actualizamos los valores según sea necesario
    const enrichedPositions = await Promise.all(positions.map(async (position) => {
      // Solo procesamos las posiciones que tienen tokenId y network
      if (!position.nftTokenId || !position.network) {
        return position;
      }
      
      try {
        // Buscar NFT administrado por token ID y network
        const managedNft = await this.getManagedNftByTokenId(position.nftTokenId, position.network);
        
        // Si encontramos un NFT administrado, actualizamos el valor y el estado
        if (managedNft) {
          console.log(`Encontrado NFT administrado para token ${position.nftTokenId} en ${position.network}. Valor: ${managedNft.valueUsdc}, Estado: ${managedNft.status}`);
          
          // Actualizamos los campos de la posición con datos del NFT administrado,
          // pero mantenemos el estado original si es Active o Finalized
          const originalStatus = position.status;
          const keepStatus = originalStatus === "Active" || originalStatus === "Finalized";
          
          // Sólo usamos el estado del NFT si la posición no tiene un estado importante
          return {
            ...position,
            valueUsdc: managedNft.valueUsdc,
            status: keepStatus ? originalStatus : managedNft.status
          };
        }
      } catch (error) {
        console.error(`Error al buscar NFT administrado para token ${position.nftTokenId}:`, error);
      }
      
      // Si no hay NFT administrado o hubo un error, devolvemos la posición original
      return position;
    }));
    
    return enrichedPositions;
  }
  
  async getPositionHistoryByNFTTokenId(tokenId: string): Promise<PositionHistory[]> {
    return await db
      .select()
      .from(positionHistory)
      .where(eq(positionHistory.nftTokenId, tokenId))
      .orderBy(desc(positionHistory.timestamp));
  }
  
  async getLatestPositionHistoryByRealPositionId(realPositionId: number): Promise<PositionHistory | undefined> {
    try {
      // Primero obtenemos la posición real para tener access a wallet y tokenId
      const realPosition = await this.getRealPosition(realPositionId);
      
      if (!realPosition || !realPosition.walletAddress) {
        console.log(`No se encontró posición real con ID ${realPositionId} o falta wallet_address`);
        return undefined;
      }
      
      // Normalizamos el wallet a minúsculas para la consulta
      const walletAddress = realPosition.walletAddress.toLowerCase();
      
      let queryBuilder;
      
      // Si hay tokenId en ambas tablas, usarlo como criterio adicional
      if (realPosition.tokenId) {
        // Buscar por wallet_address Y token_id para una coincidencia exacta
        queryBuilder = db
          .select()
          .from(positionHistory)
          .where(
            and(
              sql`LOWER(${positionHistory.walletAddress}) = ${walletAddress}`,
              eq(positionHistory.tokenId, realPosition.tokenId)
            )
          )
          .orderBy(desc(positionHistory.timestamp));
          
        const exactMatches = await queryBuilder;
        
        // Si encontramos coincidencias exactas, procesamos la más reciente
        if (exactMatches && exactMatches.length > 0) {
          console.log(`Encontrado historial exacto ${exactMatches[0].id} para posición real ${realPositionId}`);
          
          // Buscar si hay un NFT administrado correspondiente 
          const latestHistory = exactMatches[0];
          
          // Solo procesamos si hay tokenId y network
          if (latestHistory.nftTokenId && latestHistory.network) {
            try {
              // Buscar NFT administrado por token ID y network
              const managedNft = await this.getManagedNftByTokenId(
                latestHistory.nftTokenId, 
                latestHistory.network
              );
              
              // Si encontramos un NFT administrado, actualizamos el valor y el estado
              if (managedNft) {
                console.log(`Encontrado NFT administrado para token ${latestHistory.nftTokenId} en ${latestHistory.network}. Valor: ${managedNft.valueUsdc}, Estado: ${managedNft.status}`);
                
                // Actualizamos los campos con datos del NFT administrado
                return {
                  ...latestHistory,
                  valueUsdc: managedNft.valueUsdc,
                  status: managedNft.status
                };
              }
            } catch (error) {
              console.error(`Error al buscar NFT administrado para token ${latestHistory.nftTokenId}:`, error);
            }
          }
          
          return latestHistory;
        }
      }
      
      // Si no encontramos por token_id o no tenemos token_id, buscamos solo por wallet_address
      console.log(`Buscando historial para posición ${realPositionId} solo por wallet ${walletAddress}`);
      const histories = await db
        .select()
        .from(positionHistory)
        .where(sql`LOWER(${positionHistory.walletAddress}) = ${walletAddress}`)
        .orderBy(desc(positionHistory.timestamp));
      
      // Tomamos el primer resultado (el más reciente)
      const latestHistory = histories && histories.length > 0 ? histories[0] : undefined;
      
      if (latestHistory) {
        console.log(`Encontrado historial ${latestHistory.id} para posición real ${realPositionId} por wallet`);
        
        // Buscar si hay un NFT administrado correspondiente
        if (latestHistory.nftTokenId && latestHistory.network) {
          try {
            // Buscar NFT administrado por token ID y network
            const managedNft = await this.getManagedNftByTokenId(
              latestHistory.nftTokenId, 
              latestHistory.network
            );
            
            // Si encontramos un NFT administrado, actualizamos el valor y el estado
            if (managedNft) {
              console.log(`Encontrado NFT administrado para token ${latestHistory.nftTokenId} en ${latestHistory.network}. Valor: ${managedNft.valueUsdc}, Estado: ${managedNft.status}`);
              
              // Actualizamos los campos con datos del NFT administrado
              return {
                ...latestHistory,
                valueUsdc: managedNft.valueUsdc,
                status: managedNft.status
              };
            }
          } catch (error) {
            console.error(`Error al buscar NFT administrado para token ${latestHistory.nftTokenId}:`, error);
          }
        }
        
        return latestHistory;
      } else {
        console.log(`No se encontró historial para posición real ${realPositionId}`);
        return undefined;
      }
    } catch (error) {
      console.error(`Error getting position history for real position ${realPositionId}:`, error);
      return undefined;
    }
  }

  async createPositionHistory(history: InsertPositionHistory): Promise<PositionHistory> {
    // Convertir strings ISO a objetos Date para campos timestamp
    const processedHistory = {
      ...history,
      walletAddress: history.walletAddress.toLowerCase(),
      startDate: history.startDate ? new Date(history.startDate) : undefined,
      endDate: history.endDate ? new Date(history.endDate) : undefined
    };
    
    const [newHistory] = await db
      .insert(positionHistory)
      .values(processedHistory)
      .returning();
    
    return newHistory;
  }

  async updatePositionHistory(id: number, historyData: Partial<PositionHistory>): Promise<PositionHistory | undefined> {
    const [updatedHistory] = await db
      .update(positionHistory)
      .set({
        ...historyData
      })
      .where(eq(positionHistory.id, id))
      .returning();
    
    return updatedHistory || undefined;
  }
  
  async deletePositionHistory(id: number): Promise<boolean> {
    // Eliminamos la posición de la base de datos
    const result = await db
      .delete(positionHistory)
      .where(eq(positionHistory.id, id));
    
    return !!result;
  }
  
  async collectFees(positionId: number, amount: number): Promise<PositionHistory | undefined> {
    try {
      // Primero obtenemos la posición actual para tener los datos completos
      const position = await this.getPositionHistory(positionId);
      if (!position) {
        throw new Error(`Posición ${positionId} no encontrada`);
      }
      
      // Guardamos un registro del total histórico de fees acumulados (sumando los actuales)
      const totalFeesCollected = parseFloat(position.totalFeesCollected?.toString() || "0") + parseFloat(amount.toString());
      
      // Actualizamos la posición: resetear feesEarned a 0 y actualizar la fecha de inicio
      const [updatedPosition] = await db
        .update(positionHistory)
        .set({
          feesEarned: "0", // Reiniciamos a 0 los fees mostrados en la posición
          startDate: new Date(), // Actualizamos la fecha de inicio para el cálculo de nuevos fees
          totalFeesCollected: totalFeesCollected.toString(), // Mantenemos un registro del total acumulado histórico
          feesCollected: (parseFloat(position.feesCollected?.toString() || "0") + parseFloat(amount.toString())).toString(), // Incrementamos el contador de fees recolectados
        })
        .where(eq(positionHistory.id, positionId))
        .returning();
        
      return updatedPosition;
    } catch (error) {
      console.error(`Error al recolectar fees para la posición ${positionId}:`, error);
      return undefined;
    }
  }

  // Custom pools operations
  async getAllCustomPools(): Promise<CustomPool[]> {
    // Para administradores, mostrar todos los pools existentes (ya que eliminamos permanentemente)
    return await db
      .select()
      .from(customPools)
      .orderBy(asc(customPools.name));
  }

  async getActiveCustomPools(): Promise<CustomPool[]> {
    return await db
      .select()
      .from(customPools)
      .where(eq(customPools.active, true))
      .orderBy(asc(customPools.name));
  }

  async getCustomPoolByAddress(address: string, network: string = 'ethereum'): Promise<CustomPool | undefined> {
    const normalized = address.toLowerCase();
    
    // Buscar por dirección y red
    const result = await db
      .select()
      .from(customPools)
      .where(
        and(
          sql`LOWER(${customPools.address}) = ${normalized}`,
          sql`LOWER(${customPools.network}) = ${network.toLowerCase()}`
        )
      );
    
    // Si encontramos un pool específico para esa red, lo devolvemos
    if (result.length > 0) {
      return result[0];
    }
    
    // Si no encontramos para la red específica, intentamos buscar solo por dirección
    // Esto es para mantener compatibilidad con datos existentes que no tienen red especificada
    const fallbackResult = await db
      .select()
      .from(customPools)
      .where(sql`LOWER(${customPools.address}) = ${normalized}`);
    
    return fallbackResult.length > 0 ? fallbackResult[0] : undefined;
  }

  async createCustomPool(pool: InsertCustomPool): Promise<CustomPool> {
    const [newPool] = await db
      .insert(customPools)
      .values({
        ...pool,
        address: pool.address.toLowerCase(),
        token0Address: pool.token0Address.toLowerCase(),
        token1Address: pool.token1Address.toLowerCase(),
      })
      .returning();
    
    return newPool;
  }

  async updateCustomPool(id: number, poolData: Partial<CustomPool>): Promise<CustomPool | undefined> {
    const addressUpdate = poolData.address ? { address: poolData.address.toLowerCase() } : {};
    const token0Update = poolData.token0Address ? { token0Address: poolData.token0Address.toLowerCase() } : {};
    const token1Update = poolData.token1Address ? { token1Address: poolData.token1Address.toLowerCase() } : {};
    
    const [updatedPool] = await db
      .update(customPools)
      .set({
        ...poolData,
        ...addressUpdate,
        ...token0Update,
        ...token1Update,
        updatedAt: new Date()
      })
      .where(eq(customPools.id, id))
      .returning();
    
    return updatedPool || undefined;
  }

  async deleteCustomPool(id: number): Promise<boolean> {
    // Eliminación real del pool de la base de datos
    const result = await db
      .delete(customPools)
      .where(eq(customPools.id, id));
    
    console.log(`🗑️ Pool ${id} eliminado permanentemente de la base de datos`);
    return !!result;
  }

  // Support tickets operations
  async getSupportTicket(id: number): Promise<SupportTicket | undefined> {
    const [ticket] = await db
      .select()
      .from(supportTickets)
      .where(eq(supportTickets.id, id));
    
    return ticket || undefined;
  }

  async getSupportTicketByNumber(ticketNumber: string): Promise<SupportTicket | undefined> {
    const [ticket] = await db
      .select()
      .from(supportTickets)
      .where(eq(supportTickets.ticketNumber, ticketNumber));
    
    return ticket || undefined;
  }

  async getSupportTicketsByWalletAddress(walletAddress: string): Promise<SupportTicket[]> {
    const normalized = walletAddress.toLowerCase();
    return await db
      .select()
      .from(supportTickets)
      .where(
        and(
          sql`LOWER(${supportTickets.walletAddress}) = ${normalized}`,
          eq(supportTickets.isDeleted, false)
        )
      )
      .orderBy(desc(supportTickets.updatedAt));
  }

  async getAllSupportTickets(): Promise<SupportTicket[]> {
    return await db
      .select()
      .from(supportTickets)
      .where(eq(supportTickets.isDeleted, false))
      .orderBy(desc(supportTickets.updatedAt));
  }

  async getOpenSupportTickets(): Promise<SupportTicket[]> {
    return await db
      .select()
      .from(supportTickets)
      .where(
        and(
          sql`${supportTickets.status} != 'closed'`,
          eq(supportTickets.isDeleted, false)
        )
      )
      .orderBy(desc(supportTickets.updatedAt));
  }

  async createSupportTicket(ticket: InsertSupportTicket): Promise<SupportTicket> {
    // Usar el número de ticket proporcionado 
    // (ya fue generado en routes.ts)
    const [newTicket] = await db
      .insert(supportTickets)
      .values({
        ...ticket,
        walletAddress: ticket.walletAddress.toLowerCase(),
      })
      .returning();
    
    return newTicket;
  }

  async updateSupportTicket(id: number, ticketData: Partial<SupportTicket>): Promise<SupportTicket | undefined> {
    // Si se está cerrando el ticket, establecer la fecha de cierre
    if (ticketData.status === 'closed') {
      ticketData.closedAt = new Date();
    }
    
    const [updatedTicket] = await db
      .update(supportTickets)
      .set({
        ...ticketData,
        updatedAt: new Date()
      })
      .where(eq(supportTickets.id, id))
      .returning();
    
    return updatedTicket || undefined;
  }

  async deleteSupportTicket(id: number): Promise<boolean> {
    try {
      // Realizar eliminación lógica marcando isDeleted como true
      await db
        .update(supportTickets)
        .set({
          isDeleted: true,
          updatedAt: new Date()
        })
        .where(eq(supportTickets.id, id));
      
      return true;
    } catch (error) {
      console.error(`Error al eliminar ticket ${id}:`, error);
      return false;
    }
  }

  // Ticket messages operations
  async getTicketMessages(ticketId: number): Promise<TicketMessage[]> {
    return await db
      .select()
      .from(ticketMessages)
      .where(
        and(
          eq(ticketMessages.ticketId, ticketId),
          eq(ticketMessages.isDeleted, false)
        )
      )
      .orderBy(asc(ticketMessages.createdAt));
  }

  async createTicketMessage(message: InsertTicketMessage): Promise<TicketMessage> {
    const [newMessage] = await db
      .insert(ticketMessages)
      .values(message)
      .returning();
    
    // Actualizar la fecha de actualización del ticket
    await db
      .update(supportTickets)
      .set({ updatedAt: new Date() })
      .where(eq(supportTickets.id, message.ticketId));
    
    return newMessage;
  }

  async deleteTicketMessage(id: number): Promise<boolean> {
    try {
      // Realizar eliminación lógica marcando isDeleted como true
      await db
        .update(ticketMessages)
        .set({ isDeleted: true })
        .where(eq(ticketMessages.id, id));
      
      return true;
    } catch (error) {
      console.error(`Error al eliminar mensaje ${id}:`, error);
      return false;
    }
  }

  // Real Uniswap positions operations
  async getRealPosition(id: number): Promise<RealPosition | undefined> {
    try {
      const [position] = await db.select().from(realPositions).where(eq(realPositions.id, id));
      return position;
    } catch (error) {
      console.error(`Error getting real position ${id}:`, error);
      return undefined;
    }
  }
  
  async getRealPositionByTokenId(tokenId: string): Promise<RealPosition | undefined> {
    try {
      const [position] = await db
        .select()
        .from(realPositions)
        .where(eq(realPositions.tokenId, tokenId));
      return position;
    } catch (error) {
      console.error(`Error getting real position by token ID ${tokenId}:`, error);
      return undefined;
    }
  }

  async getRealPositionsByWalletAddress(walletAddress: string): Promise<RealPosition[]> {
    try {
      return await db
        .select()
        .from(realPositions)
        .where(eq(realPositions.walletAddress, walletAddress))
        .orderBy(desc(realPositions.createdAt));
    } catch (error) {
      console.error(`Error getting real positions for wallet ${walletAddress}:`, error);
      return [];
    }
  }

  async getRealPositionsByVirtualPositionId(virtualPositionId: number): Promise<RealPosition[]> {
    try {
      return await db
        .select()
        .from(realPositions)
        .where(eq(realPositions.virtualPositionId, virtualPositionId.toString()))
        .orderBy(desc(realPositions.createdAt));
    } catch (error) {
      console.error(`Error getting real positions for virtual position ${virtualPositionId}:`, error);
      return [];
    }
  }

  async getAllRealPositions(): Promise<RealPosition[]> {
    try {
      return await db
        .select()
        .from(realPositions)
        .orderBy(desc(realPositions.createdAt));
    } catch (error) {
      console.error("Error getting all real positions:", error);
      return [];
    }
  }

  async createRealPosition(position: InsertRealPosition): Promise<RealPosition> {
    try {
      // No need to include updatedAt, it's set by defaultNow() in the schema
      const [newPosition] = await db
        .insert(realPositions)
        .values(position)
        .returning();
      return newPosition;
    } catch (error) {
      console.error(`Error creating real position:`, error);
      throw error;
    }
  }

  async updateRealPosition(id: number, positionData: Partial<InsertRealPosition>): Promise<RealPosition | undefined> {
    try {
      // We need to manually update the timestamp since we're doing a partial update
      await db.execute(sql`
        UPDATE real_positions 
        SET updated_at = NOW() 
        WHERE id = ${id}
      `);
      
      const [updatedPosition] = await db
        .update(realPositions)
        .set(positionData)
        .where(eq(realPositions.id, id))
        .returning();
      return updatedPosition;
    } catch (error) {
      console.error(`Error updating real position ${id}:`, error);
      return undefined;
    }
  }

  async deleteRealPosition(id: number): Promise<boolean> {
    try {
      await db.delete(realPositions).where(eq(realPositions.id, id));
      return true;
    } catch (error) {
      console.error(`Error deleting real position ${id}:`, error);
      return false;
    }
  }
  
  // Invoices operations
  async getInvoice(id: number): Promise<Invoice | undefined> {
    try {
      const [invoice] = await db
        .select()
        .from(invoices)
        .where(eq(invoices.id, id));
      
      return invoice || undefined;
    } catch (error) {
      console.error(`Error getting invoice ${id}:`, error);
      return undefined;
    }
  }
  
  async getInvoiceByNumber(invoiceNumber: string): Promise<Invoice | undefined> {
    try {
      const [invoice] = await db
        .select()
        .from(invoices)
        .where(eq(invoices.invoiceNumber, invoiceNumber));
      
      return invoice || undefined;
    } catch (error) {
      console.error(`Error getting invoice by number ${invoiceNumber}:`, error);
      return undefined;
    }
  }
  
  async getInvoicesByWalletAddress(walletAddress: string): Promise<Invoice[]> {
    try {
      const normalized = walletAddress.toLowerCase();
      
      // Verificar si la columna billing_profile_id existe
      const columnExists = await db.execute(sql`
        SELECT EXISTS (
          SELECT FROM information_schema.columns 
          WHERE table_schema = 'public' 
          AND table_name = 'invoices'
          AND column_name = 'billing_profile_id'
        );
      `);
      
      const hasBillingProfileColumn = columnExists.rows && 
                                      columnExists.rows.length > 0 && 
                                      columnExists.rows[0].exists;
      
      // Si la columna no existe, usar la consulta original
      if (!hasBillingProfileColumn) {
        return await db
          .select()
          .from(invoices)
          .where(sql`LOWER(${invoices.walletAddress}) = ${normalized}`)
          .orderBy(desc(invoices.createdAt));
      }
      
      // Si la columna existe, usar la consulta completa
      return await db
        .select()
        .from(invoices)
        .where(sql`LOWER(${invoices.walletAddress}) = ${normalized}`)
        .orderBy(desc(invoices.createdAt));
    } catch (error) {
      console.error(`Error getting invoices for wallet ${walletAddress}:`, error);
      return [];
    }
  }
  
  async getInvoicesByPositionId(positionId: number): Promise<Invoice[]> {
    try {
      return await db
        .select()
        .from(invoices)
        .where(eq(invoices.positionId, positionId))
        .orderBy(desc(invoices.createdAt));
    } catch (error) {
      console.error(`Error getting invoices for position ${positionId}:`, error);
      return [];
    }
  }
  
  async getAllInvoices(): Promise<Invoice[]> {
    try {
      // Verificar si la columna billing_profile_id existe
      const columnExists = await db.execute(sql`
        SELECT EXISTS (
          SELECT FROM information_schema.columns 
          WHERE table_schema = 'public' 
          AND table_name = 'invoices'
          AND column_name = 'billing_profile_id'
        );
      `);
      
      const hasBillingProfileColumn = columnExists.rows && 
                                      columnExists.rows.length > 0 && 
                                      columnExists.rows[0].exists;
      
      // Realizar la consulta independientemente de si la columna existe o no
      return await db
        .select()
        .from(invoices)
        .orderBy(desc(invoices.createdAt));
    } catch (error) {
      console.error("Error getting all invoices:", error);
      return [];
    }
  }
  
  async createInvoice(invoice: InsertInvoice): Promise<Invoice> {
    try {
      // Si no se proporciona un número de factura, generarlo
      if (!invoice.invoiceNumber) {
        invoice.invoiceNumber = await this.generateInvoiceNumber();
      }
      
      // Verificar si la columna billing_profile_id existe
      const columnExists = await db.execute(sql`
        SELECT EXISTS (
          SELECT FROM information_schema.columns 
          WHERE table_schema = 'public' 
          AND table_name = 'invoices'
          AND column_name = 'billing_profile_id'
        );
      `);
      
      const hasBillingProfileColumn = columnExists.rows && 
                                     columnExists.rows.length > 0 && 
                                     columnExists.rows[0].exists;
      
      // Asegurarse de que walletAddress esté en minúsculas
      let processedInvoice: any = {
        ...invoice,
        walletAddress: invoice.walletAddress.toLowerCase(),
        issueDate: invoice.issueDate || new Date()
      };
      
      // Si la columna no existe, eliminar billing_profile_id para evitar errores
      if (!hasBillingProfileColumn && 'billing_profile_id' in processedInvoice) {
        delete processedInvoice.billing_profile_id;
      }
      
      const [newInvoice] = await db
        .insert(invoices)
        .values(processedInvoice)
        .returning();
      
      return newInvoice;
    } catch (error) {
      console.error("Error creating invoice:", error);
      throw error;
    }
  }
  
  async updateInvoice(id: number, invoiceData: Partial<Invoice>): Promise<Invoice | undefined> {
    try {
      // Verificar si la columna billing_profile_id existe
      const columnExists = await db.execute(sql`
        SELECT EXISTS (
          SELECT FROM information_schema.columns 
          WHERE table_schema = 'public' 
          AND table_name = 'invoices'
          AND column_name = 'billing_profile_id'
        );
      `);
      
      const hasBillingProfileColumn = columnExists.rows && 
                                     columnExists.rows.length > 0 && 
                                     columnExists.rows[0].exists;
      
      // Procesar los datos de la factura para asegurarnos de que las fechas son correctas
      let processedData: any = { ...invoiceData };
      
      // Si la columna no existe, eliminar billing_profile_id para evitar errores
      if (!hasBillingProfileColumn && 'billing_profile_id' in processedData) {
        delete processedData.billing_profile_id;
      }
      
      // Si se está actualizando el estado a "Paid", establecer paidDate si no está ya establecido
      if (processedData.status === 'Paid' && !processedData.paidDate) {
        processedData.paidDate = new Date();
      }
      
      // Convertir fechas de strings a objetos Date si es necesario
      if (processedData.issueDate && typeof processedData.issueDate === 'string') {
        processedData.issueDate = new Date(processedData.issueDate);
      }
      
      if (processedData.dueDate && typeof processedData.dueDate === 'string') {
        processedData.dueDate = new Date(processedData.dueDate);
      }
      
      if (processedData.paidDate && typeof processedData.paidDate === 'string') {
        processedData.paidDate = new Date(processedData.paidDate);
      }
      
      const [updatedInvoice] = await db
        .update(invoices)
        .set({
          ...processedData,
          updatedAt: new Date()
        })
        .where(eq(invoices.id, id))
        .returning();
      
      return updatedInvoice || undefined;
    } catch (error) {
      console.error(`Error updating invoice ${id}:`, error);
      return undefined;
    }
  }
  
  async deleteInvoice(id: number): Promise<boolean> {
    try {
      await db.delete(invoices).where(eq(invoices.id, id));
      return true;
    } catch (error) {
      console.error(`Error deleting invoice ${id}:`, error);
      return false;
    }
  }
  
  async generateInvoiceNumber(): Promise<string> {
    try {
      const date = new Date();
      const year = date.getFullYear().toString();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      
      // Formato: INV-YYYY-MM-XXXXX
      const prefix = `INV-${year}-${month}-`;
      
      // Buscar la última factura con este prefijo para determinar el siguiente número
      const existingInvoices = await db
        .select()
        .from(invoices)
        .where(sql`${invoices.invoiceNumber} LIKE ${prefix + '%'}`)
        .orderBy(desc(invoices.invoiceNumber));
      
      let nextNumber = 1;
      if (existingInvoices.length > 0) {
        const lastInvoice = existingInvoices[0];
        const lastNumber = parseInt(lastInvoice.invoiceNumber.substring(prefix.length) || '0');
        if (!isNaN(lastNumber)) {
          nextNumber = lastNumber + 1;
        }
      }
      
      return `${prefix}${nextNumber.toString().padStart(5, '0')}`;
    } catch (error) {
      console.error("Error generating invoice number:", error);
      // Generar un número de factura aleatorio como fallback en caso de error
      const randomSuffix = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
      const date = new Date();
      return `INV-${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${randomSuffix}`;
    }
  }

  // App config operations
  async getAppConfigByKey(key: string): Promise<AppConfig | undefined> {
    try {
      const configs = await db
        .select()
        .from(appConfig)
        .where(eq(appConfig.key, key));
      return configs[0];
    } catch (error) {
      console.error(`Error getting app config for key ${key}:`, error);
      return undefined;
    }
  }

  async getAllAppConfig(): Promise<AppConfig[]> {
    try {
      return await db.select().from(appConfig);
    } catch (error) {
      console.error('Error getting all app configs:', error);
      return [];
    }
  }

  async createAppConfig(config: InsertAppConfig): Promise<AppConfig> {
    try {
      const configs = await db
        .insert(appConfig)
        .values(config)
        .returning();
      return configs[0];
    } catch (error) {
      console.error('Error creating app config:', error);
      throw error;
    }
  }

  async updateAppConfig(key: string, value: string): Promise<AppConfig | undefined> {
    try {
      const now = new Date();
      const configs = await db
        .update(appConfig)
        .set({
          value,
          updatedAt: now
        })
        .where(eq(appConfig.key, key))
        .returning();
      return configs[0];
    } catch (error) {
      console.error(`Error updating app config for key ${key}:`, error);
      return undefined;
    }
  }

  async deleteAppConfig(id: number): Promise<boolean> {
    try {
      const result = await db
        .delete(appConfig)
        .where(eq(appConfig.id, id));
      return result.rowCount > 0;
    } catch (error) {
      console.error(`Error deleting app config ${id}:`, error);
      return false;
    }
  }
}

// Implementación de métodos de recuperación de contraseña para DatabaseStorage
async function implementPasswordRecoveryForDatabaseStorage(storage: DatabaseStorage) {
  // Método para obtener usuario por email
  storage.getUserByEmail = async function(email: string): Promise<User | undefined> {
    try {
      // Normalizar el email a lowercase para comparación
      const normalizedEmail = email.toLowerCase();
      
      // Buscar usuario por email
      const [user] = await db
        .select()
        .from(users)
        .where(sql`LOWER(email) = ${normalizedEmail}`);
      
      return user;
    } catch (error) {
      console.error(`Error buscando usuario por email ${email}:`, error);
      return undefined;
    }
  };
  
  // Método para guardar token de recuperación de contraseña
  storage.savePasswordRecoveryToken = async function(userId: number, data: {token: string, expiresAt: Date, used: boolean}): Promise<boolean> {
    try {
      // Crear registro de token en la base de datos
      await db.insert(passwordRecoveryTokens).values({
        userId,
        token: data.token,
        expiresAt: data.expiresAt,
        used: data.used,
      });
      
      return true;
    } catch (error) {
      console.error(`Error guardando token de recuperación para usuario ${userId}:`, error);
      return false;
    }
  };
  
  // Método para obtener token de recuperación
  storage.getPasswordRecoveryByToken = async function(token: string): Promise<{userId: number, token: string, expiresAt: Date, used: boolean} | undefined> {
    try {
      // Buscar token en la base de datos
      const [recoveryToken] = await db
        .select()
        .from(passwordRecoveryTokens)
        .where(eq(passwordRecoveryTokens.token, token));
      
      if (!recoveryToken) {
        return undefined;
      }
      
      return {
        userId: recoveryToken.userId,
        token: recoveryToken.token,
        expiresAt: recoveryToken.expiresAt,
        used: recoveryToken.used,
      };
    } catch (error) {
      console.error(`Error obteniendo token de recuperación ${token}:`, error);
      return undefined;
    }
  };
  
  // Método para obtener todos los tokens de recuperación de un usuario
  storage.getAllRecoveryTokensForUser = async function(userId: number): Promise<{userId: number, token: string, expiresAt: Date, used: boolean}[]> {
    try {
      // Buscar todos los tokens del usuario en la base de datos
      const recoveryTokens = await db
        .select()
        .from(passwordRecoveryTokens)
        .where(eq(passwordRecoveryTokens.userId, userId))
        .orderBy(desc(passwordRecoveryTokens.createdAt));
      
      return recoveryTokens.map(token => ({
        userId: token.userId,
        token: token.token,
        expiresAt: token.expiresAt,
        used: token.used,
      }));
    } catch (error) {
      console.error(`Error obteniendo tokens de recuperación para usuario ${userId}:`, error);
      return [];
    }
  };
  
  // Método para marcar token como usado
  storage.markRecoveryTokenAsUsed = async function(token: string): Promise<boolean> {
    try {
      // Actualizar estado del token en la base de datos
      await db
        .update(passwordRecoveryTokens)
        .set({
          used: true,
          updatedAt: new Date(),
        })
        .where(eq(passwordRecoveryTokens.token, token));
      
      return true;
    } catch (error) {
      console.error(`Error marcando token como usado ${token}:`, error);
      return false;
    }
  };
  
  // Método para actualizar contraseña de usuario
  storage.updateUserPassword = async function(userId: number, newPassword: string): Promise<boolean> {
    try {
      // Actualizar contraseña del usuario
      await db
        .update(users)
        .set({
          password: newPassword,
          updatedAt: new Date(),
        })
        .where(eq(users.id, userId));
      
      return true;
    } catch (error) {
      console.error(`Error actualizando contraseña para usuario ${userId}:`, error);
      return false;
    }
  }


}

export const storage = new DatabaseStorage();

// Implementar los métodos de recuperación de contraseña
implementPasswordRecoveryForDatabaseStorage(storage);
