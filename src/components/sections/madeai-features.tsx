"use client";

import { cn } from "@/lib/utils";
import { GlowingEffect } from "@/components/ui/glowing-effect-card";
import {
  Brain,
  Calculator,
  CalendarClock,
  FileText,
  PlugZap,
  ShieldCheck,
} from "lucide-react";

type Feature = {
  title: string;
  description: string;
  icon: React.ReactNode;
  area: string;
};

const features: Feature[] = [
  {
    title: "IA especializada para projetos",
    description:
      "Modelos treinados para arquitetura e construção analisam plantas e extraem informações com precisão.",
    icon: <Brain className="h-4 w-4 text-black dark:text-neutral-400" />,
    area: "md:[grid-area:1/1/2/7] xl:[grid-area:1/1/2/5]",
  },
  {
    title: "Orçamentos inteligentes (SINAPI)",
    description:
      "Geração automática de orçamentos detalhados com base no SINAPI e mercado local, atualizados.",
    icon: <Calculator className="h-4 w-4 text-black dark:text-neutral-400" />,
    area: "md:[grid-area:1/7/2/13] xl:[grid-area:2/1/3/5]",
  },
  {
    title: "Cronograma otimizado",
    description:
      "Planejamento com sequenciamento lógico, caminho crítico e prazos realistas em poucos cliques.",
    icon: (
      <CalendarClock className="h-4 w-4 text-black dark:text-neutral-400" />
    ),
    area: "md:[grid-area:2/1/3/7] xl:[grid-area:1/5/3/8]",
  },
  {
    title: "Documentação automática",
    description:
      "Memoriais, relatórios e escopos técnicos gerados de forma padronizada e prontos para envio.",
    icon: <FileText className="h-4 w-4 text-black dark:text-neutral-400" />,
    area: "md:[grid-area:2/7/3/13] xl:[grid-area:1/8/2/13]",
  },
  {
    title: "Integrações CAD/BIM e planilhas",
    description:
      "Importe desenhos e dados das suas ferramentas preferidas. Exporte para planilhas e ERPs.",
    icon: <PlugZap className="h-4 w-4 text-black dark:text-neutral-400" />,
    area: "md:[grid-area:3/1/4/13] xl:[grid-area:2/8/3/13]",
  },
  {
    title: "Segurança e LGPD",
    description:
      "Criptografia, controle de acesso e conformidade com a LGPD para proteger seus projetos.",
    icon: <ShieldCheck className="h-4 w-4 text-black dark:text-neutral-400" />,
    area: "md:[grid-area:3/1/4/13] xl:[grid-area:2/5/3/8]",
  },
];

export function MadeAIFeaturesSection() {
  return (
    <section
      aria-labelledby="madeai-features-heading"
      className="relative py-10 sm:py-14 md:py-16"
    >
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center md:mb-12">
          <h2
            id="madeai-features-heading"
            className="text-balance text-2xl font-semibold md:text-3xl lg:text-4xl"
          >
            Recursos que transformam seu workflow
          </h2>
          <p className="mt-3 text-sm text-muted-foreground md:text-base">
            Tudo o que você precisa para acelerar projetos com a MadeAI.
          </p>
        </div>

        <ul className="grid grid-cols-1 grid-rows-none gap-4 md:grid-cols-12 md:grid-rows-3 lg:gap-4 xl:max-h-[34rem] xl:grid-rows-2">
          {features.map((item, idx) => (
            <GridItem
              key={idx}
              area={item.area}
              icon={item.icon}
              title={item.title}
              description={item.description}
            />
          ))}
        </ul>
      </div>
    </section>
  );
}

interface GridItemProps {
  area: string;
  icon: React.ReactNode;
  title: string;
  description: React.ReactNode;
}

function GridItem({ area, icon, title, description }: GridItemProps) {
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
          className="z-0"
        />
        <div className="relative z-10 flex h-full flex-col justify-between gap-6 overflow-hidden rounded-xl border-[0.75px] bg-background p-6 shadow-sm md:p-6 dark:shadow-[0px_0px_27px_0px_rgba(45,45,45,0.3)]">
          <div className="relative flex flex-1 flex-col justify-between gap-3">
            <div className="w-fit rounded-lg border-[0.75px] border-border bg-muted p-2">
              {icon}
            </div>
            <div className="space-y-3">
              <h3 className="pt-0.5 font-sans text-xl leading-[1.375rem] font-semibold tracking-[-0.04em] text-balance md:text-2xl md:leading-[1.875rem]">
                {title}
              </h3>
              <p className="font-sans text-sm leading-[1.125rem] text-muted-foreground md:text-base md:leading-[1.375rem]">
                {description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
}