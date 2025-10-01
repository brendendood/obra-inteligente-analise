"use client";

import React from "react";
import PlanGuard from "@/components/guards/PlanGuard";

// Orçamento - disponível para todos desde BASIC
export function BudgetBlock({ children }: { children: React.ReactNode }) {
  return (
    <PlanGuard requiredPlan="BASIC" feature="budget">
      {children}
    </PlanGuard>
  );
}

// Exportação de Orçamento - apenas PRO+
export function ExportBudgetBlock({ children }: { children: React.ReactNode }) {
  return (
    <PlanGuard requiredPlan="PRO" feature="export_budget">
      {children}
    </PlanGuard>
  );
}

// Cronograma - disponível para todos desde BASIC
export function ScheduleBlock({ children }: { children: React.ReactNode }) {
  return (
    <PlanGuard requiredPlan="BASIC" feature="schedule">
      {children}
    </PlanGuard>
  );
}

// Exportação de Cronograma - apenas PRO+
export function ExportScheduleBlock({ children }: { children: React.ReactNode }) {
  return (
    <PlanGuard requiredPlan="PRO" feature="export_schedule">
      {children}
    </PlanGuard>
  );
}

// IA Geral - disponível desde BASIC
export function AIGeneralBlock({ children }: { children: React.ReactNode }) {
  return (
    <PlanGuard requiredPlan="BASIC" feature="ai_general">
      {children}
    </PlanGuard>
  );
}

// Assistente IA do Projeto - apenas PRO+
export function ProjectAIAssistantBlock({ children }: { children: React.ReactNode }) {
  return (
    <PlanGuard requiredPlan="PRO" feature="ai_project_assistant">
      {children}
    </PlanGuard>
  );
}

// Análise Técnica - apenas PRO+
export function TechnicalAnalysisBlock({ children }: { children: React.ReactNode }) {
  return (
    <PlanGuard requiredPlan="PRO" feature="technical_analysis">
      {children}
    </PlanGuard>
  );
}

// Exportação de Análise Técnica - apenas PRO+
export function ExportTechnicalAnalysisBlock({ children }: { children: React.ReactNode }) {
  return (
    <PlanGuard requiredPlan="PRO" feature="export_technical_analysis">
      {children}
    </PlanGuard>
  );
}

// CRM - apenas ENTERPRISE
export function CRMBlock({ children }: { children: React.ReactNode }) {
  return (
    <PlanGuard requiredPlan="ENTERPRISE" feature="crm">
      {children}
    </PlanGuard>
  );
}

// Exportação de CRM - apenas ENTERPRISE
export function ExportCRMBlock({ children }: { children: React.ReactNode }) {
  return (
    <PlanGuard requiredPlan="ENTERPRISE" feature="export_crm">
      {children}
    </PlanGuard>
  );
}

// Integrações API - apenas ENTERPRISE
export function APIIntegrationsBlock({ children }: { children: React.ReactNode }) {
  return (
    <PlanGuard requiredPlan="ENTERPRISE" feature="api_integrations">
      {children}
    </PlanGuard>
  );
}