-- Harden RLS policies to prevent client-side privilege escalation and unsafe inserts/updates

-- user_gamification: remove permissive system policies and restrict admin to SELECT only
ALTER TABLE public.user_gamification ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "System can insert gamification data" ON public.user_gamification;
DROP POLICY IF EXISTS "System can update gamification data" ON public.user_gamification;
DROP POLICY IF EXISTS "Admins can view all gamification data" ON public.user_gamification;
CREATE POLICY "Admins can view all gamification data"
ON public.user_gamification
FOR SELECT
USING (is_admin_user());

-- Keep existing policy: Users can view own gamification data (unchanged)

-- gamification_logs: drop permissive system insert and restrict admin to SELECT only
ALTER TABLE public.gamification_logs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "System can insert gamification logs" ON public.gamification_logs;
DROP POLICY IF EXISTS "Admins can view all gamification logs" ON public.gamification_logs;
CREATE POLICY "Admins can view all gamification logs"
ON public.gamification_logs
FOR SELECT
USING (is_admin_user());

-- Keep existing policy: Users can view own gamification logs (unchanged)

-- chat_access_logs: replace system insert with user-scoped insert; restrict admin to SELECT only
ALTER TABLE public.chat_access_logs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admins can view all access logs" ON public.chat_access_logs;
CREATE POLICY "Admins can view all access logs"
ON public.chat_access_logs
FOR SELECT
USING (is_admin_user());

DROP POLICY IF EXISTS "System can insert access logs" ON public.chat_access_logs;
CREATE POLICY "Users can insert their own access logs"
ON public.chat_access_logs
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Keep existing policy: Users can view their own access logs (unchanged)

-- user_login_history: remove unsafe system update and user insert; rely on server-side triggers/service role
ALTER TABLE public.user_login_history ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "System can update login location" ON public.user_login_history;
DROP POLICY IF EXISTS "Users can insert own login history" ON public.user_login_history;