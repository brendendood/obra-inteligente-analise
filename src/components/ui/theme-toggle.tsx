"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const current = (resolvedTheme || theme || "system") as "light" | "dark" | "system";
  const isDark = current === "dark";

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full p-1 transition-colors backdrop-blur-md border shadow-lg ring-1",
        // glass integrado ao tema
        "bg-white/60 border-black/10 ring-black/10",
        "dark:bg-black/60 dark:border-white/10 dark:ring-white/10"
      )}
      role="group"
      aria-label="Alternar tema"
    >
      <button
        type="button"
        onClick={() => setTheme("dark")}
        className={cn(
          "inline-flex items-center gap-2 rounded-full px-2 py-1 text-sm font-medium transition-all",
          isDark ? "bg-black text-white" : "text-neutral-700 hover:bg-black/5"
        )}
        aria-pressed={isDark}
        aria-label="Ativar tema escuro"
      >
        <Moon className="h-4 w-4" />
      </button>

      <button
        type="button"
        onClick={() => setTheme("light")}
        className={cn(
          "inline-flex items-center gap-2 rounded-full px-2 py-1 text-sm font-medium transition-all",
          !isDark ? "bg-white text-black" : "text-neutral-200 hover:bg-white/5"
        )}
        aria-pressed={!isDark}
        aria-label="Ativar tema claro"
      >
        <Sun className="h-4 w-4" />
      </button>
    </div>
  );
}