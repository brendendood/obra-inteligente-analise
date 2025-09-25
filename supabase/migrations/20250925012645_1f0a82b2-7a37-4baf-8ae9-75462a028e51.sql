-- Upsert dos planos básicos
insert into public.plans (id, code, base_quota)
values
  (gen_random_uuid(), 'BASIC', 7),
  (gen_random_uuid(), 'PRO', 20),
  (gen_random_uuid(), 'ENTERPRISE', null)
on conflict (code) do update set
  base_quota = excluded.base_quota;