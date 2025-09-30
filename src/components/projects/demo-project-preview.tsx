import React from "react";
import ProjectPreviewGrid from "./project-preview-grid";
import { ProjectItem } from "./project-preview-grid";

const demoProjects: ProjectItem[] = [
  {
    id: "1",
    nome: "Contrato Bold Web",
    mimeType: "application/pdf",
    previewSrc: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: "2", 
    nome: "Projeto Residencial",
    mimeType: "image/jpeg",
    previewSrc: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=2073&auto=format&fit=crop"
  },
  {
    id: "3",
    nome: "Plantas Arquitetônicas", 
    mimeType: "application/pdf",
    previewSrc: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=2031&auto=format&fit=crop"
  },
  {
    id: "4",
    nome: "Orçamento Detalhado",
    mimeType: "application/pdf", 
    previewSrc: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=2070&auto=format&fit=crop"
  }
];

export default function DemoProjectPreview() {
  const handleItemClick = (id: string) => {
    console.log("Clicked project:", id);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Meus Projetos</h1>
        <p className="text-muted-foreground">Visualize e gerencie seus projetos</p>
      </div>
      
      <ProjectPreviewGrid 
        itens={demoProjects}
        onItemClick={handleItemClick}
      />
    </div>
  );
}