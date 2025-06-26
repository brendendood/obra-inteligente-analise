
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ProjectDocument, UploadProgress } from '@/types/document';
import { useToast } from '@/hooks/use-toast';

export const useProjectDocuments = (projectId: string) => {
  const [documents, setDocuments] = useState<ProjectDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState<UploadProgress[]>([]);
  const { toast } = useToast();

  // Fetch documents for the project
  const fetchDocuments = async () => {
    try {
      const { data, error } = await supabase
        .from('project_documents')
        .select('*')
        .eq('project_id', projectId)
        .order('uploaded_at', { ascending: false });

      if (error) throw error;

      // Type assertion to ensure proper typing
      const typedDocuments = (data || []).map(doc => ({
        ...doc,
        category: doc.category as ProjectDocument['category']
      }));

      setDocuments(typedDocuments);
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
      // Add to uploading state
      const uploadProgress: UploadProgress = {
        file,
        progress: 0,
        status: 'uploading'
      };
      setUploading(prev => [...prev, uploadProgress]);

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      // Create file path
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${projectId}/${category}/${Date.now()}_${file.name}`;

      // Upload to storage
      const { error: uploadError } = await supabase.storage
        .from('project-documents')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Update progress
      setUploading(prev => prev.map(upload => 
        upload.file === file 
          ? { ...upload, progress: 50 }
          : upload
      ));

      // Insert document record
      const { error: insertError } = await supabase
        .from('project_documents')
        .insert({
          project_id: projectId,
          user_id: user.id,
          file_name: file.name,
          file_path: fileName,
          file_size: file.size,
          file_type: fileExt || '',
          category,
          mime_type: file.type
        });

      if (insertError) throw insertError;

      // Update progress to success
      setUploading(prev => prev.map(upload => 
        upload.file === file 
          ? { ...upload, progress: 100, status: 'success' }
          : upload
      ));

      // Refresh documents
      await fetchDocuments();
      return true;
    } catch (error: any) {
      console.error('Error uploading document:', error);
      
      // Update progress to error
      setUploading(prev => prev.map(upload => 
        upload.file === file 
          ? { ...upload, status: 'error', error: error.message }
          : upload
      ));

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
      const { data, error } = await supabase.storage
        .from('project-documents')
        .download(doc.file_path);

      if (error) throw error;

      // Create download link
      const url = URL.createObjectURL(data);
      const link = window.document.createElement('a');
      link.href = url;
      link.download = doc.file_name;
      window.document.body.appendChild(link);
      link.click();
      window.document.body.removeChild(link);
      URL.revokeObjectURL(url);

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
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('project-documents')
        .remove([document.file_path]);

      if (storageError) throw storageError;

      // Delete from database
      const { error: dbError } = await supabase
        .from('project_documents')
        .delete()
        .eq('id', document.id);

      if (dbError) throw dbError;

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

  // Clear completed uploads
  const clearCompletedUploads = () => {
    setUploading(prev => prev.filter(upload => upload.status === 'uploading'));
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
    clearCompletedUploads,
    refetch: fetchDocuments
  };
};
