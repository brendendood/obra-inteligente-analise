import React from 'react';
import { Pricing } from "@/components/ui/pricing";
import { useAuth } from '@/hooks/useAuth';
import { motion } from 'framer-motion';
import { useUserData } from '@/hooks/useUserData';

const PricingBlocked = () => {
  const { user } = useAuth();
  const { userData } = useUserData();

  // Dados do usuário para personalização
  const userName = userData?.profile?.full_name || user?.email?.split('@')[0] || 'Usuário';
  const userEmail = user?.email || 'seu@email.com';

  const plans = [
    {
      name: "BASIC",
      price: "29.90",
      yearlyPrice: "23.92",
      period: "mês",
      features: [
        "Análise Geral (normas ABNT)",
        "Uso individual",
        "Até 5 projetos",
        "500 mensagens de IA/mês",
        "Cronograma, orçamento e documentos básicos",
        "Exportação simples",
        "1 automação via webhook",
        "Suporte em até 48h"
      ],
      description: "Ideal para profissionais autônomos que querem economizar tempo e aumentar a precisão dos orçamentos.",
      buttonText: "Assinar Basic",
      href: `https://checkout.cacto.com.br/plan/basic?metadata=${encodeURIComponent(JSON.stringify({ user_id: user?.id }))}`,
      isPopular: false
    },
    {
      name: "PRO",
      price: "79.90",
      yearlyPrice: "63.92",
      period: "mês",
      features: [
        "Análise Geral (normas ABNT)",
        "Colaboração com até 3 usuários inclusos",
        "Até 25 projetos",
        "2.000 mensagens de IA/mês",
        "Cronograma, orçamento e documentos avançados",
        "Permissões por papel",
        "Até 5 automações integradas",
        "Exportações avançadas",
        "Suporte prioritário (<24h)"
      ],
      description: "Perfeito para escritórios que querem colaboração em equipe e análises mais avançadas.",
      buttonText: "Assinar Pro",
      href: `https://checkout.cacto.com.br/plan/pro?metadata=${encodeURIComponent(JSON.stringify({ user_id: user?.id }))}`,
      isPopular: true
    },
    {
      name: "ENTERPRISE",
      price: "199.90",
      yearlyPrice: "159.92",
      period: "mês",
      features: [
        "Análise Geral (normas ABNT)",
        "Até 10 usuários inclusos",
        "Projetos ilimitados",
        "Mensagens de IA ilimitadas",
        "50 GB de anexos",
        "SSO (Single Sign-On)",
        "Auditoria completa",
        "Integração nativa com Sienge/ERP",
        "Auditoria técnica completa",
        "SLA 99,9%",
        "Gerente de conta dedicado",
        "Contrato customizado",
        "Onboarding e treinamento"
      ],
      description: "Para construtoras e empresas que precisam de volumes altos, integrações e suporte dedicado.",
      buttonText: "Agendar Demo",
      href: "/contact",
      isPopular: false
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Container principal */}
      <div className="container mx-auto px-4 py-8">
        {/* Mensagem personalizada no topo */}
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
              Seu cadastro <span className="font-medium text-foreground">({userEmail})</span> foi concluído com sucesso.
            </p>
            <p>
              Agora escolha um dos planos abaixo para liberar acesso total à MadeAI.
            </p>
            <p className="text-base">
              Sem taxas escondidas, sem surpresas — apenas os planos transparentes que você já viu na nossa página inicial.
            </p>
          </div>
        </motion.div>

        {/* Seção de Preços - Idêntica à landing page */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <section className="py-8 lg:py-12 bg-muted/30 rounded-lg">
            <Pricing 
              plans={plans}
              title="Preços transparentes. Sem surpresas."
              description="Comece grátis hoje. Aumente de plano quando precisar de mais recursos. Cancele quando quiser, sem taxa ou burocracia."
            />
          </section>
        </motion.div>

        {/* Informação adicional */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center mt-8 text-sm text-muted-foreground"
        >
          <p>
            📧 Ao assinar, você receberá a confirmação no e-mail <strong>{userEmail}</strong>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default PricingBlocked;