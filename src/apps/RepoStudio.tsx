import { useEffect, useMemo, useState } from 'react';
import {
  Activity, AlertCircle, CheckCircle2, ChevronRight, CircleDot, FileCode2,
  GitBranch, GitCommitHorizontal, History, Search, ShieldAlert, Bug, Check, Sparkles, ShieldCheck
} from 'lucide-react';
import { useGameStore } from '../game/store';
import { AppHeading, Pill, ProgressBar } from './shared';
import { sound } from '../game/audio';
import type { CommitRecord } from '../game/types';

const starterFiles = [
  { name: 'src', type: 'folder', path: 'src', description: 'Application source. Varun says the structure is scalable.' },
  { name: 'components', type: 'folder', path: 'src/components', description: 'Reusable interface components and shared visual elements.' },
  { name: 'pages', type: 'folder', path: 'src/pages', description: 'Homepage, catalogue and contact page modules.' },
  { name: 'services', type: 'folder', path: 'src/services', description: 'Client-side service adapters and enquiry integration.' },
  { name: 'Home.tsx', type: 'file', path: 'src/pages/Home.tsx', description: 'Homepage shell, hero section and primary calls to action.' },
  { name: 'ServiceCard.tsx', type: 'file', path: 'src/components/ServiceCard.tsx', description: 'Reusable service and menu catalogue card.' },
  { name: 'contactService.ts', type: 'file', path: 'src/services/contactService.ts', description: 'WhatsApp enquiry URL construction and contact submission flow.' },
  { name: 'package.json', type: 'file', path: 'package.json', description: 'Project dependencies and scripts. Aarav has a complicated relationship with this file.' },
  { name: 'README.md', type: 'file', path: 'README.md', description: 'Setup notes, project assumptions and the current handover checklist.' },
] as const;

const statusIcon = (status: string) => status === 'passed'
  ? <CheckCircle2 size={13} className="text-good" />
  : status === 'failed'
    ? <AlertCircle size={13} className="text-danger" />
    : <CircleDot size={13} className="text-warning" />;

