import React from 'react';
import { motion } from 'framer-motion';
import { Check, Star, Crown, Zap, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface PaywallPageProps {
  userId: string;
}

const PaywallPage: React.FC<PaywallPageProps> = ({ userId }) => {
  const plans = [
    {
      id: 'basic',
      name: 'Básico',
      price: 'R$ 97',
      period: '/mês',
      description: 'Perfeito para profissionais iniciantes',
      icon: <Zap className="w-6 h-6" />,
      features: [
        'Até 7 projetos por mês',
        'Orçamentos automáticos',
        'Cronogramas inteligentes',
        'Análise de documentos',
        'Suporte por email',
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
        'Até 20 projetos por mês',
        'Tudo do Básico',
        'Assistente IA avançado',
        'Exportação personalizada',
        'Integração com ferramentas',
        'Suporte prioritário',
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
        'Integração personalizada',
        'Suporte dedicado',
        'Onboarding gratuito',
      ],
      highlighted: false,
    },
  ];

  const handlePlanSelect = (planId: string) => {
    // Redirecionar para checkout da Cacto com user_id no metadata
    const cactoCheckoutUrl = `https://checkout.cacto.com.br/plan/${planId}?metadata=${encodeURIComponent(JSON.stringify({ user_id: userId }))}`;
    window.location.href = cactoCheckoutUrl;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-7xl"
      >
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-4xl mx-auto"
          >
            <h1 className="text-5xl font-bold text-foreground mb-6">
              🎉 Obrigado por se cadastrar e concluir o quiz!
            </h1>
            <p className="text-2xl text-muted-foreground leading-relaxed">
              Agora escolha o plano da MadeAI que melhor se adapta às suas necessidades para começar a usar a plataforma.
            </p>
          </motion.div>
        </div>

        {/* Plans Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <Card className={`relative h-full transition-all duration-300 hover:shadow-xl ${
                plan.highlighted 
                  ? 'border-primary shadow-2xl scale-105 bg-primary/5 ring-2 ring-primary/20' 
                  : 'border-border shadow-lg hover:scale-105'
              }`}>
                {plan.badge && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground px-4 py-2 text-sm font-semibold">
                      {plan.badge}
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center space-y-6 pb-8">
                  <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center ${
                    plan.highlighted ? 'bg-primary text-primary-foreground' : 'bg-muted'
                  }`}>
                    {plan.icon}
                  </div>
                  
                  <CardTitle className="text-3xl font-bold">{plan.name}</CardTitle>
                  
                  <div className="space-y-3">
                    <div className="flex items-baseline justify-center">
                      <span className="text-5xl font-bold text-foreground">{plan.price}</span>
                      <span className="text-muted-foreground ml-2 text-lg">{plan.period}</span>
                    </div>
                    <p className="text-muted-foreground">{plan.description}</p>
                  </div>
                </CardHeader>

                <CardContent className="space-y-8">
                  <ul className="space-y-4">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start space-x-3">
                        <Check className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                        <span className="text-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    size="lg"
                    className={`w-full h-14 text-lg font-semibold transition-all duration-300 ${
                      plan.highlighted
                        ? 'bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl'
                        : 'hover:scale-105'
                    }`}
                    variant={plan.highlighted ? "default" : "outline"}
                    onClick={() => handlePlanSelect(plan.id)}
                  >
                    <span>Assinar {plan.name}</span>
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-12"
        >
          <div className="max-w-2xl mx-auto space-y-4">
            <p className="text-muted-foreground">
              💳 Pagamento seguro via Cacto • 🔄 Cancele a qualquer momento • 📞 Suporte 24/7
            </p>
            <p className="text-sm text-muted-foreground">
              Após confirmar o pagamento, você terá acesso imediato a todas as funcionalidades do seu plano.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default PaywallPage;