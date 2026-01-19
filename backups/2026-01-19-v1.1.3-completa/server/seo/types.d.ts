/**
 * Declaraciones de tipo para módulos externos
 * utilizados en el sistema SEO.
 */

// Declaración para node-fetch si no se encuentra su tipado
declare module 'node-fetch';

// Declaración para puppeteer si no se encuentra su tipado
declare module 'puppeteer' {
  export interface Browser {
    close(): Promise<void>;
    newPage(): Promise<Page>;
  }

  export interface Page {
    setDefaultNavigationTimeout(timeout: number): Promise<void>;
    setUserAgent(userAgent: string): Promise<void>;
    goto(url: string, options?: { waitUntil?: string }): Promise<any>;
    waitForSelector(selector: string, options?: { timeout?: number }): Promise<any>;
    waitForTimeout(timeout: number): Promise<void>;
    content(): Promise<string>;
  }

  export function launch(options?: {
    headless?: boolean | 'new';
    args?: string[];
  }): Promise<Browser>;
}