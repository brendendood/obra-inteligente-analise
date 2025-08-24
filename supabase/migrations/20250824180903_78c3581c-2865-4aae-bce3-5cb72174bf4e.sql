-- Tipos de enum para plano e ciclo
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'plan_tier') THEN
    CREATE TYPE public.plan_tier AS ENUM ('SOLO','STUDIO','ENTERPRISE');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'billing_cycle') THEN
    CREATE TYPE public.billing_cycle AS ENUM ('mensal','anual');
  END IF;
END$$;

-- Tabela de planos por usuário (1:1 com auth.users)
CREATE TABLE IF NOT EXISTS public.user_plans (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_tier public.plan_tier NOT NULL DEFAULT 'SOLO',
  billing_cycle public.billing_cycle NOT NULL DEFAULT 'mensal',
  seats integer NOT NULL DEFAULT 1,
  messages_quota integer NOT NULL DEFAULT 500,
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- RLS
ALTER TABLE public.user_plans ENABLE ROW LEVEL SECURITY;

-- Usuário autenticado pode ver apenas o próprio plano
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'user_plans' AND policyname = 'select_own_plan'
  ) THEN
    CREATE POLICY select_own_plan
      ON public.user_plans
      FOR SELECT
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;
END$$;

-- Bloqueia INSERT/UPDATE/DELETE por usuários comuns (apenas service role ou políticas futuras)
REVOKE INSERT, UPDATE, DELETE ON public.user_plans FROM authenticated;

-- Índices úteis
CREATE INDEX IF NOT EXISTS idx_user_plans_plan_tier ON public.user_plans (plan_tier);
CREATE INDEX IF NOT EXISTS idx_user_plans_billing_cycle ON public.user_plans (billing_cycle);