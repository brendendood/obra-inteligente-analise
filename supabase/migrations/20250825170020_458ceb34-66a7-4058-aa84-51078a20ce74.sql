-- Criar tabela email_queue para sistema de retry
CREATE TABLE public.email_queue (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    template_type text NOT NULL,
    recipient_email text NOT NULL,
    payload jsonb NOT NULL DEFAULT '{}',
    status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed', 'cancelled')),
    retries integer NOT NULL DEFAULT 0,
    max_retries integer NOT NULL DEFAULT 3,
    last_attempt_at timestamp with time zone,
    next_retry_at timestamp with time zone,
    error_message text,
    resend_id text,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Índices para performance
CREATE INDEX idx_email_queue_status ON public.email_queue(status);
CREATE INDEX idx_email_queue_next_retry ON public.email_queue(next_retry_at) WHERE status = 'pending';
CREATE INDEX idx_email_queue_user_template ON public.email_queue(user_id, template_type);
CREATE INDEX idx_email_queue_created_at ON public.email_queue(created_at);

-- RLS policies
ALTER TABLE public.email_queue ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all email queue"
    ON public.email_queue FOR SELECT
    USING (public.is_admin_user());

CREATE POLICY "Users can view their own email queue"
    ON public.email_queue FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "System can manage email queue"
    ON public.email_queue FOR ALL
    USING (true);

-- Trigger para updated_at
CREATE TRIGGER update_email_queue_updated_at
    BEFORE UPDATE ON public.email_queue
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Função para calcular próximo retry com backoff exponencial
CREATE OR REPLACE FUNCTION public.calculate_next_retry_time(retry_count integer)
RETURNS timestamp with time zone
LANGUAGE plpgsql
IMMUTABLE
AS $function$
BEGIN
    -- Backoff exponencial: 1min, 5min, 15min
    CASE retry_count
        WHEN 0 THEN RETURN now() + INTERVAL '1 minute';
        WHEN 1 THEN RETURN now() + INTERVAL '5 minutes';
        WHEN 2 THEN RETURN now() + INTERVAL '15 minutes';
        ELSE RETURN now() + INTERVAL '1 hour'; -- fallback
    END CASE;
END;
$function$;

-- Função para enfileirar email
CREATE OR REPLACE FUNCTION public.enqueue_email(
    p_user_id uuid,
    p_template_type text,
    p_recipient_email text,
    p_payload jsonb DEFAULT '{}'::jsonb
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
DECLARE
    queue_id uuid;
BEGIN
    INSERT INTO public.email_queue (
        user_id,
        template_type,
        recipient_email,
        payload,
        status,
        next_retry_at
    ) VALUES (
        p_user_id,
        p_template_type,
        p_recipient_email,
        p_payload,
        'pending',
        now() -- enviar imediatamente
    ) RETURNING id INTO queue_id;
    
    RETURN queue_id;
END;
$function$;

-- Função para marcar email como enviado
CREATE OR REPLACE FUNCTION public.mark_email_sent(
    p_queue_id uuid,
    p_resend_id text DEFAULT NULL
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
BEGIN
    UPDATE public.email_queue
    SET 
        status = 'sent',
        resend_id = p_resend_id,
        last_attempt_at = now(),
        updated_at = now()
    WHERE id = p_queue_id;
    
    RETURN FOUND;
END;
$function$;

-- Função para marcar email como falha e reagendar
CREATE OR REPLACE FUNCTION public.mark_email_failed(
    p_queue_id uuid,
    p_error_message text
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
DECLARE
    current_retries integer;
    max_retries_limit integer;
BEGIN
    -- Buscar retry count atual
    SELECT retries, max_retries 
    INTO current_retries, max_retries_limit
    FROM public.email_queue 
    WHERE id = p_queue_id;
    
    IF NOT FOUND THEN
        RETURN false;
    END IF;
    
    -- Incrementar tentativas
    current_retries := current_retries + 1;
    
    -- Se excedeu limite, marcar como failed definitivamente
    IF current_retries >= max_retries_limit THEN
        UPDATE public.email_queue
        SET 
            status = 'failed',
            retries = current_retries,
            error_message = p_error_message,
            last_attempt_at = now(),
            next_retry_at = NULL,
            updated_at = now()
        WHERE id = p_queue_id;
    ELSE
        -- Reagendar com backoff
        UPDATE public.email_queue
        SET 
            status = 'pending',
            retries = current_retries,
            error_message = p_error_message,
            last_attempt_at = now(),
            next_retry_at = public.calculate_next_retry_time(current_retries),
            updated_at = now()
        WHERE id = p_queue_id;
    END IF;
    
    RETURN true;
END;
$function$;

-- Função para buscar emails pendentes para retry
CREATE OR REPLACE FUNCTION public.get_pending_emails_for_retry(batch_size integer DEFAULT 10)
RETURNS TABLE(
    queue_id uuid,
    user_id uuid,
    template_type text,
    recipient_email text,
    payload jsonb,
    retries integer
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
BEGIN
    RETURN QUERY
    SELECT 
        eq.id,
        eq.user_id,
        eq.template_type,
        eq.recipient_email,
        eq.payload,
        eq.retries
    FROM public.email_queue eq
    WHERE eq.status = 'pending'
      AND (eq.next_retry_at IS NULL OR eq.next_retry_at <= now())
      AND eq.retries < eq.max_retries
    ORDER BY eq.created_at ASC
    LIMIT batch_size
    FOR UPDATE SKIP LOCKED; -- Evitar race conditions
END;
$function$;