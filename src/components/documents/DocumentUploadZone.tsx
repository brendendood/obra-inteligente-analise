
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, FileText, AlertCircle } from 'lucide-react';
import { ProjectDocument } from '@/types/document';

interface DocumentUploadZoneProps {
  category: ProjectDocument['category'];
  onUpload: (files: File[], category: ProjectDocument['category']) => void;
  disabled?: boolean;
}

const DocumentUploadZone = ({ category, onUpload, disabled }: DocumentUploadZoneProps) => {
  const [dragActive, setDragActive] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onUpload(acceptedFiles, category);
    }
  }, [onUpload, category]);

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/dwg': ['.dwg'],
      'image/vnd.dwg': ['.dwg'],
      'application/acad': ['.dwg'],
      'application/x-dwg': ['.dwg'],
      'application/x-autocad': ['.dwg'],
      'image/x-dwg': ['.dwg']
    },
    maxSize: 50 * 1024 * 1024, // 50MB
    disabled
  });

  const getCategoryLabel = (cat: string) => {
    const labels = {
      plantas: 'Plantas',
      rrts: 'RRTs',
      licencas: 'Licenças',
      memoriais: 'Memoriais',
      outros: 'Outros'
    };
    return labels[cat as keyof typeof labels] || cat;
  };

  return (
    <Card className={`border-2 border-dashed transition-all duration-200 ${
      isDragActive 
        ? 'border-blue-500 bg-blue-50' 
        : disabled 
          ? 'border-gray-200 bg-gray-50' 
          : 'border-gray-300 hover:border-gray-400'
    }`}>
      <CardContent className="p-6">
        <div {...getRootProps()} className="text-center cursor-pointer">
          <input {...getInputProps()} />
          
          <div className="space-y-4">
            <div className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center ${
              isDragActive ? 'bg-blue-100' : 'bg-gray-100'
            }`}>
              <Upload className={`h-6 w-6 ${
                isDragActive ? 'text-blue-600' : 'text-gray-600'
              }`} />
            </div>
            
            <div>
              <h3 className="font-medium text-gray-900 mb-1">
                {getCategoryLabel(category)}
              </h3>
              
              {isDragActive ? (
                <p className="text-blue-600 font-medium">
                  Solte os arquivos aqui...
                </p>
              ) : (
                <div className="space-y-2">
                  <p className="text-gray-600">
                    Arraste arquivos aqui ou clique para selecionar
                  </p>
                  <p className="text-sm text-gray-500">
                    PDF, DOCX, XLSX, DWG até 50MB
                  </p>
                </div>
              )}
            </div>
            
            {!isDragActive && (
              <Button 
                variant="outline" 
                size="sm"
                disabled={disabled}
                className="mx-auto"
              >
                <FileText className="h-4 w-4 mr-2" />
                Selecionar Arquivos
              </Button>
            )}
          </div>
        </div>

        {/* Erros de validação */}
        {fileRejections.length > 0 && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <span className="text-sm font-medium text-red-800">
                Alguns arquivos foram rejeitados:
              </span>
            </div>
            <ul className="mt-2 text-sm text-red-700">
              {fileRejections.map(({ file, errors }) => (
                <li key={file.name} className="ml-6">
                  {file.name}: {errors.map(e => e.message).join(', ')}
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DocumentUploadZone;
