// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { findLearnerIssues, mergeGrammarIssues } from './learner-rules'
import type { GrammarIssue } from './types'

describe('reglas locales para estudiantes', () => {
  it.each([
    ['Yo ir a casa.', 'voy'],
    ['Ella tener dos hermanos.', 'tiene'],
    ['Nosotros es amigos.', 'somos'],
    ['Yo habla español.', 'hablo'],
    ['Ellos comemos aquí.', 'comen'],
    ['Creo que tú tener razón.', 'tienes'],
  ])('corrige una forma verbal inequívoca: %s', (text, suggestion) => {
    expect(findLearnerIssues(text)[0]?.suggestions).toEqual([suggestion])
  })

  it.each([
    'Yo voy a casa.',
    'Para yo ir tendría que ahorrar.',
    'Sin nosotros saberlo, cambiaron el plan.',
    'Él fue al parque.',
    'Nosotros hablamos español.',
  ])('no marca una construcción válida: %s', (text) => {
    expect(findLearnerIssues(text)).toEqual([])
  })

  it.each([
    ['Ayer voy al parque.', 'fui'],
    ['Anoche trabajo hasta tarde.', 'trabajé'],
    ['La semana pasada vivo en Madrid.', 'viví'],
    ['Mañana trabajé desde casa.', 'trabajaré'],
    ['El próximo año yo vivía en Sevilla.', 'viviré'],
  ])('corrige un tiempo incompatible con una referencia temporal: %s', (text, suggestion) => {
    const issue = findLearnerIssues(text).find(({ ruleId }) => ruleId === 'LOCAL_VERB_TENSE')
    expect(issue?.suggestions).toEqual([suggestion])
  })

  it.each([
    'Ayer fui al parque.',
    'Ayer trabajaba desde casa.',
    'Mañana voy al parque.',
    'Mañana trabajaré desde casa.',
    'Siempre fui feliz allí.',
  ])('acepta tiempos compatibles o sin una referencia inequívoca: %s', (text) => {
    expect(findLearnerIssues(text).filter(({ ruleId }) => ruleId === 'LOCAL_VERB_TENSE')).toEqual([])
  })

  it('conserva el resultado de LingoTweaker cuando ambas fuentes marcan el mismo tramo', () => {
    const primary: GrammarIssue = { id: 'lt', start: 3, end: 5, message: 'Concordancia', category: 'AGREEMENT', suggestions: ['voy'] }
    const local: GrammarIssue = { id: 'local', start: 3, end: 5, message: 'Concordancia local', category: 'Gramática básica', suggestions: ['voy'] }
    expect(mergeGrammarIssues([primary], [local])).toEqual([primary])
  })
})
