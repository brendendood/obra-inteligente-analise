-- Atualizar usuário sem plano para ter plano Basic
UPDATE public.users 
SET plan_code = 'BASIC' 
WHERE id = '5630ff34-ae1a-4bdc-84de-192fbf30eae2';