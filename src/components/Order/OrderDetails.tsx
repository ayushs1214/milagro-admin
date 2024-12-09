import React, { useState } from 'react';
import { ArrowLeft, Package, Truck, DollarSign, AlertTriangle } from 'lucide-react';
import type { Order } from '../../types';

interface OrderDetailsProps {
  order: Order;
  onBack: () => void;
  onUpdateStatus: (status: Order['status']) => void;
  onUpdateShipping: (amount: number) => void;
  onUpdatePrice: (productId: string, price: number) => void;
  onUpdateTax: (amount: number) => void;
  onCancelOrder: () => void;
}

export function OrderDetails({
  order,
  onBack,
  onUpdateStatus,
  onUpdateShipping,
  onUpdatePrice,
  onUpdateTax,
  onCancelOrder
}: OrderDetailsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [editedShipping, setEditedShipping] = useState(order.shipping);
  const [editedTax, setEditedTax] = useState(order.tax);
  const [editedPrices, setEditedPrices] = useState<Record<string, number>>(
    order.products.reduce((acc, product) => ({
      ...acc,
      [product.id]: product.negotiatedPrice || product.price
    }), {})
  );

  const statusFlow = {
    pending: ['accepted', 'rejected'],
    accepted: ['processing', 'rejected'],
    processing: ['shipped', 'rejected'],
    shipped: ['delivered', 'rejected'],
    delivered: [],
    rejected: []
  };

  const handleSaveChanges = () => {
    onUpdateShipping(editedShipping);
    onUpdateTax(editedTax);
    Object.entries(editedPrices).forEach(([productId, price]) => {
      onUpdatePrice(productId, price);
    });
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Orders
        </button>
        <div className="flex space-x-3">
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
            >
              Edit Order
            </button>
          )}
          {order.status !== 'rejected' && (
            <button
              onClick={() => setShowCancelConfirm(true)}
              className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 dark:bg-red-900/20 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40"
            >
              Cancel Order
            </button>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Order #{order.id}
            </h2>
            <div className="flex items-center space-x-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                order.status === 'delivered' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                order.status === 'rejected' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' :
                'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
              }`}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </span>
              {statusFlow[order.status].length > 0 && (
                <select
                  onChange={(e) => onUpdateStatus(e.target.value as Order['status'])}
                  className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  <option value="">Change Status</option>
                  {statusFlow[order.status].map((status) => (
                    <option key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Customer Information
            </h3>
            <div className="space-y-3">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                <span className="font-medium">Name:</span> {order.customerName}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                <span className="font-medium">Email:</span> {order.customerEmail}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                <span className="font-medium">Phone:</span> {order.customerPhone}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                <span className="font-medium">Address:</span> {order.shippingAddress}
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Order Items
            </h3>
            <div className="space-y-4">
              {order.products.map((product) => (
                <div key={product.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {product.name}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Quantity: {product.quantity}
                      </p>
                    </div>
                  </div>
                  {isEditing ? (
                    <input
                      type="number"
                      value={editedPrices[product.id]}
                      onChange={(e) => setEditedPrices({
                        ...editedPrices,
                        [product.id]: Number(e.target.value)
                      })}
                      className="w-24 px-2 py-1 text-right border border-gray-300 dark:border-gray-600 rounded-lg"
                    />
                  ) : (
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      ₹{(product.negotiatedPrice || product.price).toLocaleString()}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 dark:border-gray-700">
          <div className="max-w-sm ml-auto space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500 dark:text-gray-400">Subtotal</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                ₹{order.subtotal.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500 dark:text-gray-400">Tax</span>
              {isEditing ? (
                <input
                  type="number"
                  value={editedTax}
                  onChange={(e) => setEditedTax(Number(e.target.value))}
                  className="w-24 px-2 py-1 text-right border border-gray-300 dark:border-gray-600 rounded-lg"
                />
              ) : (
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  ₹{order.tax.toLocaleString()}
                </span>
              )}
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500 dark:text-gray-400">Shipping</span>
              {isEditing ? (
                <input
                  type="number"
                  value={editedShipping}
                  onChange={(e) => setEditedShipping(Number(e.target.value))}
                  className="w-24 px-2 py-1 text-right border border-gray-300 dark:border-gray-600 rounded-lg"
                />
              ) : (
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  ₹{order.shipping.toLocaleString()}
                </span>
              )}
            </div>
            <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center">
                <span className="text-base font-medium text-gray-900 dark:text-white">Total</span>
                <span className="text-base font-medium text-indigo-600 dark:text-indigo-400">
                  ₹{order.total.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {isEditing && (
          <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveChanges}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        )}
      </div>

      {showCancelConfirm && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"></div>
            </div>

            <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/20 sm:mx-0 sm:h-10 sm:w-10">
                    <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                      Cancel Order
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Are you sure you want to cancel this order? This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={() => {
                    onCancelOrder();
                    setShowCancelConfirm(false);
                  }}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel Order
                </button>
                <button
                  type="button"
                  onClick={() => setShowCancelConfirm(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Keep Order
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}