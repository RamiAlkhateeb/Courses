-- Zubda: course books (PDFs) for signed-in members. A private storage bucket: any signed-in learner may read it,
-- and nobody can write to it from the app (scripts/book/upload.mjs uploads with the service-role key, on the
-- owner's machine only). The app asks for a short-lived signed link when a member taps "Download the book".
-- Run once in the Supabase dashboard: SQL Editor -> New query -> paste -> Run. Safe to run twice.

insert into storage.buckets (id, name, public)
values ('books', 'books', false)
on conflict (id) do update set public = false;

drop policy if exists "Signed-in members read the books" on storage.objects;
create policy "Signed-in members read the books"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'books');
