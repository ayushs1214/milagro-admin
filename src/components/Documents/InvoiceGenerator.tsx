import React from 'react';
import { FileText, Download, Printer, Mail } from 'lucide-react';

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface InvoiceGeneratorProps {
  invoice: {
    id: string;
    date: string;
    dueDate: string;
    customerName: string;
    customerAddress: string;
    items: InvoiceItem[];
    subtotal: number;
    tax: number;
    total: number;
  };
}

export function InvoiceGenerator({ invoice }: InvoiceGeneratorProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Invoice #{invoice.id}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Generated on {invoice.date}
            </p>
          </div>
          <div className="flex space-x-3">
            <button className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
              <Printer className="w-4 h-4 mr-2" />
              Print
            </button>
            <button className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
              <Mail className="w-4 h-4 mr-2" />
              Email
            </button>
            <button className="flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700">
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
            <p className="mt-2 text-gray-900 dark:text-white">{invoice.customerName}</p>
            <p className="mt-1 text-gray-500 dark:text-gray-400 whitespace-pre-line">
              {invoice.customerAddress}
            </p>
          </div>
          <div className="text-right">
            <div className="space-y-2">
              <div>
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Invoice Date: </span>
                <span className="text-gray-900 dark:text-white">{invoice.date}</span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Due Date: </span>
                <span className="text-gray-900 dark:text-white">{invoice.dueDate}</span>
              </div>
            </div>
          </div>
        </div>

        <table className="w-full">
          <thead>
            <tr className="border-t border-gray-200 dark:border-gray-700">
              <th className="py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Description</th>
              <th className="py-3 text-right text-sm font-medium text-gray-500 dark:text-gray-400">Quantity</th>
              <th className="py-3 text-right text-sm font-medium text-gray-500 dark:text-gray-400">Unit Price</th>
              <th className="py-3 text-right text-sm font-medium text-gray-500 dark:text-gray-400">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {invoice.items.map((item) => (
              <tr key={item.id}>
                <td className="py-4 text-sm text-gray-900 dark:text-white">{item.description}</td>
                <td className="py-4 text-sm text-right text-gray-900 dark:text-white">{item.quantity}</td>
                <td className="py-4 text-sm text-right text-gray-900 dark:text-white">₹{item.unitPrice.toLocaleString()}</td>
                <td className="py-4 text-sm text-right text-gray-900 dark:text-white">₹{item.total.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t border-gray-200 dark:border-gray-700">
              <td colSpan={3} className="py-4 text-sm text-right font-medium text-gray-500 dark:text-gray-400">Subtotal</td>
              <td className="py-4 text-sm text-right text-gray-900 dark:text-white">₹{invoice.subtotal.toLocaleString()}</td>
            </tr>
            <tr>
              <td colSpan={3} className="py-4 text-sm text-right font-medium text-gray-500 dark:text-gray-400">Tax</td>
              <td className="py-4 text-sm text-right text-gray-900 dark:text-white">₹{invoice.tax.toLocaleString()}</td>
            </tr>
            <tr className="border-t border-gray-200 dark:border-gray-700">
              <td colSpan={3} className="py-4 text-sm text-right font-medium text-gray-900 dark:text-white">Total</td>
              <td className="py-4 text-sm text-right font-bold text-indigo-600 dark:text-indigo-400">₹{invoice.total.toLocaleString()}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}