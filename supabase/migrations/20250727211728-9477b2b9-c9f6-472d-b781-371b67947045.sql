-- Criar o trigger faltando para executar handle_new_user_profile após inserção de usuário
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW 
  EXECUTE FUNCTION public.handle_new_user_profile();