export default function RepoStudio() {
  const { commits, tasks, employees, metrics, day } = useGameStore();
  const [selected, setSelected] = useState<string | null>(commits[commits.length - 1]?.id ?? null);
  const [tab, setTab] = useState<'commits' | 'contributors' | 'files'>('commits');
  const [filter, setFilter] = useState('');
  const [selectedFile, setSelectedFile] = useState('README.md');
  const [flaggedSmells, setFlaggedSmells] = useState<Record<string, boolean>>({});

  const getDiffLines = (commit: CommitRecord) => {
    switch (commit.employeeId) {
      case 'aarav':
        return [
          { num: 1, text: `// Vibe coded at 3:14 AM on Western Railway express`, type: 'comment' },
          { num: 2, text: `import { Samosa3DSpinner } from 'unverified-npm-pack';`, type: 'code', isSmell: true, smell: '142MB unverified dependency' },
          { num: 3, text: `const OrderButton = () => <button onClick={() => console.log('vibes')}>Book</button>;`, type: 'code', isSmell: true, smell: 'Empty console.log click handler' },
          { num: 4, text: `export default OrderButton;`, type: 'code' },
        ];
      case 'varun':
        return [
          { num: 1, text: `// Enterprise Governance Protocol v4.8`, type: 'comment' },
          { num: 2, text: `class AbstractProxySingletonAdapterService extends BaseMesh {}`, type: 'code', isSmell: true, smell: 'Over-engineered microservice abstraction' },
          { num: 3, text: `export const getGateway = () => null; // To be populated in Phase 47`, type: 'code', isSmell: true, smell: 'Null placeholder returns runtime crash' },
        ];
      case 'nikhil':
        return [
          { num: 1, text: `// Western line bus stop fast-commit`, type: 'comment' },
          { num: 2, text: `const DB_SECRET = "railway_platform_wifi_pass";`, type: 'code', isSmell: true, smell: 'Hardcoded secret in public repo' },
          { num: 3, text: `app.post('/api/enquiry', (req, res) => res.status(200).json({ ok: true }));`, type: 'code' },
        ];
      case 'meera':
        return [
          { num: 1, text: `describe('Royal Feast Release Checklist', () => {`, type: 'code' },
          { num: 2, text: `  it('fails build if button width is 142.4px instead of 142.5px', () => {});`, type: 'code', isSmell: true, smell: '0.1px cosmetic test blocking CI/CD' },
          { num: 3, text: `  it('verifies WhatsApp payload schema', () => expect(true).toBe(true));`, type: 'code' },
          { num: 4, text: `});`, type: 'code' },
        ];
      case 'kunal':
      default:
        return [
          { num: 1, text: `// Kunal's official motivation & copy draft`, type: 'comment' },
          { num: 2, text: `export const MOTTO = "We are not just a caterer, we are a vibe";`, type: 'code' },
          { num: 3, text: `// Added 14 flame emojis for cross-functional synergy`, type: 'comment' },
        ];
    }
  };

  const handleFlagSmell = (commitId: string, lineIdx: number, smell: string) => {
    const key = `${commitId}-${lineIdx}`;
    if (flaggedSmells[key]) return;
    sound.playSuccess();
    setFlaggedSmells((prev) => ({ ...prev, [key]: true }));
    useGameStore.setState((s) => ({
      metrics: {
        ...s.metrics,
        technicalDebt: Math.max(0, s.metrics.technicalDebt - 4),
        quality: Math.min(100, s.metrics.quality + 3),
      },
      lastAction: `Flagged code smell: ${smell}. Tech debt decreased!`,
    }));
  };

  useEffect(() => {
    if (commits.length && (!selected || !commits.some((commit) => commit.id === selected))) {
      setSelected(commits[commits.length - 1].id);
    }
  }, [commits, selected]);

  const selectedCommit = commits.find((commit) => commit.id === selected) ?? commits[commits.length - 1];
  const selectedTask = selectedCommit ? tasks.find((task) => task.id === selectedCommit.taskId) : undefined;
  const filteredCommits = useMemo(
    () => [...commits].reverse().filter((commit) => `${commit.employeeName} ${commit.message} ${commit.filesChanged.join(' ')}`.toLowerCase().includes(filter.toLowerCase())),
    [commits, filter],
  );
  const contributorStats = employees.map((employee) => ({
    employee,
    count: commits.filter((commit) => commit.employeeId === employee.id).length,
    additions: commits.filter((commit) => commit.employeeId === employee.id).reduce((sum, commit) => sum + commit.additions, 0),
    verified: tasks.filter((task) => task.assignedTo === employee.id).reduce((sum, task) => sum + task.verifiedProgress, 0),
  }));
  const activeFile = starterFiles.find((file) => file.name === selectedFile || file.path === selectedFile) ?? starterFiles[starterFiles.length - 1];
  const fileCommits = commits.filter((commit) => commit.filesChanged.some((file) => file === activeFile.path || file.endsWith(activeFile.name)));

  return <div className="app-scroll repo-app">
    <AppHeading kicker="SOURCE CONTROL / SIMULATED REPOSITORY" title="Repo Studio" subtitle="Inspect what the team actually shipped. Commit messages are not acceptance criteria." right={<Pill tone="blue"><GitBranch size={12} /> main</Pill>} />
    <div className="repo-summary">
      <div><span className="repo-logo">⌘</span><span><strong>panic-labs / royal-feast-web</strong><small>Private repository · TypeScript · Last activity Day {day}</small></span></div>
      <div className="repo-summary-stats"><span><b>{commits.length}</b> commits</span><span><b>{employees.length}</b> contributors</span><span><b>{Math.round(metrics.technicalDebt)}%</b> tech debt</span></div>
    </div>
    <div className="repo-toolbar">
      <div className="repo-tabs">
        <button className={tab === 'commits' ? 'active' : ''} onClick={() => setTab('commits')}><History size={14} /> Commits</button>
        <button className={tab === 'contributors' ? 'active' : ''} onClick={() => setTab('contributors')}><Activity size={14} /> Contributors</button>
        <button className={tab === 'files' ? 'active' : ''} onClick={() => setTab('files')}><FileCode2 size={14} /> Files</button>
      </div>
      <label className="repo-search"><Search size={13} /><input value={filter} onChange={(event) => setFilter(event.target.value)} placeholder="Search repository" /></label>
    </div>

    {tab === 'commits' && <>
      <div className="repo-audit-strip">
        <div><span className="app-kicker">EVIDENCE CHECK</span><strong>Claims are not commits. Commits are not proof of quality.</strong><small>Open a commit to compare the employee’s reported task progress with verified evidence.</small></div>
        <div className="audit-flag-count"><b>{tasks.filter((task) => task.reportedProgress - task.verifiedProgress > 20).length}</b><span>reporting gaps</span></div>
      </div>
      <div className="repo-commit-layout">
        <section className="commit-list">
          {filteredCommits.length === 0 && <div className="empty-state compact-empty"><GitCommitHorizontal size={25} /><strong>No commits match</strong><p>Try a contributor or commit message.</p></div>}
          {filteredCommits.map((commit) => <button key={commit.id} className={`commit-item ${selected === commit.id ? 'selected' : ''}`} onClick={() => setSelected(commit.id)}>
            <span className="commit-node"><GitCommitHorizontal size={15} /></span>
            <span className="commit-item-body"><strong>{commit.message}</strong><small>{commit.employeeName} · Day {commit.day}, {commit.time}</small><em>{commit.filesChanged[0]}</em></span>
            <span className="commit-health">{statusIcon(commit.buildStatus)}</span>
          </button>)}
        </section>
        <section className="commit-detail">
          {selectedCommit ? <>
            <div className="commit-detail-head"><div><span className="app-kicker">COMMIT DETAIL</span><h3>{selectedCommit.message}</h3><small>{selectedCommit.id}</small></div><Pill tone={selectedCommit.buildStatus === 'passed' ? 'good' : selectedCommit.buildStatus === 'failed' ? 'danger' : 'warning'}>{selectedCommit.buildStatus}</Pill></div>
            <div className="commit-author"><span className="author-dot">{employees.find((item) => item.id === selectedCommit.employeeId)?.avatar ?? 'P'}</span><span><strong>{selectedCommit.employeeName}</strong><small>Committed on Day {selectedCommit.day} at {selectedCommit.time}</small></span></div>
            <p className="commit-description">{selectedCommit.detail}</p>
            <div className="commit-change-stats"><span className="additions">+{selectedCommit.additions} additions</span><span className="deletions">−{selectedCommit.deletions} deletions</span><span>{selectedCommit.filesChanged.length} file changed</span></div>
            {selectedTask && <div className="commit-evidence-card">
              <div className="commit-evidence-heading"><strong>TASK CLAIM VS VERIFIED EVIDENCE</strong><Pill tone={selectedTask.reportedProgress - selectedTask.verifiedProgress > 20 ? 'warning' : 'good'}>{selectedTask.reportedProgress - selectedTask.verifiedProgress > 20 ? 'GAP DETECTED' : 'IN RANGE'}</Pill></div>
              <div className="commit-evidence-values"><span><small>EMPLOYEE CLAIM</small><b>{Math.round(selectedTask.reportedProgress)}%</b></span><span><small>VERIFIED</small><b>{Math.round(selectedTask.verifiedProgress)}%</b></span><span><small>QUALITY</small><b>{Math.round(selectedTask.quality)}%</b></span></div>
              <ProgressBar value={selectedTask.verifiedProgress} tone={selectedTask.reportedProgress - selectedTask.verifiedProgress > 20 ? 'warning' : 'default'} />
              <small className="evidence-caption">Task: {selectedTask.title}. Progress is verified from the simulation’s task evidence, not the employee’s status message.</small>
            </div>}
            <div className="commit-files"><div className="commit-files-title"><strong>Changed files</strong><span>{selectedCommit.filesChanged.length} file(s)</span></div>{selectedCommit.filesChanged.map((file) => <div className="changed-file" key={file}><FileCode2 size={14} /><span>{file}</span><Pill tone="neutral">modified</Pill><ChevronRight size={14} /></div>)}</div>
            <div className="commit-checks"><div><span>BUILD</span>{statusIcon(selectedCommit.buildStatus)}<b>{selectedCommit.buildStatus.replace('_', ' ')}</b></div><div><span>TESTS</span>{statusIcon(selectedCommit.testStatus === 'not_run' ? 'pending' : selectedCommit.testStatus)}<b>{selectedCommit.testStatus.replace('_', ' ')}</b></div><div><span>QUALITY SIGNAL</span><b>{Math.round(selectedCommit.qualitySignal)}%</b></div></div>
            <div className="commit-code-preview">
              <div className="diff-header">
                <div><i /><i /><i /><span>INTERACTIVE CODE REVIEW & DIFF INSPECTOR</span></div>
                <small className="diff-hint">Click & flag suspicious code smells (-4% Tech Debt, +3% Quality)</small>
              </div>
              <div className="interactive-diff-lines">
                {getDiffLines(selectedCommit).map((line, idx) => {
                  const isFlagged = flaggedSmells[`${selectedCommit.id}-${idx}`];
                  return (
                    <div
                      key={idx}
                      className={`diff-line-row ${line.isSmell ? 'has-smell' : ''} ${isFlagged ? 'is-flagged' : ''}`}
                    >
                      <span className="diff-line-num">{line.num}</span>
                      <span className="diff-line-content">{line.text}</span>
                      {line.isSmell && (
                        <div className="diff-action-cell">
                          {isFlagged ? (
                            <span className="diff-flagged-tag"><Check size={11} /> NEUTRALIZED</span>
                          ) : (
                            <button
                              className="diff-flag-btn"
                              onClick={() => handleFlagSmell(selectedCommit.id, idx, line.smell!)}
                              title={`Flag smell: ${line.smell}`}
                            >
                              <Bug size={12} />
                              <span>FLAG SMELL</span>
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </> : <div className="empty-state"><GitCommitHorizontal size={27} /><strong>No contribution selected</strong><p>Team commits will appear here after the first simulated workday.</p></div>}
        </section>
      </div>
    </>}

    {tab === 'contributors' && <div className="contributor-grid">{contributorStats.map(({ employee, count, additions, verified }) => <div className="contributor-card" key={employee.id}><div className="contributor-top"><span className="contributor-avatar" style={{ background: employee.color }}>{employee.avatar}</span><div><strong>{employee.name}</strong><small>{employee.role}</small></div><Pill tone={count > 0 ? 'good' : 'warning'}>{count} commits</Pill></div><div className="contrib-stats"><span><b>{additions}</b><small>lines added</small></span><span><b>{Math.round(verified)}</b><small>assigned task points</small></span></div><ProgressBar value={Math.min(100, verified / 1.8)} /></div>)}</div>}

    {tab === 'files' && <div className="repo-files-panel">
      <div className="file-tree"><div className="file-tree-heading"><span>BRANCH</span><Pill tone="blue">main</Pill></div>
        {starterFiles.map((file) => file.type === 'folder'
          ? <div key={file.path} className="file-tree-row folder" style={{ paddingLeft: 14 }}><span>▸</span>{file.name}</div>
          : <button key={file.path} className={`file-tree-row file ${selectedFile === file.name ? 'selected' : ''}`} style={{ paddingLeft: 34 }} onClick={() => setSelectedFile(file.name)}><span>◈</span>{file.name}</button>)}
      </div>
      <div className="file-readme"><span className="app-kicker">{activeFile.path}</span><h3>{activeFile.name}</h3><p>{activeFile.description}</p><h4>Repository evidence</h4>
        {fileCommits.length ? <ul>{fileCommits.slice(-4).reverse().map((commit) => <li key={commit.id}>Day {commit.day}: {commit.employeeName} — {commit.message} ({commit.buildStatus} build)</li>)}</ul> : <p>No commit currently references this file. A folder existing in the tree is not proof that its feature works.</p>}
        <div className="readme-warning"><ShieldAlert size={16} /> The file tree is a simulated repository snapshot. Select a file to inspect its contribution history.</div>
      </div>
    </div>}
  </div>;
}
