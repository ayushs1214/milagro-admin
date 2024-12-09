import React, { useState } from 'react';
import { Building2, Search, Plus, Calendar, MapPin, Users, Upload } from 'lucide-react';
import { BulkUploadModal } from '../components/Product/BulkUploadModal';

interface Expo {
  id: string;
  name: string;
  location: string;
  startDate: string;
  endDate: string;
  status: 'upcoming' | 'ongoing' | 'completed';
  participants: number;
  image: string;
}

export function ExpoManagement() {
  const [expos, setExpos] = useState<Expo[]>([]);
  const [showBulkUpload, setShowBulkUpload] = useState(false);

  const handleBulkUpload = async (file: File) => {
    try {
      // In a real app, this would send the file to an API endpoint
      console.log('Uploading file:', file);
      // Mock success response
      setTimeout(() => {
        setShowBulkUpload(false);
      }, 2000);
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Expo Management</h1>
        <div className="flex space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search expos..."
              className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>
          <button
            onClick={() => setShowBulkUpload(true)}
            className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <Upload className="w-5 h-5 mr-2" />
            Bulk Upload
          </button>
          <button className="flex items-center px-4 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700">
            <Plus className="w-5 h-5 mr-2" />
            Add Expo
          </button>
        </div>
      </div>

      <div className="grid gap-6">
        {expos.map((expo) => (
          <div
            key={expo.id}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex">
              <div className="w-48 h-48">
                <img
                  src={expo.image}
                  alt={expo.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                      {expo.name}
                    </h3>
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <MapPin className="w-4 h-4 mr-2" />
                        {expo.location}
                      </div>
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <Calendar className="w-4 h-4 mr-2" />
                        {new Date(expo.startDate).toLocaleDateString()} - {new Date(expo.endDate).toLocaleDateString()}
                      </div>
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <Users className="w-4 h-4 mr-2" />
                        {expo.participants} Participants
                      </div>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    expo.status === 'upcoming'
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                      : expo.status === 'ongoing'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
                  }`}>
                    {expo.status.charAt(0).toUpperCase() + expo.status.slice(1)}
                  </span>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <button className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600">
                    View Products
                  </button>
                  <button className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600">
                    Manage Participants
                  </button>
                  <button className="px-4 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-900/20 rounded-lg">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showBulkUpload && (
        <BulkUploadModal
          onClose={() => setShowBulkUpload(false)}
          onUpload={handleBulkUpload}
        />
      )}
    </div>
  );
}