
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
  apiVersion: "2023-10-16",
});

const supabase = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
);

serve(async (req) => {
  const signature = req.headers.get("stripe-signature");
  const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");

  if (!signature || !webhookSecret) {
    return new Response("Missing signature or webhook secret", { status: 400 });
  }

  try {
    const body = await req.text();
    const event = stripe.webhooks.constructEvent(body, signature, webhookSecret);

    console.log(`Received webhook event: ${event.type}`);

    switch (event.type) {
      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;
        
        // Buscar customer para obter metadata
        const customer = await stripe.customers.retrieve(customerId) as Stripe.Customer;
        const userId = customer.metadata?.supabase_user_id;

        if (userId) {
          await supabase.from("subscriptions").upsert({
            user_id: userId,
            stripe_customer_id: customerId,
            stripe_subscription_id: subscription.id,
            status: subscription.status,
            current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            plan_name: "Acesso Completo",
            plan_price: subscription.items.data[0]?.price.unit_amount || 0
          });
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        await supabase
          .from("subscriptions")
          .update({ status: "canceled" })
          .eq("stripe_subscription_id", subscription.id);
        break;
      }

      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const customerId = paymentIntent.customer as string;
        
        if (customerId) {
          const customer = await stripe.customers.retrieve(customerId) as Stripe.Customer;
          const userId = customer.metadata?.supabase_user_id;

          if (userId) {
            await supabase.from("payments").insert({
              user_id: userId,
              stripe_payment_intent_id: paymentIntent.id,
              amount: paymentIntent.amount,
              currency: paymentIntent.currency,
              status: "succeeded"
            });
          }
        }
        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const customerId = paymentIntent.customer as string;
        
        if (customerId) {
          const customer = await stripe.customers.retrieve(customerId) as Stripe.Customer;
          const userId = customer.metadata?.supabase_user_id;

          if (userId) {
            await supabase.from("payments").insert({
              user_id: userId,
              stripe_payment_intent_id: paymentIntent.id,
              amount: paymentIntent.amount,
              currency: paymentIntent.currency,
              status: "failed"
            });
          }
        }
        break;
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Webhook error:", error);
    return new Response(`Webhook error: ${error.message}`, { status: 400 });
  }
});
