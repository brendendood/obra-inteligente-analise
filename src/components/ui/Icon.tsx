import * as React from "react";
import * as Lucide from "lucide-react";
import { cn } from "@/lib/utils";

// Tamanhos padronizados para ícones
const SIZES: Record<"sm" | "md" | "lg", number> = { 
  sm: 16, 
  md: 20, 
  lg: 24 
};

type IconProps = {
  name: keyof typeof Lucide;
  size?: "sm" | "md" | "lg";
  strokeWidth?: number;
  className?: string;
  ariaLabel?: string;
  "aria-hidden"?: boolean;
};

export function Icon({
  name,
  size = "md",
  strokeWidth = 1.75,
  className,
  ariaLabel,
  "aria-hidden": ariaHidden,
  ...props
}: IconProps & Omit<React.SVGProps<SVGSVGElement>, keyof IconProps>) {
  const LucideIcon = Lucide[name] as React.ComponentType<React.SVGProps<SVGSVGElement>>;
  
  if (!LucideIcon) {
    console.warn(`Icon "${name}" not found in lucide-react`);
    return null;
  }
  
  const px = SIZES[size];
  
  return (
    <LucideIcon
      aria-label={ariaHidden ? undefined : ariaLabel}
      aria-hidden={ariaHidden}
      width={px}
      height={px}
      strokeWidth={strokeWidth}
      className={cn(
        "shrink-0 inline-block align-middle text-current",
        className
      )}
      {...props}
    />
  );
}

// Componente de ícone específico para casos onde precisamos de mais controle
export function IconWithFallback({
  name,
  fallback,
  ...props
}: IconProps & { fallback?: React.ReactNode }) {
  const LucideIcon = Lucide[name] as React.ComponentType<React.SVGProps<SVGSVGElement>>;
  
  if (!LucideIcon) {
    return fallback || null;
  }
  
  return <Icon name={name} {...props} />;
}