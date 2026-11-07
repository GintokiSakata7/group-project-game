import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Target,
  Sparkles,
  CheckCircle2,
  CalendarClock,
  GitBranch,
  Globe,
  MessageSquare,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Zap,
  Check,
  ArrowRight,
  X,
  Volume2,
} from 'lucide-react';
import { useGameStore } from '../game/store';
import { missionsForDay, type FounderMission, type MissionChoice, type DialogueLine } from '../game/missions';
import { sound } from '../game/audio';
import { CharacterSprite, type CharacterId, type Expression } from './CharacterSprite';

interface ActiveMissionHUDProps {
  app: 'sprint' | 'repo' | 'preview' | 'browser' | 'qa' | 'chat';
}

const typeIcons: Record<string, any> = {
  sprint_triage: CalendarClock,
  code_audit: GitBranch,
  staging_test: Globe,
  client_escalation: MessageSquare,
  qa_triage: ShieldCheck,
  standup: MessageSquare,
};

const typeLabels: Record<string, string> = {
  sprint_triage: 'TASK BOARD TRIAGE',
  code_audit: 'CODE STUDIO AUDIT',
  staging_test: 'LIVE STAGING SMOKE TEST',
  client_escalation: 'CLIENT DESK ESCALATION',
  qa_triage: 'QA LAB DEFECT TRIAGE',
  standup: 'TEAM STAND-UP',
};

const characterColors: Record<CharacterId, { bg: string; accent: string; border: string }> = {
  kunal: { bg: '#fff7ed', accent: '#f59e0b', border: '#fbbf24' },
  aarav: { bg: '#eff6ff', accent: '#0284c7', border: '#38bdf8' },
  varun: { bg: '#faf5ff', accent: '#9333ea', border: '#c084fc' },
  meera: { bg: '#fff1f2', accent: '#e11d48', border: '#fb7185' },
  nikhil: { bg: '#f8fafc', accent: '#475569', border: '#94a3b8' },
  prakash: { bg: '#fefce8', accent: '#d97706', border: '#f59e0b' },
  bunty: { bg: '#eef2ff', accent: '#4f46e5', border: '#818cf8' },
  founder: { bg: '#f7fee7', accent: '#65a30d', border: '#a3e635' },
};

