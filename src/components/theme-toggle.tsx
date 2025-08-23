"use client";

import * as React from "react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-8 w-14 rounded-full bg-muted animate-pulse" />
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      aria-label="Toggle theme"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "relative inline-flex h-8 w-14 items-center rounded-full",
        "transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",
        isDark ? "bg-muted-dark" : "bg-muted"
      )}
    >
      <span
        className={cn(
          "inline-block h-6 w-6 transform rounded-full bg-background shadow-lg",
          "transition-transform duration-300 ease-in-out",
          isDark ? "translate-x-7" : "translate-x-1"
        )}
      />
    </button>
  );
}

function cn(...classes: (string | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}