
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, Users, FileSpreadsheet, FileDown } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { exportUsersToExcel, exportUsersToCSV } from '@/utils/adminExportUtils';
import { useToast } from '@/hooks/use-toast';

interface AdminUserExport {
  id: string;
  email: string;
  full_name?: string | null;
  created_at: string;
  last_sign_in_at?: string | null;
  plan: string;
  status: string;
  tags?: string[] | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  company?: string | null;
  phone?: string | null;
}

interface UsersHeaderProps {
  totalUsers: number;
  users: AdminUserExport[];
  onRefresh: () => void;
  isRefreshing: boolean;
}

export const UsersHeader = ({ totalUsers, users, onRefresh, isRefreshing }: UsersHeaderProps) => {
  const { toast } = useToast();

  const handleExportExcel = async () => {
    const result = exportUsersToExcel(users);
    if (result.success) {
      toast({
        title: "✅ Excel exportado",
        description: `Arquivo ${result.filename} baixado com sucesso!`,
      });
    } else {
      toast({
        title: "❌ Erro na exportação",
        description: result.error,
        variant: "destructive",
      });
    }
  };

  const handleExportCSV = async () => {
    const result = exportUsersToCSV(users);
    if (result.success) {
      toast({
        title: "✅ CSV exportado",
        description: `Arquivo ${result.filename} baixado com sucesso!`,
      });
    } else {
      toast({
        title: "❌ Erro na exportação",
        description: result.error,
        variant: "destructive",
      });
    }
  };
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-bold flex items-center gap-2">
          <Users className="h-6 w-6" />
          Gerenciamento de Usuários
        </CardTitle>
        <div className="flex items-center space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <FileDown className="h-4 w-4 mr-2" />
                Exportar
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={handleExportExcel}>
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                Excel (.xlsx)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleExportCSV}>
                <FileDown className="h-4 w-4 mr-2" />
                CSV (.csv)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button 
            variant="outline" 
            onClick={onRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-gray-600">
          Total de {totalUsers} usuários registrados na plataforma
        </div>
      </CardContent>
    </Card>
  );
};
