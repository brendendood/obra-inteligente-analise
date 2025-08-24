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

export type CRMClientStatus = "prospect" | "active" | "inactive";
export type CRMProjectStatus = "planning" | "in-progress" | "completed" | "on-hold";

export interface CRMClient {
  id: string;
  owner_id: string;
  name: string;
  email: string | null;
  phone: string | null;
  company: string | null;
  status: CRMClientStatus;
  avatar: string | null;
  created_at: string;
  updated_at: string;
}

export interface CRMProject {
  id: string;
  owner_id: string;
  client_id: string;
  name: string;
  value: number;
  status: CRMProjectStatus;
  start_date: string;
  end_date: string | null;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface CRMClientStatsView {
  client_id: string;
  owner_id: string;
  projects_count: number;
  total_value: number;
}