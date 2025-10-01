-- Migration to set up cron job for deactivating expired trials
-- This should be run after the edge function is deployed
-- Requires pg_cron extension (available in Supabase)

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Schedule the deactivate_expired_trials function to run daily at 2 AM UTC
SELECT cron.schedule(
  'deactivate-expired-trials',
  '0 2 * * *', -- Daily at 2 AM UTC
  $$SELECT public.deactivate_expired_trials();$$
);

-- View existing cron jobs
-- SELECT * FROM cron.job;

-- To remove the job if needed (uncomment to use):
-- SELECT cron.unschedule('deactivate-expired-trials');
