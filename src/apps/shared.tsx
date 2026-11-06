import type { ReactNode } from 'react';
import { ArrowUpRight, CircleDot } from 'lucide-react';

export function AppHeading({ kicker, title, subtitle, right }: { kicker: string; title: string; subtitle?: string; right?: ReactNode }) {
  return <div className="app-heading"><div><div className="app-kicker">{kicker}</div><h2>{title}</h2>{subtitle && <p>{subtitle}</p>}</div>{right && <div className="app-heading-right">{right}</div>}</div>;
}

export function MetricCard({ label, value, note, progress, tone = 'lime' }: { label: string; value: string | number; note: string; progress?: number; tone?: 'lime' | 'blue' | 'orange' | 'pink' }) {
  return <div className={`metric-card metric-${tone}`}><div className="metric-label">{label}</div><strong>{value}</strong><small>{note}</small>{progress !== undefined && <div className="metric-track"><span style={{ width: `${Math.max(0, Math.min(100, progress))}%` }} /></div>}</div>;
}

export function Pill({ children, tone = 'neutral' }: { children: ReactNode; tone?: 'neutral' | 'good' | 'warning' | 'danger' | 'blue' }) {
  return <span className={`pill pill-${tone}`}>{children}</span>;
}

export function ProgressBar({ value, tone = 'default' }: { value: number; tone?: 'default' | 'warning' | 'danger' | 'blue' }) {
  return <div className={`progress-track progress-${tone}`}><span style={{ width: `${Math.max(0, Math.min(100, value))}%` }} /></div>;
}

export function Avatar({ name, emoji, color, size = 'md' }: { name: string; emoji?: string; color?: string; size?: 'sm' | 'md' | 'lg' }) {
  return <span className={`avatar avatar-${size}`} style={{ background: color ?? '#dce5d2' }}>{emoji ?? name.slice(0, 1).toUpperCase()}</span>;
}

export function EmptyState({ icon, title, body }: { icon: ReactNode; title: string; body: string }) {
  return <div className="empty-state"><span>{icon}</span><strong>{title}</strong><p>{body}</p></div>;
}

export function SmallLink({ children, onClick }: { children: ReactNode; onClick?: () => void }) {
  return <button className="small-link" onClick={onClick}>{children}<ArrowUpRight size={13} /></button>;
}

export function DotStatus({ tone = 'green' }: { tone?: 'green' | 'orange' | 'red' | 'gray' }) {
  return <CircleDot className={`dot-status dot-${tone}`} size={11} />;
}
