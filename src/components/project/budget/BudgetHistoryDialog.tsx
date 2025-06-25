
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { History, Clock, User, Eye, RotateCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface BudgetHistoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId?: string;
}

interface BudgetVersion {
  id: string;
  version: number;
  date: string;
  time: string;
  author: string;
  changes: string;
  totalValue: number;
  itemsCount: number;
  changeType: 'created' | 'updated' | 'item_added' | 'item_removed' | 'item_edited';
}

export const BudgetHistoryDialog = ({ open, onOpenChange, projectId }: BudgetHistoryDialogProps) => {
  const [selectedVersion, setSelectedVersion] = useState<string | null>(null);
  const { toast } = useToast();

  // Mock history data
  const mockHistory: BudgetVersion[] = [
    {
      id: '1',
      version: 3,
      date: '2024-06-25',
      time: '14:30',
      author: 'IA MadenAI',
      changes: 'Orçamento regenerado com novos preços SINAPI',
      totalValue: 125750.80,
      itemsCount: 7,
      changeType: 'updated'
    },
    {
      id: '2',
      version: 2,
      date: '2024-06-25',
      time: '10:15',
      author: 'João Santos',
      changes: 'Editou quantidade de "Alvenaria de vedação"',
      totalValue: 118945.60,
      itemsCount: 7,
      changeType: 'item_edited'
    },
    {
      id: '3',
      version: 1,
      date: '2024-06-24',
      time: '16:45',
      author: 'IA MadenAI',
      changes: 'Orçamento inicial gerado automaticamente',
      totalValue: 115200.40,
      itemsCount: 7,
      changeType: 'created'
    }
  ];

  const getChangeTypeColor = (type: string) => {
    const colors = {
      created: 'bg-green-100 text-green-700 border-green-200',
      updated: 'bg-blue-100 text-blue-700 border-blue-200',
      item_added: 'bg-purple-100 text-purple-700 border-purple-200',
      item_removed: 'bg-red-100 text-red-700 border-red-200',
      item_edited: 'bg-orange-100 text-orange-700 border-orange-200'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const getChangeTypeLabel = (type: string) => {
    const labels = {
      created: 'Criado',
      updated: 'Atualizado',
      item_added: 'Item Adicionado',
      item_removed: 'Item Removido',
      item_edited: 'Item Editado'
    };
    return labels[type as keyof typeof labels] || 'Alteração';
  };

  const handleViewVersion = (versionId: string) => {
    setSelectedVersion(versionId);
    toast({
      title: "👁️ Visualizando versão",
      description: "Funcionalidade de visualização será implementada em breve.",
    });
  };

  const handleRestoreVersion = (versionId: string) => {
    toast({
      title: "🔄 Restaurar versão",
      description: "Funcionalidade de restauração será implementada em breve.",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <History className="h-5 w-5 mr-2 text-blue-600" />
            Histórico de Versões do Orçamento
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 max-h-96 overflow-y-auto">
          {mockHistory.length === 0 ? (
            <div className="text-center py-8">
              <History className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Nenhuma versão anterior encontrada</p>
            </div>
          ) : (
            mockHistory.map((version, index) => (
              <div
                key={version.id}
                className={`border rounded-lg p-4 space-y-3 ${
                  index === 0 ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'
                } hover:shadow-sm transition-shadow`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="text-lg font-bold text-gray-900">
                      v{version.version}
                    </div>
                    <Badge className={getChangeTypeColor(version.changeType)}>
                      {getChangeTypeLabel(version.changeType)}
                    </Badge>
                    {index === 0 && (
                      <Badge className="bg-green-100 text-green-700 border-green-200">
                        Atual
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewVersion(version.id)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Ver
                    </Button>
                    {index > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRestoreVersion(version.id)}
                      >
                        <RotateCcw className="h-4 w-4 mr-1" />
                        Restaurar
                      </Button>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{version.date} às {version.time}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <User className="h-4 w-4" />
                      <span>{version.author}</span>
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-700">{version.changes}</p>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">
                      {version.itemsCount} itens
                    </span>
                    <span className="font-semibold text-green-600">
                      R$ {version.totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="pt-4 border-t">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>💡 Dica: Você pode restaurar qualquer versão anterior</span>
            <span>{mockHistory.length} versões salvas</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
