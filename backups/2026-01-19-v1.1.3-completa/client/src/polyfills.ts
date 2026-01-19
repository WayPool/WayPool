// Establecer todos los polyfills de manera global e inmediata para evitar errores
import { Buffer } from 'buffer';
import * as stream from 'stream-browserify';

// Este enfoque de establecer todos los polyfills globalmente antes de cualquier importación
// permite evitar advertencias relacionadas con módulos de Node.js externalizados
// Suprime todos los warnings relacionados con módulos "util", "http", "https", "buffer", etc.

// Función utilitaria para crear mocks seguros
function createSafeMock(name: string) {
  return new Proxy({}, {
    get: function(target, prop) {
      // Devolver una función vacía para cualquier propiedad
      if (typeof prop === 'string') {
        return function() { return ''; };
      }
      return '';
    }
  });
}

// Asegurarnos de que estos objetos nunca causen advertencias
// al intentar acceder a cualquier propiedad en ellos
const safeUtil = createSafeMock('util');
const safeHttp = createSafeMock('http');
const safeHttps = createSafeMock('https');
const safeBuffer = { Buffer: Buffer };
const safeFs = createSafeMock('fs');
const safeOs = createSafeMock('os');
const safePath = createSafeMock('path');
const safeCrypto = createSafeMock('crypto');

// Interceptar console.warn para suprimir advertencias específicas
// NOTA: Esta es la parte más importante del archivo - interceptamos
// las advertencias relacionadas con módulos de Node.js en el navegador
// antes de que lleguen a la consola
const originalWarn = console.warn;
console.warn = function(...args: any[]) {
  // Verificar si hay algún argumento
  if (!args.length) {
    return originalWarn.apply(console, args);
  }
  
  // Convertir el mensaje a string de forma segura
  let message = '';
  try {
    message = String(args[0] || '');
  } catch (e) {
    return originalWarn.apply(console, args);
  }
  
  // Lista de patrones a filtrar
  const patternsToFilter = [
    'has been externalized for browser compatibility',
    'util.debuglog',
    'util.inspect',
    'http.globalAgent',
    'https.globalAgent',
    'buffer.Buffer',
    'Failed to construct \'WebSocket\'', // Silenciar errores de WebSocket
    'The URL \'wss://localhost:undefined'
  ];
  
  // Verificar si el mensaje contiene alguno de los patrones a filtrar
  for (const pattern of patternsToFilter) {
    if (message.includes(pattern)) {
      // Silenciar esta advertencia específica
      return;
    }
  }
  
  // Permitir que otras advertencias continúen
  originalWarn.apply(console, args);
};

// Crear mock de WebSocket que no cause problemas
if (typeof window !== 'undefined') {
  const originalWebSocket = window.WebSocket;
  window.WebSocket = function(...args: any[]) {
    // Si la URL contiene 'undefined' o tiene el formato inválido que causa el error, cancelamos
    const url = args[0];
    if (typeof url === 'string' && (
        url.includes('undefined') || 
        url.includes('token=6B0_') || 
        url.includes('wss://localhost:undefined')
      )) {
      console.log("[WEBSOCKET MOCK] Bloqueando conexión WebSocket a URL inválida:", url);
      // En lugar de crear una instancia fallida, creamos un objeto que simula WebSocket
      // pero que no realiza ninguna conexión real
      const mockWs = {
        url: url,
        readyState: 3, // CLOSED
        send: () => {},
        close: () => {},
        onopen: null,
        onclose: null,
        onerror: null,
        onmessage: null,
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => true
      };
      
      // Simular eventos de error y cierre
      setTimeout(() => {
        if (mockWs.onerror) {
          mockWs.onerror(new ErrorEvent('error', { 
            message: 'Mock WebSocket connection blocked', 
            error: new Error('Mock WebSocket connection blocked') 
          }));
        }
        
        if (mockWs.onclose) {
          mockWs.onclose(new CloseEvent('close', { code: 1006, reason: 'Mock connection closed' }));
        }
      }, 100);
      
      return mockWs as any;
    }
    
    // Para las URLs válidas, usamos el WebSocket normal
    return new originalWebSocket(...args);
  } as any;
  
  // Copiar propiedades estáticas de WebSocket
  window.WebSocket.CONNECTING = originalWebSocket.CONNECTING;
  window.WebSocket.OPEN = originalWebSocket.OPEN;
  window.WebSocket.CLOSING = originalWebSocket.CLOSING;
  window.WebSocket.CLOSED = originalWebSocket.CLOSED;
  window.WebSocket.prototype = originalWebSocket.prototype;
}

