import { bookFile } from '../content/book'
import { loadSupabase } from './supabase'

export type BookDownload = 'ok' | 'missing' | 'error'

/** Downloads a course's book for a signed-in member: a short-lived signed link to the PDF in the private `books`
 *  bucket (supabase/migrations/0004_books.sql), opened as a download. Guests never get here (the button asks them to
 *  sign up), and storage refuses anyone who is not signed in. */
export async function downloadBook(courseId: string, lang: 'en' | 'ar', fileName: string): Promise<BookDownload> {
  try {
    const sb = await loadSupabase()
    const { data, error } = await sb.storage.from('books').createSignedUrl(bookFile(courseId, lang), 120, { download: fileName })
    if (error || !data?.signedUrl) return /not.?found/i.test(error?.message ?? '') ? 'missing' : 'error'
    location.assign(data.signedUrl)
    return 'ok'
  } catch {
    return 'error'
  }
}
