import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { AppleButton } from '@/components/ui/apple-button';
import { CtaGlow } from '@/components/ui/cta-glow';
import { ArrowRight, Star, Brain, Calculator, Calendar, FileText, TrendingUp, Shield, Check, Upload, Users, BarChart3, Download, PlayCircle, Menu, X } from 'lucide-react';
import { HeroPill } from '@/components/ui/hero-pill';
import { Typewriter } from '@/components/ui/typewriter';
import { SectionDivider } from '@/components/ui/section-divider';
import { Footerdemo } from '@/components/ui/footer-section';
import { FAQ } from '@/components/ui/faq-tabs';
import { CounterStats } from '@/components/ui/counter-stats';
import MadeAITwoCardsSection from "@/components/sections/madeai-two-cards";
import { GlowingEffect } from '@/components/ui/glowing-effect';
import { ArchitectureSaaSBackground } from '@/components/ui/architecture-saas-background';
import Header from '@/components/layout/Header';
import { MadeAIFeaturesSection } from '@/components/sections/madeai-features';
import { CheckCircle } from 'lucide-react';
import { cn } from "@/lib/utils";
import { Pricing } from "@/components/ui/pricing";
import { TestPhaseHeading } from "@/components/sections/test-phase-heading";
import CardFlip from "@/components/ui/flip-card";

