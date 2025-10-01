import { createClient } from "@supabase/supabase-js";

const url = "https://mozqijzvtbuwuzgemzsm.supabase.co";
const serviceKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1venFpanp2dGJ1d3V6Z2VtenNtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDU1MjY1NywiZXhwIjoyMDY2MTI4NjU3fQ.BvIBfcYgAsLG2WILmppjFouRIqeMrzt2LaWs8uB9FQU";

if (!url || !serviceKey) {
  throw new Error(
    "Missing Supabase env vars. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY."
  );
}

// Admin client (server-only). NEVER expose service key to the browser.
export const supabaseAdmin = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

export type PlanTier = "FREE" | "BASIC" | "PRO" | "ENTERPRISE";
export type BillingCycle = "mensal" | "anual";

export interface UserPlanRow {
  user_id: string;
  plan_tier: PlanTier;
  billing_cycle: BillingCycle;
  seats: number;
  messages_quota: number;
  updated_at: string;
  created_at: string;
}