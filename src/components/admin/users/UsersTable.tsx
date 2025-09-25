import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Icon } from '@/components/ui/Icon';
import { UserLocationDisplay } from './UserLocationDisplay';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useGeolocationManager } from '@/hooks/useGeolocationManager';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface UserTableProps {
  users: Array<{
    id: string;
    user_id: string;
    email: string;
    email_confirmed_at: string | null;
    full_name: string | null;
    company: string | null;
    phone: string | null;
    city: string | null;
    state: string | null;
    country: string | null;
    cargo: string | null;
    avatar_url: string | null;
    gender: string | null;
    tags: string[] | null;
    created_at: string;
    last_sign_in_at: string | null;
    plan: string;
    status: string;
    real_location: string;
    last_login_ip: string | null;
    quiz_context: string | null;
    quiz_role: string | null;
    quiz_challenges: string[] | null;
    quiz_completed_at: string | null;
  }>;
  onUpdateUser: (userId: string, data: any) => void;
  onDeleteUser: (userId: string) => void;
  onRefresh?: () => void;
}

export const UsersTable = ({ users, onUpdateUser, onDeleteUser, onRefresh }: UserTableProps) => {
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [editFormData, setEditFormData] = useState<any>({});
  const { toast } = useToast();
  const { forceUpdateUserGeolocation, isUpdating } = useGeolocationManager();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'free': return 'bg-gray-100 text-gray-800';
      case 'basic': return 'bg-green-100 text-green-800';
      case 'pro': return 'bg-blue-100 text-blue-800';
      case 'enterprise': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Nunca';
    try {
      return format(new Date(dateString), 'dd/MM/yyyy HH:mm', { locale: ptBR });
    } catch {
      return 'Data inválida';
    }
  };

  const formatRealLocation = (realLocation: string, lastLoginIp: string | null) => {
    if (realLocation === 'Localização não disponível') {
      return (
        <span className="text-gray-500 italic">
          {realLocation}
          {lastLoginIp && (
            <div className="text-xs text-gray-400">IP: {lastLoginIp}</div>
          )}
        </span>
      );
    }
    return (
      <span>
        {realLocation}
        {lastLoginIp && (
          <div className="text-xs text-gray-400">IP: {lastLoginIp}</div>
        )}
      </span>
    );
  };

  const getAvatarFallback = (user: any) => {
    if (user.full_name) {
      const names = user.full_name.split(' ');
      return names.length > 1 
        ? `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase()
        : names[0][0].toUpperCase();
    }
    return user.email[0].toUpperCase();
  };

  const getGenderBadge = (gender: string | null) => {
    if (!gender) return null;
    const colors = {
      'masculino': 'bg-blue-50 text-blue-700',
      'feminino': 'bg-pink-50 text-pink-700',
      'outro': 'bg-purple-50 text-purple-700'
    };
    return (
      <Badge className={colors[gender as keyof typeof colors] || 'bg-gray-50 text-gray-700'}>
        {gender}
      </Badge>
    );
  };

  const handleSelectUser = (userId: string, checked: boolean) => {
    if (checked) {
      setSelectedUsers([...selectedUsers, userId]);
    } else {
      setSelectedUsers(selectedUsers.filter(id => id !== userId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedUsers(users.map(user => user.id));
    } else {
      setSelectedUsers([]);
    }
  };

  const handleEditUser = (user: any) => {
    setEditingUser(user);
    setEditFormData({
      full_name: user.full_name || '',
      company: user.company || '',
      phone: user.phone || '',
      city: user.city || '', 
      state: user.state || '',
      cargo: user.cargo || '',
      plan: user.plan || 'free',
      status: user.status || 'active'
    });
  };

  const handleSaveEdit = async () => {
    try {
      console.log('💾 USERS TABLE: Salvando edição do usuário:', editingUser.user_id, editFormData);
      
      await onUpdateUser(editingUser.user_id, editFormData);
      setEditingUser(null);
      
      // Toast será mostrado pela função onUpdateUser, não precisamos duplicar aqui
    } catch (error) {
      console.error('❌ USERS TABLE: Erro ao salvar edição:', error);
      toast({
        title: "Erro ao atualizar",
        description: "Não foi possível atualizar o usuário",
        variant: "destructive",
      });
    }
  };

  const handleImpersonateUser = async (userId: string, userEmail: string, userName: string) => {
    if (!confirm(`Deseja realmente fazer login como ${userName}? Esta ação será registrada nos logs de auditoria.`)) {
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke('admin-impersonate', {
        body: { 
          targetUserId: userId,
          reason: 'Admin support session'
        }
      });

      if (error) {
        console.error('Error starting impersonation:', error);
        toast({
          title: "Erro na impersonação",
          description: "Não foi possível iniciar a sessão de impersonação",
          variant: "destructive",
        });
        return;
      }

      if (data?.impersonationUrl) {
        // Store impersonation data for the banner
        localStorage.setItem('impersonation_data', JSON.stringify({
          sessionId: data.sessionId,
          targetUser: data.targetUser,
          adminId: data.adminId || 'current-admin'
        }));

        // Open in new tab
        window.open(data.impersonationUrl, '_blank');
        toast({
          title: "Impersonação iniciada",
          description: `Sessão de impersonação iniciada para ${userName}`,
        });
      }
    } catch (error) {
      console.error('Error impersonating user:', error);
      toast({
        title: "Erro na impersonação",
        description: "Não foi possível fazer login como este usuário",
        variant: "destructive",
      });
    }
  };

  const handleForceGeolocationUpdate = async (userEmail: string) => {
    const result = await forceUpdateUserGeolocation(userEmail);
    if (result.success) {
      // Refresh da lista após alguns segundos para mostrar a atualização
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    }
  };

  return (
    <div className="space-y-4">
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox 
                  checked={selectedUsers.length === users.length && users.length > 0}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead>Usuário</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Profissão</TableHead>
              <TableHead>Contato</TableHead>
              <TableHead>Última Localização (IP)</TableHead>
              <TableHead>Plano</TableHead>
              <TableHead>Quiz</TableHead>
              <TableHead>Último Login</TableHead>
              <TableHead>Criado em</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow 
                key={user.id}
                className={selectedUsers.includes(user.id) ? 'bg-blue-50' : ''}
              >
                <TableCell>
                  <Checkbox 
                    checked={selectedUsers.includes(user.id)}
                    onCheckedChange={(checked) => handleSelectUser(user.id, checked as boolean)}
                  />
                </TableCell>
                
                {/* Usuário */}
                <TableCell className="min-w-[250px]">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.avatar_url || ''} />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                        {getAvatarFallback(user)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">
                          {user.full_name || 'Nome não informado'}
                        </span>
                        {getGenderBadge(user.gender)}
                      </div>
                       <div className="flex items-center gap-2 text-sm text-gray-600">
                         <Icon name="Mail" size="sm" />
                         <span>{user.email}</span>
                         {user.email_confirmed_at ? (
                           <Icon name="CheckCircle" size="sm" className="text-green-600" />
                         ) : (
                           <Icon name="XCircle" size="sm" className="text-red-600" />
                         )}
                       </div>
                    </div>
                  </div>
                </TableCell>

                {/* Status */}
                <TableCell>
                  <div className="space-y-1">
                    <Badge className={getStatusColor(user.status || 'active')}>
                      {user.status || 'active'}
                    </Badge>
                    {user.last_sign_in_at && (
                       <div className="flex items-center gap-2 text-xs text-gray-500">
                         <Icon name="Clock" size="sm" />
                         Online recentemente
                       </div>
                    )}
                  </div>
                </TableCell>

                {/* Profissão */}
                <TableCell>
                  <div className="space-y-1">
                    <div className="font-medium text-sm">
                      {user.cargo || 'Não informado'}
                    </div>
                    {user.company && (
                       <div className="flex items-center gap-2 text-xs text-gray-600">
                         <Icon name="Building" size="sm" />
                         <span>{user.company}</span>
                       </div>
                    )}
                  </div>
                </TableCell>

                {/* Contato */}
                <TableCell>
                  <div className="space-y-1">
                    {user.phone && (
                       <div className="flex items-center gap-2 text-sm">
                         <Icon name="Phone" size="sm" className="text-gray-400" />
                         <span>{user.phone}</span>
                       </div>
                    )}
                  </div>
                </TableCell>

                {/* Localização Real */}
                <TableCell className="max-w-[200px]">
              <UserLocationDisplay
                realLocation={user.real_location}
                lastLoginIp={user.last_login_ip}
                lastSignInAt={user.last_sign_in_at}
                userId={user.user_id}
                compact
                onLocationUpdate={onRefresh}
              />
                </TableCell>

                {/* Plano */}
                <TableCell>
                  <Badge className={getPlanColor(user.plan || 'free')}>
                    {(user.plan || 'free').toUpperCase()}
                  </Badge>
                </TableCell>

                {/* Quiz */}
                <TableCell className="min-w-[200px]">
                  {user.quiz_completed_at ? (
                    <div className="space-y-2">
                       <div className="flex items-center gap-2">
                         <Icon name="CheckCircle" size="md" className="text-green-600" />
                         <span className="text-sm font-medium text-green-600">Completado</span>
                       </div>
                      <div className="text-xs space-y-1">
                        <div><strong>Contexto:</strong> {user.quiz_context || 'N/A'}</div>
                        <div><strong>Função:</strong> {user.quiz_role || 'N/A'}</div>
                        {user.quiz_challenges && user.quiz_challenges.length > 0 && (
                          <div><strong>Desafios:</strong> {user.quiz_challenges.join(', ')}</div>
                        )}
                        <div className="text-gray-500">{formatDate(user.quiz_completed_at)}</div>
                      </div>
                    </div>
                  ) : (
                     <div className="flex items-center gap-2">
                       <Icon name="XCircle" size="md" className="text-gray-400" />
                       <span className="text-sm text-gray-500">Não completado</span>
                     </div>
                  )}
                </TableCell>

                {/* Último Login */}
                <TableCell>
                  <div className="text-sm">
                    {user.last_sign_in_at ? (
                      <div className="space-y-1">
                        <div>{formatDate(user.last_sign_in_at)}</div>
                        <div className="text-xs text-gray-500">
                          {new Date(user.last_sign_in_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) 
                            ? '🟢 Ativo' 
                            : new Date(user.last_sign_in_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
                            ? '🟡 Inativo'
                            : '🔴 Dormindo'
                          }
                        </div>
                      </div>
                    ) : (
                      <span className="text-gray-500">Nunca fez login</span>
                    )}
                  </div>
                </TableCell>

                {/* Criado em */}
                <TableCell>
                   <div className="flex items-center gap-2 text-sm text-gray-600">
                     <Icon name="Calendar" size="sm" />
                     <span>{formatDate(user.created_at)}</span>
                   </div>
                </TableCell>

                {/* Ações */}
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleImpersonateUser(user.id, user.email, user.full_name || user.email)}
                      title="Logar como usuário"
                    >
                      <Icon name="LogIn" size="md" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleForceGeolocationUpdate(user.email)}
                      disabled={isUpdating}
                      title="Atualizar localização do IP"
                    >
                      <Icon name="RefreshCw" size="md" className={isUpdating ? 'animate-spin' : ''} />
                    </Button>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditUser(user)}
                        >
                          <Icon name="Edit" size="md" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Editar Usuário - {user.full_name || user.email}</DialogTitle>
                        </DialogHeader>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="full_name">Nome Completo</Label>
                            <Input
                              id="full_name"
                              value={editFormData.full_name || ''}
                              onChange={(e) => setEditFormData({...editFormData, full_name: e.target.value})}
                            />
                          </div>
                          <div>
                            <Label htmlFor="cargo">Cargo</Label>
                            <Input
                              id="cargo"
                              value={editFormData.cargo || ''}
                              onChange={(e) => setEditFormData({...editFormData, cargo: e.target.value})}
                            />
                          </div>
                          <div>
                            <Label htmlFor="company">Empresa</Label>
                            <Input
                              id="company"
                              value={editFormData.company || ''}
                              onChange={(e) => setEditFormData({...editFormData, company: e.target.value})}
                            />
                          </div>
                          <div>
                            <Label htmlFor="phone">Telefone</Label>
                            <Input
                              id="phone"
                              value={editFormData.phone || ''}
                              onChange={(e) => setEditFormData({...editFormData, phone: e.target.value})}
                            />
                          </div>
                          <div>
                            <Label htmlFor="city">Cidade</Label>
                            <Input
                              id="city"
                              value={editFormData.city || ''}
                              onChange={(e) => setEditFormData({...editFormData, city: e.target.value})}
                            />
                          </div>
                          <div>
                            <Label htmlFor="state">Estado</Label>
                            <Input
                              id="state"
                              value={editFormData.state || ''}
                              onChange={(e) => setEditFormData({...editFormData, state: e.target.value})}
                            />
                          </div>
                          <div>
                            <Label htmlFor="plan">Plano</Label>
                            <Select 
                              value={editFormData.plan}
                              onValueChange={(value) => setEditFormData({...editFormData, plan: value})}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="free">Free</SelectItem>
                                <SelectItem value="basic">Basic</SelectItem>
                                <SelectItem value="pro">Pro</SelectItem>
                                <SelectItem value="enterprise">Enterprise</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="status">Status</Label>
                            <Select 
                              value={editFormData.status}
                              onValueChange={(value) => setEditFormData({...editFormData, status: value})}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="active">Ativo</SelectItem>
                                <SelectItem value="inactive">Inativo</SelectItem>
                                <SelectItem value="suspended">Suspenso</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="flex justify-end gap-2 pt-4">
                          <Button variant="outline" onClick={() => setEditingUser(null)}>
                            Cancelar
                          </Button>
                          <Button onClick={handleSaveEdit}>
                            Salvar Alterações
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDeleteUser(user.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Icon name="Trash2" size="md" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      {selectedUsers.length > 0 && (
        <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <span className="text-sm text-blue-800 font-medium">
            {selectedUsers.length} usuários selecionados
          </span>
          <Button size="sm" variant="outline" className="ml-auto">
            Ações em lote
          </Button>
        </div>
      )}
    </div>
  );
};
