"use client";

import React, { useEffect, useState } from "react";
import { useFeatureAccess } from "@/hooks/use-feature-access";
import PremiumBlocker from "@/components/modals/premium-blocker";

export default function AIMessageGuard({
  children,
}: {
  children: (ctx: { canSend: boolean; nearLimit: boolean; remaining?: number }) => React.ReactNode;
}) {
  const { getAiUsage, canSendAiMessage } = useFeatureAccess();
  const [state, setState] = useState<{ canSend: boolean; nearLimit: boolean; remaining?: number }>({
    canSend: true,
    nearLimit: false,
    remaining: undefined,
  });
  const [showBlock, setShowBlock] = useState(false);

  useEffect(() => {
    (async () => {
      const usage = await getAiUsage();
      setState({ canSend: usage.limit === "unlimited" || usage.remaining > 0, nearLimit: usage.nearLimit, remaining: usage.remaining });
    })();
  }, [getAiUsage]);

  const requestOneMessage = async () => {
    const res = await canSendAiMessage();
    if (!res.allowed) {
      setShowBlock(true);
      setState({ canSend: false, nearLimit: true, remaining: 0 });
      return false;
    }
    setState({ canSend: true, nearLimit: !!res.nearLimit, remaining: res.remaining });
    return true;
  };

  return (
    <>
      {/* Usar render-prop: o filho chama requestOneMessage antes de enviar */}
      {children({ canSend: state.canSend, nearLimit: state.nearLimit, remaining: state.remaining })}

      <PremiumBlocker
        isOpen={showBlock}
        onClose={() => setShowBlock(false)}
        featureName="Limite de mensagens de IA atingido"
        hasPermission={false}
        onUpgrade={() => alert("Entre em contato para upgrade de plano")}
      />
    </>
  );
}