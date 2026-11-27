// Route `/book/:courseId?lang=en|ar`: a course's book, laid out for print. It exists only in book builds (VITE_BOOK=1,
// see src/app/router.tsx); scripts/book/build-pdf.mjs prints it to PDF. Lives in src/app because it is a build page,
// not a screen of the app. Always light, like the certificate and the share slides.
import { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import type { Book } from '../content/book'
import { BOOKS } from '../content/bookLoaders'
import { getCourse } from '../content/courses'
import { GLOSSARY } from '../content/glossary'
import { useLocalized } from '../content/useLocalized'
import { L } from '../content/helpers'
import { pinLanguage } from '../i18n'
import { Blocks } from '../components/content/Blocks'
import contentStyles from '../components/content/content.module.css'
import { safeHtml } from '../components/content/safeHtml'
import { Logo } from '../components/Logo'
import styles from './BookPage.module.css'

const TEXT = {
  contents: L('Contents', 'المحتويات'),
  chapter: L('Chapter', 'الفصل'),
  glossary: L('Glossary', 'المصطلحات'),
  notice: L('Important', 'تنبيه مهم'),
  brand: L('Zubda', 'زبدة'),
}

export function BookPage() {
  const { courseId = '' } = useParams()
  const [search] = useSearchParams()
  const lang = search.get('lang') === 'ar' ? 'ar' : 'en'
  const [book, setBook] = useState<Book | null | undefined>(undefined)
  const [langReady, setLangReady] = useState(false)
  useEffect(() => {
    void pinLanguage(lang).then(() => setLangReady(true))
  }, [lang])
  useEffect(() => {
    const load = BOOKS[courseId]
    if (!load) setBook(null)
    else void load().then(setBook)
  }, [courseId])
  if (book === null) return <p data-book-error="not-found">Not found</p>
  if (!book || !langReady) return null
  return <BookView book={book} />
}

function BookView({ book }: { book: Book }) {
  const t = useLocalized()
  const notice = getCourse(book.courseId)?.notice
  const [ready, setReady] = useState(false)
  // Ready to print once the fonts and pictures are in
  useEffect(() => {
    let live = true
    const imgs = [...document.querySelectorAll('img')]
    void Promise.all([document.fonts.ready, ...imgs.map((img) => img.decode().catch(() => undefined))]).then(() => live && setReady(true))
    return () => {
      live = false
    }
  }, [])
  const terms = [...GLOSSARY].sort((a, b) => t(a.term).localeCompare(t(b.term)))

  return (
    <div className={styles.book} data-theme="light" data-ready={ready || undefined}>
      <section className={styles.cover}>
        <Logo size={96} />
        <h1>{t(book.title)}</h1>
        <p className={styles.subtitle}>{t(book.subtitle)}</p>
        <p className={styles.brand}>{t(TEXT.brand)}</p>
        <p className={styles.edition}>{t(book.edition)}</p>
      </section>

      <section className={styles.front}>
        <div className={contentStyles.content} dangerouslySetInnerHTML={safeHtml(t(book.preface))} />
        <h2>{t(TEXT.contents)}</h2>
        <ol className={styles.toc}>
          {book.chapters.map((c) => (
            <li key={c.id}>
              <a href={`#${c.id}`}>{t(c.title)}</a>
            </li>
          ))}
          {book.appendix?.map((a) => (
            <li key={a.id} className={styles.tocExtra}>
              <a href={`#${a.id}`}>{t(a.title)}</a>
            </li>
          ))}
          <li className={styles.tocExtra}>
            <a href="#glossary">{t(TEXT.glossary)}</a>
          </li>
        </ol>
      </section>

      {book.chapters.map((c, i) => (
        <section key={c.id} id={c.id} className={styles.chapter}>
          <p className={styles.kicker}>{`${t(TEXT.chapter)} ${i + 1}`}</p>
          <h1>{t(c.title)}</h1>
          <p className={styles.summary}>{t(c.summary)}</p>
          <div className={`${contentStyles.content} ${styles.text}`}>
            <Blocks blocks={c.blocks} />
          </div>
        </section>
      ))}

      {book.appendix?.map((a) => (
        <section key={a.id} id={a.id} className={styles.chapter}>
          <h1>{t(a.title)}</h1>
          <div className={`${contentStyles.content} ${styles.text}`}>
            <Blocks blocks={a.blocks} />
          </div>
        </section>
      ))}

      <section id="glossary" className={styles.chapter}>
        <h1>{t(TEXT.glossary)}</h1>
        <dl className={styles.glossary}>
          {terms.map((g) => (
            <div key={g.id}>
              <dt>{t(g.term)}</dt>
              <dd>{t(g.def)}</dd>
            </div>
          ))}
        </dl>
      </section>

      {notice && (
        <section className={styles.back}>
          <h2>{t(TEXT.notice)}</h2>
          <p>{t(notice)}</p>
          <p className={styles.brand}>{t(TEXT.brand)}</p>
        </section>
      )}
    </div>
  )
}
