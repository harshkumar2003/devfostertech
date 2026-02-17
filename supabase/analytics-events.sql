-- Run in Supabase SQL editor.
-- Creates lightweight analytics event store for blog interactions.

create table if not exists public.analytics_events (
  id bigserial primary key,
  event_name text not null,
  slug text,
  title text,
  page_path text,
  source text default 'web',
  meta jsonb default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists analytics_events_created_at_idx on public.analytics_events (created_at desc);
create index if not exists analytics_events_event_name_idx on public.analytics_events (event_name);
create index if not exists analytics_events_slug_idx on public.analytics_events (slug);

alter table if exists public.analytics_events enable row level security;

drop policy if exists "Allow public analytics inserts" on public.analytics_events;
create policy "Allow public analytics inserts"
on public.analytics_events
for insert
to anon, authenticated
with check (event_name <> '');

drop policy if exists "Allow admin analytics reads" on public.analytics_events;
create policy "Allow admin analytics reads"
on public.analytics_events
for select
to authenticated
using (
  exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.role = 'admin'
  )
);
