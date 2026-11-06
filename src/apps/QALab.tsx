import { useMemo, useState } from 'react';
import { AlertCircle, Bug, CheckCircle2, Filter, FlaskConical, ShieldAlert, ShieldCheck, Sparkles, Zap } from 'lucide-react';
import { useGameStore } from '../game/store';
import { AppHeading, Pill, ProgressBar } from './shared';

export default function QALab() {
  const { defects, actionsLeft, metrics, performAction, day } = useGameStore();
  const [filter, setFilter] = useState('open');
  const visible = useMemo(() => defects.filter((defect) => filter === 'all' || (filter === 'open' ? !defect.fixed : defect.fixed)), [defects, filter]);
  const open = defects.filter((defect) => !defect.fixed);
  const critical = open.filter((defect) => defect.severity === 'critical').length;
  const severityTone = (severity: string) => severity === 'critical' ? 'danger' : severity === 'major' ? 'warning' : severity === 'minor' ? 'blue' : 'neutral';

  return <div className="app-scroll qa-app">
    <AppHeading kicker={`QUALITY ASSURANCE / RELEASE GATE · DAY ${day}`} title="QA laboratory" subtitle="Meera has already found something. She is deciding how to tell you." right={<Pill tone={critical ? 'danger' : 'good'}>{critical} critical blockers</Pill>} />
    <div className="qa-summary"><div className="qa-score"><span>RELEASE CONFIDENCE</span><strong>{Math.max(0, Math.round(metrics.quality - critical * 13))}%</strong><ProgressBar value={Math.max(0, metrics.quality - critical * 13)} tone={critical ? 'danger' : 'default'} /></div><div className="qa-summary-stat"><Bug size={17} /><strong>{open.length}</strong><small>Open defects</small></div><div className="qa-summary-stat"><ShieldCheck size={17} /><strong>{defects.length - open.length}</strong><small>Resolved</small></div><div className="qa-summary-stat"><Zap size={17} /><strong>{actionsLeft}</strong><small>Actions left</small></div></div>
    <div className="qa-toolbar"><div><span className="app-kicker">DEFECT REGISTER</span><h3>Release blockers & observations</h3></div><div className="qa-filter"><Filter size={13} />{['open', 'fixed', 'all'].map((item) => <button key={item} className={filter === item ? 'active' : ''} onClick={() => setFilter(item)}>{item}</button>)}</div></div>
    <div className="defect-list">{visible.map((defect) => <article className={`defect-card ${defect.fixed ? 'fixed' : ''}`} key={defect.id}><div className={`severity-icon severity-${defect.severity}`}>{defect.fixed ? <CheckCircle2 size={17} /> : defect.severity === 'critical' ? <AlertCircle size={17} /> : <Bug size={17} />}</div><div className="defect-main"><div className="defect-title-row"><strong>{defect.title}</strong><Pill tone={severityTone(defect.severity)}>{defect.severity}</Pill></div><p>{defect.description}</p><div className="defect-meta"><span>{defect.area}</span><span>Reported by {defect.reportedBy}</span><span>Day {defect.discoveredDay}</span></div></div>{defect.fixed ? <Pill tone="good">RESOLVED</Pill> : <button className="fix-button" onClick={() => performAction('triage', defect.id)} disabled={actionsLeft <= 0}>FIX · 1 ACTION</button>}</article>)}</div>
    <div className="qa-tip"><Sparkles size={15} /><span>Release advice: fix critical flows first. A 1px icon alignment issue is not more important than a WhatsApp button that opens nothing.</span></div>
  </div>;
}
