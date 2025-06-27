
import { useProjectDetail } from '@/contexts/ProjectDetailContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download, Eye, ExternalLink } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useParams } from 'react-router-dom';

const ProjectSpecificDocumentsPage = () => {
  const { project, isLoading, error } = useProjectDetail();
  const { projectId } = useParams<{ projectId: string }>();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando documentos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Erro ao carregar projeto</h3>
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-16">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Projeto não encontrado</h3>
        <p className="text-gray-600">Não foi possível carregar os dados do projeto.</p>
      </div>
    );
  }

  const getPdfUrl = () => {
    if (!project?.file_path) return null;
    
    const { data } = supabase.storage
      .from('project-files')
      .getPublicUrl(project.file_path);
    
    return data?.publicUrl || null;
  };

  const documents = [
    {
      name: 'Projeto Original',
      type: 'PDF',
      description: `${project.name}.pdf`,
      icon: FileText,
      color: 'text-red-500',
      bgColor: 'bg-red-50',
      available: !!project.file_path,
      actions: [
        { label: 'Visualizar', icon: Eye, action: () => window.open(getPdfUrl(), '_blank') },
        { label: 'Download', icon: Download, action: () => {
          const link = document.createElement('a');
          link.href = getPdfUrl() || '';
          link.download = `${project.name}.pdf`;
          link.click();
        }}
      ]
    },
    {
      name: 'Análise Técnica',
      type: 'JSON',
      description: 'Dados da análise IA do projeto',
      icon: FileText,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
      available: !!project.analysis_data,
      actions: [
        { label: 'Visualizar', icon: Eye, action: () => console.log('Ver análise') },
        { label: 'Exportar', icon: Download, action: () => console.log('Exportar análise') }
      ]
    },
    {
      name: 'Orçamento SINAPI',
      type: 'Excel',
      description: 'Planilha de orçamento detalhado',
      icon: FileText,
      color: 'text-green-500',
      bgColor: 'bg-green-50',
      available: false,
      actions: [
        { label: 'Gerar', icon: ExternalLink, action: () => window.location.href = `/projeto/${projectId}/orcamento` }
      ]
    },
    {
      name: 'Cronograma da Obra',
      type: 'Excel',
      description: 'Timeline detalhada das etapas',
      icon: FileText,
      color: 'text-orange-500',
      bgColor: 'bg-orange-50',
      available: false,
      actions: [
        { label: 'Gerar', icon: ExternalLink, action: () => window.location.href = `/projeto/${projectId}/cronograma` }
      ]
    },
    {
      name: 'Relatório Final',
      type: 'PDF',
      description: 'Compilação completa do projeto',
      icon: FileText,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50',
      available: false,
      actions: [
        { label: 'Em breve', icon: FileText, action: () => console.log('Em desenvolvimento') }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Documentos - {project.name}</h1>
          <p className="text-gray-600">Downloads e relatórios específicos deste projeto</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {documents.map((doc, index) => (
          <Card key={index} className={`transition-all duration-200 hover:shadow-lg ${
            doc.available ? 'border-gray-200' : 'border-gray-100 bg-gray-50'
          }`}>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${doc.bgColor}`}>
                    <doc.icon className={`h-6 w-6 ${doc.color}`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{doc.name}</h3>
                    <p className="text-sm text-gray-500">{doc.type}</p>
                  </div>
                </div>
                
                {doc.available && (
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-xs text-green-600 font-medium">Disponível</span>
                  </div>
                )}
              </CardTitle>
            </CardHeader>
            
            <CardContent>
              <p className="text-gray-600 mb-4">{doc.description}</p>
              
              <div className="flex space-x-2">
                {doc.actions.map((action, actionIndex) => (
                  <Button
                    key={actionIndex}
                    variant={doc.available ? "default" : "outline"}
                    size="sm"
                    onClick={action.action}
                    disabled={!doc.available && action.label !== 'Gerar' && action.label !== 'Em breve'}
                    className={`flex items-center space-x-1 ${
                      !doc.available && action.label !== 'Gerar' && action.label !== 'Em breve' 
                        ? 'opacity-50 cursor-not-allowed' 
                        : ''
                    }`}
                  >
                    <action.icon className="h-4 w-4" />
                    <span>{action.label}</span>
                  </Button>
                ))}
              </div>
              
              {!doc.available && doc.name.includes('Orçamento') && (
                <p className="text-xs text-gray-500 mt-2">
                  💡 Vá para a aba Orçamento para gerar este documento
                </p>
              )}
              
              {!doc.available && doc.name.includes('Cronograma') && (
                <p className="text-xs text-gray-500 mt-2">
                  💡 Vá para a aba Cronograma para gerar este documento
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">Sobre os Documentos do Projeto</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• <strong>Projeto Original:</strong> Arquivo PDF enviado inicialmente</li>
                <li>• <strong>Análise Técnica:</strong> Dados extraídos pela IA sobre o projeto</li>
                <li>• <strong>Orçamento SINAPI:</strong> Gerado conforme tabela oficial de preços</li>
                <li>• <strong>Cronograma:</strong> Timeline baseada na complexidade do projeto</li>
                <li>• <strong>Relatório Final:</strong> Compilação completa (em desenvolvimento)</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectSpecificDocumentsPage;
