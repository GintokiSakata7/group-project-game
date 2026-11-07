import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, Building2, Check, PhoneCall, Sparkles, Users, Zap } from 'lucide-react';
import { useGameStore } from '../game/store';
import { CharacterSprite, type CharacterId, type Expression } from './CharacterSprite';

interface HireScene {
  character: CharacterId;
  name: string;
  title: string;
  expression: Expression;
  quote: string;
  talent: string;
  warning: string;
  badge: string;
}

const hires: HireScene[] = [
  {
    character: 'kunal', name: 'Kunal', title: 'Client Relations ("Chief Motivation Officer")', expression: 'happy',
    quote: '“TEAM! We are not building a product. We are building a LEGACY. I made a playlist called Deploy or Die.”',
    talent: 'Keeps the team cheerful and talks to clients confidently.', warning: 'Has never deployed anything. Including himself.', badge: 'HIRE #01 · HYPE DEPARTMENT',
  },
  {
    character: 'aarav', name: 'Aarav', title: 'Full-Stack Vibe Coder', expression: 'smug',
    quote: '“Bro, AI cooked. The whole frontend is done. I have not opened the browser yet, but the vibes are immaculate.”',
    talent: 'Can scaffold features at suspicious speed.', warning: 'May install 19 libraries to create one button.', badge: 'HIRE #02 · VIBE ENGINEERING',
  },
  {
    character: 'varun', name: 'Varun', title: 'Technical Lead', expression: 'neutral',
    quote: '“Everything is under control. I have designed a scalable architecture for the login page.”',
    talent: 'Can plan systems, coordinate tasks and sound convincing.', warning: 'The architecture may exist only in a 47-slide deck.', badge: 'HIRE #03 · DIAGRAMS & CONFIDENCE',
  },
  {
    character: 'meera', name: 'Meera', title: 'Quality Assurance', expression: 'shocked',
    quote: '“I tested the landing page. The logo is 2 pixels off-centre. I have stopped the release.”',
    talent: 'Finds real defects before the client does.', warning: 'Will test a button in emotional, spiritual and low-network conditions.', badge: 'HIRE #04 · QUALITY CONTROL',
  },
  {
    character: 'nikhil', name: 'Nikhil', title: 'Backend Developer', expression: 'exhausted',
    quote: '“seen”',
    talent: 'When he appears, he can solve problems nobody else can.', warning: 'His working hours are measured in lunar cycles.', badge: 'HIRE #05 · LAST SEEN: UNKNOWN',
  },
];

const founderScene = {
  character: 'founder' as CharacterId,
  name: 'You', title: 'Founder · CEO · Emergency Tea Technician', expression: 'smug' as Expression,
  quote: '“I have a laptop, a logo, a questionable business plan and five people who said they know software. What could possibly go wrong?”',
  talent: 'You make the calls. You own the company. You are legally responsible for the group chat.',
  warning: 'Current company balance: enough for tea. Maybe.',
  badge: 'DAY 00 · THE FOUNDER',
};