export default function ActiveMissionHUD({ app }: ActiveMissionHUDProps) {
  const day = useGameStore((state) => state.day);
  const completedMissionIds = useGameStore((state) => state.completedMissionIds);
  const completeFounderMission = useGameStore((state) => state.completeFounderMission);

  const [expanded, setExpanded] = useState<boolean>(true);
  const [showStandupModal, setShowStandupModal] = useState<boolean>(false);
  const [standupStep, setStandupStep] = useState<number>(0);
  const [selectedChoice, setSelectedChoice] = useState<MissionChoice | null>(null);

  const dayMissions = useMemo(() => missionsForDay(day), [day]);
  const activeMission: FounderMission | null = useMemo(() => {
    return dayMissions.find((m) => !completedMissionIds.includes(m.id)) ?? null;
  }, [dayMissions, completedMissionIds]);

  const isTargetApp = activeMission && (activeMission.appTarget === app || (app === 'sprint' && activeMission.missionType === 'sprint_triage') || (app === 'repo' && activeMission.missionType === 'code_audit') || (app === 'preview' && activeMission.missionType === 'staging_test'));

  if (!activeMission || !isTargetApp) {
    return null;
  }

  const TypeIcon = typeIcons[activeMission.missionType || 'standup'] || Target;
  const typeLabel = typeLabels[activeMission.missionType || 'standup'] || 'MISSION OBJECTIVE';

  const handleExecuteChoice = (choice: MissionChoice) => {
    sound.playSuccess();
    setSelectedChoice(choice);
    completeFounderMission(activeMission.id, choice.id);
  };

  const handleNextDialogue = () => {
    sound.playClick(true);
    if (activeMission && standupStep < activeMission.dialogue.length - 1) {
      setStandupStep((prev) => prev + 1);
    }
  };

  const currentDialogue = activeMission.dialogue[standupStep] || activeMission.dialogue[0];

  return (
    <>
      <div className="active-mission-hud">
        <div className="mission-hud-topline" onClick={() => setExpanded(!expanded)}>
          <div className="mission-hud-badge">
            <TypeIcon size={14} className="hud-type-icon" />
            <span>{typeLabel}</span>
          </div>
          <div className="mission-hud-title-wrap">
            <span className="mission-hud-target">
              <Target size={12} /> DAY {day} MISSION:
            </span>
            <strong>{activeMission.title}</strong>
          </div>
          <div className="mission-hud-actions">
            <button
              className="mission-hud-standup-btn"
              onClick={(e) => {
                e.stopPropagation();
                sound.playClick();
                setShowStandupModal(true);
                setStandupStep(0);
              }}
              title="Hear what the team has to say in stand-up"
            >
              <Volume2 size={13} /> Team Stand-up
            </button>
            <button className="mission-hud-toggle" title={expanded ? 'Collapse' : 'Expand'}>
              {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {expanded && (
            <motion.div
              className="mission-hud-body"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <p className="mission-hud-brief">{activeMission.briefing}</p>

              {/* Simulation Objectives Checklist */}
              {activeMission.simulationObjectives && activeMission.simulationObjectives.length > 0 && (
                <div className="mission-hud-objectives">
                  <div className="hud-obj-title">INSPECTION CHECKLIST & CRITERIA:</div>
                  <div className="hud-obj-grid">
                    {activeMission.simulationObjectives.map((obj, i) => (
                      <div key={obj.id} className="hud-obj-item">
                        <span className="hud-obj-num">0{i + 1}</span>
                        <div>
                          <strong>{obj.label}</strong>
                          <small>{obj.hint}</small>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* In-App Tactical Solutions Bar */}
              <div className="mission-hud-solutions">
                <div className="hud-solutions-title">
                  <Sparkles size={13} /> CHOOSE TACTICAL SOLUTION:
                </div>
                <div className="hud-choices-grid">
                  {activeMission.choices.map((choice) => (
                    <button
                      key={choice.id}
                      className="hud-choice-card"
                      onClick={() => handleExecuteChoice(choice)}
                    >
                      <div className="hud-choice-label">{choice.label}</div>
                      <div className="hud-choice-detail">{choice.detail}</div>
                      <div className="hud-choice-footer">
                        <span>Execute Strategy</span>
                        <ArrowRight size={13} />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Stand-up Discussion Overlay Modal (Accessible directly from in-app HUD) */}
      <AnimatePresence>
        {showStandupModal && activeMission && (
          <motion.div
            className="mission-scene-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowStandupModal(false)}
          >
            <motion.div
              className="mission-scene-modal"
              initial={{ opacity: 0, y: 16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="mission-scene-close"
                onClick={() => setShowStandupModal(false)}
                aria-label="Close"
              >
                <X size={18} />
              </button>

              <div className="mission-scene-topline">
                <span>
                  DAY {day} · STORY STAND-UP · {activeMission.location}
                </span>
                <span className="mission-hud-badge">
                  <TypeIcon size={12} /> {typeLabel}
                </span>
              </div>

              {/* Speaker Box */}
              <div className="mission-novel-stage">
                <div className="mission-novel-speaker-card">
                  <CharacterSprite
                    character={currentDialogue.speaker}
                    size="lg"
                    expression={currentDialogue.expression}
                    speaking
                  />
                  <div className="mission-speaker-meta">
                    <strong>{currentDialogue.name}</strong>
                    <small>{currentDialogue.role}</small>
                  </div>
                </div>

                <div className="mission-novel-speech-panel">
                  <div className="mission-novel-speech-counter">
                    LINE {standupStep + 1} OF {activeMission.dialogue.length}
                  </div>
                  <div className="mission-novel-text">{currentDialogue.text}</div>

                  <div className="mission-novel-controls">
                    <button
                      className="mission-novel-btn secondary"
                      onClick={() => setStandupStep((p) => Math.max(0, p - 1))}
                      disabled={standupStep === 0}
                    >
                      Previous
                    </button>
                    {standupStep < activeMission.dialogue.length - 1 ? (
                      <button className="mission-novel-btn primary" onClick={handleNextDialogue}>
                        Next Line <ArrowRight size={14} />
                      </button>
                    ) : (
                      <button
                        className="mission-novel-btn primary"
                        onClick={() => setShowStandupModal(false)}
                      >
                        Return to {app.toUpperCase()} & Execute Solution <Check size={14} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

