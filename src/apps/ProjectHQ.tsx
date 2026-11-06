import { useMemo, useState } from 'react';
import {
  Activity, AlertTriangle, ArrowUpRight, BadgeCheck, CalendarClock, CheckCircle2,
  CircleDollarSign, Code2, HeartPulse, MessageSquare, Play, ShieldCheck, Sparkles,
  Target, Users, Zap, Check, Eye, Coffee, PhoneCall
} from 'lucide-react';
import { useGameStore } from '../game/store';
import type { ActionKind, AppId } from '../game/types';
import { AppHeading, MetricCard, Pill, ProgressBar } from './shared';

interface ActionOption {
  id: ActionKind;
  icon: string;
  title: string;
  subtitle: string;
  quote: string;
}

const actionOptions: ActionOption[] = [
  { id: 'code', icon: '💻', title: 'Code Yourself', subtitle: 'Advance an active task personally.', quote: 'Progress is real. Sleep is optional.' },
  { id: 'audit', icon: '🔍', title: 'Audit Git Claims', subtitle: 'Compare claimed progress with repo commits.', quote: 'Trust, but check the actual commit log.' },
  { id: 'pair', icon: '🤝', title: 'Pair Program', subtitle: 'Work alongside a teammate to boost quality.', quote: 'Sit next to them so they don’t commit to main.' },
  { id: 'motivate', icon: '☕', title: 'Wellness Sync', subtitle: 'Kunal’s favorite. Boost team morale.', quote: '“Good morning legends! I made a playlist!”' },
  { id: 'client', icon: '📞', title: 'Client Status Call', subtitle: 'Proactive update to keep trust high.', quote: 'Shield Mr. Prakash from Bunty’s 2 AM ideas.' },
  { id: 'triage', icon: '🐛', title: 'Triage Defect', subtitle: 'Fix a release blocker from QA Lab.', quote: 'Convince Meera the button is emotionally ready.' },
];

