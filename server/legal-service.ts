import { db } from "./db";
import { 
  users, 
  legalSignatures, 
  InsertLegalSignature,
  User
} from "@shared/schema";
import { eq, and, sql } from "drizzle-orm";
import { Request } from "express";

/**
 * Servicio para manejar todas las operaciones relacionadas con documentos legales
 * y firmas de términos y condiciones.
 */
export class LegalService {
  /**
   * Verifica si un usuario ha aceptado todos los documentos legales requeridos
   */
  static async hasAcceptedAllLegalTerms(walletAddress: string): Promise<boolean> {
    console.log(`[LegalService] Verificando aceptación de términos legales para: ${walletAddress}`);
    
    try {
      // Normalizar dirección para garantizar coincidencia exacta
      const normalizedWalletAddress = walletAddress.toLowerCase();
      
      const [user] = await db
        .select()
        .from(users)
        .where(sql`LOWER(${users.walletAddress}) = ${normalizedWalletAddress}`);
      
      if (!user) {
        console.log(`[LegalService] Usuario no encontrado: ${normalizedWalletAddress}`);
        return false;
      }
      
      console.log(`[LegalService] Estado de términos para ${normalizedWalletAddress}:`, {
        termsOfUseAccepted: Boolean(user.termsOfUseAccepted),
        privacyPolicyAccepted: Boolean(user.privacyPolicyAccepted),
        disclaimerAccepted: Boolean(user.disclaimerAccepted)
      });
      
      return Boolean(
        user.termsOfUseAccepted && 
        user.privacyPolicyAccepted && 
        user.disclaimerAccepted
      );
    } catch (error) {
      console.error(`[LegalService] Error al verificar términos legales para ${walletAddress}:`, error);
      return false;
    }
  }

  /**
   * Actualiza el estado de aceptación de documentos legales para un usuario
   */
  static async updateLegalAcceptanceStatus(
    userId: number, 
    walletAddress: string, 
    termsOfUse: boolean, 
    privacyPolicy: boolean, 
    disclaimer: boolean
  ): Promise<User> {
    console.log(`Actualizando términos legales para usuario ID ${userId}, wallet ${walletAddress}:`, {
      termsOfUse,
      privacyPolicy,
      disclaimer
    });
    
    // Verificar que todos los documentos hayan sido aceptados
    const allAccepted = termsOfUse && privacyPolicy && disclaimer;
    console.log(`Todos los términos aceptados: ${allAccepted}`);
    
    // Actualizar el usuario
    const [updatedUser] = await db
      .update(users)
      .set({
        termsOfUseAccepted: termsOfUse,
        privacyPolicyAccepted: privacyPolicy,
        disclaimerAccepted: disclaimer,
        hasAcceptedLegalTerms: allAccepted,
        legalTermsAcceptedAt: allAccepted ? new Date() : null,
        updatedAt: new Date()
      })
      .where(eq(users.id, userId))
      .returning();
      
    console.log(`Usuario actualizado con éxito:`, {
      id: updatedUser.id,
      walletAddress: updatedUser.walletAddress,
      hasAcceptedLegalTerms: updatedUser.hasAcceptedLegalTerms,
      termsOfUseAccepted: updatedUser.termsOfUseAccepted,
      privacyPolicyAccepted: updatedUser.privacyPolicyAccepted,
      disclaimerAccepted: updatedUser.disclaimerAccepted,
      legalTermsAcceptedAt: updatedUser.legalTermsAcceptedAt,
    });
    
    return updatedUser;
  }

