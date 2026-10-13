-- Abu Shreek: optional accounts. One row per signed-in learner per saved store ("progress", "profile",
-- "playground"), holding that store's JSON exactly as the app keeps it in localStorage. The app merges on sign-in
-- (see src/domain/sync.ts), so the server only has to keep the latest copy and say whose it is.
--
-- Run once in the Supabase dashboard: SQL Editor -> New query -> paste -> Run.
-- Safe to run twice (everything is "if not exists" / "or replace").

create table if not exists public.user_state (
  user_id uuid not null references auth.users (id) on delete cascade default auth.uid(),
  key text not null check (key in ('progress', 'profile', 'playground')),
  data jsonb not null check (jsonb_typeof(data) = 'object' and pg_column_size(data) < 400000),
  updated_at timestamptz not null default now(),
  primary key (user_id, key)
);

alter table public.user_state enable row level security;

-- A learner can read, write and delete only their own rows. There is no policy for anyone else, and none for the
-- anon role: signed-out visitors can touch nothing.
drop policy if exists "own state: select" on public.user_state;
drop policy if exists "own state: insert" on public.user_state;
drop policy if exists "own state: update" on public.user_state;
drop policy if exists "own state: delete" on public.user_state;
create policy "own state: select" on public.user_state for select to authenticated using (auth.uid() = user_id);
create policy "own state: insert" on public.user_state for insert to authenticated with check (auth.uid() = user_id);
create policy "own state: update" on public.user_state for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own state: delete" on public.user_state for delete to authenticated using (auth.uid() = user_id);

-- updated_at is the server's clock, never the client's: the app uses it to decide which copy of the wallet is newer.
create or replace function public.touch_user_state() returns trigger
language plpgsql security invoker set search_path = '' as $$
begin
  new.updated_at := now();
  new.user_id := old.user_id; -- an update can never move a row to someone else
  new.key := old.key;
  return new;
end;
$$;

drop trigger if exists user_state_touch on public.user_state;
create trigger user_state_touch before update on public.user_state
  for each row execute function public.touch_user_state();

-- "Delete my account": removes the auth user; the rows above go with it (on delete cascade). The only security
-- definer function here, and it can only ever act on the caller's own id.
create or replace function public.delete_my_account() returns void
language plpgsql security definer set search_path = '' as $$
begin
  if auth.uid() is null then
    raise exception 'not signed in';
  end if;
  delete from auth.users where id = auth.uid();
end;
$$;

revoke all on function public.delete_my_account() from public, anon;
grant execute on function public.delete_my_account() to authenticated;
