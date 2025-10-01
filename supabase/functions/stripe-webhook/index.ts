import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
  apiVersion: "2025-08-27.basil",
});

const supabase = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
  { auth: { persistSession: false } }
);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, stripe-signature",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return new Response(JSON.stringify({ error: "No signature" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
  if (!webhookSecret) {
    console.error("STRIPE_WEBHOOK_SECRET not set");
    return new Response(JSON.stringify({ error: "Webhook secret not configured" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const body = await req.text();
    const event = stripe.webhooks.constructEvent(body, signature, webhookSecret);

    console.log(`Webhook received: ${event.type}`);

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutCompleted(session);
        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionChange(subscription);
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionDeleted(subscription);
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        await handlePaymentFailed(invoice);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Webhook error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const userId = session.client_reference_id;
  const customerEmail = session.customer_email || session.customer_details?.email;

  if (!userId && !customerEmail) {
    console.error("No user identifier in checkout session");
    return;
  }

  let targetUserId = userId;

  if (!targetUserId && customerEmail) {
    const { data: user } = await supabase.auth.admin.listUsers();
    const foundUser = user.users.find(u => u.email === customerEmail);
    targetUserId = foundUser?.id;
  }

  if (!targetUserId) {
    console.error("Could not find user for checkout session");
    return;
  }

  const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
  const priceId = subscription.items.data[0].price.id;
  const productId = subscription.items.data[0].price.product as string;
  const product = await stripe.products.retrieve(productId);

  const { error } = await supabase
    .from("accounts")
    .upsert({
      user_id: targetUserId,
      account_type: "paid",
      account_status: "active",
      stripe_customer_id: session.customer as string,
      stripe_subscription_id: session.subscription as string,
      plan_price_id: priceId,
      plan_name: product.name,
      plan_renews_at: new Date(subscription.current_period_end * 1000).toISOString(),
      updated_at: new Date().toISOString(),
    }, {
      onConflict: "user_id"
    });

  if (error) {
    console.error("Error updating account:", error);
  } else {
    console.log(`Account activated for user ${targetUserId}`);
  }
}

async function handleSubscriptionChange(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;

  const { data: account } = await supabase
    .from("accounts")
    .select("user_id")
    .eq("stripe_customer_id", customerId)
    .single();

  if (!account) {
    console.error("No account found for customer:", customerId);
    return;
  }

  const priceId = subscription.items.data[0].price.id;
  const productId = subscription.items.data[0].price.product as string;
  const product = await stripe.products.retrieve(productId);

  const { error } = await supabase
    .from("accounts")
    .update({
      account_type: "paid",
      account_status: subscription.status === "active" ? "active" : "active",
      stripe_subscription_id: subscription.id,
      plan_price_id: priceId,
      plan_name: product.name,
      plan_renews_at: new Date(subscription.current_period_end * 1000).toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", account.user_id);

  if (error) {
    console.error("Error updating subscription:", error);
  } else {
    console.log(`Subscription updated for user ${account.user_id}`);
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;

  const { data: account } = await supabase
    .from("accounts")
    .select("user_id")
    .eq("stripe_customer_id", customerId)
    .single();

  if (!account) {
    console.error("No account found for customer:", customerId);
    return;
  }

  // Não retornar ao trial, apenas bloquear módulos pagos
  const { error } = await supabase
    .from("accounts")
    .update({
      stripe_subscription_id: null,
      plan_price_id: null,
      plan_name: null,
      plan_renews_at: null,
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", account.user_id);

  if (error) {
    console.error("Error handling subscription deletion:", error);
  } else {
    console.log(`Subscription deleted for user ${account.user_id}`);
  }
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  const customerId = invoice.customer as string;

  const { data: account } = await supabase
    .from("accounts")
    .select("user_id")
    .eq("stripe_customer_id", customerId)
    .single();

  if (!account) {
    console.error("No account found for customer:", customerId);
    return;
  }

  console.log(`Payment failed for user ${account.user_id}`);
  // Aqui você pode enviar notificação ao usuário ou registrar o evento
}
