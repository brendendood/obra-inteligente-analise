
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from '@/components/ui/alert-dialog';

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
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button 
              variant="destructive"
              className="flex items-center space-x-2 bg-red-600 hover:bg-red-700"
            >
              <Trash2 className="h-4 w-4" />
              <span>Limpar Todos os Projetos</span>
            </Button>
          </AlertDialogTrigger>
          
          <AlertDialogContent className="bg-white border border-gray-200 shadow-xl">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-red-900 text-xl">
                🗑️ Excluir Todos os Projetos
              </AlertDialogTitle>
              <AlertDialogDescription className="text-gray-600 text-base">
                <p className="mb-3">
                  <strong className="text-red-600">ATENÇÃO:</strong> Esta ação irá remover permanentemente:
                </p>
                <ul className="list-disc ml-6 space-y-1 text-sm">
                  <li>Todos os seus projetos</li>
                  <li>Todas as análises de IA</li>
                  <li>Todas as conversas e histórico</li>
                  <li>Cache local do navegador</li>
                </ul>
                <p className="mt-3 text-green-700 font-medium">
                  ✅ O sistema ficará limpo para receber projetos reais
                </p>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="border-gray-200 text-gray-700 hover:bg-gray-50">
                Cancelar
              </AlertDialogCancel>
              <AlertDialogAction 
                onClick={onDeleteAll}
                className="bg-red-600 text-white hover:bg-red-700 shadow-lg font-semibold"
              >
                Sim, Excluir Tudo
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
};
