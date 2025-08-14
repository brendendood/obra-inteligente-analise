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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
        <Card className="w-full max-w-md">
          <CardContent className="text-center p-6">
            <div className="text-6xl mb-4">⚠️</div>
            <h2 className="text-xl font-semibold mb-2">Link inválido</h2>
            <p className="text-muted-foreground mb-4">
              Este link de redefinição de senha é inválido ou expirou.
            </p>
            <Button onClick={() => navigate('/')} variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar ao início
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center bg-gradient-to-r from-primary to-purple-600 text-white rounded-t-lg">
          <CardTitle className="text-2xl font-bold">
            Redefinir Senha
          </CardTitle>
          <p className="text-white/80 text-sm">
            Digite sua nova senha abaixo
          </p>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Nova senha
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Mínimo 6 caracteres"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-12 h-11"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <PasswordStrengthIndicator password={password} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm font-medium">
                Confirmar nova senha
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Confirme sua nova senha"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-10 h-11"
                  required
                  disabled={isLoading}
                />
              </div>
              {confirmPassword && password !== confirmPassword && (
                <p className="text-xs text-destructive">As senhas não coincidem</p>
              )}
            </div>

            <Button 
              type="submit" 
              className="w-full h-11 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 font-medium"
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

            <div className="text-center">
              <Button 
                type="button"
                variant="ghost" 
                onClick={() => navigate('/')}
                className="text-sm text-muted-foreground hover:text-foreground"
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