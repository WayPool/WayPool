import { useContext } from 'react';
import { ThemeContext } from '@/lib/theme-provider';

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme debe ser usado dentro de un ThemeProvider');
  }
  return context;
}