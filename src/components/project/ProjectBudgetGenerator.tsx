import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Calculator, Download, History, Plus, RefreshCw } from 'lucide-react';
import { Project } from '@/types/project';
import { EditableBudgetItem } from './budget/EditableBudgetItem';
import { BudgetSummary } from './budget/BudgetSummary';
import { AddItemDialog } from './budget/AddItemDialog';
import { BudgetExportDialog } from './budget/BudgetExportDialog';
import { BudgetHistoryDialog } from './budget/BudgetHistoryDialog';
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { v4 as uuidv4 } from 'uuid';

interface BudgetItem {
  id: string;
  codigo: string;
  descricao: string;
  unidade: string;
  quantidade: number;
  preco_unitario: number;
  total: number;
  categoria: string;
  ambiente: string;
  isAiGenerated: boolean;
  isCustom: boolean;
}

interface BudgetData {
  data_referencia: string;
  total: number;
  bdi: number;
  total_com_bdi: number;
  totalArea: number;
  items: BudgetItem[];
}

interface ProjectBudgetGeneratorProps {
  project: Project;
  onBudgetGenerated?: (budget: BudgetData) => void;
}

export const ProjectBudgetGenerator = ({ project, onBudgetGenerated }: ProjectBudgetGeneratorProps) => {
  const [budgetData, setBudgetData] = useState<BudgetData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [showHistoryDialog, setShowHistoryDialog] = useState(false);

  const environments = ['Quarto', 'Sala', 'Cozinha', 'Banheiro', 'Lavanderia', 'Varanda', 'Garagem', 'Outro'];
  const categories = ['Alvenaria', 'Estrutura', 'Instalações', 'Revestimentos', 'Pintura', 'Esquadrias', 'Louças e Metais', 'Outro'];

  useEffect(() => {
    // Simular carregamento inicial do orçamento
    if (project && project.analysis_data) {
      // Gerar dados mock
      const mockData: BudgetData = {
        data_referencia: new Date().toLocaleDateString(),
        total: 55000,
        bdi: 0.28,
        total_com_bdi: 70400,
        totalArea: project.total_area || 100,
        items: [
          {
            id: uuidv4(),
            codigo: 'SINAPI-01',
            descricao: 'Serviço de alvenaria',
            unidade: 'm²',
            quantidade: 50,
            preco_unitario: 80,
            total: 4000,
            categoria: 'Alvenaria',
            ambiente: 'Quarto',
            isAiGenerated: true,
            isCustom: false
          },
          {
            id: uuidv4(),
            codigo: 'SINAPI-02',
            descricao: 'Pintura interna',
            unidade: 'm²',
            quantidade: 50,
            preco_unitario: 30,
            total: 1500,
            categoria: 'Pintura',
            ambiente: 'Quarto',
            isAiGenerated: true,
            isCustom: false
          },
          {
            id: uuidv4(),
            codigo: 'SINAPI-03',
            descricao: 'Revestimento cerâmico',
            unidade: 'm²',
            quantidade: 20,
            preco_unitario: 45,
            total: 900,
            categoria: 'Revestimentos',
            ambiente: 'Banheiro',
            isAiGenerated: true,
            isCustom: false
          }
        ]
      };
      setBudgetData(mockData);
    }
  }, [project]);

  const generateBudget = useCallback(() => {
    setIsGenerating(true);
    setProgress(0);

    // Simular progresso
    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        const newProgress = prevProgress + 10;
        if (newProgress >= 100) {
          clearInterval(interval);
          setIsGenerating(false);
          return 100;
        }
        return newProgress;
      });
    }, 300);
  }, []);

  const updateItem = (id: string, updates: Partial<BudgetItem>) => {
    setBudgetData((prevData) => {
      if (!prevData) return null;
      const updatedItems = prevData.items.map((item) =>
        item.id === id ? { ...item, ...updates, total: item.quantidade * item.preco_unitario } : item
      );
      
      const newTotal = updatedItems.reduce((acc, item) => acc + (item.quantidade * item.preco_unitario), 0);
      const newTotalComBDI = newTotal * (1 + prevData.bdi);

      return {
        ...prevData,
        total: newTotal,
        total_com_bdi: newTotalComBDI,
        items: updatedItems,
      };
    });
  };

  const removeItem = (id: string) => {
    setBudgetData((prevData) => {
      if (!prevData) return null;
      const updatedItems = prevData.items.filter((item) => item.id !== id);

      const newTotal = updatedItems.reduce((acc, item) => acc + (item.quantidade * item.preco_unitario), 0);
      const newTotalComBDI = newTotal * (1 + prevData.bdi);

      return {
        ...prevData,
        total: newTotal,
        total_com_bdi: newTotalComBDI,
        items: updatedItems,
      };
    });
  };

  const addNewItem = (newItem: Omit<BudgetItem, 'id'>) => {
    setBudgetData((prevData) => {
      if (!prevData) return null;
      
      const newItemWithId: BudgetItem = {
        id: uuidv4(),
        ...newItem,
        total: newItem.quantidade * newItem.preco_unitario,
      };
      
      const updatedItems = [...prevData.items, newItemWithId];
      const newTotal = updatedItems.reduce((acc, item) => acc + (item.quantidade * item.preco_unitario), 0);
      const newTotalComBDI = newTotal * (1 + prevData.bdi);

      return {
        ...prevData,
        total: newTotal,
        total_com_bdi: newTotalComBDI,
        items: updatedItems,
      };
    });
  };

  return (
    <div className="space-y-6">
      {/* Header com ações principais */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Orçamento - {project.name}
          </h1>
          <p className="text-gray-600 mt-1">
            Orçamento SINAPI automatizado para {project.total_area || 100}m²
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
          <Button
            onClick={() => setShowAddDialog(true)}
            disabled={!budgetData}
            className="bg-green-600 hover:bg-green-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Item
          </Button>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <Button
                  onClick={() => setShowExportDialog(true)}
                  disabled={!budgetData}
                  variant="outline"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Exportar
                </Button>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              {!budgetData ? 
                "Função em desenvolvimento. Em breve disponível para seu projeto." :
                "Exportar orçamento em Excel, PDF ou CSV"
              }
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <Button
                  onClick={() => setShowHistoryDialog(true)}
                  disabled={!budgetData}
                  variant="outline"
                >
                  <History className="h-4 w-4 mr-2" />
                  Histórico
                </Button>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              {!budgetData ? 
                "Função em desenvolvimento. Em breve disponível para seu projeto." :
                "Ver histórico de versões do orçamento"
              }
            </TooltipContent>
          </Tooltip>
        </div>
      </div>

      {isGenerating && (
        <Card className="bg-blue-50/80 backdrop-blur-sm border border-blue-200/50">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <RefreshCw className="h-5 w-5 animate-spin text-blue-600" />
                <span className="font-medium text-blue-900">
                  Gerando orçamento automaticamente com MadenAI...
                </span>
              </div>
              <Progress value={progress} className="h-3 bg-blue-100" />
              <p className="text-sm text-blue-700">
                Analisando {project.total_area || 100}m² e consultando base SINAPI atualizada
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {budgetData && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm border border-gray-200/50">
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Itens do Orçamento
                  </h3>
                  <span className="text-sm text-gray-500">
                    {budgetData.items.length} itens • Última atualização: {budgetData.data_referencia}
                  </span>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-50/80">
                        <th className="border border-gray-300 p-3 text-left text-sm font-medium">Código</th>
                        <th className="border border-gray-300 p-3 text-left text-sm font-medium">Descrição</th>
                        <th className="border border-gray-300 p-3 text-center text-sm font-medium">Qtd.</th>
                        <th className="border border-gray-300 p-3 text-center text-sm font-medium">Un.</th>
                        <th className="border border-gray-300 p-3 text-right text-sm font-medium">Preço Unit.</th>
                        <th className="border border-gray-300 p-3 text-right text-sm font-medium">Total</th>
                        <th className="border border-gray-300 p-3 text-center text-sm font-medium">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {budgetData.items.map((item) => (
                        <EditableBudgetItem
                          key={item.id}
                          item={item}
                          onUpdate={updateItem}
                          onRemove={removeItem}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <BudgetSummary
              subtotal={budgetData.total}
              bdi={budgetData.bdi}
              total={budgetData.total_com_bdi}
              totalArea={budgetData.totalArea}
              pricePerSqm={budgetData.total_com_bdi / budgetData.totalArea}
            />
          </div>
        </div>
      )}

      {!budgetData && !isGenerating && (
        <Card className="bg-white/80 backdrop-blur-sm border border-gray-200/50">
          <CardContent className="text-center py-16">
            <Calculator className="h-16 w-16 text-blue-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-700 mb-2">
              Orçamento Inteligente para {project.name}
            </h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              Gere um orçamento detalhado e editável baseado na análise automatizada 
              do seu projeto de {project.total_area || 100}m² com preços SINAPI atualizados.
            </p>
            <Button 
              onClick={generateBudget}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Calculator className="h-4 w-4 mr-2" />
              Gerar Orçamento Automático
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Dialogs */}
      <AddItemDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onAddItem={addNewItem}
        environments={environments}
        categories={categories}
      />

      <BudgetExportDialog
        open={showExportDialog}
        onOpenChange={setShowExportDialog}
        budgetData={budgetData}
      />

      <BudgetHistoryDialog
        open={showHistoryDialog}
        onOpenChange={setShowHistoryDialog}
        projectId={project?.id}
      />
    </div>
  );
};
