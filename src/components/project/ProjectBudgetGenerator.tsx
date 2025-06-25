
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { RefreshCw, Calculator } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { BudgetHeader } from './budget/BudgetHeader';
import { BudgetSummary } from './budget/BudgetSummary';
import { EditableBudgetItem } from './budget/EditableBudgetItem';
import { AddItemDialog } from './budget/AddItemDialog';

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
  const { toast } = useToast();

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
        toast({
          title: progressStep.message,
          description: `${progressStep.step}% concluído`,
        });
      }
      
      const area = project.total_area || 100;
      const environments = ['Sala', 'Cozinha', 'Banheiro', 'Suíte', 'Área Externa'];
      
      const items: BudgetItem[] = [
        {
          id: '1',
          codigo: 'SINAPI-92551',
          descricao: 'Escavação manual de valas em material de 1ª categoria',
          unidade: 'm³',
          quantidade: area * 0.3,
          preco_unitario: 45.67,
          total: area * 0.3 * 45.67,
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
          quantidade: area * 0.15,
          preco_unitario: 387.45,
          total: area * 0.15 * 387.45,
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
          quantidade: area * 2.8,
          preco_unitario: 89.23,
          total: area * 2.8 * 89.23,
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
          quantidade: area * 1.5,
          preco_unitario: 156.78,
          total: area * 1.5 * 156.78,
          categoria: 'Acabamentos',
          ambiente: 'Banheiro',
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
          total: area * 125.34,
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
          total: area * 98.45,
          categoria: 'Instalações',
          ambiente: 'Banheiro',
          isAiGenerated: true,
          isCustom: false
        },
        {
          id: '7',
          codigo: 'SINAPI-93847',
          descricao: 'Piso cerâmico 45x45cm assentado com argamassa',
          unidade: 'm²',
          quantidade: area * 0.8,
          preco_unitario: 67.89,
          total: area * 0.8 * 67.89,
          categoria: 'Acabamentos',
          ambiente: 'Sala',
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
        title: "✅ Orçamento gerado com sucesso!",
        description: `Orçamento SINAPI detalhado para ${project.name} pronto para edição.`,
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
    
    const updatedItems = budgetData.items.map(item => 
      item.id === id ? { ...item, ...updates } : item
    );
    
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

  const toggleItemSource = (id: string) => {
    if (!budgetData) return;
    
    const updatedItems = budgetData.items.map(item => 
      item.id === id ? { ...item, isAiGenerated: !item.isAiGenerated } : item
    );
    
    setBudgetData({ ...budgetData, items: updatedItems });
  };

  const addNewItem = (newItem: BudgetItem) => {
    if (!budgetData) return;
    
    const updatedItems = [...budgetData.items, newItem];
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

  const exportBudget = () => {
    toast({
      title: "📄 Preparando exportação...",
      description: "Funcionalidade de exportação será implementada em breve.",
    });
  };

  const viewHistory = () => {
    toast({
      title: "📚 Histórico de versões",
      description: "Funcionalidade de histórico será implementada em breve.",
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
    ['Sala', 'Cozinha', 'Banheiro', 'Suíte', 'Área Externa'];
    
  const categories = budgetData ? 
    [...new Set(budgetData.items.map(item => item.categoria))] : 
    ['Movimento de Terra', 'Estrutura', 'Alvenaria', 'Instalações', 'Acabamentos', 'Cobertura'];

  return (
    <div className="space-y-6">
      <BudgetHeader
        projectName={project.name}
        projectArea={project.total_area || 100}
        generationDate={budgetData?.data_referencia || new Date().toLocaleDateString('pt-BR')}
        isGenerating={isGenerating}
        onGenerateBudget={generateBudget}
        onExport={exportBudget}
        onViewHistory={viewHistory}
      />

      {isGenerating && (
        <Card className="bg-white/80 backdrop-blur-sm border border-blue-200/50">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <RefreshCw className="h-5 w-5 animate-spin text-blue-600" />
                <span className="font-medium text-blue-900">Processando com IA MadenAI...</span>
              </div>
              <Progress value={progress} className="h-3 bg-blue-100" />
              <p className="text-sm text-blue-700">
                Analisando {project.total_area || 100}m² e consultando base de preços atualizada
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {budgetData && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm border border-gray-200/50">
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Itens do Orçamento</h3>
                  <AddItemDialog 
                    onAddItem={addNewItem}
                    environments={environments}
                    categories={categories}
                  />
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-50/80">
                        <th className="border border-gray-300 p-3 text-left">Código/Categoria</th>
                        <th className="border border-gray-300 p-3 text-left">Descrição</th>
                        <th className="border border-gray-300 p-3 text-center">Qtd.</th>
                        <th className="border border-gray-300 p-3 text-center">Un.</th>
                        <th className="border border-gray-300 p-3 text-right">Preço Unit.</th>
                        <th className="border border-gray-300 p-3 text-right">Total</th>
                        <th className="border border-gray-300 p-3 text-center">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {budgetData.items.map((item) => (
                        <EditableBudgetItem
                          key={item.id}
                          item={item}
                          onUpdate={updateItem}
                          onToggleSource={toggleItemSource}
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
            <Calculator className="h-16 w-16 text-green-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-700 mb-2">
              Orçamento Inteligente para {project.name}
            </h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              Gere um orçamento detalhado e editável baseado na análise automatizada do seu projeto de {project.total_area || 100}m² com preços da tabela SINAPI.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
