// /lib/user-context.ts
// Carrega plano do usuário e dados essenciais do Supabase.

import type { SupabaseClient } from '@supabase/supabase-js';

export type UserContext = {
  userId: string;
  planCode: 'BASIC'|'PRO'|'ENTERPRISE';
  planId: string;
  baseQuota: number|null; // null = ilimitado
  lifetimeBaseConsumed: number;
}

export async function getUserContext(serverSupabase: SupabaseClient, userId: string): Promise<UserContext> {
  const { data: userRow, error: userErr } = await serverSupabase
    .from('users')
    .select('id, plan_id, lifetime_base_consumed, plans:plan_id (id, code, base_quota)')
    .eq('id', userId)
    .single();

  if (userErr || !userRow) {
    throw new Error('USER_NOT_FOUND_OR_NO_PLAN');
  }

  const plans = userRow.plans as any;
  
  return {
    userId: userRow.id,
    planId: plans.id,
    planCode: plans.code,
    baseQuota: plans.base_quota,
    lifetimeBaseConsumed: userRow.lifetime_base_consumed
  };
}