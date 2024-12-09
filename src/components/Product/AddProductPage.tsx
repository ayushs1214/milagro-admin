import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { ProductForm } from './ProductForm';
import { mockCategories } from '../../store/mockData';
import { productsApi } from '../../utils/api';

export function AddProductPage() {
  const handleSubmit = async (formData: FormData) => {
    try {
      await productsApi.createProduct(formData);
      // Navigate back to products list
    } catch (error) {
      console.error('Error creating product:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => window.history.back()}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            <ArrowLeft className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Add New Product
          </h1>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <div className="p-6">
          <ProductForm
            onSubmit={handleSubmit}
            categories={mockCategories}
          />
        </div>
      </div>
    </div>
  );
}