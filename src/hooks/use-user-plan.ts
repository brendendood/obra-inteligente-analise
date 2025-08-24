"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase, type UserPlanRow } from "@/lib/supabase/client";

export function useUserPlan() {
  const [plan, setPlan] = useState<UserPlanRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchPlan = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const { data: sessionData, error: sErr } = await supabase.auth.getSession();
      if (sErr) throw sErr;
      const user = sessionData.session?.user;
      if (!user) {
        setPlan(null);
        return;
      }

      const { data, error } = await supabase
        .from("user_plans")
        .select("user_id, plan_tier, billing_cycle, seats, messages_quota, updated_at, created_at")
        .eq("user_id", user.id)
        .maybeSingle();
      if (error) throw error;
      setPlan(data ?? null);
    } catch (e: any) {
      setError(e?.message ?? "Erro ao carregar plano");
      setPlan(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPlan();
  }, [fetchPlan]);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => fetchPlan());
    return () => subscription.unsubscribe();
  }, [fetchPlan]);

  return { plan, loading, error, refetch: fetchPlan };
}