-- Removes the old BA2 course app's tables from this project. Abu Shreek does not use any of them: it only uses
-- public.user_state (0001). Auth users are NOT touched.
--
-- READ BEFORE RUNNING
--  1. Back up first if any of it might matter: Dashboard -> Database -> Backups, or run in the SQL editor
--       select count(*) from public.profiles;            select count(*) from public.quiz_sessions;
--       select count(*) from public.question_attempts;   select count(*) from public.week_progress;
--       select count(*) from public.bookmarks;           select count(*) from public.homework_submissions;
--     and export what you want to keep (Table Editor -> table -> Export to CSV).
--  2. Only run it if the BA2 app no longer uses this project. Dropping these tables breaks it for good.
--  3. This is why it matters for Abu Shreek: an old signup trigger (handle_new_user) writes a row into
--     public.profiles for every new user. If profiles were dropped and the trigger kept, EVERY sign-up would fail.
--     And the old tables reference auth.users without "on delete cascade", so "Delete my account" would fail for
--     anyone who has rows in them. Removing them all, trigger included, fixes both.
--  4. Data safety latch: if the tables hold learner data, the script stops unless you uncomment the line below.
--
-- Run it in the SQL editor. It is one transaction: either everything is removed or nothing is.

begin;

-- >>> Uncomment the next line ONLY after you have backed up or decided the old data can go. <<<
-- set local app.confirm_delete_ba2_data = 'yes';

do $$
declare
  n bigint := 0;
  t text;
begin
  foreach t in array array['quiz_sessions', 'question_attempts', 'week_progress', 'bookmarks', 'homework_submissions'] loop
    if to_regclass('public.' || t) is not null then
      execute format('select count(*) from public.%I', t) into n;
      if n > 0 and coalesce(current_setting('app.confirm_delete_ba2_data', true), '') <> 'yes' then
        raise exception 'public.% has % rows. Back them up, then uncomment the "set local app.confirm_delete_ba2_data" line.', t, n;
      end if;
    end if;
  end loop;
end $$;

-- Functions and the sign-up trigger first (cascade also removes the trigger that calls handle_new_user on auth.users).
drop function if exists public.handle_new_user() cascade;
drop function if exists public.mark_section_read(text, text) cascade;
drop function if exists public.submit_homework(text, text, text) cascade;
drop function if exists public.submit_homework(text, text) cascade;
drop function if exists public.review_submission(uuid, text, text) cascade;
drop function if exists public.is_admin() cascade;

-- Then the tables (cascade drops their policies, indexes and foreign keys).
drop table if exists public.homework_submissions cascade;
drop table if exists public.homework_deadlines cascade;
drop table if exists public.question_attempts cascade;
drop table if exists public.quiz_sessions cascade;
drop table if exists public.week_progress cascade;
drop table if exists public.bookmarks cascade;
drop table if exists public.profiles cascade;

commit;

-- Afterwards, in the SQL editor, this should list only user_state (and any table you added yourself):
--   select table_name from information_schema.tables where table_schema = 'public';
-- and this should list no trigger on auth.users that you do not recognise:
--   select tgname from pg_trigger where tgrelid = 'auth.users'::regclass and not tgisinternal;
-- Old BA2 learners still exist in Authentication -> Users and can sign in to Abu Shreek with their old password.
-- Delete them there if you want a clean start.
