import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, ArrowRight, Sparkles, AlertTriangle, ShieldCheck, Flame, Phone, Briefcase } from 'lucide-react';
import { useGameStore } from '../game/store';
import { CharacterSprite, type Expression } from './CharacterSprite';

interface DecisionOption {
  id: string;
  label: string;
  detail: string;
  score: number;
  fatal?: boolean;
  fatalTitle?: string;
  fatalBody?: string;
  clientReaction: string;
  clientExpression: Expression;
  buntyReaction?: string;
  contractPrice?: number;
}

interface MeetingStage {
  step: number;
  title: string;
  clientSpeech: string;
  buntyInterjection?: string;
  options: DecisionOption[];
}

const stages: MeetingStage[] = [
  {
    step: 1,
    title: 'THE IMPOSSIBLE WISHLIST',
    clientSpeech:
      '“Hello founder! I run Royal Feast Catering. My nephew Bunty says we need a full digital transformation. Website, Android app, iOS app, live GPS tracking of biryani delivery, crypto wallet, and an AI chatbot that talks like Amitabh Bachchan. My budget is ₹500. Can we launch by next Tuesday?”',
    buntyInterjection:
      '“Uncle, make sure they use blockchain. My friend on Discord says blockchain makes menus taste crispier.”',
    options: [
      {
        id: 'problem',
        label: '“What is the primary business bottleneck your catering company faces today?”',
        detail: 'Dig beneath the buzzwords to discover the actual commercial problem.',
        score: 30,
        clientReaction:
          '“Actually... customers call my personal phone 90 times a day asking for menus, prices, and booking availability. I can barely sleep!”',
        clientExpression: 'talking',
        buntyReaction: '“Wait, phone calls are Web1. We need a metaverse lounge!”',
      },
      {
        id: 'tech_jargon',
        label: '“Would you prefer a microservices Kubernetes cluster with React server components?”',
        detail: 'Respond to ridiculous requests with developer jargon.',
        score: 5,
        clientReaction:
          '“Is Kubernetes a type of paneer dish? Son, I run a kitchen, not a spaceship.”',
        clientExpression: 'exhausted',
      },
      {
        id: 'yes_man',
        label: '“No problem! We will build everything—AI, apps, tracking, and crypto—for ₹500!”',
        detail: 'Say yes to everything without thinking. What could possibly go wrong?',
        score: -50,
        fatal: true,
        fatalTitle: 'BANKRUPT BEFORE DAY 1',
        fatalBody:
          'You agreed to build 2 native apps, GPS tracking, and an AI for ₹500. Upon hearing this, your five employees immediately resigned and Meera filed a labor dispute.',
        clientReaction: '“Wonderful! Also add drone delivery. Bunty, get the contract!”',
        clientExpression: 'happy',
      },
    ],
  },
  {
    step: 2,
    title: 'DISCOVERING THE REAL MVP',
    clientSpeech:
      '“Bunty insists that without an AI chatbot, our brand is invisible. But tell me honestly: what do we actually need to launch first to stop these endless phone calls?”',
    buntyInterjection:
      '“We need an Iron Man Jarvis assistant that recommends gulab jamun in 14 languages!”',
    options: [
      {
        id: 'whatsapp_mvp',
        label: '“A premium responsive website showing your menu packages with a direct WhatsApp enquiry button.”',
        detail: 'Solve the real problem: clear catalogue + instant WhatsApp leads without complex infrastructure.',
        score: 30,
        clientReaction:
          '“Direct WhatsApp enquiries? With menu packages already listed? That alone would save my kitchen staff four hours every day!”',
        clientExpression: 'happy',
        buntyReaction: '“Hmm, WhatsApp is pretty mainstream. But I guess it works...”',
      },
      {
        id: 'microservices',
        label: '“A custom microservices distributed architecture with an automated booking engine.”',
        detail: 'Over-engineer a solution for traffic the client does not yet have.',
        score: 5,
        clientReaction:
          '“Look, I don’t know what micro-service means. Will it work when an uncle clicks it on a 4-year-old phone?”',
        clientExpression: 'neutral',
      },
      {
        id: 'apps_first',
        label: '“We must build Android and iOS apps first with live GPS driver tracking.”',
        detail: 'Start with the most expensive, difficult deliverable.',
        score: -20,
        clientReaction:
          '“Two apps? My customers just want to order catering for a wedding once a year! Why would they install an app?”',
        clientExpression: 'shocked',
      },
    ],
  },
  {
    step: 3,
    title: 'SETTING BOUNDARIES & PHASING',
    clientSpeech:
      '“Okay, the menu website sounds sensible. But what happens to the payment gateway, customer accounts, and Bunty’s AI ideas?”',
    buntyInterjection:
      '“Don’t let them cut scope, Uncle! Software takes 20 minutes with AI!”',
    options: [
      {
        id: 'phased_delivery',
        label: '“Phase 1 launches in 7 days to get live orders immediately. Payments and AI can be Phase 2 once revenue flows.”',
        detail: 'Firm, professional boundaries that protect your timeline while assuring future growth.',
        score: 25,
        clientReaction:
          '“That makes total sense. Ship the website first, prove it works, and we talk about Phase 2 next month. You talk like a real businessman.”',
        clientExpression: 'happy',
        buntyReaction: '“Fine... Phase 2 will have the 3D hologram logo though.”',
      },
      {
        id: 'squeeze_all',
        label: '“We will crunch and squeeze all 10 features into the 7 days without altering the deadline.”',
        detail: 'Make unrealistic commitments to please the client.',
        score: -15,
        clientReaction:
          '“Great! So 10 features in 7 days guaranteed. If one button fails, I’m deducting penalty fees!”',
        clientExpression: 'smug',
      },
      {
        id: 'insult_client',
        label: '“Those extra features are ridiculous and your nephew Bunty has no idea what he is talking about.”',
        detail: 'Insult the client’s family. Bold strategy.',
        score: -35,
        clientReaction:
          '“Excuse me?! Bunty topped his computer class in 10th standard! Watch your mouth!”',
        clientExpression: 'shocked',
      },
    ],
  },
  {
    step: 4,
    title: 'THE COMMERCIAL PROPOSAL',
    clientSpeech:
      '“Now, founder... about my ₹500 budget. You’ve convinced me this is valuable. But my budget is tight. What is your commercial proposal for Phase 1 (7-day delivery)?”',
    buntyInterjection:
      '“Uncle, tell them my friend does websites for free pizza!”',
    options: [
      {
        id: 'price_5000',
        label: '“₹5,000 total. 50% advance (₹2,500) today, 50% on Day 7 delivery. 1 round of revisions.”',
        detail: 'The standard viable startup rate. Fair price, clear payment terms, realistic scope.',
        score: 25,
        clientReaction:
          '“₹5,000? For stopping 90 calls a day and booking ₹100,000 catering events? DEAL! Send the contract!”',
        clientExpression: 'happy',
        buntyReaction: '“Okay, that’s actually reasonable. But I want a consultant credit.”',
      },
      {
        id: 'price_6500',
        label: '“₹6,500 total. Includes 7-day launch + 7 days of post-launch warranty & phone support.”',
        detail: 'Higher value with support buffer. Gives safety margin.',
        score: 20,
        clientReaction:
          '“A bit steep, but post-launch support gives me peace of mind. Let’s do ₹6,500! Deal!”',
        clientExpression: 'happy',
        buntyReaction: '“Make sure that support includes fixing my laptop too.”',
      },
      {
        id: 'price_500_trap',
        label: '“Fine, ₹500 total. We are desperate for our first client.”',
        detail: 'The trap. You will lose money on hosting before Day 2.',
        score: -100,
        fatal: true,
        fatalTitle: 'EXPLOITED & EVICTED',
        fatalBody:
          'You agreed to ₹500. PANIC LABS could not afford the electricity bill. Your landlord confiscated the office beanbag, and Nikhil deleted his Telegram account.',
        clientReaction: '“Pleasure doing business with someone so pliable!”',
        clientExpression: 'smug',
      },
      {
        id: 'price_35000',
        label: '“₹35,000 non-negotiable enterprise fee. Take it or leave it.”',
        detail: 'Overcharge an SME client without building trust first.',
        score: -60,
        fatal: true,
        fatalTitle: 'CLIENT WALKED OUT',
        fatalBody:
          'Mr. Prakash laughed for three straight minutes, hung up the phone, and gave the contract to Bunty’s college friend.',
        clientReaction: '“Thirty-five thousand?! Are you serving gold leaf biryani?! Good day!”',
        clientExpression: 'shocked',
      },
    ],
  },
  {
    step: 5,
    title: 'THE CLIENT PUSHES BACK',
    clientSpeech: '“₹5,000? I said ₹500, beta. My nephew can make a website with one prompt. Also, why is the mobile app not included? And can you keep the same deadline? I am asking only because it is a small thing.”',
    buntyInterjection: '“Uncle, I saw a reel where someone built Amazon in 11 minutes. They used a black terminal and no sleep. We can do that.”',
    options: [
      {
        id: 'defend_value',
        label: '“₹500 gets you a poster. ₹5,000 gets you a working business website, enquiry flow, responsive pages and a tested launch.”',
        detail: 'Explain the business outcome and the work behind a reliable delivery.',
        score: 25,
        clientReaction: '“Okay, when you put it like that, I understand. My cousin charged ₹3,000 just to print wedding invitations. Bunty, stop comparing software to reels.”',
        clientExpression: 'happy',
        buntyReaction: '“The reel had background music. That is probably the secret.”',
      },
      {
        id: 'scope_tradeoff',
        label: '“We can keep the price at ₹5,000, but the mobile app, AI and live tracking stay outside this signed Phase 1.”',
        detail: 'Hold the commercial line and repeat the deliverables in plain language.',
        score: 18,
        clientReaction: '“Fine. I want the website and enquiries working first. But please write the exclusions clearly. Bunty keeps adding things to my list.”',
        clientExpression: 'neutral',
        buntyReaction: '“I have created a separate list called Phase 1.5. It is very important.”',
      },
      {
        id: 'reduce_scope_price',
        label: '“At ₹3,500 we can deliver a single-page website with menu highlights and WhatsApp enquiry. The rest becomes a later phase.”',
        detail: 'Offer a lower-priced, genuinely smaller product instead of discounting the same scope.',
        score: 12,
        contractPrice: 3500,
        clientReaction: '“That is a fair option. Let us start with the one-page release at ₹3,500 and revisit the full website later.”',
        clientExpression: 'neutral',
        buntyReaction: '“Can the one page scroll horizontally like a game?”',
      },
      {
        id: 'give_in',
        label: '“Okay, ₹500. We will include everything. Please do not cancel.”',
        detail: 'Confuse winning a client with accepting an impossible contract.',
        score: -100,
        fatal: true,
        fatalTitle: 'THE ₹500 TRAP',
        fatalBody: 'The client repeats the full wishlist back to you and asks for a written guarantee. You sign. Kunal changes his title to Chief Exit Officer, Meera starts documenting the labour complaint, and the company has delivered a very expensive lesson for ₹500.',
        clientReaction: '“Excellent. Also add a drone that delivers biryani. Same budget.”',
        clientExpression: 'smug',
      },
      {
        id: 'walk_away',
        label: '“We cannot deliver that scope for this price. We should not proceed.”',
        detail: 'Protect the company, but lose the first opportunity.',
        score: -100,
        fatal: true,
        fatalTitle: 'DEAL WALKED AWAY',
        fatalBody: 'You draw a professional boundary, but the client refuses to revise the budget or scope. He leaves for Bunty’s college friend, who has promised an AI-powered Zomato clone by breakfast.',
        clientReaction: '“No problem. I will find someone who understands small business budgets.”',
        clientExpression: 'shocked',
      },
    ],
  },
  {
    step: 6,
    title: 'THE PAYMENT TERMS ULTIMATUM',
    clientSpeech: '“One final small thing. I usually pay after the work is completely done. My wife, Bunty and two cousins should test it first. Also, can you include unlimited revisions, hosting and support for one year? Same price, naturally.”',
    buntyInterjection: '“Uncle, ask for lifetime support. If they refuse, say my friend gives free updates. His friend is also his laptop.”',
    options: [
      {
        id: 'proper_terms',
        label: '“50% advance to reserve the sprint, 50% after the agreed handover. One revision round and a 7-day bug-fix warranty; hosting/domain are separate.”',
        detail: 'Set clear payment milestones, revision boundaries and a limited warranty.',
        score: 22,
        clientReaction: '“Fifty percent today? Hmm. Okay, that is fair. You need to block the team for seven days. One revision is enough. My wife can send one combined list, not 46 separate calls.”',
        clientExpression: 'happy',
        buntyReaction: '“I have already sent 46 messages. Should I combine them into a PDF?”',
      },
      {
        id: 'milestone_terms',
        label: '“50% advance, 25% after the working preview, and 25% after handover. One revision and 7-day defect support.”',
        detail: 'Offer a smaller advance with clear milestones, while protecting the scope.',
        score: 16,
        clientReaction: '“That sounds manageable. I can send the booking amount today. Please put every deliverable and exclusion in writing.”',
        clientExpression: 'neutral',
        buntyReaction: '“Can the invoice have a QR code that plays our brand anthem?”',
      },
      {
        id: 'no_advance_unlimited',
        label: '“No advance is fine. We will provide unlimited revisions, free hosting and one year of support.”',
        detail: 'Accept an open-ended obligation with no cash-flow protection.',
        score: -100,
        fatal: true,
        fatalTitle: 'THE LIFETIME SUPPORT CURSE',
        fatalBody: 'You accepted unlimited revisions, free hosting and a year of support without an advance. The first revision is a new logo. The second is an Android app. By midnight, Bunty has asked whether you can also repair his printer. PANIC LABS has become a family subscription service.',
        clientReaction: '“Excellent! I knew you understood business. I will pay once everyone is fully satisfied.”',
        clientExpression: 'smug',
        buntyReaction: '“I have made a group called Free Changes.”',
      },
    ],
  },
];

