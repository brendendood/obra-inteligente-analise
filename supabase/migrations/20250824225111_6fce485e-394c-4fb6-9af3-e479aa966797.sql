-- Tabelas CRM (clientes e projetos) + views e RLS
-- Cria se não existir; adiciona colunas faltantes.

-- CLIENTES
create table if not exists public.crm_clients (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  email text,
  phone text,
  company text,
  status text not null default 'prospect', -- 'prospect' | 'active' | 'inactive'
  avatar text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- garantias de colunas (idempotente)
do $$
begin
  if not exists (select 1 from information_schema.columns where table_name = 'crm_clients' and column_name = 'owner_id') then
    alter table public.crm_clients add column owner_id uuid not null default auth.uid() references auth.users(id) on delete cascade;
  end if;
  if not exists (select 1 from information_schema.columns where table_name = 'crm_clients' and column_name = 'name') then
    alter table public.crm_clients add column name text not null;
  end if;
  if not exists (select 1 from information_schema.columns where table_name = 'crm_clients' and column_name = 'email') then
    alter table public.crm_clients add column email text;
  end if;
  if not exists (select 1 from information_schema.columns where table_name = 'crm_clients' and column_name = 'phone') then
    alter table public.crm_clients add column phone text;
  end if;
  if not exists (select 1 from information_schema.columns where table_name = 'crm_clients' and column_name = 'company') then
    alter table public.crm_clients add column company text;
  end if;
  if not exists (select 1 from information_schema.columns where table_name = 'crm_clients' and column_name = 'status') then
    alter table public.crm_clients add column status text not null default 'prospect';
  end if;
  if not exists (select 1 from information_schema.columns where table_name = 'crm_clients' and column_name = 'avatar') then
    alter table public.crm_clients add column avatar text;
  end if;
  if not exists (select 1 from information_schema.columns where table_name = 'crm_clients' and column_name = 'created_at') then
    alter table public.crm_clients add column created_at timestamptz not null default now();
  end if;
  if not exists (select 1 from information_schema.columns where table_name = 'crm_clients' and column_name = 'updated_at') then
    alter table public.crm_clients add column updated_at timestamptz not null default now();
  end if;
end$$;

create index if not exists idx_crm_clients_owner on public.crm_clients(owner_id);
create index if not exists idx_crm_clients_status on public.crm_clients(status);

-- PROJETOS
create table if not exists public.crm_projects (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  client_id uuid not null references public.crm_clients(id) on delete cascade,
  name text not null,
  value numeric(14,2) not null default 0,
  status text not null default 'planning', -- 'planning' | 'in-progress' | 'completed' | 'on-hold'
  start_date date not null,
  end_date date,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

do $$
begin
  if not exists (select 1 from information_schema.columns where table_name = 'crm_projects' and column_name = 'owner_id') then
    alter table public.crm_projects add column owner_id uuid not null default auth.uid() references auth.users(id) on delete cascade;
  end if;
  if not exists (select 1 from information_schema.columns where table_name = 'crm_projects' and column_name = 'client_id') then
    alter table public.crm_projects add column client_id uuid references public.crm_clients(id) on delete cascade;
  end if;
  if not exists (select 1 from information_schema.columns where table_name = 'crm_projects' and column_name = 'name') then
    alter table public.crm_projects add column name text not null;
  end if;
  if not exists (select 1 from information_schema.columns where table_name = 'crm_projects' and column_name = 'value') then
    alter table public.crm_projects add column value numeric(14,2) not null default 0;
  end if;
  if not exists (select 1 from information_schema.columns where table_name = 'crm_projects' and column_name = 'status') then
    alter table public.crm_projects add column status text not null default 'planning';
  end if;
  if not exists (select 1 from information_schema.columns where table_name = 'crm_projects' and column_name = 'start_date') then
    alter table public.crm_projects add column start_date date not null default now();
  end if;
  if not exists (select 1 from information_schema.columns where table_name = 'crm_projects' and column_name = 'end_date') then
    alter table public.crm_projects add column end_date date;
  end if;
  if not exists (select 1 from information_schema.columns where table_name = 'crm_projects' and column_name = 'description') then
    alter table public.crm_projects add column description text;
  end if;
  if not exists (select 1 from information_schema.columns where table_name = 'crm_projects' and column_name = 'created_at') then
    alter table public.crm_projects add column created_at timestamptz not null default now();
  end if;
  if not exists (select 1 from information_schema.columns where table_name = 'crm_projects' and column_name = 'updated_at') then
    alter table public.crm_projects add column updated_at timestamptz not null default now();
  end if;
end$$;

create index if not exists idx_crm_projects_owner on public.crm_projects(owner_id);
create index if not exists idx_crm_projects_client on public.crm_projects(client_id);
create index if not exists idx_crm_projects_status on public.crm_projects(status);

-- VIEW com estatísticas por cliente (projetosCount, totalValue)
create or replace view public.v_crm_client_stats as
select
  c.id as client_id,
  c.owner_id,
  count(p.id)::int as projects_count,
  coalesce(sum(p.value), 0)::numeric(14,2) as total_value
from public.crm_clients c
left join public.crm_projects p
  on p.client_id = c.id
group by c.id, c.owner_id;

-- RLS
alter table public.crm_clients enable row level security;
alter table public.crm_projects enable row level security;

-- Políticas: cada user só acessa seus registros
do $$
begin
  if not exists (
    select 1 from pg_policies where schemaname='public' and tablename='crm_clients' and policyname='crm_clients_select_own'
  ) then
    create policy crm_clients_select_own on public.crm_clients
      for select to authenticated
      using (owner_id = auth.uid());
  end if;

  if not exists (
    select 1 from pg_policies where schemaname='public' and tablename='crm_clients' and policyname='crm_clients_modify_own'
  ) then
    create policy crm_clients_modify_own on public.crm_clients
      for all to authenticated
      using (owner_id = auth.uid())
      with check (owner_id = auth.uid());
  end if;

  if not exists (
    select 1 from pg_policies where schemaname='public' and tablename='crm_projects' and policyname='crm_projects_select_own'
  ) then
    create policy crm_projects_select_own on public.crm_projects
      for select to authenticated
      using (owner_id = auth.uid());
  end if;

  if not exists (
    select 1 from pg_policies where schemaname='public' and tablename='crm_projects' and policyname='crm_projects_modify_own'
  ) then
    create policy crm_projects_modify_own on public.crm_projects
      for all to authenticated
      using (owner_id = auth.uid())
      with check (owner_id = auth.uid());
  end if;
end$$;

-- Trigger de updated_at
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end$$;

drop trigger if exists trg_clients_updated on public.crm_clients;
create trigger trg_clients_updated
before update on public.crm_clients
for each row execute function public.set_updated_at();

drop trigger if exists trg_projects_updated on public.crm_projects;
create trigger trg_projects_updated
before update on public.crm_projects
for each row execute function public.set_updated_at();