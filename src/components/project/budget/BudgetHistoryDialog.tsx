
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Download, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface BudgetVersion {
  id: string;
  version: string;
  date: string;
  author: string;
  changes: string;
  totalValue: number;
  itemsCount: number;
}

interface BudgetHistoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId?: string;
}

export const BudgetHistoryDialog = ({ open, onOpenChange, projectId }: BudgetHistoryDialogProps) => {
  const { toast } = useToast();
  
  // Mock data - seria substituído por dados reais do backend
  const versions: BudgetVersion[] = [
    {
      id: '1',
      version: 'v1.2',
      date: '2024-01-15 14:30',
      author: 'Sistema',
      changes: 'Geração automática do orçamento',
      totalValue: 127500,
      itemsCount: 6
    },
    {
      id: '2',
      version: 'v1.1',
      date: '2024-01-15 10:15',
      author: 'João Silva',
      changes: 'Adicionado item de pintura externa',
      totalValue: 115200,
      itemsCount: 5
    },
    {
      id: '3',
      version: 'v1.0',
      date: '2024-01-14 16:45',
      author: 'Sistema',
      changes: 'Criação inicial do orçamento',
      totalValue: 98750,
      itemsCount: 4
    }
  ];

  const handleViewVersion = (versionId: string) => {
    toast({
      title: "🚧 Em desenvolvimento",
      description: "Visualização de versões anteriores estará disponível em breve!",
      variant: "default",
    });
  };

  const handleDownloadVersion = (versionId: string) => {
    toast({
      title: "🚧 Em desenvolvimento",
      description: "Download de versões anteriores estará disponível em breve!",
      variant: "default",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Histórico do Orçamento</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Versões anteriores do orçamento deste projeto:
          </p>
          
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {versions.map((version) => (
              <div
                key={version.id}
                className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <Badge variant="outline">{version.version}</Badge>
                      <span className="text-sm text-gray-500 flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {version.date}
                      </span>
                    </div>
                    
                    <h4 className="font-medium text-gray-900">{version.changes}</h4>
                    <p className="text-sm text-gray-600">Por: {version.author}</p>
                    
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                      <span>{version.itemsCount} itens</span>
                      <span>R$ {version.totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 w-8 p-0"
                      onClick={() => handleViewVersion(version.id)}
                      title="Funcionalidade em desenvolvimento. Em breve estará disponível!"
                    >
                      <Eye className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 w-8 p-0"
                      onClick={() => handleDownloadVersion(version.id)}
                      title="Funcionalidade em desenvolvimento. Em breve estará disponível!"
                    >
                      <Download className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {versions.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhuma versão anterior encontrada</p>
            </div>
          )}

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Fechar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
