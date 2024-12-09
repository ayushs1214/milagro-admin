import React, { useState } from 'react';
import type { Order } from '../../types';

interface NegotiationFormProps {
  order: Order;
  onSubmit: (message: string, price: number) => Promise<void>;
  minThreshold?: number;
}

export function NegotiationForm({ order, onSubmit, minThreshold }: NegotiationFormProps) {
  const [message, setMessage] = useState('');
  const [price, setPrice] = useState(order.total);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (minThreshold && price < minThreshold) {
      alert('Price cannot be lower than the minimum threshold');
      return;
    }
    setIsSubmitting(true);
    try {
      await onSubmit(message, price);
      setMessage('');
      setPrice(order.total);
    } catch (error) {
      console.error('Error submitting negotiation:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Counter Offer
        </label>
        <div className="mt-1">
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            min={minThreshold}
            step="0.01"
            required
            className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Message
        </label>
        <div className="mt-1">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
            required
            className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
            placeholder="Explain your counter offer..."
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Counter Offer'}
        </button>
      </div>
    </form>
  );
}