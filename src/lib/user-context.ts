// /lib/user-context.ts
import { createClient } from '@supabase/supabase-js';

export type UserContext = {
  userId: string;
  planCode: 'BASIC' | 'PRO' | 'ENTERPRISE';
  baseQuota: number | null; // null = unlimited
  lifetimeBaseConsumed: number;
};

export async function getUserContext(
  serverSupabase: ReturnType<typeof createClient>,
  userId: string
): Promise<UserContext> {
  // Get user's current plan
  const { data: planData, error: planError } = await serverSupabase
    .from('plans')
    .select('code, base_quota')
    .single();

  if (planError) {
    throw new Error(`Failed to get user plan: ${planError.message}`);
  }

  // Count total base consumption (lifetime projects created)
  const { count: projectCount, error: projectError } = await serverSupabase
    .from('projects')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId);

  if (projectError) {
    throw new Error(`Failed to get project count: ${projectError.message}`);
  }

  // Count credit ledger base usage
  const { count: baseUsed, error: ledgerError } = await serverSupabase
    .from('credit_ledger')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('type', 'BASE');

  if (ledgerError) {
    throw new Error(`Failed to get credit ledger: ${ledgerError.message}`);
  }

  return {
    userId,
    planCode: (planData.code as 'BASIC' | 'PRO' | 'ENTERPRISE') || 'BASIC',
    baseQuota: planData.base_quota as number | null,
    lifetimeBaseConsumed: (projectCount as number || 0) + (baseUsed as number || 0)
  };
}