  /**
   * Registra una firma detallada para un documento legal específico
   * con información exhaustiva para conformidad legal y protección jurídica
   */
  static async recordLegalSignature(
    signatureData: InsertLegalSignature,
    req: Request
  ): Promise<void> {
    // Asegurar que capturamos la dirección IP real del cliente
    // Considerar headers de proxy (X-Forwarded-For, etc.)
    let realIpAddress = req.ip || 
                        req.headers["x-forwarded-for"] as string || 
                        req.headers["x-real-ip"] as string || 
                        req.socket.remoteAddress || 
                        "unknown";
                        
    // Si x-forwarded-for contiene múltiples IPs, tomar la primera (cliente original)
    if (realIpAddress && realIpAddress.includes(',')) {
      realIpAddress = realIpAddress.split(',')[0].trim();
    }
    
    // Fecha y hora exacta de la firma con precisión de milisegundos en UTC
    const signatureTimestamp = new Date().toISOString();
    
    // Datos que verifican el origen de la petición
    const originVerification = {
      origin: req.headers.origin || null,
      referer: req.headers.referer || null,
      host: req.headers.host || null,
      forwardedHost: req.headers["x-forwarded-host"] || null,
      forwardedProto: req.headers["x-forwarded-proto"] || null
    };
    
    // Información de la sesión
    const sessionInfo = {
      sessionId: req.headers["x-session-id"] || null,
      cookieExists: !!req.headers.cookie, // Verificar si hay cookies
      authMethod: req.headers.authorization ? "token" : "session" // Tipo de autenticación usada
    };
    
    // Enriquecer los datos de la firma con información adicional
    const enrichedSignatureData: InsertLegalSignature = {
      ...signatureData,
      ipAddress: realIpAddress,
      userAgent: req.headers["user-agent"] || "unknown",
      deviceInfo: this.getDeviceInfo(req),
      locationData: this.getLocationInfo(req),
      additionalData: {
        headers: req.headers,
        method: req.method,
        protocol: req.protocol,
        secure: req.secure,
        timestamp: signatureTimestamp,
        timezoneName: Intl.DateTimeFormat().resolvedOptions().timeZone,
        timezoneOffset: new Date().getTimezoneOffset(),
        originVerification,
        sessionInfo,
        // Campos específicos para cumplimiento legal de Dubai
        legalComplianceInfo: {
          acceptanceDate: signatureTimestamp,
          signatureMethod: "explicit_checkbox",
          websiteUrl: `${req.protocol}://${req.headers.host}${req.originalUrl}`,
          companyInfo: {
            name: "Elysium Media FZCO",
            registrationId: "58510",
            jurisdiction: "Dubai, UAE",
            address: "Premises no. 58510-001, IFZA Business Park, DDP, DUBAI, UAE"
          }
        }
      }
    };

    console.log(`Registrando firma legal para ${signatureData.walletAddress} (${signatureData.documentType})`);
    console.log(`IP: ${realIpAddress}, Timestamp: ${signatureTimestamp}`);

    // Insertar el registro de firma
    await db.insert(legalSignatures).values(enrichedSignatureData);
    
    console.log(`Firma legal registrada correctamente para ${signatureData.walletAddress}`);
  }

  /**
   * Obtiene todas las firmas legales de un usuario
   */
  static async getUserLegalSignatures(walletAddress: string): Promise<any[]> {
    const signatures = await db
      .select()
      .from(legalSignatures)
      .where(eq(legalSignatures.walletAddress, walletAddress));
    
    return signatures;
  }

