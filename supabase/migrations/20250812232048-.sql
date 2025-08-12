-- Harden RLS on user_referrals to prevent public data exposure
-- 1) Ensure RLS enabled
ALTER TABLE public.user_referrals ENABLE ROW LEVEL SECURITY;

-- 2) Drop overly permissive/public policies if they exist
DROP POLICY IF EXISTS "System can manage referrals" ON public.user_referrals;
DROP POLICY IF EXISTS "public_read_user_referrals" ON public.user_referrals;
DROP POLICY IF EXISTS "public_manage_user_referrals" ON public.user_referrals;
DROP POLICY IF EXISTS "Anyone can view referrals" ON public.user_referrals;

-- 3) Admin policies: full manage for admins/superusers
CREATE POLICY "Admins can manage referrals"
ON public.user_referrals
AS PERMISSIVE
FOR ALL
TO authenticated
USING (public.is_admin_user() OR public.is_superuser())
WITH CHECK (public.is_admin_user() OR public.is_superuser());

-- 4) Users can view their own referral relationships (either side)
CREATE POLICY "Users can view own referrals"
ON public.user_referrals
AS PERMISSIVE
FOR SELECT
TO authenticated
USING ((auth.uid() = referrer_user_id) OR (auth.uid() = referred_user_id));

-- 5) Users can insert referrals only when they are involved (keeps signup trigger working too)
CREATE POLICY "Users can insert own referrals"
ON public.user_referrals
AS PERMISSIVE
FOR INSERT
TO authenticated
WITH CHECK ((auth.uid() = referrer_user_id) OR (auth.uid() = referred_user_id));

-- 6) Restrict updates/deletes to admins only (covered by policy #3)
-- No additional policies for UPDATE/DELETE for regular users

-- Note: Existing SECURITY DEFINER triggers/functions (e.g., handle_new_user_profile, fix_existing_referrals)
-- will continue to operate as intended.
