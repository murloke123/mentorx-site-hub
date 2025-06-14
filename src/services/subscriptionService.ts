
import { supabase } from '@/integrations/supabase/client';
import { Subscription, Payment, SubscriptionStatus, PaymentStatus } from '@/types/subscription';

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

    if (!data) return null;

    return {
      id: data.id,
      user_id: data.user_id,
      stripe_customer_id: data.stripe_customer_id,
      stripe_subscription_id: data.stripe_subscription_id,
      status: data.status as SubscriptionStatus,
      current_period_start: data.current_period_start,
      current_period_end: data.current_period_end,
      plan_name: data.plan_name,
      plan_price: data.plan_price,
      created_at: data.created_at,
      updated_at: data.updated_at
    };
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

    if (!data) return [];

    return data.map(payment => ({
      id: payment.id,
      user_id: payment.user_id,
      subscription_id: payment.subscription_id,
      stripe_payment_intent_id: payment.stripe_payment_intent_id,
      amount: payment.amount,
      currency: payment.currency,
      status: payment.status as PaymentStatus,
      invoice_url: payment.invoice_url,
      created_at: payment.created_at,
      updated_at: payment.updated_at
    }));
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

    if (!data) return null;

    return {
      id: data.id,
      user_id: data.user_id,
      stripe_customer_id: data.stripe_customer_id,
      stripe_subscription_id: data.stripe_subscription_id,
      status: data.status as SubscriptionStatus,
      current_period_start: data.current_period_start,
      current_period_end: data.current_period_end,
      plan_name: data.plan_name,
      plan_price: data.plan_price,
      created_at: data.created_at,
      updated_at: data.updated_at
    };
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
