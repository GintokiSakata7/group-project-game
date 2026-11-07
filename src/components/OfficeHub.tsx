import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, CheckCircle2, Laptop, Monitor, Sparkles, Users, Zap, X } from 'lucide-react';
import { useGameStore } from '../game/store';
import { CharacterSprite, type CharacterId, type Expression } from './CharacterSprite';
import type { DailyReport, Employee, GameEvent } from '../game/types';
import MissionControl from './MissionControl';
import { missionsForDay } from '../game/missions';

const dailyOpeners: Record<number, { title: string; line: string; mission: string }> = {
  1: { title: 'DAY 01 · THE KICKOFF', line: 'The team has assembled. Kunal brought a speaker. Aarav brought 19 dependencies. Nikhil brought his online status down.', mission: 'Get a real plan out of a room full of confidence.' },
  2: { title: 'DAY 02 · FIRST COMMITS', line: 'The repository is alive. So are the bugs. Varun says the architecture is stable. The server disagrees.', mission: 'Verify what was actually built.' },
  3: { title: 'DAY 03 · SCOPE CREEP', line: 'Bunty has sent a voice note beginning with “one tiny thing”. It lasts 4 minutes and 38 seconds.', mission: 'Protect the agreed scope.' },
  4: { title: 'DAY 04 · QA HAS ENTERED THE CHAT', line: 'Meera found a critical defect. Aarav says it is a feature. They are now arguing in the group chat.', mission: 'Get the build stable without starting a civil war.' },
  5: { title: 'DAY 05 · THE CLIENT WANTS A PREVIEW', line: 'Mr. Prakash wants a demo today. The homepage exists. The payment button leads to a calculator.', mission: 'Make the visible parts look real.' },
  6: { title: 'DAY 06 · FREEZE THE BUILD', line: 'Everyone is online at the same time. Nikhil has appeared. This is either a miracle or a network issue.', mission: 'Close the critical gaps and prepare the handover.' },
  7: { title: 'DAY 07 · DELIVERY DAY', line: 'The client call is in a few hours. Kunal has scheduled a celebration. Nobody has confirmed what we are celebrating.', mission: 'Ship something that survives a client click.' },
};

const dayLine = (day: number, lines: Record<number, string>, fallback: string) => lines[day] ?? fallback;

