import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogPortal, DialogOverlay } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Eye, EyeOff, X, Mail, Lock, User, Building, Briefcase } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { validateEmail, formatAuthError } from '@/utils/authValidation';
import { PasswordStrengthIndicator } from './PasswordStrengthIndicator';
import { GenderSelect } from '@/components/account/GenderSelect';
import { ForgotPasswordModal } from './ForgotPasswordModal';
import { detectUserByIP, getWelcomeMessage, IPDetectionResult } from '@/utils/ipDetection';
import { useSocialAuth } from '@/hooks/useSocialAuth';

interface ModernAuthDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  defaultTab?: 'login' | 'signup';
}

export const ModernAuthDialog = ({ 
  isOpen, 
  onClose, 
  onSuccess, 
  defaultTab = 'login' 
}: ModernAuthDialogProps) => {
  // Estados do login
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Estados do cadastro
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [company, setCompany] = useState('');
  const [cargo, setCargo] = useState('');
  const [gender, setGender] = useState('');
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSignupLoading, setIsSignupLoading] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Estado para modal de esqueci a senha
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  // Estado da aba ativa
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>(defaultTab);

  // Estado para detecção de IP
  const [ipDetection, setIpDetection] = useState<IPDetectionResult>({ isReturningUser: false });
  const [welcomeMessage, setWelcomeMessage] = useState('');

  const { toast } = useToast();
  const navigate = useNavigate();
  const { signInWithGoogle, signInWithApple, loading: socialLoading } = useSocialAuth();

  // Efeito para detectar IP quando o modal abrir
  useEffect(() => {
    if (isOpen) {
      detectUserByIP().then(result => {
        setIpDetection(result);
        setWelcomeMessage(getWelcomeMessage(result));
      });
    }
  }, [isOpen]);

  const handleClose = () => {
    // Reset dos estados
    setEmail('');
    setPassword('');
    setSignupEmail('');
    setSignupPassword('');
    setConfirmPassword('');
    setFullName('');
    setCompany('');
    setCargo('');
    setGender('');
    setShowPassword(false);
    setShowSignupPassword(false);
    setShowConfirmPassword(false);
    setIsLoading(false);
    setIsSignupLoading(false);
    setTermsAccepted(false);
    setActiveTab(defaultTab);
    onClose();
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateEmail(email)) {
      toast({
        title: "❌ Email inválido",
        description: "Por favor, insira um email válido.",
        variant: "destructive"
      });
      return;
    }

    if (!password) {
      toast({
        title: "❌ Senha obrigatória",
        description: "Por favor, insira sua senha.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password
      });

      if (error) {
        toast({
          title: "❌ Erro no login",
          description: formatAuthError(error),
          variant: "destructive"
        });
        return;
      }

      if (data.user) {
        toast({
          title: "✅ Login realizado!",
          description: "Bem-vindo de volta!"
        });
        
        handleClose();
        onSuccess?.();
        navigate('/painel');
      }
    } catch (error: any) {
      console.error('Erro no login:', error);
      toast({
        title: "❌ Erro inesperado",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateEmail(signupEmail)) {
      toast({
        title: "❌ Email inválido",
        description: "Por favor, insira um email válido.",
        variant: "destructive"
      });
      return;
    }

    if (signupPassword !== confirmPassword) {
      toast({
        title: "❌ Senhas não coincidem",
        description: "Verifique se as senhas são idênticas.",
        variant: "destructive"
      });
      return;
    }

    if (signupPassword.length < 6) {
      toast({
        title: "❌ Senha muito curta",
        description: "A senha deve ter pelo menos 6 caracteres.",
        variant: "destructive"
      });
      return;
    }

    if (!termsAccepted) {
      toast({
        title: "❌ Aceite os termos",
        description: "Você deve aceitar os termos de uso para continuar.",
        variant: "destructive"
      });
      return;
    }

    setIsSignupLoading(true);

    try {
      const redirectUrl = `${window.location.origin}/painel`;
      
      const { data, error } = await supabase.auth.signUp({
        email: signupEmail.trim(),
        password: signupPassword,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: fullName,
            company: company,
            cargo: cargo,
            avatar_url: null,
            avatar_type: 'initials',
            gender: gender || 'male'
          }
        }
      });

      if (error) {
        toast({
          title: "❌ Erro no cadastro",
          description: formatAuthError(error),
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "✅ Conta criada!",
        description: "Verifique seu email para confirmar a conta.",
      });

      // Resetar formulário e mostrar aba de login
      setSignupEmail('');
      setSignupPassword('');
      setConfirmPassword('');
      setFullName('');
      setCompany('');
      setCargo('');
      setGender('');
      setTermsAccepted(false);
      setActiveTab('login');
      
    } catch (error: any) {
      console.error('Erro no cadastro:', error);
      toast({
        title: "❌ Erro inesperado",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive"
      });
    } finally {
      setIsSignupLoading(false);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogPortal>
          <DialogOverlay className="bg-black/85 backdrop-blur-sm" />
          <DialogContent className="sm:max-w-[420px] max-h-[95vh] overflow-y-auto p-0 gap-0 border-0 rounded-2xl shadow-2xl">
            {/* Botão de fechar customizado */}
            <button
              onClick={handleClose}
              className="absolute right-4 top-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <X className="h-4 w-4 text-white" />
            </button>

            {/* Header com gradiente inspirado no PayPal */}
            <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-8 rounded-t-2xl relative overflow-hidden">
              {/* Elementos decorativos */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
              
              <DialogHeader>
                <div className="text-center space-y-2">
                  <h1 className="text-2xl font-bold text-white">
                    {activeTab === 'login' ? welcomeMessage : 'Junte-se à MadenAI'}
                  </h1>
                  <p className="text-blue-100 text-sm">
                    {activeTab === 'login' 
                      ? ipDetection.isReturningUser 
                        ? 'Que bom ter você de volta!' 
                        : 'Entre na sua conta para continuar'
                      : 'Construa projetos incríveis com inteligência artificial'
                    }
                  </p>
                </div>
              </DialogHeader>
            </div>

            {/* Conteúdo principal */}
            <div className="p-8 bg-white">
              <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'login' | 'signup')} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-8 bg-gray-50 p-1 rounded-lg">
                  <TabsTrigger 
                    value="login" 
                    className="text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm"
                  >
                    Entrar
                  </TabsTrigger>
                  <TabsTrigger 
                    value="signup" 
                    className="text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm"
                  >
                    Cadastrar
                  </TabsTrigger>
                </TabsList>

                {/* Aba de Login */}
                <TabsContent value="login" className="space-y-6 mt-0">
                  <form onSubmit={handleLogin} className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-semibold text-gray-700">
                        Email
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="seu@email.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="pl-12 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-sm font-semibold text-gray-700">
                        Senha
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Digite sua senha"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="pl-12 pr-12 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center hover:bg-gray-50 rounded-r-lg transition-colors"
                        >
                          {showPassword ? (
                            <EyeOff className="h-5 w-5 text-gray-400" />
                          ) : (
                            <Eye className="h-5 w-5 text-gray-400" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-end">
                      <button
                        type="button"
                        onClick={() => setShowForgotPassword(true)}
                        className="text-sm text-blue-600 hover:text-blue-800 font-medium hover:underline transition-colors"
                      >
                        Esqueceu sua senha?
                      </button>
                    </div>

                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      {isLoading ? 'Entrando...' : 'Entrar'}
                    </Button>
                  </form>

                  {/* Divisor */}
                  <div className="relative my-8">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-gray-200" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="bg-white px-4 text-gray-500 font-medium">ou continue com</span>
                    </div>
                  </div>

                  {/* Botões de login social */}
                  <div className="space-y-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={signInWithGoogle}
                      disabled={socialLoading}
                      className="w-full h-12 border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 rounded-lg font-medium transition-all duration-200"
                    >
                      <svg className="h-5 w-5 mr-3" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      Continuar com Google
                    </Button>
                    
                    <Button
                      type="button"
                      variant="outline"
                      onClick={signInWithApple}
                      disabled={socialLoading}
                      className="w-full h-12 border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 rounded-lg font-medium transition-all duration-200"
                    >
                      <svg className="h-5 w-5 mr-3" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                      </svg>
                      Continuar com Apple
                    </Button>
                  </div>
                </TabsContent>

                {/* Aba de Cadastro */}
                <TabsContent value="signup" className="space-y-6 mt-0">
                  {/* Botões de cadastro social no topo */}
                  <div className="space-y-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={signInWithGoogle}
                      disabled={socialLoading}
                      className="w-full h-12 border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 rounded-lg font-medium transition-all duration-200"
                    >
                      <svg className="h-5 w-5 mr-3" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      Cadastrar com Google
                    </Button>
                    
                    <Button
                      type="button"
                      variant="outline"
                      onClick={signInWithApple}
                      disabled={socialLoading}
                      className="w-full h-12 border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 rounded-lg font-medium transition-all duration-200"
                    >
                      <svg className="h-5 w-5 mr-3" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                      </svg>
                      Cadastrar com Apple
                    </Button>
                  </div>

                  {/* Divisor */}
                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-gray-200" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="bg-white px-4 text-gray-500 font-medium">ou cadastre-se com email</span>
                    </div>
                  </div>

                  <form onSubmit={handleSignup} className="space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="fullName" className="text-sm font-semibold text-gray-700">
                          Nome completo
                        </Label>
                        <div className="relative">
                          <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                          <Input
                            id="fullName"
                            type="text"
                            placeholder="Seu nome completo"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="pl-12 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="signupEmail" className="text-sm font-semibold text-gray-700">
                          Email
                        </Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                          <Input
                            id="signupEmail"
                            type="email"
                            placeholder="seu@email.com"
                            value={signupEmail}
                            onChange={(e) => setSignupEmail(e.target.value)}
                            className="pl-12 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="signupPassword" className="text-sm font-semibold text-gray-700">
                          Senha
                        </Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                          <Input
                            id="signupPassword"
                            type={showSignupPassword ? "text" : "password"}
                            placeholder="Crie uma senha segura"
                            value={signupPassword}
                            onChange={(e) => setSignupPassword(e.target.value)}
                            className="pl-12 pr-12 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowSignupPassword(!showSignupPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center hover:bg-gray-50 rounded-r-lg transition-colors"
                          >
                            {showSignupPassword ? (
                              <EyeOff className="h-5 w-5 text-gray-400" />
                            ) : (
                              <Eye className="h-5 w-5 text-gray-400" />
                            )}
                          </button>
                        </div>
                        {signupPassword && (
                          <PasswordStrengthIndicator password={signupPassword} />
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword" className="text-sm font-semibold text-gray-700">
                          Confirmar senha
                        </Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                          <Input
                            id="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirme sua senha"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="pl-12 pr-12 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center hover:bg-gray-50 rounded-r-lg transition-colors"
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="h-5 w-5 text-gray-400" />
                            ) : (
                              <Eye className="h-5 w-5 text-gray-400" />
                            )}
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="company" className="text-sm font-semibold text-gray-700">
                            Empresa <span className="text-gray-400">(opcional)</span>
                          </Label>
                          <div className="relative">
                            <Building className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                            <Input
                              id="company"
                              type="text"
                              placeholder="Nome da sua empresa"
                              value={company}
                              onChange={(e) => setCompany(e.target.value)}
                              className="pl-12 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="cargo" className="text-sm font-semibold text-gray-700">
                            Cargo <span className="text-gray-400">(opcional)</span>
                          </Label>
                          <div className="relative">
                            <Briefcase className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                            <Input
                              id="cargo"
                              type="text"
                              placeholder="Seu cargo"
                              value={cargo}
                              onChange={(e) => setCargo(e.target.value)}
                              className="pl-12 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="gender" className="text-sm font-semibold text-gray-700">
                          Gênero <span className="text-gray-400">(opcional)</span>
                        </Label>
                        <GenderSelect
                          value={gender}
                          onValueChange={setGender}
                        />
                      </div>

                      {/* Checkbox de termos obrigatório */}
                      <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                        <Checkbox
                          id="terms"
                          checked={termsAccepted}
                          onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
                          className="mt-1"
                          required
                        />
                        <div className="text-sm">
                          <label htmlFor="terms" className="text-gray-700 cursor-pointer">
                            Eu aceito os{' '}
                            <a href="/termos" target="_blank" className="text-blue-600 hover:text-blue-800 underline font-medium">
                              Termos de Uso
                            </a>{' '}
                            e{' '}
                            <a href="/privacidade" target="_blank" className="text-blue-600 hover:text-blue-800 underline font-medium">
                              Política de Privacidade
                            </a>
                          </label>
                        </div>
                      </div>

                      <Button
                        type="submit"
                        disabled={isSignupLoading || !termsAccepted}
                        className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSignupLoading ? 'Criando conta...' : 'Criar Conta'}
                      </Button>
                    </div>
                  </form>
                </TabsContent>
              </Tabs>
            </div>
          </DialogContent>
        </DialogPortal>
      </Dialog>

      <ForgotPasswordModal 
        isOpen={showForgotPassword}
        onClose={() => setShowForgotPassword(false)}
      />
    </>
  );
};