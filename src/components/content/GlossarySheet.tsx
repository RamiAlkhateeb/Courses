import { useTranslation } from 'react-i18next'
import { useLocalized } from '../../content/useLocalized'
import { glossaryTerm } from '../../domain/glossary'
import { Sheet } from '../SettingsList'
import { Button } from '../ui'
import styles from './content.module.css'

/** A glossary term's one-line definition, in a small sheet over the lesson. */
export function GlossarySheet({ id, onClose }: { id: string; onClose: () => void }) {
  const { t } = useTranslation()
  const tc = useLocalized()
  const entry = glossaryTerm(id)
  if (!entry) return null
  return (
    <Sheet title={tc(entry.term)} onClose={onClose}>
      <p className={styles.glossaryDef}>{tc(entry.def)}</p>
      <Button variant="secondary" onClick={onClose}>
        {t('glossary_got_it')}
      </Button>
    </Sheet>
  )
}
