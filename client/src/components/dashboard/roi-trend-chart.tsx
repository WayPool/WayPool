import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '@/lib/ethereum';

interface RoiTrendChartProps {
  data: {
    date: string;
    roi: number;
  }[];
  isLoading?: boolean;
}

const RoiTrendChart: React.FC<RoiTrendChartProps> = ({
  data,
  isLoading = false
}) => {
  if (isLoading) {
    return (
      <div className="h-[140px] w-full bg-slate-200 dark:bg-slate-800 animate-pulse rounded-md"></div>
    );
  }

  // Personalización del tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-slate-900 p-2 border border-slate-200 dark:border-slate-700 rounded-md shadow-md">
          <p className="text-xs font-medium text-slate-700 dark:text-slate-300">{label}</p>
          <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
            ROI: {payload[0].value.toFixed(2)}%
          </p>
        </div>
      );
    }
  
    return null;
  };

  return (
    <div className="h-[140px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
          <XAxis 
            dataKey="date" 
            fontSize={10} 
            tick={{ fill: '#94a3b8' }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            fontSize={10}
            tickFormatter={(value) => `${value}%`}
            tick={{ fill: '#94a3b8' }}
            tickLine={false}
            axisLine={false}
            width={30}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line 
            type="monotone" 
            dataKey="roi" 
            stroke="#10b981" 
            strokeWidth={2}
            dot={{ r: 2, fill: '#10b981', stroke: '#10b981' }}
            activeDot={{ r: 4, stroke: '#10b981', strokeWidth: 2, fill: '#fff' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RoiTrendChart;