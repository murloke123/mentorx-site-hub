
export type SubscriptionStatus = 'active' | 'canceled' | 'past_due' | 'incomplete' | 'trialing';
export type PaymentStatus = 'pending' | 'succeeded' | 'failed' | 'canceled';

export interface Subscription {
  id: string;
  user_id: string;
  stripe_customer_id?: string;
  stripe_subscription_id?: string;
  status: SubscriptionStatus;
  current_period_start?: string;
  current_period_end?: string;
  plan_name?: string;
  plan_price?: number;
  created_at: string;
  updated_at: string;
}

export interface Payment {
  id: string;
  user_id: string;
  subscription_id?: string;
  stripe_payment_intent_id?: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  invoice_url?: string;
  created_at: string;
  updated_at: string;
}

export interface StripeConfig {
  publishableKey: string;
  priceId: string;
}
