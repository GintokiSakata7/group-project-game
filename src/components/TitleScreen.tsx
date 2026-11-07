import { motion } from 'motion/react';
import { ArrowRight, Gamepad2, Volume2 } from 'lucide-react';
import { useGameStore } from '../game/store';

export default function TitleScreen() {
  const beginPrologue = useGameStore((state) => state.beginPrologue);

  return (
    <main className="new-title-screen">
      <div className="title-atmosphere" />
      <header className="new-title-topbar">
        <div className="new-brand"><span className="new-brand-mark">M</span><span>MAJIN STUDIOS <small>ORIGINAL GAME</small></span></div>
        <span className="new-title-edition">A SMALL COMPANY. A VERY BIG PROBLEM.</span>
      </header>

      <section className="new-title-hero">
        <motion.div className="new-title-copy" initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.55 }}>
          <div className="new-title-kicker"><i /> A WORKPLACE COMEDY ADVENTURE</div>
          <h1>THE GROUP<br /><em>PROJECT.</em></h1>
          <p className="new-title-subtitle">You started a company. You hired a team. You got your first client.</p>
          <p className="new-title-punchline">Unfortunately, they are all like this.</p>
          <button className="new-title-start" onClick={beginPrologue}><Gamepad2 size={22} /> START NEW CAMPAIGN <ArrowRight size={20} /></button>
          <div className="new-title-footnote">A 7-DAY STORY ABOUT BUILDING A COMPANY WITHOUT LOSING YOUR MIND.</div>
        </motion.div>
        <motion.div className="new-title-art-wrap" initial={{ opacity: 0, scale: 0.94, rotate: 1 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} transition={{ duration: 0.7, delay: 0.1 }}>
          <div className="new-title-art-glow" />
          <img src="/assets/title-art.webp" alt="Panic Labs startup office illustration" className="new-title-art" />
          <div className="new-title-sticker sticker-budget"><small>FIRST CLIENT</small><strong>₹500?</strong><span>be serious.</span></div>
          <div className="new-title-sticker sticker-deadline"><small>DELIVERY</small><strong>7 DAYS</strong><span>no pressure.</span></div>
        </motion.div>
      </section>

      <footer className="new-title-footer"><span>MADE BY MAJIN STUDIOS</span><span>THE BUILD IS FICTIONAL. THE TEAM PROBLEMS ARE NOT.</span><span><Volume2 size={14} /> SOUND & CHAOS RECOMMENDED</span></footer>
    </main>
  );
}
