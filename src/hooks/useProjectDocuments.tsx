
import { useState, useEffect } from 'react';
import { ProjectDocument } from '@/types/document';
import { useToast } from '@/hooks/use-toast';
import { DocumentService } from '@/services/documentService';
import { useUploadProgress } from '@/hooks/useUploadProgress';

export const useProjectDocuments = (projectId: string) => {
  const [documents, setDocuments] = useState<ProjectDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const {
    uploading,
    addUpload,
    updateProgress,
    setSuccess,
    setError,
    clearCompleted
  } = useUploadProgress();

  // Fetch documents for the project
  const fetchDocuments = async () => {
    try {
      const docs = await DocumentService.fetchDocuments(projectId);
      setDocuments(docs);
    } catch (error: any) {
      console.error('Error fetching documents:', error);
      toast({
        title: "❌ Erro ao carregar documentos",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Upload document
  const uploadDocument = async (file: File, category: ProjectDocument['category']) => {
    try {
      addUpload(file);

      await DocumentService.uploadDocument(file, projectId, category);
      
      updateProgress(file, 50);
      setSuccess(file);

      // Refresh documents
      await fetchDocuments();
      return true;
    } catch (error: any) {
      console.error('Error uploading document:', error);
      
      setError(file, error.message);

      toast({
        title: "❌ Erro no upload",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }
  };

  // Download document
  const downloadDocument = async (doc: ProjectDocument) => {
    try {
      await DocumentService.downloadDocument(doc);

      toast({
        title: "✅ Download iniciado",
        description: `Baixando ${doc.file_name}`,
      });
    } catch (error: any) {
      console.error('Error downloading document:', error);
      toast({
        title: "❌ Erro no download",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Delete document
  const deleteDocument = async (document: ProjectDocument) => {
    try {
      await DocumentService.deleteDocument(document);

      toast({
        title: "✅ Documento excluído",
        description: `${document.file_name} foi removido com sucesso.`,
      });

      // Refresh documents
      await fetchDocuments();
    } catch (error: any) {
      console.error('Error deleting document:', error);
      toast({
        title: "❌ Erro ao excluir",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (projectId) {
      fetchDocuments();
    }
  }, [projectId]);

  return {
    documents,
    loading,
    uploading,
    uploadDocument,
    downloadDocument,
    deleteDocument,
    clearCompletedUploads: clearCompleted,
    refetch: fetchDocuments
  };
};
