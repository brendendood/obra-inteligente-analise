
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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* Custo Direto */}
      <Card className="border border-gray-200 shadow-sm rounded-md">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
            <Calculator className="h-5 w-5 text-blue-600 mr-2" />
            Custo Direto
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="text-3xl font-bold text-gray-900 break-words">
              R$ {budgetData.total.toLocaleString('pt-BR', { 
                minimumFractionDigits: 2,
                maximumFractionDigits: 2 
              })}
            </div>
            <p className="text-sm text-gray-600">
              Valor dos materiais e serviços
            </p>
          </div>
        </CardContent>
      </Card>

      {/* BDI */}
      <Card className="border border-gray-200 shadow-sm rounded-md">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
            <TrendingUp className="h-5 w-5 text-orange-600 mr-2" />
            BDI ({(budgetData.bdi * 100).toFixed(0)}%)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="text-3xl font-bold text-orange-700 break-words">
              R$ {(budgetData.total_com_bdi - budgetData.total).toLocaleString('pt-BR', { 
                minimumFractionDigits: 2,
                maximumFractionDigits: 2 
              })}
            </div>
            <p className="text-sm text-gray-600">
              Benefícios e Despesas Indiretas
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Total com BDI */}
      <Card className="border border-green-200 bg-green-50 shadow-sm rounded-md">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold text-green-900 flex items-center">
            <Receipt className="h-5 w-5 text-green-600 mr-2" />
            Total Final
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="text-3xl font-bold text-green-800 break-words">
              R$ {budgetData.total_com_bdi.toLocaleString('pt-BR', { 
                minimumFractionDigits: 2,
                maximumFractionDigits: 2 
              })}
            </div>
            <p className="text-sm text-green-700">
              R$ {costPerSquareMeter.toLocaleString('pt-BR', { 
                minimumFractionDigits: 2 
              })}/m² ({budgetData.totalArea}m²)
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
