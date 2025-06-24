
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Lock, LogIn, FileText } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useFormValidation } from '@/hooks/useFormValidation';
import { useSessionControl } from '@/hooks/useSessionControl';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import FormField from '@/components/common/FormField';
import LoadingSpinner from '@/components/common/LoadingSpinner';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  useSessionControl();

  const { fields, setFieldValue, validateAll } = useFormValidation({
    email: {
      value: '',
      rules: {
        required: true,
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      }
    },
    password: {
      value: '',
      rules: {
        required: true,
        minLength: 1
      }
    }
  });

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateAll()) {
      toast({
        title: "❌ Campos inválidos",
        description: "Por favor, verifique os dados inseridos.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: fields.email.value,
        password: fields.password.value,
      });

      if (error) throw error;

      toast({
        title: "🎉 Login realizado!",
        description: "Bem-vindo de volta!",
      });

      navigate('/painel');
    } catch (error) {
      console.error('Signin error:', error);
      toast({
        title: "❌ Erro no login",
        description: error instanceof Error ? error.message : "Credenciais inválidas",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:bg-gradient-to-br dark:from-[#0d0d0d] dark:via-[#1a1a1a] dark:to-[#232323]">
      <Header />
      
      <div className="flex items-center justify-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <div className="text-center mb-6 sm:mb-8">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:bg-gradient-to-r dark:from-green-600 dark:to-green-500 p-3 rounded-xl w-fit mx-auto mb-4">
              <FileText className="h-6 sm:h-8 w-6 sm:w-8 text-white" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-[#f2f2f2] leading-tight">Entrar na sua conta</h2>
            <p className="text-slate-600 dark:text-[#bbbbbb] mt-2 text-sm sm:text-base px-2">
              Acesse seu painel e continue seus projetos
            </p>
          </div>

          <Card className="shadow-xl border-0 bg-white/90 dark:bg-[#1a1a1a]/95 dark:border-[#333] backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg sm:text-xl text-center text-foreground dark:text-[#f2f2f2]">Login</CardTitle>
              <CardDescription className="text-center text-muted-foreground dark:text-[#bbbbbb] text-sm">
                Entre com suas credenciais para acessar o sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSignIn} className="space-y-4 sm:space-y-6">
                <FormField
                  id="email"
                  label="Email"
                  type="email"
                  placeholder="seu@email.com"
                  value={fields.email.value}
                  onChange={(e) => setFieldValue('email', e.target.value)}
                  error={fields.email.error}
                  icon={Mail}
                  required
                  disabled={loading}
                />

                <FormField
                  id="password"
                  label="Senha"
                  type="password"
                  placeholder="••••••••"
                  value={fields.password.value}
                  onChange={(e) => setFieldValue('password', e.target.value)}
                  error={fields.password.error}
                  icon={Lock}
                  required
                  disabled={loading}
                />
                
                <div className="flex items-center justify-between py-2">
                  <Link to="#" className="text-sm text-blue-600 dark:text-green-400 hover:text-blue-700 dark:hover:text-green-300 transition-colors">
                    Esqueci minha senha
                  </Link>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 dark:bg-gradient-to-r dark:from-green-600 dark:to-green-500 dark:hover:from-green-700 dark:hover:to-green-600 text-white transition-all duration-200 min-h-[44px] disabled:opacity-50 disabled:cursor-not-allowed" 
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center space-x-2">
                      <LoadingSpinner size="sm" />
                      <span>Entrando...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <LogIn className="h-4 w-4" />
                      <span>Entrar</span>
                    </div>
                  )}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-slate-600 dark:text-[#bbbbbb] text-sm">
                  Não tem uma conta?{' '}
                  <Link to="/cadastro" className="text-blue-600 dark:text-green-400 hover:text-blue-700 dark:hover:text-green-300 font-medium transition-colors">
                    Criar conta grátis
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Login;
