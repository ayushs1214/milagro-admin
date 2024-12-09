import React, { useState, useEffect } from 'react';
import { ArrowLeft, History } from 'lucide-react';
import { useSidebarStore } from '../store/sidebarStore';

interface StockHistory {
  date: string;
  quantity: number;
  type: 'add' | 'remove';
  updatedBy: string;
}

interface StockStatus {
  value: 'in_stock' | 'low_stock' | 'out_of_stock';
  label: string;
}

export function ManageStock() {
  const setCurrentPage = useSidebarStore((state) => state.setCurrentPage);
  const selectedStockId = useSidebarStore((state) => state.selectedStockId);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  
  const [stockItem, setStockItem] = useState({
    id: selectedStockId,
    name: 'Premium Floor Tile',
    sku: 'TIL-001',
    currentStock: 250,
    minStock: 100,
    maxStock: 1000,
    status: 'in_stock' as StockStatus['value'],
    lastUpdated: '2024-03-15',
    image: 'https://images.unsplash.com/photo-1615971677499-5467cbab01c0?auto=format&fit=crop&q=80&w=300&h=200'
  });

  const [stockHistory] = useState<StockHistory[]>([
    { date: '2024-03-15', quantity: 50, type: 'add', updatedBy: 'John Doe' },
    { date: '2024-03-14', quantity: 25, type: 'remove', updatedBy: 'Jane Smith' }
  ]);

  const [newQuantity, setNewQuantity] = useState<number | ''>('');
  const [adjustmentType, setAdjustmentType] = useState<'add' | 'remove'>('add');

  const statusOptions: StockStatus[] = [
    { value: 'in_stock', label: 'In Stock' },
    { value: 'low_stock', label: 'Low Stock' },
    { value: 'out_of_stock', label: 'Out of Stock' }
  ];

  const handleUpdateStock = (e: React.FormEvent) => {
    e.preventDefault();
    if (newQuantity === '') return;
    
    setIsSubmitting(true);
    
    try {
      const updatedStock = adjustmentType === 'add' 
        ? stockItem.currentStock + Number(newQuantity)
        : stockItem.currentStock - Number(newQuantity);

      setStockItem(prev => ({
        ...prev,
        currentStock: updatedStock,
        lastUpdated: new Date().toISOString(),
        status: getUpdatedStatus(updatedStock)
      }));

      // Reset form after successful submission
      setNewQuantity('');
    } catch (error) {
      console.error('Error updating stock:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getUpdatedStatus = (quantity: number): StockStatus['value'] => {
    if (quantity <= 0) return 'out_of_stock';
    if (quantity <= stockItem.minStock) return 'low_stock';
    return 'in_stock';
  };

  const handleStatusChange = (newStatus: StockStatus['value']) => {
    setStockItem(prev => ({
      ...prev,
      status: newStatus,
      lastUpdated: new Date().toISOString()
    }));
  };

  const getStatusColor = (status: StockStatus['value']) => {
    switch (status) {
      case 'in_stock':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'low_stock':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'out_of_stock':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setCurrentPage('inventory')}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            <ArrowLeft className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Manage Stock
          </h1>
        </div>
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          <History className="w-5 h-5 mr-2" />
          Stock History
        </button>
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        {/* Product Info Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex items-center space-x-4 mb-6">
            {stockItem.image && (
              <img
                src={stockItem.image}
                alt={stockItem.name}
                className="w-16 h-16 rounded-lg object-cover"
              />
            )}
            <div>
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                {stockItem.name}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                SKU: {stockItem.sku}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Current Stock</p>
              <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
                {stockItem.currentStock}
              </p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</p>
              <select
                value={stockItem.status}
                onChange={(e) => handleStatusChange(e.target.value as StockStatus['value'])}
                className={`mt-1 text-sm font-medium px-2 py-1 rounded-full ${getStatusColor(stockItem.status)} border-0 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Stock Adjustment Form */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
            Adjust Stock
          </h2>
          
          <form onSubmit={handleUpdateStock} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Adjustment Type
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="add"
                    checked={adjustmentType === 'add'}
                    onChange={(e) => setAdjustmentType(e.target.value as 'add')}
                    className="mr-2"
                  />
                  Add Stock
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="remove"
                    checked={adjustmentType === 'remove'}
                    onChange={(e) => setAdjustmentType(e.target.value as 'remove')}
                    className="mr-2"
                  />
                  Remove Stock
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Quantity
              </label>
              <input
                type="number"
                min="0"
                value={newQuantity}
                onChange={(e) => setNewQuantity(e.target.value === '' ? '' : Number(e.target.value))}
                className="block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                placeholder="Enter quantity"
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="submit"
                disabled={isSubmitting || newQuantity === '' || Number(newQuantity) === 0}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
              >
                {isSubmitting ? 'Updating...' : 'Update Stock'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Stock History */}
      {showHistory && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
            Stock History
          </h2>
          <div className="space-y-4">
            {stockHistory.map((record, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {record.type === 'add' ? 'Added' : 'Removed'} {record.quantity} units
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    By {record.updatedBy}
                  </p>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {new Date(record.date).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}