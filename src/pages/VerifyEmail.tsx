import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CheckCircle, Mail, ArrowRight } from 'lucide-react';
import { Logo } from '@/components/ui/logo';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [resendLoading, setResendLoading] = useState(false);
  const [resendEmail, setResendEmail] = useState('');
  
  // Pegar email dos parâmetros URL ou do estado
  const userEmail = searchParams.get('email') || 'seu e-mail';

  const handleResendEmail = async () => {
    const emailToUse = resendEmail.trim() || userEmail;
    
    if (!emailToUse || emailToUse === 'seu e-mail') {
      toast({
        title: "❌ Erro",
        description: "Por favor, digite seu e-mail.",
        variant: "destructive"
      });
      return;
    }

    setResendLoading(true);
    
    try {
      const { error } = await supabase.auth.resend({ 
        type: 'signup', 
        email: emailToUse,
        options: { 
          emailRedirectTo: `${window.location.origin}/cadastro/confirmado`
        } 
      });
      
      if (error) {
        toast({
          title: "❌ Erro ao reenviar",
          description: error.message,
          variant: "destructive"
        });
      } else {
        toast({
          title: "✅ E-mail reenviado!",
          description: "Verifique sua caixa de entrada e spam.",
        });
        setResendEmail('');
      }
    } catch (err: any) {
      toast({
        title: "❌ Erro",
        description: "Erro ao reenviar e-mail. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header com Logo */}
      <div className="border-b">
        <div className="container mx-auto px-4 py-4">
          <Logo width={120} height={36} />
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Título Principal */}
          <div className="text-center space-y-4">
            <div className="flex justify-center mb-6">
              <div className="bg-primary/10 p-4 rounded-full">
                <Mail className="w-12 h-12 text-primary" />
              </div>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              Confirme seu email e comece a usar a MadeAI
            </h1>
            
            <p className="text-lg text-muted-foreground">
              Enviamos um email para <strong className="text-foreground">{userEmail}</strong>
            </p>
          </div>

          {/* Next Steps Card */}
          <Card className="border-2">
            <CardContent className="p-8 space-y-6">
              <h2 className="text-2xl font-bold text-foreground">
                Próximos passos
              </h2>

              {/* Step 1 */}
              <div className="space-y-3">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-bold">1</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-foreground mb-1">
                      Verifique sua conta
                    </h3>
                    <p className="text-muted-foreground">
                      Clique no link no email para verificar sua conta.
                    </p>
                  </div>
                  <CheckCircle className="w-6 h-6 text-muted-foreground" />
                </div>
              </div>

              {/* Divider */}
              <div className="border-t" />

              {/* Step 2 */}
              <div className="space-y-3">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-bold">2</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-foreground mb-1">
                      Comece a usar a MadeAI
                    </h3>
                    <p className="text-muted-foreground">
                      Complete seu perfil e explore as funcionalidades da plataforma.
                    </p>
                  </div>
                  <ArrowRight className="w-6 h-6 text-muted-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Reenviar Email Section */}
          <Card className="bg-muted/30">
            <CardContent className="p-6 space-y-4">
              <h3 className="font-semibold text-foreground">
                Não recebeu o email?
              </h3>
              <p className="text-sm text-muted-foreground">
                Verifique sua pasta de spam ou solicite um novo link de confirmação.
              </p>
              <div className="flex gap-3">
                <Input
                  type="email"
                  placeholder="Digite seu e-mail"
                  value={resendEmail}
                  onChange={(e) => setResendEmail(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleResendEmail()}
                  className="flex-1"
                />
                <Button 
                  onClick={handleResendEmail}
                  disabled={resendLoading}
                >
                  {resendLoading ? 'Enviando...' : 'Reenviar'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Footer Links */}
          <div className="flex justify-center gap-6 text-sm text-muted-foreground pt-8 border-t">
            <button
              onClick={() => navigate('/login')}
              className="hover:text-foreground transition-colors"
            >
              Já tenho conta
            </button>
            <span>•</span>
            <button
              onClick={() => navigate('/termos')}
              className="hover:text-foreground transition-colors"
            >
              Termos de Uso
            </button>
            <span>•</span>
            <button
              onClick={() => navigate('/politica')}
              className="hover:text-foreground transition-colors"
            >
              Política de Privacidade
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
