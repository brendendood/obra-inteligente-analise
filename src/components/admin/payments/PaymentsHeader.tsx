
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

interface PaymentsHeaderProps {
  onExport: () => void;
}

export const PaymentsHeader = ({ onExport }: PaymentsHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Gestão de Pagamentos</h1>
        <p className="text-gray-600 mt-1">Análise financeira e transações</p>
      </div>
      <Button onClick={onExport} className="flex items-center gap-2">
        <Download className="h-4 w-4" />
        Exportar CSV
      </Button>
    </div>
  );
};
