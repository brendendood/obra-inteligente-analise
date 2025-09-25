-- Migration to set up cron job for normalize-referrals
-- This should be run after the edge function is deployed

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Schedule the normalize-referrals function to run daily at 2 AM UTC
SELECT cron.schedule(
  'normalize-referrals-daily',
  '0 2 * * *', -- Daily at 2 AM UTC
  $$
  SELECT
    net.http_post(
        url:='https://mozqijzvtbuwuzgemzsm.supabase.co/functions/v1/normalize-referrals',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1venFpanp2dGJ1d3V6Z2VtenNtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1NTI2NTcsImV4cCI6MjA2NjEyODY1N30.03WIeunsXuTENSrXfsFjCYy7jehJVYaWK2Nt00Fx8sA"}'::jsonb,
        body:=concat('{"time": "', now(), '"}')::jsonb
    ) as request_id;
  $$
);

-- View existing cron jobs
-- SELECT * FROM cron.job;

-- To remove the job if needed (uncomment to use):
-- SELECT cron.unschedule('normalize-referrals-daily');