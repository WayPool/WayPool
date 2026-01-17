/**
 * Hook para acceder al contexto del tema
 */

import { useContext } from 'react';
import { ThemeContext } from '../lib/theme-provider';

export function useTheme() {
  const context = useContext(ThemeContext);
  
  if (!context) {
    throw new Error('useTheme debe usarse dentro de un ThemeProvider');
  }
  
  return context;
}