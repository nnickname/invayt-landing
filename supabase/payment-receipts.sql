-- Ejecutar una vez en el proyecto Supabase antes de habilitar la carga web.
-- La landing usa la service role key únicamente desde el servidor.

insert into storage.buckets (id, name, public)
values ('payment-receipts', 'payment-receipts', false)
on conflict (id) do update set public = false;

create table if not exists public.payment_receipts (
  id uuid primary key default gen_random_uuid(),
  match_id uuid not null references public.matches(id) on delete cascade,
  player_id uuid not null references public.players(id) on delete cascade,
  storage_path text not null,
  original_name text not null,
  content_type text not null,
  file_size integer not null check (file_size > 0),
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (match_id, player_id)
);

alter table public.payment_receipts enable row level security;

-- Datos que se muestran en el checkout web de transferencia.
alter table public.clubs
  add column if not exists transfer_cbu text,
  add column if not exists transfer_alias text;

comment on column public.clubs.transfer_cbu is 'CBU que el club publica para recibir transferencias.';
comment on column public.clubs.transfer_alias is 'Alias bancario que el club publica para recibir transferencias.';