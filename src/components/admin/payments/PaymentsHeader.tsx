
import { Button } from '@/components/ui/button';
import { CreditCard, Download } from 'lucide-react';

interface PaymentsHeaderProps {
  onExport: () => void;
}

export const PaymentsHeader = ({ onExport }: PaymentsHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-green-50 rounded-lg">
          <CreditCard className="h-6 w-6 text-green-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestão de Pagamentos</h1>
          <p className="text-gray-600 mt-1">Controle financeiro e transações</p>
        </div>
      </div>
      
      <div className="flex gap-2">
        <Button onClick={onExport} className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Exportar
        </Button>
      </div>
    </div>
  );
};
