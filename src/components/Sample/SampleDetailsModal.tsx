import React, { useState } from 'react';
import { X, Truck, MessageSquare, Trash2, AlertTriangle } from 'lucide-react';
import { FeedbackDisplay } from './FeedbackDisplay';
import type { Sample } from '../../types/sample';

interface SampleDetailsModalProps {
  sample: Sample;
  onClose: () => void;
  onUpdateStatus: (id: string, status: Sample['status']) => void;
  onDelete: (id: string) => void;
}

export function SampleDetailsModal({
  sample,
  onClose,
  onUpdateStatus,
  onDelete
}: SampleDetailsModalProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState(sample.trackingNumber || '');

  const handleStatusUpdate = (newStatus: Sample['status']) => {
    onUpdateStatus(sample.id, newStatus);
  };

  const handleDelete = () => {
    onDelete(sample.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"></div>
        </div>

        <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Sample Details</h3>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="p-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 rounded-lg"
              >
                <Trash2 className="w-5 h-5" />
              </button>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="p-6">
            <div className="space-y-4">
              <div>
                <img
                  src={sample.image}
                  alt={sample.productName}
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Product Name</h4>
                <p className="mt-1 text-sm text-gray-900 dark:text-white">{sample.productName}</p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Requested By</h4>
                <div className="mt-1 flex items-center space-x-3">
                  <img
                    src={sample.requestedBy.avatar}
                    alt={sample.requestedBy.name}
                    className="w-8 h-8 rounded-full"
                  />
                  <div>
                    <p className="text-sm text-gray-900 dark:text-white">{sample.requestedBy.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{sample.requestedBy.email}</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</h4>
                <select
                  value={sample.status}
                  onChange={(e) => handleStatusUpdate(e.target.value as Sample['status'])}
                  className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                </select>
              </div>

              {sample.status === 'shipped' && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Tracking Number
                  </h4>
                  <div className="mt-1 flex items-center space-x-2">
                    <input
                      type="text"
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                      className="block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                      placeholder="Enter tracking number"
                    />
                    <button
                      onClick={() => handleStatusUpdate('delivered')}
                      className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
                    >
                      Update
                    </button>
                  </div>
                </div>
              )}

              {sample.feedback && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                    Feedback
                  </h4>
                  <FeedbackDisplay feedback={sample.feedback} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"></div>
            </div>

            <div className="relative bg-white dark:bg-gray-800 rounded-lg max-w-md w-full mx-4 p-6">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Delete Sample Request
                  </h3>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    Are you sure you want to delete this sample request? This action cannot be undone.
                  </p>
                  <div className="mt-4 flex space-x-3">
                    <button
                      onClick={() => setShowDeleteConfirm(false)}
                      className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDelete}
                      className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}