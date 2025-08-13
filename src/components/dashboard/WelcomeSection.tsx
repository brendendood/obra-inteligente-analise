
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { UnifiedLogo } from '@/components/ui/UnifiedLogo';

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
        {/* Logo da MadeAI */}
        <div className="flex items-center">
          <UnifiedLogo size="lg" clickable={false} theme="auto" />
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
