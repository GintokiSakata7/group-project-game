import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, Check, MapPin, Target, Trophy, X } from 'lucide-react';
import { useGameStore } from '../game/store';
import { missionsForDay, type FounderMission, type MissionChoice } from '../game/missions';
import { CharacterSprite, type CharacterId } from './CharacterSprite';

export default function MissionControl({ day }: { day: number }) {
  const completedMissionIds = useGameStore((state) => state.completedMissionIds);
  const completeFounderMission = useGameStore((state) => state.completeFounderMission);
  const [missionId, setMissionId] = useState<string | null>(null);
  const [result, setResult] = useState<MissionChoice | null>(null);
  const dayMissions = useMemo(() => missionsForDay(day), [day]);
  const completedCount = dayMissions.filter((mission) => completedMissionIds.includes(mission.id)).length;
  const currentMission = dayMissions.find((mission) => !completedMissionIds.includes(mission.id)) ?? null;
  const selectedMission = missionId ? dayMissions.find((mission) => mission.id === missionId) ?? null : null;

  const startMission = (mission: FounderMission) => {
    setMissionId(mission.id);
    setResult(null);
  };

  const choose = (mission: FounderMission, choice: MissionChoice) => {
    completeFounderMission(mission.id, choice.id);
    setResult(choice);
  };

  return <>
    <section className="founder-mission-board">
      <div className="mission-board-heading">
        <div><span className="mission-kicker"><Target size={15} /> FOUNDER'S STORY MISSIONS</span><h2>{currentMission ? 'Your next move.' : 'Day objectives cleared.'}</h2><p>{currentMission ? 'The team will not move itself. Pick up the mission and make the call.' : 'You handled today’s key situations. The team is waiting for your next instruction.'}</p></div>
        <div className="mission-progress-badge"><b>{completedCount}/{dayMissions.length}</b><span>MISSIONS CLEARED</span></div>
      </div>
      <div className="mission-track"><i style={{ width: `${dayMissions.length ? (completedCount / dayMissions.length) * 100 : 100}%` }} /></div>
      {currentMission ? <div className="current-mission-card">
        <div className="mission-card-number">0{completedCount + 1}</div>
        <div className="mission-card-content"><span className="mission-location"><MapPin size={13} /> {currentMission.location}</span><h3>{currentMission.title}</h3><p>{currentMission.objective}</p><div className="mission-reward-note">DECISION IMPACTS PROJECT QUALITY, TRUST AND TEAM RELATIONSHIPS</div></div>
        <button className="mission-start-button" onClick={() => startMission(currentMission)}>START MISSION <ArrowRight size={17} /></button>
      </div> : <div className="mission-cleared-card"><Trophy size={24} /><div><b>MAIN STORY MISSIONS COMPLETE</b><span>Review the team or workstation if you want. When ready, close the day.</span></div><span className="mission-cleared-check"><Check size={18} /></span></div>}
      {dayMissions.map((mission, index) => <div className={`mission-mini-row ${completedMissionIds.includes(mission.id) ? 'is-cleared' : mission.id === currentMission?.id ? 'is-current' : 'is-locked'}`} key={mission.id}><span>{completedMissionIds.includes(mission.id) ? <Check size={14} /> : `0${index + 1}`}</span><b>{mission.title}</b><small>{completedMissionIds.includes(mission.id) ? 'CLEARED' : mission.id === currentMission?.id ? 'AVAILABLE NOW' : 'UP NEXT'}</small></div>)}
    </section>

    <AnimatePresence>
      {selectedMission && <motion.div className="mission-scene-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <motion.section className="mission-scene-modal" initial={{ opacity: 0, y: 22, scale: .97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12 }}>
          <button className="mission-scene-close" onClick={() => { setMissionId(null); setResult(null); }} aria-label="Close mission"><X size={19} /></button>
          <div className="mission-scene-topline"><span>DAY {day} · MAIN STORY MISSION {completedCount + (result ? 0 : 1)} / {dayMissions.length}</span><span><MapPin size={13} /> {selectedMission.location}</span></div>
          <div className="mission-scene-body">
            <div className="mission-character-stage"><div className="mission-character-glow"/><CharacterSprite character={selectedMission.character as CharacterId} size="xl" expression={result ? 'happy' : selectedMission.character === 'meera' ? 'shocked' : selectedMission.character === 'nikhil' ? 'exhausted' : 'talking'} speaking={!result}/><span>{selectedMission.character.toUpperCase()}</span><small>{selectedMission.characterRole}</small></div>
            <div className="mission-dialogue-content">
              <span className="mission-objective-tag"><Target size={14} /> YOUR OBJECTIVE</span>
              <h2>{selectedMission.title}</h2>
              <p className="mission-briefing">{result ? result.reaction : selectedMission.briefing}</p>
              {!result ? <><div className="mission-response-label">WHAT DO YOU DO?</div><div className="mission-choice-list">{selectedMission.choices.map((choice, index) => <button key={choice.id} onClick={() => choose(selectedMission, choice)}><span className="mission-choice-index">0{index + 1}</span><span><b>{choice.label}</b><small>{choice.detail}</small></span><ArrowRight size={18} /></button>)}</div></> : <div className="mission-result-block"><span><Check size={15}/> MISSION CLEARED</span><p>{result.chatLine ? `Group chat update: “${result.chatLine}”` : 'Your decision has been recorded. The team will react to it.'}</p><button className="mission-result-button" onClick={() => { setMissionId(null); setResult(null); }}>RETURN TO THE OFFICE <ArrowRight size={17} /></button></div>}
            </div>
          </div>
          <div className="mission-scene-footer"><span>YOUR DECISION IS RECORDED IN THE CAMPAIGN</span><span>NO BRANCHING CAMPAIGN · CONSEQUENCES CARRY FORWARD</span></div>
        </motion.section>
      </motion.div>}
    </AnimatePresence>
  </>;
}
