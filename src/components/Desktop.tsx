import { useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  Activity, Bell, BriefcaseBusiness, Bug, CalendarClock, Check, ChevronDown, CircleDollarSign, Clock3,
  Code2, FileText, FolderOpen, GitBranch, Globe, LayoutDashboard, Maximize2,
  MessageSquare, Minus, Monitor, MoreHorizontal, ShieldCheck, Sparkles, Terminal, Users, Wallet, X, Zap,
} from 'lucide-react';
import { useGameStore } from '../game/store';
import type { AppId, DailyReport, GameEvent } from '../game/types';
import ProjectHQ from '../apps/ProjectHQ';
import ChatApp from '../apps/ChatApp';
import RepoStudio from '../apps/RepoStudio';
import SprintBoard from '../apps/SprintBoard';
import ClientBrowser from '../apps/ClientBrowser';
import QALab from '../apps/QALab';
import PeopleApp from '../apps/PeopleApp';
import FinanceApp from '../apps/FinanceApp';
import FilesApp from '../apps/FilesApp';
import TerminalApp from '../apps/TerminalApp';
import { Pill } from '../apps/shared';

interface WindowState { id: AppId; x: number; y: number; width: number; height: number; z: number; minimized: boolean; maximized: boolean; }

const appMeta: Record<AppId, { title: string; subtitle: string; icon: ReactNode; color: string; hint: string }> = {
  hq: { title: 'Project HQ', subtitle: 'Command centre', icon: <LayoutDashboard />, color: 'lime', hint: 'The project at a glance' },
  chat: { title: 'Team Chat', subtitle: 'Messages & relationships', icon: <MessageSquare />, color: 'blue', hint: 'The source of most problems' },
  repo: { title: 'Repo Studio', subtitle: 'Code & commit history', icon: <GitBranch />, color: 'purple', hint: 'Trust, but verify' },
  sprint: { title: 'Sprint Board', subtitle: 'Tasks & ownership', icon: <CalendarClock />, color: 'orange', hint: 'Make work visible' },
  browser: { title: 'Client Browser', subtitle: 'Royal Feast portal', icon: <Globe />, color: 'pink', hint: 'Where “one small thing” arrives' },
  qa: { title: 'QA Laboratory', subtitle: 'Bugs & release checks', icon: <ShieldCheck />, color: 'green', hint: 'Meera has notes' },
  people: { title: 'People', subtitle: 'Team profiles & dynamics', icon: <Users />, color: 'coral', hint: 'Manage the humans' },
  finance: { title: 'Finance', subtitle: 'Company ledger', icon: <Wallet />, color: 'gold', hint: 'Numbers do not lie' },
  files: { title: 'File Manager', subtitle: 'Company drive', icon: <FolderOpen />, color: 'slate', hint: 'final_final_latest' },
  terminal: { title: 'Build Monitor', subtitle: 'Logs & system status', icon: <Terminal />, color: 'dark', hint: 'It failed for a reason' },
};
const appOrder: AppId[] = ['hq', 'chat', 'repo', 'sprint', 'browser', 'qa', 'people', 'finance', 'files', 'terminal'];
const defaultWindow = (id: AppId, count: number): WindowState => ({
  id,
  x: Math.max(24, 74 + (count % 4) * 42),
  y: Math.max(48, 46 + (count % 4) * 30),
  width: id === 'chat' ? 880 : id === 'repo' || id === 'sprint' ? 960 : 850,
  height: id === 'chat' ? 590 : id === 'repo' || id === 'sprint' ? 620 : 600,
  z: count + 2,
  minimized: false,
  maximized: false,
});

function AppContent({ id, openApp }: { id: AppId; openApp: (app: AppId) => void }) {
  switch (id) {
    case 'hq': return <ProjectHQ openApp={openApp} />;
    case 'chat': return <ChatApp />;
    case 'repo': return <RepoStudio />;
    case 'sprint': return <SprintBoard />;
    case 'browser': return <ClientBrowser />;
    case 'qa': return <QALab />;
    case 'people': return <PeopleApp />;
    case 'finance': return <FinanceApp />;
    case 'files': return <FilesApp />;
    case 'terminal': return <TerminalApp />;
  }
}