export default function Prologue() {
  const initialStep = Number(new URLSearchParams(window.location.search).get('step') || 0);
  const [step, setStep] = useState(initialStep);
  const [companyName, setCompanyName] = useState(useGameStore.getState().companyName || 'PANIC LABS');
  const [huddleChoice, setHuddleChoice] = useState<string | null>(null);
  const beginClientMeeting = useGameStore((state) => state.beginClientMeeting);
  const totalSteps = 1 + 1 + hires.length + 1;
  const isFoundation = step === 0;
  const isFounder = step === 1;
  const isHire = step >= 2 && step < 2 + hires.length;
  const isHuddle = step === 2 + hires.length;
  const hireIndex = step - 2;
  const scene = isFounder ? founderScene : isHire ? hires[hireIndex] : null;
  const hiredCount = Math.max(0, Math.min(hires.length, step - 2));
  const progress = Math.round((step / (totalSteps - 1)) * 100);

  const scrollStageTop = () => {
    try {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      document.querySelector('.story-screen')?.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {}
  };

  const chooseHuddle = (choice: string) => {
    setHuddleChoice(choice);
    setTimeout(() => {
      const el = document.querySelector('.huddle-response');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
  };

  const next = () => {
    if (isFoundation) {
      const clean = companyName.trim().slice(0, 24) || 'PANIC LABS';
      useGameStore.setState({ companyName: clean });
      setCompanyName(clean);
      setStep(1);
      scrollStageTop();
      return;
    }
    if (isHuddle) {
      if (!huddleChoice) return;
      beginClientMeeting();
      return;
    }
    setStep((current) => current + 1);
    scrollStageTop();
  };

  return (
    <main className="story-screen">
      <div className="story-bg-orb orb-one" /><div className="story-bg-orb orb-two" />
      <header className="story-topbar">
        <div className="new-brand"><span className="new-brand-mark">M</span><span>MAJIN STUDIOS <small>THE GROUP PROJECT</small></span></div>
        <div className="story-progress-wrap"><span>THE BEGINNING</span><div className="story-progress"><i style={{ width: `${Math.max(4, progress)}%` }} /></div><b>{Math.min(step + 1, totalSteps)} / {totalSteps}</b></div>
      </header>

      <section className="story-stage-wrap">
        <AnimatePresence mode="wait">
          {isFoundation ? (
            <motion.div key="foundation" className="foundation-scene" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}>
              <div className="chapter-label"><Building2 size={16} /> PROLOGUE · DAY ZERO</div>
              <div className="foundation-grid">
                <div className="foundation-art">
                  <div className="foundation-neon">YOUR OFFICE<br /><em>STARTS HERE.</em></div>
                  <div className="foundation-desk"><div className="foundation-monitor"><span>NO CLIENTS FOUND</span><b>YET.</b></div><div className="foundation-cup">☕</div></div>
                  <span className="foundation-sticker">RENT DUE IN 3 DAYS</span>
                </div>
                <div className="foundation-copy">
                  <span className="story-eyebrow">CHAPTER 00 · COMPANY FOUNDATION</span>
                  <h1>Every empire<br />starts somewhere.</h1>
                  <p>Yours starts in a rented room, with one laptop, two power strips and absolutely no recurring revenue.</p>
                  <label htmlFor="company-name">NAME YOUR COMPANY</label>
                  <input id="company-name" value={companyName} onChange={(event) => setCompanyName(event.target.value)} maxLength={24} placeholder="PANIC LABS" />
                  <div className="foundation-note"><Sparkles size={16} /> Choose wisely. The bank, landlord and future memes will know this name.</div>
                  <button className="story-primary-button" onClick={next}>REGISTER COMPANY <ArrowRight size={19} /></button>
                </div>
              </div>
            </motion.div>
          ) : isHuddle ? (
            <motion.div key="pre-client-huddle" className="pre-client-huddle" initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -14 }}>
              <div className="huddle-heading"><span className="chapter-label"><Users size={16} /> COMPANY MEETING · BEFORE THE FIRST CLIENT</span><h1>Five hires. One room.<br /><em>Zero shared strategy.</em></h1><p>The team gathers around a table. You have a potential lead, no signed deal, and a group chat that is already typing.</p></div>
              <div className="huddle-table">
                {hires.map((person) => <div className="huddle-person" key={person.name}><CharacterSprite character={person.character} size="md" expression={person.expression} /><b>{person.name}</b><small>{person.title}</small></div>)}
              </div>
              <div className="huddle-dialogue"><span className="story-eyebrow">THE FIRST TEAM HUDDLE</span>
                {!huddleChoice ? <><h2>How do you want to prepare the team?</h2><div className="huddle-options">
                  <button onClick={() => chooseHuddle('honest')}><b>01 · Set the ground rules</b><span>“We listen first. We promise only what we can deliver.”</span></button>
                  <button onClick={() => chooseHuddle('strengths')}><b>02 · Let everyone state their strengths</b><span>“Tell me what you can genuinely own. No job titles from LinkedIn.”</span></button>
                  <button onClick={() => chooseHuddle('hype')}><b>03 · Let Kunal lead the pep talk</b><span>“Kunal, you have 30 seconds. No slides.”</span></button>
                </div></> : <><div className="huddle-response">{huddleChoice === 'honest' ? 'You set one rule: no promises without evidence. Meera nods. Varun opens a slide titled “Evidence Framework”. You close it.' : huddleChoice === 'strengths' ? 'Aarav says he can build anything with AI. Varun says architecture is his strength. Meera asks for proof. Nikhil sends a thumbs-up from an unknown location. Kunal volunteers to “own vibes”.' : 'Kunal stands up. “TEAM! We are not a startup. We are a startup of the mind.” Aarav starts clapping. Meera checks whether clapping has acceptance criteria.'}</div><div className="huddle-reactions"><span>VARUN: “I am aligned.”</span><span>MEERA: “Define aligned.”</span><span>KUNAL: “This is already historic.”</span></div><button className="story-primary-button" onClick={next}>THE CLIENT IS CALLING <PhoneCall size={18} /></button></>}
              </div>
            </motion.div>
          ) : scene ? (
            <motion.div key={scene.name} className="hire-scene" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: .25 }}>
              <div className="hire-scene-top"><span className="chapter-label"><Users size={16} /> {scene.badge}</span><span className="hire-count">TEAM {hiredCount}/5 HIRED</span></div>
              <div className="hire-scene-grid">
                <div className="hire-character-stage">
                  <div className={`character-halo halo-${scene.character}`} />
                  <div className="hire-character-stamp">{isFounder ? 'DAY 00 · THE FOUNDER' : `EMPLOYEE ${String(hireIndex + 1).padStart(2, '0')}`}</div>
                  <CharacterSprite character={scene.character} size="xl" expression={scene.expression} speaking />
                  <div className="hire-character-name"><h2>{scene.name}</h2><span>{scene.title}</span></div>
                </div>
                <div className="hire-dialogue-panel">
                  <span className="story-eyebrow">{isFounder ? 'A VERY CONFIDENT DECISION' : 'NEW HIRE · CONTRACT SIGNED'}</span>
                  <div className="hire-speech">{scene.quote}</div>
                  <div className="hire-facts">
                    <div className="hire-fact good"><Check size={17} /><span><b>USEFUL:</b> {scene.talent}</span></div>
                    <div className="hire-fact warning"><Zap size={17} /><span><b>WARNING:</b> {scene.warning}</span></div>
                  </div>
                  {isHire && <div className="hire-stats"><span>SKILL</span><i /><span>CHAOS</span><i /><span>RELIABILITY</span></div>}
                  <button className="story-primary-button" onClick={next}>{isFounder ? 'BUILD THE TEAM' : hireIndex === hires.length - 1 ? 'GATHER THE TEAM' : `HIRE ${scene.name.toUpperCase()}`} <ArrowRight size={19} /></button>
                </div>
              </div>
              {isHire && <div className="hire-roster-strip">{hires.map((person, index) => <div key={person.name} className={index < hiredCount ? 'roster-dot hired' : index === hireIndex ? 'roster-dot current' : 'roster-dot'}><span>{index < hiredCount ? '✓' : index + 1}</span>{person.name}</div>)}</div>}
            </motion.div>
          ) : null}
        </AnimatePresence>
      </section>
      <footer className="story-footer"><span>{companyName.toUpperCase()} · FOUNDER'S JOURNAL</span><span>ONE STEP AT A TIME. THE CHAOS WILL ARRIVE SOON ENOUGH.</span></footer>
    </main>
  );
}
