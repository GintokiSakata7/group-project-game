import { useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  Activity, Bell, BriefcaseBusiness, Bug, CalendarClock, Check, ChevronDown, CircleDollarSign, Clock3,
  Code2, FileText, FolderOpen, GitBranch, Globe, LayoutDashboard, Maximize2,
  MessageSquare, Minus, Monitor, MoreHorizontal, ShieldCheck, Sparkles, Terminal, Users, Wallet, X, Zap,
  Building2, ArrowLeft, Volume2, VolumeX, Music
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
import WebPreview from '../apps/WebPreview';
import MusicApp from '../apps/MusicApp';
import BreakRoomApp from '../apps/BreakRoomApp';
import ReelsApp from '../apps/ReelsApp';
import { Pill } from '../apps/shared';
import { missionsForDay } from '../game/missions';
import { sound } from '../game/audio';
import { Coffee, Flame } from 'lucide-react';

interface WindowState {
  id: AppId;
  x: number;
  y: number;
  width: number;
  height: number;
  z: number;
  minimized: boolean;
  maximized: boolean;
}

const appMeta: Record<AppId, { title: string; subtitle: string; icon: ReactNode; color: string; hint: string }> = {
  preview: { title: 'Live Staging', subtitle: 'http://localhost:3000', icon: <Globe />, color: 'lime', hint: 'See what your team actually built' },
  chat: { title: 'Team Chat', subtitle: 'Office messages & banter', icon: <MessageSquare />, color: 'blue', hint: 'The source of most problems' },
  browser: { title: 'Client Desk', subtitle: 'Royal Feast & Bunty requests', icon: <BriefcaseBusiness />, color: 'pink', hint: 'Where “one small thing” arrives' },
  repo: { title: 'Code Studio', subtitle: 'Commits, diffs & evidence', icon: <GitBranch />, color: 'purple', hint: 'Trust, but verify' },
  people: { title: 'Team Room', subtitle: 'Profiles, traits & dynamics', icon: <Users />, color: 'coral', hint: 'Manage the humans' },
  sprint: { title: 'Task Board', subtitle: 'Assignments & progress', icon: <CalendarClock />, color: 'orange', hint: 'Make work visible' },
  qa: { title: 'Build Lab', subtitle: 'Defects & test runs', icon: <ShieldCheck />, color: 'green', hint: 'Meera has notes' },
  pantry: { title: 'Break Lounge', subtitle: 'Chai, Coffee & PanicEats', icon: <Coffee />, color: 'gold', hint: 'Fuel the team to beat crunch' },
  reels: { title: 'OfficeGram', subtitle: 'Dev Reels & Doomscrolling', icon: <Flame />, color: 'pink', hint: '5-minute brainrot break' },
  music: { title: 'PanicBeats', subtitle: 'Kunal’s Lo-Fi Jukebox', icon: <Sparkles />, color: 'gold', hint: 'Music to code and cry to' },
  hq: { title: 'Founder Dashboard', subtitle: 'Command centre & KPIs', icon: <LayoutDashboard />, color: 'slate', hint: 'The project at a glance' },
  finance: { title: 'Finance', subtitle: 'Company ledger', icon: <Wallet />, color: 'gold', hint: 'Numbers do not lie' },
  files: { title: 'File Manager', subtitle: 'Company drive', icon: <FolderOpen />, color: 'slate', hint: 'final_final_latest' },
  terminal: { title: 'Build Monitor', subtitle: 'Logs & system status', icon: <Terminal />, color: 'dark', hint: 'It failed for a reason' },
};

// Adventure & Corporate Apps
const primaryApps: AppId[] = ['preview', 'chat', 'browser', 'repo', 'people', 'sprint', 'qa', 'pantry', 'reels', 'music'];
const allApps: AppId[] = ['preview', 'chat', 'browser', 'repo', 'people', 'sprint', 'qa', 'pantry', 'reels', 'music', 'hq', 'finance', 'files', 'terminal'];

const defaultWindow = (id: AppId, count: number): WindowState => {
  const isWide = typeof window !== 'undefined' ? window.innerWidth > 1024 : true;
  const isReels = id === 'reels';
  const defWidth = isReels ? 450 : isWide ? 980 : Math.min(860, typeof window !== 'undefined' ? window.innerWidth - 30 : 860);
  const defHeight = isReels ? 720 : isWide ? 640 : 580;

  return {
    id,
    x: isReels ? Math.max(20, Math.floor((typeof window !== 'undefined' ? window.innerWidth - 470 : 800) / 2)) : Math.max(16, 50 + (count % 4) * 36),
    y: Math.max(48, 44 + (count % 4) * 26),
    width: defWidth,
    height: defHeight,
    z: count + 2,
    minimized: false,
    maximized: false,
  };
};

function AppContent({ id, openApp }: { id: AppId; openApp: (app: AppId) => void }) {
  switch (id) {
    case 'preview': return <WebPreview />;
    case 'music': return <MusicApp />;
    case 'chat': return <ChatApp />;
    case 'browser': return <ClientBrowser />;
    case 'repo': return <RepoStudio />;
    case 'people': return <PeopleApp />;
    case 'sprint': return <SprintBoard />;
    case 'qa': return <QALab />;
    case 'pantry': return <BreakRoomApp />;
    case 'reels': return <ReelsApp />;
    case 'hq': return <ProjectHQ openApp={openApp} />;
    case 'finance': return <FinanceApp />;
    case 'files': return <FilesApp />;
    case 'terminal': return <TerminalApp />;
  }
}

function DesktopWindow({
  windowState,
  active,
  focus,
  close,
  minimize,
  move,
  toggleMaximize,
  openApp,
}: {
  windowState: WindowState;
  active: boolean;
  focus: () => void;
  close: () => void;
  minimize: () => void;
  move: (id: AppId, x: number, y: number) => void;
  toggleMaximize: (id: AppId) => void;
  openApp: (app: AppId) => void;
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

  const onPointerUp = () => {
    dragRef.current = null;
  };

  if (windowState.minimized) return null;

  return (
    <motion.section
      className={`desktop-window window-${windowState.id} ${active ? 'window-active' : ''}`}
      style={{
        left: windowState.maximized ? 8 : windowState.x,
        top: windowState.maximized ? 46 : windowState.y,
        width: windowState.maximized ? Math.max(340, window.innerWidth - 16) : windowState.width,
        height: windowState.maximized ? Math.max(260, window.innerHeight - 108) : windowState.height,
        zIndex: windowState.z,
      }}
      initial={{ opacity: 0, scale: 0.96, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97, y: 7 }}
      transition={{ duration: 0.16 }}
      onPointerDown={focus}
    >
      <div
        className="window-titlebar"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <div className={`window-app-symbol app-color-${meta.color}`}>{meta.icon}</div>
        <div className="window-title">
          <strong>{meta.title}</strong>
          <small>{meta.subtitle}</small>
        </div>
        <div className="window-controls">
          <button title="Minimise" onClick={minimize}><Minus size={14} /></button>
          <button title={windowState.maximized ? 'Restore window' : 'Maximise'} onClick={() => toggleMaximize(windowState.id)}>
            <Maximize2 size={13} />
          </button>
          <button className="window-close" title="Close" onClick={close}><X size={14} /></button>
        </div>
      </div>
      <div className="window-content">
        <AppContent id={windowState.id} openApp={openApp} />
      </div>
      <div className="window-resize-hint">⋱</div>
    </motion.section>
  );
}

function EventOverlay({ event, onChoose }: { event: GameEvent; onChoose: (id: string) => void }) {
  const persona =
    event.character === 'Mr. Prakash'
      ? '👨🏻‍💼'
      : event.character === 'Kunal'
      ? '☀️'
      : event.character === 'Aarav'
      ? '⚡'
      : event.character === 'Varun'
      ? '🧠'
      : event.character === 'Meera'
      ? '🔬'
      : '👻';

  return (
    <motion.div className="story-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.div className="story-modal" initial={{ y: 18, scale: 0.97 }} animate={{ y: 0, scale: 1 }}>
        <div className="story-topline">
          <span>ALMOSTOS · INCIDENT REPORT</span>
          <span className="story-alert"><i /> DECISION REQUIRED</span>
        </div>
        <div className="story-content">
          <div className="story-avatar">{persona}</div>
          <div>
            <span className="app-kicker">{event.eyebrow}</span>
            <h2>{event.title}</h2>
            <p>{event.body}</p>
            <div className="story-speaker">
              <strong>{event.character}</strong>
              <span>{event.characterRole}</span>
            </div>
          </div>
        </div>
        <div className="story-choice-label">
          YOUR RESPONSE <small>Every choice changes the simulation.</small>
        </div>
        <div className="story-choices">
          {event.choices.map((choice, index) => (
            <button key={choice.id} onClick={() => onChoose(choice.id)}>
              <span className="choice-index">0{index + 1}</span>
              <span>
                <strong>{choice.label}</strong>
                <small>{choice.hint}</small>
              </span>
              <span className="choice-arrow">↗</span>
            </button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

function ReportOverlay({ report, close }: { report: DailyReport; close: () => void }) {
  return (
    <motion.div className="story-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.div className="daily-report-modal" initial={{ y: 18, scale: 0.97 }} animate={{ y: 0, scale: 1 }}>
        <div className="report-modal-head">
          <span className="report-modal-icon"><Activity size={19} /></span>
          <div>
            <span className="app-kicker">DAILY REPORT · DAY {report.day}</span>
            <h2>{report.headline}</h2>
          </div>
          <Pill tone="good">DAY CLOSED</Pill>
        </div>
        <p className="report-summary">{report.summary}</p>
        <div className="report-kpis">
          <div>
            <span>PROGRESS</span>
            <strong className={report.progressDelta >= 0 ? 'delta-up' : 'delta-down'}>
              {report.progressDelta >= 0 ? '+' : ''}{report.progressDelta}%
            </strong>
          </div>
          <div>
            <span>QUALITY</span>
            <strong>{report.qualityDelta >= 0 ? '+' : ''}{report.qualityDelta}%</strong>
          </div>
          <div>
            <span>MORALE</span>
            <strong>{report.moraleDelta >= 0 ? '+' : ''}{report.moraleDelta}%</strong>
          </div>
        </div>
        <div className="report-lines">
          <div>
            <strong>Completed work</strong>
            {report.completed.length ? report.completed.map((item) => <span key={item}>✓ {item}</span>) : <span>No task reached 100%. The team has achieved consistency.</span>}
          </div>
          <div>
            <strong>Incidents & observations</strong>
            {report.incidents.map((item) => <span key={item}>• {item}</span>)}
          </div>
        </div>
        <button className="btn-primary report-continue" onClick={close}>
          CONTINUE TO NEXT DAY <span>→</span>
        </button>
      </motion.div>
    </motion.div>
  );
}

export default function Desktop() {
  const {
    companyName,
    day,
    actionsLeft,
    notifications,
    pendingEvent,
    resolveEvent,
    endDay,
    dailyReports,
    markNotificationsRead,
    phase,
    goToOffice,
    completedMissionIds,
    activeAppOnDesktop,
  } = useGameStore();

  // Start with Team Chat open by default
  const [windows, setWindows] = useState<WindowState[]>([defaultWindow('chat', 0)]);
  const [activeId, setActiveId] = useState<AppId>('chat');
  const [clockMenu, setClockMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [desktopMenu, setDesktopMenu] = useState(false);
  const [isPlayingMusic, setIsPlayingMusic] = useState(sound.getPlayingTrack().isPlaying);
  const [isAudioMuted, setIsAudioMuted] = useState(sound.getMuted());

  // Listen for navigation requests to open specific apps
  useEffect(() => {
    if (activeAppOnDesktop) {
      openApp(activeAppOnDesktop);
      useGameStore.setState({ activeAppOnDesktop: null });
    }
  }, [activeAppOnDesktop]);

  const unread = notifications.filter((item) => !item.read).length;
  const dayMissions = missionsForDay(day);
  const missionsComplete = dayMissions.every((mission) => completedMissionIds.includes(mission.id));
  const lastReport = showReport ? dailyReports[dailyReports.length - 1] : null;

  const clock = useMemo(() => {
    const minutes = 9 * 60 + 10 + (5 - actionsLeft) * 52;
    return `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`;
  }, [actionsLeft]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === '1') openApp('chat');
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === '2') openApp('browser');
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === '3') openApp('repo');
      if (event.key === 'Escape') {
        setShowNotifications(false);
        setDesktopMenu(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  function openApp(id: AppId) {
    sound.playClick();
    setWindows((current) => {
      const found = current.find((item) => item.id === id);
      if (found) {
        return current.map((item) =>
          item.id === id ? { ...item, minimized: false, z: Math.max(...current.map((win) => win.z)) + 1 } : item
        );
      }
      const next = defaultWindow(id, current.length);
      return [...current, { ...next, z: Math.max(1, ...current.map((item) => item.z)) + 1 }];
    });
    setActiveId(id);
    setDesktopMenu(false);
  }

  function focus(id: AppId) {
    sound.playClick(true);
    setActiveId(id);
    setWindows((current) => current.map((item) => (item.id === id ? { ...item, z: Math.max(...current.map((win) => win.z)) + 1 } : item)));
  }

  function move(id: AppId, x: number, y: number) {
    setWindows((current) => current.map((item) => (item.id === id ? { ...item, x, y, maximized: false } : item)));
  }

  function toggleMaximize(id: AppId) {
    sound.playClick();
    setWindows((current) => current.map((item) => (item.id === id ? { ...item, maximized: !item.maximized } : item)));
  }

  function close(id: AppId) {
    sound.playClick();
    setWindows((current) => current.filter((item) => item.id !== id));
  }

  function minimize(id: AppId) {
    sound.playClick();
    setWindows((current) => current.map((item) => (item.id === id ? { ...item, minimized: true } : item)));
  }

  function restore(id: AppId) {
    const found = windows.find((item) => item.id === id);
    if (!found) {
      openApp(id);
    } else {
      setWindows((current) =>
        current.map((item) => (item.id === id ? { ...item, minimized: false, z: Math.max(...current.map((win) => win.z)) + 1 } : item))
      );
      setActiveId(id);
    }
  }

  const handleEndDay = () => {
    // The desktop is an in-world tool, not a shortcut around the story.
    // Return the founder to the office mission board until both daily missions are complete.
    if (!missionsComplete) {
      goToOffice();
      return;
    }
    if (day === 7) {
      endDay();
      return;
    }
    endDay();
    setShowReport(true);
  };

  const visibleWindows = windows.filter((item) => !item.minimized);

  return (
    <main className="desktop-shell">
      {/* Topbar */}
      <header className="system-topbar">
        <div className="system-brand">
          <button className="back-to-office-topbar" onClick={goToOffice} title="Return to Office Hub">
            <Building2 size={16} />
            <strong>OFFICE HUB</strong>
          </button>
          <span className="system-separator">/</span>
          <span className="system-logo">P</span>
          <strong>ALMOSTOS</strong>
        </div>

        <div className="system-top-center">
          <span className="desktop-day-tag">DAY {day} <i /> 07</span>
          <span className="system-project-name">ROYAL FEAST · PHASE 1</span>
          <span className="actions-chip">
            <Zap size={13} /> {actionsLeft}/5 ACTIONS
          </span>
        </div>

        <div className="system-top-right">
          <button
            className={`topbar-music-chip ${isPlayingMusic && !isAudioMuted ? 'is-playing' : ''}`}
            onClick={() => {
              openApp('music');
            }}
            title="Kunal's Lo-Fi Jukebox (PanicBeats)"
          >
            <Music size={13} className={isPlayingMusic && !isAudioMuted ? 'music-note-spin' : ''} />
            <span>{sound.getPlayingTrack().track.title.slice(0, 18)}...</span>
          </button>

          <button
            className="topbar-icon"
            onClick={() => {
              const muted = sound.toggleMute();
              setIsAudioMuted(muted);
              sound.playClick();
            }}
            title={isAudioMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {isAudioMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
          </button>

          <button
            className="topbar-icon"
            onClick={() => {
              setShowNotifications((value) => !value);
              markNotificationsRead();
            }}
            title="Notifications"
          >
            <Bell size={16} />
            {unread > 0 && <i>{unread}</i>}
          </button>
          <button className="system-clock" onClick={() => setClockMenu((value) => !value)}>
            <Clock3 size={14} /> {clock} <ChevronDown size={12} />
          </button>
        </div>
      </header>

      {/* Wallpaper & Desktop Icons */}
      <div className="desktop-wallpaper" onClick={() => { setDesktopMenu(false); setShowNotifications(false); }}>
        <div className="wallpaper-grid" />
        <div className="wallpaper-glow glow-one" />
        <div className="wallpaper-glow glow-two" />

        <div className="wallpaper-copy">
          <span>{companyName.toUpperCase()} FOUNDER OPERATING SYSTEM</span>
          <strong>Ship something.<br /><em>Try not to panic.</em></strong>
          <small>“We are like a family” — management, moments before a production emergency.</small>
        </div>

        <div className="desktop-icons">
          {primaryApps.map((id) => (
            <button
              key={id}
              className="desktop-icon"
              onClick={(event) => {
                event.stopPropagation();
                openApp(id);
              }}
            >
              <span className={`desktop-icon-tile app-color-${appMeta[id].color}`}>{appMeta[id].icon}</span>
              <span>{appMeta[id].title}</span>
            </button>
          ))}
        </div>

        <div className="wallpaper-sticker">
          <span>FIRST CLIENT</span>
          <strong>07 DAYS</strong>
          <small>NO PRESSURE.</small>
        </div>
      </div>

      {/* Windows Layer */}
      <AnimatePresence>
        {visibleWindows.map((windowState) => (
          <DesktopWindow
            key={windowState.id}
            windowState={windowState}
            active={activeId === windowState.id}
            focus={() => focus(windowState.id)}
            close={() => close(windowState.id)}
            minimize={() => minimize(windowState.id)}
            move={move}
            toggleMaximize={toggleMaximize}
            openApp={openApp}
          />
        ))}
      </AnimatePresence>

      {/* System Dock */}
      <footer className="system-dock">
        {/* Launcher Button */}
        <button className="dock-start" onClick={() => setDesktopMenu((value) => !value)} title="All Applications">
          <span>P</span>
        </button>

        {/* Return to Office Hub Button */}
        <button className="dock-office-link" onClick={goToOffice} title="Return to physical office">
          <Building2 size={18} />
          <span>OFFICE ROOM</span>
        </button>

        <div className="dock-divider" />

        {/* 6 Core Game Apps */}
        {primaryApps.map((id) => {
          const meta = appMeta[id];
          const isOpen = windows.some((item) => item.id === id);
          return (
            <button
              key={id}
              className={`dock-app ${activeId === id && isOpen ? 'active' : ''} ${isOpen ? 'is-open' : ''}`}
              onClick={() => restore(id)}
              title={meta.title}
            >
              <span className={`dock-icon app-color-${meta.color}`}>{meta.icon}</span>
              {isOpen && <i />}
            </button>
          );
        })}

        <div className="dock-spacer" />

        {/* End Day / Deliver */}
        <button className="dock-endday" onClick={handleEndDay} disabled={Boolean(pendingEvent)} title={missionsComplete ? 'Close the day' : 'Return to the office to complete story missions'}>
          {missionsComplete ? (day === 7 ? 'DELIVER PROJECT' : 'END DAY') : 'RETURN TO MISSIONS'} <span>{missionsComplete ? (day === 7 ? '↗' : '→') : '↩'}</span>
        </button>
      </footer>

      {/* Launcher Menu */}
      <AnimatePresence>
        {desktopMenu && (
          <motion.div className="launcher-menu" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}>
            <div className="launcher-head">
              <span className="system-logo">P</span>
              <div>
                <strong>{companyName.toUpperCase()} OS</strong>
                <small>Application Launcher</small>
              </div>
            </div>
            <div className="launcher-grid">
              {allApps.map((id) => (
                <button key={id} onClick={() => openApp(id)}>
                  <span className={`desktop-icon-tile app-color-${appMeta[id].color}`}>{appMeta[id].icon}</span>
                  <strong>{appMeta[id].title}</strong>
                </button>
              ))}
            </div>
            <div className="launcher-footer">
              <button onClick={goToOffice} className="launcher-office-btn">
                <Building2 size={14} /> Back to Office
              </button>
              <button onClick={() => useGameStore.getState().resetGame()}>Reset Game</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notifications Drawer */}
      <AnimatePresence>
        {showNotifications && (
          <motion.aside className="notification-centre" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 12 }}>
            <div className="notification-head">
              <strong>Notifications</strong>
              <button onClick={() => setShowNotifications(false)}><X size={15} /></button>
            </div>
            {notifications.length === 0 ? (
              <p>No new notifications. Suspiciously quiet.</p>
            ) : (
              <div className="notification-centre-list">
                {notifications.slice(0, 10).map((item) => (
                  <button
                    className="notification-item"
                    key={item.id}
                    onClick={() => {
                      openApp(item.app);
                      setShowNotifications(false);
                    }}
                  >
                    <span className={`notification-tone ${item.tone}`} />
                    <span>
                      <strong>{item.title}</strong>
                      <small>{item.body}</small>
                      <em>Day {item.day}</em>
                    </span>
                  </button>
                ))}
              </div>
            )}
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Clock popover */}
      <AnimatePresence>
        {clockMenu && (
          <motion.div className="clock-popover" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }}>
            <span>SIMULATED TIME</span>
            <strong>{clock}</strong>
            <small>Day {day} of 7 · Company local time</small>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlays */}
      <AnimatePresence>{showReport && lastReport && <ReportOverlay report={lastReport} close={() => setShowReport(false)} />}</AnimatePresence>
      <AnimatePresence>{!showReport && pendingEvent && <EventOverlay event={pendingEvent} onChoose={resolveEvent} />}</AnimatePresence>
    </main>
  );
}
