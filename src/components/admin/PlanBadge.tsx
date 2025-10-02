"use client";

import { planLabel, type PlanTier, getPlanBadgeStyle } from "@/lib/domain/plans";
import { motion } from "framer-motion";
import React from "react";

export function PlanBadge({ plan }: { plan: PlanTier }) {
  const label = planLabel(plan);
  const badgeStyle = getPlanBadgeStyle(plan);

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`inline-flex items-center rounded-2xl border px-2.5 py-1 text-xs font-medium ${badgeStyle}`}
    >
      {label}
    </motion.span>
  );
}