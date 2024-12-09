import React, { useState } from 'react';
import { DollarSign } from 'lucide-react';

interface PriceEditorProps {
  currentPrice: number;
  minThreshold?: number;
  onUpdate: (newPrice: number) => Promise<void>;
}

export function PriceEditor({ currentPrice, minThreshold, onUpdate }: PriceEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [price, setPrice] = useState(currentPrice);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (minThreshold && price < minThreshold) {
      alert('Price cannot be lower than the minimum threshold');
      return;
    }
    setIsSubmitting(true);
    try {
      await onUpdate(price);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating price:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isEditing) {
    return (
      <button
        onClick={() => setIsEditing(true)}
        className="flex items-center text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400"
      >
        <DollarSign className="w-4 h-4 mr-1" />
        ₹{currentPrice.toLocaleString()}
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center space-x-2">
      <input
        type="number"
        value={price}
        onChange={(e) => setPrice(Number(e.target.value))}
        min={minThreshold}
        step="0.01"
        className="w-32 px-2 py-1 text-right border border-gray-300 dark:border-gray-600 rounded-md focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
      />
      <div className="flex space-x-1">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-2 py-1 text-xs text-white bg-indigo-600 rounded hover:bg-indigo-700 disabled:opacity-50"
        >
          Save
        </button>
        <button
          type="button"
          onClick={() => {
            setPrice(currentPrice);
            setIsEditing(false);
          }}
          className="px-2 py-1 text-xs text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}