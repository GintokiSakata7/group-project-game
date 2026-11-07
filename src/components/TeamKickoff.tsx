import { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, ClipboardCheck, Code2, MessageSquare, Rocket, ShieldCheck, Users } from 'lucide-react';
import { useGameStore } from '../game/store';
import { CharacterSprite, type CharacterId } from './CharacterSprite';

const workstreams = [
  { id: 'communication', title: 'Client & Content', detail: 'Client updates, website copy, SEO and handover.', icon: MessageSquare },
  { id: 'frontend', title: 'Frontend Build', detail: 'Homepage, catalogue and responsive UI.', icon: Code2 },
  { id: 'technical', title: 'Technical Direction', detail: 'Architecture, integration and technical decisions.', icon: Rocket },
  { id: 'quality', title: 'QA & Release Checks', detail: 'Test flows, defects and acceptance criteria.', icon: ShieldCheck },
  { id: 'backend', title: 'Backend & Deployment', detail: 'Enquiry flow, API and production release.', icon: ClipboardCheck },
];

const team = [
  { id: 'kunal', name: 'Kunal', title: 'Chief Motivation Officer', prompt: 'Can you own client communication without promising a lifetime supply of features?' },
  { id: 'aarav', name: 'Aarav', title: 'Full-Stack Vibe Coder', prompt: 'Which part of the build are you willing to make work outside the AI preview?' },
  { id: 'varun', name: 'Varun', title: 'Technical Lead', prompt: 'Pick a workstream where you can show evidence, not just diagrams.' },
  { id: 'meera', name: 'Meera', title: 'Quality Assurance', prompt: 'You own quality. Please rank blockers before testing the shadows.' },
  { id: 'nikhil', name: 'Nikhil', title: 'Backend Developer', prompt: 'A specific backend deliverable. A specific handoff. A specific day, please.' },
] as const;

export default function TeamKickoff() {
  const savedAssignments = useGameStore((state) => state.roleAssignments);
  const completeKickoff = useGameStore((state) => state.completeKickoff);
  const [assignments, setAssignments] = useState<Record<string, string>>({ ...savedAssignments });
  const [showBrief, setShowBrief] = useState(false);

  const assignmentSummary = useMemo(() => team.map((person) => ({
    name: person.name,
    stream: workstreams.find((stream) => stream.id === assignments[person.id])?.title ?? 'Unassigned',
  })), [assignments]);
  const assignmentsValid = team.every((person) => workstreams.some((stream) => stream.id === assignments[person.id]))
    && new Set(team.map((person) => assignments[person.id])).size === team.length;

  return (
    <main className="kickoff-screen">
      <div className="kickoff-noise" />
      <header className="kickoff-header"><span className="kickoff-brand">PANIC <em>LABS</em></span><span>CHAPTER 02 · THE KICKOFF</span><span className="kickoff-deadline">7 DAYS TO DELIVERY</span></header>
      <motion.section className="kickoff-panel" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="kickoff-title"><span className="kickoff-kicker"><Users size={16} /> EMERGENCY TEAM MEETING</span><h1>THE CLIENT SAID YES.<br /><em>Now make the team useful.</em></h1><p>Mr. Prakash has signed. The advance is in. Bunty is already typing. Before Day 1 begins, assign clear ownership.</p></div>
        <div className="kickoff-rule"><b>FOUNDER'S RULE</b><span>One owner per workstream. Everyone can help; nobody gets to say “I thought someone else was doing it.”</span></div>
        <div className="kickoff-team-grid">
          {team.map((person, index) => {
            const stream = workstreams.find((item) => item.id === assignments[person.id]) ?? workstreams[index];
            return <motion.article key={person.id} className="kickoff-member-card" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.06 }}>
              <div className={`kickoff-member-art kickoff-${person.id}`}><CharacterSprite character={person.id as CharacterId} size="lg" expression={person.id === 'meera' ? 'shocked' : person.id === 'nikhil' ? 'exhausted' : 'happy'} speaking /></div>
              <div className="kickoff-member-info"><span className="kickoff-member-index">TEAM MEMBER 0{index + 1}</span><h2>{person.name}</h2><b>{person.title}</b><p>{person.prompt}</p></div>
              <label htmlFor={`role-${person.id}`}>PRIMARY OWNERSHIP</label>
              <select id={`role-${person.id}`} value={assignments[person.id] ?? stream.id} onChange={(event) => setAssignments((current) => ({ ...current, [person.id]: event.target.value }))}>
                {workstreams.map((option) => { const taken = team.some((other) => other.id !== person.id && assignments[other.id] === option.id); return <option key={option.id} value={option.id} disabled={taken}>{option.title}{taken ? ' · assigned' : ''}</option>; })}
              </select>
              <div className="kickoff-role-detail">{stream.detail}</div>
            </motion.article>;
          })}
        </div>
        <div className="kickoff-bottom">
          <button className="kickoff-preview-button" onClick={() => setShowBrief((value) => !value)}>{showBrief ? 'HIDE' : 'REVIEW'} ASSIGNMENT SUMMARY</button>
          <button className="kickoff-start-button" disabled={!assignmentsValid} onClick={() => completeKickoff(assignments)}>LOCK ROLES & START DAY 1 <ArrowRight size={19} /></button>
        </div>
        {showBrief && <div className="kickoff-summary">{assignmentSummary.map((item) => <span key={item.name}><b>{item.name}</b><small>{item.stream}</small></span>)}</div>}
        <div className="kickoff-footer-note">ONE PRIMARY OWNER PER WORKSTREAM · THE FOUNDER HAS THE LAST WORD.</div>
      </motion.section>
    </main>
  );
}
