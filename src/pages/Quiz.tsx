import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, ArrowRight, Building2, Users, Target } from 'lucide-react';

interface QuizQuestion {
  id: number;
  question: string;
  icon: React.ReactNode;
  options: { value: string; label: string }[];
}

const questions: QuizQuestion[] = [
  {
    id: 1,
    question: "Qual o tamanho da sua empresa?",
    icon: <Building2 className="w-12 h-12 text-primary" />,
    options: [
      { value: "autonomo", label: "Profissional Autônomo" },
      { value: "pequena", label: "Pequena Empresa (1-10 funcionários)" },
      { value: "media", label: "Média Empresa (11-50 funcionários)" },
      { value: "grande", label: "Grande Empresa (50+ funcionários)" },
    ],
  },
  {
    id: 2,
    question: "Quantos projetos você gerencia por mês?",
    icon: <Target className="w-12 h-12 text-primary" />,
    options: [
      { value: "1-3", label: "1 a 3 projetos" },
      { value: "4-10", label: "4 a 10 projetos" },
      { value: "11-30", label: "11 a 30 projetos" },
      { value: "30+", label: "Mais de 30 projetos" },
    ],
  },
  {
    id: 3,
    question: "Qual sua principal necessidade?",
    icon: <Users className="w-12 h-12 text-primary" />,
    options: [
      { value: "orcamento", label: "Agilizar orçamentos e cronogramas" },
      { value: "analise", label: "Análise técnica com IA" },
      { value: "gestao", label: "Gestão completa de projetos" },
      { value: "integracao", label: "Integrações com outros sistemas" },
    ],
  },
];

export default function Quiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSelect = (value: string) => {
    setSelectedOption(value);
  };

  const handleNext = () => {
    if (!selectedOption) return;

    setAnswers((prev) => ({ ...prev, [currentQuestion]: selectedOption }));
    setSelectedOption(null);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      // Quiz finalizado, redirecionar para seleção de planos
      navigate('/selecionar-plano');
    }
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const question = questions[currentQuestion];

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-muted-foreground">
              Pergunta {currentQuestion + 1} de {questions.length}
            </span>
            <span className="text-sm font-medium text-primary">{Math.round(progress)}%</span>
          </div>
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Question Card */}
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="border-2">
            <CardContent className="p-8">
              <div className="flex flex-col items-center text-center mb-8">
                <div className="mb-6">{question.icon}</div>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                  {question.question}
                </h2>
                <p className="text-muted-foreground">Escolha a opção que melhor descreve você</p>
              </div>

              <div className="space-y-3">
                {question.options.map((option) => (
                  <motion.button
                    key={option.value}
                    onClick={() => handleSelect(option.value)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                      selectedOption === option.value
                        ? 'border-primary bg-primary/10 shadow-md'
                        : 'border-border hover:border-primary/50 bg-card'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-foreground">{option.label}</span>
                      {selectedOption === option.value && (
                        <CheckCircle2 className="w-5 h-5 text-primary" />
                      )}
                    </div>
                  </motion.button>
                ))}
              </div>

              <div className="mt-8 flex justify-end">
                <Button
                  onClick={handleNext}
                  disabled={!selectedOption}
                  size="lg"
                  className="gap-2"
                >
                  {currentQuestion < questions.length - 1 ? (
                    <>
                      Próxima <ArrowRight className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      Ver Planos <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Steps Indicator */}
        <div className="flex justify-center gap-2 mt-6">
          {questions.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all ${
                index <= currentQuestion ? 'w-8 bg-primary' : 'w-2 bg-muted'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
