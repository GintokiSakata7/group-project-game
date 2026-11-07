import { useState, useMemo } from 'react';
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
} from 'lucide-react';
import { useGameStore } from '../game/store';
import { sound } from '../game/audio';
import { Pill, ProgressBar } from './shared';

export default function WebPreview() {
  const { tasks, defects, day, companyName, metrics } = useGameStore();

  const [device, setDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [activeTab, setActiveTab] = useState<'home' | 'menu' | 'booking' | 'about'>('home');
  const [showConsole, setShowConsole] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedPackage, setSelectedPackage] = useState<string>('royal_shaadi');
  const [guestCount, setGuestCount] = useState<number>(150);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [mockWhatsAppOpen, setMockWhatsAppOpen] = useState(false);
  const [runtimeError, setRuntimeError] = useState<string | null>(null);

  // Relevant tasks
  const homepageTask = tasks.find((t) => t.id === 'homepage');
  const catalogueTask = tasks.find((t) => t.id === 'catalogue');
  const whatsappTask = tasks.find((t) => t.id === 'whatsapp');
  const responsiveTask = tasks.find((t) => t.id === 'responsive');

  // Relevant bugs
  const bug1 = defects.find((d) => d.id === 'bug-1' && !d.fixed); // Enquiry button broken
  const bug2 = defects.find((d) => d.id === 'bug-2' && !d.fixed); // Mobile nav overlap

  const homepageProgress = homepageTask?.progress ?? 0;
  const catalogueProgress = catalogueTask?.progress ?? 0;
  const whatsappProgress = whatsappTask?.progress ?? 0;

  // Handle refresh click
  const handleRefresh = () => {
    sound.playClick();
    setIsRefreshing(true);
    setRuntimeError(null);
    setTimeout(() => {
      setRefreshKey((k) => k + 1);
      setIsRefreshing(false);
    }, 400);
  };

  // Switch device view
  const handleDeviceChange = (d: 'desktop' | 'tablet' | 'mobile') => {
    sound.playClick();
    setDevice(d);
  };

  // Handle WhatsApp action
  const handleOrderClick = () => {
    if (bug1 || whatsappProgress < 30) {
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

  // Catering packages
  const packages = [
    {
      id: 'royal_shaadi',
      name: 'Royal Shaadi Grand Feast',
      perPlate: 1200,
      description: 'Lucknowi Dum Biryani, Galouti Kebabs, Paneer Pasanda, Shahi Tukda & 14 Starters',
      tag: 'Most Popular',
    },
    {
      id: 'corporate_lunch',
      name: 'Executive Tech Buffet',
      perPlate: 650,
      description: 'Hyderabadi Chicken/Veg Biryani, Mirchi Ka Salan, Raita, Gulab Jamun & Chai',
      tag: 'Best Value',
    },
    {
      id: 'party_starters',
      name: 'Sangeet & Cocktail Bites',
      perPlate: 450,
      description: 'Cocktail Samosas, Dahi Puri, Chicken Tikka Skewers & Masala Lemonade',
      tag: 'Quick Delivery',
    },
  ];

  const currentPkg = packages.find((p) => p.id === selectedPackage) ?? packages[0];
  const totalPrice = currentPkg.perPlate * guestCount;

  // Console logs
  const logs = useMemo(() => {
    const list = [
      { type: 'info', text: `[Vite] dev server running on http://localhost:3000` },
      { type: 'info', text: `[Build] Client bundle compiled for Day ${day}` },
    ];

    if (homepageProgress < 30) {
      list.push({ type: 'warn', text: `[CSS] 0 stylesheets loaded. Falling back to browser default.` });
      list.push({ type: 'info', text: `[Aarav] <!-- TODO: make this look clean bro -->` });
    } else {
      list.push({ type: 'info', text: `[Tailwind] Loaded 48 utility classes for Royal Feast Theme.` });
    }

    if (bug1) {
      list.push({
        type: 'error',
        text: `[Meera Defect #1] CTA button has onClick={undefined}. User clicks go to void.`,
      });
    }

    if (bug2 && device === 'mobile') {
      list.push({
        type: 'warn',
        text: `[Meera Defect #2] Mobile viewport width 375px: #nav-menu overlaps .hero-title by 44px.`,
      });
    }

    if (whatsappProgress >= 40 && !bug1) {
      list.push({
        type: 'info',
        text: `[Nikhil API] Mock endpoint POST /api/enquiry verified. 200 OK.`,
      });
    }

    return list;
  }, [day, homepageProgress, bug1, bug2, device, whatsappProgress]);

  return (
    <div className="app-scroll web-preview-app">
      {/* Browser Navigation Bar */}
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

        <div className="preview-address-bar">
          <ShieldCheck size={13} className="text-good" />
          <span>http://localhost:3000/staging · Royal Feast Digital v0.{day}</span>
          <span className="preview-badge">LOCAL STAGING</span>
        </div>

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
        </div>

        <button
          className={`preview-console-toggle ${showConsole ? 'active' : ''}`}
          onClick={() => {
            sound.playClick();
            setShowConsole((prev) => !prev);
          }}
        >
          <Terminal size={13} />
          <span>Console {bug1 || (bug2 && device === 'mobile') ? '(2)' : ''}</span>
        </button>
      </div>

      {/* Warning Banners */}
      {runtimeError && (
        <div className="preview-runtime-alert">
          <AlertCircle size={15} />
          <span>{runtimeError}</span>
          <button onClick={() => setRuntimeError(null)}>
            <X size={13} />
          </button>
        </div>
      )}

      {bug2 && device === 'mobile' && (
        <div className="preview-qa-banner">
          <AlertCircle size={14} />
          <span>QA WARNING (Meera): Navigation is overlapping header on mobile!</span>
        </div>
      )}

      {/* Main Viewport Stage */}
      <div className={`preview-viewport-container device-${device}`}>
        <div className="preview-viewport" key={refreshKey}>
          {/* DAY 1 RAW HTML STAGE (When homepage < 25%) */}
          {homepageProgress < 25 ? (
            <div className="raw-html-stage">
              <h1 style={{ fontFamily: 'Times New Roman, serif', fontSize: '28px' }}>
                Royal Feast Catering
              </h1>
              <p style={{ fontFamily: 'Times New Roman, serif' }}>
                Welcome to our catering website. (Under Construction by {companyName})
              </p>
              <hr />
              <p style={{ color: '#666', fontStyle: 'italic', fontSize: '13px' }}>
                &lt;!-- Aarav: homepage basically done. 14 divs added. CSS coming tomorrow bro --&gt;
              </p>

              <div style={{ margin: '20px 0', padding: '15px', border: '1px dashed #999' }}>
                <h3>[IMAGE NOT FOUND: biryani-hero.jpg]</h3>
                <p>Authentic Lucknowi & Hyderabadi Catering for Weddings and Corporate Parties.</p>
                <button
                  onClick={handleOrderClick}
                  style={{
                    padding: '8px 16px',
                    fontFamily: 'Times New Roman, serif',
                    cursor: 'pointer',
                  }}
                >
                  Submit Enquiry (Broken)
                </button>
              </div>

              <div style={{ marginTop: '30px', fontSize: '12px', color: '#888' }}>
                <p>© 2026 Royal Feast · Phone: 98200-XXXXX</p>
                <p>Status: Localhost only. Do not show client yet.</p>
              </div>
            </div>
          ) : (
            /* STYLED MODERN ROYAL FEAST STAGING SITE */
            <div className="styled-staging-site">
              {/* Top Announcement Bar */}
              <div className="staging-top-banner">
                <span>👑 MUMBAI'S PREMIER WEDDING & CORPORATE CATERERS · BOOKINGS OPEN 2026</span>
                <span className="staging-phone">
                  <Phone size={11} /> +91 98200 45678
                </span>
              </div>

              {/* Website Navigation Header */}
              <header className={`staging-header ${bug2 && device === 'mobile' ? 'is-buggy-overlap' : ''}`}>
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

                <button className="staging-header-cta" onClick={handleOrderClick}>
                  <MessageCircle size={14} />
                  <span>WhatsApp Booking</span>
                </button>
              </header>

              {/* Hero Banner Section */}
              <section className="staging-hero">
                <div className="staging-hero-content">
                  <span className="staging-pill">ROYAL HERITAGE RECIPES SINCE 1994</span>
                  <h1>
                    Authentic Dum Biryani & <em>Exquisite Feasts</em> for Your Grand Occasions
                  </h1>
                  <p>
                    From intimate 50-guest gatherings to 2,000-guest grand wedding banquets.
                    Live tandoor counters, copper handi service, and unmatched flavours.
                  </p>

                  <div className="staging-hero-actions">
                    <button className="staging-btn-primary" onClick={handleOrderClick}>
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

              {/* Interactive Guest Calculator & WhatsApp Lead Generator */}
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

                    <button className="calc-whatsapp-btn" onClick={handleOrderClick}>
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

      {/* Simulated Chrome DevTools / Console Drawer */}
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
            {logs.map((log, i) => (
              <div key={i} className={`console-line line-${log.type}`}>
                <span className="log-badge">{log.type.toUpperCase()}</span>
                <span className="log-text">{log.text}</span>
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
                <p>• Package: {currentPkg.name}</p>
                <p>• Expected Guests: {guestCount} People</p>
                <p>• Estimated Budget: ₹{totalPrice.toLocaleString('en-IN')}</p>
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

