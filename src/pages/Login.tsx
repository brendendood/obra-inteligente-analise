import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { detectUserByIP, getWelcomeMessage } from '@/utils/ipDetection';
import { validateEmail, formatAuthError } from '@/facades/core';
import { SignInPage, type Testimonial } from '@/components/ui/sign-in';
import { useSocialAuth } from '@/hooks/useSocialAuth';
import { ArrowLeft, Mail } from 'lucide-react';
import { AppleButton } from '@/components/ui/apple-button';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import loginBackground from '@/assets/login-background.jpeg';

const testimonials: Testimonial[] = [
  {
    avatarSrc: "https://randomuser.me/api/portraits/women/57.jpg",
    name: "Ana Souza",
    handle: "@ana.madeai",
    text: "A MadeAI simplificou nosso onboarding e acelerou o dia a dia do time. Design limpo e fluxo intuitivo."
  },
  {
    avatarSrc: "https://randomuser.me/api/portraits/men/64.jpg",
    name: "Bruno Almeida",
    handle: "@bruno.data",
    text: "Excelente experiência! Login rápido, recursos claros e tudo funcionando muito bem no desktop e mobile."
  },
  {
    avatarSrc: "https://randomuser.me/api/portraits/men/32.jpg",
    name: "Diego Martins",
    handle: "@diegomartins",
    text: "O acesso é estável e o visual é moderno. A MadeAI acertou em cheio no fluxo de autenticação."
  },
];

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [authCheckLoading, setAuthCheckLoading] = useState(true);
  const [welcomeMessage, setWelcomeMessage] = useState('Faça login para continuar');
  const [showEmailNotConfirmed, setShowEmailNotConfirmed] = useState(false);
  const [resendEmail, setResendEmail] = useState('');
  const [resendLoading, setResendLoading] = useState(false);
  
  const { toast } = useToast();
  const navigate = useNavigate();
  const { signIn, isAuthenticated, user } = useAuth();
  const { signInWithGoogle } = useSocialAuth();
  const abortControllerRef = useRef<AbortController | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Importar telemetria do módulo centralizado
  const { logAuthEvent } = (() => {
    try {
      return require('@/observability/telemetry');
    } catch {
      // Fallback caso o módulo não esteja disponível
      return {
        logAuthEvent: (event: string, details?: any) => {
          console.log(`📊 AUTH_EVENT: ${event}`, details);
        }
      };
    }
  })();

  useEffect(() => {
    const setupWelcomeMessage = async () => {
      const ipResult = await detectUserByIP();
      setWelcomeMessage(getWelcomeMessage(ipResult));
    };
    
    setupWelcomeMessage();
  }, []);

  // Guardas de sessão com timeout duro
  useEffect(() => {
    const checkAuthState = async () => {
      logAuthEvent('auth_check_start');
      
      // Cancelar verificação anterior se existir
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      
      abortControllerRef.current = new AbortController();
      
      // Timeout duro de 5s
      timeoutRef.current = setTimeout(() => {
        logAuthEvent('auth_check_timeout');
        setAuthCheckLoading(false);
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }
      }, 5000);

      try {
        // Se já estiver autenticado, verificar plano antes de redirecionar
        if (isAuthenticated && user) {
          logAuthEvent('auth_check_success', { user: user.email });
          clearTimeout(timeoutRef.current);
          
          // Verificar se usuário tem plano
          try {
            const { data: userData, error } = await supabase
              .from('users')
              .select('plan_code')
              .eq('id', user.id)
              .single();
            
            if (error || !userData?.plan_code) {
              navigate('/pricing-blocked');
            } else {
              navigate('/painel');
            }
          } catch (error) {
            console.error('Error checking user plan:', error);
            navigate('/pricing-blocked');
          }
          return;
        }

        // Verificar sessão atual
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (abortControllerRef.current?.signal.aborted) return;
        
        if (error) {
          logAuthEvent('auth_check_error', { error: error.message });
        } else if (session?.user) {
          logAuthEvent('auth_check_success', { user: session.user.email });
          
          // Verificar se usuário tem plano
          try {
            const { data: userData, error } = await supabase
              .from('users')
              .select('plan_code')
              .eq('id', session.user.id)
              .single();
            
            if (error || !userData?.plan_code) {
              navigate('/pricing-blocked');
            } else {
              navigate('/painel');
            }
          } catch (error) {
            console.error('Error checking user plan:', error);
            navigate('/pricing-blocked');
          }
          return;
        }
        
        logAuthEvent('auth_check_success', { authenticated: false });
        
      } catch (error: any) {
        if (error.name !== 'AbortError') {
          logAuthEvent('auth_check_error', { error: error.message });
        }
      } finally {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        setAuthCheckLoading(false);
      }
    };

    checkAuthState();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateEmail(email)) {
      toast({
        title: "❌ Email inválido",
        description: "Por favor, insira um email válido.",
        variant: "destructive"
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "❌ Senha muito curta",
        description: "A senha deve ter pelo menos 6 caracteres.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    setShowEmailNotConfirmed(false);

    try {
      const { error } = await signIn(email, password, rememberMe);

      if (error) {
        throw error;
      }

      toast({
        title: "✅ Login realizado com sucesso!",
        description: rememberMe ? "Você permanecerá conectado neste dispositivo." : "Redirecionando para o painel..."
      });

    } catch (error: any) {
      console.error('Erro no login:', error);
      
      if (error.message?.includes('Email not confirmed') || 
          error.message?.includes('email_not_confirmed')) {
        setShowEmailNotConfirmed(true);
        setResendEmail(email);
        toast({
          title: "📧 Email não confirmado",
          description: "Confirme seu email primeiro. Use o botão abaixo para reenviar o link de confirmação.",
          variant: "destructive",
          duration: 8000
        });
      } else if (error.message?.includes('Invalid login credentials')) {
        toast({
          title: "❌ Credenciais inválidas",
          description: "Email ou senha incorretos. Verifique e tente novamente.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "❌ Erro no login",
          description: formatAuthError(error),
          variant: "destructive"
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendConfirmation = async () => {
    if (!validateEmail(resendEmail)) {
      toast({
        title: "❌ Email inválido",
        description: "Por favor, digite um email válido.",
        variant: "destructive"
      });
      return;
    }

    setResendLoading(true);
    
    try {
      const { error } = await supabase.auth.resend({ 
        type: 'signup', 
        email: resendEmail.trim(),
        options: { 
          emailRedirectTo: 'https://madeai.com.br/cadastro/confirmado' 
        } 
      });
      
      if (error) {
        toast({
          title: "❌ Erro",
          description: error.message,
          variant: "destructive"
        });
      } else {
        toast({
          title: "📧 Email reenviado com sucesso!",
          description: "Verifique sua caixa de entrada e clique no link de confirmação.",
        });
        setShowEmailNotConfirmed(false);
      }
    } catch (err: any) {
      toast({
        title: "❌ Erro",
        description: "Erro ao reenviar email. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setResendLoading(false);
    }
  };

  const handleResetPassword = () => {
    console.log('Reset password clicked');
  };

  const handleCreateAccount = () => {
    navigate('/cadastro');
  };

  // Se ainda está verificando autenticação com timeout duro
  if (authCheckLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-sm text-muted-foreground">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background text-foreground relative">
      <AppleButton
        onClick={() => navigate(-1)}
        variant="ghost"
        size="sm"
        className="absolute top-4 left-4 z-10 flex items-center gap-2"
        aria-label="Voltar à página anterior"
      >
        <ArrowLeft size={16} />
        Voltar
      </AppleButton>

      {/* Banner de email não confirmado */}
      {showEmailNotConfirmed && (
        <div className="fixed top-0 left-0 right-0 z-50 p-4">
          <Alert className="bg-yellow-50 border-yellow-200 dark:bg-yellow-950 dark:border-yellow-800">
            <Mail className="h-4 w-4" />
            <AlertDescription className="space-y-3">
              <div>
                <strong>Email não confirmado</strong>
                <p className="text-sm">Você precisa confirmar seu email antes de fazer login.</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <Input
                  type="email"
                  placeholder="Digite seu email"
                  value={resendEmail}
                  onChange={(e) => setResendEmail(e.target.value)}
                  className="flex-1"
                />
                <Button
                  onClick={handleResendConfirmation}
                  disabled={resendLoading}
                  size="sm"
                >
                  {resendLoading ? 'Enviando...' : 'Reenviar Confirmação'}
                </Button>
                <Button
                  onClick={() => setShowEmailNotConfirmed(false)}
                  variant="outline"
                  size="sm"
                >
                  Fechar
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        </div>
      )}

      <SignInPage
        title={<span className="font-light tracking-tighter">Bem-vindo</span>}
        description="Acesse sua conta para continuar sua jornada com a MadeAI."
        heroImageSrc={loginBackground}
        testimonials={testimonials}
        onSignIn={handleSubmit}
        onGoogleSignIn={signInWithGoogle}
        onResetPassword={handleResetPassword}
        onCreateAccount={handleCreateAccount}
        loading={loading}
        email={email}
        password={password}
        onEmailChange={setEmail}
        onPasswordChange={setPassword}
        rememberMe={rememberMe}
        onRememberMeChange={setRememberMe}
      />
    </div>
  );
}