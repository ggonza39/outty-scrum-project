-- Note: This file is currently stored in the repo for reference/documentation only.
-- The profiles table was created manually in the Supabase SQL Editor, and any changes should be made there to ensure they are properly applied to the database.

create table public.profiles (
  id uuid not null references auth.users(id) on delete cascade,
  display_name text,
  bio text,
  interests text[] default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  primary key (id)
);

alter table public.profiles enable row level security;