import type { Block, Localized } from './types'

// Course books: a longer, more advanced text of a course, read as a book (no characters, activities or questions),
// downloaded as a PDF by signed-in members. The text itself is loaded only by the book page (src/app/BookPage.tsx),
// which exists only in book builds (VITE_BOOK=1, scripts/book/build-pdf.mjs), so the deployed app never contains it.

export interface BookChapter {
  id: string
  title: Localized
  /** One or two sentences under the chapter title */
  summary: Localized
  /** The chapter's text: html (with <h2> section headings), tables, diagrams, boxes and formulas */
  blocks: Block[]
}

export interface Book {
  courseId: string
  title: Localized
  subtitle: Localized
  /** The book's first page: who it is for and how to read it */
  preface: Localized
  chapters: BookChapter[]
}

/** Courses whose book can be downloaded (the PDFs are in the private `books` storage bucket). */
export const BOOK_COURSE_IDS = ['investing']

/** The PDF of a course's book in one language, as stored in the `books` bucket. */
export const bookFile = (courseId: string, lang: 'en' | 'ar') => `${courseId}.${lang}.pdf`
