"use client";

import { motion } from "framer-motion";
import { MoreHorizontal, FileText, FileImage, FileArchive } from "lucide-react";
import React from "react";
import { generatePdfThumbnail } from "@/lib/pdf/generate-thumbnail";

// Card de preview idêntico ao estilo do print (Google Docs)
// Regras:
// - PDF: gerar thumbnail real do upload com pdfjs e exibir no card
// - Imagem: exibir diretamente
// - DMG: exibir fallback fixo (Unsplash)
// - Outros: se houver previewSrc opcional, usa; senão mostra estado neutro

const DMG_FALLBACK =
  "https://images.unsplash.com/photo-1717343655329-e08427177978?q=80&w=2064&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

export type ProjectPreviewCardProps = {
  id: string;
  nome: string;
  mimeType: string; // ex.: application/pdf, image/png, application/x-apple-diskimage
  fileUrl?: string | null; // URL do arquivo UPADO pelo usuário (PDF/Imagem)
  previewSrc?: string | null; // opcional: se backend já gerar uma capa
  onClick?: (id: string) => void;
  menu?: React.ReactNode;
};

function isImage(mime: string) {
  return mime?.startsWith("image/");
}

export const ProjectPreviewCard: React.FC<ProjectPreviewCardProps> = ({
  id,
  nome,
  mimeType,
  fileUrl,
  previewSrc,
  onClick,
  menu,
}) => {
  const [thumb, setThumb] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  // Gera thumbnail real para PDFs a partir do upload do usuário
  React.useEffect(() => {
    let mounted = true;
    async function run() {
      if (mimeType === "application/pdf" && fileUrl) {
        setLoading(true);
        const dataUrl = await generatePdfThumbnail(fileUrl).catch(() => null);
        if (mounted) setThumb(dataUrl);
        setLoading(false);
      } else {
        setThumb(null);
      }
    }
    run();
    return () => {
      mounted = false;
    };
  }, [mimeType, fileUrl]);

  // Decide a imagem final
  let visualSrc: string | null = null;
  if (mimeType === "application/pdf") {
    visualSrc = thumb || previewSrc || null; // prioriza thumbnail real
  } else if (isImage(mimeType)) {
    visualSrc = fileUrl || previewSrc || null; // imagens usam o próprio upload
  } else if (mimeType === "application/x-apple-diskimage") {
    visualSrc = DMG_FALLBACK; // fallback fixo para DMG
  } else {
    visualSrc = previewSrc || null;
  }

  const TypeIcon = React.useMemo(() => {
    if (isImage(mimeType)) return FileImage;
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
        {/* Área do preview */}
        <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-800">
          <div className="absolute inset-0 p-2">
            <div className="h-full w-full rounded-xl overflow-hidden shadow-sm">
              {visualSrc ? (
                <img
                  src={visualSrc}
                  alt="Preview do projeto"
                  className="h-full w-full object-cover"
                  draggable={false}
                />
              ) : (
                <div className="h-full w-full animate-pulse bg-zinc-200 dark:bg-zinc-700" />
              )}
            </div>
          </div>
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="rounded-full bg-white/80 px-3 py-1 text-xs text-zinc-700 dark:bg-zinc-900/70 dark:text-zinc-200">
                Gerando preview…
              </div>
            </div>
          )}
        </div>

        {/* Rodapé: ícone + título + menu */}
        <div className="mt-3 flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-600 text-white">
            <TypeIcon className="h-4 w-4" aria-hidden="true" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-50">{nome}</p>
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