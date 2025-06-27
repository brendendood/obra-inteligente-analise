
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TabsContent } from '@/components/ui/tabs';
import { MessageSquare, Bot, Calculator, Calendar, FileText, Eye, Download } from 'lucide-react';
import GanttChart from '@/components/schedule/GanttChart';

interface Project {
  id: string;
  name: string;
  total_area?: number;
}

interface ProjectTabContentProps {
  project: Project;
  budgetData: any;
  scheduleData: any;
  budgetLoading: boolean;
  scheduleLoading: boolean;
  onBudgetGeneration: () => void;
  onScheduleGeneration: () => void;
  onNavigateToAssistant: () => void;
  onToast: (options: { title: string; description: string }) => void;
  getPdfUrl: () => string | null;
}

export const ProjectTabContent = ({
  project,
  budgetData,
  scheduleData,
  budgetLoading,
  scheduleLoading,
  onBudgetGeneration,
  onScheduleGeneration,
  onNavigateToAssistant,
  onToast,
  getPdfUrl,
}: ProjectTabContentProps) => {
  return (
    <>
      <TabsContent value="assistant">
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageSquare className="h-5 w-5 mr-2 text-purple-600" />
              Assistente IA - {project.name}
            </CardTitle>
            <CardDescription>
              Chat especializado baseado nos dados específicos deste projeto
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center py-8">
            <Bot className="h-16 w-16 text-purple-400 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-700 mb-2">
              Assistente IA Especializado
            </h3>
            <p className="text-gray-500 mb-6">
              Converse com a IA sobre este projeto específico: {project.name}
            </p>
            <Button 
              onClick={onNavigateToAssistant}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Abrir Chat Especializado
            </Button>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="budget">
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calculator className="h-5 w-5 mr-2 text-green-600" />
              Orçamento - {project.name}
            </CardTitle>
            <CardDescription>
              Orçamento específico baseado na tabela SINAPI para este projeto
            </CardDescription>
          </CardHeader>
          <CardContent>
            {budgetData ? (
              <div className="prose max-w-none">
                <pre className="whitespace-pre-wrap text-sm bg-gray-50 p-4 rounded-lg">
                  {budgetData.message || JSON.stringify(budgetData, null, 2)}
                </pre>
              </div>
            ) : (
              <div className="text-center py-8">
                <Calculator className="h-16 w-16 text-green-400 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-gray-700 mb-2">
                  Gerar Orçamento SINAPI
                </h3>
                <p className="text-gray-500 mb-6">
                  Clique no botão para gerar um orçamento específico para {project.name}
                </p>
                <Button 
                  onClick={onBudgetGeneration}
                  disabled={budgetLoading}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {budgetLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Gerando Orçamento...
                    </>
                  ) : (
                    <>
                      <Calculator className="h-4 w-4 mr-2" />
                      Gerar Orçamento
                    </>
                  )}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="schedule">
        {scheduleData ? (
          <GanttChart
            tasks={scheduleData}
            projectName={project.name}
            onExportPDF={() => onToast({ title: "📄 Exportando PDF...", description: "Funcionalidade em desenvolvimento" })}
            onExportExcel={() => onToast({ title: "📊 Exportando Excel...", description: "Funcionalidade em desenvolvimento" })}
          />
        ) : (
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-blue-600" />
                Cronograma - {project.name}
              </CardTitle>
              <CardDescription>
                Timeline específica das etapas para este projeto
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center py-8">
              <Calendar className="h-16 w-16 text-blue-400 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-700 mb-2">
                Gerar Cronograma
              </h3>
              <p className="text-gray-500 mb-6">
                Clique para gerar cronograma específico para {project.name} ({project.total_area}m²)
              </p>
              <Button 
                onClick={onScheduleGeneration}
                disabled={scheduleLoading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {scheduleLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Gerando Cronograma...
                  </>
                ) : (
                  <>
                    <Calendar className="h-4 w-4 mr-2" />
                    Gerar Cronograma
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        )}
      </TabsContent>

      <TabsContent value="documents">
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="h-5 w-5 mr-2 text-orange-600" />
              Documentos - {project.name}
            </CardTitle>
            <CardDescription>
              Downloads e relatórios específicos deste projeto
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-8 w-8 text-red-500" />
                    <div>
                      <h4 className="font-medium text-gray-900">Projeto Original</h4>
                      <p className="text-sm text-gray-500">{project.name}.pdf</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      onClick={() => window.open(getPdfUrl(), '_blank')}
                      variant="outline" 
                      size="sm"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Ver
                    </Button>
                    <Button 
                      onClick={() => {
                        const pdfUrl = getPdfUrl();
                        if (pdfUrl) {
                          const link = document.createElement('a');
                          link.href = pdfUrl;
                          link.download = `${project.name}.pdf`;
                          link.click();
                        }
                      }}
                      variant="outline" 
                      size="sm"
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                  </div>
                </div>
              </div>

              {budgetData && (
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Calculator className="h-8 w-8 text-green-500" />
                      <div>
                        <h4 className="font-medium text-gray-900">Orçamento SINAPI</h4>
                        <p className="text-sm text-gray-500">Orçamento gerado para {project.name}</p>
                      </div>
                    </div>
                    <Button 
                      onClick={() => onToast({ title: "📄 Em desenvolvimento", description: "Export de orçamento será implementado" })}
                      variant="outline" 
                      size="sm"
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                  </div>
                </div>
              )}

              {scheduleData && (
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-8 w-8 text-blue-500" />
                      <div>
                        <h4 className="font-medium text-gray-900">Cronograma</h4>
                        <p className="text-sm text-gray-500">Timeline para {project.name}</p>
                      </div>
                    </div>
                    <Button 
                      onClick={() => onToast({ title: "📄 Em desenvolvimento", description: "Export de cronograma será implementado" })}
                      variant="outline" 
                      size="sm"
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </>
  );
};
