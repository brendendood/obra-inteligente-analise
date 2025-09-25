-- Políticas RLS apenas para as novas tabelas (evitando conflitos)

-- Políticas para plans (somente leitura para todos usuários autenticados)
create policy "Anyone can view plans" 
  on public.plans for select 
  to authenticated 
  using (true);

-- Políticas para users (usuários podem ver e modificar apenas seus próprios dados)
create policy "Users can view their own user data" 
  on public.users for select 
  to authenticated 
  using (auth.uid() = id);

create policy "Users can update their own user data" 
  on public.users for update 
  to authenticated 
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "Users can insert their own user data" 
  on public.users for insert 
  to authenticated 
  with check (auth.uid() = id);

-- Políticas para credit_ledger (usuários podem ver apenas seus próprios registros)
create policy "Users can view their own credit ledger" 
  on public.credit_ledger for select 
  to authenticated 
  using (user_id = auth.uid());

create policy "Users can insert their own credit entries" 
  on public.credit_ledger for insert 
  to authenticated 
  with check (user_id = auth.uid());

-- Políticas para referrals (usuários podem ver referrals onde são referrer ou referred)
create policy "Users can view referrals as referrer" 
  on public.referrals for select 
  to authenticated 
  using (referrer_user_id = auth.uid());

create policy "Users can view referrals as referred" 
  on public.referrals for select 
  to authenticated 
  using (referred_user_id = auth.uid());

create policy "Users can create referrals as referrer" 
  on public.referrals for insert 
  to authenticated 
  with check (referrer_user_id = auth.uid());