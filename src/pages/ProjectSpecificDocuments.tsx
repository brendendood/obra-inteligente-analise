import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  FileText, 
  Download, 
  ExternalLink,
  Upload,
  FileSpreadsheet,
  Calendar,
  AlertTriangle
} from 'lucide-react';

const ProjectSpecificDocuments = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Função para simular download
  const handleDownload = (fileName: string) => {
    const link = document.createElement('a');
    link.href = getPdfUrl() || '';
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Função para obter URL do PDF (simulada)
  const getPdfUrl = () => {
    return null; // Por enquanto retorna null
  };

  // Documentos mockados
  const documents = [
    {
      id: '1',
      name: 'Orçamento Detalhado',
      type: 'xlsx',
      icon: FileSpreadsheet,
      description: 'Planilha detalhada com todos os custos do projeto',
      category: 'orcamento',
      status: 'ready',
      size: '2.1 MB',
      actions: [
        { label: 'Gerar', icon: ExternalLink, action: () => navigate(`/projeto/${projectId}/orcamento`) }
      ]
    },
    {
      id: '2',
      name: 'Cronograma de Execução',
      type: 'pdf',
      icon: Calendar,
      description: 'Cronograma de execução da obra',
      category: 'cronograma',
      status: 'ready',
      size: '1.8 MB',
      actions: [
        { label: 'Gerar', icon: ExternalLink, action: () => navigate(`/projeto/${projectId}/cronograma`) }
      ]
    },
    {
      id: '3',
      name: 'Memorial Descritivo',
      type: 'pdf',
      icon: FileText,
      description: 'Descrição técnica completa do projeto',
      category: 'memorial',
      status: 'pending',
      size: '3.2 MB',
      actions: [
        { label: 'Download', icon: Download, action: () => handleDownload('memorial-descritivo.pdf') }
      ]
    }
  ];

  const filteredDocuments = selectedCategory === 'all' 
    ? documents 
    : documents.filter(doc => doc.category === selectedCategory);

  const getStatusBadge = (status: string) => {
    const statusMap = {
      ready: { label: 'Pronto', color: 'bg-green-100 text-green-800' },
      pending: { label: 'Pendente', color: 'bg-yellow-100 text-yellow-800' },
      processing: { label: 'Processando', color: 'bg-blue-100 text-blue-800' }
    };
    
    const statusInfo = statusMap[status as keyof typeof statusMap] || statusMap.pending;
    
    return (
      <Badge className={statusInfo.color}>
        {statusInfo.label}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Documentos do Projeto
          </CardTitle>
          <CardDescription>
            Gerencie e baixe documentos relacionados ao seu projeto
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Filtros */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory('all')}
            >
              Todos
            </Button>
            <Button
              variant={selectedCategory === 'orcamento' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory('orcamento')}
            >
              Orçamento
            </Button>
            <Button
              variant={selectedCategory === 'cronograma' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory('cronograma')}
            >
              Cronograma
            </Button>
            <Button
              variant={selectedCategory === 'memorial' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory('memorial')}
            >
              Memorial
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Documentos */}
      <div className="grid gap-4">
        {filteredDocuments.length > 0 ? (
          filteredDocuments.map((doc) => (
            <Card key={doc.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <doc.icon className="h-8 w-8 text-blue-600" />
                    </div>
                    <div className="space-y-2">
                      <div>
                        <h3 className="font-semibold text-lg">{doc.name}</h3>
                        <p className="text-gray-600 text-sm">{doc.description}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(doc.status)}
                        <span className="text-sm text-gray-500">
                          {doc.size}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    {doc.actions.map((action, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={action.action}
                        className="flex items-center gap-1"
                      >
                        <action.icon className="h-4 w-4" />
                        {action.label}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Nenhum documento encontrado para a categoria selecionada.
            </AlertDescription>
          </Alert>
        )}
      </div>

      {/* Upload Area */}
      <Card>
        <CardContent className="pt-6">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Fazer upload de documentos
            </h3>
            <p className="text-gray-600 mb-4">
              Arraste e solte arquivos aqui ou clique para selecionar
            </p>
            <Button variant="outline">
              Selecionar Arquivos
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectSpecificDocuments;