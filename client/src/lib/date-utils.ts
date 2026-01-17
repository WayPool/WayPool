/**
 * Utilidades para el manejo de fechas en la interfaz
 */

import { format, addDays, addYears } from 'date-fns';
import { es, enUS } from 'date-fns/locale';
import { Language } from '@/hooks/use-translation';

/**
 * Formato por defecto para fechas en la interfaz
 */
const DEFAULT_FORMAT = 'dd/MM/yyyy';

/**
 * Formatea una fecha en el formato deseado
 * @param dateString String de fecha ISO a formatear
 * @param formatStr Formato de salida
 * @param language Idioma para el formateo (es|en)
 * @returns Fecha formateada
 */
export function formatDate(
  dateString: string | Date | null | undefined,
  formatStr: string = DEFAULT_FORMAT,
  language: Language = 'es'
): string {
  if (!dateString) return '-';
  
  try {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    
    // Verificar si la fecha es válida
    if (isNaN(date.getTime())) {
      console.error('Fecha inválida:', dateString);
      return '-';
    }
    
    // Para fechas válidas, aplicar el formato
    let formatPattern = formatStr;
    
    // Soporte para formato "short" como alias
    if (formatStr === 'short') {
      formatPattern = 'dd/MM/yy';
    }
    
    return format(date, formatPattern, {
      locale: language === 'es' ? es : enUS
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return '-';
  }
}

/**
 * Devuelve solo la parte de fecha de un DateTime
 * @param dateTime String de fecha y hora
 * @returns Solo la parte de fecha
 */
export function getDateFromDateTime(dateTime: string): string {
  if (!dateTime) return '';
  return dateTime.split('T')[0];
}

/**
 * Obtiene la fecha actual en formato ISO
 * @returns Fecha actual en formato ISO
 */
export function getCurrentDateISO(): string {
  return new Date().toISOString();
}

/**
 * Calcula una fecha futura en formato ISO
 * @param days Número de días a añadir a la fecha actual
 * @returns Fecha futura en formato ISO
 */
export function getFutureDateISO(days: number): string {
  return addDays(new Date(), days).toISOString();
}

/**
 * Calcula una fecha futura a un año a partir de una fecha base
 * @param baseDate Fecha base (por defecto fecha actual)
 * @returns Fecha a un año en formato ISO
 */
export function getOneYearAheadISO(baseDate: Date = new Date()): string {
  return addYears(baseDate, 1).toISOString();
}

/**
 * Formatea un importe como moneda
 * @param amount Importe a formatear
 * @param currency Código de moneda (por defecto USD)
 * @param language Idioma para el formateo (es|en)
 * @returns Importe formateado como moneda
 */
export function formatCurrency(
  amount: number | string | undefined | null,
  currency: string = 'USD',
  language: Language = 'es'
): string {
  if (amount === undefined || amount === null) return '-';
  
  // Convertir a número si es string
  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  if (isNaN(numericAmount)) return '-';
  
  try {
    // Primero truncamos el número a 2 decimales (sin redondear)
    const truncatedAmount = parseFloat(truncateDecimals(numericAmount, 2));
    
    // Luego formateamos como moneda
    return new Intl.NumberFormat(language === 'es' ? 'es-ES' : 'en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      // useGrouping para separar los miles
      useGrouping: true
    }).format(truncatedAmount);
  } catch (error) {
    console.error('Error formatting currency:', error);
    return numericAmount.toString();
  }
}

/**
 * Trunca un número a un número específico de decimales sin redondear
 * @param num Número a truncar
 * @param decimals Número de decimales (por defecto 2)
 * @returns Número truncado a los decimales especificados
 */
export function truncateDecimals(
  num: number | string | undefined | null,
  decimals: number = 2
): string {
  if (num === undefined || num === null) return '-';
  
  // Convertir a número si es string
  const numericValue = typeof num === 'string' ? parseFloat(num) : num;
  
  if (isNaN(numericValue)) return '-';
  
  // Convertir a string y dividir en parte entera y decimal
  const parts = numericValue.toString().split('.');
  
  if (parts.length === 1) {
    // No tiene parte decimal, añadir ceros
    return `${parts[0]}.${'0'.repeat(decimals)}`;
  }
  
  // Truncar la parte decimal (no redondear)
  let decimalPart = parts[1] || '';
  if (decimalPart.length > decimals) {
    decimalPart = decimalPart.substring(0, decimals);
  } else {
    // Completar con ceros si es necesario
    decimalPart = decimalPart.padEnd(decimals, '0');
  }
  
  return `${parts[0]}.${decimalPart}`;
}

/**
 * Formatea un número utilizando truncado en lugar de redondeo
 * @param num Número a formatear
 * @param decimals Número de decimales (por defecto 2)
 * @returns Número formateado con los decimales especificados sin redondear
 */
export function formatNumber(
  num: number | string | undefined | null,
  decimals: number = 2
): string {
  return truncateDecimals(num, decimals);
}

/**
 * Formatea valores monetarios grandes mostrando los números exactos sin redondeo
 * @param amount Cantidad monetaria
 * @param currency Moneda (USD por defecto)
 * @returns Valor monetario formateado sin redondear, en formato americano con 2 decimales
 */
export function formatExactCurrency(
  amount: number | string | undefined | null,
  currency: string = 'USD',
  language: Language = 'es'
): string {
  if (amount === undefined || amount === null) return '-';
  
  // Convertir a número si es string
  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  if (isNaN(numericAmount)) return '-';
  
  // Truncar a 2 decimales sin redondear
  const truncated = truncateDecimals(numericAmount, 2);
  
  // Separar parte entera y decimal
  const parts = truncated.split('.');
  const integerPart = parts[0];
  const decimalPart = parts.length > 1 ? parts[1] : '00';
  
  // Formatear con comas como separadores de miles (formato americano)
  let formattedInteger = '';
  for (let i = 0; i < integerPart.length; i++) {
    if (i > 0 && (integerPart.length - i) % 3 === 0) {
      formattedInteger += ',';  // Siempre coma como separador de miles
    }
    formattedInteger += integerPart[i];
  }
  
  // Determinar símbolo de moneda
  let currencySymbol = currency === 'USD' ? '$' : currency;
  
  // Formato final con punto como separador decimal y siempre 2 decimales
  return `${currencySymbol}${formattedInteger}.${decimalPart}`;
}

/**
 * Formatea valores monetarios grandes sin separadores de miles y sin redondeo
 * Específico para los paneles estadísticos que muestran valores numéricos exactos
 * @param amount Cantidad monetaria
 * @param currency Moneda (USD por defecto)
 * @returns Valor monetario formateado sin separadores de miles y sin redondear
 */
export function formatLargeNumber(
  amount: number | string | undefined | null,
  currency: string = 'USD',
  language: Language = 'es'
): string {
  if (amount === undefined || amount === null) return '-';
  
  // Convertir a número si es string
  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  if (isNaN(numericAmount)) return '-';
  
  // Truncar a 2 decimales
  const truncated = truncateDecimals(numericAmount, 2);
  
  // Separar parte entera y decimal
  const parts = truncated.split('.');
  const integerPart = parts[0];
  const decimalPart = parts.length > 1 ? parts[1] : '00';
  
  // Determinar símbolo de moneda
  let currencySymbol = currency === 'USD' ? '$' : currency;
  
  // Formato final sin separadores de miles pero con formato americano (punto como decimal)
  return `${currencySymbol}${integerPart}.${decimalPart}`;
}