export default function ProjectHQ({ openApp }: { openApp: (id: AppId) => void }) {
  const {
    day, actionsLeft, metrics, employees, tasks, dailyReports,
    lastAction, performAction, pendingEvent, contractValue, commits, defects
  } = useGameStore();

  const [selectedAction, setSelectedAction] = useState<ActionKind>('code');
  const [target, setTarget] = useState('homepage');

  const pendingTasks = useMemo(() => tasks.filter((task) => task.progress < 100 && task.deliverable).slice(0, 4), [tasks]);
  const openDefects = useMemo(() => defects.filter((defect) => !defect.fixed), [defects]);

  const activeOption = actionOptions.find((o) => o.id === selectedAction) || actionOptions[0];

  const handleAction = () => {
    performAction(selectedAction, target);
  };

  return (
    <div className="app-scroll">
      <AppHeading
        kicker={`PANIC LABS · DAY 0${day} OF 07`}
        title="Project Command Centre"
        subtitle="Live project pulse. The optimistic version is in the client chat."
        right={
          <Pill tone={actionsLeft > 0 ? 'good' : 'warning'}>
            ⚡ {actionsLeft} Management Actions Left Today
          </Pill>
        }
      />

      {/* Main Campaign Banner */}
      <div className="hq-banner">
        <div className="hq-banner-icon">
          <Target size={24} />
        </div>
        <div>
          <span>ACTIVE CONTRACT · ROYAL FEAST CATERING</span>
          <strong>Ship the website. Keep the client happy. Prevent the team from imploding.</strong>
          <small>
            Delivery Deadline: Day 7, 6:00 PM · Total Contract: ₹{contractValue.toLocaleString('en-IN')} (50% in bank)
          </small>
        </div>
        <div className="deadline-stamp">
          <b>0{Math.max(0, 7 - day)}</b>
          <small>DAYS LEFT</small>
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="metric-grid">
        <MetricCard
          label="VERIFIED PROGRESS"
          value={`${Math.round(metrics.progress)}%`}
          note="Proven by repo commits"
          progress={metrics.progress}
          tone="lime"
        />
        <MetricCard
          label="PRODUCT QUALITY"
          value={`${Math.round(metrics.quality)}%`}
          note="Build stability & tests"
          progress={metrics.quality}
          tone="blue"
        />
        <MetricCard
          label="CLIENT TRUST"
          value={`${Math.round(metrics.clientTrust)}%`}
          note="One Bunty audio note away"
          progress={metrics.clientTrust}
          tone="orange"
        />
        <MetricCard
          label="TEAM MORALE"
          value={`${Math.round(metrics.morale)}%`}
          note="Kunal claims it is 110%"
          progress={metrics.morale}
          tone="pink"
        />
      </div>

      {/* Interactive Founder Action Deck */}
      <section className="panel-block action-panel">
        <div className="panel-title-row">
          <div>
            <span className="app-kicker">FOUNDER INTERVENTIONS</span>
            <h3>Spend Your Management Attention</h3>
            <p>Observing is free. Interventions consume 1 management action point.</p>
          </div>
          <div className="action-counter">
            <Zap size={16} /> {actionsLeft} / 3 Actions
          </div>
        </div>

        {/* Action Type Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px', marginTop: '16px' }}>
          {actionOptions.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setSelectedAction(opt.id)}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '6px',
                padding: '12px 14px', borderRadius: '10px', border: '1px solid',
                borderColor: selectedAction === opt.id ? '#88a741' : '#dedbd0',
                background: selectedAction === opt.id ? '#f4f8e7' : '#fffefa',
                boxShadow: selectedAction === opt.id ? 'inset 3px 0 #88a741' : 'none',
                textAlign: 'left', transition: 'all .15s'
              }}
            >
              <span style={{ fontSize: '20px' }}>{opt.icon}</span>
              <strong style={{ fontSize: '13px', color: '#1e2821', fontWeight: 850 }}>{opt.title}</strong>
              <small style={{ fontSize: '11px', color: '#747f73', lineHeight: 1.3 }}>{opt.subtitle}</small>
            </button>
          ))}
        </div>

        {/* Action Target Selector & Trigger */}
        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '14px', marginTop: '18px', padding: '16px', background: '#f5f4ec', borderRadius: '10px', border: '1px solid #dedbd0' }}>
          <div style={{ flex: '1', minWidth: '220px' }}>
            <span style={{ display: 'block', fontSize: '11px', fontWeight: 900, color: '#7b8777', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: '6px' }}>
              Select Target For {activeOption.title}:
            </span>

            {selectedAction === 'motivate' ? (
              <select
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                style={{ width: '100%', height: '42px', padding: '0 12px', borderRadius: '8px', border: '1px solid #dedcd0', background: '#fff', fontSize: '14px', color: '#273329' }}
              >
                {employees.map((p) => (
                  <option key={p.id} value={p.id}>{p.avatar} {p.name} ({p.role})</option>
                ))}
              </select>
            ) : selectedAction === 'triage' ? (
              <select
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                style={{ width: '100%', height: '42px', padding: '0 12px', borderRadius: '8px', border: '1px solid #dedcd0', background: '#fff', fontSize: '14px', color: '#273329' }}
              >
                {openDefects.length === 0 ? (
                  <option value="">No open defects reported!</option>
                ) : (
                  openDefects.map((d) => (
                    <option key={d.id} value={d.id}>[{d.severity.toUpperCase()}] {d.title}</option>
                  ))
                )}
              </select>
            ) : selectedAction === 'client' ? (
              <select
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                style={{ width: '100%', height: '42px', padding: '0 12px', borderRadius: '8px', border: '1px solid #dedcd0', background: '#fff', fontSize: '14px', color: '#273329' }}
              >
                <option value="client">👨🏻‍💼 Mr. Prakash (Royal Feast Catering)</option>
              </select>
            ) : selectedAction === 'pair' ? (
              <select
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                style={{ width: '100%', height: '42px', padding: '0 12px', borderRadius: '8px', border: '1px solid #dedcd0', background: '#fff', fontSize: '14px', color: '#273329' }}
              >
                {employees.map((p) => (
                  <option key={p.id} value={p.id}>{p.avatar} {p.name} — active task</option>
                ))}
              </select>
            ) : (
              <select
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                style={{ width: '100%', height: '42px', padding: '0 12px', borderRadius: '8px', border: '1px solid #dedcd0', background: '#fff', fontSize: '14px', color: '#273329' }}
              >
                {tasks.filter((t) => t.progress < 100).map((t) => (
                  <option key={t.id} value={t.id}>[{t.priority.toUpperCase()}] {t.title} ({t.progress}% done)</option>
                ))}
              </select>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span style={{ fontSize: '12px', color: '#687760', fontStyle: 'italic' }}>
              💡 {activeOption.quote}
            </span>
            <button
              className="btn-primary"
              onClick={handleAction}
              disabled={actionsLeft <= 0 || (selectedAction === 'triage' && openDefects.length === 0)}
              style={{ minHeight: '42px' }}
            >
              <Zap size={16} /> EXECUTE ACTION (-1 POINT)
            </button>
          </div>
        </div>

        {lastAction && (
          <div className="last-action" style={{ marginTop: '14px' }}>
            <CheckCircle2 size={16} /> {lastAction}
          </div>
        )}
      </section>

      {/* Two Column: Sprint Watch & Team Pulse */}
      <div className="hq-two-col">
        <section className="panel-block">
          <div className="panel-title-row">
            <div>
              <span className="app-kicker">SPRINT DELIVERABLES</span>
              <h3>Active Deliverables</h3>
            </div>
            <button className="text-button" onClick={() => openApp('sprint')}>
              Sprint Board <ArrowUpRight size={15} />
            </button>
          </div>
          <div className="focus-task-list">
            {pendingTasks.map((task) => (
              <div className="focus-task" key={task.id}>
                <div className={`task-priority priority-${task.priority}`} />
                <div className="focus-task-main">
                  <strong>{task.title}</strong>
                  <small>
                    {task.assignedTo ? employees.find((p) => p.id === task.assignedTo)?.name : 'Unassigned'} · Due Day {task.dueDay}
                  </small>
                  <ProgressBar
                    value={task.verifiedProgress}
                    tone={task.progress < task.reportedProgress - 15 ? 'warning' : 'default'}
                  />
                </div>
                <b>{Math.round(task.verifiedProgress)}%</b>
              </div>
            ))}
          </div>
        </section>

        <section className="panel-block">
          <div className="panel-title-row">
            <div>
              <span className="app-kicker">TEAM STATUS</span>
              <h3>Who Is Actually Working?</h3>
            </div>
            <button className="text-button" onClick={() => openApp('people')}>
              People App <ArrowUpRight size={15} />
            </button>
          </div>
          <div className="team-pulse-list">
            {employees.map((person) => (
              <div className="team-pulse" key={person.id}>
                <span className="team-emoji" style={{ background: person.color }}>
                  {person.avatar}
                </span>
                <div className="team-pulse-name">
                  <strong>{person.name}</strong>
                  <small>{person.title}</small>
                </div>
                <Pill tone={person.availability === 'offline' ? 'danger' : person.availability === 'busy' ? 'warning' : 'good'}>
                  {person.availability}
                </Pill>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Quick App Jump Cards */}
      <div className="hq-bottom-grid">
        <button className={`quick-app-card ${openDefects.length > 0 ? 'attention-card' : ''}`} onClick={() => openApp('qa')}>
          <div className="quick-app-icon qa-icon">
            <ShieldCheck size={22} />
          </div>
          <div>
            <strong>{openDefects.length} Open QA Defects</strong>
            <small>{openDefects.filter((i) => i.severity === 'critical').length} critical · Meera has notes</small>
          </div>
          <ArrowUpRight size={16} />
        </button>

        <button className="quick-app-card" onClick={() => openApp('repo')}>
          <div className="quick-app-icon repo-icon">
            <Code2 size={22} />
          </div>
          <div>
            <strong>{commits.length} Git Commits In Repo</strong>
            <small>Inspect Aarav & Varun's claims</small>
          </div>
          <ArrowUpRight size={16} />
        </button>

        <button className="quick-app-card" onClick={() => openApp('chat')}>
          <div className="quick-app-icon chat-icon">
            <MessageSquare size={22} />
          </div>
          <div>
            <strong>Team Chat Active</strong>
            <small>Kunal sent another playlist</small>
          </div>
          <ArrowUpRight size={16} />
        </button>
      </div>

      {dailyReports.length > 0 && (
        <section className="daily-report-strip" style={{ marginTop: '16px' }}>
          <div className="report-icon">
            <Activity size={20} />
          </div>
          <div>
            <span className="app-kicker">LAST DAILY REPORT · DAY 0{dailyReports[dailyReports.length - 1].day}</span>
            <strong>{dailyReports[dailyReports.length - 1].headline}</strong>
            <small>{dailyReports[dailyReports.length - 1].summary}</small>
          </div>
          <div className="report-delta">
            {dailyReports[dailyReports.length - 1].progressDelta >= 0 ? '+' : ''}
            {dailyReports[dailyReports.length - 1].progressDelta}%
          </div>
        </section>
      )}
    </div>
  );
}