const characterDialogue: Record<string, { expression: Expression; line: (employee: Employee, day: number) => string; hint: string }> = {
  kunal: { expression: 'happy', line: (_e, day) => dayLine(day, {
    1: '“Founder, I have prepared a kickoff playlist, a morale framework and a motivational quote. I have not opened the task board. One thing at a time.”',
    2: '“The client update is ready. It says we are making excellent progress. I wrote it before checking the progress, because confidence is a deliverable.”',
    3: '“I have mediated the Aarav–Meera conflict. They are no longer speaking. I think that means the meeting was successful.”',
    4: '“I can present the preview. I have already practised saying ‘enterprise-grade’ in three accents.”',
    5: '“The client seems happy. Bunty has sent me a voice note. I have marked it as unread for team wellbeing.”',
    6: '“Feature freeze! I made a playlist called Cold but Focused. It is mostly the same song with different file names.”',
    7: '“Final day, legends! I made a playlist called We Definitely Tested This. It has a very optimistic ending.”',
  }, '“Morale is high. Output is a separate department. I am the department.”'), hint: 'Kunal is not your primary coder. Use him for client communication, documentation, morale and keeping the room from becoming a courtroom.' },
  aarav: { expression: 'smug', line: (_e, day) => dayLine(day, {
    1: '“Bro, the frontend is 80% done. I counted the divs. I have not run the app yet because I respect suspense.”',
    2: '“I pushed 14 commits. Seven are fixes for the other seven. That is what we call a closed-loop workflow.”',
    3: '“Meera says the payment button is broken. It is not broken. It is waiting for the correct emotional state.”',
    4: '“Integration is almost done. The API and frontend have met. They are currently deciding whether to be friends.”',
    5: '“New feature request received. I have created a branch. I have not asked what the feature does.”',
    6: '“I can add dark mode in five minutes. I can also remove it in five minutes. The middle part is where bugs happen.”',
    7: '“It works on my machine. I have prepared a video of my machine in case the client’s machine disagrees.”',
  }, '“AI cooked. The error messages are just the app expressing itself.”'), hint: 'Aarav is fast at implementation, particularly UI. Check his commits, build output and dependencies before accepting his claims.' },
  varun: { expression: 'neutral', line: (_e, day) => dayLine(day, {
    1: '“The architecture is 90% complete. The remaining 10% is implementation, integration, testing and deployment. Small items.”',
    2: '“The backend is ready in principle. The endpoint is returning 404, but the architecture is returning 200 emotionally.”',
    3: '“I have updated the architecture diagram to reflect the new requirements. The old diagram is now a historical document.”',
    4: '“Integration is complete, pending the first successful integration. This is a standard technical nuance.”',
    5: '“The system is scalable. It can scale from one user to another user after we fix the session issue.”',
    6: '“I recommend a feature freeze. I have also drafted a proposal to refactor the feature-freeze process.”',
    7: '“The system is production-ready, pending production. I am available for questions that do not require opening the terminal.”',
  }, '“Everything is under control. Please define what you mean by everything.”'), hint: 'Varun should coordinate architecture and integration. Ask for live demonstrations, testable endpoints and evidence—not another diagram.' },
  meera: { expression: 'shocked', line: (_e, day) => dayLine(day, {
    1: '“I reviewed the acceptance criteria. There are no acceptance criteria. I have created a document explaining why that is a defect.”',
    2: '“I found a critical issue, two major issues and a button that changes its mind when clicked twice.”',
    3: '“Aarav has labelled a blank page as minimalist. I have labelled it blocked.”',
    4: '“The preview is testable if someone gives me a URL that is not localhost on their laptop.”',
    5: '“There are 23 issues. Three are critical. Five are typography. I am willing to negotiate on the font, not the payment flow.”',
    6: '“I have started release testing. Please stop merging while I am testing. This is not a suggestion.”',
    7: '“I tested the production link. It works. I have also tested it with slow internet, a small screen and a very angry click.”',
  }, '“The button works. But does it work twice?”'), hint: 'Meera protects the release. Ask her to rank issues by severity so the team fixes blockers before testing cosmetic details.' },
  nikhil: { expression: 'exhausted', line: (employee, day) => employee.availability === 'offline'
    ? dayLine(day, { 1: '“seen”', 2: '“will send tonight”', 3: '“network issue”', 4: '“in a tunnel”', 5: '“almost uploaded”', 6: '“check the zip”', 7: '“backend deployed. do not call.”' }, '“seen 3 days ago”')
    : dayLine(day, {
      1: '“Backend skeleton is up. I have left before the stand-up becomes a planning summit.”',
      2: '“Endpoint sent. Sample payload attached. No, I will not join a 90-minute call.”',
      3: '“I can finish the API if someone stops changing the payload every hour.”',
      4: '“Integration works. I have tested it from a place with one bar of signal.”',
      5: '“The backend is stable. The ZIP name is not open for discussion.”',
      6: '“I am online. Please screenshot this moment for the annual report.”',
      7: '“Handover is complete. I have muted the company for personal reasons.”',
    }, '“Backend is done. Please do not call.”'), hint: 'Nikhil is your high-skill, low-availability specialist. Give him isolated deliverables, clear handoffs and a deadline before he disappears.' },
};

