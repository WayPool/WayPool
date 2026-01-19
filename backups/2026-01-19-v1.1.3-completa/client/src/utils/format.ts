/**
 * Formats a number as currency (USD)
 * @param amount - The amount to format
 * @returns Formatted string (e.g. "$1,234.56")
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(amount);
}

/**
 * Formats a number as a percentage
 * @param value - The value to format as a percentage (e.g. 0.125 = 12.5%)
 * @returns Formatted string (e.g. "12.5%")
 */
export function formatPercentage(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value / 100);
}

/**
 * Formats a compact number with a suffix (K, M, B)
 * @param value - The value to format
 * @returns Formatted string (e.g. "1.2M")
 */
export function formatCompact(value: number): string {
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 1
  }).format(value);
}

/**
 * Formats a date string as a human-readable date
 * @param dateString - ISO date string
 * @returns Formatted date (e.g. "Apr 19, 2023")
 */
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

/**
 * Truncates a string (usually an address) to a shorter form
 * @param str - The string to truncate
 * @param startChars - Number of characters to keep at the start
 * @param endChars - Number of characters to keep at the end
 * @returns Truncated string (e.g. "0x1234...5678")
 */
export function truncateString(str: string, startChars = 6, endChars = 4): string {
  if (!str) return '';
  if (str.length <= startChars + endChars) return str;
  return `${str.substring(0, startChars)}...${str.substring(str.length - endChars)}`;
}