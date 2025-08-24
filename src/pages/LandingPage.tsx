import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CtaGlow } from '@/components/ui/cta-glow';
import { ArrowRight, Star, Brain, Calculator, Calendar, FileText, TrendingUp, Shield, CheckCircle } from 'lucide-react';
import { BackgroundPaths } from '@/components/ui/background-paths';
import { SectionDivider } from '@/components/ui/section-divider';
import { Footerdemo } from '@/components/ui/footer-section';
import { GlowingEffect } from '@/components/ui/glowing-effect';
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
      <div className="relative h-full rounded-[1.25rem] p-2 md:rounded-[1.5rem] md:p-3">
        <GlowingEffect
          spread={40}
          glow={true}
          disabled={false}
          proximity={64}
          inactiveZone={0.01}
          borderWidth={2}
        />
        <div className="relative z-10 flex h-full flex-col justify-between gap-6 overflow-hidden rounded-xl bg-background p-6 shadow-sm dark:shadow-[0px_0px_27px_0px_rgba(45,45,45,0.3)] md:p-6">
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
      {/* Header integrado com CTAs sempre visíveis */}
      <header className="sticky top-0 z-30 w-full border-b bg-background/80 backdrop-blur-md">
        <nav className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:h-16 md:px-6 lg:px-8">
          {/* Brand simples */}
          <Link to="/" className="font-semibold tracking-tight text-foreground">
            MadeAI
          </Link>

          {/* Ações — SEMPRE visíveis em desktop e mobile */}
          <div className="flex items-center gap-2">
            <Button asChild variant="outline" size="sm" className="rounded-lg">
              <Link to="/login">Login</Link>
            </Button>
            <Button asChild size="sm" className="rounded-lg">
              <Link to="/signup">Começar agora</Link>
            </Button>
          </div>
        </nav>
      </header>
      
      {/* Hero Section enxuta - apenas topo */}
      <main className="bg-background text-foreground">
        <section
          aria-label="Hero"
          className="relative isolate border-b border-black/20 dark:border-white/20 mx-auto w-full max-w-7xl px-6 pt-24 pb-16 md:pt-28 md:pb-24 lg:px-8"
        >
          <BackgroundPaths />
          
          <div className="relative z-10 mx-auto max-w-4xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="animate-fade-in"
            >
              {/* Badge */}
              <div className="mx-auto w-fit rounded-full border bg-muted px-3 py-1 text-xs font-medium text-foreground/80 shadow-sm mb-6">
                <span className="inline-flex items-center gap-2">
                  <span className="inline-flex size-4 items-center justify-center rounded-full bg-foreground/10">
                    <ArrowRight className="size-3" />
                  </span>
                  <span>🚀 Novo</span>
                  <span className="opacity-70">IA para obras e orçamento</span>
                </span>
              </div>

              {/* Título */}
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight">
                Transforme plantas em
                <span className="text-primary bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent"> orçamentos precisos</span>
              </h1>

              {/* Descrição */}
              <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
                Nossa IA especializada analisa seus projetos arquitetônicos e gera orçamentos detalhados, cronogramas otimizados e insights valiosos em minutos.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button asChild size="lg" className="rounded-xl px-6">
                  <Link to="/signup">Começar Gratuitamente</Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="rounded-xl px-6"
                >
                  <Link to="/demo">Ver Demonstração</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <SectionDivider from="#fafafa" to="#ffffff" height={32} />

      {/* Problem & Solution Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Chega de orçamentos manuais que levam dias
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-destructive rounded-full mt-2 flex-shrink-0"></div>
                  <p>Planilhas complexas e propensas a erros humanos</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-destructive rounded-full mt-2 flex-shrink-0"></div>
                  <p>Consultas manuais a múltiplas tabelas de preços</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-destructive rounded-full mt-2 flex-shrink-0"></div>
                  <p>Cronogramas desatualizados e irreais</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-destructive rounded-full mt-2 flex-shrink-0"></div>
                  <p>Perda de competitividade por demora na entrega</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-primary/5 to-primary/10 p-8 rounded-2xl border border-primary/20"
            >
              <h3 className="text-2xl font-bold text-foreground mb-6">Nossa IA resolve tudo isso</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <p className="text-foreground">Análise automática de plantas e projetos</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <p className="text-foreground">Orçamentos precisos em minutos</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <p className="text-foreground">Cronogramas otimizados automaticamente</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <p className="text-foreground">Integração com bases de dados atualizadas</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Recursos que transformam seu workflow
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Tudo que você precisa para modernizar seus processos e entregar projetos mais rapidamente
            </p>
          </motion.div>

          <div className="grid grid-cols-1 grid-rows-none gap-4 md:grid-cols-12 md:grid-rows-3 lg:gap-6 xl:max-h-[40rem] xl:grid-rows-2">
            <GridItem
              area="md:[grid-area:1/1/2/7] xl:[grid-area:1/1/2/5]"
              icon={<Brain className="h-4 w-4" />}
              title="IA Especializada"
              description="Algoritmos treinados especificamente para análise de projetos arquitetônicos e construção civil"
            />
            <GridItem
              area="md:[grid-area:1/7/2/13] xl:[grid-area:2/1/3/5]"
              icon={<Calculator className="h-4 w-4" />}
              title="Orçamento Inteligente"
              description="Geração automática de orçamentos detalhados com base em dados SINAPI e mercado local"
            />
            <GridItem
              area="md:[grid-area:2/1/3/7] xl:[grid-area:1/5/3/8]"
              icon={<Calendar className="h-4 w-4" />}
              title="Cronograma Otimizado"
              description="Planejamento de obras com sequenciamento lógico e otimização de recursos"
            />
            <GridItem
              area="md:[grid-area:2/7/3/13] xl:[grid-area:1/8/2/13]"
              icon={<FileText className="h-4 w-4" />}
              title="Documentação Completa"
              description="Relatórios profissionais, memoriais descritivos e documentos técnicos automáticos"
            />
            <GridItem
              area="md:[grid-area:3/1/4/7] xl:[grid-area:2/8/3/11]"
              icon={<TrendingUp className="h-4 w-4" />}
              title="Analytics Avançado"
              description="Métricas e insights sobre seus projetos para tomada de decisões estratégicas"
            />
            <GridItem
              area="md:[grid-area:3/7/4/13] xl:[grid-area:2/11/3/13]"
              icon={<Shield className="h-4 w-4" />}
              title="Segurança Total"
              description="Seus dados protegidos com criptografia de nível empresarial e backups automáticos"
            />
          </div>
        </div>
      </section>

      <SectionDivider from="#fafafa" to="#ffffff" height={32} />

      {/* Demo Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Veja a plataforma em ação
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Interface intuitiva que simplifica processos complexos
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <img 
                src="/src/assets/hero-dashboard-mockup.jpg" 
                alt="Dashboard MadeAI" 
                className="rounded-xl shadow-2xl border border-border"
              />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-primary font-bold">1</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-1">Upload do Projeto</h3>
                  <p className="text-muted-foreground">Faça upload de plantas, documentos ou dados do seu projeto</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-primary font-bold">2</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-1">Análise Inteligente</h3>
                  <p className="text-muted-foreground">Nossa IA processa e analisa todos os elementos do projeto</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-primary font-bold">3</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-1">Resultados Instantâneos</h3>
                  <p className="text-muted-foreground">Receba orçamentos e cronogramas detalhados em minutos</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Planos que crescem com você
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Escolha o plano ideal para seu perfil profissional
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
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
                className="relative bg-background p-8 rounded-xl"
              >
                <GlowingEffect
                  spread={40}
                  glow={true}
                  disabled={false}
                  proximity={64}
                  inactiveZone={0.01}
                  borderWidth={plan.popular ? 3 : 2}
                />
                <div className="relative z-10">
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
                      href="/signup"
                      ariaLabel={`${plan.cta} - Plano ${plan.name}`}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <SectionDivider from="#fafafa" to="#ffffff" height={32} />

      {/* Testimonials Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              O que nossos clientes dizem
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Depoimentos reais de profissionais que transformaram seus processos
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                className="relative bg-muted/30 p-6 rounded-xl"
              >
                <GlowingEffect
                  spread={40}
                  glow={true}
                  disabled={false}
                  proximity={64}
                  inactiveZone={0.01}
                  borderWidth={2}
                />
                <div className="relative z-10">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4 italic">"{testimonial.content}"</p>
                  <div>
                    <p className="font-semibold text-foreground">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Perguntas Frequentes
            </h2>
            <p className="text-xl text-muted-foreground">
              Tire suas dúvidas sobre a plataforma
            </p>
          </motion.div>

          <div className="space-y-4">
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
                className="bg-background border border-border rounded-xl p-6"
              >
                <h3 className="text-lg font-semibold text-foreground mb-2">{faq.question}</h3>
                <p className="text-muted-foreground">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <SectionDivider from="#fafafa" to="#ffffff" height={32} />

      {/* Final CTA Section */}
      <section className="py-20 bg-background">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Pronto para revolucionar seus projetos?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Junte-se a centenas de arquitetos e engenheiros que já transformaram seus processos com nossa IA
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <CtaGlow 
                label="Começar Gratuitamente"
                href="/signup"
                ariaLabel="Começar gratuitamente - Teste agora"
              />
              <CtaGlow 
                label="Falar com Especialista"
                href="/contact"
                ariaLabel="Falar com especialista em vendas"
              />
            </div>

            <p className="text-sm text-muted-foreground mt-4">
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