function DesktopWindow({ windowState, active, focus, close, minimize, move, toggleMaximize, openApp }: {
  windowState: WindowState; active: boolean; focus: () => void; close: () => void; minimize: () => void;
  move: (id: AppId, x: number, y: number) => void; toggleMaximize: (id: AppId) => void; openApp: (app: AppId) => void;
}) {
  const dragRef = useRef<{ startX: number; startY: number; originX: number; originY: number } | null>(null);
  const meta = appMeta[windowState.id];
  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if ((event.target as HTMLElement).closest('button')) return;
    if (window.innerWidth < 760) return;
    focus();
    dragRef.current = { startX: event.clientX, startY: event.clientY, originX: windowState.x, originY: windowState.y };
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragRef.current) return;
    const nextX = Math.max(6, Math.min(window.innerWidth - 180, dragRef.current.originX + event.clientX - dragRef.current.startX));
    const nextY = Math.max(38, Math.min(window.innerHeight - 100, dragRef.current.originY + event.clientY - dragRef.current.startY));
    move(windowState.id, nextX, nextY);
  };
  const onPointerUp = () => { dragRef.current = null; };
  if (windowState.minimized) return null;
  return <motion.section className={`desktop-window window-${windowState.id} ${active ? 'window-active' : ''}`} style={{ left: windowState.maximized ? 9 : windowState.x, top: windowState.maximized ? 48 : windowState.y, width: windowState.maximized ? Math.max(340, window.innerWidth - 18) : windowState.width, height: windowState.maximized ? Math.max(260, window.innerHeight - 114) : windowState.height, zIndex: windowState.z }} initial={{ opacity: 0, scale: 0.96, y: 8 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.97, y: 7 }} transition={{ duration: 0.16 }} onPointerDown={focus}>
    <div className="window-titlebar" onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerCancel={onPointerUp}>
      <div className={`window-app-symbol app-color-${meta.color}`}>{meta.icon}</div><div className="window-title"><strong>{meta.title}</strong><small>{meta.subtitle}</small></div><div className="window-controls"><button title="Minimise" onClick={minimize}><Minus size={14} /></button><button title={windowState.maximized ? 'Restore window' : 'Maximise'} onClick={() => toggleMaximize(windowState.id)}><Maximize2 size={13} /></button><button className="window-close" title="Close" onClick={close}><X size={14} /></button></div>
    </div>
    <div className="window-content"><AppContent id={windowState.id} openApp={openApp} /></div>
    <div className="window-resize-hint">⋱</div>
  </motion.section>;
}

function EventOverlay({ event, onChoose }: { event: GameEvent; onChoose: (id: string) => void }) {
  const persona = event.character === 'Mr. Prakash' ? '👨🏻‍💼' : event.character === 'Kunal' ? '☀️' : event.character === 'Aarav' ? '⚡' : event.character === 'Varun' ? '🧠' : event.character === 'Meera' ? '🔬' : '👻';
  return <motion.div className="story-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><motion.div className="story-modal" initial={{ y: 18, scale: 0.97 }} animate={{ y: 0, scale: 1 }}>
    <div className="story-topline"><span>ALMOSTOS · INCIDENT REPORT</span><span className="story-alert"><i /> DECISION REQUIRED</span></div><div className="story-content"><div className="story-avatar">{persona}</div><div><span className="app-kicker">{event.eyebrow}</span><h2>{event.title}</h2><p>{event.body}</p><div className="story-speaker"><strong>{event.character}</strong><span>{event.characterRole}</span></div></div></div><div className="story-choice-label">YOUR RESPONSE <small>Every choice changes the simulation.</small></div><div className="story-choices">{event.choices.map((choice, index) => <button key={choice.id} onClick={() => onChoose(choice.id)}><span className="choice-index">0{index + 1}</span><span><strong>{choice.label}</strong><small>{choice.hint}</small></span><span className="choice-arrow">↗</span></button>)}</div>
  </motion.div></motion.div>;
}

