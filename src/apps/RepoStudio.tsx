import { useEffect, useMemo, useState } from 'react';
import {
  Activity, AlertCircle, CheckCircle2, ChevronRight, CircleDot, FileCode2,
  GitBranch, GitCommitHorizontal, History, Search, ShieldAlert, Bug, Check,
  Folder, FolderOpen, FileText, Code2, Copy, Sparkles, User, Terminal, Eye
} from 'lucide-react';
import { useGameStore } from '../game/store';
import { AppHeading, Pill, ProgressBar } from './shared';
import { sound } from '../game/audio';
import type { CommitRecord } from '../game/types';
import ActiveMissionHUD from '../components/ActiveMissionHUD';

interface CodeLine {
  num: number;
  text: string;
  type: 'code' | 'comment' | 'import' | 'smell';
  smellDetail?: string;
}

interface RepoFile {
  name: string;
  path: string;
  folder: string;
  lang: 'tsx' | 'ts' | 'json' | 'md';
  author: string;
  authorRole: string;
  size: string;
  lines: number;
  description: string;
  content: CodeLine[];
}

const fileRegistry: Record<string, RepoFile> = {
  'Home.tsx': {
    name: 'Home.tsx',
    path: 'src/pages/Home.tsx',
    folder: 'src/pages',
    lang: 'tsx',
    author: 'Aarav (Frontend Developer)',
    authorRole: 'Full-Stack Vibe Coder',
    size: '3.4 KB',
    lines: 28,
    description: 'Homepage shell, hero banner, interactive biryani booking and responsive container.',
    content: [
      { num: 1, text: `import React, { useState } from 'react';`, type: 'import' },
      { num: 2, text: `// Aarav: whole frontend basically done. 14 divs added. CSS coming tomorrow bro ->`, type: 'comment' },
      { num: 3, text: `import { Samosa3DSpinner } from 'unverified-npm-pack';`, type: 'smell', smellDetail: '142MB unverified dependency slows client load by 4 seconds' },
      { num: 4, text: `import { WhatsAppOrderModal } from '../components/WhatsAppModal';`, type: 'import' },
      { num: 5, text: ``, type: 'code' },
      { num: 6, text: `export const RoyalFeastHome = () => {`, type: 'code' },
      { num: 7, text: `  const [isOrdering, setIsOrdering] = useState(false);`, type: 'code' },
      { num: 8, text: ``, type: 'code' },
      { num: 9, text: `  const handleOrderClick = () => {`, type: 'code' },
      { num: 10, text: `    // Meera: this is literally broken. window.openWhatsAppEnquiry is undefined.`, type: 'comment' },
      { num: 11, text: `    // Aarav: it's a spiritual placeholder bro!`, type: 'comment' },
      { num: 12, text: `    if (typeof (window as any).openWhatsAppEnquiry === 'function') {`, type: 'code' },
      { num: 13, text: `      (window as any).openWhatsAppEnquiry();`, type: 'code' },
      { num: 14, text: `    } else {`, type: 'code' },
      { num: 15, text: `      alert("window.openWhatsAppEnquiry is a spiritual placeholder");`, type: 'smell', smellDetail: 'Broken placeholder runtime alert executes on client click' },
      { num: 16, text: `    }`, type: 'code' },
      { num: 17, text: `  };`, type: 'code' },
      { num: 18, text: ``, type: 'code' },
      { num: 19, text: `  return (`, type: 'code' },
      { num: 20, text: `    <div className="royal-feast-container bg-rainbow-vibes animate-spin-slow">`, type: 'code' },
      { num: 21, text: `      <header className="hero-banner flex items-center justify-between">`, type: 'code' },
      { num: 22, text: `        <h1 className="text-8xl font-black text-gold">ROYAL FEAST CATERING</h1>`, type: 'code' },
      { num: 23, text: `        <p className="subtitle">Authentic Mughlai & Hyderabadi Catering for Weddings</p>`, type: 'code' },
      { num: 24, text: `      </header>`, type: 'code' },
      { num: 25, text: `      {/* TODO: replace missing biryani-hero.jpg before Prakash Uncle sees */} `, type: 'comment' },
      { num: 26, text: `      <div className="broken-img-box">[IMAGE NOT FOUND: biryani-hero.jpg]</div>`, type: 'smell', smellDetail: 'Missing hero asset placeholder visible to client' },
      { num: 27, text: `      <button onClick={handleOrderClick} className="btn-glow">Book Wedding Catering</button>`, type: 'code' },
      { num: 28, text: `    </div>`, type: 'code' },
      { num: 29, text: `  );`, type: 'code' },
      { num: 30, text: `};`, type: 'code' },
    ],
  },
  'contactService.ts': {
    name: 'contactService.ts',
    path: 'src/services/contactService.ts',
    folder: 'src/services',
    lang: 'ts',
    author: 'Nikhil (Backend Developer)',
    authorRole: 'Backend Developer',
    size: '1.8 KB',
    lines: 22,
    description: 'WhatsApp enquiry URL construction, mobile validation and contact submission flow.',
    content: [
      { num: 1, text: `// Royal Feast Contact & WhatsApp Enquiry Dispatcher`, type: 'comment' },
      { num: 2, text: `// Last edited: Nikhil (during Western Line signal halt)`, type: 'comment' },
      { num: 3, text: `const CLIENT_PHONE = "9198200XXXXX";`, type: 'code' },
      { num: 4, text: `const BUNTY_SECRET_DISCOUNT = "BUNTY_WEB4_FREE_SAMOSA";`, type: 'smell', smellDetail: 'Unauthorized 100% discount promo code hardcoded in client build' },
      { num: 5, text: ``, type: 'code' },
      { num: 6, text: `export interface CateringEnquiry {`, type: 'code' },
      { num: 7, text: `  clientName: string;`, type: 'code' },
      { num: 8, text: `  guestCount: number;`, type: 'code' },
      { num: 9, text: `  biryaniType: 'Lucknowi' | 'Hyderabadi' | 'Dum Pukht';`, type: 'code' },
      { num: 10, text: `}`, type: 'code' },
      { num: 11, text: ``, type: 'code' },
      { num: 12, text: `export function buildWhatsAppEnquiryUrl(enquiry: CateringEnquiry): string {`, type: 'code' },
      { num: 13, text: `  const text = encodeURIComponent(`, type: 'code' },
      { num: 14, text: `    \`Namaste Mr. Prakash! Enquiry for \${enquiry.guestCount} guests. Menu: \${enquiry.biryaniType}.\``, type: 'code' },
      { num: 15, text: `  );`, type: 'code' },
      { num: 16, text: `  return \`https://wa.me/\${CLIENT_PHONE}?text=\${text}\`;`, type: 'code' },
      { num: 17, text: `}`, type: 'code' },
      { num: 18, text: ``, type: 'code' },
      { num: 19, text: `export async function submitEnquiry(enquiry: CateringEnquiry) {`, type: 'code' },
      { num: 20, text: `  // TODO: connect to real Postgres database when Nikhil reaches office`, type: 'comment' },
      { num: 21, text: `  return { success: true, fakeToken: "mock-tx-774" };`, type: 'code' },
      { num: 22, text: `}`, type: 'code' },
    ],
  },
  'ServiceCard.tsx': {
    name: 'ServiceCard.tsx',
    path: 'src/components/ServiceCard.tsx',
    folder: 'src/components',
    lang: 'tsx',
    author: 'Varun (Technical Lead)',
    authorRole: 'Technical Lead',
    size: '2.1 KB',
    lines: 16,
    description: 'Reusable service and menu catalogue card component with polymorphic props.',
    content: [
      { num: 1, text: `import React from 'react';`, type: 'import' },
      { num: 2, text: `// Varun: card component implements 4 levels of polymorphic abstraction`, type: 'comment' },
      { num: 3, text: `interface AbstractCardEntityContract<T> { data: T; }`, type: 'smell', smellDetail: 'Over-engineered generic contract for a simple 3-line catalogue card' },
      { num: 4, text: ``, type: 'code' },
      { num: 5, text: `export const ServiceCard = ({ title, price, isPopular }: any) => {`, type: 'code' },
      { num: 6, text: `  return (`, type: 'code' },
      { num: 7, text: `    <article className="menu-card hover:scale-105 transition-all">`, type: 'code' },
      { num: 8, text: `      {isPopular && <span className="badge">🔥 KUNAL'S TOP PICK</span>}`, type: 'code' },
      { num: 9, text: `      <h3>{title}</h3>`, type: 'code' },
      { num: 10, text: `      <div className="price-tag">₹{price} / plate</div>`, type: 'code' },
      { num: 11, text: `      <p className="desc">Cooked in pure desi ghee over slow dum tandoor.</p>`, type: 'code' },
      { num: 12, text: `    </article>`, type: 'code' },
      { num: 13, text: `  );`, type: 'code' },
      { num: 14, text: `};`, type: 'code' },
    ],
  },
  'package.json': {
    name: 'package.json',
    path: 'package.json',
    folder: 'root',
    lang: 'json',
    author: 'Aarav (Frontend Developer)',
    authorRole: 'Full-Stack Vibe Coder',
    size: '890 B',
    lines: 18,
    description: 'Project dependencies, build scripts and tooling configuration.',
    content: [
      { num: 1, text: `{`, type: 'code' },
      { num: 2, text: `  "name": "royal-feast-digital",`, type: 'code' },
      { num: 3, text: `  "version": "0.1.0-alpha.vibe",`, type: 'code' },
      { num: 4, text: `  "private": true,`, type: 'code' },
      { num: 5, text: `  "dependencies": {`, type: 'code' },
      { num: 6, text: `    "react": "^19.0.0",`, type: 'code' },
      { num: 7, text: `    "framer-motion": "^12.0.0",`, type: 'code' },
      { num: 8, text: `    "lucide-react": "^0.470.0",`, type: 'code' },
      { num: 9, text: `    "unverified-3d-samosa-engine": "^9.9.9",`, type: 'smell', smellDetail: 'Unvetted 142MB package imported for 1 spinning triangle' },
      { num: 10, text: `    "is-even": "^0.1.2",`, type: 'smell', smellDetail: 'Redundant micro-dependency adds unnecessary supply chain risk' },
      { num: 11, text: `    "chai-timer": "^1.0.4"`, type: 'code' },
      { num: 12, text: `  },`, type: 'code' },
      { num: 13, text: `  "scripts": {`, type: 'code' },
      { num: 14, text: `    "dev": "vite --port 3000",`, type: 'code' },
      { num: 15, text: `    "build": "echo 'Manifesting build...' && vite build",`, type: 'code' },
      { num: 16, text: `    "lint": "echo 'ESLint disabled for team morale'"`, type: 'smell', smellDetail: 'ESLint bypassed completely in package build script' },
      { num: 17, text: `  }`, type: 'code' },
      { num: 18, text: `}`, type: 'code' },
    ],
  },
  'README.md': {
    name: 'README.md',
    path: 'README.md',
    folder: 'root',
    lang: 'md',
    author: 'Varun (Technical Lead)',
    authorRole: 'Technical Lead',
    size: '1.2 KB',
    lines: 16,
    description: 'Setup notes, client requirements, sprint assumptions and scope boundaries.',
    content: [
      { num: 1, text: `# 👑 Royal Feast Digital (Phase 1)`, type: 'comment' },
      { num: 2, text: `**Client:** Mr. Prakash (Royal Feast Catering)`, type: 'code' },
      { num: 3, text: `**Budget:** ₹5,000 (Advance: ₹2,500 received)`, type: 'code' },
      { num: 4, text: `**Deadline:** 7 Days Strict Handover`, type: 'code' },
      { num: 5, text: ``, type: 'code' },
      { num: 6, text: `### 🎯 Core Scope Deliverables:`, type: 'comment' },
      { num: 7, text: `- [x] Responsive wedding menu catalogue (Veg & Non-Veg)`, type: 'code' },
      { num: 8, text: `- [ ] WhatsApp enquiry booking integration`, type: 'code' },
      { num: 9, text: `- [ ] SEO meta tags for Mumbai & Navi Mumbai catering`, type: 'code' },
      { num: 10, text: `- [ ] Zero broken links or missing hero images`, type: 'code' },
      { num: 11, text: ``, type: 'code' },
      { num: 12, text: `### 🛑 Out-of-Scope (Bunty containment policy):`, type: 'comment' },
      { num: 13, text: `- [ ] Web4 Shahi Paneer crypto token`, type: 'code' },
      { num: 14, text: `- [ ] Metaverse wedding banquet hall`, type: 'code' },
      { num: 15, text: `- [ ] Amitabh Bachchan AI voice bot for samosas`, type: 'code' },
    ],
  },
  'sanity.test.ts': {
    name: 'sanity.test.ts',
    path: 'tests/sanity.test.ts',
    folder: 'tests',
    lang: 'ts',
    author: 'Meera (Quality Assurance)',
    authorRole: 'Quality Assurance',
    size: '1.4 KB',
    lines: 14,
    description: 'Automated test suite checking pixel margins and blocker containment.',
    content: [
      { num: 1, text: `import { describe, it, expect } from 'vitest';`, type: 'import' },
      { num: 2, text: `// Meera's unyielding quality gate for Day 1 release`, type: 'comment' },
      { num: 3, text: `describe('Royal Feast Release Gate', () => {`, type: 'code' },
      { num: 4, text: `  it('blocks release if button width is 142.4px instead of 142.5px', () => {`, type: 'smell', smellDetail: '0.1px cosmetic check blocking CI/CD deployment pipeline' },
      { num: 5, text: `    expect(142.4).toBe(142.5);`, type: 'code' },
      { num: 6, text: `  });`, type: 'code' },
      { num: 7, text: ``, type: 'code' },
      { num: 8, text: `  it('ensures WhatsApp enquiry is a real function not a spiritual placeholder', () => {`, type: 'code' },
      { num: 9, text: `    const isSpiritual = false;`, type: 'code' },
      { num: 10, text: `    expect(isSpiritual).toBe(false);`, type: 'code' },
      { num: 11, text: `  });`, type: 'code' },
      { num: 12, text: `});`, type: 'code' },
    ],
  },
};

