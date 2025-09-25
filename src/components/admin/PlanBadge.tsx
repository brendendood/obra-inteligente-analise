"use client";

import { planLabel, Plan } from "@/lib/plan";
import { motion } from "framer-motion";
import React from "react";

export function PlanBadge({ plan }: { plan: Plan }) {
  const label = planLabel(plan);
  const styles: Record<Plan, string> = {
    BASIC: "bg-slate-100 text-slate-800 border-slate-200",
    PRO: "bg-indigo-100 text-indigo-800 border-indigo-200",
    ENTERPRISE: "bg-emerald-100 text-emerald-800 border-emerald-200",
  };

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`inline-flex items-center rounded-2xl border px-2.5 py-1 text-xs font-medium ${styles[plan]}`}
    >
      {label}
    </motion.span>
  );
}