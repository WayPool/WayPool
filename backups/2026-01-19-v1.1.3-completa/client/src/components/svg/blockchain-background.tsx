// Componente SVG para fondos estilo blockchain
export function BlockchainBackground({ className = "" }: { className?: string }) {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 1200 600"
      xmlns="http://www.w3.org/2000/svg"
      className={`absolute inset-0 z-0 opacity-10 ${className}`}
    >
      <defs>
        <linearGradient id="grid-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.2" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.1" />
        </linearGradient>
      </defs>
      
      {/* Líneas de cuadrícula */}
      <g stroke="url(#grid-gradient)" strokeWidth="1">
        {Array.from({ length: 20 }).map((_, i) => (
          <line 
            key={`h-${i}`} 
            x1="0" 
            y1={i * 30} 
            x2="1200" 
            y2={i * 30} 
          />
        ))}
        {Array.from({ length: 40 }).map((_, i) => (
          <line 
            key={`v-${i}`} 
            x1={i * 30} 
            y1="0" 
            x2={i * 30} 
            y2="600" 
          />
        ))}
      </g>
      
      {/* Nodos de la blockchain */}
      <g className="blockchain-nodes">
        {Array.from({ length: 20 }).map((_, i) => (
          <circle
            key={`node-${i}`}
            cx={150 + Math.sin(i * 0.5) * 400}
            cy={300 + Math.cos(i * 0.5) * 200}
            r="5"
            fill="currentColor"
          />
        ))}
      </g>
      
      {/* Conexiones entre nodos */}
      <g stroke="currentColor" strokeWidth="1" opacity="0.2">
        {Array.from({ length: 19 }).map((_, i) => (
          <line
            key={`connection-${i}`}
            x1={150 + Math.sin(i * 0.5) * 400}
            y1={300 + Math.cos(i * 0.5) * 200}
            x2={150 + Math.sin((i + 1) * 0.5) * 400}
            y2={300 + Math.cos((i + 1) * 0.5) * 200}
          />
        ))}
      </g>
      
      {/* Hexágonos (simbolizando bloques) */}
      <g fill="none" stroke="currentColor" strokeWidth="1" opacity="0.3">
        {Array.from({ length: 10 }).map((_, i) => {
          const x = 600 + Math.cos(i * Math.PI / 5) * 200;
          const y = 300 + Math.sin(i * Math.PI / 5) * 200;
          return (
            <polygon
              key={`hex-${i}`}
              points={`
                ${x},${y - 30}
                ${x + 26},${y - 15}
                ${x + 26},${y + 15}
                ${x},${y + 30}
                ${x - 26},${y + 15}
                ${x - 26},${y - 15}
              `}
            />
          );
        })}
      </g>
    </svg>
  );
}

// Componente SVG para el banner con aspecto blockchain
export function BlockchainBanner({ className = "" }: { className?: string }) {
  return (
    <svg
      width="100%"
      height="200"
      viewBox="0 0 1200 200"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="banner-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.05" />
          <stop offset="50%" stopColor="currentColor" stopOpacity="0.1" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.05" />
        </linearGradient>
      </defs>
      
      <rect width="100%" height="100%" fill="url(#banner-gradient)" />
      
      {/* Líneas hexagonales */}
      <g stroke="currentColor" strokeWidth="1" opacity="0.2">
        {Array.from({ length: 8 }).map((_, i) => {
          const y = 25 * i;
          return (
            <path
              key={`hex-line-${i}`}
              d={`M0,${y} Q300,${y + 50} 600,${y} T1200,${y}`}
              fill="none"
            />
          );
        })}
      </g>
      
      {/* Puntos (datos) */}
      <g fill="currentColor" opacity="0.3">
        {Array.from({ length: 60 }).map((_, i) => {
          const x = (1200 / 60) * i;
          const y = 100 + Math.sin(i * 0.2) * 50;
          return (
            <circle
              key={`data-${i}`}
              cx={x}
              cy={y}
              r="1.5"
            />
          );
        })}
      </g>
      
      {/* Cubo 3D simplificado (símbolo blockchain) */}
      <g transform="translate(1100, 100) scale(0.4)" opacity="0.7" stroke="currentColor" strokeWidth="2" fill="none">
        <path d="M0,-50 L43.3,-25 L43.3,25 L0,50 L-43.3,25 L-43.3,-25 Z" />
        <path d="M0,-50 L0,50" />
        <path d="M43.3,-25 L-43.3,25" />
        <path d="M-43.3,-25 L43.3,25" />
      </g>
    </svg>
  );
}