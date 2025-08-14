import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { validateEmail } from '@/utils/authValidation';

interface ForgotPasswordModalProps {
  children: React.ReactNode;
}

export function ForgotPasswordModal({ children }: ForgotPasswordModalProps) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const trimmedEmail = email.trim().toLowerCase();
    console.log('🔍 Reset password attempt for:', { originalEmail: email, trimmedEmail });
    
    if (!validateEmail(trimmedEmail)) {
      console.log('❌ Email validation failed for reset password');
      toast({
        title: "Email inválido",
        description: "Por favor, insira um email válido (exemplo: usuario@dominio.com).",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      console.log('🚀 Sending reset password email to:', trimmedEmail);
      
      // Usar sistema de email personalizado
      const { error } = await supabase.functions.invoke('send-custom-emails', {
        body: {
          email_type: 'password_reset',
          recipient_email: trimmedEmail,
          user_data: {
            full_name: 'Usuário'
          },
          reset_data: {
            reset_url: `${window.location.origin}/reset-password?email=${encodeURIComponent(trimmedEmail)}`
          }
        }
      });

      if (error) {
        console.error('❌ Custom email system error:', error);
        throw error;
      }

      console.log('✅ Reset password email sent via custom system');
      
      toast({
        title: "Email enviado!",
        description: `Instruções enviadas para ${trimmedEmail}. Verifique sua caixa de entrada e spam.`,
      });

      setOpen(false);
      setEmail('');
    } catch (error: any) {
      console.error('❌ Erro ao solicitar reset de senha:', error);
      toast({
        title: "Erro ao enviar email",
        description: error.message || "Não foi possível enviar o email de recuperação. Tente novamente em alguns minutos.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Recuperar Senha</DialogTitle>
          <DialogDescription>
            Digite seu email para receber as instruções de recuperação de senha.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="reset-email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                id="reset-email"
                type="text"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value.trim())}
                className="pl-10"
                disabled={loading}
              />
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1"
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={loading}
            >
              {loading ? 'Enviando...' : 'Enviar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}