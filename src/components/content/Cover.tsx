import { useTranslation } from 'react-i18next'
import type { Module } from '../../content/types'
import { useLocalized } from '../../content/useLocalized'
import styles from './content.module.css'

export function Cover({ mod }: { mod: Module }) {
  const t = useLocalized()
  const { t: tUi } = useTranslation()

  return (
    <header className={styles.cover}>
      <div className={styles.kicker}>{t(mod.cover.kicker)}</div>
      <div dangerouslySetInnerHTML={{ __html: t(mod.cover.titleHtml) }} />
      <div className={styles.coverTools}>
        <button type="button" className={styles.toolBtn} onClick={() => window.print()}>
          {tUi('saveAsPdf')}
        </button>
        <span className={styles.totalTime}>⏱ {t(mod.cover.timeEstimate)}</span>
      </div>
    </header>
  )
}
