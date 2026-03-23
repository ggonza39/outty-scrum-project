-- Note: This file is currently stored in the repository for reference/documentation only.
-- The updated_at trigger is managed in Supabase, and any changes should be made there to ensure they are properly applied to the database.

create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_profiles_updated_at
before update on public.profiles
for each row
execute function public.handle_updated_at();