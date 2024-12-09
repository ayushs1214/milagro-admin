import { RealtimeChannel } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import type { DashboardMetrics, ChartData } from '../types/dashboard';

class AnalyticsService {
  private channels: RealtimeChannel[] = [];

  async fetchMetrics(): Promise<DashboardMetrics> {
    try {
      const { data, error } = await supabase
        .rpc('get_dashboard_metrics');

      if (error) throw error;

      return {
        totalUsers: {
          id: '1',
          label: 'Total Users',
          value: data?.totalUsers?.value || 0,
          change: data?.totalUsers?.change || 0,
          icon: 'users'
        },
        activeOrders: {
          id: '2',
          label: 'Active Orders',
          value: data?.activeOrders?.value || 0,
          change: data?.activeOrders?.change || 0,
          icon: 'shopping-cart'
        },
        revenue: {
          id: '3',
          label: 'Revenue',
          value: data?.revenue?.value || 0,
          change: data?.revenue?.change || 0,
          icon: 'dollar-sign'
        },
        pendingApprovals: {
          id: '4',
          label: 'Pending Approvals',
          value: data?.pendingApprovals?.value || 0,
          change: data?.pendingApprovals?.change || 0,
          icon: 'clock'
        }
      };
    } catch (error) {
      console.error('Error fetching metrics:', error);
      return {
        totalUsers: { id: '1', label: 'Total Users', value: 0, change: 0, icon: 'users' },
        activeOrders: { id: '2', label: 'Active Orders', value: 0, change: 0, icon: 'shopping-cart' },
        revenue: { id: '3', label: 'Revenue', value: 0, change: 0, icon: 'dollar-sign' },
        pendingApprovals: { id: '4', label: 'Pending Approvals', value: 0, change: 0, icon: 'clock' }
      };
    }
  }

  async getRevenueTrend(): Promise<ChartData[]> {
    try {
      const { data, error } = await supabase
        .from('revenue_trend')
        .select('*')
        .order('date', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching revenue trend:', error);
      return [];
    }
  }

  async getUserTrend(): Promise<ChartData[]> {
    try {
      const { data, error } = await supabase
        .from('user_trend')
        .select('*')
        .order('date', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching user trend:', error);
      return [];
    }
  }

  async getUserTypes(): Promise<ChartData[]> {
    try {
      const { data, error } = await supabase
        .from('user_distribution')
        .select('*');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching user types:', error);
      return [];
    }
  }

  async getOrderStatus(): Promise<ChartData[]> {
    try {
      const { data, error } = await supabase
        .from('order_status_distribution')
        .select('*');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching order status:', error);
      return [];
    }
  }

  subscribeToUpdates(callback: () => void): () => void {
    // Subscribe to relevant tables for real-time updates
    const ordersChannel = supabase.channel('orders-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, callback)
      .subscribe();

    const profilesChannel = supabase.channel('profiles-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, callback)
      .subscribe();

    const revenueChannel = supabase.channel('revenue-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'revenue_analytics' }, callback)
      .subscribe();

    this.channels.push(ordersChannel, profilesChannel, revenueChannel);

    // Return cleanup function
    return () => {
      this.channels.forEach(channel => supabase.removeChannel(channel));
      this.channels = [];
    };
  }
}

export const analyticsService = new AnalyticsService();