import React, { useState } from 'react';
import { Shield, Save, X } from 'lucide-react';
import { permissionGroups, getPermissionLabel } from '../../utils/permissions';
import type { AdminPermission } from '../../types/admin';

interface PermissionsEditorProps {
  permissions: AdminPermission[];
  onSave: (permissions: AdminPermission[]) => Promise<void>;
  onCancel: () => void;
  isDisabled?: boolean;
}

export function PermissionsEditor({ permissions, onSave, onCancel, isDisabled }: PermissionsEditorProps) {
  const [selectedPermissions, setSelectedPermissions] = useState<AdminPermission[]>(permissions);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePermissionChange = (permission: AdminPermission) => {
    setSelectedPermissions(prev => 
      prev.includes(permission)
        ? prev.filter(p => p !== permission)
        : [...prev, permission]
    );
  };

  const handleGroupToggle = (groupPermissions: AdminPermission[]) => {
    const allSelected = groupPermissions.every(p => selectedPermissions.includes(p));
    
    if (allSelected) {
      setSelectedPermissions(prev => 
        prev.filter(p => !groupPermissions.includes(p))
      );
    } else {
      setSelectedPermissions(prev => 
        [...new Set([...prev, ...groupPermissions])]
      );
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await onSave(selectedPermissions);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-6">
        {permissionGroups.map((group) => (
          <div key={group.name} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {group.name}
              </h4>
              <button
                type="button"
                onClick={() => handleGroupToggle(group.permissions)}
                disabled={isDisabled}
                className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 disabled:opacity-50"
              >
                {group.permissions.every(p => selectedPermissions.includes(p))
                  ? 'Deselect All'
                  : 'Select All'}
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {group.permissions.map((permission) => (
                <label
                  key={permission}
                  className="flex items-center space-x-3 text-sm"
                >
                  <input
                    type="checkbox"
                    checked={selectedPermissions.includes(permission)}
                    onChange={() => handlePermissionChange(permission)}
                    disabled={isDisabled}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <span className="text-gray-700 dark:text-gray-300">
                    {getPermissionLabel(permission)}
                  </span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting || isDisabled}
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
        >
          {isSubmitting ? 'Saving...' : 'Save Permissions'}
        </button>
      </div>
    </div>
  );
}