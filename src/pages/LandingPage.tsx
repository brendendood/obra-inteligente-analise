import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CtaGlow } from '@/components/ui/cta-glow';
import { ArrowRight, Star, Brain, Calculator, Calendar, FileText, TrendingUp, Shield, Check, Upload, Users, BarChart3, Download, PlayCircle, Menu, X } from 'lucide-react';
import { HeroPill } from '@/components/ui/hero-pill';
import { SectionDivider } from '@/components/ui/section-divider';
import { Footerdemo } from '@/components/ui/footer-section';
import TestimonialsSection from '@/components/ui/responsive-testimonials';
import { GlowingEffect } from '@/components/ui/glowing-effect';
import { ArchitectureSaaSBackground } from '@/components/ui/architecture-saas-background';
import Header from '@/components/layout/Header';
import { MadeAIFeaturesSection } from '@/components/sections/madeai-features';
import { 
  CheckCircle,
} from 'lucide-react';
import { cn } from "@/lib/utils";

// GridItem component for Features section
interface GridItemProps {
  area: string;
  icon: React.ReactNode;
  title: string;
  description: React.ReactNode;
}

const GridItem = ({ area, icon, title, description }: GridItemProps) => {
  return (
    <li className={cn("min-h-[14rem] list-none", area)}>
      <div className="relative h-full rounded-[1.25rem] border-[0.75px] border-border p-2 md:rounded-[1.5rem] md:p-3">
        <GlowingEffect
          spread={40}
          glow={true}
          disabled={false}
          proximity={64}
          inactiveZone={0.01}
          borderWidth={3}
        />
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
    </li>
  );
};

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section with ArchitectureSaaSBackground */}
      <ArchitectureSaaSBackground>
        <div className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 pt-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            {/* HeroPill */}
            <div className="mb-6 sm:mb-8">
              <HeroPill 
                href="/cadastro"
                label="Revolucione seus projetos com IA"
                announcement="🚀 Novo"
                className="mx-auto"
              />
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-4 sm:mb-6 leading-tight">
              Transforme plantas em
              <span className="text-primary bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent"> orçamentos precisos</span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground mb-6 sm:mb-8 max-w-3xl mx-auto leading-relaxed">
              Nossa IA especializada analisa seus projetos arquitetônicos e gera orçamentos detalhados, cronogramas otimizados e insights valiosos em minutos.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-8 sm:mb-12">
              <CtaGlow 
                label="Começar Gratuitamente"
                href="/cadastro"
                ariaLabel="Começar gratuitamente - Cadastre-se agora"
                className="w-full sm:w-auto"
              />
              <CtaGlow 
                label="Ver Demonstração"
                href="/demo"
                ariaLabel="Ver demonstração da plataforma"
                className="w-full sm:w-auto"
              />
            </div>

            {/* Trust Indicators */}
            <div className="text-sm sm:text-base text-muted-foreground">
              Mais de 1.000+ arquitetos já confiam na nossa plataforma
            </div>
          </motion.div>
        </div>
      </ArchitectureSaaSBackground>

      {/* Social Proof Section */}
      <section className="py-12 sm:py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <p className="text-muted-foreground mb-6 sm:mb-8 text-base sm:text-lg">Integrado com as principais bases de dados do mercado</p>
            <div className="flex justify-center items-center mb-6 sm:mb-8">
              <div className="relative w-full max-w-[600px] aspect-[3/2]">
                <iframe 
                  src="https://lottie.host/embed/765bd57d-872c-4837-acb7-118aca836ff6/REpljcsv0j.lottie" 
                  className="w-full h-full rounded-lg"
                  style={{background:'transparent'}} 
                  frameBorder="0" 
                  allowFullScreen
                />
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

      
      {/* Testimonials Section */}
      <TestimonialsSection />

      <SectionDivider from="#fafafa" to="#ffffff" height={32} />

      {/* Problem & Solution Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
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
                  <p className="text-sm sm:text-base">Perda de competitividade por demora na entrega</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-primary/5 to-primary/10 p-4 sm:p-6 lg:p-8 rounded-2xl border border-primary/20"
            >
              <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-4 sm:mb-6">Nossa IA resolve tudo isso</h3>
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-primary mt-1 sm:mt-0.5 flex-shrink-0" />
                  <p className="text-foreground text-sm sm:text-base">Análise automática de plantas e projetos</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-primary mt-1 sm:mt-0.5 flex-shrink-0" />
                  <p className="text-foreground text-sm sm:text-base">Orçamentos precisos em minutos</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-primary mt-1 sm:mt-0.5 flex-shrink-0" />
                  <p className="text-foreground text-sm sm:text-base">Cronogramas otimizados automaticamente</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-primary mt-1 sm:mt-0.5 flex-shrink-0" />
                  <p className="text-foreground text-sm sm:text-base">Integração com bases de dados atualizadas</p>
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
      <section className="py-12 sm:py-16 lg:py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-8 sm:mb-12 lg:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 sm:mb-4">
              Veja a plataforma em ação
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              Interface intuitiva que simplifica processos complexos
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <img 
                src="/src/assets/hero-dashboard-mockup.jpg" 
                alt="Dashboard MadeAI" 
                className="w-full h-auto rounded-lg sm:rounded-xl shadow-lg sm:shadow-2xl border border-border object-contain"
                loading="lazy"
              />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="space-y-4 sm:space-y-6"
            >
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-primary font-bold text-sm sm:text-base">1</span>
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-foreground mb-1">Upload do Projeto</h3>
                  <p className="text-sm sm:text-base text-muted-foreground">Faça upload de plantas, documentos ou dados do seu projeto</p>
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
                  <p className="text-sm sm:text-base text-muted-foreground">Receba orçamentos e cronogramas detalhados em minutos</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-8 sm:mb-12 lg:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 sm:mb-4">
              Planos que crescem com você
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              Escolha o plano ideal para seu perfil profissional
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto">
            {[
              {
                name: "Freelancer",
                price: "Gratuito",
                period: "",
                description: "Perfeito para arquitetos independentes",
                features: [
                  "5 projetos por mês",
                  "Orçamentos básicos",
                  "Suporte por email",
                  "Documentação padrão"
                ],
                cta: "Começar Grátis",
                popular: false
              },
              {
                name: "Profissional",
                price: "R$ 97",
                period: "/mês",
                description: "Ideal para escritórios pequenos e médios",
                features: [
                  "Projetos ilimitados",
                  "Orçamentos avançados",
                  "Cronogramas otimizados",
                  "Suporte prioritário",
                  "Relatórios personalizados",
                  "Integrações API"
                ],
                cta: "Começar Teste",
                popular: true
              },
              {
                name: "Enterprise",
                price: "Personalizado",
                period: "",
                description: "Para grandes construtoras e incorporadoras",
                features: [
                  "Tudo do Profissional",
                  "Múltiplas equipes",
                  "Dashboard executivo",
                  "Suporte 24/7",
                  "Implementação assistida",
                  "SLA garantido"
                ],
                cta: "Falar com Vendas",
                popular: false
              }
            ].map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`relative bg-background p-8 rounded-xl border-2 transition-all duration-300 hover:shadow-lg ${
                  plan.popular ? 'border-primary shadow-lg scale-105' : 'border-border hover:border-primary/20'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
                      Mais Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-foreground mb-2">{plan.name}</h3>
                  <div className="mb-2">
                    <span className="text-3xl font-bold text-foreground">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                  <p className="text-muted-foreground text-sm">{plan.description}</p>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-3">
                      <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                      <span className="text-muted-foreground text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="flex justify-center">
                  <CtaGlow 
                    label={plan.cta}
                    href="/cadastro"
                    ariaLabel={`${plan.cta} - Plano ${plan.name}`}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <SectionDivider from="#fafafa" to="#ffffff" height={32} />

      {/* Testimonials Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-8 sm:mb-12 lg:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 sm:mb-4">
              O que nossos clientes dizem
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              Depoimentos reais de profissionais que transformaram seus processos
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                name: "Ana Silva",
                role: "Arquiteta - Silva Arquitetura",
                content: "Reduzi o tempo de elaboração de orçamentos de 3 dias para 30 minutos. A precisão é impressionante e meus clientes ficam satisfeitos com a rapidez.",
                rating: 5
              },
              {
                name: "Carlos Santos",
                role: "Engenheiro Civil - Santos Construções",
                content: "A integração com SINAPI é perfeita. Nossos orçamentos ficaram muito mais competitivos e precisos. Recomendo para qualquer escritório.",
                rating: 5
              },
              {
                name: "Maria Oliveira",
                role: "Arquiteta - Studio Oliveira",
                content: "Como freelancer, preciso ser ágil. O MadeAI me permitiu aceitar mais projetos mantendo a qualidade. É uma ferramenta indispensável.",
                rating: 5
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-muted/30 p-4 sm:p-6 rounded-xl border border-border"
              >
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-sm sm:text-base text-muted-foreground mb-4 italic">"{testimonial.content}"</p>
                <div>
                  <p className="text-sm sm:text-base font-semibold text-foreground">{testimonial.name}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-8 sm:mb-12 lg:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 sm:mb-4">
              Perguntas Frequentes
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground">
              Tire suas dúvidas sobre a plataforma
            </p>
          </motion.div>

          <div className="space-y-3 sm:space-y-4">
            {[
              {
                question: "Como a IA analisa meus projetos?",
                answer: "Nossa IA utiliza algoritmos de visão computacional e processamento de linguagem natural para analisar plantas, documentos e especificações técnicas, extraindo automaticamente informações sobre materiais, quantidades e especificações."
              },
              {
                question: "Os preços são baseados em quais tabelas?",
                answer: "Utilizamos principalmente a tabela SINAPI (IBGE) como base, complementada com dados de mercado regional para garantir a precisão e atualização dos preços dos insumos e serviços."
              },
              {
                question: "Posso exportar os orçamentos?",
                answer: "Sim! Você pode exportar orçamentos em PDF, Excel e outros formatos. Também oferecemos templates personalizáveis com sua marca e layout."
              },
              {
                question: "Há limite de tamanho para os projetos?",
                answer: "O plano gratuito suporta projetos de até 500m². Planos pagos não têm limite de área e suportam projetos complexos como edifícios e complexos industriais."
              },
              {
                question: "Como funciona o suporte técnico?",
                answer: "Oferecemos suporte por email para todos os usuários. Clientes dos planos pagos têm acesso a suporte prioritário e, no plano Enterprise, suporte 24/7 com SLA garantido."
              }
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-background border border-border rounded-lg sm:rounded-xl p-4 sm:p-6"
              >
                <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2">{faq.question}</h3>
                <p className="text-sm sm:text-base text-muted-foreground">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <SectionDivider from="#fafafa" to="#ffffff" height={32} />

      {/* Final CTA Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4 sm:mb-6">
              Pronto para revolucionar seus projetos?
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-6 sm:mb-8 max-w-2xl mx-auto">
              Junte-se a centenas de arquitetos e engenheiros que já transformaram seus processos com nossa IA
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
              <CtaGlow 
                label="Começar Gratuitamente"
                href="/cadastro"
                ariaLabel="Começar gratuitamente - Teste agora"
                className="w-full sm:w-auto"
              />
              <CtaGlow 
                label="Falar com Especialista"
                href="/contact"
                ariaLabel="Falar com especialista em vendas"
                className="w-full sm:w-auto"
              />
            </div>

            <p className="text-xs sm:text-sm text-muted-foreground mt-3 sm:mt-4">
              Teste grátis • Sem cartão de crédito • Cancele quando quiser
            </p>
          </motion.div>
        </div>
      </section>

      <Footerdemo />
    </div>
  );
};

export default LandingPage;