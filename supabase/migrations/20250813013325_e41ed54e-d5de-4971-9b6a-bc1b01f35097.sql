
-- 1) Marcar perfis como ativos/inativos e registrar data de desativação
ALTER TABLE public.user_profiles
  ADD COLUMN IF NOT EXISTS is_active boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS deactivated_at timestamptz NULL;

-- 2) Índice auxiliar (consultas e bloqueios futuros)
CREATE INDEX IF NOT EXISTS idx_user_profiles_is_active ON public.user_profiles(is_active);
