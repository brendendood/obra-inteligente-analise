import React from 'react';
import { Pricing } from "@/components/ui/pricing";
import { useAuth } from '@/hooks/useAuth';
import { motion } from 'framer-motion';
import { useUserData } from '@/hooks/useUserData';
import { Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const SelectPlan = () => {
  const { user } = useAuth();
  const { userData, loading } = useUserData();
  const navigate = useNavigate();

  // Buscar o nome do usuário com múltiplos fallbacks
  const getUserName = () => {
    // 1. Tentar pegar do perfil
    if (userData?.profile?.full_name) {
      return userData.profile.full_name;
    }
    
    // 2. Tentar pegar do email (parte antes do @)
    if (user?.email) {
      return user.email.split('@')[0];
    }
    
    // 3. Fallback padrão
    return 'Usuário';
  };

  const userName = getUserName();

  const plans = [
    {
      name: "BASIC",
      price: "29.90",
      yearlyPrice: "23.92",
      period: "mês",
      features: [
        "Até 5 projetos ativos",
        "300 mensagens de IA/mês",
        "Orçamento e Cronograma básicos",
        "Suporte padrão"
      ],
      description: "Ideal para profissionais autônomos que querem economizar tempo e aumentar a precisão dos orçamentos.",
      buttonText: "Assinar Mensal",
      href: "https://buy.stripe.com/cNi7sL4mE0JUatVf9N2B200",
      yearlyHref: "https://buy.stripe.com/3cI6oH4mEcsCatVgdR2B201",
      isPopular: false
    },
    {
      name: "PRO",
      price: "79.90",
      yearlyPrice: "63.92",
      period: "mês",
      features: [
        "Tudo do Basic +",
        "Até 10 projetos ativos",
        "800 mensagens de IA/mês",
        "Exportações avançadas (orçamento e cronograma)",
        "Análise técnica de documentos",
        "Assistente IA do projeto",
        "Suporte prioritário"
      ],
      description: "Perfeito para escritórios que querem mais recursos e análises avançadas.",
      buttonText: "Assinar Mensal",
      href: "https://buy.stripe.com/3cIdR93iAcsC7hJ7Hl2B202",
      yearlyHref: "https://buy.stripe.com/3cI5kD06oeAK7hJ6Dh2B203",
      isPopular: true
    },
    {
      name: "ENTERPRISE",
      price: "199.90",
      yearlyPrice: "159.92",
      period: "mês",
      features: [
        "Tudo do Pro +",
        "Até 50 projetos ativos",
        "1.500 mensagens de IA/mês",
        "CRM integrado",
        "Integrações via API (em desenvolvimento)",
        "Suporte dedicado com gerente de conta"
      ],
      description: "Para construtoras e empresas que precisam de volumes altos e integrações personalizadas.",
      buttonText: "Assinar Mensal",
      href: "https://buy.stripe.com/aFa8wPdXeeAK31t4v92B204",
      yearlyHref: "https://buy.stripe.com/aFa3cv06ogIS8lN0eT2B205",
      isPopular: false
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Mensagem de boas-vindas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-4xl mx-auto mb-12"
        >
          <div className="text-6xl mb-6">🚀</div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Olá, {userName}!
          </h1>
          
          <div className="text-lg text-muted-foreground space-y-2 mb-8">
            <p>
              Seu cadastro <span className="font-medium text-foreground">({user?.email})</span> foi concluído com sucesso.
            </p>
            <p>
              Agora escolha um dos planos abaixo para liberar acesso total à MadeAI.
            </p>
            <p className="text-base">
              Sem taxas escondidas, sem surpresas — apenas os planos transparentes que você já viu na nossa página inicial.
            </p>
          </div>
        </motion.div>

        {/* Botão de Trial Gratuito */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="max-w-4xl mx-auto mb-8"
        >
          <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-background border-2 border-primary/20 rounded-2xl p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex-1 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
                  <Clock className="w-5 h-5 text-primary" />
                  <h3 className="text-xl font-bold text-foreground">
                    Experimente Grátis por 7 Dias
                  </h3>
                </div>
                <p className="text-muted-foreground mb-3">
                  Sem cartão de crédito. Acesso completo ao módulo de orçamento.
                </p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>✓ 1 projeto ativo</li>
                  <li>✓ Orçamento básico completo</li>
                  <li>✓ Sem compromisso</li>
                </ul>
              </div>
              <div className="flex-shrink-0">
                <Button
                  size="lg"
                  onClick={() => navigate('/cadastro?trial=true')}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                  Começar Trial Grátis
                </Button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Seção de Preços */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <section className="py-8 lg:py-12 bg-muted/30 rounded-lg">
            <Pricing 
              plans={plans}
              title="Escolha seu plano"
              description="Todos os planos incluem acesso completo à plataforma e suporte dedicado."
            />
          </section>
        </motion.div>

        {/* Informação adicional */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center mt-8 space-y-2"
        >
          <p className="text-sm text-muted-foreground">
            💳 Pagamento 100% seguro via Stripe
          </p>
          <p className="text-sm text-muted-foreground">
            ✅ Cancele quando quiser, sem taxas ou burocracia
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default SelectPlan;
