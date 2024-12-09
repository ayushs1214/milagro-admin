import React, { useState } from 'react';
import { ArrowLeft, Camera, Shield, Clock, Mail, Key } from 'lucide-react';
import { PermissionsEditor } from './PermissionsEditor';
import { adminService } from '../../services/adminService';
import { useAuthStore } from '../../store/authStore';
import type { Admin } from '../../types';

interface AdminDetailsProps {
  admin: Admin;
  onBack: () => void;
  onDelete: (id: string) => void;
  onUpdatePhoto: (file: File) => Promise<void>;
}

export function AdminDetails({ admin, onBack, onDelete, onUpdatePhoto }: AdminDetailsProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isEditingPermissions, setIsEditingPermissions] = useState(false);
  const currentUser = useAuthStore(state => state.user);
  const isSuperAdmin = currentUser?.role === 'superadmin';
  const canEdit = isSuperAdmin || currentUser?.id === admin.id;

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        await onUpdatePhoto(file);
      } catch (error) {
        console.error('Error updating photo:', error);
      }
    }
  };

  const handleUpdatePermissions = async (permissions: Admin['permissions']) => {
    try {
      await adminService.updatePermissions(admin.id, permissions);
      setIsEditingPermissions(false);
    } catch (error) {
      console.error('Error updating permissions:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Admins
        </button>
        {canEdit && admin.id !== currentUser?.id && (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
          >
            Delete Admin
          </button>
        )}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-6">
            <div className="relative">
              <img
                src={admin.avatar}
                alt={admin.name}
                className="w-24 h-24 rounded-full object-cover"
              />
              {canEdit && (
                <label className="absolute bottom-0 right-0 p-2 bg-white dark:bg-gray-800 rounded-full shadow-sm cursor-pointer">
                  <Camera className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                {admin.name}
              </h2>
              <div className="mt-1 flex items-center space-x-4">
                <span className="text-sm text-gray-500 dark:text-gray-400">{admin.email}</span>
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
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Account Information
              </h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-900 dark:text-white">{admin.email}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Shield className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-900 dark:text-white">
                    {admin.role.charAt(0).toUpperCase() + admin.role.slice(1)} Access
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-900 dark:text-white">
                    Last active: {new Date(admin.lastLogin).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <Key className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-900 dark:text-white">
                    Account created: {new Date(admin.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Permissions
                </h3>
                {canEdit && !isEditingPermissions && (
                  <button
                    onClick={() => setIsEditingPermissions(true)}
                    className="text-sm text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
                  >
                    Edit Permissions
                  </button>
                )}
              </div>
              
              {isEditingPermissions ? (
                <PermissionsEditor
                  permissions={admin.permissions}
                  onSave={handleUpdatePermissions}
                  onCancel={() => setIsEditingPermissions(false)}
                  isDisabled={!canEdit}
                />
              ) : (
                <div className="space-y-2">
                  {admin.permissions.map((permission, index) => (
                    <div
                      key={index}
                      className="px-3 py-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-sm text-gray-900 dark:text-white"
                    >
                      {permission}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen">
            <div className="fixed inset-0 transition-opacity">
              <div className="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"></div>
            </div>

            <div className="relative bg-white dark:bg-gray-800 rounded-lg max-w-md w-full mx-4 p-6">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <Shield className="h-6 w-6 text-red-600" />
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Delete Admin Account
                  </h3>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    Are you sure you want to delete this admin account? This action cannot be undone.
                  </p>
                  <div className="mt-4 flex space-x-3">
                    <button
                      onClick={() => setShowDeleteConfirm(false)}
                      className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        onDelete(admin.id);
                        setShowDeleteConfirm(false);
                      }}
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