
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

interface WelcomeSectionProps {
  userName: string;
  hasProjects: boolean;
  onDeleteAll: () => void;
}

export const WelcomeSection = ({ userName, hasProjects, onDeleteAll }: WelcomeSectionProps) => {
  return (
    <div className="flex justify-between items-start">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Bem-vindo, {userName}!
        </h1>
        <p className="text-gray-600">
          Gerencie seus projetos com inteligência artificial
        </p>
      </div>
      
      {hasProjects && (
        <Button 
          variant="destructive"
          onClick={onDeleteAll}
          className="flex items-center space-x-2"
        >
          <Trash2 className="h-4 w-4" />
          <span>Excluir Todos os Projetos</span>
        </Button>
      )}
    </div>
  );
};
