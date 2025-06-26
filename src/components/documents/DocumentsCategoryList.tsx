
import React from 'react';
import { ProjectDocument, DocumentCategory } from '@/types/document';
import DocumentCategorySection from './DocumentCategorySection';

interface DocumentsCategoryListProps {
  categories: DocumentCategory[];
  documentsByCategory: Record<string, ProjectDocument[]>;
  onUpload: (files: File[], category: ProjectDocument['category']) => void;
  onDownload: (document: ProjectDocument) => void;
  onDelete: (document: ProjectDocument) => void;
  onPreview: (document: ProjectDocument) => void;
  uploading: boolean;
}

const DocumentsCategoryList = ({
  categories,
  documentsByCategory,
  onUpload,
  onDownload,
  onDelete,
  onPreview,
  uploading
}: DocumentsCategoryListProps) => {
  return (
    <div className="space-y-6">
      {categories.map((category) => (
        <DocumentCategorySection
          key={category.id}
          category={category}
          documents={documentsByCategory[category.id] || []}
          onUpload={onUpload}
          onDownload={onDownload}
          onDelete={onDelete}
          onPreview={onPreview}
          uploading={uploading}
        />
      ))}
    </div>
  );
};

export default DocumentsCategoryList;
