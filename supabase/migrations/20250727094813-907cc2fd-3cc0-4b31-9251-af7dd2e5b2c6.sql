-- Primeiro, vamos corrigir usuários existentes que não possuem ref_code
UPDATE public.user_profiles 
SET ref_code = CONCAT('REF_', SUBSTRING(id::text, 1, 8))
WHERE ref_code IS NULL OR ref_code = '';

-- Agora vamos atualizar a função handle_new_user_profile para gerar ref_code automaticamente
CREATE OR REPLACE FUNCTION public.handle_new_user_profile()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
DECLARE
    new_ref_code TEXT;
BEGIN
  -- Gerar um ref_code único baseado no ID
  new_ref_code := CONCAT('REF_', SUBSTRING(NEW.id::text, 1, 8));
  
  INSERT INTO public.user_profiles (
    user_id, 
    full_name,
    company,
    cargo,
    avatar_url,
    avatar_type,
    gender,
    ref_code
  )
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'company', ''),
    COALESCE(NEW.raw_user_meta_data->>'cargo', ''),
    NEW.raw_user_meta_data->>'avatar_url',
    COALESCE(NEW.raw_user_meta_data->>'avatar_type', 'initials'),
    COALESCE(NEW.raw_user_meta_data->>'gender', 'male'),
    new_ref_code
  );
  
  -- Inserir assinatura FREE como padrão
  INSERT INTO public.user_subscriptions (user_id, plan, status)
  VALUES (NEW.id, 'free', 'active');
  
  RETURN NEW;
END;
$function$;