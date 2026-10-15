import { conjugate, tenses, verbs, type TenseId } from '../data/conjugations'
import type { GrammarIssue } from './types'

type Word = { value: string; normalized: string; start: number; end: number }
type VerbForm = { infinitive: string; tense: TenseId; person: number; replacement: string }

const pronouns = new Map<string, number>([
  ['yo', 0], ['tú', 1], ['él', 2], ['ella', 2], ['usted', 2],
  ['nosotros', 3], ['nosotras', 3], ['vosotros', 4], ['vosotras', 4],
  ['ellos', 5], ['ellas', 5], ['ustedes', 5],
])

const clauseLinks = new Set(['que', 'y', 'pero', 'porque', 'pues'])
const licensedInfinitivePrepositions = new Set(['para', 'sin', 'al', 'de', 'por', 'tras'])
const simpleTenses = tenses.map(({ id }) => id).filter((id) => id !== 'perfecto')
const forms = new Map<string, VerbForm[]>()

for (const { infinitive } of verbs) {
  for (const tense of simpleTenses) {
    for (let person = 0; person < 6; person++) {
      for (const replacement of conjugate(infinitive, tense, person)) {
        const normalized = replacement.toLocaleLowerCase('es')
        const entries = forms.get(normalized) ?? []
        entries.push({ infinitive, tense, person, replacement })
        forms.set(normalized, entries)
      }
    }
  }
}

function wordsIn(text: string): Word[] {
  return [...text.matchAll(/\p{L}+(?:[’'-]\p{L}+)*/gu)].map((match) => ({
    value: match[0],
    normalized: match[0].toLocaleLowerCase('es'),
    start: match.index,
    end: match.index + match[0].length,
  }))
}

function startsClause(text: string, words: Word[], index: number) {
  if (index === 0) return true
  const previous = words[index - 1]
  if (clauseLinks.has(previous.normalized)) return true
  return /[.!?;:]\s*$/.test(text.slice(previous.end, words[index].start))
}

function uniqueReplacement(candidates: VerbForm[], person: number) {
  // Si la forma ya es válida para esta persona, no hay un error inequívoco.
  if (candidates.some((candidate) => candidate.person === person)) return undefined
  const replacements = new Set(candidates.map((candidate) => conjugate(candidate.infinitive, candidate.tense, person)[0]).filter(Boolean))
  if (replacements.size !== 1) return undefined
  return { value: [...replacements][0], infinitives: [...new Set(candidates.map((candidate) => candidate.infinitive))] }
}

function sentenceRanges(text: string) {
  const ranges: Array<{ start: number; end: number }> = []
  let start = 0
  for (const match of text.matchAll(/[.!?]+/g)) {
    ranges.push({ start, end: match.index + match[0].length })
    start = match.index + match[0].length
  }
  if (start < text.length) ranges.push({ start, end: text.length })
  return ranges
}

function temporalIssues(text: string, words: Word[]): GrammarIssue[] {
  const issues: GrammarIssue[] = []
  for (const range of sentenceRanges(text)) {
    const sentence = text.slice(range.start, range.end).toLocaleLowerCase('es').replace(/\s+/g, ' ')
    const refersToPast = /\b(ayer|anteayer|anoche)\b|\b(la semana|el mes|el año) pasad[oa]\b/.test(sentence)
    const refersToFuture = /\bmañana\b|\bpasado mañana\b|\b(la semana|el mes|el año) que viene\b|\b(el próximo|la próxima)\b/.test(sentence)
    if (!refersToPast && !refersToFuture) continue

    const sentenceWords = words.filter((item) => item.start >= range.start && item.end <= range.end)
    for (let index = 0; index < sentenceWords.length; index++) {
      const word = sentenceWords[index]
      const previous = sentenceWords[index - 1]
      const explicitPerson = previous && !text.slice(previous.end, word.start).trim()
        ? pronouns.get(previous.normalized)
        : undefined
      const allCandidates = forms.get(word.normalized) ?? []
      const candidates = explicitPerson === undefined
        ? allCandidates
        : allCandidates.filter(({ person }) => person === explicitPerson)
      if (candidates.length === 0) continue

      let target: TenseId | undefined
      if (refersToPast && candidates.every(({ tense }) => tense === 'presente' || tense === 'futuro')) target = 'preterito'
      if (refersToFuture && candidates.every(({ tense }) => tense === 'preterito' || tense === 'imperfecto')) target = 'futuro'
      if (!target) continue

      const replacements = new Set(candidates.map(({ infinitive, person }) => conjugate(infinitive, target!, person)[0]).filter(Boolean))
      if (replacements.size !== 1) continue
      issues.push({
        id: `local-tense-${word.start}`,
        start: word.start,
        end: word.end,
        message: refersToPast
          ? `«${word.value}» está en presente o futuro, pero la frase sitúa la acción en el pasado.`
          : `«${word.value}» está en pasado, pero la frase sitúa la acción en el futuro.`,
        category: 'Tiempo verbal',
        suggestions: [[...replacements][0]],
        ruleId: 'LOCAL_VERB_TENSE',
      })
    }
  }
  return issues
}

/** Reglas locales conservadoras para errores frecuentes de estudiantes. */
export function findLearnerIssues(text: string): GrammarIssue[] {
  const words = wordsIn(text)
  const issues: GrammarIssue[] = []
  for (let index = 0; index < words.length - 1; index++) {
    const subject = words[index]
    const person = pronouns.get(subject.normalized)
    if (person === undefined) continue
    const verb = words[index + 1]
    if (text.slice(subject.end, verb.start).trim()) continue

    const knownVerb = verbs.find(({ infinitive }) => infinitive === verb.normalized)
    if (knownVerb) {
      const previous = words[index - 1]
      const licensed = previous && licensedInfinitivePrepositions.has(previous.normalized)
      if (!licensed && startsClause(text, words, index)) {
        const replacement = conjugate(knownVerb.infinitive, 'presente', person)[0]
        issues.push({
          id: `local-infinitive-${verb.start}`,
          start: verb.start,
          end: verb.end,
          message: `Después de «${subject.value}» se necesita una forma personal del verbo «${knownVerb.infinitive}».`,
          category: 'Gramática básica',
          suggestions: [replacement],
          ruleId: 'LOCAL_SUBJECT_INFINITIVE',
        })
      }
      continue
    }

    const correction = uniqueReplacement(forms.get(verb.normalized) ?? [], person)
    if (!correction) continue
    issues.push({
      id: `local-agreement-${verb.start}`,
      start: verb.start,
      end: verb.end,
      message: `La forma «${verb.value}» no concuerda con «${subject.value}».`,
      category: 'Concordancia verbal',
      suggestions: [correction.value],
      ruleId: 'LOCAL_SUBJECT_VERB_AGREEMENT',
    })
  }
  for (const issue of temporalIssues(text, words)) {
    const overlaps = issues.some((existing) => issue.start < existing.end && issue.end > existing.start)
    if (!overlaps) issues.push(issue)
  }
  return issues.sort((left, right) => left.start - right.start)
}

export function mergeGrammarIssues(primary: GrammarIssue[], complementary: GrammarIssue[], limit = 6) {
  const result = [...primary]
  for (const issue of complementary) {
    const overlaps = result.some((existing) => issue.start < existing.end && issue.end > existing.start)
    if (!overlaps) result.push(issue)
  }
  return result.sort((left, right) => left.start - right.start || left.end - right.end).slice(0, limit)
}