function ReportOverlay({ report, close }: { report: DailyReport; close: () => void }) {
  return <motion.div className="story-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><motion.div className="daily-report-modal" initial={{ y: 18, scale: 0.97 }} animate={{ y: 0, scale: 1 }}>
    <div className="report-modal-head"><span className="report-modal-icon"><Activity size={19} /></span><div><span className="app-kicker">DAILY REPORT · DAY {report.day}</span><h2>{report.headline}</h2></div><Pill tone="good">DAY CLOSED</Pill></div><p className="report-summary">{report.summary}</p><div className="report-kpis"><div><span>PROGRESS</span><strong className={report.progressDelta >= 0 ? 'delta-up' : 'delta-down'}>{report.progressDelta >= 0 ? '+' : ''}{report.progressDelta}%</strong></div><div><span>QUALITY</span><strong>{report.qualityDelta >= 0 ? '+' : ''}{report.qualityDelta}%</strong></div><div><span>MORALE</span><strong>{report.moraleDelta >= 0 ? '+' : ''}{report.moraleDelta}%</strong></div></div><div className="report-lines"><div><strong>Completed work</strong>{report.completed.length ? report.completed.map((item) => <span key={item}>✓ {item}</span>) : <span>No task reached 100%. The team has achieved consistency.</span>}</div><div><strong>Incidents & observations</strong>{report.incidents.map((item) => <span key={item}>• {item}</span>)}</div></div><button className="btn-primary report-continue" onClick={close}>CONTINUE TO NEXT DAY <span>→</span></button>
  </motion.div></motion.div>;
}

