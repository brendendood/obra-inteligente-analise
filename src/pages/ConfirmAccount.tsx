import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { UnifiedLogo } from '@/components/ui/UnifiedLogo';

function ResendConfirmation() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onResend = async () => {
    if (!email.trim()) return;
    
    setError('');
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.resend({ 
        type: 'signup', 
        email: email.trim(),
        options: { 
          emailRedirectTo: 'https://madeai.com.br/v' 
        } 
      });
      
      if (error) {
        setError(error.message);
      } else {
        setSent(true);
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao reenviar confirmação.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 mt-6 p-4 bg-muted/50 rounded-lg">
      <h3 className="font-medium">Reenviar confirmação</h3>
      <div className="space-y-2">
        <Input 
          placeholder="Seu e-mail" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          type="email"
        />
        <Button 
          onClick={onResend} 
          disabled={loading || !email.trim()}
          className="w-full"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Enviando...
            </>
          ) : (
            'Reenviar confirmação'
          )}
        </Button>
      </div>
      {sent && (
        <p className="text-sm text-success">
          Enviado! Verifique sua caixa de entrada.
        </p>
      )}
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  );
}

export default function AuthCallback() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const processAuth = async () => {
      try {
        // Ler parâmetros de query (erros)
        const qs = new URLSearchParams(window.location.search);
        const qError = qs.get('error');
        const qErrorCode = qs.get('error_code');
        const qErrorDesc = qs.get('error_description');

        if (qError || qErrorCode) {
          setStatus('error');
          if (qErrorCode === 'otp_expired') {
            setMessage('Link de confirmação expirado. Solicite um novo email de confirmação.');
          } else {
            setMessage(qErrorDesc || qErrorCode || qError || 'Link inválido ou expirado.');
          }
          return;
        }

        // Ler parâmetros de hash (tokens)
        const hs = new URLSearchParams(window.location.hash.slice(1));
        const access_token = hs.get('access_token');
        const refresh_token = hs.get('refresh_token');
        const code = qs.get('code');

        // Processar access_token/refresh_token
        if (access_token && refresh_token) {
          const { error } = await supabase.auth.setSession({ 
            access_token, 
            refresh_token 
          });
          
          if (error) throw error;
          
          setStatus('success');
          setMessage('Email confirmado com sucesso! Redirecionando...');
          
          setTimeout(() => {
            navigate('/dashboard');
          }, 1500);
          return;
        }

        // Processar code parameter
        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(window.location.href);
          
          if (error) throw error;
          
          setStatus('success');
          setMessage('Email confirmado com sucesso! Redirecionando...');
          
          setTimeout(() => {
            navigate('/dashboard');
          }, 1500);
          return;
        }

        // Se chegou até aqui, não há token válido
        setStatus('error');
        setMessage('Token não encontrado na URL. Gere um novo link de confirmação.');
        
      } catch (error: any) {
        console.error('Erro no processamento de auth:', error);
        setStatus('error');
        setMessage(error.message || 'Não foi possível validar o link.');
      }
    };

    processAuth();
  }, [navigate]);

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
                  Validando seu acesso...
                </p>
              </>
            )}
            
            {status === 'success' && (
              <>
                <CheckCircle className="h-12 w-12 text-success" />
                <div className="text-center space-y-2">
                  <p className="text-success font-medium">{message}</p>
                </div>
              </>
            )}
            
            {status === 'error' && (
              <>
                <XCircle className="h-12 w-12 text-destructive" />
                <div className="text-center space-y-2">
                  <p className="text-destructive font-medium">Link inválido ou expirado</p>
                  <p className="text-sm text-muted-foreground opacity-80">
                    {message}
                  </p>
                </div>
                <Button onClick={handleGoToLogin} variant="outline" className="w-full">
                  Voltar para Login
                </Button>
                <ResendConfirmation />
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}