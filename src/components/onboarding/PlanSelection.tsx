import React from 'react';
import { motion } from 'framer-motion';
import { Check, Star, Crown, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface PlanSelectionProps {
  userId: string;
}

const PlanSelection: React.FC<PlanSelectionProps> = ({ userId }) => {
  const plans = [
    {
      id: 'basic',
      name: 'Básico',
      price: 'R$ 97',
      period: '/mês',
      description: 'Perfeito para profissionais iniciantes',
      icon: <Zap className="w-6 h-6" />,
      features: [
        'Até 7 projetos',
        'Orçamentos automáticos',
        'Cronogramas inteligentes',
        'Suporte por email',
        'Análise de documentos',
      ],
      highlighted: false,
    },
    {
      id: 'pro',
      name: 'Profissional',
      price: 'R$ 197',
      period: '/mês',
      description: 'Ideal para profissionais e pequenas empresas',
      icon: <Star className="w-6 h-6" />,
      features: [
        'Até 20 projetos',
        'Tudo do Básico',
        'Assistente IA avançado',
        'Exportação personalizada',
        'Suporte prioritário',
        'Integração com ferramentas',
      ],
      highlighted: true,
      badge: 'Mais Popular',
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 'R$ 397',
      period: '/mês',
      description: 'Para empresas e escritórios',
      icon: <Crown className="w-6 h-6" />,
      features: [
        'Projetos ilimitados',
        'Tudo do Profissional',
        'Gestão de equipe',
        'Relatórios avançados',
        'Suporte dedicado',
        'Integração personalizada',
        'Onboarding gratuito',
      ],
      highlighted: false,
    },
  ];

  const handlePlanSelect = (planId: string) => {
    // Aqui você integrará com a Cacto
    const cactoCheckoutUrl = `https://checkout.cacto.com.br/plan/${planId}?user_id=${userId}`;
    window.location.href = cactoCheckoutUrl;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted p-4 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-6xl"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-4xl font-bold text-foreground mb-4">
              🎉 Obrigado por compartilhar suas informações!
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Agora você já pode escolher o plano da MadeAI que melhor se adapta às suas necessidades.
            </p>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <Card className={`relative h-full ${
                plan.highlighted 
                  ? 'border-primary shadow-2xl scale-105 bg-primary/5' 
                  : 'border-border shadow-lg'
              }`}>
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground px-3 py-1">
                      {plan.badge}
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center space-y-4">
                  <div className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center ${
                    plan.highlighted ? 'bg-primary text-primary-foreground' : 'bg-muted'
                  }`}>
                    {plan.icon}
                  </div>
                  
                  <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                  
                  <div className="space-y-2">
                    <div className="flex items-baseline justify-center">
                      <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                      <span className="text-muted-foreground ml-1">{plan.period}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{plan.description}</p>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start space-x-3">
                        <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    className={`w-full h-12 text-base font-semibold ${
                      plan.highlighted
                        ? 'bg-primary hover:bg-primary/90 text-primary-foreground'
                        : ''
                    }`}
                    variant={plan.highlighted ? "default" : "outline"}
                    onClick={() => handlePlanSelect(plan.id)}
                  >
                    Assinar {plan.name}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-8"
        >
          <p className="text-sm text-muted-foreground">
            Pagamento seguro via Cacto • Cancele a qualquer momento • Suporte 24/7
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default PlanSelection;