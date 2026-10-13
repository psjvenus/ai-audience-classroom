-- Run in Supabase SQL Editor. All access is through authenticated Next.js server routes.
create extension if not exists pgcrypto;
create table if not exists public.class_sessions (
 id uuid primary key default gen_random_uuid(),
 title text not null check (char_length(title) between 1 and 100),
 join_code text not null unique,
 created_at timestamptz not null default now()
);
create table if not exists public.class_groups (
 id uuid primary key default gen_random_uuid(),
 session_id uuid not null references public.class_sessions(id) on delete cascade,
 group_number integer not null check (group_number between 1 and 30),
 join_pin text not null,
 stage integer not null default 1 check (stage between 1 and 5),
 worksheet jsonb not null default '{}'::jsonb,
 messages jsonb not null default '[]'::jsonb,
 leave_count integer not null default 0,
 last_seen timestamptz,
 updated_at timestamptz not null default now(),
 unique(session_id, group_number)
);
create index if not exists class_groups_session_idx on public.class_groups(session_id);
alter table public.class_sessions enable row level security;
alter table public.class_groups enable row level security;
-- No anon/authenticated RLS policies. Never expose the service role key in browser code.
