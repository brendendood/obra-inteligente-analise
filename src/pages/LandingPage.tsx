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
import { TestimonialsSection } from '@/components/ui/testimonials-with-marquee';
import { CounterStats } from '@/components/ui/counter-stats';
import { GlowingEffect } from '@/components/ui/glowing-effect';
import { ArchitectureSaaSBackground } from '@/components/ui/architecture-saas-background';
import Header from '@/components/layout/Header';
import { MadeAIFeaturesSection } from '@/components/sections/madeai-features';
import { CheckCircle } from 'lucide-react';
import { cn } from "@/lib/utils";
import { Pricing } from "@/components/ui/pricing";

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
                <Typewriter
                  text={["Orçamento", "Cronograma", "Projeto"]}
                  speed={70}
                  deleteSpeed={40}
                  waitTime={4000}
                  className="text-primary"
                  cursorChar={"_"}
                />
              </span>

              {/* Linha 3 (fixa para todos) */}
              <span className="block">com a MadeAI</span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground mb-6 sm:mb-8 max-w-3xl mx-auto leading-relaxed">
              A MadeAI analisa projetos de construções — de casas a grandes edifícios — e gera orçamentos precisos (SINAPI/ABNT), cronogramas realistas baseados em dados de Gantt e relatórios técnicos que apontam possíveis falhas. Tudo exportável em PDF e Excel.
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
            <div className="text-sm sm:text-base text-muted-foreground">
              Mais de 1.000+ arquitetos já confiam na nossa plataforma
            </div>
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

      
      {/* Testimonials Section - Marquee com depoimentos em português */}
      <TestimonialsSection 
        title="Profissionais do Brasil confiam na MadeAI"
        description="Depoimentos de arquitetos e engenheiros que já transformaram seus workflows"
        testimonials={[
          {
            author: {
              name: "Bruna Almeida",
              handle: "@bruna.arq",
              avatar: "",
              avatarBg: "bg-blue-500"
            },
            text: "A MadeAI acelerou nossa análise de projetos e reduziu retrabalho no orçamento.",
            href: "https://twitter.com/bruna_arq"
          },
          {
            author: {
              name: "João Pereira",
              handle: "@joaopereira.eng",
              avatar: "",
              avatarBg: "bg-emerald-500"
            },
            text: "Cronogramas gerados com precisão e integração tranquila com nosso fluxo."
          },
          {
            author: {
              name: "Camila Santos",
              handle: "@camila.projetos",
              avatar: "",
              avatarBg: "bg-rose-500"
            },
            text: "Upload do projeto e pronto: análise completa com quantitativos claros."
          },
          {
            author: {
              name: "Ricardo Silva",
              handle: "@ricardo.eng",
              avatar: "",
              avatarBg: "bg-purple-500"
            },
            text: "Reduzimos de 3 dias para 2 horas o tempo de criação de orçamentos detalhados."
          },
          {
            author: {
              name: "Mariana Costa",
              handle: "@mari.arquiteta",
              avatar: "",
              avatarBg: "bg-orange-500"
            },
            text: "Interface intuitiva e resultados precisos. Revolucionou nossa produtividade."
          },
          {
            author: {
              name: "Carlos Oliveira",
              handle: "@carlos.proj",
              avatar: "",
              avatarBg: "bg-teal-500"
            },
            text: "A IA entende perfeitamente projetos brasileiros e normas da ABNT."
          }
        ]}
      />

      <SectionDivider from="#fafafa" to="#ffffff" height={32} />

      {/* Problem & Solution Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-background text-foreground">
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
        <Pricing
          plans={[
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
                "Suporte em até 48h",
              ],
              description: "Perfeito para profissionais autônomos que precisam organizar seus projetos com agilidade.",
              buttonText: "Começar agora",
              href: "/cadastro",
              isPopular: false,
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
                "Suporte prioritário (<24h)",
              ],
              description: "Ideal para pequenos escritórios de engenharia e arquitetura que buscam produtividade em equipe.",
              buttonText: "Escolher Pro",
              href: "/cadastro",
              isPopular: true,
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
                "Onboarding e treinamento",
              ],
              description: "Solução corporativa completa para empresas que precisam de segurança, escala e suporte avançado.",
              buttonText: "Falar com vendas",
              href: "/contact",
              isPopular: false,
            },
          ]}
          title="MadeAI — Planos simples e acessíveis"
          description="Escolha o plano ideal para você ou seu escritório. Todos os planos incluem orçamentos precisos e cronogramas realistas com dados de mercado, e as automações variam de acordo com o plano."
        />
      </section>

      <SectionDivider from="#fafafa" to="#ffffff" height={32} />

      {/* Testimonials Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-background">
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
              O que nossos clientes dizem
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              Depoimentos reais de profissionais que transformaram seus processos
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[{
            name: "Ana Silva",
            role: "Arquiteta - Silva Arquitetura",
            content: "Reduzi o tempo de elaboração de orçamentos de 3 dias para 30 minutos. A precisão é impressionante e meus clientes ficam satisfeitos com a rapidez.",
            rating: 5
          }, {
            name: "Carlos Santos",
            role: "Engenheiro Civil - Santos Construções",
            content: "A integração com SINAPI é perfeita. Nossos orçamentos ficaram muito mais competitivos e precisos. Recomendo para qualquer escritório.",
            rating: 5
          }, {
            name: "Maria Oliveira",
            role: "Arquiteta - Studio Oliveira",
            content: "Como freelancer, preciso ser ágil. O MadeAI me permitiu aceitar mais projetos mantendo a qualidade. É uma ferramenta indispensável.",
            rating: 5
          }].map((testimonial, index) => <motion.div key={index} initial={{
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
          }} className="bg-muted/30 p-4 sm:p-6 rounded-xl border border-border">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />)}
                </div>
                <p className="text-sm sm:text-base text-muted-foreground mb-4 italic">"{testimonial.content}"</p>
                <div>
                  <p className="text-sm sm:text-base font-semibold text-foreground">{testimonial.name}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </motion.div>)}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
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
              Perguntas Frequentes
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground">
              Tire suas dúvidas sobre a plataforma
            </p>
          </motion.div>

          <div className="space-y-3 sm:space-y-4">
            {[{
            question: "Como a IA analisa meus projetos?",
            answer: "Nossa IA utiliza algoritmos de visão computacional e processamento de linguagem natural para analisar plantas, documentos e especificações técnicas, extraindo automaticamente informações sobre materiais, quantidades e especificações."
          }, {
            question: "Os preços são baseados em quais tabelas?",
            answer: "Utilizamos principalmente a tabela SINAPI (IBGE) como base, complementada com dados de mercado regional. A plataforma também se integra ao Sienge e considera índices regionais com atualizações mensais para garantir precisão."
          }, {
            question: "A IA detecta falhas de projeto?",
            answer: "Sim! Nossa IA analisa inconsistências estruturais, conflitos entre elementos e possíveis problemas construtivos, alertando sobre falhas que poderiam passar despercebidas."
          }, {
            question: "Posso exportar resultados em PDF/Excel?", 
            answer: "Sim! Você pode exportar orçamentos, cronogramas e relatórios técnicos em PDF e Excel. Também oferecemos templates personalizáveis com sua marca e layout."
          }, {
            question: "Há limite de tamanho para os projetos?",
            answer: "O plano gratuito suporta projetos de até 500m². Planos pagos não têm limite de área e suportam projetos complexos como edifícios e complexos industriais."
          }, {
            question: "Como funciona o suporte técnico?",
            answer: "Oferecemos suporte por email para todos os usuários. Clientes dos planos pagos têm acesso a suporte prioritário e, no plano Enterprise, suporte 24/7 com SLA garantido."
          }].map((faq, index) => <motion.div key={index} initial={{
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
          }} className="bg-background border border-border rounded-lg sm:rounded-xl p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2">{faq.question}</h3>
                <p className="text-sm sm:text-base text-muted-foreground">{faq.answer}</p>
              </motion.div>)}
          </div>
        </div>
      </section>

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