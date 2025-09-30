"use client";

import React from "react";
import ProjectPreviewGrid, { ProjectItem } from "@/components/projects/project-preview-grid";

// Esta seção deve receber os projetos reais do backend. 
// Estrutura esperada por item: { id, nome, mimeType, fileUrl }
// Para DMG: apenas informe mimeType = "application/x-apple-diskimage"; o fallback é automático.

export default function MyProjectsPreviews({ projetos }: { projetos: ProjectItem[] }) {
  return (
    <div className="mt-4">
      <ProjectPreviewGrid itens={projetos} onItemClick={(id) => console.log("abrir projeto", id)} />
    </div>
  );
}