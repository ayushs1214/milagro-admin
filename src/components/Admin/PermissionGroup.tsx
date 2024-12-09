import React from 'react';
import { Check } from 'lucide-react';
import type { AdminPermission } from '../../types/admin';

interface PermissionGroupProps {
  name: string;
  permissions: AdminPermission[];
  selectedPermissions: AdminPermission[];
  onPermissionChange: (permission: AdminPermission) => void;
  disabled?: boolean;
  isSuperAdmin?: boolean;
}

export function PermissionGroup({
  name,
  permissions,
  selectedPermissions,
  onPermissionChange,
  disabled,
  isSuperAdmin
}: PermissionGroupProps) {
  const allSelected = permissions.every(p => selectedPermissions.includes(p));
  const someSelected = permissions.some(p => selectedPermissions.includes(p));

  const handleGroupToggle = () => {
    if (allSelected) {
      permissions.forEach(permission => {
        if (selectedPermissions.includes(permission)) {
          onPermissionChange(permission);
        }
      });
    } else {
      permissions.forEach(permission => {
        if (!selectedPermissions.includes(permission)) {
          onPermissionChange(permission);
        }
      });
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center">
        <label className="relative flex items-center">
          <input
            type="checkbox"
            checked={allSelected}
            onChange={handleGroupToggle}
            disabled={disabled || isSuperAdmin}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            {name}
          </span>
          {isSuperAdmin && (
            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300">
              Auto-granted
            </span>
          )}
        </label>
      </div>
      <div className="ml-6 space-y-2">
        {permissions.map(permission => (
          <label key={permission} className="flex items-center">
            <input
              type="checkbox"
              checked={selectedPermissions.includes(permission) || isSuperAdmin}
              onChange={() => onPermissionChange(permission)}
              disabled={disabled || isSuperAdmin}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
              {permission.split('.').map(word => 
                word.charAt(0).toUpperCase() + word.slice(1)
              ).join(' ')}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}