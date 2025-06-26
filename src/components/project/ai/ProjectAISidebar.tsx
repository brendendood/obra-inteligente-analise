
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lightbulb, FileText, Table, MapPin, Ruler, Wrench } from 'lucide-react';
import { Project } from '@/types/project';

interface ProjectAISidebarProps {
  project: Project;
}

export const ProjectAISidebar = ({ project }: ProjectAISidebarProps) => {
  const suggestedQuestions = [
    {
      icon: Ruler,
      category: "Áreas & Dimensões",
      questions: [
        "Quantos m² tem a área total?",
        "Qual a área da sala de estar?",
        "Dimensões dos dormitórios?"
      ]
    },
    {
      icon: MapPin,
      category: "Localização & Layout",
      questions: [
        "Onde ficam os pontos de hidráulica no térreo?",
        "Quantas janelas há no projeto?",
        "Disposição dos ambientes?"
      ]
    },
    {
      icon: Table,
      category: "Materiais & Quantitativos",
      questions: [
        "Volume de concreto necessário?",
        "Quantidade de aço estrutural?",
        "Área de alvenaria total?"
      ]
    },
    {
      icon: Wrench,
      category: "Instalações & Sistemas",
      questions: [
        "Especificações do sistema elétrico?",
        "Pontos de água e esgoto?",
        "Sistema estrutural adotado?"
      ]
    }
  ];

  const projectFiles = [
    { name: "Projeto Original.pdf", type: "PDF", size: "2.4 MB" },
    { name: "Análise Técnica.json", type: "Dados", size: "156 KB" },
    { name: "Quantitativos.xlsx", type: "Planilha", size: "89 KB" }
  ];

  return (
    <div className="space-y-6">
      {/* Perguntas Sugeridas */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center">
            <Lightbulb className="h-5 w-5 mr-2 text-yellow-600" />
            Perguntas Sugeridas
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {suggestedQuestions.map((category, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center text-sm font-medium text-gray-700">
                <category.icon className="h-4 w-4 mr-2 text-blue-600" />
                {category.category}
              </div>
              <div className="space-y-1">
                {category.questions.map((question, qIndex) => (
                  <Button
                    key={qIndex}
                    variant="ghost"
                    size="sm"
                    className="w-full text-left justify-start h-auto py-2 px-3 text-xs text-gray-600 hover:text-purple-700 hover:bg-purple-50"
                  >
                    {question}
                  </Button>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Arquivos Analisados */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center">
            <FileText className="h-5 w-5 mr-2 text-blue-600" />
            Arquivos Analisados
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {projectFiles.map((file, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                  <FileText className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{file.name}</p>
                  <p className="text-xs text-gray-500">{file.type} • {file.size}</p>
                </div>
              </div>
            </div>
          ))}

          <Button variant="outline" size="sm" className="w-full mt-3">
            Ver Todos os Arquivos
          </Button>
        </CardContent>
      </Card>

      {/* Status da IA */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <CardContent className="p-4">
          <div className="text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <Lightbulb className="h-6 w-6 text-white" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">IA Treinada</h3>
            <p className="text-sm text-gray-600 mb-3">
              Especializada em {project.name} com {project.total_area}m²
            </p>
            <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
              <span>✅ Projeto analisado</span>
              <span>🎯 100% contextual</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
