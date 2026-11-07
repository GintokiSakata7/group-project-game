import { useState, useMemo, useEffect } from 'react';
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  ExternalLink,
  Laptop,
  Maximize2,
  MessageCircle,
  Phone,
  RefreshCw,
  Search,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Tablet,
  Terminal,
  Utensils,
  X,
  Zap,
  Crosshair,
  Flame,
  PartyPopper,
  Send,
  Eye,
  Bug,
  Code,
  Wrench,
  Smile,
  Frown,
  TrendingUp,
  Coins,
  Camera,
  Layers,
  Sparkle,
} from 'lucide-react';
import { useGameStore } from '../game/store';
import { sound } from '../game/audio';
import { CharacterSprite, type CharacterId } from '../components/CharacterSprite';
import ActiveMissionHUD from '../components/ActiveMissionHUD';

interface CustomerLead {
  id: string;
  clientName: string;
  eventType: string;
  guests: number;
  budget: number;
  note: string;
  urgency: 'HIGH' | 'MEDIUM' | 'VIP';
  avatar: string;
}

const mockLeads: CustomerLead[] = [
  {
    id: 'lead-1',
    clientName: 'Sharma Wedding (Destination Udaipur)',
    eventType: 'Grand Sangeet & Reception',
    guests: 450,
    budget: 540000,
    note: '“Namaste beta. We need 100% pure Jain Lucknowi Dum Biryani, 4 live Chaat counters, and guarantee that no onions touch the premises. Cash ready on confirmation.”',
    urgency: 'VIP',
    avatar: '👑',
  },
  {
    id: 'lead-2',
    clientName: 'Bandra FinTech Unicorn',
    eventType: 'Series B Celebration Lunch',
    guests: 220,
    budget: 285000,
    note: '“Hey team, 80 devs are keto, 40 are vegan, 1 CTO requires Wagyu paneer. Food must arrive exactly at 12:45 PM. Can we pay via corporate UPI?”',
    urgency: 'HIGH',
    avatar: '💻',
  },
  {
    id: 'lead-3',
    clientName: 'Gokuldham Society AGM',
    eventType: 'Annual General Meeting & High Tea',
    guests: 85,
    budget: 48000,
    note: '“Last year the paneer tikka was like rubber. If the mint chutney is watery this time, we will deduct ₹1,500 from the final bill. Hot samosas required.”',
    urgency: 'MEDIUM',
    avatar: '☕',
  },
  {
    id: 'lead-4',
    clientName: 'Bunty’s Discord Mod LAN Party',
    eventType: 'All-Night Gaming Championship',
    guests: 35,
    budget: 25000,
    note: '“Yo Uncle, can you deliver midnight Maggi handis and 35 plates of spicy chicken biryani in RGB packaging? We will tag Royal Feast on Twitch!”',
    urgency: 'MEDIUM',
    avatar: '🎮',
  },
];

interface InspectedElement {
  id: string;
  name: string;
  author: CharacterId;
  authorName: string;
  role: string;
  file: string;
  note: string;
  fixableDefectId?: string;
  fixLabel?: string;
  fixableAction?: () => void;
  status: 'broken' | 'warning' | 'clean';
}

interface ConsoleLogEntry {
  id: string;
  type: 'info' | 'warn' | 'error';
  text: string;
  defectId?: string;
}

