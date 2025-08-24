-- ########## PLANOS: FREE, BASIC, PRO, ENTERPRISE ##########

-- 1) Criar novo ENUM
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'plan_tier_v2') THEN
    CREATE TYPE public.plan_tier_v2 AS ENUM ('FREE','BASIC','PRO','ENTERPRISE');
  END IF;
END$$;

-- 2) Criar/migrar tabela user_plans
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='user_plans') THEN
    -- Adicionar nova coluna se não existir
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='user_plans' AND column_name='plan_tier_new') THEN
      ALTER TABLE public.user_plans ADD COLUMN plan_tier_new public.plan_tier_v2;
      
      -- Migrar valores
      UPDATE public.user_plans
      SET plan_tier_new = CASE 
        WHEN plan_tier::text = 'SOLO' THEN 'FREE'::public.plan_tier_v2
        WHEN plan_tier::text = 'STUDIO' THEN 'BASIC'::public.plan_tier_v2  
        WHEN plan_tier::text = 'ENTERPRISE' THEN 'ENTERPRISE'::public.plan_tier_v2
        ELSE 'FREE'::public.plan_tier_v2
      END;
      
      -- Substituir coluna
      ALTER TABLE public.user_plans DROP COLUMN IF EXISTS plan_tier;
      ALTER TABLE public.user_plans RENAME COLUMN plan_tier_new TO plan_tier;
      ALTER TABLE public.user_plans ALTER COLUMN plan_tier SET NOT NULL;
      ALTER TABLE public.user_plans ALTER COLUMN plan_tier SET DEFAULT 'FREE'::public.plan_tier_v2;
    END IF;
  ELSE
    -- Criar tabela do zero
    CREATE TABLE public.user_plans (
      user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
      plan_tier public.plan_tier_v2 NOT NULL DEFAULT 'FREE',
      billing_cycle text NOT NULL DEFAULT 'mensal',
      seats integer NOT NULL DEFAULT 1,
      messages_quota integer NOT NULL DEFAULT 50,
      updated_at timestamptz NOT NULL DEFAULT now(),
      created_at timestamptz NOT NULL DEFAULT now()
    );
    ALTER TABLE public.user_plans ENABLE ROW LEVEL SECURITY;
  END IF;
END$$;

-- 3) Limpar políticas antigas e criar novas
DROP POLICY IF EXISTS "select_own_plan" ON public.user_plans;
DROP POLICY IF EXISTS "select_own_plan_v2" ON public.user_plans;

CREATE POLICY "select_own_plan_v2"
  ON public.user_plans
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

REVOKE INSERT, UPDATE, DELETE ON public.user_plans FROM authenticated;

-- 4) Criar tabela de tracking de mensagens IA
CREATE TABLE IF NOT EXISTS public.ai_message_usage (
  id bigserial PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  period_ym char(7) NOT NULL,
  count int NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, period_ym)
);

ALTER TABLE public.ai_message_usage ENABLE ROW LEVEL SECURITY;

-- 5) Políticas RLS para ai_message_usage
DROP POLICY IF EXISTS "select_own_ai_usage" ON public.ai_message_usage;
DROP POLICY IF EXISTS "insert_own_ai_usage" ON public.ai_message_usage;
DROP POLICY IF EXISTS "update_own_ai_usage" ON public.ai_message_usage;

CREATE POLICY "select_own_ai_usage"
  ON public.ai_message_usage
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "insert_own_ai_usage"
  ON public.ai_message_usage
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "update_own_ai_usage"
  ON public.ai_message_usage
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_ai_usage_user_period ON public.ai_message_usage (user_id, period_ym);

-- 6) Backfill para usuários sem plano
INSERT INTO public.user_plans (user_id, plan_tier, billing_cycle, seats, messages_quota)
SELECT u.id, 'FREE'::public.plan_tier_v2, 'mensal', 1, 50
FROM auth.users u
LEFT JOIN public.user_plans p ON p.user_id = u.id
WHERE p.user_id IS NULL;