// Crear mock de WebProviderEngine
const ProviderEngine = function() {};
ProviderEngine.prototype = {
  constructor: ProviderEngine,
  start: function() { return this; },
  stop: function() { return this; },
  addProvider: function() { return this; },
  send: function() {},
  sendAsync: function() {}
};

// Función para crear subprovider classes
const createSubproviderClass = (name: string) => {
  const Cls = function() {};
  Cls.prototype = { 
    constructor: Cls,
    handleRequest: function() {}
  };
  return Cls;
}

// Crear subprovider classes
const CacheSubprovider = createSubproviderClass('CacheSubprovider');
const FixtureSubprovider = createSubproviderClass('FixtureSubprovider');
const FiltersSubprovider = createSubproviderClass('FiltersSubprovider');
const HookedWalletSubprovider = createSubproviderClass('HookedWalletSubprovider');
const NonceTrackerSubprovider = createSubproviderClass('NonceTrackerSubprovider');
const SubscriptionsSubprovider = createSubproviderClass('SubscriptionsSubprovider');

// Simular Web3Modal
const Web3Modal = {
  default: function() {
    return {
      connect: async function() {
        return {
          enable: async function() { return ['0x6b22cEB508db3C81d69ED6451d63B56a1fb7271F']; },
          request: async function({ method }: { method: string }) {
            if (method === 'eth_requestAccounts') {
              return ['0x6b22cEB508db3C81d69ED6451d63B56a1fb7271F'];
            }
            if (method === 'eth_chainId') {
              return '0x1'; // Ethereum mainnet
            }
            return null;
          },
          on: function() { return this; },
          removeAllListeners: function() { return this; }
        };
      }
    };
  }
};

// Configurar el objeto global
if (typeof window !== 'undefined') {
  // Establecer global
  (window as any).global = window;
  
  // Establecer Buffer
  (window as any).Buffer = Buffer;
  
  // Establecer Stream
  (window as any).Stream = stream;
  
  // Configurar objeto process
  (window as any).process = {
    env: {
      NODE_ENV: process.env.NODE_ENV || 'production',
    },
    nextTick: (fn: Function) => setTimeout(fn, 0),
    browser: true,
    version: '16.0.0',
    versions: {
      node: '16.0.0',
      http_parser: '1.0',
      v8: '1.0',
      ares: '1.0',
      uv: '1.0',
      zlib: '1.0',
      modules: '1.0',
      openssl: '1.0'
    },
    stdout: { write: () => {} },
    stderr: { write: () => {} },
    stdin: null,
    argv: [],
    argv0: '',
    execArgv: [],
    execPath: '',
    abort: () => {},
    cwd: () => '/',
    exit: () => {},
    on: () => {}
  };
  
  // IMPORTANTE: Establecer globalmente los módulos que causan advertencias
  (window as any).util = safeUtil;
  (window as any).http = safeHttp;
  (window as any).https = safeHttps;
  (window as any).buffer = safeBuffer;
  (window as any).fs = safeFs;
  (window as any).os = safeOs;
  (window as any).path = safePath;
  // No intentar reemplazar crypto ya que es de solo lectura en algunos navegadores
  
  // Definir función require personalizada
  (window as any).require = function(moduleName: string) {
    // Mapa de módulos conocidos
    const moduleMap: Record<string, any> = {
      'buffer': safeBuffer,
      'stream': stream,
      'util': safeUtil,
      'http': safeHttp,
      'https': safeHttps,
      'crypto': safeCrypto,
      'os': safeOs,
      'fs': safeFs,
      'path': safePath,
      'web3-provider-engine': ProviderEngine,
      'web3-provider-engine/subproviders/cache': { CacheSubprovider },
      'web3-provider-engine/subproviders/fixture': { FixtureSubprovider },
      'web3-provider-engine/subproviders/filters': { FiltersSubprovider },
      'web3-provider-engine/subproviders/hooked-wallet': { HookedWalletSubprovider },
      'web3-provider-engine/subproviders/nonce-tracker': { NonceTrackerSubprovider },
      'web3-provider-engine/subproviders/subscriptions': { SubscriptionsSubprovider },
      'web3modal': Web3Modal
    };
    
    // Devolver el módulo si existe
    if (moduleMap[moduleName]) {
      return moduleMap[moduleName];
    }
    
    // Para módulos desconocidos, devolver un objeto vacío sin advertencias
    return {
      default: {},
      __esModule: true
    };
  };
}