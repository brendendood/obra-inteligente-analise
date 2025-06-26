
import { useState, useMemo } from 'react';
import { FileText, Award, FileCheck, BookOpen, Folder } from 'lucide-react';
import { ProjectDocument, DocumentCategory } from '@/types/document';
import { useProjectDocuments } from '@/hooks/useProjectDocuments';
import { useToast } from '@/hooks/use-toast';
import { exportAllDocumentsAsZip, exportDocumentsReport } from '@/utils/documentsExportUtils';

export const useProjectDocumentsManager = (projectId: string, projectName: string) => {
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();
  
  const {
    documents,
    loading,
    uploading,
    uploadDocument,
    deleteDocument,
    downloadDocument,
    clearCompletedUploads
  } = useProjectDocuments(projectId);

  // Define categories
  const categories: DocumentCategory[] = [
    {
      id: 'plantas',
      name: 'Plantas e Desenhos',
      description: 'Plantas baixas, cortes, fachadas e detalhamentos técnicos',
      icon: FileText,
      color: 'bg-blue-600'
    },
    {
      id: 'rrts',
      name: 'RRTs e ARTs',
      description: 'Registros de Responsabilidade Técnica e Anotações',
      icon: Award,
      color: 'bg-green-600'
    },
    {
      id: 'licencas',
      name: 'Licenças e Aprovações',
      description: 'Alvarás, licenças municipais e aprovações oficiais',
      icon: FileCheck,
      color: 'bg-orange-600'
    },
    {
      id: 'memoriais',
      name: 'Memoriais Descritivos',
      description: 'Memoriais técnicos, especificações e relatórios',
      icon: BookOpen,
      color: 'bg-purple-600'
    },
    {
      id: 'outros',
      name: 'Outros Documentos',
      description: 'Contratos, correspondências e documentos diversos',
      icon: Folder,
      color: 'bg-gray-600'
    }
  ];

  // Filter documents by search
  const filteredDocuments = useMemo(() => {
    if (!searchTerm.trim()) return documents;
    
    return documents.filter(doc =>
      doc.file_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [documents, searchTerm]);

  // Group documents by category
  const documentsByCategory = useMemo(() => {
    return categories.reduce((acc, category) => {
      acc[category.id] = filteredDocuments.filter(doc => doc.category === category.id);
      return acc;
    }, {} as Record<string, ProjectDocument[]>);
  }, [filteredDocuments, categories]);

  // Handle upload
  const handleUpload = async (files: File[], category: ProjectDocument['category']) => {
    const uploadPromises = files.map(file => uploadDocument(file, category));
    const results = await Promise.all(uploadPromises);
    
    const successCount = results.filter(Boolean).length;
    const totalCount = files.length;
    
    if (successCount === totalCount) {
      toast({
        title: "✅ Upload concluído!",
        description: `${successCount} arquivo${successCount !== 1 ? 's' : ''} enviado${successCount !== 1 ? 's' : ''} com sucesso.`,
      });
    } else if (successCount > 0) {
      toast({
        title: "⚠️ Upload parcial",
        description: `${successCount} de ${totalCount} arquivos foram enviados.`,
        variant: "destructive",
      });
    }
    
    // Clear completed uploads after 3 seconds
    setTimeout(clearCompletedUploads, 3000);
  };

  // Handle export all as ZIP
  const handleExportAll = async () => {
    if (filteredDocuments.length === 0) {
      toast({
        title: "❌ Nenhum documento",
        description: "Não há documentos para exportar.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "📦 Preparando exportação...",
      description: "Aguarde enquanto organizamos todos os documentos.",
    });

    const result = await exportAllDocumentsAsZip(filteredDocuments, projectName);
    
    if (result.success) {
      toast({
        title: "✅ Exportação concluída!",
        description: `Arquivo ${result.filename} baixado com sucesso.`,
      });
    } else {
      toast({
        title: "❌ Erro na exportação",
        description: result.error,
        variant: "destructive",
      });
    }
  };

  // Handle export report
  const handleExportReport = async () => {
    if (filteredDocuments.length === 0) {
      toast({
        title: "❌ Nenhum documento",
        description: "Não há documentos para gerar relatório.",
        variant: "destructive",
      });
      return;
    }

    const result = await exportDocumentsReport(filteredDocuments, projectName);
    
    if (result.success) {
      toast({
        title: "✅ Relatório gerado!",
        description: `Relatório ${result.filename} baixado com sucesso.`,
      });
    } else {
      toast({
        title: "❌ Erro no relatório",
        description: result.error,
        variant: "destructive",
      });
    }
  };

  // Handle preview
  const handlePreview = (document: ProjectDocument) => {
    toast({
      title: "🚧 Em desenvolvimento",
      description: "A visualização de documentos será implementada em breve.",
    });
  };

  return {
    // State
    searchTerm,
    loading,
    documents,
    filteredDocuments,
    uploading,
    categories,
    documentsByCategory,
    
    // Actions
    setSearchTerm,
    handleUpload,
    handleExportAll,
    handleExportReport,
    handlePreview,
    downloadDocument,
    deleteDocument
  };
};
