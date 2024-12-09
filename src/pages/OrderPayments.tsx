import React, { useState } from 'react';
import { Search, Filter, DollarSign, CreditCard, Calendar, Edit, AlertCircle } from 'lucide-react';
import { formatCurrency } from '../utils/helpers';

interface Payment {
  id: string;
  orderId: string;
  customerName: string;
  amount: number;
  amountPaid: number;
  status: 'received' | 'partial' | 'pending' | 'failed';
  method: 'credit_card' | 'bank_transfer' | 'upi' | 'cash';
  date: string;
  transactionId: string;
  deliveryStatus: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  notes?: string;
}

export function OrderPayments() {
  const [payments, setPayments] = useState<Payment[]>([
    {
      id: 'PAY001',
      orderId: 'ORD001',
      customerName: 'John Smith',
      amount: 25000,
      amountPaid: 15000,
      status: 'partial',
      method: 'bank_transfer',
      date: '2024-03-15T10:30:00Z',
      transactionId: 'TXN123456789',
      deliveryStatus: 'processing',
      notes: 'Partial payment received via bank transfer'
    },
    {
      id: 'PAY002',
      orderId: 'ORD002',
      customerName: 'Sarah Wilson',
      amount: 12500,
      amountPaid: 12500,
      status: 'received',
      method: 'upi',
      date: '2024-03-15T11:45:00Z',
      transactionId: 'TXN987654321',
      deliveryStatus: 'shipped'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [editingPayment, setEditingPayment] = useState<Payment | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const handleUpdatePayment = (updatedPayment: Payment) => {
    setPayments(payments.map(p => 
      p.id === updatedPayment.id ? updatedPayment : p
    ));
    setShowEditModal(false);
    setEditingPayment(null);
  };

  const getStatusColor = (status: Payment['status']) => {
    switch (status) {
      case 'received':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'partial':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'pending':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'failed':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getDeliveryStatusColor = (status: Payment['deliveryStatus']) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'shipped':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = 
      payment.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.transactionId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus ? payment.status === filterStatus : true;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Order Payments</h1>
        <div className="flex space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by order ID, customer, or transaction..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          >
            <option value="">All Statuses</option>
            <option value="received">Received</option>
            <option value="partial">Partial</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </div>

      <div className="grid gap-6">
        {filteredPayments.map((payment) => (
          <div
            key={payment.id}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200"
          >
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl">
                    <DollarSign className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      Order #{payment.orderId}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {payment.customerName}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {formatCurrency(payment.amountPaid)} / {formatCurrency(payment.amount)}
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                        {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDeliveryStatusColor(payment.deliveryStatus)}`}>
                        {payment.deliveryStatus.charAt(0).toUpperCase() + payment.deliveryStatus.slice(1)}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setEditingPayment(payment);
                      setShowEditModal(true);
                    }}
                    className="p-2 text-indigo-600 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-900/20 rounded-lg"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-4">
                <div className="flex items-center space-x-2">
                  <CreditCard className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {payment.method.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Payment Method</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {new Date(payment.date).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Payment Date</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <AlertCircle className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {payment.transactionId}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Transaction ID</p>
                  </div>
                </div>
              </div>

              {payment.notes && (
                <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-300">{payment.notes}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {showEditModal && editingPayment && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center">
            <div className="fixed inset-0 transition-opacity">
              <div className="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"></div>
            </div>

            <div className="relative inline-block bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Update Payment
                </h3>
              </div>

              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const updatedPayment = {
                  ...editingPayment,
                  amountPaid: Number(formData.get('amountPaid')),
                  status: formData.get('status') as Payment['status'],
                  notes: formData.get('notes') as string
                };
                handleUpdatePayment(updatedPayment);
              }}>
                <div className="px-6 py-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Amount Paid
                    </label>
                    <input
                      type="number"
                      name="amountPaid"
                      defaultValue={editingPayment.amountPaid}
                      min="0"
                      max={editingPayment.amount}
                      step="0.01"
                      required
                      className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Payment Status
                    </label>
                    <select
                      name="status"
                      defaultValue={editingPayment.status}
                      required
                      className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="received">Received</option>
                      <option value="partial">Partial</option>
                      <option value="pending">Pending</option>
                      <option value="failed">Failed</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Notes
                    </label>
                    <textarea
                      name="notes"
                      defaultValue={editingPayment.notes}
                      rows={3}
                      className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>

                <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/50 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
                  >
                    Update Payment
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}