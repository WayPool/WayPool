/**
 * Formatear un precio a formato de moneda (USD)
 * @param value Valor a formatear
 * @param decimals Número de decimales (por defecto 2)
 * @returns String formateado con símbolo $
 */
export function formatCurrency(value: number, decimals: number = 2): string {
  if (value === undefined || value === null) return '$0.00';
  
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  
  return formatter.format(value);
}

/**
 * Formatear un número con separadores de miles
 * @param value Valor a formatear
 * @param decimals Número de decimales (por defecto 2)
 * @returns String formateado con separadores de miles
 */
export function formatNumber(value: number, decimals: number = 2): string {
  if (value === undefined || value === null) return '0';
  
  const formatter = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  
  return formatter.format(value);
}

/**
 * Formatear un porcentaje
 * @param value Valor a formatear (0.15 = 15%)
 * @param decimals Número de decimales (por defecto 2)
 * @returns String formateado con símbolo %
 */
export function formatPercent(value: number, decimals: number = 2): string {
  if (value === undefined || value === null) return '0%';
  
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  
  return formatter.format(value / 100);
}

/**
 * Formatear una dirección de wallet a formato abreviado
 * @param address Dirección de wallet
 * @returns Dirección abreviada (0x1234...5678)
 */
export function formatAddress(address: string): string {
  if (!address) return '';
  
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

/**
 * Formatea un timestamp o fecha a formato legible
 * @param timestamp Timestamp o fecha
 * @returns Fecha formateada (DD/MM/YYYY)
 */
export function formatDate(timestamp: number | string | Date): string {
  if (!timestamp) return '';
  
  const date = new Date(timestamp);
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

/**
 * Formatea un rango de precios para su visualización
 * @param lowerPrice Precio mínimo
 * @param upperPrice Precio máximo
 * @returns Rango formateado
 */
export function formatPriceRange(lowerPrice: number, upperPrice: number): string {
  if (lowerPrice === 0 && upperPrice === 0) return 'Rango completo';
  
  return `$${formatNumber(lowerPrice, 2)} → $${formatNumber(upperPrice, 2)}`;
}

/**
 * Formato para diferencial de precio (con signo + o -)
 * @param value Valor a formatear
 * @param decimals Número de decimales
 * @returns String formateado con signo + o -
 */
export function formatPriceDiff(value: number, decimals: number = 2): string {
  if (value === undefined || value === null) return '0%';
  
  const sign = value >= 0 ? '+' : '';
  return sign + formatPercent(value, decimals);
}

/**
 * Formatea un valor APR para su visualización (añade % y colorea)
 * @param apr Valor APR
 * @returns APR formateado
 */
export function formatAPR(apr: number): string {
  if (apr === undefined || apr === null) return '0%';
  
  return `${apr.toFixed(2)}%`;
}

/**
 * Formatea un valor grande para su visualización compacta (ej: 1.2M)
 * @param value Valor a formatear
 * @returns Valor formateado en forma compacta
 */
export function formatCompactNumber(value: number): string {
  if (value === undefined || value === null) return '0';
  
  const formatter = new Intl.NumberFormat('en-US', {
    notation: 'compact',
    compactDisplay: 'short',
    maximumFractionDigits: 1,
  });
  
  return formatter.format(value);
}

/**
 * Formatea el fee tier para su visualización (ej: 1% -> '1.00%')
 * @param feeTier Valor del fee tier
 * @returns Fee tier formateado
 */
export function formatFeeTier(feeTier: string | number): string {
  if (typeof feeTier === 'string') return feeTier;
  
  // Convertir de bps a porcentaje
  const feePercentage = feeTier / 10000;
  
  // Formato para diferentes tamaños de fee
  if (feePercentage >= 0.01) {
    return `${feePercentage.toFixed(2)}%`;
  } else {
    return `${feePercentage.toFixed(3)}%`;
  }
}