"use client";

import React from "react";
import ProjectPreviewCard, { ProjectPreviewCardProps } from "./project-preview-card";

export type ProjectItem = ProjectPreviewCardProps;

export type ProjectPreviewGridProps = {
  itens: ProjectItem[];
  onItemClick?: (id: string) => void;
  className?: string;
};

export default function ProjectPreviewGrid({ itens, onItemClick, className }: ProjectPreviewGridProps) {
  return (
    <div className={"grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 " + (className ?? "") }>
      {itens.map((item) => (
        <ProjectPreviewCard key={item.id} {...item} onClick={(id) => onItemClick?.(id)} />
      ))}
    </div>
  );
}