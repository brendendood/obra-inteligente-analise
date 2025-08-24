import React from "react";
import { Marquee } from "@/components/ui/marquee";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Reviews 100% brasileiros sobre a MadeAI
const testimonials = [
  {
    name: "Mariana Coutinho",
    body: "A MadeAI revolucionou a forma como gerencio meus projetos de arquitetura. Ganhamos muito mais eficiência no dia a dia.",
    img: "https://randomuser.me/api/portraits/women/31.jpg",
    country: "🇧🇷 Brasil",
  },
  {
    name: "Rafael Albuquerque",
    body: "Finalmente encontrei uma plataforma que entende a realidade da engenharia no Brasil. Simples, prática e extremamente poderosa.",
    img: "https://randomuser.me/api/portraits/men/44.jpg",
    country: "🇧🇷 Brasil",
  },
  {
    name: "Camila Mendonça",
    body: "O suporte da MadeAI é incrível! A equipe está sempre disponível e realmente escuta nossos feedbacks.",
    img: "https://randomuser.me/api/portraits/women/25.jpg",
    country: "🇧🇷 Brasil",
  },
  {
    name: "João Varella",
    body: "A integração com nossos fluxos de obra foi impecável. Hoje não consigo imaginar trabalhar sem a MadeAI.",
    img: "https://randomuser.me/api/portraits/men/52.jpg",
    country: "🇧🇷 Brasil",
  },
  {
    name: "Renata Siqueira",
    body: "Além da tecnologia, a MadeAI trouxe clareza para toda a equipe. Nosso tempo de entrega reduziu drasticamente.",
    img: "https://randomuser.me/api/portraits/women/47.jpg",
    country: "🇧🇷 Brasil",
  },
  {
    name: "Felipe Romanelli",
    body: "Ferramenta completa, pensada para profissionais brasileiros. A MadeAI está anos-luz à frente da concorrência.",
    img: "https://randomuser.me/api/portraits/men/63.jpg",
    country: "🇧🇷 Brasil",
  },
  {
    name: "Larissa Penteado",
    body: "Fiquei impressionada com a facilidade de uso. É intuitiva e realmente ajuda a organizar tudo no escritório.",
    img: "https://randomuser.me/api/portraits/women/50.jpg",
    country: "🇧🇷 Brasil",
  },
  {
    name: "André Guimarães",
    body: "Estamos usando a MadeAI há alguns meses e já sentimos o impacto direto na produtividade da equipe.",
    img: "https://randomuser.me/api/portraits/men/70.jpg",
    country: "🇧🇷 Brasil",
  },
  {
    name: "Beatriz Tavares",
    body: "A MadeAI une tecnologia e simplicidade. Finalmente uma solução que fala a nossa língua no setor da construção.",
    img: "https://randomuser.me/api/portraits/women/66.jpg",
    country: "🇧🇷 Brasil",
  },
];

function TestimonialCard({ img, name, body, country }: (typeof testimonials)[number]) {
  return (
    <Card className="w-50">
      <CardContent>
        <div className="flex items-center gap-2.5">
          <Avatar className="size-9">
            <AvatarImage src={img} alt={name} />
            <AvatarFallback>{name[0]}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <figcaption className="text-sm font-medium text-foreground flex items-center gap-1">
              {name} <span className="text-xs">{country}</span>
            </figcaption>
          </div>
        </div>
        <blockquote className="mt-3 text-sm text-secondary-foreground">{body}</blockquote>
      </CardContent>
    </Card>
  );
}

export function ResponsiveTestimonials() {
  return (
    <section aria-label="O que nossos clientes dizem" className="mx-auto w-full max-w-7xl px-4 md:px-6">
      {/* MOBILE: horizontal */}
      <div className="md:hidden relative w-full overflow-hidden">
        <div className="h-48">
          <Marquee vertical={false} repeat={6} className="[--duration:30s]">
            {testimonials.map((review, i) => (
              <TestimonialCard key={i + '-m1'} {...review} />
            ))}
          </Marquee>
        </div>
        <div className="h-48 -mt-2">
          <Marquee vertical={false} reverse repeat={6} className="[--duration:34s]">
            {testimonials.map((review, i) => (
              <TestimonialCard key={i + '-m2'} {...review} />
            ))}
          </Marquee>
        </div>
      </div>

      {/* DESKTOP: vertical */}
      <div className="relative hidden md:flex h-96 w-full max-w-[1100px] flex-row items-center justify-center overflow-hidden gap-1.5 [perspective:300px]">
        <div
          className="flex flex-row items-center gap-4"
          style={{
            transform:
              'translateX(-100px) translateY(0px) translateZ(-100px) rotateX(20deg) rotateY(-10deg) rotateZ(20deg)',
          }}
        >
          <Marquee vertical pauseOnHover repeat={3} className="[--duration:40s]">
            {testimonials.map((review, i) => (
              <TestimonialCard key={i + '-d1'} {...review} />
            ))}
          </Marquee>
          <Marquee vertical pauseOnHover reverse repeat={3} className="[--duration:40s]">
            {testimonials.map((review, i) => (
              <TestimonialCard key={i + '-d2'} {...review} />
            ))}
          </Marquee>
          <Marquee vertical pauseOnHover repeat={3} className="[--duration:40s]">
            {testimonials.map((review, i) => (
              <TestimonialCard key={i + '-d3'} {...review} />
            ))}
          </Marquee>
          <Marquee vertical pauseOnHover reverse repeat={3} className="[--duration:40s]">
            {testimonials.map((review, i) => (
              <TestimonialCard key={i + '-d4'} {...review} />
            ))}
          </Marquee>

          {/* Gradientes */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-background"></div>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-background"></div>
          <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-background"></div>
          <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-background"></div>
        </div>
      </div>
    </section>
  );
}

export default function TestimonialsSection() {
  return (
    <section className="w-full bg-background text-foreground py-12 md:py-20">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-center text-2xl md:text-4xl font-semibold tracking-tight mb-8 md:mb-12">
          O que nossos clientes dizem
        </h2>

        {/* Desktop: colunas verticais animadas | Mobile: faixas horizontais animadas */}
        <ResponsiveTestimonials />
      </div>
    </section>
  );
}