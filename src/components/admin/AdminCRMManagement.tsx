import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Users, 
  Eye, 
  Download, 
  Search,
  Building,
  Calendar,
  DollarSign,
  FileText
} from 'lucide-react';

interface UserWithCRM {
  user_id: string;
  email: string;
  full_name: string;
  company: string;
  created_at: string;
  clients_count: number;
  projects_count: number;
  total_crm_value: number;
  last_activity: string;
}

export const AdminCRMManagement = () => {
  const [users, setUsers] = useState<UserWithCRM[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserWithCRM[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    loadUsersWithCRM();
  }, []);

  useEffect(() => {
    // Filtrar usuários baseado no termo de busca
    const filtered = users.filter(user => 
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.company?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [users, searchTerm]);

  const loadUsersWithCRM = async () => {
    try {
      setLoading(true);
      
      // Buscar estatísticas do CRM por usuário primeiro
      const { data: crmStats, error: crmError } = await supabase
        .from('v_crm_client_stats')
        .select('*');

      if (crmError) throw crmError;

      // Buscar usuários únicos que possuem dados de CRM
      const ownerIds = [...new Set((crmStats || []).map((stat: any) => stat.owner_id))];
      
      if (ownerIds.length === 0) {
        setUsers([]);
        return;
      }

      // Buscar perfis dos usuários que possuem CRM
      const { data: profiles, error: profilesError } = await supabase
        .from('user_profiles')
        .select(`
          user_id,
          full_name,
          company,
          created_at
        `)
        .in('user_id', ownerIds);

      if (profilesError) throw profilesError;

      // Buscar dados dos usuários de auth.users usando a função admin
      const { data: authUsers, error: authError } = await supabase
        .rpc('get_admin_users_with_auth_data');

      if (authError) console.warn('Warning loading auth data:', authError);

      // Combinar dados
      const usersWithCRM: UserWithCRM[] = (profiles || []).map(profile => {
        const authInfo = authUsers?.find((auth: any) => auth.user_id === profile.user_id);
        const userCrmStats = (crmStats || []).filter((stat: any) => stat.owner_id === profile.user_id);
        
        const clientsCount = new Set(userCrmStats.map((stat: any) => stat.client_id)).size;
        const projectsCount = userCrmStats.reduce((sum: number, stat: any) => sum + (stat.projects_count || 0), 0);
        const totalValue = userCrmStats.reduce((sum: number, stat: any) => sum + (stat.total_value || 0), 0);
        const lastActivity = userCrmStats.length > 0 
          ? userCrmStats.sort((a: any, b: any) => new Date(b.last_project_date || '1970-01-01').getTime() - new Date(a.last_project_date || '1970-01-01').getTime())[0].last_project_date
          : null;

        return {
          user_id: profile.user_id,
          email: authInfo?.email || 'N/A',
          full_name: profile.full_name || 'Sem nome',
          company: profile.company || '',
          created_at: profile.created_at,
          clients_count: clientsCount,
          projects_count: projectsCount,
          total_crm_value: totalValue,
          last_activity: lastActivity
        };
      });

      setUsers(usersWithCRM);
    } catch (error) {
      console.error('Erro ao carregar usuários com CRM:', error);
      toast({
        title: "Erro",
        description: "Falha ao carregar dados dos usuários",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewUserCRM = (userId: string, userEmail: string) => {
    navigate(`/admin-panel/crm-user/${userId}?email=${encodeURIComponent(userEmail)}`);
  };

  const handleDownloadUserCRM = async (userId: string, userEmail: string) => {
    try {
      const response = await fetch(`/api/admin/crm/export-user/${userId}`);
      
      if (!response.ok) throw new Error('Falha no download');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `crm_${userEmail}_${new Date().toISOString().slice(0,10)}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Download iniciado",
        description: `CRM de ${userEmail} baixado com sucesso`
      });
    } catch (error) {
      console.error('Erro no download:', error);
      toast({
        title: "Erro",
        description: "Falha ao baixar dados do CRM",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            CRM - Usuários
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-48">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                CRM - Gestão por Usuário
              </CardTitle>
              <CardDescription>
                Acesse e gerencie os dados de CRM de cada usuário da plataforma
              </CardDescription>
            </div>
            <Badge variant="outline" className="text-sm">
              {filteredUsers.length} usuários com CRM
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Barra de busca */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por email, nome ou empresa..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Estatísticas resumidas */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-blue-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">Total Usuários</p>
                    <p className="text-xl font-semibold">{users.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-green-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">Total Clientes</p>
                    <p className="text-xl font-semibold">
                      {users.reduce((sum, user) => sum + user.clients_count, 0)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-purple-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">Total Projetos</p>
                    <p className="text-xl font-semibold">
                      {users.reduce((sum, user) => sum + user.projects_count, 0)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-orange-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">Valor Total</p>
                    <p className="text-xl font-semibold">
                      R$ {users.reduce((sum, user) => sum + user.total_crm_value, 0).toLocaleString('pt-BR')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabela de usuários */}
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Usuário</TableHead>
                  <TableHead>Empresa</TableHead>
                  <TableHead>Clientes</TableHead>
                  <TableHead>Projetos</TableHead>
                  <TableHead>Valor Total</TableHead>
                  <TableHead>Última Atividade</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      {searchTerm ? 'Nenhum usuário encontrado com os critérios de busca' : 'Nenhum usuário com dados de CRM encontrado'}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.user_id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{user.full_name}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>{user.company || '—'}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {user.clients_count}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {user.projects_count}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">
                        R$ {user.total_crm_value.toLocaleString('pt-BR')}
                      </TableCell>
                      <TableCell>
                        {user.last_activity ? (
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3 text-muted-foreground" />
                            <span className="text-sm">
                              {new Date(user.last_activity).toLocaleDateString('pt-BR')}
                            </span>
                          </div>
                        ) : '—'}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleViewUserCRM(user.user_id, user.email)}
                            className="flex items-center gap-1"
                          >
                            <Eye className="h-3 w-3" />
                            Ver CRM
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDownloadUserCRM(user.user_id, user.email)}
                            className="flex items-center gap-1"
                          >
                            <Download className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};