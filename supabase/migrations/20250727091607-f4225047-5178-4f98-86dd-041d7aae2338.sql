-- Criar tabela para logs de emails enviados
CREATE TABLE public.email_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email_type TEXT NOT NULL,
  recipient_email TEXT NOT NULL,
  subject TEXT NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'sent',
  template_version TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.email_logs ENABLE ROW LEVEL SECURITY;

-- RLS policies para email_logs
CREATE POLICY "Users can view their own email logs" 
ON public.email_logs 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "System can insert email logs" 
ON public.email_logs 
FOR INSERT 
WITH CHECK (true);

-- Índices para performance
CREATE INDEX idx_email_logs_user_id ON public.email_logs(user_id);
CREATE INDEX idx_email_logs_email_type ON public.email_logs(email_type);
CREATE INDEX idx_email_logs_sent_at ON public.email_logs(sent_at);

-- Função para trigger de gamificação
CREATE OR REPLACE FUNCTION public.trigger_project_completion_email()
RETURNS TRIGGER AS $$
DECLARE
    project_count INTEGER;
    user_email TEXT;
BEGIN
    -- Contar projetos concluídos do usuário
    SELECT COUNT(*) INTO project_count
    FROM public.projects 
    WHERE user_id = NEW.user_id 
    AND status = 'completed';
    
    -- Se chegou a 10 projetos concluídos
    IF project_count = 10 THEN
        -- Buscar email do usuário
        SELECT email INTO user_email
        FROM auth.users 
        WHERE id = NEW.user_id;
        
        -- Disparar notificação para envio de email
        PERFORM pg_notify('project_milestone_reached', json_build_object(
            'user_id', NEW.user_id,
            'email', user_email,
            'milestone_type', '10_projects_completed',
            'project_count', project_count
        )::text);
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;