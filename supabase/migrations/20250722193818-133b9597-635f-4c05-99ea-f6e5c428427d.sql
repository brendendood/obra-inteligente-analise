
-- Criar bucket para avatars
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'avatars', 
  'avatars', 
  true, 
  307200, -- 300KB em bytes
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/heic', 'application/pdf']
);

-- Políticas RLS para o bucket avatars
CREATE POLICY "Users can upload their own avatars" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view their own avatars" ON storage.objects
FOR SELECT USING (
  bucket_id = 'avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own avatars" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own avatars" ON storage.objects
FOR DELETE USING (
  bucket_id = 'avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Expandir tabela user_profiles com novos campos
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS avatar_url TEXT,
ADD COLUMN IF NOT EXISTS avatar_type TEXT DEFAULT 'emoji',
ADD COLUMN IF NOT EXISTS gender TEXT,
ADD COLUMN IF NOT EXISTS cargo TEXT,
ADD COLUMN IF NOT EXISTS empresa TEXT,
ADD COLUMN IF NOT EXISTS date_of_birth DATE,
ADD COLUMN IF NOT EXISTS bio TEXT,
ADD COLUMN IF NOT EXISTS timezone TEXT DEFAULT 'America/Sao_Paulo';

-- Criar tabela de histórico de login
CREATE TABLE IF NOT EXISTS public.user_login_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  login_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  ip_address INET,
  user_agent TEXT,
  device_type TEXT,
  browser TEXT,
  os TEXT,
  country TEXT,
  region TEXT,
  city TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  session_duration INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Criar tabela de analytics melhorada
CREATE TABLE IF NOT EXISTS public.user_analytics_enhanced (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  event_data JSONB DEFAULT '{}',
  page_url TEXT,
  session_id TEXT,
  ip_address INET,
  user_agent TEXT,
  referrer TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Criar tabela de pagamentos
CREATE TABLE IF NOT EXISTS public.user_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  stripe_payment_intent_id TEXT,
  amount DECIMAL(10,2),
  currency TEXT DEFAULT 'BRL',
  status TEXT,
  payment_method TEXT,
  invoice_url TEXT,
  next_payment_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- RLS para as novas tabelas
ALTER TABLE public.user_login_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_analytics_enhanced ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_payments ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
CREATE POLICY "Users can view own login history" ON public.user_login_history
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Superusers can view all login history" ON public.user_login_history
FOR SELECT USING (is_superuser());

CREATE POLICY "Users can view own analytics" ON public.user_analytics_enhanced
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Superusers can view all analytics" ON public.user_analytics_enhanced
FOR SELECT USING (is_superuser());

CREATE POLICY "Users can view own payments" ON public.user_payments
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Superusers can view all payments" ON public.user_payments
FOR SELECT USING (is_superuser());

-- Função para sincronizar user_profiles com auth.users.user_metadata
CREATE OR REPLACE FUNCTION public.sync_user_metadata()
RETURNS TRIGGER AS $$
BEGIN
  -- Atualizar user_metadata no auth.users quando user_profiles for alterado
  UPDATE auth.users 
  SET raw_user_meta_data = COALESCE(raw_user_meta_data, '{}'::jsonb) || jsonb_build_object(
    'full_name', NEW.full_name,
    'company', NEW.company,
    'phone', NEW.phone,
    'city', NEW.city,
    'state', NEW.state,
    'country', NEW.country,
    'avatar_url', NEW.avatar_url,
    'avatar_type', NEW.avatar_type,
    'gender', NEW.gender,
    'cargo', NEW.cargo,
    'empresa', NEW.empresa
  )
  WHERE id = NEW.user_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para executar a sincronização
DROP TRIGGER IF EXISTS trigger_sync_user_metadata ON public.user_profiles;
CREATE TRIGGER trigger_sync_user_metadata
  AFTER UPDATE ON public.user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_user_metadata();

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_user_login_history_user_id ON public.user_login_history(user_id);
CREATE INDEX IF NOT EXISTS idx_user_login_history_login_at ON public.user_login_history(login_at);
CREATE INDEX IF NOT EXISTS idx_user_analytics_enhanced_user_id ON public.user_analytics_enhanced(user_id);
CREATE INDEX IF NOT EXISTS idx_user_analytics_enhanced_created_at ON public.user_analytics_enhanced(created_at);
CREATE INDEX IF NOT EXISTS idx_user_payments_user_id ON public.user_payments(user_id);
