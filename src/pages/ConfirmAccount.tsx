import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { UnifiedLogo } from '@/components/ui/UnifiedLogo';

export default function ConfirmAccount() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    const confirmEmail = async () => {
      try {
        // Extrair token e type da URL
        const token = searchParams.get('token');
        const type = searchParams.get('type');
        
        if (!token || type !== 'email_confirm') {
          setStatus('error');
          setMessage('Link de confirmação inválido.');
          return;
        }

        // Verificar o token de confirmação
        const { error } = await supabase.auth.verifyOtp({
          token_hash: token,
          type: 'email'
        });

        if (error) {
          console.error('Erro na confirmação:', error);
          setStatus('error');
          
          if (error.message.includes('expired')) {
            setMessage('Link de confirmação expirado. Solicite um novo email de confirmação.');
          } else if (error.message.includes('invalid')) {
            setMessage('Link de confirmação inválido.');
          } else {
            setMessage('Erro ao confirmar email. Tente novamente.');
          }
        } else {
          setStatus('success');
          setMessage('Email confirmado com sucesso! Sua conta está ativa.');
          
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
        }
      } catch (error) {
        console.error('Erro inesperado:', error);
        setStatus('error');
        setMessage('Erro inesperado. Tente novamente.');
      }
    };

    confirmEmail();
  }, [searchParams, navigate]);

  const handleGoToLogin = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <UnifiedLogo />
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
                  Verificando confirmação...
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