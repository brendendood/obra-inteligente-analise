import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { detectUserByIP, getWelcomeMessage } from '@/utils/ipDetection';
import { validateEmail, formatAuthError } from '@/utils/authValidation';
import { SignInPage, type Testimonial } from '@/components/ui/sign-in';
import { useSocialAuth } from '@/hooks/useSocialAuth';
import { ArrowLeft } from 'lucide-react';
import { StarBorder } from '@/components/ui/star-border';

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
  const [welcomeMessage, setWelcomeMessage] = useState('Faça login para continuar');
  
  const { toast } = useToast();
  const navigate = useNavigate();
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
    console.log('Reset password clicked');
  };

  const handleCreateAccount = () => {
    navigate('/cadastro');
  };

  return (
    <div className="bg-background text-foreground relative">
      <StarBorder
        onClick={() => navigate(-1)}
        className="absolute top-4 left-4 z-10 flex items-center gap-2 px-3 py-2 rounded-[12px] text-sm"
      >
        <ArrowLeft size={16} />
        Voltar
      </StarBorder>
      <SignInPage
        title={<span className="font-light tracking-tighter">Bem-vindo</span>}
        description="Acesse sua conta para continuar sua jornada com a MadeAI."
        heroImageSrc="https://images.unsplash.com/photo-1642615835477-d303d7dc9ee9?w=2160&q=80"
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