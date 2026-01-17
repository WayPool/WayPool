/**
 * Tipos relacionados con blockchain
 */

/**
 * Red de blockchain
 */
export interface Network {
  id: string;          // Identificador único de la red
  name: string;        // Nombre legible de la red
  icon?: string;       // Ícono o emoji para la red
  enabled?: boolean;   // Si la red está habilitada en la UI
  chainId?: number;    // Chain ID para identificar la red (ej. 1 = Ethereum)
  rpcUrl?: string;     // URL del RPC para conectarse a la red
  explorerUrl?: string; // URL del explorador de bloques
}

/**
 * Token en blockchain
 */
export interface Token {
  address: string;     // Dirección del contrato del token
  symbol: string;      // Símbolo del token (ETH, USDC)
  name: string;        // Nombre completo del token
  decimals: number;    // Número de decimales (18 para ETH, 6 para USDC)
  logo?: string;       // URL del logo del token
  network: string;     // Red en la que existe el token
  isStablecoin?: boolean; // Si el token es una stablecoin
  price?: number;      // Precio en USD
  balance?: string;    // Balance del usuario (si está disponible)
}

/**
 * Pool de liquidez
 */
export interface PoolData {
  id: string;          // ID del pool
  address: string;     // Dirección del contrato
  name: string;        // Nombre del pool (Token0/Token1)
  token0: Token;       // Primer token
  token1: Token;       // Segundo token
  fee: number;         // Fee tier en puntos base (3000 = 0.3%)
  tvl: number;         // Total Value Locked
  volume24h: number;   // Volumen 24h
  apr: number;         // Annual Percentage Rate
  network: string;     // Red del pool
}

/**
 * Tipo de transacción
 */
export enum TransactionType {
  SWAP = 'swap',
  LIQUIDITY_ADD = 'liquidity_add',
  LIQUIDITY_REMOVE = 'liquidity_remove',
  TRANSFER = 'transfer',
  APPROVAL = 'approval',
  CLAIM = 'claim',
  CONTRACT_INTERACTION = 'contract_interaction',
  UNKNOWN = 'unknown'
}