import React, { useState } from 'react';
import { Search, Filter, Package, Clock, DollarSign } from 'lucide-react';
import { OrderDetails } from '../components/Order/OrderDetails';
import type { Order } from '../types';

export function Orders() {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orders, setOrders] = useState<Order[]>([
    {
      id: 'ORD001',
      customerName: 'John Smith',
      customerEmail: 'john@example.com',
      customerPhone: '+91 98765 43210',
      products: [
        {
          id: '1',
          name: 'Modern Chair',
          quantity: 4,
          price: 1200,
          image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&q=80&w=300&h=200',
          negotiatedPrice: 1100
        }
      ],
      status: 'processing',
      subtotal: 4800,
      tax: 480,
      shipping: 500,
      total: 5780,
      shippingAddress: '123 Main St, Mumbai, India',
      orderDate: '2024-03-15'
    }
  ]);

  const handleUpdateStatus = (orderId: string, status: Order['status']) => {
    setOrders(prevOrders => 
      prevOrders.map(order => 
        order.id === orderId ? { ...order, status } : order
      )
    );
  };

  const handleUpdateShipping = (orderId: string, amount: number) => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId
          ? { ...order, shipping: amount, total: order.subtotal + amount + order.tax }
          : order
      )
    );
  };

  const handleUpdatePrice = (orderId: string, productId: string, price: number) => {
    setOrders(prevOrders =>
      prevOrders.map(order => {
        if (order.id === orderId) {
          const updatedProducts = order.products.map(product =>
            product.id === productId ? { ...product, negotiatedPrice: price } : product
          );
          const subtotal = updatedProducts.reduce(
            (sum, product) => sum + (product.negotiatedPrice || product.price) * product.quantity,
            0
          );
          return {
            ...order,
            products: updatedProducts,
            subtotal,
            total: subtotal + order.shipping + order.tax
          };
        }
        return order;
      })
    );
  };

  const handleUpdateTax = (orderId: string, amount: number) => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId
          ? { ...order, tax: amount, total: order.subtotal + order.shipping + amount }
          : order
      )
    );
  };

  const handleCancelOrder = (orderId: string) => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId ? { ...order, status: 'rejected' } : order
      )
    );
  };

  return (
    <div className="space-y-6">
      {selectedOrder ? (
        <OrderDetails
          order={selectedOrder}
          onBack={() => setSelectedOrder(null)}
          onUpdateStatus={(status) => {
            handleUpdateStatus(selectedOrder.id, status);
            setSelectedOrder(prev => prev ? { ...prev, status } : null);
          }}
          onUpdateShipping={(amount) => {
            handleUpdateShipping(selectedOrder.id, amount);
            setSelectedOrder(prev => {
              if (!prev) return null;
              const newTotal = prev.subtotal + amount + prev.tax;
              return { ...prev, shipping: amount, total: newTotal };
            });
          }}
          onUpdatePrice={(productId, price) => {
            handleUpdatePrice(selectedOrder.id, productId, price);
            setSelectedOrder(prev => {
              if (!prev) return null;
              const updatedProducts = prev.products.map(product =>
                product.id === productId ? { ...product, negotiatedPrice: price } : product
              );
              const subtotal = updatedProducts.reduce(
                (sum, product) => sum + (product.negotiatedPrice || product.price) * product.quantity,
                0
              );
              return {
                ...prev,
                products: updatedProducts,
                subtotal,
                total: subtotal + prev.shipping + prev.tax
              };
            });
          }}
          onUpdateTax={(amount) => {
            handleUpdateTax(selectedOrder.id, amount);
            setSelectedOrder(prev => {
              if (!prev) return null;
              const newTotal = prev.subtotal + prev.shipping + amount;
              return { ...prev, tax: amount, total: newTotal };
            });
          }}
          onCancelOrder={() => {
            handleCancelOrder(selectedOrder.id);
            setSelectedOrder(prev => prev ? { ...prev, status: 'rejected' } : null);
          }}
        />
      ) : (
        <>
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Orders</h1>
            <div className="flex space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search orders..."
                  className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>
              <button className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                <Filter className="w-5 h-5 mr-2" />
                Filter
              </button>
            </div>
          </div>

          <div className="grid gap-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl">
                        <Package className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          Order #{order.id}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {order.customerName}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        order.status === 'delivered' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                        order.status === 'rejected' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' :
                        'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                      }`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-6 mb-4">
                    <div className="flex items-center space-x-3">
                      <Clock className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          Order Date
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(order.orderDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Package className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          Items
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {order.products.length} products
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <DollarSign className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          Total Amount
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          ₹{order.total.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="px-4 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}