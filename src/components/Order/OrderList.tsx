import React from 'react';
import { Package, Truck, DollarSign, Clock } from 'lucide-react';
import type { Order } from '../../types';

interface OrderListProps {
  orders: Order[];
  onViewDetails: (orderId: string) => void;
  onUpdateStatus: (orderId: string, status: Order['status']) => void;
}

export function OrderList({ orders, onViewDetails, onUpdateStatus }: OrderListProps) {
  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'accepted':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'processing':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'shipped':
        return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-400';
      case 'delivered':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getPaymentStatusColor = (status: Order['paymentStatus']) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 dark:text-green-400';
      case 'partial':
        return 'text-yellow-600 dark:text-yellow-400';
      default:
        return 'text-red-600 dark:text-red-400';
    }
  };

  return (
    <div className="space-y-6">
      {orders.map((order) => (
        <div
          key={order.id}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden"
        >
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Package className="w-6 h-6 text-gray-400" />
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Order #{order.id}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
                <DollarSign className={`w-5 h-5 ${getPaymentStatusColor(order.paymentStatus)}`} />
              </div>
            </div>

            <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-4">
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Total: ₹{order.total.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {order.products.length} items
                  </p>
                </div>
                <div className="flex space-x-3">
                  {order.status === 'pending' && (
                    <>
                      <button
                        onClick={() => onUpdateStatus(order.id, 'accepted')}
                        className="px-3 py-1 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-md hover:bg-green-200 dark:hover:bg-green-900/40"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => onUpdateStatus(order.id, 'rejected')}
                        className="px-3 py-1 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-md hover:bg-red-200 dark:hover:bg-red-900/40"
                      >
                        Reject
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => onViewDetails(order.id)}
                    className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>

            {order.deliveryTracking && (
              <div className="mt-4 flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                <Truck className="w-4 h-4" />
                <span>
                  {order.deliveryTracking.provider} - {order.deliveryTracking.number}
                </span>
                <span>•</span>
                <span>{order.deliveryTracking.status}</span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}