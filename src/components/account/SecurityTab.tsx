
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Lock, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useEmailSystem } from '@/hooks/useEmailSystem';
import { useNavigate } from 'react-router-dom';

interface SecurityTabProps {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export const SecurityTab = ({ isLoading, setIsLoading }: SecurityTabProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { sendAccountCancelledEmail } = useEmailSystem();
  
  const [emailData, setEmailData] = useState({
    newEmail: '',
    confirmEmail: ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Substitui a confirmação por senha por confirmação textual "DESATIVAR"
  const [deactivationConfirm, setDeactivationConfirm] = useState('');

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
    const { supabase } = await import('@/integrations/supabase/client');
    
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
    const { supabase } = await import('@/integrations/supabase/client');
    
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
    // Exigir confirmação exata "DESATIVAR"
    if (deactivationConfirm.trim() !== 'DESATIVAR') {
      toast({
        title: "❌ Erro",
        description: 'Para desativar sua conta, digite exatamente "DESATIVAR".',
        variant: "destructive"
      });
      return;
    }

    if (!user?.id || !user?.email) {
      toast({
        title: "❌ Erro",
        description: "Usuário não autenticado.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    const { supabase } = await import('@/integrations/supabase/client');

    try {
      console.log('🔻 Desativando conta para user_id:', user.id);

      // 1) Atualiza o perfil como desativado
      const { error: updateError } = await supabase
        .from('user_profiles')
        .update({
          is_active: false,
          deactivated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);

      if (updateError) {
        console.error('❌ Erro ao atualizar perfil:', updateError);
        throw updateError;
      }

      // 2) Envia email "account_deactivated"
      console.log('📧 Enviando email de conta desativada para:', user.email);
      const fullName =
        (user.user_metadata && (user.user_metadata.full_name as string)) || 'Usuário';
      const emailResult = await sendAccountCancelledEmail(user.email, fullName);

      if (!emailResult?.success) {
        console.warn('⚠️ Falha ao enviar email de desativação:', emailResult?.error);
      }

      // 3) Feedback ao usuário
      toast({
        title: "✅ Conta desativada",
        description: "Sua conta foi desativada e um e-mail de confirmação foi enviado.",
        variant: "destructive"
      });

      // 4) Logout e redirecionamento
      await supabase.auth.signOut();
      setDeactivationConfirm('');
      // Pequeno delay para evitar corrida de estado de auth
      setTimeout(() => {
        navigate('/login');
      }, 300);
    } catch (error) {
      console.error('💥 Erro na desativação de conta:', error);
      toast({
        title: "❌ Erro",
        description: "Não foi possível desativar a conta. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
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
          <Label htmlFor="deact-confirm" className="text-red-700">
            Para confirmar, digite: DESATIVAR
          </Label>
          <Input
            id="deact-confirm"
            placeholder="Digite DESATIVAR para confirmar"
            type="text"
            value={deactivationConfirm}
            onChange={(e) => setDeactivationConfirm(e.target.value)}
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
    </div>
  );
};
