import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocalized } from '../../content/useLocalized'
import { useProgress } from '../../state/useProgress'
import { optionOrder } from '../../domain/optionOrder'
import { useQuestion } from './moduleQuestions'
import styles from './content.module.css'

/** One multiple-choice exercise, graded locally. The latest answer is saved in this browser
 *  (see src/state/progress.ts) and restored on the next visit. */
export function Exercise({ questionId }: { questionId: string }) {
  const question = useQuestion(questionId)
  const t = useLocalized()
  const { t: tUi } = useTranslation()
  const { progress, recordAnswer } = useProgress()
  const saved = progress.answers[questionId]
  const [selected, setSelected] = useState<number | null>(saved?.selected ?? null)
  const [submitted, setSubmitted] = useState(saved !== undefined)

  if (!question) return null

  const isCorrect = submitted && selected === question.answer

  function handleSubmit() {
    if (!question || selected === null) return
    setSubmitted(true)
    recordAnswer(question.id, selected, selected === question.answer)
  }

  function handleRetry() {
    setSelected(null)
    setSubmitted(false)
  }

  return (
    <div className={styles.exercise}>
      <div className={styles.exerciseHead}>
        <span className={styles.boxLabel}>{tUi('quickCheck')}</span>
      </div>
      <p className={styles.exerciseQ}>{t(question.prompt)}</p>
      <div className={styles.exerciseOptions}>
        {optionOrder(question.id, question.options.length).map((i) => (
          <label key={i}>
            <input
              type="radio"
              name={question.id}
              checked={selected === i}
              disabled={submitted}
              onChange={() => setSelected(i)}
            />
            {t(question.options[i])}
          </label>
        ))}
      </div>
      <button
        type="button"
        className={styles.exerciseSubmit}
        disabled={!submitted && selected === null}
        onClick={submitted ? handleRetry : handleSubmit}
      >
        {submitted ? tUi('tryAgain') : tUi('checkAnswer')}
      </button>
      {submitted && (
        <div className={`${styles.exerciseFeedback} ${isCorrect ? styles.correct : styles.incorrect}`}>
          {isCorrect ? tUi('correct') : tUi('notQuite', { answer: t(question.options[question.answer]) })}
        </div>
      )}
    </div>
  )
}
