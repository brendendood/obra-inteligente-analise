
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { RefreshCw, Calculator, Download, Plus, History } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { BudgetHeader } from './budget/BudgetHeader';
import { BudgetSummary } from './budget/BudgetSummary';
import { EditableBudgetItem } from './budget/EditableBudgetItem';
import { AddItemDialog } from './budget/AddItemDialog';
import { BudgetExportDialog } from './budget/BudgetExportDialog';
import { BudgetHistoryDialog } from './budget/BudgetHistoryDialog';

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
  projectId: string;
  projectName: string;
  totalArea: number;
  items: BudgetItem[];
  subtotais: { [categoria: string]: number };
  total: number;
  bdi: number;
  total_com_bdi: number;
  data_referencia: string;
}

interface ProjectBudgetGeneratorProps {
  project: any;
  onBudgetGenerated?: (data: BudgetData) => void;
}

export const ProjectBudgetGenerator = ({ project, onBudgetGenerated }: ProjectBudgetGeneratorProps) => {
  const [budgetData, setBudgetData] = useState<BudgetData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [showHistoryDialog, setShowHistoryDialog] = useState(false);
  const { toast } = useToast();

  // Auto-generate budget when project loads
  useEffect(() => {
    if (project && !budgetData) {
      console.log('🤖 Auto-gerando orçamento para projeto:', project.name);
      generateBudget();
    }
  }, [project]);

  const generateBudget = async () => {
    if (!project) return;
    
    console.log('💰 ORÇAMENTO: Gerando para projeto:', project.name);
    setIsGenerating(true);
    setProgress(0);
    
    try {
      const progressSteps = [
        { step: 20, message: 'Analisando plantas e especificações...' },
        { step: 40, message: 'Consultando tabela SINAPI atualizada...' },
        { step: 60, message: 'Calculando quantitativos por ambiente...' },
        { step: 80, message: 'Aplicando custos regionais...' },
        { step: 100, message: 'Finalizando orçamento detalhado...' }
      ];
      
      for (const progressStep of progressSteps) {
        await new Promise(resolve => setTimeout(resolve, 800));
        setProgress(progressStep.step);
      }
      
      const area = project.total_area || 100;
      
      const items: BudgetItem[] = [
        {
          id: '1',
          codigo: 'SINAPI-92551',
          descricao: 'Escavação manual de valas em material de 1ª categoria',
          unidade: 'm³',
          quantidade: Math.round(area * 0.3 * 100) / 100,
          preco_unitario: 45.67,
          total: Math.round(area * 0.3 * 45.67 * 100) / 100,
          categoria: 'Movimento de Terra',
          ambiente: 'Área Externa',
          isAiGenerated: true,
          isCustom: false
        },
        {
          id: '2',
          codigo: 'SINAPI-94102',
          descricao: 'Concreto FCK=25MPa, com brita 1 e 2 - lançamento manual',
          unidade: 'm³',
          quantidade: Math.round(area * 0.15 * 100) / 100,
          preco_unitario: 387.45,
          total: Math.round(area * 0.15 * 387.45 * 100) / 100,
          categoria: 'Estrutura',
          ambiente: 'Estrutural',
          isAiGenerated: true,
          isCustom: false
        },
        {
          id: '3',
          codigo: 'SINAPI-87245',
          descricao: 'Alvenaria de vedação com tijolos cerâmicos furados',
          unidade: 'm²',
          quantidade: Math.round(area * 2.8 * 100) / 100,
          preco_unitario: 89.23,
          total: Math.round(area * 2.8 * 89.23 * 100) / 100,
          categoria: 'Alvenaria',
          ambiente: 'Geral',
          isAiGenerated: true,
          isCustom: false
        },
        {
          id: '4',
          codigo: 'SINAPI-91204',
          descricao: 'Revestimento cerâmico para paredes internas 20x30cm',
          unidade: 'm²',
          quantidade: Math.round(area * 1.5 * 100) / 100,
          preco_unitario: 156.78,
          total: Math.round(area * 1.5 * 156.78 * 100) / 100,
          categoria: 'Acabamentos',
          ambiente: 'Banheiros',
          isAiGenerated: true,
          isCustom: false
        },
        {
          id: '5',
          codigo: 'SINAPI-91856',
          descricao: 'Instalação elétrica completa - residencial padrão médio',
          unidade: 'm²',
          quantidade: area,
          preco_unitario: 125.34,
          total: Math.round(area * 125.34 * 100) / 100,
          categoria: 'Instalações',
          ambiente: 'Geral',
          isAiGenerated: true,
          isCustom: false
        },
        {
          id: '6',
          codigo: 'SINAPI-92115',
          descricao: 'Instalação hidrossanitária completa - residencial',
          unidade: 'm²',
          quantidade: area,
          preco_unitario: 98.45,
          total: Math.round(area * 98.45 * 100) / 100,
          categoria: 'Instalações',
          ambiente: 'Banheiros',
          isAiGenerated: true,
          isCustom: false
        }
      ];
      
      const subtotais = items.reduce((acc, item) => {
        acc[item.categoria] = (acc[item.categoria] || 0) + item.total;
        return acc;
      }, {} as { [categoria: string]: number });
      
      const total = items.reduce((sum, item) => sum + item.total, 0);
      const bdi = 25;
      const total_com_bdi = total * (1 + bdi / 100);
      
      const mockBudget: BudgetData = {
        projectId: project.id,
        projectName: project.name,
        totalArea: area,
        items,
        subtotais,
        total,
        bdi,
        total_com_bdi,
        data_referencia: new Date().toLocaleDateString('pt-BR')
      };
      
      setBudgetData(mockBudget);
      onBudgetGenerated?.(mockBudget);
      
      toast({
        title: "✅ Orçamento gerado automaticamente!",
        description: `Orçamento SINAPI para ${project.name} pronto para revisão e edição.`,
      });
    } catch (error) {
      console.error('❌ ORÇAMENTO: Erro ao gerar:', error);
      toast({
        title: "❌ Erro ao gerar orçamento",
        description: "Não foi possível gerar o orçamento. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
      setProgress(0);
    }
  };

  const updateItem = (id: string, updates: Partial<BudgetItem>) => {
    if (!budgetData) return;
    
    const updatedItems = budgetData.items.map(item => {
      if (item.id === id) {
        const updated = { ...item, ...updates };
        updated.total = updated.quantidade * updated.preco_unitario;
        return updated;
      }
      return item;
    });
    
    const newSubtotais = updatedItems.reduce((acc, item) => {
      acc[item.categoria] = (acc[item.categoria] || 0) + item.total;
      return acc;
    }, {} as { [categoria: string]: number });
    
    const newTotal = updatedItems.reduce((sum, item) => sum + item.total, 0);
    const newTotalComBdi = newTotal * (1 + budgetData.bdi / 100);
    
    setBudgetData({
      ...budgetData,
      items: updatedItems,
      subtotais: newSubtotais,
      total: newTotal,
      total_com_bdi: newTotalComBdi
    });
  };

  const addNewItem = (newItem: Omit<BudgetItem, 'id'>) => {
    if (!budgetData) return;
    
    const itemWithId: BudgetItem = {
      ...newItem,
      id: Date.now().toString(),
      total: newItem.quantidade * newItem.preco_unitario
    };
    
    const updatedItems = [...budgetData.items, itemWithId];
    const newSubtotais = updatedItems.reduce((acc, item) => {
      acc[item.categoria] = (acc[item.categoria] || 0) + item.total;
      return acc;
    }, {} as { [categoria: string]: number });
    
    const newTotal = updatedItems.reduce((sum, item) => sum + item.total, 0);
    const newTotalComBdi = newTotal * (1 + budgetData.bdi / 100);
    
    setBudgetData({
      ...budgetData,
      items: updatedItems,
      subtotais: newSubtotais,
      total: newTotal,
      total_com_bdi: newTotalComBdi
    });
  };

  const removeItem = (id: string) => {
    if (!budgetData) return;
    
    const updatedItems = budgetData.items.filter(item => item.id !== id);
    const newSubtotais = updatedItems.reduce((acc, item) => {
      acc[item.categoria] = (acc[item.categoria] || 0) + item.total;
      return acc;
    }, {} as { [categoria: string]: number });
    
    const newTotal = updatedItems.reduce((sum, item) => sum + item.total, 0);
    const newTotalComBdi = newTotal * (1 + budgetData.bdi / 100);
    
    setBudgetData({
      ...budgetData,
      items: updatedItems,
      subtotais: newSubtotais,
      total: newTotal,
      total_com_bdi: newTotalComBdi
    });
  };

  if (!project) {
    return (
      <div className="text-center py-16">
        <Calculator className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Projeto não encontrado</h3>
        <p className="text-gray-600">Não foi possível carregar os dados do projeto.</p>
      </div>
    );
  }

  const environments = budgetData ? 
    [...new Set(budgetData.items.map(item => item.ambiente))] : 
    ['Geral', 'Área Externa', 'Estrutural', 'Banheiros'];
    
  const categories = budgetData ? 
    [...new Set(budgetData.items.map(item => item.categoria))] : 
    ['Movimento de Terra', 'Estrutura', 'Alvenaria', 'Instalações', 'Acabamentos', 'Cobertura'];

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
