import { useState } from 'react';
import { motion } from 'motion/react';
import {
  Trophy, Skull, Award, CheckCircle2, RotateCcw, Share2,
  Sparkles, ShieldCheck, Heart, AlertTriangle, ArrowRight, Copy, Check
} from 'lucide-react';
import { useGameStore } from '../game/store';
import { CharacterSprite } from './CharacterSprite';
import { ProgressBar } from '../apps/shared';

export default function DeliveryResults() {
  const ending = useGameStore((state) => state.ending);
  const companyName = useGameStore((state) => state.companyName);
  const metrics = useGameStore((state) => state.metrics);
  const tasks = useGameStore((state) => state.tasks);
  const employees = useGameStore((state) => state.employees);
  const commits = useGameStore((state) => state.commits);
  const resetGame = useGameStore((state) => state.resetGame);

  const [copied, setCopied] = useState(false);

  const success = ending?.kind === 'success';
  const score = ending?.score ?? 0;
  const rating = ending?.rating ?? (score >= 80 ? 'LEGENDARY DELIVERY' : score >= 60 ? 'SOLID DELIVERY' : 'CHAOTIC SHIPMENT');

  // Identify standout teammates
  const completedTasks = tasks.filter((t) => t.progress >= 75).length;
  const criticalDefectsOpen = metrics.bugsOpen;

  // Determine MVP and Chaos Employee
  const aaravCommits = commits.filter((c) => c.employeeId === 'aarav').length;
  const meeraFixed = tasks.filter((t) => t.category === 'testing' && t.progress >= 50).length;
  const mvpName = aaravCommits > 4 ? 'Aarav (The Vibe Coder)' : 'Meera (QA Detective)';
  const mvpReason = aaravCommits > 4 ? 'Brute-forced 2,500 lines of AI code without flinching' : 'Caught release-blocking defects before the client saw them';

  const liabilityName = 'Varun (Technical Lead)';
  const liabilityReason = 'Drew 18 microservice diagrams for a catering contact form';

  const handleCopy = () => {
    const text = `🏆 THE GROUP PROJECT — Campaign Result:
Company: ${companyName}
Client: Royal Feast Catering
Outcome: ${ending?.title ?? 'DELIVERY COMPLETED'} (${rating})
Final Score: ${score}/100
MVP: ${mvpName}
Liability: ${liabilityName}
Verified Quality: ${Math.round(metrics.quality)}% | Client Trust: ${Math.round(metrics.clientTrust)}%
Play at: The Group Project`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <main className={`delivery-results-screen ${success ? 'is-success' : 'is-failure'}`}>
      <div className="results-noise" />

      {/* Top Header */}
      <header className="results-header">
        <div className="brand-lockup">
          <span className="brand-mark">P</span>
          <div>
            <strong>{companyName} INTERACTIVE</strong>
            <small>CAMPAIGN FINAL REVIEW · ROYAL FEAST RF-001</small>
          </div>
        </div>
        <div className="results-date-stamp">
          <Sparkles size={16} />
          <span>PROJECT DELIVERY VERDICT</span>
        </div>
      </header>

      {/* Main Scorecard Section */}
      <section className="results-stage">
        <motion.div
          className="results-main-card"
          initial={{ opacity: 0, scale: 0.95, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Hero Banner */}
          <div className="results-hero">
            <div className={`results-badge-icon ${success ? 'badge-trophy' : 'badge-skull'}`}>
              {success ? <Trophy size={48} /> : <Skull size={48} />}
            </div>
            <div className="results-titles">
              <span className="results-kicker">
                {success ? 'CONTRACT FULFILLED' : 'DELIVERY FAILED'}
              </span>
              <h1>{ending?.title ?? 'PROJECT COMPLETED'}</h1>
              <div className="results-rating-pill">
                <Award size={18} />
                <span>{rating}</span>
              </div>
            </div>
          </div>

          <p className="results-lead-body">{ending?.body}</p>

          {/* Client & Nephew Verdict */}
          <div className="results-client-verdict-box">
            <div className="verdict-characters">
              <CharacterSprite character="prakash" expression={success ? 'happy' : 'shocked'} size="md" />
              <CharacterSprite character="bunty" expression="smug" size="md" />
            </div>
            <div className="verdict-quotes">
              <strong>MR. PRAKASH’S FINAL VERDICT:</strong>
              <p>
                {success
                  ? '“The website works! Customers are already sending WhatsApp enquiries, and my phone stopped ringing at 2:00 AM. You delivered, founder. You delivered.”'
                  : '“I clicked the menu button and it redirected me to a video of a cat. Bunty says this is not industry standard.”'}
              </p>
              <small>
                <em>Bunty:</em> {success ? '“Still needs blockchain in the footer though.”' : '“My friend on Discord warned you!”'}
              </small>
            </div>
          </div>

          {/* Score Meters Grid */}
          <div className="results-metrics-panel">
            <div className="score-number-box">
              <span>FINAL SCORE</span>
              <strong>
                {score}
                <small>/100</small>
              </strong>
            </div>

            <div className="score-bars-list">
              {ending?.breakdown ? (
                ending.breakdown.map((item) => (
                  <div key={item.label} className="score-bar-row">
                    <div className="score-bar-labels">
                      <strong>{item.label}</strong>
                      <small>{item.detail}</small>
                      <b>{item.score} pts</b>
                    </div>
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
                ))
              ) : (
                <div className="score-bar-row">
                  <div className="score-bar-labels">
                    <strong>Quality & Confidence</strong>
                    <b>{Math.round(metrics.quality)}%</b>
                  </div>
                  <ProgressBar value={metrics.quality} />
                </div>
              )}
            </div>
          </div>

          {/* Special Humorous Awards */}
          <div className="results-awards-grid">
            <div className="award-card award-mvp">
              <span className="award-tag">🏆 MVP OF THE CAMPAIGN</span>
              <h4>{mvpName}</h4>
              <p>{mvpReason}</p>
            </div>

            <div className="award-card award-liability">
              <span className="award-tag">🤡 LIABILITY OF THE WEEK</span>
              <h4>{liabilityName}</h4>
              <p>{liabilityReason}</p>
            </div>
          </div>

          {/* Team Lineup Banner */}
          <div className="results-team-roster">
            <span>THE SQUAD THAT SURVIVED SEVEN DAYS:</span>
            <div className="roster-avatars">
              {employees.map((emp) => (
                <div key={emp.id} className="roster-item" title={emp.title}>
                  <CharacterSprite character={emp.id as any} expression={success ? 'happy' : 'exhausted'} size="sm" />
                  <small>{emp.name}</small>
                </div>
              ))}
            </div>
          </div>

          {/* Action CTAs */}
          <div className="results-footer-actions">
            <button className="results-copy-btn" onClick={handleCopy}>
              {copied ? <Check size={18} /> : <Copy size={18} />}
              {copied ? 'SCORECARD COPIED!' : 'SHARE SCORECARD'}
            </button>

            <button className="results-restart-btn" onClick={resetGame}>
              <RotateCcw size={18} />
              PLAY AGAIN (NEW CAMPAIGN)
              <ArrowRight size={18} />
            </button>
          </div>
        </motion.div>
      </section>
    </main>
  );
}

