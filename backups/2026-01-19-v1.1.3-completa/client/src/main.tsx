// Import polyfills first
import "./polyfills";

// Importar utilidad de migración de dominio
import { redirectToCanonicalDomain, updateDomReferences } from "./domain-migration";

// Verificar si es necesario redirigir al dominio principal
redirectToCanonicalDomain();

// Actualizar referencias en el DOM cuando esté cargado
document.addEventListener('DOMContentLoaded', updateDomReferences);

// Método efectivo para eliminar las advertencias específicas de módulos externalizados y errores de anidamiento
const originalConsoleWarn = console.warn;
window.console.warn = function(...args: any[]) {
  if (!args.length) return originalConsoleWarn.apply(console, args);
  
  try {
    const warningMsg = String(args[0] || '');
    
    // Lista de patrones específicos a filtrar
    const patternsToSuppress = [
      'has been externalized for browser compatibility',
      'Module ',
      'util.debuglog',
      'util.inspect',
      'http.globalAgent',
      'https.globalAgent', 
      'buffer.Buffer'
    ];
    
    // Verificar si el mensaje contiene alguno de los patrones que queremos suprimir
    for (const pattern of patternsToSuppress) {
      if (warningMsg.includes(pattern)) {
        // No mostrar esta advertencia
        return;
      }
    }
  } catch (e) {
    // Si hay algún error en el procesamiento, permitir que el warn original se ejecute
  }
  
  // Permitir todas las demás advertencias
  return originalConsoleWarn.apply(console, args);
};

// Suprimir errores de validación de DOM
const originalConsoleError = console.error;
window.console.error = function(...args: any[]) {
  const errorMsg = args[0] || '';
  
  // Filtrar errores específicos que queremos ignorar
  if (typeof errorMsg === 'string' && (
      errorMsg.includes('validateDOMNesting')
    )) {
    return;  // No mostrar estos errores
  }
  
  // Permitir todos los demás errores
  return originalConsoleError.apply(console, args);
};

// Función para eliminar la marca de agua de Replit
const removeReplitWatermark = () => {
  // Remover elementos existentes
  const removeWatermarks = () => {
    // Seleccionar todos los posibles elementos de marca de agua
    const selectors = [
      '[aria-label="Made with Replit"]',
      '#replitWatermark',
      'div[style*="z-index: 100000"]',
      'div[style*="bottom: 8px"][style*="right: 8px"]',
      'div[class*="watermark"]',
      'button:has(> img[alt*="Replit"])',
      'a[href*="replit.app"]',
      '.jsx-3334212749',
      '.replit-ui-theme-root',
      '[title="Made with Replit"]'
    ];
    
    // Procesar cada selector
    selectors.forEach(selector => {
      document.querySelectorAll(selector).forEach(element => {
        element.remove();
      });
    });
    
    // Ocultar mediante CSS
    const style = document.createElement('style');
    style.textContent = `
      #replitWatermark,
      .replit-ui-theme-root,
      .jsx-3334212749,
      div[class*="watermark-container"],
      div[class*="watermarkContainer"],
      div:has(> a[href*="replit.com"]),
      [aria-label="Made with Replit"],
      [title="Made with Replit"],
      a[href*="replit.app"],
      .floating-watermark-button,
      button:has(> img[alt*="Replit"]),
      button:has(> span:contains("Replit")) {
        display: none !important;
        opacity: 0 !important;
        visibility: hidden !important;
        pointer-events: none !important;
      }
    `;
    document.head.appendChild(style);
  };

  // Ejecutar inmediatamente
  removeWatermarks();

  // Crear un observer para eliminar la marca de agua si se añade dinámicamente
  const observer = new MutationObserver(() => {
    removeWatermarks();
  });

  // Observar cambios en el DOM
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  // Ejecutar periódicamente para mayor seguridad
  setInterval(removeWatermarks, 500);
};

// Ejecutar cuando el DOM esté cargado
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', removeReplitWatermark);
} else {
  removeReplitWatermark();
}

// También ejecutar cuando la página esté completamente cargada
window.addEventListener('load', removeReplitWatermark);

import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import "./styles/theme-sync.css"; // CSS para sincronizar temas en componentes de portal
import "./styles/mobile-slider-fix.css"; // CSS para arreglar el aspecto del slider en versión móvil
import "./styles/mobile-header-spacing-fix.css"; // CSS para corregir el espaciado del header en móvil
import "./styles/wallet-connect-mobile.css"; // CSS para simplificar el bloque de wallet connect en móvil
import { ThemeProvider } from "@/lib/theme-provider";
import { WalletProvider } from "@/lib/new-wallet-provider";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { TranslationProvider } from "@/hooks/use-translation";
import { LanguageProvider } from "@/context/language-context";
import { GoogleAnalytics } from "./components/analytics/GoogleAnalytics";
import { PortalThemeSync } from "./components/portal-theme-sync"; // Solución para fondos negros en selectores

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TranslationProvider>
        <LanguageProvider>
          <WalletProvider>
            <GoogleAnalytics />
            <PortalThemeSync />
            <App />
          </WalletProvider>
        </LanguageProvider>
      </TranslationProvider>
    </ThemeProvider>
  </QueryClientProvider>
);
