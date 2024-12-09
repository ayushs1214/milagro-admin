// Previous imports remain the same...

interface OrderStatusFlowProps {
  currentStatus: Order['status'];
  onUpdateStatus: (status: Order['status']) => void;
  onRevert?: (status: Order['status']) => void;
  isLoading?: boolean;
  canRevert?: boolean;
}

export function OrderStatusFlow({
  currentStatus,
  onUpdateStatus,
  onRevert,
  isLoading,
  canRevert
}: OrderStatusFlowProps) {
  const statusFlow = [
    { id: 'pending', label: 'Pending', icon: Clock },
    { id: 'accepted', label: 'Accepted', icon: CheckCircle },
    { id: 'processing', label: 'Processing', icon: Package },
    { id: 'shipped', label: 'Shipped', icon: Truck },
    { id: 'delivered', label: 'Delivered', icon: CheckCircle }
  ];

  const currentIndex = statusFlow.findIndex(status => status.id === currentStatus);

  const getNextStatus = (): Order['status'] | null => {
    if (currentIndex < statusFlow.length - 1) {
      return statusFlow[currentIndex + 1].id as Order['status'];
    }
    return null;
  };

  const getPreviousStatus = (): Order['status'] | null => {
    if (currentIndex > 0) {
      return statusFlow[currentIndex - 1].id as Order['status'];
    }
    return null;
  };

  const nextStatus = getNextStatus();
  const previousStatus = getPreviousStatus();

  return (
    <div className="space-y-4">
      {/* Previous status flow visualization remains the same */}

      <div className="flex justify-between">
        {canRevert && previousStatus && currentStatus !== 'rejected' && currentStatus !== 'delivered' && (
          <button
            onClick={() => onRevert?.(previousStatus)}
            disabled={isLoading}
            className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Revert to {previousStatus}
          </button>
        )}
        {nextStatus && currentStatus !== 'rejected' && currentStatus !== 'delivered' && (
          <button
            onClick={() => onUpdateStatus(nextStatus)}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50 ml-auto"
          >
            {isLoading ? 'Updating...' : `Mark as ${nextStatus}`}
          </button>
        )}
      </div>
    </div>
  );
}