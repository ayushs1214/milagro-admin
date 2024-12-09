import React, { useState } from 'react';
import { Upload, FileSpreadsheet, AlertCircle, CheckCircle } from 'lucide-react';

interface UploadStatus {
  total: number;
  processed: number;
  successful: number;
  failed: number;
}

export function BulkUpload() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<UploadStatus | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = () => {
    if (!selectedFile) return;

    // Simulate upload process
    setUploadStatus({
      total: 100,
      processed: 100,
      successful: 95,
      failed: 5
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Bulk Upload</h1>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <div className="text-center">
          <div className="mx-auto w-24 h-24 flex items-center justify-center rounded-full bg-indigo-50 dark:bg-indigo-900/20">
            <FileSpreadsheet className="w-12 h-12 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h2 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
            Upload Product Data
          </h2>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Upload your product data using our template. Supported formats: CSV, XLSX
          </p>
        </div>

        <div className="mt-8">
          <label className="block">
            <span className="sr-only">Choose file</span>
            <input
              type="file"
              accept=".csv,.xlsx"
              onChange={handleFileSelect}
              className="block w-full text-sm text-gray-500 dark:text-gray-400
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-indigo-50 file:text-indigo-600
                dark:file:bg-indigo-900/20 dark:file:text-indigo-400
                hover:file:bg-indigo-100 dark:hover:file:bg-indigo-900/40"
            />
          </label>
        </div>

        {selectedFile && (
          <div className="mt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FileSpreadsheet className="w-5 h-5 text-gray-400" />
                <span className="text-sm text-gray-900 dark:text-white">{selectedFile.name}</span>
              </div>
              <button
                onClick={handleUpload}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
              >
                Upload File
              </button>
            </div>
          </div>
        )}

        {uploadStatus && (
          <div className="mt-8 space-y-4">
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mr-2" />
                <span className="text-sm text-green-600 dark:text-green-400">
                  Upload completed successfully
                </span>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4">
              <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Records</p>
                <p className="mt-1 text-xl font-semibold text-gray-900 dark:text-white">
                  {uploadStatus.total}
                </p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Processed</p>
                <p className="mt-1 text-xl font-semibold text-gray-900 dark:text-white">
                  {uploadStatus.processed}
                </p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Successful</p>
                <p className="mt-1 text-xl font-semibold text-green-600 dark:text-green-400">
                  {uploadStatus.successful}
                </p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Failed</p>
                <p className="mt-1 text-xl font-semibold text-red-600 dark:text-red-400">
                  {uploadStatus.failed}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Instructions
        </h3>
        <div className="prose dark:prose-invert max-w-none">
          <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <li>Download our template file to ensure correct data formatting</li>
            <li>Fill in your product data following the template structure</li>
            <li>Save the file in either CSV or XLSX format</li>
            <li>Upload the file using the form above</li>
            <li>Review the upload results and fix any errors if necessary</li>
          </ol>
        </div>
      </div>
    </div>
  );
}