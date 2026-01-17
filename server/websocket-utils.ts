import { getWebSocketServer } from './websocket-server';
import { log } from './vite';

/**
 * Envía una actualización de datos del pool a todos los clientes suscritos
 * @param poolAddress Dirección del pool que se actualiza
 * @param data Datos a enviar
 */
export function sendPoolUpdate(poolAddress: string, data: any): boolean {
  const wss = getWebSocketServer();
  if (!wss) {
    return false;
  }
  
  wss.sendPoolUpdate(poolAddress, data);
  return true;
}

/**
 * Envía una alerta del sistema a todos los clientes conectados
 * @param message Mensaje de la alerta
 * @param level Nivel de alerta (info, warning, error)
 */
export function sendSystemAlert(message: string, level: 'info' | 'warning' | 'error' = 'info'): boolean {
  const wss = getWebSocketServer();
  if (!wss) {
    return false;
  }
  
  wss.sendSystemAlert(message, level);
  return true;
}