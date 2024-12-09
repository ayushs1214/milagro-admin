import React from 'react';
import { LineChart, PieChart } from '../components/Dashboard/Charts';
import { mockChartData } from '../store/mockData';

export function Analytics() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Analytics</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Revenue Trend</h2>
          <LineChart data={mockChartData.revenue} />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">User Growth</h2>
          <LineChart data={mockChartData.users} />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">User Distribution</h2>
          <PieChart data={mockChartData.userTypes} />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Order Status</h2>
          <PieChart data={mockChartData.orderStatus} />
        </div>
      </div>
    </div>
  );
}