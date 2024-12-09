import React, { useState } from 'react';
import { Package, Truck, CheckCircle, AlertCircle } from 'lucide-react';

interface Sample {
  id: string;
  productName: string;
  requestedBy: string;
  status: 'pending' | 'shipped' | 'delivered' | 'feedback_received';
  trackingNumber?: string;
  requestDate: string;
  image: string;
}

export function SampleProductManager() {
  const [samples, setSamples] = useState<Sample[]>([
    {
      id: '1',
      productName: 'Ergonomic Office Chair',
      requestedBy: 'John Smith',
      status: 'shipped',
      trackingNumber: 'TRK123456789',
      requestDate: '2024-03-10',
      image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&q=80&w=300&h=200'
    },
    // Add more samples as needed
  ]);

  const getStatusColor = (status: Sample['status']) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/20';
      case 'shipped':
        return 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/20';
      case 'delivered':
        return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/20';
      case 'feedback_received':
        return 'text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/20';
      default:
        return 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-900/20';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Sample Management</h2>
        <div className="flex space-x-3">
          <button className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
            Export Report
          </button>
          <button className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700">
            New Sample Request
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {samples.map((sample) => (
          <div key={sample.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <div className="flex items-center space-x-4">
              <img
                src={sample.image}
                alt={sample.productName}
                className="w-24 h-24 rounded-lg object-cover"
              />
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      {sample.productName}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Requested by: {sample.requestedBy}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Request Date: {sample.requestDate}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(sample.status)}`}>
                    {sample.status.replace('_', ' ').charAt(0).toUpperCase() + sample.status.slice(1).replace('_', ' ')}
                  </span>
                </div>
                {sample.trackingNumber && (
                  <div className="mt-4 flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <Truck className="w-4 h-4 mr-2" />
                    Tracking: {sample.trackingNumber}
                  </div>
                )}
              </div>
              <div className="flex space-x-3">
                <button className="px-4 py-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg">
                  Update Status
                </button>
                <button className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg">
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}