const statusIcon = (status: string) => status === 'passed'
  ? <CheckCircle2 size={13} className="text-good" />
  : status === 'failed'
    ? <AlertCircle size={13} className="text-danger" />
    : <CircleDot size={13} className="text-warning" />;

export default function RepoStudio() {
  const { commits, tasks, employees, metrics, day } = useGameStore();
  const [selectedCommitId, setSelectedCommitId] = useState<string | null>(commits[commits.length - 1]?.id ?? null);
  const initialTab = ((typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('repotab') : null) as any) || 'files';
  const [tab, setTab] = useState<'commits' | 'contributors' | 'files'>(initialTab);
  const [filter, setFilter] = useState('');
  const [selectedFileName, setSelectedFileName] = useState<string>('Home.tsx');
  const [fileMode, setFileMode] = useState<'code' | 'evidence'>('code');
  const [flaggedSmells, setFlaggedSmells] = useState<Record<string, boolean>>({});
  const [openFolders, setOpenFolders] = useState<Record<string, boolean>>({
    'src/pages': true,
    'src/services': true,
    'src/components': true,
    'tests': true,
    'root': true,
  });

  const activeFile = fileRegistry[selectedFileName] || fileRegistry['Home.tsx'];

  const toggleFolder = (folderKey: string) => {
    setOpenFolders((prev) => ({ ...prev, [folderKey]: !prev[folderKey] }));
  };

  const handleFlagSmell = (key: string, smellDetail: string) => {
    if (flaggedSmells[key]) return;
    sound.playSuccess();
    setFlaggedSmells((prev) => ({ ...prev, [key]: true }));
    useGameStore.setState((s) => ({
      metrics: {
        ...s.metrics,
        technicalDebt: Math.max(0, s.metrics.technicalDebt - 4),
        quality: Math.min(100, s.metrics.quality + 3),
      },
      lastAction: `Neutralized code smell: ${smellDetail}. Tech debt -4%, Quality +3%!`,
    }));
  };

  useEffect(() => {
    if (commits.length && (!selectedCommitId || !commits.some((commit) => commit.id === selectedCommitId))) {
      setSelectedCommitId(commits[commits.length - 1].id);
    }
  }, [commits, selectedCommitId]);

  const selectedCommit = commits.find((commit) => commit.id === selectedCommitId) ?? commits[commits.length - 1];
  const selectedTask = selectedCommit ? tasks.find((task) => task.id === selectedCommit.taskId) : undefined;

  const filteredCommits = useMemo(
    () => [...commits].reverse().filter((commit) =>
      `${commit.employeeName} ${commit.message} ${commit.filesChanged.join(' ')}`.toLowerCase().includes(filter.toLowerCase())
    ),
    [commits, filter]
  );

  const contributorStats = employees.map((employee) => ({
    employee,
    count: commits.filter((commit) => commit.employeeId === employee.id).length,
    additions: commits.filter((commit) => commit.employeeId === employee.id).reduce((sum, commit) => sum + commit.additions, 0),
    verified: tasks.filter((task) => task.assignedTo === employee.id).reduce((sum, task) => sum + task.verifiedProgress, 0),
  }));

  const fileCommits = commits.filter((commit) =>
    commit.filesChanged.some((file) => file === activeFile.path || file.endsWith(activeFile.name))
  );

  return (
    <div className="app-scroll repo-app">
      <ActiveMissionHUD app="repo" />

      {/* Clean Repo Bar */}
      <div className="repo-summary">
        <div>
          <span className="repo-logo">⌘</span>
          <span>
            <strong>panic-labs / royal-feast-web</strong>
            <small><GitBranch size={11} /> main · Day {day}</small>
          </span>
        </div>
        <div className="repo-summary-stats">
          <span><b>{commits.length}</b> commits</span>
          <span><b>{employees.length}</b> contributors</span>
          <span><b>{Math.round(metrics.technicalDebt)}%</b> tech debt</span>
        </div>
      </div>

      {/* Toolbar / Tab Navigation */}
      <div className="repo-toolbar">
        <div className="repo-tabs">
          <button className={tab === 'files' ? 'active' : ''} onClick={() => setTab('files')}>
            <FileCode2 size={14} /> Files & Explorer
          </button>
          <button className={tab === 'commits' ? 'active' : ''} onClick={() => setTab('commits')}>
            <History size={14} /> Commits ({commits.length})
          </button>
          <button className={tab === 'contributors' ? 'active' : ''} onClick={() => setTab('contributors')}>
            <Activity size={14} /> Contributors ({employees.length})
          </button>
        </div>
        <label className="repo-search">
          <Search size={13} />
          <input
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
            placeholder="Search commits & files"
          />
        </label>
      </div>

      {/* ============================================================== */}
      {/* TAB 1: FILES & CODE EXPLORER                                    */}
      {/* ============================================================== */}
      {tab === 'files' && (
        <div className="repo-files-panel">
          {/* Left: VS Code-style File Tree Explorer */}
          <div className="file-tree">
            <div className="file-tree-heading">
              <span>EXPLORER: ROYAL-FEAST-WEB</span>
              <Pill tone="blue"><GitBranch size={11} /> main</Pill>
            </div>

            <div className="file-tree-items">
              {/* Folder: src/pages */}
              <div className="tree-folder-group">
                <button className="tree-folder-btn" onClick={() => toggleFolder('src/pages')}>
                  {openFolders['src/pages'] ? <FolderOpen size={14} className="text-yellow" /> : <Folder size={14} className="text-yellow" />}
                  <span>src / pages</span>
                </button>
                {openFolders['src/pages'] && (
                  <button
                    className={`tree-file-btn ${selectedFileName === 'Home.tsx' ? 'selected' : ''}`}
                    onClick={() => setSelectedFileName('Home.tsx')}
                  >
                    <span className="file-ext-badge tsx">TSX</span>
                    <span className="tree-file-name">Home.tsx</span>
                    <small className="tree-author-pill">Aarav</small>
                  </button>
                )}
              </div>

              {/* Folder: src/services */}
              <div className="tree-folder-group">
                <button className="tree-folder-btn" onClick={() => toggleFolder('src/services')}>
                  {openFolders['src/services'] ? <FolderOpen size={14} className="text-yellow" /> : <Folder size={14} className="text-yellow" />}
                  <span>src / services</span>
                </button>
                {openFolders['src/services'] && (
                  <button
                    className={`tree-file-btn ${selectedFileName === 'contactService.ts' ? 'selected' : ''}`}
                    onClick={() => setSelectedFileName('contactService.ts')}
                  >
                    <span className="file-ext-badge ts">TS</span>
                    <span className="tree-file-name">contactService.ts</span>
                    <small className="tree-author-pill">Nikhil</small>
                  </button>
                )}
              </div>

              {/* Folder: src/components */}
              <div className="tree-folder-group">
                <button className="tree-folder-btn" onClick={() => toggleFolder('src/components')}>
                  {openFolders['src/components'] ? <FolderOpen size={14} className="text-yellow" /> : <Folder size={14} className="text-yellow" />}
                  <span>src / components</span>
                </button>
                {openFolders['src/components'] && (
                  <button
                    className={`tree-file-btn ${selectedFileName === 'ServiceCard.tsx' ? 'selected' : ''}`}
                    onClick={() => setSelectedFileName('ServiceCard.tsx')}
                  >
                    <span className="file-ext-badge tsx">TSX</span>
                    <span className="tree-file-name">ServiceCard.tsx</span>
                    <small className="tree-author-pill">Varun</small>
                  </button>
                )}
              </div>

              {/* Folder: tests */}
              <div className="tree-folder-group">
                <button className="tree-folder-btn" onClick={() => toggleFolder('tests')}>
                  {openFolders['tests'] ? <FolderOpen size={14} className="text-yellow" /> : <Folder size={14} className="text-yellow" />}
                  <span>tests</span>
                </button>
                {openFolders['tests'] && (
                  <button
                    className={`tree-file-btn ${selectedFileName === 'sanity.test.ts' ? 'selected' : ''}`}
                    onClick={() => setSelectedFileName('sanity.test.ts')}
                  >
                    <span className="file-ext-badge test">TEST</span>
                    <span className="tree-file-name">sanity.test.ts</span>
                    <small className="tree-author-pill">Meera</small>
                  </button>
                )}
              </div>

              {/* Root Files */}
              <div className="tree-folder-group">
                <button
                  className={`tree-file-btn root-file ${selectedFileName === 'package.json' ? 'selected' : ''}`}
                  onClick={() => setSelectedFileName('package.json')}
                >
                  <span className="file-ext-badge json">JSON</span>
                  <span className="tree-file-name">package.json</span>
                  <small className="tree-author-pill">Aarav</small>
                </button>
                <button
                  className={`tree-file-btn root-file ${selectedFileName === 'README.md' ? 'selected' : ''}`}
                  onClick={() => setSelectedFileName('README.md')}
                >
                  <span className="file-ext-badge md">MD</span>
                  <span className="tree-file-name">README.md</span>
                  <small className="tree-author-pill">Varun</small>
                </button>
              </div>
            </div>
          </div>

          {/* Right: Code Viewer & Editor */}
          <div className="file-editor-pane">
            {/* Editor Top Bar */}
            <div className="editor-topbar">
              <div className="editor-breadcrumbs">
                <FileCode2 size={15} />
                <span>panic-labs</span>
                <i>/</i>
                <span>royal-feast-web</span>
                <i>/</i>
                <strong>{activeFile.path}</strong>
              </div>
              <div className="editor-actions">
                <div className="editor-mode-toggle">
                  <button
                    className={fileMode === 'code' ? 'active' : ''}
                    onClick={() => setFileMode('code')}
                  >
                    <Code2 size={13} /> Code View
                  </button>
                  <button
                    className={fileMode === 'evidence' ? 'active' : ''}
                    onClick={() => setFileMode('evidence')}
                  >
                    <Eye size={13} /> Evidence & Blame
                  </button>
                </div>
              </div>
            </div>

            {/* Sub-header Blame Bar */}
            <div className="editor-blame-bar">
              <div className="blame-author">
                <User size={13} />
                <span>Last committer: <strong>{activeFile.author}</strong></span>
                <span className="blame-desc">{activeFile.description}</span>
              </div>
              <div className="blame-meta">
                <span>{activeFile.lines} lines</span>
                <span>{activeFile.size}</span>
              </div>
            </div>

            {/* File Content Body */}
            {fileMode === 'code' ? (
              <div className="editor-code-container">
                <div className="editor-code-lines">
                  {activeFile.content.map((line, idx) => {
                    const smellKey = `file-${activeFile.name}-${idx}`;
                    const isFlagged = flaggedSmells[smellKey];
                    return (
                      <div
                        key={idx}
                        className={`code-line-row ${line.type === 'smell' ? 'line-smell' : ''} ${isFlagged ? 'line-neutralized' : ''}`}
                      >
                        <span className="code-line-num">{line.num}</span>
                        <span className={`code-line-text text-${line.type}`}>
                          {line.text || ' '}
                        </span>
                        {line.type === 'smell' && (
                          <div className="code-smell-action">
                            {isFlagged ? (
                              <span className="smell-neutralized-pill">
                                <Check size={11} /> SMELL NEUTRALIZED
                              </span>
                            ) : (
                              <button
                                className="smell-flag-btn"
                                onClick={() => handleFlagSmell(smellKey, line.smellDetail!)}
                                title={`Flag: ${line.smellDetail}`}
                              >
                                <Bug size={12} />
                                <span>FLAG SMELL (-4% DEBT)</span>
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="file-evidence-view">
                <div className="evidence-overview-card">
                  <span className="app-kicker">FILE ARCHITECTURE & PURPOSE</span>
                  <h3>{activeFile.name}</h3>
                  <p>{activeFile.description}</p>
                  <div className="evidence-badges">
                    <Pill tone="blue">Language: {activeFile.lang.toUpperCase()}</Pill>
                    <Pill tone="neutral">Size: {activeFile.size}</Pill>
                    <Pill tone="good">Owner: {activeFile.author}</Pill>
                  </div>
                </div>

                <div className="evidence-commits-section">
                  <h4>Recent Commits Touching This File</h4>
                  {fileCommits.length ? (
                    <ul className="evidence-commit-list">
                      {fileCommits.slice(-5).reverse().map((commit) => (
                        <li key={commit.id} className="evidence-commit-item">
                          <span className="commit-dot-node"><GitCommitHorizontal size={14} /></span>
                          <div>
                            <strong>{commit.message}</strong>
                            <small>Day {commit.day} · {commit.employeeName} · {commit.buildStatus} build</small>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="empty-evidence-box">
                      <ShieldAlert size={20} />
                      <div>
                        <strong>No direct commits logged yet</strong>
                        <p>A folder existing in the tree is not proof that its feature works. Assign sprint tasks to generate verified commits.</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 2: COMMITS & AUDIT TRAIL                                    */}
      {/* ============================================================== */}
      {tab === 'commits' && (
        <>
          <div className="repo-audit-strip">
            <div>
              <span className="app-kicker">EVIDENCE CHECK</span>
              <strong>Claims are not commits. Commits are not proof of quality.</strong>
              <small>Open a commit to compare the employee’s reported task progress with verified evidence.</small>
            </div>
            <div className="audit-flag-count">
              <b>{tasks.filter((task) => task.reportedProgress - task.verifiedProgress > 20).length}</b>
              <span>reporting gaps</span>
            </div>
          </div>

          <div className="repo-commit-layout">
            <section className="commit-list">
              {filteredCommits.length === 0 && (
                <div className="empty-state compact-empty">
                  <GitCommitHorizontal size={25} />
                  <strong>No commits match</strong>
                  <p>Try a contributor or commit message.</p>
                </div>
              )}
              {filteredCommits.map((commit) => (
                <button
                  key={commit.id}
                  className={`commit-item ${selectedCommitId === commit.id ? 'selected' : ''}`}
                  onClick={() => setSelectedCommitId(commit.id)}
                >
                  <span className="commit-node"><GitCommitHorizontal size={15} /></span>
                  <span className="commit-item-body">
                    <strong>{commit.message}</strong>
                    <small>{commit.employeeName} · Day {commit.day}, {commit.time}</small>
                    <em>{commit.filesChanged[0]}</em>
                  </span>
                  <span className="commit-health">{statusIcon(commit.buildStatus)}</span>
                </button>
              ))}
            </section>

            <section className="commit-detail">
              {selectedCommit ? (
                <>
                  <div className="commit-detail-head">
                    <div>
                      <span className="app-kicker">COMMIT DETAIL</span>
                      <h3>{selectedCommit.message}</h3>
                      <small>{selectedCommit.id}</small>
                    </div>
                    <Pill tone={selectedCommit.buildStatus === 'passed' ? 'good' : selectedCommit.buildStatus === 'failed' ? 'danger' : 'warning'}>
                      {selectedCommit.buildStatus}
                    </Pill>
                  </div>

                  <div className="commit-author">
                    <span className="author-dot">
                      {employees.find((item) => item.id === selectedCommit.employeeId)?.avatar ?? 'P'}
                    </span>
                    <span>
                      <strong>
                        {selectedCommit.employeeName.includes('(')
                          ? selectedCommit.employeeName
                          : `${selectedCommit.employeeName} (${employees.find((item) => item.id === selectedCommit.employeeId)?.role ?? 'Contributor'})`}
                      </strong>
                      <small>Committed on Day {selectedCommit.day} at {selectedCommit.time}</small>
                    </span>
                  </div>

                  <p className="commit-description">{selectedCommit.detail}</p>

                  <div className="commit-change-stats">
                    <span className="additions">+{selectedCommit.additions} additions</span>
                    <span className="deletions">−{selectedCommit.deletions} deletions</span>
                    <span>{selectedCommit.filesChanged.length} file(s) changed</span>
                  </div>

                  {selectedTask && (
                    <div className="commit-evidence-card">
                      <div className="commit-evidence-heading">
                        <strong>TASK CLAIM VS VERIFIED EVIDENCE</strong>
                        <Pill tone={selectedTask.reportedProgress - selectedTask.verifiedProgress > 20 ? 'warning' : 'good'}>
                          {selectedTask.reportedProgress - selectedTask.verifiedProgress > 20 ? 'GAP DETECTED' : 'IN RANGE'}
                        </Pill>
                      </div>
                      <div className="commit-evidence-values">
                        <span><small>EMPLOYEE CLAIM</small><b>{Math.round(selectedTask.reportedProgress)}%</b></span>
                        <span><small>VERIFIED</small><b>{Math.round(selectedTask.verifiedProgress)}%</b></span>
                        <span><small>QUALITY</small><b>{Math.round(selectedTask.quality)}%</b></span>
                      </div>
                      <ProgressBar
                        value={selectedTask.verifiedProgress}
                        tone={selectedTask.reportedProgress - selectedTask.verifiedProgress > 20 ? 'warning' : 'default'}
                      />
                      <small className="evidence-caption">
                        Task: {selectedTask.title}. Progress is verified from simulation evidence, not status messages.
                      </small>
                    </div>
                  )}

                  <div className="commit-files">
                    <div className="commit-files-title">
                      <strong>Changed files</strong>
                      <span>{selectedCommit.filesChanged.length} file(s)</span>
                    </div>
                    {selectedCommit.filesChanged.map((file) => (
                      <div className="changed-file" key={file}>
                        <FileCode2 size={14} />
                        <span>{file}</span>
                        <Pill tone="neutral">modified</Pill>
                        <ChevronRight size={14} />
                      </div>
                    ))}
                  </div>

                  <div className="commit-checks">
                    <div>
                      <span>BUILD</span>
                      {statusIcon(selectedCommit.buildStatus)}
                      <b>{selectedCommit.buildStatus.replace('_', ' ')}</b>
                    </div>
                    <div>
                      <span>TESTS</span>
                      {statusIcon(selectedCommit.testStatus === 'not_run' ? 'pending' : selectedCommit.testStatus)}
                      <b>{selectedCommit.testStatus.replace('_', ' ')}</b>
                    </div>
                    <div>
                      <span>QUALITY SIGNAL</span>
                      <b>{Math.round(selectedCommit.qualitySignal)}%</b>
                    </div>
                  </div>

                  <div className="commit-code-preview">
                    <div className="diff-header">
                      <div><i /><i /><i /><span>INTERACTIVE CODE REVIEW & DIFF INSPECTOR</span></div>
                      <small className="diff-hint">Click & flag suspicious code smells (-4% Tech Debt, +3% Quality)</small>
                    </div>
                    <div className="interactive-diff-lines">
                      {(fileRegistry[selectedCommit.filesChanged[0]?.split('/').pop() || '']?.content || activeFile.content)
                        .slice(0, 8)
                        .map((line, idx) => {
                          const smellKey = `diff-${selectedCommit.id}-${idx}`;
                          const isFlagged = flaggedSmells[smellKey];
                          const hasSmell = line.type === 'smell';
                          return (
                            <div
                              key={idx}
                              className={`diff-line-row ${hasSmell ? 'has-smell' : ''} ${isFlagged ? 'is-flagged' : ''}`}
                            >
                              <span className="diff-line-num">{line.num}</span>
                              <span className="diff-line-content">{line.text}</span>
                              {hasSmell && (
                                <div className="diff-action-cell">
                                  {isFlagged ? (
                                    <span className="diff-flagged-tag"><Check size={11} /> NEUTRALIZED</span>
                                  ) : (
                                    <button
                                      className="diff-flag-btn"
                                      onClick={() => handleFlagSmell(smellKey, line.smellDetail!)}
                                      title={`Flag smell: ${line.smellDetail}`}
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
                </>
              ) : (
                <div className="empty-state">
                  <GitCommitHorizontal size={27} />
                  <strong>No contribution selected</strong>
                  <p>Team commits will appear here after the first simulated workday.</p>
                </div>
              )}
            </section>
          </div>
        </>
      )}

      {/* ============================================================== */}
      {/* TAB 3: CONTRIBUTORS SQUAD BOARD                                */}
      {/* ============================================================== */}
      {tab === 'contributors' && (
        <div className="contributor-grid">
          {contributorStats.map(({ employee, count, additions, verified }) => (
            <div className="contributor-card" key={employee.id}>
              <div className="contributor-top">
                <span className="contributor-avatar" style={{ background: employee.color }}>
                  {employee.avatar}
                </span>
                <div>
                  <strong>{employee.name} ({employee.role})</strong>
                  <small>{employee.title}</small>
                </div>
                <Pill tone={count > 0 ? 'good' : 'warning'}>{count} commit(s)</Pill>
              </div>

              <div className="contrib-stats">
                <span><b>{additions}</b><small>lines committed</small></span>
                <span><b>{Math.round(verified)}</b><small>verified points</small></span>
              </div>

              <div className="contrib-habit-tag">
                <Terminal size={12} />
                <span>
                  {employee.id === 'aarav' && '“Disabled ESLint so vibes flow uninterrupted bro”'}
                  {employee.id === 'varun' && '“Refactored architectural ontology for login box”'}
                  {employee.id === 'meera' && '“Blocked build: 0.1px visual discrepancy detected”'}
                  {employee.id === 'nikhil' && '“seen (transmitted from Western line railway bridge)”'}
                  {employee.id === 'kunal' && '“Added 14 flame emojis to client proposal copy”'}
                </span>
              </div>

              <ProgressBar value={Math.min(100, (verified / 1.8) || 15)} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
