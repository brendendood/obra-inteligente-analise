"use client";

import React from "react";
import { ExportBudgetBlock, ExportScheduleBlock, ExportTechnicalAnalysisBlock } from "@/components/blocks/FeatureBlocks";

export default function ExportExamplePage() {
  return (
    <main className="container mx-auto p-6 space-y-6">
      <ExportBudgetBlock>
        <div className="rounded-xl border p-6">
          <h1 className="text-xl font-semibold mb-2">Exportação de Orçamento</h1>
          <p className="text-sm text-muted-foreground">Liberado a partir do plano PRO.</p>
          {/* ...exportação de orçamento aqui... */}
        </div>
      </ExportBudgetBlock>

      <ExportScheduleBlock>
        <div className="rounded-xl border p-6">
          <h1 className="text-xl font-semibold mb-2">Exportação de Cronograma</h1>
          <p className="text-sm text-muted-foreground">Liberado a partir do plano PRO.</p>
          {/* ...exportação de cronograma aqui... */}
        </div>
      </ExportScheduleBlock>

      <ExportTechnicalAnalysisBlock>
        <div className="rounded-xl border p-6">
          <h1 className="text-xl font-semibold mb-2">Exportação de Análise Técnica</h1>
          <p className="text-sm text-muted-foreground">Liberado a partir do plano PRO.</p>
          {/* ...exportação de análise técnica aqui... */}
        </div>
      </ExportTechnicalAnalysisBlock>
    </main>
  );
}