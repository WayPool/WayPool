import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '@/lib/ethereum';
import { useTranslation } from '@/hooks/use-translation';

interface CapitalVsBenefitsChartProps {
  capital: number;
  benefits: number;
}

const CapitalVsBenefitsChart: React.FC<CapitalVsBenefitsChartProps> = ({
  capital,
  benefits
}) => {
  const { t, language } = useTranslation();
  
  // Colores para el gráfico (azul para capital, verde para beneficios)
  const COLORS = ['#3b82f6', '#10b981'];
  
  // Datos para el gráfico circular
  const data = [
    { 
      name: language === 'en' ? 'Capital' : 
            language === 'es' ? 'Capital' : 
            language === 'fr' ? 'Capital' : 
            'Kapital',
      value: capital 
    },
    { 
      name: language === 'en' ? 'Benefits' : 
            language === 'es' ? 'Beneficios' : 
            language === 'fr' ? 'Bénéfices' : 
            'Erträge', 
      value: benefits 
    },
  ];

  // Calculamos los porcentajes exactos con un decimal para mayor precisión
  const total = capital + benefits;
  // Calculamos sin redondear para evitar que la suma sea distinta de 100%
  const capitalPercentageExact = total > 0 ? (capital / total) * 100 : 0;
  const benefitsPercentageExact = total > 0 ? (benefits / total) * 100 : 0;
  
  // Para mostrar, redondeamos a un decimal
  const capitalPercentage = Math.round(capitalPercentageExact * 10) / 10;
  const benefitsPercentage = Math.round(benefitsPercentageExact * 10) / 10;

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
  
    // Usamos el porcentaje calculado con precisión decimal
    const percentageValue = index === 0 ? capitalPercentageExact : benefitsPercentageExact;
    
    // Formateamos el porcentaje con un decimal
    const formattedPercentage = percentageValue.toFixed(1);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor="middle" 
        dominantBaseline="central"
        fontSize={18}
        fontWeight="bold"
      >
        {`${formattedPercentage}%`}
      </text>
    );
  };

  return (
    <div className="flex flex-col items-center w-full h-full">
      <div className="w-full flex-1 flex items-center justify-center relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={70}
              innerRadius={30}
              fill="#8884d8"
              dataKey="value"
              strokeWidth={0}
              paddingAngle={3}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[index % COLORS.length]}
                  className="drop-shadow-md"
                  stroke="rgba(0,0,0,0.1)"
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      
      {/* Leyenda con valores */}
      <div className="w-full flex justify-between items-center mt-4 px-2">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
          <span className="text-sm text-slate-300">
            {language === 'en' && 'Capital:'}
            {language === 'es' && 'Capital:'}
            {language === 'fr' && 'Capital:'}
            {language === 'de' && 'Kapital:'}
          </span>
          <span className="text-sm font-medium text-slate-200">{formatCurrency(capital)}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span className="text-sm text-slate-300">
        {language === 'en' ? 'Benefits:' : 
         language === 'es' ? 'Beneficios:' : 
         language === 'fr' ? 'Bénéfices:' : 
         'Erträge:'}
      </span>
          <span className="text-sm font-medium text-slate-200">{formatCurrency(benefits)}</span>
        </div>
      </div>
    </div>
  );
};

export default CapitalVsBenefitsChart;