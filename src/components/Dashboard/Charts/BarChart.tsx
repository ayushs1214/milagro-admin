import React from 'react';
import { BarChart as ReChartsBar, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { ChartData } from '../../../types';

interface BarChartProps {
  data: ChartData[];
}

export function BarChart({ data }: BarChartProps) {
  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <ReChartsBar data={data}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
          <XAxis 
            dataKey="name" 
            className="text-gray-600 dark:text-gray-400"
          />
          <YAxis 
            className="text-gray-600 dark:text-gray-400"
          />
          <Tooltip
            contentStyle={{ 
              backgroundColor: 'rgb(31 41 55)', 
              border: 'none',
              borderRadius: '0.5rem',
              color: 'white'
            }}
          />
          <Bar dataKey="value" fill="#6366F1" radius={[4, 4, 0, 0]} />
        </ReChartsBar>
      </ResponsiveContainer>
    </div>
  );
}