
import { useState, useEffect, useCallback } from 'react';
import { Project } from '@/types/project';
import { BudgetGenerationProgress } from './budget/BudgetGenerationProgress';
import { BudgetItemsList } from './budget/BudgetItemsList';
import { BudgetSummary } from './budget/BudgetSummary';
import { BudgetActions } from './budget/BudgetActions';
import { EmptyBudgetState } from './budget/EmptyBudgetState';
import { AddItemDialog } from './budget/AddItemDialog';
import { BudgetExportDialog } from './budget/BudgetExportDialog';
import { BudgetHistoryDialog } from './budget/BudgetHistoryDialog';
import { TooltipProvider } from "@/components/ui/tooltip";
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
          
          <BudgetActions
            onAddItem={() => setShowAddDialog(true)}
            onExport={() => setShowExportDialog(true)}
            onViewHistory={() => setShowHistoryDialog(true)}
            disabled={!budgetData}
          />
        </div>

        {isGenerating && (
          <BudgetGenerationProgress 
            progress={progress} 
            projectArea={project.total_area || 100} 
          />
        )}

        {budgetData && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3 space-y-6">
              <BudgetItemsList
                items={budgetData.items}
                dataReferencia={budgetData.data_referencia}
                onUpdateItem={updateItem}
                onRemoveItem={removeItem}
              />
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
          <EmptyBudgetState
            projectName={project.name}
            projectArea={project.total_area || 100}
            onGenerateBudget={generateBudget}
          />
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
