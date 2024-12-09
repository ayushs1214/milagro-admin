import React from 'react';
import { LineChart as ReChartsLine, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { ChartData } from '../../../types';

interface LineChartProps {
  data: ChartData[];
}

export function LineChart({ data }: LineChartProps) {
  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <ReChartsLine data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366F1" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
            </linearGradient>
          </defs>
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
          <Line 
            type="monotone" 
            dataKey="value" 
            stroke="#6366F1" 
            strokeWidth={2}
            dot={{ fill: '#6366F1', strokeWidth: 2 }}
            activeDot={{ r: 6, fill: '#6366F1' }}
          />
        </ReChartsLine>
      </ResponsiveContainer>
    </div>
  );
}