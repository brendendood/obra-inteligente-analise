import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useAdminActions } from '@/hooks/useAdminActions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Search, Users, Filter } from 'lucide-react';
import { getPlanDisplayName, getPlanBadgeStyle } from '@/utils/planUtils';

interface AdminUser {
  id: string;
  email: string;
  full_name?: string;
  plan_code: string;
  created_at: string;
  projects_count: number;
  messages_used: number;
  message_limit: number;
  can_create_project: boolean;
  can_send_message: boolean;
}

export default function AdminUsers() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [planFilter, setPlanFilter] = useState<string>('all');
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [newPlan, setNewPlan] = useState<string>('');
  const [resetMessages, setResetMessages] = useState(false);
  
  const { user, isAuthenticated } = useAuth();
  const { updateUserPlan, resetUserMessages, addProjectCredit, loading: actionLoading } = useAdminActions();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth');
      return;
    }
    checkAdminAndLoadUsers();
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    filterUsers();
  }, [users, searchQuery, planFilter]);

  const checkAdminAndLoadUsers = async () => {
    if (!user) return;

    try {
      // Verificar se é admin
      const { data: userData } = await supabase
        .from('users')
        .select('id, plan_code')
        .eq('id', user.id)
        .single();

      if (!userData || userData.plan_code !== 'ENTERPRISE') {
        toast({
          title: "Acesso negado",
          description: "Você não tem permissão para acessar esta página.",
          variant: "destructive",
        });
        navigate('/dashboard');
        return;
      }

      await loadUsers();
    } catch (error) {
      console.error('Erro ao verificar admin:', error);
      navigate('/dashboard');
    }
  };

  const loadUsers = async () => {
    try {
      setLoading(true);
      
      // Carregar usuários com seus dados de limite
      const { data: authUsers } = await supabase.auth.admin.listUsers();
      
      const usersWithLimits = await Promise.all(
        authUsers.users.map(async (authUser) => {
          // Buscar dados do usuário
          const { data: userData } = await supabase
            .from('users')
            .select('plan_code')
            .eq('id', authUser.id)
            .single();

          // Buscar perfil
          const { data: profile } = await supabase
            .from('user_profiles')
            .select('full_name')
            .eq('user_id', authUser.id)
            .single();

          // Contar projetos
          const { count: projectsCount } = await supabase
            .from('projects')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', authUser.id);

          // Buscar uso atual
          const { data: limits } = await supabase.rpc('check_user_limits', {
            p_user_id: authUser.id
          });

          const limitsData = limits as any;

          return {
            id: authUser.id,
            email: authUser.email || '',
            full_name: profile?.full_name || authUser.user_metadata?.full_name || '',
            plan_code: userData?.plan_code || 'BASIC',
            created_at: authUser.created_at,
            projects_count: projectsCount || 0,
            messages_used: limitsData?.messages_used || 0,
            message_limit: limitsData?.message_limit || 500,
            can_create_project: limitsData?.can_create_project || false,
            can_send_message: limitsData?.can_send_message || false
          };
        })
      );

      setUsers(usersWithLimits);
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar lista de usuários.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = users;

    if (searchQuery) {
      filtered = filtered.filter(user => 
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.full_name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (planFilter !== 'all') {
      filtered = filtered.filter(user => user.plan_code.toLowerCase() === planFilter);
    }

    setFilteredUsers(filtered);
  };

  const handleSavePlan = async (userId: string) => {
    if (!newPlan) {
      toast({
        title: "Erro",
        description: "Selecione um plano válido.",
        variant: "destructive",
      });
      return;
    }

    const success = await updateUserPlan(userId, newPlan, resetMessages);
    if (success) {
      setEditingUser(null);
      setNewPlan('');
      setResetMessages(false);
      await loadUsers();
    }
  };

  const handleResetMessages = async (userId: string) => {
    const success = await resetUserMessages(userId);
    if (success) {
      await loadUsers();
    }
  };

  const handleAddCredit = async (userId: string) => {
    const success = await addProjectCredit(userId);
    if (success) {
      await loadUsers();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Carregando usuários...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" onClick={() => navigate('/admin')} className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Gestão de Usuários</h1>
            <p className="text-slate-600">Gerencie planos e limites dos usuários</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm text-slate-600">Total de Usuários</p>
                  <p className="text-2xl font-bold">{users.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div>
                <p className="text-sm text-slate-600">Basic</p>
                <p className="text-2xl font-bold text-green-600">
                  {users.filter(u => u.plan_code === 'BASIC').length}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div>
                <p className="text-sm text-slate-600">Pro</p>
                <p className="text-2xl font-bold text-blue-600">
                  {users.filter(u => u.plan_code === 'PRO').length}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div>
                <p className="text-sm text-slate-600">Enterprise</p>
                <p className="text-2xl font-bold text-purple-600">
                  {users.filter(u => u.plan_code === 'ENTERPRISE').length}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  placeholder="Buscar por email ou nome..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-slate-400" />
                <Select value={planFilter} onValueChange={setPlanFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Filtrar por plano" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os planos</SelectItem>
                    <SelectItem value="basic">Basic</SelectItem>
                    <SelectItem value="pro">Pro</SelectItem>
                    <SelectItem value="enterprise">Enterprise</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle>Usuários ({filteredUsers.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Usuário</th>
                    <th className="text-left p-2">Plano</th>
                    <th className="text-left p-2">Projetos</th>
                    <th className="text-left p-2">Mensagens/Mês</th>
                    <th className="text-left p-2">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="border-b hover:bg-slate-50">
                      <td className="p-2">
                        <div>
                          <p className="font-medium">{user.full_name || user.email}</p>
                          <p className="text-sm text-slate-600">{user.email}</p>
                        </div>
                      </td>
                      <td className="p-2">
                        {editingUser === user.id ? (
                          <div className="flex flex-col gap-2">
                            <Select value={newPlan} onValueChange={setNewPlan}>
                              <SelectTrigger className="w-32">
                                <SelectValue placeholder="Plano" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="BASIC">Basic</SelectItem>
                                <SelectItem value="PRO">Pro</SelectItem>
                                <SelectItem value="ENTERPRISE">Enterprise</SelectItem>
                              </SelectContent>
                            </Select>
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id={`reset-${user.id}`}
                                checked={resetMessages}
                                onCheckedChange={(checked) => setResetMessages(checked === true)}
                              />
                              <label htmlFor={`reset-${user.id}`} className="text-xs">
                                Zerar mensagens
                              </label>
                            </div>
                          </div>
                        ) : (
                          <Badge className={getPlanBadgeStyle(user.plan_code.toLowerCase())}>
                            {getPlanDisplayName(user.plan_code.toLowerCase())}
                          </Badge>
                        )}
                      </td>
                      <td className="p-2">
                        <div>
                          <p className="font-medium">{user.projects_count}</p>
                          <p className={`text-xs ${user.can_create_project ? 'text-green-600' : 'text-red-600'}`}>
                            {user.can_create_project ? 'Pode criar' : 'Limite atingido'}
                          </p>
                        </div>
                      </td>
                      <td className="p-2">
                        <div>
                          <p className="font-medium">
                            {user.messages_used}/{user.message_limit === -1 ? '∞' : user.message_limit}
                          </p>
                          <p className={`text-xs ${user.can_send_message ? 'text-green-600' : 'text-red-600'}`}>
                            {user.can_send_message ? 'Pode enviar' : 'Limite atingido'}
                          </p>
                        </div>
                      </td>
                      <td className="p-2">
                        <div className="flex flex-col gap-1">
                          {editingUser === user.id ? (
                            <div className="flex gap-1">
                              <Button
                                size="sm"
                                onClick={() => handleSavePlan(user.id)}
                                disabled={actionLoading}
                              >
                                Salvar
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setEditingUser(null);
                                  setNewPlan('');
                                  setResetMessages(false);
                                }}
                              >
                                Cancelar
                              </Button>
                            </div>
                          ) : (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setEditingUser(user.id);
                                  setNewPlan(user.plan_code);
                                }}
                              >
                                Editar Plano
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleResetMessages(user.id)}
                                disabled={actionLoading}
                              >
                                Zerar Mensagens
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleAddCredit(user.id)}
                                disabled={actionLoading}
                              >
                                +1 Crédito
                              </Button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {filteredUsers.length === 0 && (
              <div className="text-center py-8">
                <p className="text-slate-600">Nenhum usuário encontrado.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}