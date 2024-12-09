import React, { useState } from 'react';
import { Check, X, Building2, Phone, Mail } from 'lucide-react';
import type { User } from '../../types';

interface RegistrationApprovalProps {
  user: User;
  onApprove: (id: string) => Promise<void>;
  onReject: (id: string) => Promise<void>;
}

export function RegistrationApproval({ user, onApprove, onReject }: RegistrationApprovalProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleApprove = async () => {
    setIsProcessing(true);
    try {
      await onApprove(user.id);
    } catch (error) {
      console.error('Error approving user:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    setIsProcessing(true);
    try {
      await onReject(user.id);
    } catch (error) {
      console.error('Error rejecting user:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <div className="flex items-start space-x-4">
        <img
          src={user.avatar}
          alt={user.name}
          className="w-12 h-12 rounded-full"
        />
        <div className="flex-1">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            {user.name}
          </h3>
          <div className="mt-1 space-y-1">
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <Mail className="w-4 h-4 mr-2" />
              {user.email}
            </div>
            {user.businessInfo && (
              <>
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <Building2 className="w-4 h-4 mr-2" />
                  {user.businessInfo.companyName}
                </div>
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <Phone className="w-4 h-4 mr-2" />
                  {user.businessInfo.phone}
                </div>
              </>
            )}
          </div>
          <div className="mt-2 space-y-1 text-sm text-gray-500 dark:text-gray-400">
            <p>GST: {user.businessInfo?.gstNumber}</p>
            <p>PAN: {user.businessInfo?.panNumber}</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={handleApprove}
            disabled={isProcessing}
            className="p-2 text-green-600 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-900/20 rounded-full"
          >
            <Check className="w-5 h-5" />
          </button>
          <button
            onClick={handleReject}
            disabled={isProcessing}
            className="p-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}