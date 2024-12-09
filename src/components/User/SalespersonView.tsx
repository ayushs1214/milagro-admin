import React from 'react';
import { ChevronDown, Mail, Phone, Calendar } from 'lucide-react';
import type { SalespersonRelation } from '../../types';

interface SalespersonViewProps {
  salesperson: SalespersonRelation;
  onBack: () => void;
}

export function SalespersonView({ salesperson, onBack }: SalespersonViewProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
        >
          <ChevronDown className="w-5 h-5 mr-2" />
          Back to Users
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
        <div className="p-6">
          <div className="flex items-start space-x-6">
            <img
              src={salesperson.avatar}
              alt={salesperson.name}
              className="w-24 h-24 rounded-lg object-cover"
            />
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {salesperson.name}
              </h2>
              <div className="mt-2 space-y-2">
                <div className="flex items-center text-gray-500 dark:text-gray-400">
                  <Mail className="w-4 h-4 mr-2" />
                  {salesperson.email}
                </div>
                <div className="flex items-center text-gray-500 dark:text-gray-400">
                  <Phone className="w-4 h-4 mr-2" />
                  {salesperson.phone}
                </div>
                <div className="flex items-center text-gray-500 dark:text-gray-400">
                  <Calendar className="w-4 h-4 mr-2" />
                  Joined: {new Date(salesperson.assignedDate).toLocaleDateString()}
                </div>
              </div>
            </div>
            <div className="text-right">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                {salesperson.status}
              </span>
            </div>
          </div>

          <div className="mt-8">
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Activity</h3>
              <div className="mt-2 space-y-2">
                <p className="text-sm text-gray-900 dark:text-white">
                  <span className="font-medium">Last Active:</span> {new Date(salesperson.lastInteraction).toLocaleString()}
                </p>
                <p className="text-sm text-gray-900 dark:text-white">
                  <span className="font-medium">Status:</span> {salesperson.status}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}