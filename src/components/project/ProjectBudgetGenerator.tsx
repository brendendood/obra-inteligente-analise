
import { Project } from '@/types/project';
import { BudgetWorkspace } from './budget/BudgetWorkspace';
import { TooltipProvider } from "@/components/ui/tooltip";
import { BudgetData } from '@/utils/budgetGenerator';
import { useBudgetLogic } from '@/hooks/useBudgetLogic';

interface ProjectBudgetGeneratorProps {
  project: Project;
  onBudgetGenerated?: (budget: BudgetData) => void;
}

export const ProjectBudgetGenerator = ({ project, onBudgetGenerated }: ProjectBudgetGeneratorProps) => {
  const {
    budgetData,
    isGenerating,
    progress,
    generateBudget,
    updateItem,
    removeItem,
    addNewItem
  } = useBudgetLogic(project, onBudgetGenerated);

  return (
    <TooltipProvider>
      <BudgetWorkspace
        project={project}
        budgetData={budgetData}
        isGenerating={isGenerating}
        progress={progress}
        onGenerateBudget={generateBudget}
        onUpdateItem={updateItem}
        onRemoveItem={removeItem}
        onAddNewItem={addNewItem}
      />
    </TooltipProvider>
  );
};
