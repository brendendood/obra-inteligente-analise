import React, { PropsWithChildren, useMemo, useState } from "react";
import { useFeatureAccess } from "@/hooks/use-feature-access";
import { cn } from "@/lib/utils";
import { useIsTouchDevice } from "./useIsTouchDevice";

type Props = PropsWithChildren<{
  feature: string;
  className?: string;
  ctaHref?: string;
  ctaText?: string;
  reasonText?: string;
  blurIntensity?: "sm" | "md" | "lg";
  lockPointerEvents?: boolean;
}>;

/**
 * BlurReveal
 * Envolve um bloco de UI. Se o usuário não tiver acesso à feature:
 * - aplica blur e escurecimento no conteúdo
 * - mostra overlay com CTA de upgrade ao hover (desktop) e sempre visível no mobile
 * - mantém DOM renderizado para gerar "curiosidade" (mas opcionalmente bloqueia cliques)
 */
export default function BlurReveal({
  feature,
  className,
  ctaHref = "/selecionar-plano",
  ctaText = "Fazer upgrade",
  reasonText,
  blurIntensity = "md",
  lockPointerEvents = true,
  children,
}: Props) {
  const { hasAccess, plan, loading } = useFeatureAccess();
  const allowed = hasAccess(feature);
  const isTouch = useIsTouchDevice();
  const [showOverlay, setShowOverlay] = useState<boolean>(isTouch && !allowed);

  if (loading) {
    return <div className={className}>{children}</div>;
  }

  const blurClass = useMemo(() => {
    if (allowed) return "";
    switch (blurIntensity) {
      case "sm":
        return "blur-sm";
      case "lg":
        return "blur-xl";
      default:
        return "blur-md";
    }
  }, [allowed, blurIntensity]);

  if (allowed) {
    return <div className={className}>{children}</div>;
  }

  // Conteúdo bloqueado com blur + overlay
  return (
    <div
      className={cn(
        "relative group rounded-xl border border-transparent",
        "overflow-hidden", // garante overlay correto
        className
      )}
      onMouseEnter={() => !isTouch && setShowOverlay(true)}
      onMouseLeave={() => !isTouch && setShowOverlay(false)}
    >
      <div
        className={cn(
          "transition-all duration-300",
          blurClass,
          "brightness-75",
          lockPointerEvents ? "pointer-events-none select-none" : ""
        )}
        aria-hidden="true"
      >
        {children}
      </div>

      <div
        className={cn(
          "absolute inset-0 flex items-center justify-center p-4",
          "bg-gradient-to-b from-black/20 via-black/30 to-black/50",
          "transition-opacity duration-300",
          showOverlay ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        )}
        // garante foco via teclado
        role="region"
        aria-label="Recurso indisponível no seu plano"
      >
        <div
          className={cn(
            "backdrop-blur-sm",
            "rounded-2xl px-4 py-3",
            "bg-white/80 dark:bg-slate-900/70",
            "shadow-lg ring-1 ring-black/10 dark:ring-white/10",
            "text-center max-w-[460px] w-full"
          )}
        >
          <p className="text-sm md:text-base font-medium">
            {reasonText ??
              `Este recurso não está disponível no seu plano atual (${labelPlan(plan?.plan_tier)}).`}
          </p>
          <a
            href={ctaHref}
            className={cn(
              "mt-3 inline-flex items-center justify-center",
              "rounded-xl px-4 py-2 text-sm font-semibold",
              "bg-primary text-white hover:bg-primary/90",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
            )}
          >
            {ctaText}
          </a>
          <p className="mt-2 text-xs opacity-75">
            Passe o mouse para visualizar o botão (desktop). No celular, o
            botão já aparece.
          </p>
        </div>
      </div>
    </div>
  );
}

function labelPlan(plan?: string) {
  switch (plan) {
    case "FREE":
      return "Teste Grátis";
    case "BASIC":
      return "Basic";
    case "PRO":
      return "Pro";
    case "ENTERPRISE":
      return "Enterprise";
    default:
      return plan ?? "Grátis";
  }
}
