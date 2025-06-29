
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
    <div className="space-y-6">
      {/* Header with main actions */}
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
          <BudgetSummary budgetData={budgetData} />
          <BudgetItemsList
            items={budgetData.items}
            dataReferencia={budgetData.data_referencia}
            onUpdateItem={onUpdateItem}
            onRemoveItem={onRemoveItem}
          />
          <BudgetActions
            onAddItem={() => setShowAddDialog(true)}
            onExport={() => setShowExportDialog(true)}
            onViewHistory={() => setShowHistoryDialog(true)}
          />
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
      />

      <BudgetHistoryDialog
        open={showHistoryDialog}
        onOpenChange={setShowHistoryDialog}
        projectId={project.id}
      />
    </div>
  );
};
