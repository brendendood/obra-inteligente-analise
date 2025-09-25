-- Criação de tabelas base para planos, usuários, projetos, ledger e referrals.

create table if not exists public.plans (
  id uuid primary key default gen_random_uuid(),
  code text unique not null check (code in ('BASIC','PRO','ENTERPRISE')),
  base_quota int null, -- null = ilimitado
  created_at timestamptz not null default now()
);

create table if not exists public.users (
  id uuid primary key,
  plan_id uuid not null references public.plans(id) on update cascade,
  lifetime_base_consumed int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  deleted_at timestamptz null
);

create table if not exists public.credit_ledger (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  project_id uuid null references public.projects(id) on delete set null,
  type text not null check (type in ('BASE','BONUS_MONTHLY')),
  period_key text not null, -- 'YYYY-MM'
  created_at timestamptz not null default now()
);

create index if not exists idx_credit_ledger_user_period_type
  on public.credit_ledger(user_id, period_key, type);

create table if not exists public.referrals (
  id uuid primary key default gen_random_uuid(),
  referrer_user_id uuid not null references public.users(id) on delete cascade,
  referred_user_id uuid null references public.users(id) on delete set null,
  status text not null check (status in ('PENDING','QUALIFIED','APPROVED')),
  qualified_at timestamptz null,
  period_key text not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_referrals_referrer_period_status
  on public.referrals(referrer_user_id, period_key, status);

-- Segurança mínima (ajuste conforme sua política RLS)
alter table public.plans enable row level security;
alter table public.users enable row level security;
alter table public.projects enable row level security;
alter table public.credit_ledger enable row level security;
alter table public.referrals enable row level security;