import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

// Tipo de datos para el gráfico
export interface PositionDistributionItem {
  name: string;
  value: number;
  color: string;
}

interface PositionDistributionChartProps {
  data: PositionDistributionItem[];
  innerRadius?: number;
  outerRadius?: number;
  className?: string;
}

// Componente personalizado para el tooltip
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-md shadow-md p-2 text-xs">
        <p className="font-medium">{payload[0].name}</p>
        <p className="text-muted-foreground">
          <span className="font-medium">{payload[0].value}</span> position{payload[0].value !== 1 ? 's' : ''}
        </p>
      </div>
    );
  }

  return null;
};

const PositionDistributionChart = ({ 
  data, 
  innerRadius = 60, 
  outerRadius = 80,
  className 
}: PositionDistributionChartProps) => {
  // Si no hay datos o todos los valores son 0, mostrar un mensaje
  const hasData = data.length > 0 && data.some(item => item.value > 0);

  if (!hasData) {
    return (
      <div className={`flex items-center justify-center h-full ${className}`}>
        <p className="text-sm text-muted-foreground">No active positions</p>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            paddingAngle={2}
            dataKey="value"
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
        <p className="text-xl font-bold">{data.reduce((acc, curr) => acc + curr.value, 0)}</p>
        <p className="text-xs text-muted-foreground">Total</p>
      </div>
    </div>
  );
};

export default PositionDistributionChart;