-- Resetar todas as localizações existentes na tabela user_login_history
UPDATE public.user_login_history 
SET 
  latitude = NULL,
  longitude = NULL,
  city = NULL,
  region = NULL,
  country = NULL
WHERE id IS NOT NULL;

-- Comentário: Isso remove todas as localizações existentes para que
-- os próximos logins capturem a localização real baseada no IP