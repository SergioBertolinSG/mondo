// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { applySuggestion } from './grammar-service'
import { utf8ByteOffsetToUtf16 } from './offsets'
import { selectClearMatches } from './issue-filter'
import type { GrammarIssue } from './types'

describe('adaptador gramatical', () => {
  it('convierte offsets UTF-8 con tildes y emoji a índices UTF-16', () => {
    const text = 'Mañana 😊 yo va a casa.'
    expect(utf8ByteOffsetToUtf16(text, 16)).toBe(13)
    expect(utf8ByteOffsetToUtf16(text, 18)).toBe(15)
    expect(text.slice(13, 15)).toBe('va')
  })
  it('aplica una sugerencia sin modificar el resto del texto', () => {
    const issue: GrammarIssue = { id:'x', start:3, end:5, message:'', category:'', suggestions:['voy'] }
    expect(applySuggestion('Yo va a casa.', issue, 'voy')).toBe('Yo voy a casa.')
  })
  it('descarta consejos estilísticos y conserva una sola corrección evidente', () => {
    const matches = selectClearMatches('Normalmente yo va.', [
      { rule_id: 'COMMA_ADVERB', message: 'Coma opcional', range: { start: 0, end: 11 }, suggestions: [{ value: 'Normalmente,' }], category_id: 'PUNCTUATION' },
      { rule_id: 'AGREEMENT_PRONOUNSUBJECT_VERB', message: 'Concordancia', range: { start: 15, end: 17 }, original_error_str: 'va', suggestions: [{ value: 'voy' }, { value: 'vaya' }, { value: 'vamos' }], category_id: 'AGREEMENT_VERBS', issue_type: 'inconsistency' },
    ])
    expect(matches).toHaveLength(1)
    expect(matches[0].suggestions).toEqual([{ value: 'voy' }])
  })
  it('conserva concordancias claras aunque la flexión cambie varios caracteres', () => {
    const matches = selectClearMatches('Ayer yo caminaste al parque.', [
      { rule_id: 'AGREEMENT_PRONOUNSUBJECT_VERB', message: 'Concordancia', range: { start: 8, end: 17 }, original_error_str: 'caminaste', suggestions: [{ value: 'caminé' }], category_id: 'AGREEMENT_VERBS', issue_type: 'inconsistency' },
    ])
    expect(matches).toHaveLength(1)
    expect(matches[0].suggestions).toEqual([{ value: 'caminé' }])
  })
  it('omite una palabra ilegible si el reemplazo propuesto no es fiable', () => {
    const matches = selectClearMatches('Yo asdfgh casa.', [
      { rule_id: 'MORFOLOGIK_RULE_ES', message: 'Posible error ortográfico', range: { start: 3, end: 9 }, suggestions: [{ value: 'adujo' }], category_id: 'TYPOS', issue_type: 'misspelling' },
    ])
    expect(matches).toEqual([])
  })
  it('conserva una regla gramatical con un único reemplazo concreto', () => {
    const matches = selectClearMatches('He rompido el vaso.', [
      { rule_id: 'ROMPIDO_ROTO', message: 'El participio adecuado es roto.', range: { start: 3, end: 10 }, original_error_str: 'rompido', suggestions: [{ value: 'roto' }], category_id: 'INCORRECT_EXPRESSIONS', issue_type: 'grammar' },
    ])
    expect(matches).toHaveLength(1)
    expect(matches[0].suggestions).toEqual([{ value: 'roto' }])
  })
  it('omite una coincidencia que el propio motor considera insegura', () => {
    const matches = selectClearMatches('El agua está fría.', [
      { rule_id: 'ESTAS_NO_TILDE', message: 'Posible confusión', range: { start: 8, end: 13 }, original_error_str: 'está', suggestions: [{ value: 'esta' }], category_id: 'DIACRITICS', issue_type: 'misspelling', context_for_sure_match: -1 },
    ])
    expect(matches).toEqual([])
  })
  it('omite reglas gramaticales ambiguas con varias propuestas', () => {
    const matches = selectClearMatches('Texto ambiguo.', [
      { rule_id: 'AMBIGUA', message: 'Posible error', range: { start: 0, end: 5 }, original_error_str: 'Texto', suggestions: [{ value: 'Esto' }, { value: 'El texto' }], category_id: 'GRAMMAR', issue_type: 'grammar' },
    ])
    expect(matches).toEqual([])
  })
})
