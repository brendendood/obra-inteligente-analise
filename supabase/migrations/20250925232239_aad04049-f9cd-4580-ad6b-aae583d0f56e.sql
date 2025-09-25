-- ✅ STEP 1: Remover tabela desnecessária confirmada
DROP TABLE IF EXISTS public.kv_store_40b370d9;

-- ✅ STEP 2: Corrigir função da tabela plans para ser útil
CREATE OR REPLACE FUNCTION public.get_plan_info(plan_code text)
RETURNS TABLE(
  code text,
  base_quota integer,
  display_name text,
  description text
)
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.code,
    p.base_quota,
    CASE p.code
      WHEN 'BASIC' THEN 'Plano Básico'
      WHEN 'PRO' THEN 'Plano Pro'
      WHEN 'ENTERPRISE' THEN 'Plano Enterprise'
      ELSE 'Plano Desconhecido'
    END as display_name,
    CASE p.code
      WHEN 'BASIC' THEN 'Ideal para projetos pequenos'
      WHEN 'PRO' THEN 'Para profissionais e empresas'
      WHEN 'ENTERPRISE' THEN 'Solução corporativa completa'
      ELSE 'Descrição não disponível'
    END as description
  FROM public.plans p
  WHERE p.code = plan_code;
END;
$$;

-- ✅ STEP 3: Melhorar tabela payments para controle total de pagamentos
ALTER TABLE public.payments 
ADD COLUMN IF NOT EXISTS plan_purchased text,
ADD COLUMN IF NOT EXISTS payment_source text DEFAULT 'cakto',
ADD COLUMN IF NOT EXISTS cakto_transaction_id text,
ADD COLUMN IF NOT EXISTS billing_period text,
ADD COLUMN IF NOT EXISTS card_last_digits text,
ADD COLUMN IF NOT EXISTS card_brand text,
ADD COLUMN IF NOT EXISTS next_payment_date timestamp with time zone,
ADD COLUMN IF NOT EXISTS is_recurring boolean DEFAULT false;

-- Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON public.payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON public.payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_cakto_id ON public.payments(cakto_transaction_id);

-- ✅ STEP 4: Função para processar webhook do Cakto
CREATE OR REPLACE FUNCTION public.process_cakto_payment(
  p_cakto_transaction_id text,
  p_user_email text,
  p_amount numeric,
  p_status text,
  p_plan_purchased text,
  p_card_last_digits text DEFAULT NULL,
  p_card_brand text DEFAULT NULL,
  p_is_recurring boolean DEFAULT false,
  p_billing_period text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  target_user_id uuid;
  payment_id uuid;
  result jsonb;
BEGIN
  -- Buscar usuário pelo email
  SELECT id INTO target_user_id
  FROM auth.users
  WHERE email = p_user_email;
  
  IF target_user_id IS NULL THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'USER_NOT_FOUND',
      'message', 'Usuário não encontrado: ' || p_user_email
    );
  END IF;
  
  -- Inserir ou atualizar pagamento
  INSERT INTO public.payments (
    user_id,
    amount,
    currency,
    status,
    payment_method,
    payment_source,
    cakto_transaction_id,
    plan_purchased,
    card_last_digits,
    card_brand,
    is_recurring,
    billing_period,
    next_payment_date
  ) VALUES (
    target_user_id,
    p_amount,
    'BRL',
    p_status,
    'credit_card',
    'cakto',
    p_cakto_transaction_id,
    p_plan_purchased,
    p_card_last_digits,
    p_card_brand,
    p_is_recurring,
    p_billing_period,
    CASE 
      WHEN p_is_recurring AND p_billing_period = 'monthly' 
      THEN now() + INTERVAL '1 month'
      WHEN p_is_recurring AND p_billing_period = 'yearly' 
      THEN now() + INTERVAL '1 year'
      ELSE NULL
    END
  )
  ON CONFLICT (cakto_transaction_id) 
  DO UPDATE SET
    status = EXCLUDED.status,
    updated_at = now()
  RETURNING id INTO payment_id;
  
  -- Se pagamento aprovado, atualizar plano do usuário
  IF p_status = 'completed' OR p_status = 'paid' THEN
    -- Atualizar user_plans
    INSERT INTO public.user_plans (
      user_id,
      plan_tier,
      billing_cycle,
      seats,
      messages_quota
    ) VALUES (
      target_user_id,
      p_plan_purchased::plan_tier,
      CASE p_billing_period WHEN 'yearly' THEN 'anual' ELSE 'mensal' END::billing_cycle,
      1,
      CASE p_plan_purchased
        WHEN 'SOLO' THEN 500
        WHEN 'STUDIO' THEN 2000
        WHEN 'ENTERPRISE' THEN 2147483647
        ELSE 500
      END
    )
    ON CONFLICT (user_id)
    DO UPDATE SET
      plan_tier = EXCLUDED.plan_tier,
      billing_cycle = EXCLUDED.billing_cycle,
      messages_quota = EXCLUDED.messages_quota,
      updated_at = now();
  END IF;
  
  RETURN jsonb_build_object(
    'success', true,
    'payment_id', payment_id,
    'user_id', target_user_id,
    'plan_updated', (p_status = 'completed' OR p_status = 'paid')
  );
  
EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object(
    'success', false,
    'error', 'SYSTEM_ERROR',
    'message', 'Erro interno: ' || SQLERRM
  );
END;
$$;