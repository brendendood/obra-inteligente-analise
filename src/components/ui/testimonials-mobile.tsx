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
];

function ReviewCard({ img, name, username, body, country }: ReviewCardProps) {
  return (
    <figure className={cn(
      "relative min-w-[240px] max-w-[280px] cursor-pointer overflow-hidden rounded-xl border p-3",
      "border-border bg-card hover:bg-muted/50",
      "shadow-sm hover:shadow-md transition-all duration-300 snap-start"
    )}>
      <div className="flex flex-row items-center gap-2 mb-2">
        <img
          className="rounded-full w-6 h-6 flex-shrink-0"
          width="24"
          height="24"
          alt={name}
          src={img}
        />
        <div className="flex flex-col min-w-0">
          <figcaption className="text-xs font-medium text-foreground truncate">
            {name}
          </figcaption>
          <p className="text-xs font-medium text-muted-foreground truncate">{username}</p>
        </div>
        <p className="text-xs text-muted-foreground ml-auto flex-shrink-0">{country}</p>
      </div>
      <blockquote className="text-xs text-foreground leading-relaxed line-clamp-3">{body}</blockquote>
    </figure>
  );
}

export function TestimonialsMobile() {
  // Duplicate array for seamless loop
  const duplicatedTestimonials = [...testimonials, ...testimonials];

  return (
    <section className="py-8 bg-background md:hidden">
      <div className="px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-6"
        >
          <h2 className="text-xl font-bold text-foreground mb-2">
            O que nossos clientes dizem
          </h2>
          <p className="text-sm text-muted-foreground">
            Descubra como profissionais brasileiros estão transformando seus processos
          </p>
        </motion.div>

        <div className="relative">
          <div 
            className="flex gap-3 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-2"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            {duplicatedTestimonials.map((review, idx) => (
              <ReviewCard key={`mobile-${idx}`} {...review} />
            ))}
          </div>
          
          {/* Gradient fade effects */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-background to-transparent"></div>
          <div className="pointer-events-none absolute inset-y-0 right-0 w-6 bg-gradient-to-l from-background to-transparent"></div>
        </div>
      </div>

    </section>
  );
}