import type { GrammarIssue, GrammarWorkerRequest, GrammarWorkerResponse } from './types'

export class GrammarService {
  private worker?: Worker
  private nextId = 0
  private pending = new Map<number, { resolve: (value: GrammarWorkerResponse) => void; reject: (reason: Error) => void }>()
  private initialized = false

  private request(payload: { type: 'init'; baseUrl: string } | { type: 'check'; text: string }): Promise<GrammarWorkerResponse> {
    if (!this.worker) {
      this.worker = new Worker(new URL('./grammar.worker.ts', import.meta.url), { type: 'module' })
      this.worker.onmessage = ({ data }: MessageEvent<GrammarWorkerResponse>) => {
        const entry = this.pending.get(data.id)
        if (entry) { entry.resolve(data); this.pending.delete(data.id) }
      }
      this.worker.onerror = () => {
        this.pending.forEach(({ reject }) => reject(new Error('El navegador no pudo ejecutar el corrector local.')))
        this.pending.clear()
      }
    }
    const id = ++this.nextId
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject })
      this.worker!.postMessage({ ...payload, id } as GrammarWorkerRequest)
    })
  }

  async initialize() {
    if (this.initialized) return
    const baseUrl = new URL('grammar', window.location.href.split('#')[0]).href.replace(/\/$/, '')
    const response = await this.request({ type: 'init', baseUrl })
    if (!response.ok) throw new Error(response.error)
    this.initialized = true
  }

  async check(text: string): Promise<GrammarIssue[]> {
    await this.initialize()
    const response = await this.request({ type: 'check', text })
    if (!response.ok) throw new Error(response.error)
    return response.issues ?? []
  }

  retry() { this.worker?.terminate(); this.worker = undefined; this.initialized = false; this.pending.clear() }
}

export const grammarService = new GrammarService()

export function applySuggestion(text: string, issue: GrammarIssue, suggestion: string) {
  return `${text.slice(0, issue.start)}${suggestion}${text.slice(issue.end)}`
}
