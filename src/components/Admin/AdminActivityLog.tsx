import React from 'react';
import { Clock, User, Shield } from 'lucide-react';
import { formatDate } from '../../utils/helpers';

interface ActivityLog {
  id: string;
  action: string;
  details: any;
  created_at: string;
  user: {
    name: string;
    role: string;
  };
}

interface AdminActivityLogProps {
  activities: ActivityLog[];
}

export function AdminActivityLog({ activities }: AdminActivityLogProps) {
  const getActionIcon = (action: string) => {
    switch (action) {
      case 'admin_created':
        return <User className="w-5 h-5 text-green-500" />;
      case 'admin_updated':
        return <Shield className="w-5 h-5 text-blue-500" />;
      case 'admin_deleted':
        return <Shield className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getActionText = (action: string, details: any) => {
    switch (action) {
      case 'admin_created':
        return `New ${details.role} account created`;
      case 'admin_updated':
        return 'Admin profile updated';
      case 'admin_deleted':
        return 'Admin account deleted';
      case 'permissions_updated':
        return 'Permissions updated';
      default:
        return action.replace('_', ' ');
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Recent Activities</h3>
      </div>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {activities.length === 0 ? (
          <div className="p-4 text-center text-gray-500 dark:text-gray-400">
            No recent activities
          </div>
        ) : (
          activities.map((activity) => (
            <div key={activity.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  {getActionIcon(activity.action)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {getActionText(activity.action, activity.details)}
                  </p>
                  <div className="mt-1 flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                    <span>by {activity.user.name}</span>
                    <span>•</span>
                    <span>{formatDate(activity.created_at)}</span>
                  </div>
                  {activity.details?.department && (
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      Department: {activity.details.department}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}