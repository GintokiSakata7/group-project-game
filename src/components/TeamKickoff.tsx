import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, ClipboardCheck, Code2, MessageSquare, Rocket, ShieldCheck, Users, Sparkles, MessageCircle } from 'lucide-react';
import { useGameStore } from '../game/store';
import { CharacterSprite, type CharacterId } from './CharacterSprite';
import { sound } from '../game/audio';

const workstreams = [
  { id: 'communication', title: 'Client & Content', detail: 'Client updates, website copy, SEO and handover.', icon: MessageSquare },
  { id: 'frontend', title: 'Frontend Build', detail: 'Homepage, catalogue and responsive UI.', icon: Code2 },
  { id: 'technical', title: 'Technical Direction', detail: 'Architecture, integration and technical decisions.', icon: Rocket },
  { id: 'quality', title: 'QA & Release Checks', detail: 'Test flows, defects and acceptance criteria.', icon: ShieldCheck },
  { id: 'backend', title: 'Backend & Deployment', detail: 'Enquiry flow, API and production release.', icon: ClipboardCheck },
];

const team = [
  {
    id: 'kunal',
    name: 'Kunal',
    title: 'Client Relations ("Chief Motivation Officer")',
    prompt: 'Can you own client communication and content without promising a lifetime supply of features?',
    banter: {
      communication: '“Leave Prakash Uncle to me! I speak fluent catering! While I keep the client fed with optimism, Aarav better make the buttons work!”',
      frontend: '“Wait, I’m building CSS?! Guys, my CSS has only two rules: font-size: 80px and background: rainbow. Meera, prepare the tissues.”',
      technical: '“I will align our holistic energy grid with the client’s chakra. That’s technical direction, right?”',
      quality: '“QA? Everything passes with a high five! Who needs test cases when you have unconditional love?”',
      backend: '“I will personally whisper to the server. If the database crashes, I’ll play a motivational harp.”',
    },
  },
  {
    id: 'aarav',
    name: 'Aarav',
    title: 'Full-Stack Vibe Coder',
    prompt: 'Which part of the build are you willing to make work outside the AI preview?',
    banter: {
      frontend: '“Frontend is locked. 14 CSS animations already running at 120 FPS. If Varun gives me a 40-page PDF instead of an API, I am deploying directly to main bro.”',
      communication: '“Bro I will just prompt the client emails. Subject: ‘Your catering site is so cooked bro, in a good way’.”',
      technical: '“Technical architecture? Just npm install everything. If the package count is under 400, are we even building software?”',
      quality: '“Me as QA?! Everything passes bro! 100% bug-free vibes! The broken buttons are just interactive art!”',
      backend: '“I prompted a SQLite database in 4 seconds. It might delete all tables on Sunday, but for now it’s vibing.”',
    },
  },
  {
    id: 'varun',
    name: 'Varun',
    title: 'Technical Lead',
    prompt: 'Pick a workstream where you can show evidence, not just diagrams.',
    banter: {
      technical: '“I have designed a 7-tier architectural roadmap for this single-page catering site. Notice how the event loop harmonizes with the biryani catalogue.”',
      frontend: '“I shall apply category theory to CSS margin-left. Expect the navbar by Thursday evening.”',
      communication: '“I will present Mr. Prakash with a 47-slide Miro deck explaining our message queues. He will be deeply enlightened.”',
      quality: '“I have established an ontological defect taxonomy. We will classify bugs into 14 philosophical categories.”',
      backend: '“The backend will be an immutable event-sourced CQRS architecture. For a contact form with 3 fields.”',
    },
  },
  {
    id: 'meera',
    name: 'Meera',
    title: 'Quality Assurance',
    prompt: 'You own quality. Please rank blockers before testing the shadows.',
    banter: {
      quality: '“I am ready. I inspected the staging preview. Clicking WhatsApp currently alerts ‘window.openWhatsAppEnquiry is a spiritual placeholder’. Nobody is going home until this is fixed.”',
      frontend: '“If I build frontend, every pixel will be audited with laser calipers. Aarav’s 14 gradients are being deleted immediately.”',
      communication: '“I will tell Mr. Prakash the exact unvarnished truth: nothing works yet and Bunty’s ideas violate international usability standards.”',
      technical: '“Varun, your architecture diagram has 3 arrow loops that go nowhere. I am logging your diagram as a blocker.”',
      backend: '“Nikhil, commit code before 3 AM or I am personally testing your localhost via carrier pigeon.”',
    },
  },
  {
    id: 'nikhil',
    name: 'Nikhil',
    title: 'Backend Developer',
    prompt: 'A specific backend deliverable. A specific handoff. A specific day, please.',
    banter: {
      backend: '“...western line flyover signal restored. backend API endpoints will exist. do not talk to me between 9 AM and 4 PM.”',
      frontend: '“...cannot open browser. too bright. terminal only.”',
      communication: '“seen.”',
      technical: '“...less diagrams. more code. push to main.”',
      quality: '“...my code has no bugs. only misunderstood features.”',
    },
  },
] as const;

