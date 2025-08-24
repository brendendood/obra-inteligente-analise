"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

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
      {/* Light mode logo (black) */}
      <img
        src="/lovable-uploads/40f77539-a7a6-48cb-b23d-8f8b3752e4d9.png"
        alt="MadeAI Logo Light"
        width={width}
        height={height}
        className={`absolute left-0 top-0 w-full h-full object-contain transition-opacity duration-500 ease-in-out ${
          theme === "light" ? "opacity-100" : "opacity-0"
        }`}
      />
      {/* Dark mode logo (white) */}
      <img
        src="/lovable-uploads/e623fc2d-9042-492a-9a99-d5b655c2ed14.png"
        alt="MadeAI Logo Dark"
        width={width}
        height={height}
        className={`absolute left-0 top-0 w-full h-full object-contain transition-opacity duration-500 ease-in-out ${
          theme === "dark" ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
}