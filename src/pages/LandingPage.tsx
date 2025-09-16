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
        }} className="text-center max-w-4xl mx-auto">
            {/* HeroPill */}
            <div className="mb-6 sm:mb-8">
              <HeroPill href="/cadastro" label="Revolucione seus projetos com IA" announcement="🚀 Novo" className="mx-auto" />
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

            <p className="sm:text-lg md:text-xl lg:text-2xl text-muted-foreground mb-6 sm:mb-8 max-w-3xl mx-auto leading-relaxed text-base">É simples, você faz upload do seu projeto em PDF ou DWG, a MadeAI analisa e te da resultados precisos e completos de orçamento, cronograma e análise de conflito entre
 projetos.
          </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-8 sm:mb-12">
              <AppleButton as={Link} to="/cadastro" variant="primary" size="lg" className="w-full sm:w-auto">
                Começar Gratuitamente
              </AppleButton>
              <AppleButton as={Link} to="/demo" variant="ghost" size="lg" className="w-full sm:w-auto">
                Ver Demonstração
              </AppleButton>
            </div>

            {/* Trust Indicators */}
            <TestPhaseHeading />
          </motion.div>
        </div>
      </ArchitectureSaaSBackground>

      {/* Social Proof Section - Seção 2 com fundo preto no dark mode */}
      <section className="py-12 sm:py-16 bg-muted/30 dark:bg-black">
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
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Integração com SINAPI, Sienge e outras bases oficiais</h2>
            <p className="text-muted-foreground mb-6 sm:mb-8 text-base sm:text-lg">Acesse preços atualizados, normas e índices diretamente na plataforma</p>
            <div className="flex justify-center items-center mb-6 sm:mb-8">
              <div className="relative w-full max-w-[600px] aspect-[3/2]">
                <iframe src="https://lottie.host/embed/765bd57d-872c-4837-acb7-118aca836ff6/REpljcsv0j.lottie" className="w-full h-full rounded-lg" style={{
                background: 'transparent'
              }} frameBorder="0" allowFullScreen />
              </div>
            </div>
            <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-8 md:gap-12 opacity-60">
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Logo_IBGE.svg/200px-Logo_IBGE.svg.png" alt="SINAPI - IBGE" className="h-8 sm:h-10 md:h-12 hover:opacity-100 transition-all duration-300" />
              <img src="https://supabase.com/brand-assets/supabase-logo-wordmark--dark.svg" alt="Supabase" className="h-8 sm:h-10 md:h-12 hover:opacity-100 transition-all duration-300" />
              <img src="https://docs.n8n.io/favicon.svg" alt="N8N" className="h-10 sm:h-12 md:h-16 hover:opacity-100 transition-all duration-300" />
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
          }}>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4 sm:mb-6">
                Chega de orçamentos manuais que levam dias
              </h2>
              <div className="space-y-3 sm:space-y-4 text-muted-foreground">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-destructive rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm sm:text-base">Planilhas complexas e propensas a erros humanos</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-destructive rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm sm:text-base">Consultas manuais a múltiplas tabelas de preços</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-destructive rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm sm:text-base">Cronogramas desatualizados e irreais</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-destructive rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm sm:text-base">Riscos de falhas construtivas não identificadas</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-destructive rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm sm:text-base">Perda de competitividade por demora na entrega</p>
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
              <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-4 sm:mb-6">Nossa IA resolve tudo isso</h3>
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-primary mt-1 sm:mt-0.5 flex-shrink-0" />
                  <p className="text-foreground text-sm sm:text-base">Análise automática de plantas, cortes e elevações</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-primary mt-1 sm:mt-0.5 flex-shrink-0" />
                  <p className="text-foreground text-sm sm:text-base">Orçamentos e cronogramas precisos em minutos (baseados em SINAPI, Sienge e normas ABNT)</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-primary mt-1 sm:mt-0.5 flex-shrink-0" />
                  <p className="text-foreground text-sm sm:text-base">Alertas de falhas construtivas e inconsistências no projeto</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-primary mt-1 sm:mt-0.5 flex-shrink-0" />
                  <p className="text-foreground text-sm sm:text-base">Relatórios técnicos e planilhas exportáveis (PDF, Excel)</p>
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
              Por que escolher a MadeAI?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Transforme seu processo de gestão de obras com nossa plataforma inteligente
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[{
            icon: <TrendingUp className="h-8 w-8 text-primary" />,
            title: "Velocidade sem precedentes",
            description: "Análise completa de projetos em minutos, não dias. Nossa IA processa plantas e documentos instantaneamente."
          }, {
            icon: <Shield className="h-8 w-8 text-primary" />,
            title: "Precisão e confiabilidade",
            description: "Baseado em normas ABNT e dados SINAPI atualizados. Relatórios técnicos que você pode confiar."
          }, {
            icon: <Brain className="h-8 w-8 text-primary" />,
            title: "Insights inteligentes",
            description: "Detecte falhas construtivas e inconsistências no projeto antes que se tornem problemas custosos."
          }].map((item, index) => <motion.div key={index} initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.6,
            delay: index * 0.1
          }} viewport={{
            once: true
          }} className="text-center p-6 rounded-xl bg-card border border-border hover:shadow-lg transition-shadow">
                <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  {item.icon}
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {item.title}
                </h3>
                <p className="text-muted-foreground">
                  {item.description}
                </p>
              </motion.div>)}
          </div>
        </div>
      </section>

      {/* Two Cards Section */}
      <MadeAITwoCardsSection />

      <SectionDivider from="#fafafa" to="#ffffff" height={32} />

      {/* Demo Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-background text-foreground">
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
        }} className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 sm:mb-4">
              Veja a plataforma em ação
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              Interface intuitiva que simplifica processos complexos
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
                  <h3 className="text-base sm:text-lg font-semibold text-foreground mb-1">Upload do Projeto</h3>
                  <p className="text-sm sm:text-base text-muted-foreground">Faça upload de projetos residenciais, comerciais e industriais (PDF, DWG, BIM)</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-primary font-bold text-sm sm:text-base">2</span>
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-foreground mb-1">Análise Inteligente</h3>
                  <p className="text-sm sm:text-base text-muted-foreground">Nossa IA processa e analisa todos os elementos do projeto</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-primary font-bold text-sm sm:text-base">3</span>
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-foreground mb-1">Resultados Instantâneos</h3>
                  <p className="text-sm sm:text-base text-muted-foreground">Receba orçamentos, cronogramas e relatórios técnicos com recomendações, exportáveis em PDF e Excel</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-muted/30 text-foreground">
        <Pricing plans={[{
        name: "BASIC",
        price: "29.90",
        yearlyPrice: "23.92",
        period: "mês",
        features: ["Análise Geral (normas ABNT)", "Uso individual", "Até 5 projetos", "500 mensagens de IA/mês", "Cronograma, orçamento e documentos básicos", "Exportação simples", "1 automação via webhook", "Suporte em até 48h"],
        description: "Perfeito para profissionais autônomos que precisam organizar seus projetos com agilidade.",
        buttonText: "Começar agora",
        href: "/cadastro",
        isPopular: false
      }, {
        name: "PRO",
        price: "79.90",
        yearlyPrice: "63.92",
        period: "mês",
        features: ["Análise Geral (normas ABNT)", "Colaboração com até 3 usuários inclusos", "Até 25 projetos", "2.000 mensagens de IA/mês", "Cronograma, orçamento e documentos avançados", "Permissões por papel", "Até 5 automações integradas", "Exportações avançadas", "Suporte prioritário (<24h)"],
        description: "Ideal para pequenos escritórios de engenharia e arquitetura que buscam produtividade em equipe.",
        buttonText: "Escolher Pro",
        href: "/cadastro",
        isPopular: true
      }, {
        name: "ENTERPRISE",
        price: "199.90",
        yearlyPrice: "159.92",
        period: "mês",
        features: ["Análise Geral (normas ABNT)", "Até 10 usuários inclusos", "Projetos ilimitados", "Mensagens de IA ilimitadas", "50 GB de anexos", "SSO (Single Sign-On)", "Auditoria completa", "Integração nativa com Sienge/ERP", "Auditoria técnica completa", "SLA 99,9%", "Gerente de conta dedicado", "Contrato customizado", "Onboarding e treinamento"],
        description: "Solução corporativa completa para empresas que precisam de segurança, escala e suporte avançado.",
        buttonText: "Falar com vendas",
        href: "/contact",
        isPopular: false
      }]} title="MadeAI — Planos simples e acessíveis" description="Escolha o plano ideal para você ou seu escritório. Todos os planos incluem orçamentos precisos e cronogramas realistas com dados de mercado, e as automações variam de acordo com o plano." />
      </section>

      <SectionDivider from="#fafafa" to="#ffffff" height={32} />

      {/* FAQ Section */}
      <FAQ 
        title="Perguntas Frequentes"
        subtitle="Tire suas dúvidas sobre a MadeAI"
        categories={{
          "geral": "Sobre a MadeAI",
          "planos": "Planos e Preços", 
          "tecnico": "Parte Técnica",
          "projetos": "Projetos e Arquitetura"
        }}
        faqData={{
          "geral": [
            {
              question: "O que é a MadeAI?",
              answer: "A MadeAI é uma plataforma de inteligência artificial voltada para engenheiros e arquitetos. Ela auxilia na análise de projetos, dúvidas técnicas e na organização de documentos de forma prática e confiável."
            },
            {
              question: "A MadeAI substitui um profissional de arquitetura ou engenharia?",
              answer: "Não. A MadeAI é uma ferramenta de apoio que ajuda profissionais e estudantes, mas não substitui a responsabilidade técnica de um engenheiro ou arquiteto."
            },
            {
              question: "A MadeAI segue normas brasileiras?",
              answer: "Sim. A IA da MadeAI foi treinada para responder com base em normas técnicas brasileiras, garantindo maior segurança e confiabilidade nas respostas."
            },
            {
              question: "Preciso ter conhecimento avançado para usar a MadeAI?",
              answer: "Não. A plataforma foi desenvolvida para ser simples e intuitiva, permitindo que qualquer pessoa da área consiga aproveitar seus recursos sem dificuldades."
            }
          ],
          "planos": [
            {
              question: "A MadeAI é gratuita?",
              answer: "A MadeAI possui um plano inicial gratuito com recursos limitados. Também oferece planos pagos que desbloqueiam funcionalidades avançadas, como maior limite de projetos e acesso completo aos agentes de IA."
            },
            {
              question: "Quais são as opções de planos disponíveis?",
              answer: "Atualmente oferecemos um plano gratuito e planos pagos com diferentes níveis de acesso. Os planos pagos incluem mais armazenamento, agentes especializados e suporte prioritário."
            },
            {
              question: "Posso cancelar meu plano a qualquer momento?",
              answer: "Sim. O cancelamento pode ser feito diretamente na plataforma, sem taxas adicionais ou burocracia."
            },
            {
              question: "Há desconto para empresas ou equipes?",
              answer: "Sim. A MadeAI oferece planos corporativos para empresas que desejam integrar equipes inteiras, com valores diferenciados e recursos extras."
            }
          ],
          "tecnico": [
            {
              question: "Quais tecnologias a MadeAI utiliza?",
              answer: "A MadeAI é construída com tecnologias modernas como React, Tailwind, Supabase e integração com modelos de IA avançados. Tudo isso garante rapidez, segurança e escalabilidade."
            },
            {
              question: "Preciso instalar algum programa para usar?",
              answer: "Não. A MadeAI é 100% online e pode ser acessada diretamente pelo navegador, sem necessidade de instalação."
            },
            {
              question: "Meus dados e projetos estão seguros?",
              answer: "Sim. Utilizamos padrões de segurança e criptografia para proteger as informações dos usuários, além de armazenar dados em servidores confiáveis."
            },
            {
              question: "A MadeAI funciona no celular?",
              answer: "Sim. A plataforma é responsiva e pode ser acessada tanto no computador quanto em dispositivos móveis."
            }
          ],
          "projetos": [
            {
              question: "Quais tipos de projetos posso analisar na MadeAI?",
              answer: "Você pode analisar projetos de arquitetura e engenharia civil, incluindo cronogramas, orçamentos e documentos técnicos."
            },
            {
              question: "A MadeAI interpreta plantas e arquivos PDF?",
              answer: "Sim. A plataforma permite o upload de arquivos PDF e oferece recursos de leitura e análise para auxiliar na interpretação de documentos."
            },
            {
              question: "Posso compartilhar meus projetos com outras pessoas?",
              answer: "Sim. A MadeAI permite colaboração, facilitando o compartilhamento de informações entre equipes e clientes."
            },
            {
              question: "Existe limite de projetos que posso carregar?",
              answer: "Depende do seu plano. O plano gratuito possui limite reduzido, enquanto os planos pagos oferecem maior capacidade de armazenamento e análise."
            }
          ]
        }}
        className="py-12 sm:py-16 lg:py-20"
      />

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
              Pronto para revolucionar seus projetos?
            </h2>
             <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-6 sm:mb-8 max-w-2xl mx-auto">
               Teste gratuitamente sem cartão de crédito e receba uma análise detalhada do seu próximo projeto em poucos minutos
             </p>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
              <AppleButton as={Link} to="/cadastro" variant="primary" size="lg" className="w-full sm:w-auto">
                Começar Gratuitamente
              </AppleButton>
              <AppleButton as={Link} to="/contato" variant="secondary" size="lg" className="w-full sm:w-auto">
                Falar com Especialista
              </AppleButton>
            </div>

            <p className="text-xs sm:text-sm text-muted-foreground mt-3 sm:mt-4">
              Teste grátis • Sem cartão de crédito • Cancele quando quiser
            </p>
          </motion.div>
        </div>
      </section>

      <Footerdemo />
    </div>;
};
export default LandingPage;