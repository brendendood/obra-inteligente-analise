-- Criar tipo enum para account_type
CREATE TYPE account_type AS ENUM ('trial', 'paid');

-- Criar tipo enum para account_status
CREATE TYPE account_status AS ENUM ('active', 'deactivated_permanently');

-- Criar tabela accounts
CREATE TABLE IF NOT EXISTS public.accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    account_type account_type NOT NULL DEFAULT 'trial',
    account_status account_status NOT NULL DEFAULT 'active',
    deactivated_at TIMESTAMP WITH TIME ZONE,
    stripe_customer_id TEXT,
    stripe_subscription_id TEXT,
    plan_price_id TEXT,
    plan_name TEXT,
    plan_renews_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.accounts ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
CREATE POLICY "Users can view own account"
    ON public.accounts FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update own account"
    ON public.accounts FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "System can insert accounts"
    ON public.accounts FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Admins can view all accounts"
    ON public.accounts FOR SELECT
    USING (is_admin_user());

-- Índices
CREATE INDEX idx_accounts_user_id ON public.accounts(user_id);
CREATE INDEX idx_accounts_stripe_customer_id ON public.accounts(stripe_customer_id);
CREATE INDEX idx_accounts_account_status ON public.accounts(account_status);

-- Trigger para updated_at
CREATE TRIGGER update_accounts_updated_at
    BEFORE UPDATE ON public.accounts
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Comentários
COMMENT ON TABLE public.accounts IS 'Armazena informações de conta e assinatura Stripe dos usuários';
COMMENT ON COLUMN public.accounts.account_type IS 'Tipo de conta: trial (teste grátis 7 dias) ou paid (assinatura ativa)';
COMMENT ON COLUMN public.accounts.account_status IS 'Status: active ou deactivated_permanently';
COMMENT ON COLUMN public.accounts.deactivated_at IS 'Data de desativação permanente da conta';