import { Navigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useLocalized } from '../../content/useLocalized'
import { AccountScreen } from './AccountScreen'
import { LEGAL, LEGAL_PAGES, type LegalPageId } from './legal'
import styles from './Account.module.css'

/** Terms of Use, Privacy Policy and Help (`/legal/:page`). The text is in legal.ts. */
export function LegalPage() {
  const { t } = useTranslation()
  const tc = useLocalized()
  const { page } = useParams<{ page: string }>()
  if (!LEGAL_PAGES.includes(page as LegalPageId)) return <Navigate to="/me" replace />
  const doc = LEGAL[page as LegalPageId]
  return (
    <AccountScreen title={tc(doc.title)}>
      {page !== 'help' && <span className={styles.draft}>{t('acc_legal_draft')}</span>}
      <div className={styles.prose}>
        {doc.sections.map((s, i) => (
          <section key={i}>
            <h2>{tc(s.h)}</h2>
            <p>{tc(s.p)}</p>
          </section>
        ))}
        {doc.link && (
          <p>
            <a className={styles.link} href={doc.link} target="_blank" rel="noopener noreferrer" dir="ltr">
              {doc.link}
            </a>
          </p>
        )}
      </div>
    </AccountScreen>
  )
}
