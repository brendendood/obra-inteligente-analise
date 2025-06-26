
import { useNavigate } from 'react-router-dom';
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
    <div className="space-y-2">
      {/* Primeira linha: Orçamento e IA */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={(e) => handleAction(e, `/projeto/${projectId}/orcamento`)}
          className="flex items-center justify-center space-x-1 py-2 px-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-xs"
        >
          {isMobile ? (
            <span>💰</span>
          ) : (
            <>
              <span>💰</span>
              <span>Orçamento</span>
            </>
          )}
        </button>
        
        <button
          onClick={(e) => handleAction(e, `/projeto/${projectId}/assistente`)}
          className="flex items-center justify-center space-x-1 py-2 px-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-xs"
        >
          {isMobile ? (
            <span>🤖</span>
          ) : (
            <>
              <span>🤖</span>
              <span>IA</span>
            </>
          )}
        </button>
      </div>
      
      {/* Segunda linha: Cronograma centralizado */}
      <div className="flex justify-center">
        <button
          onClick={(e) => handleAction(e, `/projeto/${projectId}/cronograma`)}
          className={`flex items-center justify-center space-x-1 py-2 px-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-xs ${
            isMobile ? 'w-16' : 'w-32'
          }`}
        >
          {isMobile ? (
            <span>📅</span>
          ) : (
            <>
              <span>📅</span>
              <span>Cronograma</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
