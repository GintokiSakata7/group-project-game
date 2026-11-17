import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { imageLoadedCache } from '../game/preload';

export type CharacterId = 'kunal' | 'aarav' | 'varun' | 'meera' | 'nikhil' | 'prakash' | 'bunty' | 'founder';
export type Expression = 'neutral' | 'talking' | 'happy' | 'shocked' | 'exhausted' | 'smug';

interface CharacterSpriteProps {
  character: CharacterId;
  expression?: Expression;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  speaking?: boolean;
  className?: string;
  onClick?: () => void;
}

export function CharacterSprite({
  character,
  expression = 'neutral',
  size = 'md',
  speaking = false,
  className = '',
  onClick,
}: CharacterSpriteProps) {
  const pixelSizes = {
    sm: 64,
    md: 110,
    lg: 180,
    xl: 260,
  };

  const dim = pixelSizes[size];

  // Colors per character
  const palettes: Record<CharacterId, { bg: string; accent: string; skin: string; hair: string; shirt: string }> = {
    kunal: { bg: '#fff4cc', accent: '#f59e0b', skin: '#f6d1b1', hair: '#37271e', shirt: '#fbbf24' },
    aarav: { bg: '#dbeafe', accent: '#3b82f6', skin: '#f4cbb0', hair: '#1e293b', shirt: '#38bdf8' },
    varun: { bg: '#f3e8ff', accent: '#a855f7', skin: '#ebbe9e', hair: '#2c1e3d', shirt: '#c084fc' },
    meera: { bg: '#ffe4e6', accent: '#f43f5e', skin: '#fcd5ce', hair: '#4a2828', shirt: '#fb7185' },
    nikhil: { bg: '#f1f5f9', accent: '#64748b', skin: '#e2d5c7', hair: '#1e293b', shirt: '#94a3b8' },
    prakash: { bg: '#fef3c7', accent: '#d97706', skin: '#e5b896', hair: '#44403c', shirt: '#78350f' },
    bunty: { bg: '#e0e7ff', accent: '#6366f1', skin: '#f6d1b1', hair: '#312e81', shirt: '#818cf8' },
    founder: { bg: '#ecfccb', accent: '#84cc16', skin: '#f8d7be', hair: '#292524', shirt: '#a3e635' },
  };

  const p = palettes[character] ?? palettes.founder;

  // Render SVG facial features based on expression and character
  const renderEyes = () => {
    if (expression === 'shocked') {
      return (
        <g fill="#1e293b">
          <circle cx="40" cy="50" r="5" fill="#fff" stroke="#1e293b" strokeWidth="2.5" />
          <circle cx="40" cy="50" r="2.5" fill="#1e293b" />
          <circle cx="60" cy="50" r="5" fill="#fff" stroke="#1e293b" strokeWidth="2.5" />
          <circle cx="60" cy="50" r="2.5" fill="#1e293b" />
          {/* Sweat drop for shocked */}
          <path d="M 69 40 C 69 36, 73 34, 73 34 C 73 34, 77 36, 77 40 C 77 43, 73 45, 69 40 Z" fill="#38bdf8" />
        </g>
      );
    }
    if (expression === 'happy' || expression === 'smug') {
      return (
        <g stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round" fill="none">
          <path d="M 36 50 Q 40 45 44 50" />
          <path d="M 56 50 Q 60 45 64 50" />
          {/* Eyebrows */}
          <path d="M 35 44 Q 40 40 45 43" />
          <path d="M 55 43 Q 60 40 65 44" />
        </g>
      );
    }
    if (expression === 'exhausted') {
      return (
        <g stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round" fill="none">
          <path d="M 36 52 L 44 52" />
          <path d="M 56 52 L 64 52" />
          <path d="M 36 55 Q 40 57 44 55" stroke="#94a3b8" strokeWidth="1.5" />
          <path d="M 56 55 Q 60 57 64 55" stroke="#94a3b8" strokeWidth="1.5" />
          {/* Drooping eyebrows */}
          <path d="M 36 46 L 44 49" />
          <path d="M 56 49 L 64 46" />
        </g>
      );
    }
    // Neutral or Talking
    return (
      <g fill="#1e293b">
        <ellipse cx="40" cy="50" rx="3.5" ry="4" />
        <ellipse cx="60" cy="50" rx="3.5" ry="4" />
        <circle cx="39" cy="48.5" r="1.2" fill="#fff" />
        <circle cx="59" cy="48.5" r="1.2" fill="#fff" />
        {/* Eyebrows */}
        <path d="M 35 43 Q 40 41 45 43" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" fill="none" />
        <path d="M 55 43 Q 60 41 65 43" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" fill="none" />
      </g>
    );
  };

  const renderMouth = () => {
    if (speaking || expression === 'talking') {
      return (
        <motion.path
          d="M 44 63 Q 50 71 56 63 Z"
          fill="#be123c"
          stroke="#1e293b"
          strokeWidth="2"
          animate={{ d: ["M 44 63 Q 50 68 56 63 Z", "M 44 63 Q 50 73 56 63 Z", "M 44 63 Q 50 68 56 63 Z"] }}
          transition={{ duration: 0.35, repeat: Infinity }}
        />
      );
    }
    if (expression === 'happy') {
      return <path d="M 43 62 Q 50 71 57 62" stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round" fill="none" />;
    }
    if (expression === 'smug') {
      return <path d="M 45 64 Q 52 65 58 60" stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round" fill="none" />;
    }
    if (expression === 'shocked') {
      return <ellipse cx="50" cy="65" rx="4" ry="6" fill="#be123c" stroke="#1e293b" strokeWidth="2" />;
    }
    if (expression === 'exhausted') {
      return <path d="M 44 66 Q 50 63 56 66" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" fill="none" />;
    }
    return <path d="M 45 64 Q 50 67 55 64" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" fill="none" />;
  };

  // Character-specific accessories & details
  const renderAccessories = () => {
    switch (character) {
      case 'kunal':
        // Big yellow headphones around neck, party vibe
        return (
          <g>
            <path d="M 28 66 C 28 78, 72 78, 72 66" stroke="#1f2937" strokeWidth="4.5" fill="none" strokeLinecap="round" />
            <rect x="23" y="60" width="8" height="12" rx="3" fill="#f59e0b" stroke="#1f2937" strokeWidth="2" />
            <rect x="69" y="60" width="8" height="12" rx="3" fill="#f59e0b" stroke="#1f2937" strokeWidth="2" />
            {/* Sparkle badge */}
            <circle cx="75" cy="25" r="7" fill="#fbbf24" stroke="#d97706" strokeWidth="1.5" />
            <text x="75" y="28" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#78350f">♫</text>
          </g>
        );
      case 'aarav':
        // Cool cap & vibe coder glasses
        return (
          <g>
            {/* Backward or stylish cap */}
            <path d="M 28 36 Q 50 20 72 36 L 78 40 Q 50 28 22 40 Z" fill="#0284c7" stroke="#0369a1" strokeWidth="2" />
            <path d="M 72 36 Q 84 38 88 44 L 76 43 Z" fill="#0369a1" />
            {/* Glowing screen reflection */}
            <polygon points="32,74 68,74 64,88 36,88" fill="#38bdf8" opacity="0.4" />
          </g>
        );
      case 'varun':
        // Specs/glasses and tie/collar
        return (
          <g>
            {/* Round smart glasses */}
            <circle cx="40" cy="50" r="8" fill="none" stroke="#6b21a8" strokeWidth="2.5" />
            <circle cx="60" cy="50" r="8" fill="none" stroke="#6b21a8" strokeWidth="2.5" />
            <line x1="48" y1="50" x2="52" y2="50" stroke="#6b21a8" strokeWidth="2.5" />
            {/* Whiteboard marker or diagram badge */}
            <rect x="73" y="20" width="16" height="12" rx="2" fill="#e9d5ff" stroke="#9333ea" strokeWidth="1.5" />
            <text x="81" y="29" textAnchor="middle" fontSize="7" fontWeight="bold" fill="#6b21a8">UML</text>
          </g>
        );
      case 'meera':
        // QA Glasses and magnifying glass
        return (
          <g>
            {/* Cat-eye or stylish rectangular QA glasses */}
            <rect x="32" y="44" width="15" height="11" rx="3" fill="none" stroke="#e11d48" strokeWidth="2.5" />
            <rect x="53" y="44" width="15" height="11" rx="3" fill="none" stroke="#e11d48" strokeWidth="2.5" />
            <line x1="47" y1="49" x2="53" y2="49" stroke="#e11d48" strokeWidth="2" />
            {/* Magnifying glass badge */}
            <circle cx="75" cy="25" r="6" fill="#ffe4e6" stroke="#e11d48" strokeWidth="2" />
            <line x1="79" y1="29" x2="84" y2="34" stroke="#e11d48" strokeWidth="2.5" strokeLinecap="round" />
          </g>
        );
      case 'nikhil':
        // Ghostly dark hoodie covering half face, mysterious aura
        return (
          <g>
            {/* Deep hoodie contour */}
            <path d="M 24 45 Q 50 18 76 45 Q 82 70 76 80 L 24 80 Q 18 70 24 45 Z" fill="none" stroke="#475569" strokeWidth="4" />
            {/* "Seen" badge */}
            <rect x="70" y="20" width="22" height="12" rx="3" fill="#cbd5e1" stroke="#64748b" strokeWidth="1" />
            <text x="81" y="29" textAnchor="middle" fontSize="7" fontWeight="bold" fill="#334155">SEEN</text>
          </g>
        );
      case 'prakash':
        // Mustached businessman, phone in hand
        return (
          <g>
            {/* Prominent neat mustache */}
            <path d="M 42 59 Q 47 57 50 59 Q 53 57 58 59 Q 54 63 50 61 Q 46 63 42 59 Z" fill="#292524" />
            {/* Suit collar & tie */}
            <polygon points="45,74 55,74 52,90 48,90" fill="#dc2626" />
            <polygon points="35,74 45,74 47,82 32,82" fill="#f8fafc" />
            <polygon points="65,74 55,74 53,82 68,82" fill="#f8fafc" />
          </g>
        );
      case 'bunty':
        // Modern Gen-Z backwards cap, sunglasses up on forehead, neon colors
        return (
          <g>
            {/* Sunglasses pushed up on forehead */}
            <rect x="34" y="32" width="13" height="7" rx="2" fill="#1e1b4b" stroke="#6366f1" strokeWidth="1.5" />
            <rect x="53" y="32" width="13" height="7" rx="2" fill="#1e1b4b" stroke="#6366f1" strokeWidth="1.5" />
            <line x1="47" y1="35" x2="53" y2="35" stroke="#6366f1" strokeWidth="2" />
            {/* Phone badge */}
            <rect x="73" y="20" width="12" height="18" rx="2" fill="#312e81" stroke="#818cf8" strokeWidth="1.5" />
            <circle cx="79" cy="34" r="1.5" fill="#a5b4fc" />
          </g>
        );
      default:
        return null;
    }
  };

  const isRasterCharacter = (['kunal', 'aarav', 'varun', 'meera', 'nikhil', 'prakash'] as CharacterId[]).includes(character);
  const imageSrc = isRasterCharacter ? `/assets/characters/${character}.webp` : null;

  const [isLoaded, setIsLoaded] = useState(() => (imageSrc ? imageLoadedCache.has(imageSrc) : false));
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!imageSrc) return;
    if (imageLoadedCache.has(imageSrc)) {
      setIsLoaded(true);
      return;
    }
    const img = new Image();
    img.decoding = 'async';
    img.onload = () => {
      imageLoadedCache.add(imageSrc);
      setIsLoaded(true);
    };
    img.onerror = () => {
      setHasError(true);
    };
    img.src = imageSrc;
    if (img.complete && img.naturalWidth > 0) {
      imageLoadedCache.add(imageSrc);
      setIsLoaded(true);
    }
  }, [imageSrc]);

  const showRasterImage = isRasterCharacter && (isLoaded || (imageSrc ? imageLoadedCache.has(imageSrc) : false)) && !hasError;

  const renderSvgAvatar = () => (
    <svg viewBox="0 0 100 100" width="100%" height="100%" className="overflow-visible select-none character-vector-avatar">
      <circle cx="50" cy="50" r="46" fill={p.bg} stroke={p.accent} strokeWidth="3.5" />
      <ellipse cx="50" cy="92" rx="32" ry="6" fill="#000000" opacity="0.1" />
      <path d="M 22 94 C 22 75, 32 72, 50 72 C 68 72, 78 75, 78 94 Z" fill={p.shirt} stroke="#1e293b" strokeWidth="3" />
      <rect x="44" y="62" width="12" height="14" fill={p.skin} />
      <ellipse cx="50" cy="52" rx="23" ry="24" fill={p.skin} stroke="#1e293b" strokeWidth="3" />
      <circle cx="26" cy="53" r="4.5" fill={p.skin} stroke="#1e293b" strokeWidth="2" />
      <circle cx="74" cy="53" r="4.5" fill={p.skin} stroke="#1e293b" strokeWidth="2" />
      {character === 'meera' ? (
        <path d="M 25 55 C 23 35, 34 26, 50 26 C 66 26, 77 35, 75 55 C 73 42, 68 34, 50 34 C 32 34, 27 42, 25 55 Z" fill={p.hair} stroke="#1e293b" strokeWidth="3" />
      ) : character === 'nikhil' ? (
        <path d="M 26 50 C 25 32, 35 24, 50 24 C 65 24, 75 32, 74 50 C 72 35, 65 29, 50 29 C 35 29, 28 35, 26 50 Z" fill={p.hair} stroke="#1e293b" strokeWidth="3" />
      ) : (
        <path d="M 26 48 C 24 30, 36 24, 50 24 C 64 24, 76 30, 74 48 C 70 34, 62 30, 50 30 C 38 30, 30 34, 26 48 Z" fill={p.hair} stroke="#1e293b" strokeWidth="3" />
      )}
      {renderEyes()}
      <path d="M 49 55 L 50 57 L 48 58" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" fill="none" />
      {renderMouth()}
      {renderAccessories()}
    </svg>
  );

  return (
    <motion.div
      className={`character-sprite character-${character} ${className}`}
      style={{ width: dim, height: dim, cursor: onClick ? 'pointer' : 'default' }}
      whileHover={onClick ? { scale: 1.05 } : undefined}
      whileTap={onClick ? { scale: 0.96 } : undefined}
      animate={{
        y: speaking ? [0, -4, 0] : [0, -2, 0],
      }}
      transition={{
        duration: speaking ? 0.4 : 3,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      onClick={onClick}
    >
      {isRasterCharacter ? (
        <div className="character-raster-container">
          <div
            className="character-fallback-base"
            style={{
              opacity: showRasterImage ? 0 : 1,
              transition: 'opacity 0.25s ease-out',
            }}
          >
            {renderSvgAvatar()}
          </div>
          {!hasError && (
            <img
              className={`character-portrait-image expression-${expression}`}
              src={imageSrc!}
              alt={`${character} character portrait`}
              draggable={false}
              loading="eager"
              decoding="async"
              style={{
                opacity: showRasterImage ? 1 : 0,
                transition: 'opacity 0.25s ease-in',
              }}
              onLoad={() => {
                if (imageSrc) imageLoadedCache.add(imageSrc);
                setIsLoaded(true);
              }}
              onError={() => {
                setHasError(true);
              }}
            />
          )}
        </div>
      ) : (
        renderSvgAvatar()
      )}
    </motion.div>
  );
}

