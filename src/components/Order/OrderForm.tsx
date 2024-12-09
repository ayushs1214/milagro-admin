import React, { useState } from 'react';
import { Package, Plus, Trash2 } from 'lucide-react';
import type { Product } from '../../types';
import { mockProducts } from '../../store/mockData';

interface OrderFormProps {
  onSubmit: (formData: FormData) => Promise<void>;
  initialData?: any;
}

export function OrderForm({ onSubmit, initialData }: OrderFormProps) {
  const [selectedProducts, setSelectedProducts] = useState<Array<{
    product: Product;
    quantity: number;
  }>>(initialData?.products || []);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddProduct = () => {
    setSelectedProducts([...selectedProducts, { product: mockProducts[0], quantity: 1 }]);
  };

  const handleRemoveProduct = (index: number) => {
    setSelectedProducts(selectedProducts.filter((_, i) => i !== index));
  };

  const handleQuantityChange = (index: number, quantity: number) => {
    setSelectedProducts(
      selectedProducts.map((item, i) =>
        i === index ? { ...item, quantity } : item
      )
    );
  };

  const handleProductChange = (index: number, productId: string) => {
    const product = mockProducts.find(p => p.id === productId);
    if (product) {
      setSelectedProducts(
        selectedProducts.map((item, i) =>
          i === index ? { ...item, product } : item
        )
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget);
      formData.append('products', JSON.stringify(selectedProducts));
      await onSubmit(formData);
    } catch (error) {
      console.error('Error submitting order:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateTotal = () => {
    return selectedProducts.reduce((total, { product, quantity }) => {
      return total + (product.price.value * quantity);
    }, 0);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Products
          </h3>
          <button
            type="button"
            onClick={handleAddProduct}
            className="flex items-center px-3 py-2 text-sm text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-md"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </button>
        </div>

        {selectedProducts.map((item, index) => (
          <div
            key={index}
            className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
          >
            <Package className="w-8 h-8 text-gray-400" />
            <div className="flex-1 grid grid-cols-3 gap-4">
              <select
                value={item.product.id}
                onChange={(e) => handleProductChange(index, e.target.value)}
                className="rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
              >
                {mockProducts.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name} - ₹{product.price.value}/{product.price.unit}
                  </option>
                ))}
              </select>
              <input
                type="number"
                value={item.quantity}
                onChange={(e) => handleQuantityChange(index, Number(e.target.value))}
                min="1"
                className="rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
              />
              <div className="text-right text-gray-900 dark:text-white">
                ₹{(item.product.price.value * item.quantity).toLocaleString()}
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleRemoveProduct(index)}
              className="p-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 rounded-full"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Delivery Address
          </label>
          <textarea
            name="deliveryAddress"
            rows={4}
            required
            defaultValue={initialData?.deliveryAddress}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Additional Notes
          </label>
          <textarea
            name="notes"
            rows={4}
            defaultValue={initialData?.notes}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
          />
        </div>
      </div>

      <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
        <div className="flex justify-between text-sm">
          <span className="font-medium text-gray-700 dark:text-gray-300">Subtotal</span>
          <span className="text-gray-900 dark:text-white">₹{calculateTotal().toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-sm mt-2">
          <span className="font-medium text-gray-700 dark:text-gray-300">Tax (10%)</span>
          <span className="text-gray-900 dark:text-white">₹{(calculateTotal() * 0.1).toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-base font-medium mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <span className="text-gray-900 dark:text-white">Total</span>
          <span className="text-indigo-600 dark:text-indigo-400">
            ₹{(calculateTotal() * 1.1).toLocaleString()}
          </span>
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting || selectedProducts.length === 0}
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
        >
          {isSubmitting ? 'Saving...' : initialData ? 'Update Order' : 'Create Order'}
        </button>
      </div>
    </form>
  );
}