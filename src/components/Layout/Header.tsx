import React, { useState } from 'react';
import { Bell } from 'lucide-react';
import { useThemeStore } from '../../store/themeStore';
import ThemeToggle from './ThemeToggle';
import ProfileDropdown from './ProfileDropdown';
import NotificationsDropdown from './NotificationsDropdown';

export function Header() {
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search..."
              className="w-96 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <NotificationsDropdown />
            <ProfileDropdown />
          </div>
        </div>
      </div>
    </header>
  );
}