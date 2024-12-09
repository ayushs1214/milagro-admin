import { supabase } from '../lib/supabase';
import { handleWebhookError } from './errorHandling';

export const webhooks = {
  async handleOrderWebhook(event: any) {
    try {
      const { type, order } = event;
      
      switch (type) {
        case 'order.created':
          await supabase.from('orders').insert(order);
          break;
        case 'order.updated':
          await supabase.from('orders').update(order).eq('id', order.id);
          break;
        case 'order.deleted':
          await supabase.from('orders').delete().eq('id', order.id);
          break;
      }
    } catch (error) {
      handleWebhookError(error);
    }
  },

  async handlePaymentWebhook(event: any) {
    try {
      const { type, payment } = event;
      
      switch (type) {
        case 'payment.succeeded':
          await supabase.from('payments').insert(payment);
          await supabase.from('orders')
            .update({ payment_status: 'paid' })
            .eq('id', payment.order_id);
          break;
        case 'payment.failed':
          await supabase.from('orders')
            .update({ payment_status: 'failed' })
            .eq('id', payment.order_id);
          break;
      }
    } catch (error) {
      handleWebhookError(error);
    }
  }
};