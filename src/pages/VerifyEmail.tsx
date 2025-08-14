import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useResendAuth } from '@/hooks/useResendAuth';
import { CheckCircle, XCircle, Mail, RotateCcw, ArrowRight } from 'lucide-react';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { verifyEmailToken, resendVerificationEmail, loading } = useResendAuth();
  
  const [verificationState, setVerificationState] = useState<'pending' | 'success' | 'error' | 'manual'>('pending');
  const [manualEmail, setManualEmail] = useState('');
  
  const token = searchParams.get('token');
  const email = searchParams.get('email');

  useEffect(() => {
    if (token && email) {
      handleAutoVerification();
    } else {
      setVerificationState('manual');
    }
  }, [token, email]);

  const handleAutoVerification = async () => {
    if (!token || !email) return;

    try {
      const result = await verifyEmailToken(token, email);
      
      if (result.success) {
        setVerificationState('success');
        // Redirecionar para login após 3 segundos
        setTimeout(() => {
          navigate('/login?verified=true');
        }, 3000);
      } else {
        setVerificationState('error');
      }
    } catch (error) {
      console.error('Erro na verificação automática:', error);
      setVerificationState('error');
    }
  };

  const handleManualResend = async () => {
    if (!manualEmail.trim()) {
      toast({
        title: "❌ Email obrigatório",
        description: "Digite seu email para reenviar a verificação.",
        variant: "destructive"
      });
      return;
    }

    await resendVerificationEmail(manualEmail.trim());
  };

  const renderContent = () => {
    switch (verificationState) {
      case 'success':
        return (
          <div className="text-center space-y-4">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
            <CardTitle className="text-green-700">Email Verificado!</CardTitle>
            <CardDescription>
              Sua conta foi ativada com sucesso. Redirecionando para o login...
            </CardDescription>
            <div className="flex gap-2">
              <Button onClick={() => navigate('/login')} className="flex-1">
                <ArrowRight className="h-4 w-4 mr-2" />
                Fazer Login
              </Button>
            </div>
          </div>
        );

      case 'error':
        return (
          <div className="text-center space-y-4">
            <XCircle className="h-16 w-16 text-red-500 mx-auto" />
            <CardTitle className="text-red-700">Erro na Verificação</CardTitle>
            <CardDescription>
              O link de verificação pode estar expirado ou inválido.
              {email && (
                <span className="block mt-2 font-medium">
                  Email: {email}
                </span>
              )}
            </CardDescription>
            <div className="space-y-3">
              {email && (
                <Button 
                  onClick={() => resendVerificationEmail(email)} 
                  disabled={loading}
                  variant="outline"
                  className="w-full"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  {loading ? 'Reenviando...' : 'Reenviar Verificação'}
                </Button>
              )}
              <Button onClick={() => navigate('/login')} variant="secondary" className="w-full">
                Voltar ao Login
              </Button>
            </div>
          </div>
        );

      case 'manual':
        return (
          <div className="space-y-4">
            <div className="text-center">
              <Mail className="h-16 w-16 text-primary mx-auto mb-4" />
              <CardTitle>Verificação de Email</CardTitle>
              <CardDescription>
                Digite seu email para reenviar o link de verificação
              </CardDescription>
            </div>
            
            <div className="space-y-3">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={manualEmail}
                  onChange={(e) => setManualEmail(e.target.value)}
                />
              </div>
              
              <Button 
                onClick={handleManualResend} 
                disabled={loading || !manualEmail.trim()}
                className="w-full"
              >
                <Mail className="h-4 w-4 mr-2" />
                {loading ? 'Enviando...' : 'Reenviar Verificação'}
              </Button>
              
              <Button 
                onClick={() => navigate('/login')} 
                variant="outline" 
                className="w-full"
              >
                Voltar ao Login
              </Button>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center space-y-4">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
            <CardDescription>Verificando seu email...</CardDescription>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center pb-2">
          <div className="mb-4">
            <h1 className="text-2xl font-bold text-primary">MadenAI</h1>
            <p className="text-sm text-muted-foreground">Plataforma de Análise de Obras</p>
          </div>
        </CardHeader>
        <CardContent>
          {renderContent()}
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyEmail;