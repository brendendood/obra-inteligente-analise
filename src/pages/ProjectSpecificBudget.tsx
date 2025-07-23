
import { ProjectWorkspace } from '@/components/project/ProjectWorkspace';
import { Calculator } from 'lucide-react';
import { ProjectBudgetGenerator } from '@/components/project/ProjectBudgetGenerator';
import { ProjectDetailProvider, useProjectDetail } from '@/contexts/ProjectDetailContext';
import { InlineUnifiedLoading } from '@/components/ui/unified-loading';

const ProjectSpecificBudgetContent = () => {
  const { project: currentProject, isLoading: isProjectLoaded } = useProjectDetail();

  if (!isProjectLoaded || !currentProject) {
    return (
      <ProjectWorkspace>
        <div className="text-center py-16">
          <Calculator className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <InlineUnifiedLoading />
        </div>
      </ProjectWorkspace>
    );
  }

  return (
    <ProjectWorkspace>
      <ProjectBudgetGenerator project={currentProject} />
    </ProjectWorkspace>
  );
};

const ProjectSpecificBudget = () => {
  return (
    <ProjectDetailProvider>
      <ProjectSpecificBudgetContent />
    </ProjectDetailProvider>
  );
};

export default ProjectSpecificBudget;
