import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Send } from 'lucide-react';
import { UnifiedLogo } from '@/components/ui/UnifiedLogo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { detectUserByIP, getWelcomeMessage } from '@/utils/ipDetection';
import { validateEmail, formatAuthError } from '@/utils/authValidation';
import { ForgotPasswordModal } from '@/components/auth/ForgotPasswordModal';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resendingEmail, setResendingEmail] = useState(false);
  const [showResendButton, setShowResendButton] = useState(false);
  const [welcomeMessage, setWelcomeMessage] = useState('Faça login para continuar');
  
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Verificar mensagens de verificação de email
    const verified = searchParams.get('verified');
    const error = searchParams.get('error');
    const message = searchParams.get('message');

    if (verified === 'true') {
      toast({
        title: "✅ Email verificado!",
        description: message || "Seu email foi verificado com sucesso! Agora você pode fazer login.",
        duration: 7000,
      });
    } else if (error) {
      toast({
        title: "❌ Erro na verificação",
        description: decodeURIComponent(error),
        variant: "destructive",
        duration: 7000,
      });
    }

    const setupWelcomeMessage = async () => {
      const ipResult = await detectUserByIP();
      setWelcomeMessage(getWelcomeMessage(ipResult));
    };
    
    setupWelcomeMessage();
  }, [searchParams, toast]);

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
        // Verificar se é erro de email não confirmado
        if (error.message.includes('Email not confirmed') || error.message.includes('not confirmed')) {
          setShowResendButton(true);
          toast({
            title: "📧 Email não verificado",
            description: "Você precisa confirmar seu email antes de fazer login. Use o botão abaixo para reenviar o email de verificação.",
            variant: "destructive",
            duration: 8000,
          });
          setLoading(false);
          return;
        }
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
      toast({
        title: "❌ Erro no login",
        description: formatAuthError(error),
        variant: "destructive"
      });
      setLoading(false);
    }
  };

  const handleResendEmail = async () => {
    if (!email || !validateEmail(email)) {
      toast({
        title: "❌ Email necessário",
        description: "Por favor, insira um email válido primeiro.",
        variant: "destructive"
      });
      return;
    }

    setResendingEmail(true);

    try {
      const { data, error } = await supabase.functions.invoke('send-verification-email', {
        body: {
          email: email,
          user_data: {
            full_name: 'Usuário'
          }
        }
      });

      if (error) throw error;

      toast({
        title: "✅ Email reenviado!",
        description: "Verifique sua caixa de entrada para o novo email de verificação.",
        duration: 6000,
      });

      setShowResendButton(false);
    } catch (error: any) {
      console.error('Erro ao reenviar email:', error);
      toast({
        title: "❌ Erro ao reenviar",
        description: error.message || "Não foi possível reenviar o email de verificação.",
        variant: "destructive"
      });
    } finally {
      setResendingEmail(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/50 to-background flex items-center justify-center p-8">
      <div className="w-full max-w-md space-y-8">
        {/* Logo */}
        <div className="text-center">
          <UnifiedLogo size="xl" clickable={false} theme="auto" className="mx-auto" />
        </div>

        {/* Welcome Message */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-semibold text-foreground">
            {welcomeMessage}
          </h2>
          <p className="text-muted-foreground">
            Acesse sua conta para continuar
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked as boolean)}
              />
              <Label htmlFor="remember" className="text-sm">
                Manter conectado
              </Label>
            </div>
            <ForgotPasswordModal>
              <button
                type="button"
                className="text-sm text-primary hover:underline"
              >
                Esqueceu a senha?
              </button>
            </ForgotPasswordModal>
          </div>

          {/* Login Button */}
          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </Button>

          {/* Resend Email Button - appears only when needed */}
          {showResendButton && (
            <Button
              type="button"
              variant="outline"
              onClick={handleResendEmail}
              disabled={resendingEmail}
              className="w-full flex items-center gap-2"
            >
              <Send className="h-4 w-4" />
              {resendingEmail ? 'Enviando...' : 'Reenviar email de verificação'}
            </Button>
          )}

          {/* Sign Up Link */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Não tem uma conta?{' '}
              <Link
                to="/cadastro"
                className="text-primary hover:underline font-medium"
              >
                Cadastre-se gratuitamente
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}