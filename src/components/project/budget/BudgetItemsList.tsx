
import { Card, CardContent } from '@/components/ui/card';
import { EditableBudgetItem } from './EditableBudgetItem';
import { BudgetItem } from '@/utils/budgetGenerator';

interface BudgetItemsListProps {
  items: BudgetItem[];
  dataReferencia: string;
  onUpdateItem: (id: string, updates: Partial<BudgetItem>) => void;
  onRemoveItem: (id: string) => void;
}

export const BudgetItemsList = ({ 
  items, 
  dataReferencia, 
  onUpdateItem, 
  onRemoveItem 
}: BudgetItemsListProps) => {
  return (
    <Card className="bg-white/80 backdrop-blur-sm border border-gray-200/50 overflow-hidden rounded-xl w-full">
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 gap-2">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900">
            Itens do Orçamento
          </h3>
          <span className="text-xs sm:text-sm text-gray-500">
            {items.length} itens • {dataReferencia}
          </span>
        </div>
        
        <div className="space-y-3 sm:space-y-4">
          {items.map((item) => (
            <EditableBudgetItem
              key={item.id}
              item={item}
              onUpdate={onUpdateItem}
              onRemove={onRemoveItem}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