export default function TeamKickoff() {
  const savedAssignments = useGameStore((state) => state.roleAssignments);
  const completeKickoff = useGameStore((state) => state.completeKickoff);
  const [assignments, setAssignments] = useState<Record<string, string>>({ ...savedAssignments });
  const [showBrief, setShowBrief] = useState(false);
  const [activeCommenter, setActiveCommenter] = useState<string>('kunal');

  const assignmentSummary = useMemo(
    () =>
      team.map((person) => ({
        name: person.name,
        stream: workstreams.find((stream) => stream.id === assignments[person.id])?.title ?? 'Unassigned',
      })),
    [assignments]
  );

  const assignmentsValid =
    team.every((person) => workstreams.some((stream) => stream.id === assignments[person.id])) &&
    new Set(team.map((person) => assignments[person.id])).size === team.length;

  const handleRoleChange = (memberId: string, roleId: string) => {
    sound.playClick();
    setAssignments((current) => ({ ...current, [memberId]: roleId }));
    setActiveCommenter(memberId);
  };

  const activePerson = team.find((t) => t.id === activeCommenter) ?? team[0];
  const activeRole = assignments[activePerson.id] as keyof typeof activePerson.banter;
  const currentBanter = activePerson.banter[activeRole] || activePerson.banter.communication;

  return (
    <main className="kickoff-screen">
      <div className="kickoff-noise" />
      <header className="kickoff-header">
        <span className="kickoff-brand">
          PANIC <em>LABS</em>
        </span>
        <span>CHAPTER 02 · THE KICKOFF</span>
        <span className="kickoff-deadline">7 DAYS TO DELIVERY</span>
      </header>

      <motion.section className="kickoff-panel" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="kickoff-title">
          <span className="kickoff-kicker">
            <Users size={16} /> EMERGENCY TEAM MEETING
          </span>
          <h1>
            THE CLIENT SAID YES.
            <br />
            <em>Now make the team useful.</em>
          </h1>
          <p>
            Mr. Prakash has signed. The advance is in. Nephew Bunty is already typing. Before Day 1 begins, assign clear
            ownership.
          </p>
        </div>

        {/* Live Teammate Commentary / Banter Box */}
        <div className="kickoff-banter-card">
          <div className="kickoff-banter-header">
            <div className="kickoff-banter-speaker">
              <CharacterSprite character={activePerson.id as CharacterId} size="sm" expression="talking" />
              <div>
                <strong>{activePerson.name} · {activePerson.title}</strong>
                <small>Reacting to role assignment</small>
              </div>
            </div>
            <span className="kickoff-banter-badge">
              <MessageCircle size={12} /> LIVE REACTION
            </span>
          </div>
          <p className="kickoff-banter-text">{currentBanter}</p>
        </div>

        <div className="kickoff-rule">
          <b>FOUNDER'S RULE</b>
          <span>
            One owner per workstream. Everyone can help; nobody gets to say “I thought someone else was doing it.”
          </span>
        </div>

        <div className="kickoff-team-grid">
          {team.map((person, index) => {
            const stream = workstreams.find((item) => item.id === assignments[person.id]) ?? workstreams[index];
            return (
              <motion.article
                key={person.id}
                className={`kickoff-member-card ${activeCommenter === person.id ? 'is-active-card' : ''}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.06 }}
                onClick={() => setActiveCommenter(person.id)}
              >
                <div className={`kickoff-member-art kickoff-${person.id}`}>
                  <CharacterSprite
                    character={person.id as CharacterId}
                    size="lg"
                    expression={person.id === 'meera' ? 'shocked' : person.id === 'nikhil' ? 'exhausted' : 'happy'}
                    speaking
                  />
                </div>
                <div className="kickoff-member-info">
                  <span className="kickoff-member-index">TEAM MEMBER 0{index + 1}</span>
                  <h2>{person.name}</h2>
                  <b>{person.title}</b>
                  <p>{person.prompt}</p>
                </div>
                <label htmlFor={`role-${person.id}`}>PRIMARY OWNERSHIP</label>
                <select
                  id={`role-${person.id}`}
                  value={assignments[person.id] ?? stream.id}
                  onChange={(event) => handleRoleChange(person.id, event.target.value)}
                >
                  {workstreams.map((option) => {
                    const taken = team.some((other) => other.id !== person.id && assignments[other.id] === option.id);
                    return (
                      <option key={option.id} value={option.id} disabled={taken}>
                        {option.title}
                        {taken ? ' · assigned' : ''}
                      </option>
                    );
                  })}
                </select>
                <div className="kickoff-role-detail">{stream.detail}</div>
              </motion.article>
            );
          })}
        </div>

        <div className="kickoff-bottom">
          <button className="kickoff-preview-button" onClick={() => setShowBrief((value) => !value)}>
            {showBrief ? 'HIDE' : 'REVIEW'} ASSIGNMENT SUMMARY
          </button>
          <button
            className="kickoff-start-button"
            disabled={!assignmentsValid}
            onClick={() => {
              sound.playSuccess();
              completeKickoff(assignments);
            }}
          >
            LOCK ROLES & START DAY 1 <ArrowRight size={19} />
          </button>
        </div>

        {showBrief && (
          <div className="kickoff-summary">
            {assignmentSummary.map((item) => (
              <span key={item.name}>
                <b>{item.name}</b>
                <small>{item.stream}</small>
              </span>
            ))}
          </div>
        )}

        <div className="kickoff-footer-note">
          ONE PRIMARY OWNER PER WORKSTREAM · THE FOUNDER HAS THE LAST WORD.
        </div>
      </motion.section>
    </main>
  );
}
