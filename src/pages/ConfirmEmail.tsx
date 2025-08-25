import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Mail } from 'lucide-react';
import { Logo } from '@/components/ui/logo';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { logConfirmationEvent } from '@/observability/telemetry';

export default function ConfirmEmail() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  const [status, setStatus] = useState<'success' | 'error' | 'resend'>('success');
  const [message, setMessage] = useState('');
  const [countdown, setCountdown] = useState(3);
  const [email, setEmail] = useState('');
  const [resendLoading, setResendLoading] = useState(false);

  // Verificar se estamos na rota de token inválido
  const isTokenInvalidRoute = location.pathname === '/cadastro/token-invalido';

  useEffect(() => {
    // Se estamos na rota de token inválido, mostrar interface de reenvio
    if (isTokenInvalidRoute) {
      setStatus('resend');
      setMessage('Link inválido ou expirado');
      return;
    }

    const confirmEmailOptimistic = async () => {
      const startTime = Date.now();
      
      try {
        // Estratégia OTIMISTA: verificar se há tokens na URL
        const hash = window.location.hash.substring(1);
        const hashParams = new URLSearchParams(hash);
        const urlParams = new URLSearchParams(window.location.search);
        
        // Verificar diferentes tipos de tokens possíveis
        const access_token = hashParams.get('access_token') || urlParams.get('access_token');
        const refresh_token = hashParams.get('refresh_token') || urlParams.get('refresh_token');
        const token_hash = urlParams.get('token_hash') || urlParams.get('token');
        const code = urlParams.get('code');
        const type = hashParams.get('type') || urlParams.get('type');
        
        const hasToken = !!(access_token || token_hash || code);
        const tokenType = access_token ? 'access_token' : token_hash ? 'token_hash' : code ? 'code' : 'none';
        
        logConfirmationEvent('email_verification_start', {
          tokenType,
          hasToken,
          type,
          route: '/cadastro/confirmado'
        });
        
        // Se houver qualquer token, mostrar sucesso IMEDIATAMENTE (otimista)
        if (hasToken) {
          logConfirmationEvent('email_verification_success', {
            tokenType,
            hasToken,
            optimistic: true,
            route: '/cadastro/confirmado'
          });
          
          setStatus('success');
          setMessage('✅ Conta verificada com sucesso!');
          
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
          
          // Em paralelo, fazer verificação real com timeout de 6s
          const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Timeout')), 6000);
          });
          
          try {
            let verificationResult;
            
            if (access_token && refresh_token) {
              // Verificação via setSession
              verificationResult = await Promise.race([
                supabase.auth.setSession({ access_token, refresh_token }),
                timeoutPromise
              ]);
            } else if (token_hash) {
              // Verificação via verifyOtp
              verificationResult = await Promise.race([
                supabase.auth.verifyOtp({
                  token_hash,
                  type: (type as any) || 'signup'
                }),
                timeoutPromise
              ]);
            } else if (code) {
              // Verificação via exchangeCodeForSession
              verificationResult = await Promise.race([
                supabase.auth.exchangeCodeForSession(code),
                timeoutPromise
              ]);
            }
            
            // Se a verificação falhou, trocar para tela de erro
            if (verificationResult?.error) {
              const error = verificationResult.error;
              
              logConfirmationEvent('email_verification_error', {
                tokenType,
                hasToken,
                error: error.message,
                durationMs: Date.now() - startTime
              });
              
              if (error.message.includes('expired') || 
                  error.message.includes('invalid') ||
                  error.message === 'otp_expired') {
                
                logConfirmationEvent('email_verification_invalid_token', {
                  reason: 'token_verification_failed',
                  tokenType,
                  hasToken,
                  error: error.message
                });
                
                clearInterval(timer);
                navigate('/cadastro/token-invalido');
                return;
              }
            } else {
              logConfirmationEvent('email_verification_success', {
                tokenType,
                hasToken,
                background: true,
                durationMs: Date.now() - startTime
              });
            }
            
          } catch (error: any) {
            // Log de timeout ou erro
            if (error.message === 'Timeout') {
              logConfirmationEvent('email_verification_timeout', {
                tokenType,
                hasToken,
                durationMs: 6000,
                error: error.message
              });
            } else {
              logConfirmationEvent('email_verification_error', {
                tokenType,
                hasToken,
                error: error.message,
                durationMs: Date.now() - startTime
              });
            }
            
            // Se for erro específico de token inválido/expirado, redirecionar
            if (error?.message?.includes('expired') || 
                error?.message?.includes('invalid')) {
              
              logConfirmationEvent('email_verification_invalid_token', {
                reason: 'token_verification_failed',
                tokenType,
                hasToken,
                error: error.message
              });
              
              clearInterval(timer);
              navigate('/cadastro/token-invalido');
              return;
            }
          }
          
        } else {
          // Sem tokens válidos na URL
          logConfirmationEvent('email_verification_invalid_token', {
            reason: 'no_token_found',
            tokenType: 'none',
            hasToken: false
          });
          
          setStatus('error');
          setMessage('Link inválido ou expirado');
        }
        
      } catch (error: any) {
        logConfirmationEvent('email_verification_error', {
          tokenType: 'unknown',
          hasToken: false,
          error: error.message,
          unexpected: true,
          durationMs: Date.now() - startTime
        });
        
        setStatus('error');
        setMessage('Link inválido ou expirado');
      }
    };

    confirmEmailOptimistic();
  }, [navigate, isTokenInvalidRoute]);

  const handleResendEmail = async () => {
    if (!email.trim()) {
      toast({
        title: "❌ Erro",
        description: "Por favor, digite seu e-mail.",
        variant: "destructive"
      });
      return;
    }

    setResendLoading(true);
    logConfirmationEvent('email_verification_resend_requested', {
      email: email.trim(),
      route: '/cadastro/confirmado'
    });
    
    try {
      const { error } = await supabase.auth.resend({ 
        type: 'signup', 
        email: email.trim(),
        options: { 
          emailRedirectTo: 'https://madeai.com.br/cadastro/confirmado' 
        } 
      });
      
      if (error) {
        logConfirmationEvent('email_verification_resend_error', {
          email: email.trim(),
          error: error.message,
          route: '/cadastro/confirmado'
        });
        
        toast({
          title: "❌ Erro",
          description: error.message,
          variant: "destructive"
        });
      } else {
        logConfirmationEvent('email_verification_resend_success', {
          email: email.trim(),
          route: '/cadastro/confirmado'
        });
        
        toast({
          title: "📧 E-mail reenviado",
          description: "Verifique sua caixa de entrada e clique no link de confirmação.",
        });
        setEmail('');
      }
    } catch (err: any) {
      logConfirmationEvent('email_verification_resend_error', {
        email: email.trim(),
        error: err.message,
        unexpected: true,
        route: '/cadastro/confirmado'
      });
      
      toast({
        title: "❌ Erro",
        description: "Erro ao reenviar e-mail. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setResendLoading(false);
    }
  };

  const handleGoToLogin = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <Logo width={64} height={24} />
          <CardTitle className="text-2xl font-bold">
            {status === 'resend' ? 'Reenviar Confirmação' : 'Confirmação de Email'}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="flex flex-col items-center space-y-4">
            {status === 'success' && (
              <>
                <CheckCircle className="h-12 w-12 text-green-600" />
                <div className="text-center space-y-2">
                  <p className="text-green-600 font-medium">{message}</p>
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

            {status === 'resend' && (
              <>
                <Mail className="h-12 w-12 text-primary" />
                <div className="text-center space-y-2">
                  <p className="text-destructive font-medium">{message}</p>
                  <p className="text-sm text-muted-foreground">
                    Digite seu e-mail para receber um novo link de confirmação.
                  </p>
                </div>
                <div className="w-full space-y-3">
                  <Input
                    type="email"
                    placeholder="Digite seu e-mail"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleResendEmail()}
                  />
                  <Button 
                    onClick={handleResendEmail} 
                    className="w-full"
                    disabled={resendLoading}
                  >
                    {resendLoading ? 'Enviando...' : 'Reenviar E-mail de Confirmação'}
                  </Button>
                  <Button 
                    onClick={handleGoToLogin} 
                    variant="outline" 
                    className="w-full"
                  >
                    Voltar para Login
                  </Button>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}