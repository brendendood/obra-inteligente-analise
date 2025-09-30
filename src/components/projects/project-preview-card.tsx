"use client";

import { motion } from "framer-motion";
import { MoreHorizontal, FileText, FileImage, FileArchive } from "lucide-react";
import React from "react";

export type ProjectPreviewCardProps = {
  id: string;
  nome: string;
  mimeType: string;
  previewSrc?: string | null;
  onClick?: (id: string) => void;
  menu?: React.ReactNode;
};

function isPreviewable(mimeType: string, hasPreviewImage: boolean): boolean {
  if (hasPreviewImage) return true;
  if (!mimeType) return false;
  if (mimeType.startsWith("image/")) return true;
  if (mimeType === "application/pdf") return true;
  return false;
}

export const ProjectPreviewCard: React.FC<ProjectPreviewCardProps> = ({
  id,
  nome,
  mimeType,
  previewSrc,
  onClick,
  menu,
}) => {
  const showPreview = isPreviewable(mimeType, Boolean(previewSrc));

  const visualSrc = showPreview && previewSrc
    ? previewSrc
    : mimeType === "application/x-apple-diskimage"
      ? "https://images.unsplash.com/photo-1717343655329-e08427177978?q=80&w=2064&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      : previewSrc ?? "";

  const TypeIcon = React.useMemo(() => {
    if (mimeType.startsWith?.("image/")) return FileImage;
    if (mimeType === "application/pdf") return FileText;
    if (mimeType === "application/x-apple-diskimage") return FileArchive;
    return FileText;
  }, [mimeType]);

  return (
    <motion.button
      type="button"
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      onClick={() => onClick?.(id)}
      className="group w-full text-left"
      aria-label={`Abrir projeto ${nome}`}
    >
      <div className="rounded-2xl bg-white/90 dark:bg-zinc-900/80 shadow-sm ring-1 ring-black/5 dark:ring-white/5 p-3 hover:shadow-md transition-shadow duration-200">
        {/* Preview visual */}
        <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-800">
          <div className="absolute inset-0 p-2">
            <div className="h-full w-full rounded-xl overflow-hidden shadow-sm">
              <img
                src={visualSrc}
                alt={showPreview ? "Preview do projeto" : "Preview indisponível"}
                className="h-full w-full object-cover"
                draggable={false}
              />
            </div>
          </div>
        </div>

        {/* Rodapé */}
        <div className="mt-3 flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-600 text-white">
            <TypeIcon className="h-4 w-4" aria-hidden="true" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-50">
              {nome}
            </p>
          </div>
          <div className="shrink-0 text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200">
            {menu ?? <MoreHorizontal className="h-5 w-5" aria-label="Mais opções" />}
          </div>
        </div>
      </div>
    </motion.button>
  );
};

export default ProjectPreviewCard;