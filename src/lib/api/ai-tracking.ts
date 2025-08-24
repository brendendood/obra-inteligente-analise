import { supabase } from "@/integrations/supabase/client";

export type PlanTier = "FREE" | "BASIC" | "PRO" | "ENTERPRISE";

const AI_LIMITS: Record<PlanTier, number | "unlimited"> = {
  FREE: 50,
  BASIC: 500,
  PRO: 2000,
  ENTERPRISE: "unlimited",
};

function currentPeriodYM(date = new Date()) {
  const y = date.getFullYear();
  const m = `${date.getMonth() + 1}`.padStart(2, "0");
  return `${y}-${m}`;
}

export async function trackAIMessage() {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    const uid = session?.user?.id;
    
    if (!uid) {
      return { allowed: false, reason: "not_authenticated" };
    }

    // 1) get user plan
    const { data: plan, error: planErr } = await supabase
      .from("user_plans")
      .select("plan_tier")
      .eq("user_id", uid)
      .maybeSingle();
    
    if (planErr) throw planErr;

    const tier: PlanTier = (plan?.plan_tier ?? "FREE") as PlanTier;
    const limit = AI_LIMITS[tier];

    // Unlimited?
    if (limit === "unlimited") {
      const period = currentPeriodYM();
      await supabase
        .from("ai_message_usage")
        .upsert({ 
          user_id: uid, 
          period_ym: period, 
          count: 1,
          updated_at: new Date().toISOString() 
        }, { 
          onConflict: "user_id,period_ym" 
        });
      return { allowed: true, limit, remaining: Number.POSITIVE_INFINITY, nearLimit: false };
    }

    // 2) read current usage
    const period = currentPeriodYM();
    const { data: usage } = await supabase
      .from("ai_message_usage")
      .select("count")
      .eq("user_id", uid)
      .eq("period_ym", period)
      .maybeSingle();
    
    const count = usage?.count ?? 0;

    if (count >= limit) {
      return { allowed: false, reason: "limit_reached", count, limit, remaining: 0, nearLimit: true };
    }

    // 3) increment
    const { data: upserted, error: upErr } = await supabase
      .from("ai_message_usage")
      .upsert({
        user_id: uid,
        period_ym: period,
        count: count + 1,
        updated_at: new Date().toISOString()
      }, {
        onConflict: "user_id,period_ym"
      })
      .select("count")
      .maybeSingle();
    
    if (upErr) throw upErr;

    const newCount = upserted?.count ?? count + 1;
    const remaining = Math.max(0, limit - newCount);
    const nearLimit = newCount / limit >= 0.8;

    return { allowed: true, count: newCount, limit, remaining, nearLimit };
  } catch (e: any) {
    return { allowed: false, reason: e?.message ?? "server_error" };
  }
}