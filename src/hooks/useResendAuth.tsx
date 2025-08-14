import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SignupData {
  email: string;
  password: string;
  fullName: string;
}

export function useResendAuth() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const signUpWithResend = async ({ email, password, fullName }: SignupData) => {
    setLoading(true);
    try {
      console.log('🔐 RESEND-AUTH: Iniciando cadastro para:', email);

      // 1. Criar usuário no Supabase (sem confirmação automática)
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/painel`,
          data: {
            full_name: fullName.trim()
          }
        }
      });

      if (authError) {
        console.error('❌ RESEND-AUTH: Erro no signup:', authError);
        throw authError;
      }

      if (!authData.user) {
        throw new Error('Usuário não foi criado');
      }

      console.log('✅ RESEND-AUTH: Usuário criado no Supabase:', authData.user.id);

      // 2. Gerar token de verificação personalizado
      const verificationToken = btoa(`${email}:${authData.user.id}:verify`).replace(/[+/=]/g, '');

      // 3. Enviar email de verificação via Resend
      const { data: emailData, error: emailError } = await supabase.functions.invoke('resend-signup-verification', {
        body: {
          email: email.trim(),
          full_name: fullName.trim(),
          verification_token: verificationToken
        }
      });

      if (emailError) {
        console.error('❌ RESEND-AUTH: Erro ao enviar email:', emailError);
        throw emailError;
      }

      console.log('✅ RESEND-AUTH: Email de verificação enviado:', emailData);

      // 4. Fazer logout automático (usuário deve verificar email primeiro)
      await supabase.auth.signOut();

      toast({
        title: "📧 Verifique seu email",
        description: "Enviamos um link de verificação para seu email. Clique no link para ativar sua conta.",
        duration: 8000,
      });

      return { success: true, user: authData.user };

    } catch (error: any) {
      console.error('❌ RESEND-AUTH: Erro geral:', error);
      
      let errorMessage = 'Erro inesperado no cadastro';
      
      if (error.message?.includes('User already registered')) {
        errorMessage = 'Este email já está cadastrado. Tente fazer login.';
      } else if (error.message?.includes('email rate limit')) {
        errorMessage = 'Muitas tentativas. Aguarde alguns minutos e tente novamente.';
      } else if (error.message?.includes('Password')) {
        errorMessage = 'Senha deve ter pelo menos 6 caracteres.';
      }

      toast({
        title: "❌ Erro no cadastro",
        description: errorMessage,
        variant: "destructive"
      });

      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const verifyEmailToken = async (token: string, email: string) => {
    setLoading(true);
    try {
      console.log('🔍 RESEND-AUTH: Verificando token para:', email);

      const { data, error } = await supabase.functions.invoke('verify-email-token', {
        body: { token, email }
      });

      if (error) {
        console.error('❌ RESEND-AUTH: Erro na verificação:', error);
        throw error;
      }

      console.log('✅ RESEND-AUTH: Token verificado:', data);

      if (data.already_verified) {
        toast({
          title: "✅ Email já verificado",
          description: "Sua conta já foi ativada. Você pode fazer login normalmente.",
        });
      } else {
        toast({
          title: "🎉 Email verificado!",
          description: "Sua conta foi ativada com sucesso. Agora você pode fazer login.",
        });
      }

      return { success: true, data };

    } catch (error: any) {
      console.error('❌ RESEND-AUTH: Erro na verificação:', error);
      
      let errorMessage = 'Token inválido ou expirado';
      
      if (error.message?.includes('não encontrado')) {
        errorMessage = 'Usuário não encontrado';
      }

      toast({
        title: "❌ Erro na verificação",
        description: errorMessage,
        variant: "destructive"
      });

      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const resendVerificationEmail = async (email: string) => {
    setLoading(true);
    try {
      console.log('📧 RESEND-AUTH: Reenviando email para:', email);

      // Buscar usuário existente pelo email
      const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();

      if (listError) {
        throw new Error('Erro ao buscar usuários');
      }

      // Filtrar usuário pelo email
      const user = users?.find((u: any) => u.email === email);
      
      if (!user) {
        throw new Error('Usuário não encontrado');
      }
      
      if (user.email_confirmed_at) {
        toast({
          title: "ℹ️ Email já verificado",
          description: "Sua conta já está ativa. Tente fazer login.",
        });
        return { success: true, already_verified: true };
      }

      // Gerar novo token
      const verificationToken = btoa(`${email}:${user.id}:verify`).replace(/[+/=]/g, '');

      // Reenviar email
      const { data, error } = await supabase.functions.invoke('resend-signup-verification', {
        body: {
          email,
          full_name: user.user_metadata?.full_name || 'Usuário',
          verification_token: verificationToken
        }
      });

      if (error) throw error;

      toast({
        title: "📧 Email reenviado",
        description: "Novo link de verificação enviado. Verifique sua caixa de entrada.",
      });

      return { success: true, data };

    } catch (error: any) {
      console.error('❌ RESEND-AUTH: Erro ao reenviar:', error);
      
      toast({
        title: "❌ Erro ao reenviar",
        description: error.message || 'Erro inesperado',
        variant: "destructive"
      });

      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  return {
    signUpWithResend,
    verifyEmailToken,
    resendVerificationEmail,
    loading
  };
}