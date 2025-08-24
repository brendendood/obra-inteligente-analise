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
        src="/lovable-uploads/1f3daf9b-7f18-46ba-90b8-0acddfb2d188.png"
        alt="MadeAI Logo"
        width={width}
        height={height}
        className={`absolute left-0 top-0 w-full h-full object-contain transition-opacity duration-500 ease-in-out ${
          theme === "light" ? "opacity-100" : "opacity-0"
        }`}
      />
      {/* Dark mode logo (white) */}
      <img
        src="/lovable-uploads/d6d58a10-5a0c-48ee-987f-c9c5adf66c2c.png"
        alt="MadeAI Logo"
        width={width}
        height={height}
        className={`absolute left-0 top-0 w-full h-full object-contain transition-opacity duration-500 ease-in-out ${
          theme === "dark" ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
}