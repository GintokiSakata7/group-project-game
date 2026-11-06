import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Award, CheckCircle2, Copy, RotateCcw, Share2, Skull, Sparkles, Trophy } from 'lucide-react';
import { useGameStore } from '../game/store';
import { Pill, ProgressBar } from '../apps/shared';

export default function EndingScreen() {
  const ending = useGameStore((state) => state.ending);
  const resetGame = useGameStore((state) => state.resetGame);
  const metrics = useGameStore((state) => state.metrics);
  const contractValue = useGameStore((state) => state.contractValue);
  const [copied, setCopied] = useState(false);

  const success = ending?.kind === 'success';

  const shareText = `🚀 THE GROUP PROJECT · STARTUP REPORT CARD
Company: PANIC LABS
Client: Royal Feast Catering (Mr. Prakash)
Outcome: ${ending?.title || (success ? 'DELIVERED!' : 'TERMINATED')}
Score: ${ending?.score ?? 0}/100 (${ending?.rating || (success ? 'Passable' : 'Lesson Learned')})
Remaining Cash: ₹${metrics.cash.toLocaleString('en-IN')}
Tech Debt: ${Math.round(metrics.technicalDebt)}/100
Team Status:
☀️ Kunal: Made 14 Spotify playlists
⚡ Aarav: "Bro, AI handled it"
🧠 Varun: Drew 11-box microservice diagram
🔬 Meera: Logged 42 bugs for 1px icon misalignment
👻 Nikhil: Last seen 3 days ago, replied "seen"
Play The Group Project: http://localhost:5173/`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <main className={`ending-screen ${success ? 'ending-success' : 'ending-failure'}`}>
      <div className="ending-grid" />
      <header className="ending-top">
        <span className="brand-mark">P</span>
        <strong>PANIC LABS · FOUNDER ARCHIVE</strong>
        <span className="ending-classification">CONFIDENTIAL · POST-MORTEM REPORT</span>
      </header>

      <motion.section
        className="ending-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <div className={`ending-icon ${success ? 'success' : 'failure'}`}>
          {success ? <Trophy size={34} /> : <Skull size={34} />}
        </div>
        <span className="ending-kicker">
          {success ? 'PROJECT DELIVERED TO CLIENT' : 'CAMPAIGN TERMINATED'}
        </span>
        <h1>{ending?.title ?? 'THE CAMPAIGN HAS ENDED'}</h1>
        <div className="ending-subtitle">{ending?.subtitle}</div>
        <p className="ending-body">{ending?.body}</p>

        {/* Character Awards Banner */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '8px',
          margin: '20px 0', padding: '14px', borderRadius: '10px', background: '#ffffff0a', border: '1px solid #ffffff18'
        }}>
          <div style={{ fontSize: '12px' }}>
            <strong>☀️ Kunal</strong>
            <small style={{ display: 'block', color: '#97a89b' }}>Chief Motivation Officer</small>
            <span style={{ color: '#d9ef71', fontSize: '11px' }}>14 Playlists Made</span>
          </div>
          <div style={{ fontSize: '12px' }}>
            <strong>⚡ Aarav</strong>
            <small style={{ display: 'block', color: '#97a89b' }}>Vibe Coder</small>
            <span style={{ color: '#d9ef71', fontSize: '11px' }}>Pushed AI to main</span>
          </div>
          <div style={{ fontSize: '12px' }}>
            <strong>🧠 Varun</strong>
            <small style={{ display: 'block', color: '#97a89b' }}>Tech Lead</small>
            <span style={{ color: '#d9ef71', fontSize: '11px' }}>12-Tier Architecture</span>
          </div>
          <div style={{ fontSize: '12px' }}>
            <strong>🔬 Meera</strong>
            <small style={{ display: 'block', color: '#97a89b' }}>QA Lead</small>
            <span style={{ color: '#d9ef71', fontSize: '11px' }}>1px Alignment Police</span>
          </div>
          <div style={{ fontSize: '12px' }}>
            <strong>👻 Nikhil</strong>
            <small style={{ display: 'block', color: '#97a89b' }}>Backend Ghost</small>
            <span style={{ color: '#d9ef71', fontSize: '11px' }}>Replied "seen"</span>
          </div>
        </div>

        {/* Final Score Stamp */}
        {ending?.score !== undefined && (
          <div className="final-score">
            <div>
              <span>CAMPAIGN REPUTATION SCORE</span>
              <strong>{ending.score}<small> / 100</small></strong>
            </div>
            <div className="final-score-stamp">
              {success ? <Award size={28} /> : <Skull size={28} />}
              <b>{success ? ending.rating : 'LESSON LEARNED'}</b>
            </div>
          </div>
        )}

        {/* Detailed Breakdown */}
        {ending?.breakdown && (
          <div className="score-breakdown">
            {ending.breakdown.map((item) => (
              <div className="score-row" key={item.label}>
                <span>
                  <strong>{item.label}</strong>
                  <small>{item.detail}</small>
                </span>
                <b>{item.score}</b>
                <ProgressBar
                  value={
                    (item.score /
                      (item.label === 'Deliverable coverage'
                        ? 40
                        : item.label === 'Product quality'
                        ? 25
                        : item.label === 'Client trust'
                        ? 15
                        : item.label === 'Release stability'
                        ? 15
                        : 5)) *
                    100
                  }
                />
              </div>
            ))}
          </div>
        )}

        <div className="ending-verdict">
          {success ? (
            <>
              <CheckCircle2 size={18} />
              <span>
                Mr. Prakash accepted the Phase 1 handover! Royal Feast Catering is officially online.
                You are now legally allowed to call yourselves a tech startup.
              </span>
            </>
          ) : (
            <>
              <Sparkles size={18} />
              <span>
                Every failed founder learns something. You learned that agreeing to build Swiggy for ₹500 is not a sustainable business model.
              </span>
            </>
          )}
        </div>

        {/* Action Buttons: Share & Restart */}
        <div style={{ display: 'flex', gap: '12px', marginTop: '22px' }}>
          <button
            onClick={copyToClipboard}
            style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              flex: '1', height: '48px', border: '1px solid #ffffff26', borderRadius: '8px',
              background: copied ? '#4a7522' : '#ffffff14', color: '#fff', fontSize: '14px', fontWeight: 850
            }}
          >
            {copied ? <CheckCircle2 size={18} /> : <Copy size={18} />}
            {copied ? 'COPIED TO CLIPBOARD!' : 'COPY SHAREABLE CARD'}
          </button>

          <button className="ending-restart" onClick={resetGame} style={{ flex: '1.2', marginTop: '0' }}>
            <RotateCcw size={16} /> {success ? 'START ANOTHER CAMPAIGN' : 'RETRY CAMPAIGN'} <ArrowRight size={16} />
          </button>
        </div>
      </motion.section>

      <footer className="ending-footer">
        <span>THE GROUP PROJECT · AN ALMOSTOS PRODUCTION</span>
        <span>THANKS FOR PLAYING. PLEASE UPDATE YOUR README BEFORE DEPLOYING TO PRODUCTION.</span>
      </footer>
    </main>
  );
}
