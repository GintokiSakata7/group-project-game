import { motion } from 'motion/react';
import { ArrowRight, BadgeCheck, CalendarDays, IndianRupee, PartyPopper, Sparkles } from 'lucide-react';
import { useGameStore } from '../game/store';
import { CharacterSprite } from './CharacterSprite';

export default function ContractSigned() {
  const contractValue = useGameStore((state) => state.contractValue);
  const companyName = useGameStore((state) => state.companyName);
  const beginKickoffMeeting = useGameStore((state) => state.beginKickoffMeeting);
  const scopeAccepted = useGameStore((state) => state.scopeAccepted);
  const scopeLabels: Record<string, string> = { homepage: 'Website', catalogue: 'Service catalogue', whatsapp: 'WhatsApp enquiries', contact: 'Contact & location', responsive: 'Mobile responsive', seo: 'Basic SEO' };
  const included = [...scopeAccepted.map((item) => scopeLabels[item] ?? item), 'Production deployment & handover'];
  const advance = Math.round(contractValue * 0.5);

  return (
    <main className="contract-party-screen">
      <div className="contract-confetti confetti-one" /><div className="contract-confetti confetti-two" /><div className="contract-confetti confetti-three" />
      <motion.section className="contract-party-card" initial={{ opacity: 0, y: 28, scale: .95 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: .45 }}>
        <div className="contract-party-kicker"><PartyPopper size={16} /> THE FIRST DEAL · OFFICIALLY SIGNED</div>
        <div className="contract-party-hero"><div><span className="contract-party-stamp">CLIENT ACQUIRED</span><h1>YOU GOT<br /><em>THE CLIENT!</em></h1><p>{companyName} has its first paying customer. Mr. Prakash is happy. Your team is confused. The clock has started.</p></div><CharacterSprite character="prakash" size="xl" expression="happy" speaking /></div>
        <div className="contract-party-terms">
          <div><IndianRupee size={19} /><span>CONTRACT VALUE</span><b>₹{contractValue.toLocaleString('en-IN')}</b></div>
          <div><BadgeCheck size={19} /><span>ADVANCE RECEIVED</span><b>₹{advance.toLocaleString('en-IN')}</b></div>
          <div><CalendarDays size={19} /><span>DEADLINE</span><b>7 DAYS</b></div>
        </div>
        <div className="contract-scope-box">
          <div><span>PHASE 1 · AGREED DELIVERABLES</span><b>{contractValue <= 3500 ? 'STARTER WEBSITE' : 'BUSINESS WEBSITE & ENQUIRY FLOW'}</b></div>
          <div className="contract-scope-tags">{included.map((item) => <span key={item}>{item}</span>)}</div>
          <p>Not included in this release: native mobile apps, AI chatbot, live GPS tracking and payment gateway. Bunty has been informed. He has replied with a thumbs-up and a question mark.</p>
        </div>
        <div className="contract-party-quote"><Sparkles size={18} /><p>“Very good, founder. I have already told my relatives the website will be ready. My nephew Bunty has some suggestions.”</p><b>— Mr. Prakash</b></div>
        <div className="contract-terms-note"><b>PAYMENT & SUPPORT TERMS</b><span>50% advance secured · Remaining balance on preview/handover · 1 revision round · 7-day defect warranty · Hosting/domain billed separately</span></div>
        <button className="contract-enter-button" onClick={beginKickoffMeeting}>CALL THE KICKOFF MEETING <ArrowRight size={20} /></button>
        <small className="contract-party-foot">CHAPTER 02 · THE DELIVERY SPRINT BEGINS NOW</small>
      </motion.section>
    </main>
  );
}
