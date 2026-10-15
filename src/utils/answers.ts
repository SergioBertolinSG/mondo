import type { VocabularyItem } from '../data/vocabulary'

export type AnswerResult = 'correcta' | 'acento' | 'incorrecta'

export const normalize = (value: string) => value.trim().toLocaleLowerCase('es').normalize('NFC')
export const withoutMarks = (value: string) => normalize(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '')

export function classifyAnswer(answer: string, accepted: string[]): AnswerResult {
  const clean = normalize(answer)
  if (accepted.some((item) => normalize(item) === clean)) return 'correcta'
  if (accepted.some((item) => withoutMarks(item) === withoutMarks(clean))) return 'acento'
  return 'incorrecta'
}

export function assessVocabulary(answer: string, item: VocabularyItem) {
  return classifyAnswer(answer, [item.spanish, ...(item.alternatives ?? [])])
}

export function shuffled<T>(items: T[]): T[] {
  const result = [...items]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}
