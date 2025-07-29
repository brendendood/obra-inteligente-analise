-- Adicionar campos ausentes na tabela projects
ALTER TABLE public.projects 
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS start_date DATE,
ADD COLUMN IF NOT EXISTS end_date DATE;

-- Padronizar valores de status existentes
UPDATE public.projects 
SET project_status = 'active' 
WHERE project_status = 'em_andamento';

UPDATE public.projects 
SET project_status = 'completed' 
WHERE project_status = 'concluido';

UPDATE public.projects 
SET project_status = 'archived' 
WHERE project_status = 'arquivado';

-- Comentário: Adicionando campos necessários e padronizando status para sincronização completa