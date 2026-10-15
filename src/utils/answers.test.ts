import { describe, expect, it } from 'vitest'
import { assessVocabulary, classifyAnswer } from './answers'
import { vocabulary } from '../data/vocabulary'
import { prompts } from '../data/prompts'

describe('evaluación de respuestas', () => {
  it('ignora mayúsculas y espacios exteriores', () => expect(classifyAnswer('  ÁRBOL ', ['árbol'])).toBe('correcta'))
  it('señala una tilde ausente sin aceptar la respuesta como correcta', () => expect(classifyAnswer('arbol', ['árbol'])).toBe('acento'))
  it('acepta alternativas curadas', () => {
    const coche = vocabulary.find((item) => item.spanish === 'coche')!
    expect(assessVocabulary('automóvil', coche)).toBe('correcta')
  })
  it('rechaza palabras distintas', () => expect(classifyAnswer('pera', ['manzana'])).toBe('incorrecta'))
  it('incluye ochocientas cincuenta palabras sin duplicados', () => {
    expect(vocabulary).toHaveLength(850)
    expect(new Set(vocabulary.map((item) => item.spanish)).size).toBe(850)
    expect(vocabulary.filter((item) => item.partOfSpeech === 'verbo')).toHaveLength(100)
    expect(vocabulary.every((item) => item.sourceUrl?.startsWith('https://dle.rae.es/'))).toBe(true)
  })
  it('incluye quince preguntas originales por nivel', () => {
    for (const level of ['A1', 'A2', 'B1', 'B2']) expect(prompts.filter((prompt) => prompt.level === level)).toHaveLength(15)
  })
})
