-- Fix Security Definer View issue by recreating the problematic view
-- and ensuring proper access control through existing functions

-- Drop the existing view
DROP VIEW IF EXISTS public.v_crm_client_stats;

-- The view was using auth.uid() which can cause security issues
-- Instead, we'll rely on the existing get_client_stats() function 
-- which already handles security properly through SECURITY DEFINER function
-- and RLS policies on the underlying tables

-- Note: The get_client_stats() function already exists and provides
-- the same functionality with proper security handling.
-- Applications should use that function instead of the view.