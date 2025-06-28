
import { AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface NotAvailableInfoProps {
  message?: string;
}

export const NotAvailableInfo = ({ 
  message = "Dados insuficientes para cálculo" 
}: NotAvailableInfoProps) => {
  return (
    <Card className="border-orange-200 bg-orange-50">
      <CardContent className="p-4">
        <div className="flex items-center space-x-3">
          <AlertCircle className="h-5 w-5 text-orange-500 flex-shrink-0" />
          <div className="min-w-0">
            <h4 className="text-sm font-medium text-orange-800">
              N/D (Não Disponível)
            </h4>
            <p className="text-xs text-orange-700 mt-1">
              {message}
            </p>
            <p className="text-xs text-orange-600 mt-2 font-medium">
              💡 Adicione mais projetos processados para ver essas métricas
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
