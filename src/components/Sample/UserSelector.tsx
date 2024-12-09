import React, { useState } from 'react';
import { Combobox } from '@headlessui/react';
import { Check, Search } from 'lucide-react';
import type { User } from '../../types/sample';

interface UserSelectorProps {
  users: User[];
  selectedUser: User | null;
  onSelect: (user: User) => void;
}

export function UserSelector({ users, selectedUser, onSelect }: UserSelectorProps) {
  const [query, setQuery] = useState('');

  const filteredUsers = query === ''
    ? users
    : users.filter((user) => {
        return user.name.toLowerCase().includes(query.toLowerCase()) ||
               user.email.toLowerCase().includes(query.toLowerCase());
      });

  return (
    <Combobox value={selectedUser} onChange={onSelect}>
      <div className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Combobox.Input
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            displayValue={(user: User) => user?.name || ''}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search users..."
          />
        </div>
        <Combobox.Options className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg max-h-60 overflow-auto">
          {filteredUsers.map((user) => (
            <Combobox.Option
              key={user.id}
              value={user}
              className={({ active }) =>
                `relative cursor-pointer select-none py-3 px-4 ${
                  active ? 'bg-indigo-50 dark:bg-indigo-900/20' : ''
                }`
              }
            >
              {({ selected }) => (
                <div className="flex items-center">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-8 h-8 rounded-full"
                  />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {user.name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {user.email}
                    </p>
                  </div>
                  {selected && (
                    <span className="absolute inset-y-0 right-0 flex items-center pr-4">
                      <Check className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    </span>
                  )}
                </div>
              )}
            </Combobox.Option>
          ))}
        </Combobox.Options>
      </div>
    </Combobox>
  );
}