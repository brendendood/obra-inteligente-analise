import { useState } from 'react';
import { Project } from '@/types/project';
import { BudgetGenerationProgress } from './BudgetGenerationProgress';
import { BudgetItemsList } from './BudgetItemsList';
import { BudgetSummary } from './BudgetSummary';
import { BudgetActions } from './BudgetActions';
import { EmptyBudgetState } from './EmptyBudgetState';
import { AddItemDialog } from './AddItemDialog';
import { BudgetExportDialog } from './BudgetExportDialog';
import { BudgetHistoryDialog } from './BudgetHistoryDialog';
import { BudgetData } from '@/utils/budgetGenerator';
import { Separator } from '@/components/ui/separator';

interface BudgetWorkspaceProps {
  project: Project;
  budgetData: BudgetData | null;
  isGenerating: boolean;
  progress: number;
  onGenerateBudget: () => void;
  onUpdateItem: (id: string, updates: any) => void;
  onRemoveItem: (id: string) => void;
  onAddNewItem: (item: any) => void;
}

export const BudgetWorkspace = ({
  project,
  budgetData,
  isGenerating,
  progress,
  onGenerateBudget,
  onUpdateItem,
  onRemoveItem,
  onAddNewItem
}: BudgetWorkspaceProps) => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [showHistoryDialog, setShowHistoryDialog] = useState(false);

  const environments = ['Quarto', 'Sala', 'Cozinha', 'Banheiro', 'Lavanderia', 'Varanda', 'Garagem', 'Geral', 'Outro'];
  const categories = ['Alvenaria', 'Estrutura', 'Instalações', 'Revestimentos', 'Pintura', 'Esquadrias', 'Louças e Metais', 'Outro'];

  // If no persisted data, show generation
  if (!budgetData && !isGenerating) {
    return (
      <div className="space-y-6">
        <EmptyBudgetState 
          projectName={project.name} 
          projectArea={project.total_area || 100}
          onGenerateBudget={onGenerateBudget}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 pb-6">
      {/* Header with main actions - mobile optimized */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">
            Orçamento - {project.name}
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Orçamento SINAPI automatizado para {project.total_area || 100}m²
          </p>
        </div>
        
        <BudgetActions
          onAddItem={() => setShowAddDialog(true)}
          onExport={() => setShowExportDialog(true)}
          onViewHistory={() => setShowHistoryDialog(true)}
          disabled={!budgetData}
          showAdd={false}
          darkFrame
        />
      </div>

      {/* Progress during generation */}
      {isGenerating && (
        <BudgetGenerationProgress
          progress={progress}
          projectArea={project.total_area || 100}
        />
      )}

      {/* Budget content */}
      {budgetData && (
        <>
          <div className="max-w-3xl mx-auto w-full">
            <BudgetSummary budgetData={budgetData} />
          </div>
          <Separator className="w-11/12 mx-auto rounded-full bg-border/60" />
          <div className="max-w-3xl mx-auto w-full">
            <BudgetItemsList
              items={budgetData.items}
              dataReferencia={budgetData.data_referencia}
              onUpdateItem={onUpdateItem}
              onRemoveItem={onRemoveItem}
            />
            <div className="mt-4">
              <BudgetActions
                onAddItem={() => setShowAddDialog(true)}
                onExport={() => setShowExportDialog(true)}
                onViewHistory={() => setShowHistoryDialog(true)}
                showExport={false}
                showHistory={false}
              />
            </div>
          </div>
        </>
      )}

      {/* Dialogs */}
      <AddItemDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onAddItem={onAddNewItem}
        environments={environments}
        categories={categories}
      />

      <BudgetExportDialog
        open={showExportDialog}
        onOpenChange={setShowExportDialog}
        budgetData={budgetData}
        projectName={project.name}
        projectArea={project.total_area}
      />

      <BudgetHistoryDialog
        open={showHistoryDialog}
        onOpenChange={setShowHistoryDialog}
        projectId={project.id}
      />
    </div>
  );
};
