import { useState } from 'react';
import { Coffee, UtensilsCrossed, MessageSquareText, Sparkles, CheckCircle2, AlertCircle, ArrowRight, Zap, HeartHandshake, ShieldCheck, Flame, Bike, RefreshCw } from 'lucide-react';
import { useGameStore } from '../game/store';
import { CharacterSprite, type CharacterId } from '../components/CharacterSprite';
import { sound } from '../game/audio';

type ActiveTab = 'coffee' | 'food' | 'watercooler';

interface WatercoolerConversation {
  id: string;
  char1: { id: CharacterId; name: string; role: string; text: string; expr: 'smug' | 'happy' | 'neutral' | 'exhausted' | 'shocked' };
  char2: { id: CharacterId; name: string; role: string; text: string; expr: 'smug' | 'happy' | 'neutral' | 'exhausted' | 'shocked' };
  topic: string;
}

const watercoolerStories: WatercoolerConversation[] = [
  {
    id: 'wc-1',
    topic: 'CSS Flexbox vs Existential Dread',
    char1: { id: 'aarav', name: 'Aarav', role: 'Full-Stack Vibe Coder', expr: 'shocked', text: 'Bro, I spent 3 hours centering a div. If I add 1px margin on the left, the whole footer moves to Hyderabad.' },
    char2: { id: 'varun', name: 'Varun', role: 'Technical Lead', expr: 'neutral', text: 'This is why my architecture specification decoupled presentation from reality.' },
  },
  {
    id: 'wc-2',
    topic: 'Nikhil’s Mystical Commit Times',
    char1: { id: 'meera', name: 'Meera', role: 'Quality Assurance', expr: 'shocked', text: 'Nikhil, your last commit was pushed at 4:19 AM with message “wip”. It modified 47 SQL tables.' },
    char2: { id: 'nikhil', name: 'Nikhil', role: 'Backend Developer', expr: 'exhausted', text: 'the moon was aligned.' },
  },
  {
    id: 'wc-3',
    topic: 'Morning Hype Strategy',
    char1: { id: 'kunal', name: 'Kunal', role: 'Client Relations ("Chief Motivation Officer")', expr: 'happy', text: 'Team, who is ready for a 15-minute standing affirmation session before the client call?!' },
    char2: { id: 'aarav', name: 'Aarav', role: 'Full-Stack Vibe Coder', expr: 'exhausted', text: 'Kunal, I haven’t even digested my first coffee. Please whisper.' },
  },
  {
    id: 'wc-4',
    topic: 'Bunty’s Samosa Blockchain Proposal',
    char1: { id: 'bunty', name: 'Bunty', role: "Client's Nephew", expr: 'smug', text: 'If we put a QR code on each samosa, guests can verify the frying temperature on the blockchain.' },
    char2: { id: 'meera', name: 'Meera', role: 'Quality Assurance', expr: 'shocked', text: 'Bunty, the catering staff is currently using a chalkboard for inventory. Please leave the kitchen.' },
  },
  {
    id: 'wc-5',
    topic: 'The Client’s iPad Compatibility',
    char1: { id: 'kunal', name: 'Kunal', role: 'Client Relations', expr: 'neutral', text: 'Mr. Prakash asked if our website works on his iPad 2 from 2011. I said “absolutely, it was designed for vintage elegance”.' },
    char2: { id: 'varun', name: 'Varun', role: 'Technical Lead', expr: 'shocked', text: 'That browser doesn’t even support HTTPS. We will need to invent backwards time travel.' },
  },
  {
    id: 'wc-6',
    topic: 'The Secret To Fast Shipping',
    char1: { id: 'aarav', name: 'Aarav', role: 'Full-Stack Vibe Coder', expr: 'smug', text: 'People ask me how I ship so fast. Simple: I write code like I’m driving an autorickshaw with broken brakes.' },
    char2: { id: 'meera', name: 'Meera', role: 'Quality Assurance', expr: 'shocked', text: 'And I am the pedestrian jumping out of your way every morning.' },
  },
];

