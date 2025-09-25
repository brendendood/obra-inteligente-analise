
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, MessageCircle, Lock } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface SecurityTabProps {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export const SecurityTab = ({ isLoading, setIsLoading }: SecurityTabProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [passwordResetLoading, setPasswordResetLoading] = useState(false);

  const handleWhatsAppContact = () => {
    const message = encodeURIComponent(
      `Olá! Preciso alterar meu e-mail da conta MadenAI.\n\nE-mail atual: ${user?.email}\nNovo e-mail: \n\nObrigado!`
    );
    window.open(`https://wa.me/5511999999999?text=${message}`, '_blank');
  };

  const handlePasswordReset = async () => {
    if (!user?.email) {
      toast({
        title: "Erro",
        description: "Email do usuário não encontrado.",
        variant: "destructive"
      });
      return;
    }

    setPasswordResetLoading(true);

    try {
      const resetUrl = `${window.location.origin}/reset-password?email=${encodeURIComponent(user.email)}&token=${Date.now()}`;

      const { error: emailError } = await supabase.functions.invoke('send-reset-password-email', {
        body: {
          email: user.email,
          resetUrl: resetUrl
        }
      });

      if (emailError) {
        console.error('❌ Edge Function error:', emailError);
        throw emailError;
      }

      toast({
        title: "Email enviado!",
        description: `Instruções para alterar a senha enviadas para ${user.email}. Verifique sua caixa de entrada e spam.`,
      });

    } catch (error: any) {
      console.error('❌ Erro ao solicitar reset de senha:', error);
      toast({
        title: "Erro ao enviar email",
        description: "Não foi possível enviar o email de recuperação. Tente novamente em alguns minutos.",
        variant: "destructive"
      });
    } finally {
      setPasswordResetLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Alterar E-mail */}
      <div className="border rounded-lg p-6 space-y-4">
        <div className="flex items-center space-x-2">
          <Mail className="h-5 w-5 text-blue-600" />
          <h4 className="font-semibold text-lg">Alterar E-mail</h4>
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-slate-600 mb-2">
            <strong>E-mail atual:</strong> {user?.email}
          </p>
          <p className="text-slate-700 mb-4">
            Precisa alterar seu e-mail? Sem problemas! 😊
          </p>
          <p className="text-slate-600 text-sm mb-4">
            Nossa equipe resolve isso super rapidinho - em menos de 10 minutinhas você já terá seu novo e-mail configurado!
          </p>
        </div>

        <Button 
          onClick={handleWhatsAppContact}
          className="w-full bg-green-600 hover:bg-green-700 text-white"
          size="lg"
        >
          <MessageCircle className="h-4 w-4 mr-2" />
          Falar com Suporte no WhatsApp
        </Button>
        
        <p className="text-xs text-center text-slate-500">
          Clique no botão acima e nossa equipe te ajudará com carinho! 💚
        </p>
      </div>

      {/* Alterar Senha */}
      <div className="border rounded-lg p-6 space-y-4">
        <div className="flex items-center space-x-2">
          <Lock className="h-5 w-5 text-orange-600" />
          <h4 className="font-semibold text-lg">Alterar Senha</h4>
        </div>
        
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <p className="text-slate-700 mb-4">
            Quer trocar sua senha? Vamos te enviar um link seguro por email! 🔐
          </p>
          <p className="text-slate-600 text-sm mb-4">
            Você receberá um email com instruções para criar sua nova senha de forma segura.
          </p>
        </div>

        <Button 
          onClick={handlePasswordReset}
          className="w-full bg-orange-600 hover:bg-orange-700 text-white"
          size="lg"
          disabled={passwordResetLoading}
        >
          <Lock className="h-4 w-4 mr-2" />
          {passwordResetLoading ? 'Enviando...' : 'Enviar Link para Alterar Senha'}
        </Button>
        
        <p className="text-xs text-center text-slate-500">
          Você receberá o link no email: {user?.email}
        </p>
      </div>
    </div>
  );
};
