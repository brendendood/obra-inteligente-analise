-- 1.1 Funções auxiliares
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN 
  NEW.updated_at = NOW(); 
  RETURN NEW; 
END; 
$$;

CREATE OR REPLACE FUNCTION public.is_admin_user()
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.admin_permissions ap
    WHERE ap.user_id = auth.uid() 
      AND ap.active = true
      AND ap.role = 'super_admin'
  );
$$;

-- 1.2 Remover política antiga e criar nova (INSERT só service_role)
DROP POLICY IF EXISTS "System can insert accounts" ON public.accounts;

CREATE POLICY "Service role can insert accounts"
ON public.accounts FOR INSERT
WITH CHECK (auth.role() = 'service_role');

-- 1.3 Restringir UPDATE (usuário não pode se auto-promover)
DROP POLICY IF EXISTS "Users can update own account" ON public.accounts;

CREATE POLICY "User can update safe fields"
ON public.accounts FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (
  auth.uid() = user_id
  AND account_type = (SELECT account_type FROM public.accounts WHERE user_id = auth.uid())
  AND account_status = (SELECT account_status FROM public.accounts WHERE user_id = auth.uid())
  AND stripe_customer_id IS NOT DISTINCT FROM (SELECT stripe_customer_id FROM public.accounts WHERE user_id = auth.uid())
  AND stripe_subscription_id IS NOT DISTINCT FROM (SELECT stripe_subscription_id FROM public.accounts WHERE user_id = auth.uid())
  AND plan_price_id IS NOT DISTINCT FROM (SELECT plan_price_id FROM public.accounts WHERE user_id = auth.uid())
  AND plan_name IS NOT DISTINCT FROM (SELECT plan_name FROM public.accounts WHERE user_id = auth.uid())
  AND plan_renews_at IS NOT DISTINCT FROM (SELECT plan_renews_at FROM public.accounts WHERE user_id = auth.uid())
  AND deactivated_at IS NOT DISTINCT FROM (SELECT deactivated_at FROM public.accounts WHERE user_id = auth.uid())
);

CREATE POLICY "Service role can update accounts"
ON public.accounts FOR UPDATE
USING (auth.role() = 'service_role')
WITH CHECK (true);

-- 1.4 Índices únicos condicionais
CREATE UNIQUE INDEX IF NOT EXISTS uniq_accounts_stripe_customer_id
ON public.accounts (stripe_customer_id) WHERE stripe_customer_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS uniq_accounts_stripe_subscription_id
ON public.accounts (stripe_subscription_id) WHERE stripe_subscription_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_accounts_created_at ON public.accounts(created_at);

-- 1.6 Tabela de logs de webhook
CREATE TABLE IF NOT EXISTS public.stripe_events (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL,
  payload JSONB NOT NULL,
  received_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.stripe_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view stripe events"
ON public.stripe_events FOR SELECT
USING (public.is_admin_user());

-- 2. Função de expiração automática (usando cálculo direto)
CREATE OR REPLACE FUNCTION public.deactivate_expired_trials()
RETURNS void LANGUAGE sql SECURITY DEFINER SET search_path = public AS $$
  UPDATE public.accounts a
     SET account_status = 'deactivated_permanently',
         deactivated_at = NOW()
   WHERE a.account_type = 'trial'
     AND a.account_status = 'active'
     AND (a.created_at + INTERVAL '7 days') <= NOW()
     AND a.stripe_subscription_id IS NULL;
$$;

-- 3. Política de limite de 1 projeto no trial
DROP POLICY IF EXISTS "Trial users can insert only 1 project" ON public.projects;

CREATE POLICY "Trial users can insert only 1 project"
ON public.projects FOR INSERT
WITH CHECK (
  auth.uid() = user_id
  AND (
    CASE
      WHEN (SELECT account_type FROM public.accounts WHERE user_id = auth.uid()) = 'trial'
      THEN (SELECT COUNT(*) FROM public.projects p WHERE p.user_id = auth.uid()) < 1
      ELSE true
    END
  )
);

-- Trigger para updated_at na tabela accounts
DROP TRIGGER IF EXISTS update_accounts_updated_at ON public.accounts;
CREATE TRIGGER update_accounts_updated_at
BEFORE UPDATE ON public.accounts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();