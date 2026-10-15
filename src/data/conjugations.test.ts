import { describe, expect, it } from 'vitest'
import { conjugate, makeVerbQuestions, tenses } from './conjugations'

describe('conjugaciones verificadas', () => {
  it('resuelve irregulares y tildes', () => {
    expect(conjugate('ser', 'presente', 0)).toEqual(['soy'])
    expect(conjugate('tener', 'preterito', 2)).toEqual(['tuvo'])
    expect(conjugate('hacer', 'futuro', 1)).toEqual(['harás'])
    expect(conjugate('ver', 'imperfecto', 3)).toEqual(['veíamos'])
  })
  it('forma tiempos compuestos con participios irregulares', () => {
    expect(conjugate('decir', 'perfecto', 3)).toEqual(['hemos dicho'])
    expect(conjugate('escribir', 'perfecto', 4)).toEqual(['habéis escrito'])
  })
  it('acepta las variantes -ra y -se del imperfecto de subjuntivo', () => {
    expect(conjugate('tener', 'subjuntivoImperfecto', 3)).toEqual(['tuviéramos', 'tuviésemos'])
    expect(conjugate('hablar', 'subjuntivoImperfecto', 0)).toEqual(['hablara', 'hablase'])
  })
  it('solo genera combinaciones válidas y sin duplicados estructurales', () => {
    const questions = makeVerbQuestions(['ser'], tenses.map((tense) => tense.id), [0, 1])
    expect(questions).toHaveLength(16)
    expect(new Set(questions.map((question) => `${question.verb}-${question.tense}-${question.personIndex}`)).size).toBe(16)
  })
})
