-- Limpar localizações incorretas de Frankfurt/data centers e forçar nova captura
UPDATE public.user_login_history 
SET 
    city = NULL,
    region = NULL,
    country = NULL,
    latitude = NULL,
    longitude = NULL
WHERE 
    -- Remover dados de Frankfurt e outras localizações de data center
    (city ILIKE '%frankfurt%' OR 
     city ILIKE '%amazon%' OR
     city ILIKE '%aws%' OR
     city ILIKE '%google%' OR
     city ILIKE '%microsoft%' OR
     region ILIKE '%frankfurt%' OR
     country = 'Germany' AND city IS NOT NULL AND region IS NOT NULL) AND
    -- Manter apenas registros dos últimos 30 dias
    login_at >= NOW() - INTERVAL '30 days';

-- Também limpar perfis com dados incorretos
UPDATE public.user_profiles 
SET 
    city = NULL,
    state = NULL,
    country = 'Brasil'  -- Manter padrão brasileiro
WHERE 
    (city ILIKE '%frankfurt%' OR 
     city ILIKE '%amazon%' OR
     city ILIKE '%aws%' OR
     state ILIKE '%frankfurt%' OR
     country = 'Germany');

-- Notificar para recaptura de geolocalização para todos os usuários com IPs válidos
-- (será processado pelas edge functions automaticamente nos próximos logins)