import React from 'react';
import { Mail, Phone, MapPin, Check, X } from 'lucide-react';

interface UserCardProps {
  user: {
    id: string;
    name: string;
    email: string;
    phone: string;
    location: string;
    status: 'pending' | 'approved' | 'rejected';
    avatar: string;
  };
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

export function UserCard({ user, onApprove, onReject }: UserCardProps) {
  return (
    <div className="relative overflow-hidden bg-white dark:bg-gray-800 rounded-xl shadow-sm transition-all duration-200 hover:shadow-md">
      {/* Status indicator line */}
      <div className={`absolute top-0 left-0 right-0 h-1 ${
        user.status === 'approved' ? 'bg-green-500' :
        user.status === 'rejected' ? 'bg-red-500' :
        'bg-yellow-500'
      }`} />

      <div className="p-6">
        <div className="flex items-start space-x-4">
          <div className="relative">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-16 h-16 rounded-xl object-cover ring-2 ring-gray-100 dark:ring-gray-700"
            />
            <span className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white dark:border-gray-800 ${
              user.status === 'approved' ? 'bg-green-500' :
              user.status === 'rejected' ? 'bg-red-500' :
              'bg-yellow-500'
            }`} />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
              {user.name}
            </h3>
            <div className="mt-2 space-y-2">
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                <Mail className="w-4 h-4 mr-2 flex-shrink-0" />
                <span className="truncate">{user.email}</span>
              </div>
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                <Phone className="w-4 h-4 mr-2 flex-shrink-0" />
                <span>{user.phone}</span>
              </div>
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                <span className="truncate">{user.location}</span>
              </div>
            </div>
          </div>

          {user.status === 'pending' && (
            <div className="flex flex-col space-y-2">
              <button
                onClick={() => onApprove(user.id)}
                className="p-2 text-green-600 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-900/20 rounded-lg transition-colors duration-200"
              >
                <Check className="w-5 h-5" />
              </button>
              <button
                onClick={() => onReject(user.id)}
                className="p-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}