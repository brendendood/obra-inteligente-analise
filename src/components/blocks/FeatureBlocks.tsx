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

export function ExportBudgetBlock({ children }: { children: React.ReactNode }) {
  return (
    <PlanGuard requiredPlan="PRO" feature="export_budget">
      {children}
    </PlanGuard>
  );
}

export function ExportScheduleBlock({ children }: { children: React.ReactNode }) {
  return (
    <PlanGuard requiredPlan="PRO" feature="export_schedule">
      {children}
    </PlanGuard>
  );
}

export function ExportDocumentsBlock({ children }: { children: React.ReactNode }) {
  return (
    <PlanGuard requiredPlan="PRO" feature="export_documents">
      {children}
    </PlanGuard>
  );
}

export function ProjectAIAssistantBlock({ children }: { children: React.ReactNode }) {
  return (
    <PlanGuard requiredPlan="PRO" feature="ai_project_assistant">
      {children}
    </PlanGuard>
  );
}

export function TechnicalAnalysisBlock({ children }: { children: React.ReactNode }) {
  return (
    <PlanGuard requiredPlan="PRO" feature="technical_analysis">
      {children}
    </PlanGuard>
  );
}

export function CRMBlock({ children }: { children: React.ReactNode }) {
  return (
    <PlanGuard requiredPlan="ENTERPRISE" feature="crm">
      {children}
    </PlanGuard>
  );
}