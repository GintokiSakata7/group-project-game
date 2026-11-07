import { motion } from 'motion/react';
import { ArrowRight, Award, CheckCircle2, RotateCcw, Skull, Sparkles, Trophy } from 'lucide-react';
import { useGameStore } from '../game/store';
import { Pill, ProgressBar } from '../apps/shared';

export default function EndingScreen() {
  const ending = useGameStore((state) => state.ending);
  const companyName = useGameStore((state) => state.companyName);
  const resetGame = useGameStore((state) => state.resetGame);
  const success = ending?.kind === 'success';
  return <main className={`ending-screen ${success ? 'ending-success' : 'ending-failure'}`}>
    <div className="ending-grid" /><div className="ending-top"><span className="brand-mark">P</span><strong>{companyName} <small>CAMPAIGN REPORT</small></strong><span className="ending-classification">CONFIDENTIAL · FOR INTERNAL USE</span></div>
    <motion.section className="ending-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
      <div className={`ending-icon ${success ? 'success' : 'failure'}`}>{success ? <Trophy size={31} /> : <Skull size={31} />}</div><span className="ending-kicker">{success ? 'CONTRACT CLOSED' : 'CAMPAIGN TERMINATED'}</span><h1>{ending?.title ?? 'THE END'}</h1><div className="ending-subtitle">{ending?.subtitle}</div><p className="ending-body">{ending?.body}</p>
      {success && <div className="ending-team-line"><span>☀️</span><span>⚡</span><span>🧠</span><span>🔬</span><span>👻</span><small>THE TEAM THAT SOMEHOW SHIPPED</small></div>}
      {ending?.score !== undefined && <div className="final-score"><div><span>FINAL CAMPAIGN SCORE</span><strong>{ending.score}<small>/100</small></strong></div><div className="final-score-stamp">{success ? <Award size={25} /> : <Skull size={25} />}<b>{success ? ending.rating : 'LESSON LEARNED'}</b></div></div>}
      {ending?.breakdown && <div className="score-breakdown">{ending.breakdown.map((item) => <div className="score-row" key={item.label}><span><strong>{item.label}</strong><small>{item.detail}</small></span><b>{item.score}</b><ProgressBar value={item.score / (item.label === 'Deliverable coverage' ? 40 : item.label === 'Product quality' ? 25 : item.label === 'Client trust' ? 15 : item.label === 'Release stability' ? 15 : 5) * 100} /></div>)}</div>}
      <div className="ending-verdict">{success ? <><CheckCircle2 size={17} /><span>Royal Feast accepted the Phase 1 handover. You are now allowed to say “we are a software company” without whispering.</span></> : <><Sparkles size={17} /><span>Every failed founder learns something. Yours learned that “works on my machine” is not a deployment strategy.</span></>}</div>
      <button className="ending-restart" onClick={resetGame}><RotateCcw size={16} /> {success ? 'START ANOTHER CAMPAIGN' : 'RESTART CAMPAIGN'} <ArrowRight size={16} /></button>
    </motion.section>
    <footer className="ending-footer"><span>THE GROUP PROJECT · AN ALMOSTOS SIMULATION</span><span>THANKS FOR PLAYING. PLEASE UPDATE YOUR README.</span></footer>
  </main>;
}
