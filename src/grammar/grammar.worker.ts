/// <reference lib="webworker" />
import init, { LtEngine } from 'lingotweaker-wasm'
import { selectClearMatches, type RawGrammarMatch } from './issue-filter'
import { findLearnerIssues, mergeGrammarIssues } from './learner-rules'
import { utf8ByteOffsetToUtf16 } from './offsets'
import type { GrammarIssue, GrammarWorkerRequest, GrammarWorkerResponse } from './types'

let engine: LtEngine | undefined

async function decompressGzip(bytes: Uint8Array) {
  if (typeof DecompressionStream !== 'function') {
    throw new Error('Este navegador no permite descomprimir los datos del corrector. Actualízalo o prueba con otro navegador moderno.')
  }
  const stream = new Blob([bytes as BlobPart]).stream().pipeThrough(new DecompressionStream('gzip'))
  return new Uint8Array(await new Response(stream).arrayBuffer())
}

async function initialize(baseUrl: string) {
  if (engine) return engine.active_rule_count()
  await init()
  const response = await fetch(`${baseUrl}/packs/es.pack.gz`)
  if (!response.ok) throw new Error(`No se pudieron cargar los datos de español (${response.status}).`)
  const downloaded = new Uint8Array(await response.arrayBuffer())
  // Algunos servidores envían .gz como binario y otros lo decodifican según
  // Content-Encoding. Solo descomprimimos si aún conserva la cabecera gzip.
  const pack = downloaded[0] === 0x1f && downloaded[1] === 0x8b
    ? await decompressGzip(downloaded)
    : downloaded
  engine = new LtEngine('es', pack, JSON.stringify({ today: new Date().toISOString() }))
  return engine.active_rule_count()
}

function normalize(text: string, matches: RawGrammarMatch[]): GrammarIssue[] {
  return selectClearMatches(text, matches).map((match, index) => ({
    id: `${match.rule_id ?? 'regla'}-${match.range.start}-${index}`,
    start: utf8ByteOffsetToUtf16(text, match.range.start),
    end: utf8ByteOffsetToUtf16(text, match.range.end),
    message: match.message.replace(/<\/?suggestion>/g, ''),
    category: match.category_name ?? match.category_id ?? 'Revisión',
    suggestions: (match.suggestions ?? []).map((item) => item.value),
    ruleId: match.rule_id,
  }))
}

self.onmessage = async ({ data }: MessageEvent<GrammarWorkerRequest>) => {
  try {
    if (data.type === 'init') {
      const rules = await initialize(data.baseUrl)
      self.postMessage({ id: data.id, ok: true, rules } satisfies GrammarWorkerResponse)
      return
    }
    if (!engine) throw new Error('El corrector todavía no está preparado.')
    const raw = JSON.parse(engine.check_matches_json(data.text)) as { matches: RawGrammarMatch[] }
    const issues = mergeGrammarIssues(normalize(data.text, raw.matches), findLearnerIssues(data.text))
    self.postMessage({ id: data.id, ok: true, issues } satisfies GrammarWorkerResponse)
  } catch (error) {
    const knownSpanishError = error instanceof Error && (error.message.startsWith('Este navegador') || error.message.startsWith('No se pudieron'))
    const message = knownSpanishError
      ? error.message
      : 'El motor local no pudo iniciarse o no es compatible con este navegador.'
    self.postMessage({ id: data.id, ok: false, error: message } satisfies GrammarWorkerResponse)
  }
}
