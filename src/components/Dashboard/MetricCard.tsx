import React from 'react';
import { Users, ShoppingCart, DollarSign, Clock } from 'lucide-react';
import type { Metric } from '../../types';

const iconMap = {
  'users': Users,
  'shopping-cart': ShoppingCart,
  'dollar-sign': DollarSign,
  'clock': Clock
};

interface MetricCardProps {
  metric: Metric;
  onClick: () => void;
}

export function MetricCard({ metric, onClick }: MetricCardProps) {
  const Icon = iconMap[metric.icon as keyof typeof iconMap];
  const isPositive = metric.change > 0;
  const hasChange = metric.change !== 0;

  return (
    <button
      onClick={onClick}
      className="relative w-full overflow-hidden bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200 group"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 dark:from-indigo-500/10 dark:to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl">
            <Icon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          </div>
          {hasChange && (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              isPositive 
                ? 'text-green-800 dark:text-green-400 bg-green-100 dark:bg-green-900/20' 
                : 'text-red-800 dark:text-red-400 bg-red-100 dark:bg-red-900/20'
            }`}>
              {isPositive ? '+' : ''}{metric.change}%
            </span>
          )}
        </div>

        <div className="space-y-1">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{metric.label}</p>
          <p className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
            {metric.icon === 'dollar-sign' ? `₹${metric.value.toLocaleString()}` : metric.value.toLocaleString()}
          </p>
        </div>

        {hasChange && (
          <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
            vs. previous month
          </div>
        )}
      </div>
    </button>
  );
}