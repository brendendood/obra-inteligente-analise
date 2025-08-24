-- ########## PLANOS: FREE, BASIC, PRO, ENTERPRISE ##########

-- 1) Criar novo ENUM se necessário e migrar do antigo
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'plan_tier_v2') THEN
    CREATE TYPE public.plan_tier_v2 AS ENUM ('FREE','BASIC','PRO','ENTERPRISE');
  END IF;
END$$;

-- 2) Adicionar coluna temporária se a tabela existir
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='user_plans') THEN
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns
       WHERE table_schema='public' AND table_name='user_plans' AND column_name='plan_tier_v2'
    ) THEN
      ALTER TABLE public.user_plans
        ADD COLUMN plan_tier_v2 public.plan_tier_v2;
    END IF;

    -- Migrar valores antigos se houver (SOLO->FREE, STUDIO->BASIC, ENTERPRISE->ENTERPRISE)
    UPDATE public.user_plans
       SET plan_tier_v2 = CASE (plan_tier::text)
         WHEN 'SOLO' THEN 'FREE'::public.plan_tier_v2
         WHEN 'STUDIO' THEN 'BASIC'::public.plan_tier_v2
         WHEN 'ENTERPRISE' THEN 'ENTERPRISE'::public.plan_tier_v2
         ELSE 'FREE'::public.plan_tier_v2
       END
     WHERE plan_tier_v2 IS NULL;

    -- Se a coluna antiga existir, substituir
    ALTER TABLE public.user_plans
      DROP COLUMN IF EXISTS plan_tier,
      RENAME COLUMN plan_tier_v2 TO plan_tier;
  ELSE
    -- Criar a tabela do zero se não existir
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

-- 3) Políticas RLS: usuário vê só o próprio plano
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='user_plans' AND policyname='select_own_plan_v2'
  ) THEN
    CREATE POLICY select_own_plan_v2
      ON public.user_plans
      FOR SELECT
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;
END$$;

REVOKE INSERT, UPDATE, DELETE ON public.user_plans FROM authenticated;

-- 4) Tabela de uso de mensagens de IA (tracking mensal)
CREATE TABLE IF NOT EXISTS public.ai_message_usage (
  id bigserial PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  period_ym char(7) NOT NULL, -- formato 'YYYY-MM'
  count int NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, period_ym)
);

ALTER TABLE public.ai_message_usage ENABLE ROW LEVEL SECURITY;

-- Usuário pode ver o próprio consumo
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='ai_message_usage' AND policyname='select_own_ai_usage'
  ) THEN
    CREATE POLICY select_own_ai_usage
      ON public.ai_message_usage
      FOR SELECT
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;

  -- Usuário pode inserir/atualizar apenas a própria linha do período atual (upsert via função/servidor recomendado)
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='ai_message_usage' AND policyname='insert_own_ai_usage'
  ) THEN
    CREATE POLICY insert_own_ai_usage
      ON public.ai_message_usage
      FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='ai_message_usage' AND policyname='update_own_ai_usage'
  ) THEN
    CREATE POLICY update_own_ai_usage
      ON public.ai_message_usage
      FOR UPDATE
      TO authenticated
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);
  END IF;
END$$;

CREATE INDEX IF NOT EXISTS idx_ai_usage_user_period ON public.ai_message_usage (user_id, period_ym);

-- 5) Backfill de linhas na user_plans para quem não tem (FREE por padrão)
INSERT INTO public.user_plans (user_id, plan_tier, billing_cycle, seats, messages_quota)
SELECT u.id, 'FREE'::public.plan_tier_v2, 'mensal', 1, 50
FROM auth.users u
LEFT JOIN public.user_plans p ON p.user_id = u.id
WHERE p.user_id IS NULL;