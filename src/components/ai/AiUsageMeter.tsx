"use client";

import React, { useEffect, useState } from "react";
import { useFeatureAccess } from "@/hooks/use-feature-access";

export default function AiUsageMeter() {
  const { getAiUsage } = useFeatureAccess();
  const [state, setState] = useState<{ 
    count: number; 
    limit: number | "unlimited"; 
    remaining: number; 
    nearLimit: boolean 
  }>({
    count: 0,
    limit: 0,
    remaining: 0,
    nearLimit: false,
  });

  useEffect(() => {
    (async () => {
      const res = await getAiUsage();
      setState({
        count: res.count,
        limit: res.limit,
        remaining: (res.limit === "unlimited" ? Infinity : res.remaining) ?? 0,
        nearLimit: !!res.nearLimit,
      });
    })();
  }, [getAiUsage]);

  if (state.limit === "unlimited") {
    return (
      <div className="text-xs text-muted-foreground">
        Mensagens de IA: <span className="font-medium">Ilimitadas</span>
      </div>
    );
  }

  const total = Number(state.limit) || 0;
  const pct = total > 0 ? Math.min(100, Math.round((state.count / total) * 100)) : 0;

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>Uso de IA</span>
        <span>{state.count} / {total} • {pct}%</span>
      </div>
      <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
        <div
          className={`h-full transition-all ${state.nearLimit ? "bg-yellow-500" : "bg-blue-600"}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      {state.nearLimit && (
        <div className="text-[11px] text-yellow-600 dark:text-yellow-400">
          Você está próximo do limite. Considere atualizar o plano.
        </div>
      )}
    </div>
  );
}