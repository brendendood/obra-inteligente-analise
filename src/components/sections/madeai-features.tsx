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
      "Modelos treinados analisam plantas e modelos 3D (PDF, DWG, IFC) e extraem quantitativos de materiais, áreas e ambientes automaticamente.",
    icon: <Brain className="h-4 w-4 text-black dark:text-neutral-400" />,
    area: "lg:[grid-area:1/1/2/2]",
  },
  {
    title: "Orçamentos inteligentes (SINAPI)",
    description:
      "Geração de orçamentos detalhados usando SINAPI/IBGE e índices regionais atualizados, integrando-se ao Sienge e outros ERPs.",
    icon: <Calculator className="h-4 w-4 text-black dark:text-neutral-400" />,
    area: "lg:[grid-area:1/2/2/3]",
  },
  {
    title: "Cronograma otimizado",
    description:
      "Planejamento com sequenciamento lógico e durações baseadas na média de centenas de cronogramas reais em Gantt.",
    icon: (
      <CalendarClock className="h-4 w-4 text-black dark:text-neutral-400" />
    ),
    area: "lg:[grid-area:1/3/2/4]",
  },
  {
    title: "Documentação automática",
    description:
      "Gere memoriais, relatórios e escopos técnicos conforme normas ABNT, prontos para aprovação e envio.",
    icon: <FileText className="h-4 w-4 text-black dark:text-neutral-400" />,
    area: "lg:[grid-area:2/1/3/2]",
  },
  {
    title: "Alertas inteligentes",
    description:
      "Receba alertas de atrasos, conflitos de recursos e atualizações automáticas quando houver mudanças no projeto ou orçamento.",
    icon: (
      <CalendarClock className="h-4 w-4 text-black dark:text-neutral-400" />
    ),
    area: "lg:[grid-area:2/2/3/3]",
  },
  {
    title: "Integrações CAD/BIM e planilhas",
    description:
      "Importe desenhos e dados de CAD/BIM, integre-se ao Sienge e exporte relatórios e planilhas (Excel, CSV) para ERPs.",
    icon: <PlugZap className="h-4 w-4 text-black dark:text-neutral-400" />,
    area: "lg:[grid-area:2/3/3/4]",
  },
  {
    title: "Segurança e LGPD",
    description:
      "Criptografia ponta a ponta, controle de acesso granular e conformidade com LGPD para proteger seus dados e dos seus clientes.",
    icon: <ShieldCheck className="h-4 w-4 text-black dark:text-neutral-400" />,
    area: "lg:[grid-area:3/1/4/4]",
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

        <ul className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:grid-rows-3 lg:gap-6">
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
    <li className={cn("min-h-[18rem] lg:min-h-[20rem] list-none", area)}>
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
        <div className="relative z-10 flex h-full flex-col justify-start gap-4 overflow-hidden rounded-xl border-[0.75px] bg-background p-4 shadow-sm md:p-6 dark:shadow-[0px_0px_27px_0px_rgba(45,45,45,0.3)]">
          <div className="w-fit rounded-lg border-[0.75px] border-border bg-muted p-2">
            {icon}
          </div>
          <div className="flex flex-col gap-3 flex-1">
            <h3 className="font-sans text-lg leading-tight font-semibold tracking-[-0.02em] text-balance lg:text-xl lg:leading-tight">
              {title}
            </h3>
            <p className="font-sans text-sm leading-relaxed text-muted-foreground lg:text-base lg:leading-relaxed">
              {description}
            </p>
          </div>
        </div>
      </div>
    </li>
  );
}