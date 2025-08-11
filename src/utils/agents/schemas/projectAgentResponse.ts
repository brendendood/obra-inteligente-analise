import { z } from 'zod';

// Agent output schema for structured project data
export const ProjectsUpdateSchema = z.object({
  project_type: z.string().optional(),
  project_status: z.string().optional(),
  total_area: z.number().optional(),
  estimated_budget: z.number().optional(),
  description: z.string().optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
});

export const BudgetItemSchema = z.object({
  topic: z.string().optional(),
  description: z.string().optional(),
  unit: z.string().optional(),
  unit_value: z.number(),
  quantity: z.number(),
  subtotal: z.number().optional(),
  category: z.string().optional(),
  environment: z.string().optional(),
  sinapi_code: z.string().optional(),
  source: z.string().optional(),
  sort_order: z.number().optional(),
});

export const ScheduleTaskSchema = z.object({
  stage_name: z.string(),
  stage_number: z.number().optional(),
  duration_days: z.number().optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  status: z.string().optional(),
  category: z.string().optional(),
  dependency_id: z.string().optional(),
});

export const ProjectAnalysesSchema = z.object({
  analysis_type: z.string().default('n8n_parsed_pdf'),
  results: z.any(),
});

export const ProjectAgentResponseSchema = z.object({
  version: z.string().default('1.0'),
  replace_existing: z.boolean().default(true),
  projects_update: ProjectsUpdateSchema.optional(),
  project_budget_items_insert: z.array(BudgetItemSchema).optional(),
  project_schedule_tasks_insert: z.array(ScheduleTaskSchema).optional(),
  project_analyses_insert: ProjectAnalysesSchema.optional(),
});

export type ProjectAgentResponse = z.infer<typeof ProjectAgentResponseSchema>;
