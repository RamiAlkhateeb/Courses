-- Abu Shreek: preferences (sound, language) follow the account too, as a fourth row per learner ("settings").
-- Run once in the Supabase dashboard: SQL Editor -> New query -> paste -> Run. Safe to run twice.
-- Until it runs, the app keeps working: it sends preferences on their own and ignores a refusal.

alter table public.user_state drop constraint if exists user_state_key_check;
alter table public.user_state add constraint user_state_key_check check (key in ('progress', 'profile', 'playground', 'settings'));