export default function Desktop() {
  const { day, actionsLeft, metrics, employees, notifications, pendingEvent, resolveEvent, endDay, dailyReports, markNotificationsRead, phase } = useGameStore();
  const [windows, setWindows] = useState<WindowState[]>([defaultWindow('hq', 0)]);
  const [activeId, setActiveId] = useState<AppId>('hq');
  const [clockMenu, setClockMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [desktopMenu, setDesktopMenu] = useState(false);
  const unread = notifications.filter((item) => !item.read).length;
  const lastReport = showReport ? dailyReports[dailyReports.length - 1] : null;
  const clock = useMemo(() => {
    const minutes = 9 * 60 + 10 + (3 - actionsLeft) * 74;
    return `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`;
  }, [actionsLeft]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === '1') openApp('hq');
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === '2') openApp('chat');
      if (event.key === 'Escape') { setShowNotifications(false); setDesktopMenu(false); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  function openApp(id: AppId) {
    setWindows((current) => {
      const found = current.find((item) => item.id === id);
      if (found) return current.map((item) => item.id === id ? { ...item, minimized: false, z: Math.max(...current.map((win) => win.z)) + 1 } : item);
      const next = defaultWindow(id, current.length);
      return [...current, { ...next, z: Math.max(1, ...current.map((item) => item.z)) + 1 }];
    });
    setActiveId(id);
    setDesktopMenu(false);
  }
  function focus(id: AppId) {
    setActiveId(id);
    setWindows((current) => current.map((item) => item.id === id ? { ...item, z: Math.max(...current.map((win) => win.z)) + 1 } : item));
  }
  function move(id: AppId, x: number, y: number) { setWindows((current) => current.map((item) => item.id === id ? { ...item, x, y, maximized: false } : item)); }
  function toggleMaximize(id: AppId) { setWindows((current) => current.map((item) => item.id === id ? { ...item, maximized: !item.maximized } : item)); }
  function close(id: AppId) { setWindows((current) => current.filter((item) => item.id !== id)); }
  function minimize(id: AppId) { setWindows((current) => current.map((item) => item.id === id ? { ...item, minimized: true } : item)); }
  function restore(id: AppId) {
    const found = windows.find((item) => item.id === id);
    if (!found) openApp(id); else { setWindows((current) => current.map((item) => item.id === id ? { ...item, minimized: false, z: Math.max(...current.map((win) => win.z)) + 1 } : item)); setActiveId(id); }
  }
  const handleEndDay = () => {
    if (day === 7) { endDay(); return; }
    endDay();
    setShowReport(true);
  };
  const visibleWindows = windows.filter((item) => !item.minimized);

  if (phase !== 'desktop') return null;
  return <main className="desktop-shell">
    <header className="system-topbar"><div className="system-brand"><span className="system-logo">P</span><strong>ALMOSTOS</strong><span className="system-separator">/</span><span>PANIC LABS</span></div><div className="system-top-center"><span className="desktop-day-tag">DAY {day} <i /> 07</span><span className="system-project-name">ROYAL FEAST · PHASE 1</span></div><div className="system-top-right"><div className="mini-status"><span className="live-dot" /> SIMULATION LIVE</div><button className="topbar-icon" onClick={() => { setShowNotifications((value) => !value); markNotificationsRead(); }} title="Notifications"><Bell size={16} />{unread > 0 && <i>{unread}</i>}</button><button className="system-clock" onClick={() => setClockMenu((value) => !value)}><Clock3 size={14} /> {clock} <ChevronDown size={12} /></button></div></header>

    <div className="desktop-wallpaper" onClick={() => { setDesktopMenu(false); setShowNotifications(false); }}>
      <div className="wallpaper-grid" /><div className="wallpaper-glow glow-one" /><div className="wallpaper-glow glow-two" />
      <div className="wallpaper-copy"><span>STARTUP OPERATING ENVIRONMENT <i>·</i> EST. RECENTLY</span><strong>Ship something.<br /><em>Try not to panic.</em></strong><small>“We are a family” — management, moments before a production incident.</small></div>
      <div className="desktop-icons">{appOrder.map((id) => <button key={id} className="desktop-icon" onClick={(event) => { event.stopPropagation(); openApp(id); }}><span className={`desktop-icon-tile app-color-${appMeta[id].color}`}>{appMeta[id].icon}</span><span>{appMeta[id].title}</span></button>)}</div>
      <div className="wallpaper-sticker"><span>FIRST CLIENT</span><strong>07 DAYS</strong><small>NO PRESSURE.</small></div>
    </div>

    <AnimatePresence>{visibleWindows.map((windowState) => <DesktopWindow key={windowState.id} windowState={windowState} active={activeId === windowState.id} focus={() => focus(windowState.id)} close={() => close(windowState.id)} minimize={() => minimize(windowState.id)} move={move} toggleMaximize={toggleMaximize} openApp={openApp} />)}</AnimatePresence>

    <footer className="system-dock"><button className="dock-start" onClick={() => setDesktopMenu((value) => !value)} title="App launcher"><span>P</span></button><div className="dock-divider" />{appOrder.slice(0, 8).map((id) => { const meta = appMeta[id]; const isOpen = windows.some((item) => item.id === id); return <button key={id} className={`dock-app ${activeId === id && isOpen ? 'active' : ''} ${isOpen ? 'is-open' : ''}`} onClick={() => restore(id)} title={meta.title}><span className={`dock-icon app-color-${meta.color}`}>{meta.icon}</span>{isOpen && <i />}</button>; })}<div className="dock-spacer" /><button className="dock-endday" onClick={handleEndDay} disabled={Boolean(pendingEvent)}>{day === 7 ? 'DELIVER PROJECT' : 'END DAY'} <span>{day === 7 ? '↗' : '→'}</span></button></footer>

    <AnimatePresence>{desktopMenu && <motion.div className="launcher-menu" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}><div className="launcher-head"><span className="system-logo">P</span><div><strong>PANIC LABS</strong><small>Application launcher</small></div></div><div className="launcher-grid">{appOrder.map((id) => <button key={id} onClick={() => openApp(id)}><span className={`desktop-icon-tile app-color-${appMeta[id].color}`}>{appMeta[id].icon}</span><strong>{appMeta[id].title}</strong></button>)}</div><div className="launcher-footer"><span>Founder account</span><button onClick={() => useGameStore.getState().resetGame()}>Power off</button></div></motion.div>}</AnimatePresence>

    <AnimatePresence>{showNotifications && <motion.aside className="notification-centre" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 12 }}><div className="notification-head"><strong>Notification centre</strong><button onClick={() => setShowNotifications(false)}><X size={15} /></button></div>{notifications.length === 0 ? <p>No notifications. Suspiciously quiet.</p> : notifications.slice(0, 10).map((item) => <button className="notification-item" key={item.id} onClick={() => { openApp(item.app); setShowNotifications(false); }}><span className={`notification-tone ${item.tone}`} /><span><strong>{item.title}</strong><small>{item.body}</small><em>Day {item.day}</em></span></button>)}</motion.aside>}</AnimatePresence>

    <AnimatePresence>{clockMenu && <motion.div className="clock-popover" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }}><span>SIMULATED TIME</span><strong>{clock}</strong><small>Day {day} of 7 · Company local time</small></motion.div>}</AnimatePresence>
    <div className="desktop-system-note"><span className="live-dot" /> All systems simulated · Local save enabled</div>

    <AnimatePresence>{showReport && lastReport && <ReportOverlay report={lastReport} close={() => setShowReport(false)} />}</AnimatePresence>
    <AnimatePresence>{!showReport && pendingEvent && <EventOverlay event={pendingEvent} onChoose={resolveEvent} />}</AnimatePresence>
  </main>;
}
