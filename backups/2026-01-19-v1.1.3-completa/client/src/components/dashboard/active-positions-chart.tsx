import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface ActivePositionsChartProps {
  activePositionsCount: number;
  poolsCount: number;
  isLoading?: boolean;
}

const ActivePositionsChart: React.FC<ActivePositionsChartProps> = ({
  activePositionsCount,
  poolsCount,
  isLoading = false
}) => {
  // Colores para el gráfico (morado y azul)
  const COLORS = ['#8b5cf6', '#3b82f6'];
  
  if (isLoading) {
    return (
      <div className="h-[180px] w-full flex items-center justify-center">
        <div className="h-[140px] w-[140px] bg-slate-200 dark:bg-slate-800 animate-pulse rounded-full"></div>
      </div>
    );
  }

  // Datos para el gráfico circular
  const data = [
    { name: 'Positions', value: activePositionsCount },
  ];

  return (
    <div className="h-[180px] w-full flex flex-col items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={70}
            paddingAngle={0}
            dataKey="value"
            startAngle={90}
            endAngle={-270}
          >
            <Cell key={`cell-0`} fill={COLORS[0]} />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      
      <div className="absolute flex flex-col items-center justify-center">
        <span className="text-4xl font-bold text-slate-900 dark:text-white">{activePositionsCount}</span>
        <span className="text-sm text-slate-500 dark:text-slate-400">Total</span>
      </div>
      
      <div className="mt-2 bg-indigo-500/20 dark:bg-indigo-800/30 rounded-full px-4 py-1 text-sm font-medium text-indigo-700 dark:text-indigo-300">
        {poolsCount} pools
      </div>
    </div>
  );
};

export default ActivePositionsChart;