
import { supabase } from '@/integrations/supabase/client';
import { ProjectDocument } from '@/types/document';

export class DocumentService {
  static async fetchDocuments(projectId: string): Promise<ProjectDocument[]> {
    const { data, error } = await supabase
      .from('project_documents')
      .select('*')
      .eq('project_id', projectId)
      .order('uploaded_at', { ascending: false });

    if (error) throw error;

    // Type assertion to ensure proper typing
    return (data || []).map(doc => ({
      ...doc,
      category: doc.category as ProjectDocument['category']
    }));
  }

  static async uploadDocument(
    file: File, 
    projectId: string, 
    category: ProjectDocument['category']
  ): Promise<void> {
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
  }

  static async downloadDocument(doc: ProjectDocument): Promise<void> {
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
  }

  static async deleteDocument(document: ProjectDocument): Promise<void> {
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
  }
}
