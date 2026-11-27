import type { Book } from './book'

/** The books' text, imported only by the book page, which only book builds include (see src/content/book.ts). */
export const BOOKS: Record<string, () => Promise<Book>> = {
  investing: () => import('./courses/investing/book').then((m) => m.book),
}
