
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calculator, TrendingUp, Receipt } from 'lucide-react';
import { BudgetData } from '@/utils/budgetGenerator';

interface BudgetSummaryProps {
  budgetData: BudgetData;
}

export const BudgetSummary = ({ budgetData }: BudgetSummaryProps) => {
  const costPerSquareMeter = budgetData.totalArea > 0 
    ? budgetData.total_com_bdi / budgetData.totalArea 
    : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
      {/* Custo Direto */}
      <Card className="border border-gray-200 shadow-sm rounded-md overflow-hidden">
        <CardHeader className="pb-2 sm:pb-3">
          <CardTitle className="text-base sm:text-lg font-semibold text-gray-900 flex items-center">
            <Calculator className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 mr-2 flex-shrink-0" />
            <span className="truncate">Custo Direto</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-1 sm:space-y-2">
            <div className="text-xl sm:text-3xl font-bold text-gray-900 break-all">
              R$ {budgetData.total.toLocaleString('pt-BR')}
            </div>
            <p className="text-xs sm:text-sm text-gray-600 truncate">
              Materiais e serviços
            </p>
          </div>
        </CardContent>
      </Card>

      {/* BDI */}
      <Card className="border border-gray-200 shadow-sm rounded-md overflow-hidden">
        <CardHeader className="pb-2 sm:pb-3">
          <CardTitle className="text-base sm:text-lg font-semibold text-gray-900 flex items-center">
            <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600 mr-2 flex-shrink-0" />
            <span className="truncate">BDI ({(budgetData.bdi * 100).toFixed(0)}%)</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-1 sm:space-y-2">
            <div className="text-xl sm:text-3xl font-bold text-orange-700 break-all">
              R$ {(budgetData.total_com_bdi - budgetData.total).toLocaleString('pt-BR')}
            </div>
            <p className="text-xs sm:text-sm text-gray-600 truncate">
              Despesas indiretas
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Total com BDI */}
      <Card className="border border-green-200 bg-green-50 shadow-sm rounded-md overflow-hidden sm:col-span-2 lg:col-span-1">
        <CardHeader className="pb-2 sm:pb-3">
          <CardTitle className="text-base sm:text-lg font-semibold text-green-900 flex items-center">
            <Receipt className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 mr-2 flex-shrink-0" />
            <span className="truncate">Total Final</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-1 sm:space-y-2">
            <div className="text-xl sm:text-3xl font-bold text-green-800 break-all">
              R$ {budgetData.total_com_bdi.toLocaleString('pt-BR')}
            </div>
            <p className="text-xs sm:text-sm text-green-700 truncate">
              R$ {costPerSquareMeter.toLocaleString('pt-BR', { 
                minimumFractionDigits: 0,
                maximumFractionDigits: 0 
              })}/m² ({budgetData.totalArea}m²)
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
