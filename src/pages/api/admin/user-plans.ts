import { supabaseAdmin } from "@/lib/supabase/admin";

interface ApiRequest {
  method?: string;
  body: {
    userId: string;
    planTier: string;
    billingCycle: string;
    seats: number;
    messages_quota: number;
  };
}

interface ApiResponse {
  status: (code: number) => { json: (data: any) => void };
  json: (data: any) => void;
}

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { userId, planTier, billingCycle, seats, messages_quota } = req.body;

    if (!userId || !planTier || !billingCycle) {
      return res.status(400).json({
        error: "Dados inválidos. Envie userId, planTier e billingCycle.",
      });
    }

    // Sanitização básica
    const validTiers = ["SOLO", "STUDIO", "ENTERPRISE"];
    const validCycles = ["mensal", "anual"];
    if (!validTiers.includes(planTier) || !validCycles.includes(billingCycle)) {
      return res.status(400).json({
        error: "Valores de plano/ciclo inválidos.",
      });
    }

    const updSeats =
      Number.isFinite(Number(seats)) && Number(seats) > 0 ? Number(seats) : 1;
    const updQuota =
      Number.isFinite(Number(messages_quota)) && Number(messages_quota) >= 0
        ? Number(messages_quota)
        : planTier === "SOLO"
        ? 500
        : planTier === "STUDIO"
        ? 2000
        : 10000;

    // Upsert do plano
    const { data, error } = await supabaseAdmin
      .from("user_plans")
      .upsert(
        {
          user_id: userId,
          plan_tier: planTier,
          billing_cycle: billingCycle,
          seats: updSeats,
          messages_quota: updQuota,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" }
      )
      .select()
      .maybeSingle();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.json({ ok: true, data });
  } catch (err: any) {
    return res.status(500).json({
      error: err?.message ?? "Erro inesperado",
    });
  }
}