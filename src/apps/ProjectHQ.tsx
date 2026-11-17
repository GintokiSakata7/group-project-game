import { useMemo, useState } from 'react';
import { Activity, AlertTriangle, ArrowUpRight, BadgeCheck, CalendarClock, CheckCircle2, CircleDollarSign, Code2, HeartPulse, MessageSquare, Play, ShieldCheck, Sparkles, Target, Users, Zap } from 'lucide-react';
import { useGameStore } from '../game/store';
import type { ActionKind, AppId } from '../game/types';
import { AppHeading, MetricCard, Pill, ProgressBar } from './shared';

export default function ProjectHQ({ openApp }: { openApp: (id: AppId) => void }) {
  const { day, actionsLeft, metrics, employees, tasks, dailyReports, lastAction, performAction, pendingEvent, contractValue, commits, defects } = useGameStore();
  const [action, setAction] = useState<ActionKind>('audit');
  const [target, setTarget] = useState('architecture');
  const pendingTasks = useMemo(() => tasks.filter((task) => task.progress < 100 && task.deliverable).slice(0, 4), [tasks]);
  const openDefects = useMemo(() => defects.filter((defect) => !defect.fixed), [defects]);
  const actionHints: Record<ActionKind, string> = {
    code: 'Personally move a task forward. Progress is real; sleep is optional.',
    motivate: 'Give someone a morale boost. Kunal will consider this a management retreat.',
    pair: 'Work alongside a teammate. Improves progress and quality on their active task.',
    audit: 'Compare an employee’s reported progress with repository evidence.',
    client: 'Send the client a proactive, realistic status update.',
    triage: 'Resolve a defect from the QA queue.',
    investigate: 'Inspect a task and reveal reporting gaps.',
  };
  const actionLabel: Record<ActionKind, string> = {
    code: 'Write code', motivate: 'Motivate teammate', pair: 'Pair program', audit: 'Audit task evidence', client: 'Update client', triage: 'Triage defect', investigate: 'Investigate blocker',
  };
  const handleAction = () => {
    performAction(action, target);
  };

  return <div className="app-scroll">
    <AppHeading kicker={`PROJECT CONTROL · DAY ${day} OF 7`} title="Command Centre" subtitle="Key metrics, sprint pulse and executive actions." right={<Pill tone={actionsLeft > 0 ? 'good' : 'warning'}><Zap size={12} /> {actionsLeft} actions left</Pill>} />
    <div className="hq-banner"><div className="hq-banner-icon"><Target size={20} /></div><div><span>ROYAL FEAST CATERING · CONTRACT RF-001</span><strong>Deliver Phase 1 by Day 7 · Contract value: ₹{contractValue.toLocaleString('en-IN')}</strong></div><div className="deadline-stamp"><b>0{7 - day}</b><small>DAYS LEFT</small></div></div>

    <div className="metric-grid">
      <MetricCard label="VERIFIED PROGRESS" value={`${Math.round(metrics.progress)}%`} note="Deliverable evidence" progress={metrics.progress} tone="lime" />
      <MetricCard label="PRODUCT QUALITY" value={`${Math.round(metrics.quality)}%`} note="Tested codebase" progress={metrics.quality} tone="blue" />
      <MetricCard label="CLIENT TRUST" value={`${Math.round(metrics.clientTrust)}%`} note="Confidence level" progress={metrics.clientTrust} tone="orange" />
      <MetricCard label="TEAM MORALE" value={`${Math.round(metrics.morale)}%`} note="Overall team spirit" progress={metrics.morale} tone="pink" />
    </div>

    <div className="hq-two-col">
      <section className="panel-block"><div className="panel-title-row"><div><h3>Priority Deliverables</h3></div><button className="text-button" onClick={() => openApp('sprint')}>Board <ArrowUpRight size={14} /></button></div>
        <div className="focus-task-list">{pendingTasks.map((task) => <div className="focus-task" key={task.id}><div className={`task-priority priority-${task.priority}`} /><div className="focus-task-main"><strong>{task.title}</strong><small>{task.assignedTo ? employees.find((person) => person.id === task.assignedTo)?.name : 'Unassigned'} · Due D{task.dueDay}</small><ProgressBar value={task.verifiedProgress} tone={task.progress < task.reportedProgress - 15 ? 'warning' : 'default'} /></div><b>{Math.round(task.verifiedProgress)}%</b></div>)}</div>
      </section>
      <section className="panel-block"><div className="panel-title-row"><div><h3>Team Status</h3></div><button className="text-button" onClick={() => openApp('people')}>People <ArrowUpRight size={14} /></button></div>
        <div className="team-pulse-list">{employees.map((person) => <div className="team-pulse" key={person.id}><span className="team-emoji" style={{ background: person.color }}>{person.avatar}</span><span className="team-pulse-name"><strong>{person.name}</strong><small>{person.role}</small></span><Pill tone={person.availability === 'offline' ? 'danger' : person.availability === 'busy' ? 'warning' : 'good'}>{person.availability}</Pill></div>)}</div>
      </section>
    </div>

    <section className="panel-block action-panel"><div className="panel-title-row"><div><h3>Founder Attention</h3><p>Assign management interventions (costs 1 action point).</p></div></div>
      <div className="action-builder"><label className="field-label">ACTION<select value={action} onChange={(event) => setAction(event.target.value as ActionKind)}><option value="audit">Audit task evidence</option><option value="code">Write code yourself</option><option value="pair">Pair program</option><option value="motivate">Motivate teammate</option><option value="client">Update client</option><option value="investigate">Investigate blocker</option><option value="triage">Triage QA defect</option></select></label>
        <label className="field-label">TARGET{action === 'motivate' ? <select value={target} onChange={(event) => setTarget(event.target.value)}>{employees.map((person) => <option key={person.id} value={person.id}>{person.name}</option>)}</select> : action === 'triage' ? <select value={target} onChange={(event) => setTarget(event.target.value)}>{openDefects.map((defect) => <option key={defect.id} value={defect.id}>{defect.title}</option>)}</select> : action === 'client' ? <select value={target} onChange={(event) => setTarget(event.target.value)}><option value="client">Mr. Prakash</option></select> : action === 'pair' ? <select value={target} onChange={(event) => setTarget(event.target.value)}>{employees.filter((person) => tasks.some((task) => task.assignedTo === person.id && task.progress < 100)).map((person) => <option key={person.id} value={person.id}>{person.name}</option>)}</select> : <select value={target} onChange={(event) => setTarget(event.target.value)}>{tasks.filter((task) => task.progress < 100).map((task) => <option key={task.id} value={task.id}>{task.title}</option>)}</select>}</label>
        <div className="action-hint"><Sparkles size={14} />{actionHints[action]}</div><button className="btn-primary" onClick={handleAction} disabled={actionsLeft <= 0 || (action === 'triage' && openDefects.length === 0)}><Zap size={15} /> USE 1 ACTION</button>
      </div>
      {lastAction && <div className="last-action"><CheckCircle2 size={14} /> {lastAction}</div>}
    </section>

    <div className="hq-bottom-grid">
      <button className={`quick-app-card ${pendingEvent ? 'attention-card' : ''}`} onClick={() => openApp('qa')}><div className="quick-app-icon qa-icon"><ShieldCheck size={19} /></div><div><strong>{openDefects.length} open QA defects</strong><small>{openDefects.filter((item) => item.severity === 'critical').length} critical · Review before delivery</small></div><ArrowUpRight size={15} /></button>
      <button className="quick-app-card" onClick={() => openApp('repo')}><div className="quick-app-icon repo-icon"><Code2 size={19} /></div><div><strong>{commits.length} repository commits</strong><small>Inspect claims against evidence</small></div><ArrowUpRight size={15} /></button>
      <button className="quick-app-card" onClick={() => openApp('chat')}><div className="quick-app-icon chat-icon"><MessageSquare size={19} /></div><div><strong>Team chat is active</strong><small>There is always a new “small question”</small></div><ArrowUpRight size={15} /></button>
    </div>
    {dailyReports.length > 0 && <section className="daily-report-strip"><div className="report-icon"><Activity size={17} /></div><div><span className="app-kicker">LAST DAILY REPORT · DAY {dailyReports[dailyReports.length - 1].day}</span><strong>{dailyReports[dailyReports.length - 1].headline}</strong><small>{dailyReports[dailyReports.length - 1].summary}</small></div><div className="report-delta">{dailyReports[dailyReports.length - 1].progressDelta >= 0 ? '+' : ''}{dailyReports[dailyReports.length - 1].progressDelta}%</div></section>}
  </div>;
}