export default function ClientMeeting() {
  const [currentStageIdx, setCurrentStageIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<DecisionOption | null>(null);
  const [score, setScore] = useState(0);
  const [chosenPrice, setChosenPrice] = useState(5000);
  const [chosenScope, setChosenScope] = useState(['homepage', 'catalogue', 'whatsapp', 'contact', 'responsive', 'seo']);
  const [history, setHistory] = useState<{ stageTitle: string; choiceLabel: string; score: number }[]>([]);
  const [callAnswered, setCallAnswered] = useState(false);

  const companyName = useGameStore((state) => state.companyName);
  const startCampaign = useGameStore((state) => state.startCampaign);
  const triggerGameOver = useGameStore((state) => state.triggerGameOver);

  const stage = stages[currentStageIdx];
  const isFinalStep = currentStageIdx === stages.length - 1;

  const handleSelect = (option: DecisionOption) => {
    setSelectedOption(option);
  };

  const handleContinue = () => {
    if (!selectedOption) return;

    const newScore = score + selectedOption.score;
    setScore(newScore);

    // Record history
    setHistory((prev) => [
      ...prev,
      {
        stageTitle: stage.title,
        choiceLabel: selectedOption.label,
        score: selectedOption.score,
      },
    ]);

    // Check if fatal choice
    if (selectedOption.fatal) {
      triggerGameOver({
        title: selectedOption.fatalTitle ?? 'NEGOTIATION COLLAPSED',
        subtitle: 'Deal Terminated',
        body: selectedOption.fatalBody ?? 'The client negotiation ended in catastrophic failure.',
        reason: 'failed_negotiation',
      });
      return;
    }

    if (stage.step === 4) {
      // Stage 4 is an opening commercial offer. The client gets one final objection round.
      const price = selectedOption.id === 'price_6500' ? 6500 : 5000;
      setChosenPrice(price);
      setSelectedOption(null);
      setCurrentStageIdx((idx) => idx + 1);
      return;
    }

    if (stage.step === 5) {
      if (selectedOption.contractPrice) {
        setChosenPrice(selectedOption.contractPrice);
        setChosenScope(['homepage', 'whatsapp', 'contact']);
      }
      setSelectedOption(null);
      setCurrentStageIdx((idx) => idx + 1);
      return;
    }

    if (stage.step === 6) {
      if (newScore < 75) {
        triggerGameOver({
          title: 'DEAL COLLAPSED',
          subtitle: 'The terms never made it to paper',
          body: 'Mr. Prakash says the offer sounds confusing. Bunty has already forwarded a reel titled “Build a full startup in 20 minutes”. The client ends the call and gives the project to someone who promised it for ₹499, lifetime support included.',
          reason: 'failed_negotiation',
        });
        return;
      }
      startCampaign({
        scopeAccepted: chosenScope,
        negotiationScore: newScore,
        contractPrice: chosenPrice,
      });
      return;
    }

    setSelectedOption(null);
    setCurrentStageIdx((idx) => idx + 1);
  };

  const clientMood: Expression = selectedOption
    ? selectedOption.clientExpression
    : score >= 50
    ? 'happy'
    : score < 0
    ? 'shocked'
    : 'neutral';

  if (!callAnswered) {
    return (
      <main className="client-meeting-screen call-first-screen">
        <div className="client-meeting-noise" />
        <div className="incoming-call-fullscreen">
          <div className="incoming-call-pulse"><Phone size={24} /></div>
          <span className="call-screen-kicker">{companyName.toUpperCase()} · FIRST OPPORTUNITY</span>
          <CharacterSprite character="prakash" expression="happy" size="xl" speaking />
          <h1>Mr. Prakash is calling.</h1>
          <p>Royal Feast Catering · Unknown caller</p>
          <div className="incoming-call-quote">“Hello? Is this the software company? My nephew says you people can build anything.”</div>
          <div className="incoming-call-actions">
            <button className="decline-call-button" onClick={() => triggerGameOver({ title: 'THE FIRST CALL WAS MISSED', subtitle: 'Opportunity disappeared', body: 'Mr. Prakash called Bunty’s college friend instead. Bunty has already posted “Founder mindset” on LinkedIn.', reason: 'failed_negotiation' })}>DECLINE</button>
            <button className="answer-call-button" onClick={() => setCallAnswered(true)}><Phone size={20} /> ANSWER CALL</button>
          </div>
          <small className="call-screen-foot">Somewhere nearby, Bunty is preparing a 47-slide feature list.</small>
        </div>
      </main>
    );
  }

  return (
    <main className="client-meeting-screen">
      <div className="client-meeting-noise" />

      {/* Header Bar */}
      <header className="client-meeting-header">
        <div className="brand-lockup">
          <span className="brand-mark">P</span>
          <div>
            <strong>CHAPTER 01 · THE FIRST CLIENT</strong>
            <small>NEGOTIATING WITH MR. PRAKASH (ROYAL FEAST CATERING)</small>
          </div>
        </div>
        <div className="meeting-trust-meter">
          <span>CLIENT TRUST:</span>
          <strong className={score >= 50 ? 'text-good' : score < 20 ? 'text-warning' : ''}>
            {Math.max(10, Math.min(100, 50 + score))}%
          </strong>
        </div>
      </header>

      {/* Main Stage */}
      <section className="client-meeting-stage">
        {/* Left Side: Client & Bunty Portraits */}
        <div className="client-portrait-col">
          <div className="client-card-frame">
            <CharacterSprite character="prakash" expression={clientMood} size="xl" speaking={Boolean(selectedOption)} />
            <div className="client-title-card">
              <h3>Mr. Prakash</h3>
              <p>Owner · Royal Feast Catering</p>
              <span className="client-badge">POTENTIAL CLIENT</span>
            </div>
          </div>

          <div className="bunty-floating-card">
            <CharacterSprite character="bunty" expression="happy" size="md" />
            <div className="bunty-info">
              <strong>Bunty (Nephew)</strong>
              <small>“Tech Consultant” · 0 apps shipped</small>
            </div>
          </div>
        </div>

        {/* Right Side: Dialogue & Decision Tree */}
        <div className="client-dialogue-col">
          <div className="stage-step-tag">
            <span>STAGE 0{stage.step} OF 06</span>
            <h3>{stage.title}</h3>
          </div>

          {/* Client Speech Bubble */}
          <div className="client-speech-bubble" style={{ background: '#ffffff', color: '#160f22' }}>
            <p className="speech-text" style={{ color: '#160f22' }}>{stage.clientSpeech}</p>
            {stage.buntyInterjection && (
              <div className="bunty-whisper" style={{ background: '#fff4d6', color: '#583710' }}>
                <strong style={{ color: '#78350f' }}>BUNTY CHIMES IN:</strong>
                <p style={{ color: '#451a03' }}>{stage.buntyInterjection}</p>
              </div>
            )}
          </div>

          {/* Client Reaction Preview if selected */}
          <AnimatePresence>
            {selectedOption && (
              <motion.div
                className="client-reaction-panel"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <div className="reaction-speaker">
                  <strong>MR. PRAKASH’S REACTION:</strong>
                </div>
                <p className="reaction-body">{selectedOption.clientReaction}</p>
                {selectedOption.buntyReaction && (
                  <p className="bunty-reaction-body">
                    <em>Bunty:</em> {selectedOption.buntyReaction}
                  </p>
                )}
                {selectedOption.fatal && (
                  <div className="fatal-warning-tag">
                    <AlertTriangle size={16} />
                    <span>CRITICAL WARNING: This response is fatal!</span>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Options List */}
          <div className="decision-options-list">
            <span className="options-header-label">CHOOSE YOUR RESPONSE:</span>
            {stage.options.map((option, idx) => {
              const isSelected = selectedOption?.id === option.id;
              return (
                <button
                  key={option.id}
                  className={`decision-option-btn ${isSelected ? 'selected' : ''}`}
                  onClick={() => handleSelect(option)}
                >
                  <span className="option-index">0{idx + 1}</span>
                  <div className="option-texts">
                    <strong>{option.label}</strong>
                    <small>{option.detail}</small>
                  </div>
                  {isSelected && <span className="option-check-icon">✓</span>}
                </button>
              );
            })}
          </div>

          {/* Continue / Next Button */}
          <div className="client-meeting-bottom">
            <button
              className="meeting-continue-btn"
              disabled={!selectedOption}
              onClick={handleContinue}
            >
              {isFinalStep ? (
                <>
                  <Briefcase size={18} />
                  SIGN CONTRACT & BEGIN (CHAPTER 02)
                  <ArrowRight size={18} />
                </>
              ) : (
                <>
                  PROCEED WITH THIS ANSWER
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}

