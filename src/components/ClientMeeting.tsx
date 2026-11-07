import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Check,
  ArrowRight,
  AlertTriangle,
  Flame,
  Phone,
  PhoneOff,
  Briefcase,
  Coffee,
  Mic,
  Video,
  ShieldCheck,
  Clock,
  Sparkles,
  Zap,
  TrendingUp,
} from 'lucide-react';
import { useGameStore } from '../game/store';
import { CharacterSprite, type Expression } from './CharacterSprite';
import { sound } from '../game/audio';

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
  tacticalBadge?: string;
}

interface MeetingStage {
  step: number;
  title: string;
  prakashSpeech: string;
  buntyStickyNote: string;
  options: DecisionOption[];
}

const stages: MeetingStage[] = [
  {
    step: 1,
    title: 'THE IMPOSSIBLE WISHLIST',
    prakashSpeech:
      '“Namaste founder beta! Mr. Prakash here, owner of Royal Feast Catering. My nephew Bunty says 5 boys with laptops can build an app faster than Swiggy! We need a full digital transformation: Android app, iOS app, live biryani GPS tracking with NASA satellite imagery, crypto payments in $BIRYANI coin, and an AI voice bot with Amitabh Bachchan’s voice that recites romantic poetry while people order samosas. My total budget is ₹500. Can we launch by tomorrow evening?”',
    buntyStickyNote:
      'Uncle, tell them to use Web4! If the shahi paneer is an NFT on the blockchain, people can trade it like Bitcoin!',
    options: [
      {
        id: 'problem',
        label: '“Mr. Prakash, before we build AI samosas... what is the #1 headache driving you crazy in your kitchen right now?”',
        detail: 'Cut through the buzzword jungle to find the real commercial bottleneck.',
        tacticalBadge: '🎯 Commercial Clarity',
        score: 30,
        clientReaction:
          '“Actually... my personal phone rings 114 times a day with wedding uncles asking for the menu and price list! I can’t even take a shower without someone screaming: ‘DOES THE BUTTER CHICKEN COME WITH SALAD?!’”',
        clientExpression: 'talking',
        buntyReaction: '“Wait, phone calls are Web1. We need a metaverse banquet hall with virtual gravy!”',
      },
      {
        id: 'tech_jargon',
        label: '“Would you prefer a decentralized Kubernetes cluster with serverless React 19 micro-frontends and vector embeddings?”',
        detail: 'Fire incomprehensible developer buzzwords right back at the client.',
        tacticalBadge: '🤓 Tech Jargon Fluff',
        score: 5,
        clientReaction:
          '“Is Kubernetes a type of Mughlai gravy? Son, I run a tandoor kitchen, not an astronaut training academy. Speak human language!”',
        clientExpression: 'exhausted',
        buntyReaction: '“I think Kubernetes was in an anime I watched. Sounds legit.”',
      },
      {
        id: 'yes_man',
        label: '“Done deal! Android, iOS, blockchain biryani, Amitabh AI for ₹500! We launch on Tuesday!”',
        detail: 'Accept impossible demands blindly. What could possibly go wrong?',
        tacticalBadge: '💀 Lethal Yes-Man',
        score: -50,
        fatal: true,
        fatalTitle: 'BANKRUPT BEFORE DAY 1',
        fatalBody:
          'You agreed to build 2 native apps, GPS satellite tracking, and a voice AI for ₹500. Upon hearing this in the office, your five employees immediately resigned, Meera filed a labor dispute, and Kunal deleted his Slack account.',
        clientReaction: '“Wonderful! Also add a flying drone that drops gulab jamuns into mouths. Bunty, bring the contract!”',
        clientExpression: 'happy',
      },
    ],
  },
  {
    step: 2,
    title: 'DISCOVERING THE REAL MVP',
    prakashSpeech:
      '“Bunty insists that without a 3D Metaverse banquet hall, our brand is invisible to Gen-Z. But tell me honestly: what do we actually need to launch first so my kitchen staff stops answering 114 phone calls a day?”',
    buntyStickyNote:
      'At least let them add a flying biryani drone animation that follows the mouse cursor! It builds emotional synergy!',
    options: [
      {
        id: 'whatsapp_mvp',
        label: '“A crisp, responsive website showcasing your menu packages with an instant ‘Book via WhatsApp’ button.”',
        detail: 'Solve the real issue: pre-structured menu packages + direct WhatsApp enquiries without bloated infrastructure.',
        tacticalBadge: '✨ Clean MVP Strategy',
        score: 30,
        clientReaction:
          '“Direct WhatsApp enquiries? With the package rates already listed so uncles can’t bargain for 40 minutes?! That alone would save my kitchen four hours every day! Now you are talking sense!”',
        clientExpression: 'happy',
        buntyReaction: '“Hmm... WhatsApp is kinda mainstream. But I guess my grandmother uses it...”',
      },
      {
        id: 'microservices',
        label: '“A custom distributed multi-tenant booking engine with automated chef shift algorithms.”',
        detail: 'Over-engineer an enterprise ERP for a single local catering business.',
        tacticalBadge: '⚙️ Over-engineered Architecture',
        score: 5,
        clientReaction:
          '“Look, if an uncle clicks this button on his 6-year-old Samsung phone at a wedding hall with 2G network, will it open? No? Then keep it simple!”',
        clientExpression: 'neutral',
        buntyReaction: '“Algorithms are cool, but does it have a dark mode toggle?”',
      },
      {
        id: 'apps_first',
        label: '“We must build native Android and iOS apps first with biometric login and background GPS tracking.”',
        detail: 'Force wedding guests to download a 200MB app to view a food menu.',
        tacticalBadge: '📱 Bloated Scope',
        score: -20,
        clientReaction:
          '“Two apps?! Why would an uncle install a 200MB app just to order samosas for his daughter’s sangeet once every 3 years? Have you lost your mind?!”',
        clientExpression: 'shocked',
        buntyReaction: '“Uncle, push notifications could remind people to eat biryani every 2 hours!”',
      },
    ],
  },
  {
    step: 3,
    title: 'SCOPE BOUNDARIES & SPRINT COMMITS',
    prakashSpeech:
      '“Okay, the menu website sounds sensible. But Bunty has sent me a list of 14 extra requirements: customer loyalty coins, automated reviews, photo gallery of 4,000 wedding cakes, and an animated dancing waiter. Can we squeeze all of this into the 7-day sprint?”',
    buntyStickyNote:
      'Don’t let them cut features! I saw a reel where a guy built Instagram during his train commute! Software is free!',
    options: [
      {
        id: 'phased_delivery',
        label: '“Phase 1 launches in 7 days with the core menu and WhatsApp flow. All extra bells and whistles become Phase 2 once real client revenue starts flowing.”',
        detail: 'Firm, professional boundary: protect the timeline while assuring future roadmap.',
        tacticalBadge: '🛡️ Scope Shield',
        score: 25,
        clientReaction:
          '“That is how a real businessman speaks. Ship Phase 1, prove to my family that orders are coming in, and we talk about Phase 2 next month. Deal!”',
        clientExpression: 'happy',
        buntyReaction: '“Fine... Phase 2 will have the 3D hologram logo with ray-tracing though.”',
      },
      {
        id: 'squeeze_all',
        label: '“Sure, we will crunch all night and cram all 14 features into the 7 days without altering the deadline.”',
        detail: 'Make impossible promises. Your team will stage a mutiny by Day 3.',
        tacticalBadge: '🔥 Crunch & Chaos',
        score: -15,
        clientReaction:
          '“Great! 14 features in 7 days guaranteed. If one button breaks, I am deducting penalty fees from your advance!”',
        clientExpression: 'smug',
        buntyReaction: '“I will prepare 18 more requirements tonight!”',
      },
      {
        id: 'insult_client',
        label: '“Those features are completely idiotic and your nephew Bunty clearly learned coding from 30-second TikTok videos.”',
        detail: 'Directly attack the client’s favorite nephew. Bold strategy.',
        tacticalBadge: '💥 Diplomatic Suicide',
        score: -35,
        clientReaction:
          '“Excuse me?! Bunty got 94% in 10th standard computer applications! He knows what an algorithm is! Watch your tongue, young founder!”',
        clientExpression: 'shocked',
        buntyReaction: '“Uncle, don’t give them the contract! My Shawarma friend will code it!”',
      },
    ],
  },
  {
    step: 4,
    title: 'THE COMMERCIAL PROPOSAL',
    prakashSpeech:
      '“Now, founder... about my ₹500 budget. You’ve convinced me that a working website is valuable. But I am an old-school businessman. What is your commercial proposal for this 7-day Phase 1 delivery?”',
    buntyStickyNote:
      'Uncle, remind them my friend from college does full-stack websites in exchange for two chicken shawarmas and a Steam gift card!',
    options: [
      {
        id: 'price_5000',
        label: '“₹5,000 total. 50% advance (₹2,500) today to reserve the sprint, 50% upon Day 7 delivery and handover. 1 round of revisions included.”',
        detail: 'The standard viable startup rate. Fair price, clear payment terms, realistic scope.',
        tacticalBadge: '💰 Standard Viable Rate',
        score: 25,
        clientReaction:
          '“₹5,000? For stopping 114 calls a day and booking ₹150,000 wedding contracts? DEAL! Send the contract!”',
        clientExpression: 'happy',
        buntyReaction: '“Okay, that’s actually reasonable. But I want a consultant credit on the homepage footer.”',
      },
      {
        id: 'price_6500',
        label: '“₹6,500 total. Includes the 7-day delivery + 7 days of post-launch priority support, menu updates, and WhatsApp troubleshooting.”',
        detail: 'Higher value with support buffer. Gives safety margin.',
        tacticalBadge: '💎 Premium Support Tier',
        score: 20,
        clientReaction:
          '“A bit steep for my taste, but post-launch peace of mind is worth something. Let’s do ₹6,500! Just make sure Bunty doesn’t break it!”',
        clientExpression: 'happy',
        buntyReaction: '“Make sure that support includes fixing my gaming laptop’s sound card too.”',
      },
      {
        id: 'price_500_trap',
        label: '“Fine, ₹500 total. We are so desperate for our first client that we will work for ₹71 per day.”',
        detail: 'The lethal trap. You will run out of money for electricity by Day 2.',
        tacticalBadge: '🪤 The ₹500 Death Trap',
        score: -100,
        fatal: true,
        fatalTitle: 'EXPLOITED & EVICTED',
        fatalBody:
          'You agreed to ₹500. After hosting, domain fees, and chai expenses, PANIC LABS had negative ₹840 in the bank. Your landlord confiscated the office beanbag, and Nikhil deleted his Telegram account.',
        clientReaction: '“Pleasure doing business with someone so pliable! Also wash my car on Day 5!”',
        clientExpression: 'smug',
      },
      {
        id: 'price_35000',
        label: '“₹35,000 non-negotiable enterprise agency retainer. Wire the advance or we hang up.”',
        detail: 'Overcharge a local SME caterer like a Fortune 500 bank.',
        tacticalBadge: '🤑 Out-of-Touch Enterprise',
        score: -60,
        fatal: true,
        fatalTitle: 'CLIENT WALKED OUT',
        fatalBody:
          'Mr. Prakash laughed for three straight minutes, choked on his cardamom chai, hung up the call, and gave the contract to Bunty’s college friend.',
        clientReaction: '“Thirty-five thousand?! Are you serving gold leaf biryani in the cloud?! Good day!”',
        clientExpression: 'shocked',
      },
    ],
  },
  {
    step: 5,
    title: 'CLIENT PUSHBACK & BUNTY’S REEL',
    prakashSpeech:
      '“Wait, beta... ₹5,000? Let’s be reasonable. My cousin got a wedding flyer printed for ₹800. Why does software cost ₹5,000? Also, Bunty just forwarded me a YouTube Shorts reel where an 11-year-old built Amazon with one prompt!”',
    buntyStickyNote:
      'The kid on YouTube had dark mode terminal and neon green font! He didn’t even ask for an advance!',
    options: [
      {
        id: 'defend_value',
        label: '“₹800 gets you a printed flyer that ends up in a dustbin. ₹5,000 gets you an automated booking machine that works 24/7 on every smartphone in India.”',
        detail: 'Ground the cost in tangible commercial outcomes and kitchen hours saved.',
        tacticalBadge: '🏆 Value Anchor',
        score: 25,
        clientReaction:
          '“Hmm. When you frame it like that, my catering packages start at ₹45,000 each. One single booked wedding pays for 9 websites! Bunty, close YouTube and listen to the founder!”',
        clientExpression: 'happy',
        buntyReaction: '“The reel had background EDM music. That was probably the secret.”',
      },
      {
        id: 'scope_tradeoff',
        label: '“We stick to ₹5,000, but we explicitly exclude custom mobile apps, AI generation, and payment gateways from the contract scope.”',
        detail: 'Hold the commercial line and repeat the deliverables in plain language.',
        tacticalBadge: '📋 Strict Contract Boundary',
        score: 18,
        clientReaction:
          '“Fine. I want the website and enquiries working first. But please write the exclusions clearly. Bunty keeps adding things to my list.”',
        clientExpression: 'neutral',
        buntyReaction: '“I have created a separate list called Phase 1.5. It is very important.”',
      },
      {
        id: 'reduce_scope_price',
        label: '“If ₹5,000 is tight, we can deliver a 1-page Quick-Launch Package at ₹3,500 with top 3 banquet menus and WhatsApp booking.”',
        detail: 'Offer a lower-priced, genuinely smaller product instead of discounting the same scope.',
        tacticalBadge: '💡 Downscoped Alternative',
        score: 12,
        contractPrice: 3500,
        clientReaction:
          '“That is practical thinking. Let us start with the one-page release at ₹3,500 and revisit the full website later.”',
        clientExpression: 'neutral',
        buntyReaction: '“Can the one page scroll horizontally like a Mario game?”',
      },
      {
        id: 'give_in',
        label: '“Okay, ₹500. We will include everything. Please do not cancel on us.”',
        detail: 'Confuse winning a client with signing an impossible suicide pact.',
        tacticalBadge: '💀 Desperation Trap',
        score: -100,
        fatal: true,
        fatalTitle: 'THE ₹500 TRAP',
        fatalBody:
          'The client repeats the full wishlist back to you and asks for a written guarantee. You sign. Kunal changes his title to Chief Exit Officer, Meera documents the labor complaint, and the company has delivered an expensive lesson.',
        clientReaction: '“Excellent. Also add a drone that delivers biryani. Same budget.”',
        clientExpression: 'smug',
      },
    ],
  },
  {
    step: 6,
    title: 'THE PAYMENT TERMS ULTIMATUM',
    prakashSpeech:
      '“One final small thing. I usually pay after 90 days once my wife, Bunty, and four cousins in Kanpur have tested every single pixel. Also, can you include free hosting and unlimited revisions forever? It’s standard custom in our family.”',
    buntyStickyNote:
      'Uncle, ask if their warranty covers my gaming laptop’s graphics card. It overheats when I play Valorant.',
    options: [
      {
        id: 'proper_terms',
        label: '“50% advance to reserve the sprint, 50% after the agreed handover. 1 round of revisions and a 7-day bug-fix warranty; hosting/domain are separate.”',
        detail: 'Set clear payment milestones, revision boundaries and a limited warranty.',
        tacticalBadge: '🔒 Airtight Terms',
        score: 22,
        clientReaction:
          '“Fifty percent today? ...Okay, that is fair. You need to block your team for seven days. One revision is enough. My wife can send one combined list, not 46 separate calls.”',
        clientExpression: 'happy',
        buntyReaction: '“I have already typed 46 WhatsApp messages. Should I combine them into a PDF?”',
      },
      {
        id: 'milestone_terms',
        label: '“50% advance, 25% after the working preview, and 25% after handover. 1 revision and 7-day defect support.”',
        detail: 'Offer a structured milestone schedule while protecting the scope.',
        tacticalBadge: '📈 Milestone Schedule',
        score: 16,
        clientReaction:
          '“That sounds manageable. I can send the booking amount today. Please put every deliverable and exclusion in writing.”',
        clientExpression: 'neutral',
        buntyReaction: '“Can the invoice have a QR code that plays our brand anthem?”',
      },
      {
        id: 'no_advance_unlimited',
        label: '“No advance is fine! We will provide unlimited revisions, free hosting, and one year of support for free!”',
        detail: 'Accept an open-ended obligation with zero cash-flow protection.',
        tacticalBadge: '💀 Free Work Curse',
        score: -100,
        fatal: true,
        fatalTitle: 'THE LIFETIME SUPPORT CURSE',
        fatalBody:
          'You accepted unlimited revisions, free hosting, and a year of support without an advance. Day 2: a new logo. Day 3: an Android app. By midnight, Bunty asked whether you can repair his laser printer. PANIC LABS has become an unpaid family subscription service.',
        clientReaction: '“Excellent! I knew you understood business. I will pay once everyone is fully satisfied in 2028.”',
        clientExpression: 'smug',
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
  const initialAnswered = typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('answered') === 'true';
  const [callAnswered, setCallAnswered] = useState(initialAnswered);
  const [callSeconds, setCallSeconds] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [chaiSips, setChaiSips] = useState(0);

  const companyName = useGameStore((state) => state.companyName);
  const startCampaign = useGameStore((state) => state.startCampaign);
  const triggerGameOver = useGameStore((state) => state.triggerGameOver);

  const stage = stages[currentStageIdx];
  const isFinalStep = currentStageIdx === stages.length - 1;

  // Live call timer
  useEffect(() => {
    if (!callAnswered) return;
    const interval = setInterval(() => {
      setCallSeconds((s) => s + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [callAnswered]);

  const formatTimer = (sec: number) => {
    const m = String(Math.floor(sec / 60)).padStart(2, '0');
    const s = String(sec % 60).padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleSelect = (option: DecisionOption) => {
    sound.playClick(true);
    setSelectedOption(option);
    if (option.fatal) {
      sound.playBuzzer();
    } else if (option.score >= 25) {
      sound.playSuccess();
    }
  };

  const handleSipChai = () => {
    sound.playClick();
    setChaiSips((c) => c + 1);
  };

  const handleContinue = () => {
    if (!selectedOption) return;

    const newScore = score + selectedOption.score;
    setScore(newScore);

    // Fatal game over check
    if (selectedOption.fatal) {
      sound.playBuzzer();
      triggerGameOver({
        title: selectedOption.fatalTitle ?? 'NEGOTIATION COLLAPSED',
        subtitle: 'Deal Terminated',
        body: selectedOption.fatalBody ?? 'The client negotiation ended in catastrophic failure.',
        reason: 'failed_negotiation',
      });
      return;
    }

    if (stage.step === 4) {
      const price = selectedOption.id === 'price_6500' ? 6500 : 5000;
      setChosenPrice(price);
      sound.playCash();
      setSelectedOption(null);
      setCurrentStageIdx((idx) => idx + 1);
      return;
    }

    if (stage.step === 5) {
      if (selectedOption.contractPrice) {
        setChosenPrice(selectedOption.contractPrice);
        setChosenScope(['homepage', 'whatsapp', 'contact']);
      }
      sound.playClick();
      setSelectedOption(null);
      setCurrentStageIdx((idx) => idx + 1);
      return;
    }

    if (stage.step === 6) {
      if (newScore < 75) {
        sound.playBuzzer();
        triggerGameOver({
          title: 'DEAL COLLAPSED',
          subtitle: 'The terms never made it to paper',
          body: 'Mr. Prakash says the offer sounds confusing. Bunty has already forwarded a reel titled “Build a full startup in 20 minutes”. The client ends the call and gives the project to someone who promised it for ₹499 with lifetime support included.',
          reason: 'failed_negotiation',
        });
        return;
      }
      sound.playSuccess();
      startCampaign({
        scopeAccepted: chosenScope,
        negotiationScore: newScore,
        contractPrice: chosenPrice,
      });
      return;
    }

    sound.playClick();
    setSelectedOption(null);
    setCurrentStageIdx((idx) => idx + 1);
  };

  const clientMood: Expression = selectedOption
    ? selectedOption.clientExpression
    : score >= 40
    ? 'happy'
    : score < 0
    ? 'shocked'
    : 'neutral';

  const dealPatience = Math.max(10, Math.min(100, 50 + score));

  // --- SCREEN 1: THE INCOMING CALL SIMULATION ---
  if (!callAnswered) {
    return (
      <main className="client-meeting-screen call-first-screen">
        <div className="client-meeting-noise" />
        <div className="incoming-call-fullscreen">
          <div className="incoming-call-pulse">
            <Phone size={28} className="phone-vibrate" />
          </div>
          <span className="call-screen-kicker">{companyName.toUpperCase()} · INCOMING CLIENT CALL</span>
          <div className="call-avatar-glow">
            <CharacterSprite character="prakash" expression="happy" size="xl" speaking />
          </div>
          <h1>Mr. Prakash is calling...</h1>
          <p>Royal Feast Catering · Unknown Caller (+91 98200-XXXXX)</p>
          <div className="incoming-call-quote">
            “Hello? Hello?! Is this {companyName}? My nephew Bunty says 5 boys with laptops can build an app faster than Swiggy. Are you ready for a ₹500 digital revolution?”
          </div>
          <div className="incoming-call-actions">
            <button
              className="decline-call-button"
              onClick={() => {
                sound.playBuzzer();
                triggerGameOver({
                  title: 'THE FIRST CALL WAS DECLINED',
                  subtitle: 'Opportunity evaporated',
                  body: 'Mr. Prakash called Bunty’s college friend instead. Bunty has already posted “Founder mindset” on LinkedIn with a picture of two shawarmas.',
                  reason: 'failed_negotiation',
                });
              }}
            >
              <PhoneOff size={18} /> DECLINE & DIE
            </button>
            <button
              className="answer-call-button"
              onClick={() => {
                sound.playClick();
                sound.playNotification();
                setCallAnswered(true);
              }}
            >
              <Phone size={22} /> ANSWER THE CALL
            </button>
          </div>
          <small className="call-screen-foot">Somewhere nearby, nephew Bunty is preparing a 47-slide feature wishlist.</small>
        </div>
      </main>
    );
  }

  // --- SCREEN 2: THE INTERACTIVE VIDEO CALL HUD ---
  return (
    <main className="client-meeting-screen">
      <div className="client-meeting-noise" />

      {/* Video Call Top Bar */}
      <header className="meeting-call-header">
        <div className="call-brand-pill">
          <span className="live-rec-dot" />
          <strong>CHAI-MEET HD</strong>
          <span className="call-divider">/</span>
          <span className="call-timer-chip">
            <Clock size={12} /> {formatTimer(callSeconds)}
          </span>
          <span className="call-security-badge">
            <ShieldCheck size={12} /> 256-BIT ENCRYPTED CHAI STREAM
          </span>
        </div>

        {/* Dynamic Client Patience / Deal Gauge */}
        <div className="deal-patience-panel">
          <div className="patience-label-row">
            <span>CLIENT CONFIDENCE:</span>
            <strong className={dealPatience >= 65 ? 'text-good' : dealPatience < 35 ? 'text-warning' : ''}>
              {dealPatience}%
            </strong>
          </div>
          <div className="patience-meter-bar">
            <div
              className={`patience-fill ${
                dealPatience >= 65 ? 'fill-good' : dealPatience < 35 ? 'fill-danger' : 'fill-warn'
              }`}
              style={{ width: `${dealPatience}%` }}
            />
          </div>
          <span className="patience-subtext">
            {dealPatience >= 70
              ? '🔥 Prakash is smelling biryani profits! (Deal Locked)'
              : dealPatience >= 45
              ? '⚖️ Prakash is listening carefully...'
              : '⚠️ Danger: Nephew Bunty is gaining influence!'}
          </span>
        </div>

        {/* Call Controls */}
        <div className="call-quick-controls">
          <button
            className={`call-ctrl-btn ${isMuted ? 'active-warn' : ''}`}
            onClick={() => setIsMuted((m) => !m)}
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            <Mic size={14} />
          </button>
          <button
            className={`call-ctrl-btn ${isCameraOff ? 'active-warn' : ''}`}
            onClick={() => setIsCameraOff((c) => !c)}
            title={isCameraOff ? 'Turn on Camera' : 'Turn off Camera'}
          >
            <Video size={14} />
          </button>
          <button className="call-ctrl-btn chai-sip-btn" onClick={handleSipChai} title="Sip Lukewarm Chai">
            <Coffee size={14} />
            {chaiSips > 0 && <small>{chaiSips}</small>}
          </button>
        </div>
      </header>

      {/* Main Video Call Stage */}
      <section className="client-meeting-stage-v2">
        {/* Left Column: 3-Tile Video Grid (Mr. Prakash, Bunty, You) */}
        <div className="video-tiles-grid">
          {/* Tile 1: Mr. Prakash */}
          <div className="video-tile prakash-tile">
            <div className="tile-header">
              <span className="tile-live-badge">SPEAKING</span>
              <span className="tile-network-bars">📶 HD</span>
            </div>
            <div className="tile-sprite-wrap">
              <CharacterSprite character="prakash" expression={clientMood} size="xl" speaking={true} />
            </div>
            <div className="tile-footer-nameplate">
              <div>
                <strong>Mr. Prakash</strong>
                <small>Owner · Royal Feast Catering</small>
              </div>
              <span className="tile-role-pill">CATERING BOSS</span>
            </div>
          </div>

          {/* Tile 2: Bunty (Nephew & Tech Disruptor) */}
          <div className="video-tile bunty-tile">
            <div className="tile-header">
              <span className="tile-live-badge bunty-badge">NEPHEW CAM</span>
              <span className="tile-network-bars">👾 RGB</span>
            </div>
            <div className="tile-sprite-wrap bunty-sprite-wrap">
              <CharacterSprite character="bunty" expression="happy" size="md" />
              {/* Dynamic Bunty Sticky Note Popup */}
              <motion.div
                className="bunty-bubble-popup"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                key={stage.step}
              >
                <div className="bunty-bubble-header">
                  <Zap size={11} /> BUNTY (0 APPS SHIPPED):
                </div>
                <p>“{stage.buntyStickyNote}”</p>
              </motion.div>
            </div>
            <div className="tile-footer-nameplate">
              <div>
                <strong>Bunty (Nephew)</strong>
                <small>10th Std Computer Topper</small>
              </div>
              <span className="tile-role-pill bunty-pill">WEB4 GURU</span>
            </div>
          </div>

          {/* Tile 3: You (The Founder) */}
          <div className="video-tile founder-tile">
            <div className="tile-header">
              <span className="tile-live-badge founder-badge">YOU</span>
              <span className="tile-network-bars">☕ CHAI</span>
            </div>
            <div className="tile-sprite-wrap">
              <CharacterSprite character="founder" expression={isCameraOff ? 'neutral' : 'smug'} size="lg" />
            </div>
            <div className="tile-footer-nameplate">
              <div>
                <strong>You (Founder)</strong>
                <small>{companyName} · CEO</small>
              </div>
              <span className="tile-role-pill founder-pill">ON THE HOOK</span>
            </div>
          </div>
        </div>

        {/* Right Column: Dialogue Subtitle Box & Strategic Choices */}
        <div className="call-dialogue-column">
          <div className="call-stage-header">
            <span className="call-stage-badge">STAGE 0{stage.step} OF 06</span>
            <h2>{stage.title}</h2>
          </div>

          {/* Active Client Subtitle / Speech Bubble */}
          <div className="client-live-speech-box">
            <div className="speaker-identity-row">
              <span className="speaker-avatar-dot" />
              <strong>MR. PRAKASH IS SPEAKING:</strong>
            </div>
            <p className="speech-quote-text">{stage.prakashSpeech}</p>
          </div>

          {/* Real-time Reaction Preview if an option is selected */}
          <AnimatePresence>
            {selectedOption && (
              <motion.div
                className="client-reaction-panel"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <div className="reaction-speaker">
                  <Sparkles size={14} />
                  <strong>MR. PRAKASH’S DIRECT RESPONSE:</strong>
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
                    <span>CRITICAL WARNING: This answer terminates the company!</span>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Options Choice Grid */}
          <div className="decision-options-list">
            <span className="options-header-label">CHOOSE YOUR FOUNDER RESPONSE:</span>
            {stage.options.map((option, idx) => {
              const isSelected = selectedOption?.id === option.id;
              return (
                <button
                  key={option.id}
                  className={`decision-option-btn ${isSelected ? 'selected' : ''} ${
                    option.fatal ? 'is-fatal-card' : ''
                  }`}
                  onClick={() => handleSelect(option)}
                >
                  <span className="option-index">0{idx + 1}</span>
                  <div className="option-texts">
                    <div className="option-badge-row">
                      {option.tacticalBadge && <span className="option-tactical-chip">{option.tacticalBadge}</span>}
                    </div>
                    <strong>{option.label}</strong>
                    <small>{option.detail}</small>
                  </div>
                  {isSelected && <span className="option-check-icon">✓</span>}
                </button>
              );
            })}
          </div>

          {/* Continue / Lock Answer Button */}
          <div className="client-meeting-bottom">
            <button className="meeting-continue-btn" disabled={!selectedOption} onClick={handleContinue}>
              {isFinalStep ? (
                <>
                  <Briefcase size={18} />
                  LOCK CONTRACT & TAKE ADVANCE (CHAPTER 02)
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
