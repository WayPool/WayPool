import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '@/lib/utils';

interface ProjectedEarningsChartProps {
  dailyEarnings: number;
  weeklyEarnings: number;
  monthlyEarnings: number;
  yearlyEarnings: number;
  isLoading?: boolean;
}

const ProjectedEarningsChart: React.FC<ProjectedEarningsChartProps> = ({
  dailyEarnings,
  weeklyEarnings,
  monthlyEarnings,
  yearlyEarnings,
  isLoading = false
}) => {
  if (isLoading) {
    return (
      <div className="h-[140px] w-full bg-slate-200 dark:bg-slate-800 animate-pulse rounded-md"></div>
    );
  }

  // Datos para el gráfico de barras
  const data = [
    { name: 'Daily', value: dailyEarnings },
    { name: 'Weekly', value: weeklyEarnings },
    { name: 'Monthly', value: monthlyEarnings },
    { name: 'Yearly', value: yearlyEarnings },
  ];

  // Personalización del tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-slate-900 p-2 border border-slate-200 dark:border-slate-700 rounded-md shadow-md">
          <p className="text-xs font-medium">{`${label} : ${formatCurrency(payload[0].value)}`}</p>
        </div>
      );
    }
  
    return null;
  };

  return (
    <div className="h-[140px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 10, right: 0, left: 0, bottom: 20 }}
        >
          <XAxis 
            dataKey="name" 
            fontSize={10} 
            tick={{ fill: '#94a3b8' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis 
            hide={true}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar 
            dataKey="value" 
            fill="#8b5cf6" 
            radius={[4, 4, 0, 0]} 
            barSize={30}
            animationDuration={800}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProjectedEarningsChart;