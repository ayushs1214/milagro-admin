import React from 'react';
import { Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import type { ApprovalLog } from '../../types';

interface ApprovalListProps {
  approvals: ApprovalLog[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

export function ApprovalList({ approvals, onApprove, onReject }: ApprovalListProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getActionTypeLabel = (type: string) => {
    switch (type) {
      case 'registration':
        return 'User Registration';
      case 'order':
        return 'Order Approval';
      case 'payment':
        return 'Payment Approval';
      case 'product':
        return 'Product Approval';
      default:
        return 'Unknown Action';
    }
  };

  return (
    <div className="space-y-6">
      {approvals.map((approval) => (
        <div
          key={approval.id}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4">
              <img
                src={approval.user.avatar}
                alt={approval.user.name}
                className="w-10 h-10 rounded-full"
              />
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {getActionTypeLabel(approval.actionType)}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Requested by {approval.user.name}
                </p>
                <div className="mt-1 flex items-center space-x-2">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(approval.timestamp).toLocaleString()}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">•</span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    approval.status === 'approved'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                      : approval.status === 'rejected'
                      ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                  }`}>
                    {approval.status.charAt(0).toUpperCase() + approval.status.slice(1)}
                  </span>
                </div>
              </div>
            </div>
            {approval.status === 'pending' && (
              <div className="flex space-x-2">
                <button
                  onClick={() => onApprove(approval.id)}
                  className="px-3 py-1 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-md hover:bg-green-200 dark:hover:bg-green-900/40"
                >
                  Approve
                </button>
                <button
                  onClick={() => onReject(approval.id)}
                  className="px-3 py-1 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-md hover:bg-red-200 dark:hover:bg-red-900/40"
                >
                  Reject
                </button>
              </div>
            )}
          </div>
          {approval.notes && (
            <div className="mt-4 text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 rounded-md p-3">
              {approval.notes}
            </div>
          )}
          {approval.approver && approval.status !== 'pending' && (
            <div className="mt-4 flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
              <img
                src={approval.approver.avatar}
                alt={approval.approver.name}
                className="w-6 h-6 rounded-full"
              />
              <span>
                Processed by {approval.approver.name} ({approval.approver.role})
              </span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}