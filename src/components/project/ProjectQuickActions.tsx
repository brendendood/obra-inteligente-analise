
import { Card, CardContent } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Bot, Calculator, Calendar, FileText } from 'lucide-react';

interface ProjectQuickActionsProps {
  onAssistantClick: () => void;
  onBudgetClick: () => void;
  onScheduleClick: () => void;
  onDocumentsClick: () => void;
  budgetLoading: boolean;
  scheduleLoading: boolean;
}

export const ProjectQuickActions = ({
  onAssistantClick,
  onBudgetClick,
  onScheduleClick,
  onDocumentsClick,
  budgetLoading,
  scheduleLoading,
}: ProjectQuickActionsProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-gray-900">Ferramentas do Projeto</h3>
      
      <Tooltip>
        <TooltipTrigger asChild>
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer" onClick={onAssistantClick}>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Bot className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Assistente IA</h4>
                  <p className="text-sm text-gray-600">Chat especializado neste projeto</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TooltipTrigger>
        <TooltipContent>
          <p>Conversar com IA sobre este projeto específico</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer" onClick={onBudgetClick}>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Calculator className="h-6 w-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">Orçamento SINAPI</h4>
                  <p className="text-sm text-gray-600">Gerar orçamento específico</p>
                  {budgetLoading && (
                    <div className="mt-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TooltipTrigger>
        <TooltipContent>
          <p>Gerar orçamento baseado na tabela SINAPI</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer" onClick={onScheduleClick}>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Calendar className="h-6 w-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">Cronograma</h4>
                  <p className="text-sm text-gray-600">Timeline das etapas</p>
                  {scheduleLoading && (
                    <div className="mt-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TooltipTrigger>
        <TooltipContent>
          <p>Visualizar cronograma específico do projeto</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer" onClick={onDocumentsClick}>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-orange-100 rounded-lg">
                  <FileText className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Documentos</h4>
                  <p className="text-sm text-gray-600">Downloads e relatórios</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TooltipTrigger>
        <TooltipContent>
          <p>Acessar documentos e relatórios</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
};
