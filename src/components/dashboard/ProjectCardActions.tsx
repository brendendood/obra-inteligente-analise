
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

interface ProjectCardActionsProps {
  projectId: string;
  onActionClick: (e: React.MouseEvent) => void;
}

export const ProjectCardActions = ({ projectId, onActionClick }: ProjectCardActionsProps) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const handleAction = (e: React.MouseEvent, path: string) => {
    e.stopPropagation();
    onActionClick(e);
    navigate(path);
  };

  return (
    <div className="space-y-3">
      {/* Primeira linha: Orçamento e IA */}
      <div className="grid grid-cols-2 gap-3">
        <Button
          onClick={(e) => handleAction(e, `/projeto/${projectId}/orcamento`)}
          variant="outline"
          size="sm"
          className="h-10 border-gray-200 hover:border-blue-300 hover:bg-blue-50"
        >
          {isMobile ? (
            <span>💰</span>
          ) : (
            <>
              <span>💰</span>
              <span className="ml-2">Orçamento</span>
            </>
          )}
        </Button>
        
        <Button
          onClick={(e) => handleAction(e, `/ia/${projectId}`)}
          variant="outline"
          size="sm"
          className="h-10 border-gray-200 hover:border-blue-300 hover:bg-blue-50"
        >
          {isMobile ? (
            <span>🤖</span>
          ) : (
            <>
              <span>🤖</span>
              <span className="ml-2">IA</span>
            </>
          )}
        </Button>
      </div>
      
      {/* Segunda linha: Cronograma */}
      <Button
        onClick={(e) => handleAction(e, `/projeto/${projectId}/cronograma`)}
        variant="outline"
        size="sm"
        className="w-full h-10 border-gray-200 hover:border-blue-300 hover:bg-blue-50"
      >
        {isMobile ? (
          <span>📅</span>
        ) : (
          <>
            <span>📅</span>
            <span className="ml-2">Cronograma</span>
          </>
        )}
      </Button>
    </div>
  );
};
