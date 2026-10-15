import type { ButtonHTMLAttributes, PropsWithChildren, ReactNode } from 'react'
import { ChevronLeft } from 'lucide-react'

export function PageHeader({ eyebrow, title, children }: { eyebrow?: string; title: string; children?: ReactNode }) {
  return <header className="page-header">{eyebrow && <p className="eyebrow">{eyebrow}</p>}<h1>{title}</h1>{children}</header>
}

export function Button({ className = '', ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button className={`button ${className}`} {...props} />
}

export function BackButton({ onClick, label = 'Volver' }: { onClick: () => void; label?: string }) {
  return <button type="button" className="back-button" onClick={onClick}><ChevronLeft size={20}/>{label}</button>
}

export function Choice({ active, children, ...props }: PropsWithChildren<{ active: boolean } & ButtonHTMLAttributes<HTMLButtonElement>>) {
  return <button type="button" className={`choice ${active ? 'selected' : ''}`} aria-pressed={active} {...props}>{children}</button>
}

export function Progress({ current, total }: { current: number; total?: number }) {
  return <div className="progress-wrap" aria-label={total ? `Pregunta ${current} de ${total}` : `Pregunta ${current}`}>
    <span>{total ? `${current} / ${total}` : `Pregunta ${current}`}</span>
    {total && <div className="progress"><i style={{ width: `${Math.min(100, current / total * 100)}%` }}/></div>}
  </div>
}

export function ConfirmRestart({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) {
  return <div className="confirm" role="alertdialog" aria-labelledby="reiniciar-titulo">
    <h3 id="reiniciar-titulo">¿Reiniciar esta práctica?</h3><p>Se perderán las respuestas de esta sesión.</p>
    <div className="row"><Button className="secondary" onClick={onCancel}>Seguir practicando</Button><Button className="danger" onClick={onConfirm}>Reiniciar</Button></div>
  </div>
}
