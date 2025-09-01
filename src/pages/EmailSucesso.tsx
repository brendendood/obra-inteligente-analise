import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/ui/logo';

export default function EmailSucesso() {
  const navigate = useNavigate();
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    // Foco inicial no heading para acessibilidade
    if (headingRef.current) {
      headingRef.current.focus();
    }
  }, []);

  const handleGoToLogin = () => {
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <Logo width={64} height={24} />
          <CardTitle 
            ref={headingRef}
            className="text-2xl font-bold"
            tabIndex={-1}
            aria-live="polite"
          >
            E-mail confirmado
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="flex flex-col items-center space-y-6">
            {/* Animação Lottie */}
            <div className="w-32 h-32 flex items-center justify-center">
              <iframe
                src="https://lottie.host/embed/0724360a-9299-4e76-af87-1f2902d2a188/6c06uoRs79.lottie"
                title="Animação de confirmação de e-mail bem-sucedida"
                aria-label="Animação celebrando a confirmação do e-mail"
                style={{
                  width: '128px',
                  height: '128px',
                  border: 'none',
                  background: 'transparent'
                }}
                allow="autoplay"
              />
            </div>
            
            <div className="text-center space-y-2">
              <p className="text-lg font-semibold text-success">
                Seu e-mail foi confirmado com sucesso!
              </p>
              <p className="text-sm text-muted-foreground">
                Agora você pode fazer login e começar a usar a plataforma.
              </p>
            </div>
            
            <Button 
              onClick={handleGoToLogin} 
              className="w-full"
              aria-label="Ir para a página de login"
            >
              Ir para o login
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}