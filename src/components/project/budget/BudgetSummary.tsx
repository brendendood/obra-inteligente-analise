
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Calculator, Percent } from 'lucide-react';
import { BudgetData } from '@/utils/budgetGenerator';

interface BudgetSummaryProps {
  budgetData: BudgetData;
}

export const BudgetSummary = ({ budgetData }: BudgetSummaryProps) => {
  const { total, bdi, total_com_bdi, totalArea } = budgetData;
  const pricePerSqm = total_com_bdi / totalArea;

  return (
    <Card className="bg-gradient-to-br from-green-50 to-blue-50 border-green-200/50 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center text-green-800">
          <TrendingUp className="h-5 w-5 mr-2" />
          Resumo Financeiro
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Calculator className="h-4 w-4 text-blue-600" />
              <span className="text-sm text-gray-600">Custo Direto</span>
            </div>
            <p className="text-xl font-bold text-gray-900">
              R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>

          <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Percent className="h-4 w-4 text-orange-600" />
              <span className="text-sm text-gray-600">BDI ({Math.round(bdi * 100)}%)</span>
            </div>
            <p className="text-xl font-bold text-orange-700">
              R$ {(total_com_bdi - total).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border-2 border-green-200">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">TOTAL GERAL</p>
            <p className="text-3xl font-bold text-green-700">
              R$ {total_com_bdi.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              R$ {pricePerSqm.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}/m² 
              • {totalArea}m²
            </p>
          </div>
        </div>

        <div className="text-xs text-gray-500 space-y-1">
          <p>• Preços baseados na tabela SINAPI</p>
          <p>• BDI inclui impostos, despesas indiretas e lucro</p>
          <p>• Valores sujeitos a variação conforme fornecedores</p>
        </div>
      </CardContent>
    </Card>
  );
};
