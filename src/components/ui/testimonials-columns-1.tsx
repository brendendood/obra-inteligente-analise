"use client";
import React from "react";
import { motion } from "motion/react";

/**
 * Coluna com animação vertical contínua (marquee).
 * Sem sombras/degradês nas extremidades. Respeita tokens do tema.
 */
export const TestimonialsColumn = (props: {
  className?: string;
  testimonials: Array<{ text: string; image: string; name: string; role: string }>;
  duration?: number;
}) => {
  return (
    <div className={props.className}>
      <motion.div
        animate={{ translateY: "-50%" }}
        transition={{
          duration: props.duration || 14,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
        className="flex flex-col gap-6 pb-6 bg-background"
      >
        {[
          ...new Array(2).fill(0).map((_, idx) => (
            <React.Fragment key={idx}>
              {props.testimonials.map(({ text, image, name, role }, i) => (
                <div
                  key={i}
                  className="w-full max-w-xs rounded-3xl border border-border bg-card/80 backdrop-blur-sm p-6 sm:p-8 shadow-none"
                >
                  <p className="text-sm sm:text-base text-foreground/90">{text}</p>

                  <div className="mt-5 flex items-center gap-3">
                    <img
                      width={40}
                      height={40}
                      src={image}
                      alt={name}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                    <div className="flex flex-col">
                      <span className="leading-5 font-medium tracking-tight text-foreground">
                        {name}
                      </span>
                      <span className="leading-5 tracking-tight text-muted-foreground">
                        {role}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </React.Fragment>
          )),
        ]}
      </motion.div>
    </div>
  );
};

/**
 * Seção pronta para usar na Landing.
 * Mobile: 1 coluna (performática e compacta)
 * md: 2 colunas
 * lg+: 3 colunas
 * Sem máscaras de gradiente (sem "fade" nas bordas).
 * Conteúdo 100% em PT-BR com contexto MadeAI.
 */
export function TestimonialsSection() {
  // Reviews BR sobre a MadeAI (sem arroba)
  const testimonials = [
    {
      text:
        "A MadeAI agilizou nosso processo de orçamento em mais de 60%. Hoje entregamos propostas com muito mais precisão e confiança.",
      image: "https://randomuser.me/api/portraits/women/57.jpg",
      name: "Ana Souza",
      role: "Arquiteta — São Paulo, SP",
    },
    {
      text:
        "A análise automática de plantas e memorial descritivo é incrível. Reduziu erros e padronizou nosso fluxo.",
      image: "https://randomuser.me/api/portraits/men/64.jpg",
      name: "Carlos Lima",
      role: "Engenheiro Civil — Belo Horizonte, MG",
    },
    {
      text:
        "Os cronogramas com IA deram previsibilidade às obras. Menos retrabalho e comunicação mais clara com o cliente.",
      image: "https://randomuser.me/api/portraits/women/52.jpg",
      name: "Marina Figueiredo",
      role: "Gestora de Projetos — Curitiba, PR",
    },
    {
      text:
        "Integramos a MadeAI ao nosso fluxo e ganhamos velocidade do briefing à entrega. Suporte rápido e atencioso.",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
      name: "Rafael Teixeira",
      role: "Construtora — Recife, PE",
    },
    {
      text:
        "A plataforma simplificou a conferência de custos e insumos. Agora decidimos com base em dados, não achismos.",
      image: "https://randomuser.me/api/portraits/women/68.jpg",
      name: "Bruna Carvalho",
      role: "Orçamentista — Porto Alegre, RS",
    },
    {
      text:
        "Os insights gerados economizam horas por semana. É a melhor ferramenta que adotamos no último ano.",
      image: "https://randomuser.me/api/portraits/men/85.jpg",
      name: "Diego Moreira",
      role: "Empreiteira — Salvador, BA",
    },
    {
      text:
        "Onboarding descomplicado e interface limpa. A equipe se adaptou em poucos dias e o ganho foi imediato.",
      image: "https://randomuser.me/api/portraits/women/45.jpg",
      name: "Larissa Rocha",
      role: "Escritório de Arquitetura — Florianópolis, SC",
    },
    {
      text:
        "A compatibilidade com nossos padrões técnicos foi decisiva. Os relatórios saem prontos para o cliente.",
      image: "https://randomuser.me/api/portraits/men/61.jpg",
      name: "Pedro Nogueira",
      role: "Engenharia — Rio de Janeiro, RJ",
    },
    {
      text:
        "A IA da MadeAI entende nosso contexto de obra. Isso impactou diretamente a qualidade das entregas.",
      image: "https://randomuser.me/api/portraits/women/33.jpg",
      name: "Camila Martins",
      role: "Planejamento — Campinas, SP",
    },
  ];

  const firstColumn = testimonials.slice(0, 3);
  const secondColumn = testimonials.slice(3, 6);
  const thirdColumn = testimonials.slice(6, 9);

  return (
    <section className="bg-background text-foreground py-12 md:py-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mx-auto flex max-w-[620px] flex-col items-center justify-center text-center">
          <div className="flex justify-center">
            <div className="rounded-lg border border-border px-4 py-1 text-sm">
              Depoimentos
            </div>
          </div>

          <h2 className="mt-5 text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold tracking-tighter">
            O que nossos clientes dizem
          </h2>
          <p className="mt-4 max-w-prose text-muted-foreground">
            Resultados reais de escritórios e construtoras que aceleram projetos com a MadeAI.
          </p>
        </div>

        {/* Grid de colunas — sem máscara/gradiente nas bordas */}
        <div className="mt-10 flex justify-center gap-6 overflow-hidden">
          {/* mobile: 1 coluna; md: 2; lg+: 3 */}
          <TestimonialsColumn testimonials={firstColumn} duration={15} />
          <TestimonialsColumn testimonials={secondColumn} className="hidden md:block" duration={19} />
          <TestimonialsColumn testimonials={thirdColumn} className="hidden lg:block" duration={17} />
        </div>
      </div>
    </section>
  );
}