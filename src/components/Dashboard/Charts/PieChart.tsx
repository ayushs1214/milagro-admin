import React from 'react';
import { PieChart as ReChartsPie, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';
import type { ChartData } from '../../../types';

interface PieChartProps {
  data: ChartData[];
}

const COLORS = ['#6366F1', '#8B5CF6', '#EC4899', '#F43F5E'];

export function PieChart({ data }: PieChartProps) {
  return (
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
  );
}