import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '@/lib/ethereum';

interface CumulativeEarningsChartProps {
  data: {
    date: string;
    value: number;
  }[];
  isLoading?: boolean;
}

const CumulativeEarningsChart: React.FC<CumulativeEarningsChartProps> = ({
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
          <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
            {formatCurrency(payload[0].value)}
          </p>
        </div>
      );
    }
  
    return null;
  };

  return (
    <div className="h-[140px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1}/>
            </linearGradient>
          </defs>
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
            tickFormatter={(value) => formatCurrency(value, true)}
            tick={{ fill: '#94a3b8' }}
            tickLine={false}
            axisLine={false}
            width={50}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area 
            type="monotone" 
            dataKey="value" 
            stroke="#8884d8" 
            fillOpacity={1} 
            fill="url(#colorValue)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CumulativeEarningsChart;