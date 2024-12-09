import { useState } from 'react';
import type { Order } from '../types';

export function useOrderActions() {
  const [isLoading, setIsLoading] = useState(false);

  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:4000/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      
      if (!response.ok) throw new Error('Failed to update order status');
      
      // Notify user about status change
      await fetch(`http://localhost:4000/api/notifications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'order_status_update',
          orderId,
          status
        })
      });

      return await response.json();
    } finally {
      setIsLoading(false);
    }
  };

  const updateOrderPrice = async (orderId: string, productId: string, price: number) => {
    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:4000/api/orders/${orderId}/products/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ price })
      });
      
      if (!response.ok) throw new Error('Failed to update product price');
      
      // Generate new invoice
      await fetch(`http://localhost:4000/api/orders/${orderId}/invoice`, {
        method: 'POST'
      });

      return await response.json();
    } finally {
      setIsLoading(false);
    }
  };

  const updateShippingCost = async (orderId: string, shipping: number) => {
    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:4000/api/orders/${orderId}/shipping`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shipping })
      });
      
      if (!response.ok) throw new Error('Failed to update shipping cost');
      
      return await response.json();
    } finally {
      setIsLoading(false);
    }
  };

  const cancelOrder = async (orderId: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:4000/api/orders/${orderId}/cancel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (!response.ok) throw new Error('Failed to cancel order');
      
      // Notify user about cancellation
      await fetch(`http://localhost:4000/api/notifications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'order_cancelled',
          orderId
        })
      });

      return await response.json();
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    updateOrderStatus,
    updateOrderPrice,
    updateShippingCost,
    cancelOrder
  };
}