function EventModal({ event, onChoose }: { event: GameEvent; onChoose: (choiceId: string) => void }) {
  const character = event.character.toLowerCase().includes('prakash') ? 'prakash' : event.character.toLowerCase().includes('aarav') ? 'aarav' : event.character.toLowerCase().includes('varun') ? 'varun' : event.character.toLowerCase().includes('meera') ? 'meera' : event.character.toLowerCase().includes('nikhil') ? 'nikhil' : 'kunal';
  return (
    <motion.div className="game-modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.div className="game-event-card" initial={{ opacity: 0, y: 24, scale: .96 }} animate={{ opacity: 1, y: 0, scale: 1 }}>
        <div className="game-event-kicker"><Sparkles size={16} /> SOMETHING HAS GONE WRONG · {event.eyebrow}</div>
        <div className="game-event-person"><CharacterSprite character={character as CharacterId} size="lg" expression="shocked" speaking /><div><h2>{event.title}</h2><span>{event.character} · {event.characterRole}</span></div></div>
        <p className="game-event-body">{event.body}</p>
        <div className="game-event-choices">{event.choices.map((choice, index) => <button key={choice.id} onClick={() => onChoose(choice.id)}><b>0{index + 1}</b><span>{choice.label}<small>{choice.hint}</small></span><ArrowRight size={18} /></button>)}</div>
      </motion.div>
    </motion.div>
  );
}

function DailyReportModal({ report, close }: { report: DailyReport; close: () => void }) {
  return (
    <motion.div className="game-modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.div className="game-report-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="game-report-icon"><CheckCircle2 size={28} /></div>
        <span className="game-report-kicker">DAY {report.day} COMPLETE</span>
        <h2>{report.headline}</h2>
        <p>{report.summary}</p>
        <div className="game-report-columns"><div><b>WHAT GOT DONE</b>{report.completed.length ? report.completed.map((item) => <span key={item}>✓ {item}</span>) : <span>Nothing reached done. Kunal has called it “a foundation day”.</span>}</div><div><b>WHAT WENT WRONG</b>{report.incidents.length ? report.incidents.map((item) => <span key={item}>• {item}</span>) : <span>Suspiciously quiet. Check the server.</span>}</div></div>
        <div className="game-report-stats"><span>PROGRESS <b>{report.progressDelta >= 0 ? '+' : ''}{report.progressDelta}%</b></span><span>QUALITY <b>{report.qualityDelta >= 0 ? '+' : ''}{report.qualityDelta}%</b></span><span>MORALE <b>{report.moraleDelta >= 0 ? '+' : ''}{report.moraleDelta}%</b></span></div>
        <button className="game-primary-action" onClick={close}>CONTINUE THE CAMPAIGN <ArrowRight size={18} /></button>
      </motion.div>
    </motion.div>
  );
}

