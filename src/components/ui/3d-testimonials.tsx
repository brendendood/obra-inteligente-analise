"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Testimonial {
  name: string;
  username: string;
  body: string;
  img: string;
  country: string;
}

interface ReviewCardProps {
  img: string;
  name: string;
  username: string;
  body: string;
  country: string;
}

const testimonials: Testimonial[] = [
  {
    name: 'Aline Souza',
    username: '@aline',
    body: 'A MadeAI transformou a forma como reviso projetos de arquitetura. Mais agilidade e menos erros!',
    img: 'https://randomuser.me/api/portraits/women/32.jpg',
    country: '🇧🇷 Brasil',
  },
  {
    name: 'Bruno Oliveira',
    username: '@bruno',
    body: 'Ferramenta indispensável para engenheiros civis. Automatiza análises que antes levavam horas.',
    img: 'https://randomuser.me/api/portraits/men/33.jpg',
    country: '🇧🇷 Brasil',
  },
  {
    name: 'Camila Ferreira',
    username: '@camila',
    body: 'As integrações com cronogramas de obra são práticas e fáceis de usar. Excelente suporte!',
    img: 'https://randomuser.me/api/portraits/women/53.jpg',
    country: '🇧🇷 Brasil',
  },
  {
    name: 'Diego Lima',
    username: '@diego',
    body: 'Os relatórios gerados pela MadeAI me ajudam a apresentar projetos com clareza para clientes.',
    img: 'https://randomuser.me/api/portraits/men/51.jpg',
    country: '🇧🇷 Brasil',
  },
  {
    name: 'Fernanda Costa',
    username: '@fernanda',
    body: 'Muito útil no dia a dia de arquitetos. A MadeAI trouxe uma nova forma de trabalhar com dados.',
    img: 'https://randomuser.me/api/portraits/women/45.jpg',
    country: '🇧🇷 Brasil',
  },
  {
    name: 'Gabriel Martins',
    username: '@gabriel',
    body: 'Altamente personalizável e com insights que realmente fazem diferença em obras.',
    img: 'https://randomuser.me/api/portraits/men/22.jpg',
    country: '🇧🇷 Brasil',
  },
  {
    name: 'Juliana Ribeiro',
    username: '@juliana',
    body: 'Funciona perfeitamente no celular, ótimo para acompanhar o andamento da obra em campo.',
    img: 'https://randomuser.me/api/portraits/women/68.jpg',
    country: '🇧🇷 Brasil',
  },
  {
    name: 'Lucas Almeida',
    username: '@lucas',
    body: 'A MadeAI me fez economizar muito tempo com revisões técnicas. Recomendo para qualquer escritório.',
    img: 'https://randomuser.me/api/portraits/men/85.jpg',
    country: '🇧🇷 Brasil',
  },
  {
    name: 'Mariana Rocha',
    username: '@mariana',
    body: 'Os insights automáticos são incríveis. A precisão das análises superou minhas expectativas.',
    img: 'https://randomuser.me/api/portraits/women/61.jpg',
    country: '🇧🇷 Brasil',
  },
];

function ReviewCard({ img, name, username, body, country }: ReviewCardProps) {
  return (
    <figure className={cn(
      "relative w-80 cursor-pointer overflow-hidden rounded-xl border p-4",
      "border-border bg-background hover:bg-muted/50",
      "shadow-sm hover:shadow-md transition-all duration-300"
    )}>
      <div className="flex flex-row items-center gap-2">
        <img
          className="rounded-full"
          width="32"
          height="32"
          alt={name}
          src={img}
        />
        <div className="flex flex-col">
          <figcaption className="text-sm font-medium text-foreground">
            {name}
          </figcaption>
          <p className="text-xs font-medium text-muted-foreground">{username}</p>
          <p className="text-xs text-muted-foreground">{country}</p>
        </div>
      </div>
      <blockquote className="mt-2 text-sm text-foreground">{body}</blockquote>
    </figure>
  );
}

export function MarqueeDemo() {
  return (
    <section className="py-20 bg-background dark:bg-[#000000]">
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
            Descubra como profissionais brasileiros estão transformando seus processos com a MadeAI
          </p>
        </motion.div>

        <div className="relative flex h-[600px] w-full flex-col items-center justify-center overflow-hidden rounded-lg bg-background dark:bg-[#000000]">
          <div className="flex flex-row gap-4 [perspective:300px]">
            {/* Primeira coluna */}
            <div className="flex h-full w-80 animate-marquee-vertical flex-col gap-4 [transform:rotateX(0deg)]">
              {testimonials.slice(0, 3).map((review, idx) => (
                <ReviewCard key={idx} {...review} />
              ))}
              {testimonials.slice(0, 3).map((review, idx) => (
                <ReviewCard key={idx + 3} {...review} />
              ))}
            </div>

            {/* Segunda coluna */}
            <div className="flex h-full w-80 animate-marquee-vertical-reverse flex-col gap-4 [transform:rotateX(0deg)]">
              {testimonials.slice(3, 6).map((review, idx) => (
                <ReviewCard key={idx} {...review} />
              ))}
              {testimonials.slice(3, 6).map((review, idx) => (
                <ReviewCard key={idx + 3} {...review} />
              ))}
            </div>

            {/* Terceira coluna */}
            <div className="flex h-full w-80 animate-marquee-vertical flex-col gap-4 [transform:rotateX(0deg)]">
              {testimonials.slice(6, 9).map((review, idx) => (
                <ReviewCard key={idx} {...review} />
              ))}
              {testimonials.slice(6, 9).map((review, idx) => (
                <ReviewCard key={idx + 3} {...review} />
              ))}
            </div>
          </div>

          {/* Gradientes para fade effect */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-background dark:from-[#000000]"></div>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-background dark:from-[#000000]"></div>
        </div>
      </div>
    </section>
  );
}