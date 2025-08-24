import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { detectUserByIP, getWelcomeMessage } from '@/utils/ipDetection';
import { validateEmail, formatAuthError } from '@/utils/authValidation';
import { ForgotPasswordModal } from '@/components/auth/ForgotPasswordModal';
import { SignInPage } from '@/components/ui/sign-in';
import { useSocialAuth } from '@/hooks/useSocialAuth';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [welcomeMessage, setWelcomeMessage] = useState('Faça login para continuar');
  
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { signInWithGoogle } = useSocialAuth();

  useEffect(() => {
    const setupWelcomeMessage = async () => {
      const ipResult = await detectUserByIP();
      setWelcomeMessage(getWelcomeMessage(ipResult));
    };
    
    setupWelcomeMessage();
  }, []);

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

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      toast({
        title: "✅ Login realizado com sucesso!",
        description: "Redirecionando para o painel..."
      });

      // Reset loading state after successful login
      setLoading(false);

    } catch (error: any) {
      console.error('Erro no login:', error);
      
      if (error.message?.includes('Email not confirmed')) {
        toast({
          title: "📧 Email não confirmado",
          description: "Verifique seu email e clique no link de confirmação antes de fazer login.",
          variant: "destructive",
          duration: 6000
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
      setLoading(false);
    }
  };


  const handleResetPassword = () => {
    // Implementar modal de reset de senha
    console.log('Reset password clicked');
  };

  const handleCreateAccount = () => {
    navigate('/cadastro');
  };

  return (
    <SignInPage
      title={
        <span className="font-light text-foreground tracking-tighter">
          {welcomeMessage} <strong className="font-semibold">MadeAI</strong>
        </span>
      }
      description="Acesse sua conta para continuar sua jornada com a MadeAI."
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
  );
}