export default function OfficeHub() {
  const { companyName, day, actionsLeft, metrics, employees, tasks, defects, pendingEvent, dailyReports, completedMissionIds, openDesktop, performAction, resolveEvent, endDay, discoverTrait } = useGameStore();
  const [selectedEmpId, setSelectedEmpId] = useState<string | null>(null);
  const [dialogueText, setDialogueText] = useState<string | null>(null);
  const [showReport, setShowReport] = useState(false);
  const opener = dailyOpeners[day] ?? dailyOpeners[7];
  const selectedEmployee = employees.find((employee) => employee.id === selectedEmpId);
  const report = showReport ? dailyReports[dailyReports.length - 1] : null;
  const criticalBugs = defects.filter((defect) => !defect.fixed && defect.severity === 'critical').length;
  const doneTasks = tasks.filter((task) => task.progress >= 100).length;
  const progress = Math.round(metrics.progress);
  const dayMissions = missionsForDay(day);
  const missionsComplete = dayMissions.every((mission) => completedMissionIds.includes(mission.id));

  const teammateLine = (employee: Employee) => characterDialogue[employee.id]?.line(employee, day) ?? '“I am here. I have no idea why.”';

  const interact = (employeeId: string) => { setSelectedEmpId(employeeId); setDialogueText(null); };
  const act = (kind: 'motivate' | 'pair' | 'audit' | 'investigate') => {
    if (!selectedEmployee || actionsLeft <= 0) return;
    if (kind === 'investigate' && !selectedEmployee.discovered) {
      discoverTrait(selectedEmployee.id);
      setDialogueText(`You discovered something about ${selectedEmployee.name}. It explains a lot. Unfortunately.`);
      return;
    }
    performAction(kind, selectedEmployee.id);
    const messages: Record<string, string> = {
      motivate: `${selectedEmployee.name} feels appreciated. Productivity remains under investigation.`,
      pair: `You paired with ${selectedEmployee.name}. Actual work has occurred. Witnesses confirm.`,
      audit: `You checked the evidence behind ${selectedEmployee.name}'s claims. The truth is in the repo.`,
      investigate: `You investigated ${selectedEmployee.name}. The company is less innocent now.`,
    };
    setDialogueText(messages[kind]);
  };

  const closeDay = () => {
    endDay();
    if (day < 7) setShowReport(true);
  };


  return (
    <main className="game-office-screen">
      <header className="game-office-topbar">
        <div className="game-office-brand"><span className="new-brand-mark">M</span><div><b>{companyName}</b><small>THE GROUP PROJECT</small></div></div>
        <div className="game-day-banner"><span>DAY {day} <i>/ 7</i></span><b>{opener.title.replace(`DAY 0${day} · `, '')}</b></div>
        <div className="game-office-right"><span className="game-mini-stat">₹{metrics.cash.toLocaleString('en-IN')}</span><span className="game-mini-stat"><Zap size={15} /> {actionsLeft} ACTIONS</span><button className="game-computer-button" onClick={openDesktop}><Monitor size={17} /> OPEN COMPUTER</button></div>
      </header>

      <section className="game-office-main">
        <div className="game-office-scene-art" />
        <div className="game-office-scene-overlay" />
        <div className="game-office-intro">
          <span className="game-scene-kicker"><Sparkles size={15} /> MORNING BRIEFING · {companyName} HQ</span>
          <h1>{opener.title}</h1>
          <p>{opener.line}</p>
        </div>

        <MissionControl day={day} />

        <div className="game-office-floor">
          <div className="game-office-window"><span>THE {companyName.toUpperCase()} FLOOR</span><b>CLICK A TEAMMATE TO INTERACT</b></div>
          <div className="game-employee-lineup">
            <motion.div className="game-founder-card" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
              <div className="game-founder-status">YOU · FOUNDER</div>
              <div className="game-founder-art"><CharacterSprite character="founder" expression="smug" size="lg" speaking /></div>
              <div className="game-founder-info"><h3>YOU</h3><span>Founder · CEO · Emergency Tea Technician</span><p>Five employees. Seven days. One client who thinks software is a one-click purchase.</p></div>
              <div className="game-founder-task">CURRENT OBJECTIVE: COMPLETE TODAY'S STORY MISSIONS</div>
            </motion.div>
            {employees.map((employee) => {
              const state = characterDialogue[employee.id];
              const activeTask = tasks.find((task) => task.assignedTo === employee.id && task.progress < 100);
              const offline = employee.availability === 'offline';
              return <motion.button key={employee.id} className={`game-employee-card ${offline ? 'employee-offline' : ''}`} onClick={() => interact(employee.id)} whileHover={{ y: -9, rotate: employee.id === 'nikhil' ? -1 : 1 }} whileTap={{ scale: .97 }}>
                <div className="game-employee-status">{offline ? 'LAST SEEN: ???' : employee.availability === 'busy' ? 'BUSY' : 'IN OFFICE'}</div>
                <div className="game-employee-art"><CharacterSprite character={employee.id as CharacterId} expression={offline ? 'exhausted' : state?.expression ?? 'neutral'} size="lg" speaking={!offline} /></div>
                <div className="game-employee-info"><h3>{employee.name}</h3><span>{employee.title}</span><p>{employee.tagline}</p></div>
                <div className="game-employee-task">{activeTask ? `WORKING: ${activeTask.title}` : offline ? 'NO SIGNAL. NO SHAME.' : 'WAITING FOR INSTRUCTIONS'}</div>
                <div className="game-employee-hover">TALK TO {employee.name.toUpperCase()} <ArrowRight size={14} /></div>
              </motion.button>;
            })}
          </div>
        </div>

        <div className="game-office-bottom">
          <div className="game-office-left-note"><div className="game-note-icon">☕</div><div><b>{doneTasks}/{tasks.length} tasks complete</b><span>{criticalBugs ? `${criticalBugs} critical bug(s) still open. Meera is aware.` : 'No critical bugs reported. Suspicious.'}</span></div></div>
          <div className="game-office-progress"><div><span>PROJECT PROGRESS</span><b>{progress}%</b></div><i><span style={{ width: `${progress}%` }} /></i></div>
          <div className="game-office-actions"><button className="game-open-workspace" onClick={openDesktop}><Laptop size={18} /> OPEN WORKSTATION</button><button className="game-end-day" disabled={Boolean(pendingEvent) || !missionsComplete} onClick={closeDay}>{day === 7 ? 'DELIVER PROJECT' : missionsComplete ? 'END THE DAY' : `MISSIONS ${dayMissions.filter((mission) => completedMissionIds.includes(mission.id)).length}/${dayMissions.length}`}  <ArrowRight size={18} /></button></div>
        </div>
      </section>

      <AnimatePresence>
        {selectedEmployee && (
          <motion.div className="game-modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedEmpId(null)}>
            <motion.div className="game-character-dialogue" initial={{ opacity: 0, y: 22, scale: .96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 14 }} onClick={(event) => event.stopPropagation()}>
              <button className="game-modal-close" onClick={() => setSelectedEmpId(null)}><X size={19} /></button>
              <div className="game-dialogue-character"><CharacterSprite character={selectedEmployee.id as CharacterId} size="xl" expression={characterDialogue[selectedEmployee.id]?.expression ?? 'neutral'} speaking /></div>
              <div className="game-dialogue-body"><span className="game-scene-kicker">TEAM INTERACTION · {selectedEmployee.role}</span><h2>{selectedEmployee.name}</h2><div className="game-big-quote">{teammateLine(selectedEmployee)}</div><p className="game-character-hint">{characterDialogue[selectedEmployee.id]?.hint}</p>
                {dialogueText && <div className="game-action-feedback"><CheckCircle2 size={17} /> {dialogueText}</div>}
                <div className="game-founder-actions"><span>FOUNDER ACTIONS · {actionsLeft} LEFT TODAY</span><div>
                  <button onClick={() => act('motivate')} disabled={actionsLeft <= 0}><span>🎤</span><b>Motivate</b><small>Boost morale</small></button>
                  <button onClick={() => act('pair')} disabled={actionsLeft <= 0 || !tasks.some((task) => task.assignedTo === selectedEmployee.id && task.progress < 100)}><span>🧑‍💻</span><b>Pair work</b><small>Improve a task</small></button>
                  <button onClick={() => act('audit')} disabled={actionsLeft <= 0}><span>🕵️</span><b>Audit</b><small>Check the evidence</small></button>
                  {!selectedEmployee.discovered && <button onClick={() => act('investigate')} disabled={actionsLeft <= 0}><span>🔍</span><b>Investigate</b><small>Reveal hidden trait</small></button>}
                </div></div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>{pendingEvent && !selectedEmployee && <EventModal event={pendingEvent} onChoose={resolveEvent} />}</AnimatePresence>
      <AnimatePresence>{showReport && report && <DailyReportModal report={report} close={() => setShowReport(false)} />}</AnimatePresence>
    </main>
  );
}
