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
      "relative min-w-[220px] sm:min-w-[260px] md:w-80 cursor-pointer overflow-hidden rounded-xl border p-3 sm:p-4",
      "border-border bg-background hover:bg-muted/50",
      "shadow-sm hover:shadow-md transition-all duration-300"
    )}>
      <div className="flex flex-row items-center gap-2">
        <img
          className="rounded-full w-7 h-7 sm:w-8 sm:h-8"
          width="32"
          height="32"
          alt={name}
          src={img}
        />
        <div className="flex flex-col">
          <figcaption className="text-xs sm:text-sm font-medium text-foreground">
            {name}
          </figcaption>
          <p className="text-xs font-medium text-muted-foreground">{username}</p>
          <p className="text-xs text-muted-foreground">{country}</p>
        </div>
      </div>
      <blockquote className="mt-2 text-xs sm:text-sm text-foreground leading-relaxed">{body}</blockquote>
    </figure>
  );
}

export function MarqueeDemo() {
  return (
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
            Descubra como profissionais brasileiros estão transformando seus processos com a MadeAI
          </p>
        </motion.div>

        <div className="relative w-full max-w-[800px] overflow-hidden border border-border rounded-lg flex flex-col gap-3 h-auto md:[perspective:300px] md:h-96 md:flex-row md:items-center md:justify-center md:gap-1.5">
          <div className="flex flex-col gap-4 md:flex-row md:gap-4">
            {/* Primeira coluna */}
            <div className="flex h-full w-full animate-marquee-vertical flex-col gap-3 sm:gap-4 md:w-80 md:[transform:rotateX(0deg)]">
              {testimonials.slice(0, 3).map((review, idx) => (
                <ReviewCard key={idx} {...review} />
              ))}
              {testimonials.slice(0, 3).map((review, idx) => (
                <ReviewCard key={idx + 3} {...review} />
              ))}
            </div>

            {/* Segunda coluna */}
            <div className="flex h-full w-full animate-marquee-vertical-reverse flex-col gap-3 sm:gap-4 md:w-80 md:[transform:rotateX(0deg)]">
              {testimonials.slice(3, 6).map((review, idx) => (
                <ReviewCard key={idx} {...review} />
              ))}
              {testimonials.slice(3, 6).map((review, idx) => (
                <ReviewCard key={idx + 3} {...review} />
              ))}
            </div>

            {/* Terceira coluna */}
            <div className="flex h-full w-full animate-marquee-vertical flex-col gap-3 sm:gap-4 md:w-80 md:[transform:rotateX(0deg)]">
              {testimonials.slice(6, 9).map((review, idx) => (
                <ReviewCard key={idx} {...review} />
              ))}
              {testimonials.slice(6, 9).map((review, idx) => (
                <ReviewCard key={idx + 3} {...review} />
              ))}
            </div>

            {/* Quarta coluna */}
            <div className="flex h-full w-full animate-marquee-vertical-reverse flex-col gap-3 sm:gap-4 md:w-80 md:[transform:rotateX(0deg)]">
              {testimonials.slice(0, 3).map((review, idx) => (
                <ReviewCard key={idx + 6} {...review} />
              ))}
              {testimonials.slice(3, 6).map((review, idx) => (
                <ReviewCard key={idx + 9} {...review} />
              ))}
            </div>
          </div>

          {/* Gradientes para fade effect - Mobile: top/bottom, Desktop: left/right */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-background md:hidden"></div>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-background md:hidden"></div>
          <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-background hidden md:block"></div>
          <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-background hidden md:block"></div>
        </div>
      </div>
    </section>
  );
}