-- 1. Adicionar políticas RLS para user_login_history
DROP POLICY IF EXISTS "System can insert login history" ON public.user_login_history;
DROP POLICY IF EXISTS "Users can update own login location" ON public.user_login_history;

-- Permitir que usuários autenticados insiram seus próprios logins
CREATE POLICY "Users can insert own login history" ON public.user_login_history
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Permitir que o sistema atualize localização
CREATE POLICY "System can update login location" ON public.user_login_history
FOR UPDATE USING (true);

-- 2. Recriar o trigger no schema auth (se não existir)
DROP TRIGGER IF EXISTS on_auth_user_login ON auth.audit_log_entries;

CREATE OR REPLACE TRIGGER on_auth_user_login
    AFTER INSERT ON auth.audit_log_entries
    FOR EACH ROW
    WHEN (NEW.payload ->> 'action' = 'login')
    EXECUTE FUNCTION public.handle_user_login();

-- 3. Testar se o sistema está funcionando
SELECT public.test_login_system();