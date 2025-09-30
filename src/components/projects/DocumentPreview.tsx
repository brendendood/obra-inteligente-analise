import { FileText, File, Image, Archive, Video, Music } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DocumentPreviewProps {
  fileName: string;
  className?: string;
}

export const DocumentPreview = ({ fileName, className }: DocumentPreviewProps) => {
  // Extrair a extensão do arquivo
  const getFileExtension = (filename: string) => {
    return filename.split('.').pop()?.toLowerCase() || '';
  };

  // Obter ícone baseado na extensão
  const getFileIcon = (extension: string) => {
    switch (extension) {
      case 'pdf':
        return FileText;
      case 'doc':
      case 'docx':
        return FileText;
      case 'xls':
      case 'xlsx':
        return FileText;
      case 'ppt':
      case 'pptx':
        return FileText;
      case 'txt':
        return FileText;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
      case 'webp':
        return Image;
      case 'mp4':
      case 'avi':
      case 'mov':
        return Video;
      case 'mp3':
      case 'wav':
      case 'flac':
        return Music;
      case 'zip':
      case 'rar':
      case '7z':
        return Archive;
      default:
        return File;
    }
  };

  // Obter cor baseada na extensão
  const getFileColor = (extension: string) => {
    switch (extension) {
      case 'pdf':
        return 'text-red-500';
      case 'doc':
      case 'docx':
        return 'text-blue-500';
      case 'xls':
      case 'xlsx':
        return 'text-green-500';
      case 'ppt':
      case 'pptx':
        return 'text-orange-500';
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
      case 'webp':
        return 'text-purple-500';
      case 'mp4':
      case 'avi':
      case 'mov':
        return 'text-indigo-500';
      case 'mp3':
      case 'wav':
      case 'flac':
        return 'text-pink-500';
      case 'zip':
      case 'rar':
      case '7z':
        return 'text-gray-500';
      default:
        return 'text-gray-400';
    }
  };

  const extension = getFileExtension(fileName);
  const IconComponent = getFileIcon(extension);
  const iconColor = getFileColor(extension);
  
  // Extrair nome do arquivo sem a extensão e path
  const displayName = fileName.split('/').pop()?.replace(/^\d+-/, '') || fileName;
  const nameWithoutExtension = displayName.split('.').slice(0, -1).join('.');
  
  // Truncar nome se muito longo
  const truncatedName = nameWithoutExtension.length > 20 
    ? nameWithoutExtension.substring(0, 20) + '...' 
    : nameWithoutExtension;

  return (
    <div className={cn(
      "flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors",
      className
    )}>
      {/* Ícone do documento */}
      <div className="flex-shrink-0 w-10 h-10 bg-white rounded-lg border border-gray-200 flex items-center justify-center">
        <IconComponent className={cn("h-5 w-5", iconColor)} />
      </div>
      
      {/* Informações do documento */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate" title={nameWithoutExtension}>
          {truncatedName}
        </p>
        <p className="text-xs text-gray-500 uppercase font-medium">
          {extension || 'Arquivo'}
        </p>
      </div>
    </div>
  );
};