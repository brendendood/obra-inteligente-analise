import React from 'react';
import { Pricing } from "@/components/ui/pricing";
import { useAuth } from '@/hooks/useAuth';
import { motion } from 'framer-motion';
import { useUserData } from '@/hooks/useUserData';
import { Sparkles } from 'lucide-react';

const SelectPlan = () => {
  const { user } = useAuth();
  const { userData, loading } = useUserData();

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
          <div className="flex justify-center mb-6">
            <div className="bg-primary/10 p-4 rounded-full">
              <Sparkles className="w-12 h-12 text-primary" />
            </div>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Bem-vindo, {userName}!
          </h1>
          
          <div className="text-lg text-muted-foreground space-y-2">
            <p>
              Agora que te conhecemos melhor, escolha o plano ideal para você.
            </p>
            <p className="text-base">
              Comece hoje mesmo e transforme a forma como você gerencia projetos.
            </p>
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
