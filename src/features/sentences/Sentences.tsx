import { useMemo, useState, type ReactNode } from 'react'
import { AlertTriangle, Check, ChevronRight, LoaderCircle, RefreshCw, ShieldCheck, WandSparkles } from 'lucide-react'
import { Button, Choice, PageHeader, Progress } from '../../components/ui'
import { promptTopics, prompts, type SentencePrompt } from '../../data/prompts'
import type { Level } from '../../data/vocabulary'
import { applySuggestion, grammarService } from '../../grammar/grammar-service'
import type { GrammarIssue } from '../../grammar/types'
import { shuffled } from '../../utils/answers'

type Stage = 'setup' | 'write' | 'review'
type EngineState = 'idle' | 'loading' | 'ready' | 'error'

function MarkedSentence({ value, issues }: { value: string; issues: GrammarIssue[] }) {
  const parts: ReactNode[] = []
  let cursor = 0
  const ordered = [...issues].sort((left, right) => left.start - right.start || left.end - right.end)
  for (const issue of ordered) {
    if (issue.start < cursor) continue
    const start = Math.max(0, Math.min(value.length, issue.start))
    const end = Math.max(start, Math.min(value.length, issue.end))
    if (end <= cursor) continue
    if (start > cursor) parts.push(value.slice(cursor, start))
    parts.push(<del className="incorrect-fragment" title={issue.message} key={issue.id}>{value.slice(start, end)}</del>)
    cursor = end
  }
  if (cursor < value.length) parts.push(value.slice(cursor))
  return <p>{parts}</p>
}

