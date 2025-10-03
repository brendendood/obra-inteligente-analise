import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/hooks/useTheme";
import logoDark from '@/assets/logo-dark.svg';
import logoLight from '@/assets/logo-light.svg';

interface LogoProps {
  className?: string;
  width?: number;
  height?: number;
}

export function Logo({
  className,
  width = 120,
  height = 40
}: LogoProps) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted) {
    return <div className={cn("animate-pulse bg-muted rounded", className)} style={{
      width,
      height
    }} />;
  }

  // Em dark mode, usar logo branca (light). Em light mode, usar logo escura (dark)
  const logoSrc = theme === 'dark' ? logoLight : logoDark;
  
  return (
    <img
      src={logoSrc}
      alt="MadeAI Logo"
      className={cn("transition-opacity duration-300 object-contain", className)}
      style={{ width, height }}
    />
  );
}