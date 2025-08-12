-- Fix: Views running with definer privileges can bypass RLS. Use security_invoker so views respect the querying user's RLS and permissions.
-- Applies to all views in the public schema (e.g., v_project_summary)
DO $$
DECLARE r record;
BEGIN
  FOR r IN
    SELECT schemaname, viewname
    FROM pg_views
    WHERE schemaname = 'public'
  LOOP
    EXECUTE format('ALTER VIEW %I.%I SET (security_invoker = on);', r.schemaname, r.viewname);
  END LOOP;
END $$;