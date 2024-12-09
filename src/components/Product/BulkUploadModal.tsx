import React, { useState } from 'react';
import { Upload, X, Download, AlertCircle } from 'lucide-react';

interface BulkUploadModalProps {
  onClose: () => void;
  onUpload: (file: File) => Promise<void>;
}

export function BulkUploadModal({ onClose, onUpload }: BulkUploadModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const downloadTemplate = () => {
    const templateColumns = [
      'Product ID*',
      'Series Name*',
      'Finished Name*',
      'Color Names* (comma-separated)',
      'Color Images* (comma-separated URLs)',
      'Categories* (comma-separated: slabs,subways,wall,floor)',
      'Application Type* (highlighter,wall,floor,outdoor,other)',
      'Stock*',
      'Price*',
      'MOQ*',
      'MSP',
      'Images (comma-separated URLs)',
      'Videos (comma-separated URLs)',
      'PDFs (comma-separated URLs)',
      '3D Models (comma-separated URLs)',
      'Manufactured In*',
      'Check Material Depot (true/false)*',
      'Length (mm)*',
      'Width (mm)*',
      'Height (mm)*',
      'Inventory Quantity*'
    ];

    const csvContent = [
      templateColumns.join(','),
      // Add example row
      'PRD001,Modern Collection,Matte Finish,Beige,https://example.com/beige.jpg,wall;floor,floor,1000,1200,50,1500,https://example.com/img1.jpg,https://example.com/video1.mp4,https://example.com/spec1.pdf,https://example.com/model1.glb,India,true,600,600,10,1000'
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'product_upload_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type !== 'text/csv') {
        setError('Please upload a CSV file');
        return;
      }
      setSelectedFile(file);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setError(null);

    try {
      await onUpload(selectedFile);
      onClose();
    } catch (error) {
      setError('Error uploading file. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center">
        <div className="fixed inset-0 transition-opacity">
          <div className="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"></div>
        </div>

        <div className="relative inline-block w-full max-w-2xl bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Bulk Upload Products
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="px-6 py-4">
            <div className="space-y-4">
              <div>
                <button
                  onClick={downloadTemplate}
                  className="flex items-center px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 dark:text-indigo-400 dark:bg-indigo-900/20 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/40"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Template
                </button>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Download the template file and fill in your product data before uploading.
                </p>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Upload CSV File
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg">
                  <div className="space-y-1 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600 dark:text-gray-400">
                      <label className="relative cursor-pointer rounded-md font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300">
                        <span>Upload a file</span>
                        <input
                          type="file"
                          accept=".csv"
                          onChange={handleFileSelect}
                          className="sr-only"
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      CSV file up to 10MB
                    </p>
                  </div>
                </div>
              </div>

              {selectedFile && (
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="flex items-center">
                    <Upload className="w-5 h-5 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-900 dark:text-white">
                      {selectedFile.name}
                    </span>
                  </div>
                  <button
                    onClick={() => setSelectedFile(null)}
                    className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {error && (
                <div className="flex items-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-red-400 mr-2" />
                  <span className="text-sm text-red-800 dark:text-red-200">{error}</span>
                </div>
              )}
            </div>
          </div>

          <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/50 flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              onClick={handleUpload}
              disabled={!selectedFile || isUploading}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
            >
              {isUploading ? 'Uploading...' : 'Upload'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}