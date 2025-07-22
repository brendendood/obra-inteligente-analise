
import { Filter, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface UsersHeaderProps {
  totalUsers: number;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export const UsersHeader = ({ totalUsers, onRefresh, isRefreshing }: UsersHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Gestão de Usuários</h1>
        <p className="text-gray-600 mt-1">
          {totalUsers} usuários registrados
          <span className="text-green-600 text-sm ml-2">• Tempo real ativo</span>
        </p>
      </div>
      
      {onRefresh && (
        <Button 
          onClick={onRefresh}
          disabled={isRefreshing}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          {isRefreshing ? 'Atualizando...' : 'Atualizar'}
        </Button>
      )}
    </div>
  );
};
