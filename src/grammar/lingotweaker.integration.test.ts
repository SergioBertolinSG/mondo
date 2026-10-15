// @vitest-environment node
import { beforeAll, describe, expect, it } from 'vitest'
import { LtEngine } from 'lingotweaker-wasm/node'
import { localPack } from 'lingotweaker-wasm/pack'
import { selectClearMatches, type RawGrammarMatch } from './issue-filter'

let engine: LtEngine

describe('LingoTweaker real con datos de español', () => {
  beforeAll(async () => {
    const pack = await localPack('es')
    if (!pack) throw new Error('Falta el paquete local de español')
    engine = new LtEngine('es', pack, JSON.stringify({ today: '2026-10-15' }))
  })
  it('carga un conjunto real de reglas', () => expect(engine.active_rule_count()).toBeGreaterThan(1000))
  it('detecta una concordancia incorrecta observada en el corpus', () => {
    const result = JSON.parse(engine.check_matches_json('Normalmente yo va al parque con mis amigos.'))
    expect(result.matches.some((match: { rule_id: string; suggestions: Array<{value:string}> }) => match.rule_id === 'AGREEMENT_PRONOUNSUBJECT_VERB' && match.suggestions.some((item) => item.value === 'voy'))).toBe(true)
  })
  it('reduce la salida real a una única sugerencia de alta confianza', () => {
    const text = 'Normalmente yo va al parque con mis amigos.'
    const result = JSON.parse(engine.check_matches_json(text)) as { matches: RawGrammarMatch[] }
    const clear = selectClearMatches(text, result.matches)
    expect(clear).toHaveLength(1)
    expect(clear[0].suggestions).toEqual([{ value: 'voy' }])
  })
  it('conserva una corrección real de concordancia aunque cambie la flexión completa', () => {
    const text = 'Ayer yo caminaste al parque.'
    const result = JSON.parse(engine.check_matches_json(text)) as { matches: RawGrammarMatch[] }
    const clear = selectClearMatches(text, result.matches)
    expect(clear).toHaveLength(1)
    expect(clear[0].original_error_str).toBe('caminaste')
    expect(clear[0].suggestions).toEqual([{ value: 'caminé' }])
  })
  it('conserva reglas gramaticales deterministas del paquete español', () => {
    const cases = [
      ['He rompido el vaso.', 'ROMPIDO_ROTO', 'roto'],
      ['Pienso de que vendrá.', 'DEQUEISMO', 'que'],
      ['Habían muchas personas.', 'ID_HUBO_HUBIERON', 'Había'],
    ] as const
    for (const [text, ruleId, suggestion] of cases) {
      const result = JSON.parse(engine.check_matches_json(text)) as { matches: RawGrammarMatch[] }
      const clear = selectClearMatches(text, result.matches)
      expect(clear.some((match) => match.rule_id === ruleId && match.suggestions?.[0]?.value === suggestion)).toBe(true)
    }
  })
  it('descarta una sugerencia real que el motor marca como insegura', () => {
    const text = 'El agua está frio.'
    const result = JSON.parse(engine.check_matches_json(text)) as { matches: RawGrammarMatch[] }
    const clear = selectClearMatches(text, result.matches)
    expect(clear.some((match) => match.rule_id === 'ESTAS_NO_TILDE')).toBe(false)
    expect(clear.some((match) => match.rule_id === 'FRIO')).toBe(true)
  })
  it('no informa de problemas en una frase sencilla correcta del corpus', () => {
    expect(JSON.parse(engine.check_matches_json('El árbol es verde.')).matches).toEqual([])
  })
})
