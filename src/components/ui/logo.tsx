"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
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
  const {
    theme
  } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) {
    return <div className={cn("animate-pulse bg-muted rounded", className)} style={{
      width,
      height
    }} />;
  }
  return;
}