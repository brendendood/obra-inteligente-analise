"use client";

import React, { useMemo } from "react";
import { useFeatureAccess } from "@/hooks/use-feature-access";
import PremiumBlocker from "@/components/modals/premium-blocker";
import { useNavigate } from "react-router-dom";

type RequiredPlan = "BASIC" | "PRO" | "ENTERPRISE";

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
  const navigate = useNavigate();

  const allowed = useMemo(() => {
    if (loading) return false;
    return hasAccess(feature);
  }, [loading, hasAccess, feature]);

  if (loading) return null;

  // CRÍTICO: Se não tem acesso, NUNCA renderizar children
  if (!allowed) {
    return (
      <PremiumBlocker
        isOpen={true}
        onClose={() => {}} // Não permitir fechar
        featureName={`Este recurso (${feature}) exige plano ${requiredPlan}`}
        hasPermission={false}
        onUpgrade={() => navigate("/plano")}
      />
    );
  }

  return <>{children}</>;
}

export default PlanGuard;