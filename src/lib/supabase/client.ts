import { createClient } from "@supabase/supabase-js";

const url = "https://mozqijzvtbuwuzgemzsm.supabase.co";
const anon = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1venFpanp2dGJ1d3V6Z2VtenNtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1NTI2NTcsImV4cCI6MjA2NjEyODY1N30.03WIeunsXuTENSrXfsFjCYy7jehJVYaWK2Nt00Fx8sA";

if (!url || !anon) {
  throw new Error("Missing Supabase env vars.");
}

export const supabase = createClient(url, anon, {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
});

export type PlanTier = "FREE" | "BASIC" | "PRO" | "ENTERPRISE";
export type BillingCycle = "mensal" | "anual";

export interface UserPlanRow {
  user_id: string;
  plan_tier: PlanTier;
  billing_cycle: BillingCycle;
  seats: number;
  messages_quota: number;
  updated_at?: string;
  created_at?: string;
}