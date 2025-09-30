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
  const [usingFallback, setUsingFallback] = useState(false);

  const getFileExtension = (filePath: string) => {
    return filePath.split('.').pop()?.toLowerCase() || '';
  };

  const fileExtension = getFileExtension(project.file_path);

  useEffect(() => {
    const generateThumbnail = async () => {
      if (!project.file_path || fileExtension !== 'pdf') {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        
        // Verificar se já existe thumbnail no storage - primeiro no bucket thumbnails
        const thumbnailPath = `${project.id}.jpg`;
        
        // Tentar buscar thumbnail existente primeiro no bucket dedicado
        let existingThumbnail = null;
        let downloadError = null;
        
        try {
          const { data, error } = await supabase.storage
            .from('thumbnails')
            .download(thumbnailPath);
          existingThumbnail = data;
          downloadError = error;
        } catch (err) {
          console.log('Bucket thumbnails não disponível, tentando project-files:', err);
          // Fallback para bucket project-files
          const { data, error } = await supabase.storage
            .from('project-files')
            .download(`thumbnails/${thumbnailPath}`);
          existingThumbnail = data;
          downloadError = error;
        }

        if (existingThumbnail && !downloadError) {
          // Thumbnail já existe, criar URL do blob
          const thumbnailBlob = URL.createObjectURL(existingThumbnail);
          setThumbnailUrl(thumbnailBlob);
          setIsLoading(false);
          console.log('Thumbnail carregado do storage:', thumbnailPath);
          return;
        }

        // Se não existe, gerar novo thumbnail
        console.log('Gerando novo thumbnail para:', project.file_path);
        
        const { data: fileData, error: fileError } = await supabase.storage
          .from('project-files')
          .download(project.file_path);

        if (fileError || !fileData) {
          console.error('Erro ao baixar arquivo PDF:', fileError);
          setError(true);
          setIsLoading(false);
          return;
        }

        const pdfThumbnail = await generatePDFThumbnail(fileData);
        if (pdfThumbnail) {
          // Criar URL do blob para exibição imediata (sempre funciona)
          const thumbnailBlob = URL.createObjectURL(pdfThumbnail);
          setThumbnailUrl(thumbnailBlob);
          
          // Tentar upload para storage (não bloquear se falhar)
          try {
            // Primeiro tentar bucket dedicado
            const { error: uploadError } = await supabase.storage
              .from('thumbnails')
              .upload(thumbnailPath, pdfThumbnail, {
                contentType: 'image/jpeg',
                upsert: true
              });

            if (uploadError) {
              console.log('Falha no upload para bucket thumbnails, tentando project-files:', uploadError);
              // Fallback para bucket project-files
              const { error: fallbackError } = await supabase.storage
                .from('project-files')
                .upload(`thumbnails/${thumbnailPath}`, pdfThumbnail, {
                  contentType: 'image/jpeg',
                  upsert: true
                });
              
              if (fallbackError) {
                console.warn('Upload de thumbnail falhou em ambos buckets:', fallbackError);
                setUsingFallback(true);
              } else {
                console.log('Thumbnail salvo no fallback project-files');
              }
            } else {
              console.log('Thumbnail salvo no bucket thumbnails');
            }
          } catch (uploadErr) {
            console.warn('Erro ao fazer upload do thumbnail (usando fallback em memória):', uploadErr);
            setUsingFallback(true);
          }
        } else {
          setError(true);
        }
      } catch (err) {
        console.error('Erro ao gerar thumbnail:', err);
        setError(true);
      } finally {
        setIsLoading(false);
      }
    };

    generateThumbnail();

    // Cleanup function para revogar URLs do blob
    return () => {
      if (thumbnailUrl && thumbnailUrl.startsWith('blob:')) {
        URL.revokeObjectURL(thumbnailUrl);
      }
    };
  }, [project.id, project.file_path, fileExtension]);

  const generatePDFThumbnail = async (file: Blob): Promise<Blob | null> => {
    try {
      console.log('Iniciando geração de thumbnail PDF...');
      
      // Verificar se pdfjs-dist está disponível
      if (typeof window === 'undefined') {
        console.error('PDF.js não disponível no servidor');
        return null;
      }

      // Importar PDF.js dinamicamente apenas no browser
      const pdfjsLib = await import('pdfjs-dist');
      
      // Configurar worker com URL absoluta da versão correta
      if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
        pdfjsLib.GlobalWorkerOptions.workerSrc = 
          'https://unpkg.com/pdfjs-dist@5.4.149/build/pdf.worker.min.mjs';
      }

      // Converter blob para array buffer
      const arrayBuffer = await file.arrayBuffer();
      console.log('PDF carregado, tamanho:', arrayBuffer.byteLength);
      
      // Carregar PDF
      const pdf = await pdfjsLib.getDocument({ 
        data: arrayBuffer,
        standardFontDataUrl: undefined,
        verbosity: 0 // Reduzir logs do PDF.js
      }).promise;
      
      console.log('PDF processado, páginas:', pdf.numPages);
      
      // Pegar primeira página
      const page = await pdf.getPage(1);
      
      // Configurar viewport para uma boa qualidade de thumbnail
      const scale = 1.5;
      const viewport = page.getViewport({ scale });
      
      console.log('Viewport configurado:', viewport.width, 'x', viewport.height);
      
      // Criar canvas
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      
      if (!context) {
        console.error('Não foi possível obter contexto 2D do canvas');
        return null;
      }
      
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      
      // Configurar fundo branco para PDFs transparentes
      context.fillStyle = '#ffffff';
      context.fillRect(0, 0, canvas.width, canvas.height);
      
      console.log('Iniciando renderização da página...');
      
      // Renderizar página (compatibilidade com diferentes versões do PDF.js)
      const renderContext: any = {
        canvasContext: context,
        viewport: viewport
      };
      
      await page.render(renderContext).promise;
      
      console.log('Página renderizada com sucesso');
      
      // Converter canvas para blob com boa qualidade
      return new Promise<Blob | null>((resolve) => {
        canvas.toBlob((blob) => {
          if (blob) {
            console.log('Thumbnail gerado, tamanho:', blob.size);
          } else {
            console.error('Falha ao converter canvas para blob');
          }
          resolve(blob);
        }, 'image/jpeg', 0.85); // Qualidade 85%
      });
    } catch (error) {
      console.error('Erro detalhado ao gerar thumbnail do PDF:', error);
      return null;
    }
  };

  const renderIcon = () => {
    const iconClass = `h-8 w-8 ${className}`;
    
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

  // Para arquivos PDF, sempre tentar mostrar thumbnail real
  if (fileExtension === 'pdf') {
    if (isLoading) {
      return (
        <div className={`flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg ${className} min-h-[120px] relative border border-blue-100`}>
          <div className="animate-pulse flex flex-col items-center">
            <div className="w-12 h-16 bg-blue-200 rounded-sm mb-2 animate-bounce"></div>
            <div className="text-xs text-blue-600 font-medium">Carregando preview...</div>
            <div className="text-xs text-blue-500 mt-1">Gerando thumbnail do PDF</div>
          </div>
          <div className="absolute bottom-2 right-2 bg-blue-500 text-white px-2 py-1 rounded text-xs font-medium uppercase">
            PDF
          </div>
        </div>
      );
    }

    if (thumbnailUrl && !error) {
      return (
        <div className={`overflow-hidden rounded-lg ${className} relative group border border-gray-200 hover:border-blue-300 transition-colors`}>
          <img
            src={thumbnailUrl}
            alt={`Preview do PDF: ${project.name}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
            onError={() => {
              console.error('Erro ao carregar imagem do thumbnail');
              setError(true);
            }}
          />
          {/* Overlay sutil para indicar que é PDF */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="absolute bottom-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-medium uppercase shadow-sm">
            PDF
          </div>
          {/* Indicador de fallback se necessário */}
          {usingFallback && (
            <div className="absolute top-2 left-2 bg-yellow-500 text-white px-1.5 py-0.5 rounded text-xs font-medium">
              Cache
            </div>
          )}
        </div>
      );
    }

    // Se houve erro ou não conseguiu gerar thumbnail, mostrar ícone PDF mais elaborado
    return (
      <div className={`flex flex-col items-center justify-center bg-gray-50 rounded-lg ${className} min-h-[120px] relative border-2 border-dashed border-gray-200`}>
        <FileText className="h-12 w-12 text-gray-400 mb-2" />
        <div className="text-xs text-gray-500 font-medium">PDF</div>
        <div className="text-xs text-gray-400 mt-1 text-center px-2">
          Preview não disponível
        </div>
        <div className="absolute bottom-2 right-2 bg-gray-100 px-1.5 py-0.5 rounded text-xs font-medium text-gray-500 uppercase">
          PDF
        </div>
      </div>
    );
  }

  // Para todos os outros arquivos, mostrar ícone apropriado
  return (
    <div className={`flex flex-col items-center justify-center bg-gray-50 rounded-lg ${className} min-h-[120px] relative`}>
      {renderIcon()}
      <div className="text-xs text-gray-600 font-medium mt-2 uppercase">
        {fileExtension}
      </div>
      <div className="absolute bottom-2 right-2 bg-white/90 px-1.5 py-0.5 rounded text-xs font-medium text-gray-600 uppercase">
        {fileExtension}
      </div>
    </div>
  );
};