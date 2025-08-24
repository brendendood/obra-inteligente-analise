import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { Logo } from '@/components/ui/logo';

export default function ConfirmEmail() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    const confirmEmail = async () => {
      try {
        // Ler parâmetros do hash da URL
        const hash = window.location.hash.substring(1); // Remove o #
        const hashParams = new URLSearchParams(hash);
        
        const access_token = hashParams.get('access_token');
        const refresh_token = hashParams.get('refresh_token');
        const type = hashParams.get('type');

        if (!access_token || !refresh_token || type !== 'recovery') {
          setStatus('error');
          setMessage('Link inválido ou expirado');
          return;
        }

        // Confirmar a sessão usando os tokens
        const { data, error } = await supabase.auth.setSession({
          access_token,
          refresh_token
        });

        if (error) {
          console.error('Erro na confirmação:', error);
          setStatus('error');
          
          if (error.message.includes('expired') || error.message === 'otp_expired') {
            setMessage('Link inválido ou expirado');
          } else if (error.message.includes('access_denied')) {
            setMessage('Acesso negado. Tente novamente.');
          } else {
            setMessage('Erro ao confirmar email. Tente novamente.');
          }
        } else if (data.session) {
          setStatus('success');
          setMessage('Conta confirmada com sucesso!');
          
          // Iniciar countdown para redirecionamento
          const timer = setInterval(() => {
            setCountdown((prev) => {
              if (prev <= 1) {
                clearInterval(timer);
                navigate('/login');
                return 0;
              }
              return prev - 1;
            });
          }, 1000);
        } else {
          setStatus('error');
          setMessage('Link inválido ou expirado');
        }
      } catch (error) {
        console.error('Erro inesperado:', error);
        setStatus('error');
        setMessage('Erro inesperado. Tente novamente.');
      }
    };

    // Verificar se há parâmetros no hash
    if (window.location.hash) {
      confirmEmail();
    } else {
      setStatus('error');
      setMessage('Link inválido ou expirado');
    }
  }, [navigate]);

  const handleGoToLogin = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <Logo width={64} height={24} />
          <CardTitle className="text-2xl font-bold">
            Confirmação de Email
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="flex flex-col items-center space-y-4">
            {status === 'loading' && (
              <>
                <Loader2 className="h-12 w-12 text-primary animate-spin" />
                <p className="text-center text-muted-foreground">
                  Confirmando e-mail...
                </p>
              </>
            )}
            
            {status === 'success' && (
              <>
                <CheckCircle className="h-12 w-12 text-success" />
                <div className="text-center space-y-2">
                  <p className="text-success font-medium">{message}</p>
                  <p className="text-sm text-muted-foreground">
                    Redirecionando para login em {countdown} segundos...
                  </p>
                </div>
                <Button onClick={handleGoToLogin} className="w-full">
                  Ir para Login
                </Button>
              </>
            )}
            
            {status === 'error' && (
              <>
                <XCircle className="h-12 w-12 text-destructive" />
                <div className="text-center space-y-2">
                  <p className="text-destructive font-medium">{message}</p>
                  <p className="text-sm text-muted-foreground">
                    Entre em contato com o suporte se o problema persistir.
                  </p>
                </div>
                <Button onClick={handleGoToLogin} variant="outline" className="w-full">
                  Voltar para Login
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}