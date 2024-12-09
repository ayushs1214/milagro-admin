import React from 'react';
import { Calendar } from 'lucide-react';

interface DateFilterProps {
  startDate: string;
  endDate: string;
  onChange: (start: string, end: string) => void;
}

export function DateFilter({ startDate, endDate, onChange }: DateFilterProps) {
  return (
    <div className="flex items-center space-x-2">
      <Calendar className="w-5 h-5 text-gray-400" />
      <input
        type="date"
        value={startDate}
        onChange={(e) => onChange(e.target.value, endDate)}
        className="px-3 py-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
      />
      <span className="text-gray-500 dark:text-gray-400">to</span>
      <input
        type="date"
        value={endDate}
        onChange={(e) => onChange(startDate, e.target.value)}
        className="px-3 py-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
      />
    </div>
  );
}