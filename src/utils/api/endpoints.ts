import { apiClient } from './client';
import type { User, Product, Order } from '../../types';

export const api = {
  auth: {
    login: (email: string, password: string) => 
      apiClient.post('/auth/login', { email, password }),
  },
  
  users: {
    list: (params?: any) => 
      apiClient.get('/users', { params }),
    create: (data: Partial<User>) => 
      apiClient.post('/users', data),
    update: (id: string, data: Partial<User>) => 
      apiClient.put(`/users/${id}`, data),
    delete: (id: string) => 
      apiClient.delete(`/users/${id}`)
  },

  products: {
    list: (params?: any) => 
      apiClient.get('/products', { params }),
    create: (data: FormData) => 
      apiClient.post('/products', data),
    update: (id: string, data: FormData) => 
      apiClient.put(`/products/${id}`, data),
    delete: (id: string) => 
      apiClient.delete(`/products/${id}`)
  },

  orders: {
    list: (params?: any) => 
      apiClient.get('/orders', { params }),
    create: (data: Partial<Order>) => 
      apiClient.post('/orders', data),
    update: (id: string, data: Partial<Order>) => 
      apiClient.put(`/orders/${id}`, data),
    updateStatus: (id: string, status: Order['status']) => 
      apiClient.put(`/orders/${id}/status`, { status }),
    delete: (id: string) => 
      apiClient.delete(`/orders/${id}`)
  },

  analytics: {
    dashboard: (params?: any) => 
      apiClient.get('/analytics/dashboard', { params }),
    sales: (params?: any) => 
      apiClient.get('/analytics/sales', { params })
  }
};