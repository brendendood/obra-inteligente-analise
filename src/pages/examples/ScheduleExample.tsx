"use client";

import React from "react";
import { ScheduleBlock } from "@/components/blocks/FeatureBlocks";

export default function ScheduleExamplePage() {
  return (
    <main className="container mx-auto p-6">
      <ScheduleBlock>
        <div className="rounded-xl border p-6">
          <h1 className="text-xl font-semibold mb-2">Gerador de Cronograma</h1>
          <p className="text-sm text-muted-foreground">Disponível a partir de BASIC.</p>
          {/* ...seu componente Schedule real aqui... */}
        </div>
      </ScheduleBlock>
    </main>
  );
}