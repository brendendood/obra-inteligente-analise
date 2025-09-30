import React, { useState, useEffect } from 'react';
import { FileText, Image as ImageIcon, File } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface ProjectThumbnailProps {
  project: {
    id: string;
    file_path: string;
    name: string;
  };
  className?: string;
}

export const ProjectThumbnail = ({ project, className = "" }: ProjectThumbnailProps) => {
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  const getFileExtension = (filePath: string) => {
    return filePath.split('.').pop()?.toLowerCase() || '';
  };

  const fileExtension = getFileExtension(project.file_path);

  useEffect(() => {
    const generateThumbnail = async () => {
      if (!project.file_path) {
        setIsLoading(false);
        return;
      }

      try {
        // Se for PDF, tentar gerar thumbnail
        if (fileExtension === 'pdf') {
          setIsLoading(true);
          
          // Verificar se já existe thumbnail no storage
          const thumbnailPath = `thumbnails/${project.id}.jpg`;
          const { data: existingThumbnail } = await supabase.storage
            .from('project-files')
            .list('thumbnails', {
              search: `${project.id}.jpg`
            });

          if (existingThumbnail && existingThumbnail.length > 0) {
            // Thumbnail já existe, buscar URL
            const { data } = supabase.storage
              .from('project-files')
              .getPublicUrl(thumbnailPath);
            
            setThumbnailUrl(data.publicUrl);
          } else {
            // Gerar novo thumbnail
            const { data: fileData } = await supabase.storage
              .from('project-files')
              .download(project.file_path);

            if (fileData) {
              const pdfThumbnail = await generatePDFThumbnail(fileData);
              if (pdfThumbnail) {
                // Upload thumbnail para storage
                const { error: uploadError } = await supabase.storage
                  .from('project-files')
                  .upload(thumbnailPath, pdfThumbnail, {
                    contentType: 'image/jpeg',
                    upsert: true
                  });

                if (!uploadError) {
                  const { data } = supabase.storage
                    .from('project-files')
                    .getPublicUrl(thumbnailPath);
                  
                  setThumbnailUrl(data.publicUrl);
                }
              }
            }
          }
        }
      } catch (err) {
        console.error('Erro ao gerar thumbnail:', err);
        setError(true);
      } finally {
        setIsLoading(false);
      }
    };

    generateThumbnail();
  }, [project.id, project.file_path, fileExtension]);

  const generatePDFThumbnail = async (file: Blob): Promise<Blob | null> => {
    try {
      // Importar PDF.js dinamicamente
      const pdfjsLib = await import('pdfjs-dist');
      
      // Configurar worker
      pdfjsLib.GlobalWorkerOptions.workerSrc = 
        '//mozilla.github.io/pdf.js/build/pdf.worker.min.mjs';

      // Converter blob para array buffer
      const arrayBuffer = await file.arrayBuffer();
      
      // Carregar PDF
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      
      // Pegar primeira página
      const page = await pdf.getPage(1);
      
      // Configurar viewport para thumbnail (300px de largura)
      const viewport = page.getViewport({ scale: 300 / page.getViewport({ scale: 1 }).width });
      
      // Criar canvas
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      
      if (!context) return null;
      
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      
      // Renderizar página
      await page.render({
        canvasContext: context,
        viewport: viewport,
        canvas: canvas
      }).promise;
      
      // Converter canvas para blob
      return new Promise<Blob | null>((resolve) => {
        canvas.toBlob((blob) => {
          resolve(blob);
        }, 'image/jpeg', 0.8);
      });
    } catch (error) {
      console.error('Erro ao gerar thumbnail do PDF:', error);
      return null;
    }
  };

  const renderIcon = () => {
    const iconClass = `h-12 w-12 ${className}`;
    
    switch (fileExtension) {
      case 'pdf':
        return <FileText className={`${iconClass} text-red-500`} />;
      case 'dwg':
      case 'dxf':
        return <File className={`${iconClass} text-blue-500`} />;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
      case 'webp':
        return <ImageIcon className={`${iconClass} text-green-500`} />;
      default:
        return <File className={`${iconClass} text-gray-500`} />;
    }
  };

  if (isLoading && fileExtension === 'pdf') {
    return (
      <div className={`flex items-center justify-center bg-gray-100 rounded-lg ${className}`}>
        <div className="animate-pulse">
          <FileText className="h-12 w-12 text-gray-400" />
        </div>
      </div>
    );
  }

  // Para arquivos PDF com thumbnail gerado
  if (thumbnailUrl && fileExtension === 'pdf' && !error) {
    return (
      <div className={`overflow-hidden rounded-lg ${className}`}>
        <img
          src={thumbnailUrl}
          alt={`Thumbnail do projeto ${project.name}`}
          className="w-full h-full object-cover"
          onError={() => setError(true)}
        />
      </div>
    );
  }

  // Para todos os outros casos ou quando há erro, mostrar ícone
  return (
    <div className={`flex items-center justify-center bg-gray-50 rounded-lg ${className}`}>
      {renderIcon()}
      <div className="absolute bottom-1 right-1 bg-white/90 px-1.5 py-0.5 rounded text-xs font-medium text-gray-600 uppercase">
        {fileExtension}
      </div>
    </div>
  );
};