
"use client";

import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

/**
 * Header com fundo "glass" integrado ao tema:
 * - Light: branco translúcido
 * - Dark: preto translúcido
 * As cores reagem ao tema global (next-themes + classe `dark` no <html>).
 * Mantém os botões "Login" e "Começar Agora".
 */
export function Header() {
  return (
    <header className="w-full flex justify-center px-4 pt-4">
      <div
        className={cn(
          "w-full max-w-7xl h-14 rounded-full flex items-center justify-between px-3 transition-colors",
          // Glass base + borda + blur, com variantes por tema
          "backdrop-blur-md border shadow-xl ring-1",
          "bg-white/60 border-black/10 ring-black/10",
          "dark:bg-black/60 dark:border-white/10 dark:ring-white/10"
        )}
      >
        {/* Esquerda: espaço reservado para logo (mantém layout atual) */}
        <div className="flex items-center gap-3 pl-2" />

        {/* Direita: toggle + botões */}
        <div className="flex items-center gap-3 pr-1">
          <ThemeToggle />

          <Link to="/login" className="hidden sm:block">
            <Button
              variant="secondary"
              className={cn(
                "rounded-full border",
                "bg-neutral-200 text-black border-black/10 hover:bg-neutral-300",
                "dark:bg-neutral-800 dark:text-white dark:border-white/10 dark:hover:bg-neutral-700"
              )}
            >
              Login
            </Button>
          </Link>

          <Link to="/signup">
            <Button
              className={cn(
                "rounded-full",
                // CTA consistente em ambos temas
                "bg-blue-600 text-white hover:bg-blue-500"
              )}
            >
              Começar Agora
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Header;