  /**
   * Extrae información detallada del dispositivo a partir de la solicitud
   * Captura toda la información posible para documentación legal
   */
  private static getDeviceInfo(req: Request): any {
    const userAgent = req.headers["user-agent"] || "";
    
    // Analizar el User-Agent para extraer información detallada del dispositivo
    const isMobile = /Mobile|Android|iPhone|iPad|iPod/i.test(userAgent);
    const browser = this.detectBrowser(userAgent);
    const os = this.detectOS(userAgent);
    const browserVersion = this.extractBrowserVersion(userAgent);
    
    // Obtener información de plataforma
    const platform = req.headers["sec-ch-ua-platform"] ? 
      String(req.headers["sec-ch-ua-platform"]).replace(/"/g, "") : "unknown";
    
    // Obtener información sobre pantalla y ventana si está disponible
    const screenWidth = req.headers["sec-ch-viewport-width"] || null;
    const screenHeight = req.headers["sec-ch-viewport-height"] || null;
    
    // Información de cliente
    const clientHints = {
      mobile: req.headers["sec-ch-ua-mobile"] || null,
      platform: platform,
      model: req.headers["sec-ch-ua-model"] || null,
      bitness: req.headers["sec-ch-ua-bitness"] || null,
      architecture: req.headers["sec-ch-ua-arch"] || null,
      fullVersionList: req.headers["sec-ch-ua-full-version-list"] || null,
    };
    
    return {
      isMobile,
      browser,
      browserVersion,
      os,
      platform,
      userAgent,
      screenDimensions: {
        width: screenWidth,
        height: screenHeight
      },
      clientHints,
      colorScheme: req.headers["sec-ch-prefers-color-scheme"] || null,
      screenInfo: req.headers["sec-ch-ua"] || null,
      deviceMemory: req.headers["device-memory"] || null,
      hardwareConcurrency: req.headers["hardware-concurrency"] || null
    };
  }

  /**
   * Extrae información de ubicación detallada a partir de la solicitud
   */
  private static getLocationInfo(req: Request): any {
    // Capturar todas las cabeceras relacionadas con la ubicación
    const geoIp = {
      country: req.headers["cf-ipcountry"] || req.headers["x-country-code"] || null,
      city: req.headers["cf-ipcity"] || req.headers["x-city"] || null,
      region: req.headers["cf-region"] || req.headers["x-region"] || null,
      continent: req.headers["cf-ipcontinent"] || null,
      latitude: req.headers["cf-iplatitude"] || null,
      longitude: req.headers["cf-iplongitude"] || null
    };
    
    return {
      acceptLanguage: req.headers["accept-language"] || null,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      timezoneOffset: new Date().getTimezoneOffset(),
      geoIp: geoIp,
      // Información del ISP si está disponible
      isp: req.headers["cf-isp"] || null,
      asn: req.headers["cf-asn"] || null,
      connectionType: req.headers["cf-connecting-ip"] ? "direct" : "proxy"
    };
  }
  
  /**
   * Extrae la versión del navegador a partir del User-Agent
   */
  private static extractBrowserVersion(userAgent: string): string {
    let version = "unknown";
    
    try {
      if (/Firefox\/([0-9.]+)/.test(userAgent)) {
        version = userAgent.match(/Firefox\/([0-9.]+)/)?.[1] || "unknown";
      } else if (/Chrome\/([0-9.]+)/.test(userAgent)) {
        version = userAgent.match(/Chrome\/([0-9.]+)/)?.[1] || "unknown";
      } else if (/Safari\/([0-9.]+)/.test(userAgent)) {
        version = userAgent.match(/Version\/([0-9.]+)/)?.[1] || "unknown";
      } else if (/Edg\/([0-9.]+)/.test(userAgent)) {
        version = userAgent.match(/Edg\/([0-9.]+)/)?.[1] || "unknown";
      } else if (/OPR\/([0-9.]+)/.test(userAgent)) {
        version = userAgent.match(/OPR\/([0-9.]+)/)?.[1] || "unknown";
      } else if (/MSIE ([0-9.]+)/.test(userAgent)) {
        version = userAgent.match(/MSIE ([0-9.]+)/)?.[1] || "unknown";
      } else if (/rv:([0-9.]+)/.test(userAgent) && /Trident/.test(userAgent)) {
        // Internet Explorer 11
        version = userAgent.match(/rv:([0-9.]+)/)?.[1] || "unknown";
      }
    } catch (error) {
      console.error("Error extracting browser version:", error);
    }
    
    return version;
  }

  /**
   * Detecta el navegador a partir del User-Agent
   */
  private static detectBrowser(userAgent: string): string {
    if (/Firefox/i.test(userAgent)) return "Firefox";
    if (/Chrome/i.test(userAgent)) return "Chrome";
    if (/Safari/i.test(userAgent)) return "Safari";
    if (/Edge|Edg/i.test(userAgent)) return "Edge";
    if (/Opera|OPR/i.test(userAgent)) return "Opera";
    if (/MSIE|Trident/i.test(userAgent)) return "Internet Explorer";
    return "Unknown";
  }

  /**
   * Detecta el sistema operativo a partir del User-Agent
   */
  private static detectOS(userAgent: string): string {
    if (/Windows/i.test(userAgent)) return "Windows";
    if (/Mac OS X/i.test(userAgent)) return "MacOS";
    if (/Linux/i.test(userAgent)) return "Linux";
    if (/Android/i.test(userAgent)) return "Android";
    if (/iPhone|iPad|iPod/i.test(userAgent)) return "iOS";
    return "Unknown";
  }
}