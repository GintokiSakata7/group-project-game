import { useState, useEffect, useMemo } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  FastForward,
  MapPin,
  MessageSquare,
  Sparkles,
  Target,
  Trophy,
  Volume2,
  X,
  Zap,
} from 'lucide-react';
import { useGameStore } from '../game/store';
import { missionsForDay, type FounderMission, type MissionChoice, type DialogueLine } from '../game/missions';
import { CharacterSprite, type CharacterId, type Expression } from './CharacterSprite';
import { sound } from '../game/audio';

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

const characterNames: Record<CharacterId, string> = {
  kunal: 'Kunal',
  aarav: 'Aarav',
  varun: 'Varun',
  meera: 'Meera',
  nikhil: 'Nikhil',
  prakash: 'Mr. Prakash',
  bunty: 'Bunty',
  founder: 'You (Founder)',
};

export default function MissionControl({ day }: { day: number }) {
  const completedMissionIds = useGameStore((state) => state.completedMissionIds);
  const completeFounderMission = useGameStore((state) => state.completeFounderMission);

  const [missionId, setMissionId] = useState<string | null>(null);
  const [phase, setPhase] = useState<'dialogue' | 'decision' | 'reaction' | 'cleared'>('dialogue');
  const [step, setStep] = useState<number>(0);
  const [reactionStep, setReactionStep] = useState<number>(0);
  const [result, setResult] = useState<MissionChoice | null>(null);
  const [showLogDrawer, setShowLogDrawer] = useState<boolean>(false);

  const dayMissions = useMemo(() => missionsForDay(day), [day]);
  const completedCount = dayMissions.filter((mission) => completedMissionIds.includes(mission.id)).length;
  const currentMission = dayMissions.find((mission) => !completedMissionIds.includes(mission.id)) ?? null;
  const selectedMission = missionId ? dayMissions.find((mission) => mission.id === missionId) ?? null : null;

  const dialogueList: DialogueLine[] = useMemo(() => {
    if (!selectedMission) return [];
    if (selectedMission.dialogue && selectedMission.dialogue.length > 0) {
      return selectedMission.dialogue;
    }
    // Fallback if no dialogue array
    return [
      {
        speaker: selectedMission.character,
        name: characterNames[selectedMission.character] || selectedMission.character,
        role: selectedMission.characterRole,
        expression: 'talking' as Expression,
        text: selectedMission.briefing,
      },
    ];
  }, [selectedMission]);

  const currentDialogue = dialogueList[step] || dialogueList[0];

  const reactionList: DialogueLine[] = useMemo(() => {
    if (!result?.reactions || result.reactions.length === 0) return [];
    return result.reactions;
  }, [result]);

  const currentReaction = reactionList[reactionStep] || null;

  const startMission = (mission: FounderMission) => {
    sound.playClick();
    setMissionId(mission.id);
    setPhase('dialogue');
    setStep(0);
    setReactionStep(0);
    setResult(null);
    setShowLogDrawer(false);
  };

  const closeModal = () => {
    sound.playClick();
    setMissionId(null);
    setResult(null);
    setPhase('dialogue');
    setStep(0);
    setReactionStep(0);
    setShowLogDrawer(false);
  };

  const handleNextDialogue = () => {
    sound.playClick(true);
    if (step < dialogueList.length - 1) {
      setStep((prev) => prev + 1);
    } else {
      setPhase('decision');
    }
  };

  const handlePrevDialogue = () => {
    sound.playClick(true);
    if (step > 0) {
      setStep((prev) => prev - 1);
    }
  };

  const handleSkipToDecision = () => {
    sound.playClick();
    setStep(dialogueList.length - 1);
    setPhase('decision');
  };

  const handleChoose = (choice: MissionChoice) => {
    if (!selectedMission) return;
    sound.playSuccess();
    completeFounderMission(selectedMission.id, choice.id);
    setResult(choice);
    if (choice.reactions && choice.reactions.length > 0) {
      setPhase('reaction');
      setReactionStep(0);
    } else {
      setPhase('cleared');
    }
  };

  const handleNextReaction = () => {
    sound.playClick(true);
    if (reactionStep < reactionList.length - 1) {
      setReactionStep((prev) => prev + 1);
    } else {
      sound.playSuccess();
      setPhase('cleared');
    }
  };

  // Keyboard navigation
  useEffect(() => {
    if (!selectedMission) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if modifier keys are pressed
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      if (e.key === 'Escape') {
        if (showLogDrawer) {
          setShowLogDrawer(false);
        } else {
          closeModal();
        }
        return;
      }

      if (e.key === ' ' || e.key === 'Enter' || e.key === 'ArrowRight') {
        e.preventDefault();
        if (phase === 'dialogue') {
          handleNextDialogue();
        } else if (phase === 'reaction') {
          handleNextReaction();
        } else if (phase === 'cleared') {
          closeModal();
        }
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        if (phase === 'dialogue') {
          handlePrevDialogue();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedMission, phase, step, dialogueList.length, reactionStep, reactionList.length, showLogDrawer]);

  return (
    <>
      <section className="founder-mission-board">
        <div className="mission-board-heading">
          <div>
            <span className="mission-kicker">
              <Target size={15} /> FOUNDER'S STORY MISSIONS
            </span>
            <h2>{currentMission ? 'Your next move.' : 'Day objectives cleared.'}</h2>
            <p>
              {currentMission
                ? 'The team will not move itself. Gather in the room and lead the discussion.'
                : 'You handled today’s key situations. The team is waiting for your next instruction.'}
            </p>
          </div>
          <div className="mission-progress-badge">
            <b>{completedCount}/{dayMissions.length}</b>
            <span>MISSIONS CLEARED</span>
          </div>
        </div>

        <div className="mission-track">
          <i style={{ width: `${dayMissions.length ? (completedCount / dayMissions.length) * 100 : 100}%` }} />
        </div>

        {currentMission ? (
          <div className="current-mission-card">
            <div className="mission-card-number">0{completedCount + 1}</div>
            <div className="mission-card-content">
              <span className="mission-location">
                <MapPin size={13} /> {currentMission.location}
              </span>
              <h3>{currentMission.title}</h3>
              <p>{currentMission.objective}</p>
              <div className="mission-reward-note">
                INTERACTIVE GROUP DISCUSSION · ALL CHARACTERS SPEAK · CONSEQUENCES CARRY FORWARD
              </div>
            </div>
            <button className="mission-start-button" onClick={() => startMission(currentMission)}>
              START DISCUSSION <ArrowRight size={17} />
            </button>
          </div>
        ) : (
          <div className="mission-cleared-card">
            <Trophy size={24} />
            <div>
              <b>MAIN STORY MISSIONS COMPLETE</b>
              <span>Review the team or workstation if you want. When ready, close the day.</span>
            </div>
            <span className="mission-cleared-check">
              <Check size={18} />
            </span>
          </div>
        )}

        {dayMissions.map((mission, index) => (
          <div
            className={`mission-mini-row ${
              completedMissionIds.includes(mission.id)
                ? 'is-cleared'
                : mission.id === currentMission?.id
                ? 'is-current'
                : 'is-locked'
            }`}
            key={mission.id}
          >
            <span>
              {completedMissionIds.includes(mission.id) ? <Check size={14} /> : `0${index + 1}`}
            </span>
            <b>{mission.title}</b>
            <small>
              {completedMissionIds.includes(mission.id)
                ? 'CLEARED'
                : mission.id === currentMission?.id
                ? 'AVAILABLE NOW'
                : 'UP NEXT'}
            </small>
          </div>
        ))}
      </section>

      {/* Interactive Visual Novel Meeting Modal */}
      <AnimatePresence>
        {selectedMission && (
          <motion.div
            className="mission-scene-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.section
              className="mission-scene-modal"
              initial={{ opacity: 0, y: 22, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12 }}
            >
              {/* Close Button */}
              <button className="mission-scene-close" onClick={closeModal} aria-label="Close discussion">
                <X size={19} />
              </button>

              {/* Modal Topline */}
              <div className="mission-scene-topline">
                <span>
                  DAY {day} · STORY MISSION {completedCount + (result ? 0 : 1)} / {dayMissions.length}
                </span>
                <span>
                  <MapPin size={13} /> {selectedMission.location}
                </span>
              </div>

              {/* Attendees Roster Bar */}
              <div className="mission-attendees-bar">
                <div className="mission-attendees-label">
                  <Volume2 size={13} /> ATTENDEES IN MEETING:
                </div>
                <div className="mission-attendees-chips">
                  {(selectedMission.attendees || ['kunal', 'aarav', 'varun', 'meera', 'nikhil']).map((charId) => {
                    const isSpeaking =
                      (phase === 'dialogue' && currentDialogue?.speaker === charId) ||
                      (phase === 'reaction' && currentReaction?.speaker === charId);
                    const color = characterColors[charId] || characterColors.founder;
                    return (
                      <div
                        key={charId}
                        className={`mission-attendee-chip ${isSpeaking ? 'is-speaking' : ''}`}
                        style={{
                          borderColor: isSpeaking ? color.accent : 'rgba(255,255,255,0.12)',
                          boxShadow: isSpeaking ? `0 0 16px ${color.accent}66` : 'none',
                        }}
                      >
                        <CharacterSprite character={charId} size="sm" expression={isSpeaking ? 'talking' : 'neutral'} />
                        <div className="mission-attendee-meta">
                          <b>{characterNames[charId] || charId}</b>
                          {isSpeaking && <span className="mission-speaking-pulse">SPEAKING</span>}
                        </div>
                      </div>
                    );
                  })}
                  <div
                    className={`mission-attendee-chip ${phase === 'decision' ? 'is-speaking' : ''}`}
                    style={{
                      borderColor: phase === 'decision' ? '#a3e635' : 'rgba(255,255,255,0.12)',
                      boxShadow: phase === 'decision' ? '0 0 16px #a3e63566' : 'none',
                    }}
                  >
                    <CharacterSprite character="founder" size="sm" expression={phase === 'decision' ? 'talking' : 'neutral'} />
                    <div className="mission-attendee-meta">
                      <b>You (Founder)</b>
                      {phase === 'decision' && <span className="mission-speaking-pulse">YOUR TURN</span>}
                    </div>
                  </div>
                </div>
              </div>

              {/* Meeting Stage Body */}
              <div className="mission-scene-body">
                {/* Left: Active Character Spotlight */}
                <div className="mission-character-stage">
                  <div
                    className="mission-character-glow"
                    style={{
                      background:
                        phase === 'decision'
                          ? '#a3e63533'
                          : phase === 'cleared'
                          ? '#10b98133'
                          : phase === 'reaction' && currentReaction
                          ? `${characterColors[currentReaction.speaker]?.accent || '#c084fc'}33`
                          : `${characterColors[currentDialogue?.speaker]?.accent || '#c084fc'}33`,
                    }}
                  />
                  {phase === 'decision' ? (
                    <>
                      <CharacterSprite character="founder" size="xl" expression="talking" speaking={true} />
                      <span style={{ color: '#a3e635' }}>YOU (FOUNDER)</span>
                      <small>Founder & Decision Maker</small>
                      <div className="mission-speaker-pill" style={{ background: '#a3e635', color: '#1a1026' }}>
                        <Zap size={12} /> YOUR CALL
                      </div>
                    </>
                  ) : phase === 'reaction' && currentReaction ? (
                    <>
                      <CharacterSprite
                        character={currentReaction.speaker}
                        size="xl"
                        expression={currentReaction.expression || 'talking'}
                        speaking={true}
                      />
                      <span>{currentReaction.name.toUpperCase()}</span>
                      <small>{currentReaction.role}</small>
                      <div className="mission-speaker-pill">
                        <Volume2 size={12} /> REACTING
                      </div>
                    </>
                  ) : phase === 'cleared' ? (
                    <>
                      <CharacterSprite
                        character={selectedMission.character}
                        size="xl"
                        expression="happy"
                        speaking={false}
                      />
                      <span style={{ color: '#34d399' }}>MISSION COMPLETE</span>
                      <small>{selectedMission.title}</small>
                      <div className="mission-speaker-pill" style={{ background: '#10b981', color: '#fff' }}>
                        <Check size={12} /> RESOLVED
                      </div>
                    </>
                  ) : (
                    <>
                      <CharacterSprite
                        character={currentDialogue.speaker}
                        size="xl"
                        expression={currentDialogue.expression || 'talking'}
                        speaking={true}
                      />
                      <span>{currentDialogue.name.toUpperCase()}</span>
                      <small>{currentDialogue.role}</small>
                      <div className="mission-speaker-pill">
                        <Volume2 size={12} /> SPEAKING
                      </div>
                    </>
                  )}
                </div>

                {/* Right: Dynamic Interactive Content */}
                <div className="mission-dialogue-content">
                  <div className="mission-header-row">
                    <span className="mission-objective-tag">
                      <Target size={14} /> {selectedMission.title}
                    </span>
                    {phase === 'dialogue' && (
                      <span className="mission-step-indicator">
                        DISCUSSION LINE {step + 1} OF {dialogueList.length}
                      </span>
                    )}
                    {phase === 'reaction' && (
                      <span className="mission-step-indicator">
                        REACTION {reactionStep + 1} OF {reactionList.length}
                      </span>
                    )}
                  </div>

                  {/* Phase 1: One-by-One Dialogue Discussion */}
                  {phase === 'dialogue' && (
                    <div className="mission-vn-speech-container">
                      <div
                        className="mission-vn-speech-box"
                        style={{
                          borderLeftColor: characterColors[currentDialogue.speaker]?.accent || '#fbbf24',
                        }}
                      >
                        <div className="mission-vn-speaker-tag">
                          <span
                            className="speaker-badge"
                            style={{
                              backgroundColor: characterColors[currentDialogue.speaker]?.accent || '#fbbf24',
                              color: '#1a1026',
                            }}
                          >
                            {currentDialogue.name}
                          </span>
                          <span className="speaker-role-label">{currentDialogue.role}</span>
                        </div>
                        <p className="mission-vn-speech-text">“{currentDialogue.text}”</p>
                      </div>

                      {/* Controls */}
                      <div className="mission-vn-controls">
                        <div className="mission-vn-left-controls">
                          <button
                            className="mission-nav-btn prev-btn"
                            onClick={handlePrevDialogue}
                            disabled={step === 0}
                            title="Previous line (Left Arrow)"
                          >
                            <ArrowLeft size={16} /> PREV
                          </button>
                          <button
                            className="mission-nav-btn log-btn"
                            onClick={() => setShowLogDrawer(true)}
                            title="View discussion transcript"
                          >
                            <MessageSquare size={16} /> CHAT LOG ({step + 1}/{dialogueList.length})
                          </button>
                        </div>

                        <div className="mission-vn-right-controls">
                          <button
                            className="mission-nav-btn skip-btn"
                            onClick={handleSkipToDecision}
                            title="Skip straight to founder choices"
                          >
                            <FastForward size={15} /> SKIP TO CHOICES
                          </button>
                          <button
                            className="mission-nav-btn next-btn"
                            onClick={handleNextDialogue}
                            title="Next line (Space or Enter)"
                          >
                            {step < dialogueList.length - 1 ? (
                              <>
                                NEXT <ArrowRight size={17} />
                              </>
                            ) : (
                              <>
                                MAKE YOUR CALL <Zap size={17} />
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                      <div className="mission-keyboard-hint">
                        <span>
                          Tip: Press <kbd>Space</kbd>, <kbd>Enter</kbd> or <kbd>→</kbd> to advance dialogue
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Phase 2: Founder Decision */}
                  {phase === 'decision' && (
                    <motion.div
                      className="mission-decision-stage"
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <div className="mission-response-label">
                        <Zap size={14} /> WHAT DO YOU DO, FOUNDER?
                      </div>
                      <div className="mission-choice-list">
                        {selectedMission.choices.map((choice, index) => (
                          <button
                            key={choice.id}
                            className="mission-choice-card"
                            onClick={() => handleChoose(choice)}
                          >
                            <span className="mission-choice-index">0{index + 1}</span>
                            <span className="mission-choice-body">
                              <b>{choice.label}</b>
                              <small>{choice.detail}</small>
                            </span>
                            <ArrowRight size={18} className="choice-arrow" />
                          </button>
                        ))}
                      </div>
                      <div className="mission-decision-footer-note">
                        <button
                          className="review-dialogue-link"
                          onClick={() => {
                            setPhase('dialogue');
                            setStep(dialogueList.length - 1);
                          }}
                        >
                          <ArrowLeft size={14} /> Review discussion lines
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* Phase 3: Character Reaction Banter */}
                  {phase === 'reaction' && currentReaction && (
                    <motion.div
                      className="mission-vn-speech-container"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <div className="mission-reaction-kicker">
                        <Sparkles size={14} /> TEAM REACTION TO YOUR CALL
                      </div>
                      <div
                        className="mission-vn-speech-box reaction-mode"
                        style={{
                          borderLeftColor: characterColors[currentReaction.speaker]?.accent || '#38bdf8',
                        }}
                      >
                        <div className="mission-vn-speaker-tag">
                          <span
                            className="speaker-badge"
                            style={{
                              backgroundColor: characterColors[currentReaction.speaker]?.accent || '#38bdf8',
                              color: '#1a1026',
                            }}
                          >
                            {currentReaction.name}
                          </span>
                          <span className="speaker-role-label">{currentReaction.role}</span>
                        </div>
                        <p className="mission-vn-speech-text">“{currentReaction.text}”</p>
                      </div>

                      <div className="mission-vn-controls">
                        <button
                          className="mission-nav-btn log-btn"
                          onClick={() => setShowLogDrawer(true)}
                        >
                          <MessageSquare size={16} /> VIEW CHAT LOG
                        </button>
                        <button
                          className="mission-nav-btn next-btn"
                          onClick={handleNextReaction}
                        >
                          {reactionStep < reactionList.length - 1 ? (
                            <>
                              NEXT REACTION <ArrowRight size={17} />
                            </>
                          ) : (
                            <>
                              SEE IMPACT <CheckCircle2 size={17} />
                            </>
                          )}
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* Phase 4: Mission Cleared Summary */}
                  {phase === 'cleared' && result && (
                    <motion.div
                      className="mission-result-stage"
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                    >
                      <div className="mission-result-banner">
                        <CheckCircle2 size={24} className="result-check-icon" />
                        <div>
                          <h3>MISSION CLEARED</h3>
                          <p>{selectedMission.title}</p>
                        </div>
                      </div>

                      <div className="mission-result-card">
                        <div className="result-decision-quote">
                          <span>YOUR DECISION:</span>
                          <b>{result.label}</b>
                        </div>
                        <p className="result-narrative">{result.reaction}</p>
                        {result.chatLine && (
                          <div className="result-slack-pill">
                            <span className="slack-tag">#general Slack update:</span>
                            <span className="slack-text">“{result.chatLine}”</span>
                          </div>
                        )}

                        {/* Stat impacts preview */}
                        <div className="result-impacts-row">
                          {typeof result.effects.quality === 'number' && (
                            <span className={`impact-chip ${result.effects.quality > 0 ? 'is-pos' : 'is-neg'}`}>
                              {result.effects.quality > 0 ? `+${result.effects.quality}%` : `${result.effects.quality}%`} Quality
                            </span>
                          )}
                          {typeof result.effects.technicalDebt === 'number' && (
                            <span className={`impact-chip ${result.effects.technicalDebt < 0 ? 'is-pos' : 'is-neg'}`}>
                              {result.effects.technicalDebt > 0 ? `+${result.effects.technicalDebt}%` : `${result.effects.technicalDebt}%`} Tech Debt
                            </span>
                          )}
                          {typeof result.effects.clientTrust === 'number' && (
                            <span className={`impact-chip ${result.effects.clientTrust > 0 ? 'is-pos' : 'is-neg'}`}>
                              {result.effects.clientTrust > 0 ? `+${result.effects.clientTrust}%` : `${result.effects.clientTrust}%`} Client Trust
                            </span>
                          )}
                          {typeof result.effects.morale === 'number' && (
                            <span className={`impact-chip ${result.effects.morale > 0 ? 'is-pos' : 'is-neg'}`}>
                              {result.effects.morale > 0 ? `+${result.effects.morale}%` : `${result.effects.morale}%`} Morale
                            </span>
                          )}
                          {typeof result.effects.scopeCreep === 'number' && (
                            <span className={`impact-chip ${result.effects.scopeCreep < 0 ? 'is-pos' : 'is-neg'}`}>
                              {result.effects.scopeCreep > 0 ? `+${result.effects.scopeCreep}%` : `${result.effects.scopeCreep}%`} Scope Creep
                            </span>
                          )}
                          {typeof result.effects.progress === 'number' && (
                            <span className={`impact-chip ${result.effects.progress > 0 ? 'is-pos' : 'is-neg'}`}>
                              {result.effects.progress > 0 ? `+${result.effects.progress}%` : `${result.effects.progress}%`} Progress
                            </span>
                          )}
                        </div>
                      </div>

                      <button className="mission-return-button" onClick={closeModal}>
                        RETURN TO THE OFFICE <ArrowRight size={18} />
                      </button>
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Chat Log Modal Drawer */}
              <AnimatePresence>
                {showLogDrawer && (
                  <motion.div
                    className="dialogue-transcript-drawer"
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 40 }}
                  >
                    <div className="drawer-header">
                      <div className="drawer-title">
                        <MessageSquare size={17} /> MEETING TRANSCRIPT
                      </div>
                      <button
                        className="drawer-close-btn"
                        onClick={() => setShowLogDrawer(false)}
                        aria-label="Close transcript"
                      >
                        <X size={17} />
                      </button>
                    </div>
                    <div className="drawer-body">
                      {dialogueList.slice(0, step + 1).map((line, idx) => (
                        <div key={idx} className="drawer-dialogue-row">
                          <CharacterSprite character={line.speaker} size="sm" expression={line.expression} />
                          <div className="drawer-dialogue-bubble">
                            <div className="drawer-speaker-line">
                              <b style={{ color: characterColors[line.speaker]?.accent || '#ffd77f' }}>
                                {line.name}
                              </b>
                              <small>{line.role}</small>
                            </div>
                            <p>“{line.text}”</p>
                          </div>
                        </div>
                      ))}
                      {phase === 'reaction' && (
                        <div className="drawer-reaction-section">
                          <span className="drawer-section-divider">Post-Decision Reactions:</span>
                          {reactionList.slice(0, reactionStep + 1).map((rLine, rIdx) => (
                            <div key={`r-${rIdx}`} className="drawer-dialogue-row">
                              <CharacterSprite character={rLine.speaker} size="sm" expression={rLine.expression} />
                              <div className="drawer-dialogue-bubble">
                                <div className="drawer-speaker-line">
                                  <b style={{ color: characterColors[rLine.speaker]?.accent || '#38bdf8' }}>
                                    {rLine.name}
                                  </b>
                                  <small>{rLine.role}</small>
                                </div>
                                <p>“{rLine.text}”</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Modal Footer */}
              <div className="mission-scene-footer">
                <span>INTERACTIVE FOUNDER STORY MODE · ACTIONS INFLUENCE ENDING</span>
                <span>NO BRANCHING CAMPAIGN · CONSEQUENCES CARRY FORWARD</span>
              </div>
            </motion.section>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
