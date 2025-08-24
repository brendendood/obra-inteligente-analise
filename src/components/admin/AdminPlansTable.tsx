"use client";

import { useMemo, useState } from "react";

import { type UserPlanRow, type PlanTier, type BillingCycle } from "@/lib/supabase/client";

type AdminUser = { id: string; email: string | null };

export function AdminPlansTable({
  users,
  plans,
}: {
  users: AdminUser[];
  plans: UserPlanRow[];
}) {
  const planMap = useMemo(() => {
    const m = new Map<string, UserPlanRow>();
    for (const p of plans) m.set(p.user_id, p);
    return m;
  }, [plans]);

  const [rows, setRows] = useState(
    users.map((u) => {
      const p = planMap.get(u.id);
      return {
        userId: u.id,
        email: u.email ?? "",
        planTier: (p?.plan_tier ?? "FREE") as PlanTier,
        billingCycle: (p?.billing_cycle ?? "mensal") as BillingCycle,
        seats: p?.seats ?? 1,
        messages_quota: p?.messages_quota ?? 500,
        saving: false,
        saved: false,
        error: "",
      };
    })
  );

  const handleChange = (
    idx: number,
    field: "planTier" | "billingCycle" | "seats" | "messages_quota",
    value: any
  ) => {
    setRows((r) => {
      const copy = [...r];
      (copy[idx] as any)[field] = value;
      (copy[idx] as any).saved = false;
      (copy[idx] as any).error = "";
      return copy;
    });
  };

  const saveRow = async (idx: number) => {
    const row = rows[idx];
    try {
      setRows((r) => {
        const c = [...r];
        c[idx].saving = true;
        c[idx].error = "";
        return c;
      });

      const res = await fetch("/api/admin/user-plans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: row.userId,
          planTier: row.planTier,
          billingCycle: row.billingCycle,
          seats: Number(row.seats),
          messages_quota: Number(row.messages_quota),
        }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Falha ao salvar");

      setRows((r) => {
        const c = [...r];
        c[idx].saving = false;
        c[idx].saved = true;
        return c;
      });
    } catch (e: any) {
      setRows((r) => {
        const c = [...r];
        c[idx].saving = false;
        c[idx].error = e?.message ?? "Erro ao salvar";
        return c;
      });
    }
  };

  return (
    <div className="w-full overflow-x-auto rounded-xl border border-border bg-card">
      <table className="w-full text-sm">
        <thead className="bg-muted/50 text-left">
          <tr className="[&>th]:px-3 [&>th]:py-2">
            <th>Usuário</th>
            <th>Plano</th>
            <th>Ciclo</th>
            <th>Assentos</th>
            <th>Mensagens/mês</th>
            <th className="text-right">Ações</th>
          </tr>
        </thead>
        <tbody className="[&>tr]:border-t [&>tr]:border-border">
          {rows.map((r, i) => (
            <tr key={r.userId} className="[&>td]:px-3 [&>td]:py-2">
              <td className="font-medium">{r.email || r.userId}</td>
              <td>
                <select
                  value={r.planTier}
                  onChange={(e) =>
                    handleChange(i, "planTier", e.currentTarget.value as PlanTier)
                  }
                  className="rounded-md border bg-background px-2 py-1"
                >
                  <option value="FREE">FREE</option>
                  <option value="BASIC">BASIC</option>
                  <option value="PRO">PRO</option>
                  <option value="ENTERPRISE">ENTERPRISE</option>
                </select>
              </td>
              <td>
                <select
                  value={r.billingCycle}
                  onChange={(e) =>
                    handleChange(
                      i,
                      "billingCycle",
                      e.currentTarget.value as BillingCycle
                    )
                  }
                  className="rounded-md border bg-background px-2 py-1"
                >
                  <option value="mensal">mensal</option>
                  <option value="anual">anual</option>
                </select>
              </td>
              <td>
                <input
                  type="number"
                  min={1}
                  value={r.seats}
                  onChange={(e) =>
                    handleChange(i, "seats", Number(e.currentTarget.value))
                  }
                  className="w-20 rounded-md border bg-background px-2 py-1"
                />
              </td>
              <td>
                <input
                  type="number"
                  min={0}
                  step={100}
                  value={r.messages_quota}
                  onChange={(e) =>
                    handleChange(
                      i,
                      "messages_quota",
                      Number(e.currentTarget.value)
                    )
                  }
                  className="w-24 rounded-md border bg-background px-2 py-1"
                />
              </td>
              <td className="text-right">
                <div className="flex items-center justify-end gap-2">
                  {r.error && (
                    <span className="text-xs text-red-600">{r.error}</span>
                  )}
                  {r.saved && !r.saving && (
                    <span className="text-xs text-green-600">Salvo ✓</span>
                  )}
                  <button
                    onClick={() => saveRow(i)}
                    disabled={r.saving}
                    className="rounded-md bg-primary px-3 py-1 text-primary-foreground hover:opacity-90 disabled:opacity-60"
                  >
                    {r.saving ? "Salvando..." : "Salvar"}
                  </button>
                </div>
              </td>
            </tr>
          ))}

          {rows.length === 0 && (
            <tr>
              <td
                colSpan={6}
                className="px-3 py-6 text-center text-muted-foreground"
              >
                Nenhum usuário encontrado.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}