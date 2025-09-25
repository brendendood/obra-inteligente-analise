import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AdminUser } from '@/hooks/useAdminUsers';
import { PlanBadge } from './PlanBadge';
import { normalizePlan } from '@/lib/plan';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  CreditCard, 
  MessageSquare, 
  Settings,
  Shield,
  Trash2
} from 'lucide-react';

interface UserDetailsModalProps {
  user: AdminUser | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdatePlan: (userId: string, newPlan: string, resetMessages?: boolean) => Promise<boolean>;
  onResetMessages: (userId: string) => Promise<boolean>;
  onAddCredit: (userId: string, credits?: number) => Promise<boolean>;
  onDeleteUser: (userId: string) => Promise<boolean>;
}

export const UserDetailsModal: React.FC<UserDetailsModalProps> = ({
  user,
  isOpen,
  onClose,
  onUpdatePlan,
  onResetMessages,
  onAddCredit,
  onDeleteUser
}) => {
  if (!user) return null;

  const handlePlanChange = async (newPlan: string) => {
    const success = await onUpdatePlan(user.user_id, newPlan);
    if (success) {
      onClose();
    }
  };

  const handleResetMessages = async () => {
    const success = await onResetMessages(user.user_id);
    if (success) {
      onClose();
    }
  };

  const handleAddCredit = async () => {
    const success = await onAddCredit(user.user_id, 1);
    if (success) {
      onClose();
    }
  };

  const handleDeleteUser = async () => {
    if (window.confirm('Tem certeza que deseja excluir este usuário? Esta ação não pode ser desfeita.')) {
      const success = await onDeleteUser(user.user_id);
      if (success) {
        onClose();
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Detalhes do Usuário
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile">Perfil</TabsTrigger>
            <TabsTrigger value="subscription">Plano</TabsTrigger>
            <TabsTrigger value="location">Localização</TabsTrigger>
            <TabsTrigger value="actions">Ações</TabsTrigger>
          </TabsList>

          <ScrollArea className="h-[500px] mt-4">
            <TabsContent value="profile" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Informações Pessoais
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Nome Completo</label>
                      <p className="text-sm font-medium">{user.full_name || 'Não informado'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Email</label>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <p className="text-sm">{user.email}</p>
                        {user.email_confirmed_at && (
                          <Badge variant="outline" className="text-xs">Verificado</Badge>
                        )}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Empresa</label>
                      <p className="text-sm">{user.company || 'Não informado'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Cargo</label>
                      <p className="text-sm">{user.cargo || 'Não informado'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Telefone</label>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <p className="text-sm">{user.phone || 'Não informado'}</p>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Gênero</label>
                      <p className="text-sm capitalize">{user.gender || 'Não informado'}</p>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <label className="text-sm font-medium text-gray-500">Tags</label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {user.tags && user.tags.length > 0 ? (
                        user.tags.map((tag, index) => (
                          <Badge key={index} variant="outline">{tag}</Badge>
                        ))
                      ) : (
                        <p className="text-sm text-gray-500">Nenhuma tag</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Criado em</label>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <p className="text-sm">{new Date(user.created_at).toLocaleString('pt-BR')}</p>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Último login</label>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <p className="text-sm">
                          {user.last_sign_in_at 
                            ? new Date(user.last_sign_in_at).toLocaleString('pt-BR')
                            : 'Nunca'
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {user.quiz_completed_at && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      Quiz de Onboarding
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Contexto</label>
                        <p className="text-sm">{user.quiz_context || 'Não informado'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Papel</label>
                        <p className="text-sm">{user.quiz_role || 'Não informado'}</p>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Desafios</label>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {user.quiz_challenges && user.quiz_challenges.length > 0 ? (
                          user.quiz_challenges.map((challenge, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">{challenge}</Badge>
                          ))
                        ) : (
                          <p className="text-sm text-gray-500">Nenhum desafio</p>
                        )}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Completado em</label>
                      <p className="text-sm">{new Date(user.quiz_completed_at).toLocaleString('pt-BR')}</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="subscription" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    Plano Atual
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2">
                    <PlanBadge plan={normalizePlan(user.plan)} />
                    <Badge variant={user.status === 'ACTIVE' ? 'default' : 'secondary'}>
                      {user.status}
                    </Badge>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-sm font-medium">Alterar Plano</h4>
                    <div className="flex gap-2">
                      {['BASIC', 'PRO', 'ENTERPRISE'].map((plan) => (
                        <Button
                          key={plan}
                          variant={normalizePlan(user.plan) === plan ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => handlePlanChange(plan)}
                          disabled={normalizePlan(user.plan) === plan}
                        >
                          {plan}
                        </Button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="location" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Localização
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Cidade</label>
                      <p className="text-sm">{user.city || 'Não informado'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Estado</label>
                      <p className="text-sm">{user.state || 'Não informado'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">País</label>
                      <p className="text-sm">{user.country || 'Não informado'}</p>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500">Localização Real</label>
                    <p className="text-sm">{user.real_location || 'Não disponível'}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500">Último IP de Login</label>
                    <p className="text-sm font-mono">{user.last_login_ip || 'Não disponível'}</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="actions" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    Ações Administrativas
                  </CardTitle>
                  <CardDescription>
                    Execute ações administrativas para este usuário
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleResetMessages}
                      className="flex items-center gap-2"
                    >
                      <MessageSquare className="h-4 w-4" />
                      Resetar Mensagens
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleAddCredit}
                      className="flex items-center gap-2"
                    >
                      <CreditCard className="h-4 w-4" />
                      Adicionar Crédito
                    </Button>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="text-sm font-medium text-red-600 mb-2">Zona de Perigo</h4>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={handleDeleteUser}
                      className="flex items-center gap-2"
                    >
                      <Trash2 className="h-4 w-4" />
                      Excluir Usuário
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};