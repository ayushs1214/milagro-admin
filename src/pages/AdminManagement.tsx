import React, { useState, useEffect } from 'react';
import { Plus, Search, Shield, Mail, Calendar } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { AdminForm } from '../components/Admin/AdminForm';
import { AdminDetails } from '../components/Admin/AdminDetails';
import { adminService } from '../services/adminService';
import type { Admin } from '../types';

export function AdminManagement() {
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const currentUser = useAuthStore(state => state.user);
  const isSuperAdmin = currentUser?.role === 'superadmin';

  useEffect(() => {
    loadAdmins();
  }, []);

  const loadAdmins = async () => {
    try {
      const data = await adminService.getAllAdmins();
      setAdmins(data);
    } catch (error) {
      console.error('Error loading admins:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateAdmin = async (admin: Admin) => {
    try {
      await adminService.createAdmin(admin);
      await loadAdmins();
      setShowForm(false);
    } catch (error) {
      console.error('Error creating admin:', error);
    }
  };

  const handleDeleteAdmin = async (id: string) => {
    try {
      await adminService.deleteAdmin(id);
      await loadAdmins();
      setSelectedAdmin(null);
    } catch (error) {
      console.error('Error deleting admin:', error);
    }
  };

  const handleUpdatePhoto = async (file: File) => {
    if (!selectedAdmin) return;
    
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      
      await adminService.updateAdmin(selectedAdmin.id, {
        ...selectedAdmin,
        avatar: URL.createObjectURL(file) // This should be replaced with the actual uploaded file URL
      });
      
      await loadAdmins();
    } catch (error) {
      console.error('Error updating photo:', error);
    }
  };

  const filteredAdmins = admins.filter(admin =>
    admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admin.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (selectedAdmin) {
    return (
      <AdminDetails
        admin={selectedAdmin}
        onBack={() => setSelectedAdmin(null)}
        onDelete={handleDeleteAdmin}
        onUpdatePhoto={handleUpdatePhoto}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Admin Management</h1>
        <div className="flex space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search admins..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>
          {isSuperAdmin && (
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center px-4 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Admin
            </button>
          )}
        </div>
      </div>

      <div className="grid gap-6">
        {filteredAdmins.map((admin) => (
          <div
            key={admin.id}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200 cursor-pointer"
            onClick={() => setSelectedAdmin(admin)}
          >
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <img
                    src={admin.avatar}
                    alt={admin.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      {admin.name}
                    </h3>
                    <div className="mt-1 flex items-center space-x-2">
                      <span className="text-sm text-gray-500 dark:text-gray-400">{admin.email}</span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">•</span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        admin.role === 'superadmin'
                          ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300'
                          : 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300'
                      }`}>
                        {admin.role}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <Calendar className="w-4 h-4 mr-1" />
                      Last active: {new Date(admin.lastLogin).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>

              {admin.permissions && admin.permissions.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {admin.permissions.map((permission, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                    >
                      <Shield className="w-3 h-3 mr-1" />
                      {permission}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center">
            <div className="fixed inset-0 transition-opacity">
              <div className="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"></div>
            </div>

            <div className="relative inline-block bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Add New Admin</h3>
              </div>

              <div className="px-6 py-4">
                <AdminForm
                  onSuccess={handleCreateAdmin}
                  onCancel={() => setShowForm(false)}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}