import React from 'react';
import { FileText, Printer, Mail } from 'lucide-react';
import type { Order } from '../../types';

interface OrderActionsProps {
  order: Order;
  onGenerateInvoice: () => void;
  onPrint: () => void;
  onSendEmail: () => void;
}

export function OrderActions({ order, onGenerateInvoice, onPrint, onSendEmail }: OrderActionsProps) {
  return (
    <div className="flex space-x-3">
      <button
        onClick={onGenerateInvoice}
        className="flex items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
      >
        <FileText className="w-4 h-4 mr-2" />
        Generate Invoice
      </button>
      <button
        onClick={onPrint}
        className="flex items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
      >
        <Printer className="w-4 h-4 mr-2" />
        Print
      </button>
      <button
        onClick={onSendEmail}
        className="flex items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
      >
        <Mail className="w-4 h-4 mr-2" />
        Send Email
      </button>
    </div>
  );
}