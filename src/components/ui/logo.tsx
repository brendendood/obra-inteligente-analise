"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/hooks/useTheme";

interface LogoProps {
  className?: string;
  width?: number;
  height?: number;
}

export function Logo({ className, width = 120, height = 40 }: LogoProps) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  
  if (!mounted) {
    return (
      <div 
        className={cn("animate-pulse bg-muted rounded", className)}
        style={{ width, height }}
      />
    );
  }

  return (
    <div 
      className={cn("relative transition-all duration-500 ease-in-out", className)}
      style={{ width, height }}
    >
      {/* Light theme logo (dark logo) */}
      <img
        src="/logo-dark.png"
        alt="MadeAI Logo Dark"
        width={width}
        height={height}
        className={`absolute left-0 top-0 w-full h-full object-contain transition-opacity duration-500 ease-in-out ${
          theme === "light" ? "opacity-100" : "opacity-0"
        }`}
      />
      {/* Dark theme logo (light logo) */}
      <img
        src="/logo-light.png"
        alt="MadeAI Logo Light"
        width={width}
        height={height}
        className={`absolute left-0 top-0 w-full h-full object-contain transition-opacity duration-500 ease-in-out ${
          theme === "dark" ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
}