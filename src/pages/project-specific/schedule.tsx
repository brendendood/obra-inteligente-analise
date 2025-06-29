
import { useProjectDetail } from '@/contexts/ProjectDetailContext';
import { Clock } from 'lucide-react';
import { useState } from 'react';
import { AdvancedGanttChart } from '@/components/schedule/AdvancedGanttChart';
import { ScheduleSimulator } from '@/components/schedule/ScheduleSimulator';
import { ScheduleExportDialog } from '@/components/schedule/ScheduleExportDialog';
import { useScheduleGenerator } from '@/components/schedule/ScheduleGenerator';
import { ScheduleHeader } from '@/components/schedule/ScheduleHeader';
import { ScheduleGenerationProgress } from '@/components/schedule/ScheduleGenerationProgress';
import { ScheduleStatsCards } from '@/components/schedule/ScheduleStatsCards';
import { ScheduleEmptyState } from '@/components/schedule/ScheduleEmptyState';
import { ScheduleTask } from '@/types/project';

const ProjectSpecificSchedule = () => {
  const { project, isLoading, error } = useProjectDetail();
  const [showSimulator, setShowSimulator] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);

  const {
    scheduleData,
    isGenerating,
    progress,
    generateSchedule,
    updateTask,
    addTask
  } = useScheduleGenerator({ project });

  // Função para atualizar uma tarefa específica
  const handleUpdateTask = (taskId: string, updates: Partial<ScheduleTask>) => {
    updateTask(taskId, updates);
  };

  // Função para adicionar nova tarefa
  const handleAddTask = (newTask: ScheduleTask) => {
    addTask(newTask);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando cronograma...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <Clock className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Erro ao carregar projeto</h3>
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-16">
        <Clock className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Projeto não encontrado</h3>
        <p className="text-gray-600">Não foi possível carregar os dados do projeto.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ScheduleHeader
        projectName={project.name}
        projectArea={project.total_area || 100}
        isGenerating={isGenerating}
        hasScheduleData={!!scheduleData}
        onGenerate={generateSchedule}
        onSimulate={() => setShowSimulator(true)}
        onExport={() => setShowExportDialog(true)}
      />

      {isGenerating && (
        <ScheduleGenerationProgress
          progress={progress}
          projectArea={project.total_area || 100}
        />
      )}

      {scheduleData ? (
        <div className="space-y-6">
          <ScheduleStatsCards scheduleData={scheduleData} />

          <AdvancedGanttChart
            tasks={scheduleData.tasks}
            onUpdateTask={handleUpdateTask}
            onAddTask={handleAddTask}
            criticalPath={scheduleData.criticalPath}
            projectName={scheduleData.projectName}
          />
        </div>
      ) : !isGenerating && (
        <ScheduleEmptyState projectName={project.name} />
      )}

      {showSimulator && scheduleData && (
        <ScheduleSimulator
          open={showSimulator}
          onOpenChange={setShowSimulator}
          scheduleData={scheduleData}
        />
      )}

      {showExportDialog && scheduleData && (
        <ScheduleExportDialog
          open={showExportDialog}
          onOpenChange={setShowExportDialog}
          scheduleData={scheduleData}
        />
      )}
    </div>
  );
};

export default ProjectSpecificSchedule;
