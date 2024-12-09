import React from 'react';
import { ArrowLeft, Package, CreditCard, Building2, Phone, Mail } from 'lucide-react';

interface UserDetailsProps {
  user: any;
  onBack: () => void;
}

export function UserDetails({ user, onBack }: UserDetailsProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Users
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-4">
            <img
              src={user.avatar}
              alt={user.name}
              className="h-16 w-16 rounded-full"
            />
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{user.name}</h2>
              <div className="mt-1 flex items-center space-x-4">
                <span className="text-sm text-gray-500 dark:text-gray-400">{user.email}</span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  user.status === 'active' 
                    ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200'
                    : 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200'
                }`}>
                  {user.status}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Business Information</h3>
            <div className="space-y-3">
              <div className="flex items-center text-sm">
                <Building2 className="w-5 h-5 text-gray-400 mr-2" />
                <span className="text-gray-900 dark:text-white">{user.businessInfo?.companyName}</span>
              </div>
              <div className="flex items-center text-sm">
                <Mail className="w-5 h-5 text-gray-400 mr-2" />
                <span className="text-gray-900 dark:text-white">{user.email}</span>
              </div>
              <div className="flex items-center text-sm">
                <Phone className="w-5 h-5 text-gray-400 mr-2" />
                <span className="text-gray-900 dark:text-white">{user.businessInfo?.phone}</span>
              </div>
              <div className="mt-4 space-y-2">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  GST Number: {user.businessInfo?.gstNumber}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  PAN Number: {user.businessInfo?.panNumber}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Address: {user.businessInfo?.address}
                </p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Recent Orders</h3>
            <div className="space-y-4">
              {user.orders?.map((order: any) => (
                <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="flex items-center">
                    <Package className="w-5 h-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Order #{order.id}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{new Date(order.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">₹{order.total.toLocaleString()}</p>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      order.status === 'completed'
                        ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200'
                        : 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="md:col-span-2">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Payment History</h3>
            <div className="space-y-4">
              {user.payments?.map((payment: any) => (
                <div key={payment.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="flex items-center">
                    <CreditCard className="w-5 h-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Payment #{payment.id}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{new Date(payment.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">₹{payment.amount.toLocaleString()}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{payment.method}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}