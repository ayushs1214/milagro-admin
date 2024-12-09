import React, { useState } from 'react';
import { DollarSign, Save, X } from 'lucide-react';
import type { Order } from '../../types';

interface OrderPriceEditorProps {
  order: Order;
  onUpdatePrice: (productId: string, price: number) => Promise<void>;
}

export function OrderPriceEditor({ order, onUpdatePrice }: OrderPriceEditorProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEdit = (productId: string, currentPrice: number) => {
    setEditingId(productId);
    setEditPrice(currentPrice);
  };

  const handleSave = async (productId: string) => {
    setIsSubmitting(true);
    try {
      await onUpdatePrice(productId, editPrice);
      setEditingId(null);
    } catch (error) {
      console.error('Error updating price:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      {order.products.map((product) => (
        <div
          key={product.id}
          className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
        >
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              Product #{product.id}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Quantity: {product.quantity}
            </p>
          </div>

          <div className="flex items-center space-x-4">
            {editingId === product.id ? (
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="number"
                    value={editPrice}
                    onChange={(e) => setEditPrice(Number(e.target.value))}
                    className="pl-9 pr-4 py-1 w-32 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <button
                  onClick={() => handleSave(product.id)}
                  disabled={isSubmitting}
                  className="p-1 text-green-600 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-900/20 rounded-full"
                >
                  <Save className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setEditingId(null)}
                  className="p-1 text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => handleEdit(product.id, product.negotiatedPrice || product.price)}
                className="flex items-center space-x-1 text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400"
              >
                <DollarSign className="w-4 h-4" />
                <span>₹{(product.negotiatedPrice || product.price).toLocaleString()}</span>
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}