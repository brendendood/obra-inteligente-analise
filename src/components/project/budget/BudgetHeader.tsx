
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { RefreshCw, Download, History, Building2, Calendar, Hammer } from 'lucide-react';

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
    <Card className="bg-white/80 backdrop-blur-sm border border-gray-200/50 shadow-sm overflow-hidden">
      <CardContent className="p-4 sm:p-6">
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="space-y-3 min-w-0 flex-1">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg flex-shrink-0">
                  <Building2 className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <h1 className="text-lg sm:text-2xl font-bold text-gray-900 truncate">
                    Orçamento - {projectName}
                  </h1>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 text-xs sm:text-sm text-gray-600 mt-1 gap-1 sm:gap-0">
                    <span className="flex items-center space-x-1 truncate">
                      <Building2 className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                      <span>Área: {projectArea}m²</span>
                    </span>
                    <span className="flex items-center space-x-1 truncate">
                      <Calendar className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                      <span>Gerado: {generationDate}</span>
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200 text-xs">
                  🤖 IA
                </Badge>
                <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-blue-200 text-xs">
                  📊 SINAPI
                </Badge>
              </div>
            </div>

            {/* Action buttons - mobile optimized */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
              <Button
                onClick={onGenerateBudget}
                disabled={isGenerating}
                className="bg-green-600 hover:bg-green-700 text-white h-10 sm:h-auto"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-hammer mr-2">
                      <Hammer className="h-4 w-4 text-orange-500" />
                    </div>
                    <span className="text-sm">Atualizando...</span>
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    <span className="text-sm">Atualizar IA</span>
                  </>
                )}
              </Button>
              
              <div className="flex gap-2 sm:gap-3">
                <Button 
                  onClick={onExport} 
                  variant="outline"
                  className="flex-1 sm:flex-none h-10 sm:h-auto"
                >
                  <Download className="h-4 w-4 mr-2" />
                  <span className="text-sm">Exportar</span>
                </Button>
                
                <Button 
                  onClick={onViewHistory} 
                  variant="outline"
                  className="flex-1 sm:flex-none h-10 sm:h-auto"
                >
                  <History className="h-4 w-4 mr-2" />
                  <span className="text-sm">Histórico</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
