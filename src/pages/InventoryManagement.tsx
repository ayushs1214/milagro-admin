import React, { useState } from 'react';
import { Search, Plus } from 'lucide-react';
import { useSidebarStore } from '../store/sidebarStore';
import { StockFilter, type StockFilters } from '../components/Inventory/StockFilter';
import { StockCard } from '../components/Inventory/StockCard';

interface InventoryItem {
  id: string;
  productName: string;
  sku: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  lastUpdated: string;
  status: 'in_stock' | 'low_stock' | 'out_of_stock';
  category: string;
  image?: string;
}

export function InventoryManagement() {
  const setCurrentPage = useSidebarStore((state) => state.setCurrentPage);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<StockFilters>({
    status: '',
    stockLevel: '',
    category: ''
  });

  const [inventory] = useState<InventoryItem[]>([
    {
      id: '1',
      productName: 'Premium Floor Tile',
      sku: 'TIL-001',
      currentStock: 250,
      minStock: 100,
      maxStock: 1000,
      lastUpdated: '2024-03-15',
      status: 'in_stock',
      category: 'tiles',
      image: 'https://images.unsplash.com/photo-1615971677499-5467cbab01c0?auto=format&fit=crop&q=80&w=300&h=200'
    },
    {
      id: '2',
      productName: 'Ceramic Wall Tile',
      sku: 'TIL-002',
      currentStock: 80,
      minStock: 100,
      maxStock: 500,
      lastUpdated: '2024-03-14',
      status: 'low_stock',
      category: 'tiles',
      image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=300&h=200'
    }
  ]);

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = !filters.status || item.status === filters.status;
    const matchesCategory = !filters.category || item.category === filters.category;
    
    let matchesStockLevel = true;
    if (filters.stockLevel) {
      const stockPercentage = (item.currentStock / item.maxStock) * 100;
      switch (filters.stockLevel) {
        case 'high':
          matchesStockLevel = stockPercentage > 70;
          break;
        case 'medium':
          matchesStockLevel = stockPercentage >= 30 && stockPercentage <= 70;
          break;
        case 'low':
          matchesStockLevel = stockPercentage < 30;
          break;
      }
    }

    return matchesSearch && matchesStatus && matchesCategory && matchesStockLevel;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Inventory Management</h1>
        <div className="flex space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search inventory..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>
          <StockFilter
            filters={filters}
            onFilterChange={setFilters}
          />
          <button 
            onClick={() => setCurrentPage('addstock')}
            className="flex items-center px-4 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Stock
          </button>
        </div>
      </div>

      <div className="grid gap-6">
        {filteredInventory.map((item) => (
          <StockCard
            key={item.id}
            item={item}
          />
        ))}
        
        {filteredInventory.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              No items found matching your criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}