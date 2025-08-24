"use client";

import * as React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Hero enxuta:
 * - apenas topo (badge + h1 + p + CTAs)
 * - sem marcas/partners, sem mockups, sem imagens de fundo
 * - respeita Light/Dark via tokens
 */

export function HeroSection() {
  return (
    <>
      <HeroHeader />
      <main className="bg-background text-foreground">
        <section
          aria-label="Hero"
          className="relative isolate mx-auto w-full max-w-7xl px-6 pt-24 pb-16 md:pt-28 md:pb-24 lg:px-8"
        >
          {/* Fundo limpo via tokens (sem imagem): */}
          <div
            aria-hidden
            className="absolute inset-0 -z-10 bg-background"
          />

          <div className="mx-auto max-w-4xl text-center">
            <div className="animate-fade-in">
              {/* Badge (sem logos/imagens) */}
              <div className="mx-auto w-fit rounded-full border bg-muted px-3 py-1 text-xs font-medium text-foreground/80 shadow-sm">
                <span className="inline-flex items-center gap-2">
                  <span className="inline-flex size-4 items-center justify-center rounded-full bg-foreground/10">
                    <ArrowRight className="size-3" />
                  </span>
                  <span>🚀 Novo</span>
                  <span className="opacity-70">IA para obras e orçamento</span>
                </span>
              </div>

              {/* Título */}
              <h1 className="mt-6 text-balance text-4xl font-semibold leading-tight sm:text-5xl md:text-6xl">
                Transforme plantas em orçamentos precisos
              </h1>

              {/* Descrição */}
              <p className="mx-auto mt-5 max-w-2xl text-balance text-base text-muted-foreground sm:text-lg">
                Nossa IA especializada analisa projetos e entrega orçamentos detalhados,
                cronogramas otimizados e insights em minutos — com suporte total a Light/Dark.
              </p>

              {/* CTAs */}
              <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
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
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

/**
 * Header SEMPRE com CTAs visíveis em desktop e mobile.
 * Sem condicional de scroll/viewport escondendo botões.
 */
const HeroHeader: React.FC = () => {
  return (
    <header className="sticky top-0 z-30 w-full border-b bg-background/80 backdrop-blur-md">
      <nav className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:h-16 md:px-6 lg:px-8">
        {/* Brand simples (sem imagens) */}
        <Link to="/" className="font-semibold tracking-tight">
          MadeAI
        </Link>

        {/* Ações — SEMPRE visíveis */}
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
  );
};