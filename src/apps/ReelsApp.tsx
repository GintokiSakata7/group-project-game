import { useState, useRef, useEffect, type ReactNode } from 'react';
import { Heart, MessageCircle, Share2, Music2, Volume2, VolumeX, ChevronUp, ChevronDown, Send, Sparkles, Flame, ShieldAlert, Award, Smile } from 'lucide-react';
import { useGameStore } from '../game/store';
import { CharacterSprite, type CharacterId } from '../components/CharacterSprite';
import { sound } from '../game/audio';

interface ReelComment {
  id: string;
  author: string;
  handle: string;
  text: string;
  time: string;
  avatar: string;
  likes: number;
}

interface ReelItem {
  id: string;
  author: string;
  handle: string;
  character: CharacterId;
  role: string;
  audioTrack: string;
  caption: string;
  soundtrackType: 'lofi' | 'synth' | 'ambient' | 'chiptune';
  baseLikes: number;
  comments: ReelComment[];
  renderScene: () => ReactNode;
}

export default function ReelsApp() {
  const { likedReels = [], toggleLikeReel } = useGameStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showComments, setShowComments] = useState(false);
  const [customComment, setCustomComment] = useState('');
  const [floatingHearts, setFloatingHearts] = useState<{ id: number; x: number; y: number }[]>([]);
  const [extraComments, setExtraComments] = useState<Record<string, ReelComment[]>>({});
  const [isPlayingSound, setIsPlayingSound] = useState(false);
  const heartIdRef = useRef(0);

  const reels: ReelItem[] = [
    {
      id: 'reel-1',
      author: 'Aarav',
      handle: '@aarav.vibes',
      character: 'aarav',
      role: 'Full-Stack Vibe Coder',
      audioTrack: 'Aarav · Friday Main Push Theme (170 BPM)',
      soundtrackType: 'synth',
      baseLikes: 1420,
      caption: 'POV: Merging directly to main at 5:59 PM on a Friday. If CI/CD wanted me to run unit tests, it would have said please. 🚀🔥 #yolo #shipit #frontendvibes #paniclabs',
      comments: [
        { id: 'c1', author: 'Meera', handle: '@meera.qa', text: 'I am logging 19 critical tickets against your bloodline.', time: '2m ago', avatar: '🔬', likes: 84 },
        { id: 'c2', author: 'Nikhil', handle: '@nikhil.backend', text: 'reverting', time: '1m ago', avatar: '👻', likes: 120 },
        { id: 'c3', author: 'Kunal', handle: '@kunal.hype', text: 'ENERGY WAS RIGHT THOUGH! Bold moves build companies! 🌟', time: 'Just now', avatar: '☀️', likes: 15 },
      ],
      renderScene: () => (
        <div className="reel-scene reel-scene-glitch">
          <div className="terminal-window-mock">
            <div className="terminal-titlebar"><span>bash - git push origin main --force</span></div>
            <div className="terminal-body-text">
              <span className="term-green">$ git push origin main --force</span>
              <span className="term-yellow">&gt; remote: Resolving deltas: 100%</span>
              <span className="term-red">&gt; CRITICAL: 14 PRODUCTION SERVERS ARE CRYING</span>
              <span className="term-cyan">&gt; aarav: "vibes are immaculate though"</span>
            </div>
          </div>
          <div className="reel-character-stage">
            <CharacterSprite character="aarav" expression="smug" size="lg" speaking />
            <div className="speech-bubble-pop">“If it builds in my head, it builds in prod!”</div>
          </div>
          <div className="reel-warning-banner">⚠️ 0 TESTS RUN · 19 PACKAGES INSTALLED</div>
        </div>
      ),
    },
    {
      id: 'reel-2',
      author: 'Varun',
      handle: '@varun.architect',
      character: 'varun',
      role: 'Technical Lead',
      audioTrack: 'Varun · Miro Board Symphony No. 4',
      soundtrackType: 'ambient',
      baseLikes: 890,
      caption: 'Day in the life of a Tech Lead who hasn’t opened VS Code since 2022. Drew 4 boxes and 3 arrows today. The system is spiritually decoupled. ☕📐 #architecture #thoughtleader #systemdesign',
      comments: [
        { id: 'c4', author: 'Aarav', handle: '@aarav.vibes', text: 'Bro where does the yellow arrow point to', time: '5m ago', avatar: '⚡', likes: 62 },
        { id: 'c5', author: 'Varun', handle: '@varun.architect', text: 'The future, Aarav. It points to the future.', time: '4m ago', avatar: '🧠', likes: 98 },
        { id: 'c6', author: 'Meera', handle: '@meera.qa', text: 'A slide deck is not a load balancer.', time: '2m ago', avatar: '🔬', likes: 110 },
      ],
      renderScene: () => (
        <div className="reel-scene reel-scene-blueprint">
          <div className="blueprint-grid">
            <div className="box-node node-a">CLIENT<br /><small>Hungry</small></div>
            <div className="arrow-flow">➔ ➔ ➔</div>
            <div className="box-node node-b">KAFKA EVENT BUS<br /><small>Overkill (v3)</small></div>
            <div className="arrow-flow">➔ ➔ ➔</div>
            <div className="box-node node-c">BIRYANIS<br /><small>Delivered</small></div>
          </div>
          <div className="reel-character-stage">
            <CharacterSprite character="varun" expression="neutral" size="lg" speaking />
            <div className="speech-bubble-pop">“Technically, the diagram compiled successfully.”</div>
          </div>
          <div className="reel-caption-sticker">📐 47 SLIDES READY FOR REVIEW</div>
        </div>
      ),
    },
    {
      id: 'reel-3',
      author: 'Bunty',
      handle: '@bunty.crypto',
      character: 'bunty',
      role: "Client's Nephew",
      audioTrack: 'Bunty · Solana Beat Drop 2026',
      soundtrackType: 'synth',
      baseLikes: 340,
      caption: 'Why Royal Feast Catering needs Web4. My cousin already built the smart contract for butter chicken. Pitch deck in bio! 🪙🚀 #crypto #web4 #disruption #invest',
      comments: [
        { id: 'c7', author: 'Mr. Prakash', handle: '@prakash.catering', text: 'Bunty beta please do not talk to clients.', time: '10m ago', avatar: '👨🏻‍💼', likes: 145 },
        { id: 'c8', author: 'Aarav', handle: '@aarav.vibes', text: 'Can we put the blockchain in the footer though? Sounds lightweight.', time: '8m ago', avatar: '⚡', likes: 34 },
        { id: 'c9', author: 'Meera', handle: '@meera.qa', text: 'There is no internet connection in the wedding hall.', time: '6m ago', avatar: '🔬', likes: 95 },
      ],
      renderScene: () => (
        <div className="reel-scene reel-scene-crypto">
          <div className="crypto-chart-ticker">
            <span className="ticker-up">BUNTYCOIN ▲ 4,200%</span>
            <span className="ticker-down">CLIENT TRUST ▼ 99.8%</span>
          </div>
          <div className="crypto-coins-rain">🪙 🪙 🪙 💎 🚀</div>
          <div className="reel-character-stage">
            <CharacterSprite character="bunty" expression="smug" size="lg" speaking />
            <div className="speech-bubble-pop">“Every samosa gets its own NFT on the blockchain!”</div>
          </div>
          <div className="reel-warning-banner">🚨 UNINVITED GUEST DETECTED IN CHAT</div>
        </div>
      ),
    },
    {
      id: 'reel-4',
      author: 'Kunal',
      handle: '@kunal.hype',
      character: 'kunal',
      role: 'Client Relations ("Chief Motivation Officer")',
      audioTrack: 'DJ Kunal · Agile Beats to Cry/Code To',
      soundtrackType: 'lofi',
      baseLikes: 2100,
      caption: 'Corporate Wellness Seminar vs Reality. Breathe in the synergy, exhale the technical debt! Stress is just unoptimized passion! 🧘‍♂️🔥 #wellness #startupgrind #corporatehumor',
      comments: [
        { id: 'c10', author: 'Meera', handle: '@meera.qa', text: 'The staging server is literally on fire.', time: '12m ago', avatar: '🔬', likes: 180 },
        { id: 'c11', author: 'Kunal', handle: '@kunal.hype', text: 'Then we shall warm our spirits by its flame, Meera! 🔥✨', time: '11m ago', avatar: '☀️', likes: 210 },
      ],
      renderScene: () => (
        <div className="reel-scene reel-scene-zen">
          <div className="zen-lotus-wrap">
            <span className="fire-backdrop">🔥 🔥 🔥</span>
            <div className="zen-circle">504 GATEWAY TIMEOUT</div>
          </div>
          <div className="reel-character-stage">
            <CharacterSprite character="kunal" expression="happy" size="lg" speaking />
            <div className="speech-bubble-pop">“We are not failing! We are discovering what doesn’t work with enthusiasm!”</div>
          </div>
          <div className="reel-caption-sticker">🧘‍♀️ DAILY STANDUP MEDITATION ACTIVE</div>
        </div>
      ),
    },
    {
      id: 'reel-5',
      author: 'Meera',
      handle: '@meera.qa',
      character: 'meera',
      role: 'Quality Assurance',
      audioTrack: 'Meera · 1,000 Unhandled Exceptions',
      soundtrackType: 'chiptune',
      baseLikes: 1890,
      caption: 'Testing the client’s “Order Now” button in 14 emotional and spiritual states. Button flew into outer space on click 3. Release cancelled. 🛑🧪 #qatesting #buglife #devpain',
      comments: [
        { id: 'c12', author: 'Aarav', handle: '@aarav.vibes', text: 'It worked on my machine though...', time: '15m ago', avatar: '⚡', likes: 45 },
        { id: 'c13', author: 'Meera', handle: '@meera.qa', text: 'Then we are shipping your machine to the client.', time: '14m ago', avatar: '🔬', likes: 320 },
      ],
      renderScene: () => (
        <div className="reel-scene reel-scene-qa">
          <div className="qa-error-cascade">
            <div className="error-pill-mock">TypeError: undefined is not a Biryani</div>
            <div className="error-pill-mock">DOMException: Button clicked with too much hope</div>
            <div className="error-pill-mock">NetworkError: Offline mode activated emotionally</div>
          </div>
          <div className="reel-character-stage">
            <CharacterSprite character="meera" expression="shocked" size="lg" speaking />
            <div className="speech-bubble-pop">“I clicked it with my eyes closed and prod went down.”</div>
          </div>
          <div className="reel-warning-banner">🛑 34 BUGS IDENTIFIED · SHIP BLOCKED</div>
        </div>
      ),
    },
    {
      id: 'reel-6',
      author: 'Nikhil',
      handle: '@nikhil.backend',
      character: 'nikhil',
      role: 'Backend Developer',
      audioTrack: 'Nikhil · Ambient Dial-Up Drone',
      soundtrackType: 'ambient',
      baseLikes: 3410,
      caption: 'Tutorial: How to answer 47 urgent @channel pings in Slack with one four-letter word. 👻🌙 #backenddev #introvertlife #seen',
      comments: [
        { id: 'c14', author: 'Kunal', handle: '@kunal.hype', text: 'Nikhil! Are you coming to the team dinner??', time: '20m ago', avatar: '☀️', likes: 12 },
        { id: 'c15', author: 'Nikhil', handle: '@nikhil.backend', text: 'seen', time: '19m ago', avatar: '👻', likes: 520 },
      ],
      renderScene: () => (
        <div className="reel-scene reel-scene-ghost">
          <div className="slack-ping-mock">
            <div className="slack-bubble">@nikhil the database is down!</div>
            <div className="slack-bubble">@nikhil client is calling!</div>
            <div className="slack-bubble nikhil-reply">seen</div>
          </div>
          <div className="reel-character-stage">
            <CharacterSprite character="nikhil" expression="exhausted" size="lg" speaking />
            <div className="speech-bubble-pop">“I pushed the migration at 4:18 AM. Do not perceive me.”</div>
          </div>
          <div className="reel-caption-sticker">🌙 LAST SEEN: A DIFFERENT TIME ZONE</div>
        </div>
      ),
    },
  ];

  const currentReel = reels[currentIndex];
  const isLiked = likedReels.includes(currentReel.id);
  const allComments = [...currentReel.comments, ...(extraComments[currentReel.id] || [])];
  const likesCount = currentReel.baseLikes + (isLiked ? 1 : 0);

  const nextReel = () => {
    sound.playClick();
    setCurrentIndex((prev) => (prev + 1) % reels.length);
    setShowComments(false);
  };

  const prevReel = () => {
    sound.playClick();
    setCurrentIndex((prev) => (prev - 1 + reels.length) % reels.length);
    setShowComments(false);
  };

  const handleLike = (e?: React.MouseEvent) => {
    sound.playReelLike();
    toggleLikeReel(currentReel.id);

    // Spawn floating heart
    const rect = e?.currentTarget?.getBoundingClientRect();
    const x = rect ? rect.x - 40 : 150;
    const y = rect ? rect.y - 20 : 300;
    const heartId = ++heartIdRef.current;
    setFloatingHearts((prev) => [...prev, { id: heartId, x, y }]);
    setTimeout(() => {
      setFloatingHearts((prev) => prev.filter((h) => h.id !== heartId));
    }, 900);
  };

  const postComment = () => {
    if (!customComment.trim()) return;
    sound.playSuccess();
    const newComment: ReelComment = {
      id: `custom-${Date.now()}`,
      author: 'You (Founder)',
      handle: '@founder.ceo',
      text: customComment.trim(),
      time: 'Just now',
      avatar: '👑',
      likes: 1,
    };
    setExtraComments((prev) => ({
      ...prev,
      [currentReel.id]: [...(prev[currentReel.id] || []), newComment],
    }));
    setCustomComment('');
  };

  const toggleSound = () => {
    if (isPlayingSound) {
      sound.pauseMusic();
      setIsPlayingSound(false);
    } else {
      sound.playTrack(currentIndex % sound.tracks.length);
      setIsPlayingSound(true);
    }
  };

  return (
    <div className="reels-app-container">
      {/* Mobile Device Frame */}
      <div className="phone-device-mockup">
        {/* Status Bar */}
        <div className="phone-status-bar">
          <span className="status-time">9:41</span>
          <div className="phone-notch"><span className="camera-dot" /></div>
          <div className="status-icons">
            <span>5G</span>
            <span>📶</span>
            <span>100% 🔋</span>
          </div>
        </div>

        {/* App Topbar */}
        <div className="phone-app-topbar">
          <div className="phone-brand">
            <Sparkles size={16} className="brand-sparkle" />
            <b>OfficeGram</b>
            <span className="brand-pill">DEV REELS</span>
          </div>
          <div className="topbar-actions">
            <button className="top-icon-btn" onClick={toggleSound} title={isPlayingSound ? 'Mute' : 'Play audio'}>
              {isPlayingSound ? <Volume2 size={16} /> : <VolumeX size={16} />}
            </button>
            <span className="feed-counter">{currentIndex + 1} / {reels.length}</span>
          </div>
        </div>

        {/* Main Reel Viewport */}
        <div className="reel-viewport">
          {currentReel.renderScene()}

          {/* Floating Heart Burst */}
          {floatingHearts.map((heart) => (
            <div key={heart.id} className="floating-heart-burst">❤️</div>
          ))}

          {/* Right Action Rail */}
          <div className="reel-action-rail">
            <button className={`reel-btn like-btn ${isLiked ? 'active' : ''}`} onClick={handleLike} title="Like Reel">
              <Heart size={26} fill={isLiked ? '#ff477e' : 'none'} color={isLiked ? '#ff477e' : '#fff'} />
              <span>{likesCount.toLocaleString()}</span>
            </button>

            <button className="reel-btn comment-btn" onClick={() => setShowComments(!showComments)} title="Comments">
              <MessageCircle size={26} color="#fff" />
              <span>{allComments.length}</span>
            </button>

            <button className="reel-btn share-btn" onClick={() => { sound.playClick(); alert('Reel link shared to Panic Labs general channel!'); }} title="Share">
              <Share2 size={24} color="#fff" />
              <span>Share</span>
            </button>

            <div className="audio-disc-spin">
              <Music2 size={14} color="#ffd77f" />
            </div>
          </div>

          {/* Bottom Info Bar */}
          <div className="reel-bottom-info">
            <div className="author-row">
              <span className="author-badge">{currentReel.role}</span>
              <b className="author-name">{currentReel.author}</b>
              <span className="author-handle">{currentReel.handle}</span>
            </div>
            <p className="reel-caption-text">{currentReel.caption}</p>
            <div className="reel-audio-ticker">
              <Music2 size={12} />
              <span>{currentReel.audioTrack}</span>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="reel-nav-buttons">
            <button className="nav-arrow-btn up" onClick={prevReel} title="Previous Reel (Up Arrow)">
              <ChevronUp size={22} />
            </button>
            <button className="nav-arrow-btn down" onClick={nextReel} title="Next Reel (Down Arrow)">
              <ChevronDown size={22} />
            </button>
          </div>

          {/* Comments Slide-over Drawer */}
          {showComments && (
            <div className="reel-comments-overlay" onClick={() => setShowComments(false)}>
              <div className="reel-comments-drawer" onClick={(e) => e.stopPropagation()}>
                <div className="drawer-header">
                  <b>Coworker Banter & Roasts ({allComments.length})</b>
                  <button className="close-drawer-btn" onClick={() => setShowComments(false)}>✕</button>
                </div>
                <div className="comments-list">
                  {allComments.map((c) => (
                    <div key={c.id} className="comment-item">
                      <span className="comment-avatar">{c.avatar}</span>
                      <div className="comment-bubble">
                        <div className="comment-author-bar">
                          <b>{c.author}</b>
                          <small>{c.handle} · {c.time}</small>
                        </div>
                        <p>{c.text}</p>
                      </div>
                      <div className="comment-like-col">
                        <Heart size={14} color="#ff758f" />
                        <small>{c.likes}</small>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="comment-input-bar">
                  <input
                    value={customComment}
                    onChange={(e) => setCustomComment(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') postComment(); }}
                    placeholder="Comment as Founder & CEO..."
                  />
                  <button className="post-btn" onClick={postComment} disabled={!customComment.trim()}>
                    <Send size={15} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
