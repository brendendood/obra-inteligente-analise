
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Plus, Download, History } from 'lucide-react';

interface BudgetActionsProps {
  onAddItem: () => void;
  onExport: () => void;
  onViewHistory: () => void;
  disabled?: boolean;
}

export const BudgetActions = ({ 
  onAddItem, 
  onExport, 
  onViewHistory, 
  disabled = false 
}: BudgetActionsProps) => {
  return (
    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
      <Button
        onClick={onAddItem}
        disabled={disabled}
        className="bg-green-600 hover:bg-green-700"
      >
        <Plus className="h-4 w-4 mr-2" />
        Adicionar Item
      </Button>
      
      <Button
        onClick={onExport}
        disabled={disabled}
        variant="outline"
      >
        <Download className="h-4 w-4 mr-2" />
        Exportar
      </Button>
      
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={onViewHistory}
            disabled={disabled}
            variant="outline"
          >
            <History className="h-4 w-4 mr-2" />
            Histórico
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Funcionalidade em desenvolvimento. Em breve estará disponível!</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
};
