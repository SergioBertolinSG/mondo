import { useMemo, useState } from 'react'
import { AlertCircle, Check, RotateCcw, Search, X } from 'lucide-react'
import { Button, Choice, ConfirmRestart, PageHeader, Progress } from '../../components/ui'
import { makeVerbQuestions, persons, tenses, verbs, type TenseId, type VerbQuestion } from '../../data/conjugations'
import { classifyAnswer, shuffled, type AnswerResult } from '../../utils/answers'

type Stage = 'setup' | 'game' | 'summary'
type Result = { question: VerbQuestion; result: AnswerResult }

export function Verbs() {
  const [stage, setStage] = useState<Stage>('setup')
  const [query, setQuery] = useState('')
  const [selectedVerbs, setSelectedVerbs] = useState<string[]>(['ser','estar','tener','ir'])
  const [selectedTenses, setSelectedTenses] = useState<TenseId[]>(['presente'])
  const [selectedPersons, setSelectedPersons] = useState([0,1,2,3,4,5])
  const [amount, setAmount] = useState<number | 'sin-limite'>(10)
  const [questions, setQuestions] = useState<VerbQuestion[]>([])
  const [index, setIndex] = useState(0)
  const [answer, setAnswer] = useState('')
  const [feedback, setFeedback] = useState<AnswerResult | null>(null)
  const [results, setResults] = useState<Result[]>([])
  const [confirming, setConfirming] = useState(false)
  const filteredVerbs = useMemo(() => verbs.filter((verb) => `${verb.infinitive} ${verb.hint}`.toLowerCase().includes(query.toLowerCase())), [query])
  const possible = makeVerbQuestions(selectedVerbs, selectedTenses, selectedPersons)
  const current = questions[index]

  const toggle = <T,>(items: T[], item: T, setter: (value: T[]) => void) => setter(items.includes(item) ? items.filter((value) => value !== item) : [...items, item])
  function start(custom?: VerbQuestion[]) {
    const pool = shuffled(custom ?? possible)
    const next = custom ? pool : amount === 'sin-limite' ? pool : pool.slice(0, Math.min(amount, pool.length))
    setQuestions(next); setIndex(0); setAnswer(''); setFeedback(null); setResults([]); setStage('game')
  }
  function check() {
    if (!current || !answer.trim() || feedback) return
    const result = classifyAnswer(answer, current.answers)
    setFeedback(result); setResults((old) => [...old, { question: current, result }])
  }
  function next() {
    if (index + 1 >= questions.length) {
      if (amount === 'sin-limite') setQuestions((old) => [...old, shuffled(possible.filter((item) => item !== current))[0]])
      else { setStage('summary'); return }
    }
    setIndex((old) => old + 1); setAnswer(''); setFeedback(null)
  }
  function reset() { setStage('setup'); setQuestions([]); setResults([]); setConfirming(false) }
  const mistakes = results.filter((item) => item.result !== 'correcta').map((item) => item.question)
  const correct = results.filter((item) => item.result === 'correcta').length

  if (stage === 'setup') return <div className="page">
    <PageHeader eyebrow="Práctica 02" title="Conjugación"><p>Combina los verbos, tiempos y personas que quieras entrenar.</p></PageHeader>
    <div className="setup-card verb-setup">
      <fieldset><legend>1. Verbos</legend>
        <div className="setup-actions"><button onClick={() => setSelectedVerbs(verbs.map((verb) => verb.infinitive))}>Seleccionar todos</button><button onClick={() => setSelectedVerbs([])}>Limpiar</button></div>
        <label className="search"><Search size={18}/><span className="sr-only">Buscar verbo</span><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar verbo…"/></label>
        <div className="verb-list">{filteredVerbs.map((verb) => <label key={verb.infinitive} className={selectedVerbs.includes(verb.infinitive) ? 'checked' : ''}>
          <input type="checkbox" checked={selectedVerbs.includes(verb.infinitive)} onChange={() => toggle(selectedVerbs, verb.infinitive, setSelectedVerbs)}/>
          <span><strong>{verb.infinitive}</strong><small>{verb.hint}</small></span><em>{verb.irregular ? 'irregular' : 'regular'}</em>
        </label>)}</div>
      </fieldset>
      <fieldset><legend>2. Tiempos</legend><div className="choice-grid">{tenses.map((tense) => <Choice key={tense.id} active={selectedTenses.includes(tense.id)} onClick={() => toggle(selectedTenses, tense.id, setSelectedTenses)}>{tense.label}</Choice>)}</div></fieldset>
      <fieldset><legend>3. Personas</legend><div className="setup-actions"><button onClick={() => setSelectedPersons([0,1,2,3,4,5])}>Todas</button><button onClick={() => setSelectedPersons((old) => old.filter((item) => item !== 4))}>Excluir vosotros/as</button></div><div className="choice-grid compact">{persons.map((person, i) => <Choice key={person} active={selectedPersons.includes(i)} onClick={() => toggle(selectedPersons, i, setSelectedPersons)}>{person}</Choice>)}</div></fieldset>
      <fieldset><legend>4. Preguntas</legend><div className="choice-row">{([10,20,'sin-limite'] as const).map((value) => <Choice key={value} active={amount === value} onClick={() => setAmount(value)}>{value === 'sin-limite' ? 'Sin límite' : value}</Choice>)}</div></fieldset>
      {!possible.length && <p className="form-error">Elige al menos un verbo, un tiempo y una persona.</p>}
      <Button disabled={!possible.length} onClick={() => start()}>Empezar práctica</Button>
    </div>
  </div>

  if (stage === 'summary') return <div className="page summary-page">
    <span className="summary-mark"><Check size={30}/></span><p className="eyebrow">Sesión terminada</p><h1>{correct} de {results.length}</h1><p>Precisión en las formas practicadas: {results.length ? Math.round(correct / results.length * 100) : 0}%.</p>
    {mistakes.length > 0 && <Button onClick={() => start(mistakes)}><RotateCcw size={18}/> Repetir errores ({mistakes.length})</Button>}<Button className="secondary" onClick={reset}>Nueva configuración</Button>
  </div>

  const tenseLabel = tenses.find((tense) => tense.id === current?.tense)?.label
  return <div className="page game-page">
    <div className="game-top"><Progress current={index + 1} total={amount === 'sin-limite' ? undefined : questions.length}/><button className="text-button" onClick={() => setConfirming(true)}>Reiniciar</button></div>
    {confirming && <ConfirmRestart onConfirm={reset} onCancel={() => setConfirming(false)}/>} 
    {current && <><article className="question-card verb-card"><span className="pill">{tenseLabel}</span><p>Conjuga</p><h2>{current.verb}</h2><div className="person-prompt">{persons[current.personIndex]}</div></article>
      <form className="answer-form" onSubmit={(e) => { e.preventDefault(); feedback ? next() : check() }}><label htmlFor="verb-answer">Forma verbal</label><input id="verb-answer" autoComplete="off" autoCapitalize="none" value={answer} disabled={!!feedback} onChange={(e) => setAnswer(e.target.value)} placeholder="Escribe la conjugación…"/>
        {feedback && <div className={`feedback ${feedback}`} role="status">{feedback === 'correcta' ? <><Check/><div><strong>¡Correcto!</strong><p>{current.answers.join(' / ')}</p></div></> : feedback === 'acento' ? <><AlertCircle/><div><strong>Casi: revisa la tilde.</strong><p>{current.answers.join(' / ')}</p></div></> : <><X/><div><strong>Forma incorrecta.</strong><p>Respuesta: {current.answers.join(' / ')}</p></div></>}</div>}
        <Button disabled={!answer.trim()}>{feedback ? (index + 1 === questions.length && amount !== 'sin-limite' ? 'Ver resultado' : 'Siguiente') : 'Comprobar'}</Button>
      </form></>}
  </div>
}
