
import { supabase } from '@/integrations/supabase/client';
import { Subscription, Payment } from '@/types/subscription';

export const subscriptionService = {
  async getCurrentSubscription(userId: string): Promise<Subscription | null> {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .single();

    if (error) {
      console.error('Error fetching subscription:', error);
      return null;
    }

    return data;
  },

  async getPaymentHistory(userId: string): Promise<Payment[]> {
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching payment history:', error);
      return [];
    }

    return data || [];
  },

  async createSubscription(subscriptionData: Partial<Subscription>): Promise<Subscription | null> {
    const { data, error } = await supabase
      .from('subscriptions')
      .insert(subscriptionData)
      .select()
      .single();

    if (error) {
      console.error('Error creating subscription:', error);
      return null;
    }

    return data;
  },

  async updateSubscription(id: string, updates: Partial<Subscription>): Promise<boolean> {
    const { error } = await supabase
      .from('subscriptions')
      .update(updates)
      .eq('id', id);

    if (error) {
      console.error('Error updating subscription:', error);
      return false;
    }

    return true;
  }
};
