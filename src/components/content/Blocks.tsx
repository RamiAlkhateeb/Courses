import type { Block } from '../../content/types'
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
import styles from './content.module.css'


export function Blocks({ blocks }: { blocks: Block[] }) {
  const t = useLocalized()
  const { t: tUi } = useTranslation()

  return (
    <>
      {blocks.map((block, i) => {
        switch (block.type) {
          case 'cardBreak':
            return null

          case 'html':
            return <div key={i} dangerouslySetInnerHTML={safeHtml(t(block.html))} />

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
                  <div dangerouslySetInnerHTML={safeHtml(t(block.html))} />
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
