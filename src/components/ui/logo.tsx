import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/hooks/useTheme";
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
    console.log('🎨 Logo mounted with theme:', theme);
  }, []);

  useEffect(() => {
    console.log('🎨 Logo theme changed to:', theme);
  }, [theme]);
  
  if (!mounted) {
    return <div className={cn("animate-pulse bg-muted rounded", className)} style={{
      width,
      height
    }} />;
  }
  
  return null;
}