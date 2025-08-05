
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
    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
      <Button
        onClick={onAddItem}
        disabled={disabled}
        className="bg-green-600 hover:bg-green-700 h-10 sm:h-auto"
      >
        <Plus className="h-4 w-4 mr-2" />
        <span className="text-sm">Adicionar Item</span>
      </Button>
      
      <div className="flex gap-2 sm:gap-3">
        <Button
          onClick={onExport}
          disabled={disabled}
          variant="outline"
          className="flex-1 sm:flex-none h-10 sm:h-auto"
        >
          <Download className="h-4 w-4 mr-2" />
          <span className="text-sm">Exportar</span>
        </Button>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={onViewHistory}
              disabled={disabled}
              variant="outline"
              className="flex-1 sm:flex-none h-10 sm:h-auto"
            >
              <History className="h-4 w-4 mr-2" />
              <span className="text-sm">Histórico</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Funcionalidade em desenvolvimento. Em breve estará disponível!</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
};
