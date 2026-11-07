import { useState } from 'react';
import { ArrowUpRight, Bookmark, ExternalLink, FileText, Globe, MessageCircle, Send, ShieldCheck, Sparkles, Lightbulb } from 'lucide-react';
import { useGameStore } from '../game/store';
import { AppHeading, Pill } from './shared';
import { CharacterSprite } from '../components/CharacterSprite';

export default function ClientBrowser() {
  const { day, metrics, messages, scopeAccepted, sendMessage, contractValue } = useGameStore();
  const [tab, setTab] = useState<'overview' | 'scope' | 'conversation'>('overview');
  const [draft, setDraft] = useState('');
  const clientMessages = messages.filter((message) => message.channelId === 'prakash' && message.day <= day);

  const send = () => {
    if (draft.trim()) {
      sendMessage('prakash', draft);
      setDraft('');
      setTab('conversation');
    }
  };

  return (
    <div className="app-scroll browser-app">
      <div className="browser-chrome">
        <div className="browser-controls">
          <i /><i /><i />
        </div>
        <div className="browser-address">
          <ShieldCheck size={14} />
          <span>https://workspace.panic-labs.local/client/royal-feast</span>
          <Bookmark size={14} />
        </div>
        <ExternalLink size={16} />
      </div>

      <AppHeading
        kicker="CLIENT DESK / ROYAL FEAST PORTAL"
        title="Client: Mr. Prakash"
        subtitle="Owner · Royal Feast Catering · Signed on Day 1"
        right={<Pill tone={metrics.clientTrust > 55 ? 'good' : 'warning'}>Trust: {Math.round(metrics.clientTrust)}%</Pill>}
      />

      <div className="browser-tabs">
        <button className={tab === 'overview' ? 'active' : ''} onClick={() => setTab('overview')}>
          Project Overview
        </button>
        <button className={tab === 'scope' ? 'active' : ''} onClick={() => setTab('scope')}>
          Agreed Scope & Exclusions
        </button>
        <button className={tab === 'conversation' ? 'active' : ''} onClick={() => setTab('conversation')}>
          Client Conversation <span>({clientMessages.length})</span>
        </button>
      </div>

      {tab === 'overview' && (
        <div className="client-overview">
          <div className="client-hero">
            <div>
              <span className="app-kicker">YOUR FIRST CLIENT · CONTRACT RF-001</span>
              <h3>Royal Feast<br /><em>Catering & Events</em></h3>
              <p>
                A high-volume catering business looking for a clear digital front. Customers should easily discover packages and book wedding/party orders via WhatsApp.
              </p>
              <div className="client-hero-tags">
                <Pill tone="good">Contract Active</Pill>
                <Pill tone="warning">Deadline: Day 7 · 6:00 PM</Pill>
              </div>
            </div>
            <div className="client-hero-visual">
              <CharacterSprite character="prakash" expression="happy" size="lg" />
            </div>
          </div>

          <div className="client-brief-grid">
            <div>
              <span>PROJECT VALUE</span>
              <strong>₹{contractValue.toLocaleString('en-IN')}</strong>
              <small>50% advance received: ₹{Math.round(contractValue * 0.5).toLocaleString('en-IN')}</small>
            </div>
            <div>
              <span>DELIVERY DATE</span>
              <strong>Day 7</strong>
              <small>6:00 PM · Handover scheduled</small>
            </div>
            <div>
              <span>CLIENT TRUST</span>
              <strong>{Math.round(metrics.clientTrust)}%</strong>
              <small>Confidence is a moving target</small>
            </div>
          </div>

          {/* Bunty's Tech Desk Note */}
          <div className="bunty-client-desk-card">
            <CharacterSprite character="bunty" expression="smug" size="md" />
            <div>
              <div className="bunty-head-line">
                <strong>BUNTY'S TECH CONSULTANCY CORNER</strong>
                <span className="bunty-tag">Nephew & Advisor</span>
              </div>
              <p>
                “Uncle says the website looks decent, but why isn't the logo rotating in 3D? Also, I saw an app where the menu has live sound effects of frying samosas. Can we add that before Thursday?”
              </p>
              <small>Scope Creep Risk: High · Beware of agreeing to verbal additions.</small>
            </div>
          </div>

          <div className="client-note">
            <Sparkles size={18} />
            <div>
              <strong>Client Personality Profile</strong>
              <p>
                Mr. Prakash is price-sensitive, pragmatic, but heavily influenced by Bunty’s late-night tech discoveries. He values demonstrated working progress and prompt communication.
              </p>
            </div>
          </div>

          <div className="browser-quick-actions">
            <button onClick={() => setTab('scope')}>
              <FileText size={16} /> Review Statement of Work
            </button>
            <button onClick={() => setTab('conversation')}>
              <MessageCircle size={16} /> Open Client DM
            </button>
          </div>
        </div>
      )}

      {tab === 'scope' && (
        <div className="scope-document">
          <div className="document-topline">
            <span>STATEMENT OF WORK · CONTRACT RF-001</span>
            <Pill tone="good">SIGNED & LOCKED</Pill>
          </div>
          <h3>Phase 1 — Catering Digital Presence</h3>
          <p className="document-lead">
            Deliver a reliable, fast, mobile-friendly landing page and catalogue that directs enquiries straight to WhatsApp.
          </p>

          <h4>Included in Phase 1 Delivery</h4>
          <div className="scope-doc-items">
            {[
              ['homepage', 'Responsive Homepage with Hero & CTA'],
              ['catalogue', 'Catering Packages & Menu Catalogue'],
              ['whatsapp', 'Direct WhatsApp Enquiry Integration'],
              ['contact', 'Location, Business Hours & Contact Card'],
              ['responsive', 'Full Mobile & Tablet Responsiveness'],
              ['seo', 'Basic On-page SEO Metadata'],
            ]
              .filter(([id]) => scopeAccepted.includes(id))
              .map(([, label]) => (
                <div key={label}>
                  <span className="scope-check">✓</span>
                  {label}
                  <Pill tone="good">DELIVERABLE</Pill>
                </div>
              ))}
          </div>

          <h4>Explicit Exclusions (Deferred to Phase 2)</h4>
          <div className="scope-exclusions">
            <span>Online Payment Gateway & Stripe</span>
            <span>Native iOS & Android Apps</span>
            <span>AI Voice Chatbot</span>
            <span>Live GPS Biryani Tracking</span>
            <span>Customer Accounts & Wallets</span>
            <span>Unlimited Aesthetic Redesigns</span>
          </div>

          <div className="document-footer">
            <ShieldCheck size={16} />
            Any additions to this scope require written change approval and revised timelines.
          </div>
        </div>
      )}

      {tab === 'conversation' && (
        <div className="client-conversation">
          <div className="client-conversation-head">
            <CharacterSprite character="prakash" expression="talking" size="sm" />
            <div>
              <strong>Mr. Prakash (Royal Feast)</strong>
              <small>Typically responds within minutes with a new suggestion</small>
            </div>
            <Pill tone="good">ACTIVE</Pill>
          </div>

          <div className="client-message-list">
            {clientMessages.map((message) => (
              <div key={message.id} className={`client-message ${message.senderId === 'player' ? 'sent' : ''}`}>
                <span>{message.senderName}</span>
                <p>{message.text}</p>
                <small>Day {message.day} · {message.time}</small>
              </div>
            ))}
          </div>

          <div className="client-compose">
            <input
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') send();
              }}
              placeholder="Send Mr. Prakash a professional update or scope clarification…"
            />
            <button onClick={send} disabled={!draft.trim()}>
              <Send size={16} />
            </button>
          </div>
          <div className="client-compose-hint">
            Tip: Frame answers around Phase 2 and agreed timelines. Saying yes blindly increases technical debt!
          </div>
        </div>
      )}
    </div>
  );
}
