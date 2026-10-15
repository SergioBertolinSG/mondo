import { useMemo, useRef, useState } from 'react'
import { AlertCircle, Check, RotateCcw, Sparkles, X } from 'lucide-react'
import { Button, Choice, ConfirmRestart, PageHeader, Progress } from '../../components/ui'
import { vocabulary, vocabularyCategories, type Level, type VocabularyItem } from '../../data/vocabulary'
import { assessVocabulary, shuffled, type AnswerResult } from '../../utils/answers'

type Stage = 'setup' | 'game' | 'summary'
type Answered = { item: VocabularyItem; result: AnswerResult; answer: string }

export function Vocabulary() {
  const [stage, setStage] = useState<Stage>('setup')
  const [category, setCategory] = useState('Todas')
  const [level, setLevel] = useState<'Todos' | Level>('Todos')
  const [amount, setAmount] = useState<number | 'sin-limite'>(10)
  const [questions, setQuestions] = useState<VocabularyItem[]>([])
  const [index, setIndex] = useState(0)
  const [answer, setAnswer] = useState('')
  const [feedback, setFeedback] = useState<AnswerResult | null>(null)
  const [answered, setAnswered] = useState<Answered[]>([])
  const [confirming, setConfirming] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const available = useMemo(() => vocabulary.filter((item) => (category === 'Todas' || item.category === category) && (level === 'Todos' || item.level === level)), [category, level])
  const current = questions[index]
  const exactAnswer = current ? [current.article, current.spanish].filter(Boolean).join(' ') : ''

  function start(custom?: VocabularyItem[]) {
    const pool = shuffled(custom ?? available)
    setQuestions(amount === 'sin-limite' && !custom ? pool : pool.slice(0, custom ? pool.length : Math.min(amount as number, pool.length)))
    setIndex(0); setAnswered([]); setAnswer(''); setFeedback(null); setStage('game')
  }

  function check() {
    if (!current || !answer.trim() || feedback) return
    const result = assessVocabulary(answer, current)
    setFeedback(result); setAnswered((old) => [...old, { item: current, result, answer }])
  }

  function next() {
    if (index + 1 >= questions.length) {
      if (amount === 'sin-limite') {
        const nextPool = shuffled(available.filter((item) => item.id !== current.id))
        setQuestions((old) => [...old, nextPool[0]])
      } else { setStage('summary'); return }
    }
    setIndex((value) => value + 1); setAnswer(''); setFeedback(null); setTimeout(() => inputRef.current?.focus(), 0)
  }

  function reset() { setStage('setup'); setQuestions([]); setAnswered([]); setConfirming(false) }
  const mistakes = answered.filter((item) => item.result !== 'correcta').map((item) => item.item)
  const correct = answered.filter((item) => item.result === 'correcta').length

  if (stage === 'setup') return <div className="page">
    <PageHeader eyebrow="Práctica 01" title="Vocabulario"><p>Mira la ilustración y usa la pista para encontrar la palabra.</p></PageHeader>
    <div className="setup-card">
      <fieldset><legend>Categoría</legend><select className="select-input" value={category} onChange={(event) => setCategory(event.target.value)} aria-label="Categoría de vocabulario">
        {['Todas', ...vocabularyCategories].map((value) => <option key={value} value={value}>{value === 'Todas' ? 'Todas las categorías' : value}</option>)}
      </select></fieldset>
      <fieldset><legend>Nivel</legend><div className="choice-row">{(['Todos','A1','A2','B1','B2'] as const).map((value) => <Choice active={level === value} onClick={() => setLevel(value)} key={value}>{value}</Choice>)}</div></fieldset>
      <fieldset><legend>Preguntas</legend><div className="choice-row">{([10,20,'sin-limite'] as const).map((value) => <Choice active={amount === value} onClick={() => setAmount(value)} key={value}>{value === 'sin-limite' ? 'Sin límite' : value}</Choice>)}</div></fieldset>
      <div className="availability"><strong>{available.length}</strong> de {vocabulary.length} palabras disponibles.{available.length !== vocabulary.length && <button type="button" onClick={() => { setCategory('Todas'); setLevel('Todos') }}>Ver las 850</button>}</div>
      <Button disabled={!available.length} onClick={() => start()}>Empezar práctica</Button>
    </div>
  </div>

  if (stage === 'summary') return <div className="page summary-page">
    <span className="summary-mark"><Sparkles size={30}/></span><p className="eyebrow">Sesión terminada</p><h1>{correct} de {answered.length}</h1>
    <p>{correct === answered.length ? '¡Todas correctas! Buena precisión.' : 'Has terminado. Revisa los tropiezos mientras siguen frescos.'}</p>
    <div className="score-bar"><i style={{ width: `${answered.length ? correct / answered.length * 100 : 0}%` }}/></div>
    {mistakes.length > 0 && <Button onClick={() => start(mistakes)}><RotateCcw size={18}/> Repetir errores ({mistakes.length})</Button>}
    <Button className="secondary" onClick={reset}>Nueva configuración</Button>
  </div>

  return <div className="page game-page">
    <div className="game-top"><Progress current={index + 1} total={amount === 'sin-limite' ? undefined : questions.length}/><button className="text-button" onClick={() => setConfirming(true)}>Reiniciar</button></div>
    {confirming && <ConfirmRestart onConfirm={reset} onCancel={() => setConfirming(false)}/>} 
    {current && <>
      <article className="question-card vocabulary-card">
        <div className="illustration" role="img" aria-label={`Ilustración relacionada con ${current.clue}`}>{current.illustration}</div>
        <span className="pill">{current.category} · {current.partOfSpeech} · {current.level}</span>
        <h2>{current.clue}</h2>
      </article>
      <form onSubmit={(event) => { event.preventDefault(); feedback ? next() : check() }} className="answer-form">
        <label htmlFor="vocab-answer">Tu palabra</label>
        <input ref={inputRef} id="vocab-answer" autoCapitalize="none" autoComplete="off" value={answer} onChange={(event) => setAnswer(event.target.value)} disabled={!!feedback} placeholder="Escribe en español…"/>
        {feedback && <div className={`feedback ${feedback}`} role="status">
          {feedback === 'correcta' && <><Check/><div><strong>¡Correcto!</strong><p>{exactAnswer}</p></div></>}
          {feedback === 'acento' && <><AlertCircle/><div><strong>La palabra es correcta, pero revisa la tilde.</strong><p>Forma exacta: {exactAnswer}</p></div></>}
          {feedback === 'incorrecta' && <><X/><div><strong>No es esa.</strong><p>La respuesta es {exactAnswer}.</p></div></>}
          {current.example && <small>«{current.example}»</small>}
          {current.sourceUrl && <small><a href={current.sourceUrl} target="_blank" rel="noreferrer">Consultar la entrada en el DLE</a></small>}
        </div>}
        <Button disabled={!answer.trim()}>{feedback ? (index + 1 === questions.length && amount !== 'sin-limite' ? 'Ver resultado' : 'Siguiente') : 'Comprobar'}</Button>
      </form>
    </>}
  </div>
}
