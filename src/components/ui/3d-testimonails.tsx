import React, { ComponentPropsWithoutRef, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';

/* ---------- Infra base: Marquee (igual ao prompt principal) ---------- */
interface MarqueeProps extends ComponentPropsWithoutRef<'div'> {
  className?: string;
  reverse?: boolean;
  pauseOnHover?: boolean;
  children: React.ReactNode;
  vertical?: boolean;
  repeat?: number;
  autoFill?: boolean;
  ariaLabel?: string;
  ariaLive?: 'off' | 'polite' | 'assertive';
  ariaRole?: string;
}

export function Marquee({
  className,
  reverse = false,
  pauseOnHover = false,
  children,
  vertical = false,
  repeat = 4,
  ariaLabel,
  ariaLive = 'off',
  ariaRole = 'marquee',
  ...props
}: MarqueeProps) {
  const marqueeRef = useRef<HTMLDivElement>(null);

  return (
    <div
      {...props}
      ref={marqueeRef}
      data-slot="marquee"
      className={cn(
        'group flex overflow-hidden p-2 [--duration:40s] [--gap:1rem] [gap:var(--gap)]',
        { 'flex-row': !vertical, 'flex-col': vertical },
        className,
      )}
      aria-label={ariaLabel}
      aria-live={ariaLive}
      role={ariaRole}
      tabIndex={0}
    >
      {Array.from({ length: repeat }, (_, i) => (
        <div
          key={i}
          className={cn(
            !vertical ? 'flex-row [gap:var(--gap)]' : 'flex-col [gap:var(--gap)]',
            'flex shrink-0 justify-around',
            !vertical && 'animate-marquee flex-row',
            vertical && 'animate-marquee-vertical flex-col',
            pauseOnHover && 'group-hover:[animation-play-state:paused]',
            reverse && '[animation-direction:reverse]',
          )}
        >
          {children}
        </div>
      ))}
    </div>
  );
}

/* ---------- Dados (Brasil, sem @) ---------- */
const testimonials = [
  { name: 'Ana Souza', body: 'A MadeAI acelerou nossos orçamentos e reduziu retrabalho.', img: 'https://randomuser.me/api/portraits/women/57.jpg', country: '🇧🇷 Brasil' },
  { name: 'Carlos Lima', body: 'Fluxo mais claro e previsível. Integrações funcionam muito bem.', img: 'https://randomuser.me/api/portraits/men/64.jpg', country: '🇧🇷 Brasil' },
  { name: 'Marina Figueiredo', body: 'Interface simples, recursos poderosos. Recomendo para times de obra.', img: 'https://randomuser.me/api/portraits/women/52.jpg', country: '🇧🇷 Brasil' },
  { name: 'Rafael Teixeira', body: 'Automatizamos relatórios em minutos. Suporte excelente.', img: 'https://randomuser.me/api/portraits/men/32.jpg', country: '🇧🇷 Brasil' },
  { name: 'Bruna Carvalho', body: 'Cronogramas e custos com muito mais controle.', img: 'https://randomuser.me/api/portraits/women/68.jpg', country: '🇧🇷 Brasil' },
  { name: 'Diego Moreira', body: 'Ganhamos velocidade sem perder qualidade nos projetos.', img: 'https://randomuser.me/api/portraits/men/85.jpg', country: '🇧🇷 Brasil' },
  { name: 'Larissa Rocha', body: 'Onboarding fácil e evolução constante do produto.', img: 'https://randomuser.me/api/portraits/women/45.jpg', country: '🇧🇷 Brasil' },
  { name: 'Pedro Nogueira', body: 'Integração com bases de mercado agilizou nossos processos.', img: 'https://randomuser.me/api/portraits/men/61.jpg', country: '🇧🇷 Brasil' },
  { name: 'Camila Martins', body: 'A IA da MadeAI realmente entende nosso contexto.', img: 'https://randomuser.me/api/portraits/women/33.jpg', country: '🇧🇷 Brasil' },
];

/* ---------- Cartão (com largura mínima p/ mobile) ---------- */
function TestimonialCard({
  img, name, body, country,
}: (typeof testimonials)[number]) {
  return (
    <Card className="w-[240px] sm:w-[260px] flex-none rounded-2xl border bg-card/80 backdrop-blur-sm">
      <CardContent className="p-4">
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
        <blockquote className="mt-3 text-sm text-secondary-foreground">
          {body}
        </blockquote>
      </CardContent>
    </Card>
  );
}

/* ---------- Desktop (vertical 3D, igual ao principal) ---------- */
function DesktopVerticalTestimonials() {
  return (
    <div className="relative hidden md:flex h-96 w-full max-w-[800px] flex-row items-center justify-center overflow-hidden gap-1.5 [perspective:300px]">
      <div
        className="flex flex-row items-center gap-4"
        style={{
          transform:
            'translateX(-100px) translateY(0px) translateZ(-100px) rotateX(20deg) rotateY(-10deg) rotateZ(20deg)',
        }}
      >
        <Marquee vertical pauseOnHover repeat={3} className="[--duration:40s]">
          {testimonials.map((r, i) => (<TestimonialCard key={`d1-${i}`} {...r} />))}
        </Marquee>
        <Marquee vertical pauseOnHover reverse repeat={3} className="[--duration:40s]">
          {testimonials.map((r, i) => (<TestimonialCard key={`d2-${i}`} {...r} />))}
        </Marquee>
        <Marquee vertical pauseOnHover repeat={3} className="[--duration:40s]">
          {testimonials.map((r, i) => (<TestimonialCard key={`d3-${i}`} {...r} />))}
        </Marquee>
        <Marquee vertical pauseOnHover reverse repeat={3} className="[--duration:40s]">
          {testimonials.map((r, i) => (<TestimonialCard key={`d4-${i}`} {...r} />))}
        </Marquee>
      </div>
    </div>
  );
}

/* ---------- Mobile (horizontal, SEM 3D e SEM esmagar) ---------- */
function MobileHorizontalTestimonials() {
  return (
    <div className="relative md:hidden w-full">
      {/* altura menor para não ocupar demais a tela */}
      <div className="relative h-[220px] overflow-hidden">
        {/* Faixa 1 */}
        <Marquee pauseOnHover={false} repeat={2} className="[--duration:28s]">
          {testimonials.map((r, i) => (<TestimonialCard key={`m1-${i}`} {...r} />))}
        </Marquee>
        {/* Faixa 2 (reversa) */}
        <Marquee reverse pauseOnHover={false} repeat={2} className="[--duration:32s] -mt-2">
          {testimonials.map((r, i) => (<TestimonialCard key={`m2-${i}`} {...r} />))}
        </Marquee>
      </div>
    </div>
  );
}

/* ---------- Wrapper responsivo ---------- */
export function ResponsiveTestimonials() {
  return (
    <div className="w-full flex items-center justify-center">
      <MobileHorizontalTestimonials />
      <DesktopVerticalTestimonials />
    </div>
  );
}