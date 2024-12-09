import React, { useState } from 'react';
import { Bell, Search, Filter, Plus, Send, AlertCircle, CheckCircle, X, Upload, Image } from 'lucide-react';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  status: 'sent' | 'scheduled' | 'draft';
  image?: string;
  recipients: {
    type: 'all' | 'role' | 'specific';
    roles?: ('dealer' | 'architect' | 'builder')[];
    userIds?: string[];
  };
  scheduledFor?: string;
  createdAt: string;
  sentAt?: string;
}

export function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'New Order Received',
      message: 'Order #12345 has been placed and is awaiting approval.',
      type: 'info',
      status: 'sent',
      recipients: { type: 'all' },
      createdAt: '2024-03-15T10:30:00Z',
      sentAt: '2024-03-15T10:30:00Z'
    }
  ]);

  const [showNewNotification, setShowNewNotification] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [newNotification, setNewNotification] = useState<Partial<Notification>>({
    type: 'info',
    status: 'draft',
    recipients: { type: 'all' }
  });

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
  };

  const handleSendNotification = async () => {
    if (!newNotification.title || !newNotification.message) return;

    const notification: Notification = {
      id: `NOT${Date.now()}`,
      title: newNotification.title,
      message: newNotification.message,
      type: newNotification.type || 'info',
      status: newNotification.scheduledFor ? 'scheduled' : 'sent',
      recipients: newNotification.recipients || { type: 'all' },
      createdAt: new Date().toISOString(),
      sentAt: newNotification.scheduledFor ? undefined : new Date().toISOString(),
      scheduledFor: newNotification.scheduledFor
    };

    if (imagePreview) {
      notification.image = imagePreview;
    }

    setNotifications([notification, ...notifications]);
    setShowNewNotification(false);
    setNewNotification({
      type: 'info',
      status: 'draft',
      recipients: { type: 'all' }
    });
    setSelectedImage(null);
    setImagePreview(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Notifications</h1>
        <div className="flex space-x-4">
          <div className="relative flex-1 min-w-[300px]">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search notifications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>
          <button
            onClick={() => setShowNewNotification(true)}
            className="flex items-center px-4 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
          >
            <Plus className="w-5 h-5 mr-2" />
            New Notification
          </button>
        </div>
      </div>

      <div className="grid gap-4">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <div className={`p-2 rounded-full ${
                  notification.type === 'info' ? 'bg-blue-100 dark:bg-blue-900/20' :
                  notification.type === 'success' ? 'bg-green-100 dark:bg-green-900/20' :
                  notification.type === 'warning' ? 'bg-yellow-100 dark:bg-yellow-900/20' :
                  'bg-red-100 dark:bg-red-900/20'
                }`}>
                  <Bell className={`w-5 h-5 ${
                    notification.type === 'info' ? 'text-blue-600 dark:text-blue-400' :
                    notification.type === 'success' ? 'text-green-600 dark:text-green-400' :
                    notification.type === 'warning' ? 'text-yellow-600 dark:text-yellow-400' :
                    'text-red-600 dark:text-red-400'
                  }`} />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    {notification.title}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {notification.message}
                  </p>
                  <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">
                    {new Date(notification.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button className="p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                  <CheckCircle className="w-5 h-5" />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            {notification.image && (
              <div className="mt-4">
                <img
                  src={notification.image}
                  alt="Notification"
                  className="w-full max-h-48 object-cover rounded-lg"
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {showNewNotification && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center">
            <div className="fixed inset-0 transition-opacity">
              <div className="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"></div>
            </div>

            <div className="relative inline-block w-full max-w-2xl bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    New Notification
                  </h3>
                  <button
                    onClick={() => setShowNewNotification(false)}
                    className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="px-6 py-4">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Title *
                    </label>
                    <input
                      type="text"
                      value={newNotification.title || ''}
                      onChange={(e) => setNewNotification({ ...newNotification, title: e.target.value })}
                      className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                      placeholder="Enter notification title"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Message *
                    </label>
                    <textarea
                      value={newNotification.message || ''}
                      onChange={(e) => setNewNotification({ ...newNotification, message: e.target.value })}
                      rows={3}
                      className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                      placeholder="Enter notification message"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Image (Optional)
                    </label>
                    <div className="mt-1">
                      {imagePreview ? (
                        <div className="relative">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-full max-h-48 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={handleRemoveImage}
                            className="absolute top-2 right-2 p-1 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-full hover:bg-red-200 dark:hover:bg-red-900/40"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center w-full">
                          <label className="w-full flex flex-col items-center px-4 py-6 bg-white dark:bg-gray-700 text-gray-400 rounded-lg tracking-wide border border-gray-300 dark:border-gray-600 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600">
                            <Image className="w-8 h-8" />
                            <span className="mt-2 text-sm">Select an image</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={handleImageSelect}
                            />
                          </label>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Recipients
                    </label>
                    <select
                      value={newNotification.recipients?.type || 'all'}
                      onChange={(e) => setNewNotification({
                        ...newNotification,
                        recipients: { type: e.target.value as 'all' | 'role' | 'specific' }
                      })}
                      className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="all">All Users</option>
                      <option value="role">By Role</option>
                      <option value="specific">Specific Users</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Schedule (Optional)
                    </label>
                    <input
                      type="datetime-local"
                      value={newNotification.scheduledFor || ''}
                      onChange={(e) => setNewNotification({ ...newNotification, scheduledFor: e.target.value })}
                      className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/50 flex justify-end space-x-3">
                <button
                  onClick={() => setShowNewNotification(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendNotification}
                  disabled={!newNotification.title || !newNotification.message}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                >
                  Send Notification
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}