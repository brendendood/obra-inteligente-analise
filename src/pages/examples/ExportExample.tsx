"use client";

import React from "react";
import { ExportBudgetBlock, ExportScheduleBlock, ExportDocumentsBlock } from "@/components/blocks/FeatureBlocks";

export default function ExportExamplePage() {
  return (
    <main className="container mx-auto p-6 space-y-6">
      <ExportBudgetBlock>
        <div className="rounded-xl border p-6">
          <h1 className="text-xl font-semibold mb-2">Exportação de Orçamento</h1>
          <p className="text-sm text-muted-foreground">Liberado a partir de PRO.</p>
        </div>
      </ExportBudgetBlock>
      
      <ExportScheduleBlock>
        <div className="rounded-xl border p-6">
          <h1 className="text-xl font-semibold mb-2">Exportação de Cronograma</h1>
          <p className="text-sm text-muted-foreground">Liberado a partir de PRO.</p>
        </div>
      </ExportScheduleBlock>
      
      <ExportDocumentsBlock>
        <div className="rounded-xl border p-6">
          <h1 className="text-xl font-semibold mb-2">Exportação de Documentos</h1>
          <p className="text-sm text-muted-foreground">Liberado a partir de PRO.</p>
        </div>
      </ExportDocumentsBlock>
    </main>
  );
}