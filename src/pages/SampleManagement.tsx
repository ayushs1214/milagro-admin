import React, { useState } from 'react';
import { Package, Search, Filter, Plus, Truck, CheckCircle, X } from 'lucide-react';
import { SampleRequestModal } from '../components/Sample/SampleRequestModal';
import { SampleDetailsModal } from '../components/Sample/SampleDetailsModal';
import { SampleFilter } from '../components/Sample/SampleFilter';

interface Sample {
  id: string;
  productName: string;
  requestedBy: string;
  status: 'pending' | 'approved' | 'shipped' | 'delivered' | 'feedback_received';
  requestDate: string;
  trackingNumber?: string;
  image: string;
  description?: string;
  quantity: number;
  feedback?: string;
}

export function SampleManagement() {
  const [samples, setSamples] = useState<Sample[]>([
    {
      id: '1',
      productName: 'Premium Floor Tile',
      requestedBy: 'John Smith',
      status: 'shipped',
      requestDate: '2024-03-15',
      trackingNumber: 'TRK123456789',
      image: 'https://images.unsplash.com/photo-1615971677499-5467cbab01c0?auto=format&fit=crop&q=80&w=300&h=200',
      description: 'High-quality ceramic floor tile sample',
      quantity: 2
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showNewRequestModal, setShowNewRequestModal] = useState(false);
  const [selectedSample, setSelectedSample] = useState<Sample | null>(null);
  const [filters, setFilters] = useState({
    status: '',
    dateRange: 'all',
    sortBy: 'date'
  });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleNewRequest = (newSample: Omit<Sample, 'id' | 'status' | 'requestDate'>) => {
    const sample: Sample = {
      ...newSample,
      id: `SAMPLE-${Date.now()}`,
      status: 'pending',
      requestDate: new Date().toISOString().split('T')[0]
    };
    setSamples(prev => [sample, ...prev]);
    setShowNewRequestModal(false);
  };

  const handleUpdateStatus = (id: string, newStatus: Sample['status']) => {
    setSamples(prev => prev.map(sample => 
      sample.id === id ? { ...sample, status: newStatus } : sample
    ));
  };

  const handleAddFeedback = (id: string, feedback: string) => {
    setSamples(prev => prev.map(sample => 
      sample.id === id ? { ...sample, feedback, status: 'feedback_received' } : sample
    ));
  };

  const handleDeleteSample = (id: string) => {
    setSamples(prev => prev.filter(sample => sample.id !== id));
    setSelectedSample(null);
  };

  const filteredSamples = samples
    .filter(sample => {
      const matchesSearch = sample.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sample.requestedBy.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = !filters.status || sample.status === filters.status;
      
      if (filters.dateRange === 'today') {
        const today = new Date().toISOString().split('T')[0];
        return matchesSearch && matchesStatus && sample.requestDate === today;
      }
      if (filters.dateRange === 'week') {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return matchesSearch && matchesStatus && new Date(sample.requestDate) >= weekAgo;
      }
      if (filters.dateRange === 'month') {
        const monthAgo = new Date();
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        return matchesSearch && matchesStatus && new Date(sample.requestDate) >= monthAgo;
      }
      
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (filters.sortBy === 'date') {
        return new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime();
      }
      return a.productName.localeCompare(b.productName);
    });

  const getStatusColor = (status: Sample['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'approved':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'shipped':
        return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-400';
      case 'delivered':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'feedback_received':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Sample Management</h1>
        <div className="flex items-center space-x-4">
          <div className="relative flex-1 min-w-[300px]">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search samples..."
              value={searchTerm}
              onChange={handleSearch}
              className="block w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <Filter className="w-5 h-5 mr-2" />
            Filter
          </button>
          <button
            onClick={() => setShowNewRequestModal(true)}
            className="flex items-center px-4 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
          >
            <Plus className="w-5 h-5 mr-2" />
            New Sample Request
          </button>
        </div>
      </div>

      {showFilters && (
        <SampleFilter
          filters={filters}
          onFilterChange={setFilters}
          onClose={() => setShowFilters(false)}
        />
      )}

      <div className="grid gap-4">
        {filteredSamples.map((sample) => (
          <div
            key={sample.id}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200"
          >
            <div className="p-6">
              <div className="flex items-center space-x-4">
                <img
                  src={sample.image}
                  alt={sample.productName}
                  className="w-24 h-24 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        {sample.productName}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Requested by: {sample.requestedBy}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Request Date: {new Date(sample.requestDate).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(sample.status)}`}>
                      {sample.status.replace('_', ' ').split(' ').map(word => 
                        word.charAt(0).toUpperCase() + word.slice(1)
                      ).join(' ')}
                    </span>
                  </div>
                  {sample.trackingNumber && (
                    <div className="mt-4 flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <Truck className="w-4 h-4 mr-2" />
                      Tracking: {sample.trackingNumber}
                    </div>
                  )}
                </div>
                <div className="flex space-x-3">
                  {sample.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleUpdateStatus(sample.id, 'approved')}
                        className="p-2 text-green-600 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-900/20 rounded-full"
                      >
                        <CheckCircle className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(sample.id, 'shipped')}
                        className="p-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 rounded-full"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => setSelectedSample(sample)}
                    className="px-4 py-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {filteredSamples.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              No samples found matching your criteria.
            </p>
          </div>
        )}
      </div>

      {showNewRequestModal && (
        <SampleRequestModal
          onSubmit={handleNewRequest}
          onClose={() => setShowNewRequestModal(false)}
        />
      )}

      {selectedSample && (
        <SampleDetailsModal
          sample={selectedSample}
          onClose={() => setSelectedSample(null)}
          onUpdateStatus={handleUpdateStatus}
          onAddFeedback={handleAddFeedback}
          onDelete={handleDeleteSample}
        />
      )}
    </div>
  );
}