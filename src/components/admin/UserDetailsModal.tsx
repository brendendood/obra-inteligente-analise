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
    const success = await onUpdatePlan(user.user_id, newPlan, false);
    if (success) {
      alert('Plano alterado com sucesso!');
      // Recarregar dados do usuário ou atualizar estado local
      window.location.reload(); // Temporário - pode ser otimizado
    }
  };

  const handleResetMessages = async () => {
    const success = await onResetMessages(user.user_id);
    if (success) {
      alert('Mensagens resetadas com sucesso!');
    }
  };

  const handleAddCredit = async () => {
    const success = await onAddCredit(user.user_id, 1);
    if (success) {
      alert('Crédito adicionado com sucesso!');
    }
  };

  const handleDeleteUser = async () => {
    if (window.confirm('Tem certeza que deseja excluir este usuário? Esta ação não pode ser desfeita.')) {
      const success = await onDeleteUser(user.user_id);
      if (success) {
        alert('Usuário excluído com sucesso!');
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
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="profile">Perfil</TabsTrigger>
            <TabsTrigger value="subscription">Plano</TabsTrigger>
            <TabsTrigger value="quiz">Quiz</TabsTrigger>
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
            </TabsContent>

            <TabsContent value="subscription" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    Gerenciamento de Plano
                  </CardTitle>
                  <CardDescription>
                    Gerencie o plano de assinatura do usuário
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Plano Atual</label>
                      <div className="flex items-center gap-2 mt-1">
                        <PlanBadge plan={normalizePlan(user.plan)} />
                        <Badge variant={user.status === 'ACTIVE' ? 'default' : 'secondary'}>
                          {user.status}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h4 className="text-lg font-medium">Alterar Plano</h4>
                    <p className="text-sm text-gray-600">
                      Selecione um novo plano para o usuário. A alteração será aplicada imediatamente.
                    </p>
                    
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { id: 'BASIC', name: 'Basic', color: 'bg-green-100 text-green-800 border-green-200' },
                        { id: 'PRO', name: 'Pro', color: 'bg-blue-100 text-blue-800 border-blue-200' },
                        { id: 'ENTERPRISE', name: 'Enterprise', color: 'bg-purple-100 text-purple-800 border-purple-200' }
                      ].map((plan) => (
                        <Card 
                          key={plan.id}
                          className={`cursor-pointer transition-all border-2 ${
                            normalizePlan(user.plan) === plan.id 
                              ? 'border-blue-500 bg-blue-50' 
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => handlePlanChange(plan.id)}
                        >
                          <CardContent className="p-4 text-center">
                            <div className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${plan.color}`}>
                              {plan.name}
                            </div>
                            {normalizePlan(user.plan) === plan.id && (
                              <div className="mt-2">
                                <Badge variant="outline" className="text-xs">Atual</Badge>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded">
                      <Shield className="h-4 w-4 text-yellow-600" />
                      <span className="text-sm text-yellow-800">
                        Alterações de plano são aplicadas imediatamente e podem afetar os limites do usuário
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="quiz" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Quiz de Onboarding
                  </CardTitle>
                  <CardDescription>
                    Informações sobre o quiz de integração do usuário
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {user.quiz_completed_at ? (
                    <>
                      <div className="flex items-center gap-2 mb-4">
                        <Badge variant="default" className="bg-green-100 text-green-800">
                          ✅ Quiz Completado
                        </Badge>
                        <span className="text-sm text-gray-600">
                          em {new Date(user.quiz_completed_at).toLocaleString('pt-BR')}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card className="border-l-4 border-l-blue-500">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-lg">Contexto Profissional</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm font-medium">
                              {user.quiz_context || 'Não especificado'}
                            </p>
                          </CardContent>
                        </Card>

                        <Card className="border-l-4 border-l-green-500">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-lg">Função/Cargo</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm font-medium">
                              {user.quiz_role || 'Não especificado'}
                            </p>
                          </CardContent>
                        </Card>
                      </div>

                      <Card className="border-l-4 border-l-purple-500">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">Principais Desafios</CardTitle>
                        </CardHeader>
                        <CardContent>
                          {user.quiz_challenges && user.quiz_challenges.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                              {user.quiz_challenges.map((challenge, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {challenge}
                                </Badge>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-gray-500">Nenhum desafio específico mencionado</p>
                          )}
                        </CardContent>
                      </Card>

                      <Card className="bg-gray-50">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            Histórico do Quiz
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Data de Início:</span>
                              <span>{new Date(user.created_at).toLocaleDateString('pt-BR')}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Data de Conclusão:</span>
                              <span>{new Date(user.quiz_completed_at).toLocaleDateString('pt-BR')}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Tempo para Completar:</span>
                              <span>
                                {Math.ceil(
                                  (new Date(user.quiz_completed_at).getTime() - new Date(user.created_at).getTime()) 
                                  / (1000 * 60 * 60 * 24)
                                )} dias
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <div className="flex flex-col items-center space-y-4">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                          <MessageSquare className="h-8 w-8 text-gray-400" />
                        </div>
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">Quiz não completado</h3>
                          <p className="text-sm text-gray-500 mt-1">
                            Este usuário ainda não completou o quiz de onboarding
                          </p>
                        </div>
                        <Badge variant="outline" className="bg-yellow-50 text-yellow-800 border-yellow-200">
                          Pendente
                        </Badge>
                      </div>
                    </div>
                  )}
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
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="border-l-4 border-l-blue-500">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <MessageSquare className="h-4 w-4" />
                          Mensagens
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600 mb-3">
                          Resetar contador de mensagens do usuário para o mês atual
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleResetMessages}
                          className="w-full"
                        >
                          Resetar Mensagens
                        </Button>
                      </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-green-500">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <CreditCard className="h-4 w-4" />
                          Créditos
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600 mb-3">
                          Adicionar 1 crédito de projeto para o usuário
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleAddCredit}
                          className="w-full"
                        >
                          Adicionar Crédito
                        </Button>
                      </CardContent>
                    </Card>
                  </div>

                  <Separator />

                  <Card className="border-2 border-red-200 bg-red-50">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg text-red-800 flex items-center gap-2">
                        <Trash2 className="h-4 w-4" />
                        Zona de Perigo
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-red-700 mb-4">
                        <strong>Atenção:</strong> Esta ação não pode ser desfeita. 
                        Todos os dados do usuário serão permanentemente removidos.
                      </p>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={handleDeleteUser}
                        className="w-full"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Excluir Usuário Permanentemente
                      </Button>
                    </CardContent>
                  </Card>
                </CardContent>
              </Card>
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};