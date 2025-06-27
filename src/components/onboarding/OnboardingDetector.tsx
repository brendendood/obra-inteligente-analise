
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap, X } from 'lucide-react';

interface OnboardingDetectorProps {
  children: React.ReactNode;
}

export const OnboardingDetector = ({ children }: OnboardingDetectorProps) => {
  const navigate = useNavigate();
  const [showOnboardingPrompt, setShowOnboardingPrompt] = useState(false);

  useEffect(() => {
    // Verificar se o usuário nunca completou o onboarding e nunca viu o prompt
    const hasCompletedOnboarding = localStorage.getItem('maden-onboarding-completed');
    const hasEverSeenPrompt = localStorage.getItem('maden-onboarding-prompt-ever-seen');
    
    // Só mostrar o popup se nunca completou E nunca viu o prompt antes
    if (!hasCompletedOnboarding && !hasEverSeenPrompt) {
      setShowOnboardingPrompt(true);
      // Marcar que já viu o prompt uma vez (para não aparecer mais)
      localStorage.setItem('maden-onboarding-prompt-ever-seen', 'true');
    }
  }, []);

  const handleStartOnboarding = () => {
    setShowOnboardingPrompt(false);
    navigate('/tutorial');
  };

  const handleSkipOnboarding = () => {
    setShowOnboardingPrompt(false);
    // Não marcar como completado, apenas fechar o popup
  };

  return (
    <>
      {children}
      
      {/* Onboarding Prompt Modal - Apenas para usuários que nunca viram */}
      {showOnboardingPrompt && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="max-w-md w-full border-2 border-blue-200 shadow-2xl animate-scale-in">
            <CardHeader className="text-center relative">
              <button
                onClick={handleSkipOnboarding}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
              
              <div className="p-3 bg-blue-100 rounded-full w-fit mx-auto mb-4">
                <GraduationCap className="h-8 w-8 text-blue-600" />
              </div>
              
              <CardTitle className="text-xl text-blue-900 mb-2">
                Bem-vindo ao MadenAI! 🎉
              </CardTitle>
              
              <p className="text-gray-600">
                Que tal fazer um tour rápido para conhecer todas as funcionalidades da plataforma?
              </p>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="bg-blue-50 rounded-lg p-4 text-center">
                <p className="text-sm text-blue-800 mb-2">
                  📚 <strong>Tutorial interativo de 5 minutos</strong>
                </p>
                <p className="text-xs text-blue-600">
                  Aprenda a criar projetos, gerar orçamentos, usar a IA e muito mais!
                </p>
              </div>
              
              <div className="flex flex-col space-y-2">
                <Button
                  onClick={handleStartOnboarding}
                  className="bg-blue-600 hover:bg-blue-700 text-white w-full"
                >
                  🚀 Começar Tutorial
                </Button>
                
                <Button
                  variant="ghost"
                  onClick={handleSkipOnboarding}
                  className="text-gray-500 hover:text-gray-700 w-full"
                >
                  Pular por agora
                </Button>
              </div>

              <div className="text-center">
                <p className="text-xs text-gray-500">
                  💡 Você sempre pode acessar o tutorial pelo menu lateral
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};
