import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Calcula las recompensas potenciales basadas en el monto, APR y timeframe
 * @param amount Cantidad en USDC a invertir
 * @param apr Porcentaje anual de retorno (APR)
 * @param timeframe Período en días (30, 90, 365)
 * @returns Retorno estimado para el período especificado
 */
export function calculatePotentialRewards(amount: number, apr: number, timeframe: number): number {
  // Convertir APR anual a la fracción correspondiente al timeframe
  const yearFraction = timeframe / 365;
  const earning = amount * (apr / 100) * yearFraction;
  return earning;
}

/**
 * Formatea un número como moneda
 * @param value Valor a formatear
 * @param currency Moneda (por defecto USD)
 * @returns Cadena formateada como moneda
 */
export function formatCurrency(value: number, currency: string = "USD"): string {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * Formatea un número con el número especificado de decimales
 * @param value Valor a formatear
 * @param decimals Número de decimales
 * @returns Cadena formateada
 */
export function formatNumber(value: number, decimals: number = 2): string {
  return value.toFixed(decimals);
}

/**
 * Detecta si el dispositivo actual es móvil
 * @returns {boolean} true si el dispositivo es móvil
 */
export function isMobile(): boolean {
  if (typeof window === 'undefined') return false;
  
  // Detección principal basada en user agent
  const mobileUserAgents = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
  if (mobileUserAgents.test(navigator.userAgent)) return true;
  
  // Detección secundaria basada en tamaño de pantalla
  return window.innerWidth <= 768;
}

/**
 * Formatea una cantidad exacta como moneda, especialmente útil para valores que vienen como strings
 * @param value Valor a formatear (puede ser string o number)
 * @param decimals Decimales a mostrar (por defecto 2)
 * @param currency Moneda (por defecto USD)
 * @returns Cadena formateada como moneda
 */
export function formatExactCurrency(value: string | number, decimals: number = 2, currency: string = "USD"): string {
  // Validar el número de decimales (debe estar entre 0 y 20)
  const validDecimals = Math.min(Math.max(0, decimals), 20);
  
  // Asegurarse de que currency sea un valor válido
  let validCurrency = currency;
  if (!currency || typeof currency !== 'string' || currency === '0') {
    validCurrency = "USD";
  }
  
  // Convertir a número si es string
  let numValue = 0;
  if (typeof value === "string") {
    numValue = parseFloat(value) || 0;
  } else if (typeof value === "number") {
    numValue = isNaN(value) ? 0 : value;
  }
  
  try {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: validCurrency,
      minimumFractionDigits: validDecimals,
      maximumFractionDigits: validDecimals,
    }).format(numValue);
  } catch (error) {
    console.error("Error al formatear moneda:", error, { value, decimals, currency });
    return `${numValue.toFixed(validDecimals)} ${validCurrency}`;
  }
}
