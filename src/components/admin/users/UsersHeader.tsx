
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, RefreshCw } from 'lucide-react';

interface UsersHeaderProps {
  totalUsers: number;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export const UsersHeader = ({ totalUsers, onRefresh, isRefreshing }: UsersHeaderProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-bold flex items-center gap-2">
          <Users className="h-6 w-6" />
          Gerenciamento de Usuários
        </CardTitle>
        <Button 
          variant="outline" 
          onClick={onRefresh}
          disabled={isRefreshing}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          Atualizar
        </Button>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-gray-600">
          Total de {totalUsers} usuários registrados na plataforma
        </div>
      </CardContent>
    </Card>
  );
};
