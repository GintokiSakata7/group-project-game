import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowRight, BadgeCheck, BriefcaseBusiness, Check, ChevronLeft, CircleDollarSign,
  Lightbulb, MessageCircle, ShieldCheck, Sparkles, Target, TriangleAlert, Volume2, Flame, ThumbsUp
} from 'lucide-react';
import { useGameStore } from '../game/store';

type ScopeTier = 'must' | 'phase2' | 'later';

const scopeItems = [
  { id: 'homepage', title: 'Responsive Homepage', detail: 'Showcase Royal Feast Catering so it looks trustworthy on phones and laptops.', recommended: 'must' as ScopeTier },
  { id: 'catalogue', title: 'Menu & Catering Packages', detail: 'Clear menus, wedding thali options, prices, and serving sizes.', recommended: 'must' as ScopeTier },
  { id: 'whatsapp', title: 'WhatsApp Direct Enquiry', detail: 'One-click chat button with pre-filled event date and guest count.', recommended: 'must' as ScopeTier },
  { id: 'contact', title: 'Contact, Location & Hours', detail: 'Map location and direct phone numbers so customers can find the shop.', recommended: 'must' as ScopeTier },
  { id: 'responsive', title: 'Mobile Polish & Speed', detail: '92% of Hyderabad customers will open this link on mobile WhatsApp.', recommended: 'must' as ScopeTier },
  { id: 'seo', title: 'Local Google SEO Basics', detail: 'Ensure “Royal Feast Catering Hyderabad” shows up on Google Maps and search.', recommended: 'must' as ScopeTier },
  { id: 'payments', title: 'Online Payment Gateway', detail: 'UPI integration, merchant KYC, payment reconciliation, and receipts.', recommended: 'phase2' as ScopeTier },
  { id: 'admin', title: 'Custom CMS / Admin Portal', detail: 'Dashboard for Mr. Prakash to edit menu items without calling you at midnight.', recommended: 'phase2' as ScopeTier },
  { id: 'android', title: 'Android + iOS Mobile Apps', detail: 'Two app store review processes, push notifications, and 400 meetings.', recommended: 'later' as ScopeTier },
  { id: 'ai', title: 'AI Food Recommendation Bot', detail: 'An AI chatbot that pretends to taste biryani and halluncinates free naan.', recommended: 'later' as ScopeTier },
];

const stages = ['Discovery', 'Scope Defense', 'Approach', 'The Pitch', 'Commercials'];

const discoveryOptions = [
  {
    id: 'problem',
    title: '“What is the main problem you want this website to solve?”',
    detail: 'Cut through the 19 features and uncover the real commercial problem.',
    score: 25,
    clientMood: '👨🏻‍💼',
    clientQuote: '“Honestly? People love our mutton biryani at weddings, but when their relatives ask for our menu or want to book 200 plates, they cannot find us online. We lose bookings every single weekend.”',
    feedback: 'Spot on! You found the high-value business problem hiding behind the feature avalanche.'
  },
  {
    id: 'stack',
    title: '“Would you prefer a React micro-frontend or Next.js server actions?”',
    detail: 'Start with an enterprise tech lecture before understanding the customer.',
    score: 4,
    clientMood: '🤨',
    clientQuote: '“Is React something you put in biryani? Beta, I run a catering business, not an IT company. I just want people to call me and book food.”',
    feedback: 'A technology stack is not a business outcome. The client thinks React is a brand of basmati rice.'
  },
  {
    id: 'promise',
    title: '“No problem at all! We can build Swiggy, Uber Eats, and AI for ₹500!”',
    detail: 'Agree to everything immediately. Confidence is cheaper than engineering.',
    score: -20,
    clientMood: '🤑',
    clientQuote: '“Wonderful! My nephew Bunty also said we should add live drone delivery tracking and crypto payments. Since you agree, ₹500 is very fair!”',
    feedback: 'Danger: You just agreed to build a multi-billion dollar platform for the price of two pizzas.'
  },
];

