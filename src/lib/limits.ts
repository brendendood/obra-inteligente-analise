// /lib/limits.ts
import { createClient } from '@supabase/supabase-js';
import { currentPeriodKey } from './time';
import { getUserContext } from './user-context';

export type Limits = {
  planCode: 'BASIC'|'PRO'|'ENTERPRISE';
  periodKey: string;
  baseQuota: number|null;
  baseUsed: number;
  baseRemaining: number|null; // null = ilimitado
  bonusGrantedThisMonth: number;
  bonusUsedThisMonth: number;
  bonusRemainingThisMonth: number;
};

export async function getLimits(serverSupabase: ReturnType<typeof createClient>, userId: string): Promise<Limits> {
  const periodKey = currentPeriodKey();
  const ctx = await getUserContext(serverSupabase, userId);

  const baseQuota = ctx.baseQuota; // null = ilimitado
  const baseUsed = ctx.lifetimeBaseConsumed;
  const baseRemaining = baseQuota === null ? null : Math.max(baseQuota - baseUsed, 0);

  const { count: granted, error: gErr } = await serverSupabase
    .from('referrals')
    .select('*', { count: 'exact', head: true })
    .eq('referrer_user_id', ctx.userId)
    .eq('status', 'APPROVED')
    .eq('period_key', periodKey);

  const { count: used, error: uErr } = await serverSupabase
    .from('credit_ledger')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', ctx.userId)
    .eq('type', 'BONUS_MONTHLY')
    .eq('period_key', periodKey);

  if (gErr || uErr) throw new Error('LIMITS_QUERY_ERROR');

  const bonusGrantedThisMonth = granted ?? 0;
  const bonusUsedThisMonth = used ?? 0;
  const bonusRemainingThisMonth = Math.max(bonusGrantedThisMonth - bonusUsedThisMonth, 0);

  return {
    planCode: ctx.planCode,
    periodKey,
    baseQuota,
    baseUsed,
    baseRemaining,
    bonusGrantedThisMonth,
    bonusUsedThisMonth,
    bonusRemainingThisMonth
  };
}