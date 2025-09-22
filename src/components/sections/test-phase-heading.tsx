"use client";

import { TextEffect } from "@/components/ui/text-effect";

export function TestPhaseHeading() {
  return (
    <div className="w-full text-center">
      {/* TÍTULO (menor, animado com TextEffect) */}
      <TextEffect
        per="word"
        preset="slide"
        className="text-2xl md:text-3xl font-semibold text-primary"
        as="h1"
      >
        Fase de testes concluida com sucesso.
      </TextEffect>

      {/* DESCRIÇÃO menor */}
      <p className="mt-1 text-xs md:text-sm text-muted-foreground">
        Testada e aprovada por +200 arquitetos e engenheiros civis
      </p>
    </div>
  );
}