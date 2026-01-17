import { useState, useEffect } from "react";

interface AnimatedChartProps {
  className?: string;
  type: "liquidity" | "balance" | "poolPerformance";
}

export function AnimatedChart({ className = "", type }: AnimatedChartProps) {
  const [step, setStep] = useState(0);
  
  // Animación simple
  useEffect(() => {
    const timer = setInterval(() => {
      setStep((prev) => (prev + 1) % 10);
    }, 1500);
    
    return () => clearInterval(timer);
  }, []);
  
  // Generadores de datos para cada tipo de gráfico
  const generateData = () => {
    switch (type) {
      case "liquidity":
        return Array.from({ length: 10 }).map((_, i) => {
          // Emula la distribución de liquidez
          const height = 15 + Math.sin((i + step) * 0.6) * 10 + Math.random() * 5;
          return { height, opacity: i === 4 || i === 5 ? 0.9 : 0.6 };
        });
        
      case "balance":
        return {
          pool1: 30 + Math.sin(step * 0.8) * 10,
          pool2: 70 - Math.sin(step * 0.8) * 10
        };
        
      case "poolPerformance":
        return Array.from({ length: 8 }).map((_, i) => {
          // Emula tendencia de rendimiento
          return step + i * 5 + Math.sin((step + i) * 0.5) * 10;
        });
        
      default:
        return [];
    }
  };
  
  const data = generateData();
  
  if (type === "liquidity") {
    return (
      <div className={`h-32 w-full flex items-end justify-between ${className}`}>
        {(data as Array<{height: number, opacity: number}>).map((bar, i) => (
          <div 
            key={i} 
            className="w-4 md:w-6 bg-primary rounded-t-md transition-all duration-700 ease-in-out"
            style={{ 
              height: `${bar.height}%`, 
              opacity: bar.opacity
            }}
          />
        ))}
      </div>
    );
  }
  
  if (type === "balance") {
    const balanceData = data as {pool1: number, pool2: number};
    return (
      <div className={`h-32 w-full ${className}`}>
        <div className="flex h-full">
          <div 
            className="bg-primary/70 transition-all duration-700 ease-in-out rounded-l-md flex items-center justify-center text-white text-xs md:text-sm font-medium"
            style={{ width: `${balanceData.pool1}%` }}
          >
            {Math.round(balanceData.pool1)}%
          </div>
          <div 
            className="bg-blue-500/70 transition-all duration-700 ease-in-out rounded-r-md flex items-center justify-center text-white text-xs md:text-sm font-medium"
            style={{ width: `${balanceData.pool2}%` }}
          >
            {Math.round(balanceData.pool2)}%
          </div>
        </div>
        <div className="flex justify-between mt-2 text-xs text-muted-foreground">
          <span>Pool A</span>
          <span>Distribución dinámica</span>
          <span>Pool B</span>
        </div>
      </div>
    );
  }
  
  if (type === "poolPerformance") {
    const points = data as number[];
    const maxPoint = Math.max(...points);
    const minPoint = Math.min(...points);
    const range = maxPoint - minPoint;
    
    // Generar puntos para el SVG path
    const path = points.map((p, i) => {
      const x = (i / (points.length - 1)) * 100;
      const y = 100 - ((p - minPoint) / range) * 100;
      return `${x},${y}`;
    }).join(" L ");
    
    return (
      <div className={`h-32 w-full ${className}`}>
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <linearGradient id="performanceGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgb(var(--primary))" stopOpacity="0.5" />
              <stop offset="100%" stopColor="rgb(var(--primary))" stopOpacity="0.1" />
            </linearGradient>
          </defs>
          
          {/* Área bajo la curva */}
          <path 
            d={`M 0,100 L ${path} L 100,100 Z`} 
            fill="url(#performanceGradient)" 
            className="transition-all duration-700 ease-in-out"
          />
          
          {/* Línea de rendimiento */}
          <path 
            d={`M ${path}`} 
            fill="none" 
            stroke="rgb(var(--primary))" 
            strokeWidth="2" 
            className="transition-all duration-700 ease-in-out"
          />
          
          {/* Puntos de datos */}
          {points.map((p, i) => {
            const x = (i / (points.length - 1)) * 100;
            const y = 100 - ((p - minPoint) / range) * 100;
            return (
              <circle 
                key={i} 
                cx={x} 
                cy={y} 
                r="1.5" 
                fill="rgb(var(--primary))" 
                className="transition-all duration-700 ease-in-out"
              />
            );
          })}
        </svg>
        <div className="flex justify-between mt-2 text-xs text-muted-foreground">
          <span>Inicio</span>
          <span>Rendimiento a lo largo del tiempo</span>
          <span>Ahora</span>
        </div>
      </div>
    );
  }
  
  return null;
}