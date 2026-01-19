// Iconos específicos para la página algorithm-details

// Icono para ilustrar múltiples pools
export function MultiPoolIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 120"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      fill="none"
    >
      <g stroke="currentColor" strokeWidth="2">
        {/* Pool 1 */}
        <circle cx="40" cy="40" r="20" opacity="0.8" />
        <path d="M40,20 v40" opacity="0.6" />
        <path d="M20,40 h40" opacity="0.6" />
        
        {/* Pool 2 */}
        <circle cx="80" cy="40" r="20" opacity="0.8" />
        <path d="M80,20 v40" opacity="0.6" />
        <path d="M60,40 h40" opacity="0.6" />
        
        {/* Pool 3 */}
        <circle cx="40" cy="80" r="20" opacity="0.8" />
        <path d="M40,60 v40" opacity="0.6" />
        <path d="M20,80 h40" opacity="0.6" />
        
        {/* Pool 4 */}
        <circle cx="80" cy="80" r="20" opacity="0.8" />
        <path d="M80,60 v40" opacity="0.6" />
        <path d="M60,80 h40" opacity="0.6" />
        
        {/* Conexiones entre pools */}
        <path d="M55,55 l10,10" strokeWidth="1.5" opacity="0.6" strokeDasharray="3,3" />
        <path d="M55,65 l10,-10" strokeWidth="1.5" opacity="0.6" strokeDasharray="3,3" />
        <path d="M45,55 l-10,10" strokeWidth="1.5" opacity="0.6" strokeDasharray="3,3" />
        <path d="M75,55 l10,10" strokeWidth="1.5" opacity="0.6" strokeDasharray="3,3" />
      </g>
    </svg>
  );
}

// Icono para ilustrar prevención de pérdida permanente
export function LossPreventionIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 120"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      fill="none"
    >
      <g stroke="currentColor">
        {/* Escudo */}
        <path 
          d="M60,15 
             L20,30 
             v35 
             c0,20 15,38 40,48 
             c25,-10 40,-28 40,-48 
             v-35 
             L60,15z" 
          strokeWidth="2" 
          opacity="0.8" 
        />
        
        {/* Gráfico de precio */}
        <path 
          d="M40,60 
             L50,50 
             L60,65 
             L70,45 
             L80,55" 
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity="0.9"
        />
        
        {/* Flechas equilibrio */}
        <path d="M35,75 h50" strokeWidth="1.5" opacity="0.6" />
        <path d="M35,75 l5,-5 l-5,5 l5,5" strokeWidth="1.5" opacity="0.6" />
        <path d="M85,75 l-5,-5 l5,5 l-5,5" strokeWidth="1.5" opacity="0.6" />
      </g>
    </svg>
  );
}

// Icono para la sección de NFT
export function NFTIntegrationIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 120"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      fill="none"
    >
      <g stroke="currentColor" strokeWidth="2">
        {/* Marco del NFT */}
        <rect x="20" y="20" width="80" height="80" rx="5" opacity="0.8" />
        
        {/* Código QR estilizado */}
        <rect x="35" y="35" width="20" height="20" opacity="0.7" />
        <rect x="65" y="35" width="20" height="20" opacity="0.7" />
        <rect x="35" y="65" width="20" height="20" opacity="0.7" />
        <rect x="65" y="65" width="5" height="5" opacity="0.7" />
        <rect x="75" y="65" width="10" height="5" opacity="0.7" />
        <rect x="65" y="75" width="5" height="10" opacity="0.7" />
        <rect x="75" y="75" width="10" height="10" opacity="0.7" />
        
        {/* Hexágono (símbolo blockchain) */}
        <path 
          d="M60,50 
             L70,55 
             L70,65 
             L60,70 
             L50,65 
             L50,55 
             Z" 
          opacity="0.6" 
          strokeDasharray="2,2"
        />
      </g>
    </svg>
  );
}

// Icono para el resumen/overview
export function AlgorithmOverviewIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 120"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      fill="none"
    >
      <g stroke="currentColor" strokeWidth="2">
        {/* Diagrama de flujo simple */}
        <rect x="45" y="15" width="30" height="20" rx="3" opacity="0.8" />
        <line x1="60" y1="35" x2="60" y2="45" opacity="0.6" />
        
        <circle cx="60" cy="55" r="10" opacity="0.8" />
        <line x1="60" y1="65" x2="60" y2="75" opacity="0.6" />
        
        {/* Bifurcación */}
        <line x1="60" y1="75" x2="40" y2="85" opacity="0.6" />
        <line x1="60" y1="75" x2="80" y2="85" opacity="0.6" />
        
        <rect x="30" y="85" width="20" height="20" rx="3" opacity="0.8" />
        <rect x="70" y="85" width="20" height="20" rx="3" opacity="0.8" />
        
        {/* Conexión final */}
        <line x1="40" y1="105" x2="40" y2="110" opacity="0.6" />
        <line x1="80" y1="105" x2="80" y2="110" opacity="0.6" />
        <line x1="40" y1="110" x2="80" y2="110" opacity="0.6" />
      </g>
    </svg>
  );
}