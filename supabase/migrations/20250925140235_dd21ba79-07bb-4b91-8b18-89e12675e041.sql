-- Adicionar colunas necessárias na tabela users se não existirem
ALTER TABLE users ADD COLUMN IF NOT EXISTS name text;
ALTER TABLE users ADD COLUMN IF NOT EXISTS role_title text;
ALTER TABLE users ADD COLUMN IF NOT EXISTS company text;
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone text;
ALTER TABLE users ADD COLUMN IF NOT EXISTS city text;
ALTER TABLE users ADD COLUMN IF NOT EXISTS state text;
ALTER TABLE users ADD COLUMN IF NOT EXISTS status text DEFAULT 'active';
ALTER TABLE users ADD COLUMN IF NOT EXISTS plan_code text DEFAULT 'basic';

-- Remover policy existente se houver
DROP POLICY IF EXISTS "admin_updates_via_service_role" ON users;

-- Criar policy para updates admin usando service role
CREATE POLICY "admin_updates_via_service_role"
ON users FOR UPDATE
USING (auth.role() = 'service_role')
WITH CHECK (true);

-- Endpoint para atualizar usuário (via RPC para controle total)
CREATE OR REPLACE FUNCTION admin_update_user_profile(
  target_user_id uuid,
  admin_user_id uuid,
  user_data jsonb
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  old_record record;
  new_record record;
BEGIN
  -- Verificar se é admin
  IF NOT EXISTS (
    SELECT 1 FROM public.admin_permissions 
    WHERE user_id = admin_user_id 
    AND active = true 
    AND role IN ('super_admin', 'admin')
  ) THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'UNAUTHORIZED',
      'message', 'Acesso negado'
    );
  END IF;

  -- Buscar registro atual
  SELECT * INTO old_record FROM users WHERE id = target_user_id;
  
  IF NOT FOUND THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'USER_NOT_FOUND',
      'message', 'Usuário não encontrado'
    );
  END IF;

  -- Proteção do usuário supremo
  IF old_record.email = 'brendendood2014@gmail.com' THEN
    -- Verificar se está tentando fazer downgrade
    IF user_data ? 'plan_code' AND (user_data->>'plan_code') != 'enterprise' THEN
      RETURN jsonb_build_object(
        'success', false,
        'error', 'SUPREME_PROTECTION_TRIGGERED',
        'message', 'Usuário supremo não pode ter plano reduzido'
      );
    END IF;
  END IF;

  -- Atualizar campos permitidos
  UPDATE users SET
    name = COALESCE(user_data->>'name', name),
    role_title = COALESCE(user_data->>'role_title', role_title),
    company = COALESCE(user_data->>'company', company),
    phone = COALESCE(user_data->>'phone', phone),
    city = COALESCE(user_data->>'city', city),
    state = COALESCE(user_data->>'state', state),
    plan_code = CASE 
      WHEN user_data ? 'plan_code' AND (user_data->>'plan_code') IN ('basic', 'pro', 'enterprise') 
      THEN (user_data->>'plan_code')
      ELSE plan_code 
    END,
    status = CASE 
      WHEN user_data ? 'status' AND (user_data->>'status') IN ('active', 'blocked', 'pending')
      THEN (user_data->>'status')
      ELSE status 
    END,
    updated_at = now()
  WHERE id = target_user_id
  RETURNING * INTO new_record;

  -- Log de auditoria
  INSERT INTO admin_actions (
    admin_user_id,
    target_user_id,
    action,
    payload,
    created_at
  ) VALUES (
    admin_user_id,
    target_user_id,
    'ADMIN_USER_UPDATE',
    jsonb_build_object(
      'before', to_jsonb(old_record),
      'after', to_jsonb(new_record),
      'changes', user_data
    ),
    now()
  );

  -- Notificar mudança para tempo real
  PERFORM pg_notify('user_updated', jsonb_build_object(
    'user_id', target_user_id,
    'changes', user_data
  )::text);

  RETURN jsonb_build_object(
    'success', true,
    'data', to_jsonb(new_record),
    'message', 'Usuário atualizado com sucesso'
  );
END;
$$;