/**
 * Utility functions shared between client and server
 */

/**
 * Safely converts a value to a number
 * If the value cannot be converted, returns the default value (or 0)
 */
export function convertToNumber(value: any, defaultValue: number = 0): number {
  if (value === null || value === undefined) return defaultValue;
  
  // If it's already a number, return it
  if (typeof value === 'number') return value;
  
  // If it's a string, try to parse it
  if (typeof value === 'string') {
    // Remove currency symbols, commas, etc.
    const cleanedValue = value.replace(/[$,]/g, '');
    const parsed = parseFloat(cleanedValue);
    return isNaN(parsed) ? defaultValue : parsed;
  }
  
  return defaultValue;
}