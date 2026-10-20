import type { Block, Localized } from '../../content/types'
import { resolveAssetPath } from '../../content/resolveAssetPath'
import { safeHtml } from './safeHtml'
import { useLocalized } from '../../content/useLocalized'
import { Exercise } from './Exercise'
import { CodeBlock } from './CodeBlock'
import { Tabs } from './Tabs'
import { CompoundCalculator } from './CompoundCalculator'
import { Guide, Icon } from '../ui'
import { useTranslation } from 'react-i18next'
import { TIP_POSES } from '../../domain/guide'
import { markTerms } from '../../domain/glossary'
import { GlossarySheet } from './GlossarySheet'
import styles from './content.module.css'
import { useState, type KeyboardEvent, type MouseEvent } from 'react'

/** The glossary term a click or Enter / Space landed on (terms are <dfn data-term> marked by `markTerms`). */
function termAt(e: MouseEvent | KeyboardEvent): string | null {
  const el = (e.target as HTMLElement).closest?.('dfn[data-term]')
  return el?.getAttribute('data-term') ?? null
}

export function Blocks({ blocks }: { blocks: Block[] }) {
  const t = useLocalized()
  const { t: tUi, i18n } = useTranslation()
  const [term, setTerm] = useState<string | null>(null)
  const lang = i18n.language === 'ar' ? 'ar' : 'en'
  const seen = new Set<string>() // each term is explained once per card, where it first appears
  const html = (source: Localized) => safeHtml(markTerms(t(source), lang, seen))
  const onClick = (e: MouseEvent) => {
    const id = termAt(e)
    if (id) setTerm(id)
  }
  const onKeyDown = (e: KeyboardEvent) => {
    const id = (e.key === 'Enter' || e.key === ' ') && termAt(e)
    if (id) {
      e.preventDefault()
      setTerm(id)
    }
  }
  const textProps = { onClick, onKeyDown }

  return (
    <>
      {term && <GlossarySheet id={term} onClose={() => setTerm(null)} />}
      {blocks.map((block, i) => {
        switch (block.type) {
          case 'cardBreak':
          case 'practice': // drawn by the lesson under the card (the simulator has its own look), see CardLesson
            return null

          case 'html':
            return <div key={i} {...textProps} dangerouslySetInnerHTML={html(block.html)} />

          case 'objectives':
            return (
              <div key={i} className={styles.objectives}>
                <div className={styles.objLabel}>{t(block.label)}</div>
                <ul>
                  {block.items.map((item, j) => (
                    <li key={j}>{t(item)}</li>
                  ))}
                </ul>
              </div>
            )

          case 'box': {
            const pose = TIP_POSES[block.variant]
            return (
              <div key={i} className={`${styles.box} ${styles[block.variant]} ${pose ? styles.tip : ''}`}>
                {pose && <Guide pose={pose} height={72} className={styles.tipMascot} />}
                <div>
                  <span className={styles.boxLabel}>{t(block.label)}</span>
                  <div {...textProps} dangerouslySetInnerHTML={html(block.html)} />
                </div>
              </div>
            )
          }

          case 'keyIdea':
            return (
              <div key={i} className={styles.keyIdea}>
                <span className={styles.keyIdeaLabel}>
                  <Icon name="bulb" size={22} /> {tUi('key_idea')}
                </span>
                <div dangerouslySetInnerHTML={safeHtml(t(block.html))} />
              </div>
            )

          case 'calculator':
            return <CompoundCalculator key={i} />

          case 'takeaways':
            return (
              <div key={i} className={styles.takeaways}>
                <span className={styles.boxLabel}>{t(block.label)}</span>
                <ul>
                  {block.items.map((item, j) => (
                    <li key={j}>{t(item)}</li>
                  ))}
                </ul>
              </div>
            )

          case 'code':
            return <CodeBlock key={i} code={block.code} />

          case 'diagram':
            return (
              <figure key={i} className={styles.diagram}>
                <div className={styles.fig}>{t(block.fig)}</div>
                <div className={styles.figTitle}>{t(block.title)}</div>
                <img src={resolveAssetPath(block.src)} alt={t(block.alt)} />
                <figcaption>{t(block.caption)}</figcaption>
              </figure>
            )

          case 'exercise':
            return <Exercise key={i} questionId={block.questionId} />

          case 'formula':
            return (
              <div key={i} className={styles.formula}>
                <span className={styles.formulaEq}>{block.eq}</span>
                <span className={styles.formulaNote}>{t(block.note)}</span>
              </div>
            )

          case 'table':
            return (
              <div key={i} className={styles.tableScroll}>
                <table>
                  <thead>
                    <tr>
                      {block.headers.map((h, j) => (
                        <th key={j}>{t(h)}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {block.rows.map((row, r) => (
                      <tr key={r}>
                        {row.map((cell, c) => (
                          <td key={c} dangerouslySetInnerHTML={safeHtml(t(cell))} />
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )

          case 'tabs':
            return <Tabs key={i} tabs={block.tabs} />

          default:
            return null
        }
      })}
    </>
  )
}
