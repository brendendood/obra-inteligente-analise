"use client";

import React from "react";
import PlanGuard from "@/components/guards/PlanGuard";

export function BudgetBlock({ children }: { children: React.ReactNode }) {
  return (
    <PlanGuard requiredPlan="BASIC" feature="budget">
      {children}
    </PlanGuard>
  );
}

export function ScheduleBlock({ children }: { children: React.ReactNode }) {
  return (
    <PlanGuard requiredPlan="BASIC" feature="schedule">
      {children}
    </PlanGuard>
  );
}

export function ExportBlock({ children }: { children: React.ReactNode }) {
  return (
    <PlanGuard requiredPlan="BASIC" feature="export">
      {children}
    </PlanGuard>
  );
}