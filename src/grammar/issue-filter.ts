export type RawGrammarMatch = {
  rule_id?: string
  message: string
  range: { start: number; end: number }
  suggestions?: Array<{ value: string }>
  category_name?: string
  category_id?: string
  issue_type?: string
  original_error_str?: string
  context_for_sure_match?: number
}

function editDistance(left: string, right: string) {
  const a = [...left.toLocaleLowerCase('es')]
  const b = [...right.toLocaleLowerCase('es')]
  const row = Array.from({ length: b.length + 1 }, (_, index) => index)
  for (let i = 1; i <= a.length; i++) {
    let previous = row[0]
    row[0] = i
    for (let j = 1; j <= b.length; j++) {
      const saved = row[j]
      row[j] = Math.min(row[j] + 1, row[j - 1] + 1, previous + (a[i - 1] === b[j - 1] ? 0 : 1))
      previous = saved
    }
  }
  return row[b.length]
}

const withoutMarks = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('es')

export function selectClearMatches(text: string, matches: RawGrammarMatch[]) {
  return matches.flatMap((match) => {
    const suggestion = match.suggestions?.[0]?.value
    if (match.category_id === 'PUNCTUATION' || match.context_for_sure_match === -1) return []
    const original = match.original_error_str ?? new TextDecoder().decode(new TextEncoder().encode(text).slice(match.range.start, match.range.end))
    const isSpelling = match.issue_type === 'misspelling' || match.category_id === 'TYPOS'
    const isAgreement = match.issue_type === 'inconsistency'
      || match.category_id === 'CONFUSIONS'
      || match.category_id?.startsWith('AGREEMENT')
      || match.context_for_sure_match === 1
    const isDeterministicGrammar = match.issue_type === 'grammar'
      && match.suggestions?.length === 1
    if ((!isSpelling && !isAgreement && !isDeterministicGrammar) || !suggestion) return []
    const closeSpelling = withoutMarks(original) === withoutMarks(suggestion)
      || original.replace(/\s/g, '') === suggestion.replace(/\s/g, '')
      || editDistance(original, suggestion) <= 2
    // Las flexiones de una concordancia clara pueden cambiar más de dos letras
    // (p. ej. «caminaste» → «caminé») y siguen siendo reemplazos concretos.
    // Las reglas gramaticales con una única propuesta también son deterministas
    // (p. ej. «rompido» → «roto») aunque el reemplazo no sea ortográficamente cercano.
    if (!isAgreement && !isDeterministicGrammar && !closeSpelling) return []
    return [{ ...match, suggestions: [{ value: suggestion }] }]
  }).slice(0, 6)
}
