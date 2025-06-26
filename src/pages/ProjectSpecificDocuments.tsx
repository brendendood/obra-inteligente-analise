
import { useParams } from 'react-router-dom';
import { ProjectWorkspace } from '@/components/project/ProjectWorkspace';
import { useProject } from '@/contexts/ProjectContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download, Eye, Upload, Folder, Image, File } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const ProjectSpecificDocuments = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { currentProject } = useProject();

  if (!currentProject) {
    return (
      <ProjectWorkspace>
        <div className="flex items-center justify-center h-64 animate-fade-in">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando projeto...</p>
          </div>
        </div>
      </ProjectWorkspace>
    );
  }

  // Documentos simulados baseados no projeto
  const documentCategories = [
    {
      id: 'plants',
      name: 'Plantas e Desenhos',
      icon: Image,
      color: 'blue',
      documents: [
        { name: 'Planta Baixa - Térreo.dwg', size: '2.3 MB', date: '2024-01-15', type: 'dwg' },
        { name: 'Planta Baixa - Superior.dwg', size: '1.8 MB', date: '2024-01-15', type: 'dwg' },
        { name: 'Cortes e Fachadas.pdf', size: '4.1 MB', date: '2024-01-20', type: 'pdf' }
      ]
    },
    {
      id: 'reports',
      name: 'Relatórios Técnicos',
      icon: FileText,
      color: 'green',
      documents: [
        { name: 'Análise Estrutural IA.pdf', size: '1.2 MB', date: '2024-01-25', type: 'pdf' },
        { name: 'Relatório de Materiais.pdf', size: '856 KB', date: '2024-01-26', type: 'pdf' },
        { name: 'Especificações Técnicas.docx', size: '432 KB', date: '2024-01-27', type: 'docx' }
      ]
    },
    {
      id: 'licenses',
      name: 'Licenças e Aprovações',
      icon: File,
      color: 'orange',
      documents: [
        { name: 'Alvará de Construção.pdf', size: '1.5 MB', date: '2024-02-01', type: 'pdf' },
        { name: 'Aprovação Prefeitura.pdf', size: '890 KB', date: '2024-02-05', type: 'pdf' }
      ]
    }
  ];

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <FileText className="h-5 w-5 text-red-600" />;
      case 'dwg':
        return <Image className="h-5 w-5 text-blue-600" />;
      case 'docx':
        return <File className="h-5 w-5 text-blue-800" />;
      default:
        return <File className="h-5 w-5 text-gray-600" />;
    }
  };

  const getCategoryColor = (color: string) => {
    switch (color) {
      case 'blue':
        return 'from-blue-50 to-cyan-50 border-blue-200';
      case 'green':
        return 'from-green-50 to-emerald-50 border-green-200';
      case 'orange':
        return 'from-orange-50 to-amber-50 border-orange-200';
      default:
        return 'from-gray-50 to-slate-50 border-gray-200';
    }
  };

  return (
    <ProjectWorkspace>
      <div className="space-y-8 animate-fade-in">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-2xl p-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-purple-100 rounded-xl">
                <Folder className="h-8 w-8 text-purple-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Documentos do Projeto</h1>
                <p className="text-gray-600 mt-1">
                  Todos os arquivos, relatórios e documentos técnicos
                </p>
              </div>
            </div>
            
            <Button 
              className="bg-purple-600 hover:bg-purple-700 text-white transition-all duration-200 hover:shadow-lg"
              disabled
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload Documento
            </Button>
          </div>
        </div>

        {/* Categorias de Documentos */}
        <div className="space-y-6">
          {documentCategories.map((category, categoryIndex) => (
            <Card 
              key={category.id}
              className={`border bg-gradient-to-r ${getCategoryColor(category.color)} hover:shadow-lg transition-all duration-300 animate-scale-in`}
              style={{ animationDelay: `${categoryIndex * 200}ms` }}
            >
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-3">
                  <category.icon className="h-6 w-6 text-gray-700" />
                  <CardTitle className="text-xl">{category.name}</CardTitle>
                  <Badge variant="outline">{category.documents.length} arquivo{category.documents.length !== 1 ? 's' : ''}</Badge>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-3">
                  {category.documents.map((doc, docIndex) => (
                    <div 
                      key={docIndex}
                      className="bg-white rounded-lg p-4 border border-gray-200 hover:border-gray-300 transition-all duration-200 hover:shadow-sm animate-fade-in"
                      style={{ animationDelay: `${(categoryIndex * 200) + (docIndex * 100)}ms` }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {getFileIcon(doc.type)}
                          <div>
                            <div className="font-medium text-gray-900">{doc.name}</div>
                            <div className="text-sm text-gray-500">
                              {doc.size} • {new Date(doc.date).toLocaleDateString('pt-BR')}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="h-8 px-3 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200"
                            disabled
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            Ver
                          </Button>
                          <Button 
                            size="sm"
                            className="h-8 px-3 bg-gray-600 hover:bg-gray-700 text-white transition-all duration-200"
                            disabled
                          >
                            <Download className="h-3 w-3 mr-1" />
                            Baixar
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border border-gray-200 hover:shadow-md transition-all duration-300">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-blue-600">8</div>
              <div className="text-sm text-gray-600">Total de Arquivos</div>
            </CardContent>
          </Card>
          <Card className="border border-gray-200 hover:shadow-md transition-all duration-300">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-green-600">12.8</div>
              <div className="text-sm text-gray-600">MB Armazenados</div>
            </CardContent>
          </Card>
          <Card className="border border-gray-200 hover:shadow-md transition-all duration-300">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-orange-600">3</div>
              <div className="text-sm text-gray-600">Categorias</div>
            </CardContent>
          </Card>
          <Card className="border border-gray-200 hover:shadow-md transition-all duration-300">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-purple-600">100%</div>
              <div className="text-sm text-gray-600">Sincronizado</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProjectWorkspace>
  );
};

export default ProjectSpecificDocuments;
