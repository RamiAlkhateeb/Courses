import { useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { Localized } from '../../content/types'
import { useLocalized } from '../../content/useLocalized'
import { mythRight, predictVerdict, sortTally, type ActivityBlock } from '../../domain/activities'
import { AnswerOption, Button, Icon, type AnswerState } from '../ui'
import { ActivityDoneContext } from './activityDone'
import styles from './content.module.css'

const ICONS = { predict: 'help', choice: 'flag', sort: 'sliders', myth: 'bulb' } as const

/** An activity step: guess first, what would you do, sort, or myth or fact (rules in src/domain/activities.ts). Not
 *  scored; it tells the lesson once it is answered. */
export function Activity({ block }: { block: ActivityBlock }) {
  const { t } = useTranslation()
  const title = { predict: t('act_predict'), choice: t('act_choice'), sort: t('act_sort'), myth: t('act_myth') }[block.type]
  return (
    <section className={styles.activity} aria-label={title}>
      <span className={styles.activityLabel}>
        <Icon name={ICONS[block.type]} size={18} /> {title}
      </span>
      {block.type === 'predict' && <Predict block={block} />}
      {block.type === 'choice' && <Choice block={block} />}
      {block.type === 'sort' && <Sort block={block} />}
      {block.type === 'myth' && <Myth block={block} />}
    </section>
  )
}

function useAnswered() {
  const done = useContext(ActivityDoneContext)
  return () => done?.()
}

function Result({ tone, title, text }: { tone?: 'right' | 'wrong'; title?: string; text: Localized }) {
  const l = useLocalized()
  return (
    <div className={`${styles.activityResult} ${tone === 'right' ? styles.resultRight : tone === 'wrong' ? styles.resultWrong : ''}`} role="status">
      {title && <strong>{title}</strong>}
      <p>{l(text)}</p>
    </div>
  )
}

function Predict({ block }: { block: Extract<ActivityBlock, { type: 'predict' }> }) {
  const l = useLocalized()
  const { t } = useTranslation()
  const answered = useAnswered()
  const [pick, setPick] = useState<number | null>(null)
  const verdict = pick === null ? null : predictVerdict(pick, block.answer)
  const state = (i: number): AnswerState =>
    pick === null ? 'idle' : i === block.answer ? 'correct' : i === pick ? 'wrong' : 'dim'
  return (
    <>
      <p className={styles.activityPrompt}>{l(block.prompt)}</p>
      <div className={styles.activityOptions} role="group" aria-label={t('act_predict')}>
        {block.options.map((o, i) => (
          <AnswerOption key={i} state={state(i)} disabled={pick !== null} onClick={() => (setPick(i), answered())}>
            {l(o)}
          </AnswerOption>
        ))}
      </div>
      {verdict && <Result tone={verdict === 'far' ? undefined : 'right'} title={t(`act_${verdict}`)} text={block.reveal} />}
    </>
  )
}

function Choice({ block }: { block: Extract<ActivityBlock, { type: 'choice' }> }) {
  const l = useLocalized()
  const { t } = useTranslation()
  const answered = useAnswered()
  const [pick, setPick] = useState<number | null>(null)
  return (
    <>
      <p className={styles.activityPrompt}>{l(block.prompt)}</p>
      <div className={styles.activityOptions} role="group" aria-label={t('act_choice')}>
        {block.options.map((o, i) => (
          <AnswerOption key={i} state={pick === i ? 'selected' : 'idle'} onClick={() => (setPick(i), answered())}>
            {l(o.label)}
          </AnswerOption>
        ))}
      </div>
      {pick !== null && (
        <>
          <Result text={block.options[pick].result} />
          <p className={styles.activityHint}>{t('act_choice_more')}</p>
        </>
      )}
    </>
  )
}

function Sort({ block }: { block: Extract<ActivityBlock, { type: 'sort' }> }) {
  const l = useLocalized()
  const { t } = useTranslation()
  const answered = useAnswered()
  const [picks, setPicks] = useState<Record<number, 0 | 1>>({})
  const tally = sortTally(block.items, picks)
  function place(i: number, bucket: 0 | 1) {
    const next = { ...picks, [i]: bucket }
    setPicks(next)
    if (sortTally(block.items, next).done) answered()
  }
  return (
    <>
      <p className={styles.activityPrompt}>{l(block.prompt)}</p>
      <ul className={styles.sortList}>
        {block.items.map((item, i) => {
          const pick = picks[i]
          const right = pick === item.bucket
          return (
            <li key={i} className={pick === undefined ? undefined : right ? styles.sortRight : styles.sortWrong}>
              <span className={styles.sortText}>
                {pick !== undefined && <Icon name={right ? 'check' : 'close'} size={16} strokeWidth={3} />}
                {l(item.text)}
              </span>
              {pick === undefined ? (
                <span className={styles.sortButtons}>
                  {block.buckets.map((b, k) => (
                    <Button key={k} size="sm" variant="secondary" onClick={() => place(i, k as 0 | 1)}>
                      {l(b)}
                    </Button>
                  ))}
                </span>
              ) : (
                <span className={styles.sortAnswer}>
                  {right ? l(block.buckets[item.bucket]) : t('act_sort_belongs', { bucket: l(block.buckets[item.bucket]) })}
                </span>
              )}
            </li>
          )
        })}
      </ul>
      {tally.done && <Result tone={tally.right === tally.total ? 'right' : undefined} title={t('act_sort_score', { right: tally.right, total: tally.total })} text={block.explain} />}
    </>
  )
}

function Myth({ block }: { block: Extract<ActivityBlock, { type: 'myth' }> }) {
  const l = useLocalized()
  const { t, i18n } = useTranslation()
  const [open, close] = i18n.language === 'ar' ? ['«', '»'] : ['“', '”']
  const answered = useAnswered()
  const [pick, setPick] = useState<boolean | null>(null)
  const right = pick !== null && mythRight(pick, block.fact)
  const state = (fact: boolean): AnswerState => (pick === null ? 'idle' : fact === block.fact ? 'correct' : fact === pick ? 'wrong' : 'dim')
  return (
    <>
      <p className={styles.activityStatement}>
        {open}
        {l(block.statement)}
        {close}
      </p>
      <div className={styles.activityPair} role="group" aria-label={t('act_myth')}>
        {[false, true].map((fact) => (
          <AnswerOption key={String(fact)} state={state(fact)} disabled={pick !== null} onClick={() => (setPick(fact), answered())}>
            {fact ? t('act_fact') : t('act_myth_word')}
          </AnswerOption>
        ))}
      </div>
      {pick !== null && (
        <Result tone={right ? 'right' : 'wrong'} title={t(block.fact ? 'act_is_fact' : 'act_is_myth')} text={block.explain} />
      )}
    </>
  )
}
