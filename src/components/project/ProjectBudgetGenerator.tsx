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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { generateAutomaticBudget, BudgetData, BudgetItem } from '@/utils/budgetGenerator';
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast();

  const environments = ['Quarto', 'Sala', 'Cozinha', 'Banheiro', 'Lavanderia', 'Varanda', 'Garagem', 'Geral', 'Outro'];
  const categories = ['Alvenaria', 'Estrutura', 'Instalações', 'Revestimentos', 'Pintura', 'Esquadrias', 'Louças e Metais', 'Outro'];

  // Gerar automaticamente ao carregar o componente
  useEffect(() => {
    if (project && !budgetData) {
      generateBudget();
    }
  }, [project]);

  const generateBudget = useCallback(() => {
    setIsGenerating(true);
    setProgress(0);

    // Simular progresso de geração
    const steps = [
      { progress: 20, message: 'Analisando projeto...' },
      { progress: 40, message: 'Consultando tabela SINAPI...' },
      { progress: 60, message: 'Calculando quantitativos...' },
      { progress: 80, message: 'Aplicando preços...' },
      { progress: 100, message: 'Finalizando orçamento...' }
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        setProgress(steps[currentStep].progress);
        currentStep++;
      } else {
        clearInterval(interval);
        
        // Gerar orçamento automático
        const generatedBudget = generateAutomaticBudget(project);
        setBudgetData(generatedBudget);
        setIsGenerating(false);
        
        toast({
          title: "✅ Orçamento gerado automaticamente!",
          description: `Orçamento baseado na tabela SINAPI criado para ${project.name} (${project.total_area}m²).`,
        });

        if (onBudgetGenerated) {
          onBudgetGenerated(generatedBudget);
        }
      }
    }, 500);
  }, [project, onBudgetGenerated, toast]);

  const updateItem = (id: string, updates: Partial<BudgetItem>) => {
    setBudgetData((prevData) => {
      if (!prevData) return null;
      
      const updatedItems = prevData.items.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, ...updates };
          updatedItem.total = updatedItem.quantidade * updatedItem.preco_unitario;
          return updatedItem;
        }
        return item;
      });
      
      const newTotal = updatedItems.reduce((acc, item) => acc + item.total, 0);
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

      const newTotal = updatedItems.reduce((acc, item) => acc + item.total, 0);
      const newTotalComBDI = newTotal * (1 + prevData.bdi);

      return {
        ...prevData,
        total: newTotal,
        total_com_bdi: newTotalComBDI,
        items: updatedItems,
      };
    });
  };

  const addNewItem = (newItem: Omit<BudgetItem, 'id' | 'total'>) => {
    setBudgetData((prevData) => {
      if (!prevData) return null;
      
      const newItemWithId: BudgetItem = {
        id: crypto.randomUUID(),
        ...newItem,
        total: newItem.quantidade * newItem.preco_unitario,
      };
      
      const updatedItems = [...prevData.items, newItemWithId];
      const newTotal = updatedItems.reduce((acc, item) => acc + item.total, 0);
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
    <TooltipProvider>
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
            
            <Button
              onClick={() => setShowExportDialog(true)}
              disabled={!budgetData}
              variant="outline"
            >
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={() => setShowHistoryDialog(true)}
                  disabled={!budgetData}
                  variant="outline"
                >
                  <History className="h-4 w-4 mr-2" />
                  Histórico
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Funcionalidade em desenvolvimento. Em breve estará disponível!</p>
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
                  
                  {/* Cards dos itens */}
                  <div className="space-y-4">
                    {budgetData.items.map((item) => (
                      <EditableBudgetItem
                        key={item.id}
                        item={item}
                        onUpdate={updateItem}
                        onRemove={removeItem}
                      />
                    ))}
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
          projectName={project.name}
        />

        <BudgetHistoryDialog
          open={showHistoryDialog}
          onOpenChange={setShowHistoryDialog}
          projectId={project?.id}
        />
      </div>
    </TooltipProvider>
  );
};
