import { ArrowRight, BookOpen, Feather, Languages, ShieldCheck } from 'lucide-react'
import { Link } from 'react-router-dom'
import { PageHeader } from '../../components/ui'

const cards = [
  { to: '/vocabulario', icon: BookOpen, number: '01', title: 'Vocabulario', text: 'Observa, deduce y escribe la palabra exacta.', meta: '850 palabras · A1–B2', color: 'coral' },
  { to: '/verbos', icon: Languages, number: '02', title: 'Conjugación', text: 'Entrena personas, tiempos y modos a tu ritmo.', meta: '20 verbos · 8 tiempos', color: 'blue' },
  { to: '/frases', icon: Feather, number: '03', title: 'Frases', text: 'Responde preguntas abiertas y revisa tu español.', meta: '60 preguntas · revisión local', color: 'green' },
]

export function Home() {
  return <div className="page home-page">
    <PageHeader title="Español fundamental">
      <p>Elige una actividad breve. Aquí no hay rachas, clasificaciones ni presión.</p>
    </PageHeader>
    <div className="activity-grid">
      {cards.map(({ to, icon: Icon, number, title, text, meta, color }) => <Link className={`activity-card ${color}`} to={to} key={to}>
        <div className="activity-top"><span className="activity-icon"><Icon size={26}/></span><small>{number}</small></div>
        <div><h2>{title}</h2><p>{text}</p></div>
        <div className="activity-meta"><span>{meta}</span><ArrowRight size={20}/></div>
      </Link>)}
    </div>
    <aside className="privacy-note"><ShieldCheck size={21}/><p><strong>Tu práctica se queda aquí.</strong><br/>Las respuestas solo viven en esta pestaña y desaparecen al recargarla.</p></aside>
  </div>
}
