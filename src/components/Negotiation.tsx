import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, BadgeCheck, BriefcaseBusiness, Check, ChevronLeft, CircleDollarSign, Lightbulb, MessageCircle, ShieldCheck, Sparkles, Target, TriangleAlert } from 'lucide-react';
import { useGameStore } from '../game/store';

type ScopeTier = 'must' | 'phase2' | 'later';

const scopeItems = [
  { id: 'homepage', title: 'Responsive homepage', detail: 'Make the business look trustworthy on every screen.', recommended: 'must' as ScopeTier },
  { id: 'catalogue', title: 'Service & menu catalogue', detail: 'Show catering packages, menus and service options.', recommended: 'must' as ScopeTier },
  { id: 'whatsapp', title: 'WhatsApp enquiry flow', detail: 'Turn interest into a direct conversation.', recommended: 'must' as ScopeTier },
  { id: 'contact', title: 'Contact & location', detail: 'Make the next step obvious for customers.', recommended: 'must' as ScopeTier },
  { id: 'responsive', title: 'Mobile optimisation', detail: 'Most customers will view the website on a phone.', recommended: 'must' as ScopeTier },
  { id: 'seo', title: 'Basic on-page SEO', detail: 'Give search engines a sensible starting point in the first release.', recommended: 'must' as ScopeTier },
  { id: 'payments', title: 'Online payments', detail: 'Payment gateway, order confirmation and reconciliation.', recommended: 'phase2' as ScopeTier },
  { id: 'admin', title: 'Admin dashboard', detail: 'Let the client manage content without calling you.', recommended: 'phase2' as ScopeTier },
  { id: 'android', title: 'Android + iOS apps', detail: 'Two platforms, two release processes and many meetings.', recommended: 'later' as ScopeTier },
  { id: 'ai', title: 'AI chatbot', detail: 'A chatbot that knows the menu, prices and business policies.', recommended: 'later' as ScopeTier },
];

const stages = ['Discovery', 'Scope', 'Approach', 'Pitch', 'Commercials'];

const discoveryOptions = [
  { id: 'problem', title: '“What is the main problem you want this website to solve?”', detail: 'Customers cannot easily discover the catering services or send enquiries.', score: 25, feedback: 'Excellent. You found the business problem hiding underneath the feature avalanche.' },
  { id: 'stack', title: '“Would you prefer React or Next.js?”', detail: 'Start with the technology conversation before understanding the customer journey.', score: 4, feedback: 'A technology stack is not a business requirement. The client has asked if React is a type of food.' },
  { id: 'promise', title: '“No problem. We can build everything.”', detail: 'Avoid asking questions. Confidence is a substitute for planning.', score: -8, feedback: 'You have confused confidence with a delivery strategy. This will come back.' },
];

const approachOptions = [
  { id: 'whatsapp_flow', title: 'A responsive website with a catalogue and WhatsApp enquiry flow', detail: 'Solve the immediate discovery and enquiry problem. Keep payments and apps out of Phase 1.', score: 20, feedback: 'A focused solution. The technology serves the customer journey.' },
  { id: 'custom_platform', title: 'A custom microservices platform with a dedicated order engine', detail: 'Build infrastructure for traffic the client does not have yet.', score: 2, feedback: 'Impressive architecture. The first customer still cannot find the phone number.' },
  { id: 'mobile_apps', title: 'Start with Android and iOS applications', detail: 'Two apps before the business has a reliable digital catalogue.', score: -5, feedback: 'You are starting with the most expensive part of the request.' },
];

const pitchOptions = [
  { id: 'value', title: '“Customers can explore your services and enquire directly. We will deliver a focused first release, then expand based on actual demand.”', detail: 'Explain the result, boundaries and next step.', score: 15, feedback: 'You sold an outcome rather than a list of technologies.' },
  { id: 'stack_pitch', title: '“We use React, TypeScript, Tailwind, Vite and modern architecture.”', detail: 'Talk about the tools instead of why the client should care.', score: 4, feedback: 'The client has searched “React” and thinks it is a Facebook reaction.' },
  { id: 'anything', title: '“We can do anything. Unlimited revisions. Unlimited features.”', detail: 'Make promises that no small team can responsibly keep.', score: -12, feedback: 'The client is delighted. Your future self has started updating LinkedIn.' },
];

