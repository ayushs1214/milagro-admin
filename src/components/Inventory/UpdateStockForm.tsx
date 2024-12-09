import React, { useState } from 'react';
import { Package } from 'lucide-react';

interface UpdateStockFormProps {
  item: {
    id: string;
    productName: string;
    sku: string;
    currentStock: number;
  };
  onSubmit: (id: string, quantity: number) => Promise<void>;
  onCancel: () => void;
}

export function UpdateStockForm({ item, onSubmit, onCancel }: UpdateStockFormProps) {
  const [quantity, setQuantity] = useState(item.currentStock);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(item.id, quantity);
    } catch (error) {
      console.error('Error updating stock:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center space-x-4">
        <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl">
          <Package className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
        </div>
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            {item.productName}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            SKU: {item.sku}
          </p>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Current Stock
        </label>
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          min="0"
          className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
        />
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
        >
          {isSubmitting ? 'Updating...' : 'Update Stock'}
        </button>
      </div>
    </form>
  );
}