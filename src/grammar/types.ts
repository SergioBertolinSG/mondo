export type GrammarIssue = {
  id: string
  start: number
  end: number
  message: string
  category: string
  suggestions: string[]
  ruleId?: string
}

export type GrammarWorkerRequest =
  | { id: number; type: 'init'; baseUrl: string }
  | { id: number; type: 'check'; text: string }

export type GrammarWorkerResponse =
  | { id: number; ok: true; issues?: GrammarIssue[]; rules?: number }
  | { id: number; ok: false; error: string }