const priceOptions = [
  { id: 'mvp', price: 5000, title: '₹5,000 · Focused Phase 1', detail: 'Agreed website scope, 50% advance, one consolidated revision, seven-day delivery.', score: 20, viable: true, label: 'RECOMMENDED' },
  { id: 'support', price: 6500, title: '₹6,500 · Phase 1 + launch buffer', detail: 'The same focused scope with a launch-support window and a little room for final fixes.', score: 12, viable: true, label: 'EXTRA BUFFER' },
  { id: 'cheap', price: 500, title: '₹500 · Everything included', detail: 'Website, apps, AI, payments, tracking, hosting and unlimited revisions.', score: -100, viable: false, label: 'THE TRAP' },
  { id: 'overquote', price: 25000, title: '₹25,000 · Complete platform', detail: 'Quote the entire wishlist without validating whether the client will fund it.', score: -20, viable: false, label: 'CLIENT WILL WALK' },
];

export default function Negotiation() {
  const startCampaign = useGameStore((state) => state.startCampaign);
  const [stage, setStage] = useState(0);
  const [discovery, setDiscovery] = useState('');
  const [scope, setScope] = useState<Record<string, ScopeTier>>(() => Object.fromEntries(scopeItems.map((item) => [item.id, item.recommended])));
  const [approach, setApproach] = useState('');
  const [pitch, setPitch] = useState('');
  const [price, setPrice] = useState('');
  const [feedback, setFeedback] = useState('');
  const [showOutcome, setShowOutcome] = useState(false);

  const scopeScore = useMemo(() => {
    const essential = ['homepage', 'catalogue', 'whatsapp', 'contact', 'responsive', 'seo'];
    const good = essential.filter((id) => scope[id] === 'must').length;
    const appNotCommitted = ['android', 'ai'].filter((id) => scope[id] !== 'must').length;
    const laterPayments = ['payments', 'admin'].filter((id) => scope[id] !== 'must').length;
    const extraMust = ['payments', 'admin', 'android', 'ai'].filter((id) => scope[id] === 'must').length;
    return Math.round((good / essential.length) * 18 + (appNotCommitted / 2) * 4 + (laterPayments / 2) * 3 - extraMust * 7);
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
        setFeedback('The client’s immediate problem needs a clear Phase 1. Keep the six essentials in the first release, or accept the delivery risk.');
        return;
      }
      setFeedback('Good scope. The app, AI and payment system can be future phases. A first release should solve one real problem.');
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
    if (!chosenPrice.viable || score < 58 || !viableScope) {
      useGameStore.setState({
        phase: 'ending',
        ending: {
          kind: 'negotiation',
          title: price === 'cheap' ? 'YOU SOLD SWIGGY FOR ₹500' : price === 'overquote' ? 'THE CLIENT FOUND A DIFFERENT DEVELOPER' : 'THE PROPOSAL DID NOT SURVIVE REALITY',
          subtitle: 'The first client was also the first lesson',
          body: price === 'cheap'
            ? 'You accepted every feature, unlimited revisions and a one-week deadline for ₹500. Mr. Prakash is thrilled. Your team has started a support group. The contract is not viable, and the campaign ends before the first commit.'
            : price === 'overquote'
              ? 'The client politely ended the call and sent Bunty a link to a free website builder. Your proposal was technically ambitious and commercially disconnected.'
              : 'You did not establish a viable scope and delivery agreement. The client left the call with more questions than answers. A founder has to sell a plan the team can actually deliver.',
          score,
        },
      });
      return;
    }
    startCampaign({ scopeAccepted: essentials, negotiationScore: Math.max(60, score), contractPrice: chosenPrice.price });
  };

  const cycleScope = (id: string) => {
    const order: ScopeTier[] = ['must', 'phase2', 'later'];
    setScope((current) => ({ ...current, [id]: order[(order.indexOf(current[id]) + 1) % order.length] }));
  };

  const feedbackText = stage === 0 ? discoveryOptions.find((item) => item.id === discovery)?.feedback : stage === 2 ? approachOptions.find((item) => item.id === approach)?.feedback : stage === 3 ? pitchOptions.find((item) => item.id === pitch)?.feedback : feedback;

  return (
    <main className="negotiation-screen">
      <div className="negotiation-topbar">
        <div className="brand-lockup"><span className="brand-mark">P</span><span>PANIC LABS <small>BUSINESS DEVELOPMENT</small></span></div>
        <div className="neg-status"><span className="live-dot" /> CLIENT CALL IN PROGRESS <span className="neg-time">00:{String(59 - stage * 8).padStart(2, '0')}</span></div>
        <span className="neg-badge">FIRST CLIENT</span>
      </div>

      <div className="negotiation-layout">
        <section className="neg-main">
          <div className="neg-kicker"><BriefcaseBusiness size={14} /> OPPORTUNITY / RF-001</div>
          <div className="neg-title-row">
            <div><h1>Royal Feast <em>needs a website.</em></h1><p>Mr. Prakash · Catering business · Hyderabad, IN</p></div>
            <div className="client-avatar">👨🏻‍💼</div>
          </div>
          <div className="client-quote">
            <span className="quote-label">CLIENT SAYS</span>
            “I need a simple website like Swiggy. Products, online ordering, payment gateway, AI chatbot, Android app, iOS app, delivery tracking. Nothing complicated. Budget is ₹500.”
            <span className="quote-signature">— Mr. Prakash, completely serious</span>
          </div>

          <div className="stage-progress">
            {stages.map((item, index) => <div className={`stage-step ${index < stage ? 'complete' : index === stage ? 'active' : ''}`} key={item}><span>{index < stage ? <Check size={13} /> : `0${index + 1}`}</span>{item}</div>)}
          </div>

          <AnimatePresence mode="wait">
            <motion.section className="neg-step-card" key={stage} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
              {stage === 0 && <>
                <div className="step-eyebrow">01 / DISCOVERY</div>
                <h2>Before you build, understand what they actually need.</h2>
                <p className="step-description">The client has listed features. Your job is to uncover the business problem.</p>
                <div className="decision-list">{discoveryOptions.map((option) => <button key={option.id} className={`decision-option ${discovery === option.id ? 'selected' : ''}`} onClick={() => { setDiscovery(option.id); setFeedback(option.feedback); }}><span className="option-radio" /><span><strong>{option.title}</strong><small>{option.detail}</small></span><ArrowRight size={16} /></button>)}</div>
              </>}
              {stage === 1 && <>
                <div className="step-eyebrow">02 / REQUIREMENTS</div>
                <h2>Sort the wishlist before it becomes your problem.</h2>
                <p className="step-description">Tap a requirement to cycle it between Phase 1, Phase 2 and Future. Keep the first release deliverable.</p>
                <div className="scope-legend"><span><i className="tier-dot must" />PHASE 1</span><span><i className="tier-dot phase2" />PHASE 2</span><span><i className="tier-dot later" />FUTURE</span></div>
                <div className="scope-grid">{scopeItems.map((item) => <button key={item.id} className={`scope-card tier-${scope[item.id]}`} onClick={() => cycleScope(item.id)}><span className="scope-icon">{scope[item.id] === 'must' ? '●' : scope[item.id] === 'phase2' ? '◐' : '○'}</span><span><strong>{item.title}</strong><small>{item.detail}</small></span><em>{scope[item.id] === 'must' ? 'PHASE 1' : scope[item.id] === 'phase2' ? 'PHASE 2' : 'FUTURE'}</em></button>)}</div>
              </>}
              {stage === 2 && <>
                <div className="step-eyebrow">03 / IMPLEMENTATION APPROACH</div>
                <h2>Choose the solution, not the fanciest architecture.</h2>
                <p className="step-description">What is the smallest useful product that solves the customer's actual problem?</p>
                <div className="decision-list">{approachOptions.map((option) => <button key={option.id} className={`decision-option ${approach === option.id ? 'selected' : ''}`} onClick={() => { setApproach(option.id); setFeedback(option.feedback); }}><span className="option-radio" /><span><strong>{option.title}</strong><small>{option.detail}</small></span><ArrowRight size={16} /></button>)}</div>
              </>}
              {stage === 3 && <>
                <div className="step-eyebrow">04 / THE PITCH</div>
                <h2>Why should the client choose your company?</h2>
                <p className="step-description">Explain value, delivery boundaries and what makes your proposal a sensible investment.</p>
                <div className="decision-list">{pitchOptions.map((option) => <button key={option.id} className={`decision-option ${pitch === option.id ? 'selected' : ''}`} onClick={() => { setPitch(option.id); setFeedback(option.feedback); }}><span className="option-radio" /><span><strong>{option.title}</strong><small>{option.detail}</small></span><ArrowRight size={16} /></button>)}</div>
              </>}
              {stage === 4 && <>
                <div className="step-eyebrow">05 / COMMERCIALS</div>
                <h2>Put a price on the promise.</h2>
                <p className="step-description">The client is waiting. Your team is five people. Your calendar is one week.</p>
                <div className="price-grid">{priceOptions.map((option) => <button key={option.id} className={`price-card ${price === option.id ? 'selected' : ''} ${!option.viable ? 'risky' : ''}`} onClick={() => setPrice(option.id)}><span>{option.label}</span><strong>{option.title}</strong><small>{option.detail}</small></button>)}</div>
              </>}

              {feedbackText && <motion.div className="coach-note" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}><Lightbulb size={16} /><span>{feedbackText}</span></motion.div>}
              <div className="neg-actions">
                <button className="btn-quiet" onClick={() => stage === 0 ? undefined : setStage((current) => current - 1)} disabled={stage === 0}><ChevronLeft size={15} /> BACK</button>
                <div className="neg-score-preview"><span>PROPOSAL SCORE</span><strong>{Math.max(0, score)}<small>/100+</small></strong></div>
                {stage < 4 ? <button className="btn-primary" onClick={next} disabled={(stage === 0 && !discovery) || (stage === 2 && !approach) || (stage === 3 && !pitch)}>CONTINUE <ArrowRight size={16} /></button> : <button className="btn-primary" onClick={next} disabled={!price}>SUBMIT PROPOSAL <ArrowRight size={16} /></button>}
              </div>
            </motion.section>
          </AnimatePresence>
        </section>

        <aside className="neg-sidebar">
          <div className="sidebar-panel client-panel"><div className="panel-label">CLIENT PROFILE <span className="client-status">● ONLINE</span></div><div className="client-profile"><div className="client-avatar small">👨🏻‍💼</div><div><strong>Mr. Prakash</strong><small>Owner · Royal Feast Catering</small></div></div><div className="client-stats"><div><span>BUDGET</span><strong>₹500</strong></div><div><span>DEADLINE</span><strong>7 DAYS</strong></div></div><div className="client-traits"><span>Price sensitive</span><span>Feature collector</span><span>“Simple” requirements</span></div></div>
          <div className="sidebar-panel insight-panel"><div className="panel-label"><Target size={13} /> FOUNDER'S CHECKLIST</div><div className="check-row"><span className={discovery ? 'checked' : ''}>{discovery ? <Check size={12} /> : '1'}</span>Understand the real problem</div><div className="check-row"><span className={stage > 1 ? 'checked' : ''}>{stage > 1 ? <Check size={12} /> : '2'}</span>Protect the first release</div><div className="check-row"><span className={approach ? 'checked' : ''}>{approach ? <Check size={12} /> : '3'}</span>Choose a sensible approach</div><div className="check-row"><span className={pitch ? 'checked' : ''}>{pitch ? <Check size={12} /> : '4'}</span>Sell the business outcome</div><div className="check-row"><span className={price ? 'checked' : ''}>{price ? <Check size={12} /> : '5'}</span>Agree viable commercials</div></div>
          <div className="sidebar-tip"><Sparkles size={16} /><div><strong>Founder wisdom</strong><p>A client asking for 19 features is not the same as a client needing 19 features.</p></div></div>
          <div className="sidebar-footer"><ShieldCheck size={14} /> YOUR DECISIONS SHAPE THE CAMPAIGN</div>
        </aside>
      </div>

      <AnimatePresence>
        {showOutcome && chosenPrice && <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><motion.div className="contract-modal" initial={{ y: 20, scale: 0.98 }} animate={{ y: 0, scale: 1 }}><div className="contract-icon"><BriefcaseBusiness size={22} /></div><div className="step-eyebrow">PROPOSAL REVIEW</div><h2>Ready to put your company on the line?</h2><p>Your proposal score is <strong>{Math.max(0, score)}</strong>. The client has reviewed the scope and commercial terms. Your ₹5,000–₹6,500 counter-offer is higher than the opening ₹500, so the discovery and value pitch need to justify it.</p><div className="contract-summary"><div><span>PROJECT</span><strong>Royal Feast Digital Presence</strong></div><div><span>CONTRACT VALUE</span><strong>₹{chosenPrice.price.toLocaleString('en-IN')}</strong></div><div><span>DELIVERY</span><strong>7 calendar days</strong></div><div><span>FIRST RELEASE</span><strong>{scopeItems.filter((item) => scope[item.id] === 'must').length} included requirements</strong></div></div><div className="contract-warning"><TriangleAlert size={15} /><span>Remember: once you sign, the deadline starts. The group chat is already active.</span></div><div className="contract-actions"><button className="btn-quiet" onClick={() => setShowOutcome(false)}>REVISE PROPOSAL</button><button className="btn-primary" onClick={finish}>SIGN THE CONTRACT <ArrowRight size={16} /></button></div></motion.div></motion.div>}
      </AnimatePresence>
    </main>
  );
}