// GridItem component for Features section
interface GridItemProps {
  area: string;
  icon: React.ReactNode;
  title: string;
  description: React.ReactNode;
}
const GridItem = ({
  area,
  icon,
  title,
  description
}: GridItemProps) => {
  return <li className={cn("min-h-[14rem] list-none", area)}>
      <div className="relative h-full rounded-[1.25rem] border-[0.75px] border-border p-2 md:rounded-[1.5rem] md:p-3">
        <GlowingEffect spread={40} glow={true} disabled={false} proximity={64} inactiveZone={0.01} borderWidth={3} />
        <div className="relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-xl border-[0.75px] bg-background p-6 shadow-sm dark:shadow-[0px_0px_27px_0px_rgba(45,45,45,0.3)] md:p-6">
          <div className="relative flex flex-1 flex-col justify-between gap-3">
            <div className="w-fit rounded-lg border-[0.75px] border-border bg-muted p-2">
              {icon}
            </div>
            <div className="space-y-3">
              <h3 className="pt-0.5 text-xl leading-[1.375rem] font-semibold font-sans tracking-[-0.04em] md:text-2xl md:leading-[1.875rem] text-balance text-foreground">
                {title}
              </h3>
              <h2 className="[&_b]:md:font-semibold [&_strong]:md:font-semibold font-sans text-sm leading-[1.125rem] md:text-base md:leading-[1.375rem] text-muted-foreground">
                {description}
              </h2>
            </div>
          </div>
        </div>
      </div>
    </li>;
};
const LandingPage = () => {
  return <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section with ArchitectureSaaSBackground */}
      <ArchitectureSaaSBackground>
        <div className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 pt-20 py-[44px] my-0 mx-0">
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.8
        }} className="text-center max-w-4xl mx-auto py-[25px]">
            {/* HeroPill */}
            <div className="mb-6 sm:mb-8">
              <HeroPill href="/cadastro" label="Para arquitetos e engenheiros do Brasil" announcement="🎯 Grátis" className="mx-auto" />
            </div>

            {/* Main Headline */}
            <h1 className="text-center text-4xl md:text-6xl lg:text-7xl font-semibold leading-tight tracking-tight text-foreground">
              {/* Linha 1 (fixa para todos) */}
              <span className="block">Automatize seu</span>

              {/* Linha 2:
                  - Desktop/tablet: animação Typewriter alternando as palavras
                  - Mobile: animação Typewriter também */}
              <span className="block">
                <Typewriter text={["Orçamento", "Cronograma", "Projeto"]} speed={70} deleteSpeed={40} waitTime={4000} className="text-primary" cursorChar={"_"} />
              </span>

              {/* Linha 3 (fixa para todos) */}
              <span className="block">com a MadeAI</span>
            </h1>

            <p className="sm:text-lg md:text-xl lg:text-2xl text-muted-foreground mb-6 sm:mb-8 max-w-3xl mx-auto leading-relaxed text-base">
              Pare de perder dias criando orçamentos manualmente. Nossa IA analisa seus projetos (PDF, DWG) e entrega orçamentos precisos, cronogramas realistas e detecta falhas construtivas em minutos. Baseado em normas ABNT e dados SINAPI.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-8 sm:mb-12">
              <AppleButton as={Link} to="/cadastro" variant="primary" size="lg" className="w-full sm:w-auto">
                Teste Grátis Agora
              </AppleButton>
              <AppleButton as={Link} to="/demo" variant="ghost" size="lg" className="w-full sm:w-auto">
                Ver Como Funciona
              </AppleButton>
            </div>

            {/* Trust Indicators */}
            <TestPhaseHeading />
          </motion.div>
        </div>
      </ArchitectureSaaSBackground>

      {/* Social Proof Section - Seção 2 com fundo preto no dark mode */}
      <section className="sm:py-16 bg-[#fdfdfd]/30 dark:bg-black dark:shadow-none py-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6
        }} viewport={{
          once: true
        }} className="text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Dados oficiais que você pode confiar</h2>
            <p className="text-muted-foreground mb-6 sm:mb-8 text-base sm:text-lg">Orçamentos baseados em SINAPI, Sienge e normas ABNT atualizadas. Sem estimativas, apenas dados reais do mercado brasileiro.</p>
            <div className="flex justify-center items-center mb-6 sm:mb-8">
              <div className="relative w-full max-w-[600px] aspect-[3/2]">
                <iframe src="https://lottie.host/embed/765bd57d-872c-4837-acb7-118aca836ff6/REpljcsv0j.lottie" className="w-full h-full rounded-lg" style={{
                background: 'transparent'
              }} frameBorder="0" allowFullScreen />
              </div>
            </div>
            
          </motion.div>
        </div>
      </section>

      {/* Counter Stats */}
      <CounterStats />

      

      <SectionDivider from="#fafafa" to="#ffffff" height={32} />

      {/* Problem & Solution Section */}
      <section className="sm:py-16 lg:py-20 bg-background text-foreground py-[21px]">
        <div className="max-w-7xl mx-auto sm:px-6 px-[34px]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
            <motion.div initial={{
            opacity: 0,
            x: -20
          }} whileInView={{
            opacity: 1,
            x: 0
          }} transition={{
            duration: 0.6
          }} viewport={{
            once: true
          }} className="py-0 px-0">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4 sm:mb-6">
                Você está perdendo tempo e dinheiro com orçamentos manuais
              </h2>
              <div className="space-y-3 sm:space-y-4 text-muted-foreground px-[19px]">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-destructive rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm sm:text-base"><strong>3-5 dias</strong> para criar um orçamento simples</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-destructive rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm sm:text-base"><strong>Erros custosos</strong> por planilhas desatualizadas</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-destructive rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm sm:text-base"><strong>Perda de clientes</strong> pela demora na resposta</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-destructive rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm sm:text-base"><strong>Falhas construtivas</strong> descobertas só na obra</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-destructive rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm sm:text-base"><strong>Cronogramas irreais</strong> que geram atrasos</p>
                </div>
              </div>
            </motion.div>

            <motion.div initial={{
            opacity: 0,
            x: 20
          }} whileInView={{
            opacity: 1,
            x: 0
          }} transition={{
            duration: 0.6
          }} viewport={{
            once: true
          }} className="bg-gradient-to-br from-primary/5 to-primary/10 p-4 sm:p-6 lg:p-8 rounded-2xl border border-primary/20">
              <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-4 sm:mb-6">Agora você consegue em minutos:</h3>
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-primary mt-1 sm:mt-0.5 flex-shrink-0" />
                  <p className="text-foreground text-sm sm:text-base"><strong>Orçamentos precisos</strong> com dados SINAPI e Sienge atualizados</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-primary mt-1 sm:mt-0.5 flex-shrink-0" />
                  <p className="text-foreground text-sm sm:text-base"><strong>Cronogramas realistas</strong> baseados em projetos similares</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-primary mt-1 sm:mt-0.5 flex-shrink-0" />
                  <p className="text-foreground text-sm sm:text-base"><strong>Detecção de falhas</strong> antes que virem problemas custosos</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-primary mt-1 sm:mt-0.5 flex-shrink-0" />
                  <p className="text-foreground text-sm sm:text-base"><strong>Relatórios profissionais</strong> prontos para apresentar</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <MadeAIFeaturesSection />

      {/* Why Choose Section */}
      <section className="py-16 md:py-20 bg-background">
        <div className="max-w-container mx-auto px-4">
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6
        }} viewport={{
          once: true
        }} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Por que mais de 450 profissionais escolheram a MadeAI?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Economize 90% do tempo em orçamentos e elimine erros custosos antes que aconteçam
            </p>
          </motion.div>

          {/* Orientação para o usuário */}
          <div className="text-center mb-8">
            <p className="text-sm text-muted-foreground">💡 Dica: clique no card para ver os detalhes.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center mb-12">
            <CardFlip
              title="De 5 dias para 5 minutos"
              subtitle="Economia de tempo radical"
              description="Economize 90% do tempo em orçamentos. Analise projetos completos instantaneamente e responda clientes no mesmo dia."
              features={[
                "Análise instantânea de projetos",
                "Resposta no mesmo dia",
                "90% menos tempo gasto",
                "Processamento automático"
              ]}
              color="#2563eb"
            />
            <CardFlip
              title="Confiabilidade técnica comprovada"
              subtitle="Dados oficiais e precisos"
              description="Dados SINAPI e Sienge atualizados, normas ABNT validadas. Já usado por +450 profissionais com 98% de precisão."
              features={[
                "Dados SINAPI atualizados",
                "Normas ABNT validadas", 
                "+450 profissionais confiam",
                "98% de precisão comprovada"
              ]}
              color="#2563eb"
            />
            <CardFlip
              title="Evite erros custosos"
              subtitle="Prevenção inteligente de problemas"
              description="Nossa IA detecta falhas construtivas que custam R$ 30.000+ na obra. Previna problemas antes que aconteçam."
              features={[
                "Detecção de falhas construtivas",
                "Economia de R$ 30.000+",
                "Prevenção inteligente",
                "Análise preditiva de riscos"
              ]}
              color="#2563eb"
            />
          </div>

          {/* CTA Button */}
          <div className="text-center">
            <AppleButton as={Link} to="/cadastro" variant="primary" size="lg">
              Começar agora
            </AppleButton>
          </div>
        </div>
      </section>

      {/* Two Cards Section */}
      <MadeAITwoCardsSection />

      <SectionDivider from="#fafafa" to="#ffffff" height={32} />

      {/* Demo Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-background text-foreground">
        <div className="max-w-7xl mx-auto sm:px-6 px-[29px]">
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6
        }} viewport={{
          once: true
        }} className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 sm:mb-4">
              Como funciona: de upload a relatório pronto
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              Simples como fazer upload de um arquivo. Complexo como ter uma equipe de analistas trabalhando para você.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 items-center">
            <motion.div initial={{
            opacity: 0,
            x: -20
          }} whileInView={{
            opacity: 1,
            x: 0
          }} transition={{
            duration: 0.6
          }} viewport={{
            once: true
          }}>
              <img src="/src/assets/hero-dashboard-mockup.jpg" alt="Dashboard MadeAI" className="w-full h-auto rounded-lg sm:rounded-xl shadow-lg sm:shadow-2xl border border-border object-contain" loading="lazy" />
            </motion.div>
            
            <motion.div initial={{
            opacity: 0,
            x: 20
          }} whileInView={{
            opacity: 1,
            x: 0
          }} transition={{
            duration: 0.6
          }} viewport={{
            once: true
          }} className="space-y-4 sm:space-y-6">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-primary font-bold text-sm sm:text-base">1</span>
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-foreground mb-1">Upload Simples</h3>
                  <p className="text-sm sm:text-base text-muted-foreground">Arraste seu projeto (PDF, DWG, BIM) ou escolha da sua pasta. Funciona até no celular.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-primary font-bold text-sm sm:text-base">2</span>
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-foreground mb-1">IA Trabalha Para Você</h3>
                  <p className="text-sm sm:text-base text-muted-foreground">Nossa IA lê plantas, calcula quantitativos, consulta preços SINAPI e identifica riscos automaticamente.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-primary font-bold text-sm sm:text-base">3</span>
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-foreground mb-1">Relatórios Profissionais Prontos</h3>
                  <p className="text-sm sm:text-base text-muted-foreground">Orçamento detalhado, cronograma realista e análise de riscos. Baixe em PDF ou Excel e apresente para o cliente.</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="sm:py-16 lg:py-20 bg-muted/30 text-foreground py-[9px]">
        <Pricing plans={[{
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
      }, {
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
      }, {
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
        description: "Para construtoras e empresas que precisam de volumes altos, integrações e suporte dedicado.",
        buttonText: "Assinar Mensal",
        href: "https://buy.stripe.com/aFa8wPdXeeAK31t4v92B204",
        yearlyHref: "https://buy.stripe.com/aFa3cv06ogIS8lN0eT2B205",
        isPopular: false
      }]} title="Preços transparentes. Sem surpresas." description="Comece grátis hoje. Aumente de plano quando precisar de mais recursos. Cancele quando quiser, sem taxa ou burocracia." />
      </section>

      <SectionDivider from="#fafafa" to="#ffffff" height={32} />

      {/* FAQ Section */}
      <FAQ title="Perguntas Frequentes" subtitle="Tire suas dúvidas sobre a MadeAI" categories={{
      "geral": "Sobre a MadeAI",
      "planos": "Planos e Preços",
      "tecnico": "Parte Técnica",
      "projetos": "Projetos e Arquitetura"
    }} faqData={{
      "geral": [{
        question: "O que é a MadeAI?",
        answer: "A MadeAI é uma plataforma de inteligência artificial voltada para engenheiros e arquitetos. Ela auxilia na análise de projetos, dúvidas técnicas e na organização de documentos de forma prática e confiável."
      }, {
        question: "A MadeAI substitui um profissional de arquitetura ou engenharia?",
        answer: "Não. A MadeAI é uma ferramenta de apoio que ajuda profissionais e estudantes, mas não substitui a responsabilidade técnica de um engenheiro ou arquiteto."
      }, {
        question: "A MadeAI segue normas brasileiras?",
        answer: "Sim. A IA da MadeAI foi treinada para responder com base em normas técnicas brasileiras, garantindo maior segurança e confiabilidade nas respostas."
      }, {
        question: "Preciso ter conhecimento avançado para usar a MadeAI?",
        answer: "Não. A plataforma foi desenvolvida para ser simples e intuitiva, permitindo que qualquer pessoa da área consiga aproveitar seus recursos sem dificuldades."
      }],
      "planos": [{
        question: "A MadeAI é gratuita?",
        answer: "A MadeAI possui um plano inicial gratuito com recursos limitados. Também oferece planos pagos que desbloqueiam funcionalidades avançadas, como maior limite de projetos e acesso completo aos agentes de IA."
      }, {
        question: "Quais são as opções de planos disponíveis?",
        answer: "Atualmente oferecemos um plano gratuito e planos pagos com diferentes níveis de acesso. Os planos pagos incluem mais armazenamento, agentes especializados e suporte prioritário."
      }, {
        question: "Posso cancelar meu plano a qualquer momento?",
        answer: "Sim. O cancelamento pode ser feito diretamente na plataforma, sem taxas adicionais ou burocracia."
      }, {
        question: "Há desconto para empresas ou equipes?",
        answer: "Sim. A MadeAI oferece planos corporativos para empresas que desejam integrar equipes inteiras, com valores diferenciados e recursos extras."
      }],
      "tecnico": [{
        question: "Quais tecnologias a MadeAI utiliza?",
        answer: "A MadeAI é construída com tecnologias modernas como React, Tailwind, Supabase e integração com modelos de IA avançados. Tudo isso garante rapidez, segurança e escalabilidade."
      }, {
        question: "Preciso instalar algum programa para usar?",
        answer: "Não. A MadeAI é 100% online e pode ser acessada diretamente pelo navegador, sem necessidade de instalação."
      }, {
        question: "Meus dados e projetos estão seguros?",
        answer: "Sim. Utilizamos padrões de segurança e criptografia para proteger as informações dos usuários, além de armazenar dados em servidores confiáveis."
      }, {
        question: "A MadeAI funciona no celular?",
        answer: "Sim. A plataforma é responsiva e pode ser acessada tanto no computador quanto em dispositivos móveis."
      }],
      "projetos": [{
        question: "Quais tipos de projetos posso analisar na MadeAI?",
        answer: "Você pode analisar projetos de arquitetura e engenharia civil, incluindo cronogramas, orçamentos e documentos técnicos."
      }, {
        question: "A MadeAI interpreta plantas e arquivos PDF?",
        answer: "Sim. A plataforma permite o upload de arquivos PDF e oferece recursos de leitura e análise para auxiliar na interpretação de documentos."
      }, {
        question: "Posso compartilhar meus projetos com outras pessoas?",
        answer: "Sim. A MadeAI permite colaboração, facilitando o compartilhamento de informações entre equipes e clientes."
      }, {
        question: "Existe limite de projetos que posso carregar?",
        answer: "Depende do seu plano. O plano gratuito possui limite reduzido, enquanto os planos pagos oferecem maior capacidade de armazenamento e análise."
      }]
    }} className="sm:py-16 lg:py-20 py-[26px] px-[34px]" />

      <SectionDivider from="#fafafa" to="#ffffff" height={32} />

      {/* Final CTA Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-background text-foreground">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6
        }} viewport={{
          once: true
        }}>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4 sm:mb-6">
              Pronto para economizar 90% do tempo nos seus orçamentos?
            </h2>
             <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-6 sm:mb-8 max-w-2xl mx-auto">
               Faça upload do seu próximo projeto agora e veja resultados em minutos. Teste grátis, sem cartão, sem compromisso.
             </p>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
              <AppleButton as={Link} to="/cadastro" variant="primary" size="lg" className="w-full sm:w-auto">
                Teste Grátis Agora
              </AppleButton>
              <AppleButton as={Link} to="/contato" variant="secondary" size="lg" className="w-full sm:w-auto">
                Agendar Demo 15min
              </AppleButton>
            </div>

            <p className="text-xs sm:text-sm text-muted-foreground mt-3 sm:mt-4">
              ✅ Grátis para sempre • ✅ Sem cartão • ✅ Setup em 2 minutos
            </p>
          </motion.div>
        </div>
      </section>

      <Footerdemo />
    </div>;
};
export default LandingPage;