
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Download, 
  Eye, 
  Trash2, 
  RefreshCw,
  File,
  FileSpreadsheet,
  Image
} from 'lucide-react';
import { ProjectDocument } from '@/types/document';
import { formatBytes } from '@/lib/utils';

interface DocumentCardProps {
  document: ProjectDocument;
  onDownload: (document: ProjectDocument) => void;
  onDelete: (document: ProjectDocument) => void;
  onPreview?: (document: ProjectDocument) => void;
  onReplace?: (document: ProjectDocument) => void;
}

const DocumentCard = ({ 
  document, 
  onDownload, 
  onDelete, 
  onPreview, 
  onReplace 
}: DocumentCardProps) => {
  
  const getFileIcon = (fileType: string, mimeType: string) => {
    if (mimeType.includes('pdf')) {
      return <FileText className="h-8 w-8 text-red-600" />;
    }
    if (mimeType.includes('spreadsheet') || fileType === 'xlsx') {
      return <FileSpreadsheet className="h-8 w-8 text-green-600" />;
    }
    if (mimeType.includes('document') || fileType === 'docx') {
      return <FileText className="h-8 w-8 text-blue-600" />;
    }
    if (fileType === 'dwg' || mimeType.includes('dwg') || mimeType.includes('autocad')) {
      return <Image className="h-8 w-8 text-purple-600" />;
    }
    return <File className="h-8 w-8 text-gray-600" />;
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      plantas: 'bg-blue-100 text-blue-800',
      rrts: 'bg-green-100 text-green-800',
      licencas: 'bg-orange-100 text-orange-800',
      memoriais: 'bg-purple-100 text-purple-800',
      outros: 'bg-gray-100 text-gray-800'
    };
    return colors[category as keyof typeof colors] || colors.outros;
  };

  const getCategoryLabel = (category: string) => {
    const labels = {
      plantas: 'Plantas',
      rrts: 'RRTs',
      licencas: 'Licenças',
      memoriais: 'Memoriais',
      outros: 'Outros'
    };
    return labels[category as keyof typeof labels] || category;
  };

  return (
    <Card className="hover:shadow-md transition-all duration-200 border border-gray-200">
      <CardContent className="p-4">
        <div className="flex items-start space-x-4">
          {/* Ícone do arquivo */}
          <div className="flex-shrink-0">
            {getFileIcon(document.file_type, document.mime_type)}
          </div>
          
          {/* Informações do arquivo */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-gray-900 truncate">
                  {document.file_name}
                </h4>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge 
                    variant="secondary" 
                    className={`text-xs ${getCategoryColor(document.category)}`}
                  >
                    {getCategoryLabel(document.category)}
                  </Badge>
                  <span className="text-xs text-gray-500">
                    {formatBytes(document.file_size)}
                  </span>
                </div>
              </div>
            </div>
            
            <p className="text-xs text-gray-500 mb-3">
              Enviado em {new Date(document.uploaded_at).toLocaleDateString('pt-BR')} às {' '}
              {new Date(document.uploaded_at).toLocaleTimeString('pt-BR', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </p>
            
            {/* Botões de ação */}
            <div className="flex items-center space-x-2">
              {onPreview && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onPreview(document)}
                  className="h-8 px-3 text-xs"
                >
                  <Eye className="h-3 w-3 mr-1" />
                  Ver
                </Button>
              )}
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDownload(document)}
                className="h-8 px-3 text-xs"
              >
                <Download className="h-3 w-3 mr-1" />
                Baixar
              </Button>
              
              {onReplace && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onReplace(document)}
                  className="h-8 px-3 text-xs"
                >
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Substituir
                </Button>
              )}
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDelete(document)}
                className="h-8 px-3 text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-3 w-3 mr-1" />
                Excluir
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentCard;
