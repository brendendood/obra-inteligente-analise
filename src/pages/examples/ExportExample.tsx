"use client";

import React from "react";
import { ExportBlock } from "@/components/blocks/FeatureBlocks";

export default function ExportExamplePage() {
  return (
    <main className="container mx-auto p-6">
      <ExportBlock>
        <div className="rounded-xl border p-6">
          <h1 className="text-xl font-semibold mb-2">Exportações</h1>
          <p className="text-sm text-muted-foreground">Liberado a partir de BASIC.</p>
          {/* ...seu componente Export real aqui... */}
        </div>
      </ExportBlock>
    </main>
  );
}