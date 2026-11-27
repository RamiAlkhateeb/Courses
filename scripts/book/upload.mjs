// Uploads a course's book PDFs (made by scripts/book/build-pdf.mjs) to the private `books` storage bucket:
//   SUPABASE_URL=… SUPABASE_SERVICE_ROLE_KEY=… node scripts/book/upload.mjs investing
// The service-role key bypasses row-level security, so it stays in this terminal: never in .env files the app reads,
// never in the frontend, never committed. The bucket and its read policy come from supabase/migrations/0004_books.sql.
import { existsSync, readFileSync } from 'node:fs'

const course = process.argv[2]
const url = (process.env.SUPABASE_URL ?? '').replace(/\/$/, '')
const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? ''
if (!course || !url || !key) {
  console.error('usage: SUPABASE_URL=… SUPABASE_SERVICE_ROLE_KEY=… node scripts/book/upload.mjs <course>')
  process.exit(1)
}
for (const lang of ['en', 'ar']) {
  const file = `${course}.${lang}.pdf`
  const path = `book-out/${file}`
  if (!existsSync(path)) {
    console.error(`missing ${path}: run node scripts/book/build-pdf.mjs ${course} first`)
    process.exit(1)
  }
  const res = await fetch(`${url}/storage/v1/object/books/${file}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, apikey: key, 'Content-Type': 'application/pdf', 'x-upsert': 'true' },
    body: readFileSync(path),
  })
  if (!res.ok) {
    console.error(`upload of ${file} failed: ${res.status} ${await res.text()}`)
    process.exit(1)
  }
  console.log(`uploaded ${file}`)
}
