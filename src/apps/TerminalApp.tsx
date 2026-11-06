import { useMemo } from 'react';
import { Activity, AlertTriangle, CheckCircle2, Command, Terminal } from 'lucide-react';
import { useGameStore } from '../game/store';
import { AppHeading, Pill } from './shared';

export default function TerminalApp() {
  const { commits, metrics, day, tasks } = useGameStore();
  const logs = useMemo(() => [
    { time: '08:42:10', tone: 'muted', text: 'ALMOSTOS build monitor v1.0.7' },
    { time: '08:42:11', tone: 'muted', text: 'workspace: panic-labs/royal-feast-web' },
    { time: '08:43:02', tone: 'success', text: 'INFO  project workspace loaded' },
    ...commits.slice(-6).map((commit) => ({ time: commit.time, tone: commit.buildStatus === 'failed' ? 'error' : commit.buildStatus === 'passed' ? 'success' : 'warning', text: `${commit.employeeName.toLowerCase()} :: ${commit.message}` })),
    { time: 'NOW', tone: metrics.technicalDebt > 65 ? 'error' : 'warning', text: `TECH_DEBT=${Math.round(metrics.technicalDebt)}  QUALITY=${Math.round(metrics.quality)}  DAY=${day}/7` },
    { time: 'NOW', tone: metrics.technicalDebt > 70 ? 'error' : 'muted', text: metrics.technicalDebt > 70 ? 'WARN  project stability is deteriorating' : 'INFO  awaiting next build event...' },
  ], [commits, metrics, day]);
  return <div className="app-scroll terminal-app"><AppHeading kicker="DEVELOPMENT ENVIRONMENT / READ-ONLY" title="Build monitor" subtitle="You do not need to type code here. You need to understand why it failed." right={<Pill tone={metrics.technicalDebt > 65 ? 'danger' : 'good'}><Activity size={12} /> {metrics.technicalDebt > 65 ? 'Unstable' : 'Monitoring'}</Pill>} /><div className="terminal-toolbar"><span><i /><i /><i /></span><small>panic-labs@almostos: ~/royal-feast</small><Command size={14} /></div><div className="terminal-screen"><div className="terminal-welcome">ALMOSTOS BUILD MONITOR <span>v1.0.7</span></div><div className="terminal-caption">Read-only simulated output · Day {day} · Repository commits: {commits.length}</div>{logs.map((log, index) => <div className={`terminal-line ${log.tone}`} key={`${log.time}-${index}`}><time>[{log.time}]</time><span>{log.text}</span></div>)}<div className="terminal-prompt"><span>founder@panic-labs:~$</span><i /></div></div><div className="terminal-bottom"><div><span>TRACKED TASKS</span><strong>{tasks.length}</strong></div><div><span>FAILED BUILDS</span><strong>{commits.filter((commit) => commit.buildStatus === 'failed').length}</strong></div><div><span>TECH DEBT</span><strong>{Math.round(metrics.technicalDebt)}%</strong></div></div></div>;
}