const approachOptions = [
  {
    id: 'whatsapp_flow',
    title: 'A lightning-fast catalogue with a direct WhatsApp order flow',
    detail: 'Solve the discovery and booking problem in 7 days without platform complexity.',
    score: 20,
    feedback: 'Smart and realistic. The technology serves the immediate booking problem without endless maintenance.'
  },
  {
    id: 'custom_platform',
    title: 'A custom microservices cluster with a dedicated event-driven order queue',
    detail: 'Build scalable NASA infrastructure for traffic the client does not have yet.',
    score: 2,
    feedback: 'Varun would be proud. Unfortunately, your 5 developers will spend 6 days debugging Docker containers.'
  },
  {
    id: 'mobile_apps',
    title: 'Start by developing native iOS and Android apps',
    detail: 'Two native mobile apps before the business even has a working digital menu.',
    score: -10,
    feedback: 'The fastest way to burn ₹2,500 and miss the 7-day deadline by approximately 4 months.'
  },
];

const pitchOptions = [
  {
    id: 'value',
    title: '“Customers can browse your catering packages and book directly on WhatsApp. You get a live, polished website in 7 days with guaranteed support.”',
    detail: 'Sell a tangible business outcome, clear boundaries, and professional accountability.',
    score: 15,
    feedback: 'You sold peace of mind and more catering bookings instead of lines of code.'
  },
  {
    id: 'stack_pitch',
    title: '“We use Vite, Tailwind CSS v4, Zustand, React 19, and Git-driven verification.”',
    detail: 'List every dependency in your package.json file to sound impressive.',
    score: 4,
    feedback: 'Mr. Prakash is politely nodding while looking at his watch.'
  },
  {
    id: 'anything',
    title: '“Unlimited revisions! 24/7 on-call developers! We work on Sundays too!”',
    detail: 'Make desperate promises that will cause your entire team to quit by Day 3.',
    score: -15,
    feedback: 'Your team just felt a collective disturbance in the force. Morale is already dropping.'
  },
];

const priceOptions = [
  {
    id: 'mvp',
    price: 5000,
    title: '₹5,000 · Focused Phase 1 (50% Advance)',
    detail: 'Agreed website scope, ₹2,500 advance wired today, one consolidated revision pass, 7-day delivery.',
    score: 20,
    viable: true,
    label: 'RECOMMENDED VIABLE CONTRACT'
  },
  {
    id: 'support',
    price: 6500,
    title: '₹6,500 · Phase 1 + 14-Day Launch Buffer',
    detail: 'The same focused scope with two weeks of menu updates and support buffer for high-season bookings.',
    score: 15,
    viable: true,
    label: 'STRETCH CONTRACT'
  },
  {
    id: 'cheap',
    price: 500,
    title: '₹500 · The Client’s Original Dream',
    detail: 'Website, apps, AI bot, tracking, domain, server hosting, and unlimited revisions for ₹500 total.',
    score: -100,
    viable: false,
    label: 'THE TRAP (INSTANT BANKRUPTCY)'
  },
  {
    id: 'overquote',
    price: 25000,
    title: '₹25,000 · Enterprise Full Suite',
    detail: 'Quote the full enterprise wishlist to a local catering business without a phased plan.',
    score: -25,
    viable: false,
    label: 'CLIENT WILL WALK AWAY'
  },
];

