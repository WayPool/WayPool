import React from 'react';
import { BarChart, Bar, XAxis, YAxis, LabelList, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { formatCurrency } from '@/lib/ethereum';

interface PerformanceData {
  name: string;
  apr: number;
  color: string;
}

interface PerformanceComparisonChartProps {
  data: PerformanceData[];
  isLoading?: boolean;
}

const PerformanceComparisonChart: React.FC<PerformanceComparisonChartProps> = ({
  data,
  isLoading = false
}) => {
  if (isLoading) {
    return (
      <div className="h-[140px] w-full bg-slate-200 dark:bg-slate-800 animate-pulse rounded-md"></div>
    );
  }

  // Ordenamos los datos por APR de mayor a menor
  const sortedData = [...data].sort((a, b) => b.apr - a.apr);

  // Personalización del tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-slate-900 p-2 border border-slate-200 dark:border-slate-700 rounded-md shadow-md">
          <p className="text-xs font-medium text-slate-700 dark:text-slate-300">{payload[0].payload.name}</p>
          <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
            APR: {payload[0].value.toFixed(2)}%
          </p>
        </div>
      );
    }
  
    return null;
  };

  return (
    <div className="h-[140px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={sortedData}
          layout="vertical"
          margin={{ top: 5, right: 25, left: 0, bottom: 5 }}
        >
          <XAxis 
            type="number"
            fontSize={10} 
            tick={{ fill: '#94a3b8' }}
            tickLine={false}
            axisLine={false}
            domain={[0, 'dataMax + 5']}
            tickFormatter={(value) => `${value}%`}
          />
          <YAxis 
            dataKey="name"
            type="category"
            fontSize={10}
            tick={{ fill: '#94a3b8' }}
            tickLine={false}
            axisLine={false}
            width={70}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar 
            dataKey="apr" 
            barSize={12} 
            radius={[0, 4, 4, 0]}
          >
            {
              sortedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))
            }
            <LabelList 
              dataKey="apr" 
              position="right" 
              formatter={(value: number) => `${value.toFixed(1)}%`}
              style={{ fontSize: '10px', fill: '#94a3b8' }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PerformanceComparisonChart;