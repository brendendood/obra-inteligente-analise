-- 1) Função utilitária para updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 2) Alterar tabela projects para suportar PDF e checksum
ALTER TABLE public.projects
  ADD COLUMN IF NOT EXISTS pdf_url text,
  ADD COLUMN IF NOT EXISTS pdf_checksum text;

-- Evitar duplicidade de upload por usuário e arquivo (checksum)
CREATE UNIQUE INDEX IF NOT EXISTS projects_user_pdf_checksum_unique
  ON public.projects (user_id, pdf_checksum)
  WHERE pdf_checksum IS NOT NULL;

-- Garantir trigger de updated_at em projects
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger
    WHERE tgname = 'update_projects_updated_at'
  ) THEN
    CREATE TRIGGER update_projects_updated_at
    BEFORE UPDATE ON public.projects
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
END $$;

-- 3) Tabela de Itens de Orçamento Normalizados
CREATE TABLE IF NOT EXISTS public.project_budget_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  topic text,
  unit_value numeric(14,2) NOT NULL DEFAULT 0,
  quantity numeric(14,4) NOT NULL DEFAULT 0,
  unit text,
  category text,
  environment text,
  description text,
  sinapi_code text,
  subtotal numeric(14,2) GENERATED ALWAYS AS (unit_value * quantity) STORED,
  sort_order integer,
  source text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_project_budget_items_project_id
  ON public.project_budget_items(project_id);
CREATE INDEX IF NOT EXISTS idx_project_budget_items_category
  ON public.project_budget_items(category);
CREATE INDEX IF NOT EXISTS idx_project_budget_items_sort
  ON public.project_budget_items(project_id, sort_order);

-- Constraint única para upsert por (project_id, topic, description, sinapi_code)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'project_budget_items_unique_upsert'
  ) THEN
    ALTER TABLE public.project_budget_items
      ADD CONSTRAINT project_budget_items_unique_upsert
      UNIQUE (project_id, topic, description, sinapi_code);
  END IF;
END $$;

-- Trigger updated_at para itens de orçamento
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_project_budget_items_updated_at'
  ) THEN
    CREATE TRIGGER update_project_budget_items_updated_at
    BEFORE UPDATE ON public.project_budget_items
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
END $$;

-- RLS para project_budget_items
ALTER TABLE public.project_budget_items ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Users can view their budget items'
  ) THEN
    CREATE POLICY "Users can view their budget items"
    ON public.project_budget_items
    FOR SELECT
    USING (
      EXISTS (
        SELECT 1 FROM public.projects p
        WHERE p.id = project_id AND p.user_id = auth.uid()
      )
    );
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Users can insert their budget items'
  ) THEN
    CREATE POLICY "Users can insert their budget items"
    ON public.project_budget_items
    FOR INSERT
    WITH CHECK (
      EXISTS (
        SELECT 1 FROM public.projects p
        WHERE p.id = project_id AND p.user_id = auth.uid()
      )
    );
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Users can update their budget items'
  ) THEN
    CREATE POLICY "Users can update their budget items"
    ON public.project_budget_items
    FOR UPDATE
    USING (
      EXISTS (
        SELECT 1 FROM public.projects p
        WHERE p.id = project_id AND p.user_id = auth.uid()
      )
    );
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Users can delete their budget items'
  ) THEN
    CREATE POLICY "Users can delete their budget items"
    ON public.project_budget_items
    FOR DELETE
    USING (
      EXISTS (
        SELECT 1 FROM public.projects p
        WHERE p.id = project_id AND p.user_id = auth.uid()
      )
    );
  END IF;
END $$;

-- 4) Tabela de Etapas/Tarefas do Cronograma
CREATE TABLE IF NOT EXISTS public.project_schedule_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  stage_name text NOT NULL,
  stage_number integer,
  duration_days integer,
  start_date date,
  end_date date,
  status text DEFAULT 'planejado',
  category text,
  dependency_id uuid NULL REFERENCES public.project_schedule_tasks(id) ON DELETE SET NULL,
  source text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_project_schedule_tasks_project_id
  ON public.project_schedule_tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_project_schedule_tasks_status
  ON public.project_schedule_tasks(status);

