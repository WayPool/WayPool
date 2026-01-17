/**
 * Instancia única del servicio de wallet custodiado para uso en toda la aplicación
 */
import { CustodialWalletService } from './service';

// Crear una única instancia del servicio para toda la aplicación
export const custodialWalletService = new CustodialWalletService();