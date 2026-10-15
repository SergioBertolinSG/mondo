import { BookOpen, Feather, Home as HomeIcon, Languages } from 'lucide-react'
import { NavLink, useLocation } from 'react-router-dom'
import { Home } from '../features/home/Home'
import { Vocabulary } from '../features/vocabulary/Vocabulary'
import { Verbs } from '../features/verbs/Verbs'
import { Sentences } from '../features/sentences/Sentences'

const tabs = [
  { to: '/', label: 'Inicio', icon: HomeIcon },
  { to: '/vocabulario', label: 'Palabras', icon: BookOpen },
  { to: '/verbos', label: 'Verbos', icon: Languages },
  { to: '/frases', label: 'Frases', icon: Feather },
]

export function App() {
  const path = useLocation().pathname
  return <div className="app-shell">
    <header className="topbar">
      <NavLink to="/" className="brand" aria-label="Ir al inicio"><span>ñ</span> Mondo</NavLink>
      <p>Práctica sin cuentas ni registros</p>
    </header>
    <main id="contenido">
      <section hidden={path !== '/'}><Home /></section>
      <section hidden={path !== '/vocabulario'}><Vocabulary /></section>
      <section hidden={path !== '/verbos'}><Verbs /></section>
      <section hidden={path !== '/frases'}><Sentences /></section>
    </main>
    <nav className="bottom-nav" aria-label="Navegación principal">
      {tabs.map(({ to, label, icon: Icon }) => <NavLink key={to} to={to} end={to === '/'} className={({ isActive }) => isActive ? 'active' : ''}>
        <Icon size={21} aria-hidden="true"/><span>{label}</span>
      </NavLink>)}
    </nav>
  </div>
}
