-- Adicionar coluna de notas na tabela projects
ALTER TABLE public.projects 
ADD COLUMN IF NOT EXISTS notes TEXT;