
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { LogIn, UserPlus, Mail, Lock, UserIcon, User as UserIconLucide } from 'lucide-react';
import type { User } from '@supabase/supabase-js';
import { useAuth } from '@/hooks/useAuth';
import { validateEmail, validatePassword, formatAuthError } from '@/utils/authValidation';
import { validateUserInput } from '@/utils/securityValidation';
import { useSecurityMonitoring } from '@/hooks/useSecurityMonitoring';
import { PasswordStrengthMeter } from '@/components/ui/PasswordStrengthMeter';
import { Checkbox } from '@/components/ui/checkbox';

interface AuthComponentProps {
  onAuthSuccess?: (user: User) => void;
}

const AuthComponent = ({ onAuthSuccess }: AuthComponentProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const { toast } = useToast();
  const { trackFailedLogin } = useSecurityMonitoring();
  
  // Usar o contexto de autenticação existente em vez de criar outro listener
  const { user, isAuthenticated } = useAuth();

  // Chamar callback quando houver usuário
  useEffect(() => {
    if (user && isAuthenticated && onAuthSuccess) {
      onAuthSuccess(user);
    }
  }, [user, isAuthenticated, onAuthSuccess]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validações de segurança
      if (!validateEmail(email.trim())) {
        toast({
          title: "❌ Email inválido",
          description: "Por favor, insira um email válido.",
          variant: "destructive"
        });
        return;
      }

      const sanitizedFullName = validateUserInput(fullName, 100);
      if (sanitizedFullName.length < 2) {
        toast({
          title: "❌ Nome inválido",
          description: "Nome deve ter pelo menos 2 caracteres.",
          variant: "destructive"
        });
        return;
      }

      const passwordValidation = validatePassword(password);
      if (!passwordValidation.isValid) {
        toast({
          title: "❌ Senha inválida",
          description: passwordValidation.errors.join(' '),
          variant: "destructive"
        });
        return;
      }

      if (password !== confirmPassword) {
        toast({
          title: "❌ Senhas não coincidem",
          description: "As senhas digitadas não são iguais.",
          variant: "destructive"
        });
        return;
      }

      if (!acceptedTerms) {
        toast({
          title: "❌ Termos não aceitos",
          description: "Você deve aceitar os termos de uso para continuar.",
          variant: "destructive"
        });
        return;
      }

      const { error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          emailRedirectTo: 'https://madeai.com.br/v',
          data: {
            full_name: sanitizedFullName
          }
        }
      });

      if (error) throw error;

      toast({
        title: "✅ Cadastro realizado!",
        description: "Verifique seu email para confirmar a conta.",
      });
    } catch (error) {
      console.error('Signup error:', error);
      toast({
        title: "❌ Erro no cadastro",
        description: formatAuthError(error),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validação básica
      if (!validateEmail(email.trim())) {
        toast({
          title: "❌ Email inválido",
          description: "Por favor, insira um email válido.",
          variant: "destructive"
        });
        return;
      }

      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        console.error('Login error:', error);
        
        // Track failed login for security monitoring
        await trackFailedLogin(email);
        
        toast({
          title: "❌ Erro no login",
          description: formatAuthError(error),
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "🎉 Login realizado!",
        description: "Bem-vindo de volta!",
      });
    } catch (error) {
      console.error('Signin error:', error);
      await trackFailedLogin(email);
      toast({
        title: "❌ Erro no login",
        description: "Erro inesperado. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "👋 Logout realizado",
        description: "Até logo!",
      });
    } catch (error) {
      console.error('Signout error:', error);
    }
  };

  if (user) {
    return (
      <Card className="w-full max-w-md mx-auto bg-green-50 border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center text-green-800">
            <UserIcon className="h-5 w-5 mr-2" />
            Usuário Conectado
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-green-700">Email: {user.email}</p>
            <p className="text-xs text-green-600">
              Logado em {new Date(user.last_sign_in_at || '').toLocaleDateString('pt-BR')}
            </p>
          </div>
          <Button 
            onClick={handleSignOut} 
            variant="outline" 
            className="w-full border-green-300 text-green-700 hover:bg-green-100"
          >
            Sair
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Acesso à Plataforma</CardTitle>
        <CardDescription>
          Faça login ou cadastre-se para analisar seus projetos
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="signin" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Entrar</TabsTrigger>
            <TabsTrigger value="signup">Cadastrar</TabsTrigger>
          </TabsList>
          
          <TabsContent value="signin">
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signin-email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="signin-email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="signin-password">Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="signin-password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                <LogIn className="h-4 w-4 mr-2" />
                {loading ? 'Entrando...' : 'Entrar'}
              </Button>
            </form>
          </TabsContent>
          
          <TabsContent value="signup">
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signup-fullname">Nome Completo</Label>
                <div className="relative">
                  <UserIconLucide className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="signup-fullname"
                    type="text"
                    placeholder="Seu nome completo"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="pl-10"
                    required
                    maxLength={100}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="signup-email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="signup-password">Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                    minLength={8}
                  />
                </div>
                {password && (
                  <PasswordStrengthMeter 
                    password={password}
                    errors={validatePassword(password).errors}
                    strength={validatePassword(password).strength}
                  />
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="signup-confirm-password">Confirmar Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="signup-confirm-password"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10"
                    required
                    minLength={8}
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="terms"
                  checked={acceptedTerms}
                  onCheckedChange={(checked) => setAcceptedTerms(checked as boolean)}
                />
                <Label htmlFor="terms" className="text-sm">
                  Aceito os <a href="/terms" className="text-primary hover:underline">Termos de Uso</a> e 
                  <a href="/privacy" className="text-primary hover:underline ml-1">Política de Privacidade</a>
                </Label>
              </div>
              
              <Button 
                type="submit" 
                className="w-full" 
                disabled={loading || !acceptedTerms}
              >
                <UserPlus className="h-4 w-4 mr-2" />
                {loading ? 'Cadastrando...' : 'Cadastrar'}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AuthComponent;
