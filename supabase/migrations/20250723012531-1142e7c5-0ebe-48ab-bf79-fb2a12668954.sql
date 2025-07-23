
-- Criar trigger para capturar dados reais de login
CREATE OR REPLACE FUNCTION public.handle_user_login()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- Inserir dados reais de login na tabela user_login_history
  INSERT INTO public.user_login_history (
    user_id,
    login_at,
    ip_address,
    user_agent,
    device_type,
    browser,
    os
  ) VALUES (
    NEW.user_id,
    NEW.created_at,
    NEW.ip_address::inet,
    COALESCE(NEW.user_agent, 'Unknown'),
    CASE 
      WHEN NEW.user_agent ILIKE '%mobile%' OR NEW.user_agent ILIKE '%android%' OR NEW.user_agent ILIKE '%iphone%' THEN 'Mobile'
      WHEN NEW.user_agent ILIKE '%tablet%' OR NEW.user_agent ILIKE '%ipad%' THEN 'Tablet'
      ELSE 'Desktop'
    END,
    CASE 
      WHEN NEW.user_agent ILIKE '%chrome%' THEN 'Chrome'
      WHEN NEW.user_agent ILIKE '%firefox%' THEN 'Firefox'
      WHEN NEW.user_agent ILIKE '%safari%' THEN 'Safari'
      WHEN NEW.user_agent ILIKE '%edge%' THEN 'Edge'
      ELSE 'Other'
    END,
    CASE 
      WHEN NEW.user_agent ILIKE '%windows%' THEN 'Windows'
      WHEN NEW.user_agent ILIKE '%mac%' THEN 'macOS'
      WHEN NEW.user_agent ILIKE '%linux%' THEN 'Linux'
      WHEN NEW.user_agent ILIKE '%android%' THEN 'Android'
      WHEN NEW.user_agent ILIKE '%ios%' THEN 'iOS'
      ELSE 'Other'
    END
  );
  
  RETURN NEW;
END;
$$;

-- Criar trigger na tabela auth.sessions para capturar logins reais
CREATE TRIGGER on_user_login
  AFTER INSERT ON auth.sessions
  FOR EACH ROW EXECUTE FUNCTION public.handle_user_login();

-- Função para buscar localização por IP (será chamada pelo frontend)
CREATE OR REPLACE FUNCTION public.update_login_location(
  login_id uuid,
  lat numeric,
  lng numeric,
  city_name text,
  region_name text,
  country_name text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.user_login_history 
  SET 
    latitude = lat,
    longitude = lng,
    city = city_name,
    region = region_name,
    country = country_name
  WHERE id = login_id AND user_id = auth.uid();
END;
$$;

-- Permitir que usuários vejam apenas seus próprios dados de login
CREATE POLICY "Users can view own login history" ON public.user_login_history
  FOR SELECT USING (auth.uid() = user_id);

-- Permitir inserção de dados de login
CREATE POLICY "System can insert login history" ON public.user_login_history
  FOR INSERT WITH CHECK (true);

-- Permitir que usuários atualizem localização de seus próprios logins
CREATE POLICY "Users can update own login location" ON public.user_login_history
  FOR UPDATE USING (auth.uid() = user_id);
