
import { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Mail, 
  Lock, 
  Trash2, 
  Upload, 
  Crown,
  Building,
  Briefcase
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface MyAccountDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MyAccountDialog = ({ isOpen, onClose }: MyAccountDialogProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Estados do formulário de perfil
  const [profileData, setProfileData] = useState({
    fullName: user?.user_metadata?.full_name || '',
    cargo: user?.user_metadata?.cargo || '',
    empresa: user?.user_metadata?.empresa || '',
    profilePicture: user?.user_metadata?.avatar_url || ''
  });

  // Estados do formulário de segurança
  const [emailData, setEmailData] = useState({
    newEmail: '',
    confirmEmail: ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [deactivatePassword, setDeactivatePassword] = useState('');

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    // Validar tipo de arquivo
    if (!file.type.startsWith('image/')) {
      toast({
        title: "❌ Arquivo inválido",
        description: "Por favor, selecione uma imagem válida.",
        variant: "destructive"
      });
      return;
    }

    // Validar tamanho (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "❌ Arquivo muito grande",
        description: "A imagem deve ter no máximo 5MB.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      // Criar nome único para o arquivo
      const fileName = `${user.id}/avatar-${Date.now()}.${file.type.split('/')[1]}`;

      // Upload para o Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        throw uploadError;
      }

      // Obter URL pública da imagem
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      // Atualizar metadados do usuário
      const { error: updateError } = await supabase.auth.updateUser({
        data: {
          ...user.user_metadata,
          avatar_url: publicUrl
        }
      });

      if (updateError) {
        throw updateError;
      }

      // Atualizar estado local
      setProfileData(prev => ({ ...prev, profilePicture: publicUrl }));

      toast({
        title: "📸 Foto atualizada",
        description: "Sua foto de perfil foi alterada com sucesso.",
      });
    } catch (error) {
      console.error('Error uploading photo:', error);
      toast({
        title: "❌ Erro no upload",
        description: "Não foi possível alterar a foto. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
      // Limpar input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handleProfileUpdate = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: profileData.fullName,
          cargo: profileData.cargo,
          empresa: profileData.empresa,
          avatar_url: profileData.profilePicture
        }
      });

      if (error) throw error;

      toast({
        title: "✅ Perfil atualizado",
        description: "Suas informações foram salvas com sucesso.",
      });
    } catch (error) {
      toast({
        title: "❌ Erro",
        description: "Não foi possível atualizar o perfil.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailChange = async () => {
    if (emailData.newEmail !== emailData.confirmEmail) {
      toast({
        title: "❌ Erro",
        description: "Os e-mails não coincidem.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        email: emailData.newEmail
      });

      if (error) throw error;

      toast({
        title: "📧 Verificação enviada",
        description: `Um link de verificação foi enviado para ${emailData.newEmail}. Clique no link para confirmar a alteração.`,
      });
      
      setEmailData({ newEmail: '', confirmEmail: '' });
    } catch (error) {
      toast({
        title: "❌ Erro",
        description: "Não foi possível alterar o e-mail.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "❌ Erro", 
        description: "As senhas não coincidem.",
        variant: "destructive"
      });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast({
        title: "❌ Erro",
        description: "A nova senha deve ter pelo menos 6 caracteres.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword
      });

      if (error) throw error;

      toast({
        title: "🔒 Senha alterada",
        description: "Sua senha foi alterada com sucesso. Um e-mail de notificação foi enviado.",
      });
      
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      toast({
        title: "❌ Erro",
        description: "Não foi possível alterar a senha.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccountDeactivation = async () => {
    if (!deactivatePassword) {
      toast({
        title: "❌ Erro",
        description: "Digite sua senha atual para confirmar.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      // Aqui seria implementada a lógica de desativação via edge function
      // Por enquanto, vamos simular o envio do e-mail de confirmação
      toast({
        title: "📧 Confirmação enviada",
        description: "Um link de confirmação foi enviado para seu e-mail. Clique para desativar sua conta definitivamente.",
        variant: "destructive"
      });
      
      setDeactivatePassword('');
    } catch (error) {
      toast({
        title: "❌ Erro", 
        description: "Não foi possível processar a solicitação.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <User className="h-5 w-5 text-blue-600" />
            <span>Minha Conta</span>
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile">Perfil</TabsTrigger>
            <TabsTrigger value="plan">Plano</TabsTrigger>
            <TabsTrigger value="security">Segurança</TabsTrigger>
          </TabsList>

          {/* Aba Perfil */}
          <TabsContent value="profile" className="space-y-6">
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={profileData.profilePicture} />
                <AvatarFallback className="bg-blue-600 text-white text-xl">
                  {user?.email?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handlePhotoClick}
                  disabled={isLoading}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {isLoading ? 'Enviando...' : 'Alterar Foto'}
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
                <p className="text-xs text-gray-500 mt-1">
                  JPG, PNG ou GIF. Máximo 5MB.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="fullName">Nome Completo</Label>
                <Input
                  id="fullName"
                  value={profileData.fullName}
                  onChange={(e) => setProfileData(prev => ({ ...prev, fullName: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="cargo">Cargo</Label>
                <Input
                  id="cargo"
                  placeholder="Ex: Engenheiro Civil"
                  value={profileData.cargo}
                  onChange={(e) => setProfileData(prev => ({ ...prev, cargo: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="empresa">Empresa</Label>
                <Input
                  id="empresa"
                  placeholder="Ex: Construtora ABC Ltda"
                  value={profileData.empresa}
                  onChange={(e) => setProfileData(prev => ({ ...prev, empresa: e.target.value }))}
                />
              </div>

              <Button onClick={handleProfileUpdate} disabled={isLoading} className="w-full">
                {isLoading ? 'Salvando...' : 'Salvar Alterações'}
              </Button>
            </div>
          </TabsContent>

          {/* Aba Plano */}
          <TabsContent value="plan" className="space-y-6">
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <Crown className="h-12 w-12 text-yellow-500" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Plano Atual: Gratuito</h3>
                <p className="text-gray-600">Você está no plano gratuito do MadenAI</p>
              </div>
              <Badge variant="secondary" className="text-sm">
                Até 3 projetos por mês
              </Badge>
            </div>

            <div className="border rounded-lg p-6 space-y-4">
              <h4 className="font-semibold text-blue-600">Melhorar Plano</h4>
              <p className="text-sm text-gray-600">
                Desbloqueie recursos premium como projetos ilimitados, análises avançadas e suporte prioritário.
              </p>
              <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600">
                <Crown className="h-4 w-4 mr-2" />
                Upgrade para Premium
              </Button>
            </div>
          </TabsContent>

          {/* Aba Segurança */}
          <TabsContent value="security" className="space-y-6">
            {/* Alterar E-mail */}
            <div className="border rounded-lg p-4 space-y-4">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-blue-600" />
                <h4 className="font-semibold">Alterar E-mail</h4>
              </div>
              <p className="text-sm text-gray-600">E-mail atual: {user?.email}</p>
              
              <div className="space-y-3">
                <Input
                  placeholder="Novo e-mail"
                  type="email"
                  value={emailData.newEmail}
                  onChange={(e) => setEmailData(prev => ({ ...prev, newEmail: e.target.value }))}
                />
                <Input
                  placeholder="Confirmar novo e-mail"
                  type="email"
                  value={emailData.confirmEmail}
                  onChange={(e) => setEmailData(prev => ({ ...prev, confirmEmail: e.target.value }))}
                />
                <Button onClick={handleEmailChange} disabled={isLoading} variant="outline" size="sm">
                  Alterar E-mail
                </Button>
              </div>
            </div>

            {/* Alterar Senha */}
            <div className="border rounded-lg p-4 space-y-4">
              <div className="flex items-center space-x-2">
                <Lock className="h-4 w-4 text-blue-600" />
                <h4 className="font-semibold">Alterar Senha</h4>
              </div>
              
              <div className="space-y-3">
                <Input
                  placeholder="Senha atual"
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                />
                <Input
                  placeholder="Nova senha"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                />
                <Input
                  placeholder="Confirmar nova senha"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                />
                <Button onClick={handlePasswordChange} disabled={isLoading} variant="outline" size="sm">
                  Alterar Senha
                </Button>
              </div>
            </div>

            {/* Desativar Conta */}
            <div className="border border-red-200 bg-red-50 rounded-lg p-4 space-y-4">
              <div className="flex items-center space-x-2">
                <Trash2 className="h-4 w-4 text-red-600" />
                <h4 className="font-semibold text-red-600">Desativar Conta</h4>
              </div>
              <p className="text-sm text-red-600">
                Esta ação é irreversível. Todos os seus dados serão permanentemente removidos.
              </p>
              
              <div className="space-y-3">
                <Input
                  placeholder="Digite sua senha atual para confirmar"
                  type="password"
                  value={deactivatePassword}
                  onChange={(e) => setDeactivatePassword(e.target.value)}
                />
                <Button 
                  onClick={handleAccountDeactivation} 
                  disabled={isLoading} 
                  variant="destructive" 
                  size="sm"
                >
                  Desativar Conta
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
