
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { RefreshCw, Download, History, Building2, Calendar } from 'lucide-react';

interface BudgetHeaderProps {
  projectName: string;
  projectArea: number;
  generationDate: string;
  isGenerating: boolean;
  onGenerateBudget: () => void;
  onExport: () => void;
  onViewHistory: () => void;
}

export const BudgetHeader = ({
  projectName,
  projectArea,
  generationDate,
  isGenerating,
  onGenerateBudget,
  onExport,
  onViewHistory
}: BudgetHeaderProps) => {
  return (
    <Card className="bg-white/80 backdrop-blur-sm border border-gray-200/50 shadow-sm">
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Building2 className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Orçamento - {projectName}</h1>
                <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                  <span className="flex items-center space-x-1">
                    <Building2 className="h-4 w-4" />
                    <span>Área: {projectArea}m²</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>Gerado: {generationDate}</span>
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200">
                🤖 Processado por IA
              </Badge>
              <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-blue-200">
                📊 Tabela SINAPI
              </Badge>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
            <Button
              onClick={onGenerateBudget}
              disabled={isGenerating}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {isGenerating ? (
                <>
                  <div className="animate-hammer mr-2">
                    <Hammer className="h-4 w-4 text-orange-500" />
                  </div>
                  Atualizando...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Atualizar com IA
                </>
              )}
            </Button>
            
            <Button onClick={onExport} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
            
            <Button onClick={onViewHistory} variant="outline">
              <History className="h-4 w-4 mr-2" />
              Histórico
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
