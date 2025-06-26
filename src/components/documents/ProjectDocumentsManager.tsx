
import React, { useState, useMemo } from 'react';
import { FileText, Award, FileCheck, BookOpen, Folder } from 'lucide-react';
import { ProjectDocument, DocumentCategory } from '@/types/document';
import { useProjectDocuments } from '@/hooks/useProjectDocuments';
import { useToast } from '@/hooks/use-toast';
import DocumentCategorySection from './DocumentCategorySection';
import DocumentSearchBar from './DocumentSearchBar';
import UploadProgressIndicator from './UploadProgressIndicator';

interface ProjectDocumentsManagerProps {
  projectId: string;
  projectName: string;
}

const ProjectDocumentsManager = ({ projectId, projectName }: ProjectDocumentsManagerProps) => {
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

  // Definir categorias
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

  // Filtrar documentos por busca
  const filteredDocuments = useMemo(() => {
    if (!searchTerm.trim()) return documents;
    
    return documents.filter(doc =>
      doc.file_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [documents, searchTerm]);

  // Agrupar documentos por categoria
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
    
    // Limpar uploads concluídos após 3 segundos
    setTimeout(clearCompletedUploads, 3000);
  };

  // Handle export all
  const handleExportAll = () => {
    toast({
      title: "🚧 Em desenvolvimento",
      description: "A funcionalidade de exportar todos os documentos será implementada em breve.",
    });
  };

  // Handle preview
  const handlePreview = (document: ProjectDocument) => {
    toast({
      title: "🚧 Em desenvolvimento",
      description: "A visualização de documentos será implementada em breve.",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando documentos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-2xl p-6">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-indigo-100 rounded-xl">
            <FileText className="h-8 w-8 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Documentos do Projeto</h1>
            <p className="text-gray-600 mt-1">
              Gerencie todos os documentos técnicos do projeto <strong>{projectName}</strong>
            </p>
          </div>
        </div>
      </div>

      {/* Barra de busca e ações */}
      <DocumentSearchBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onExportAll={handleExportAll}
        documentsCount={filteredDocuments.length}
      />

      {/* Indicador de progresso de uploads */}
      {uploading.length > 0 && (
        <UploadProgressIndicator uploads={uploading} />
      )}

      {/* Seções por categoria */}
      <div className="space-y-6">
        {categories.map((category) => (
          <DocumentCategorySection
            key={category.id}
            category={category}
            documents={documentsByCategory[category.id] || []}
            onUpload={handleUpload}
            onDownload={downloadDocument}
            onDelete={deleteDocument}
            onPreview={handlePreview}
            uploading={uploading.length > 0}
          />
        ))}
      </div>

      {/* Estado vazio */}
      {documents.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <FileText className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nenhum documento ainda
          </h3>
          <p className="text-gray-600 max-w-sm mx-auto">
            Comece fazendo upload dos documentos técnicos do seu projeto nas categorias acima.
          </p>
        </div>
      )}
    </div>
  );
};

export default ProjectDocumentsManager;
