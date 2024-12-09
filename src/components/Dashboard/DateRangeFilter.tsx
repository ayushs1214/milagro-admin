import React, { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import type { DateRange } from '../../types';

interface DateRangeFilterProps {
  onChange: (range: DateRange) => void;
  value: DateRange;
}

export function DateRangeFilter({ onChange, value }: DateRangeFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [month, setMonth] = useState(new Date());

  const presetRanges = [
    { label: 'Today', days: 0 },
    { label: 'Last 7 Days', days: 7 },
    { label: 'Last 30 Days', days: 30 },
    { label: 'Last 90 Days', days: 90 }
  ];

  const handlePresetClick = (days: number) => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - days);
    
    onChange({
      start: start.toISOString().split('T')[0],
      end: end.toISOString().split('T')[0]
    });
    setIsOpen(false);
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    return { daysInMonth, firstDay };
  };

  const { daysInMonth, firstDay } = getDaysInMonth(month);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDay }, (_, i) => i);

  const nextMonth = () => {
    setMonth(new Date(month.setMonth(month.getMonth() + 1)));
  };

  const prevMonth = () => {
    setMonth(new Date(month.setMonth(month.getMonth() - 1)));
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
      >
        <Calendar className="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400" />
        <span className="text-sm text-gray-700 dark:text-gray-200">
          {value.start} - {value.end}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10">
          <div className="p-4">
            <div className="flex justify-between items-center mb-4">
              <button onClick={prevMonth} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
                <ChevronLeft className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </button>
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                {month.toLocaleString('default', { month: 'long', year: 'numeric' })}
              </h3>
              <button onClick={nextMonth} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
                <ChevronRight className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-2">
              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                <div key={day} className="text-xs font-medium text-gray-500 dark:text-gray-400 text-center py-1">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {blanks.map(blank => (
                <div key={`blank-${blank}`} className="h-8" />
              ))}
              {days.map(day => (
                <button
                  key={day}
                  onClick={() => {
                    const selectedDate = new Date(month.getFullYear(), month.getMonth(), day);
                    onChange({
                      ...value,
                      start: selectedDate.toISOString().split('T')[0]
                    });
                  }}
                  className={`h-8 text-sm rounded-full hover:bg-indigo-50 dark:hover:bg-indigo-900/20 
                    ${value.start === new Date(month.getFullYear(), month.getMonth(), day).toISOString().split('T')[0]
                      ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                      : 'text-gray-700 dark:text-gray-200'}`}
                >
                  {day}
                </button>
              ))}
            </div>

            <div className="mt-4">
              <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Quick Select
              </div>
              <div className="grid grid-cols-2 gap-2">
                {presetRanges.map(({ label, days }) => (
                  <button
                    key={label}
                    onClick={() => handlePresetClick(days)}
                    className="px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}