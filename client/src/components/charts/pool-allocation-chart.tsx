import React from "react";

// Un componente simple de gráfico de asignación de pools
// En una implementación real, utilizaríamos recharts o alguna otra librería de gráficos
export default function PoolAllocationChart() {
  const pools = [
    { name: "ETH/USDC", percentage: 35, color: "#6384e8" },
    { name: "BTC/ETH", percentage: 25, color: "#bd7aff" },
    { name: "ETH/USDT", percentage: 20, color: "#60a5fa" },
    { name: "SOL/USDC", percentage: 15, color: "#a78bfa" },
    { name: "Others", percentage: 5, color: "#818cf8" },
  ];

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex-1 flex items-center justify-center">
        <div className="relative w-48 h-48">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {/* Dibujamos el gráfico circular */}
            {pools.reduce((acc, pool, i) => {
              const prevTotal = i === 0 ? 0 : acc.total;
              const total = prevTotal + pool.percentage;
              
              // Calcular los ángulos para el arco
              const startAngle = (prevTotal / 100) * 360;
              const endAngle = (total / 100) * 360;
              
              // Convertir a radianes
              const startRad = ((startAngle - 90) * Math.PI) / 180;
              const endRad = ((endAngle - 90) * Math.PI) / 180;
              
              // Calcular los puntos del arco
              const x1 = 50 + 40 * Math.cos(startRad);
              const y1 = 50 + 40 * Math.sin(startRad);
              const x2 = 50 + 40 * Math.cos(endRad);
              const y2 = 50 + 40 * Math.sin(endRad);
              
              // Determinar si el arco es mayor que 180 grados
              const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;
              
              // Crear el path para el sector
              const path = `
                M 50 50
                L ${x1} ${y1}
                A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2}
                Z
              `;
              
              acc.paths.push(
                <path
                  key={i}
                  d={path}
                  fill={pool.color}
                  stroke="#ffffff"
                  strokeWidth="1"
                />
              );
              
              return { paths: acc.paths, total };
            }, { paths: [] as React.ReactNode[], total: 0 }).paths}
            
            {/* Círculo central para efecto donut */}
            <circle cx="50" cy="50" r="20" fill="var(--background)" />
          </svg>
        </div>
      </div>
      
      <div className="mt-4 grid grid-cols-2 gap-2">
        {pools.map((pool, i) => (
          <div key={i} className="flex items-center text-sm">
            <div
              className="w-3 h-3 rounded-full mr-2"
              style={{ backgroundColor: pool.color }}
            ></div>
            <span className="whitespace-nowrap">{pool.name} ({pool.percentage}%)</span>
          </div>
        ))}
      </div>
    </div>
  );
}