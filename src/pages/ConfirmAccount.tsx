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
    let timeout: any;

    const processAuth = async () => {
      try {
        const qs = new URLSearchParams(window.location.search);
        const hs = new URLSearchParams(window.location.hash.slice(1));

        const qError = qs.get('error');
        const qErrorCode = qs.get('error_code');
        const qErrorDesc = qs.get('error_description');

        if (qError || qErrorCode) {
          setStatus('error');
          setMessage(qErrorDesc || qErrorCode || qError || 'Link inválido ou expirado.');
          return;
        }

        const access_token = hs.get('access_token');
        const refresh_token = hs.get('refresh_token');
        const code = qs.get('code');

        if (access_token && refresh_token) {
          const { error } = await supabase.auth.setSession({ 
            access_token, 
            refresh_token 
          });
          
          if (error) throw error;
          
          navigate('/app', { replace: true });
          return;
        }

        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(window.location.href);
          
          if (error) throw error;
          
          navigate('/app', { replace: true });
          return;
        }

        // Fallback: sem erro e sem tokens -> considerar verificado e mostrar CTA de login
        timeout = setTimeout(() => {
          setStatus('success');
        }, 2500);
        
      } catch (error: any) {
        console.error('Erro no processamento de auth:', error);
        setStatus('error');
        setMessage(error.message || 'Não foi possível validar o link.');
      }
    };

    processAuth();

    return () => {
      if (timeout) clearTimeout(timeout);
    };
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
            {status === 'loading' && 'Confirmação de Email'}
            {status === 'success' && 'E-mail Verificado'}
            {status === 'error' && 'Link Inválido'}
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
                  <h2 className="text-xl font-semibold text-success">E-mail verificado com sucesso</h2>
                  <p className="text-sm text-muted-foreground">
                    Sua conta já está ativada. Você pode entrar agora.
                  </p>
                </div>
                <Button onClick={handleGoToLogin} className="w-full">
                  Ir para login
                </Button>
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