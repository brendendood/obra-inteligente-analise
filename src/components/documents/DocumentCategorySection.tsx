
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ProjectDocument, DocumentCategory } from '@/types/document';
import DocumentCard from './DocumentCard';
import DocumentUploadZone from './DocumentUploadZone';

interface DocumentCategorySectionProps {
  category: DocumentCategory;
  documents: ProjectDocument[];
  onUpload: (files: File[], category: ProjectDocument['category']) => void;
  onDownload: (document: ProjectDocument) => void;
  onDelete: (document: ProjectDocument) => void;
  onPreview?: (document: ProjectDocument) => void;
  uploading?: boolean;
}

const DocumentCategorySection = ({
  category,
  documents,
  onUpload,
  onDownload,
  onDelete,
  onPreview,
  uploading = false
}: DocumentCategorySectionProps) => {
  const Icon = category.icon;
  
  return (
    <Card className="border border-gray-200">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${category.color}`}>
              <Icon className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg">{category.name}</CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                {category.description}
              </p>
            </div>
          </div>
          <Badge variant="outline" className="ml-2">
            {documents.length} arquivo{documents.length !== 1 ? 's' : ''}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Zona de Upload */}
        <DocumentUploadZone
          category={category.id as ProjectDocument['category']}
          onUpload={onUpload}
          disabled={uploading}
        />
        
        {/* Lista de Documentos */}
        {documents.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-700 border-b pb-2">
              Documentos Enviados
            </h4>
            <div className="space-y-2">
              {documents.map((document) => (
                <DocumentCard
                  key={document.id}
                  document={document}
                  onDownload={onDownload}
                  onDelete={onDelete}
                  onPreview={onPreview}
                />
              ))}
            </div>
          </div>
        )}
        
        {documents.length === 0 && (
          <div className="text-center py-6 text-gray-500">
            <p className="text-sm">Nenhum documento nesta categoria ainda.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DocumentCategorySection;