export default function WebPreview() {
  const { tasks, defects, day, companyName, metrics, fixDefect, actionsLeft } = useGameStore();

  const [device, setDevice] = useState<'desktop' | 'tablet' | 'mobile' | 'foldable'>('desktop');
  const [activeTab, setActiveTab] = useState<'home' | 'menu' | 'booking' | 'about'>('home');
  const [showConsole, setShowConsole] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedPackage, setSelectedPackage] = useState<string>('royal_shaadi');
  const [guestCount, setGuestCount] = useState<number>(150);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [mockWhatsAppOpen, setMockWhatsAppOpen] = useState(false);
  const [runtimeError, setRuntimeError] = useState<string | null>(null);

  // Standout Interactive Systems
  const [inspectorActive, setInspectorActive] = useState(false);
  const [inspectedElement, setInspectedElement] = useState<InspectedElement | null>(null);
  const [clientMirrorOpen, setClientMirrorOpen] = useState(true);
  const [mirrorMinimized, setMirrorMinimized] = useState(true);
  const [clientPingStatus, setClientPingStatus] = useState<string | null>(null);
  const [leadDrawerOpen, setLeadDrawerOpen] = useState(false);
  const [activeLeadIndex, setActiveLeadIndex] = useState(0);
  const [leadSuccessMsg, setLeadSuccessMsg] = useState<string | null>(null);
  const [vibeLabOpen, setVibeLabOpen] = useState(false);

  // Aarav's Vibe Lab experimental flags
  const [vibeSteam, setVibeSteam] = useState(false);
  const [vibeConfetti, setVibeConfetti] = useState(false);
  const [vibeGeocities, setVibeGeocities] = useState(false);
  const [vibeSaffron, setVibeSaffron] = useState(false);

  // Local hotfix states for raw HTML elements
  const [biryaniAssetFixed, setBiryaniAssetFixed] = useState(false);
  const [divCleaned, setDivCleaned] = useState(false);

  // Relevant tasks & defects from store
  const homepageTask = tasks.find((t) => t.id === 'homepage');
  const catalogueTask = tasks.find((t) => t.id === 'catalogue');
  const whatsappTask = tasks.find((t) => t.id === 'whatsapp');

  const bug1 = defects.find((d) => d.id === 'bug-1' && !d.fixed); // Enquiry button broken
  const bug2 = defects.find((d) => d.id === 'bug-2' && !d.fixed); // Mobile nav overlap

  const homepageProgress = homepageTask?.progress ?? 0;
  const catalogueProgress = catalogueTask?.progress ?? 0;
  const whatsappProgress = whatsappTask?.progress ?? 0;

  const isRawStage = homepageProgress < 25 && !biryaniAssetFixed;

  // Sound & refresh helper
  const handleRefresh = () => {
    sound.playClick();
    setIsRefreshing(true);
    setRuntimeError(null);
    setTimeout(() => {
      setRefreshKey((k) => k + 1);
      setIsRefreshing(false);
    }, 450);
  };

  const handleDeviceChange = (d: 'desktop' | 'tablet' | 'mobile' | 'foldable') => {
    sound.playClick();
    setDevice(d);
  };

  // WhatsApp order click simulation
  const handleOrderClick = () => {
    if (bug1 || (whatsappProgress < 30 && !biryaniAssetFixed)) {
      sound.playBuzzer();
      setRuntimeError(
        'TypeError: window.openWhatsAppEnquiry is not a function (Aarav says this is a spiritual placeholder)'
      );
      return;
    }

    sound.playCash();
    setMockWhatsAppOpen(true);
    setRuntimeError(null);
  };

  // Ping client (Mr. Prakash & Bunty)
  const handlePingClient = () => {
    sound.playNotification();
    setClientPingStatus('Ringing Mr. Prakash on WhatsApp...');
    setTimeout(() => {
      if (bug1 || (device === 'mobile' && bug2) || isRawStage) {
        sound.playBuzzer();
        setClientPingStatus('Mr. Prakash saw the bugs! Blood pressure +15!');
      } else {
        sound.playSuccess();
        setClientPingStatus('Mr. Prakash sent 5 thumbs-up stickers! (+3 Client Trust)');
        useGameStore.setState((state) => ({
          metrics: {
            ...state.metrics,
            clientTrust: Math.min(100, state.metrics.clientTrust + 3),
          },
        }));
      }
      setTimeout(() => setClientPingStatus(null), 4000);
    }, 1200);
  };

  // Handle lead submission
  const handleRouteLead = () => {
    const currentLead = mockLeads[activeLeadIndex];
    if (bug1 || (whatsappProgress < 30 && !biryaniAssetFixed)) {
      sound.playBuzzer();
      setRuntimeError(
        `LEAD FAILED: ${currentLead.clientName} clicked Submit, but window.openWhatsAppEnquiry crashed! Mr. Prakash received an angry voicemail!`
      );
      setLeadSuccessMsg(null);
    } else {
      sound.playCash();
      setLeadSuccessMsg(`Lead Accepted! Pre-filled WhatsApp enquiry generated for ${currentLead.clientName}! (+₹3,500 Cash, +4 Trust)`);
      useGameStore.setState((state) => ({
        metrics: {
          ...state.metrics,
          cash: state.metrics.cash + 3500,
          clientTrust: Math.min(100, state.metrics.clientTrust + 4),
        },
      }));
      setMockWhatsAppOpen(true);
      setTimeout(() => {
        setLeadSuccessMsg(null);
        setActiveLeadIndex((prev) => (prev + 1) % mockLeads.length);
      }, 3500);
    }
  };

  // Catering packages
  const packages = [
    {
      id: 'royal_shaadi',
      name: 'Royal Shaadi Grand Feast',
      perPlate: vibeSaffron ? 1350 : 1200,
      description: 'Lucknowi Dum Biryani, Galouti Kebabs, Paneer Pasanda, Shahi Tukda & 14 Starters',
      tag: 'Most Popular',
    },
    {
      id: 'corporate_lunch',
      name: 'Executive Tech Buffet',
      perPlate: vibeSaffron ? 780 : 650,
      description: 'Hyderabadi Chicken/Veg Biryani, Mirchi Ka Salan, Raita, Gulab Jamun & Chai',
      tag: 'Best Value',
    },
    {
      id: 'party_starters',
      name: 'Sangeet & Cocktail Bites',
      perPlate: vibeSaffron ? 520 : 450,
      description: 'Cocktail Samosas, Dahi Puri, Chicken Tikka Skewers & Masala Lemonade',
      tag: 'Quick Delivery',
    },
  ];

  const currentPkg = packages.find((p) => p.id === selectedPackage) ?? packages[0];
  const totalPrice = currentPkg.perPlate * guestCount;

  // Dynamic client reaction calculations
  const clientStatus = useMemo(() => {
    if (isRawStage) {
      return {
        prakashQuote: '“Beta, what is this? Why does my multi-crore catering empire look like a 2005 railway ticket?! Where are the royal copper handis?!”',
        prakashBP: '158 / 98 mmHg (High Alert)',
        prakashMood: 'shocked' as const,
        buntyQuote: '“Uncle, this is brutalist web design. Very underground. But Aarav left an HTML comment saying ‘CSS tomorrow bro’. Not very Web4.”',
        buntyVibe: '1.2 / 10',
        buntyMood: 'exhausted' as const,
      };
    }
    if (bug1) {
      return {
        prakashQuote: '“The gold fonts look first class! Like Taj Hotel! But I pressed ‘Book on WhatsApp’ and it threw a red error. 20 wedding aunties cannot book!”',
        prakashBP: '144 / 92 mmHg (Tense)',
        prakashMood: 'shocked' as const,
        buntyQuote: '“Bro the CTA button has onClick={undefined}. Nikhil deployed the frontend without binding the handler. Classic.”',
        buntyVibe: '4.8 / 10',
        buntyMood: 'neutral' as const,
      };
    }
    if (device === 'mobile' && bug2) {
      return {
        prakashQuote: '“On my Samsung Fold, the navigation bar is sitting right on top of the Mutton Korma! How will customers see the price per plate?!”',
        prakashBP: '140 / 90 mmHg (Perplexed)',
        prakashMood: 'shocked' as const,
        buntyQuote: '“Classic z-index collision on 375px viewport. Aarav probably put z-index: 99999 on everything.”',
        buntyVibe: '6.0 / 10',
        buntyMood: 'talking' as const,
      };
    }
    return {
      prakashQuote: '“KAMAAL KAR DIYA! (Outstanding!) Sharma ji tried the Guest Calculator and already booked for his daughter’s sangeet! God bless Panic Labs!”',
      prakashBP: '118 / 78 mmHg (Relaxed · Chai in Hand)',
      prakashMood: 'happy' as const,
      buntyQuote: '“Bro the micro-interactions are crisp. The biryani handi has immaculate vibes. Handover approved!”',
      buntyVibe: '9.8 / 10',
      buntyMood: 'happy' as const,
    };
  }, [isRawStage, bug1, bug2, device]);

  // Console logs
  const logs = useMemo(() => {
    const list: ConsoleLogEntry[] = [
      { id: 'log-1', type: 'info', text: `[Vite] Dev server running on http://localhost:3000 (Staging build v0.${day})` },
      { id: 'log-2', type: 'info', text: `[Build] Client bundle compiled for ${companyName}` },
    ];

    if (isRawStage) {
      list.push({ id: 'log-3', type: 'warn', text: `[CSS] 0 stylesheets loaded. Falling back to Times New Roman.` });
      list.push({ id: 'log-4', type: 'warn', text: `[Aarav] <!-- TODO: make this look aesthetic tomorrow bro -->` });
      list.push({ id: 'log-5', type: 'error', text: `[Asset 404] Failed to load image: biryani-hero.jpg (File size was 92MB uncompressed)` });
    } else {
      list.push({ id: 'log-6', type: 'info', text: `[Tailwind] Loaded 64 utility classes for Royal Feast Royal Gold Theme.` });
    }

    if (bug1) {
      list.push({
        id: 'log-bug1',
        type: 'error',
        text: `[Meera Defect #1] CTA button has onClick={undefined}. User clicks go to void.`,
        defectId: 'bug-1',
      });
    }

    if (bug2 && (device === 'mobile' || device === 'foldable')) {
      list.push({
        id: 'log-bug2',
        type: 'warn',
        text: `[Meera Defect #2] Mobile viewport width 375px: #nav-menu overlaps .hero-title by 44px.`,
        defectId: 'bug-2',
      });
    }

    if (whatsappProgress >= 40 && !bug1) {
      list.push({
        id: 'log-api',
        type: 'info',
        text: `[Nikhil API] Mock endpoint POST /api/enquiry verified. 200 OK.`,
      });
    }

    return list;
  }, [day, companyName, isRawStage, bug1, bug2, device, whatsappProgress]);

  // Element Inspector catalog definitions
  const inspectBiryani = () => {
    if (!inspectorActive) return;
    setInspectedElement({
      id: 'biryani-hero',
      name: '<HeroImage asset="biryani-hero.jpg" />',
      author: 'aarav',
      authorName: 'Aarav',
      role: 'Full-Stack Vibe Coder',
      file: 'src/components/Hero.tsx:18',
      note: '“Bro I tried to convert a 4K stock image to webp using an online converter from 2008 and it exported 0 bytes. Spiritual placeholder for now.”',
      fixLabel: '⚡ Optimize & Inject Asset (+5% Progress)',
      fixableAction: () => {
        sound.playSuccess();
        setBiryaniAssetFixed(true);
        setInspectedElement(null);
      },
      status: biryaniAssetFixed ? 'clean' : 'broken',
    });
  };

  const inspectDivComment = () => {
    if (!inspectorActive) return;
    setInspectedElement({
      id: 'div-comment',
      name: '<div.container-tree note="14 empty divs" />',
      author: 'varun',
      authorName: 'Varun',
      role: 'Technical Lead',
      file: 'src/index.html:12',
      note: '“I specifically warned against nesting 14 unclosed divs. Notice how the second div is attempting to wrap the browser itself.”',
      fixLabel: '🧹 Run Varun’s Linter & Clean Tree',
      fixableAction: () => {
        sound.playSuccess();
        setDivCleaned(true);
        setInspectedElement(null);
      },
      status: divCleaned ? 'clean' : 'warning',
    });
  };

  const inspectWhatsAppCTA = () => {
    if (!inspectorActive) return;
    setInspectedElement({
      id: 'cta-button',
      name: '<WhatsAppCTA onClick={undefined} />',
      author: 'nikhil',
      authorName: 'Nikhil',
      role: 'Backend Developer',
      file: 'src/components/BookingCTA.tsx:42',
      note: '“The button has no handler because the webhook endpoint was waiting on Prakash Uncle’s WhatsApp API token. He texted a photo of his visiting card instead.”',
      fixableDefectId: bug1 ? 'bug-1' : undefined,
      fixLabel: bug1 ? '🛠️ Triage & Hotfix Webhook (-1 Action)' : undefined,
      fixableAction: bug1
        ? () => {
            sound.playSuccess();
            fixDefect('bug-1');
            setRuntimeError(null);
            setInspectedElement(null);
          }
        : undefined,
      status: bug1 ? 'broken' : 'clean',
    });
  };

  const inspectMobileNav = () => {
    if (!inspectorActive) return;
    setInspectedElement({
      id: 'mobile-nav',
      name: '<header.staging-header z-index="-1" />',
      author: 'meera',
      authorName: 'Meera',
      role: 'Quality Assurance',
      file: 'src/components/Header.css:88',
      note: '“The mobile navigation bar has negative top margin. On iPhone 14, the Biryani button is literally under the word ‘Authentic’.”',
      fixableDefectId: bug2 ? 'bug-2' : undefined,
      fixLabel: bug2 ? '📐 Triage Mobile Z-Index (-1 Action)' : undefined,
      fixableAction: bug2
        ? () => {
            sound.playSuccess();
            fixDefect('bug-2');
            setInspectedElement(null);
          }
        : undefined,
      status: bug2 ? 'broken' : 'clean',
    });
  };

  const currentLead = mockLeads[activeLeadIndex];

  return (
    <div className={`app-scroll web-preview-app ${inspectorActive ? 'inspector-cursor' : ''}`}>
      <ActiveMissionHUD app="preview" />

      {/* Top Browser Navigation Chrome */}
      <div className="preview-browser-chrome">
        <div className="preview-traffic-lights">
          <i />
          <i />
          <i />
        </div>

        <div className="preview-nav-controls">
          <button
            className={`preview-icon-btn ${isRefreshing ? 'spin' : ''}`}
            onClick={handleRefresh}
            title="Reload staging build"
          >
            <RefreshCw size={13} />
          </button>
        </div>

        {/* Address Bar */}
        <div className="preview-address-bar">
          <ShieldCheck size={13} className="text-good" />
          <span>http://localhost:3000/staging · Royal Feast Digital v0.{day}</span>
          <span className="preview-badge">LOCAL STAGING</span>
        </div>

        {/* Standout Feature 1: Inspector Toggle */}
        <button
          className={`preview-tool-pill ${inspectorActive ? 'active' : ''}`}
          onClick={() => {
            sound.playClick();
            setInspectorActive((prev) => !prev);
            if (inspectorActive) setInspectedElement(null);
          }}
          title="Toggle Inspect Element Mode: Click any UI element to see code author & hotfix bugs"
        >
          <Crosshair size={13} />
          <span>{inspectorActive ? 'Inspector: ON' : 'Inspect UI'}</span>
        </button>

        {/* Standout Feature 2: Simulate Lead Generator */}
        <button
          className={`preview-tool-pill pill-lead ${leadDrawerOpen ? 'active' : ''}`}
          onClick={() => {
            sound.playClick();
            setLeadDrawerOpen((prev) => !prev);
          }}
          title="Simulate realistic customer inquiries from Mumbai families and tech firms"
        >
          <Zap size={13} />
          <span>Simulate Lead</span>
          <span className="pill-counter">4</span>
        </button>

        {/* Standout Feature 3: Client Live Reaction Cam Toggle */}
        <button
          className={`preview-tool-pill pill-client ${clientMirrorOpen ? 'active' : ''}`}
          onClick={() => {
            sound.playClick();
            setClientMirrorOpen((prev) => !prev);
          }}
          title="Toggle Mr. Prakash & Bunty Live Reaction Cam"
        >
          <Eye size={13} />
          <span>Client Cam</span>
        </button>

        {/* Standout Feature 4: Aarav's Vibe Lab */}
        <button
          className={`preview-tool-pill pill-vibe ${vibeLabOpen ? 'active' : ''}`}
          onClick={() => {
            sound.playClick();
            setVibeLabOpen((prev) => !prev);
          }}
          title="Aarav's Experimental Visual Tweaks"
        >
          <Sparkles size={13} />
          <span>Vibe Lab</span>
        </button>

        {/* Viewport Width Switcher */}
        <div className="preview-device-switch">
          <button
            className={device === 'desktop' ? 'active' : ''}
            onClick={() => handleDeviceChange('desktop')}
            title="Desktop view (100%)"
          >
            <Laptop size={14} />
          </button>
          <button
            className={device === 'tablet' ? 'active' : ''}
            onClick={() => handleDeviceChange('tablet')}
            title="Tablet view (768px)"
          >
            <Tablet size={14} />
          </button>
          <button
            className={device === 'mobile' ? 'active' : ''}
            onClick={() => handleDeviceChange('mobile')}
            title="Mobile view (375px)"
          >
            <Smartphone size={14} />
          </button>
          <button
            className={device === 'foldable' ? 'active' : ''}
            onClick={() => handleDeviceChange('foldable')}
            title="Samsung Galaxy Fold view"
          >
            <Layers size={14} />
          </button>
        </div>

        {/* Console Toggle */}
        <button
          className={`preview-console-toggle ${showConsole ? 'active' : ''}`}
          onClick={() => {
            sound.playClick();
            setShowConsole((prev) => !prev);
          }}
        >
          <Terminal size={13} />
          <span>Console {bug1 || (bug2 && (device === 'mobile' || device === 'foldable')) ? '(2)' : ''}</span>
        </button>
      </div>

      {/* Warning & Runtime Alert Banners */}
      {runtimeError && (
        <div className="preview-runtime-alert">
          <AlertCircle size={15} />
          <span>{runtimeError}</span>
          <button onClick={() => setRuntimeError(null)}>
            <X size={13} />
          </button>
        </div>
      )}

      {bug2 && (device === 'mobile' || device === 'foldable') && (
        <div className="preview-qa-banner">
          <AlertCircle size={14} />
          <span>QA WARNING (Meera): Navigation is overlapping header on mobile! Inspect element to fix.</span>
        </div>
      )}

      {clientPingStatus && (
        <div className="preview-client-ping-toast">
          <Phone size={14} />
          <span>{clientPingStatus}</span>
        </div>
      )}

      {leadSuccessMsg && (
        <div className="preview-lead-success-toast">
          <Coins size={14} />
          <span>{leadSuccessMsg}</span>
        </div>
      )}

      {/* Inspector Mode Banner */}
      {inspectorActive && (
        <div className="preview-inspector-banner">
          <Crosshair size={14} />
          <span>
            <strong>INSPECT MODE ACTIVE:</strong> Click any element to view component author, code debt, and hotfix bugs.
          </span>
          <button onClick={() => setInspectorActive(false)}>Exit Inspector</button>
        </div>
      )}

      {/* Main Viewport Container */}
      <div className={`preview-viewport-container device-${device} ${vibeGeocities ? 'vibe-geocities' : ''}`}>
        <div className="preview-viewport" key={refreshKey}>
          {/* Foldable Screen Hinge Glitch Effect */}
          {device === 'foldable' && (
            <div className="foldable-hinge-overlay">
              <span className="hinge-label">FOLD CREASE · 240Hz</span>
            </div>
          )}

          {/* GeoCities 90s Banner if enabled */}
          {vibeGeocities && (
            <div className="geocities-marquee">
              <span>🔥 BEST EXPERIENCED IN NETSCAPE NAVIGATOR 4.0 · UNDER CONSTRUCTION · VISITOR #00042069 🔥</span>
            </div>
          )}

          {/* DAY 1 RAW HTML STAGE (When homepage < 25% and not hotfixed) */}
          {isRawStage ? (
            <div className="raw-html-stage">
              <h1 style={{ fontFamily: 'Times New Roman, serif', fontSize: '28px' }}>
                Royal Feast Catering
              </h1>
              <p style={{ fontFamily: 'Times New Roman, serif' }}>
                Welcome to our catering website. (Under Construction by {companyName})
              </p>
              <hr />

              {/* Inspectable Div Tree Comment */}
              <div
                className={`inspectable-block ${inspectorActive ? 'is-inspectable' : ''}`}
                onClick={inspectDivComment}
                title={inspectorActive ? 'Click to inspect div comment' : undefined}
              >
                {inspectorActive && <span className="inspect-tag">&lt;div.tree author="Aarav" debt="+14" /&gt;</span>}
                <p style={{ color: '#666', fontStyle: 'italic', fontSize: '13px' }}>
                  {divCleaned
                    ? '<!-- Varun: Div tree sanitized. Semantic HTML5 markup validated. -->'
                    : '<!-- Aarav: homepage basically done. 14 divs added. CSS coming tomorrow bro -->'}
                </p>
              </div>

              {/* Inspectable Broken Image Box */}
              <div
                className={`inspectable-block ${inspectorActive ? 'is-inspectable' : ''}`}
                onClick={inspectBiryani}
                style={{
                  margin: '20px 0',
                  padding: '15px',
                  border: biryaniAssetFixed ? '2px solid #eab308' : '1px dashed #999',
                  background: biryaniAssetFixed ? '#fefce8' : 'transparent',
                }}
              >
                {inspectorActive && (
                  <span className="inspect-tag">
                    {biryaniAssetFixed ? '&lt;HeroHandi status="200 OK" /&gt;' : '&lt;HeroImage status="404 NOT FOUND" /&gt;'}
                  </span>
                )}

                {biryaniAssetFixed ? (
                  <div className="raw-fixed-hero">
                    <div className="raw-fixed-badge">✨ HOTFIX APPLIED: Steaming Royal Dum Handi Rendered</div>
                    <div className="raw-biryani-visual">🍲 🔥 🍗</div>
                    <p>
                      <strong>Royal Lucknowi Dum Handi Biryani:</strong> Slow-cooked in sealed copper deg with aged basmati, saffron & fragrant kewra water.
                    </p>
                  </div>
                ) : (
                  <>
                    <h3 style={{ color: '#b91c1c' }}>[IMAGE NOT FOUND: biryani-hero.jpg]</h3>
                    <p>Authentic Lucknowi & Hyderabadi Catering for Weddings and Corporate Parties.</p>
                  </>
                )}

                {/* Inspectable Enquiry Button */}
                <div
                  className={`inspectable-block inline ${inspectorActive ? 'is-inspectable' : ''}`}
                  onClick={inspectWhatsAppCTA}
                >
                  {inspectorActive && <span className="inspect-tag">&lt;button.cta author="Nikhil" /&gt;</span>}
                  <button
                    onClick={(e) => {
                      if (!inspectorActive) handleOrderClick();
                    }}
                    style={{
                      padding: '8px 16px',
                      fontFamily: 'Times New Roman, serif',
                      cursor: 'pointer',
                      marginTop: '10px',
                      background: bug1 ? '#fee2e2' : '#dcfce7',
                      borderColor: bug1 ? '#ef4444' : '#22c55e',
                    }}
                  >
                    {bug1 ? 'Submit Enquiry (Broken)' : '✓ Submit WhatsApp Enquiry (Hotfixed)'}
                  </button>
                </div>
              </div>

              <div style={{ marginTop: '30px', fontSize: '12px', color: '#888' }}>
                <p>© 2026 Royal Feast · Phone: 98200-XXXXX</p>
                <p>Status: Localhost only. Do not show client yet.</p>
              </div>
            </div>
          ) : (
            /* STYLED MODERN ROYAL FEAST STAGING SITE */
            <div className={`styled-staging-site ${vibeSteam ? 'vibe-steam-active' : ''}`}>
              {/* Confetti particles */}
              {vibeConfetti && (
                <div className="vibe-confetti-layer">
                  <span className="confetti-p" style={{ left: '10%', animationDelay: '0s' }}>🎊</span>
                  <span className="confetti-p" style={{ left: '30%', animationDelay: '0.4s' }}>✨</span>
                  <span className="confetti-p" style={{ left: '55%', animationDelay: '0.2s' }}>🎉</span>
                  <span className="confetti-p" style={{ left: '75%', animationDelay: '0.6s' }}>👑</span>
                  <span className="confetti-p" style={{ left: '90%', animationDelay: '0.3s' }}>🍗</span>
                </div>
              )}

              {/* Top Announcement Bar */}
              <div className="staging-top-banner">
                <span>👑 MUMBAI'S PREMIER WEDDING & CORPORATE CATERERS · BOOKINGS OPEN 2026</span>
                <span className="staging-phone">
                  <Phone size={11} /> +91 98200 45678
                </span>
              </div>

              {/* Website Navigation Header */}
              <header
                className={`staging-header ${bug2 && (device === 'mobile' || device === 'foldable') ? 'is-buggy-overlap' : ''} ${
                  inspectorActive ? 'is-inspectable' : ''
                }`}
                onClick={inspectMobileNav}
              >
                {inspectorActive && (
                  <span className="inspect-tag">
                    &lt;Header z-index={bug2 ? '-1 (OVERLAPPING)' : '10 (FIXED)'} /&gt;
                  </span>
                )}

                <div className="staging-brand">
                  <span className="staging-crown">👑</span>
                  <div>
                    <strong>ROYAL FEAST</strong>
                    <small>CATERING & BANQUETS</small>
                  </div>
                </div>

                <nav className="staging-nav">
                  <button
                    className={activeTab === 'home' ? 'active' : ''}
                    onClick={() => setActiveTab('home')}
                  >
                    Home
                  </button>
                  <button
                    className={activeTab === 'menu' ? 'active' : ''}
                    onClick={() => setActiveTab('menu')}
                  >
                    Packages & Menu
                  </button>
                  <button
                    className={activeTab === 'booking' ? 'active' : ''}
                    onClick={() => setActiveTab('booking')}
                  >
                    Guest Calculator
                  </button>
                </nav>

                <button
                  className={`staging-header-cta ${inspectorActive ? 'is-inspectable' : ''}`}
                  onClick={(e) => {
                    if (inspectorActive) {
                      e.stopPropagation();
                      inspectWhatsAppCTA();
                    } else {
                      handleOrderClick();
                    }
                  }}
                >
                  <MessageCircle size={14} />
                  <span>WhatsApp Booking</span>
                </button>
              </header>

              {/* Hero Banner Section */}
              <section className="staging-hero">
                <div className="staging-hero-content">
                  <span className="staging-pill">
                    {vibeSaffron ? '✨ ENHANCED WITH KASHMIRI MONGRA SAFFRON' : 'ROYAL HERITAGE RECIPES SINCE 1994'}
                  </span>
                  <h1>
                    Authentic Dum Biryani & <em>Exquisite Feasts</em> for Your Grand Occasions
                  </h1>
                  <p>
                    From intimate 50-guest gatherings to 2,000-guest grand wedding banquets.
                    Live tandoor counters, copper handi service, and unmatched flavours.
                  </p>

                  <div className="staging-hero-actions">
                    <button
                      className={`staging-btn-primary ${inspectorActive ? 'is-inspectable' : ''}`}
                      onClick={(e) => {
                        if (inspectorActive) {
                          e.stopPropagation();
                          inspectWhatsAppCTA();
                        } else {
                          handleOrderClick();
                        }
                      }}
                    >
                      <MessageCircle size={15} />
                      <span>Book on WhatsApp</span>
                    </button>
                    <button
                      className="staging-btn-secondary"
                      onClick={() => setActiveTab('menu')}
                    >
                      <Utensils size={15} />
                      <span>View Menu Packages</span>
                    </button>
                  </div>

                  <div className="staging-trust-row">
                    <span>✓ 100% Fresh Ingredients</span>
                    <span>✓ Dedicated Kitchen Fleet</span>
                    <span>✓ On-Site Live Counters</span>
                  </div>
                </div>

                {/* Biryani Handi Showcase Illustration */}
                <div className="staging-hero-visual">
                  <div className="hero-handi-pot">
                    <span className="handi-steam">♨️</span>
                    <span className="handi-emoji">🍲</span>
                    <span className="handi-tag">Slow-Cooked Dum Handi</span>
                  </div>
                </div>
              </section>

              {/* Packages & Menu Section */}
              <section className="staging-packages-section">
                <div className="staging-section-header">
                  <span className="staging-subtitle">CURATED BANQUET MENUS</span>
                  <h2>Choose Your Catering Package</h2>
                  <p>Transparent pricing, customisable options, and guaranteed guest satisfaction.</p>
                </div>

                <div className="staging-package-grid">
                  {packages.map((pkg) => (
                    <div
                      key={pkg.id}
                      className={`staging-package-card ${
                        selectedPackage === pkg.id ? 'is-selected' : ''
                      }`}
                      onClick={() => {
                        sound.playClick(true);
                        setSelectedPackage(pkg.id);
                      }}
                    >
                      <span className="pkg-tag">{pkg.tag}</span>
                      <h3>{pkg.name}</h3>
                      <div className="pkg-price">
                        <b>₹{pkg.perPlate}</b>
                        <small>/ guest</small>
                      </div>
                      <p>{pkg.description}</p>
                      <button className="pkg-select-btn">
                        {selectedPackage === pkg.id ? '✓ Selected Package' : 'Select Package'}
                      </button>
                    </div>
                  ))}
                </div>
              </section>

              {/* Interactive Guest Calculator */}
              <section className="staging-calculator-section">
                <div className="staging-calc-card">
                  <div className="calc-left">
                    <span className="calc-kicker">INTERACTIVE ESTIMATOR</span>
                    <h3>Instant Wedding / Event Quote</h3>
                    <p>
                      Selected: <strong>{currentPkg.name}</strong>
                    </p>

                    <div className="calc-slider-box">
                      <div className="calc-slider-header">
                        <span>Expected Guests:</span>
                        <b>{guestCount} People</b>
                      </div>
                      <input
                        type="range"
                        min="30"
                        max="800"
                        step="10"
                        value={guestCount}
                        onChange={(e) => {
                          setGuestCount(Number(e.target.value));
                        }}
                      />
                      <div className="calc-slider-range">
                        <small>30 min</small>
                        <small>500 typical</small>
                        <small>800+ grand</small>
                      </div>
                    </div>
                  </div>

                  <div className="calc-right">
                    <div className="calc-total-box">
                      <span>ESTIMATED TOTAL BUDGET</span>
                      <h2>₹{totalPrice.toLocaleString('en-IN')}</h2>
                      <small>Includes buffet service, handis & basic tableware</small>
                    </div>

                    <button
                      className={`calc-whatsapp-btn ${inspectorActive ? 'is-inspectable' : ''}`}
                      onClick={(e) => {
                        if (inspectorActive) {
                          e.stopPropagation();
                          inspectWhatsAppCTA();
                        } else {
                          handleOrderClick();
                        }
                      }}
                    >
                      <MessageCircle size={17} />
                      <span>Request WhatsApp Booking</span>
                    </button>
                  </div>
                </div>
              </section>

              {/* Staging Footer */}
              <footer className="staging-footer">
                <div className="staging-footer-top">
                  <div>
                    <strong>Royal Feast Catering & Hospitality</strong>
                    <p>Opp. Metro Station, Andheri East, Mumbai</p>
                  </div>
                  <div className="staging-footer-badge">
                    <span>Developed by {companyName}</span>
                    <small>Verified Staging Build RF-001</small>
                  </div>
                </div>
              </footer>
            </div>
          )}
        </div>
      </div>

      {/* Floating Standout Feature 1: Element Inspector Popover */}
      {inspectedElement && (
        <div className="preview-inspector-drawer">
          <div className="inspector-drawer-header">
            <div className="inspector-drawer-title">
              <Code size={14} />
              <span>DOM ELEMENT INSPECTOR</span>
              <span className={`status-pill pill-${inspectedElement.status}`}>
                {inspectedElement.status.toUpperCase()}
              </span>
            </div>
            <button onClick={() => setInspectedElement(null)}>
              <X size={14} />
            </button>
          </div>

          <div className="inspector-drawer-body">
            <div className="inspector-meta-row">
              <div className="inspector-elem-name">{inspectedElement.name}</div>
              <div className="inspector-file-tag">{inspectedElement.file}</div>
            </div>

            <div className="inspector-author-card">
              <CharacterSprite character={inspectedElement.author} size="sm" expression="talking" />
              <div>
                <strong>{inspectedElement.authorName} ({inspectedElement.role})</strong>
                <p>{inspectedElement.note}</p>
              </div>
            </div>

            {inspectedElement.fixLabel && inspectedElement.fixableAction && (
              <div className="inspector-actions">
                <button
                  className="inspector-hotfix-btn"
                  onClick={inspectedElement.fixableAction}
                  disabled={actionsLeft <= 0 && !!inspectedElement.fixableDefectId}
                >
                  <Wrench size={14} />
                  <span>{inspectedElement.fixLabel}</span>
                </button>
                {actionsLeft <= 0 && inspectedElement.fixableDefectId && (
                  <small className="no-actions-warn">Out of actions for today. Plan for tomorrow's stand-up.</small>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Floating Standout Feature 2: Client Live Reaction Cam (Mr. Prakash & Bunty) */}
      {clientMirrorOpen && (
        mirrorMinimized ? (
          <div className="preview-client-mini-pill" onClick={() => setMirrorMinimized(false)}>
            <div className="live-dot" />
            <div className="mini-pill-avatars">
              <span className="mini-avatar">☕</span>
              <span className="mini-avatar">🎮</span>
            </div>
            <div className="mini-pill-text">
              <strong>Client Live Cam</strong>
              <small>BP: {clientStatus.prakashBP.split(' ')[0]} · Vibe: {clientStatus.buntyVibe}</small>
            </div>
            <button className="mini-expand-btn" title="Expand Client Monitor">↗</button>
          </div>
        ) : (
          <div className="preview-client-mirror">
            <div className="client-mirror-header">
              <div className="mirror-title">
                <span className="live-dot" />
                <span>LIVE CLIENT MONITOR · Mr. Prakash & Bunty</span>
              </div>
              <div className="mirror-header-controls">
                <button
                  className="mirror-ping-btn"
                  onClick={handlePingClient}
                  title="Send Staging link notification to Prakash Uncle"
                >
                  <Phone size={11} />
                  <span>Ring Client</span>
                </button>
                <button onClick={() => setMirrorMinimized(true)} title="Minimise Live Monitor">
                  <ChevronDown size={14} />
                </button>
                <button onClick={() => setClientMirrorOpen(false)} title="Close Live Monitor">
                  <X size={12} />
                </button>
              </div>
            </div>

            <div className="client-mirror-tiles">
              {/* Prakash Tile */}
              <div className="client-tile">
                <div className="tile-video-header">
                  <span className="tile-name">Mr. Prakash (Client)</span>
                  <span className="tile-stat">{clientStatus.prakashBP}</span>
                </div>
                <div className="tile-avatar-box">
                  <CharacterSprite character="prakash" size="md" expression={clientStatus.prakashMood} />
                  <span className="tile-badge-corner">☕ Cutting Chai #4</span>
                </div>
                <p className="tile-speech">{clientStatus.prakashQuote}</p>
              </div>

              {/* Bunty Tile */}
              <div className="client-tile tile-bunty">
                <div className="tile-video-header">
                  <span className="tile-name">Bunty (Nephew)</span>
                  <span className="tile-stat">Vibe: {clientStatus.buntyVibe}</span>
                </div>
                <div className="tile-avatar-box">
                  <CharacterSprite character="bunty" size="md" expression={clientStatus.buntyMood} />
                  <span className="tile-badge-corner rgb-glow">🎮 RGB Gamer Cam</span>
                </div>
                <p className="tile-speech">{clientStatus.buntyQuote}</p>
              </div>
            </div>
          </div>
        )
      )}

      {/* Floating Standout Feature 3: Simulate Lead Drawer */}
      {leadDrawerOpen && (
        <div className="preview-lead-drawer">
          <div className="lead-drawer-header">
            <div className="lead-drawer-title">
              <Zap size={14} />
              <span>SIMULATE CUSTOMER LEAD ({activeLeadIndex + 1}/4)</span>
            </div>
            <button onClick={() => setLeadDrawerOpen(false)}>
              <X size={14} />
            </button>
          </div>

          <div className="lead-drawer-card">
            <div className="lead-card-top">
              <span className="lead-avatar">{currentLead.avatar}</span>
              <div>
                <strong>{currentLead.clientName}</strong>
                <small>{currentLead.eventType} · {currentLead.guests} Guests</small>
              </div>
              <span className={`lead-urgency urgency-${currentLead.urgency.toLowerCase()}`}>
                {currentLead.urgency}
              </span>
            </div>

            <div className="lead-budget-box">
              <span>ESTIMATED INVOICE VALUE</span>
              <b>₹{currentLead.budget.toLocaleString('en-IN')}</b>
            </div>

            <p className="lead-note-text">{currentLead.note}</p>

            <div className="lead-actions">
              <button className="lead-route-btn" onClick={handleRouteLead}>
                <MessageCircle size={14} />
                <span>Test WhatsApp Flow with Lead</span>
              </button>
              <button
                className="lead-next-btn"
                onClick={() => setActiveLeadIndex((prev) => (prev + 1) % mockLeads.length)}
              >
                Next Lead ➔
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Standout Feature 4: Aarav's Vibe Lab Menu */}
      {vibeLabOpen && (
        <div className="preview-vibe-menu">
          <div className="vibe-menu-header">
            <Sparkles size={13} />
            <span>AARAV'S EXPERIMENTAL VIBE LAB</span>
            <button onClick={() => setVibeLabOpen(false)}>
              <X size={12} />
            </button>
          </div>

          <div className="vibe-options-list">
            <label className="vibe-checkbox-row">
              <input
                type="checkbox"
                checked={vibeSteam}
                onChange={(e) => {
                  sound.playClick();
                  setVibeSteam(e.target.checked);
                }}
              />
              <span>🌶️ Extra Spicy Biryani Steam Trails</span>
            </label>

            <label className="vibe-checkbox-row">
              <input
                type="checkbox"
                checked={vibeConfetti}
                onChange={(e) => {
                  sound.playClick();
                  setVibeConfetti(e.target.checked);
                }}
              />
              <span>💃 Wedding Sangeet Confetti Shower</span>
            </label>

            <label className="vibe-checkbox-row">
              <input
                type="checkbox"
                checked={vibeSaffron}
                onChange={(e) => {
                  sound.playClick();
                  setVibeSaffron(e.target.checked);
                }}
              />
              <span>✨ Kashmiri Saffron Luxury Pricing (+12%)</span>
            </label>

            <label className="vibe-checkbox-row">
              <input
                type="checkbox"
                checked={vibeGeocities}
                onChange={(e) => {
                  sound.playClick();
                  setVibeGeocities(e.target.checked);
                }}
              />
              <span>📟 1999 GeoCities Nostalgia Glitch</span>
            </label>
          </div>
        </div>
      )}

      {/* Simulated DevTools Console Drawer */}
      {showConsole && (
        <div className="preview-console-drawer">
          <div className="console-header">
            <div className="console-title">
              <Terminal size={14} />
              <span>STAGING CONSOLE & DEVTOOLS · http://localhost:3000</span>
            </div>
            <button onClick={() => setShowConsole(false)}>
              <X size={14} />
            </button>
          </div>
          <div className="console-log-thread">
            {logs.map((log) => (
              <div key={log.id} className={`console-line line-${log.type}`}>
                <span className="log-badge">{log.type.toUpperCase()}</span>
                <span className="log-text">{log.text}</span>
                {log.defectId && (
                  <button
                    className="console-action-btn"
                    onClick={() => {
                      sound.playSuccess();
                      fixDefect(log.defectId!);
                      setRuntimeError(null);
                    }}
                    disabled={actionsLeft <= 0}
                  >
                    🛠️ Hotfix Defect (-1 Action)
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Simulated WhatsApp Web Dialog */}
      {mockWhatsAppOpen && (
        <div className="mock-whatsapp-backdrop" onClick={() => setMockWhatsAppOpen(false)}>
          <div className="mock-whatsapp-modal" onClick={(e) => e.stopPropagation()}>
            <div className="mock-wa-header">
              <div className="wa-avatar">👑</div>
              <div className="wa-contact-info">
                <strong>Mr. Prakash (Royal Feast Catering)</strong>
                <small>Official Business WhatsApp · Online</small>
              </div>
              <button className="wa-close-btn" onClick={() => setMockWhatsAppOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <div className="mock-wa-body">
              <div className="wa-date-divider">TODAY · PRE-FILLED ENQUIRY</div>
              <div className="wa-incoming-bubble">
                “Namaste! Thank you for contacting Royal Feast Catering. How can we make your event memorable?”
                <time>11:00 AM</time>
              </div>

              <div className="wa-outgoing-bubble">
                <strong>Enquiry Details:</strong>
                <p>• Client: {currentLead.clientName}</p>
                <p>• Event: {currentLead.eventType}</p>
                <p>• Package: {currentPkg.name}</p>
                <p>• Expected Guests: {currentLead.guests || guestCount} People</p>
                <p>• Estimated Budget: ₹{(currentLead.budget || totalPrice).toLocaleString('en-IN')}</p>
                <p>“Please confirm date availability and package options!”</p>
                <time>Just now · Sent via Staging Portal</time>
              </div>

              <div className="wa-verified-pill">
                <CheckCircle2 size={14} />
                <span>INTEGRATION TEST PASSED: WhatsApp URL Schema Generated Successfully!</span>
              </div>
            </div>

            <div className="mock-wa-footer">
              <button
                className="wa-confirm-btn"
                onClick={() => {
                  sound.playSuccess();
                  setMockWhatsAppOpen(false);
                }}
              >
                <span>Close Preview & Return to Workstation</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
