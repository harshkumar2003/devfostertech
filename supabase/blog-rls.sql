-- Run in Supabase SQL editor.
-- Purpose: lock blog management to admins while allowing public reads.

alter table if exists public.posts enable row level security;

drop policy if exists "Public can read posts" on public.posts;
create policy "Public can read posts"
on public.posts
for select
to anon, authenticated
using (true);

drop policy if exists "Admin can insert posts" on public.posts;
create policy "Admin can insert posts"
on public.posts
for insert
to authenticated
with check (
  exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.role = 'admin'
  )
);

drop policy if exists "Admin can update posts" on public.posts;
create policy "Admin can update posts"
on public.posts
for update
to authenticated
using (
  exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.role = 'admin'
  )
)
with check (
  exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.role = 'admin'
  )
);

drop policy if exists "Admin can delete posts" on public.posts;
create policy "Admin can delete posts"
on public.posts
for delete
to authenticated
using (
  exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.role = 'admin'
  )
);
