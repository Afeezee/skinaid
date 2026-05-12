create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  email text not null,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.skin_checks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  image_url text not null,
  result jsonb not null,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists skin_checks_user_id_created_at_idx
  on public.skin_checks (user_id, created_at desc);

alter table public.profiles enable row level security;
alter table public.skin_checks enable row level security;

drop policy if exists "Users can view their own profile" on public.profiles;
create policy "Users can view their own profile"
  on public.profiles
  for select
  using (auth.uid() = id);

drop policy if exists "Users can insert their own profile" on public.profiles;
create policy "Users can insert their own profile"
  on public.profiles
  for insert
  with check (auth.uid() = id);

drop policy if exists "Users can update their own profile" on public.profiles;
create policy "Users can update their own profile"
  on public.profiles
  for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

drop policy if exists "Users can view their own skin checks" on public.skin_checks;
create policy "Users can view their own skin checks"
  on public.skin_checks
  for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert their own skin checks" on public.skin_checks;
create policy "Users can insert their own skin checks"
  on public.skin_checks
  for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can delete their own skin checks" on public.skin_checks;
create policy "Users can delete their own skin checks"
  on public.skin_checks
  for delete
  using (auth.uid() = user_id);

insert into storage.buckets (id, name, public)
values ('skin-images', 'skin-images', true)
on conflict (id) do update set public = excluded.public;

drop policy if exists "Public can view skin images" on storage.objects;
create policy "Public can view skin images"
  on storage.objects
  for select
  using (bucket_id = 'skin-images');

drop policy if exists "Users can upload their own skin images" on storage.objects;
create policy "Users can upload their own skin images"
  on storage.objects
  for insert
  with check (
    bucket_id = 'skin-images'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

drop policy if exists "Users can delete their own skin images" on storage.objects;
create policy "Users can delete their own skin images"
  on storage.objects
  for delete
  using (
    bucket_id = 'skin-images'
    and auth.uid()::text = (storage.foldername(name))[1]
  );