export default function BreakRoomApp() {
  const { metrics, coffeeBrewsToday = 0, mealsOrderedToday = [], brewCoffee, orderOfficeFood, openDesktop } = useGameStore();
  const initialTab = (typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('tab') as ActiveTab : null) || 'coffee';
  const [activeTab, setActiveTab] = useState<ActiveTab>(initialTab);
  const [brewingKind, setBrewingKind] = useState<'chai' | 'filter' | 'espresso' | null>(null);
  const [feedback, setFeedback] = useState<{ text: string; quote?: string; isError?: boolean } | null>(null);
  const [conversationIndex, setConversationIndex] = useState(0);

  const handleBrew = (kind: 'chai' | 'filter' | 'espresso') => {
    sound.playClick();
    setBrewingKind(kind);
    setFeedback(null);

    setTimeout(() => {
      sound.playCoffee();
      const res = brewCoffee(kind);
      setBrewingKind(null);
      if (res.success) {
        setFeedback({ text: res.message, quote: res.quote });
      } else {
        setFeedback({ text: res.message, quote: res.quote, isError: true });
      }
    }, 800);
  };

  const handleOrderFood = (mealId: 'samosa' | 'biryani' | 'salad' | 'pizza') => {
    sound.playClick();
    sound.playFoodDelivery();
    const res = orderOfficeFood(mealId);
    if (res.success) {
      setFeedback({ text: res.message });
    } else {
      setFeedback({ text: res.message, isError: true });
    }
  };

  const nextConversation = () => {
    sound.playClick();
    setConversationIndex((prev) => (prev + 1) % watercoolerStories.length);
  };

  const currentConvo = watercoolerStories[conversationIndex];

  return (
    <div className="breakroom-container">
      {/* Top Header Navigation */}
      <header className="breakroom-header">
        <div className="breakroom-branding">
          <span className="breakroom-logo">☕</span>
          <div>
            <h3>Panic Labs Break Lounge</h3>
            <small>Caffeine, Food Deliveries & Watercooler Gossip</small>
          </div>
        </div>

        <div className="breakroom-tabs">
          <button className={`tab-btn ${activeTab === 'coffee' ? 'active' : ''}`} onClick={() => { sound.playClick(); setActiveTab('coffee'); }}>
            <Coffee size={15} /> Coffee & Chai Tapri
          </button>
          <button className={`tab-btn ${activeTab === 'food' ? 'active' : ''}`} onClick={() => { sound.playClick(); setActiveTab('food'); }}>
            <UtensilsCrossed size={15} /> PanicEats Food
          </button>
          <button className={`tab-btn ${activeTab === 'watercooler' ? 'active' : ''}`} onClick={() => { sound.playClick(); setActiveTab('watercooler'); }}>
            <MessageSquareText size={15} /> Watercooler Gossip
          </button>
        </div>

        <div className="breakroom-stats">
          <span className="pantry-stat-pill">₹{metrics.cash.toLocaleString('en-IN')} Cash</span>
          <span className="pantry-stat-pill">☕ {coffeeBrewsToday}/3 Brews Today</span>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="breakroom-body">
        {/* TAB 1: COFFEE MACHINE & CHAI TAPRI */}
        {activeTab === 'coffee' && (
          <div className="pantry-grid">
            <div className="pantry-machine-card">
              <div className="coffee-machine-art">
                <div className={`coffee-steam ${brewingKind ? 'brewing' : ''}`}>
                  <span>~</span><span>~</span><span>~</span>
                </div>
                <div className="machine-body">
                  <div className="machine-display">
                    {brewingKind ? 'BREWING FRESH POT...' : coffeeBrewsToday >= 3 ? 'DAILY LIMIT REACHED' : 'READY TO BREW'}
                  </div>
                  <div className="machine-nozzle">
                    <div className="liquid-stream" />
                    <div className="coffee-cup-mock">
                      <span className="cup-liquid" />
                      <span className="cup-icon">☕</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="machine-status-summary">
                <b>OFFICE CAFFEINE STATUS</b>
                <p>{coffeeBrewsToday === 0 ? 'Nobody has had caffeine yet. Developers are moving in slow motion.' : coffeeBrewsToday === 1 ? 'One round brewed. Aarav is writing code with good vibes.' : coffeeBrewsToday === 2 ? 'Two rounds consumed. Meera is testing edge cases at high velocity.' : '3/3 rounds reached! The coffee machine is sizzling.'}</p>
              </div>
            </div>

            <div className="pantry-menu-card">
              <div className="menu-header">
                <Sparkles size={16} />
                <b>SELECT BREW FROM THE TAPRI</b>
              </div>

              <div className="brew-options-list">
                {/* Option 1: Cutting Chai */}
                <div className="brew-card">
                  <div className="brew-art">🍵</div>
                  <div className="brew-details">
                    <div className="brew-top">
                      <b>Cutting Chai (Tapri Style)</b>
                      <span className="brew-tag free">FREE · ₹0</span>
                    </div>
                    <p>Adrak & elaichi chai from the street tapri. Restores employee sanity.</p>
                    <div className="brew-buffs">
                      <span>⚡ Morale +5%</span>
                      <span>🧘 Fatigue -8%</span>
                    </div>
                  </div>
                  <button className="brew-btn" onClick={() => handleBrew('chai')} disabled={Boolean(brewingKind) || coffeeBrewsToday >= 3}>
                    {brewingKind === 'chai' ? 'Brewing...' : 'Pour Cutting Chai'}
                  </button>
                </div>

                {/* Option 2: Filter Coffee */}
                <div className="brew-card">
                  <div className="brew-art">☕</div>
                  <div className="brew-details">
                    <div className="brew-top">
                      <b>South Indian Filter Kaapi</b>
                      <span className="brew-tag paid">₹40 / POT</span>
                    </div>
                    <p>Strong chicory decoction and frothy hot milk. Sharpens architectural clarity.</p>
                    <div className="brew-buffs">
                      <span>⚡ Morale +8%</span>
                      <span>🧘 Fatigue -12%</span>
                    </div>
                  </div>
                  <button className="brew-btn" onClick={() => handleBrew('filter')} disabled={Boolean(brewingKind) || coffeeBrewsToday >= 3 || metrics.cash < 40}>
                    {brewingKind === 'filter' ? 'Brewing...' : 'Brew Filter Kaapi'}
                  </button>
                </div>

                {/* Option 3: Nitro Espresso */}
                <div className="brew-card">
                  <div className="brew-art">⚡</div>
                  <div className="brew-details">
                    <div className="brew-top">
                      <b>Emergency Nitro Quad Espresso</b>
                      <span className="brew-tag paid">₹100 / ROUND</span>
                    </div>
                    <p>Industrial caffeine shock. Smashes fatigue, causes rapid keyboard typing.</p>
                    <div className="brew-buffs">
                      <span>⚡ Morale +10%</span>
                      <span>🚀 Fatigue -22%</span>
                    </div>
                  </div>
                  <button className="brew-btn highlight" onClick={() => handleBrew('espresso')} disabled={Boolean(brewingKind) || coffeeBrewsToday >= 3 || metrics.cash < 100}>
                    {brewingKind === 'espresso' ? 'Shocking...' : 'Deploy Nitro Espresso'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PANICEATS FOOD DELIVERY (SWIGGY / ZOMATO STYLE) */}
        {activeTab === 'food' && (
          <div className="paniceats-grid">
            <div className="food-hero-banner">
              <div className="delivery-icon-wrap"><Bike size={24} /></div>
              <div>
                <b>PanicEats Corporate Delivery</b>
                <p>Hot meals delivered to Panic Labs HQ in 15 mins. Feed the team to beat crunch fatigue!</p>
              </div>
              <div className="meals-ordered-today">
                <span>{mealsOrderedToday.length} MEALS ORDERED TODAY</span>
              </div>
            </div>

            <div className="meals-cards-row">
              {/* Meal 1: 4 PM Chai Samosa */}
              <div className={`meal-card ${mealsOrderedToday.includes('samosa') ? 'ordered' : ''}`}>
                <div className="meal-badge">AFTERNOON CRUNCH</div>
                <div className="meal-icon">🥟</div>
                <h4>4 PM Samosa & Chai Combo</h4>
                <p>Crispy hot potato samosas with green chutney. The holy grail of Indian startup culture.</p>
                <div className="meal-stats">
                  <span>⚡ Morale +10%</span>
                  <span>🧘 Fatigue -14%</span>
                </div>
                <div className="meal-order-row">
                  <b>₹150</b>
                  <button className="order-food-btn" onClick={() => handleOrderFood('samosa')} disabled={mealsOrderedToday.includes('samosa') || metrics.cash < 150}>
                    {mealsOrderedToday.includes('samosa') ? '✓ Ordered' : 'Order Samosas'}
                  </button>
                </div>
              </div>

              {/* Meal 2: Royal Lucknowi Dum Biryani */}
              <div className={`meal-card featured ${mealsOrderedToday.includes('biryani') ? 'ordered' : ''}`}>
                <div className="meal-badge gold">TEAM FAVOURITE</div>
                <div className="meal-icon">🍗</div>
                <h4>Royal Dum Biryani Feast</h4>
                <p>Fragrant spiced basmati rice and tender chicken. Aarav says this solves all merge conflicts.</p>
                <div className="meal-stats">
                  <span>⚡ Morale +22%</span>
                  <span>🧘 Fatigue -24%</span>
                </div>
                <div className="meal-order-row">
                  <b>₹450</b>
                  <button className="order-food-btn" onClick={() => handleOrderFood('biryani')} disabled={mealsOrderedToday.includes('biryani') || metrics.cash < 450}>
                    {mealsOrderedToday.includes('biryani') ? '✓ Ordered' : 'Order Biryani Feast'}
                  </button>
                </div>
              </div>

              {/* Meal 3: Synergy Salad */}
              <div className={`meal-card ${mealsOrderedToday.includes('salad') ? 'ordered' : ''}`}>
                <div className="meal-badge green">HEALTH & FOCUS</div>
                <div className="meal-icon">🥗</div>
                <h4>Kunal’s Synergy Salad Bowls</h4>
                <p>Microgreens, roasted chickpeas and quinoa. Meera approves. Aarav is searching for carbs.</p>
                <div className="meal-stats">
                  <span>⚡ Morale +8%</span>
                  <span>🔍 Quality +6%</span>
                </div>
                <div className="meal-order-row">
                  <b>₹350</b>
                  <button className="order-food-btn" onClick={() => handleOrderFood('salad')} disabled={mealsOrderedToday.includes('salad') || metrics.cash < 350}>
                    {mealsOrderedToday.includes('salad') ? '✓ Ordered' : 'Order Salad Bowls'}
                  </button>
                </div>
              </div>

              {/* Meal 4: Midnight Crunch Pizza */}
              <div className={`meal-card ${mealsOrderedToday.includes('pizza') ? 'ordered' : ''}`}>
                <div className="meal-badge purple">LATE NIGHT CRUNCH</div>
                <div className="meal-icon">🍕</div>
                <h4>Midnight Crunch Pizza Box</h4>
                <p>3 large cheesy pizzas for when the client demo is tomorrow and localhost is shaking.</p>
                <div className="meal-stats">
                  <span>⚡ Morale +26%</span>
                  <span>🚀 Fatigue -30%</span>
                </div>
                <div className="meal-order-row">
                  <b>₹550</b>
                  <button className="order-food-btn" onClick={() => handleOrderFood('pizza')} disabled={mealsOrderedToday.includes('pizza') || metrics.cash < 550}>
                    {mealsOrderedToday.includes('pizza') ? '✓ Ordered' : 'Order Pizza Crunch'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: WATERCOOLER GOSSIP */}
        {activeTab === 'watercooler' && (
          <div className="watercooler-container">
            <div className="watercooler-header-bar">
              <div className="watercooler-title-col">
                <span className="wc-badge">OVERHEARD BY THE WATER DISPENSER</span>
                <h3>{currentConvo.topic}</h3>
              </div>
              <button className="shuffle-convo-btn" onClick={nextConversation}>
                <RefreshCw size={14} /> Eavesdrop Next Banter
              </button>
            </div>

            <div className="watercooler-dialogue-stage">
              {/* Speaker 1 */}
              <div className="convo-character char-left">
                <div className="char-badge-tag">{currentConvo.char1.name} ({currentConvo.char1.role})</div>
                <div className="char-avatar-bubble">
                  <CharacterSprite character={currentConvo.char1.id} expression={currentConvo.char1.expr} size="md" speaking />
                </div>
                <div className="convo-speech-bubble left">
                  <p>{currentConvo.char1.text}</p>
                </div>
              </div>

              <div className="watercooler-prop">
                <div className="cooler-bottle">
                  <div className="water-bubble b1" />
                  <div className="water-bubble b2" />
                </div>
                <div className="cooler-base">
                  <span className="tap blue" />
                  <span className="tap red" />
                </div>
              </div>

              {/* Speaker 2 */}
              <div className="convo-character char-right">
                <div className="char-badge-tag">{currentConvo.char2.name} ({currentConvo.char2.role})</div>
                <div className="convo-speech-bubble right">
                  <p>{currentConvo.char2.text}</p>
                </div>
                <div className="char-avatar-bubble">
                  <CharacterSprite character={currentConvo.char2.id} expression={currentConvo.char2.expr} size="md" speaking />
                </div>
              </div>
            </div>

            {/* Quick Reel Promo Pill */}
            <div className="reels-cross-promo">
              <Sparkles size={16} />
              <span>Tired of talking? Take a 5-minute doomscroll break on <b>OfficeGram</b>!</span>
              <button className="open-reels-btn" onClick={() => openDesktop('reels')}>
                Open OfficeGram Reels <ArrowRight size={14} />
              </button>
            </div>
          </div>
        )}

        {/* Feedback Banner (for coffee / food orders) */}
        {feedback && (
          <div className={`pantry-feedback-banner ${feedback.isError ? 'error' : 'success'}`}>
            {feedback.isError ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
            <div className="feedback-body">
              <b>{feedback.text}</b>
              {feedback.quote && <small>{feedback.quote}</small>}
            </div>
            <button className="close-feedback-btn" onClick={() => setFeedback(null)}>✕</button>
          </div>
        )}
      </div>
    </div>
  );
}