-- Uniques para upsert: (project_id, stage_number) quando informado; fallback por (project_id, stage_name) quando stage_number é nulo
CREATE UNIQUE INDEX IF NOT EXISTS schedule_unique_project_stage_number
  ON public.project_schedule_tasks(project_id, stage_number)
  WHERE stage_number IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS schedule_unique_project_stage_name_fallback
  ON public.project_schedule_tasks(project_id, stage_name)
  WHERE stage_number IS NULL;

-- Trigger updated_at para cronograma
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_project_schedule_tasks_updated_at'
  ) THEN
    CREATE TRIGGER update_project_schedule_tasks_updated_at
    BEFORE UPDATE ON public.project_schedule_tasks
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
END $$;

-- RLS para project_schedule_tasks
ALTER TABLE public.project_schedule_tasks ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Users can view their schedule tasks'
  ) THEN
    CREATE POLICY "Users can view their schedule tasks"
    ON public.project_schedule_tasks
    FOR SELECT
    USING (
      EXISTS (
        SELECT 1 FROM public.projects p
        WHERE p.id = project_id AND p.user_id = auth.uid()
      )
    );
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Users can insert their schedule tasks'
  ) THEN
    CREATE POLICY "Users can insert their schedule tasks"
    ON public.project_schedule_tasks
    FOR INSERT
    WITH CHECK (
      EXISTS (
        SELECT 1 FROM public.projects p
        WHERE p.id = project_id AND p.user_id = auth.uid()
      )
    );
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Users can update their schedule tasks'
  ) THEN
    CREATE POLICY "Users can update their schedule tasks"
    ON public.project_schedule_tasks
    FOR UPDATE
    USING (
      EXISTS (
        SELECT 1 FROM public.projects p
        WHERE p.id = project_id AND p.user_id = auth.uid()
      )
    );
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Users can delete their schedule tasks'
  ) THEN
    CREATE POLICY "Users can delete their schedule tasks"
    ON public.project_schedule_tasks
    FOR DELETE
    USING (
      EXISTS (
        SELECT 1 FROM public.projects p
        WHERE p.id = project_id AND p.user_id = auth.uid()
      )
    );
  END IF;
END $$;

-- 5) View de resumo do projeto para UI
DROP VIEW IF EXISTS public.v_project_summary;
CREATE VIEW public.v_project_summary AS
WITH bi AS (
  SELECT 
    project_id,
    COUNT(*) AS total_items,
    COALESCE(SUM(subtotal), 0)::numeric AS total_budget
  FROM public.project_budget_items
  GROUP BY project_id
),
st AS (
  SELECT 
    project_id,
    COUNT(*) AS total_stages
  FROM public.project_schedule_tasks
  GROUP BY project_id
),
stc AS (
  SELECT 
    project_id,
    COUNT(*) AS stages_completed
  FROM public.project_schedule_tasks
  WHERE status = 'concluido'
  GROUP BY project_id
),
range AS (
  SELECT 
    project_id,
    MIN(start_date) AS overall_start,
    MAX(end_date)   AS overall_end
  FROM public.project_schedule_tasks
  GROUP BY project_id
)
SELECT 
  p.id AS project_id,
  COALESCE(bi.total_items, 0) AS total_items,
  COALESCE(bi.total_budget, 0) AS total_budget,
  COALESCE(st.total_stages, 0) AS total_stages,
  COALESCE(stc.stages_completed, 0) AS stages_completed,
  CASE 
    WHEN COALESCE(st.total_stages, 0) > 0 
      THEN ROUND((COALESCE(stc.stages_completed, 0)::numeric / st.total_stages::numeric) * 100, 2)
    ELSE 0
  END AS progress_percent,
  range.overall_start,
  range.overall_end
FROM public.projects p
LEFT JOIN bi ON bi.project_id = p.id
LEFT JOIN st ON st.project_id = p.id
LEFT JOIN stc ON stc.project_id = p.id
LEFT JOIN range ON range.project_id = p.id;
