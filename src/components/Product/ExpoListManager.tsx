import React, { useState } from 'react';
import { Plus, Search, Users, MessageSquare } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  category: string;
  assignedUsers: string[];
  feedback: number;
  image: string;
}

export function ExpoListManager() {
  const [products, setProducts] = useState<Product[]>([
    {
      id: '1',
      name: 'Modern Dining Table',
      category: 'Furniture',
      assignedUsers: ['John Doe', 'Sarah Wilson'],
      feedback: 12,
      image: 'https://images.unsplash.com/photo-1577140917170-285929fb55b7?auto=format&fit=crop&q=80&w=300&h=200'
    },
    // Add more products as needed
  ]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Expo Display Management</h2>
        <button className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
          <Plus className="w-5 h-5 mr-2" />
          Add Product
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>
        </div>

        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {products.map((product) => (
            <div key={product.id} className="p-6 flex items-center space-x-4">
              <img
                src={product.image}
                alt={product.name}
                className="w-24 h-16 object-cover rounded-lg"
              />
              <div className="flex-1">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">{product.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{product.category}</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center text-gray-500 dark:text-gray-400">
                  <Users className="w-5 h-5 mr-1" />
                  <span>{product.assignedUsers.length}</span>
                </div>
                <div className="flex items-center text-gray-500 dark:text-gray-400">
                  <MessageSquare className="w-5 h-5 mr-1" />
                  <span>{product.feedback}</span>
                </div>
                <button className="px-4 py-2 text-sm text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg">
                  Manage
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}