import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export function useEmailSystem() {
  const { user } = useAuth();
  const { toast } = useToast();

  const sendWelcomeEmail = async (userEmail: string, userName?: string) => {
    try {
      console.log('📧 EMAIL-SYSTEM: Enviando email de boas-vindas para', userEmail);
      
      const { data, error } = await supabase.functions.invoke('send-custom-emails', {
        body: {
          email_type: 'welcome',
          recipient_email: userEmail,
          user_data: {
            full_name: userName || 'Usuário',
            user_id: user?.id
          }
        }
      });

      if (error) throw error;
      
      console.log('✅ EMAIL-SYSTEM: Email de boas-vindas enviado:', data);
      return { success: true, data };
    } catch (error: any) {
      console.error('❌ EMAIL-SYSTEM: Erro ao enviar email de boas-vindas:', error);
      return { success: false, error: error.message };
    }
  };

  const sendPasswordResetEmail = async (userEmail: string, resetUrl: string, userName?: string) => {
    try {
      console.log('📧 EMAIL-SYSTEM: Enviando email de reset de senha para', userEmail);
      
      const { data, error } = await supabase.functions.invoke('send-custom-emails', {
        body: {
          email_type: 'password_reset',
          recipient_email: userEmail,
          user_data: {
            full_name: userName || 'Usuário',
            user_id: user?.id
          },
          reset_data: {
            reset_url: resetUrl
          }
        }
      });

      if (error) throw error;
      
      console.log('✅ EMAIL-SYSTEM: Email de reset enviado:', data);
      return { success: true, data };
    } catch (error: any) {
      console.error('❌ EMAIL-SYSTEM: Erro ao enviar email de reset:', error);
      return { success: false, error: error.message };
    }
  };

  const sendProjectMilestoneEmail = async (userEmail: string, projectCount: number, userName?: string) => {
    try {
      console.log('📧 EMAIL-SYSTEM: Enviando email de marco de projetos para', userEmail);
      
      const { data, error } = await supabase.functions.invoke('send-custom-emails', {
        body: {
          email_type: 'project_milestone',
          recipient_email: userEmail,
          user_data: {
            full_name: userName || 'Usuário',
            project_count: projectCount,
            user_id: user?.id
          }
        }
      });

      if (error) throw error;
      
      console.log('✅ EMAIL-SYSTEM: Email de marco enviado:', data);
      
      // Mostrar toast de sucesso
      toast({
        title: "🎉 Parabéns!",
        description: `Você completou ${projectCount} projetos! Verifique seu email.`,
      });
      
      return { success: true, data };
    } catch (error: any) {
      console.error('❌ EMAIL-SYSTEM: Erro ao enviar email de marco:', error);
      return { success: false, error: error.message };
    }
  };

  const sendAccountCancelledEmail = async (userEmail: string, userName?: string) => {
    try {
      console.log('📧 EMAIL-SYSTEM: Enviando email de conta cancelada para', userEmail);
      
      const { data, error } = await supabase.functions.invoke('send-custom-emails', {
        body: {
          email_type: 'account_cancelled',
          recipient_email: userEmail,
          user_data: {
            full_name: userName || 'Usuário',
            user_id: user?.id
          }
        }
      });

      if (error) throw error;
      
      console.log('✅ EMAIL-SYSTEM: Email de cancelamento enviado:', data);
      return { success: true, data };
    } catch (error: any) {
      console.error('❌ EMAIL-SYSTEM: Erro ao enviar email de cancelamento:', error);
      return { success: false, error: error.message };
    }
  };

  return {
    sendWelcomeEmail,
    sendPasswordResetEmail,
    sendProjectMilestoneEmail,
    sendAccountCancelledEmail
  };
}