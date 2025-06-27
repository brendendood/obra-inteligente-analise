
import { useProject } from '@/contexts/ProjectContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calculator, AlertCircle, Clock } from 'lucide-react';

export const ProjectBudgetPlaceholder = () => {
  const { currentProject } = useProject();

  if (!currentProject) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Projeto não encontrado</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="border-2 border-dashed border-blue-200 bg-blue-50/50">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calculator className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-xl text-blue-900">
                Orçamento - {currentProject.name}
              </CardTitle>
              <p className="text-blue-700 text-sm">
                Orçamento específico para este projeto
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-blue-800">
              <Clock className="h-4 w-4" />
              <span className="text-sm">
                Processando dados do projeto...
              </span>
            </div>
            
            {currentProject.analysis_data ? (
              <div className="bg-white rounded-lg p-4 border">
                <h3 className="font-semibold text-gray-900 mb-2">
                  Dados do Projeto Disponíveis
                </h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>📊 Projeto: {currentProject.name}</p>
                  {currentProject.total_area && (
                    <p>📐 Área: {currentProject.total_area}m²</p>
                  )}
                  <p>📅 Criado: {new Date(currentProject.created_at).toLocaleDateString('pt-BR')}</p>
                </div>
              </div>
            ) : (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-yellow-800 text-sm">
                  ⏳ Aguardando análise do projeto para gerar orçamento específico
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
