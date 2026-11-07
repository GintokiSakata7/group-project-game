import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  AlertCircle,
  ArrowRight,
  Camera,
  Check,
  CheckCircle2,
  Mic,
  MicOff,
  PhoneOff,
  Share2,
  Sparkles,
  Trophy,
  Users,
  Video,
  Volume2,
  Zap,
} from 'lucide-react';
import { useGameStore } from '../game/store';
import { CharacterSprite, type CharacterId } from './CharacterSprite';
import { sound } from '../game/audio';

interface DemoStage {
  step: number;
  kicker: string;
  prakashSpeech: string;
  buntySpeech?: string;
  teamSupport?: { speaker: CharacterId; text: string };
  options: {
    id: string;
    label: string;
    detail: string;
    score: number;
    reaction: string;
    prakashExpression: 'happy' | 'neutral' | 'shocked' | 'exhausted';
  }[];
}

export default function ClientDemoCall() {
  const { companyName, contractValue, metrics, tasks, defects, deliverProject } = useGameStore();

  const [currentStep, setCurrentStep] = useState(1);
  const [demoScore, setDemoScore] = useState(50);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [reactionText, setReactionText] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);

  // Check state of critical deliverables
  const homepageTask = tasks.find((t) => t.id === 'homepage');
  const catalogueTask = tasks.find((t) => t.id === 'catalogue');
  const whatsappTask = tasks.find((t) => t.id === 'whatsapp');
  const bug1Open = defects.some((d) => d.id === 'bug-1' && !d.fixed);

  const stages: DemoStage[] = [
    {
      step: 1,
      kicker: 'TEST 01 · THE CATERING PACKAGES & BRANDING',
      prakashSpeech:
        '“Namaste Founder beta! My entire family is on this call—my sister from Nagpur, my brother-in-law, and Bunty. Show us our catering website on your screenshare. Does our Grand Feast look appetizing?”',
      buntySpeech:
        '“Uncle, make sure to inspect if the buttons have neon RGB lighting like my gaming keyboard!”',
      teamSupport: {
        speaker: 'kunal',
        text: '“Founder, remember: confidence is 90% of the deliverable! You got this!”',
      },
      options: [
        {
          id: 'show_packages',
          label: '“Present the live menu packages: Lucknowi Dum Biryani, Galouti Kebabs & Guest Calculator.”',
          detail: 'Showcase the authentic catering packages and verified catalogue data.',
          score: (catalogueTask?.progress ?? 0) >= 60 ? 30 : 15,
          reaction:
            (catalogueTask?.progress ?? 0) >= 60
              ? '“Wah! The food photos look mouth-watering, and the ₹1,200/plate pricing is crystal clear. My sister is already smiling!”'
              : '“The menu text is nice, but why does the dessert section say ‘TODO: add gulab jamun’? Still, looks better than our old pamphlet!”',
          prakashExpression: (catalogueTask?.progress ?? 0) >= 60 ? 'happy' : 'neutral',
        },
        {
          id: 'praise_tradition',
          label: '“Highlight Royal Feast’s 30-year heritage and how the website reflects the family legacy.”',
          detail: 'Connect emotionally with the client before diving into technical details.',
          score: 25,
          reaction:
            '“You understand our family values! That’s what business is about. Technology is fine, but respect for tradition comes first.”',
          prakashExpression: 'happy',
        },
        {
          id: 'tech_slides',
          label: '“Open Varun’s 47-slide architecture deck on microservice containerization.”',
          detail: 'Bore the family with UML diagrams and distributed database schemas.',
          score: 5,
          reaction:
            '“Son, I asked to see biryani, not a blueprint for an electric generator. Is the website actually running?”',
          prakashExpression: 'exhausted',
        },
      ],
    },
    {
      step: 2,
      kicker: 'TEST 02 · BUNTY’S TECH AMBUSH',
      prakashSpeech:
        '“The website looks quite modern. But Bunty has been waving his hands furiously for the last 3 minutes. Bunty, what is the problem?”',
      buntySpeech:
        '“UNCLE! Where is the Web3 blockchain wallet?! Where is the AI that speaks like Amitabh Bachchan?! They built a normal website instead of a Metaverse Biryani Ecosystem!”',
      teamSupport: {
        speaker: 'varun',
        text: '“I have drafted a 12-page whitepaper explaining why Web3 biryani violates the laws of thermodynamics.”',
      },
      options: [
        {
          id: 'contract_shield',
          label: '“Bunty, our signed RF-001 agreement is for responsive web ordering. AI is scheduled for Phase 2.”',
          detail: 'Firmly stand on the signed scope and commercial contract terms.',
          score: 30,
          reaction:
            '“Exactly. Sensible business. First we start getting customer bookings, then we can think about flying robot waiters. Good discipline, Founder.”',
          prakashExpression: 'happy',
        },
        {
          id: 'upsell_phase2',
          label: '“We can activate the AI module next month for a separate ₹25,000 engagement.”',
          detail: 'Protect current release while turning Bunty’s enthusiasm into a future contract.',
          score: 25,
          reaction:
            '“₹25,000?! Bunty, if you want Amitabh Bachchan to recite samosa recipes, pay from your own pocket. Let’s stick to the website!”',
          prakashExpression: 'happy',
        },
        {
          id: 'apologize',
          label: '“I’m sorry Bunty... we didn’t have enough time to train the AI.”',
          detail: 'Show weakness and let the client question your team’s competence.',
          score: 5,
          reaction:
            '“Hmm. Bunty said software guys always promise big and deliver half. Don’t make promises you can’t keep.”',
          prakashExpression: 'neutral',
        },
      ],
    },
    {
      step: 3,
      kicker: 'TEST 03 · THE LIVE WHATSAPP BOOKING TEST (THE FINAL TRIAL)',
      prakashSpeech:
        '“Alright, now the moment of truth. I have opened the website on my Samsung phone. I am going to click the ‘Book on WhatsApp’ button right now. Does it actually send an enquiry to my kitchen phone?”',
      buntySpeech:
        '“Testing the live webhook payload! If it fails, I demand a 100% refund in crypto!”',
      teamSupport: {
        speaker: 'meera',
        text: bug1Open
          ? '“I WARNED EVERYONE ON DAY 1. The button had no onClick handler!”'
          : '“Test suite passed with green flags. The WhatsApp URL generation is solid.”',
      },
      options: [
        {
          id: 'live_click',
          label: '“Go ahead, Mr. Prakash. Click the button.”',
          detail: 'Let the real build state speak for itself.',
          score: !bug1Open && (whatsappTask?.progress ?? 0) >= 40 ? 35 : -15,
          reaction:
            !bug1Open && (whatsappTask?.progress ?? 0) >= 40
              ? '“DING! IT WORKED! WhatsApp opened immediately with ‘Royal Shaadi Grand Feast for 150 guests’! My chef just received it! BHAI WAH!”'
              : '“Wait... I clicked it three times. Nothing happened! It just says ‘undefined’ on my screen! Why is it not working?!”',
          prakashExpression: !bug1Open && (whatsappTask?.progress ?? 0) >= 40 ? 'happy' : 'shocked',
        },
        {
          id: 'offer_discount',
          label: '“Let’s do a test order together and offer a complimentary launch discount code.”',
          detail: 'Smooth over any minor hiccups with commercial generosity.',
          score: 20,
          reaction:
            '“Very polite. The enquiry reached my phone. A discount for launch is good business sense.”',
          prakashExpression: 'happy',
        },
      ],
    },
  ];

  const currentStage = stages.find((s) => s.step === currentStep) ?? stages[0];

  const handleSelectOption = (optId: string) => {
    const opt = currentStage.options.find((o) => o.id === optId);
    if (!opt) return;

    sound.playClick();
    setSelectedOption(optId);
    setDemoScore((s) => Math.min(100, Math.max(0, s + opt.score)));
    setReactionText(opt.reaction);

    if (opt.score >= 25) {
      sound.playCash();
    } else if (opt.score < 0) {
      sound.playBuzzer();
    }
  };

  const handleNextStage = () => {
    sound.playClick(true);
    setSelectedOption(null);
    setReactionText(null);

    if (currentStep < stages.length) {
      setCurrentStep((s) => s + 1);
    } else {
      // Completed Demo Call -> Proceed to final scorecard!
      sound.playSuccess();
      deliverProject();
    }
  };

  const selectedOptObj = currentStage.options.find((o) => o.id === selectedOption);

  return (
    <main className="client-demo-screen">
      {/* Top Video Call Bar */}
      <header className="demo-call-topbar">
        <div className="demo-call-brand">
          <span className="demo-live-dot" />
          <strong>LIVE CLIENT DEMO & ACCEPTANCE CALL</strong>
          <span className="demo-tag">ROYAL FEAST RF-001</span>
        </div>

        <div className="demo-approval-meter">
          <span>CLIENT APPROVAL:</span>
          <b>{demoScore}%</b>
          <div className="demo-meter-track">
            <span style={{ width: `${demoScore}%` }} />
          </div>
        </div>

        <div className="demo-call-controls">
          <button
            className={`demo-icon-btn ${isMuted ? 'is-off' : ''}`}
            onClick={() => {
              sound.playClick();
              setIsMuted((m) => !m);
            }}
          >
            {isMuted ? <MicOff size={15} /> : <Mic size={15} />}
          </button>
          <button
            className={`demo-icon-btn ${!isVideoOn ? 'is-off' : ''}`}
            onClick={() => {
              sound.playClick();
              setIsVideoOn((v) => !v);
            }}
          >
            <Video size={15} />
          </button>
        </div>
      </header>

      {/* Main Video Conference Grid */}
      <section className="demo-stage-layout">
        {/* Left Column: Video Participants Grid */}
        <div className="demo-video-grid">
          {/* Mr. Prakash Video Tile */}
          <div className="demo-video-tile client-tile is-speaking">
            <div className="demo-tile-badge">CLIENT · MAIN SPEAKER</div>
            <div className="demo-tile-avatar">
              <CharacterSprite
                character="prakash"
                size="lg"
                expression={selectedOptObj?.prakashExpression ?? 'talking'}
                speaking
              />
            </div>
            <div className="demo-tile-footer">
              <strong>Mr. Prakash</strong>
              <small>Royal Feast Catering</small>
            </div>
          </div>

          {/* Bunty Video Tile */}
          <div className="demo-video-tile bunty-tile">
            <div className="demo-tile-badge">BUNTY · TECH CONSULTANT</div>
            <div className="demo-tile-avatar">
              <CharacterSprite character="bunty" size="md" expression="smug" />
            </div>
            <div className="demo-tile-footer">
              <strong>Bunty</strong>
              <small>Nephew & Web3 Advocate</small>
            </div>
          </div>

          {/* Founder (You) Tile */}
          <div className="demo-video-tile founder-tile">
            <div className="demo-tile-badge">YOU · FOUNDER</div>
            <div className="demo-tile-avatar">
              <CharacterSprite character="founder" size="md" expression="smug" />
            </div>
            <div className="demo-tile-footer">
              <strong>You</strong>
              <small>{companyName} CEO</small>
            </div>
          </div>

          {/* Team Room Tile */}
          <div className="demo-video-tile team-tile">
            <div className="demo-tile-badge">PANIC LABS WAR ROOM</div>
            <div className="demo-mini-team-row">
              <CharacterSprite character="kunal" size="sm" expression="happy" />
              <CharacterSprite character="aarav" size="sm" expression="smug" />
              <CharacterSprite character="meera" size="sm" expression="shocked" />
              <CharacterSprite character="varun" size="sm" expression="neutral" />
            </div>
            <div className="demo-tile-footer">
              <strong>Engineering Team</strong>
              <small>5 Teammates Online</small>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Demo Narrative & Choice Cards */}
        <div className="demo-narrative-panel">
          <div className="demo-kicker-row">
            <span className="demo-step-badge">
              STAGE 0{currentStep} / 0{stages.length}
            </span>
            <span className="demo-kicker">{currentStage.kicker}</span>
          </div>

          {/* Client Speech Bubble */}
          <div className="demo-speech-box client-speech">
            <div className="speech-avatar">👨🏻‍💼</div>
            <div className="speech-content">
              <strong>Mr. Prakash:</strong>
              <p>{currentStage.prakashSpeech}</p>
            </div>
          </div>

          {/* Bunty Interjection */}
          {currentStage.buntySpeech && (
            <div className="demo-speech-box bunty-speech">
              <div className="speech-avatar">🧑🏻‍💻</div>
              <div className="speech-content">
                <strong>Bunty:</strong>
                <p>{currentStage.buntySpeech}</p>
              </div>
            </div>
          )}

          {/* Teammate Whisper / Support */}
          {currentStage.teamSupport && (
            <div className="demo-team-whisper">
              <CharacterSprite character={currentStage.teamSupport.speaker} size="sm" />
              <div>
                <small>INTERNAL TEAM WHISPER:</small>
                <p>{currentStage.teamSupport.text}</p>
              </div>
            </div>
          )}

          {/* Reaction Box */}
          {reactionText && (
            <motion.div
              className="demo-reaction-box"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="reaction-header">
                <CheckCircle2 size={16} />
                <strong>CLIENT VERDICT:</strong>
              </div>
              <p>{reactionText}</p>
            </motion.div>
          )}

          {/* Response Choices */}
          {!reactionText ? (
            <div className="demo-options-list">
              <span className="options-title">CHOOSE YOUR FOUNDER DEMO ACTION:</span>
              {currentStage.options.map((opt, i) => (
                <button
                  key={opt.id}
                  className="demo-option-btn"
                  onClick={() => handleSelectOption(opt.id)}
                >
                  <span className="opt-number">0{i + 1}</span>
                  <div className="opt-body">
                    <strong>{opt.label}</strong>
                    <small>{opt.detail}</small>
                  </div>
                  <ArrowRight size={16} />
                </button>
              ))}
            </div>
          ) : (
            <div className="demo-continue-row">
              <button className="demo-continue-btn" onClick={handleNextStage}>
                <span>
                  {currentStep < stages.length
                    ? 'CONTINUE TO NEXT TEST'
                    : 'FINALISE HANDOVER & DELIVER'}
                </span>
                <ArrowRight size={18} />
              </button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

