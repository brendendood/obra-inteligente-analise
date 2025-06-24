
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Lock, LogIn, FileText } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
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
      
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:bg-gradient-to-r dark:from-green-600 dark:to-green-500 p-3 rounded-xl w-fit mx-auto mb-4">
              <FileText className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-[#f2f2f2]">Entrar na sua conta</h2>
            <p className="text-slate-600 dark:text-[#bbbbbb] mt-2">
              Acesse seu painel e continue seus projetos
            </p>
          </div>

          <Card className="shadow-xl border-0 bg-white/90 dark:bg-[#1a1a1a]/95 dark:border-[#333] backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl text-center text-foreground dark:text-[#f2f2f2]">Login</CardTitle>
              <CardDescription className="text-center text-muted-foreground dark:text-[#bbbbbb]">
                Entre com suas credenciais para acessar o sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSignIn} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-foreground dark:text-[#f2f2f2]">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400 dark:text-[#bbbbbb]" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 bg-background dark:bg-[#232323] border-border dark:border-[#333] text-foreground dark:text-[#f2f2f2] placeholder:text-muted-foreground dark:placeholder:text-[#bbbbbb]"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-foreground dark:text-[#f2f2f2]">Senha</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400 dark:text-[#bbbbbb]" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 bg-background dark:bg-[#232323] border-border dark:border-[#333] text-foreground dark:text-[#f2f2f2] placeholder:text-muted-foreground dark:placeholder:text-[#bbbbbb]"
                      required
                    />
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <Link to="#" className="text-sm text-blue-600 dark:text-green-400 hover:text-blue-700 dark:hover:text-green-300">
                    Esqueci minha senha
                  </Link>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 dark:bg-gradient-to-r dark:from-green-600 dark:to-green-500 dark:hover:from-green-700 dark:hover:to-green-600 text-white" 
                  disabled={loading}
                >
                  <LogIn className="h-4 w-4 mr-2" />
                  {loading ? 'Entrando...' : 'Entrar'}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-slate-600 dark:text-[#bbbbbb]">
                  Não tem uma conta?{' '}
                  <Link to="/cadastro" className="text-blue-600 dark:text-green-400 hover:text-blue-700 dark:hover:text-green-300 font-medium">
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
