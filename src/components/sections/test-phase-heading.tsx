"use client";

import { SparklesText } from "@/components/ui/sparkles-text";

export function TestPhaseHeading() {
  return (
    <div className="w-full text-center">
      {/* TÍTULO (menor, mantendo o efeito do prompt) */}
      <SparklesText
        text="Fase de testes concluida com sucesso."
        className="text-2xl md:text-3xl font-semibold"
      />

      {/* DESCRIÇÃO (menor) */}
      <p className="mt-1 text-xs md:text-sm text-muted-foreground">
        Testada e aprovada por +200 arquitetos e engenheiros civis
      </p>
    </div>
  );
}