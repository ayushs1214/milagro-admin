import React from 'react';
import { PieChart as ReChartsPie, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';
import type { ChartData } from '../../types';

interface PieChartProps {
  data?: ChartData[];
  title: string;
}

const COLORS = ['#6366F1', '#8B5CF6', '#EC4899', '#F43F5E'];

export function PieChart({ data = [], title }: PieChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">{title}</h3>
        <div className="h-[300px] flex items-center justify-center">
          <p className="text-gray-500 dark:text-gray-400">No data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">{title}</h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <ReChartsPie>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              fill="#8884d8"
              paddingAngle={5}
              dataKey="value"
              label
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgb(31 41 55)', 
                border: 'none',
                borderRadius: '0.5rem',
                color: 'white'
              }}
            />
            <Legend />
          </ReChartsPie>
        </ResponsiveContainer>
      </div>
    </div>
  );
}