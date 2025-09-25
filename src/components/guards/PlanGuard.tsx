"use client";

import React, { useMemo, useState } from "react";
import { useFeatureAccess } from "@/hooks/use-feature-access";
import PremiumBlocker from "@/components/modals/premium-blocker";

type RequiredPlan = "FREE" | "BASIC" | "PRO" | "ENTERPRISE";

export function PlanGuard({
  requiredPlan,
  feature,
  children,
}: {
  requiredPlan: RequiredPlan; // mínimo necessário
  feature: string;            // id da feature (ex.: "budget" | "schedule" | "export" | "ai_assistant")
  children: React.ReactNode;
}) {
  const { plan, loading, hasAccess } = useFeatureAccess();
  const [open, setOpen] = useState(false);

  const allowed = useMemo(() => {
    if (loading) return false;
    return hasAccess(feature);
  }, [loading, hasAccess, feature]);

  if (loading) return null;

  if (!allowed) {
    return (
      <>
        <PremiumBlocker
          isOpen={!open ? true : open} // aberto por padrão quando não permitido
          onClose={() => setOpen(false)}
          featureName={`Este recurso (${feature}) exige plano ${requiredPlan}`}
          hasPermission={false}
          onUpgrade={() => {
            alert("Entre em contato para upgrade de plano");
          }}
        />
      </>
    );
  }

  return <>{children}</>;
}

export default PlanGuard;