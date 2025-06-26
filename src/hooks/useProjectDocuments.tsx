
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ProjectDocument, UploadProgress } from '@/types/document';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

export const useProjectDocuments = (projectId?: string) => {
  const [documents, setDocuments] = useState<ProjectDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState<UploadProgress[]>([]);
  const { toast } = useToast();
  const { user } = useAuth();

  // Buscar documentos do projeto
  const loadDocuments = async () => {
    if (!projectId || !user) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('project_documents')
        .select('*')
        .eq('project_id', projectId)
        .order('uploaded_at', { ascending: false });

      if (error) throw error;
      setDocuments(data || []);
    } catch (error) {
      console.error('Erro ao carregar documentos:', error);
      toast({
        title: "Erro ao carregar documentos",
        description: "Não foi possível carregar os documentos do projeto.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Upload de arquivo
  const uploadDocument = async (
    file: File, 
    category: ProjectDocument['category']
  ): Promise<boolean> => {
    if (!projectId || !user) return false;

    const fileId = Math.random().toString(36).substring(7);
    const uploadProgress: UploadProgress = {
      file,
      progress: 0,
      status: 'uploading'
    };

    setUploading(prev => [...prev, uploadProgress]);

    try {
      // Upload para Storage
      const filePath = `${user.id}/${projectId}/${category}/${Date.now()}_${file.name}`;
      
      const { error: uploadError } = await supabase.storage
        .from('project-documents')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      // Salvar metadados no banco
      const { error: dbError } = await supabase
        .from('project_documents')
        .insert({
          project_id: projectId,
          user_id: user.id,
          file_name: file.name,
          file_path: filePath,
          file_size: file.size,
          file_type: file.name.split('.').pop()?.toLowerCase() || '',
          category,
          mime_type: file.type || 'application/octet-stream'
        });

      if (dbError) throw dbError;

      // Atualizar progresso
      setUploading(prev => 
        prev.map(up => 
          up.file === file 
            ? { ...up, progress: 100, status: 'success' }
            : up
        )
      );

      // Recarregar documentos
      await loadDocuments();

      toast({
        title: "✅ Arquivo enviado!",
        description: `${file.name} foi adicionado com sucesso.`,
      });

      return true;
    } catch (error) {
      console.error('Erro no upload:', error);
      
      setUploading(prev => 
        prev.map(up => 
          up.file === file 
            ? { ...up, status: 'error', error: 'Falha no upload' }
            : up
        )
      );

      toast({
        title: "Erro no upload",
        description: `Não foi possível enviar ${file.name}.`,
        variant: "destructive",
      });

      return false;
    }
  };

  // Deletar documento
  const deleteDocument = async (document: ProjectDocument): Promise<boolean> => {
    try {
      // Deletar do Storage
      const { error: storageError } = await supabase.storage
        .from('project-documents')
        .remove([document.file_path]);

      if (storageError) throw storageError;

      // Deletar do banco
      const { error: dbError } = await supabase
        .from('project_documents')
        .delete()
        .eq('id', document.id);

      if (dbError) throw dbError;

      // Atualizar lista local
      setDocuments(prev => prev.filter(doc => doc.id !== document.id));

      toast({
        title: "Documento removido",
        description: `${document.file_name} foi excluído com sucesso.`,
      });

      return true;
    } catch (error) {
      console.error('Erro ao deletar documento:', error);
      toast({
        title: "Erro ao excluir",
        description: "Não foi possível excluir o documento.",
        variant: "destructive",
      });
      return false;
    }
  };

  // Download de documento
  const downloadDocument = async (document: ProjectDocument) => {
    try {
      const { data, error } = await supabase.storage
        .from('project-documents')
        .download(document.file_path);

      if (error) throw error;

      // Criar URL de download
      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = document.file_name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Download iniciado",
        description: `Baixando ${document.file_name}...`,
      });
    } catch (error) {
      console.error('Erro no download:', error);
      toast({
        title: "Erro no download",
        description: "Não foi possível baixar o arquivo.",
        variant: "destructive",
      });
    }
  };

  // Limpar uploads concluídos
  const clearCompletedUploads = () => {
    setUploading(prev => prev.filter(up => up.status === 'uploading'));
  };

  useEffect(() => {
    loadDocuments();
  }, [projectId, user]);

  return {
    documents,
    loading,
    uploading,
    uploadDocument,
    deleteDocument,
    downloadDocument,
    loadDocuments,
    clearCompletedUploads
  };
};
