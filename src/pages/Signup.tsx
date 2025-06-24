
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Lock, User, UserPlus, FileText, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useFormValidation } from '@/hooks/useFormValidation';
import { useSessionControl } from '@/hooks/useSessionControl';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import FormField from '@/components/common/FormField';
import LoadingSpinner from '@/components/common/LoadingSpinner';

const Signup = () => {
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { toast } = useToast();
  
  useSessionControl();

  const { fields, setFieldValue, validateAll } = useFormValidation({
    name: {
      value: '',
      rules: {
        required: true,
        minLength: 2,
        maxLength: 100
      }
    },
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
        minLength: 6,
        maxLength: 50
      }
    },
    confirmPassword: {
      value: '',
      rules: {
        required: true,
        custom: (value) => {
          if (value !== fields.password?.value) {
            return 'As senhas não coincidem';
          }
          return null;
        }
      }
    }
  });

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateAll()) {
      toast({
        title: "❌ Campos inválidos",
        description: "Por favor, corrija os erros antes de continuar.",
        variant: "destructive",
      });
      return;
    }

    if (!acceptTerms) {
      toast({
        title: "❌ Aceite os termos",
        description: "Você deve aceitar os Termos de Uso e Política de Privacidade.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email: fields.email.value,
        password: fields.password.value,
        options: {
          emailRedirectTo: `${window.location.origin}/painel`,
          data: {
            full_name: fields.name.value
          }
        }
      });

      if (error) throw error;

      setSuccess(true);
      toast({
        title: "✅ Cadastro realizado!",
        description: "Verifique seu email para confirmar a conta.",
      });
    } catch (error) {
      console.error('Signup error:', error);
      toast({
        title: "❌ Erro no cadastro",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:bg-gradient-to-br dark:from-[#0d0d0d] dark:via-[#1a1a1a] dark:to-[#232323]">
        <Header />
        
        <div className="flex items-center justify-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full">
            <Card className="shadow-xl border-0 bg-white/90 dark:bg-[#1a1a1a]/95 dark:border-[#333] backdrop-blur-sm">
              <CardHeader className="text-center">
                <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full w-fit mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                <CardTitle className="text-xl text-green-800 dark:text-green-400">Cadastro Realizado!</CardTitle>
                <CardDescription className="text-muted-foreground dark:text-[#bbbbbb]">
                  Enviamos um email de confirmação para <strong>{fields.email.value}</strong>
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <p className="text-slate-600 dark:text-[#bbbbbb] text-sm sm:text-base">
                  Verifique sua caixa de entrada e clique no link de confirmação para ativar sua conta.
                </p>
                <p className="text-sm text-slate-500 dark:text-[#999]">
                  Não recebeu? Verifique a pasta de spam ou lixo eletrônico.
                </p>
                <Link to="/login">
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 dark:bg-gradient-to-r dark:from-green-600 dark:to-green-500 text-white hover:from-blue-700 hover:to-indigo-700 dark:hover:from-green-700 dark:hover:to-green-600 transition-all duration-200">
                    Ir para Login
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:bg-gradient-to-br dark:from-[#0d0d0d] dark:via-[#1a1a1a] dark:to-[#232323]">
      <Header />
      
      <div className="flex items-center justify-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <div className="text-center mb-6 sm:mb-8">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:bg-gradient-to-r dark:from-green-600 dark:to-green-500 p-3 rounded-xl w-fit mx-auto mb-4">
              <FileText className="h-6 sm:h-8 w-6 sm:w-8 text-white" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-[#f2f2f2] leading-tight">Criar sua conta</h2>
            <p className="text-slate-600 dark:text-[#bbbbbb] mt-2 text-sm sm:text-base px-2">
              Comece gratuitamente e acelere seus projetos
            </p>
          </div>

          <Card className="shadow-xl border-0 bg-white/90 dark:bg-[#1a1a1a]/95 dark:border-[#333] backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg sm:text-xl text-center text-foreground dark:text-[#f2f2f2]">Cadastro Gratuito</CardTitle>
              <CardDescription className="text-center text-muted-foreground dark:text-[#bbbbbb] text-sm">
                Preencha os dados abaixo para começar
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSignUp} className="space-y-4 sm:space-y-6">
                <FormField
                  id="name"
                  label="Nome Completo"
                  placeholder="Seu nome completo"
                  value={fields.name.value}
                  onChange={(e) => setFieldValue('name', e.target.value)}
                  error={fields.name.error}
                  icon={User}
                  required
                  disabled={loading}
                />

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

                <FormField
                  id="confirmPassword"
                  label="Confirmar Senha"
                  type="password"
                  placeholder="••••••••"
                  value={fields.confirmPassword.value}
                  onChange={(e) => setFieldValue('confirmPassword', e.target.value)}
                  error={fields.confirmPassword.error}
                  icon={Lock}
                  required
                  disabled={loading}
                />

                <div className="flex items-start space-x-3 py-2">
                  <Checkbox 
                    id="terms" 
                    checked={acceptTerms}
                    onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
                    className="mt-1"
                    disabled={loading}
                  />
                  <label htmlFor="terms" className="text-sm text-slate-600 dark:text-[#bbbbbb] leading-relaxed cursor-pointer">
                    Li e aceito os{' '}
                    <Link to="/termos" className="text-blue-600 dark:text-green-400 hover:text-blue-700 dark:hover:text-green-300 underline transition-colors">
                      Termos de Uso
                    </Link>
                    {' '}e a{' '}
                    <Link to="/politica" className="text-blue-600 dark:text-green-400 hover:text-blue-700 dark:hover:text-green-300 underline transition-colors">
                      Política de Privacidade
                    </Link>
                    .
                  </label>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 dark:bg-gradient-to-r dark:from-green-600 dark:to-green-500 dark:hover:from-green-700 dark:hover:to-green-600 text-white transition-all duration-200 min-h-[44px] disabled:opacity-50 disabled:cursor-not-allowed" 
                  disabled={loading || !acceptTerms}
                >
                  {loading ? (
                    <div className="flex items-center space-x-2">
                      <LoadingSpinner size="sm" />
                      <span>Criando conta...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <UserPlus className="h-4 w-4" />
                      <span>Criar conta</span>
                    </div>
                  )}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-slate-600 dark:text-[#bbbbbb] text-sm">
                  Já tem uma conta?{' '}
                  <Link to="/login" className="text-blue-600 dark:text-green-400 hover:text-blue-700 dark:hover:text-green-300 font-medium transition-colors">
                    Fazer login
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

export default Signup;
