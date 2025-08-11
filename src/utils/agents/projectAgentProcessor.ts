import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { Project } from '@/types/project';
import { sendMessageToAgent } from './unifiedAgentService';
import { z } from 'zod';
import {
  ProjectAgentResponseSchema,
  ProjectAgentResponse,
} from './schemas/projectAgentResponse';

const tryExtractJSON = (text: string): any => {
  const trimmed = text.trim();
  // Remove code fences if present
  const fenceMatch = trimmed.match(/```(?:json)?\n([\s\S]*?)```/i);
  const jsonStr = fenceMatch ? fenceMatch[1] : trimmed;
  // Find first and last braces to be safe
  const firstBrace = jsonStr.indexOf('{');
  const lastBrace = jsonStr.lastIndexOf('}');
  const candidate = firstBrace !== -1 && lastBrace !== -1 ? jsonStr.slice(firstBrace, lastBrace + 1) : jsonStr;
  return JSON.parse(candidate);
};

export interface ProcessOptions {
  replaceExisting?: boolean;
}

export const runProjectAgentAndPersist = async (
  project: Project,
  user: User | null,
  options: ProcessOptions = {}
): Promise<ProjectAgentResponse> => {
  // 1) Ask agent for structured data
  const message = `Estruture os dados do projeto enviado em PDF e devolva apenas JSON válido conforme o schema acordado.`;

  const raw = await sendMessageToAgent(message, 'analysis', {
    user,
    project,
    intent: 'structure_pdf_data'
  });

  // 2) Parse JSON
  let json: unknown;
  try {
    json = tryExtractJSON(raw);
  } catch (e) {
    console.error('Agent returned non-JSON response:', raw);
    throw new Error('Falha ao interpretar resposta do agente (JSON inválido).');
  }

  // 3) Validate
  const parsed = ProjectAgentResponseSchema.safeParse(json);
  if (!parsed.success) {
    console.error('Schema validation errors:', parsed.error.issues);
    throw new Error('Resposta do agente não segue o schema esperado.');
  }
  const data = parsed.data;

  const replace = options.replaceExisting ?? data.replace_existing ?? true;

  // 4) Persist atomically where possible (best-effort client-side)
  // Update projects
  if (data.projects_update) {
    const { error } = await supabase
      .from('projects')
      .update({ ...data.projects_update })
      .eq('id', project.id);
    if (error) throw error;
  }

  // Budget items
  if (data.project_budget_items_insert && data.project_budget_items_insert.length) {
    if (replace) {
      await supabase.from('project_budget_items').delete().eq('project_id', project.id);
    }
    const items = data.project_budget_items_insert.map((it, idx) => ({
      project_id: project.id,
      topic: it.topic ?? null,
      description: it.description ?? null,
      unit: it.unit ?? null,
      unit_value: it.unit_value,
      quantity: it.quantity,
      subtotal: it.subtotal ?? it.unit_value * it.quantity,
      category: it.category ?? null,
      environment: it.environment ?? null,
      sinapi_code: it.sinapi_code ?? null,
      source: it.source ?? 'n8n',
      sort_order: it.sort_order ?? idx + 1,
    }));
    const { error } = await supabase.from('project_budget_items').insert(items);
    if (error) throw error;
  }

  // Schedule tasks
  if (data.project_schedule_tasks_insert && data.project_schedule_tasks_insert.length) {
    if (replace) {
      await supabase.from('project_schedule_tasks').delete().eq('project_id', project.id);
    }
    const tasks = data.project_schedule_tasks_insert.map((t, idx) => ({
      project_id: project.id,
      stage_name: t.stage_name,
      stage_number: t.stage_number ?? idx + 1,
      duration_days: t.duration_days ?? null,
      start_date: t.start_date ?? null,
      end_date: t.end_date ?? null,
      status: t.status ?? 'planejado',
      category: t.category ?? null,
      dependency_id: t.dependency_id ?? null,
      source: 'n8n',
    }));
    const { error } = await supabase.from('project_schedule_tasks').insert(tasks);
    if (error) throw error;
  }

  // Analyses log
  const resultsPayload = data.project_analyses_insert?.results ?? json;
  const analysisType = data.project_analyses_insert?.analysis_type ?? 'n8n_parsed_pdf';
  await supabase.from('project_analyses').insert({
    project_id: project.id,
    analysis_type: analysisType,
    results: resultsPayload,
  });

  // Touch project updated_at so stores refresh
  await supabase.from('projects').update({ updated_at: new Date().toISOString() }).eq('id', project.id);

  return data;
};
