import { supabase } from '../lib/supabase';
import type { RealtimeChannel } from '@supabase/supabase-js';

export class RealtimeManager {
  private channels: RealtimeChannel[] = [];

  subscribeToOrders(callback: (payload: any) => void) {
    const channel = supabase
      .channel('orders')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        callback
      )
      .subscribe();

    this.channels.push(channel);
    return () => this.unsubscribe(channel);
  }

  subscribeToInventory(callback: (payload: any) => void) {
    const channel = supabase
      .channel('inventory')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'products' },
        callback
      )
      .subscribe();

    this.channels.push(channel);
    return () => this.unsubscribe(channel);
  }

  private unsubscribe(channel: RealtimeChannel) {
    supabase.removeChannel(channel);
    this.channels = this.channels.filter(ch => ch !== channel);
  }

  unsubscribeAll() {
    this.channels.forEach(channel => supabase.removeChannel(channel));
    this.channels = [];
  }
}

export const realtime = new RealtimeManager();