export function Sentences() {
  const [stage, setStage] = useState<Stage>('setup')
  const [level, setLevel] = useState<Level>('A1')
  const [topic, setTopic] = useState('Aleatorio')
  const [queue, setQueue] = useState<SentencePrompt[]>([])
  const [index, setIndex] = useState(0)
  const [text, setText] = useState('')
  const [original, setOriginal] = useState('')
  const [originalIssues, setOriginalIssues] = useState<GrammarIssue[]>([])
  const [revised, setRevised] = useState('')
  const [issues, setIssues] = useState<GrammarIssue[]>([])
  const [engine, setEngine] = useState<EngineState>('idle')
  const [error, setError] = useState('')
  const levelTopics = useMemo(() => promptTopics.filter((value) => prompts.some((prompt) => prompt.level === level && prompt.topic === value)), [level])
  const current = queue[index]
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0

  function start() {
    const pool = prompts.filter((prompt) => prompt.level === level && (topic === 'Aleatorio' || prompt.topic === topic))
    setQueue(shuffled(pool)); setIndex(0); setText(''); setStage('write')
  }
  async function check(value = text, preserveOriginal = true) {
    if (!value.trim()) return
    setEngine('loading'); setError('')
    if (preserveOriginal) setOriginal(value)
    setRevised(value)
    setStage('review')
    try {
      const found = await grammarService.check(value)
      setIssues(found)
      if (preserveOriginal) setOriginalIssues(found)
      setEngine('ready')
    } catch (reason) {
      setEngine('error'); setError(reason instanceof Error ? reason.message : 'No se pudo cargar el corrector local.')
    }
  }
  function apply(issue: GrammarIssue, suggestion: string) {
    const next = applySuggestion(revised, issue, suggestion)
    setRevised(next)
    void check(next, false)
  }
  function next() {
    const nextIndex = index + 1 < queue.length ? index + 1 : 0
    if (nextIndex === 0) setQueue((old) => shuffled(old))
    setIndex(nextIndex); setText(''); setOriginal(''); setOriginalIssues([]); setRevised(''); setIssues([]); setStage('write')
  }
  function restart() { setStage('setup'); setQueue([]); setText(''); setOriginalIssues([]); setIssues([]) }
  function retry() { grammarService.retry(); void check(revised || text, originalIssues.length === 0) }

  if (stage === 'setup') return <div className="page">
    <PageHeader eyebrow="Práctica 03" title="Frases"><p>Responde con libertad y recibe observaciones de un corrector que funciona en tu navegador.</p></PageHeader>
    <div className="setup-card">
      <fieldset><legend>Nivel</legend><div className="choice-row">{(['A1','A2','B1','B2'] as const).map((value) => <Choice key={value} active={level === value} onClick={() => { setLevel(value); setTopic('Aleatorio') }}>{value}</Choice>)}</div></fieldset>
      <fieldset><legend>Tema</legend><div className="choice-grid compact"><Choice active={topic === 'Aleatorio'} onClick={() => setTopic('Aleatorio')}>Aleatorio</Choice>{levelTopics.map((value) => <Choice key={value} active={topic === value} onClick={() => setTopic(value)}>{value}</Choice>)}</div></fieldset>
      <aside className="local-check"><ShieldCheck/><div><strong>Revisión privada y local</strong><p>Tu texto no sale del navegador. LingoTweaker se carga al revisar por primera vez.</p></div></aside>
      <Button onClick={start}>Empezar a escribir</Button>
    </div>
  </div>

  if (stage === 'review') return <div className="page review-page">
    <div className="game-top"><button className="text-button" onClick={() => { setText(revised); setStage('write') }}>Seguir editando</button><button className="text-button" onClick={restart}>Terminar</button></div>
    <PageHeader eyebrow={`${current?.level} · ${current?.topic}`} title="Revisión local"/>
    <section className="original-block"><h2>Tu respuesta original</h2>{engine === 'ready' ? <MarkedSentence value={original} issues={originalIssues}/> : <p>{original}</p>}</section>
    {engine === 'loading' && <div className="engine-state" role="status"><LoaderCircle className="spin"/><strong>Revisando en tu dispositivo…</strong><p>La primera carga puede tardar unos segundos.</p></div>}
    {engine === 'error' && <div className="engine-state error" role="alert"><AlertTriangle/><strong>No se pudo iniciar el corrector</strong><p>{error}</p><Button onClick={retry}><RefreshCw size={18}/> Reintentar</Button></div>}
    {engine === 'ready' && <div aria-live="polite">
      {issues.length === 0 ? <div className="engine-state success"><Check/><strong>No se han detectado errores claros</strong><p>Solo mostramos correcciones de alta confianza. Esto no garantiza que el texto sea perfecto ni que responda por completo a la pregunta.</p></div> : <><h2 className="section-title">{issues.length} {issues.length === 1 ? 'parte incorrecta o ilegible' : 'partes incorrectas o ilegibles'} · marcadas con tachado</h2><div className="issue-list">{issues.map((issue) => <article className="issue" key={issue.id}>
        <span>{issue.category}</span><strong>«{revised.slice(issue.start, issue.end)}»</strong><p>{issue.message}</p>
        {issue.suggestions.length > 0 && <div className="suggestions">{issue.suggestions.map((suggestion) => <button key={suggestion} onClick={() => apply(issue, suggestion)}><WandSparkles size={15}/> Cambiar por «{suggestion}»</button>)}</div>}
      </article>)}</div></>}
      <label className="revised-label" htmlFor="revised">Versión revisada</label><textarea id="revised" value={revised} onChange={(e) => setRevised(e.target.value)} rows={7}/>
      <div className="review-actions"><Button className="secondary" onClick={() => check(revised, false)}>Revisar de nuevo</Button><Button onClick={next}>Otra pregunta <ChevronRight size={18}/></Button></div>
    </div>}
  </div>

  return <div className="page game-page sentence-page">
    <div className="game-top"><Progress current={index + 1}/><button className="text-button" onClick={restart}>Terminar</button></div>
    <article className="sentence-prompt"><span className="pill">{current.level} · {current.topic}</span><h1>{current.question}</h1></article>
    <form className="answer-form" onSubmit={(e) => { e.preventDefault(); void check() }}><label htmlFor="sentence-answer">Tu respuesta</label><textarea id="sentence-answer" rows={8} value={text} onChange={(e) => setText(e.target.value)} placeholder="Escribe una respuesta completa en español…"/><div className="textarea-meta"><span>{wordCount} {wordCount === 1 ? 'palabra' : 'palabras'}</span>{wordCount > 0 && wordCount < 8 && <span className="writing-tip">Consejo: intenta desarrollar un poco más tu idea.</span>}</div><Button disabled={!text.trim()}>Revisar mi español</Button></form>
  </div>
}
