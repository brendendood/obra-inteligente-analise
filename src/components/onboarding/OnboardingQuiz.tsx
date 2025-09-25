import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface QuizData {
  step1_context: string;
  step2_role: string;
  step3_challenge: string[];
}

interface OnboardingQuizProps {
  onComplete: () => void;
  userId: string;
}

const OnboardingQuiz: React.FC<OnboardingQuizProps> = ({ onComplete, userId }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [quizData, setQuizData] = useState<QuizData>({
    step1_context: '',
    step2_role: '',
    step3_challenge: []
  });

  const contextOptions = [
    { value: 'empresa', label: 'Trabalho em uma empresa' },
    { value: 'autonomo', label: 'Sou autônomo(a)' },
    { value: 'estudante', label: 'Sou estudante' }
  ];

  const challengeOptions = [
    { value: 'prazo', label: 'Prazo de entrega' },
    { value: 'orcamento', label: 'Controle de orçamento' },
    { value: 'equipe', label: 'Gestão de equipe' },
    { value: 'documentos', label: 'Organização de documentos' },
    { value: 'qualidade', label: 'Controle de qualidade' },
    { value: 'materiais', label: 'Gestão de materiais' },
    { value: 'comunicacao', label: 'Comunicação com clientes' },
    { value: 'normas', label: 'Conformidade com normas' },
    { value: 'tecnologia', label: 'Adoção de novas tecnologias' },
    { value: 'sustentabilidade', label: 'Sustentabilidade' },
    { value: 'outro', label: 'Outro' }
  ];

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!quizData.step1_context || !quizData.step2_role || quizData.step3_challenge.length === 0) {
      toast.error('Por favor, preencha todas as etapas');
      return;
    }

    setLoading(true);
    try {
      // Salvar respostas do quiz
      const { error: quizError } = await supabase
        .from('user_quiz_responses')
        .insert([{
          user_id: userId,
          step1_context: quizData.step1_context,
          step2_role: quizData.step2_role,
          step3_challenge: quizData.step3_challenge
        }]);

      if (quizError) throw quizError;

      // Marcar quiz como completado
      const { error: profileError } = await supabase
        .from('user_profiles')
        .update({ quiz_completed: true })
        .eq('user_id', userId);

      if (profileError) throw profileError;

      toast.success('Quiz completado com sucesso!');
      onComplete();
    } catch (error) {
      console.error('Erro ao salvar quiz:', error);
      toast.error('Erro ao completar quiz. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return quizData.step1_context !== '';
      case 2:
        return quizData.step2_role.trim() !== '';
      case 3:
        return quizData.step3_challenge.length > 0;
      default:
        return false;
    }
  };

  const toggleChallenge = (value: string) => {
    setQuizData(prev => ({
      ...prev,
      step3_challenge: prev.step3_challenge.includes(value)
        ? prev.step3_challenge.filter(item => item !== value)
        : [...prev.step3_challenge, value]
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted p-4 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl"
      >
        <Card className="shadow-2xl border-0 bg-card/95 backdrop-blur">
          <CardHeader className="text-center space-y-4">
            <div className="flex justify-center space-x-2">
              {[1, 2, 3].map((step) => (
                <div
                  key={step}
                  className={`w-3 h-3 rounded-full ${
                    step <= currentStep ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              ))}
            </div>
            <CardTitle className="text-2xl font-bold text-foreground">
              Vamos conhecer você melhor
            </CardTitle>
            <p className="text-muted-foreground">
              Etapa {currentStep} de 3 - Isso nos ajuda a personalizar sua experiência
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            <AnimatePresence mode="wait">
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <h3 className="text-lg font-semibold text-foreground">
                    Você trabalha em uma empresa ou atua de forma independente?
                  </h3>
                  <div className="grid gap-3">
                    {contextOptions.map((option) => (
                      <Button
                        key={option.value}
                        variant={quizData.step1_context === option.value ? "default" : "outline"}
                        className="justify-start h-auto p-4 text-left"
                        onClick={() => setQuizData(prev => ({ ...prev, step1_context: option.value }))}
                      >
                        <div className="flex items-center space-x-3">
                          {quizData.step1_context === option.value && (
                            <CheckCircle className="w-5 h-5 text-primary-foreground" />
                          )}
                          <span>{option.label}</span>
                        </div>
                      </Button>
                    ))}
                  </div>
                </motion.div>
              )}

              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <h3 className="text-lg font-semibold text-foreground">
                    Qual é a sua função principal hoje?
                  </h3>
                  <Input
                    placeholder="Ex.: Arquiteto, Engenheiro Civil, Estagiário..."
                    value={quizData.step2_role}
                    onChange={(e) => setQuizData(prev => ({ ...prev, step2_role: e.target.value }))}
                    className="text-base h-12"
                  />
                </motion.div>
              )}

              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <h3 className="text-lg font-semibold text-foreground">
                    Quais são os seus principais desafios hoje em projetos de arquitetura/engenharia?
                  </h3>
                  <p className="text-sm text-muted-foreground">Selecione uma ou mais opções</p>
                  <div className="grid gap-3">
                    {challengeOptions.map((option) => (
                      <Button
                        key={option.value}
                        variant={quizData.step3_challenge.includes(option.value) ? "default" : "outline"}
                        className="justify-start h-auto p-4 text-left"
                        onClick={() => toggleChallenge(option.value)}
                      >
                        <div className="flex items-center space-x-3">
                          {quizData.step3_challenge.includes(option.value) && (
                            <CheckCircle className="w-5 h-5 text-primary-foreground" />
                          )}
                          <span>{option.label}</span>
                        </div>
                      </Button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex justify-between pt-6">
              <Button
                variant="ghost"
                onClick={handleBack}
                disabled={currentStep === 1}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Voltar</span>
              </Button>

              <Button
                onClick={handleNext}
                disabled={!canProceed() || loading}
                className="flex items-center space-x-2"
              >
                <span>{currentStep === 3 ? 'Finalizar' : 'Próximo'}</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default OnboardingQuiz;