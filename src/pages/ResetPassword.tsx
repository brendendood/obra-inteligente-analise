import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { PasswordStrengthIndicator } from '@/components/auth/PasswordStrengthIndicator';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isValidToken, setIsValidToken] = useState(false);

  useEffect(() => {
    // Verificar se há email e token na URL (novo formato customizado)
    const email = searchParams.get('email');
    const token = searchParams.get('token');

    if (email && token) {
      console.log('✅ Reset password link válido para:', email);
      setIsValidToken(true);
    } else {
      console.log('❌ Reset password link inválido ou ausente');
      toast({
        title: "❌ Link inválido",
        description: "Este link de redefinição de senha é inválido ou expirou.",
        variant: "destructive",
      });
      setTimeout(() => navigate('/'), 3000);
    }
  }, [searchParams, navigate, toast]);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 6) {
      toast({
        title: "❌ Senha muito curta",
        description: "A senha deve ter pelo menos 6 caracteres.",
        variant: "destructive",
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "❌ Senhas não coincidem",
        description: "Verifique se as senhas são idênticas.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const email = searchParams.get('email');
      
      if (!email) {
        toast({
          title: "❌ Email não encontrado",
          description: "Link de reset inválido.",
          variant: "destructive",
        });
        return;
      }

      // Fazer login temporário para permitir mudança de senha
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email,
        password: 'temp_password_for_reset_' + Date.now() // Senha temporária
      });

      // Se falhar o login (esperado), tentar atualizar via admin
      console.log('⚠️ Tentativa de login temporário (esperado falhar):', signInError?.message);

      // Simular redefinição de senha via Edge Function
      const { error: updateError } = await supabase.functions.invoke('update-user-password', {
        body: {
          email: email,
          newPassword: password
        }
      });

      if (updateError) {
        console.error('❌ Erro na edge function:', updateError);
        // Fallback: tentar método direto
        const { error: directError } = await supabase.auth.updateUser({
          password: password
        });
        
        if (directError) {
          throw directError;
        }
      }

      toast({
        title: "✅ Senha redefinida!",
        description: "Sua senha foi atualizada com sucesso. Faça login com a nova senha.",
      });

      setTimeout(() => navigate('/login'), 2000);
    } catch (error: any) {
      console.error('❌ Erro ao redefinir senha:', error);
      toast({
        title: "❌ Erro inesperado",
        description: error.message || "Tente novamente em alguns momentos.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isValidToken) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/50 to-slate-950/50"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.05),transparent_50%)]"></div>
        
        <Card className="w-full max-w-md relative z-10 bg-slate-900/90 border-slate-800/60 backdrop-blur-sm shadow-2xl">
          <CardContent className="text-center p-8">
            <div className="mx-auto mb-6 w-16 h-16 bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-xl flex items-center justify-center border border-red-500/20">
              <div className="text-3xl">⚠️</div>
            </div>
            <h2 className="text-xl font-light text-white mb-2 tracking-tight">Link inválido</h2>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Este link de redefinição de senha é inválido ou expirou.
            </p>
            <Button 
              onClick={() => navigate('/')} 
              className="w-full bg-slate-800 hover:bg-slate-700 text-white border-0"
              variant="outline"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar ao início
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/50 to-slate-950/50"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.05),transparent_50%)]"></div>
      
      <Card className="w-full max-w-md relative z-10 bg-slate-900/90 border-slate-800/60 backdrop-blur-sm shadow-2xl">
        <CardHeader className="text-center p-8 border-b border-slate-800/60">
          <div className="mx-auto mb-6 w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <Lock className="w-6 h-6 text-white" />
          </div>
          <CardTitle className="text-2xl font-light text-white tracking-tight">
            Redefinir Senha
          </CardTitle>
          <p className="text-slate-400 text-sm leading-relaxed mt-2">
            Digite sua nova senha para continuar
          </p>
        </CardHeader>
        <CardContent className="p-8">
          <form onSubmit={handleResetPassword} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-300 text-sm font-medium">
                Nova senha
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Mínimo 6 caracteres"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-slate-800/50 border-slate-700/60 text-white placeholder:text-slate-500 focus:border-blue-500/50 focus:ring-blue-500/20 pr-12 h-11"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-300 transition-colors"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {password && (
                <div className="mt-2">
                  <PasswordStrengthIndicator password={password} />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-slate-300 text-sm font-medium">
                Confirmar nova senha
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Confirme sua nova senha"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="bg-slate-800/50 border-slate-700/60 text-white placeholder:text-slate-500 focus:border-blue-500/50 focus:ring-blue-500/20 h-11"
                  required
                  disabled={isLoading}
                />
              </div>
              {confirmPassword && password !== confirmPassword && (
                <p className="text-xs text-red-400 mt-2">As senhas não coincidem</p>
              )}
            </div>

            <Button 
              type="submit" 
              className="w-full h-11 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 font-medium"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Redefinindo...
                </>
              ) : (
                'Redefinir senha'
              )}
            </Button>

            <div className="text-center pt-2">
              <Button 
                type="button"
                variant="ghost" 
                onClick={() => navigate('/')}
                className="text-slate-400 hover:text-slate-300 hover:bg-slate-800/50"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar ao início
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}