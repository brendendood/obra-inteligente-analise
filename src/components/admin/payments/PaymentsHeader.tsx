
import { Button } from '@/components/ui/button';
import { Download, CreditCard } from 'lucide-react';

interface PaymentsHeaderProps {
  onExport: () => void;
}

export const PaymentsHeader = ({ onExport }: PaymentsHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Gestão de Pagamentos</h1>
        <p className="text-gray-600 mt-1">Controle e análise de todas as transações</p>
      </div>
      
      <div className="flex gap-2">
        <Button variant="outline" onClick={onExport}>
          <Download className="h-4 w-4 mr-2" />
          Exportar CSV
        </Button>
        <Button disabled>
          <CreditCard className="h-4 w-4 mr-2" />
          Configurar Stripe
        </Button>
      </div>
    </div>
  );
};
