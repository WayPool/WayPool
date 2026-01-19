/**
 * Formatea una dirección de Ethereum para mostrarla en UI
 * Muestra los primeros 6 y últimos 4 caracteres
 */
export function formatAddress(address: string): string {
  if (!address) return '';
  if (address.length < 10) return address;
  
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
}

/**
 * Función para verificar si una dirección de Ethereum es válida
 */
export function isValidEthereumAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Formatea un balance en wei a ETH
 */
export function formatEthBalance(balance: string, decimals: number = 18): string {
  if (!balance) return '0';
  
  const value = parseInt(balance, 10) / Math.pow(10, decimals);
  
  if (value < 0.0001) {
    return '<0.0001';
  }
  
  return value.toFixed(4);
}

/**
 * Formatea el precio del gas en gwei a un formato legible
 */
export function formatGasPrice(gasPrice: string): string {
  if (!gasPrice) return '0';
  
  const gweiValue = parseInt(gasPrice, 10) / 1e9;
  return `${gweiValue.toFixed(0)} Gwei`;
}

/**
 * Formatea un hash de transacción para mostrarlo en UI
 */
export function formatTxHash(hash: string): string {
  if (!hash) return '';
  if (hash.length < 12) return hash;
  
  return `${hash.substring(0, 6)}...${hash.substring(hash.length - 6)}`;
}

/**
 * Dirección del wallet de depósito para operaciones de liquidez
 */
export const DEPOSIT_WALLET_ADDRESS = "0xC36442b4a4522E871399CD717aBDD847Ab11FE88";

/**
 * Formatea una cantidad monetaria para mostrarla en UI
 * @param amount - La cantidad a formatear
 * @param compact - Si se debe mostrar en formato compacto (true) o completo (false)
 * @param currencySymbol - Símbolo de moneda personalizado (opcional)
 */
export function formatCurrency(amount: number, compact?: boolean, currencySymbol?: string): string {
  if (amount === undefined || amount === null) return '$0.00';
  
  const symbol = currencySymbol || '$';
  
  if (compact === true && amount >= 1000) {
    // Formato compacto para cantidades grandes
    if (amount >= 1000000) {
      return `${symbol}${(amount / 1000000).toFixed(2)}M`;
    } else {
      return `${symbol}${(amount / 1000).toFixed(2)}K`;
    }
  }
  
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
  
  // Si se proporciona un símbolo personalizado, reemplazamos "$" con ese símbolo
  if (currencySymbol && currencySymbol !== '$') {
    return formatter.format(amount).replace('$', currencySymbol);
  }
  
  return formatter.format(amount);
}

/**
 * Formatea un porcentaje para mostrarlo en UI
 * @param value - El valor porcentual a formatear
 * @param includeSign - Si se debe incluir el signo de porcentaje
 * @param decimalPlaces - Número de decimales a mostrar
 */
export function formatPercentage(value: number, includeSign: boolean = true, decimalPlaces: number = 2): string {
  if (value === undefined || value === null) return includeSign ? '0%' : '0';
  
  const fixedValue = value.toFixed(decimalPlaces);
  
  if (includeSign) {
    return `${fixedValue}%`;
  }
  
  return fixedValue;
}