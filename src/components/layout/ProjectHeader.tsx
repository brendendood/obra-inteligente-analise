
import { ArrowLeft, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useContextualNavigation } from '@/hooks/useContextualNavigation';

interface ProjectHeaderProps {
  projectName: string;
  projectId: string;
  currentSection?: string;
}

export const ProjectHeader = ({ projectName, projectId, currentSection }: ProjectHeaderProps) => {
  const { goBack } = useContextualNavigation();

  const handleGoBack = () => {
    goBack(projectId);
  };

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleGoBack}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Voltar</span>
        </Button>
        
        <Separator orientation="vertical" className="h-6" />
        
        <div className="flex items-center space-x-2">
          <Building2 className="h-5 w-5 text-blue-600" />
          <span className="font-semibold text-gray-900">{projectName}</span>
        </div>
        
        {currentSection && (
          <>
            <Separator orientation="vertical" className="h-6" />
            <span className="text-gray-600">{currentSection}</span>
          </>
        )}
      </div>
    </div>
  );
};
