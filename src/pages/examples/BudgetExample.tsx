"use client";

import React from "react";
import { BudgetBlock } from "@/components/blocks/FeatureBlocks";

export default function BudgetExamplePage() {
  return (
    <main className="container mx-auto p-6">
      <BudgetBlock>
        <div className="rounded-xl border p-6">
          <h1 className="text-xl font-semibold mb-2">Gerador de Orçamento</h1>
          <p className="text-sm text-muted-foreground">Conteúdo liberado para planos BASIC ou superiores.</p>
          {/* ...seu componente Budget real aqui... */}
        </div>
      </BudgetBlock>
    </main>
  );
}