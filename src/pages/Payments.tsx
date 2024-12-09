import React, { useState } from 'react';
import { Search, Filter, DollarSign, Calendar, CreditCard, CheckCircle, XCircle } from 'lucide-react';

interface Payment {
  id: string;
  orderId: string;
  customerName: string;
  amount: number;
  method: 'credit_card' | 'bank_transfer' | 'upi';
  status: 'completed' | 'pending' | 'failed';
  date: string;
  transactionId: string;
}

export function Payments() {
  const [payments] = useState<Payment[]>([
    {
      id: 'PAY001',
      orderId: 'ORD001',
      customerName: 'John Smith',
      amount: 5780,
      method: 'credit_card',
      status: 'completed',
      date: '2024-03-15T10:30:00Z',
      transactionId: 'TXN123456789'
    },
    {
      id: 'PAY002',
      orderId: 'ORD002',
      customerName: 'Sarah Wilson',
      amount: 12500,
      method: 'bank_transfer',
      status: 'pending',
      date: '2024-03-15T11:45:00Z',
      transactionId: 'TXN987654321'
    },
    {
      id: 'PAY003',
      orderId: 'ORD003',
      customerName: 'Raj Patel',
      amount: 8900,
      method: 'upi',
      status: 'failed',
      date: '2024-03-15T09:15:00Z',
      transactionId: 'TXN456789123'
    }
  ]);

  const getMethodIcon = (method: Payment['method']) => {
    switch (method) {
      case 'credit_card':
        return <CreditCard className="w-5 h-5" />;
      case 'bank_transfer':
        return <DollarSign className="w-5 h-5" />;
      case 'upi':
        return <DollarSign className="w-5 h-5" />;
    }
  };

  const getStatusIcon = (status: Payment['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Calendar className="w-5 h-5 text-yellow-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Payments</h1>
        <div className="flex space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search payments..."
              className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>
          <button className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
            <Filter className="w-5 h-5 mr-2" />
            Filter
          </button>
        </div>
      </div>

      <div className="grid gap-6">
        {payments.map((payment) => (
          <div
            key={payment.id}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200"
          >
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-xl">
                    {getMethodIcon(payment.method)}
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      Payment #{payment.id}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Order #{payment.orderId} • {payment.customerName}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      ₹{payment.amount.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(payment.date).toLocaleString()}
                    </p>
                  </div>
                  <div className={`flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    payment.status === 'completed' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                      : payment.status === 'failed'
                      ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                  }`}>
                    {getStatusIcon(payment.status)}
                    <span className="ml-2">{payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-4">
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Method:</span>
                      <span className="ml-2 text-gray-900 dark:text-white">
                        {payment.method.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Transaction ID:</span>
                      <span className="ml-2 text-gray-900 dark:text-white">{payment.transactionId}</span>
                    </div>
                  </div>
                  <button className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}