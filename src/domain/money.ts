// The play-money rules in one place (pure numbers, no UI). See docs/PLAN.md for how the wallet works:
// one bank, learning pays into it, and only money moved into the Playground can be lost.

/** What a new player starts with (Monopoly style). */
export const START_BANK = 1000
/** Paid for every correct answer in a finished lesson (5 questions: at most $50). */
export const PAY_PER_CORRECT = 10

/** What a lesson pays for `correct` right answers. */
export const lessonPayout = (correct: number) => correct * PAY_PER_CORRECT
