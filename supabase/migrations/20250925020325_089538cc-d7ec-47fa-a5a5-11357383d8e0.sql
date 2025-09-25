-- Migração para integração nativa Stripe/Lovable
-- Remover campo plan_id da tabela users e adicionar plan_code

-- Primeiro, adicionar o novo campo plan_code
ALTER TABLE users ADD COLUMN plan_code TEXT;

-- Migrar dados existentes (mapear plan_id para plan_code)
UPDATE users 
SET plan_code = CASE 
  WHEN plan_id IN (SELECT id FROM plans WHERE code = 'BASIC') THEN 'BASIC'
  WHEN plan_id IN (SELECT id FROM plans WHERE code = 'PRO') THEN 'PRO'  
  WHEN plan_id IN (SELECT id FROM plans WHERE code = 'ENTERPRISE') THEN 'ENTERPRISE'
  ELSE 'BASIC' -- default para plano básico
END;

-- Definir valor padrão para novos usuários
ALTER TABLE users ALTER COLUMN plan_code SET DEFAULT 'BASIC';

-- Tornar o campo obrigatório (não nulo)
ALTER TABLE users ALTER COLUMN plan_code SET NOT NULL;

-- Remover o campo plan_id (após migração dos dados)
ALTER TABLE users DROP COLUMN plan_id;

-- Adicionar comentário explicativo
COMMENT ON COLUMN users.plan_code IS 'Código do plano do usuário, gerenciado automaticamente pelo Stripe/Lovable (BASIC, PRO, ENTERPRISE)';

-- Atualizar função para usar plan_code em vez de plan_id
CREATE OR REPLACE FUNCTION get_user_plan_limits(user_id UUID)
RETURNS TABLE(
  plan_code TEXT,
  base_quota INTEGER,
  total_available INTEGER,
  consumed INTEGER,
  remaining INTEGER
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_plan_code TEXT;
  user_base_consumed INTEGER;
  user_credits INTEGER;
  base_limit INTEGER;
BEGIN
  -- Buscar dados do usuário
  SELECT u.plan_code, u.lifetime_base_consumed
  INTO user_plan_code, user_base_consumed
  FROM users u 
  WHERE u.id = user_id;
  
  -- Buscar créditos extras do usuário
  SELECT COALESCE(up.credits, 0)
  INTO user_credits
  FROM user_profiles up
  WHERE up.user_id = user_id;
  
  -- Definir limite base baseado no plan_code
  base_limit := CASE user_plan_code
    WHEN 'BASIC' THEN 7
    WHEN 'PRO' THEN 20
    WHEN 'ENTERPRISE' THEN NULL -- ilimitado
    ELSE 7 -- default BASIC
  END;
  
  RETURN QUERY SELECT 
    user_plan_code as plan_code,
    base_limit as base_quota,
    CASE 
      WHEN base_limit IS NULL THEN NULL -- ilimitado
      ELSE base_limit + user_credits
    END as total_available,
    user_base_consumed as consumed,
    CASE 
      WHEN base_limit IS NULL THEN NULL -- ilimitado
      ELSE GREATEST(0, (base_limit + user_credits) - user_base_consumed)
    END as remaining;
END;
$$;