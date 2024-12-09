import React from 'react';
import { Truck, MapPin, Clock } from 'lucide-react';
import type { Order } from '../../types';

interface DeliveryTrackingProps {
  tracking: NonNullable<Order['deliveryTracking']>;
}

export function DeliveryTracking({ tracking }: DeliveryTrackingProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Truck className="w-5 h-5 text-gray-400" />
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            {tracking.provider}
          </span>
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          #{tracking.number}
        </span>
      </div>

      <div className="relative">
        <div className="absolute left-2 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700" />
        <div className="space-y-6">
          {tracking.updates.map((update, index) => (
            <div key={index} className="relative flex items-start ml-6">
              <div className="absolute -left-8 mt-1">
                <div className="w-4 h-4 rounded-full bg-indigo-600 dark:bg-indigo-500" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {update.status}
                </div>
                <div className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4" />
                    <span>{update.location}</span>
                  </div>
                  <div className="flex items-center space-x-2 mt-1">
                    <Clock className="w-4 h-4" />
                    <span>{new Date(update.timestamp).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}