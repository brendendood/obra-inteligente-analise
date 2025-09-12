"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SparklesTextProps {
  text: string;
  className?: string;
}

export function SparklesText({ text, className }: SparklesTextProps) {
  return (
    <motion.h2
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={cn("text-foreground", className)}
    >
      {text}
    </motion.h2>
  );
}