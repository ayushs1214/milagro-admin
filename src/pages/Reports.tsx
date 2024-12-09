import React from 'react';
import { FileText, Download, Filter } from 'lucide-react';

export function Reports() {
  const reports = [
    {
      id: '1',
      name: 'Monthly Sales Report',
      description: 'Detailed breakdown of sales performance',
      date: '2024-03-15',
      type: 'Sales'
    },
    {
      id: '2',
      name: 'User Activity Report',
      description: 'Analysis of user engagement and behavior',
      date: '2024-03-14',
      type: 'Users'
    },
    {
      id: '3',
      name: 'Inventory Status Report',
      description: 'Current stock levels and movement',
      date: '2024-03-13',
      type: 'Inventory'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Reports</h1>
        <div className="flex space-x-4">
          <button className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
            <Filter className="w-5 h-5 mr-2" />
            Filter
          </button>
          <button className="flex items-center px-4 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700">
            <FileText className="w-5 h-5 mr-2" />
            Generate Report
          </button>
        </div>
      </div>

      <div className="grid gap-6">
        {reports.map((report) => (
          <div
            key={report.id}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200"
          >
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    {report.name}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {report.description}
                  </p>
                </div>
                <button className="flex items-center px-4 py-2 text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300">
                  <Download className="w-5 h-5 mr-2" />
                  Download
                </button>
              </div>
              <div className="mt-4 flex items-center justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">
                  Generated on {new Date(report.date).toLocaleDateString()}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-400">
                  {report.type}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}