
import React from 'react';
import { useProjectDocumentsManager } from '@/hooks/useProjectDocumentsManager';
import DocumentsPageHeader from './DocumentsPageHeader';
import DocumentSearchBar from './DocumentSearchBar';
import UploadProgressIndicator from './UploadProgressIndicator';
import DocumentsCategoryList from './DocumentsCategoryList';
import DocumentsEmptyState from './DocumentsEmptyState';
import DocumentsLoadingState from './DocumentsLoadingState';

interface ProjectDocumentsManagerProps {
  projectId: string;
  projectName: string;
}

const ProjectDocumentsManager = ({ projectId, projectName }: ProjectDocumentsManagerProps) => {
  const {
    searchTerm,
    loading,
    documents,
    filteredDocuments,
    uploading,
    categories,
    documentsByCategory,
    setSearchTerm,
    handleUpload,
    handleExportAll,
    handleExportReport,
    handlePreview,
    downloadDocument,
    deleteDocument
  } = useProjectDocumentsManager(projectId, projectName);

  if (loading) {
    return <DocumentsLoadingState />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <DocumentsPageHeader projectName={projectName} />

      {/* Search bar and actions */}
      <DocumentSearchBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onExportAll={handleExportAll}
        onExportReport={handleExportReport}
        documentsCount={filteredDocuments.length}
      />

      {/* Upload progress indicator */}
      {uploading.length > 0 && (
        <UploadProgressIndicator uploads={uploading} />
      )}

      {/* Category sections */}
      <DocumentsCategoryList
        categories={categories}
        documentsByCategory={documentsByCategory}
        onUpload={handleUpload}
        onDownload={downloadDocument}
        onDelete={deleteDocument}
        onPreview={handlePreview}
        uploading={uploading.length > 0}
      />

      {/* Empty state */}
      {documents.length === 0 && <DocumentsEmptyState />}
    </div>
  );
};

export default ProjectDocumentsManager;
