import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import AuthComponent from '@/components/auth/AuthComponent';
import { useToast } from '@/hooks/use-toast';

const Login = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { toast } = useToast();

  const verified = searchParams.get('verified');
  const error = searchParams.get('error');
  const message = searchParams.get('message');

  useEffect(() => {
    // Redirecionar usuário logado
    if (user) {
      navigate('/painel');
      return;
    }

    // Mostrar mensagens de verificação ou erro
    if (verified === 'true') {
      toast({
        title: "🎉 Email verificado!",
        description: message || "Sua conta foi ativada. Agora você pode fazer login.",
      });
    }

    if (error) {
      toast({
        title: "❌ Erro",
        description: decodeURIComponent(error),
        variant: "destructive"
      });
    }
  }, [user, navigate, verified, error, message, toast]);

  const handleAuthSuccess = () => {
    navigate('/painel');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-primary mb-2">MadenAI</h1>
          <p className="text-muted-foreground">Plataforma de Análise de Obras</p>
        </div>

        {/* Alertas de verificação */}
        {verified === 'true' && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              ✅ Email verificado com sucesso! Agora você pode fazer login.
            </AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertDescription>
              {decodeURIComponent(error)}
            </AlertDescription>
          </Alert>
        )}

        {/* Componente de autenticação */}
        <AuthComponent onAuthSuccess={handleAuthSuccess} />

        {/* Links úteis */}
        <div className="text-center space-y-2">
          <Button 
            variant="link" 
            onClick={() => navigate('/verify-email')}
            className="text-sm"
          >
            📧 Reenviar email de verificação
          </Button>
          
          <div className="flex items-center justify-center space-x-4 text-sm text-muted-foreground">
            <Button variant="link" size="sm" onClick={() => navigate('/termos')}>
              Termos
            </Button>
            <span>•</span>
            <Button variant="link" size="sm" onClick={() => navigate('/politica')}>
              Privacidade
            </Button>
          </div>
        </div>

        {/* Link para voltar */}
        <div className="text-center">
          <Button 
            variant="outline" 
            onClick={() => navigate('/')}
            className="w-full"
          >
            <ArrowRight className="h-4 w-4 mr-2 rotate-180" />
            Voltar ao Início
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Login;