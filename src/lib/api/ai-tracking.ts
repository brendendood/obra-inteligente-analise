import { supabase } from "@/integrations/supabase/client";

import { type PlanTier, PLAN_FEATURES } from "@/lib/domain/plans";

function currentPeriodYM(date = new Date()) {
  const y = date.getFullYear();
  const m = `${date.getMonth() + 1}`.padStart(2, "0");
  return `${y}-${m}`;
}

export async function trackAIMessage() {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.access_token) {
      return { allowed: false, reason: "not_authenticated" };
    }

    // Chamar edge function com autenticação server-side segura
    const response = await fetch(`https://mozqijzvtbuwuzgemzsm.supabase.co/functions/v1/ai-track-message`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      return { allowed: false, reason: error.reason || "server_error" };
    }

    const result = await response.json();
    return result;
  } catch (e: any) {
    return { allowed: false, reason: e?.message ?? "server_error" };
  }
}