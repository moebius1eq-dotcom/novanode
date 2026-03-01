-- NoVaNode community tables

create table if not exists public.speed_submissions (
  id bigserial primary key,
  spot_id text not null,
  spot_slug text not null,
  spot_name text not null,
  neighborhood text not null,
  latency_ms numeric not null,
  download_mbps numeric not null,
  upload_mbps numeric not null,
  created_at timestamptz not null default now()
);

create table if not exists public.seat_reports (
  id bigserial primary key,
  spot_id text not null,
  state text not null check (state in ('plenty','busy','full')),
  created_at timestamptz not null default now()
);

create table if not exists public.work_buddy_signals (
  id bigserial primary key,
  spot_id text not null,
  until_at timestamptz not null,
  created_at timestamptz not null default now()
);

create table if not exists public.vibe_photos (
  id bigserial primary key,
  spot_id text not null,
  url text not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_speed_spot_created on public.speed_submissions (spot_id, created_at desc);
create index if not exists idx_seat_spot_created on public.seat_reports (spot_id, created_at desc);
create index if not exists idx_buddy_spot_until on public.work_buddy_signals (spot_id, until_at desc);
create index if not exists idx_vibe_spot_created on public.vibe_photos (spot_id, created_at desc);
