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
import { Edit, LogIn, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

interface UserTableProps {
  users: Array<{
    id: string;
    user_id: string;
    email: string;
    full_name: string | null;
    company: string | null;
    phone: string | null;
    city: string | null;
    state: string | null;
    cargo: string | null;
    avatar_url: string | null;
    created_at: string;
    last_login: string | null;
    subscription: {
      plan: string;
      status: string;
    } | null;
  }>;
  onUpdateUser: (userId: string, data: any) => void;
  onDeleteUser: (userId: string) => void;
}

export const UsersTable = ({ users, onUpdateUser, onDeleteUser }: UserTableProps) => {
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [editFormData, setEditFormData] = useState<any>({});
  const { toast } = useToast();

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
      case 'pro': return 'bg-blue-100 text-blue-800';
      case 'enterprise': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
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
      setSelectedUsers(users.map(user => user.user_id));
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
      plan: user.subscription?.plan || 'free',
      status: user.subscription?.status || 'active'
    });
  };

  const handleSaveEdit = async () => {
    try {
      await onUpdateUser(editingUser.user_id, editFormData);
      setEditingUser(null);
      toast({
        title: "Usuário atualizado",
        description: "As informações do usuário foram atualizadas com sucesso",
      });
    } catch (error) {
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

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox 
                  checked={selectedUsers.length === users.length && users.length > 0}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Cargo</TableHead>
              <TableHead>Empresa</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Telefone</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Plano</TableHead>
              <TableHead>Localização</TableHead>
              <TableHead>Criado em</TableHead>
              <TableHead>Último Login</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow 
                key={user.user_id}
                className={selectedUsers.includes(user.user_id) ? 'bg-blue-50' : ''}
              >
                <TableCell>
                  <Checkbox 
                    checked={selectedUsers.includes(user.user_id)}
                    onCheckedChange={(checked) => handleSelectUser(user.user_id, checked as boolean)}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar_url || ''} />
                      <AvatarFallback>
                        {user.full_name?.split(' ').map(n => n[0]).join('') || user.email[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{user.full_name || 'Nome não informado'}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{user.cargo || '-'}</TableCell>
                <TableCell>{user.company || '-'}</TableCell>
                <TableCell className="text-sm text-gray-600">{user.email}</TableCell>
                <TableCell>{user.phone || '-'}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(user.subscription?.status || 'active')}>
                    {user.subscription?.status || 'active'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className={getPlanColor(user.subscription?.plan || 'free')}>
                    {(user.subscription?.plan || 'free').toUpperCase()}
                  </Badge>
                </TableCell>
                <TableCell>
                  {[user.city, user.state].filter(Boolean).join(', ') || '-'}
                </TableCell>
                <TableCell>
                  {format(new Date(user.created_at), 'dd/MM/yyyy')}
                </TableCell>
                <TableCell>
                  {user.last_login ? format(new Date(user.last_login), 'dd/MM/yyyy HH:mm') : 'Nunca'}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleImpersonateUser(user.user_id, user.email, user.full_name || user.email)}
                      title="Logar como usuário"
                    >
                      <LogIn className="h-4 w-4" />
                    </Button>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditUser(user)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                          <DialogTitle>Editar Usuário - {user.full_name}</DialogTitle>
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
                      onClick={() => onDeleteUser(user.user_id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      {selectedUsers.length > 0 && (
        <div className="flex items-center gap-2 p-2 bg-blue-50 rounded-md">
          <span className="text-sm text-blue-800">
            {selectedUsers.length} usuários selecionados
          </span>
          <Button size="sm" variant="outline">
            Ações em lote
          </Button>
        </div>
      )}
    </div>
  );
};