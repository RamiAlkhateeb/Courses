import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Button, Icon } from '../../components/ui'
import { ASSETS, ASSET_IDS } from '../../domain/playground/config'
import { usePlayground } from '../../state/usePlayground'
import { assetName } from './shared'
import styles from './Playground.module.css'

/** Design 31: "Learn it, then unlock it": what the Playground offers now, and what each next lesson opens. */
export function UnlocksPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { unlocked, newsUnlocked } = usePlayground()
  const items = [
    ...[...ASSET_IDS].sort((a, b) => ASSETS[a].unlockAfterLessons - ASSETS[b].unlockAfterLessons).map((id) => ({
      key: id as string,
      name: assetName(t, id),
      blurb: t(`pg_asset_${id}_blurb`),
      open: unlocked.includes(id),
      when: t('pg_unlocks_after', { n: ASSETS[id].unlockAfterLessons }),
      done: t('pg_unlocked_lesson', { n: ASSETS[id].unlockAfterLessons }),
    })),
    { key: 'events', name: t('pg_market_events'), blurb: t('pg_market_events_blurb'), open: newsUnlocked, when: t('pg_unlocks_at_checkpoint'), done: t('pg_unlocked_checkpoint') },
  ]
  return (
    <div className={styles.pageFull}>
      <button type="button" className={styles.back} onClick={() => navigate(-1)} aria-label={t('back')}>
        <Icon name="back" size={26} />
      </button>
      <h1 className={styles.bigTitle}>{t('pg_unlock_title')}</h1>
      <p className={styles.sub}>{t('pg_unlock_sub')}</p>
      <ol className={styles.timeline}>
        {items.map((it) => (
          <li key={it.key} className={it.open ? '' : styles.tlLocked}>
            <span className={`${styles.tlNode} ${it.open ? styles.tlDone : ''}`}>
              <Icon name={it.open ? 'check' : 'lock'} size={20} />
            </span>
            <div className={styles.tlCard}>
              <strong>{it.name}</strong>
              <small>{it.blurb}</small>
              <span className={`${styles.badge} ${it.open ? styles.badgeOn : ''}`}>{it.open ? it.done : it.when}</span>
            </div>
          </li>
        ))}
      </ol>
      <div className={styles.foot}>
        <Button onClick={() => navigate(-1)}>{t('pg_back_to_playground')}</Button>
      </div>
    </div>
  )
}