export default function Negotiation() {
  const startCampaign = useGameStore((state) => state.startCampaign);
  const [stage, setStage] = useState(0);
  const [discovery, setDiscovery] = useState('');
  const [scope, setScope] = useState<Record<string, ScopeTier>>(() =>
    Object.fromEntries(scopeItems.map((item) => [item.id, item.recommended]))
  );
  const [approach, setApproach] = useState('');
  const [pitch, setPitch] = useState('');
  const [price, setPrice] = useState('');
  const [feedback, setFeedback] = useState('');
  const [showOutcome, setShowOutcome] = useState(false);

  const selectedDiscovery = discoveryOptions.find((item) => item.id === discovery);
  const clientAvatar = selectedDiscovery?.clientMood ?? '👨🏻‍💼';
  const clientCurrentQuote = selectedDiscovery?.clientQuote ??
    '“I need a simple website like Swiggy. Products, online ordering, payment gateway, AI chatbot, Android app, iOS app, delivery tracking. Nothing complicated. Budget is ₹500.”';

  const scopeScore = useMemo(() => {
    const essential = ['homepage', 'catalogue', 'whatsapp', 'contact', 'responsive', 'seo'];
    const good = essential.filter((id) => scope[id] === 'must').length;
    const appNotCommitted = ['android', 'ai'].filter((id) => scope[id] !== 'must').length;
    const laterPayments = ['payments', 'admin'].filter((id) => scope[id] !== 'must').length;
    const extraMust = ['payments', 'admin', 'android', 'ai'].filter((id) => scope[id] === 'must').length;
    return Math.round((good / essential.length) * 18 + (appNotCommitted / 2) * 4 + (laterPayments / 2) * 3 - extraMust * 8);
  }, [scope]);

  const choiceScore = (id: string, list: { id: string; score: number }[]) => list.find((item) => item.id === id)?.score ?? 0;
  const score = choiceScore(discovery, discoveryOptions) + scopeScore + choiceScore(approach, approachOptions) + choiceScore(pitch, pitchOptions) + choiceScore(price, priceOptions);
  const chosenPrice = priceOptions.find((item) => item.id === price);
  const essentials = scopeItems.filter((item) => scope[item.id] === 'must').map((item) => item.id);

  const next = () => {
    if (stage === 0 && !discovery) return;
    if (stage === 1) {
      const must = ['homepage', 'catalogue', 'whatsapp', 'contact', 'responsive', 'seo'];
      if (must.some((id) => scope[id] !== 'must')) {
        setFeedback('⚠️ The client’s immediate problem needs the core essentials in Phase 1 (Homepage, Menu, WhatsApp, Contact, Mobile, SEO). Keep them in Phase 1!');
        return;
      }
      setFeedback('✅ Excellent scope boundary! Keeping apps, AI, and complex payment gateways out of Phase 1 keeps the 7-day timeline viable.');
    }
    if (stage === 2 && !approach) return;
    if (stage === 3 && !pitch) return;
    if (stage === 4 && !price) return;
    if (stage < 4) {
      setFeedback('');
      setStage((current) => current + 1);
    } else {
      setShowOutcome(true);
    }
  };

  const finish = () => {
    if (!chosenPrice) return;
    const viableScope = ['homepage', 'catalogue', 'whatsapp', 'contact', 'responsive', 'seo'].every((id) => scope[id] === 'must') && ['payments', 'admin', 'android', 'ai'].every((id) => scope[id] !== 'must');

    // Immediate hilarious failure states
    if (!chosenPrice.viable || score < 55 || !viableScope) {
      useGameStore.setState({
        phase: 'ending',
        ending: {
          kind: 'negotiation',
          title: price === 'cheap' ? 'YOU SOLD SWIGGY FOR ₹500' : price === 'overquote' ? 'THE CLIENT FOUND A FREELANCER ON FIVERR' : 'THE PROPOSAL CRASHED AND BURNED',
          subtitle: 'The first client was also the final lesson',
          body: price === 'cheap'
            ? 'You accepted Swiggy, Uber Eats, iOS, Android, and AI drone delivery for ₹500. Mr. Prakash is thrilled and has already asked if you can also paint his restaurant banquet hall on weekends. Your 5 developers deleted Slack, formed an emotional support group, and moved to the Himalayas. Campaign terminated before Day 1.'
            : price === 'overquote'
              ? 'Mr. Prakash choked on his chai. He told you that for ₹25,000 he could open a second catering branch. He politely ended the call and hired Bunty’s college friend on Fiverr for ₹350. You made zero rupees.'
              : 'You failed to establish a credible, deliverable scope. The client left the call with more questions than answers. In tech, a founder must sell an outcome the team can actually deliver, not a fictional fantasy.',
          score: Math.max(0, score),
        },
      });
      return;
    }

    // Success! Campaign begins
    startCampaign({
      scopeAccepted: essentials,
      negotiationScore: Math.max(60, score),
      contractPrice: chosenPrice.price
    });
  };

  const cycleScope = (id: string) => {
    const order: ScopeTier[] = ['must', 'phase2', 'later'];
    setScope((current) => ({ ...current, [id]: order[(order.indexOf(current[id]) + 1) % order.length] }));
  };

  const feedbackText =
    stage === 0
      ? discoveryOptions.find((item) => item.id === discovery)?.feedback
      : stage === 2
      ? approachOptions.find((item) => item.id === approach)?.feedback
      : stage === 3
      ? pitchOptions.find((item) => item.id === pitch)?.feedback
      : feedback;

  return (
    <main className="negotiation-screen">
      <header className="negotiation-topbar">
        <div className="brand-lockup">
          <span className="brand-mark">P</span>
          <div>
            <strong>PANIC LABS</strong>
            <small>BUSINESS DEVELOPMENT / CLIENT DUEL</small>
          </div>
        </div>
        <div className="neg-status">
          <span className="live-dot" /> LIVE CLIENT DISCUSSION
          <span className="neg-time">ROUND 0{stage + 1} OF 05</span>
        </div>
        <span className="neg-badge">CLIENT RF-001</span>
      </header>

      <div className="negotiation-layout">
        <section className="neg-main">
          <div className="neg-kicker">
            <BriefcaseBusiness size={16} /> OPPORTUNITY / FIRST COMMERCIAL CLIENT
          </div>

          <div className="neg-title-row">
            <div>
              <h1>Royal Feast <em>needs a website.</em></h1>
              <p>Mr. Prakash · Owner, Royal Feast Catering · Hyderabad, India</p>
            </div>
            <div className="client-avatar" title={`Mood: ${clientAvatar}`}>
              {clientAvatar}
            </div>
          </div>

          {/* Client Speech Bubble */}
          <div className="client-quote">
            <span className="quote-label">MR. PRAKASH SAYS</span>
            {clientCurrentQuote}
            <span className="quote-signature">— Mr. Prakash, completely serious</span>
          </div>

          {/* Cousin Bunty Live Audio Note Banner */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '12px', marginTop: '12px', padding: '12px 16px',
            borderRadius: '10px', background: '#f5f0e1', border: '1px dashed #d9caa7', color: '#6d5a36', fontSize: '13px'
          }}>
            <Volume2 size={18} style={{ flex: 'none', color: '#b28637' }} />
            <div>
              <strong>🔊 Cousin Bunty (Voice Note 0:14):</strong>
              <span style={{ marginLeft: '6px' }}>“Bhaiya, don’t pay more than ₹500! My college senior built Amazon in 2 hours using HTML and ChatGPT!”</span>
            </div>
          </div>

          <div className="stage-progress">
            {stages.map((item, index) => (
              <div
                className={`stage-step ${index < stage ? 'complete' : index === stage ? 'active' : ''}`}
                key={item}
              >
                <span>{index < stage ? <Check size={14} /> : `0${index + 1}`}</span>
                {item}
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.section
              className="neg-step-card"
              key={stage}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              {stage === 0 && (
                <>
                  <div className="step-eyebrow">ROUND 01 / THE REALITY CHECK</div>
                  <h2>Before you build, discover what problem needs solving.</h2>
                  <p className="step-description">
                    The client has demanded 19 features for ₹500. Pick your opening strategy to uncover the real business need.
                  </p>
                  <div className="decision-list">
                    {discoveryOptions.map((option) => (
                      <button
                        key={option.id}
                        className={`decision-option ${discovery === option.id ? 'selected' : ''}`}
                        onClick={() => {
                          setDiscovery(option.id);
                          setFeedback(option.feedback);
                        }}
                      >
                        <span className="option-radio" />
                        <span>
                          <strong>{option.title}</strong>
                          <small>{option.detail}</small>
                        </span>
                        <ArrowRight size={18} />
                      </button>
                    ))}
                  </div>
                </>
              )}

              {stage === 1 && (
                <>
                  <div className="step-eyebrow">ROUND 02 / SCOPE DEFENSE</div>
                  <h2>Slap away feature creep before it destroys your week.</h2>
                  <p className="step-description">
                    Tap a card to cycle its tier. Keep the 6 essential features in <strong>PHASE 1</strong>. Move apps and AI to <strong>FUTURE</strong>!
                  </p>
                  <div className="scope-legend">
                    <span><i className="tier-dot must" />PHASE 1 (THIS WEEK)</span>
                    <span><i className="tier-dot phase2" />PHASE 2 (LATER)</span>
                    <span><i className="tier-dot later" />FUTURE (NEVER)</span>
                  </div>
                  <div className="scope-grid">
                    {scopeItems.map((item) => (
                      <button
                        key={item.id}
                        className={`scope-card tier-${scope[item.id]}`}
                        onClick={() => cycleScope(item.id)}
                      >
                        <span className="scope-icon">
                          {scope[item.id] === 'must' ? '●' : scope[item.id] === 'phase2' ? '◐' : '○'}
                        </span>
                        <span>
                          <strong>{item.title}</strong>
                          <small>{item.detail}</small>
                        </span>
                        <em>{scope[item.id] === 'must' ? 'PHASE 1' : scope[item.id] === 'phase2' ? 'PHASE 2' : 'FUTURE'}</em>
                      </button>
                    ))}
                  </div>
                </>
              )}

              {stage === 2 && (
                <>
                  <div className="step-eyebrow">ROUND 03 / SOLUTION ARCHITECTURE</div>
                  <h2>Choose what to deliver, not what sounds fanciest.</h2>
                  <p className="step-description">
                    What is the leanest, most reliable way to let people discover Royal Feast and book catering?
                  </p>
                  <div className="decision-list">
                    {approachOptions.map((option) => (
                      <button
                        key={option.id}
                        className={`decision-option ${approach === option.id ? 'selected' : ''}`}
                        onClick={() => {
                          setApproach(option.id);
                          setFeedback(option.feedback);
                        }}
                      >
                        <span className="option-radio" />
                        <span>
                          <strong>{option.title}</strong>
                          <small>{option.detail}</small>
                        </span>
                        <ArrowRight size={18} />
                      </button>
                    ))}
                  </div>
                </>
              )}

              {stage === 3 && (
                <>
                  <div className="step-eyebrow">ROUND 04 / THE PITCH</div>
                  <h2>Why should Mr. Prakash hire you instead of cousin Bunty?</h2>
                  <p className="step-description">
                    Sell business reliability, outcomes, and clear delivery terms.
                  </p>
                  <div className="decision-list">
                    {pitchOptions.map((option) => (
                      <button
                        key={option.id}
                        className={`decision-option ${pitch === option.id ? 'selected' : ''}`}
                        onClick={() => {
                          setPitch(option.id);
                          setFeedback(option.feedback);
                        }}
                      >
                        <span className="option-radio" />
                        <span>
                          <strong>{option.title}</strong>
                          <small>{option.detail}</small>
                        </span>
                        <ArrowRight size={18} />
                      </button>
                    ))}
                  </div>
                </>
              )}

              {stage === 4 && (
                <>
                  <div className="step-eyebrow">ROUND 05 / COMMERCIALS & ADVANCE</div>
                  <h2>Put a price on the contract.</h2>
                  <p className="step-description">
                    You have 5 teammates and 7 days. Choose a viable contract price with a 50% upfront deposit.
                  </p>
                  <div className="price-grid">
                    {priceOptions.map((option) => (
                      <button
                        key={option.id}
                        className={`price-card ${price === option.id ? 'selected' : ''} ${!option.viable ? 'risky' : ''}`}
                        onClick={() => setPrice(option.id)}
                      >
                        <span>{option.label}</span>
                        <strong>{option.title}</strong>
                        <small>{option.detail}</small>
                      </button>
                    ))}
                  </div>
                </>
              )}

              {feedbackText && (
                <motion.div
                  className="coach-note"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Lightbulb size={20} />
                  <span>{feedbackText}</span>
                </motion.div>
              )}

              <div className="neg-actions">
                <button
                  className="btn-quiet"
                  onClick={() => (stage === 0 ? undefined : setStage((current) => current - 1))}
                  disabled={stage === 0}
                >
                  <ChevronLeft size={17} /> BACK
                </button>

                <div className="neg-score-preview">
                  <span>PROPOSAL REPUTATION</span>
                  <strong>{Math.max(0, score)}<small> / 100</small></strong>
                </div>

                {stage < 4 ? (
                  <button
                    className="btn-primary"
                    onClick={next}
                    disabled={(stage === 0 && !discovery) || (stage === 2 && !approach) || (stage === 3 && !pitch)}
                  >
                    CONTINUE TO NEXT ROUND <ArrowRight size={17} />
                  </button>
                ) : (
                  <button
                    className="btn-primary"
                    onClick={next}
                    disabled={!price}
                  >
                    SUBMIT FINAL PROPOSAL <ArrowRight size={17} />
                  </button>
                )}
              </div>
            </motion.section>
          </AnimatePresence>
        </section>

        {/* Sidebar Info */}
        <aside className="neg-sidebar">
          <div className="sidebar-panel client-panel">
            <div className="panel-label">
              <span>CLIENT PROFILE</span>
              <span className="client-status">● LIVE CALL</span>
            </div>
            <div className="client-profile">
              <div className="client-avatar small">{clientAvatar}</div>
              <div>
                <strong>Mr. Prakash</strong>
                <small>Royal Feast Catering · Hyderabad</small>
              </div>
            </div>
            <div className="client-stats">
              <div>
                <span>BUDGET</span>
                <strong>₹500</strong>
              </div>
              <div>
                <span>DEADLINE</span>
                <strong>7 DAYS</strong>
              </div>
            </div>
            <div className="client-traits">
              <span>Chai drinker</span>
              <span>Feature collector</span>
              <span>Listens to Bunty</span>
            </div>
          </div>

          <div className="sidebar-panel insight-panel">
            <div className="panel-label">
              <Target size={14} /> FOUNDER’S OBJECTIVES
            </div>
            <div className="check-row">
              <span className={discovery ? 'checked' : ''}>{discovery ? <Check size={14} /> : '1'}</span>
              Uncover the real business problem
            </div>
            <div className="check-row">
              <span className={stage > 1 ? 'checked' : ''}>{stage > 1 ? <Check size={14} /> : '2'}</span>
              Slap away feature creep (Apps & AI)
            </div>
            <div className="check-row">
              <span className={approach ? 'checked' : ''}>{approach ? <Check size={14} /> : '3'}</span>
              Pick catalogue + WhatsApp flow
            </div>
            <div className="check-row">
              <span className={pitch ? 'checked' : ''}>{pitch ? <Check size={14} /> : '4'}</span>
              Pitch outcome over buzzwords
            </div>
            <div className="check-row">
              <span className={price ? 'checked' : ''}>{price ? <Check size={14} /> : '5'}</span>
              Secure ₹5,000 + 50% advance
            </div>
          </div>

          <div className="sidebar-tip">
            <Sparkles size={18} />
            <div>
              <strong>Founder Wisdom</strong>
              <p>When a client asks for 19 features for ₹500, they don’t need technology—they need boundaries.</p>
            </div>
          </div>
        </aside>
      </div>

      {/* Contract Confirmation Modal */}
      <AnimatePresence>
        {showOutcome && chosenPrice && (
          <motion.div
            className="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="contract-modal"
              initial={{ y: 20, scale: 0.98 }}
              animate={{ y: 0, scale: 1 }}
            >
              <div className="contract-icon">
                <BriefcaseBusiness size={26} />
              </div>
              <div className="step-eyebrow">CONTRACT READY FOR SIGNATURE</div>
              <h2>Ready to put Panic Labs on the line?</h2>
              <p>
                Your final proposal score is <strong>{Math.max(0, score)}</strong>. Mr. Prakash has agreed to review the terms.
                Signing this locks in 7 calendar days to deliver.
              </p>

              <div className="contract-summary">
                <div>
                  <span>PROJECT</span>
                  <strong>Royal Feast Digital Presence</strong>
                </div>
                <div>
                  <span>CONTRACT VALUE</span>
                  <strong>₹{chosenPrice.price.toLocaleString('en-IN')}</strong>
                </div>
                <div>
                  <span>50% ADVANCE WIRED</span>
                  <strong style={{ color: '#4a7522' }}>
                    +₹{(chosenPrice.price * 0.5).toLocaleString('en-IN')} Cash
                  </strong>
                </div>
                <div>
                  <span>DEADLINE</span>
                  <strong>7 Days (Day 7, 6:00 PM)</strong>
                </div>
              </div>

              <div className="contract-warning">
                <TriangleAlert size={18} />
                <span>Once signed, your 5 teammates are on the clock. Slack is already active.</span>
              </div>

              <div className="contract-actions">
                <button className="btn-quiet" onClick={() => setShowOutcome(false)}>
                  REVISE TERMS
                </button>
                <button className="btn-primary" onClick={finish}>
                  SIGN CONTRACT & START DAY 01 <ArrowRight size={17} />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
