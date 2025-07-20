
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

interface WelcomeSectionProps {
  userName: string;
  onRefresh?: () => void;
  isLoading?: boolean;
}

export const WelcomeSection = ({ userName, onRefresh, isLoading }: WelcomeSectionProps) => {
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
      
      <div className="flex items-center space-x-4">
        {/* Logo da MadenAI */}
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mr-3">
            <div className="w-5 h-5 bg-white rounded-sm"></div>
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            MadenAI
          </span>
        </div>

        {/* Botão de Refresh */}
        {onRefresh && (
          <Button 
            onClick={onRefresh}
            disabled={isLoading}
            variant="outline" 
            size="sm"
            className="flex items-center space-x-2 border-blue-200 text-blue-700 hover:bg-blue-50"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Atualizar</span>
          </Button>
        )}
      </div>
    </div>
  );
};
