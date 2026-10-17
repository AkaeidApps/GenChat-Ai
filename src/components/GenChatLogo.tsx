import React from 'react';

interface GenChatLogoProps {
  size?: number | string;
  className?: string;
  showText?: boolean;
  showTagline?: boolean;
}

export const GenChatLogo: React.FC<GenChatLogoProps> = ({
  size = 32,
  className = '',
  showText = false,
  showTagline = false,
}) => {
  const iconSize = typeof size === 'number' ? size : 32;

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      {/* GenChat Neon G Robot Emblem */}
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-transform duration-200 hover:scale-105"
      >
        <defs>
          {/* Main G Bubble Gradient */}
          <linearGradient id="genchatGradient" x1="15%" y1="10%" x2="85%" y2="90%">
            <stop offset="0%" stopColor="#00E5FF" />
            <stop offset="30%" stopColor="#0091FF" />
            <stop offset="70%" stopColor="#7C3AED" />
            <stop offset="100%" stopColor="#C026D3" />
          </linearGradient>

          {/* Eye Cyan Glow */}
          <filter id="eyeGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="1.5" result="glow" />
            <feComposite in="SourceGraphic" in2="glow" operator="over" />
          </filter>

          {/* Sparkle Pink Gradient */}
          <linearGradient id="sparkleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F472B6" />
            <stop offset="100%" stopColor="#A855F7" />
          </linearGradient>

          {/* Text Gradient for 'Chat' */}
          <linearGradient id="chatTextGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00E5FF" />
            <stop offset="50%" stopColor="#818CF8" />
            <stop offset="100%" stopColor="#C084FC" />
          </linearGradient>

          {/* Subtle Outer Glow */}
          <filter id="logoGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0   0 0 0 0 0.8   0 0 0 0 1  0 0 0 0.25 0"
            />
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Glow backdrop */}
        <g filter="url(#logoGlow)">
          {/* Outer Stylized "G" with Speech Bubble Tail */}
          <path
            d="M 68 22
               C 56 12, 38 13, 26 23
               C 13 35, 12 53, 19 67
               L 14 77
               C 13 79, 15 81, 17 80
               L 28 76
               C 35 83, 46 86, 56 85
               C 72 83, 85 70, 85 53
               C 85 45, 80 40, 74 40
               C 68 40, 64 45, 64 51
               C 64 61, 56 68, 47 68
               C 37 68, 29 60, 29 50
               C 29 38, 38 30, 50 30
               C 56 30, 62 33, 67 38
               C 70 41, 75 41, 78 38
               C 81 35, 80 30, 77 27
               Z"
            fill="url(#genchatGradient)"
          />

          {/* Inner Friendly Robot Face Silhouette */}
          <circle cx="50" cy="49" r="18" fill="#0B0F19" />

          {/* Cute Curved Glowing Cyan Eyes */}
          <g filter="url(#eyeGlow)" stroke="#00F0FF" strokeWidth="2.8" strokeLinecap="round" fill="none">
            {/* Left Eye (Happy Curve) */}
            <path d="M 40 47 Q 44.5 42 49 47" />
            {/* Right Eye (Happy Curve) */}
            <path d="M 52 47 Q 56.5 42 61 47" />
          </g>

          {/* Top Right Star Sparkle 1 (Large) */}
          <path
            d="M 83 20 Q 83 25 87 25 Q 83 25 83 30 Q 83 25 79 25 Q 83 25 83 20 Z"
            fill="url(#sparkleGrad)"
          />

          {/* Top Right Star Sparkle 2 (Small) */}
          <path
            d="M 89 31 Q 89 34 91.5 34 Q 89 34 89 37 Q 89 34 86.5 34 Q 89 34 89 31 Z"
            fill="url(#sparkleGrad)"
            opacity="0.9"
          />
        </g>
      </svg>

      {/* Optional Wordmark and Tagline */}
      {showText && (
        <div className="flex flex-col select-none">
          <div className="flex items-center text-xl font-bold tracking-tight">
            <span className="text-[var(--text-primary)]">Gen</span>
            <span
              style={{
                background: 'linear-gradient(90deg, #00E5FF 0%, #818CF8 50%, #C084FC 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Chat
            </span>
          </div>
          {showTagline && (
            <div className="flex items-center gap-1.5 text-[10px] font-medium tracking-widest uppercase text-[var(--text-muted)] mt-0.5">
              <span>Think</span>
              <span className="text-[#00E5FF]">•</span>
              <span>Chat</span>
              <span className="text-[#A855F7]">•</span>
              <span>Create</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
