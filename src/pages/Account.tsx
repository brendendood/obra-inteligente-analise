
import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Mail, Phone, MapPin, Building, Shield, Bell, Eye, Trash2, Crown, Save } from 'lucide-react';
import { useUserData } from '@/hooks/useUserData';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const Account = () => {
  const { userData, loading, refetch } = useUserData();
  const { user } = useAuth();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    full_name: userData.profile?.full_name || '',
    company: userData.profile?.company || '',
    phone: '',
    city: '',
    state: '',
    country: 'Brasil'
  });

  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    projectAlerts: true,
    marketingEmails: false,
    theme: 'system'
  });

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update(formData)
        .eq('user_id', user?.id);

      if (error) throw error;

      toast({
        title: "✅ Perfil atualizado!",
        description: "Suas informações foram salvas com sucesso.",
      });

      refetch();
    } catch (error) {
      toast({
        title: "❌ Erro ao salvar",
        description: "Não foi possível atualizar seu perfil.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: 'new_password' // Em produção, usar um formulário adequado
      });

      if (error) throw error;

      toast({
        title: "🔐 Senha alterada!",
        description: "Sua senha foi atualizada com sucesso.",
      });
    } catch (error) {
      toast({
        title: "❌ Erro ao alterar senha",
        description: "Não foi possível atualizar sua senha.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.')) {
      try {
        toast({
          title: "⚠️ Funcionalidade em desenvolvimento",
          description: "A exclusão de conta será implementada em breve.",
        });
      } catch (error) {
        toast({
          title: "❌ Erro ao excluir conta",
          description: "Não foi possível excluir sua conta.",
          variant: "destructive"
        });
      }
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">Conta & Preferências</h1>
              <p className="text-slate-600">Gerencie suas informações pessoais e configurações</p>
            </div>
            <div className="text-right">
              <Badge 
                variant={userData.plan === 'basic' ? 'secondary' : 'default'}
                className={`${userData.plan === 'enterprise' ? 'bg-gradient-to-r from-purple-500 to-purple-600' : userData.plan === 'pro' ? 'bg-blue-600' : ''}`}
              >
                <Crown className="h-3 w-3 mr-1" />
                {userData.plan === 'basic' ? 'Basic' : userData.plan === 'pro' ? 'Pro' : 'Enterprise'}
              </Badge>
            </div>
          </div>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile">Perfil</TabsTrigger>
            <TabsTrigger value="security">Segurança</TabsTrigger>
            <TabsTrigger value="preferences">Preferências</TabsTrigger>
          </TabsList>

          {/* Tab Perfil */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Informações Pessoais
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="full_name">Nome Completo</Label>
                      <Input
                        id="full_name"
                        value={formData.full_name}
                        onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                        placeholder="Seu nome completo"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={user?.email || ''}
                        disabled
                        className="bg-gray-50"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Para alterar o email, entre em contato com o suporte
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="phone">Telefone</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        placeholder="(11) 99999-9999"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="company">Empresa</Label>
                      <Input
                        id="company"
                        value={formData.company}
                        onChange={(e) => setFormData({...formData, company: e.target.value})}
                        placeholder="Nome da empresa"
                      />
                    </div>

                    <div>
                      <Label htmlFor="city">Cidade</Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => setFormData({...formData, city: e.target.value})}
                        placeholder="Sua cidade"
                      />
                    </div>

                    <div>
                      <Label htmlFor="state">Estado</Label>
                      <Select value={formData.state} onValueChange={(value) => setFormData({...formData, state: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o estado" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="SP">São Paulo</SelectItem>
                          <SelectItem value="RJ">Rio de Janeiro</SelectItem>
                          <SelectItem value="MG">Minas Gerais</SelectItem>
                          <SelectItem value="RS">Rio Grande do Sul</SelectItem>
                          <SelectItem value="PR">Paraná</SelectItem>
                          <SelectItem value="SC">Santa Catarina</SelectItem>
                          <SelectItem value="BA">Bahia</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t">
                  <Button 
                    onClick={handleSaveProfile}
                    disabled={saving}
                    className="w-full md:w-auto"
                  >
                    {saving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Salvando...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Salvar Alterações
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab Segurança */}
          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Segurança da Conta
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Autenticação de Dois Fatores</h4>
                  <p className="text-sm text-blue-700 mb-3">
                    Adicione uma camada extra de segurança à sua conta
                  </p>
                  <Button variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-100">
                    Configurar 2FA
                  </Button>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="current_password">Senha Atual</Label>
                    <Input
                      id="current_password"
                      type="password"
                      placeholder="Digite sua senha atual"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="new_password">Nova Senha</Label>
                    <Input
                      id="new_password"
                      type="password"
                      placeholder="Digite sua nova senha"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="confirm_password">Confirmar Nova Senha</Label>
                    <Input
                      id="confirm_password"
                      type="password"
                      placeholder="Confirme sua nova senha"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <Button onClick={handleChangePassword} className="mr-4">
                    Alterar Senha
                  </Button>
                  <Button variant="outline">
                    Esqueci minha senha
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-600">
                  <Trash2 className="h-5 w-5" />
                  Zona de Perigo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-red-700">Excluir Conta</h4>
                    <p className="text-sm text-red-600">
                      Esta ação não pode ser desfeita. Todos os seus projetos e dados serão permanentemente removidos.
                    </p>
                  </div>
                  <Button 
                    variant="destructive"
                    onClick={handleDeleteAccount}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Excluir Conta
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab Preferências */}
          <TabsContent value="preferences" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notificações
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="email-notifications">Notificações por Email</Label>
                    <p className="text-sm text-gray-500">Receba atualizações sobre seus projetos</p>
                  </div>
                  <Switch 
                    id="email-notifications"
                    checked={preferences.emailNotifications}
                    onCheckedChange={(checked) => setPreferences({...preferences, emailNotifications: checked})}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="project-alerts">Alertas de Projeto</Label>
                    <p className="text-sm text-gray-500">Notificações sobre conclusão de análises</p>
                  </div>
                  <Switch 
                    id="project-alerts"
                    checked={preferences.projectAlerts}
                    onCheckedChange={(checked) => setPreferences({...preferences, projectAlerts: checked})}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="marketing-emails">Emails de Marketing</Label>
                    <p className="text-sm text-gray-500">Receba dicas, novidades e promoções</p>
                  </div>
                  <Switch 
                    id="marketing-emails"
                    checked={preferences.marketingEmails}
                    onCheckedChange={(checked) => setPreferences({...preferences, marketingEmails: checked})}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Aparência
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="theme">Tema</Label>
                    <Select value={preferences.theme} onValueChange={(value) => setPreferences({...preferences, theme: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tema" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Claro</SelectItem>
                        <SelectItem value="dark">Escuro</SelectItem>
                        <SelectItem value="system">Sistema</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Account;
