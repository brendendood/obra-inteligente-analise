
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { UploadProgress } from '@/types/document';

interface UploadProgressIndicatorProps {
  uploads: UploadProgress[];
}

const UploadProgressIndicator = ({ uploads }: UploadProgressIndicatorProps) => {
  if (uploads.length === 0) return null;

  return (
    <Card className="border border-blue-200 bg-blue-50">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center space-x-2">
          <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
          <span>Enviando Documentos</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {uploads.map((upload, index) => (
          <div key={index} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {upload.status === 'uploading' && (
                  <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                )}
                {upload.status === 'success' && (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                )}
                {upload.status === 'error' && (
                  <XCircle className="h-4 w-4 text-red-600" />
                )}
                <span className="text-sm font-medium text-gray-900 truncate max-w-xs">
                  {upload.file.name}
                </span>
              </div>
              <span className="text-xs text-gray-600">
                {upload.status === 'uploading' && `${upload.progress}%`}
                {upload.status === 'success' && 'Concluído'}
                {upload.status === 'error' && 'Erro'}
              </span>
            </div>
            
            {upload.status === 'uploading' && (
              <Progress value={upload.progress} className="h-2" />
            )}
            
            {upload.status === 'error' && upload.error && (
              <p className="text-xs text-red-600">{upload.error}</p>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default UploadProgressIndicator;
