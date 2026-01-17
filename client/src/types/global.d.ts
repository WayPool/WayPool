/**
 * Definiciones de tipos globales para la aplicación
 */

// Extensión para Window
interface Window {
  // Función de rescate para traducciones
  __last_t?: (key: string) => string;
  // Identidad de la wallet
  ethereum?: any;
}