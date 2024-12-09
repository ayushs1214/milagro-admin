import React from 'react';
import { Settings as SettingsIcon, Users, Bell, Shield, Key } from 'lucide-react';

export function Settings() {
  const sections = [
    {
      title: 'Admin Management',
      icon: Users,
      description: 'Manage admin accounts and permissions',
      link: '#admin-management'
    },
    {
      title: 'Security Settings',
      icon: Shield,
      description: 'Configure security policies and access controls',
      link: '#security'
    },
    {
      title: 'API Keys',
      icon: Key,
      description: 'Manage API keys and access tokens',
      link: '#api-keys'
    },
    {
      title: 'Notification Settings',
      icon: Bell,
      description: 'Configure system notifications and alerts',
      link: '#notifications'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Settings</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sections.map(({ title, icon: Icon, description, link }) => (
          <a
            key={title}
            href={link}
            className="block p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-indigo-100 dark:bg-indigo-900/20 rounded-lg">
                <Icon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">{title}</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{description}</p>
              </div>
            </div>
          </a>
        ))}
      </div>

      <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">Active Sessions</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {[1, 2].map((session) => (
              <div
                key={session}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Chrome on Windows
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Last active: 2 minutes ago
                    </p>
                  </div>
                </div>
                <button className="text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300">
                  Terminate
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}