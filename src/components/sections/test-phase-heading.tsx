"use client";

import { GradientText } from "@/components/ui/gradient-text";

export function TestPhaseHeading() {
  return (
    <div className="w-full text-center">
      {/* TÍTULO (menor, animado com gradient) */}
      <GradientText
        colors={["#00A3FF", "#7dd3fc", "#00A3FF"]}
        animationSpeed={6}
        className="text-2xl md:text-3xl font-semibold"
      >
        Fase de testes concluida com sucesso.
      </GradientText>

      {/* DESCRIÇÃO menor */}
      <p className="mt-1 text-xs md:text-sm text-muted-foreground">
        Testada e aprovada por +200 arquitetos e engenheiros civis
      </p>
    </div>
  );
}