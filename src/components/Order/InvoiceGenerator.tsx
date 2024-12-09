import React from 'react';
import { FileText, Download, Printer, Mail } from 'lucide-react';
import type { Order } from '../../types';

interface InvoiceGeneratorProps {
  order: Order;
  onDownload: () => void;
  onPrint: () => void;
  onEmail: () => void;
}

export function InvoiceGenerator({ order, onDownload, onPrint, onEmail }: InvoiceGeneratorProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Invoice #{order.id}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Generated on {new Date().toLocaleDateString()}
            </p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={onPrint}
              className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <Printer className="w-4 h-4 mr-2" />
              Print
            </button>
            <button
              onClick={onEmail}
              className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <Mail className="w-4 h-4 mr-2" />
              Email
            </button>
            <button
              onClick={onDownload}
              className="flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
            >
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Bill To</h3>
            <p className="mt-2 text-gray-900 dark:text-white">Customer Name</p>
            <p className="mt-1 text-gray-500 dark:text-gray-400 whitespace-pre-line">
              {order.deliveryAddress}
            </p>
          </div>
          <div className="text-right">
            <div className="space-y-2">
              <div>
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Order Date: </span>
                <span className="text-gray-900 dark:text-white">
                  {new Date(order.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Status: </span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  order.status === 'delivered' 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200'
                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200'
                }`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <table className="w-full">
          <thead>
            <tr className="border-t border-gray-200 dark:border-gray-700">
              <th className="py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Item</th>
              <th className="py-3 text-right text-sm font-medium text-gray-500 dark:text-gray-400">Quantity</th>
              <th className="py-3 text-right text-sm font-medium text-gray-500 dark:text-gray-400">Price</th>
              <th className="py-3 text-right text-sm font-medium text-gray-500 dark:text-gray-400">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {order.products.map((item) => (
              <tr key={item.id}>
                <td className="py-4 text-sm text-gray-900 dark:text-white">Product #{item.id}</td>
                <td className="py-4 text-sm text-right text-gray-900 dark:text-white">{item.quantity}</td>
                <td className="py-4 text-sm text-right text-gray-900 dark:text-white">
                  ₹{(item.negotiatedPrice || item.price).toLocaleString()}
                </td>
                <td className="py-4 text-sm text-right text-gray-900 dark:text-white">
                  ₹{((item.negotiatedPrice || item.price) * item.quantity).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t border-gray-200 dark:border-gray-700">
              <td colSpan={3} className="py-4 text-sm text-right font-medium text-gray-500 dark:text-gray-400">
                Subtotal
              </td>
              <td className="py-4 text-sm text-right text-gray-900 dark:text-white">
                ₹{order.total.toLocaleString()}
              </td>
            </tr>
            <tr>
              <td colSpan={3} className="py-4 text-sm text-right font-medium text-gray-500 dark:text-gray-400">
                Tax
              </td>
              <td className="py-4 text-sm text-right text-gray-900 dark:text-white">
                ₹{order.tax.toLocaleString()}
              </td>
            </tr>
            <tr>
              <td colSpan={3} className="py-4 text-sm text-right font-medium text-gray-500 dark:text-gray-400">
                Shipping
              </td>
              <td className="py-4 text-sm text-right text-gray-900 dark:text-white">
                ₹{order.shipping.toLocaleString()}
              </td>
            </tr>
            <tr className="border-t border-gray-200 dark:border-gray-700">
              <td colSpan={3} className="py-4 text-sm text-right font-medium text-gray-900 dark:text-white">
                Total
              </td>
              <td className="py-4 text-sm text-right font-bold text-indigo-600 dark:text-indigo-400">
                ₹{(order.total + order.tax + order.shipping).toLocaleString()}
              </td>
            </tr>
          </tfoot>
        </table>

        <div className="mt-8 text-sm text-gray-500 dark:text-gray-400">
          <p>Thank you for your business!</p>
          <p className="mt-2">
            For any questions or concerns, please contact our support team.
          </p>
        </div>
      </div>
    </div>
  );
}