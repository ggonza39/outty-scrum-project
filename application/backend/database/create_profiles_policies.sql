-- Note: This file is currently stored in the repository for reference/documentation only.
-- The profile policies are stored and managed in Supabase, and any changes should be made there to ensure they are properly applied to the database.

create policy "Users can view own profile"
on public.profiles
for select
to authenticated
using (auth.uid() = id);

create policy "Users can insert own profile"
on public.profiles
for insert
to authenticated
with check (auth.uid() = id);

create policy "Users can update own profile"
on public.profiles
for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

create policy "Users can delete own profile"
on public.profiles
for delete
to authenticated
using (auth.uid() = id);