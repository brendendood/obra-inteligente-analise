
-- CRITICAL SECURITY FIX: Enable RLS on n8n_chat_histories table
-- This table currently has NO row-level security, exposing all chat history

-- Enable Row Level Security on the chat histories table
ALTER TABLE public.n8n_chat_histories ENABLE ROW LEVEL SECURITY;

-- Add user_id column to link chat messages to users (if not already present)
ALTER TABLE public.n8n_chat_histories 
ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id);

-- Create RLS policy to ensure users can only access their own chat history
CREATE POLICY "Users can only view their own chat history" 
ON public.n8n_chat_histories 
FOR SELECT 
USING (auth.uid() = user_id);

-- Allow users to insert their own chat messages
CREATE POLICY "Users can insert their own chat messages" 
ON public.n8n_chat_histories 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own chat messages (for editing/rating)
CREATE POLICY "Users can update their own chat messages" 
ON public.n8n_chat_histories 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Allow users to delete their own chat messages
CREATE POLICY "Users can delete their own chat messages" 
ON public.n8n_chat_histories 
FOR DELETE 
USING (auth.uid() = user_id);

-- SECURITY HARDENING: Update database functions to use secure search_path
-- This prevents potential SQL injection through search path manipulation

-- Update is_superuser function
CREATE OR REPLACE FUNCTION public.is_superuser()
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO ''
AS $function$
  -- Verificar se é superuser do PostgreSQL OU tem permissão super_admin
  SELECT EXISTS (
    SELECT 1 FROM pg_roles 
    WHERE rolname = current_user AND rolsuper = true
  ) OR EXISTS (
    SELECT 1 FROM public.admin_permissions 
    WHERE user_id = auth.uid() 
    AND active = true 
    AND role = 'super_admin'
  );
$function$;

-- Update is_admin_user function
CREATE OR REPLACE FUNCTION public.is_admin_user()
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO ''
AS $function$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_permissions 
    WHERE user_id = auth.uid() 
    AND active = true 
    AND role = 'super_admin'
  ) OR public.is_superuser();
$function$;

-- Update get_total_users_count function
CREATE OR REPLACE FUNCTION public.get_total_users_count()
RETURNS bigint
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO ''
AS $function$
  SELECT COUNT(*) FROM auth.users;
$function$;

-- Update example_function
CREATE OR REPLACE FUNCTION public.example_function()
RETURNS TABLE(user_id bigint, username text, created_at timestamp with time zone)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
BEGIN
    RETURN QUERY
    SELECT 
        id, 
        name, 
        created_at 
    FROM public.users;
END;
$function$;

-- Update get_user_engagement function
CREATE OR REPLACE FUNCTION public.get_user_engagement()
RETURNS TABLE(user_id uuid, engagement_score numeric)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
BEGIN
    RETURN QUERY 
    SELECT 
        auth.uid() AS user_id, 
        public.calculate_user_engagement(auth.uid()) AS engagement_score;
END;
$function$;

-- Add audit logging for chat history access
CREATE TABLE IF NOT EXISTS public.chat_access_logs (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id),
    session_id text NOT NULL,
    access_type text NOT NULL, -- 'read', 'write', 'delete'
    ip_address inet,
    user_agent text,
    created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on audit logs
ALTER TABLE public.chat_access_logs ENABLE ROW LEVEL SECURITY;

-- Allow users to view their own access logs
CREATE POLICY "Users can view their own access logs" 
ON public.chat_access_logs 
FOR SELECT 
USING (auth.uid() = user_id);

-- Allow system to insert access logs
CREATE POLICY "System can insert access logs" 
ON public.chat_access_logs 
FOR INSERT 
WITH CHECK (true);

-- Admins can view all access logs
CREATE POLICY "Admins can view all access logs" 
ON public.chat_access_logs 
FOR ALL 
USING (public.is_admin_user());
