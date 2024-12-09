import React, { useState } from 'react';
import { Package, AlertCircle, Trash2 } from 'lucide-react';
import { useSidebarStore } from '../../store/sidebarStore';

interface StockCardProps {
  item: {
    id: string;
    productName: string;
    sku: string;
    currentStock: number;
    minStock: number;
    maxStock: number;
    lastUpdated: string;
    status: 'in_stock' | 'low_stock' | 'out_of_stock';
    category?: string;
    image?: string;
  };
}

export function StockCard({ item }: StockCardProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const setCurrentPage = useSidebarStore((state) => state.setCurrentPage);
  const setSelectedStockId = useSidebarStore((state) => state.setSelectedStockId);

  const handleManageStock = () => {
    setSelectedStockId(item.id);
    setCurrentPage('managestock');
  };

  const handleDelete = () => {
    // Here you would typically make an API call to delete the product
    console.log('Deleting product:', item.id);
    setShowDeleteConfirm(false);
  };

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.productName}
                  className="w-12 h-12 rounded-lg object-cover"
                />
              ) : (
                <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl">
                  <Package className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                </div>
              )}
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {item.productName}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  SKU: {item.sku}
                </p>
              </div>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              item.status === 'in_stock'
                ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                : item.status === 'low_stock'
                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
            }`}>
              {item.status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
            </span>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Current Stock</p>
              <p className="mt-1 text-xl font-semibold text-gray-900 dark:text-white">
                {item.currentStock}
              </p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Minimum Stock</p>
              <p className="mt-1 text-xl font-semibold text-gray-900 dark:text-white">
                {item.minStock}
              </p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Maximum Stock</p>
              <p className="mt-1 text-xl font-semibold text-gray-900 dark:text-white">
                {item.maxStock}
              </p>
            </div>
          </div>

          {item.currentStock <= item.minStock && (
            <div className="mt-4 flex items-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mr-2" />
              <p className="text-sm text-yellow-600 dark:text-yellow-400">
                Stock level is below minimum threshold. Consider restocking soon.
              </p>
            </div>
          )}

          <div className="mt-4 flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Last updated: {new Date(item.lastUpdated).toLocaleDateString()}
            </p>
            <div className="flex space-x-3">
              <button
                onClick={handleManageStock}
                className="px-4 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
              >
                Manage Stock
              </button>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="p-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 rounded-lg"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity">
              <div className="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"></div>
            </div>
            <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Delete Product
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Are you sure you want to delete this product? This action cannot be undone.
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleDelete}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Delete
                </button>
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}