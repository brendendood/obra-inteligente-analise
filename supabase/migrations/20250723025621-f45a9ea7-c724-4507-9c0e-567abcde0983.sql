-- Redefinir todas as fotos de usuários para null e avatar_type para 'initials'
UPDATE user_profiles 
SET 
  avatar_url = NULL,
  avatar_type = 'initials'
WHERE avatar_url IS NOT NULL OR avatar_type != 'initials';